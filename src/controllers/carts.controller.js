import CartsService from "../services/carts.service.js";

export default class CartsController {
  static create() {
    return CartsService.create();
  }

  static getCartById(id) {
    return CartsService.getCartById(id);
  }

  static populateCart(id) {
    return CartsService.populateCart(id);
  }

  static async addProduct(cid, pid, quantity) {
    return CartsService.addProduct(cid, pid, quantity);
  }

  static delete(id) {
    return CartsService.delete(id);
  }

  static deleteItemFromCart(cid, pid) {
    return CartsService.deleteItemFromCart(cid, pid);
  }

  static deleteItemsFromCart(cartId) {
    return CartsService.deleteItemsFromCart(cartId);
  }
}