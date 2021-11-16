// Copyright 1998-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.
//-----------------------------------------------------
//
// Source Formatting.js
//
// This file contains the implementation to fire off the Dreamweaver
// source formatter.

var caller = "";

function canAcceptCommand()
{
  retVal = false;
  var dom = null;
  if (caller == "CodeInspector")
    dom = dw.getActiveWindow();
  else
    dom = dw.getDocumentDOM();  
        
  if (dom && (dom.getParseMode() == 'html' || dom.getParseMode() == 'xml' || dom.getParseMode() == 'css') &&
      (dw.getFocus() == 'document' || dw.getFocus(true) == 'html' || dw.getFocus() == 'textView')){
    retVal = true;
  }
  return retVal;
}

function isDOMRequired()
{
	return false;
}

function receiveArguments()
{
    caller = arguments[0];
}


// formatSource()
//
// This routine kicks off the Dreamweaver source formatter
// on the entire document by "touching" the HTML child tag
// innerHTML properties.
// 
function formatSource(dom)
{
  var root = null;
  
  // If user is in CI, use the top level doc.
  if( dom )
    root = dom;
  else if (caller == "CodeInspector")
    root = dw.getActiveWindow();
  else
    root = dw.getDocumentDOM();

  // make sure we're synched before we get length or do the format
  root.synchronizeDocument();

  var outerHTML = root.documentElement.outerHTML;
  root.formatRange(0, outerHTML.length);

  return;         
}
