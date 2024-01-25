
import ProductDao from "../dao/products.dao.js";
export default class ProductsService {
  static async getAll(queryCriteria, options) {
    console.log('queryCriteria:', queryCriteria);
    console.log('Options:', options);
    //return ProductDao.getAll(queryCriteria, options);
    const result = await ProductDao.getAll(queryCriteria, options);
    return result;
  }

  static getProduct(id) {
    return ProductDao.getProduct(id);
  }

  static create(payload) {
    return ProductDao.create(payload);
  }

  static updateById(id, payload) {
    return ProductDao.updateById(id, payload);
  }

  static deleteById(id) {
    return ProductDao.deleteById(id);
  }
}