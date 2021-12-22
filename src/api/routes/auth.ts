import express from "express";
import {
  deleteAccount,
  getUserProfile,
  login,
  register,
} from "../controllers/auth";
import isAuthenticated from "../middleware/isAuthenticated";
const router = express.Router();

//authentication
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/deleteAccount").delete(isAuthenticated, deleteAccount);

export default router;
