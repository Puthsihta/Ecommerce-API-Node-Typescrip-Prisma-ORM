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
import { Role } from "../constants/index.constants";

const register = async (req: Request, res: Response, next: NextFunction) => {
  RegisterSchema.parse(req.body);
  const { email, password, name, role } = req.body;
  let user = await prismaClient.user.findFirst({
    where: { email },
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
  if (user) {
    next(
      new BadRequestException(
        false,
        "User already exists",
        ErrorCode.USER_ALREADY_EXIST
      )
    );
  }
  user = await prismaClient.user.create({
    data: {
      name,
      email,
      role,
      password: hashSync(password, 10),
    },
  });
  const token = jwt.sign({ user_id: user.id }, JWT_SECRET);
  let respone = await prismaClient.user.findFirst({
    where: { email },
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
  res.json({ message: true, token, data: respone });
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: { email },
  });
  if (!user) {
    throw new NotFoundException(
      false,
      `User doesn't exists`,
      ErrorCode.NOT_FOUNT
    );
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      false,
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }
  if (user.role !== Role.user) {
    throw new BadRequestException(
      false,
      "This is an admin account! Not a user account!",
      ErrorCode.UNPROCESSABLE
    );
  }
  let respone = await prismaClient.user.findFirst({
    where: { email },
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
  const token = jwt.sign({ user_id: user.id }, JWT_SECRET);

  res.json({ message: true, token, data: respone });
};
const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException(
      false,
      `User doesn't exists`,
      ErrorCode.NOT_FOUNT
    );
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      false,
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }
  if (user.role !== Role.admin) {
    throw new BadRequestException(
      false,
      "This is a user account! Not an admin account!",
      ErrorCode.UNPROCESSABLE
    );
  }
  let respone = await prismaClient.user.findFirst({
    where: { email },
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
  const token = jwt.sign({ user_id: user.id }, JWT_SECRET);

  res.json({ message: true, token, data: respone });
};
const profile = async (req: Request, res: Response) => {
  let respone = await prismaClient.user.findFirst({
    where: { email: req.params.email },
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
  res.json({ message: true, data: respone });
};

const updateProfile = async (req: Request, res: Response) => {
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
        false,
        "Address not found",
        ErrorCode.NOT_FOUNT
      );
    }
    if (shippingAddress.userId != req.user.id) {
      throw new BadRequestException(
        false,
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
        false,
        "Address not found",
        ErrorCode.NOT_FOUNT
      );
    }
    if (billingAddress.userId != req.user.id) {
      throw new BadRequestException(
        false,
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

  res.json({ mesage: true, data: updateUser });
};

export { loginUser, loginAdmin, register, profile, updateProfile };
