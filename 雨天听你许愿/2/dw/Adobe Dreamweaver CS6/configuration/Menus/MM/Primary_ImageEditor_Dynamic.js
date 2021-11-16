// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

// Possibility to create images
// (in case there is a image placeholder selected)

function	receiveArguments()
{
	var selection	= dw.getSelection();
	var node		= dw.offsetsToNode(	selection[0], selection[1] );
	if (!node) return false;
	var tagName = node.tagName;
	if (tagName == undefined) return false;
	var imageSrc	= node.getAttribute( "src" );
	var fullPath	= getFullPath(imageSrc);

	if ( fullPath	&&
		( fullPath.match( /[.]jpg$/i )	||
		  fullPath.match( /[.]jpeg$/i ) ||	
		  fullPath.match( /[.]gif$/i )	||
		  fullPath.match( /[.]png$/i )	)
		)
	{
		dw.fireworksCheckout( fullPath );
	}

	if (fullPath == "" && dw.constructor.gPlaceholderEditorURL != "")
		dw.openWithImageEditor(fullPath, dw.constructor.gPlaceholderEditorURL);
	else if (dw.constructor.gPrimaryEditorURL	!= "")
		dw.openWithImageEditor(fullPath, dw.constructor.gPrimaryEditorURL);
	return true;
}

function	canAcceptCommand()
{
	var	selection	= dw.getSelection();
	if (!selection) return false;
	var node		= dw.offsetsToNode(	selection[0], selection[1] );
	if (!node) return false;
	var tagName = node.tagName;
	if (tagName == undefined) return false;
	var imageSrc	= node.getAttribute( "src" );

	if (!tagName.match( /img/i ))
		return false;
		
	var doc = dw.getDocumentDOM();
	if (doc && !doc.URL)
		return false; /* disabled if document has not been saved */
	
	var	bFW6installed = false;
	if (dw.appName.match( /dreamweaver/i ) )
		bFW6installed = FWLaunch.validateFireworks(6.0);

	// check for placeholder
	if (!imageSrc && bFW6installed)
		return true;

	return false;
}

function	setMenuText()
{
	var	selection	= dw.getSelection();
	if (!selection) return MENU_CreateImage;
	var node		= dw.offsetsToNode(	selection[0], selection[1] );
	if (!node) return MENU_CreateImage;
	var tagName = node.tagName;
	if (tagName == undefined) return MENU_CreateImage;
	var imageSrc	= node.getAttribute( "src" );
	var	fullPath	= getFullPath(imageSrc);

	// check if we are editing a image placeholder
	if (!imageSrc)
	{
		var	bFW6installed = false;
		if (dw.appName.match( /dreamweaver/i ) )
			bFW6installed = FWLaunch.validateFireworks(6.0);

		if (bFW6installed)
		{
			var placeholderArray = dw.getFireworksPath();
			dw.constructor.gPlaceholderEditorName = placeholderArray[0];
			dw.constructor.gPlaceholderEditorURL = placeholderArray[1];
			return MENU_CreateImageIn + " " + placeholderArray[0];
		}
	}
	return MENU_CreateImage;
	
}

