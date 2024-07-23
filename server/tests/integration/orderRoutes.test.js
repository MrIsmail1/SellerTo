import request from 'supertest';
import express from 'express';
import orderRoutes from '../../routes/orderRoutes.js';
import Orders from '../../models/postgres/orderModel.js';
import Users from '../../models/postgres/userModel.js';
import { Payment, PaymentProduct } from '../../models/postgres/paymentModel.js';
import * as productController from '../../controllers/productController.js';
import * as userController from '../../controllers/userController.js';

// Mock des modules
vi.mock('../../models/postgres/orderModel.js');
vi.mock('../../models/postgres/userModel.js');
vi.mock('../../models/postgres/paymentModel.js');
vi.mock('../../controllers/productController.js');
vi.mock('../../controllers/userController.js');

// Mock des middlewares d'authentification et de rôle
vi.mock('../../middlewares/checkAuth.js', () => ({
  checkAuth: (req, res, next) => {
    req.user = { id: 1, role: 'User' }; // Simule un utilisateur authentifié
    next();
  }
}));
vi.mock('../../middlewares/checkRole.js', () => ({
  checkRole: () => (req, res, next) => {
    next();
  }
}));

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('orderRoutes', () => {
  describe('GET /api/orders', () => {
    it('should return user orders with product and user details', async () => {
      const orders = [
        { id: 1, productId: 1, userId: 1, paymentIntentId: 'pi_123', toJSON: vi.fn().mockReturnValue({ id: 1 }) },
      ];

      Orders.findAll.mockResolvedValue(orders);
      productController.getProductById.mockResolvedValue({ id: 1, name: 'Product 1' });
      userController.getUserById.mockResolvedValue({ id: 1, name: 'User 1' });
      Payment.findOne.mockResolvedValue({ id: 1 });
      PaymentProduct.findAll.mockResolvedValue([{ id: 1, name: 'Product 1' }]);

      const res = await request(app).get('/api/orders');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          id: 1,
          product: { id: 1, name: 'Product 1' },
          user: { id: 1, name: 'User 1' },
          paymentProducts: [{ id: 1, name: 'Product 1' }],
        },
      ]);
    });

    it('should handle errors', async () => {
      Orders.findAll.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/api/orders');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Database error' });
    });
  });
});
