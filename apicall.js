_.templateSettings.variable = "rc";
var validStream = [];
var theUser = findUser();
var theURL = "https://api.twitch.tv/kraken/";
var followsUrl = theURL + "users/" + theUser + "/follows/channels";
var streamUrl = theURL + "streams/";
var template = _.template($('#testtemplate').html()
	);

// A function to find a user. For now just hardcoded to me.
function findUser(){
	var username = "spartanerk";
	return username;
}

//Function to call the API based on other input data
function followers(theURL){
		$.ajax({
            url: theURL,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'jsonp',
            cache: true,
            success: function(data) {
				useJSON(data);
            }
		});
}

function useJSON(JSON){

	console.log(JSON);
	var streamNames = getValues(JSON, 'name');
	console.log(streamNames);
	for (var i = 0; i<streamNames.length; i++){
		showOnline(streamNames[i]);

	}

}
// Function that finds the values requested in the API object

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

function showOnline(stream){
	var userURL = streamUrl + stream;
	console.log(userURL);
	$.ajax({
		url: userURL,
		type: 'GET',
		contentType: 'application/json',
		dataType: 'jsonp',
		cache: true,
		success: function(data) {
			if (data.stream !== null){
				addStream(stream);
			}
		}
	});
}

// Add Stream Embeds to page
function addStream(streamName){
		console.log("enterstreams");
			console.log(streamName);
			$('#streamarea').append(template());
		
}




// The function that is called when JSON is found




$(document).ready(function() {

console.log(streamUrl);
Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(error, status) {
	followers(followsUrl);
  });
});

