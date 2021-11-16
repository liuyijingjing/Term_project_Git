//=========================================================================================================
//
// Copyright 2002-2008 Adobe Macromedia Software LLC and its licensors. All rights reserved.
//
// Feature: Preview in Device Central
// Author:  Bob Easterday
// Module:  DC.js
// Purpose:	launch Adobe Device Central and emulate the path.
// Updates:
//
//=========================================================================================================

function postMessage( docPath )
{
	if (docPath.length)
	{
		var bt = new BridgeTalk;
		var	emulatePath = docPath
		
		bt.target = "devicecentral-3.5";
		
		// On Mac the emulator expects the path to be prefaced with "Volumes/"
		if (dwscripts.IS_MAC)
		{
			if (emulatePath.indexOf("Volumes", 1) == -1)
			{
				emulatePath = emulatePath.replace("file:///", "file:///Volumes/");
			}
		}
		bt.body = "BridgeTalk.bringToFront(); app.emulate('" + emulatePath + "');";
		bt.send();
	}
}
