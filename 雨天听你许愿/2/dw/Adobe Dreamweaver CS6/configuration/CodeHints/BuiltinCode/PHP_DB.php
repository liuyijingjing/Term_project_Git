<?php //Extension odbc
	define( 'ODBC_TYPE','Win32');
	define( 'ODBC_BINMODE_PASSTHRU',0);
	define( 'ODBC_BINMODE_RETURN',1);
	define( 'ODBC_BINMODE_CONVERT',2);
	define( 'SQL_ODBC_CURSORS',110);
	define( 'SQL_CUR_USE_DRIVER',2);
	define( 'SQL_CUR_USE_IF_NEEDED',0);
	define( 'SQL_CUR_USE_ODBC',1);
	define( 'SQL_CONCURRENCY',7);
	define( 'SQL_CONCUR_READ_ONLY',1);
	define( 'SQL_CONCUR_LOCK',2);
	define( 'SQL_CONCUR_ROWVER',3);
	define( 'SQL_CONCUR_VALUES',4);
	define( 'SQL_CURSOR_TYPE',6);
	define( 'SQL_CURSOR_FORWARD_ONLY',0);
	define( 'SQL_CURSOR_KEYSET_DRIVEN',1);
	define( 'SQL_CURSOR_DYNAMIC',2);
	define( 'SQL_CURSOR_STATIC',3);
	define( 'SQL_KEYSET_SIZE',8);
	define( 'SQL_FETCH_FIRST',2);
	define( 'SQL_FETCH_NEXT',1);
	define( 'SQL_CHAR',1);
	define( 'SQL_VARCHAR',12);
	define( 'SQL_LONGVARCHAR',-1);
	define( 'SQL_DECIMAL',3);
	define( 'SQL_NUMERIC',2);
	define( 'SQL_BIT',-7);
	define( 'SQL_TINYINT',-6);
	define( 'SQL_SMALLINT',5);
	define( 'SQL_INTEGER',4);
	define( 'SQL_BIGINT',-5);
	define( 'SQL_REAL',7);
	define( 'SQL_FLOAT',6);
	define( 'SQL_DOUBLE',8);
	define( 'SQL_BINARY',-2);
	define( 'SQL_VARBINARY',-3);
	define( 'SQL_LONGVARBINARY',-4);
	define( 'SQL_DATE',9);
	define( 'SQL_TIME',10);
	define( 'SQL_TIMESTAMP',11);

/////////////////// ********** FUNCTIONS (45 total functions) ************ ///////////////////////////////

// 1: function odbc_autocommit(); // prototype:odbc_autocommit ( resource $connection_id [, bool $OnOff = false ] )
// 2: function odbc_binmode(); // prototype:odbc_binmode ( resource $result_id , int $mode )
// 3: function odbc_close(); // prototype:odbc_close ( resource $connection_id )
// 4: function odbc_close_all(); // prototype:odbc_close_all ( void )
// 5: function odbc_columns(); // prototype:odbc_columns ( resource $connection_id [, string $qualifier [, string $schema [, string $table_name [, string $column_name ]]]] )
// 6: function odbc_commit(); // prototype:odbc_commit ( resource $connection_id )
// 7: function odbc_connect(); // prototype:odbc_connect ( string $dsn , string $user , string $password [, int $cursor_type ] )
// 8: function odbc_cursor(); // prototype:odbc_cursor ( resource $result_id )
// 9: function odbc_data_source(); // prototype:odbc_data_source ( resource $connection_id , int $fetch_type )
// 10: function odbc_execute(); // prototype:odbc_execute ( resource $result_id [, array $parameters_array ] )
// 11: function odbc_error(); // prototype:odbc_error ([ resource $connection_id ] )
// 12: function odbc_errormsg(); // prototype:odbc_errormsg ([ resource $connection_id ] )
// 13: function odbc_exec(); // prototype:odbc_exec ( resource $connection_id , string $query_string [, int $flags ] )
// 14: function odbc_fetch_array(); // prototype:odbc_fetch_array ( resource $result [, int $rownumber ] )
// 15: function odbc_fetch_object(); // prototype:odbc_fetch_object ( resource $result [, int $rownumber ] )
// 16: function odbc_fetch_row(); // prototype:odbc_fetch_row ( resource $result_id [, int $row_number ] )
// 17: function odbc_fetch_into(); // prototype:odbc_fetch_into ( resource $result_id , array &amp;$result_array [, int $rownumber ] )
// 18: function odbc_field_len(); // prototype:odbc_field_len ( resource $result_id , int $field_number )
// 19: function odbc_field_scale(); // prototype:odbc_field_scale ( resource $result_id , int $field_number )
// 20: function odbc_field_name(); // prototype:odbc_field_name ( resource $result_id , int $field_number )
// 21: function odbc_field_type(); // prototype:odbc_field_type ( resource $result_id , int $field_number )
// 22: function odbc_field_num(); // prototype:odbc_field_num ( resource $result_id , string $field_name )
// 23: function odbc_free_result(); // prototype:odbc_free_result ( resource $result_id )
// 24: function odbc_gettypeinfo(); // prototype:odbc_gettypeinfo ( resource $connection_id [, int $data_type ] )
// 25: function odbc_longreadlen(); // prototype:odbc_longreadlen ( resource $result_id , int $length )
// 26: function odbc_next_result(); // prototype:odbc_next_result ( resource $result_id )
// 27: function odbc_num_fields(); // prototype:odbc_num_fields ( resource $result_id )
// 28: function odbc_num_rows(); // prototype:odbc_num_rows ( resource $result_id )
// 29: function odbc_pconnect(); // prototype:odbc_pconnect ( string $dsn , string $user , string $password [, int $cursor_type ] )
// 30: function odbc_prepare(); // prototype:odbc_prepare ( resource $connection_id , string $query_string )
// 31: function odbc_result(); // prototype:odbc_result ( resource $result_id , mixed $field )
// 32: function odbc_result_all(); // prototype:odbc_result_all ( resource $result_id [, string $format ] )
// 33: function odbc_rollback(); // prototype:odbc_rollback ( resource $connection_id )
// 34: function odbc_setoption(); // prototype:odbc_setoption ( resource $id , int $function , int $option , int $param )
// 35: function odbc_specialcolumns(); // prototype:odbc_specialcolumns ( resource $connection_id , int $type , string $qualifier , string $owner , string $table , int $scope , int $nullable )
// 36: function odbc_statistics(); // prototype:odbc_statistics ( resource $connection_id , string $qualifier , string $owner , string $table_name , int $unique , int $accuracy )
// 37: function odbc_tables(); // prototype:odbc_tables ( resource $connection_id [, string $qualifier [, string $owner [, string $name [, string $types ]]]] )
// 38: function odbc_primarykeys(); // prototype:odbc_primarykeys ( resource $connection_id , string $qualifier , string $owner , string $table )
// 39: function odbc_columnprivileges(); // prototype:odbc_columnprivileges ( resource $connection_id , string $qualifier , string $owner , string $table_name , string $column_name )
// 40: function odbc_tableprivileges(); // prototype:odbc_tableprivileges ( resource $connection_id , string $qualifier , string $owner , string $name )
// 41: function odbc_foreignkeys(); // prototype:odbc_foreignkeys ( resource $connection_id , string $pk_qualifier , string $pk_owner , string $pk_table , string $fk_qualifier , string $fk_owner , string $fk_table )
// 42: function odbc_procedures(); // prototype:odbc_procedures ( resource $connection_id )
// 43: function odbc_procedurecolumns(); // prototype:odbc_procedurecolumns ( resource $connection_id )
// 44: function odbc_do(); // ALIAS of odbc_exec():odbc_do(...)
// 45: function odbc_field_precision(); // ALIAS of odbc_field_len():odbc_field_precision(...)

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension mssql
	define( 'MSSQL_ASSOC',1);
	define( 'MSSQL_NUM',2);
	define( 'MSSQL_BOTH',3);
	define( 'SQLTEXT',35);
	define( 'SQLVARCHAR',39);
	define( 'SQLCHAR',47);
	define( 'SQLINT1',48);
	define( 'SQLINT2',52);
	define( 'SQLINT4',56);
	define( 'SQLBIT',50);
	define( 'SQLFLT4',59);
	define( 'SQLFLT8',62);
	define( 'SQLFLTN',109);

