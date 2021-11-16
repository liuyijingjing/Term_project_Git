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
**************************************************************************/

function loadOverlay(dom) 
{
	if (!dom)
		return;

	if(!shouldShowLayoutDivManipulator(dom))
	{
		// We aren't needed anymore.
		
		var overlayBrowser = dom.getOverlayView('CssGrids.LayoutDivManipulator');
		if (overlayBrowser) 
		{
			var layoutDivManipulator = overlayBrowser.getWindow().layoutDivManipulator;
			if (layoutDivManipulator && layoutDivManipulator.shutdown)
			{
				layoutDivManipulator.shutdown();
			}
		}
		
		dom.unloadOverlayView('CssGrids.LayoutDivManipulator'); 
		return;
	}

	var overlayBrowser = dom.getOverlayView('CssGrids.LayoutDivManipulator');
	
	if (overlayBrowser) 
	{
		if( overlayBrowser.getWindow() )
		{
			var ldm = overlayBrowser.getWindow().layoutDivManipulator;
			if( ldm && !ldm.isInited() ) {
				ldm.init();
			}
		}
		return; // Already loaded.
	}

	overlayBrowser = dom.loadOverlayView('CssGrids.LayoutDivManipulator');

	function createLayoutDivManipulator() 
	{
		var win = overlayBrowser.getWindow();
		// Attach these objects since they aren't attached automatically in webkit docs.
		win.dw = dw;
		win.dwscripts = dwscripts;
		win.DWfile = DWfile;
		win.overlayCtrl = overlayBrowser;
		
		overlayBrowser.getWindow().createLayoutDivManipulator(dom.URL); // Creates the LayoutDivManipulator JS object.
		
		overlayBrowser.removeEventListener('DocumentCompleted', createLayoutDivManipulator);
	}
	
	overlayBrowser.addEventListener('DocumentCompleted', createLayoutDivManipulator);
	var fileUrl = dw.getConfigurationPath() + '/Overlays/CssGrids/LayoutDivManipulator.htm';
	overlayBrowser.openURL(fileUrl);
}

function shouldShowLayoutDivManipulator(dom)
{
	if (dw.getPreferenceString("CSS Layout Framework Preferences", "Visible Editor", "FALSE") == 'FALSE')
		return false;

	if (dom.getHideAllVisualAids())
		return false;

	return true;
}

function isFluidGridDoc(dom) 
{
    var styleSheetManager = new CssGrids.StyleSheetManager(dw, dom, dwscripts, DWfile, new StyleSheet(dw))
    return styleSheetManager.beQuiet(true).loadGridProps();
}

function prefsSayUseFluidMedia()
{
	var prefSetting = dw.getPreferenceString("General Preferences", "Use Fluid Media", "check").toLowerCase();
	return ( prefSetting == "check" || prefSetting == "always" || prefSetting == "true" );
}
