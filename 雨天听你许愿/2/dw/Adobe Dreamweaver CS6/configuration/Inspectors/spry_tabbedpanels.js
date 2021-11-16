//Copyright 2005-2007 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piTabbedPanels;
var widgetGuide = MM.HELP_piTabbedPanelsGuide;

var TABBEDPANELS_ID;
var MESSAGE;
var MESSAGETEXT;
var LIST_PANEL;
var DEFAULT_TAB;
var OPTIONS_DIV;
var UP_BTN;
var DOWN_BTN;
var ADD_BTN;
var DEL_BTN;

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
  var selectedNode = dom.getSelectedNode();

  if ( !selectedNode || !selectedNode.getTranslatedAttribute )
    return false;
  
  var attr = selectedNode.getTranslatedAttribute('Spry.Widget.TabbedPanels');
  
  if( attr && attr.length > 0 )
  {
    bCanInspectSelection = true;
    
    // If the widget manager is out of sync, run the translator.
    var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom); 
    if( !widgetMgr.getWidget('Spry.Widget.TabbedPanels', selectedNode.id ) )
    {
      dom.runTranslator("Spry Widget");

      if( !widgetMgr.getWidget('Spry.Widget.TabbedPanels', selectedNode.id ) )
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
  TABBEDPANELS_ID = dwscripts.findDOMObject("idEditBox");
  TABBEDPANELS_ID.value = "";  
  MESSAGE = dwscripts.findDOMObject("message");
  MESSAGETEXT = dwscripts.findDOMObject("messageText");
  MESSAGETEXT.innerHTML = "";
  LIST_PANEL = new ListControl("panelList");
  DEFAULT_TAB = new ListControl("defaultTabList");
  OPTIONS_DIV = dwscripts.findDOMObject("widgetOptions");
  ADD_BTN = dwscripts.findDOMObject("elemAdd");
  DEL_BTN = dwscripts.findDOMObject("elemDel");
  UP_BTN = dwscripts.findDOMObject("elemUp");
  DOWN_BTN = dwscripts.findDOMObject("elemDown");
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
  TABBEDPANELS_ID.value = divId;
  
  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom); 
  var tp = widgetMgr.getWidget('Spry.Widget.TabbedPanels', divId );
  
  if( !tp )
  {
    displayTopLayerErrorMessage(dw.loadString("spry/widget/alert/broken structure"));
    return;
  }
  
  clearTopLayerErrorMessage()
  
  tp.refresh();

  // Sync the controls to the design-time object, pass -1 for both
  // the selectedIndex and defaultIndex argument so that syncControls()
  // gets them from the design-time object.

  var errorDetected = syncControls(tp, -1, -1);
  enableControls(tp, errorDetected);
}

//--------------------------------------------------------------------
// FUNCTION:
//   syncControls
//
// DESCRIPTION:
//   This internal utility function syncs up the Property Inspector UI
//   controls with the widget's design-time object so that they
//   accurately reflect what is in the widget HTML markup and JS
//   constructor in the design view document.
//
// ARGUMENTS:
//  tp - object - The widget design-time object.
//  selectedIndex - integer - The index of the panel that is currently
//                            showing. An index value of -1 tells this
//                            function to get the selectedIndex value
//                            from the widget design-time object.
//  defaultIndex - integer - The index of the panel to show when the
//                           widget is initially loaded into a browser.
//                           An index value of -1 tells this function
//                           to get the defaultIndex value from the
//                           widget design-time object.
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function syncControls(tp, selectedIndex, defaultIndex)
{
  var panelLabels = new Array();
  var tabs = [];
  var panels = [];
  var errorDetected = false;

  if( tp )
  {
    tabs = tp.getTabs();
    panels = tp.getContentPanels();
  }

  var curPanelIndex = tp.getCurrentPanelIndex();
  var numPanels = Math.max(tabs.length, panels.length);

  for (var i=0; i < numPanels; i++)
  {
    var label = "";
    var validStructure = false;
    
    if( tabs[i] && panels[i] )
    {
      label = dwscripts.collectTextInNode(tabs[i]);
      label = dwscripts.entityNameDecode(label); 
      label = dwscripts.trim(label);
      validStructure = true;
    }
    
    if( !validStructure )
    {  
      if (!tabs[i])
      {
        label = dw.loadString("spry/widgets/tabbedpanels/missing tab");
        errorDetected = true;
      }
      else
      {
        label = dw.loadString("spry/widgets/tabbedpanels/missing content");
        errorDetected = true;
      }

    }

    if( label.length == 0 )
      label = dw.loadString("spry/widget/unlabeled panel");
      
    panelLabels.push(label);
  }

  // Update the PI controls to reflect the collapsible panel's renderstate.

  var errMsg = "";
  var curPanel = (selectedIndex < 0) ? tp.getCurrentPanelIndex() : selectedIndex;
  
  LIST_PANEL.setAll(panelLabels, panelLabels);
  if( panelLabels.length )
  {
    LIST_PANEL.setIndex(curPanel);
    if (!tabs[curPanel])
    {
      errMsg = dw.loadString("spry/widgets/tabbedpanels/error/missing tab");
    }
    else if (!panels[curPanel])
    {
      errMsg = dw.loadString("spry/widgets/tabbedpanels/error/missing content");
    }
  }
  else
  {
    errMsg = dw.loadString("spry/widget/alert/broken structure");
  }

  var curDefault = (defaultIndex < 0) ? tp.getDefaultTab() : defaultIndex;

  DEFAULT_TAB.setAll(panelLabels,panelLabels);
  if( panelLabels.length )
    DEFAULT_TAB.setIndex(curDefault);

  setErrorMsg(errMsg);

  return errorDetected;
}

