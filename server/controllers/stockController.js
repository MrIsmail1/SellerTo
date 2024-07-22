import Stock from '../models/postgres/stockModel.js';
import Products from '../models/postgres/productModel.js';

export const getAllStock = async (req, res) => {
    try {
        const stockEntries = await Stock.findAll();
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

export const updateStock = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity, operationType } = req.body;

    try {
        if (!['ADD', 'REMOVE'].includes(operationType)) {
            return res.status(400);
        }

        const stock = await Stock.findByPk(id);
        if (!stock) {
            return res.status(404);
        }

        const product = await Products.findByPk(productId);
        if (!product) {
            return res.status(404);
        }

        stock.productId = productId;
        stock.quantity = quantity;
        stock.operationType = operationType;
        await stock.save();

        res.status(200).json(stock);
    } catch (error) {
        res.status(500);
    }
};

export const findStockById = async (req, res) => {
    const { id } = req.params;

    try {
        const stock = await Stock.findByPk(id);
        if (!stock) {
            return res.status(404);
        }

        res.status(200).json(stock);
    } catch (error) {
        res.status(500);
    }
};

export const patchStock = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity, operationType } = req.body;

    try {
        const stock = await Stock.findByPk(id);
        if (!stock) {
            return res.status(404);
        }

        if (productId !== undefined) {
            const product = await Products.findByPk(productId);
            if (!product) {
                return res.status(404);
            }
            stock.productId = productId;
        }

        if (quantity !== undefined) {
            stock.quantity = quantity;
        }

        if (operationType !== undefined) {
            if (!['ADD', 'REMOVE'].includes(operationType)) {
                return res.status(400);
            }
            stock.operationType = operationType;
        }

        await stock.save();
        res.status(200).json(stock);
    } catch (error) {
        res.status(500);
    }
};