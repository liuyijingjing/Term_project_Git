// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    var blocks = DOM.body.getBlockElements();
    var next = null;
    var props = null;
    
    for (var i=0; i < blocks.length; i++){
      currBlock = blocks[i];
      // next is the node right after the current block
      next = currBlock.nextSibling;
      // if next isn't null AND next is an element node AND next is a block element,
      // we've met the "second of two consecutive block elements" test.
      // HOWEVER, if currBlock is a block-level link and its sibling is a UL,
      // we likely have a menu navigation system... and this bug doesn't seem to
      // affect menus.
      if ((next && (next.nodeType == 1) && next.isBlockElement()) && (currBlock.tagName != "A" && next.tagName != "UL")){
//        props = window.getDeclaredStyle(next);
//        props = issueUtils.expShrt(props, "margin");
        // If next has a negative top margin and either next or one of its ancestors has
        // a border, next is probably going to cause Border Chaos.
        // We're only checking for a margin-top that's at least -1px, since smaller
        // negative values do not cause the bug.
        if ((parseFloat(next.getComputedStyleProp("margin-top")) <= -1) && (issueUtils.hasBorder(next) || issueUtils.ancestorHasBorder(next))){
          issueNodes.push(next);
        }
      }
    }
  }  
  return issueNodes;
}


function getAffectedBrowserProfiles(){
  return new Array("Internet Explorer 6.0");

}

function getIssueID(){
  return "BORDER_CHAOS";
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

