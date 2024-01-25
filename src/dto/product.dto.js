export default class ProductDto {
    constructor(product) {
      this.id = product._id;
      this.title = product.title;
      this.code = product.code;
      this.category = product.category;
      this.description = product.description;
      this.stock = product.stock;
      this.price = product.price;
      this.status = product.status;
      this.thumbnails = product.thumbnails;
    }
  }