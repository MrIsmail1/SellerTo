import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_title: {
    type: String,
    required: false,
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
    required: false,
  },
  product_photo: {
    type: String,
    required: false,
  },
  product_minimum_offer_price: {
    type: Number,
    required: false,
  },
  product_category: {
    type: String,
    required: false,
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
    required: false,
    default: 0,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
