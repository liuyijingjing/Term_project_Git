// Copyright 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
//-----------------------------------------------------
//
// Source Formatting Selection.js
//
// This file contains the implementation to fire off the Dreamweaver
// source formatter to the selection.

var caller = "";

function canAcceptCommand(){
  var retVal = true;
  var dom = null;
  if (caller == "CodeInspector")
    dom = dw.getActiveWindow();
  else
    dom = dw.getDocumentDOM();

  if (dom && (dom.getParseMode() == 'html' || dom.getParseMode() == 'xml' || dom.getParseMode() == 'css') && (dw.getFocus() == 'document' || dw.getFocus(true) == 'html' || dw.getFocus() == 'textView')){
    var selArr = dom.getSelection();
    if (selArr[0] == selArr[1]){
      retVal = false;
    }else if (dom.getSelectedNode().nodeType == Node.ELEMENT_NODE && dom.getSelectedNode().tagName == 'TABLE'){
      var sourceSel = dom.source.getSelection();
      var TRs = dom.getSelectedNode().getElementsByTagName('TR');
      var offsets;
      for (var i=0; i < TRs.length; i++){
        offsets = dom.nodeToOffsets(TRs[i]);
        if ((offsets[0] == sourceSel[0]) && (offsets[1] == sourceSel[1])){
          retVal = false;
          break;
        }
      }
    }
  }else{
    retVal = false;
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


function formatSourceSelection()
{
  var dom = null;
  
  // If user is in CI, use the top level doc.
  if (caller == "CodeInspector")
    dom = dw.getActiveWindow();
  else
    dom = dw.getDocumentDOM();
  
  if (dom)
    dom.formatSelection();
   
   return;         
}
