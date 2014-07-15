
var shortenBtn = document.getElementById("shortenButton");

if( shortenBtn.addEventListener ) {
	shortenBtn.addEventListener("click", shortenUrl , false);
} else {
	shortenBtn.addEventListener("onclick", shortenUrl );
}

function shortenUrl() {
	$('#result').html("Please wait...");
    var apiURL = "http://uzip.org/create";
    var longUrl = document.getElementById("longUrl").value;
    console.log(longUrl);

    var mydata = JSON.stringify({
        "url": longUrl
    });

    $.ajax({
        url: apiURL,
        type: "POST",
        data: mydata,
        contentType: "application/json;",
        dataType: "json",
        success: function(data) {
            
            if(data.code){
            	$('#result-container').fadeIn();
            	
              	$('#result').html("http://uzip.org/" + data.code);
              	$('#result').fadeIn('slow');
            } else {
            	$('#result-container').show();
              	$('#result').html("Not valid url");
            }
            
            
            //Adding Event Listener Becoz of Chrome Security Issue
            // var copyBtn = document.getElementById("copyButton");
            // copyBtn.addEventListener("click", copyToClipboard, false);

        }
    });
}
