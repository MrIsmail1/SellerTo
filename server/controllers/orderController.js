import archiver from "archiver";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import Order from "../models/mongo/orderModel.js";
import Widget from "../models/mongo/widgetModel.js"; // Import du modèle de widget

import Orders from "../models/postgres/orderModel.js";
import { Payment, PaymentProduct } from "../models/postgres/paymentModel.js";
import Users from "../models/postgres/userModel.js";
import { createInvoicePDF } from "../services/invoiceService.js";
import { getProductById } from "./productController.js";
import {getUserById, getUserByIdDiff} from "./userController.js";

// TODO : Check Restfull
async function getProductDetails(productId) {
  return await getProductById(productId);
}

async function getUserDetails(userId) {
  return await getUserByIdDiff(userId);
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
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: error.message });
  }
};


export const calculateData = async (widget) => {
  const now = new Date();
  let startDate;

  switch (widget.timeFrame) {
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
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "-3m":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "-6m":
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    case "-1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case "-3y":
      startDate = new Date(now.getTime() - 3 * 365 * 24 * 60 * 1000);
      break;
    default:
      throw new Error("Invalid time frame");
  }

  const matchCriteria = { createdAt: { $gte: startDate } };

  let responseData;

  if (widget.displayType === "KPI") {
    switch (widget.dataType) {
      case "count_products":
        responseData = await Order.aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: null,
              totalProducts: { $sum: "$quantity" },
            },
          },
        ]);
        return responseData.length > 0 ? responseData[0].totalProducts : 0;
      case "ca_product":
        responseData = await Order.aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$amount" },
            },
          },
        ]);
        return responseData.length > 0 ? responseData[0].totalRevenue : 0;
      case "count_orders":
        responseData = await Order.aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
            },
          },
        ]);
        return responseData.length > 0 ? responseData[0].totalOrders : 0;
      case "ca_orders":
        responseData = await Order.aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$amount" },
            },
          },
        ]);
        return responseData.length > 0 ? responseData[0].totalRevenue : 0;
      case "count_users":
        responseData = await Order.aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: "$userId",
            },
          },
          {
            $group: {
              _id: null,
              totalUsers: { $sum: 1 },
            },
          },
        ]);
        return responseData.length > 0 ? responseData[0].totalUsers : 0;
      default:
        throw new Error("Invalid data type");
    }
  } else {
    const groupInterval = getGroupInterval(widget.selectedStep);
    const orders = await Order.find(matchCriteria);
    const xAxisDates = generateXAxisDates(startDate, now, widget.timeFrame, widget.selectedStep);
    const dataMap = new Map(xAxisDates.map((date) => [date, 0]));

    orders.forEach((order) => {
      const closestDate = findClosestDate(order.createdAt, xAxisDates);
      if (dataMap.has(closestDate)) {
        updateDataMap(dataMap, closestDate, widget.dataType, order);
      }
    });

    const labels = Array.from(dataMap.keys());
    const data = Array.from(dataMap.values());

    return {
      labels,
      datasets: [
        {
          label: widget.dataType,
          data,
        },
      ],
    };
  }
};

const getGroupInterval = (selectedStep) => {
  switch (selectedStep) {
    case "1 minute":
    case "2 minutes":
    case "5 minutes":
    case "10 minutes":
    case "20 minutes":
    case "30 minutes":
      return "%Y-%m-%dT%H:%M";
    case "1 heure":
    case "2 heures":
    case "3 heures":
    case "6 heures":
    case "12 heures":
      return "%Y-%m-%dT%H";
    case "1 jour":
    case "2 jours":
    case "3 jours":
    case "5 jours":
    case "7 jours":
      return "%Y-%m-%d";
    case "1 semaine":
    case "2 semaines":
    case "3 semaines":
    case "1 mois":
      return "%Y-%W";
    case "1 mois":
    case "2 mois":
    case "3 mois":
      return "%Y-%m";
    case "1 an":
    case "2 ans":
    case "3 ans":
      return "%Y";
    default:
      throw new Error("Invalid selected step");
  }
};

const generateXAxisDates = (startDate, now, timeFrame, selectedStep) => {
  const dates = [];
  let currentDate = new Date(startDate);

  const interval = getStepInterval(selectedStep);

  while (currentDate <= now) {
    dates.push(currentDate.toISOString().substring(0, interval.length)); // Adjust the length based on interval
    currentDate = new Date(currentDate.getTime() + interval.ms);
  }

  return dates;
};

