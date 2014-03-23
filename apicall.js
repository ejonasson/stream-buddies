// IMDb ID to Search
$(document).ready(function() {
console.log("1");
Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(error, status) {
	console.log("Initialized");
	callAPI();
  });
});

function callAPI(){
	var theURL = "https://api.twitch.tv/kraken/channels/spartanERK/follows";
	console.log("starting function");
$.ajax({
            url: theURL,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(data) {
             	console.log("In JSON function");
				var twitchJSON = data;
				console.log(twitchJSON);
            }
}); 
}

