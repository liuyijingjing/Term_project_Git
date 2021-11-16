//////////////////////////////////////////////////////////////////////////////////////////////
//
// ADOBE CONFIDENTIAL
// ___________________
//
//  Copyright 2011 Adobe Systems Incorporated
//  All Rights Reserved.
//
// NOTICE:  All information contained herein is, and remains
// the property of Adobe Systems Incorporated and its suppliers,
// if any.  The intellectual and technical concepts contained
// herein are proprietary to Adobe Systems Incorporated and its
// suppliers and are protected by trade secret or copyright law.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe Systems Incorporated.
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
// Summary Comment
// There is a browser control which is the primary UI for the panel. 
// We pick up CSS declarations in the users document and then apply it to the
// web page loaded in the browser control. We then use the classes defined
// in the users css file to preview Color swatches. We do this by creating
// placeholders and applying user defined css classes to those placeholders.
// When the user selects a swatch we trigger Callbacks here which then make 
// changes to the Dreamweaver DOM to apply swatches and icons. 
//////////////////////////////////////////////////////////////////////////////////////////////



var gInitedUI = false;
var gUnsavedDocument = false;
var HELP_DOC = MM.HELP_jQuerySwatches;
var gWindowChromeSize = 40;
var gActiveDOM;
var gInitialPanelHeight = 400;
var gInitialPanelWidth = 280;
var gBrowser;
var gInitialSizeSet = false;
var gWindowHeightOffset = 60;
var gWindowWidthOffset = 20;

//////////////////////////////////////////////////////////////////////////////////////////////
// DW API callback functions. 
//
function initialSize(platform)
{
	var maxIntialSize = dw.getMaxPanelSize();

	var screenHeight = maxIntialSize[1];	// array = {width, height}
	var height = gInitialPanelHeight;

	if (screenHeight < gInitialPanelHeight + gWindowChromeSize)
		height = screenHeight - gWindowChromeSize;

	gInitialSizeSet = true;
	return gInitialPanelWidth.toString() + "," + height.toString();   // OWL adds ~38 px of chrome to the height         
}

// TODO:last chance to decide if we can be shown.
function canShow(platform) 
{
	return true;    
}

function displayHelp()
{ 
	dwscripts.displayDWHelp(HELP_DOC);
}

function selectionChanged()
{
	//dwscripts_log("In selectionChanged()"); // left in as an example of how to log a string
	var dom = dw.getDocumentDOM();

	if(!dom)
		return;
	if(dom != gActiveDOM)
	{
		gActiveDOM = dom;
		gInitedUI = false;
		initUI();	
		return;
	}
	else if(!gInitedUI && !gUnsavedDocument)
	{
		initUI();	
	}
	if(gInitedUI)
	{
		createAndPreviewSwatches();
	}
}

function onShow()
{
	selectionChanged();
}

function onResize() 
{
    var height = window.innerHeight;
    if (gBrowser && gBrowser.style) 
    {
        gBrowser.style.height = height - gWindowHeightOffset + "px";
        gBrowser.style.width = window.innerWidth - gWindowWidthOffset + "px";
    }
}


function onHide()
{
	if (!gInitedUI)
	{
	    initUI();	
	}
}


//
// End of DW API callback functions. 
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

function setNoElementSelected()
{
	//This should no longer be called.
}

