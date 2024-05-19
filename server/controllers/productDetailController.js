import ProductDetail from '../models/productDetailModel.js';
import Product from '../models/productModel.js';

export const getProductDetails = async (req, res) => {
    try {
        const productDetails = await ProductDetail.find().populate('product_id');
        res.json(productDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductDetail = async (req, res) => {
    try {
        const productDetail = await ProductDetail.findById(req.params.id).populate('product_id');
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
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const newProductDetail = new ProductDetail({
            product_id,
            data
        });

        await newProductDetail.save();
        res.status(201).json(newProductDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProductDetail = async (req, res) => {
    try {
        const productDetail = await ProductDetail.findById(req.params.id);
        if (!productDetail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }

        Object.assign(productDetail, req.body);
        await productDetail.save();
        res.status(200).json(productDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProductDetail = async (req, res) => {
    try {
        const productDetail = await ProductDetail.findById(req.params.id);
        if (!productDetail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }

        await productDetail.remove();
        res.status(200).json({ message: 'Product detail deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
