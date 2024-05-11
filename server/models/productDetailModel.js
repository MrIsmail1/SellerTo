import { Sequelize, DataTypes } from "sequelize";
import Product from './productModel.js'; // Assurez-vous que le chemin est correct

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
});

const ProductDetail = sequelize.define('ProductDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        },
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    timestamps: true
});

Product.hasOne(ProductDetail, {
    foreignKey: 'product_id',
    as: 'details'
});
ProductDetail.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

export default ProductDetail;
