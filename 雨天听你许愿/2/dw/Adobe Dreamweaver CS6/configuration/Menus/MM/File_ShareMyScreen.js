// Copyright 2008 Macromedia, Inc. All rights reserved.
function receiveArguments()
{
	//look for FRIO extension
	var extensionId = "FRIO";
	dw.toggleCSXSExtension(extensionId);
	
}

function canAcceptCommand()
{
	//enabled always, disabled if Service is disabled
	return true;
}


function setMenuText()
{
	//return the string for the menu which lives in menuStrings.xml for localizing
	return MENU_ShareMyScreen;
}