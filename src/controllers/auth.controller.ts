import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { BadRequestException } from "../errors/bad_request.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { NotFoundException } from "../errors/not_found.excpetion";
import { RegisterSchema, UpdateUserSchema } from "../schemas/user";
import { Address } from "@prisma/client";

const register = async (req: Request, res: Response, next: NextFunction) => {
  RegisterSchema.parse(req.body);
  const { email, password, name } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    next(
      new BadRequestException(
        "User already exists",
        ErrorCode.USER_ALREADY_EXIST
      )
    );
  }
  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });

  const token = jwt.sign({ user_id: user.id }, JWT_SECRET);

  res.json({ user, token });
};
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException(
      `User doesn't exists`,
      ErrorCode.USER_NOT_FOUND
    );
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }
  const token = jwt.sign({ user_id: user.id }, JWT_SECRET);

  res.json({ user, token });
};
const profile = async (req: any, res: Response) => {
  res.json(req.user);
};

const updateProfile = async (req: any, res: Response) => {
  const validation = (await UpdateUserSchema.parse(req.body)) as any;
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validation.defaultShippinAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: { id: validation.defaultShippinAddress },
      });
    } catch (err) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.PRODUCT_NOT_FOUNT
      );
    }
    if (shippingAddress.userId != req.user.id) {
      throw new BadRequestException(
        "Address does not belong to the user",
        ErrorCode.UNPROCESSABLE
      );
    }
  }

  if (validation.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: { id: validation.defaultBillingAddress },
      });
    } catch (err) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.PRODUCT_NOT_FOUNT
      );
    }
    if (billingAddress.userId != req.user.id) {
      throw new BadRequestException(
        "Address does not belong to the user",
        ErrorCode.UNPROCESSABLE
      );
    }
  }
  const updateUser = await prismaClient.user.update({
    where: {
      id: req.user.id,
    },
    data: validation,
  });

  res.json(updateUser);
};

export { login, register, profile, updateProfile };
