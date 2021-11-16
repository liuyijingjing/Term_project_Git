// No tooltips for ZipArchive!
<?php //Extension openssl
	define( 'OPENSSL_VERSION_TEXT','OpenSSL 0.9.8i 15 Sep 2008');
	define( 'OPENSSL_VERSION_NUMBER',9470111);
	define( 'X509_PURPOSE_SSL_CLIENT',1);
	define( 'X509_PURPOSE_SSL_SERVER',2);
	define( 'X509_PURPOSE_NS_SSL_SERVER',3);
	define( 'X509_PURPOSE_SMIME_SIGN',4);
	define( 'X509_PURPOSE_SMIME_ENCRYPT',5);
	define( 'X509_PURPOSE_CRL_SIGN',6);
	define( 'X509_PURPOSE_ANY',7);
	define( 'OPENSSL_ALGO_SHA1',1);
	define( 'OPENSSL_ALGO_MD5',2);
	define( 'OPENSSL_ALGO_MD4',3);
	define( 'OPENSSL_ALGO_MD2',4);
	define( 'OPENSSL_ALGO_DSS1',5);
	define( 'PKCS7_DETACHED',64);
	define( 'PKCS7_TEXT',1);
	define( 'PKCS7_NOINTERN',16);
	define( 'PKCS7_NOVERIFY',32);
	define( 'PKCS7_NOCHAIN',8);
	define( 'PKCS7_NOCERTS',2);
	define( 'PKCS7_NOATTR',256);
	define( 'PKCS7_BINARY',128);
	define( 'PKCS7_NOSIGS',4);
	define( 'OPENSSL_PKCS1_PADDING',1);
	define( 'OPENSSL_SSLV23_PADDING',2);
	define( 'OPENSSL_NO_PADDING',3);
	define( 'OPENSSL_PKCS1_OAEP_PADDING',4);
	define( 'OPENSSL_CIPHER_RC2_40',0);
	define( 'OPENSSL_CIPHER_RC2_128',1);
	define( 'OPENSSL_CIPHER_RC2_64',2);
	define( 'OPENSSL_CIPHER_DES',3);
	define( 'OPENSSL_CIPHER_3DES',4);
	define( 'OPENSSL_KEYTYPE_RSA',0);
	define( 'OPENSSL_KEYTYPE_DSA',1);
	define( 'OPENSSL_KEYTYPE_DH',2);
	define( 'OPENSSL_KEYTYPE_EC',3);

/////////////////// ********** FUNCTIONS (39 total functions) ************ ///////////////////////////////

