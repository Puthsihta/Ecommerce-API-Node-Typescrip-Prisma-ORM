import { Request, Response } from "express";
import { prismaClient } from "../index";
import {
  CreatCategorySchema,
  CreatSubCategorySchema,
} from "../schemas/category";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";

const creatCategory = async (req: Request, res: Response) => {
  CreatCategorySchema.parse(req.body);
  await prismaClient.category.create({
    data: {
      ...req.body,
    },
  });
  res.json({ message: true, data: "Create category successfully!" });
};
const listCategory = async (req: Request, res: Response) => {
  const search = String(req.query.search);
  let whereClause = {};
  if (req.query.search) {
    whereClause = { name: { search }, description: { search } };
  }
  const category = await prismaClient.category.findMany({
    where: whereClause,
  });
  res.json({ message: true, data: category });
};
const updateCategory = async (req: Request, res: Response) => {
  CreatCategorySchema.parse(req.body);
  try {
    await prismaClient.category.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
      },
    });
    res.json({ message: true, data: "Create category successfully!" });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Category not found",
      ErrorCode.NOT_FOUNT
    );
  }
};
const deleteCategory = async (req: Request, res: Response) => {
  try {
    await prismaClient.category.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ message: true, data: "Delete category successfully!" });
  } catch (error) {
    throw new NotFoundException(
      false,
      "Category not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

const creatSubCategory = async (req: Request, res: Response) => {
  CreatSubCategorySchema.parse(req.body);
  const category = await prismaClient.category.findFirst({
    where: {
      id: +req.body.cate_id,
    },
  });
  if (category) {
    await prismaClient.subCategory.create({
      data: {
        ...req.body,
      },
    });
    res.json({ message: true, data: "Create category successfully!" });
  } else {
    throw new NotFoundException(
      false,
      "Category not found",
      ErrorCode.NOT_FOUNT
    );
  }
};
const listSubCategory = async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search);
    const cate_id = Number(req.query.cate_id);
    let whereClause = {};
    if (req.query.search) {
      whereClause = { name: { search }, description: { search } };
    }
    if (cate_id) {
      whereClause = { ...whereClause, cate_id };
    }
    const category = await prismaClient.subCategory.findMany({
      where: whereClause,
    });
    res.json({ message: true, data: category });
  } catch (err) {
    throw new NotFoundException(false, "Require cate_id", ErrorCode.NOT_FOUNT);
  }
};
const updateSubCategory = async (req: Request, res: Response) => {
  CreatSubCategorySchema.parse(req.body);
  try {
    const category = await prismaClient.category.findFirst({
      where: {
        id: +req.body.cate_id,
      },
    });
    if (category) {
      await prismaClient.subCategory.update({
        where: {
          id: +req.params.id,
        },
        data: {
          ...req.body,
        },
      });
      res.json({ message: true, data: "Create category successfully!" });
    } else {
      throw new NotFoundException(
        false,
        "Category not found",
        ErrorCode.NOT_FOUNT
      );
    }
  } catch (err) {
    throw new NotFoundException(
      false,
      "Sub Category not found",
      ErrorCode.NOT_FOUNT
    );
  }
};
const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    await prismaClient.subCategory.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ message: true, data: "Delete subcategory successfully!" });
  } catch (error) {
    throw new NotFoundException(
      false,
      "Category not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

export {
  creatCategory,
  listCategory,
  updateCategory,
  deleteCategory,
  creatSubCategory,
  listSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
