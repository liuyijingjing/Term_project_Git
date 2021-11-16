// Copyright 2000, 2001, 2002, 2003, 2004, 2005 Macromedia, Inc. All rights reserved.


//form field names:
//Title - text field

// *********** GLOBAL VARS *****************************

var helpDoc = MM.HELP_inspTitle;
var TEXT_TITLE;

// ******************** API ****************************
function canInspectSelection(){
  var dom = dw.getDocumentDOM();
  var titleObj = dom.getSelectedNode();
  
  if (titleObj == null)
    return false;

  //accept if the selected node is text or if it is the title tag 
  return (titleObj.nodeType==Node.TEXT_NODE || (titleObj.nodeType=Node.ELEMENT_NODE && titleObj.tagName=="TITLE"));
}

function inspectSelection(){
  var dom = dw.getDocumentDOM();
  TEXT_TITLE = findObject("Title");
  if (dom != null) {
    TEXT_TITLE.value = dom.getTitle();
  }
  
  showHideTranslated();
}


// ******************** LOCAL FUNCTIONS ****************************

function setTitleTag(){
  var dom = dw.getDocumentDOM();
  if (dom != null && dom.getTitle() != TEXT_TITLE.value) {
      dom.setTitle(TEXT_TITLE.value);
  }	
}


