// Copyright 2009 Adobe Macromedia Software LLC and its licensors. All rights reserved.

var HELP_DOC = MM.HELP_BrowserLabURL;

var _URLTextField = null;
var _cmdObj = null;

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
   return new Array( MM.BTN_OK,     "okClicked()",
                     MM.BTN_Cancel, "window.close()",
                     MM.BTN_Help,   "displayHelp()");

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
  var retVal = new Array();
  var urlLocation = _URLTextField.value;
  if (urlLocation && urlLocation.length)
  {
	  
  	//set the return value
	var urlPrefixExp = /^(?:https?|file)\:\/\/\/?/i;
	if (!urlLocation.match(urlPrefixExp))
	{
		//convert to uri and see if it exists before appending the prefix file:/// or http://
		var localFileURI = dwscripts.filePathToLocalURL(urlLocation);		
		if (dwscripts.fileExists(localFileURI))
		{
			//it is file path , use the converted URI		
			urlLocation = localFileURI;
		}
		else
		{
			//append the default http: prefix
			urlLocation = "http://" + urlLocation;			
		}		
	}
  	_cmdObj.URLLocation = urlLocation;
	dwscripts.setCommandReturnValue("true");
	window.close();
  }
  else
  {
	var blankURLMsg = dw.loadString("meermeerdw/commands/BL_URL/text/BlankURLMessage");
	alert(blankURLMsg);
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
//   browseForFileURL
//
// DESCRIPTION:
//   browse for the file url
//
// ARGUMENTS:
//	 none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function browseForFileURL()
{ 

	var fileName = dw.browseForFileURL("select", dw.loadString("meermeerdw/commands/BL_URL/browseDlgTitle"), false,false);
	if (fileName) 
	{
		_URLTextField.value = fileName;
	}
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
  _URLTextField = dwscripts.findDOMObject("URLLocation");  
  var cmdArgs = dwscripts.getCommandArguments();
  if (cmdArgs && cmdArgs.length)
  {
  	//get the data set source and xpath reference
  	_cmdObj = cmdArgs[0];
	_URLTextField.value = _cmdObj.URLLocation;
  }
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
