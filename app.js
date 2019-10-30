const express = require("express");
const Stripe = require("stripe");

const port = process.env.PORT || 3000;
const apiKey = process.env.STRIPE_PRIVATE_KEY;

const stripe = Stripe(apiKey);
const app = express();

app.use(express.json());
app.use(express.static("build"));

app.post("/api/payment_intents", async (req, res) => {
  const intent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd"
  });

  res.status(201).json({ secret: intent.client_secret });
});

app.get("*", (req, res) => {
  res.sendfile("build/index.html");
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
