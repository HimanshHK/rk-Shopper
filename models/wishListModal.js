const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  buyerEmail: {
    type: String,
    required: true,
  },
  wishList: {
    type: Array,
    required: true,
    },
});

const wishlistModal = mongoose.model('Wishlist', wishlistSchema);

module.exports = wishlistModal