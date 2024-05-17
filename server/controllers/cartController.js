import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import { Op } from 'sequelize';

// Ajouter un produit au panier
export const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const product = await Product.findByPk(productId);
    if (!product || product.product_stock <= 0) {
      return res.status(404).json({ message: 'Product not available' });
    }

    // Réduire le stock du produit
    product.product_stock--;
    await product.save();

    // Ajouter le produit au panier
    const cart = await Cart.create({ productId, userId });
    res.status(201).json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un produit du panier
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ where: { productId, userId } });
    if (!cart) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    // Rétablir le stock du produit
    const product = await Product.findByPk(productId);
    product.product_stock++;
    await product.save();

    await cart.destroy();
    res.status(200).json({ message: 'Product removed from cart' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les produits du panier
export const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const carts = await Cart.findAll({ 
      where: { userId },
      include: [{ model: Product, as: 'product' }]
    });
    res.status(200).json(carts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nettoyage des articles expirés (à exécuter périodiquement)
export const cleanExpiredCarts = async () => {
  try {
    const expiredTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes
    const expiredItems = await Cart.findAll({
      where: {
        addedAt: {
          [Op.lt]: expiredTime,
        },
      },
    });

    for (const item of expiredItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        product.product_stock++;
        await product.save();
      }
      await item.destroy();
    }
  } catch (error) {
    console.error('Error cleaning expired cart items:', error);
  }
};
