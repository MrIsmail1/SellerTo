import PromoCodes from '../models/postgres/promoCodeModel.js';

export const validatePromoCode = async (req, res) => {
    const { code } = req.body;

    try {
        const promoCode = await PromoCodes.findOne({ where: { code } });

        if (!promoCode) {
            return res.status(404).json({ error: 'Code promo introuvable' });
        }

        if (new Date(promoCode.expiry_date) < new Date()) {
            return res.status(400).json({ error: 'Code promo expiré' });
        }

        return res.json(promoCode);
    } catch (error) {
        console.error('Error validating promo code:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
