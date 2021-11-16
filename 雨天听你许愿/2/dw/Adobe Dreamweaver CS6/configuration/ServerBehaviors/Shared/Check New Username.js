// Copyright 2001-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//*************** GLOBALS VARS *****************

var LIST_FORMELEMENT;
var EDIT_GOTOURLONUSERNAMEEXISTS;

var EMPTY_LIST = new Array("");


//******************* API **********************

//--------------------------------------------------------------------
// FUNCTION:
//   canApplyServerBehavior
//
// DESCRIPTION:
//   Returns true if a Server Behavior can be applied to the current
//   document
//
// ARGUMENTS:
//   sbObj - ServerBehavior object - one of the objects returned
//           from findServerBehaviors
//
// RETURNS:
//   boolean - true if the behavior can be applied, false otherwise
//--------------------------------------------------------------------
function canApplyServerBehavior(sbObj)
{
  var success = true;
  if (!sbObj) 
  {
    // attempting to add the behavior - check to see if one already exists on the page
    var ourSBs = new Array();
	ourSBs = ourSBs.concat(dwscripts.getServerBehaviorsByFileName("Check New Username.htm"));
	ourSBs = ourSBs.concat(dwscripts.getServerBehaviorsByFileName("Check New Username2.htm"));
    if (ourSBs.length != 0)
    {
      alert(MM.MSG_OnlyOneInstanceAllowed);
      success=false;
    }
  } 

  if (success)
  {
    var insertSBs = new Array();
	insertSBs = insertSBs.concat(dwscripts.getServerBehaviorsByFileName("Insert Record.htm"));
	insertSBs = insertSBs.concat(dwscripts.getServerBehaviorsByFileName("Insert Record2.htm"));
    if (insertSBs.length == 0)
    {
      if (sbObj != null)
      {
        alert(MM.MSG_InsertBehaviorMissing);
      } 
      else 
      {
        alert(MM.MSG_MustHaveInsertBehavior);
      }
      success = false;
    }
  }

  if (success && (sbObj != null) && sbObj.incomplete)
  {
    alert(MM.MSG_OutOfSyncWithInsert);
  }
  
  return success;
}

