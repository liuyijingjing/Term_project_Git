// Copyright 2008 Macromedia, Inc. All rights reserved.

var _gMeerMeerDWService = "BL";
var scope = "";
function isDOMRequired()
{
  return false;
}

function receiveArguments()
{
	//set the scope of shortcut & menu
	scope = arguments[0];

	//call the previewInMeerMeer function
	var aServiceExtension = null;	
	var previewDocObject = getPreviewDocArgs();		
	var housingPlugIn = dw.housingPlugIn();
	if ((previewDocObject != null) && housingPlugIn)
	{
		var bMeerMeerSWFCreated = dw.flash.controlExists(_gMeerMeerDWService);
		if (!bMeerMeerSWFCreated) //was just created above.
		{
			//queue a browser request- so the panel when it completely initialized can pick it up.
			MM._BrowserLab_Init_Preview_Object = previewDocObject;

			//create/load the adobe meermeer swf/js
			dw.loadCSXSExtension(_gMeerMeerDWService);
		}
		else
		{
			
			if (isSiteSelection)
			{
				if (!site.isExpanded())
				{
					dw.loadCSXSExtension(_gMeerMeerDWService);
				}
			}
			else
			{
				dw.loadCSXSExtension(_gMeerMeerDWService);	
			}
						
			//check the offline flag...
			var isOffLineXMLCall = '<invoke name="isOffline" returntype="xml"><arguments></arguments></invoke>';
			var isOffLineRet = dw.flash.controlEvent(_gMeerMeerDWService, isOffLineXMLCall);  
			var bIsOffline = (isOffLineRet == "<true/>");                             
			if (bIsOffline)
			{
				var offLineModeMsg = dw.loadString("meermeerdw/panel/offlineMode1");
				offLineModeMsg+="\n\n";
				offLineModeMsg+=dw.loadString("meermeerdw/panel/offlineMode2");
				alert(offLineModeMsg);
				return;
			}

			//form the argument list
			previewDocArgs =  '<object>';
			previewDocArgs += '<property id="localFileURI"><string><![CDATA[' + previewDocObject.localFileURI + ']]></string></property>';		
			previewDocArgs += '<property id="previewURI"><string><![CDATA[' + previewDocObject.previewURI + ']]></string></property>';
			previewDocArgs += '<property id="isRemoteOnly"><string><![CDATA[' + previewDocObject.isRemoteOnly + ']]></string></property>';
			previewDocArgs += '</object>';

			var notifyPreviewInMeerMeerString = '<invoke name="previewInMeerMeer" returntype="xml"><arguments>' + previewDocArgs + '</arguments></invoke>';
			dw.flash.controlEvent(_gMeerMeerDWService, notifyPreviewInMeerMeerString);
		}
	}		
}

function isSiteSelection(scope)
{
	var bIsSiteSelection = false;		
	if ((scope == 'DWContext_LocalSite_PIB_MeerMeer')  || 
		(scope == 'DWContext_LocalFiles_PIB_MeerMeer') || 
		(scope == 'DWContext_RemoteSite_PIB_MeerMeer')|| 
		(scope == 'DWSiteFileMenuPopup_PIB_MeerMeer') || 
		(scope == 'SiteOptionsFileMenu_PIB_MeerMeer'))
	{
		bIsSiteSelection = true;
	}
	return bIsSiteSelection;
}


function getPreviewDocArgs()
{
	var aDocURI = null;
	var aPreviewURI = null;	
	var bStatus = true;
		
	var bIsFileToolBarPopUp = (scope == 'DWPopup_PIB_MeerMeer');
	var bIsFileMenuPopUp = (scope == 'DWMenu_File_PIB_MeerMeer');
	
	if (bIsFileToolBarPopUp || bIsFileMenuPopUp)
	{
		//get the doc info for the current file being inside DW Editor
		retObject = getCurrentDocInfoInEditor();
	}
	else
	{
		//get the doc info for the current file being inside the Site File Browser
		retObject = getDocInfoInSite(scope);
	}
			
	//form the args XML format if all the pre-conditions were met	
	if (retObject.bStatus)
	{
		//url encode the preview uri
		retObject.previewURI =  dw.doURLEncoding(retObject.previewURI, "", true, true);
	}
	return retObject;
}

