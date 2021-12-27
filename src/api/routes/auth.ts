import express from "express";
import {
  deleteAccount,
  getAllUsers,
  getUserProfile,
  login,
  profileImg,
  register,
} from "../controllers/auth";
import isAuthenticated from "../middleware/isAuthenticated";
import { PeoplesFileUpload } from "../middleware/peoplesFileUpload";
const router = express.Router();

//authentication
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/deleteAccount").delete(isAuthenticated, deleteAccount);
router
  .route("/updateProfileImg")
  .patch(isAuthenticated, PeoplesFileUpload.single("profileImg"), profileImg);
//get all users
router.route("/getAllUsers").get(getAllUsers);

export default router;
