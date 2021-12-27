import express from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getOne,
  getPosterPost,
  updatePost,
} from "../controllers/post";
import isAuthenticated from "../middleware/isAuthenticated";
import { PostFileUpload } from "../middleware/postFileUpload";

const router = express.Router();

//api
router.route("/allPost").get(getAllPost);
router.route("/getMyPost").get(isAuthenticated, getPosterPost);
router
  .route("/createPost")
  .post(isAuthenticated, PostFileUpload.single("postImg"), createPost);
router.route("/deletePost").delete(isAuthenticated, deletePost);
router.route("/getOnePost").get(getOne);
router
  .route("/updatePost")
  .patch(isAuthenticated, PostFileUpload.single("postImg"), updatePost);

export default router;
