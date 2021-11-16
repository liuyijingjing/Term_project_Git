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
	
	switch(opt)
	{
		case 'freeze_javascript':
			return (dom.getDesignViewMode() == 'live' && dom.browser.javaScriptEnabled);
		
		case 'disable_javascript':
			return true;
			
		case 'disable_plugins':
			return true;
			
		case 'follow_the_next_link':
		    return (!dom.getLiveViewInspectMode());     //not in Inspect Mode

		case 'follow_all_links':
		    return (!dom.getLiveViewInspectMode());     //not in Inspect Mode

		case 'follow_link_context_menu_item':
		    return (!dom.getLiveViewInspectMode() && dom.browser.isCmdEnabled("followLinkContextMenuItem"));     //not in Inspect Mode
			
		case 'highlight_changes':
			return true;
		
		case 'auto_sync_remote':
			return true;
		
		case 'use_testing_server':
			return true;
		
		case 'use_local_links':
			return (dom.getLiveViewUsingServer());
		
		case 'edit_request_settings':
			return true;
	}
	return false;
}

function receiveArguments(opt) 
{
	var dom = dw.getActiveWindow();
	if( dom == null )
		return;
	
	switch(opt)
	{
		case 'freeze_javascript':
			dom.browser.interactivityPaused = !dom.browser.interactivityPaused;
			break;
			
		case 'disable_javascript':	
			dom.browser.javaScriptEnabled = !dom.browser.javaScriptEnabled;
			if (dom.getDesignViewMode() == 'live') 
				dom.browser.refreshPage();
			break;
		
		case 'disable_plugins':
			dom.browser.pluginsEnabled = !dom.browser.pluginsEnabled;
			if (dom.getDesignViewMode() == 'live')
				dom.browser.refreshPage();
			break;
			
		case 'follow_the_next_link':
			dom.setLiveViewFollowsTheNextLink(!dom.getLiveViewFollowsTheNextLink());
			break;
		
		case 'follow_all_links':
			dom.setLiveViewFollowsAllLinks(!dom.getLiveViewFollowsAllLinks());
			break;

        case 'follow_link_context_menu_item':
            dom.browser.activateFollowLinkContextMenuItem();
            break;
					
		case 'highlight_changes':
			dom.setLiveCodeHighlightsChanges(!dom.getLiveCodeHighlightsChanges());
			break;
		
		case 'auto_sync_remote':
			dom.setLiveViewAutoSyncFilesOnServer(!dom.getLiveViewAutoSyncFilesOnServer());
			break;
		
		case 'use_testing_server':
			{
				//This will change the home page, so we need to re-load the page
				//if we were view the home page
				var wasViewHomePage = dom.isLiveViewBrowsingHomeURI();
				dom.setLiveViewUsingServer(!dom.getLiveViewUsingServer());
				var isViewHomePage = dom.isLiveViewBrowsingHomeURI();
				
				if (dom.getDesignViewMode() == 'live' && (wasViewHomePage || isViewHomePage) )
				{
					if( isViewHomePage )
						dom.browser.refreshPage();
					else
						dom.browser.openURL(dom.browser.getHomePage());
				}
			}
			break;
		
		case 'use_local_links':
			dom.setLiveViewDependentsUsingServer(!dom.getLiveViewDependentsUsingServer());
			if (dom.getDesignViewMode() == 'live')
				dom.browser.refreshPage();
			break;
		
		case 'edit_request_settings':
			dom.showLiveViewParamatersDialog();
			break;
	}
}

function isCommandChecked(opt)
{
	var dom = dw.getActiveWindow();
	if( dom == null )
		return false;
	
	switch(opt)
	{
		case 'freeze_javascript':
			return(dom.getDesignViewMode() == 'live' && dom.browser.interactivityPaused);
	
		case 'disable_javascript':	
			return (!dom.browser.javaScriptEnabled);
		
		case 'disable_plugins':
			return(!dom.browser.pluginsEnabled);
			
		case 'follow_the_next_link':
			return (dom.getLiveViewFollowsTheNextLink());

		case 'follow_all_links':
		    return (dom.getLiveViewFollowsAllLinks());

		case 'follow_link_context_menu_item':
		    return (false);		
			
		case 'highlight_changes':
			return (dom.getLiveCodeHighlightsChanges());
		
		case 'auto_sync_remote':
			return (dom.getLiveViewAutoSyncFilesOnServer());
		
		case 'use_testing_server':
			return (dom.getLiveViewUsingServer());
		
		case 'use_local_links':
			return (!dom.getLiveViewUsingServer() || !dom.getLiveViewDependentsUsingServer());
		
		case 'edit_request_settings':
			return (false); //this isn't a toggle setting
	}
	
	return false;
}

// ************************* UTILITY FUNCTIONS *******************************