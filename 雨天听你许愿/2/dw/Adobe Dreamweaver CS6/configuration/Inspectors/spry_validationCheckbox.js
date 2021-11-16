// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piValidationCheckbox;
var widgetGuide = MM.HELP_piValidationCheckboxGuide;

var WIDGET_ID;
var REQUIRED_ENFORCE;
var MINSELECT_VALUE;
var MAXSELECT_VALUE;
var VALIDATE_BLUR;
var VALIDATE_CHANGE;
var WIDGET_STATES;
var MESSAGE;
var minSelectPrevValue;
var maxSelectPrevValue;


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
    attr = selectedNode.getTranslatedAttribute('Spry.Widget.ValidationCheckbox');
  }

  if( attr && attr.length > 0 )
  {
    bCanInspectSelection = true;

    //if the widget manager is out of sync, run the translator
    var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
    if( !widgetMgr.getWidget('Spry.Widget.ValidationCheckbox', selectedNode.id ) )
    {
      dom.runTranslator("Spry Widget");

      if( !widgetMgr.getWidget('Spry.Widget.ValidationCheckbox', selectedNode.id ) )
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
  REQUIRED_ENFORCE = new RadioGroup("", "required_enforce");
  REQUIRED_ENFORCE.initializeUI();
  MINSELECT_VALUE = dwscripts.findDOMObject("minSelectValue");
  MAXSELECT_VALUE = dwscripts.findDOMObject("maxSelectValue");
  VALIDATE_BLUR = dwscripts.findDOMObject("validateBlur");
  VALIDATE_CHANGE = dwscripts.findDOMObject("validateChange");
  WIDGET_STATES = new ListControl("widgetStates", null, true);
  MESSAGE = dwscripts.findDOMObject("message");
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
  // Call initializeUI() here; it's how the global variables get
  // initialized. The onLoad event on the body tag is never triggered
  // in inspectors.
  initializeUI();

  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode(true, false, true);
  if (!canInspectSelection())
  {
    return;
  }
  var containerId = selectedNode.id;
  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
  var widgetObj = widgetMgr.getWidget('Spry.Widget.ValidationCheckbox', containerId );

  // the ID
  WIDGET_ID.value = containerId;

  if( !widgetObj || !widgetObj.isValidStructure() )
  {
    displayTopLayerErrorMessage(dw.loadString("spry/widget/alert/broken structure"));
    return;
  }
  clearTopLayerErrorMessage();

  widgetObj.refresh();

  if( widgetObj.opts )
  {
    //update controls from PI
    if( typeof widgetObj.opts.isRequired != 'undefined' && widgetObj.opts.isRequired == false )
    {
      REQUIRED_ENFORCE.setIndex(1);
    }
    else
    {
      REQUIRED_ENFORCE.setIndex(0);
    }
    updateDisabledControls();

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
    minSelectPrevValue = (typeof widgetObj.opts.minSelections == "undefined") ? "" : dwscripts.trim(widgetObj.opts.minSelections.toString());
    MINSELECT_VALUE.value = minSelectPrevValue;
    maxSelectPrevValue = (typeof widgetObj.opts.maxSelections == "undefined") ? "" : dwscripts.trim(widgetObj.opts.maxSelections.toString());
    MAXSELECT_VALUE.value = maxSelectPrevValue;

    WIDGET_STATES.setAll(widgetObj.getStatesLabels(), widgetObj.getStatesValues());
    WIDGET_STATES.pickValue(widgetObj.getDisplayedState());
  }
  else
  {
    REQUIRED_ENFORCE.setIndex(0);
    VALIDATE_BLUR.checked = false;
    VALIDATE_CHANGE.checked = false;
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
  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode(true, false, true);
  var selectedState = "";
  if (!canInspectSelection())
    return;

  var containerId = selectedNode.id;

  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
  var widgetObj = widgetMgr.getWidget('Spry.Widget.ValidationCheckbox', containerId );
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

        //new ID looks change the constructor
        widgetObj.updateId(newId);
        //update the WidgetManager for the new ID
        widgetMgr.setWidget('Spry.Widget.ValidationCheckbox', newId, widgetObj );
      }
      break;

      case "required_enforce":
      {
        if ( REQUIRED_ENFORCE.getValue() == "isRequired" )
        {
          widgetObj.addWidgetMessage("isRequired");
          widgetObj.removeOption("isRequired");

          widgetObj.removeOption("minSelections");
          widgetObj.removeWidgetMessage("minSelections");
          widgetObj.removeOption("maxSelections");
          widgetObj.removeWidgetMessage("maxSelections");

          widgetObj.setDisplayedState("isRequired");
          selectedState = "isRequired";
        }else{
          widgetObj.setOption("isRequired", false);
          widgetObj.removeWidgetMessage("isRequired");

          widgetObj.setDisplayedState(null);
        }
        widgetObj.updateOptions();
      }
      break;

      case "minSelectValue":
      {
        if ( MINSELECT_VALUE.value && dwscripts.trim(MINSELECT_VALUE.value) )
        {
          widgetObj.addWidgetMessage("minSelections");
          //update constructor code
           widgetObj.setOption("minSelections", parseValue(MINSELECT_VALUE.value, "number"));
          if( !minSelectPrevValue )
          {
           widgetObj.setDisplayedState("minSelections");
           selectedState = "minSelections";
          }
          minSelectPrevValue = MINSELECT_VALUE.value;
        }else{
          //remove minSelections
          if( minSelectPrevValue )
          {
            //remove minSelections message only if the previuos value its not empy
            widgetObj.removeWidgetMessage("minSelections");
          }
          widgetObj.removeOption("minSelections");
          if( widgetObj.getDisplayedState() == "minSelections" )
            widgetObj.setDisplayedState(null);
          minSelectPrevValue = "";
        }
        widgetObj.updateOptions();
      }
      break;

      case "maxSelectValue":
      {
        if ( MAXSELECT_VALUE.value && dwscripts.trim(MAXSELECT_VALUE.value) )
        {
          widgetObj.addWidgetMessage("maxSelections");
          //update constructor code
           widgetObj.setOption("maxSelections", parseValue(MAXSELECT_VALUE.value, "number"));
          if( !maxSelectPrevValue )
          {
            widgetObj.setDisplayedState("maxSelections");
            selectedState = "maxSelections";
          }
          maxSelectPrevValue = MAXSELECT_VALUE.value;
        }else{
          //remove maxSelections
          if( maxSelectPrevValue )
          {
            //remove maxSelections message only if the previuos value its not empy
            widgetObj.removeWidgetMessage("maxSelections");
          }
          widgetObj.removeOption("maxSelections");
          if( widgetObj.getDisplayedState() == "maxSelections" )
            widgetObj.setDisplayedState(null);
          maxSelectPrevValue = "";
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

//--------------------------------------------------------------------
// FUNCTION:
//   removeValidateOption
//
// DESCRIPTION:
//   This function updates the disabled state of the min/max no. of selections
//   according to the isRequired selection.
//
// ARGUMENTS:
//   widgetObj - object - widget design time object
//   optionName - string - "validateOn" option
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function updateDisabledControls()
{
  var enabled = REQUIRED_ENFORCE.getValue() == "isRequired";
  MINSELECT_VALUE.disabled = enabled;
  MAXSELECT_VALUE.disabled = enabled;
}
