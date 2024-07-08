import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import 'dotenv/config';
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import userRouter from "./routes/userRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import connectedDataBase from "./models/db.js";
import cors from 'cors';
import bodyParser from 'body-parser';
import stripeWebhookHandler from './webhooks/stripeWebhook.js';
import cron from 'node-cron';
import { cleanExpiredCarts } from './controllers/cartController.js';

const app = express();

app.use(logger("dev"));
app.use(cookieParser());

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhookHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: `${process.env.APP_BASE_URL_CLIENT}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true // Pour les cookies
}));

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/payments", paymentRouter);

// Planifier la tâche de nettoyage toutes les 15 secondes pour le panier
cron.schedule('*/15 * * * * *', async () => {
  await cleanExpiredCarts();
  console.log('Cleaned expired cart items');
});


connectedDataBase();

export default app;
