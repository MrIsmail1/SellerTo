import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("Products", {
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
    product_minimum_offer_price: {
      type: DataTypes.FLOAT,
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
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("Products");
};