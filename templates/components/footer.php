			<!--Template for Listing Online Streams -->
			<script type="text/template" id="stream-lister">
			<div class="streamer" id={{channelName}}>
			<div id={{logoid}} class="stream-logo"></div>
			<div class="stream-meta"id={{metaID}}>
			<h2 class="display-name">{{display_name}}<span class="stream-viewers">{{viewerCount}}</span></h2>
			<p class="stream-status">{{status}}</p>
			</div>

			</div>
			</script>
			<!--Template for Listing Offline Streams -->

			<script type="text/template" id="offline-stream-lister">
			<div class="streamer" id={{channelName}}>
			<div id={{logoid}} class="stream-logo grayscale"></div>
			<div class="stream-meta"id={{metaID}}>
			<h2 class="display-name">{{display_name}}</h2>
			<p class="stream-status">{{status}}</p>
			</div>

			</div>
			</script>
			<!-- Template for updating stream info. Prevents removing stream from current location -->

			<script type="text/template" id="stream-refresh">
			<div id={{logoid}} class="stream-logo"></div>
			<div class="stream-meta" id={{metaID}}>
			<h2 class="display-name">{{display_name}}<span class="stream-viewers">{{viewerCount}}</span></h2>
			<p class="stream-status">{{status}}</p>
			</div>
			</script>
			<!-- Template for stream embed -->
			<script type="text/template" id="stream-embed">
			<div class="stream-box">
			<h2 id="flash-header" class="flash-header"><strong>{{display_name}}</strong> currently playing: <em>{{game}}</em></h2>
			<object type="application/x-shockwave-flash" style="height:100%; width:100%;" class="flash-player" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel={{channelName}}" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel={{channelName}}&auto_play=true&start_volume=25" /></object>
			</div>
			</script>
			<!-- Template for Chat embed -->
			<script type="text/template" id = "stream-chat-embed">
			<iframe frameborder="0" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel={{channelName}}&popout_chat=true" style = "height:100%; width: 100%;"></iframe>
			</script>



			<!--Google Analytics -->
			<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-49717996-1', 'streambuddies.com');
			ga('send', 'pageview');

			</script>

			<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
			<script src="https://ttv-api.s3.amazonaws.com/twitch.min.js"></script>	
			<script type="text/javascript" src="/js/modal.js"></script>	
			<script type="text/javascript" src="/js/handlebars-v1.3.0.js"></script>	
			<script type="text/javascript" src="/js/main.min.js"></script>	
<?php if ($view == "recommendpage"){
		echo '<script type = "text/javascript" src = "/js/recommendations.js"></script>';
}
?>
		</body>
		</html>
