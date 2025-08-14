import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productSchema = mongoose.Schema({
	title: String,
    description: String,
    code: String,
    price: String,
    status: Boolean,
    category: String
});

// mongoosePaginate.paginate.options = {
//     customLabels:{
//         docs:'payload',
//         totalDocs: 'totalProducts',
//         pagingCounter: false
//     }
// }
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productsCollection, productSchema);

export default productModel;