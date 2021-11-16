
/*
 Copyright 2012 Adobe Systems Incorporated
 All Rights Reserved.
 NOTICE:  All information contained herein is, and remains
 the property of Adobe Systems Incorporated and its suppliers,
 if any.  The intellectual and technical concepts contained
 herein are proprietary to Adobe Systems Incorporated and its
 suppliers and are protected by trade secret or copyright law.
 Dissemination of this information or reproduction of this material
 is strictly forbidden unless prior written permission is obtained
 from Adobe Systems Incorporated.
*/

var returnObject = null;
var gBrowserCtrl;
var gToUText = "";
var gTextShown = false;

// called when the user clicks the 'I agree' checkbox
function agree_check()
{
    var acceptButton = findObject("buttonAccept");
    SetEnabled(acceptButton, document.cbAgree.checked);
}

function isDOMRequired()
{ 
	// Return false, indicating that this object is available in code view.
	return false;
}

function receiveArguments()
{
    gToUText = arguments[0];
    //document.ToUText.value = arguments[0];
	returnObject = arguments[1];
    returnObject.returnValue = null; 
}

function setResult(result)
{
    returnObject.returnValue = result;
    window.close();
}

function initialize()
{
	gTextShown = false;
    gBrowserCtrl = document.getElementById("tou_textArea");	
    //gBrowserCtrl.addEventListener("BrowserControlBeforeRefresh", function(e) { e.preventDefault(); }, false);
    gBrowserCtrl.addEventListener("BrowserControlLoad", showText, true);
	gBrowserCtrl.loadHTML(gToUText);
    gBrowserCtrl.setScrollbarMode("on", "vertical");
    
    var acceptButton = findObject("buttonAccept");
    SetEnabled(acceptButton, false);
}

function showText()
{
	if (!gTextShown)
        gBrowserCtrl.loadHTML(gToUText);
        
    gTextShown = true;
}


