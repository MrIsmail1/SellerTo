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
import cron from 'node-cron';
import { cleanExpiredCarts } from './controllers/cartController.js';
import bodyParser from 'body-parser';
import stripeWebhookHandler from './controllers/stripeWebhookController.js';

const app = express();

app.use(logger("dev"));
app.use(cookieParser());

// Stripe recommande d'utiliser bodyParser.raw pour les webhooks
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhookHandler);

// Les middlewares suivants ne doivent pas être appliqués à la route du webhook
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
app.use("/cart", cartRouter);
app.use("/user", userRouter);
app.use("/payment", paymentRouter);

// Planifier la tâche de nettoyage toutes les 15 minutes
cron.schedule('*/15 * * * *', async () => {
  await cleanExpiredCarts();
  console.log('Cleaned expired cart items');
});

connectedDataBase();

export default app;
