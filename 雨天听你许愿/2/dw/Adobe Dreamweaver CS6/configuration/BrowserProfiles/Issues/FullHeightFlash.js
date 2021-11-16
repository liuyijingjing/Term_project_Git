// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  if (DOM){
    // Find all the object tags in the document.
    var objTags = DOM.getElementsByTagName("OBJECT");
    var parent = null, currObj = null, parentProps = null;
    var codebase = null;
    for (var i=0; i < objTags.length; i++)
    {
      currObj = objTags[i];
      // If the object tag represents a Flash movie for which
      // the height has been set to 100%...
      codebase = currObj.getAttribute("codebase");
      if ((codebase && codebase.indexOf('swflash') != -1)  && currObj.getAttribute("height") == "100%")
      {      
        parent = currObj.parentNode;
        // Skip over the noscript tag when determining the
        // parent of the object tag.
        if (parent && (parent.tagName == 'NOSCRIPT'))
          parent = parent.parentNode;
        if (parent)
        {
          // If the parent node does not have its height
          // set to 100% also, the movie will not expand to
          // fill the browser window.
          parentProps = window.getDeclaredStyle(parent);
          if (parentProps.height != "100%")
          {
            issueNodes.push(parent);
          }
        }
      }
    }
  }  
  return issueNodes;
}


function getAffectedBrowserProfiles(){
  return new Array("Firefox 1.0",
                   "Firefox 1.5",
                   "Firefox 2.0",
                   "Netscape 7.0",
                   "Netscape 8.0");

}

function getIssueID(){
  return "FULL_HEIGHT_FLASH";
}

function getIssueName(){
  return ISSUE_NAME;
}

function getIssueDescription(){
  return ISSUE_DESC;
}

function getConfidenceLevel(){  //DETCON 4
  return issueUtils.CONFIDENCE_HIGH;
}

