//require dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//our quotes schema
var quoteSchema = new Schema ({
		quote: {type: String, required: true, default: ""},
		author: {type: String, required: true, default: ""},
		book: {type: String}
});

router.get('/', function (req, res)  {
	console.log("I'm here");
	mongoose.connect("mongodb://localhost/quotes");
	var Quote = mongoose.model('quote', quoteSchema);
	Quote.find({}, function(error, response) {
		console.log("Received");
		res.send(chooseResponse(response));
	});
});

function chooseResponse(response) {
	var index = Math.floor(Math.random()*response.length);
	console.log(index);
	return response[index];
}

module.exports = router;