//require dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var port = process.env.MONGO_URL;

//our quotes schema
var quoteSchema = new Schema ({
		quote: {type: String, required: true, default: ""},
		author: {type: String, required: true, default: ""},
		book: {type: String}
});

router.get('/', function (req, res)  {
	console.log("I'm here");
	mongoose.connect("mongodb://philosophe-quotidien-app-git-db:Uv3ciEx6pKr68CPieUKFQMASb6lTx30SuiN87gUbPvVXZtL4Mnn9rRKnwhBwisWlZJclxZHfl5MZxdLla0rpvg==@philosophe-quotidien-app-git-db.documents.azure.com:10250/?ssl=true" || "mongodb://localhost/quotes");
	mongoose.connection.on('error', console.error.bind(console, 'Mongo error: '));
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