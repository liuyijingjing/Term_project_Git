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

function showIf()
{
	var dom = dw.getActiveWindow();
	if(dom == null || (dom.getView() != 'browse' && dom.getDesignViewMode() != 'live'))
		return false;
    return true;
}

function canAcceptCommand(opt, context) 
{
	var browser;
	var dom = dw.getActiveWindow();
	
	if( context == 'control' )
	{
		browser = dw.getBrowser();
	}
	else
	{
		if( dom == null )
			return false;
	
		if( dom.getView() != 'browse' && dom.getDesignViewMode() != 'live')
			return false;
			
		browser = dom.browser;
	}
	
	if( browser == null )
		return false;
	
	switch(opt)
	{
		case 'back_button':
			return (browser.isCmdEnabled('back'));
		
		case 'forward_button':
			return (browser.isCmdEnabled('forward'));
			
		case 'home_button':
			return (browser.isCmdEnabled('home'));
			
		case 'page_navigation_history_button':
			return (browser.isCmdEnabled('pageNavigationHistory') && (browser.getPageNavigationHistoryLength() > 0));
		
		case 'stop_button':
			return (browser.getPageBusy());
			
		case 'refresh_button':
			return (browser.isCmdEnabled('refresh'));
		
		case 'refresh_stop_button':
			if( browser.getPageBusy() )
			{
				toggleStopRefreshButton(dom, "stop");
			}
			else
			{
				toggleStopRefreshButton(dom, "refresh");
			}
			return (true);
			
		case 'refresh_styles_button':
			return (true);
		
		case 'address_command':
			return (true);
		
		case 'liveview_out_of_sync_button':
			return (dom != null && !dom.isLiveViewBrowsingHomeURI());
		
		case 'liveview_browser_edit_button':
			return (dom != null && !dom.isLiveViewBrowsingHomeURI() && canEditLiveViewURL(dom));
		
		case 'edit_cut':
			return (browser.isCmdEnabled('cut'));
		
		case 'edit_copy':
			return (browser.isCmdEnabled('copy'));
		
		case 'edit_paste':
			return (browser.isCmdEnabled('paste'));
		
		case 'edit_select_all':
			return (browser.isCmdEnabled('selectAll'));
		
		case 'edit_find':
			return (browser.isCmdEnabled('find'));
			
		case 'edit_undo':
			return (browser.isCmdEnabled('undo'));
		
		case 'edit_redo':
			return (browser.isCmdEnabled('redo'));
			
		case 'print':
			return (browser.isCmdEnabled('print'));
	}
	return false;
}

function receiveArguments(opt, context) 
{
	var browser;
	var dom = dw.getActiveWindow();
	
	if( context == 'control' )
	{
		browser = dw.getBrowser();
	}
	else
	{
		if( dom == null )
			return false;
			
		browser = dom.browser;
	}
	
	if( browser == null )
		return false;
	
	switch(opt)
	{
		case 'back_button':
			browser.backPage();
			break;
			
		case 'forward_button':	
			browser.forwardPage();
			break;
			
		case 'home_button':
			browser.homePage();
			break;
		
		case 'page_navigation_history_button':
			//This should never happend as we're a menu button
			break;
		
		case 'stop_button':
			browser.stopPage();
			break;
			
		case 'refresh_button':
			
			browser.refreshPage();
			
			break;
		
		case 'refresh_stop_button':
			if( browser.getPageBusy() )
			{
				browser.stopPage();
				toggleStopRefreshButton(dom,"refresh");
			}
			else
			{
				dom.synchronizeLiveView(true);
				browser.refreshPage();
				toggleStopRefreshButton(dom,"stop");
			}
			break;
			
		case 'refresh_styles_button':
			browser.refreshPageStyles();
			break;
		
		case 'address_command':
			if( dom != null )
			{
				dom.setToolbarVisibility('DW_Toolbar_Main', true);
				dom.setFocusToToolbarItem('DW_Toolbar_Main', 'Address_URL');
			}
			break;
		
		case 'liveview_out_of_sync_button':
			browser.homePage();
			break;
			
		case 'liveview_browser_edit_button':
			var openedDom = editLiveViewURL(dom);
			if( openedDom )
				openedDom.setDesignViewMode('live');
			break;
		
		case 'edit_cut':
			browser.editCut();
			break;
		
		case 'edit_copy':
			browser.editCopy();
			break;
		
		case 'edit_paste':
			browser.editPaste();
			break;
		
		case 'edit_select_all':
			browser.editSelectAll();
			break;
		
		case 'edit_find':
			browser.editFind();
			break;
			
		case 'edit_undo':
			browser.editUndo();
			break;
		
		case 'edit_redo':
			browser.editRedo();
			break;
			
		case 'print':
			browser.print();
			break;
	}
}

