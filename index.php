<?php
//	define('__ROOT__', dirname(dirname(__FILE__)));

//	require_once 'templates/head.php';
//	require_once 'templates/streams.php';
//	require_once 'templates/footer.php';

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


  $streams = json_decode(get_url_contents("https://api.twitch.tv/kraken/channels/spartanERK/follows"));
  var_dump($streams);

?>