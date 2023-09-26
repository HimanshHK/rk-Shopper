const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
  buyerEmail: {
    type: String,
    required: true,
  },
  cartItems: {
    type: Array,
    required: true,
  },
});

const ordersModal = mongoose.model('buyerOrders', ordersSchema);

module.exports = ordersModal