import { Router } from 'express';
import cartRouter from './cart.router.js';
import productsRouter from './products.router.js';

const router = Router();

router.use('/cart', cartRouter);
router.use('/products', productsRouter);

export default router;