//--------------------------------------------------------------------
// FUNCTION:
//   enableControls
//
// DESCRIPTION:
//   This internal utility function enables/disables the controls
//   in the Property Inspector based on the state of the widget
//   design-time object.
//
// ARGUMENTS:
//  tp - object - The widget design-time object.
//  errorOnPage - boolean - true if the widget markup is invalid,
//                          false if the markup is valid.
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function enableControls(tp, errorOnPage)
{
  // Start off with everything disabled by default.

  var enableList = false;
  var enableDefaultList = false;
  var enableAdd = false;
  var enableDel = false;
  var enableUp = false;
  var enableDown = false;

  // If there's nothing in the default tab list disable it.

  if (DEFAULT_TAB.getLen() > 0)
    enableDefaultList = true;

  if (LIST_PANEL.getLen() < 1)
  {
    // If there's nothing in the list panel, the user must have
    // removed all of the tabs and content panels, or completely
    // removed one of the group containers. Enable the add button
    // so the user can add a panel to fix things.

    enableAdd = true;
  }
  else
  {
    // The list panel has something in it, so get its current
    // selection and enable the add, delete and move buttons
    // if necessary.

    enableList = true;

    var selectedIndex = LIST_PANEL.getIndex();
    if (selectedIndex >= 0)
    {
      // The currently selected panel is only valid if it
      // has both a tab and content panel.

      var tabs = tp.getTabs();
      var panels = tp.getContentPanels();
      var validPanelSelected = tabs[selectedIndex] && panels[selectedIndex];

      if (validPanelSelected)
      {
        var lastIndex = Math.max(tabs.length, panels.length) - 1;

        enableAdd = true;

        // Only enable the delete button if the selected panel
        // isn't the last valid panel in the list.

        enableDel = (selectedIndex > 0 || (selectedIndex < lastIndex && tabs[selectedIndex+1] && panels[selectedIndex+1]));

        // Only enable the up button if the selected item
        // isn't the first thing in the list.

        enableUp = selectedIndex != 0;

        // Only enable the down button if the selected item isn't
        // the last valid item in the list.

        enableDown = (selectedIndex < lastIndex && tabs[selectedIndex+1] && panels[selectedIndex+1]);
      }
      else
      {
        // The currently selected item is an invalid panel, so
        // only enable the delete button so the user can get rid
        // of it.

        enableDel = true;
      }
    }
  }

  if (enableList)
    LIST_PANEL.enable();
  else
    LIST_PANEL.disable();

  if (enableDefaultList)
    DEFAULT_TAB.enable();
  else
    DEFAULT_TAB.disable();

  if (enableAdd && !errorOnPage)
  {
    ADD_BTN.removeAttribute("disabled");
    ADD_BTN.src = "../Shared/MM/Images/btnAddSmall.png";
  }
  else
  {
    ADD_BTN.setAttribute("disabled", true);
    ADD_BTN.src = "../Shared/MM/Images/btnAddSmall_dis.png";
  }
  
  if (enableDel && !errorOnPage)
  {
    DEL_BTN.removeAttribute("disabled");
    DEL_BTN.src = "../Shared/MM/Images/btnDelSmall.png";
  }
  else
  {
    DEL_BTN.setAttribute("disabled", true);
    DEL_BTN.src = "../Shared/MM/Images/btnDelSmall_dis.png";
  }

  if (enableUp && !errorOnPage)
  {
    UP_BTN.removeAttribute("disabled");
    UP_BTN.src = "../Shared/MM/Images/btnUpSmall.png";

  }
  else
  {
    UP_BTN.setAttribute("disabled", true);
    UP_BTN.src = "../Shared/MM/Images/btnUpSmall_dis.png";
  }

  if (enableDown && !errorOnPage)
  {
    DOWN_BTN.removeAttribute("disabled");
    DOWN_BTN.src = "../Shared/MM/Images/btnDownSmall.png";
  }
  else
  {
    DOWN_BTN.setAttribute("disabled", true);
    DOWN_BTN.src = "../Shared/MM/Images/btnDownSmall_dis.png";
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
  var tp = widgetMgr.getWidget('Spry.Widget.TabbedPanels', divId );
  if( !tp )
    return;
  
  var tabs = tp.getTabs();
  var panels = tp.getContentPanels();
  var numPanels = Math.max(tabs.length, panels.length);
  var numValidPanels = Math.min(tabs.length, panels.length);

  var selectedIndex = LIST_PANEL.getIndex();
  var defaultIndex = tp.getDefaultTab();
  
  if (action) 
  {
    switch (action)
    {
      case "setDefaultTab":
      {
        tp.setDefaultTab(DEFAULT_TAB.getIndex());
      }
      break;

      case "addPanel":
      {
        // Create any missing group containers if necessary.
        if (numValidPanels == 0)
          tp.repairGroupsIfNeeded();

        // Verify bounds.
        if (numValidPanels > 0 && selectedIndex >= numValidPanels)
          selectedIndex = numValidPanels - 1;

        // Add new panel after the current selection.
        tp.addPanel(selectedIndex);
        if (!numValidPanels)
        {
          defaultIndex = 0;
          selectedIndex = 0;
          tp.setDefaultTab(0);
        }
        else {
          if (defaultIndex > selectedIndex)
            tp.setDefaultTab(defaultIndex + 1);
          ++selectedIndex;
        }
      }
      break;
      
      case "deletePanel":
      {
        // Verify bounds.
        if((numValidPanels == 1 && selectedIndex == 0) || selectedIndex < 0 || selectedIndex >= numPanels )
          return;
          
        // Delete the currently selected panel.
        tp.removePanel(selectedIndex);
        if (defaultIndex > 0 && defaultIndex >= selectedIndex)
          tp.setDefaultTab(defaultIndex - 1);
        if (selectedIndex > 0)
          --selectedIndex;
      }
      break;
      
      case "movePanelUp":
      {
        // Verify bounds.
        if(numValidPanels < 2 || selectedIndex < 1 || selectedIndex >= numValidPanels)
          return;

        if (defaultIndex == selectedIndex)
          tp.setDefaultTab(defaultIndex - 1);
        else if (defaultIndex == (selectedIndex - 1))
          tp.setDefaultTab(defaultIndex + 1);

        tp.movePanelUp(selectedIndex);
        --selectedIndex;
      }
      break;
      
      case "movePanelDown":
      {
        // Verify bounds.
        if(numValidPanels < 2 || selectedIndex < 0 || (selectedIndex+1) >= numValidPanels)
          return;

        if (defaultIndex == selectedIndex)
          tp.setDefaultTab(defaultIndex + 1);
        else if (defaultIndex == (selectedIndex + 1))
          tp.setDefaultTab(defaultIndex - 1);

        tp.movePanelDown(selectedIndex);
        ++selectedIndex;
      }
      break;
      
      case "panelSelected":
      {
        // Don't need to do anything here, the refresh() or showPanel()
        // call below will show the correct panel based on selectedIndex.
      }
      break;
      
      case "id":
      {
        // Validate the new id.
        var newId = TABBEDPANELS_ID.value;
        if( newId == divId )
          return; // Nothing to change.
        
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
        
        // Update the constructor.
        tp.updateId(newId);

        // Update the WidgetManager for the new ID.
        widgetMgr.setWidget('Spry.Widget.TabbedPanels', newId, tp );
      }
      break;
      
      case "guide":
      {
        dwscripts.displayDWHelp(widgetGuide);
      }
      break;
    }
   }
  
  // All these edits modify the tabbedpanels. We need to recreate the JS Object to reflect those changes.
  tp.refresh();
  tabs = tp.getTabs(); // Re-get the tabs since they've changed.

  if(tabs.length > 0 && selectedIndex >= 0 && selectedIndex < tabs.length )
  {
    // Only show the panel if it's valid.
    if( tp.isValidPanelStructure(selectedIndex) )
      tp.showPanel(selectedIndex);
  }
  
  // Make sure selection stays on the div.
  dom.setSelectedNode(selectedNode);
   
  var error = syncControls(tp, selectedIndex, -1);
  enableControls(tp, error);
}

//--------------------------------------------------------------------
// FUNCTION:
//   setErrorMsg
//
// DESCRIPTION:
//   This internal utility function that shows/hides the error message
//   panel in the Property Inspector. If the msg passed in is not an
//   empty string, the panel is shown, otherwise it is hidden.
//
// ARGUMENTS:
//  msg - string - Error message to display.
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function setErrorMsg(msg)
{
  if (msg)
  {
    MESSAGETEXT.innerHTML = msg;
    OPTIONS_DIV.style.display = "none";
    MESSAGE.style.display = "";
  }
  else
  {
    MESSAGETEXT.innerHTML = "";
    OPTIONS_DIV.style.display = "";
    MESSAGE.style.display = "none";
  }
}
