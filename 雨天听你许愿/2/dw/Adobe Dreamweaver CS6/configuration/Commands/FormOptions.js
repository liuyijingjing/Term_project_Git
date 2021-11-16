//
// Copyright 2001-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.
// ----------------------------------------------------
//
// Accessibility.js
//
// This command adds accessibility attributes/tags to the <input> element
// attributes: tabindex, accessKey, "<lable for>|<lable>|none" and the label.
// 
//
// Version 1.0
// Added functions... TODO: use the dom to add attributes instead of pattern matching.
// ----------------------------------------------------

var helpDoc = MM.HELP_objFormAccessOptions;
var globalFormItem;
var returnTag='';
var FORM;

var RADIO_OPT_ATTACH = 0;
var RADIO_OPT_WRAP = 1;
var RADIO_OPT_NONE = 2;

function commandButtons() {
   return new Array(MM.BTN_OK,         "setAccessibilityStr();window.close()",
                    MM.BTN_Cancel,     "setReturnStr();window.close()",
                    MM.BTN_Help,       "displayHelp()"    );


}


function isDOMRequired() { 
	// Return false, indicating that this object is available in code view.
	return false;
}

function setFormItem(formItem) {
	globalFormItem = formItem;

}

function setReturnStr(){

    returnTag=globalFormItem;
}

