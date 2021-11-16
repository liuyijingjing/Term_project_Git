/*!
**********************************************************************
@file wizardCore.js

Copyright 2003-2006 Adobe Systems Incorporated.                     
All Rights Reserved.                                                
                                                                    
NOTICE: All information contained herein is the property of Adobe   
Systems Incorporated.                                                                                                                    

***********************************************************************
*/

// Depends on domUtils.js
var failCount = 0;
var firstRun = true;
var recentName = null;

// *******************************************************************
function cancelButton() {
	window.external.AMT_OnCancelButton();
}

// *******************************************************************
function onWizardFinish() {
	window.external.AMT_OnWizardFinish();
}

// *******************************************************************
function getElementString (itemID) {
	return document.getElementByID(itemID).value;
}

// *******************************************************************
function markName(nameRecentItem) {
	recentName = nameRecentItem;
}

// *******************************************************************
var gVisitedNodeProperty = 'amtVisitedNode';
var gAMTPropertyTokenClass = 'AMTPropertyValue';
var gAMTLocalizedTokenClass = 'AMTLocalizedValue';
var gAMTKeyKey = 'amtKey';

function replaceAMTPropertySpanValue(inNode) {
	var replaced = false;
	var className = inNode.className;
	
	if (null != className && className==gAMTPropertyTokenClass) {

		var theKey = null;
		if (null == inNode.amtKey){
			theKey = inNode.firstChild.nodeValue;
		} else {
			theKey = inNode.amtKey;
		}
		
		// Get the value
		var theValue = window.external.AMT_GetProperty(theKey);
		
		// Replace the span with one containing the new value
		replaceAMTSpanValue(inNode, theKey, theValue);
		replaced = true;
	}
	return replaced;
}

// *******************************************************************
function replaceAMTSpanTags() {
	var allElements = getAllChildrenForNode(document.documentElement);
	for (var i = 0; i < allElements.length; ++i) {
		replaceAMTPropertySpanValue(allElements[i]);	
	}
}

// *******************************************************************
function replaceAMTSpanValue(inSpanNode, inKey, inNewValue) 
{     
	var newSpan = document.createElement("span");
	var newText = document.createTextNode(inNewValue);
	
	newSpan.appendChild(newText);
	newSpan.className = inSpanNode.className;
	newSpan.amtKey = inKey;
	
	var spanParent = inSpanNode.parentNode;
	spanParent.replaceChild(newSpan, inSpanNode);
}

// *******************************************************************
function onWizardLoad() {	

	fnOnEULAChange('eula_language_selection', 'eulaIFRAMEId');
	replaceAMTSpanTags();
	
	var isIE = (navigator.appName == "Microsoft Internet Explorer");
	
	if (!isIE) {
		document.all('personalize_inline_error_name').style.display='none';
		document.all('personalize_inline_error_serial').style.display='none';
	}
}

// *******************************************************************
// EULA
// *******************************************************************

 function onEulaLoad() {

	// Recurse the entire DOM and replace the 
	replaceAMTSpanTags();
	
	removeUnwantedLanguages(document.getElementById('eula_language_selection'));
	setDefaultEulaItem(document.getElementById('eula_language_selection'));
	
	fnOnEULAChange('eula_language_selection', 'eulaIFRAMEId'); 

	document.all('eula_language_selection').focus();
	
	if (window.external.AMT_ShouldHideButton('eula_print')) {
		var printCon = document.getElementById('eula_print');
		printCon.style.display='none';
	} 
	
	if (window.external.AMT_ShouldHideButton('eula_save')) {
		var saveCon = document.getElementById('eula_save');
		saveCon.style.display='none';
	} 
	
    if (window.external.AMT_GetCancelNavigate()) {
        doDeclineConfirmation();   
        return;
    }	
} 

