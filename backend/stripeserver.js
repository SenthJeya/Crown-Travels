import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';



const app = express();
//const stripe = Stripe('sk_test_51PwQobP2nA8oNDSiA12KWOB7tpDhBOaYgGJcva5Yio7WH3fPymcLug017kJXufC4AKX7NuU0AXfRh8vaIEwXbUQY00awacJKqT'); // Use your actual secret key
const stripe = new Stripe('sk_test_51PwQobP2nA8oNDSiA12KWOB7tpDhBOaYgGJcva5Yio7WH3fPymcLug017kJXufC4AKX7NuU0AXfRh8vaIEwXbUQY00awacJKqT');

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




// const express = require ('express');
// const Stripe = require('stripe')('sk_test_51PwQobP2nA8oNDSiA12KWOB7tpDhBOaYgGJcva5Yio7WH3fPymcLug017kJXufC4AKX7NuU0AXfRh8vaIEwXbUQY00awacJKqT');
// const cors = require (cors);



// const app = express();
// //const stripe = Stripe('sk_test_51PwQobP2nA8oNDSiA12KWOB7tpDhBOaYgGJcva5Yio7WH3fPymcLug017kJXufC4AKX7NuU0AXfRh8vaIEwXbUQY00awacJKqT'); // Use your actual secret key
// const stripe = new Stripe('sk_test_51PwQobP2nA8oNDSiA12KWOB7tpDhBOaYgGJcva5Yio7WH3fPymcLug017kJXufC4AKX7NuU0AXfRh8vaIEwXbUQY00awacJKqT');

// app.use(express.json());
// app.use(cors());

// app.get('/',(req,res)=>{
//   res.send("Hi")
// })

// app.post('/create-payment-intent', async (req, res) => {
//   const { amount } = req.body;

//   try {
//     const paymentIntent = await Stripe.paymentIntents.create({
//       amount,
//       currency: 'lkr', // or your preferred currency
//     });

//     res.send({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// });

// app.listen(3000, () => console.log("Server running on http://localhost:3000"));

