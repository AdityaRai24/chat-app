import { Router } from "express";
import {
  getUserInfo,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoutes = Router();
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/getUserInfo", verifyToken, getUserInfo);
authRoutes.post("/updateProfile", verifyToken, updateProfile);
authRoutes.post("/logout", verifyToken, logout);

export default authRoutes;
