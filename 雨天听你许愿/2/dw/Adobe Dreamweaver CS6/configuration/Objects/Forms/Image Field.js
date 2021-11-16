// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() { 
	// Return false, indicating that this object is available in code view.
	return false;
}

function objectTag() {
  var bDialogState = dw.getShowDialogsOnInsert(); // Was dialog shown?
  var newURL = dw.doURLEncoding(browseForFileURL("select", "", true));

  if ((newURL == '')  && bDialogState) {  return ''; }

  var uniqueId = dwscripts.getUniqueId("imageField");

  return returnFormTag('<input type="image" name="' + uniqueId + '" id="' + uniqueId + '" src="' + newURL + '">');
}
