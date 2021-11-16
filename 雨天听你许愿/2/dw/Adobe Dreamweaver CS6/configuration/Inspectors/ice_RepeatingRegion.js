/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2008 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
*
* AdobePatentID="B564"
* AdobePatentID="B565"
*
**************************************************************************/

var helpID = MM.ICE_HELP_RepeatingRegionPI;

var _groupNode;
var _groupLink;


// ********************* API FUNCTIONS ***************************

//--------------------------------------------------------------------
// FUNCTION:
//   canInspectSelection
//
// DESCRIPTION:
//   This function decides whether the current selection (selected
//   region) is a valid region and is not incomplete or has a broken
//   structure.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   (boolean)
//--------------------------------------------------------------------
function canInspectSelection() {
  var bCanInspectSelection = false;
  var dom = dw.getDocumentDOM();
  var selectedNode = getSelectedNode(dom);

  if (selectedNode && selectedNode.getTranslatedAttribute) {
    // We should display the PI for Repeating is and only if the current selected node is a Repeating Region *and* is not a Editable Region
    // (if it is also a Editable Region then the Ediatble Region PI will be displayed; this is a workaround since the PI property seems to not
    // work as expected)
    if (!selectedNode.getTranslatedAttribute(ICEUtils.typeEditableRegion) && selectedNode.getTranslatedAttribute(ICEUtils.typeRepeatingRegion)) {
      bCanInspectSelection = true;
    }
  }

  return bCanInspectSelection; // comments in html file limit us to just one tag
}


//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   This function initializes the global variables with appropriate
//   control objects for later usage.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function initializeUI() {
  _groupLink = document.getElementById("groupLink");
  _groupLink.setAttribute("onMouseDown", "updateTag('changeGroupOptions');");
}


