import Stripe from 'stripe';
import Payment from '../models/paymentModel.js';
import Cart from '../models/cartModel.js'; // Assurez-vous d'importer le modèle de Cart
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

      // Create a new payment record in your database
      await Payment.create({
        userId: session.client_reference_id,
        amount: session.amount_total / 100, // Convert from cents to euros
        currency: session.currency,
        paymentIntentId: session.payment_intent,
        status: 'succeeded',
      });

      // Vider le panier de l'utilisateur après le paiement
      await Cart.deleteMany({ userId: session.client_reference_id.toString() });
      
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

export default stripeWebhookHandler;
