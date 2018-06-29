<?php
require './Cache.class.php';
require './CoreConfig.class.php';

class WebHookIssuesTop
{
  const Document = 'issuesTop';

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

    $issue = $data['issue'];
    $type = $issue['fields']['customfield_10013']['requestType']['name'];
    $group = $issue['fields']['customfield_10013']['requestType']['groupIds'];

    $currentDocument = Cache::getDocument(self::Document);

    $issue['group'] = $group;
    if($currentDocument){
      $currentDocument[$type][$issue['id']] = $issue;
      $document = $currentDocument;
    }else{
      $document = [$type => [$issue['id'] => $issue]];
    }

    return Cache::loadDocument(self::Document, $document, false);
  }
}

new WebHookIssuesTop();