// Copyright 2009 Adobe Systems Incorporated.  All rights reserved

var PLATFORM = navigator.platform;
var ICON_URL = (PLATFORM == "Win32") ? "../Shared/MM/Images/alertIconWin.gif" : "../Shared/MM/Images/yield28x28.gif";

var HELP_DOC = MM.HELP_BrowserLabPermissionSettings;
var RG_PERMISSION  = new RadioGroup("permssion");

//localized allow/deny
var _gLocalizedAllow = "";
var _gLocalizedDeny = "";
var _gMeerMeerDWService = "BL";
var _allowLocalContentPrefKey = "ALLOW_LOCAL_PREVIEW";



//---------------   GLOBAL VARIABLES   ---------------
var OBJECT_FILE = dw.getConfigurationPath() + '/Commands/BL_PermissionSettings.htm';
var helpDoc = MM.HELP_BrowserLabPermissionSettings;
//--------------------------------------------------------------------
// FUNCTION:
//   displayHelp
//
// DESCRIPTION:
//   called when the user clicks the Help button. in this implementation,

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


//--------------------------------------------------------------------
// FUNCTION:
//   commandButtons
//
// DESCRIPTION:
//   dialog button control
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function commandButtons()
{
  return new Array(MM.BTN_OK,"clickedOK()",
                   MM.BTN_Cancel,"cancelClicked()",
                   MM.BTN_Help,"displayHelp()");
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedOK
//
// DESCRIPTION:
//   called when the user clicks OK, manages updating the list of URLs
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function clickedOK()
{
	//save the permission 
	var rgValue = RG_PERMISSION.getSelectedValue();
	savePreference(_allowLocalContentPrefKey, rgValue);

	//set command return value
	dwscripts.setCommandReturnValue("ok");

	//dismiss the dialog
	window.close();
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
	//set command return value
	dwscripts.setCommandReturnValue("cancel");
	window.close();
}



//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   prepare the dialog for user feedback
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function initializeUI()
{
  // Use the right icon for the platform.
  document.confirmIcon.src = ICON_URL;	

  //get the permission state
  var allowLocalContentPrefValue = getPreference(_allowLocalContentPrefKey);
  if (allowLocalContentPrefValue && allowLocalContentPrefValue.length) 
  {
	  allowLocalContentPrefValue = allowLocalContentPrefValue.toLowerCase();
	  if (allowLocalContentPrefValue.indexOf("allow") != -1) {
		RG_PERMISSION.setSelectedValue("Allow");	  
	  }
	  else if (allowLocalContentPrefValue.indexOf("deny") != -1) {
		RG_PERMISSION.setSelectedValue("Deny");	  
	  }
	  else {
		//default to allow
 		RG_PERMISSION.setSelectedValue("Allow");	  
	  }
  }
  else {
		//default to allow
 		RG_PERMISSION.setSelectedValue("Allow");	  
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateUI
//
// DESCRIPTION:
//   update the UI based on user feedback.
//
// ARGUMENTS:
//   theArg -- label for element or elements to update
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateUI(theArg)
{
  if(theArg == "permission")
  {
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   getPreference
//
// DESCRIPTION:
//   reads the persisted value (sticky) value using the CSXS Persistence (Flex API)
//
// ARGUMENTS:
//   prefKey
//
// RETURNS:
//   prefValue
//--------------------------------------------------------------------
function getPreference(aPrefKey)
{
	var aPrefValue = "";
	var getPreferenceString = '<invoke name="getPreference" returntype="xml"><arguments>';
	getPreferenceString+= '<string><![CDATA[' + aPrefKey + ']]></string>';
	getPreferenceString+= '</arguments></invoke>';
	aPrefValue = dw.flash.controlEvent(_gMeerMeerDWService, getPreferenceString);
	return aPrefValue;		
}



//--------------------------------------------------------------------
// FUNCTION:
//   savePreference
//
// DESCRIPTION:
//   save the persisted key/value (sticky) value using the CSXS Persistence (Flex API)
//
// ARGUMENTS:
//   prefKey
//
// RETURNS:
//   prefValue
//--------------------------------------------------------------------
function savePreference(aPrefKey, aPrefValue)
{
	var bSavedPreference = false;
	var savePreferenceString = '<invoke name="setPreference" returntype="xml"><arguments>';
	savePreferenceString+= '<string><![CDATA[' + aPrefKey + ']]></string>';
	savePreferenceString+= '<string><![CDATA[' + aPrefValue + ']]></string>';
	savePreferenceString+= '</arguments></invoke>';		
	var hasSavePreferenced = dw.flash.controlEvent(_gMeerMeerDWService, savePreferenceString);
	bSavePreferenced = (hasSavePreferenced == "<true/>");
	return bSavePreferenced;
}
