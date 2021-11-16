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


//--------------------------------------------------------------------
// FUNCTION:
//   canAcceptCommand
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
function canAcceptCommand() {
  var dom = dw.getDocumentDOM();
  var retVal = true;

  retVal = ( dw.getActiveWindow(true) != null &&
             dw.getActiveWindow(true).allowsEdits() &&
             dw.getFocus() != 'browser' &&
             dom != null &&
             !dom.getIsLibraryDocument() &&
             dom.getParseMode() == 'html' );

  return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   isDOMRequired
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
function isDOMRequired() {
  return true;
}


//--------------------------------------------------------------------
// FUNCTION:
//   receiveArguments
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
function receiveArguments() {
  var dom = dreamweaver.getDocumentDOM();
  var errStr;

  if (!errStr) {
    errStr = ICEUtils.canInsertRegion(dom);
  }

  if (errStr) {
    alert(errStr);
  } else {
    if (ICEUtils.isSavedDocument(dom)) {
      ICECreateEditableRegion.apply();
    }
  }
}
