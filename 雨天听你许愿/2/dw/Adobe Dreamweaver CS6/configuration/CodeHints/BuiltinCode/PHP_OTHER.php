<?php //Extension gmp
	define( 'GMP_ROUND_ZERO',0);
	define( 'GMP_ROUND_PLUSINF',1);
	define( 'GMP_ROUND_MINUSINF',2);
	define( 'GMP_VERSION','4.1.4');

/////////////////// ********** FUNCTIONS (40 total functions) ************ ///////////////////////////////

// 1: function gmp_init(); // prototype:gmp_init ( mixed $number [, int $base = 0 ] )
// 2: function gmp_intval(); // prototype:gmp_intval ( resource $gmpnumber )
// 3: function gmp_strval(); // prototype:gmp_strval ( resource $gmpnumber [, int $base ] )
// 4: function gmp_add(); // prototype:gmp_add ( resource $a , resource $b )
// 5: function gmp_sub(); // prototype:gmp_sub ( resource $a , resource $b )
// 6: function gmp_mul(); // prototype:gmp_mul ( resource $a , resource $b )
// 7: function gmp_div_qr(); // prototype:gmp_div_qr ( resource $n , resource $d [, int $round = GMP_ROUND_ZERO ] )
// 8: function gmp_div_q(); // prototype:gmp_div_q ( resource $a , resource $b [, int $round = GMP_ROUND_ZERO ] )
// 9: function gmp_div_r(); // prototype:gmp_div_r ( resource $n , resource $d [, int $round = GMP_ROUND_ZERO ] )
// 10: function gmp_div(); // ALIAS of gmp_div_q():gmp_div(...)
// 11: function gmp_mod(); // prototype:gmp_mod ( resource $n , resource $d )
// 12: function gmp_divexact(); // prototype:gmp_divexact ( resource $n , resource $d )
// 13: function gmp_neg(); // prototype:gmp_neg ( resource $a )
// 14: function gmp_abs(); // prototype:gmp_abs ( resource $a )
// 15: function gmp_fact(); // prototype:gmp_fact ( mixed $a )
// 16: function gmp_sqrt(); // prototype:gmp_sqrt ( resource $a )
// 17: function gmp_sqrtrem(); // prototype:gmp_sqrtrem ( resource $a )
// 18: function gmp_pow(); // prototype:gmp_pow ( resource $base , int $exp )
// 19: function gmp_powm(); // prototype:gmp_powm ( resource $base , resource $exp , resource $mod )
// 20: function gmp_perfect_square(); // prototype:gmp_perfect_square ( resource $a )
// 21: function gmp_prob_prime(); // prototype:gmp_prob_prime ( resource $a [, int $reps = 10 ] )
// 22: function gmp_gcd(); // prototype:gmp_gcd ( resource $a , resource $b )
// 23: function gmp_gcdext(); // prototype:gmp_gcdext ( resource $a , resource $b )
// 24: function gmp_invert(); // prototype:gmp_invert ( resource $a , resource $b )
// 25: function gmp_jacobi(); // prototype:gmp_jacobi ( resource $a , resource $p )
// 26: function gmp_legendre(); // prototype:gmp_legendre ( resource $a , resource $p )
// 27: function gmp_cmp(); // prototype:gmp_cmp ( resource $a , resource $b )
// 28: function gmp_sign(); // prototype:gmp_sign ( resource $a )
// 29: function gmp_random(); // prototype:gmp_random ([ int $limiter = 20 ] )
// 30: function gmp_and(); // prototype:gmp_and ( resource $a , resource $b )
// 31: function gmp_or(); // prototype:gmp_or ( resource $a , resource $b )
// 32: function gmp_com(); // prototype:gmp_com ( resource $a )
// 33: function gmp_xor(); // prototype:gmp_xor ( resource $a , resource $b )
// 34: function gmp_setbit(); // prototype:gmp_setbit ( resource $a , int $index [, bool $set_clear = true ] )
// 35: function gmp_clrbit(); // prototype:gmp_clrbit ( resource $a , int $index )
// 36: function gmp_scan0(); // prototype:gmp_scan0 ( resource $a , int $start )
// 37: function gmp_scan1(); // prototype:gmp_scan1 ( resource $a , int $start )
// 38: function gmp_popcount(); // prototype:gmp_popcount ( resource $a )
// 39: function gmp_hamdist(); // prototype:gmp_hamdist ( resource $a , resource $b )
// 40: function gmp_nextprime(); // prototype:gmp_nextprime ( int $a )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension calendar
	define( 'CAL_GREGORIAN',0);
	define( 'CAL_JULIAN',1);
	define( 'CAL_JEWISH',2);
	define( 'CAL_FRENCH',3);
	define( 'CAL_NUM_CALS',4);
	define( 'CAL_DOW_DAYNO',0);
	define( 'CAL_DOW_SHORT',1);
	define( 'CAL_DOW_LONG',2);
	define( 'CAL_MONTH_GREGORIAN_SHORT',0);
	define( 'CAL_MONTH_GREGORIAN_LONG',1);
	define( 'CAL_MONTH_JULIAN_SHORT',2);
	define( 'CAL_MONTH_JULIAN_LONG',3);
	define( 'CAL_MONTH_JEWISH',4);
	define( 'CAL_MONTH_FRENCH',5);
	define( 'CAL_EASTER_DEFAULT',0);
	define( 'CAL_EASTER_ROMAN',1);
	define( 'CAL_EASTER_ALWAYS_GREGORIAN',2);
	define( 'CAL_EASTER_ALWAYS_JULIAN',3);
	define( 'CAL_JEWISH_ADD_ALAFIM_GERESH',2);
	define( 'CAL_JEWISH_ADD_ALAFIM',4);
	define( 'CAL_JEWISH_ADD_GERESHAYIM',8);

/////////////////// ********** FUNCTIONS (18 total functions) ************ ///////////////////////////////

