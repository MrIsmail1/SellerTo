import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize-config.js";
import Products from "./productModel.js";

const Stock = sequelize.define(
  "Stock",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    operationType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["ADD", "REMOVE"]],
      },
    },
  },
  {
    timestamps: true,
    hooks: {
      afterCreate: async (stock, options) => {
        await updateProductStock(stock.productId);
      },
      afterUpdate: async (stock, options) => {
        await updateProductStock(stock.productId);
      },
      afterDestroy: async (stock, options) => {
        await updateProductStock(stock.productId);
      },
    },
  }
);

const updateProductStock = async (productId) => {
  const stocks = await Stock.findAll({ where: { productId } });
  const totalStock = stocks.reduce((total, stock) => {
    return stock.operationType === "ADD"
      ? total + stock.quantity
      : total - stock.quantity;
  }, 0);

  await Products.update(
    { product_stock: totalStock },
    {
      where: { id: productId },
    }
  );
};

export default Stock;
