// Copyright 1998-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//*************** GLOBAL VARS  *****************
var DEBUG_FILE = dw.getConfigurationPath() + '/CHANGEPROP_DEBUG.txt';

var LIST_OBJTYPE;
var LIST_PROPS;
var LIST_OBJS;

var TAGTYPES;
var PROP;
var APELEM_PROPS;

var helpDoc = MM.HELP_behChangeProperty;

function initGlobals() {

  TAGTYPES = new Array("DIV","SPAN","P","TR","TD","IMG","FORM","INPUT/CHECKBOX","INPUT/RADIO","INPUT/TEXT","TEXTAREA","INPUT/PASSWORD","SELECT");
  PROP = new Array();
  for (var x=0; x < TAGTYPES.length; x++){
    PROP[x] = new Array();
  }

  APELEM_PROPS = new Array("top","left","width","height","zIndex","clip","visibility");

  //You can add writeable properties, comma-separated, between the first pair of quotes.
  // To add another tag, extend the TAGNAMES (in the .htm file) and TAGTYPES (above) arrays, then add
  // another array element below.

  PROP[ 0] = ["backgroundColor","backgroundImage","border","borderStyle","borderWidth","borderColor","color","display","fontFamily","fontSize","fontStyle","fontWeight"];//div
  PROP[ 1] = ["backgroundColor","backgroundImage","border","borderStyle","borderWidth","borderColor","color","display","fontFamily","fontSize","fontStyle","fontWeight"];//span
  PROP[ 2] = ["backgroundColor","backgroundImage","border","borderStyle","borderWidth","borderColor","color","display","fontFamily","fontSize","fontStyle","fontWeight"];//p
  PROP[ 3] = ["backgroundColor","backgroundImage","border","borderStyle","borderWidth","borderColor","color","display","fontFamily","fontSize","fontStyle","fontWeight"];//tr
  PROP[ 4] = ["backgroundColor","backgroundImage","border","borderStyle","borderWidth","borderColor","color","display","fontFamily","fontSize","fontStyle","fontWeight"];//td
  PROP[ 5] = ["src","border","borderStyle","borderWidth","borderColor"];//image
  PROP[ 6] = ["action","backgroundColor","backgroundImage","border","borderStyle","borderWidth","borderColor","color","display","fontFamily","fontSize","fontStyle","fontWeight"];//form
  PROP[ 7] = ["checked","backgroundColor","border","borderStyle","borderWidth","borderColor","color","display"];//checkbox
  PROP[ 8] = ["checked","backgroundColor","backgroundImage","border","borderStyle","borderWidth","borderColor","color","display"];//radio
  PROP[ 9] = ["value","backgroundColor","border","borderStyle","borderWidth","borderColor","color","display","fontFamily","fontSize","fontStyle","fontWeight"];//text
  PROP[10] = ["value","backgroundColor","border","borderStyle","borderWidth","borderColor","color","display","fontFamily","fontSize","fontStyle","fontWeight"];//textarea
  PROP[11] = ["value","backgroundColor","border","borderStyle","borderWidth","borderColor","color","display","fontFamily","fontSize","fontStyle","fontWeight"];//password
  PROP[12] = ["selectedIndex","backgroundColor","backgroundImage","border","borderStyle","borderWidth","borderColor","color","display","fontFamily","fontSize","fontStyle","fontWeight"];//select
}



//******************* BEHAVIOR FUNCTION **********************

//Sets a property of an object to a new value.
//Accepts the following arguments:
//  objName  - simple obj name or Javascript object ref for Netscape (ex: document.layers['foo'].document.myImage)
//  x        - ignored (for backward compatibility)
//  theProp  - the property to change (ex: value, style.fontFace)
//  theValue - the new value (ex: sans-serif)

function MM_changeProp(objId,x,theProp,theValue) { //v9.0
  var obj = null; with (document){ if (getElementById)
  obj = getElementById(objId); }
  if (obj){
    if (theValue == true || theValue == false)
      eval("obj.style."+theProp+"="+theValue);
    else eval("obj.style."+theProp+"='"+theValue+"'");
  }
}