//--------------------------------------------------------------------
// FUNCTION:
//   inspectSelection
//
// DESCRIPTION:
//   This function inspects the current selected widget, if it matches
//   our validation criteria (e.g.: is not incomplete or damaged). This
//   function populates the PI UI with the appropriate values read from
//   the selection and also updates the disabled state of various
//   controls.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function inspectSelection() {
  // Call initializeUI() here; it's how the global variables get
  // initialized. The onLoad event on the body tag is never triggered
  // in inspectors.
  initializeUI();

  var dom = dw.getDocumentDOM();
  var selectedNode = getSelectedNode(dom);
  var bottomLayer = document.getElementById("bottomLayer");

  if (!canInspectSelection()) {
    return;
  }

  var nodeProps = ICEUtils.checkNode(dom, selectedNode, []);
  _groupNode = getGroupNode(selectedNode);

  if (!_groupNode) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegion/PI/error/noGroup"));
  } else if (nodeProps & ICEUtils.NODE_SERVER_SIDE) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegion/PI/error/serverSide"));
  } else if (nodeProps & ICEUtils.NODE_CONTAINS_ICE_REPEATING) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegion/PI/error/containsICERepeating"));
  } else if (nodeProps & ICEUtils.NODE_CONTAINS_ICE_REPREGGROUP) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegion/PI/error/containsICERepeatingGroup"));
  } else if (nodeProps & ICEUtils.NODE_INSIDE_ICE_EDITABLE) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegion/PI/error/insideICEEditable"));
  } else if (nodeProps & ICEUtils.NODE_INSIDE_ICE_REPEATING) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegion/PI/error/insideICERepeating"));
  } else if ((nodeProps & ICEUtils.NODE_OUTSIDE_DWT_EDITABLE_REGION) && (!selectedNode.parentNode || ((ICEUtils.checkNode(dom, selectedNode.parentNode, []) & ICEUtils.NODE_IS_DWT_REPEATING_REGION) == 0))) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegion/PI/error/outsideDWTEditable"));
  } else {
    bottomLayer.removeAttribute("class");
    clearTopLayerErrorMessage();
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   existsOptions
//
// DESCRIPTION:
//   This function searched for optionsToSearch in the searchedOptions.
//   The order in which they will be found is not important. The funtion
//   will return TRUE if and only if all optionsToSearch are found in
//   the searchedOptions.
//
// ARGUMENTS:
//   optionsToSearch (string) - single option or comma separated list
//                              of options to look for
//   searchedOptions (string) - single option or comma separated list
//                              of options that will be searched
//
// RETURNS:
//   (boolean) - TRUE if and only if all optionsToSearch are found in
//               the searchedOptions, FALSE otherwise
//--------------------------------------------------------------------
function existsOptions(optionsToSearch, searchedOptions) {
  var retVal = false;

  if (optionsToSearch && optionsToSearch.length && searchedOptions && searchedOptions.length) {
    var optionsToSearchArr = optionsToSearch.replace(/\s*,\s*/gi, ",").split(",");
    var searchedOptionsArr = searchedOptions.replace(/\s*,\s*/gi, ",").split(",");

    if (optionsToSearchArr.length && searchedOptionsArr.length) {
      // Let's suppose that we have all of the options to search in the searched options
      retVal = true;

      // And look for at least one which is not in the searched options list
      for (var i=0; i<optionsToSearchArr.length; i++) {
        if (dwscripts.findInArray(searchedOptionsArr, optionsToSearchArr[i]) == -1) {
          retVal = false;
          break;
        }
      }
    }
  }

  return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   displayHelp
//
// DESCRIPTION:
//   This function is called when help button is pressed within the PI
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function displayHelp() {
  ICEUtils.displayHelp(helpID);
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateTag
//
// DESCRIPTION:
//   This function performs the most code updates the user can trigger
//   from the UI (by changing the values from controls or pressing
//   various links and buttons).
//
// ARGUMENTS:
//   attrib
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateTag(attrib) {
  var dom = dw.getDocumentDOM();

  if (!canInspectSelection()) {
    return;
  }

  if (attrib) {
    switch (attrib) {
      case "changeGroupOptions":
        if (_groupNode) {
          dom.setSelectedNode(_groupNode, false, true);
        }
        break;

      case "gettingStartedWithICE":
        ICEUtils.showGettingStarted();
        break;
    }
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   removeRegion
//
// DESCRIPTION:
//   This function removes the region.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function removeRegion() {
  var dom = dw.getDocumentDOM();
  var selectedNode = getSelectedNode(dom);

  if (!canInspectSelection()) {
    return;
  }

  if (confirm(dw.loadString("ice/repeatingRegion/PI/message/removeRegion").replace(/\\n/gi, "\n"))) {
    selectedNode.removeAttribute(ICEUtils.repeatingRegionAttrName);

    // Also remove the Repeating Regions Group property from the parent node
    // if this was the last Repeating Region
    var groupNode = getGroupNode(selectedNode);
    if (groupNode && (!(ICEUtils.checkNode(dom, groupNode, []) & ICEUtils.NODE_CONTAINS_ICE_REPEATING))) {
      groupNode.removeAttribute(ICEUtils.repeatingRegionsGroupAttrName);
    }

    ICEUtils.removeScriptTag(dom);
    ICEUtils.removeICENamespace(dom);
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   getSelectedNode
//
// DESCRIPTION:
//   This function returns the current selected node. In some cases (when
//   a TD/TH is selected), the dom.getSelectedNode() fails to return the
//   correct node (it retunrs the entire TABLE) and therefore we are
//   implementing this function.
//
// ARGUMENTS:
//   dom (DOM Object) - the current DOM.
//
// RETURNS:
//   (HTML node) - current selected node
//--------------------------------------------------------------------
function getSelectedNode(dom) {
  return dom.getSelectedNode(true, false, true);
}


//--------------------------------------------------------------------
// FUNCTION:
//   getGroupNode
//
// DESCRIPTION:
//   This function retunrs the current region's group node.
//
// ARGUMENTS:
//   node (HTML Object) - the current node
//
// RETURNS:
//   (HTML Object) - the appropriate group node or NULL if not found
//--------------------------------------------------------------------
function getGroupNode(node) {
  var groupNode = node;

  while (groupNode) {
    if (groupNode && groupNode.getTranslatedAttribute && groupNode.getTranslatedAttribute(ICEUtils.typeRepeatingRegionsGroup)) {
      break;
    }
    groupNode = groupNode.parentNode;
  }

  return groupNode;
}

