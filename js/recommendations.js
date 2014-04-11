var recommended = {};
$(document).ready(function() {
//get twitch follows
queryTwitch(followsUrl, secondFollows, returned404);
});

// 1. Get The Active User's Follows, load into object

// 2. Cycle through this object, get a sample of those user's Followers
function secondFollows(streams){
	var follows_order1 = {};
	var follows = streams.follows;
	for (var i in follows){
		var name = follows[i].channel.name;
		var streamUrl = theURL + "channels/" + name + "/follows?limit=10";
		queryTwitch (streamUrl, loadFollowers, returned404);
	}
}


function loadFollowers(data){
	var follower = data.follows;
	for (var i in follower){
		var thisFollower = follower[i].user.name;
		var followerURL = theURL + "users/" + thisFollower + "/follows/channels?limit=10";
			queryTwitch (followerURL, recommendations, returned404);
	}
}

// 3. Find and total up this sample's list of follows
function recommendations(data){
	var stream = [];
	var follows = data.follows;
	for (var i in follows){
		var streamArray = follows[i].channel;
		console.log(streamArray);
		for (var j in recommended){
			if (recommended[j] === streamArray){
				recommended[j].count++;
			}
			else {
				stream = {
					channelName : streamArray.name,
					game        : streamArray.game,
					status      : streamArray.status,
					logo        : streamArray.logo,
					logoid      : streamArray.name + "-logo",
					display_name : streamArray.display_name,
					online       : false,
					already_loaded : false,
					metaID       : streamArray.name + "-meta",
					count        : 1
				};
				recommended.push(streamArray);
			}
		}
	}
	console.log(recommended);
}


// 4. Find the top 3 overall recommendations - check against loadedstreams (have to build that too)

// 5. Also Find the top 3 (or however many exist) Currently online

// 6. Pass all this data to a handlebars template, and add to the recommendations page