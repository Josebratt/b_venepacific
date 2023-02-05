const orderModel = require("../models/order");
const orderItemModel = require("../models/order-item");

/** Get All*/
const getOrders = async (req, res) => {
  const list = await orderModel
    .find()
    .populate("user", "names")
    .sort({ createdAt: -1 });
  if (!list) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(list);
};

/** GetById */
const getOrder = async (req, res) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user", "names")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ createdAt: -1 });
  if (!order) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(order);
};

/** Create */
const createOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new orderItemModel({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem.id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await orderItemModel
        .findById(orderItemId)
        .populate("product", "priceSell");
      const totalPrice = orderItem.product.priceSell * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new orderModel({
    orderItems: orderItemsIdsResolved,
    address: req.body.address,
    city: req.body.city,
    zip: req.body.zip,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();

  if (!order) return res.status(400).send("La orden no pudo ser creada!");

  res.send(order);
};

/** Update */
const updateOrder = async (req, res) => {
  const order = await orderModel.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(400).send("La orden no pudo ser actualizada!");

  res.send(order);
};

/** Delete */
const deleteOrder = async (req, res) => {
  orderModel
    .findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await orderItemModel.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "La orden fue borrada!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "La orden no fue encontrada!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};
