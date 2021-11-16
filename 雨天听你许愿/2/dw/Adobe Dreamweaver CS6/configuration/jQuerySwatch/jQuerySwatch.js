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


//--------------------------------------------------------------------
// FUNCTION:
//   createSwatchDivs
//
// DESCRIPTION:
//	Create div placeholders for previewing individual swatches
//
//
// ARGUMENTS:
// 	swatchType - ui-bar,ui-button or ui-body.
// 	swatchContainer - The css selctor of the parent container of the 
// 	swatchDivs. 
//
// RETURNS:
//  An array of strings containing names of swatches declared in the
//  users CSS.
//  
//--------------------------------------------------------------------

function createSwatchDivs(swatchType,swatchContainer)
{
	var swatchListArr = [];
	$(swatchContainer).html("");

	for(var i=0;i<document.styleSheets.length;i++)
	{
		if(document.styleSheets[i].cssRules)
		{
			createSwatchDivsForRules(document.styleSheets[i].cssRules,swatchType,swatchListArr,swatchContainer);
		}	
	}

	if(swatchListArr.length > 0)
	{
		createDefaultSwatchDiv(swatchContainer);
	}
	return swatchListArr;
}

function createDefaultSwatchDiv(swatchContainer) 
{
    $(swatchContainer).prepend("<div class='dw_swatchFrame'><div class='dw_defaultSwatch' swatchType=''></div></div>");
}

function onDefaultSwatchClick() 
{
    document.curSel = "";
    document.swatchChangeCB();
}
//--------------------------------------------------------------------
// FUNCTION:
//   registerCallbacks
//
// DESCRIPTION:
//	Register Callbacks from the Dreamweaver Document DOM to make 
//	changes to the user document.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function registerCallbacks(dataRole) 
{
    $(".dw_swatch").unbind("click");
    $(".dw_swatch").click(function () {
        document.curSel = $(this).attr("swatchType");
        document.swatchChangeCB();
    });

    $(".dw_defaultSwatch").unbind("click");
    $(".dw_defaultSwatch").click(function () {
			document.curSel = "";
			document.swatchChangeCB();
	});

	$("#dw_ListIconThemeContainer .dw_swatch").unbind("click");
	$("#dw_ListIconThemeContainer .dw_swatch").click(function(){
			document.curSel = $(this).attr("swatchType");
			document.listIconThemeCB();
			});
	$("#dw_ListIconThemeContainer .dw_defaultSwatch").click(function(){
			document.curSel = "";
			document.listIconThemeCB();
			});

	$("#ListCountThemeContainer .dw_swatch").unbind("click");
	$("#ListCountThemeContainer .dw_swatch").click(function(){
			document.curSel = $(this).attr("swatchType");
			document.listCountThemeCB();
			});

	$("#ListCountThemeContainer .dw_defaultSwatch").click(function(){
			document.curSel = "";
			document.listCountThemeCB();
			});

	$("#ListDividerThemeContainer .dw_swatch").unbind("click");
	$("#ListDividerThemeContainer .dw_swatch").click(function(){
			document.curSel = $(this).attr("swatchType");
			document.listDividerThemeCB();
			});
	$("#ListDividerThemeContainer .dw_defaultSwatch").click(function(){
			document.curSel = "";
			document.listDividerThemeCB();
			});

	$(".dw_iconPosition").click(function(){
            document.curSel = $(this).attr("posType");
			document.buttonPosCB(); 
			});
}


