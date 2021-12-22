import { NextFunction, Request, Response } from "express";
import { ApiHeaderCreate } from "../../interface/interface";
import ApiDB from "../models/CreateApi";
import mongoose from "mongoose";

export const createApiHeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;

  const apiData = [{}];

  const api: ApiHeaderCreate = {
    name: name,
    about: about,
    isCompleted: false,
    apiData: apiData,
    apiSpeed: "0ms",
    apiSecretKey: "123",
  };

  try {
    const apiHeader = await ApiDB.create(api);

    res.status(200).json({ success: true, data: apiHeader });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateApiHeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, about, id: _id } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(404)
        .json({ success: false, message: "Not found with this id" });
    }

    const apiHeader = await ApiDB.findByIdAndUpdate(
      _id,
      { name, about },
      {
        new: true,
      }
    );

    res.status(200).json({ success: true, data: apiHeader });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getApiHeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { id: _id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(404)
        .json({ success: false, message: "Not found with this id" });
    }

    const apiHeader = await ApiDB.findById(_id);

    res.status(200).json({ success: true, data: apiHeader });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
