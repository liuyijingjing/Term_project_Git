// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();

  if (DOM && DOM.body){
    var containers = new Array();
    // find just the container nodes in the document.
    containers = issueUtils.getContainers(DOM.body,containers);
    var props = null, inheritedProps = null;
    var minWidth = -1, specifiedWidth = -1, specifiedHeight = -1;
    var paddingLeft = 0, paddingRight = 0;
    var currContainer = null;
    for (var i=0; i < containers.length; i++){
      currContainer = containers[i];
      // Make sure the container is a block-level element before looking 
      // for width (inline elements don't have width, so this will save
      // us some trouble, and possibly some pagniation errors). Also skip
      // over any TDs, since these expand to fit content in all browsers 
      // by design.
      if (currContainer.isBlockElement() && currContainer.tagName != "TD"){
        // start with the declared styles because we only want to deal
        // with containers for which a width has been specified. 
        props = window.getDeclaredStyle(currContainer);
        inheritedProps = window.getDeclaredStyle(currContainer,null,"",true);
        specifiedWidth = props.width;
        // The IE-only property word-wrap will prevent this bug if set
        // to break-word, as will any overflow value.
        if (typeof(specifiedWidth) != "undefined" && inheritedProps.wordWrap != "break-word" && typeof(props.overflow) == "undefined"){
          minWidth = DOM.getMinDisplayWidth(currContainer);
          // if the specified width is in pixels, we can make a
          // direct comparison with minWidth (after converting
          // the string to an integer).
          if (specifiedWidth.indexOf('px') != -1){
            specifiedWidth = parseInt(specifiedWidth);
          }
          // if units are anything other than px, use the computed width.
          else {
            specifiedWidth = parseInt(currContainer.getComputedStyleProp("width"));
          }
          if ((specifiedWidth >= 0) && (minWidth > specifiedWidth)){
            issueNodes.push(currContainer);
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
  return "EXPANDING_BOX_PROBLEM";
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
