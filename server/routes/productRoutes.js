import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProductByTitleOrDescription
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts)
router.get('/search', searchProductByTitleOrDescription)
router.get('/:id', getProduct)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router;