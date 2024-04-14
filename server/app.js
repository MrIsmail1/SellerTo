import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import 'dotenv/config';
import contactRouter from "./routes/contactRoutes.js";
import connectDb from "./models/db.js";

const app = express();
connectDb();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(__dirname, "public")));
app.use("/contact", contactRouter);

export default app;
