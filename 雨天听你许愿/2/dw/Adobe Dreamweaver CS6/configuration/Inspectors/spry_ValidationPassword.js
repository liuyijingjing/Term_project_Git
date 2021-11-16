// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piValidationPassword;
var widgetGuide = MM.HELP_piValidationPasswordGuide;

var WIDGET_ID;
var MESSAGE;
var REQUIRED;
var VALIDATE_BLUR;
var VALIDATE_CHANGE;
var DISPLAY_ERROR_STATE;
var MIN_CHARS;
var MAX_CHARS;
var MIN_ALPHA_CHARS;
var MAX_ALPHA_CHARS;
var MIN_NUMBERS;
var MAX_NUMBERS;
var MIN_UPPER_ALPHA_CHARS;
var MAX_UPPER_ALPHA_CHARS;
var MIN_SPECIAL_CHARS;
var MAX_SPECIAL_CHARS;


// ********************* API FUNCTIONS ***************************

//--------------------------------------------------------------------
// FUNCTION:
//   canInspectSelection
//
// DESCRIPTION:
//   This is a Property Inspector API function that gets called
//   whenever the selection in the document changes to decide whether
//   or not this property inspector should be displayed.
//
// ARGUMENTS:
//  None
//
// RETURNS:
//   true if the currently selected node is a TabbedPanels element,
//   false if it is not.
//--------------------------------------------------------------------

function canInspectSelection()
{
  var bCanInspectSelection = false;
  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode(true, false, true);

  var attr;

  if( selectedNode && selectedNode.getTranslatedAttribute )
  {
    attr = selectedNode.getTranslatedAttribute("Spry.Widget.ValidationPassword");
  }

  if( attr && attr.length > 0 )
  {
    bCanInspectSelection = true;

    //if the widget manager is out of sync, run the translator
    var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
    if( !widgetMgr.getWidget("Spry.Widget.ValidationPassword", selectedNode.id ) )
    {
      dom.runTranslator("Spry Widget");

      if( !widgetMgr.getWidget('Spry.Widget.ValidationPassword', selectedNode.id ) )
      {
        // Running the translator failed to create a design time object
        // for this widget. Either caInspectSelection() was called in the
        // middle of an edit operation, which prevents the translator from
        // running right now, or an error occurred during the translation.

        bCanInspectSelection = false;
      }
    }
  }

  return bCanInspectSelection; //comments in html file limit us to just one tag
}

//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   This is an internal utility function that searches through the
//   Property Inspector document to find all of the UI controls we
//   will programatically manipulate, and stores handles to them in
//   global variables which are used in some of the other functions
//   for this Property Inspector.
//
// ARGUMENTS:
//  None
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function initializeUI()
{
  WIDGET_ID = dwscripts.findDOMObject("idEditBox");
  if (WIDGET_ID) {
    WIDGET_ID.value = "";
  }
  MESSAGE = dwscripts.findDOMObject("message");
  if (MESSAGE) {
    MESSAGE.innerHTML = "";
  }

  REQUIRED = new CheckBox("", "required");
  REQUIRED.initializeUI();

  VALIDATE_BLUR = new CheckBox("", "validateBlur");
  VALIDATE_BLUR.initializeUI();

  VALIDATE_CHANGE = new CheckBox("", "validateChange");
  VALIDATE_CHANGE.initializeUI();

  if (!DISPLAY_ERROR_STATE) {
    DISPLAY_ERROR_STATE = new ListControl("displayErrorState");
    DISPLAY_ERROR_STATE.setAll([], []);
  }

  MIN_CHARS = new TextField("", "minChars");
  MIN_CHARS.initializeUI();

  MAX_CHARS = new TextField("", "maxChars");
  MAX_CHARS.initializeUI();

  MIN_ALPHA_CHARS = new TextField("", "minAlphaChars");
  MIN_ALPHA_CHARS.initializeUI();

  MAX_ALPHA_CHARS = new TextField("", "maxAlphaChars");
  MAX_ALPHA_CHARS.initializeUI();

  MIN_NUMBERS = new TextField("", "minNumbers");
  MIN_NUMBERS.initializeUI();

  MAX_NUMBERS = new TextField("", "maxNumbers");
  MAX_NUMBERS.initializeUI();

  MIN_UPPER_ALPHA_CHARS = new TextField("", "minUpperAlphaChars");
  MIN_UPPER_ALPHA_CHARS.initializeUI();

  MAX_UPPER_ALPHA_CHARS = new TextField("", "maxUpperAlphaChars");
  MAX_UPPER_ALPHA_CHARS.initializeUI();

  MIN_SPECIAL_CHARS = new TextField("", "minSpecialChars");
  MIN_SPECIAL_CHARS.initializeUI();

  MAX_SPECIAL_CHARS = new TextField("", "maxSpecialChars");
  MAX_SPECIAL_CHARS.initializeUI();
}

