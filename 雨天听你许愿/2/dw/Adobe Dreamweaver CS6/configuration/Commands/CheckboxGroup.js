// Copyright 2008 Adobe Macromedia Software LLC and its licensors. All rights reserved.

var HELP_DOC = MM.HELP_CheckboxGroup;

var GC_CHECKBOXES     = new GridControl("LabelValuePairs");
var TF_GROUP_NAME = new TextField("","GroupName");
var RG_LAYOUT     = new RadioGroup("Layout");

var PREF_SECTION         = "Extensions\\Objects\\Checkbox Group";
var PREF_KEY_LAYOUT      = "Layout Type Index";
var PREF_DEFAULT_LAYOUT  = 0;

//--------------------------------------------------------------------
// FUNCTION:
//   displayHelp
//
// DESCRIPTION:
//   called when the user clicks the Help button. in this implementation,

//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function displayHelp()
{
   // Replace the following call if you are modifying this file for your own use.
   dwscripts.displayDWHelp(HELP_DOC);
}

//--------------------------------------------------------------------
// FUNCTION:
//   commandButtons
//
// DESCRIPTION:
//   dialog button control
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function commandButtons()
{
  return new Array(MM.BTN_OK,"clickedOK()",
                   MM.BTN_Cancel,"window.close()",
                   MM.BTN_Help,"displayHelp()");
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedOK
//
// DESCRIPTION:
//   called when the user clicks OK, manages checkbox group insertion and error messages
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function clickedOK()
{
  var labelValueArr = GC_CHECKBOXES.getAll();
  var ckboxGroupName = TF_GROUP_NAME.getValue();
  var canApplyMsg = "";
  
  canApplyMsg = checkForLabelsAndValues(labelValueArr);
  
  if (!canApplyMsg && !ckboxGroupName)
    canApplyMsg = dw.loadString("Commands/CheckboxGroup/NeedACheckboxGroupName");
  else
    ckboxGroupName = dwscripts.entityNameEncode(ckboxGroupName);
  
  if (canApplyMsg)
  {
    alert(canApplyMsg);
    return;
  }
  
  var isTable = RG_LAYOUT.getSelectedIndex() == 1;
  
  // Do not allow the checked attribute to be set from the form object version
  //   of the checkbox group.
  var selectValueEqualTo = ""; 
  var insertionStr = createCheckboxGroupString(ckboxGroupName,isTable,selectValueEqualTo,labelValueArr);

  savePreferences(); // save layout choice, i.e. line break or table

  dw.getDocumentDOM().insertHTML(returnFormTag(insertionStr),false);
  window.close();

}


//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   prepare the dialog for user feedback
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function initializeUI()
{
  TF_GROUP_NAME.initializeUI();

  var ckboxLabel = dw.loadString("Commands/CheckboxGroup/Checkbox");
  var ckboxValue = ckboxLabel.toLowerCase();
  
  var displayArr = new Array(new Array(ckboxLabel,ckboxValue),
                             new Array(ckboxLabel,ckboxValue)
                            );

  GC_CHECKBOXES.setAll(displayArr);

  // generate unique checkbox group name, i.e.: "CheckboxGroup1"
  TF_GROUP_NAME.setValue( generateCheckboxGroupName() );
  
  // set layout type to previous choice
  RG_LAYOUT.setSelectedIndex( getPreference(PREF_KEY_LAYOUT) );

  TF_GROUP_NAME.textControl.focus();  // set focus to checkbox group name
  TF_GROUP_NAME.textControl.select(); // select current group name

}


//--------------------------------------------------------------------
// FUNCTION:
//   updateUI
//
// DESCRIPTION:
//   update the UI based on user feedback.
//
// ARGUMENTS:
//   theArg -- label for element or elements to update
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateUI(theArg)
{
  // if user clicks the "-" button, delete the currently selected item
  if (theArg == "deleteButton")
  {
    GC_CHECKBOXES.del();
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   generateCheckboxGroupName
//
// DESCRIPTION:
//   generate unique checkbox group name
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   unique name
//--------------------------------------------------------------------
function generateCheckboxGroupName()
{
  var baseName = dw.loadString("Commands/CheckboxGroup/CheckboxGroupDefaultName");
  return dwscripts.getUniqueNameForTag("INPUT",baseName);
}



//--------------------------------------------------------------------
// FUNCTION:
//   createCheckboxGroupString
//
// DESCRIPTION:
//   create the text string to insert into the document
//
// ARGUMENTS:
//   groupName (string), isTable (boolean), selectValueEqualTo (string), labelValueArr(array)
//
// RETURNS:
//   string to insert into the document
//--------------------------------------------------------------------
function createCheckboxGroupString(groupName,isTable,selectValueEqualTo,labelValueArr)
{
  // labelValueArr is n items long, where n equal the number of checkboxes.
  // Each nth item is an array in which [0] is the label and [1] is the value
  
  // Create a third item in the array that contains the checked string or
  // an empty string if there is no checked string
  addCheckedInformation(labelValueArr,selectValueEqualTo);

  var nItems = labelValueArr.length;
  var i;
  var insertionStr = "";
  var paramObj = new Object();
  paramObj.CheckboxName = groupName;
  paramObj.CheckboxId = dwscripts.stripInvalidIDChars(groupName) + "_";

  for (i=0;i<nItems;i++)
  {
    paramObj.CheckboxLabel = labelValueArr[i][0];
    paramObj.CheckboxValue = labelValueArr[i][1];
    paramObj.CheckedAttribute = labelValueArr[i][2];
    paramObj.Checkbox = getCheckboxString(paramObj,i);

    insertionStr += (isTable) ? getTableRowString(paramObj):
                                getLineBreakString(paramObj);
  }

  return ( addOuterTag(insertionStr,isTable) );
}



//--------------------------------------------------------------------
// FUNCTION:
//   addCheckedInformation
//
// DESCRIPTION:
//   adds the checked attribute as a third item in the multi-dimensional array
//   determines the correct type of checked attribute (static or dynamic), and
//   builds up the correct string for either case
//
// ARGUMENTS:
//   labelValueArr (multi-dimensional array),selectValueEqualTo (string)
//
// RETURNS:
//   nothing -- the multi-dimensional array is passed by reference
//--------------------------------------------------------------------
function addCheckedInformation(labelValueArr,selectValueEqualTo)
{
  var nItems = labelValueArr.length;
  var i;

  for (i=0; i<nItems; i++)
  {
    labelValueArr[i][2] = "";
  }  
}


//--------------------------------------------------------------------
// FUNCTION:
//   addOuterTag
//
// DESCRIPTION:
//   adds table or p tags around current string, based on user preference
//
// ARGUMENTS:
//   theStr -- string to wrap outer tag around
//   isTable -- boolean -- if false, it is assumed that layout is line breaks
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function addOuterTag(theStr,isTable)
{
  return (isTable)?'<table width="200">' + theStr + '</table>':
                   '<p>'                 + theStr + '</p>';

}


//--------------------------------------------------------------------
// FUNCTION:
//   getPreference
//
// DESCRIPTION:
//   gets the layout type from the previous time the checkbox group was applied.
//   the layout type is "sticky" and remembered from access to access
//
// ARGUMENTS:
//   name of key to get
//
// RETURNS:
//   the last chosen preference, uses default value if no preference on record
//--------------------------------------------------------------------
function getPreference(whichKey)
{
  var retVal = "";

  if (whichKey == PREF_KEY_LAYOUT)
  {
    retVal = dw.getPreferenceString(PREF_SECTION,PREF_KEY_LAYOUT,PREF_DEFAULT_LAYOUT);
  }

  return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   savePreferences
//
// DESCRIPTION:
//   save user layout preference
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function savePreferences()
{
  dw.setPreferenceString(PREF_SECTION,PREF_KEY_LAYOUT,RG_LAYOUT.getSelectedIndex());
}



//--------------------------------------------------------------------
// FUNCTION:
//   getCheckboxString
//
// DESCRIPTION:
//   get the string which represents one checkbox 
//
// ARGUMENTS:
//   paramObj -- object with name/value properties
//
// RETURNS:
//   string which represents one html element checkbox
//--------------------------------------------------------------------
function getCheckboxString(paramObj,itemNum)
{
  var ckboxStr = '<input type="checkbox" name="@@CheckboxName@@" value="@@CheckboxValue@@" id="@@CheckboxId@@">';


  ckboxStr = ckboxStr.replace(/@@CheckboxName@@/,paramObj.CheckboxName);
  ckboxStr = ckboxStr.replace(/@@CheckboxValue@@/,paramObj.CheckboxValue);
  ckboxStr = ckboxStr.replace(/@@CheckboxId@@/,paramObj.CheckboxId + itemNum);

  if (paramObj.CheckedAttribute)
  {
    ckboxStr = ckboxStr.substring(0,ckboxStr.length-1) + " " + paramObj.CheckedAttribute + ">";
  }
  return ckboxStr;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getTableRowString
//
// DESCRIPTION:
//   get the string which represents one table row
//   used only when layout type is set to "Table"
//
// ARGUMENTS:
//   paramObj -- object with name/value properties
//
// RETURNS:
//   string which represents one html table row
//--------------------------------------------------------------------
function getTableRowString(paramObj)
{
  var rowStr =  "<tr><td><label>@@Checkbox@@@@CheckboxLabel@@</label></td></tr>";

  rowStr = rowStr.replace(/@@Checkbox@@/,paramObj.Checkbox);
  rowStr = rowStr.replace(/@@CheckboxLabel@@/,paramObj.CheckboxLabel);

  return rowStr;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getLineBreakString
//
// DESCRIPTION:
//   get the string which represents the checkbox and its label
//   used only when layout type is set to "Line Breaks"
//
// ARGUMENTS:
//   paramObj -- object with name/value properties
//
// RETURNS:
//   string which represents checkbox and associated label
//--------------------------------------------------------------------
function getLineBreakString(paramObj)
{
  var textStr = "<label>@@Checkbox@@ @@CheckboxLabel@@</label><br>";

  textStr = textStr.replace(/@@Checkbox@@/,paramObj.Checkbox);
  textStr = textStr.replace(/@@CheckboxLabel@@/,paramObj.CheckboxLabel);

  return textStr;

}


//--------------------------------------------------------------------
// FUNCTION:
//   checkForLabelsAndValues
//
// DESCRIPTION:
//   checks a multi-dimensional array to verify its contents
//   verifies that there is at least one item, and that all items are complete
//
// ARGUMENTS:
//   theArr - multi-dimensional array
//
// RETURNS:
//   empty string if everything is fine, and error message string if it is not
//--------------------------------------------------------------------
// returns empty string if valid, and error message if not valid
function checkForLabelsAndValues(theArr)
{
  var retVal = "";
  var nItems = theArr.length;
  var i;
  
  if (!nItems || nItems == 0)
  {
    retVal = MM.MSG_NeedAtLeastOneButton;
  }
  
  if (!retVal)
  {
    for (i=0;i<nItems;i++)
    {
      if (theArr[i][0] == "" || theArr[i][1] == "")
      {
        retVal = MM.MSG_EnterLabelAndValue;
        break;
      }
    }
  }
  
  return retVal;
}
