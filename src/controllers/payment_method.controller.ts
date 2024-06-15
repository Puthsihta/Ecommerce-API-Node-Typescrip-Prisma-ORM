import { Request, Response } from "express";
import { prismaClient } from "../index";
import { PaymentMethodSchema } from "../schemas/payment_method";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
const creatPaymentMethod = async (req: Request, res: Response) => {
  PaymentMethodSchema.parse(req.body);
  await prismaClient.paymentMethod.create({
    data: {
      user_id: req.user.id,
      ...req.body,
    },
  });
  res.json({ message: true, data: "Create Payment Method Successfully!" });
};
const listPaymentMethod = async (req: Request, res: Response) => {
  const search = String(req.query.search);
  let whereClause = {};
  if (req.query.search) {
    whereClause = { name: { search }, description: { search } };
  }
  const paymentMethod = await prismaClient.paymentMethod.findMany({
    where: whereClause,
  });
  res.json({ message: true, data: paymentMethod });
};
const updatePaymentMethod = async (req: Request, res: Response) => {
  try {
    PaymentMethodSchema.parse(req.body);
    await prismaClient.paymentMethod.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
      },
    });
    res.json({ message: true, data: "Update Payment Method Successfully!" });
  } catch (error) {
    throw new NotFoundException(
      false,
      "Payment method not found",
      ErrorCode.NOT_FOUNT
    );
  }
};
const deletePaymentMethod = async (req: Request, res: Response) => {
  try {
    await prismaClient.paymentMethod.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ message: true, data: "Delete Payment Method Successfully!" });
  } catch (error) {
    throw new NotFoundException(
      false,
      "Payment method not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

export {
  creatPaymentMethod,
  listPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
