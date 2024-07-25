import UserAlert from '../models/postgres/userAlertsModel.js';

import {sendNewsletterEmail} from "../services/mailer/mailService.js";
import { getUserByIdDiff } from "./userController.js";

export const addUserAlert = async (req, res) => {
    try {
        const { userId, alertId, productId, category } = req.body;

        if (!userId || !alertId) {
            return res.sendStatus(400);
        }

        const userAlert = await UserAlert.create({
            userId,
            alertId,
            productId,
            category,
        });

        res.status(201).json(userAlert);
    } catch (error) {
        res.sendStatus(500);
    }
};

export const getAlertsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const userAlerts = await UserAlert.findAll({
            where: { userId }
        });

        res.status(200).json(userAlerts);
    } catch (error) {
        res.sendStatus(500);
    }
};

export const getAlertsByUserIdAndProductId = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const userAlerts = await UserAlert.findAll({
            where: { userId, productId }
        });

        res.status(200).json(userAlerts);
    } catch (error) {
        res.sendStatus(500);
    }
};

export const getAlertsByUserIdAndCategory = async (req, res) => {
    try {
        const { userId, category } = req.params;

        const userAlerts = await UserAlert.findAll({
            where: { userId, category }
        });

        res.status(200).json(userAlerts);
    } catch (error) {
        res.sendStatus(500);
    }
};

export const updateUserAlerts = async (req, res) => {
    try {
        const updates = req.body;

        const updatePromises = updates.map(async (update) => {
            const { userId, alertId, productId, category, isActive } = update;

            if (!userId || !alertId || isActive === undefined) {
                return res.sendStatus(400);
            }

            const whereClause = { userId, alertId };
            if (productId !== null && productId !== undefined) {
                whereClause.productId = productId;
            } else {
                whereClause.productId = null;
            }
            if (category !== null && category !== undefined) {
                whereClause.category = category;
            } else {
                whereClause.category = null;
            }

            const [userAlert, created] = await UserAlert.findOrCreate({
                where: whereClause,
                defaults: { isActive }
            });

            if (!created) {
                userAlert.isActive = isActive;
                await userAlert.save();
            }
        });

        await Promise.all(updatePromises);

        res.status(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

export const sendNewsletter = async (req, res) => {
    const { subject, message } = req.body;

    try {

        const userAlerts = await UserAlert.findAll({
            where: {
                alertId: 1,
                isActive: true
            },
        });

        for (const alert of userAlerts) {
            try {
                const user = await getUserByIdDiff(alert.userId);
                if (user && user.email) {
                    await sendNewsletterEmail(user.email, subject, message);
                }
            } catch (userError) {
            }
        }

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