// 1: function jdtogregorian(); // prototype:jdtogregorian ( int $julianday )
// 2: function gregoriantojd(); // prototype:gregoriantojd ( int $month , int $day , int $year )
// 3: function jdtojulian(); // prototype:jdtojulian ( int $julianday )
// 4: function juliantojd(); // prototype:juliantojd ( int $month , int $day , int $year )
// 5: function jdtojewish(); // prototype:jdtojewish ( int $juliandaycount [, bool $hebrew = false [, int $fl = 0 ]] )
// 6: function jewishtojd(); // prototype:jewishtojd ( int $month , int $day , int $year )
// 7: function jdtofrench(); // prototype:jdtofrench ( int $juliandaycount )
// 8: function frenchtojd(); // prototype:frenchtojd ( int $month , int $day , int $year )
// 9: function jddayofweek(); // prototype:jddayofweek ( int $julianday [, int $mode = CAL_DOW_DAYNO ] )
// 10: function jdmonthname(); // prototype:jdmonthname ( int $julianday , int $mode )
// 11: function easter_date(); // prototype:easter_date ([ int $year ] )
// 12: function easter_days(); // prototype:easter_days ([ int $year [, int $method = CAL_EASTER_DEFAULT ]] )
// 13: function unixtojd(); // prototype:unixtojd ([ int $timestamp = time() ] )
// 14: function jdtounix(); // prototype:jdtounix ( int $jday )
// 15: function cal_to_jd(); // prototype:cal_to_jd ( int $calendar , int $month , int $day , int $year )
// 16: function cal_from_jd(); // prototype:cal_from_jd ( int $jd , int $calendar )
// 17: function cal_days_in_month(); // prototype:cal_days_in_month ( int $calendar , int $month , int $year )
// 18: function cal_info(); // prototype:cal_info ([ int $calendar = -1 ] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension bcmath

/////////////////// ********** FUNCTIONS (10 total functions) ************ ///////////////////////////////

// 1: function bcadd(); // prototype:bcadd ( string $left_operand , string $right_operand [, int $scale ] )
// 2: function bcsub(); // prototype:bcsub ( string $left_operand , string $right_operand [, int $scale ] )
// 3: function bcmul(); // prototype:bcmul ( string $left_operand , string $right_operand [, int $scale ] )
// 4: function bcdiv(); // prototype:bcdiv ( string $left_operand , string $right_operand [, int $scale ] )
// 5: function bcmod(); // prototype:bcmod ( string $left_operand , string $modulus )
// 6: function bcpow(); // prototype:bcpow ( string $left_operand , string $right_operand [, int $scale ] )
// 7: function bcsqrt(); // prototype:bcsqrt ( string $operand [, int $scale ] )
// 8: function bcscale(); // prototype:bcscale ( int $scale )
// 9: function bccomp(); // prototype:bccomp ( string $left_operand , string $right_operand [, int $scale ] )
// 10: function bcpowmod(); // prototype:bcpowmod ( string $left_operand , string $right_operand , string $modulus [, int $scale ] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension memcache
// WARNING: class Memcache is an undocummented class; 
 class Memcache   {
        public function connect($host , $port , $timeout){}
        public function pconnect($host , $port , $timeout){}
        public function addserver($host , $port , $persistent , $weight ,$timeout , $retry_interval , $status , $failure_callback , $timeoutms ){}
        public function setserverparams($host , $port , $timeout , $retry_interval , $status , $failure_callback  ){}
        public function getserverstatus($host , $port){}
        public function getversion(){}
        public function add($key , $var , $flag , $expire){}
        public function set($key , $var , $flag , $expire){}
        public function replace($key , $var , $flag , $expire){}
        public function get($key , &$flags){}
        public function delete($key , $timeout){}
        public function getstats($type , $slabid , $limit){ return array();}
        public function getextendedstats($type , $slabid , $limit){ return array();}
        public function setcompressthreshold($threshold, $min_savings){}
        public function increment( $key , $value){}
        public function decrement($key , $value){}
        public function close(){}
        public function flush(){}
}

////////////////////////////////////////////////////////////////////////////////////

	define( 'MEMCACHE_COMPRESSED',2);
	define( 'MEMCACHE_HAVE_SESSION',1);

/////////////////// ********** FUNCTIONS (19 total functions) ************ ///////////////////////////////

// 1: function memcache_connect(); // (x)prototype:NOT FOUND: prototype for memcache_connect!
// 2: function memcache_pconnect(); // (x)prototype:NOT FOUND: prototype for memcache_pconnect!
// 3: function memcache_add_server(); // (x)prototype:NOT FOUND: prototype for memcache_add_server!
// 4: function memcache_set_server_params(); // (x)prototype:NOT FOUND: prototype for memcache_set_server_params!
// 5: function memcache_get_server_status(); // (x)prototype:NOT FOUND: prototype for memcache_get_server_status!
// 6: function memcache_get_version(); // (x)prototype:NOT FOUND: prototype for memcache_get_version!
// 7: function memcache_add(); // (x)prototype:NOT FOUND: prototype for memcache_add!
// 8: function memcache_set(); // (x)prototype:NOT FOUND: prototype for memcache_set!
// 9: function memcache_replace(); // (x)prototype:NOT FOUND: prototype for memcache_replace!
// 10: function memcache_get(); // (x)prototype:NOT FOUND: prototype for memcache_get!
// 11: function memcache_delete(); // (x)prototype:NOT FOUND: prototype for memcache_delete!
// 12: function memcache_debug(); // prototype:memcache_debug ( bool $on_off )
// 13: function memcache_get_stats(); // (x)prototype:NOT FOUND: prototype for memcache_get_stats!
// 14: function memcache_get_extended_stats(); // (x)prototype:NOT FOUND: prototype for memcache_get_extended_stats!
// 15: function memcache_set_compress_threshold(); // (x)prototype:NOT FOUND: prototype for memcache_set_compress_threshold!
// 16: function memcache_increment(); // (x)prototype:NOT FOUND: prototype for memcache_increment!
// 17: function memcache_decrement(); // (x)prototype:NOT FOUND: prototype for memcache_decrement!
// 18: function memcache_close(); // (x)prototype:NOT FOUND: prototype for memcache_close!
// 19: function memcache_flush(); // (x)prototype:NOT FOUND: prototype for memcache_flush!

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension shmop

/////////////////// ********** FUNCTIONS (6 total functions) ************ ///////////////////////////////

// 1: function shmop_open(); // prototype:shmop_open ( int $key , string $flags , int $mode , int $size )
// 2: function shmop_read(); // prototype:shmop_read ( int $shmid , int $start , int $count )
// 3: function shmop_close(); // prototype:shmop_close ( int $shmid )
// 4: function shmop_size(); // prototype:shmop_size ( int $shmid )
// 5: function shmop_write(); // prototype:shmop_write ( int $shmid , string $data , int $offset )
// 6: function shmop_delete(); // prototype:shmop_delete ( int $shmid )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension exif
	define( 'EXIF_USE_MBSTRING',1);

/////////////////// ********** FUNCTIONS (5 total functions) ************ ///////////////////////////////

