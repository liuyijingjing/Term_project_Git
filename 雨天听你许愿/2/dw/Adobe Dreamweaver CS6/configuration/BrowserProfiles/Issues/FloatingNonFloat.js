// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    var floats = issueUtils.getFloats(DOM.body,"left");
    var props = null, next = null, nextProps = null, currFloat = null;
    for (var i=0; i < floats.length; i++){
      currFloat = floats[i];
      next = currFloat.nextSibling;
      // skip over comment and text nodes. note: if raw text
      // is short enough, this bug could still appear.
      while (next && (next.nodeType == 8 || next.nodeType == 3))
        next = next.nextSibling;
      if (next && next.isBlockElement()){
        props = window.getDeclaredStyle(currFloat);
        nextProps = window.getDeclaredStyle(next);
        // This bug affects non-floated content with a specified width (but with NO
        // specified height) after a float with a specified width.
        // AP elements after the float are not affected, nor are elements with overflow
        // set to hidden, scroll, or auto.
        if (typeof(props.width) != "undefined" && (typeof(nextProps.width) != "undefined" && nextProps.width != "auto" && (typeof(nextProps.cssFloat) == "undefined" || nextProps.cssFloat == "none") && typeof(nextProps.height) == "undefined"  && nextProps.position != "absolute" && (typeof(nextProps.overflow) == "undefined" || nextProps.overflow == "visible"))){
          var totalFloatWidth = issueUtils.getTotalFloatWidth(currFloat,true);
          if (next.getComputedStyleProp("margin-left") < totalFloatWidth){
            issueNodes.push(next);
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
                   "Internet Explorer 7.0",
                   "Internet Explorer for Macintosh 5.2");
}

function getIssueID(){
  return "FLOATING_NON_FLOAT";
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