// 1: function openssl_pkey_free(); // prototype:openssl_pkey_free ( resource $key )
// 2: function openssl_pkey_new(); // prototype:openssl_pkey_new ([ array $configargs ] )
// 3: function openssl_pkey_export(); // prototype:openssl_pkey_export ( mixed $key , string &amp;$out [, string $passphrase [, array $configargs ]] )
// 4: function openssl_pkey_export_to_file(); // prototype:openssl_pkey_export_to_file ( mixed $key , string $outfilename [, string $passphrase [, array $configargs ]] )
// 5: function openssl_pkey_get_private(); // prototype:openssl_pkey_get_private ( mixed $key [, string $passphrase = &quot;&quot; ] )
// 6: function openssl_pkey_get_public(); // prototype:openssl_pkey_get_public ( mixed $certificate )
// 7: function openssl_pkey_get_details(); // prototype:openssl_pkey_get_details ( resource $key )
// 8: function openssl_free_key(); // prototype:openssl_free_key ( resource $key_identifier )
// 9: function openssl_get_privatekey(); // ALIAS of openssl_pkey_get_private():openssl_get_privatekey(...)
// 10: function openssl_get_publickey(); // ALIAS of openssl_pkey_get_public():openssl_get_publickey(...)
// 11: function openssl_x509_read(); // prototype:openssl_x509_read ( mixed $x509certdata )
// 12: function openssl_x509_free(); // prototype:openssl_x509_free ( resource $x509cert )
// 13: function openssl_x509_parse(); // prototype:openssl_x509_parse ( mixed $x509cert [, bool $shortnames = true ] )
// 14: function openssl_x509_checkpurpose(); // prototype:openssl_x509_checkpurpose ( mixed $x509cert , int $purpose [, array $cainfo [, string $untrustedfile ]] )
// 15: function openssl_x509_check_private_key(); // prototype:openssl_x509_check_private_key ( mixed $cert , mixed $key )
// 16: function openssl_x509_export(); // prototype:openssl_x509_export ( mixed $x509 , string &amp;$output [, bool $notext ] )
// 17: function openssl_x509_export_to_file(); // prototype:openssl_x509_export_to_file ( mixed $x509 , string $outfilename [, bool $notext ] )
// 18: function openssl_pkcs12_export(); // prototype:openssl_pkcs12_export ( mixed $x509 , string &amp;$out , mixed $priv_key , string $pass [, array $args ] )
// 19: function openssl_pkcs12_export_to_file(); // prototype:openssl_pkcs12_export_to_file ( mixed $x509 , string $filename , mixed $priv_key , string $pass [, array $args ] )
// 20: function openssl_pkcs12_read(); // prototype:openssl_pkcs12_read ( string $pkcs12 , array &amp;$certs , string $pass )
// 21: function openssl_csr_new(); // prototype:openssl_csr_new ( array $dn , resource &amp;$privkey [, array $configargs [, array $extraattribs ]] )
// 22: function openssl_csr_export(); // prototype:openssl_csr_export ( resource $csr , string &amp;$out [, bool $notext = true ] )
// 23: function openssl_csr_export_to_file(); // prototype:openssl_csr_export_to_file ( resource $csr , string $outfilename [, bool $notext = true ] )
// 24: function openssl_csr_sign(); // prototype:openssl_csr_sign ( mixed $csr , mixed $cacert , mixed $priv_key , int $days [, array $configargs [, int $serial = 0 ]] )
// 25: function openssl_csr_get_subject(); // prototype:openssl_csr_get_subject ( mixed $csr [, bool $use_shortnames = true ] )
// 26: function openssl_csr_get_public_key(); // prototype:openssl_csr_get_public_key ( mixed $csr [, bool $use_shortnames = true ] )
// 27: function openssl_sign(); // prototype:openssl_sign ( string $data , string &amp;$signature , mixed $priv_key_id [, int $signature_alg = OPENSSL_ALGO_SHA1 ] )
// 28: function openssl_verify(); // prototype:openssl_verify ( string $data , string $signature , mixed $pub_key_id [, int $signature_alg ] )
// 29: function openssl_seal(); // prototype:openssl_seal ( string $data , string &amp;$sealed_data , array &amp;$env_keys , array $pub_key_ids )
// 30: function openssl_open(); // prototype:openssl_open ( string $sealed_data , string &amp;$open_data , string $env_key , mixed $priv_key_id )
// 31: function openssl_pkcs7_verify(); // prototype:openssl_pkcs7_verify ( string $filename , int $flags [, string $outfilename [, array $cainfo [, string $extracerts [, string $content ]]]] )
// 32: function openssl_pkcs7_decrypt(); // prototype:openssl_pkcs7_decrypt ( string $infilename , string $outfilename , mixed $recipcert [, mixed $recipkey ] )
// 33: function openssl_pkcs7_sign(); // prototype:openssl_pkcs7_sign ( string $infilename , string $outfilename , mixed $signcert , mixed $privkey , array $headers [, int $flags = PKCS7_DETACHED [, string $extracerts ]] )
// 34: function openssl_pkcs7_encrypt(); // prototype:openssl_pkcs7_encrypt ( string $infile , string $outfile , mixed $recipcerts , array $headers [, int $flags = 0 [, int $cipherid = OPENSSL_CIPHER_RC2_40 ]] )
// 35: function openssl_private_encrypt(); // prototype:openssl_private_encrypt ( string $data , string &amp;$crypted , mixed $key [, int $padding = OPENSSL_PKCS1_PADDING ] )
// 36: function openssl_private_decrypt(); // prototype:openssl_private_decrypt ( string $data , string &amp;$decrypted , mixed $key [, int $padding = OPENSSL_PKCS1_PADDING ] )
// 37: function openssl_public_encrypt(); // prototype:openssl_public_encrypt ( string $data , string &amp;$crypted , mixed $key [, int $padding = OPENSSL_PKCS1_PADDING ] )
// 38: function openssl_public_decrypt(); // prototype:openssl_public_decrypt ( string $data , string &amp;$decrypted , mixed $key [, int $padding = OPENSSL_PKCS1_PADDING ] )
// 39: function openssl_error_string(); // prototype:openssl_error_string ( void )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension mhash
	define( 'MHASH_CRC32',0);
	define( 'MHASH_MD5',1);
	define( 'MHASH_SHA1',2);
	define( 'MHASH_HAVAL256',3);
	define( 'MHASH_RIPEMD160',5);
	define( 'MHASH_TIGER',7);
	define( 'MHASH_GOST',8);
	define( 'MHASH_CRC32B',9);
	define( 'MHASH_HAVAL224',10);
	define( 'MHASH_HAVAL192',11);
	define( 'MHASH_HAVAL160',12);
	define( 'MHASH_HAVAL128',13);
	define( 'MHASH_TIGER128',14);
	define( 'MHASH_TIGER160',15);
	define( 'MHASH_MD4',16);
	define( 'MHASH_SHA256',17);
	define( 'MHASH_ADLER32',18);

