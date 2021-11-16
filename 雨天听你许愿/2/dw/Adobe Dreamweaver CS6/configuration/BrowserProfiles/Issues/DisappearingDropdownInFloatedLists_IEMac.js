// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    // get all the UL, OL, and DL elements in the document.
    var lists = DOM.getListElements();
    var props = null, currList = null, selects = new Array();
    for (var i=0; i < lists.length; i++){
      currList = lists[i];
      props = window.getDeclaredStyle(currList);
      if ((props.cssFloat == "left" || props.cssFloat == "right") && props.overflow == "auto"){
        dwscripts.traverseDOM(currList,findSelectList,null,null,selects);
        for (var s=0; s < selects.length; s++){
          var currSel = selects[s];
          if (!dwscripts.isInsideTag(currSel,"FORM")){
            issueNodes.push(currList);
            break;
          }      
        }
	      // empty out the array for next pass
	      selects.length = 0;
      }
    }
  }  
  return issueNodes;
}

// findSelectList() is a callback function for 
// dwscripts.traverseDOM(). It's called whenever
// an element node is found and checks whether
// that node is a select list. Check the length 
// of the passed-in array in the calling function 
// to determine whether any select lists were found.
function findSelectList(node,selArray){
  var keepLooking = true;
  if (node.tagName == "SELECT"){
    selArray.push(node);
    keepLooking = false;
  }
  return keepLooking;
}  

function getAffectedBrowserProfiles(){
  return new Array("Internet Explorer for Macintosh 5.2");
}

function getIssueID(){
  return "SELECTS_IN_FLOATED_LISTS_IEMAC";
}

function getIssueName(){
  return  ISSUE_NAME;
}

function getIssueDescription(){
  return ISSUE_DESC;
}

function getConfidenceLevel(){
  //DETCON 4
  return issueUtils.CONFIDENCE_HIGH;
}
