import { Router } from "express";
import { getAllUsers, getUserInfo, login, register, updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoutes = Router()
authRoutes.post('/register', register)
authRoutes.post('/login',login)
authRoutes.get('/getUserInfo',verifyToken,getUserInfo)
authRoutes.post('/updateProfile',verifyToken,updateProfile)
authRoutes.get('/getAllUsers',verifyToken,getAllUsers)



export default authRoutes