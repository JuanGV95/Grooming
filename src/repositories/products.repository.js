import ProductDto from '../dto/product.dto.js';

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll(criteria, options) {
    const products = await this.dao.getAll(criteria, options);
    return products.map(product => new ProductDto(product));
  }

  async getById(id) {
    const product = await this.dao.getById(id);
    if (product) {
      return new ProductDto(product);
    }
    return null;
  }

  async create(productData) {
    const newProduct = await this.dao.create(productData);
    return new ProductDto(newProduct);
  }

  // Similar methods for update and delete
  async update(id, productData) {
    const updatedProduct = await this.dao.update(id, productData);
    return new ProductDto(updatedProduct);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }
}
