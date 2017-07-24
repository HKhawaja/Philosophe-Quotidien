//require dependencies
var mongodb = require('mongodb');
var express = require('express');
var http = require('http');
var scrapePageRoute = require('./Scraper/scrapePageRoute');
var getQuote = require('./RetrieveQuotes/getQuote');
var path = require('path');

var app = express();

//set up server and app routing
// http.createServer(app).listen(8001);
app.use('/scrapePage', scrapePageRoute);
app.use('/getNewQuote', getQuote);
app.use(express.static(path.join(__dirname)));
app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/index.html');
	next();
});