/////////////////// ********** FUNCTIONS (30 total functions) ************ ///////////////////////////////

// 1: function mssql_connect(); // prototype:mssql_connect ([ string $servername [, string $username [, string $password [, bool $new_link ]]]] )
// 2: function mssql_pconnect(); // prototype:mssql_pconnect ([ string $servername [, string $username [, string $password [, bool $new_link ]]]] )
// 3: function mssql_close(); // prototype:mssql_close ([ resource $link_identifier ] )
// 4: function mssql_select_db(); // prototype:mssql_select_db ( string $database_name [, resource $link_identifier ] )
// 5: function mssql_query(); // prototype:mssql_query ( string $query [, resource $link_identifier [, int $batch_size = 0 ]] )
// 6: function mssql_fetch_batch(); // prototype:mssql_fetch_batch ( resource $result )
// 7: function mssql_rows_affected(); // prototype:mssql_rows_affected ( resource $link_identifier )
// 8: function mssql_free_result(); // prototype:mssql_free_result ( resource $result )
// 9: function mssql_get_last_message(); // prototype:mssql_get_last_message ( void )
// 10: function mssql_num_rows(); // prototype:mssql_num_rows ( resource $result )
// 11: function mssql_num_fields(); // prototype:mssql_num_fields ( resource $result )
// 12: function mssql_fetch_field(); // prototype:mssql_fetch_field ( resource $result [, int $field_offset = -1 ] )
// 13: function mssql_fetch_row(); // prototype:mssql_fetch_row ( resource $result )
// 14: function mssql_fetch_array(); // prototype:mssql_fetch_array ( resource $result [, int $result_type = MSSQL_BOTH ] )
// 15: function mssql_fetch_assoc(); // prototype:mssql_fetch_assoc ( resource $result_id )
// 16: function mssql_fetch_object(); // prototype:mssql_fetch_object ( resource $result )
// 17: function mssql_field_length(); // prototype:mssql_field_length ( resource $result [, int $offset = -1 ] )
// 18: function mssql_field_name(); // prototype:mssql_field_name ( resource $result [, int $offset = -1 ] )
// 19: function mssql_field_type(); // prototype:mssql_field_type ( resource $result [, int $offset = -1 ] )
// 20: function mssql_data_seek(); // prototype:mssql_data_seek ( resource $result_identifier , int $row_number )
// 21: function mssql_field_seek(); // prototype:mssql_field_seek ( resource $result , int $field_offset )
// 22: function mssql_result(); // prototype:mssql_result ( resource $result , int $row , mixed $field )
// 23: function mssql_next_result(); // prototype:mssql_next_result ( resource $result_id )
// 24: function mssql_min_error_severity(); // prototype:mssql_min_error_severity ( int $severity )
// 25: function mssql_min_message_severity(); // prototype:mssql_min_message_severity ( int $severity )
// 26: function mssql_init(); // prototype:mssql_init ( string $sp_name [, resource $link_identifier ] )
// 27: function mssql_bind(); // prototype:mssql_bind ( resource $stmt , string $param_name , mixed &amp;$var , int $type [, bool $is_output = false [, bool $is_null = false [, int $maxlen = -1 ]]] )
// 28: function mssql_execute(); // prototype:mssql_execute ( resource $stmt [, bool $skip_results = false ] )
// 29: function mssql_free_statement(); // prototype:mssql_free_statement ( resource $stmt )
// 30: function mssql_guid_string(); // prototype:mssql_guid_string ( string $binary [, bool $short_format = false ] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension pgsql
	define( 'PGSQL_CONNECT_FORCE_NEW',2);
	define( 'PGSQL_ASSOC',1);
	define( 'PGSQL_NUM',2);
	define( 'PGSQL_BOTH',3);
	define( 'PGSQL_CONNECTION_BAD',1);
	define( 'PGSQL_CONNECTION_OK',0);
	define( 'PGSQL_TRANSACTION_IDLE',0);
	define( 'PGSQL_TRANSACTION_ACTIVE',1);
	define( 'PGSQL_TRANSACTION_INTRANS',2);
	define( 'PGSQL_TRANSACTION_INERROR',3);
	define( 'PGSQL_TRANSACTION_UNKNOWN',4);
	define( 'PGSQL_ERRORS_TERSE',0);
	define( 'PGSQL_ERRORS_DEFAULT',1);
	define( 'PGSQL_ERRORS_VERBOSE',2);
	define( 'PGSQL_SEEK_SET',0);
	define( 'PGSQL_SEEK_CUR',1);
	define( 'PGSQL_SEEK_END',2);
	define( 'PGSQL_STATUS_LONG',1);
	define( 'PGSQL_STATUS_STRING',2);
	define( 'PGSQL_EMPTY_QUERY',0);
	define( 'PGSQL_COMMAND_OK',1);
	define( 'PGSQL_TUPLES_OK',2);
	define( 'PGSQL_COPY_OUT',3);
	define( 'PGSQL_COPY_IN',4);
	define( 'PGSQL_BAD_RESPONSE',5);
	define( 'PGSQL_NONFATAL_ERROR',6);
	define( 'PGSQL_FATAL_ERROR',7);
	define( 'PGSQL_DIAG_SEVERITY',83);
	define( 'PGSQL_DIAG_SQLSTATE',67);
	define( 'PGSQL_DIAG_MESSAGE_PRIMARY',77);
	define( 'PGSQL_DIAG_MESSAGE_DETAIL',68);
	define( 'PGSQL_DIAG_MESSAGE_HINT',72);
	define( 'PGSQL_DIAG_STATEMENT_POSITION',80);
	define( 'PGSQL_DIAG_INTERNAL_POSITION',112);
	define( 'PGSQL_DIAG_INTERNAL_QUERY',113);
	define( 'PGSQL_DIAG_CONTEXT',87);
	define( 'PGSQL_DIAG_SOURCE_FILE',70);
	define( 'PGSQL_DIAG_SOURCE_LINE',76);
	define( 'PGSQL_DIAG_SOURCE_FUNCTION',82);
	define( 'PGSQL_CONV_IGNORE_DEFAULT',2);
	define( 'PGSQL_CONV_FORCE_NULL',4);
	define( 'PGSQL_CONV_IGNORE_NOT_NULL',8);
	define( 'PGSQL_DML_NO_CONV',256);
	define( 'PGSQL_DML_EXEC',512);
	define( 'PGSQL_DML_ASYNC',1024);
	define( 'PGSQL_DML_STRING',2048);

