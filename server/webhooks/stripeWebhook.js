import Stripe from 'stripe';
import Payment from '../models/postgres/paymentModel.js';
import Cart from '../models/postgres/cartModel.js'; // Assurez-vous d'importer le bon modèle de panier
import dotenv from 'dotenv';
import { generateTrackingNumber } from '../utils/trackingGenerator.js';
import Orders from "../models/postgres/orderModel.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`PaymentIntent was successful!`);

      const productId = session.metadata.productId;

      await Payment.create({
        userId: session.client_reference_id,
        amount: session.amount_total / 100,
        currency: session.currency,
        paymentIntentId: session.payment_intent,
        status: 'succeeded',
        productId: productId,
      });

      const trackingNumber = generateTrackingNumber();

      await Orders.create({
        userId: session.client_reference_id,
        productId: productId,
        amount: session.amount_total / 100,
        status: 'Paiement validé, colis pris en charge par La Poste',
        paymentIntentId: session.payment_intent,
        trackingCode: trackingNumber,
      });

      await Cart.destroy({ where: { userId: session.client_reference_id } });

      // Vider le panier de l'utilisateur après le paiement
      await Cart.deleteMany({ userId: session.client_reference_id.toString() });

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};

export default stripeWebhookHandler;
