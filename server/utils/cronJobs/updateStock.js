import cron from 'node-cron';
import Stock from '../../models/postgres/stockModel.js';
import Product from '../../models/postgres/productModel.js';
import UserAlert from '../../models/postgres/userAlertsModel.js';
import {getUserById} from "../../controllers/userController.js";
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

                // TODO : Gérer mieux les erreurs
                for (const alert of userAlerts) {
                    try {
                        const user = await getUserById({ params: { id: alert.userId } });
                        if (user && user.email) {
                            await sendRestockAlertEmail(user.email, product);
                            console.log('Restock email sent to:', user.email);
                        }
                    } catch (userError) {
                        console.error('Error fetching user:', userError.message);
                    }
                }
            }

            if (totalStock < 4) {
                await sendLowStockAlertEmail(product);
            }
        }
        // TODO : Gérer mieux les erreurs
    } catch (error) {
        console.error('Error updating stocks:', error);
    }
};

const startStockUpdateCronJob = () => {
    cron.schedule('*/5 * * * *', updateProductStock);
    console.log('Cron job scheduled: Product stock update every 5 minutes');
};

export default startStockUpdateCronJob;
