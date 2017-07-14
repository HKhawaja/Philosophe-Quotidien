//require dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cheerio = require('cheerio');
var request = require('request');

//create database and site url
var databaseUrl = "mongodb://localhost/quotes";
var siteUrl = "https://www.goodreads.com/author/quotes/36556.Ren_Descartes?page=";
var pageNumber = 8;

//create quotesSchema
var quoteSchema = new Schema ({
		quote: {type: String, required: true, default: ""},
		author: {type: String, required: true, default: ""},
		book: {type: String}
});

//get function: scrapes html, creates quotes objects and then adds them to the database
router.get('/', function(req, res, next) {
	var finalUrl = siteUrl+pageNumber;
	console.log(finalUrl);
	request(finalUrl, function(error, response, html){
		if (error) {
			console.log("Error in getting html");
			throw error;
		}
		else {
			console.log(req.url);
			var myQuotesObjects = doHtmlShenanigans(html);
			process.nextTick(function() {
				addQuotes(myQuotesObjects);
			});
			next();
		}
	});
});

function doHtmlShenanigans(html) {
	var $ = cheerio.load(html);
	var quotesHelper = [];
	var quotes = [];
	$('.quoteText').each(function(index,element){
		quotesHelper[index] = $(this).children().text().trim();
		quotes[index] = $(this).children().remove().end().text();
	});
	quotesHelper = processHelpers(quotesHelper);
	quotes = processQuotesArray(quotes);
	return makeQuotes(quotes, quotesHelper);
}

function processHelpers(helper) {
	var toReturn = [];
	for (var i = 0; i< helper.length; i++) {
		var interimArray = helper[i].split("\n");
		var finalString = interimArray[0];
		if (interimArray.length > 1) {
			finalString = finalString + "," + interimArray[1].trim();
		}
		toReturn[i] = finalString;
	}
	return toReturn;
}

function processQuotesArray(quotes) {
	var processedQuotesArray = [];
	for (var i =0; i<quotes.length; i++) {
		var quote = quotes[i].trim();
		var endPos = getEndPos(quote);
		processedQuotesArray[i] = quote.substring(0,endPos+2);
	}
	return processedQuotesArray;
}

function getEndPos(quote) {
	//endPosFinal signifies a mess up by the website
	var endPosPeriod = quote.lastIndexOf(".");
	var endPosQuestion = quote.lastIndexOf("?");
	var endPosExclamation = quote.lastIndexOf("!");
	var endPosFinal = quote.lastIndexOf('n');
	return Math.max(endPosPeriod, endPosQuestion,endPosExclamation, endPosFinal);
}

function isEnglish(quote) {
	quote = quote.trim();
	if (quote.length === 0) {
		return false;
	}
	// console.log(quote);
	var english = /^[A-Za-z0-9!.," ';“”?:-]*$/;
	var isEnglish = english.test(quote);
	return isEnglish;
}

function makeQuotes(quotes, quotesHelper) {
	if (quotes.length !== quotesHelper.length) {
		throw "Lengths of arrays don't match up!";
	}
	var QuotesArray = [];
	var Quote = mongoose.model('quote', quoteSchema);
	for (var i = 0; i<quotes.length; i++) {
		if (!isEnglish(quotes[i]))
			continue;
		var aQuote = new Quote();
		aQuote.quote = quotes[i].trim();
		var interimQuotesHelper = quotesHelper[i].split(',');
		aQuote.author = interimQuotesHelper[0];
		if (interimQuotesHelper.length > 1)
			aQuote.book = interimQuotesHelper[1];
		QuotesArray.push(aQuote);
	}
	return QuotesArray;
}

function addQuotes(myQuotesObjects) {
	mongoose.connect(databaseUrl);
	var database = mongoose.connection;
	var Quote = mongoose.model('quote', quoteSchema);
	console.log(mongoose.connection.model('quote'));
	// Quote.deleteMany({}, function(error, docs) {
	// 	if (error)
	// 		throw error;
	// 	else
	// 		console.log(docs);
	// // });
	// Quote.collection.insert(myQuotesObjects, function(error, response){
	// 	if (error) { 
	// 		console.log("error while inserting");
	// 		throw error;
	// 	}
	// 	else {
	// 		console.log("success, I think");
	// 		console.log(response);
	// 	}
	// });                  
	//           
	// Quote.findByIdAndRemove('5962d677bc8de224609a9b35', function(error, docs) { 
	// 	if(error)
	// 		throw error;
	// 	else
	// 		console.log(docs);
	// });
}

module.exports = router;