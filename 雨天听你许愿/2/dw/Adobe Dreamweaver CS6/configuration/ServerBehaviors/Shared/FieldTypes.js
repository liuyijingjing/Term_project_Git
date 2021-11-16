
function FieldTypes() {
	throw("FieldTypes is a static class.");
}

FieldTypes.labelToValueHash = {
	"BigInt": 20,
	"Boolean": 11,
	"BSTR": 8,
	"Char": 129,
	"Currency": 6,
	"Date": 7,
	"DBDate": 133,
	"DBTime": 134,
	"DBTimeStamp": 135,
	"Decimal": 14,
	"Double": 5,
	"Integer": 3,
	"LongVarChar": 201,
	"LongVarWChar": 203,
	"Numeric": 131,
	"Single": 4,
	"SmallInt": 2,
	"TinyInt": 16,
	"UnsignedBigInt": 21,
	"UnsignedInt": 19,
	"UnsignedSmallInt": 18,
	"UnsignedTinyInt": 17,
	"VarChar": 200,
	"VarNumeric": 131,
	"VarWChar": 202,
	"WChar": 130
}

FieldTypes.valueToLabelHash = {
	 20: "BigInt",
	 11: "Boolean",
	  8: "BSTR",
	129: "Char",
	  6: "Currency",
	  7: "Date",
	133: "DBDate",
	134: "DBTime",
	135: "DBTimeStamp",
	 14: "Decimal",
	  5: "Double",
	  3: "Integer",
	201: "LongVarChar",
	203: "LongVarWChar",
	131: "Numeric",
	  4: "Single",
	  2: "SmallInt",
	 16: "TinyInt",
	 21: "UnsignedBigInt",
	 19: "UnsignedInt",
	 18: "UnsignedSmallInt",
	 17: "UnsignedTinyInt",
	200: "VarChar",
	131: "VarNumeric",
	202: "VarWChar",
	130: "WChar"
}

FieldTypes.castingHash = {
	 "20":   "5"/*"3"*/,	/*adBigInt => adInteger */
	"128":  "-1",	/*adBinary => N/A */
	 "11":  "11"/*"3"*/,	/*adBoolean => adInteger */
	  "8": "200",	/*adBSTR => adVarChar */
	"129": "200",	/*adChar => adVarChar */
	  "6":   "5"/*"3"*/,	/*adCurrency => adInteger */
	  "7": "135",	/*adDate => adDBTimeStamp */
	"133": "135",	/*adDBDate => adDBTimeStamp */
	"134": "135",	/*adDBTime => adDBTimeStamp */
	"135": "135",	/*adDBTimeStamp => adDBTimeStamp */
	 "14":   "5",	/*adDecimal => adDouble */
	  "5":   "5",	/*adDouble => adDouble */
	  "0":  "-1",	/*adEmpty => N/A */
	 "10":  "-1",	/*adError => N/A */
	 "72": "200",	/*adGUID => adVarChar */
	  "9":  "-1",	/*adIDispatch => N/A */
	  "3":   "5"/*"3"*/,	/*adInteger => adInteger */
	 "13":  "-1",	/*adIUnknown => N/A */
	"205":  "-1",	/*adLongVarBinary => N/A */
	"201": "200",	/*adLongVarChar => adVarChar */
	"203": "200",	/*adLongVarWChar => adVarChar */
	"131":   "5",	/*adNumeric => adDouble */
	  "4":   "5",	/*adSingle => adDouble */
	  "2":   "5"/*"3"*/,	/*adSmallInt => adInteger */
	 "16":   "5"/*"3"*/,	/*adTinyInt => adInteger */
	 "21":   "5"/*"3"*/,	/*adUnsignedBigInt => adInteger */
	 "19":   "5"/*"3"*/,	/*adUnsignedInt => adInteger */
	 "18":   "5"/*"3"*/,	/*adUnsignedSmallInt => adInteger */
	 "17":   "5"/*"3"*/,	/*adUnsignedTinyInt => adInteger */
	"132":  "-1",	/*adUserDefined => N/A */
	"204":  "-1",	/*adVarBinary => N/A */
	"200": "200",	/*adVarChar => adVarChar */
	 "12":  "-1",	/*adVariant => N/A */
	"202": "200",	/*adVarWChar => adVarChar */
	"130": "200"	/*adWChar => adVarChar */
}

