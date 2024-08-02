import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { Role } from "../constants/index.constants";
import { ChangePasswordSchema, CreatBannerSchema } from "../schemas/admin";

const listUser = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.user.count({
    where: {
      role: req.query.role ? String(req.query.role) : Role.user,
    },
  });
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;

  const search = String(req.query.search);
  const role = req.query.role ? String(req.query.role) : Role.user;
  let whereClause = {};
  if (req.query.search) {
    whereClause = { name: { search }, email: { search } };
  }
  if (req.query.role) {
    whereClause = { ...whereClause, role };
  }

  const users = await prismaClient.user.findMany({
    orderBy: { created_at: "desc" },
    skip: startIndex,
    take: Number(limit),
    where: whereClause,
    select: {
      id: true,
      password: false,
      addresss: false,
      name: true,
      phone: true,
      email: true,
      role: true,
      image_url: true,
    },
  });
  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
    data: users,
  });
};

const getUserByID = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      select: {
        id: true,
        password: false,
        name: true,
        email: true,
        role: true,
        image_url: true,
        addresss: true,
      },
    });
    res.json({ message: true, data: users });
  } catch (err) {
    throw new NotFoundException(false, "User not found", ErrorCode.NOT_FOUNT);
  }
};

const changeUserRole = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        role: req.body.role,
      },
      select: {
        id: true,
        password: false,
        addresss: false,
        name: true,
        email: true,
        role: true,
        image_url: true,
      },
    });
    res.json({ message: true, dat: users });
  } catch (err) {
    throw new NotFoundException(false, "User not found", ErrorCode.NOT_FOUNT);
  }
};
const changePassword = async (req: Request, res: Response) => {
  ChangePasswordSchema.parse(req.body);
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.body.user_id,
      },
    });
    if (user.password != req.body.current_password) {
      throw new NotFoundException(
        false,
        "Current password is incorrect",
        ErrorCode.UNPROCESSABLE
      );
    }
    if (user.password == req.body.new_password) {
      throw new NotFoundException(
        false,
        "New password is same as old password",
        ErrorCode.UNPROCESSABLE
      );
    }
    await prismaClient.user.update({
      where: {
        id: +req.body.user_id,
      },
      data: {
        password: req.body.new_password,
      },
    });
    res.json({ message: true, data: "Change Password Successfully!" });
  } catch (err) {
    throw new NotFoundException(false, "User not found", ErrorCode.NOT_FOUNT);
  }
};

const createBanner = async (req: Request, res: Response) => {
  CreatBannerSchema.parse(req.body);
  try {
    const banner = await prismaClient.banner.create({
      data: req.body,
    });
    res.json({ message: true, data: banner });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Banner not created",
      ErrorCode.INTERNAL_ERROR
    );
  }
};
const listBanner = async (req: Request, res: Response) => {
  const banners = await prismaClient.banner.findMany();
  res.json({ message: true, data: banners });
};
const updateBanner = async (req: Request, res: Response) => {
  CreatBannerSchema.parse(req.body);
  try {
    const banner = await prismaClient.banner.update({
      where: {
        id: +req.params.id,
      },
      data: req.body,
    });
    res.json({ message: true, data: banner });
  } catch (err) {
    throw new NotFoundException(false, "Banner not found", ErrorCode.NOT_FOUNT);
  }
};
const deleteBanner = async (req: Request, res: Response) => {
  try {
    await prismaClient.banner.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ message: true, data: "Delete Banner Successfully!" });
  } catch (err) {
    throw new NotFoundException(false, "Banner not found", ErrorCode.NOT_FOUNT);
  }
};
const updateBestSalling = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
    });
    if (product) {
      await prismaClient.product.update({
        where: {
          id: +req.params.id,
        },
        data: {
          is_best_salling: true,
        },
      });
      res.json({
        message: true,
        data: !product.is_best_salling
          ? "Add to best salling successfully!"
          : "Remove from best salling successfully!",
      });
    }
  } catch (err) {
    throw new NotFoundException(
      false,
      "Product not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

const updatedFeatureShop = async (req: Request, res: Response) => {
  try {
    const shop = await prismaClient.shop.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
    });
    if (shop) {
      await prismaClient.shop.update({
        where: {
          id: +req.params.id,
        },
        data: {
          is_features_shop: true,
        },
      });
      res.json({
        message: true,
        data: !shop.is_features_shop
          ? "Add to features shop successfully!"
          : "Remove from features shop successfully!",
      });
    }
  } catch (err) {
    throw new NotFoundException(false, "Shop not found", ErrorCode.NOT_FOUNT);
  }
};

const listProvices = async (req: Request, res: Response) => {
  const provinces = await prismaClient.province.findMany();
  res.json({ message: true, data: { provinces } });
};

const createProvice = async (req: Request, res: Response) => {
  try {
    await prismaClient.province.create({
      data: req.body,
    });
    res.json({ message: true, data: "Provice create succcefully" });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Province not created",
      ErrorCode.INTERNAL_ERROR
    );
  }
};

const updateProvice = async (req: Request, res: Response) => {
  try {
    await prismaClient.province.update({
      where: {
        id: +req.params.id,
      },
      data: req.body,
    });
    res.json({ message: true, data: "Provice update succefully" });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Province not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

const deleteProvice = async (req: Request, res: Response) => {
  try {
    await prismaClient.province.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ message: true, data: "Delete Province Successfully!" });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Province not found",
      ErrorCode.NOT_FOUNT
    );
  }
};

export {
  listUser,
  getUserByID,
  changeUserRole,
  changePassword,
  createBanner,
  listBanner,
  updateBanner,
  deleteBanner,
  updateBestSalling,
  updatedFeatureShop,
  listProvices,
  createProvice,
  updateProvice,
  deleteProvice,
};