// 1: function exif_read_data(); // prototype:exif_read_data ( string $filename [, string $sections = NULL [, bool $arrays = false [, bool $thumbnail = false ]]] )
// 2: function read_exif_data(); // ALIAS of exif_read_data():read_exif_data(...)
// 3: function exif_tagname(); // prototype:exif_tagname ( int $index )
// 4: function exif_thumbnail(); // prototype:exif_thumbnail ( string $filename [, int &amp;$width [, int &amp;$height [, int &amp;$imagetype ]]] )
// 5: function exif_imagetype(); // prototype:exif_imagetype ( string $filename )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension ftp
	define( 'FTP_ASCII',1);
	define( 'FTP_TEXT',1);
	define( 'FTP_BINARY',2);
	define( 'FTP_IMAGE',2);
	define( 'FTP_AUTORESUME',-1);
	define( 'FTP_TIMEOUT_SEC',0);
	define( 'FTP_AUTOSEEK',1);
	define( 'FTP_FAILED',0);
	define( 'FTP_FINISHED',1);
	define( 'FTP_MOREDATA',2);

/////////////////// ********** FUNCTIONS (33 total functions) ************ ///////////////////////////////

// 1: function ftp_connect(); // prototype:ftp_connect ( string $host [, int $port = 21 [, int $timeout = 90 ]] )
// 2: function ftp_login(); // prototype:ftp_login ( resource $ftp_stream , string $username , string $password )
// 3: function ftp_pwd(); // prototype:ftp_pwd ( resource $ftp_stream )
// 4: function ftp_cdup(); // prototype:ftp_cdup ( resource $ftp_stream )
// 5: function ftp_chdir(); // prototype:ftp_chdir ( resource $ftp_stream , string $directory )
// 6: function ftp_exec(); // prototype:ftp_exec ( resource $ftp_stream , string $command )
// 7: function ftp_raw(); // prototype:ftp_raw ( resource $ftp_stream , string $command )
// 8: function ftp_mkdir(); // prototype:ftp_mkdir ( resource $ftp_stream , string $directory )
// 9: function ftp_rmdir(); // prototype:ftp_rmdir ( resource $ftp_stream , string $directory )
// 10: function ftp_chmod(); // prototype:ftp_chmod ( resource $ftp_stream , int $mode , string $filename )
// 11: function ftp_alloc(); // prototype:ftp_alloc ( resource $ftp_stream , int $filesize [, string &amp;$result ] )
// 12: function ftp_nlist(); // prototype:ftp_nlist ( resource $ftp_stream , string $directory )
// 13: function ftp_rawlist(); // prototype:ftp_rawlist ( resource $ftp_stream , string $directory [, bool $recursive = false ] )
// 14: function ftp_systype(); // prototype:ftp_systype ( resource $ftp_stream )
// 15: function ftp_pasv(); // prototype:ftp_pasv ( resource $ftp_stream , bool $pasv )
// 16: function ftp_get(); // prototype:ftp_get ( resource $ftp_stream , string $local_file , string $remote_file , int $mode [, int $resumepos = 0 ] )
// 17: function ftp_fget(); // prototype:ftp_fget ( resource $ftp_stream , resource $handle , string $remote_file , int $mode [, int $resumepos = 0 ] )
// 18: function ftp_put(); // prototype:ftp_put ( resource $ftp_stream , string $remote_file , string $local_file , int $mode [, int $startpos = 0 ] )
// 19: function ftp_fput(); // prototype:ftp_fput ( resource $ftp_stream , string $remote_file , resource $handle , int $mode [, int $startpos = 0 ] )
// 20: function ftp_size(); // prototype:ftp_size ( resource $ftp_stream , string $remote_file )
// 21: function ftp_mdtm(); // prototype:ftp_mdtm ( resource $ftp_stream , string $remote_file )
// 22: function ftp_rename(); // prototype:ftp_rename ( resource $ftp_stream , string $oldname , string $newname )
// 23: function ftp_delete(); // prototype:ftp_delete ( resource $ftp_stream , string $path )
// 24: function ftp_site(); // prototype:ftp_site ( resource $ftp_stream , string $command )
// 25: function ftp_close(); // prototype:ftp_close ( resource $ftp_stream )
// 26: function ftp_set_option(); // prototype:ftp_set_option ( resource $ftp_stream , int $option , mixed $value )
// 27: function ftp_get_option(); // prototype:ftp_get_option ( resource $ftp_stream , int $option )
// 28: function ftp_nb_fget(); // prototype:ftp_nb_fget ( resource $ftp_stream , resource $handle , string $remote_file , int $mode [, int $resumepos = 0 ] )
// 29: function ftp_nb_get(); // prototype:ftp_nb_get ( resource $ftp_stream , string $local_file , string $remote_file , int $mode [, int $resumepos = 0 ] )
// 30: function ftp_nb_continue(); // prototype:ftp_nb_continue ( resource $ftp_stream )
// 31: function ftp_nb_put(); // prototype:ftp_nb_put ( resource $ftp_stream , string $remote_file , string $local_file , int $mode [, int $startpos = 0 ] )
// 32: function ftp_nb_fput(); // prototype:ftp_nb_fput ( resource $ftp_stream , string $remote_file , resource $handle , int $mode [, int $startpos = 0 ] )
// 33: function ftp_quit(); // ALIAS of ftp_close():ftp_quit(...)

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension gettext

/////////////////// ********** FUNCTIONS (10 total functions) ************ ///////////////////////////////

// 1: function textdomain(); // prototype:textdomain ( string $text_domain )
// 2: function gettext(); // prototype:gettext ( string $message )
// 3:_: has been marked as 'INTERNAL' - skipping...
// 4: function dgettext(); // prototype:dgettext ( string $domain , string $message )
// 5: function dcgettext(); // prototype:dcgettext ( string $domain , string $message , int $category )
// 6: function bindtextdomain(); // prototype:bindtextdomain ( string $domain , string $directory )
// 7: function ngettext(); // prototype:ngettext ( string $msgid1 , string $msgid2 , int $n )
// 8: function dngettext(); // prototype:dngettext ( string $domain , string $msgid1 , string $msgid2 , int $n )
// 9: function dcngettext(); // prototype:dcngettext ( string $domain , string $msgid1 , string $msgid2 , int $n , int $category )
// 10: function bind_textdomain_codeset(); // prototype:bind_textdomain_codeset ( string $domain , string $codeset )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension tidy
//@php_OTHER.xml#Tidy
 class tidy   {

// Constants

// Properties

// Methods
 //@php_OTHER.xml#tidy_getopt
	public function getOpt($option){ }
 //@php_OTHER.xml#tidy_clean_repair
	public function cleanRepair(){ }
 //@php_OTHER.xml#tidy_parse_file
	public function parseFile($filename , $config , $encoding , $use_include_path = false){  }
 //@php_OTHER.xml#tidy_parse_string
	public function parseString($input, $config , $encoding){ }
 //@php_OTHER.xml#tidy_repair_string
	public function repairString($data, $config , $encoding){ }
 //@php_OTHER.xml#tidy_repair_file
	public function repairFile($filename , $config , $encoding , $use_include_path = false){ }
// function diagnose() NOT FOUND
 //@php_OTHER.xml#tidy_get_release
	public function getRelease(){ }
 //@php_OTHER.xml#tidy_get_config
	public function getConfig(){ return array(); }
 //@php_OTHER.xml#tidy_get_status
	public function getStatus(){ }
 //@php_OTHER.xml#tidy_get_html_ver
	public function getHtmlVer(){ }
 //@php_OTHER.xml#tidy_is_xhtml
	public function isXhtml(){ }
 //@php_OTHER.xml#tidy_is_xml
	public function isXml(){ }
 //@php_OTHER.xml#tidy_get_root
	public function root(){return new tidyNode(); }
 //@php_OTHER.xml#tidy_get_head
	public function head(){return new tidyNode(); }
 //@php_OTHER.xml#tidy_get_html
	public function html(){return new tidyNode(); }
 //@php_OTHER.xml#tidy_get_body
	public function body(){return new tidyNode(); }
 //@php_OTHER.xml#tidy::__construct
	public function __construct($filename , $config , $encoding , $use_include_path = false){ }
}

