const router = require("express").Router();
// const { check, validationResult } = require('express-validator');
// const uploads = require("../middlewares/uploads");
const sellerOrdersController = require("../controller/sellerOrdersController");

// GET Routes
router.post("/getSellerOrders", sellerOrdersController.getSellerOrders);

router.post("/changeOrderStatus", sellerOrdersController.changeOrderStatus);
// router.get('/orders/:buyerEmail',ordersController.getOrdersBuyer);
// router.get('/orders/sell/:sellerEmail',ordersController.getOrdersSeller)
// POST Routes
// router.post("/placeOrder",sellerOrdersController.postOrder);
// router.put('/orders/:orderId/items/:itemId/status',ordersController.updateOrderStatus)
module.exports = router;
