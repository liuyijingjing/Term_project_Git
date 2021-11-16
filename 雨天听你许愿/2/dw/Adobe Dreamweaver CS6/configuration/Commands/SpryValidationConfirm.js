// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

//---------------   GLOBAL VARIABLES   ---------------
var OBJECT_FILE = dw.getConfigurationPath() + '/commands/SpryValidationConfirm.htm';
var helpDoc = MM.HELP_objSpryValidationConfirm;
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
  ASSET_LIST = new Array();
  RETURN_TAG='';
  SCRIPT_STR='';
  ID = Spry.DesignTime.Editing.Utils.getNewJSObjectName("Spry.Widget.ValidationConfirm", "spryconfirm");
  var opts = new Object();

  var sel = dom.getSelection(true);

  if( !Spry.DesignTime.Editing.Utils.canInsertWidget(dom) )
  {
    return;
  }

  // Set-up default values for control type and validate against properties
  var validateAgainst = "";
  var controlType = Spry.DesignTime.Widget.ValidationConfirm.DEFAULT_CONTROL_TYPE;

  // Instantiate a tag menu object to easily get the list of appropriate tags form page
  var _validateAgainst = new TagMenu("", "validateAgainst", "input/text,input/password");
  _validateAgainst.initializeUI();

  // Get all nodes found
  var nodes = _validateAgainst.listControl.getValue("all");
  var elementFound = false;

  // If we have some nodes
  if (nodes && nodes.length) {
    // Make sure they are listed in the array in the order of their appearance
    nodes = nodes.sort(
                    function (a,b) {
                      return (dom.nodeToOffsets(a)[0] < dom.nodeToOffsets(b)[0]) ? -1 : 1;
                    });

    // Then go through all of them and stop when we passed the current insertion point. The last
    // found is the one we are proposing to be the validate against control
    var tempArr;
    for (var i=0; i<nodes.length; i++) {
      tempArr = dom.nodeToOffsets(nodes[i]);
      if ((tempArr[0] < sel[0]) && (tempArr[1] < sel[1])) {
        validateAgainst = nodes[i].id;
        controlType = nodes[i].type ? nodes[i].type : "text";
        elementFound = true;
      } else {
        if (!elementFound && (nodes[i] != selNode)) {
          validateAgainst = nodes[i].id;
          controlType = nodes[i].type ? nodes[i].type : "text";
          elementFound = true;
          break;
        }
      }
    }
  }

  if (elementFound) {
    if (!(validateAgainst && validateAgainst.length)) {
      if (!confirm(dw.loadString("spry/widgets/ValidationConfirm/confirm/defaultValidateAgainstWithNoID"))) {
        return;
      }
    }
  } else {
    if (!confirm(dw.loadString("spry/widgets/ValidationConfirm/confirm/noValidateAgainstElementFound"))) {
      return;
    }
  }

  var tagSnippet = Spry.DesignTime.Widget.ValidationConfirm.getTagSnippet(selNode, controlType);
  if (Spry.DesignTime.Widget.ValidationConfirm.checkNode(selNode))
  {
    if (elementFound && (controlType.toLowerCase() != selNode.type.toLowerCase())) {
      alert(dw.loadString("spry/widgets/ValidationConfirm/warning/twoElementsOfDifferentTypes"));
    }

    //don't call returnformtag function if a select control is selected
    tagStr = tagSnippet;
  }
  else
  {
    tagStr = returnFormTag(tagSnippet);
  }

  if ( !tagStr )
    return;

  // Construct the assets list using the array of assets returned by the static getAssets() function
  var assets = Spry.DesignTime.Widget.ValidationConfirm.getAssets();
  for (var i=0; i<assets.length; i++)
  {
    var assetInfo = new AssetInfo(assets[i].fullPath, assets[i].file, assets[i].type);
    ASSET_LIST.push(assetInfo);
  }

  SCRIPT_STR = Spry.DesignTime.Widget.ValidationConfirm.getNewValidationConfirmConstructorSnippet(ID, validateAgainst);
  RETURN_TAG = Spry.DesignTime.Widget.ValidationConfirm.getNewValidationConfirmSnippet(ID, opts, tagStr);

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
