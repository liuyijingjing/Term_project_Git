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

var helpID = MM.ICE_HELP_CreateRepeatingRegionAdjacent;
var _option1;
var _option2;


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
  var dom = document;
  _option1 = dom.getElementById("option1");
  _option2 = dom.getElementById("option2");

  _option1.setAttribute("checked", "checked");
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedOK
//
// DESCRIPTION:
//   This function is called in the onLoad event. It is responsible
//   for initializing the UI.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function clickedOK() {
  var val = 0;

  if (_option2 && _option2.getAttribute("checked")) {
    val = 1;
  }

  dwscripts.setCommandReturnValue(val);

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

