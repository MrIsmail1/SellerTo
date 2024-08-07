import PromoCodes from "../models/postgres/promoCodeModel.js";

function formatDate(dateObj) {
  const year = dateObj.year;
  const month = dateObj.month.toString().padStart(2, "0");
  const day = dateObj.day.toString().padStart(2, "0");
  return `${year}-${month}-${day}T00:00:00Z`;
}

export const validatePromoCode = async (req, res) => {
  const { code } = req.body;

  try {
    const promoCode = await PromoCodes.findOne({ where: { code } });

    if (!promoCode) {
      return res.sendStatus(404);
    }

    if (new Date(promoCode.expiry_date) < new Date()) {
      return res.sendStatus(400);
    }

    return res.status(200).json(promoCode);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const createPromoCode = async (req, res) => {
  const { code, discount, product_id, category, expiry_date } = req.body;
  const formattedExpiryDate = formatDate(expiry_date);
  try {
    const newPromoCode = await PromoCodes.create({
      code,
      discount,
      expiry_date: formattedExpiryDate,
      product_id: product_id || null,
      category,
    });
    return res.status(201).json(newPromoCode);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const updatePromoCode = async (req, res) => {
  const { id } = req.params;
  const { code, discount, expiry_date, product_id, category } = req.body;

  try {
    const promoCode = await PromoCodes.findByPk(id);

    if (!promoCode) {
      return res.sendStatus(404);
    }

    await promoCode.update({
      code,
      discount,
      expiry_date,
      product_id,
      category,
    });
    return res.status(200).json(promoCode);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deletePromoCode = async (req, res) => {
  const { id } = req.params;

  try {
    const promoCode = await PromoCodes.findByPk(id);

    if (!promoCode) {
      return res.sendStatus(404);
    }

    await promoCode.destroy();
    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCodes.findAll();
    return res.status(200).json(promoCodes);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const findPromoCodeById = async (req, res) => {
  const { id } = req.params;

  try {
    const stock = await PromoCodes.findByPk(id);
    if (!stock) {
      return res.sendStatus(404);
    }

    res.status(200).json(stock);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const patchPromoCode = async (req, res) => {
  const { id } = req.params;
  const { code, discount, expiry_date, product_id, category } = req.body;

  try {
    const promoCode = await PromoCodes.findByPk(id);
    if (!promoCode) {
      return res.sendStatus(404);
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
    res.sendStatus(500);
  }
};
