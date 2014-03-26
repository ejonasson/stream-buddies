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
	var follows = JSON.follows;
	for (var i = 0; i<follows.length; i++){
		var streamArray = follows[i]['channel'];
		showOnline(streamArray);

	}

}
function showOnline(streamArray){
	var streamCount = 0;
	var name = streamArray['name'];
	var userURL = streamUrl + name;
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
				addStream(streamArray, data.stream);
				streamCount++;
			}
		}
	});
	if (streamCount === 0){
		// Function to run if no streams are found.
		console.log("No Streams Online");
	}

}

// Add Stream Embeds to page
function addStream(followArray, streamObject){
			console.log("followArray:");
			console.log(followArray);
			console.log("Streamobject ");
			console.log(streamObject);
			var streamObj = {
				channelName : followArray['name'],
				viewerCount : viewerCount(streamObject['viewers']),
				game		: followArray['game'],
				status		: followArray['status'],
				logo		: followArray['logo'],
				display_name: followArray['display_name'],
				};
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

Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(error, status) {
//todo: set timer to run this every 60 seconds. Need to either clear every time or append instead of erasing
	followers(followsUrl);
  });
});

// Function that finds the values requested in the API object - no longer needed, left in for reference
/*
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
*/
