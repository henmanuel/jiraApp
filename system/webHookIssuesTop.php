<?php
require './Cache.class.php';
require './CoreConfig.class.php';

class WebHookIssuesTop
{
  const Document = 'issuesTopSupport';

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
    $company = $issue['fields']['customfield_10070']['value'];
    $brand = $issue['fields']['customfield_10070']['value']['child']['value'];
    $type = $issue['fields']['customfield_10013']['requestType']['name'];

    $request['key'] = $issue['key'];
    $request['self'] = $issue['self'];
    $request['group'] = $issue['fields']['customfield_10013']['requestType']['groupIds'];

    $currentDocument = Cache::getDocument(self::Document);

    if($currentDocument){
      $currentDocument[$company][$brand][$type][$issue['id']] = $request;
      $document = $currentDocument;
    }else{
      $document = [$company => [$brand => [$type => [$issue['id'] = $request]]]];
    }

    return Cache::loadDocument(self::Document, $document, false);
  }
}

new WebHookIssuesTop();