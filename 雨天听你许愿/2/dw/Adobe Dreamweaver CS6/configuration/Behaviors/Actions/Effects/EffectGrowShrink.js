// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//*************** GLOBALS VARS *****************

var helpDoc = MM.HELP_behEffectGrowShrink;

var ELEMENTNAMES_ALLOWED; // list of elements to which the Grow/Shrink Effect can be asigned (initialized in "initGlobals()")
var ID_LIST;              // list of available IDs in the current document
var STATE_LIST;           // holds the string/value-pairs for the two effects
var OLD_VALUE_POOL;       // saves the old values and the sync state of the text fields


//******************* BEHAVIOR FUNCTION **********************

// Adds an Grow/Shrink-Effect to the element.
// Accepts the following arguments:
//  targetElement - ID or JavaScript DOM object of target element
//  duration      - duration time of applying the effect (in milliseconds)
//  from          - percentage of opacity to start (0 - 100)
//  to            - percentage of opacity to end (0 - 100)
//  toggle        - trigger effect again toggles to reverse behavior
//
function MM_effectGrowShrink(targetElement, duration, from, to, toggle, referHeight, growFromCenter)
{
	Spry.Effect.DoGrow(targetElement, {duration: duration, from: from, to: to, toggle: toggle, referHeight: referHeight, growCenter: growFromCenter});
}


//******************* API **********************


//Can be used with any tag and any event

function canAcceptBehavior(){
	var retVal = "onClick,onMouseUp,onMouseDown,(onClick)";  // default is onClick
	return retVal;
}


//Returns a Javascript function to be inserted in HTML head with script tags.

function behaviorFunction(){
  return "MM_effectGrowShrink";
}


//Returns fn call to insert in HTML tag <TAG... onEvent='thisFn(arg)'>

function applyBehavior()
{
	var theDOM = dw.getDocumentDOM();

	// first we check if the <head> tag is in a locked region -> effect can't be added
	if(!theDOM.isHeadEditable())
		return dwscripts.sprintf(dw.loadString('spry/alert/lockedHeadRegion'), theDOM.getAttachedTemplate());

	var selIdx         = document.theForm.pageEltObj.selectedIndex;
	var selValue       = document.theForm.pageEltObj.options[selIdx].value;
	var includeLibrary = true;
	var referHeight    = document.theForm.referTypeObj.selectedIndex == 1 ? true : false; // 0: wide, 1: high
	var retVal;

	if(selValue=="default") // no target element selected
	{
		includeLibrary = false;
		retVal = MSG_SelectTargetOrCancel;
	}
	else if(selValue=="this") // effect is assigned to the behavior element
	{
		retVal = "MM_effectGrowShrink(this, "+parseInt(document.theForm.durationObj.value)+", '"+parseFloat(document.theForm.fromObj.value)+document.theForm.fromTypeObj.options[document.theForm.fromTypeObj.selectedIndex].value+"', '"+parseFloat(document.theForm.toObj.value)+document.theForm.toTypeObj.options[document.theForm.toTypeObj.selectedIndex].value+"', "+document.theForm.toggleObj.checked+", "+referHeight+", "+(document.theForm.growCenterObj.options[document.theForm.growCenterObj.selectedIndex].value == "center" ? "true" : "false")+")";
	}
	else // behavior element triggers effect which is assigned to a target element
	{
		var refIdx = parseInt(selValue);
		retVal = "MM_effectGrowShrink('"+ID_LIST[refIdx]+"', "+parseInt(document.theForm.durationObj.value)+", '"+parseFloat(document.theForm.fromObj.value)+document.theForm.fromTypeObj.options[document.theForm.fromTypeObj.selectedIndex].value+"', '"+parseFloat(document.theForm.toObj.value)+document.theForm.toTypeObj.options[document.theForm.toTypeObj.selectedIndex].value+"', "+document.theForm.toggleObj.checked+", "+referHeight+", "+(document.theForm.growCenterObj.options[document.theForm.growCenterObj.selectedIndex].value == "center" ? "true" : "false")+")";
	}

	if(includeLibrary)
		effectsUtils.addLibraryInclude(); // make sure SpryEffects.js-lib is available

	return retVal;
}


//Passed the function call above, takes prior arguments and reloads the UI.
//Removes any escape characters "\"

