//
// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.
// ----------------------------------------------------
//
// ---- Object API ---
//
function canInsertObject() {
  var dom = dw.getDocumentDOM();
  var retVal = true;

  retVal = (dom.getIsLibraryDocument() == false);
  if( retVal )
  {
    retVal = Spry.DesignTime.Editing.Utils.canInsertWidget(dom, "Spry.Widget.ValidationConfirm");
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

  var cmdFile = dreamweaver.getConfigurationPath() + "/Commands/SpryValidationConfirm.htm";
  var cmdDOM = dreamweaver.getDocumentDOM(cmdFile);
  dreamweaver.popupCommand("SpryValidationConfirm.htm");

  var assetList = cmdDOM.parentWindow.getAssetList();
  var scriptStr = cmdDOM.parentWindow.getScriptStr();

  var retStr = cmdDOM.parentWindow.createWidgetStr();

  if (retStr)
  {
    // tell Dreamweaver to add js references and copy the necessary js file to the site
    if (assetList && assetList.length)
      dom.copyAssets(assetList);

    // add JavaScript constructor of our widget
    if (scriptStr)
      dom.addJavaScript(scriptStr, false);

    // Add form tag and replace selection only if the selected node is a select
    if (Spry.DesignTime.Widget.ValidationConfirm.checkNode(selNode))
    {
      // Remove label tag if its the parent of selected tag
      if( selNode.parentNode && selNode.parentNode.nodeType == Node.ELEMENT_NODE && selNode.parentNode.tagName.toLowerCase() == "label")
      {
        dom.setSelectedNode(selNode.parentNode);
      }
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
