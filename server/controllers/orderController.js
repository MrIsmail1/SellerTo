import archiver from "archiver";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import Order from "../models/mongo/orderModel.js";
import Orders from "../models/postgres/orderModel.js";
import { Payment, PaymentProduct } from "../models/postgres/paymentModel.js";
import Users from "../models/postgres/userModel.js";
import { createInvoicePDF } from "../services/invoiceService.js";
import { getProductById } from "./productController.js";
import { getUserById } from "./userController.js";

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
          },
        });

        let paymentProducts = [];
        if (payment) {
          // Get PaymentProduct using paymentId
          paymentProducts = await PaymentProduct.findAll({
            where: {
              paymentId: payment.id,
            },
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

export async function sendDeliveryConfirmationEmail(
  userEmail,
  trackingNumber,
  userName,
  userAddress,
  orderDate,
  products
) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const productItems = products
    .map(
      (product) => `
    <div style="display: flex; align-items: center; margin-bottom: 20px;">
      <img src="${product.photo}" alt="Product Image" style="width: 200px; height: 200px; object-fit: cover; margin-right: 20px; border-radius: 5px;">
      <div>
        <p style="color: #000;"><strong>${product.title}</strong></p>
        <p style="color: #000;">Vendu par ${product.vendor}<br>Qté : ${product.quantity}<br>EUR : ${product.price} €</p>
      </div>
    </div>
  `
    )
    .join("");

  let info = await transporter.sendMail({
    from: '"SellerTo" <no-reply@sellerto.com>',
    to: userEmail,
    subject: "Confirmation de livraison par SellerTo",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; border: 1px solid #e0e0e0; padding: 20px; border-radius: 5px;">
        <h2 style="color: #000;">Bonjour,</h2>
        <p style="color: #000;">Nous vous remercions pour votre commande. Nous vous tiendrons informé par e-mail lorsque les articles de votre commande auront été expédiés.</p>
        <p style="color: #000;">Votre date de livraison estimée est indiquée ci-dessous. Vous pouvez suivre l'état de votre commande dans <a href="http://localhost:5173/orders" style="color: #000;">Vos commandes sur SellerTo</a>.</p>

        <div style="border-top: 1px solid #e0e0e0; margin: 20px 0;"></div>

        <h3 style="color: #000;">Confirmation de votre commande</h3>
        <p style="color: #000;"><strong>Livraison prévue le </strong> ${orderDate}</p>
        <p style="color: #000;"><strong>Votre commande sera expédiée à :</strong></p>
        <p style="color: #000;">${userName}<br>${userAddress}</p>
        <p style="color: #000;"><strong>Votre mode de livraison :</strong> Livraison Prioritaire</p>
        <p style="color: #000;"><strong>Vos préférences d'expédition :</strong> Envoyer chaque article dès qu'il est disponible.</p>
        <p style="color: #000;"><strong>Commande n°:</strong> ${trackingNumber}</p>

        <a href="http://localhost:5173/orders" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #0e51c2; color: #fff; text-decoration: none; border-radius: 5px;">Afficher les détails de la commande</a>

        <div style="border-top: 1px solid #e0e0e0; margin: 20px 0;"></div>

        ${productItems}
      </div>
    `,
  });
}

const generateXAxisDates = (startDate, now, timeFrame) => {
  const dates = [];
  let currentDate = new Date(startDate);

  switch (timeFrame) {
    case "-1h":
      while (currentDate <= now) {
        dates.push(currentDate.toISOString().substring(11, 16)); // HH:MM
        currentDate.setMinutes(currentDate.getMinutes() + 1);
      }
      break;
    case "-12h":
      while (currentDate <= now) {
        dates.push(currentDate.toISOString().substring(11, 13) + ":00"); // HH:00
        currentDate.setHours(currentDate.getHours() + 1);
      }
      break;
    case "-1d":
      while (currentDate <= now) {
        dates.push(currentDate.toISOString().substring(11, 13) + ":00"); // HH:00
        currentDate.setHours(currentDate.getHours() + 1);
      }
      break;
    case "-1w":
      while (currentDate <= now) {
        dates.push(currentDate.toISOString().substring(0, 10)); // YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
      }
      break;
    case "-1m":
    case "-3m":
    case "-6m":
      while (currentDate <= now) {
        dates.push(currentDate.toISOString().substring(0, 10)); // YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
      }
      break;
    case "-1y":
    case "-3y":
      while (currentDate <= now) {
        dates.push(currentDate.toISOString().substring(0, 7)); // YYYY-MM
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      break;
    default:
      throw new Error("Invalid time frame");
  }

  return dates;
};
const formatCreatedAtDate = (date, timeFrame) => {
  switch (timeFrame) {
    case "-1h":
      return date.toISOString().substring(11, 16); // HH:MM
    case "-12h":
    case "-1d":
      return date.toISOString().substring(11, 13) + ":00"; // HH:00
    case "-1w":
    case "-1m":
    case "-3m":
    case "-6m":
      return date.toISOString().substring(0, 10); // YYYY-MM-DD
    case "-1y":
    case "-3y":
      return date.toISOString().substring(0, 7); // YYYY-MM
    default:
      throw new Error("Invalid time frame");
  }
};

export const getDashboardData = async (req, res) => {
  const { timeFrame, dataType, bestSalesOption, selectedProductOrCategory } =
    req.body;

  if (!timeFrame || !dataType) {
    return res
      .status(400)
      .json({ message: "Time frame and data type are required" });
  }

  try {
    const now = new Date();
    let startDate;

    switch (timeFrame) {
      case "-1h":
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "-12h":
        startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000);
        break;
      case "-1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "-1w":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "-1m":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "-3m":
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case "-6m":
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "-1y":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case "-3y":
        startDate = new Date(now.setFullYear(now.getFullYear() - 3));
        break;
      default:
        throw new Error("Invalid time frame");
    }

    const matchCriteria = { createdAt: { $gte: startDate } };

    if (
      dataType === "Meilleur ventes" &&
      bestSalesOption &&
      selectedProductOrCategory
    ) {
      if (bestSalesOption === "product") {
        matchCriteria.productId = selectedProductOrCategory;
      } else if (bestSalesOption === "category") {
        matchCriteria["product.product_category"] = selectedProductOrCategory;
      }
    }

    const formatDateField = {
      $dateToString: {
        format: "",
        date: "$createdAt",
      },
    };

    switch (timeFrame) {
      case "-1h":
        formatDateField.$dateToString.format = "%Y-%m-%dT%H:%M";
        break;
      case "-12h":
      case "-1d":
        formatDateField.$dateToString.format = "%Y-%m-%dT%H:00";
        break;
      case "-1w":
      case "-1m":
      case "-3m":
      case "-6m":
        formatDateField.$dateToString.format = "%Y-%m-%d";
        break;
      case "-1y":
      case "-3y":
        formatDateField.$dateToString.format = "%Y-%m";
        break;
    }

    let responseData;

    switch (dataType) {
      case "Meilleur ventes":
        responseData = await Order.aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: {
                productId: "$productId",
                date: formatDateField,
              },
              product_title: { $first: "$product.product_title" },
              product_category: { $first: "$product.product_category" },
              totalQuantity: { $sum: "$quantity" },
              totalRevenue: {
                $sum: { $multiply: ["$quantity", "$product.product_price"] },
              },
            },
          },
          { $sort: { "_id.date": 1, totalQuantity: -1 } },
        ]);
        break;
      case "Revenue totales":
        responseData = await Order.aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: formatDateField,
              totalRevenue: { $sum: "$amount" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "Nombre de commandes":
        responseData = await Order.aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: formatDateField,
              totalOrders: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      default:
        throw new Error("Invalid data type");
    }

    const xAxisDates = generateXAxisDates(startDate, now, timeFrame);
    console.log(responseData, xAxisDates);

    res.json({
      responseData,
      xAxisDates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
