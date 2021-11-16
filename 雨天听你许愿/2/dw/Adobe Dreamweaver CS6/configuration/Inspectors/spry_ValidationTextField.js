// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piValidationTextField;
var widgetGuide = MM.HELP_piValidationTextFieldGuide;

var WIDGET_ID;
var MESSAGE;
var REQUIRED;
var VALIDATE_BLUR;
var VALIDATE_CHANGE;
var TYPE;
var DISPLAY_ERROR_STATE;
var MIN_VALUE;
var MAX_VALUE;
var MIN_CHARS;
var MAX_CHARS;
var FORMAT;
var CHARACTER_MASKING;
var HINT;
var CUSTOM_PATTERN;


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
    attr = selectedNode.getTranslatedAttribute("Spry.Widget.ValidationTextField");
  }

  if( attr && attr.length > 0 )
  {
    bCanInspectSelection = true;

    //if the widget manager is out of sync, run the translator
    var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
    if( !widgetMgr.getWidget("Spry.Widget.ValidationTextField", selectedNode.id ) )
    {
      dom.runTranslator("Spry Widget");

      if( !widgetMgr.getWidget('Spry.Widget.ValidationTextField', selectedNode.id ) )
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

  TYPE = new ListControl("type");
  TYPE.setAll([], []);

  DISPLAY_ERROR_STATE = new ListControl("displayErrorState");
  DISPLAY_ERROR_STATE.setAll([], []);

  MIN_VALUE = new TextField("", "minValue");
  MIN_VALUE.initializeUI();

  MAX_VALUE = new TextField("", "maxValue");
  MAX_VALUE.initializeUI();

  MIN_CHARS = new TextField("", "minChars");
  MIN_CHARS.initializeUI();

  MAX_CHARS = new TextField("", "maxChars");
  MAX_CHARS.initializeUI();

  FORMAT = new ListControl("format");
  FORMAT.setAll([], []);

  CHARACTER_MASKING = new CheckBox("", "characterMasking");
  CHARACTER_MASKING.initializeUI();

  HINT = new TextField("", "hint");
  HINT.initializeUI();

  CUSTOM_PATTERN = new TextField("", "customPattern");
  CUSTOM_PATTERN.initializeUI();
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
  var widgetObj = widgetMgr.getWidget("Spry.Widget.ValidationTextField", divId );

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
  TYPE.setAll(widgetObj.getTypesLabels(), widgetObj.getTypesValues());
  TYPE.pickValue(widgetObj.getType());

  // Check to see if the current selected state is valid
  var statesLabels = widgetObj.getStatesLabels();
  var statesValues = widgetObj.getStatesValues();
  var currentState = widgetObj.getDisplayedState();
  DISPLAY_ERROR_STATE.setAll(statesLabels, statesValues);
  if (dwscripts.findInArray(statesValues, currentState) != -1)
  {
    DISPLAY_ERROR_STATE.pickValue(currentState);
  }
  else
  {
    DISPLAY_ERROR_STATE.pickValue("");
    widgetObj.setDisplayedState("");
  }

  FORMAT.setAll(widgetObj.getFormatsLabels(TYPE.getValue()), widgetObj.getFormatsValues(TYPE.getValue()));
  if (!FORMAT.pickValue(widgetObj.getOption("format")))
  {
    FORMAT.setIndex(0);
  }

  var validateOn = widgetObj.getOption("validateOn", []);
  // Use this way to override a Dreamweaver bug: after using the first time a checkbox, the click on label doesn't work anymore
  VALIDATE_BLUR.checkBox.checked = (dwscripts.findInArray(validateOn, "blur") != -1);
  VALIDATE_CHANGE.checkBox.checked = (dwscripts.findInArray(validateOn, "change") != -1);

  MIN_VALUE.setValue(widgetObj.getOption("minValue", ""));
  MAX_VALUE.setValue(widgetObj.getOption("maxValue", ""));
  MIN_CHARS.setValue(widgetObj.getOption("minChars", ""));
  MAX_CHARS.setValue(widgetObj.getOption("maxChars", ""));
  REQUIRED.checkBox.checked = (widgetObj.getOption("isRequired", true));
  CHARACTER_MASKING.checkBox.checked = (widgetObj.getOption("useCharacterMasking", false) && widgetObj.getCharMaskingAvailability(TYPE.getValue()));
  HINT.setValue(widgetObj.getOption("hint", ""));
  CUSTOM_PATTERN.setValue(widgetObj.getOption("pattern", ""));

  // Update the disabled state of various controls
  updateDisabledControls(widgetObj);
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
  var widgetObj = widgetMgr.getWidget("Spry.Widget.ValidationTextField", divId );
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

      case "type":
      {
        var formatValue = FORMAT.getValue();
        widgetObj.setType(TYPE.getValue());

        removeInvalidOptions(widgetObj);
        widgetObj.removeOption("format");

        //always remove the pattern option, when the type is changed
        widgetObj.removeOption("pattern");

        widgetObj.updateOptions();
        widgetObj.updateErrorMessages("invalidFormat");
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

      case "minValue":
      {
        if (widgetObj.setOption("minValue", parseValue(MIN_VALUE.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("minValue");
        }
      }
      break;

      case "maxValue":
      {
        if (widgetObj.setOption("maxValue", parseValue(MAX_VALUE.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("maxValue");
        }
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

      case "format":
      {
        var defaultFormat;
        var formatValue = FORMAT.getValue();
        var formats = FORMAT.getValue('all');
        if (formats && formats[0])
        {
          defaultFormat = formats[0];
        }

        if (widgetObj.setOption("format", formatValue, defaultFormat))
        {
          if( formatValue != "phone_custom" && formatValue != "zip_custom" && formatValue != "ssn_custom" )
            widgetObj.removeOption("pattern");
          removeInvalidOptions(widgetObj);
          widgetObj.updateOptions();
          widgetObj.updateErrorMessages("invalidFormat");
        }
      }
      break;

      case "customPattern":
      {
        if (widgetObj.setOption("pattern", CUSTOM_PATTERN.getValue(), ""))
        {
          widgetObj.updateOptions();
        }
      }
      break;

      case "characterMasking":
      {
        if (widgetObj.setOption("useCharacterMasking", CHARACTER_MASKING.getCheckedState(), false))
        {
          widgetObj.updateOptions();
          //widgetObj.updateErrorMessages();
        }
      }
      break;

      case "hint":
      {
        if (widgetObj.setOption("hint", HINT.getValue(), ""))
        {
          widgetObj.updateOptions();
          //widgetObj.updateErrorMessages();
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
        widgetMgr.setWidget("Spry.Widget.ValidationTextField", newId, widgetObj );
        //don't delete the widget incase this gets undone, we'll find the old one
        //widgetMgr.deleteWidget("Spry.Widget.ValidationTextField", divId);
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
  var type = widgetObj.getType();
  var format = widgetObj.getOption("format");

  props.minMaxValueEnabled = widgetObj.checkStateAvailability("minValue", true);
  props.minMaxCharsEnabled = widgetObj.checkStateAvailability("minChars", true);
  props.formatEnabled = (widgetObj.getFormatsValues(TYPE.getValue()).length != 0); //(FORMAT.getValue("all").length != 0);
  props.characterMaskingEnabled = widgetObj.getCharMaskingAvailability(TYPE.getValue());
  props.hintEnabled = widgetObj.getHintAvailability();
  props.patternEnabled = ((format == "phone_custom") || (format == "zip_custom") || (format == "ssn_custom") || (type == "custom"));

  return props;
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateDisabledControls
//
// DESCRIPTION:
//   This function updates the disbaled state of various controls from the UI
//   according to the current widget configuration.
//
// ARGUMENTS:
//   widgetObj - object - widget's design time object
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function updateDisabledControls(widgetObj)
{
  var props = getUIProperties(widgetObj);

  MIN_CHARS.setDisabled(!props.minMaxCharsEnabled);
  MAX_CHARS.setDisabled(!props.minMaxCharsEnabled);

  MIN_VALUE.setDisabled(!props.minMaxValueEnabled);
  MAX_VALUE.setDisabled(!props.minMaxValueEnabled);

  FORMAT.enable(props.formatEnabled);
  CHARACTER_MASKING.enable(props.characterMaskingEnabled);
  HINT.setDisabled(!props.hintEnabled);

  if (props.patternEnabled)
  {
    CUSTOM_PATTERN.setDisabled(false);
  }
  else
  {
    CUSTOM_PATTERN.setValue("");
    CUSTOM_PATTERN.setDisabled(true);
  }
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

  if (!props.minMaxValueEnabled)
  {
    widgetObj.removeOption("minValue");
    widgetObj.removeOption("maxValue");
    needUpdate = true;
  }
  if (!props.minMaxCharsEnabled)
  {
    widgetObj.removeOption("minChars");
    widgetObj.removeOption("maxChars");
    needUpdate = true;
  }
  if (!props.formatEnabled)
  {
    // If we have chosen a type that doesn't have formats available, we'll remove
    // the current format option and update the code.
    widgetObj.removeOption("format");
    needUpdate = true;
  }
  if (!props.characterMaskingEnabled)
  {
    widgetObj.removeOption("useCharacterMasking");
    needUpdate = true;
  }
  if (!props.hintEnabled)
  {
    widgetObj.removeOption("hint");
    needUpdate = true;
  }

  return needUpdate;
}
