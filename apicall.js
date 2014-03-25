var validStream = [];
var theUser = findUser();
var theURL = "https://api.twitch.tv/kraken/";
var followsUrl = theURL + "users/" + theUser + "/follows/channels";
var streamUrl = theURL + "streams/";

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
			console.log(data);
			if (data.stream !== null){
				addStream(stream, data);
			}
		}
	});
}

// Add Stream Embeds to page
function addStream(streamName, object){
		console.log("enterstreams");
			console.log(streamName);
			// Let's figure out how to get this object to contain everything we need from both API calls
			var streamObj = {channelName : streamName};
			var source = $('#streamembed').html();
			var template = Handlebars.compile(source);
			$('#streamarea').append(template(streamObj));
		
}


function viewerCount(viewers){
	if (viewers ==1){
		var string = "1 viewer";
		return string;
	}
	else{
		var viewString = viewers + " viewers";
		return viewString;
	}
}



$(document).ready(function() {

console.log(streamUrl);
Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(error, status) {
	followers(followsUrl);
  });
});

