// Copyright 2009 Adobe Systems Incorporated All Rights Reserved.

function receiveArguments()
{
    dw.invokeRelatedFilesCustomFilterDialog();
}


function canAcceptCommand() 
{
    // this shortcut lets us know if 
    //  filtering is available (ie if a document is open).
    var filter = dw.getRelatedFilesFilter();

    if (filter == null)
        return false;
    else
    	return true;
}

function isCommandChecked() 
{
    var filter = dw.getRelatedFilesFilter();
    
    if (filter == null)
        return false;
        
    return filter.isAdvancedFilter() ;
}

