import ProductModel from "./models/product.model.js";

export default class ProductManager{
    static async getAll(queryCriteria, { page, limit, sort }) {
        try {
          const query = ProductModel.find(queryCriteria);
          if (sort) {
            query.sort(sort); 
          }
          const resultsPerPage = parseInt(limit) || 10;
          const startIndex = (parseInt(page) - 1) * resultsPerPage;
          query.skip(startIndex).limit(resultsPerPage);
    
          const products = await query.exec();
          const total = await ProductModel.countDocuments(queryCriteria);
    
          return {
            products,
            total,
            pages: Math.ceil(total / resultsPerPage),
            currentPage: parseInt(page)
          };
        } catch (error) {
          throw error;
        }
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