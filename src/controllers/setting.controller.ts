import { Request, Response } from "express";
import { CreatSettingSchema } from "../schemas/setting";
import { prismaClient } from "..";
import { SettingType } from "../constants/index.constants";

const creatSetting = async (req: Request, res: Response) => {
  CreatSettingSchema.parse(req.body);
  await prismaClient.setting.create({
    data: {
      ...req.body,
    },
  });
  res.json({ message: true, data: `${req.body.title} successfully created` });
};
const setting = async (req: Request, res: Response) => {
  const type = String(req.query.type);
  const setting = await prismaClient.setting.findFirst({
    where: {
      type,
    },
    select: {
      title: true,
      content: type !== SettingType.CONTACT_US ? true : false,
      phone: type == SettingType.CONTACT_US ? true : false,
      email: type == SettingType.CONTACT_US ? true : false,
      web: type == SettingType.CONTACT_US ? true : false,
      address: type == SettingType.CONTACT_US ? true : false,
      latitude: type == SettingType.CONTACT_US ? true : false,
      longitude: type == SettingType.CONTACT_US ? true : false,
    },
  });
  res.json({ message: true, data: setting });
};
const updateSetting = async (req: Request, res: Response) => {
  CreatSettingSchema.parse(req.body);
  await prismaClient.setting.update({
    where: {
      id: 1,
    },
    data: {
      ...req.body,
    },
  });
  res.json({ message: true, data: "Setting Updated Successfully!" });
};

export { creatSetting, setting, updateSetting };
