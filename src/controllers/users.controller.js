import UsersService from "../services/users.service.js";
import { BadRequest } from "../utils/exception.js";

export default class UsersController {
  static create(payload) {
    return UsersService.create(payload);
  }

  static findByEmail(email) {
    return UsersService.findByEmail(email);
  }

  static async createUserCart(payload) {
    const { firstName, email, age } = payload;
    if (!firstName || !email || !age) {
      throw new BadRequest("Missing required fields");
    }

    return UsersService.createUserCart(payload);
  }

  static updateById(id, payload) {
    return UsersService.updateById(id, payload);
  }

  static deleteById(id) {
    return UsersService.deleteById(id);
  }
}