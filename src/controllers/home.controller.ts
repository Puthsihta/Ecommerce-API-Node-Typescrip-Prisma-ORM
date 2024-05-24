import { Request, Response } from "express";

const home = async (req: Request, res: Response) => {
  let banner;
  let categories;
  let services;
  let trendings;

  res.json({
    message: true,
    data: {
      banner: [],
      categories: [],
      services: [],
      trendings: [],
    },
  });
};
const preload = async (req: Request, res: Response) => {
  let theme = {
    text_color: "#000000",
    bg_color: "#0693E3",
    header:
      "https://s3.ap-southeast-1.amazonaws.com/bloc01/photo/202402/20240212_4AB011E642CF857C7FD0F5BA86F7FC49.png",
    background:
      "https://s3.ap-southeast-1.amazonaws.com/bloc01/photo/202402/20240212_EC0898C4195BBF08A69D376D8307CBDE.png",
  };
  let popup = {
    title: "បង្អែមឆ្ងាញ់ ផ្សារដេប៉ូ",
    thumb:
      "https://s3.ap-southeast-1.amazonaws.com/bloc01/photo/202401/20240109_35DD52A7DBF65EE2C9446AABAD7DE1A9.jpeg",
    is_ecommerce: 0,
    type: "shop",
    link: "",
  };
  let version = {
    apk_client_version: "2.2.22020109",
    ios_client_version: "2.2.22020106",
    apk_client_download:
      "https://play.google.com/store/apps/details?id=com.bongtk.bloc",
    ios_client_download:
      "https://apps.apple.com/us/app/bloc-delivery/id1459499838",
  };
  res.json({
    message: true,
    data: {
      theme,
      popup,
      version,
    },
  });
};

const homePrefeeds = async (req: Request, res: Response) => {
  res.json({ message: true });
};

export { home, preload, homePrefeeds };
