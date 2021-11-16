// Copyright 2001-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//---------------   GLOBAL VARIABLES   ---------------

var helpDoc = MM.HELP_objAnchor;
var gDialogShown = false;

//---------------    LOCAL FUNCTIONS   ---------------

function initUI() {
  var curDOM = dw.getDocumentDOM('document');
  if (curDOM && (curDOM.getSelectedNode().nodeType == Node.TEXT_NODE)) {
    var curSel = dw.getSelection();
    document.theform.anchorname.value = curDOM.documentElement.outerHTML.slice(curSel[0],curSel[1]);
  }
  document.theform.anchorname.focus();
  gDialogShown = true;
}

function errorCheck()
{
  var errMsg = "";
  
  var theString = document.forms[0].anchorname.value;
  var isValid = dw.getDocumentDOM().isValidIDValue(theString);

  if (isValid)
  {
    var uniqueId = dwscripts.getUniqueId(theString);
    if (uniqueId != theString)
    {
      errMsg = MM.MSG_DuplicateName;
  	  document.forms[0].anchorname.value = uniqueId;
  	}
  }
  else
  {
    errMsg = MM.MSG_InvalidName;
  }

  return errMsg;
}

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() { 
	// Return false, indicating that this object is available in code view.
	return false;
}

function insertObject() {
  if (gDialogShown)
  {
      var errMsg = errorCheck();
      var anchorName = document.forms[0].anchorname.value;
    
    if (errMsg)
      return errMsg;
     
    if (anchorName == "")
    {
      document.forms[0].anchorname.focus();
      return MM.TEMPLATE_UTILS_EmptyName;
    }

    var curDOM = dw.getDocumentDOM();
    var dtd = curDOM.getDtdProfile();
    var idStr = "";
    var nameStr = ' NAME="' + anchorName + '"';
    if (curDOM.getIsXHTMLDocument())
      idStr = ' id="' + anchorName + '"';
    else if (dtd && dtd.id == "mm_html_5")
    {
      idStr = ' id="' + anchorName + '"';
      nameStr = "";
    }
    var rtnStr = "";    
    if (dw.getFocus(true) == 'html' || dw.getFocus() == 'textView')
    {
      rtnStr = '<A' + nameStr + idStr + '></A>';
    }
    else
    {
      rtnStr = '<A' + nameStr + idStr + '>';
    }
    curDOM.insertHTML(rtnStr);

  }
  else
  { 
    // User turned off the "Show dialog when inserting objects" pref
    var rtnStr = "";
    var uniqueId = dwscripts.getUniqueId("anchor");
    if (dw.getFocus(true) == 'html' || dw.getFocus() == 'textView')
    {
      rtnStr = '<A NAME="' + uniqueId + '" id="' + uniqueId + '"></A>';
    }
    else
    {
      rtnStr = '<A NAME="' + uniqueId + '" id="' + uniqueId + '">';
    }
    curDOM.insertHTML(rtnStr);
  }
  return;
}



