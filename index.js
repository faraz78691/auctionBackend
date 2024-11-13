const express = require("express");
const http = require('http');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Setup HTTP server
const server = http.createServer(app);

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

app.post('/fish/add', async (req, res) => {
  try {
    const { name, location, height, weight, uu_id } = req.body;
    const addResult = await db.query('INSERT INTO `tbl_fish`(`name`, `location`, `height`, `weight`, `uu_id`) VALUES (?,?,?,?,?)', [name, location, height, weight, uu_id == '' || uu_id == null ? null : uu_id]);
    if (addResult.affectedRows > 0) {
      return res.status(200).json({ error: false, message: "fish data add successfully", status: 200, success: true });
    } else {
      return res.status(200).json({ error: true, message: "fish data not add", status: 200, success: false });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
});

app.get('/fish/get-all', async (req, res) => {
  try {
    const getResult = await db.query('SELECT * FROM `tbl_fish`');
    if (getResult.length > 0) {
      return res.status(200).json(getResult);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
});

setInterval(updateOfferExpired, 600000);

server.listen(5000, function () {
  console.log('Node app is running on port 5000');
});

module.exports = app;

