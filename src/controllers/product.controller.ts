import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { CreatProductchema } from "../schemas/product";

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
  if (category) {
    if (req.body.sub_cate_id) {
      if (sub_category == null) {
        throw new NotFoundException(
          false,
          "Sub Category no found",
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
      "Category no found",
      ErrorCode.NOT_FOUNT
    );
  }
};

const listProduct = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.product.count();
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;

  const search = String(req.query.search);
  let whereClause = {};
  if (req.query.search) {
    whereClause = { name: { search }, description: { search } };
  }

  const products = await prismaClient.product.findMany({
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
    data: products,
  });
};

const listProductByID = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: { id: +req.params.id },
    });
    res.json({ message: true, data: product });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Product not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

const updateProduct = async (req: Request, res: Response) => {
  CreatProductchema.parse(req.body);
  try {
    CreatProductchema.parse(req.body);
    //check category
    const category = await prismaClient.category.findFirst({
      where: {
        id: +req.body.cate_id,
      },
    });
    //check subcategory
    const sub_category = await prismaClient.subCategory.findFirst({
      where: {
        id: +req.body.sub_cate_id,
      },
    });
    if (category && sub_category) {
      const product = req.body;
      await prismaClient.product.update({
        where: {
          id: +req.params.id,
        },
        data: product,
      });
      res.json({ message: true, data: "Update Product Successfully!" });
    } else {
      throw new NotFoundException(
        false,
        category == null && sub_category == null
          ? "Category and Subcategory not found"
          : category == null
          ? "Category no found"
          : "Subcategory not found",
        ErrorCode.NOT_FOUNT
      );
    }
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
    skip: startIndex,
    take: Number(limit),
    where: {
      is_favorite: true,
    },
  });
  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
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
