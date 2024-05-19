import mongoose from 'mongoose';
import Product from './productModel.js';
import User from './userModel.js';

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
