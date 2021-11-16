//
// ADOBE CONFIDENTIAL
// ___________________
//
//  Copyright 2011 Adobe Systems Incorporated
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
// This is a floater used for integration with Business Catalyst. Primarily, it has a
// webkit-based browser control, which houses the BC Module Manager, welcome page, and
// messages to the user.
//////////////////////////////////////////////////////////////////////////////////////////////

// Consult initUI() for more global variable declarations.
var globals = {
    listenForConnectionChange : true,
    initedUI : false,
    viewportTop : 0,
    viewportGuard : 60,    // this constant is subtracted from the panel height to figure out the height of the browser control when the panel is resized, increase it if you need more space 
    windowChromeSize : 40,
	
   reservedRightSpace : 160,
	
    initialPanelWidth : 232,
    initialPanelWidthMac : 240,
    initialPanelHeight : 370,
	
    minPanelWidth : 232,
    minPanelWidthMac : 240,
    minPanelHeight : 370,
   
    activeDOM : -1, // we want to notice that 'no doc' is a change initially
    curURL : "",
    webKitWin : null,
    webKitDoc : null,
    browser : null,
    tbBrowser : null,
    activeSite : null,
    activeBrowser : null,
	adminLink : null,
    loginoutButton : null,
	currentWorkspace : "",
	footerTableElement: undefined,
	adminContainerSize: -1,
	logoutContainerSize: -1,
	siteNameContainerElement: undefined,
	siteNameElement: undefined,
	siteNameTooltipElement: undefined,
	siteNameDensityHash: {},
	currentURL: null,
};

MM.BC.PANEL_EXISTS = true;


/**
 * open admin link in browser
 *
 */
function openAdmin() {
	var adminUrl = MM.BC.SERVER.getAdminUrl(MM.BC.SITE.getSiteID());
	var siteID = MM.BC.SITE.getSiteID(dw.getActiveWindow());
	MM.BC.TOKENS.getOneTimeToken(siteID, function(token) {
		var url = MM.BC.UTILS.generateURL(adminUrl, token);
		dw.browseDocument(url); 
	});
}

function onLoad() {
	MM.BC.log('onLoad');
	selectionChanged();
}


/**
 * load loading html inside loading browser
 *
 */
function loadLoadingPage() {
	var loadingBrowser = document.getElementById("bc_loading");
	
	
	function loadingBrowserLoad(e) {
		var col = dw.getPanelColor();
		
		var loadingWin = loadingBrowser.getWindowObj();
		var loadingDoc = loadingWin.document;
		
		var loadingBody = loadingDoc.getElementsByTagName('body')[0];
		if (loadingBody) loadingBody.style.backgroundColor = globals.backgroundColor;
		
		var loadingMsg = loadingDoc.getElementById('loadingDivMsg');
		if (loadingMsg) loadingMsg.innerHTML = dw.loadString('bc/message/contactingServer');
				
		loadingBrowser.style.display = "";
	}
	
	loadingBrowser.addEventListener("BrowserControlLoad", loadingBrowserLoad, false);	
	loadingBrowser.openURL(dw.getUserConfigurationPath() + "Floaters/BCLoading.html");	
}

/**
 * init floater ui
 *
 */
function initUI() {
	setupWebKitGlobals();

	loadLoadingPage();

	globals.loginoutButton = document.getElementById("logInOut");
		
	globals.adminLink = document.getElementById("adminLink");
	globals.adminLink.addEventListener("mousedown", openAdmin, false);
	
	globals.footer = document.getElementById("footerStuff");
	globals.emptyFooter = document.getElementById("emptyFooter");
	
	var col = dw.getPanelColor();

	globals.backgroundColor = "#" + MM.BC.UTILS.RGB2HTML(col[0], col[1], col[2]);
	globals.browser.style.backgroundColor = globals.backgroundColor;
	globals.tbBrowser.style.backgroundColor = globals.backgroundColor;
	
	window.document.body.style.backgroundColor = globals.backgroundColor;
	
	globals.emptyFooter.style.backgroundColor = globals.backgroundColor;
			
	// add generic browser listeners//
	if (globals.browser && globals.browser.addEventListener) {
		globals.browser.addEventListener("BrowserControlBeforeNavigation", function (e) { onBeforeNavigation(e); }, false);
		globals.browser.addEventListener("BrowserControlBeforeRefresh", function (e) { onBeforeRefresh(e); }, false);
	}
	
	if (globals.tbBrowser && globals.tbBrowser.addEventListener) {
		globals.tbBrowser.addEventListener("BrowserControlBeforeNavigation", function (e) { onBeforeNavigation(e); }, false);
		globals.tbBrowser.addEventListener("BrowserControlBeforeRefresh", function (e) { onBeforeRefresh(e); }, false);	
	}
	
	// add login listeners//
	if (globals.loginoutButton && globals.loginoutButton.addEventListener) {
		globals.loginoutButton.addEventListener("mousedown", doLogInOrOut, false);
	}
	
	if (!globals.currentWorkspace) {
		// get current workspace so we can tell if it has changed//
		globals.currentWorkspace = DWfile.read(MM.BC.CONSTANTS.CURRENT_WORKSPACE);
	}
	
	// mark floater as inited//
	globals.initedUI = true;

	// hide the site name and login/logout text initially//
	updateFloaterUI(false, false);
	
	updateDisplay();
	
};

/**
 * loads a local page and executes the api calls in the local page, through a XMLHTTPRequest
 *
 */
