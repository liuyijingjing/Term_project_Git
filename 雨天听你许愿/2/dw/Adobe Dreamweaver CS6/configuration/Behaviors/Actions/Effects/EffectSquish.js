// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//*************** GLOBALS VARS *****************

var helpDoc = MM.HELP_behEffectSquish;

var ELEMENTNAMES_ALLOWED; // list of elements to which the Squish Effect can be asigned (initialized in "initGlobals()")
var ID_LIST;              // list of available IDs in the current document


//******************* BEHAVIOR FUNCTION **********************

// Adds an Squish-Effect to the element.
// Accepts the following argument:
//  targetElement - ID or JavaScript DOM object of target element
//
function MM_effectSquish(targetElement)
{
	Spry.Effect.DoSquish(targetElement);
}


//******************* API **********************


//Can be used with any tag and any event

function canAcceptBehavior(){
	var retVal = "onClick,onMouseUp,onMouseDown,(onClick)";  // default is onClick
	return retVal;
}



//Returns a Javascript function to be inserted in HTML head with script tags.

function behaviorFunction(){
  return "MM_effectSquish";
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
		retVal = "MM_effectSquish(this)";
	}
	else // behavior element triggers effect which is assigned to a target element
	{
		var refIdx = parseInt(selValue);
		retVal = "MM_effectSquish('"+ID_LIST[refIdx]+"')";
	}

	if(includeLibrary)
		effectsUtils.addLibraryInclude(); // make sure SpryEffects.js-lib is available

	return retVal;
}


//Passed the function call above, takes prior arguments and reloads the UI.
//Removes any escape characters "\"

function inspectBehavior(fnStr){
  var argArray = extractExprStr(fnStr);
 
  if (argArray.length == 1) { // we expect 1 arg -> targetElement
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


	if(skipDefaultEntry || option_entries.length > 1) // there are potential elements to which the Squish Effect can be applied to
		document.theForm.pageEltObj.innerHTML = option_entries.join("");
	else
		document.theForm.pageEltObj.innerHTML = "<option value=\"default\">*** " + MSG_NoValidTargetsAvailable + " ***</option>"

	document.theForm.pageEltObj.selectedIndex = 0;

	document.theForm.pageEltObj.focus();  // set focus on popup
}


// initializes the global vars
//
function initGlobals()
{
	ELEMENTNAMES_ALLOWED = new Array("address", "dd", "div", "dl", "dt", "form", "img", "p", "ol", "ul", "applet", "center", "dir", "menu", "pre"); // elements to which the Squish Effect can be assigned to (should be typed in lowercase letters)

	ID_LIST = new Array();
}
