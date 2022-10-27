const express = require("express");
const dotenv = require("dotenv").config();
const port = 5000;
const cors = require("cors");
const connectDB = require("./Config/db");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
connectDB();
app.use(
  cors({
    origin: [
      "https://leafy-sunflower-bfe6d3.netlify.app",
      "http://localhost:3000",
    ],
  })
);
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  [0, { small: 1299, medium: 1499, large: 1699, name: "Pepperoni Pizza" }],
  [1, { small: 1299, medium: 1499, large: 1699, name: "Cheese Pizza" }],
  [2, { small: 1299, medium: 1499, large: 1699, name: "Mega Meat Pizza" }],
  [3, { small: 1299, medium: 1399, large: 1699, name: "Spicy Pepp Pizza" }],
]);

app.get("/db/menuItems", (req, res) => {
  const menu = require("./controllers/menuController");
  menu.getMenu(req, res);
});

app.get("/order/success", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  console.log(session);
  const customer = await stripe.customers.retrieve(session.customer);
  console.log(customer);
  res.status(200).json({ test: "test" });
});

app.post("/db/addMenuItems", (req, res) => {
  const menu = require("./controllers/menuController");
  menu.getMenu(req, res);
});

app.post("/register", (req, res) => {
  const registerUser = require("./controllers/register");
  registerUser.handleNewUser(req, res);
});
app.post("/login", (req, res) => {
  const loginUser = require("./controllers/authController");
  loginUser.handleLogin(req, res);
});
app.post("/db/CreateUser", (req, res) => {});

app.post("/create-checkout-session", async (req, res) => {
  const qty = req.body.items[0].qty;
  const items = req.body.items;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => {
        const storeItem = storeItems.get(item.id);
        function getPrice(id, size) {
          const storeItem = storeItems.get(item.id);
        }
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem[item.size],
          },
          quantity: item.qty,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.CLIENT_URL,
    });

    res.json({ url: session.url, orderId: 1 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
