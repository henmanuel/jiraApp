<?php
require './Cache.class.php';
require './CoreConfig.class.php';

class WebHookIssuesTop
{
  const Issues = 'issuesTopSupport';
  const Companies = 'companyIssuesTopSupport';

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

    $request['key'] = $issue['key'];
    $request['self'] = $issue['self'];
    $request['group'] = $issue['fields']['customfield_10013']['requestType']['groupIds'];

    $issuesDocument = Cache::getDocument(self::Issues);
    $companiesDocument = Cache::getDocument(self::Companies);

    if($companiesDocument){
      $companiesDocument[$company][$brand][$type][$issue['id']] = $request;
      $companies = $companiesDocument;
    }else{
      $companies = [
        $company => [
          $brand => [
            $type => [
              $issue['id'] = $request
            ]
          ]
        ]
      ];
    }

    if($issuesDocument){
      $issuesDocument[$type][$issue['id']] = $request;
      $issues = $issuesDocument;
    }else{
      $issues = [
        $type => [
          $issue['id'] = $request
        ]
      ];
    }

    $issues = Cache::loadDocument(self::Issues, $issues, false);
    $companies = Cache::loadDocument(self::Companies, $companies, false);

    return ($issues && $companies);
  }
}

new WebHookIssuesTop();