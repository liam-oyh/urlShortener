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

// create document in DB for url entered
app.route('/api/shorturl').post(function(req,res){
  var urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  if (!req.body.url.match(urlRegex)) {
    res.json({ error: 'invalid url' })
  } 
    
  var item = {
    inputUrl: req.body.url,
    shortUrl: urlId
  };
  var data = new Url(item);
  data.save();
  res.json({"original_url": req.body.url, "short_url": urlId}) 
})

app.get('/api/shorturl/:shortUrl', function(req, res) {
  var query = Url.find({shortUrl: req.params.shortUrl}).lean();
  console.log(req.params.shortUrl);
  query.exec(function(err, result) {
    // If the document doesn't exist
    if (err) console.log(error)
    else 
      var actualUrl = result[0].inputUrl;
      console.log(actualUrl);
      res.redirect(actualUrl)
  })  
})  

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
