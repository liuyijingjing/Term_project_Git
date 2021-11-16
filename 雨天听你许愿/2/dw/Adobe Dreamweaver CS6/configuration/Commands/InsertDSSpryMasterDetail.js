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

var helpDoc = MM.HELP_objSpryMasterDetail;

// Controls
var _masterColumns = new ListControl("masterColumns");
var _detailColumns = new TreeControlWithNavControls("detailColumns");
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
//  This function constructs the insert option object and returns it to
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
  
  var masterColNames = _masterColumns.getValue("all");
  var detailColsNo = _detailColumns.getRowLen();
  
  if (masterColNames.length)
  {
    if (masterColNames && masterColNames.length)
    {
      optObj.masterColumns = new Array(); 
      for (var i = 0; i < masterColNames.length; i++)
      {
        var colIdx = DS_DESIGN_TIME_OBJ.getColumnIndex(masterColNames[i]); 
        optObj.masterColumns.push({columnName: masterColNames[i], columnIdx: colIdx});
      }
    }
    if (detailColsNo)
    { 
      optObj.detailColumns = new Array();
      for (var i = 0; i < detailColsNo; i++)
      {
        var rowValue = _detailColumns.getRowValue(i);
        
        if(rowValue)
        {
          var arrValues = rowValue.split("|");
          var colIdx = DS_DESIGN_TIME_OBJ.getColumnIndex(arrValues[0]);
          optObj.detailColumns.push({columnName: arrValues[0], columnIdx: colIdx, containerElement: arrValues[1]});    
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
  var masterColumnNames = new Array();
  var detailColumnNames = new Array();
  var detailContainersTypesValues = new Array();
  var detailContainersTypesLabels = new Array();
  var defaultColOptions = true;
   
  _containerType.init();
  // set the default container for detail columns from the HTML by getting the selected option from 
  // the containerType

  DS_DESIGN_TIME_OBJ = DS_DESIGN_TIME_ARG;
  if (DS_DESIGN_TIME_OBJ)
  {
    if (INSERT_OPTIONS_ARG)
    {
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
      INSERT_OPTIONS_OBJ = new Spry.DesignTime.DataSet.InsertStructure(Spry.DesignTime.DataSet.InsertStructure.MasterDetail); 
    }
    
    if (defaultColOptions)
    {
      var columnNames = DS_DESIGN_TIME_OBJ.getColumnNames();
      if (columnNames.length)
      {
       masterColumnNames.push(columnNames[0]);
       columnNames.splice(0, 1);
       detailColumnNames = columnNames; 
      }
      for (var i = 0; i <  detailColumnNames.length; i++)
      {
        detailContainersTypesValues[i] = Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElement;
        detailContainersTypesLabels[i] = Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElementLabel;
      }
    }
    else
    {
      var optObj = INSERT_OPTIONS_OBJ.getOptions();
      var columnNames = DS_DESIGN_TIME_OBJ.getColumnNames();
      
      if (optObj)
      {
        // set master column names
        if (optObj.masterColumns && optObj.masterColumns.length)
        {
          // update column names in case they were modified
          for(var i = 0; i < optObj.masterColumns.length; i++)
          {
            masterColumnNames.push(columnNames[optObj.masterColumns[i].columnIdx]);
          }
        }
        // set detail column names
        if (optObj.detailColumns.length)
        {
          for (var i = 0; i < optObj.detailColumns.length; i++)
          {
            detailColumnNames.push(columnNames[optObj.detailColumns[i].columnIdx]);
            detailContainersTypesValues.push(optObj.detailColumns[i].containerElement);
            detailContainersTypesLabels.push("<" + optObj.detailColumns[i].containerElement + ">");
          }
        }
      }
    }
    if (!masterColumnNames.length || !detailColumnNames.length)
    {
      alert(dw.loadString("spry/dataset/insert master-detail/alert/notEnoughColumns"));
    }
    else
    {
      _masterColumns.setAll(masterColumnNames, masterColumnNames);
      var detailTreeValues = new Array();
      var detailTreeLabels = new Array();
      for (var i = 0; i < detailColumnNames.length; i++)
      {
        detailTreeValues.push(detailColumnNames[i] + "|" + detailContainersTypesValues[i]);
        detailTreeLabels.push(detailColumnNames[i] + "|" + detailContainersTypesLabels[i]);
      }
      _detailColumns.setAllRows(detailTreeLabels, detailTreeValues);
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
      case "detailColumns":
          var selRowValue = _detailColumns.getRowValue();
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
          var selRowValue = _detailColumns.getRowValue();
          var selRowLabel = _detailColumns.getRow();
          if (selRowValue && selRowLabel)
          { 
            var arrValues = selRowValue.split("|");
            var arrLabels = selRowLabel.split("|");
            
            arrValues[1] = _containerType.getValue();
            selRowValue = arrValues.join("|");
            arrLabels[1] = _containerType.get();
            selRowLabel = arrLabels.join("|");
            _detailColumns.setRow(selRowLabel);
            _detailColumns.setRowValue(selRowValue);
          }
          break;
      case "moveUpMasterColumn":
          var selIndex = _masterColumns.getIndex(); 
          if (selIndex > 0)
          {
            // switch columns
            var tmpValue = _masterColumns.getValue(selIndex - 1);
            var selValue =  _masterColumns.getValue(selIndex);
            _masterColumns.set(selValue, selIndex - 1);
            _masterColumns.setValue(selValue, selIndex - 1);
            _masterColumns.set(tmpValue, selIndex);
            _masterColumns.setValue(tmpValue, selIndex);
            _masterColumns.setIndex(selIndex - 1);
          }
          break;
      case "moveDownMasterColumn":
          var selIndex = _masterColumns.getIndex(); 
          if (selIndex != -1 && selIndex < (_masterColumns.getLen() - 1))
          {
            // switch columns
            var tmpValue = _masterColumns.getValue(selIndex + 1);
            var selValue =  _masterColumns.getValue(selIndex);
            _masterColumns.set(selValue, selIndex + 1);
            _masterColumns.setValue(selValue, selIndex + 1);
            _masterColumns.set(tmpValue, selIndex);
            _masterColumns.setValue(tmpValue, selIndex);
            _masterColumns.setIndex(selIndex + 1);
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
//   columnType - string - column type wich can have "masterColumn" or "masterDetail"
//                values that corresponds to master columns grid, respectively 
//                detail columns grid 
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onAddColumn(columnType)
{
  var columnNames = getAvailableColumns(columnType);

  if (columnNames.length)
  {
    var retObj = dwscripts.callCommand("Add Column.htm", columnNames);
    
    if (retObj && retObj.length)
    {
      if (columnType == "masterColumns")
      {
        for (var i = 0; i < retObj.length; i++)
        {
          _masterColumns.add(retObj[i], retObj[i]);
        }
      }
      else  // detail columns
      {
        for (var i = 0; i < retObj.length; i++)
        {
          _detailColumns.addRow(retObj[i] + "|" + Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElementLabel, retObj[i] + "|" + Spry.DesignTime.DataSet.InsertStructure.DefaultContainerElement);          
        }
      }
    }
  }
  else
  {
    alert(dw.loadString("spry/dataset/insert master-detail/alert/noColumnsToAdd"));
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
//   columnType - string - column type wich can have "masterColumn" or "masterDetail"
//                values that corresponds to master columns grid, respectively 
//                detail columns grid 
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onRemoveColumn(columnType)
{
  if (columnType == "masterColumns")
  {
    if (_masterColumns.getLen() > 1)
    {
      _masterColumns.del();                 
    }
    else
    {
      var errStr = dw.loadString("spry/dataset/insert master-detail/alert/atLeastAMasterColumn"); 
      alert(errStr.replace(/\\n/g, "\n"));
    }
  }
  else
  {
    if (_detailColumns.getRowLen() > 1)
    {
      var rowValue = _detailColumns.getRowValue();
      if (rowValue)
      {
        _detailColumns.delRow(); 
      }  
    }
    else
    {
      var errStr = dw.loadString("spry/dataset/insert master-detail/alert/atLeastADetailColumn"); 
      alert(errStr.replace(/\\n/g, "\n"));
    }
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
//   columnType - string - column type wich can have "masterColumn" or "masterDetail"
//                values that corresponds to master columns grid, respectively 
//                detail columns grid 
//
// RETURNS:
//   (array) - list of column names that exists in the data set design time object but doesn't exist 
//          in the grid associated with the columnType parameter
//--------------------------------------------------------------------
function getAvailableColumns(columnType)
{
  var chosenColumns = new Array();
  var dsColumns = DS_DESIGN_TIME_OBJ.getColumnNames();
  
  if (columnType == "masterColumns")
  {
    chosenColumns = _masterColumns.getValue('all');
  }
  else
  {
    // detail columns
    var columnsList = _detailColumns.getRowValue('all');

    if (columnsList && columnsList.length)
    {
      // construct the column names array
      for (var i = 0; i < columnsList.length; i++)
      {
        var rowValue = columnsList[i].split("|");
        chosenColumns.push(rowValue[0]);
      }
    }
  }

  return Spry.DesignTime.DataSet.InsertStructure.getArrayDifference(chosenColumns, dsColumns);
}