/////////////////// ********** FUNCTIONS (107 total functions) ************ ///////////////////////////////

// 1: function pg_connect(); // prototype:pg_connect ( string $connection_string [, int $connect_type ] )
// 2: function pg_pconnect(); // prototype:pg_pconnect ( string $connection_string [, int $connect_type ] )
// 3: function pg_close(); // prototype:pg_close ([ resource $connection ] )
// 4: function pg_connection_status(); // prototype:pg_connection_status ( resource $connection )
// 5: function pg_connection_busy(); // prototype:pg_connection_busy ( resource $connection )
// 6: function pg_connection_reset(); // prototype:pg_connection_reset ( resource $connection )
// 7: function pg_host(); // prototype:pg_host ([ resource $connection ] )
// 8: function pg_dbname(); // prototype:pg_dbname ([ resource $connection ] )
// 9: function pg_port(); // prototype:pg_port ([ resource $connection ] )
// 10: function pg_tty(); // prototype:pg_tty ([ resource $connection ] )
// 11: function pg_options(); // prototype:pg_options ([ resource $connection ] )
// 12: function pg_version(); // prototype:pg_version ([ resource $connection ] )
// 13: function pg_ping(); // prototype:pg_ping ([ resource $connection ] )
// 14: function pg_parameter_status(); // prototype:pg_parameter_status ([ resource $connection ], string $param_name )
// 15: function pg_transaction_status(); // prototype:pg_transaction_status ( resource $connection )
// 16: function pg_query(); // prototype:pg_query ([ resource $connection ], string $query )
// 17: function pg_query_params(); // prototype:pg_query_params ([ resource $connection ], string $query , array $params )
// 18: function pg_prepare(); // prototype:pg_prepare ([ resource $connection ], string $stmtname , string $query )
// 19: function pg_execute(); // prototype:pg_execute ([ resource $connection ], string $stmtname , array $params )
// 20: function pg_send_query(); // prototype:pg_send_query ( resource $connection , string $query )
// 21: function pg_send_query_params(); // prototype:pg_send_query_params ( resource $connection , string $query , array $params )
// 22: function pg_send_prepare(); // prototype:pg_send_prepare ( resource $connection , string $stmtname , string $query )
// 23: function pg_send_execute(); // prototype:pg_send_execute ( resource $connection , string $stmtname , array $params )
// 24: function pg_cancel_query(); // prototype:pg_cancel_query ( resource $connection )
// 25: function pg_fetch_result(); // prototype:pg_fetch_result ( resource $result , int $row , mixed $field )
// 26: function pg_fetch_row(); // prototype:pg_fetch_row ( resource $result [, int $row ] )
// 27: function pg_fetch_assoc(); // prototype:pg_fetch_assoc ( resource $result [, int $row ] )
// 28: function pg_fetch_array(); // prototype:pg_fetch_array ( resource $result [, int $row [, int $result_type ]] )
// 29: function pg_fetch_object(); // prototype:pg_fetch_object ( resource $result [, int $row [, int $result_type ]] )
// 30: function pg_fetch_all(); // prototype:pg_fetch_all ( resource $result )
// 31: function pg_fetch_all_columns(); // prototype:pg_fetch_all_columns ( resource $result [, int $column = 0 ] )
// 32: function pg_affected_rows(); // prototype:pg_affected_rows ( resource $result )
// 33: function pg_get_result(); // prototype:pg_get_result ([ resource $connection ] )
// 34: function pg_result_seek(); // prototype:pg_result_seek ( resource $result , int $offset )
// 35: function pg_result_status(); // prototype:pg_result_status ( resource $result [, int $type ] )
// 36: function pg_free_result(); // prototype:pg_free_result ( resource $result )
// 37: function pg_last_oid(); // prototype:pg_last_oid ( resource $result )
// 38: function pg_num_rows(); // prototype:pg_num_rows ( resource $result )
// 39: function pg_num_fields(); // prototype:pg_num_fields ( resource $result )
// 40: function pg_field_name(); // prototype:pg_field_name ( resource $result , int $field_number )
// 41: function pg_field_num(); // prototype:pg_field_num ( resource $result , string $field_name )
// 42: function pg_field_size(); // prototype:pg_field_size ( resource $result , int $field_number )
// 43: function pg_field_type(); // prototype:pg_field_type ( resource $result , int $field_number )
// 44: function pg_field_type_oid(); // prototype:pg_field_type_oid ( resource $result , int $field_number )
// 45: function pg_field_prtlen(); // prototype:pg_field_prtlen ( resource $result , int $row_number , mixed $field_name_or_number )
// 46: function pg_field_is_null(); // prototype:pg_field_is_null ( resource $result , int $row , mixed $field )
// 47: function pg_field_table(); // prototype:pg_field_table ( resource $result , int $field_number [, bool $oid_only = false ] )
// 48: function pg_get_notify(); // prototype:pg_get_notify ( resource $connection [, int $result_type ] )
// 49: function pg_get_pid(); // prototype:pg_get_pid ( resource $connection )
// 50: function pg_result_error(); // prototype:pg_result_error ( resource $result )
// 51: function pg_result_error_field(); // prototype:pg_result_error_field ( resource $result , int $fieldcode )
// 52: function pg_last_error(); // prototype:pg_last_error ([ resource $connection ] )
// 53: function pg_last_notice(); // prototype:pg_last_notice ( resource $connection )
// 54: function pg_put_line(); // prototype:pg_put_line ([ resource $connection ], string $data )
// 55: function pg_end_copy(); // prototype:pg_end_copy ([ resource $connection ] )
// 56: function pg_copy_to(); // prototype:pg_copy_to ( resource $connection , string $table_name [, string $delimiter [, string $null_as ]] )
// 57: function pg_copy_from(); // prototype:pg_copy_from ( resource $connection , string $table_name , array $rows [, string $delimiter [, string $null_as ]] )
// 58: function pg_trace(); // prototype:pg_trace ( string $pathname [, string $mode = &quot;w&quot; [, resource $connection ]] )
// 59: function pg_untrace(); // prototype:pg_untrace ([ resource $connection ] )
// 60: function pg_lo_create(); // prototype:pg_lo_create ([ resource $connection [, mixed $object_id ]] )
// 61: function pg_lo_unlink(); // prototype:pg_lo_unlink ( resource $connection , int $oid )
// 62: function pg_lo_open(); // prototype:pg_lo_open ( resource $connection , int $oid , string $mode )
// 63: function pg_lo_close(); // prototype:pg_lo_close ( resource $large_object )
// 64: function pg_lo_read(); // prototype:pg_lo_read ( resource $large_object [, int $len ] )
// 65: function pg_lo_write(); // prototype:pg_lo_write ( resource $large_object , string $data [, int $len ] )
// 66: function pg_lo_read_all(); // prototype:pg_lo_read_all ( resource $large_object )
// 67: function pg_lo_import(); // prototype:pg_lo_import ([ resource $connection ], string $pathname , mixed $object_id )
// 68: function pg_lo_export(); // prototype:pg_lo_export ([ resource $connection ], int $oid , string $pathname )
// 69: function pg_lo_seek(); // prototype:pg_lo_seek ( resource $large_object , int $offset [, int $whence = PGSQL_SEEK_CUR ] )
// 70: function pg_lo_tell(); // prototype:pg_lo_tell ( resource $large_object )
// 71: function pg_escape_string(); // prototype:pg_escape_string ([ resource $connection ], string $data )
// 72: function pg_escape_bytea(); // prototype:pg_escape_bytea ([ resource $connection ], string $data )
// 73: function pg_unescape_bytea(); // prototype:pg_unescape_bytea ( string $data )
// 74: function pg_set_error_verbosity(); // prototype:pg_set_error_verbosity ([ resource $connection ], int $verbosity )
// 75: function pg_client_encoding(); // prototype:pg_client_encoding ([ resource $connection ] )
// 76: function pg_set_client_encoding(); // prototype:pg_set_client_encoding ([ resource $connection ], string $encoding )
// 77: function pg_meta_data(); // prototype:pg_meta_data ( resource $connection , string $table_name )
// 78: function pg_convert(); // prototype:pg_convert ( resource $connection , string $table_name , array $assoc_array [, int $options = 0 ] )
// 79: function pg_insert(); // prototype:pg_insert ( resource $connection , string $table_name , array $assoc_array [, int $options = PGSQL_DML_EXEC ] )
// 80: function pg_update(); // prototype:pg_update ( resource $connection , string $table_name , array $data , array $condition [, int $options = PGSQL_DML_EXEC ] )
// 81: function pg_delete(); // prototype:pg_delete ( resource $connection , string $table_name , array $assoc_array [, int $options = PGSQL_DML_EXEC ] )
// 82: function pg_select(); // prototype:pg_select ( resource $connection , string $table_name , array $assoc_array [, int $options = PGSQL_DML_EXEC ] )
// 83:pg_exec: has been marked as 'INTERNAL' - skipping...
// 84:pg_getlastoid: has been marked as 'INTERNAL' - skipping...
// 85:pg_cmdtuples: has been marked as 'INTERNAL' - skipping...
// 86:pg_errormessage: has been marked as 'INTERNAL' - skipping...
// 87:pg_numrows: has been marked as 'INTERNAL' - skipping...
// 88:pg_numfields: has been marked as 'INTERNAL' - skipping...
// 89:pg_fieldname: has been marked as 'INTERNAL' - skipping...
// 90:pg_fieldsize: has been marked as 'INTERNAL' - skipping...
// 91:pg_fieldtype: has been marked as 'INTERNAL' - skipping...
// 92:pg_fieldnum: has been marked as 'INTERNAL' - skipping...
// 93:pg_fieldprtlen: has been marked as 'INTERNAL' - skipping...
// 94:pg_fieldisnull: has been marked as 'INTERNAL' - skipping...
// 95:pg_freeresult: has been marked as 'INTERNAL' - skipping...
// 96:pg_result: has been marked as 'INTERNAL' - skipping...
// 97:pg_loreadall: has been marked as 'INTERNAL' - skipping...
// 98:pg_locreate: has been marked as 'INTERNAL' - skipping...
// 99:pg_lounlink: has been marked as 'INTERNAL' - skipping...
// 100:pg_loopen: has been marked as 'INTERNAL' - skipping...
// 101:pg_loclose: has been marked as 'INTERNAL' - skipping...
// 102:pg_loread: has been marked as 'INTERNAL' - skipping...
// 103:pg_lowrite: has been marked as 'INTERNAL' - skipping...
// 104:pg_loimport: has been marked as 'INTERNAL' - skipping...
// 105:pg_loexport: has been marked as 'INTERNAL' - skipping...
// 106:pg_clientencoding: has been marked as 'INTERNAL' - skipping...
// 107:pg_setclientencoding: has been marked as 'INTERNAL' - skipping...

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension oci8