MM.VERSION_MM_changeProp = 9.0; //define latest version number for behavior inspector

//******************* API **********************


//Can be used with any tag and any event

function canAcceptBehavior(){
  return true;
}



//Returns a Javascript function to be inserted in HTML head with script tags.

function behaviorFunction(){
  return "MM_changeProp";
}



//Returns fn call to insert in HTML tag <TAG... onEvent='thisFn(arg)'>
//Gets values from the UI and adds them as params to the function call.

function applyBehavior() {
  var objId;

  // Get the index of the selected item in the
  // Element ids field.
  var objIndex = LIST_OBJS.getIndex();

  // If the selected item is not "no elements found" or 
  // "select element type first", determine the objId.
  if (LIST_OBJS.getValue()) {
    objId   = document.MM_ELEMENT_IDS[objIndex];
    var theValue = dwscripts.escQuotes(TEXT_VALUE.value);
    var theTag   = LIST_OBJTYPE.getValue();

    // Get the property that's being set, either from
    // the menu or the "Enter" text field.
    var theProp = "";
    if (document.theForm.theRadio[0].checked) {
      theProp = LIST_PROPS.getValue();
    } else { //get from textfield
      theProp  = TEXT_PROP.value;
    }

    if (objId.indexOf(MM.LABEL_Unidentified) == 0)
      return MSG_UnnamedObj;
  }

  if (!theProp) {
    return MSG_NoSelection;
  }
  else {
    updateBehaviorFns("MM_changeProp");
    if (theValue == 'true' || theValue == 'false'){
      return "MM_changeProp('" + objId + "','','" + theProp + "'," + theValue + ",'" + theTag + "')";
    }else{  
      return "MM_changeProp('" + objId + "','','" + theProp + "','" + theValue + "','" + theTag + "')";
    }
  }
}



//Returns a dummy function call to inform Dreamweaver the type of certain behavior
//call arguments. This information is used by DW to fixup behavior args when the
//document is moved or changed.
//
//It is passed an actual function call string generated by applyBehavior(), which
//may have a variable list of arguments, and this should return a matching mask.
//
//The return values are:
//  URL     : argument could be a file path, which DW will update during Save As...
//  NS4.0ref: arg is an object ref that may be changed by Convert Tables to Layers
//  IE4.0ref: arg is an object ref that may be changed by Convert Tables to Layers
//  other...: argument is ignored (I add a descriptive word for future generations)
//  objId   : the id of the object, such as "image1"

function identifyBehaviorArguments(fnCallStr) {
  var argArray, retVal = "";
  argArray = extractArgs(fnCallStr);
  if (argArray.length == 6)
    retVal = (argArray[1].indexOf(".")==-1)? "objId,other,other,other,other" : "NS4.0ref,IE4.0ref,other,other,other";
  return retVal;
}



//Given the original function call, this parses out the args and updates
//the UI.

function inspectBehavior(fnCallStr){
  var objId, theProp, theValue, theTag;

  // Extract arguments from fnCallStr
  var argArray = dwscripts.extractArgs(fnCallStr);
  if (argArray.length == 6) {
    objId = dwscripts.unescQuotes(argArray[1]);
    theProp = argArray[3];
    theValue = dwscripts.unescQuotes(argArray[4]);
    theTag = argArray[5];

    // Select tag in tag list
    var found = LIST_OBJTYPE.pickValue(theTag);
    if (!found) alert(dwscripts.sprintf(MSG_TagNotFound,theTag));
    else {
      // Load the property and object menus
      loadAllMenus();

      // Select objId in menu
      found = false;
      var numElems = document.MM_ELEMENT_IDS.length;
      for (var i=0; i < numElems; i++) {
        if (objId == document.MM_ELEMENT_IDS[i]) {
          LIST_OBJS.setIndex(i);
          found = true;
          break;
        }          
      }

      if (!found) alert(dwscripts.sprintf(MSG_ObjNotFound,objId));
      else {
        var tagIndex = dwscripts.findInArray(TAGTYPES,theTag);
        var propIndex = dwscripts.findInArray(PROP[tagIndex],theProp);
        if (propIndex >= 0) {
            LIST_PROPS.setIndex(propIndex);
          }
        else{
          TEXT_PROP.value = theProp;
          selectRadio(1);
        }
        TEXT_VALUE.value = theValue;
      }
    }
  }
}



