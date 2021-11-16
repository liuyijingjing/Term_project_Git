// Copyright 2002, 2003 Macromedia, Inc. All rights reserved.

function isDOMRequired()
{ 
	// Return false, indicating that this object is available in code view.
	return false;
}

function setMessage(message)
{
  document.msg.innerHTML = message;
}

function setResult(result)
{
  window.close();
}

function initialize()
{    
  // set focus to the ok button
  if (document.button)
  {
    document.button.focus();
  }
}