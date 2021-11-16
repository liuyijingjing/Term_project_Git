// Copyright 2007 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function receiveArguments()
{		
  var whatToDo = arguments[0];
  var docPath = "";
  var prevDocPath = "";
  var selArr = dw.searchResults.getSelectedResults();
  var retVal = 0;
  var resetYTAFlag = true;
		
  for (var i=0; i < selArr.length; i++)
	{
	  if (retVal == -1) // user cancelled. 
	    return;
	    
	  if (i > 0)   // Only for the first time, we want to reset YTA flag.
	    resetYTAFlag = false;
	    
	  docPath = selArr[i].filePath;
		  
		if (docPath && (docPath != prevDocPath))
		{
		  prevDocPath = docPath;
		  
      if (whatToDo == "put")
	    {
		    if (site.canPut(docPath))
		        retVal = site.put(docPath, resetYTAFlag);
	    }
	    else if (whatToDo == "get")
	    {
		    if (site.canGet(docPath))
			    retVal = site.get(docPath);
	    }
	    else if (whatToDo == "checkout")
	    {
		    if (site.canCheckOut(docPath))
			    retVal = site.checkOut(docPath);
	    }
	    else if (whatToDo == "checkin")
	    {
		    if (site.canCheckIn(docPath))
			    retVal = site.checkIn(docPath, resetYTAFlag);
	    }
	    else if (whatToDo == "undocheckout")
	    {
		    if (site.canUndoCheckOut(docPath))
			    site.undoCheckOut(docPath);
	    }
	    else if (whatToDo == "findlocal")
	    {
		    site.locateInSite("local", docPath);
	    }
		}
  }
}

function canAcceptCommand()
{   		
	var whatToDo = arguments[0];
  var docPath = "";
  var selArr = dw.searchResults.getSelectedResults();
		
  for (var i=0; i < selArr.length; i++)
	{
	  docPath = selArr[i].filePath;
	  
	  if (docPath)
	  {
      if (whatToDo == "put")
		  {
			  return site.canPut(docPath);
		  }
		  else if (whatToDo == "get")
		  {
			  return site.canGet(docPath);
		  }
		  else if (whatToDo == "checkout")
		  {
			  return site.canCheckOut(docPath);
		  }
		  else if (whatToDo == "checkin")
		  {
			  return site.canCheckIn(docPath);
		  }
		  else if (whatToDo == "undocheckout")
		  {
			  return site.canUndoCheckOut(docPath);
		  }
		  else if (whatToDo == "findlocal")
		  {
			  return site.canLocateInSite("local", docPath);
		  }
		}
		else
  		return false;
  }
  return false;
}
 