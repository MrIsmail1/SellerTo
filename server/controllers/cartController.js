import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

const cleanExpiredItems = async () => {
  const expiredTime = new Date(Date.now() - 5 * 1000); // 5 secondes pour les tests
  const expiredItems = await Cart.find({
    reservedUntil: { $lt: expiredTime }
  });

  for (const item of expiredItems) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.product_stock++;
      await product.save();
    }
    await Cart.deleteOne({ _id: item._id });
  }
};

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // PostgreSQL user ID

  try {
    await cleanExpiredItems(); // Nettoyer les éléments expirés avant d'ajouter au panier

    const product = await Product.findById(productId);
    if (!product || product.product_stock <= 0) {
      return res.status(404).json({ message: 'Product not available or out of stock' });
    }

    const existingCartItem = await Cart.findOne({ productId, userId });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      existingCartItem.reservedUntil = new Date(Date.now() + 5 * 1000); // Réinitialiser le temps de réservation
      await existingCartItem.save();
    } else {
      const cartItem = new Cart({
        productId,
        userId: userId.toString(),
        quantity: 1,
        reservedUntil: new Date(Date.now() + 5 * 1000) // 5 secondes à partir de maintenant
      });
      await cartItem.save();
    }

    product.product_stock--;
    await product.save();

    res.status(201).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  const userId = req.user.id.toString();

  try {
    await cleanExpiredItems(); // Nettoyer les éléments expirés avant de récupérer le panier

    const carts = await Cart.find({ userId }).populate('productId');
    res.status(200).json(carts);
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  const userId = req.user.id.toString();

  try {
    const cartItem = await Cart.findOne({ _id: cartItemId, userId });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    cartItem.reservedUntil = new Date(Date.now() + 5 * 1000); // Réinitialiser le temps de réservation
    await cartItem.save();

    res.status(200).json({ message: 'Cart item quantity updated', cartItem });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { cartItemId } = req.body;
  const userId = req.user.id.toString();

  try {
    const cartItem = await Cart.findOne({ _id: cartItemId, userId });
    if (!cartItem) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    const product = await Product.findById(cartItem.productId);
    if (product) {
      product.product_stock++;
      await product.save();
    }

    await Cart.deleteOne({ _id: cartItem._id });
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: error.message });
  }
};