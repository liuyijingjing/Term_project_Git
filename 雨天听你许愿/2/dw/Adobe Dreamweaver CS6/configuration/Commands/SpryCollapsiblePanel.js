// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

//---------------   GLOBAL VARIABLES   ---------------
var OBJECT_FILE = dw.getConfigurationPath() + '/commands/SpryCollapsiblePanel.htm';
var helpDoc = MM.HELP_objSpryCollapsiblePanel;
var RETURN_TAG='';
var SCRIPT_STR='';
var ASSET_LIST={};

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() 
{ 
  // Return false, indicating that this object is available in code view.
  return false;
}

function createWidget() 
{
  var dom = dw.getDocumentDOM();
  ASSET_LIST = new Array();
  RETURN_TAG='';
  SCRIPT_STR='';
  
  var sel = dom.getSelection(true);
  
  if( !Spry.DesignTime.Editing.Utils.canInsertWidget(dom) )
  {
    return;
  }
  
  // Construct the assets list using the array of assets returned by the static getAssets() function
  var assets = Spry.DesignTime.Widget.CollapsiblePanel.getAssets();
  for (var i=0; i<assets.length; i++)
  {
    var assetInfo = new AssetInfo(assets[i].fullPath, assets[i].file, assets[i].type);
    ASSET_LIST.push(assetInfo);
  }
  /*
  assetInfo = new AssetInfo("Shared/Spry/Widgets/CollapsiblePanel/SpryCollapsiblePanel.js", "SpryCollapsiblePanel.js", "javascript");
  ASSET_LIST.push(assetInfo);
  
  assetInfo = new AssetInfo("Shared/Spry/Widgets/CollapsiblePanel/SpryCollapsiblePanel.css", "SpryCollapsiblePanel.css", "link");
  ASSET_LIST.push(assetInfo);
  */

  var id = Spry.DesignTime.Editing.Utils.getNewJSObjectName("Spry.Widget.CollapsiblePanel", "CollapsiblePanel");
  SCRIPT_STR = Spry.DesignTime.Widget.CollapsiblePanel.getConstructorSnippet(id);
  
  var label = dw.loadString('spry/widgets/collapsiblepanel/newSnippet/label');
  var content = dw.loadString('spry/widgets/collapsiblepanel/newSnippet/content');
  
  RETURN_TAG = Spry.DesignTime.Widget.CollapsiblePanel.getMarkupSnippet(id, label, content);
  
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
