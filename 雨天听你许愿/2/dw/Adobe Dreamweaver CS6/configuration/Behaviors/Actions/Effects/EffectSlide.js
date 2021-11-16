// Copyright 2000-2007 Adobe Systems Incorporated.  All rights reserved.

//*************** GLOBALS VARS *****************

var helpDoc = MM.HELP_behEffectSlide;

var ELEMENTNAMES_ALLOWED; // list of elements to which the Slide Up/Down Effect can be asigned (initialized in "initGlobals()")
var ID_LIST;              // list of available IDs in the current document
var STATE_LIST;           // holds the string/value-pairs for the two effects
var OLD_VALUE_POOL;           // saves the old values and the sync state of the text fields


//******************* BEHAVIOR FUNCTION **********************

// Adds an Slide Up/Down-Effect to the element.
// Accepts the following arguments:
//  targetElement - ID or JavaScript DOM object of target element
//  duration      - duration time of applying the effect (in milliseconds)
//  from          - percentage of opacity to start (0 - 100)
//  to            - percentage of opacity to end (0 - 100)
//  toggle        - trigger effect again toggles to reverse behavior
//
function MM_effectSlide(targetElement, duration, from, to, toggle)
{
	Spry.Effect.DoSlide(targetElement, {duration: duration, from: from, to: to, toggle: toggle});
}


//******************* API **********************


//Can be used with any tag and any event

function canAcceptBehavior(){
	var retVal = "onClick,onMouseUp,onMouseDown,(onClick)";  // default is onClick
	return retVal;
}


//Returns a Javascript function to be inserted in HTML head with script tags.

function behaviorFunction(){
  return "MM_effectSlide";
}


//Returns fn call to insert in HTML tag <TAG... onEvent='thisFn(arg)'>

function applyBehavior()
{
	var theDOM = dw.getDocumentDOM(); // DOM of the current document

	// first we check if the <head> tag is in a locked region -> effect can't be added
	if(!theDOM.isHeadEditable())
		return dwscripts.sprintf(dw.loadString('spry/alert/lockedHeadRegion'), theDOM.getAttachedTemplate());

	var selIdx   = document.theForm.pageEltObj.selectedIndex;
	var selValue = document.theForm.pageEltObj.options[selIdx].value;
	var includeLibrary = true;
	var retVal;

	if(selValue=="default") // no target element selected
	{
		includeLibrary = false;
		retVal = MSG_SelectTargetOrCancel;
	}
	else if(selValue=="this") // effect is assigned to the behavior element
	{
		var selObj = dw.getBehaviorElement();
		if(!selObj)
			selObj = dw.getDocumentDOM().getSelectedNode();

		if(singleChildContentTagExists(selObj))
		{
			retVal = "MM_effectSlide(this, "+parseInt(document.theForm.durationObj.value)+", '"+parseFloat(document.theForm.fromObj.value)+document.theForm.fromTypeObj.options[document.theForm.fromTypeObj.selectedIndex].value+"', '"+parseFloat(document.theForm.toObj.value)+document.theForm.toTypeObj.options[document.theForm.toTypeObj.selectedIndex].value+"', "+document.theForm.toggleObj.checked+")";
		}
		else
		{
			includeLibrary = false;
			retVal = MSG_RequiresSingleChild;
		}
	}
	else // behavior element triggers effect which is assigned to a target element
	{
		var refIdx = parseInt(selValue);

		if(singleChildContentTagExists(theDOM.getElementById(ID_LIST[refIdx])))
		{
			retVal = "MM_effectSlide('"+ID_LIST[refIdx]+"', "+parseInt(document.theForm.durationObj.value)+", '"+parseFloat(document.theForm.fromObj.value)+document.theForm.fromTypeObj.options[document.theForm.fromTypeObj.selectedIndex].value+"', '"+parseFloat(document.theForm.toObj.value)+document.theForm.toTypeObj.options[document.theForm.toTypeObj.selectedIndex].value+"', "+document.theForm.toggleObj.checked+")";
		}
		else
		{
			includeLibrary = false;
			retVal = MSG_RequiresSingleChild;
		}
	}

	if(includeLibrary)
		effectsUtils.addLibraryInclude(); // make sure SpryEffects.js-lib is available

	return retVal;
}


//Passed the function call above, takes prior arguments and reloads the UI.
//Removes any escape characters "\"

