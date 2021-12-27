import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, "upload/post/images");
  },
  filename: (req: Request, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

export const PostFileUpload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
});