function getCurrentDocInfoInEditor()
{
	var retObject = new Object();
	var bStatus = true;
	var aDocURI = null;
	var aPreviewURI = null;	
	
	//active document preview
	var currentDocument = dw.getDocumentDOM();
	if (currentDocument)
	{
		//sync the design view to code view before the call
		currentDocument.refreshView('code');			
		if (currentDocument.URL.length == 0) 
		{
		  //ask the user to save the document
		  var saveMessage = dw.loadString("meermeerdw/panel/saveFile");
		  if (confirm(saveMessage)) 
		  {
		      if (dw.canSaveDocument(dw.getDocumentDOM())) 
		      {
		          dw.saveDocument(dw.getDocumentDOM());
		      }		      
		      //still empty
		      if (currentDocument.URL.length == 0)
		      {
		    	  bStatus = false; //unable to save file.
		      }		      
		  }
		  else
		  {
			  bStatus = false; //unable to save file.
		  }
		}
		
		var aDocURI = currentDocument.URL;
		var aSite = site.getSiteForURL(aDocURI);
		if (aSite.length == 0)
		{				
		    bStatus = false; //site not inside a file.		    
			var fileNotInSiteMsgA = dw.loadString("meermeerdw/panel/fileNotInSite_A");
			var fileNotInSiteMsgB = dw.loadString("meermeerdw/panel/fileNotInSite_B");
			var fileName = dwscripts.getSimpleFileName(aDocURI);
			var fileExt = dwscripts.getFileExtension(aDocURI);
			fileName = fileName + "." + fileExt;
			fileNotInSiteMsgA = dwscripts.sprintf(fileNotInSiteMsgA, fileName);
			alert(fileNotInSiteMsgA + "\r\n" + fileNotInSiteMsgB);						    
		}						
		if (bStatus)
		{
			//change the current document to parent html container instead of related file document  
			var relatedFilePath = dw.getActiveRelatedFilePath();
			if (relatedFilePath.length)
			{
				currentDocument = dw.getActiveWindow();
				aDocURI = currentDocument.URL;
			}
		}
	}
	
	if (aDocURI && (aDocURI.length > 0))
	{
		aPreviewURI = aDocURI;
		//if site is defined and site app url prefix (testing server) is defined 
	    if (site.getAppURLPrefixForSite() && site.getAppURLPrefixForSite() != "http://")
	    {
	    	aPreviewURI = dwscripts.getSiteRelativePath(aPreviewURI);
	    	aPreviewURI = aPreviewURI.replace(/\\|:/g, "/");
	    	aPreviewURI = site.getAppURLPrefixForSite() + aPreviewURI;	    	
	    }			
	}

	//form a return object
	retObject.bStatus = bStatus;
	retObject.localFileURI = aDocURI;
	retObject.previewURI = aPreviewURI;
	retObject.isRemoteOnly = false;
	
	return retObject;
}

