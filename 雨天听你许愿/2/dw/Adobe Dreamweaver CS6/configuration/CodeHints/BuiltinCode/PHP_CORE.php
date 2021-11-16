 //@php_CORE2.xml#OuterIterator::getInnerIterator ->  //@php_CORE2.xml#OuterIterator::getChildren
 //NoRewindIterator::rewind instead of IteratorIterator::rewind
 // ArrayIterator::getArrayCopy	
 
 
<?php //Extension standard
interface _internal_Traversable{
}

//@php_CORE4.xml#dir
abstract class Directory {
	public $path ;
	public $handle ;
	public function read ();
	public function rewind();
	public function close();
}

//@php_CORE4.xml#dir
function dir($path){
	return new Directory();
}

////////////////////////////////////////////////////////////////////////////////////

	define( 'CONNECTION_ABORTED',1);
	define( 'CONNECTION_NORMAL',0);
	define( 'CONNECTION_TIMEOUT',2);
	define( 'INI_USER',1);
	define( 'INI_PERDIR',2);
	define( 'INI_SYSTEM',4);
	define( 'INI_ALL',7);
	define( 'PHP_URL_SCHEME',0);
	define( 'PHP_URL_HOST',1);
	define( 'PHP_URL_PORT',2);
	define( 'PHP_URL_USER',3);
	define( 'PHP_URL_PASS',4);
	define( 'PHP_URL_PATH',5);
	define( 'PHP_URL_QUERY',6);
	define( 'PHP_URL_FRAGMENT',7);
	define( 'M_E',2.71828182846);
	define( 'M_LOG2E',1.44269504089);
	define( 'M_LOG10E',0.434294481903);
	define( 'M_LN2',0.69314718056);
	define( 'M_LN10',2.30258509299);
	define( 'M_PI',3.14159265359);
	define( 'M_PI_2',1.57079632679);
	define( 'M_PI_4',0.785398163397);
	define( 'M_1_PI',0.318309886184);
	define( 'M_2_PI',0.636619772368);
	define( 'M_SQRTPI',1.77245385091);
	define( 'M_2_SQRTPI',1.1283791671);
	define( 'M_LNPI',1.14472988585);
	define( 'M_EULER',0.577215664902);
	define( 'M_SQRT2',1.41421356237);
	define( 'M_SQRT1_2',0.707106781187);
	define( 'M_SQRT3',1.73205080757);
	define( 'INF',INF);
	define( 'NAN',0);
	define( 'INFO_GENERAL',1);
	define( 'INFO_CREDITS',2);
	define( 'INFO_CONFIGURATION',4);
	define( 'INFO_MODULES',8);
	define( 'INFO_ENVIRONMENT',16);
	define( 'INFO_VARIABLES',32);
	define( 'INFO_LICENSE',64);
	define( 'INFO_ALL',-1);
	define( 'CREDITS_GROUP',1);
	define( 'CREDITS_GENERAL',2);
	define( 'CREDITS_SAPI',4);
	define( 'CREDITS_MODULES',8);
	define( 'CREDITS_DOCS',16);
	define( 'CREDITS_FULLPAGE',32);
	define( 'CREDITS_QA',64);
	define( 'CREDITS_ALL',-1);
	define( 'HTML_SPECIALCHARS',0);
	define( 'HTML_ENTITIES',1);
	define( 'ENT_COMPAT',2);
	define( 'ENT_QUOTES',3);
	define( 'ENT_NOQUOTES',0);
	define( 'STR_PAD_LEFT',0);
	define( 'STR_PAD_RIGHT',1);
	define( 'STR_PAD_BOTH',2);
	define( 'PATHINFO_DIRNAME',1);
	define( 'PATHINFO_BASENAME',2);
	define( 'PATHINFO_EXTENSION',4);
	define( 'PATHINFO_FILENAME',8);
	define( 'CHAR_MAX',127);
	define( 'LC_CTYPE',2);
	define( 'LC_NUMERIC',4);
	define( 'LC_TIME',5);
	define( 'LC_COLLATE',1);
	define( 'LC_MONETARY',3);
	define( 'LC_ALL',0);
	define( 'SEEK_SET',0);
	define( 'SEEK_CUR',1);
	define( 'SEEK_END',2);
	define( 'LOCK_SH',1);
	define( 'LOCK_EX',2);
	define( 'LOCK_UN',3);
	define( 'LOCK_NB',4);
	define( 'STREAM_NOTIFY_CONNECT',2);
	define( 'STREAM_NOTIFY_AUTH_REQUIRED',3);
	define( 'STREAM_NOTIFY_AUTH_RESULT',10);
	define( 'STREAM_NOTIFY_MIME_TYPE_IS',4);
	define( 'STREAM_NOTIFY_FILE_SIZE_IS',5);
	define( 'STREAM_NOTIFY_REDIRECTED',6);
	define( 'STREAM_NOTIFY_PROGRESS',7);
	define( 'STREAM_NOTIFY_FAILURE',9);
	define( 'STREAM_NOTIFY_COMPLETED',8);
	define( 'STREAM_NOTIFY_RESOLVE',1);
	define( 'STREAM_NOTIFY_SEVERITY_INFO',0);
	define( 'STREAM_NOTIFY_SEVERITY_WARN',1);
	define( 'STREAM_NOTIFY_SEVERITY_ERR',2);
	define( 'STREAM_FILTER_READ',1);
	define( 'STREAM_FILTER_WRITE',2);
	define( 'STREAM_FILTER_ALL',3);
	define( 'STREAM_CLIENT_PERSISTENT',1);
	define( 'STREAM_CLIENT_ASYNC_CONNECT',2);
	define( 'STREAM_CLIENT_CONNECT',4);
	define( 'STREAM_CRYPTO_METHOD_SSLv2_CLIENT',0);
	define( 'STREAM_CRYPTO_METHOD_SSLv3_CLIENT',1);
	define( 'STREAM_CRYPTO_METHOD_SSLv23_CLIENT',2);
	define( 'STREAM_CRYPTO_METHOD_TLS_CLIENT',3);
	define( 'STREAM_CRYPTO_METHOD_SSLv2_SERVER',4);
	define( 'STREAM_CRYPTO_METHOD_SSLv3_SERVER',5);
	define( 'STREAM_CRYPTO_METHOD_SSLv23_SERVER',6);
	define( 'STREAM_CRYPTO_METHOD_TLS_SERVER',7);
	define( 'STREAM_SHUT_RD',0);
	define( 'STREAM_SHUT_WR',1);
	define( 'STREAM_SHUT_RDWR',2);
	define( 'STREAM_PF_INET',2);
	define( 'STREAM_PF_INET6',23);
	define( 'STREAM_PF_UNIX',1);
	define( 'STREAM_IPPROTO_IP',0);
	define( 'STREAM_IPPROTO_TCP',6);
	define( 'STREAM_IPPROTO_UDP',17);
	define( 'STREAM_IPPROTO_ICMP',1);
	define( 'STREAM_IPPROTO_RAW',255);
	define( 'STREAM_SOCK_STREAM',1);
	define( 'STREAM_SOCK_DGRAM',2);
	define( 'STREAM_SOCK_RAW',3);
	define( 'STREAM_SOCK_SEQPACKET',5);
	define( 'STREAM_SOCK_RDM',4);
	define( 'STREAM_PEEK',2);
	define( 'STREAM_OOB',1);
	define( 'STREAM_SERVER_BIND',4);
	define( 'STREAM_SERVER_LISTEN',8);
	define( 'FILE_USE_INCLUDE_PATH',1);
	define( 'FILE_IGNORE_NEW_LINES',2);
	define( 'FILE_SKIP_EMPTY_LINES',4);
	define( 'FILE_APPEND',8);
	define( 'FILE_NO_DEFAULT_CONTEXT',16);
	define( 'FILE_TEXT',0);
	define( 'FILE_BINARY',0);
	define( 'PSFS_PASS_ON',2);
	define( 'PSFS_FEED_ME',1);
	define( 'PSFS_ERR_FATAL',0);
	define( 'PSFS_FLAG_NORMAL',0);
	define( 'PSFS_FLAG_FLUSH_INC',1);
	define( 'PSFS_FLAG_FLUSH_CLOSE',2);
	define( 'CRYPT_SALT_LENGTH',12);
	define( 'CRYPT_STD_DES',1);
	define( 'CRYPT_EXT_DES',0);
	define( 'CRYPT_MD5',1);
	define( 'CRYPT_BLOWFISH',0);
	define( 'DIRECTORY_SEPARATOR','\\');
	define( 'PATH_SEPARATOR',';');
	define( 'GLOB_BRACE',128);
	define( 'GLOB_MARK',8);
	define( 'GLOB_NOSORT',32);
	define( 'GLOB_NOCHECK',16);
	define( 'GLOB_NOESCAPE',4096);
	define( 'GLOB_ERR',4);
	define( 'GLOB_ONLYDIR',1073741824);
	define( 'GLOB_AVAILABLE_FLAGS',1073746108);
	define( 'LOG_EMERG',1);
	define( 'LOG_ALERT',1);
	define( 'LOG_CRIT',1);
	define( 'LOG_ERR',4);
	define( 'LOG_WARNING',5);
	define( 'LOG_NOTICE',6);
	define( 'LOG_INFO',6);
	define( 'LOG_DEBUG',6);
	define( 'LOG_KERN',0);
	define( 'LOG_USER',8);
	define( 'LOG_MAIL',16);
	define( 'LOG_DAEMON',24);
	define( 'LOG_AUTH',32);
	define( 'LOG_SYSLOG',40);
	define( 'LOG_LPR',48);
	define( 'LOG_NEWS',56);
	define( 'LOG_UUCP',64);
	define( 'LOG_CRON',72);
	define( 'LOG_AUTHPRIV',80);
	define( 'LOG_PID',1);
	define( 'LOG_CONS',2);
	define( 'LOG_ODELAY',4);
	define( 'LOG_NDELAY',8);
	define( 'LOG_NOWAIT',16);
	define( 'LOG_PERROR',32);
	define( 'EXTR_OVERWRITE',0);
	define( 'EXTR_SKIP',1);
	define( 'EXTR_PREFIX_SAME',2);
	define( 'EXTR_PREFIX_ALL',3);
	define( 'EXTR_PREFIX_INVALID',4);
	define( 'EXTR_PREFIX_IF_EXISTS',5);
	define( 'EXTR_IF_EXISTS',6);
	define( 'EXTR_REFS',256);
	define( 'SORT_ASC',4);
	define( 'SORT_DESC',3);
	define( 'SORT_REGULAR',0);
	define( 'SORT_NUMERIC',1);
	define( 'SORT_STRING',2);
	define( 'SORT_LOCALE_STRING',5);
	define( 'CASE_LOWER',0);
	define( 'CASE_UPPER',1);
	define( 'COUNT_NORMAL',0);
	define( 'COUNT_RECURSIVE',1);
	define( 'ASSERT_ACTIVE',1);
	define( 'ASSERT_CALLBACK',2);
	define( 'ASSERT_BAIL',3);
	define( 'ASSERT_WARNING',4);
	define( 'ASSERT_QUIET_EVAL',5);
	define( 'STREAM_USE_PATH',1);
	define( 'STREAM_IGNORE_URL',2);
	define( 'STREAM_ENFORCE_SAFE_MODE',4);
	define( 'STREAM_REPORT_ERRORS',8);
	define( 'STREAM_MUST_SEEK',16);
	define( 'STREAM_URL_STAT_LINK',1);
	define( 'STREAM_URL_STAT_QUIET',2);
	define( 'STREAM_MKDIR_RECURSIVE',1);
	define( 'STREAM_IS_URL',1);
	define( 'IMAGETYPE_GIF',1);
	define( 'IMAGETYPE_JPEG',2);
	define( 'IMAGETYPE_PNG',3);
	define( 'IMAGETYPE_SWF',4);
	define( 'IMAGETYPE_PSD',5);
	define( 'IMAGETYPE_BMP',6);
	define( 'IMAGETYPE_TIFF_II',7);
	define( 'IMAGETYPE_TIFF_MM',8);
	define( 'IMAGETYPE_JPC',9);
	define( 'IMAGETYPE_JP2',10);
	define( 'IMAGETYPE_JPX',11);
	define( 'IMAGETYPE_JB2',12);
	define( 'IMAGETYPE_SWC',13);
	define( 'IMAGETYPE_IFF',14);
	define( 'IMAGETYPE_WBMP',15);
	define( 'IMAGETYPE_JPEG2000',9);
	define( 'IMAGETYPE_XBM',16);

/////////////////// ********** FUNCTIONS (483 total functions) ************ ///////////////////////////////

