// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    // "layer" is a special keyword; the following line will
    // get all the absolutely-positioned elements in the page.
    var apEls = DOM.getElementsByTagName("layer");
    var parent = null, props = null, currAP = null;

    for (var i=0; i < apEls.length; i++){
      currAP = apEls[i];
      parent = apEls[i].parentNode;
      if (currAP.isListElement() && (parent.tagName == "LI" || parent.tagName == "DD")){
        // Exclude AP elements that are lists inside relatively-positioned LIs.
        // These are likely to be CSS menus, and those will not trigger the
        // bug far more often than they will.
        continue;
      }
      else{      
        if (parent) props = window.getDeclaredStyle(parent);
        // Check whether the AP element's parent is relatively positioned
        // and has no specified dimensions (these are the bug triggers).
        if (props.position == "relative" && (typeof(props.width) == "undefined" && typeof(props.height) == "undefined")){
           issueNodes.push(parent);
        }
      }
    }
  }  
  return issueNodes;
}

function getAffectedBrowserProfiles(){
  return new Array("Internet Explorer 5.0", 
                   "Internet Explorer 5.5",
                   "Internet Explorer 6.0");
}

function getIssueID(){
  return "UNSCROLLABLE_CONTENT";
}

function getIssueName(){
  return ISSUE_NAME;
}

function getIssueDescription(){
  return ISSUE_DESC;
}

function getConfidenceLevel(){  //DETCON 1
  return issueUtils.CONFIDENCE_LOW;
}
