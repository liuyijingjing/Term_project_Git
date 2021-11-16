// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
    var labels = DOM.getElementsByTagName('label');
    
    if (labels.length > 0){
      // if any label tags were found, search for a pattern of 
      // [label tag][input tag][br tag]
      // [label tag][input tag]
      // search includes
      // possible spaces or line breaks between the tags even
      // though this pattern will produce a slightly different 
      // rendering result because the bug is essentially the same. 
      // (nextSibling and prevSibling
      // don't count the space or linebreak as a text node, so
      // all of the checks that follow will still work).
      var searchStr = DOM.body.innerHTML;
      var count = 0;
      var re = new RegExp('<label>[^<]*</label>[\\s\\n\\r]*<input[^>]*>[\\s\\n\\r]*<br[\\s\\/]*>[\\s\\r\\n]*<label>[^<]*</label>[\\s\\n\\r]*<input[^>]*>','gi');
      while (re.exec(searchStr) != null){
        count++;
      }
      if (count > 0){
        // ok, we know we have at least one pair of <label> + <input> 
        // followed by a <br>. start our DOM & style checks.
        var currLabel = null;
        var next = null, props = null, nextProps = null, bro2 = null, bro2Props = null;
        for (var i=0; i < labels.length; i++){
          currLabel = labels[i];
          next = currLabel.nextSibling;
          // see if the node adjacent to labels[i] is an input tag
          if (next && (next.nodeType == Node.ELEMENT_NODE) && (next.tagName == 'INPUT')){
            bro2 = next.nextSibling;
            // if label[i]'s first sibling was an input, check whether its second
            // sibling is a br.
            if (bro2 && (bro2.nodeType == Node.ELEMENT_NODE) && (bro2.tagName == 'BR')){
              // ok, we have all our tags in a row. let's see if letter-spacing's in the house.
              props = window.getDeclaredStyle(currLabel,null,true);
              if ((typeof(props.letterSpacing != "undefined") && props.letterSpacing != "0") && ((typeof(props.cssFloat) != "undefined") && props.cssFloat != "none")){
                // letter-spacing is in effect, and the label is floated. is the input
                // also floated?
                nextProps = window.getDeclaredStyle(next);
                if ((typeof(nextProps.cssFloat) != "undefined") && nextProps.cssFloat != "none"){
                  // one more check before we declare that we have a problem. has the user
                  // set letter-spacing back to 0 on the br?
                  bro2Props = window.getDeclaredStyle(bro2);
                  if (typeof(bro2Props.letterSpacing) == "undefined" || parseInt(bro2Props.letterSpacing) != 0){
                    // ok, we have a problem. the only question now is which node should be
                    // considered the problem node? ideally, it'd be all three tags, but since
                    // we can only report one, let's go with the <label>.
                    issueNodes.push(currLabel);
                  }
                }
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
                   "Internet Explorer 6.0",
                   "Internet Explorer 7.0",
                   "Internet Explorer 8.0",
                   "Internet Explorer 9.0 Beta");
}

function getIssueID(){
  return "DISAPPEARING_LABEL_INPUT";
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

