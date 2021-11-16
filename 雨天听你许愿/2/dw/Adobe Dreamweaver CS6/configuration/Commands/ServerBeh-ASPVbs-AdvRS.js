// Copyright 2002-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

// *************** GLOBALS VARS *****************

var helpDoc = MM.HELP_ssAdvancedRecordset

var SP_Mode = false;  //Since we have different formatting behavior based on whether 
            //the object is a stored proc or not, we use this as a switch to 
            //keep track of what's the current selection.

//The following constants and vars are used to build up the SQL statement.
var CONST_SELECT  = "SELECT";
var CONST_FROM    = "FROM";
var CONST_WHERE   = "WHERE";
var CONST_EQUALS  = "=";
var CONST_ORDERBY = "ORDER BY";
var CONST_AND   = " AND";

// IAKT: Added by BRI on 06/07/02
var RECORDSET_TYPE = 'Advanced';

var var_select = "*";
var var_from = "";
var var_where = "";
var var_orderby = "";

var gSimpleParamName = "MMColParam"

var ERROR_MESSAGE = "";

// IAKT: Added by BRI on 08/07/02 : RS_TYPE_PARAM

var CONN_LIST, RS_TYPE_PARAM,PARAM_LIST,SQL_BOX,RS_NAME_BOX,MINUS_BUTTON,PLUS_BUTTON,TREE,
    SELECT_BUTTON,WHERE_BUTTON,ORDERBY_BUTTON;
var _PlusBtn = null;
var _MinusBtn = null;

var _ParamList = null;
var _ParamName = null;
var _ParamType = null;
var _ParamValue = null;
var _ParamDefaultValue = null;
var _ParamEditBtn = null;
var STATIC_LENGTH = 190;
var databaseType = null;


