import Product from '../models/productModel.js';

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
            const newProducts = await Product.insertMany(products);
            res.status(201).json(newProducts);
        } else {
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
        res.status(204).json({message: 'Product deleted'});
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
        query['product_information.Marque'] = filters.brand;
    }

    if (filters.sizeSsd) {
        query['product_information.Taille du disque dur'] = filters.sizeSsd;
    }

    if (filters.sizeRam) {
        query['product_information.Taille de la mémoire vive'] = filters.sizeRam;
    }

    if (filters.sizeScreen) {
        query['product_information.Taille de l\'écran'] = filters.sizeScreen;
    }

    if (filters.typeOfProcessor) {
        query['product_information.Type de processeur'] = filters.typeOfProcessor;
    }

    if (filters.speedOfProcessor) {
        query['product_information.Vitesse du processeur'] = filters.speedOfProcessor;
    }

    if (filters.typeOfStorage) {
        query['product_information.Technologie du disque dur'] = filters.typeOfStorage;
    }

    if (filters.color) {
        query['product_information.Couleur'] = filters.color;
    }

    if (filters.series) {
        query['product_information.Séries'] = filters.series;
    }

    if (filters.resolution) {
        query['product_information.Résolution'] = filters.resolution;
    }

    if (filters.gpu) {
        query['product_information.GPU'] = filters.gpu;
    }

    if (filters.weight) {
        query['product_information.Poids du produit'] = filters.weight;
    }

    if (filters.keyboardAndLanguage) {
        query['product_information.Langue du clavier'] = filters.keyboardAndLanguage;
    }

    if (filters.minPrice || filters.maxPrice) {
        query.$expr = {
            $and: []
        };

        if (filters.minPrice) {
            query.$expr.$and.push({
                $gte: [{ $toDouble: "$product_information.Prix" }, parseFloat(filters.minPrice)]
            });
        }
        if (filters.maxPrice) {
            query.$expr.$and.push({
                $lte: [{ $toDouble: "$product_information.Prix" }, parseFloat(filters.maxPrice)]
            });
        }

        if (query.$expr.$and.length === 0) {
            delete query.$expr;
        }
    }

    return query;
};