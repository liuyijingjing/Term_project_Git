// Copyright 1998-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//*************** GLOBAL VARS  *****************

var helpDoc = MM.HELP_behDragLayer;

function initGlobals() {
  //Initial Form Values
  GlayerMenuIndex = 0;
  GconstrainMenuIndex = 0;
  GconstrainUp = "";
  GconstrainDown = "";
  GconstrainLeft = "";
  GconstrainRight = "";
  GtargetLeft = "";
  GtargetTop = "";
  GtargetTolerance = "";

  GhandleMenuIndex = 0;
  GhandleLeft = "";
  GhandleTop = "";
  GhandleWidth = "";
  GhandleHeight = "";
  GbringToFront = true;
  GdropBackMenuIndex = 0;
  GdragJavascript = "";
  GdropJavascript = "";
  GcallJsWhenSnapped = true;
}

var T;
var GlayerMenuIndex;
var GconstrainMenuIndex;
var GconstrainUp;
var GconstrainDown;
var GconstrainLeft;
var GconstrainRight;
var GtargetLeft;
var GtargetTop;
var GtargetTolerance;
var GhandleMenuIndex;
var GhandleLeft;
var GhandleTop;
var GhandleWidth;
var GhandleHeight;
var GbringToFront;
var GdropBackMenuIndex;
var GdragJavascript;
var GdropJavascript;
var GcallJsWhenSnapped;

//******************* BEHAVIOR FUNCTION **********************

// Lets you drag an absolutely-positioned element, snap it to a location, 
// and call a JavaScript.
//Accepts the following args:
//  objId    - the id of the element
//  x        - ignored (for backward compatibility)
//  hL, hT   - integers, define top-left corner of drag handle area within element
//  hW, hH   - positive integers, define width and height of drag handle area
//             For example, to define a title-bar drag handle, 
//             use hL=0, hT=0, hW=100, hH=30
//  toFront  - boolean, if true element becomes topmost element while dragged
//  dropBack - boolean, (used only if toFront is true)
//             if true, the element will return to its original zIndex position when dropped
//             if false, the element will remain on top when dropped
//  cU       - positive integer, distance element can be dragged up from its original position
//  cD       - positive integer, distance element can be dragged down from its original position
//  cL       - positive integer, distance element can be dragged left from its original position
//  cR       - positive integer, distance element can be dragged right from its original position
//  targL    - integer, absolute X location (from top/left corner of window) to snap to
//  targT    - integer, absolute Y location (from top/left corner of window) to snap to
//  tol      - tolerance, pixel-distance from target element can be and still snap to target
//  dropJS   - JavaScript to execute when snapped (can be blank, but use empty quotes "")
//  et       - boolean "every time". if true, calls dropJS every time
//                                   if false, only calls dropJS if snapped to target
//  dragJS   - JavaScript to execute while dragging (can be blank, but use empty quotes "")
//
// This function requires absolutely-positioned elements and only works for 
// browsers that support getElementById(). It is a composite of 4 functions that handle 
// initialization and mousedown, mousemove, and mouseup events.

