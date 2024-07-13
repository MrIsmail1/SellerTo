import Orders from '../models/postgres/orderModel.js';
import { getProductById } from './productController.js';
import { getUserById } from './userController.js';

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
                userId: userId
            }
        });

        const detailedOrders = await Promise.all(orders.map(async (order) => {
            const productDetails = await getProductDetails(order.productId);
            const userDetails = await getUserDetails(order.userId);

            return {
                ...order.toJSON(),
                product: productDetails,
                user: userDetails
            };

        }));

        res.status(200).json(detailedOrders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'An error occurred while fetching orders.', error: error.message });
    }
};