////////////////////////////////////////////////////////////////////////////////////

//@php_OTHER.xml#TidyNode
final class tidyNode   {

// Constants

// Properties
public $value;
public $name;
public $type;
public $line;
public $column;
public $proprietary;
public $id;
public $attribute= array();
public $child=array();
// Methods
 //@php_OTHER.xml#tidyNode::hasChildren
	public function hasChildren(){ }
 //@php_OTHER.xml#tidyNode::hasSiblings
	public function hasSiblings(){ }
 //@php_OTHER.xml#tidyNode::isComment
	public function isComment(){ }
 //@php_OTHER.xml#tidyNode::isHtml
	public function isHtml(){ }
 //@php_OTHER.xml#tidyNode::isText
	public function isText(){ }
 //@php_OTHER.xml#tidyNode::isJste
	public function isJste(){ }
 //@php_OTHER.xml#tidyNode::isAsp
	public function isAsp(){ }
 //@php_OTHER.xml#tidyNode::isPhp
	public function isPhp(){ }
 //@php_OTHER.xml#tidyNode::getParent
	public function getParent(){ return new tidyNode();}
}

////////////////////////////////////////////////////////////////////////////////////

	define( 'TIDY_TAG_UNKNOWN',0);
	define( 'TIDY_TAG_A',1);
	define( 'TIDY_TAG_ABBR',2);
	define( 'TIDY_TAG_ACRONYM',3);
	define( 'TIDY_TAG_ADDRESS',4);
	define( 'TIDY_TAG_ALIGN',5);
	define( 'TIDY_TAG_APPLET',6);
	define( 'TIDY_TAG_AREA',7);
	define( 'TIDY_TAG_B',8);
	define( 'TIDY_TAG_BASE',9);
	define( 'TIDY_TAG_BASEFONT',10);
	define( 'TIDY_TAG_BDO',11);
	define( 'TIDY_TAG_BGSOUND',12);
	define( 'TIDY_TAG_BIG',13);
	define( 'TIDY_TAG_BLINK',14);
	define( 'TIDY_TAG_BLOCKQUOTE',15);
	define( 'TIDY_TAG_BODY',16);
	define( 'TIDY_TAG_BR',17);
	define( 'TIDY_TAG_BUTTON',18);
	define( 'TIDY_TAG_CAPTION',19);
	define( 'TIDY_TAG_CENTER',20);
	define( 'TIDY_TAG_CITE',21);
	define( 'TIDY_TAG_CODE',22);
	define( 'TIDY_TAG_COL',23);
	define( 'TIDY_TAG_COLGROUP',24);
	define( 'TIDY_TAG_COMMENT',25);
	define( 'TIDY_TAG_DD',26);
	define( 'TIDY_TAG_DEL',27);
	define( 'TIDY_TAG_DFN',28);
	define( 'TIDY_TAG_DIR',29);
	define( 'TIDY_TAG_DIV',30);
	define( 'TIDY_TAG_DL',31);
	define( 'TIDY_TAG_DT',32);
	define( 'TIDY_TAG_EM',33);
	define( 'TIDY_TAG_EMBED',34);
	define( 'TIDY_TAG_FIELDSET',35);
	define( 'TIDY_TAG_FONT',36);
	define( 'TIDY_TAG_FORM',37);
	define( 'TIDY_TAG_FRAME',38);
	define( 'TIDY_TAG_FRAMESET',39);
	define( 'TIDY_TAG_H1',40);
	define( 'TIDY_TAG_H2',41);
	define( 'TIDY_TAG_H3',42);
	define( 'TIDY_TAG_H4',43);
	define( 'TIDY_TAG_H5',44);
	define( 'TIDY_TAG_H6',45);
	define( 'TIDY_TAG_HEAD',46);
	define( 'TIDY_TAG_HR',47);
	define( 'TIDY_TAG_HTML',48);
	define( 'TIDY_TAG_I',49);
	define( 'TIDY_TAG_IFRAME',50);
	define( 'TIDY_TAG_ILAYER',51);
	define( 'TIDY_TAG_IMG',52);
	define( 'TIDY_TAG_INPUT',53);
	define( 'TIDY_TAG_INS',54);
	define( 'TIDY_TAG_ISINDEX',55);
	define( 'TIDY_TAG_KBD',56);
	define( 'TIDY_TAG_KEYGEN',57);
	define( 'TIDY_TAG_LABEL',58);
	define( 'TIDY_TAG_LAYER',59);
	define( 'TIDY_TAG_LEGEND',60);
	define( 'TIDY_TAG_LI',61);
	define( 'TIDY_TAG_LINK',62);
	define( 'TIDY_TAG_LISTING',63);
	define( 'TIDY_TAG_MAP',64);
	define( 'TIDY_TAG_MARQUEE',65);
	define( 'TIDY_TAG_MENU',66);
	define( 'TIDY_TAG_META',67);
	define( 'TIDY_TAG_MULTICOL',68);
	define( 'TIDY_TAG_NOBR',69);
	define( 'TIDY_TAG_NOEMBED',70);
	define( 'TIDY_TAG_NOFRAMES',71);
	define( 'TIDY_TAG_NOLAYER',72);
	define( 'TIDY_TAG_NOSAVE',73);
	define( 'TIDY_TAG_NOSCRIPT',74);
	define( 'TIDY_TAG_OBJECT',75);
	define( 'TIDY_TAG_OL',76);
	define( 'TIDY_TAG_OPTGROUP',77);
	define( 'TIDY_TAG_OPTION',78);
	define( 'TIDY_TAG_P',79);
	define( 'TIDY_TAG_PARAM',80);
	define( 'TIDY_TAG_PLAINTEXT',81);
	define( 'TIDY_TAG_PRE',82);
	define( 'TIDY_TAG_Q',83);
	define( 'TIDY_TAG_RB',84);
	define( 'TIDY_TAG_RBC',85);
	define( 'TIDY_TAG_RP',86);
	define( 'TIDY_TAG_RT',87);
	define( 'TIDY_TAG_RTC',88);
	define( 'TIDY_TAG_RUBY',89);
	define( 'TIDY_TAG_S',90);
	define( 'TIDY_TAG_SAMP',91);
	define( 'TIDY_TAG_SCRIPT',92);
	define( 'TIDY_TAG_SELECT',93);
	define( 'TIDY_TAG_SERVER',94);
	define( 'TIDY_TAG_SERVLET',95);
	define( 'TIDY_TAG_SMALL',96);
	define( 'TIDY_TAG_SPACER',97);
	define( 'TIDY_TAG_SPAN',98);
	define( 'TIDY_TAG_STRIKE',99);
	define( 'TIDY_TAG_STRONG',100);
	define( 'TIDY_TAG_STYLE',101);
	define( 'TIDY_TAG_SUB',102);
	define( 'TIDY_TAG_SUP',103);
	define( 'TIDY_TAG_TABLE',104);
	define( 'TIDY_TAG_TBODY',105);
	define( 'TIDY_TAG_TD',106);
	define( 'TIDY_TAG_TEXTAREA',107);
	define( 'TIDY_TAG_TFOOT',108);
	define( 'TIDY_TAG_TH',109);
	define( 'TIDY_TAG_THEAD',110);
	define( 'TIDY_TAG_TITLE',111);
	define( 'TIDY_TAG_TR',112);
	define( 'TIDY_TAG_TT',113);
	define( 'TIDY_TAG_U',114);
	define( 'TIDY_TAG_UL',115);
	define( 'TIDY_TAG_VAR',116);
	define( 'TIDY_TAG_WBR',117);
	define( 'TIDY_TAG_XMP',118);
	define( 'TIDY_NODETYPE_ROOT',0);
	define( 'TIDY_NODETYPE_DOCTYPE',1);
	define( 'TIDY_NODETYPE_COMMENT',2);
	define( 'TIDY_NODETYPE_PROCINS',3);
	define( 'TIDY_NODETYPE_TEXT',4);
	define( 'TIDY_NODETYPE_START',5);
	define( 'TIDY_NODETYPE_END',6);
	define( 'TIDY_NODETYPE_STARTEND',7);
	define( 'TIDY_NODETYPE_CDATA',8);
	define( 'TIDY_NODETYPE_SECTION',9);
	define( 'TIDY_NODETYPE_ASP',10);
	define( 'TIDY_NODETYPE_JSTE',11);
	define( 'TIDY_NODETYPE_PHP',12);
	define( 'TIDY_NODETYPE_XMLDECL',13);

