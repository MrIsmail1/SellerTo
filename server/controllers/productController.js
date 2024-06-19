import Product from '../models/productModel.js';
import Products from "../models/productPostgresModel.js";

export const getProducts = async (req, res) => {
    try {
        const filters = req.query;
        const query = applyFilters(filters);

        const products = await Product.find(query);
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

        if (Array.isArray(products)) {
            const newProducts = await Products.bulkCreate(products, { returning: true });
            const productsWithIds = newProducts.map(product => ({
                ...product.dataValues,
                _id: product.id
            }));
            await Product.insertMany(productsWithIds);
            res.status(201).json(newProducts);
        } else {
            // Mongo
            const newProduct = await Products.create(products, { returning: true });

            const newProductMongo = new Product({
                ...newProduct.dataValues,
                _id: newProduct.id
            });
            await newProductMongo.save();
            res.status(201).json(newProduct);
        }
    } catch (error) {
        res.status(500);
    }
};


export const updateProduct = async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id);
        if (!product) {
            return res.status(404);
        }

        Object.assign(product, req.body);
        await product.save();

        // Update in MongoDB
        const productMongo = await Product.findById(req.params.id);
        if (productMongo) {
            Object.assign(productMongo, req.body);
            await productMongo.save();
        } else {
            const newProductMongo = new Product({ _id: req.params.id, ...req.body });
            await newProductMongo.save();
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500);
    }
};

export const patchProduct = async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id);
        if (!product) {
            return res.status(404);
        }

        await product.update(req.body);

        // Patch in MongoDB
        const productMongo = await Product.findById(req.params.id);
        if (productMongo) {
            await productMongo.updateOne(req.body);
        } else {
            const newProductMongo = new Product({ _id: req.params.id, ...req.body });
            await newProductMongo.save();
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id);
        if (!product) {
            return res.status(404);
        }
        await product.destroy();

        // Delete in MongoDB
        const productMongo = await Product.findById(req.params.id);
        if (productMongo) {
            await productMongo.remove();
        }

        res.status(204).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500);
    }
};

export const searchProductByTitleOrDescription = async (req, res) => {
    try {
        const { query } = req.query;
        const filters = req.query;
        const filterQuery = applyFilters(filters);

        const products = await Product.find({
            $and: [
                {
                    $or: [
                        { product_title: { $regex: query, $options: 'i' } },
                        { product_description: { $regex: query, $options: 'i' } }
                    ]
                },
                filterQuery
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500);
    }
};

const applyFilters = (filters) => {
    const query = {};

    if (filters.brand) {
        query['brand'] = filters.brand;
    }

    if (filters.sizeSsd) {
        query['sizeSsd'] = filters.sizeSsd;
    }

    if (filters.sizeRam) {
        query['sizeRam'] = filters.sizeRam;
    }

    if (filters.sizeScreen) {
        query['sizeScreen'] = filters.sizeScreen;
    }

    if (filters.typeOfProcessor) {
        query['typeOfProcessor'] = filters.typeOfProcessor;
    }

    if (filters.speedOfProcessor) {
        query['speedOfProcessor'] = filters.speedOfProcessor;
    }

    if (filters.typeOfStorage) {
        query['typeOfStorage'] = filters.typeOfStorage;
    }

    if (filters.color) {
        query['color'] = filters.color;
    }

    if (filters.series) {
        query['series'] = filters.series;
    }

    if (filters.resolution) {
        query['resolution'] = filters.resolution;
    }

    if (filters.gpu) {
        query['gpu'] = filters.gpu;
    }

    if (filters.weight) {
        query['weight'] = filters.weight;
    }

    if (filters.keyboardAndLanguage) {
        query['keyboardAndLanguage'] = filters.keyboardAndLanguage;
    }

    if (filters.minPrice || filters.maxPrice) {
        query.$expr = {
            $and: []
        };

        if (filters.minPrice) {
            query.$expr.$and.push({
                $gte: [{ $toDouble: "$product_price" }, parseFloat(filters.minPrice)]
            });
        }
        if (filters.maxPrice) {
            query.$expr.$and.push({
                $lte: [{ $toDouble: "$product_price" }, parseFloat(filters.maxPrice)]
            });
        }

        if (query.$expr.$and.length === 0) {
            delete query.$expr;
        }
    }

    return query;
};
