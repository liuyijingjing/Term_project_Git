/*

 Copyright 2010 Adobe Systems Incorporated
 All Rights Reserved.

 NOTICE:  All information contained herein is, and remains
 the property of Adobe Systems Incorporated and its suppliers,
 if any.  The intellectual and technical concepts contained
 herein are proprietary to Adobe Systems Incorporated and its
 suppliers and are protected by trade secret or copyright law.
 Dissemination of this information or reproduction of this material
 is strictly forbidden unless prior written permission is obtained
 from Adobe Systems Incorporated.
 
*/

var dws = dwscripts;

var gCssDropdown;
var gCssFileEditBox;
var gBrowseFolderButtonElem;

function commandButtons()
{
	 return new Array("PutButtonsOnBottom", "OkButton defaultButton", "OK", "onClickOkButton()",                    
                    "CancelButton", MM.BTN_Cancel, "window.close()" );
}
function onChangeCssSelect()
{
	gCssFileEditBox.value = '';
	updateBrowseFolderIconTooltip();
}
function updateBrowseFolderIconTooltip()
{
	if (gCssDropdown.selectedIndex == 0)
		gBrowseFolderButtonElem.setAttribute('alt', MSG_LabelSelectFile);
	else
		gBrowseFolderButtonElem.setAttribute('alt', MSG_SaveFileAs);
}
function hasCssExtension(inFileName)
{
	var fileName = String(inFileName);
	return ( fileName.substr(fileName.length - 4, 4).toLowerCase() == '.css' );
}
function onClickOkButton()
{				
	var fileName = dws.trim(String(gCssFileEditBox.value));	
	if (!fileName)
		return;
		
	var selectExistingCssFile = (gCssDropdown.selectedIndex == 0);			
	
	if (!selectExistingCssFile && !hasCssExtension(fileName))
	{
		fileName += '.css';
		gCssFileEditBox.value = fileName;
	}	
	
	var url = dw.relativeToAbsoluteURL(	
						dw.getDocumentDOM().URL, 	
						dw.getSiteRoot(),	
						fileName	
					);  

	if (selectExistingCssFile)
	{
		if(!dws.isFile(url) || url.indexOf(dw.getSiteRoot()) != 0)
		{
			alert(MSG_PleaseSelectFileInSite);
			return;
		}
	}	
	else // 'create new'
	{
		if (!dws.fileExists(url))
		{ 
			if (DWfile.write(url, '')) // Returns false if unable to write.
				DWfile.remove(url); // We were just seeing if we could.  User could cancel and then there shouldn't be a new file.
			else
			{		
				alert(MSG_InvalidFileNameOrPath); 
				return;
			}
		}
	}

	site.setMediaQueryFile(url); 
	
	window.close();
}
function onClickBrowseFolderButton()
{
	var browsedFile;		
	var selectExistingCssFile = (gCssDropdown.selectedIndex == 0);	
	var editBox = gCssFileEditBox;
	
	if (selectExistingCssFile)
		browsedFile = dw.browseForFileURL('select', MSG_LabelSelectFile, false, false, [Label_CSSFileFilter, Label_AllFilesFilter]);
	else
		browsedFile = dw.browseForFileURL('save', MSG_SaveFileAs, false, false, [Label_CSSFileFilter], dw.getSiteRoot(), false, "", ".css"); 
				
	if (browsedFile)
	{								
		if (selectExistingCssFile)
		{			
			browsedFile = dw.relativeToAbsoluteURL(dw.getDocumentDOM().URL, dw.getSiteRoot(), browsedFile);
		}				
					
		editBox.value = dw.absoluteURLToDocRelative(
				dw.getDocumentDOM().URL, 
				dw.getSiteRoot(), 
				browsedFile
			);					
	}
}
function initUI()
{
	gCssDropdown = document.getElementById('cssSelect');
	gCssFileEditBox = document.getElementById('cssFile');
	gBrowseFolderButtonElem = document.getElementById('browseFolderButton');
	updateBrowseFolderIconTooltip();
}