// 1: function constant(); // prototype:constant ( string $name )
// 2: function bin2hex(); // prototype:bin2hex ( string $str )
// 3: function sleep(); // prototype:sleep ( int $seconds )
// 4: function usleep(); // prototype:usleep ( int $micro_seconds )
// 5: function flush(); // prototype:flush ( void )
// 6: function wordwrap(); // prototype:wordwrap ( string $str [, int $width = 75 [, string $break = &quot;\n&quot; [, bool $cut = false ]]] )
// 7: function htmlspecialchars(); // prototype:htmlspecialchars ( string $string [, int $quote_style = ENT_COMPAT [, string $charset [, bool $double_encode = true ]]] )
// 8: function htmlentities(); // prototype:htmlentities ( string $string [, int $quote_style = ENT_COMPAT [, string $charset [, bool $double_encode = true ]]] )
// 9: function html_entity_decode(); // prototype:html_entity_decode ( string $string [, int $quote_style = ENT_COMPAT [, string $charset ]] )
// 10: function htmlspecialchars_decode(); // prototype:htmlspecialchars_decode ( string $string [, int $quote_style = ENT_COMPAT ] )
// 11: function get_html_translation_table(); // prototype:get_html_translation_table ([ int $table = HTML_SPECIALCHARS [, int $quote_style = ENT_COMPAT ]] )
// 12: function sha1(); // prototype:sha1 ( string $str [, bool $raw_output = false ] )
// 13: function sha1_file(); // prototype:sha1_file ( string $filename [, bool $raw_output = false ] )
// 14: function md5(); // prototype:md5 ( string $str [, bool $raw_output = false ] )
// 15: function md5_file(); // prototype:md5_file ( string $filename [, bool $raw_output = false ] )
// 16: function crc32(); // prototype:crc32 ( string $str )
// 17: function iptcparse(); // prototype:iptcparse ( string $iptcblock )
// 18: function iptcembed(); // prototype:iptcembed ( string $iptcdata , string $jpeg_file_name [, int $spool ] )
// 19: function getimagesize(); // prototype:getimagesize ( string $filename [, array &amp;$imageinfo ] )
// 20: function image_type_to_mime_type(); // prototype:image_type_to_mime_type ( int $imagetype )
// 21: function image_type_to_extension(); // prototype:image_type_to_extension ( int $imagetype [, bool $include_dot ] )
// 22: function phpinfo(); // prototype:phpinfo ([ int $what = INFO_ALL ] )
// 23: function phpversion(); // prototype:phpversion ([ string $extension ] )
// 24: function phpcredits(); // prototype:phpcredits ([ int $flag = CREDITS_ALL ] )
// 25: function php_logo_guid(); // prototype:php_logo_guid ( void )
// 26:php_real_logo_guid: has been marked as 'INTERNAL' - skipping...
// 27:php_egg_logo_guid: has been marked as 'INTERNAL' - skipping...
// 28: function zend_logo_guid(); // prototype:zend_logo_guid ( void )
// 29: function php_sapi_name(); // prototype:php_sapi_name ( void )
// 30: function php_uname(); // prototype:php_uname ([ string $mode = &quot;a&quot; ] )
// 31: function php_ini_scanned_files(); // prototype:php_ini_scanned_files ( void )
// 32: function php_ini_loaded_file(); // prototype:php_ini_loaded_file ( void )
// 33: function strnatcmp(); // prototype:strnatcmp ( string $str1 , string $str2 )
// 34: function strnatcasecmp(); // prototype:strnatcasecmp ( string $str1 , string $str2 )
// 35: function substr_count(); // prototype:substr_count ( string $haystack , string $needle [, int $offset = 0 [, int $length ]] )
// 36: function strspn(); // prototype:strspn ( string $str1 , string $str2 [, int $start [, int $length ]] )
// 37: function strcspn(); // prototype:strcspn ( string $str1 , string $str2 [, int $start [, int $length ]] )
// 38: function strtok(); // prototype:strtok ( string $str , string $token )
// 39: function strtoupper(); // prototype:strtoupper ( string $string )
// 40: function strtolower(); // prototype:strtolower ( string $str )
// 41: function strpos(); // prototype:strpos ( string $haystack , mixed $needle [, int $offset = 0 ] )
// 42: function stripos(); // prototype:stripos ( string $haystack , string $needle [, int $offset = 0 ] )
// 43: function strrpos(); // prototype:strrpos ( string $haystack , string $needle [, int $offset = 0 ] )
// 44: function strripos(); // prototype:strripos ( string $haystack , string $needle [, int $offset = 0 ] )
// 45: function strrev(); // prototype:strrev ( string $string )
// 46: function hebrev(); // prototype:hebrev ( string $hebrew_text [, int $max_chars_per_line = 0 ] )
// 47: function hebrevc(); // prototype:hebrevc ( string $hebrew_text [, int $max_chars_per_line = 0 ] )
// 48: function nl2br(); // prototype:nl2br ( string $string [, bool $is_xhtml = true ] )
// 49: function basename(); // prototype:basename ( string $path [, string $suffix ] )
// 50: function dirname(); // prototype:dirname ( string $path )
// 51: function pathinfo(); // prototype:pathinfo ( string $path [, int $options = PATHINFO_DIRNAME | PATHINFO_BASENAME | PATHINFO_EXTENSION | PATHINFO_FILENAME ] )
// 52: function stripslashes(); // prototype:stripslashes ( string $str )
// 53: function stripcslashes(); // prototype:stripcslashes ( string $str )
// 54: function strstr(); // prototype:strstr ( string $haystack , mixed $needle [, bool $before_needle = false ] )
// 55: function stristr(); // prototype:stristr ( string $haystack , mixed $needle [, bool $before_needle = false ] )
// 56: function strrchr(); // prototype:strrchr ( string $haystack , mixed $needle )
// 57: function str_shuffle(); // prototype:str_shuffle ( string $str )
// 58: function str_word_count(); // prototype:str_word_count ( string $string [, int $format = 0 [, string $charlist ]] )
// 59: function str_split(); // prototype:str_split ( string $string [, int $split_length = 1 ] )
// 60: function strpbrk(); // prototype:strpbrk ( string $haystack , string $char_list )
// 61: function substr_compare(); // prototype:substr_compare ( string $main_str , string $str , int $offset [, int $length = 0 [, bool $case_insensitivity = false ]] )
// 62: function strcoll(); // prototype:strcoll ( string $str1 , string $str2 )
// 63: function substr(); // prototype:substr ( string $string , int $start [, int $length ] )
// 64: function substr_replace(); // prototype:substr_replace ( mixed $string , string $replacement , int $start [, int $length ] )
// 65: function quotemeta(); // prototype:quotemeta ( string $str )
// 66: function ucfirst(); // prototype:ucfirst ( string $str )
// 67: function ucwords(); // prototype:ucwords ( string $str )
// 68: function strtr(); // prototype:strtr ( string $str , string $from , string $to )
// 69: function addslashes(); // prototype:addslashes ( string $str )
// 70: function addcslashes(); // prototype:addcslashes ( string $str , string $charlist )
// 71: function rtrim(); // prototype:rtrim ( string $str [, string $charlist ] )
// 72: function str_replace(); // prototype:str_replace ( mixed $search , mixed $replace , mixed $subject [, int &amp;$count ] )
// 73: function str_ireplace(); // prototype:str_ireplace ( mixed $search , mixed $replace , mixed $subject [, int &amp;$count ] )
// 74: function str_repeat(); // prototype:str_repeat ( string $input , int $multiplier )
// 75: function count_chars(); // prototype:count_chars ( string $string [, int $mode = 0 ] )
// 76: function chunk_split(); // prototype:chunk_split ( string $body [, int $chunklen [, string $end ]] )
// 77: function trim(); // prototype:trim ( string $str [, string $charlist ] )
// 78: function ltrim(); // prototype:ltrim ( string $str [, string $charlist ] )
// 79: function strip_tags(); // prototype:strip_tags ( string $str [, string $allowable_tags ] )
// 80: function similar_text(); // prototype:similar_text ( string $first , string $second [, float &amp;$percent ] )
// 81: function explode(); // prototype:explode ( string $delimiter , string $string [, int $limit ] )
// 82: function implode(); // prototype:implode ( string $glue , array $pieces )
// 83: function setlocale(); // prototype:setlocale ( int $category , string $locale [, string $... ] )
// 84: function localeconv(); // prototype:localeconv ( void )
// 85: function soundex(); // prototype:soundex ( string $str )
// 86: function levenshtein(); // prototype:levenshtein ( string $str1 , string $str2 )
// 87: function chr(); // prototype:chr ( int $ascii )
// 88: function ord(); // prototype:ord ( string $string )
// 89: function parse_str(); // prototype:parse_str ( string $str [, array &amp;$arr ] )
// 90: function str_pad(); // prototype:str_pad ( string $input , int $pad_length [, string $pad_string = &quot; &quot; [, int $pad_type = STR_PAD_RIGHT ]] )
// 91: function chop(); // ALIAS of rtrim():chop(...)
// 92: function strchr(); // ALIAS of strstr():strchr(...)
// 93: function sprintf(); // prototype:sprintf ( string $format [, mixed $args [, mixed $... ]] )
// 94: function printf(); // prototype:printf ( string $format [, mixed $args [, mixed $... ]] )
// 95: function vprintf(); // prototype:vprintf ( string $format , array $args )
// 96: function vsprintf(); // prototype:vsprintf ( string $format , array $args )
// 97: function fprintf(); // prototype:fprintf ( resource $handle , string $format [, mixed $args [, mixed $... ]] )
// 98: function vfprintf(); // prototype:vfprintf ( resource $handle , string $format , array $args )
// 99: function sscanf(); // prototype:sscanf ( string $str , string $format [, mixed &amp;$... ] )
// 100: function fscanf(); // prototype:fscanf ( resource $handle , string $format [, mixed &amp;$... ] )
// 101: function parse_url(); // prototype:parse_url ( string $url [, int $component = -1 ] )
// 102: function urlencode(); // prototype:urlencode ( string $str )
// 103: function urldecode(); // prototype:urldecode ( string $str )
// 104: function rawurlencode(); // prototype:rawurlencode ( string $str )
// 105: function rawurldecode(); // prototype:rawurldecode ( string $str )
// 106: function http_build_query(); // prototype:http_build_query ( array $formdata [, string $numeric_prefix [, string $arg_separator ]] )
// 107: function unlink(); // prototype:unlink ( string $filename [, resource $context ] )
// 108: function exec(); // prototype:exec ( string $command [, array &amp;$output [, int &amp;$return_var ]] )
// 109: function system(); // prototype:system ( string $command [, int &amp;$return_var ] )
// 110: function escapeshellcmd(); // prototype:escapeshellcmd ( string $command )
// 111: function escapeshellarg(); // prototype:escapeshellarg ( string $arg )
// 112: function passthru(); // prototype:passthru ( string $command [, int &amp;$return_var ] )
// 113: function shell_exec(); // prototype:shell_exec ( string $cmd )
// 114: function proc_open(); // prototype:proc_open ( string $cmd , array $descriptorspec , array &amp;$pipes [, string $cwd [, array $env [, array $other_options ]]] )
// 115: function proc_close(); // prototype:proc_close ( resource $process )
// 116: function proc_terminate(); // prototype:proc_terminate ( resource $process [, int $signal = 15 ] )
// 117: function proc_get_status(); // prototype:proc_get_status ( resource $process )
// 118: function rand(); // prototype:rand ( void )
// 119: function srand(); // prototype:srand ([ int $seed ] )
// 120: function getrandmax(); // prototype:getrandmax ( void )
// 121: function mt_rand(); // prototype:mt_rand ( void )
// 122: function mt_srand(); // prototype:mt_srand ([ int $seed ] )
// 123: function mt_getrandmax(); // prototype:mt_getrandmax ( void )
// 124: function getservbyname(); // prototype:getservbyname ( string $service , string $protocol )
// 125: function getservbyport(); // prototype:getservbyport ( int $port , string $protocol )
// 126: function getprotobyname(); // prototype:getprotobyname ( string $name )
// 127: function getprotobynumber(); // prototype:getprotobynumber ( int $number )
// 128: function getmyuid(); // prototype:getmyuid ( void )
// 129: function getmygid(); // prototype:getmygid ( void )
// 130: function getmypid(); // prototype:getmypid ( void )
// 131: function getmyinode(); // prototype:getmyinode ( void )
// 132: function getlastmod(); // prototype:getlastmod ( void )
// 133: function base64_decode(); // prototype:base64_decode ( string $data [, bool $strict = false ] )
// 134: function base64_encode(); // prototype:base64_encode ( string $data )
// 135: function convert_uuencode(); // prototype:convert_uuencode ( string $data )
// 136: function convert_uudecode(); // prototype:convert_uudecode ( string $data )
// 137: function abs(); // prototype:abs ( mixed $number )
// 138: function ceil(); // prototype:ceil ( float $value )
// 139: function floor(); // prototype:floor ( float $value )
// 140: function round(); // prototype:round ( float $val [, int $precision = 0 [, int $mode = PHP_ROUND_HALF_UP ]] )
// 141: function sin(); // prototype:sin ( float $arg )
// 142: function cos(); // prototype:cos ( float $arg )
// 143: function tan(); // prototype:tan ( float $arg )
// 144: function asin(); // prototype:asin ( float $arg )
// 145: function acos(); // prototype:acos ( float $arg )
// 146: function atan(); // prototype:atan ( float $arg )
// 147: function atan2(); // prototype:atan2 ( float $y , float $x )
// 148: function sinh(); // prototype:sinh ( float $arg )
// 149: function cosh(); // prototype:cosh ( float $arg )
// 150: function tanh(); // prototype:tanh ( float $arg )
// 151: function pi(); // prototype:pi ( void )
// 152: function is_finite(); // prototype:is_finite ( float $val )
// 153: function is_nan(); // prototype:is_nan ( float $val )
// 154: function is_infinite(); // prototype:is_infinite ( float $val )
// 155: function pow(); // prototype:pow ( number $base , number $exp )
// 156: function exp(); // prototype:exp ( float $arg )
// 157: function log(); // prototype:log ( float $arg [, float $base = M_E ] )
// 158: function log10(); // prototype:log10 ( float $arg )
// 159: function sqrt(); // prototype:sqrt ( float $arg )
// 160: function hypot(); // prototype:hypot ( float $x , float $y )
// 161: function deg2rad(); // prototype:deg2rad ( float $number )
// 162: function rad2deg(); // prototype:rad2deg ( float $number )
// 163: function bindec(); // prototype:bindec ( string $binary_string )
// 164: function hexdec(); // prototype:hexdec ( string $hex_string )
// 165: function octdec(); // prototype:octdec ( string $octal_string )
// 166: function decbin(); // prototype:decbin ( int $number )
// 167: function decoct(); // prototype:decoct ( int $number )
// 168: function dechex(); // prototype:dechex ( int $number )
// 169: function base_convert(); // prototype:base_convert ( string $number , int $frombase , int $tobase )
// 170: function number_format(); // prototype:number_format ( float $number [, int $decimals ] )
// 171: function fmod(); // prototype:fmod ( float $x , float $y )
// 172: function ip2long(); // prototype:ip2long ( string $ip_address )
// 173: function long2ip(); // prototype:long2ip ( string $proper_address )
// 174: function getenv(); // prototype:getenv ( string $varname )
// 175: function putenv(); // prototype:putenv ( string $setting )
// 176: function microtime(); // prototype:microtime ([ bool $get_as_float ] )
// 177: function gettimeofday(); // prototype:gettimeofday ([ bool $return_float ] )
// 178: function uniqid(); // prototype:uniqid ([ string $prefix = &quot;&quot; [, bool $more_entropy = false ]] )
// 179: function quoted_printable_decode(); // prototype:quoted_printable_decode ( string $str )
// 180: function convert_cyr_string(); // prototype:convert_cyr_string ( string $str , string $from , string $to )
// 181: function get_current_user(); // prototype:get_current_user ( void )
// 182: function set_time_limit(); // prototype:set_time_limit ( int $seconds )
// 183: function get_cfg_var(); // prototype:get_cfg_var ( string $option )
// 184: function magic_quotes_runtime(); // ALIAS of set_magic_quotes_runtime():magic_quotes_runtime(...)
// 185: function set_magic_quotes_runtime(); // prototype:set_magic_quotes_runtime ( bool $new_setting )
// 186: function get_magic_quotes_gpc(); // prototype:get_magic_quotes_gpc ( void )
// 187: function get_magic_quotes_runtime(); // prototype:get_magic_quotes_runtime ( void )
// 188: function import_request_variables(); // prototype:import_request_variables ( string $types [, string $prefix ] )
// 189: function error_log(); // prototype:error_log ( string $message [, int $message_type = 0 [, string $destination [, string $extra_headers ]]] )
// 190: function error_get_last(); // prototype:error_get_last ( void )
// 191: function call_user_func(); // prototype:call_user_func ( callback $function [, mixed $parameter [, mixed $... ]] )
// 192: function call_user_func_array(); // prototype:call_user_func_array ( callback $function , array $param_arr )
// 193: function call_user_method(); // prototype:call_user_method ( string $method_name , object &amp;$obj [, mixed $parameter [, mixed $... ]] )
// 194: function call_user_method_array(); // prototype:call_user_method_array ( string $method_name , object &amp;$obj , array $params )
// 195: function serialize(); // prototype:serialize ( mixed $value )
// 196: function unserialize(); // prototype:unserialize ( string $str )
// 197: function var_dump(); // prototype:var_dump ( mixed $expression [, mixed $expression [, $... ]] )
// 198: function var_export(); // prototype:var_export ( mixed $expression [, bool $return = false ] )
// 199: function debug_zval_dump(); // prototype:debug_zval_dump ( mixed $variable )
// 200: function print_r(); // prototype:print_r ( mixed $expression [, bool $return = false ] )
// 201: function memory_get_usage(); // prototype:memory_get_usage ([ bool $real_usage = false ] )
// 202: function memory_get_peak_usage(); // prototype:memory_get_peak_usage ([ bool $real_usage = false ] )
// 203: function register_shutdown_function(); // prototype:register_shutdown_function ( callback $function [, mixed $parameter [, mixed $... ]] )
// 204: function register_tick_function(); // prototype:register_tick_function ( callback $function [, mixed $arg [, mixed $... ]] )
// 205: function unregister_tick_function(); // prototype:unregister_tick_function ( string $function_name )
// 206: function highlight_file(); // prototype:highlight_file ( string $filename [, bool $return = false ] )
// 207: function show_source(); // ALIAS of highlight_file():show_source(...)
// 208: function highlight_string(); // prototype:highlight_string ( string $str [, bool $return = false ] )
// 209: function php_strip_whitespace(); // prototype:php_strip_whitespace ( string $filename )
// 210: function ini_get(); // prototype:ini_get ( string $varname )
// 211: function ini_get_all(); // prototype:ini_get_all ([ string $extension [, bool $details = true ]] )
// 212: function ini_set(); // prototype:ini_set ( string $varname , string $newvalue )
// 213: function ini_alter(); // ALIAS of ini_set():ini_alter(...)
// 214: function ini_restore(); // prototype:ini_restore ( string $varname )
// 215: function get_include_path(); // prototype:get_include_path ( void )
// 216: function set_include_path(); // prototype:set_include_path ( string $new_include_path )
// 217: function restore_include_path(); // prototype:restore_include_path ( void )
// 218: function setcookie(); // prototype:setcookie ( string $name [, string $value [, int $expire = 0 [, string $path [, string $domain [, bool $secure = false [, bool $httponly = false ]]]]]] )
// 219: function setrawcookie(); // prototype:setrawcookie ( string $name [, string $value [, int $expire = 0 [, string $path [, string $domain [, bool $secure = false [, bool $httponly = false ]]]]]] )
// 220: function header(); // prototype:header ( string $string [, bool $replace = true [, int $http_response_code ]] )
// 221: function headers_sent(); // prototype:headers_sent ([ string &amp;$file [, int &amp;$line ]] )
// 222: function headers_list(); // prototype:headers_list ( void )
// 223: function connection_aborted(); // prototype:connection_aborted ( void )
// 224: function connection_status(); // prototype:connection_status ( void )
// 225: function ignore_user_abort(); // prototype:ignore_user_abort ([ string $value ] )
// 226: function parse_ini_file(); // prototype:parse_ini_file ( string $filename [, bool $process_sections = false [, int $scanner_mode = INI_SCANNER_NORMAL ]] )
// 227: function is_uploaded_file(); // prototype:is_uploaded_file ( string $filename )
// 228: function move_uploaded_file(); // prototype:move_uploaded_file ( string $filename , string $destination )
// 229: function gethostbyaddr(); // prototype:gethostbyaddr ( string $ip_address )
// 230: function gethostbyname(); // prototype:gethostbyname ( string $hostname )
// 231: function gethostbynamel(); // prototype:gethostbynamel ( string $hostname )
// 232: function intval(); // prototype:intval ( mixed $var [, int $base = 10 ] )
// 233: function floatval(); // prototype:floatval ( mixed $var )
// 234: function doubleval(); // ALIAS of floatval():doubleval(...)
// 235: function strval(); // prototype:strval ( mixed $var )
// 236: function gettype(); // prototype:gettype ( mixed $var )
// 237: function settype(); // prototype:settype ( mixed &amp;$var , string $type )
// 238: function is_null(); // prototype:is_null ( mixed $var )
// 239: function is_resource(); // prototype:is_resource ( mixed $var )
// 240: function is_bool(); // prototype:is_bool ( mixed $var )
// 241: function is_long(); // ALIAS of is_int():is_long(...)
// 242: function is_float(); // prototype:is_float ( mixed $var )
// 243: function is_int(); // prototype:is_int ( mixed $var )
// 244: function is_integer(); // ALIAS of is_int():is_integer(...)
// 245: function is_double(); // ALIAS of is_float():is_double(...)
// 246: function is_real(); // ALIAS of is_float():is_real(...)
// 247: function is_numeric(); // prototype:is_numeric ( mixed $var )
// 248: function is_string(); // prototype:is_string ( mixed $var )
// 249: function is_array(); // prototype:is_array ( mixed $var )
// 250: function is_object(); // prototype:is_object ( mixed $var )
// 251: function is_scalar(); // prototype:is_scalar ( mixed $var )
// 252: function is_callable(); // prototype:is_callable ( callback $name [, bool $syntax_only = false [, string &amp;$callable_name ]] )
// 253: function ereg(); // prototype:ereg ( string $pattern , string $string [, array &amp;$regs ] )
// 254: function ereg_replace(); // prototype:ereg_replace ( string $pattern , string $replacement , string $string )
// 255: function eregi(); // prototype:eregi ( string $pattern , string $string [, array &amp;$regs ] )
// 256: function eregi_replace(); // prototype:eregi_replace ( string $pattern , string $replacement , string $string )
// 257: function split(); // prototype:split ( string $pattern , string $string [, int $limit ] )
// 258: function spliti(); // prototype:spliti ( string $pattern , string $string [, int $limit ] )
// 259: function join(); // ALIAS of implode():join(...)
// 260: function sql_regcase(); // prototype:sql_regcase ( string $string )
// 261: function dl(); // prototype:dl ( string $library )
// 262: function pclose(); // prototype:pclose ( resource $handle )
// 263: function popen(); // prototype:popen ( string $command , string $mode )
// 264: function readfile(); // prototype:readfile ( string $filename [, bool $use_include_path = false [, resource $context ]] )
// 265: function rewind(); // prototype:rewind ( resource $handle )
// 266: function rmdir(); // prototype:rmdir ( string $dirname [, resource $context ] )
// 267: function umask(); // prototype:umask ([ int $mask ] )
// 268: function fclose(); // prototype:fclose ( resource $handle )
// 269: function feof(); // prototype:feof ( resource $handle )
// 270: function fgetc(); // prototype:fgetc ( resource $handle )
// 271: function fgets(); // prototype:fgets ( resource $handle [, int $length ] )
// 272: function fgetss(); // prototype:fgetss ( resource $handle [, int $length [, string $allowable_tags ]] )
// 273: function fread(); // prototype:fread ( resource $handle , int $length )
// 274: function fopen(); // prototype:fopen ( string $filename , string $mode [, bool $use_include_path = false [, resource $context ]] )
// 275: function fpassthru(); // prototype:fpassthru ( resource $handle )
// 276: function ftruncate(); // prototype:ftruncate ( resource $handle , int $size )
// 277: function fstat(); // prototype:fstat ( resource $handle )
// 278: function fseek(); // prototype:fseek ( resource $handle , int $offset [, int $whence ] )
// 279: function ftell(); // prototype:ftell ( resource $handle )
// 280: function fflush(); // prototype:fflush ( resource $handle )
// 281: function fwrite(); // prototype:fwrite ( resource $handle , string $string [, int $length ] )
// 282: function fputs(); // ALIAS of fwrite():fputs(...)
// 283: function mkdir(); // prototype:mkdir ( string $pathname [, int $mode = 0777 [, bool $recursive = false [, resource $context ]]] )
// 284: function rename(); // prototype:rename ( string $oldname , string $newname [, resource $context ] )
// 285: function copy(); // prototype:copy ( string $source , string $dest [, resource $context ] )
// 286: function tempnam(); // prototype:tempnam ( string $dir , string $prefix )
// 287: function tmpfile(); // prototype:tmpfile ( void )
// 288: function file(); // prototype:file ( string $filename [, int $flags = 0 [, resource $context ]] )
// 289: function file_get_contents(); // prototype:file_get_contents ( string $filename [, int $flags = 0 [, resource $context [, int $offset = -1 [, int $maxlen = -1 ]]]] )
// 290: function file_put_contents(); // prototype:file_put_contents ( string $filename , mixed $data [, int $flags = 0 [, resource $context ]] )
// 291: function stream_select(); // prototype:stream_select ( array &amp;$read , array &amp;$write , array &amp;$except , int $tv_sec [, int $tv_usec = 0 ] )
// 292: function stream_context_create(); // prototype:stream_context_create ([ array $options [, array $params ]] )
// 293: function stream_context_set_params(); // prototype:stream_context_set_params ( resource $stream_or_context , array $params )
// 294: function stream_context_set_option(); // prototype:stream_context_set_option ( resource $stream_or_context , string $wrapper , string $option , mixed $value )
// 295: function stream_context_get_options(); // prototype:stream_context_get_options ( resource $stream_or_context )
// 296: function stream_context_get_default(); // prototype:stream_context_get_default ([ array $options ] )
// 297: function stream_filter_prepend(); // prototype:stream_filter_prepend ( resource $stream , string $filtername [, int $read_write [, mixed $params ]] )
// 298: function stream_filter_append(); // prototype:stream_filter_append ( resource $stream , string $filtername [, int $read_write [, mixed $params ]] )
// 299: function stream_filter_remove(); // prototype:stream_filter_remove ( resource $stream_filter )
// 300: function stream_socket_client(); // prototype:stream_socket_client ( string $remote_socket [, int &amp;$errno [, string &amp;$errstr [, float $timeout = ini_get(&quot;default_socket_timeout&quot;) [, int $flags = STREAM_CLIENT_CONNECT [, resource $context ]]]]] )
// 301: function stream_socket_server(); // prototype:stream_socket_server ( string $local_socket [, int &amp;$errno [, string &amp;$errstr [, int $flags = STREAM_SERVER_BIND | STREAM_SERVER_LISTEN [, resource $context ]]]] )
// 302: function stream_socket_accept(); // prototype:stream_socket_accept ( resource $server_socket [, float $timeout = ini_get(&quot;default_socket_timeout&quot;) [, string &amp;$peername ]] )
// 303: function stream_socket_get_name(); // prototype:stream_socket_get_name ( resource $handle , bool $want_peer )
// 304: function stream_socket_recvfrom(); // prototype:stream_socket_recvfrom ( resource $socket , int $length [, int $flags = 0 [, string &amp;$address ]] )
// 305: function stream_socket_sendto(); // prototype:stream_socket_sendto ( resource $socket , string $data [, int $flags = 0 [, string $address ]] )
// 306: function stream_socket_enable_crypto(); // prototype:stream_socket_enable_crypto ( resource $stream , bool $enable [, int $crypto_type [, resource $session_stream ]] )
// 307: function stream_socket_shutdown(); // prototype:stream_socket_shutdown ( resource $stream , int $how )
// 308: function stream_copy_to_stream(); // prototype:stream_copy_to_stream ( resource $source , resource $dest [, int $maxlength = -1 [, int $offset = 0 ]] )
// 309: function stream_get_contents(); // prototype:stream_get_contents ( resource $handle [, int $maxlength = -1 [, int $offset = 0 ]] )
// 310: function fgetcsv(); // prototype:fgetcsv ( resource $handle [, int $length [, string $delimiter [, string $enclosure [, string $escape ]]]] )
// 311: function fputcsv(); // prototype:fputcsv ( resource $handle , array $fields [, string $delimiter [, string $enclosure ]] )
// 312: function flock(); // prototype:flock ( resource $handle , int $operation [, int &amp;$wouldblock ] )
// 313: function get_meta_tags(); // prototype:get_meta_tags ( string $filename [, bool $use_include_path = false ] )
// 314: function stream_set_write_buffer(); // prototype:stream_set_write_buffer ( resource $stream , int $buffer )
// 315: function set_file_buffer(); // ALIAS of stream_set_write_buffer():set_file_buffer(...)
// 316: function set_socket_blocking(); // ALIAS of stream_set_blocking():set_socket_blocking(...)
// 317: function stream_set_blocking(); // prototype:stream_set_blocking ( resource $stream , int $mode )
// 318: function socket_set_blocking(); // ALIAS of stream_set_blocking():socket_set_blocking(...)
// 319: function stream_get_meta_data(); // prototype:stream_get_meta_data ( resource $stream )
// 320: function stream_get_line(); // prototype:stream_get_line ( resource $handle , int $length [, string $ending ] )
// 321: function stream_wrapper_register(); // prototype:stream_wrapper_register ( string $protocol , string $classname [, int $flags = 0 ] )
// 322: function stream_register_wrapper(); // ALIAS of stream_wrapper_register():stream_register_wrapper(...)
// 323: function stream_wrapper_unregister(); // prototype:stream_wrapper_unregister ( string $protocol )
// 324: function stream_wrapper_restore(); // prototype:stream_wrapper_restore ( string $protocol )
// 325: function stream_get_wrappers(); // prototype:stream_get_wrappers ( void )
// 326: function stream_get_transports(); // prototype:stream_get_transports ( void )
// 327: function stream_is_local(); // prototype:stream_is_local ( mixed $stream_or_url )
// 328: function get_headers(); // prototype:get_headers ( string $url [, int $format = 0 ] )
// 329: function stream_set_timeout(); // prototype:stream_set_timeout ( resource $stream , int $seconds [, int $microseconds = 0 ] )
// 330: function socket_set_timeout(); // ALIAS of stream_set_timeout():socket_set_timeout(...)
// 331: function socket_get_status(); // ALIAS of stream_get_meta_data():socket_get_status(...)
// 332: function realpath(); // prototype:realpath ( string $path )
// 333: function fsockopen(); // prototype:fsockopen ( string $hostname [, int $port = -1 [, int &amp;$errno [, string &amp;$errstr [, float $timeout = ini_get(&quot;default_socket_timeout&quot;) ]]]] )
// 334: function pfsockopen(); // prototype:pfsockopen ( string $hostname [, int $port = -1 [, int &amp;$errno [, string &amp;$errstr [, float $timeout = ini_get(&quot;default_socket_timeout&quot;) ]]]] )
// 335: function pack(); // prototype:pack ( string $format [, mixed $args [, mixed $... ]] )
// 336: function unpack(); // prototype:unpack ( string $format , string $data )
// 337: function get_browser(); // prototype:get_browser ([ string $user_agent [, bool $return_array = false ]] )
// 338: function crypt(); // prototype:crypt ( string $str [, string $salt ] )
// 339: function opendir(); // prototype:opendir ( string $path [, resource $context ] )
// 340: function closedir(); // prototype:closedir ([ resource $dir_handle ] )
// 341: function chdir(); // prototype:chdir ( string $directory )
// 342: function getcwd(); // prototype:getcwd ( void )
// 343: function rewinddir(); // prototype:rewinddir ([ resource $dir_handle ] )
// 344: function readdir(); // prototype:readdir ([ resource $dir_handle ] )
// 345: function dir(); // (x)prototype:NOT FOUND: prototype for dir!
// 346: function scandir(); // prototype:scandir ( string $directory [, int $sorting_order = 0 [, resource $context ]] )
// 347: function glob(); // prototype:glob ( string $pattern [, int $flags = 0 ] )
// 348: function fileatime(); // prototype:fileatime ( string $filename )
// 349: function filectime(); // prototype:filectime ( string $filename )
// 350: function filegroup(); // prototype:filegroup ( string $filename )
// 351: function fileinode(); // prototype:fileinode ( string $filename )
// 352: function filemtime(); // prototype:filemtime ( string $filename )
// 353: function fileowner(); // prototype:fileowner ( string $filename )
// 354: function fileperms(); // prototype:fileperms ( string $filename )
// 355: function filesize(); // prototype:filesize ( string $filename )
// 356: function filetype(); // prototype:filetype ( string $filename )
// 357: function file_exists(); // prototype:file_exists ( string $filename )
// 358: function is_writable(); // prototype:is_writable ( string $filename )
// 359: function is_writeable(); // ALIAS of is_writable():is_writeable(...)
// 360: function is_readable(); // prototype:is_readable ( string $filename )
// 361: function is_executable(); // prototype:is_executable ( string $filename )
// 362: function is_file(); // prototype:is_file ( string $filename )
// 363: function is_dir(); // prototype:is_dir ( string $filename )
// 364: function is_link(); // prototype:is_link ( string $filename )
// 365: function stat(); // prototype:stat ( string $filename )
// 366: function lstat(); // prototype:lstat ( string $filename )
// 367: function chown(); // prototype:chown ( string $filename , mixed $user )
// 368: function chgrp(); // prototype:chgrp ( string $filename , mixed $group )
// 369: function chmod(); // prototype:chmod ( string $filename , int $mode )
// 370: function touch(); // prototype:touch ( string $filename [, int $time = time() [, int $atime ]] )
// 371: function clearstatcache(); // prototype:clearstatcache ([ bool $clear_realpath_cache = false [, string $filename ]] )
// 372: function disk_total_space(); // prototype:disk_total_space ( string $directory )
// 373: function disk_free_space(); // prototype:disk_free_space ( string $directory )
// 374: function diskfreespace(); // ALIAS of disk_free_space():diskfreespace(...)
// 375: function mail(); // prototype:mail ( string $to , string $subject , string $message [, string $additional_headers [, string $additional_parameters ]] )
// 376: function ezmlm_hash(); // prototype:ezmlm_hash ( string $addr )
// 377: function openlog(); // prototype:openlog ( string $ident , int $option , int $facility )
// 378: function syslog(); // prototype:syslog ( int $priority , string $message )
// 379: function closelog(); // prototype:closelog ( void )
// 380: function define_syslog_variables(); // prototype:define_syslog_variables ( void )
// 381: function lcg_value(); // prototype:lcg_value ( void )
// 382: function metaphone(); // prototype:metaphone ( string $str [, int $phones = 0 ] )
// 383: function ob_start(); // prototype:ob_start ([ callback $output_callback [, int $chunk_size [, bool $erase ]]] )
// 384: function ob_flush(); // prototype:ob_flush ( void )
// 385: function ob_clean(); // prototype:ob_clean ( void )
// 386: function ob_end_flush(); // prototype:ob_end_flush ( void )
// 387: function ob_end_clean(); // prototype:ob_end_clean ( void )
// 388: function ob_get_flush(); // prototype:ob_get_flush ( void )
// 389: function ob_get_clean(); // prototype:ob_get_clean ( void )
// 390: function ob_get_length(); // prototype:ob_get_length ( void )
// 391: function ob_get_level(); // prototype:ob_get_level ( void )
// 392: function ob_get_status(); // prototype:ob_get_status ([ bool $full_status = FALSE ] )
// 393: function ob_get_contents(); // prototype:ob_get_contents ( void )
// 394: function ob_implicit_flush(); // prototype:ob_implicit_flush ([ int $flag ] )
// 395: function ob_list_handlers(); // prototype:ob_list_handlers ( void )
// 396: function ksort(); // prototype:ksort ( array &amp;$array [, int $sort_flags = SORT_REGULAR ] )
// 397: function krsort(); // prototype:krsort ( array &amp;$array [, int $sort_flags = SORT_REGULAR ] )
// 398: function natsort(); // prototype:natsort ( array &amp;$array )
// 399: function natcasesort(); // prototype:natcasesort ( array &amp;$array )
// 400: function asort(); // prototype:asort ( array &amp;$array [, int $sort_flags = SORT_REGULAR ] )
// 401: function arsort(); // prototype:arsort ( array &amp;$array [, int $sort_flags = SORT_REGULAR ] )
// 402: function sort(); // prototype:sort ( array &amp;$array [, int $sort_flags = SORT_REGULAR ] )
// 403: function rsort(); // prototype:rsort ( array &amp;$array [, int $sort_flags = SORT_REGULAR ] )
// 404: function usort(); // prototype:usort ( array &amp;$array , callback $cmp_function )
// 405: function uasort(); // prototype:uasort ( array &amp;$array , callback $cmp_function )
// 406: function uksort(); // prototype:uksort ( array &amp;$array , callback $cmp_function )
// 407: function shuffle(); // prototype:shuffle ( array &amp;$array )
// 408: function array_walk(); // prototype:array_walk ( array &amp;$array , callback $funcname [, mixed $userdata ] )
// 409: function array_walk_recursive(); // prototype:array_walk_recursive ( array &amp;$input , callback $funcname [, mixed $userdata ] )
// 410: function count(); // prototype:count ( mixed $var [, int $mode = COUNT_NORMAL ] )
// 411: function end(); // prototype:end ( array &amp;$array )
// 412: function prev(); // prototype:prev ( array &amp;$array )
// 413: function next(); // prototype:next ( array &amp;$array )
// 414: function reset(); // prototype:reset ( array &amp;$array )
// 415: function current(); // prototype:current ( array &amp;$array )
// 416: function key(); // prototype:key ( array &amp;$array )
// 417: function min(); // prototype:min ( array $values )
// 418: function max(); // prototype:max ( array $values )
// 419: function in_array(); // prototype:in_array ( mixed $needle , array $haystack [, bool $strict ] )
// 420: function array_search(); // prototype:array_search ( mixed $needle , array $haystack [, bool $strict ] )
// 421: function extract(); // prototype:extract ( array $var_array [, int $extract_type = EXTR_OVERWRITE [, string $prefix ]] )
// 422: function compact(); // prototype:compact ( mixed $varname [, mixed $... ] )
// 423: function array_fill(); // prototype:array_fill ( int $start_index , int $num , mixed $value )
// 424: function array_fill_keys(); // prototype:array_fill_keys ( array $keys , mixed $value )
// 425: function range(); // prototype:range ( mixed $low , mixed $high [, number $step ] )
// 426: function array_multisort(); // prototype:array_multisort ( array &amp;$arr [, mixed $arg = SORT_ASC [, mixed $arg = SORT_REGULAR [, mixed $... ]]] )
// 427: function array_push(); // prototype:array_push ( array &amp;$array , mixed $var [, mixed $... ] )
// 428: function array_pop(); // prototype:array_pop ( array &amp;$array )
// 429: function array_shift(); // prototype:array_shift ( array &amp;$array )
// 430: function array_unshift(); // prototype:array_unshift ( array &amp;$array , mixed $var [, mixed $... ] )
// 431: function array_splice(); // prototype:array_splice ( array &amp;$input , int $offset [, int $length = 0 [, mixed $replacement ]] )
// 432: function array_slice(); // prototype:array_slice ( array $array , int $offset [, int $length [, bool $preserve_keys = false ]] )
// 433: function array_merge(); // prototype:array_merge ( array $array1 [, array $array2 [, array $... ]] )
// 434: function array_merge_recursive(); // prototype:array_merge_recursive ( array $array1 [, array $... ] )
// 435: function array_keys(); // prototype:array_keys ( array $input [, mixed $search_value [, bool $strict = false ]] )
// 436: function array_values(); // prototype:array_values ( array $input )
// 437: function array_count_values(); // prototype:array_count_values ( array $input )
// 438: function array_reverse(); // prototype:array_reverse ( array $array [, bool $preserve_keys = false ] )
// 439: function array_reduce(); // prototype:array_reduce ( array $input , callback $function [, int $initial ] )
// 440: function array_pad(); // prototype:array_pad ( array $input , int $pad_size , mixed $pad_value )
// 441: function array_flip(); // prototype:array_flip ( array $trans )
// 442: function array_change_key_case(); // prototype:array_change_key_case ( array $input [, int $case = CASE_LOWER ] )
// 443: function array_rand(); // prototype:array_rand ( array $input [, int $num_req = 1 ] )
// 444: function array_unique(); // prototype:array_unique ( array $array [, int $sort_flags = SORT_STRING ] )
// 445: function array_intersect(); // prototype:array_intersect ( array $array1 , array $array2 [, array $ ... ] )
// 446: function array_intersect_key(); // prototype:array_intersect_key ( array $array1 , array $array2 [, array $ ... ] )
// 447: function array_intersect_ukey(); // prototype:array_intersect_ukey ( array $array1 , array $array2 [, array $... ], callback $key_compare_func )
// 448: function array_uintersect(); // prototype:array_uintersect ( array $array1 , array $array2 [, array $ ... ], callback $data_compare_func )
// 449: function array_intersect_assoc(); // prototype:array_intersect_assoc ( array $array1 , array $array2 [, array $ ... ] )
// 450: function array_uintersect_assoc(); // prototype:array_uintersect_assoc ( array $array1 , array $array2 [, array $ ... ], callback $data_compare_func )
// 451: function array_intersect_uassoc(); // prototype:array_intersect_uassoc ( array $array1 , array $array2 [, array $ ... ], callback $key_compare_func )
// 452: function array_uintersect_uassoc(); // prototype:array_uintersect_uassoc ( array $array1 , array $array2 [, array $ ... ], callback $data_compare_func , callback $key_compare_func )
// 453: function array_diff(); // prototype:array_diff ( array $array1 , array $array2 [, array $ ... ] )
// 454: function array_diff_key(); // prototype:array_diff_key ( array $array1 , array $array2 [, array $... ] )
// 455: function array_diff_ukey(); // prototype:array_diff_ukey ( array $array1 , array $array2 [, array $ ... ], callback $key_compare_func )
// 456: function array_udiff(); // prototype:array_udiff ( array $array1 , array $array2 [, array $ ... ], callback $data_compare_func )
// 457: function array_diff_assoc(); // prototype:array_diff_assoc ( array $array1 , array $array2 [, array $... ] )
// 458: function array_udiff_assoc(); // prototype:array_udiff_assoc ( array $array1 , array $array2 [, array $ ... ], callback $data_compare_func )
// 459: function array_diff_uassoc(); // prototype:array_diff_uassoc ( array $array1 , array $array2 [, array $... ], callback $key_compare_func )
// 460: function array_udiff_uassoc(); // prototype:array_udiff_uassoc ( array $array1 , array $array2 [, array $ ... ], callback $data_compare_func , callback $key_compare_func )
// 461: function array_sum(); // prototype:array_sum ( array $array )
// 462: function array_product(); // prototype:array_product ( array $array )
// 463: function array_filter(); // prototype:array_filter ( array $input [, callback $callback ] )
// 464: function array_map(); // prototype:array_map ( callback $callback , array $arr1 [, array $... ] )
// 465: function array_chunk(); // prototype:array_chunk ( array $input , int $size [, bool $preserve_keys = false ] )
// 466: function array_combine(); // prototype:array_combine ( array $keys , array $values )
// 467: function array_key_exists(); // prototype:array_key_exists ( mixed $key , array $search )
// 468: function pos(); // ALIAS of current():pos(...)
// 469: function sizeof(); // ALIAS of count():sizeof(...)
// 470:key_exists: has been marked as 'INTERNAL' - skipping...
// 471: function assert(); // prototype:assert ( mixed $assertion )
// 472: function assert_options(); // prototype:assert_options ( int $what [, mixed $value ] )
// 473: function version_compare(); // prototype:version_compare ( string $version1 , string $version2 [, string $operator ] )
// 474: function str_rot13(); // prototype:str_rot13 ( string $str )
// 475: function stream_get_filters(); // prototype:stream_get_filters ( void )
// 476: function stream_filter_register(); // prototype:stream_filter_register ( string $filtername , string $classname )
// 477: function stream_bucket_make_writeable(); // prototype:stream_bucket_make_writeable ( resource $brigade )
// 478: function stream_bucket_prepend(); // prototype:stream_bucket_prepend ( resource $brigade , resource $bucket )
// 479: function stream_bucket_append(); // prototype:stream_bucket_append ( resource $brigade , resource $bucket )
// 480: function stream_bucket_new(); // prototype:stream_bucket_new ( resource $stream , string $buffer )
// 481: function output_add_rewrite_var(); // prototype:output_add_rewrite_var ( string $name , string $value )
// 482: function output_reset_rewrite_vars(); // prototype:output_reset_rewrite_vars ( void )
// 483: function sys_get_temp_dir(); // prototype:sys_get_temp_dir ( void )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension pdo
//@php_CORE2.xml#PDOException
 class PDOException extends RuntimeException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;
	public $errorInfo= array();