////////////////////////////////////////////////////////////////////////////////////
// WARNING: class OCI-Lob has an illegal name and is an internal/undocummented class; skipping....
// WARNING: class OCI-Collection has an illegal name and is an internal/undocummented class; skipping....
////////////////////////////////////////////////////////////////////////////////////

	define( 'OCI_DEFAULT',0);
	define( 'OCI_SYSOPER',4);
	define( 'OCI_SYSDBA',2);
	define( 'OCI_DESCRIBE_ONLY',16);
	define( 'OCI_COMMIT_ON_SUCCESS',32);
	define( 'OCI_EXACT_FETCH',2);
	define( 'OCI_SEEK_SET',0);
	define( 'OCI_SEEK_CUR',1);
	define( 'OCI_SEEK_END',2);
	define( 'OCI_LOB_BUFFER_FREE',1);
	define( 'SQLT_BFILEE',114);
	define( 'SQLT_CFILEE',115);
	define( 'SQLT_CLOB',112);
	define( 'SQLT_BLOB',113);
	define( 'SQLT_RDD',104);
	define( 'SQLT_INT',3);
	define( 'SQLT_NUM',2);
	define( 'SQLT_RSET',116);
	define( 'SQLT_AFC',96);
	define( 'SQLT_CHR',1);
	define( 'SQLT_VCS',9);
	define( 'SQLT_AVC',97);
	define( 'SQLT_STR',5);
	define( 'SQLT_LVC',94);
	define( 'SQLT_FLT',4);
	define( 'SQLT_UIN',68);
	define( 'SQLT_LNG',8);
	define( 'SQLT_LBI',24);
	define( 'SQLT_BIN',23);
	define( 'SQLT_ODT',156);
	define( 'SQLT_BDOUBLE',22);
	define( 'SQLT_BFLOAT',21);
	define( 'OCI_B_NTY',108);
	define( 'SQLT_NTY',108);
	define( 'OCI_SYSDATE','SYSDATE');
	define( 'OCI_B_BFILE',114);
	define( 'OCI_B_CFILEE',115);
	define( 'OCI_B_CLOB',112);
	define( 'OCI_B_BLOB',113);
	define( 'OCI_B_ROWID',104);
	define( 'OCI_B_CURSOR',116);
	define( 'OCI_B_BIN',23);
	define( 'OCI_B_INT',3);
	define( 'OCI_B_NUM',2);
	define( 'OCI_FETCHSTATEMENT_BY_COLUMN',16);
	define( 'OCI_FETCHSTATEMENT_BY_ROW',32);
	define( 'OCI_ASSOC',1);
	define( 'OCI_NUM',2);
	define( 'OCI_BOTH',3);
	define( 'OCI_RETURN_NULLS',4);
	define( 'OCI_RETURN_LOBS',8);
	define( 'OCI_DTYPE_FILE',56);
	define( 'OCI_DTYPE_LOB',50);
	define( 'OCI_DTYPE_ROWID',54);
	define( 'OCI_D_FILE',56);
	define( 'OCI_D_LOB',50);
	define( 'OCI_D_ROWID',54);
	define( 'OCI_TEMP_CLOB',2);
	define( 'OCI_TEMP_BLOB',1);

