import archiver from "archiver";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import Order from "../models/mongo/orderModel.js";
import Orders from "../models/postgres/orderModel.js";
import Users from "../models/postgres/userModel.js";
import { createInvoicePDF } from "../services/invoiceService.js";
import { getProductById } from "./productController.js";
import { getUserById } from "./userController.js";
import { Payment, PaymentProduct } from "../models/postgres/paymentModel.js";

async function getProductDetails(productId) {
  return await getProductById(productId);
}

async function getUserDetails(userId) {
  return await getUserById(userId);
}

export const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Orders.findAll({
      where: {
        userId: userId,
      },
    });

        const detailedOrders = await Promise.all(
            orders.map(async (order) => {
                const productDetails = await getProductDetails(order.productId);
                const userDetails = await getUserDetails(order.userId);

                // Find the payment record using paymentIntentId
                const payment = await Payment.findOne({
                    where: {
                        paymentIntentId: order.paymentIntentId,
                    }
                });

                let paymentProducts = [];
                if (payment) {
                    // Get PaymentProduct using paymentId
                    paymentProducts = await PaymentProduct.findAll({
                        where: {
                            paymentId: payment.id,
                        }
                    });
                }

                return {
                    ...order.toJSON(),
                    product: productDetails,
                    user: userDetails,
                    paymentProducts: paymentProducts,
                };
            })
        );

        res.status(200).json(detailedOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getDashboardData = async (req, res) => {
    const { timeFrame } = req.query;

    if (!timeFrame) {
        return res.status(400);
    }

    try {
        const now = new Date();
        let startDate;

        switch (timeFrame) {
            case '-1h':
                startDate = new Date(now.getTime() - 60 * 60 * 1000);
                break;
            case '-12h':
                startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000);
                break;
            case '-1d':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '-1w':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '-1m':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case '-3m':
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case '-6m':
                startDate = new Date(now.setMonth(now.getMonth() - 6));
                break;
            case '-1y':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            case '-3y':
                startDate = new Date(now.setFullYear(now.getFullYear() - 3));
                break;
            default:
                throw new Error('Invalid time frame');
        }

        const bestSellingProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: "$productId",
                    product_title: { $first: "$product.product_title" },
                    product_category: { $first: "$product.product_category" },
                    totalQuantity: { $sum: "$quantity" },
                    totalRevenue: { $sum: { $multiply: ["$quantity", "$product.product_price"] } }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 }
        ]);

        const totalRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" }
                }
            }
        ]);

        res.json({
                bestSellingProducts,
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0
        });
    } catch (error) {
        res.status(500);
    }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll();

    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const productDetails = await getProductDetails(order.productId);
        const userDetails = await Users.findByPk(order.userId, {
          attributes: {
            exclude: [
              "password",
              "resetPasswordToken",
              "resetPasswordExpire",
              "passwordChangedAt",
              "role",
              "confirmationToken",
              "confirmationTokenExpires",
              "isVerified",
              "loginAttempts",
              "lockUntil",
              "createdAt",
              "updatedAt",
            ],
          },
        });
        return {
          ...order.toJSON(),
          product: productDetails,
          user: userDetails,
        };
      })
    );

    res.status(200).json(detailedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur de récuperation des commandes." });
  }
};

export const generateInvoices = async (req, res) => {
  const orders = req.body;

  if (!orders || orders.length === 0) {
    return res.status(400).json({ message: "No selected orders." });
  }

  try {
    // Generate a single PDF if only one order is provided
    if (orders.length === 1) {
      const order = orders[0];
      const pdfBuffer = await createInvoicePDF(order);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=facture_${order.orderUnique}.pdf`
      );
      return res.send(pdfBuffer);
    }

    // Generate multiple PDFs and zip them if multiple orders are provided
    const __dirname = path.resolve();
    const tempDir = path.join(__dirname, "..", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const zipFilePath = path.join(
      tempDir,
      `facture_orders_${new Date().toISOString()}.zip`
    );
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    output.on("close", () => {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=facture_orders_${new Date().toISOString()}.zip`
      );
      res.sendFile(zipFilePath, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error occurred while sending the zip file");
        }
        // Cleanup the temporary zip file after sending it
        fs.unlinkSync(zipFilePath);
      });
    });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);

    for (const order of orders) {
      const pdfBuffer = await createInvoicePDF(order);
      archive.append(pdfBuffer, { name: `facture_${order.orderUnique}.pdf` });
    }

    await archive.finalize();
  } catch (error) {
    console.error("Error generating invoices:", error);
    res.status(500).json({ message: "Error generating invoices" });
  }
};