/////////////////// ********** FUNCTIONS (24 total functions) ************ ///////////////////////////////

// 1: function tidy_getopt(); // prototype:tidy_getopt ( tidy $object , string $option )
// 2: function tidy_parse_string(); // prototype:tidy_parse_string ( string $input [, mixed $config [, string $encoding ]] )
// 3: function tidy_parse_file(); // prototype:tidy_parse_file ( string $filename [, mixed $config [, string $encoding [, bool $use_include_path = false ]]] )
// 4: function tidy_get_output(); // prototype:tidy_get_output ( tidy $object )
// 5: function tidy_get_error_buffer(); // prototype:tidy_get_error_buffer ( tidy $object )
// 6: function tidy_clean_repair(); // prototype:tidy_clean_repair ( tidy $object )
// 7: function tidy_repair_string(); // prototype:tidy_repair_string ( string $data [, mixed $config [, string $encoding ]] )
// 8: function tidy_repair_file(); // prototype:tidy_repair_file ( string $filename [, mixed $config [, string $encoding [, bool $use_include_path = false ]]] )
// 9: function tidy_diagnose(); // prototype:tidy_diagnose ( tidy $object )
// 10: function tidy_get_release(); // prototype:tidy_get_release ( void )
// 11: function tidy_get_config(); // prototype:tidy_get_config ( tidy $object )
// 12: function tidy_get_status(); // prototype:tidy_get_status ( tidy $object )
// 13: function tidy_get_html_ver(); // prototype:tidy_get_html_ver ( tidy $object )
// 14: function tidy_is_xhtml(); // prototype:tidy_is_xhtml ( tidy $object )
// 15: function tidy_is_xml(); // prototype:tidy_is_xml ( tidy $object )
// 16: function tidy_error_count(); // prototype:tidy_error_count ( tidy $object )
// 17: function tidy_warning_count(); // prototype:tidy_warning_count ( tidy $object )
// 18: function tidy_access_count(); // prototype:tidy_access_count ( tidy $object )
// 19: function tidy_config_count(); // prototype:tidy_config_count ( tidy $object )
// 20: function tidy_get_root(); // prototype:tidy_get_root ( tidy $object )
// 21: function tidy_get_head(); // prototype:tidy_get_head ( tidy $object )
// 22: function tidy_get_html(); // prototype:tidy_get_html ( tidy $object )
// 23: function tidy_get_body(); // prototype:tidy_get_body ( tidy $object )
// 24: function ob_tidyhandler(); // prototype:ob_tidyhandler ( string $input [, int $mode ] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension mime_magic

/////////////////// ********** FUNCTIONS (1 total functions) ************ ///////////////////////////////

