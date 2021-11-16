//--------------------------------------------------------------------
// CLASS:
//   issueUtils
//
// DESCRIPTION:
//   This class contains utility functions for creating Browser
//   Compatibility Check Issues files (although the functions
//   could be used elsewhere as well).
//
// PUBLIC PROPERTIES:
//
//   issueUtils.REP_ICON_STOP
//   issueUtils.REP_ICON_YIELD
//   issueUtils.CONFIDENCE_HIGH
//   issueUtils.CONFIDENCE_MEDHIGH
//   issueUtils.CONFIDENCE_MEDLOW
//   issueUtils.CONFIDENCE_LOW
//
// PUBLIC FUNCTIONS:
//   STYLE
//   issueUtils.expShrt
//   issueUtils.hasBorder
//   issueUtils.ancestorHasBorder
//
//   DOM
//   issueUtils.hasInlineChildren
//   issueUtils.getFloats
//   issueUtils.isFloat
//   issueUtils.isBlockTag
//   issueUtils.getContainers
//   issueUtils.findLinksInContainer
//   issueUtils.findClearingElement
//   issueUtils.collectNodes
//   issueUtils.foundNode
//   issueUtils.getTotalFloatWidth
//
//   TESTING
//   issueUtils.reportIssues
//


function issueUtils()
{
}

// Static Properties
issueUtils.REP_ICON_STOP = "10";
issueUtils.REP_ICON_YIELD = "9";
issueUtils.CONFIDENCE_HIGH = 4;
issueUtils.CONFIDENCE_MEDHIGH = 3;
issueUtils.CONFIDENCE_MEDLOW = 2;
issueUtils.CONFIDENCE_LOW = 1;

