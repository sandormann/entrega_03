import mongoose from 'mongoose';

const cartsCollection = 'carts';

const cartSchema = mongoose.Schema({
	products:[
		{
		product:{
			title: String,
			price: String
			}
		}
	] 
}, {timestamps: true});

const cartModel = mongoose.model(cartsCollection, cartSchema);

export default cartModel;