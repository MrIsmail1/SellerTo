import Product from "../models/mongo/productModel.js";
import Products from "../models/postgres/productModel.js";

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

export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId).select(
      "_id product_title product_price product_photo product_description product_category"
    );
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error("Error fetching product details");
  }
};

export const createProduct = async (req, res) => {
  try {
    const products = req.body;

    if (Array.isArray(products)) {
      const newProducts = await Products.bulkCreate(products, {
        returning: true,
        individualHooks: true,
      });
      res.status(201).json(newProducts);
    } else {
      const newProduct = await Products.create(products, {
        returning: true,
        individualHooks: true,
      });
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
    await product.save({ individualHooks: true });

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

    await product.update(req.body, { individualHooks: true });

    res.status(200).json(product);
  } catch (error) {
    res.status(500);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.id);
    console.log(product);
    if (!product) {
      return res.status(404);
    }
    await product.destroy({ individualHooks: true });

    res.status(204).json({ message: "Product deleted" });
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
            { product_title: { $regex: query, $options: "i" } },
            { product_description: { $regex: query, $options: "i" } },
          ],
        },
        filterQuery,
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500);
  }
};

const applyFilters = (filters) => {
  const query = {};

  if (filters.brand) {
    query["brand"] = filters.brand;
  }

  if (filters.sizeSsd) {
    query["sizeSsd"] = filters.sizeSsd;
  }

  if (filters.sizeRam) {
    query["sizeRam"] = filters.sizeRam;
  }

  if (filters.sizeScreen) {
    query["sizeScreen"] = filters.sizeScreen;
  }

  if (filters.typeOfProcessor) {
    query["typeOfProcessor"] = filters.typeOfProcessor;
  }

  if (filters.speedOfProcessor) {
    query["speedOfProcessor"] = filters.speedOfProcessor;
  }

  if (filters.typeOfStorage) {
    query["typeOfStorage"] = filters.typeOfStorage;
  }

  if (filters.color) {
    query["color"] = filters.color;
  }

  if (filters.series) {
    query["series"] = filters.series;
  }

  if (filters.resolution) {
    query["resolution"] = filters.resolution;
  }

  if (filters.gpu) {
    query["gpu"] = filters.gpu;
  }

  if (filters.weight) {
    query["weight"] = filters.weight;
  }

  if (filters.keyboardAndLanguage) {
    query["keyboardAndLanguage"] = filters.keyboardAndLanguage;
  }

  if (filters.minPrice || filters.maxPrice) {
    query.$expr = {
      $and: [],
    };

    if (filters.minPrice) {
      query.$expr.$and.push({
        $gte: [{ $toDouble: "$product_price" }, parseFloat(filters.minPrice)],
      });
    }
    if (filters.maxPrice) {
      query.$expr.$and.push({
        $lte: [{ $toDouble: "$product_price" }, parseFloat(filters.maxPrice)],
      });
    }

    if (query.$expr.$and.length === 0) {
      delete query.$expr;
    }
  }

  return query;
};
