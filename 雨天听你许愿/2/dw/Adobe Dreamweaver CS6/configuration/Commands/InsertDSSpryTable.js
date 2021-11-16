/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2007 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

//---------------   GLOBAL VARIABLES   ---------------
var helpDoc = MM.HELP_objSpryDataTable;
var _TREELIST_AJAX_COLS	= null;
var _SORTALBE_CHECK_BOX = null;
var _sortOrderTypeCtrl = null;
var _ARR_COLS_TO_ADD = new Array();
var _LIST_SPRY_ODD_CLASSES = null;
var _LIST_SPRY_EVEN_CLASSES = null;
var _LIST_SPRY_HOVER_CLASSES = null;
var _LIST_SPRY_SELECT_CLASSES = null;
var _SET_CUR_BEHAVIOR_CHECKBOX = null;
var _bCalledFromDS = false;
var _dropOffsets = null;

var DS_DESIGN_TIME_ARG;
var DS_DESIGN_TIME_OBJ
var INSERT_OPTIONS_OBJ;
var INSERT_OPTIONS_ARG;

var IsSortableList = new Array(MM.LABEL_SortNo,MM.LABEL_SortYes);
var IsSortableValueList = new Array(MM.VALUE_SortNo,MM.VALUE_SortYes);


//---------------     API FUNCTIONS    ---------------