// 1: function mime_content_type(); // prototype:mime_content_type ( string $filename )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension imap
	define( 'NIL',0);
	define( 'IMAP_OPENTIMEOUT',1);
	define( 'IMAP_READTIMEOUT',2);
	define( 'IMAP_WRITETIMEOUT',3);
	define( 'IMAP_CLOSETIMEOUT',4);
	define( 'OP_DEBUG',1);
	define( 'OP_READONLY',2);
	define( 'OP_ANONYMOUS',4);
	define( 'OP_SHORTCACHE',8);
	define( 'OP_SILENT',16);
	define( 'OP_PROTOTYPE',32);
	define( 'OP_HALFOPEN',64);
	define( 'OP_EXPUNGE',128);
	define( 'OP_SECURE',256);
	define( 'CL_EXPUNGE',32768);
	define( 'FT_UID',1);
	define( 'FT_PEEK',2);
	define( 'FT_NOT',4);
	define( 'FT_INTERNAL',8);
	define( 'FT_PREFETCHTEXT',32);
	define( 'ST_UID',1);
	define( 'ST_SILENT',2);
	define( 'ST_SET',4);
	define( 'CP_UID',1);
	define( 'CP_MOVE',2);
	define( 'SE_UID',1);
	define( 'SE_FREE',2);
	define( 'SE_NOPREFETCH',4);
	define( 'SO_FREE',8);
	define( 'SO_NOSERVER',16);
	define( 'SA_MESSAGES',1);
	define( 'SA_RECENT',2);
	define( 'SA_UNSEEN',4);
	define( 'SA_UIDNEXT',8);
	define( 'SA_UIDVALIDITY',16);
	define( 'SA_ALL',31);
	define( 'LATT_NOINFERIORS',1);
	define( 'LATT_NOSELECT',2);
	define( 'LATT_MARKED',4);
	define( 'LATT_UNMARKED',8);
	define( 'LATT_REFERRAL',16);
	define( 'LATT_HASCHILDREN',32);
	define( 'LATT_HASNOCHILDREN',64);
	define( 'SORTDATE',0);
	define( 'SORTARRIVAL',1);
	define( 'SORTFROM',2);
	define( 'SORTSUBJECT',3);
	define( 'SORTTO',4);
	define( 'SORTCC',5);
	define( 'SORTSIZE',6);
	define( 'TYPETEXT',0);
	define( 'TYPEMULTIPART',1);
	define( 'TYPEMESSAGE',2);
	define( 'TYPEAPPLICATION',3);
	define( 'TYPEAUDIO',4);
	define( 'TYPEIMAGE',5);
	define( 'TYPEVIDEO',6);
	define( 'TYPEMODEL',7);
	define( 'TYPEOTHER',8);
	define( 'ENC7BIT',0);
	define( 'ENC8BIT',1);
	define( 'ENCBINARY',2);
	define( 'ENCBASE64',3);
	define( 'ENCQUOTEDPRINTABLE',4);
	define( 'ENCOTHER',5);

/////////////////// ********** FUNCTIONS (70 total functions) ************ ///////////////////////////////

