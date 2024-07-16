import Orders from '../models/postgres/orderModel.js';
import {getProductById} from './productController.js';
import {getUserById} from './userController.js';
import nodemailer from "nodemailer";

async function getProductDetails(productId) {
    return await getProductById(productId);
}

async function getUserDetails(userId) {
    return await getUserById(userId);
}

export const getUserOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await Orders.findAll({
            where: {
                userId: userId,
            },
        });

        const detailedOrders = await Promise.all(
            orders.map(async (order) => {
                const productDetails = await getProductDetails(order.productId);
                const userDetails = await getUserDetails(order.userId);

                return {
                    ...order.toJSON(),
                    product: productDetails,
                    user: userDetails,
                };
            })
        );

        res.status(200).json(detailedOrders);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch orders', error: error.message});
    }
};

export async function sendDeliveryConfirmationEmail(userEmail, trackingNumber, userName, userAddress, orderDate, products) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const productItems = products.map(product => `
    <div style="display: flex; align-items: center; margin-bottom: 20px;">
      <img src="${product.photo}" alt="Product Image" style="width: 200px; height: 200px; object-fit: cover; margin-right: 20px; border-radius: 5px;">
      <div>
        <p style="color: #000;"><strong>${product.title}</strong></p>
        <p style="color: #000;">Vendu par ${product.vendor}<br>Qté : ${product.quantity}<br>EUR : ${product.price} €</p>
      </div>
    </div>
  `).join('');

    let info = await transporter.sendMail({
        from: '"SellerTo" <no-reply@sellerto.com>',
        to: userEmail,
        subject: 'Confirmation de livraison par SellerTo',
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; border: 1px solid #e0e0e0; padding: 20px; border-radius: 5px;">
        <h2 style="color: #000;">Bonjour,</h2>
        <p style="color: #000;">Nous vous remercions pour votre commande. Nous vous tiendrons informé par e-mail lorsque les articles de votre commande auront été expédiés.</p>
        <p style="color: #000;">Votre date de livraison estimée est indiquée ci-dessous. Vous pouvez suivre l'état de votre commande dans <a href="http://localhost:5173/orders" style="color: #000;">Vos commandes sur SellerTo</a>.</p>

        <div style="border-top: 1px solid #e0e0e0; margin: 20px 0;"></div>

        <h3 style="color: #000;">Confirmation de votre commande</h3>
        <p style="color: #000;"><strong>Livraison prévue le </strong> ${orderDate}</p>
        <p style="color: #000;"><strong>Votre commande sera expédiée à :</strong></p>
        <p style="color: #000;">${userName}<br>${userAddress}</p>
        <p style="color: #000;"><strong>Votre mode de livraison :</strong> Livraison Prioritaire</p>
        <p style="color: #000;"><strong>Vos préférences d'expédition :</strong> Envoyer chaque article dès qu'il est disponible.</p>
        <p style="color: #000;"><strong>Commande n°:</strong> ${trackingNumber}</p>

        <a href="http://localhost:5173/orders" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #0e51c2; color: #fff; text-decoration: none; border-radius: 5px;">Afficher les détails de la commande</a>

        <div style="border-top: 1px solid #e0e0e0; margin: 20px 0;"></div>

        ${productItems}
      </div>
    `,
    });
}
