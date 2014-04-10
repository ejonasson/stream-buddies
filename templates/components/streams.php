<div class="modal fade" id="user-find" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h3 class="modal-title">Welcome To StreamBuddies</h3>
				</div>
				<div class="modal-body">
					<p>StreamBuddies is a tool to watch the Twitch streams you or your friends follow. Enter a Twitch name below to get started.</p>
					<p>Not following anyone? Head on over to <a href="http://twitch.tv">Twitch.tv</a>, create and account, and follow some streams! Or check out who the creator of this app follows and type in "SpartanERK" below.</p>
					<p><small>Note: StreamBuddies is still in beta at this point - if you see any issues, send them to the creator on <a href="http://twitter.com/SpartanErk">twitter</a></small>.</p>

				</div>
				<div class="modal-footer">

					<div class="form-group pull-left">
						<form class="navbar-form" action="" method="get" role="search">
							<input type="text" class="form-modal form-control" name="name" placeholder="Find Twitch Name">
							<button type="submit" class="btn btn-default">Find</button>
						</form>	
					</div>
				</div>
			</div>
		</div>
	</div>


	<div class="wrapper">
		<div class = "main-body stream-width">
			<div class="streamer-list">
				<div class="show-hide-streams pull-right" id="show-hide-streams" >	
					<span class = "streamout glyphicon glyphicon-chevron-left hide-small"></span><span class = "streamin glyphicon glyphicon-chevron-right show-small"></span>
				</div>
				<div class="filter-streams">
					<h2 class="online-offline"><span class="hide-small"><span class = "glyphicon glyphicon-search"></span> 
						<input type="filter" placeholder="Filter" id="stream-filter"></span></h2>
					</div>
					<h2 class="online-offline"><span class = "glyphicon glyphicon-facetime-video"></span><span class="hide-small"> Online</span></h2>
					
					<div id = "streamer-list">
						<!--Template from above prints here-->

					</div>					
					<div id="offline-list">
						<h2 class="online-offline"><span class = "glyphicon glyphicon-stop"></span><span class="hide-small"> Offline</span></h2>
					</div>
				</div>

				<div id="stream-area">
					<div class="stream-box">	
						<h2 id = "header-message" class="flash-header">Streams are loading...</h2>
						<!--Template from above prints here-->

					</div>
				</div>
				<div id="stream-chat-area" class="stream-chat-area">

				</div>

			</div>
