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
//   canInsertObject
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
function canInsertObject() {
  var dom = dw.getDocumentDOM();
  var retVal = true;

  retVal = (dom.getIsLibraryDocument() == false);

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
//   insertObject
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
function insertObject() {
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
