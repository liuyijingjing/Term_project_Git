//Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piAccordion;
var widgetGuide = MM.HELP_piAccordionGuide;

var ACCORDION_ID;
var PANEL_HEIGHT;
var MESSAGE;
var MESSAGETEXT;
var LIST_PANEL;
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
//   true if the currently selected node is a Accordion element,
//   false if it is not.
//--------------------------------------------------------------------

function canInspectSelection() 
{
  var bCanInspectSelection = false;
  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode();

  if ( !selectedNode || !selectedNode.getTranslatedAttribute )
    return false;
  
  var attr = selectedNode.getTranslatedAttribute('Spry.Widget.Accordion');
  
  if ( attr && attr.length > 0 )
  {
    bCanInspectSelection = true;
    
    // If the widget manager is out of sync, run the translator
    var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom); 
    if ( !widgetMgr.getWidget('Spry.Widget.Accordion', selectedNode.id ) )
    {
      dom.runTranslator("Spry Widget");

      if ( !widgetMgr.getWidget('Spry.Widget.Accordion', selectedNode.id ) )
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
  ACCORDION_ID = document.getElementById("idEditBox");
  ACCORDION_ID.value = "";  
  MESSAGE = document.getElementById("message");
  MESSAGETEXT = document.getElementById("messageText");
  MESSAGETEXT.innerHTML = "";
  LIST_PANEL = new ListControl("panelList");
  ADD_BTN = document.getElementById("elemAdd");
  DEL_BTN = document.getElementById("elemDel");
  UP_BTN = document.getElementById("elemUp");
  DOWN_BTN = document.getElementById("elemDown");
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
  ACCORDION_ID.value = divId;
  
  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom); 
  var acc = widgetMgr.getWidget('Spry.Widget.Accordion', divId );
  
  if ( !acc )
  {
    displayTopLayerErrorMessage(dw.loadString("spry/widget/alert/broken structure"));
    return;
  }
  
  clearTopLayerErrorMessage();    
  
  // Enumerate over the list of panels.

  var panelLabels = new Array();
  var panels = [];
  if ( acc )
    panels = acc.getPanels();
  var selIndex = 0;
  var isBroken = false;

  for (var i=0; i < panels.length; i++)
  {
    var label = "";
    var labelNode = acc.getPanelTab(panels[i]);
      
    if ( Spry.DesignTime.Widget.Accordion.isValidPanelStructure(panels[i]) )
    {
      var labelNode = acc.getPanelTab(panels[i]);
      
      if ( labelNode )
      {
        label = dwscripts.collectTextInNode(labelNode);
        label = dwscripts.entityNameDecode(label); 
        label = dwscripts.trim(label);

        if (label.length == 0)
            label = dw.loadString("spry/widget/unlabeled panel");
      }
      else
      {
        label = dw.loadString("spry/widget/broken panel");
          isBroken = true;
      }
    }
    else
    {
      label = dw.loadString("spry/widget/broken panel");
      isBroken = true;
    }
    
    panelLabels.push( label );
    if ( panels[i] == acc.currentPanel )
      selIndex = i;
  }
  
  if ( isBroken )
  {
    // Show a warning message in the PI.
    MESSAGETEXT.innerHTML = dw.loadString("spry/widgets/accordion/alert/broken structure");
    MESSAGE.style.display = "";
  }
  else
  {
    MESSAGETEXT.innerHTML = "";
    MESSAGE.style.display = "none";
  }
  
  if ( typeof(selectedPanelIndex) != "undefined" && selectedPanelIndex < panels.length)
    selIndex = selectedPanelIndex;
  
  // Set the list values.
  LIST_PANEL.setAll(panelLabels,panelLabels);
  if ( panelLabels.length )
  {
       LIST_PANEL.setIndex(selIndex);
  }

  enableControls(acc, isBroken);
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
//  acc - object - The widget design-time object.
//  errorOnPage - boolean - true if the widget markup is invalid,
//                          false if the markup is valid.
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function enableControls(acc, errorOnPage)
{
  if (LIST_PANEL.getLen() > 1)
       LIST_PANEL.enable();
  else
       LIST_PANEL.disable();

  if (!errorOnPage)
  {
    ADD_BTN.removeAttribute("disabled");
    ADD_BTN.src = "../Shared/MM/Images/btnAddSmall.png";
  }
  else
  {
    ADD_BTN.setAttribute("disabled", true);
    ADD_BTN.src = "../Shared/MM/Images/btnAddSmall_dis.png";
  }

  if (!errorOnPage)
  {
    DEL_BTN.removeAttribute("disabled");
    DEL_BTN.src = "../Shared/MM/Images/btnDelSmall.png";
  }
  else
  {
    DEL_BTN.setAttribute("disabled", true);
    DEL_BTN.src = "../Shared/MM/Images/btnDelSmall_dis.png";
  }

  if (!errorOnPage)
  {
    UP_BTN.removeAttribute("disabled");
    UP_BTN.src = "../Shared/MM/Images/btnUpSmall.png";

  }
  else
  {
    UP_BTN.setAttribute("disabled", true);
    UP_BTN.src = "../Shared/MM/Images/btnUpSmall_dis.png";
  }

  if (!errorOnPage)
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
  var acc = widgetMgr.getWidget('Spry.Widget.Accordion', divId );
  if ( !acc )
    return;
  
  var panels = acc.getPanels();
  var selIndex = LIST_PANEL.getIndex();
  
  if (action) 
  {
    switch (action)
    {
      case "addPanel":
      {
        // Add new panel after the current selection.
        acc.addNewPanel();
        if ( panels.length > 0 ){
          // Add after current panel.
          selIndex = selIndex+1;
        }
        else {
          selIndex = 0;
        }
        
      }
      break;
      
      case "deletePanel":
      {
        // Verify bounds.
        if (!panels || panels.length < 0 || selIndex < 0 || selIndex >= panels.length )
          return;
          
        // Delete the currently selected panel.
        var selPanel = panels[selIndex];
        selPanel.outerHTML = "";
        
        var newPanelLength = panels.length -1;
        if ( newPanelLength <= selIndex )
          selIndex = newPanelLength -1;
      }
      break;
      
      case "movePanelUp":
      {
        // Verify bounds.
        if (!panels || panels.length < 0 || (selIndex-1) < 0 || selIndex >= panels.length )
          return;
          
        var selPanel = panels[selIndex];
        var siblingPanel = panels[selIndex-1];
        
        siblingPanel.outerHTML = selPanel.outerHTML + siblingPanel.outerHTML;
        selPanel.outerHTML = "";
        
        selIndex = selIndex-1;
      }
      break;
      
      case "movePanelDown":
      {
        // Verify bounds.
        if (!panels || panels.length < 0 || selIndex < 0 || (selIndex+1) >= panels.length )
          return;
          
        var selPanel = panels[selIndex];
        var siblingPanel = panels[selIndex+1];
        
        siblingPanel.outerHTML = siblingPanel.outerHTML + selPanel.outerHTML;
        selPanel.outerHTML = "";
        
        selIndex = selIndex+1;
      
      }
      break;
      
      case "panelSelected":
      {
        // Don't need to do anything, the refresh below will set it to the correct index.
      }
      break;
      
      case "id":
      {
        // Validate the new id.
        var newId = ACCORDION_ID.value;
        if ( newId == divId )
          return; // Nothing to change.
        
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
        acc.updateId(newId);

        // Update the WidgetManager for the new ID.
        widgetMgr.setWidget('Spry.Widget.Accordion', newId, acc );
      }
      break;
      
      case "guide":
      {
        dwscripts.displayDWHelp(widgetGuide);
      }
      break;      
    }
   }
  
  // All these edits modify the accordian. We need to recreate the JS Object to reflect those changes.
  acc.refresh();
  panels = acc.getPanels(); // Re-get the panels since they've changed.

  if (panels && panels.length > 0 && selIndex >= 0 && selIndex < panels.length )
  {
    // Only open the panel if it's valid.
    if ( Spry.DesignTime.Widget.Accordion.isValidPanelStructure(panels[selIndex]) )
      acc.openPanel(panels[selIndex]);
  }

  // Make sure selection stays on the div.
  dom.setSelectedNode(selectedNode); 
  inspectSelection();
  LIST_PANEL.setIndex(selIndex);
}
