// Global Variable Declarations
var loadedStreams = [];
var theUser = findUser();
var theURL = "https://api.twitch.tv/kraken/";
var followsUrl = theURL + "users/" + theUser + "/follows/channels";
var streamUrl = theURL + "streams/";


// Specific DOM Element Dimensions used in Script
var dimension = {
	streamBoxWidth : 315,
	streamChatWidth : 270
};


//States of the Page - determines if certain functions trigger
var state = {
	showingStream : false,
	toggleOverride : false
};


// Error message strings
var error = {
	notFound	: "No Online Streams were found.",
	twitchError	: "Twitch is taking longer than expected to respond. Try refreshing your browser.",
	invalidUser	: "Error: We could not find a Twitch account by that name. Please check to make sure the name is spelled correctly.",
};

//AJAX FUNCTIONS
function queryTwitch(){
	Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(status) {
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
					$('#header-message').html(error.invalidUser);
					//Okay, we're technically not showing a stream, but this keeps the other error texts from firing.
					state.showingStream = true;
					return false;
				}
				useStreams(data);

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
				already_loaded: false,
				metaID		: streamArray.name + "-meta",
				viewers     :  removeBadData(data['stream'])
			};

			if (data.stream !== null){
				streamObj.online = true;
			}
			addStream(streamObj);
		}
	});
}

// turn undefineds into zeroes

function removeBadData(data){
	if (data === null){
		return 0;
	}
	return data.viewers;
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


function sortLoaded(a, b){
	if (a.viewers === b.viewers){
		return 0;
	} else if (b.viewers > a.viewers){
		return 1;
	}
	return -1;
}

function loadStreamFromObject() {
	loadedStreams.sort(sortLoaded);
	for (var i in loadedStreams){
		if (loadedStreams[i]['already_loaded']){

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

function refreshStreamData(){
	for (var i in loadedStreams){
		if (loadedStreams[i]['already_loaded']){
			var source = $('#stream-refresh').html();
			var template = Handlebars.compile(source);
			var thisStream = loadedStreams[i];
			var thisStreamID = "#" + thisStream.channelName;
			$(thisStreamID).html(template(thisStream));
			addStreamerImage(thisStream);
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
		if(!state.showingStream)
		{
			var FirstOnlineStreamID = "#" + getFirstStreamID;
			state.showingStream = true;
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

//Trigger if we fail to find streams
function noStreams(){

	if (!state.showingStream){
		if (loadedStreams.length > 0){
			$('#header-message').html(error.notFound);
		}
		else{
			$('#header-message').html(error.twitchError);

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

// Find and return a User
function findUser(){
	var username = "spartanerk";
	var queryname = getQueryVariable("name");
	if (queryname){
		return queryname;
	}
	return username;
}

//Function to call the API based on other input data
function useStreams(followedStream){
	var follows = followedStream.follows;
	for (var i in follows){
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
	setTimeout(loadStreamFromObject, 700);
	setInterval(loadStreamFromObject, 1200);
	setInterval(refreshStreamData, 100000);
	setTimeout(noStreams, 7000);
	$(document).on('click', '.streamer', function(){
		$('.selected-stream').removeClass('selected-stream');
		$(this).addClass("selected-stream");
		var streamerID = this.getAttribute('id');
		changeStream(streamerID);
	});
	resetDivWidth();
	$(window).resize(function(){
		resetDivWidth();
		// If window is small and sidebar is big, trigger
		if (!state.toggleOverride){
			if ($(window).width() < 1200){
				if ($('.streamer-list').width() > 100){
					fullOrMinStreams();
				}
			}
		//if window is big and sidebar is small, trigger

		if ($(window).width() >= 1200){
			if ($('.streamer-list').width() < 100){
				fullOrMinStreams();
			}
		}
	}


});
	$('#stream-filter').keyup(function(){
		// Put Filter Function here

		var filterBox = $('#stream-filter').val();
		var expression = filterBox;
		var regFilter = new RegExp(expression, 'i');
		for (var i in loadedStreams){
			var channelID = "#" + loadedStreams[i]['channelName'];
			$(channelID).show();
		}
		for (var i in loadedStreams){
			var stream = loadedStreams[i];
			if (!regFilter.test(stream.channelName) && (!regFilter.test(stream.status)))
			{
				var channelID = "#" + loadedStreams[i]['channelName'];
				$(channelID).hide();
			}
			}
	});
	//Toggle chat
	$(document).on('click', '#chat-toggle', function(){
		var chat = $('#stream-chat-area');
		if (chat.width() === dimension.streamChatWidth){
			chat.width(0);
			chat.css('display', 'none');
		}
		else {
			chat.width(dimension.streamChatWidth);
			chat.css('display', 'inline-block');

		}
		resetDivWidth();
	});
	$(document).on('click', '.show-hide-streams', function(){
		state.toggleOverride = true;
		fullOrMinStreams();
	});
});

function fullOrMinStreams(){
	var widthChange = 0;
	var list = $('.streamer-list');
	if (list.width() === dimension.streamBoxWidth){
		widthChange = 65;
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
		widthChange = dimension.streamBoxWidth;

		if (!list.is(':animated')){
			$('.streamer-list').animate({
				width: widthChange,
			}, 100, function(){
				resetDivWidth();
				$('.stream-box').css("left", dimension.streamBoxWidth);
				$('.hide-small').css("display", "inline");
				$('.show-small').css("display", "none");

			});
		}
	}
}


//Keep incomplete functions down here



