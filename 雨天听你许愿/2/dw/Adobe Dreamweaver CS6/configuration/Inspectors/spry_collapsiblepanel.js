//Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piCollapsiblePanel;
var widgetGuide = MM.HELP_piCollapsiblePanelGuide;

var COLLAPSIBLEPANEL_ID;
var PANEL_HEIGHT;
var MESSAGE;
var MESSAGETEXT;
var DISPLAY_SEL;
var DEFAULT_SEL;
var ANIMATION;

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
//   true if the currently selected node is a CollapsiblePanel element,
//   false if it is not.
//--------------------------------------------------------------------

function canInspectSelection() 
{
  var bCanInspectSelection = false;
  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode();
  
  if ( !selectedNode || !selectedNode.getTranslatedAttribute )
    return false;
    
  var attr = selectedNode.getTranslatedAttribute('Spry.Widget.CollapsiblePanel');
  
  if ( attr && attr.length > 0 )
  {
    bCanInspectSelection = true;
    
    // If the widget manager is out of sync, run the translator.
    var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom); 
    if ( !widgetMgr.getWidget('Spry.Widget.CollapsiblePanel', selectedNode.id ) )
    {
      dom.runTranslator("Spry Widget");

      if ( !widgetMgr.getWidget('Spry.Widget.CollapsiblePanel', selectedNode.id ) )
      {
        // Running the translator failed to create a design time object
        // for this widget. Either caInspectSelection() was called in the
        // middle of an edit operation, which prevents the translator from
        // running right now, or an error occurred during the translation.

        bCanInspectSelection = false;
      }
    }  
  }
   
  return bCanInspectSelection;
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
  COLLAPSIBLEPANEL_ID = dwscripts.findDOMObject("idEditBox");
  COLLAPSIBLEPANEL_ID.value = "";  
  MESSAGE = dwscripts.findDOMObject("message");
  MESSAGETEXT = dwscripts.findDOMObject("messageText");
  MESSAGETEXT.innerHTML = "";
  DISPLAY_SEL = dwscripts.findDOMObject("displayContent");
  DEFAULT_SEL = dwscripts.findDOMObject("defaultState");
  ANIMATION = dwscripts.findDOMObject("useAnimation");
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
  var selectedNode = dom.getSelectedNode();
  if (!canInspectSelection())
    return;
  
  var divId = selectedNode.id;
  // Update the ID field in the PI.
  COLLAPSIBLEPANEL_ID.value = divId;
  
  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom); 
  var cp = widgetMgr.getWidget('Spry.Widget.CollapsiblePanel', divId );
  
  if ( !cp )
  {
    displayTopLayerErrorMessage(dw.loadString("spry/widget/alert/broken structure"));
    return;
  }
  
  clearTopLayerErrorMessage()
  
  cp.refresh();

  // Update the PI controls to reflect the collapsible panel's renderstate.

  DISPLAY_SEL.selectedIndex = cp.isOpen() ? 0 : 1;
  DEFAULT_SEL.selectedIndex = cp.getDefaultOpenState() ? 0 : 1;
  ANIMATION.checked = cp.getEnableAnimation();

  if (!cp.isValidPanelStructure())
  {
    // Show a warning message in the PI.
    MESSAGETEXT.innerHTML = dw.loadString("spry/widgets/collapsiblepanel/alert/broken structure");
    MESSAGE.style.display = "";
  }
  else
  {
    MESSAGETEXT.innerHTML = "";
    MESSAGE.style.display = "none";
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
//  action - string - The name of the action to perform.
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function updateTag(action)
{
  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode();
  if (!canInspectSelection())
    return;
  
  var divId = selectedNode.id;
  
  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom); 
  var cp = widgetMgr.getWidget('Spry.Widget.CollapsiblePanel', divId );
  if ( !cp )
    return;
  
  if (action) 
  {
    switch (action)
    {
      case "id":
      {
        // Validate the new id.
        var newId = COLLAPSIBLEPANEL_ID.value;
        if ( newId == divId )
          return; // Nothing to changed.
        
        if ( newId.length == 0 )
        {
          alert(dw.loadString("spry/widget/alert/need unique id"));
          return;
        }
        
        if ( dom.getElementById(newId) )
        {
          alert(dw.loadString("spry/widget/alert/id already exists"));
          return;
        }
        
        if ( !dwscripts.isValidID(newId) )
        {
          alert(dw.loadString("spry/widget/alert/id is invalid"));
          return;
        }
        
        // Update the constructor.
        cp.updateId(newId);

        // Update the WidgetManager for the new ID.
        widgetMgr.setWidget('Spry.Widget.CollapsiblePanel', newId, cp );
      }
      break;
      
      case "openContentPanel":
      {
        cp.open();
      }
      break;

      case "closeContentPanel":
      {
        cp.close();
      }
      break;

      case "setDefaultOpen":
      {
        cp.setDefaultOpenState(true);
      }
      break;

      case "setDefaultClosed":
      {
        cp.setDefaultOpenState(false);
      }
      break;

      case "toggleEnableAnimation":
      {
        cp.setEnableAnimation(!cp.getEnableAnimation());
      }
      break;
      
      case "guide":
      {
        dwscripts.displayDWHelp(widgetGuide);
      }
      break;
    }
   }
  
  // All these edits modify the collapsiblepanel. We need to recreate the JS Object to reflect those changes.
  cp.refresh();
  
  // Make sure selection stays on the div.
  dom.setSelectedNode(selectedNode); 
  inspectSelection();
}
