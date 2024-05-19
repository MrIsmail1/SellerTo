import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import 'dotenv/config';
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productDetailRouter from "./routes/productDetailRoutes.js";
import connectedDataBase from "./models/db.js";
import cors from 'cors';
import cron from 'node-cron';
import { cleanExpiredCarts } from './controllers/cartController.js';


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
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/product-detail", productDetailRouter);
app.use("/cart", cartRouter);
app.use("/user", userRouter);

// Planifier la tâche de nettoyage toutes les 15 minutes
cron.schedule('*/15 * * * *', async () => {
  await cleanExpiredCarts();
  console.log('Cleaned expired cart items');
});

connectedDataBase();

export default app;