//--------------------------------------------------------------------
// FUNCTION:
//   createSwatchDivsForRules
//
// DESCRIPTION:
//	Iterate through the cssRules data structure and find swatch classes
//	to preview. We are currently looking for ui-bar, ui-btn and ui-body
//	classes.
//
// ARGUMENTS:
// 		cssRules- The webkit datastructure for CSS Rules declared in the 
// 								webpage.
// 		swatchType - The swatch type applicable on the current user 
// 								selection. It can be ui-bar, ui-body or ui-button.
// 		swatchListArr - An array of strings containing the swatch names
// 								found so far in the document.
// 		swatchContainer - The CSS selector of the parent container of the
// 								placeholder divs.
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function createSwatchDivsForRules(cssRules,swatchType, swatchListArr,swatchContainer)
{
	if(!cssRules)
		return;
	for(var i = 0;i < cssRules.length;i++)
	{
		if(cssRules[i].type == 3)
		{
			createSwatchDivsForRules(cssRules[i].styleSheet.cssRules,swatchType, swatchListArr,swatchContainer);	
		}
		else if(cssRules[i].type == 1 && cssRules[i].selectorText)
		{
			var selText = cssRules[i].selectorText;
			var regExpStr = "\\." + swatchType + "-(\\w*)";
			var swatchRegx = new RegExp(regExpStr);
			var mtchArr = swatchRegx.exec(selText);
			if(mtchArr && mtchArr[1] && swatchListArr.indexOf(mtchArr[1]) == -1)
			{
				swatchListArr.push(mtchArr[1]);
				$(swatchContainer).append("<div class='dw_swatchFrame'> <div class='dw_swatch' title='Theme: "+ mtchArr[1] +"' swatchType='"+ mtchArr[1] +"'> </div></div>");
			}
		}
		else if(cssRules[i].type == 4)
		{
			createSwatchDivsForRules(cssRules[i].cssRules,swatchType,swatchListArr,swatchContainer);
		}
	}
}


//--------------------------------------------------------------------
// FUNCTION:
//   createImageDivs
//
// DESCRIPTION:
//	Iterate through the CSS for ui-icon classes to preview. Create 
//	placeholder divs to preview the icon.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function createImageDivs()
{
	$(".iconContainer").html("");
	$("#ListSplitIconContainer").html("");
	var imageDivsArr = [];
	for(var i=0;i<document.styleSheets.length;i++)
	{
		if(document.styleSheets[i].cssRules)
		{
			createImageDivsForRules(document.styleSheets[i].cssRules,imageDivsArr);
		}
	}		
	if(imageDivsArr.length > 0)
	{
		$(".iconContainer").prepend("<div class='dw_defaultImageIcon'></div>");
		$("#ListSplitIconContainer").prepend("<div class='dw_defaultImageIcon'></div>");
	}
	registerImageDivCallbacks();
}


//--------------------------------------------------------------------
// FUNCTION:
//   registerImageDivCallbacks
//
// DESCRIPTION:
//	Register callbacks to set the Icon Attribute in the user document.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function registerImageDivCallbacks()
{
	$(".dw_imageIcon ").click(function(){
			document.curSel = $(this).attr("imageType");
			document.imageChangeCB();
			});

	$(".dw_defaultImageIcon ").click(function(){
			document.curSel = "";
			document.imageChangeCB();
			});

	$("#ListSplitIconContainer .dw_imageIcon ").unbind("click");
	$("#ListSplitIconContainer .dw_imageIcon ").click(function(){
			document.curSel = $(this).attr("imageType");
			document.listSplitImageCB();
			});
	
	$("#ListSplitIconContainer .dw_defaultImageIcon ").unbind("click");
	$("#ListSplitIconContainer .dw_defaultImageIcon ").click(function(){
			document.curSel = "";
			document.listSplitImageCB();
			});
}


//--------------------------------------------------------------------
// FUNCTION:
//   createImageDivsForRules
//
// DESCRIPTION:
//	Iterate through the cssRules data structure looking for the ui-icon
//	class. 	
//
// ARGUMENTS:
//   cssRules - The webkit datastructure containing the cssRules defined
//   						in the webpage.
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function createImageDivsForRules(cssRules, imageDivsArr)
{
	for(var i = 0;i < cssRules.length;i++)
	{
		if(cssRules[i].type == 3)
		{
			createImageDivsForRules(cssRules[i].styleSheet.cssRules, imageDivsArr);	
		}
		else if(cssRules[i].type == 1 && cssRules[i].selectorText)
		{

			var selText = cssRules[i].selectorText;
			if(selText.indexOf(".ui-icon") >= 0 && selText.length>8 &&
					selText.indexOf(" ") < 0 && imageDivsArr.indexOf(selText) == -1)
			{
				$(".iconContainer").append("<div class='dw_imageIcon ui-icon " + selText.substring(1) + "' imageType='" +selText.substring(9) +"'></div>");
				$("#ListSplitIconContainer").append("<div class='dw_imageIcon ui-icon " + selText.substring(1) + "' imageType='" +selText.substring(9) +"'></div>");
				imageDivsArr.push(selText);
			}
		}
		else if(cssRules[i].type == 4)
		{
			createImageDivsForRules(cssRules[i].cssRules, imageDivsArr);	
		}
	}
}