// *******************************************************************
function setDefaultEulaItem(listField) {

	if (window.external.AMT_ShouldHideButton('eula_print')) {
		var printCon = document.getElementById('eula_print');
		printCon.style.display='none';
	} 
	
	if (window.external.AMT_ShouldHideButton('eula_save')) {
		var saveCon = document.getElementById('eula_save');
		saveCon.style.display='none';
	} 	
	
    var selectedLang = window.external.AMT_GetEulaLanguage();
	
    if (selectedLang) {
	    // Empty list
	    if ( listField.length == -1) { 

	    } else {
		    for (var i = 0; i < listField.length; i++) {
			    if (listField.options[i].value == selectedLang) {
				    listField.options.selectedIndex = i;
				    break;
			    } 
		    }				
	    } 
	} 
}

// *******************************************************************
function doEulaAccept() {

	if (recentName == 'eula_accept') {
		doAccept();
	} else if (recentName == 'eula_decline') {
		doDeclineButton();
	} else if (recentName == 'eula_decline_quit') {
		doDecline();
	} else if (recentName == 'eula_decline_back') {
		history.back();
	}

	return false;
}

// *******************************************************************
function onInnerEulaLoad() {

	var agt = navigator.userAgent.toLowerCase();
	var is_win  = ( (agt.indexOf("win")!=-1) || (agt.indexOf("16bit")!=-1) );

	if (is_win) {
		
	} else {
		fnOnEULAChange('eula_language_selection', 'eulaIFRAMEId');
		replaceAMTSpanTags();					

		removeUnwantedLanguages(document.getElementById('eula_language_selection'));
		
		if (firstRun) {
			setDefaultEulaItem(document.getElementById('eula_language_selection'));
			firstRun = false;
		}
	
		fnOnEULAChange('eula_language_selection', 'eulaIFRAMEId');			
	}
} 

// *******************************************************************
function foundThisEula (languageValue) {

	var eulaPath = window.external.AMT_GetInfoDirectory() + "/" + languageValue + "/license.html";
	var resultText = false;
	
	resultText = window.external.AMT_FindThisFile(eulaPath); 

	if (resultText == true) {
		return 1;
	} else {
		return 0;
	} 
}

// *******************************************************************
function removeUnwantedLanguages(listField) {

	// Empty list 
	if ( listField.length == -1) { 
			
	} else {
		var replaceTextArray = new Array(listField.length-1);
		var replaceValueArray = new Array(listField.length-1);
		var foundEula = 0;
		var countEula = 0;
      
		for (var i = 0; i < listField.length; i++) {
			foundEula = foundThisEula(listField.options[i].value);
			
			if (foundEula == 1) {
				replaceTextArray[countEula] = listField.options[i].text;
				replaceValueArray[countEula] = listField.options[i].value;
				countEula = countEula + 1;
			} 
		}
			
		listField.length = countEula; 
		for (var j = 0; j < countEula; j++) { 
			listField.options[j].value = replaceValueArray[j];
			listField.options[j].text = replaceTextArray[j];
		}			
	} 
	if (listField.length <= 0) {
	    window.external.AMT_OnEulaDecline();
	} 
}

// *******************************************************************
function doEulaPrint() {
	var isIE = (navigator.appName == "Microsoft Internet Explorer");
	
	if (isIE) {
		window.external.AMT_OnEulaPrint();

		eulaIFRAMEId.focus();
		eulaIFRAMEId.print();

		window.external.AMT_OnEulaPrint();
	} else {
		window.external.AMT_OnEulaPrint();
	} 
}

// *******************************************************************
function doEulaSave() {
    window.external.AMT_OnEulaSave();
}

// *******************************************************************
function doDeclineButton() {	
	    window.external.AMT_SetCancelNavigate();
		window.location="install2.html";
}

// *******************************************************************
function doDecline() {
	window.external.AMT_OnEulaDecline();
}

// *******************************************************************
function doAccept() {
	window.external.AMT_OnEulaAccept();
}

