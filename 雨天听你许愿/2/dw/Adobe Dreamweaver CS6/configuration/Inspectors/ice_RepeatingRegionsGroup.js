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

var helpID = MM.ICE_HELP_RepeatingRegionsGroupPI;

var _options_up_down; // = new CheckBox("", "options_up_down");
var _options_add_remove; // = new CheckBox("", "options_add_remove");


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

  if (selectedNode && selectedNode.getTranslatedAttribute && selectedNode.getTranslatedAttribute(ICEUtils.typeRepeatingRegionsGroup)) {
    bCanInspectSelection = true;
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
  _options_up_down = dwscripts.findDOMObject("options_up_down");
  _options_add_remove = dwscripts.findDOMObject("options_add_remove");
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
  var isError = false;

  if (!(nodeProps & ICEUtils.NODE_CONTAINS_ICE_REPEATING)) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegionsGroup/PI/error/noRepeatingInGroup"));
    isError = true;
  } else if (nodeProps & ICEUtils.NODE_SERVER_SIDE) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegionsGroup/PI/error/serverSide"));
    isError = true;
  } else if (nodeProps & ICEUtils.NODE_CONTAINS_ICE_REPREGGROUP) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegionsGroup/PI/error/containsICERepeatingGroup"));
    isError = true;
  } else if (nodeProps & ICEUtils.NODE_INSIDE_ICE_EDITABLE) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegionsGroup/PI/error/insideICEEditable"));
    isError = true;
  } else if (nodeProps & ICEUtils.NODE_INSIDE_ICE_REPEATING) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegionsGroup/PI/error/insideICERepeating"));
    isError = true;
  } else if (nodeProps & ICEUtils.NODE_INSIDE_ICE_REPREGGROUP) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegionsGroup/PI/error/insideICERepeatingGroup"));
    isError = true;
  } else if (nodeProps & ICEUtils.NODE_OUTSIDE_DWT_EDITABLE_REGION) {
    var hasNoDWTRepReg = true;
    if (selectedNode.childNodes) {
      for (var i=0; i<selectedNode.childNodes.length; i++) {
        if ((ICEUtils.checkNode(dom, selectedNode.childNodes[i], []) & ICEUtils.NODE_IS_DWT_REPEATING_REGION) != 0) {
          hasNoDWTRepReg = false;
          break;
        }
      }
    }
    if (hasNoDWTRepReg) {
      bottomLayer.setAttribute("class", "hiddenRegion");
      displayTopLayerErrorMessage(dw.loadString("ice/repeatingRegionsGroup/PI/error/outsideDWTEditable"));
      isError = true;
    }
  }

  if (!isError) {
    var optStr = selectedNode.getAttribute(ICEUtils.repeatingRegionsGroupAttrName);
    if (dwscripts.findInArray(optStr.split(","), ICEUtils.repeatingRegionsGroupAttrAllValue) != -1) {
      _options_up_down.checked = true;
      _options_add_remove.checked = true;
    } else {
      _options_up_down.checked = existsOptions(_options_up_down.value, optStr);
      _options_add_remove.checked = existsOptions(_options_add_remove.value, optStr);
    }

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
  if (!canInspectSelection()) {
    return;
  }

  if (attrib) {
    switch (attrib) {
      case "groupoptions":
				buttonChecked();
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

  if (confirm(dw.loadString("ice/repeatingRegionsGroup/PI/message/removeRegion").replace(/\\n/gi, "\n"))) {
    selectedNode.removeAttribute(ICEUtils.repeatingRegionsGroupAttrName);

    // Also remove any contained Repeating Region property from any of the child nodes
    // since they are not working anymore.
    for (var i=0; i<selectedNode.childNodes.length; i++) {
      if (selectedNode.childNodes[i] && selectedNode.childNodes[i].getAttribute && selectedNode.childNodes[i].getAttribute(ICEUtils.repeatingRegionAttrName)) {
        selectedNode.childNodes[i].removeAttribute(ICEUtils.repeatingRegionAttrName);
      }
    }

    ICEUtils.removeScriptTag(dom);
    ICEUtils.removeICENamespace(dom);
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   buttonChecked
//
// DESCRIPTION:
//   This function updates the selectedNode with the actual set of
//   options form the displayed PI.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function buttonChecked() {
  var dom = dw.getDocumentDOM();
  var selectedNode = getSelectedNode(dom);
  var buttons = [_options_add_remove, _options_up_down];
  var state;
  var tempArr;

  if (!canInspectSelection()) {
    return;
  }

  // Inspect current options
  var currOpts = selectedNode.getAttribute(ICEUtils.repeatingRegionsGroupAttrName);
  currOpts = currOpts.replace(/\s*,\s*/gi, ",");
  currOptsArr = currOpts.split(",");
  var optsHash = new Object();
  for (var i=0; i<currOptsArr.length; i++) {
    if (currOptsArr[i] == ICEUtils.repeatingRegionsGroupAttrAllValue) {
			for (var j=0; j<buttons.length; j++) {
				tempArr = buttons[j].value.split(",");
				for (var k=0; k<tempArr.length; k++) {
					optsHash[tempArr[k]] = true;
				}
			}
    } else if (currOptsArr[i] != "") {
      optsHash[currOptsArr[i]] = true;
    }
  }

  // Set the options according to the current checked buttons
  var allOpts = true;
	for (var i=0; i<buttons.length; i++) {
		state = buttons[i].checked;
		if (!state) {
			allOpts = false;
		}
		tempArr = buttons[i].value.split(",");
		for (var k=0; k<tempArr.length; k++) {
			optsHash[tempArr[k]] = state;
		}
	}

  var opts = new Array();
  for (var i in optsHash) {
    if (optsHash[i] === true) {
      opts.push(i);
    }
  }

  if (opts.length) {
    if (allOpts) {
      selectedNode.setAttribute(ICEUtils.repeatingRegionsGroupAttrName, ICEUtils.repeatingRegionsGroupAttrAllValue);
    } else {
      selectedNode.setAttribute(ICEUtils.repeatingRegionsGroupAttrName, opts.join(","));
    }
  } else {
		inspectSelection(); // Restore options' selection before displaying the alert for consistency.
		alert(dw.loadString("ice/repeatingRegionsGroup/messages/oneOptionSelected"));
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
