const express = require("express");
const http = require('http');
const cors = require('cors');
const app = express();
require('dotenv').config();
const db = require("./utils/database");
const https = require("https");
const fs = require("fs");


// const server = http.createServer(app);
const server = https
  .createServer(
    {
      ca: fs.readFileSync("/var/www/html/ssl/ca_bundle.crt"),
      key: fs.readFileSync("/var/www/html/ssl/private.key"),
      cert: fs.readFileSync("/var/www/html/ssl/certificate.crt"),
    },
    app
  )

const stripe = require('stripe')(process.env.STRIPE_SECRERT_KEY);
const initializeSocket = require("./middleware/socket");
const io = initializeSocket(server);
const path = require('path');
const user = require('./routes/users');
const buyer_seller = require('./routes/buyer_seller');
const admin = require('./routes/admin');
const product = require('./routes/product');
const { updateOfferExpired } = require('./helper/offerControl');
var moment = require('moment-timezone');




app.use(cors());
global.__basedir = __dirname;

app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 1000000 }))

app.use(express.json());
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/admin', admin);
app.use('/product', product);
app.use('/user', user);
app.use('/buyer', buyer_seller);




app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*', 'http://98.80.36.64:5000', { reconnect: true })
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept, X-Custom-Header,Authorization')
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  } else {
    return res.sendFile(__dirname + '/controller/view/welcome.html');
  }
})

app.get('/amount_add_successfull', async (req, res) => {
  try {
    const { user_id, totalAmount, payment_method, offer_id, session_id, id } = req.query;

    // Retrieve the session details using the session ID
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Extract the payment details, such as the amount and user information
    const amount = session.amount_total / 100; // Convert from cents to dollars
    const userId = req.query.user_id;

    // Customize the success message
    const message = `Thank you for your payment. Your transaction of $${amount} has been completed successfully.`;

    // Get the payment intent ID and status
    const paymentIntentId = session.payment_intent; // Payment ID
    const status = '1'
    const payment_date = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
    await db.query('UPDATE `tbl_user_commissin_fees` SET `payment_type`= "' + payment_method + '", `payment_id` = "' + paymentIntentId + '", `payment_date` = "' + payment_date + '", `currency` = "' + session.currency + '", `status` = "' + status + '" WHERE id = "' + id + '"');
    res.render(path.join(__dirname, "/view/", "amount_add_success.ejs"), {
      message,
      amount,
      userId
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
})

app.get('/amount_add_cancelled', async (req, res) => {
  try {
    const { session_id } = req.query;

    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Extract necessary details from the session
    const amount = session.amount_total / 100; // Convert from cents to dollars
    const paymentMethod = session.payment_method_types.join(', ');
    const message = `The payment of $${amount} using ${paymentMethod} was cancelled. Please try again.`;

    res.render(path.join(__dirname, "/view/", "amount_canceled.ejs"), {
      message,
      amount,
      paymentMethod,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
})

setInterval(updateOfferExpired, 600000);

const PORT = process.env.PORT || 5000;


server.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

