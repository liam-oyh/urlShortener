require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser'); 

// Basic Configuration
const port = process.env.PORT || 3000;

// Connect to database
let myURI = process.env['MONGO-URI'];
var urlShort = mongoose.connect(myURI, { UseNewUrlParser: true, UseUnifiedTopology: true});

// Create a schema
let urlSchema = new mongoose.Schema({
  inputUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: Number,
    default: 0
  } , {collection: "urls"});

// Create a model
const Url = mongoose.model('Url', urlSchema);

// basic settings
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
// urlId = collection length 
app.route('/api/shorturl').get(function(req, res, next) {
    res.json({"original_url": req.body.url, "short_url": urlId});
    next();
  })
  .post(function(req,res){
    var item = {
      inputUrl: req.body.url,
      shortUrl: urlId
   };
    var data = new Url(item);
    data.save();

       res.redirect('/');
  })

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
