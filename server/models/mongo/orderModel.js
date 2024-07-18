import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderUnique: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
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
            ref: 'Payment',
            required: true,
        },
        trackingCode: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
