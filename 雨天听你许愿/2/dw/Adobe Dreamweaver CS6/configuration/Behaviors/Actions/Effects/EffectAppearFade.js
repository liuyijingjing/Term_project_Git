// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//*************** GLOBALS VARS *****************

var helpDoc = MM.HELP_behEffectAppearFade;

var ELEMENTNAMES_NOT_ALLOWED; // list of elements to which the Appear/Fade Effect can't be asigned (initialized in "initGlobals()")
var ID_LIST;                  // list of available IDs in the current document
var STATE_LIST;               // holds the string/value-pairs for the two effects
var OLD_VALUE_POOL;           // saves the old values and the sync state of the text fields


//******************* BEHAVIOR FUNCTION **********************

// Adds an Appear/Fade-Effect to the element.
// Accepts the following arguments:
//  targetElement - ID or JavaScript DOM object of target element
//  duration      - duration time of applying the effect (in milliseconds)
//  from          - percentage of opacity to start (0 - 100)
//  to            - percentage of opacity to end (0 - 100)
//  toggle        - trigger effect again toggles to reverse behavior
//
function MM_effectAppearFade(targetElement, duration, from, to, toggle)
{
	Spry.Effect.DoFade(targetElement, {duration: duration, from: from, to: to, toggle: toggle});
}


//******************* API **********************


//Can be used with any tag and any event

function canAcceptBehavior(){
	var retVal = "onClick,onMouseUp,onMouseDown,(onClick)";  // default is onClick
	return retVal;
}



//Returns a Javascript function to be inserted in HTML head with script tags.

function behaviorFunction(){
  return "MM_effectAppearFade";
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
	var retVal;

	if(selValue=="default") // no target element selected
	{
		includeLibrary = false;
		retVal = MSG_SelectTargetOrCancel;
	}
	else if(selValue=="this") // effect is assigned to the behavior element
	{
		retVal = "MM_effectAppearFade(this, "+parseInt(document.theForm.durationObj.value)+", "+parseInt(document.theForm.fromObj.value)+", "+parseInt(document.theForm.toObj.value)+", "+document.theForm.toggleObj.checked+")";
	}
	else // behavior element triggers effect which is assigned to a target element
	{
		var refIdx = parseInt(selValue);
		retVal = "MM_effectAppearFade('"+ID_LIST[refIdx]+"', "+parseInt(document.theForm.durationObj.value)+", "+parseInt(document.theForm.fromObj.value)+", "+parseInt(document.theForm.toObj.value)+", "+document.theForm.toggleObj.checked+")";
	}

	if(includeLibrary)
		effectsUtils.addLibraryInclude(); // make sure SpryEffects.js-lib is available

	return retVal;
}


//Passed the function call above, takes prior arguments and reloads the UI.
//Removes any escape characters "\"

function inspectBehavior(fnStr)
{
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
	document.theForm.durationObj.value = effectsUtils.stripWhitespaces(unescExprStr(argArray[1],false)); //duration time of applying the effect (in milliseconds)

	var fromValue = effectsUtils.stripWhitespaces(unescExprStr(argArray[2],false));
	var toValue   = effectsUtils.stripWhitespaces(unescExprStr(argArray[3],false));
	var stateIdx  = (parseInt(fromValue) < parseInt(toValue)) ? 0 : 1;

	document.theForm.effectTypeObj.selectedIndex = stateIdx;
	document.theForm.fromTxtObj.innerHTML = STATE_LIST[stateIdx][0];
	document.theForm.toTxtObj.innerHTML   = STATE_LIST[stateIdx][1];

	document.theForm.fromObj.value = fromValue; //percentage of opacity to start (0 - 100)
	document.theForm.toObj.value   = toValue; //percentage of opacity to end (0 - 100)
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


// initializes the User Interface with default values

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

	if(effectsUtils.elementNameIsAllowed(tagname, ELEMENTNAMES_NOT_ALLOWED, false))
	{
		option_entries.push("<option value=\"this\">&lt;"+MSG_ThisElement+"&gt;</option>");
		skipDefaultEntry = true;
	}
	else
	{
		option_entries.push("<option value=\"default\">*** " + MSG_SelectIDOfTarget + " ***</option>"); // add a default entry
	}

	effectsUtils.fetchSuitableElements(theDOM.body, ELEMENTNAMES_NOT_ALLOWED, false, targetElts);

	for(var i=0; i<targetElts.length; i++)
	{
		ID_LIST.push(targetElts[i][1]);
		option_entries.push("<option value=\"" + i + "\">" + targetElts[i][0].toLowerCase() + " \"" + targetElts[i][1] + "\"</option>");
	}


	if(skipDefaultEntry || option_entries.length > 1) // there are potential elements to which the AppearFade Effect can be applied to
		document.theForm.pageEltObj.innerHTML = option_entries.join("");
	else
		document.theForm.pageEltObj.innerHTML = "<option value=\"default\">*** " + MSG_NoValidTargetsAvailable + " ***</option>"
	
	document.theForm.pageEltObj.selectedIndex = 0;

	//
	// set default values to the rest of the input fields
	//
	document.theForm.durationObj.value = "1000"; //duration time of applying the effect (in milliseconds)

	var selIdx = 1; // fade
	document.theForm.effectTypeObj.selectedIndex = selIdx;
	document.theForm.fromTxtObj.innerHTML = STATE_LIST[selIdx][0];
	document.theForm.toTxtObj.innerHTML   = STATE_LIST[selIdx][1];
	document.theForm.fromObj.value        = STATE_LIST[selIdx][2]; //percentage of opacity to start (0 - 100)
	document.theForm.toObj.value          = STATE_LIST[selIdx][3]; //percentage of opacity to end (0 - 100)

	document.theForm.toggleObj.checked = false;

	document.theForm.pageEltObj.focus();  // set focus on popup
}


// initializes the global vars
//
function initGlobals()
{
	ELEMENTNAMES_NOT_ALLOWED = new Array("applet", "body", "iframe", "object", "tr", "tbody", "th"); // elements to which the AppearFade Effect can't be assigned to (should be typed in lowercase letters)
	ID_LIST                  = new Array();
	STATE_LIST               = new Array([MSG_AppearFrom, MSG_AppearTo,   0, 100],   // holds the string/value-pairs for the two effects
										 [MSG_FadeFrom  , MSG_FadeTo  , 100,   0]);
	OLD_VALUE_POOL           = new Array(["",true],["",true],["",true]); // saves the old values and the sync state of the text fields
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

// Checks if the percentage value is valid (0 - 100).
// If the value exceeds that range a info message appears.
function checkPercentageValue(idx, objectNode)
{
	OLD_VALUE_POOL[idx][1] = false;

	if(objectNode && idx >= 0 && idx < OLD_VALUE_POOL.length)
	{
		var value   = objectNode.value;
		var valueOK = true;

		if(effectsUtils.onlyDigits(value))
		{
			if(parseInt(value) > 100)
				valueOK = false;
		}
		else
		{
			valueOK = false;
		}

		if(!valueOK)
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
}
