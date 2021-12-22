import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import AuthModel from "../models/Auth";

interface User {
  name: string;
  email: string;
  profileImg: string;
  created?: Date;
  getSignedToken: () => void;
}

interface LoginRequest {
  email: string;
  password: string;
}
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password }: LoginRequest = req.body;

  if (!email || !password) {
    res.status(403).json({
      success: false,
      message: `Please provide ${!email && "email"} ${!password && "password"}`,
    });
  }

  try {
    const login = await AuthModel.findOne({ email }).select("+password");

    if (!login) {
      return res
        .status(401)
        .json({ success: false, message: "You are not Authorized" });
    }

    const isCorrect = await login.matchPassword(password, login.password);

    if (!isCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "You are not Authorized" });
    }

    sendToken(login, 200, res);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name }: RegisterRequest = req.body;
  const profileImg: string = "";

  try {
    const newUser = await AuthModel.create({
      email,
      password,
      name,
      profileImg,
    });

    sendToken(newUser, 200, res);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendToken = async (login: User, statusCode: number, res: Response) => {
  const token = await login.getSignedToken();

  res.status(statusCode).json({
    success: true,
    data: {
      token: token,
    },
  });
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.query.id as unknown as string;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Not found with this id" });
    }

    await AuthModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Your Account deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
