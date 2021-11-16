// Copyright 2001, 2002, 2003 Macromedia, Inc. All rights reserved.

function receiveArguments()
{
	var itemID = arguments[0];
	var dom = dw.getDocumentDOM();
	if (dom)
	{
		dom.setToolbarVisibility(itemID, !dom.getToolbarVisibility(itemID));
	}
}

function canAcceptCommand()
{
  var retVal = false;
  if (dw.getDocumentDOM()){
    retVal = true;
  }
  return retVal;

}

function getDynamicContent()
{
	var dom = dw.getDocumentDOM();
	if (dom)
	{
		var toolbars = dom.getToolbarIdArray("document");
		var items = new Array;
		var i;
		var x = 0;
    
		for (i = 0; i < toolbars.length; i++)
		{
		    items[x] = dom.getToolbarLabel(toolbars[i]) + ";id='" + toolbars[i] + "'";
		    x++        
		}
		return items;
	}
	return null;
}

function isCommandChecked()
{
	var itemID = arguments[0];
	var dom = dw.getDocumentDOM();
	if (dom)
	{
		return dom.getToolbarVisibility(itemID);
	}
	return false;
}
