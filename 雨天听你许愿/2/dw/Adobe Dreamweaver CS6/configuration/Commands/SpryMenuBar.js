// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

//---------------   GLOBAL VARIABLES   ---------------
var OBJECT_FILE = dw.getConfigurationPath() + '/commands/SpryMenuBar.htm';
var helpDoc = MM.HELP_objSpryMenuBar;
var returnTag='';
var scriptStr='';
var assetList={};

//---------------     API FUNCTIONS    ---------------

function commandButtons()
{
   return new Array(MM.BTN_OK,         "createWidget();window.close()",
                    MM.BTN_Cancel,     "window.close()",
                    MM.BTN_Help,       "displayHelp()"    );
}

function isDOMRequired() 
{ 
  // Return false, indicating that this object is available in code view.
  return false;
}

function createWidget() 
{
  var dom = dw.getDocumentDOM();
  assetList = new Array();
  returnTag='';
  scriptStr='';
  
  var sel = dom.getSelection(true);
  
  if( !Spry.DesignTime.Editing.Utils.canInsertWidget(dom) )
  {
	  return;
  }
  
  FORM = document.forms[0];
  var id = Spry.DesignTime.Editing.Utils.getNewJSObjectName("Spry.Widget.MenuBar", "MenuBar");
  var opts = new Object;
  var strAssetsPath = dom.getDefaultAssetFolder();
  if(site.getDefaultRelativeTo() == "site")
  {
    strAssetsPath = dom.localPathToSiteRelative(strAssetsPath);
  }
  else
  {
    strAssetsPath = dw.absoluteURLToDocRelative(dreamweaver.getDocumentPath("DOCUMENT"),dreamweaver.getSiteRoot(),dwscripts.filePathToLocalURL(strAssetsPath));
  }
  var options = '{';
  
  
  // Construct the assets list using the array of assets returned by the static getAssets() function
  var assets = Spry.DesignTime.Widget.MenuBar.getAssets(FORM.orientation[0].checked == true);
  for (var i=0; i<assets.length; i++)
  {
    assetInfo = new AssetInfo(assets[i].fullPath, assets[i].file, assets[i].type);
    assetList.push(assetInfo);
  }
  /*
  assetInfo = new AssetInfo("Shared/Spry/Widgets/MenuBar/SpryMenuBar.js", "SpryMenuBar.js", "javascript");
  assetList.push(assetInfo);
  
  if(FORM.orientation[0].checked==true)
  {
	  assetInfo = new AssetInfo("Shared/Spry/Widgets/MenuBar/SpryMenuBarHorizontal.css", "SpryMenuBarHorizontal.css", "link");
	  assetList.push(assetInfo);
	  assetInfo = new AssetInfo("Shared/Spry/Widgets/MenuBar/SpryMenuBarDown.gif", "SpryMenuBarDown.gif", "");
	  assetList.push(assetInfo);
	  assetInfo = new AssetInfo("Shared/Spry/Widgets/MenuBar/SpryMenuBarDownHover.gif", "SpryMenuBarDownHover.gif", "");
	  assetList.push(assetInfo);
  }
  else
  {
	  assetInfo = new AssetInfo("Shared/Spry/Widgets/MenuBar/SpryMenuBarVertical.css", "SpryMenuBarVertical.css", "link");
	  assetList.push(assetInfo);
  }

  assetInfo = new AssetInfo("Shared/Spry/Widgets/MenuBar/SpryMenuBarRight.gif", "SpryMenuBarRight.gif", "");
  assetList.push(assetInfo);
  assetInfo = new AssetInfo("Shared/Spry/Widgets/MenuBar/SpryMenuBarRightHover.gif", "SpryMenuBarRightHover.gif", "");
  assetList.push(assetInfo);
  */

  opts.label = dw.loadString('spry/widgets/menubar/defaultSnippet/label');
  if(FORM.orientation[0].checked==true)
  {
	  opts.orientation = "MenuBarHorizontal";
	  options += 'imgDown:"' + strAssetsPath + 'SpryMenuBarDownHover.gif", ';
  }
  else
  {
	  opts.orientation = "MenuBarVertical";
  }
  options += 'imgRight:"' + strAssetsPath + 'SpryMenuBarRightHover.gif"}';
  scriptStr = Spry.DesignTime.Widget.MenuBar.getNewMenuBarConstructorSnippet(id, options);
  returnTag = Spry.DesignTime.Widget.MenuBar.getNewMenuBarSnippet( id, opts );
  
  if( selectionIsContainedInTagOfType(sel, "MMTEMPLATE:IF", dom, false) )
  {
	  //we're in a conditional tag, just insert the script tag right after the widget
	  returnTag = returnTag + "<script type=\"text/javascript\">\n" + scriptStr + "\n</script>";
	  scriptStr = '';
  }	
}

function initialize()
{
  var dom = dw.getDocumentDOM();
  assetList = new Array();
  returnTag='';
  scriptStr='';
  
  if(!Spry.DesignTime.Editing.Utils.canInsertWidget(dom))
  {
	// alert was handled by canInsertWidget()
	window.close();
	return;
  }
  else if(dom.isSelInsideTag("UL") || dom.isSelInsideTag("OL"))
  {
	// check if we're in a Menu Bar
	var node = dom.getSelectedNode();
	var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom); 
	while(node)
	{
		if(widgetMgr.getWidget('Spry.Widget.MenuBar', node.id ))
		{
			// can't insert within another menu
			alert(dw.loadString("spry/widgets/menubar/error/insert/within menu"));
			window.close();
			return;
		}
		node = node.parentNode;
	}

	// can't insert within another list
	alert(dw.loadString("spry/widgets/menubar/error/insert/within list"));
	window.close();
	return;
  }
  
  FORM = document.forms[0];
  FORM.orientation[0].checked=true;
}

function createWidgetStr()
{
  return returnTag;
}

function getScriptStr()
{
  return scriptStr;
}

function getAssetList()
{
  return assetList;
}
