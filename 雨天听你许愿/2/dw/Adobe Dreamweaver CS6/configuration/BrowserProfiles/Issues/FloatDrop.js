// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM && DOM.body){
    var floats = issueUtils.getFloats(DOM.body);
    var next = null, nextProps = null;
    var currFloat = null, parent = null, parentProps = null;
    
    for (var i=0; i < floats.length; i++){
      currFloat = floats[i];

      // Next is the node right after currFloat.
      next = currFloat.nextSibling;
      parent = currFloat.parentNode;

      // Skip over comment nodes.
      while (next && next.nodeType == 8)
        next = next.nextSibling;

      if (next && parent){
        nextProps = window.getDeclaredStyle(next);
        var specNextW = nextProps.width;

        // Bug only affects static, non-AP content after the float that has a 
        // specified width.
        // (Floated content after the float also wraps, but that's not a bug.)
        if (typeof(specNextW) != "undefined" && (nextProps.cssFloat != "left" && nextProps.cssFloat != "right") && nextProps.position != "absolute"){
          var totalFloatW = issueUtils.getTotalFloatWidth(currFloat,false,true);
          var floatDir = currFloat.getComputedStyleProp("float");
          var totalNextW = 0;
          // This represents the total width needed to display the float and
          // the content that follows it side by side.
          var neededWidth = 0;

          // If width is not specified using % as units,
          // just get the computed width.
          if (specNextW.indexOf('%') == -1){
            totalNextW = parseFloat(next.getComputedStyleProp('width'));

            // Now add margins, padding, and borders, and three-pixel
            // text jog in.
            totalNextW += parseFloat(next.getComputedStyleProp("padding-right"));
            totalNextW += parseFloat(next.getComputedStyleProp("padding-left"));
            totalNextW += parseFloat(next.getComputedStyleProp("border-right-width"));
            totalNextW += parseFloat(next.getComputedStyleProp("border-left-width"));
            // Only add left or right depending on which direction the float goes
            // (the float will "sit" in the margin on the side it's floated).
            if (floatDir == "left")
              totalNextW += parseFloat(next.getComputedStyleProp("margin-right"));
            else if (floatDir == "right")
              totalNextW += parseFloat(next.getComputedStyleProp("margin-left"));

            totalNextW += 3;
            
            neededWidth = totalNextW + totalFloatW;
          }
          // If width is specified using % as units, figure needed width
          // based on the totalFloatW.
          else {
            var floatPercentage = 100 - parseFloat(specNextW);
            // Add three pixels for text jog.
            neededWidth = (totalFloatW/(floatPercentage/100)) + 3;
          }
          
          // Now determine whether there's enough space to display the content.            
          parentProps = window.getDeclaredStyle(parent);
          var specParentW = parentProps.width;
          // If the parent container's width is undefined, walk up the tree
          // looking for further ancestors with a defined width.
          while (parent && typeof(specParentW) == "undefined"){
            parent = parent.parentNode;
            if (parent){
              parentProps = window.getDeclaredStyle(parent);
              specParentW = parentProps.width;
            }
          }
          // If we still have a parent, and that parent has a specified width,
          // and that width is not specified in %
          if (parent && (typeof(specParentW) != "undefined") && (specParentW.indexOf('%') == -1)){
            var compParentW = parent.getComputedStyleProp("width");
            // Houston, we have a problem.
            if (compParentW < neededWidth){
              ISSUE_DESC = ISSUE_DESC + dwscripts.sprintf(CONTAINER_TOO_SMALL,neededWidth);
              issueNodes.push(next);
            }
          }
          // We don't have a parent or the parent's width is specified in %
          // so we'll show the error if the needed width exceeds 800 pixels 
          // (a common browser width).
          else {
            if (neededWidth > 800){
              ISSUE_DESC = ISSUE_DESC + dwscripts.sprintf(OVER_800,neededWidth);
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
                   "Internet Explorer 6.0",
                   "Internet Explorer 7.0");

}

function getIssueID(){
  return "FLOAT_DROP";
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





