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

var helpDoc = MM.HELP_objSprySpotlightColumn;

// Controls
var _spotlightColumns = new TreeControlWithNavControls("spotlightColumns");
var _stackedColumns = new TreeControlWithNavControls("stackedColumns");
var _containerTypeSpotlight = new ListControl("containerTypeSpotlight");
var _containerTypeStacked = new ListControl("containerTypeStacked");

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
  
  var spotlightColumns = _spotlightColumns.getRowValue("all");
  var stackedColumns = _stackedColumns.getRowValue("all");
  
  if (spotlightColumns.length && stackedColumns.length)
  {
    optObj.spotlightColumns = new Array();
    optObj.stackedColumns = new Array();
    
    for (var i = 0; i < spotlightColumns.length; i++)
    {
      var rowValue = spotlightColumns[i];
      
      if(rowValue)
      {
        var arrValues = rowValue.split("|");
        var colIdx = DS_DESIGN_TIME_OBJ.getColumnIndex(arrValues[0]);
        optObj.spotlightColumns.push({columnName: arrValues[0], columnIdx: colIdx, containerElement: arrValues[1]});    
      }
    }
    for (var i = 0; i < stackedColumns.length; i++)
    {
      var rowValue = stackedColumns[i];
      
      if(rowValue)
      {
        var arrValues = rowValue.split("|");
        var colIdx = DS_DESIGN_TIME_OBJ.getColumnIndex(arrValues[0]);
        optObj.stackedColumns.push({columnName: arrValues[0], columnIdx: colIdx, containerElement: arrValues[1]});    
      }
    }
      
    INSERT_OPTIONS_OBJ.setOptions(optObj);
    // save the data set url, rootElement and all columns names to detect 
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

  var spotlightColumnNames = new Array();
  var stackedColumnNames = new Array();
  var spotlightContainersTypesValues = new Array();
  var spotlightContainersTypesLabels = new Array();
  var stackedContainersTypesValues = new Array();
  var stackedContainersTypesLabels = new Array();
  var defaultColOptions = true;
   
  _containerTypeSpotlight.init();
  _containerTypeStacked.init();

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
      INSERT_OPTIONS_OBJ = new Spry.DesignTime.DataSet.InsertStructure(Spry.DesignTime.DataSet.InsertStructure.SpotlightColumn); 
    }
    
    var columnNames = DS_DESIGN_TIME_OBJ.getColumnNames();
    
    if (defaultColOptions)
    {
      if (columnNames.length)
      {
        spotlightColumnNames.push(columnNames[0]);
        spotlightContainersTypesValues.push(Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElement);
        spotlightContainersTypesLabels.push(Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElementLabel);
        columnNames.splice(0, 1);
        stackedColumnNames = columnNames; 
      }
      for (var i = 0; i < stackedColumnNames.length; i++)
      {
        stackedContainersTypesValues.push(Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElement);
        stackedContainersTypesLabels.push(Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElementLabel);
      }
    }
    else
    {
      var optObj = INSERT_OPTIONS_OBJ.getOptions();
      if (optObj)
      {
        if (optObj.spotlightColumns.length)
        {
          for (var i = 0; i < optObj.spotlightColumns.length; i++)
          {
            var colName = columnNames[optObj.spotlightColumns[i].columnIdx];
            spotlightColumnNames.push(colName);
            spotlightContainersTypesValues.push(optObj.spotlightColumns[i].containerElement);
            spotlightContainersTypesLabels.push("<" + optObj.spotlightColumns[i].containerElement + ">");
          }
        }
        if (optObj.stackedColumns.length)
        {
          for (var i = 0; i < optObj.stackedColumns.length; i++)
          {
            var colName = columnNames[optObj.stackedColumns[i].columnIdx];
            stackedColumnNames.push(colName);
            stackedContainersTypesValues.push(optObj.stackedColumns[i].containerElement);
            stackedContainersTypesLabels.push("<" + optObj.stackedColumns[i].containerElement + ">");
          }
        }
      }
    }
    if (!spotlightColumnNames.length || !stackedColumnNames.length)
    {
      alert(dw.loadString("spry/dataset/insert spotlight columns/alert/notEnoughColumns"));
    }
    else
    {
      var treeValues = new Array();
      var treeLabels = new Array();
      for (var i = 0; i < spotlightColumnNames.length; i++)
      {
        treeValues.push(spotlightColumnNames[i] + "|" + spotlightContainersTypesValues[i]);
        treeLabels.push(spotlightColumnNames[i] + "|" + spotlightContainersTypesLabels[i]);
      }
      _spotlightColumns.setAllRows(treeLabels, treeValues);

      treeValues = null;
      treeLabels = null;
      treeValues = new Array();
      treeLabels = new Array();
      for (var i = 0; i < stackedColumnNames.length; i++)
      {
        treeValues.push(stackedColumnNames[i] + "|" + stackedContainersTypesValues[i]);
        treeLabels.push(stackedColumnNames[i] + "|" + stackedContainersTypesLabels[i]);
      }
      _stackedColumns.setAllRows(treeLabels, treeValues);
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
//   controlName - string - the name of the control sending the event
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateUI(controlName)
{
  switch(controlName)
  {
      case "spotlightColumns":
      case "stackedColumns":
          var colType = "Spotlight";
          if (controlName == "stackedColumns")
          {
            colType = "Stacked";
          }
          var selRowValue = window["_" + colType.toLowerCase() + "Columns"].getRowValue();
          if (selRowValue)
          { 
            var arrValues = selRowValue.split("|");
            if (arrValues[1])
            {
              window["_containerType" + colType].pickValue(arrValues[1]);
            }
            else
            {
              // select default value
              window["_containerType" + colType].setIndex(0);
            }
          } 
          break;
      case "containerTypeSpotlight":
      case "containerTypeStacked":
          var colType = "Spotlight";
          if (controlName == "containerTypeStacked")
          {
            colType = "Stacked";
          }
          
          var selRowValue = window["_" + colType.toLowerCase() + "Columns"].getRowValue();
          var selRowLabel = window["_" + colType.toLowerCase() + "Columns"].getRow();
          if (selRowValue && selRowLabel)
          { 
            var arrValues = selRowValue.split("|");
            var arrLabels = selRowLabel.split("|");
            
            arrValues[1] = window["_containerType" + colType].getValue();
            selRowValue = arrValues.join("|");
            arrLabels[1] = window["_containerType" + colType].get();
            selRowLabel = arrLabels.join("|");
            window["_" + colType.toLowerCase() + "Columns"].setRow(selRowLabel);
            window["_" + colType.toLowerCase() + "Columns"].setRowValue(selRowValue);
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
//   columnType - string - column type wich can have "spotlightColumns" or "stackedColumns"
//                values that corresponds to spotlight columns grid, respectively 
//                stacked columns grid 
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onAddColumn(columnType)
{
  var columnsNames = getAvailableColumns(columnType);

  var colType = "spotlight";
  if (columnType == "stackedColumns")
  {
    colType = "stacked";
  }

  if (columnsNames.length)
  {
    var retObj = dwscripts.callCommand("Add Column.htm", columnsNames);
    
    if (retObj && retObj.length)
    {
      for (var i = 0; i < retObj.length; i++)
      {
        window["_" + colType + "Columns"].addRow(retObj[i] + "|" + Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElementLabel, retObj[i] + "|" + Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElement);          
      }
    }
  }
  else
  {
    alert(dw.loadString("spry/dataset/insert spotlight columns/alert/noColumnsToAdd"));
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
//   columnType - string - column type wich can have "spotlightColumns" or "stackedColumns"
//                values that corresponds to spotlight columns grid, respectively 
//                stacked columns grid 
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onRemoveColumn(columnType)
{
  var colType = "spotlight";
  if (columnType == "stackedColumns")
  {
    colType = "stacked";
  }

  if (window["_" + colType + "Columns"].getRowLen() > 1)
  {
    window["_" + colType + "Columns"].delRow();                 
  }
  else
  {
    var errStr = dw.loadString("spry/dataset/insert spotlight column/alert/atLeastOneColumn"); 
    alert(errStr.replace(/\\n/g, "\n"));
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
//   columnType - string - column type wich can have "spotlightColumns" or "stackedColumns"
//                values that corresponds to spotlight columns grid, respectively 
//                stacked columns grid 
//
// RETURNS:
//   (array) - list of column names that exists in the data set design time object but doesn't exist 
//          in the grid associated with the columnType parameter
//--------------------------------------------------------------------
function getAvailableColumns(columnType)
{
  var chosenColumns = new Array();
  var dsColumns = DS_DESIGN_TIME_OBJ.getColumnNames();
  
  var colType = "spotlight";
  if (columnType == "stackedColumns")
  {
    colType = "stacked";
  }

  var columnsList = window["_" + colType + "Columns"].getRowValue('all');

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