function inspectBehavior(fnStr){
  var argArray = extractExprStr(fnStr);
 
  if (argArray.length == 5) { // we expect 5 args -> targetElement, duration, from, to, toggle
	var selIdx  = 0;
	var targetElement = effectsUtils.stripWhitespaces(unescExprStr(argArray[0],false).toLowerCase());

	if(targetElement == "this") // effect is assigned to the behavior element
	{
		var optIdx = effectsUtils.getPopupIndex(document.theForm.pageEltObj, 'this');
		if(optIdx >= 0)
			selIdx = optIdx;
	}
	else // behavior element triggers effect which is assigned to a target element
	{
		var idValue = targetElement;
		var found   = false;
		var i       = ID_LIST.length-1;
		while(!found && i>=0)
		{
			if(ID_LIST[i].toLowerCase()==idValue)
				found = true;
			else
				i--;
		}

		if(found)
		{
			var idxString = String(i);
			var optIdx    = effectsUtils.getPopupIndex(document.theForm.pageEltObj, idxString);
			if(optIdx >= 0)
				selIdx = optIdx;
		}
	}

	document.theForm.pageEltObj.selectedIndex = selIdx;
	document.theForm.durationObj.value = effectsUtils.stripWhitespaces(unescExprStr(argArray[1],false)); // duration time of applying the effect (in milliseconds)
	
	var fromValue = effectsUtils.stripWhitespaces(unescExprStr(argArray[2],false));
	var toValue   = effectsUtils.stripWhitespaces(unescExprStr(argArray[3],false));
	var stateIdx  = (parseFloat(fromValue) > parseFloat(toValue)) ? 0 : 1;

	document.theForm.effectTypeObj.selectedIndex = stateIdx;
	document.theForm.fromTxtObj.innerHTML = STATE_LIST[stateIdx][0];
	document.theForm.toTxtObj.innerHTML   = STATE_LIST[stateIdx][1];

	document.theForm.fromObj.value = parseFloat(fromValue);
	document.theForm.fromTypeObj.selectedIndex = getOptionIndex(document.theForm.fromTypeObj, fromValue);
	document.theForm.toObj.value   = parseFloat(toValue);
	document.theForm.toTypeObj.selectedIndex = getOptionIndex(document.theForm.toTypeObj, toValue);

	document.theForm.toggleObj.checked = (effectsUtils.stripWhitespaces(unescExprStr(argArray[4],false)) == "true");

	document.theForm.pageEltObj.focus();  // set focus on popup
  }
}


// Removes the reference to SpryEffects.js if it's no longer used.

function deleteBehavior(fnCallStr)
{
	initGlobals();
	effectsUtils.removeLibraryIncludeIfUnused();
}


//***************** LOCAL FUNCTIONS  ******************


//initializes the User Interface with default values

function initializeUI()
{
	initGlobals(); // initialize global vars

	//
	// we create the popup for all allowed elements in the document
	//
	var theDOM         = dw.getDocumentDOM(); // DOM of the current document
	var option_entries = new Array(); // to hold all the options-strings
	var targetElts     = new Array(); // to hold all the target elt/id-pairs

	// if selected element can be target for the effect we will add them too
	var selObj = dw.getBehaviorElement();
	if(!selObj)
		selObj = theDOM.getSelectedNode();
	var tagname = selObj ? selObj.tagName : "";
	var skipDefaultEntry = false;

	if(effectsUtils.elementNameIsAllowed(tagname, ELEMENTNAMES_ALLOWED, true))
	{
		option_entries.push("<option value=\"this\">&lt;"+MSG_ThisElement+"&gt;</option>");
		skipDefaultEntry = true;
	}
	else
	{
		option_entries.push("<option value=\"default\">*** " + MSG_SelectIDOfTarget + " ***</option>"); // we add a default entry
	}

	effectsUtils.fetchSuitableElements(theDOM.body, ELEMENTNAMES_ALLOWED, true, targetElts);

	for(var i=0; i<targetElts.length; i++)
	{
		ID_LIST.push(targetElts[i][1]);
		option_entries.push("<option value=\"" + i + "\">" + targetElts[i][0].toLowerCase() + " \"" + targetElts[i][1] + "\"</option>");
	}

	if(skipDefaultEntry || option_entries.length > 1) // there are potential elements to which the Slide Up/Down Effect can be applied to
		document.theForm.pageEltObj.innerHTML = option_entries.join("");
	else
		document.theForm.pageEltObj.innerHTML = "<option value=\"default\">*** " + MSG_NoValidTargetsAvailable + " ***</option>"

	document.theForm.pageEltObj.selectedIndex = 0;

	//
	// set default values to the rest of the input fields
	//
	document.theForm.durationObj.value = "1000"; // duration time of applying the effect (in milliseconds)

	var selIdx = 0; // Slide Up/Down

	document.theForm.effectTypeObj.selectedIndex = selIdx;
	document.theForm.fromTxtObj.innerHTML        = STATE_LIST[selIdx][0];
	document.theForm.toTxtObj.innerHTML          = STATE_LIST[selIdx][1];
	document.theForm.fromObj.value               = STATE_LIST[selIdx][2]; // percentage of opacity to start (0 - 100)
	document.theForm.toObj.value                 = STATE_LIST[selIdx][3]; // percentage of opacity to end (0 - 100)
	document.theForm.fromTypeObj.selectedIndex   = STATE_LIST[selIdx][4]; // "%" or "px"
	document.theForm.toTypeObj.selectedIndex     = STATE_LIST[selIdx][5]; // "%" or "px"

	document.theForm.toggleObj.checked = false;

	document.theForm.pageEltObj.focus();  // set focus on popup
}


