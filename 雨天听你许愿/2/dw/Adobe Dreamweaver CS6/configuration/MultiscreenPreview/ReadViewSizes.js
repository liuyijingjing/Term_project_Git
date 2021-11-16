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

function readViewSizes()
{
	var sizes = {
			smallWidth: 320,
			smallHeight: 300,
			mediumWidth: 768,
			mediumHeight: 300,
			largeWidth:  1126,
			largeHeight: 300
		};
		
	var str = DWfile.read(dreamweaver.getConfigurationPath() + "/MultiscreenPreview/viewSizes.txt");
	if (str)
	{
		var saveSizes = eval("(" + str + ")");	
		if (saveSizes)		
			sizes = saveSizes;
	}	
	
	return sizes;
}