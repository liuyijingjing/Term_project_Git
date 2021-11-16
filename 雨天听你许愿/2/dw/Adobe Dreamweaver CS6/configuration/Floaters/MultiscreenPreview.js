//////////////////////////////////////////////////////////////////////////////////////////////
//
// ADOBE CONFIDENTIAL
// ___________________
//
//  Copyright 2010 Adobe Systems Incorporated
//  All Rights Reserved.
//
// NOTICE:  All information contained herein is, and remains
// the property of Adobe Systems Incorporated and its suppliers,
// if any.  The intellectual and technical concepts contained
// herein are proprietary to Adobe Systems Incorporated and its
// suppliers and are protected by trade secret or copyright law.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe Systems Incorporated.
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
// Summary Comment
//
// There are three browser controls that we want to act like one browser control.  We also
// want to allow the user to navigate to links by clicking them in any of the browswer controls,
// which will then cause the other two browser controls to navigate to the same link.
// 
// To accomplish this, we need to know when a user has clicked on a link in a browser control.
// Luckily, before a browser control navigates to the desired link, it fires its
// "BrowserControlBeforeNavigation" event.  We can write a handler for that event which can,
// if desired, prevent the default behavior of navigating to the link.  This gives us a chance
// to intercept link-clicks and tell all the the browser controls to navigate to that link, so
// we can keep all the browser controls in synch.
//
// We do this by putting some logic in the onBeforeNavigation handler of each browser control
// that goes: Do I have permission to browse?  If yes, then allow the navigation to continue
// as normal and set my permission back to false.  If no, prevent the navigation from happening and
// call browseTo() and pass in the URL that I was about to navigate to.  
//
// browseTo() is a function that tells all three browser controls to go to the passed in URL, but 
// first it grants each browser control permission to navigate.  That way, when onBeforeNavigation()
// gets called for each browser control, each browser control will have permission to navigate
// and will allow the navigation and then reset their permission to false.
//
// Anytime we want to tell the browser controls to navigate somewhere, we first have to grant them
// permissions.  Browser methods that cause the onBeforeNavigation() handler to be called include:
// backPage(), forwardPage(), startLiveView(), openURL(), etc, and you will see grantPermissions()
// being called before they get called.
// 
//////////////////////////////////////////////////////////////////////////////////////////////


// Consult initUI() for more global variable declarations.
var gInitedUI = false;
var gActiveLiveViewDOM;
var gHaveCheckedForDocUponBecomingVisible = false;
var gMacLogPath = "";
var HELP_DOC = MM.HELP_html5css3;
var gLargeViewportTop = 0;
var gLargeViewportGuard = 40;
var gWindowChromeSize = 40;
var gLargeViewportWidth = 0;
var gInitialPanelWidth = 1195;
var gInitialPanelHeight = 760;

//////////////////////////////////////////////////////////////////////////////////////////////
// DW API callback functions. 
//
function initialSize(platform)
{
	var maxIntialSize = dw.getMaxPanelSize();
	
	var screenHeight = maxIntialSize[1];	// array = {width, height}
	var height = gInitialPanelHeight;

	if (screenHeight < gInitialPanelHeight + gWindowChromeSize)
	    height = screenHeight - gWindowChromeSize;

	return gInitialPanelWidth.toString() + "," + height.toString();   // OWL adds ~38 px of chrome to the height         
}
// last chance to decide if we can be shown.
function canShow(platform) 
{
	var	retValue = "false";
	var menuDOM = dw.getDocumentDOM(dw.getMenuFile());
	var menuItemsArray = menuDOM.getElementsByTagName("menuitem");
	
	// if the user removed the extension since last we were shown, prevent us from being shown now.
	// we do this by checking menus.xml for the existence of the PIB / MSP item
	for (var i = 0; i < menuItemsArray.length; i++)
	{
		if (menuItemsArray[i].getAttribute("id") == "DWMenu_Multiscreen_Preview")
		{
			retValue = "true"
			break;
		}
	}
	return retValue;    
}
function displayHelp()
{ 
    dwscripts.displayDWHelp(HELP_DOC);
}
function selectionChanged()
{
	var haveDoc = false;

	//dwscripts_log("In selectionChanged()"); // left in as an example of how to log a string

	if (!gInitedUI)
		initUI();	
		
	if (!gHaveCheckedForDocUponBecomingVisible)
	{
	    gHaveCheckedForDocUponBecomingVisible = true;
		haveDoc = checkForDocToPreview();
	}
	
	// update the MQ button
	setupMQButton();

	// Need to paginate the doc BEFORE we show the scroll bars
	// now force the scrollbars to always be drawn, so the browser sizes are consistent
	if (haveDoc)
	{
		gSml.setScrollbarMode("on", "both");
		gMed.setScrollbarMode("on", "both");
		gLrg.setScrollbarMode("on", "both");
	}
}
function onShow()
{
	gHaveCheckedForDocUponBecomingVisible = false;
	selectionChanged();
}

