import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import 'dotenv/config';
import contactRouter from "./routes/contactRoutes.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import connectedDataBase from "./models/db.js";
import productDetailRouter from "./routes/productDetailRoutes.js";
import { checkAuth } from "./middlewares/checkAuth.js";
import cors from 'cors';


const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Pour autoriser les requetes depuis le client
app.use(cors({
    origin: `${process.env.APP_BASE_URL_CLIENT}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true // Pour les cookies
}));

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(__dirname, "public")));
app.use("/contact", contactRouter);
app.use("/users", authRouter);
app.use("/product", productRouter);
app.use("/product-detail", productDetailRouter);

app.get("/protected", checkAuth, (req, res) => {
    res.send("Vous êtes autorisé à voir cette page");
});

connectedDataBase();

export default app;
