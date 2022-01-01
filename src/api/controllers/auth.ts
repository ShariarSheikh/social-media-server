import { Request, Response, NextFunction } from "express";
import { unlink } from "fs";
import mongoose from "mongoose";
import AuthModel from "../models/Auth";
import PostDB from "../models/Post";

interface User {
  name: string;
  email: string;
  profileImg: string;
  created?: Date;
  imgFileName?: string;
  getSignedToken: () => void;
  _id: string;
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

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  interface Peoples {
    email: string;
    name: string;
    profileImg: string;
    _id: string;
    created: Date;
  }
  [];

  interface User {
    name: string;
    email: string;
    profileImg: string;
  }

  try {
    const peoples = (await AuthModel.find()) as unknown as any;
    const data: any = [];

    peoples?.map((x: Peoples) => {
      const user: User = {
        name: x.name,
        email: x.email,
        profileImg: x.profileImg,
      };
      data.push(user);
    });

    res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

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
  const imgFileName: string = "";

  try {
    const newUser = await AuthModel.create({
      email,
      password,
      name,
      profileImg,
      imgFileName,
    });

    sendToken(newUser, 200, res);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
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
  const posterProfileId = id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Not found with this id" });
    }

    const isDelete = await AuthModel.findByIdAndDelete(id);

    if (isDelete) {
      await PostDB.deleteMany({ posterProfileId });
      return next();
    }
    res.status(200).json({ success: true, message: "Your Account deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const profileImg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: _id, imagesFileName, isUpload } = req.body;

  const update: any = {
    profileImg: isUpload
      ? `${process.env.HOST_URL}/peoples/${req.file?.filename}`
      : "",
    imgFileName: isUpload ? req.file?.filename : "",
  };

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      res
        .status(404)
        .json({ success: false, message: "Not found with this id" });
    } else {
      if (imagesFileName) {
        await unlink(`upload/peoples/${imagesFileName}`, (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });
      }

      const updateImg = await AuthModel.findByIdAndUpdate(_id, update, {
        new: true,
      });

      if (!updateImg?.email) {
        await unlink(`upload/peoples/${req.file?.filename}`, (err) => {
          if (err) {
            return res
              .status(404)
              .json({ success: false, message: "Not found with this id" });
          }
        });
      }
      sendToken(updateImg, 200, res);
    }
  } catch (error: any) {
    await unlink(`upload/peoples/${req.file?.filename}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendToken = async (login: User, statusCode: number, res: Response) => {
  const token = await login.getSignedToken();

  res.status(statusCode).json({
    success: true,
    data: {
      token: token,
      name: login?.name,
      email: login?.email,
      profileImg: login?.profileImg,
      profileId: login?._id,
      imgFileName: login?.imgFileName,
    },
  });
};
