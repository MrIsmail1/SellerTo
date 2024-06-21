import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  reservedUntil: {
    type: Date,
     default: () => new Date(Date.now() + 2 * 1000),
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
