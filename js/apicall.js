//States of the Page - determines if certain functions trigger
var state = {
	showingStream : false,
	toggleOverride : false,
	haveName : false
};

// Global Variable Declarations
var loadedStreams = [];
var theUser = findUser();
var theURL = "https://api.twitch.tv/kraken/";
var followsUrl = theURL + "users/" + theUser + "/follows/channels";
var streamUrl = theURL + "streams/";


// Specific DOM Element Dimensions used in Script
var dimension = {
	streamBoxWidth : 315,
	streamChatWidth : 325
};


// Error message strings
var error = {
	notFound : "No Online Streams were found.",
	twitchError : "Twitch is taking longer than expected to respond. Try refreshing your browser.",
	invalidUser : "Error: We could not find a Twitch account by that name. Please check to make sure the name is spelled correctly.",
	enterStream : "Enter a Twitch ID to Get Started"
};

//AJAX FUNCTIONS
function queryTwitch(queryUrl, successfunction, failfunction, completefunction){
	Twitch.init({clientId: 'cbmag59uju3vb9fevpi2de3pank5wtg'}, function(status) {
		$.ajax({
			url: queryUrl,
			type: 'GET',
			contentType: 'application/json',
			dataType: 'jsonp',
			cache: true,
			error: function(){
			},
			success: function(data) {
				if(data.status === 404){
					failfunction();
				}
				else{
					successfunction(data);
				}
				
			},
			complete: function(data) {
					if (completefunction){
						completefunction(data);
					}
				}

		});
	});
}

//intermediary for sending follows data to push streams
function followsToPushStreams(data){
	var follows = data.follows;
	for (var i in follows){
	var streamArray = follows[i].channel;
	pushStreams(streamArray, resetChanged);
	}
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

function returned404()
{
	$('#header-message').html(error.invalidUser);
	//Okay, we're technically not showing a stream, but this keeps the other error texts from firing.
	state.showingStream = true;
	return false;
}

function pushStreams(streamArray, updateChanged){
	var name = streamArray.name;
	var userURL = streamUrl + name;
	//reset stream list for new import
	$.ajax({
		url: userURL,
		type: 'GET',
		contentType: 'application/json',
		dataType: 'jsonp',
		success: function(data) {

			var streamObj = {

				channelName : streamArray.name,
				viewerCount : viewerCount(data['stream']),
				game        : streamArray.game,
				status      : streamArray.status,
				logo        : streamArray.logo,
				logoid      : streamArray.name + "-logo",
				display_name : streamArray.display_name,
				online       : false,
				already_loaded : false,
				metaID       : streamArray.name + "-meta",
				viewers      :  removeBadData(data['stream'])
			};

			if (data.stream !== null){
				streamObj.online = true;
			}
			var loaded = false;
			var thisStreamID = "#" + streamObj.channelName;
			for (var i in loadedStreams){
				if (loadedStreams[i].channelName === streamObj.channelName){
					updateChanged(streamObj);
					loaded = true;
				}
			}
			if(!loaded){
				loadedStreams.push(streamObj);
			}
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
	var queryname = getQueryVariable("name");
	if (queryname){
		state.haveName = true;
		createCookie('name',queryname, 14);
		return queryname;
	}
	else if (readCookie("name")){
		queryname = readCookie("name");
		return queryname;
	}
	$('#user-find').modal();
	return false;
}

// I didn't create these functions

function createCookie(name,value,days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)===' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
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




//Keep incomplete functions down here



