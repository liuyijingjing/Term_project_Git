// Copyright 2002-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.


// *************** GLOBALS VARS *****************

var helpDoc = MM.HELP_ssAdvancedRecordset;


var RECORDSET_SBOBJ;  // SBRecordset argument to the command.
var CMD_FILENAME_SIMPLE;
var RECORDSET_TYPE = 'Advanced';
var SB_FILE = dw.getConfigurationPath() + "/ServerBehaviors/PHP_MySQL/Recordset.htm";


var _RecordsetName = new TextField("Recordset.htm", "RecordsetName");
var _ConnectionName = new ConnectionMenu("Recordset.htm", "ConnectionName");
var _SQL = new TextField("Recordset.htm", "SQL");
var _ParamList = null;
var _DBTree = null;
var _RsTypeParameter = new RsTypeMenu("Recordset.htm", "RsTypeParameter",recordsetDialog.searchByType(RECORDSET_TYPE));

var _PlusBtn = null;
var _MinusBtn = null;

var _ParamName = null;
var _ParamType = null;
var _ParamDefaultValue = null;
var _ParamRuntimeValue = null;
var _ParamEditBtn = null;

var sqlObject = null;
var STATIC_LENGTH = 190;


// ******************* API **********************

//--------------------------------------------------------------------
// FUNCTION:
//   commandButtons
//
// DESCRIPTION:
//   Returns the list of buttons which should appear on the right hand
//   side of the dialog
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   Array - pairs of button name and function call
//--------------------------------------------------------------------

