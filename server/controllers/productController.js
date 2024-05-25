import Product from '../models/productModel.js';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500);
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404);
        }
        res.json(product);
    } catch (error) {
        res.status(500);
    }
};

export const createProduct = async (req, res) => {
    try {
        const products = req.body;
        // Pour la fake data et mettre plusieurs produits
        if (Array.isArray(products)) {
            const newProducts = await Product.insertMany(products);
            res.status(201).json(newProducts);
        } else {
            // Si un seul produit est fourni
            const newProduct = new Product(products);
            await newProduct.save();
            res.status(201).json(newProduct);
        }
    } catch (error) {
        res.status(500);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404);
        }

        Object.assign(product, req.body);
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404);
        }
        await product.remove();
        res.status(204).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500);
    }
};
