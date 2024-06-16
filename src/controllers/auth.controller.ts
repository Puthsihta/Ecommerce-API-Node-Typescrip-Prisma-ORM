import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { BadRequestException } from "../errors/bad_request.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { NotFoundException } from "../errors/not_found.excpetion";
import {
  RegisterSchema,
  sentSmsSchema,
  UpdateUserSchema,
  verifyOtpSchema,
} from "../schemas/user";
import { Role } from "../constants/index.constants";
import { ramdomOtpCodes } from "../utils/index.util";

const register = async (req: Request, res: Response, next: NextFunction) => {
  RegisterSchema.parse(req.body);
  const { email, password, name, phone, role, image_url } = req.body;
  let user = await prismaClient.user.findFirst({
    where: { email },
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
  if (user) {
    next(
      new BadRequestException(
        false,
        "Admin already exists",
        ErrorCode.USER_ALREADY_EXIST
      )
    );
  }
  user = await prismaClient.user.create({
    data: {
      name,
      email,
      phone,
      role,
      image_url,
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
  if (!compareSync(password, String(user?.password))) {
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
    where: { id: req.user.id },
    select: {
      id: true,
      password: false,
      name: true,
      email: true,
      role: true,
      image_url: true,
    },
  });
  res.json({ message: true, data: respone });
};

const updateProfile = async (req: Request, res: Response) => {
  const validation = (await UpdateUserSchema.parse(req.body)) as any;
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
const sentSms = async (req: Request, res: Response) => {
  sentSmsSchema.parse(req.body);
  const { phone, is_debug } = req.body;
  let user = await prismaClient.user.findFirst({
    where: { phone },
  });
  let otp_code = ramdomOtpCodes();
  if (user) {
    await prismaClient.user.update({
      where: { phone },
      data: {
        phone,
        otp_code: otp_code.toString(),
      },
    });
  } else {
    await prismaClient.user.create({
      data: {
        phone,
        otp_code: otp_code.toString(),
      },
    });
  }
  if (is_debug) {
    res.json({
      message: true,
      code: otp_code,
    });
  } else {
    res.json({
      message: true,
      code: otp_code,
    });
  }
};
const verifyOtp = async (req: Request, res: Response) => {
  verifyOtpSchema.parse(req.body);
  const { phone, otp } = req.body;
  let user = await prismaClient.user.findFirst({
    where: { phone },
  });
  if (otp == user?.otp_code) {
    user = await prismaClient.user.update({
      where: { phone },
      data: {
        name: phone,
      },
    });
    const token = jwt.sign({ user_id: user.id }, JWT_SECRET);
    let respone = await prismaClient.user.findFirst({
      where: { phone },
      select: {
        id: true,
        password: false,
        addresss: false,
        phone: true,
        name: true,
        email: true,
        role: true,
        image_url: true,
      },
    });
    res.json({ message: true, token, data: respone });
  } else {
    res.json({
      message: true,
      data: "SMS verification code is incorrect, or Expired.",
    });
  }
};

export { loginAdmin, register, profile, updateProfile, sentSms, verifyOtp };
