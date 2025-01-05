const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
} = require("../controllers/orders");

/** get all orders */
router.get("/", getOrders);

/** get by Id */
router.get("/:id", getOrder);

/** create order */
router.post("/", createOrder);

/** update order  */
router.put("/:id", updateOrder);

/** delete order  */
router.delete("/:id", deleteOrder);

module.exports = router;