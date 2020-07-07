const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const orderSchema = new Schema({
	userId: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: { 
        type: Object, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    },
    postCode: { 
        type: String, 
        required: true 
    },
    userName: { 
        type: String, 
        required: true 
    },
    paymentId: { 
        type: String, 
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Order', orderSchema);