function onResize() 
{
    stretchDesktopViewToFit();
}
function onHide()
{
	gHaveCheckedForDocUponBecomingVisible = false;
	
	if (!gInitedUI)
		initUI();	
		
	if (gInitedUI)
	    stopLiveViews();
}
//
// End of DW API callback functions. 
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
function initUI()
{
    dw.preMSP();
    if (domIsReady()) 
	{	
		//if (dwscripts.IS_WIN)
		//	document.getElementsByTagName('body')[0].style.backgroundColor = "#d6d6d6";
			
		gSml = null;
		gMed = null;
		gLrg = null;
		
		gSmlHasPermission = false;
		gMedHasPermission = false;
		gLrgHasPermission = false;
				
		gInNoDocMode = true;
		gCurURL = "";
		gInitialURL = "";
		gCurURLRaw = "";	
		
		gSml = document.getElementById('browserSmall');
		gMed = document.getElementById('browserMedium');
		gLrg = document.getElementById('browserLarge');
		
		gSml.addEventListener("BrowserControlBeforeNavigation", function(e) { onBeforeNavigation(gSml, e); }, false);
		gMed.addEventListener("BrowserControlBeforeNavigation", function(e) { onBeforeNavigation(gMed, e); }, false);
		gLrg.addEventListener("BrowserControlBeforeNavigation", function(e) { onBeforeNavigation(gLrg, e); }, false);
		
		gSml.addEventListener("BrowserControlLoad", function(e) { updateUI() }, false);
		gMed.addEventListener("BrowserControlLoad", function(e) { }, false);
		gLrg.addEventListener("BrowserControlLoad", function(e) { }, false);			
		
		gFileEditBox = document.getElementById('fileEditBox');	
		
		gBackButton = document.getElementById('backButton'); 		
	    gForwardButton = document.getElementById('forwardButton');
	    gRefreshButton =  document.getElementById('refreshButton');		
		gHomeButton =  document.getElementById('homeButton');				
		gAddMediaQueriesButton = document.getElementById('addMediaQueriesButton');
		
		gPhoneSize = document.getElementById('phoneSize');
		gTabletSize = document.getElementById('tabletSize');
		gDesktopSize = document.getElementById('desktopSize');
				
		gBrowserSmallDiv = document.getElementById('browserSmallDiv');	
		gBrowserMediumDiv = document.getElementById('browserMediumDiv');
		gBrowserLargeDiv = document.getElementById('browserLargeDiv');

		gBrowsersView = document.getElementById('browsersView');
		gDocNeededView = document.getElementById('docNeededView');				
		gLoadingView = document.getElementById('loadingView');				
			
		gFileEditBox.disabled = true;
		gForwardButton.disabled = true;
		gBackButton.disabled = true;

		gInitedUI = true;
		changeViewportSizes();				
	}
}
function updateUI()
{
	// display the unencoded URL in the address bar
	gCurURLRaw = String(gSml.getURL().toString(true));
	gFileEditBox.value = cleanAddress(gCurURLRaw, 700, gFileEditBox);

	gCurURL = dw.doURLEncoding(gCurURLRaw, "", true, false, false);

	gBackButton.disabled = !gSml.isCmdEnabled('back');
	gForwardButton.disabled = !gSml.isCmdEnabled('forward');
	gHomeButton.disabled = !gSml.isCmdEnabled('home');

	setupMQButton();
   
	if (dwscripts.IS_WIN)
		gRefreshButton.focus(); // 2719355
	else	
		gSml.focus(); // Set focus to the small browser so the next tab key drills into the elements within

}
function setupMQButton()
{
	// if the user has navigated away from the root doc, or the selected doc is a related file, or the only doc was closed, disallow MQ insertion
	var dom = dw.getDocumentDOM();
	if (!dom)
	{
		gAddMediaQueriesButton.disabled = true;
		return;
	}
	
	var currentDocURL = dw.doURLEncoding(dom.URL, "", true, false, false);
	
	if ((gCurURL == gInitialURL) && (currentDocURL == gCurURL))
		gAddMediaQueriesButton.disabled = false;
	else if (gCurURL.indexOf(currentDocURL + '#') == 0)
		gAddMediaQueriesButton.disabled = false;
	else
		gAddMediaQueriesButton.disabled = true;
	
	// additional heuristic for server-side files
	// gCurURL may be remote while gInitialURL is local, in which case we still want to allow
	// media queries to be added to the local file.
	if (gAddMediaQueriesButton.disabled)
	{
		if (gCurURL.indexOf("http") == 0 && gInitialURL.indexOf("file:") == 0)
		{
			// first see if the file names are the same
			var initialURLFileName = gInitialURL.substring(gInitialURL.lastIndexOf("/") + 1, gInitialURL.length + 1);
			var curURLFileName = gCurURL.substring(gCurURL.lastIndexOf("/") + 1, gCurURL.length + 1);
            var curDocFileName = currentDocURL.substring(currentDocURL.lastIndexOf("/") + 1, currentDocURL.length + 1);
			
			if ((initialURLFileName == curURLFileName) && (initialURLFileName == curDocFileName))
			{
				// now test if we are on the current site
				if (gCurURL.indexOf(site.getAppURLPrefixForSite()) == 0)
					gAddMediaQueriesButton.disabled = false;
			}
		}
    }
}
function checkForDocToPreview()
{
    if (!gInitedUI)
        return false;
		
	var dom = dw.getActiveWindow();
			
	// a blank dom.URL means the doc has never been saved.
	if (!dom || (dom.URL == ""))
	{
		showNoDocMsg();	
		return false;
	}

	hideNoDocMsg();		
									
	if (dom != gActiveLiveViewDOM)
	{
	    stopLiveViews();
	    
	    if (startLiveViews(dom))
	    {
	        gActiveLiveViewDOM = dom;		        
	        gInitialURL = dw.doURLEncoding(String(dom.URL), "", true, false, false);
	    }		
	}
	return true;
}
function showNoDocMsg()
{	
	gLoadingView.style.display = "none";
	gBrowsersView.style.display = "none";			
	gDocNeededView.style.display = "";
	
	gHaveCheckedForDocUponBecomingVisible = false;
}
function hideNoDocMsg()
{
	gLoadingView.style.display = "none";
	gDocNeededView.style.display = "none";
	gBrowsersView.style.display = "";
}
function domIsReady()
{
	return true;
}
function stretchDesktopViewToFit() 
{  
    if (!gInitedUI)
        return; 
  
    var height = window.innerHeight;
    var newHeight = 1;

    if (gLargeViewportTop + gLargeViewportGuard < height) 
    {
        newHeight = (height - gLargeViewportTop) - gLargeViewportGuard;
        gLrg.style.height = newHeight.toString() + "px";
    }

    var scrollbarSize = dw.getScrollbarWidth();	

    if (newHeight > scrollbarSize + 1)
        newHeight -= scrollbarSize;

    gDesktopSize.innerHTML = gLargeViewportWidth + " x " + newHeight;           
}

