import ProductDetail from '../models/productDetailModel.js';
import Product from '../models/productModel.js';

export const getProductDetails = async (req, res) => {
    try {
        const productDetails = await ProductDetail.findAll();
        res.json(productDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductDetail = async (req, res) => {
    try {
        const productDetail = await ProductDetail.findByPk(req.params.id);
        if (!productDetail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }
        res.json(productDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProductDetail = async (req, res) => {
    try {
        const { product_id, data } = req.body;
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const newProductDetail = await ProductDetail.create({
            product_id,
            data
        });

        res.status(201).json(newProductDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProductDetail = async (req, res) => {
    try {
        const productDetail = await ProductDetail.findByPk(req.params.id);
        if (!productDetail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }

        const updatedProductDetail = await productDetail.update(req.body);
        res.status(200).json(updatedProductDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProductDetail = async (req, res) => {
    try {
        const productDetail = await ProductDetail.findByPk(req.params.id);
        if (!productDetail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }

        await productDetail.destroy();
        res.status(200).json({ message: 'Product detail deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
