// Copyright 2008 Adobe Systems Incorporated.  All rights reserved.

function receiveArguments()
{
	var dom = dw.getDocumentDOM();
	
	if( !dom )
		return;
	
	dom.insertObject("SpryValidationRadio");
}

function canAcceptCommand()
{
	dom = dw.getDocumentDOM();
	
	return (	dw.getActiveWindow(true) != null && 
				dw.getActiveWindow(true).allowsEdits() &&
				dw.getFocus() != 'browser' && 
			 	dom != null && 
				!dom.getIsLibraryDocument() &&
				dom.getParseMode() == 'html' );

}