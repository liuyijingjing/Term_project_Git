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

// ************************* API FUNCTIONS *******************************
function isDOMRequired()
{
  return false;
}

function canAcceptCommand(opt) 
{
	var dom = dw.getActiveWindow();
	if( dom == null )
		return false;
	
	return (dom.browser.isCmdEnabled('pageNavigationHistory') && (dom.browser.getPageNavigationHistoryLength() > 0));
}

// getDynamicContent returns the contents of a dynamically generated menu.
// returns an array of strings to be placed in the menu, with a unique
// identifier for each item separated from the menu string by a semicolon.
//
// return null from this routine to indicate that you are not adding any
// items to the menu
function getDynamicContent(itemID)
{
	var dom = dw.getActiveWindow();
	if( dom == null )
		return null;
		
	var hisortyList = new Array();
	var len = dom.browser.getPageNavigationHistoryLength();
	for (var i=0 ; i < len ; i++)
	{
	    var historyItem = dom.browser.getPageNavigationHistoryItem(i);
	    var historyStr = new String(historyItem.title);
	    if (historyStr.length == 0)
	        historyStr = new String(historyItem.uri);
	    if (historyStr.length == 0)
	        historyStr = new String(historyItem.originalUri);
		if (navigator.platform == "Win32")
		{
			historyStr = historyStr.replace(/&/g,"&&");
		}
		historyStr += ";id='"+i+"'"; // each item needs an ID
		historyStr = historyStr.replace(/_/g,"%_");
		
		//add this to the top of the list. The most recent page is last in the
		//browsers history list
		hisortyList.unshift(historyStr);
	}
	
	return hisortyList;
}

function receiveArguments(opt) 
{
	var dom = dw.getActiveWindow();
	if( dom == null )
		return;
	
	dom.browser.goToPageNavigationHistoryPosition(opt);
}

function isCommandChecked(opt)
{
	var dom = dw.getActiveWindow();
	if( dom == null )
		return false;
	
	return (opt == dom.browser.getPageNavigationHistoryPosition());
}



// ************************* UTILITY FUNCTIONS *******************************