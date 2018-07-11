<?php
require './Cache.class.php';
require './requestHTTP.php';
require './CoreConfig.class.php';

class WebHookScore
{
  const Score = 'scoreIssues';

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
    $brand = $issue['fields']['customfield_10070']['child']['value'];
    $type = $issue['fields']['customfield_10013']['requestType']['name'];

    $request['brand'] = $brand;
    $request['company'] = $company;
    $request['key'] = $issue['key'];
    $request['self'] = $issue['self'];
    $request['group'] = $issue['fields']['customfield_10013']['requestType']['groupIds'];

    $issuesDocument = Cache::getDocument(self::Score);
    if($issuesDocument){
      $issuesDocument[$type][$issue['id']] = $request;
      $issues = $issuesDocument;
    }else{
      $issues = [
        $type => [
          $issue['id'] => $request
        ]
      ];
    }

    $data = [
      'issues' => ['SUPPORT-136'],
      'data' => ['score' => 10]
    ];

    $sendScore = new requestHTTP($data, CoreConfig::WH_SCORE_UPDATE);
    $issues = Cache::loadDocument(self::Score, $issues, false);

    return ($issues);
  }
}

new WebHookScore();