function setAccessibilityStr()
{

	initStr= globalFormItem;
	rtnStr= initStr;


////////////////////////////////////////////////////////////////
// Attributes: Compose initStr with the attributes that have a value
// Possible attributes are: accesskey, tabindex and id (when <label for=""> is used.)


// if 'accesskey attribute' has a value, apply it to the initStr

	acsKeyValue=FORM.accesskey.value;
	if( (acsKeyValue == null) || (acsKeyValue == "") ){} 
	else {
		initStr= addAttribute("accesskey", acsKeyValue, initStr);
	}

// if 'tabindex attribute' has a value, apply it to the initStr

	tabIndexValue=FORM.tabindex.value;

	if( (tabIndexValue == null) || (tabIndexValue == "") ){} 
	else {
		initStr= addAttribute("tabindex", tabIndexValue, initStr);
	}


  // if user supplied an ID, use it to replace the default
  // ID, or add an id attribute if none exists.
  var newID = FORM.ID.value;
  var elementId = getID(initStr);
  var elementName = getName(initStr);
    
  if (newID != ""){
    if (elementId != ""){
      var idStr = 'id="' + newID + '"';
      initStr = initStr.replace(/id=\"\w+\"/i,idStr);
      if (isRadioButton())
      {
        var valueStr = 'value="' + newID + '"';
        initStr = initStr.replace(/value=\"\w+\"/i,valueStr);
      }
    }
    // if no existing ID, add one.
    else
    {
      initStr = addAttribute("id", newID, initStr);
    }    
    elementId = newID;

    if (elementName != "" && !isRadioButton()){
      // change name to match ID -- unless this is a radio button.
      var nameStr = 'name="' + newID + '"';
      initStr = initStr.replace(/name=\"\w+\"/i,nameStr);
    }
  }
  	

////////////////////////////////////////////////////////////////
// Dialog Options: Label Style and Position
// resolve 'style option' and position for <LABEL> tag.

	labelStyle='none';

	// style CASE: 'wrap with label and use 'for' attribute'  
	if (FORM.labeloption[RADIO_OPT_ATTACH].checked) {
		labelStyle=String(RADIO_OPT_ATTACH);

		// position CASE: 'before/after' 
		if (FORM.position[1].checked) {
			rtnStr= initStr + "<LABEL for=" + "\"" + elementId + "\">"+ FORM.label.value + "</LABEL>";
		} 
		else {
			if (FORM.position[0].checked) {
				rtnStr= "<LABEL for=" + "\"" + elementId + "\">"+ FORM.label.value + "</LABEL>" + initStr;
			}
		}
	}

	// style CASE: 'wrap with label'  
	if (FORM.labeloption[RADIO_OPT_WRAP].checked) {
		labelStyle=String(RADIO_OPT_WRAP);
		
		// position 'before/after' CASE
		if (FORM.position[1].checked) {
			rtnStr= "<LABEL>" + initStr + FORM.label.value + "</LABEL>";
		} 
		else {
			if (FORM.position[0].checked) {
				rtnStr= "<LABEL>" + FORM.label.value + initStr + "</LABEL>";
			}
		}
	}
	if(	labelStyle == 'none'){
		labelStyle= String(RADIO_OPT_NONE);

		// position CASE: 'before/after' 
		if (FORM.position[1].checked) {
			rtnStr= initStr + FORM.label.value;
		} 
		else {
			if (FORM.position[0].checked) {
				rtnStr= FORM.label.value + initStr;
			}
		}	
	}
	setLabelPref(labelStyle);
	returnTag= rtnStr;
}

function returnAccessibilityStr(){

return returnTag;
}

///////////////////////////////////////////////////////////////
// functions
//////////////////////////////////////////////////////////////

function isRadioButton(){
	var pattern= /type="radio"/;
	isradio= pattern.test(globalFormItem);
	return isradio;
}

function isCheckbox(){
	var pattern= /type="checkbox"/;
	ischeckbox= pattern.test(globalFormItem);
	return ischeckbox;
}

function addAttribute(tagName, tagVal, initStr){
	arrayElem= initStr.split(">");
  if (arrayElem.length == 1 || arrayElem[1] == ""){
  	rtnStr= arrayElem[0] + " " + tagName + "=" + '\"' + tagVal + '\"' + ">";
  }else{
  	rtnStr= arrayElem[0] + " " + tagName + "=" + '\"' + tagVal + '\"' + ">" + arrayElem[1] + ">";
  }
	return rtnStr;
}

function initialize(){

	FORM = document.forms[0];

	labelStyle= getLabelStyle();
	if (labelStyle != 'none')
	{FORM.labeloption[labelStyle].checked=true;}

	if (isCheckbox() || isRadioButton()) {	
		FORM.position[1].checked=true;
	} 
	else {
		FORM.position[0].checked=true;
	}

}

function recommendNoLabel()
{
  //Some form elements should not have a label associated with them, check for them here
  if( globalFormItem.indexOf('type="submit"') != -1)
    return true;
  if( globalFormItem.indexOf('type="reset"') != -1)
    return true;
  if( globalFormItem.indexOf('type="button"') != -1)
    return true;
  if( globalFormItem.indexOf('type="hidden"') != -1)
    return true;
  if( globalFormItem.indexOf('type="image"') != -1)
    return true;

  return false;
}

function getLabelStyle() {
  var autoAdd, rtnValue = 'none';
  if( recommendNoLabel() )
    return RADIO_OPT_NONE;
  var path = dreamweaver.getConfigurationPath() + '/Objects/Forms/AccessibilityOptions.js';
  var metaFile;
  metaFile = MMNotes.open(path, false);
  if (metaFile) {

    autoAdd = MMNotes.get(metaFile, 'LABEL_style');
    if (autoAdd) rtnValue = autoAdd;
    MMNotes.close(metaFile);
  }
  return rtnValue;
}


function setLabelPref(setValue) {
  if( recommendNoLabel() && setValue == RADIO_OPT_NONE)
    return;
  var path = dreamweaver.getConfigurationPath() + '/Objects/Forms/AccessibilityOptions.js';
  var metaFile;

  metaFile = MMNotes.open(path, true); // Force create the note file.
  if (metaFile) {
	if (setValue){

		autoAdd = MMNotes.set(metaFile, 'LABEL_style', setValue);
	}
    MMNotes.close(metaFile);
  }
}

function getName(initStr)
{
	var arrayElements = initStr.split("name=\"");
	var name = "";
	
	if (arrayElements && arrayElements.length > 1)
	{
	    var arrayStrings =  arrayElements[1].split("\"");
	    name = arrayStrings[0];
	}
	
	return name;
}

function getID(initStr)
{
	var arrayElements = initStr.split("id=\"");
	var id = "";
	
	if (arrayElements && arrayElements.length > 1)
	{
    	var arrayStrings =  arrayElements[1].split("\"");
	    id = arrayStrings[0];
	}
	
	return id;
}