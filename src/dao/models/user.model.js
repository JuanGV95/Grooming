import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  providerId: { type: String, default: "" },
  provider: { type: String, default: "No provider"},
  cart: {type: mongoose.Schema.Types.ObjectId, ref: 'carts'},
  role: { type: String, 
    enum: ['user', 'admin'],
    default: 'user',  },
  age: { type: Number },
}, { timestamps: true });

export default mongoose.model('User', userSchema);