/////////////////// ********** FUNCTIONS (114 total functions) ************ ///////////////////////////////

// 1: function oci_define_by_name(); // prototype:oci_define_by_name ( resource $statement , string $column_name , mixed &amp;$variable [, int $type = SQLT_CHR ] )
// 2: function oci_bind_by_name(); // prototype:oci_bind_by_name ( resource $statement , string $ph_name , mixed &amp;$variable [, int $maxlength = -1 [, int $type = SQLT_CHR ]] )
// 3: function oci_bind_array_by_name(); // prototype:oci_bind_array_by_name ( resource $statement , string $name , array &amp;$var_array , int $max_table_length [, int $max_item_length = -1 [, int $type = SQLT_AFC ]] )
// 4: function oci_field_is_null(); // prototype:oci_field_is_null ( resource $statement , mixed $field )
// 5: function oci_field_name(); // prototype:oci_field_name ( resource $statement , int $field )
// 6: function oci_field_size(); // prototype:oci_field_size ( resource $statement , mixed $field )
// 7: function oci_field_scale(); // prototype:oci_field_scale ( resource $statement , int $field )
// 8: function oci_field_precision(); // prototype:oci_field_precision ( resource $statement , int $field )
// 9: function oci_field_type(); // prototype:oci_field_type ( resource $statement , int $field )
// 10: function oci_field_type_raw(); // prototype:oci_field_type_raw ( resource $statement , int $field )
// 11: function oci_execute(); // prototype:oci_execute ( resource $statement [, int $mode = OCI_COMMIT_ON_SUCCESS ] )
// 12: function oci_cancel(); // prototype:oci_cancel ( resource $statement )
// 13: function oci_fetch(); // prototype:oci_fetch ( resource $statement )
// 14: function oci_fetch_object(); // prototype:oci_fetch_object ( resource $statement )
// 15: function oci_fetch_row(); // prototype:oci_fetch_row ( resource $statement )
// 16: function oci_fetch_assoc(); // prototype:oci_fetch_assoc ( resource $statement )
// 17: function oci_fetch_array(); // prototype:oci_fetch_array ( resource $statement [, int $mode ] )
// 18: function ocifetchinto(); // prototype:ocifetchinto ( resource $statement , array &amp;$result [, int $mode ] )
// 19: function oci_fetch_all(); // prototype:oci_fetch_all ( resource $statement , array &amp;$output [, int $skip = 0 [, int $maxrows = -1 [, int $flags = 0 ]]] )
// 20: function oci_free_statement(); // prototype:oci_free_statement ( resource $statement )
// 21: function oci_internal_debug(); // prototype:oci_internal_debug ( bool $onoff )
// 22: function oci_num_fields(); // prototype:oci_num_fields ( resource $statement )
// 23: function oci_parse(); // prototype:oci_parse ( resource $connection , string $query )
// 24: function oci_new_cursor(); // prototype:oci_new_cursor ( resource $connection )
// 25: function oci_result(); // prototype:oci_result ( resource $statement , mixed $field )
// 26: function oci_server_version(); // prototype:oci_server_version ( resource $connection )
// 27: function oci_statement_type(); // prototype:oci_statement_type ( resource $statement )
// 28: function oci_num_rows(); // prototype:oci_num_rows ( resource $statement )
// 29: function oci_close(); // prototype:oci_close ( resource $connection )
// 30: function oci_connect(); // prototype:oci_connect ( string $username , string $password [, string $db [, string $charset [, int $session_mode ]]] )
// 31: function oci_new_connect(); // prototype:oci_new_connect ( string $username , string $password [, string $db [, string $charset [, int $session_mode ]]] )
// 32: function oci_pconnect(); // prototype:oci_pconnect ( string $username , string $password [, string $db [, string $charset [, int $session_mode ]]] )
// 33: function oci_error(); // prototype:oci_error ([ resource $source ] )
// 34:oci_free_descriptor: has been marked as 'INTERNAL' - skipping...
// 35: function oci_lob_save(); // (x)prototype:NOT FOUND: prototype for oci_lob_save!
// 36: function oci_lob_import(); // (x)prototype:NOT FOUND: prototype for oci_lob_import!
// 37: function oci_lob_size(); // (x)prototype:NOT FOUND: prototype for oci_lob_size!
// 38: function oci_lob_load(); // (x)prototype:NOT FOUND: prototype for oci_lob_load!
// 39: function oci_lob_read(); // (x)prototype:NOT FOUND: prototype for oci_lob_read!
// 40: function oci_lob_eof(); // (x)prototype:NOT FOUND: prototype for oci_lob_eof!
// 41: function oci_lob_tell(); // (x)prototype:NOT FOUND: prototype for oci_lob_tell!
// 42: function oci_lob_truncate(); // (x)prototype:NOT FOUND: prototype for oci_lob_truncate!
// 43: function oci_lob_erase(); // (x)prototype:NOT FOUND: prototype for oci_lob_erase!
// 44: function oci_lob_flush(); // (x)prototype:NOT FOUND: prototype for oci_lob_flush!
// 45:ocisetbufferinglob: has been marked as 'INTERNAL' - skipping...
// 46:ocigetbufferinglob: has been marked as 'INTERNAL' - skipping...
// 47: function oci_lob_is_equal(); // prototype:oci_lob_is_equal ( OCI-Lob $lob1 , OCI-Lob $lob2 )
// 48: function oci_lob_rewind(); // (x)prototype:NOT FOUND: prototype for oci_lob_rewind!
// 49: function oci_lob_write(); // (x)prototype:NOT FOUND: prototype for oci_lob_write!
// 50: function oci_lob_append(); // (x)prototype:NOT FOUND: prototype for oci_lob_append!
// 51: function oci_lob_copy(); // prototype:oci_lob_copy ( OCI-Lob $lob_to , OCI-Lob $lob_from [, int $length = 0 ] )
// 52: function oci_lob_export(); // (x)prototype:NOT FOUND: prototype for oci_lob_export!
// 53: function oci_lob_seek(); // (x)prototype:NOT FOUND: prototype for oci_lob_seek!
// 54: function oci_commit(); // prototype:oci_commit ( resource $connection )
// 55: function oci_rollback(); // prototype:oci_rollback ( resource $connection )
// 56: function oci_new_descriptor(); // prototype:oci_new_descriptor ( resource $connection [, int $type = OCI_DTYPE_LOB ] )
// 57: function oci_set_prefetch(); // prototype:oci_set_prefetch ( resource $statement , int $rows )
// 58: function oci_password_change(); // prototype:oci_password_change ( resource $connection , string $username , string $old_password , string $new_password )
// 59:oci_free_collection: has been marked as 'INTERNAL' - skipping...
// 60: function oci_collection_append(); // (x)prototype:NOT FOUND: prototype for oci_collection_append!
// 61: function oci_collection_element_get(); // (x)prototype:NOT FOUND: prototype for oci_collection_element_get!
// 62: function oci_collection_element_assign(); // (x)prototype:NOT FOUND: prototype for oci_collection_element_assign!
// 63: function oci_collection_assign(); // (x)prototype:NOT FOUND: prototype for oci_collection_assign!
// 64: function oci_collection_size(); // (x)prototype:NOT FOUND: prototype for oci_collection_size!
// 65: function oci_collection_max(); // (x)prototype:NOT FOUND: prototype for oci_collection_max!
// 66: function oci_collection_trim(); // (x)prototype:NOT FOUND: prototype for oci_collection_trim!
// 67: function oci_new_collection(); // prototype:oci_new_collection ( resource $connection , string $tdo [, string $schema = NULL ] )
// 68:oci_free_cursor: has been marked as 'INTERNAL' - skipping...
// 69: function ocifreecursor(); // ALIAS of oci_free_statement():ocifreecursor(...)
// 70: function ocibindbyname(); // ALIAS of oci_bind_by_name():ocibindbyname(...)
// 71: function ocidefinebyname(); // ALIAS of oci_define_by_name():ocidefinebyname(...)
// 72: function ocicolumnisnull(); // ALIAS of oci_field_is_null():ocicolumnisnull(...)
// 73: function ocicolumnname(); // ALIAS of oci_field_name():ocicolumnname(...)
// 74: function ocicolumnsize(); // ALIAS of oci_field_size():ocicolumnsize(...)
// 75: function ocicolumnscale(); // ALIAS of oci_field_scale():ocicolumnscale(...)
// 76: function ocicolumnprecision(); // ALIAS of oci_field_precision():ocicolumnprecision(...)
// 77: function ocicolumntype(); // ALIAS of oci_field_type():ocicolumntype(...)
// 78: function ocicolumntyperaw(); // ALIAS of oci_field_type_raw():ocicolumntyperaw(...)
// 79: function ociexecute(); // ALIAS of oci_execute():ociexecute(...)
// 80: function ocicancel(); // ALIAS of oci_cancel():ocicancel(...)
// 81: function ocifetch(); // ALIAS of oci_fetch():ocifetch(...)
// 82: function ocifetchstatement(); // ALIAS of oci_fetch_all():ocifetchstatement(...)
// 83: function ocifreestatement(); // ALIAS of oci_free_statement():ocifreestatement(...)
// 84: function ociinternaldebug(); // ALIAS of oci_internal_debug():ociinternaldebug(...)
// 85: function ocinumcols(); // ALIAS of oci_num_fields():ocinumcols(...)
// 86: function ociparse(); // ALIAS of oci_parse():ociparse(...)
// 87: function ocinewcursor(); // ALIAS of oci_new_cursor():ocinewcursor(...)
// 88: function ociresult(); // ALIAS of oci_result():ociresult(...)
// 89: function ociserverversion(); // ALIAS of oci_server_version():ociserverversion(...)
// 90: function ocistatementtype(); // ALIAS of oci_statement_type():ocistatementtype(...)
// 91: function ocirowcount(); // ALIAS of oci_num_rows():ocirowcount(...)
// 92: function ocilogoff(); // ALIAS of oci_close():ocilogoff(...)
// 93: function ocilogon(); // ALIAS of oci_connect():ocilogon(...)
// 94: function ocinlogon(); // ALIAS of oci_new_connect():ocinlogon(...)
// 95: function ociplogon(); // ALIAS of oci_pconnect():ociplogon(...)
// 96: function ocierror(); // ALIAS of oci_error():ocierror(...)
// 97: function ocifreedesc(); // ALIAS of n.ocifreedesc" 
// 98: function ocisavelob(); // ALIAS of OCI-Lob->save
// 99: function ocisavelobfile(); // ALIAS of OCI-Lob->import
// 100: function ociwritelobtofile(); // ALIAS of n.ociwritelobtofile" 
// 101: function ociloadlob(); // ALIAS of n.ociloadlob" 
// 102: function ocicommit(); // ALIAS of oci_commit():ocicommit(...)
// 103: function ocirollback(); // ALIAS of oci_rollback():ocirollback(...)
// 104: function ocinewdescriptor(); // ALIAS of oci_new_descriptor():ocinewdescriptor(...)
// 105: function ocisetprefetch(); // ALIAS of oci_set_prefetch():ocisetprefetch(...)
// 106:ocipasswordchange: has been marked as 'INTERNAL' - skipping...
// 107: function ocifreecollection(); // ALIAS of n.ocifreecollection" 
// 108: function ocinewcollection(); // ALIAS of oci_new_collection():ocinewcollection(...)
// 109: function ocicollappend(); // ALIAS of n.ocicollappend" 
// 110: function ocicollgetelem(); // ALIAS of n.ocicollgetelem" 
// 111: function ocicollassignelem(); // ALIAS of n.ocicollassignelem" 
// 112: function ocicollsize(); // ALIAS of n.ocicollsize" 
// 113: function ocicollmax(); // ALIAS of n.ocicollmax" 
// 114: function ocicolltrim(); // ALIAS of n.ocicolltrim" 

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension ibm_db2 [static information!] 
	define( 'DB2_BINARY','');
	define( 'DB2_CONVERT','');
	define( 'DB2_PASSTHRU','');
	define( 'DB2_SCROLLABLE','');
	define( 'DB2_FORWARD_ONLY','');
	define( 'DB2_PARAM_IN','');
	define( 'DB2_PARAM_OUT','');
	define( 'DB2_PARAM_INOUT','');
	define( 'DB2_PARAM_FILE','');
	define( 'DB2_AUTOCOMMIT_ON','');
	define( 'DB2_AUTOCOMMIT_OFF','');
	define( 'DB2_DOUBLE','');
	define( 'DB2_LONG','');
	define( 'DB2_CHAR','');
	define( 'DB2_CASE_NATURAL','');
	define( 'DB2_CASE_LOWER','');
	define( 'DB2_CASE_UPPER','');
	define( 'DB2_DEFERRED_PREPARE_ON','');
	define( 'DB2_DEFERRED_PREPARE_OFF','');
