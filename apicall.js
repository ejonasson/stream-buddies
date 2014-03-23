
//Function to call the API based on other input data
function callAPI(theURL){
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
// A function to find a user. For now just hardcoded to me.
function findUser(){
	var username = "spartanERK";
	return username;
}

$(document).ready(function() {
console.log("1");

var theUser = findUser();
console.log(theUser);
var theURL = "https://api.twitch.tv/kraken/users/" + theUser + "/follows/channels";
console.log("2");
Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(error, status) {
	console.log("Initialized");
	callAPI(theURL);
  });
});

