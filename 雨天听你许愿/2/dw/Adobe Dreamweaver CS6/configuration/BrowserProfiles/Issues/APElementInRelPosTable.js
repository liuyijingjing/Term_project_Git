// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    // get all the AP elements in the document.
    var apElems = DOM.getElementsByTagName('layer');
    var props = null, parentTable = null;
    for (var i=0; i < apElems.length; i++){
      // if the AP element is inside a table, find out if that
      // table has position: relative, absolute, or fixed. if
      // it does, the AP element will be incorrectly positioned
      // relative to the browser window rather than the table.
      parentTable = dwscripts.getEnclosingTagNode(apElems[i],"TABLE");
      if (parentTable){
        props = window.getDeclaredStyle(parentTable);
        if (typeof(props.position) != "undefined" && props.position != "static"){
          issueNodes.push(parentTable);
        }
      }
    }
  }    
  return issueNodes;
}

function getAffectedBrowserProfiles(){
  return new Array("Firefox 1.0",
                   "Firefox 1.5",
                   "Firefox 3.5",
                   "Firefox 3.6",
                   "Firefox 4.0 Beta",
                   "Firefox 2.0",
                   "Netscape 7.0",
                   "Netscape 8.0");
}

function getIssueID(){
  return "TABLES_NOT_CONTAINERS_FOR_APELEMS";
}

function getIssueName(){
  return ISSUE_NAME;
}

function getIssueDescription(){
  return ISSUE_DESC;
}

function getConfidenceLevel(){
  //DETCON 4
  return issueUtils.CONFIDENCE_HIGH;
}

