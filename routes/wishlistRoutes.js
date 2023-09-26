const router = require("express").Router();
const wishlistController = require("../controller/wishlistController");

// GET Routes
router.post("/wishlistAll", wishlistController.getWishList);

// POST Routes
router.post("/wishlist",wishlistController.postWishlist);
module.exports = router;