// *******************************************************************
function fnOnEULAChange(eulaComboBoxId, eulaIFRAMEId) {

	try {
		var eulaComboBox = getObjectById(eulaComboBoxId);
		var eulaIFRAME = getObjectById(eulaIFRAMEId);
		var isIE = (navigator.appName == "Microsoft Internet Explorer");
	
	
		
		if (foundThisEula(eulaComboBox.value)) {
			if (eulaIFRAME) {
				var eulaSRC = window.external.AMT_GetInfoDirectory() + "/" + eulaComboBox.value + "/license.html";
				

				if (!isIE) {
					eulaSRC = eulaSRC.replace('localhost', '')
				}

				if (eulaIFRAME.src.toString() != eulaSRC.toString()) {
					eulaIFRAME.src = eulaSRC;
					window.external.AMT_OnEulaChange(eulaComboBox.value);
				}
				
			}
			
			var replaceTextArray = new Array(eulaComboBox.length-1);
			var replaceValueArray = new Array(eulaComboBox.length-1);
			var foundEula = 0;
			var countEula = 0;
		  
			for (var i = 0; i < eulaComboBox.length; i++) {
				foundEula = foundThisEula(eulaComboBox.options[i].value);
				
				if (foundEula == 1) {
					replaceTextArray[countEula] = eulaComboBox.options[i].text;
					replaceValueArray[countEula] = eulaComboBox.options[i].value;
					countEula = countEula + 1;
				} 
			}	
				
			eulaComboBox.length = countEula; 
			for (i = 0; i < countEula; i++) { 
				eulaComboBox.options[i].value = replaceValueArray[i];
				eulaComboBox.options[i].text = replaceTextArray[i];
			}					
			
		} else {
			
			var replaceTextArray = new Array(eulaComboBox.length-1);
			var replaceValueArray = new Array(eulaComboBox.length-1);
			var foundEula = 0;
			var countEula = 0;
		  
			for (var i = 0; i < eulaComboBox.length; i++) {
				foundEula = foundThisEula(eulaComboBox.options[i].value);
				
				if (foundEula == 1) {
					replaceTextArray[countEula] = eulaComboBox.options[i].text;
					replaceValueArray[countEula] = eulaComboBox.options[i].value;
					countEula = countEula + 1;
				} 
			}	
				
			eulaComboBox.length = countEula; 
			for (i = 0; i < countEula; i++) { 
				eulaComboBox.options[i].value = replaceValueArray[i];
				eulaComboBox.options[i].text = replaceTextArray[i];
			}					
			
			eulaComboBox.selectedIndex = 0;
			
			if (countEula > 0) {
				if (eulaIFRAME) {
					var eulaSRC = window.external.AMT_GetInfoDirectory() + "/" + eulaComboBox.value + "/license.html";
					if (!isIE) {
						eulaSRC = eulaSRC.replace('localhost', '')
					}

					if (eulaIFRAME.src.toString() != eulaSRC.toString()) {
						eulaIFRAME.src = eulaSRC;
						window.external.AMT_OnEulaChange(eulaComboBox.value);
					}
				}		
			} else {
				window.external.AMT_OnEulaDecline();
			}
			
			
		}

	} catch (error) {

	} 
}

// *******************************************************************
// PERS
// *******************************************************************

// *******************************************************************
function doPersContinue() {

	if (recentName == 'personalize_cancel') {
		doPersCancel();
	} else if (recentName == 'personalize_finish') {
		doPersFinish();
	} else if (recentName == 'personalize_next') {
		doSubmitButtonPers();
	} else if (recentName == 'personalize_back') {
		history.back();
	}

	return false;
}

// *******************************************************************
function isPersDone() {

	event.returnValue =  false; 
}
		
// *******************************************************************
function doPersCancel() {
	window.external.AMT_OnPersCancel();
}

// *******************************************************************
function doPersFinish() {
	window.external.AMT_OnPersFinish();
}

