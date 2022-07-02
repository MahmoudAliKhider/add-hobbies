const _ = require("lodash");
const auth = require("../middleware/authMiddleware");
const { OrderEntity, validate } = require("../models/order");
const stripe = require("stripe")(process.env.STRIPESECRETKEY);

const express = require("express");
const router = express.Router();

router.post("/make-order", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const orderEntity = new OrderEntity(
    _.pick(req.body, ["hobbyId", "learnerId", "coachId"])
  );

  if (orderEntity.coachId.toString() === orderEntity.learnerId.toString())
    return res.status(400).send("Coach and Learner must not be same ID");

  await orderEntity.save();

  res.status(201).send(orderEntity);
});

router.post("/create-checkout-session", async (req, res) => {
  const orderItems = req.body;

  if (!orderItems)
    return res
      .status(400)
      .send("Checkout session cannot be created - check the order items");

  const lineItems = await Promise.all(
    orderItems.map(async (orderItem) => {
      const order = await OrderEntity.findById(orderItem._id);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: order._id,
          },
          unit_amount: 1000,
        },
        quantity: 1,
      };
    })
  );
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_tems: lineItems,
    mode: "payment",
    success_url: "http://front-end-url/success",
    cancel_url: "http://front-end-url/error",
  });

  res.json({ id: session.id });
});

module.exports = router;
