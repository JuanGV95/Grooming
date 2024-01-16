import ProductDao from "../dao/products.dao.js";

export default class ProductsService {
  static getAll(queryCriteria, options) {
    return ProductDao.getAll(queryCriteria, options);
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