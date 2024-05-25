import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentSession = async (req, res) => {
  try {
    const { amount, userId, items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: item.amount,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.APP_BASE_URL_CLIENT}/success`,
      cancel_url: `${process.env.APP_BASE_URL_CLIENT}/cancel`,
      client_reference_id: userId
    });
    res.status(200).json({sessionId: session.id});
  } catch (error) {
    res.status(500);
  }
};

export const createUniquePaymentLink = async (req, res) => {
  try {
    const { amount, userId, items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: item.amount,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.APP_BASE_URL_CLIENT}/success`,
      cancel_url: `${process.env.APP_BASE_URL_CLIENT}/cancel`,
      client_reference_id: userId
    });
    res.status(200).json({paymentUrl: session.url});
  } catch (error) {
    res.status(500);
  }
};

export const createRefund = async (req, res) => {
  const { paymentIntentId, amount } = req.body;
  const userId = req.user.id;

  try {
    // Create a refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? amount * 100 : undefined,
    });

    await Payment.update(
      { status: 'refunded' },
      { where: { paymentIntentId, userId } }
    );
    res.status(200).json({ message: 'Refund created successfully', refund });
  } catch (error) {
    res.status(500);
  }
};