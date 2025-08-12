import mongoose from 'mongoose';
const DBconnection = async()=>{
	try{
		const connect = await mongoose.connect("mongodb+srv://main_user:FGbidGxQ5ejq1t97@mycluster.wgus3.mongodb.net/tienda_coder?retryWrites=true&w=majority&appName=MyCluster")
		console.log('MongoDB connected sucess');
		
	}catch(e){
		console.error(e)
		console.log('MongoDB Error' + e)
	}	
}
export default DBconnection;