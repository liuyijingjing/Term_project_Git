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

var helpID = MM.ICE_HELP_EditableRegionPI;


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

  if (selectedNode && selectedNode.getTranslatedAttribute && selectedNode.getTranslatedAttribute(ICEUtils.typeEditableRegion)) {
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
  /*
  document.getElementById("options_basic").innerHTML = ICEEditableRegionOptions.getTableForGroup("basic");
  document.getElementById("options_advanced").innerHTML = ICEEditableRegionOptions.getTableForGroup("advanced");
  document.getElementById("options_insert").innerHTML = ICEEditableRegionOptions.getTableForGroup("insert");
  */
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

  if (nodeProps & ICEUtils.NODE_SERVER_SIDE) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/editableRegion/PI/error/serverSide"));
  } else if (nodeProps & ICEUtils.NODE_CONTAINS_ICE_EDITABLE) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/editableRegion/PI/error/containsICEEditable"));
  } else if (nodeProps & ICEUtils.NODE_CONTAINS_ICE_REPEATING) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/editableRegion/PI/error/containsICERepeating"));
  } else if (nodeProps & ICEUtils.NODE_CONTAINS_ICE_REPREGGROUP) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/editableRegion/PI/error/containsICERepeatingGroup"));
  } else if (nodeProps & ICEUtils.NODE_INSIDE_ICE_EDITABLE) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/editableRegion/PI/error/insideICEEditable"));
  } else if ((nodeProps & ICEUtils.NODE_OUTSIDE_DWT_EDITABLE_REGION) && (!selectedNode.childNodes || selectedNode.childNodes.length != 1 || ((ICEUtils.checkNode(dom, selectedNode.childNodes[0], []) & ICEUtils.NODE_IS_DWT_EDITABLE_REGION) == 0))) {
    bottomLayer.setAttribute("class", "hiddenRegion");
    displayTopLayerErrorMessage(dw.loadString("ice/editableRegion/PI/error/outsideDWTEditable"));
  } else {
    var optsStr = selectedNode.getAttribute(ICEUtils.editableRegionAttrName);
    var opts = (optsStr && optsStr.split) ? optsStr.split(",") : new Array();
    var optsHash = new Object();

    for (var i=0; i<opts.length; i++) {
      optsHash[opts[i]] = true;
    }

    var buttons;
    var values;
    var state;
    for (var group in ICEEditableRegionOptions.groups) {
      buttons = ICEEditableRegionOptions.groups[group].buttons;
      for (var i=0; i<buttons.length; i++) {
        var checkboxObj = document.forms[0].elements[buttons[i].name];
        if (optsHash[ICEUtils.editableRegionAttrAllValue]) {
          state = true;
        } else {
          values = buttons[i].value.split(",");
          state = false;
          for (var j=0; j<values.length; j++) {
            if (optsHash[values[j]]) {
              state = true;
              break;
            }
          }
        }
        checkboxObj.checked = state;
      }
    }

    bottomLayer.removeAttribute("class");
    clearTopLayerErrorMessage();
  }
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
  var selectedNode = getSelectedNode(dom);

  if (!canInspectSelection()) {
    return;
  }

  if (attrib) {
    switch (attrib) {
      case "selectAll":
        setAllOptionsState(true);
        buttonChecked();
        break;

      case "selectNone":
        setAllOptionsState(false);
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

  if (confirm(dw.loadString("ice/editableRegion/PI/message/removeRegion").replace(/\\n/gi, "\n"))) {
    selectedNode.removeAttribute(ICEUtils.editableRegionAttrName);
    ICEUtils.removeScriptTag(dom);
    ICEUtils.removeICENamespace(dom);
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   setAllOptionsState
//
// DESCRIPTION:
//   This function sets the same given state for all the options
//
// ARGUMENTS:
//   state (boolean) - the new state for all the options
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function setAllOptionsState(state) {
  var buttons;
  for (var group in ICEEditableRegionOptions.groups) {
    buttons = ICEEditableRegionOptions.groups[group].buttons;
    for (var j=0; j<buttons.length; j++) {
      var checkboxObj = document.forms[0].elements[buttons[j].name];
      checkboxObj.checked = state;
    }
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
  var buttons;
  var state;
  var tempArr;

  if (!canInspectSelection()) {
    return;
  }

  // Inspect current options
  var currOpts = selectedNode.getAttribute(ICEUtils.editableRegionAttrName);
  currOpts = currOpts.replace(/\s*,\s*/gi, ",");
  currOptsArr = currOpts.split(",");
  var optsHash = new Object();
  for (var i=0; i<currOptsArr.length; i++) {
    if (currOptsArr[i] == ICEUtils.editableRegionAttrAllValue) {
      for (var group in ICEEditableRegionOptions.groups) {
        buttons = ICEEditableRegionOptions.groups[group].buttons;
        for (var j=0; j<buttons.length; j++) {
          tempArr = buttons[j].value.split(",");
          for (var k=0; k<tempArr.length; k++) {
            optsHash[tempArr[k]] = true;
          }
        }
      }
    } else if (currOptsArr[i] != "") {
      optsHash[currOptsArr[i]] = true;
    }
  }

  // Set the options according to the current checked buttons
  var allOpts = true;
  for (var group in ICEEditableRegionOptions.groups) {
    buttons = ICEEditableRegionOptions.groups[group].buttons;
    for (var i=0; i<buttons.length; i++) {
      state = document.forms[0].elements[buttons[i].name].checked;
      if (!state) {
        allOpts = false;
      }
      tempArr = buttons[i].value.split(",");
      for (var k=0; k<tempArr.length; k++) {
        optsHash[tempArr[k]] = state;
      }
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
      selectedNode.setAttribute(ICEUtils.editableRegionAttrName, ICEUtils.editableRegionAttrAllValue);
    } else {
      selectedNode.setAttribute(ICEUtils.editableRegionAttrName, opts.join(","));
    }
  } else {
    selectedNode.setAttribute(ICEUtils.editableRegionAttrName, "");
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
