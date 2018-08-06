<?php
require './Cache.class.php';
require './CoreConfig.class.php';

class WebHookIssueData
{
  const IssueData = 'issueData';

  function __construct()
  {
    $method = strtolower($_SERVER['REQUEST_METHOD']);
    $action = $method . 'Document';

    if($method == 'post'){
      $responseObj = json_encode($this->$action());
    }else{
      $responseObj = 'method invalid';
    }

    echo $_GET['callback'] . "({$responseObj});";
  }

  private function postDocument(){
    $data = file_get_contents('php://input');
    $data = json_decode($data, true);

    return Cache::loadDocument(self::IssueData, $data);
  }
}

new WebHookIssueData();