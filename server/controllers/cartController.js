import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';


// Ajouter un produit au panier
export const addToCart = async (req, res) => {
  console.log(req.body);
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const product = await Product.findById(productId);
    if (!product || product.product_stock <= 0) {
      console.error(`Product not available or out of stock: ${productId}`);
      return res.status(404).json({ message: 'Product not available' });
    }

    // Réduire le stock du produit
    product.product_stock--;
    await product.save();

    // Ajouter le produit au panier
    const cartItem = await Cart.create({ productId, userId });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};



// Supprimer un produit du panier
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const cartItem = await Cart.findOne({ productId, userId });
    if (!cartItem) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    // Rétablir le stock du produit
    const product = await Product.findById(productId);
    if (product) {
      product.product_stock++;
      await product.save();
    }

    await Cart.deleteOne({ _id: cartItem._id });
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};


// Récupérer les produits du panier
export const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const carts = await Cart.find({ userId }).populate('productId');
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nettoyage des articles expirés (à exécuter périodiquement)
export const cleanExpiredCarts = async () => {
  try {
    const expiredTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes
    const expiredItems = await Cart.find({
      addedAt: { $lt: expiredTime }
    });

    for (const item of expiredItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.product_stock++;
        await product.save();
      }
      await item.remove();
    }
  } catch (error) {
    console.error('Error cleaning expired cart items:', error);
  }
};