function getDocInfoInSite(scope)
{
	var retObject = new Object();
	var bStatus = false;
	var aDocURI = null;
	var aPreviewURI = null;	
	var isRemoteOnly = false;
	
	var bIsSiteLocalSiteSelection = (scope == 'DWContext_LocalSite_PIB_MeerMeer');
	var bIsSiteLocalFilesSelection = (scope == 'DWContext_LocalFiles_PIB_MeerMeer');	
	var bIsSiteRemoteSiteSelection = (scope == 'DWContext_RemoteSite_PIB_MeerMeer');
	var bIsSiteFileMenuPopup = ((scope == 'DWSiteFileMenuPopup_PIB_MeerMeer') || (scope == 'SiteOptionsFileMenu_PIB_MeerMeer'));	
	
	if (bIsSiteFileMenuPopup) //from the Expanded Site Window -> File -> PIB.
	{
		if (site.getFocus() == "remote")
		{
			bIsSiteRemoteSiteSelection = true;
		}
		else
		{
			bIsSiteLocalFilesSelection = true;
		}
	}
	
	//document in site selected preview		
	var fileList = new Array();		
	if (bIsSiteLocalSiteSelection || bIsSiteLocalFilesSelection)		
	{
		fileList = site.getSelection();
		
		if (fileList.length >= 1)
		{
			//get the first file in list 
			aDocURI = fileList[0]; 
		}		
		
		//siteless
		var curServerSite = site.getCurrentServerSite(); 
		if (curServerSite && curServerSite.length)
		{
			var aPreviewRetObject = getPreviewURIPathOnServer(aDocURI, curServerSite);
			if (aPreviewRetObject.bStatus)
			{
				aDocURI = ""; //clear the local file uri;
				aPreviewURI = aPreviewRetObject.previewURI; 
		    	isRemoteOnly = true;
				bStatus = true;						
			}					
		}
		else
		{
			//local site.
			if (aDocURI && (aDocURI.length > 0))
			{
		    	bStatus = true;	
				aPreviewURI = aDocURI;
				//if site is defined and site app url prefix (testing server) is defined 
			    if (site.getAppURLPrefixForSite() && site.getAppURLPrefixForSite() != "http://")
			    {
			    	aPreviewURI = dwscripts.getSiteRelativePath(aPreviewURI);
			    	aPreviewURI = aPreviewURI.replace(/\\|:/g, "/");
			    	aPreviewURI = site.getAppURLPrefixForSite() + aPreviewURI;
			    }			
			}				
		}
	}
	else if (bIsSiteRemoteSiteSelection)
	{
		fileList = site.getRemoteSelection();
		if (fileList.length >= 1)
		{
			//get the first file in list 
			aDocURI = fileList[0]; 
		}		
		var aPreviewRetObject = getPreviewURIPathOnServer(aDocURI, site.getCurrentSite());
		if (aPreviewRetObject.bStatus)
		{
			aDocURI = ""; //clear the local file uri;
			aPreviewURI = aPreviewRetObject.previewURI; 
	    	isRemoteOnly = true;
			bStatus = true;		    	
		}		
	}
		
	//form the ret object
	retObject.bStatus = bStatus;
	retObject.localFileURI = aDocURI;
	retObject.previewURI = aPreviewURI; 
	retObject.isRemoteOnly = isRemoteOnly;
	
	return retObject;
}


function getPreviewURIPathOnServer(aDocURI, aSiteName)
{
	//remove the remoteRoot to form the site relative path.
	var retObject = new Object();
	retObject.bStatus = false;
	
	var remoteFilePath = aDocURI;
	
	var bIsSiteLess = site.getIsServerSite(aSiteName);
	if (bIsSiteLess)
	{
		//siteless tree browser lab preview		
		//trim off the remote root.		
		remoteFilePath = site.getRelativeRemotePathFromSFEPath(aDocURI);			
		var remoteRoot = site.getRemoteRoot();	
		if (remoteFilePath.indexOf(remoteRoot) == 0)
		{
			remoteFilePath = remoteFilePath.substr(remoteRoot.length);
		}		
		//if app url prefix is defined 
		var appServerURLPrefix = site.getAppURLPrefixForSite(aSiteName);
	    if (appServerURLPrefix && appServerURLPrefix != "http://")
	    {	
			//form the preview path to server location
	    	aPreviewURI = remoteFilePath;
	    	aPreviewURI = aPreviewURI.replace(/\\|:/g, "/");
	    	aPreviewURI = appServerURLPrefix + aPreviewURI;
	    	retObject.previewURI = aPreviewURI;
	    	retObject.bStatus = true;
	    }		
	}
	else 
	{
		//remote tree browser lab preview.
		retObject.previewURI = site.remotePathToURL(aDocURI);
	    retObject.bStatus = true;
	}		
    
    return retObject;
}

function getSiteIndex(aSiteName)
{		
  var siteIndex = -1;
  var siteSummarySection = "Sites\\-Summary";
  var noOfSites = dw.getPreferenceInt(siteSummarySection, "Number of Sites", 0);
  for (var i=0; i < noOfSites; i++)
  {
     siteSection = "Sites\\-Site" + i;
     siteName = dw.getPreferenceString(siteSection, "Site Name");
     if(siteName == aSiteName)
	 {
		siteIndex = i;
		break;
	 }	
  }
  return siteIndex;
}


