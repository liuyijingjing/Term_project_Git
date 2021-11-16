// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

//---------------   GLOBAL VARIABLES   ---------------
var OBJECT_FILE = dw.getConfigurationPath() + '/commands/SpryValidationSelect.htm';
var helpDoc = MM.HELP_objSpryAccordion;
var RETURN_TAG='';
var SCRIPT_STR='';
var ASSET_LIST={};
var ID;

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() 
{ 
  // Return false, indicating that this object is available in code view.
  return false;
}

function createWidget() 
{
  var dom = dw.getDocumentDOM();
  var selNode = dom.getSelectedNode();
  var sel = dom.getSelection(true);
  ID = Spry.DesignTime.Editing.Utils.getNewJSObjectName("Spry.Widget.ValidationSelect", "spryselect");
  var tagStr;

  ASSET_LIST = new Array();
  RETURN_TAG='';
  SCRIPT_STR='';
  
  
  if( !Spry.DesignTime.Editing.Utils.canInsertWidget(dom) )
  {
    return;
  }

  if( selNode && selNode.nodeType == Node.ELEMENT_NODE && selNode.tagName == "SELECT" )
  {
    //don't call returnformtag function if a select control is selected
    tagStr = Spry.DesignTime.Widget.ValidationSelect.getTagSnippet(ID, selNode);
  }
  else
  {
    tagStr = returnFormTag(Spry.DesignTime.Widget.ValidationSelect.getTagSnippet(ID, selNode));
  }

  if ( !tagStr )
    return;

  // Construct the assets list using the array of assets returned by the static getAssets() function
  var assets = Spry.DesignTime.Widget.ValidationSelect.getAssets();
  for (var i=0; i<assets.length; i++)
  {
    var assetInfo = new AssetInfo(assets[i].fullPath, assets[i].file, assets[i].type);
    ASSET_LIST.push(assetInfo);
  }
  /*
  assetInfo = new AssetInfo("Shared/Spry/Widgets/ValidationSelect/SpryValidationSelect.js", "SpryValidationSelect.js", "javascript");
  ASSET_LIST.push(assetInfo);
  
  assetInfo = new AssetInfo("Shared/Spry/Widgets/ValidationSelect/SpryValidationSelect.css", "SpryValidationSelect.css", "link");
  ASSET_LIST.push(assetInfo);
  */

  RETURN_TAG = Spry.DesignTime.Widget.ValidationSelect.getNewWidgetSnippet(ID, tagStr);
  SCRIPT_STR = Spry.DesignTime.Widget.ValidationSelect.getNewWidgetConstructorSnippet(ID);
  
  if( selectionIsContainedInTagOfType(sel, "MMTEMPLATE:IF", dom, false) )
  {
    // We're in a conditional tag, just insert the script tag right after the widget.
    RETURN_TAG = RETURN_TAG + "<script type=\"text/javascript\">\n" + SCRIPT_STR + "\n</script>";
    SCRIPT_STR = '';
  }
}

function createWidgetStr()
{
  return RETURN_TAG;
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
