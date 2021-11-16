// Copyright 1998-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//*************** GLOBAL VARS  *****************

var helpDoc = MM.HELP_behShowHideLayers;

//******************* BEHAVIOR FUNCTION **********************

// Shows and/or hides one or more elements at the same time.
// Accepts a variable number of argument pairs as follows:
//  objId    - the id of the element, such as "apDiv1". 
//  x        - ignored (for backward compatibility)
//  visStr   - 'visible', 'hidden', or 'inherit'.
//
// This function uses getElementById() to locate the element in the
// user's document.

function MM_showHideLayers() { //v9.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) 
  with (document) if (getElementById && ((obj=getElementById(args[i]))!=null)) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}

MM.VERSION_MM_showHideLayers = 9.0; //define latest version number for behavior inspector

//******************* API **********************


// Checks for the existence of elements with an id attribute.
// If none exist, returns false so this Action is grayed out.
function canAcceptBehavior(){
  var retVal = false;
  var idArray = new Array();
  var dom = dw.getDocumentDOM();
  if (dom){
    idArray = dom.getElementsByAttributeName("id");
    if (idArray && idArray.length > 0)
      retVal = true;
  }
  return retVal;
}


// Returns a Javascript function to be inserted in HTML head
// with script tags.
function behaviorFunction(){
  return "MM_showHideLayers";
}


// Returns the function call to insert in HTML tag 
// <tag... onEvent='thisFn(arg)'>.
// Gets the list of elements with ids and their visibilities
// from a property set on the document object.
function applyBehavior() {
  // Get the global list of visibilities
  var visArray = document.MM_visArray;
  // Initialize the argument list and return value
  var argList = "", retVal = "";

  // Declare local variables
  var theVis, elemId;

  for (var i=0; i < visArray.length; i++){
    theVis = visArray[i];
    if (theVis){
      theVis = (theVis == LABEL_DEFAULT)? "inherit" : ((theVis == LABEL_SHOW) ? "show" : "hide");

      // Get the corresponding element's id
      elemId = document.ELEMENT_REFS[i].getAttribute("id");

      // If the argList is not empty, append a comma.
      if (argList) argList += ",";

      // Second argument is empty string (for backwards
      // compatibility).
      argList += "'" + elemId + "','','" + theVis + "'";
    }
  }
  if (argList) {
    updateBehaviorFns("MM_showHideLayers");
    retVal = "MM_showHideLayers(" + argList + ")";
  } else {
    retVal = MSG_ElementNoId;
  }
  return retVal;
}

// Given the original function call, this parses out the arguments and 
// updates the UI. First it gets new element,vis pairs.
// If the element already exists in the menu, put the vis value in visArray.
// If the element doesn't exist, add it to the menu and extend visArray.
function inspectBehavior(upStr){
  // Extract the arguments from the function call.
  var argArray = dwscripts.extractArgs(upStr);

  // Get the previous list of elements and their visibility settings.
  var visArray = document.MM_visArray; 

  // The number of elements with ids
  var numElements = document.ELEMENT_REFS.length;

  // Declare loop variables
  var elementId, theVis, found;

  // The first element in the argArray is the function name,
  // so scan elements starting at 1.
  for (var i=1; i < (argArray.length-2); i+=3){
    elementId = argArray[i];
    theVis = argArray[i+2];
    theVis = (theVis == "inherit")? LABEL_DEFAULT : ((theVis == "show") ? LABEL_SHOW : LABEL_HIDE);
    
    // Now check whether the element is already in the list
    found = false;
    for (var j = 0; j < numElements; j++){
      if (elementId == document.ELEMENT_REFS[j].getAttribute("id")){
        visArray[j] = theVis;
        addValueToMenuItem(document.theForm.menu,j,theVis);
        found = true;
        break;
      }
    }
    if (!found) alert(errMsg(MSG_ElementNotFound,elementId,theVis));
  }
  document.MM_visArray = visArray; //save updated layer list
}



//***************** LOCAL FUNCTIONS  ******************


// Load the select menu with element ids.
// Also sets the global property MM_visArray to the right num of items.

function initializeUI(){
  var dom = dw.getDocumentDOM();
  var elementArray = dom.getElementsByAttributeName("id");
  var displayNames = new Array();
  
  for (var i=0; i < elementArray.length; i++){
    var elem = elementArray[i];
    displayNames.push(elem.tagName.toLowerCase() + ' "' + elem.getAttribute("id") + '"');
  }

  visArray = new Array(); 
  for (var i=0; i < displayNames.length; i++) {
    document.theForm.menu.options[i] = new Option(displayNames[i]); //load menu
    visArray[i] = "";
  }
  //set globals
  document.MM_visArray = visArray;
  document.ELEMENT_REFS = elementArray;
}


// Stores the new visibility for the selected element in 
// in the global document property "MM_visArray" when the
// user clicks one of the visibility buttons in the UI.
function storeVis(newVis){
  // Get the existing visibilities.
  var visArray = document.MM_visArray; 
  
  if (visArray){
    // Get the position of the selected element
    var currElement = document.theForm.menu.selectedIndex;
    
    // Get the old visibility of the selected element
    var oldVis = visArray[currElement];
    
    // If the visibility is changing, store the new visibility
    // in the global MM_visArray and update the list/menu.
    if (oldVis != newVis) {
      visArray[currElement] = newVis;
      document.MM_visArray = visArray;
      addValueToMenuItem(document.theForm.menu, currElement, newVis);

      // Reset the selection after updating.
      document.theForm.menu.selectedIndex = currElement;

    }
    // If the new visibility is the same as the old, toggle it
    // (i.e., remove any visibility setting).
    else { 
      visArray[currElement] = ""; 
      document.MM_visArray = visArray;
      addValueToMenuItem(document.theForm.menu, currElement, ""); 
      document.theForm.menu.selectedIndex = currElement;
    }
  }
}