// Static Methods
issueUtils.expShrt = issueUtils_expShrt;
issueUtils.hasBorder = issueUtils_hasBorder;
issueUtils.setsBorder = issueUtils_setsBorder;
issueUtils.ancestorHasBorder = issueUtils_ancestorHasBorder;
issueUtils.setsBackground = issueUtils_setsBackground;
issueUtils.hasInlineChildren = issueUtils_hasInlineChildren;
issueUtils.getFloats = issueUtils_getFloats;
issueUtils.isFloat = issueUtils_isFloat;
issueUtils.isBlockTag = issueUtils_isBlockTag;
issueUtils.reportIssues = issueUtils_reportIssues;
issueUtils.getContainers = issueUtils_getContainers;
issueUtils.findLinksInContainer = issueUtils_findLinksInContainer;
issueUtils.findClearingElement = issueUtils_findClearingElement;
issueUtils.collectNodes = issueUtils_collectNodes;
issueUtils.foundNode = issueUtils_foundNode;
issueUtils.getTotalFloatWidth = issueUtils_getTotalFloatWidth;
issueUtils.isEmptyTag = issueUtils_isEmptyTag

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.expShrt
//
// DESCRIPTION:
//   Expands shorthand notation for the specified property into
//   the individual longhand properties IF, AND ONLY IF, the
//   individual longhand properties have not already been set.
//   Use this function only if you need to see actual set values
//   for individual margin and padding properties (e.g., if you
//   need to know units). If you just need to know whether an
//   element has padding-left, for example, you can test for
//   parseFloat(elem.getComputedStyleProp("padding-left")) > 0
//
// ARGUMENTS:
//   props - a CSSStyleProps object (the result of a 
//     window.getDeclaredStyle() call)
//   whichProp - a string indicating which property to expand
//     (currently the function supports "margin" and "padding")
//              
// RETURNS:
//   a CSSStyleProps object with the individual longhand properties
//   set.
//--------------------------------------------------------------------
function issueUtils_expShrt(props,whichProp){
  if (whichProp.toLowerCase() == "margin"){
    var marginLeft, marginRight, marginTop, marginBottom = true;
    if (typeof(props.marginLeft) == "undefined") marginLeft = false;
    if (typeof(props.marginRight) == "undefined") marginRight = false;
    if (typeof(props.marginTop) == "undefined") marginTop = false;
    if (typeof(props.marginBottom) == "undefined") marginBottom = false;
    if ((!marginLeft || !marginRight || !marginTop || !marginBottom) && typeof(props.margin) != "undefined"){
      var marginStr = props.margin.replace(/\s+/g," ");
      var margin = marginStr.split(" ");
      if (margin.length == 4){
        if (!marginTop) props.marginTop = margin[0];
        if (!marginRight) props.marginRight = margin[1];
        if (!marginBottom) props.marginBottom = margin[2];
        if (!marginLeft) props.marginLeft = margin[3];
      }else if (margin.length == 3){
        if (!marginTop) props.marginTop = margin[0];
        if (!marginRight) props.marginRight = margin[1];
        if (!marginBottom) props.marginBottom = margin[2];
        if (!marginLeft) props.marginLeft = margin[1];
      }else if (margin.length == 2){
        if (!marginTop) props.marginTop = margin[0];
        if (!marginRight) props.marginRight = margin[1];
        if (!marginBottom) props.marginBottom = margin[0];
        if (!marginLeft) props.marginLeft = margin[1];
      }else if (margin.length == 1){
        if (!marginTop) props.marginTop = margin[0];
        if (!marginRight) props.marginRight = margin[0];
        if (!marginBottom) props.marginBottom = margin[0];
        if (!marginLeft) props.marginLeft = margin[0];
      }
    }
  }
  else if (whichProp.toLowerCase() == "padding"){
    //padding
    var paddingLeft, paddingRight, paddingTop, paddingBottom = true;
    if (typeof(props.paddingLeft) == "undefined") paddingLeft = false;
    if (typeof(props.paddingRight) == "undefined") paddingRight = false;
    if (typeof(props.paddingTop) == "undefined") paddingTop = false;
    if (typeof(props.paddingBottom) == "undefined") paddingBottom = false;
    if ((!paddingLeft || !paddingRight || !paddingTop || !paddingBottom) && typeof(props.padding) != "undefined"){
      var paddingStr = props.padding.replace(/\s+/g," ");
      var padding = paddingStr.split(" ");
      if (padding.length == 4){
        if (!paddingTop) props.paddingTop = padding[0];
        if (!paddingRight) props.paddingRight = padding[1];
        if (!paddingBottom) props.paddingBottom = padding[2];
        if (!paddingLeft) props.paddingLeft = padding[3];
      }else if (padding.length == 3){
        if (!paddingTop) props.paddingTop = padding[0];
        if (!paddingRight) props.paddingRight = padding[1];
        if (!paddingBottom) props.paddingBottom = padding[2];
        if (!paddingLeft) props.paddingLeft = padding[1];
      }else if (padding.length == 2){
        if (!paddingTop) props.paddingTop = padding[0];
        if (!paddingRight) props.paddingRight = padding[1];
        if (!paddingBottom) props.paddingBottom = padding[0];
        if (!paddingLeft) props.paddingLeft = padding[1];
      }else if (padding.length == 1){
        if (!paddingTop) props.paddingTop = padding[0];
        if (!paddingRight) props.paddingRight = padding[0];
        if (!paddingBottom) props.paddingBottom = padding[0];
        if (!paddingLeft) props.paddingLeft = padding[0];
      }
    }
  }
  return props;
}

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.hasBorder
//
// DESCRIPTION:
//   Determines whether the passed-in element has a border on the side
//   indicated (or any border at all, if no side is indicated).
//
// ARGUMENTS:
//   elt - the element to check for a border
//   pseudoElt - [optional] the pseudoElement to check 
//   (e.g., ":first-letter")
//   side - [optional] the side to check (e.g., "left" or "bottom");
//              
// RETURNS:
//   a boolean value indicating whether the element has a border on
//   the indicated side.
//--------------------------------------------------------------------
function issueUtils_hasBorder(elt,pseudoElt,side){
  var hasBorder = false;
  var hasRight = false, hasLeft = false, hasTop = false, hasBottom = false;
  
  if (parseFloat(elt.getComputedStyleProp("border-width")) > 0)
  {
    hasBorder = true;
  }
  if (!hasBorder) {
    if (parseFloat(elt.getComputedStyleProp("border-top-width")) > 0)
    {
      hasTop = true;
    }
    if (parseFloat(elt.getComputedStyleProp("border-bottom-width")) > 0)
    {
      hasBottom = true;
    }
    if (parseFloat(elt.getComputedStyleProp("border-right-width")) > 0)
    {
      hasRight = true;
    }
    if (parseFloat(elt.getComputedStyleProp("border-left-width")) > 0)
    {
      hasLeft = true;
    }

    if (!side && (hasLeft || hasTop || hasBottom || hasRight))
    {
      hasBorder = true;
    }
    
    if (side){
      side = side.toLowerCase();
    }
      
    if (side == "left" && hasLeft){
      hasBorder = true;
    }
    else if (side == "right" && hasRight){
      hasBorder = true;
    }
    else if (side == "bottom" && hasBottom){
      hasBorder = true;
    }
    else if (side == "top" && hasTop){
      hasBorder = true;
    }
  }
  return hasBorder;
}

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.ancestorHasBorder
//
// DESCRIPTION:
//   Determines whether the passed-in element or any of its ancestors
//   has a border on the side indicated (or any border at all, if no 
//   side is indicated).
//
// ARGUMENTS:
//   elt - the element to check for a border
//   pseudoElt - the pseudoElement to check (e.g., ":first-letter")
//   side - [optional] the side to check (e.g., "left" or "bottom");
//              
// RETURNS:
//   a boolean value indicating whether the element or one of its
//   ancestors has a border on the indicated side.
//--------------------------------------------------------------------
function issueUtils_ancestorHasBorder(elt,pseudoElt,side){
  var hb = false;
  while (!hb && elt.parentNode){
    hb = issueUtils.hasBorder(elt.parentNode,pseudoElt,side);
    elt = elt.parentNode;
  }
  return hb;
}

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.setsBorder
//
// DESCRIPTION:
//   Similar to hasBorder, only uses declared styles rather than
//   computed styles in order to give access to pseudoclasses
//   such as ":hover" and ":visited".
//
// ARGUMENTS:
//   elt - the element to check for a border
//   pseudoElt - the pseudoElement to check 
//   (e.g., ":first-letter"), or null if none
//   pseduoClasses - a comma-separated list of pseduoclasses
//   (e.g., ":hover,:visited")
//   side - [optional] the side to check (e.g., "left" or "bottom");
//              
// RETURNS:
//   a boolean value indicating whether the element has a border on
//   the indicated side.
//--------------------------------------------------------------------
function issueUtils_setsBorder(elt,psuedoElt,pseudoClasses,side){
  var props = window.getDeclaredStyle(elt,psuedoElt,pseudoClasses);
  var setsBorder = false;
  var setsRight = false, setsLeft = false, setsTop = false, setsBottom = false;
  
  if (typeof(props.border) != "undefined" ||
      typeof(props.borderStyle) != "undefined" ||
      typeof(props.borderWidth) != "undefined" ||
      typeof(props.borderColor) != "undefined"){
        setsBorder = true;
  }
  if (!setsBorder) {
    if (typeof(props.borderTop) != "undefined" ||
        typeof(props.borderTopStyle) != "undefined" ||
        typeof(props.borderTopWidth) != "undefined" ||
        typeof(props.borderTopColor) != "undefined"){
          setsTop = true;
    }
    if (typeof(props.borderBottom) != "undefined" ||
        typeof(props.borderBottomStyle) != "undefined" ||
        typeof(props.borderBottomWidth) != "undefined" ||
        typeof(props.borderBottomColor) != "undefined"){
          setsBottom = true;
    }
    if (typeof(props.borderRight) != "undefined" ||
        typeof(props.borderRightStyle) != "undefined" ||
        typeof(props.borderRightWidth) != "undefined" ||
        typeof(props.borderRightColor) != "undefined"){
          setsRight = true;
    }
    if (typeof(props.borderLeft) != "undefined" ||
        typeof(props.borderLeftStyle) != "undefined" ||
        typeof(props.borderLeftWidth) != "undefined" ||
        typeof(props.borderLeftColor) != "undefined"){
          setsLeft = true;
    }

    if (!side && (setsLeft || setsTop || setsBottom || setsRight)){
      setsBorder = true;
    }
    
    if (side){
      side = side.toLowerCase();
    }
      
    if (side == "left" && setsLeft){
      setsBorder = true;
    }
    else if (side == "right" && setsRight){
      setsBorder = true;
    }
    else if (side == "bottom" && setsBottom){
      setsBorder = true;
    }
    else if (side == "top" && setsTop){
      setsBorder = true;
    }
  }
  return setsBorder;
}

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.setsBackground
//
// DESCRIPTION:
//   Uses declared styles to determine whether the passed-in element
//   has a background set on it explicitly (as opposed to inheriting
//   it from an ancestor).
//
// ARGUMENTS:
//   elt - the element to check for a border
//   pseudoElt - [optional] the pseudoElement to check 
//   (e.g., ":first-letter"), or null if none
//   pseduoClasses - [optional] a comma-separated list of pseduoclasses
//   (e.g., ":hover,:visited")
//              
// RETURNS:
//   a boolean value indicating whether the element has an explicit
//   background
//--------------------------------------------------------------------
function issueUtils_setsBackground(elt,psuedoElt,pseudoClasses){
  var props = window.getDeclaredStyle(elt,psuedoElt,pseudoClasses);
  var setsBackground = false;
  
  if (typeof(props.background) != "undefined" ||
      typeof(props.backgroundImage) != "undefined" ||
      typeof(props.backgroundColor) != "undefined"){
        setsBackground = true;
  }
  return setsBackground;
}

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.hasInlineChildren
//
// DESCRIPTION:
//   Determines whether the passed-in element has inline children
//   (or grandchildren)
//
// ARGUMENTS:
//   elt - the element to check for inline children
//              
// RETURNS:
//   a boolean value indicating whether the element has an inline
//   descendant.
//--------------------------------------------------------------------
function issueUtils_hasInlineChildren(elt){
  var foundInlineNode = false;
  var children = elt.childNodes;
  var currChild = null;

  for (var i = 0; i < children.length; i++){
    currChild = children[i];
    if (currChild.nodeType == 3){
      foundInlineNode = true;
      break;
    }
    else if ((currChild.nodeType == 1) && currChild.isInlineElement()){
      foundInlineNode = true;
      break;
    }
    else if ((currChild.nodeType == 1) && currChild.hasChildNodes()){
      foundInlineNode = issueUtils.hasInlineChildren(currChild);
      if (foundInlineNode)
        break;
    }		  
  }
	return foundInlineNode;
}

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.getFloats
//
// DESCRIPTION:
//   Finds all the floats in the specified container node.
//
// ARGUMENTS:
//   node - the node from which to start collecting floats
//   floatSide - [optional] get only "left" floats or "right" floats
//              
// RETURNS:
//   an array of floated elements, or an empty array if no
//   floats were found.
//--------------------------------------------------------------------
function issueUtils_getFloats(node,floatSide){
  if (!node) node = dw.getDocumentDOM();
  var blocks = node.getBlockElements();
  var floats = new Array();
  var props = null, currBlock = null;
  
  for (var i=0; i < blocks.length; i++){
    currBlock = blocks[i];
    props = window.getDeclaredStyle(currBlock);
    if (floatSide){
      if (props.cssFloat == floatSide)
        floats.push(currBlock);
    }    
    else if (typeof(props.cssFloat) != "undefined" && props.cssFloat != "none"){
      floats.push(currBlock);
    } 
  }
  return floats;
}

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.isFloat
//
// DESCRIPTION:
//   Determines whether the specified element is floated.
//
// ARGUMENTS:
//   node - the node to check for floatiness
//   floatSide - [optional] limits check to either "left" or "right"
//              
// RETURNS:
//   an array of floated elements, or an empty array if no
//   floats were found.
//--------------------------------------------------------------------
function issueUtils_isFloat(node,floatSide){
  var props = null, isFloat = false;
  if (node.nodeType == Node.ELEMENT_NODE){
    props = window.getDeclaredStyle(node);
    
    if (typeof(props.cssFloat) != "undefined" && props.cssFloat != "none"){
      if (!floatSide){
        isFloat = true;
      }
      else if (props.cssFloat == floatSide){
          isFloat = true;
      } 
    }
  }
  return isFloat;
}


