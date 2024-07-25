import OrderMongo from "../../models/mongo/orderModel.js";
import sequelize from "../../config/sequelize-config.js";

export default async function denormalizeOrder(orderId, models) {
    const { Order } = models;

    try {
        if (typeof orderId !== 'number' && typeof orderId !== 'string') {
            throw new Error(`Invalid orderId type: ${typeof orderId}`);
        }

        const orderQuery = `
      SELECT 
        o.*, 
        p.product_title, 
        p.product_price, 
        p.product_category,
        u.firstname, 
        u.lastname, 
        u.email  
      FROM "Orders" o
      JOIN "Products" p ON o."productId" = p.id
      JOIN "Users" u ON o."userId" = u.id
      WHERE o.id = :orderId
    `;

        const orderDenormalized = await sequelize.query(orderQuery, {
            replacements: { orderId },
            type: sequelize.QueryTypes.SELECT
        });

        if (orderDenormalized.length === 0) {
            throw new Error(`Order with id ${orderId} not found`);
        }

        const orderJSON = orderDenormalized[0];
        const orderDocument = {
            _id: orderJSON.id,
            orderUnique: orderJSON.orderUnique,
            quantity: orderJSON.quantity,
            userId: orderJSON.userId.toString(),
            productId: orderJSON.productId.toString(),
            amount: orderJSON.amount,
            status: orderJSON.status,
            paymentIntentId: orderJSON.paymentIntentId,
            trackingCode: orderJSON.trackingCode,
            product: {
                product_title: orderJSON.product_title,
                product_price: orderJSON.product_price,
                product_category: orderJSON.product_category
            },
            user: {
                firstname: orderJSON.firstname,
                lastname: orderJSON.lastname,
                email: orderJSON.email,
            }
        };

        await OrderMongo.findByIdAndUpdate(orderId, orderDocument, {
            upsert: true,
            new: true,
        });
    } catch (error) {
        console.log(error);
    }
}
