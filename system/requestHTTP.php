<?php
require_once('CoreConfig.class.php');

/**
 * Mario Vargas Ugalde
 */
class requestHTTP
{
  function __construct($data, $url)
  {
    $data = json_encode($data);
    $curl = curl_init();
    try{
      curl_setopt_array($curl, array(
        CURLOPT_POST => 1,
        CURLOPT_TIMEOUT => WS_TIMEOUT,
        CURLOPT_CONNECTTIMEOUT => WS_CONNECT_TIMEOUT,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_URL => $url,
        CURLOPT_POSTFIELDS => urldecode(http_build_query($data, '', '&')),
        CURLOPT_USERAGENT => "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)"
      ));

      $response = curl_exec($curl);
      if($response){
        return true;
      }else{
        return false;
      }
    }catch(Exception $e){}

    curl_close($curl);
    return false;
  }
}