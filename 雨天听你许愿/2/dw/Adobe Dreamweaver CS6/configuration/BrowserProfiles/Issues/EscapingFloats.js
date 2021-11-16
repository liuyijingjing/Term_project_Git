// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();

  if (DOM){
    var node = (DOM.body) ? DOM.body : DOM;
    var floats = issueUtils.getFloats(node);
    var props = null, currFloat = null, next = null, parent = null;

    // first look for groups of floats
    var j = 0;
    for (var i=0; i < floats.length; i++){
      j = i;
      currFloat = floats[i];
      next = currFloat.nextSibling;
      parent = currFloat.parentNode;
      
      if (next && parent.tagName != "BODY"){

        var natW = 0, left = 0, right = 0, currW = 0, totalW = 0;
        
        // Add up the width + margins for the current float
        left = parseInt(currFloat.getComputedStyleProp("margin-left"));
        right = parseInt(currFloat.getComputedStyleProp("margin-right"));
        totalW = parseInt(currFloat.getComputedStyleProp("width")) + left + right; 

        // Look for sibling floats; stop when next is no longer a float.
        // Make sure to increment i so that we don't look through this same
        // bunch of floats again.
        while (next && issueUtils.isFloat(next)){
          left = parseInt(next.getComputedStyleProp("margin-left"));
          right = parseInt(next.getComputedStyleProp("margin-right"));
          currW = parseInt(next.getComputedStyleProp("width")) + left + right;

          totalW += currW;
          next = next.nextSibling;
          i++;
        }
        
        // Skip over any text or comment nodes that follow the floats.
        // We want to get to our clearing element, if there is one,
        // and any non-element nodes between the last float and the
        // clearing element are irrelevant.
        while (next && next.nodeType != 1)
          next = next.nextSibling;
          
        // OK, we're done finding our bunch of floats. (If i == j, then
        // only one float was found, not a bunch. Don't bother going 
        // forward.) If we did find a bunch of floats and the next element
        // clears the floats, we've met two of our bug criteria.
        if ((i > j) && next && (next.getComputedStyleProp("clear") != "none")){
          
          // Get the properties of the parent container. We're looking
          // for a parent that doesn't have width and height (bug criterion #3).
          props = window.getDeclaredStyle(parent);
          if (typeof(props.width) == "undefined" && typeof(props.height) == "undefined"){
            left = parseInt(parent.getComputedStyleProp("margin-left"));
            right = parseInt(parent.getComputedStyleProp("margin-right"));
            
            // Use a common screen resolution (default is 1025; see .html
            // file for SCREEN_RESOLUTION definition) to determine the
            // natural width of the parent.
            natW = SCREEN_RESOLUTION - left - right;
            
            // If the width of the floats combined exceeds the natural width
            // of the container, the bug will be triggered.
            if (totalW > natW){
              issueNodes.push(parent);
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
  return "ESCAPING_FLOATS";
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
