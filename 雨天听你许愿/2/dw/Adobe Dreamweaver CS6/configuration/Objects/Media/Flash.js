// Copyright 2001-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.
function isDOMRequired() { 
  // return true.  This will insert the object into the design view.
  return true;
}

function isAsset() {
	return true;
}

function objectTag(assetArgs)
{
	var dom = dw.getDocumentDOM();
	if (!dom)
	{
		return '';
	}

	if (dom.getIsLibraryDocument())
	{
		alert(dw.loadString("flash/cant insert into library"));
		return '';
	}

	var sel = dom.getSelection(true);
	if( selectionIsContainedInTagOfType(sel, "MMTEMPLATE:EDITABLE", dom, false) )
	{
		alert(dw.loadString("flash/cant insert into editable region"));
		return '';
	}
    
	var filePath = dw.getDocumentPath("document");
	var isSiteRelative = false;
	var siteRoot = "";

	if (filePath)
		siteRoot = site.getSiteRootForURL(filePath);
    	
	if (siteRoot != "")
	{
		var siteName = site.getSiteForURL(filePath);
		isSiteRelative = site.getDefaultRelativeTo(siteName) == "site";
	}
	
	// save document if not saved
	if (!filePath) 
	{
		var saveDocMsg = dw.loadString("flash/save before insert");
		if (confirm(saveDocMsg) && dw.canSaveDocument(dreamweaver.getDocumentDOM())) 
		{
			dw.saveDocument(dreamweaver.getDocumentDOM());
			filePath = dw.getDocumentPath("document");
			
			if (filePath)
				siteRoot = site.getSiteRootForURL(filePath);
    	
			if (siteRoot != "")
			{
				var siteName = site.getSiteForURL(filePath);
				isSiteRelative = site.getDefaultRelativeTo(siteName) == "site";
			}
	
			if (assetArgs)
			{
				if (isSiteRelative)
					assetArgs = dw.absoluteURLToSiteRelative(filePath, siteRoot, assetArgs);
				else
					assetArgs = dw.absoluteURLToDocRelative(filePath, siteRoot, assetArgs);
			}
		}
	}
 
	if (!filePath)
	return '';
        
	var theObj = dom.getSelectedNode();
	while (theObj) 
	{
		theObj = theObj.parentNode;
		if (theObj && theObj.nodeType == 1 && theObj.nodeName.toLowerCase() == "object") 
		{
			alert(dw.loadString("Flash/no flash inside alt content"));
			return '';
		}
	}
    
	var bDialogState = dw.getShowDialogsOnInsert();

	// Return the html tag that should be inserted

	var theMovie = '';

	if (dw.appName == "Contribute")
	{
		var filter = new Array(dw.loadString("insert doc dialog/flash doc desc") + " (*.swf)|*.swf|");
		theMovie = dw.browseForFileURL("open", "", false, "", filter, "", "", "desktop");
	}
	else
	{
		var fileTypeDescription = dw.loadString("flash/file type");
		var filter = new Array(fileTypeDescription + " (*.swf)|*.swf|");
		theMovie = dw.browseForFileURL("select", dw.loadString("flash/title"), false, false, filter);
	}
	
	if (theMovie != '')
	{
		theMovie = dw.doURLEncoding(theMovie);
	}

	if (assetArgs)
	{
		theMovie = assetArgs;
	}

	if ((theMovie == '') && bDialogState)
	{
		return '';
	}

	var id = dwscripts.getUniqueId("FlashID");
	var assetList = new Array();
	var assetInfo = new AssetInfo("Shared/Flash/"+FlashObjectLibraryFile, "Scripts/"+FlashObjectLibraryFile, "javascript", false);
	assetList.push(assetInfo);
    
	assetInfo = new AssetInfo("Shared/Flash/expressInstall.swf", "Scripts/expressInstall.swf", "", false);
	assetList.push(assetInfo);
    
	var expInstallPath = "Scripts" + dwscripts.FILE_SEP;
	var absoluteExpInstallPath;
    
	if (siteRoot == "")
	{
		var docBase = filePath.substring(0, filePath.lastIndexOf('/')+1);
		absoluteExpInstallPath = docBase + expInstallPath;
	}
	else
	{
		absoluteExpInstallPath = siteRoot + expInstallPath;
	}
        
	if (isSiteRelative)
		expInstallPath = dw.absoluteURLToSiteRelative(filePath, siteRoot, absoluteExpInstallPath, true);
	else
		expInstallPath = dw.absoluteURLToDocRelative(filePath, siteRoot, absoluteExpInstallPath, true);

	expInstallPath += "expressInstall.swf";

	var useEntities = isDoubleByteOrUtf8Encoding() == false;
	var innerObjComment = dw.loadString("flash/comment for inner object tag");
	var expressInstallComment = dw.loadString("flash/comment for express install");
	var altContentComment = dw.loadString("flash/comment for alternative content");
	var getNewPlayerMsg = dw.loadString("flash/get new player message");
	var altValueForImg = dw.loadString("flash/alt attribute value for get player image");

	if (useEntities)
	{
		getNewPlayerMsg = dwscripts.entityNameEncode(getNewPlayerMsg);
		altValueForImg = dwscripts.entityNameEncode(altValueForImg);
	}
    
	var docType = dom.documentType;
	var isASP = docType.indexOf("ASP") != -1;
    
	if (isASP)
	{
		rtnStr = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + 
				' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" width="32" height="32">\n' + 
				'<param name="movie" value="' + theMovie + '"> <param name="quality" value="high">\n' + '<param name="wmode" value="opaque">\n' +
				'<embed src="' + theMovie +
				'" quality="high" wmode="opaque" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" ' +
				'type="application/x-shockwave-flash" width="32" height="32">' +
				'</embed></object>';
	}
	else
	{
		var paramTags = '<param name="quality" value="high">\n' +
		        '<param name="wmode" value="opaque">\n' +
		        '<param name="swfversion" value="9.0.28.0">\n';
		var expressInstallParam = '<param name="expressinstall" value="' + expInstallPath + '">\n';
		
		rtnStr = '<object id="' + id + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="50" height="50">\n' + 
		        '<param name="movie" value="' + theMovie + '">\n' +
		        paramTags + '<!-- ' + expressInstallComment + ' -->\n' + expressInstallParam +
		        '<!-- ' + innerObjComment + ' -->\n' +
		        '<!--[if !IE]>-->\n' +
		        '<object type="application/x-shockwave-flash" data="' + theMovie + '" width="50" height="50">\n' +
		        '<!--<![endif]-->\n' +
		        paramTags + expressInstallParam +
		        '<!-- ' + altContentComment + ' -->\n' +
		        '<div>\n<h4>' + getNewPlayerMsg + '</h4>\n' +
		        '<p><a href="http://www.adobe.com/go/getflashplayer">' +
		        '<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="' +
		        altValueForImg + '" />' +
		        '</a></p>\n</div>' +
		        '<!--[if !IE]>-->\n</object>\n<!--<![endif]-->\n' +
		        '</object>';
    }
    
	prefsAccessibilityOption = dw.getPreferenceString("Accessibility", "Accessibility Media Options", "");

	if (prefsAccessibilityOption == 'TRUE')
	{
		rtnStr = addAccessibility(rtnStr);
	}

	if (!isASP)
	{
		dom.copyAssets(assetList);
 	
		var scriptStr = FlashObjectFuncName + '("' + id + '");';
		dom.addJavaScript(scriptStr, false);
	}
    
	return rtnStr;
}


function addAccessibility(rtnStr) {
   var cmdFile = dreamweaver.getConfigurationPath() + "/Commands/Object Options.htm";
   var cmdDOM = dreamweaver.getDocumentDOM(cmdFile);
 
   cmdDOM.parentWindow.setFormItem(rtnStr);
   dreamweaver.popupCommand("Object Options.htm");
   return (cmdDOM.parentWindow.returnAccessibilityStr(rtnStr));	
}
