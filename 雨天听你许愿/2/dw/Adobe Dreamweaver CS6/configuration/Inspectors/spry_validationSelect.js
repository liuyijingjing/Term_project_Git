// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piValidationSelect;
var widgetGuide = MM.HELP_piValidationSelectGuide;

var WIDGET_ID;
var IS_REQUIRED;
var IS_INVALID;
var INVALID_VALUE;
var VALIDATE_BLUR;
var VALIDATE_CHANGE;
var VALIDATE_SUBMIT;
var WIDGET_STATES;
var MESSAGE;

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

  if ( !selectedNode || !selectedNode.getTranslatedAttribute )
    return false;

  var attr = selectedNode.getTranslatedAttribute('Spry.Widget.ValidationSelect');

  if( attr && attr.length > 0 )
  {
    bCanInspectSelection = true;

    //if the widget manager is out of sync, run the translator
    var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
    if( !widgetMgr.getWidget('Spry.Widget.ValidationSelect', selectedNode.id ) )
    {
      dom.runTranslator("Spry Widget");

      if( !widgetMgr.getWidget('Spry.Widget.ValidationSelect', selectedNode.id ) )
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
  IS_REQUIRED = dwscripts.findDOMObject("isRequired");
  IS_INVALID = dwscripts.findDOMObject("isInvalid");
  INVALID_VALUE = dwscripts.findDOMObject("invalidValue");
  VALIDATE_BLUR = dwscripts.findDOMObject("validateBlur");
  VALIDATE_CHANGE = dwscripts.findDOMObject("validateChange");
  VALIDATE_SUBMIT = dwscripts.findDOMObject("validateSubmit");
  WIDGET_STATES = new ListControl("widgetStates", null, true);
  MESSAGE = dwscripts.findDOMObject("message");

  //initialize controls
  WIDGET_ID.value = "";
  MESSAGE.innerHTML = "";
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
try {
  if (!canInspectSelection())
  {
    return;
  }

  // Call initializeUI() here; it's how the global variables get
  // initialized. The onLoad event on the body tag is never triggered
  // in inspectors.
  initializeUI();

  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode(true, false, true);
  var containerId = selectedNode.id;
  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
  var widgetObj = widgetMgr.getWidget('Spry.Widget.ValidationSelect', containerId );

  WIDGET_ID.value = containerId;

  if( !widgetObj || !widgetObj.isValidStructure() )
  {
    displayTopLayerErrorMessage(dw.loadString("spry/widget/alert/broken structure"));
    return;
  }
  else if (widgetObj.isMultiSelect())
  {
    displayTopLayerErrorMessage(dw.loadString("spry/widgets/ValidationSelect/multiple warning"));
    return;
  }
  else if (widgetObj.isDuplicateControl())
  {
    displayTopLayerErrorMessage(dw.loadString("spry/widget/alert/duplicate controls"));
    return;
  }

  clearTopLayerErrorMessage();

  widgetObj.refresh();

  if( widgetObj.opts )
  {
    //update controls from PI
    if( typeof widgetObj.opts.isRequired != 'undefined' && widgetObj.opts.isRequired == false )
    {
      IS_REQUIRED.checked = false;
    }
    else
    {
      IS_REQUIRED.checked = true;
    }
    if( typeof widgetObj.opts.invalidValue != 'undefined' )
    {
      IS_INVALID.checked = true;
      INVALID_VALUE.value = widgetObj.opts.invalidValue;
      INVALID_VALUE.disabled = false;
    }
    else
    {
      IS_INVALID.checked = false;
      INVALID_VALUE.value = "-1";
      INVALID_VALUE.disabled = true;
    }
    if( typeof widgetObj.opts.validateOn != 'undefined' )
    {
      if( dwscripts.findInArray(widgetObj.opts.validateOn, "blur") != -1 )
      {
        VALIDATE_BLUR.checked = true;
      }
      else
      {
        VALIDATE_BLUR.checked = false;
      }
      if( dwscripts.findInArray(widgetObj.opts.validateOn, "change") != -1 )
      {
        VALIDATE_CHANGE.checked = true;
      }
      else
      {
        VALIDATE_CHANGE.checked = false;
      }
    }
    else
    {
      VALIDATE_BLUR.checked = false;
      VALIDATE_CHANGE.checked = false;
    }
  }
  else
  {
    IS_REQUIRED.checked = false;
    IS_INVALID.checked = false;
    INVALID_VALUE.value = "-1";
    INVALID_VALUE.disabled = true;
    VALIDATE_BLUR.checked = false;
    VALIDATE_CHANGE.checked = false;
  }
  // set labels and values for states control
  WIDGET_STATES.setAll(widgetObj.getStatesLabels(), widgetObj.getStatesValues());
  WIDGET_STATES.pickValue(widgetObj.getDisplayedState());

} catch(e) {
  // If we have had an error, we should re-inspect selection.
  inspectSelection();
}
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
  if (!canInspectSelection())
    return;

  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode(true, false, true);
  var selectedState = "";
  var containerId = selectedNode.id;

  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
  var widgetObj = widgetMgr.getWidget('Spry.Widget.ValidationSelect', containerId );
  if( !widgetObj )
    return;
  if (attrib)
  {
    switch (attrib)
    {
      case "widgetId":
      {
        //validate the new id
        var newId = WIDGET_ID.value;
        if( newId == containerId )
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

        //change ID in the constructor
        widgetObj.updateId(newId);
        //update the WidgetManager for the new ID
        widgetMgr.setWidget('Spry.Widget.ValidationSelect', newId, widgetObj);
      }
      break;

      case "isRequired":
      {
        if ( IS_REQUIRED.checked )
        {
          // add required message and set displayed state to "required"
          widgetObj.addWidgetMessage("isRequired");
          widgetObj.removeOption("isRequired");
          widgetObj.updateOptions();
          widgetObj.setDisplayedState("isRequired");
          selectedState = "isRequired";
        }else{
          // try remove required message and set displayed state to "initial"
          widgetObj.setOption("isRequired", false);
          widgetObj.removeWidgetMessage("isRequired");
          widgetObj.updateOptions();
          widgetObj.setDisplayedState(null);
        }
      }
      break;

      case "isInvalid":
      {
        if ( IS_INVALID.checked )
        {
          // add invalid value message and set displayed state to "invalid"
          widgetObj.addWidgetMessage("invalidValue");
          INVALID_VALUE.setAttribute("disabled", false);
          //update constructor code
           if( !INVALID_VALUE.value.length )
          {
            INVALID_VALUE.value = "-1";
          }
           widgetObj.setOption("invalidValue", INVALID_VALUE.value);
          widgetObj.updateOptions();
          widgetObj.setDisplayedState("invalidValue");
          selectedState = "invalidValue";
        }else{
          // try to remove invalid value message and set displayed state to "initial"
          widgetObj.removeWidgetMessage("invalidValue");
          widgetObj.removeOption("invalidValue");
          INVALID_VALUE.setAttribute("disabled", true);
           widgetObj.removeOption("invalidValue");
          widgetObj.updateOptions();
          widgetObj.setDisplayedState(null);
        }
      }
      break;

      case "invalidValue":
      {
        if( INVALID_VALUE.value.length )
        {
          widgetObj.setOption("invalidValue", INVALID_VALUE.value);
        }
        else
        {
          alert(dw.loadString("spry/widgets/ValidationSelect/alert/invalidValue field empty"));
          return;
        }
         widgetObj.updateOptions();
      }
      break;

      case "widgetStates":
      {
        widgetObj.setDisplayedState(WIDGET_STATES.getValue());
      }
      break;

      case "validateBlur":
      case "validateChange":
      {
        var validateOpt;
        var controlObj;
        var optName;

        if( attrib == "validateBlur")
        {
          controlObj = VALIDATE_BLUR;
          optName = "blur";
        }
        else
        {
          controlObj = VALIDATE_CHANGE;
          optName = "change";
        }
        if( controlObj )
        {
          if( controlObj.checked )
          {
            validateOpt = addValidateOption(widgetObj, optName)
          }
          else
          {
            validateOpt = removeValidateOption(widgetObj, optName)
          }
          widgetObj.setOption("validateOn", validateOpt);
        }
         widgetObj.updateOptions();
      }
      break;

      case "guide":
      {
        dwscripts.displayDWHelp(widgetGuide);
      }
      break;
    }
  }
  // set labels and values for states control according to options selected in PI
  WIDGET_STATES.setAll(widgetObj.getStatesLabels(), widgetObj.getStatesValues());
  WIDGET_STATES.pickValue(selectedState);

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
//   addValidateOption
//
// DESCRIPTION:
//   This function add "optionName" option to the validate on options array.
//
// ARGUMENTS:
//  widgetObj - object - widget design time object
//  optionName - string - "validateOn" option
//
// RETURNS:
//   An array of strings with all validateOn widget's options
//--------------------------------------------------------------------

function addValidateOption(widgetObj, optionName)
{
  var validateOpt = widgetObj.getOption("validateOn");
  if( !validateOpt )
  {
    validateOpt = new Array(optionName);
  }
  else
  {
    //don't add if already exists
    if( dwscripts.findInArray(validateOpt, optionName) == -1 )
    {
      validateOpt.push(optionName);
    }
  }

  return validateOpt;
}

//--------------------------------------------------------------------
// FUNCTION:
//   removeValidateOption
//
// DESCRIPTION:
//   This function removes "optionName" option from the validate on options array.
//
// ARGUMENTS:
//  widgetObj - object - widget design time object
//  optionName - string - "validateOn" option
//
// RETURNS:
//   An array of strings with all validateOn widget's options
//--------------------------------------------------------------------

function removeValidateOption(widgetObj, optionName)
{
  var validateOpt = widgetObj.getOption("validateOn");

  if( validateOpt )
  {
    var idx = dwscripts.findInArray(validateOpt, optionName);
    if( idx != -1 )
    {
      validateOpt.splice(idx, 1);
      //remove validation option if no validation is set
      if( !validateOpt.length )
      {
        validateOpt = undefined;
      }
    }
  }
  return validateOpt;
}
