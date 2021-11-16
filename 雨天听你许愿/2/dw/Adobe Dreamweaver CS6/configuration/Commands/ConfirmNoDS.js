// Copyright 2001-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.
var PLATFORM = navigator.platform;
var ICON_URL = (PLATFORM == "Win32") ? "../Shared/MM/Images/alertIconWin.gif" : "../Shared/MM/Images/yield28x28.gif";
var resultHandlers = new Array();

function isDOMRequired() {
	// Return false, indicating that this object is available in code view.
	return false;
}

function render() {
   var btnList="";
   document.msg.innerHTML = arguments[0]; //Insert the question
   if (arguments.length == 3) {
     btnList += "<input type='button' value='"+arguments[1]+"' onClick='setResult(\""+arguments[1]+"\")' name=\"button1\" accessKey=\"y\" class=\"yesNoOkCancel\">";
     btnList += "<input type='button' value='"+arguments[2]+"' onClick='setResult(\""+arguments[2]+"\")' name=\"button2\" accessKey=\"n\" class=\"yesNoOkCancel\">";
     document.btns.innerHTML = btnList;
   }
}

function setResultHandler(result, handler)
{
	resultHandlers[result] = handler;
}

function setResult(result) {	
   if (typeof MMNotes != 'undefined') { // Set values off of MMNotes object if it exists.
     MMNotes.Confirm_RESULT = result;
   }
   window.close();
   
   //if we have a result handler, call it now
   var handler = resultHandlers[result];
   if( handler && handler.call )
   	handler.call();
	
	//clear result handlers for the next caller
	resultHandlers = new Array();
}

function initialize()
{
     // Use the right icon for the platform.
     document.confirmIcon.src = ICON_URL;
}