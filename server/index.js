import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes.js";
import ConnectToDb from "./connection/connection.js";
import setupSocket from "./socket.js";
import messageRoutes from "./routes/MessageRoute.js";
import contactRoutes from "./routes/ContactRoutes.js";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contacts", contactRoutes);

ConnectToDb();

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});

setupSocket(server);
