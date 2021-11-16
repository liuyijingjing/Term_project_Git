/*
 Copyright 2011 Adobe Systems Incorporated
 All Rights Reserved.
 NOTICE:  All information contained herein is, and remains
 the property of Adobe Systems Incorporated and its suppliers,
 if any.  The intellectual and technical concepts contained
 herein are proprietary to Adobe Systems Incorporated and its
 suppliers and are protected by trade secret or copyright law.
 Dissemination of this information or reproduction of this material
 is strictly forbidden unless prior written permission is obtained
 from Adobe Systems Incorporated.
*/
var globals = {
    browser : "",
    webKitWin : "",
    webKitDoc : "",
    initedUI : false,
    curURL : "",
    moduleID : "",
    editMode : false,
    moduleCode : "",
    editorPage : "/Floaters/BCLocalPage.html",
    localPage : MM.BC.getConfigurationPath() + "/Floaters/BCLocalPage.html",
    width: "850",
    height: "585",
    targetURL: "",
    apisReady : 1,
    activeDocURL : "",
    appVer : dw.appVersion
};

// ----------------------------------- DW COMMAND FUNCTIONS ------------------------------------------

/**
 * Take the command arguments and put them into the globals object
 *
 */
function receiveArguments(page, width, height, operation) {
	
	MM.BC.FOCUS_BEFORE_COMMAND_OPEN = dw.getFocus();
	
	globals.editorPage = page;
	if (operation == "edit") {
		globals.editMode = true;
	}
	if (width && height && width != "" && height != "") {
		globals.width = width;
		globals.height = height;
	}
}

function isDOMRequired() {
	return true;
}
/**
 * Return the window dimensions from the globals
 *
 * @param String The platform
 * @return Strign Width and height separated by a comma
 */
function windowDimensions(platform) {
	return globals.width + "," + globals.height;
}


/**
 * load loading html inside loading browser
 *
 */
function loadLoadingPage() {
	var loadingBrowser = document.getElementById("bc_loading");
	
	
	function loadingBrowserLoad(e) {
		MM.BC.log('loading browser loaded');
		
		
		var col = dw.getPanelColor();
		
		loadingBrowser.style.backgroundColor = "#" + MM.BC.UTILS.RGB2HTML(col[0], col[1], col[2]);
		
		var loadingWin = loadingBrowser.getWindowObj();
		var loadingDoc = loadingWin.document;
		
		loadingDoc.getElementsByTagName('body')[0].style.backgroundColor = "#" + MM.BC.UTILS.RGB2HTML(col[0], col[1], col[2]);
		loadingDoc.getElementById('loadingDivMsg').innerHTML = dw.loadString('bc/message/contactingServer');
				
		loadingBrowser.style.display = "";
		
	}
	
	loadingBrowser.addEventListener("BrowserControlLoad", loadingBrowserLoad, false);	
	
	loadingBrowser.openURL(dw.getUserConfigurationPath() + "Floaters/BCLoading.html");	
}

/**
 * Caled when the dialog is unloaded
 *
 */
function unload() {
	if (globals.browser && globals.browser.bcCancelBrowse) {
		globals.browser.bcCancelBrowse();
		cancelBrowse();
	}
}

/**
 * Initialize the browser control and setup the dialog
 *
 */
