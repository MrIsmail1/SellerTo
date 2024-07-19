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
