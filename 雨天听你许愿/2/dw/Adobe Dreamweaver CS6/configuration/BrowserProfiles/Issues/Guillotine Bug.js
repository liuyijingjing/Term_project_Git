// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array(), links = new Array();
  
  if (DOM){
    var floats = issueUtils.getFloats(DOM.body);
    var container = null, children = null, floatProps = null;
    var currFloat = null, currChild = null, currLink = null;
    // If no floats were found, nothing else will happen.
    for (var i=0; i < floats.length; i++){
      
      currFloat = floats[i];
      var fNext = currFloat.nextSibling;
      while (fNext && fNext.nodeType == 8)
        fNext = fNext.nextSibling;

      // Save some time up front and don't bother checking when: 
      // [a] the chances that the float will be taller than any  
      //     adjacent non-floated content is very, very slim
      // [b] there isn't likely to be any adjacent non-floated content
      // [c] the content adjacent to the float is also a float
      if ((currFloat.tagName != "A" && currFloat.tagName != "LI" && currFloat.tagName != "INPUT"
           && currFloat.tagName != "DD" && currFloat.tagName != "DT")
           && ((i+1 > floats.length) || fNext != floats[i+1])){
           
        // Get the float's parent (container) and the container's 
        // children so we can determine whether the float has been cleared 
        // and, if not, whether any links follow it.
        container = currFloat.parentNode;

        // If we find a clearing element after the float, the bug will not occur.
        // Set flag for that now.      
        var foundClear = false;
        
        // Another up-front time-saver: Don't bother with illogical containers.
        // (The lists should have been caught up above, but better safe than sorry.)
        // Table cells naturally expand, no clearing necessary, so a guaranteed 
        // Guillotine setup placed inside a TD rather than a DIV 
        // will not invoke the bug.
        if (container && (container.tagName != "UL" && container.tagName != "OL" &&
            container.tagName != "TD")){
          children = container.childNodes;
          var foundFloat = -1, links = new Array(), props = null;
          for (var k=0; k < children.length; k++){
            currChild = children[k];
            // we only care about links and clears after the
            // float, so we need to find the float among its
            // parent's children.
            if (foundFloat < 0 && (currChild == currFloat)){
              foundFloat = k;
            }
            // this code will only execute in loops *after* the
            // float has been found, not in the same loop the
            // float was found.
            else if (foundFloat != -1){
              // check to see if any of the children after the float
              // clear the node (move on to the next float if so) or
              // contain links
              if (currChild.nodeType == Node.ELEMENT_NODE){
    		        props = window.getDeclaredStyle(currChild);
                if ((typeof(props.clear) != "undefined")){
                  foundClear = true;
                  break;
                }
                else {
                  links = issueUtils.findLinksInContainer(currChild,0,links);
                }              
              }
            }
          } // end container children loop

          if (!foundClear) {
            // Before moving on to the next float, if there were any links,
            // see if they might be guillotine-invoking. (We can't say with
            // absolute certainty that this bug will be invoked, because usually
            // only links on the third line of text or lower will invoke the 
            // bug, and in regular text, we can't be sure on which line the links
            // will appear.)
            var hoverProps = null, str = "", linkParent = null;

            // If no links, none of the below will happen.
            for (var h=0; h < links.length; h++){
              currLink = links[h];
              // Don't bother with the rest if the link itself or its parent is floated,
              // if the link is inside a table cell, or if one of the link's ancestors has
              // a width or height.
              if (currLink.getComputedStyleProp("float") == "none" && !dwscripts.isInsideTag(currLink,"TD") && !ancestorHasLayout(currLink,container)){
                linkParent = currLink.parentNode;
                if (linkParent && linkParent.getComputedStyleProp("float") == "none"){
                  hoverProps = window.getDeclaredStyle(currLink,null,":hover");
                  if (issueUtils.setsBorder(currLink,null,":hover") || 
                     ((typeof(hoverProps.padding) != "undefined") || (typeof(hoverProps.paddingTop) != "undefined") || (typeof(hoverProps.paddingBottom) != "undefined") || (typeof(hoverProps.paddingLeft) != "undefined") || (typeof(hoverProps.paddingRight) != "undefined")) ||
                     ((typeof(hoverProps.background) != "undefined") || (typeof(hoverProps.backgroundColor) != "undefined") || (typeof(hoverProps.backgroundImage) != "undefined") || (typeof(hoverProps.backgroundRepeat) != "undefined") || (typeof(hoverProps.backgroundAttachment) != "undefined") || (typeof(hoverProps.backgroundPosition) != "undefined")) ||
                     (typeof(hoverProps.textStyle) != "undefined")){
                    containerProps = window.getDeclaredStyle(container);
                    if (typeof(containerProps.width) == "undefined"){
                      // TO DO: check for clears elsewhere in the doc
                    }
                    else{
                     // Make check slightly more accurate by
                     // testing for whether the links' parents are non-inline <li> tags
                     // and only reporting a positive when the third link in a given
                     // list is found.)
                      if ((h == 0 || h == 1) && linkParent && linkParent.tagName == "LI" && (linkParent.getComputedStyleProp("display") != "inline")){
                        continue;
                      }
                      // Assume that inline LIs are all going to appear on the same line,
                      // which would prevent the bug from happening.
                      else if (linkParent && linkParent.tagName == "LI" && 
                               (linkParent.getComputedStyleProp("display") == "inline")){
                        continue;
                      }
                      else {
                        issueNodes.push(currLink);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      // Reset the links array
      links.length = 0;
    }
  }
  return issueNodes;
}

function ancestorHasLayout(currNode,stopNode){
  var nProps = null;
  var hasLayout = false;
  while (currNode && currNode != stopNode){
    nProps = window.getDeclaredStyle(currNode);
    if (typeof(nProps.width) != "undefined" || typeof(nProps.height) != "undefined" || typeof(nProps.zoom) != "undefined"){
      hasLayout = true;
      break;
    }
    currNode = currNode.parentNode;
  }
  return hasLayout;
}


function getAffectedBrowserProfiles(){
  return new Array("Internet Explorer 5.0", 
                   "Internet Explorer 5.5",
                   "Internet Explorer 6.0");
}

function getIssueID(){
  return "GUILLOTINE_BUG";
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
