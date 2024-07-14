import Stripe from 'stripe';
import { Payment, PaymentProduct } from '../models/postgres/paymentModel.js';
import Cart from '../models/postgres/cartModel.js'; // Assurez-vous d'importer le bon modèle de panier
import Product from '../models/postgres/productModel.js';
import dotenv from 'dotenv';
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

      // Parse the metadata to get product details
      const products = JSON.parse(session.metadata.products);

      if (products.length > 0) {
        // Calculate the total amount from the metadata products
        const totalAmount = products.reduce((sum, item) => sum + item.amount * item.quantity, 0);

        // Log totalAmount for debugging
        console.log(`Total amount calculated: ${totalAmount}`);

        // Create the payment record
        const payment = await Payment.create({
          userId: session.client_reference_id,
          amount: totalAmount / 100,  // Convert amount from cents to euros
          currency: session.currency,
          paymentIntentId: session.payment_intent,
          status: 'succeeded',
        });

        // Create PaymentProduct records for each product
        for (const item of products) {
          await PaymentProduct.create({
            paymentId: payment.id,
            productId: item.productId,
            quantity: item.quantity,
          });
        }

        // Clear the user's cart
        await Cart.destroy({ where: { userId: session.client_reference_id } });
      } else {
        console.log('No items in cart for the user.');
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};

export default stripeWebhookHandler;
