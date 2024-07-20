import UserAlert from '../models/postgres/userAlertsModel.js';

export const addUserAlert = async (req, res) => {
    try {
        const { userId, alertId, productId, category } = req.body;
        const userAlert = await UserAlert.create({
            userId,
            alertId,
            productId,
            category,
        });
        res.status(201).json(userAlert);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user alert' });
    }
};