// *******************************************************************
function getPasteboardValue() {
	return window.external.AMT_GetPasteboardValue();
}

// *******************************************************************
function serialBeforePaste() {
	return true;
}

// *******************************************************************
function serialPaste(input, len) {
    distributePaste(input, len);
	return false;
}

// *******************************************************************
function doSubmitButtonPers () {
 
    var userNameValid = false;
	var serialNumberValid = false;
	
	var selectInput;
	
	if (document.getElementById('personalize_serialnumber_radio1')) {
	    if (document.getElementById('personalize_serialnumber_radio1').checked == true) {
		    selectInput = 'retail';
	    } else {
		    selectInput = 'trial';
	    }
	}
	
	var companyNameField = document.getElementById('personalize_organization');
	
	var userNameField = document.getElementById('personalize_name');
	if (userNameField.value.length <= 0) {
		userNameField.className = 'invalid_user_data';
		document.getElementById('personalize_inline_error_name').style.display='inline';
	} else {
		userNameField.className = null;
		userNameValid = true;
		document.getElementById('personalize_inline_error_name').style.display='none';
	} 
	
    var arrSNElements = new Array("personalize_1_serialnumber", "personalize_2_serialnumber", "personalize_3_serialnumber", "personalize_4_serialnumber", "personalize_5_serialnumber", "personalize_6_serialnumber");
	var serialNumber = "";
	for (var i=0; i < arrSNElements.length; i++)
	{
		serialNumber += document.getElementById(arrSNElements[i]).value;
	}	

	var snClassName = "invalid_user_data";

	if ((serialNumber.length == 24) && (selectInput != 'trial'))
	{
	
		 serialNumberValid = window.external.AMT_ValidateSerialNumber(serialNumber, userNameField.value, companyNameField.value);

		 if (serialNumberValid)  {
			snClassName = null;
			document.getElementById('personalize_inline_error_serial').style.display='none';
		 }  else if (selectInput != 'trial') {
			snClassName = 'invalid_user_data';
			document.getElementById('personalize_inline_error_serial').style.display='inline';
		 }	
		 
	} else if (selectInput != 'trial') {
		document.getElementById('personalize_inline_error_serial').style.display='inline';
		snClassName = 'invalid_user_data';
	} else if (selectInput == 'trial') {
	    snClassName = null;
		document.getElementById('personalize_inline_error_serial').style.display='none';
	}
	
	for (var i=0; i < arrSNElements.length; i++) {
		document.getElementById(arrSNElements[i]).className = snClassName;
	}	
 
 	    var nameString = userNameField.value;
		var companyString = companyNameField.value;
		var sn1string = document.getElementById(arrSNElements[0]).value;
		var sn2string = document.getElementById(arrSNElements[1]).value;
		var sn3string = document.getElementById(arrSNElements[2]).value;
		var sn4string = document.getElementById(arrSNElements[3]).value;
		var sn5string = document.getElementById(arrSNElements[4]).value;
		var sn6string = document.getElementById(arrSNElements[5]).value;
 
 	if (userNameValid && serialNumberValid && (selectInput != 'trial')) {
		window.location="install2.html";

    } else if (userNameValid && (selectInput == 'trial')) {
        window.external.AMT_TryoutSerialNumber(serialNumber, userNameField.value, companyNameField.value);
        window.location="install_a2.html";
    }
    
    return true;
}

