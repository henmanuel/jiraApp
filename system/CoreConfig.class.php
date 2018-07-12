<?php

class CoreConfig
{
  /**
   * Define if the current environment is development or production
   *
   * @var bool
   */
  const DEV = true;

  /**
   * X debug key session use
   */
  const DEBUG_KEY = 'XDEBUG_SESSION_START';

	/**
	 * Expired days from cache documents
	 */
  const CACHE_EXPIRED_DAYS = 3;

  /**
   * Cache save documents path
   */
  const CACHE_PATH = 'cache';

  /**
   * Cache file format
   */
  const CACHE_SUFFIX_FILE = '.json';

  /**
   * path where all system logs will be stored
   *
   * @var string
   */
  const LOG_PATH = 'logs';

  /**
   * Update score
   */
  const WH_SCORE_UPDATE = 'https://automation.codebarrel.io/pro/hooks/944a7a6998e721c43861b78cfb81154f82d424d9';
}