<?php

global $project;
$project = 'mysite';


/**************************
 *       DATABASE
 *************************/

global $databaseConfig;
$databaseConfig = array(
	'type' => 'MySQLDatabase',
	'server' => 'localhost',
	'username' => 'root',
	'password' => 'Castle10',
	'database' => 'ss_master',
	'path' => ''
);


/**************************
 *       LOCALE
 *************************/

i18n::set_locale('en_GB');
Translatable::set_default_locale('en_GB');
Translatable::set_allowed_locales(array(
        'cy_GB',  //Welsh
        'en_GB',
    )
);


/**************************
 *     ERROR HANDLING
 *************************/


error_reporting(E_ALL);

ini_set("log_errors", "On");
ini_set("display_errors", 1);
//Debug::log_errors_to("log/silverstripe.log");
ini_set("log_errors", "On");
ini_set("error_log", "log/silverstripe.log");


if(!Director::isDev()) {
    // log errors and warnings
    SS_Log::add_writer(new SS_LogFileWriter('log/silverstripe-errors-warnings.log'), SS_Log::WARN, '<=');

    // or just errors
    SS_Log::add_writer(new SS_LogFileWriter('log/silverstripe-errors.log'), SS_Log::ERR);

    // or notices (e.g. for Deprecation Notifications)
    SS_Log::add_writer(new SS_LogFileWriter('log/silverstripe-errors-notices.log'), SS_Log::NOTICE);
}



/**************************
 *      EXTENSIONS
 *************************/

Object::add_extension('SiteTree', 'Translatable');
Object::add_extension('SiteConfig', 'Translatable'); // 2.4 or newer only