function initUI() {
	logMessage(REP_ITEM_NOTE, "bc_configure_edit", "calling initUI --- " + globals.editorPage);
	// get panel color//
	var col = dw.getPanelColor();
	var backgroundColor = MM.BC.UTILS.RGB2HTML(col[0], col[1], col[2]);
	var loadingDiv =  document.getElementById("loadingDiv");
	
	var cancel_btn = document.getElementById("cancelBtn");
	var cancel_btn_container = document.getElementById("cancelBtnContainer");
	cancel_btn_container.style.width = cancel_btn.style.width;
	
	loadLoadingPage();	 
	
	loadingDiv.style.width = globals.width + "px";
	loadingDiv.style.height = globals.height + "px";
	
	loadingDiv.style.backgroundColor = "#" + backgroundColor;
	
	// Setup the browser control.
	globals.browser = document.getElementById("bc_priority_browser");	
	globals.browser.setAutomaticallyPromptForCredentials(false);
	globals.browser.style.top = "0px";
	globals.browser.style.left = "0px";
	globals.browser.style.width = window.innerWidth + "px";
	globals.browser.style.height = (window.innerHeight - 55) + "px";
	// add general listeners on browser control//
	if (globals.browser && globals.browser.addEventListener) {
		globals.browser.addEventListener("BrowserControlBeforeNavigation", function (e) { onBeforeNavigation(e); }, false);
		globals.browser.addEventListener("BrowserControlBeforeRefresh", function(e) { e.preventDefault(); }, false);
	}
	
	globals.initedUI = true;

	// get the module code//
	var dom = dw.getDocumentDOM();
	var sel = dom.getSelection();
	if (globals.editMode) {
		globals.moduleCode = dom.documentElement.outerHTML.substring(sel[0], sel[1]);
	}
	globals.targetURL = globals.editorPage;
	// show loading state//
	showLoadingState();
	// if we have a site token//
	if (MM.BC.TOKENS.getSiteToken(MM.BC.SITE.getSiteID())) {
		// if we don't have a site token, start api calls//
		browseTo(MM.BC.CONSTANTS.BC_LOCAL_PAGE, true, function() {
			// load module editor page//
			loadModuleEditorPage();		
		}, true);
	} else {
		// if we don't have a site token, start api calls//
		browseTo(MM.BC.CONSTANTS.BC_LOCAL_PAGE, true, function() {
			startAPIProcesses(MM.BC.TOKENS.getGenericToken(), MM.BC.SITE.getSiteID());
		}, true);
	}
}
		
/**
 * Loads the web page inside the MMBrowser control
 *
 */
function loadModuleEditorPage() {
	MM.BC.TOKENS.getOneTimeToken(MM.BC.SITE.getSiteID(), function (oneTimeToken) {
		var completeUrl = MM.BC.UTILS.generateURL(globals.targetURL, oneTimeToken);

		browseTo(completeUrl, true, function() {
			onModuleEditorLoad()
		}, false);
	}, function(status) {
		//MM.BC.log('loadModuleEditorPage##error##showCallFailed', true);
		showCallFailed();
	}, true);
}

function showCallFailed() {
//	MM.BC.log('##showCallFailed', true);
	var msg = dw.loadString('bc/infomessage/tryAgain');
//	if (globals.webKitWin && globals.webKitWin.alert) {
//		globals.webKitWin.alert(msg);
//	}
//	window.close();
	showRetryPage(msg);
}

/**
 * Called when the module editor page is loaded
 *
 */
function onModuleEditorLoad() {
	if (globals.editMode) {
		setEditCode(globals.moduleCode);
	}
}

// -------------------------- DW <-> LOADED PAGE CONNECTION FUNCTIONS ----------------------------


function setWindowButtons(code) {
	var buttonsHTML = (code != undefined) ? code : globals.webKitWin.bcEndpoints.loadCommandButtons();
	var buttonsContainer = document.getElementById("dynamicButtons");
	
	if (buttonsContainer) {
		buttonsContainer.innerHTML = "";
		if (buttonsHTML != null && buttonsHTML != "") {
			buttonsHTML = buttonsHTML.replace(/(\W)window./gi, '$1globals.webKitWin.');
			buttonsContainer.innerHTML = buttonsHTML;
		}
	}	
}

/**
 * Connects to the hooks in the web page once it is loaded
 *
 */
