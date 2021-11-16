// Copyright 2001, 2002, 2003, 2004, 2005 Macromedia, Inc. All rights reserved.

	function receiveArguments()
	{
		var itemID = arguments[0];
		var	isRemoteView;
		
		if (arguments.length > 1)
			isRemoteView = arguments[1];
		else
			isRemoteView = "local";
					
		// var docPath = dw.getDocumentPath('document');
		
		site.doVCSContextMenu(itemID, isRemoteView);

		/*
		if (itemID == "vcs_mount")
		{
			site.doVCSContextMenu("mount");
		}
		else if (itemID == "vcs_update")
		{
			site.doVCSContextMenu("update");
		}
		else if (itemID == "vcs_markasresolved")
		{
			site.doVCSContextMenu("markasresolved");
		}
		
		else if (itemID == "vcs_commit")
		{
			site.doVCSContextMenu("commit");
		}
		else if (itemID == "vcs_revert")
		{
			site.doVCSContextMenu("revert");
		}
		*/
   }

   function canAcceptCommand()
   {
		var itemID = arguments[0];
		var docPath = dw.getDocumentPath('document');
		var	isRemoteView;
		
		if (arguments.length > 1)
			isRemoteView = arguments[1];
		else
			isRemoteView = "local";

		return site.canDoVCSContextMenu(itemID, isRemoteView);
		
		/*
		if (itemID == "vcs_mount")
		{
			return site.canDoVCSContextMenu("mount");
		}

		if (itemID == "vcs_update")
		{
			return site.canDoVCSContextMenu("update");
		}
		
		if (itemID == "vcs_markasresolved")
		{
			return site.canDoVCSContextMenu("markasresolved");
		}
		*/

		return false;
   }

   function isCommandChecked()
   {
   		return false;
   }