function startOnlineOperations() {

	globals.activeBrowser = globals.browser;
	globals.webKitWin = globals.activeBrowser.getWindowObj();
	
	showLoadingState();

	// show module manager//
	browseTo(MM.BC.CONSTANTS.BC_LOCAL_PAGE, true, function(e) {
	
		// see if get site id is a good enough condition//
		// if we have no site list, or site is not found in sitelist//
		if (!MM.BC.SITE.siteIsInSitesList(MM.BC.SITE.getSiteID()) || !MM.BC.SITE.haveLastUserSiteList()) {

			// get sites list from server//
			MM.BC.API.getSitesList(MM.BC.TOKENS.getGenericToken(), function(sites) {
				// cache the sites list//
				if (sites.items) {
					if (!MM.BC_CACHE.SITES_LIST) MM.BC_CACHE.SITES_LIST = {};
					
					MM.BC.CACHE.LAST_USER_SITES_LIST = {};
					
					var item;
					for (var i = 0; i < sites.items.length; i++) {
						item = sites.items[i];
						MM.BC_CACHE.SITES_LIST[item.id] = item;
						MM.BC.CACHE.LAST_USER_SITES_LIST[item.id] = item;
					}
					
				} else {
					MM.BC.reportError(MM.BC.ERRORS.PARSING_ERROR);
					return;
				}

				var siteID = MM.BC.SITE.getSiteID();
				if (siteID && MM.BC.SITE.isACurrentUserSite(siteID)) {
					executeApiCalls(MM.BC.TOKENS.getGenericToken(), siteID);
				} else {
					checkIfReady();
				}
			});
		} else {
			executeApiCalls(MM.BC.TOKENS.getGenericToken(), MM.BC.SITE.getSiteID());
		}
	}, true);
	
	updateFloaterUI(true, true);
}

/**
 * makes the api calls
 *
 * @param String The generic authentication token
 * @param String The site ID for the current site
 */
function executeApiCalls(genericToken, siteID) {
	globals.activeBrowser = globals.browser;
	globals.webKitWin = globals.activeBrowser.getWindowObj();
	
	// if we have a site token for this site, and cached data for site//
	// go directly to module manager//
	if (MM.BC.TOKENS.getSiteToken(siteID) && MM.BC.CACHE.haveCachedDataForSite(siteID)) {
		// if site token is expired it will show the login page (handled on browser before navigation)//
		initOnlineModuleManager();
	} else {
				
		showLoadingState();
		// if site has expired//
		if (MM.BC.SITE.isSiteExpired(siteID)) {
			MM.BC.reportError(MM.BC.ERRORS.TRIAL_SITE_EXPIRED);
			return;
		}
				
		// get site token//
		MM.BC.API.getSiteToken(siteID, genericToken, function(token) {
				
			// clear all tokens for current site, including one time tokens//
			MM.BC.TOKENS.clearAllTokensForSite(siteID);
			
			// save token as site token//
			MM.BC.TOKENS.setSiteToken(siteID, token); 
			
			// get one time token and cache it for later use//
			MM.BC.API.getOneTimeTokens(siteID, token, function(oneTimeToken) {
			MM.BC.TOKENS.cacheOneTimeTokens(siteID, oneTimeToken);
			}, function(error) {/* silent fail */});
			
			// get site data (bindings, modules, types) and load the online module manager//
			MM.BC.API.getSiteData(siteID, token, function() {
				// save data to cache, so the code hints work offline too//
			MM.BC.CACHE.saveCache();
				
				// update modules and bindings//
				MM.BC.siteChanged();
				MM.BC.selectionChanged();
				
				
				MM.BC.UTILS.runTranslators();
				
				// executeApiCalls module manager//
				initOnlineModuleManager();
			});
		});
	}
}

/**
 * loads the BC toolbox page from bc server
 *
 */
function initOnlineModuleManager() {
	var siteID = MM.BC.SITE.getSiteID();
	
	globals.activeBrowser = globals.tbBrowser;
	globals.browser.style.display = "none";
	globals.activeBrowser.style.display = "";
		
	if (globals.activeSite != siteID || !globals.toolkitLoaded) {
		globals.activeSite = siteID;
		
		showLoadingState();
			
		// get one time token//
		MM.BC.TOKENS.getOneTimeToken(siteID, function (oneTimeToken) {
			var toolboxUrl = MM.BC.SERVER.getToolboxUrl(siteID);
			var completeUrl = MM.BC.UTILS.generateURL(toolboxUrl, oneTimeToken);
			globals.toolkitLoaded = false;
			
			browseTo(completeUrl, true, function() {
				initBCOnlineInterface();
				onBeforeNavigation.sawLogout = false;
				globals.toolkitLoaded = true;
				updateDisplay();
				
				// Hack for rerendering the panel (without this DW won't update the size of the browser after it was set in updateDisplay)
				var browserDiv = document.getElementById('browserDiv');
				browserDiv.innerHTML += '<div id="triggerRendering"></div>';
				browserDiv.innerHTML = browserDiv.innerHTML.replace('<div id="triggerRendering"></div>','');
			}, true);
		});
	} else {
		hideLoadingState();
		updateBindingsInPanel();
	}
}

/**
 * called from csxs to notify a state change
 *
 * @param String The new state - currently accepted status values: "loggedin", "sitecreated"
 */
function statusChanged(newStatus) {
	if (newStatus == "loggedin") {
		MM.BC.resetActiveFileAndSite();
		MM.BC.SITE.resetLastUserSiteList();
		selectionChanged();
    } else {
		if (newStatus == "sitecreated") {
			// a bc site was created; open the site manager//
			MM.BC.activeSite = -1;
			selectionChanged();

			site.defineSites();
		}
	}
}

/**
 * Retry API calls after a failed opperation
 *
 */
function retryServerCalls() {
	hideLoadingState();
	startOnlineOperations();
}


/**
 * Update the list of bindings in the "data" tab - called on document change
 *
 */
function updateBindingsInPanel(bindings) {
	
	var webKitWin = globals.tbBrowser.getWindowObj();
	
    if (webKitWin) {
		if (!bindings) {
			bindings = MM.BC.BINDINGS.getFilteredBindingsAndTagsForFile();
		}
		
		if (webKitWin.bcEndpoints && webKitWin.bcEndpoints.loadBindings) {
			webKitWin.bcEndpoints.loadBindings(bindings);
		}
    }
}

MM.BC.BINDINGS.updateBindingsInPanel = updateBindingsInPanel;


//////////////////////////////////////////////////////////////////////////////////////////////
// DW API callback functions. 
//

/**
 * Adds references to the bowser, browser window and document to the globals object
 *
 */
function setupWebKitGlobals() {
    globals.browser = document.getElementById('browser');
    globals.tbBrowser = document.getElementById('toolbox_browser');
    
    globals.browser.setAutomaticallyPromptForCredentials(false);
    globals.tbBrowser.setAutomaticallyPromptForCredentials(false);
    
    if (globals.activeBrowser) {
	    globals.webKitWin = globals.activeBrowser.getWindowObj();
	
	    // always set the doc, since it probably changed
	    globals.webKitDoc = globals.webKitWin.document;
   	}
}