function addDWOperationFunctions() {
	try {
		MM.BC.log(' ---- adding dw operations ---- ')
		if (globals.webKitWin.bcEndpoints) {
			globals.webKitWin.bcEndpoints.openUrl = MM.BC.UI_UTILS.openPopupWindow;
			globals.webKitWin.bcEndpoints.insertCode = function(code) {
				window.close(); 
				MM.BC.codeToInsert = code;
	            if (typeof (dw.bcLog) == "function") {
	                dw.bcLog("insert");
	            }
			}; 
			globals.webKitWin.bcEndpoints.onBrowseFile = onBrowseFile; 
			globals.webKitWin.bcEndpoints.closePopup = closePopup;
			globals.webKitWin.bcEndpoints.getCurrentDocumentPath = MM.BC.UI_UTILS.getCurrentDocumentPath;
			globals.webKitWin.bcEndpoints.showRetry = showCallFailed;
			
			setWindowButtons();
			
			// Set focus to the small browser so the next tab key drills into the elements within//
			if (globals.browser) globals.browser.focus();
		}
	
	
	} catch (e) {
		logMessage(REP_ITEM_NOTE, 'addDWOperationFunctions', 'error connecting to the web page end points');
	}
}
/**
 * called from the web page to open the DW browser window
 *
 */
function onBrowseFile(inputId, filtersString) {
	var activeURL = globals.activeDocURL;
	var siteRoot = dw.getSiteRoot();
	if (filtersString && filtersString != "" && filtersString != undefined && globals.appVer.toLowerCase().indexOf('mac') == -1) {
		var filters = MM.BC.JSON.parse(filtersString);
		var dwFilters = new Array();
		var filterStr = "";
		for (var i=0;i<filters.length;i++) {
			filterStr = filters[i].label + "|" + filters[i].mask + "||";
			dwFilters.push(filterStr);
		} 
		
		var path = dw.browseForFileURL("select", "", false, false, dwFilters);
	} else {
		var path = dw.browseForFileURL();
	}
	if (globals.webKitWin && globals.webKitWin.bcEndpoints && globals.webKitWin.bcEndpoints.onFileSelect) {
		var absPath = path;
		if (path.indexOf('/') != 0) {
			absPath = dw.relativeToAbsoluteURL(activeURL, siteRoot, path).replace(siteRoot, '/');
		}
		globals.webKitWin.bcEndpoints.onFileSelect(inputId, absPath);
	}
}
/**
 * calls the "loadModule" function in the page to populate the module edit form
 *
 * @param String The module code
 */
function setEditCode(code) {
	logMessage('browser load', 'module code', 'code passed to loadModule --- ' + code);	
	globals.webKitWin.bcEndpoints.loadModule(code);
}
/**
 * cloases the modal window (called from the web page)
 *
 */
function closePopup() {
	window.close();
}
// -------------------------- BROWSER CONTROL FUNCTIONS ------------------------

function setupWebKitGlobals() {
    globals.browser = document.getElementById('bc_priority_browser');
    if (globals.browser) {
		globals.webKitWin = globals.browser.getWindowObj();

    	// always set the doc, since it probably changed
    	globals.webKitDoc = globals.webKitWin.document;
    	
    	globals.browser.setAutomaticallyPromptForCredentials(false);
    }
}

// check if the loaded page is a local 404 page//
function checkIfLoadFailed() {
	setupWebKitGlobals();
	
	try {
		if (globals.browser && globals.browser.getHttpStatus() != 200) {
				showCallFailed();
				return true;
			}
	} catch (e) {

	}
	
	return false;
}

var timeoutID;

/**
 * loads a html page in mmbrowser control//
 *
 * @param String The URL to navigate to
 * @param Boolean Whether or not the page shold we reloaded (if the current URL is same as the destination URL)
 * @param Function Function to call when the page is loaded
 * @param Boolen Whether or not the loading indicator should be shown
 */
