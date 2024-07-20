import Stripe from 'stripe';
import { Payment, PaymentProduct } from "../models/postgres/paymentModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentSession = async (req, res) => {
  try {
    const { userId, items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: item.amount,  // Ensure this value is in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.APP_BASE_URL_CLIENT}/success`,
      cancel_url: `${process.env.APP_BASE_URL_CLIENT}/cancel`,
      client_reference_id: userId,
      metadata: {
        products: JSON.stringify(items.map(item => ({ productId: item.productId, amount: item.amount, quantity: item.quantity }))),
      }
    });
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUniquePaymentLink = async (req, res) => {
  try {
    const { userId, items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: item.amount,  // Ensure this value is in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.APP_BASE_URL_CLIENT}/success`,
      cancel_url: `${process.env.APP_BASE_URL_CLIENT}/cancel`,
      client_reference_id: userId,
      metadata: {
        products: JSON.stringify(items.map(item => ({ productId: item.productId, amount: item.amount, quantity: item.quantity }))),
      }
    });
    res.status(200).json({ paymentUrl: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createRefund = async (req, res) => {
  const { paymentId, productId, quantity } = req.body;
  try {
    // Find the payment product entry
    const paymentProduct = await PaymentProduct.findOne({
      where: {
        paymentId,
        productId,
      }
    });
    if (!paymentProduct) {
      return res.status(404).json({ message: 'Produit non trouvé pour ce paiement' });
    }

    // Calculate refund amount
    const refundAmount = (paymentProduct.amount / paymentProduct.quantity) * quantity;

    // Find the payment intent ID
    const payment = await Payment.findOne({
      where: {
        id: paymentId,
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.paymentIntentId,
      amount: Math.round(refundAmount * 100), // Convert to cents and round
    });

    // Update PaymentProduct with refund details
    paymentProduct.refundId = refund.id;
    paymentProduct.refundAmount = refundAmount;
    paymentProduct.refundStatus = 'refunded';
    await paymentProduct.save();

    res.status(200).json(refund);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

