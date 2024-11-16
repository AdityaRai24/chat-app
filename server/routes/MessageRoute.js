import { Router } from "express";
import { getUsersChat } from "../controllers/MessageController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js"

const messageRoutes = Router();

messageRoutes.post("/getUsersChat",verifyToken, getUsersChat);

export default messageRoutes;
