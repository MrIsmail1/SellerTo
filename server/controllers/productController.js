const products = require('../models/productModel.js')

export const getProducts = async (req, res) => {
    res.json(products)
};

export const getProduct = async (req, res) => {
    const productResult = products.filter(product => product.id == req.params.id);

    if (!productResult) {
        return res.status(404).send('Product not found')
    }
    res.json(productResult)
};

export const createProduct = async (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        description: req.body.description,
        color: req.body.color,
        price: req.body.price
    }
    products.create(newProduct)
    res.status(201).json(newProduct)
};

export const updateProduct = async (req, res) => {
    const id = Number(req.params.id)
    const index = products.update(req.id)
    const updatedProduct = {
        id: products[index].id,
        name: req.body.name,
        price: req.body.price
    }

    products[index] = updatedProduct
    res.status(200).json('Product updated')
};

export const deleteProduct = async (req, res) => {
    const id = Number(req.params.id)
    const index = products.findIndex(product => product.id === id)
    products.splice(index,1)
    res.status(200).json('Product deleted')
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}