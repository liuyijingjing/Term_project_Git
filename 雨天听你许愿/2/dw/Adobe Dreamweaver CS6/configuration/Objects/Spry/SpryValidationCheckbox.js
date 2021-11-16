//
// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.
// ----------------------------------------------------
//
// ---- Object API ---
//
function canInsertObject(){
  var dom = dw.getDocumentDOM();
  var retVal = true;
  
  retVal = (dom.getIsLibraryDocument() == false);
  if( retVal )
  {
    retVal = Spry.DesignTime.Editing.Utils.canInsertWidget(dom, "Spry.Widget.ValidationCheckbox");
  }
 
  return retVal;
}

function isDOMRequired() {
	return true;
}

function insertObject() {
  var dom = dreamweaver.getDocumentDOM();
  var selNode = dom.getSelectedNode();

  if( !Spry.DesignTime.Editing.Utils.canInsertWidget(dom) )
  {
	  return;
  }
  
  checkParentForm(selNode);
  
  var cmdFile = dreamweaver.getConfigurationPath() + "/Commands/SpryValidationCheckbox.htm";
  var cmdDOM = dreamweaver.getDocumentDOM(cmdFile);
  dreamweaver.popupCommand("SpryValidationCheckbox.htm");

  var assetList = cmdDOM.parentWindow.getAssetList();
  var scriptStr = cmdDOM.parentWindow.getScriptStr();
  var retStr = cmdDOM.parentWindow.createWidgetStr();
  
  if( retStr )
  {
    // tell Dreamweaver to add js references and copy the necessary js file to the site
    if (assetList && assetList.length)
      dom.copyAssets(assetList);
    
    // add JavaScript constructor of our widget
    if (scriptStr)
      dom.addJavaScript(scriptStr, false);
      
    // Replace selection only if the selected node is a checkbox  
   	if (selNode && 
        selNode.nodeType == Node.ELEMENT_NODE && 
        selNode.tagName == "INPUT" &&
        selNode.getAttribute("type") == "checkbox"
        )
  	{
      if( selNode.parentNode && 
          selNode.parentNode.nodeType == Node.ELEMENT_NODE && 
          selNode.parentNode.tagName == "LABEL")
      {
        // remove label tag if its the parent of selected tag
    		dom.setSelectedNode(selNode.parentNode);
      }
      // replace selection with our widget
      dom.insertHTML(retStr, true);
  	}
  	else
  	{
      if( selNode && selNode.nodeType == Node.ELEMENT_NODE)
      {
        setInsertionPoint(dom, selNode);
      }      
  	  //just insert the widget
      dom.insertHTML(retStr, false);
    }
  }

  // Select the widget we have inserted
  selectWidgetByID(cmdDOM.parentWindow.getWidgetID());
}