function getServerURLPrefix(aSite)
{
  var serverURLPrefix = site.getAppURLPrefixForSite(aSite);
  return serverURLPrefix;
}


function canAcceptCommand()
{
	//set the scope of shortcut & menu
	scope = arguments[0];
		
	var bCanAccept = true;

	var bIsFileToolBarPopUp = (scope == 'DWPopup_PIB_MeerMeer');
	var bIsFileMenuPopUp = (scope == 'DWMenu_File_PIB_MeerMeer');

	var bIsSiteLocalSiteSelection = (scope == 'DWContext_LocalSite_PIB_MeerMeer');
	var bIsSiteLocalFilesSelection = (scope == 'DWContext_LocalFiles_PIB_MeerMeer');	
	var bIsSiteRemoteSiteSelection = (scope == 'DWContext_RemoteSite_PIB_MeerMeer');	
	
	var bIsSiteFileMenuPopup = ((scope == 'DWSiteFileMenuPopup_PIB_MeerMeer') || (scope == 'SiteOptionsFileMenu_PIB_MeerMeer'));	

	if (bIsSiteFileMenuPopup) //from the Expanded Site Window -> File -> PIB.
	{
		if (site.getFocus() == "remote")
		{
			bIsSiteRemoteSiteSelection = true;
		}
		else
		{
			bIsSiteLocalFilesSelection = true;
		}
	}
	
	
	if (bIsFileToolBarPopUp || bIsFileMenuPopUp)
	{
		//active document preview
		var currentDocument = dw.getDocumentDOM();
		if (currentDocument)
		{
			//sync the design view to code view before the call
			currentDocument.refreshView('code');
			aDocURI = currentDocument.URL;
			var relatedFilePath = dw.getActiveRelatedFilePath();
			if (relatedFilePath.length)
			{
				bCanAccept = true;
				return bCanAccept;
			}			
		}
		else
		{
			bCanAccept = false;
		}		
	}
	else
	{
		if (bIsSiteLocalSiteSelection || bIsSiteLocalFilesSelection || bIsSiteRemoteSiteSelection)
		{
			//document in site selected preview		
			var fileList = new Array();		
			if (bIsSiteLocalSiteSelection || bIsSiteLocalFilesSelection)
			{
				fileList = site.getSelection();
			}
			else if (bIsSiteRemoteSiteSelection)
			{
				fileList = site.getRemoteSelection();
			}					
			if (fileList.length >= 1)
			{
				//get the first file in list 
				aDocURI = fileList[0]; 
			}
			else
			{
				bCanAccept = false;
			}
		}
	}
			
	if (bCanAccept)
	{
		var fileExt = dwscripts.getFileExtension(aDocURI);
		fileExt = fileExt.toLowerCase();
		if (fileExt.length == 0)
		{
			//get the extension if extension is missing , assume it to be folder (which is non browserable), hence
			//disable the preview
			bCanAccept = false;
		}
		else if ((fileExt == "css") || 
				 (fileExt == "js")  || 
				 (fileExt == "txt") || 
				 (fileExt == "gif") || 
				 (fileExt == "jpeg")|| 
				 (fileExt == "png") || 
				 (fileExt == "jpg") ||
				 (fileExt == "flv") ||
				 (fileExt == "swf") ||
				 (fileExt == "fla"))
		{
			//disable it for .css, .js files and other media image types
			bCanAccept = false;
		}
	}

	return bCanAccept;
}

function getDynamicContent(itemID)
{
	var newList = new Array();
	var meermmerServiceName = dw.loadString("meermeerdw/menu/menuLabel");
	if (itemID == "DWPopup_PIB_MeerMeer")
	{
		var MENU_strPreviewIn = dw.loadString('Menus/MM/PIB_Dynamic/MENU_strPreviewIn');		
		newList[0] = MENU_strPreviewIn + meermmerServiceName + "\tCmd+Shift+F12" + ";id='"+ itemID +"'";
	}
	else
	{
		//drop the preview in string, just display the service name
		newList[0] = meermmerServiceName + "\tCmd+Shift+F12" + ";id='"+ itemID +"'";
	}
	scope = itemID;	
	return newList;
}
