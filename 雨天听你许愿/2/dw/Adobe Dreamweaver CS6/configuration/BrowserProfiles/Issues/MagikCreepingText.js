// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

// there are some weird interactions with this bug, and we're not going to be
// able to capture them all (for example, if a block inside the problem block
// also has border-left and padding-bottom set and also contains a block element,
// we will erroneously report the first instance of the nexted block set as being
// problematic when it's not. hopefully what we're doing here will
// be sufficient to alert the user that things may be screwy, even if we're not
// always precise.
function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    // get all block elements in the document.
    var blocks = DOM.getBlockElements();
    var count = 0;
    var dProps = null, parent = null, children = null;
    var tNode = new Array(), currBlock = null;
    for (var i=0; i < blocks.length; i++){
      currBlock = blocks[i];
      // get the declared styles so we can see whether width
      // or height have been specified explicitly
      dProps = window.getDeclaredStyle(currBlock);
      // if the block has children, border-left, and padding-bottom
      // but no width, height, or bottom border
      if (currBlock.hasChildNodes() && (parseFloat(currBlock.getComputedStyleProp("border-left-width")) > 0) && (parseFloat(currBlock.getComputedStyleProp("padding-bottom")) > 0) && typeof(dProps.width) == "undefined" && typeof(dProps.height) == "undefined" && (parseFloat(currBlock.getComputedStyleProp("border-bottom-width")) == 0)){
        children = currBlock.getBlockElements();
        var hasLayout = false;
        // loop through the block-level children to see if
        // any have width, height, or zoom defined. width or height on any 
        // of the children of the outer block will prevent the bug.
        for (var j=0; j < children.length; j++){
          dProps = window.getDeclaredStyle(children[j]);
          if (typeof(dProps.width) != "undefined" || typeof(dProps.height) != "undefined" || typeof(dProps.zoom) != "undefined"){
            hasLayout = true;
            break;
          }
        }
        // if we found one or more block elements and
        // none had width or height, then check whether
        // any block child contains text. sadly, this
        // means looping through the block children again.
        if (!hasLayout){
          for (var k=0; k < children.length; k++){
            // if that block child contains a text node, then we've found
            // the bug pattern. increment the counter, empty out the foundArray,
            // and break out of the inner loop (we only care about the first 
            // block child with text because it's the outer block that's the 
            // problem, and we only want to report the problem node once).
            dwscripts.traverseDOM(children[k],null,issueUtils.foundNode,null,tNode);
            if (tNode.length > 0){
              count++;
              tNode.length = 0;
              break;
            }
          }
        }
        // if this is the second or subsequent block element that has border-left,
        // padding-bottom, and a block child that contains text, then the bug will
        // occur.
        if (count > 1){
          issueNodes.push(currBlock);
        }
      }      
    }
  }
  return issueNodes;
}

function getAffectedBrowserProfiles(){
  return new Array("Internet Explorer 5.5",
                   "Internet Explorer 6.0");
}

function getIssueID(){
  return "MAGIK_CREEPING_TEXT";
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
