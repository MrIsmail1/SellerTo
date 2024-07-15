import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import logger from "morgan";
import path from "path";
import authRouter from "./routes/authRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import imagesRoutes from "./routes/imagesRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import connectedDataBase from "./models/db.js";
import cors from 'cors';
import bodyParser from 'body-parser';
import stripeWebhookHandler from './webhooks/stripeWebhook.js';

const app = express();

app.use(logger("dev"));
app.use(cookieParser());

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhookHandler
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: `${process.env.APP_BASE_URL_CLIENT}`,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Pour les cookies
  })
);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/upload", imagesRoutes);
app.use("/api/orders", orderRouter);

connectedDataBase();

export default app;