/**
 * called by dw on document edited
 *
 */
function documentEdited() {
	try {
 	 MM.BC.documentEdited();
		updateRelatedFiles();
		checkIfDocumentChanged();
	} catch (e) {	
	MM.BC.log('error in documentEdited:' + e);
	}
}

/**
 * This method checks if the current active document changes since last check, and notifies the BCTollboxPanel if it changed or closed
 */
function checkIfDocumentChanged(force) {
	var dom = dw.getActiveWindow();
	var siteID = MM.BC.SITE.getSiteID(dom);
	var currentURL = MM.BC.UI_UTILS.getCurrentDocumentPath();
	var cacheKey = siteID + currentURL;
	if (force || (globals.currentURL != cacheKey)) {
		globals.currentURL = cacheKey;
		notifyPageChanged(currentURL);
	}
};

/**
 * Notifies BC endpoint about when current page changes
 */
function notifyPageChanged(path) {
	var webKitWin = globals.tbBrowser.getWindowObj();

	if (webKitWin && webKitWin.bcEndpoints && webKitWin.bcEndpoints.onDocumentChange) {
		webKitWin.bcEndpoints.onDocumentChange(path);
	}
};

/**
 * called when a document is unloaded
 *
 */
function checkForNoFileOpen() {
	var docList = dreamweaver.getDocumentList();
	if (docList.length == 0) {
		selectionChanged();
	}
}

/**
 * check if site changed (used only if the user is offline, to use the modules cache)
 *
 */
function checkIfSiteHasChanged(dom) {
	if (dom) {
		var siteRoot = MM.BC.UTILS.getSiteRootForURL(dom.URL);
		if (MM.BC.CACHED_SITE_URL != siteRoot) {
			MM.BC.CACHED_SITE_URL = siteRoot;
			MM.BC.siteChanged();
		}
	}
}

function hasNoTranslator() {
	dw.useTranslatedSource(true);
	var dom = dw.getDocumentDOM();
	if (dom.documentElement.outerHTML.indexOf('BUSINESS_CATALYST_DYNAMIC') == -1) {
		return true;
	}
	dw.useTranslatedSource(false);
	return false;
}

function updateRelatedFiles() {
	var docDom = dw.getDocumentDOM();
	
	if (docDom) {
		if (MM.BC.translatorRun) {
			MM.BC.UTILS.updateRelatedFiles(docDom);
			MM.BC.translatorRun = false;
			MM.BC.noRelatedFiles = false;
		} else {
			if (!MM.BC.noRelatedFiles && hasNoTranslator()) {
				MM.BC.UTILS.updateRelatedFiles(docDom);
				MM.BC.noRelatedFiles = true;
			}
		}
	}
}
/**
 * called by dw on selection changed
 *
 */
function selectionChanged() {
	try {
		if (!globals.initedUI)
			initUI();
    
		var dom = dw.getActiveWindow();

		updateRelatedFiles();
		checkIfDocumentChanged();

		MM.BC.selectionChanged();

		// if the panel is minimized while opening dreamweaver, calling any mmbrowser method throws an error //
		if (!window.innerHeight) return;
		
		
	    // show welcome page //
	    if (!shouldSkipWelcome()) {
			if (!MM.BC.welcomeDisplayed) {
			showWelcomePage();
				MM.BC.welcomeDisplayed = true;
			}
			MM.BC.activeSite = -1;
			return;
		}
		
		
		if (!MM.BC.isLoggedIn()) {
			showLoginPage();
			MM.BC.activeSite = -1;
			checkIfSiteHasChanged(dom);
			return;
		}
		
		globals.activeDOM = dom;
		
		if (globals.activeDOM)
        {
            if (globals.listenForConnectionChange)
                globals.activeDOM.addEventListener("DWConnectionChanged", function (e) { onConnectionChanged(e); }, false);
			
			if (globals.activeDOM.browser && globals.activeDOM.browser.getWindow() && !globals.activeDOM.browser.getWindow().added) {
				globals.activeDOM.browser.getWindow().added = true;
				globals.activeDOM.browser.getWindow().addEventListener("unload", checkForNoFileOpen, false);
			}
		}
		
		if (!checkIfReady()) {
			// force site change when we are ready//
			MM.BC.activeSite = -1;
			return;
		}
		
		if (globals.listenForConnectionChange)
        {
            // start listening for INET connection change events.
            if (globals.activeDOM && globals.activeDOM.removeEventListener) {
                globals.activeDOM.removeEventListener("DWConnectionChanged", function (e) { onConnectionChanged(e); }, false);
            }
        }
		
		// if site changed//
		if (MM.BC.UTILS.getSiteRootForURL(dom.URL) != MM.BC.activeSite) {
			siteChanged();
		}
	} catch (e) {
		MM.BC.log("selection changed", true);
	}
}

MM.BC_SELECTION_CHANGED = selectionChanged;


/**
 * called from selectionChanged when site changes
 *
 */
function siteChanged() {
	// set new site as active site//
	var dom = dw.getDocumentDOM();
	MM.BC.activeSite = MM.BC.UTILS.getSiteRootForURL(dom.URL);
	
	MM.BC.siteChanged();
	
	if (MM.BC.isLoggedIn()) {
		startOnlineOperations();
		updateSiteNameDisplay();
	}
}

/**
 * check if current page can display the online BC toolbox
 *
 */
