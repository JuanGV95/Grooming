import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true}
}, { _id: false })

const CartSchema = new mongoose.Schema({
    products: { type: [cartItemSchema], default: [] },   
}, { timestamps: true });

 CartSchema.pre('find', function () {
     this.populate('products.product');
 })

export default mongoose.model('carts', CartSchema);
