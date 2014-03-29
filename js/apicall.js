// Global Variable Declarations
var loadedStreams = [];
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
	var sidebarwidth = $(".streamer-list").width();
	var chatWidth = $(".stream-chat").width();
	winWidth = Math.floor(winWidth - sidebarwidth - chatWidth - 50);
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
	setStreamSize();

});
$(document).on('click', '.show-hide-streams', function(){
		fullOrMinStreams();
});
});

function fullOrMinStreams(){
	var list = $('.streamer-list');
	if (list.width() > 300){
		if (!list.is(':animated')){
			$('.streamer-list').animate({
				width: "50px",
			}, 300, function(){
				setStreamSize();
			});
		}
	}
	else{
		if (!list.is(':animated')){
			$('.streamer-list').animate({
				width: "450px",
			}, 300, function(){
				setStreamSize();}
				);
		}
	}
}


//Keep incomplete functions down here




