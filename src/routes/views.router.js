import { Router } from 'express';
const viewsRouter = Router();

viewsRouter.get('/',(req, res) => {
	res.render('products');
});
viewsRouter.get('/form',(req, res) => {
	res.render('form');
});
viewsRouter.get('/product',(req, res) => {
	res.render('productViewer');
});
viewsRouter.get('/cart',(req, res) => {
	res.render('cart');
});
export default viewsRouter;