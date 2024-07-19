import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
            required: true,
        },
        orderUnique: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        productId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: false,
        },
        paymentIntentId: {
            type: String,
            required: true,
        },
        trackingCode: {
            type: String,
            required: true,
        },
        product: {
            product_title: {
                type: String,
                required: true,
            },
            product_price: {
                type: Number,
                required: true,
            },
            product_category: {
                type: String,
                required: true,
            }
        },
        user: {
            firstname: {
                type: String,
                required: true,
            },
            lastname: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