function browseTo(inURL, force, callback, showLoading) {

	// show the browser div later to avoid white bug on mac//
	var browserDiv = document.getElementById("browserDiv");
	browserDiv.style.display = "block";
	
	
    if (globals.browser == null) {
        globals.browser = document.getElementById("bc_priority_browser");
	}
	
    var url = String(inURL);
    if (!force && (globals.curURL.toLowerCase() == url.toLowerCase())) {
        return;
    }
	// if any timout is active, clear it//
    if (timeoutID) {
		clearTimeout(timeoutID);
	}
	cancelBrowse();

	// fail if we have no respone in 5 sec//
	globals.serverTimeout = function() {
		if (globals.browser) {
			globals.browser.removeEventListener("BrowserControlLoad", onBrowserControlLoad, false);
			hideLoadingState();
			showCallFailed();
		}
	}
	
	// add a general timeout, as some calls take ~1min until timeout (with no internet connection)
	timeoutID = setTimeout("globals.serverTimeout()", MM.BC.CONSTANTS.TIMEOUT);
	
	function onBrowserControlLoad(e) {
		clearTimeout(timeoutID);
		
		if (checkIfLoadFailed()) {
			return;
		}
		
		if (!showLoading) {
			hideLoadingState();
		}

		// call the generic callback//
		onBrowserLoad(e);
		globals.browser.removeEventListener("BrowserControlLoad", this, false);
		if (callback) callback();
	}
	
	globals.browser.bcCancelBrowse = function(){
		try {
			if (timeoutID) {
				clearTimeout(timeoutID);
			}
			if (globals.browser) {
				globals.browser.removeEventListener("BrowserControlLoad", onBrowserControlLoad, false);
			}
		} catch (e) {
		}
	}
	
	globals.browser.addEventListener("BrowserControlLoad", onBrowserControlLoad, false);
    globals.curURL = url;
	globals.browser.openURL(url);
};

/**
 * called when the browser load is complete
 *
 */
function onBrowserLoad(e) {
	logMessage('edit mode', 'browser load', 'on browser load');

	globals.activeDocURL = dw.getActiveWindow().URL;
    if (globals.browser == null) {
        return;
    }
    // allow the loaded doc to call something here
    globals.webKitWin = globals.browser.getWindowObj();
	logMessage('edit mode', 'edit mode', globals.editMode);
	
	// clear the browser history so backspace won't work//
	globals.browser.clearPageNavigationHistory();
	
	addDWOperationFunctions();
}

/**
 * Called on the before navigation event of the MMBrowser
 *
 */
function onBeforeNavigation(e) {
	if ( typeof(onBeforeNavigation.sawLogout) == "undefined") {
		onBeforeNavigation.sawLogout = false;
	}
	
	showLoadingState();
	
	setWindowButtons("&nbsp;");
	
	if (e.requestedBrowserLocation) {
		if (e.requestedBrowserLocation.toLowerCase().indexOf("a=logout") != -1) {
		if (onBeforeNavigation.sawLogout) {
			logMessage(REP_ITEM_NOTE, "onBeforeNavigation", "sawLogout TRUE, so force relogin");
			// This is the 2nd time in a row we saw it, meaning the retry failed, so the user really has to log in again.
			onBeforeNavigation.sawLogout = false;
			reportError(bcCommon.ERR_SESSION_TIMEOUT);
			window.close();
			MM.BC.launchLogin();
		} else {
			// the first time we see this, just try again with blank site token, to refresh the site token.
			logMessage(REP_ITEM_NOTE, "onBeforeNavigation", "sawLogout FALSE, so retry w/o site token");
			cancelBrowse();
			
			browseTo(MM.BC.CONSTANTS.BC_LOCAL_PAGE, true, function() {
				startAPIProcesses(MM.BC.TOKENS.getGenericToken(), MM.BC.SITE.getSiteID());
			}, true);

				
			onBeforeNavigation.sawLogout = true;
		}
	} else {
		// clear the flag
		if (e.requestedBrowserLocation.indexOf(MM.BC.CONSTANTS.BC_LOCAL_PAGE) == -1) {
			onBeforeNavigation.sawLogout = false;
		}
	}	
}
}


/**
 * load the retry page
 *
 * @param String The message
 */
