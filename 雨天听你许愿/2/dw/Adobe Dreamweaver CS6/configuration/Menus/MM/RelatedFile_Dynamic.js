// Copyright 2007 Adobe Systems Incorporated All Rights Reserved.

var relatedFileByRealName = null;
var activeRelatedFileURL = null;

function receiveArguments()
{
    if (relatedFileByRealName == null || activeRelatedFileURL == null)
        return false;

	var menuItem = arguments[0];
	
	// Open the related doc for the selected ID.
	var i=parseInt(menuItem);	
	
	// Get the real RelatedFile names so we can open
	dw.openRelatedFile(relatedFileByRealName[i]);
}


function canAcceptCommand()
{
    // Just accept it for now.  
    // TODO: Neet to put a logic only accept if the doc is a parent
    
	return true;
}

function isCommandChecked()
{
    if (relatedFileByRealName == null || activeRelatedFileURL == null)
        return false;
        
    var itemId = arguments[0];
    var i = parseInt(itemId);
 
    // Put a checkmark next to the currently active related doc
	if (activeRelatedFileURL == relatedFileByRealName[i])
	{
	    return true;
	}
    else
	    return false;
}

function getDynamicContent(itemID)
{   
	var relatedFiles = null;
	var i = 0;
	var separatorChar = '/';
	var UseMenuNames = false;
	
	// Keep this for this session.
    relatedFileByRealName = dw.getRelatedFiles(UseMenuNames);
	activeRelatedFileURL = dw.getActiveRelatedFilePath();

	// Instead of real file name use SOURCE HTML and GENERATED SOURCE for menu.
	UseMenuNames = true;
	var docList = dw.getRelatedFiles(UseMenuNames);
  
	if (docList.length > 0)
	{
	  relatedFiles = new Array(docList.length);
		for (i = 0; i < docList.length; i++)
		{
		    // Remove the path, and show filenames only.
			relatedFiles[i] = new String(docList[i].substring(docList[i].lastIndexOf(separatorChar)+1));
			
			// Add an id
			relatedFiles[i] += ";id='" + i + "'";
			
			// [myoneyama 6/12/08] #241324.  For menu, show url unescaped name.
			relatedFiles[i] = unescape(relatedFiles[i]);
			
			// "_" shouldn't be removed from the display file name.
			relatedFiles[i] = relatedFiles[i].replace(/_/g, "%_");
		}
	}

	return relatedFiles;
}
