import cron from 'node-cron';
import Orders from '../../models/postgres/orderModel.js';

const deliveryStatuses = [
    "Paiement validé, colis pris en charge par La Poste",
    "En cours d'acheminement",
    "Arrivé sur le site de distribution",
    "A disposition en point de retrait",
    "Courrier distribué"
];

const getNextStatus = (currentStatus) => {
    const currentIndex = deliveryStatuses.indexOf(currentStatus);
    if (currentIndex < 0 || currentIndex >= deliveryStatuses.length - 1) {
        return null;
    }
    return deliveryStatuses[currentIndex + 1];
};

async function updateOrderStatuses() {
    try {
        const orders = await Orders.findAll();

        const ordersToUpdate = orders.filter(order => order.status !== "Courrier distribué");

        for (let order of ordersToUpdate) {
            const nextStatus = getNextStatus(order.status);
            if (nextStatus) {
                order.status = nextStatus;
                await order.save();
            } else {
                console.log(`Order ${order.id} has reached the final status ${order.status}`);
            }
        }
    } catch (error) {
        console.error('Error updating order statuses:', error);
    }
}

const startCronJob = () => {
    cron.schedule('*/1 * * * *', updateOrderStatuses);
};

export default startCronJob;
