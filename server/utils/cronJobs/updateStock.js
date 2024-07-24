import cron from 'node-cron';
import Stock from '../../models/postgres/stockModel.js';
import Product from '../../models/postgres/productModel.js';
import UserAlert from '../../models/postgres/userAlertsModel.js';
import { getUserByIdDiff } from "../../controllers/userController.js";
import {sendLowStockAlertEmail, sendRestockAlertEmail} from "../../services/mailer/mailService.js";

const updateProductStock = async () => {
    try {
        const products = await Product.findAll();

        for (const product of products) {
            const productId = product.id;

            const stocks = await Stock.findAll({ where: { productId } });
            const totalStock = stocks.reduce((total, stock) => {
                return stock.operationType === 'ADD' ? total + stock.quantity : total - stock.quantity;
            }, 0);

            const previousStock = product.product_stock;

            await Product.update({ product_stock: totalStock }, {
                where: { id: productId }
            });


            if (previousStock === 0 && totalStock > 0) {
                const userAlerts = await UserAlert.findAll({
                    where: {
                        alertId: 2,
                        productId: productId,
                        isActive: true,
                    }
                });

                for (const alert of userAlerts) {
                    try {
                        const user = await getUserByIdDiff({ params: { id: alert.userId } });
                        if (user && user.email) {
                            await sendRestockAlertEmail(user.email, product);
                        }
                    } catch (userError) {
                        throw new Error(`Error updating product: ${userError.message}`);
                    }
                }
            }

            if (totalStock < 4) {
                await sendLowStockAlertEmail(product);
            }
        }
    } catch (error) {
        throw new Error(`Error updating stock: ${error.message}`);
    }
};

const startStockUpdateCronJob = () => {
    cron.schedule('*/1 * * * *', updateProductStock);
};

export default startStockUpdateCronJob;
