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


var PORT = process.argv.slice(2)[0]; //Get PORT No. as argument

/* Express Config */
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); //Parse JSON


/***********************************************************
	Check code and redirect to website
***********************************************************/
app.get('/:code', function(req, res) {
	console.log('/code');
    var code = req.params.code;
    console.log(req.params.code);

    request.post(builtAPI, function(error, response, body) {
        var info = JSON.parse(body);

        if(info.objects.length > 0){
        	console.log( "Redirect to " + info.objects[0].url );
        	res.redirect(302, info.objects[0].url);
        } else {
        	res.end();
        }

    }).form({
            "_method": "get",
            "query": {
                "code": code
            }
    });

});


/***********************************************************
	Create Code Route 
************************************************************/
app.post('/create', function(req, res, next) {
    console.log('/create');
    /**********************************
	 Get Vaid URL or else throw error
    **********************************/
    	var url = req.body.url;
    	
    	if( isUrlValid(url) ){

    		//Prefix `http://` if not present
    		if( url.indexOf(':') < 0 ){ url = "http://" + url; }

    		findUrl(url);
    	} else {
    		res.send({"error" : "url not valid"});
    	}



    /*******************************************
		Check if URL is already present, if so
		then return `url code`
    ********************************************/
    function findUrl(longUrl) {
        request.post(builtAPI, function(error, response, body) {
            var info = JSON.parse(body);

            if (info.objects.length == 0) {
                var newCode = generateCode();
                saveUrlCode(newCode);

            } else {
                // sending code 
                res.json({
                    "uid": info.objects[0].uid,
                    "code": info.objects[0].code
                });
            }

        }).form({
            "_method": "get",
            "query": {
                "url": url
            }
        });
    };


    /********************************
		Generate Random Code
    ********************************/
    function generateCode() {
        return Math.random().toString(36).substring(13);
    };


    /*******************************
		Check if code is unique
    *******************************/
    function saveUrlCode(code) {
        request.post(builtAPI, function(error, response, body) {
            var info = JSON.parse(body);

            if (info.objects.length == 0) {

                /*****************************************************
					Save new url and code on Built.IO via POST Req
            	*****************************************************/
                request.post(builtAPI, function(error, response, body) {
                    var info = JSON.parse(body);

                    	//Prefix `http://` is not available
                    	if( url.indexOf(':') < 0 ){ url = "http://" + url; };

                    res.json({
                        "uid": info.object.uid,
                        "code": info.object.code
                    });
                }).form({
                    "object": {
                        "url": url,
                        "code": code
                    }
                });

            } else {
                var anotherCode = generateCode();
                saveUrlCode(anotherCode);
            }

        }).form({
            "_method": "get",
            "query": {
                "code": code
            }
        });
    };
});

app.get('/test', function(req, res, next) {
    res.send("TEST");
})

app.listen(PORT, function() {
    console.log('Server Listening On Port ' + PORT);
});


/*****************************************
	URL Validator
*****************************************/
function isUrlValid(url){
    var RegExp = /^((http|https|ftp):\/\/)?()+[a-zA-Z0-9\-\.]{2,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?/;

    if(RegExp.test(url)){
        return true;
    }else{
        return false;
    }
};