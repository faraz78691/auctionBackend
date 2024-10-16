const express = require("express");
const http = require('http');
const cors = require('cors');
const app = express();
const session = require('express-session');

// Middleware for sessions
app.use(session({
  secret: 'sdfnsadfnsakdjfkjsadfkjasdfjasdfsdjfkjsad',
  resave: false,
  saveUninitialized: true
}));
require('dotenv').config();

let client
(async () => {
  try {
    const openidClient = await import('openid-client');

    // Extract Issuer and generators from the imported module
    const { Issuer, generators } = openidClient.default || openidClient;


    // Check if Issuer is defined
    if (!Issuer) {
      throw new Error('Issuer is not available in the imported module. Check the module version or its structure.');
    }

    // const { discovery, generators } = openidClient;

    // Discover the Criipto Issuer
    const criiptoIssuer = await Issuer.discover('https://gf-fch-ed-sds-test.criipto.id/');

    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    // Check if client_id is properly set
    if (!client_id || !client_secret) {
      throw new Error('client_id or client_secret is missing. Please check your environment variables.');
    }

    // Initialize the Client
    client = new criiptoIssuer.Client({
      client_id,    // Use from environment variable
      client_secret, // Use from environment variable
      redirect_uris: ['https://gf-fch-ed-sds-test.criipto.id/qr/'],
      response_types: ['code']
    });

    console.log('Criipto Issuer and client set up successfully.');


    // Create a customer API function
    app.get('/login', async (req, res) => {
      if (!client) {
        return res.status(500).send('Client not initialized. Try again later.');
      }
      const codeVerifier = generators.codeVerifier();
      const codeChallenge = generators.codeChallenge(codeVerifier);

      req.session.codeVerifier = codeVerifier;

      const authorizationUrl = client.authorizationUrl({
        scope: 'openid',
        response_type: 'code',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        acr_values: 'urn:grn:authn:se:bankid:same-device' // Sweden BankID specific ACR
      });

      res.redirect(authorizationUrl);
    });

    app.get('/callback', async (req, res) => {
      if (!client) {
        return res.status(500).send('Client not initialized. Try again later.');
      }
      try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback('https://gf-fch-ed-sds-test.criipto.id/qr/', params, {
          code_verifier: req.session.codeVerifier
        });

        req.session.tokenSet = tokenSet;
        res.send(`User authenticated! Access token: ${tokenSet.access_token}`);
      } catch (error) {
        res.status(500).send(`Error during callback: ${error.message}`);
      }
    });
  } catch (error) {
    console.error('Error setting up Criipto or Issuer:', error);
  }
})();
// Setup HTTP server
const server = http.createServer(app);

// Import the Socket.IO configuration from the socket.js file
const initializeSocket = require("./middleware/socket");
const io = initializeSocket(server); // Initialize Socket.IO with the server

const user = require('./routes/users');
const buyer_seller = require('./routes/buyer_seller');
const admin = require('./routes/admin');
const product = require('./routes/product');
const moovPayment = require('./routes/moov_paymentgetway');
const bankId = require('./routes/bankId');
const { updateOfferExpired } = require('./helper/offerControl')

app.use(cors());
global.__basedir = __dirname;

app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }))

app.use(express.json());
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/admin', admin);
app.use('/product', product);
app.use('/moov', moovPayment);
app.use('/user', user);
app.use('/buyer', buyer_seller);
app.use('/bankid', bankId);

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

app.get('/login-page', (req, res) => {
  res.send('<a href="http://localhost:5000/login">Login with BankID</a>');
});

setInterval(updateOfferExpired, 600000);

server.listen(5000, function () {
  console.log('Node app is running on port 5000');
});

module.exports = app;