//--------------------------------------------------------------------
// FUNCTION:
//   inspectSelection
//
// DESCRIPTION:
//   This is a Property Inspector API function that gets called
//   whenever the selection in the document has changed and it has
//   been decided that this Property Inspector should be displayed.
//   This function syncs up the Property Inspector UI with the
//   widget's design-time object so that it accurately reflects
//   what is in the widget HTML markup and its JS constructor.
//
// ARGUMENTS:
//  None
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function inspectSelection()
{
  // Call initializeUI() here; it's how the global variables get
  // initialized. The onLoad event on the body tag is never triggered
  // in inspectors.
  initializeUI();

  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode(true, false, true);
  if (!canInspectSelection())
    return;

  var divId = selectedNode.id;
  // the ID
  WIDGET_ID.value = divId;

  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
  var widgetObj = widgetMgr.getWidget("Spry.Widget.ValidationPassword", divId );

  if( !widgetObj || !widgetObj.isValidStructure()  )
  {
    displayTopLayerErrorMessage(dw.loadString("spry/widget/alert/broken structure"));
    return;
  }
  else if (widgetObj.isDuplicateControl())
  {
    displayTopLayerErrorMessage(dw.loadString("spry/widget/alert/duplicate controls"));
    return;
  }

  clearTopLayerErrorMessage();

  widgetObj.refresh();

  // Inspect options

  // Check to see if the current selected state is valid
  var statesLabels = widgetObj.getStatesLabels();
  var statesValues = widgetObj.getStatesValues();
  var currentState = widgetObj.getDisplayedState();
  var currValues = DISPLAY_ERROR_STATE.getValue("all");
  var needUpdate = false;
  for (var i=0; i<statesValues.length; i++) {
    if (!currValues || (typeof(currValues[i]) != "string") || (statesValues[i] != currValues[i])) {
      needUpdate = true;
      break;
    }
  }
  if (needUpdate) {
    DISPLAY_ERROR_STATE.setAll(statesLabels, statesValues);
  }

  if (dwscripts.findInArray(statesValues, currentState) != -1)
  {
    DISPLAY_ERROR_STATE.pickValue(currentState);
  }
  else
  {
    DISPLAY_ERROR_STATE.pickValue("");
    widgetObj.setDisplayedState("");
  }

  var validateOn = widgetObj.getOption("validateOn", []);
  // Use this way to override a Dreamweaver bug: after using the first time a checkbox, the click on label doesn't work anymore
  VALIDATE_BLUR.checkBox.checked = (dwscripts.findInArray(validateOn, "blur") != -1);
  VALIDATE_CHANGE.checkBox.checked = (dwscripts.findInArray(validateOn, "change") != -1);

  MIN_CHARS.setValue(widgetObj.getOption("minChars", ""));
  MAX_CHARS.setValue(widgetObj.getOption("maxChars", ""));
  REQUIRED.checkBox.checked = (widgetObj.getOption("isRequired", true));

  MIN_ALPHA_CHARS.setValue(widgetObj.getOption("minAlphaChars", ""));
  MAX_ALPHA_CHARS.setValue(widgetObj.getOption("maxAlphaChars", ""));
  MIN_NUMBERS.setValue(widgetObj.getOption("minNumbers", ""));
  MAX_NUMBERS.setValue(widgetObj.getOption("maxNumbers", ""));
  MIN_UPPER_ALPHA_CHARS.setValue(widgetObj.getOption("minUpperAlphaChars", ""));
  MAX_UPPER_ALPHA_CHARS.setValue(widgetObj.getOption("maxUpperAlphaChars", ""));
  MIN_SPECIAL_CHARS.setValue(widgetObj.getOption("minSpecialChars", ""));
  MAX_SPECIAL_CHARS.setValue(widgetObj.getOption("maxSpecialChars", ""));
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateTag
//
// DESCRIPTION:
//   This function handles all of the user actions triggered by the
//   user from the Propery Inspector controls.
//
// ARGUMENTS:
//  attrib - string - The name of the action to perform.
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function updateTag(attrib)
{
  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode(true, false, true);
  if (!canInspectSelection())
    return;

  var divId = selectedNode.id;

  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
  var widgetObj = widgetMgr.getWidget("Spry.Widget.ValidationPassword", divId );
  if( !widgetObj )
    return;

  if (attrib)
  {
    switch (attrib)
    {
      case "displayErrorState":
      {
        widgetObj.setDisplayedState(DISPLAY_ERROR_STATE.getValue());
      }
      break;

      case "required":
      {
        if (widgetObj.setOption("isRequired", REQUIRED.getCheckedState(), true))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("required");
        }
      }
      break;

      case "validateBlur":
      case "validateChange":
      case "validateSubmit":
      {
        var validateOn = new Array();
        if (VALIDATE_BLUR.getCheckedState())
        {
          validateOn.push("blur");
        }
        if (VALIDATE_CHANGE.getCheckedState())
        {
          validateOn.push("change");
        }
        if (validateOn && validateOn.length == 0)
        {
          validateOn = undefined;
        }

        widgetObj.setOption("validateOn", validateOn);
        widgetObj.updateOptions();
        //widgetObj.updateErrorMessages();
      }
      break;

      case "minChars":
      {
        if (widgetObj.setOption("minChars", parseValue(MIN_CHARS.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("minChars");
        }
      }
      break;

      case "maxChars":
      {
        if (widgetObj.setOption("maxChars", parseValue(MAX_CHARS.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("maxChars");
        }
      }
      break;

      case "minAlphaChars":
      {
        if (widgetObj.setOption("minAlphaChars", parseValue(MIN_ALPHA_CHARS.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("invalidStrength");
        }
      }
      break;

      case "maxAlphaChars":
      {
        if (widgetObj.setOption("maxAlphaChars", parseValue(MAX_ALPHA_CHARS.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("invalidStrength");
        }
      }
      break;

      case "minNumbers":
      {
        if (widgetObj.setOption("minNumbers", parseValue(MIN_NUMBERS.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("invalidStrength");
        }
      }
      break;

      case "maxNumbers":
      {
        if (widgetObj.setOption("maxNumbers", parseValue(MAX_NUMBERS.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("invalidStrength");
        }
      }
      break;

      case "minUpperAlphaChars":
      {
        if (widgetObj.setOption("minUpperAlphaChars", parseValue(MIN_UPPER_ALPHA_CHARS.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("invalidStrength");
        }
      }
      break;

      case "maxUpperAlphaChars":
      {
        if (widgetObj.setOption("maxUpperAlphaChars", parseValue(MAX_UPPER_ALPHA_CHARS.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("invalidStrength");
        }
      }
      break;

      case "minSpecialChars":
      {
        if (widgetObj.setOption("minSpecialChars", parseValue(MIN_SPECIAL_CHARS.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("invalidStrength");
        }
      }
      break;

      case "maxSpecialChars":
      {
        if (widgetObj.setOption("maxSpecialChars", parseValue(MAX_SPECIAL_CHARS.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("invalidStrength");
        }
      }
      break;

      case "guide":
      {
        dwscripts.displayDWHelp(widgetGuide);
      }
      break;

      case "id":
      {
        //validate the new id
        var newId = WIDGET_ID.value;
        if( newId == divId )
          return; //nothing to change

        if( newId.length == 0 )
        {
          alert(dw.loadString("spry/widget/alert/need unique id"));
          return;
        }

        if( dom.getElementById(newId) )
        {
          alert(dw.loadString("spry/widget/alert/id already exists"));
          return;
        }

        if( !dwscripts.isValidID(newId) )
        {
          alert(dw.loadString("spry/widget/alert/id is invalid"));
          return;
        }

        //new ID looks change the constructor
        widgetObj.updateId(newId);
        //update the WidgetManager for the new ID
        widgetMgr.setWidget("Spry.Widget.ValidationPassword", newId, widgetObj );
        //don't delete the widget incase this gets undone, we'll find the old one
        //widgetMgr.deleteWidget("Spry.Widget.ValidationPassword", divId);
        dom.runTranslator("Spry Widget");
      }
      break;
    }
  }

  // All these edits modify the widget. We need to recreate the JS Object to reflect those changes
  widgetObj.refresh();

  if( selectedNode.tagName == "TR" || selectedNode.tagName == "TD" )
  {
    dom.setSelectedNode(selectedNode);
  }
  else
  {
    // Make sure selection stays on the container tag
    var tmpOffsets = dom.nodeToOffsets(selectedNode);
    if( tmpOffsets )
    {
      dom.setSelection(tmpOffsets[0], tmpOffsets[1]);
    }
  }

  inspectSelection();
}

// ********************* UTILITY FUNCTIONS ***************************

//--------------------------------------------------------------------
// FUNCTION:
//   getUIProperties
//
// DESCRIPTION:
//   This function returns the availability of various controls from the UI according
//   to the current widget configuration.
//
// ARGUMENTS:
//   widgetObj - object - widget's design time object
//
// RETURNS:
//   An object with boolean options for exiting properties.
//--------------------------------------------------------------------

function getUIProperties(widgetObj)
{
  var props = new Object();

  props.minMaxCharsEnabled = widgetObj.checkStateAvailability("minChars", true);
  props.invalidStrengthEnabled = widgetObj.checkStateAvailability("minAlphaChars", true) ||
                                  widgetObj.checkStateAvailability("minNumbers", true) ||
                                  widgetObj.checkStateAvailability("minUpperAlphaChars", true) ||
                                  widgetObj.checkStateAvailability("minSpecialChars", true);

  return props;
}


//--------------------------------------------------------------------
// FUNCTION:
//   removeInvalidOptions
//
// DESCRIPTION:
//   This function is called to clean-up the code. It removes from the widget
//   defintion line all options that are not available in the current widget
//   configuration.
//
// ARGUMENTS:
//   widgetObj - object - widget's design time object
//
// RETURNS:
//   True if any changes are maded to the widget's options, false otherwise.
//--------------------------------------------------------------------

function removeInvalidOptions(widgetObj)
{
  var needUpdate = false;
  var props = getUIProperties(widgetObj);

  if (!props.minMaxCharsEnabled)
  {
    widgetObj.removeOption("minChars");
    widgetObj.removeOption("maxChars");
    needUpdate = true;
  }

  if (!props.invalidStrengthEnabled)
  {
    widgetObj.removeOption("minAlphaChars");
    widgetObj.removeOption("maxAlphaChars");
    widgetObj.removeOption("minNumbers");
    widgetObj.removeOption("maxNumbers");
    widgetObj.removeOption("minUpperAlphaChars");
    widgetObj.removeOption("maxUpperAlphaChars");
    widgetObj.removeOption("minSpecialChars");
    widgetObj.removeOption("maxSpecialChars");
    needUpdate = true;
  }

  return needUpdate;
}
