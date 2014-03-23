// The function that is called when JSON is found

function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') 
        {
            objects = objects.concat(getValues(obj[i], key));
        } 
        else if (i == key) {
            objects.push(obj[key]);
        }
    }
    return objects;
}

function useJSON(JSON){
	console.log(JSON);

	// Find the Object for Follows
	//$.each( JSON, function( key, value ){
	//	if (key === "follows"){
	//		$.each($(this), function( key, value){
	//		});
	//	}
	//});
	console.log(getValues(JSON, 'url'));


}

// A function to find a user. For now just hardcoded to me.
function findUser(){
	var username = "spartanERK";
	return username;
}
//Function to call the API based on other input data
function followers(theURL){
	console.log("starting function");
	$.ajax({
            url: theURL,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(data) {
             	console.log("In JSON function");
				useJSON(data);
            }
		}); 
}

$(document).ready(function() {

var theUser = findUser();
console.log(theUser);
var theURL = "https://api.twitch.tv/kraken/users/" + theUser + "/follows/channels";
Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(error, status) {
	console.log("Initialized");
	followers(theURL);
	// current issue: not taking JSON out of function
  });
});

