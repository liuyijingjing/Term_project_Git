// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    var uLists = DOM.getElementsByTagName('ul');
    var oLists = DOM.getElementsByTagName('ol');
    var lists = uLists.concat(oLists);
    var re = new RegExp("<\\/li>[\\s\\r\\n]+<li");
    var links = null, linkProps = null, currList = null, currLink = null;
    var parent = null, parentProps = null;
    
    for (var i=0; i < lists.length; i++){
      currList = lists[i];
      // first check all li-containing lists for whitespace
      // between the li tags. if there is none, this bug has been 
      // worked around in the HTML, and we can just move on.
      if (currList.innerHTML.search(re) >= 0){
        // check list for links.
        links = currList.getElementsByTagName("a");
        for (var x=0; x < links.length; x++){
          currLink = links[x];
          linkProps = window.getDeclaredStyle(currLink);
          parent = currLink.parentNode;
          
          if (parent && parent.nodeType == 1 && dwscripts.isInsideTag(currLink,"LI")){
            // If for some reason there's a *table* inside the li,
            // and the link is inside one of the table cells, move on to the
            // next link. Links inside tables inside list items are not
            // affected by this bug.
            if (dwscripts.isInsideTag(currLink,"TABLE"))
              continue;

            // The Holly hack is used to defeat this bug by giving the block-level
            // links layout. Setting width, height, or zoom on the link or its parent
            // would do the same thing. Since there might be tags between the link
            // and the li, we'll consider them when looking for width and height.
            parentProps = window.getDeclaredStyle(parent);
            while (parent && parentProps && parent.tagName != "LI" && dwscripts.isInsideTag(parent,"LI") && typeof(parentProps.width) == "undefined" && typeof(parentProps.height) == "undefined" && typeof(parentProps.zoom) == "undefined"){
              parent = parent.parentNode;
              parentProps = window.getDeclaredStyle(parent);
            }
          }
          
          // If we get here, it's because the child(ren) of the li have
          // no width or height, or it's because the link has a parent we're not interested
          // in (and thus parent would be null). Check that the link is block-level, do one
          // last check for width and height (for the li itself), and then report the bug.
          if (linkProps.display == "block" && (typeof(linkProps.height) == "undefined") && typeof(linkProps.width) == "undefined") {
            if ((parent && typeof(parentProps.height) == "undefined" && typeof(parentProps.width) == "undefined") || !parent){
              issueNodes.push(currLink);
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
  return "EXTRA_WHITESPACE_IN_LIST_LINKS";
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
