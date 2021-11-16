// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function findIssue(){
  var DOM = dw.getDocumentDOM();
  var issueNodes = new Array();
  
  if (DOM){
	  var lists = DOM.getListElements();
    var currList = null, props = null, parentProps = null;
  	
	  for (var i=0; i < lists.length; i++){
	    currList = lists[i];
	    parent = currList.parentNode;
      props = window.getDeclaredStyle(currList);
      parentProps = window.getDeclaredStyle(parent);
      // Check for floated, relatively-positioned parent (but make sure
      // list itself is not relatively-positioned).
      if ((typeof(parentProps.cssFloat) != "undefined" && parentProps.cssFloat != "none") && parentProps.position == "relative" && props.position != "relative"){
        // Occasionally DDs are not affected if DTs are present, but it's
        // not 100%, so I'm checking both.
        var dts = currList.getElementsByTagName("dt");
        var dds = currList.getElementsByTagName("dd");
        var lis = currList.getElementsByTagName("li");
        // Only the first dt/dd/li really matters
        if ((dts.length > 0 && issueUtils.setsBackground(dts[0])) ||
            (dds.length > 0 && issueUtils.setsBackground(dds[0])) ||
            (lis.length > 0 && issueUtils.setsBackground(lis[0])))
        {
          issueNodes.push(currList);          
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
  return "DISAPPEARING_LIST_BACKGROUND";
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
