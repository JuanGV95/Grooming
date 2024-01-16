import UserDao from "../dao/user.dao.js";
import CartsService from "./carts.service.js";

export default class UsersService {
  static create(payload) {
    return UserDao.create(payload);
  }

  static findByEmail(email) {
    return UserDao.findByEmail(email);
  }

  static async createUserCart(payload) {         
    const shopping_cart = await CartsService.create();
    payload.cart = shopping_cart._id;
    return UserDao.create(payload);          
  }

  static updateById(id, payload) {
    return UserDao.updateById(id, payload); 
  }

  static deleteById(id) {
    return UserDao.deleteById(id);
  }
}