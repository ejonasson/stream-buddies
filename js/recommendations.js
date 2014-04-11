$(document).ready(function() {
//get twitch follows
queryTwitch(followsUrl, secondFollows, returned404);
});

// 1. Get The Active User's Follows, load into object

// 2. Cycle through this object, get a sample of those user's Followers
function secondFollows(streams){
	var follows_order1 = {};
	var follows = streams.follows;
	console.log(follows);
	for (var i in follows){
		var name = follows[i].channel.name;
		var streamUrl = theURL + "channels/" + name + "/follows/";
		queryTwitch (streamUrl, loadFollowers, returned404);
	}
}


function loadFollowers(data){
	var follower = data.follows;
	for (var i in follower){
		var thisFollower = follower[i].user.name;
		console.log(thisFollower);
	}
}

// 3. Find and total up this sample's list of follows


// 4. Find the top 3 overall recommendations

// 5. Also Find the top 3 (or however many exist) Currently online

// 6. Pass all this data to a handlebars template, and add to the recommendations page