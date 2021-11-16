/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2010 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/


//************************GLOBALS**************************

var HELP_DOC = MM.HELP_jQueryMobile;

//Input dialog controls.
var ID = null;		//ID of widget.
var HEADER = null;	//Header for widget.
var FOOTER = null;	//Footer for widget.

//******************* API **********************

/** Initialization function to prepare all necessary variables and dialog. */
function init() {
  widgetId = "page";
  widgetId = dwscripts.getUniqueId(widgetId);

  //Define elements.
  if (!ID)
  	ID = document.getElementById("idEditBox");
  if (!HEADER)
    HEADER = document.getElementById("header");
  if (!FOOTER)
  	FOOTER = document.getElementById("footer");
	
  //Set defaults for elements.
  ID.value = widgetId;
  
  /** Check header/footer based on previously saved options. Default is checked.
	  Preference strings need to be converted into booleans to toggle checkbox. */
  var headerChecked = dw.getPreferenceString(PREF_SECTION, PREF_PAGE_HEADER, true) == "true";
  var footerChecked = dw.getPreferenceString(PREF_SECTION, PREF_PAGE_FOOTER, true) == "true";
  HEADER.checked = headerChecked;
  FOOTER.checked = footerChecked;
}

/** Create all the necessary markup requested by the user */
function createMarkup() {
	widgetId = dwscripts.getUniqueId(ID.value);
	markupArr = new Array();
	markupArr.push('<div data-role="page" id="' + widgetId + '" mmTranslatedValue="transId=%22'+widgetId+'%22">');
	
	var headerLabel = dw.loadString("Commands/jQM/page/dialog/header");
	var contentLabel = dw.loadString("Commands/jQM/dummy/page/content");
	var footerLabel = dw.loadString("Commands/jQM/page/dialog/footer");
	
	//Save header/footer preferences.
	var headerChecked = HEADER.checked;
	var footerChecked = FOOTER.checked;
	dw.setPreferenceString(PREF_SECTION, PREF_PAGE_HEADER, headerChecked);
	dw.setPreferenceString(PREF_SECTION, PREF_PAGE_FOOTER, footerChecked);
	
	if (headerChecked) {
		markupArr.push('<div data-role="header"><h1>' + headerLabel + '</h1></div>');
	}
	
	markupArr.push('<div data-role="content">' + contentLabel + '</div>');
	
	if (footerChecked) {
		markupArr.push('<div data-role="footer"><h4>' + footerLabel + '</h4></div>');
	}
	
	markupArr.push('</div>');
	widgetMarkup = markupArr.join('');
}


/** Check that input is valid before moving forward with inserting markup. */
function addPage() {
	if (idCheck(ID.value)) {
		createMarkup();
		insertMarkup();
		window.close();
	} else {
		alert(dw.loadString("spry/widget/alert/id is invalid"));
	}
}

/*********************************************************
*			DW COMMAND SPECIFIC FUNCTIONS				 *
**********************************************************/
function commandButtons() {
    return new Array(MM.BTN_OK, "addPage()",
				    MM.BTN_Cancel, "window.close()",
                    MM.BTN_Help, "displayHelp()");
}

//--------------------------------------------------------------------
// FUNCTION:
//   displayHelp
//
// DESCRIPTION:
//   Displays the built-in Dreamweaver help.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function displayHelp() {
    dwscripts.displayDWHelp(HELP_DOC);
}