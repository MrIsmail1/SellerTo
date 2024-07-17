import cron from 'node-cron';
import Stock from '../../models/postgres/stockModel.js';
import Product from '../../models/postgres/productModel.js';

const updateProductStock = async () => {
    try {
        const products = await Product.findAll();

        for (const product of products) {
            const productId = product.id;

            const stocks = await Stock.findAll({ where: { productId } });
            const totalStock = stocks.reduce((total, stock) => {
                return stock.operationType === 'ADD' ? total + stock.quantity : total - stock.quantity;
            }, 0);

            await Product.update({ product_stock: totalStock }, {
                where: { id: productId }
            });
        }

        console.log('Stocks updated successfully');
    } catch (error) {
        console.error('Error updating stocks:', error);
    }
};

const startStockUpdateCronJob = () => {
    cron.schedule('*/5 * * * *', updateProductStock);
    console.log('Cron job scheduled: Product stock update every 5 minutes');
};

export default startStockUpdateCronJob;
