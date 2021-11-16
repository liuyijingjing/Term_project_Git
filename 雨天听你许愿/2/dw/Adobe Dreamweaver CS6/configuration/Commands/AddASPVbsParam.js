// Copyright 2002-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

var helpDoc = MM.HELP_cmdASPNetAddParam;

var _ParamName = null;
var _ParamType = null;
var _ParamValue = null;
var _ParamDefaultValue = null;


//*************************API**************************

//--------------------------------------------------------------------
// FUNCTION:
//   commandButtons
//
// DESCRIPTION:
//   Returns the array of buttons that should be displayed on the
//   right hand side of the dialog.  The array is comprised
//   of name, handler function name pairs.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   array of strings - name, handler function name pairs
//--------------------------------------------------------------------

function commandButtons()
{                          
  return new Array(MM.BTN_OK,     "okClicked()",
                   MM.BTN_Cancel, "cancelClicked()",
                   MM.BTN_Help,   "displayHelp()" );
}

//--------------------------------------------------------------------
// FUNCTION:
//   okClicked
//
// DESCRIPTION:
//   Sets the return value to the selected DSN and closes the window.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function okClicked()
{
  var paramName = _ParamName.value;
  
  if (paramName != "")
  {
    var paramValue = _ParamValue.value;

	if (paramValue != "")
	{
      var retVal = new Array();

      retVal.push(_ParamName.value);
      retVal.push(_ParamType.getValue());
      retVal.push(_ParamValue.value);
      retVal.push(_ParamDefaultValue.value);

      dwscripts.setCommandReturnValue(retVal);
      window.close();
    }
	else
	{
	  alert(MM.MSG_NeedParamValue);
	  _ParamValue.focus();
	}
  }
  else
  {
    alert(MM.MSG_NeedParamName);
    _ParamName.focus();
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   cancelClicked
//
// DESCRIPTION:
//   Closes the window and returns nothing
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function cancelClicked()
{
  dwscripts.setCommandReturnValue("");
  window.close();
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
}

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
  // Initialize UI elements

  var cmdArgs = dwscripts.getCommandArguments();

  _ParamName = dwscripts.findDOMObject("ParamName"); 
  _ParamType = new ListControl("ParamType");
  _ParamValue = dwscripts.findDOMObject("ParamValue");
  _ParamDefaultValue = dwscripts.findDOMObject("ParamDefaultValue");

  var paramName = "";
  var paramType = "";
  var paramValue = "";
  var paramDefaultValue = "";
 
  if (cmdArgs)
  {
    if (cmdArgs.length > 0)
    {
      var databaseType = cmdArgs[0];
	  //SBDatabaseCallASPNET.getParamTypeList(databaseType);
      var UNUSEDtypesLabels = [
		"idispatch", "error", "variant", "iunknown", "ebigint", "guid", "binary", "userdefined",
		"longchar", "memo", "string", "varbinary", "longvarbinary", "longbinary"
	  ];
	// ADDED: Filetime,

      var typesValues = FieldTypes.getCastValues();
	  var typesLabels = FieldTypes.getCastLabels(typesValues);
   
	  _ParamType.setAll(typesLabels, typesValues);
	}

	if (cmdArgs.length > 3)
	{
      paramName = cmdArgs[1];
	  paramType = cmdArgs[2];
      paramValue = cmdArgs[3];
      paramDefaultValue = cmdArgs[4];
	}
  }
   
  _ParamName.value = paramName;
  _ParamType.pickValue(paramType);
  _ParamValue.value = paramValue;
  _ParamDefaultValue.value = paramDefaultValue;

  _ParamName.focus();
}