// 1: function db2_autocommit(); // prototype:db2_autocommit ( resource $connection [, bool $value ] )
// 2: function db2_bind_param(); // prototype:db2_bind_param ( resource $stmt , int $parameter-number , string $variable-name [, int $parameter-type [, int $data-type = 0 [, int $precision = -1 [, int $scale = 0 ]]]] )
// 3: function db2_client_info(); // prototype:db2_client_info ( resource $connection )
// 4: function db2_close(); // prototype:db2_close ( resource $connection )
// 5: function db2_column_privileges(); // prototype:db2_column_privileges ( resource $connection [, string $qualifier [, string $schema [, string $table-name [, string $column-name ]]]] )
// 6: function db2_columns(); // prototype:db2_columns ( resource $connection [, string $qualifier [, string $schema [, string $table-name [, string $column-name ]]]] )
// 7: function db2_commit(); // prototype:db2_commit ( resource $connection )
// 8: function db2_conn_error(); // prototype:db2_conn_error ([ resource $connection ] )
// 9: function db2_conn_errormsg(); // prototype:db2_conn_errormsg ([ resource $connection ] )
// 10: function db2_connect(); // prototype:db2_connect ( string $database , string $username , string $password [, array $options ] )
// 11: function db2_cursor_type(); // prototype:db2_cursor_type ( resource $stmt )
// 12: function db2_escape_string(); // prototype:db2_escape_string ( string $string_literal )
// 13: function db2_exec(); // prototype:db2_exec ( resource $connection , string $statement [, array $options ] )
// 14: function db2_execute(); // prototype:db2_execute ( resource $stmt [, array $parameters ] )
// 15: function db2_fetch_array(); // prototype:db2_fetch_array ( resource $stmt [, int $row_number = -1 ] )
// 16: function db2_fetch_assoc(); // prototype:db2_fetch_assoc ( resource $stmt [, int $row_number = -1 ] )
// 17: function db2_fetch_both(); // prototype:db2_fetch_both ( resource $stmt [, int $row_number = -1 ] )
// 18: function db2_fetch_object(); // prototype:db2_fetch_object ( resource $stmt [, int $row_number = -1 ] )
// 19: function db2_fetch_row(); // prototype:db2_fetch_row ( resource $stmt [, int $row_number ] )
// 20: function db2_field_display_size(); // prototype:db2_field_display_size ( resource $stmt , mixed $column )
// 21: function db2_field_name(); // prototype:db2_field_name ( resource $stmt , mixed $column )
// 22: function db2_field_num(); // prototype:db2_field_num ( resource $stmt , mixed $column )
// 23: function db2_field_precision(); // prototype:db2_field_precision ( resource $stmt , mixed $column )
// 24: function db2_field_scale(); // prototype:db2_field_scale ( resource $stmt , mixed $column )
// 25: function db2_field_type(); // prototype:db2_field_type ( resource $stmt , mixed $column )
// 26: function db2_field_width(); // prototype:db2_field_width ( resource $stmt , mixed $column )
// 27: function db2_foreign_keys(); // prototype:db2_foreign_keys ( resource $connection , string $qualifier , string $schema , string $table-name )
// 28: function db2_free_result(); // prototype:db2_free_result ( resource $stmt )
// 29: function db2_free_stmt(); // prototype:db2_free_stmt ( resource $stmt )
// 30: function db2_get_option(); // prototype:db2_get_option ( resource $resource , string $option )
// 31: function db2_last_insert_id(); // prototype:db2_last_insert_id ( resource $resource )
// 32: function db2_lob_read(); // prototype:db2_lob_read ( resource $stmt , int $colnum , int $length )
// 33: function db2_next_result(); // prototype:db2_next_result ( resource $stmt )
// 34: function db2_num_fields(); // prototype:db2_num_fields ( resource $stmt )
// 35: function db2_num_rows(); // prototype:db2_num_rows ( resource $stmt )
// 36: function db2_pclose(); // prototype:db2_pclose ( resource $resource )
// 37: function db2_pconnect(); // prototype:db2_pconnect ( string $database , string $username , string $password [, array $options ] )
// 38: function db2_prepare(); // prototype:db2_prepare ( resource $connection , string $statement [, array $options ] )
// 39: function db2_primary_keys(); // prototype:db2_primary_keys ( resource $connection , string $qualifier , string $schema , string $table-name )
// 40: function db2_procedure_columns(); // prototype:db2_procedure_columns ( resource $connection , string $qualifier , string $schema , string $procedure , string $parameter )
// 41: function db2_procedures(); // prototype:db2_procedures ( resource $connection , string $qualifier , string $schema , string $procedure )
// 42: function db2_result(); // prototype:db2_result ( resource $stmt , mixed $column )
// 43: function db2_rollback(); // prototype:db2_rollback ( resource $connection )
// 44: function db2_server_info(); // prototype:db2_server_info ( resource $connection )
// 45: function db2_set_option(); // prototype:db2_set_option ( resource $resource , array $options , int $type )
// 46: function db2_special_columns(); // prototype:db2_special_columns ( resource $connection , string $qualifier , string $schema , string $table_name , int $scope )
// 47: function db2_statistics(); // prototype:db2_statistics ( resource $connection , string $qualifier , string $schema , string $table-name , bool $unique )
// 48: function db2_stmt_error(); // prototype:db2_stmt_error ([ resource $stmt ] )
// 49: function db2_stmt_errormsg(); // prototype:db2_stmt_errormsg ([ resource $stmt ] )
// 50: function db2_table_privileges(); // prototype:db2_table_privileges ( resource $connection [, string $qualifier [, string $schema [, string $table_name ]]] )
// 51: function db2_tables(); // prototype:db2_tables ( resource $connection [, string $qualifier [, string $schema [, string $table-name [, string $table-type ]]]] )
?>

