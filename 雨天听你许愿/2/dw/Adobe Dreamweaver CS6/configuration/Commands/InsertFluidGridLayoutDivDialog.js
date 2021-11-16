/*

 ADOBE CONFIDENTIAL
 ___________________

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

if (typeof CssGrids == 'undefined') CssGrids = {}; // Create our namespace

CssGrids.InsertFluidGridLayoutDivDialog = function(inDw, inDwscripts, inStyleSheetManager, inWindow, inDocument) {	

	var self = this;
	
	self.publicFunctions = [
		'onLoad',
		'onClick_OkButton'		
	];
	
	self.refs = {
		dw: 				inDw,
		dwscripts: 			inDwscripts,
		styleSheetManager: 	inStyleSheetManager,
		window: 			inWindow,
		document: 			inDocument
	}
							
	self.consts = {
		baseDivName:	'LayoutDiv',
		msgs: {
			pleaseProvideDivId:	inDw ? self.refs.dw.loadString('command/insertFluidGridLayoutDiv/PleaseProvideDivId/errMsg') : '',
			idAlreadyInUse: 	inDw ? self.refs.dw.loadString('command/insertFluidGridLayoutDiv/IdAlreadyInUse/errMsg') : '',
			invalidIdValue: 	inDw ? self.refs.dw.loadString('command/insertFluidGridLayoutDiv/InvalidIdValue/errMsg') : ''
		}
	}
					
	self.setDivId = function(id) {
		var elem = self.refs.document.getElementById('div_id')
		elem.value = id;
		elem.select();			
	}
		
	self.setFocusToDivId = function() {
		self.refs.document.getElementById('div_id').focus();
	}
								
	self.getTrimmedStr_DivId = function(){
		return self.refs.dwscripts.trim(self.refs.document.getElementById('div_id').value);
	}
	
	self.isChecked_StartsNewRow = function() {		
		return self.refs.document.getElementById('starts_new_row').checked;	
	}
		
	self.reportError = function(msg) {
		self.alert(msg);
	}
		
	self.alert = function(str) {
		alert(str);
	}
			
	self.onLoad = function() {								
		if (!self.refs.styleSheetManager.loadGridProps()) {
			// Style Sheet Manager will report error for us.
			self.refs.window.close();
			return;	
		}
		self.setDivId(self.refs.dwscripts.getUniqueId(self.consts.baseDivName, true));
	}
	
	self.onClick_OkButton = function() {	
		// Validate.
		if (!self.divIdIsValid())
			return;						
		var numTargetCheckboxesChecked = 0;			
		// Insert html and css.			
		var html = self.getHtmlToInsert();			
		self.refs.dw.getDocumentDOM().insertHTML(html, false, false);
		self.refs.styleSheetManager.insertRule('#' + self.getTrimmedStr_DivId(), self.isChecked_StartsNewRow());
		// Place the insertion pointer to just after the newly inserted element.
		var dom = self.refs.dw.getDocumentDOM();
		var insertedElem = dom.getElementById(self.getTrimmedStr_DivId());
		if (insertedElem) {
			var offsets = dom.nodeToOffsets(insertedElem);
			self.refs.dw.setSelection(offsets[1], offsets[1]);
		}
		dom.setInactiveDeviceIconsModified();
		// Dismiss the dialog.
		self.refs.window.close();			
	}	
	
	self.getIdList = function() {								
		var idList = [];			
		var elemList = self.refs.dw.getDocumentDOM().getElementsByAttributeName('id');	
		for (var i = 0; i < elemList.length; i++) {				
			var id = self.refs.dwscripts.trim(elemList[i].getAttribute('id'));			
			if (id.length > 0)				
				idList.push(id);					
		}			
		return idList;
	}
		
	self.divIdIsValid = function() {			
		var divId = self.getTrimmedStr_DivId();			
		if (divId == '')
		{
			self.reportError(self.consts.msgs.pleaseProvideDivId);
			self.setFocusToDivId();
			return false;	
		}			
		var idList = self.getIdList();
		var idFound = false;
		for (var i = 0; i < idList.length; i++) {
			var id = idList[i];				
			if (id.toLowerCase() == divId.toLowerCase()) {
				idFound = true;
				break;
			}					
		}
		if (idFound) {	
			var errMsg = self.refs.dwscripts.sprintf(self.consts.msgs.idAlreadyInUse, divId);
			self.reportError(errMsg);
			self.setFocusToDivId();
			return false;	
		}			
		if (!self.refs.dw.getDocumentDOM().isValidIDValue(divId, true)) {				
			var errMsg = self.refs.dwscripts.sprintf(self.consts.msgs.invalidIdValue, divId);
			self.reportError(errMsg);
			self.setFocusToDivId();
			return false;				
		}						
		return true;
	}
			
	self.getHtmlToInsert = function() {
		var content = self.refs.dw.loadString('command/insertFluidGridLayoutDiv/defaultContent');
		content = self.refs.dwscripts.sprintf(content, self.getTrimmedStr_DivId());
		return '<div id="' + self.getTrimmedStr_DivId() + '">' + content + '</div>';						
	}		
}
