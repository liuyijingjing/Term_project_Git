// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

var HELP_DOC = MM.HELP_cmdSpryDesignTimeFeed;

var _dataSetName = null;
var _designTimeFeed = null;
var _dynamicFeed = null;
var _designTimeDataSet = null;
var _xmlOnlyInfoContainer = null;

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
  var designTimeSchemaURI = _designTimeFeed.value;
  if (designTimeSchemaURI && designTimeSchemaURI.length)
  {
  	_designTimeDataSet.setDesignTimeSchemaURI(designTimeSchemaURI);
  	//set the return value
    dwscripts.setCommandReturnValue("true");
  }
  else
  {
  	//remove the design time schema uri
  	_designTimeDataSet.removeDesignTimeSchemaURI();
  	//set the return value
    dwscripts.setCommandReturnValue("true");
  }
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
  dwscripts.setCommandReturnValue("");
  window.close();
}


//--------------------------------------------------------------------
// FUNCTION:
//   browseForXMLFile
//
// DESCRIPTION:
//   browse for the xml file
//
// ARGUMENTS:
//	 none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function browseForDesignTimeFile()
{
  var theFileFilter;
  
  if (_designTimeDataSet.getType() == Spry.DesignTime.DataSet.XMLDataSetType)
  {
    theFileFilter = ["XML (*.xml)|*.xml|XML|"]; 
  }
  else
  {
    theFileFilter = [dw.loadString("spry/dataset/designtimefeed/filterTitle") + " (*.htm;*.html)|*.htm;*.html|HTML|"]; 
  }
  

	var fileName = dw.browseForFileURL("select", dw.loadString("spry/dataset/designtimefeed/browseDlgTitle"), false,false,theFileFilter);
	if (fileName) 
	{
		_designTimeFeed.value = fileName;
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
  _designTimeFeed = dwscripts.findDOMObject("designTimeFeed"); 
  _dynamicFeed = dwscripts.findDOMObject("dynamicFeed");
  _xmlOnlyInfoContainer = document.getElementById("xmlOnlyInfoContainer");
  
  var cmdArgs = dwscripts.getCommandArguments();
  if (cmdArgs && cmdArgs.length)
  {
  	//get the data set source and xpath reference
  	_dataSetName = cmdArgs[0];
    _designTimeDataSet = cmdArgs[2];
    if (_designTimeDataSet.getType() == Spry.DesignTime.DataSet.HTMLDataSetType)
    {
      _xmlOnlyInfoContainer.style.display = "none";
    }
    else
    {
      _xmlOnlyInfoContainer.style.display = "block";
    }
  	var dynamicFeedSrc = "(" + cmdArgs[1] + ")";
  	_dynamicFeed.innerHTML = dynamicFeedSrc;		
  	//set the design Time Src using the design notes API
  	var designTimeSrc = _designTimeDataSet.getDesignTimeSchemaURI();
  	_designTimeFeed.value = designTimeSrc;
  }
  window.resizeToContents();
}

//--------------------------------------------------------------------
// FUNCTION:
//   setAppServer
//
// DESCRIPTION:
//	  launches the app server section of site definition dialog
//
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function setAppServer()
{
	site.showTestingServerSettings();
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
