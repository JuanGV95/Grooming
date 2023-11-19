import ProductModel from "./models/product.model.js";

export default class ProductManager{
    static get(){
        return ProductModel.find();
    }
    static async getById(pid) {
        const product = await ProductModel.findById(pid);
        console.log('product', product);
        if(!product){
            throw new Error('Producto no encontrado.');
        }
        return product;
    }

    static async create(data){
        const product = await ProductModel.create(data);
        console.log(`Producto creado correctamente (${product._id})`);
        return product;
    }

    static async updateById(pid, data){
        await ProductModel.updateOne({ _id: pid }, { $set: data });
        console.log(`Producto actualizado correctamente (${pid})`);
    }

    static async deleteById(pid){
        console.log('pid', pid);
        await ProductModel.deleteOne({_id: pid});
        console.log(`Producto eliminado correctamente (${pid})`);
    }

}