function MM_dragLayer(objId,x,hL,hT,hW,hH,toFront,dropBack,cU,cD,cL,cR,targL,targT,tol,dropJS,et,dragJS) { //v9.01
  //Copyright 2005-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.
  var i,j,aLayer,retVal,curDrag=null,curLeft,curTop,IE=document.all;
  var NS=(!IE&&document.getElementById); if (!IE && !NS) return false;
  retVal = true; if(IE && event) event.returnValue = true;
  if (MM_dragLayer.arguments.length > 1) {
    curDrag = document.getElementById(objId); if (!curDrag) return false;
    if (!document.allLayers) { document.allLayers = new Array();
      with (document){ if (NS) { var spns = getElementsByTagName("span"); var all = getElementsByTagName("div");
        for (i=0;i<spns.length;i++) if (MM_getProp(spns[i],'P')) allLayers[allLayers.length]=spns[i];}
        for (i=0;i<all.length;i++) {
	        if (MM_getProp(all[i],'P')) allLayers[allLayers.length]=all[i]; 
        }
    } }
    curDrag.MM_dragOk=true; curDrag.MM_targL=targL; curDrag.MM_targT=targT;
    curDrag.MM_tol=Math.pow(tol,2); curDrag.MM_hLeft=hL; curDrag.MM_hTop=hT;
    curDrag.MM_hWidth=hW; curDrag.MM_hHeight=hH; curDrag.MM_toFront=toFront;
    curDrag.MM_dropBack=dropBack; curDrag.MM_dropJS=dropJS;
    curDrag.MM_everyTime=et; curDrag.MM_dragJS=dragJS;
  
    curDrag.MM_oldZ = MM_getProp(curDrag,'Z');
    curLeft = MM_getProp(curDrag,'L');
    if (String(curLeft)=="NaN") curLeft=0; curDrag.MM_startL = curLeft;
    curTop = MM_getProp(curDrag,'T');
    if (String(curTop)=="NaN") curTop=0; curDrag.MM_startT = curTop;
    curDrag.MM_bL=(cL<0)?null:curLeft-cL; curDrag.MM_bT=(cU<0)?null:curTop-cU;
    curDrag.MM_bR=(cR<0)?null:curLeft+cR; curDrag.MM_bB=(cD<0)?null:curTop+cD;
    curDrag.MM_LEFTRIGHT=0; curDrag.MM_UPDOWN=0; curDrag.MM_SNAPPED=false; //use in your JS!
    document.onmousedown = MM_dragLayer; document.onmouseup = MM_dragLayer;
    if (NS) document.captureEvents(Event.MOUSEDOWN|Event.MOUSEUP);
    } else {
    var theEvent = ((NS)?objId.type:event.type);
    if (theEvent == 'mousedown') {
      var mouseX = (NS)?objId.pageX : event.clientX + document.body.scrollLeft;
      var mouseY = (NS)?objId.pageY : event.clientY + document.body.scrollTop;
      var maxDragZ=null; document.MM_maxZ = 0;
      for (i=0; i<document.allLayers.length; i++) { aLayer = document.allLayers[i];
        var aLayerZ = MM_getProp(aLayer,'Z');
        if (aLayerZ > document.MM_maxZ) document.MM_maxZ = aLayerZ;
        var isVisible = (MM_getProp(aLayer,'V')).indexOf('hid') == -1;
        if (aLayer.MM_dragOk != null && isVisible) with (aLayer) {
          var parentL=0; var parentT=0;
          if (NS) { parentLayer = aLayer.parentNode;
            while (parentLayer != null && parentLayer != document && MM_getProp(parentLayer,'P')) {
              parentL += parseInt(MM_getProp(parentLayer,'L')); parentT += parseInt(MM_getProp(parentLayer,'T'));
              parentLayer = parentLayer.parentNode;
              if (parentLayer==document) parentLayer = null;
          } } else if (IE) { parentLayer = aLayer.parentElement;       
            while (parentLayer != null && MM_getProp(parentLayer,'P')) {
              parentL += MM_getProp(parentLayer,'L'); parentT += MM_getProp(parentLayer,'T');
              parentLayer = parentLayer.parentElement; } }
          var tmpX=mouseX-((MM_getProp(aLayer,'L'))+parentL+MM_hLeft);
          var tmpY=mouseY-((MM_getProp(aLayer,'T'))+parentT+MM_hTop);
          if (String(tmpX)=="NaN") tmpX=0; if (String(tmpY)=="NaN") tmpY=0;
          var tmpW = MM_hWidth;  if (tmpW <= 0) tmpW += MM_getProp(aLayer,'W');
          var tmpH = MM_hHeight; if (tmpH <= 0) tmpH += MM_getProp(aLayer,'H');
          if ((0 <= tmpX && tmpX < tmpW && 0 <= tmpY && tmpY < tmpH) && (maxDragZ == null
              || maxDragZ <= aLayerZ)) { curDrag = aLayer; maxDragZ = aLayerZ; } } }
      if (curDrag) {
        document.onmousemove = MM_dragLayer;
        curLeft = MM_getProp(curDrag,'L');
        curTop = MM_getProp(curDrag,'T');
        if (String(curLeft)=="NaN") curLeft=0; if (String(curTop)=="NaN") curTop=0;
        MM_oldX = mouseX - curLeft; MM_oldY = mouseY - curTop;
        document.MM_curDrag = curDrag;  curDrag.MM_SNAPPED=false;
        if(curDrag.MM_toFront) {
          var newZ = parseInt(document.MM_maxZ)+1;
          eval('curDrag.'+('style.')+'zIndex=newZ');
          if (!curDrag.MM_dropBack) document.MM_maxZ++; }
        retVal = false; if(!NS) event.returnValue = false;
    } } else if (theEvent == 'mousemove') {
      if (document.MM_curDrag) with (document.MM_curDrag) {
        var mouseX = (NS)?objId.pageX : event.clientX + document.body.scrollLeft;
        var mouseY = (NS)?objId.pageY : event.clientY + document.body.scrollTop;
        var newLeft = mouseX-MM_oldX; var newTop  = mouseY-MM_oldY;
        if (MM_bL!=null) newLeft = Math.max(newLeft,MM_bL);
        if (MM_bR!=null) newLeft = Math.min(newLeft,MM_bR);
        if (MM_bT!=null) newTop  = Math.max(newTop ,MM_bT);
        if (MM_bB!=null) newTop  = Math.min(newTop ,MM_bB);
        MM_LEFTRIGHT = newLeft-MM_startL; MM_UPDOWN = newTop-MM_startT;
        if (NS){style.left = newLeft + "px"; style.top = newTop + "px";}
        else {style.pixelLeft = newLeft; style.pixelTop = newTop;}
        if (MM_dragJS) eval(MM_dragJS);
        retVal = false; if(!NS) event.returnValue = false;
    } } else if (theEvent == 'mouseup') {
      document.onmousemove = null;
      if (NS) document.releaseEvents(Event.MOUSEMOVE);
      if (NS) document.captureEvents(Event.MOUSEDOWN); //for mac NS
      if (document.MM_curDrag) with (document.MM_curDrag) {
        if (typeof MM_targL =='number' && typeof MM_targT == 'number' &&
            (Math.pow(MM_targL-(MM_getProp(document.MM_curDrag,'L')),2)+
             Math.pow(MM_targT-(MM_getProp(document.MM_curDrag,'T')),2))<=MM_tol) {
          if (NS) {style.left = MM_targL + "px"; style.top = MM_targT + "px";}
          else {style.pixelLeft = MM_targL; style.pixelTop = MM_targT;}
          MM_SNAPPED = true; MM_LEFTRIGHT = MM_startL-MM_targL; MM_UPDOWN = MM_startT-MM_targT; }
        if (MM_everyTime || MM_SNAPPED) eval(MM_dropJS);
        if(MM_dropBack) {style.zIndex = MM_oldZ;}
        retVal = false; if(!NS) event.returnValue = false; }
      document.MM_curDrag = null;
    }
    if (NS) document.routeEvent(objId);
  } return retVal;
}

