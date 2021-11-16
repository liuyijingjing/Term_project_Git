/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2011 Adobe Systems Incorporated
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

var pathControl;
var moduleID, moduleName;
var layoutURL = "";
var lastPathValue = "";
var templatePathData = [];
var moduleTokenTag,moduleNameTag,moduleTooltipTag;
var buttonsContainer, templateControlsTable, templateLabelContainer;

function canInspectSelection(){
	dw.useTranslatedSource(false);
	
	// read selection
	var theDOM = dw.getDocumentDOM();
	
	if (!theDOM) return false;
	
	var offs = theDOM.getSelection();
	var selectedCode = theDOM.documentElement.outerHTML.substring(offs[0], offs[1]);
	
	var allModules = MM.BC.UTILS.findAllModules(selectedCode);

	if ( !allModules || !allModules.length) {
		return false;
	}
		
	var moduleName = getModuleNameFromCode(allModules[0].token);
	if (moduleName){
		var moduleObj = MM.BC.MODULES.getModuleByName(moduleName);
		if (!moduleObj) return false;
		
		var templateAttribute = MM.BC.MODULES.getModuleTemplateAttributeName(allModules[0].token);
		if (!templateAttribute && !moduleObj.layoutURL && !moduleObj.dataURL && !moduleObj.editURL) {
			return false;
		}
	} 
	
	return true;
};

