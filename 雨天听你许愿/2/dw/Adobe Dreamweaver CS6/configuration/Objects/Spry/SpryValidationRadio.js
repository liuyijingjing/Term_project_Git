//
// Copyright 2008 Adobe Systems Incorporated.  All rights reserved.
// ----------------------------------------------------
//
// ---- Object API ---
//

//--------------------------------------------------------------------
// FUNCTION:
//   canInsertObject
//
// DESCRIPTION:
//   This function determines whether to display the Object dialog box. 
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   boolean
//--------------------------------------------------------------------
function canInsertObject() {
  var dom = dw.getDocumentDOM();
  var retVal = true;

  retVal = (dom.getIsLibraryDocument() == false);
  if( retVal )
  {
    retVal = Spry.DesignTime.Editing.Utils.canInsertWidget(dom, "Spry.Widget.ValidationRadio");
  }

  return retVal;
}

//--------------------------------------------------------------------
// FUNCTION:
//   isDOMRequired
//
// DESCRIPTION:
//   determines whether the object requires a valid DOM to operate.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   boolean
//--------------------------------------------------------------------
function isDOMRequired() {
  return true;
}

//--------------------------------------------------------------------
// FUNCTION:
//   insertObject
//
// DESCRIPTION:
//   It is called when the user clicks OK.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   string containing error message or empty string
//--------------------------------------------------------------------
function insertObject() {
  var dom = dreamweaver.getDocumentDOM();
  var selNode = dom.getSelectedNode();

  if( !Spry.DesignTime.Editing.Utils.canInsertWidget(dom) )
  {
    return;
  }

  checkParentForm(selNode);

  var cmdFile = dreamweaver.getConfigurationPath() + "/Commands/SpryValidationRadio.htm";
  var cmdDOM = dreamweaver.getDocumentDOM(cmdFile);
  dreamweaver.popupCommand("SpryValidationRadio.htm");

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

    // Add form tag 
    if( selNode && selNode.nodeType == Node.ELEMENT_NODE)
    {
      setInsertionPoint(dom, selNode);
    }
    //just insert the widget
    dom.insertHTML(retStr, false);
  }

  // Select the widget we have inserted
  selectWidgetByID(cmdDOM.parentWindow.getWidgetID());
}
