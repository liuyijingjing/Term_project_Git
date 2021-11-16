// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    var buttons = DOM.getElementsByTagName('button');
    var props = null, currButton = null;
    for (var i=0; i < buttons.length; i++){
      currButton = buttons[i];
      props = window.getDeclaredStyle(currButton);
      if (props.cssFloat == "left" || props.cssFloat == "right"){
        issueNodes.push(currButton);
      }
    }
  }
  return issueNodes;
}

function getAffectedBrowserProfiles(){
  return new Array("Opera 7.0",
                   "Opera 8.0");
}

function getIssueID(){
  return "DISAPPEARING_BUTTON_BACKGROUND";
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




