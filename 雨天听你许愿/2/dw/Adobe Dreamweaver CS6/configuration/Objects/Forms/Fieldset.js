// Copyright 2001-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//---------------   GLOBAL VARIABLES   ---------------

var TEXT_LEGEND;

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() { 
	// Return false, indicating that this object is available in code view.
	return false;
}

function onOK(){
	return true;	
}

function objectTag(){
  var upCaseTag = (dw.getPreferenceString("Source Format", "Tags Upper Case", "") == 'TRUE');

  var before = (upCaseTag)?'<FIELDSET>':'<fieldset>';
  var after = (upCaseTag)?'</FIELDSET>':'</fieldset>';
  var legend = "";
  
  if (TEXT_LEGEND && TEXT_LEGEND.value != ""){
    legend = ((upCaseTag)?'<LEGEND>':'<legend>') + TEXT_LEGEND.value + ((upCaseTag)?'</LEGEND>':'</legend>');
  }
	
  // Manually wrap tags around selection.
  var dom = dw.getDocumentDOM();
	
  // if the selection is in code view, just wrap as-is without worrying about
  // balancing. (the user is expected to select exactly what s/he wants to
  // wrap when in code view.)
  if (dom.getView() == "code" || (dom.getView() == "split" && dw.getFocus() == "textView"))
    dom.source.wrapSelection(before + legend, after);
  else
  {
    // Use wrapTag() so that selection is adjusted to be a balanced tag selection.
    dom.wrapTag(before, true, true);
    // Set the selection to just after the opening <fieldset> tag
    // and manually insert <legend>.
    var sel = dom.getSelection();
    dom.setSelection(sel[0] + 10, sel[0] + 10);
    dom.insertHTML(legend);
  }

  // Just return -- don't do anything else.
  return;
}

//---------------    LOCAL FUNCTIONS   ---------------
function initUI() {
	TEXT_LEGEND = document.theForm.legendField;
	TEXT_LEGEND.focus();
}