MM.VERSION_MM_dragLayer = 9.01; //define latest version number for behavior inspector

//******************* API **********************

// Checks for the existence of AP elements.
// If none exist, returns false so this Action is grayed out; 
// also return false if anything other than the body is selected.
// If the body *is* selected, return "onLoad" as the event 
// that should be used for this behavior.
function canAcceptBehavior(theTag) {
  var retVal = false;
  var dom = dw.getDocumentDOM();
  var idArray = new Array();
  if (dom){
  var selObj = dw.getBehaviorElement();
  if (!selObj && theTag)
      selObj = dom.getSelectedNode();
    if (selObj && selObj.tagName == "BODY"){
      idArray = dom.getElementsByAttributeName("id");
      if (idArray && idArray.length > 0)
        retVal = "onLoad";
    }
  }
  return retVal;
}

//Returns a Javascript function to be inserted in HTML head with script tags.

function behaviorFunction(){
  return "MM_scanStyles,MM_getProp,MM_dragLayer";
}


//Returns fn call to insert in HTML tag <TAG... onEvent='thisFn(arg)'>

function applyBehavior() {

  if (findObject("mainLayer").visibility != 'hidden') {
    getMain();
  } else {
    getOptions();
  }

  // Initialize argList and errMsg to empty string.
  var errMsg = "", argList = "";
  
  // Determine which element is selected.
  var index = GlayerMenuIndex;
  var theElem = document.MM_ELEMENT_IDS[index]; 
  
  // If the user has selected an element without an id,
  // show an error message (and don't bother with the rest
  // of the code in this function).
  if (theElem.indexOf(MM.LABEL_Unidentified) == 0){
    errMsg += "\n"+MSG_ElementNoId;
  }
  argList += "'" + theElem + "','',";

  // Declare variables for storing drag/drop options.
  var hL,hT,hW,hH,toFront,dropBack,cU,cD,cL,cR,targL,targT,tol,dropJS,et,dragJS;

  // Get the drag handle
  if (GhandleMenuIndex == 0) {
    hL=0; hT=0; hW=0; hH=0;
  } else {
    hL = GhandleLeft;   if (!hL) hL = 0; //if empty, use zero
    hT = GhandleTop;    if (!hT) hT = 0;
    hW = GhandleWidth;  if (!hW) hW = 0;
    hH = GhandleHeight; if (!hH) hH = 0;
    if ((hL != ""+(parseInt(hL))) ||  //if not a number
        (hT != ""+(parseInt(hT))) ||
        (hW != ""+(parseInt(hW))) ||
        (hH != ""+(parseInt(hH)))) errMsg += "\n"+MSG_HandleNotInts;
  }
  argList += hL + "," + hT + "," + hW + "," + hH + ",";

  // Get while-dragging setting
  toFront = GbringToFront;
  index = GdropBackMenuIndex;
  dropBack = (index == 1);
  argList += toFront + "," + dropBack + ",";

  // Get constraints
  if (GconstrainMenuIndex == 0) {
    cU=-1; cD=-1; cL=-1; cR=-1;
  } else {
    cU = GconstrainUp;
    cD = GconstrainDown;
    cL = GconstrainLeft;
    cR = GconstrainRight;
    if ((cU && cU != ""+(parseInt(cU))) ||  //if not a number
        (cD && cD != ""+(parseInt(cD))) ||
        (cL && cL != ""+(parseInt(cL))) ||
        (cR && cR != ""+(parseInt(cR)))) errMsg += "\n"+MSG_ConstraintsNotInts;
    if ((cU == ""+(parseInt(cU)) && cU < 0) ||  //if number, but negative
        (cD == ""+(parseInt(cD)) && cD < 0) ||
        (cL == ""+(parseInt(cL)) && cL < 0) ||
        (cR == ""+(parseInt(cR)) && cR < 0)) errMsg += "\n"+MSG_ConstraintsNotPos;
  }
  if (!cU) cU = -1;
  if (!cD) cD = -1;
  if (!cL) cL = -1;
  if (!cR) cR = -1;

  argList += cU + "," + cD + "," + cL + "," + cR + ",";

  // Get target location and tolerance
  targL = GtargetLeft;
  targT = GtargetTop;
  tol   = GtargetTolerance;
  
  // If not empty, and not number
  if ((targL && targL != ""+(parseInt(targL))) ||   
      (targT && targT != ""+(parseInt(targT))) ||
      (tol   && tol   != ""+(parseInt(tol)))) errMsg += "\n"+MSG_TargetNotInts;
  if (tol && tol == ""+(parseInt(tol)) && tol < 0) errMsg += "\n"+MSG_TolNotPositive;
  
  // If top/left targets are empty, use false
  targL = (targL)?targL:false; 
  targT = (targT)?targT:false;
  
  // If tolerance is empty, use 0
  tol   = (tol  )?tol  :0; 

  argList += targL + "," + targT + "," + tol + ",";

  // Get the javascript that should be executed
  // when the element is dropped.
  dropJS = escQuotes(GdropJavascript);
  et = !GcallJsWhenSnapped;
  dragJS = escQuotes(GdragJavascript);

  argList += "'" + dropJS + "'," + et + ",'" + dragJS + "'";

  if (errMsg) return errMsg
  else {
    updateBehaviorFns("MM_getProp","MM_scanStyles","MM_dragLayer");
    // Return fn call with args
    return "MM_dragLayer(" + argList + ")";
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
//  other...: argument is ignored

function identifyBehaviorArguments(fnCallStr) {
  var argArray, argList="";

  argArray = extractArgs(fnCallStr);
  if (argArray.length > 2) {
    argList += (argArray[1].indexOf(".")==-1)? "objId,other" : "NS4.0ref,IE4.0ref";
    for (i=0; i<argArray.length-3; i++) argList += ",other";
  }
  return argList;
}



//Given the original function call, this parses out the args and updates
//the UI. All values are written to a set of globals, then some are written
//to the displayed form.

function inspectBehavior(fnStr){
  var hL,hT,hW,hH,toFront,dropBack,cU,cD,cL,cR,targL,targT,tol,dropJS;


  var argArray = dwscripts.extractArgs(fnStr);
  if (argArray.length > 16) { //function call + 16 args

    // Get the selected AP element
    var theElem = dwscripts.unescQuotes(argArray[1]);

    // Find the element in the menu
    var found = false;
    var numElements = document.MM_ELEMENT_IDS.length;
    for (i=0; i < numElements; i++){
      if (theElem && (theElem == document.MM_ELEMENT_IDS[i])) { //if layer there
        GlayerMenuIndex = i;
        found = true;
        break;
      }
    }

    if (!found) alert(errMsg(MSG_ElementNotFound,theElem));

    // Set drag handle
    hL = argArray[3];
    hT = argArray[4];
    hW = argArray[5];
    hH = argArray[6];
    if (hL==0 && hT==0 && hW==0 && hH==0) {
      GhandleMenuIndex = 0;
    } else {
      GhandleMenuIndex   = 1;
      GhandleLeft   = (hL==0)?"":hL;
      GhandleTop    = (hT==0)?"":hT;
      GhandleWidth  = (hW==0)?"":hW;
      GhandleHeight = (hH==0)?"":hH;
    }

    // Set while-dragging settings
    GbringToFront = (argArray[7]=='true')?true:false;
    GdropBackMenuIndex = (argArray[8]=='true')?1:0;

    // Set constraints
    cU = argArray[9];
    cD = argArray[10];
    cL = argArray[11];
    cR = argArray[12];
    if (cU == -1 && cD == -1 && cL == -1 && cD == -1) {
      GconstrainMenuIndex = 0;
    } else {
      GconstrainMenuIndex = 1;
      if (cU != -1) GconstrainUp    = cU;
      if (cD != -1) GconstrainDown  = cD;
      if (cL != -1) GconstrainLeft  = cL;
      if (cR != -1) GconstrainRight = cR;
    }

    // Set target location and tolerance
    GtargetLeft = (argArray[13]=="false")?"":argArray[13];
    GtargetTop  = (argArray[14]=="false")?"":argArray[14];
    GtargetTolerance = (argArray[15]==0)?"0":argArray[15];

    // Set the javascript that should be executed
    // when the element is dropped.
    GdropJavascript = argArray[16];
    if (argArray.length > 17) //function call + 17 args
      GcallJsWhenSnapped = !eval(argArray[17]);
    if (argArray.length > 18) //function call + 18 args
      GdragJavascript = argArray[18];

    setMain();
  }
}



//***************** LOCAL FUNCTIONS  ******************

function initializeUI(){
  initGlobals();

  var dom = dw.getDocumentDOM();
  
  // "layer" is a special keyword that is the equivalent of
  // "all AP elements". 
  var elementArray = dom.getElementsByTagName("layer");
  var displayNames = new Array();
  document.MM_ELEMENT_IDS = new Array();

  // For backwards compatibility, we need to limit 
  // AP elements to divs and spans. As we're pusing
  // the relevant tags into the displayNames and
  // MM_ELEMENT_IDS arrays, make a note of which ones
  // have ids and which don't. 
  for (var i=0; i < elementArray.length; i++){
    var elem = elementArray[i];
    var elemId = elem.getAttribute("id");
    if (elem.tagName == "DIV" || elem.tagName == "SPAN"){
      if (elemId){
        displayNames.push(elem.tagName.toLowerCase() + ' "' + elemId + '"');
        document.MM_ELEMENT_IDS.push(elemId);
    }
      else {
        displayNames.push(elem.tagName.toLowerCase() + ' ' + MM.LABEL_Unidentified);
        document.MM_ELEMENT_IDS.push(MM.LABEL_Unidentified);
  }
    }
  }

  with (findObject("layerMenu")) {
    for (var i=0; i < displayNames.length; i++){
      options[i] = new Option(displayNames[i]);
    }
    selectedIndex = 0;
  }
  
  //Use appropriate images for Mac OS X.
  if (dw.isOSX()) {
    findObject("tabBgWin").src = "../../Shared/MM/Images/tabBgOSX500x160.gif";
    var tab0 = findObject("Tab0");
    var tab1 = findObject("Tab1");
    
    var oldMulti = RegExp.multiline;
    RegExp.multiline = true;
    var pat = /tabBg\.gif(.*)tabBgSel\.gif/;
    tab0.innerHTML = tab0.innerHTML.replace(pat, "tabBgOSX.gif$1tabBgSelOSX.gif");
	tab1.innerHTML = tab1.innerHTML.replace(pat, "tabBgOSX.gif$1tabBgSelOSX.gif");
	RegExp.multiline = oldMulti;
		
	// resize our bg image and window so that all our controls fit in
	var bgImage = findObject("tabBgWin");
	var bgWidth = parseInt(dw.loadString("behaviors/dragLayerTabBgWidthMac"));
	var bgHeight = parseInt(dw.loadString("behaviors/dragLayerTabBgHeightMac"));
	if (isNaN(bgWidth))
	  bgWidth = 578;
	if (isNaN(bgHeight))
	  bgHeight = 165;
	bgImage.width = bgWidth;
	bgImage.height = bgHeight;
	window.resizeToContents();
  } else if (dw.isXPThemed()) {	// use the right images for WinXP with themes
    findObject("tabBgWin").src = "../../Shared/MM/Images/tabBgWinXP500x160.gif";
    var tab0 = findObject("Tab0");
    var tab1 = findObject("Tab1");
    
    var oldMulti = RegExp.multiline;
    RegExp.multiline = true;
    var pat1 = /tabBg\.gif/;
    tab0.innerHTML = tab0.innerHTML.replace(pat1, "tabBgXP.gif");
	tab1.innerHTML = tab1.innerHTML.replace(pat1, "tabBgXP.gif");
    var pat2 = /tabBgSel\.gif/;
    tab0.innerHTML = tab0.innerHTML.replace(pat2, "tabBgSelXP.gif");
	tab1.innerHTML = tab1.innerHTML.replace(pat2, "tabBgSelXP.gif");
	RegExp.multiline = oldMulti;
  }
  
  //Initialize the TabControl.  (Pass in the prefix used for the tab layers)
  T = new TabControl('Tab');
  //Add tab pages.   (Pass the layer name, and the page object)
  T.addPage('mainLayer', new Pg1(MM.Optional_LABEL_Basic));
  T.addPage('optionsLayer', new Pg2(MM.Optional_LABEL_Advanced));
  //Initialize and display the tabs.  (Could pass the name of a page to start on)
  T.start();
}



// Get the current left,top position of the selected element and
// put these position values into the form.

function getElementPosition() {
  var dom = dw.getDocumentDOM();
  var index = findObject("layerMenu").selectedIndex;
  var elem = dom.getElementById(document.MM_ELEMENT_IDS[index]);
  if (elem) {
    findObject("targetLeft").value = elem.left;
    findObject("targetTop").value = elem.top;
    //add default tolerance if nothing there
    with (findObject("targetTolerance")) if (!value) value = 50;
  } else {
    alert(MSG_ElementHasNoPosn);
  }
}


function getMain() {
  GlayerMenuIndex       = findObject("layerMenu").selectedIndex;
  GconstrainMenuIndex   = findObject("constrainMenu").selectedIndex;
  GconstrainUp     = findObject("constrainUp").value;
  GconstrainDown   = findObject("constrainDown").value;
  GconstrainLeft   = findObject("constrainLeft").value;
  GconstrainRight  = findObject("constrainRight").value;
  GtargetLeft      = findObject("targetLeft").value;
  GtargetTop       = findObject("targetTop").value;
  GtargetTolerance = findObject("targetTolerance").value;
}
function setMain() {
 findObject("layerMenu").selectedIndex     = GlayerMenuIndex;
 findObject("constrainMenu").selectedIndex = GconstrainMenuIndex;
 T.update("constrainMenu"); //call update class to show or hide constrain fields
 findObject("constrainUp").value           = GconstrainUp;
 findObject("constrainDown").value         = GconstrainDown;
 findObject("constrainLeft").value         = GconstrainLeft;
 findObject("constrainRight").value        = GconstrainRight;
 findObject("targetLeft").value            = GtargetLeft;
 findObject("targetTop").value             = GtargetTop;
 findObject("targetTolerance").value       = GtargetTolerance;
}
function getOptions() {
  GhandleMenuIndex      = findObject("handleMenu").selectedIndex;
  GhandleLeft      = findObject("handleLeft").value;
  GhandleTop       = findObject("handleTop").value;
  GhandleWidth     = findObject("handleWidth").value;
  GhandleHeight    = findObject("handleHeight").value;
  GbringToFront    = findObject("bringToFront").checked;
  GdropBackMenuIndex    = findObject("dropBackMenu").selectedIndex;
  GdragJavascript  = findObject("dragJavascript").value;
  GdropJavascript  = findObject("dropJavascript").value;
  GcallJsWhenSnapped = findObject("callJsWhenSnapped").checked;
}
function setOptions() {
 findObject("handleMenu").selectedIndex   = GhandleMenuIndex;
 findObject("handleLeft").value           = GhandleLeft;
 findObject("handleTop").value            = GhandleTop;
 findObject("handleWidth").value          = GhandleWidth;
 findObject("handleHeight").value         = GhandleHeight;
 findObject("bringToFront").checked       = GbringToFront;
 findObject("dropBackMenu").selectedIndex = GdropBackMenuIndex;
 findObject("dragJavascript").value       = GdragJavascript;
 findObject("dropJavascript").value       = GdropJavascript;
 findObject("callJsWhenSnapped").checked  = GcallJsWhenSnapped;
}

//*************** Pg1 Class ********************

function Pg1(theTabLabel) {
  this.tabLabel = theTabLabel;
  this.constrainSetObj = findObject("constrainSet");
  this.constrainSetHTML = stripSpaces(this.constrainSetObj.innerHTML);
  this.myLayer = findObject("mainLayer");  //used for rendering bug workaround
}
Pg1.prototype.getTabLabel = Pg1_getTabLabel;
Pg1.prototype.canLoad = Pg1_canLoad;
Pg1.prototype.load = Pg1_load;
Pg1.prototype.update = Pg1_update;
Pg1.prototype.unload = Pg1_unload;
Pg1.prototype.lastUnload = Pg1_lastUnload;

function Pg1_getTabLabel() {
  return this.tabLabel;
}

//Called to check if a page can be loaded
//
function Pg1_canLoad() {
  with (this) {
    constrainSetObj.innerHTML = (GconstrainMenuIndex)?constrainSetHTML:"";
  }
  return true;
}

//Called when the layer for this page is displayed.
// Use this call to initialize controls.
//
function Pg1_load() {
  setMain();
}

//Called when one of the page controls calls the tabControl update function.
// Use this call to respond to user input.
//
function Pg1_update(theItemName) {
  var theObj, temp, temp2;

  theObj = findObject(theItemName);
  with (this) {
    if (theItemName == "constrainMenu") {
      myLayer.visibility = "hidden";  //workaround: hide layer before changing
      constrainSetObj.innerHTML = (theObj.selectedIndex)?constrainSetHTML:"";
      myLayer.visibility = "visible";
  } }
}

//Called when another page is about to be shown, or finish() is called on
// the tabControl.  Use this call to perform any finishing tasks.
//
function Pg1_unload() {
  getMain();
  //setOptions();
  return true;
}

//Called when finish() is called on the tabControl.
// Use this call to perform any last minute page updates.
//
function Pg1_lastUnload() {
  //alert("lastUnload() called " + this.tabLabel);
  return true;
}


//********** Pg2 Class *************
function Pg2(theTabLabel) {
  this.tabLabel = theTabLabel;
  this.handleSetObj = findObject("handleSet");
  this.handleSetHTML = stripSpaces(this.handleSetObj.innerHTML);
  this.myLayer = findObject("optionsLayer");  //used for rendering bug workaround
}
Pg2.prototype.getTabLabel = Pg2_getTabLabel;
Pg2.prototype.canLoad = Pg2_canLoad;
Pg2.prototype.load = Pg2_load;
Pg2.prototype.update = Pg2_update;
Pg2.prototype.unload = Pg2_unload;
Pg2.prototype.lastUnload = Pg2_lastUnload;

function Pg2_getTabLabel() {
  return this.tabLabel;
}

//Called to check if a page can be loaded
//
function Pg2_canLoad() {
  with (this) {
    handleSetObj.innerHTML = (GhandleMenuIndex)?handleSetHTML:"";
  }
  return true;
}

//Called when the layer for this page is displayed.
// Use this call to initialize controls.
//
function Pg2_load() {
  setOptions();
  return true;
}

//Called when one of the page controls calls the tabControl update function.
// Use this call to respond to user input.
//
function Pg2_update(theItemName) {
  var theObj, temp, temp2;

  theObj = findObject(theItemName);
  with (this) {
    if (theItemName == "handleMenu") {
      myLayer.visibility = "hidden";  //workaround: hide layer before changing
      handleSetObj.innerHTML = (theObj.selectedIndex)?handleSetHTML:"";
      myLayer.visibility = "visible";
    }
  }
}

//Called when another page is about to be shown, or finish() is called on
// the tabControl.  Use this call to perform any finishing tasks.
//
function Pg2_unload() {
  getOptions();
  return true;
}

//Called when finish() is called on the tabControl.
// Use this call to perform any last minute page updates.
//
function Pg2_lastUnload() {
  return true;
}
