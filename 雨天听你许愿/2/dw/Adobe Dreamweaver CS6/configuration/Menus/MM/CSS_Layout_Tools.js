/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2011 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
*
**************************************************************************/


// ************************* API FUNCTIONS *******************************
function isDOMRequired()
{
  return false;
}

function showIf()
{
  return true;
}

function canAcceptCommand(opt, context) 
{
	var dom = dw.getActiveWindow();
	if( !dom )
		return false;
	
	//we're in the visual aids menu, so if all visual aids are hidden, then we
	//should be disabled
	if( dom.getHideAllVisualAids() )
		return false;
	
	switch(opt)
	{
		case 'show_all':
		case 'show_columns':
		case 'show_box_outlines':
		case 'show_editor':
			switch( dw.getFocus() )
			{
				case 'document':
					return true;
					
				case 'textView':
					return (dom.getView() == 'split');
				
				case 'browser':
					return true;
			}
			break;
	}
	return false;
}

function receiveArguments(opt, context) 
{
	var dom = dw.getActiveWindow();
	if( !dom )
		return false;
	
	switch(opt)
	{
		case 'show_all':
			var show = !dom.getShowCssLayoutColumns();
			dom.setShowCssLayoutColumns( show );
			dom.setShowCssLayoutBoxes( show );
			dom.setShowCssLayoutEditor( show );
			break;
			
		case 'show_columns':
			dom.setShowCssLayoutColumns( !dom.getShowCssLayoutColumns() );
			break;
			
		case 'show_box_outlines':
			dom.setShowCssLayoutBoxes( !dom.getShowCssLayoutBoxes() );
			break;
		
		case 'show_editor':
			dom.setShowCssLayoutEditor( !dom.getShowCssLayoutEditor() );
			break;
	}
}

function isCommandChecked(opt, context)
{
	var dom = dw.getActiveWindow();
	if( !dom )
		return false;
	
	switch(opt)
	{
		case 'show_all':
			return (dom.getShowCssLayoutColumns() && dom.getShowCssLayoutBoxes() && dom.getShowCssLayoutEditor());
			
		case 'show_columns':
			return dom.getShowCssLayoutColumns();
		
		case 'show_box_outlines':
			return dom.getShowCssLayoutBoxes();
		
		case 'show_editor':
			return dom.getShowCssLayoutEditor();
	}
	
	return false;
}

function getMenuID(opt)
{
	return "";
}