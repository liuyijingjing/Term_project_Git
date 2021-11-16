// Copyright 1998, 1999, 2000, 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
//-----------------------------------------------------
//
// Source Formatting.js
//
// This file contains the implementation to fire off the Dreamweaver
// source formatter.

function canAcceptCommand()
{
  return (dw.getFocus() == 'document');
}

// formatSource()
//
// This routine kicks off the Dreamweaver source formatter
// on the entire document by "touching" the HTML child tag
// innerHTML properties.
// 
function formatSource()
{
  var root = dreamweaver.getDocumentDOM("document");

  // make sure we're synched before we get length or do the format
  root.synchronizeDocument();

  var htmlTag = root.documentElement;

  htmlTag.innerHTML = htmlTag.innerHTML + "";

  return;         
}
