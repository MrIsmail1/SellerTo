import express from 'express';
import { getProductDetails, getProductDetail, createProductDetail, updateProductDetail, deleteProductDetail } from '../controllers/productDetailController.js';

const router = express.Router();

router.get('/', getProductDetails);
router.get('/:id', getProductDetail);
router.post('/', createProductDetail);
router.put('/:id', updateProductDetail);
router.delete('/:id', deleteProductDetail);

export default router;
