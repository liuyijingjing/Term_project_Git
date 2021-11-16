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

//Input dialog controls
var BUTTONS = null;		//Number of buttons
var BUTTONTYPE = null;  //Type of button.
var INPUTTYPE = null;   //Input type of button.

//Controls for positioning the buttons.
var POSITION = null;    //Type of positioning for button (Inline vs. control group).
var VERTICAL = null;    //Vertical positioning control.
var HORIZONTAL = null;  //Horizontal positioning control.

//Controls for the icons and their position.
var ICON = null;		//Type of icon to use.
var ICONPOS = null;		//Position of icon.

//Control for layout value of buttons.
var GROUP_VAL = 'data-role="controlgroup"';

//******************* API **********************

/** Set the default values for the controls in the popup dialog. */
function init() 
{
  initializeUI();
  var defNumButtons = 1;

  //Set default values.
  BUTTONS.pick(defNumButtons);
  BUTTONTYPE.pickValue("a");
  INPUTTYPE.pickValue("button");
  ICON.pickValue("");
  ICONPOS.pickValue("");
  POSITION.pickValue(GROUP_VAL);
  
  //Keep icon position selection off unless actual icon is used.
  ICONPOS.disable();
  
  //Keep input type selection off unless button type is input.
  INPUTTYPE.disable();
  
  //Disable layout and grouping options.
  POSITION.disable();
  toggleLayoutOptions("true");
  
  //Attach event handlers for toggling fields as necessary.
  ICON.object.onchange = "changeTag('icon')";
  BUTTONTYPE.object.onchange = "changeTag('button')";
  BUTTONS.object.onchange = "changeTag('buttonCount')";
  POSITION.object.onchange = "changeTag('group');";
}

/** Toggle selection of property based on whether it makes sense.
 *  For icon position, a valid icon must be chosen. */
function changeTag(attr) {
	switch (attr) {
		case 'buttonCount':
			//Enable grouping options if > 1 button.
			if (BUTTONS.get() > 1) {
				POSITION.enable();
				if (POSITION.getValue() == GROUP_VAL) {
					toggleLayoutOptions("false");
				}
			} else {
				POSITION.disable();
				toggleLayoutOptions("true");
			}
			break;
		case 'group':
			//Group the elements together.
			if (POSITION.getValue() != GROUP_VAL) {
				toggleLayoutOptions("true");
			} else {
				toggleLayoutOptions("false");
			}
			break;
		case 'icon':
			//Specifies an icon.
			if (ICON.getValue() != "") {
				ICONPOS.enable();
			} else {
				ICONPOS.disable();
			}
			break;
		case 'button':
			//Choose the type of buttons.
			if (BUTTONTYPE.getValue() == "input") {
				INPUTTYPE.enable();
				INPUTTYPE.pick("button");
			} else {
				INPUTTYPE.disable();
			}
			break;
	}
}

/** Toggle layout radio buttons. */
function toggleLayoutOptions(toggle) {
	VERTICAL.disabled = toggle;
	HORIZONTAL.disabled = toggle;
}

/** Define any variables that have not been initialized already. */
function initializeUI() {
  if (!HORIZONTAL)
  	HORIZONTAL = document.getElementById("horizontal");
  if (!VERTICAL)
  	VERTICAL = document.getElementById("vertical");
  if (!BUTTONS)
    BUTTONS = new ListControl("numbuttons", null, true);
  if (!BUTTONTYPE)
    BUTTONTYPE = new ListControl("buttontype", null, true);
  if (!INPUTTYPE)
    INPUTTYPE = new ListControl("inputtype", null, true);
  if (!ICON)
  	ICON = new ListControl("icon", null, true);
  if (!ICONPOS)
  	ICONPOS = new ListControl("iconPos", null, true);
  if (!POSITION)
  	POSITION = new ListControl("position", null, true);
}

/** Create all the necessary markup requested by the user */
function createMarkup() {
	markupArr = new Array();

	createButtons();
}

/** Dynamically create markup for the number of buttons requested  */
function createButtons() {
	var numButtons = BUTTONS.get();
	
	//Markup attributes for buttons.
	var inlineButton = '';
	var inlineLabel = dw.loadString("Commands/jQM/buttons/dialog/position/inline");
	if (POSITION.get().indexOf(inlineLabel) != -1) {
		inlineButton = ' data-inline="true"';
	}
	
	var iconButton = ICON.getValue();
	if (iconButton) {
		iconButton = ' data-icon="' + iconButton + '"';
	}
	
	var iconPosButton = '';
	var iconPosValue = ICONPOS.getValue();
	if (!ICONPOS.object.disabled && iconPosValue != '') {
		iconPosButton = ' data-iconpos="' + iconPosValue + '"';
	}
	
	//Use the right markup for the chosen button tag.
	var btnMarkup = '<';
	var btnTag = BUTTONTYPE.getValue();
	var buttonLabel = dw.loadString("Commands/jQM/dummy/buttons/buttonLabel");
	var btnEndMarkup = '>' + buttonLabel + '</' + btnTag + '>';
	
	switch (btnTag) {
		case 'a':
			widgetId = 'jQMLinkBtn';
			btnMarkup += btnTag + ' href="#" data-role="button"';
			break;
		case 'button':
			btnMarkup += btnTag;
			widgetId = 'jQMButtonBtn';
			break;
		case 'input':
			var btnVal;
			var inputType = INPUTTYPE.getValue();
			switch (inputType) {
				case "button":
					btnVal = dw.loadString("Commands/jQM/dummy/buttons/buttonLabel");
					break;
				case "submit":
					btnVal = dw.loadString("Commands/jQM/buttons/dialog/inputtype/submit");
					break;
				case "reset":
					btnVal = dw.loadString("Commands/jQM/buttons/dialog/inputtype/reset");
					break;
				case "image":
					btnVal = dw.loadString("Commands/jQM/buttons/dialog/inputtype/image") + '" src="';
					break;
			}
			btnMarkup += btnTag + ' type="' + inputType + '" value="' + btnVal + '"';
			btnEndMarkup = ' />';
			widgetId = 'jQMInputBtn';
	}
	
	if (numButtons > 1) {
		widgetId = "jQMButtonGroup";
		markupArr.push('<div mmTranslatedValue="transId=%22'+widgetId+'%22" ' + POSITION.getValue());
		
		if (HORIZONTAL.checked) {
			markupArr.push(' data-type="horizontal"');
		}
		
		markupArr.push('>');
		
		for (var i = 0; i < numButtons; i++) {
			markupArr.push(btnMarkup + inlineButton + iconButton + iconPosButton + btnEndMarkup);
		}
		markupArr.push('</div>');
	} else {
		markupArr.push(btnMarkup + ' mmTranslatedValue="transId=%22'+widgetId+'%22"' + inlineButton + iconButton + iconPosButton + btnEndMarkup);
	}
	
	widgetMarkup = markupArr.join('');
}

/** Check that input is valid before moving forward with inserting markup. */
function addButtons() {
	createMarkup();
	insertMarkup();
	window.close();
}

/*********************************************************
*			DW COMMAND SPECIFIC FUNCTIONS				 *
**********************************************************/
function commandButtons() {
   return new Array(MM.BTN_OK, "addButtons()",
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