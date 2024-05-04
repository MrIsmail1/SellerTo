import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import 'dotenv/config';
import contactRouter from "./routes/contactRoutes.js";
import authRouter from "./routes/authRoutes.js";
import connectDb from "./models/db.js";
import { checkAuth } from "./middlewares/checkAuth.js";


const app = express();
connectDb();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(__dirname, "public")));
app.use("/contact", contactRouter);
app.use("/users", authRouter);

app.get("/protected", checkAuth, (req, res) => {
    res.send("Vous êtes autorisé à voir cette page");
});

export default app;
