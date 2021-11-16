// Copyright (c) 2008. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.


function canAcceptCommand()
{
	return true;
}


// getDynamicContent returns the contents of a dynamically generated menu.
// returns an array of strings to be placed in the menu, with a unique
// identifier for each item separated from the menu string by a semicolon.
//
// return null from this routine to indicate that you are not adding any
// items to the menu

function getDynamicContent(itemID)
{	
	var menuItems = new Array();
	var housingPlugIn = dw.housingPlugIn();
	if(housingPlugIn)
	{
		var menuItemsCount = dw.getCSXSMenuItemsCount();
		if(menuItemsCount > 0)
		{
			var csxsMenuItems = dw.getCSXSMenuItems();
			for(i=0; i<menuItemsCount; i++)
			{
				menuItems[i] = csxsMenuItems[i];
			}
			menuItems.sort();
		}
	}
	return menuItems;
}


function receiveArguments()
{
	var extensionId = arguments[0];
	var housingPlugIn = dw.housingPlugIn();
	if(housingPlugIn)
	{
		dw.toggleCSXSExtension(extensionId);
	}
	if (extensionId == "photo_album") {
	  var swfPath = dw.getConfigurationPath();
	  swfPath += '/flash/PhotoAlbum.swf';
		dw.newFlashFloater(swfPath,'photo_album');
		dw.toggleFloater('photo_album');
		return;
	}
	if (extensionId == "dw.flash.newControl") {
	  var swfPath = dw.getConfigurationPath();
	  swfPath += '/flash/PhotoAlbum.swf';
	  var controlData = { };
	  controlData.swfUTF8Path = swfPath;
	  controlData.defaultGeometry = {
				  topleftx: 100,
				  toplefty: 200,
				  width: 600,
				  height: 400
				};

		dw.flash.newControl("com.scott.myPhotoAlbum","PanelWindow",controlData);
		eventData = { topleftx: 200, toplefty: 100 };
		dw.flash.requestStateChange("com.scott.myPhotoAlbum","Open",eventData);
		return;
	}
	if (extensionId == "Flex_SWF") {
	  var swfPath = dw.getConfigurationPath();
	  swfPath += '/flash/csxsTest.swf';
	  var controlData = { };
	  controlData.swfUTF8Path = swfPath;
	  controlData.defaultGeometry = {
				  topleftx: 100,
				  toplefty: 200,
				  width: 600,
				  height: 400
				};

		dw.flash.newControl("Flex_SWF","PanelWindow",controlData);
		eventData = { topleftx: 200, toplefty: 100, width : 600, height : 400};
		dw.flash.requestStateChange("Flex_SWF","Open",eventData);
		return;
	}
	if (extensionId == "Flickr") {
	  var swfPath = dw.getConfigurationPath();
	  swfPath += '/flash/Flickr.swf';
	  var controlData = { };
	  controlData.swfUTF8Path = swfPath;
	  controlData.defaultGeometry = {
				  topleftx: 100,
				  toplefty: 200,
				  width: 600,
				  height: 400
				};
		controlData.minSize = {
				  width: 600,
				  height: 400
				};
		controlData.maxSize = {
				  width: 700,
				  height: 500
				};				
		var scriptPath = dw.getConfigurationPath();
		scriptPath += '/flash/Flickr.js';
    controlData.scriptPath = scriptPath;
		dw.flash.newControl("Flickr","PanelWindow",controlData);
		eventData = { topleftx: 200, toplefty: 100, width : 600, height : 400};
		dw.flash.requestStateChange("Flickr","Open",eventData);
		return;
	}
}


function isCommandChecked()
{
	return dw.isCSXSExtensionOpen(arguments[0]);
}