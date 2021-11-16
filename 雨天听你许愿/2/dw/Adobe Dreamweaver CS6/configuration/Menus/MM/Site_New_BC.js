// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

	function receiveArguments()
	{		
		var whatToDo = arguments[0];
        
        alert("pretend I'm doing something useful");
   }

   function canAcceptCommand()
   {   		
		return true;
   }

   function setMenuText()
   {
		return MENU_NewBCSite;
   }
   
   function isCommandChecked()
   {
		return false;
   }