// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.
var PLATFORM = navigator.platform;
var isMac = PLATFORM != "Win32";

	function receiveArguments()
	{		
		var whatToDo = arguments[0];
		var scope = arguments[1];
		var docPath;
		
		// SCOPE
		// First find out the scope we should be operating in (that's how we get
		// the docPath).

		if (scope == 'site') 
		{
			docPath = "site";
		}
		else if (scope == 'document')
		{
			docPath = dw.getDocumentPath('document');
			if (isMac && docPath == "" && dw.getFocus() == 'site')
			{
				docPath = "site";
				scope = "site";
			}
		}
		else if (scope == 'docSelection')
		{
			if (dw.getDocumentDOM())
			{
				docPath = dw.getDocumentDOM().getSelectionSrc();
			}
			else
			{
				return;
			}
		}
		else if (scope == 'reportResults')
		{
		  var item = dw.resultsPalette.siteReports.getSelectedItem();
		  var itemData = dw.resultsPalette.siteReports.getItem(item);
		  for (var d=0; d < itemData.length; d++)
		  {
		    if (typeof(itemData[d]) == "string" && itemData[d].indexOf('file:///') == 0)
		    {
		      docPath = itemData[d];
		      break;
		    }
		    else
		      docPath = "";
  	  }
	    if (docPath == "")
        return;
		}
		else if (scope == 'csspanel')
		{
		    var selecteditems = dw.cssStylePalette.getSelectedItems();
		    if(selecteditems.length != 1)
		    {
		        return;
		    }
		    var selObject = dw.cssStylePalette.getItemAt(selecteditems[0]);
		    if(selObject.type == "externalfile")
		    {
			    docPath = selObject.path;
			}
			else
			{
			    return;
			}
		}

    // WHAT TO DO
    // Next, find out what we're supposed to do, and act accordingly.

		if (whatToDo == "unlock")
		{
			if (scope == 'document')
			{
				dw.getDocumentDOM().makeEditable();
			}
			else
			{
				site.makeEditable();
			}
		}
		else if (whatToDo == "connect")
		{
			site.setConnectionState(!site.getConnectionState());
		}
		else if (whatToDo == "sethomepage")
		{
			site.setAsHomePage();
		}
		else if (whatToDo == "put")
		{
			if (site.canPut(docPath))
				site.put(docPath);
		}
		else if (whatToDo == "get")
		{
			if (site.canGet(docPath))
				site.get(docPath);
		}
		else if (whatToDo == "checkout")
		{
			if (site.canCheckOut(docPath))
				site.checkOut(docPath);
		}
		else if (whatToDo == "checkin")
		{
			if (site.canCheckIn(docPath))
				site.checkIn(docPath);
		}
		else if (whatToDo == "undocheckout")
		{
			if (site.canUndoCheckOut(docPath))
				site.undoCheckOut(docPath);
		}
		else if (whatToDo == "checkedoutby")
		{
			if (site.canShowCheckedOutBy(docPath))
				site.showCheckedOutBy(docPath);
		}
		else if (whatToDo == "findlocal")
		{
			site.locateInSite("local", docPath);
		}
		else if (whatToDo == "findremote")
		{
			site.locateInSite("remote", docPath);
		}
		else if (whatToDo == "findlocalremote")
		{
			site.locateInSite(site.getFocus(), docPath);
		}
		else if (whatToDo == "togglemap")
		{
			dw.toggleFloater('site map');
		}
		else if (whatToDo == "togglehidden")
		{
			site.toggleHiddenFiles();
		}
		else if (whatToDo == "compare")
		{
			site.compareFiles(docPath)
		}
		else if (whatToDo == "sync")
		{
			site.synchronize(scope);
		}
		else if (whatToDo == "selectnewer")
		{
			site.selectNewer(scope);
		}
		else if (whatToDo == "selectcheckedout")
		{
			site.selectCheckedOutFiles();
		}
		else if (whatToDo == "open")
		{
			if ((scope != "shortcutkey") || site.canOpen())
				site.open();
		}
		else if (whatToDo == "refresh")
		{
			site.refresh(scope);
		}
		else if (whatToDo == "deploysupportfiles")
		{
			site.showTestingServerBinDeployDialog();
		}
		else if (whatToDo == "newfile")
		{
			if (scope == "shortcut")
			{
				if (dw.getFocus() == 'site')
				{
					if ((site.getFocus() == 'site map') && site.canAddLink())
					{
						site.addLinkToNewFile()
					}
					else if ((site.getFocus() != 'site map') && site.canMakeNewFile())
					{
						site.makeNewDreamweaverFile();
					}
				}
				else
				{
					site.makeNewDreamweaverFile();
				}
			}
			else
			{	
				site.makeNewDreamweaverFile();
			}
		}
		else if (whatToDo == "newfolder")
		{
			site.makeNewFolder();
		}
		else if (whatToDo == "definesites")
		{
			site.defineSites();
		}
		else if (whatToDo == "definesitesBC")
		{
			site.defineSitesBC();
		}
		else if (whatToDo == "removeconnectionscripts")
		{
			alert(MMDB.removeConnectionScripts());
		}
		else if (whatToDo == "reports")
		{
			MM.CheckOutError = 0;
			dw.showReportsDialog();
		}
   }

   function canAcceptCommand()
   {   		
		var whatToDo = arguments[0];
		var scope = arguments[1];
		var docPath;

		if (scope == 'site') 
		{
			docPath = "site";
		}
		else if (scope == 'document')
		{
			docPath = dw.getDocumentPath('document');
			if (isMac && docPath == "" && dw.getFocus() == 'site')
			{
				docPath = "site";
				scope = "site";
			}
		}
		else if (scope == 'docSelection')
		{
			if (dw.getDocumentDOM())
			{
				docPath = dw.getDocumentDOM().getSelectionSrc();
			}
			else
			{
				return false;
			}
		}
		else if (scope == 'reportResults')
		{
		  var item = dw.resultsPalette.siteReports.getSelectedItem();
		  var itemData = dw.resultsPalette.siteReports.getItem(item);
		  for (var d=0; d < itemData.length; d++)
		  {
		    if (typeof(itemData[d]) == "string" && itemData[d].indexOf('file:///') == 0)
		    {
		      docPath = itemData[d];
		      break;
		    }
		    else
		      docPath = "";
  	  }
	    if (docPath == "")
        return false;
		}
		else if (scope == 'csspanel')
		{
		    var selecteditems = dw.cssStylePalette.getSelectedItems();
		    if(selecteditems.length != 1)
		    {
		        return false;
		    }
		    var selObject = dw.cssStylePalette.getItemAt(selecteditems[0]);
		    if(selObject.type == "externalfile")
		    {
			    docPath = selObject.path;
			}
			else
			{
			    return false;
			}
		}

		if (whatToDo == "unlock")
		{
			if (scope == 'document')
			{
				return dw.getDocumentDOM().canMakeEditable();
			}
			else
			{
				return site.canMakeEditable();
			}
		}
		else if (whatToDo == "connect")
		{
			return ((scope != 'document') && site.canConnect());
		}
		else if (whatToDo == "sethomepage")
		{
			if (site.getSelection().length == 1)
			{
				var urlPrefix = "file:///";
				var strTemp = site.getSelection()[0].substr(urlPrefix.length);
				
				if (strTemp.indexOf("/") == (-1))
					return false;
				
				if ((DWfile.getAttributes(site.getSelection()[0]) == null) ||
					(DWfile.getAttributes(site.getSelection()[0]).indexOf('D') == (-1)))
				{
					return true;
				}
			}
			
			return false;
		}
		else if (whatToDo == "put")
		{
			return site.canPut(docPath);
		}
		else if (whatToDo == "get")
		{
			return site.canGet(docPath);
		}
		else if (whatToDo == "checkout")
		{
			return site.canCheckOut(docPath);
		}
		else if (whatToDo == "checkin")
		{
			return site.canCheckIn(docPath);
		}
		else if (whatToDo == "undocheckout")
		{
			return site.canUndoCheckOut(docPath);
		}
		else if (whatToDo == "checkedoutby")
		{
			return site.canShowCheckedOutBy(docPath);
		}
		else if (whatToDo == "findlocal")
		{
			return site.canLocateInSite("local", docPath);
		}
		else if (whatToDo == "findremote")
		{
			return site.canLocateInSite("remote", docPath);
		}
		else if (whatToDo == "findlocalremote")
		{
			return site.canLocateInSite(site.getFocus(), docPath);
		}
		else if (whatToDo == "compare")
		{
			return site.canCompareFiles(docPath);
		}
		else if (whatToDo == "sync")
		{
			return site.canSynchronize();
		} 
		else if (whatToDo == "selectnewer")
		{
			return site.canSelectNewer(scope);
		}
		else if (whatToDo == "selectcheckedout")
		{
			return site.canSelectCheckedOutFiles();
		}
		else if (whatToDo == "open")
		{
			return site.canOpen();
		}
		else if (whatToDo == "refresh")
		{
			if (scope == "local")
			{
				return ((dw.getFocus(true) == 'site') && site.canRefresh('local'));
			}
			else if (scope == "remote")
			{
				return ((dw.getFocus(true) == 'site') && site.canRefresh('remote'));
			}
			else if (scope == "all")
			{
				return (site.canRefresh('local') || site.canRefresh('remote'));
			}
		}
		else if (whatToDo == "deploysupportfiles")
		{
			return (!site.serverActivity() &&
					((site.getServerModelNameForSite().indexOf('.NET') >= 0) ||
						(((dw.getFocus() == 'document') || (dw.getFocus() == 'textView')) &&
						(dw.getDocumentDOM().serverModel.getServerName().indexOf('.NET') >= 0))));
		}
		else if (whatToDo == "newfile")
		{
			return site.canMakeNewFile();
		}
		else if (whatToDo == "newfolder")
		{
			return site.canMakeNewFolder();
		}
		else if (whatToDo == "removeconnectionscripts")
		{
			return (!site.serverActivity() && (site.getCurrentSite() != ''));
		}
		else if (whatToDo == "reports")
		{
			return (dw.getFocus() != "browser");
		}
		
		return true;
   }

   function setMenuText()
   {
		var whatToDo = arguments[0];
		var scope = arguments[1];
 		
 		if (whatToDo == "connect")
		{
			if (site.getConnectionState() == true)
			{
				return MENU_Disconnect;
			}
			else
			{
				return MENU_Connect;
			}
		}
		else if (whatToDo == "togglemap")
		{
			if (dw.getFloaterVisibility("site map"))
			{
				return MENU_SiteFiles;
			}
			else
			{
				return MENU_SiteMap;
			}
		}
		else if (whatToDo == "compare")
		{
			if (scope == "document")
			{
   				if (site.isTestingServerSelected())
   					return MENU_CompareWithTesting;
   				else
   					return MENU_CompareWithRemote;
			}
			else
			{
   				if (site.canCompareFiles(scope))
   				{
   					var numSelectedFiles = site.getSelection().length
   					if (!site.isSiteMode())
   					{
   						return MENU_Compare;
   					}
   					else if (site.getFocus() == 'remote')
   					{
   						if (numSelectedFiles == 2)
   						{
   							if (site.isTestingServerSelected())
   								return MENU_CompareTesting;
   							else
   								return MENU_CompareRemote;
   						}
   						else
   							return MENU_CompareWithLocal;
   					}
   					else
   					{
   						if (numSelectedFiles == 2)
   							return MENU_CompareLocal;
   						else
   						{
   							if (site.isTestingServerSelected())
   								return MENU_CompareWithTesting;
   							else
   								return MENU_CompareWithRemote;
   						}
   					}
   				}
   				else 
   				{
   					if (!site.isSiteMode())
   						return MENU_Compare;
    				else if (site.isTestingServerSelected())
   						return MENU_CompareWithTesting;
   					else
   						return MENU_CompareWithRemote;
  				}
			}
		}
		
		return "";
   }
   
   function isCommandChecked()
   {
		var whatToDo = arguments[0];
		
  		if (whatToDo == "togglehidden")
		{
			return site.hiddenFilesShowing();
		}
		
		return false;
   }
 