//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.isBlockTag
//
// DESCRIPTION:
//   Determines whether the specified element has an implicit display
//   value of 'block'. Ignores any styles.
//
// ARGUMENTS:
//   elem - the element to report on.
//              
// RETURNS:
//   A Boolean value indicating whether the element is a block level
//   tag by default.
//--------------------------------------------------------------------
function issueUtils_isBlockTag(elem){
  if (elem.nodeType != Node.ELEMENT_NODE)
    return false;
  
  var tagName = elem.tagName;
  switch(tagName){
		case "P":
		case "DIV":
		case "H1":
		case "H2":
		case "H3":
		case "H4":
		case "H5":
		case "H6":
		case "TABLE":
		case "TD":
		case "TH":
		case "TR":
		case "FORM":
		case "LI":
		case "OL":
		case "UL":
		case "BODY":
		case "HTML":
		case "PRE":
		case "DD":
		case "DL":
		case "DT":
		case "FIELDSET":
		case "ASP_DATAGRID":
		case "ASP_DATALIST":
		case "ADDRESS":
		case "BLOCKQUOTE":
		case "BQ":
		case "CENTER":
		case "DIR":
		case "ILAYER":
		case "LAYER":
		case "MENU":
			return true;
		default:
		  return false;
	}
}

// Used by getContainers() to determine whether a tag
// *could* have children, even if it doesn't. Empty tags
// can't have children.
function issueUtils_isEmptyTag(elem){
  if (elem.nodeType != Node.ELEMENT_NODE)
    return false;
  
  var tagName = elem.tagName;
  switch(tagName){
		case "IMG":
		case "BR":
		case "INPUT":
		case "PARAM":
		case "COL":
		case "HR":
		case "AREA":
		case "FRAME":
		case "BASE":
		case "BASEFONT":
		case "ISINDEX":
			return true;
		default:
		  return false;
	}
}

