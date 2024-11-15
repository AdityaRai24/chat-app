import { Router } from "express";
import { getUserInfo, login, register } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoutes = Router()
authRoutes.post('/register', register)
authRoutes.post('/login',login)
authRoutes.get('/getUserInfo',verifyToken,getUserInfo)


export default authRoutes