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

var pathControl, editFileControl;

function canInspectSelection(){
	// read selection
	var theDOM = dw.getDocumentDOM();
	var offs = theDOM.getSelection();
	var selectedCode = theDOM.documentElement.outerHTML.substring(offs[0], offs[1]);

	var matches = selectedCode.match( MM.BUSINESS_CATALYST_REGEXP["include_b"] );

	// nothing matches TAG definition
	if ( !matches || !matches.length) {
		return;
	}

	return true;
};


/**
 * Inspect the include and populate the interface
 *
 */
function inspectSelection(){
	pathControl = dwscripts.findDOMObject("path");
	editFileControl  = dwscripts.findDOMObject("editFile");
	
	var theDOM = dw.getDocumentDOM();
	var offs = theDOM.getSelection();
	var selectedCode = theDOM.documentElement.outerHTML.substring(offs[0], offs[1]);

	var matches = selectedCode.match( MM.BUSINESS_CATALYST_REGEXP["include"] );
	var pathValue = matches[2];
	
	pathControl.value = pathValue;
	
	if (pathControl.value) {
		editFileControl.style.display = "";
	} else {
		editFileControl.style.display = "none";
	}
}

/**
 * Updates the include based on the changes in the inspector
 *
 */
function setPath() {
	var theDOM = dw.getDocumentDOM();
	var docElement = theDOM.documentElement;
	
	var offs = theDOM.getSelection();
	
	// use getselection as getselected node returns the parent node//
	var nodeHTML = theDOM.documentElement.outerHTML.substring(offs[0], offs[1]);
	var matches = nodeHTML.match( MM.BUSINESS_CATALYST_REGEXP["include"] );
	
	if (!matches) return;
	
	var includeString = matches[0];
	var replaceRegExp = MM.BUSINESS_CATALYST_REGEXP["include"];
	
	var toReplace = includeString.match(replaceRegExp)[0];
	var toReplaceOffset = offs[0] + nodeHTML.search(replaceRegExp);
	var replaceWith = includeString.replace(replaceRegExp, function(str, p1, p2, p3) {
		return p1 +  pathControl.value + p3;
	});
	
	docElement.outerHTML = docElement.outerHTML.substring(0, toReplaceOffset) + replaceWith + docElement.outerHTML.substr(toReplaceOffset + toReplace.length);
	
	dreamweaver.editLockedRegions(true)
	
	theDOM.setSelection(toReplaceOffset, toReplaceOffset + toReplace.length + (replaceWith.length - toReplace.length));
	
	if (pathControl.value) {
		editFileControl.style.display = "";
	} else {
		editFileControl.style.display = "none";
	}
}

/**
 * Opens the included file in DW for editing (called when the edit button in the inspector is clicked)
 *
 */
function editFile() {
	var theDOM = dw.getDocumentDOM();
	
	if (pathControl.value == "") {
		return;
	}
	
	if (pathControl.value.match(/^\//gi)) {
		fullPath = dw.getSiteRoot().replace(/\/$/gi, '') + pathControl.value;
	} else {
		fullPath = dreamweaver.relativeToAbsoluteURL(theDOM.URL, "", pathControl.value);
	}
	
	dreamweaver.openDocument(fullPath);
}

/**
 * Opens the browse window for the user to select a file
 *
 */
function browseFile() {
	var theDOM = dw.getDocumentDOM();
	var startFile = pathControl.value ? pathControl.value : "/";	
	startFile = MM.BC.UTILS.getFileURIFromSiteAbsolutePath( startFile );		
	var fileName = dw.browseForFileURL("select", "",false, false, [], startFile, false)  //returns a local filename
	if (fileName != "") {
		var fullPath = dreamweaver.relativeToAbsoluteURL(theDOM.URL, "", fileName);
		var sitePath = theDOM.localPathToSiteRelative(fullPath)
		pathControl.value = sitePath;
	}

	setPath();
}
