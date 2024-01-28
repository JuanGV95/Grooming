import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    code: {type: Number, required: true},
    purchase_datetime: {type: String, required: true},
    amount: {type: String, required: true},
    purchaser: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
}, {timestamps: true});

export default mongoose.model('Ticket', TicketSchema);