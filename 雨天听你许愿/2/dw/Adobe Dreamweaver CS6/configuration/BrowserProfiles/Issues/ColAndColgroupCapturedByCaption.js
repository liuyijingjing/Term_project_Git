// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();

  if (DOM){
    // first see if there are any caption tags in the doc.
    var captions = DOM.getElementsByTagName('caption');

    // declare a mess of variables that we'll need in the
    // for loop below.
    var currCap = null, props = null, parentTable = null;
    var colgroups = null, cols = null, allcol = null;
    var property = "", definedStyles = new Array();

    // ok, now loop through all the captions, if any.
    for (var i=0; i < captions.length; i++){
      currCap = captions[i];
      parentTable = currCap.parentNode;

      // the caption is only a problem if it's in the valid
      // spot (i.e., the first child of the table)
      if (currCap == parentTable.childNodes[0]){

        // find all colgroup and col tags that are in the
        // same table as the caption.
        colgroups = parentTable.getElementsByTagName('colgroup');
        cols = parentTable.getElementsByTagName('col');
        allcol = colgroups.concat(cols);

        for (var x=0; x < allcol.length; x++){
          // if styles are declared for any colgroup or col
          // tag in this table, we have a problem node. don't
          // bother looking further.
          props = window.getDeclaredStyle(allcol[x]);
          property = "";
          definedStyles.length = 0;
          for (property in props) {
            definedStyles.push(property);
          }
          if (definedStyles.length > 0){
            issueNodes.push(currCap);
            break;
          }
        }
      }
    }
  }    
  return issueNodes;
}
function getAffectedBrowserDisplayNames(){
  return new Array("Safari 2.0");
}

function getAffectedBrowserProfiles(){
  return new Array("Safari 2.0");
}

function getIssueID(){
  return "COL_AND_COLGROUP_CAPTURED_BY_CAPTION";
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
