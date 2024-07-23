import { describe, it, expect, vi } from 'vitest';
import { createProductWithImages, addImagesToProduct, deleteProductImage } from '../../controllers/imagesController';
import Images from '../../models/postgres/imagesModel';
import Products from '../../models/postgres/productModel';
import Stock from '../../models/postgres/stockModel';
import { uploadFiles } from '../../services/imageUploadService';
import denormalizeProduct from '../../services/denormalization/product';

vi.mock('../../models/postgres/imagesModel');
vi.mock('../../models/postgres/productModel');
vi.mock('../../models/postgres/stockModel');
vi.mock('../../services/imageUploadService');
vi.mock('../../services/denormalization/product');

const mockRequest = (body, params) => ({
  body,
  params,
});

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('Images Controller', () => {
  describe('createProductWithImages', () => {
    it('should create a product with images successfully', async () => {
      const req = mockRequest({
        body: {
          productData: JSON.stringify({ name: 'Test Product', product_stock: 10 }),
        },
      });
      const res = mockResponse();

      const fileInfos = [{ originalname: 'image.jpg', path: 'uploads/image.jpg', size: 12345, mimetype: 'image/jpeg' }];
      uploadFiles.mockImplementation((req, res, cb) => cb(null, fileInfos));
      Products.create.mockResolvedValue({ id: 1, name: 'Test Product' });
      Images.create.mockResolvedValue({ id: 1, url: 'uploads/image.jpg' });
      Stock.create.mockResolvedValue({});
      denormalizeProduct.mockResolvedValue({});

      await createProductWithImages(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        product: { id: 1, name: 'Test Product' },
        files: [{ id: 1, url: 'uploads/image.jpg' }],
      });
    });

    it('should handle upload error', async () => {
      const req = mockRequest({
        body: {
          productData: JSON.stringify({ name: 'Test Product', product_stock: 10 }),
        },
      });
      const res = mockResponse();

      uploadFiles.mockImplementation((req, res, cb) => cb(new Error('Upload error')));

      await createProductWithImages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Upload error' });
    });

    it('should handle database error', async () => {
      const req = mockRequest({
        body: {
          productData: JSON.stringify({ name: 'Test Product', product_stock: 10 }),
        },
      });
      const res = mockResponse();

      const fileInfos = [{ originalname: 'image.jpg', path: 'uploads/image.jpg', size: 12345, mimetype: 'image/jpeg' }];
      uploadFiles.mockImplementation((req, res, cb) => cb(null, fileInfos));
      Products.create.mockRejectedValue(new Error('Database error'));

      await createProductWithImages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('addImagesToProduct', () => {
    it('should add images to an existing product successfully', async () => {
      const req = mockRequest({ productId: 1 });
      const res = mockResponse();

      Products.findByPk.mockResolvedValue({ id: 1, name: 'Test Product' });
      const fileInfos = [{ originalname: 'image.jpg', path: 'uploads/image.jpg', size: 12345, mimetype: 'image/jpeg' }];
      uploadFiles.mockImplementation((req, res, cb) => cb(null, fileInfos));
      Images.create.mockResolvedValue({ id: 1, url: 'uploads/image.jpg' });
      denormalizeProduct.mockResolvedValue({});

      await addImagesToProduct(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        files: [{ id: 1, url: 'uploads/image.jpg' }],
      });
    });

    it('should handle product not found', async () => {
      const req = mockRequest({ productId: 1 });
      const res = mockResponse();

      Products.findByPk.mockResolvedValue(null);

      await addImagesToProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle upload error', async () => {
      const req = mockRequest({ productId: 1 });
      const res = mockResponse();

      Products.findByPk.mockResolvedValue({ id: 1, name: 'Test Product' });
      uploadFiles.mockImplementation((req, res, cb) => cb(new Error('Upload error')));

      await addImagesToProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Upload error' });
    });
  });

  describe('deleteProductImage', () => {
    it('should delete a product image successfully', async () => {
      const req = mockRequest({}, { productId: 1, imageId: 1 });
      const res = mockResponse();

      Products.findByPk.mockResolvedValue({ id: 1, name: 'Test Product' });
      Images.findByPk.mockResolvedValue({ id: 1, url: 'uploads/image.jpg', destroy: vi.fn().mockResolvedValue({}) });

      await deleteProductImage(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Image deleted successfully' });
    });

    it('should handle product not found', async () => {
      const req = mockRequest({}, { productId: 1, imageId: 1 });
      const res = mockResponse();

      Products.findByPk.mockResolvedValue(null);

      await deleteProductImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle image not found', async () => {
      const req = mockRequest({}, { productId: 1, imageId: 1 });
      const res = mockResponse();

      Products.findByPk.mockResolvedValue({ id: 1, name: 'Test Product' });
      Images.findByPk.mockResolvedValue(null);

      await deleteProductImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