function isCommandChecked(opt, context)
{
	var browser;
	var dom = dw.getActiveWindow();
	
	if( context == 'control' )
	{
		browser = dw.getBrowser();
	}
	else
	{
		if( dom == null )
			return false;
			
		browser = dom.browser;
	}
	
	if( browser == null )
		return false;
	
	switch(opt)
	{
		case 'back_button':
			return (false);

		case 'forward_button':	
			return (false);

		case 'home_button':
			return (false);

		case 'page_navigation_history_button':
			return (false);

		case 'stop_button':
			return (false);

		case 'refresh_button':
			return (false);
			
		case 'refresh_stop_button':
			return (false);

		case 'refresh_styles_button':
			return (false);

		case 'address_command':
			return (false);
		
		case 'liveview_out_of_sync_button':
			return (false);
		
		case 'liveview_browser_edit_button':
			return (false);
		
		case 'edit_cut':
			return (false);
		
		case 'edit_copy':
			return (false);
		
		case 'edit_paste':
			return (false);
		
		case 'edit_select_all':
			return (false);
		
		case 'edit_find':
			return (false);
			
		case 'edit_undo':
			return (false);
		
		case 'edit_redo':
			return (false);
			
		case 'print':
			return (false);
	}
	
	return false;
}

function getMenuID(opt)
{
	switch(opt)
	{
		case 'page_navigation_history_button':
		    return ("DWBrowserPageNavigationHistory"); //the menu button for the back button
	}
	
	return "";
}

// ************************* UTILITY FUNCTIONS *******************************

function toggleStopRefreshButton(dom, opt )
{
	if( !dom )
		return;
		
	if( opt == "stop" )
	{
		//show stop button
		dom.setToolbarItemAttribute("DW_Toolbar_Main", "Browse_Refresh_Stop", "tooltip", dw.loadString("Browse_Stop/button/tooltip"));
		dom.setToolbarItemAttribute("DW_Toolbar_Main", "Browse_Refresh_Stop", "image", "Toolbars/images/MM/P_Stop_Sm_N.png");
	}
	else
	{
		//show refresh
		dom.setToolbarItemAttribute("DW_Toolbar_Main", "Browse_Refresh_Stop", "tooltip", dw.loadString("Browse_Refresh/button/tooltip"));
		dom.setToolbarItemAttribute("DW_Toolbar_Main", "Browse_Refresh_Stop", "image", "Toolbars/images/MM/refresh.png");
	}
}


function canEditLiveViewURL(dom)
{
	var curUri = dom.browser.getURL();
	var uriArg;
	if( curUri.isOfType("file" ) )
		uriArg = curUri.toLocalPath();
	else
		uriArg = curUri;
	var foundSite = dw.findSiteForURI(uriArg);
	return Boolean(foundSite && (DWfile.exists(uriArg) || site.canGet(foundSite.localURI)));
}

function editLiveViewURL(dom)
{
	var curUri = dom.browser.getURL();
	if( curUri.isOfType("file" ) )
		uriArg = curUri.toLocalPath();
	else
		uriArg = curUri;
	var foundSite = dw.findSiteForURI(uriArg);
	if(!foundSite)
		return;
		
	//we don't want the query string if there was one on there
	var uri = foundSite.localURI;
	uri.setQuery("");
	
	var attrs = DWfile.getAttributes(uri.toLocalPath());
	if( attrs && attrs.indexOf("D") != -1 )
	{
		var tempUri = findPageToOpen( uri );
		if( !tempUri || tempUri == "" )
		{
			locateInRemoteSite(foundSite.siteName, uri)
			return;
		}
	}
	
	var curSite = site.getCurrentSite();
	
	if( !DWfile.exists(uri.toLocalPath()) )
	{
		if( curSite != foundSite.siteName )
			site.setCurrentSite(foundSite.siteName);
		site.get(uri);
	}
	
	if( !DWfile.exists(uri.toLocalPath()) )
	{
		if( !locateInRemoteSite(foundSite.siteName, uri) )
		{
			if( curSite != site.getCurrentSite() )
				site.setCurrentSite(curSite);
		}
		
		return;
	}
	
	return dw.openDocument(uri, true);
}

function findPageToOpen(uri)
{
	//check for a local index page first
	var searchUri = new DWUri(uri);
	searchUri.chDir( "index.*" );
	var list = DWfile.listFolder(searchUri);
	if( list && list.length == 1 )
	{
		uri.setPath(uri.getPath() + list.pop());
		return uri;
	}
	
	return "";
}

function locateInRemoteSite(siteName, uri)
{
	if (dwscripts.askYesNo(dw.loadString("liveview/askYesNo/couldNotFindDocToEdit"), MM.BTN_Yes))
	{
		if( site.getCurrentSite() != siteName )
			site.setCurrentSite(siteName);
		site.locateInSite("remote", uri);
		return true;
	}
	return false;
}
