import mongoose, { Schema } from 'mongoose';
import cartModel from './cart.model.js';

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  providerId: { type: String, default: "" },
  provider: { type: String, default: "No provider" },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user',
  },
  age: { type: Number },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  documents: [{
    name: String,
    reference: String
  }],
  last_connection: { type: Date }
}, { timestamps: true });

userSchema.post('save', async function (user, next) {
  if (!user.cart) {
    try {
      const newCart = await cartModel.create({});
      user.cart = newCart._id;
      await user.save({ validateBeforeSave: false }); 
    } catch (error) {
      next(error);
    }
  }
});

export default mongoose.model('User', userSchema);
