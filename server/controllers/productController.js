import Product from "../models/mongo/productModel.js";
import Products from "../models/postgres/productModel.js";
import Stock from "../models/postgres/stockModel.js";
import UserAlert from "../models/postgres/userAlertsModel.js";
import { sendPriceChangeAlertEmail } from "../services/mailer/mailService.js";
import { getUserById } from "./userController.js";
export const getProducts = async (req, res) => {
  try {
    const filters = req.query;
    if (filters.query) {
      return searchProductByTitleOrDescription(req, res);
    }

    const query = applyFilters(filters);
    const products = await Product.find(query);
    res.status(200).json(products);
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
    res.status(200).json(product);
  } catch (error) {
    res.status(500);
  }
};

export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId).select(
      "_id product_title product_price product_description product_category"
    );
    if (!product) {
      res.status(404);
    }
    res.status(200).json(product);
  } catch (error) {
    throw new Error("Error fetching product details");
  }
};

export const createProduct = async (req, res) => {
  try {
    const products = req.body;

    // TODO : Je sais pas pourquoi il y a deux fois un create c'est bizarre faut peut-être en retiré
    if (Array.isArray(products)) {
      const newProducts = await Products.bulkCreate(products, {
        returning: true,
        individualHooks: true,
      });

      const stockEntries = newProducts.map((product) => ({
        productId: product.id,
        quantity: product.product_stock,
        operationType: "ADD",
      }));

      await Stock.bulkCreate(stockEntries);

      res.status(201).json(newProducts);
    } else {
      const newProduct = await Products.create(products, {
        returning: true,
        individualHooks: true,
      });

      if (newProduct.product_stock) {
        await Stock.create({
          productId: newProduct.id,
          quantity: newProduct.product_stock,
          operationType: "ADD",
        });
      }

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
    // Récupérer le produit avant la mise à jour
    const existingProduct = await Products.findByPk(req.params.id);
    if (!existingProduct) {
      return res.status(404);
    }

    const [updated] = await Products.update(req.body, {
      where: { id: req.params.id },
      individualHooks: true,
    });

    if (!updated) {
      return res.status(404);
    }

    const updatedProduct = await Products.findByPk(req.params.id);

    if (existingProduct.product_price !== updatedProduct.product_price) {
      const userAlerts = await UserAlert.findAll({
        where: {
          alertId: 4,
          productId: req.params.id,
          isActive: true,
        },
      });

      // TODO : Gérer mieux les erreurs
      for (const alert of userAlerts) {
        try {
          const user = await getUserById(alert.userId);
          if (user && user.email) {
            await sendPriceChangeAlertEmail(user.email, updatedProduct);
          }
        } catch (userError) {
          console.error("Error fetching user:", userError.message);
        }
      }
    }

    res.status(200).json(updatedProduct);
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
    await product.destroy({ individualHooks: true });

    res.status(204);
  } catch (error) {
    res.status(500);
  }
};

export const searchProductByTitleOrDescription = async (req, res) => {
  try {
    const { query } = req.query;
    const filters = req.query;
    const filterQuery = applyFilters(filters);

    const products = await Product.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { product_title: { $regex: query, $options: "i" } },
                { product_description: { $regex: query, $options: "i" } },
              ],
            },
            filterQuery,
          ],
        },
      },
      {
        $addFields: {
          score: {
            $cond: {
              if: {
                $regexMatch: {
                  input: "$product_title",
                  regex: query,
                  options: "i",
                },
              },
              then: 10,
              else: {
                $cond: {
                  if: {
                    $regexMatch: {
                      input: "$product_description",
                      regex: query,
                      options: "i",
                    },
                  },
                  then: 5,
                  else: 0,
                },
              },
            },
          },
        },
      },
      { $sort: { score: -1 } },
    ]);

    res.status(200).json(products);
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