/////////////////// ********** FUNCTIONS (5 total functions) ************ ///////////////////////////////

// 1: function mhash_get_block_size(); // prototype:mhash_get_block_size ( int $hash )
// 2: function mhash_get_hash_name(); // prototype:mhash_get_hash_name ( int $hash )
// 3: function mhash_keygen_s2k(); // prototype:mhash_keygen_s2k ( int $hash , string $password , string $salt , int $bytes )
// 4: function mhash_count(); // prototype:mhash_count ( void )
// 5: function mhash(); // prototype:mhash ( int $hash , string $data [, string $key ] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension hash
	define( 'HASH_HMAC',1);

/////////////////// ********** FUNCTIONS (10 total functions) ************ ///////////////////////////////

// 1: function hash(); // prototype:hash ( string $algo , string $data [, bool $raw_output = false ] )
// 2: function hash_file(); // prototype:hash_file ( string $algo , string $filename [, bool $raw_output = false ] )
// 3: function hash_hmac(); // prototype:hash_hmac ( string $algo , string $data , string $key [, bool $raw_output = false ] )
// 4: function hash_hmac_file(); // prototype:hash_hmac_file ( string $algo , string $filename , string $key [, bool $raw_output = false ] )
// 5: function hash_init(); // prototype:hash_init ( string $algo [, int $options = 0 [, string $key = NULL ]] )
// 6: function hash_update(); // prototype:hash_update ( resource $context , string $data )
// 7: function hash_update_stream(); // prototype:hash_update_stream ( resource $context , resource $handle [, int $length = -1 ] )
// 8: function hash_update_file(); // prototype:hash_update_file ( resource $context , string $filename [, resource $context = NULL ] )
// 9: function hash_final(); // prototype:hash_final ( resource $context [, bool $raw_output = false ] )
// 10: function hash_algos(); // prototype:hash_algos ( void )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension bz2

/////////////////// ********** FUNCTIONS (10 total functions) ************ ///////////////////////////////

// 1: function bzopen(); // prototype:bzopen ( string $filename , string $mode )
// 2: function bzread(); // prototype:bzread ( resource $bz [, int $length = 1024 ] )
// 3: function bzwrite(); // prototype:bzwrite ( resource $bz , string $data [, int $length ] )
// 4: function bzflush(); // prototype:bzflush ( resource $bz )
// 5: function bzclose(); // prototype:bzclose ( resource $bz )
// 6: function bzerrno(); // prototype:bzerrno ( resource $bz )
// 7: function bzerrstr(); // prototype:bzerrstr ( resource $bz )
// 8: function bzerror(); // prototype:bzerror ( resource $bz )
// 9: function bzcompress(); // prototype:bzcompress ( string $source [, int $blocksize = 4 [, int $workfactor = 0 ]] )
// 10: function bzdecompress(); // prototype:bzdecompress ( string $source [, int $small = 0 ] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension mcrypt
	define( 'MCRYPT_ENCRYPT',0);
	define( 'MCRYPT_DECRYPT',1);
	define( 'MCRYPT_DEV_RANDOM',0);
	define( 'MCRYPT_DEV_URANDOM',1);
	define( 'MCRYPT_RAND',2);
	define( 'MCRYPT_3DES','tripledes');
	define( 'MCRYPT_ARCFOUR_IV','arcfour-iv');
	define( 'MCRYPT_ARCFOUR','arcfour');
	define( 'MCRYPT_BLOWFISH','blowfish');
	define( 'MCRYPT_BLOWFISH_COMPAT','blowfish-compat');
	define( 'MCRYPT_CAST_128','cast-128');
	define( 'MCRYPT_CAST_256','cast-256');
	define( 'MCRYPT_CRYPT','crypt');
	define( 'MCRYPT_DES','des');
	define( 'MCRYPT_ENIGNA','crypt');
	define( 'MCRYPT_GOST','gost');
	define( 'MCRYPT_LOKI97','loki97');
	define( 'MCRYPT_PANAMA','panama');
	define( 'MCRYPT_RC2','rc2');
	define( 'MCRYPT_RIJNDAEL_128','rijndael-128');
	define( 'MCRYPT_RIJNDAEL_192','rijndael-192');
	define( 'MCRYPT_RIJNDAEL_256','rijndael-256');
	define( 'MCRYPT_SAFER64','safer-sk64');
	define( 'MCRYPT_SAFER128','safer-sk128');
	define( 'MCRYPT_SAFERPLUS','saferplus');
	define( 'MCRYPT_SERPENT','serpent');
	define( 'MCRYPT_THREEWAY','threeway');
	define( 'MCRYPT_TRIPLEDES','tripledes');
	define( 'MCRYPT_TWOFISH','twofish');
	define( 'MCRYPT_WAKE','wake');
	define( 'MCRYPT_XTEA','xtea');
	define( 'MCRYPT_IDEA','idea');
	define( 'MCRYPT_MARS','mars');
	define( 'MCRYPT_RC6','rc6');
	define( 'MCRYPT_SKIPJACK','skipjack');
	define( 'MCRYPT_MODE_CBC','cbc');
	define( 'MCRYPT_MODE_CFB','cfb');
	define( 'MCRYPT_MODE_ECB','ecb');
	define( 'MCRYPT_MODE_NOFB','nofb');
	define( 'MCRYPT_MODE_OFB','ofb');
	define( 'MCRYPT_MODE_STREAM','stream');

