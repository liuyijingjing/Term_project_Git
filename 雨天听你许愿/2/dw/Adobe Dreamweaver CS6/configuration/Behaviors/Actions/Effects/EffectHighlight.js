// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//*************** GLOBALS VARS *****************

var helpDoc = MM.HELP_behEffectHighlight;

var ELEMENTNAMES_NOT_ALLOWED; // list of elements to which the Highlight Effect can't be asigned (initialized in "initGlobals()")
var ID_LIST;                  // list of available IDs in the current document
var OLD_VALUE_POOL;           // saves the old values and the sync state of the text fields


//******************* BEHAVIOR FUNCTION **********************

// Adds an Grow-Effect to the element.
// Accepts the following arguments:
//  targetElement - ID or JavaScript DOM object of target element
//  duration      - duration time of applying the effect (in milliseconds)
//  startColor    - color of first frame
//  endColor      - color of last frame
//  restoreColor  - color after highlight has finished
//
function MM_effectHighlight(targetElement, duration, startColor, endColor, restoreColor, toggle)
{
	Spry.Effect.DoHighlight(targetElement, {duration: duration, from: startColor, to: endColor, restoreColor: restoreColor, toggle: toggle});
}

//******************* API **********************


//Can be used with any tag and any event

function canAcceptBehavior(){
	var retVal = "onClick,onMouseUp,onMouseDown,(onClick)";  // default is onClick
	return retVal;
}



//Returns a Javascript function to be inserted in HTML head with script tags.

function behaviorFunction(){
  return "MM_effectHighlight";
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
	var escapeHash     = (dw.getBehaviorElement() && dwscripts.isInsideTag(dw.getBehaviorElement(),"CFOUTPUT")) ? "#" : "";
	var retVal;

	if(selValue=="default") // no target element selected
	{
		includeLibrary = false;
		retVal = MSG_SelectTargetOrCancel;
	}
	else if(selValue=="this") // effect is assigned to the behavior element
	{
		retVal = "MM_effectHighlight(this, "+parseInt(document.theForm.durationObj.value)+", '"+ escapeHash + document.theForm.startColorObj.value+"', '"+ escapeHash + document.theForm.endColorObj.value+"', '"+ escapeHash + document.theForm.restoreColorObj.value+"', "+document.theForm.toggleObj.checked+")";
	}
	else // behavior element triggers effect which is assigned to a target element
	{
		var refIdx = parseInt(selValue);
		retVal = "MM_effectHighlight('"+ID_LIST[refIdx]+"', "+parseInt(document.theForm.durationObj.value)+", '"+ escapeHash + document.theForm.startColorObj.value+"', '"+ escapeHash + document.theForm.endColorObj.value+"', '"+ escapeHash + document.theForm.restoreColorObj.value+"', "+document.theForm.toggleObj.checked+")";
	}

	if(includeLibrary)
		effectsUtils.addLibraryInclude(); // make sure SpryEffects.js-lib is available

	return retVal;
}


//Passed the function call above, takes prior arguments and reloads the UI.
//Removes any escape characters "\"

function inspectBehavior(fnStr){
  var argArray = extractExprStr(fnStr);
 
  if (argArray.length == 6) { // we expect 6 args -> targetElement, duration, startColor, endColor, restoreColor, toggle
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
	
	var startcolor   = effectsUtils.stripWhitespaces(unescExprStr(argArray[2],false)); // color of first frame
	var endcolor     = effectsUtils.stripWhitespaces(unescExprStr(argArray[3],false)); // color of last frame
	var restorecolor = effectsUtils.stripWhitespaces(unescExprStr(argArray[4],false)); //color after highlight has finished

	document.theForm.startColorObj.value = startcolor;
	document.theForm.startColorPicker.value = startcolor;
	document.theForm.endColorObj.value = endcolor;
	document.theForm.endColorPicker.value = endcolor;
	document.theForm.restoreColorObj.value = restorecolor;
	document.theForm.restoreColorPicker.value = restorecolor;

	document.theForm.toggleObj.checked = (effectsUtils.stripWhitespaces(unescExprStr(argArray[5],false)) == "true");

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
	var tagname = selObj ? selObj.tagName.toLowerCase() : "";
	var skipDefaultEntry = false;

	if(tagname != 'body' && effectsUtils.elementNameIsAllowed(tagname, ELEMENTNAMES_NOT_ALLOWED, false))
	{
		option_entries.push("<option value=\"this\">&lt;"+MSG_ThisElement+"&gt;</option>");
		skipDefaultEntry = true;
	}
	else
	{
		option_entries.push("<option value=\"default\">*** " + MSG_SelectIDOfTarget + " ***</option>"); // we add a default entry
	}

	effectsUtils.fetchSuitableElements(theDOM.body, ELEMENTNAMES_NOT_ALLOWED, false, targetElts);

	for(var i=0; i<targetElts.length; i++)
	{
		ID_LIST.push(targetElts[i][1]);
		option_entries.push("<option value=\"" + i + "\">" + targetElts[i][0].toLowerCase() + " \"" + targetElts[i][1] + "\"</option>");
	}


	if(skipDefaultEntry || option_entries.length > 1) // there are potential elements to which the Highlight Effect can be applied to
		document.theForm.pageEltObj.innerHTML = option_entries.join("");
	else
		document.theForm.pageEltObj.innerHTML = "<option value=\"default\">*** " + MSG_NoValidTargetsAvailable + " ***</option>"

	document.theForm.pageEltObj.selectedIndex = 0;

	//
	// set default values to the rest of the input fields
	//
	document.theForm.durationObj.value = "1000"; //duration time of applying the effect (in milliseconds)

	document.theForm.startColorObj.value      = "#ffffff";
	document.theForm.startColorPicker.value   = "#ffffff";
	document.theForm.endColorObj.value        = "#ff0000";
	document.theForm.endColorPicker.value     = "#ff0000";
	document.theForm.restoreColorObj.value    = "#ffffff";
	document.theForm.restoreColorPicker.value = "#ffffff";

	document.theForm.pageEltObj.focus();  // set focus on popup
}


// initializes the global vars
//
function initGlobals()
{
	ELEMENTNAMES_NOT_ALLOWED = new Array("frame", "frameset", "noframes", "applet"); // elements to which the Highlight Effect can't be assigned to (should be typed in lowercase letters)
	ID_LIST                  = new Array();
	MMEffectIncludeReference = "Used by MM_Effect";
	OLD_VALUE_POOL           = new Array(["",true],["",true],["",true],["",true]); // saves the old values and the sync state of the text fields
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


// Checks if the new color value is valid '#xxxxxx' or '#xxx', x: hex digit
// If the value does not match a info message appears.
function HandleNewColorValue(idx, objectNode, colorPickerObject)
{
	OLD_VALUE_POOL[idx][1] = false;

	if(objectNode && idx >= 0 && idx < OLD_VALUE_POOL.length && colorPickerObject)
	{
		var value   = objectNode.value;
		var pattern = /^\s*\#(?:[0-9a-fA-F]{3}){1,2}\s*$/;

		if(pattern.test(value))
		{
			colorPickerObject.value = value;
			OLD_VALUE_POOL[idx][1] = true;
		}
		else
		{
			var message = MSG_NotAValidValue;
			message = message.replace('%1',value);
			alert(message);

			objectNode.value = OLD_VALUE_POOL[idx][0];
		}
	}
}