function checkIfReady() {
	var dom = dw.getActiveWindow();
	
	// no internet connection//
	if (!dw.isConnectedToInternet()){
        var message = dw.loadString('bc/infomessage/noConnection');
        showRetryPage(message, true);
		return false;
    } 
	
     // no document opened//
    if (dom == null) {
        var message = dw.loadString('bc/infomessage/docNotOpen');
        showInfoPage(message, true);
		return false;
    } else {
		
		// not a html document//
		if (dw.getDocumentDOM() && dw.getDocumentDOM().getParseMode() != "html"){
			var message = dw.loadString('bc/infomessage/docNotInBCMessage');
			showInfoPage(message, true);
			
			MM.BC.HINTS.resetAllCodeHintsMenu();
					
			return false;
		} 
		
		
			
			var siteID = MM.BC.SITE.getSiteID(dom);
			
			if (MM.BC_CACHE && MM.BC_CACHE.SITES_LIST) {
				
				// not a BC site//
				if (!siteID) {
					MM.BC.HINTS.resetAllCodeHintsMenu();
					var message = dw.loadString('bc/infomessage/docNotInBCMessage');
					showInfoPage(message);
					return false;
				} else {
			
				// if we are in the process of refresing the site list//
				if (MM.BC.SITE.doubleCheckedSiteList(siteID) && !MM.BC.SITE.haveLastUserSiteList()){
					return true;
				}
				
					if (!MM.BC.SITE.isACurrentUserSite(siteID)) {
					        if (!MM.BC.SITE.doubleCheckedSiteList(siteID)) {
						if (!MM.BC.CACHE.CHECKED_SITES_LIST) MM.BC.CACHE.CHECKED_SITES_LIST = {};
						MM.BC.CACHE.CHECKED_SITES_LIST[siteID] = true;
						   MM.BC.SITE.resetLastUserSiteList();
						MM.BC.activeSite = -1;
							selectionChanged();
						   return false;
				    	        }
						MM.BC.HINTS.resetAllCodeHintsMenu();
						var message = dw.loadString('bc/infomessage/siteNotAvailableForUser');
						showInfoPage(message);
						return false;
					}
				}
			}
	
    }
	
	return true;
}

/**
 * Get the with of the browser
 *
 * @return Integer The width of the browser in the MMBrowser control
 */
function getBrowserWidth() {
	return window.innerWidth;
}

/**
 * Get the height of the browser
 *
 * @return Integer The height of the browser in the MMBrowser control
 */
function getBrowserHeight() {
	return window.innerHeight - 20;
}

/**
 * resize browser on floater resize
 *
 */
function updateBrowserDims() {
	if (!globals.browser || !globals.tbBrowser) return;
	
	globals.browser.style.height = getBrowserHeight()  + "px";
	globals.tbBrowser.style.height = getBrowserHeight()  + "px";
	
	document.getElementById('panelMainDiv').height = window.innerHeight + "px";
	document.getElementById('loadingDiv').height = getBrowserHeight() + "px";
	
}

/**
 * center the loading indicator
 *
 */
function centerLoading() {
	if (!globals.browser || !globals.tbBrowser) return;
	
	var loadingDiv = document.getElementById('loadingDiv');
	var textDiv = document.getElementById('loadingDivText');
	var loadingDivSwf = document.getElementById('loadingDivSwf');
	
	if (textDiv && loadingDivSwf) {
		var loadingHeight = parseInt(loadingDivSwf.style.height);
		textDiv.style.top = ((getBrowserHeight() - loadingHeight) / 2) + "px";
	}
}

/**
 * update site name display (ellipses and tooltip)
 *
 */
function updateSiteNameDisplay() {
	// initialize the foot elements
	if (globals.adminContainerSize == -1 && globals.logoutContainerSize == -1) {
		globals.footerTableElement = document.getElementById("footerTable");
		globals.adminContainerSize = parseInt(document.getElementById("adminContainer").getComputedStyleProp("width"));
		globals.logoutContainerSize = parseInt(document.getElementById("logoutContainer").getComputedStyleProp("width"));
		globals.siteNameContainerElement = document.getElementById("siteNameContainer");
		globals.siteNameElement = document.getElementById("siteName");
		globals.siteNameTooltipElement = document.getElementById("siteNameTooltip");
	}
	
	var tableSize = parseInt(globals.footerTableElement.getComputedStyleProp("width"));
	var siteNameContainerSize = tableSize - globals.adminContainerSize - globals.logoutContainerSize;

	globals.siteNameElement.style.width = (siteNameContainerSize - 15) + "px";
	globals.siteNameContainerElement.style.width = siteNameContainerSize + "px";
	globals.siteNameTooltipElement.style.width = globals.siteNameElement.style.width;

	var siteName = MM.BC.SITE.getSiteName(MM.BC.SITE.getSiteID());
	var trimmedName = getSiteNameForDisplay(siteName, siteNameContainerSize);
	globals.siteNameElement.innerHTML = trimmedName;

	if (trimmedName != siteName) {
		globals.siteNameTooltipElement.setAttribute("alt", siteName);
	} else {
		globals.siteNameTooltipElement.setAttribute("alt", "");	
	}
};

/**
 * center loading indicator and update after panel resize
 *
 */
function updateDisplay() {
	updateBrowserDims();
	
	updateSiteNameDisplay();
	updateInfoElementsDimensions();	
	centerLoading();
}

/**
 * show loading state
 *
 */
function showLoadingState() {
	if (!globals.browser || !globals.tbBrowser) return;
	
	var loadingDiv = document.getElementById('loadingDiv');
	var textDiv = document.getElementById('loadingDivText');
	var loadingDivSwf = document.getElementById('loadingDivSwf');
	
	updateBrowserDims();

	// hide browser, as its always on top//
	globals.browser.style.display = "none";
	globals.tbBrowser.style.display = "none";
	
	// show loading//
	loadingDiv.style.height = getBrowserHeight() + "px"
	loadingDiv.style.display = "block";
	
	// show loading swf //
	loadingDivSwf.style.display = "";
	
	centerLoading();
}

/**
 * hide loading state
 *
 */
function hideLoadingState() {

	var loadingDiv = document.getElementById('loadingDiv');
	var loadingDivSwf = document.getElementById('loadingDivSwf');
	
	// show browser//
	globals.activeBrowser.style.display = "";
	
	// hide loading div//
	loadingDiv.style.display = "none";
	
	// hide loading swf as its always visible (even if its parent is not)//
	loadingDivSwf.style.display = "none";
	
	updateDisplay();
}

/**
 * this will get by DW called anytime the internet connection goes down or comes back up.
 *
 */
function onConnectionChanged(e) {
    if (!globals.initedUI)
        return;
		
    globals.activeSite = -1;
    selectionChanged();
}


MM.BC.insertCodeTimeout = -1;
/**
 * insert code in the current DW document
 *
 */

MM.BC.insertCodeWithTimeOut = function(code) {
	if (MM.BC.insertCodeTimeout != -1) {
		return;
	}

	MM.BC.insertCodeTimeout = setTimeout(function() {
		MM.BC.UTILS.insertCode(code); 
		MM.BC.insertCodeTimeout = -1;
	}, 150);
}

/**
 * called after online manager is loaded add endpoints and 
 *
 */
