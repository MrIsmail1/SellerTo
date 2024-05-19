import mongoose from 'mongoose';
import Product from './productModel.js';

const productDetailSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

const ProductDetail = mongoose.model('ProductDetail', productDetailSchema);

export default ProductDetail;
