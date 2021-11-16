// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();

  if (DOM){
    var floats = issueUtils.getFloats(DOM.body);
    var next = null;
    var props = null;
    var currFloat = null;
    for (var i=0; i < floats.length; i++){
      currFloat = floats[i];
      // bug doesn't occur if float is an img
      if (currFloat.tagName != "IMG"){
        // next is the node right after floats[i]
        next = currFloat.nextSibling;
        // skip over comment nodes
        while (next && next.nodeType == 8)
          next = next.nextSibling;
        if (next){
          // if next is a text node or an inline element, there's a chance that the text jog 
          // could occur. at a minimum, the three-pixel gap will occur...
          var isElem = (next.nodeType == 1);
          var parent = next.parentNode;
          if (next.nodeType == 3 || (isElem && next.isInlineElement() && next.tagName != "BR")){
            // try to determine whether the float's container is wide enough for the float
            // and the inline element that follows it to appear side by side. if we can't find
            // the container or the inline element's width is "auto", just assume that they're 
            // adjacent.
            if (parent && isElem){
              var parentW = parseFloat(parent.getComputedStyleProp("width"));
              var floatW = issueUtils.getTotalFloatWidth(currFloat);
              var inlineW = next.getComputedStyleProp("width");
              if (inlineW != "auto" && (parseFloat(inlineW) + floatW <= parentW))
                issueNodes.push(next);
              else if (inlineW == "auto")
                issueNodes.push(next);
            }
            else {
              issueNodes.push(next);
            }
          }

          // block-level elements with inline or text children are also affected,
          // unless the block-level element is also a float, or if the element has
          // layout.
          else if (isElem && next.isBlockElement()){
            props = window.getDeclaredStyle(next);
            if ((typeof(props.cssFloat) == "undefined"  || props.cssFloat == "none") &&
                typeof(props.clear) == "undefined" && 
                typeof(props.width) == "undefined" && typeof(props.height) == "undefined" &&
                typeof(props.zoom) == "undefined" && 
                (issueUtils.hasInlineChildren(next))){
                  issueNodes.push(next);
            }
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
                   "Internet Explorer 6.0");

}

function getIssueID(){
  return "THREE_PIXEL_JOG";
}

function getIssueName(){
  return ISSUE_NAME;
}

function getIssueDescription(){
  return ISSUE_DESC;
}

function getConfidenceLevel(){  //DETCON 3
  return issueUtils.CONFIDENCE_MEDHIGH;
}


