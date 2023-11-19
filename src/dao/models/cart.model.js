import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    products: {type: Array, default: []},
}, {timestamps: true});

export default mongoose.model('carts', CartSchema);