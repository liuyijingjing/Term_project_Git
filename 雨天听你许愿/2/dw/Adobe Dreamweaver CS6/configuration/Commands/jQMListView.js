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
var LISTTYPE = null;	//Type of list to use (Ordered vs. unordered).
var INSET = null;		//Control for whether or not we want the list to be inset (Rounded).
var SPLITBTN = null;	//Control if each element have a split button.
var SPLITBTNICON = null;//Icon for split button.
var ASIDE = null;		//Control for whether there should be some text on the right side of the list item.
var TEXTDESC = null;	//Control for text fragment right below main item label.
var BUBBLE = null;		//Control for count bubble on right side of element.
var NUMITEMS = null;	//Number of items for the list.

//******************* API **********************

/** Initialization function to prepare all necessary variables and dialog. */
function init() 
{
  widgetId = "jQMListView";
  initializeUI();

  var defNumList = 3;
  //Set defaults.
  LISTTYPE.pickValue("ul");
  NUMITEMS.pick(defNumList);
  //Split button control settings.
  SPLITBTNICON.pickValue("");
  SPLITBTNICON.disable();
  SPLITBTN.onclick = "changeTag('split')";
  SPLITBTN.onkeypress = "changeTag('split')";
}

/** Toggle selection of property based on whether it makes sense.
 *  For icon selection, a valid option must be chosen. */
function changeTag(attr) {
	switch (attr) {
		//Do we want a split button?
		case 'split':
			if (SPLITBTN.checked) {
				SPLITBTNICON.enable();
			} else {
				SPLITBTNICON.disable();
			}
			break;
	}
}

/** Define any variables that have not been initialized already. */
function initializeUI() {
  if (!INSET)
  	INSET = document.getElementById("inset");
  if (!SPLITBTN)
  	SPLITBTN = document.getElementById("splitbutton");
  if (!ASIDE)
  	ASIDE = document.getElementById("aside");
  if (!TEXTDESC)
  	TEXTDESC = document.getElementById("textdesc");
  if (!BUBBLE)
  	BUBBLE = document.getElementById("textbubble");
  if (!LISTTYPE)
  	LISTTYPE = new ListControl("listtype", null, true);
  if (!NUMITEMS)
  	NUMITEMS = new ListControl("numitems", null, true);
    if (!SPLITBTNICON)
  	SPLITBTNICON = new ListControl("splitbuttonicon", null, true);
}

/** Create all the necessary markup requested by the user */
function createMarkup() {
	markupArr = new Array();
	var listType = LISTTYPE.getValue();
	if (listType == 'ol') {
		widgetId = "jQMOrderedListView";
	}
	markupArr.push('<' + listType + ' mmTranslatedValue="transId=%22'+widgetId+'%22" data-role="listview"');
	
	if (INSET.checked) {
		markupArr.push(' data-inset="true"');
	}
	
	if (SPLITBTNICON.getValue() != "" && !SPLITBTNICON.disabled) {
		markupArr.push(' data-split-icon="' + SPLITBTNICON.getValue() + '"');
	}
	
	markupArr.push('>');
	createListItems();
}

/** Dynamically create markup for the number of list items requested  */
function createListItems() {
	var numItems = NUMITEMS.get();
	var pageLabel = dw.loadString("Commands/jQM/dummy/page/page");
	var asideLabel = dw.loadString("Commands/jQM/listview/options/aside");
	var defLabel = dw.loadString("Commands/jQM/buttons/dialog/iconPos/default");
	
	var itemStr = pageLabel;
	
	//Markup attributes for list items.
	if (TEXTDESC.checked) {
		itemStr = '<h3>' + itemStr + '</h3>';
		itemStr += '<p>Lorem ipsum</p>';
	}
	
	if (BUBBLE.checked) {
		itemStr += '<span class="ui-li-count">1</span>';
	}
	
	if (ASIDE.checked) {
		itemStr += '<p class="ui-li-aside">' + asideLabel + '</p>';
	}
	
	//Surround list content with anchor.
	itemStr = '<a href="#">' + itemStr + '</a>';
	
	if (SPLITBTN.checked) {
		itemStr += '<a href="#">' + defLabel + '</a>';
	}
	itemStr = '<li>' + itemStr + '</li>';
	
	for (var i = 0; i < numItems; i++) {
		markupArr.push(itemStr);
	}
	markupArr.push('</'+ LISTTYPE.getValue() + '>');
	
	widgetMarkup = markupArr.join('');
}

/** Check that input is valid before moving forward with inserting markup. */
function addListView() {
	createMarkup();
	insertMarkup();
	window.close();
}

/*********************************************************
*			DW COMMAND SPECIFIC FUNCTIONS				 *
**********************************************************/
function commandButtons() {
   return new Array(MM.BTN_OK, "addListView()",
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