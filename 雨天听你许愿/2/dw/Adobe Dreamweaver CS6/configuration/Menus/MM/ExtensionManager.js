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

JSBridge.browseInEM = function ()
{
    if (!JSBridge.isInstalled(dw.exmanID))
        return false;
    
	var	bt = new BridgeTalk;
	var	script = "";

	if (!JSBridge.isRunning(dw.exmanID))
	{
	    var appLanguage = dw.getAppLanguage();  // get the language to launch Exman in e.g. fr_FR
	    JSBridge.launch(dw.exmanID, '-EMBT -locale lang=' + appLanguage + ' -locate product=\"' + dw.appNameNonUI + '"');
 	}
  else  
  {
      JSBridge.bringToFront(dw.exmanID);
  }

	return true;
};

function receiveArguments()
{
	if (!JSBridge.browseInEM()) {
		alertString = dw.loadString("AppBar/NoExtensionManager");
		alert(alertString);
	}
}

function canAcceptCommand()
{
	if (typeof JSBridge != 'undefined')
		return true;
	else
		false;
}
