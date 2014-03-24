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
function addStreams(streamNames){
	for(var i = 0; i<streamNames.length; i++)
	{
		var line0 = "<p>Boo!</p>";
		var line1 = '<object type="application/x-shockwave-flash" height="378" width="620" id="live_embed_player_flash" ';
		var line2 = 'data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=' + streamNames[i] + '"bgcolor="#000000">';
		var line3 = '<param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" />';
		var line4 = '<param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" />';
		var line5 = '<param name="flashvars" value="hostname=www.twitch.tv&channel=' + streamNames[i] + '&auto_play=true&start_volume=25" />';
		var line6 = '</object><a href="http://www.twitch.tv/' + streamNames[i] + '" style="padding:2px 0px 4px; display:block';
		var line7 = 'width:345px; font-weight:normal; font-size:10px;text-decoration:underline; text-align:center;"></a>';
		var wholeThing = line0 + line1 + line2 + line3+ line4 + line5 + line6 + line7;
		$('#streamarea').append(wholeThing);
		 console.log(wholeThing);
		}
}

// The function that is called when JSON is found

function useJSON(JSON){
	console.log(JSON);
// Find a good way to just have both of these in one function
	var streamUrls = getValues(JSON, 'url');
	var streamNames = getValues(JSON, 'name');
	console.log(streamUrls);
	console.log(streamNames);
	addStreams(streamNames);
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
            success: function(data) {
				useJSON(data);
            }
		}); 
}

$(document).ready(function() {

var theUser = findUser();
var theURL = "https://api.twitch.tv/kraken/users/" + theUser + "/follows/channels";
Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(error, status) {
	followers(theURL);
	// current issue: not taking JSON out of function
  });
});

