import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { OrderStatus } from "../constants/index.constants";
import { CreatOrderSchema } from "../schemas/order";
import { OrderProduct } from "@prisma/client";

const createOrder = async (req: Request, res: Response) => {
  CreatOrderSchema.parse(req.body);
  const { product, addressId, paymentId } = req.body;
  // fetch addresss
  const address = await prismaClient.address.findFirst({
    where: {
      id: addressId,
    },
  });
  //fetch payment methods
  const payment = await prismaClient.paymentMethod.findFirst({
    where: {
      id: paymentId,
    },
  });
  // check if address & payment have
  if (address && payment) {
    //check if product have
    if (product.length > 0) {
      //check if product id have
      for (let item of product) {
        const findProduct = await prismaClient.product.findFirst({
          where: {
            id: item.id,
          },
        });
        if (findProduct == null) {
          throw new NotFoundException(
            false,
            "Product Not Found",
            ErrorCode.NOT_FOUNT
          );
        }
      }
      const order = await prismaClient.order.create({
        data: {
          userId: req.user.id,
          addressId: address.id,
          paymentId: payment?.id,
          total_item: product.length,
          remarks: req.body.remarks ?? null,
        },
      });
      // caculate sub total of the product with qty
      const orderProducts: OrderProduct[] = [];
      for (let item of product) {
        const findProduct = await prismaClient.product.findFirst({
          where: {
            id: item.id,
          },
        });
        let sub_total = findProduct ? +findProduct.price * item.quantity : 1;
        let sub_total_discount;
        if (findProduct?.discount) {
          sub_total_discount = findProduct
            ? ((+findProduct.price * findProduct.discount) / 100) *
              item.quantity
            : 1;
        }
        let _product: any = {
          orderId: order.id,
          productId: +item.id,
          quantity: +item.quantity,
          sub_total: sub_total.toFixed(2),
          sub_total_discount: sub_total_discount?.toFixed(2),
          noted: item.noted ?? null,
        };
        orderProducts.push(_product);
      }
      //create oder product
      await prismaClient.orderProduct.createMany({
        data: orderProducts,
      });
      //caculate total of the products order
      let total = 0;
      let total_discount = 0;
      orderProducts.map((item) => {
        total += parseFloat(item.sub_total ? item.sub_total.toString() : "1");
        total_discount += parseFloat(
          item.sub_total_discount ? item.sub_total_discount.toString() : "1"
        );
      });
      // update order with total
      await prismaClient.order.update({
        where: {
          id: order.id,
        },
        data: {
          total: (total - total_discount).toFixed(2),
          sub_total: total.toFixed(2),
          total_discount: total_discount.toFixed(2),
        },
      });
      await prismaClient.orderEvent.create({
        data: {
          orderId: +order.id,
        },
      });
      res.json({ messsage: true, data: "Product orders successfully!" });
    } else {
      throw new NotFoundException(
        false,
        "Product is Empty",
        ErrorCode.NOT_FOUNT
      );
    }
  } else {
    throw new NotFoundException(
      false,
      address == null && payment == null
        ? "Address & Payment Method Not Found!"
        : address == null
        ? "Address Not Found"
        : "Payment Method Not Found",
      ErrorCode.NOT_FOUNT
    );
  }
};
const listOder = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.order.count();
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;

  const search = String(req.query.search);
  const userId = +req.user.id;
  let whereClause = {};

  if (req.query.search) {
    whereClause = { invoice_no: { search } };
  }
  if (userId) {
    whereClause = { ...whereClause, userId };
  }
  if (req.query.status) {
    whereClause = {
      ...whereClause,
      status: +req.query.status,
    };
  }

  const order = await prismaClient.order.findMany({
    skip: startIndex,
    take: Number(limit),
    where: whereClause,
  });

  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
    data: order,
  });
};
const cancelStatus = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: OrderStatus.CANCEL,
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: +req.params.id,
        status: OrderStatus.CANCEL,
      },
    });
    res.json({ message: true, data: order });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Product not found",
      ErrorCode.NOT_FOUNT
    );
  }
};
const listOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        user: true,
        address: true,
        payment_method: true,
        product_data: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json({ message: true, data: order });
  } catch (err) {
    throw new NotFoundException(false, "Order not found", ErrorCode.NOT_FOUNT);
  }
};

export { createOrder, listOder, cancelStatus, listOrderById };
