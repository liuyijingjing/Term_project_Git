// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    var floats = issueUtils.getFloats(DOM.body);
    var next = null, props = null;
    var currFloat = null;
    
    for (var i=0; i < floats.length; i++){
      currFloat = floats[i];
      // skip over img, input, button, label, and a tags; IE sees them as "inline" even though
      // they're floated, and float + inline prevents the bug.
      if (currFloat.tagName != "IMG" && 
          currFloat.tagName != "INPUT" && 
          currFloat.tagName != "BUTTON" && 
          currFloat.tagName != "LABEL" && 
          currFloat.tagName != "A")
      {
        // if nextSibling of float is a text node or an inline element
        next = currFloat.nextSibling;
        if (next && (next.nodeType == Node.TEXT_NODE || (next.nodeType == Node.ELEMENT_NODE && next.isInlineElement()))){
          props = window.getDeclaredStyle(currFloat,null,null,false);
          props = issueUtils.expShrt(props,"margin");
          // display: inline on the float prevents this bug
          if (props.display != "inline"){
          // if float is floated right and has margin left or vice versa,
          // bug will be triggered.
            if ((props.cssFloat == "left" && (parseInt(props.marginRight) > 0)) || (props.cssFloat == "right" && (parseInt(props.marginLeft) > 0))){
              issueNodes.push(currFloat);
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
  return "DUPLICATE_INDENT_BUG";
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
