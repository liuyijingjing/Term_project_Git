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


//************** GLOBALS VARS *****************
var SPRY_DATASET_IMG_FILENAME = "SpryDataSet.gif";
var SPRY_DATAFIELD_IMG_FILENAME = "DSL_D.gif";
var SPRY_ERROR_IMG_FILENAME = "../../Shared/MM/Images/stop.gif";
var SPRY_BUILTIN_REFERENCE_IMG_FILENAME = "hintSpryDataSet.gif";

//****************** API **********************

//--------------------------------------------------------------------
// FUNCTION:
//   addDynamicSource
//
// DESCRIPTION:
//   Adds a Dynamic Source to the Data Bindings panel
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function addDynamicSource()
{
	//launch the ajax data set
	var cmdArgs = new Array();

	//fix for bug 221267
	var bCanInsert = ajaxUtils.canInsertSpryDataSets();
	if (bCanInsert)
	{
		dwscripts.callCommand("SpryDataSetWizard",cmdArgs);
	}
}


//--------------------------------------------------------------------
// FUNCTION:
//   findDynamicSources
//
// DESCRIPTION:
//   Returns a list of Dynamic Sources on the page
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   JavaScript Array of Objects
//--------------------------------------------------------------------

function findDynamicSources()
{
	var retList = new Array();
	var dom = dw.getDocumentDOM();
	
	if (dom)
	{
  	var dsManager = Spry.DesignTime.DataSets.Manager.getManagerForDocument(dom);
  	if (dsManager)
  	{
      retList = dsManager.findAllDataSets()
    }
	}

  return retList;
}


//--------------------------------------------------------------------
// FUNCTION:
//   generateDynamicSourceBindings
//
// DESCRIPTION:
//   Returns a list of bindings for the given elementName on the page.
//
// ARGUMENTS:
//   sourceName - string - the name returned from the findDynamicSources
//     function
//
// RETURNS:
//   JavaScript Array of Objects
//--------------------------------------------------------------------

