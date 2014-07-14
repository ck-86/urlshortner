var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

/**********************************************************
	Setting Built.IO Config & Headers
***********************************************************/
var builtAPI = {
    url: 'https://api.built.io/v1/classes/urlClass/objects/',
    headers: {
        "application_api_key": "blt6d833eb38749bdf0",
        "application_uid": "urlShortner",
        "content-type": "application/json"
    }
};


var PORT = process.argv.slice(2); //Get PORT No. as argument

/* Express Config */
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); //Parse JSON


/***********************************************************
	Create Route 
************************************************************/
app.post('/create', function(req, res, next) {
    var url = req.body.url;

    /*******************************************
		Check if URL is already present, if so
		then return `url code`
    ********************************************/
    function checkUrl(longUrl) {
        request.post(builtAPI, function(error, response, body) {
            var info = JSON.parse(body);

            if (info.objects.length == 0) {
                var newCode = generateCode();
                getUniqueCode(newCode);

            } else {
                // sending code 
                res.json({
                	"uid" : info.objects[0].uid,
                    "code" : info.objects[0].code
                });
            }

        }).form({
            "_method": "get",
            "query": {
                "url": url
            }
        });
    }
    checkUrl(url);


    /********************************
		Generate Random Code
    ********************************/
    function generateCode() {
        return Math.random().toString(36).substring(13);
    };


    /*******************************
		Check if code is unique
    *******************************/
    function getUniqueCode(code) {
        request.post(builtAPI, function(error, response, body) {
            var info = JSON.parse(body);

            if (info.objects.length == 0) {

                /*****************************************************
					Save new url and code on Built.IO via POST Req
            	*****************************************************/
                request.post(builtAPI, function(error, response, body) {
                    var info = JSON.parse(body);
                    console.log(info);
                    res.json({
                    	"uid" : info.object.uid,
                        "code": info.object.code
                    });
                }).form({
                    "object": {
                        "url": url,
                        "code": code
                    }
                });

            } else {
                console.log(url);
                console.log("This code is reserved. - " + code);

                var anotherCode = generateCode();
                getUniqueCode(anotherCode);
            }

        }).form({
            "_method": "get",
            "query": {
                "code": code
            }
        });
    };


    /***************************
		Start Here
    ***************************/
    //var code = generateCode();
    //getUniqueCode(code);
    // checkUrl( url );
});

app.post('/test', function(req, res, next) {
    res.send();
})

app.listen(PORT[0], function() {
    console.log('Server Listening On Port ' + PORT[0]);
});