// 1: function imap_open(); // prototype:imap_open ( string $mailbox , string $username , string $password [, int $options = NIL [, int $n_retries = 0 ]] )
// 2: function imap_reopen(); // prototype:imap_reopen ( resource $imap_stream , string $mailbox [, int $options = 0 [, int $n_retries = 0 ]] )
// 3: function imap_close(); // prototype:imap_close ( resource $imap_stream [, int $flag = 0 ] )
// 4: function imap_num_msg(); // prototype:imap_num_msg ( resource $imap_stream )
// 5: function imap_num_recent(); // prototype:imap_num_recent ( resource $imap_stream )
// 6: function imap_headers(); // prototype:imap_headers ( resource $imap_stream )
// 7: function imap_headerinfo(); // prototype:imap_headerinfo ( resource $imap_stream , int $msg_number [, int $fromlength = 0 [, int $subjectlength = 0 [, string $defaulthost = NULL ]]] )
// 8: function imap_rfc822_parse_headers(); // prototype:imap_rfc822_parse_headers ( string $headers [, string $defaulthost = &quot;UNKNOWN&quot; ] )
// 9: function imap_rfc822_write_address(); // prototype:imap_rfc822_write_address ( string $mailbox , string $host , string $personal )
// 10: function imap_rfc822_parse_adrlist(); // prototype:imap_rfc822_parse_adrlist ( string $address , string $default_host )
// 11: function imap_body(); // prototype:imap_body ( resource $imap_stream , int $msg_number [, int $options = 0 ] )
// 12: function imap_bodystruct(); // prototype:imap_bodystruct ( resource $imap_stream , int $msg_number , string $section )
// 13: function imap_fetchbody(); // prototype:imap_fetchbody ( resource $imap_stream , int $msg_number , string $section [, int $options = 0 ] )
// 14: function imap_savebody(); // prototype:imap_savebody ( resource $imap_stream , mixed $file , int $msg_number [, string $part_number = &quot;&quot; [, int $options = 0 ]] )
// 15: function imap_fetchheader(); // prototype:imap_fetchheader ( resource $imap_stream , int $msg_number [, int $options = 0 ] )
// 16: function imap_fetchstructure(); // prototype:imap_fetchstructure ( resource $imap_stream , int $msg_number [, int $options = 0 ] )
// 17: function imap_expunge(); // prototype:imap_expunge ( resource $imap_stream )
// 18: function imap_delete(); // prototype:imap_delete ( resource $imap_stream , int $msg_number [, int $options = 0 ] )
// 19: function imap_undelete(); // prototype:imap_undelete ( resource $imap_stream , int $msg_number [, int $flags = 0 ] )
// 20: function imap_check(); // prototype:imap_check ( resource $imap_stream )
// 21: function imap_mail_copy(); // prototype:imap_mail_copy ( resource $imap_stream , string $msglist , string $mailbox [, int $options = 0 ] )
// 22: function imap_mail_move(); // prototype:imap_mail_move ( resource $imap_stream , string $msglist , string $mailbox [, int $options = 0 ] )
// 23: function imap_mail_compose(); // prototype:imap_mail_compose ( array $envelope , array $body )
// 24: function imap_createmailbox(); // prototype:imap_createmailbox ( resource $imap_stream , string $mailbox )
// 25: function imap_renamemailbox(); // prototype:imap_renamemailbox ( resource $imap_stream , string $old_mbox , string $new_mbox )
// 26: function imap_deletemailbox(); // prototype:imap_deletemailbox ( resource $imap_stream , string $mailbox )
// 27: function imap_subscribe(); // prototype:imap_subscribe ( resource $imap_stream , string $mailbox )
// 28: function imap_unsubscribe(); // prototype:imap_unsubscribe ( resource $imap_stream , string $mailbox )
// 29: function imap_append(); // prototype:imap_append ( resource $imap_stream , string $mailbox , string $message [, string $options = NULL ] )
// 30: function imap_ping(); // prototype:imap_ping ( resource $imap_stream )
// 31: function imap_base64(); // prototype:imap_base64 ( string $text )
// 32: function imap_qprint(); // prototype:imap_qprint ( string $string )
// 33: function imap_8bit(); // prototype:imap_8bit ( string $string )
// 34: function imap_binary(); // prototype:imap_binary ( string $string )
// 35: function imap_utf8(); // prototype:imap_utf8 ( string $mime_encoded_text )
// 36: function imap_status(); // prototype:imap_status ( resource $imap_stream , string $mailbox , int $options )
// 37: function imap_mailboxmsginfo(); // prototype:imap_mailboxmsginfo ( resource $imap_stream )
// 38: function imap_setflag_full(); // prototype:imap_setflag_full ( resource $imap_stream , string $sequence , string $flag [, int $options = NIL ] )
// 39: function imap_clearflag_full(); // prototype:imap_clearflag_full ( resource $imap_stream , string $sequence , string $flag [, int $options = 0 ] )
// 40: function imap_sort(); // prototype:imap_sort ( resource $imap_stream , int $criteria , int $reverse [, int $options = 0 [, string $search_criteria = NULL [, string $charset = NIL ]]] )
// 41: function imap_uid(); // prototype:imap_uid ( resource $imap_stream , int $msg_number )
// 42: function imap_msgno(); // prototype:imap_msgno ( resource $imap_stream , int $uid )
// 43: function imap_list(); // prototype:imap_list ( resource $imap_stream , string $ref , string $pattern )
// 44: function imap_lsub(); // prototype:imap_lsub ( resource $imap_stream , string $ref , string $pattern )
// 45: function imap_fetch_overview(); // prototype:imap_fetch_overview ( resource $imap_stream , string $sequence [, int $options = 0 ] )
// 46: function imap_alerts(); // prototype:imap_alerts ( void )
// 47: function imap_errors(); // prototype:imap_errors ( void )
// 48: function imap_last_error(); // prototype:imap_last_error ( void )
// 49: function imap_search(); // prototype:imap_search ( resource $imap_stream , string $criteria [, int $options = SE_FREE [, string $charset = NIL ]] )
// 50: function imap_utf7_decode(); // prototype:imap_utf7_decode ( string $text )
// 51: function imap_utf7_encode(); // prototype:imap_utf7_encode ( string $data )
// 52: function imap_mime_header_decode(); // prototype:imap_mime_header_decode ( string $text )
// 53: function imap_thread(); // prototype:imap_thread ( resource $imap_stream [, int $options = SE_FREE ] )
// 54: function imap_timeout(); // prototype:imap_timeout ( int $timeout_type [, int $timeout = -1 ] )
// 55: function imap_get_quota(); // prototype:imap_get_quota ( resource $imap_stream , string $quota_root )
// 56: function imap_get_quotaroot(); // prototype:imap_get_quotaroot ( resource $imap_stream , string $quota_root )
// 57: function imap_set_quota(); // prototype:imap_set_quota ( resource $imap_stream , string $quota_root , int $quota_limit )
// 58: function imap_setacl(); // prototype:imap_setacl ( resource $imap_stream , string $mailbox , string $id , string $rights )
// 59: function imap_getacl(); // prototype:imap_getacl ( resource $imap_stream , string $mailbox )
// 60: function imap_mail(); // prototype:imap_mail ( string $to , string $subject , string $message [, string $additional_headers = NULL [, string $cc = NULL [, string $bcc = NULL [, string $rpath = NULL ]]]] )
// 61: function imap_header(); // ALIAS of imap_headerinfo():imap_header(...)
// 62: function imap_listmailbox(); // ALIAS of imap_list():imap_listmailbox(...)
// 63: function imap_getmailboxes(); // prototype:imap_getmailboxes ( resource $imap_stream , string $ref , string $pattern )
// 64: function imap_scanmailbox(); // ALIAS of imap_listscan():imap_scanmailbox(...)
// 65: function imap_listsubscribed(); // ALIAS of imap_lsub():imap_listsubscribed(...)
// 66: function imap_getsubscribed(); // prototype:imap_getsubscribed ( resource $imap_stream , string $ref , string $pattern )
// 67:imap_fetchtext: has been marked as 'INTERNAL' - skipping...
// 68:imap_scan: has been marked as 'INTERNAL' - skipping...
// 69:imap_create: has been marked as 'INTERNAL' - skipping...
// 70:imap_rename: has been marked as 'INTERNAL' - skipping...

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension sockets
	define( 'AF_UNIX',1);
	define( 'AF_INET',2);
	define( 'AF_INET6',23);
	define( 'SOCK_STREAM',1);
	define( 'SOCK_DGRAM',2);
	define( 'SOCK_RAW',3);
	define( 'SOCK_SEQPACKET',5);
	define( 'SOCK_RDM',4);
	define( 'MSG_OOB',1);
	define( 'MSG_WAITALL',0);
	define( 'MSG_PEEK',2);
	define( 'MSG_DONTROUTE',4);
	define( 'SO_DEBUG',1);
	define( 'SO_REUSEADDR',4);
	define( 'SO_KEEPALIVE',8);
	define( 'SO_DONTROUTE',16);
	define( 'SO_LINGER',128);
	define( 'SO_BROADCAST',32);
	define( 'SO_OOBINLINE',256);
	define( 'SO_SNDBUF',4097);
	define( 'SO_RCVBUF',4098);
	define( 'SO_SNDLOWAT',4099);
	define( 'SO_RCVLOWAT',4100);
	define( 'SO_SNDTIMEO',4101);
	define( 'SO_RCVTIMEO',4102);
	define( 'SO_TYPE',4104);
	define( 'SO_ERROR',4103);
	define( 'SOL_SOCKET',65535);
	define( 'SOMAXCONN',2147483647);
	define( 'TCP_NODELAY',1);
	define( 'PHP_NORMAL_READ',1);
	define( 'PHP_BINARY_READ',2);
	define( 'SOCKET_EINTR',10004);
	define( 'SOCKET_EBADF',10009);
	define( 'SOCKET_EACCES',10013);
	define( 'SOCKET_EFAULT',10014);
	define( 'SOCKET_EINVAL',10022);
	define( 'SOCKET_EMFILE',10024);
	define( 'SOCKET_EWOULDBLOCK',10035);
	define( 'SOCKET_EINPROGRESS',10036);
	define( 'SOCKET_EALREADY',10037);
	define( 'SOCKET_ENOTSOCK',10038);
	define( 'SOCKET_EDESTADDRREQ',10039);
	define( 'SOCKET_EMSGSIZE',10040);
	define( 'SOCKET_EPROTOTYPE',10041);
	define( 'SOCKET_ENOPROTOOPT',10042);
	define( 'SOCKET_EPROTONOSUPPORT',10043);
	define( 'SOCKET_ESOCKTNOSUPPORT',10044);
	define( 'SOCKET_EOPNOTSUPP',10045);
	define( 'SOCKET_EPFNOSUPPORT',10046);
	define( 'SOCKET_EAFNOSUPPORT',10047);
	define( 'SOCKET_EADDRINUSE',10048);
	define( 'SOCKET_EADDRNOTAVAIL',10049);
	define( 'SOCKET_ENETDOWN',10050);
	define( 'SOCKET_ENETUNREACH',10051);
	define( 'SOCKET_ENETRESET',10052);
	define( 'SOCKET_ECONNABORTED',10053);
	define( 'SOCKET_ECONNRESET',10054);
	define( 'SOCKET_ENOBUFS',10055);
	define( 'SOCKET_EISCONN',10056);
	define( 'SOCKET_ENOTCONN',10057);
	define( 'SOCKET_ESHUTDOWN',10058);
	define( 'SOCKET_ETOOMANYREFS',10059);
	define( 'SOCKET_ETIMEDOUT',10060);
	define( 'SOCKET_ECONNREFUSED',10061);
	define( 'SOCKET_ELOOP',10062);
	define( 'SOCKET_ENAMETOOLONG',10063);
	define( 'SOCKET_EHOSTDOWN',10064);
	define( 'SOCKET_EHOSTUNREACH',10065);
	define( 'SOCKET_ENOTEMPTY',10066);
	define( 'SOCKET_EPROCLIM',10067);
	define( 'SOCKET_EUSERS',10068);
	define( 'SOCKET_EDQUOT',10069);
	define( 'SOCKET_ESTALE',10070);
	define( 'SOCKET_EREMOTE',10071);
	define( 'SOCKET_EDISCON',10101);
	define( 'SOCKET_SYSNOTREADY',10091);
	define( 'SOCKET_VERNOTSUPPORTED',10092);
	define( 'SOCKET_NOTINITIALISED',10093);
	define( 'SOCKET_HOST_NOT_FOUND',11001);
	define( 'SOCKET_TRY_AGAIN',11002);
	define( 'SOCKET_NO_RECOVERY',11003);
	define( 'SOCKET_NO_DATA',11004);
	define( 'SOCKET_NO_ADDRESS',11004);
	define( 'SOL_TCP',6);
	define( 'SOL_UDP',17);

