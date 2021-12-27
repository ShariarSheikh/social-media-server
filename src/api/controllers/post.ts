import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { unlink } from "fs";
import PostDB from "../models/Post";
import { shuffleArray } from "../utils/shuffleArray";

export const getAllPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allPost = await PostDB.find();

    res.status(200).json({ success: true, data: shuffleArray(allPost) });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

interface Query {
  posterId: string;
}
export const getPosterPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { posterId } = req.query as unknown as Query;

  try {
    if (!mongoose.Types.ObjectId.isValid(posterId)) {
      return res
        .status(404)
        .json({ success: false, message: "Not found with this id" });
    }
    const post = await PostDB.find({ posterProfileId: posterId });

    res.status(200).json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    postType,
    postHeader,
    postParagraph,
    selectedTags,
    profileId,
    name,
    profileImg,
  } = req.body;

  const post = {
    posterProfileImg: profileImg,
    posterName: name,
    posterProfileId: profileId,
    reactions: {
      love: 0,
      angry: 0,
      fire: 0,
      bad: 0,
    },
    comments: 0,
    postType,
    postHeader,
    postParagraph,
    tags: selectedTags,
    postImg: req?.file?.filename
      ? `${process.env.HOST_URL}/post/images/${req.file?.filename} `
      : "",
    imgFileName: req.file?.filename,
  };

  try {
    const isUpload = await PostDB.create(post);
    res.status(200).json({ success: true, data: isUpload });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId, postHeader, postParagraph, postType, imgFileName } = req.body;

  const newPost: any = {
    postHeader,
    postParagraph,
    postType,
    postImg: req?.file?.filename
      ? `${process.env.HOST_URL}/post/images/${req.file?.filename} `
      : "",
    imgFileName: req.file?.filename,
  };

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res
        .status(404)
        .json({ success: false, message: "Not found with this id" });
    }

    const idUpdate = await PostDB.findByIdAndUpdate(postId, newPost, {
      new: true,
    });

    idUpdate &&
      imgFileName &&
      (await unlink(`upload/post/images/${imgFileName}`, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      }));

    res.status(200).json({ success: true, data: "" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

interface Query {
  postId: string;
  fileName: string;
}

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId, fileName } = req.query as unknown as Query;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res
        .status(404)
        .json({ success: false, message: "Not found with this id" });
    }
    await PostDB.findByIdAndDelete(postId);

    await unlink(`upload/post/images/${fileName}`, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    res
      .status(200)
      .json({ success: true, message: "Your post was deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

interface getOneQuery {
  id: string;
}
export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query as unknown as getOneQuery;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Not found with this id" });
    }

    const post = await PostDB.findById(id);

    res.status(200).json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
