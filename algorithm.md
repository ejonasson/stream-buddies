# Stream Suggestion Algorithm

A basic algorithm to determine streams the user may wish to follow.

## Needed Components

* The User's Twitch Follows
* Objects Containing all of these Follows Follows (2nd Order Follows)
* Objects Contianing all (or, if infeasible, a randomized sample) of th(e Follows of those who Follow the 1st Order Follows
	* AKA - If I follow CosmoWright, include the streams that other people who follow him would follow

## Logic


* Assign all follows of a Followed a 1st-order weighting (call this "Recommendation")
* Repeat with each follower, adding the first-order weighting each time. 

* Loop through either the list (or sub-list) of follows for a Followed
* Add a 2nd order weighting for each reference (call this "Popularity")
* For each incident of this, find a way to control for the number of followers polled - without fully disregarding

* Determine an overall score for a stream by multiplying each of these values by a weighting and adding the results together.

* Present to the user the top X (maybe 3?) online streams with the highest ranking.