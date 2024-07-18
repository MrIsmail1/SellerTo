import express from 'express';
import { getAllStock, createStock, deleteStock } from '../controllers/stockController.js';

const router = express.Router();

router.get('/stock', getAllStock);
router.post('/stock', createStock);
router.delete('/stock/:id', deleteStock);

export default router;
