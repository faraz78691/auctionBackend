const express = require("express");
const http = require('http');
const cors = require('cors');
const app = express();
require('dotenv').config();
const db = require("./utils/database");
// Setup HTTP server
const server = http.createServer(app);
const stripe = require('stripe')(process.env.STRIPE_SECRERT_KEY);
// Import the Socket.IO configuration from the socket.js file
const initializeSocket = require("./middleware/socket");
const io = initializeSocket(server); // Initialize Socket.IO with the server

const user = require('./routes/users');
const buyer_seller = require('./routes/buyer_seller');
const admin = require('./routes/admin');
const product = require('./routes/product');
const { updateOfferExpired } = require('./helper/offerControl');

app.use(cors());
global.__basedir = __dirname;

app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }))

app.use(express.json());
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/admin', admin);
app.use('/product', product);
app.use('/user', user);
app.use('/buyer', buyer_seller);

// Set EJS as the template engine
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
    const { user_id, amount, totalAmount, payment_method, offer_id, session_id } = req.query;

    // Retrieve the session details using the session ID
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Get the payment intent ID and status
    const paymentIntentId = session.payment_intent; // Payment ID
    const status = '1'
    const payment_date = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
    await db.query('UPDATE `tbl_user_commissin_fees` SET `payment_type`= "' + payment_method + '", `payment_id` = "' + paymentIntentId + '", `payment_date` = "' + payment_date + '", `currency` = "' + session.currency + '", `status` = "' + status + '" WHERE offer_id = "' + offer_id + '" AND seller_id = "' + user_id + '"');
    res.render(path.join(__dirname, "/view/", "amount_add_success.ejs"));
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
})

app.get('/amount_add_cancelled', (req, res) => {
  try {
    res.render(path.join(__dirname, "/view/", "amount_canceled.ejs"));
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