//--------------------------------------------------------------------
// FUNCTION:
//   findServerBehaviors
//
// DESCRIPTION:
//   Returns an array of ServerBehavior objects, each one representing
//   an instance of this Server Behavior on the page
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   JavaScript Array of ServerBehavior objects
//--------------------------------------------------------------------
function findServerBehaviors()
{
  sbArray = dwscripts.findSBs(MM.LABEL_TitleRedirectIfUsernameFound);
  
  for (var i=0; i<sbArray.length; i++) {
	sbArray[i].parameters.tableName = FieldTypes.decodeSQLReference(sbArray[i].parameters.tableName);
	sbArray[i].parameters.fldUsername = FieldTypes.decodeSQLReference(sbArray[i].parameters.fldUsername);
  }

  return sbArray;
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyServerBehavior
//
// DESCRIPTION:
//   Collects values from the form elements in the dialog box and
//   adds the Server Behavior to the user's document
//
// ARGUMENTS:
//   sbObj - ServerBehavior object - one of the objects returned
//           from findServerBehaviors
//
// RETURNS:
//   string - empty upon success, or an error message
//--------------------------------------------------------------------
function applyServerBehavior(sbObj)
{
  var paramObj = new Object();
  var errStr = "";

  if (EDIT_GOTOURLONUSERNAMEEXISTS.value == "")
  {
    errStr = MM.MSG_MustSupplyRedirectPage;
  }
  
  if (!errStr)
  {
    var frmUsername = LIST_FORMELEMENT.getValue();
    
    var insertSBs = new Array();
	insertSBs = insertSBs.concat(dwscripts.getServerBehaviorsByFileName("Insert Record.htm"));
	insertSBs = insertSBs.concat(dwscripts.getServerBehaviorsByFileName("Insert Record2.htm"));
    if (insertSBs.length != 0)
    {
      var insertSB = insertSBs[0];
      
      // find the form element in the insert bindings array
      var fields = insertSB.parameters.fields;
      var idxBinding = -1;
      for (i=0; i < fields.length; i=i+3)
      {
        if (fields[i] == frmUsername)
        {
          idxBinding = i;
          break;
        }
      }
      if (idxBinding >= 0)
      {
        paramObj.frmUsername    = frmUsername;
        paramObj.dupKeyRedirect = EDIT_GOTOURLONUSERNAMEEXISTS.value;
        paramObj.connName       = insertSB.parameters.cname;
        paramObj.tableName      = FieldTypes.encodeSQLReference(insertSB.parameters.table, paramObj.connName);
        paramObj.fldUsername    = FieldTypes.encodeSQLReference(insertSB.parameters.fields[idxBinding +1], paramObj.connName);
		
		// InterAKT stuff
		var fieldObj = FieldTypes.getFieldObj(paramObj.connName, paramObj.tableName, paramObj.fldUsername);
		paramObj.paramType = FieldTypes.getFieldTypeFromObj(fieldObj);
		paramObj.paramSize = FieldTypes.getFieldSizeFromObj(fieldObj);
		paramObj.paramSize = FieldTypes.checkSizeForRSParameter(paramObj.paramType, paramObj.paramSize);
		paramObj.paramTypeDisplayName = FieldTypes.getParameterTypeDisplayName(paramObj.paramType);
      } 
      else
      {
        errStr = MM.MSG_NoFormElementFound;
      }
    } 
    else
    {
      errStr = MM.MSG_NoInsertBehavior;
    }    
  }
  
  if (!errStr)
  {
	var sbFileName = dwscripts.getSBFileName();
    var currServerModel = dw.getDocumentDOM().serverModel.getServerName();
	if (currServerModel != "JSP") {
		sbFileName = "Check New Username2.htm";
	} else if (sbObj) {
		sbObj.setForcePriorUpdate("CheckNewUsername_main");
	}

    dwscripts.applySB(paramObj, sbObj, sbFileName);
  }
  return errStr;
}



//--------------------------------------------------------------------
// FUNCTION:
//   analyzeServerBehavior
//
// DESCRIPTION:
//   Performs extra checks needed to determine if the Server Behavior
//   is complete
//
// ARGUMENTS:
//   sbObj - ServerBehavior object - one of the objects returned
//           from findServerBehaviors
//   allRecs - JavaScripts Array of ServerBehavior objects - all of the
//             ServerBehavior objects known to Dreamweaver
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function analyzeServerBehavior(sbObj, allRecs)
{
  var idxBinding;

  var insertSBs = new Array();
  insertSBs = insertSBs.concat(dwscripts.getServerBehaviorsByFileName("Insert Record.htm"));
  insertSBs = insertSBs.concat(dwscripts.getServerBehaviorsByFileName("Insert Record2.htm"));
  if (insertSBs.length != 0)
  {
    var insertSB = insertSBs[0];
    
    // find the username form element in the insert bindings array
    idxBinding = -1;
    var fields = insertSB.parameters.fields;
    for (i=0; i < fields.length; i=i+3)
    {
      if (fields[i] == sbObj.getParameter("frmUsername"))
      {
        idxBinding = i;
        break;
      }
    }
    if (idxBinding >= 0)
    {
      if (fields[idxBinding+1] != sbObj.getParameter("fldUsername"))
      {
        sbObj.incomplete = true;
      }
      if (insertSB.parameters.cname != sbObj.getParameter("connName"))
      {
        sbObj.incomplete = true;
      }
      if (insertSB.parameters.table != sbObj.getParameter("tableName"))
      {
        sbObj.incomplete = true;
      }
    } 
    else 
    { // can't find the username form element in the insert behavior.
      sbObj.incomplete = true;
    }
  } 
  else
  {
    sbObj.incomplete = true;
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   inspectServerBehavior
//
// DESCRIPTION:
//   Sets the values of the form elements in the dialog box based
//   on the given ServerBehavior object
//
// ARGUMENTS:
//   sbObj - ServerBehavior object - one of the objects returned
//           from findServerBehaviors
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function inspectServerBehavior(sbObj)
{
  // select form in form list
  EDIT_GOTOURLONUSERNAMEEXISTS.value = sbObj.getParameter("dupKeyRedirect");
  LIST_FORMELEMENT.pickValue(sbObj.getParameter("frmUsername"));
}


//--------------------------------------------------------------------
// FUNCTION:
//   deleteServerBehavior
//
// DESCRIPTION:
//   Remove the specified Server Behavior from the user's document
//
// ARGUMENTS:
//   sbObj - ServerBehavior object - one of the objects returned
//           from findServerBehaviors
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function deleteServerBehavior(sbObj)
{
  dwscripts.deleteSB(sbObj);
  return true;
}


//--------------------------------------------------------------------
// FUNCTION:
//   displayHelp
//
// DESCRIPTION:
//   Displays the built-in Dreamweaver help.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function displayHelp()
{
  // Replace the following call if you are modifying this file for your own use.
  dwscripts.displayDWHelp(HELP_DOC);
}


//***************** LOCAL FUNCTIONS  ******************

//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   Prepare the dialog and controls for user input
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function initializeUI()
{
  var insertSBs = new Array();
  insertSBs = insertSBs.concat(dwscripts.getServerBehaviorsByFileName("Insert Record.htm"));
  insertSBs = insertSBs.concat(dwscripts.getServerBehaviorsByFileName("Insert Record2.htm"));
  if (insertSBs.length != 0)
  {
    var insertSB = insertSBs[0];
    
    var formElementNames = new Array();
    var fields = insertSB.parameters.fields;
    for (i=0; i < fields.length; i=i+3)
    {
      formElementNames.push(fields[i]);
    }

    LIST_FORMELEMENT = new ListControl("listFormElement");
    LIST_FORMELEMENT.setAll(formElementNames,formElementNames);
    
    EDIT_GOTOURLONUSERNAMEEXISTS = dwscripts.findDOMObject("textGoToURLOnUsernameExists");
  } 
  else
  {
    alert(MM.MSG_NoInsertBehavior);
  }

  elts = document.forms[0].elements;
  if (elts && elts.length)
    elts[0].focus();
}


//--------------------------------------------------------------------
// FUNCTION:
//   onClickBtnFileBrowserOnUsernameExists
//
// DESCRIPTION:
//   As the name says: on click button file browser on username exists
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function onClickBtnFileBrowserOnUsernameExists()
{
  var fileName = browseForFileURL();  //returns a local filename
  if (fileName)
  {
    EDIT_GOTOURLONUSERNAMEEXISTS.value = fileName;
  }
}