//--------------------------------------------------------------------
// FUNCTION:
//   createAndPreviewSwatches
//
// DESCRIPTION:
//
//	Parses the users CSS File for swatchs style declaration and 
//	creates placeholder divs with the swatch class for preview.
//
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------
function createAndPreviewSwatches()
{
	var dom = dw.getDocumentDOM();
	if(!dom)
	{
		setNoElementSelected();
		return;
	}
	var element = dom.getSelectedNode();
	if(!element)
	{
		setNoElementSelected();
		return;
	}
	element = getParentIfTextNode(element);
	if(!element)
	{
		setNoElementSelected();
		return;
	}

	var dataRole = "";

	while(true)
	{
		if(!element)
			break;
		if(element.getAttribute)
			dataRole = element.getAttribute("data-role");
		var elemType;
		if(dataRole && dataRole != "fieldcontain" && dataRole != "controlgroup" && dataRole != "collapsible-set" && dataRole != "list-divider")
		{
			break;
		}
		else if(element.tagName == "INPUT" || element.tagName == "SELECT" || element.tagName == "TEXTAREA")
		{
			elemType = element.tagName;
			break;
		}
		else if(element.tagName == "BUTTON" || (element.tagName == "A" && isNavBarElement(element)))
		{	
			dataRole = "button";
			break;
		}
		else if(element.tagName == "LABEL")
		{
			element = findInputElementForLabel(element);
		}
		else
		{
			element = element.parentNode;
		}
	}

	var currThemeValues = findCurThemeValues(element,dataRole);

	if(gBrowser && gBrowser.getWindow() && gBrowser.getWindow().reloadCss)
	{
		if(element)
			gBrowser.getWindow().reloadCss(dataRole,elemType,element.type,currThemeValues);
		else
			gBrowser.getWindow().reloadCss(dataRole,"","",currThemeValues);
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   findCurThemeValues
//
// DESCRIPTION:
//	Returns the themes that are currently applied on the selected
//		element.
//
// ARGUMENTS:
// 	element- The current element that is selected.
// 	dataRole- The jQuery Mobile datarole attribute of the selected
// 							element. 
//
// RETURNS:
//	An object containing the different themes that can be applied 
//	on a jQuery Mobile element.
//--------------------------------------------------------------------
function findCurThemeValues(element, dataRole)
{
	var retVal = {};
	retVal.curTheme = getCurrentTheme(element);
	retVal.curIcon = getCurrentIcon(element,dataRole);
	retVal.curIconPos = getCurrentIconPosition(element,dataRole);
	retVal.listIconTheme = getListIconTheme(element, dataRole);
	retVal.listCountTheme = getListCountTheme(element, dataRole);
	retVal.listDividerTheme = getListDividerTheme(element, dataRole);
	return retVal;	
}

//--------------------------------------------------------------------
// FUNCTION:
//   findInputElementForLabel
//
// DESCRIPTION:
//	Incase the user has selected a <Label> element we try and 
//	select it's peer <input> element.
//
// ARGUMENTS:
//   element- The Label Element selected by the user.
//
// RETURNS:
//  element - The <input> Element which is associated with the selected
//  					label. 
//--------------------------------------------------------------------
function findInputElementForLabel(element)
{
	var dom = dw.getDocumentDOM();
	if(!dom)
		return element;
	if(!element)
		return element;

	var inputElement = element.getAttribute("for");
	if(inputElement)	
	{
		var elem = dom.getElementById(inputElement);
		if(elem)
		{
			element = elem;
		}
		else
		{
			element = element.parentNode;
		}
	}
	else
	{
		element = element.parentNode;
	}
	return element;
}

//--------------------------------------------------------------------
// FUNCTION:
//   isNavBarElement
//
// DESCRIPTION:
//	Checks if the selected element is of the type jQueryMobile NavBar.
//
// ARGUMENTS:
//   element- The element we wish to check. 
//
// RETURNS:
// 	true if the element is a navbar false otherwise.
//--------------------------------------------------------------------
function isNavBarElement(element)
{
	var retVal = false;
	var dataRole = "";
	while(true)
	{
		if(!element)
			break;
		if(element.getAttribute)
			dataRole = element.getAttribute("data-role");
		if(dataRole && dataRole == "navbar") 
		{
			retVal = true;
			break;
		}
		else
		{
			element = element.parentNode;
		}
	}
	return retVal;
}

//--------------------------------------------------------------------
// FUNCTION:
//   initUI
//
// DESCRIPTION:
//	Initialize the browser conterol and load the swatch HTML which 
//	contains most of the Panel UI code.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function initUI() 
{
	gBrowser = document.getElementById('browser');				
	gBrowser.style.width = window.innerWidth - gWindowWidthOffset + "px";

	//We don't get the right Window size on first launch.
	if(gInitialSizeSet)
	{
		gBrowser.style.height = gInitialPanelHeight - gWindowHeightOffset +"px";	
		gInitialSizeSet = false;
	}
	else
	{
		gBrowser.style.height = window.innerHeight - gWindowHeightOffset +"px";					
	}
	gBrowser.setScrollbarMode("off","h");
	var configPath = dw.getConfigurationPath();
	dom = dw.getDocumentDOM();
	var cssStr = applyUserDocumentCssToPreview();
	var htmlTempPath = configPath + "/jQuerySwatch/jQuerySwatchTemp.html";
	

	if(!dom || (dom.getParseMode() == "css" || dom.getParseMode() == "js" ||
			dom.getParseMode() == "xml"))
	{
		gUnsavedDocument = true;
		var errorStr = dw.loadString("jQSwatch/Floater/NoSelection");
		var htmlPath = configPath + "/jQuerySwatch/noDocument.html";
		var str = DWfile.read(htmlPath);
		var str = str.replace("%d",errorStr);
		DWfile.write(htmlTempPath,str);
		gBrowser.openURL(htmlTempPath);
	}
	else if(cssStr !== false)
	{
		gInitedUI = true;	
		gUnsavedDocument = false;
		var htmlPath = configPath + "/jQuerySwatch/jQuerySwatch.html";
		var str = DWfile.read(htmlPath);
		var str = str.replace("%d",cssStr);
		DWfile.write(htmlTempPath,str);
		gBrowser.openURL(htmlTempPath);
		gBrowser.addEventListener("BrowserControlLoad", function(e) { initSwatchBrowserCtrl() }, false);
	}
	else
	{
		gUnsavedDocument = true;
		var errorStr = dw.loadString("jQSwatch/Floater/SavePageMessage");
		var htmlPath = configPath + "/jQuerySwatch/noDocument.html";
		var str = DWfile.read(htmlPath);
		var str = str.replace("%d",errorStr);
		DWfile.write(htmlTempPath,str);
		gBrowser.openURL(htmlTempPath);
	}
}


//--------------------------------------------------------------------
// FUNCTION:
//   initSwatchBrowserCtrl
//
// DESCRIPTION:
//	Initialize the browser control and load the swatch HTML which 
//	contains most of the Panel UI code. We also register callbacks 
//	that are called from the browser control for applying a swatch
//	or icon.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function initSwatchBrowserCtrl()
{
	var dom = dw.getDocumentDOM();
	if(!dom)
		return;
	//var curElement = dom.getSelectedNode();
	if(gBrowser.getWindow())
		var doc = gBrowser.getWindow().document;
	else
		return;
	if(!doc)
		return;
	doc.swatchChangeCB = applySwatch;
	doc.imageChangeCB = applyImage;
	doc.listIconThemeCB = applyListIconTheme;
	doc.listCountThemeCB = applyListCountTheme;
	doc.listDividerThemeCB= applyListDividerTheme;
	doc.listSplitImageCB = applyListSplitImage;
	doc.buttonPosCB = applyButtonPosition;
	doc.refreshCB = initUI;
	doc.loadString = loadString;
	if (dwscripts.IS_WIN) 
	{
		doc.getElementsByTagName('body')[0].style.backgroundColor = "#d6d6d6";
	}
	createAndPreviewSwatches();
}

//--------------------------------------------------------------------
// FUNCTION:
//   loadString
//
// DESCRIPTION:
//	Loads a string from resource files. This is used for the dwBrowser
//	view to load resource strings.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------
function loadString(str)
{
	return dw.loadString(str);
}

//--------------------------------------------------------------------
// FUNCTION:
//   applyButtonPosition
//
// DESCRIPTION:
//	Iterate through the current selection to apply the data-iconpos attribute
//	of a jQueryMobile Button.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------
function applyButtonPosition()
{
	var dom = dw.getDocumentDOM();
	if(!dom)
		return;
	var element = dom.getSelectedNode();
	if(!element)
		return;
	element = getParentIfTextNode(element);
	if(!element)
		return;
	var doc = gBrowser.getWindow().document;
	if(doc && element)
		setAttr(element,"data-iconpos",doc.curSel);	
}
//--------------------------------------------------------------------
// FUNCTION:
//   applyUserDocumentCssToPreview
//
// DESCRIPTION:
//	apply all the styles in the Users document to the preview page
//	opened in the browser ctrl.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applyUserDocumentCssToPreview()
{
	var dom = dw.getDocumentDOM();
	if(!dom)
	{
		return false;
	}
	
	var cssPath = "";
	var docUrl = dw.getDocumentDOM().URL;
	if(!docUrl)
	{
		return false;
	}
	var appendStr = "";
	var linkElements = dom.getElementsByTagName("link");
	for(var i=0;i<linkElements.length;i++)
	{
		if(linkElements[i].tagName == "LINK")
		{
			var linkStr = "<link";
			if(linkElements[i].href)
			{
				cssPath = dw.relativeToAbsoluteURL(docUrl,"",linkElements[i].href);
				linkStr += " href='" + cssPath + "'";
			}
			if(linkElements[i].rel)
			{
				linkStr += " rel='" + linkElements[i].rel + "'";
			}
			if(linkElements[i].type)
			{
				linkStr += " type='" + linkElements[i].type + "'";
			}
			linkStr +="/>";
			appendStr =  appendStr + linkStr; 
		}
	}

	var styleElements = dom.getElementsByTagName("style");
	for(var i=0;i<styleElements.length;i++)
	{
		if(styleElements[i].tagName == "STYLE")
		{
			appendStr += "<style>"+ styleElements[i].innerHTML + "</style>";
		}
	}
	return appendStr;
}

//--------------------------------------------------------------------
// FUNCTION:
//   applyListSplitImage
//
// DESCRIPTION:
//	set the data-spliticon attribute of the selected Node in the 
//	user Document with the select image Icon.	
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applyListSplitImage()
{
	applyListThemeAttribute("data-split-icon");
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyListDividerTheme
//
// DESCRIPTION:
//	set the data-dividertheme attribute of the selected Node in the 
//	user Document with the selected swatch. 	
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applyListDividerTheme()
{
	applyListThemeAttribute("data-divider-theme");
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyListCountTheme
//
// DESCRIPTION:
//	set the data-counttheme attribute of the selected Node in the 
//	user Document with the selected swatch. 	
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applyListCountTheme()
{
	applyListThemeAttribute("data-count-theme");
}

//--------------------------------------------------------------------
// FUNCTION:
//   applyListIconTheme
//
// DESCRIPTION:
//	set the data-splittheme attribute of the selected Node in the 
//	user Document with the selected swatch. 	
//
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applyListIconTheme()
{
	applyListThemeAttribute("data-split-theme");
}



//--------------------------------------------------------------------
// FUNCTION:
//   applySwatch
//
// DESCRIPTION:
//	Apply swatch classes on placeholder divs depending on the user's 
//	selection
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applySwatch() 
{
    dw.postApplyJQSwatch(0);
	var dom = dw.getDocumentDOM();
	var curElement = dom.getSelectedNode();
	applySwatchRecursively(curElement);
}


//--------------------------------------------------------------------
// FUNCTION:
//   applySwatchRecursively
//
// DESCRIPTION:
//	Iterate through the parents of the current Selection to find the 
//	appropriate node to apply the swatch on. For example- the user 
//	might have selected a text node but his intention would be to 
//	apply the swatch on it's parent container.
//
// ARGUMENTS:
//  element-  The user selected Node. We now iterate on the parents 
//  of this element to find the appropriate node to apply the swatch
//  on. 
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------
function applySwatchRecursively(element)
{
	if(!element)
		return;
	element = getParentIfTextNode(element);
	var doc = gBrowser.getWindow().document;
	var dataRole = element.getAttribute("data-role");
	if(dataRole && dataRole != "fieldcontain" && dataRole != "collapsible-set" && dataRole!= "controlgroup" && dataRole != "list-divider")
	{
		setAttr(element,"data-theme",doc.curSel);	
	}
	else if(element && (element.tagName == "INPUT" || element.tagName == "SELECT" || element.tagName == "TEXTAREA"))
	{
		setAttr(element,"data-theme",doc.curSel);	
	}
	else if(element && (element.tagName == "BUTTON" || (element.tagName == "A" && isNavBarElement(element))))
	{
		setAttr(element,"data-theme",doc.curSel);	
	}
	else if(element && element.tagName == "LABEL")
	{
		applySwatchOnLabel(element);
	}

	else
	{
		applySwatchRecursively(element.parentNode);
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   setAttr
//
// DESCRIPTION:
// 	sets the attribute of the element if the attribute is specified
// 	removes the attribute if we send an empty value.	
//
// ARGUMENTS:
//
//	element- The selected element
//	attrName- The attribute that we want to set
//	attrVal - The new value of the attribute that we want to set
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------
function setAttr(element, attrName, attrVal) {
    dw.setFocus('textView');
	if(attrVal == "")
	{
		element.removeAttribute(attrName);
	}
	else
	{
		element.setAttribute(attrName, attrVal);
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   applySwatchOnLabel
//
// DESCRIPTION:
//	Apply the selectedSwatch on the <input> element associated
//	with the <label> element.
//
// ARGUMENTS:
//	The <label> element on which we want to apply the swatch theme
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applySwatchOnLabel(element)
{
	var dom = dw.getDocumentDOM();
	var doc = gBrowser.getWindow().document;
	var inputElement = element.getAttribute("for");
	if(inputElement)	
	{
		var elem = dom.getElementById(inputElement);
		if(elem)
		{
			setAttr(elem,"data-theme",doc.curSel);	
		}
		else
		{
			applySwatchRecursively(element.parentNode);
		}
	}
	else
	{
		applySwatchRecursively(element.parentNode);
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   applyImage
//
// DESCRIPTION:
//	Iterate through the current selection to apply the data-icon attribute
//	of an image.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applyImage() 
{
    dw.postApplyJQSwatch(1);
	var dom = dw.getDocumentDOM();
	var element = dom.getSelectedNode();
	var doc = gBrowser.getWindow().document;
	element = getParentIfTextNode(element);
	setAttr(element,"data-icon",doc.curSel);	
}


//--------------------------------------------------------------------
// FUNCTION:
//   getParentIfTextNode
//
// DESCRIPTION:
//	Incase the element is a TEXT_NODE then return its parent element.
//
// ARGUMENTS:
//   element - The currently selected element.
//
// RETURNS:
//  Elements parent if the element is a text node, element otherwise. 
//--------------------------------------------------------------------

function getParentIfTextNode(element)
{
	var retVal = element;
	if(element.nodeType && element.nodeType == Node.TEXT_NODE)
	{
		retVal = element.parentNode;
	}
	return retVal;	
}

//--------------------------------------------------------------------
// FUNCTION:
//   getListParentNode
//
// DESCRIPTION:
//	 Incase of jQMobile ListView we have to iterate up to be able to 
//	 	apply a list theme on the list.	
//
// ARGUMENTS:
//   element - The currently selected element.
//
// RETURNS:
// 	The List Parent Node if we are inside a list Node, NULL otherwise. 
//--------------------------------------------------------------------

function getListParentNode(element)
{
	var dataRole = "";
	while(true)
	{
		if(!element)
			return null;
		if(element.getAttribute)
		{
			dataRole = element.getAttribute("data-role");
		}
		if(dataRole && dataRole == "listview" )
		{
			break;
		}
		else
		{
			element = element.parentNode;
		}
	}
	return element;
}

//--------------------------------------------------------------------
// FUNCTION:
//   applyListThemeAttribute
//
// DESCRIPTION:
//	set attribute of the selected List Node in the 
//	user Document with the selected swatch/Icon.	
//
// ARGUMENTS:
//  attribute - one of the various list theme types like data-splittheme, 
//  						data-spliticon, data-dividertheme 
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applyListThemeAttribute(attribute)
{
	var dom = dw.getDocumentDOM();
	if(!dom)
		return;
	var element = dom.getSelectedNode();
	if(!element)
		return;
	element = getParentIfTextNode(element);
	if(!element)
		return;

	element = getListParentNode(element);	
	var doc = gBrowser.getWindow().document;
	if(doc && element)
		setAttr(element,attribute,doc.curSel);	
}

//--------------------------------------------------------------------
// FUNCTION:
//   getCurrentTheme
//
// DESCRIPTION:
//	Find the current theme applied on the input element.
//	
// ARGUMENTS:
//   element- The element whose theme you are interested in.
//
// RETURNS:
//  retVal- Theme applied on the element. 
//--------------------------------------------------------------------
function getCurrentTheme(element)
{
	var retVal = "";
	if(element)
	{
		retVal = element.getAttribute("data-theme");
	}
	return retVal;
}

//--------------------------------------------------------------------
// FUNCTION:
//   getCurrentIcon
//
// DESCRIPTION:
//	Find the current icon applied on the input element.
//	
// ARGUMENTS:
//   element- The element whose icon you are interested in.
//
// RETURNS:
//  retVal- Icon applied on the element. 
//--------------------------------------------------------------------
function getCurrentIcon(element,dataRole)
{
	var retVal = "";
	if(!element)
	{
		return retVal;
	}
	if(dataRole == "button")
	{
		retVal = element.getAttribute("data-icon");
	}
	else if(dataRole == "listview")
	{
		retVal = element.getAttribute("data-split-icon");
	}
	else
	{
		//An input type and <button> tags can also be buttons.
		//They might not have a button data-role. This should
		//cover those cases.
		retVal = element.getAttribute("data-icon");
	}
	return retVal;
}

//--------------------------------------------------------------------
// FUNCTION:
//   getCurrentIconPosition
//
// DESCRIPTION:
//	Find the current icon position applied on the input element.
//	
// ARGUMENTS:
//   element- The element whose icon you are interested in.
//
// RETURNS:
//  retVal- Icon Position applied on the element. 
//--------------------------------------------------------------------
function getCurrentIconPosition(element,dataRole)
{
	var retVal = "";
	//An input type and <button> tags can also be buttons.
	//They might not have a button data-role. This should
	//cover those cases.
	if(element)
	{
		retVal = element.getAttribute("data-iconpos");	
	}
	return retVal;
}

//--------------------------------------------------------------------
// FUNCTION:
//   getListIconTheme
//
// DESCRIPTION:
//	Find the current list icon theme applied on the input element.
//	
// ARGUMENTS:
//   element- The element you are interested in.
//
// RETURNS:
//  retVal- List Icon Theme applied on the element. 
//--------------------------------------------------------------------
function getListIconTheme(element,dataRole)
{
	var retVal = "";
	if(dataRole == "listview")
	{
		retVal = element.getAttribute("data-split-theme");	
	}
	return retVal;
}

//--------------------------------------------------------------------
// FUNCTION:
//   getListCountTheme
//
// DESCRIPTION:
//	Find the current list count applied on the input element.
//	
// ARGUMENTS:
//   element- The element you are interested in.
//
// RETURNS:
//  retVal- List Count Theme applied on the element. 
//--------------------------------------------------------------------
function getListCountTheme(element, dataRole)
{
	var retVal = "";
	if(dataRole == "listview")
	{
		retVal = element.getAttribute("data-count-theme");	
	}
	return retVal;
}

//--------------------------------------------------------------------
// FUNCTION:
//   getListDividerTheme
//
// DESCRIPTION:
//	Find the current List Divder Theme applied on the input element.
//	
// ARGUMENTS:
//   element- The element you are interested in.
//
// RETURNS:
//  retVal- List Divider Theme applied on the element. 
//--------------------------------------------------------------------
function getListDividerTheme(element, dataRole)
{
	var retVal = "";
	if(dataRole == "listview")
	{
		retVal = element.getAttribute("data-divider-theme");	
	}
	return retVal;
}

