import ProductModel from "./models/product.model.js";
import { logger } from "../config/logger.js";
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

    static async create(data) {
      try {
          const product = await ProductModel.create(data);
          logger.info(`Producto creado correctamente (${product._id})`);
          return product;
      } catch (error) {
          logger.error(`Error al crear el producto: ${error.message}`);
          throw error;
      }
  }

  static async updateById(pid, data) {
    try {
        await ProductModel.updateOne({ _id: pid }, { $set: data });
        logger.info(`Producto actualizado correctamente (${pid})`);
    } catch (error) {
        logger.error(`Error al actualizar el producto (${pid}): ${error.message}`);
        throw error;
    }
}

static async deleteById(pid) {
  try {
      await ProductModel.deleteOne({ _id: pid });
      logger.info(`Producto eliminado correctamente (${pid})`);
  } catch (error) {
      logger.error(`Error al eliminar el producto (${pid}): ${error.message}`);
      throw error;
  }
}

    static async updateProductStock(productId, newStock) {
      try {
          logger.info(`Actualizando stock del producto ${productId} a ${newStock}`);
          
          const product = await ProductModel.findByIdAndUpdate(
              productId,
              { $set: { stock: newStock } },
              { new: true } // Retorna el documento actualizado
          );
  
          if (!product) {
              throw new Error('Producto no encontrado');
          }
  
          logger.info(`Stock actualizado: ${product}`);
          return product;
      } catch (error) {
          logger.error('Error al actualizar el stock del producto:', error.message);
          throw error;
      }
  }

}