FieldTypes.sbTypeToDisplayName = {
	 "-1": "N/A",
	  "5": "adDouble",
	 "11": "adBoolean",
	"135": "adDBTimeStamp",
	"200": "adVarChar",
	"201": "adLongVarChar",
	"202": "adVarWChar",
	"203": "adLongVarWChar"
}

FieldTypes.dbTypeToDisplayNameHash = {
	  "5": "Numeric",
	 "11": "Boolean",
	"135": "Date",
	"200": "Text"
}

FieldTypes.castDBType				= FieldTypes_castDBType;
FieldTypes.getParamTypeForSimpleSQL	= FieldTypes_getParamTypeForSimpleSQL;
FieldTypes.getCastLabels			= FieldTypes_getCastLabels;
FieldTypes.getCastValues			= FieldTypes_getCastValues;
FieldTypes.getDisplayNameForDBType	= FieldTypes_getDisplayNameForDBType;
FieldTypes.getFilterColumnObject	= FieldTypes_getFilterColumnObject;
FieldTypes.getFieldType				= FieldTypes_getFieldType;
FieldTypes.getFieldTypeFromArray	= FieldTypes_getFieldTypeFromArray;
FieldTypes.getFieldTypeFromObj		= FieldTypes_getFieldTypeFromObj;
FieldTypes.getFieldSizeFromArray	= FieldTypes_getFieldSizeFromArray;
FieldTypes.getFieldSizeFromObj		= FieldTypes_getFieldSizeFromObj;
FieldTypes.getFieldObj				= FieldTypes_getFieldObj;
FieldTypes.getSQLTokens				= FieldTypes_getSQLTokens;
FieldTypes.getTablesFromSQL			= FieldTypes_getTablesFromSQL;
FieldTypes.getStrippedTableName		= FieldTypes_getStrippedTableName;
FieldTypes.addParameter				= FieldTypes_addParameter;
FieldTypes.addParameterToStructure	= FieldTypes_addParameterToStructure;
FieldTypes.getParameterExpression	= FieldTypes_getParameterExpression;
FieldTypes.parseParameterExpression	= FieldTypes_parseParameterExpression;
FieldTypes.getParameterTypeDisplayName= FieldTypes_getParameterTypeDisplayName;
FieldTypes.encodeSQLReference		= FieldTypes_encodeSQLReference;
FieldTypes.decodeSQLReference		= FieldTypes_decodeSQLReference;
FieldTypes.checkSizeForRSParameter	= FieldTypes_checkSizeForRSParameter;
FieldTypes.initializeStructure		= FieldTypes_initializeStructure;



