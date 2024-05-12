import { NextFunction, Request } from "express";
import multer from "multer";
import path from "path";
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ) {
    console.log("file : ", file.buffer);
    const extension = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.originalname.split(".")[0] + "_" + uniqueSuffix + "." + extension
    );
  },
});

const upload = multer({ storage: storage }).single("image");
const multerPromise = (req: Request, res: any) => {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log("in error multer : ", err);
        return reject(err);
      } else if (err) {
        console.log("in error : ", err);
        return reject(err);
      }
      return resolve(req);
    });
  });
};

const uploadMiddleware: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await multerPromise(req, res);
    next();
  } catch (err) {
    res.json();
  }
};

export default uploadMiddleware;