function initBCOnlineInterface() {
	try {
		
		if (globals.tbBrowser == null) {
			return;
		}

	
		// External pages use 'parentWindow' to call functions in browser ctrl's parent (us).
		globals.tbBrowser.getWindow().parentWindow = window; 
		var webKitWin = globals.tbBrowser.getWindowObj();
		var webKitDoc =  webKitWin.document;

		if (webKitWin.bcEndpoints) {
			if ("function" == typeof(webKitWin.bcEndpoints.setTypes)) {
				webKitWin.bcEndpoints.setTypes(MM.BC.CACHE.getBCTypes(MM.BC.SITE.getSiteID()));
			}
			webKitWin.bcEndpoints.openUrl = MM.BC.UI_UTILS.openPopupWindow;
			webKitWin.bcEndpoints.insertCode = MM.BC.insertCodeWithTimeOut; 
			webKitWin.bcEndpoints.onBrowseFile = MM.BC.UI_UTILS.onBrowseFile; 
			webKitWin.bcEndpoints.getCurrentDocumentPath = MM.BC.UI_UTILS.getCurrentDocumentPath;
			webKitWin.bcEndpoints.close = MM.BC.UI_UTILS.closeWindow;
			webKitWin.bcEndpoints.showRetry = function() {
				var message = dw.loadString('bc/infomessage/tryAgain');
				showRetryPage(message);
			};
		}

		// if its a redirect, hide loading state//

			hideLoadingState();

		
		MM.BC.BINDINGS.updateBindingsInPanel();		
		checkIfDocumentChanged(true);
	} catch (e) {
		MM.BC.log('onBrowserLoad error=' + e);
	}
}

/**
 * checks of the page load in the MMBrowser has failed
 *
 */
function checkIfLoadFailed(browser) {
	try {
		if (browser && browser.getHttpStatus() != 200) {
				globals.activeSite = -1;
				MM.BC.reportError(MM.BC.ERRORS.MM_BROWSER_LOAD_FAILED);
				return true;
			}
	} catch (e) {

	}
	return false;
}

var timeoutID;

/**
 * loads a html page in mmbrowser control
 *
 * @param String The URL to navigate to 
 * @param Boolean Whether or not the browser should reload if the new URL is the same as the current one
 * @param Function Function to call on page load
 * @param Boolean Whenther or not the loading state should be shown
 */
function browseTo(inURL, force, callback, showLoading, failCallback) {
	
	var activeBrowser = globals.activeBrowser;
	
	// show the browser div later to avoid white bug on mac//
	var browserDiv = document.getElementById("browserDiv");
	browserDiv.style.display = "block";
	
	
    var url = String(inURL);

    if (!force && (globals.curURL.toLowerCase() == url.toLowerCase())) {
        return;
    }
	
    cancelBrowse();
  // if any timout is active, clear it//
    if (timeoutID) {
		clearTimeout(timeoutID);
	}	
	
	// fail if we have no respone in 5 sec//
	globals.serverTimeout = function() {
	
			activeBrowser.removeEventListener("BrowserControlLoad", onBrowserControlLoad, false);
			hideLoadingState();
			MM.BC.reportError(MM.BC.ERRORS.MM_BROWSER_LOAD_FAILED);
		}
	
	// set timeout gives and nothing in context error if a function reference was used in set timeout//
	// add a general timeout, as some calls take ~1min until timeout (with no internet connection)//
	timeoutID = setTimeout('globals.serverTimeout()', MM.BC.CONSTANTS.TIMEOUT);
	
	
	function onBrowserControlLoad(e) {
		if (timeoutID) {
		clearTimeout(timeoutID);
		}
		
		if (checkIfLoadFailed(activeBrowser)) {
			if (failCallback) failCallback();
			return;
		}
		if (!showLoading) {
			hideLoadingState();
		}
		
		// clear the browser history so backspace won't work//
		activeBrowser.clearPageNavigationHistory();
		
		activeBrowser.removeEventListener("BrowserControlLoad", this, false);

		if (callback) callback();
	}
	
	activeBrowser.addEventListener("BrowserControlLoad", onBrowserControlLoad, false);
	activeBrowser.bcCancelBrowse = function(){
		try {

			if (timeoutID) {
				clearTimeout(timeoutID);
			}
			activeBrowser.removeEventListener("BrowserControlLoad", onBrowserControlLoad, false);
		} catch (e) {
		}
	}
	
	globals.curURL = url;
	activeBrowser.openURL(url);
};

/**
 * opens the partner portal in a new browser window
 *
 */
function openPartnerPortal() { 
    dw.browseDocument(dw.loadString("bc/url/PartnerPortalURL")); 
}

/**
 * stops the current browser
 *
 */
function stopLiveViews() {
    globals.activeBrowser.stopLiveView();

    gActiveLiveViewDOM = null;
}

/**
 * cancels the current browse process in the MMBrowser
 *
 */
function cancelBrowse() {
    if (globals.activeBrowser == null)
        return;

        globals.activeBrowser.stopPage();
	
	if (globals.activeBrowser.bcCancelBrowse) globals.activeBrowser.bcCancelBrowse();	
}

/**
 * before browser refresh - prevents refreshes
 *
 * @param Object The event object
 */
function onBeforeRefresh(e) {
    if (e.preventDefault) e.preventDefault();
}

/**
 * Called on the before navigation event of the MMbrowser 
 *
 * @param Object The event object
 */
function onBeforeNavigation(e) { 
	//for redirections, we always let them through. Stopping them could
    //drop important information even if we try to nav to the same url
    
    if (e.isRedirection) {
        return;
    }

    // set up a "static" variable to keep track of whether we already saw the "logout" page 
    if ( typeof(onBeforeNavigation.sawLogout) == "undefined") {
        onBeforeNavigation.sawLogout = false;
    }

	// Add code here to potentially intercept the incoming page
    // Did we get the "login again" page, for an expired token? That URL looks like this:
    if (e.requestedBrowserLocation && e.requestedBrowserLocation.toLowerCase().indexOf("a=logout") != -1) {
        if (onBeforeNavigation.sawLogout) {
            // This is the 2nd time in a row we saw it, meaning the retry failed, so the user really has to log in again.
            onBeforeNavigation.sawLogout = false;
            globals.activeSite = -1;
            MM.BC.reportError(MM.BC.ERRORS.SESSION_TIMEOUT);
        } else {
            // the first time we see this, just try again with blank site token, to refresh the site token.
            onBeforeNavigation.sawLogout = true;
            MM.BC.TOKENS.clearAllTokensForSite(globals.activeSite);
            globals.activeSite = -1;
            startOnlineOperations();
        }
    } else {
        // clear the flag
        onBeforeNavigation.sawLogout = false;
    }

}

