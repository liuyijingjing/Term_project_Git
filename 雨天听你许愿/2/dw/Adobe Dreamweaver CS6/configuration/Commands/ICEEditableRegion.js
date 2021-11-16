/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2008 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
*
* AdobePatentID="B564"
* AdobePatentID="B565"
*
**************************************************************************/

var helpID = MM.ICE_HELP_CreateEditableRegion;
var _MM_CONTENT;
var cmdArgs;


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
function commandButtons() {
  return new Array(MM.BTN_OK, "clickedOK()",
            MM.BTN_Cancel, "window.close()",
            MM.BTN_Help, "displayHelp()" );
}


//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   This function is called in the onLoad event.  It is responsible
//   for initializing the UI.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function initializeUI() {
  cmdArgs = dwscripts.getCommandArguments();

  if (cmdArgs && cmdArgs.options) {
    // It seems that we need some confirmations from the user. Let's build the command UI
    document.getElementById("title").removeAttribute("class");
    _MM_CONTENT = document.getElementsByTagName("MM_CONTENT")[0];
    cmdArgs.options.updateUIOptionsContainer(document, window, _MM_CONTENT);
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedOK
//
// DESCRIPTION:
//   This function is called in the onLoad event.  It is responsible
//   for initializing the UI.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function clickedOK() {
  var theOption = cmdArgs.options.getCheckedOption();

  if (theOption) {
    theOption.apply();
  }

  window.close();
}


//--------------------------------------------------------------------
// FUNCTION:
//   displayHelp
//
// DESCRIPTION:
//   Displays the built-in ICE help.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function displayHelp() {
  ICEUtils.displayHelp(helpID);
}

