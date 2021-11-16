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

var _message;
var args;


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
  var arr;

  if (navigator.platform == "Win32") {
    arr = new Array(
              "PutButtonsOnBottom",
              "OkButton defaultButton", dw.loadString("ice/errorWnd/button/ok"), "clickedButton('ok')",
              dw.loadString("ice/errorWnd/button/help"), "clickedButton('help')"
          );
  } else {
    arr = new Array(
              "PutButtonsOnBottom",
              dw.loadString("ice/errorWnd/button/help"), "clickedButton('help')",
              "OkButton defaultButton", dw.loadString("ice/errorWnd/button/ok"), "clickedButton('ok')"
          );
  }

  return arr;
}


//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   This function is called when the UI is initialized. It will throw an
//   error if the message and/or help page are not provided via command
//   arguments.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function initializeUI() {
  args = dwscripts.getCommandArguments();

  // Developer note. This message should not be displayed at all.
  if (!args || !args.message || !args.helpID) {
    throw "Missing message and/or help ID.";
  }

  _message = dwscripts.findDOMObject("message");
  _message.innerHTML = args.message;
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedOK
//
// DESCRIPTION:
//   This function is called when user clicks the OK button
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function clickedOK() {
  window.close();
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedHelp
//
// DESCRIPTION:
//   This function is called when user clicks the Help button
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function clickedHelp() {
  ICEUtils.displayHelp(args.helpID);
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedButton
//
// DESCRIPTION:
//   This function is called when a button in the UI is pressed.
//
// ARGUMENTS:
//   buttonName (string) - the name of the button user has clicked
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function clickedButton(buttonName) {
  switch (buttonName) {
    case "ok":
      clickedOK();
      break;
    case "help":
      clickedHelp();
      break;
  }
}