//--------------------------------------------------------------------
// FUNCTION:
//   receiveArguments
//
// DESCRIPTION:
//   This function is called before the interface is displayed and assign received 
//  arguments to command's global variables to avoid caching. 
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function receiveArguments()
{
  if (arguments[0] && arguments[0].designTimeObj)
  {
    DS_DESIGN_TIME_ARG = arguments[0].designTimeObj;
    if (arguments[0].insertObj)
    {
      INSERT_OPTIONS_ARG = arguments[0].insertObj;
    }
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   isDOMRequired
//
// DESCRIPTION:
//   This function ... 
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function isDOMRequired()
{
	return true;
}

//--------------------------------------------------------------------
// FUNCTION:
//   commandButtons
//
// DESCRIPTION:
//   Returns the array of buttons that should be displayed on the
//   right hand side of the dialog.  The array is comprised
//   of name, handler function name pairs.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   array of strings - name, handler function name pairs
//--------------------------------------------------------------------
function commandButtons()
{
   return new Array( MM.BTN_OK,     "clickedOK()",
                     MM.BTN_Cancel, "window.close()",
                     MM.BTN_Help,   "displayHelp()");
}

//--------------------------------------------------------------------
// FUNCTION:
//   clickedOK
//
// DESCRIPTION:
//   This function construct the insert option object and return it to 
//  the calling command (Spry Data Set Wizard)
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   (object) - Insert Option object wich will holds all the necessary information 
//            to insert a Spry Table in page. 
//--------------------------------------------------------------------
function clickedOK()
{
  var anAjaxDataTable = new ajaxDataTable("","",_LIST_SPRY_ODD_CLASSES.get(),_LIST_SPRY_EVEN_CLASSES.get(),_LIST_SPRY_HOVER_CLASSES.get(),_LIST_SPRY_SELECT_CLASSES.get());
  
  var colList = _TREELIST_AJAX_COLS.getRowValue('all');
  
  if (colList.length)
  {
    //set the current row behavior
    anAjaxDataTable.setColumnList(colList);
    anAjaxDataTable.setCurrentRowBehavior(_SET_CUR_BEHAVIOR_CHECKBOX.getCheckedState());
    
    INSERT_OPTIONS_OBJ.setOptions({ajaxDataTable: anAjaxDataTable});
    
    // save the data set url, root element and all columns names to detect 
    // at insertion time if the actual data set is the same as the 
    // one used when the user customized this insert option
    INSERT_OPTIONS_OBJ.setDatasetURL(DS_DESIGN_TIME_OBJ.getDataSetURL());
    INSERT_OPTIONS_OBJ.setRootElement(DS_DESIGN_TIME_OBJ.getRootElement());
    INSERT_OPTIONS_OBJ.setDatasetColumnsNames(DS_DESIGN_TIME_OBJ.getColumnNames());
    
    dwscripts.setCommandReturnValue(INSERT_OPTIONS_OBJ);
  }
  
  window.close();
}

//---------------    LOCAL FUNCTIONS   ---------------


//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   This function is called in the onLoad event. It is responsible
//   for initializing the UI and for setting the default values for some of the interface
//   fields. If no Insert Option object was received as parameter, we will create a new 
//   one here with the default options.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function initializeUI()
{
  _TREELIST_AJAX_COLS = new TreeControlWithNavControls("ColumnList");
  //_SORTALBE_LIST	  = new ListControl("IsSortable");
  //_SORTALBE_ORDER_LIST = new ListControl("SortOrder");	
  _SORTALBE_CHECK_BOX = new CheckBox("","SortOrder");
  _SORTALBE_CHECK_BOX.initializeUI();

  _LIST_SPRY_ODD_CLASSES = new ListControl("spryOddRowClass");
  _LIST_SPRY_EVEN_CLASSES = new ListControl("spryEvenRowClass");
  _LIST_SPRY_HOVER_CLASSES = new ListControl("spryHoverClass");
  _LIST_SPRY_SELECT_CLASSES = new ListControl("sprySelectClass");
  _TREELIST_AJAX_COLS.setColumnNames(MM.LABEL_SpryColGrid);
  //_SORTALBE_LIST.setAll(IsSortableList,IsSortableList);
  //_SORTALBE_ORDER_LIST.setAll(SortOrderList,SortOrderList);
  _sortOrderTypeCtrl = findObject("SortOrder");

  //set the current behavior checkbox
  _SET_CUR_BEHAVIOR_CHECKBOX = new CheckBox("","setRowNum");
  _SET_CUR_BEHAVIOR_CHECKBOX.initializeUI();

  //disable the sort type dd
  //SetEnabled(_sortOrderTypeCtrl, false) 
  //get the list of classes available for this document
  populateSpryCSSClasses();

  DS_DESIGN_TIME_OBJ = DS_DESIGN_TIME_ARG;
  if (DS_DESIGN_TIME_OBJ)
  {
    if (INSERT_OPTIONS_ARG && INSERT_OPTIONS_ARG.getOptions())
    {
      // update controls except the columns list
      var optObj = INSERT_OPTIONS_ARG.getOptions().ajaxDataTable;
      if (optObj)
      {
        // we are in edit mode
        // first verify that the old object is not outdated
        if (INSERT_OPTIONS_ARG.DatasetOptionsDiffer(DS_DESIGN_TIME_OBJ))
        {
          var errStr = dw.loadString("spry/dataset/insertOptions/alert/datasetOptionChanged");
          alert(errStr.replace(/\\n/g, "\n"));
          INSERT_OPTIONS_OBJ = new Spry.DesignTime.DataSet.InsertStructure(Spry.DesignTime.DataSet.InsertStructure.SpryTable);          
        }
        else
        {
          // set css classes
          if (optObj.oddClass)
          {
            var arrTmp = _LIST_SPRY_ODD_CLASSES.getValue('all');
            if (dwscripts.findInArray(arrTmp, optObj.oddClass) == -1)
            {
              _LIST_SPRY_ODD_CLASSES.add(optObj.oddClass, optObj.oddClass);
            }
            _LIST_SPRY_ODD_CLASSES.pickValue(optObj.oddClass);
            _LIST_SPRY_ODD_CLASSES.object.editText = optObj.oddClass;
            _LIST_SPRY_ODD_CLASSES.object.focus();
          }
          if (optObj.evenClass)
          {
            var arrTmp = _LIST_SPRY_EVEN_CLASSES.getValue('all');
            if (dwscripts.findInArray(arrTmp, optObj.evenClass) == -1)
            {
              _LIST_SPRY_EVEN_CLASSES.add(optObj.evenClass, optObj.evenClass);
            }
            _LIST_SPRY_EVEN_CLASSES.pickValue(optObj.evenClass);
            _LIST_SPRY_EVEN_CLASSES.object.editText = optObj.evenClass;
            _LIST_SPRY_EVEN_CLASSES.object.focus();
          }
          if (optObj.selectionClass)
          {
            var arrTmp = _LIST_SPRY_SELECT_CLASSES.getValue('all');
            if (dwscripts.findInArray(arrTmp, optObj.selectionClass) == -1)
            {
              _LIST_SPRY_SELECT_CLASSES.add(optObj.selectionClass, optObj.selectionClass);
            }
            _LIST_SPRY_SELECT_CLASSES.pickValue(optObj.selectionClass);
            _LIST_SPRY_SELECT_CLASSES.object.editText = optObj.selectionClass;          
            _LIST_SPRY_SELECT_CLASSES.object.focus();
          }
          if (optObj.hoverClass)
          {
            var arrTmp = _LIST_SPRY_HOVER_CLASSES.getValue('all');
            if (dwscripts.findInArray(arrTmp, optObj.hoverClass) == -1)
            {
              _LIST_SPRY_HOVER_CLASSES.add(optObj.hoverClass, optObj.hoverClass);
            }
            _LIST_SPRY_HOVER_CLASSES.pickValue(optObj.hoverClass);
            _LIST_SPRY_HOVER_CLASSES.object.editText = optObj.hoverClass;
            _LIST_SPRY_HOVER_CLASSES.object.focus();
          }
          // update detail regions control
          if (optObj.bHasCurrentRowBehavior != false)
          {
            _SET_CUR_BEHAVIOR_CHECKBOX.setCheckedState(true);
          }
        }
      }
    }
    else
    {
      INSERT_OPTIONS_OBJ = new Spry.DesignTime.DataSet.InsertStructure(Spry.DesignTime.DataSet.InsertStructure.SpryTable); 
    }
  }

	buildColList();
}

//--------------------------------------------------------------------
// FUNCTION:
//   populateSpryCSSClasses
//
// DESCRIPTION:
//   This function get the list of classes available for this document
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function populateSpryCSSClasses()
{
  var dom = dw.getDocumentDOM();
	var allClasses = dom.getSelectorsDefinedInStylesheet('class');
	for (i = 0; i < allClasses.length; i++)
	{
		if (allClasses[i][0] == '.')
		{
			allClasses[i] = allClasses[i].slice(1);
		}
	}
	_LIST_SPRY_HOVER_CLASSES.setAll(allClasses,allClasses);
	_LIST_SPRY_SELECT_CLASSES.setAll(allClasses,allClasses);
	_LIST_SPRY_ODD_CLASSES.setAll(allClasses,allClasses);
	_LIST_SPRY_EVEN_CLASSES.setAll(allClasses,allClasses);
}

//--------------------------------------------------------------------
// FUNCTION:
//   buildColList
//
// DESCRIPTION:
//   This function get the list of dataset columns and populates the tree control
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function buildColList()
{	
	//get the client side spry dataset name	
	var dsColList = new Array();				
	var dsColValList = new Array();
  var columnNames = DS_DESIGN_TIME_OBJ.getColumnNames();
  var validColumns = true;

  if (INSERT_OPTIONS_OBJ && INSERT_OPTIONS_OBJ.getOptions())
  {
    var optObj = INSERT_OPTIONS_OBJ.getOptions().ajaxDataTable;
    if (optObj)
    {
      var colsList = optObj.colList;
      
      if (colsList && colsList.length)
      {
        for (var i = 0; i < colsList.length; i++)
      	{
      	  // get the name for the corresponding column index from the design-time obj
      	  if(columnNames[colsList[i].colIdx])
      	  {
            var colListParts = columnNames[colsList[i].colIdx]  + "|";
            if (colsList[i].sortable)
            {
              colListParts += MM.LABEL_SortYes;
            }
            else
            {
              colListParts += MM.LABEL_SortNo;
            }
        		dsColList.push(colListParts);
        		dsColValList.push(colsList[i]);
          }
          else
          {
            validColumns = false;
            break;
          }
      	}
      }
    }
  }
  
  if (!validColumns)
  {
    // one of the columns names does not match the previous settings
    // so we will reset the column names controls to the default settings
    // and we will inform user about that
    alert(dw.loadString("spry/dataset/insertOptions/alert/datasetOptionChanged").replace(/\\n/g, "\n"));
  }
  
  if (!dsColList.length)
  {  
    // if no columns were already set, means that the command is called for the first time 
    // or an error occurred and the options were not loaded from the INSERT_OPTIONS_OBJ
    // set the default options here
  	for (var i = 0; i < columnNames.length; i++)
  	{
  		//add it to the binding arrays, add it to the list
  		//default sort is off and default sort order is toggle
  		var colListParts = columnNames[i]  + "|"  + MM.LABEL_SortYes;
  		dsColList.push(colListParts);
  		dsColValList.push(new ajaxDataTableColumn(columnNames[i],true,"",DS_DESIGN_TIME_OBJ.getColumnType(columnNames[i]), i));
  	}
  }
	
  //set the column names and value list
  _TREELIST_AJAX_COLS.setAllRows(dsColList,dsColValList);
  if (INSERT_OPTIONS_OBJ && validColumns)
  {
    _ARR_COLS_TO_ADD = getAvailableColumns();
  }
  else
  { 
    updateAdditionalColumnList('clear'); //clear the column list
  }
  displayColVals(); //sync to first column values
  
}


//--------------------------------------------------------------------
// FUNCTION:
//   displayColVals
//
// DESCRIPTION:
//   This function updates the controls attached to a column name
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function displayColVals()
{
	if (_TREELIST_AJAX_COLS.list.length == 0)
	{
		return;
	}
	else
	{
	   var currRowText = _TREELIST_AJAX_COLS.getRow();
	   var currRowVal  = _TREELIST_AJAX_COLS.getRowValue();
       var rowTextTokens = dw.getTokens(currRowText,"|");
	   //_SORTALBE_LIST.pickValue(rowTextTokens[1]); // update is sortable
	   if (rowTextTokens[1] == MM.LABEL_SortYes)
	   {
		_SORTALBE_CHECK_BOX.setCheckedState(true);
	   }
	   else
	   {
		_SORTALBE_CHECK_BOX.setCheckedState(false);
	   }
	   //_SORTALBE_ORDER_LIST.pickValue(rowTextTokens[1]); // update sort order list
	}
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateCol
//
// DESCRIPTION:
//   This function is called by the UI controls to handle UI updates
//
// ARGUMENTS:
//   control - string - the name of the control sending the event
//   event - string - the event which is being sent
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateCol(colName)
{
  var currRowObj  = _TREELIST_AJAX_COLS.getRowValue();
  var currRowText = _TREELIST_AJAX_COLS.getRow();
  var currColName = currRowText.substring(0,currRowText.indexOf("|"));
  var sortableText = MM.LABEL_SortYes;
  if (!_SORTALBE_CHECK_BOX.getCheckedState())
  {
    sortableText = MM.LABEL_SortNo;
  }
  currRowObj.sortable = _SORTALBE_CHECK_BOX.getCheckedState();
  
  var newRowText  = currColName + "|" + sortableText; 
  _TREELIST_AJAX_COLS.setRow(newRowText);
  _TREELIST_AJAX_COLS.setRowValue(currRowObj);
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateAdditionalColumnList
//
// DESCRIPTION:
//   The + button calls up an Add Columns dialog, allowing
// the user to add additional columns to the list. When the Add Columns
// dialog is called, it is populated with the "additional columns list".
// This list is updated when a user adds or deletes a column from the UI.

// ARGUMENTS:
//   action - string - can be "add", "del", or "clear"
//   col - string - the column name (optional)
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateAdditionalColumnList(action,col)
{
   var addColArr = _ARR_COLS_TO_ADD; 
   if (action == 'add')
   {
      addColArr.push(col);
   }
   else if ( action == 'clear')
   {
      _ARR_COLS_TO_ADD = new Array();
   }
   else 
   { 
      // delete an item from additional column list
      var nItems = addColArr.length,i;     
      for (i=0;i<nItems;i++)
      {
	      if (addColArr[i] == col)
	      {
		       addColArr.splice(i,1);
		       break;
	      }
      }
   }
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateUI
//
// DESCRIPTION:
//   This function is called by the UI controls to handle UI updates
//
// ARGUMENTS:
//   control - string - the name of the control sending the event
//   event - string - the event which is being sent
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateUI(control, event)
{
  if (control == "AddDSCol")
  {
	  // check to see if there are columns to add first
	  if (_ARR_COLS_TO_ADD.length == 0)
	  {
		  alert(MM.MSG_NoMoreColumnsToAdd);
		  return;
	  }
	
    var colsToAdd = dwscripts.callCommand('Add Column.htm',_ARR_COLS_TO_ADD);
  	
    if (!colsToAdd) return; // user clicked Cancel
	  var nCols = colsToAdd.length,i, currCol, rowInfoArr;
	  for (i=0;i<nCols;i++)
	  {
		  currCol = colsToAdd[i];
		  //add the row
		  var colListParts = currCol  + "|"  + MM.LABEL_SortYes;
		  _TREELIST_AJAX_COLS.addRow(colListParts, new ajaxDataTableColumn(currCol,true, "", DS_DESIGN_TIME_OBJ.getColumnType(currCol), DS_DESIGN_TIME_OBJ.getColumnIndex(currCol)));
		  updateAdditionalColumnList('del',currCol);
	  }
  }
  else if (control == "DeleteDSCol")
  {
	  var currRow = _TREELIST_AJAX_COLS.getRow();
	  var currCol = currRow.substring(0,currRow.indexOf("|") );
	  var nRows = _TREELIST_AJAX_COLS.list.length;
	  if (nRows > 1)
	  {
		  updateAdditionalColumnList('add',currCol);
		  _TREELIST_AJAX_COLS.delRow();
		  displayColVals(); 
	  } 
	  else 
	  {
		  alert(MM.MSG_NeedOneColumnInList);
	  }
  }
  else if (control == "MoveDSColUp")
  {
    _TREELIST_AJAX_COLS.moveRowUp();
  }
  else if (control == "MoveDSColDown")
  {
    _TREELIST_AJAX_COLS.moveRowDown();
  }
  else if (control == "ColumnList")
  {
    displayColVals();
  }
  /*else if (control == "IsSortable")
  {	
    //if sort column is yes , then set the default sort order to be toggle
	if (_SORTALBE_LIST.getValue() == MM.LABEL_SortYes)
	{
		 SetEnabled(_sortOrderTypeCtrl, true);
		_SORTALBE_ORDER_LIST.pickValue(MM.LABEL_SortToggle);
	}
	else
	{
		 SetEnabled(_sortOrderTypeCtrl, false);
		_SORTALBE_ORDER_LIST.pickValue(MM.LABEL_None);
	}
	updateCol("IsSortable");
  }*/
  else if (control == "SortOrder")
  {	
	  updateCol("SortOrder");
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   getAvailableColumns
//
// DESCRIPTION:
//   This function returns all available columns for the grid that is associated 
//  with the columnType parameter.
//
// ARGUMENTS:
//    none
//
// RETURNS:
//   (array) - list of column names that exists in the data set design time object but doesn't exist 
//          in the grid associated
//--------------------------------------------------------------------
function getAvailableColumns()
{
  var chosenColumns = new Array();
  var dsColumns = DS_DESIGN_TIME_OBJ.getColumnNames();
  var columnsList = _TREELIST_AJAX_COLS.getRowValue('all');

  if (columnsList && columnsList.length)
  {
    // construct the column names array
    for (var i = 0; i < columnsList.length; i++)
    {
      chosenColumns.push(columnsList[i].getColLabel());
    }
  }

  return Spry.DesignTime.DataSet.InsertStructure.getArrayDifference(chosenColumns, dsColumns);
}
