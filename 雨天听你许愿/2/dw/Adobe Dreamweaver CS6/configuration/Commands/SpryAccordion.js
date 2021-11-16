// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

//---------------   GLOBAL VARIABLES   ---------------
var OBJECT_FILE = dw.getConfigurationPath() + '/commands/SpryAccordion.htm';
var helpDoc = MM.HELP_objSpryAccordion;
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
  var assets = Spry.DesignTime.Widget.Accordion.getAssets();
  for (var i=0; i<assets.length; i++)
  {
    var assetInfo = new AssetInfo(assets[i].fullPath, assets[i].file, assets[i].type);
    ASSET_LIST.push(assetInfo);
  }
  /*
  assetInfo = new AssetInfo("Shared/Spry/Widgets/Accordion/SpryAccordion.js", "SpryAccordion.js", "javascript");
  ASSET_LIST.push(assetInfo);
  
  assetInfo = new AssetInfo("Shared/Spry/Widgets/Accordion/SpryAccordion.css", "SpryAccordion.css", "link");
  ASSET_LIST.push(assetInfo);
  */
  
  var id =  Spry.DesignTime.Editing.Utils.getNewJSObjectName("Spry.Widget.Accordion", "Accordion");
  SCRIPT_STR = Spry.DesignTime.Widget.Accordion.getNewAccordionConstructorSnippet(id);
  
  RETURN_TAG = Spry.DesignTime.Widget.Accordion.getNewAccordionSnippet( id );
  
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
