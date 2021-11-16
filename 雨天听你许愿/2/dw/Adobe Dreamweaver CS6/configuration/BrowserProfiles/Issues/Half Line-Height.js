// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();

  if (DOM){
    var inEls = DOM.body.getInlineElements();
    var next = null, prev = null, parent = null;
    var parentProps = null, lh = null, currInEl = null, currTagName = "";
    var textNodes = new Array();
    var elProps = null, origEl = null;
    
    // look through all inline elements for replaced elements.
    // if no replaced elements are found, don't bother going forward.
    for (var i=0; i < inEls.length; i++){
      currInEl = inEls[i];
      origEl = currInEl;
      if (currInEl)
        currTagName = currInEl.tagName;
      if (currTagName && (currTagName == 'IMG' || currTagName == 'INPUT' || currTagName == 'TEXTAREA' || currTagName == 'SELECT' || currTagName == 'OBJECT')){
        parent = currInEl.parentNode;
        // For object tags inside noscript tags, we need to find an ancestor
        // to which line-height would apply instead. We're also going to move
        // the current inline element up in parallel with the parent, so that when
        // we check for adjacent text nodes below, we'll see what's adjacent to
        // the noscript tag, not the object tag (since the noscript's siblings are
        // what matter).
        while (parent && (parent.tagName == 'SCRIPT' || parent.tagName == 'NOSCRIPT'))
        {
          parent = parent.parentNode;
          currInEl = currInEl.parentNode
        }
        if (parent)
        {
          parentProps = window.getDeclaredStyle(parent,null,"",true);
          lh = parentProps.lineHeight;
            
          // If the inline replaced element's parent has line-height set, 
          // we're probably going to hit this bug. 
          if (typeof(lh) != "undefined"){
          
            // Check to see if the user has tried to work around this bug by
            // applying manual top and bottom margins to the affected elements.
            var elHeight = origEl.getComputedStyleProp("height");
            if (elHeight = "auto"){
              if (currTagName == "SELECT")
                elHeight = 21;
              else if (currTagName == "TEXTAREA")
                elHeight = 35;
              else if (currTagName == "INPUT"){
                var inputType = origEl.getAttribute("type");
                if (inputType) inputType = inputType.toLowerCase();
                switch (inputType){
                  case "checkbox":
                    elHeight = 9;
                    break;
                  case "radio":
                    elHeight = 14;
                    break;
                  case "file":
                    elHeight = 19;
                    break;
                  case "button":
                    elHeight = 22;
                    break;
                  case "text":
                  default:
                    elHeight = 21;
                    break;
                }
              }
              else{
                elHeight = 0;
              }
            }
            var bugfixMargins = parseInt((parseInt(lh) - elHeight)/2);
            elProps = issueUtils.expShrt(window.getDeclaredStyle(origEl),"margin");
            var top = parseInt(elProps.marginTop);
            var bottom = parseInt(elProps.marginBottom);
            if (typeof(top) == "undefined" || typeof(bottom) == "undefined" || (top != bugfixMargins && top != bugfixMargins+1 && top != bugfixMargins-1) || (bottom != bugfixMargins && bottom != bugfixMargins+1 && bottom != bugfixMargins-1))
            {
              // Before we report a 
              // problem, however, try to limit false positives as much as possible
              // by checking for text nodes immediately preceeding and following 
              // the inline replaced element. (Note that these text nodes might
              // be wrapped in formatting tags such as strong, em, span, etc.;
              // we'll still want to know about those, since for our purposes
              // they count as "adjacent text".)

              next = currInEl.nextSibling;
              prev = currInEl.previousSibling;
              var prevText = false;
              var nextText = false;
              
              if (prev && next){
                if (prev.nodeType == Node.TEXT_NODE){
                  prevText = true;
                }
                else if (prev.nodeType == Node.ELEMENT_NODE && prev.isInlineElement()){
                  dwscripts.traverseDOM(prev,null,issueUtils.foundNode,null,textNodes);
                  if (textNodes.length > 0){
                    prevText = true;
                    textNodes.length = 0;              
                  }
                }
                if (next.nodeType == Node.TEXT_NODE){
                  nextText = true;
                }
                else if (next.nodeType == Node.ELEMENT_NODE && next.isInlineElement()){
                  dwscripts.traverseDOM(next,null,issueUtils.foundNode,null,textNodes);
                  if (textNodes.length > 0){
                    nextText = true;
                    textNodes.length = 0;              
                  }
                }
              }
              if (prevText && nextText){
                  issueNodes.push(currInEl);  
              }
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
  return "HALF_LINE_HEIGHT";
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
