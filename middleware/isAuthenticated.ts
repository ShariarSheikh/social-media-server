import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthModel from "../models/Auth";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user: any = await AuthModel.findById(decoded.id);
 
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized to access" });
    }
    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default isAuthenticated;
