import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize-config.js";
import ProductMongo from "../../models/mongo/productModel.js";
import denormalizeProduct from "../../services/denormalization/product.js";
import Images from "./imagesModel.js";

const Products = sequelize.define(
  "Products",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    product_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    product_star_rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    product_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_best_seller: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    delivery: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    itemModelNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    operatingSystem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    computerHardwarePlatform: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    keyboardDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    processorBrand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    typeOfProcessor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    speedOfProcessor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberOfHearts: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sizeRam: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sizeSsd: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    typeOfStorage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sizeScreen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gpu: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gpuRam: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    connectivityType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wirelessTechnologyType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    computerHardwareInterface: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    connectorType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    softwareIncluded: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    itemDimensionsLxWxH: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resolution: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    series: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    keyboardAndLanguage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      afterCreate: async (product, options) => {
        await denormalizeProduct({ id: product.id }, { Product: Products });
      },
      afterUpdate: async (product, options) => {
        await denormalizeProduct({ id: product.id }, { Product: Products });
      },
      afterDestroy: async (product, options) => {
        await ProductMongo.findByIdAndDelete(product.id);
      },
    },
  }
);
Products.hasMany(Images, {
  foreignKey: "productId",
  as: "images",
  onDelete: "CASCADE",
});

Images.belongsTo(Products, {
  foreignKey: "productId",
  as: "product",
  onDelete: "CASCADE",
});

export default Products;
