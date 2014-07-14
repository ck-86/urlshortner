
	/* Generate Random Code */
    var generateCode = function(){
    	return Math.random().toString(36).substring(13);
    };

    /* Get URL */
    var url = req.body.url;

    var code = generateCode();


        var builtConfig = {
        url: 'https://api.built.io/v1/classes/urlClass/objects/',
        headers: {
            "application_api_key": "blt6d833eb38749bdf0",
            "application_uid": "urlShortner",
            "content-type": "application/json"
        },
        form: {
            "_method": "get",
            "query": {
                "code": code
            }
        }
    };

    // var response = {
    //     "url": url,
    //     "code": code
    // };





    // Check is code already assigned
    request.post(builtConfig, function callback(error, response, body) {
    	    if (!error && response.statusCode == 200) {
    	        var info = JSON.parse(body);

    	        if(info.objects.length === 0 ){
    	        	res.send("No Object Found");
    	        } else {
    	        	res.send("Object Found");
    	        }
	        
	    }
	});

    // If Yes re-generate new code

    // Or else store this code with URL

    //res.send(response);
    //res.end();