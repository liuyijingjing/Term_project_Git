// Copyright 2000-2007 Adobe Systems Incorporated.  All rights reserved.

function receiveArguments()
{
    var selection = dw.getSelection();
    if (!selection) return false;

    var node      = dw.offsetsToNode( selection[0], selection[1] );

    if (!node || node.tagName == undefined)
	    return false;

	var imageSrc = node.getAttribute("src");
	if (!imageSrc) return false;
    
    var fullPath = getFullPath(imageSrc);
    if (!fullPath || fullPath.length == 0) return false;

    // We encode the path to the editor
    //  as the menu argument below
    var editorURL="";
    var editorURL = unescQuotes(arguments[0]);


    // if we open image in FW and FW source is available -> use FW source
    var useFireworks = (editorURL != "" && editorURL.toLowerCase().indexOf("fireworks") >= 0);
    var notesFile = MMNotes.open(fullPath);
    var sourceFilePath = "";
    var FWPath = "";
    
    if (notesFile)
    {
        if(useFireworks)
            FWPath = MMNotes.get(notesFile, "fw_source");

        sourceFilePath = (FWPath != "" ? FWPath : MMNotes.get(notesFile, "FilePathSrc"));
        MMNotes.close(notesFile);

        if (sourceFilePath)
	        fullPath = dw.resolveOriginalAssetFileURLToAbsoluteLocalFilePath(sourceFilePath, fullPath);
    }

    // Check for Browse menu option
    if (editorURL == "ExtEd:Browse") 
    {
      dw.openWithBrowseDialog(fullPath);
      return true;
    }
    else 
    {
      dw.openWithImageEditor(fullPath, editorURL);
      return true;
    }
}

function canAcceptCommand()
{
    var selection = dw.getSelection();
    if (!selection) return false;

    var node = dw.offsetsToNode( selection[0], selection[1] );
    if (!node || node.tagName == undefined)
    	return false;

    var imageSrc = node.getAttribute("src");
    if (!imageSrc) return false;

    var fullPath = getFullPath(imageSrc);
    if (!fullPath || fullPath.length == 0) return false;

    if (selection && node && imageSrc && fullPath)
    {
        var notesFile = MMNotes.open(fullPath);
        var sourceImageFilePath = "";
        if (notesFile)
        {
            // Photoshop file
            sourceImageFilePath = MMNotes.get(notesFile, "FilePathSrc");
            if (sourceImageFilePath.length == 0)
                sourceImageFilePath = MMNotes.get(notesFile, "fw_source");// Fireworks file

            MMNotes.close(notesFile);
            if (sourceImageFilePath)
                return true;
        }
    }

    return false;
}

function getDynamicContent()
{
    var selection = dw.getSelection();
    if (!selection) return null;
    
    var node = dw.offsetsToNode( selection[0], selection[1] );
    if (!node || node.tagName == undefined) return null;

    var imageSrc = node.getAttribute("src");
    if (!imageSrc)	return null;

    var fullPath = getFullPath(imageSrc);
    if (!fullPath || fullPath.length == 0) return null;

    var hasSourceImage = false;

    var notesFile = MMNotes.open(fullPath);
    var sourceImageFilePath = "";

    var menuItems = null;
            
    if (notesFile)
    {
  	    // Photoshop file
        sourceImageFilePath = MMNotes.get(notesFile, "FilePathSrc");
        
        if (sourceImageFilePath.length == 0)
            sourceImageFilePath = MMNotes.get(notesFile, "fw_source"); // Fireworks file

	    MMNotes.close(notesFile);
	    if (sourceImageFilePath)
	    {
		    fullPath = sourceImageFilePath;
		    hasSourceImage = true;
	    }
    }


    if (hasSourceImage) 
    {
        var primaryEditorName = ""
        var primaryEditorURL = "";
        var required = 0;
        var hasPrimary = false;

        // get the primary external editor for the selected item
        var primaryEditorArray = dw.getPrimaryExtensionEditor(fullPath);
        
        if (primaryEditorArray.length >= 2) 
        {
            primaryEditorName = primaryEditorArray[0];
            primaryEditorURL = primaryEditorArray[1];
    
    	  	if (primaryEditorName && primaryEditorName.length > 0 && primaryEditorURL && primaryEditorURL.length > 0) 
    	  	{
                hasPrimary = true;
                ++required;
            } 
        }

        // get the external editors for the selected item
        // suppress the photoshop item for non PS-files because they have different entries in the design notes
        var isPhotoshopfile = (fullPath.length > 4 && fullPath.substr(fullPath.length - 4, 4).toLowerCase() == ".psd");

        // retrieve the list of editors and paths to the editors
        var externalEditorArray = dw.getExtensionEditorList(fullPath);

        // First we count so we can pre-allocate
        //  the array to the correct size for better performance
        for (i = 0; i < externalEditorArray.length; i += 2) 
        {

            var editor = externalEditorArray[i + 1];
            if (!editor || editor.length == 0)
                continue;
            if (editor != primaryEditorURL) 
            {
                var editorName = externalEditorArray[i].toLowerCase();
                if (!editorName || editorName.length == 0)
                    continue;
                
                if (!isPhotoshopfile && editorName.indexOf("photoshop") >= 0)
                    ; // if it's not a photoshop file and photoshop is the editor then skip it
                else
                    ++required; 
            }
        }

        ++required; // add one more for browse...

        // we have computed the size 
        //  so alloc the array
        menuItems = new Array(required);
        var index = 0;

        // we have a primary so add it first
        if (hasPrimary)
            menuItems[index++] = primaryEditorName + ";id='" + escQuotes(primaryEditorURL) + "'";

        // now add the remaining items and skip over the primary
        for (i = 0; i < externalEditorArray.length; i += 2) 
        {
            var editor = externalEditorArray[i + 1];
            if (!editor || editor.length == 0)
                continue;

            if (editor != primaryEditorURL) 
            {
                var editorName = externalEditorArray[i].toLowerCase();
                if (!editorName || editorName.length == 0)
                    continue;
                
                if (!isPhotoshopfile && editorName.indexOf("photoshop") >= 0)
                    ; // if it's not a photoshop file and photoshop is the editor then skip it
                else 
                {
                    // otherwise, add it to the menu item array
                    //  We store the path to the editor as the argument
                    //  which is passed to receiveArguments above
                    menuItems[index++] = externalEditorArray[i] + ";id='" + escQuotes(externalEditorArray[i+1]) + "'";
                }
            }
        }
    }
    else 
    {
        // we just need the one element for browse...
        //  so alloc an array with 1 element 
        menuItems = new Array(1);
    }

    // always add Browse... to the bottom of the list
    var id = "ExtEd:Browse";
    menuItems[menuItems.length - 1] = MENU_Browse + ";id='" + escQuotes(id) + "'";

    return menuItems;
}
