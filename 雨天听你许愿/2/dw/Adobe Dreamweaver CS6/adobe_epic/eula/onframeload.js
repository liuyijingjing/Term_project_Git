/*!
**********************************************************************
@file onFrameLoad.js

Author:
	Andrew Matheson (2005) 
	Steve Balo (2005-2006)

Copyright 2003-2006 Adobe Systems Incorporated.                     
All Rights Reserved.                                                
                                                                    
NOTICE: All information contained herein is the property of Adobe   
Systems Incorporated.                                                                                                                    

***********************************************************************
*/

// *******************************************************************
// CORE
// *******************************************************************
if (typeof window.external == "undefined")
	window.external = new Object;

// *******************************************************************
if (typeof DARK == "undefined")
	DARK = new Object;

// *******************************************************************
if (typeof DARK.result != "undefined")
	delete DARK.result;

// *******************************************************************	
window.external.AMT_GetWorkingDirectory =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_GetWorkingDirectory<===>');
		return DARK.result;
	};
	
// *******************************************************************	
window.external.AMT_GetInfoDirectory =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_GetInfoDirectory<===>');
		return DARK.result;
	};	

// *******************************************************************	
window.external.AMT_Test =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_Test<===>');
		return DARK.result;
	};

// *******************************************************************
window.external.AMT_OnWizardFinish =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_OnWizardFinish<===>');
		return DARK.result;
	};

// *******************************************************************	
window.external.AMT_OnCancelButton =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_OnCancelButton<===>');
		return DARK.result;
	};	
	
// *******************************************************************		
window.external.AMT_GetProperty =
	function(propertyName)
	{
        DARK.result = null;
		alert('DARK<===>AMT_GetProperty<===>' + propertyName);
		return DARK.result;
	};

// *******************************************************************	
window.external.AMT_GetBackgroundImagePath =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_GetBackgroundImagePath<===>');
		return DARK.result;
	};	
	
// *******************************************************************	
window.external.AMT_GetCancelNavigate =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_GetCancelNavigate<===>');
		return DARK.result;
	};	
	
// *******************************************************************	
window.external.AMT_SetCancelNavigate =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_SetCancelNavigate<===>');
		return DARK.result;
	};		
	
// *******************************************************************	
window.external.AMT_ShouldHideButton =
	function(inputName)
	{
		var result = false;
	
        DARK.result = null;
		alert('DARK<===>AMT_ShouldHideButton<===>' + inputName);
		if (DARK.result != null && DARK.result != "0")
			result = true;		
		
		return result;
	};	
	
// *******************************************************************	
window.external.AMT_GetPasteboardValue =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_GetPasteboardValue<===>');
		return DARK.result;
	};								
	

// *******************************************************************	
window.external.AMT_Log =
	function(s)
	{
		var result = false;

        DARK.result = null;
		alert('DARK<===>AMT_Log<===>' + s);
		if (DARK.result != null && DARK.result != "0")
			result = true;

		return result; 
	};	
	
// *******************************************************************
// EULA
// *******************************************************************

window.external.AMT_FindThisFile =
	function(eulaSRC)
	{
		var result = false;

        DARK.result = null;
		alert('DARK<===>AMT_FindThisFile<===>' + eulaSRC);
		if (DARK.result != null && DARK.result != "0")
			result = true;

		return result; 
	};	

// *******************************************************************	
window.external.AMT_LoadEULAText =
	function(theEula)
	{
        DARK.result = null;
		alert('DARK<===>AMT_LoadEULAText<===>' + theEula);
		return DARK.result;
	};
	
// *******************************************************************	
window.external.AMT_OnEulaChange =
	function(eulaLang)
	{
        DARK.result = null;
		alert('DARK<===>AMT_OnEulaChange<===>' + eulaLang);
		return DARK.result;
	};	
	
// *******************************************************************	
window.external.AMT_OnEulaDecline =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_OnEulaDecline<===>');
		return DARK.result;
	};	
	
// *******************************************************************	
window.external.AMT_OnEulaAccept =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_OnEulaAccept<===>');
		return DARK.result;
	};		
	
	
// *******************************************************************	
window.external.AMT_GetEulaLanguage =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_GetEulaLanguage<===>');
		return DARK.result;
	};
	
// *******************************************************************	
window.external.AMT_OnEulaSave =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_OnEulaSave<===>');
		return DARK.result;
	};	
	
// *******************************************************************	
window.external.AMT_OnEulaPrint =
	function(eulaPath)
	{
        DARK.result = null;
		alert('DARK<===>AMT_OnEulaPrint<===>' + eulaPath);
		return DARK.result;
	};	

// *******************************************************************	
window.external.AMT_OnEulaBack =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_OnEulaBack<===>');
		return DARK.result;
	};

// *******************************************************************
// PERS
// *******************************************************************

window.external.AMT_OnPersCancel =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_OnPersCancel<===>');
		return DARK.result;
	};		
	
// *******************************************************************		
window.external.AMT_OnPersFinish =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_OnPersFinish<===>');
		return DARK.result;
	};		
	
// *******************************************************************	
window.external.AMT_ValidateSerialNumber =
	function(serialNumber, userName, userCompany)
	{
		var result = false;
		
        DARK.result = null;
		alert('DARK<===>AMT_ValidateSerialNumber<===>' + serialNumber + '<===>' + userName + '<===>' + userCompany);
		if (DARK.result != null && DARK.result != "0")
			result = true;
		
		return result;
	};
	
// *******************************************************************	
window.external.AMT_TryoutSerialNumber =
	function(serialNumber, userName, userCompany)
	{
        DARK.result = null;
		alert('DARK<===>AMT_TryoutSerialNumber<===>' + serialNumber + '<===>' + userName + '<===>' + userCompany);
		return DARK.result;
	};		
	
// *******************************************************************	
window.external.AMT_ShouldShowTryout =
	function(inputName)
	{
		var result = false;
	
        DARK.result = null;
		alert('DARK<===>AMT_ShouldShowTryout<===>' + inputName);
		if (DARK.result != null && DARK.result != "0")
			result = true;		
		
		return result;
	};		
	
// *******************************************************************
// REGS
// *******************************************************************	

window.external.AMT_doRegsRegisterLater =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_doRegsRegisterLater<===>');
		return DARK.result;
	};
	
// *******************************************************************		
window.external.AMT_doRegsDoNotRegister =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_doRegsDoNotRegister<===>');
		return DARK.result;
	};	
	
// *******************************************************************		
window.external.AMT_doRegsOK =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_doRegsOK<===>');
		return DARK.result;
	};		
	
// *******************************************************************		
window.external.AMT_doRegsRegisterNow =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_doRegsRegisterNow<===>');
		return DARK.result;
	};		

// *******************************************************************		
window.external.AMT_isConnectionValid =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_isConnectionValid<===>');
		return DARK.result;
	};	
	
// *******************************************************************		
window.external.AMT_getProductUX =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_getProductUX<===>');
		return DARK.result;
	};		
	
// *******************************************************************		
window.external.AMT_doRegsIntroFinished =
	function()
	{
        DARK.result = null;
		alert('DARK<===>AMT_doRegsIntroFinished<===>');
		return DARK.result;
	};		

// *******************************************************************		
window.external.AMT_doRegFailConnection =
	function()
	{
        DARK.result = null;    
		alert('DARK<===>AMT_doRegFailConnection<===>');
		return DARK.result;
	};	

// *******************************************************************
onWizardLoad();

// *******************************************************************
// EOF
// *******************************************************************	