function getModuleNameFromCode(moduleCode) {
	var moduleNameMatches = moduleCode.match(/\{\s*(module_\w+)/i);
	if ( !moduleNameMatches || !moduleNameMatches.length) {
		return "";
	}
	
	return moduleNameMatches[1];
}

/**
 * Inspect the module and populate the interface
 *
 */
 function inspectSelection(){
 
	try {
		initDocumentVariables();

		var editLayout =  document.getElementById("editLayout");
		
		var templateFileRow = document.getElementById("templateFileRow");
		var browseButton = document.getElementById("browseButton");
		
		var theDOM = dw.getDocumentDOM();
		var offs = theDOM.getSelection();
		var selectedCode = theDOM.documentElement.outerHTML.substring(offs[0], offs[1]);

		var helpDiv = document.getElementById("help");
		var editModuleBtn = document.getElementById("editProperties");
		var editDataBtn = document.getElementById("editData");
		
		var allModules = MM.BC.UTILS.findAllModules(selectedCode);
		if (!allModules || !allModules.length) {
			return;
		}
		
		var moduleCode = allModules[0].token;
		var moduleNameMatches = moduleCode.match(/\{\s*(module_\w+)/i);
		if ( !moduleNameMatches || !moduleNameMatches.length) {
			return;
		}
		
		var moduleName = moduleNameMatches[1];
		
		layoutURL = "";
		
		var moduleObj = MM.BC.MODULES.getModuleByName(moduleName);
		if (moduleObj && moduleObj.helpURL) {
			helpDiv.style.display = "block";
		} else {
			helpDiv.style.display = "none";
		}

		if (moduleObj && moduleObj.dataURL) {
			editDataBtn.style.display = "";
		} else {
			editDataBtn.style.display = "none";
		}
		
		if (moduleObj && moduleObj.editURL) {
			editModuleBtn.style.display = "";
		} else {
			editModuleBtn.style.display = "none";
		}
		
		templatePathData = MM.BC.MODULES.getTemplateFileFromToken(moduleCode);
		
		// reset ui elements//
		showTemplateControls();
		buttonsContainer.style.paddingLeft = templateLabelContainer.offsetWidth + "px";

		pathControl.value = "";
		pathControl.disabled = "";
		pathControl.outerHTML = pathControl.outerHTML.replace('disabled', ''); 

		browseButton.style.display = "";
		editLayout.style.display = "";
		
		if ( moduleObj && moduleObj.layoutURL ) {
			layoutURL = moduleObj.layoutURL;
		}
		
		// if no template file was found, check for an online layoutURL//
		if (!templatePathData || !templatePathData.length) {
			var templateAttribute = MM.BC.MODULES.getModuleTemplateAttributeName(moduleCode);
			if (!templateAttribute) {
				hideTemplateControls();
				if (!layoutURL) {
					editLayout.style.display = "none";
				}
			}
		} else {
			pathControl.value = templatePathData[0].path;
			pathControl.disabled = templatePathData[0].editable ? "" : "disabled";
			browseButton.style.display = templatePathData[0].editable ? "" : "none";
		}
		lastPathValue = pathControl.value;
		
		moduleID = moduleCode.match(/module_([^\s,\}]+)/gi)[0];
		
		// Hack for forcing DW to rerender the HTML containing the controls
		// (without this the controls are not positionned correctly)
		var topLayer = document.getElementById('topLayer');
		var html = topLayer.innerHTML;
		topLayer.innerHTML = "";
		topLayer.innerHTML = html;
		initDocumentVariables();
		
		// set module name//
		moduleName = getModuleName(moduleID);
		
		var modulePrefix = dw.loadString('bc/pi/module/module');
		
		// trim the module name to 18 chars//
		var trimmedName = modulePrefix + " " + moduleName  + " ";
		
		if (trimmedName.length > 23) {
			trimmedName = trimmedName.substring(0, 23) + "...";
		}

		moduleNameTag.innerHTML = "<table cellpadding='0' cellspacing='0'><tr><td id='module_name_td' nowrap style='font-weight:bold'>" + trimmedName + "</td></tr></table>";
		
		var name_td = document.getElementById('module_name_td');
		var name_width = name_td.offsetWidth;
		
		var module_name_container = document.getElementById('module_name_container');
		var module_tooltip = document.getElementById('module_tooltip');
		
		name_width = (name_width > MM.BC.CONSTANTS.MODULE_PI_NAME_MAX_WIDTH) ? MM.BC.CONSTANTS.MODULE_PI_NAME_MAX_WIDTH : name_width;
		module_tooltip.style.width = name_width + "px";
		module_name_container.style.width = name_width + "px";
		moduleNameTag.style.width = name_width + "px";
		
		
		if (trimmedName != moduleName ) {
			moduleTooltipTag.setAttribute("alt", moduleName);
		} else {
			moduleTooltipTag.setAttribute("alt", "");
		}
		
		moduleTokenTag.innerHTML = '{' + moduleID + '}';
	} catch (e) {
		MM.BC.log('error in inspect selection##' + e);
	}
}

function initDocumentVariables() {
	pathControl = dwscripts.findDOMObject("path");
	moduleNameTag = dwscripts.findDOMObject("module_name");
	moduleTooltipTag = dwscripts.findDOMObject("module_tooltip");
	moduleTokenTag = dwscripts.findDOMObject("module_token");
	
	buttonsContainer = dwscripts.findDOMObject("buttonsContainer");
	templateControlsTable = dwscripts.findDOMObject("templateControlsTable");
	templateLabelContainer = dwscripts.findDOMObject("templateLabelContainer");
}


function showTemplateControls() {
	document.getElementById('templateControlsTable').style.display = "";
}

function hideTemplateControls() {
	document.getElementById('templateControlsTable').style.display = "none";

	document.getElementById('buttonsContainer').style.paddingLeft = "0";
}

function getModuleName(moduleID) {
	var module = MM.BC.MODULES.getModuleByName(moduleID);
	var moduleName = "";

	if (module) {
		moduleName = module.label;
	} else {
		moduleName = moduleID.match( /module_(\w*)/i)[1]
	}
	
	return moduleName;
}

/**
 * Opens the browse window for the user to select a file
 *
 */
function browseFile() {
	var dom = dw.getDocumentDOM();
	var startFile = pathControl.value ? pathControl.value : "/";
	startFile = MM.BC.UTILS.getFileURIFromSiteAbsolutePath( startFile );		
	var fileName = dw.browseForFileURL("select", "",false, false, [], startFile, false)  //returns a local filename
	if (fileName != "") {
		var fullPath = dreamweaver.relativeToAbsoluteURL(dom.URL, "", fileName);
		var sitePath = dom.localPathToSiteRelative(fullPath)
		pathControl.value = sitePath;
	}

	setPath();
}

/**
 * Opens the included file in DW for editing (called when the edit button in the inspector is clicked)
 *
 */
function editFile() {
	
	
	var siteID = MM.BC.SITE.getSiteID(dw.getActiveWindow());
	
	// if it has a layout url, open it in browser//
	if ((!templatePathData || !templatePathData.length || !pathControl.value) && layoutURL) {

	if (!MM.BC.isLoggedIn()) {
			var needToLogin = dw.loadString('bc/pi/module/pleaseLoginBeforeEditTemplate')
			alert(needToLogin);
		MM.BC.launchLogin();
		return;
	}
	
		MM.BC.TOKENS.getOneTimeToken(siteID, function(token) {
			var url = MM.BC.UTILS.generateURL(layoutURL, token);
			dw.browseDocument(url);
		}, false, this);
	} else {
		
		if (pathControl.value == "") {
			var pleaseSelect = dw.loadString('bc/pi/module/pleaseSelectAModuleTemplate');
			alert(pleaseSelect);
			return;
		}
		
		var cachedModules = MM.BC.CACHE.getBCModules(siteID);
		if (!pathControl.value && (!cachedModules || !cachedModules.length)) {
			if (!MM.BC.isLoggedIn()) {
				var needToLogin = dw.loadString('bc/pi/module/pleaseLoginBeforeEditFile');
				alert(needToLogin);
				MM.BC.launchLogin();
			}
			return;
		}
		
		// if not, open it in dw//
		var theDOM = dw.getDocumentDOM();
		if (pathControl.value.match(/^\//gi)) {
			fullPath = dw.getSiteRoot().replace(/\/$/gi, '') + pathControl.value;
		} else {
			fullPath = dreamweaver.relativeToAbsoluteURL(theDOM.URL, "", pathControl.value);
		}
		
		if (DWfile.exists(fullPath)) {
			dreamweaver.openDocument(fullPath);
		} else {
			var tplFileNotFoundMsg = dw.loadString('bc/pi/module/TemplateFileNotFound');
			alert(tplFileNotFoundMsg);
		}
	}
	
}

function selectModuleCode() {
	dw.useTranslatedSource(false);
	var dom = dw.getDocumentDOM();
	
	var offs = dom.getSelection();
	dom.source.setSelection(offs[0], offs[1]);
}

/**
 * Opens the edit module window in DW
 *
 */
function editModule() {
	selectModuleCode();
	MM.BC.MODULES.editModule();
}

/**
 * Opens the admin edit data interface in browser
 *
 */
function editData() {
	var siteID = MM.BC.SITE.getSiteID(dw.getActiveWindow());
	
	if (MM.BC.SITE.isSiteExpired(siteID)) {
		alert(dw.loadString('bc/infomessage/siteExpiredNoLink'));
		return;
	}
	
	selectModuleCode();
	MM.BC.MODULES.editData(moduleID, this);
}

function openHelp() {
	var module = MM.BC.MODULES.getModuleByName(moduleID);
	if (module && module.helpURL) {
		dw.browseDocument(MM.BC.UTILS.generateURL(module.helpURL));
	}
}

function openVideo() {
	var videoURL = dw.loadString('bc/url/BCTemplatesVideoURL')
	dw.browseDocument(videoURL);
}

function openMoreInfo() {
	var moreURL = dw.loadString('bc/url/BCTemplatesMoreDetailsURL')
	dw.browseDocument(moreURL);
}

/**
 * Updates the include based on the changes in the inspector
 *
 */
function setPath() {
	if (pathControl.value == lastPathValue) {
		return;
	} else {
		lastPathValue = pathControl.value;
	}
	
	var theDOM = dw.getDocumentDOM();
	var docElement = theDOM.documentElement;
	
	var offs = theDOM.getSelection();
	
	// use getselection as getselected node returns the parent node//
	var nodeHTML = theDOM.documentElement.outerHTML.substring(offs[0], offs[1]);
	var matches = nodeHTML.match( MM.BUSINESS_CATALYST_REGEXP["module"] );
	
	if (!matches) return;
	
	var moduleSeparator = MM.BC.MODULES.getModuleSeparator(matches[0]);
	var templateAttribute = MM.BC.MODULES.getModuleTemplateAttributeName(matches[0]);
	
	if (!templateAttribute) return;
	
	var templateObject = MM.BC.MODULES.getAttributeFromToken(matches[0], templateAttribute);
	
	var includeString = matches[0];
	var toReplace = includeString.match(MM.BUSINESS_CATALYST_REGEXP["module"])[0];
	var toReplaceOffset = offs[0] + nodeHTML.search(MM.BUSINESS_CATALYST_REGEXP["module"]);
	
	var replaceWith = "";
	
	// if has a template field//
	if (templateObject) {
		replaceWith = includeString.replace(templateObject.original, function(str) {
			return templateAttribute + '="' + pathControl.value + '"';
		});
	} else {
		replaceWith = includeString.replace(/\s?}$/, function(str) { 
			return moduleSeparator + templateAttribute + '="' + pathControl.value + '" }'
		});
	}
	
	docElement.outerHTML = docElement.outerHTML.substring(0, toReplaceOffset) + replaceWith + docElement.outerHTML.substr(toReplaceOffset + toReplace.length);
	
	// select the module//
	theDOM.setSelection(toReplaceOffset, toReplaceOffset + toReplace.length + (replaceWith.length - toReplace.length));
}


