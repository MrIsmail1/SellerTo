import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_title: {
    type: String,
    required: true,
  },
  product_price: {
    type: Number,
    required: false,
  },
  product_star_rating: {
    type: Number,
    required: false,
  },
  product_url: {
    type: String,
    required: true,
  },
  product_photo: {
    type: String,
    required: true,
  },
  product_minimum_offer_price: {
    type: Number,
    required: false,
  },
  product_category: {
    type: String,
    required: true,
  },
  is_best_seller: {
    type: Boolean,
    required: false,
  },
  delivery: {
    type: String,
    required: false,
  },
  product_stock: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
