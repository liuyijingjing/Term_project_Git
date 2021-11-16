// Copyright 2009 Adobe Macromedia Software LLC and its licensors. All rights reserved.

var PLATFORM = navigator.platform;
var ICON_URL = (PLATFORM == "Win32") ? "../Shared/MM/Images/alertIconWin.gif" : "../Shared/MM/Images/yield28x28.gif";
var HELP_DOC = MM.HELP_BrowserLabAsk;

var _DependentFileTextField = null;
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
   return new Array( dw.loadString("meermeerdw/commands/BL_Ask/text/Allow"),     "allowClicked()",
                     dw.loadString("meermeerdw/commands/BL_Ask/text/Deny"),	     "denyClicked()",
                     MM.BTN_Cancel,	   "cancelClicked()");

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
function allowClicked()
{ 
  //if checked save the allow permission.
  var bRememberAlways = document.theForm.cbRemember.checked;
  if (bRememberAlways)
  {	
	dwscripts.setCommandReturnValue("allowAlways");
  }
  else
  {
	  dwscripts.setCommandReturnValue("allow");
  }
  saveDomainPermissions("Allow", bRememberAlways);

  window.close();
}


//--------------------------------------------------------------------
// FUNCTION:
//   denyClicked
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

function denyClicked()
{ 
  //if checked save the allow permission.
  var bRememberAlways = document.theForm.cbRemember.checked;
  if (bRememberAlways)
  {	
	dwscripts.setCommandReturnValue("denyAlways");
  }
  else
  {
	dwscripts.setCommandReturnValue("deny");
  }
  saveDomainPermissions("Deny", bRememberAlways);
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
  dwscripts.setCommandReturnValue("cancel");
  window.close();
}

//--------------------------------------------------------------------
// FUNCTION:
//   saveDomainPermissions
//
// DESCRIPTION:
//   remember the permission to allow or deny for domain list
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function saveDomainPermissions(permissionStr, bRememberAlways)
{
	if (_cmdObj && _cmdObj.length)
	{
		var aPermissionStore = null;

		if (MM._permissionStore)
		{
			//use the in-memory copy
			aPermissionStore = MM._permissionStore;
		}
		else
		{
			//load the copy from disk
			var aPermissionStore = new BL_PermissionStore(); 
			aPermissionStore.loadPermissionStore();				
		}

		if (aPermissionStore)
		{
			for (var i=0; i < _cmdObj.length; i++)
			{
				var aDomain = _cmdObj[i];
				aPermissionStore.addPermissionEntry(aDomain, permissionStr , bRememberAlways);
			}

			if (bRememberAlways)
			{
				//persist the newly updated entries.
				aPermissionStore.storePermissionStore(true, null);
			}
		}
	}
}


//--------------------------------------------------------------------
// FUNCTION:
//   setDomainList
//
// DESCRIPTION:
//	  This function set the domain list before displaying the dialog.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function setDomainList(domainList)
{
  // use the domain list
  if (domainList && domainList.length)
  {
	var postMessageStr = dw.loadString("meermeerdw/commands/BL_Ask/text/AlllowDomainAccess");		
	//for a list of domains
	var domainTable = "<table border='0'>";
	var domainListLength = domainList.length;
	for (var i =0 ; i < domainListLength; i++)
	{
		domainTable += "<tr><td>";
		domainTable += domainList[i];
		domainTable += "</td></tr>";
	}
	domainTable += "</table>";	

	postMessageStr = dwscripts.sprintf(postMessageStr, domainTable);
	document.domainList.innerHTML = postMessageStr;

	//store in command object too
	_cmdObj = domainList;
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
	// Use the right icon for the platform.
	document.confirmIcon.src = ICON_URL;		
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
