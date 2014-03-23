// IMDb ID to Search
$(document).ready(function() {
	
	var imdbId = "tt1285016";
	var imdbUrl = "http://www.omdbapi.com/?i=" + imdbId;
	$.getJSON(imdbUrl, function (data){
			alert(data.Title);
		})
	
});