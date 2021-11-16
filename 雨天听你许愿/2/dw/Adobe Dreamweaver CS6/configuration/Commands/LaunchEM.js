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
    if (!JSBridge.isInstalled('exman'))
        return false;

	if (!JSBridge.isRunning('exman'))
	{
	    var appLanguage = dw.getAppLanguage();  // get the language to launch Exman in e.g. fr_FR 
	    JSBridge.launch('exman','-EMBT -locale lang=' + appLanguage + ' -locate product=\"Dreamweaver CS4\"');
 	}
  else  
  {
  	JSBridge.bringToFront("exman");
  }

	return true;
};

function launchEM()
{
	if (typeof JSBridge != 'undefined')
	{
		if (JSBridge.browseInEM())
			return true;
		else
			return false;
	}
	return false;
}