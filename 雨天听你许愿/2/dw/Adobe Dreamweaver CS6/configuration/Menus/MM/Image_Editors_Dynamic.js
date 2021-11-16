// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

   function receiveArguments()
   {
	  var selection = dw.getSelection();
      var node      = dw.offsetsToNode( selection[0], selection[1] );
      if (!node) return false;
      var tagName = node.tagName;
      if (tagName == undefined) return false;
      var imageSrc  = node.getAttribute( "src" );
	  var fullPath = getFullPath(imageSrc);

	  // We encode the path to the editor
	  //  as the menu argument below
	  var editorURL = unescQuotes(arguments[0]);

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
          var node      = dw.offsetsToNode( selection[0], selection[1] );
          if (!node) return false;
      var tagName = node.tagName;
      if (tagName == undefined) return false;
      var imageSrc  = node.getAttribute( "src" );
	  if (selection && node && imageSrc)
	  	return true;
	  else
		return false;
   }

   function getDynamicContent()
   {
   
      var selection = dw.getSelection();
      if (!selection) return null;
      
      var node = dw.offsetsToNode( selection[0], selection[1] );
      if (!node) return null;
      
      var tagName = node.tagName;
      if (tagName == undefined) return null;
      
      var imageSrc = node.getAttribute("src");
      if (!imageSrc) return null;
      
      var fullPath = getFullPath(imageSrc);
      if (!fullPath || fullPath.length == 0) return null;

	  // get the primary external editor for the selected item
	  var primaryEditorArray = dw.getPrimaryExtensionEditor(fullPath);
	  var required = 0; // count of items
	  var hasPrimary = false;

      // remember the primaries
	  var primaryEditorName = ""
	  var primaryEditorURL = "";

	  // We must get a Editor Name / Executable Path pair back so check 
	  //    for empty or not the right number of return values 
	  if (primaryEditorArray.length >= 2)
	  {
	    // We may have gotten more than 1 pair back but who cares
	  	primaryEditorName = primaryEditorArray[0];
	  	primaryEditorURL = primaryEditorArray[1];

	  	if (primaryEditorName && primaryEditorName.length > 0 && primaryEditorURL && primaryEditorURL.length > 0) 
	  	{
	  	    hasPrimary = true;
	  	    ++required;
	  	}
      }
	  

      // get the external editors for the selected item
	  var externalEditorArray = dw.getExtensionEditorList(fullPath);

	  var i;

	  // First we count so we can pre-allocate
	  //  the array to the correct size for better performance
	  for (i = 0; i < externalEditorArray.length; i += 2) 
	  {
	      var editor = externalEditorArray[i + 1] ;
	      if (!editor || editor.length == 0)
	          continue;
	          
	      var editorName = externalEditorArray[i];
          if (!editorName || editorName.length == 0)
	          continue;
	          
	      if (editor != primaryEditorURL)
	          ++required;
	  }

	  ++required; // add one more for browse...

	  // we have computed the size 
	  //  so alloc the array
	  var menuItems = new Array(required);
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

	      var editorName = externalEditorArray[i];
	      if (!editorName || editorName.length == 0)
	          continue;
    
	      if (editor != primaryEditorURL) 
	      {
	          //  We store the path to the editor as the argument
	          //  which is passed to receiveArguments above
	          menuItems[index++] = externalEditorArray[i] + ";id='" + escQuotes(externalEditorArray[i + 1]) + "'";
	      }
	  }


	  // always add Browse... to the bottom of the list
	  var id = "ExtEd:Browse";
	  menuItems[menuItems.length - 1] = MENU_Browse + ";id='" + escQuotes(id) + "'";

	  return menuItems;
   }