/**
 * Called by DW when the panel is refreshed
 *
 */
function onRefresh() {
    if (!globals.initedUI) {
        initUI();
    }
}

/**
 * Lauhch the login window and do nothing after the user logs in
 *
 */
function launchLoginAndClose() {
	dw.setPreferenceString(MM.BC.CONSTANTS.PREFERENCE_SECTION_BC, MM.BC.CONSTANTS.PREFERENCE_KEY_BC_DIALOG_STATE, "login"); 	
    dw.loadCSXSExtension("com.adobe.dwimsconnection");
}

/**
 * Launch the BC Login dialog, but let it do what it wants after login
 *
 */
function launchLogin() {
	dw.loadCSXSExtension("com.adobe.dwimsconnection");
}

/**
 * clear logged in data, and display log in state
 *
 */
function logOut() {
	// hide loading state if any//
	hideLoadingState();
	
	var siteID = MM.BC.SITE.getSiteID();
	var genericToken = MM.BC.TOKENS.getGenericToken();
	
	MM.BC.log('logging out --- ' + genericToken);
	MM.BC.API.deleteGenericToken(genericToken, logOutLocally, onDeleteTokenFail);
	
	function onDeleteTokenFail() {
		MM.BC.reportError(MM.BC.ERRORS.XHR_FAILURE);
	}
}

/**
 * does the local logout operation (without attempting to delete the generic token from the server)
 *
 */
function logOutLocally() {
	MM.BC.activeSite = -1;
	
	// clean tokens, so we get new ones on login//
	MM.BC.TOKENS.clearAllTokens();
	
	// reset //
    dw.setPreferenceString(MM.BC.CONSTANTS.PREFERENCE_SECTION_BC, MM.BC.CONSTANTS.PREFERENCE_KEY_BC_LOGIN_TOKEN, "");
	// XXX VIC OCT 21 - THIS WILL CHANGE TO AN INT AFTER THE EXTENSION IS IN THE DAILY BUILD//
    dw.setPreferenceString(MM.BC.CONSTANTS.PREFERENCE_SECTION_BC, MM.BC.CONSTANTS.PREFERENCE_KEY_BC_STAY_LOGGED_IN, "");
    
	// show login state //
	showLoginPage();
}

/**
 * Called when the "login" or "logout" link in the panel footer is clicked
 *
 */
function doLogInOrOut() {
	// if is logged in, we should log out//
    if (MM.BC.isLoggedIn()) {
        logOut();
        dw.bcLog("logout");
    } else {
        // show the login dialog (not the login page)//
        launchLoginAndClose();
    }
}


/**
 * Decides whether or not the welcome screen shoud be skipped
 *
 * @return Boolean Whether or not the welcome screen shoud be skipped
 */
function shouldSkipWelcome() {
	 var skipWelcome = dw.getPreferenceString(MM.BC.CONSTANTS.PREFERENCE_SECTION_BC, MM.BC.CONSTANTS.PREFERENCE_KEY_BC_SKIP_WELCOME, "");
	 return skipWelcome != "";
}

/**
 * Shows the welcome state
 *
 */
function showWelcomePage(showOffline) {
	var welcomeURL;

	globals.activeBrowser = globals.browser;
	globals.tbBrowser.style.display = "none";
	globals.activeBrowser.style.display = "none";

	setupWebKitGlobals();

	if (dw.isConnectedToInternet() && !showOffline) {
		// online welcome page//
		welcomeURL = dw.loadString("bc/url/BCPanelWelcomeURL");
	} else {
		// offline welcome page//
		welcomeURL = MM.BC.CONSTANTS.BC_LOCAL_WELCOME_PAGE;
	}
	
	function initWelcome() {
		setupWebKitGlobals();
		if (globals.webKitWin.bcEndpoints) {
		initGetStartedButton();
		
		setString("paragraph1", "bc/welcome/paragraph1");
		setString("paragraph2", "bc/welcome/paragraph2");
		setString("getStartedButton", "bc/buttonText/getStarted");
		
		hideLoadingState();
			globals.activeBrowser.style.display = "";
		
		if (welcomeURL == MM.BC.CONSTANTS.BC_LOCAL_WELCOME_PAGE) {
			updateBgColor();
		}
	}
	}
		
	function onlineWelcomeLoadFail() {
		showWelcomePage(true);
	}
		
	if (globals.curURL != welcomeURL) {
		globals.activeBrowser.style.display = "none";
		showLoadingState();
		browseTo(welcomeURL, true, function(e) {
			initWelcome();
		}, false, onlineWelcomeLoadFail);
	} else {
		initWelcome();
	}
	
	updateFloaterUI(false, false); 
}


/**
 * Shows a state in the panel
 *
 * @param Strign The name of the state
 */
function showState(state) {
	setupWebKitGlobals();
	if (globals.webKitWin.showState) {
	globals.webKitWin.showState(state);
}
}

/**
 * Changes a string into a web page that is loaded into the MMBrowser by 
 * calling the setString function that must be defined in the loaded page
 *
 * @param String The ID of the elements that should hold the text
 * @param String The text that should be displayed (this will be set as innerHTML for the element)
 */

function setString(elementID, stringID) {
    setupWebKitGlobals();
	
	var newText = dw.loadString(stringID);
	if (globals.webKitWin && globals.webKitWin.setString) {
		globals.webKitWin.setString(elementID, newText);
	}
}

/**
 * called when the generic info page is loaded. Here we set the text on the page
 *
 * @param String The message
 */
function displayInfoText(newMessage) {
	globals.webKitWin = globals.activeBrowser.getWindowObj();
	if (globals.webKitWin.setString) {
	globals.webKitWin.setString("staticTextArea", newMessage);
}
}

/**
 * update active browser bg color 
 *
 */
