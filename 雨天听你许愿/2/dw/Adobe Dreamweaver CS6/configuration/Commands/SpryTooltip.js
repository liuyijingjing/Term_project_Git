// Copyright 2008 Adobe Systems Incorporated.  All rights reserved.

//---------------   GLOBAL VARIABLES   ---------------
var helpDoc = MM.HELP_objSpryTooltip;
var TRIGGER_TAG='';
var SCRIPT_STR='';
var ASSET_LIST={};
var TRIGGER_ID='';
var ID;

//---------------     API FUNCTIONS    ---------------
function isDOMRequired()
{
  // We return true here because we need the DOM to be in
  // sync with whatever is in Code View before we attempt to
  // insert our tooltip. The tooltip code uses the DOM to
  // determine what is currently selected.
  
  return true;
}

function createWidget()
{
  var dom = dw.getDocumentDOM();
  var selNode = dom.getSelectedNode();
  var sel = dom.getSelection(true);
  var triggerId='';
    
  ASSET_LIST = new Array();
  TRIGGER_TAG='';
  TOOLTIP_TAG='';
  SCRIPT_STR='';
  TRIGGER_ID ='';
  
  ID = Spry.DesignTime.Editing.Utils.getNewJSObjectName("Spry.Widget.Tooltip", "sprytooltip");

  if( !Spry.DesignTime.Editing.Utils.canInsertWidget(dom) )
  {
    return;
  }

  //check for an existing ID for trigger
  if(selNode.nodeType == Node.ELEMENT_NODE )
  {
    triggerId = selNode.getAttribute("id");    
  }
  
  //generate trigger ID  
  if (!triggerId)
  {
    //getUniqueId returns the first ID without any number
    triggerId = getUniqueTriggerId("sprytrigger");
  }
  TRIGGER_ID = triggerId;
        
  var triggerSnippet = Spry.DesignTime.Widget.Tooltip.getTriggerSnippet(triggerId);
  TRIGGER_TAG = triggerSnippet;  

  // Construct the assets list using the array of assets returned by the static getAssets() function
  var assets = Spry.DesignTime.Widget.Tooltip.getAssets();
  for (var i=0; i<assets.length; i++)
  {
    var assetInfo = new AssetInfo(assets[i].fullPath, assets[i].file, assets[i].type);
    ASSET_LIST.push(assetInfo);
  }
   
  SCRIPT_STR = Spry.DesignTime.Widget.Tooltip.getNewTooltipConstructorSnippet(ID, triggerId);
  TOOLTIP_TAG = Spry.DesignTime.Widget.Tooltip.getNewTooltipSnippet(ID);

  if( selectionIsContainedInTagOfType(sel, "MMTEMPLATE:IF", dom, false) )
  {
    // We're in a conditional tag, just insert the script tag right after the widget.
    TRIGGER_TAG = TRIGGER_TAG + "<script type=\"text/javascript\">\n" + SCRIPT_STR + "\n</script>";
    SCRIPT_STR = '';
  }
}

//---------------     UTILITY  FUNCTIONS    ---------------

function getTriggerStr()
{
  return TRIGGER_TAG;
}

function getTooltipStr()
{
  return TOOLTIP_TAG;
}

function getScriptStr()
{
  return SCRIPT_STR;
}

function getAssetList()
{
  return ASSET_LIST;
}

function getWidgetID() {
  return ID;
}

function getTriggerID() {
  return TRIGGER_ID;
}

//--------------------------------------------------------------------
// FUNCTION:
//   getUniqueTriggerId
//
// DESCRIPTION:
//   Given a base name, checks entire document to determine a unique name.
//   Unique names are formed by adding a count to the base name.
//
//  This is inspired by the dwscripts.getUniqueId("menu"), but
//  it returns from the first invocation "menu1", instead of "menu" only
//
// ARGUMENTS:
//   baseName - string - the root variable name, to which the count
//     will be added.
//
// RETURNS:
//   string
//--------------------------------------------------------------------

function getUniqueTriggerId(baseName)
{
  var dom = dw.getDocumentDOM();
  var tagCounter = 1;
  var possName = baseName + 1;

  var idElems = dom.body.getElementsByAttributeName("id");
  var idArray = new Array();
  var currId = '';
  
  for (var i=0; i < idElems.length; i++)
  {
    currId = idElems[i].getAttribute("id");
    if (currId)
    {
      idArray.push(currId);
  }
  }
  
  while (dwscripts.findInArray(idArray,possName) != -1)  
  {
    tagCounter++;
    possName = baseName+tagCounter;
  }  
  
  return possName;
}
