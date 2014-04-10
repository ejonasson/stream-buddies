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


function returned404()
{
	$('#header-message').html(error.invalidUser);
	//Okay, we're technically not showing a stream, but this keeps the other error texts from firing.
	state.showingStream = true;
	return false;
}



function resetChanged(streamObj){
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
}



function sortLoaded(a, b){
	if (a.viewers === b.viewers){
		return 0;
	} else if (b.viewers > a.viewers){
		return 1;
	}
	return -1;
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
	if (!streamObj.online)
	{
		$(id).addClass("grayscale");
	}
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
		adjustSidebar();
	}
}
}

//Trigger if we fail to find streams
function noStreams(){
	if (!state.showingStream){
		if(state.haveName){
			if (loadedStreams.length > 0){
				$('#header-message').html(error.notFound);
			}
			else{
				$('#header-message').html(error.twitchError);
			}
		}
		else{
			$('#header-message').html(error.enterStream);
		}
	}
}

function resetDivWidth(){
	if (loadedStreams){
		var sidebar = $('#streamer-list').width();
		var chat = $('#stream-chat-area').width();
		var wrapper = $('.wrapper').width();
		var padding = 50;
		var computedWidth = wrapper - chat - sidebar - padding;
		var computedHeight = Math.floor(computedWidth * 0.61);
		if (computedWidth > 600){
			$('#stream-area').width(computedWidth);
			$('#stream-area').height(computedHeight);
		}

	}
}


function loadIntervals(first, interval, timeout, query){
	//enter values as seconds, turn into milliseconds
	first = first * 1000;
	interval = interval * 1000;
	timeout = timeout * 1000;
	query = query * 1000;
	setInterval(queryTwitch, query);
	setTimeout(loadStreamFromObject, first);
	setInterval(loadStreamFromObject, interval);
	setInterval(refreshStreamData, interval);
	setTimeout(noStreams, timeout);
}

function selectStreamer(){
	$('.selected-stream').removeClass('selected-stream');
	$(this).addClass("selected-stream");
	var streamerID = this.getAttribute('id');
	changeStream(streamerID);
	resetDivWidth();
}
function filterStream(){
	var filterBox = $('#stream-filter').val();
	var expression = filterBox;
	var regFilter = new RegExp(expression, 'i');
	for (var i in loadedStreams){
		var channelID = "#" + loadedStreams[i]['channelName'];
		$(channelID).show();
	}
	for (var j in loadedStreams){
		var stream = loadedStreams[j];
		if (!regFilter.test(stream.channelName) && (!regFilter.test(stream.status)))
		{
			var thisChannelID = "#" + loadedStreams[j]['channelName'];
			$(thisChannelID).hide();
		}
	}
}

function chatToggleclicked(){
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
}

function adjustSidebar(){
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
}

function fullOrMinStreams(){
	var widthChange = 0;
	var list = $('.streamer-list');
	if (list.width() === dimension.streamBoxWidth){
		widthChange = 63;
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

// The Document.Ready (aka what actually runs)

$(document).ready(function() {
	queryTwitch(followsUrl, followsToPushStreams, returned404);
	loadIntervals(0.5, 1, 3, 60);
	resetDivWidth();
	$(document).on('click', '.streamer', function(){
		selectStreamer();
	});
	$(window).resize(function(){
		resetDivWidth();
		adjustSidebar();
	});
	$('#stream-filter').keyup(function(){
		// Put Filter Function here
		filterStream();
	});
	//Toggle chat
	$(document).on('click', '#chat-toggle', function(){
		chatToggleclicked();
	});
	$(document).on('click', '.show-hide-streams', function(){
		state.toggleOverride = true;
		fullOrMinStreams();
		resetDivWidth();

	});
});