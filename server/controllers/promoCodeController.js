import PromoCodes from '../models/postgres/promoCodeModel.js';

export const validatePromoCode = async (req, res) => {
    const { code } = req.body;

    try {
        const promoCode = await PromoCodes.findOne({ where: { code } });

        if (!promoCode) {
            return res.status(404).json({ message: 'Code promo non trouvé.' });
        }

        if (new Date(promoCode.expiry_date) < new Date()) {
            return res.status(400).json({ message: 'Le code promo a expiré.' });
        }

        return res.status(200).json(promoCode);
    } catch (error) {
        return res.status(500);
    }
};

export const createPromoCode = async (req, res) => {
    const { code, discount, expiry_date, product_id, category } = req.body;

    try {
        const newPromoCode = await PromoCodes.create({ code, discount, expiry_date, product_id, category });
        return res.status(201).json(newPromoCode);
    } catch (error) {
        return res.status(500);
    }
};

export const updatePromoCode = async (req, res) => {
    const { id } = req.params;
    const { code, discount, expiry_date, product_id, category } = req.body;

    try {
        const promoCode = await PromoCodes.findByPk(id);

        if (!promoCode) {
            return res.status(404);
        }

        await promoCode.update({ code, discount, expiry_date, product_id, category });
        return res.status(200).json(promoCode);
    } catch (error) {
        return res.status(500);
    }
};

export const deletePromoCode = async (req, res) => {
    const { id } = req.params;

    try {
        const promoCode = await PromoCodes.findByPk(id);

        if (!promoCode) {
            return res.status(404);
        }

        await promoCode.destroy();
        return res.status(204);
    } catch (error) {
        return res.status(500);
    }
};

export const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCodes.findAll();
        return res.status(200).json(promoCodes);
    } catch (error) {
        return res.status(500);
    }
};

export const findPromoCodeById = async (req, res) => {
    const { id } = req.params;

    try {
        const stock = await PromoCodes.findByPk(id);
        if (!stock) {
            return res.status(404);
        }

        res.status(200).json(stock);
    } catch (error) {
        res.status(500);
    }
};

export const patchPromoCode = async (req, res) => {
    const { id } = req.params;
    const { code, discount, expiry_date, product_id, category } = req.body;

    try {
        const promoCode = await PromoCodes.findByPk(id);
        if (!promoCode) {
            return res.status(404);
        }

        if (code !== undefined) {
            promoCode.code = code;
        }
        if (discount !== undefined) {
            promoCode.discount = discount;
        }
        if (expiry_date !== undefined) {
            promoCode.expiry_date = expiry_date;
        }
        if (product_id !== undefined) {
            promoCode.product_id = product_id;
        }
        if (category !== undefined) {
            promoCode.category = category;
        }

        await promoCode.save();
        res.status(200).json(promoCode);
    } catch (error) {
        res.status(500);
    }
};