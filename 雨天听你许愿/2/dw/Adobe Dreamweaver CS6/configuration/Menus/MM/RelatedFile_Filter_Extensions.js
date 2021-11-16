// Copyright 2009 Adobe Systems Incorporated All Rights Reserved.

function receiveArguments()
{
    var menuItem = arguments[0];

    if (menuItem == null)
        return false;
	
	// select the extension for the selected ID.
	var i = parseInt(menuItem);

	if (i == null)
	    return false;

	var quickFilterList = dw.getQuickRelatedFilesFilterStrings();
	var filter = dw.getRelatedFilesFilter();

	if (quickFilterList == null || filter == null)
	    return false;

	if (quickFilterList.length <= i.valueOf())
	    return false;

	if (filter.isAdvancedFilter()) {
	    // if we had an advanced filter, then we create an empty filter that excludes
	    //  all extensions except the one selected
	    // this is because they're explicitly selected and the user turned it on
	    filter.empty();
	    var j = 0;
	    for (j = 0; j < quickFilterList.length; j++)
	        if (j != i)
	            filter.addExtensionToExclusionExpression(quickFilterList[j]);

	}
	else if (filter.willMatchAnyFile()) {
	    // if we had an empty filter, or a filter that matches anything (as an empty filter does)
	    //  we just add the selected item to the exclusion list
    	filter.empty();
    	filter.addExtensionToExclusionExpression(quickFilterList[i]);
	}
	else if (filter.doesExcludeExtension(quickFilterList[i])) 
	{
	    // Otherwise the user selected to re-add an extension 
	    //  that was previously excluded
	    filter.removeExtensionFromExclusionExpression(quickFilterList[i]);
	}
	else 
	{
	    // Or exclude an extension that wasn't already excluded
	    filter.addExtensionToExclusionExpression(quickFilterList[i]);
	}
	

    // apply the filter
	dw.setRelatedFilesFilter(filter);
}


function canAcceptCommand() 
{
    var itemId = arguments[0];

    if (itemId == null)
        return false;

    var i = 0;

    var quickFilterList = dw.getQuickRelatedFilesFilterStrings();

    if (quickFilterList == null)
        return false;

    // count the number of checked menu items
    //  because if there's only one we can't allow it to be removed
    //  from the filter so we disable it
    var activeFilterCount = 0;
    for (i = 0; i < quickFilterList.length; i++) 
    {
    
        if (isCommandChecked(i))
            ++activeFilterCount;
    }

    // if there's only one active filter 
    //	then we can't allow it to be "unchecked"
    if ((isCommandChecked( itemId )) && (activeFilterCount == 1))
        return false;
    else
	    return true;
}

function isCommandChecked()
{

    var itemId = arguments[0];

    if (itemId == null)
        return false;

    var i = parseInt(itemId);

    if (i == null)
        return false;
    
    var j = 0;

    var filter = dw.getRelatedFilesFilter();

    if (filter == null)
        return false;

    // advnaced filters don't have the extension "checked" in the menu
    if (filter.isAdvancedFilter())
        return false;

    // if the filter is empty or matches any file show the extension 
    //  checked in the menu
    if (filter.willMatchAnyFile())
        return true;

    var quickFilterList = dw.getQuickRelatedFilesFilterStrings();

    if (quickFilterList == null)
        return false;

    var extended = filter.getExcludedExtensions();
    
    if (extended == null)
        return false;

    if (quickFilterList.length <= i.valueOf())
        return false ;

    // search for the extension in the list of excluded extensions
    for(j = 0; j < extended.length; j++ )
        if (extended[j] == quickFilterList[i])
            return false ;
        
    // not found so the item is checked
    return true;
}

function getDynamicContent(itemID)
{   
	var filters = null;
	var i = 0;
	
	var quickFilterList = dw.getQuickRelatedFilesFilterStrings();

	if (((quickFilterList != null)) && (quickFilterList.length > 0))
	{
	    filters = new Array(quickFilterList.length);
	    for (i = 0; i < quickFilterList.length; i++)
		{
		    filters[i] = new String(quickFilterList[i]);
			
			// Add an id
		    filters[i] += ";id='" + i + "'";
			
			// "_" shouldn't be removed from the display file name.
		    filters[i] = filters[i].replace(/_/g, "%_");
		}
	}

	return filters;
}
