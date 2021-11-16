/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.
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
**************************************************************************/

JSBridge.browseInBridge = function (browsePath)
{
    if (!JSBridge.isInstalled('bridge'))
        return false;
    
	var	bt = new BridgeTalk;
	var	script = "";

	if (!JSBridge.isRunning('bridge'))
	{
		var scriptSavePath = browsePath.replace(/['"\\]/g, "\\$&");
		script = "app.document.thumbnail = new Thumbnail(decodeURI('" + scriptSavePath + "'));";
	}

	script += "BridgeTalk.bringToFront(BridgeTalk.appSpecifier);"

	// Send the script to bridge.
	bt.target = "bridge";
	bt.body = script;
	bt.send(0);

	return true;
};

function receiveArguments()
{
	if (!JSBridge.browseInBridge(dw.getLastSavedDirectory()))
		alert(ALERT_BrowseInBridgeFailed);
}

function canAcceptCommand()
{
	if (typeof JSBridge != 'undefined')
		return true;
	else
		false;
}
