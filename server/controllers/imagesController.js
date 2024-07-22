import Images from "../models/postgres/imagesModel.js";
import Products from "../models/postgres/productModel.js";
import Stock from "../models/postgres/stockModel.js";
import denormalizeProduct from "../services/denormalization/product.js";
import { uploadFiles } from "../services/imageUploadService.js";
import {sendNewProductAlertEmail} from "../services/mailer/mailService.js";
import {getUserById} from "./userController.js";
import UserAlert from "../models/postgres/userAlertsModel.js";

// Controller function to handle product creation with image validation
export const createProductWithImages = async (req, res) => {
  uploadFiles(req, res, async (err, fileInfos) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    } else {
      const productData = JSON.parse(req.body.productData);
      try {
        const newProduct = await Products.create(productData, {
          returning: true,
          individualHooks: true,
        });

        const filePromises = fileInfos.map(async (file) => {
          const newImage = await Images.create({
            title: file.originalname,
            url: file.path,
            description: "",
            size: file.size,
            width: null,
            height: null,
            format: file.mimetype.split("/")[1],
            productId: newProduct.id,
          });
          return newImage;
        });

        const savedFiles = await Promise.all(filePromises);

        if (productData.product_stock) {
          await Stock.create({
            productId: newProduct.id,
            quantity: productData.product_stock,
            operationType: "ADD",
          });
        }

        await denormalizeProduct(newProduct.id, {
          Product: Products,
          Images: Images,
        });

        const userAlerts = await UserAlert.findAll({
          where: {
            alertId: 3,
            category: newProduct.product_category,
            isActive: true,
          }
        });

        // TODO : Gérer mieux les erreurs
        for (const alert of userAlerts) {
          try {
            const user = await getUserById(alert.userId);
            if (user && user.email) {
              await sendNewProductAlertEmail(user.email, newProduct);
            }
          } catch (userError) {
            console.error('Error fetching user:', userError.message);
          }
        }

        return res.json({ product: newProduct, files: savedFiles });
      } catch (dbError) {
        return res.status(500);
      }
    }
  });
};


// Controller function to handle image creation for an existing product
export const addImagesToProduct = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400);
  }

  try {
    const product = await Products.findByPk(productId);
    if (!product) {
      return res.status(404);
    }

    uploadFiles(req, res, async (err, fileInfos) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      } else {
        try {
          const filePromises = fileInfos.map(async (file) => {
            const newImage = await Images.create({
              title: file.originalname,
              url: file.path,
              description: "",
              size: file.size,
              width: null,
              height: null,
              format: path
                .extname(file.originalname)
                .toLowerCase()
                .substring(1),
              productId: product.id,
            });
            return newImage;
          });

          const savedFiles = await Promise.all(filePromises);
          // Denormalize the product
          await denormalizeProduct(productId, {
            Product: Products,
            Images: Images,
          });
          return res.json({ files: savedFiles });
        } catch (dbError) {
          return res.status(500);
        }
      }
    });
  } catch (error) {
    return res.status(500);
  }
};

export const deleteProductImage = async (req, res) => {
  const { productId, imageId } = req.params;

  if (!productId || !imageId) {
    return res.status(400);
  }

  try {
    const product = await Products.findByPk(productId);
    if (!product) {
      return res.status(404);
    }

    const image = await Images.findByPk(imageId);
    if (!image) {
      return res.status(404);
    }

    // TODO : Retour incorrect
    await image.destroy();
    return res.json({ message: "Image deleted successfully" });
  } catch (error) {
    return res.status(500);
  }
};
