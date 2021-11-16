// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();

  if (DOM){
    // get all the elements in the document.
    var elems = new Array();
    dwscripts.traverseDOM(DOM.body,issueUtils.collectNodes,null,null,elems);
    var props = "", currElem = null;
    for (var i=0; i < elems.length; i++){
      currElem = elems[i];
      props = window.getDeclaredStyle(currElem,":first-line");
      if (props.textTransform == "uppercase"){
        issueNodes.push(currElem);    
      }
    }
  }  
  return issueNodes;
}


function getAffectedBrowserDisplayNames(){
    return new Array("Safari 2.0",
                    "Safari 3.0",
                    "Safari 4.0",
                    "Safari 5.0",
                    "Chrome 7.0",
                    "Chrome 8.0",
                    "Chrome 9.0 Beta");

}

function getAffectedBrowserProfiles(){
    return new Array("Safari 2.0",
                     "Safari 3.0",
                     "Safari 4.0",
                    "Safari 5.0",
                    "Chrome 7.0",
                    "Chrome 8.0",
                    "Chrome 9.0 Beta");

}

function getIssueID(){
  return "FIRST_LINE_TEXT_TRANSFORM";
}

function getIssueName(){
  return ISSUE_NAME;
}

function getIssueDescription(){
  return ISSUE_DESC;
}

function getConfidenceLevel(){  //DETCON 3
  return issueUtils.CONFIDENCE_HIGH;
}