//--------------------------------------------------------------------
// FUNCTION:
//   castDBType
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_castDBType(dbType, notFromRS) {
	var retVal = -1;
	if (dbType && FieldTypes.castingHash[dbType.toString()]) {
		retVal = FieldTypes.castingHash[dbType.toString()];
		retVal = parseInt(retVal);
		if (notFromRS) {
			if (retVal == 200) {
				retVal = 201;
			}
			if (retVal == 11) {
				retVal = 5;
			}
			if (dbType.toString() == "130") {
				retVal = 203;
			}
		}
	}
	return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getParamTypeForSimpleSQL
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getParamTypeForSimpleSQL(connectionName, sqlObjOrSQL) {
	var retVal = false;
	var sqlObj;
	if (typeof(sqlObjOrSQL) == "string") {
		sqlObj = ParseSimpleSQL(sqlObjOrSQL);
	} else {
		sqlObj = sqlObjOrSQL;
	}

	if (sqlObj) {
		var paramDBType = -1;
		var columns = MMDB.getColumns(connectionName, FieldTypes.decodeSQLReference(sqlObj.table));
		for (var i=0; i<columns.length; i++) {
			if (columns[i].name == FieldTypes.decodeSQLReference(sqlObj.filterColumn)) {
				paramDBType = columns[i].datatype;
				break;
			}
		}
		retVal = paramDBType;
	}

	return paramDBType;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getCastLabels
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getCastLabels(castValues) {
	var retArray = new Array();

	if (typeof(castValues) == "undefined") {
		castValues = FieldTypes.getCastValues();
	}

	for (var i=0; i<castValues.length; i++) {
		retArray.push(FieldTypes.getDisplayNameForDBType(castValues[i]));
	}

	return retArray;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getCastValues
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getCastValues() {
	var retArray = new Array();
	var temp;

	for (var i in FieldTypes.castingHash) {
		temp = parseInt(FieldTypes.castingHash[i]);
		if ((temp != -1) && (dwscripts.findInArray(retArray, temp) == -1)) {
			retArray.push(temp);
		}
	}

	return retArray;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getDisplayNameForDBType
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getDisplayNameForDBType(dbType) {
	var retVal;
	var tempDBType, tempVal;
	tempDBType = FieldTypes.castDBType(dbType);
	tempVal = tempDBType.toString();

	retVal = FieldTypes.dbTypeToDisplayNameHash[tempVal];
	retVal = (typeof(retVal) != "undefined") ? retVal : "N/A";

	return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getFilterColumnObject
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getFilterColumnObject(connectionName, sqlObjOrSQL) {
	var retVal = null;
	var sqlObj;
	if (typeof(sqlObjOrSQL) == "string") {
		sqlObj = ParseSimpleSQL(sqlObjOrSQL);
	} else {
		sqlObj = sqlObjOrSQL;
	}

	if (sqlObj) {
		var columns = MMDB.getColumns(connectionName, FieldTypes.decodeSQLReference(sqlObj.table));
		for (var i=0; i<columns.length; i++) {
			if (columns[i].name == FieldTypes.decodeSQLReference(sqlObj.filterColumn)) {
				retVal = columns[i];
				break;
			}
		}
	}
	return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getFieldType
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getFieldType(connectionName, tableName, columnName) {
	var cols = MMDB.getColumns(connectionName, tableName);
	var dbType = -1;
	for (var i=0; i<cols.length; i++) {
		if (cols[i].name == FieldTypes.decodeSQLReference(columnName)) {
			dbType = cols[i].datatype;
		}
	}
	return dbType;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getFieldTypeFromArray
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getFieldTypeFromArray(cols, columnName, doNotCast) {
	var dbType = -1;
	for (var i=0; i<cols.length; i++) {
		if (cols[i].name == FieldTypes.decodeSQLReference(columnName)) {
			dbType = FieldTypes.getFieldTypeFromObj(cols[i], doNotCast);
		}
	}
	return dbType;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getFieldTypeFromObj
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getFieldTypeFromObj(obj, doNotCast) {
	var retVal = -1;
	if (obj) {
		retVal = obj.datatype;
		if (!doNotCast) {
			retVal = FieldTypes.castDBType(retVal);
		}
	}
	return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getFieldSizeFromArray
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getFieldSizeFromArray(cols, columnName) {
	var dbType = -1;
	for (var i=0; i<cols.length; i++) {
		if (cols[i].name == FieldTypes.decodeSQLReference(columnName)) {
			dbType = FieldTypes.getFieldSizeFromObj(cols[i]);
		}
	}
	return dbType;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getFieldSizeFromObj
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getFieldSizeFromObj(obj) {
	var retVal = -1;
	if (obj && (FieldTypes.castDBType(obj.datatype) == 200)) {
		if (typeof(obj.definedsize) != "undefined") {
			retVal = parseInt(obj.definedsize);
			if (retVal.toString() == "NaN") {
				retVal = -1;
			}
		}
	}
	return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getFieldObj
//
// DESCRIPTION:
//   This function reads all tables given by tableNameOrArray string/array
//   and looks for the given fieldName. If found a field havind the name
//   as the given one, the search is stopped and the object is returned.
//
// ARGUMENTS:
//   connectionName (string) - the connection name
//   tableNameOrArray (string or array) - a table name OR an array of table names
//   fieldName (string) - the field name to check
//
// RETURNS:
//   (object) - the fisrt field object found / null if none was found withinin the table(s) list
//--------------------------------------------------------------------
function FieldTypes_getFieldObj(connectionName, tableNameOrArray, fieldName) {
	var retObj = null;
	var tables = new Array().concat(tableNameOrArray);
	var columns;

	for (var i=0; ((i<tables.length) && (!retObj)); i++) {
		columns = MMDB.getColumns(connectionName, FieldTypes.decodeSQLReference(tables[i]));
		for (var j=0; j<columns.length; j++) {
			if (columns[j].name == FieldTypes.decodeSQLReference(fieldName)) {
				retObj = columns[j];
				break;
			}
		}
	}

	return retObj;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getSQLTokens
//
// DESCRIPTION:
//   This function splits all SQL content into small tokens; all of
//   those tokens are possible tobale names. Later, we'll get all tables
//   for the given connection and check table names against all those
//   tokens, and only tokens that match will be considered the tables
//   from the current SQL.
//
// ARGUMENTS:
//   sql (string) - the SQL (simple one, returned by decodeVarRefs() method)
//
// RETURNS:
//   (array) - an array of tokens
//--------------------------------------------------------------------
function FieldTypes_getSQLTokens(sql) {
	var tokens = new Array();

	sql = sql.match(/from(.*)$/i)[1];

	while (sql.match(/\[[^\]]+\]/gi)) {
		tokens.push(sql.match(/\[([^\]]+)\]/i)[1]);
		sql = sql.replace(/\[[^\]]+\]/i, "");
	}

	sql = sql.replace(/[,\(\)\=\>\<\%\#\&\*\+\|]/gi, " ");
	sql = sql.replace(/(^\s+|\s+$)/gi, "");
	sql = sql.replace(/\s+/gi, ",");

	tokens = tokens.concat(sql.split(","));

	var temp;
	for (var i=0; i<tokens.length; i++) {
		temp = FieldTypes.getStrippedTableName(tokens[i]);
		if (temp != tokens[i]) {
			tokens.push(temp);
		}
	}

	return tokens;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getTablesFromSQL
//
// DESCRIPTION:
//   This function calls the getSQLTokens() method to obtain all SQL
//   tokens and then reads all tables from the current connection;
//   eventually, each table name is checked against all tokens. The
//   ones which match the comparion are considered tables from the
//   current SQL and are returned by this method
//
// ARGUMENTS:
//   connectionName (string) - the connection name
//   sql (string) - the SQL to test
//
// RETURNS:
//   (array) - a list of tables from the current SQL
//--------------------------------------------------------------------
function FieldTypes_getTablesFromSQL(connectionName, sql) {
	var sqlTables = new Array();
	
	var tables = MMDB.getTables(connectionName);
	var tokens = FieldTypes.getSQLTokens(sql);

	var tempTableNameAll, tempTableName;
	for (var i=0; i<tables.length; i++) {
		tempTableNameAll = FieldTypes.decodeSQLReference(tables[i].table);
		tempTableName = FieldTypes.getStrippedTableName(tempTableNameAll);
		if (dwscripts.findInArray(tokens, tempTableNameAll) != -1) {
			sqlTables.push(tempTableNameAll);
		} else if (dwscripts.findInArray(tokens, tempTableName) != -1) {
			sqlTables.push(tempTableName);
		}
	}

	return sqlTables;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getStrippedTableName
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getStrippedTableName(tableName) {
	var retStr = tableName;
	var matches = tableName.match(/\.?([^\.]+)$/i);
	if (matches && matches[1]) {
		retStr = matches[1];
	}
	return retStr;
}


//--------------------------------------------------------------------
// FUNCTION:
//   addParameter
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
//function FieldTypes_addParameter(paramObj, paramType, paramSize, paramValue, addIIFToValue, falseValue, theParamName) {
function FieldTypes_addParameter(paramObj, paramType, paramSize, paramValue, addIIFToValue, forceNumeric) {
	if (typeof(paramObj.paramName) == "undefined") {
		FieldTypes.initializeStructure(paramObj);
	}
	var tempParamValue = paramValue;
	if ((FieldTypes.castDBType(paramType) != 200) && (addIIFToValue)) {
		var tempObj = extPart.findInString("parameterValue", tempParamValue);
		if (tempObj && tempObj.formControl) {
			tempObj.trueValue = tempParamValue;
//			tempObj.falseValue = (typeof(falseValue) != "undefined") ? falseValue : "null";
			tempObj.falseValue = "null";
			tempParamValue = extPart.getInsertString("", "parameterValue", tempObj);
			paramObj.needIIFInPage = true;
		}
	}
//	var paramName = (typeof(theParamName) == "undefined") ? "param" + (paramObj.paramName.length + 1).toString() : theParamName;
//	paramObj.paramName.push(paramName);

	if ((paramType == "203") && (paramSize < 100000000)) {
		paramType = "202";
	}

	paramObj.paramName.push("param" + (paramObj.paramName.length + 1).toString());
	paramObj.paramType.push(!forceNumeric ? paramType : "5");
	paramObj.paramDirection.push("1");
	paramObj.paramSize.push(!forceNumeric ? paramSize : "-1");
	paramObj.paramValue.push(tempParamValue);
	paramObj.paramTypeDisplayName.push(FieldTypes.getParameterTypeDisplayName(paramType));
	if (paramObj && paramObj.paramIndex && paramObj.paramIndex.push) {
		paramObj.paramIndex.push(paramObj.paramName.length);
	}
}


//--------------------------------------------------------------------
// FUNCTION:
//   addParameterToStructure
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   paramObj
//   paramName
//   paramType
//   paramSize
//   expression
//   trueValue
//   falseValue
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_addParameterToStructure(paramObj, paramName, paramType, paramSize, expression, trueValue, falseValue) {
	if (typeof(paramObj.paramName) == "undefined") {
		FieldTypes.initializeStructure(paramObj);
	}
	var tempParamValue = expression;
	if (trueValue != "") {
		tempParamValue = FieldTypes.getParameterExpression(expression, trueValue, falseValue);
		paramObj.needIIFInPage = true;
	}
	paramObj.paramName.push(paramName);
	paramObj.paramType.push(paramType);
	paramObj.paramDirection.push("1");
	paramObj.paramSize.push(paramSize);
	paramObj.paramValue.push(tempParamValue);
	paramObj.paramTypeDisplayName.push(FieldTypes.getParameterTypeDisplayName(paramType));
	if (paramObj && paramObj.paramIndex && paramObj.paramIndex.push) {
		paramObj.paramIndex.push(paramObj.paramName.length);
	}
}


//--------------------------------------------------------------------
// FUNCTION:
//   getParameterExpression
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   expression
//   trueValue
//   falseValue
//
// RETURNS:
//   (string)
//--------------------------------------------------------------------
function FieldTypes_getParameterExpression(expression, trueValue, falseValue) {
	var retStr = expression;

	if (trueValue || falseValue) {
		var tempObj = new Object();
		tempObj.expression = expression;
		tempObj.trueValue = trueValue ? trueValue : "";
		tempObj.falseValue = falseValue ? falseValue : "";
		retStr = extPart.getInsertString("", "parameterGeneralValue", tempObj);
	}

	return retStr;
}


//--------------------------------------------------------------------
// FUNCTION:
//   parseParameterExpression
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   parameter
//
// RETURNS:
//   (object) -
//--------------------------------------------------------------------
function FieldTypes_parseParameterExpression(parameter) {
	var tempObj = extPart.findInString("parameterGeneralValue", parameter);
	if (!tempObj || !tempObj.expression) {
		tempObj = new Object();
		tempObj.expression = parameter;
		tempObj.trueValue = "";
		tempObj.falseValue = "";
	}
	return tempObj;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getParameterTypeDisplayName
//
// DESCRIPTION:
//   This function...
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_getParameterTypeDisplayName(paramType) {
	var retStr = "";
	var typeAsStr = (paramType && paramType.toString) ? paramType.toString() : "";
	if (typeAsStr && FieldTypes.sbTypeToDisplayName && FieldTypes.sbTypeToDisplayName[typeAsStr]) {
		retStr = FieldTypes.sbTypeToDisplayName[typeAsStr];
	}
	return retStr;
}


//--------------------------------------------------------------------
// FUNCTION:
//   dwscripts.encodeSQLReference
//
// DESCRIPTION:
//   Returns a table reference suitable for use within a SQL statement.
//   Wraps the reference in quotes if the table name contains a space,
//   begins with an underscore, or begins with a number.
//
// ARGUMENTS:
//   tableName - string - the table name we are referencing
//   connectionName - string - the connection of the table to figure our the escape character
//   simpleEscaping - bool - conservitave esacping if we can't find a driver, so we don't 
//         too much and make the table not work, especially if it's an oracle DB but we don't know it
//
// RETURNS:
//   string
//--------------------------------------------------------------------
function FieldTypes_encodeSQLReference(tableName, connectionName, simpleEscaping) {
	var retVal = tableName;
	
	var beginningEscapeChar = "[";
	var endingEscapeChar = "]";
	
	if (connectionName) {
		var driver = MMDB.getDriverName(connectionName);
		if (driver && driver.match && driver.match(/mysql/gi)) {
			beginningEscapeChar = "`";
			endingEscapeChar = "`";
		} else if (driver && driver.match && driver.match(/oracle/gi)) {
			beginningEscapeChar = "";
			endingEscapeChar = "";
			return retVal;
		}
		
		if( driver )
		{
			//If we have a driver we can do smarter escaping
			simpleEscaping = false;
		}
	}

	// we need to remove any table prefix which might exist,
	// and then add it back on after encoding
	var prefix = "";
	var preIndex = tableName.lastIndexOf(".");
	if (preIndex != -1) {
		prefix = tableName.substring(0, preIndex+1);
		tableName = tableName.substring(preIndex+1);
		retVal = tableName;
	}

	if( simpleEscaping )
	{
		if (tableName.match(/\s/)) {
			retVal = beginningEscapeChar + retVal + endingEscapeChar;
		}
	}
	else
	{
		if (tableName.charAt(0) == "_") {
			retVal = beginningEscapeChar + retVal + endingEscapeChar;
		} else if (dwscripts.isNumber(tableName.charAt(0))) {
			retVal = beginningEscapeChar + retVal + endingEscapeChar;
		} else if (tableName.match(/\W/)) {
			retVal = beginningEscapeChar + retVal + endingEscapeChar;
		} else if (dwscripts.isSQLReservedWord(tableName)) {
			retVal = beginningEscapeChar + retVal + endingEscapeChar;
		}
	}

	if (prefix) {
		retVal = prefix + retVal;
	}
  
	return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   dwscripts.decodeSQLTableRef
//
// DESCRIPTION:
//   This method has a copy in /Shared/UltraDev/Scripts/ParseSimpleSQL.js
//
// ARGUMENTS:
//   <arg1> - <type and description>
//
// RETURNS:
//   <type and description>
//--------------------------------------------------------------------
function FieldTypes_decodeSQLReference(theRef) {
	var retVal = theRef;

	if (retVal && retVal.replace) {
		retVal = retVal.replace(/(?:^\s*(?:\[|`|")|(?:\]|`|")\s*$)/gi, "");
		retVal = retVal.replace(/(\W)(?:\[|`|")/gi, "$1");
		retVal = retVal.replace(/(?:\]|`|")(\W)/gi, "$1");
	}
  
	return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   checkSizeForRSParameter
//
// DESCRIPTION:
//   This method is used to check whether we have a value equal to -1 or
//   greater than 255 for a parameter size used within a SELECT statement
//   (Recordset, Login User and Check new username). If one of these two
//   conditions is met, we'll return 255 a the new size for that parameter
//   (otherwise we'll get a browser error - invalid precision)
//
// ARGUMENTS:
//   parameterType
//   parameterSize
//
// RETURNS:
//   (number) - new size
//--------------------------------------------------------------------
function FieldTypes_checkSizeForRSParameter(parameterType, parameterSize) {
	var newSize = parameterSize;

	if (((newSize == -1) || (newSize > 255)) && (FieldTypes.castDBType(parameterType) == 200)) {
		newSize = 255;
	}

	return newSize;
}


//--------------------------------------------------------------------
// FUNCTION:
//   initializeStructure
//
// DESCRIPTION:
//   This method initializes all required object properties.
//
// ARGUMENTS:
//   paramObj (object) - the object containing new initialized properties
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function FieldTypes_initializeStructure(paramObj) {
	if (typeof(paramObj) == "object") {
		paramObj.paramName = new Array();
		paramObj.paramType = new Array();
		paramObj.paramDirection = new Array();
		paramObj.paramSize = new Array();
		paramObj.paramValue = new Array();
		paramObj.paramTypeDisplayName = new Array();
		paramObj.paramIndex = new Array();
	}
}