//***************** LOCAL FUNCTIONS  ******************


//Load the typeOfObj menu with tag names, the browser menu,
//and initialize the object menu.

function initializeUI(){
  initGlobals();
  
  LIST_OBJTYPE = new ListControl("typeOfObj");
  LIST_PROPS = new ListControl("propMenu");
  LIST_OBJS = new ListControl("namedObjs");
  TEXT_PROP = document.theForm.theProp;
  TEXT_VALUE = document.theForm.theValue;
  //load TAGS picklist
  LIST_OBJTYPE.setAll(TAGTYPES,TAGTYPES);

  LIST_OBJS.setAll(["*** "+MENUITEM_NoTypeSelected+" **"],[null]);
  LIST_OBJS.setIndex(0);
  loadAllMenus();
  
  document.theForm.typeOfObj.focus(); //set focus on type of object for accessibility
}



//Loads the new objects, and a list of useful properties.

function loadAllMenus() {
  loadObjectMenu();
  loadPropMenu();
}



//Loads a list of useful properties from the data array PROP.

function loadPropMenu() {
  //get tag selection
  var tagIndex = LIST_OBJTYPE.getIndex();
  var objIndex = -1, obj = null;
  if (LIST_OBJS.getValue()) {
    objIndex = LIST_OBJS.getIndex();
    obj = document.MM_ELEMENTS[objIndex];
  }
  if (tagIndex > -1) {
    var props = new Array();
    if (obj && obj.getComputedStyleProp("position") == "absolute"){
      props = APELEM_PROPS.concat(PROP[tagIndex]);
      PROP[tagIndex] = props;
    }
    else {
      props = PROP[tagIndex];
    }
    LIST_PROPS.setAll(props,props);
    LIST_PROPS.setIndex(0);
  }
}



//Load the select menu with object references.

function loadObjectMenu() {
  var idArray = new Array();
  var dom = dw.getDocumentDOM();

  //get list of objects
  var tagIndex = LIST_OBJTYPE.getIndex();
  var tagStr = LIST_OBJTYPE.getValue();
  document.MM_ELEMENTS = dom.getElementsByTagName(tagStr);
  document.MM_ELEMENT_IDS = new Array();
  var displayNames = new Array();

  var elem = null, elemId = "";
  for (var i=0; i < document.MM_ELEMENTS.length; i++) {
    elem = document.MM_ELEMENTS[i];
    elemId = elem.getAttribute("id");
    if (elemId){
      displayNames.push(TAGNAMES[tagIndex] + ' "' + elemId + '"');
      document.MM_ELEMENT_IDS.push(elemId);
    }
    else {
      displayNames.push(TAGNAMES[tagIndex] + ' ' + MM.LABEL_Unidentified);
      document.MM_ELEMENT_IDS.push(MM.LABEL_Unidentified);
    }
    }
  // Load menu with elements
  if (displayNames.length > 0) {
    LIST_OBJS.setAll(displayNames,document.MM_ELEMENTS);
  }
  else {
    LIST_OBJS.setAll(["*** "+dwscripts.sprintf(MENUITEM_ItemsNotFnd,tagStr)+" ***"],[null]); //clear menu
  }
}



//Passed a number, selects that radio.

function selectRadio(num) {
  document.theForm.theRadio[0].checked = (num==0)?true:false;
  document.theForm.theRadio[1].checked = (num==1)?true:false;
}
