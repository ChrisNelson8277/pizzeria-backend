const asyncHandler = require("express-async-handler");
const order = require("../model/orderSchema");
const orderid = require("order-id")("key");

const completeOrder = asyncHandler(async (req, res, session) => {
  const id = orderid.generate();
  console.log(session);
  const duplicate = await order
    .findOne({ uniqueId: req.body.session_id })
    .exec();
  if (duplicate) {
    console.log("duplicate order attempt");
    return res.json({ error: "error creating order" });
  }
  try {
    const completedOrderId = order.create({
      uniqueId: req.body.session_id,
      id: id,
      email: session.customer_details.email,
      name: session.customer_details.name,
      //Stripe is currently not set up to require phone# so to avoid error we will just use name for phone for now
      phone: session.customer_details.name,
      time: session.created,
    });
    const orderInformation = {
      orderid: id,
      email: session.customer_details.email,
      name: session.customer_details.name,
      phone: session.customer_details.phone,
      time: session.created,
    };
    if (completedOrderId) {
      res.json({ orderInformation });
    }
  } catch (err) {}
});
const setMenu = asyncHandler(async (req, res) => {
  const menu = await getMenu.find();
  res.status(200).json({});
});

module.exports = {
  completeOrder,
};
