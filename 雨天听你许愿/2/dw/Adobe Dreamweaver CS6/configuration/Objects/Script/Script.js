// Copyright 2001-2007 Adobe Systems Incorporated.  All rights reserved.

//---------------   GLOBAL VARIABLES   ---------------

var helpDoc = MM.HELP_objScript;
var gDialogShown = false;

var TEXT_SCRIPT;
var TEXT_NOSCRIPT;
var LIST_TYPE;
var TEXT_SRC;

//---------------     API FUNCTIONS    ---------------

function initUI(){
  TEXT_SCRIPT = document.theform.scriptContents;
  TEXT_NOSCRIPT = document.theform.noscript;
  LIST_TYPE = new ListControl('theType');
  LIST_TYPE.init();
  var curDOM = dw.getDocumentDOM();
  var dtd = curDOM.getDtdProfile();

  if (dtd && dtd.id == "mm_html_5")
	  LIST_TYPE.pickValue("none");
  else
	  LIST_TYPE.pickValue("text/javascript");

  TEXT_SRC = document.theform.externalSrc;

  gDialogShown = true;

}

function isDOMRequired() { 
	// Return false, indicating that this object is available in code view.
	return false;
}

function isAsset() {
	return true;
}

function objectTag(assetArgs) {
	var rtnStr="";

	var prefixScriptStr = "";
	var postScriptStr = "";

	if (dwscripts.isXSLTDoc())
	{
		//add CDATA to pre , post parts
		prefixScriptStr = "<![CDATA[\n";
		postScriptStr = "]]>\n";
	}

  // If we're an asset tag, then just set the src of the script tag
  // to the parameter passed in and return
  if (assetArgs)
  {
    var	dotIndex = assetArgs.lastIndexOf('.');
    var ext;
    if (dotIndex != -1)
    {
  	ext = assetArgs.substr(dotIndex+1);
  	ext = ext.toLowerCase();
    }
    if (ext && ext == "js")
      rtnStr = '<script type="text/javascript" src="' + assetArgs + '">' + prefixScriptStr + postScriptStr + '<\/script>';
    else
      rtnStr = '<script src="' + assetArgs + '">' + prefixScriptStr +  postScriptStr + '<\/script>';
    
    return rtnStr;    
  }
  
  // Otherwise, determine whether the dialog was shown, and then assemble
  // the script tag to be inserted. 

  var scriptVal = "";
  var noScriptVal = "";
  var scriptType = "text/javascript";
  var extSrc = "";

  if (gDialogShown)
  {
    scriptVal = TEXT_SCRIPT.value;
    noScriptVal = TEXT_NOSCRIPT.value;
    scriptType = LIST_TYPE.getValue();
    extSrc = TEXT_SRC.value;
  }

  // if an external source file has been specified, insert an empty script tag
  // with a src attribute.
  if (extSrc != ""){
    if (scriptType && scriptType != "none")
	    rtnStr = '<script type="' + scriptType + '" src="' + extSrc + '"><\/script>';
	  else
	    rtnStr = '<script src="' + extSrc + '"><\/script>';
  }

  // otherwise, insert a regular script tag (even if the Contents field is empty).
  else {
    if (scriptVal.charAt(scriptVal.length - 1) != '\n'){
		  scriptVal = scriptVal + '\n';
    }
    if (scriptType && scriptType != "none")
  		rtnStr = '<script type="' + scriptType + '">\n' + prefixScriptStr + scriptVal + postScriptStr + '<\/script>';
  	else
		rtnStr = '<script>\n' + prefixScriptStr + scriptVal + postScriptStr + '<\/script>';
  }

  if (noScriptVal.length > 0){
    if (noScriptVal.charAt(noScriptVal.length - 1) != '\n'){
      noScriptVal = noScriptVal + '\n';
    }
   	rtnStr = rtnStr + '\n'+ '<noscript>' + '\n' + prefixScriptStr + noScriptVal + postScriptStr + '<\/noscript>';
  }
  
  return rtnStr;
}