// *******************************************************************
function distributePaste(input, len) {

    var arrSNElements = new Array("personalize_1_serialnumber", "personalize_2_serialnumber", "personalize_3_serialnumber", "personalize_4_serialnumber", "personalize_5_serialnumber", "personalize_6_serialnumber");
	var storeChopped = "";
	
	if (input == document.getElementById("personalize_1_serialnumber")) {

		var storeFull = getPasteboardValue();
		var count = 0;
		var loopCount = 0;
		
		for(var i=0; i<storeFull.length; i++) {
			if (storeFull.charAt(i) != ' ' && storeFull.charAt(i) != '-') {
				storeChopped += storeFull.charAt(i);
				count++;
			}
		}	
		
		if (storeFull.length > 24) {
			storeFull = storeFull.slice(0, 23);
		}
		
		for(var position = 0; position < storeFull.length; position = position + len) {
			if (position > storeFull.length) {
				position = storeFull.length - 1;
			}
			
			document.getElementById(arrSNElements[loopCount]).value = storeChopped.slice(position, position+len);	
			loopCount++;
		}
		
		if (position >= 23) {
			document.getElementById('personalize_next').focus();
		}			
	}
	
	return storeChopped;
}

// *******************************************************************
function doSerialNumberRetail() {
	
    var arrSNElements = new Array("personalize_1_serialnumber", "personalize_2_serialnumber", "personalize_3_serialnumber", "personalize_4_serialnumber", "personalize_5_serialnumber", "personalize_6_serialnumber");  
    
	for (var i=0; i < arrSNElements.length; i++) {
		document.getElementById(arrSNElements[i]).disabled = false;
	}
}

// *******************************************************************
function doSerialNumberTrial() {

    var arrSNElements = new Array("personalize_1_serialnumber", "personalize_2_serialnumber", "personalize_3_serialnumber", "personalize_4_serialnumber", "personalize_5_serialnumber", "personalize_6_serialnumber");
	//var serialNumber = "";    
    
	for (var i=0; i < arrSNElements.length; i++) {
		document.getElementById(arrSNElements[i]).disabled = true;
		document.getElementById(arrSNElements[i]).className = null;
	}
	
	document.getElementById('personalize_inline_error_serial').style.display='none';	
}

// *******************************************************************
function doSNField(snID) {

	var myString = document.getElementById(snID).value;

	if (myString.length >= 4) {
		return false;
	}
}

// *******************************************************************
function onPersLoad() {

	var isIE = (navigator.appName == "Microsoft Internet Explorer");
		var arrSNElements = new Array("personalize_1_serialnumber", "personalize_2_serialnumber", "personalize_3_serialnumber", "personalize_4_serialnumber", "personalize_5_serialnumber", "personalize_6_serialnumber"); 
	
	if (isIE) {
		replaceAMTSpanTags();
    
		for (var i=0; i < arrSNElements.length; i++) {
			document.getElementById(arrSNElements[i]).size = 1;
		}
	}
	
	if (document.getElementById('personalize_serialnumber_radio1')) {
	    if (document.getElementById('personalize_serialnumber_radio1').checked == true) {
		    
	    } else {
		for (var i=0; i < arrSNElements.length; i++) {
			document.getElementById(arrSNElements[i]).disabled = true;
			document.getElementById(arrSNElements[i]).className = null;
		}
	    }
	}
	
    	document.getElementById('personalize_name').focus();
	document.getElementById('personalize_inline_error_name').style.display='none';
	document.getElementById('personalize_inline_error_serial').style.display='none';
}

// *******************************************************************
var isNN = (navigator.appName.indexOf("Netscape")!=-1);

function autoTab(input,len, e) {
	var keyCode = (isNN) ? e.which : e.keyCode; 
	var strKey;

	strKey = String.fromCharCode(e.keyCode);
	var reKeyboardChars = /[\x00\x03\x08\x09\x10\x0D\x16\x18\x1A\x2E\x25\x26\x27\x28]/;

	if(input.value.length >= len && !reKeyboardChars.test(strKey)) {
		input.value = input.value.slice(0, len);

		if((getIndex(input) != getIndex(document.getElementById('personalize_6_serialnumber')))) {
			input.form[(getIndex(input)+1) % input.form.length].focus();
			input.form[(getIndex(input)+1) % input.form.length].select();
		} else {
			document.getElementById('personalize_next').focus();
		} 
	} 

	function getIndex(input) {
		var index = -1, i = 0, found = false;
		while (i < input.form.length && index == -1)
		if (input.form[i] == input)index = i;
		else i++;
		return index;
	}
			
	return true;
}

