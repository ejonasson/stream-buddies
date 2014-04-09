<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>StreamBuddies - Easily Watch and Share Twitch Streams</title>
	<link href="css/main.css" media="all" rel="stylesheet" type="text/css" />
	<link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700' rel='stylesheet' type='text/css'>
</head>

<body>
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
	<header>
		<div class="header-fixed">

			<h1 class = "title">StreamBuddies    <small>Always Know Who's On</small></h1>
			<div class="searchbox pull-right">
				<form class="navbar-form" action="" method="get" role="search">
					<div class="form-group">
						<input type="text" class="form-control form-box" name="name" placeholder="Find Twitch Name">
						<button type="submit" class="btn btn-default find-button">Find</button>

					</div>
					<button class = "chat-button btn btn-primary" id="chat-toggle" type="button">Toggle Chat</button>

				</form>	
			</div>
		</div>
	</header>