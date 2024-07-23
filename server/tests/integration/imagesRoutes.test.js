import request from 'supertest';
import express from 'express';
import imagesRoutes from '../../routes/imagesRoutes';
import Images from '../../models/postgres/imagesModel';
import Products from '../../models/postgres/productModel';
import Stock from '../../models/postgres/stockModel';
import denormalizeProduct from '../../services/denormalization/product';
import { uploadFiles } from '../../services/imageUploadService';
import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest';
import { setupDatabase, teardownDatabase } from '../utils/database';

const app = express();
app.use(express.json());
app.use('/api', imagesRoutes);

vi.mock('../../models/postgres/imagesModel');
vi.mock('../../models/postgres/productModel');
vi.mock('../../models/postgres/stockModel');
vi.mock('../../services/imageUploadService');
vi.mock('../../services/denormalization/product');

describe('Images Routes Integration Tests', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  describe('POST /api/products/images', () => {
    it('should create a product with images successfully', async () => {
      const productData = { name: 'Test Product', product_stock: 10 };
      const fileInfos = [{ originalname: 'image.jpg', path: 'uploads/image.jpg', size: 12345, mimetype: 'image/jpeg' }];

      Products.create.mockResolvedValue({ id: 1, name: 'Test Product' });
      Images.create.mockResolvedValue({ id: 1, url: 'uploads/image.jpg' });
      Stock.create.mockResolvedValue({});
      denormalizeProduct.mockResolvedValue({});
      uploadFiles.mockImplementation((req, res, cb) => cb(null, fileInfos));

      const res = await request(app)
        .post('/api/products/images')
        .field('productData', JSON.stringify(productData))
        .attach('images', 'path/to/image.jpg');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        product: { id: 1, name: 'Test Product' },
        files: [{ id: 1, url: 'uploads/image.jpg' }],
      });
    });
  });

  describe('POST /api/products/:productId/images', () => {
    it('should add images to an existing product successfully', async () => {
      const productId = 1;
      const fileInfos = [{ originalname: 'image.jpg', path: 'uploads/image.jpg', size: 12345, mimetype: 'image/jpeg' }];

      Products.findByPk.mockResolvedValue({ id: 1, name: 'Test Product' });
      Images.create.mockResolvedValue({ id: 1, url: 'uploads/image.jpg' });
      denormalizeProduct.mockResolvedValue({});
      uploadFiles.mockImplementation((req, res, cb) => cb(null, fileInfos));

      const res = await request(app)
        .post(`/api/products/${productId}/images`)
        .attach('images', 'path/to/image.jpg');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        files: [{ id: 1, url: 'uploads/image.jpg' }],
      });
    });
  });

  describe('DELETE /api/products/:productId/images/:imageId', () => {
    it('should delete a product image successfully', async () => {
      const productId = 1;
      const imageId = 1;

      Products.findByPk.mockResolvedValue({ id: 1, name: 'Test Product' });
      Images.findByPk.mockResolvedValue({ id: 1, url: 'uploads/image.jpg', destroy: vi.fn().mockResolvedValue({}) });

      const res = await request(app)
        .delete(`/api/products/${productId}/images/${imageId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Image deleted successfully' });
    });
  });
});
