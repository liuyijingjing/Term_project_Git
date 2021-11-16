// Copyright 2000, 2001, 2002, 2003 Macromedia, Inc. All rights reserved.

//---------------   GLOBAL VARIABLES   ---------------

var helpDoc = MM.HELP_objDescription;

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() { 
	// Return false, indicating that this object is available in code view.
	return false;
}

function objectTag() {
// Return the html tag that should be inserted

  var encodedVal  = dwscripts.entityNameEncode(document.theForm.Description.value);
  return '<meta name="description" content="' + encodedVal + '">'
}
