// Global Variable Declarations
var loadedStreams = [];
var theUser = findUser();
var theURL = "https://api.twitch.tv/kraken/";
var followsUrl = theURL + "users/" + theUser + "/follows/channels";
var streamUrl = theURL + "streams/";
var showingStream = false;


//This is used in mulitple places, put up here for easy change
var streamBoxWidth = 300;

// Putting any language we need to pass up here for easier reference

var notFound = "No Online Streams were found.";
var error = "Twitch is taking longer than expected to respond.  Try refreshing your browser.";
var invalidUser = "Error: We could not find a Twitch account by that name. Please check to make sure the name is spelled correctly.";

//AJAX FUNCTIONS
function queryTwitch(){
	Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(error, status) {
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
		success: function(data) {
			var streamObj = {

			channelName : streamArray.name,
			viewerCount : viewerCount(data['stream']),
			game		: streamArray.game,
			status		: streamArray.status,
			logo		: streamArray.logo,
			logoid		: streamArray.name + "-logo",
			display_name: streamArray.display_name,
			online     :  false,
			already_loaded: false
		};

			if (data.stream !== null){
				streamObj.online = true;
			}
			addStream(streamObj);
		}
	});
}

// DOM MANIPULATION FUNCTIONS

// Add Stream Embeds to page
function addStream(streamObj){
	var loaded = false;
	var thisStreamID = "#" + streamObj.channelName;
	for (var i in loadedStreams){
		if (loadedStreams[i].channelName === streamObj.channelName){
			//Reset if online has changed
			if (loadedStreams[i].online !== streamObj.online)
			{
					$(thisStreamID).remove();
					streamObj.already_loaded = false;
					loadedStreams[i] = streamObj;

			}
			else{
				streamObj.already_loaded = true;
				loadedStreams[i] = streamObj;
			}
			loaded = true;
		}
	}
	if(!loaded){
		loadedStreams.push(streamObj);	
	}
}

function loadStreamFromObject() {
	for (var i in loadedStreams){
		if (loadedStreams[i]['already_loaded']){
			//Don't Load Streams that are already loaded
			// This needs to append new data to the existing entry
		}
		else{
			// Add Language here to load unloaded stream
			var source = $('#stream-lister').html();
			var template = Handlebars.compile(source);
			var thisStream = loadedStreams[i];
			if (loadedStreams[i]['online']){
				// Remove Stream from Online or Offline if it already exists
				$('#streamer-list').append(template(thisStream));
				loadFirstStream(loadedStreams[i]);
				addStreamerImage(thisStream);
			}
			else{
				source = $('#offline-stream-lister').html();
				template = Handlebars.compile(source);
				$('#offline-list').append(template(thisStream));
				addStreamerImage(thisStream);

			}
			loadedStreams[i]['already_loaded'] = true;

		}
	}
}

function addStreamerImage(streamObj){
	var id = "#" + streamObj.logoid;
	var url = "url(" + streamObj.logo + ")";
	$(id).css("background-image", url);
}

function loadFirstStream(streamObj){
	// To do: make which stream is featured somewhat more random

	var getFirstStreamID = $( "#streamer-list > :first-child").attr('id');
	if (getFirstStreamID == streamObj.channelName){
		// Turn stream ID into an actual ID
		if(!showingStream)
		{
			var FirstOnlineStreamID = "#" + getFirstStreamID;
			showingStream = true;
			changeStream(streamObj.channelName);
			$(FirstOnlineStreamID).addClass('selected-stream');
		}
	}
}

// Function to change stream 
function changeStream(streamer){
	//But don't cross them!
	// Since we have the streamObject already loaded at this point, we can just compare the id to that and load it
	var source = $('#stream-embed').html();
	var template = Handlebars.compile(source);
	var chatSource = $("#stream-chat-embed").html();
	var chatTemplate = Handlebars.compile(chatSource);
// Get loaded stream object
for (var i in loadedStreams){
	if (loadedStreams[i]['channelName'] === streamer){
		var streamObj = loadedStreams[i];
		$('#stream-area').html(template(streamObj));
		$('#stream-chat-area').html(chatTemplate(streamObj));
			resetDivWidth();
	}
}
}

function setStreamSize() {
	

}



//Trigger if we fail to find streams
function noStreams(){

	if (!showingStream){
		if (loadedStreams.length > 0){
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
	console.log(JSON);
	var follows = JSON.follows;
	for (var i = 0; i<follows.length; i++){
		var streamArray = follows[i].channel;
		showOnline(streamArray);
	}
}


// Make sure viewer count is appropriately singular or plural
function viewerCount(data){
	if(data !== null){


	if (data['viewers'] ==1){
		var string = "1 viewer";
		return string;
	}
	else{
		var viewString = data['viewers'] + " viewers";
		return viewString;
	}
	}
	return null;
}

// The Document.Ready (aka what actually runs)

$(document).ready(function() {
	

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
setStreamSize();
$(window).resize(function(){
		resetDivWidth();
		// If window is small and sidebar is big, trigger
		if ($(window).width() < 1000){
			if ($('.streamer-list').width() > 50){
			fullOrMinStreams();
			}
		}
		//if window is big and sidebar is small, trigger
 		if ($(window).width() >= 1000){
			if ($('.streamer-list').width() < 100){
			fullOrMinStreams();
			}
		}

});
$(document).on('click', '.show-hide-streams', function(){
		fullOrMinStreams();
});
});

function fullOrMinStreams(){
	var widthChange = 0;
	var list = $('.streamer-list');
	if (list.width() === streamBoxWidth){
		widthChange = 50;
		if (!list.is(':animated')){
			$('.streamer-list').animate({
				width: widthChange,
			}, 100, function(){
				resetDivWidth();
				$('.stream-box').css("left", widthChange);
				$('.hide-small').css("display", "none");
				$('.show-small').css("display", "inline");

			});
		}
	}
	else{
		widthChange = streamBoxWidth;

		if (!list.is(':animated')){
			$('.streamer-list').animate({
				width: widthChange,
			}, 100, function(){
				resetDivWidth();
				$('.stream-box').css("left", streamBoxWidth);
				$('.hide-small').css("display", "inline");
				$('.show-small').css("display", "none");

				});
		}
	}
}

function resetDivWidth(div){
	var sidebar = $('#streamer-list').width();
	var chat = $('#stream-chat-area').width();
	var wrapper = $('.wrapper').width();
	var padding = 50;
	var computedWidth = wrapper - chat - sidebar - padding;
	var computedHeight = Math.floor(computedWidth * 0.61);
	$('#stream-area').width(computedWidth);
	$('#stream-area').height(computedHeight);

	}
//Keep incomplete functions down here




