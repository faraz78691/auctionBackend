const express = require("express");
const http = require('http');
const cors = require('cors');
const app = express();
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Middleware for sessions
app.use(session({
  secret: 'sdfnsadfnsakdjfkjsadfkjasdfjasdfsdjfkjsad',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

(async () => {
  try {
    const openidClient = await import('openid-client');
    // Extract Issuer and generators from the imported module
    const { Issuer, Strategy, generators } = openidClient.default || openidClient;


    // Check if Issuer is defined
    if (!Issuer) {
      throw new Error('Issuer is not available in the imported module. Check the module version or its structure.');
    }

    // const { discovery, generators } = openidClient;

    // Discover the Criipto Issuer
    const criiptoIssuer = await Issuer.discover('https://gf-fch-ed-sds-test.criipto.id/');

    const client = new criiptoIssuer.Client({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uris: [process.env.REDIRECT_URI],
      response_types: ['code'],
    });

    // Set up the Passport OpenID Connect strategy
    passport.use('openidconnect', new Strategy({ client }, (tokenSet, userInfo, done) => {  
      return done(null, userInfo);
    }));

    // Serialize and deserialize user
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  } catch (error) {
    console.error('Error setting up Criipto or Issuer:', error);
  }
})();

// Routes
app.get('/login', (req, res, next) => {
  const state = 'asfasfascasffas'; // Generate a random state string
  const authorizationUrl = passport.authenticate('openidconnect', {
      scope: 'openid profile email',
      prompt: 'login',
      state: state, // Pass the state parameter
  });
  return authorizationUrl(req, res, next);
});

app.get('/callback', (req, res, next) => {
  passport.authenticate('openidconnect', { failureRedirect: '/' }, (err, user, info) => {
      if (err) {
          console.error('Authentication error:', err);
          return res.redirect('/');
      }
      if (!user) {
          console.error('No user found:', info);
          return res.redirect('/');
      }
      req.logIn(user, (err) => {
          if (err) {
              console.error('Login error:', err);
              return res.redirect('/');
          }
          res.send(`Hello, ${user.name}! You are logged in.`);
      });
  })(req, res, next);
});


app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

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

