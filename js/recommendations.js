var recommended = [];
$(document).ready(function() {
//get twitch follows
var limiturl = followsUrl;
queryTwitch(limiturl, secondFollows, returned404, allQueriesRun);
});

// 1. Get The Active User's Follows, load into object

// 2. Cycle through this object, get a sample of those user's Followers
function secondFollows(streams){
	var follows_order1 = {};
	var follows = streams.follows;
	for (var i in follows){
		var name = follows[i].channel.name;
		var streamUrl = theURL + "channels/" + name + "/follows?limit=5";
		queryTwitch (streamUrl, loadFollowers, returned404);
	}
}


function loadFollowers(data){
	var follower = data.follows;
	for (var i in follower){
		var thisFollower = follower[i].user.name;
		var followerURL = theURL + "users/" + thisFollower + "/follows/channels?limit=5";
		queryTwitch (followerURL, getRecommendations, returned404);
	}
}
// 3. Find and total up this sample's list of follows
function getRecommendations(data){
	var follows = data.follows;
	for (var i in follows){
		var streamArray = follows[i].channel;
		var stream = {
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
		if (recommended.length > 0){
			var j = 0;
			var match = false;
			while ( j < recommended.length){
				if (recommended[j].channelName === stream.channelName){
					recommended[j].count++;
					j = recommended.length;
					match = true;
				}
				j++;
			}
			if(!match){
				recommended.push(stream);
			}
		}
		else{
				recommended.push(stream);
		}
						console.log(recommended);

	}
}

function addRecommendation(streamArray){

}

// 4. Find the top 3 overall recommendations - check against loadedstreams (have to build that too)

// 5. Also Find the top 3 (or however many exist) Currently online

// 6. Pass all this data to a handlebars template, and add to the recommendations page

function allQueriesRun(){
	console.log("done")
}