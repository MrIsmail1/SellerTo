import Stripe from 'stripe';
import { Payment, PaymentProduct } from '../models/postgres/paymentModel.js';
import Cart from '../models/postgres/cartModel.js';
import Product from '../models/postgres/productModel.js';
import Stock from '../models/postgres/stockModel.js';
import dotenv from 'dotenv';
import { generateTrackingNumber } from '../utils/trackingGenerator.js';
import Orders from "../models/postgres/orderModel.js";
import User from '../models/postgres/userModel.js';
import { sendDeliveryConfirmationEmail } from '../controllers/orderController.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const generateUniqueOrderID = () => {
    return Math.floor(Math.random() * 1000000000);
};

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

                // Create the payment record
                const payment = await Payment.create({
                    userId: session.client_reference_id,
                    amount: totalAmount / 100,  // Convert amount from cents to euros
                    currency: session.currency,
                    paymentIntentId: session.payment_intent,
                    status: 'succeeded',
                });

                const trackingNumber = generateTrackingNumber();

                const orderUnique = generateUniqueOrderID();

                const orderDetails = [];

                for (const item of products) {
                    const productId = item.productId;

                    await Orders.create({
                        userId: session.client_reference_id,
                        orderUnique: orderUnique,
                        quantity: item.quantity,
                        productId: productId,
                        amount: (item.amount * item.quantity) / 100,
                        status: 'Paiement validé, colis pris en charge par La Poste',
                        paymentIntentId: session.payment_intent,
                        trackingCode: trackingNumber,
                    });

                    await PaymentProduct.create({
                        paymentId: payment.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        amount: (item.amount * item.quantity) / 100, // Include amount here
                    });

                    await Stock.create({
                        productId: productId,
                        quantity: item.quantity,
                        operationType: 'REMOVE',
                    });

                    // Récupérer les détails du produit
                    const product = await Product.findByPk(productId);
                    if (product) {
                        orderDetails.push({
                            photo: product.product_photo,
                            title: product.product_title,
                            vendor: 'SellerTo',
                            quantity: item.quantity,
                            price: (item.amount * item.quantity) / 100,
                        });
                    }
                }

                // Vider le panier de l'utilisateur
                await Cart.destroy({ where: { userId: session.client_reference_id } });

                const user = await User.findByPk(session.client_reference_id);

                if (user && orderDetails.length > 0) {
                    const userName = `${user.firstname} ${user.lastname}`;
                    const userAddress = `${user.address}, ${user.city}, ${user.country}`;

                    const orderDate = new Date();
                    orderDate.setDate(orderDate.getDate() + 4);
                    const formattedOrderDate = orderDate.toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });

                    await sendDeliveryConfirmationEmail(user.email, trackingNumber, userName, userAddress, formattedOrderDate, orderDetails);
                }
            } else {
                console.log('Aucun article dans le panier pour l\'utilisateur.');
            }

            break;
        default:
            console.log(`Type d'événement non géré ${event.type}`);
    }

    res.send();
}
export default stripeWebhookHandler;
