const mongoose = require('mongoose');

const sellerOrdersSchema = new mongoose.Schema({
  sellerEmail: {
    type: String,
    required: true,
  },
  orders: { 
    type : Array 
  }
});

const sellerOrdersModal = mongoose.model('sellerOrders', sellerOrdersSchema);

module.exports = sellerOrdersModal