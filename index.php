<?php
echo dirname(__FILE__);
	define('__ROOT__', dirname(__FILE__));
  require_once (__ROOT__ . '/templates/views/streampage.php');


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

//  $user = "spartanERK";
// $streams = json_decode(get_url_contents("https://api.twitch.tv/kraken/users/" . $user . "/follows/channels"));
//  var_dump($streams);


?> 