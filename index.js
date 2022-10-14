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
  }}, {collection: "urls"});

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
var urlId;
var query = Url.find();
query.count(function (err, count) {
    if (err) console.log(err)
    else urlId = count
});

app.route('/api/shorturl').post(function(req,res){
    var item = {
      inputUrl: req.body.url,
      shortUrl: urlId
   };
    var data = new Url(item);
    data.save();
    res.json({"original_url": req.body.url, "short_url": urlId}) 
    /* res.redirect('/api/shorturl'); */
  })/* .get(function(req, res) {
    res.json({"original_url": req.body.url, "short_url": urlId});
    }); */
  

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