/////////////////// ********** FUNCTIONS (37 total functions) ************ ///////////////////////////////

// 1: function mcrypt_ecb(); // prototype:mcrypt_ecb ( int $cipher , string $key , string $data , int $mode )
// 2: function mcrypt_cbc(); // prototype:mcrypt_cbc ( int $cipher , string $key , string $data , int $mode [, string $iv ] )
// 3: function mcrypt_cfb(); // prototype:mcrypt_cfb ( int $cipher , string $key , string $data , int $mode , string $iv )
// 4: function mcrypt_ofb(); // prototype:mcrypt_ofb ( int $cipher , string $key , string $data , int $mode , string $iv )
// 5: function mcrypt_get_key_size(); // prototype:mcrypt_get_key_size ( int $cipher )
// 6: function mcrypt_get_block_size(); // prototype:mcrypt_get_block_size ( int $cipher )
// 7: function mcrypt_get_cipher_name(); // prototype:mcrypt_get_cipher_name ( int $cipher )
// 8: function mcrypt_create_iv(); // prototype:mcrypt_create_iv ( int $size [, int $source = MCRYPT_DEV_RANDOM ] )
// 9: function mcrypt_list_algorithms(); // prototype:mcrypt_list_algorithms ([ string $lib_dir = ini_get(&quot;mcrypt.algorithms_dir&quot;) ] )
// 10: function mcrypt_list_modes(); // prototype:mcrypt_list_modes ([ string $lib_dir = ini_get(&quot;mcrypt.algorithms_dir&quot;) ] )
// 11: function mcrypt_get_iv_size(); // prototype:mcrypt_get_iv_size ( string $cipher , string $mode )
// 12: function mcrypt_encrypt(); // prototype:mcrypt_encrypt ( string $cipher , string $key , string $data , string $mode [, string $iv ] )
// 13: function mcrypt_decrypt(); // prototype:mcrypt_decrypt ( string $cipher , string $key , string $data , string $mode [, string $iv ] )
// 14: function mcrypt_module_open(); // prototype:mcrypt_module_open ( string $algorithm , string $algorithm_directory , string $mode , string $mode_directory )
// 15: function mcrypt_generic_init(); // prototype:mcrypt_generic_init ( resource $td , string $key , string $iv )
// 16: function mcrypt_generic(); // prototype:mcrypt_generic ( resource $td , string $data )
// 17: function mdecrypt_generic(); // prototype:mdecrypt_generic ( resource $td , string $data )
// 18: function mcrypt_generic_end(); // prototype:mcrypt_generic_end ( resource $td )
// 19: function mcrypt_generic_deinit(); // prototype:mcrypt_generic_deinit ( resource $td )
// 20: function mcrypt_enc_self_test(); // prototype:mcrypt_enc_self_test ( resource $td )
// 21: function mcrypt_enc_is_block_algorithm_mode(); // prototype:mcrypt_enc_is_block_algorithm_mode ( resource $td )
// 22: function mcrypt_enc_is_block_algorithm(); // prototype:mcrypt_enc_is_block_algorithm ( resource $td )
// 23: function mcrypt_enc_is_block_mode(); // prototype:mcrypt_enc_is_block_mode ( resource $td )
// 24: function mcrypt_enc_get_block_size(); // prototype:mcrypt_enc_get_block_size ( resource $td )
// 25: function mcrypt_enc_get_key_size(); // prototype:mcrypt_enc_get_key_size ( resource $td )
// 26: function mcrypt_enc_get_supported_key_sizes(); // prototype:mcrypt_enc_get_supported_key_sizes ( resource $td )
// 27: function mcrypt_enc_get_iv_size(); // prototype:mcrypt_enc_get_iv_size ( resource $td )
// 28: function mcrypt_enc_get_algorithms_name(); // prototype:mcrypt_enc_get_algorithms_name ( resource $td )
// 29: function mcrypt_enc_get_modes_name(); // prototype:mcrypt_enc_get_modes_name ( resource $td )
// 30: function mcrypt_module_self_test(); // prototype:mcrypt_module_self_test ( string $algorithm [, string $lib_dir ] )
// 31: function mcrypt_module_is_block_algorithm_mode(); // prototype:mcrypt_module_is_block_algorithm_mode ( string $mode [, string $lib_dir ] )
// 32: function mcrypt_module_is_block_algorithm(); // prototype:mcrypt_module_is_block_algorithm ( string $algorithm [, string $lib_dir ] )
// 33: function mcrypt_module_is_block_mode(); // prototype:mcrypt_module_is_block_mode ( string $mode [, string $lib_dir ] )
// 34: function mcrypt_module_get_algo_block_size(); // prototype:mcrypt_module_get_algo_block_size ( string $algorithm [, string $lib_dir ] )
// 35: function mcrypt_module_get_algo_key_size(); // prototype:mcrypt_module_get_algo_key_size ( string $algorithm [, string $lib_dir ] )
// 36: function mcrypt_module_get_supported_key_sizes(); // prototype:mcrypt_module_get_supported_key_sizes ( string $algorithm [, string $lib_dir ] )
// 37: function mcrypt_module_close(); // prototype:mcrypt_module_close ( resource $td )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension zlib
	define( 'FORCE_GZIP',1);
	define( 'FORCE_DEFLATE',2);

