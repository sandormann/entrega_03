import mongoose from 'mongoose';
const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
	products:[
	   {
	   	product:{type: mongoose.SchemaTypes.ObjectId,ref:'products'},
	   	quantity: {type:Number, default:0}
	   }
	] 
}, {timestamps: true});

const cartModel = mongoose.model(cartsCollection, cartSchema);

export default cartModel;