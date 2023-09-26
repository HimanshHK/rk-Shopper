const router = require("express").Router();
// const { check, validationResult } = require('express-validator');
// const uploads = require("../middlewares/uploads");
const buyerOrdersController = require("../controller/buyerOrdersController");

// GET Routes
router.post("/orders", buyerOrdersController.getOrders);

router.post("/orders/:id", buyerOrdersController.getParticularOrder);
// router.get('/orders/:buyerEmail',ordersController.getOrdersBuyer);
// router.get('/orders/sell/:sellerEmail',ordersController.getOrdersSeller)
// POST Routes
router.post("/placeOrder",buyerOrdersController.postOrder);
// router.put('/orders/:orderId/items/:itemId/status',ordersController.updateOrderStatus)
module.exports = router;