function updateBgColor() {
	try {
		if (!globals.webKitWin || !globals.webKitWin.document || !globals.webKitWin.document.body) return;
		var loadingBody = globals.webKitWin.document.body;
		if (loadingBody) loadingBody.style.backgroundColor = globals.backgroundColor;
	} catch (e) {
	}
}

/**
 * load the info page
 *
 * @param String The message
 */
function showInfoPage(message, hideLogout) {
	try {	
		cancelBrowse();
		MM.BC.API.cancelApis();
	} catch (e) {
	}	
	var infoPage = MM.BC.CONSTANTS.BC_LOCAL_PAGE;
	
	globals.activeBrowser = globals.browser;
	globals.tbBrowser.style.display = "none";
	globals.activeBrowser.style.display = "";
	
	setupWebKitGlobals();
	
	function showInfo() {
		showState('info');
		displayInfoText(message);
		updateInfoElementsDimensions();
		hideLoadingState();
		updateBgColor();
	}
	
	if (globals.curURL != infoPage) {
		browseTo(infoPage, true, function() {
			globals.webKitWin.openPartnerPortal = openPartnerPortal; 
			showInfo()
		});
	} else {
		globals.webKitWin.openPartnerPortal = openPartnerPortal; 
		showInfo()
	}
	
	// want user to be able to log out of bc, but don't show site name, in case there isn't a valid one
	updateFloaterUI(false, !hideLogout); 
}

/**
 * load the retry page
 *
 * @param String The message
 */
function showRetryPage(message) {
	try {	
		cancelBrowse();
		MM.BC.API.cancelApis();
	} catch (e) {
	}
	var retryPage = MM.BC.CONSTANTS.BC_LOCAL_PAGE;
	
	globals.activeBrowser = globals.browser;
	globals.tbBrowser.style.display = "none";
	globals.browser.style.display = "";

	globals.activeSite = -1;
	
	function initRetry(message) {
		showState('retry');
		setString("retryButton", "bc/buttonText/retry");
		initRetryButton();
		displayInfoText(message);
		hideLoadingState();
		
		updateBgColor() 
	}
	
	if (globals.curURL != retryPage) {
  	   browseTo(retryPage, true, function() {
		initRetry(message);
	   });
	} else {
		initRetry(message);
	}
	
	updateFloaterUI(false, false);
}

/**
 * load the login page
 *
 */
function showLoginPage() {
	try {	
		cancelBrowse();
		MM.BC.API.cancelApis();
	} catch (e) {
	}
	var loginPage = MM.BC.CONSTANTS.BC_LOCAL_PAGE;
	
	globals.activeBrowser = globals.browser;
	globals.tbBrowser.style.display = "none";
	globals.activeBrowser.style.display = "";

	globals.activeSite = -1;
	
	
	function initLogin() {
		showState('login');
		setString("welcomeLogin", "bc/uistring/welcomeLogin");
		setString("staticTextArea", "bc/uistring/pleaseLogin");
		setString("loginButton", "bc/buttonText/login");
		initLoginButton();
		hideLoadingState();
		
		updateBgColor();
    }
	
	if (globals.curURL != loginPage) {
	browseTo(loginPage, true, initLogin);
	} else {
		initLogin();
	}
	
	
	updateFloaterUI(false, false);
}


function getStarted() {
	launchLogin();
}

function goToUrl(url) {
	dw.browseDocument(url);
}

/**
 *  Add a click listener on the get started button in the welcome page
 * (or the retry button in the offline version
 *
 */
function initGetStartedButton() {
    setupWebKitGlobals();
	
    // The online welcome page has a getStarted button, to login, etc.
    var getStartedButton = globals.webKitDoc.getElementById("getStartedButton");
	
    if (getStartedButton) {
        getStartedButton.addEventListener("click", launchLogin);
	}
	
	if (globals.webKitWin && globals.webKitWin.bcEndpoints) {
		globals.webKitWin.bcEndpoints.getStarted = getStarted;
		globals.webKitWin.bcEndpoints.goToUrl = goToUrl;
	}
		
    // The offline/local welcome page has a "retry" button, which will try loading the welcome page again
    var retryButton = globals.webKitDoc.getElementById("retryButton");
    if (retryButton) {
        retryButton.addEventListener("click", function () { 
			selectionChanged(); 
	});
	updateFloaterUI(false, false);
}

}

/**
 * Add a click listener on the login button
 *
 */
function initLoginButton() {
    setupWebKitGlobals();
	
    var loginButton = globals.webKitDoc.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", launchLoginAndClose);
    }
}



/**
 * Add a click listener on the retry button
 *
 */
function initRetryButton() {
    setupWebKitGlobals();
	
    var retryButton = globals.webKitDoc.getElementById("retryButton");
    if (retryButton) {
        retryButton.addEventListener("click", retryServerCalls);
    }
}

/**
 * Updates the dimensions of the boxes showing info messages in the 
 * panel to the new panel dimensions. This is a workaround to the fact that 
 * the panel sometimes does not update the browser inside of it to it's new 
 * dimensions (even if the browser has width 100%)
 */
function updateInfoElementsDimensions() {
	if (globals.browser.style.display == "none") return;
	
	var win = globals.browser.getWindowObj();
	var doc = win.document;

	if (doc.getElementById) {
		var infoDiv = doc.getElementById('info');
		var retryDiv = doc.getElementById('retry');
		var loginDiv = doc.getElementById('login');
		
		var maxBoxWidth = (window.innerWidth - 30) + "px";
		
		if (infoDiv) {
			infoDiv.style.width = maxBoxWidth;
		}
		
		if (retryDiv) {
			retryDiv.style.width = maxBoxWidth;
		}
		
		if (loginDiv) {
			loginDiv.style.width = maxBoxWidth;
		}				
	}
}


/**
 * This function hides/shows the sitename and login/logout text at the bottom of the panel.
 *
 * @param Boolean Show the site name in the footer
 * @param Boolean Show the login/logout link in the footer
 */
function updateFloaterUI(showSite, showLogin) {
    if (!globals.initedUI) {
		initUI();
		return;
	}

	if (showSite || showLogin) {
		globals.emptyFooter.style.display = "none";
	} else {
		globals.emptyFooter.style.display = "block";
	}
}

/**
 * Reports an error
 *
 * @param Object obj The object to be serialized
 * @return String The object serialized
 */	
