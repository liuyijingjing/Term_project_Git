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
    if ( dom == null || dom.getDesignViewMode() != 'live')
        return false;
    return true;
}

function canAcceptCommand(opt) 
{
	var dom = dw.getActiveWindow();
	if( dom == null )
		return false;

    var liveViewEnable = (dw.canShowLiveView(dom) && !dom.getExpandedTablesMode() && !dw.getLiveDataMode() && dom.getView() != 'browse');
	
	switch(opt)
	{
		case 'live_view':
			return (liveViewEnable);
			
		case 'live_code':
			return (liveViewEnable);
			
		case 'inspect':
		{
		    // Context-sensitive tooltip
		    var msgId;
			if( dom.getLiveViewInspectMode() )
			    msgId = "DW_InspectMode/checkbutton/tooltip/inspectOff";
			else if( dom.getDesignViewMode() == 'live' )
			    msgId = "DW_InspectMode/checkbutton/tooltip/inspectOn";
			else
			    msgId = "DW_InspectMode/checkbutton/tooltip/liveViewAndInspectOn";

            var tt = dw.loadString(msgId);
			dom.setToolbarItemAttribute('DW_Toolbar_Main', 'DW_InspectMode', 'tooltip', tt);
			
			return (liveViewEnable);
        }		
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
		case 'live_view':
			if( dom.getDesignViewMode() == 'live' ) 
			{
				dom.setDesignViewMode('editable');
			}
			else
			{
				dom.setDesignViewMode('live');
			}
			break;
			
		case 'live_code':
			if( dom.getLiveCodeEnabled() )
			{
				dom.setLiveCodeEnabled(false);
			}
			else
			{
				//ensure Live View is on
				dom.setDesignViewMode('live');
				
				// Verify that Live View was successfully started
				if( dom.getDesignViewMode() == 'live' )
    				dom.setLiveCodeEnabled(true);
			}
			break;
			
		case 'inspect':
			if( dom.getLiveViewInspectMode() )
			{
				dom.setLiveViewInspectMode(false);
			}
			else
			{
				//ensure Live View is on
			    dom.setDesignViewMode('live');

				// Verify that Live View was successfully started
				if( dom.getDesignViewMode() == 'live' )
			    {
				    dom.setLiveViewFollowsTheNextLink(false);   //ensure Follow we won't follow the next link
				    dom.setLiveViewFollowsAllLinks(false); 	    //ensure Follow any link
				    dom.setLiveViewInspectMode(true);
				}
			}
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
		case 'live_view':
			return (dom.getDesignViewMode() == 'live');
		
		case 'live_code':
			return (dom.getLiveCodeEnabled());
			
		case 'inspect':
			return (dom.getLiveViewInspectMode());
	
	}
	
	return false;
}

// ************************* UTILITY FUNCTIONS *******************************