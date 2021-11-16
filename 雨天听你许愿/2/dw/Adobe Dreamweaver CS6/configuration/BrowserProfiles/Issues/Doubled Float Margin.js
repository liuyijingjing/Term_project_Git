// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    var containers = new Array();
    containers = issueUtils.getContainers(DOM.body,containers);
    var props = null, currContainer = null;
    var currFloat = null, prev = null, prevProps = null;
    for (var i=0; i < containers.length; i++){
      currContainer = containers[i];
      floats = issueUtils.getFloats(currContainer);
      for (var k=0; k < floats.length; k++){
        var newRow = false;
        currFloat = floats[k];
        // This ugly bit of logic handles the case where a new float
        // row is started within the container by a clearing
        // element. Since only the first float in a float row is affected,
        // we need to skip over any floats that aren't at the beginning of
        // a row. (floats[0] is always the first float in its row.)
        if (k > 0){
          prev = currFloat.previousSibling;
          if (prev && prev.nodeType == Node.ELEMENT_NODE){
            prevProps = window.getDeclaredStyle(prev);
            if (typeof(prev.clear) != "undefined" && prev.clear != "none"){
              newRow = true;
            }
            else{
              continue;
            }
          }
          else{
            continue;
          }
        }
        if (k == 0 || newRow == true){
          // skip over img, input, button, and a tags; IE sees them 
          // as "inline" even though they're floated, and 
          // float + inline prevents the bug.
          if (currFloat.tagName != "IMG" && 
              currFloat.tagName != "INPUT" && 
              currFloat.tagName != "BUTTON" &&
              currFloat.tagName != "LABEL" &&
              currFloat.tagName != "A")
          {
            props = window.getDeclaredStyle(currFloat);
            props = issueUtils.expShrt(props,"margin"); 
            if (((props.cssFloat == "left" && typeof(props.marginLeft) != "undefined" && (parseInt(props.marginLeft) > 0)) || (props.cssFloat == "right" && typeof(props.marginRight) != "undefined" && (parseInt(props.marginRight) > 0))) && props.display != "inline"){
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
  return "DOUBLED_FLOAT_MARGIN";
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

