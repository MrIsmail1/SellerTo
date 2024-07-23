import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import logger from "morgan";
import path from "path";
import connectedDataBase from "./models/db.js";
import authRouter from "./routes/authRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import imagesRoutes from "./routes/imagesRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import productRouter from "./routes/productRoutes.js";
import promoCodeRouter from "./routes/promoCodeRoutes.js";
import stockRouter from "./routes/stockRoutes.js";
import userAlertRouter from "./routes/userAlertRoutes.js";
import userRouter from "./routes/userRoutes.js";
import widgetRouter from "./routes/widgetRoutes.js";
import stripeWebhookHandler from "./webhooks/stripeWebhook.js";

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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
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
app.use("/api/stocks", stockRouter);
app.use("/api/promocodes", promoCodeRouter);
app.use("/api/alert", userAlertRouter);
app.use("/api/widgets", widgetRouter);

connectedDataBase();

export default app;
