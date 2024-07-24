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
      cartItem.reservedUntil = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        productId,
        userId,
        quantity: 1,
        reservedUntil: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes
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

    // Schedule the removal of the cart item
    setTimeout(async () => {
      const currentTime = new Date();
      const item = await Cart.findOne({ where: { id: cartItem.id } });
      if (item && item.reservedUntil < currentTime) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          product.product_stock++;
          await product.save();
        }
        await Cart.destroy({ where: { id: item.id } });
        console.log(`Removed cart item ID: ${item.id} after 3 minutes`);
      }
    }, 3 * 60 * 1000); // 3 minutes
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500);
  }
};



export const removeFromCart = async (req, res) => {
  const { cartItemId } = req.body;
  const userId = req.user.id;

  try {
    const cartItem = await Cart.findOne({ where: { id: cartItemId, userId }, include: [{ model: Product, as: 'Product' }] });

    const product = await Product.findByPk(cartItem.productId);
    if (product) {
      product.product_stock++;
      await product.save();
    }

    await Cart.destroy({ where: { id: cartItem.id } });

    res.status(204);
  } catch (error) {
    res.status(500);
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
    res.status(500);
  }
};

export const updateCartQuantity = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cartItem = await Cart.findOne({ where: { id: cartItemId, userId }, include: [{ model: Product, as: 'Product' }] });
    if (!cartItem) {
      return res.status(404);
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500);
  }
};
