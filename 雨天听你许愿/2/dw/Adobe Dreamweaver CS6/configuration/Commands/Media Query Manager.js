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

var HELP_DOC = MM.HELP_cmdMediaQueryMngr;

var dws = dwscripts;

// All global variables are listed here.  They are initialized in initUI() and initUI2() and some are used as flags for various purposes.
var gBrowserCtrl;
var gBrowserCtrlDoc;
var gRowsContainerElem;
var gDeleteRowButton;
var gPresetsButton;
var gPropertiesSectionHeaderElem;
var gPropertiesSectionBodyElem;
var gDescriptionEditBox;
var gMinWidthEditBox;
var gMaxWidthEditBox;
var gCssDropdown;
var gCssFileEditBox;
var gBrowseFolderButton;
var gAttachCssFileSectionElem;
var gAttachToThisDocSectionElem;
var gAttachToThisDocRadioButton;
var gAttachToSiteWideFileSectionElem;
var gAttachToSiteWideFileRadioButton;
var gThisDialogAffectsOtherPagesWarningElem;
var gSiteWideFileElem;
var gIncludeMetaTagCheckbox;
var gBrowseFolderButtonElem;

var gGridRowObjects; 
var gUniqueId;
var gSelectedRowIndex;
var gEdits;
var gListToDelete;
var gDisplayErrors; // Flag that is set to true when the user clicks OK.
var gDocHasMQsWithin;
var gDocHasSiteWideFileLinked;
var gDocHasMetaTag;
var gMoveInitialFocus;
var gHaveLoadedSiteWideMediaQueries;

var gLinkTagTemplate = '<link href="HREF" rel="stylesheet" type="text/css" media="MEDIA_QUERY">';
var gImportRuleTemplate = '@import url("HREF") MEDIA_QUERY;';
var gSiteWideLinkTagTemplate = '<link href="HREF" rel="stylesheet" type="text/css">';