function changeViewportSizes()
{		
	var sizes = readViewSizes();
	
	// first set the labels to the "real" size
	gPhoneSize.innerHTML = sizes.smallWidth + " x " + sizes.smallHeight;
	gTabletSize.innerHTML = sizes.mediumWidth + " x " + sizes.mediumHeight;
	gDesktopSize.innerHTML = sizes.largeWidth + " x " + sizes.largeHeight;

	gLargeViewportWidth = sizes.largeWidth; 	
	
	// then add space for all scrollbars
    var scrollbarSize = dw.getScrollbarWidth();
	
	sizes.smallWidth += scrollbarSize;
	sizes.smallHeight += scrollbarSize;
	sizes.mediumWidth += scrollbarSize;
	sizes.mediumHeight += scrollbarSize;
	sizes.largeWidth += scrollbarSize;
	sizes.largeHeight += scrollbarSize;

	gSml.style.width = sizes.smallWidth + "px";
	gSml.style.height = sizes.smallHeight + "px";	
	
	gMed.style.width = sizes.mediumWidth + "px";
	gMed.style.height = sizes.mediumHeight + "px";	
	
	gLrg.style.width = sizes.largeWidth + "px";
	gLrg.style.height = sizes.largeHeight + "px";

	var viewPortsTop = 70;
	var viewPortsLeft = 20;	

	gBrowserSmallDiv.style.top = viewPortsTop + "px";
	gBrowserSmallDiv.style.left = viewPortsLeft + "px";

	gBrowserMediumDiv.style.top = viewPortsTop + "px";
	gBrowserMediumDiv.style.left = (gBrowserSmallDiv.left + 20 + sizes.smallWidth) + "px";

	gLargeViewportTop = (viewPortsTop + 40 + Math.max(sizes.smallHeight, sizes.mediumHeight));
	gBrowserLargeDiv.style.top = gLargeViewportTop + "px";
	gBrowserLargeDiv.style.left = viewPortsLeft + "px";

	stretchDesktopViewToFit();

}
function startLiveViews(dom)
{					
	cancelBrowse();	
	
	gCurURL = dom.URL;	
	
	//clear the history from the previous session
	gSml.clearPageNavigationHistory();
	gMed.clearPageNavigationHistory();
	gLrg.clearPageNavigationHistory();
	
	grantPermissions();	
	
	var r1, r2, r3;  // "Result" bools
				
	r1 = gSml.startLiveView(dom);
	if (r1)
		r1 = gSml.setIgnoreEdits(true);
	
	r2 = gMed.startLiveView(dom);
	if (r2)
		r2 = gMed.setIgnoreEdits(true);

	r3 = gLrg.startLiveView(dom);
	if (r3)
		r3 = gLrg.setIgnoreEdits(true);
	
	return (r1 && r2 && r3);
}
function browseTo(inURL, force)
{			
	var url = String(inURL);
	
	if (!force && (gCurURL.toLowerCase() == url.toLowerCase()))
		return;
	
	cancelBrowse();	
	
	gCurURL = url;
				
	grantPermissions();	
	
	gSml.openURL(url);
	gMed.openURL(url);
	gLrg.openURL(url);
	
	gBackButton.disabled = false;
}
function stopLiveViews()
{
    grantPermissions();  // For some reason, stopLiveView() triggers "onBeforeNavigation", so we want to allow it.
	    
    gSml.stopLiveView();
    gMed.stopLiveView();
    gLrg.stopLiveView();
        
    gActiveLiveViewDOM = null;
}
function grantPermissions()
{
	gSmlHasPermission = true;
	gMedHasPermission = true;
	gLrgHasPermission = true;
}