var labelToValueHash = {
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
var valueToLabelHash = {
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

    
// ******************* API **********************
// IAKT: Edited by BRI on 06/07/02
function commandButtons()
{
	// find the index of the current recordset in MM.rsTypes
	//rsIndex = recordsetDialog.searchByType(RECORDSET_TYPE);
	
	btnArray =  new Array(
		MM.BTN_OK,       "clickedOK()", 
        MM.BTN_Cancel,   "clickedCancel()", 
        MM.BTN_Test,     "PopUpTestDialog()");
	// add a button for each different rs type
	for (i = 0;i < MM.rsTypes.length;i++) {
		if(MM.rsTypes[i].single == "true") {
			continue;
		}
    	if (dw.getDocumentDOM().serverModel.getServerName() == MM.rsTypes[i].serverModel) {
    		if (RECORDSET_TYPE.toLowerCase() != MM.rsTypes[i].type.toLowerCase()) {
				var btnLabel = dw.loadString("recordsetType/" + MM.rsTypes[i].type);
				if (!btnLabel)
					btnLabel = MM.rsTypes[i].type;
				btnArray.push(btnLabel+"...");
				btnArray.push("clickedChange(" + i + ")");
			}
		}
	}
	btnArray.push(MM.BTN_Help);
	btnArray.push("displayHelp()"); 
	return btnArray;
}

//--------------------------------------------------------------------
// FUNCTION:
//   clickedChange
//
// DESCRIPTION:
//   This function is called when the user clicks another rs Type button
//
// ARGUMENTS:
//   newUIAction - the index of the new rs Type
//
// RETURNS:
//   nothing
// IAKT: Added by BRI on 06/07/02
//--------------------------------------------------------------------
function clickedChange(newUIAction) {
	// Update RECORDSET_SBOBJ from the UI.
	MM.RecordsetObject = GetDataFromUI();
	var showAlert = false;

	// BEGIN of Extra checks for switch to Simple
	if (newUIAction == 0) {
		var simpleObj = ParseSimpleSQL(MM.RecordsetObject.sql);
		if(simpleObj == false) {
			//alert("This SQL statement cannot be viewed in simple mode.")
			showAlert = true;
		} else if (simpleObj.filterColumn) {
			if (MM.RecordsetObject.paramArray.length != 1) {
				//alert("There was a where clause and the number of params was not one.")
				showAlert = true;
			} else {
				if (MM.RecordsetObject.paramArray[0].name != gSimpleParamName) {
					//alert("Close to simple, but the param name should be names MMColParam.")
					showAlert = true;
				} else {
					if (GetParamTypeAndName(MM.RecordsetObject.paramArray[0], Trim(RS_NAME_BOX.value)) == false) {
						//alert("Could not recognize the runtime parameter code.")
						showAlert = true;
					}
				}
			}
		}
		if (showAlert) {
			alert(dwscripts.sprintf(MM.MSG_SQLNotSimple, dwscripts.getRecordsetDisplayName()));
			return;
		}

		/* 
		// [akishnani 08/15/05] bug 198955 Recordset window will not switch to Simple mode
		if (MM.RecordsetPriorRec) {
			var errMsg = CheckData(FINAL, MM.RecordsetPriorRec);
		} else {
			var errMsg = CheckData(FINAL, "");
		}
		if (errMsg != "") {
			alert(errMsg);
			return;
		}
		*/
	}
	// END of Extra checks for switch to Simple

	if (recordsetDialog.canDialogDisplayRecordset(MM.rsTypes[newUIAction].command,MM.RecordsetObject)) {
		MM.RecordsetSubType = MM.RecordsetObject.subType;
  
		MM.RecordsetSwitchingUI = true;
		MM.RecordsetDone = false;
		MM.recordSetType = MM.rsTypes[newUIAction].type;
		window.close();
	} else {
		alert(dw.loadString("serverBehavior/alert/recordset/cantDisplay"));
	}
}


function clickedOK() {
	MM.RecordsetOK = true
	if (MM.RecordsetPriorRec) {
		var errMsg = CheckData(FINAL, MM.RecordsetPriorRec)
	} else {
		var errMsg = CheckData(FINAL, "")
	}
	if (errMsg != "") {
		MM.RecordsetOK = false
		alert(errMsg)
		return
	}

	MM.RecordsetObject = GetDataFromUI();

	RememberAdvancedRecordset()

	window.close()
}


function clickedCancel() {
	window.close()
}


function PopUpTestDialog()
{

  var msg = CheckData(FOR_TEST, "")
  if (msg != "")
  {
    alert(msg)
    return
  }

  var theSQL = SQL_BOX.value
  
  var noRS = false
  if (theSQL.search(/^\s*insert\s+/i) > -1)
    noRS = true
  if (theSQL.search(/^\s*update\s+/i) > -1)
    noRS = true
  if (theSQL.search(/^\s*delete\s+/i) > -1)
    noRS = true

  if (noRS)
  {
    alert(MM.MSG_CannotTestInsertUpdateDelete)
    return
  }

//  var pa = PARAM_LIST.getContents()
  var pa = getParamListContents();
  var statement = SQL_BOX.value
  
  // remove SQL comments
  statement = statement.replace(/\/\*[\S\s]*?\*\//g, " ");
  
  // Remove single quotes surrounding recordset's parameters
  for (var i=0; i<pa.length; i++) {
    if (pa && pa[i] && pa[i][0]) {
      statement = statement.replace(new RegExp("'" + pa[i][0] + "'", "g"), pa[i][0]);
    }
  }
  
  statement = ReplaceParamsWithVals(statement, pa, CONN_LIST.getValue())

  // Special case for the handling of <cfif> tag.  
  // Our solution is to execute the statement up to but not including
  // the first cfif tag if one exists.
  if (dw.getDocumentDOM().serverModel.getServerLanguage() == "CFML")
  {
    statement = stripCFIF(statement)
  }

  MMDB.showResultset(CONN_LIST.getValue(), statement)
}


//--------------------------------------------------------------------
// FUNCTION:
//   getParamListContents
//
// DESCRIPTION:
//   This function converts the current structure returned by _ParamList
//   object to an old format returned by PARAM_LIST (there two objects
//   are different and we should have to pass the same object structure to all
//   adjacent methods insteda of updating all those methods).
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   (array of arrays) - a bidimensional array containing names, default
//                       and runtime values and types for all parameters
//--------------------------------------------------------------------
function getParamListContents() {
	var retArray = new Array();
	var tempArray;

	var contents = _ParamList.getValue("all");
	for (var i=0; i<contents.length; i++) {
		retArray.push(new Array());
		retArray[i].push(contents[i].name);
		retArray[i].push(contents[i].defaultVal);
		retArray[i].push(contents[i].runtimeVal);
		retArray[i].push(contents[i].type);
	}
	
	// Read the indexes of each parameter within SQL
	var theSQL = SQL_BOX.value;
	var indexes = new Array();
	var ParamName;
	var ParamRe;
	for (var i=0; i<retArray.length; i++) {
		ParamName = retArray[i][0];
		ParamRe = new RegExp("\\W(?:%|)" + ParamName + "(?:%|)(?:\\W|$)", "ig");
		indexes.push(theSQL.search(ParamRe));
	}
	
	// Sort parameters read from grid according with the order found in the SQL
	var done;
	var aux;
	do {
		done = true;
		for (var i=1; i<indexes.length; i++) {
			if (indexes[i-1] > indexes[i]) {
				done = false;
				aux = indexes[i-1];
				indexes[i-1] = indexes[i];
				indexes[i] = aux;

				aux = retArray[i-1][0];
				retArray[i-1][0] = retArray[i][0];
				retArray[i][0] = aux;

				aux = retArray[i-1][1];
				retArray[i-1][1] = retArray[i][1];
				retArray[i][1] = aux;

				aux = retArray[i-1][2];
				retArray[i-1][2] = retArray[i][2];
				retArray[i][2] = aux;

				aux = retArray[i-1][3];
				retArray[i-1][3] = retArray[i][3];
				retArray[i][3] = aux;
			}
		}
	} while (!done);
	
	return retArray;
}


function clickedSimple()
{
  var showAlert = false

  MM.RecordsetObject = GetDataFromUI()
  
  var simpleObj = ParseSimpleSQL(MM.RecordsetObject.sql);
  
  
  if(simpleObj == false)
  {
    //alert("This SQL statement cannot be viewed in simple mode.")
    showAlert = true
  }
  else if (simpleObj.filterColumn)
  {
    if (MM.RecordsetObject.paramArray.length != 1)
    {
      //alert("There was a where clause and the number of params was not one")
      showAlert = true
    }
    else
    {
      if (MM.RecordsetObject.paramArray[0].name != gSimpleParamName)
      {
        //alert("Close to simple, but the param name is wrong.")
        showAlert = true
      }
      else
      {
        if (GetParamTypeAndName(MM.RecordsetObject.paramArray[0], Trim(RS_NAME_BOX.value)) == false)
        {
          //alert("Could not recognize the runtime parameter code.")
          showAlert = true
        }
      }
    }
  }
  else
  {
    if (MM.RecordsetObject.paramArray.length != 0)
    {
      //alert("There were parameters and there is no where clause.")
      showAlert = true
    }
  }
  
  if (showAlert)
  {
    alert(dwscripts.sprintf(MM.MSG_SQLNotSimple, dwscripts.getRecordsetDisplayName()));
    return
  }


  MM.IsSimpleRecordset = true
  MM.RecordsetSwitchingUI = true
  MM.RecordsetDone = false //we are switching UIs
  window.close()
}


// ***************** LOCAL FUNCTIONS  ******************

function initializeUI()
{
  /*
  This function is called in the onLoad event.  It is responsible
  for initializing the UI.  If we are inserting a recordset, this
  is a matter of populating the connection drop down.

  If we are modifying a recordset, this is a matter of inspecting
  the recordset tag and setting all the form elements.
  */
  //Create global vars for all controls
  CONN_LIST = new ListControl("ConnectionList")

  RS_TYPE_PARAM = new RsTypeMenu("Recordset.htm", "RsTypeParameter",recordsetDialog.searchByType(RECORDSET_TYPE));
  RS_TYPE_PARAM.initializeUI();

  PARAM_LIST = new GridControl("ParamList1")
  _ParamList = new ListControl("ParamList");
  SQL_BOX = findObject("theSQL")

  RS_NAME_BOX = findObject("RecordsetName")
  MINUS_BUTTON = findObject("minusButton1")
  PLUS_BUTTON = findObject("plusButton1")
  
  _PlusBtn = new ImageButton("plusButton", "_PlusBtn", "sSd", false);
  _MinusBtn = new ImageButton("minusButton", "_MinusBtn", "sSd", false);
  _ParamEditBtn = dwscripts.findDOMObject("EditParam"); 

  TREE = new DBTreeControl("DBTree")

  PopulateConnectionList()

  RS_NAME_BOX.value = CreateNewName()
  SELECT_BUTTON = findObject("SelectButton")
  WHERE_BUTTON = findObject("WhereButton")
  ORDERBY_BUTTON = findObject("OrderByButton")

  _ParamName = dwscripts.findDOMObject("ParamName");
  _ParamType = dwscripts.findDOMObject("ParamType");
  _ParamValue = dwscripts.findDOMObject("ParamValue");
  _ParamDefaultValue = dwscripts.findDOMObject("ParamDefaultValue");

  // set the readonly param properties
  _ParamName.innerHTML = dwscripts.entityNameEncode(MM.LABEL_ParamAttributesName);
  _ParamType.innerHTML = dwscripts.entityNameEncode(MM.LABEL_ParamAttributesType);
  _ParamValue.innerHTML = dwscripts.entityNameEncode(MM.LABEL_ParamAttributesValue);
  _ParamDefaultValue.innerHTML = dwscripts.entityNameEncode(MM.LABEL_ParamAttributesDefaultValue);

  if (MM.RecordsetSwitchingUI || MM.RecordsetPriorRec)
  {
    inspectUI()
  }

  if (ERROR_MESSAGE) alert(ERROR_MESSAGE);
  
  elts = document.forms[0].elements;
  if (elts && elts.length)
  {
    elts[0].focus();
    elts[0].select();
  }
}

function onParameterChanged()
{
  var paramName = "";
  var paramType = "";
  var paramValue = "";
  var paramDefaultValue = "";

  var param = _ParamList.getValue();
    
  if (param)
  {
  	paramName = param.name;
	paramType = paramName ? (FieldTypes.getDisplayNameForDBType(param.type)) : "";
    paramValue = param.runtimeVal;
    paramDefaultValue = param.defaultVal;
  }

  var shortParamName = dw.shortenString(MM.LABEL_ParamAttributesName + paramName, STATIC_LENGTH, false);
  _ParamName.innerHTML = dwscripts.entityNameEncode(shortParamName);
  
  var shortParamType = dw.shortenString(MM.LABEL_ParamAttributesType + paramType, STATIC_LENGTH, false);
  _ParamType.innerHTML = dwscripts.entityNameEncode(shortParamType);

  var shortParamValue= dw.shortenString(MM.LABEL_ParamAttributesValue + paramValue, STATIC_LENGTH, false);
  _ParamValue.innerHTML = dwscripts.entityNameEncode(shortParamValue);

  var shortParamDefaultValue= dw.shortenString(MM.LABEL_ParamAttributesDefaultValue + paramDefaultValue, STATIC_LENGTH, false);
  _ParamDefaultValue.innerHTML = dwscripts.entityNameEncode(shortParamDefaultValue);

  updateButtons();
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateButtons
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
function updateButtons() {
	var param = _ParamList.getValue();
	var dbTreeInfo = TREE.getData(); 
	var isProcedure = dbTreeInfo ? dbTreeInfo.IsProcedure() : false;

	_MinusBtn.setDisabled(!param || isProcedure);

	if (CONN_LIST.getValue() && !isProcedure) {
		_PlusBtn.enable();

		if (param) {
			_ParamEditBtn.removeAttribute("disabled");
		} else {
			_ParamEditBtn.setAttribute("disabled", "disabled");
		}
	} else {
		_PlusBtn.disable();
		_ParamEditBtn.setAttribute("disabled", "disabled");
	}
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateUI
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
function updateUI(control, event) {
	if (control == "ConnectionList") {
		ConnectionChanged();
	} else if (control == "plusButton") {
		if (!_PlusBtn.disabled) {
			var cmdArgs = new Array();

			var databaseType = MMDB.getDatabaseType(CONN_LIST.getValue());
			cmdArgs.push(databaseType);
			cmdArgs = dwscripts.callCommand("AddASPVbsParam", cmdArgs);

			if (cmdArgs) {
				var param = new Object();

				param.name = cmdArgs[0];
				param.type = cmdArgs[1];
				param.runtimeVal = cmdArgs[2];
				param.defaultVal = cmdArgs[3];

				_ParamList.add(param.name, param);
				onParameterChanged();
			}
		}
	} else if (control == "minusButton") {
		if (!_MinusBtn.disabled) {
			_ParamList.del();
			onParameterChanged();
		}
	} else if (control == "ParamList") {
		onParameterChanged();
	} else if (control == "EditParam") {
		var param = _ParamList.getValue();
		var cmdArgs = new Array();

		cmdArgs[0] = (typeof(databaseType) != "undefined") ? databaseType : "";
		cmdArgs[1] = param.name;
		cmdArgs[2] = param.type;
		cmdArgs[3] = param.runtimeVal;
		cmdArgs[4] = param.defaultVal;

		var ret = dwscripts.callCommand("EditASPVbsParam", cmdArgs);

		if (ret && ret.length) {
			param.name = ret[0];
			param.type = ret[1];
			param.runtimeVal = ret[2];
			param.defaultVal = ret[3];

			_ParamList.set(param.name);

			onParameterChanged();
		}
	}
}

function RememberAdvancedRecordset()
{

  var path = dreamweaver.getConfigurationPath() + '/ServerBehaviors/Shared/RSSeverModelSwitches.js';
  var metaFile;

  metaFile = MMNotes.open(path, true); // Force create the note file.
  if (metaFile) {
    MMNotes.set(metaFile, 'PREF_rsType', RECORDSET_TYPE);
    MMNotes.close(metaFile);
  }

}


function GetDataFromUI() {

	var uiData = new Object();

	// CRA added - ASP bug fix
	if (MM.RecordsetObject) {
		if (MM.RecordsetObject.PageSize) {
			uiData.PageSize = MM.RecordsetObject.PageSize;
		}
		if (MM.RecordsetObject.StartRecord) {
			uiData.StartRecord = MM.RecordsetObject.StartRecord;
		}
		if (MM.RecordsetObject.loopName) {
			uiData.loopName = MM.RecordsetObject.loopName;
		}
		if (MM.RecordsetObject.ConnectionName) {
			uiData.ConnectionName = MM.RecordsetObject.ConnectionName;
		}
		if (MM.RecordsetObject.varName) {
			uiData.varName = MM.RecordsetObject.varName;
		}
	}
 
	uiData.name = Trim(RS_NAME_BOX.value)
	uiData.connectionName = CONN_LIST.getValue()

	// IAKT: Added by BRI on 08/07/02
	uiData.subType = RS_TYPE_PARAM.getValue()

	uiData.paramArray = GetParametersFromUI()
	uiData.sql = SQL_BOX.value
	uiData.isSimple = false
    
	return uiData
}


function inspectUI() 
{
  var ro = MM.RecordsetObject

  //We want to check if this is an exec statement or not. If it's an exec,
  //update, delete, or insert statement,
  //we leave it alone and don't do our fancy formatting.

  var sqlstr = ro.sql
  if  (
    (sqlstr.search(/exec\s*/i) > -1) || 
    (sqlstr.search(/call\s*/i) > -1) ||
    (sqlstr.search(/^\s*update\s+/i) > -1) ||
    (sqlstr.search(/^\s*insert\s+/i) > -1) ||
    (sqlstr.search(/^\s*delete\s+/i) > -1) 
    )
  {
    //Update the SQL_Box
    SQL_BOX.value = ro.sql
    //Set SP_Mode to true
    SP_Mode = true;
  } 
  else
  {
    //Set SP_Mode to false
    SP_Mode = false;

    //Kick in fancy formatting
    if (Trim(ro.sql) == "")
    {
      //do nothing since they may be switching from Simple and we don't
      //want to put the "Select * from" in the SQL box.
    }
    else if( parseSQLString(ro.sql))
    {
      //the parser was able to successfully identify string
        updateSQL_Box();
    }
    else
    {
      //parser failed, so no fancy formatting...
      SQL_BOX.value = ro.sql
    }

  }
  
  RS_NAME_BOX.value = ro.name

  if (!CONN_LIST.pickValue(ro.connectionName))
  {
      CONN_LIST.setIndex(0)
  }
  
  // IAKT: Added by BRI on 08/07/02
  if (!RS_TYPE_PARAM.pickValue(ro.subType)) {
      RS_TYPE_PARAM.setIndex(0)
  }
  
  TREE.setConnection(ro.connectionName)

  var delim = ","
  if (ro.paramArray)
  {
    var labels = new Array();
	var values = new Array();
	var tempObj;
	var paramDBType;
    for (i = 0;i < ro.paramArray.length; i++) {
      thisParam = ro.paramArray[i];
	  
	  // Try to automatically detect and cast the unique parameter ONLY AND ANLY IF WE HAVE A SIMPLE SQL
	  // (an SQL accepted by Simple interface too)
	  paramDBType = thisParam.type;
	  if (!paramDBType || (paramDBType == -1)) {
		paramDBType = FieldTypes.getParamTypeForSimpleSQL(ro.cname, ro.sql);
		paramDBType = (paramDBType !== false) ? paramDBType : -1;
	  }
	  paramDBType = FieldTypes.castDBType(paramDBType);

	  tempObj = new Object();
	  tempObj.name = thisParam.name;
	  tempObj.type = paramDBType;
	  tempObj.runtimeVal = thisParam.runtimeVal;
	  tempObj.defaultVal = thisParam.defaultVal;

	  labels.push(tempObj.name);
	  values.push(tempObj);
/*
      fillArray[i] = new Array()
      fillArray[i][0] = thisParam.name
      fillArray[i][1] = thisParam.defaultVal
      fillArray[i][2] = thisParam.runtimeVal
*/
    }

	_ParamList.setAll(labels, values);
	onParameterChanged();
//    PARAM_LIST.setAll(labels, values)
//    PARAM_LIST.setIndex(0)
  }
}


function CheckData(reason, priorName)
{
  /*
  This function checks all of the input variables to see
  if the user has filled out everything okay...if not
  return an error string.  If so, return empty string
  */

  
  var strOut = ""

  if (reason == FINAL)
  {
    // we don't get here if we are just testing the SQL statement
    var theName = Trim(RS_NAME_BOX.value)
    if (theName == "")
    {
      strOut += MM.MSG_NoRecordsetName;
      return strOut
    }
    if (!IsValidVarName(theName))
    {
      strOut = MM.MSG_InvalidRecordsetName
      return strOut
    }
    if (IsDupeObjectName(theName, priorName))
    {
      return MM.MSG_DupeRecordsetName;
    }

    if (IsReservedWord(theName))
    {
      return dwscripts.sprintf(MM.MSG_ReservedWord, theName);
    }
        
  }

  if (CONN_LIST.getIndex() == 0)
  {
    strOut += MM.MSG_NoConnection;
    return strOut
  }
  
  var theSQL =  SQL_BOX.value

  if (StripChars(" \r\n\t", theSQL) == "")
  {
    strOut += MM.MSG_NoRecordsetSQLStatement;
    return strOut
  }

  switch(dw.getDocumentDOM().serverModel.getServerLanguage())
  {
    case "JavaScript":
    case "VBScript":
    case "Java":

      // we only accept Select statements
      // and calls to sp's
      var validSQL = false
      var callRE = /\s*call\b/i
      if (theSQL.search(callRE) > -1)
        validSQL = true
      var spRE = /^\s*exec\b/i
      if (theSQL.search(spRE) > -1)
        validSQL = true
      var spRE = /^\s*execute\b/i
      if (theSQL.search(spRE) > -1)
        validSQL = true
      var selectRE = /^\s*select\b/i
      if (theSQL.search(selectRE) > -1)
        validSQL = true
      if (!validSQL)
      {
        strOut = MM.MSG_NoRecordsetSQLStatement;
        return strOut
      }

      break

    case "CFML":

      // we only accept Select statements, calls to sp's, and insert/update/delete statements
      var validSQL = false
      var callRE = /\s*call\b/i
      if (theSQL.search(callRE) > -1)
        validSQL = true
      var spRE = /^\s*exec\b/i
      if (theSQL.search(spRE) > -1)
        validSQL = true
      var spRE = /^\s*execute\b/i
      if (theSQL.search(spRE) > -1)
        validSQL = true
      var selectRE = /^\s*select\b/i
      if (theSQL.search(selectRE) > -1)
        validSQL = true
      if (theSQL.search(/\s*insert\s+/i) > -1)
        validSQL = true
      if (theSQL.search(/\s*update\s+/i) > -1)
        validSQL = true
      if (theSQL.search(/\s*delete\s+/i) > -1)
        validSQL = true

      if (!validSQL)
      {
        strOut = MM.MSG_NoRecordsetSQLStatement;
        return strOut
      }
  }
  
//  var pa = PARAM_LIST.getContents()
//  var pa = _ParamList.getValue("all");
  var pa = getParamListContents();
  //alert("the num of params is: " + pa.length)
  if (pa.length > 0)
  {
      strOut = CheckSQLParams(pa, theSQL, reason)
  }
  return strOut
}


function CheckSQLParams(pa, theSQL, reason)
{
  var strOut = ""

  for (var i = 0; i < pa.length; i++)
  {
    var anOption = pa[i]

    var theName = Trim(anOption[0] /*anOption.name*/)
    if (theName == "")
    {
      strOut =  strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_MissingParamName
      return strOut
    }
    if (!IsValidVarName(theName))
    {
      strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + theName + "\n\n" + MM.MSG_InvalidParamName
      return strOut
    }
    else
    {
      var re = new RegExp("\\b" + theName + "\\b");
      if (theSQL.search(re) == -1)
      {
        strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + theName + "\n\n" + MM.MSG_InvalidParamNameNotInSQL
        return strOut
      }
    }


    var theType = Trim(anOption[3].toString() /*anOption.type*/)
    if (!(parseInt(theType) > 0))
    {
      strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_TypeMissing + theName
      return strOut
    }


    var theDefaultVal = Trim(anOption[1] /*anOption.defaultVal*/)
    if (theDefaultVal == "")
    {
      strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_DefaultValMissing + theName
      return strOut
    }


    if (reason == FINAL)
    {
      var theRunTimeVal = Trim(anOption[2] /*anOption.runtimeVal*/)
      if (theRunTimeVal == "")
      {
        strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_RunTimeValMissing + theName
        return strOut
      }

      if (dw.getDocumentDOM().serverModel.getServerLanguage() == "CFML")
      {
        if (theRunTimeVal.search(/^#\S+#$/i) == -1)
        {
          return MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_RunTimeValNotCFFormat
        }
      }

    } 
  }

  return ""
}


function GetParametersFromUI()
{
  //var gridContents = PARAM_LIST.getContents()
  //var gridContents = _ParamList.getValue("all");
  var gridContents = getParamListContents();
  var paramArray = new Array()

  for (var i = 0; i < gridContents.length; i++)
  {
    var newParam = new Object()
    newParam.name = gridContents[i][0]; //gridContents[i].name;
    newParam.type = gridContents[i][3]; //gridContents[i].type;
    newParam.runtimeVal = gridContents[i][2]; //gridContents[i].runtimeVal;
    newParam.defaultVal = gridContents[i][1]; //gridContents[i].defaultVal;

    paramArray.push(newParam);
  }

  return paramArray;
}


function DeleteParam()
{
  /*
  This function is called when the user
  clicks on the minus button above the params list box.
  If there is not a selected index in the list, we do
  nothing. 
  */

  PARAM_LIST.del()
  //UpdateMinusButton()
}

function AddParam()
{
    if (dw.isOSX())
  {
    // work around a problem in OSX where the first editable
    // region does not get focus.  Add a defaut name
    // so the user can see that something happened
    PARAM_LIST.object.options.push(new Option(MM.LABEL_Unnamed))
  }
  else
  {
    PARAM_LIST.object.options.push(new Option(""))
  }

  //PARAM_LIST.append()
  //UpdateMinusButton()
}


function UpdateMinusButton()
{
  if (PARAM_LIST.getIndex() >= 0)
  {
    MINUS_BUTTON.src = "../../Shared/UltraDev/Images/MinusButtonEnabled.gif"
  }
  else
  {
    MINUS_BUTTON.src = "../../Shared/UltraDev/Images/MinusButtonDisabled.gif"
  }
}



function stripCFIF(sql)
{
  var statement = sql.replace(/\n/g, " ")
  statement = statement.replace(/\r/g, " ")
  var found = statement.search(/^(.*)\s*<cfif/i)
  if (found != -1)
  {
    statement = RegExp.$1
  }
  return statement
}

function ConnectionChanged()
{
  var connName = CONN_LIST.getValue();
  TREE.setConnection(connName);
  databaseType = MMDB.getDatabaseType(connName);
  updateButtons();
}

  
function updateSQLWithStoredProcedure()
{
  //This method builds the SQL statment when a stored procedure is
  //selected in the tree.

  var treeData = TREE.getData()

  //If it's not a stored procedure, don't do anything.
  if (!treeData.IsProcedure())
  {
    return
  }

  var curText = SQL_BOX.value

  var returnValue = ""
  var outParams = ""

  var procName = treeData.procedure 
  var paramArray = treeData.paramArray
  var paramBoxContents = new Array()

  //Build the Param array
  for (var i = 0; i < paramArray.length; i++)
  {
    //Remove all '@' chars from the param name.
    var paramName = StripChars("@", paramArray[i].name)
    var stype = dwscripts.getDBColumnTypeAsString(paramArray[i].type)
    bString = dwscripts.isStringDBColumnType(paramArray[i].type);
    bBinary = dwscripts.isBinaryDBColumnType(paramArray[i].type);
  
    if (paramName != "RETURN_VALUE")
    {
      if (outParams != "")
        outParams += ","

      if (bString)
        outParams = outParams + "'" + paramName + "'"
      else
      {
        if ((stype == "REF CURSOR")||(bBinary))
        {
          outParams += "?";
        }
        else
        {
          outParams += paramName;
        }
      }

      if (stype != "REF CURSOR" && !bBinary)
      {
        // We don't want to list the param if it is REF CURSOR or binary
        var aParam = new Array()
        aParam[0] = paramName
        aParam[1] = ""
        aParam[2] = ""
        paramBoxContents.push(aParam)
      }
    }
  }

  PARAM_LIST.delAll();

  if (outParams == ""){
    SQL_BOX.value = "{call " + procName +"}"
    outParams = ""
  }
  else{
    SQL_BOX.value = "{call " + procName + "(" + outParams + ")}"
    PARAM_LIST.setContents(paramBoxContents)
  }
}


//This method is called after the SQL has been 'parsed'. This updates
//the SQL box with formatted SQL statment.
function updateSQL_Box()
{
  var sqlstr = "";
  
  if (StripChars(" \r\n\t", var_select) == "")
  {
    var_select = "*";
  }
  sqlstr = CONST_SELECT + " " + var_select + "\n" + CONST_FROM;
  if (var_from != "")
  {
    sqlstr += " ";
    sqlstr += var_from;
  }
  if( var_where != "")
  {
    //sqlstr += " ";
    sqlstr += "\n";
    sqlstr += CONST_WHERE;
    sqlstr += " ";  
    sqlstr += var_where;
  }
  if( var_orderby != "")
  {
    //sqlstr += " ";
    sqlstr += "\n";
    sqlstr += CONST_ORDERBY;
    sqlstr += " ";
    sqlstr += var_orderby;
  }

  if (sqlstr != "")
  {
    SQL_BOX.value = sqlstr;
  }
}

//Update the global vars from the RegularExpression result.
function updateSQLVars(index)
{
  switch(index)
  {
  case 1: 
    var_select = Trim(StripChars("\r\n\t", RegExp.$3));
    var_from = Trim(StripChars("\r\n\t", RegExp.$5));
    var_where = Trim(StripChars("\r\n\t", RegExp.$7));
    var_orderby = Trim(StripChars("\r\n\t", RegExp.$9));
    break;
  case 2:
    var_select = Trim(StripChars("\r\n\t", RegExp.$3));
    var_from = Trim(StripChars("\r\n\t", RegExp.$5));
    var_where = "";
    var_orderby = Trim(StripChars("\r\n\t", RegExp.$7));
    break;
  case 3:
    var_select = Trim(StripChars("\r\n\t", RegExp.$3));
    var_from = "";
    var_where = Trim(StripChars("\r\n\t", RegExp.$5));
    var_orderby = Trim(StripChars("\r\n\t", RegExp.$7));
    break;
  case 4:
    var_select = Trim(StripChars("\r\n\t", RegExp.$3));
    var_from = "";
    var_where = "";
    var_orderby = Trim(StripChars("\r\n\t", RegExp.$5));
    break;
  case 5:
    var_select = Trim(StripChars("\r\n\t", RegExp.$1));
    var_from = Trim(StripChars("\r\n\t", RegExp.$3));
    var_where = Trim(StripChars("\r\n\t", RegExp.$5));
    var_orderby = Trim(StripChars("\r\n\t", RegExp.$7));
    break;
  case 6:
    var_select = Trim(StripChars("\r\n\t", RegExp.$1));
    var_from = "";
    var_where = Trim(StripChars("\r\n\t", RegExp.$3));
    var_orderby = Trim(StripChars("\r\n\t", RegExp.$7));
    break;
  case 7:
    var_select = Trim(StripChars("\r\n\t", RegExp.$1));
    var_from = "";
    var_where = "";
    var_orderby = Trim(StripChars("\r\n\t", RegExp.$3));
    break;


  }
}

//Parse the sql statement in the SQL Box.
function parseSQLString(SQLString)
{
  
  var updateStyle = 1
  var standardUpdate = true;

  //Check if it's in "StoredProc" mode. If it is don't do anything.
  
  if(!SP_Mode)
  {

  SQLString = SQLString.replace(/\n/g,"");

  SQLString = SQLString.replace(/\r/g," ");

  
  //Why do we need this exec check? If the user has a stored proc in the sql 
  //edit, and then clicks on a table/view column, it would mean that he/she 
  //wants to change the sql from a stored proc to a select statement. 
  //So we first check to see the exec string is found in the sql. If it is, 
  //we just set it to empty, as the updateSQLBox function will take care of it. 
  //2-15-00 Made a slight modification to the reg exp params below. I removed the
  //\b before the exec/ call statements. This is because the { does not count as
  //as word boundry.

  var re_1 = /(exec)\b/g;
  var re_2 = /(call)\b/g;
  if((SQLString.search(re_1) != -1) || (SQLString.search(re_2) != -1))
  {
    SQLString = "";
    PARAM_LIST.delAll();
    return true
  }

  //type = 1
  var re1 = /(\s*|.*)(\bselect\b)(\s*|.*)(\bfrom\b)(\s*|.*)(\bwhere\b)(\s*|.*)(order by)(\s*|.*)$/i;
  var re2 = /(\s*|.*)(\bselect\b)(\s*|.*)(\bfrom\b)(\s*|.*)(\bwhere\b)(\s*|.*)(order by)\s*$/i;
  var re3 = /(\s*|.*)(\bselect\b)(\s*|.*)(\bfrom\b)(\s*|.*)(\bwhere\b)(\s*|.*)$/i;
  var re4 = /(\s*|.*)(\bselect\b)(\s*|.*)(\bfrom\b)(\s*|.*)(\bwhere\b)\s*$/i;
  //type = 2
  var re5 = /(\s*|.*)(\bselect\b)(\s*|.*)(\bfrom\b)(\s*|.*)(\border\sby\b)(\s*|.*)$/i;
  var re6 = /(\s*|.*)(\bselect\b)(\s*|.*)(\bfrom\b)(\s*|.*)(\border\sby\b)\s*$/i;
  var re7 = /(\s*|.*)(\bselect\b)(\s*|.*)(\bfrom\b)(\s*|.*)$/i;
  var re8 = /(\s*|.*)(\bselect\b)(\s*|.*)(\bfrom\b)\s*$/i;
  //type = 3
  var re9 = /(\s*|.*)(\bselect\b)(\s*|.*)(\bwhere\b)(\s*|.*)(\border by\b)(\s*|.*)$/i;
  var re10= /(\s*|.*)(\bselect\b)(\s*|.*)(\bwhere\b)(\s*|.*)(\border by\b)\s*$/i;
  var re11= /(\s*|.*)(\bselect\b)(\s*|.*)(\bwhere\b)(\s*|.*)$/i;
  var re12= /(\s*|.*)(\bselect\b)(\s*|.*)(\bwhere\b)\s*$/i;
  //type = 4
  var re13= /(\s*|.*)(\bselect\b)(\s*|.*)(\border by\b)(\s*|.*)$/i;
  var re14= /(\s*|.*)(\bselect\b)(\s*|.*)(\border by\b)\s*$/i;
  var re15= /(\s*|.*)(\bselect\b)(\s*|.*)$/i;
  var re16= /(\s*|.*)(\bselect\b)\s*$/i;
  //type = 5
  var re17= /(\s*|.*)(\bfrom\b)(\s*|.*)(\bwhere\b)(\s*|.*)(\border by\b)(\s*|.*)$/i;
  var re18= /(\s*|.*)(\bfrom\b)(\s*|.*)(\bwhere\b)(\s*|.*)(\border by\b)\s*$/i;
  var re19= /(\s*|.*)(\bfrom\b)(\s*|.*)(\bwhere\b)(\s*|.*)$/i;
  var re20= /(\s*|.*)(\bfrom\b)(\s*|.*)(\bwhere\b)\s*$/i;
  var re21= /(\s*|.*)(\bfrom\b)(\s*|.*)$/i;
  var re22= /(\s*|.*)(\bfrom\b)\s*$/i;
  //type = 6
  var re23= /(\s*|.*)(\bwhere\b)(\s*|.*)(\border by\b)(\s*|.*)$/i;
  var re24= /(\s*|.*)(\bwhere\b)(\s*|.*)(\border by\b)\s*$/i;
  var re25= /(\s*|.*)(\bwhere\b)(\s*|.*)$/i;
  var re26= /(\s*|.*)(\bwhere\b)\s*$/i;
  //type = 7
  var re27= /(\s*|.*)(\border by\b)(\s*|.*)$/i;
  var re28= /(\s*|.*)(\border by\b)\s*$/i;

  var re_empty = /\s?/i;

  if(StripChars(" \r\n\t", SQLString) == "")
  {
    SQLString.search(re_empty);
    updateSQLVars(1)
    return true
  }

  if((SQLString.search(re1) != -1) || (SQLString.search(re2) != -1) || (SQLString.search(re3) != -1) || (SQLString.search(re4) != -1))
  {
    updateSQLVars(1)
    return true
  }

  if((SQLString.search(re5) != -1) || (SQLString.search(re6) != -1) || (SQLString.search(re7) != -1) || (SQLString.search(re8) != -1))
  {
    updateSQLVars(2)
    return true
  }

  if((SQLString.search(re9) != -1) || (SQLString.search(re10) != -1) || (SQLString.search(re11) != -1) || (SQLString.search(re12) != -1))
  {
    updateSQLVars(3)
    return true
  }

  if((SQLString.search(re13) != -1) || (SQLString.search(re14) != -1) || (SQLString.search(re15) != -1) || (SQLString.search(re16) != -1))
  {
    updateSQLVars(4)
    return true
  }

  if((SQLString.search(re17) != -1) || (SQLString.search(re18) != -1) || (SQLString.search(re19) != -1) || (SQLString.search(re20) != -1) || (SQLString.search(re21) != -1) || (SQLString.search(re22) != -1))
  {
    updateSQLVars(5)
    return true
  }

  if((SQLString.search(re23) != -1) || (SQLString.search(re24) != -1) || (SQLString.search(re25) != -1) || (SQLString.search(re26) != -1))
  {
    updateSQLVars(6)
    return true
  }

  if((SQLString.search(re27) != -1) || (SQLString.search(re28) != -1))
  {
    updateSQLVars(7)
    return true
  }
  
  return false

 }
 return true;
}


function IsSelectStatement()
{
  if (Trim(SQL_BOX.value) == "")
  {
    return true
  }

  var sql = String(SQL_BOX.value)
  return (sql.search(/^\s*select\s+/i) != -1)
}


//On Click handler for the Add to Select button
function AddToSelect()
{
  if (!SP_Mode && !IsSelectStatement())
  {
    alert(MM.MSG_CanOnlyUseButtonsOnSelectStatements)
    return
  }

  var selectstr = "";
  var tablename = "";

  var curText = SQL_BOX.value
  var treeData = TREE.getData();

  var matchLoc;
  var result;
  var exactMatch = 0;

  if(!IsConnectionSelected())
  {
   return;
  }

  //Proceed if selection is not a stored procedure
  if (!treeData.IsProcedure())  
  {
    //Check if selection is a column.
  if(treeData.IsColumn())
  { 
    SP_Mode = false;
    if (parseSQLString(curText))
      {
      if( (StripChars(" \r\n\t", var_select) == "*") || (StripChars(" \r\n\t", var_select) == ""))
      {
        var_select = treeData.column;
      } else {
        theStr = treeData.column;
        escStr = quoteMeta(theStr);
        var re = new RegExp(escStr, "gi");
        exactMatch = 0; 
        while((result = re.exec(var_select)) != null) {
          matchLoc = result.index;
          if (( matchLoc == 0 || var_select[matchLoc-1] == ' ' || var_select[matchLoc-1] == ',' ) && ( var_select[matchLoc + theStr.length] == ',' || var_select[matchLoc + theStr.length] == null ))
          {
            exactMatch = 1;
          }
        }
      
        if(exactMatch == 0)
        {
          var tempStr = Trim(var_select)
          if(tempStr.lastIndexOf(",") == (tempStr.length -1))
          {
            selectstr = Trim(var_select)  
            selectstr += " " + treeData.column
            var_select = selectstr;
          } else {
          selectstr = Trim(var_select) + ", ";
          selectstr += treeData.column
          var_select = selectstr;
          }
        } else {
          alert(errMsg(MM.MSG_DupeColumnWarning, treeData.column));
          var tempStr = Trim(var_select)
          if(tempStr.lastIndexOf(",") == (tempStr.length -1))
          {
            selectstr = Trim(var_select)  
            selectstr += " " + treeData.table + "." + treeData.column
            var_select = selectstr;
          } else {
            selectstr = Trim(var_select) + ", ";
            selectstr += treeData.table + "." + treeData.column
            var_select = selectstr;
          }
        }
      }

      tablename = treeData.table;
      if (StripChars(" \r\n\t", var_from) == "")
      {
        var_from = tablename;
      } else {
        theStr = treeData.table;
        escStr = quoteMeta(theStr);
        var re = new RegExp(escStr, "gi");
        exactMatch = 0; 
        while((result = re.exec(var_from)) != null) {
          matchLoc = result.index;
          if (( matchLoc == 0 || var_from[matchLoc-1] == ' ' || var_from[matchLoc-1] == ',') && ( var_from[matchLoc + theStr.length] == ',' || var_from[matchLoc + theStr.length] == null ))
          {
            exactMatch = 1;
          }
        }
      
        if (exactMatch == 0)
        {
          //var_from += ", " + tablename;
          var tempStr = Trim(var_from)
          if(tempStr.lastIndexOf(",") == (tempStr.length -1))
          {
            tablename = Trim(var_from)  
            tablename += " " + treeData.table
            var_from = tablename;
          } else {
            tablename = Trim(var_from) + ", ";
            tablename += treeData.table
            var_from = tablename;
          }
        }

      }
      updateSQL_Box();
    } else
    {
      alert(MM.MSG_InvalidSQL);
    }
  } else {
    if((treeData.IsTable()) && (treeData.table != "undefined"))
    {
      //A table is selected.
      SP_Mode = false;
      if(parseSQLString(curText))
      {
        var tablename = treeData.table;
        if(StripChars(" \r\n\t", var_from)  == "")
        {
          var_from = tablename;
          updateSQL_Box();
        } else {
          theStr = treeData.table;
          escStr = quoteMeta(theStr);
          var re = new RegExp(escStr, "gi");
          exactMatch = 0; 
          while((result = re.exec(var_from)) != null) {
            matchLoc = result.index;
            if (( matchLoc == 0 || var_from[matchLoc-1] == ' ' || var_from[matchLoc-1] == ',') && ( var_from[matchLoc + theStr.length] == ',' || var_from[matchLoc + theStr.length] == null ))
            {
              exactMatch = 1;
            }
          }
        
          if(exactMatch == 0)
          {
            var tempStr = Trim(var_from)
            if(tempStr.lastIndexOf(",") == (tempStr.length -1))
            {
              tablename = Trim(var_from)  
              tablename += " " + treeData.table
              var_from = tablename;
            } else {
              tablename = Trim(var_from) + ", ";
              tablename += treeData.table
              var_from = tablename;
            }
            updateSQL_Box();
          }
        }
      } else
      {
        alert(MM.MSG_InvalidSQL);
      }
    } else {
      alert(MM.MSG_InvalidSelection);
    }
  }
  } else {
    //it's a stored procedure. Update accordingly.
    SP_Mode = true;
  updateSQLWithStoredProcedure();
  }

}

//onclick event handler for the "Add to where" button associated with the tree.
function ColumnAddToWhere()
{

  if (!IsSelectStatement())
  {
    alert(MM.MSG_CanOnlyUseButtonsOnSelectStatements)
    return
  }

  if(!IsConnectionSelected())
  {
  return;
  }

  var selectstr = "";
  var curText = SQL_BOX.value
  var treeData = TREE.getData();

  //Check if the selection is not a stored procedure
  if (!treeData.IsProcedure())  
  {
  //Proceed only if selection is a column
  if(treeData.IsColumn())
  {
    SP_Mode = false;
    if(parseSQLString(curText))
    {
      if(Trim(var_from) == "")
      {
        var_from = treeData.table;
      }

      if(Trim(var_where) == "")
      {
        var_where = treeData.column;
        updateSQL_Box();
      } else {
          //Do a check here to see if " AND" is not the last word.
        var trimWhereStr = Trim(var_where);
        if(addAndIsOkay(trimWhereStr))
          selectstr = Trim(var_where) + " AND ";
        else 
          selectstr = Trim(var_where) + " ";

        selectstr += treeData.column;
        var_where = selectstr;
        updateSQL_Box();
      }
    } 
  } else {
    alert(MM.MSG_SelectColumn);
  }
  } else {
    SP_Mode = true;
  updateSQLWithStoredProcedure();
  }
}


//onclick event handler for the "Add to where" button associated with the param grid.
function VarAddToWhere()
{
  if (!IsSelectStatement())
  {
    alert(MM.MSG_CanOnlyUseButtonsOnSelectStatements)
    return
  }

  if(!IsConnectionSelected())
  {
  return;
  }

  //var paramlist = PARAM_LIST.getContents();
  var paramlist = getParamListContents();
  if(paramlist.length == 0)
  {
  alert(MM.MSG_EmptyParamList);
  return;
  }


  if(!SP_Mode)
  {
    var selectstr = "";
    var selItem = PARAM_LIST.getIndex();
    var curText = SQL_BOX.value

    //Proceed only if a row in the grid is selected. 
  if(selItem != -1)
  {
    if(parseSQLString(curText) > -1)
    {
      //var pa = PARAM_LIST.getContents();
      var pa = getParamListContents();

      if (pa.length > 0)
      {
        var paramName = pa[selItem][0];
        var_where = Trim(var_where) + " = " + paramName;
        updateSQL_Box();
      }
    } else {
      alert(MM.MSG_InvalidSQL);
    }
  }
  } 
}


//adds the name of the selected param to the SQL statement.
function VarAddToEnd()
{
  if (!IsSelectStatement())
  {
    alert(MM.MSG_CanOnlyUseButtonsOnSelectStatements)
    return
  }

  if(!IsConnectionSelected())
  {
    return;
  }

  //var paramlist = PARAM_LIST.getContents();
  var paramlist = getParamListContents();
  if(paramlist.length == 0)
  {
  alert(MM.MSG_EmptyParamList);
  return;
  }


  //Check that the code in the SQL box is not an exec statement.  
  if (!SP_Mode)
  {
  var selItem = PARAM_LIST.getIndex();
  var curText = SQL_BOX.value
  
  if(selItem != -1)
  {
    //var pa = PARAM_LIST.getContents();
    var pa = getParamListContents();
    if (pa.length > 0)
    {
      var paramName = pa[selItem][0];
      curText = curText + " " + paramName;
      SQL_BOX.value = curText;
    }
  }
  }
}


//onclick event handler for the Add to Order by button.
function AddToOrderBy()
{
  if (!IsSelectStatement())
  {
    alert(MM.MSG_CanOnlyUseButtonsOnSelectStatements)
    return
  }

  if(!IsConnectionSelected())
  {
    return;
  }

  var selectstr = "";
  var curText = SQL_BOX.value
  var treeData = TREE.getData();
  
  //Proceed only if not a Stored procedure.
  if (!treeData.IsProcedure())  
  {
    //Check if selection is a column 
  if(treeData.IsColumn())
  {
    SP_Mode = false;
    if(parseSQLString(curText))
    {
      if(Trim(var_from) == "")
      {
        var_from = treeData.table;
      }
      if(Trim(var_orderby) == "")
      {
        var_orderby = treeData.column;
        updateSQL_Box();
      } else {
        var re = new RegExp("\\b" + treeData.column + "\\b", "gi");       
        if(var_orderby.search(re) == -1)
        {
          var tempStr = Trim(var_orderby)
          if(tempStr.lastIndexOf(",") == (tempStr.length -1))
        {
            selectstr = Trim(var_orderby)
            selectstr += " " + treeData.column
            var_orderby = selectstr;
          } else {
          selectstr = Trim(var_orderby) + ", ";
          selectstr += treeData.column;
          var_orderby = selectstr;
          }
          updateSQL_Box();
        }
      }
    } else {
      alert(MM.MSG_InvalidSQL);
    }
  } else {
    alert(MM.MSG_SelectColumn);
  }
  } else {
  //Update SQL with selected stored procedure syntax  
    SP_Mode = true;
  updateSQLWithStoredProcedure();
  }
}


function UpdateTreeSelection()
{
  //TREE_SEL_BOX.value = TREE.selectedItem
  var treeData = TREE.getData();
  if(treeData.IsProcedure())
  {
    //Enable/disable suitable buttons for the stored
    //proc selection
    StoredProcButtons()
  } else {
    //A table/view/column is selected. Do the needful.
    NotStoredProcButtons()
  }
}



function LaunchConnectionManager()
{
  var oldList = String(CONN_LIST.valueList).split(",")
  MMDB.showConnectionMgrDialog()
  PopulateConnectionList()
  var newConnectionIndex = getNewConnection(oldList, CONN_LIST.valueList)
  if (newConnectionIndex != -1)
  {
    CONN_LIST.setIndex(newConnectionIndex)
    ConnectionChanged()
  }
}


function IsConnectionSelected()
{
  
  var conn = CONN_LIST.getValue();
  if((conn == MM.LABEL_None) || (Trim(conn) == "") || (conn == MM.LABEL_EmptyOption))
  {
    alert(MM.MSG_NoConnection);
    return false;
  }
  return true;
}


function StoredProcButtons()
{
  disableTheButton(WHERE_BUTTON)
  disableTheButton(ORDERBY_BUTTON)
  SELECT_BUTTON.value = MM.LABEL_AddProc;
}


function NotStoredProcButtons()
{
  enableTheButton(WHERE_BUTTON)
  enableTheButton(ORDERBY_BUTTON)
  SELECT_BUTTON.value = MM.LABEL_AddSelect;
}


function enableTheButton(obj)
{
  var re1 = /(\s*|.*)(DISABLED="true" )(\s|.*)/
  var source = obj.outerHTML;

  if(source.search(re1) != -1)
  {
    source = RegExp.$1 + RegExp.$3
  }

  obj.outerHTML = source;
}


function disableTheButton(obj)
{
  var str = "DISABLED=\"true\" "
  var re1 = /(\s*|.*)(DISABLED="true" )(\s|.*)/i
  var re2 = /(\s*|.*)(NAME)(\s|.*)/i
  var source = obj.outerHTML;

  if(source.search(re1) == -1)
  {
    if(source.search(re2) != -1)
    {
      source = RegExp.$1 + str + RegExp.$2 + RegExp.$3
    }
  }

  obj.outerHTML = source;
}


function PopulateConnectionList()
{
  var oldConn = CONN_LIST.getValue()

  var connList = MMDB.getConnectionList()

  var wholeList = new Array()

  wholeList.push(MM.LABEL_None)
  for (var i = 0; i < connList.length; i++)
  {
    wholeList.push(connList[i])
  }

  CONN_LIST.setAll(wholeList, wholeList)
  CONN_LIST.setValue(MM.LABEL_None, 0)

  var index = CONN_LIST.getIndex(oldConn)

  if (!CONN_LIST.pickValue(oldConn)) 
  {
    if (CONN_LIST.getLen() == 2) 
    { 
      CONN_LIST.setIndex(1)
      ConnectionChanged()
    }
    else
    {
      CONN_LIST.setIndex(0)
    }
  } else { 

    //the database tree ctrl could be populated
    //already... so, it needs to be refreshed. The tree control will not 
    //refresh itself if the connection passed in is the same, so set it 
    //to a dummy value and then re-set the original connection. This will
    //force it to update the meta-data.
    TREE.setConnection("");
    TREE.setConnection(oldConn);
  }
}


function PlusMouseDown()
{
  PLUS_BUTTON.src = "../Shared/UltraDev/Images/PlusButtonDepressed.gif";
}


function PlusMouseUp()
{
  PLUS_BUTTON.src="../Shared/UltraDev/Images/PlusButton.gif";
  AddParam();
}


function MinusMouseDown()
{
  if(PARAM_LIST.getIndex() >= 0) {
  MINUS_BUTTON.src = "../Shared/UltraDev/Images/MinusButtonDepressed.gif";
  }
}


function MinusMouseUp()
{
  if(PARAM_LIST.getIndex() >= 0) {
  MINUS_BUTTON.src="../Shared/UltraDev/Images/MinusButtonEnabled.gif";
    DeleteParam();
  }
}


function receiveArguments(errorMsg) {
  ERROR_MESSAGE = errorMsg;
}


function addAndIsOkay(str)
{
  var tempStr = str.toUpperCase();
  var lt = str.length;
  
  var reIN = /\bis/gi;
  var reIS = /\bin/gi;
  var reNOT = /\bnot/gi;
  var reLIKE = /\blike/gi;

    if(tempStr.lastIndexOf(CONST_AND) == (tempStr.length - 4))
    return false;
  
  var substr2 = str.substr(str.length - 2, 2);
  var substr1 = str.substr(str.length - 1, 1);

    //Check for the mathematical operators <=, <> and >=
  if((substr2 == "<=") || (substr2 == ">=") || (substr2 == "<>"))
    return false;

  //Check for the mathematical operators =, <, and >
    if((substr1 == "=") || (substr1 == "<") || (substr1 == ">"))
    return false;

  if((str.search(reIS) == lt-2) || (str.search(reIN) == lt-2) || (str.search(reNOT) == lt-3) || (str.search(reLIKE) == lt-4))
    return false;  

  return true;
}


// IAKT: Added by BRI on 08/07/02
function rsTypeChanged(){
	
}

//--------------------------------------------------------------------
// FUNCTION:
//   canDisplayRecordset
//
// DESCRIPTION:
//   Check if the Recordset Object can be displayed by this Command
//
// ARGUMENTS:
//   rsObject - the Recordset Object. Contains information about the recordset that needs to be displayed
//
// RETURNS:
//   boolean - (true if the recordset can be displayed)
//--------------------------------------------------------------------

function canDisplayRecordset(rsObject) {
	return true;
}
