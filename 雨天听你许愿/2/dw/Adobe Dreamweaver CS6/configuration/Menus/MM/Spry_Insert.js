// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function receiveArguments()
{
	var itemId = arguments[0];
	var dom = dw.getDocumentDOM();
	
	if( !dom )
		return;
	
	switch( itemId )
	{
		//insertObject takes the filename of the object without the .htm extension
		case "spryXMLDataSet":
			dom.insertObject("SpryXMLDataSet");
			break;
			
		case "spryDataSet":
			dom.insertObject("SpryDataSetWizard");
			break;

		case "spryRegion":
			dom.insertObject("SpryRegion");
			break;
			
		case "spryRepeat":
			dom.insertObject("SpryRepeat");
			break;
		
		case "spryRepeatList":
			dom.insertObject("SpryRepeatList");
			break;
		
		case "accordion":
			dom.insertObject("SpryAccordion");
			break;
		
		case "menubar":
			dom.insertObject("SpryMenuBar");
			break;
		
		case "tabbedpanels":
			dom.insertObject("SpryTabbedPanels");
			break;
		
		case "collapsiblepanel":
			dom.insertObject("SpryCollapsiblePanel");
			break;

		case "validationTextField":
			dom.insertObject("SpryValidationTextField");
			break;

		case "validationSelect":
			dom.insertObject("SpryValidationSelect");
			break;

		case "validationCheckBox":
			dom.insertObject("SpryValidationCheckbox");
			break;

		case "validationTextarea":
			dom.insertObject("SpryValidationTextarea");
			break;
	}
	
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

