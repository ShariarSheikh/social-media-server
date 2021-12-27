import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, "upload/peoples/images");
  },
  filename: (req: Request, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

export const PeoplesFileUpload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
});