function revokePermissions()
{
	gSmlHasPermission = false;
	gMedHasPermission = false;
	gLrgHasPermission = false;
}

function hasPermission(browser)
{
	if (browser == gSml)
		return gSmlHasPermission;
	if (browser == gMed)
		return gMedHasPermission;
		
	return gLrgHasPermission;	
}
function revokePermission(browser)
{
	if (browser == gSml)
	{
		gSmlHasPermission = false;
		return;
	}
	if (browser == gMed)
	{		
		gMedHasPermission = false;
		return;
	}			
	gLrgHasPermission = false;	
}
function cancelBrowse()
{
    if (gSml.getPageBusy())			
	    gSml.stopPage();
	if (gMed.getPageBusy())			
	    gMed.stopPage();
	if (gLrg.getPageBusy())			
	    gLrg.stopPage();
}
function onBeforeNavigation(browser, e)
{
    //for redirections, we always let them through. Stopping them could
    //drop important information even if we try to nav to the same url
    if (e.isRedirection)
        return;
		
	if (hasPermission(browser))
	{
		revokePermission(browser);
	}			
	else
	{		
		e.preventDefault();	
		browseTo(e.requestedBrowserLocation, false);
	}
}
function cleanAddress(inURL, displayWidth, element)
{
	var theURL = inURL;
	   	
	// If it is a local URL, shorten it, if we can by making
	// it site-relative
	
	if (theURL.toLowerCase().indexOf("file:") == 0)
	{		
		var root = dw.getSiteRoot()
		if (root)
		{
			if (theURL.indexOf(root) == 0)			
			{
				theURL = theURL.substring(root.length - 1);
			}
			else if (theURL.indexOf(escape(root)) == 0)	
			{
				theURL = theURL.substring(escape(root).length - 1);
			}
		}
	}		

    // Make sure text fits

    var dom = dw.getDocumentDOM();
    if (dom && element)
    {                    
        // Hard-wire the style based on the CSS for that element.
        var fontStr = "font-family: Arial, Helvetica, sans-serif; font-size: 11pt;";        
        var textExtent = dom.getTextExtent(theURL, fontStr);                        
        
        while (textExtent[0] > displayWidth)
        {            
            // URL is too long, so shorten it. First, remove ellipses
            if (theURL.indexOf("...") == 0)
                theURL = theURL.substring(3);

            // Next, remove leading slashes
            while (theURL[0] == "/")
                theURL = theURL.substring(1);

            // Now, remove text up until next slash
            var nextSlashPos = theURL.indexOf("/");
            if (nextSlashPos == -1)
                break;

            // And pre-pend with ellipses
            theURL = "..." + theURL.substring(nextSlashPos);
            
            // Finally, re-measure text
            textExtent = dom.getTextExtent(theURL, fontStr);
        }        
    }
	
	theURL += '\0';
	
	return theURL;
}
function onBackButton() 
{
    cancelBrowse();
    grantPermissions();
    
	var position = gSml.getPageNavigationHistoryPosition();
	if (position > 0)
	{
		var historyItem = gSml.getPageNavigationHistoryItem(position - 1);
		var historyStr = new String(historyItem.uri);

		gSml.backPage();
		gMed.openURL(historyStr);
		gLrg.openURL(historyStr);
		gForwardButton.disabled = false;
		revokePermissions();
	}
	
	gBackButton.disabled = (position <= 1);
	
}
function onForwardButton() 
{    
    cancelBrowse();
    grantPermissions();
	
	var position = gSml.getPageNavigationHistoryPosition();
	var length = gSml.getPageNavigationHistoryLength();
	
	if (position < (length - 1))
	{
		var historyItem = gSml.getPageNavigationHistoryItem(position + 1);
		var historyStr = new String(historyItem.uri);
	
		gSml.forwardPage();
		gMed.openURL(historyStr);
		gLrg.openURL(historyStr);
		gBackButton.disabled = false;
		revokePermissions();
	}
	
	gForwardButton.disabled = (position == (length - 2));
}
function onHomeButton() 
{
    cancelBrowse();    
    grantPermissions();
	
	if (checkForDocToPreview())
	{
		gSml.homePage();
		gMed.homePage();
		gLrg.homePage();
	}
}
function onViewportSizes()
{
	dreamweaver.runCommand('MultiscreenPreview_EditViewSizes');
	changeViewportSizes();
}
function onAddMediaQueries() 
{
	dw.runCommand("Media Query Manager");
	onRefresh();
}
function onRefresh() 
{
	var needsRefresh = checkForDocToPreview();
	if (needsRefresh)
		browseTo(gCurURL, true);

}
