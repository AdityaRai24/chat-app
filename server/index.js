import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes.js";
import ConnectToDb from "./connection/connection.js";

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

ConnectToDb();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});
