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

function receiveArguments(action, params) {
	try {
		if (window[action]) {
			window[action](params)
		}
	} catch (e) {
		
	}
}

function insertCode(code){
	try {
		dw.useTranslatedSource(false);
		
		var dom = dw.getDocumentDOM();
		var inDesignView = ((MM.BC.FOCUS_BEFORE_COMMAND_OPEN || dw.getFocus()) == "document");

		MM.BC.FOCUS_BEFORE_COMMAND_OPEN = "";
		
		// in case focus is returned wrongly//
		if (inDesignView) {
			// if code view is different from design view, we insert in code view//
			if (dom.source.getText(0) != dom.documentElement.outerHTML) {
				inDesignView = false;
			}
			
			var codeSelection = dom.source.getSelection();
			var designSelection = dom.getSelection();
			
			
			if (dom.source.getText(0).substring(codeSelection[0], codeSelection[1]) != dom.documentElement.outerHTML.substring(designSelection[0], designSelection[1])) {
				inDesignView = false;
			}
		}

		var sel, selCode;
		var html;
		
		if (inDesignView) {
			sel = dom.getSelection();
			html = dom.documentElement.outerHTML;
		} else {
			sel = dom.source.getSelection();
			html = dom.source.getText(0);
		}
		
		selCode = html.substring(sel[0], sel[1]);
		code = code.replace('@@selection@@', function (str) {
			return selCode;
		});

		if (!inDesignView) {
			dom.source.replaceRange(sel[0], sel[1], code);
			
			var strippedCode = code.replace(/\s*/gi, '');
			var selectedCode = dom.source.getText(0).substring(sel[0], sel[0] + code.length);
			var i = 0;
				
			while (selectedCode.replace(/\s*/gi, '') != strippedCode && dom.source.getText(0).length > (sel[0] + code.length + i) && i < 9999) {
				i++;
				selectedCode = dom.source.getText(0).substring(sel[0], sel[0] + code.length + i);
			}
				
			dom.source.setSelection(sel[0], sel[0] + code.length + i);
		} else {
			dom.documentElement.outerHTML = html.substring(0, sel[0]) + code + html.substr(sel[1]);
			dom.setSelection(sel[0], sel[0] + code.length);
		}
		
		dw.setFocus("document"); 
		var focus = inDesignView ? "document" : "textView";
		dw.setFocus(focus); 
		
		MM.BC.isInsertingCode = false;
	} catch (e) {
		MM.BC.log('error inserting code --- ' + e);
	}
}

function replaceWithUntranslatedSource() {
	dw.useTranslatedSource(false);
	var dom = dw.getDocumentDOM();
	var mod = dom.isModified();
	dreamweaver.editLockedRegions(true);
	dom.documentElement.outerHTML = dom.documentElement.outerHTML;
	dreamweaver.editLockedRegions(false);
	// set modified flag to false if not modified//
	if (!mod) {
		dom = dw.getDocumentDOM();
		dom.setModified(false);
	}
}

function insertCodeAtSelection(params) {
	var dom  = dw.getDocumentDOM();
	var offs = dom.source.getSelection();
	var docElement = dom.documentElement;
	docElement.outerHTML = docElement.outerHTML.substring(0, offs[0]) +  params.code + docElement.outerHTML.substr(offs[1]);
}