function inspectBehavior(fnStr){
  var argArray = extractExprStr(fnStr);
 
  if (argArray.length == 7) { // we expect 7 args -> targetElement, duration, from, to, toggle, referHeight, growFromCenter
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
	var stateIdx  = (parseFloat(fromValue) > parseFloat(toValue)) ? 1 : 0; // 0: grow, 1: shrink

	document.theForm.effectTypeObj.selectedIndex = stateIdx;
	document.theForm.fromTxtObj.innerHTML = STATE_LIST[stateIdx][0];
	document.theForm.toTxtObj.innerHTML   = STATE_LIST[stateIdx][1];

	if(stateIdx == 1) // shrink
		document.theForm.directionTypeObj.innerHTML = STATE_LIST[stateIdx][1];
	else // grow
		document.theForm.directionTypeObj.innerHTML = STATE_LIST[stateIdx][0];

	document.theForm.fromObj.value = parseFloat(fromValue);
	document.theForm.fromTypeObj.selectedIndex = getOptionIndex(document.theForm.fromTypeObj, fromValue);
	document.theForm.toObj.value   = parseFloat(toValue);
	document.theForm.toTypeObj.selectedIndex = getOptionIndex(document.theForm.toTypeObj, toValue);

	document.theForm.growCenterObj.selectedIndex = (effectsUtils.stripWhitespaces(unescExprStr(argArray[6],false)) == "true" ? 1 : 0); // 0: "Top Left Corner", 1: "Center"
	document.theForm.toggleObj.checked = (effectsUtils.stripWhitespaces(unescExprStr(argArray[4],false)) == "true");

	if(effectsUtils.stripWhitespaces(unescExprStr(argArray[5],false)) == "true")
		document.theForm.referTypeObj.selectedIndex = 1;
	else
		document.theForm.referTypeObj.selectedIndex = 0;

	handleReferTypeVisibility();

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

	if(skipDefaultEntry || option_entries.length > 1) // there are potential elements to which the Grow/Shrink Effect can be applied to
		document.theForm.pageEltObj.innerHTML = option_entries.join("");
	else
		document.theForm.pageEltObj.innerHTML = "<option value=\"default\">*** " + MSG_NoValidTargetsAvailable + " ***</option>"

	document.theForm.pageEltObj.selectedIndex = 0;

	//
	// set default values to the rest of the input fields
	//
	document.theForm.durationObj.value = "1000"; // duration time of applying the effect (in milliseconds)

	var selIdx = 1; // 0: grow, 1: shrink

	document.theForm.effectTypeObj.selectedIndex = selIdx;
	document.theForm.fromTxtObj.innerHTML        = STATE_LIST[selIdx][0];
	document.theForm.toTxtObj.innerHTML          = STATE_LIST[selIdx][1];

	if(selIdx == 1) // shrink
		document.theForm.directionTypeObj.innerHTML   = STATE_LIST[selIdx][1];
	else // grow
		document.theForm.directionTypeObj.innerHTML = STATE_LIST[selIdx][0];

	document.theForm.fromObj.value               = STATE_LIST[selIdx][2]; // percentage of opacity to start (0 - 100)
	document.theForm.toObj.value                 = STATE_LIST[selIdx][3]; // percentage of opacity to end (0 - 100)
	document.theForm.fromTypeObj.selectedIndex   = STATE_LIST[selIdx][4]; // "%" or "px"
	document.theForm.toTypeObj.selectedIndex     = STATE_LIST[selIdx][5]; // "%" or "px"
	document.theForm.growCenterObj.selectedIndex = 1; // 0: "Top Left Corner", 1: "Center"

	document.theForm.toggleObj.checked = false;
	handleReferTypeVisibility();

	document.theForm.pageEltObj.focus();  // set focus on popup
}


// initializes the global vars
//
function initGlobals()
{
	ELEMENTNAMES_ALLOWED = new Array("address", "dd", "div", "dl", "dt", "form", "img", "p", "ol", "ul", "applet", "center", "dir", "menu", "pre"); // elements to which the Grow/Shrink Effect can be assigned to (should be typed in lowercase letters)

	ID_LIST = new Array();
	STATE_LIST               = new Array([MSG_GrowFrom  , MSG_GrowTo  ,   0, 100, 0, 0],   // holds the string/value/type-infos for the two effects
										 [MSG_ShrinkFrom, MSG_ShrinkTo, 100,   0, 0, 0]);
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


// sets the enable state of the referTypeObj (according the values of fromTypeObj and toTypeObj)
//
function handleReferTypeVisibility()
{
	if(   document.theForm.fromTypeObj.options[document.theForm.fromTypeObj.selectedIndex].value == 'px'
	   || document.theForm.toTypeObj.options[document.theForm.toTypeObj.selectedIndex].value == 'px')
		document.theForm.referTypeObj.removeAttribute('disabled');
	else
		document.theForm.referTypeObj.setAttribute('disabled', 'disabled');
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


// changes the values of the to- and from-fields and chnages the according effect descriptions
//
function changeFromTo()
{
	var selIdx = document.theForm.effectTypeObj.selectedIndex; // 0: grow, 1: shrink

	document.theForm.fromTxtObj.innerHTML = STATE_LIST[selIdx][0];
	document.theForm.toTxtObj.innerHTML   = STATE_LIST[selIdx][1];

	if(selIdx == 1) // shrink
		document.theForm.directionTypeObj.innerHTML   = STATE_LIST[selIdx][1];
	else // grow
		document.theForm.directionTypeObj.innerHTML = STATE_LIST[selIdx][0];

	var buffer = document.theForm.fromObj.value;

	document.theForm.fromObj.value = document.theForm.toObj.value;
	document.theForm.toObj.value   = buffer;

	selIdx = document.theForm.fromTypeObj.selectedIndex;
	document.theForm.fromTypeObj.selectedIndex = document.theForm.toTypeObj.selectedIndex;
	document.theForm.toTypeObj.selectedIndex   = selIdx;
}
