import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { CreatProductchema } from "../schemas/product";
import { Product } from "@prisma/client";
const createProduct = async (req: Request, res: Response) => {
  CreatProductchema.parse(req.body);
  //check category
  const category = await prismaClient.category.findFirst({
    where: {
      id: +req.body.cate_id,
    },
  });
  //check subcategory
  let sub_category;
  if (req.body.sub_cate_id) {
    sub_category = await prismaClient.subCategory.findFirst({
      where: {
        id: +req.body.sub_cate_id,
      },
    });
  }
  //check shop
  let shop;
  if (req.body.shop_id) {
    shop = await prismaClient.shop.findFirst({
      where: {
        id: +req.body.shop_id,
      },
    });
  }
  if (shop == null) {
    throw new NotFoundException(false, "Shop not found", ErrorCode.NOT_FOUNT);
  }
  if (category) {
    if (req.body.sub_cate_id) {
      if (sub_category == null) {
        throw new NotFoundException(
          false,
          "Sub Category not found",
          ErrorCode.NOT_FOUNT
        );
      }
    }
    try {
      await prismaClient.product.create({
        data: {
          ...req.body,
        },
      });
      res.json({ message: true, data: "Product create successfully" });
    } catch (error) {
      console.log("error create product : ", error);
    }
  } else {
    throw new NotFoundException(
      false,
      "Category not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

const listProduct = async (req: Request, res: Response) => {
  const search = String(req.query.search);
  const shopId = Number(req.query.shop_id);
  const cateId = Number(req.query.cate_id);
  const subCateId = Number(req.query.sub_cate_id);
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = req.query.shop_id
    ? await prismaClient.product.count({ where: { shop_id: shopId } })
    : req.query.cate_id
    ? await prismaClient.product.count({ where: { cate_id: cateId } })
    : req.query.sub_cate_id
    ? await prismaClient.product.count({ where: { sub_cate_id: subCateId } })
    : await prismaClient.product.count();
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;
  var products = await prismaClient.product.findMany({
    orderBy: { created_at: "desc" },
    skip: startIndex,
    take: Number(limit),
    where: {
      name: { contains: search },
    },
  });
  if (req.query.shop_id) {
    products = await prismaClient.product.findMany({
      orderBy: { created_at: "desc" },
      skip: startIndex,
      take: Number(limit),
      where: {
        shop_id: shopId,
        name: { contains: search },
      },
    });
  }
  if (req.query.cate_id) {
    products = await prismaClient.product.findMany({
      orderBy: { created_at: "desc" },
      skip: startIndex,
      take: Number(limit),
      where: {
        cate_id: cateId,
        name: { contains: search },
      },
    });
  }
  if (req.query.sub_cate_id) {
    products = await prismaClient.product.findMany({
      orderBy: { created_at: "desc" },
      skip: startIndex,
      take: Number(limit),
      where: {
        sub_cate_id: subCateId,
        name: { contains: search },
      },
    });
  }
  res.json({
    message: true,
    pagination: { limit: limit, currentPage, totalPage, total: totalCount },
    data: products,
  });
};

const listProductByID = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: { id: +req.params.id },
      include: {
        shop: {
          include: {
            address: true,
          },
        },
      },
    });
    const relate_product = await prismaClient.product.findMany({
      where: { shop_id: product.shop_id },
      take: 10,
    });
    let final_relate_product: Product[] = [];
    if (relate_product.length > 0) {
      final_relate_product = relate_product.filter(
        (item) => item.id !== product.id
      );
    }
    res.json({
      message: true,
      data: { product, relate_product: final_relate_product },
    });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Product not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    // CreatProductchema.parse(req.body);
    const product = req.body;
    await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });
    res.json({ message: true, data: "Update Product Successfully!" });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Product not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prismaClient.product.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ message: true, data: "Product deleted successfully" });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Product not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

const favoriteProduct = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: { id: +req.params.id },
    });
    await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: {
        is_favorite: !product.is_favorite,
      },
    });
    res.json({
      message: true,
      data: product.is_favorite
        ? "UnFavorite Successfully"
        : "Favorite Successfully",
    });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Product not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

const listFavoritesProduct = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.product.count({
    where: {
      is_favorite: true,
    },
  });
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;

  const products = await prismaClient.product.findMany({
    orderBy: { created_at: "desc" },
    skip: startIndex,
    take: Number(limit),
    where: {
      is_favorite: true,
    },
  });
  res.json({
    message: true,
    pagination: { limit: limit, currentPage, totalPage, total: totalCount },
    data: products,
  });
};

export {
  createProduct,
  listProduct,
  listProductByID,
  updateProduct,
  deleteProduct,
  favoriteProduct,
  listFavoritesProduct,
};
