import Sequelize from 'sequelize';
import Cart from '../models/postgres/cartModel.js';
import Product from '../models/postgres/productModel.js';

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findByPk(productId);
    if (!product || product.product_stock <= 0) {
      return res.status(404).json({ message: 'Product not found or out of stock' });
    }

    let cartItem = await Cart.findOne({ where: { productId, userId } });

    if (cartItem) {
      cartItem.quantity += 1;
      cartItem.reservedUntil = new Date(Date.now() + 15 * 60 * 1000); // Mise à jour du délai de réservation à 15 minutes
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        productId,
        userId,
        quantity: 1,
        reservedUntil: new Date(Date.now() + 15 * 60 * 1000), // Définir le délai de réservation à 15 minutes
      });
    }

    product.product_stock--;
    await product.save();

    const detailedCartItem = await Cart.findOne({
      where: { id: cartItem.id },
      include: [{
        model: Product,
        as: 'Product'
      }],
    });

    res.status(201).json(detailedCartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const removeFromCart = async (req, res) => {
  const { cartItemId } = req.body;
  const userId = req.user.id;

  try {
    const cartItem = await Cart.findOne({ where: { id: cartItemId, userId }, include: [{ model: Product, as: 'Product' }] });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const product = await Product.findByPk(cartItem.productId);
    if (product) {
      product.product_stock++;
      await product.save();
    }

    await Cart.destroy({ where: { id: cartItem.id } });
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const carts = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        as: 'Product'
      }],
    });
    res.status(200).json(carts);
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCartQuantity = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cartItem = await Cart.findOne({ where: { id: cartItemId, userId }, include: [{ model: Product, as: 'Product' }] });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Cart item quantity updated', cartItem });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const cleanExpiredCarts = async () => {
  try {
    const expiredTime = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes pour les tests
    const expiredItems = await Cart.findAll({
      where: {
        reservedUntil: { [Sequelize.Op.lt]: expiredTime }
      },
      include: [{ model: Product, as: 'Product' }]
    });

    for (const item of expiredItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        product.product_stock++;
        await product.save();
      }
      await Cart.destroy({ where: { id: item.id } });
    }
  } catch (error) {
    console.error('Error cleaning expired cart items:', error);
  }
};
