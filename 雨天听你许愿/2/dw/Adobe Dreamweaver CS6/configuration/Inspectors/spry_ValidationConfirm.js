// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piValidationConfirm;
var widgetGuide = MM.HELP_piValidationConfirmGuide;

var WIDGET_ID;
var MESSAGE;
var REQUIRED;
var VALIDATE_BLUR;
var VALIDATE_CHANGE;
var DISPLAY_ERROR_STATE;
var VALIDATE_AGAINST;


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
    attr = selectedNode.getTranslatedAttribute("Spry.Widget.ValidationConfirm");
  }

  if( attr && attr.length > 0 )
  {
    bCanInspectSelection = true;

    //if the widget manager is out of sync, run the translator
    var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
    if( !widgetMgr.getWidget("Spry.Widget.ValidationConfirm", selectedNode.id ) )
    {
      dom.runTranslator("Spry Widget");

      if( !widgetMgr.getWidget('Spry.Widget.ValidationConfirm', selectedNode.id ) )
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

  // set the list control
  VALIDATE_AGAINST = new TagMenu("", "validateAgainst", "input/text,input/password");
  VALIDATE_AGAINST.customInitializeUI = validateAgainst_customInitializeUI;
  VALIDATE_AGAINST.customInitializeUI();

  VALIDATE_BLUR = new CheckBox("", "validateBlur");
  VALIDATE_BLUR.initializeUI();

  VALIDATE_CHANGE = new CheckBox("", "validateChange");
  VALIDATE_CHANGE.initializeUI();

  DISPLAY_ERROR_STATE = new ListControl("displayErrorState");
  DISPLAY_ERROR_STATE.setAll([], []);
}


//--------------------------------------------------------------------
// FUNCTION:
//   customInitializeUI
//
// DESCRIPTION:
//   This function is a simplified version of initializeUI from TagMenu
//   class. It is used to workaround bug #229483 - Crash on attempt to
//   render in Design view a Validation Confirm widget with missing
//   container.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function validateAgainst_customInitializeUI() {
  // add all other tags to menu
  var nodes = VALIDATE_AGAINST.getTagElements();
  var tagNames = new Array()
  var tagValues = new Array();
  for (var i=0; i < nodes.length; i++) {

    tagNames.push(VALIDATE_AGAINST.getNiceName(nodes[i], i));
    tagValues.push(nodes[i]);

  }
    
  // set the list control
  VALIDATE_AGAINST.listControl = new ListControl(VALIDATE_AGAINST.paramName); 
  VALIDATE_AGAINST.listControl.setAll(tagNames, tagValues);
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
  var widgetObj = widgetMgr.getWidget("Spry.Widget.ValidationConfirm", divId );

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

  var validateOn = widgetObj.getOption("validateOn", []);
  // Use this way to override a Dreamweaver bug: after using the first time a checkbox, the click on label doesn't work anymore
  VALIDATE_BLUR.checkBox.checked = (dwscripts.findInArray(validateOn, "blur") != -1);
  VALIDATE_CHANGE.checkBox.checked = (dwscripts.findInArray(validateOn, "change") != -1);

  // Remove the confirm control for the current widget from the list of proposed tags since this usecase is not a valid one.
  var confirmControlIndex = dwscripts.findInArray(VALIDATE_AGAINST.listControl.getValue("all"), widgetObj.input);
  if (confirmControlIndex != -1) {
    VALIDATE_AGAINST.listControl.del(confirmControlIndex);
  }

  REQUIRED.checkBox.checked = (widgetObj.getOption("isRequired", true));
  var validateAgainstElem = dom.getElementById(widgetObj.getValidateAgainst());
  if (typeof(validateAgainstElem) == "undefined") {
    VALIDATE_AGAINST.listControl.prepend(dw.loadString("spry/widgets/ValidationConfirm/error/invalidElement"), validateAgainstElem);
    displayBottomContainerWarningMessage(dw.loadString("spry/widgets/ValidationConfirm/message/elementMissingNotFound"));
  } else if (validateAgainstElem && validateAgainstElem.getAttribute && widgetObj && widgetObj.input && widgetObj.input.getAttribute && (validateAgainstElem.getAttribute("type") != widgetObj.input.getAttribute("type"))) {
    displayBottomContainerWarningMessage(dw.loadString("spry/widgets/ValidationConfirm/message/elementsOfDifferentTypes"));
  } else {
    clearBottomContainerWarningMessage();
  }
  if (validateAgainstElem) {
    VALIDATE_AGAINST.listControl.pickValue(dom.getElementById(widgetObj.getValidateAgainst()));
  } else {
    VALIDATE_AGAINST.listControl.setIndex(0);
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
  if (!canInspectSelection())
    return;

  var divId = selectedNode.id;

  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
  var widgetObj = widgetMgr.getWidget("Spry.Widget.ValidationConfirm", divId );
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

      case "validateAgainst":
      {
        var theElement = VALIDATE_AGAINST.listControl.getValue();

        if (theElement && theElement.id) {
          widgetObj.setValidateAgainst(theElement.id);
        } else {
          alert(dw.loadString("spry/widgets/ValidationConfirm/error/selectedElemHasNoID"));
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
        widgetMgr.setWidget("Spry.Widget.ValidationConfirm", newId, widgetObj );
        //don't delete the widget incase this gets undone, we'll find the old one
        //widgetMgr.deleteWidget("Spry.Widget.ValidationConfirm", divId);
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

function displayBottomContainerWarningMessage(message) {
	var bottomContainer = document.getElementById("bottomContainer");
	var bottomContainerWarningLayer = document.getElementById("bottomContainerWarningLayer");
	var warningMessage = document.getElementById("warningMessage");
	if(warningMessage == null)
	{
		warningMessage = bottomContainerWarningLayer;
	}
	
	if( !bottomContainer || !bottomContainerWarningLayer )
	{
		if( dw.isDebugBuild() )
		{
			alert("DEBUG ALERT: pi trying to display alert but missing bottomContainer or bottomContainerWarningLayer div" );
		}
		return;
	}
	
	if( bottomContainer ) bottomContainer.style.display = "none";
	warningMessage.innerHTML = message;
	bottomContainerWarningLayer.style.display = "block";
}

function clearBottomContainerWarningMessage()
{
	var bottomContainer = document.getElementById("bottomContainer");
	var bottomContainerWarningLayer = document.getElementById("bottomContainerWarningLayer");
	var warningMessage = document.getElementById("warningMessage");
	if(warningMessage == null)
	{
		warningMessage = bottomContainerWarningLayer;
	}

	if( !bottomContainer  || !bottomContainerWarningLayer )
	{
		if( dw.isDebugBuild() )
		{
			alert("DEBUG ALERT: pi trying to display alert but missing bottomContainer or bottomContainerWarningLayer div" );
		}
		return;
	}
	
	if( bottomContainer ) bottomContainer.style.display = "block";
	warningMessage.innerHTML = "";
	bottomContainerWarningLayer.style.display = "none";
}

