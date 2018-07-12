<?php
require './Cache.class.php';
require './RequestHTTP.php';
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
    $product = $issue['fields']['customfield_10077']['value'];
    $company = $issue['fields']['customfield_10070']['value'];
    $brand = $issue['fields']['customfield_10070']['child']['value'];
    $type = $issue['fields']['customfield_10013']['requestType']['name'];

    $request['brand'] = $brand;
    $request['company'] = $company;
    $request['product'] = $product;
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

    $options = [
      'company' => $company,
      'brands' => $brand,
      'product' => $product
    ];

    $score = $this->scoreCalculate($options);
    $data = [
      'issues' => [$request['key']],
      'data' => ['score' => $score]
    ];

    $sendScore = new RequestHTTP($data, CoreConfig::WH_SCORE_UPDATE);
    $issues = Cache::loadDocument(self::Score, $issues, false);

    return ($issues);
  }

  private function scoreCalculate($options)
  {
    $company = [
      'Poker',
      'Sport',
      'Bingo',
      'UK'
    ];

    $brandsSport = [
      'Betcris',
      'Solaire',
      'Betcris Korea',
      'Malta',
      'BookMaker',
      'EHorses',
      'Galaxy',
      'Jusbet',
      'Lottery',
      'XChangebet'
    ];

    $brandsPoker = [
      'TruePoker',
      'AmericasCardRoom',
      'YaPoker',
      'BlackChipPoker'
    ];

    $brandsBingo = [
      'BingoBilly',
      'BonusBingo',
      'BingoMania',
      'AmigoBingo',
      'Slots'
    ];

    $brandsUK = [
      'W88',
      'MidNightGaming'
    ];

    $product = [
      'Fraud',
      'Processing',
      'Cryptos',
      'Integrations',
      'Development',
      'UX-Analytics',
      'KPI',
      'P2P'
    ];

    $brand = 'brands' . $options['company'];

    $company = $this->nodeCalculate($options['company'], $company);
    $brand = $this->nodeCalculate($options['brands'], $$brand);
    $product = $this->nodeCalculate($options['product'], $product);

    return ($product * $company) + $brand;
  }

  /**
   * @param $useOptions
   * @param $node
   */
  private function nodeCalculate($option ,$node)
  {
    $score = 0;
    $currentNode = array_reverse($node);

    if(in_array($option, $currentNode)){
      foreach($currentNode as $optionNode => $value){
        if($option === $value){
          $score += $optionNode + 1;
        }
      }
    }

    return $score;
  }
}

new WebHookScore();