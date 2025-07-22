import { Router } from 'express';
const viewsRouter = Router();

viewsRouter.get('/products',(req, res) => {
	res.render('products');
});
viewsRouter.get('/form',(req, res) => {
	res.render('form');
});
export default viewsRouter;