// This function is handy for testing your issue files as Commands before turning
// them into actual issues files. (BCC will only report that a JS error occurred
// in a particular function, not where or what the error was.)
function issueUtils_reportIssues(issueNodes, resWin, strDesc, iconNum, id, colData){
var DOM = dw.getDocumentDOM();
// Use if reporting Issues in Results floater
  if (arguments.length > 1){
    var offsets, iLineNo;
    for (var i=0; i < issueNodes.length; i++){
      offsets = DOM.nodeToSourceViewOffsets(issueNodes[i]);
      iLineNo = DOM.source.getLineFromOffset(offsets[0]);
      if (typeof(colData[0]) == "number"){
        colData.shift();
      }
      colData.unshift(iLineNo);
      resWin.addItem(resWin, iconNum, strDesc, id, offsets[0], offsets[1], colData);
    }
  }
  else {
    // The testing version for Issues as Commands
    var resultsStr = getIssueName() + "\n\n";
    for (var k=0; k < issueNodes.length; k++){
      if (issueNodes[k].nodeType == 3 || issueNodes[k].nodeType == 8){
        resultsStr += "Line " + DOM.source.getLineFromOffset(DOM.nodeToOffsets(issueNodes[k])[0]) + ": " + issueNodes[k].data.substring(0,30) + "\n\n";
      }else{
        resultsStr += "Line " + DOM.source.getLineFromOffset(DOM.nodeToOffsets(issueNodes[k])[0]) + ": " + issueNodes[k].outerHTML.substring(0,30) + "\n\n";
      }
    }
    resultsStr += getIssueDescription() + "\n";
    resultsStr += "[" + getAffectedBrowserProfiles().join(", ") + "]\n";
    TA_RESULTS.value = resultsStr;
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.getContainers
//
// DESCRIPTION:
//   Finds all the non-empty tags in the document, starting at
//   the specified node.
//
// ARGUMENTS:
//   startNode - the node from which to start collecting containers.
//   Generally this should be either the body or a node inside the
//   body.
//   retArray - the array to populate with containers.
//              
// RETURNS:
//   an array of container elements, or an empty array if no
//   containers were found.
//--------------------------------------------------------------------
function issueUtils_getContainers(startNode,retArray){
  var children = startNode.childNodes;
  var currChild = null;
  if (!retArray) retArray = new Array();
  for (var i=0; i < children.length; i++){
    currChild = children[i];
    if (currChild.hasChildNodes() || (currChild.nodeType == 1 && !issueUtils.isEmptyTag(currChild))){
      retArray.push(currChild);
      retArray = issueUtils.getContainers(currChild,retArray);
    }
  }
  return retArray;
}

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.findLinksInContainer
//
// DESCRIPTION:
//   Finds all the links inside the specified container.
//
// ARGUMENTS:
//   container - the container inside which to check for links.
//   startAtChild - where to start looking. Usually this will be
//   0, but if you have a bug that only affects the second and
//   subsequent links inside a container, you'd want to start at
//   child #1.
//   links - an array in which to store the found links
//              
// RETURNS:
//   the passed-in links array, populated with any found links.
//--------------------------------------------------------------------
function issueUtils_findLinksInContainer(container,startAtChild,links){
  if (container.tagName == 'A'){
    links.push(container);
  }
  var children = container.childNodes;
  var currChild = null;
  for (var i = startAtChild; i < children.length; i++){
    currChild = children[i];
    if (currChild.nodeType == Node.ELEMENT_NODE){
      if (currChild.tagName == 'A'){
        links.push(currChild);
      }
      else if (currChild.hasChildNodes())
        links = issueUtils.findLinksInContainer(currChild,0,links);
    }
  }
	return links;
}

//--------------------------------------------------------------------
// FUNCTION:
//   issueUtils.getTotalFloatWidth
//
// DESCRIPTION:
//   Adds the width, padding, margins, and borders of the passed-in
//   float, and, if countPreviousFloats is true, all adjacent
//   preceding floats.
//
// ARGUMENTS:
//   baseFloat - an element node representing the main float for which 
//   you want a width.
//   countAdjacentFloats - a Boolean value indicating whether to count
//   adjacent preceding (left) or following (right) floats. Defaults 
//   to false.
//   useMinWidthInsteadOfComputed - a Boolean value value indicating
//   whether to account for expanding box problems or just to go
//   with the computed width. Defaults to false.
//
// RETURNS:
//   The total width of the float(s) in question.
//--------------------------------------------------------------------
function issueUtils_getTotalFloatWidth(baseFloat, countAdjacentFloats,useMinWidthInsteadOfComputed){
  var dom = dw.getDocumentDOM();
  var totalFloatWidth = 0;
  var floatArray = new Array();
  if (baseFloat.nodeType != Node.ELEMENT_NODE)
    return -1;
  else
    floatArray.push(baseFloat);
  
  var floatDir = baseFloat.getComputedStyleProp("float");
  
  if (countAdjacentFloats){
    if (floatDir == "left"){
      var prev = baseFloat.previousSibling;
      while (prev && 
             prev.nodeType == Node.ELEMENT_NODE &&
             prev.getComputedStyleProp("float") == floatDir)
      {
          floatArray.push(prev);
          prev = prev.previousSibling;
      }
    }
    else {
      var next = baseFloat.nextSibling;
      while (next && 
             next.nodeType == Node.ELEMENT_NODE &&
             next.getComputedStyleProp("float") == floatDir)
      {
          floatArray.push(next);
          next = next.nextSibling;
      }
    }
  }

  var currFloat = null;
  for (var i=0; i < floatArray.length; i++){
    currFloat = floatArray[i];
    if (useMinWidthInsteadOfComputed)
      totalFloatWidth += parseFloat(dom.getMinDisplayWidth(currFloat));
    else
      totalFloatWidth += parseFloat(currFloat.getComputedStyleProp("width"));
    totalFloatWidth += parseFloat(currFloat.getComputedStyleProp("padding-right"));
    totalFloatWidth += parseFloat(currFloat.getComputedStyleProp("padding-left"));
    totalFloatWidth += parseFloat(currFloat.getComputedStyleProp("border-right-width"));
    totalFloatWidth += parseFloat(currFloat.getComputedStyleProp("border-left-width"));
    // account for collapsing margins
    if (floatDir == "left" || i == 0)
      totalFloatWidth += parseFloat(currFloat.getComputedStyleProp("margin-right"));
    if (floatDir == "right" || i == 0)
      totalFloatWidth += parseFloat(currFloat.getComputedStyleProp("margin-left"));
  }
  return totalFloatWidth;
}

// not yet implemented, obviously. :)
function issueUtils_findClearingElement(startNode){
}

// used as a callback for dwscripts.traverseDOM()
// collects all nodes of a certain type (depending on where you
// put this function name in the list of traverseDOM()
// arguments)
function issueUtils_collectNodes(node,retArray){
  retArray.push(node);
  return true;
}

// used as a callback for dwscripts.traverseDOM()
// stops the traverse when a single node 
// of a certain type is found by returning 
// false
function issueUtils_foundNode(node,foundArray){
  foundArray.push(node);
  return false;
}

