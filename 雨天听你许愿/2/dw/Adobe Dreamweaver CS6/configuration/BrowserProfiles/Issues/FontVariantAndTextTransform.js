// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();

  if (DOM){
    // Find all the text nodes in the document.
    var textNodes = new Array();
    dwscripts.traverseDOM(DOM.body,null,issueUtils.collectNodes,null,textNodes);
    var tt = "", fv = "", currNode = null;
    var parent = null, props = null;
    for (var i=0; i < textNodes.length; i++){
      currNode = textNodes[i];
      // See if the parent of the current text node has
      // a value for text-transform and font-variant.
      parent = currNode.parentNode;
      if (parent){
        props = window.getDeclaredStyle(parent,null,"",true);
        tt = props.textTransform;
        fv = props.fontVariant;
        if ((tt == "lowercase" || tt == "uppercase") && fv == "small-caps"){
          // Report the problem as being on the parent node, regardless of
          // where in the cascade text-transform and font-variant are
          // actually defined (since both properties are inheritable, they
          // might be defined for two different elements). The point is
          // that they converge here to affect the text inside this element,
          // so this is where we want to tell the user that there's going
          // to be a problem.
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
                   "Internet Explorer 6.0",
                   "Internet Explorer 7.0",
                   "Internet Explorer for Macintosh 5.2");
}

function getIssueID(){
  return "FONT_VARIANT_TEXT_TRANSFORM";
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
