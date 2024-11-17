import { Router } from "express";
import {
  getSearchContacts,
  getChatList,
} from "../controllers/ContactControllers.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const contactRoutes = Router();
contactRoutes.post("/getSearchContacts", verifyToken, getSearchContacts);
contactRoutes.get("/getChatList", verifyToken, getChatList);

export default contactRoutes;
