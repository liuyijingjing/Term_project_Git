/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2009 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
*
**************************************************************************/

//---------------   GLOBAL VARIABLES   ---------------
var helpDoc = MM.HELP_cmdBrowserAddress;

var AddressOpenNode = "<urls>\r\n";
var AddressRec = "<url address=\"@@url@@\"></url>\r\n";
var AddressCloseNode = "</urls>";
//for the wsrec to rebuild the proxy.
var urlReplacePattern = /@@url@@/g;
var MAX_ADDRESS_SIZE = 15;

var userAddress = "";
var browserAddress = "";

var LIST_URI;
var addAllBrowsedAddress = false;
var addNextBrowserAddress = false;

//---------------     API FUNCTIONS    ---------------
// This file use shared by the toolbar combo box control and by the Browser Address Dialog. Some of the API functions are only used by one 
// API or another

function isDOMRequired() {
	return false;
}

//For the dialog only
function commandButtons()
{
   return new Array("PutButtonsOnBottom", "OkButton defaultButton", dw.loadString("Commands/Jump_Menu/BTN_Go"), "onGoButton()",
                    "CancelButton", MM.BTN_Cancel, "window.close()",
                    "PutButtonOnLeft", MM.BTN_Help, "displayHelp()");
}

// For the toolbar only
function receiveKillFocus(newAddress)
{
	//For Kill Focus events, we don't want to do anything except remember the current value until the user or browser changes
	userAddress = newAddress;
}

// Directly by the toolbar, indirectly from dialog
function receiveArguments(newAddress) 
{
	userAddress = newAddress;

	var dom = dw.getActiveWindow();
	if (!dom)
		return;

	addNextBrowserAddress = true;

	var browser = dom.browser;
	if (newAddress.indexOf("javascript:") == 0) {
		var jsCode = unescape(newAddress.substr(11));
		browser.getWindow().eval(jsCode);
	}
	else {
		browser.openURL(newAddress);
	}
}

function canAcceptCommand() {
    return (dw.getActiveWindow() != null && (dw.getActiveWindow().getDesignViewMode() == 'live' || dw.getActiveWindow().getView() == 'browse'));
}

// Directly by the toolbar, indirectly from dialog
function getCurrentValue() {
	var dom = dw.getActiveWindow();
	if (!dom)
		return "";

	var toolTip;
	//if we're not in live view, the just show the local URL
	if (dom.getDesignViewMode() != 'live' && dom.getView() != 'browse')
	{
		toolTip = dom.URL;
		if( toolTip.length == 0 )
			toolTip = dw.loadString("Address_URL/combobox/tooltip");
		dom.setToolbarItemAttribute("DW_Toolbar_Main", "Address_URL", "tooltip", toolTip);
		return dom.URL;
	}

	var browser = dom.browser;
	var value = browser.getURL();

	if (value && value.isValidURI() && value.toString() != browserAddress.toString() && value.getScheme() != "unknown" ) {
		browserAddress = value.toString();
		userAddress = browserAddress;
		//check if is it not a temp file
		//extract the tail of the url
		var filename = browserAddress;
		var slashIndex = filename.lastIndexOf("/");
		filename = filename.substring(slashIndex + 1);
		var tempIndex = filename.indexOf("TMP");
		if (tempIndex != 0) {
			if( addNextBrowserAddress || addAllBrowsedAddress )
				addRecentAddress(value.toString());
			addNextBrowserAddress = false;
		}
	}
	else if( userAddress && userAddress.length )
	{
	  value = userAddress;
	}
	
	toolTip = value;
	if( toolTip.length == 0 )
		toolTip = dw.loadString("Address_URL/combobox/tooltip");
	dom.setToolbarItemAttribute("DW_Toolbar_Main", "Address_URL", "tooltip", toolTip);
	return value;
}

// only called by the toolbar, indirectly from dialog
function getDynamicContent() {
	var items = getAddressArray();
	//go through and add and "id" for the toolbar items
	for (var i = 0; i < items.length; i++) {
		items[i] = items[i] + ";id='" + items[i] + "'";
	}
	return items;
}



//---------------    LOCAL FUNCTIONS   ---------------

function initializeUI()
{
	LIST_URI = new ListControl('uriField');
	LIST_URI.setAll(getAddressArray());
	var curVal = getCurrentValue();
	if( curVal != "" )
	{
		LIST_URI.set(curVal);
		LIST_URI.setIndex(0);
	}
	else
	{
		LIST_URI.setIndex(-1);
	}
}

//called when the user hits the "Go" button
function onGoButton()
{
	receiveArguments(LIST_URI.get());
	window.close();
}

function getAddressArray() {
	var items = new Array;
	//always make sure the browser home page is there
    var win = dw.getActiveWindow();
	var homePage = (win && win.browser) ? win.browser.getHomePage() : "";
	if (homePage && homePage.isValidURI() ) {
		homePage = homePage.toString();
		items.push(homePage);
	}
	else {
		homePage = "";
	}
	var filename = dw.getConfigurationPath() + "/Toolbars/MM/AddressList.xml";
	var location = MMNotes.localURLToFilePath(filename);
	if (DWfile.exists(location)) {
		var addressData = DWfile.read(location);
		var addressDOM = dw.getDocumentDOM(dw.getConfigurationPath() + '/Shared/MM/Cache/empty.htm');
		addressDOM.documentElement.outerHTML = addressData;
		var addressNodes = addressDOM.getElementsByTagName("url");
		if (addressNodes.length) {
			for (var i = 0; i < addressNodes.length; i++) {
				if( homePage != addressNodes[i].address ) {
					items.push(addressNodes[i].address);
				}
			}
		}
	}
	return items;
}

function addRecentAddress(address) {
	var fileContents;
	var filename = dw.getConfigurationPath() + "/Toolbars/MM/AddressList.xml";
	var location = MMNotes.localURLToFilePath(filename);
	var addressData;
	var addressDOM;
	var addressNodes = null;
	fileContents = AddressOpenNode;
	var aRec;

	if (DWfile.exists(location)) {
		addressData = DWfile.read(location);
		addressDOM = dw.getDocumentDOM(dw.getConfigurationPath() + '/Shared/MM/Cache/empty.htm');
		addressDOM.documentElement.outerHTML = addressData;
		addressNodes = addressDOM.getElementsByTagName("url");
	}

	//add the new node on the top.
	aRec = AddressRec;
	aRec = aRec.replace(urlReplacePattern, address.replace(/"/g, "%22"));

	fileContents = fileContents + aRec;
	var length = -1;
	if (addressNodes) {
		length = (addressNodes.length > MAX_ADDRESS_SIZE - 1) ? (MAX_ADDRESS_SIZE - 1) : addressNodes.length;
	}
	for (var i = 0; i < length; i++) {
		if (addressNodes[i].address == address) {
			continue;
		}
		aRec = AddressRec;
		aRec = aRec.replace(urlReplacePattern, addressNodes[i].address);
		fileContents = fileContents + aRec;
	}

	fileContents = fileContents + AddressCloseNode;
	return DWfile.write(filename, fileContents);
}
