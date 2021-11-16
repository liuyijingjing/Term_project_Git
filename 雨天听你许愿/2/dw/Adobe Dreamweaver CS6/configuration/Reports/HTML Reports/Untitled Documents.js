// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

// include ../reports.js

//***************        GLOBALS       ***************

var helpDoc = MM.HELP_reportUntitledDocuments;

//***************          API         ***************


//---------------
// Function: configureSettings
// Description: Standard report API, used to initialize and load
//  the default values. Does not initialize the UI.
//
function configureSettings() {
  loadDefaultTitle();
  return false; // No settings to configure
}


//---------------
// Function: commandButtons
// Description: Standard report API, like commands the return value
//  controls the display of command buttons in the settings dialog.
//
function commandButtons() {
  return new Array(
        MM.BTN_Process,  "processFile(dw.getDocumentDOM().URL)", 
        MM.BTN_Cancel,   "cleanupUI()"
    );
}


//---------------
// Function: processFile
// Description: Report command api called during file processing.
//
function processFile (fileURL) {
  if (!isHTMLType(fileURL))
    return;

  var curDOM = dw.getDocumentDOM(fileURL);

  // Library items don't have TITLE tags, and it's perfectly normal 
  // for a Template file to be Unititled, so don't bother reporting 
  // on .lbi and .dwt files. (See also logic below for included fragments.)
  if (curDOM.getIsLibraryDocument() || curDOM.getIsTemplateDocument())
    return;
  
  var titles = curDOM.getElementsByTagName('title');
  
  // If more than one title is found, report the redundant tag.
  if (titles.length > 1) {
    reportItem(REP_ITEM_WARNING, fileURL, REPORT_TITLE_MULTIPLE, curDOM.nodeToSourceViewOffsets(titles[1]));
  }

  // If the title tag is missing entirely, first check whether the document
  // is a fragment (no <html>, <head>, or <body> tags)
  if (titles.length < 1) {
    var docContents = curDOM.documentElement.outerHTML;
    if (docContents){
      docContents = docContents.toLowerCase();
      if (docContents.indexOf('<html') == -1 && docContents.indexOf('<head>') == -1 && docContents.indexOf('<body') == -1){
        // do nothing -- doc is a fragment.
      }
      else {
        reportItem(REP_ITEM_WARNING, fileURL, REPORT_TITLE_NONE, null);
      }
    }
  } 
  // We have at least one title, but it's empty.
  else if (isAllWhite(titles[0].innerHTML)) { 
    reportItem(REP_ITEM_WARNING, fileURL, REPORT_TITLE_EMPTY, 
               curDOM.nodeToSourceViewOffsets(titles[0]));
  }
  // We have at least one title, but it has a default value
  // (e.g., "Untitled Document", "Welcome to Adobe GoLive")
  else if (isDefaultName(titles[0].innerHTML)) {
    reportItem(REP_ITEM_WARNING, fileURL, 
               printString(REPORT_TITLE_DEFAULT, titles[0].innerHTML),
               curDOM.nodeToSourceViewOffsets(titles[0]));
  }
}


//***************    LOCAL FUNCTIONS   ***************


//---------------
// Function: isDefaultName
// Description: Comparison of untitled documents.
// Note: This function refers to a global array of untitled document names.
//  This includes a list of known file types as well as the untitled document
//  from the Dreamweaver file template.
//
function isDefaultName (titleText) {
  var rtnBool = false;
//??? Possible issue here with document titles encoded in a double byte language.
//??? Scotts work with UTF8 may resolve the issue. 
  if (UNTITLED_LIST) { 
    for (var i=0; i < UNTITLED_LIST.length && !rtnBool; i++) {
      if (titleText.indexOf(UNTITLED_LIST[i]) > -1) { rtnBool = true }
    }
  }
  return rtnBool;
}


//---------------
// Function: loadDefaultTitle
// Description: Adds the title from Dreaweaver template document to global
//  list of untitled document names.
//
function loadDefaultTitle() {
  var curDOM = dw.getDocumentDOM('../../DocumentTypes/NewDocuments/Default.html');
  var titles;
  
  if (curDOM) {
    titles = curDOM.getElementsByTagName('title');
    if (titles.length > 0) {
      // Set global variable.
      UNTITLED_LIST.push(titles[0].innerHTML);
    }
  }
}



//---------------
//
function cleanupUI() {
  window.close();
}



//---------------
//
function isWhite( c )
{
   return( c == ' ' || c == '\t' || c == '\n' || c == '\r' );
}



//---------------
//
function isAllWhite( str )
{
   for( var i = 0; i < str.length; i++ )
   {
      if ( !isWhite( str.charAt( i ) ) )
         return( false );
   }
   
   return( true ); 
}
