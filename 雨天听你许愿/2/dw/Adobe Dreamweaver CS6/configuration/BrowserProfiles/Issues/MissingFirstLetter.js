// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    var blocks = DOM.body.getBlockElements();
    var props = null, childProps = null;
    var currBlock = null, firstChild = null, firstGrandchild;
    for (var i=0; i < blocks.length; i++){
      currBlock = blocks[i];
      props = window.getDeclaredStyle(currBlock);
      // If the block element has no explicit width or height, border-top, 
      // or padding-top
      props = issueUtils.expShrt(props,"padding");
      if ((typeof(props.width) == "undefined" && typeof(props.height) == "undefined") && !issueUtils.hasBorder(currBlock,null,"top") && (typeof(props.paddingTop) == "undefined" || currBlock.getComputedStyleProp("padding-top") == 0) && currBlock.hasChildNodes()){
      // Check whether the first child is a block element
        firstChild = currBlock.childNodes[0];
        if (firstChild && firstChild.nodeType == Node.ELEMENT_NODE && firstChild.isBlockElement()){
          childProps = window.getDeclaredStyle(firstChild);
          // If block children have no width/height
          // but DO have letter-spacing AND position: relative,
          // check block children for text
          if ((typeof(childProps.width) == "undefined" && typeof(childProps.height) == "undefined") && typeof(childProps.letterSpacing) != "undefined" && childProps.position == "relative" && firstChild.hasChildNodes()){
            firstGrandchild = firstChild.childNodes[0];
            if (firstGrandchild.nodeType == Node.TEXT_NODE){
              // The bug will only occur if the text does NOT wrap, but it's
              // extremely difficult to determine whether the text will wrap without
              // knowing both the container width and the window width. (There's
              // a nightmare involving % margins and/or padding on the firstChild
              // and each of its ancestors.) We will assume that the text does not
              // wrap if the element is a header or a div/p with a relatively short
              // text-extent. 
              if (firstChild.tagName == "P" || firstChild.tagName == "DIV"){
                var fs = firstChild.getComputedStyleProp("font-size");
                var fw = firstChild.getComputedStyleProp("font-weight");
                var ff = firstChild.getComputedStyleProp("font-family");
                var ls = firstChild.getComputedStyleProp("letter-spacing");
                var fontStr = "";
                if (typeof(fs) != undefined)
                  fontStr += "font-size:" + fs + "px;";
                if (typeof(fw) != undefined)
                  fontStr += "font-weight:" + fw + ";";
                if (typeof(ff) != undefined)
                  fontStr += "font-family:" + ff + ";";
                if (typeof(ls) != undefined)
                  fontStr += "letter-spacing:" + ls + "px;";
                var textExtent = DOM.getTextExtent(firstGrandchild.data, fontStr);                      
                if (textExtent[0] < THRESHOLD)
                  issueNodes.push(firstChild); 
              }
              else if (firstChild.isHeaderElement()){
                issueNodes.push(firstChild);
              }
            }
          }
        }
      }
    }
  }
  return issueNodes;
}

function getAffectedBrowserProfiles(){
  return new Array("Internet Explorer 5.5");

}

function getIssueID(){
  return "MISSING_FIRST_LETTER";
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
