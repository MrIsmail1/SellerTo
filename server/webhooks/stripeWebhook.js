import Stripe from 'stripe';
import { Payment, PaymentProduct } from '../models/postgres/paymentModel.js';
import Cart from '../models/postgres/cartModel.js';
import Product from '../models/postgres/productModel.js';
import dotenv from 'dotenv';
import { generateTrackingNumber } from '../utils/trackingGenerator.js';
import Orders from "../models/postgres/orderModel.js";
import User from '../models/postgres/userModel.js';
import { sendDeliveryConfirmationEmail } from '../controllers/orderController.js';

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

      const trackingNumber = generateTrackingNumber();

      const order = await Orders.create({
        userId: session.client_reference_id,
        productId: productId,
        amount: session.amount_total / 100,
        status: 'Paiement validé, colis pris en charge par La Poste',
        paymentIntentId: session.payment_intent,
        trackingCode: trackingNumber,
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

      await Cart.destroy({ where: { userId: session.client_reference_id } });

      const user = await User.findByPk(session.client_reference_id);
      const product = await Product.findByPk(productId);

      if (user && product) {
        const products = [{
          photo: product.product_photo,
          title: product.product_title,
          vendor: 'SellerTo',
          quantity: 1,
          price: session.amount_total / 100,
        }];
        const userName = `${user.firstname} ${user.lastname}`;
        const userAddress = `${user.address}, ${user.city}, ${user.country}`;

        const orderDate = new Date(order.createdAt);
        orderDate.setDate(orderDate.getDate() + 4);
        const formattedOrderDate = orderDate.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        await sendDeliveryConfirmationEmail(user.email, trackingNumber, userName, userAddress, formattedOrderDate, products);
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};

export default stripeWebhookHandler;
