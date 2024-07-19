import OrderMongo from "../../models/mongo/orderModel.js";

export default async function denormalizeOrder(orderId, models) {
    const { Order, Product, User } = models;

    try {
        // Fetch the order and associated product and user details
        const orderDenormalized = await Order.findByPk(orderId, {
            include: [
                {
                    model: Product,
                    as: "product",
                    attributes: ["product_title", "product_price", "product_category"],
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["firstname", "lastname", "email"],
                }
            ],
            attributes: { exclude: [] },
        });

        if (!orderDenormalized) {
            throw new Error(`Order with id ${orderId} not found`);
        }

        // Convert order to JSON
        const orderJSON = orderDenormalized.toJSON();

        // Prepare the document for MongoDB
        const orderDocument = {
            _id: orderJSON.id,
            orderUnique: orderJSON.orderUnique,
            quantity: orderJSON.quantity,
            userId: orderJSON.userId,
            productId: orderJSON.productId,
            amount: orderJSON.amount,
            status: orderJSON.status,
            paymentIntentId: orderJSON.paymentIntentId,
            trackingCode: orderJSON.trackingCode,
            product: orderJSON.product,
            user: orderJSON.user,
        };

        await OrderMongo.findByIdAndUpdate(orderId, orderDocument, {
            upsert: true,
            new: true,
        });
    } catch (error) {
        console.log(error);
    }
}
