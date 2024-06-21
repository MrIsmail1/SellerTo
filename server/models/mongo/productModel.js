import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: Number,
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
  brand: {
    type: String,
    required: false,
  },
  itemModelNumber: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  operatingSystem: {
    type: String,
    required: false,
  },
  computerHardwarePlatform: {
    type: String,
    required: false,
  },
  keyboardDescription: {
    type: String,
    required: false,
  },
  processorBrand: {
    type: String,
    required: false,
  },
  typeOfProcessor: {
    type: String,
    required: false,
  },
  speedOfProcessor: {
    type: String,
    required: false,
  },
  numberOfHearts: {
    type: String,
    required: false,
  },
  sizeRam: {
    type: String,
    required: false,
  },
  sizeSsd: {
    type: String,
    required: false,
  },
  typeOfStorage: {
    type: String,
    required: false,
  },
  sizeScreen: {
    type: String,
    required: false,
  },
  gpu: {
    type: String,
    required: false,
  },
  gpuRam: {
    type: String,
    required: false,
  },
  connectivityType: {
    type: String,
    required: false,
  },
  wirelessTechnologyType: {
    type: String,
    required: false,
  },
  computerHardwareInterface: {
    type: String,
    required: false,
  },
  connectorType: {
    type: String,
    required: false,
  },
  softwareIncluded: {
    type: String,
    required: false,
  },
  itemDimensionsLxWxH: {
    type: String,
    required: false,
  },
  weight: {
    type: String,
    required: false,
  },
  resolution: {
    type: String,
    required: false,
  },
  series: {
    type: String,
    required: false,
  },
  keyboardAndLanguage: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
