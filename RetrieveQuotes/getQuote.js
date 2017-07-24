//require dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fs = require('fs');

var port = process.env.MONGO_URL;

//our quotes schema
var quoteSchema = new Schema ({
		quote: {type: String, required: true, default: ""},
		author: {type: String, required: true, default: ""},
		book: {type: String}
});

router.get('/', function (req, res)  {
	console.log("getting quote");
	mongoose.connect(port || "mongodb://localhost/quotes");
	mongoose.connection.on('error', console.error.bind(console, 'Mongo error: '));
	var Quote = mongoose.model('quote', quoteSchema);
	Quote.find().lean().exec(function(error, response) {
		console.log("Received");
		// resp = JSON.stringify(resp);
		// fs.writeFile('quotes_.json', resp, function(error, response) {
		// 	if (error) throw error;
		// 	console.log(response);
		// })
		res.send(chooseResponse(response));
	});

});

function chooseResponse(response) {
	var index = Math.floor(Math.random()*response.length);
	console.log(index);
	return response[index];
}

module.exports = router;