MM.BC.reportError = function(errorCode, statusCode) {
	var error = reportError(errorCode, statusCode);
	// if the bc panel doesn't exists, show an alert (maybe we show open it ??)//
	// this is posible when we make the calls from the inspector//
	if (!MM.BC.PANEL_EXISTS) {
		alert('' + error);
	}
}

/**
 * init floater ui
 *
 * @param Object obj The object to be serialized
 * @return String The object serialized
 */
// Call this function from a page loaded in the browser control to tell us
// about an error.
//  errorCode   - identifies which error
//  statusCode  - additional info the page can tell us, that we'll send back
//                to the page if the user tells us to "retry", so the page
//                can know; for example, what state it was in when it hit
//                the error condition.
function reportError(errorCode, statusCode) {
	 // get ready to display statusCode, too, which is optional//
    if (statusCode == undefined) {
        statusCode = 0;
	}
	
	// if any error hide loading state//
	try {
		if (MM.BC.PANEL_EXISTS) {
			hideLoadingState();
		}
	} catch (e) {
	}
	
	var message = "";
	
	switch(errorCode) {
		case MM.BC.ERRORS.SESSION_TIMEOUT :
			// display the login page with the session expired message
			message = dw.loadString('bc/loginmessage/sessionExpired');
			if (MM.BC.PANEL_EXISTS) {
				// display the login page with the appropriate message
				logOutLocally();
			}
		break;
		
		case MM.BC.ERRORS.DW_PAGE_LOAD_ERROR :
		case MM.BC.ERRORS.PARSING_ERROR :
		case MM.BC.ERRORS.MM_BROWSER_LOAD_FAILED :
		case MM.BC.ERRORS.XHR_FAILURE :
		case MM.BC.ERRORS.PARSING_ERR :
		case MM.BC.ERRORS.INVALID_SITEID :
		case MM.BC.ERRORS.INTERNET_CONNECTION_FAILED :
			message = dw.loadString('bc/infomessage/tryAgain');
			if (MM.BC.PANEL_EXISTS) {
				// include errcode temporarily for testing //
				showRetryPage(message);
			}
		break;
		case MM.BC.ERRORS.TRIAL_SITE_EXPIRED : 
			message = dw.loadString('bc/infomessage/siteExpired');
			showInfoPage(message);
			dw.bcLog("trialExpired");
		break;
		default :
			if (MM.BC.PANEL_EXISTS) {
				message = 'unknown error; errorCode: ' + errorCode + ', statusCode: ' + statusCode;
				// display appropriate page for any additional errors here//
				showRetryPage(message);
			}
		break;
	}
	
	if (errorCode == MM.BC.ERRORS.XHR_FAILURE) dw.bcLog("xhrErr");
	if (errorCode == MM.BC.ERRORS.PARSING_ERR) dw.bcLog("parseErr");
	
	return message;
}



/**
 * Check if workspace has changed
 *
 */
function workspaceChanged() {
	var fileWorkspace = DWfile.read(MM.BC.CONSTANTS.CURRENT_WORKSPACE);
	if (globals.currentWorkspace != fileWorkspace) {
		globals.currentWorkspace = fileWorkspace;
		return true;
	}
	return false;
}
/**
 * Called by DW when the panel is showed
 *
 */
function onShow() {
MM.BC.log('onShow');
 try {

		if (workspaceChanged()) {

	MM.BC.activeSite = -1;
	globals.activeSite = -1;
	globals.curURL = "";
			
        loadLoadingPage();
			
	// force the api browser to reload page//
	MM.BC.forceDocumentBrowserLoad = true;
		}
		
	selectionChanged();
	
} catch (e) {

}
}

/**
 * Called by DW when the panel is hidden
 *
 */
function onHide() {

}

/**
 * Called by DW when the "help" item in the panel menu is clicked
 *
 */
function displayHelp() {
    dwscripts.displayDWHelp(MM.HELP_bcPanel);
}

/**
 * Gets the initial size depending on the platform
 *
 * @param String The platform (windows or mac)
 * @return String The width and height separated by a comma
 */
function initialSize(platform) {
    var maxInitialSize = dw.getMaxPanelSize();

    var screenHeight = maxInitialSize[1];
    var height = globals.initialPanelHeight;
    var width = globals.initialPanelWidth;

    if (screenHeight < globals.initialPanelHeight + globals.windowChromeSize)
        height = screenHeight - globals.windowChromeSize;

	if (platform.indexOf('macintosh') != -1)
		width = globals.initialPanelWidthMac;
	
    return width + "," + height;   // OWL adds ~38 px of chrome to the height         
}

/**
 * return minimum width, height for the panel
 *
 * @param String The platform (windows or mac)
 * @return String The minimum width and height separated by a comma
 */
// 
function minSize(platform) {
	var minWidth = globals.minPanelWidth;
	if (platform.indexOf('macintosh') != -1)
		minWidth = globals.minPanelWidthMac;
	return minWidth + "," + globals.minPanelHeight;
}

/**
 * Called by DW when the panel is resized
 *
 */
function onResize() {
	MM.BC.log('onResize');
    
	if (!globals.initedUI)
        return;
    
	updateDisplay();
};

/**
 * Retrieves the best site name (including ellipsis) that is estimated to fit in the given size
 *
 * @param siteName The site name
 * @param size The size in pixels were site name should fit
 */
function getSiteNameForDisplay(siteName, size) {
	if (!siteName || !siteName.length) {
		return siteName;
	}

	if (!globals.siteNameDensityHash[siteName]) {
		globals.siteNameDensityHash[siteName] = getSiteNameDensity(siteName);
	}
	
	// The maximum no of chars for the given size
	var maxNoChars = parseInt(size / globals.siteNameDensityHash[siteName]);

	// Wee added ellipsis without any reason, the label fits anyway
	if (maxNoChars > siteName.length) {
		return siteName;
	}

	return siteName.substring(0, maxNoChars - 3) + "...";
};

/**
 * Retrieves the current average density in pixels for each letter in the site name, rendered using required font face and size
 *
 * @param siteName The site name
 * @returns The density
 */
function getSiteNameDensity(siteName) {
	// Re-create the sample element so that it gets the exact size, and is not affected by any previous calculation
	var sample = document.getElementById("sample");
	sample.outerHTML = "<div id=\"sample\">" + siteName + "</div>";

	return parseInt(sample.getComputedStyleProp("width") / siteName.length * 1.2);
};
