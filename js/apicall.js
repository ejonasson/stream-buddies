// Global Variable Declarations

var loadedStreams = []
var offlineStreams = [];
var theUser = findUser();
var theURL = "https://api.twitch.tv/kraken/";
var followsUrl = theURL + "users/" + theUser + "/follows/channels";
var streamUrl = theURL + "streams/";
var showingStream = false;

// Putting any language we need to pass up here for easier reference

var notFound = "No Online Streams were found.";
var error = "Twitch is taking longer than expected to respond.  Try refreshing your browser.";
var invalidUser = "Error: We could not find a Twitch account by that name. Please check to make sure the name is spelled correctly.";

//AJAX FUNCTIONS

function showOnline(streamArray){
	var name = streamArray.name;
	var userURL = streamUrl + name;
	var streamViewers = 0;
	//reset stream list for new import
	$.ajax({
		url: userURL,
		type: 'GET',
		contentType: 'application/json',
		dataType: 'jsonp',
		cache: true,
		async: false,
		success: function(data) {
			if (data.stream !== null){
				addStream(streamArray, data);
			}
			else{
				var inList = false;
				for (var i in offlineStreams){
					if (offlineStreams[i] === name){
						inList = true;
					}
				}
				if (!inList){
					var source = $('#offline-stream-lister').html();
					var template = Handlebars.compile(source);
					$('#offline-list').append(template(streamArray));
					offlineStreams.push(name);
				}
			}
		}
	});
}

// DOM MANIPULATION FUNCTIONS

// Add Stream Embeds to page
function addStream(followArray, streamData){
	var streamObj = {
		 
			channelName : followArray.name,
			viewerCount : viewerCount(streamData['stream']['viewers']),
			game		: followArray.game,
			status		: followArray.status,
			logo		: followArray.logo,
			display_name: followArray.display_name,
			already_loaded: checkIfLoaded(loadedStreams)
		};
	if (streamObj.already_loaded){
		// Todo: update stream ifno?
	}
	else{

		loadedStreams.push(streamObj);
	}
	
}
function loadFirstStream(streamObj){
			// To do: make which stream is featured somewhat more random
		var getFirstStreamID = $( "#streamer-list > :first-child").attr('id');
		if (getFirstStreamID == streamObj.channelName){
			changeStream(streamObj.channelName);
			// Turn stream ID into an actual ID
			var FirstStreamID = "#" + getFirstStreamID;
			$(FirstStreamID).addClass('selected-stream');
		}
		if(!showingStream)
		{
			var FirstOnlineStreamID = "#" + getFirstStreamID;
			showingStream = true;
			changeStream(streamObj.channelName);
			$(FirstOnlineStreamID).addClass('selected-stream');
		}
}


// Function to change stream 
function changeStream(streamer){
	//But don't cross them!
	// Since we have the streamObject already loaded at this point, we can just compare the id to that and load it
	var source = $('#stream-embed').html();
	var template = Handlebars.compile(source);
// Get loaded stream object
	for (var i in loadedStreams){
		if (loadedStreams[i]['channelName'] === streamer){
				var streamObj = loadedStreams[i];
				$('#stream-area').html(template(streamObj));
				setStreamSize();
		}
	}
}

function setStreamSize() {
	var winWidth = $('#stream-area').innerWidth();
	winWidth = Math.floor(winWidth - 825);
	//temporary fix until I find a cleaner solution
	var winHeight = Math.floor(winWidth*0.61);
	//Prevent Window from Getting Unreasonably small
	if(winWidth > 300){
		$('#live_embed_player_flash').width(winWidth);
		$('#live_embed_player_flash').height(winHeight);
		// fixed stream chat
		$('.stream-chat').height(winHeight);
	}
}



//Trigger if we fail to find streams
function noStreams(){

	if (!showingStream){
		if (offlineStreams.length > 0){
			$('#header-message').html(notFound);
		}
		else{
			$('#header-message').html(error);

		}
	}
}


// OTHER FUNCTIONS

// get Query Variables. Code courtesy of CSS Tricks
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
function findUser(){
	var username = "spartanerk";
	var queryname = getQueryVariable("name");
	if (queryname){
		return queryname;
	}
	return username;
}

//Function to call the API based on other input data
function useJSON(JSON){

	var follows = JSON.follows;
	for (var i = 0; i<follows.length; i++){
		var streamArray = follows[i].channel;
		showOnline(streamArray);
	}
}

function checkIfLoaded() {
	for (var i = 0; i<loadedStreams.length; i++){
		if (loadedStreams[i].channelName === followArray.name){
			return true;
		}
		else{
		}
	}
return false;
}

// Make sure viewer count is appropriately singular or plural
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

// The Document.Ready (aka what actually runs)

$(document).ready(function() {
	function queryTwitch(){
		Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(error, status) {
		//todo: separate the stream call from the button call
		//So that the stream doesn't have to re-load
		$.ajax({
			url: followsUrl,
			type: 'GET',
			contentType: 'application/json',
			dataType: 'jsonp',
			cache: true,
			error: function(){
			},
			success: function(data) {
				if(data.status === 404){
					$('#header-message').html(invalidUser);
					//Okay, we're technically not showing a stream, but this keeps the other error texts from firing.
					showingStream = true;
					return false;
				}
				useJSON(data);

			},

		});
	});
	}

	//Currently only adds, need a good way to subtract
	//Maybe compare stream objects to loaded streams and find who's loaded but not in objects
	queryTwitch();
	setInterval(queryTwitch, 100000);
	setInterval(loadStreamFromObject, 100);
	setTimeout(noStreams, 7000);
	$(document).on('click', '.streamer', function(){
		$('.selected-stream').removeClass('selected-stream');
		$(this).addClass("selected-stream");
		var streamerID = this.getAttribute('id');
		changeStream(streamerID);
	});
//TODO: Rework function so that api calls and loading streams are asynchronous. That could be faster/cleaner.
	setStreamSize();
	$(window).resize(function(){
		setStreamSize();

	});

});

//Keep incomplete functions down here


function loadStreamFromObject() {
	console.log(loadedStreams);
	for (var i in loadedStreams){
		if (loadedStreams[i]['already_loaded']){
			//Don't Load Streams that are already loaded
		}
		else{
			// Add Language here to load unloaded stream
		var source = $('#stream-lister').html();
		var template = Handlebars.compile(source);
		var thisStream = loadedStreams[i];
		$('#streamer-list').append(template(thisStream));
		loadFirstStream(loadedStreams[i]);
		loadedStreams[i]['already_loaded'] = true;
		}
	}
}