// *******************************************************************
function nameWatch (input, len, e) {
	var blnValidChar = true;
 
	var iKeyCode = e.keyCode;
	var strKey = String.fromCharCode(e.keyCode);
	
	if (e.metaKey && (e.keyCode == 86)) {
			
		var storeChopped = "";
		var storeFull = getPasteboardValue();
				
		if (storeFull.length > len) {
			storeFull = storeFull.slice(0, len);
		}
		
		input.value = storeFull;
		input.select();
		input.focus();
	}
	
	return true;
}

// *******************************************************************
function numericWatch (input, len, e) {

	var blnValidChar = true;
	var strWork = '0123456789';

	var reValidChars = /\d/;
	var reKeyboardChars = /[\x00\x03\x08\x09\x0D\x16\x18\x1A\x2E]/;
	var reClipBoardChars = /[\x56\x58\x43\x41]/;
	var reControlChars = /[\x63\x78\x76\x7A]/;
	var reArrowKeys = /[\x25\x26\x27\x28]/;
	var reNumericKeypad = /[\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69]/;
	var strKey, iKeyCode;
 
	iKeyCode = e.keyCode;
	strKey = String.fromCharCode(e.keyCode);
	
	if (!reValidChars.test(strKey) && !reKeyboardChars.test(strKey) 
		&& !(e.ctrlKey && reClipBoardChars.test(strKey)) && !reControlChars.test(strKey) && !(e.metaKey && reClipBoardChars.test(strKey))
		&& !reArrowKeys.test(strKey) && !reNumericKeypad.test(strKey))
	{
		blnValidChar = false;
	}

	if(!blnValidChar) {
		e.returnValue = false;	
		input.form.focus();		
		return false;
	} else {
		if (e.metaKey && (e.keyCode == 86)) {
			distributePaste(input, len);
		} else if (e.ctrlKey && (e.keyCode == 86)) {
		    distributePaste(input, len);
		}
	
		return true;
	}
}

// *******************************************************************
// REGS
// *******************************************************************

function onRegsLoad() {
	onWizardLoad();
}

// *******************************************************************
function doRegsRegisterLater()
{
	window.external.AMT_doRegsRegisterLater();
}
	
// *******************************************************************	

function doRegsDoNotRegister()
{
	window.external.AMT_doRegsDoNotRegister();
}
	
// *******************************************************************	
function doRegsOK()
{
	window.external.AMT_doRegsOK();
}

// *******************************************************************	
function doRegsTryAgain()
{
	var connectionValid = window.external.AMT_isConnectionValid();
	
	if (connectionValid == '1') {
	    var newProductUX = window.external.AMT_getProductUX();
        location.href = newProductUX;
        
	} else {

	}	
} 

// *******************************************************************	
function doRegsFirstTry()
{
	var connectionValid = window.external.AMT_isConnectionValid();
	
	if (connectionValid == '1') {
	    var newProductUX = window.external.AMT_getProductUX();
        location.href = newProductUX;
        
	} else {
        window.location = "nonet.html";
	}	
}

// *******************************************************************
function doRegisterRetry()
{
	var selectInput;
	
	if (document.getElementById('submit_again').checked == true) {
		selectInput = 'online';
	} else if (document.getElementById('never_register').checked == true) {
		selectInput = 'never';
	} else {
	    selectInput = document.getElementById('register_later').value;
	}
	
	if (selectInput == 'online') {
	    var connectionValid = window.external.AMT_isConnectionValid();

	    if (connectionValid == '1') {
            	history.back();
	    } else {
            	window.location = "nonet.html";
 	    }
	} else if (selectInput == 'never') {
	    doRegsDoNotRegister();
	} else {
	    doRegsRegisterLater();
	}
}
	
// *******************************************************************
// EOF
// *******************************************************************
