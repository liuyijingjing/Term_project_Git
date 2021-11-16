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

var helpDoc = MM.HELP_objSpryStackedContainers;

// Controls
var _dsColumns = new TreeControlWithNavControls("dsColumns");
var _containerType = new ListControl("containerType");

// VARIABLES
var DS_DESIGN_TIME_ARG;
var DS_DESIGN_TIME_OBJ
var INSERT_OPTIONS_OBJ;
var INSERT_OPTIONS_ARG;

//---------------     API FUNCTIONS    ---------------


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
//            to insert a Spry Master/Detail structure in page. 
//--------------------------------------------------------------------
function clickedOK() 
{
  var optObj = new Object(); // insert object options
  
  var dsColumnsLen = _dsColumns.getRowLen();

  if (dsColumnsLen)
  {
    optObj.datasetColumns = new Array();
    for (var i = 0; i < dsColumnsLen; i++)
    {
      var rowValue = _dsColumns.getRowValue(i);
      
      if(rowValue)
      {
        var arrValues = rowValue.split("|");
        var colIdx = DS_DESIGN_TIME_OBJ.getColumnIndex(arrValues[0]);
        optObj.datasetColumns.push({columnName: arrValues[0], columnIdx: colIdx, containerElement: arrValues[1]});    
      }
    }
      
    INSERT_OPTIONS_OBJ.setOptions(optObj);
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
  var dataSetColumnNames = new Array();
  var containersTypesValues = new Array();
  var containersTypesLabels = new Array();
  var defaultColOptions = true;
   
  _containerType.init();
  // set the default container for detail columns from the HTML by getting the selected option from 
  // the containerType

  DS_DESIGN_TIME_OBJ = DS_DESIGN_TIME_ARG;
  if (DS_DESIGN_TIME_OBJ)
  {
    if (INSERT_OPTIONS_ARG)
    {
      var oldColNames = INSERT_OPTIONS_ARG.getDatasetColumnsNames();
      var newColNames = DS_DESIGN_TIME_OBJ.getColumnNames();
      
      // we are in edit mode
      // first verify that the old object is not outdated
      if (INSERT_OPTIONS_ARG.DatasetOptionsDiffer(DS_DESIGN_TIME_OBJ))
      {
        var errStr = dw.loadString("spry/dataset/insertOptions/alert/datasetOptionChanged");
        alert(errStr.replace(/\\n/g, "\n"));
      }
      else
      {
        defaultColOptions = false;
      }
      INSERT_OPTIONS_OBJ = INSERT_OPTIONS_ARG;
    }
    else
    {
      INSERT_OPTIONS_OBJ = new Spry.DesignTime.DataSet.InsertStructure(Spry.DesignTime.DataSet.InsertStructure.StackedContainers); 
    }
    
    if (defaultColOptions)
    {
      dataSetColumnNames = DS_DESIGN_TIME_OBJ.getColumnNames();
      for (var i = 0; i <  dataSetColumnNames.length; i++)
      {
        containersTypesValues[i] = Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElement;
        containersTypesLabels[i] = Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElementLabel;
      }
    }
    else
    {
      var optObj = INSERT_OPTIONS_OBJ.getOptions();
      
      if (optObj)
      {
        if (optObj.datasetColumns.length)
        {
          var dsColNames = DS_DESIGN_TIME_OBJ.getColumnNames();
          for (var i = 0; i < optObj.datasetColumns.length; i++)
          {
            var colName = dsColNames[optObj.datasetColumns[i].columnIdx];
            dataSetColumnNames.push(colName);
            containersTypesValues.push(optObj.datasetColumns[i].containerElement);
            containersTypesLabels.push("<" + optObj.datasetColumns[i].containerElement + ">");
          }
        }
      }
    }
    
    var dsTreeValues = new Array();
    var dsTreeLabels = new Array();
    for (var i = 0; i < dataSetColumnNames.length; i++)
    {
      dsTreeValues.push(dataSetColumnNames[i] + "|" + containersTypesValues[i]);
      dsTreeLabels.push(dataSetColumnNames[i] + "|" + containersTypesLabels[i]);
    }
    _dsColumns.setAllRows(dsTreeLabels, dsTreeValues);
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
//   controlName - string - the name of the control sending the event
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateUI(controlName)
{
  switch(controlName)
  {
      case "dsColumns":
          var selRowValue = _dsColumns.getRowValue();
          if (selRowValue)
          { 
            var arrValues = selRowValue.split("|");
            if (arrValues[1])
            {
              _containerType.pickValue(arrValues[1]);
            }
            else
            {
              // select default value
              _containerType.setIndex(0);
            }
          } 
          break;
      case "containerType":
          var selRowValue = _dsColumns.getRowValue();
          var selRowLabel = _dsColumns.getRow();
          if (selRowValue && selRowLabel)
          { 
            var arrValues = selRowValue.split("|");
            var arrLabels = selRowLabel.split("|");
            
            arrValues[1] = _containerType.getValue();
            selRowValue = arrValues.join("|");
            arrLabels[1] = _containerType.get();
            selRowLabel = arrLabels.join("|");
            _dsColumns.setRow(selRowLabel);
            _dsColumns.setRowValue(selRowValue);
          }
          break;
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   onAddColumn
//
// DESCRIPTION:
//   This function is called when the user press the '+'' button to add a column 
//  for either master or detail grids. It will add all selected columns after currently
//  selected column from the grid or at the end of the grid if no column is selected.
//
// ARGUMENTS:
//  
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onAddColumn()
{
  var columnsNames = getAvailableColumns();

  if (columnsNames.length)
  {
    var retObj = dwscripts.callCommand("Add Column.htm", columnsNames);
    
    if (retObj && retObj.length)
    {
      for (var i = 0; i < retObj.length; i++)
      {
        _dsColumns.addRow(retObj[i] + "|" + Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElementLabel, retObj[i] + "|" + Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElement);          
      }
    }
  }
  else
  {
    alert(dw.loadString("spry/dataset/insert stacked containers/alert/noColumnsToAdd"));
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   onRemoveColumn
//
// DESCRIPTION:
//   This function is called when the '-' button is clicked, and removes the selected
//  column if there are more than a column in the corresponding grid, or an alert message 
//  if there is only one column. 
//   
//
// ARGUMENTS:
//    none 
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onRemoveColumn()
{
  if (_dsColumns.getRowLen() > 1)
  {
    var rowValue = _dsColumns.getRowValue();
    if (rowValue)
    {
      var columnName = rowValue.split("|")[0];
      _dsColumns.delRow(); 
    }  
  }
  else
  {
    var errStr = dw.loadString("spry/dataset/insert stacked containers/alert/atLeastOneColumn"); 
    alert(errStr.replace(/\\n/g, "\n"));
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   getAvailableColumns
//
// DESCRIPTION:
//   This function returns all available columns.
//
// ARGUMENTS:
//  none
//
// RETURNS:
//   (array) - list of column names that exists in the data set design time object but doesn't exist 
//          in the grid
//--------------------------------------------------------------------
function getAvailableColumns()
{
  var chosenColumns = new Array();
  var dsColumns = DS_DESIGN_TIME_OBJ.getColumnNames();
  
  // detail columns
  var columnsList = _dsColumns.getRowValue('all');

  if (columnsList && columnsList.length)
  {
    // construct the column names array
    for (var i = 0; i < columnsList.length; i++)
    {
      var rowValue = columnsList[i].split("|");
      chosenColumns.push(rowValue[0]);
    }
  }

  return Spry.DesignTime.DataSet.InsertStructure.getArrayDifference(chosenColumns, dsColumns);
}