const getStepInterval = (selectedStep) => {
  switch (selectedStep) {
    case "1 minute":
      return { ms: 60 * 1000, length: 16 }; // YYYY-MM-DDTHH:MM
    case "2 minutes":
      return { ms: 2 * 60 * 1000, length: 16 };
    case "5 minutes":
      return { ms: 5 * 60 * 1000, length: 16 };
    case "10 minutes":
      return { ms: 10 * 60 * 1000, length: 16 };
    case "20 minutes":
      return { ms: 20 * 60 * 1000, length: 16 };
    case "30 minutes":
      return { ms: 30 * 60 * 1000, length: 16 };
    case "1 heure":
      return { ms: 60 * 60 * 1000, length: 13 }; // YYYY-MM-DDTHH
    case "2 heures":
      return { ms: 2 * 60 * 60 * 1000, length: 13 };
    case "3 heures":
      return { ms: 3 * 60 * 60 * 1000, length: 13 };
    case "6 heures":
      return { ms: 6 * 60 * 60 * 1000, length: 13 };
    case "12 heures":
      return { ms: 12 * 60 * 60 * 1000, length: 13 };
    case "1 jour":
      return { ms: 24 * 60 * 60 * 1000, length: 10 }; // YYYY-MM-DD
    case "2 jours":
      return { ms: 2 * 24 * 60 * 60 * 1000, length: 10 };
    case "3 jours":
      return { ms: 3 * 24 * 60 * 60 * 1000, length: 10 };
    case "5 jours":
      return { ms: 5 * 24 * 60 * 60 * 1000, length: 10 };
    case "7 jours":
      return { ms: 7 * 24 * 60 * 60 * 1000, length: 10 };
    case "1 semaine":
      return { ms: 7 * 24 * 60 * 60 * 1000, length: 10 };
    case "2 semaines":
      return { ms: 14 * 24 * 60 * 60 * 1000, length: 10 };
    case "3 semaines":
      return { ms: 21 * 24 * 60 * 60 * 1000, length: 10 };
    case "1 mois":
      return { ms: 30 * 24 * 60 * 60 * 1000, length: 7 }; // YYYY-MM
    case "2 mois":
      return { ms: 60 * 24 * 60 * 60 * 1000, length: 7 };
    case "3 mois":
      return { ms: 90 * 24 * 60 * 60 * 1000, length: 7 };
    case "1 an":
      return { ms: 365 * 24 * 60 * 60 * 1000, length: 4 }; // YYYY
    case "2 ans":
      return { ms: 2 * 365 * 24 * 60 * 60 * 1000, length: 4 };
    case "3 ans":
      return { ms: 3 * 365 * 24 * 60 * 60 * 1000, length: 4 };
    default:
      throw new Error("Invalid selected step");
  }
};

const findClosestDate = (targetDate, dates) => {
  let closestDate = null;
  let minDiff = Infinity;

  dates.forEach((date) => {
    const diff = Math.abs(new Date(date) - new Date(targetDate));
    if (diff < minDiff) {
      minDiff = diff;
      closestDate = date;
    }
  });

  return closestDate;
};

const updateDataMap = (dataMap, closestDate, dataType, order) => {
  switch (dataType) {
    case "count_orders":
      dataMap.set(closestDate, dataMap.get(closestDate) + 1);
      break;
    case "ca_orders":
      dataMap.set(closestDate, dataMap.get(closestDate) + order.amount);
      break;
    case "count_products":
      dataMap.set(closestDate, dataMap.get(closestDate) + order.quantity);
      break;
    case "ca_product":
      dataMap.set(closestDate, dataMap.get(closestDate) + order.amount);
      break;
    case "count_users":
      dataMap.set(closestDate, dataMap.get(closestDate) + 1);
      break;
    default:
      throw new Error("Invalid data type");
  }
};


export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const widgets = await Widget.find({ userId });
    const widgetDataPromises = widgets.map(async (widget) => {
      const data = await calculateData(widget);

      if (widget.displayType === "KPI") {
        widget.KPIdata = data;
      } else {
        widget.data = data;
      }

      await widget.save();
      return { widget };
    });

    const widgetData = await Promise.all(widgetDataPromises);
    res.status(200).json(widgetData);
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