/////////////////// ********** FUNCTIONS (22 total functions) ************ ///////////////////////////////

// 1: function readgzfile(); // prototype:readgzfile ( string $filename [, int $use_include_path = 0 ] )
// 2: function gzrewind(); // prototype:gzrewind ( resource $zp )
// 3: function gzclose(); // prototype:gzclose ( resource $zp )
// 4: function gzeof(); // prototype:gzeof ( resource $zp )
// 5: function gzgetc(); // prototype:gzgetc ( resource $zp )
// 6: function gzgets(); // prototype:gzgets ( resource $zp , int $length )
// 7: function gzgetss(); // prototype:gzgetss ( resource $zp , int $length [, string $allowable_tags ] )
// 8: function gzread(); // prototype:gzread ( resource $zp , int $length )
// 9: function gzopen(); // prototype:gzopen ( string $filename , string $mode [, int $use_include_path = 0 ] )
// 10: function gzpassthru(); // prototype:gzpassthru ( resource $zp )
// 11: function gzseek(); // prototype:gzseek ( resource $zp , int $offset [, int $whence = SEEK_SET ] )
// 12: function gztell(); // prototype:gztell ( resource $zp )
// 13: function gzwrite(); // prototype:gzwrite ( resource $zp , string $string [, int $length ] )
// 14: function gzputs(); // ALIAS of gzwrite():gzputs(...)
// 15: function gzfile(); // prototype:gzfile ( string $filename [, int $use_include_path = 0 ] )
// 16: function gzcompress(); // prototype:gzcompress ( string $data [, int $level = -1 ] )
// 17: function gzuncompress(); // prototype:gzuncompress ( string $data [, int $length = 0 ] )
// 18: function gzdeflate(); // prototype:gzdeflate ( string $data [, int $level = -1 ] )
// 19: function gzinflate(); // prototype:gzinflate ( string $data [, int $length = 0 ] )
// 20: function gzencode(); // prototype:gzencode ( string $data [, int $level = -1 [, int $encoding_mode = FORCE_GZIP ]] )
// 21: function ob_gzhandler(); // prototype:ob_gzhandler ( string $buffer , int $mode )
// 22: function zlib_get_coding_type(); // prototype:zlib_get_coding_type ( void )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension zip
//@php_CRYPT.xml#ZipArchive
 class ZipArchive   {

// Constants
	 const CREATE=1;
	 const EXCL=2;
	 const CHECKCONS=4;
	 const OVERWRITE=8;
	 const FL_NOCASE=1;
	 const FL_NODIR=2;
	 const FL_COMPRESSED=4;
	 const FL_UNCHANGED=8;
	 const CM_DEFAULT=-1;
	 const CM_STORE=0;
	 const CM_SHRINK=1;
	 const CM_REDUCE_1=2;
	 const CM_REDUCE_2=3;
	 const CM_REDUCE_3=4;
	 const CM_REDUCE_4=5;
	 const CM_IMPLODE=6;
	 const CM_DEFLATE=8;
	 const CM_DEFLATE64=9;
	 const CM_PKWARE_IMPLODE=10;
	 const ER_OK=0;
	 const ER_MULTIDISK=1;
	 const ER_RENAME=2;
	 const ER_CLOSE=3;
	 const ER_SEEK=4;
	 const ER_READ=5;
	 const ER_WRITE=6;
	 const ER_CRC=7;
	 const ER_ZIPCLOSED=8;
	 const ER_NOENT=9;
	 const ER_EXISTS=10;
	 const ER_OPEN=11;
	 const ER_TMPOPEN=12;
	 const ER_ZLIB=13;
	 const ER_MEMORY=14;
	 const ER_CHANGED=15;
	 const ER_COMPNOTSUPP=16;
	 const ER_EOF=17;
	 const ER_INVAL=18;
	 const ER_NOZIP=19;
	 const ER_INTERNAL=20;
	 const ER_INCONS=21;
	 const ER_REMOVE=22;
	 const ER_DELETED=23;

// Properties

// Methods
	public function open ( $filename,  $flags ) {}
	public function addEmptyDir (  $dirname ) {}
	public function addFile ($filename, $localname ) {}
	public function addFromString (  $localname ,  $contents ) {}
	public function close ( ) {}
	public function deleteIndex ( $index ) {}
	public function deleteName ( $name ) {}
	public function extractTo ( $destination , $entries ) {}
	public function getArchiveComment ( ) {}
	public function getCommentIndex ( $index , $flags  ) {}
	public function getCommentName ( $name , $flags  ) {}
	public function getFromIndex ( $index , $flags ) {}
	public function getFromName ( $name , $flags ) {}
	public function getNameIndex ( $index ) {}
	public function getStatusString ( ) {}
	public function getStream ( $name ) {}
	public function locateName ( $name , $flags  ) {}
	public function renameIndex ( $index , $newname ) {}
	public function renameName ( $name , $newname ) {}
	public function setArchiveComment ( $comment ) {}
	public function setCommentIndex ( $index , $comment ) {}
	public function setCommentName ( $name , $comment ) {}
	public function statIndex ( $index , $flags ) {}
	public function statName ( $name ,  $flags ) {}
	public function unchangeAll (  ) {}
	public function unchangeArchive ( ) {}
	public function unchangeIndex ( $index ) {}
	public function unchangeName ( $name ) {}
}

////////////////////////////////////////////////////////////////////////////////////


/////////////////// ********** FUNCTIONS (10 total functions) ************ ///////////////////////////////

// 1: function zip_open(); // prototype:zip_open ( string $filename )
// 2: function zip_close(); // prototype:zip_close ( resource $zip )
// 3: function zip_read(); // prototype:zip_read ( resource $zip )
// 4: function zip_entry_open(); // prototype:zip_entry_open ( resource $zip , resource $zip_entry [, string $mode ] )
// 5: function zip_entry_close(); // prototype:zip_entry_close ( resource $zip_entry )
// 6: function zip_entry_read(); // prototype:zip_entry_read ( resource $zip_entry [, int $length ] )
// 7: function zip_entry_filesize(); // prototype:zip_entry_filesize ( resource $zip_entry )
// 8: function zip_entry_name(); // prototype:zip_entry_name ( resource $zip_entry )
// 9: function zip_entry_compressedsize(); // prototype:zip_entry_compressedsize ( resource $zip_entry )
// 10: function zip_entry_compressionmethod(); // prototype:zip_entry_compressionmethod ( resource $zip_entry )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