function generateDynamicSourceBindings(sourceName)
{
	var retVal = new Array();
	var dom = dw.getDocumentDOM();
 	var dsManager = Spry.DesignTime.DataSets.Manager.getManagerForDocument(dom);
	var dsObj = dsManager.getDataSet(sourceName);
	
	if (dsObj)
	{
	  var errMsg = dsObj.getLastErrorMessage();
	  if (!errMsg)
	  {
  		var columnNames = dsObj.getColumnNames();
      
      if (columnNames && columnNames.length)
      {
        for (var i=0; i < columnNames.length; i++)
        {
        	var colType = dsObj.getColumnType(columnNames[i]);
        	var dsBinding = new DataSourceBinding(columnNames[i],SPRY_DATAFIELD_IMG_FILENAME,false,"SpryDataSet.htm", columnNames[i], colType);
        	retVal.push(dsBinding);
        }
        //add the builtin tokens
        for (var i=0; i < Spry.DesignTime.DataSets.Manager.builtInTokens.length; i++)
        {
        	var aDSBinding = new DataSourceBinding(Spry.DesignTime.DataSets.Manager.builtInTokens[i], 
                                      SPRY_BUILTIN_REFERENCE_IMG_FILENAME,
                                      false,
                                      "SpryDataSet.htm",
                                      Spry.DesignTime.DataSets.Manager.builtInTokens[i]);
        	retVal.push(aDSBinding);
        }
    	}
    	else
    	{
  		  errMsg = "MM_ERROR: " + dw.loadString("spry/dataset/designtime/message/dsHasNoData");
  			var aDSBinding = new DataSourceBinding(errMsg, SPRY_ERROR_IMG_FILENAME, false, "SpryDataSet.htm");
  			retVal.push(aDSBinding);
      }
    }
  	else
  	{
 	    // remove new lines 
      errMsg = "MM_ERROR: " + errMsg.replace(/\n/g, "");
			var aDSBinding = new DataSourceBinding(errMsg, SPRY_ERROR_IMG_FILENAME, false, "SpryDataSet.htm");
			retVal.push(aDSBinding);
    }
  }

  return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   generateDynamicDataRef
//
// DESCRIPTION:
//   Returns a dynamic binding string.
//
// ARGUMENTS:
//   sourceName - string - the name of the dynamic source returned
//     from the findDynamicSources function
//   bindingName - string - the name of a dynamic source binding returned
//     from generateDynamicSourceBindings
//
// RETURNS:
//   string - the code to insert on the page
//--------------------------------------------------------------------

function generateDynamicDataRef(sourceName, bindingName, dropObject, colType)
{
  var retStr = "";
  
  if (sourceName && sourceName.length)
  {
    if (!bindingName || bindingName.length == 0)
    {
      if (dropObject != null)
      {
        var theDOM = dw.getDocumentDOM();
        
        // set selection to the dropObject
        theDOM.setSelection(dropObject.startoffset, dropObject.endoffset);
        
        if (theDOM.getAttachedTemplate())
        {
          var editableRegions = theDOM.body.getElementsByTagName("MMTInstance:Editable");
          
          if (!editableRegions.length)
          {
            alert(dw.loadString("spry/dataset/wizard/alert/DragDropNoEditableRegion").replace(/\\n/g, "\n"));
            return theDOM.source.getText(dropObject.startoffset, dropObject.endoffset);
          }
        }
        if (!dwscripts.selectionIsInBody())
        {
          alert(dw.loadString("spry/dataset/wizard/alert/DragDropIPInsideBodyTag").replace(/\\n/g, "\n"));
          return theDOM.source.getText(dropObject.startoffset, dropObject.endoffset);
        }
        if (Spry.DesignTime.DataSet.selectionIsInsideSpryRegion(dropObject))
        {
          alert(dw.loadString("spry/dataset/wizard/alert/cantInsertInsideSpryRegion").replace(/\\n/g, "\n"));
          return theDOM.source.getText(dropObject.startoffset, dropObject.endoffset);
        }

        var cmdArgs = new Object();
       	var dsManager = Spry.DesignTime.DataSets.Manager.getManagerForDocument(theDOM);
        
  		  cmdArgs.designTimeObject = dsManager.inspectDataSet(sourceName);
        cmdArgs.insertStructure = true;
        // insert a Spry structure
        retStr = dwscripts.callCommand("SpryDataSetWizard", cmdArgs);
        if (retStr == null)
        {
          return theDOM.source.getText(dropObject.startoffset, dropObject.endoffset);
        }
      }
      else
      {
        retStr = true;
      }
    }
    else
    {
      retStr = "{" + sourceName + "::" + bindingName + "}";
    }
  }

  return retStr;
}


//--------------------------------------------------------------------
// FUNCTION:
//   inspectDynamicDataRef
//
// DESCRIPTION:
//   Inspects a dynamic binding string and returns a pair of 
//   source and binding values.
//
// ARGUMENTS:
//   expression - string - the dynamic binding expression to be
//     inspected
//
// RETURNS:
//   JavaScript Array of strings - an array of length 2, with the first
//   value being the sourceName, and the second being the bindingName
//--------------------------------------------------------------------

function inspectDynamicDataRef(expression)
{
  var retArray = new Array();
  
  return retArray;
}


//*-------------------------------------------------------------------
// FUNCTION:
//   editDynamicSource
//
// DESCRIPTION:
//   edits a dynamic source from the document.
//
// ARGUMENTS:
//   sourceName - a data source name
//   bindingName - one of the bindings for that data source
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function editDynamicSource(sourceName, bindingName)
{
	var dom = dw.getDocumentDOM();
	if ((sourceName.length) && (bindingName.length == 0))
	{
  	var dsManager = Spry.DesignTime.DataSets.Manager.getManagerForDocument(dom);
    var cmdArgs = new Object();
    
	  cmdArgs.designTimeObject = dsManager.inspectDataSet(sourceName);
		dwscripts.callCommand("SpryDataSetWizard", cmdArgs);
	}
}



//--------------------------------------------------------------------
// FUNCTION:
//   deleteDynamicSource
//
// DESCRIPTION:
//   Deletes a dynamic source from the document.
//
// ARGUMENTS:
//   sourceName - string - the name of the dynamic source returned
//     from the findDynamicSources function
//   bindingName - string - the name of a dynamic source binding returned
//     from generateDynamicSourceBindings
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function deleteDynamicSource(sourceName, bindingName)
{
  var dom = dw.getDocumentDOM();

  if ((sourceName.length) && (bindingName.length == 0))
  {
    var dsManager = Spry.DesignTime.DataSets.Manager.getManagerForDocument(dom);
    dsManager.deleteDataSet(sourceName);
  }
}
