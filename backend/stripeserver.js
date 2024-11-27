import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';



const app = express();
const stripe = new Stripe('Use your actual secret key');

app.use(express.json());
app.use(cors({
  origin:'*',
}));

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:amount * 100,
      currency: 'lkr', // or your preferred currency
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

