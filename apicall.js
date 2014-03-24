var theUser = findUser();
var theURL = "https://api.twitch.tv/kraken/";
var followsUrl = theURL + "users/" + theUser + "/follows/channels";
var streamUrl = theURL + "streams/";

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

// Add Stream Embeds to page
function addStreams(streamName){
		/*jshint multistr: true */
		var embedCode = '<object type="application/x-shockwave-flash" height="378" width="620" id="live_embed_player_flash" \
		data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=' + streamName + '"bgcolor="#000000"> \
		<param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" />  \
		<param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /> \
		<param name="flashvars" value="hostname=www.twitch.tv&channel=' + streamName + '&auto_play=false&start_volume=25" /> \
		</object><a href="http://www.twitch.tv/' + streamName + '" style="padding:2px 0px 4px; display:block \
		width:345px; font-weight:normal; font-size:10px;text-decoration:underline; text-align:center;"></a>';
		$('#streamarea').append(embedCode);
		
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
			console.log("Valid Streams:")
			console.log(data);
			addStreams(stream);
			}
		}
	});
}

// The function that is called when JSON is found

function useJSON(JSON){
	console.log(JSON);
	var streamNames = getValues(JSON, 'name');
	console.log(streamNames);
	for (var i = 0; i<streamNames.length; i++){
		console.log(streamNames[i]);
		showOnline(streamNames[i]);
	}
}

// A function to find a user. For now just hardcoded to me.
function findUser(){
	var username = "spartanERK";
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

$(document).ready(function() {

console.log(streamUrl);
Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(error, status) {
	followers(followsUrl);
  });
});

