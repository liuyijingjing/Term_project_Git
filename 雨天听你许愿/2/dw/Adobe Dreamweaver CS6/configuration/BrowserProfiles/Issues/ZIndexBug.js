// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();

  if (DOM){
    // get all the elements in the document.
    var elems = new Array();
    dwscripts.traverseDOM(DOM.body,issueUtils.collectNodes,null,null,elems);
    var currElem = null;
    var parentProps = null, zIndex = null, parent = null;
    for (var i=0; i < elems.length; i++){
      currElem = elems[i];
      // check to see if the element has a z-index.
      zIndex = currElem.getComputedStyleProp("z-index");
      if (typeof(zIndex) != "undefined" && zIndex != "auto"){
        parent = currElem.parentNode;
        parentProps = window.getDeclaredStyle(parent);
        // if the element has a z-index, check to see if its parent
        // is positioned but has a computed z-index of "auto". 
        if (typeof(parentProps.position) != "undefined" && parentProps.position != "static"){
          // EXCEPTION TO THE BUG: Many menu systems position submenus by 
          // relatively-positioning the parent li and then absolutely
          // positioning the child list. If that child list has a z-index,
          // the bug conditions may occur, but the bug will not. For this
          // reason, do not report absolutely-positioned ULs inside
          // relatively-positioned LIs. Hopefully this will cut down on
          //  false-positives without creating lots of false-negatives.
          if ((currElem.getComputedStyleProp("position") == "absolute" && currElem.tagName == "UL") && (parentProps.position == "relative" && parent.tagName == "LI")){
            continue;
          }
          else if (parent.getComputedStyleProp("z-index") == "auto"){
            // ok, this is going to define a new stacking context in IE,
            // which is (a) wrong and (b) probably not what the user wants.
            issueNodes.push(currElem);
          }
        }
      }
    }
  }    
  return issueNodes;
}

function getAffectedBrowserProfiles(){
  return new Array("Internet Explorer 5.0", 
                   "Internet Explorer 5.5",
                   "Internet Explorer 6.0",
                   "Internet Explorer 7.0");
}

function getIssueID(){
  return "ZINDEX_BUG";
}

function getIssueName(){
  return ISSUE_NAME;
}

function getIssueDescription(){
  return ISSUE_DESC;
}

function getConfidenceLevel(){
  //DETCON 3
  return issueUtils.CONFIDENCE_MEDHIGH;
}




