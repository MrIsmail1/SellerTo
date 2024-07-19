import Stock from '../models/postgres/stockModel.js';
import Products from '../models/postgres/productModel.js';

export const getAllStock = async (req, res) => {
    try {
        const stockEntries = await Stock.findAll({
            include: [{
                model: Products,
                as: 'Product'
            }]
        });
        res.status(200).json(stockEntries);
    } catch (error) {
        res.status(500);
    }
};

export const createStock = async (req, res) => {
    const { productId, quantity, operationType } = req.body;

    try {
        if (!['ADD', 'REMOVE'].includes(operationType)) {
            return res.status(400);
        }

        const product = await Products.findByPk(productId);
        if (!product) {
            return res.status(404);
        }

        const newStock = await Stock.create({ productId, quantity, operationType });
        res.status(201).json(newStock);
    } catch (error) {
        res.status(500);
    }
};

export const deleteStock = async (req, res) => {
    const { id } = req.params;

    try {
        const stock = await Stock.findByPk(id);
        if (!stock) {
            return res.status(404);
        }

        await stock.destroy();
        res.status(204);
    } catch (error) {
        res.status(500);
    }
};
