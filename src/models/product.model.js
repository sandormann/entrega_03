import mongoose from 'mongoose';

const productsCollection = 'products';

const productSchema = mongoose.Schema({
	title: String,
    description: String,
    code: String,
    price: String,
    status: Boolean,
    category: String
});

const productModel = mongoose.model(productsCollection, productSchema);

export default productModel;