function commandButtons()
{
	 return new Array("PutButtonsOnBottom", "OkButton defaultButton", MM.BTN_OK, "onClickOkButton()",
                    "PutButtonOnLeft", MM.BTN_Help, "displayHelp()",
                    "CancelButton", MM.BTN_Cancel, "window.close()" );
}
function onClickPresets()
{	
	appendRow({description : Label_Phone, mediaQuery : "only screen and (max-width:320px)", cssFileUrl : "", cssFileType : 'new'});
	appendRow({description : Label_Tablet, mediaQuery : "only screen and (min-width:321px) and (max-width:768px)", cssFileUrl : "", cssFileType : 'new'});
	appendRow({description : Label_Desktop, mediaQuery : "only screen and (min-width:769px)", cssFileUrl : "", cssFileType : 'new'});

	selectRow(0);	
}
function onClickOkButton()
{
	if (!gAttachToThisDocRadioButton.checked && !gAttachToSiteWideFileRadioButton.checked)
	{
		gAttachCssFileSectionElem.style.borderColor = 'red';
		alert(MSG_PleaseChooseWhere);
		return;	
	}
	else if (gAttachToSiteWideFileRadioButton.checked && getSiteWideFileUrl() == '')
	{
		gAttachCssFileSectionElem.style.borderColor = 'red';
		alert(MSG_PleaseSpecifySiteWideFile);
		return;	
	}

	gAttachCssFileSectionElem.style.borderColor = '#999';

	gDisplayErrors = true;
	
	var firstErrorRowIndex = -1;

	for (var i = 0; i < gGridRowObjects.length; i++)
		if (!validateAndDrawGridRow(i) && firstErrorRowIndex == -1) // validateAndDrawGridRow() returns false if there is a fatal error.
			firstErrorRowIndex = i;

	if (firstErrorRowIndex != -1)	
	{
		dw.beep();
		selectRow(firstErrorRowIndex);
		return;
	}		

	createNewCssFilesIfNeeded();
	
	gEdits = [];
	
	addDeletesToEdits();
	var newText = addUpdatesToEditsAndGetNewText();
	
	
	if (gAttachToThisDocRadioButton.checked)
	{
		var docString = dw.getDocumentDOM().documentElement.outerHTML;		
		dw.getDocumentDOM().documentElement.outerHTML = applyEditsToString(docString, gEdits); 
		
		if (newText)
			writeNewLinkTags(newText);						
			
		insertRemoveMetaTag();
	}
	else // site-wide option is checked.
	{
		var showRelatedDocs = dw.getPreferenceString("General Preferences", "Show Related Docs", "TRUE") == "TRUE";
		
		insertRemoveMetaTag();
		
		var fileUrl = getSiteWideFileUrl();
		
		if (!makeStyleFileWritable(fileUrl))	
		{
			window.close();
			return;	
		}			
		
		if (!gDocHasSiteWideFileLinked)
		{
			insertLinkToSiteWideFile();
			dw.refreshRelatedFiles();			
		}

		if (!dws.fileIsCurrentlyOpen(fileUrl) && showRelatedDocs)
		{
			var viewMode = dw.getActiveWindow().getView();
			var dom = dw.getDocumentDOM();
			dw.openRelatedFile(fileUrl);
			dw.openRelatedFile(dom.URL);
			dw.getActiveWindow().setView(viewMode);
		}
		
		var docString = '';
				
		var dom = dw.getDocumentDOM(fileUrl);		
		if (dom)
		{		
			docString = dom.documentElement.outerHTML;
			var oldDocString = docString;
			addNewSiteWideTextToEdits(docString, newText);		
			docString = applyEditsToString(docString, gEdits);	
			if (docString != oldDocString)					
			{
				if (!dws.fileIsCurrentlyOpen(fileUrl) && !showRelatedDocs)
					dom = dw.openDocument(fileUrl);

				dom.documentElement.outerHTML = docString;	
			}
		}							
		
	} // end-if site-wide option is checked.
	
	site.refresh('local');	
    dw.postAMQ(gGridRowObjects.length, gAttachToSiteWideFileRadioButton.checked, gIncludeMetaTagCheckbox.checked);
	window.close();
}
function insertRemoveMetaTag()
{
	var metaTagElem = getMetaTagElem();
	if (gIncludeMetaTagCheckbox.checked && metaTagElem == null)
		insertMetaTag();
	else if (!gIncludeMetaTagCheckbox.checked && metaTagElem != null)
		metaTagElem.outerHTML = '';		
}
function createNewCssFilesIfNeeded()
{
	for (var i = 0; i < gGridRowObjects.length; i++)
	{
		var obj = gGridRowObjects[i];
		if (obj.cssFileType == 'new')
			DWfile.write(obj.cssFileUrl, '@charset "utf-8";');
	}
}
function insertLinkToSiteWideFile() 
{	
	var fileUrl = getSiteWideFileUrl();
	var relUrl = absToRelUrl(dw.getDocumentDOM().URL, fileUrl);
	var newTagHTML = gSiteWideLinkTagTemplate.replace(/HREF/, relUrl);
	writeNewLinkTags(newTagHTML);				
}
function absToRelUrl(fromUrl, toUrl)
{
	var linksRelTo = site.getDefaultRelativeTo(site.getSiteForURL(fromUrl)); 

	if (linksRelTo == "site") 
	{
		var relUrl = dw.absoluteURLToSiteRelative(
				fromUrl, 
				dw.getSiteRoot(), 
				toUrl
			);
	}
	else
	{
		var relUrl = dw.absoluteURLToDocRelative(
				fromUrl,
				dw.getSiteRoot(), 
				toUrl
			);
	}
	
	return relUrl;
}
function lowStartOffsetsComeFirst(a, b)
{ 
	return a.start - b.start 
}
function addNewSiteWideTextToEdits(docString, newText)
{	
	if (newText.length == 0)
		return;
		
	gEdits.sort(lowStartOffsetsComeFirst); 
	
	if (gEdits.length > 0)
		var insertOffset = gEdits[gEdits.length - 1].end; // Insert after last pre-existing one.
	else
		var insertOffset = findInsertOffset(docString);
			
	gEdits.push( { start: insertOffset, end: insertOffset, text: dws.getNewline() + newText } );	
}
function findInsertOffset(inDocString)
{
	var docString = String(inDocString);
	var commentOffsets = getCommentOffsets(docString);
	
	var nl = dws.getNewline().charAt(0);
	var starts = [];
	var pos = 0;
	
	// Find the offsets of the EOL char on likes with @import.
	while ((pos = docString.indexOf('@import', pos)) != -1 ) 
	{
		pos = docString.indexOf(nl, pos + 1); 
		if (pos != -1)
			starts.push(pos);
		else
		{
			starts.push(docString.length);
			break;	
		}
	}
				
	starts.reverse();
	
	for (var i = 0; i < starts.length; i++)	
		if (!inComment(starts[i], commentOffsets))
			return starts[i];	

	// If we get here, we still haven't found a place to insert, keep looking.
										
	var starts = [];
	var pos = 0;
	
	// Find the offsets of the EOL char on likes with @charset.
	while ((pos = docString.indexOf('@charset', pos)) != -1 )	
	{
		pos = docString.indexOf(nl, pos + 1); 
		if (pos != -1)
			starts.push(pos);
		else
		{
			starts.push(docString.length);
			break;	
		}
	}
				
	starts.reverse();
	
	for (var i = 0; i < starts.length; i++)	
		if (!inComment(starts[i], commentOffsets))
			return starts[i];	
			
	// If we get here, we still haven't found a place to insert, keep looking.	
	
	if (docString.search(/^\s*\/\*\s*CSS\s+DOCUMENT\s*\*\//i) == 0)  //Look for '/* CSS DOCUMENT */' at start of file.
		return docString.indexOf('*/') + 2;
	
	// If we get here, we still haven't found a place to insert, just tell them to put it at the front of the file.		
	
	return 0;
}
function inComment(insertOffset, commentOffsets)
{
	for (var i = 0; i < commentOffsets.length; i++)
	{
		var comment = commentOffsets[i];
		if (comment.start < insertOffset && insertOffset < comment.end )
			return true;					
	}
	
	return false;
}
function getCommentOffsets(inDocString)
{
	var docString = String(inDocString);
	var commentOffsets = [];
	var commentStart = -1; // When -1, means 'not in comment'.  Otherwise, is start offset of comment we are in.
	for (var i = 0; i < docString.length; i++)
	{		
		var snippet = docString.substr(i, 2);
		if (snippet == '/*')
		{
			if (commentStart == -1)		
				commentStart = i;  // This is the start of a comment, save the offset.
		}
		else if (
					snippet == '*/' 
					&& 
					commentStart != -1
					&&
					commentStart != (i - 1) // Don't get fooled by '/*/'
				)
		{			
			// This is the end of a comment, save the offsets.		
			commentOffsets.push( { start: commentStart, end: (i + 2), text: 'X' } );					
			commentStart = -1;  // Set flag to 'not in comment'			
		}
	}
	if (commentStart != -1)
	{
		// File ended in the middle of a comment.  Mark end of file as end of last comment.
		commentOffsets.push( { start: commentStart, end: docString.length, text: 'X' } );	
	}
	
	return commentOffsets;
}
function makeStyleFileWritable(fileUrl)
{	
	if (!dws.fileExists(fileUrl))
	{
		DWfile.write(fileUrl, '');
		return true;
	}
		
	if (dws.isFileWritable(fileUrl))
		return true;
	
	if (confirm(dws.sprintf(MSG_WantToCheckOutFile, dws.getFileName(fileUrl))))
	{
		if (site.canCheckOut(fileUrl))	
		{
			site.checkOut(fileUrl);
			if (dws.isFileWritable(fileUrl))
				return true;	
		}
		alert(MSG_SorryUnableToCheckOutFile);
	}
	
	return false;
}
function getMetaTagElem()
{
	var tags = dw.getDocumentDOM().getElementsByTagName('meta');
	for (var i = 0; i < tags.length; i++)
		if (
				String(tags[i].name).toLowerCase() == 'viewport'
				&&
				String(tags[i].content).toLowerCase().replace(/\s/g, '') == 'width=device-width'
		) 
			return tags[i];		
		
	return null;
}
function insertMetaTag() 
{
	var heads = dw.getDocumentDOM().getElementsByTagName('head');
	var headTagFound = heads.length > 0;
	
	if (!headTagFound)	
		return;  // Should never happen since dw returns a head tag even if doc doesn't have one.	
	
	var html = '<meta name="viewport" content="width=device-width">'; 
	
	if (!isTemplateInstance())			
	{
		// Insert after any existing meta tags in the head.
		var metaTags = dw.getDocumentDOM().getElementsByTagName('meta');
		var headMetaTags = [];
		
		for (var i = 0; i < metaTags.length; i++)
			if (dwscripts.nodeIsChildOfNode(metaTags[i], heads[0]))
				headMetaTags.push(metaTags[i]);
				
		if (metaTags.length == 0)
			heads[0].innerHTML = html + heads[0].innerHTML; 
		else
			metaTags[metaTags.length - 1].outerHTML += html;
	}
	else	
		insertTagsInEditableRegionOfHead(html);
}
function insertTagsInEditableRegionOfHead(newTagsHTML)
{
	var foundSpot = false;		
	var docString = dw.getDocumentDOM().documentElement.outerHTML;		
	var isMetaTag = newTagsHTML.toLowerCase().indexOf('<meta') == 0;
	var pos = docString.search(/<!---*\s+InstanceBeginEditable\s+name="head"\s+-*-->/);
	
	if (pos != -1)			
	{								
		// Since the "search()" method does not take a "startFrom" parameter, like "indexOf()" does,
		// we have to cut the string to search for the end of the editable area in the "secondPart".
		
		var firstPart = docString.substring(0, pos);
		var secondPart = docString.substring(pos);							
		
		if (isMetaTag)
			pos = docString.indexOf('-->', pos);  // Just find the end '<!-- InstanceBeginEditable name="head" -->'
		else
			pos = secondPart.search(/<!---*\s+InstanceEndEditable\s+-*-->/); // Find the start of '<!-- InstanceEndEditable -->'
		
		if (pos != -1)
		{
			foundSpot = true;
			
			if (isMetaTag)
				pos += 3;  // Go to end of '<!-- InstanceBeginEditable name="head" -->'
			else
				pos = firstPart.length + pos; // Go to the beginning of '<!-- InstanceEndEditable -->'
				
			// At this point, pos points to the place we want to insert the tags in the docString.
		
			firstPart = docString.substring(0, pos);
			secondPart = docString.substring(pos);			
		
			docString = firstPart + newTagsHTML + secondPart;
	
			dw.getDocumentDOM().documentElement.outerHTML = docString;
		}					
	}		
	if (!foundSpot)	
	{	
		alert(MSG_NoEditableRegionInHeadFound);				
	}
}
function addUpdatesToEditsAndGetNewText()
{
	var strOut = '';
	var attachToThisDoc = gAttachToThisDocRadioButton.checked;
	
	for (var i = 0; i < gGridRowObjects.length; i++)
	{
		var gridRowObj = gGridRowObjects[i];
		
		if (gridRowObj.existingInfo)			
		{	
			if (gridRowObj.fromSiteWideFile && attachToThisDoc)
				var type = 'link';
			else
				var type = gridRowObj.existingInfo.type;					
		}
		else
			var type = attachToThisDoc ? 'link' : 'import';
						
		
		if (type == 'link')
		{
			var strStartComment = '<!-- ';
			var strEndComment = ' -->';
			var template = gLinkTagTemplate;
			var matchCommentStartLiteral = /\<\!\-\->/g;
			var matchCommentEndLiteral = /\-\-\>/g;
		}
		else // type == 'import'
		{
			var strStartComment = '/* ';
			var strEndComment = ' */';
			var template = gImportRuleTemplate;
			var matchCommentStartLiteral = /\/\*/g;
			var matchCommentEndLiteral = /\*\//g;
		}

		var newDesc = dws.trim(gridRowObj.description).replace(matchCommentStartLiteral, '').replace(matchCommentEndLiteral, '');

		var fromUrl = attachToThisDoc ? dw.getDocumentDOM().URL : getSiteWideFileUrl();
		var relUrl = absToRelUrl(fromUrl, gridRowObj.cssFileUrl);
		
		if (
			(!gridRowObj.existingInfo)
			||
			(gridRowObj.fromSiteWideFile && attachToThisDoc)
		)
		{
			// This new text to insert.
			
			if (newDesc)
				strOut += strStartComment + newDesc + strEndComment + dws.getNewline();
								
			strOut += template.replace(/HREF/, relUrl).replace(/MEDIA_QUERY/, gridRowObj.mediaQuery) + dws.getNewline();
		}		
		else
		{					
			// This was existing text we need to update.
			var descOffsets = gridRowObj.existingInfo.descOffsets;		
			var commentLine = '';
			var wasPriorDesc = (descOffsets.start != descOffsets.end);
	
			if (wasPriorDesc && newDesc != '')
				gEdits.push( { start: descOffsets.start, end: descOffsets.end, text: strStartComment + newDesc + strEndComment } );  // Update the comment.
			else if (wasPriorDesc && newDesc == '')
				gEdits.push( { start: descOffsets.start, end: descOffsets.end, text: '' } );  // Delete the comment.
			else if (!wasPriorDesc && newDesc != '')
				commentLine = strStartComment + newDesc + strEndComment + dws.getNewline();  // Insert a comment.
			
			if (type == 'link')
			{
				// We just want to update the two attributes and leave everything else as-is
				var tagHTML = dw.getDocumentDOM().documentElement.outerHTML.substring(gridRowObj.existingInfo.offsets.start, gridRowObj.existingInfo.offsets.end);
				var tagEdit = new TagEdit(tagHTML);
				tagEdit.setAttribute('href', relUrl);
				tagEdit.setAttribute('media', gridRowObj.mediaQuery);
				var newText = commentLine + tagEdit.getOuterHTML();								
			}
			else
				var newText = commentLine + template.replace(/HREF/, relUrl).replace(/MEDIA_QUERY/, gridRowObj.mediaQuery);

			gEdits.push( { start: gridRowObj.existingInfo.offsets.start, end: gridRowObj.existingInfo.offsets.end, text: newText } );		
		}		
	}
	
	return strOut;		
}
function addDeletesToEdits()
{
	for (var i = 0; i < gListToDelete.length; i++)
	{
		var gridRowObj = gListToDelete[i];
		var descOffsets = gridRowObj.existingInfo.descOffsets;
		var wasPriorDesc = (descOffsets.start != descOffsets.end);
		var startOffset = wasPriorDesc ? descOffsets.start : gridRowObj.existingInfo.offsets.start;
				
		gEdits.push( { start: startOffset, end: gridRowObj.existingInfo.offsets.end, text: '' } );
	}
}
function applyEditsToString(strIn, edits, mode)
{
	var textStr = String(strIn);
	edits.sort(lowStartOffsetsComeFirst);		
	var pos = 0;  // Points to 'current position' in textStr.	
	var lines = [];
	for (var i = 0; i < edits.length; i++)
	{
		var edit = edits[i];
		lines.push(textStr.substring(pos, edit.start));
		lines.push(edit.text);
		if (mode == 'mark') // 'mark' mode just inserts the text at the offsets.  Example, use 'X' to mark offsets.
			lines.push(textStr.substring(edit.start, edit.end) + edit.text);
		pos = edit.end;
	}
	if (pos < textStr.length)
		lines.push(textStr.substring(pos));  // Make sure to get the end of the docString.
	
	return lines.join('');
}
function getSiteWideFileUrl()
{
	var url = site.getMediaQueryFile();
	return url;
}
function onKeyDownInGrid(e)
{	
	if (gGridRowObjects.length == 0)
		return;
		
	var offset;
	
	var keyCode = KEY_CODES[e.keyCode];
	if (keyCode == "Right" || keyCode == "Down") 
		offset = 1;
	else if (keyCode == "Left" || keyCode == "Up") 
		offset = -1;
	else
		return;
		
	if (gSelectedRowIndex == -1)
	{
		// There hasn't been a selection yet, so select the first row and bail.
		selectRow(0);
		return;
	}
		
	newSelectedRowIndex = gSelectedRowIndex + offset;
	
	if (newSelectedRowIndex >= gGridRowObjects.length)  
		newSelectedRowIndex = gGridRowObjects.length - 1;
	else if (newSelectedRowIndex < 0)
		newSelectedRowIndex = 0;
	
	selectRow(newSelectedRowIndex);

	e.returnValue = false; // Cancel event bubble so the default scrolling will not occur.
}
function onClickGridRow(uniqueId)
{
	selectRow(uniqueIdToIndex(uniqueId));
}
function uniqueIdToIndex(uniqueId)
{
	var nodes = gRowsContainerElem.getElementsByTagName('tr');	
	for (var i = 0; i < nodes.length; i++)
		if (nodes[i].id == 'row_' + uniqueId)
			return i;
}
function getRowElem(index)  
{
	return gRowsContainerElem.getElementsByTagName('tr')[index];	
}
function selectRow(index)
{
	if (gSelectedRowIndex != -1 && gSelectedRowIndex != index) 
		getRowElem(gSelectedRowIndex).className = 'gridRow'; // Restore "old" selection to unselected appearance.
		
	gSelectedRowIndex = index;
	var rowElem = getRowElem(index);
	rowElem.className = 'gridRowSelected';	
	
	if (rowElem.offsetTop < gRowsContainerElem.scrollTop)  
		rowElem.scrollIntoView(true); // Scroll row into view and align its top with the container top.
	else 
		scrollIfRowTooLow(rowElem);
		
	enableDisableSelectionDependentControls();
	populatePropertiesControls();
}
function scrollIfRowTooLow(rowElem)
{
	if (gRowsContainerElem.scrollTop + gRowsContainerElem.clientHeight < rowElem.offsetTop + rowElem.offsetHeight)
	{
		rowElem.scrollIntoView(false); // Scroll row into view and align its bottom with the container bottom.	
	}
}
function initUI()
{
    dw.preAMQ();
	// Init globl vars that need to be reinitialized every time the dialog launches.
	gGridRowObjects = []; 
	gUniqueId = 0;
	gSelectedRowIndex = -1;
	gEdits = [];
	gListToDelete = [];
	gDisplayErrors = false;
	gDocHasMQsWithin = false;
	gDocHasSiteWideFileLinked = false;
	gDocHasMetaTag = false;	
	gHaveLoadedSiteWideMediaQueries = false;
	
	// Now set up the browser control and resume initalizing in initUI2() when browser control loads.
	
	gBrowserCtrl = document.getElementById("browserCtrl");	
	gBrowserCtrl.addEventListener("BrowserControlBeforeRefresh", function(e) { e.preventDefault(); }, false);
	gBrowserCtrl.addEventListener("BrowserControlLoad", initUI2 , true); 
	
	var str = "<html>" +
					"<head>" +
						"<link href='dw://Configuration/Styles/Media Query Manager.css' rel='stylesheet' type='text/css' />" +
					"</head>" +
					"<body style='margin:0;padding:0;'>" +
						"<div id='rowsContainer' tabindex='0'>" + // Defining 'tabindex' makes this div focusable and keyboard eventable.
							"<table width='100%' cellpadding='0' cellspacing='0' border='0'>" +
								"<tbody>" +
								"</tbody>" +
							"</table>" +
						"</div>" +
					"</body>" + 
				"</html>";
				
	gBrowserCtrl.loadHTML(str);
}
function getHeadTag()
{
	var headElem = dw.getDocumentDOM().getElementsByTagName('head')[0]; // If the head is a 'dummy head' inserted by DW for
	if (headElem.outerHTML.toLowerCase().indexOf('<head') == 0) 		// parsing reasons, its outerHTML prop will be empty.
		return headElem;
	return null;
}
function initUI2() // Called after browser control loads.
{			
	if (!getHeadTag())
	{
		alert(MSG_NoHeadTag);
		window.close();
		return;	
	}

    if (isFluidGridDoc()) {
        alert(MSG_NotCompatibleWithFluidGrids);
        window.close();
        return;
    }

    var docNotYetSaved = (dw.getDocumentDOM().URL == '');
    if (docNotYetSaved) 
    {
        if (confirm(MSG_PleaseSaveFirst)) 
        {
            if (dw.canSaveDocument(dw.getDocumentDOM())) 
            {
                dw.saveDocument(dw.getDocumentDOM());
                docNotYetSaved = (dw.getDocumentDOM().URL == '');
            }
        }

        if (docNotYetSaved) 
        {
            window.close();
            return;
        }
    }    
	
	gBrowserCtrlDoc = gBrowserCtrl.getWindow().document;
	gRowsContainerElem = gBrowserCtrlDoc.getElementById('rowsContainer');
	gRowsContainerElem.addEventListener('keydown', onKeyDownInGrid, true); 
	gBrowserCtrl.getWindow().parentWindow = window;  // The grid rows use 'parentWindow' to call functions in browser ctrl's parent (us).
	gDeleteRowButton = document.getElementById('deleteRowButton');
	gPresetsButton = document.getElementById('presetsButton');
	gPropertiesSectionHeaderElem = document.getElementById('propertiesSectionHeader');
	gPropertiesSectionBodyElem = document.getElementById('propertiesSectionBody');
	gDescriptionEditBox = document.getElementById('description');
	gMinWidthEditBox = document.getElementById('minWidth');
	gMaxWidthEditBox = document.getElementById('maxWidth');
	gCssDropdown = document.getElementById('cssSelect');
	gCssFileEditBox = document.getElementById('cssFileUrl');
	gBrowseFolderButton = document.getElementById('browseFolderButton');
	gAttachCssFileSectionElem = document.getElementById('attachCssFilesSection');
	gAttachToThisDocSectionElem = document.getElementById('attachToThisDocSection');
	gAttachToThisDocRadioButton = document.getElementById('attachToThisDocRadioButton');
	gAttachToSiteWideFileSectionElem = document.getElementById('attachToSiteWideFileSection');
	gAttachToSiteWideFileRadioButton = document.getElementById('attachToSiteWideFileRadioButton');
	gThisDialogAffectsOtherPagesWarningElem = document.getElementById('thisDialogAffectsOtherPagesWarning');
	gSiteWideFileElem = document.getElementById('siteWideFileName');
	gIncludeMetaTagCheckbox = document.getElementById('includeMetaTagCheckbox');
	gBrowseFolderButtonElem = document.getElementById('browseFolderButton');
                	
	inspectUserDoc();
	
	enableDisableSelectionDependentControls();
	
	gMoveInitialFocus = false;
	displaySiteWideFileNameIfAvailable();
		
	if (gDocHasMQsWithin && gDocHasSiteWideFileLinked)
	{
		alert(MSG_ThisDocumentHasQueriesAndSiteWideFile);
		window.close();
		return;	
	}
	else if (gDocHasMQsWithin || !docIsInASite())	
	{
		gAttachToThisDocRadioButton.checked = true;
		gAttachToSiteWideFileSectionElem.className = 'disabledText';
		gAttachToSiteWideFileRadioButton.disabled = true;		
		if (document.getElementById('createSiteWideFileButton'))
		{
			document.getElementById('createSiteWideFileButton').disabled = true;
			gMoveInitialFocus = true;
		}
	}
	else if (gDocHasSiteWideFileLinked)
	{
		gAttachToSiteWideFileRadioButton.checked = true;
		disableAttachToThisDocRadioButton();
	}

	enableDisableSiteWideWarningText();	
	gIncludeMetaTagCheckbox.checked = gDocHasMetaTag || (!gDocHasMQsWithin && !gDocHasSiteWideFileLinked);
	
	if (gGridRowObjects.length > 0)
		selectRow(0);

    if (gMoveInitialFocus)
       	gIncludeMetaTagCheckbox.focus();
}
function isFluidGridDoc() 
{
    var styleSheetManager = new CssGrids.StyleSheetManager(dw, dw.getActiveWindow(), dwscripts, DWfile, new StyleSheet(dw))
    return styleSheetManager.beQuiet(true).loadGridProps();
}
function docIsInASite()
{
	return site.getSiteForURL(dw.getDocumentDOM().URL) != '';
}
function disableAttachToThisDocRadioButton()
{
	gAttachToThisDocSectionElem.className = 'disabledText';
	gAttachToThisDocRadioButton.disabled = true;
}
function displaySiteWideFileNameIfAvailable()
{
	var fileName = dws.getFileName(getSiteWideFileUrl()); 

	if (fileName)	
	{
		gSiteWideFileElem.innerHTML = htmlEncode(fileName);
		gMoveInitialFocus = true;
		return true;
	}
	
	return false;
}
function onClickSpecifySiteWideFileButton()
{
	dw.runCommand('Media Query Manager - Specify Site-wide File');
	if (displaySiteWideFileNameIfAvailable())
	{
		// The user just specified the name of the site-wide file.  Now check to
		// see if their doc already has it linked or they've checked the 'site-wide' radio button.  
		// If so, load it into the grid and update the UI accordingly.  
		//
		if (thisDocHasSiteWideFileLinked() || gAttachToSiteWideFileRadioButton.checked)
		{									
			if (gDocHasMQsWithin)
			{
				window.close();
				return;	
			}
			
			gAttachToThisDocRadioButton.checked = false;
			gAttachToSiteWideFileRadioButton.checked = true;
			enableDisableSiteWideWarningText();
			disableAttachToThisDocRadioButton();
			gDocHasSiteWideFileLinked = thisDocHasSiteWideFileLinked();
		
			if (!gHaveLoadedSiteWideMediaQueries)
			{
				var existingQueries = getWidthMediaQueriesFromSiteWideFile();
				if (existingQueries.length > 0 && gGridRowObjects.length == 0)
				{
					loadGridFromSiteWideQueries(existingQueries);
				}
				else if (existingQueries.length > 0 && gGridRowObjects.length > 0)
				{
					alert(MSG_MediaQueriesBeingPrepended);
					prependGridWithSiteWideQueries(existingQueries);
				}
			}
		}
	}
}
function prependGridWithSiteWideQueries(queries)
{
	var freshQueries = copyGridRowObjects();
	loadGridFromSiteWideQueries(queries);
	for (var i = 0; i < freshQueries.length; i++)
		appendRow(freshQueries[i]);
	selectRow(gGridRowObjects.length - 1);
}
function copyGridRowObjects()
{
	var outList = [];	
	for (var i = 0; i < gGridRowObjects.length; i++)
		outList.push(gGridRowObjects[i]);
	return outList;
}
function thisDocHasSiteWideFileLinked() 
{	
	var encodedMediaQueryFile = dw.doURLEncoding( getSiteWideFileUrl(), "", true, false, false);			
	var depFiles = dw.getDocumentDOM().getDependentFiles();
	// The dependent files list doesn't URL encode double bytes, apparently, but it does encode parts of the path.
	// We need to unencode and re-encode so it will match the encodedMediaQueryFile format.  
	for (var i = 0; i < depFiles.length; i++)
	{
		depFiles[i] = dw.doURLDecoding(depFiles[i]);
		depFiles[i] = dw.doURLEncoding( depFiles[i], "", true, false, false);			
	}

	return foundValueInList( encodedMediaQueryFile,  depFiles);	
}
function enablePresetsButton() 
{		
	gPresetsButton.disabled = false;
}
function disablePresetsButton() 
{		
	gPresetsButton.disabled = true;
}
function enableDisableSelectionDependentControls() 
{
	var isDisabled = (gSelectedRowIndex == -1);
		
	gDeleteRowButton.disabled = isDisabled;
	gPropertiesSectionHeaderElem.className = isDisabled ? 'disabledText' : '';
	gPropertiesSectionBodyElem.className = isDisabled ? 'disabledText' : '';
	gDescriptionEditBox.value = '';
	gDescriptionEditBox.disabled = isDisabled;
	
	gCssDropdown.disabled = isDisabled;
	gCssFileEditBox.value = '';
	gCssFileEditBox.disabled = isDisabled;
	gBrowseFolderButton.disabled = isDisabled;
	
	if (gSelectedRowIndex != -1)
	{
		// If there is a selected row, see if its media query is valid (able to be parsed).
		var isInvalidMediaQuery = (parseMediaQueryList(gGridRowObjects[gSelectedRowIndex].mediaQuery).errorStr != '');
		isDisabled = isInvalidMediaQuery;
	}
	gMinWidthEditBox.value = '';
	gMinWidthEditBox.disabled = isDisabled;
	gMaxWidthEditBox.value = '';
	gMaxWidthEditBox.disabled = isDisabled;
		
}
function appendRow(rowObj) 
{
	gGridRowObjects.push(rowObj);
					
	var rowHTML = "<tr id='row_UNIQUE_ID' class='gridRow' onclick='parentWindow.onClickGridRow(UNIQUE_ID)'>" +												
						"<td><div id='row_UNIQUE_ID_description' class='gridDescCol'></div></td>" +
						"<td><div id='row_UNIQUE_ID_mediaQuery' class='gridMediaQueryCol'></div></td>" +
						"<td width='100%'><div id='row_UNIQUE_ID_cssFile'></div></td>" +
					"</tr>";
									
	rowHTML = rowHTML.replace(/UNIQUE_ID/g, gUniqueId++);	
	var html = gRowsContainerElem.innerHTML;
	html = html.replace(/\<\/tbody\>/, rowHTML + '</tbody>'); 
	gRowsContainerElem.innerHTML = html;	
	validateAndDrawGridRow(gGridRowObjects.length - 1);	
	disablePresetsButton();
}
function onClickNewRow()
{		
	appendRow( { description:getUniqueDescription(), mediaQuery:'only screen', cssFileUrl:'', cssFileType: 'existing' } );	
	selectRow(gGridRowObjects.length - 1);	
	gDescriptionEditBox.focus();
	gDescriptionEditBox.select();
}
function getUniqueDescription()
{
	var seed = gGridRowObjects.length + 1;
	
	while (1)
	{
		var desc = Label_MediaQuery + " " + seed++;
		var alreadyExists = false;
		for (var i = 0; i < gGridRowObjects.length; i++)
		{
			if (gGridRowObjects[i].description == desc)
			{
				alreadyExists = true;
				break;
			}
		}
		if (!alreadyExists)
			return desc;
	}
}
function addToDeleteListIfNeeded(gridRowObject)
{
	if (gridRowObject.existingInfo)
		gListToDelete.push(gridRowObject);
}
function onClickDeleteRow()
{
	if (gSelectedRowIndex == -1)
		return;
		
	addToDeleteListIfNeeded(gGridRowObjects[gSelectedRowIndex]);
	
	var elem = getRowElem(gSelectedRowIndex);
	var parent = elem.parentNode;
	parent.removeChild(elem);
	
	gGridRowObjects.splice(gSelectedRowIndex, 1);
	
	if (gGridRowObjects.length == 0)
	{
		gSelectedRowIndex = -1;
		enableDisableSelectionDependentControls();
		enablePresetsButton();
		return;
	}
	
	if (gSelectedRowIndex >= gGridRowObjects.length)
		gSelectedRowIndex = gGridRowObjects.length - 1;
		
	selectRow(gSelectedRowIndex);
}
function populatePropertiesControls()
{
	if (gSelectedRowIndex == -1)
		return;
		
	var rowDataObj = gGridRowObjects[gSelectedRowIndex];
	
	gDescriptionEditBox.value = rowDataObj.description;
	
	var minMaxWidthsObj = getMinMaxWidthsObj(rowDataObj.mediaQuery);
	gMinWidthEditBox.value = minMaxWidthsObj.minWidth;
	gMaxWidthEditBox.value = minMaxWidthsObj.maxWidth;
	
	gCssDropdown.selectedIndex = rowDataObj.cssFileType == 'existing' ? 0 : 1;	
		
	gCssFileEditBox.value = absToRelUrl(dw.getDocumentDOM().URL, rowDataObj.cssFileUrl); 
	
	updateBrowseFolderIconTooltip();
}
function getMinMaxWidthsObj(strMediaQueryList)
{
	// If there are multiple media queries, only the first min-width or max-width media features will be returned.
	
	var mqObj = parseMediaQueryList(strMediaQueryList);
	
	if (mqObj.errorStr)
		return {minWidth:'', maxWidth:''};
		
	var mediaQueryList = mqObj.mediaQueryList;
	var foundMin = false;
	var foundMax = false;
	var minWidth = '';
	var maxWidth = '';
	
	for (var i = 0; i < mediaQueryList.length; i++)
	{
		var features = mediaQueryList[i].mediaFeatures;
		for (var j = 0; j < features.length; j++)
		{
			var thisFeature = features[j];
			if (thisFeature.feature == 'width')
			{
				if (thisFeature.comparisonType == 'min')
				{
					if (!foundMin)
					{
						foundMin = true;
						minWidth = parseInt(thisFeature.value);	 
					}
				}
				else if (thisFeature.comparisonType == 'max')
				{
					if (!foundMax)
					{
						foundMax = true;
						maxWidth = parseInt(thisFeature.value);	
					}
				}
			}
		}
	}
	return {minWidth : minWidth, maxWidth : maxWidth};
}
function updateProperty(prop)
{
	if (gSelectedRowIndex == -1) 
		return;
		
	var rowDataObj = gGridRowObjects[gSelectedRowIndex];
	
	if (prop == 'description')	
		rowDataObj.description = gDescriptionEditBox.value;
	else if (prop == 'minWidth')		
		rowDataObj.mediaQuery = setWidthFeatureValue(rowDataObj.mediaQuery, 'min', gMinWidthEditBox.value);	
	else if (prop == 'maxWidth')
		rowDataObj.mediaQuery = setWidthFeatureValue(rowDataObj.mediaQuery, 'max', gMaxWidthEditBox.value); 
	else if (prop == 'cssFileUrl')
	{
		rowDataObj.cssFileType = gCssDropdown.selectedIndex == 0 ? 'existing' : 'new';
		var cssFileUrl = dws.trim(gCssFileEditBox.value);
		if (rowDataObj.cssFileType == 'new' && cssFileUrl != '' && !hasCssExtension(cssFileUrl))
			cssFileUrl += '.css';
		gCssFileEditBox.value = cssFileUrl;
		rowDataObj.cssFileUrl = cssFileUrl == '' ? '' : dw.relativeToAbsoluteURL( dw.getDocumentDOM().URL, 	dw.getSiteRoot(),	cssFileUrl ); 
	}
	
	validateAndDrawGridRow(gSelectedRowIndex);
	scrollIfRowTooLow(getRowElem(gSelectedRowIndex));
}
function hasCssExtension(inFileName)
{
	var fileName = String(inFileName);
	return ( fileName.substr(fileName.length - 4, 4).toLowerCase() == '.css' );
}
function slashIfNeeded(strIn)
{
	var str = String(strIn);
	if (str.length == 0)
		return '';
	if (str.charAt(str.length - 1) == '/')
		return '';
		
	return '/';
}
function getCssFileNameFromDescription(description)
{
	return dws.stripInvalidVarChars(String(description)) + '.css';
}
function setWidthFeatureValue(strMediaQueryList, comparisonType, value)
{
	// Update, add, or delete the min or max width of every Media Query in the list and pass out the Media Query List text string.
		
	// Clean up the value the user typed into the edit box.
	var strValue = String(value).replace(/\s*/g , "");	// Remove any whitespace.
	if (strValue.length > 4)
		strValue = '9999'; // Letting them put an arbitrarily long string was causing JS error.
	var intValue = parseInt(strValue);
	if (isNaN(intValue) || intValue < 0)
		strValue = '';  // If they type a non-number, just clear it out.
	else
		strValue = String(intValue)
		
	// Update the edit box to reflect the 'clean up' of its value.
	if (comparisonType == 'min')
		gMinWidthEditBox.value = strValue;
	else
		gMaxWidthEditBox.value = strValue;	
		
	var deleting = (strValue == ''); // If the edit box is blank, we need to find and delete this media feature.
	
	var mqObj = parseMediaQueryList(strMediaQueryList);	
	if (mqObj.errorStr)
		return strMediaQueryList; // There was a parsing problem, just return what they passed in.
		
	var mediaQueryList = mqObj.mediaQueryList;
	
	// Set every matching media feature in each media query to the value passed in.
	for (var i = 0; i < mediaQueryList.length; i++)
	{
		var matchingIndexes = []; // Keep track of media features we find in case we need to delete them later.
		var firstMinWidth = -1;   // Keep track of location of first min-width media feature in case we need to insert after it.
		var firstMaxWidth = -1;   // Keep track of location of first max-width media feature in case we need to insert before it.
			
		for (var j = 0; j < mediaQueryList[i].mediaFeatures.length; j++) 
		{
			var thisFeature = mediaQueryList[i].mediaFeatures[j];
			if (thisFeature.comparisonType == 'min' && thisFeature.feature == 'width' && firstMinWidth == -1)
				firstMinWidth = j;
			if (thisFeature.comparisonType == 'max' && thisFeature.feature == 'width' && firstMaxWidth == -1)
				firstMaxWidth = j;
			if (thisFeature.comparisonType == comparisonType && thisFeature.feature == 'width')
			{
				matchingIndexes.push(j);
				// If we found it, and the new value is not empty, go ahead and update it now.
				if (!deleting)
					thisFeature.value = parseInt(strValue) + 'px'; 
			}
		}
		if (deleting)
		{
			mediaQueryList[i].mediaFeatures = pruneList(mediaQueryList[i].mediaFeatures, matchingIndexes);	
		}
		else if (matchingIndexes.length == 0)
		{
			// Didn't find a matching feature, must add it.	
			
			if (comparisonType == 'min')
				// Put it right before the first max-width feature, or at front if max-width not found.
				mediaQueryList[i].mediaFeatures.splice((firstMaxWidth == -1 ? 0 : firstMaxWidth), 0, {comparisonType:'min',feature:'width',value:strValue+"px"});
			else
				// Put it right after the first min-width feature, or at front if min-width not found.
				mediaQueryList[i].mediaFeatures.splice((firstMinWidth == -1 ? 0 : firstMinWidth + 1), 0, {comparisonType:'max',feature:'width',value:strValue+"px"});
		}		
	}
	return unparseMediaQueryList(mediaQueryList);
}
function pruneList(list, indexesToPrune)
{
	var listOut = [];
	for (var i = 0; i < list.length; i++)
	{
		if (!foundValueInList(i, indexesToPrune))
			listOut.push(list[i]);
	}
	return listOut;
}
function foundValueInList(value, list)
{
	for (var i = 0; i < list.length; i++)
		if (list[i] == value)
			return true;
			
	return false; 
}
function validateAndDrawGridRow(index)
{
	var rowDataObj = gGridRowObjects[index];
	var rowId = getRowElem(index).id;
			
	// Description
	gBrowserCtrlDoc.getElementById(rowId + '_description').innerHTML = htmlEncode(rowDataObj.description); 
			
	// Media Query
	var mqHTML = '';
	var missingMinOrMax = false;
	if (parseMediaQueryList(rowDataObj.mediaQuery).errorStr)
		mqHTML = getErrorHTML(MSG_InvalidMediaQuery, rowDataObj.mediaQuery);
	else if (gDisplayErrors && !hasMinOrMaxWidth(rowDataObj.mediaQuery))
	{
		missingMinOrMax = true;
		mqHTML = getErrorHTML(MSG_PleaseProvideMinAndOrMaxWidth, rowDataObj.mediaQuery);
	}
	else
		mqHTML = rowDataObj.mediaQuery;		
	gBrowserCtrlDoc.getElementById(rowId + '_mediaQuery').innerHTML = mqHTML;

	// CSS File
	var cssFileErrorMsg = '';				
	
	if (gDisplayErrors)
	{
		if (rowDataObj.cssFileType == 'existing' && rowDataObj.cssFileUrl == '')	
			cssFileErrorMsg = MSG_PleaseSelectAFile;
		else if (rowDataObj.cssFileType == 'new' && rowDataObj.cssFileUrl == '')
			cssFileErrorMsg = MSG_PleaseSpecifyAFileName;
		else if (rowDataObj.cssFileType == 'new' && dws.isFile(rowDataObj.cssFileUrl))
			cssFileErrorMsg = dws.sprintf(MSG_FileAlreadyExists, dws.getFileName(rowDataObj.cssFileUrl));
		else if (isRemoteUrl(rowDataObj.cssFileUrl) && rowDataObj.cssFileType == 'new')
			cssFileErrorMsg = MSG_InvalidFileNameOrPath;
		else if (!isRemoteUrl(rowDataObj.cssFileUrl) && !dws.isFile(rowDataObj.cssFileUrl))
		{															
			if (rowDataObj.cssFileType == 'existing')
					cssFileErrorMsg = MSG_FileNotFound;
			else if (rowDataObj.cssFileType == 'new')
			{													
				if (rowDataObj.cssFileUrl.indexOf('file:') != 0)
				{
					// The html file hasn't been saved, so we don't know where it will be on the hard drive, ergo, we don't know where
				    // to create the new css file.
					cssFileErrorMsg = MSG_CantCreateFileUntilDocSaved;
				}
				else
				{
					var pathToFolder = dws.getParentURL(rowDataObj.cssFileUrl);
					if (pathToFolder && !dws.isFolder(pathToFolder))				
						DWfile.createFolder(pathToFolder);
						
					if (DWfile.write(rowDataObj.cssFileUrl, ''))
						DWfile.remove(rowDataObj.cssFileUrl);
					else
						cssFileErrorMsg = MSG_InvalidFileNameOrPath;
				}
			}
		}	
		
		if ( rowDataObj.cssFileUrl != '')
		{
		 	if (rowDataObj.cssFileUrl == getSiteWideFileUrl())
				cssFileErrorMsg = MSG_CssIsSWMQF;		
			else if (!isRemoteUrl(rowDataObj.cssFileUrl))
			{
				var fileOutsideSite = rowDataObj.cssFileUrl.indexOf(dw.getSiteRoot()) != 0;	
				if (docIsInASite() && fileOutsideSite)
					cssFileErrorMsg = MSG_PleaseSelectFileInSite;							
			}		
		}
	}
	
	var cssFileHTML;
	var displayUrl = rowDataObj.cssFileUrl;
	
	if (!isRemoteUrl(displayUrl))
		displayUrl = absToRelUrl(dw.getDocumentDOM().URL, rowDataObj.cssFileUrl);

	if (gDisplayErrors && cssFileErrorMsg != '')
		cssFileHTML = getErrorHTML(cssFileErrorMsg, displayUrl);	
	else
		cssFileHTML = htmlEncode(displayUrl); 
		
	gBrowserCtrlDoc.getElementById(rowId + '_cssFile').innerHTML = cssFileHTML;
	
	if (missingMinOrMax || cssFileErrorMsg != '') // Return false if there was a fatal error that would prevent command from executing properly.
		return false;
		
	return true;
}
function isRemoteUrl(inUrl)
{
	var url = String(inUrl).toLowerCase();
	if (url.indexOf('http://') == 0)
		return true;
	if (url.indexOf('https://') == 0)
		return true;

	return false;
}
function hasMinOrMaxWidth(strMediaQueryList)
{
	var mqObj = parseMediaQueryList(strMediaQueryList);
	if (mqObj.errorStr)
		return false;
	for (var i = 0; i < mqObj.mediaQueryList.length; i++)
	{
		var mediaFeatures = mqObj.mediaQueryList[i].mediaFeatures;
		for (var j = 0; j < mediaFeatures.length; j++)		
			if (mediaFeatures[j].feature == 'width' && mediaFeatures[j].comparisonType != 'exact')
				return true;		
	}	
	return false;
}
function getErrorHTML(errorMsg, strIn)
{							
	return html = "<div class='error'>" +
					"<div class='errorHeader'>" + htmlEncode(errorMsg) + "</div>" +
					"<div class='errorBody'>" +  htmlEncode(dws.trim(String(strIn))) + "</div>" +
				"</div>";				
}
function htmlEncode(str)
{
	return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function onChangeCssSelect()
{
	var rowDataObj = gGridRowObjects[gSelectedRowIndex];
	rowDataObj.cssFileType = gCssDropdown.selectedIndex == 0 ? 'existing' : 'new';	
	updateBrowseFolderIconTooltip();
	updateProperty('cssFileUrl');
}
function updateBrowseFolderIconTooltip()
{
	if (gCssDropdown.selectedIndex == 0)
		gBrowseFolderButtonElem.setAttribute('alt', MSG_LabelSelectFile);
	else
		gBrowseFolderButtonElem.setAttribute('alt', MSG_SaveFileAs);
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
			editBox.value = browsedFile;		
		else		
			editBox.value = absToRelUrl(dw.getDocumentDOM().URL, browsedFile);
					
		updateProperty('cssFileUrl');
	}					
}
function onBlurCssPathOrFile()
{	
	updateProperty('cssFileUrl')
		
}
function onClickAttachToSiteWideFileRadioButton() 
{		
	gAttachToThisDocRadioButton.checked = !gAttachToSiteWideFileRadioButton.checked;	
	enableDisableSiteWideWarningText();
	
	if (gAttachToSiteWideFileRadioButton.checked && !gHaveLoadedSiteWideMediaQueries)
	{
		var linkedMediaQueries = getWidthMediaQueriesFromSiteWideFile();	
		if (linkedMediaQueries.length > 0 && gGridRowObjects.length == 0)
		{
			loadGridFromSiteWideQueries(linkedMediaQueries); 		
		}
		else if (linkedMediaQueries.length > 0 && gGridRowObjects.length > 0)
		{
			alert(MSG_MediaQueriesBeingPrepended);
			prependGridWithSiteWideQueries(linkedMediaQueries);			
		}
	}
}
function onClickAttachToThisDocRadioButton()
{
	gAttachToSiteWideFileRadioButton.checked = !gAttachToThisDocRadioButton.checked;	
	enableDisableSiteWideWarningText();
}
function enableDisableSiteWideWarningText()
{
	gThisDialogAffectsOtherPagesWarningElem.className =  gAttachToSiteWideFileRadioButton.checked ? "" : "disabledText";
}
function getMediaQueryObjectsThatHaveWidths(allMediaQueries, sourceFileUrl)
{	
	var widthMediaQueries = [];	
	for (var i = 0; i < allMediaQueries.length; i++)
	{
		var obj = eval( '(' + allMediaQueries[i] + ')' );
		if (obj && hasMinOrMaxWidth(obj.mq))
		{
			obj.cssFileUrl = dw.relativeToAbsoluteURL(sourceFileUrl, dw.getSiteRoot(), obj.css);
			widthMediaQueries.push(obj);		
		}
	}
	
	return widthMediaQueries;
}
function inspectUserDoc()
{	
	gGridRowObjects = [];
	gListToDelete = [];
	
	gDocHasSiteWideFileLinked = thisDocHasSiteWideFileLinked();

	if (gDocHasSiteWideFileLinked)
	{										
		var linkedMediaQueries = getWidthMediaQueriesFromSiteWideFile();
	}

	var localMediaQueries = getMediaQueryObjectsThatHaveWidths(dw.getDocumentDOM().collectMediaQueries(), dw.getDocumentDOM().URL); 

	gDocHasMQsWithin = (localMediaQueries.length > 0);					
	
	if (gDocHasSiteWideFileLinked && gDocHasMQsWithin)
		return;  // We don't support this scenario.			
						
	if (gDocHasSiteWideFileLinked)
		loadGridFromSiteWideQueries(linkedMediaQueries);
	else
		loadGrid(localMediaQueries);
				
	gDocHasMetaTag = (getMetaTagElem() != null);
}
function loadGrid(widthMediaQueries, sourceOfQueries) // sourceOfQueries is optional.  It defaults to "thisDoc".
{
	clearGrid();
		
	for (var i = 0; i < widthMediaQueries.length; i++) 
	{
		var obj = widthMediaQueries[i];
		var desc = dws.trim(obj.desc)
		
		if (desc == '')
			desc = dws.getSimpleFileName(obj.css);
										
		var gridRowObject = { description: desc, mediaQuery: obj.mq, cssFileUrl: obj.cssFileUrl, cssFileType: 'existing' };
		gridRowObject.existingInfo = obj;
		if (sourceOfQueries == 'siteWideFile')
			gridRowObject.fromSiteWideFile = true;

		appendRow(gridRowObject);
	}
}
function loadGridFromSiteWideQueries(queries)
{
	loadGrid(queries, "siteWideFile");
	gHaveLoadedSiteWideMediaQueries = true;
}
function clearGrid()
{
	while (gGridRowObjects.length > 0)
	{
		selectRow(0);
		onClickDeleteRow(); 
	}			
}
function getWidthMediaQueriesFromSiteWideFile()
{
	var linkedMediaQueries = [];
	var siteWideFile = getSiteWideFileUrl();
	if (siteWideFile != '' && dws.isFileReadable(siteWideFile))
		linkedMediaQueries = getMediaQueryObjectsThatHaveWidths( dw.getDocumentDOM(siteWideFile).collectMediaQueries(), siteWideFile); 

	return linkedMediaQueries;
}
function isTemplate()
{
	var pos;
	var str = dw.getDocumentDOM().documentElement.outerHTML;	 
	pos = str.search(/TemplateBeginEditable/i);	
	return (pos != -1);
}
function isTemplateInstance()
{
	var pos;
	var str = dw.getDocumentDOM().documentElement.outerHTML;	 
	pos = str.search(/InstanceBeginEditable/i);	
	return (pos != -1);
}
function writeNewLinkTags(newTagsHTML)
{
	var heads = dw.getDocumentDOM().getElementsByTagName('head');
	var headTagFound = heads.length > 0;
	
	if (!headTagFound)	
		return;  // Should never happen since dw returns a head tag even if doc doesn't have one.	
	
	if (headTagFound && isTemplateInstance())	
		insertTagsInEditableRegionOfHead(newTagsHTML);		
	
	if (headTagFound && !isTemplateInstance())
	{
		var head = heads[0];
		var lastCSSLink = null;
		var firstScriptTag = null;
		var lastStyleTag = null;
		var links = head.getElementsByTagName('link');
		for (var i = 0; i < links.length; i++)		
		{
			var rel = String(links[i].rel).toLowerCase();
			if (rel == "stylesheet")
				lastCSSLink = links[i];
		}
		var scripts = head.getElementsByTagName('script');
		if (scripts.length > 0)		
			firstScriptTag = scripts[0];		
		var styles = head.getElementsByTagName('style');
		for (var i = 0; i < styles.length; i++)		
			lastStyleTag = styles[i];		
		if (lastCSSLink)		
			lastCSSLink.outerHTML = lastCSSLink.outerHTML + newTagsHTML; 
		else if (lastStyleTag)		
			lastStyleTag.outerHTML =  lastStyleTag.outerHTML + newTagsHTML;		
		else if (firstScriptTag)		
			firstScriptTag.outerHTML =  newTagsHTML + firstScriptTag.outerHTML;		
		else		
			head.innerHTML = head.innerHTML + newTagsHTML;		
	}
}
function displayHelp()
{
   dwscripts.displayDWHelp(HELP_DOC);
}
