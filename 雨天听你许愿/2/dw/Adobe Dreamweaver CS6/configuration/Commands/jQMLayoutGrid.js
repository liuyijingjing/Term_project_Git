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

var ROWS = null;		//Number of rows for grid.
var COLUMNS = null;		//Number of columns for grid.

//Map to write the correct letter for the grid/block class.
var gridDict = ['a','b','c','d','e'];

//******************* API **********************

/** Initialization function to prepare all necessary variables and dialog. */
function init() {
  widgetId = "jQMLayoutGrid";
  
  //Define elements.
  if (!ROWS)
    ROWS = new ListControl("rows", null, true);
  if (!COLUMNS)
    COLUMNS = new ListControl("columns", null, true);  
  
  var defNumRows = 1;
  var defNumCols = 2;
  
  //Set defaults
  ROWS.pick(defNumRows);
  COLUMNS.pick(defNumCols);
}

/** Construct the markup for the specified dimensions of the grid. */
function updateGrid() {
	//Update widget ID.
	markupArr = new Array();
	markupArr.push('<div mmTranslatedValue="transId=%22'+widgetId+'%22"');
	
	var rows = ROWS.get();
	var columns = COLUMNS.get();

	//Grab the right letter index for grid. max() needed in case index falls below 0.
	var colIndex = Math.max(columns - 2, 0);
	markupArr.push(' class="ui-grid-' + gridDict[colIndex] + '">');
	
	var blockLabel = dw.loadString("Commands/jQM/dummy/layoutgrid/block");
	for (var r = 0; r < rows; r++) {
		for (var c = 0; c < columns; c++) {
			//Write out each block with r,c coords for easier association of the blocks.
			markupArr.push('<div class="ui-block-'+gridDict[c]+'">' + blockLabel + ' ' + (r+1) + ',' + (c+1) + '</div>');
		}
	}
	
	markupArr.push('</div>');
	widgetMarkup = markupArr.join('');
}

/** Check that input is valid before moving forward with inserting markup. */
function addGrid() {
	updateGrid();
	insertMarkup();
	window.close();
}


/*********************************************************
*			DW COMMAND SPECIFIC FUNCTIONS				 *
**********************************************************/
function commandButtons() {
    return new Array(MM.BTN_OK, "addGrid()",
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