//--------------------------------------------------------------------
// FUNCTION:
//   appendCssFile
//
// DESCRIPTION:
//	Insert the css Rules from the users document into our preview 
//	document.
//
// ARGUMENTS:
//   The CSS Declarations from the User document that we intend to 
//   use for preview.
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function appendCssFile(appendText)
{
	$(appendText).prependTo("head");
}


//--------------------------------------------------------------------
// FUNCTION:
//   reloadCss
//
// DESCRIPTION:
//	Refresh the css classes applied to the swatch divs based on the 
//	users current selection.
//
// ARGUMENTS:
//   dataRole - The jQuery Mobile dataRole attribute of the current
//   						selection.
//
//   elemType - The tagName of the selected Node. 
//
//   elemInputType - Incase an <input> tag is selected the type of 
//   						the <input> tag.
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function reloadCss(dataRole,elemType,elemInputType, currThemeValues)
{
	$("body > div > div ").hide();

	if(elemInputType)
	{
		elemInputType = elemInputType.toLowerCase();
	}
	paintCurrentThemeView(dataRole);
	if(elemType == "SELECT")
	{
		applyButtonClassesOnSwatch();
	}
	else if(elemType == "INPUT")
	{
		if(elemInputType == "text" || elemInputType == "password" )
		{
			applyBodyClassesOnSwatch();
		}
		else if(elemInputType == "checkbox" || elemInputType == "radio" 
							|| elemInputType == "range")
		{
			applyButtonClassesOnSwatch();
		}
		else if(elemInputType == "button" || elemInputType == "submit" || elemInputType == "reset" 
							|| elemInputType == "image")
		{
			$("body > div > div ").hide();
			paintCurrentThemeView("button");
			applyButtonClassesOnSwatch();
		}
		else
		{
			$("body > div > div ").hide();
			$("#NoSelection").show();
		}
	}
	else if(elemType == "TEXTAREA" || dataRole == "content")
	{
		applyBodyClassesOnSwatch();
	}
	else if(dataRole == "button" || dataRole == "listview" || dataRole == "slider" || 
			dataRole == "list-divider" || dataRole == "collapsible")
	{
		applyButtonClassesOnSwatch();
	}
	else if(dataRole == "header" || dataRole == "footer")
	{
		applyBarClassesOnSwatch();
	}
	else if(dataRole == "page")
	{
		applyBarClassesOnSwatch();
		$("body > div > div ").hide();
		$("#AppTheme").show();
	}
	else
	{
		$("body >div > div ").hide();
		$("#NoSelection").show();
	}

	if(dataRole == "listview")
	{
		applyClassesOnListView(dataRole);
	}
	registerCallbacks();
	updateLabels(currThemeValues);
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateLabels
//
// DESCRIPTION:
//	Update Labels of all the current elements.  
//
// ARGUMENTS:
// 	currThemeValues - The values that have been applied on the selected
// 		jQMobile element.
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------
function updateLabels(currThemeValues)
{
	updateCurrTheme(currThemeValues.curTheme);
	updateCurrIcon(currThemeValues.curIcon);
	updateIconPos(currThemeValues.curIconPos);
	updateListIconTheme(currThemeValues.listIconTheme);
	updateListCountTheme(currThemeValues.listCountTheme);
	updateListDividerTheme(currThemeValues.listDividerTheme);
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyClassesOnListView
//
// DESCRIPTION:
//	Apply classes specific to listview preview. 
//
// ARGUMENTS:
//   dataRole - The jQuery Mobile dataRole attribute of the current
//   						selection.
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------
function applyClassesOnListView(dataRole)
{
	var swatchListArr = createSwatchDivs("ui-btn-up","#dw_ListIconThemeContainer");
	$("#dw_ListIconThemeContainer .dw_swatch").unbind('mouseenter mouseleave');
	$("#dw_ListIconThemeContainer .dw_swatch").removeClass().addClass("dw_swatch");
	$("#dw_ListIconThemeContainer .dw_swatch").each(function(i){
			var swatchId =i%swatchListArr.length; 
			$(this).addClass("ui-btn-up-" + swatchListArr[swatchId]);	
			});

	swatchListArr = createSwatchDivs("ui-btn-up","#ListCountThemeContainer");
	$("#ListCountThemeContainer .dw_swatch").unbind('mouseenter mouseleave');
	$("#ListCountThemeContainer .dw_swatch").removeClass().addClass("dw_swatch");
	$("#ListCountThemeContainer .dw_swatch").each(function(i){
			var swatchId =i%swatchListArr.length; 
			$(this).addClass("ui-btn-up-" + swatchListArr[swatchId]);	
			});

	swatchListArr = createSwatchDivs("ui-bar","#ListDividerThemeContainer");
	$("#ListDividerThemeContainer .dw_swatch").unbind('mouseenter mouseleave');
	$("#ListDividerThemeContainer .dw_swatch").removeClass().addClass("dw_swatch");
	$("#ListDividerThemeContainer .dw_swatch").each(function(i){
			var swatchId =i%swatchListArr.length; 
			$(this).addClass("ui-bar-" + swatchListArr[swatchId]);	
			});
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyButtonClassesOnSwatch
//
// DESCRIPTION:
// 	Apply button classes on swatch divs. This is used for various 
// 	jQuery Mobile widgets like buttons, radio buttons, checkboxes
// 	and listviews.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applyButtonClassesOnSwatch()
{
	var swatchListArr = createSwatchDivs("ui-btn-up", ".dw_swatchContainer");
	$(".dw_swatchContainer .dw_swatch").removeClass().addClass("dw_swatch");
	$(".dw_swatchContainer .dw_swatch").each(function(i){
			var swatchId =i%swatchListArr.length; 
			$(this).addClass("ui-btn-up-" + swatchListArr[swatchId]);	
			$(this).hover(function(){
				$(this).removeClass("ui-btn-up-" + swatchListArr[swatchId]).
				addClass("ui-btn-hover-" + swatchListArr[swatchId]);
				},
				function(){
				$(this).removeClass("ui-btn-hover-" + swatchListArr[swatchId]).
				addClass("ui-btn-up-" + swatchListArr[swatchId]);
				});
			});
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyBodyClassesOnSwatch
//
// DESCRIPTION:
//	Apply body classes on swatch divs. This is used for JQuery Mobile 
//	widgets like Content, <input type="text"/> and textArea.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applyBodyClassesOnSwatch()
{
	var swatchListArr = createSwatchDivs("ui-body", ".dw_swatchContainer");
	$(".dw_swatchContainer .dw_swatch").unbind('mouseenter mouseleave');
	$(".dw_swatchContainer .dw_swatch").removeClass().addClass("dw_swatch");
	$(".dw_swatchContainer .dw_swatch").each(function(i){
			var swatchId =i%swatchListArr.length; 
			$(this).addClass("ui-body-" + swatchListArr[swatchId]);	
			});
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyBarClassesOnSwatch
//
// DESCRIPTION:
//	Apply bar classes on swatch divs. This is used for JQuery Mobile 
//	widgets like Header, Footer and List Divider.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function applyBarClassesOnSwatch()
{
	var swatchListArr = createSwatchDivs("ui-bar", ".dw_swatchContainer");
	$(".dw_swatchContainer .dw_swatch").unbind('mouseenter mouseleave');
	$(".dw_swatchContainer .dw_swatch").removeClass().addClass("dw_swatch");
	$(".dw_swatchContainer .dw_swatch").each(function(i){
			var swatchId =i%swatchListArr.length; 
			$(this).addClass("ui-bar-" + swatchListArr[swatchId]);	
			});
}


//--------------------------------------------------------------------
// FUNCTION:
//   paintCurrentThemeView
//
// DESCRIPTION:
//	Hide/Show the relevant preview section depending on User selection
//
// ARGUMENTS:
//   dataRole - The dataRole attribute is used in jQuery Mobile to
//		identify the type of widget. We change our UI View depending 
//		on the user's selection. 
//
// RETURNS:
//  nothing 
//--------------------------------------------------------------------

function paintCurrentThemeView(dataRole) 
{
	loadAllStrings(dataRole);
	switch(dataRole)
	{
		case "button":
			$("#ButtonTheme").show();
			createImageDivs();
			break;
		
		case "content":
			$("#ElemTheme").show();
			break;
		
		case "listview":
			$("#ListTheme").show();
			createImageDivs();
			break;
		
		default: 
			$("#ElemTheme").show();
	 		break;
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   loadAllStrings
//
// DESCRIPTION:
// 	load Strings from resource files.
//	
// ARGUMENTS:
//	none
//
// RETURNS:
//	none
//--------------------------------------------------------------------
function loadAllStrings(dataRole)
{
	$("#AppTheme h3").html(document.loadString("jQSwatch/Floater/AppTheme"));	
	$("#ButtonTheme h3").eq(0).html(document.loadString("jQSwathc/Floater/ButtonTheme"));	
	$("#ButtonTheme h3").eq(1).html(document.loadString("jQSwathc/Floater/ButtonIcon"));	
	$("#ButtonTheme h3").eq(2).html(document.loadString("jQSwatch/Floater/Button/IconPos"));	
	$("#ListTheme  h3").eq(0).html(document.loadString("jQSwathc/Floater/ListTheme"));	
	$("#ListTheme  h3").eq(1).html(document.loadString("jQSwathc/Floater/ListIconTheme"));	
	$("#ListTheme  h3").eq(2).html(document.loadString("jQSwathc/Floater/CountBubbleTheme"));	
	$("#ListTheme  h3").eq(3).html(document.loadString("jQSwathc/Floater/DividerTheme"));	
	$("#ListTheme  h3").eq(4).html(document.loadString("jQSwathc/Floater/SplitIconTheme"));	
	if(dataRole)
	{
		$("#ElemTheme h3").html(document.loadString("jQSwathc/Floater/ElemTheme") +"("+ dataRole+ ")");	
	}
	else
	{
		$("#ElemTheme h3").html(document.loadString("jQSwathc/Floater/ElemTheme"));	
	}
	$("#NoSelection ").html(document.loadString("jQSwatch/Floater/NoSelection"));
	$("#AppTheme p").html(document.loadString("jQSwatch/Floater/AppTheme/Label"));
	$(".dw_iconPositionDefault div").html(document.loadString("jQSwatch/Floater/ButtonPos/Default"));
	$(".dw_iconPositionLeft div").html(document.loadString("jQSwatch/Floater/ButtonPos/Left"));
	$(".dw_iconPositionRight div").html(document.loadString("jQSwatch/Floater/ButtonPos/Right"));
	$(".dw_iconPositionTop div").html(document.loadString("jQSwatch/Floater/ButtonPos/Top"));
	$(".dw_iconPositionBottom div").html(document.loadString("jQSwatch/Floater/ButtonPos/Bottom"));
}

//--------------------------------------------------------------------
// FUNCTION:
//   noDocumentDetected
//
// DESCRIPTION:
// 	Show the no document message if we there is no current document.
//	
// ARGUMENTS:
//	none
//
// RETURNS:
//	none
//--------------------------------------------------------------------
function noDocumentDetected()
{
	$("body > div > div ").hide();
	$("#NoSelection").html(document.loadString("jQSwatch/Floater/SavePageMessage"));	
	$("#NoSelection").show();
}

//--------------------------------------------------------------------
// FUNCTION:
//   noElementSelected
//
// DESCRIPTION:
//  Show the no element selected message if our current selection 
// 	doesnt match a jQMobile element.
//	
// ARGUMENTS:
//	none
//
// RETURNS:
//	none
//--------------------------------------------------------------------
function noElementSelected()
{
	$("body > div > div ").hide();
	$("#NoSelection ").html(document.loadString("jQSwatch/Floater/NoSelection"));	
	$("#NoSelection").show();
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateCurrTheme
//
// DESCRIPTION:
//		Update current theme to the specified theme.This highlights the
//		selected swatch and sets the label.
//	
// ARGUMENTS:
//	currTheme - The value of the theme currently applied on the 
//		selected element.
//
// RETURNS:
//	none
//--------------------------------------------------------------------
function updateCurrTheme(currTheme)
{
	if(currTheme && currTheme != "")
	{
		var themeStr = document.loadString("jQSwatch/Floater/Label/Theme");
		$(".swatchLabel").html(themeStr +"'" + currTheme + "'");
		var selector = ".dw_swatchContainer div[swatchType='"+currTheme+"']";
		$(selector).parent().addClass("dw_selected");
	}
	else
	{
		var noThemeStr = document.loadString("jQSwatch/Floater/Label/NoTheme");
		$(".swatchLabel").html(noThemeStr);
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateCurrIcon
//
// DESCRIPTION:
//		Update current icon to the specified icon.This highlights the
//		selected icon and sets the label.
//	
// ARGUMENTS:
//	currTheme - The value of the icon currently applied on the 
//		selected element.
//
// RETURNS:
//	none
//--------------------------------------------------------------------
function updateCurrIcon(currIcon)
{
	if(currIcon && currIcon!="")
	{
		var iconStr = document.loadString("jQSwatch/Floater/Label/Icon");
		$(".dw_iconLabel").html(iconStr + "'" + currIcon + "'");
		var selector = ".iconContainer div[imageType='"+currIcon+"']";
		$(selector).addClass("dw_iconSelected");
		var selector = "#ListSplitIconContainer div[imageType='"+currIcon+"']";
		$(selector).addClass("dw_iconSelected");
	}
	else
	{
		
		var iconStr = document.loadString("jQSwatch/Floater/Label/Icon/Default");
		$(".dw_iconLabel").html(iconStr);
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateIconPos
//
// DESCRIPTION:
//		Update current iconPosition to the specified icon position.This
//		just sets the icon position label and sets that element selected. 
//	
// ARGUMENTS:
//	currPos - The value of the icon currently applied on the 
//		selected element.
//
// RETURNS:
//	none
//--------------------------------------------------------------------
function updateIconPos(currPos)
{
    $(".dw_iconPositionBorderSelected.dw_iconPositionNoText").removeClass("dw_iconPositionBorderSelected");
    $(".dw_iconPositionBorderSelected").removeClass("dw_iconPositionBorderSelected").addClass("dw_iconPositionBorder");
    
	if(currPos && currPos!="")
	{
        $("div[posType='"+currPos+"']").removeClass("dw_iconPositionBorder").addClass("dw_iconPositionBorderSelected");
		var iconPosStr = document.loadString("jQSwatch/Floater/Label/IconPosition");
		$(".dw_iconPositionLabel").html(iconPosStr + currPos);
	}
	else
	{
        $(".dw_iconPositionDefault").removeClass("dw_iconPositionBorder").addClass("dw_iconPositionBorderSelected");
		var iconPosStr = document.loadString("jQSwatch/Floater/Label/IconPosition/Default");
		$(".dw_iconPositionLabel").html(iconPosStr);
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateListIconTheme
//
// DESCRIPTION:
//		Update current icon theme to the specified theme.This highlights the
//		selected list icon theme and sets the label.
//	
// ARGUMENTS:
//	listIconTheme - The value of the list icon currently applied on the 
//		selected element.
//
// RETURNS:
//	none
//--------------------------------------------------------------------
function updateListIconTheme(listIconTheme)
{
	if(listIconTheme && listIconTheme!="")
	{
		var themeStr = document.loadString("jQSwatch/Floater/Label/Theme");
		$(".ListIconThemeLabel").html(themeStr + "'" + listIconTheme + "'");
		var selector = "#dw_ListIconThemeContainer div[swatchType='"+listIconTheme+"']";
		$(selector).parent().addClass("dw_selected");
	}
	else
	{
		var noThemeStr = document.loadString("jQSwatch/Floater/Label/NoTheme");
		$(".ListIconThemeLabel").html(noThemeStr);
	}
}

function updateListCountTheme(listCountTheme)
{
	if(listCountTheme && listCountTheme!="")
	{
		var themeStr = document.loadString("jQSwatch/Floater/Label/Theme");
		$(".ListCountThemeLabel").html(themeStr + "'" + listCountTheme + "'");
		var selector = "#ListCountThemeContainer div[swatchType='"+listCountTheme+"']";
		$(selector).parent().addClass("dw_selected");
	}
	else
	{
		var noThemeStr = document.loadString("jQSwatch/Floater/Label/NoTheme");
		$(".ListCountThemeLabel").html(noThemeStr);
	}
}

function updateListDividerTheme(listDividerTheme)
{
	if(listDividerTheme && listDividerTheme!="")
	{
		var themeStr = document.loadString("jQSwatch/Floater/Label/Theme");
		$(".ListDividerThemeLabel").html(themeStr + "'" + listDividerTheme + "'");
		var selector = "#ListDividerThemeContainer div[swatchType='"+listDividerTheme+"']";
		$(selector).parent().addClass("dw_selected");
	}
	else
	{
		var noThemeStr = document.loadString("jQSwatch/Floater/Label/NoTheme");
		$(".ListDividerThemeLabel").html(noThemeStr);
	}
}