// initializes the global vars
//
function initGlobals()
{
	ELEMENTNAMES_ALLOWED = new Array("blockquote", "dd", "form", "div", "center"); // elements to which the Slide Up/Down Effect can be assigned to (should be typed in lowercase letters)

	ID_LIST = new Array();
	STATE_LIST               = new Array([MSG_SlideUpFrom  , MSG_SlideUpTo  , 100,   0, 0, 0],   // holds the string/value/type-infos for the two effects
										 [MSG_SlideDownFrom, MSG_SlideDownTo,   0, 100, 0, 0]);
	OLD_VALUE_POOL           = new Array(["",true],["",true],["",true]); // saves the old values of the text fields
}


// Stores the value of the text field
//
function storeValue(idx, objectNode)
{
	if(objectNode && idx >= 0 && idx < OLD_VALUE_POOL.length && OLD_VALUE_POOL[idx][1])
		OLD_VALUE_POOL[idx][0] = objectNode.value;
}


// Checks if the duration-value is valid (digits only).
// If the value is not valid a info message appears.
function checkDuration(idx, objectNode)
{
	OLD_VALUE_POOL[idx][1] = false;

	if(objectNode && idx >= 0 && idx < OLD_VALUE_POOL.length)
	{
		var value = objectNode.value;

		if(!effectsUtils.onlyDigits(value))
		{
			var message = MSG_NotAValidValue;
			message = message.replace('%1',value);
			alert(message);

			objectNode.value = OLD_VALUE_POOL[idx][0];
		}
		else
		{
			OLD_VALUE_POOL[idx][1] = true;
		}
	}
}


// Checks if the value is valid (digits only)
// If the value is not valid a info message appears.
function checkFromToValue(idx, objectNode)
{
	OLD_VALUE_POOL[idx][1] = false;

	if(objectNode && idx >= 0 && idx < OLD_VALUE_POOL.length)
	{
		var value = objectNode.value;

		if(!effectsUtils.onlyDigits(value, false, true))
		{
			var message = MSG_NotAValidValue;
			message = message.replace('%1',value);
			alert(message);

			objectNode.value = OLD_VALUE_POOL[idx][0];
		}
		else
		{
			OLD_VALUE_POOL[idx][1] = true;
		}
	}
}


// returns the index of the optionRoot which fits to the checkString
//
function getOptionIndex(optionRoot, checkString)
{
	if(optionRoot && checkString)
	{
		var optionsCount = optionRoot.options.length;
		for(var i=0; i<optionsCount; i++)
			if(checkString.indexOf(optionRoot.options[i].value) >= 0)
				return i;
	}

	return -1;
}


// checks if the given element has a single content tag-child
//
function singleChildContentTagExists(element)
{
  // Define a list of alloed tags for the inner content tag. There should be one and only one of these tags as element child
  var allowedContentTags = ["blockquote", "dd", "div", "form", "center", "table", "span", "input", "textarea", "select", "img"];

	if(element == undefined || element == null)
		return false;

	if(element.hasChildNodes())
	{
		var childCnt = element.childNodes.length;
		var eltCount = 0;

		for(var i=0; i<childCnt; i++)
		{
			var potChildCurr = element.childNodes[i];
			var nodeType     = potChildCurr.nodeType;
			if(nodeType == 1) // element node
			{
				tagNameStr = potChildCurr.tagName.toLowerCase();
        if(dwscripts.findInArray(allowedContentTags, tagNameStr) == -1)
					return false;

				if(eltCount == 0)
					eltCount++
				else
					return false;
			}
			else if(nodeType == 3) // Node.TEXT_NODE
			{
				if(potChildCurr.data.search(/\S/) >= 0) // there is a non whitespace character available
					return false;
			}
		}

		if(eltCount==1)
			return true;
	}

	return false;
}

// changes the values of the to- and from-fields and chnages the according effect descriptions
//
function changeFromTo()
{
	var selIdx = document.theForm.effectTypeObj.selectedIndex;

	document.theForm.fromTxtObj.innerHTML = STATE_LIST[selIdx][0];
	document.theForm.toTxtObj.innerHTML   = STATE_LIST[selIdx][1];

	var buffer = document.theForm.fromObj.value;

	document.theForm.fromObj.value = document.theForm.toObj.value;
	document.theForm.toObj.value   = buffer;

	selIdx = document.theForm.fromTypeObj.selectedIndex;
	document.theForm.fromTypeObj.selectedIndex = document.theForm.toTypeObj.selectedIndex;
	document.theForm.toTypeObj.selectedIndex   = selIdx;
}
