import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("Images", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.INTEGER,
    },
    width: {
      type: DataTypes.INTEGER,
    },
    height: {
      type: DataTypes.INTEGER,
    },
    format: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Products",
        key: "id",
      },
      allowNull: false,
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("Images");
};
