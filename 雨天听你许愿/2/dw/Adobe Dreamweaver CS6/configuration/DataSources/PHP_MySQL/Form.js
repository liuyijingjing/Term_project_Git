// Copyright 2002, 2003 Macromedia, Inc. All rights reserved.


//************** GLOBALS VARS *****************

var FORM_FILENAME = "REQ_D.gif"; 
var DATASOURCELEAF_FILENAME = "DSL_D.gif"; 


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
  MM.retVal = "";
  MM.FormContents = "";
  dw.popupCommand("Form Variable");

  if (MM.retVal == "OK")
  {
    var theResponse = MM.FormContents;

    if (theResponse.length)
    {
      var siteURL = dw.getSiteRoot();
      if (siteURL.length)
      {
        dwscripts.addListValueToNote(siteURL, "Form", theResponse);   
      }
      else
      {
        alert(MM.MSG_DefineSite);
      }
    }
    else 
    {
      alert(MM.MSG_DefineForm);
    }
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

  var siteURL = dw.getSiteRoot()

  if (siteURL.length)
  {
    var bindingsArray = dwscripts.getListValuesFromNote(siteURL, "Form");
    if (bindingsArray.length > 0)
    {
      retList.push(new DataSource(MM.LABEL_Form, 
                                  FORM_FILENAME, 
                                  false, 
                                  "Form.htm"))
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

  var siteURL = dw.getSiteRoot();

  //For localized object name
  if (sourceName != "Form")
  {
    sourceName = "Form";
  }

  if (siteURL.length)
  {
    var bindingsArray = dwscripts.getListValuesFromNote(siteURL, sourceName);
    retVal = getDataSourceBindingList(bindingsArray, 
                                      DATASOURCELEAF_FILENAME,
                                      true,
                                      "Form.htm");

    // Add the variable names to a code hints menu
    dw.codeHints.resetMenu("CodeHints_Object_Methods", "$_POST['", "PHP_MySQL");
    dw.codeHints.resetMenu("CodeHints_Object_Methods", "$_REQUEST['", "PHP_MySQL");
    if (bindingsArray.length > 0)
    {
      dw.codeHints.addMenu("CodeHints_Object_Methods","$_POST['",
        bindingsArray, bindingsArray, "shared/mm/images/hintMisc.gif", 
        "PHP_MySQL");
      dw.codeHints.addMenu("CodeHints_Object_Methods","$_REQUEST['",
        bindingsArray, bindingsArray, "shared/mm/images/hintMisc.gif", 
        "PHP_MySQL");
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

function generateDynamicDataRef(sourceName, bindingName, dropObject)
{
  var paramObj = new Object();
  paramObj.bindingName = bindingName;
  var retStr = extPart.getInsertString("", "Form_DataRef", paramObj);

  if (dwscripts.canStripScriptDelimiters(dropObject, true))
  {
    retStr = dwscripts.stripScriptDelimiters(retStr, true);
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

  if(expression.length)
  {
    var params = extPart.findInString("Form_DataRef", expression);
    if (params)
    {
      retArray[0] = "Form";
      retArray[1] = params.bindingName;
    }
  }
    
  return retArray;
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
  var siteURL = dw.getSiteRoot();
      
  if (siteURL.length)
  {
    //For localized object name
    if (sourceName != "Form")
    {
      sourceName = "Form";
    }

    dwscripts.deleteListValueFromNote(siteURL, sourceName, bindingName);
  }
}
