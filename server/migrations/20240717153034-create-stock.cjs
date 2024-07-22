/** @type {import('sequelize-cli').Migration} */

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Stocks', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    operationType: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [['ADD', 'REMOVE']],
      },
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('Stocks');
};
