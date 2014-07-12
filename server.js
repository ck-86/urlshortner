var http = require('http');
var express = require('express');

var app = express();

var PORT = process.argv.slice(2);

app.use(express.static( __dirname + '/public'));


var bodyParser = require('body-parser');
app.use(bodyParser.json()); //Parse JSON


app.post('/create', function(req, res, next){

	var shortCode = Math.random().toString(36).substring(13);

	// Check is shortCode already assigned

	// If Yes re-generate new shortCode

	// Or else store this shortCode with URL


	res.send( "test.blt/" + shortCode );
	res.end();
});

app.post('/test',function(req, res, next) {
  res.send();
})

app.listen(PORT[0], function() {
	console.log('Server Listening On Port ' + PORT[0]);
});