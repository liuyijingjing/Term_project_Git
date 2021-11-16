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

CssGrids.LayoutDivManipulator = function(dw, dom, dwscripts, styleSheetManager) {

	var self = this; 
	
	self.publicFunctions = [ 
		'init',
		'isInited',
		'shutdown',
		'onResize_OverlayWindow',
		'onDocumentVisibleViewsChanged',
		'onResourceLoadingCompleted_LiveView',
		'onMouseDown_Resizing',
		'onMouseMove_Resizing',
		'onMouseUp_Resizing',
		'onMouseDown_Shifting',
		'onMouseMove_Shifting',
		'onMouseUp_Shifting',
		'onMouseOver_OverlayDiv',
		'onMouseOut_OverlayDiv',
		'onMouseDown_OverlayDocument'
	];
	
	self.refs = { 	
		dw:						dw,
		dwscripts:				dwscripts, // Needed for logging.
		styleSheetManager: 		styleSheetManager,
		dwDom:					dom,
		overlayCtrl: 			overlayCtrl,
		window:					window,
		document:				document,
		resizeEdgeDiv: 			null,
		shiftEdgeDiv:			null,
		marginDiv:				null,
		startsRowDiv: 			null,
		draggingDiv: 			null,
		overlayDivs:			[],
		cssRuleBeingModified: 	null,
		columnDivs:				[],
		internalStyleSheetDom: 	null,
		knobTop:				{}, // props: resize, shift
		knobMiddle:				{}, // props: resize, shift
		knobBottom:				{},	// props: resize, shift
		dynamicTooltipDiv:		null
	};
					
	self.data = {	
		mouseStartX:								-1,
		mouseCurX:									-1,
		mouseStartY:								-1,
		scrollStartX:								-1,
		gridContainerWidthStart:					-1,
		selectedUnderlyingDivCurrentColSpan:		-1,
		selectedUnderlyingDivStartingColSpan:		-1,
		marginsOffsetLeft:							-1,
		startingSelectedOverlayDivOffsetWidth:		-1,
		startingSelectedUnderlyingDivOffsetLeft: 	-1,
		startingMarginDivWidth:						-1,
		selectedUnderlyingDivId:					'',
		mouseOverDivId:								'',
		lastColRight:								-1,
		gridColRects:								[]
	};
		
	self.consts = {		
		selectedBorderWidth: 		2,
		draggingBorderWidth:		1,
		internalCssFileUrl:			self.refs.dw.getConfigurationPath() + '/Overlays/CssGrids/temp/internal.css',
		shouldDesignViewSnapFileUrl:self.refs.dw.getConfigurationPath() + '/Overlays/CssGrids/shouldDesignViewSnap.txt',
		tagName:					'*', 	// Used in 'getElementsByTagName()' to find layout divs.
		gridContainer:				'gridContainer', 	// The class name that signifies the master container for the layouts
		gridContainerBgColor:		'rgba(200,200,200,0.35)',
		percentFixedPoint:			4, 		// The number of decimals we care about in percentage based units.
		startsNewRowButtonWidth: 	16,
		startsNewRowButtonGapSize: 	2, 		// Distance between right edge of knob and this button.
		knobSize:					8,
		overlayDivBgColor:			'rgba(150, 255, 128, 0.4)',
		overlayDivBgColorSelected:	'rgba(0, 255, 0, 0.35)',
		dynamicTooltipOffsetX:		15,
		dynamicTooltipOffsetY:		15
	};

	self.consts.selectedBorder = self.consts.selectedBorderWidth + 'px solid #3300FD'; 	// blue
	self.consts.hoverBorder = self.consts.selectedBorderWidth + 'px solid #CC6600';		// red
	self.consts.misalignedDivBorder = self.consts.selectedBorderWidth + 'px solid yellow';
	self.consts.draggingBorder = self.consts.draggingBorderWidth + 'px dashed blue';

	self.flags = {
		debug:										false, 
		showProtos:									false,
		isInitied:									false,
		isDragging:									false,
		isResizing:									false,
		isShifting:									false,
		isRefreshing:								false,
		wasDomShowingDivBoxModel:					false,
		logEvents:									false,
		showDebugDumpButton:						false,
		disabledForZoom:							false,
		shouldDesignViewSnap:						false
	};
	
	self.init = function() {
		if (!self.refs.styleSheetManager.beQuiet(true).loadGridProps()) {
			return;
		}
		self.refs.styleSheetManager.beQuiet(false);
		self.flags.shouldDesignViewSnap = self.calcShouldDesignViewSnap();
		self.createOverlayControls();
		self.refresh('gridAndRediscoverUnderlyingDivs');
		self.addEventListeners();
		if (self.flags.showDebugDumpButton) {
			self.showDiv(self.refs.document.getElementById('debugDumpDiv'));
			self.refs.document.getElementById('debugDumpDiv').style.top = '200px';	
		}
		var isNewDoc = self.refs.dwDom.URL == '';
		if (isNewDoc) {
			// Format html to honor formatting prefs.			
			self.refs.dwDom.formatRange(0, self.refs.dwDom.documentElement.outerHTML.length);
			self.refs.dwDom.clearUndos();
			self.refs.dwDom.setModified(false);
			// Set the IP to after LayoutDiv1.
			var div = self.refs.dwDom.getElementById('LayoutDiv1');
			if (div) {
				var offsets = self.refs.dwDom.nodeToOffsets(div);
				self.refs.dwDom.setSelection(offsets[1], offsets[1]);	
			}
		}		
		self.flags.isInitied = true;
		//load our user style sheets after we're inited
		self.refs.dwDom.browser.reloadDynamicUsersStyleSheet();
		self.updateInternalStyleSheetDom(self.getDefaultUserStyleSheetText(), true);
	}
	
	self.isInited = function() {
		return self.flags.isInitied;
	}

	self.calcShouldDesignViewSnap = function() {
		var str = DWfile.read(self.consts.shouldDesignViewSnapFileUrl);
		return str.toLowerCase().indexOf('yes') != -1;
	}
	
	self.shutdown = function() {
		self.flags.isInitied = false;
		self.removeEventListeners();
		self.updateInternalStyleSheetDom('', true);
		self.refs.dwDom.dettachInternalStyleSheet(self.consts.internalCssFileUrl);
		self.refs.dwDom.browser.reloadDynamicUsersStyleSheet();
	}

	self.addEventListeners = function() {
		self.refs.window.addEventListener('resize', self.onResize_OverlayWindow); 
		self.refs.document.addEventListener('mousedown', self.onMouseDown_OverlayDocument);
		self.refs.dwDom.browser.addEventListener('ResourceLoadingCompleted', self.onResourceLoadingCompleted_LiveView);
		self.refs.dwDom.browser.addEventListener('DynamicUserStyleSheetRequested', self.onDynamicUserStyleSheetRequested_LiveView);
		self.refs.dwDom.addEventListener('DWDOMChanged', self.onDWDOMChanged_DesignView, false);
		self.refs.dwDom.addEventListener('DWVisibleViewsChanged', self.onDWVisibleViewsChanged_DesignView, false);
		self.refs.dwDom.documentElement.addEventListener('select', self.onSelectionChange_DesignView, false);
	}

	self.removeEventListeners = function() {
		self.refs.window.removeEventListener('resize', self.onResize_OverlayWindow); 
		self.refs.document.removeEventListener('mousedown', self.onMouseDown_OverlayDocument);
		self.refs.dwDom.browser.removeEventListener('ResourceLoadingCompleted', self.onResourceLoadingCompleted_LiveView);
		self.refs.dwDom.browser.removeEventListener('DynamicUserStyleSheetRequested', self.onDynamicUserStyleSheetRequested_LiveView);
		self.refs.dwDom.removeEventListener('DWDOMChanged', self.onDWDOMChanged_DesignView, false);
		self.refs.dwDom.removeEventListener('DWVisibleViewsChanged', self.onDWVisibleViewsChanged_DesignView, false);
		self.refs.dwDom.documentElement.removeEventListener('select', self.onSelectionChange_DesignView, false);
	}
	
	self.addDragEditingEventListeners = function( editType ) {
		if (self.flags.logEvents) {
			self.log('addDragEditingEventListeners');	
		}
		if( editType == 'resizing' ){
			self.refs.document.addEventListener('mousemove', self.onMouseMove_Resizing);
			self.refs.document.addEventListener('mouseup', self.onMouseUp_Resizing);
		}
		if( editType == 'shifting'){
			self.refs.document.addEventListener('mousemove', self.onMouseMove_Shifting);
			self.refs.document.addEventListener('mouseup', self.onMouseUp_Shifting);
		}
	}
	
	self.removeDragEditingEventListeners = function() {
		if (self.flags.logEvents) {
			self.log('removeDragEditingEventListeners');	
		}
		self.refs.document.removeEventListener('mousemove', self.onMouseMove_Resizing);
		self.refs.document.removeEventListener('mouseup', self.onMouseUp_Resizing);
		self.refs.document.removeEventListener('mousemove', self.onMouseMove_Shifting);
		self.refs.document.removeEventListener('mouseup', self.onMouseUp_Shifting);
		if( self.flags.isDragging && self.flags.wasDomShowingDivBoxModel )
			self.refs.dwDom.setShowDivBoxModel(true);
		self.flags.isDragging = false;
		self.flags.isResizing = false;
		self.flags.isShifting = false;
		self.flags.wasDomShowingDivBoxModel = false;
		self.refs.cssRuleBeingModified = null;
	}

	self.onDWDOMChanged_DesignView = function() {
		if (self.flags.logEvents) {
			self.log('onDWDOMChanged_DesignView');
		}
		if (!self.isDesignView()) {
			return;
		}
		self.refresh('gridAndRediscoverUnderlyingDivs');
	}

	self.onResize_OverlayWindow = function() {
		if (self.flags.logEvents) {
			self.log('onResize_OverlayWindow');	
		}
		self.refresh('gridAndRediscoverUnderlyingDivs');
	}
	
	self.onDWVisibleViewsChanged_DesignView = function() {
		if (self.flags.logEvents) {
			self.log('onDWVisibleViewsChanged_DesignView');
		}
		if( self.refs.dw.getFocus() == "textView" ){
			//clear selection when in code view
			self.selectDiv(null);
		}
		if (!self.isDesignView()) {
			return;	
		}
		self.refresh('gridAndRediscoverUnderlyingDivs');
	}

	self.onResourceLoadingCompleted_LiveView = function(evt) {
		if (self.flags.logEvents) {
			self.log('onResourceLoadingCompleted_LiveView');
		}
		self.refresh('gridAndRediscoverUnderlyingDivs');
	}
	
	self.onDynamicUserStyleSheetRequested_LiveView = function(evt) {
		if (self.flags.logEvents) {
			self.log('onDynamicUserStyleSheetRequested_LiveView');
		}
		evt.appendStringToUsersStyleSheet(self.getDefaultUserStyleSheetText());
	}
	
	self.onSelectionChange_DesignView = function(evt) {
		if (self.flags.logEvents) {
			self.log('onSelectionChange_DesignView');	
		}
		if( self.isLiveView() )
			return;
		if( self.flags.isDragging )
			return;
			
		var curId = evt.target.getAttribute ? evt.target.getAttribute('id') : null;
		var dom = evt.target.ownerDocument;
		var wholeNodeSelected = dom.selectionIsExactlyOneTag();		
		
		if( !self.data.selectedUnderlyingDivId ){
			//if we don't have anything selected, see if we can select this
			if(wholeNodeSelected)
				self.selectOverlayDivById(curId);
			return;
		}
		else if( self.data.selectedUnderlyingDivId == curId ) {
			if(self.refs.dwscripts.selectionIsCursor(dom))
				self.selectDiv(null);//If it's an IP, then it's not this tag
			return; //already have it selected
		}
		else {
			var parent = evt.target.parentNode;
			while( parent )
			{
				curId = parent.getAttribute ? parent.getAttribute('id') : null;
				if( self.data.selectedUnderlyingDivId == curId ) {
					return; //we're a child of the current selection, lets bail
				}
				parent = parent.parentNode;
			}
			// Something else is selected so deselect this
			self.selectDiv(null);
			return;
		}
	}
	
	self.isZooming = function() {
		return self.refs.dw.activeViewScale != 1;
	}
	
	self.disableForZoom = function(shouldDisable) {
		if (shouldDisable) {
			self.selectDiv(null); // Hide controls.
			self.destroyOverlayDivs(); 
			self.flags.disabledForZoom = true;	
		} else { // Should enable.
			self.flags.disabledForZoom = false;
		}
	}

	self.createOverlayControls = function() {
		self.createDraggingDiv();
		self.createEdgeDiv('resize');
		self.createEdgeDiv('shift');
		self.createMarginDiv();
		self.createStartsRowDiv();		
		self.createDynamicTooltipDiv();
	}

	self.log = function(str) {
		self.refs.dwscripts.log(new Date().getTime() + ': ' + str);	
	}

	self.refresh = function(inWhatToRefresh) {	
		var whatToRefresh = inWhatToRefresh; // Can be changed by zoom logic in this function.
		if (self.flags.isRefreshing || self.isCodeView()) {
			return;
		}
		if (self.isZooming()) {
			if (!self.flags.disabledForZoom) {
				self.disableForZoom(true);	
			}
		} else { // Not zooming.
			if (self.flags.disabledForZoom) {
				self.disableForZoom(false);	
				whatToRefresh = 'gridAndRediscoverUnderlyingDivs';
			}
		}
		self.flags.isRefreshing = true;	
		// Update the grid.
		if (!self.flags.isDragging || whatToRefresh == "gridForBodyAdjustment") {
			// No need to recalc the grid col rects if we are dragging.
			// In fact, trying to yields peculiar results.
			self.data.gridColRects = self.getGridColRects();
		}
		if (self.data.gridColRects.length == 0) {
			self.flags.isRefreshing = false;
			return; // Can't refresh if we don't know the dimensions.
		}
		self.updateColumns();
		if (whatToRefresh == 'gridAndRediscoverUnderlyingDivs') {
			self.createOverlayDivs();
			var shouldHideSelectedDivControls = self.data.selectedUnderlyingDivId && self.getActiveDom().getElementById(self.data.selectedUnderlyingDivId) == null;
			if (shouldHideSelectedDivControls) {
				self.selectDiv(null);
			}
		} 
		self.syncOverlayDivs();
		if (self.flags.showProtos) {
			self.proto_positionPi();
		}
		if (self.data.selectedUnderlyingDivId) {
			self.selectOverlayDivById(self.data.selectedUnderlyingDivId);
			self.setUserNodeSelected();
		}
		self.flags.isRefreshing = false;
	}

	self.isLiveView = function() {
		return self.refs.dwDom.getView() != 'code' && self.refs.dwDom.getDesignViewMode() == 'live';	
	}

	self.isDesignView = function() {
		return self.refs.dwDom.getView() != 'code' && self.refs.dwDom.getDesignViewMode() == 'editable';
	}

	self.isCodeView = function() {
		return self.refs.dwDom.getView() == 'code';
	}
		
	self.onMouseDown_Resizing = function(evt) {
		evt.preventDefault();
		self.refs.overlayCtrl.preventRelayOfCurrentEvent();
		self.flags.isDragging = true;
		self.flags.isResizing = true;
		self.flags.wasDomShowingDivBoxModel = false;
		self.data.mouseStartX = evt.x;
		self.data.mouseStartY = evt.y;
		self.data.scrollStartX = self.refs.window.scrollX;
		self.data.gridContainerWidthStart = self.getGridContainerWidth();
		if (self.isLiveView()) {
			self.refs.cssRuleBeingModified = self.findRuleForSelectedUnderlyingDiv_LiveView();
		} else { // is design view
			if (self.flags.shouldDesignViewSnap) {
				self.updateInternalStyleSheetDom(self.getDefaultUserStyleSheetText());
			}
			self.flags.wasDomShowingDivBoxModel = self.refs.dwDom.getShowDivBoxModel();
			if( self.flags.wasDomShowingDivBoxModel )
				self.refs.dwDom.setShowDivBoxModel(false);
		}
		var selectedUnderlyingDiv = self.getSelectedUnderlyingDiv();
		if (!selectedUnderlyingDiv) {
			return;	
		}
		var selectedOverlayDiv = self.getSelectedOverlayDiv();
		if( !selectedOverlayDiv ) {
			return;
		}
		self.ensureSelectedDivResizable();
		self.data.selectedUnderlyingDivStartingColSpan = self.getColSpanFromOffsetWidth(selectedUnderlyingDiv.offsetWidth);
		self.data.selectedUnderlyingDivCurrentColSpan = self.data.selectedUnderlyingDivStartingColSpan;
		self.data.startingSelectedOverlayDivOffsetWidth = selectedOverlayDiv.offsetWidth;
		self.data.lastColRight = self.data.gridColRects[self.data.gridColRects.length - 1].right;
		self.addDragEditingEventListeners('resizing');
		self.positionDraggingDiv();		
		self.positionDynamicTooltipDiv();
		//make sure the whole div is selected when we start to edit it
		self.setUserNodeSelected(true);
	}
		
	self.onMouseMove_Resizing = function(evt) {
		if (self.flags.logEvents) {
			self.log('onMouseMove_Resizing');
		}
		self.refs.overlayCtrl.preventRelayOfCurrentEvent();
		var newX = Math.min(evt.x, self.data.lastColRight);
		var diff = (newX - self.data.mouseStartX) + (self.refs.window.scrollX - self.data.scrollStartX);
		var newDraggingDivWidth = self.data.startingSelectedOverlayDivOffsetWidth + diff;
		self.refs.draggingDiv.style.width = newDraggingDivWidth + 'px'; 		
		self.snapSelectedDivToNearestValidWidth();
		var selectedUnderlyingDiv = self.getSelectedUnderlyingDiv();
		if (!selectedUnderlyingDiv) {
			return;	
		}	
		self.positionDynamicTooltipDiv();
		if (self.getPosition(self.refs.draggingDiv).left != self.getPosition(selectedUnderlyingDiv).left &&
			self.data.gridContainerWidthStart != self.getGridContainerWidth())
		{
			//The body has shifted while we're editing, we need to refresh
			self.refresh('gridForBodyAdjustment');
			self.positionDraggingDiv();
			self.data.gridContainerWidthStart = self.getGridContainerWidth();
		}				
		if (self.getPosition(self.refs.draggingDiv).top != self.getPosition(selectedUnderlyingDiv).top) {
			// If the div being resized jumped up or down, we need to make sure the resizing div 
			// position is synced to the selected div.
			self.positionDraggingDiv();
		}
		self.ensureSelectedDivResizable();
		self.ensureSelectedDivStillVisible();
	}

	self.onMouseUp_Resizing = function(evt) {
		if (self.flags.logEvents) {
			self.log('onMouseUp_Resizing');
		}
		if( evt ) {
			evt.preventDefault();
			self.refs.overlayCtrl.preventRelayOfCurrentEvent();
		}
		self.removeDragEditingEventListeners();
		self.hideDiv(self.refs.draggingDiv);
		self.hideDiv(self.refs.dynamicTooltipDiv);
		if (self.data.selectedUnderlyingDivCurrentColSpan != self.data.selectedUnderlyingDivStartingColSpan) {
			var selector = '#' + self.data.selectedUnderlyingDivId;
			self.refs.styleSheetManager.setColSpan(self.getDeviceFromWindowWidth(), selector, self.data.selectedUnderlyingDivCurrentColSpan);
			// Select the node again right now to prevent the selection from jumping around in code
			// view on the mac.
			self.setUserNodeSelected(true);
		}
		if (self.flags.shouldDesignViewSnap) {
			self.updateInternalStyleSheetDom(self.getDefaultUserStyleSheetText());
		}
	}
		
	self.onMouseDown_Shifting = function(evt) {
		if (self.flags.logEvents) {
			self.log('onMouseDown_Shifting');
		}
		evt.preventDefault();
		self.refs.overlayCtrl.preventRelayOfCurrentEvent();
		self.flags.isDragging = true;
		self.flags.isShifting = true;
		self.flags.wasDomShowingDivBoxModel = false;
		self.data.mouseStartX = evt.x;
		self.data.mouseCurX = evt.x;
		self.data.mouseStartY = evt.y;
		self.data.scrollStartX = self.refs.window.scrollX;
		self.data.gridContainerWidthStart = self.getGridContainerWidth();
		if (self.isLiveView()) {
			self.refs.cssRuleBeingModified = self.findRuleForSelectedUnderlyingDiv_LiveView();
		} else { // Is Design View.
			if (self.flags.shouldDesignViewSnap) {
				self.updateInternalStyleSheetDom(self.getDefaultUserStyleSheetText());
			}
			self.flags.wasDomShowingDivBoxModel = self.refs.dwDom.getShowDivBoxModel();
			if( self.flags.wasDomShowingDivBoxModel )
				self.refs.dwDom.setShowDivBoxModel(false);
		}
		var selectedUnderlyingDiv = self.getSelectedUnderlyingDiv();
		if (!selectedUnderlyingDiv) {
			return;	
		}
		var marginLeft = self.getCssPropVal(self.data.selectedUnderlyingDivId, 'margin-left', 'int');	
		self.data.startingMarginDivWidth = marginLeft;		
		self.data.marginsOffsetLeft = self.getPosition(selectedUnderlyingDiv).left - marginLeft;
		self.data.selectedDivStartingColShift = self.getColShiftFromMarginLeftPx(marginLeft);
		self.data.selectedDivCurrentColShift = self.data.selectedDivStartingColShift;
		self.data.startingSelectedUnderlyingDivOffsetLeft = self.getPosition(selectedUnderlyingDiv).left;
		self.addDragEditingEventListeners('shifting');
		self.positionDraggingDiv();		
		self.positionDynamicTooltipDiv();
		//make sure the whole div is selected when we start to edit it
		self.setUserNodeSelected(true);
	}

	self.onMouseMove_Shifting = function(evt) {
		if (self.flags.logEvents) {
			self.log('onMouseMove_Shifting');
		}
		self.refs.overlayCtrl.preventRelayOfCurrentEvent();
		self.data.mouseCurX = evt.x;
		var diff = (evt.x - self.data.mouseStartX) + (self.refs.window.scrollX - self.data.scrollStartX);
		var newDraggingDivLeft = self.data.startingSelectedUnderlyingDivOffsetLeft + diff;
		self.refs.draggingDiv.style.left = newDraggingDivLeft + 'px';
		self.positionDynamicTooltipDiv();
		self.snapSelectedDivToNearestValidLeft();
		self.ensureSelectedDivStillVisible();
	}
	
	self.onMouseUp_Shifting = function(evt) {
		if (self.flags.logEvents) {
			self.log('onMouseUp_Shifting');
		}
		evt.preventDefault();
		self.refs.overlayCtrl.preventRelayOfCurrentEvent();
		self.removeDragEditingEventListeners();
		self.hideDiv(self.refs.draggingDiv);
		self.hideDiv(self.refs.dynamicTooltipDiv);
		if (self.data.selectedDivCurrentColShift != self.data.selectedDivStartingColShift) {
			var selector = '#' + self.data.selectedUnderlyingDivId;
			self.refs.styleSheetManager.setColShift(
				self.getDeviceFromWindowWidth(),
				selector,
				self.data.selectedDivCurrentColShift
			);
			// Select the node again right now to prevent the selection from jumping around in code
			// view on the mac.			
			self.setUserNodeSelected(true);					
		}
		if (self.flags.shouldDesignViewSnap) {
			self.updateInternalStyleSheetDom(self.getDefaultUserStyleSheetText());
		}
	}

	self.onMouseOver_OverlayDiv = function(evt) {
		if (self.flags.isDragging) {
			return;				
		}
		var oldMouseOverDiv = self.getMouseOverOverlayDiv();
		self.data.mouseOverDivId = evt.target.underlyingDivId;
		self.updateOverlayDivBorder(oldMouseOverDiv);
		if( oldMouseOverDiv != evt.target ) {
			self.updateOverlayDivBorder(evt.target);
			if (oldMouseOverDiv) {
				oldMouseOverDiv.style.backgroundColor = self.consts.overlayDivBgColor;
			}
		} 
		evt.target.style.backgroundColor = self.consts.overlayDivBgColorSelected;		
	}

	self.onMouseOut_OverlayDiv = function(evt) {
		if (self.flags.isDragging) {
			return;
		}
		var oldMouseOverDiv = self.getMouseOverOverlayDiv();
		self.data.mouseOverDivId = '';
		self.updateOverlayDivBorder(oldMouseOverDiv);
		if( oldMouseOverDiv != evt.target ) {
			self.updateOverlayDivBorder(evt.target);
			if (oldMouseOverDiv) {
				oldMouseOverDiv.style.backgroundColor = self.consts.overlayDivBgColorSelected;
			}			
		}
		if (evt.target.underlyingDivId != self.data.selectedUnderlyingDivId) {
			evt.target.style.backgroundColor = self.consts.overlayDivBgColor;
		}
	}

	self.onMouseDown_OverlayDocument = function(evt) {
		if (evt.target == self.refs.resizeEdgeDiv || evt.target == self.refs.shiftEdgeDiv) {
			evt.preventDefault();
			self.refs.overlayCtrl.preventRelayOfCurrentEvent();
			return;
		}
		if (evt.target == self.refs.startsRowDiv) {
			evt.preventDefault();
			self.refs.overlayCtrl.preventRelayOfCurrentEvent();
			self.toggleStartsRow();
			return;
		}
		if (!evt.target.underlyingDivId) {
			// If it doesn't have a underlyingDivId property, it isn't an overlay div.
			self.selectDiv(null);
		} else if (evt.target != self.getSelectedOverlayDiv()) {
			self.selectDiv(evt.target);
			// Select user node here instead of in selectDiv() because having it there caused
			// the LDM to jump around when live view reloaded after an edit.
			self.setUserNodeSelected();
		}
	}
	
	self.updateOverlayDivBorder = function( overlayDiv ) {
		if( !overlayDiv ) {
			return;
		}
		var newBorder = '';
		if (overlayDiv == self.getSelectedOverlayDiv()) { 
			newBorder = self.consts.selectedBorder;
		}
		else if( overlayDiv == self.getMouseOverOverlayDiv() ) {
			newBorder = self.consts.hoverBorder;
		}
		else if(self.isDivMisaligned(overlayDiv)) {
			newBorder = self.consts.misalignedDivBorder;
		}
		self.setOverlayDivBorder(overlayDiv, newBorder);
	}

	self.positionControls = function() {
		self.positionEdge('resize');
		self.positionEdge('shift');
		self.positionMarginDiv();
		self.positionStartsRowDiv();		
	}
	
	self.getUnderlyingDivs = function() {
		if (self.flags.disabledForZoom) {
			return [];
		}		
		var divs = self.nodeListToArray(self.getActiveDom().body.getElementsByTagName(self.consts.tagName));
		var outDivs = [];
		var validWidths = self.getValidLayoutWidthPcts();
		var isLiveView = self.isLiveView();
		divs.forEach(function(div){
			var id = div.getAttribute ? div.getAttribute('id') : null;
			if (!id) {
				return;
			}
			if (self.getCssPropVal(id, 'display') == 'none') {
				return;	
			}
			if (isLiveView) {
				var rule = self.findRuleForDiv_LiveView(div);
				if (!rule) {
					return;	
				}
				var width = rule.style.width; 
			} else {
				var declaredStyle = self.refs.dwDom.parentWindow.getDeclaredStyle(div);
				if (!declaredStyle) {
					return; 
				}
				var width = declaredStyle.width;
			}
			
			if( validWidths.some(self.getWidthPctsMatchingFxn(width)) ){
				outDivs.push(div);
			}
		});
		return outDivs;	
	}
	
	self.getWidthPctsMatchingFxn = function ( widthToFind ) {
		return function(widthToTest) {
			var _self = self;
			return _self.widthPctsMatch(widthToTest, widthToFind);
		}
	}
	
	self.widthPctsMatch = function(lWidth, rWidth) {
		if( lWidth == rWidth )
			return true;
		
		var lFloat = parseFloat(lWidth);
		var rFloat = parseFloat(rWidth);
		
		if( isNaN(lFloat) || isNaN(rFloat) )
			return false; //if they aren't number then they won't match
		
		if( lFloat == rFloat )
			return true;
		
		//try rounding to the same fixed decimal point
		var lRounded = lFloat.toFixed(self.consts.percentFixedPoint);
		var rRounded = rFloat.toFixed(self.consts.percentFixedPoint);
		if( lRounded == rRounded )
			return true;
		
		//try the truncate version instead
		var expNum =  Number("1e" + self.consts.percentFixedPoint);
		var lTrunc = (Math.floor(lFloat * expNum) / expNum);
		var rTrunc = (Math.floor(rFloat * expNum) / expNum);
		if( lTrunc == rTrunc )
			return true;
		
		return false;
	}
	
	self.getValidLayoutWidthPcts = function() {
		return self.refs.styleSheetManager.getValidLayoutWidthPcts(self.getDeviceFromWindowWidth());	
	}
	
	self.getActiveDom = function() {
		return self.isLiveView() ? self.refs.dwDom.browser.getWindow().document : self.refs.dwDom;
	}
		
	self.nodeListToArray = function(nodeList) {
		var list = [];
		for (var i = 0; i < nodeList.length; i++) {
			list.push(nodeList[i]);
		}
		return list;	
	}
	
	self.getValidLayoutDivWidths = function() {
		var colRects = self.data.gridColRects;
		if (colRects.length == 0) {
			return [];
		}
		var firstColLeft = colRects[0].left;
		var widths = [];
		colRects.forEach(function(colRect) {
			var width = colRect.right - firstColLeft;
			widths.push(width);
		});
		return widths;
	}
		
	self.getValidMarginLefts = function(startsNewRow) {
		var colRects = self.data.gridColRects;
		if (colRects.length == 0) {
			return [];
		}
		var colWidth = colRects[0].right - colRects[0].left;
		var gutterWidth = colRects[1].left - colRects[0].right;
		var validWidths = self.getValidLayoutDivWidths();
		var validMarginLefts = validWidths.map(function(validWidth){
				var marginLeft = validWidth - colWidth; 
				if (!startsNewRow) {			
					marginLeft += gutterWidth;
				}
				return marginLeft;
		});
		return validMarginLefts;			
	}

	self.selectDiv = function(overlayDiv) {
		var isSameDiv = (overlayDiv && overlayDiv == self.getSelectedOverlayDiv());
		if( !isSameDiv ) {
			//If we're changing selection, ensure we aren't still listening to mouse moves
			//incase the mouseup is somehow not balanced
			self.removeDragEditingEventListeners();
		}
		if (self.data.selectedUnderlyingDivId) {	
			// Unselect the currently selected div.
			var selectedOverlayDiv = self.getSelectedOverlayDiv();
			if (selectedOverlayDiv) {
				if (self.isDivMisaligned(selectedOverlayDiv)) {
					var newBorder = self.consts.misalignedDivBorder;
				} else {
					var newBorder = '';
				}
				self.setOverlayDivBorder(selectedOverlayDiv, newBorder);
				selectedOverlayDiv.style.backgroundColor = self.consts.overlayDivBgColor;
			}
			// We used to remove the translated attr 'hiliteChildrenOnSelect' here, but that
			// would make it so a user could not pop up the table column context menu, so
			// we don't remove it anymore.			
			self.data.selectedUnderlyingDivId = '';
		}
		if (overlayDiv)	{
			self.data.selectedUnderlyingDivId = overlayDiv.underlyingDivId; 
			self.setOverlayDivBorder(overlayDiv, self.consts.selectedBorder);
			overlayDiv.style.backgroundColor = self.consts.overlayDivBgColorSelected;
			if (self.isDesignView()) {
				//tell dw to not hilite the children when we select this div
				var underlyingDiv = self.getUnderlyingDiv(self.data.selectedUnderlyingDivId);
				if( underlyingDiv ) {
					underlyingDiv.setTranslatedAttribute('hiliteChildrenOnSelect', 'false');
				}
			}
		}
		self.ensureSelectedDivResizable();
		self.positionControls();
		if (self.flags.showProtos) {
			self.proto_showPi(overlayDiv != null);
		}
	}
		
	self.setOverlayDivBorder = function(div, border) {
		var oldBorderWidth = parseInt(div.style.borderWidth);
		if (isNaN(oldBorderWidth)) {
			oldBorderWidth = 0;
		}
		self.setDivBorder(div, border)
		var newBorderWidth = parseInt(div.style.borderWidth);
		if (isNaN(newBorderWidth)) {
			newBorderWidth = 0;
		}
		if (newBorderWidth > oldBorderWidth) {
			self.deflateDiv(div, newBorderWidth - oldBorderWidth);
		} else if (oldBorderWidth > newBorderWidth) {
			self.inflateDiv(div, oldBorderWidth - newBorderWidth);
		}
	}

	self.setDivBorder = function(div, border) {
		div.style.border = border;	
	}
		
	self.createOverlayDivs = function() {			
		if (self.refs.overlayDivs.length > 0) {
			self.destroyOverlayDivs();
		}
		var underlyingDivs = self.getUnderlyingDivs();
		underlyingDivs.forEach(function(underlyingDiv){			
			var div = self.createOverlayDiv(underlyingDiv)
			self.refs.overlayDivs.push(div);
			self.refs.document.body.appendChild(div);
		});
	}
		
	self.destroyOverlayDivs = function() {
		self.refs.overlayDivs.forEach(function(div){
			self.refs.document.body.removeChild(div);
		});
		self.refs.overlayDivs = [];
	}
	
	self.createOverlayDiv = function(underlyingDiv) {
		var overlayDiv = self.refs.document.createElement('div');
		overlayDiv.underlyingDivId = underlyingDiv.getAttribute('id');
		overlayDiv.style.position = 'absolute';
		overlayDiv.style.zIndex = 100;
		overlayDiv.style.backgroundColor = self.consts.overlayDivBgColor;
		overlayDiv.addEventListener('mouseover', self.onMouseOver_OverlayDiv);
		overlayDiv.addEventListener('mouseout', self.onMouseOut_OverlayDiv);
		return overlayDiv;
	}

	self.positionEdge = function(whichEdge) {
		// Position edge div.
		var edgeDiv = whichEdge == 'resize' ? self.refs.resizeEdgeDiv : self.refs.shiftEdgeDiv;			
		if (!self.data.selectedUnderlyingDivId) {
			if( self.flags.isDragging ) {
				self.refs.dwscripts.debugAlert("Attemping to hide the edges while dragging");
			}
			else {
				self.hideDiv(edgeDiv);
				self.hideDiv(self.refs.knobTop[whichEdge]);
				self.hideDiv(self.refs.knobMiddle[whichEdge]);
				self.hideDiv(self.refs.knobBottom[whichEdge]);
			}
			return;
		}		
		var selectedOverlayDiv = self.getSelectedOverlayDiv();
		if (!selectedOverlayDiv) {
			return;	
		}
		var edgeDivStyle = edgeDiv.style;		
		var selectedOverlayDivStyle = selectedOverlayDiv.style;
		// Left differs based on which edge we are positioning.					
		if (whichEdge == 'resize') {
			edgeDivStyle.left = parseInt(selectedOverlayDivStyle.left) + self.consts.selectedBorderWidth + 			
						parseInt(selectedOverlayDivStyle.width) + (self.consts.selectedBorderWidth / 2) - (self.consts.knobSize / 2) + 'px';						
		} else {
			edgeDivStyle.left = parseInt(selectedOverlayDivStyle.left) + (self.consts.selectedBorderWidth / 2) - (self.consts.knobSize / 2) + 'px';						
		}									
		// Top and height are the same whether we are positioning the resize or shift edge.
		edgeDivStyle.top = parseInt(selectedOverlayDivStyle.top) - (self.consts.selectedBorderWidth / 2) + 'px';
		edgeDivStyle.height = parseInt(selectedOverlayDivStyle.height) + (self.consts.selectedBorderWidth * 3) + 'px';
		// Position knob divs.
		self.refs.knobTop[whichEdge].style.top = parseInt(selectedOverlayDivStyle.top) + (self.consts.selectedBorderWidth / 2) - 
													(self.consts.knobSize / 2) + 'px';
		self.refs.knobTop[whichEdge].style.left = edgeDivStyle.left;
		self.refs.knobMiddle[whichEdge].style.top = parseInt(selectedOverlayDivStyle.top) + (parseInt(selectedOverlayDivStyle.height) / 2) + 
								self.consts.selectedBorderWidth - (self.consts.knobSize / 2) + 'px';
		self.refs.knobMiddle[whichEdge].style.left = edgeDivStyle.left;
		self.refs.knobBottom[whichEdge].style.top = parseInt(selectedOverlayDivStyle.top) + parseInt(selectedOverlayDivStyle.height) +
								(self.consts.selectedBorderWidth * 2) - (self.consts.selectedBorderWidth / 2) - (self.consts.knobSize / 2) + 'px';
		self.refs.knobBottom[whichEdge].style.left = edgeDivStyle.left;
		//		
		self.showDiv(edgeDiv);
		self.showDiv(self.refs.knobTop[whichEdge]);
		self.showDiv(self.refs.knobMiddle[whichEdge]);
		self.showDiv(self.refs.knobBottom[whichEdge]);
	}
		
	self.isLeftCloseEnough = function(colNum, left1, left2) {
		var marginOfError = colNum * 2; //Worst case error grows left to right at 1px per gutter + 1 px per col
		return Math.abs(left1 - left2) <= marginOfError;
	}

	self.isWidthCloseEnough = function(width1, width2) {
		var marginOfError = 5;
		return Math.abs(width1 - width2) <= marginOfError;
	}

	self.isDivMisaligned = function(div) {
		var isFirstDivInRow = false;
		for (var i = 0; i < self.refs.overlayDivs.length; i++) {
			if (self.refs.overlayDivs[i] == div) {
				if (i == 0 || self.getPosition(div).top != self.getPosition(self.refs.overlayDivs[i - 1]).top) {
					isFirstDivInRow = true;
					break;	
				}
			}
		}
		if (!isFirstDivInRow) {
			return false;	
		}
		var left = self.getPosition(div).left;
		var rects = self.data.gridColRects;
		for (var i = 0; i < rects.length; i++) {
			var validLeft = rects[i].left;
			var colNum = i + 1;
			if (self.isLeftCloseEnough(colNum, validLeft, left)) {
				return false;
			}
			else if( validLeft > left ) {
				return true; //none of the other divs to the right will match either
			}
		}
		return true;
	}
		
	self.positionDraggingDiv = function() {			
		if (!self.data.selectedUnderlyingDivId) {
			self.hideDiv(self.refs.draggingDiv);
			self.hideDiv(self.refs.dynamicTooltipDiv);
			return;
		}
		// Inflate div to make client rect size of actual.
		var selectedOverlayDiv = self.getSelectedOverlayDiv();
		if (!selectedOverlayDiv) {
			return;	
		}
		self.inflateDiv(selectedOverlayDiv, self.consts.selectedBorderWidth);
		var draggingDivStyle = self.refs.draggingDiv.style;
		var selectedOverlayDivStyle = selectedOverlayDiv.style;
		draggingDivStyle.left = selectedOverlayDivStyle.left;
		draggingDivStyle.top = selectedOverlayDivStyle.top;
		draggingDivStyle.width = selectedOverlayDivStyle.width;
		draggingDivStyle.height = selectedOverlayDivStyle.height;
		// Now deflate them based on respective border widths.
		self.deflateDiv(self.refs.draggingDiv, self.consts.draggingBorderWidth);
		self.deflateDiv(selectedOverlayDiv, self.consts.selectedBorderWidth);
		self.showDiv(self.refs.draggingDiv);
	}
	
	self.positionDynamicTooltipDiv = function() {
		//  This method should be called after the dragging div has been updated.
		var selectedOverlayDiv = self.getSelectedOverlayDiv();
		if (!self.flags.isDragging || !selectedOverlayDiv) {
			self.hideDiv(self.refs.dynamicTooltipDiv);
			return;	
		}
		var widthLabel = self.refs.dw.loadString('overlay/fluidGridLayout/width/label');
		var colLabel = self.refs.dw.loadString('overlay/fluidGridLayout/column/label');
		var marginLeftLabel = self.refs.dw.loadString('overlay/fluidGridLayout/marginLeft/label');					
		var left = parseInt(self.refs.draggingDiv.style.left) + self.consts.dynamicTooltipOffsetX;			
		if (self.flags.isResizing) {			
			var tentativeWidth = parseInt(self.refs.draggingDiv.style.width);
			left += tentativeWidth;
			var colSpan = self.getColSpanFromOffsetWidth(tentativeWidth);
			var width = self.refs.styleSheetManager.calcCssWidthFromColSpan(
				self.getDeviceFromWindowWidth(), 
				colSpan
			);
			self.refs.dynamicTooltipDiv.innerHTML = '<nobr>' + widthLabel + ' ' + width + '<br>' + colLabel + ' ' + colSpan + '</nobr>';
		} else { // isShifting
			var tentativeWidth = self.data.startingMarginDivWidth + self.data.mouseCurX - self.data.mouseStartX;
			var colShift = self.getColShiftFromMarginLeftPx(tentativeWidth);
			var marginLeft = self.refs.styleSheetManager.calcCssMarginLeftFromColShift(
				self.getDeviceFromWindowWidth(),
				colShift,
				self.startsNewRow(selectedOverlayDiv.underlyingDivId)
			);
			self.refs.dynamicTooltipDiv.innerHTML = '<nobr>' + marginLeftLabel + ' ' + marginLeft + '<br>' + colLabel + ' ' +  colShift + '</nobr>';
		}
		tipOffsetWidth = self.refs.dynamicTooltipDiv.offsetWidth ? self.refs.dynamicTooltipDiv.offsetWidth : 150; // offsetWidth is zero first time around.
		var isOutOfViewRight = (left + tipOffsetWidth) > self.refs.window.screen.availWidth + self.refs.document.body.scrollLeft;
		if (isOutOfViewRight) {
			left = self.refs.window.screen.availWidth - tipOffsetWidth + self.refs.document.body.scrollLeft;	
		}
		var top = self.data.mouseStartY + self.consts.dynamicTooltipOffsetY + self.refs.document.body.scrollTop;
		var isOutOfViewBottom = (top + self.refs.dynamicTooltipDiv.offsetHeight) > self.refs.window.screen.availHeight + self.refs.document.body.scrollTop;
		if (isOutOfViewBottom) {
			top = self.refs.window.screen.availHeight - self.refs.dynamicTooltipDiv.offsetHeight + self.refs.document.body.scrollTop;	
		}
		self.refs.dynamicTooltipDiv.style.left = left + 'px';
		self.refs.dynamicTooltipDiv.style.top = top + 'px';
		self.showDiv(self.refs.dynamicTooltipDiv);		
	}	

	self.getSelectedUnderlyingDiv = function() {
		if (!self.data.selectedUnderlyingDivId) {
			return null;	
		}
		return self.getUnderlyingDiv(self.data.selectedUnderlyingDivId);
	}
	
	self.getSelectedOverlayDiv = function() {
		if (!self.data.selectedUnderlyingDivId) {
			return null;	
		}
		return self.getOverlayDivById(self.data.selectedUnderlyingDivId);
	}
	
	self.getMouseOverOverlayDiv = function() {
		if (!self.data.mouseOverDivId) {
			return null;	
		}
		return self.getOverlayDivById(self.data.mouseOverDivId);
	}
	
	self.getOverlayDivById = function(divId) {
		for (var i = 0; i < self.refs.overlayDivs.length; i++) {
			var overlayDiv = self.refs.overlayDivs[i];
			if (overlayDiv.underlyingDivId == divId) {
				return overlayDiv;
			}
		}
		return null;
	}
	
	self.createEdgeDiv = function(whichEdge) {
		// Edge div
		var edgeDiv = self.refs.document.createElement('div');
		edgeDiv.style.position = 'absolute';
		edgeDiv.style.zIndex = 10001; // z-index one higher than the knobs.
		edgeDiv.style.width = self.consts.knobSize + 'px';
		edgeDiv.style.cursor = 'e-resize';
		edgeDiv.style.webkitUserSelect = "none";
		edgeDiv.addEventListener('mousedown', whichEdge == 'resize' ? self.onMouseDown_Resizing : self.onMouseDown_Shifting);
		self.refs[whichEdge == 'resize' ? 'resizeEdgeDiv' : 'shiftEdgeDiv'] = edgeDiv;
		self.hideDiv(edgeDiv);
		self.refs.document.body.appendChild(edgeDiv);
		// Knob divs (overlaid by edge div)
		self.refs.knobTop[whichEdge] = self.createKnobDiv();
		self.refs.knobMiddle[whichEdge] = self.createKnobDiv();
		self.refs.knobBottom[whichEdge] = self.createKnobDiv();
		// Tooltips
		if (whichEdge == 'resize') {
			edgeDiv.setAttribute('title', 'overlay/fluidGridLayout/resize/tooltip');
		} else { 
			edgeDiv.setAttribute('title', 'overlay/fluidGridLayout/shift/tooltip');			
		}
	}
	
	self.createKnobDiv = function() {
		var knobDiv = self.refs.document.createElement('div');
		knobDiv.style.position = 'absolute';
		knobDiv.style.zIndex = 10000;
		knobDiv.style.width = self.consts.knobSize + 'px';
		knobDiv.style.height = self.consts.knobSize + 'px';
		knobDiv.style.backgroundImage = "url(dw://Configuration/Overlays/CssGrids/images/knob.png)";
		knobDiv.style.webkitUserSelect = "none";
		self.hideDiv(knobDiv);
		self.refs.document.body.appendChild(knobDiv);
		return knobDiv;		
	}

	self.createDraggingDiv = function() {
		var draggingDiv = self.refs.document.createElement('div');		
		draggingDiv.style.position = 'absolute';			
		draggingDiv.style.border =  self.consts.draggingBorder;
		self.hideDiv(draggingDiv);			
		self.refs.document.body.appendChild(draggingDiv);
		self.refs.draggingDiv = draggingDiv;
	}		

	self.createDynamicTooltipDiv = function() {
		var div = self.refs.document.createElement('div');		
		div.style.position = 'absolute';
		div.style.backgroundColor = 'white';
		div.style.borderRadius = '10px';
		div.style.padding = '10px';
		div.style.border =  '1px solid #ccc';
		div.style.fontFamily = 'Arial';
		div.style.fontSize = '10pt';
		div.style.zIndex = 20000;
		self.hideDiv(div);			
		self.refs.document.body.appendChild(div);
		self.refs.dynamicTooltipDiv = div;
	}		

	self.snapSelectedDivToNearestValidWidth = function() {
		var newColSpan = self.getColSpanFromOffsetWidth(self.refs.draggingDiv.offsetWidth);
		self.data.selectedUnderlyingDivCurrentColSpan = newColSpan;
		var newWidthStr = self.refs.styleSheetManager.calcCssWidthFromColSpan(
			self.getDeviceFromWindowWidth(), 
			newColSpan
		);
		if (self.isLiveView()) { 
			if (self.refs.cssRuleBeingModified) {
				self.refs.cssRuleBeingModified.style.width = newWidthStr;
				self.syncOverlayDivs();
			}
		} else { // is design view
			if (self.flags.shouldDesignViewSnap) { 
				var ruleStr = self.getDefaultUserStyleSheetText() + self.refs.dwscripts.sprintf('#%s { width: %s !important; }', self.data.selectedUnderlyingDivId, newWidthStr);
				self.updateInternalStyleSheetDom(ruleStr);
			}
		}
	}
				
	self.getColSpanFromOffsetWidth = function(offsetWidth) {
		// Called for snapping to nearest valid col span and for converting valid width to valid col span.
		var smallestDiff = 100000;
		var nearestWidthIndex = -1;
		var validWidths = self.getValidLayoutDivWidths();
		validWidths.forEach(function(validWidth, i){			
			var diff = Math.abs(validWidth - offsetWidth);
			if (diff < smallestDiff) {
				nearestWidthIndex = i;
				smallestDiff = diff;	
			}
		});
		return nearestWidthIndex + 1;
	}
		
	self.getGridPropsRec = function() {
		return self.refs.styleSheetManager.getGridPropsRec(self.getDeviceFromWindowWidth());
	}
		
	self.getGridColRects = function() {
		var gridContainerStyle = self.getGridContainerStyle();
		if (!gridContainerStyle)		
			return [];
		var gridPropsRec = self.getGridPropsRec();
		var rects = [];			
		var curX = 0;		
		for (var i = 0; i < gridPropsRec.numCols; i++) {
			var rect = {};
			rect.left = curX;
			curX += gridPropsRec.colWidth;
			rect.right = curX;
			curX += gridPropsRec.gutterWidth;
			rects.push(rect);
		}		
		var stretchFactor = gridContainerStyle.width/gridPropsRec.allColsWidth;		
		var activeViewScale = self.getActiveViewScale();
		var bodyLeft = gridContainerStyle.paddingLeft + gridContainerStyle.borderLeftWidth + gridContainerStyle.marginLeft;
		rects = rects.map(function(rect){
			return {	
				left:  (Math.floor(rect.left * stretchFactor) / activeViewScale) + Math.floor(bodyLeft / activeViewScale), 
				right: (Math.floor(rect.right * stretchFactor) / activeViewScale) + Math.floor(bodyLeft / activeViewScale)
			};
		});	
		return rects;
	}			
	
	self.getActiveViewScale = function() {
		return self.isLiveView() ? self.refs.dw.activeViewScale : 1;
	}

	self.getGridContainerStyle = function() {
		var finalStyle = null;
		if (self.isLiveView()) {
			try {
				var win = self.refs.dwDom.browser.getWindow(); 
				//if the document is loading, wait for it
				if( win.document.body.childElementCount == 0 )
					return null;
				var gridContainerDiv = win.document.getElementsByClassName(self.consts.gridContainer);
				if (gridContainerDiv.length > 0) {
					gridContainerDiv = gridContainerDiv[0];
				} else {
					gridContainerDiv = win.document.body;
				}
				var gridContainerStyle = win.getComputedStyle(gridContainerDiv);
			} catch(e) {
				return null;
			}
			if (!gridContainerStyle) {
				return null; 
			}
			finalStyle = {
					width: parseInt(gridContainerStyle.width),
					paddingLeft: parseInt(gridContainerStyle.paddingLeft),
					borderLeftWidth: parseInt(gridContainerStyle.borderLeftWidth), 
					marginLeft: parseInt(gridContainerStyle.marginLeft)};
		} else { // is design view
			var gridContainerDiv = self.refs.dwDom.getElementsByClassName(self.consts.gridContainer); 
			if (gridContainerDiv.length > 0) {
				gridContainerDiv = gridContainerDiv[0];
			} else {
				gridContainerDiv = self.refs.dwDom.body;
			}
			finalStyle = {
				width: parseInt(gridContainerDiv.getComputedStyleProp('width')),
				paddingLeft: parseInt(gridContainerDiv.getComputedStyleProp('padding-left')),
				borderLeftWidth: parseInt(gridContainerDiv.getComputedStyleProp('border-left-width')), 
				marginLeft: parseInt(gridContainerDiv.getComputedStyleProp('margin-left'))};
				
			var maxWidth = parseInt(gridContainerDiv.getComputedStyleProp('max-width'));
			var minWidth = parseInt(gridContainerDiv.getComputedStyleProp('min-width'));
			if( finalStyle.width > maxWidth ) { 
				finalStyle.width = maxWidth;
			}
			if( finalStyle.width < minWidth ) {
				finalStyle.width = minWidth;
			}
		}
		
		if( !finalStyle )
			return null;
		if( isNaN(finalStyle.width) || (finalStyle.width <= 0) )
			return null;
		if( isNaN(finalStyle.paddingLeft))
			finalStyle.paddingLeft = 0;
		if( isNaN(finalStyle.borderLeftWidth))
			finalStyle.borderLeftWidth = 0;
		if( isNaN(finalStyle.marginLeft))
			finalStyle.marginLeft = 0;
		return finalStyle;
	}
	
	self.getGridContainerWidth = function() {
		var gridContainerStyle = self.getGridContainerStyle();
		return (gridContainerStyle ? gridContainerStyle.width : -1);
	}
	
	self.syncOverlayDivs = function() {
		self.syncSelectedDiv();
		var overlayDivs = self.refs.overlayDivs;
		for (var i = 0; i < overlayDivs.length; i++) {
			var overlayDiv = overlayDivs[i];
			if (overlayDiv.underlyingDivId == self.data.selectedUnderlyingDivId) {
				continue; // It was synced first.
			}
			var underlyingDiv = self.getUnderlyingDiv(overlayDiv.underlyingDivId);
			if( !underlyingDiv ) {
				return;
			}
			overlayDiv.style.top = self.getPosition(underlyingDiv).top + 'px';
			overlayDiv.style.left = self.getPosition(underlyingDiv).left + 'px';
			self.setOverlayDivBorder(overlayDiv, ''); // Set to no border so setting the width from the user div's offset width works right.
			overlayDiv.style.width = underlyingDiv.offsetWidth + 'px';
			overlayDiv.style.height = underlyingDiv.offsetHeight + 'px';
			if (self.isDivMisaligned(overlayDiv)) {
				self.setOverlayDivBorder(overlayDiv, self.consts.misalignedDivBorder);
			} else if (self.data.mouseOverDivId == overlayDiv.underlyingDivId) {
				self.setOverlayDivBorder(overlayDiv, self.consts.hoverBorder);
			}
		}
		if (self.flags.debug) {
			self.debug_showWidths();
			self.debug_showColRects();
		}
	}
	
	self.getUnderlyingDiv = function (underlyingDivId) {
		// Returns a div that is in the DW dom or Live View dom depending on which view is showing.
		return self.getActiveDom().getElementById(underlyingDivId);	
	}
				
	self.syncSelectedDiv = function() {		
		if (!self.data.selectedUnderlyingDivId) {
			return;
		}
		var selectedOverlayDiv = self.getSelectedOverlayDiv();
		if (!selectedOverlayDiv) {
			self.selectDiv(null);
			return;	
		}
		var underlyingDiv = self.getSelectedUnderlyingDiv();
		if (!underlyingDiv) {
			self.selectDiv(null);
			return;	
		}
		self.setOverlayDivBorder(selectedOverlayDiv, self.consts.selectedBorder);
		selectedOverlayDiv.style.left = self.getPosition(underlyingDiv).left + 'px';
		selectedOverlayDiv.style.top = self.getPosition(underlyingDiv).top + 'px';
		selectedOverlayDiv.style.width = underlyingDiv.offsetWidth - (self.consts.selectedBorderWidth * 2) + 'px';
		selectedOverlayDiv.style.height = underlyingDiv.offsetHeight - (self.consts.selectedBorderWidth * 2) + 'px';
		var dragDiv = self.refs.draggingDiv;
		// Let the draggingDiv be whatever width the user indicates with the mouse.
		dragDiv.style.height = underlyingDiv.offsetHeight - (self.consts.draggingBorderWidth * 2) + 'px';
		self.positionControls(); 
	}
		
	self.selectOverlayDivById = function(id) {
		if (!id) {
			return;
		}
		for (var i = 0; i < self.refs.overlayDivs.length; i++) {
			var div = self.refs.overlayDivs[i];
			if (div.underlyingDivId == id) {
				self.selectDiv(div);
				return;
			}
		}
	}

	self.getDeviceFromWindowWidth = function() {
		var viewWidth = self.refs.dwDom.getViewActualSize()[0];
		viewWidth = Math.floor(viewWidth * self.getActiveViewScale());
		return self.refs.styleSheetManager.getDeviceFromWindowWidth(viewWidth);
	}
		
	self.showDiv = function(div) {
		div.style.display = '';
	}
	
	self.hideDiv = function(div) {
		div.style.display = 'none';
	}
		
	self.inflateDiv = function(div, amt) {
		div.style.width = parseInt(div.style.width) + (amt * 2) + 'px';
		div.style.height = parseInt(div.style.height) + (amt * 2) + 'px';
	}

	self.deflateDiv = function(div, amt) {
		div.style.width = parseInt(div.style.width) - (amt * 2) + 'px';
		div.style.height = parseInt(div.style.height) - (amt * 2) + 'px';
	}	
		
	self.snapSelectedDivToNearestValidLeft = function() {			
		var marginLeftPx = self.getPosition(self.refs.draggingDiv).left - self.data.marginsOffsetLeft;	
		var newColShift = self.getColShiftFromMarginLeftPx(marginLeftPx);
		self.data.selectedDivCurrentColShift = newColShift;
		var selectedOverlayDiv = self.getSelectedOverlayDiv();
		if (!selectedOverlayDiv) {
			return;	
		}		
		var newMarginLeft = self.refs.styleSheetManager.calcCssMarginLeftFromColShift(
			self.getDeviceFromWindowWidth(),
			newColShift, 
			self.startsNewRow(selectedOverlayDiv.underlyingDivId)
		);
		if (self.isLiveView()) {
			if (self.refs.cssRuleBeingModified) {
				self.refs.cssRuleBeingModified.style.marginLeft = newMarginLeft;
				self.syncOverlayDivs();
			}
		} else { // is design view
			if (self.flags.shouldDesignViewSnap) {
				var ruleStr = self.getDefaultUserStyleSheetText() + self.refs.dwscripts.sprintf('#%s { margin-left: %s !important; }', self.data.selectedUnderlyingDivId, newMarginLeft);
				self.updateInternalStyleSheetDom(ruleStr);
			}
		}
	}
		
	self.startsNewRow = function(underlyingDivId) {
		return self.getCssPropVal(underlyingDivId, "clear") == 'both';
	}

	self.getColShiftFromMarginLeftPx = function(marginLeftPx) {		
		var smallestDiff = 100000;
		var nearestMarginLeftIndex = -1;
		var selectedOverlayDiv = self.getSelectedOverlayDiv();
		if (!selectedOverlayDiv) {
			return;	
		}
		var validMarginLefts = self.getValidMarginLefts(self.startsNewRow(selectedOverlayDiv.underlyingDivId));
		validMarginLefts.forEach(function(validMarginLeft, i){				
			var diff = Math.abs(validMarginLeft - marginLeftPx);
			if (diff < smallestDiff) {
				nearestMarginLeftIndex = i;
				smallestDiff = diff;	
			}
		});
		return nearestMarginLeftIndex; 
	}
		
	self.createStartsRowDiv = function() {
		var startsRowDiv = self.refs.document.createElement('div');
		startsRowDiv.style.position = 'absolute';
		startsRowDiv.style.zIndex = 1000;
		startsRowDiv.style.cursor = 'pointer';
		startsRowDiv.style.width = "16px";
		startsRowDiv.style.height = "16px";
		startsRowDiv.setAttribute("class", "startsRow");
		self.refs.startsRowDiv = startsRowDiv;
		self.hideDiv(startsRowDiv);
		self.refs.document.body.appendChild(startsRowDiv);
	}		
			
	self.positionStartsRowDiv = function () {
		if (!self.data.selectedUnderlyingDivId) {
			self.hideDiv(self.refs.startsRowDiv);
			return;
		}
		var selectedOverlayDiv = self.getSelectedOverlayDiv();
		if (!selectedOverlayDiv) { 
			return;
		}
		var isFirstOverlayDiv = selectedOverlayDiv == self.refs.overlayDivs[0];
		if (isFirstOverlayDiv && !self.isDivMisaligned(selectedOverlayDiv)) {
			// Don't show 'move up a row' button if this is the very first div and it's not misaligned.
			self.hideDiv(self.refs.startsRowDiv);
			return;			
		}
		if (self.startsNewRow(selectedOverlayDiv.underlyingDivId)) {
			self.refs.startsRowDiv.setAttribute('class', 'moveUpRow');
			self.refs.startsRowDiv.setAttribute('title', 'overlay/fluidGridLayout/moveUpRow/tooltip');
			var pos = self.calcButtonPos('top', 'right', selectedOverlayDiv);
		} else { // Does not start new row
			var showLeftArrow = self.isDivMisaligned(selectedOverlayDiv);	
			if (showLeftArrow) {
				self.refs.startsRowDiv.setAttribute('class', 'moveLeft');
				self.refs.startsRowDiv.setAttribute('title', 'overlay/fluidGridLayout/clickToAlign/tooltip');
				var pos = self.calcButtonPos('top', 'left', selectedOverlayDiv);
			} else {
				self.refs.startsRowDiv.setAttribute('class', 'startNewRow');
				self.refs.startsRowDiv.setAttribute('title', 'overlay/fluidGridLayout/startNewRow/tooltip');
				var pos = self.calcButtonPos('bottom', 'right', selectedOverlayDiv);
			}
		}
		self.refs.startsRowDiv.style.left = pos.left + "px";
		self.refs.startsRowDiv.style.top = pos.top + "px";
		self.showDiv(self.refs.startsRowDiv);
	}
	
	self.calcButtonPos = function(whereVert, whereHorz, selectedOverlayDiv) {
		var selectedOverlayDivStyle = selectedOverlayDiv.style;		
		if (whereHorz == 'left') {
			var left = parseInt(selectedOverlayDivStyle.left) + (self.consts.selectedBorderWidth / 2) - (self.consts.knobSize / 2) -
						self.consts.startsNewRowButtonGapSize - self.consts.startsNewRowButtonWidth;
			var isOutOfView = left < self.refs.document.body.scrollLeft;
			if (isOutOfView) {
				left += self.consts.knobSize + (self.consts.startsNewRowButtonGapSize * 2) + self.consts.startsNewRowButtonWidth;
			}
		} else if (whereHorz == 'right') {
			var left = parseInt(selectedOverlayDivStyle.left) + parseInt(selectedOverlayDivStyle.width) + 
						(self.consts.selectedBorderWidth * 2) - (self.consts.selectedBorderWidth / 2) + (self.consts.knobSize / 2) +
						self.consts.startsNewRowButtonGapSize;
			var isOutOfView = (left + self.consts.startsNewRowButtonWidth) > (self.refs.window.screen.availWidth + self.refs.document.body.scrollLeft);
			if (isOutOfView) {
				left -= self.consts.knobSize + (self.consts.startsNewRowButtonGapSize * 2) + self.consts.startsNewRowButtonWidth;
			}
		}
		if (whereVert == 'top') {
			var top = parseInt(selectedOverlayDivStyle.top) + (self.consts.selectedBorderWidth / 2) - (self.consts.knobSize / 2);
			if (isOutOfView) {
				top += self.consts.knobSize;				
			}
		} else if (whereVert == 'bottom') {
			var top = parseInt(selectedOverlayDivStyle.top) + parseInt(selectedOverlayDivStyle.height) +
						(self.consts.selectedBorderWidth * 2) - (self.consts.selectedBorderWidth / 2) + (self.consts.knobSize / 2) -
						self.consts.startsNewRowButtonWidth;
			if (isOutOfView) {
				top -= self.consts.knobSize;				
			}
		}		
		return {top: top, left: left};
	}
	
	self.toggleStartsRow = function() {
		var selector = '#' + self.data.selectedUnderlyingDivId;
		self.refs.styleSheetManager.toggleStartsNewRow(self.getDeviceFromWindowWidth(), selector);
		// Select the node again right now to prevent the selection from jumping around in code
		// view on the mac.
		self.setUserNodeSelected(true); 
		self.ensureSelectedDivStillVisible();
	}
		
	self.createMarginDiv = function() {
		var marginDiv = self.refs.document.createElement('div');			
		marginDiv.style.position = 'absolute';			
		marginDiv.style.backgroundColor = 'red';
		marginDiv.style.opacity = '.2';
		self.refs.marginDiv = marginDiv;
		self.hideDiv(marginDiv);
		self.refs.document.body.appendChild(marginDiv);				
	}

	self.positionMarginDiv = function() {
		var marginDiv = self.refs.marginDiv;
		if (!self.data.selectedUnderlyingDivId) {
			self.hideDiv(marginDiv);
			return;
		}		
		var marginLeft = self.getCssPropVal(self.data.selectedUnderlyingDivId, "margin-left", "int");
		if (marginLeft == 0) {
			self.hideDiv(marginDiv);
			return;				
		}
		var selectedUnderlyingDiv = self.getSelectedUnderlyingDiv();
		if (!selectedUnderlyingDiv) {
			return;	
		}
		marginDiv.style.top = self.getPosition(selectedUnderlyingDiv).top + 'px';
		marginDiv.style.height = selectedUnderlyingDiv.offsetHeight + 'px';
		marginDiv.style.width = marginLeft + 'px';
		marginDiv.style.left = self.getPosition(selectedUnderlyingDiv).left - marginLeft + 'px';
		self.showDiv(marginDiv);
	}
		
	self.getCssPropVal = function(elemId, prop, expectedReturnType) {
		var returnType = 'string';
		if (expectedReturnType == 'int') {
			returnType = 'int';
		}
		var strVal = '';
		if (self.isLiveView()) {
			var computedStyle = self.refs.dwDom.browser.getWindow().getComputedStyle(self.getUnderlyingDiv(elemId));
			if (computedStyle) {
				strVal = computedStyle.getPropertyValue(prop);
			}
		} else {
			var underlyingDiv = self.getUnderlyingDiv(elemId);
			if (underlyingDiv) {
				strVal = underlyingDiv.getComputedStyleProp(prop);
			}
		}
		if (returnType == 'string') {
			return strVal;			
		}
		var intVal = parseInt(strVal);
		if (isNaN(intVal)) {
			intVal = 0;		
		}
		intVal = Math.floor(intVal / self.getActiveViewScale());
		return intVal;						
	}
	
	self.findRuleForDiv_LiveView = function(div) {
		var liveViewWin = self.refs.dwDom.browser.getWindow();
		var rules = liveViewWin.getMatchedCSSRules(div, '');
		if (!rules) {
			return null;	
		}
		// The last matching rule that has a width should be
		// the one we want.
		for (var i = rules.length - 1; i >= 0; i--) {
			var rule = rules[i];
			if (rule.style.width) {
				return rule;
			}
		}
		return null;		
	}
	
	self.findRuleForSelectedUnderlyingDiv_LiveView = function() {		
		var liveViewWin = self.refs.dwDom.browser.getWindow();
		var div = liveViewWin.document.getElementById(self.data.selectedUnderlyingDivId);
		return self.findRuleForDiv_LiveView(div);
	}	

	self.createColumnDivs = function() {	
		var maxNumCols = self.refs.styleSheetManager.getMaxNumColsAllDevices();		
		for (var i = 0; i < maxNumCols; i++) {
			var div = self.refs.document.createElement('div');
			div.style.position = 'absolute';
			div.style.top = '0px';
			div.style.height = '100%';
			div.style.backgroundColor = 'rgb(150,0,0)';
			div.style.display = 'none';
			div.style.opacity = '.1';
			div.style.zIndex = 0;
			self.refs.document.body.appendChild(div);
			self.refs.columnDivs.push(div);				
		}			
	}
		
	self.updateColumns = function() {
		if (self.refs.columnDivs.length == 0) {
			self.createColumnDivs();
		}
		var numVisibleCols = self.data.gridColRects.length;
		for (var i = 0; i < self.refs.columnDivs.length; i++) {
			var div = self.refs.columnDivs[i];
			if (i < numVisibleCols && !self.flags.disabledForZoom) {
				var rect = self.data.gridColRects[i];
				div.style.left = rect.left + 'px';
				div.style.width = (rect.right - rect.left) + 'px';
				div.style.display = '';
			} else {
				div.style.display = 'none';
			}
		}	
	}
	
	//If the div was visible when we started, ensure it's still visible as we edit
	self.ensureSelectedDivStillVisible = function() {
		var divToScroll;
		if (self.isDesignView()) {
			if( !self.data.selectedUnderlyingDivId )
				return;
			divToScroll = self.refs.dwDom.getElementById(self.data.selectedUnderlyingDivId);
		}
		else {
			divToScroll = self.getSelectedUnderlyingDiv();
		}
		
		if (!divToScroll) {
			return;	
		}
		
		var clientRect = divToScroll.getBoundingClientRect();
		var windowHeight = divToScroll.ownerDocument.defaultView.innerHeight;
		
		if(clientRect.top < 0 && clientRect.bottom < 0 )
		{
			//The div is scrolled above, move the bottom into view
			divToScroll.scrollIntoView(false);
		}
		else if(clientRect.top > windowHeight && clientRect.bottom > windowHeight)
		{
			//The div is scrolled below, move top into view
			divToScroll.scrollIntoView(true);
		}
	}
	
	//Makes sure the right edge resizes are always visible
	self.ensureSelectedDivResizable = function() {
		var selectedOverlayDiv = self.getSelectedOverlayDiv();
		if (!selectedOverlayDiv) {
			return;	
		}
		//verify that the right edge is alway accessible and not wider than what a user can scroll to
		var minWidthNeeded = self.refs.document.documentElement.scrollWidth - (self.consts.selectedBorderWidth*2 + self.consts.knobSize/2);
		var unscrollableSize = (parseInt(selectedOverlayDiv.style.left) + parseInt(selectedOverlayDiv.style.width)) - minWidthNeeded;
		if (unscrollableSize > 0) {
			selectedOverlayDiv.style.width = (parseInt(selectedOverlayDiv.style.width) - unscrollableSize) + "px";
		}
	}
		
	self.setUserNodeSelected = function(setEvenInDesignView) {
		if( self.isDesignView() && !setEvenInDesignView )
			return;
		if( !self.data.selectedUnderlyingDivId )
			return;
		var userDom = self.refs.dwDom;
		var userNode = userDom.getElementById(self.data.selectedUnderlyingDivId);
		var delayShowingCaretUntilEditsFinishes = self.isDesignView() && userDom.isDesignViewPaginationPending();
		if( userNode && userNode != userDom.getSelectedNode() )
			userDom.setSelectedNode(userNode, false, false, true, delayShowingCaretUntilEditsFinishes);
	}
	
	//This is the default text applied to the user style sheet, for now it adds a slight background to the conatiner divs so you can see them
	self.getDefaultUserStyleSheetText = function() {
		if( !self.isInited() ) {
			return "";
		}
		return "." + self.consts.gridContainer + " { background-color: " + self.consts.gridContainerBgColor + "; }\n";
	}
	
	self.updateInternalStyleSheetDom = function(textToWrite, evenIfNotDesignView) {
		//this only applies to design view
		if( !self.isDesignView() && !evenIfNotDesignView ) {
			return;
		}
		//future optimization, internally the DOM that's open only by a script (not an open user doc)
		//will get unloaded between user events like each mouse move.In order to persist the DOM 
		//and our changes we have to constantly open, write, and save it. Some addtional
		//internal work needs to get done to allow this to persist until we're done with it and
		//only get it once per instance
		self.refs.internalStyleSheetDom = self.refs.dw.getDocumentDOM(self.consts.internalCssFileUrl);
		if( self.refs.internalStyleSheetDom ) {
			if( self.refs.internalStyleSheetDom.documentElement.outerHTML != textToWrite)
			{
				self.refs.internalStyleSheetDom.documentElement.outerHTML = textToWrite;
				self.refs.internalStyleSheetDom.saveFile();
				self.refs.dwDom.attachInternalStyleSheet(self.consts.internalCssFileUrl);
			}
		}
		self.syncOverlayDivs();
	}
	
	self.getPosition = function( ele ) {
		var result = { top : 0, left : 0 };
		
		while( ele ) {
			result.top += ele.offsetTop;
			result.left += ele.offsetLeft;
			ele = ele.offsetParent;
		}
		
		return result;
	}
	
	//////////// Prototype code. /////////////////////////////////////////////////////////////////////////////////	
	
	self.proto_positionPi = function() {
		var div = self.refs.document.getElementById('pi');
		var style = div.style;
		style.top = screen.height - div.offsetHeight - 20 + 'px';
		style.left = screen.width / 2 - div.offsetWidth / 2 + 'px';
	}
		
	self.proto_showPi = function(show) {
		var piDiv = self.refs.document.getElementById('pi');
		if (show) {
			piDiv.style.display = '';
			var selectedUnderlyingDiv = self.getSelectedUnderlyingDiv();
			if (!selectedUnderlyingDiv) {
				return;	
			}
			self.refs.document.getElementById('startsNewRowCheckbox').checked = self.startsNewRow(self.data.selectedUnderlyingDivId);
			self.refs.document.getElementById('colShiftInput').value = 
				self.getColShiftFromMarginLeftPx(self.getCssPropVal(self.data.selectedUnderlyingDivId, 'margin-left', 'int'));
			self.refs.document.getElementById('colSpanInput').value = 
				self.getColSpanFromOffsetWidth(selectedUnderlyingDiv.offsetWidth);
			self.proto_positionPi();
		} else {
			piDiv.style.display='none';
		}
	}
		
	//////////// Useful debugging functions.  //////////////////////////////////////////////////////
	
	self.debug_showWidths = function() {
		self.refs.overlayDivs.forEach(function(overlayDiv){
			overlayDiv.style.backgroundColor = 'white';
			overlayDiv.innerHTML = 'offsetLeft: _offsetLeft; offsetWidth: _offsetWidth;'
				.replace(/_offsetLeft/, self.getPosition(overlayDiv).left)
				.replace(/_offsetWidth/, overlayDiv.offsetWidth);
		});	
	}
		
	self.debug_showColRects = function() {
		var rects = self.data.gridColRects;
		var debugStr = '';
		rects.forEach(function(rect, i){
			debugStr += '   ' + (i + 1) + ': left:' + rect.left + '; right: ' + rect.right + '\r\n'
		});
		if (!self.refs.rects) {
			self.refs.rects = [];
			for (var i = 0; i < 24; i++) {
				var div = self.refs.document.createElement('div');
				div.style.position = 'absolute';
				div.style.top = '10px';
				div.style.height = '10px';
				div.style.backgroundColor = 'yellow';
				self.refs.document.body.appendChild(div);
				self.refs.rects.push(div);
			}
		}
		self.refs.rects.forEach(function(div, i){
			if (i < rects.length) {
				div.style.display = '';
				div.style.left = rects[i].left + 'px';
				div.style.width = rects[i].right - rects[i].left + 'px';
				div.innerHTML = 'left: _left; width: _width; screen.height: _screenHeight' 
					.replace(/_left/, rects[i].left)
					.replace(/_width/, rects[i].right - rects[i].left)
					.replace(/_screenHeight/, self.refs.dwDom.browser.getWindow().screen.height);
			} else {
				div.style.display = 'none';
			}
		});			
	}		
	
	self.debug_dump = function() {
		// General useful function for help during debugging.  Set self.flags.showDebugButton to true
		// to show a button in the top left of the overlay that calls this function when clicked.
		alert(self.debug_getDumpStr());
	}
	
	self.debug_getDumpStr = function() {
		var lines = [];
		if (1) {
			lines.push('self.refs.dw.activeViewScale: ' + self.refs.dw.activeViewScale);
			lines.push('self.getActiveViewScale(): ' + self.getActiveViewScale());
			lines.push('self.refs.dw.getViewSize(): ' + self.refs.dw.getViewSize());		
			lines.push('self.refs.dw.getViewDesiredSize()[0]: ' + self.refs.dwDom.getViewDesiredSize()[0]);
			if (self.isDesignView()) {
				lines.push('design body width: ' + self.refs.dwDom.body.getComputedStyleProp('width'));
				lines.push('design body padding-left: ' + self.refs.dwDom.body.getComputedStyleProp('padding-left'));
				lines.push('design body margin-left: ' + self.refs.dwDom.body.getComputedStyleProp('margin-left'));
				lines.push('design body border-left-width: ' + self.refs.dwDom.body.getComputedStyleProp('border-left-width'));
			} else {
				lines.push('live view body width: ' + self.refs.dwDom.browser.getWindow().getComputedStyle(self.refs.dwDom.browser.getWindow().document.body).width);
				lines.push('live view body padding-left: ' + self.refs.dwDom.browser.getWindow().getComputedStyle(self.refs.dwDom.browser.getWindow().document.body).paddingLeft);
				lines.push('live view body margin-left: ' + self.refs.dwDom.browser.getWindow().getComputedStyle(self.refs.dwDom.browser.getWindow().document.body).marginLeft);
				lines.push('live view body border-left-width: ' + self.refs.dwDom.browser.getWindow().getComputedStyle(self.refs.dwDom.browser.getWindow().document.body).borderLeftWidth);
			}		
			lines.push('self.getGridColRects(): ' + self.debug_dumpGridColRects());		
			lines.push('self.getUnderlyingDivs().length ' + self.getUnderlyingDivs().length);
		}
		if (1) {
			lines.push('getValidLayoutWidthPcts(): ' + self.getValidLayoutWidthPcts());
			lines.push('self.getDeviceFromWindowWidth(): ' + self.getDeviceFromWindowWidth());
			lines.push('self.refs.dwDom.getViewActualSize()[0]: ' + self.refs.dwDom.getViewActualSize()[0]);
			lines.push('self.refs.window.screen.availWidth: ' + self.refs.window.screen.availWidth);
		}
		return lines.join('\n');		
	}

	self.debug_dumpGridColRects = function() {		
		var str = '';
		self.data.gridColRects.forEach(function(rect){
			if (str) {
				str += ', ';
			}
			str += '{left: ' + rect.left + ', right: ' + rect.right + '}';
		});
		return str;	
	}
}