function commandButtons()
{
	btnArray =  new Array(
		MM.BTN_OK,       "clickedOK()", 
                   MM.BTN_Cancel, "clickedCancel()", 
        MM.BTN_Test,     "clickedTest()");
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
//--------------------------------------------------------------------
function clickedChange(newUIAction) {
  // Update RECORDSET_SBOBJ from the UI.
  updateSBRecordsetObject();

  recordsetDialog.onClickSwitchUI(window, newUIAction, 
                                  RECORDSET_SBOBJ, MM.rsTypes[newUIAction].command);
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
//--------------------------------------------------------------------
function clickedChange(newUIAction) {
  // Update RECORDSET_SBOBJ from the UI.
  updateSBRecordsetObject();

  recordsetDialog.onClickSwitchUI(window, newUIAction, 
                                  RECORDSET_SBOBJ, MM.rsTypes[newUIAction].command);
}

//--------------------------------------------------------------------
// FUNCTION:
//   clickedOK
//
// DESCRIPTION:
//   This function is called when the user clicks OK
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function clickedOK()
{
  // Update RECORDSET_SBOBJ from the UI.
  updateSBRecordsetObject();

  // Save the selected connection for next time if there's more
  // than one connection (if there's only one, it'll get selected
  // automatically; no need to save it).
  if (_ConnectionName.listControl.getLen() > 2)
  {
    dwscripts.saveExtensionData(SB_FILE,"lastConnection",_ConnectionName.getValue());
  }
  
  recordsetDialog.onClickOK(window, RECORDSET_SBOBJ);
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedCancel
//
// DESCRIPTION:
//   This function is called when CANCEL is clicked
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function clickedCancel()
{
  recordsetDialog.onClickCancel(window);
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedTest
//
// DESCRIPTION:
//   This function is called when the user clicks the TEST button
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function clickedTest()
{
  // Update RECORDSET_SBOBJ from the UI.
  updateSBRecordsetObject();

  recordsetDialog.displayTestDialog(RECORDSET_SBOBJ);
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedSimple
//
// DESCRIPTION:
//   This function is called when the user clicks the SIMPLE button
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

//function clickedSimple()
//{
//  // Update RECORDSET_SBOBJ from the UI.
//  updateSBRecordsetObject();
//
//  recordsetDialog.onClickSwitchUI(window, recordsetDialog.UI_ACTION_SWITCH_SIMPLE, 
//                                  RECORDSET_SBOBJ, CMD_FILENAME_SIMPLE);
//}


//--------------------------------------------------------------------
// FUNCTION:
//   displayHelp
//
// DESCRIPTION:
//   This function is called when the user clicks the HELP button
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function displayHelp()
{
  dwscripts.displayDWHelp(helpDoc);
}


// ***************** LOCAL FUNCTIONS  ******************

//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   This function is called in the onLoad event.  It is responsible
//   for initializing the UI.  If we are inserting a recordset, this
//   is a matter of populating the connection drop down.
//
//   If we are modifying a recordset, this is a matter of inspecting
//   the recordset tag and setting all the form elements.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function initializeUI()
{
  var args = dwscripts.getCommandArguments();
  RECORDSET_SBOBJ = args;
  //CMD_FILENAME_SIMPLE = args[1];
  
  _ParamName = dwscripts.findDOMObject("ParamName");
  _ParamType = dwscripts.findDOMObject("ParamType");
  _ParamDefaultValue = dwscripts.findDOMObject("ParamDefaultValue");
  _ParamRuntimeValue = dwscripts.findDOMObject("ParamRuntimeValue");

  _PlusBtn = new ImageButton("plusButton", "_PlusBtn", "sSd", false);
  _MinusBtn = new ImageButton("minusButton", "_MinusBtn", "sSd", false);
  _ParamEditBtn = dwscripts.findDOMObject("EditParam"); 

  // set the readonly param properties
  _ParamName.innerHTML = dwscripts.entityNameEncode(MM.LABEL_ParamAttributesName);
  _ParamType.innerHTML = dwscripts.entityNameEncode(MM.LABEL_ParamAttributesType);
  _ParamDefaultValue.innerHTML = dwscripts.entityNameEncode(MM.LABEL_ParamAttributesDefaultValue);
  _ParamRuntimeValue.innerHTML = dwscripts.entityNameEncode(MM.LABEL_ParamAttributesRuntimeValue);

  // Initialize the UI elements
  _RsTypeParameter.initializeUI();
  _RecordsetName.initializeUI();
  _ConnectionName.initializeUI();
  _SQL.initializeUI();
  _ParamList = new ListControl("ParamList"); //new GridControl("ParamList");
  _DBTree = new DatabaseTreeControl("DBTree");

  // Retrieve the connection from last time if there's more
  // than one connection (if there's only one, it'll get selected
  // automatically).
  if (_ConnectionName.listControl.getLen() > 2)
  {
    var conn = dwscripts.retrieveExtensionData(SB_FILE,"lastConnection");
    if (conn)
      _ConnectionName.pickValue(conn);
  }

  // If a connection was picked automatically, act like the user
  // picked it and update the rest of the UI.
  if (_ConnectionName.listControl.getIndex() > 0)
    updateUI("ConnectionName", "onChange");

	if (RECORDSET_SBOBJ.subType) {
		_RsTypeParameter.pickValue(RECORDSET_SBOBJ.subType);
	} else if (RECORDSET_SBOBJ.getParameter("MM_subType")) {
		_RsTypeParameter.pickValue(RECORDSET_SBOBJ.getParameter("MM_subType"));
	}

  var rsName = RECORDSET_SBOBJ.getRecordsetName();
  if (!rsName)
  {
    rsName = RECORDSET_SBOBJ.getUniqueRecordsetName();
  }
  _RecordsetName.setValue(rsName);
  
  var connectionName = RECORDSET_SBOBJ.getConnectionName();
  if (connectionName)
  {
    _ConnectionName.pickValue(RECORDSET_SBOBJ.getConnectionName());
  }

  var sqlParams = new Array();
  var sqlString = RECORDSET_SBOBJ.getDatabaseCall(sqlParams);
  if (sqlString)
  {
    sqlObject = new SQLStatement(sqlString);
    sqlObject.formatStatement();
    _SQL.setValue(sqlObject.getStatement());
  }
  else
  {
    sqlObject = new SQLStatement("");
  }

  var labels = new Array();
  var values = new Array();
  var varArray = new Array();
  var count = sqlParams.length;
  for (var i=0; i < count; i++)
  {
    var param = sqlParams[i];
    var row = new Array();	// AICI
    row.name = param.varName
    row.type = param.varType;
    row.defaultVal = param.defaultValue;
    row.runtimeVal = param.runtimeValue;
    varArray.push(row);

	labels.push(row.name);
	values.push(row);
  }
	_ParamList.setAll(labels, values);
	onParameterChanged();

  elts = document.forms[0].elements;
  if (elts && elts.length)
  {
    elts[0].focus();
    elts[0].select();
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateUI
//
// DESCRIPTION:
//   This function is called by the UI controls to handle UI updates
//
// ARGUMENTS:
//   control - string - the name of the control sending the event
//   event - string - the event which is being sent
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function updateUI(control, event)
{
  if (control == "plusButton") {
	var cmdArgs = dwscripts.callCommand("AddPHPParam", null);
	
    if (cmdArgs) {
	  var param = new Object();
	  param.name = cmdArgs[0];
	  param.type = cmdArgs[1];
	  param.defaultVal = cmdArgs[2];
      param.runtimeVal = cmdArgs[3];

	  _ParamList.add(param.name, param);
	  onParameterChanged();
	 }
  } else if (control == "minusButton") {
    _ParamList.del();
    onParameterChanged();
  } else if (control == "EditParam") {
		var param = _ParamList.getValue();

		var cmdArgs = new Array();
		cmdArgs.push(param.name);
		cmdArgs.push(param.type);
		cmdArgs.push(param.defaultVal);
		cmdArgs.push(param.runtimeVal);

		var ret = dwscripts.callCommand("EditPHPParam", cmdArgs);

		if (ret && ret.length) {
			param.name = ret[0];
			param.type = ret[1];
			param.defaultVal = ret[2];
			param.runtimeVal = ret[3];

			_ParamList.set(param.name);

			onParameterChanged();
		}
  } else if (control == "ParamList") {
		onParameterChanged();
  }
  else if (control == "Define")
  {
    _ConnectionName.launchConnectionDialog();
    _DBTree.setConnection(_ConnectionName.getValue());
  }
  else if (control == "ConnectionName")
  {
    _DBTree.setConnection(_ConnectionName.getValue());
    updateButtons();
  }
  else if (control == "DBTree")
  {
    // place code here to enable and disable insertion buttons
    // based on the DB tree selection
  }
  else if (control == "SelectButton")
  {
    sqlObject.setStatement(_SQL.getValue());
    if (sqlObject.getType() == SQLStatement.STMT_TYPE_SELECT ||
        sqlObject.getType() == SQLStatement.STMT_TYPE_EMPTY)
    {
      var dbInfo = _DBTree.getSelectedData();

      if ( dbInfo && (dbInfo.isTable() || dbInfo.isColumn()) )
      {
        sqlObject.addFrom(dbInfo.table);
        if (dbInfo.isColumn())
        {
          sqlObject.addSelect(dbInfo.table, dbInfo.column);
        }

        _SQL.setValue(sqlObject.getStatement());
      }
    }
    else
    {
      alert(MM.MSG_CanOnlyUseButtonsOnSelectStatements);
    }
  }
  else if (control == "WhereButton")
  {
    sqlObject.setStatement(_SQL.getValue());
    if (sqlObject.getType() == SQLStatement.STMT_TYPE_SELECT)
    {
      var dbInfo = _DBTree.getSelectedData();

      if ( dbInfo && dbInfo.isColumn() )
      {
        sqlObject.addWhere(dbInfo.table, dbInfo.column);
        _SQL.setValue(sqlObject.getStatement());
      }
    }
    else if (sqlObject.getType() != SQLStatement.STMT_TYPE_EMPTY)
    {
      alert(MM.MSG_CanOnlyUseButtonsOnSelectStatements);
    }
  }
  else if (control == "OrderByButton")
  {
    sqlObject.setStatement(_SQL.getValue());
    if (sqlObject.getType() == SQLStatement.STMT_TYPE_SELECT)
    {
      var dbInfo = _DBTree.getSelectedData();

      if ( dbInfo && dbInfo.isColumn() )
      {
        sqlObject.addOrderBy(dbInfo.table, dbInfo.column);
        _SQL.setValue(sqlObject.getStatement());
      }
    }
    else if (sqlObject.getType() != SQLStatement.STMT_TYPE_EMPTY)
    {
      alert(MM.MSG_CanOnlyUseButtonsOnSelectStatements);
    }
  } else if (control == "SQL") {
  }
}

function onParameterChanged()
{
  var paramName = "";
  var paramType = "";
  var paramDefaultValue = "";
  var paramRuntimeValue = "";

  var param = _ParamList.getValue();
    
  if (param)
  {
  	paramName = param.name;
	paramType = paramName ? (FieldTypes.getDisplayNameForDBType(param.type)) : "";
    paramDefaultValue = param.defaultVal;
    paramRuntimeValue = param.runtimeVal;
  }

  var shortParamName = dw.shortenString(MM.LABEL_ParamAttributesName + paramName, STATIC_LENGTH, false);
  _ParamName.innerHTML = dwscripts.entityNameEncode(shortParamName);
  
  var shortParamType = dw.shortenString(MM.LABEL_ParamAttributesType + paramType, STATIC_LENGTH, false);
  _ParamType.innerHTML = dwscripts.entityNameEncode(shortParamType);

  var shortParamDefaultValue = dw.shortenString(MM.LABEL_ParamAttributesDefaultValue + paramDefaultValue, STATIC_LENGTH, false);
  _ParamDefaultValue.innerHTML = dwscripts.entityNameEncode(shortParamDefaultValue);

  var shortParamRuntimeValue = dw.shortenString(MM.LABEL_ParamAttributesRuntimeValue + paramRuntimeValue, STATIC_LENGTH, false);
  _ParamRuntimeValue.innerHTML = dwscripts.entityNameEncode(shortParamRuntimeValue);

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
	var dbTreeInfo = _DBTree.getSelectedData(); 
	var isProcedure = dbTreeInfo ? dbTreeInfo.isProcedure() : false;

	_MinusBtn.setDisabled(!param || isProcedure);

	if (_ConnectionName.getValue() && !isProcedure) {
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

//	var contents = _ParamList.getValue("all");
//	for (var i=0; i<contents.length; i++) {
//		retArray.push(new Array());
//		retArray[i].push(contents[i].name);
//		retArray[i].push(contents[i].type);
//		retArray[i].push(contents[i].defaultVal);
//		retArray[i].push(contents[i].runtimeVal);
//	}

	retArray = _ParamList.getValue("all");

	return retArray;
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateSBRecordsetObject
//
// DESCRIPTION:
//   Collects information from the UI and sets the SBRecordset object
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   boolean - true if successful, false otherwise
//--------------------------------------------------------------------

function updateSBRecordsetObject()
{
  RECORDSET_SBOBJ.setRecordsetName(_RecordsetName.getValue());

  RECORDSET_SBOBJ.setConnectionName(_ConnectionName.getValue());

  var sqlParams = new Array();
  var varArray = getParamListContents(); //_ParamList.getAll();
  for (var i=0; i < varArray.length; i++)
  {
    var param = new Object();
    param.varName = varArray[i].name;
    param.varType = varArray[i].type;
    param.defaultValue = varArray[i].defaultVal;
    param.runtimeValue = varArray[i].runtimeVal;
    sqlParams.push(param);
  }

  RECORDSET_SBOBJ.setDatabaseCall(_SQL.getValue(), sqlParams);
	// set the MM_subType parameter 
	RECORDSET_SBOBJ.setParameter("MM_subType",_RsTypeParameter.getValue());
}




//--------------------------------------------------------------------
// FUNCTION:
//   canDisplayRecordset
//
// DESCRIPTION:
//   Returns true if the given recordset can be displayed in this
//   recordset dialog. Called by the recordsetDialog to determine which
//   dialog to display.
//
// ARGUMENTS: 
//   sbRecordset - SBRecordset. the recordset to check.
//
// RETURNS:
//   boolean - true if can display the recordset.
//--------------------------------------------------------------------

function canDisplayRecordset(sbRecordset) 
{
	return true;
}