// Methods
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#PDO
 class PDO   {

// Constants
	 const PARAM_BOOL=5;
	 const PARAM_NULL=0;
	 const PARAM_INT=1;
	 const PARAM_STR=2;
	 const PARAM_LOB=3;
	 const PARAM_STMT=4;
	 const PARAM_INPUT_OUTPUT=-2147483648;
	 const PARAM_EVT_ALLOC=0;
	 const PARAM_EVT_FREE=1;
	 const PARAM_EVT_EXEC_PRE=2;
	 const PARAM_EVT_EXEC_POST=3;
	 const PARAM_EVT_FETCH_PRE=4;
	 const PARAM_EVT_FETCH_POST=5;
	 const PARAM_EVT_NORMALIZE=6;
	 const FETCH_LAZY=1;
	 const FETCH_ASSOC=2;
	 const FETCH_NUM=3;
	 const FETCH_BOTH=4;
	 const FETCH_OBJ=5;
	 const FETCH_BOUND=6;
	 const FETCH_COLUMN=7;
	 const FETCH_CLASS=8;
	 const FETCH_INTO=9;
	 const FETCH_FUNC=10;
	 const FETCH_GROUP=65536;
	 const FETCH_UNIQUE=196608;
	 const FETCH_KEY_PAIR=12;
	 const FETCH_CLASSTYPE=262144;
	 const FETCH_SERIALIZE=524288;
	 const FETCH_PROPS_LATE=1048576;
	 const FETCH_NAMED=11;
	 const ATTR_AUTOCOMMIT=0;
	 const ATTR_PREFETCH=1;
	 const ATTR_TIMEOUT=2;
	 const ATTR_ERRMODE=3;
	 const ATTR_SERVER_VERSION=4;
	 const ATTR_CLIENT_VERSION=5;
	 const ATTR_SERVER_INFO=6;
	 const ATTR_CONNECTION_STATUS=7;
	 const ATTR_CASE=8;
	 const ATTR_CURSOR_NAME=9;
	 const ATTR_CURSOR=10;
	 const ATTR_ORACLE_NULLS=11;
	 const ATTR_PERSISTENT=12;
	 const ATTR_STATEMENT_CLASS=13;
	 const ATTR_FETCH_TABLE_NAMES=14;
	 const ATTR_FETCH_CATALOG_NAMES=15;
	 const ATTR_DRIVER_NAME=16;
	 const ATTR_STRINGIFY_FETCHES=17;
	 const ATTR_MAX_COLUMN_LEN=18;
	 const ATTR_EMULATE_PREPARES=20;
	 const ATTR_DEFAULT_FETCH_MODE=19;
	 const ERRMODE_SILENT=0;
	 const ERRMODE_WARNING=1;
	 const ERRMODE_EXCEPTION=2;
	 const CASE_NATURAL=0;
	 const CASE_LOWER=2;
	 const CASE_UPPER=1;
	 const NULL_NATURAL=0;
	 const NULL_EMPTY_STRING=1;
	 const NULL_TO_STRING=2;
	 const ERR_NONE=00000;
	 const FETCH_ORI_NEXT=0;
	 const FETCH_ORI_PRIOR=1;
	 const FETCH_ORI_FIRST=2;
	 const FETCH_ORI_LAST=3;
	 const FETCH_ORI_ABS=4;
	 const FETCH_ORI_REL=5;
	 const CURSOR_FWDONLY=0;
	 const CURSOR_SCROLL=1;
	 const MYSQL_ATTR_USE_BUFFERED_QUERY=1000;
	 const MYSQL_ATTR_LOCAL_INFILE=1001;
	 const MYSQL_ATTR_INIT_COMMAND=1002;
	 const MYSQL_ATTR_READ_DEFAULT_FILE=1003;
	 const MYSQL_ATTR_READ_DEFAULT_GROUP=1004;
	 const MYSQL_ATTR_MAX_BUFFER_SIZE=1005;
	 const MYSQL_ATTR_DIRECT_QUERY=1006;
	 const PGSQL_ATTR_DISABLE_NATIVE_PREPARED_STATEMENT=1000;

// Properties

// Methods
 //@php_CORE2.xml#PDO::__construct
	public function __construct( $dsn , $username , $passwd , array $options ){ }
 //@php_CORE2.xml#PDO::prepare
	public function prepare( $statment , array $options ){ return new PDOStatement();}
 //@php_CORE2.xml#PDO::beginTransaction
	public function beginTransaction(){ }
 //@php_CORE2.xml#PDO::commit
	public function commit(){ }
 //@php_CORE2.xml#PDO::rollBack
	public function rollBack(){ }
 //@php_CORE2.xml#PDO::setAttribute
	public function setAttribute( $attribute , $value ){ }
 //@php_CORE2.xml#PDO::exec
	public function exec( $query ){ }
 //@php_CORE2.xml#PDO::query
	public function query(){ return new PDOStatement();}
 //@php_CORE2.xml#PDO::lastInsertId
	public function lastInsertId( $seqname ){ }
 //@php_CORE2.xml#PDO::errorCode
	public function errorCode(){ }
 //@php_CORE2.xml#PDO::errorInfo
	public function errorInfo(){ return array();}
 //@php_CORE2.xml#PDO::getAttribute
	public function getAttribute( $attribute ){ }
 //@php_CORE2.xml#PDO::quote
	public function quote( $string , $paramtype ){ }
 //@php_CORE2.xml#PDO::getAvailableDrivers
	public static function getAvailableDrivers(){ return array();}

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#PDOStatement
 class PDOStatement  {
// Constants
// Properties
	public $queryString;

// Methods
 //@php_CORE2.xml#PDOStatement->execute
	public function execute( array $bound_input_params ){ }
 //@php_CORE2.xml#PDOStatement->fetch
	public function fetch( $how , $orientation , $offset ){ }
 //@php_CORE2.xml#PDOStatement->bindParam
	public function bindParam( $paramno , &$param , $type , $maxlen , $driverdata ){ }
 //@php_CORE2.xml#PDOStatement->bindColumn
	public function bindColumn( $column , &$param , $type , $maxlen , $driverdata ){ }
 //@php_CORE2.xml#PDOStatement->bindValue
	public function bindValue( $paramno , $param , $type ){ }
 //@php_CORE2.xml#PDOStatement->rowCount
	public function rowCount(){ }
 //@php_CORE2.xml#PDOStatement->fetchColumn
	public function fetchColumn( $column_number ){ }
 //@php_CORE2.xml#PDOStatement->fetchAll
	public function fetchAll( $how , $class_name , array $ctor_args ){ return array();}
 //@php_CORE2.xml#PDOStatement->fetchObject
	public function fetchObject( $class_name , array $ctor_args ){ }
 //@php_CORE2.xml#PDOStatement->errorCode
	public function errorCode(){ }
 //@php_CORE2.xml#PDOStatement->errorInfo
	public function errorInfo(){ return array();}
 //@php_CORE2.xml#PDOStatement->setAttribute
	public function setAttribute( $attribute , $value ){ }
 //@php_CORE2.xml#PDOStatement->getAttribute
	public function getAttribute( $attribute ){ }
 //@php_CORE2.xml#PDOStatement->columnCount
	public function columnCount(){ }
 //@php_CORE2.xml#PDOStatement->getColumnMeta
	public function getColumnMeta( $column ){ return array();}
 //@php_CORE2.xml#PDOStatement->setFetchMode
	public function setFetchMode( $mode , $params ){ }
 //@php_CORE2.xml#PDOStatement->nextRowset
	public function nextRowset(){ }
 //@php_CORE2.xml#PDOStatement->closeCursor
	public function closeCursor(){ }
 //@php_CORE2.xml#PDOStatement->debugDumpParams
	public function debugDumpParams(){ }
}

////////////////////////////////////////////////////////////////////////////////////
// WARNING: class PDORow is an internal/undocummented class; skipping....
////////////////////////////////////////////////////////////////////////////////////

/////////////////// ********** FUNCTIONS (1 total functions) ************ ///////////////////////////////
// 1:pdo_drivers: has been marked as 'INTERNAL' - skipping...
/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension tokenizer
	define( 'T_REQUIRE_ONCE',261);
	define( 'T_REQUIRE',260);
	define( 'T_EVAL',259);
	define( 'T_INCLUDE_ONCE',258);
	define( 'T_INCLUDE',257);
	define( 'T_LOGICAL_OR',262);
	define( 'T_LOGICAL_XOR',263);
	define( 'T_LOGICAL_AND',264);
	define( 'T_PRINT',265);
	define( 'T_SR_EQUAL',276);
	define( 'T_SL_EQUAL',275);
	define( 'T_XOR_EQUAL',274);
	define( 'T_OR_EQUAL',273);
	define( 'T_AND_EQUAL',272);
	define( 'T_MOD_EQUAL',271);
	define( 'T_CONCAT_EQUAL',270);
	define( 'T_DIV_EQUAL',269);
	define( 'T_MUL_EQUAL',268);
	define( 'T_MINUS_EQUAL',267);
	define( 'T_PLUS_EQUAL',266);
	define( 'T_BOOLEAN_OR',277);
	define( 'T_BOOLEAN_AND',278);
	define( 'T_IS_NOT_IDENTICAL',282);
	define( 'T_IS_IDENTICAL',281);
	define( 'T_IS_NOT_EQUAL',280);
	define( 'T_IS_EQUAL',279);
	define( 'T_IS_GREATER_OR_EQUAL',284);
	define( 'T_IS_SMALLER_OR_EQUAL',283);
	define( 'T_SR',286);
	define( 'T_SL',285);
	define( 'T_INSTANCEOF',287);
	define( 'T_UNSET_CAST',296);
	define( 'T_BOOL_CAST',295);
	define( 'T_OBJECT_CAST',294);
	define( 'T_ARRAY_CAST',293);
	define( 'T_STRING_CAST',292);
	define( 'T_DOUBLE_CAST',291);
	define( 'T_INT_CAST',290);
	define( 'T_DEC',289);
	define( 'T_INC',288);
	define( 'T_CLONE',298);
	define( 'T_NEW',297);
	define( 'T_EXIT',299);
	define( 'T_IF',300);
	define( 'T_ELSEIF',301);
	define( 'T_ELSE',302);
	define( 'T_ENDIF',303);
	define( 'T_LNUMBER',304);
	define( 'T_DNUMBER',305);
	define( 'T_STRING',306);
	define( 'T_STRING_VARNAME',307);
	define( 'T_VARIABLE',308);
	define( 'T_NUM_STRING',309);
	define( 'T_INLINE_HTML',310);
	define( 'T_CHARACTER',311);
	define( 'T_BAD_CHARACTER',312);
	define( 'T_ENCAPSED_AND_WHITESPACE',313);
	define( 'T_CONSTANT_ENCAPSED_STRING',314);
	define( 'T_ECHO',315);
	define( 'T_DO',316);
	define( 'T_WHILE',317);
	define( 'T_ENDWHILE',318);
	define( 'T_FOR',319);
	define( 'T_ENDFOR',320);
	define( 'T_FOREACH',321);
	define( 'T_ENDFOREACH',322);
	define( 'T_DECLARE',323);
	define( 'T_ENDDECLARE',324);
	define( 'T_AS',325);
	define( 'T_SWITCH',326);
	define( 'T_ENDSWITCH',327);
	define( 'T_CASE',328);
	define( 'T_DEFAULT',329);
	define( 'T_BREAK',330);
	define( 'T_CONTINUE',331);
	define( 'T_FUNCTION',332);
	define( 'T_CONST',333);
	define( 'T_RETURN',334);
	define( 'T_TRY',335);
	define( 'T_CATCH',336);
	define( 'T_THROW',337);
	define( 'T_USE',338);
	define( 'T_GLOBAL',339);
	define( 'T_PUBLIC',345);
	define( 'T_PROTECTED',344);
	define( 'T_PRIVATE',343);
	define( 'T_FINAL',342);
	define( 'T_ABSTRACT',341);
	define( 'T_STATIC',340);
	define( 'T_VAR',346);
	define( 'T_UNSET',347);
	define( 'T_ISSET',348);
	define( 'T_EMPTY',349);
	define( 'T_HALT_COMPILER',350);
	define( 'T_CLASS',351);
	define( 'T_INTERFACE',352);
	define( 'T_EXTENDS',353);
	define( 'T_IMPLEMENTS',354);
	define( 'T_OBJECT_OPERATOR',355);
	define( 'T_DOUBLE_ARROW',356);
	define( 'T_LIST',357);
	define( 'T_ARRAY',358);
	define( 'T_CLASS_C',359);
	define( 'T_METHOD_C',360);
	define( 'T_FUNC_C',361);
	define( 'T_LINE',362);
	define( 'T_FILE',363);
	define( 'T_COMMENT',364);
	define( 'T_DOC_COMMENT',365);
	define( 'T_OPEN_TAG',366);
	define( 'T_OPEN_TAG_WITH_ECHO',367);
	define( 'T_CLOSE_TAG',368);
	define( 'T_WHITESPACE',369);
	define( 'T_START_HEREDOC',370);
	define( 'T_END_HEREDOC',371);
	define( 'T_DOLLAR_OPEN_CURLY_BRACES',372);
	define( 'T_CURLY_OPEN',373);
	define( 'T_PAAMAYIM_NEKUDOTAYIM',374);
	define( 'T_DOUBLE_COLON',374);

/////////////////// ********** FUNCTIONS (2 total functions) ************ ///////////////////////////////

// 1: function token_get_all(); // prototype:token_get_all ( string $source )
// 2: function token_name(); // prototype:token_name ( int $token )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension gd
	define( 'IMG_GIF',1);
	define( 'IMG_JPG',2);
	define( 'IMG_JPEG',2);
	define( 'IMG_PNG',4);
	define( 'IMG_WBMP',8);
	define( 'IMG_XPM',16);
	define( 'IMG_COLOR_TILED',-5);
	define( 'IMG_COLOR_STYLED',-2);
	define( 'IMG_COLOR_BRUSHED',-3);
	define( 'IMG_COLOR_STYLEDBRUSHED',-4);
	define( 'IMG_COLOR_TRANSPARENT',-6);
	define( 'IMG_ARC_ROUNDED',0);
	define( 'IMG_ARC_PIE',0);
	define( 'IMG_ARC_CHORD',1);
	define( 'IMG_ARC_NOFILL',2);
	define( 'IMG_ARC_EDGED',4);
	define( 'IMG_GD2_RAW',1);
	define( 'IMG_GD2_COMPRESSED',2);
	define( 'IMG_EFFECT_REPLACE',0);
	define( 'IMG_EFFECT_ALPHABLEND',1);
	define( 'IMG_EFFECT_NORMAL',2);
	define( 'IMG_EFFECT_OVERLAY',3);
	define( 'GD_BUNDLED',1);
	define( 'IMG_FILTER_NEGATE',0);
	define( 'IMG_FILTER_GRAYSCALE',1);
	define( 'IMG_FILTER_BRIGHTNESS',2);
	define( 'IMG_FILTER_CONTRAST',3);
	define( 'IMG_FILTER_COLORIZE',4);
	define( 'IMG_FILTER_EDGEDETECT',5);
	define( 'IMG_FILTER_GAUSSIAN_BLUR',7);
	define( 'IMG_FILTER_SELECTIVE_BLUR',8);
	define( 'IMG_FILTER_EMBOSS',6);
	define( 'IMG_FILTER_MEAN_REMOVAL',9);
	define( 'IMG_FILTER_SMOOTH',10);
	define( 'GD_VERSION','2.0.35');
	define( 'GD_MAJOR_VERSION',2);
	define( 'GD_MINOR_VERSION',0);
	define( 'GD_RELEASE_VERSION',35);
	define( 'GD_EXTRA_VERSION','');
	define( 'PNG_NO_FILTER',0);
	define( 'PNG_FILTER_NONE',8);
	define( 'PNG_FILTER_SUB',16);
	define( 'PNG_FILTER_UP',32);
	define( 'PNG_FILTER_AVG',64);
	define( 'PNG_FILTER_PAETH',128);
	define( 'PNG_ALL_FILTERS',248);

/////////////////// ********** FUNCTIONS (95 total functions) ************ ///////////////////////////////

// 1: function gd_info(); // prototype:gd_info ( void )
// 2: function imagearc(); // prototype:imagearc ( resource $image , int $cx , int $cy , int $width , int $height , int $start , int $end , int $color )
// 3: function imageellipse(); // prototype:imageellipse ( resource $image , int $cx , int $cy , int $width , int $height , int $color )
// 4: function imagechar(); // prototype:imagechar ( resource $image , int $font , int $x , int $y , string $c , int $color )
// 5: function imagecharup(); // prototype:imagecharup ( resource $image , int $font , int $x , int $y , string $c , int $color )
// 6: function imagecolorat(); // prototype:imagecolorat ( resource $image , int $x , int $y )
// 7: function imagecolorallocate(); // prototype:imagecolorallocate ( resource $image , int $red , int $green , int $blue )
// 8: function imagepalettecopy(); // prototype:imagepalettecopy ( resource $destination , resource $source )
// 9: function imagecreatefromstring(); // prototype:imagecreatefromstring ( string $data )
// 10: function imagecolorclosest(); // prototype:imagecolorclosest ( resource $image , int $red , int $green , int $blue )
// 11: function imagecolordeallocate(); // prototype:imagecolordeallocate ( resource $image , int $color )
// 12: function imagecolorresolve(); // prototype:imagecolorresolve ( resource $image , int $red , int $green , int $blue )
// 13: function imagecolorexact(); // prototype:imagecolorexact ( resource $image , int $red , int $green , int $blue )
// 14: function imagecolorset(); // prototype:imagecolorset ( resource $image , int $index , int $red , int $green , int $blue )
// 15: function imagecolortransparent(); // prototype:imagecolortransparent ( resource $image [, int $color ] )
// 16: function imagecolorstotal(); // prototype:imagecolorstotal ( resource $image )
// 17: function imagecolorsforindex(); // prototype:imagecolorsforindex ( resource $image , int $index )
// 18: function imagecopy(); // prototype:imagecopy ( resource $dst_im , resource $src_im , int $dst_x , int $dst_y , int $src_x , int $src_y , int $src_w , int $src_h )
// 19: function imagecopymerge(); // prototype:imagecopymerge ( resource $dst_im , resource $src_im , int $dst_x , int $dst_y , int $src_x , int $src_y , int $src_w , int $src_h , int $pct )
// 20: function imagecopymergegray(); // prototype:imagecopymergegray ( resource $dst_im , resource $src_im , int $dst_x , int $dst_y , int $src_x , int $src_y , int $src_w , int $src_h , int $pct )
// 21: function imagecopyresized(); // prototype:imagecopyresized ( resource $dst_image , resource $src_image , int $dst_x , int $dst_y , int $src_x , int $src_y , int $dst_w , int $dst_h , int $src_w , int $src_h )
// 22: function imagecreate(); // prototype:imagecreate ( int $width , int $height )
// 23: function imagecreatetruecolor(); // prototype:imagecreatetruecolor ( int $width , int $height )
// 24: function imageistruecolor(); // prototype:imageistruecolor ( resource $image )
// 25: function imagetruecolortopalette(); // prototype:imagetruecolortopalette ( resource $image , bool $dither , int $ncolors )
// 26: function imagesetthickness(); // prototype:imagesetthickness ( resource $image , int $thickness )
// 27: function imagefilledarc(); // prototype:imagefilledarc ( resource $image , int $cx , int $cy , int $width , int $height , int $start , int $end , int $color , int $style )
// 28: function imagefilledellipse(); // prototype:imagefilledellipse ( resource $image , int $cx , int $cy , int $width , int $height , int $color )
// 29: function imagealphablending(); // prototype:imagealphablending ( resource $image , bool $blendmode )
// 30: function imagesavealpha(); // prototype:imagesavealpha ( resource $image , bool $saveflag )
// 31: function imagecolorallocatealpha(); // prototype:imagecolorallocatealpha ( resource $image , int $red , int $green , int $blue , int $alpha )
// 32: function imagecolorresolvealpha(); // prototype:imagecolorresolvealpha ( resource $image , int $red , int $green , int $blue , int $alpha )
// 33: function imagecolorclosestalpha(); // prototype:imagecolorclosestalpha ( resource $image , int $red , int $green , int $blue , int $alpha )
// 34: function imagecolorexactalpha(); // prototype:imagecolorexactalpha ( resource $image , int $red , int $green , int $blue , int $alpha )
// 35: function imagecopyresampled(); // prototype:imagecopyresampled ( resource $dst_image , resource $src_image , int $dst_x , int $dst_y , int $src_x , int $src_y , int $dst_w , int $dst_h , int $src_w , int $src_h )
// 36: function imagegrabwindow(); // prototype:imagegrabwindow ( int $window [, int $client_area = 0 ] )
// 37: function imagegrabscreen(); // prototype:imagegrabscreen ( void )
// 38: function imagerotate(); // prototype:imagerotate ( resource $image , float $angle , int $bgd_color [, int $ignore_transparent = 0 ] )
// 39: function imageantialias(); // prototype:imageantialias ( resource $image , bool $enabled )
// 40: function imagesettile(); // prototype:imagesettile ( resource $image , resource $tile )
// 41: function imagesetbrush(); // prototype:imagesetbrush ( resource $image , resource $brush )
// 42: function imagesetstyle(); // prototype:imagesetstyle ( resource $image , array $style )
// 43: function imagecreatefrompng(); // prototype:imagecreatefrompng ( string $filename )
// 44: function imagecreatefromgif(); // prototype:imagecreatefromgif ( string $filename )
// 45: function imagecreatefromjpeg(); // prototype:imagecreatefromjpeg ( string $filename )
// 46: function imagecreatefromwbmp(); // prototype:imagecreatefromwbmp ( string $filename )
// 47: function imagecreatefromxbm(); // prototype:imagecreatefromxbm ( string $filename )
// 48: function imagecreatefromgd(); // prototype:imagecreatefromgd ( string $filename )
// 49: function imagecreatefromgd2(); // prototype:imagecreatefromgd2 ( string $filename )
// 50: function imagecreatefromgd2part(); // prototype:imagecreatefromgd2part ( string $filename , int $srcX , int $srcY , int $width , int $height )
// 51: function imagepng(); // prototype:imagepng ( resource $image [, string $filename [, int $quality [, int $filters ]]] )
// 52: function imagegif(); // prototype:imagegif ( resource $image [, string $filename ] )
// 53: function imagejpeg(); // prototype:imagejpeg ( resource $image [, string $filename [, int $quality ]] )
// 54: function imagewbmp(); // prototype:imagewbmp ( resource $image [, string $filename [, int $foreground ]] )
// 55: function imagegd(); // prototype:imagegd ( resource $image [, string $filename ] )
// 56: function imagegd2(); // prototype:imagegd2 ( resource $image [, string $filename [, int $chunk_size [, int $type ]]] )
// 57: function imagedestroy(); // prototype:imagedestroy ( resource $image )
// 58: function imagegammacorrect(); // prototype:imagegammacorrect ( resource $image , float $inputgamma , float $outputgamma )
// 59: function imagefill(); // prototype:imagefill ( resource $image , int $x , int $y , int $color )
// 60: function imagefilledpolygon(); // prototype:imagefilledpolygon ( resource $image , array $points , int $num_points , int $color )
// 61: function imagefilledrectangle(); // prototype:imagefilledrectangle ( resource $image , int $x1 , int $y1 , int $x2 , int $y2 , int $color )
// 62: function imagefilltoborder(); // prototype:imagefilltoborder ( resource $image , int $x , int $y , int $border , int $color )
// 63: function imagefontwidth(); // prototype:imagefontwidth ( int $font )
// 64: function imagefontheight(); // prototype:imagefontheight ( int $font )
// 65: function imageinterlace(); // prototype:imageinterlace ( resource $image [, int $interlace = 0 ] )
// 66: function imageline(); // prototype:imageline ( resource $image , int $x1 , int $y1 , int $x2 , int $y2 , int $color )
// 67: function imageloadfont(); // prototype:imageloadfont ( string $file )
// 68: function imagepolygon(); // prototype:imagepolygon ( resource $image , array $points , int $num_points , int $color )
// 69: function imagerectangle(); // prototype:imagerectangle ( resource $image , int $x1 , int $y1 , int $x2 , int $y2 , int $color )
// 70: function imagesetpixel(); // prototype:imagesetpixel ( resource $image , int $x , int $y , int $color )
// 71: function imagestring(); // prototype:imagestring ( resource $image , int $font , int $x , int $y , string $string , int $color )
// 72: function imagestringup(); // prototype:imagestringup ( resource $image , int $font , int $x , int $y , string $string , int $color )
// 73: function imagesx(); // prototype:imagesx ( resource $image )
// 74: function imagesy(); // prototype:imagesy ( resource $image )
// 75: function imagedashedline(); // prototype:imagedashedline ( resource $image , int $x1 , int $y1 , int $x2 , int $y2 , int $color )
// 76: function imagettfbbox(); // prototype:imagettfbbox ( float $size , float $angle , string $fontfile , string $text )
// 77: function imagettftext(); // prototype:imagettftext ( resource $image , float $size , float $angle , int $x , int $y , int $color , string $fontfile , string $text )
// 78: function imageftbbox(); // prototype:imageftbbox ( float $size , float $angle , string $fontfile , string $text [, array $extrainfo ] )
// 79: function imagefttext(); // prototype:imagefttext ( resource $image , float $size , float $angle , int $x , int $y , int $color , string $fontfile , string $text [, array $extrainfo ] )
// 80: function imagepsloadfont(); // prototype:imagepsloadfont ( string $filename )
// 81: function imagepsfreefont(); // prototype:imagepsfreefont ( resource $font_index )
// 82: function imagepsencodefont(); // prototype:imagepsencodefont ( resource $font_index , string $encodingfile )
// 83: function imagepsextendfont(); // prototype:imagepsextendfont ( resource $font_index , float $extend )
// 84: function imagepsslantfont(); // prototype:imagepsslantfont ( resource $font_index , float $slant )
// 85: function imagepstext(); // prototype:imagepstext ( resource $image , string $text , resource $font_index , int $size , int $foreground , int $background , int $x , int $y [, int $space = 0 [, int $tightness = 0 [, float $angle = 0.0 [, int $antialias_steps = 4 ]]]] )
// 86: function imagepsbbox(); // prototype:imagepsbbox ( string $text , resource $font , int $size )
// 87: function imagetypes(); // prototype:imagetypes ( void )
// 88: function jpeg2wbmp(); // prototype:jpeg2wbmp ( string $jpegname , string $wbmpname , int $dest_height , int $dest_width , int $threshold )
// 89: function png2wbmp(); // prototype:png2wbmp ( string $pngname , string $wbmpname , int $dest_height , int $dest_width , int $threshold )
// 90: function image2wbmp(); // prototype:image2wbmp ( resource $image [, string $filename [, int $threshold ]] )
// 91: function imagelayereffect(); // prototype:imagelayereffect ( resource $image , int $effect )
// 92: function imagecolormatch(); // prototype:imagecolormatch ( resource $image1 , resource $image2 )
// 93: function imagexbm(); // prototype:imagexbm ( resource $image , string $filename [, int $foreground ] )
// 94: function imagefilter(); // prototype:imagefilter ( resource $image , int $filtertype [, int $arg1 [, int $arg2 [, int $arg3 [, int $arg4 ]]]] )
// 95: function imageconvolution(); // prototype:imageconvolution ( resource $image , array $matrix , float $div , float $offset )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension sqlite
// WARNING: class SQLiteDatabase is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////
// WARNING: class SQLiteResult is an internal/undocummented class; skipping....
////////////////////////////////////////////////////////////////////////////////////
// WARNING: class SQLiteUnbuffered is an internal/undocummented class; skipping....
////////////////////////////////////////////////////////////////////////////////////
// WARNING: class SQLiteException is an internal/undocummented class; skipping....
////////////////////////////////////////////////////////////////////////////////////

	define( 'SQLITE_BOTH',3);
	define( 'SQLITE_NUM',2);
	define( 'SQLITE_ASSOC',1);
	define( 'SQLITE_OK',0);
	define( 'SQLITE_ERROR',1);
	define( 'SQLITE_INTERNAL',2);
	define( 'SQLITE_PERM',3);
	define( 'SQLITE_ABORT',4);
	define( 'SQLITE_BUSY',5);
	define( 'SQLITE_LOCKED',6);
	define( 'SQLITE_NOMEM',7);
	define( 'SQLITE_READONLY',8);
	define( 'SQLITE_INTERRUPT',9);
	define( 'SQLITE_IOERR',10);
	define( 'SQLITE_CORRUPT',11);
	define( 'SQLITE_NOTFOUND',12);
	define( 'SQLITE_FULL',13);
	define( 'SQLITE_CANTOPEN',14);
	define( 'SQLITE_PROTOCOL',15);
	define( 'SQLITE_EMPTY',16);
	define( 'SQLITE_SCHEMA',17);
	define( 'SQLITE_TOOBIG',18);
	define( 'SQLITE_CONSTRAINT',19);
	define( 'SQLITE_MISMATCH',20);
	define( 'SQLITE_MISUSE',21);
	define( 'SQLITE_NOLFS',22);
	define( 'SQLITE_AUTH',23);
	define( 'SQLITE_NOTADB',26);
	define( 'SQLITE_FORMAT',24);
	define( 'SQLITE_ROW',100);
	define( 'SQLITE_DONE',101);

/////////////////// ********** FUNCTIONS (39 total functions) ************ ///////////////////////////////

// 1: function sqlite_open(); // prototype:sqlite_open ( string $filename [, int $mode = 0666 [, string &amp;$error_message ]] )
// 2: function sqlite_popen(); // prototype:sqlite_popen ( string $filename [, int $mode = 0666 [, string &amp;$error_message ]] )
// 3: function sqlite_close(); // prototype:sqlite_close ( resource $dbhandle )
// 4: function sqlite_query(); // prototype:sqlite_query ( resource $dbhandle , string $query [, int $result_type [, string &amp;$error_msg ]] )
// 5: function sqlite_exec(); // prototype:sqlite_exec ( resource $dbhandle , string $query [, string &amp;$error_msg ] )
// 6: function sqlite_array_query(); // prototype:sqlite_array_query ( resource $dbhandle , string $query [, int $result_type [, bool $decode_binary ]] )
// 7: function sqlite_single_query(); // prototype:sqlite_single_query ( resource $db , string $query [, bool $first_row_only [, bool $decode_binary ]] )
// 8: function sqlite_fetch_array(); // prototype:sqlite_fetch_array ( resource $result [, int $result_type = SQLITE_BOTH [, bool $decode_binary = true ]] )
// 9: function sqlite_fetch_object(); // prototype:sqlite_fetch_object ( resource $result [, string $class_name [, array $ctor_params [, bool $decode_binary = true ]]] )
// 10: function sqlite_fetch_single(); // prototype:sqlite_fetch_single ( resource $result [, bool $decode_binary = true ] )
// 11: function sqlite_fetch_string(); // ALIAS of sqlite_fetch_single():sqlite_fetch_string(...)
// 12: function sqlite_fetch_all(); // prototype:sqlite_fetch_all ( resource $result [, int $result_type = SQLITE_BOTH [, bool $decode_binary = true ]] )
// 13: function sqlite_current(); // prototype:sqlite_current ( resource $result [, int $result_type = SQLITE_BOTH [, bool $decode_binary = true ]] )
// 14: function sqlite_column(); // prototype:sqlite_column ( resource $result , mixed $index_or_name [, bool $decode_binary = true ] )
// 15: function sqlite_libversion(); // prototype:sqlite_libversion ( void )
// 16: function sqlite_libencoding(); // prototype:sqlite_libencoding ( void )
// 17: function sqlite_changes(); // prototype:sqlite_changes ( resource $dbhandle )
// 18: function sqlite_last_insert_rowid(); // prototype:sqlite_last_insert_rowid ( resource $dbhandle )
// 19: function sqlite_num_rows(); // prototype:sqlite_num_rows ( resource $result )
// 20: function sqlite_num_fields(); // prototype:sqlite_num_fields ( resource $result )
// 21: function sqlite_field_name(); // prototype:sqlite_field_name ( resource $result , int $field_index )
// 22: function sqlite_seek(); // prototype:sqlite_seek ( resource $result , int $rownum )
// 23: function sqlite_rewind(); // prototype:sqlite_rewind ( resource $result )
// 24: function sqlite_next(); // prototype:sqlite_next ( resource $result )
// 25: function sqlite_prev(); // prototype:sqlite_prev ( resource $result )
// 26: function sqlite_valid(); // prototype:sqlite_valid ( resource $result )
// 27: function sqlite_has_more(); // prototype:sqlite_has_more ( resource $result )
// 28: function sqlite_has_prev(); // prototype:sqlite_has_prev ( resource $result )
// 29: function sqlite_escape_string(); // prototype:sqlite_escape_string ( string $item )
// 30: function sqlite_busy_timeout(); // prototype:sqlite_busy_timeout ( resource $dbhandle , int $milliseconds )
// 31: function sqlite_last_error(); // prototype:sqlite_last_error ( resource $dbhandle )
// 32: function sqlite_error_string(); // prototype:sqlite_error_string ( int $error_code )
// 33: function sqlite_unbuffered_query(); // prototype:sqlite_unbuffered_query ( resource $dbhandle , string $query [, int $result_type [, string &amp;$error_msg ]] )
// 34: function sqlite_create_aggregate(); // prototype:sqlite_create_aggregate ( resource $dbhandle , string $function_name , callback $step_func , callback $finalize_func [, int $num_args = -1 ] )
// 35: function sqlite_create_function(); // prototype:sqlite_create_function ( resource $dbhandle , string $function_name , callback $callback [, int $num_args = -1 ] )
// 36: function sqlite_factory(); // prototype:sqlite_factory ( string $filename [, int $mode = 0666 [, string &amp;$error_message ]] )
// 37: function sqlite_udf_encode_binary(); // prototype:sqlite_udf_encode_binary ( string $data )
// 38: function sqlite_udf_decode_binary(); // prototype:sqlite_udf_decode_binary ( string $data )
// 39: function sqlite_fetch_column_types(); // prototype:sqlite_fetch_column_types ( string $table_name , resource $dbhandle [, int $result_type ] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension spl
//@php_CORE2.xml#RecursiveIterator
 interface RecursiveIterator  extends Iterator {

// Constants

// Properties

// Methods
 //@php_CORE2.xml#RecursiveIterator::hasChildren
	abstract public function hasChildren();
 //@php_CORE2.xml#RecursiveIterator::getChildren
	abstract public function getChildren();

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#RecursiveIteratorIterator
 class RecursiveIteratorIterator  implements Iterator,OuterIterator {

// Constants
	 const LEAVES_ONLY=0;
	 const SELF_FIRST=1;
	 const CHILD_FIRST=2;
	 const CATCH_GET_CHILD=16;

// Properties

// Methods

   public function __construct(_internal_Traversable $iterator, $mode, $args) {}
 //@php_CORE2.xml#RecursiveIteratorIterator::rewind
	public function rewind(){ }
 //@php_CORE2.xml#RecursiveIteratorIterator::valid
	public function valid(){ }
 //@php_CORE2.xml#RecursiveIteratorIterator::key
	public function key(){ }
 //@php_CORE2.xml#RecursiveIteratorIterator::current
	public function current(){ }
 //@php_CORE2.xml#RecursiveIteratorIterator::next
	public function next(){ }
 //@php_CORE2.xml#RecursiveIteratorIterator::getDepth
	public function getDepth(){ }
 //@php_CORE2.xml#RecursiveIteratorIterator::getSubIterator
	public function getSubIterator( $level ){ return new RecursiveIterator();}
 //@php_CORE2.xml#OuterIterator::getInnerIterator
	public function getInnerIterator() { return new Iterator(); }
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#OuterIterator
 interface OuterIterator  extends Iterator {

// Constants

// Properties

// Methods
 //@php_CORE2.xml#OuterIterator::getInnerIterator
	public function getInnerIterator() { return new Iterator(); }
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE3.xml#IteratorIterator
class IteratorIterator  implements Iterator,OuterIterator {

// Constants

// Properties

// Methods
 //@php_CORE3.xml#IteratorIterator::__construct
	public function __construct( _internal_Traversable $iterator ){ }
 //@php_CORE3.xml#IteratorIterator::rewind
	public function rewind(){ }
 //@php_CORE3.xml#IteratorIterator::valid
	public function valid(){ }
 //@php_CORE3.xml#IteratorIterator::key
	public function key(){ }
 //@php_CORE3.xml#IteratorIterator::current
	public function current(){ }
 //@php_CORE3.xml#IteratorIterator::next
	public function next(){ }
 //@php_CORE3.xml#IteratorIterator::getInnerIterator
	public function getInnerIterator(){ return new Iterator();}

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#FilterIterator
abstract class FilterIterator extends IteratorIterator implements OuterIterator,Iterator {

// Constants

// Properties

// Methods
   function __construct(Iterator $iterator);
  //@php_CORE4.xml#FilterIterator::rewind
	public function rewind(){ }
 //@php_CORE4.xml#FilterIterator::valid
	public function valid(){ }
 //@php_CORE4.xml#FilterIterator::key
	public function key(){ }
 //@php_CORE4.xml#FilterIterator::current
	public function current(){ }
 //@php_CORE4.xml#FilterIterator::next
	public function next(){ }
 //@php_CORE4.xml#FilterIterator::getInnerIterator
	public function getInnerIterator(){ return new Iterator();}
 //@php_CORE4.xml#FilterIterator::accept
	abstract public function accept();

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#RecursiveFilterIterator
abstract class RecursiveFilterIterator extends FilterIterator implements Iterator,OuterIterator,RecursiveIterator {

// Constants

// Properties

// Methods
 //@php_CORE2.xml#RecursiveFilterIterator::__construct
	public function __construct( RecursiveIterator $iterator );
 //@php_CORE2.xml#RecursiveFilterIterator::hasChildren
	public function hasChildren(){ }
 //@php_CORE2.xml#RecursiveFilterIterator::getChildren
	public function getChildren(){ return new RecursiveFilterIterator();}
	public function accept(){ return 1;}
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#ParentIterator
 class ParentIterator extends RecursiveFilterIterator implements RecursiveIterator,OuterIterator,Iterator {

// Constants

// Properties

// Methods
	public function __construct( RecursiveIterator $iterator );
	public function accept(){ return 1;}

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#Countable
 interface Countable   {

// Constants

// Properties

// Methods
 //@php_CORE4.xml#Countable::count
	abstract public function count();

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE.xml#SeekableIterator
 interface SeekableIterator  extends Iterator {

// Constants

// Properties

// Methods
 //@php_CORE.xml#SeekableIterator::seek
	abstract public function seek( $position );

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE3.xml#LimitIterator
 class LimitIterator extends IteratorIterator implements OuterIterator,Iterator {

// Constants

// Properties

// Methods
    public function __construct(Iterator $iterator,$offset, $count ) {}
 //@php_CORE3.xml#LimitIterator::rewind
	public function rewind(){ }
 //@php_CORE3.xml#LimitIterator::valid
	public function valid(){ }
 //@php_CORE3.xml#LimitIterator::next
	public function next(){ }
 //@php_CORE3.xml#LimitIterator::seek
	public function seek( $position ){ }
 //@php_CORE3.xml#LimitIterator::getPosition
	public function getPosition(){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#CachingIterator
 class CachingIterator extends IteratorIterator implements OuterIterator,Iterator,ArrayAccess,Countable {

// Constants
	 const CALL_TOSTRING=1;
	 const CATCH_GET_CHILD=16;
	 const TOSTRING_USE_KEY=2;
	 const TOSTRING_USE_CURRENT=4;
	 const TOSTRING_USE_INNER=8;
	 const FULL_CACHE=256;

// Properties

// Methods
 //@php_CORE4.xml#CachingIterator::__construct
	public function __construct( Iterator $iterator , $flags ){ }
 //@php_CORE4.xml#CachingIterator::rewind
	public function rewind(){ }
 //@php_CORE4.xml#CachingIterator::valid
	public function valid(){ }
 //@php_CORE4.xml#CachingIterator::key
	public function key(){ }
 //@php_CORE4.xml#CachingIterator::current
	public function current(){ }
 //@php_CORE4.xml#CachingIterator::next
	public function next(){ }
 //@php_CORE4.xml#CachingIterator::hasNext
	public function hasNext(){ }
 //@php_CORE4.xml#CachingIterator::__toString
	public function __toString(){ }
 //@php_CORE4.xml#CachingIterator::getInnerIterator
	public function getInnerIterator(){ }
 //@php_CORE4.xml#CachingIterator::getFlags
	public function getFlags(){ }
 //@php_CORE4.xml#CachingIterator::setFlags
	public function setFlags( $flags ){ }
 //@php_CORE4.xml#CachingIterator::offsetGet
	public function offsetGet( $index ){ }
 //@php_CORE4.xml#CachingIterator::offsetSet
	public function offsetSet( $index , $newval ){ }
 //@php_CORE4.xml#CachingIterator::offsetUnset
	public function offsetUnset( $index ){ }
 //@php_CORE4.xml#CachingIterator::offsetExists
	public function offsetExists( $index ){ }
 //@php_CORE4.xml#CachingIterator::getCache
	public function getCache(){ }
 //@php_CORE4.xml#CachingIterator::count
	public function count(){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#RecursiveCachingIterator
 class RecursiveCachingIterator extends CachingIterator implements Countable,ArrayAccess,Iterator,OuterIterator,RecursiveIterator {

// Constants
	 const CALL_TOSTRING=1;
	 const CATCH_GET_CHILD=16;
	 const TOSTRING_USE_KEY=2;
	 const TOSTRING_USE_CURRENT=4;
	 const TOSTRING_USE_INNER=8;
	 const FULL_CACHE=256;

// Properties

// Methods
  function __construct(Iterator $iterator, $flags) { }
 //@php_CORE2.xml#RecursiveCachingIterator::hasChildren
	public function hasChildren(){ }
 //@php_CORE2.xml#RecursiveCachingIterator::getChildren
	public function getChildren(){ return new RecursiveCachingIterator();}

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#NoRewindIterator
 class NoRewindIterator extends IteratorIterator implements OuterIterator,Iterator {

// Constants

// Properties

// Methods
 //@php_CORE3.xml#IteratorIterator::rewind
   public function rewind() {}

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#AppendIterator
 class AppendIterator extends IteratorIterator implements OuterIterator,Iterator {

// Constants

// Properties

// Methods
 //@php_CORE4.xml#AppendIterator::__construct
	public function __construct(){ }
 //@php_CORE4.xml#AppendIterator::append
	public function append( Iterator $iterator ){ }
 //@php_CORE4.xml#AppendIterator::rewind
	public function rewind(){ }
 //@php_CORE4.xml#AppendIterator::valid
	public function valid(){ }
 //@php_CORE4.xml#AppendIterator::key
	public function key(){ }
 //@php_CORE4.xml#AppendIterator::current
	public function current(){ }
 //@php_CORE4.xml#AppendIterator::next
	public function next(){ }
 //@php_CORE4.xml#AppendIterator::getInnerIterator
	public function getInnerIterator(){ return new Iterator();}
 //@php_CORE4.xml#AppendIterator::getIteratorIndex
	public function getIteratorIndex(){ }
 //@php_CORE4.xml#AppendIterator::getArrayIterator
	public function getArrayIterator(){ return new ArrayIterator();}

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE3.xml#InfiniteIterator
 class InfiniteIterator extends IteratorIterator implements OuterIterator,Iterator {

// Constants

// Properties

// Methods
 //@php_CORE3.xml#InfiniteIterator::__construct
	public function __construct( Iterator $iterator ){ }
 //@php_CORE3.xml#InfiniteIterator::next
	public function next(){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#RegexIterator
 class RegexIterator extends FilterIterator implements Iterator,OuterIterator {

// Constants
	 const USE_KEY=1;
	 const MATCH=0;
	 const GET_MATCH=1;
	 const ALL_MATCHES=2;
	 const SPLIT=3;
	 const REPLACE=4;

// Properties
	public $replacement;

// Methods
 //@php_CORE2.xml#RegexIterator::__construct
	public function __construct( Iterator $iterator , $regex , $mode , $flags , $preg_flags ){ }
// function accept() NOT FOUND
 //@php_CORE2.xml#RegexIterator::getMode
	public function getMode(){ }
 //@php_CORE2.xml#RegexIterator::setMode
	public function setMode( $mode ){ }
 //@php_CORE2.xml#RegexIterator::getFlags
	public function getFlags(){ }
 //@php_CORE2.xml#RegexIterator::setFlags
	public function setFlags( $flags ){ }
 //@php_CORE2.xml#RegexIterator::getPregFlags
	public function getPregFlags(){ }
 //@php_CORE2.xml#RegexIterator::setPregFlags
	public function setPregFlags( $preg_flags ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#RecursiveRegexIterator
 class RecursiveRegexIterator extends RegexIterator implements OuterIterator,Iterator,RecursiveIterator {

// Constants
	 const USE_KEY=1;
	 const MATCH=0;
	 const GET_MATCH=1;
	 const ALL_MATCHES=2;
	 const SPLIT=3;
	 const REPLACE=4;

// Properties
	public $replacement;

// Methods
 //@php_CORE2.xml#RecursiveRegexIterator::__construct
	public function __construct( RecursiveIterator $iterator , $regex , $mode , $flags , $preg_flags ){ }
 //@php_CORE2.xml#RecursiveRegexIterator::hasChildren
	public function hasChildren(){ }
 //@php_CORE2.xml#RecursiveRegexIterator::getChildren
	public function getChildren(){ return new RecursiveRegexIterator();}
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#EmptyIterator
 class EmptyIterator  implements Iterator {

// Constants

// Properties

// Methods
 //@php_CORE4.xml#EmptyIterator::rewind
	public function rewind(){ }
 //@php_CORE4.xml#EmptyIterator::valid
	public function valid(){ }
 //@php_CORE4.xml#EmptyIterator::key
	public function key(){ }
 //@php_CORE4.xml#EmptyIterator::current
	public function current(){ }
 //@php_CORE4.xml#EmptyIterator::next
	public function next(){ }

}

////////////////////////////////////////////////////////////////////////////////////
/* Methods */


//@php_CORE4.xml#ArrayObject
 class ArrayObject  implements IteratorAggregate,ArrayAccess,Countable {

// Constants
	 const STD_PROP_LIST=1;
	 const ARRAY_AS_PROPS=2;

// Properties

// Methods
 //@php_CORE4.xml#ArrayObject::__construct
	public function __construct( $input , $flags , $iterator_class ){}
 //@php_CORE4.xml#ArrayObject::offsetExists
	public function offsetExists( $index ){ }
 //@php_CORE4.xml#ArrayObject::offsetGet
	public function offsetGet( $index ){ }
 //@php_CORE4.xml#ArrayObject::offsetSet
	public function offsetSet( $index , $newval ){ }
 //@php_CORE4.xml#ArrayObject::offsetUnset
	public function offsetUnset( $index ){ }
 //@php_CORE4.xml#ArrayObject::append
	public function append( $value ){ }
 //@php_CORE4.xml#ArrayObject::getArrayCopy
	public function getArrayCopy(){ return array();}
 //@php_CORE4.xml#ArrayObject::count
	public function count(){ }
 //@php_CORE4.xml#ArrayObject::getFlags
	public function getFlags(){ }
 //@php_CORE4.xml#ArrayObject::setFlags
	public function setFlags( $flags ){ }
 //@php_CORE4.xml#ArrayObject::asort
	public function asort(){ }
 //@php_CORE4.xml#ArrayObject::ksort
	public function ksort(){ }
 //@php_CORE4.xml#ArrayObject::uasort
	public function uasort( $cmp_function ){ }
 //@php_CORE4.xml#ArrayObject::uksort
	public function uksort( $cmp_function ){ }
 //@php_CORE4.xml#ArrayObject::natsort
	public function natsort(){ }
 //@php_CORE4.xml#ArrayObject::natcasesort
	public function natcasesort(){ }
 //@php_CORE4.xml#ArrayObject::getIterator
	public function getIterator(){ return new ArrayIterator;}
 //@php_CORE4.xml#ArrayObject::exchangeArray
	public function exchangeArray( $array ){ return array();}
 //@php_CORE4.xml#ArrayObject::setIteratorClass
	public function setIteratorClass( $iteratorClass ){ }
 //@php_CORE4.xml#ArrayObject::getIteratorClass
	public function getIteratorClass(){ }
// PHP 5.3 public void serialize ( void )
// PHP 5.3 public void unserialize ( string $serialized )

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#ArrayIterator
 class ArrayIterator  implements Iterator,ArrayAccess,SeekableIterator,Countable {

// Constants
	 const STD_PROP_LIST=1;
	 const ARRAY_AS_PROPS=2;

// Properties

// Methods
    public  function __construct($array) { }
	public function append ( $value ) {}
	public function count ( ) {}
	public function getArrayCopy ( ) { return array();}
	public function getFlags ( ) {}
	public function asort ( )   {}
	public function ksort ( ) {}
	public function natcasesort ( ) {}
	public function natsort ( ) {}
	public function offsetExists ( $index ) {}

    //NOT DOCUMENTED
   public function offsetGet($index) {}
   public function offsetSet($index, $newVal) {}
   public function offsetUnset($index) {}
   public function uasort($cmp_function) {}
   public function uksort($cmp_function) {}
   public function setFlags($flags) {}
 
 //@php_CORE4.xml#ArrayIterator::rewind
	public function rewind(){ }
 //@php_CORE4.xml#ArrayIterator::current
	public function current(){ }
 //@php_CORE4.xml#ArrayIterator::key
	public function key(){ }
 //@php_CORE4.xml#ArrayIterator::next
	public function next(){ }
 //@php_CORE4.xml#ArrayIterator::valid
	public function valid(){ }
 //@php_CORE4.xml#ArrayIterator::seek
	public function seek( $position ){ }
	

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#RecursiveArrayIterator
 class RecursiveArrayIterator extends ArrayIterator implements SeekableIterator,ArrayAccess,Iterator,RecursiveIterator {

// Constants

// Properties

// Methods
 //@php_CORE2.xml#RecursiveArrayIterator::hasChildren
	public function hasChildren(){ }
 //@php_CORE2.xml#RecursiveArrayIterator::getChildren
	public function getChildren(){ return new RecursiveArrayIterator();}

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE.xml#SplFileInfo
 class SplFileInfo   {

// Constants

// Properties

// Methods
 //@php_CORE.xml#SplFileInfo::__construct
	public function __construct( $file_name ){ }
 //@php_CORE.xml#SplFileInfo::getPath
	public function getPath(){ }
 //@php_CORE.xml#SplFileInfo::getFilename
	public function getFilename(){ ;}
 //@php_CORE.xml#SplFileInfo::getBasename
	public function getBasename( $suffix ){ }
 //@php_CORE.xml#SplFileInfo::getPathname
	public function getPathname(){ }
 //@php_CORE.xml#SplFileInfo::getPerms
	public function getPerms(){ }
 //@php_CORE.xml#SplFileInfo::getInode
	public function getInode(){ }
 //@php_CORE.xml#SplFileInfo::getSize
	public function getSize(){ }
 //@php_CORE.xml#SplFileInfo::getOwner
	public function getOwner(){ }
 //@php_CORE.xml#SplFileInfo::getGroup
	public function getGroup(){ }
 //@php_CORE.xml#SplFileInfo::getATime
	public function getATime(){ }
 //@php_CORE.xml#SplFileInfo::getMTime
	public function getMTime(){ }
 //@php_CORE.xml#SplFileInfo::getCTime
	public function getCTime(){ }
 //@php_CORE.xml#SplFileInfo::getType
	public function getType(){ }
 //@php_CORE.xml#SplFileInfo::isWritable
	public function isWritable(){ }
 //@php_CORE.xml#SplFileInfo::isReadable
	public function isReadable(){ }
 //@php_CORE.xml#SplFileInfo::isExecutable
	public function isExecutable(){ }
 //@php_CORE.xml#SplFileInfo::isFile
	public function isFile(){ }
 //@php_CORE.xml#SplFileInfo::isDir
	public function isDir(){ }
 //@php_CORE.xml#SplFileInfo::isLink
	public function isLink(){ }
 //@php_CORE.xml#SplFileInfo::getLinkTarget
	public function getLinkTarget(){ }
 //@php_CORE.xml#SplFileInfo::getRealPath
	public function getRealPath(){ }
 //@php_CORE.xml#SplFileInfo::getFileInfo
	public function getFileInfo( $class_name ){ return new SplFileInfo();}
 //@php_CORE.xml#SplFileInfo::getPathInfo
	public function getPathInfo( $class_name ){ return new SplFileInfo();}
 //@php_CORE.xml#SplFileInfo::openFile
	public function openFile( $open_mode , $use_include_path , $context ){ return new SplObjectFile();}
 //@php_CORE.xml#SplFileInfo::setFileClass
	public function setFileClass( $class_name ){ }
 //@php_CORE.xml#SplFileInfo::setInfoClass
	public function setInfoClass( $class_name ){ }
 //@php_CORE.xml#SplFileInfo::__toString
	public function __toString(){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#DirectoryIterator
 class DirectoryIterator extends SplFileInfo implements Iterator {

// Constants

// Properties

// Methods
 //@php_CORE4.xml#DirectoryIterator::__construct
	public function __construct( $path ){ }
 //@php_CORE4.xml#DirectoryIterator::getFilename
	public function getFilename(){ }
 //@php_CORE4.xml#DirectoryIterator::getBasename
	public function getBasename( $suffix ){ }
 //@php_CORE4.xml#DirectoryIterator::isDot
	public function isDot(){ }
 //@php_CORE4.xml#DirectoryIterator::rewind
	public function rewind(){ }
 //@php_CORE4.xml#DirectoryIterator::valid
	public function valid(){ }
 //@php_CORE4.xml#DirectoryIterator::key
	public function key(){ }
 //@php_CORE4.xml#DirectoryIterator::current
	public function current(){ return new DirectoryIterator();}
 //@php_CORE4.xml#DirectoryIterator::next
	public function next(){ }
 //@php_CORE4.xml#DirectoryIterator::__toString
	public function __toString(){ }
	//DirectoryIterator::seek -> no version info available, probably not in PHP 5.2.8
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#RecursiveDirectoryIterator
 class RecursiveDirectoryIterator extends DirectoryIterator implements Iterator,RecursiveIterator {

// Constants
	 const CURRENT_MODE_MASK=240;
	 const CURRENT_AS_PATHNAME=32;
	 const CURRENT_AS_FILEINFO=0;
	 const CURRENT_AS_SELF=16;
	 const KEY_MODE_MASK=3840;
	 const KEY_AS_PATHNAME=0;
	 const KEY_AS_FILENAME=256;
	 const NEW_CURRENT_AND_KEY=256;

// Properties

// Methods
    function __construct($path,$flags) {}
//@php_CORE2.xml#RecursiveDirectoryIterator::rewind
	public function rewind(){ }
 //@php_CORE2.xml#RecursiveDirectoryIterator::next
	public function next(){ }
 //@php_CORE2.xml#RecursiveDirectoryIterator::key
	public function key(){ }
 //@php_CORE2.xml#RecursiveDirectoryIterator::hasChildren
	public function hasChildren( $allow_links ){ }
 //@php_CORE2.xml#RecursiveDirectoryIterator::getChildren
	public function getChildren(){ return new RecursiveDirectoryIterator();}
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE.xml#SplFileObject
 class SplFileObject extends SplFileInfo implements RecursiveIterator,Iterator,SeekableIterator {

// Constants
	 const DROP_NEW_LINE=1;
	 const READ_AHEAD=2;
	 const SKIP_EMPTY=6;
	 const READ_CSV=8;

// Properties

// Methods
 //@php_CORE.xml#SplFileObject::__construct
	public function __construct( $file_name , $open_mode , $use_include_path , $context ){ }
 //@php_CORE.xml#SplFileObject::rewind
	public function rewind(){ }
 //@php_CORE.xml#SplFileObject::eof
	public function eof(){ }
 //@php_CORE.xml#SplFileObject::valid
	public function valid(){ }
 //@php_CORE.xml#SplFileObject::fgets
	public function fgets(){ }
 //@php_CORE.xml#SplFileObject::fgetcsv
	public function fgetcsv( $delimiter , $enclosure ,$escape ){ return array();}
 //@php_CORE.xml#SplFileObject::setCsvControl
	public function setCsvControl( $delimiter , $enclosure, $escape ){ }
 //@php_CORE.xml#SplFileObject::getCsvControl
	public function getCsvControl(){ return array();}
 //@php_CORE.xml#SplFileObject::flock
	public function flock( $operation , &$wouldblock ){ }
 //@php_CORE.xml#SplFileObject::fflush
	public function fflush(){ }
 //@php_CORE.xml#SplFileObject::ftell
	public function ftell(){ }
 //@php_CORE.xml#SplFileObject::fseek
	public function fseek( $pos , $whence ){ }
 //@php_CORE.xml#SplFileObject::fgetc
	public function fgetc(){ }
 //@php_CORE.xml#SplFileObject::fpassthru
	public function fpassthru(){ }
 //@php_CORE.xml#SplFileObject::fgetss
	public function fgetss( $allowable_tags ){ }
 //@php_CORE.xml#SplFileObject::fscanf
	public function fscanf( $format ){ }
 //@php_CORE.xml#SplFileObject::fwrite
	public function fwrite( $str , $length ){ }
 //@php_CORE.xml#SplFileObject::fstat
	public function fstat(){ return array();}
 //@php_CORE.xml#SplFileObject::ftruncate
	public function ftruncate( $size ){ }
 //@php_CORE.xml#SplFileObject::current
	public function current(){ }
 //@php_CORE.xml#SplFileObject::key
	public function key(){ }
 //@php_CORE.xml#SplFileObject::next
	public function next(){ }
 //@php_CORE.xml#SplFileObject::setFlags
	public function setFlags( $flags ){ }
 //@php_CORE.xml#SplFileObject::getFlags
	public function getFlags(){ }
 //@php_CORE.xml#SplFileObject::setMaxLineLen
	public function setMaxLineLen( $max_len ){ }
 //@php_CORE.xml#SplFileObject::getMaxLineLen
	public function getMaxLineLen(){ }
 //@php_CORE.xml#SplFileObject::hasChildren
	public function hasChildren(){ }
 //@php_CORE.xml#SplFileObject::getChildren
	public function getChildren(){ }
 //@php_CORE.xml#SplFileObject::seek
	public function seek( $line_pos ){ }
 //@php_CORE.xml#SplFileObject::getCurrentLine
	public function getCurrentLine(){ }
 //@php_CORE.xml#SplFileObject::__toString
	public function __toString(){ }

}
////////////////////////////////////////////////////////////////////////////////////

//@php_CORE.xml#SplTempFileObject
 class SplTempFileObject extends SplFileObject implements SeekableIterator,Iterator,RecursiveIterator {

// Constants
	 const DROP_NEW_LINE=1;
	 const READ_AHEAD=2;
	 const SKIP_EMPTY=6;
	 const READ_CSV=8;

// Properties

// Methods
 //@php_CORE.xml#SplTempFileObject::__construct
	public function __construct( $max_memory ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE.xml#SimpleXMLIterator
 class SimpleXMLIterator extends SimpleXMLElement implements RecursiveIterator,Iterator,Countable {

// Constants

// Properties

// Methods
 //@php_CORE.xml#SimpleXMLIterator::rewind
	public function rewind(){ }
 //@php_CORE.xml#SimpleXMLIterator::valid
	public function valid(){ }
 //@php_CORE.xml#SimpleXMLIterator::current
	public function current(){ return new SimpleXMLIterator();}
 //@php_CORE.xml#SimpleXMLIterator::key
	public function key(){ }
 //@php_CORE.xml#SimpleXMLIterator::next
	public function next(){ }
 //@php_CORE.xml#SimpleXMLIterator::hasChildren
	public function hasChildren(){ }
 //@php_CORE.xml#SimpleXMLIterator::getChildren
	public function getChildren(){ return new SimpleXMLIterator();}
// function count() NOT FOUND

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE3.xml#LogicException
 class LogicException extends Exception  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#BadFunctionCallException
 class BadFunctionCallException extends LogicException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#BadMethodCallException
 class BadMethodCallException extends BadFunctionCallException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#DomainException
 class DomainException extends LogicException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE3.xml#InvalidArgumentException
 class InvalidArgumentException extends LogicException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE3.xml#LengthException
 class LengthException extends LogicException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#OutOfRangeException
 class OutOfRangeException extends LogicException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#RuntimeException
 class RuntimeException extends Exception  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#OutOfBoundsException
 class OutOfBoundsException extends RuntimeException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#OverflowException
 class OverflowException extends RuntimeException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#RangeException
 class RangeException extends RuntimeException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE.xml#UnderflowException
 class UnderflowException extends RuntimeException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE.xml#UnexpectedValueException
 class UnexpectedValueException extends RuntimeException  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////
// WARNING: class SplObserver is an internal/undocummented class; skipping....
////////////////////////////////////////////////////////////////////////////////////
// WARNING: class SplSubject is an internal/undocummented class; skipping....
////////////////////////////////////////////////////////////////////////////////////

//@php_CORE.xml#SplObjectStorage
 class SplObjectStorage  implements Countable,Iterator,Serializable {

// Constants

// Properties

// Methods
 //@php_CORE.xml#SplObjectStorage::attach
	public function attach( $object, $data ){ }
 //@php_CORE.xml#SplObjectStorage::detach
	public function detach( $object ){ }
 //@php_CORE.xml#SplObjectStorage::contains
	public function contains( $object ){ }
 //@php_CORE.xml#SplObjectStorage::count
	public function count(){ }
 //@php_CORE.xml#SplObjectStorage::rewind
	public function rewind(){ }
 //@php_CORE.xml#SplObjectStorage::valid
	public function valid(){ }
 //@php_CORE.xml#SplObjectStorage::key
	public function key(){ }
 //@php_CORE.xml#SplObjectStorage::current
	public function current(){ }
 //@php_CORE.xml#SplObjectStorage::next
	public function next(){ }
 //@php_CORE.xml#SplObjectStorage::unserialize
	public function unserialize( $serialized ){ }
 //@php_CORE.xml#SplObjectStorage::serialize
	public function serialize(){ }

// PHP 5.3 methods, below
//public void addAll ( SplObjectStorage $storage )
//public mixed getInfo ( void )
//public boolean offsetExists ( object $object )
//public mixed offsetGet ( object $object )
//public void offsetSet ( object $object , mixed $info )
//public void offsetUnset ( object $object )
//public void removeAll ( SplObjectStorage $storage )
//public void setInfo ( mixed $data )
}
////////////////////////////////////////////////////////////////////////////////////


/////////////////// ********** FUNCTIONS (13 total functions) ************ ///////////////////////////////

// 1: function spl_classes(); // prototype:spl_classes ( void )
// 2: function spl_autoload(); // prototype:spl_autoload ( string $class_name [, string $file_extensions = spl_autoload_extensions() ] )
// 3: function spl_autoload_extensions(); // prototype:spl_autoload_extensions ([ string $file_extensions ] )
// 4: function spl_autoload_register(); // prototype:spl_autoload_register ([ callback $autoload_function ] )
// 5: function spl_autoload_unregister(); // prototype:spl_autoload_unregister ( mixed $autoload_function )
// 6: function spl_autoload_functions(); // prototype:spl_autoload_functions ( void )
// 7: function spl_autoload_call(); // prototype:spl_autoload_call ( string $class_name )
// 8: function class_parents(); // prototype:class_parents ( mixed $class [, bool $autoload = true ] )
// 9: function class_implements(); // prototype:class_implements ( mixed $class [, bool $autoload = true ] )
// 10: function spl_object_hash(); // prototype:spl_object_hash ( object $obj )
// 11: function iterator_to_array(); // prototype:iterator_to_array ( Traversable $iterator [, bool $use_keys = true ] )
// 12: function iterator_count(); // prototype:iterator_count ( Traversable $iterator )
// 13: function iterator_apply(); // prototype:iterator_apply ( Traversable $iterator , callback $function [, array $args ] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension reflection
// WARNING: class ReflectionException is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#Reflection
 class Reflection   {

// Constants

// Properties

// Methods
 //@php_CORE2.xml#Reflection::getModifierNames
	public static function getModifierNames( $modifiers ){ return array();}
 //@php_CORE2.xml#Reflection::export
	public static function export( Reflector $reflector , $return ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#Reflector
 interface Reflector   {

// Constants

// Properties

// Methods
 //@php_CORE2.xml#Reflector::export
	abstract public static function export();
 //@php_CORE2.xml#Reflector::__toString
	abstract public function __toString();

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#ReflectionFunctionAbstract
abstract class ReflectionFunctionAbstract  implements Reflector {

// Constants

// Properties
	public $name;

// Methods
 //@php_CORE2.xml#ReflectionFunctionAbstract::__clone
	final private function __clone(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::__toString
	abstract public function __toString();
 //@php_CORE2.xml#ReflectionFunctionAbstract::isInternal
	public function isInternal(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::isUserDefined
	public function isUserDefined(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::getName
	public function getName(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::getFileName
	public function getFileName(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::getStartLine
	public function getStartLine(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::getEndLine
	public function getEndLine(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::getDocComment
	public function getDocComment(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::getStaticVariables
	public function getStaticVariables(){ return array();}
 //@php_CORE2.xml#ReflectionFunctionAbstract::returnsReference
	public function returnsReference(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::getParameters
	public function getParameters(){ return new ReflectionParameter();}
 //@php_CORE2.xml#ReflectionFunctionAbstract::getNumberOfParameters
	public function getNumberOfParameters(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::getNumberOfRequiredParameters
	public function getNumberOfRequiredParameters(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::getExtension
	public function getExtension(){ return new ReflectionExtension();}
 //@php_CORE2.xml#ReflectionFunctionAbstract::getExtensionName
	public function getExtensionName(){ }
 //@php_CORE2.xml#ReflectionFunctionAbstract::isDeprecated
	public function isDeprecated(){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#ReflectionFunction
 class ReflectionFunction extends ReflectionFunctionAbstract implements Reflector {

// Constants
	 const IS_DEPRECATED=262144;

// Properties
	public $name;

// Methods
 //@php_CORE2.xml#ReflectionFunction::__construct
	public function __construct( $name ){ }
 //@php_CORE2.xml#ReflectionFunction::__toString
	public function __toString(){ }
 //@php_CORE2.xml#ReflectionFunction::export
	public static function export( $name , $return ){ }
 //@php_CORE2.xml#ReflectionFunction::isDisabled
	public function isDisabled(){ }
 //@php_CORE2.xml#ReflectionFunction::invoke
	public function invoke( $args ){ }
 //@php_CORE2.xml#ReflectionFunction::invokeArgs
	public function invokeArgs( array $args ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#ReflectionParameter
 class ReflectionParameter  implements Reflector {

// Constants

// Properties
	public $name;

// Methods
 //@php_CORE2.xml#ReflectionParameter::__clone
	final private function __clone(){ }
 //@php_CORE2.xml#ReflectionParameter::export
	public static function export( $function , $parameter , $return ){ }
 //@php_CORE2.xml#ReflectionParameter::__construct
	public function __construct( $function , $parameter ){ }
 //@php_CORE2.xml#ReflectionParameter::__toString
	public function __toString(){ }
 //@php_CORE2.xml#ReflectionParameter::getName
	public function getName(){ }
 //@php_CORE2.xml#ReflectionParameter::isPassedByReference
	public function isPassedByReference(){ }
 //@php_CORE2.xml#ReflectionParameter::getDeclaringFunction
	public function getDeclaringFunction(){return new ReflectionFunction(); }
 //@php_CORE2.xml#ReflectionParameter::getDeclaringClass
	public function getDeclaringClass(){return new ReflectionClass(); }
 //@php_CORE2.xml#ReflectionParameter::getClass
	public function getClass(){ return new ReflectionClass(); }
 //@php_CORE2.xml#ReflectionParameter::isArray
	public function isArray(){ }
 //@php_CORE2.xml#ReflectionParameter::allowsNull
	public function allowsNull(){ }
 //@php_CORE2.xml#ReflectionParameter::getPosition
	public function getPosition(){ }
 //@php_CORE2.xml#ReflectionParameter::isOptional
	public function isOptional(){ }
 //@php_CORE2.xml#ReflectionParameter::isDefaultValueAvailable
	public function isDefaultValueAvailable(){ }
 //@php_CORE2.xml#ReflectionParameter::getDefaultValue
	public function getDefaultValue(){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#ReflectionMethod
 class ReflectionMethod extends ReflectionFunctionAbstract implements Reflector {

// Constants
	 const IS_STATIC=1;
	 const IS_PUBLIC=256;
	 const IS_PROTECTED=512;
	 const IS_PRIVATE=1024;
	 const IS_ABSTRACT=2;
	 const IS_FINAL=4;

// Properties
	public $name;
	public $class;

// Methods
 //@php_CORE2.xml#ReflectionMethod::export
	public static function export( $class , $name , $return ){ }
 //@php_CORE2.xml#ReflectionMethod::__construct
	public function __construct( $class_or_method , $name ){ }
 //@php_CORE2.xml#ReflectionMethod::__toString
	public function __toString(){ }
 //@php_CORE2.xml#ReflectionMethod::isPublic
	public function isPublic(){ }
 //@php_CORE2.xml#ReflectionMethod::isPrivate
	public function isPrivate(){ }
 //@php_CORE2.xml#ReflectionMethod::isProtected
	public function isProtected(){ }
 //@php_CORE2.xml#ReflectionMethod::isAbstract
	public function isAbstract(){ }
 //@php_CORE2.xml#ReflectionMethod::isFinal
	public function isFinal(){ }
 //@php_CORE2.xml#ReflectionMethod::isStatic
	public function isStatic(){ }
 //@php_CORE2.xml#ReflectionMethod::isConstructor
	public function isConstructor(){ }
 //@php_CORE2.xml#ReflectionMethod::isDestructor
	public function isDestructor(){ }
 //@php_CORE2.xml#ReflectionMethod::getModifiers
	public function getModifiers(){ }
 //@php_CORE2.xml#ReflectionMethod::invoke
	public function invoke( $object , $args ){ }
 //@php_CORE2.xml#ReflectionMethod::invokeArgs
	public function invokeArgs( $object , array $args ){ }
 //@php_CORE2.xml#ReflectionMethod::getDeclaringClass
	public function getDeclaringClass(){ return new ReflectionClass(); }
 //@php_CORE2.xml#ReflectionMethod::getPrototype
	public function getPrototype(){ }
//ReflectionMethod::setAccessible - no version info (only in SVN?)
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#ReflectionClass
 class ReflectionClass  implements Reflector {

// Constants
	 const IS_IMPLICIT_ABSTRACT=16;
	 const IS_EXPLICIT_ABSTRACT=32;
	 const IS_FINAL=64;

// Properties
	public $name;

// Methods
 //@php_CORE2.xml#ReflectionClass::__clone
	final private function __clone(){ }
 //@php_CORE2.xml#ReflectionClass::export
	public static function export( $argument , $return ){ }
 //@php_CORE2.xml#ReflectionClass::__construct
	public function __construct( $argument ){ }
 //@php_CORE2.xml#ReflectionClass::__toString
	public function __toString(){ }
 //@php_CORE2.xml#ReflectionClass::getName
	public function getName(){ }
 //@php_CORE2.xml#ReflectionClass::isInternal
	public function isInternal(){ }
 //@php_CORE2.xml#ReflectionClass::isUserDefined
	public function isUserDefined(){ }
 //@php_CORE2.xml#ReflectionClass::isInstantiable
	public function isInstantiable(){ }
 //@php_CORE2.xml#ReflectionClass::getFileName
	public function getFileName(){ }
 //@php_CORE2.xml#ReflectionClass::getStartLine
	public function getStartLine(){ }
 //@php_CORE2.xml#ReflectionClass::getEndLine
	public function getEndLine(){ }
 //@php_CORE2.xml#ReflectionClass::getDocComment
	public function getDocComment(){ }
 //@php_CORE2.xml#ReflectionClass::getConstructor
	public function getConstructor(){ return new ReflectionMethod();}
 //@php_CORE2.xml#ReflectionClass::hasMethod
	public function hasMethod( $name ){ }
 //@php_CORE2.xml#ReflectionClass::getMethod
	public function getMethod( $name ){ return new ReflectionMethod(); }
 //@php_CORE2.xml#ReflectionClass::getMethods
	public function getMethods( $filter ){ return array();}
 //@php_CORE2.xml#ReflectionClass::hasProperty
	public function hasProperty( $name ){ }
 //@php_CORE2.xml#ReflectionClass::getProperty
	public function getProperty( $name ){ return new ReflectionProperty(); }
 //@php_CORE2.xml#ReflectionClass::getProperties
	public function getProperties( $filter ){ return new ReflectionProperty();}
 //@php_CORE2.xml#ReflectionClass::hasConstant
	public function hasConstant( $name ){ }
 //@php_CORE2.xml#ReflectionClass::getConstants
	public function getConstants(){ return array();}
 //@php_CORE2.xml#ReflectionClass::getConstant
	public function getConstant( $name ){ }
 //@php_CORE2.xml#ReflectionClass::getInterfaces
	public function getInterfaces(){ return array();}
 //@php_CORE2.xml#ReflectionClass::getInterfaceNames
	public function getInterfaceNames(){ }
 //@php_CORE2.xml#ReflectionClass::isInterface
	public function isInterface(){ }
 //@php_CORE2.xml#ReflectionClass::isAbstract
	public function isAbstract(){ }
 //@php_CORE2.xml#ReflectionClass::isFinal
	public function isFinal(){ }
 //@php_CORE2.xml#ReflectionClass::getModifiers
	public function getModifiers(){ }
 //@php_CORE2.xml#ReflectionClass::isInstance
	public function isInstance( $object ){ }
 //@php_CORE2.xml#ReflectionClass::newInstance
	public function newInstance( $args ){ }
 //@php_CORE2.xml#ReflectionClass::newInstanceArgs
	public function newInstanceArgs( array $args ){ }
 //@php_CORE2.xml#ReflectionClass::getParentClass
	public function getParentClass(){ return new ReflectionClass();}
 //@php_CORE2.xml#ReflectionClass::isSubclassOf
	public function isSubclassOf( $class ){ }
 //@php_CORE2.xml#ReflectionClass::getStaticProperties
	public function getStaticProperties(){ return array();}
 //@php_CORE2.xml#ReflectionClass::getStaticPropertyValue
	public function getStaticPropertyValue( $name , $default ){ }
 //@php_CORE2.xml#ReflectionClass::setStaticPropertyValue
	public function setStaticPropertyValue( $name , $value ){ }
 //@php_CORE2.xml#ReflectionClass::getDefaultProperties
	public function getDefaultProperties(){ return array(); }
 //@php_CORE2.xml#ReflectionClass::isIterateable
	public function isIterateable(){ }
 //@php_CORE2.xml#ReflectionClass::implementsInterface
	public function implementsInterface( $interface ){ }
 //@php_CORE2.xml#ReflectionClass::getExtension
	public function getExtension(){ return new ReflectionExtension();}
 //@php_CORE2.xml#ReflectionClass::getExtensionName
	public function getExtensionName(){ }
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#ReflectionObject
 class ReflectionObject extends ReflectionClass implements Reflector {

// Constants
	 const IS_IMPLICIT_ABSTRACT=16;
	 const IS_EXPLICIT_ABSTRACT=32;
	 const IS_FINAL=64;

// Properties
	public $name;

// Methods
 //@php_CORE2.xml#ReflectionObject::export
	public static function export( $argument , $return ){ }
 //@php_CORE2.xml#ReflectionObject::__construct
	public function __construct( $argument ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#ReflectionProperty
 class ReflectionProperty  implements Reflector {

// Constants
	 const IS_STATIC=1;
	 const IS_PUBLIC=256;
	 const IS_PROTECTED=512;
	 const IS_PRIVATE=1024;

// Properties
	public $name;
	public $class;

// Methods
 //@php_CORE2.xml#ReflectionProperty::__clone
	final private function __clone(){ }
 //@php_CORE2.xml#ReflectionProperty::export
	public static function export( $argument , $return ){ }
 //@php_CORE2.xml#ReflectionProperty::__construct
	public function __construct( $argument ){ }
 //@php_CORE2.xml#ReflectionProperty::__toString
	public function __toString(){ }
 //@php_CORE2.xml#ReflectionProperty::getName
	public function getName(){ }
 //@php_CORE2.xml#ReflectionProperty::getValue
	public function getValue( $object ){ }
 //@php_CORE2.xml#ReflectionProperty::setValue
	public function setValue( $object , $value ){ }
 //@php_CORE2.xml#ReflectionProperty::isPublic
	public function isPublic(){ }
 //@php_CORE2.xml#ReflectionProperty::isPrivate
	public function isPrivate(){ }
 //@php_CORE2.xml#ReflectionProperty::isProtected
	public function isProtected(){ }
 //@php_CORE2.xml#ReflectionProperty::isStatic
	public function isStatic(){ }
 //@php_CORE2.xml#ReflectionProperty::isDefault
	public function isDefault(){ }
 //@php_CORE2.xml#ReflectionProperty::getModifiers
	public function getModifiers(){ }
 //@php_CORE2.xml#ReflectionProperty::getDeclaringClass
	public function getDeclaringClass(){ return new ReflectionClass();  }
 //@php_CORE2.xml#ReflectionProperty::getDocComment
	public function getDocComment(){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE2.xml#ReflectionExtension
 class ReflectionExtension  implements Reflector {

// Constants

// Properties
	public $name;

// Methods
 //@php_CORE2.xml#ReflectionExtension::__clone
	final private function __clone(){ }
 //@php_CORE2.xml#ReflectionExtension::export
	public static function export( $name , $return ){ }
 //@php_CORE2.xml#ReflectionExtension::__construct
	public function __construct( $name ){ }
 //@php_CORE2.xml#ReflectionExtension::__toString
	public function __toString(){ }
 //@php_CORE2.xml#ReflectionExtension::getName
	public function getName(){ }
 //@php_CORE2.xml#ReflectionExtension::getVersion
	public function getVersion(){ }
 //@php_CORE2.xml#ReflectionExtension::getFunctions
	public function getFunctions(){ return array();}
 //@php_CORE2.xml#ReflectionExtension::getConstants
	public function getConstants(){ return array();}
 //@php_CORE2.xml#ReflectionExtension::getINIEntries
	public function getINIEntries(){ return array();}
 //@php_CORE2.xml#ReflectionExtension::getClasses
	public function getClasses(){ return array();}
 //@php_CORE2.xml#ReflectionExtension::getClassNames
	public function getClassNames(){ return array(); }
 //@php_CORE2.xml#ReflectionExtension::getDependencies
	public function getDependencies(){ return array();}
 //@php_CORE2.xml#ReflectionExtension::info
	public function info(){ }

}

////////////////////////////////////////////////////////////////////////////////////


/////////////////// ********** FUNCTIONS (0 total functions) ************ ///////////////////////////////


/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension session

/////////////////// ********** FUNCTIONS (20 total functions) ************ ///////////////////////////////

// 1: function session_name(); // prototype:session_name ([ string $name ] )
// 2: function session_module_name(); // prototype:session_module_name ([ string $module ] )
// 3: function session_save_path(); // prototype:session_save_path ([ string $path ] )
// 4: function session_id(); // prototype:session_id ([ string $id ] )
// 5: function session_regenerate_id(); // prototype:session_regenerate_id ([ bool $delete_old_session = false ] )
// 6: function session_decode(); // prototype:session_decode ( string $data )
// 7: function session_register(); // prototype:session_register ( mixed $name [, mixed $... ] )
// 8: function session_unregister(); // prototype:session_unregister ( string $name )
// 9: function session_is_registered(); // prototype:session_is_registered ( string $name )
// 10: function session_encode(); // prototype:session_encode ( void )
// 11: function session_start(); // prototype:session_start ( void )
// 12: function session_destroy(); // prototype:session_destroy ( void )
// 13: function session_unset(); // prototype:session_unset ( void )
// 14: function session_set_save_handler(); // prototype:session_set_save_handler ( callback $open , callback $close , callback $read , callback $write , callback $destroy , callback $gc )
// 15: function session_cache_limiter(); // prototype:session_cache_limiter ([ string $cache_limiter ] )
// 16: function session_cache_expire(); // prototype:session_cache_expire ([ string $new_cache_expire ] )
// 17: function session_set_cookie_params(); // prototype:session_set_cookie_params ( int $lifetime [, string $path [, string $domain [, bool $secure = false [, bool $httponly = false ]]]] )
// 18: function session_get_cookie_params(); // prototype:session_get_cookie_params ( void )
// 19: function session_write_close(); // prototype:session_write_close ( void )
// 20: function session_commit(); // ALIAS of session_write_close():session_commit(...)

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension JSON

/////////////////// ********** FUNCTIONS (2 total functions) ************ ///////////////////////////////

// 1: function json_encode(); // prototype:json_encode ( mixed $value [, int $options = 0 ] )
// 2: function json_decode(); // prototype:json_decode ( string $json [, bool $assoc = false [, int $depth = 512 ]] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension mysql
	define( 'MYSQL_ASSOC',1);
	define( 'MYSQL_NUM',2);
	define( 'MYSQL_BOTH',3);
	define( 'MYSQL_CLIENT_COMPRESS',32);
	define( 'MYSQL_CLIENT_SSL',2048);
	define( 'MYSQL_CLIENT_INTERACTIVE',1024);
	define( 'MYSQL_CLIENT_IGNORE_SPACE',256);

/////////////////// ********** FUNCTIONS (61 total functions) ************ ///////////////////////////////

// 1: function mysql_connect(); // prototype:mysql_connect ([ string $server = ini_get(&quot;mysql.default_host&quot;) [, string $username = ini_get(&quot;mysql.default_user&quot;) [, string $password = ini_get(&quot;mysql.default_password&quot;) [, bool $new_link = false [, int $client_flags = 0 ]]]]] )
// 2: function mysql_pconnect(); // prototype:mysql_pconnect ([ string $server = ini_get(&quot;mysql.default_host&quot;) [, string $username = ini_get(&quot;mysql.default_user&quot;) [, string $password = ini_get(&quot;mysql.default_password&quot;) [, int $client_flags ]]]] )
// 3: function mysql_close(); // prototype:mysql_close ([ resource $link_identifier ] )
// 4: function mysql_select_db(); // prototype:mysql_select_db ( string $database_name [, resource $link_identifier ] )
// 5: function mysql_query(); // prototype:mysql_query ( string $query [, resource $link_identifier ] )
// 6: function mysql_unbuffered_query(); // prototype:mysql_unbuffered_query ( string $query [, resource $link_identifier ] )
// 7: function mysql_db_query(); // prototype:mysql_db_query ( string $database , string $query [, resource $link_identifier ] )
// 8: function mysql_list_dbs(); // prototype:mysql_list_dbs ([ resource $link_identifier ] )
// 9: function mysql_list_tables(); // prototype:mysql_list_tables ( string $database [, resource $link_identifier ] )
// 10: function mysql_list_fields(); // prototype:mysql_list_fields ( string $database_name , string $table_name [, resource $link_identifier ] )
// 11: function mysql_list_processes(); // prototype:mysql_list_processes ([ resource $link_identifier ] )
// 12: function mysql_error(); // prototype:mysql_error ([ resource $link_identifier ] )
// 13: function mysql_errno(); // prototype:mysql_errno ([ resource $link_identifier ] )
// 14: function mysql_affected_rows(); // prototype:mysql_affected_rows ([ resource $link_identifier ] )
// 15: function mysql_insert_id(); // prototype:mysql_insert_id ([ resource $link_identifier ] )
// 16: function mysql_result(); // prototype:mysql_result ( resource $result , int $row [, mixed $field = 0 ] )
// 17: function mysql_num_rows(); // prototype:mysql_num_rows ( resource $result )
// 18: function mysql_num_fields(); // prototype:mysql_num_fields ( resource $result )
// 19: function mysql_fetch_row(); // prototype:mysql_fetch_row ( resource $result )
// 20: function mysql_fetch_array(); // prototype:mysql_fetch_array ( resource $result [, int $result_type = MYSQL_BOTH ] )
// 21: function mysql_fetch_assoc(); // prototype:mysql_fetch_assoc ( resource $result )
// 22: function mysql_fetch_object(); // prototype:mysql_fetch_object ( resource $result [, string $class_name [, array $params ]] )
// 23: function mysql_data_seek(); // prototype:mysql_data_seek ( resource $result , int $row_number )
// 24: function mysql_fetch_lengths(); // prototype:mysql_fetch_lengths ( resource $result )
// 25: function mysql_fetch_field(); // prototype:mysql_fetch_field ( resource $result [, int $field_offset = 0 ] )
// 26: function mysql_field_seek(); // prototype:mysql_field_seek ( resource $result , int $field_offset )
// 27: function mysql_free_result(); // prototype:mysql_free_result ( resource $result )
// 28: function mysql_field_name(); // prototype:mysql_field_name ( resource $result , int $field_offset )
// 29: function mysql_field_table(); // prototype:mysql_field_table ( resource $result , int $field_offset )
// 30: function mysql_field_len(); // prototype:mysql_field_len ( resource $result , int $field_offset )
// 31: function mysql_field_type(); // prototype:mysql_field_type ( resource $result , int $field_offset )
// 32: function mysql_field_flags(); // prototype:mysql_field_flags ( resource $result , int $field_offset )
// 33: function mysql_escape_string(); // prototype:mysql_escape_string ( string $unescaped_string )
// 34: function mysql_real_escape_string(); // prototype:mysql_real_escape_string ( string $unescaped_string [, resource $link_identifier ] )
// 35: function mysql_stat(); // prototype:mysql_stat ([ resource $link_identifier ] )
// 36: function mysql_thread_id(); // prototype:mysql_thread_id ([ resource $link_identifier ] )
// 37: function mysql_client_encoding(); // prototype:mysql_client_encoding ([ resource $link_identifier ] )
// 38: function mysql_ping(); // prototype:mysql_ping ([ resource $link_identifier ] )
// 39: function mysql_get_client_info(); // prototype:mysql_get_client_info ( void )
// 40: function mysql_get_host_info(); // prototype:mysql_get_host_info ([ resource $link_identifier ] )
// 41: function mysql_get_proto_info(); // prototype:mysql_get_proto_info ([ resource $link_identifier ] )
// 42: function mysql_get_server_info(); // prototype:mysql_get_server_info ([ resource $link_identifier ] )
// 43: function mysql_info(); // prototype:mysql_info ([ resource $link_identifier ] )
// 44: function mysql_set_charset(); // prototype:mysql_set_charset ( string $charset [, resource $link_identifier ] )
// 45:mysql: has been marked as 'INTERNAL' - skipping...
// 46:mysql_fieldname: has been marked as 'INTERNAL' - skipping...
// 47:mysql_fieldtable: has been marked as 'INTERNAL' - skipping...
// 48:mysql_fieldlen: has been marked as 'INTERNAL' - skipping...
// 49:mysql_fieldtype: has been marked as 'INTERNAL' - skipping...
// 50:mysql_fieldflags: has been marked as 'INTERNAL' - skipping...
// 51:mysql_selectdb: has been marked as 'INTERNAL' - skipping...
// 52:mysql_freeresult: has been marked as 'INTERNAL' - skipping...
// 53:mysql_numfields: has been marked as 'INTERNAL' - skipping...
// 54:mysql_numrows: has been marked as 'INTERNAL' - skipping...
// 55:mysql_listdbs: has been marked as 'INTERNAL' - skipping...
// 56:mysql_listtables: has been marked as 'INTERNAL' - skipping...
// 57:mysql_listfields: has been marked as 'INTERNAL' - skipping...
// 58: function mysql_db_name(); // prototype:mysql_db_name ( resource $result , int $row [, mixed $field ] )
// 59:mysql_dbname: has been marked as 'INTERNAL' - skipping...
// 60: function mysql_tablename(); // prototype:mysql_tablename ( resource $result , int $i )
// 61:mysql_table_name: has been marked as 'INTERNAL' - skipping...

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension filter
	define( 'INPUT_POST',0);
	define( 'INPUT_GET',1);
	define( 'INPUT_COOKIE',2);
	define( 'INPUT_ENV',4);
	define( 'INPUT_SERVER',5);
	define( 'INPUT_SESSION',6);
	define( 'INPUT_REQUEST',99);
	define( 'FILTER_FLAG_NONE',0);
	define( 'FILTER_REQUIRE_SCALAR',33554432);
	define( 'FILTER_REQUIRE_ARRAY',16777216);
	define( 'FILTER_FORCE_ARRAY',67108864);
	define( 'FILTER_NULL_ON_FAILURE',134217728);
	define( 'FILTER_VALIDATE_INT',257);
	define( 'FILTER_VALIDATE_BOOLEAN',258);
	define( 'FILTER_VALIDATE_FLOAT',259);
	define( 'FILTER_VALIDATE_REGEXP',272);
	define( 'FILTER_VALIDATE_URL',273);
	define( 'FILTER_VALIDATE_EMAIL',274);
	define( 'FILTER_VALIDATE_IP',275);
	define( 'FILTER_DEFAULT',516);
	define( 'FILTER_UNSAFE_RAW',516);
	define( 'FILTER_SANITIZE_STRING',513);
	define( 'FILTER_SANITIZE_STRIPPED',513);
	define( 'FILTER_SANITIZE_ENCODED',514);
	define( 'FILTER_SANITIZE_SPECIAL_CHARS',515);
	define( 'FILTER_SANITIZE_EMAIL',517);
	define( 'FILTER_SANITIZE_URL',518);
	define( 'FILTER_SANITIZE_NUMBER_INT',519);
	define( 'FILTER_SANITIZE_NUMBER_FLOAT',520);
	define( 'FILTER_SANITIZE_MAGIC_QUOTES',521);
	define( 'FILTER_CALLBACK',1024);
	define( 'FILTER_FLAG_ALLOW_OCTAL',1);
	define( 'FILTER_FLAG_ALLOW_HEX',2);
	define( 'FILTER_FLAG_STRIP_LOW',4);
	define( 'FILTER_FLAG_STRIP_HIGH',8);
	define( 'FILTER_FLAG_ENCODE_LOW',16);
	define( 'FILTER_FLAG_ENCODE_HIGH',32);
	define( 'FILTER_FLAG_ENCODE_AMP',64);
	define( 'FILTER_FLAG_NO_ENCODE_QUOTES',128);
	define( 'FILTER_FLAG_EMPTY_STRING_NULL',256);
	define( 'FILTER_FLAG_ALLOW_FRACTION',4096);
	define( 'FILTER_FLAG_ALLOW_THOUSAND',8192);
	define( 'FILTER_FLAG_ALLOW_SCIENTIFIC',16384);
	define( 'FILTER_FLAG_SCHEME_REQUIRED',65536);
	define( 'FILTER_FLAG_HOST_REQUIRED',131072);
	define( 'FILTER_FLAG_PATH_REQUIRED',262144);
	define( 'FILTER_FLAG_QUERY_REQUIRED',524288);
	define( 'FILTER_FLAG_IPV4',1048576);
	define( 'FILTER_FLAG_IPV6',2097152);
	define( 'FILTER_FLAG_NO_RES_RANGE',4194304);
	define( 'FILTER_FLAG_NO_PRIV_RANGE',8388608);

/////////////////// ********** FUNCTIONS (7 total functions) ************ ///////////////////////////////

// 1: function filter_input(); // prototype:filter_input ( int $type , string $variable_name [, int $filter = FILTER_DEFAULT [, mixed $options ]] )
// 2: function filter_var(); // prototype:filter_var ( mixed $variable [, int $filter = FILTER_DEFAULT [, mixed $options ]] )
// 3: function filter_input_array(); // prototype:filter_input_array ( int $type [, mixed $definition ] )
// 4: function filter_var_array(); // prototype:filter_var_array ( array $data [, mixed $definition ] )
// 5: function filter_list(); // prototype:filter_list ( void )
// 6: function filter_has_var(); // prototype:filter_has_var ( int $type , string $variable_name )
// 7: function filter_id(); // prototype:filter_id ( string $filtername )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension [empty/no extension] 
//@php_CORE3.xml#IteratorAggregate
 interface IteratorAggregate  {

// Constants

// Properties

// Methods
 //@php_CORE3.xml#IteratorAggregate::getIterator
	abstract public function getIterator();

}
//@php_CORE3.xml#Iterator
 interface Iterator   {

// Constants

// Properties

// Methods
 //@php_CORE3.xml#Iterator::current
	abstract public function current();
 //@php_CORE3.xml#Iterator::next
	abstract public function next();
 //@php_CORE3.xml#Iterator::key
	abstract public function key();
 //@php_CORE3.xml#Iterator::valid
	abstract public function valid();
 //@php_CORE3.xml#Iterator::rewind
	abstract public function rewind();

}
//@php_CORE4.xml#ArrayAccess
 interface ArrayAccess   {

// Constants

// Properties

// Methods
 //@php_CORE4.xml#ArrayAccess::offsetExists
	abstract public function offsetExists( $offset );
 //@php_CORE4.xml#ArrayAccess::offsetGet
	abstract public function offsetGet( $offset );
 //@php_CORE4.xml#ArrayAccess::offsetSet
	abstract public function offsetSet( $offset , $value );
 //@php_CORE4.xml#ArrayAccess::offsetUnset
	abstract public function offsetUnset( $offset );

}
//@php_CORE.xml#Serializable
 interface Serializable   {

// Constants

// Properties

// Methods
 //@php_CORE.xml#Serializable::serialize
	abstract public function serialize();
 //@php_CORE.xml#Serializable::unserialize
	abstract public function unserialize( $serialized );

}
// WARNING: class stdClass is an internal/undocummented class; skipping....
//@php_CORE4.xml#Exception
 class Exception   {

// Constants

// Properties
	protected $message;
	private $string;
	protected $code;
	protected $file;
	protected $line;
	private $trace;

// Methods
 //@php_CORE4.xml#Exception::__clone
	final private function __clone(){ }
 //@php_CORE4.xml#Exception::__construct
	public function __construct( $message , $code ){ }
 //@php_CORE4.xml#Exception::getMessage
	final public function getMessage(){ }
 //@php_CORE4.xml#Exception::getCode
	final public function getCode(){ }
 //@php_CORE4.xml#Exception::getFile
	final public function getFile(){ }
 //@php_CORE4.xml#Exception::getLine
	final public function getLine(){ }
 //@php_CORE4.xml#Exception::getTrace
	final public function getTrace(){ }
 //@php_CORE4.xml#Exception::getTraceAsString
	final public function getTraceAsString(){ }
 //@php_CORE4.xml#Exception::__toString
	public function __toString(){ }

}
//@php_CORE4.xml#ErrorException
 class ErrorException extends Exception  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;
	protected $severity;

// Methods
 //@php_CORE4.xml#ErrorException::__construct
	public function __construct( $message , $code , $severity , $filename , $lineno ){ }
 //@php_CORE4.xml#ErrorException::getSeverity
	final public function getSeverity(){ }

}
// WARNING: class PHPInternal is an internal/undocummented class; skipping....
// 1: function zend_version(); // prototype:zend_version ( void )
// 2: function func_num_args(); // prototype:func_num_args ( void )
// 3: function func_get_arg(); // prototype:func_get_arg ( int $arg_num )
// 4: function func_get_args(); // prototype:func_get_args ( void )
// 5: function strlen(); // prototype:strlen ( string $string )
// 6: function strcmp(); // prototype:strcmp ( string $str1 , string $str2 )
// 7: function strncmp(); // prototype:strncmp ( string $str1 , string $str2 , int $len )
// 8: function strcasecmp(); // prototype:strcasecmp ( string $str1 , string $str2 )
// 9: function strncasecmp(); // prototype:strncasecmp ( string $str1 , string $str2 , int $len )
// 10: function each(); // prototype:each ( array &amp;$array )
// 11: function error_reporting(); // prototype:error_reporting ([ int $level ] )
// 12: function define(); // prototype:define ( string $name , mixed $value [, bool $case_insensitive = false ] )
// 13: function defined(); // prototype:defined ( string $name )
// 14: function get_class(); // prototype:get_class ([ object $object ] )
// 15: function get_parent_class(); // prototype:get_parent_class ([ mixed $object ] )
// 16: function method_exists(); // prototype:method_exists ( mixed $object , string $method_name )
// 17: function property_exists(); // prototype:property_exists ( mixed $class , string $property )
// 18: function class_exists(); // prototype:class_exists ( string $class_name [, bool $autoload = true ] )
// 19: function interface_exists(); // prototype:interface_exists ( string $interface_name [, bool $autoload = true ] )
// 20: function function_exists(); // prototype:function_exists ( string $function_name )
// 21: function get_included_files(); // prototype:get_included_files ( void )
// 22: function get_required_files(); // ALIAS of get_included_files():get_required_files(...)
// 23: function is_subclass_of(); // prototype:is_subclass_of ( mixed $object , string $class_name )
// 24: function is_a(); // prototype:is_a ( object $object , string $class_name )
// 25: function get_class_vars(); // prototype:get_class_vars ( string $class_name )
// 26: function get_object_vars(); // prototype:get_object_vars ( object $object )
// 27: function get_class_methods(); // prototype:get_class_methods ( mixed $class_name )
// 28: function trigger_error(); // prototype:trigger_error ( string $error_msg [, int $error_type = E_USER_NOTICE ] )
// 29: function user_error(); // ALIAS of trigger_error():user_error(...)
// 30: function set_error_handler(); // prototype:set_error_handler ( callback $error_handler [, int $error_types = E_ALL | E_STRICT ] )
// 31: function restore_error_handler(); // prototype:restore_error_handler ( void )
// 32: function set_exception_handler(); // prototype:set_exception_handler ( callback $exception_handler )
// 33: function restore_exception_handler(); // prototype:restore_exception_handler ( void )
// 34: function get_declared_classes(); // prototype:get_declared_classes ( void )
// 35: function get_declared_interfaces(); // prototype:get_declared_interfaces ( void )
// 36: function get_defined_functions(); // prototype:get_defined_functions ( void )
// 37: function get_defined_vars(); // prototype:get_defined_vars ( void )
// 38: function create_function(); // prototype:create_function ( string $args , string $code )
// 39: function get_resource_type(); // prototype:get_resource_type ( resource $handle )
// 40: function get_loaded_extensions(); // prototype:get_loaded_extensions ([ bool $zend_extensions = false ] )
// 41: function extension_loaded(); // prototype:extension_loaded ( string $name )
// 42: function get_extension_funcs(); // prototype:get_extension_funcs ( string $module_name )
// 43: function get_defined_constants(); // prototype:get_defined_constants ([ bool $categorize ] )
// 44: function debug_backtrace(); // prototype:debug_backtrace ([ bool $provide_object = true ] )
// 45: function debug_print_backtrace(); // prototype:debug_print_backtrace ( void )

define('__LINE__','Magic constant: <a href=http://www.php.net/manual/ro/language.constants.predefined.php>__LINE__</a>');
define('__FILE__','Magic constant: <a href=http://www.php.net/manual/ro/language.constants.predefined.php>__FILE__</a>');
define('__FUNCTION__','Magic constant: <a href=http://www.php.net/manual/ro/language.constants.predefined.php>__FUNCTION__</a>');
define('__CLASS__','Magic constant: <a href=http://www.php.net/manual/ro/language.constants.predefined.php>__CLASS__</a>');
define('__METHOD__','Magic constant: <a href=http://www.php.net/manual/ro/language.constants.predefined.php>__METHOD__</a>'); 
?>
<?php //Extension pcre
	define( 'PREG_PATTERN_ORDER',1);
	define( 'PREG_SET_ORDER',2);
	define( 'PREG_OFFSET_CAPTURE',256);
	define( 'PREG_SPLIT_NO_EMPTY',1);
	define( 'PREG_SPLIT_DELIM_CAPTURE',2);
	define( 'PREG_SPLIT_OFFSET_CAPTURE',4);
	define( 'PREG_GREP_INVERT',1);
	define( 'PREG_NO_ERROR',0);
	define( 'PREG_INTERNAL_ERROR',1);
	define( 'PREG_BACKTRACK_LIMIT_ERROR',2);
	define( 'PREG_RECURSION_LIMIT_ERROR',3);
	define( 'PREG_BAD_UTF8_ERROR',4);
	define( 'PCRE_VERSION','7.8 2008-09-05');

/////////////////// ********** FUNCTIONS (8 total functions) ************ ///////////////////////////////

// 1: function preg_match(); // prototype:preg_match ( string $pattern , string $subject [, array &amp;$matches [, int $flags [, int $offset ]]] )
// 2: function preg_match_all(); // prototype:preg_match_all ( string $pattern , string $subject , array &amp;$matches [, int $flags [, int $offset ]] )
// 3: function preg_replace(); // prototype:preg_replace ( mixed $pattern , mixed $replacement , mixed $subject [, int $limit = -1 [, int &amp;$count ]] )
// 4: function preg_replace_callback(); // prototype:preg_replace_callback ( mixed $pattern , callback $callback , mixed $subject [, int $limit = -1 [, int &amp;$count ]] )
// 5: function preg_split(); // prototype:preg_split ( string $pattern , string $subject [, int $limit = -1 [, int $flags = 0 ]] )
// 6: function preg_quote(); // prototype:preg_quote ( string $str [, string $delimiter = NULL ] )
// 7: function preg_grep(); // prototype:preg_grep ( string $pattern , array $input [, int $flags = 0 ] )
// 8: function preg_last_error(); // prototype:preg_last_error ( void )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension ctype

/////////////////// ********** FUNCTIONS (11 total functions) ************ ///////////////////////////////

// 1: function ctype_alnum(); // prototype:ctype_alnum ( string $text )
// 2: function ctype_alpha(); // prototype:ctype_alpha ( string $text )
// 3: function ctype_cntrl(); // prototype:ctype_cntrl ( string $text )
// 4: function ctype_digit(); // prototype:ctype_digit ( string $text )
// 5: function ctype_lower(); // prototype:ctype_lower ( string $text )
// 6: function ctype_graph(); // prototype:ctype_graph ( string $text )
// 7: function ctype_print(); // prototype:ctype_print ( string $text )
// 8: function ctype_punct(); // prototype:ctype_punct ( string $text )
// 9: function ctype_space(); // prototype:ctype_space ( string $text )
// 10: function ctype_upper(); // prototype:ctype_upper ( string $text )
// 11: function ctype_xdigit(); // prototype:ctype_xdigit ( string $text )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension curl
	define( 'CURLOPT_DNS_USE_GLOBAL_CACHE',91);
	define( 'CURLOPT_DNS_CACHE_TIMEOUT',92);
	define( 'CURLOPT_PORT',3);
	define( 'CURLOPT_FILE',10001);
	define( 'CURLOPT_READDATA',10009);
	define( 'CURLOPT_INFILE',10009);
	define( 'CURLOPT_INFILESIZE',14);
	define( 'CURLOPT_URL',10002);
	define( 'CURLOPT_PROXY',10004);
	define( 'CURLOPT_VERBOSE',41);
	define( 'CURLOPT_HEADER',42);
	define( 'CURLOPT_HTTPHEADER',10023);
	define( 'CURLOPT_NOPROGRESS',43);
	define( 'CURLOPT_NOBODY',44);
	define( 'CURLOPT_FAILONERROR',45);
	define( 'CURLOPT_UPLOAD',46);
	define( 'CURLOPT_POST',47);
	define( 'CURLOPT_FTPLISTONLY',48);
	define( 'CURLOPT_FTPAPPEND',50);
	define( 'CURLOPT_NETRC',51);
	define( 'CURLOPT_FOLLOWLOCATION',52);
	define( 'CURLOPT_PUT',54);
	define( 'CURLOPT_USERPWD',10005);
	define( 'CURLOPT_PROXYUSERPWD',10006);
	define( 'CURLOPT_RANGE',10007);
	define( 'CURLOPT_TIMEOUT',13);
	define( 'CURLOPT_POSTFIELDS',10015);
	define( 'CURLOPT_REFERER',10016);
	define( 'CURLOPT_USERAGENT',10018);
	define( 'CURLOPT_FTPPORT',10017);
	define( 'CURLOPT_FTP_USE_EPSV',85);
	define( 'CURLOPT_LOW_SPEED_LIMIT',19);
	define( 'CURLOPT_LOW_SPEED_TIME',20);
	define( 'CURLOPT_RESUME_FROM',21);
	define( 'CURLOPT_COOKIE',10022);
	define( 'CURLOPT_COOKIESESSION',96);
	define( 'CURLOPT_AUTOREFERER',58);
	define( 'CURLOPT_SSLCERT',10025);
	define( 'CURLOPT_SSLCERTPASSWD',10026);
	define( 'CURLOPT_WRITEHEADER',10029);
	define( 'CURLOPT_SSL_VERIFYHOST',81);
	define( 'CURLOPT_COOKIEFILE',10031);
	define( 'CURLOPT_SSLVERSION',32);
	define( 'CURLOPT_TIMECONDITION',33);
	define( 'CURLOPT_TIMEVALUE',34);
	define( 'CURLOPT_CUSTOMREQUEST',10036);
	define( 'CURLOPT_STDERR',10037);
	define( 'CURLOPT_TRANSFERTEXT',53);
	define( 'CURLOPT_RETURNTRANSFER',19913);
	define( 'CURLOPT_QUOTE',10028);
	define( 'CURLOPT_POSTQUOTE',10039);
	define( 'CURLOPT_INTERFACE',10062);
	define( 'CURLOPT_KRB4LEVEL',10063);
	define( 'CURLOPT_HTTPPROXYTUNNEL',61);
	define( 'CURLOPT_FILETIME',69);
	define( 'CURLOPT_WRITEFUNCTION',20011);
	define( 'CURLOPT_READFUNCTION',20012);
	define( 'CURLOPT_HEADERFUNCTION',20079);
	define( 'CURLOPT_MAXREDIRS',68);
	define( 'CURLOPT_MAXCONNECTS',71);
	define( 'CURLOPT_CLOSEPOLICY',72);
	define( 'CURLOPT_FRESH_CONNECT',74);
	define( 'CURLOPT_FORBID_REUSE',75);
	define( 'CURLOPT_RANDOM_FILE',10076);
	define( 'CURLOPT_EGDSOCKET',10077);
	define( 'CURLOPT_CONNECTTIMEOUT',78);
	define( 'CURLOPT_SSL_VERIFYPEER',64);
	define( 'CURLOPT_CAINFO',10065);
	define( 'CURLOPT_CAPATH',10097);
	define( 'CURLOPT_COOKIEJAR',10082);
	define( 'CURLOPT_SSL_CIPHER_LIST',10083);
	define( 'CURLOPT_BINARYTRANSFER',19914);
	define( 'CURLOPT_NOSIGNAL',99);
	define( 'CURLOPT_PROXYTYPE',101);
	define( 'CURLOPT_BUFFERSIZE',98);
	define( 'CURLOPT_HTTPGET',80);
	define( 'CURLOPT_HTTP_VERSION',84);
	define( 'CURLOPT_SSLKEY',10087);
	define( 'CURLOPT_SSLKEYTYPE',10088);
	define( 'CURLOPT_SSLKEYPASSWD',10026);
	define( 'CURLOPT_SSLENGINE',10089);
	define( 'CURLOPT_SSLENGINE_DEFAULT',90);
	define( 'CURLOPT_SSLCERTTYPE',10086);
	define( 'CURLOPT_CRLF',27);
	define( 'CURLOPT_ENCODING',10102);
	define( 'CURLOPT_PROXYPORT',59);
	define( 'CURLOPT_UNRESTRICTED_AUTH',105);
	define( 'CURLOPT_FTP_USE_EPRT',106);
	define( 'CURLOPT_TCP_NODELAY',121);
	define( 'CURLOPT_HTTP200ALIASES',10104);
	define( 'CURL_TIMECOND_IFMODSINCE',1);
	define( 'CURL_TIMECOND_IFUNMODSINCE',2);
	define( 'CURL_TIMECOND_LASTMOD',3);
	define( 'CURLOPT_HTTPAUTH',107);
	define( 'CURLAUTH_BASIC',1);
	define( 'CURLAUTH_DIGEST',2);
	define( 'CURLAUTH_GSSNEGOTIATE',4);
	define( 'CURLAUTH_NTLM',8);
	define( 'CURLAUTH_ANY',-1);
	define( 'CURLAUTH_ANYSAFE',-2);
	define( 'CURLOPT_PROXYAUTH',111);
	define( 'CURLOPT_FTP_CREATE_MISSING_DIRS',110);
	define( 'CURLOPT_PRIVATE',10103);
	define( 'CURLCLOSEPOLICY_LEAST_RECENTLY_USED',2);
	define( 'CURLCLOSEPOLICY_LEAST_TRAFFIC',3);
	define( 'CURLCLOSEPOLICY_SLOWEST',4);
	define( 'CURLCLOSEPOLICY_CALLBACK',5);
	define( 'CURLCLOSEPOLICY_OLDEST',1);
	define( 'CURLINFO_EFFECTIVE_URL',1048577);
	define( 'CURLINFO_HTTP_CODE',2097154);
	define( 'CURLINFO_HEADER_SIZE',2097163);
	define( 'CURLINFO_REQUEST_SIZE',2097164);
	define( 'CURLINFO_TOTAL_TIME',3145731);
	define( 'CURLINFO_NAMELOOKUP_TIME',3145732);
	define( 'CURLINFO_CONNECT_TIME',3145733);
	define( 'CURLINFO_PRETRANSFER_TIME',3145734);
	define( 'CURLINFO_SIZE_UPLOAD',3145735);
	define( 'CURLINFO_SIZE_DOWNLOAD',3145736);
	define( 'CURLINFO_SPEED_DOWNLOAD',3145737);
	define( 'CURLINFO_SPEED_UPLOAD',3145738);
	define( 'CURLINFO_FILETIME',2097166);
	define( 'CURLINFO_SSL_VERIFYRESULT',2097165);
	define( 'CURLINFO_CONTENT_LENGTH_DOWNLOAD',3145743);
	define( 'CURLINFO_CONTENT_LENGTH_UPLOAD',3145744);
	define( 'CURLINFO_STARTTRANSFER_TIME',3145745);
	define( 'CURLINFO_CONTENT_TYPE',1048594);
	define( 'CURLINFO_REDIRECT_TIME',3145747);
	define( 'CURLINFO_REDIRECT_COUNT',2097172);
	define( 'CURLINFO_HEADER_OUT',2);
	define( 'CURLINFO_PRIVATE',1048597);
	define( 'CURL_VERSION_IPV6',1);
	define( 'CURL_VERSION_KERBEROS4',2);
	define( 'CURL_VERSION_SSL',4);
	define( 'CURL_VERSION_LIBZ',8);
	define( 'CURLVERSION_NOW',2);
	define( 'CURLE_OK',0);
	define( 'CURLE_UNSUPPORTED_PROTOCOL',1);
	define( 'CURLE_FAILED_INIT',2);
	define( 'CURLE_URL_MALFORMAT',3);
	define( 'CURLE_URL_MALFORMAT_USER',4);
	define( 'CURLE_COULDNT_RESOLVE_PROXY',5);
	define( 'CURLE_COULDNT_RESOLVE_HOST',6);
	define( 'CURLE_COULDNT_CONNECT',7);
	define( 'CURLE_FTP_WEIRD_SERVER_REPLY',8);
	define( 'CURLE_FTP_ACCESS_DENIED',9);
	define( 'CURLE_FTP_USER_PASSWORD_INCORRECT',10);
	define( 'CURLE_FTP_WEIRD_PASS_REPLY',11);
	define( 'CURLE_FTP_WEIRD_USER_REPLY',12);
	define( 'CURLE_FTP_WEIRD_PASV_REPLY',13);
	define( 'CURLE_FTP_WEIRD_227_FORMAT',14);
	define( 'CURLE_FTP_CANT_GET_HOST',15);
	define( 'CURLE_FTP_CANT_RECONNECT',16);
	define( 'CURLE_FTP_COULDNT_SET_BINARY',17);
	define( 'CURLE_PARTIAL_FILE',18);
	define( 'CURLE_FTP_COULDNT_RETR_FILE',19);
	define( 'CURLE_FTP_WRITE_ERROR',20);
	define( 'CURLE_FTP_QUOTE_ERROR',21);
	define( 'CURLE_HTTP_NOT_FOUND',22);
	define( 'CURLE_WRITE_ERROR',23);
	define( 'CURLE_MALFORMAT_USER',24);
	define( 'CURLE_FTP_COULDNT_STOR_FILE',25);
	define( 'CURLE_READ_ERROR',26);
	define( 'CURLE_OUT_OF_MEMORY',27);
	define( 'CURLE_OPERATION_TIMEOUTED',28);
	define( 'CURLE_FTP_COULDNT_SET_ASCII',29);
	define( 'CURLE_FTP_PORT_FAILED',30);
	define( 'CURLE_FTP_COULDNT_USE_REST',31);
	define( 'CURLE_FTP_COULDNT_GET_SIZE',32);
	define( 'CURLE_HTTP_RANGE_ERROR',33);
	define( 'CURLE_HTTP_POST_ERROR',34);
	define( 'CURLE_SSL_CONNECT_ERROR',35);
	define( 'CURLE_FTP_BAD_DOWNLOAD_RESUME',36);
	define( 'CURLE_FILE_COULDNT_READ_FILE',37);
	define( 'CURLE_LDAP_CANNOT_BIND',38);
	define( 'CURLE_LDAP_SEARCH_FAILED',39);
	define( 'CURLE_LIBRARY_NOT_FOUND',40);
	define( 'CURLE_FUNCTION_NOT_FOUND',41);
	define( 'CURLE_ABORTED_BY_CALLBACK',42);
	define( 'CURLE_BAD_FUNCTION_ARGUMENT',43);
	define( 'CURLE_BAD_CALLING_ORDER',44);
	define( 'CURLE_HTTP_PORT_FAILED',45);
	define( 'CURLE_BAD_PASSWORD_ENTERED',46);
	define( 'CURLE_TOO_MANY_REDIRECTS',47);
	define( 'CURLE_UNKNOWN_TELNET_OPTION',48);
	define( 'CURLE_TELNET_OPTION_SYNTAX',49);
	define( 'CURLE_OBSOLETE',50);
	define( 'CURLE_SSL_PEER_CERTIFICATE',51);
	define( 'CURLE_GOT_NOTHING',52);
	define( 'CURLE_SSL_ENGINE_NOTFOUND',53);
	define( 'CURLE_SSL_ENGINE_SETFAILED',54);
	define( 'CURLE_SEND_ERROR',55);
	define( 'CURLE_RECV_ERROR',56);
	define( 'CURLE_SHARE_IN_USE',57);
	define( 'CURLE_SSL_CERTPROBLEM',58);
	define( 'CURLE_SSL_CIPHER',59);
	define( 'CURLE_SSL_CACERT',60);
	define( 'CURLE_BAD_CONTENT_ENCODING',61);
	define( 'CURLE_LDAP_INVALID_URL',62);
	define( 'CURLE_FILESIZE_EXCEEDED',63);
	define( 'CURLE_FTP_SSL_FAILED',64);
	define( 'CURLPROXY_HTTP',0);
	define( 'CURLPROXY_SOCKS5',5);
	define( 'CURL_NETRC_OPTIONAL',1);
	define( 'CURL_NETRC_IGNORED',0);
	define( 'CURL_NETRC_REQUIRED',2);
	define( 'CURL_HTTP_VERSION_NONE',0);
	define( 'CURL_HTTP_VERSION_1_0',1);
	define( 'CURL_HTTP_VERSION_1_1',2);
	define( 'CURLM_CALL_MULTI_PERFORM',-1);
	define( 'CURLM_OK',0);
	define( 'CURLM_BAD_HANDLE',1);
	define( 'CURLM_BAD_EASY_HANDLE',2);
	define( 'CURLM_OUT_OF_MEMORY',3);
	define( 'CURLM_INTERNAL_ERROR',4);
	define( 'CURLMSG_DONE',1);
	define( 'CURLOPT_FTPSSLAUTH',129);
	define( 'CURLFTPAUTH_DEFAULT',0);
	define( 'CURLFTPAUTH_SSL',1);
	define( 'CURLFTPAUTH_TLS',2);
	define( 'CURLOPT_FTP_SSL',119);
	define( 'CURLFTPSSL_NONE',0);
	define( 'CURLFTPSSL_TRY',1);
	define( 'CURLFTPSSL_CONTROL',2);
	define( 'CURLFTPSSL_ALL',3);

/////////////////// ********** FUNCTIONS (18 total functions) ************ ///////////////////////////////

// 1: function curl_init(); // prototype:curl_init ([ string $url = NULL ] )
// 2: function curl_copy_handle(); // prototype:curl_copy_handle ( resource $ch )
// 3: function curl_version(); // prototype:curl_version ([ int $age = CURLVERSION_NOW ] )
// 4: function curl_setopt(); // prototype:curl_setopt ( resource $ch , int $option , mixed $value )
// 5: function curl_setopt_array(); // prototype:curl_setopt_array ( resource $ch , array $options )
// 6: function curl_exec(); // prototype:curl_exec ( resource $ch )
// 7: function curl_getinfo(); // prototype:curl_getinfo ( resource $ch [, int $opt = 0 ] )
// 8: function curl_error(); // prototype:curl_error ( resource $ch )
// 9: function curl_errno(); // prototype:curl_errno ( resource $ch )
// 10: function curl_close(); // prototype:curl_close ( resource $ch )
// 11: function curl_multi_init(); // prototype:curl_multi_init ( void )
// 12: function curl_multi_add_handle(); // prototype:curl_multi_add_handle ( resource $mh , resource $ch )
// 13: function curl_multi_remove_handle(); // prototype:curl_multi_remove_handle ( resource $mh , resource $ch )
// 14: function curl_multi_select(); // prototype:curl_multi_select ( resource $mh [, float $timeout = 1.0 ] )
// 15: function curl_multi_exec(); // prototype:curl_multi_exec ( resource $mh , int &amp;$still_running )
// 16: function curl_multi_getcontent(); // prototype:curl_multi_getcontent ( resource $ch )
// 17: function curl_multi_info_read(); // prototype:curl_multi_info_read ( resource $mh [, int &amp;$msgs_in_queue = NULL ] )
// 18: function curl_multi_close(); // prototype:curl_multi_close ( resource $mh )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension mysqli
// class mysqli_sql_exception is an undocummented class;
class MySQLi_Sql_Exception extends RuntimeException {
	public function __construct($message, $code) {}
}

final class _internal_MySQLi_Warning{
  public $message;
  public $sqlstate;
  public $errno;
  public function next() { return new _internal_MySQLi_Warning(); }
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE3.xml#MySQLi_Driver
final class MySQLi_Driver   {

// Constants

// Properties
public $client_info ;
public $client_version ;
public $driver_version ;
public $embedded ;
public $reconnect ;
public $report_mode;

// Methods
 //@php_CORE3.xml#mysqli_embedded_server_start
	public function embedded_server_start(){ }
 //@php_CORE3.xml#mysqli_embedded_server_end
	public function embedded_server_end($start, array $arguments, array $groups){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE3.xml#MySQLi
 class MySQLi   {

// Constants

// Properties
public $affected_rows;
public $connect_errno;
public $connect_error;
public $errno;
public $error;
public $field_count;
public $host_info;
public $protocol_version;
public $server_info;
public $server_version;
public $info;
public $insert_id;
public $sqlstate;
public $thread_id;
public $warning_count;
// Methods
 //@php_CORE3.xml#mysqli_autocommit
	public function autocommit($mode){ }
 //@php_CORE3.xml#mysqli_change_user
	public function change_user($user,$password,$database){ }
 //@php_CORE3.xml#mysqli_character_set_name
	public function character_set_name(){ }
 //@php_CORE3.xml#mysqli_close
	public function close(){ }
 //@php_CORE3.xml#mysqli_commit
	public function commit(){ }
 //@php_CORE3.xml#mysqli_connect
	public function connect($host , $username, $passwd , $dbname , $port , $socket ){ return new MySQLi; }
 //@php_CORE3.xml#mysqli_debug
	public function debug($message){ }
  //@php_CORE3.xml#mysqli_disable_reads_from_master
	public function disable_reads_from_master() {}
  //@php_CORE3.xml#mysqli_enable_reads_from_master
	public function enable_reads_from_master() {}
  //@php_CORE3.xml#mysqli_disable_rpl_parse
	public function disable_rpl_parse() {}
  //@php_CORE3.xml#mysqli_enable_rpl_parse
	public function enable_rpl_parse() {}
 //@php_CORE3.xml#mysqli_dump_debug_info
	public function dump_debug_info(){ }
 //@php_CORE3.xml#mysqli_get_charset
	public function get_charset(){ }
 //@php_CORE3.xml#mysqli_get_client_info
	public function get_client_info(){ }
 //@php_CORE3.xml#mysqli_get_server_info
	public function get_server_info(){ }
 //@php_CORE3.xml#mysqli_get_warnings
	public function get_warnings(){ return new _internal_MySQLi_Warning();}
 //@php_CORE3.xml#mysqli_init
	public function init(){ return new MySQLi();}
 //@php_CORE3.xml#mysqli_kill
	public function kill($processid){ }
 //@php_CORE3.xml#mysqli_set_local_infile_default
	public function set_local_infile_default(){ }
 //@php_CORE3.xml#mysqli_set_local_infile_handler
	public function set_local_infile_handler($read_func){ }
 //@php_CORE3.xml#mysqli_multi_query
	public function multi_query(){ }
 //@php_CORE3.xml#mysqli_more_results
	public function more_results(){ }
 //@php_CORE3.xml#mysqli_next_result
	public function next_result(){ }
 //@php_CORE3.xml#mysqli_options
	public function options($option , $value ){ }
 //@php_CORE3.xml#mysqli_ping
	public function ping(){ }
 //@php_CORE3.xml#mysqli_prepare
	public function prepare($query){ return new  MySQLi_STMT(); }
 //@php_CORE3.xml#mysqli_query
	public function query($query, $result_mode){ return new MySQLi_Result();}
 //@php_CORE3.xml#mysqli_real_connect
	public function real_connect($host,$username,$password,$dbname, $port, $socket, $flags){ }
 //@php_CORE3.xml#mysqli_real_escape_string
	public function real_escape_string($escapestr){ }
 //@php_CORE3.xml#mysqli_real_escape_string
	public function escape_string($escapestr){ }
 //@php_CORE3.xml#mysqli_real_query
	public function real_query($query){ }
 //@php_CORE3.xml#mysqli_rollback
	public function rollback(){ }
 //@php_CORE3.xml#mysqli_rpl_parse_enabled
    public function rpl_parse_enabled() {}
 //@php_CORE3.xml#mysqli_rpl_probe
 	public function rpl_probe() {}
 //@php_CORE3.xml#mysqli_rpl_query_type
    public function rpl_query_type($query) {}
 //@php_CORE3.xml#mysqli_select_db
	public function select_db($db_name){ }
 //@php_CORE3.xml#mysqli_set_charset
	public function set_charset($charset){ }
 //@php_CORE3.xml#mysqli_options
	public function set_opt($option , $value ){ }
 //@php_CORE3.xml#mysqli_send_query
    public function send_query(string $query) {}
 //@php_CORE3.xml#mysqli_slave_query
    public function slave_query(string $query) {}
 //@php_CORE3.xml#mysqli_ssl_set
	public function ssl_set($key , $cert , $ca , $capath , $cipher){ }
 //@php_CORE3.xml#mysqli_stat
	public function stat(){ }
 //@php_CORE3.xml#mysqli_stmt_init
	public function stmt_init(){ return new mysqli_stmt();}
 //@php_CORE3.xml#mysqli_store_result
	public function store_result(){ return new mysqli_result();}
 //@php_CORE3.xml#mysqli_thread_safe
	public function thread_safe(){ }
 //@php_CORE3.xml#mysqli_use_result
	public function use_result(){  return new mysqli_result(); }

}

////////////////////////////////////////////////////////////////////////////////////
// WARNING: class mysqli_warning is an internal/undocummented class; skipping....
////////////////////////////////////////////////////////////////////////////////////

final class _internal_MySqli_Field{
    public $name;
	public $orgname;
	public $table;
	public $orgtable;
	public $def;
	public $max_length;
	public $length;
	public $charsetnr;
	public $flags;
	public $type;
	public $decimals;
}

//@php_CORE3.xml#MySQLi_Result
 class MySQLi_Result   {

// Constants

// Properties
public $current_field ;
 //@php_CORE3.xml#mysqli_num_fields
public $field_count;
public $lengths=array();
public $num_rows;
// Methods
 // PHP >5.3 : mysqli_result::fetch_all
 //@php_CORE3.xml#mysqli_free_result
	public function free(){ }
 //@php_CORE3.xml#mysqli_data_seek
	public function data_seek($offset){ }
 //@php_CORE3.xml#mysqli_fetch_field
	public function fetch_field(){ return new _internal_MySqli_Field();}
 //@php_CORE3.xml#mysqli_fetch_fields
	public function fetch_fields(){ return array(); }
 //@php_CORE3.xml#mysqli_fetch_field_direct
	public function fetch_field_direct($fieldnr){ return new _internal_MySqli_Field();}
 //@php_CORE3.xml#mysqli_fetch_array
	public function fetch_array($resulttype){return array();}
 //@php_CORE3.xml#mysqli_fetch_assoc
	public function fetch_assoc(){ return array();}
 //@php_CORE3.xml#mysqli_fetch_object
	public function fetch_object($class_name , array $params){ }
 //@php_CORE3.xml#mysqli_fetch_row
	public function fetch_row(){ return array(); }
 //@php_CORE3.xml#mysqli_field_seek
	public function field_seek($fieldnr){ }
}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE3.xml#MySQLi_STMT
 class MySQLi_STMT {

// Constants

// Properties
public $affected_rows;
public $errno;
public $error;
public $field_count;
public $insert_id;
//@php_CORE3.xml#mysqli_stmt_num_rows
public $num_rows;
public $param_count;
public $sqlstate;

// Methods
 //@php_CORE3.xml#mysqli_stmt_attr_get
	public function attr_get($attr){ }
 //@php_CORE3.xml#mysqli_stmt_attr_set
	public function attr_set($attr , $mode){ }
 //@php_CORE3.xml#mysqli_stmt_bind_param
	public function bind_param($types , &$variables){ }
 //@php_CORE3.xml#mysqli_stmt_bind_result
	public function bind_result(&$variables){ }
 //@php_CORE3.xml#mysqli_stmt_close
	public function close(){ }
 //@php_CORE3.xml#mysqli_stmt_data_seek
	public function data_seek($offset){ }
 //@php_CORE3.xml#mysqli_stmt_execute
	public function execute(){ }
 //@php_CORE3.xml#mysqli_stmt_fetch
	public function fetch(){ }
 //@php_CORE3.xml#mysqli_stmt_get_warnings
	public function get_warnings(){ return new _internal_MySQLi_Warning(); }
 //@php_CORE3.xml#mysqli_stmt_result_metadata
	public function result_metadata(){ return new MySQLi_result();}
 //@php_CORE3.xml#mysqli_stmt_send_long_data
	public function send_long_data($param_nr , $data ){ }
// function stmt() NOT FOUND
 //@php_CORE3.xml#mysqli_stmt_free_result
	public function free_result(){ }
 //@php_CORE3.xml#mysqli_stmt_reset
	public function reset(){ }
 //@php_CORE3.xml#mysqli_stmt_prepare
	public function prepare($query ){ }
 //@php_CORE3.xml#mysqli_stmt_store_result
	public function store_result(){ }

}

////////////////////////////////////////////////////////////////////////////////////

	define( 'MYSQLI_READ_DEFAULT_GROUP',5);
	define( 'MYSQLI_READ_DEFAULT_FILE',4);
	define( 'MYSQLI_OPT_CONNECT_TIMEOUT',0);
	define( 'MYSQLI_OPT_LOCAL_INFILE',8);
	define( 'MYSQLI_INIT_COMMAND',3);
	define( 'MYSQLI_CLIENT_SSL',2048);
	define( 'MYSQLI_CLIENT_COMPRESS',32);
	define( 'MYSQLI_CLIENT_INTERACTIVE',1024);
	define( 'MYSQLI_CLIENT_IGNORE_SPACE',256);
	define( 'MYSQLI_CLIENT_NO_SCHEMA',16);
	define( 'MYSQLI_CLIENT_FOUND_ROWS',2);
	define( 'MYSQLI_STORE_RESULT',0);
	define( 'MYSQLI_USE_RESULT',1);
	define( 'MYSQLI_ASSOC',1);
	define( 'MYSQLI_NUM',2);
	define( 'MYSQLI_BOTH',3);
	define( 'MYSQLI_STMT_ATTR_UPDATE_MAX_LENGTH',0);
	define( 'MYSQLI_STMT_ATTR_CURSOR_TYPE',1);
	define( 'MYSQLI_CURSOR_TYPE_NO_CURSOR',0);
	define( 'MYSQLI_CURSOR_TYPE_READ_ONLY',1);
	define( 'MYSQLI_CURSOR_TYPE_FOR_UPDATE',2);
	define( 'MYSQLI_CURSOR_TYPE_SCROLLABLE',4);
	define( 'MYSQLI_STMT_ATTR_PREFETCH_ROWS',2);
	define( 'MYSQLI_NOT_NULL_FLAG',1);
	define( 'MYSQLI_PRI_KEY_FLAG',2);
	define( 'MYSQLI_UNIQUE_KEY_FLAG',4);
	define( 'MYSQLI_MULTIPLE_KEY_FLAG',8);
	define( 'MYSQLI_BLOB_FLAG',16);
	define( 'MYSQLI_UNSIGNED_FLAG',32);
	define( 'MYSQLI_ZEROFILL_FLAG',64);
	define( 'MYSQLI_AUTO_INCREMENT_FLAG',512);
	define( 'MYSQLI_TIMESTAMP_FLAG',1024);
	define( 'MYSQLI_SET_FLAG',2048);
	define( 'MYSQLI_NUM_FLAG',32768);
	define( 'MYSQLI_PART_KEY_FLAG',16384);
	define( 'MYSQLI_GROUP_FLAG',32768);
	define( 'MYSQLI_TYPE_DECIMAL',0);
	define( 'MYSQLI_TYPE_TINY',1);
	define( 'MYSQLI_TYPE_SHORT',2);
	define( 'MYSQLI_TYPE_LONG',3);
	define( 'MYSQLI_TYPE_FLOAT',4);
	define( 'MYSQLI_TYPE_DOUBLE',5);
	define( 'MYSQLI_TYPE_NULL',6);
	define( 'MYSQLI_TYPE_TIMESTAMP',7);
	define( 'MYSQLI_TYPE_LONGLONG',8);
	define( 'MYSQLI_TYPE_INT24',9);
	define( 'MYSQLI_TYPE_DATE',10);
	define( 'MYSQLI_TYPE_TIME',11);
	define( 'MYSQLI_TYPE_DATETIME',12);
	define( 'MYSQLI_TYPE_YEAR',13);
	define( 'MYSQLI_TYPE_NEWDATE',14);
	define( 'MYSQLI_TYPE_ENUM',247);
	define( 'MYSQLI_TYPE_SET',248);
	define( 'MYSQLI_TYPE_TINY_BLOB',249);
	define( 'MYSQLI_TYPE_MEDIUM_BLOB',250);
	define( 'MYSQLI_TYPE_LONG_BLOB',251);
	define( 'MYSQLI_TYPE_BLOB',252);
	define( 'MYSQLI_TYPE_VAR_STRING',253);
	define( 'MYSQLI_TYPE_STRING',254);
	define( 'MYSQLI_TYPE_CHAR',1);
	define( 'MYSQLI_TYPE_INTERVAL',247);
	define( 'MYSQLI_TYPE_GEOMETRY',255);
	define( 'MYSQLI_TYPE_NEWDECIMAL',246);
	define( 'MYSQLI_TYPE_BIT',16);
	define( 'MYSQLI_SET_CHARSET_NAME',7);
	define( 'MYSQLI_RPL_MASTER',0);
	define( 'MYSQLI_RPL_SLAVE',1);
	define( 'MYSQLI_RPL_ADMIN',2);
	define( 'MYSQLI_NO_DATA',100);
	define( 'MYSQLI_DATA_TRUNCATED',101);
	define( 'MYSQLI_REPORT_INDEX',4);
	define( 'MYSQLI_REPORT_ERROR',1);
	define( 'MYSQLI_REPORT_STRICT',2);
	define( 'MYSQLI_REPORT_ALL',255);
	define( 'MYSQLI_REPORT_OFF',0);

/////////////////// ********** FUNCTIONS (110 total functions) ************ ///////////////////////////////

// 1: function mysqli_affected_rows(); // prototype:mysqli_affected_rows ( mysqli $link )
// 2: function mysqli_autocommit(); // prototype:mysqli_autocommit ( mysqli $link , bool $mode )
// 3: function mysqli_change_user(); // prototype:mysqli_change_user ( mysqli $link , string $user , string $password , string $database )
// 4: function mysqli_character_set_name(); // prototype:mysqli_character_set_name ( mysqli $link )
// 5: function mysqli_close(); // prototype:mysqli_close ( mysqli $link )
// 6: function mysqli_commit(); // prototype:mysqli_commit ( mysqli $link )
// 7: function mysqli_connect(); // prototype:mysqli_connect ([ string $host = ini_get(&quot;mysqli.default_host&quot;) [, string $username = ini_get(&quot;mysqli.default_user&quot;) [, string $passwd = ini_get(&quot;mysqli.default_pw&quot;) [, string $dbname = &quot;&quot; [, int $port = ini_get(&quot;mysqli.default_port&quot;) [, string $socket = ini_get(&quot;mysqli.default_socket&quot;) ]]]]]] )
// 8: function mysqli_connect_errno(); // prototype:mysqli_connect_errno ( void )
// 9: function mysqli_connect_error(); // prototype:mysqli_connect_error ( void )
// 10: function mysqli_data_seek(); // prototype:mysqli_data_seek ( mysqli_result $result , int $offset )
// 11: function mysqli_debug(); // prototype:mysqli_debug ( string $message )
// 12: function mysqli_disable_reads_from_master(); // prototype:mysqli_disable_reads_from_master ( mysqli $link )
// 13: function mysqli_disable_rpl_parse(); // prototype:mysqli_disable_rpl_parse ( mysqli $link )
// 14: function mysqli_dump_debug_info(); // prototype:mysqli_dump_debug_info ( mysqli $link )
// 15: function mysqli_enable_reads_from_master(); // prototype:mysqli_enable_reads_from_master ( mysqli $link )
// 16: function mysqli_enable_rpl_parse(); // prototype:mysqli_enable_rpl_parse ( mysqli $link )
// 17: function mysqli_embedded_server_end(); // prototype:mysqli_embedded_server_end ( void )
// 18: function mysqli_embedded_server_start(); // prototype:mysqli_embedded_server_start ( bool $start , array $arguments , array $groups )
// 19: function mysqli_errno(); // prototype:mysqli_errno ( mysqli $link )
// 20: function mysqli_error(); // prototype:mysqli_error ( mysqli $link )
// 21: function mysqli_stmt_execute(); // prototype:mysqli_stmt_execute ( mysqli_stmt $stmt )
// 22: function mysqli_execute(); // ALIAS of mysqli_stmt_execute():mysqli_execute(...)
// 23: function mysqli_fetch_field(); // prototype:mysqli_fetch_field ( mysqli_result $result )
// 24: function mysqli_fetch_fields(); // prototype:mysqli_fetch_fields ( mysqli_result $result )
// 25: function mysqli_fetch_field_direct(); // prototype:mysqli_fetch_field_direct ( mysqli_result $result , int $fieldnr )
// 26: function mysqli_fetch_lengths(); // prototype:mysqli_fetch_lengths ( mysqli_result $result )
// 27: function mysqli_fetch_array(); // prototype:mysqli_fetch_array ( mysqli_result $result [, int $resulttype ] )
// 28: function mysqli_fetch_assoc(); // prototype:mysqli_fetch_assoc ( mysqli_result $result )
// 29: function mysqli_fetch_object(); // prototype:mysqli_fetch_object ( mysqli_result $result [, string $class_name [, array $params ]] )
// 30: function mysqli_fetch_row(); // prototype:mysqli_fetch_row ( mysqli_result $result )
// 31: function mysqli_field_count(); // prototype:mysqli_field_count ( mysqli $link )
// 32: function mysqli_field_seek(); // prototype:mysqli_field_seek ( mysqli_result $result , int $fieldnr )
// 33: function mysqli_field_tell(); // prototype:mysqli_field_tell ( mysqli_result $result )
// 34: function mysqli_free_result(); // prototype:mysqli_free_result ( mysqli_result $result )
// 35: function mysqli_get_charset(); // prototype:mysqli_get_charset ( mysqli $link )
// 36: function mysqli_get_client_info(); // prototype:mysqli_get_client_info ( void )
// 37: function mysqli_get_client_version(); // prototype:mysqli_get_client_version ( void )
// 38: function mysqli_get_host_info(); // prototype:mysqli_get_host_info ( mysqli $link )
// 39: function mysqli_get_proto_info(); // prototype:mysqli_get_proto_info ( mysqli $link )
// 40: function mysqli_get_server_info(); // prototype:mysqli_get_server_info ( mysqli $link )
// 41: function mysqli_get_server_version(); // prototype:mysqli_get_server_version ( mysqli $link )
// 42: function mysqli_get_warnings(); // prototype:mysqli_get_warnings ( mysqli $link )
// 43: function mysqli_init(); // prototype:mysqli_init ( void )
// 44: function mysqli_info(); // prototype:mysqli_info ( mysqli $link )
// 45: function mysqli_insert_id(); // prototype:mysqli_insert_id ( mysqli $link )
// 46: function mysqli_kill(); // prototype:mysqli_kill ( mysqli $link , int $processid )
// 47: function mysqli_set_local_infile_default(); // prototype:mysqli_set_local_infile_default ( mysqli $link )
// 48: function mysqli_set_local_infile_handler(); // prototype:mysqli_set_local_infile_handler ( mysqli $link , callback $read_func )
// 49: function mysqli_master_query(); // prototype:mysqli_master_query ( mysqli $link , string $query )
// 50: function mysqli_more_results(); // prototype:mysqli_more_results ( mysqli $link )
// 51: function mysqli_multi_query(); // prototype:mysqli_multi_query ( mysqli $link , string $query )
// 52: function mysqli_next_result(); // prototype:mysqli_next_result ( mysqli $link )
// 53: function mysqli_num_fields(); // prototype:mysqli_num_fields ( mysqli_result $result )
// 54: function mysqli_num_rows(); // prototype:mysqli_num_rows ( mysqli_result $result )
// 55: function mysqli_options(); // prototype:mysqli_options ( mysqli $link , int $option , mixed $value )
// 56: function mysqli_ping(); // prototype:mysqli_ping ( mysqli $link )
// 57: function mysqli_prepare(); // prototype:mysqli_prepare ( mysqli $link , string $query )
// 58: function mysqli_report(); // prototype:mysqli_report ( int $flags )
// 59: function mysqli_query(); // prototype:mysqli_query ( mysqli $link , string $query [, int $resultmode ] )
// 60: function mysqli_real_connect(); // prototype:mysqli_real_connect ( mysqli $link [, string $host [, string $username [, string $passwd [, string $dbname [, int $port [, string $socket [, int $flags ]]]]]]] )
// 61: function mysqli_real_escape_string(); // prototype:mysqli_real_escape_string ( mysqli $link , string $escapestr )
// 62: function mysqli_real_query(); // prototype:mysqli_real_query ( mysqli $link , string $query )
// 63: function mysqli_rollback(); // prototype:mysqli_rollback ( mysqli $link )
// 64: function mysqli_rpl_parse_enabled(); // prototype:mysqli_rpl_parse_enabled ( mysqli $link )
// 65: function mysqli_rpl_probe(); // prototype:mysqli_rpl_probe ( mysqli $link )
// 66: function mysqli_rpl_query_type(); // prototype:mysqli_rpl_query_type ( mysqli $link , string $query )
// 67: function mysqli_select_db(); // prototype:mysqli_select_db ( mysqli $link , string $dbname )
// 68: function mysqli_set_charset(); // prototype:mysqli_set_charset ( mysqli $link , string $charset )
// 69: function mysqli_stmt_attr_get(); // prototype:mysqli_stmt_attr_get ( mysqli_stmt $stmt , int $attr )
// 70: function mysqli_stmt_attr_set(); // prototype:mysqli_stmt_attr_set ( mysqli_stmt $stmt , int $attr , int $mode )
// 71: function mysqli_stmt_field_count(); // prototype:mysqli_stmt_field_count ( mysqli_stmt $stmt )
// 72: function mysqli_stmt_init(); // prototype:mysqli_stmt_init ( mysqli $link )
// 73: function mysqli_stmt_prepare(); // prototype:mysqli_stmt_prepare ( mysqli_stmt $stmt , string $query )
// 74: function mysqli_stmt_result_metadata(); // prototype:mysqli_stmt_result_metadata ( mysqli_stmt $stmt )
// 75: function mysqli_stmt_send_long_data(); // prototype:mysqli_stmt_send_long_data ( mysqli_stmt $stmt , int $param_nr , string $data )
// 76: function mysqli_stmt_bind_param(); // prototype:mysqli_stmt_bind_param ( mysqli_stmt $stmt , string $types , mixed &amp;$var1 [, mixed &amp;$... ] )
// 77: function mysqli_stmt_bind_result(); // prototype:mysqli_stmt_bind_result ( mysqli_stmt $stmt , mixed &amp;$var1 [, mixed &amp;$... ] )
// 78: function mysqli_stmt_fetch(); // prototype:mysqli_stmt_fetch ( mysqli_stmt $stmt )
// 79: function mysqli_stmt_free_result(); // prototype:mysqli_stmt_free_result ( mysqli_stmt $stmt )
// 80: function mysqli_stmt_get_warnings(); // prototype:mysqli_stmt_get_warnings ( mysqli_stmt $stmt )
// 81: function mysqli_stmt_insert_id(); // prototype:mysqli_stmt_insert_id ( mysqli_stmt $stmt )
// 82: function mysqli_stmt_reset(); // prototype:mysqli_stmt_reset ( mysqli_stmt $stmt )
// 83: function mysqli_stmt_param_count(); // prototype:mysqli_stmt_param_count ( mysqli_stmt $stmt )
// 84: function mysqli_send_query(); // prototype:mysqli_send_query ( mysqli $link , string $query )
// 85: function mysqli_slave_query(); // prototype:mysqli_slave_query ( mysqli $link , string $query )
// 86: function mysqli_sqlstate(); // prototype:mysqli_sqlstate ( mysqli $link )
// 87: function mysqli_ssl_set(); // prototype:mysqli_ssl_set ( mysqli $link , string $key , string $cert , string $ca , string $capath , string $cipher )
// 88: function mysqli_stat(); // prototype:mysqli_stat ( mysqli $link )
// 89: function mysqli_stmt_affected_rows(); // prototype:mysqli_stmt_affected_rows ( mysqli_stmt $stmt )
// 90: function mysqli_stmt_close(); // prototype:mysqli_stmt_close ( mysqli_stmt $stmt )
// 91: function mysqli_stmt_data_seek(); // prototype:mysqli_stmt_data_seek ( mysqli_stmt $stmt , int $offset )
// 92: function mysqli_stmt_errno(); // prototype:mysqli_stmt_errno ( mysqli_stmt $stmt )
// 93: function mysqli_stmt_error(); // prototype:mysqli_stmt_error ( mysqli_stmt $stmt )
// 94: function mysqli_stmt_num_rows(); // prototype:mysqli_stmt_num_rows ( mysqli_stmt $stmt )
// 95: function mysqli_stmt_sqlstate(); // prototype:mysqli_stmt_sqlstate ( mysqli_stmt $stmt )
// 96: function mysqli_store_result(); // prototype:mysqli_store_result ( mysqli $link )
// 97: function mysqli_stmt_store_result(); // prototype:mysqli_stmt_store_result ( mysqli_stmt $stmt )
// 98: function mysqli_thread_id(); // prototype:mysqli_thread_id ( mysqli $link )
// 99: function mysqli_thread_safe(); // prototype:mysqli_thread_safe ( void )
// 100: function mysqli_use_result(); // prototype:mysqli_use_result ( mysqli $link )
// 101: function mysqli_warning_count(); // prototype:mysqli_warning_count ( mysqli $link )
// 102: function mysqli_bind_param(); // ALIAS of mysqli_stmt_bind_param():mysqli_bind_param(...)
// 103: function mysqli_bind_result(); // ALIAS of mysqli_stmt_bind_result():mysqli_bind_result(...)
// 104: function mysqli_client_encoding(); // ALIAS of mysqli_character_set_name():mysqli_client_encoding(...)
// 105: function mysqli_escape_string(); // ALIAS of mysqli_real_escape_string():mysqli_escape_string(...)
// 106: function mysqli_fetch(); // ALIAS of mysqli_stmt_fetch():mysqli_fetch(...)
// 107: function mysqli_param_count(); // ALIAS of mysqli_stmt_param_count():mysqli_param_count(...)
// 108: function mysqli_get_metadata(); // ALIAS of mysqli_stmt_result_metadata():mysqli_get_metadata(...)
// 109: function mysqli_send_long_data(); // ALIAS of mysqli_stmt_send_long_data():mysqli_send_long_data(...)
// 110: function mysqli_set_opt(); // ALIAS of mysqli_options():mysqli_set_opt(...)

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension mbstring
	define( 'MB_OVERLOAD_MAIL',1);
	define( 'MB_OVERLOAD_STRING',2);
	define( 'MB_OVERLOAD_REGEX',4);
	define( 'MB_CASE_UPPER',0);
	define( 'MB_CASE_LOWER',1);
	define( 'MB_CASE_TITLE',2);

/////////////////// ********** FUNCTIONS (67 total functions) ************ ///////////////////////////////

// 1: function mb_convert_case(); // prototype:mb_convert_case ( string $str , int $mode = MB_CASE_UPPER [, string $encoding = mb_internal_encoding() ] )
// 2: function mb_strtoupper(); // prototype:mb_strtoupper ( string $str [, string $encoding = mb_internal_encoding() ] )
// 3: function mb_strtolower(); // prototype:mb_strtolower ( string $str [, string $encoding = mb_internal_encoding() ] )
// 4: function mb_language(); // prototype:mb_language ([ string $language ] )
// 5: function mb_internal_encoding(); // prototype:mb_internal_encoding ([ string $encoding = mb_internal_encoding() ] )
// 6: function mb_http_input(); // prototype:mb_http_input ([ string $type = &quot;&quot; ] )
// 7: function mb_http_output(); // prototype:mb_http_output ([ string $encoding ] )
// 8: function mb_detect_order(); // prototype:mb_detect_order ([ mixed $encoding_list ] )
// 9: function mb_substitute_character(); // prototype:mb_substitute_character ([ mixed $substrchar ] )
// 10: function mb_parse_str(); // prototype:mb_parse_str ( string $encoded_string [, array &amp;$result ] )
// 11: function mb_output_handler(); // prototype:mb_output_handler ( string $contents , int $status )
// 12: function mb_preferred_mime_name(); // prototype:mb_preferred_mime_name ( string $encoding )
// 13: function mb_strlen(); // prototype:mb_strlen ( string $str [, string $encoding ] )
// 14: function mb_strpos(); // prototype:mb_strpos ( string $haystack , string $needle [, int $offset [, string $encoding ]] )
// 15: function mb_strrpos(); // prototype:mb_strrpos ( string $haystack , string $needle [, int $offset [, string $encoding ]] )
// 16: function mb_stripos(); // prototype:mb_stripos ( string $haystack , string $needle [, int $offset [, string $encoding ]] )
// 17: function mb_strripos(); // prototype:mb_strripos ( string $haystack , string $needle [, int $offset [, string $encoding ]] )
// 18: function mb_strstr(); // prototype:mb_strstr ( string $haystack , string $needle [, bool $part [, string $encoding ]] )
// 19: function mb_strrchr(); // prototype:mb_strrchr ( string $haystack , string $needle [, bool $part [, string $encoding ]] )
// 20: function mb_stristr(); // prototype:mb_stristr ( string $haystack , string $needle [, bool $part [, string $encoding ]] )
// 21: function mb_strrichr(); // prototype:mb_strrichr ( string $haystack , string $needle [, bool $part [, string $encoding ]] )
// 22: function mb_substr_count(); // prototype:mb_substr_count ( string $haystack , string $needle [, string $encoding ] )
// 23: function mb_substr(); // prototype:mb_substr ( string $str , int $start [, int $length [, string $encoding ]] )
// 24: function mb_strcut(); // prototype:mb_strcut ( string $str , int $start [, int $length [, string $encoding ]] )
// 25: function mb_strwidth(); // prototype:mb_strwidth ( string $str [, string $encoding ] )
// 26: function mb_strimwidth(); // prototype:mb_strimwidth ( string $str , int $start , int $width [, string $trimmarker [, string $encoding ]] )
// 27: function mb_convert_encoding(); // prototype:mb_convert_encoding ( string $str , string $to_encoding [, mixed $from_encoding ] )
// 28: function mb_detect_encoding(); // prototype:mb_detect_encoding ( string $str [, mixed $encoding_list = mb_detect_order() [, bool $strict = false ]] )
// 29: function mb_list_encodings(); // prototype:mb_list_encodings ( void )
// 30: function mb_convert_kana(); // prototype:mb_convert_kana ( string $str [, string $option [, string $encoding ]] )
// 31: function mb_encode_mimeheader(); // prototype:mb_encode_mimeheader ( string $str [, string $charset [, string $transfer_encoding [, string $linefeed [, int $indent ]]]] )
// 32: function mb_decode_mimeheader(); // prototype:mb_decode_mimeheader ( string $str )
// 33: function mb_convert_variables(); // prototype:mb_convert_variables ( string $to_encoding , mixed $from_encoding , mixed &amp;$vars [, mixed &amp;$... ] )
// 34: function mb_encode_numericentity(); // prototype:mb_encode_numericentity ( string $str , array $convmap , string $encoding )
// 35: function mb_decode_numericentity(); // prototype:mb_decode_numericentity ( string $str , array $convmap , string $encoding )
// 36: function mb_send_mail(); // prototype:mb_send_mail ( string $to , string $subject , string $message [, string $additional_headers = NULL [, string $additional_parameter = NULL ]] )
// 37: function mb_get_info(); // prototype:mb_get_info ([ string $type = &quot;all&quot; ] )
// 38: function mb_check_encoding(); // prototype:mb_check_encoding ([ string $var = NULL [, string $encoding = mb_internal_encoding() ]] )
// 39: function mb_regex_encoding(); // prototype:mb_regex_encoding ([ string $encoding ] )
// 40: function mb_regex_set_options(); // prototype:mb_regex_set_options ([ string $options = &quot;msr&quot; ] )
// 41: function mb_ereg(); // prototype:mb_ereg ( string $pattern , string $string [, array $regs ] )
// 42: function mb_eregi(); // prototype:mb_eregi ( string $pattern , string $string [, array $regs ] )
// 43: function mb_ereg_replace(); // prototype:mb_ereg_replace ( string $pattern , string $replacement , string $string [, string $option = &quot;msr&quot; ] )
// 44: function mb_eregi_replace(); // prototype:mb_eregi_replace ( string $pattern , string $replace , string $string [, string $option = &quot;msri&quot; ] )
// 45: function mb_split(); // prototype:mb_split ( string $pattern , string $string [, int $limit = -1 ] )
// 46: function mb_ereg_match(); // prototype:mb_ereg_match ( string $pattern , string $string [, string $option = &quot;msr&quot; ] )
// 47: function mb_ereg_search(); // prototype:mb_ereg_search ([ string $pattern [, string $option = &quot;ms&quot; ]] )
// 48: function mb_ereg_search_pos(); // prototype:mb_ereg_search_pos ([ string $pattern [, string $option = &quot;ms&quot; ]] )
// 49: function mb_ereg_search_regs(); // prototype:mb_ereg_search_regs ([ string $pattern [, string $option = &quot;ms&quot; ]] )
// 50: function mb_ereg_search_init(); // prototype:mb_ereg_search_init ( string $string [, string $pattern [, string $option = &quot;msr&quot; ]] )
// 51: function mb_ereg_search_getregs(); // prototype:mb_ereg_search_getregs ( void )
// 52: function mb_ereg_search_getpos(); // prototype:mb_ereg_search_getpos ( void )
// 53: function mb_ereg_search_setpos(); // prototype:mb_ereg_search_setpos ( int $position )
// 54:mbregex_encoding: has been marked as 'INTERNAL' - skipping...
// 55:mbereg: has been marked as 'INTERNAL' - skipping...
// 56:mberegi: has been marked as 'INTERNAL' - skipping...
// 57:mbereg_replace: has been marked as 'INTERNAL' - skipping...
// 58:mberegi_replace: has been marked as 'INTERNAL' - skipping...
// 59:mbsplit: has been marked as 'INTERNAL' - skipping...
// 60:mbereg_match: has been marked as 'INTERNAL' - skipping...
// 61:mbereg_search: has been marked as 'INTERNAL' - skipping...
// 62:mbereg_search_pos: has been marked as 'INTERNAL' - skipping...
// 63:mbereg_search_regs: has been marked as 'INTERNAL' - skipping...
// 64:mbereg_search_init: has been marked as 'INTERNAL' - skipping...
// 65:mbereg_search_getregs: has been marked as 'INTERNAL' - skipping...
// 66:mbereg_search_getpos: has been marked as 'INTERNAL' - skipping...
// 67:mbereg_search_setpos: has been marked as 'INTERNAL' - skipping...

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension date
//@php_CORE4.xml#DateTime
 class DateTime   {

// Constants
	 const ATOM='Y-m-d\\TH:i:sP';
	 const COOKIE='l, d-M-y H:i:s T';
	 const ISO8601='Y-m-d\\TH:i:sO';
	 const RFC822='D, d M y H:i:s O';
	 const RFC850='l, d-M-y H:i:s T';
	 const RFC1036='D, d M y H:i:s O';
	 const RFC1123='D, d M Y H:i:s O';
	 const RFC2822='D, d M Y H:i:s O';
	 const RFC3339='Y-m-d\\TH:i:sP';
	 const RSS='D, d M Y H:i:s O';
	 const W3C='Y-m-d\\TH:i:sP';

// Properties

// Methods
 //@php_CORE4.xml#DateTime::__construct
	public function __construct($time, DateTimeZone $timezone ){ }
 //@php_CORE4.xml#DateTime::format
	public function format($format){ }
 //@php_CORE4.xml#DateTime::modify
	public function modify($relative_format){ /* in PHP 5.3: return new DateTime(); */}
 //@php_CORE4.xml#DateTime::getTimezone
	public function getTimezone(){ return new DateTimeZone();}
 //@php_CORE4.xml#DateTime::setTimezone
	public function setTimezone(DateTimeZone $timezone){ /* in PHP 5.3: return new DateTime(); */}
 //@php_CORE4.xml#DateTime::getOffset
	public function getOffset(){ }
 //@php_CORE4.xml#DateTime::setTime
	public function setTime($hour, $minute, $second ){ /* in PHP 5.3: return new DateTime(); */}
 //@php_CORE4.xml#DateTime::setDate
	public function setDate($year, $month, $day){ /* in PHP 5.3: return new DateTime(); */}
 //@php_CORE4.xml#DateTime::setISODate
	public function setISODate($year, $week, $day){ /* in PHP 5.3: return new DateTime(); */}

}

////////////////////////////////////////////////////////////////////////////////////

//@php_CORE4.xml#DateTimeZone
 class DateTimeZone   {

// Constants
/* These were only defined in PHP 5.3
const AFRICA = 1 ;
const AMERICA = 2 ;
const ANTARCTICA = 4 ;
const ARCTIC = 8 ;
const ASIA = 16 ;
const ATLANTIC = 32 ;
const AUSTRALIA = 64 ;
const EUROPE = 128 ;
const INDIAN = 256 ;
const PACIFIC = 512 ;
const UTC = 1024 ;
const ALL = 2047 ;
const ALL_WITH_BC = 4095 ;
const PER_COUNTRY = 4096 ;
*/
// Properties

// Methods
 //@php_CORE4.xml#DateTimeZone::__construct
	public function __construct($timezone){ }
 //@php_CORE4.xml#DateTimeZone::getName
	public function getName(){ }
 //@php_CORE4.xml#DateTimeZone::getOffset
	public function getOffset( DateTime $datetime){ }
 //@php_CORE4.xml#DateTimeZone::getTransitions
	public function getTransitions(/* added in PHP 5.3: $timestamp_begin, $timestamp_end*/){ return array();}
 //@php_CORE4.xml#DateTimeZone::listAbbreviations
	public static function listAbbreviations(){ return array();}
 //@php_CORE4.xml#DateTimeZone::listIdentifiers
	public static function listIdentifiers(/*added in PHP 5.3: $what, $country*/){ return array();}
}

////////////////////////////////////////////////////////////////////////////////////

	define( 'DATE_ATOM','Y-m-d\\TH:i:sP');
	define( 'DATE_COOKIE','l, d-M-y H:i:s T');
	define( 'DATE_ISO8601','Y-m-d\\TH:i:sO');
	define( 'DATE_RFC822','D, d M y H:i:s O');
	define( 'DATE_RFC850','l, d-M-y H:i:s T');
	define( 'DATE_RFC1036','D, d M y H:i:s O');
	define( 'DATE_RFC1123','D, d M Y H:i:s O');
	define( 'DATE_RFC2822','D, d M Y H:i:s O');
	define( 'DATE_RFC3339','Y-m-d\\TH:i:sP');
	define( 'DATE_RSS','D, d M Y H:i:s O');
	define( 'DATE_W3C','Y-m-d\\TH:i:sP');
	define( 'SUNFUNCS_RET_TIMESTAMP',0);
	define( 'SUNFUNCS_RET_STRING',1);
	define( 'SUNFUNCS_RET_DOUBLE',2);

/////////////////// ********** FUNCTIONS (34 total functions) ************ ///////////////////////////////

// 1: function strtotime(); // prototype:strtotime ( string $time [, int $now ] )
// 2: function date(); // prototype:date ( string $format [, int $timestamp ] )
// 3: function idate(); // prototype:idate ( string $format [, int $timestamp = time() ] )
// 4: function gmdate(); // prototype:gmdate ( string $format [, int $timestamp ] )
// 5: function mktime(); // prototype:mktime ([ int $hour = date(&quot;H&quot;) [, int $minute = date(&quot;i&quot;) [, int $second = date(&quot;s&quot;) [, int $month = date(&quot;n&quot;) [, int $day = date(&quot;j&quot;) [, int $year = date(&quot;Y&quot;) [, int $is_dst = -1 ]]]]]]] )
// 6: function gmmktime(); // prototype:gmmktime ([ int $hour = gmdate(&quot;H&quot;) [, int $minute = gmdate(&quot;i&quot;) [, int $second = gmdate(&quot;s&quot;) [, int $month = gmdate(&quot;n&quot;) [, int $day = gmdate(&quot;j&quot;) [, int $year = gmdate(&quot;Y&quot;) [, int $is_dst = -1 ]]]]]]] )
// 7: function checkdate(); // prototype:checkdate ( int $month , int $day , int $year )
// 8: function strftime(); // prototype:strftime ( string $format [, int $timestamp = time() ] )
// 9: function gmstrftime(); // prototype:gmstrftime ( string $format [, int $timestamp = time() ] )
// 10: function time(); // prototype:time ( void )
// 11: function localtime(); // prototype:localtime ([ int $timestamp = time() [, bool $is_associative = false ]] )
// 12: function getdate(); // prototype:getdate ([ int $timestamp = time() ] )
// 13: function date_create(); // prototype:date_create ([ string $time = &quot;now&quot; [, DateTimeZone $timezone = NULL ]] )
// 14: function date_parse(); // prototype:date_parse ( string $date )
// 15: function date_format(); // ALIAS of DateTime::format:date_format(...)
// 16: function date_modify(); // ALIAS of DateTime::modify:date_modify(...)
// 17: function date_timezone_get(); // ALIAS of DateTime::getTimezone:date_timezone_get(...)
// 18: function date_timezone_set(); // ALIAS of DateTime::setTimezone:date_timezone_set(...)
// 19: function date_offset_get(); // ALIAS of DateTime::getOffset:date_offset_get(...)
// 20: function date_time_set(); // ALIAS of DateTime::setTime:date_time_set(...)
// 21: function date_date_set(); // ALIAS of DateTime::setDate:date_date_set(...)
// 22: function date_isodate_set(); // ALIAS of DateTime::setISODate:date_isodate_set(...)
// 23: function timezone_open(); // prototype:timezone_open ( string $timezone )
// 24: function timezone_name_get(); // ALIAS of DateTimeZone::getName:timezone_name_get(...)
// 25: function timezone_name_from_abbr(); // prototype:timezone_name_from_abbr ( string $abbr [, int $gmtOffset = -1 [, int $isdst = -1 ]] )
// 26: function timezone_offset_get(); // ALIAS of DateTimeZone::getOffset:timezone_offset_get(...)
// 27: function timezone_transitions_get(); // ALIAS of DateTimeZone::getTransitions:timezone_transitions_get(...)
// 28: function timezone_identifiers_list(); // ALIAS of DateTimeZone::listIdentifiers:timezone_identifiers_list(...)
// 29: function timezone_abbreviations_list(); // ALIAS of DateTimeZone::listAbbreviations:timezone_abbreviations_list(...)
// 30: function date_default_timezone_set(); // prototype:date_default_timezone_set ( string $timezone_identifier )
// 31: function date_default_timezone_get(); // prototype:date_default_timezone_get ( void )
// 32: function date_sunrise(); // prototype:date_sunrise ( int $timestamp [, int $format = SUNFUNCS_RET_STRING [, float $latitude = ini_get(&quot;date.default_latitude&quot;) [, float $longitude = ini_get(&quot;date.default_longitude&quot;) [, float $zenith = ini_get(&quot;date.sunrise_zenith&quot;) [, float $gmt_offset = 0 ]]]]] )
// 33: function date_sunset(); // prototype:date_sunset ( int $timestamp [, int $format = SUNFUNCS_RET_STRING [, float $latitude = ini_get(&quot;date.default_latitude&quot;) [, float $longitude = ini_get(&quot;date.default_longitude&quot;) [, float $zenith = ini_get(&quot;date.sunset_zenith&quot;) [, float $gmt_offset = 0 ]]]]] )
// 34: function date_sun_info(); // prototype:date_sun_info ( int $time , float $latitude , float $longitude )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
