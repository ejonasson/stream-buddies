<h2>Recommended Streams</h2>
<h3>StreamBuddies Recommends the Following People for you to Follow:
<script type="text/template" id = "recommendation">
	<h4>{{RECOMMENDEDSTREAMER}}</h4>
</script>


<h4>How Were These Determined?</h4>
<p>Streambuddies looks at who you currently follow, who those people follow and (not yet) other people who follow them.
	We then identify streams that are consistently followed by people you like.</p>

<?php

function get_url_contents($url){
    $crl = curl_init();
    $timeout = 5;
    curl_setopt ($crl, CURLOPT_URL,$url);
    curl_setopt ($crl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt ($crl, CURLOPT_CONNECTTIMEOUT, $timeout);
    $ret = curl_exec($crl);
    curl_close($crl);
    return $ret;
}
$user = $_COOKIE['name'];
echo $user;
$followerURL = "https://api.twitch.tv/kraken/" . $user . "/follows/channels";
$streams = json_decode(get_url_contents("https://api.twitch.tv/kraken/users/" . $user . "/follows/channels"));




?>