<?php //Extension ldap
	define( 'LDAP_DEREF_NEVER',0);
	define( 'LDAP_DEREF_SEARCHING',1);
	define( 'LDAP_DEREF_FINDING',2);
	define( 'LDAP_DEREF_ALWAYS',3);
	define( 'LDAP_OPT_DEREF',2);
	define( 'LDAP_OPT_SIZELIMIT',3);
	define( 'LDAP_OPT_TIMELIMIT',4);
	define( 'LDAP_OPT_PROTOCOL_VERSION',17);
	define( 'LDAP_OPT_ERROR_NUMBER',49);
	define( 'LDAP_OPT_REFERRALS',8);
	define( 'LDAP_OPT_RESTART',9);
	define( 'LDAP_OPT_HOST_NAME',48);
	define( 'LDAP_OPT_ERROR_STRING',50);
	define( 'LDAP_OPT_MATCHED_DN',51);
	define( 'LDAP_OPT_SERVER_CONTROLS',18);
	define( 'LDAP_OPT_CLIENT_CONTROLS',19);
	define( 'LDAP_OPT_DEBUG_LEVEL',20481);

/////////////////// ********** FUNCTIONS (39 total functions) ************ ///////////////////////////////

// 1: function ldap_connect(); // prototype:ldap_connect ([ string $hostname = NULL [, int $port = 389 ]] )
// 2: function ldap_close(); // ALIAS of ldap_unbind():ldap_close(...)
// 3: function ldap_bind(); // prototype:ldap_bind ( resource $link_identifier [, string $bind_rdn = NULL [, string $bind_password = NULL ]] )
// 4: function ldap_unbind(); // prototype:ldap_unbind ( resource $link_identifier )
// 5: function ldap_read(); // prototype:ldap_read ( resource $link_identifier , string $base_dn , string $filter [, array $attributes [, int $attrsonly [, int $sizelimit [, int $timelimit [, int $deref ]]]]] )
// 6: function ldap_list(); // prototype:ldap_list ( resource $link_identifier , string $base_dn , string $filter [, array $attributes [, int $attrsonly [, int $sizelimit [, int $timelimit [, int $deref ]]]]] )
// 7: function ldap_search(); // prototype:ldap_search ( resource $link_identifier , string $base_dn , string $filter [, array $attributes [, int $attrsonly [, int $sizelimit [, int $timelimit [, int $deref ]]]]] )
// 8: function ldap_free_result(); // prototype:ldap_free_result ( resource $result_identifier )
// 9: function ldap_count_entries(); // prototype:ldap_count_entries ( resource $link_identifier , resource $result_identifier )
// 10: function ldap_first_entry(); // prototype:ldap_first_entry ( resource $link_identifier , resource $result_identifier )
// 11: function ldap_next_entry(); // prototype:ldap_next_entry ( resource $link_identifier , resource $result_entry_identifier )
// 12: function ldap_get_entries(); // prototype:ldap_get_entries ( resource $link_identifier , resource $result_identifier )
// 13: function ldap_first_attribute(); // prototype:ldap_first_attribute ( resource $link_identifier , resource $result_entry_identifier )
// 14: function ldap_next_attribute(); // prototype:ldap_next_attribute ( resource $link_identifier , resource $result_entry_identifier )
// 15: function ldap_get_attributes(); // prototype:ldap_get_attributes ( resource $link_identifier , resource $result_entry_identifier )
// 16: function ldap_get_values(); // prototype:ldap_get_values ( resource $link_identifier , resource $result_entry_identifier , string $attribute )
// 17: function ldap_get_values_len(); // prototype:ldap_get_values_len ( resource $link_identifier , resource $result_entry_identifier , string $attribute )
// 18: function ldap_get_dn(); // prototype:ldap_get_dn ( resource $link_identifier , resource $result_entry_identifier )
// 19: function ldap_explode_dn(); // prototype:ldap_explode_dn ( string $dn , int $with_attrib )
// 20: function ldap_dn2ufn(); // prototype:ldap_dn2ufn ( string $dn )
// 21: function ldap_add(); // prototype:ldap_add ( resource $link_identifier , string $dn , array $entry )
// 22: function ldap_delete(); // prototype:ldap_delete ( resource $link_identifier , string $dn )
// 23: function ldap_modify(); // prototype:ldap_modify ( resource $link_identifier , string $dn , array $entry )
// 24: function ldap_mod_add(); // prototype:ldap_mod_add ( resource $link_identifier , string $dn , array $entry )
// 25: function ldap_mod_replace(); // prototype:ldap_mod_replace ( resource $link_identifier , string $dn , array $entry )
// 26: function ldap_mod_del(); // prototype:ldap_mod_del ( resource $link_identifier , string $dn , array $entry )
// 27: function ldap_errno(); // prototype:ldap_errno ( resource $link_identifier )
// 28: function ldap_err2str(); // prototype:ldap_err2str ( int $errno )
// 29: function ldap_error(); // prototype:ldap_error ( resource $link_identifier )
// 30: function ldap_compare(); // prototype:ldap_compare ( resource $link_identifier , string $dn , string $attribute , string $value )
// 31: function ldap_sort(); // prototype:ldap_sort ( resource $link , resource $result , string $sortfilter )
// 32: function ldap_rename(); // prototype:ldap_rename ( resource $link_identifier , string $dn , string $newrdn , string $newparent , bool $deleteoldrdn )
// 33: function ldap_get_option(); // prototype:ldap_get_option ( resource $link_identifier , int $option , mixed &amp;$retval )
// 34: function ldap_set_option(); // prototype:ldap_set_option ( resource $link_identifier , int $option , mixed $newval )
// 35: function ldap_first_reference(); // prototype:ldap_first_reference ( resource $link , resource $result )
// 36: function ldap_next_reference(); // prototype:ldap_next_reference ( resource $link , resource $entry )
// 37: function ldap_parse_reference(); // prototype:ldap_parse_reference ( resource $link , resource $entry , array &amp;$referrals )
// 38: function ldap_parse_result(); // prototype:ldap_parse_result ( resource $link , resource $result , int &amp;$errcode [, string &amp;$matcheddn [, string &amp;$errmsg [, array &amp;$referrals ]]] )
// 39: function ldap_start_tls(); // prototype:ldap_start_tls ( resource $link )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
