const express = require("express");
const cors = require('cors');
const user = require('./routes/users');
const buyer_seller = require('./routes/buyer_seller')

const { updateOfferExpired } =  require('./helper/offerControl')

const product = require('./routes/product');
const app = express();
var fs = require("fs");


app.use(cors());
global.__basedir = __dirname;


app.use(express.urlencoded({limit: '50mb', extended:true, parameterLimit: 1000000}))

// app.use(express.static(__dirname + '/public'));
app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/product',product)
app.use('/user',user);
app.use('/buyer', buyer_seller)



app.get('/',(req,res) => {
  res.setHeader('Access-Control-Allow-Origin','*','http://98.80.36.64:5000',{reconnect: true})
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Accept, X-Custom-Header,Authorization')
  
  if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }else{
      return res.sendFile(__dirname + '/controller/view/welcome.html');
    }
    
  })
  
  setInterval(updateOfferExpired, 600000);


app.listen(5000, function () {


  console.log('Node app is running on port 5000');
  });
  module.exports = app;

