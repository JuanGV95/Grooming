import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    user: String,
    body: String,
},{timestamps: true});

export default mongoose.model('Message', MessageSchema);