/////////////////// ********** FUNCTIONS (26 total functions) ************ ///////////////////////////////

// 1: function socket_select(); // prototype:socket_select ( array &amp;$read , array &amp;$write , array &amp;$except , int $tv_sec [, int $tv_usec = 0 ] )
// 2: function socket_create(); // prototype:socket_create ( int $domain , int $type , int $protocol )
// 3: function socket_create_listen(); // prototype:socket_create_listen ( int $port [, int $backlog = 128 ] )
// 4: function socket_accept(); // prototype:socket_accept ( resource $socket )
// 5: function socket_set_nonblock(); // prototype:socket_set_nonblock ( resource $socket )
// 6: function socket_set_block(); // prototype:socket_set_block ( resource $socket )
// 7: function socket_listen(); // prototype:socket_listen ( resource $socket [, int $backlog = 0 ] )
// 8: function socket_close(); // prototype:socket_close ( resource $socket )
// 9: function socket_write(); // prototype:socket_write ( resource $socket , string $buffer [, int $length = 0 ] )
// 10: function socket_read(); // prototype:socket_read ( resource $socket , int $length [, int $type = PHP_BINARY_READ ] )
// 11: function socket_getsockname(); // prototype:socket_getsockname ( resource $socket , string &amp;$addr [, int &amp;$port ] )
// 12: function socket_getpeername(); // prototype:socket_getpeername ( resource $socket , string &amp;$address [, int &amp;$port ] )
// 13: function socket_connect(); // prototype:socket_connect ( resource $socket , string $address [, int $port = 0 ] )
// 14: function socket_strerror(); // prototype:socket_strerror ( int $errno )
// 15: function socket_bind(); // prototype:socket_bind ( resource $socket , string $address [, int $port = 0 ] )
// 16: function socket_recv(); // prototype:socket_recv ( resource $socket , string &amp;$buf , int $len , int $flags )
// 17: function socket_send(); // prototype:socket_send ( resource $socket , string $buf , int $len , int $flags )
// 18: function socket_recvfrom(); // prototype:socket_recvfrom ( resource $socket , string &amp;$buf , int $len , int $flags , string &amp;$name [, int &amp;$port ] )
// 19: function socket_sendto(); // prototype:socket_sendto ( resource $socket , string $buf , int $len , int $flags , string $addr [, int $port = 0 ] )
// 20: function socket_get_option(); // prototype:socket_get_option ( resource $socket , int $level , int $optname )
// 21: function socket_set_option(); // prototype:socket_set_option ( resource $socket , int $level , int $optname , mixed $optval )
// 22: function socket_shutdown(); // prototype:socket_shutdown ( resource $socket [, int $how = 2 ] )
// 23: function socket_last_error(); // prototype:socket_last_error ([ resource $socket ] )
// 24: function socket_clear_error(); // prototype:socket_clear_error ([ resource $socket ] )
// 25:socket_getopt: has been marked as 'INTERNAL' - skipping...
// 26:socket_setopt: has been marked as 'INTERNAL' - skipping...

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension iconv
	define( 'ICONV_IMPL','"libiconv"');
	define( 'ICONV_VERSION',1.11);
	define( 'ICONV_MIME_DECODE_STRICT',1);
	define( 'ICONV_MIME_DECODE_CONTINUE_ON_ERROR',2);

/////////////////// ********** FUNCTIONS (11 total functions) ************ ///////////////////////////////

// 1: function iconv(); // prototype:iconv ( string $in_charset , string $out_charset , string $str )
// 2: function ob_iconv_handler(); // prototype:ob_iconv_handler ( string $contents , int $status )
// 3: function iconv_get_encoding(); // prototype:iconv_get_encoding ([ string $type = &quot;all&quot; ] )
// 4: function iconv_set_encoding(); // prototype:iconv_set_encoding ( string $type , string $charset )
// 5: function iconv_strlen(); // prototype:iconv_strlen ( string $str [, string $charset = ini_set(&quot;iconv.internal_encoding&quot;) ] )
// 6: function iconv_substr(); // prototype:iconv_substr ( string $str , int $offset [, int $length = 0 [, string $charset = ini_set(&quot;iconv.internal_encoding&quot;) ]] )
// 7: function iconv_strpos(); // prototype:iconv_strpos ( string $haystack , string $needle [, int $offset = 0 [, string $charset = ini_set(&quot;iconv.internal_encoding&quot;) ]] )
// 8: function iconv_strrpos(); // prototype:iconv_strrpos ( string $haystack , string $needle [, string $charset = ini_set(&quot;iconv.internal_encoding&quot;) ] )
// 9: function iconv_mime_encode(); // prototype:iconv_mime_encode ( string $field_name , string $field_value [, array $preferences = NULL ] )
// 10: function iconv_mime_decode(); // prototype:iconv_mime_decode ( string $encoded_header [, int $mode = 0 [, string $charset = ini_set(&quot;iconv.internal_encoding&quot;) ]] )
// 11: function iconv_mime_decode_headers(); // prototype:iconv_mime_decode_headers ( string $encoded_headers [, int $mode = 0 [, string $charset = ini_set(&quot;iconv.internal_encoding&quot;) ]] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
