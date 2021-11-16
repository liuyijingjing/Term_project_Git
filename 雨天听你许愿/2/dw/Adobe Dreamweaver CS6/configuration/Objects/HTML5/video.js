// Copyright 2000, 2001, 2002, 2003 Macromedia, Inc. All rights reserved

var helpDoc = MM.HELP_objEMailLink;

//---------------   GLOBAL VARIABLES   ---------------

var gDialogShown = false;
var gDefaultEmail =  "video tag";

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() { 
	// Return false, indicating that this object is available in code view.
	return false;
}

function objectTag() {
  var hgtFld;
  var widFld;
  var ctrFld;
  var srcFld;
  if (gDialogShown) {
    hgtFld = document.MainForm.hgtFld.value;
	widFld = document.MainForm.widFld.value;
    srcFld = document.MainForm.srcFld.value;
	ctrFld = document.MainForm.ctrFld;
	

  } 
if (ctrFld!=null && ctrFld.checked){
	   ctrFld=' controls="controls"';
		} 
		else{
			ctrFld="";
    	}
  if (!srcFld) srcFld = hgtFld;
  var rtnString = '<video src="' + srcFld + '" height="' + hgtFld + '" width="' + widFld + '"' + ctrFld  + '>Video Tag Contents</video>';

  var curDOM = dw.getDocumentDOM('document');
  if (dw.getFocus() != 'textView' && dw.getFocus(true) != 'html' && isCurSelectionTextOnly(curDOM)) {
    curDOM.insertHTML(rtnString, true); // Replaces current selection.
    rtnString = ''; // Set return value to empty, tag already inserted.
  }
  gDialogShown = false; // Reset show dialog global.
  return rtnString;
}

//---------------    LOCAL FUNCTIONS   ---------------

// Description: Determines if the current selection is contained within a text node.
// Parameters:  DOM - checked for valid, returns false if no DOM.
function isCurSelectionTextOnly(curDOM) {
  var rtnBool = false;
  if (curDOM != null) {
    var curNode = curDOM.getSelectedNode();
    if (curNode.nodeType == Node.TEXT_NODE) { // Return true if we are a text node.
      rtnBool = true;
    } else { // Return true if the selection contains a single text node.
      if (curNode.hasChildNodes() && curNode.childNodes[0].nodeType == Node.TEXT_NODE) {
        var curSel = curDOM.getSelection();
        var nodeOffset = dw.nodeToOffsets(curNode.childNodes[0]);
        if  ((nodeOffset[0] <= curSel[0]) && (curSel[1] <= nodeOffset[1])) {
          rtnBool = true;
  } } } }
  return rtnBool;
}

function initUI() {
  // Initialize the form dialog.
  document.MainForm.srcFld.focus(); //set focus on textbox
  document.MainForm.srcFld.select(); //set insertion point into textbox
  srcFld = document.MainForm.srcFld;
  gDialogShown = true;
}
