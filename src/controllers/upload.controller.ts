import { Response, Request } from "express";

const uploadFile = async (req: Request, res: Response) => {
  try {
    res.json({ data: req.file });
  } catch (e) {
    console.log("error: ", e);
    return res.status(400).send(e);
  }
};

export { uploadFile };
