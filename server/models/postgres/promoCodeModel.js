import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const PromoCodes = sequelize.define(
    "PromoCodes",
    {
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        expiry_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: true,
    }
);

export default PromoCodes;