function showRetryPage(message) {
	try {	
		cancelBrowse();
	} catch (e) {
	}
	
	var retryPage = MM.BC.CONSTANTS.BC_LOCAL_PAGE;
	
	function initRetry(message) {
		showState('retry');
		setString("retryButton", "bc/buttonText/retry");
		initRetryButton();
		displayInfoText(message);
		hideLoadingState();
	}
	
	if (globals.curURL != retryPage) {
  	   browseTo(retryPage, true, function() {
		initRetry(message);
	   });
	} else {
		initRetry(message);
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
	setupWebKitGlobals();
	
	if (globals.webKitWin.setString) {
	globals.webKitWin.setString("staticTextArea", newMessage);
}
}

/**
 * Add a click listener on the retry button
 *
 */
function initRetryButton() {
    setupWebKitGlobals();
	
	if (globals.webKitDoc.getElementById) {
	    var retryButton = globals.webKitDoc.getElementById("retryButton");
	    if (retryButton) {
	        retryButton.addEventListener("click", retryServerCalls);
	    }
    }
}

function retryServerCalls() {
	MM.BC.log('retrying');
	hideLoadingState();
	initUI();
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
 * stop any current page load
 *
 */
function cancelBrowse() {
    if (globals.browser == null)
        return;
    if (globals.browser.getPageBusy())
        globals.browser.stopPage();
}

// ----------------------------- API RELATED FUNCTIONS -----------------------------

/**
 * handles the calls to the BC APIs in case the auth tokens are expired (or we don't have them yet)
 *
 * @param String the generic token
 * @siteID String the current site ID
 */
function startAPIProcesses(genericToken, siteID) {
	if (!globals.browser) return;
	if (!globals.webKitWin) {
		globals.webKitWin = globals.browser.getWindowObj();
	}
	function getSiteToken() {
		MM.BC.API.getSiteToken(siteID, genericToken, function(token) {
			MM.BC.TOKENS.setSiteToken(siteID, token); 
			MM.BC.API.getSiteData(siteID, token, function() {
				loadModuleEditorPage();
			}, function (status) {
				showCallFailed();
			});
		}, function(status) {
			showCallFailed();
		});
	}
	
	MM.BC.API.getSitesList(genericToken, function(sites) {
		if (sites.items) {
			MM.BC_CACHE.SITES_LIST = sites.items;
		} else {
			//logMessage(REP_ITEM_NOTE, 'get site list', 'site list is empty');
		}
		getSiteToken();
	}, function(status) {
		showCallFailed();
	});
}

// --------------------- LOADING SCREEN RELATED FUNCTIONS ----------------------------

/**
 * centers the loading indicator
 *
 */
function centerLoading() {
	if (!globals.browser) return;
	var textDiv = document.getElementById('loadingDivText');
	var loadingDivSwf = document.getElementById('loadingDivSwf');
	if (textDiv && loadingDivSwf) {
		var loadingHeight = parseInt(loadingDivSwf.style.height);
		textDiv.style.top = ((globals.height - loadingHeight) / 2) + "px";
	}
}

function updateDisplay() {
centerLoading();
}

/**
 * shows the loading state
 *
 */
function showLoadingState() {
	if (!globals.browser) return;
	var loadingDiv = document.getElementById('loadingDiv');
	var loadingDivSwf = document.getElementById('loadingDivSwf');
	
	var browserDiv = document.getElementById('browserDiv');
	browserDiv.style.display = "none";
	
	// hide browser, as its always on top//
	globals.browser.style.display = "none";
	// show loading//
	loadingDiv.style.height = globals.height + "px"
	loadingDiv.style.display = "block";
	// show loading swf //
	loadingDivSwf.style.display = "";
	centerLoading();
}

/**
 * hides the loading state
 *
 */
function hideLoadingState() {
	if (!globals.browser) return;

	var browserDiv = document.getElementById('browserDiv');
	browserDiv.style.display = "block";
	
	var loadingDiv = document.getElementById('loadingDiv');
	var loadingDivSwf = document.getElementById('loadingDivSwf');
	// show browser//
	globals.browser.style.display = "";
	// hide loading div//
	loadingDiv.style.display = "none";
	// hide loading swf as its always visible (even if its parent is not)//
	loadingDivSwf.style.display = "none";
	return;
}
