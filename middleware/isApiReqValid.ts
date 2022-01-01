import { NextFunction, Request, Response } from "express";

const isApiReqValid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.headers.api_key;
  if (key !== (process.env.API_KEY_SECRET as string)) {
    return res
      .status(401)
      .json({ success: false, message: "Your api key is invalid" });
  }
  return next();
};

export default isApiReqValid;
