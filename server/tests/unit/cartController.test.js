import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as cartController from '../../controllers/cartController.js';
import Cart from '../../models/postgres/cartModel.js';
import Product from '../../models/postgres/productModel.js';
import { mockRequest, mockResponse } from '../utils/mock-req-res.js';

// Mock Sequelize models
vi.mock('../../models/postgres/cartModel.js', () => {
  return {
    __esModule: true,
    default: {
      findOne: vi.fn(),
      create: vi.fn(),
      findAll: vi.fn(),
      destroy: vi.fn(),
    },
  };
});

vi.mock('../../models/postgres/productModel.js', () => {
  return {
    __esModule: true,
    default: {
      findByPk: vi.fn(),
    },
  };
});

describe('Cart Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addToCart', () => {
    it('should add a product to the cart', async () => {
      const req = mockRequest({
        body: { productId: 1 },
        user: { id: 1 },
      });
      const res = mockResponse();

      Product.findByPk.mockResolvedValue({ id: 1, product_stock: 10, save: vi.fn() });
      Cart.findOne.mockResolvedValue(null);
      Cart.create.mockResolvedValue({ id: 1 });
      Cart.findOne.mockResolvedValue({ id: 1, Product: { id: 1, name: 'Product 1' } });

      await cartController.addToCart(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(Cart.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, Product: { id: 1, name: 'Product 1' } });
    });

    it('should handle product not found or out of stock', async () => {
      const req = mockRequest({
        body: { productId: 1 },
        user: { id: 1 },
      });
      const res = mockResponse();

      Product.findByPk.mockResolvedValue(null);

      await cartController.addToCart(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found or out of stock' });
    });

    it('should handle internal server error', async () => {
      const req = mockRequest({
        body: { productId: 1 },
        user: { id: 1 },
      });
      const res = mockResponse();

      Product.findByPk.mockRejectedValue(new Error('Database error'));

      await cartController.addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur interne du serveur' });
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from the cart', async () => {
      const req = mockRequest({
        body: { cartItemId: 1 },
        user: { id: 1 },
      });
      const res = mockResponse();

      Cart.findOne.mockResolvedValue({ id: 1, productId: 1, Product: { id: 1, product_stock: 5 }, destroy: vi.fn() });
      Product.findByPk.mockResolvedValue({ id: 1, product_stock: 5, save: vi.fn() });

      await cartController.removeFromCart(req, res);

      expect(Cart.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 }, include: [{ model: Product, as: 'Product' }] });
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should handle internal server error', async () => {
      const req = mockRequest({
        body: { cartItemId: 1 },
        user: { id: 1 },
      });
      const res = mockResponse();

      Cart.findOne.mockRejectedValue(new Error('Database error'));

      await cartController.removeFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getCart', () => {
    it('should get the user\'s cart', async () => {
      const req = mockRequest({ user: { id: 1 } });
      const res = mockResponse();

      Cart.findAll.mockResolvedValue([{ id: 1, Product: { id: 1, name: 'Product 1' } }]);

      await cartController.getCart(req, res);

      expect(Cart.findAll).toHaveBeenCalledWith({ where: { userId: 1 }, include: [{ model: Product, as: 'Product' }] });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, Product: { id: 1, name: 'Product 1' } }]);
    });

    it('should handle internal server error', async () => {
      const req = mockRequest({ user: { id: 1 } });
      const res = mockResponse();

      Cart.findAll.mockRejectedValue(new Error('Database error'));

      await cartController.getCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateCartQuantity', () => {
    it('should update the quantity of a cart item', async () => {
      const req = mockRequest({
        body: { cartItemId: 1, quantity: 2 },
        user: { id: 1 },
      });
      const res = mockResponse();

      Cart.findOne.mockResolvedValue({ id: 1, quantity: 1, save: vi.fn(), Product: { id: 1, name: 'Product 1' } });

      await cartController.updateCartQuantity(req, res);

      expect(Cart.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 }, include: [{ model: Product, as: 'Product' }] });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, quantity: 2, Product: { id: 1, name: 'Product 1' } });
    });

    it('should return 404 if cart item not found', async () => {
      const req = mockRequest({
        body: { cartItemId: 1, quantity: 2 },
        user: { id: 1 },
      });
      const res = mockResponse();

      Cart.findOne.mockResolvedValue(null);

      await cartController.updateCartQuantity(req, res);

      expect(Cart.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 }, include: [{ model: Product, as: 'Product' }] });
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle internal server error', async () => {
      const req = mockRequest({
        body: { cartItemId: 1, quantity: 2 },
        user: { id: 1 },
      });
      const res = mockResponse();

      Cart.findOne.mockRejectedValue(new Error('Database error'));

      await cartController.updateCartQuantity(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
