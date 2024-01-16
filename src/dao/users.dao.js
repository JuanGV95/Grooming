import userModel from "./models/user.model.js";

export default class UserDao {
  static create(payload) {
    return userModel.create(payload);
  }

  static findByEmail(email) {
    return userModel.findOne({ email: email });
  }

  static updateById(id, payload) {
    return userModel.updateOne({ _id: id }, { $set: payload });
  }

  static deleteById(id) {
    return userModel.deleteOne({ _id: id });
  }
}