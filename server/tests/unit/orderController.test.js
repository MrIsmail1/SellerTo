import {describe, expect, it, vi} from 'vitest';
import {getUserOrders} from '../../controllers/orderController.js';
import Orders from '../../models/postgres/orderModel.js';
import {Payment, PaymentProduct} from '../../models/postgres/paymentModel.js';
import * as productController from '../../controllers/productController.js';
import * as userController from '../../controllers/userController.js';

vi.mock('../../models/postgres/orderModel.js');
vi.mock('../../models/postgres/userModel.js');
vi.mock('../../models/postgres/paymentModel.js');
vi.mock('../../controllers/productController.js');
vi.mock('../../controllers/userController.js');
vi.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: vi.fn().mockResolvedValue(true),
  }),
}));

describe('orderController', () => {
  describe('getUserOrders', () => {
    it('should return user orders with product and user details', async () => {
      const req = { user: { id: 1 } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const orders = [
        { id: 1, productId: 1, userId: 1, paymentIntentId: 'pi_123', toJSON: vi.fn().mockReturnValue({ id: 1 }) },
      ];

      Orders.findAll.mockResolvedValue(orders);
      productController.getProductById.mockResolvedValue({ id: 1, name: 'Product 1' });
      userController.getUserById.mockResolvedValue({ id: 1, name: 'User 1' });
      Payment.findOne.mockResolvedValue({ id: 1 });
      PaymentProduct.findAll.mockResolvedValue([{ id: 1, name: 'Product 1' }]);

      await getUserOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          product: { id: 1, name: 'Product 1' },
          user: { id: 1, name: 'User 1' },
          paymentProducts: [{ id: 1, name: 'Product 1' }],
        },
      ]);
    });

    it('should handle errors', async () => {
      const req = { user: { id: 1 } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

      Orders.findAll.mockRejectedValue(new Error('Database error'));

      await getUserOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

});
