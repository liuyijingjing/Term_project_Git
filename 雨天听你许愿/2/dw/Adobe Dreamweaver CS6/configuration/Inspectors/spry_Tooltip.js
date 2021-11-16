// Copyright 2008 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piTooltip;
var widgetGuide = MM.HELP_piTooltipGuide;

var WIDGET_ID;
var MESSAGE;

var CLOSE_TOOLTIP_LEAVE;
var FOLLOW_MOUSE;

var OFFSET_X;
var OFFSET_Y;
var SHOW_DELAY;
var HIDE_DELAY;

var USE_EFFECT;
var TRIGGER;


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
//   true if the currently selected node can be inspected,
//   false if it can't.
//--------------------------------------------------------------------

function canInspectSelection()
{
  var bCanInspectSelection = false;
  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode(true, false, true);

  var attr;

  if( selectedNode && selectedNode.getTranslatedAttribute )
  {
    attr = selectedNode.getTranslatedAttribute("Spry.Widget.Tooltip");
  }

  if( attr && attr.length > 0 )
  {
    bCanInspectSelection = true;

    //if the widget manager is out of sync, run the translator
    var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
    if( !widgetMgr.getWidget("Spry.Widget.Tooltip", selectedNode.id ) )
    {
      dom.runTranslator("Spry Widget");

      if( !widgetMgr.getWidget('Spry.Widget.Tooltip', selectedNode.id ) )
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

  OFFSET_X = new TextField("", "offsetX");
  OFFSET_X.initializeUI();

  OFFSET_Y = new TextField("", "offsetY");
  OFFSET_Y.initializeUI();

  SHOW_DELAY = new TextField("", "showDelay");
  SHOW_DELAY.initializeUI();

  HIDE_DELAY = new TextField("", "hideDelay");
  HIDE_DELAY.initializeUI();

  USE_EFFECT = new RadioGroup("", "effect");
  USE_EFFECT.initializeUI();    
  
  CLOSE_TOOLTIP_LEAVE = new CheckBox("", "closeOnTooltipLeave");
  CLOSE_TOOLTIP_LEAVE.initializeUI();

  FOLLOW_MOUSE = new CheckBox("", "followMouse");
  FOLLOW_MOUSE.initializeUI();
   
  //create it only when necessary, in order to preserve the values
  if (!TRIGGER) {
    TRIGGER = new ListControl("trigger");
    TRIGGER.setAll([], []);
  }
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
  var widgetObj = widgetMgr.getWidget("Spry.Widget.Tooltip", divId );  
  var widgetArgs = widgetObj.getConstructorArgs("Spry.Widget.Tooltip");  

  if( !widgetObj || !widgetObj.isValidStructure()  )
  {
    displayTopLayerErrorMessage(dw.loadString("spry/widget/alert/broken structure"));
    return;
  }

  clearTopLayerErrorMessage();
  widgetObj.refresh();

  //exclude this tooltip's ID 
  var triggers = widgetObj.getAllIds(divId);   
    
  //update trigger list only if new items appeared in page
  var currValues = TRIGGER.getValue("all");
  var needUpdate = false;
  if(triggers.length != currValues.length)
  {
    needUpdate = true;
  }      
  for(var i=0; i<triggers.length; i++) 
  {
    if (!currValues || (typeof(currValues[i]) != "string") || (triggers[i] != currValues[i])) {
      needUpdate = true;
      break;
    }
  }
  if (needUpdate) 
  {
    TRIGGER.setAll(triggers, triggers);
  }
  TRIGGER.pickValue(widgetArgs[1].replace(/["']/g,''));
         
  OFFSET_X.setValue(widgetObj.getOption("offsetX", ""));
  OFFSET_Y.setValue(widgetObj.getOption("offsetY", ""));

  SHOW_DELAY.setValue(widgetObj.getOption("showDelay", ""));
  HIDE_DELAY.setValue(widgetObj.getOption("hideDelay", ""));
        
  FOLLOW_MOUSE.checkBox.checked = (widgetObj.getOption("followMouse", false));
  CLOSE_TOOLTIP_LEAVE.checkBox.checked = (widgetObj.getOption("closeOnTooltipLeave", false));
  USE_EFFECT.pickValue(widgetObj.getOption("useEffect", "none").toLowerCase());
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
  var widgetObj = widgetMgr.getWidget("Spry.Widget.Tooltip", divId );
  if(!widgetObj)
    return;

  if (attrib)
  {
  switch (attrib)
    {        	
    case "effect":
      {
        if (USE_EFFECT.getValue() != "none")
        {
          widgetObj.setOption("useEffect", USE_EFFECT.getValue());  
        }
        else
        {
          widgetObj.removeOption("useEffect");
        }        
        widgetObj.updateOptions();
      }
      break;
               
    case "offsetX":
      {
        if (widgetObj.setOption("offsetX", parseValue(OFFSET_X.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
        }
      }
      break;

    case "offsetY":
      {
        if (widgetObj.setOption("offsetY", parseValue(OFFSET_Y.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
        }
      }
      break;
      
    case "hideDelay":
      {
        if (widgetObj.setOption("hideDelay", parseValue(HIDE_DELAY.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
        }
      }
      break;

    case "showDelay":
      {
        if (widgetObj.setOption("showDelay", parseValue(SHOW_DELAY.getValue(), "number"), ""))
        {
          widgetObj.updateOptions();
        }
      }
      break;
      
    case "closeOnTooltipLeave":
      {
        if (widgetObj.setOption("closeOnTooltipLeave", CLOSE_TOOLTIP_LEAVE.getCheckedState(), false))
        {
          widgetObj.updateOptions();
        }      
      }      
      break;
      
    case "followMouse":
      {
        if (widgetObj.setOption("followMouse", FOLLOW_MOUSE.getCheckedState(), false))
        {
          widgetObj.updateOptions();
        }
      }
      break;
      
    case "guide":
      {
          //the docs for this extension are located on the web                  
          //do we have to use dw.browseDocument?
          //dw.browseDocument(widgetGuide);
          dwscripts.displayDWHelp(widgetGuide);
      }
      break;

    case "trigger":
      {
        var theElement = TRIGGER.getValue();
        theElement = dwscripts.trim(theElement);
        if (theElement) {
          widgetObj.setTriggerElement(theElement);
        } 
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
        widgetMgr.setWidget("Spry.Widget.Tooltip", newId, widgetObj );
        //don't delete the widget in case this gets undone, we'll find the old one
        //widgetMgr.deleteWidget("Spry.Widget.Tooltip", divId);
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
