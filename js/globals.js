var loadedStreams = [];
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
