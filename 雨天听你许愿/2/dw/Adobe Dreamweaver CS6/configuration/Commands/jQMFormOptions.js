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
var NAME = null;		//Name of widget.
var FORMOPTS = null;	//Number of elements to insert.
var HORIZONTAL = null;	//Layout of the elemnts

//Distinguish between different form option choices.
var option;

//******************* API **********************

/** Initialization function to prepare all necessary variables and dialog. */
function init() {
  //Define elements.
  if (!NAME)
    NAME = document.getElementById("nameEditBox");
  if (!FORMOPTS)
    FORMOPTS = new ListControl("elements", null, true);
  if (!HORIZONTAL)
  	HORIZONTAL = document.getElementById("horizontal");
	
	//Default number of elements.
	var defNumOpts = 3;
	//Set the default values of the elements.
	FORMOPTS.pick(defNumOpts);
	widgetId = dwscripts.getUniqueNameForTag("input", option);
	NAME.value = widgetId;
}

/** Create all the necessary markup requested by the user */
function createMarkup() {
	//Safeguard to make sure we don't look for a unique ID if we've already made one.
	if (NAME.value != widgetId) {
		//Custom ID has been entered by user. Check for uniqueness and enumerate until one is obtained.
		widgetId = getUniqueNameForTag("input", NAME.value);
	}
	markupArr = new Array();
	
	markupArr.push('<div mmTranslatedValue="transId=%22'+widgetId+'%22" data-role="fieldcontain"><fieldset data-role="controlgroup"');
	
	if (HORIZONTAL.checked) {
		markupArr.push(' data-type="horizontal"');
	}
	
	markupArr.push('>');
	
	createFormOpts();
}

/** Dynamically create markup for the number of checkboxes requested  */
function createFormOpts() {
	var optLabel = dw.loadString("Commands/jQM/dummy/generic/option");
	markupArr.push('<legend>' + optLabel + '</legend>');
	var numFormOpts = FORMOPTS.get();
	var baseStr = option;
	
	var dom = dw.getDocumentDOM();
	var optName = widgetId;
	var optId;
	
	var idBase = dwscripts.stripInvalidIDChars(optName);		
	//Get rid of leading numbers (Invalid to start ID with number, as stated by W3C).
	idBase = idBase.replace(parseInt(idBase), "");
	
	//Maintain counter for unique incrementing ID.
	var cnt = 0;
	
	var optLabel = dw.loadString("Commands/jQM/dummy/generic/option");
	//Take bigger hit in code size to provide faster performance.
	switch (baseStr) {
		case "radio":
			for (var i = 0; i < numFormOpts; i++) {
				do {
					optId = idBase+'_'+(cnt++);
				} while (dom.getElementById(optId))
				markupArr.push('<input type="' + baseStr + '" name="' + optName + '" id="' + optId + '" value="" /><label for="' + optId + '">' + optLabel + '</label>');
			}
			break;
		case "checkbox":
			for (var i = 0; i < numFormOpts; i++) {
				do {
					optId = idBase+'_'+(cnt++);
				} while (dom.getElementById(optId))
				markupArr.push('<input type="' + baseStr + '" name="' + optName + '" id="' + optId + '" class="custom" value="" /><label for="' + optId + '">' + optLabel + '</label>');
			}
			break;
	}
	
	markupArr.push('</fieldset></div>');
	
	widgetMarkup = markupArr.join('');
}

/** Check that input is valid before moving forward with inserting markup. */
function addFormOpts() {
	createMarkup();
	insertMarkup();
	window.close();
}

/*********************************************************
*			DW COMMAND SPECIFIC FUNCTIONS				 *
**********************************************************/
function commandButtons() {
   return new Array(MM.BTN_OK, "addFormOpts()",
	   				MM.BTN_Cancel, "window.close()",
                    MM.BTN_Help, "displayHelp()");
}

function receiveArguments(opt) {
	option = opt;
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