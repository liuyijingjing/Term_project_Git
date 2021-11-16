// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    var floats = issueUtils.getFloats(DOM.body);
    var props = null, next = null, nextProps = null, prev = null, prevProps = null;
    var currFloat = null;
    // first float in the document isn't affected, so start
    // at 1.
    for (var i=1; i < floats.length; i++){
      currFloat = floats[i];
      prev = currFloat.previousSibling;
      if (prev && prev.nodeType == Node.ELEMENT_NODE && prev.isHeaderElement()){
        next = currFloat.nextSibling;
        // this bug is intermittent, so it's hard to test all the
        // different cases where it might and might not occur.
        // just check whether the first child of next is a text node,
        // which is the case in the Quirksmode bug report.
        if (next && next.hasChildNodes() && (next.childNodes[0].nodeType == Node.TEXT_NODE)){
          issueNodes.push(currFloat);
        }
      }
    }
  }
  return issueNodes;
}

function getAffectedBrowserDisplayNames(){
  return new Array("Firefox 1.0");
}

function getAffectedBrowserProfiles(){
  return new Array("Firefox 1.0");
}

function getIssueID(){
  return "FLOATS_AND_HEADERS";
}

function getIssueName(){
  return ISSUE_NAME;
}

function getIssueDescription(){
  return ISSUE_DESC;
}

function getConfidenceLevel(){
  //DETCON 2
  return issueUtils.CONFIDENCE_MEDLOW;
}
