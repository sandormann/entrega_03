import { Router } from 'express';
import cartRouter from './cart.router.js';
import productsRouter from './products.router.js';

const router = Router();

router.use('/', cartRouter);
router.use('/', productsRouter);

export default router;
