// Copyright 2007 Adobe Systems Incorporated.  All rights reserved.
//
// AdobePatentID="B683"

var helpDoc = MM.HELP_cmdExternalizeJavaScript;


var CURRENT_EDITS = [];
var PRE_EXTRACTION_SUMMARY;
var LAST_ROW = null;
var ALT_ROW_STYLE = false;
var CMD_FILE = dw.getConfigurationPath() + '/Commands/ExternalizeJavaScript.html';

//---------------     API FUNCTIONS    ---------------

function canAcceptCommand()
{
  var retVal = false;
  var doc = dw.getDocumentDOM();
  if (doc && doc.getDesignViewMode() == "editable")
  {
    var head = doc.getElementsByTagName("head");
    var body = doc.getElementsByTagName("body");
    // Don't restrict the document to a single head and body. We'll
    // warn the user about two-headed monsters below.
    if (head.length > 0 && body.length > 0)
    {
      head = head[0].outerHTML;
      body = body[0].outerHTML;
      // We can't just check for the existence of a head and a body,
      // because Dreamweaver will insert 'dummy' ones into partial
      // documents for parsing reasons. However, when reading the
      // outerHTML of the a dummy head or body, the head or body
      // tag won't be there. Only allow this command to run on
      // documents that have a *real* head and body.
      if (head.toLowerCase().indexOf('<head>') == 0 && body.toLowerCase().indexOf('<body') == 0)
      {
        retVal = true;
      }
    }
  }
  return retVal;
}

function commandButtons()
{
  return new Array(MM.BTN_OK, "onOK();", 
                   MM.BTN_Cancel, "window.close();",
                   MM.BTN_Help,"displayHelp()");
}

//---------------     EXTERNALIZER FUNCTIONS    ---------------

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		initializeUI
//
// PURPOSE
//		Initializes all UI elements in the command dialog. We're using an
//    mm:browsercontrol to contain the pre-extraction summary because we
//    need both a list with form fields in it, and scrollbars if the list
//    exceeds the minimum size of the dialog.
/////////////////////////////////////////////////////////////////////////////
function initializeUI()
{
  CURRENT_EDITS = [];
  LAST_ROW = null;
  
  var dom = dw.getDocumentDOM();
  var docType = dom.documentType;

  // If the user's page is dynamic (i.e., PHP, CF, ASP, etc.), 
  // tell them that we're liable to eat their code, and give them the option of
  // continuing or bailing.
  if (docType.indexOf("PHP") != -1 || docType.indexOf("ASP") != -1 || docType.indexOf("ColdFusion") != -1 || docType.indexOf("JSP") != -1)
  {
    var prefSection = "Extensions\\Commands\\ExternalizeJS";
    var prefKey = "SkipDynamicWarning";
    var dontShowAgain = dw.getPreferenceString(prefSection, prefKey, -1);
    if (dontShowAgain == -1 || dontShowAgain == false)
    {
      var proceed = dwscripts.askOkCancel(dw.loadString("Commands/ExternalizeJS/dynamicSorry"), prefSection, prefKey);
      if (!proceed)
        window.close();
    }
  }

  // Make sure we start with a fresh list of potential new IDs.
  resetIDCache();
  EditObj.nextRepeatElementID = 1;

  // The browser control
  PRE_EXTRACTION_SUMMARY = document.getElementById("tableContainer");

  // If the user changed the default toggle last time, recall it.
  var theFile = MMNotes.open(CMD_FILE, true);
  if (theFile){
    if (MMNotes.get(theFile,"toggleState"))
      setToggleState(MMNotes.get(theFile,"toggleState"));
    MMNotes.close(theFile);
  }

  // Display the list of potential edits to the user.
  loadSummaryTable();
    
  // Now wait for the HTML to fully load into the browser control, and then
  // attach event handlers to the form fields.
  PRE_EXTRACTION_SUMMARY.addEventListener("BrowserControlLoad", 
          function(e){ 
              attachEventHandlers(); 
          } , 
          true);  
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
// headIsEditable
//
// PURPOSE
// Given a document, determine if it is possible to insert content into its
// <head> section. Return true if an edit can be made, otherwise, return
// false.
/////////////////////////////////////////////////////////////////////////////
function headIsEditable(doc)
{
  if (doc.getAttachedTemplate().length > 0)
  {
    // If the document is a template instance file. Make sure
    // it has at least one editable region defined in the head.

    var head = doc.getElementsByTagName("head")[0];
    if (head)
    {
      // Apparently, getElementsByTagName() won't give us back elements with
      // a name of MMTINSTANCE:EDITABLE. We'll have to traverse manually
      // to find them.

      var eles = getElementsPreOrder(head);
      for (var i = 0; i < eles.length; i++)
      {
        if (eles[i].nodeName == "MMTINSTANCE:EDITABLE")
          return true;
      }
    }
    return false;
  }
  return true;
}
/////////////////////////////////////////////////////////////////////////////
// FUNCTION
// loadSummaryTable
//
// PURPOSE
// Assembles the list of edits and loads them into the browsercontrol.
/////////////////////////////////////////////////////////////////////////////
function loadSummaryTable(toggleState)
{
  // If this is called without an argument (this happens from initUI(), and also
  // when the unobtrusive radio button is clicked because we need to set the
  // toggleState based on the user's answer to the Behaviors warning Y/N dialog),
  // see which radio button is checked.
  if (!toggleState) toggleState = getToggleState();

  var tableContents = "";
  var dom = dw.getDocumentDOM();
  
  // Deal with all the possible edge/error cases first (see normal case below in the
  // else).  
  if (!headIsEditable(dom))
  {
    // The <head> section of the user's page isn't editable, so we won't be able
    // to insert the necessary external script references. Inform the user and bail.

    tableContents = "<p>" + dw.loadString("Commands/ExternalizeJS/noEditableRegion") + "</p>";
  }
  else if ((dom.getElementsByTagName("head")).length > 1)
  {
    // You seem to have more than one head there, buddy.
    tableContents = "<p>" + dw.loadString("Commands/ExternalizeJS/twoHeads") + "</p>";    
  }
  else
  {
    // This is the normal case: A document with a head and a body, that contains JavaScript,
    // and that doesn't contain server markup.

    // Determine which edits need to be made. Only get the extractor edits once, the first
    // time through (when CURRENT_EDITS is just an empty array).
    if (CURRENT_EDITS.length == 0)
      CURRENT_EDITS = getExtractorEdits(dom);
    
    if (CURRENT_EDITS.length > 0)
    {
      // Build up a summary table of the proposed edits. Each row of the table will
      // describe a planned edit and provide a checkbox that lets the user opt 
      // out of making an edit (or opt in in the case of edits that are off by default).
      // For edits that require an id to be added to a node, the row will also 
      // contain an edit field so that the user can change the default id we plan
      // to add.
      tableContents = '<body><form><table id="summaryTable" cellspacing="0"><tr class="header">\n<th>&nbsp;</th>\n<th>' + dw.loadString("Commands/ExternalizeJS/summaryTable/editType") + '</th>\n<th>' + dw.loadString("Commands/ExternalizeJS/summaryTable/element") + '</th>\n<th>' + dw.loadString("Commands/ExternalizeJS/summaryTable/ID") + '</th>\n</tr>\n';
      
      var editObj;
      for (var i=0; i < CURRENT_EDITS.length; i++)
      {
        editObj = CURRENT_EDITS[i];
        if (toggleState == "unobtrusive" || (toggleState == "externalize" && editObj.type != 1))
            tableContents += buildSummaryRow(editObj, i);
      }

      tableContents += '</table></form></body>'; 

      if (tableContents.search(/<td/) == -1)
      {
        var msgStr = dw.loadString("Commands/ExternalizeJS/alreadyExternal");
        msgStr = dwscripts.sprintf(msgStr, dw.loadString("Commands/ExternalizeJS/unobtrusiveRadio"));
        tableContents = '<p>' + msgStr + '</p>';
      }
    }
    else
    {
      // Hmm, why are you trying to extract JavaScript from a document that doesn't
      // contain any?
      tableContents = "<p>" + dw.loadString("Commands/ExternalizeJS/noJSToExtract") + "</p>";
    }
  }

  // Get the styles necessary for making the content in the browsercontrol
  // look like the rest of the dialog.
  var styleFile = dw.getConfigurationPath() + "/Styles/ExternalizeJavaScript.css";
  var styleStr = '';
  if (DWfile.exists(styleFile))
  {
    styleStr = DWfile.read(styleFile);
    if (styleStr)
      styleStr = '<head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><style type="text/css">' + styleStr + '</style></head>';
  }

  // Stick the styles and the summary table into the browser control 
  PRE_EXTRACTION_SUMMARY.loadHTML(styleStr + tableContents);

}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
// buildSummaryRow
//
// PURPOSE
// Given an editObj and its position in the CURRENT_EDITS array, builds
// a table row describing the edit.
/////////////////////////////////////////////////////////////////////////////
function buildSummaryRow(editObj, item)
{
  var summaryRow = "";
  if (LAST_ROW && editObj.element != LAST_ROW.element)
    ALT_ROW_STYLE = (!ALT_ROW_STYLE);

  var classes = [];

  if (editObj.forbidden)
    classes.push("forbidden");

  if (ALT_ROW_STYLE)
    classes.push("altRow");

  if (classes.length > 0)
    summaryRow += '<tr class="' + classes.join(" ") + '">\n';
  else
    summaryRow += '<tr>\n';
    
  summaryRow += '<td class="checkCell">';
  if (!editObj.forbidden)
    summaryRow += '<input type="checkbox" name="edits" editItemIndex="' + item + '"' + ((editObj.doEdit) ? ' checked ' : '') + '>';
  summaryRow += '</td>\n';

  // If this is a "strip attribute" edit, put the name of the attribute
  // being stripped into the description
  if (editObj.type == 1 && editObj.attrName)
    summaryRow += '<td>' + dwscripts.sprintf(convertEditTypeToString(editObj), '<b>' + editObj.attrName + '</b>') + '</td>';
  else
    summaryRow += '<td>' + convertEditTypeToString(editObj) + '</td>';

  // The tag type. The title attribute is supposed to show a tooltip of the outerHTML
  // of the element if the user mouses over the tag name, but currently it doesn't. :(
  summaryRow += '<td title="' + dwscripts.minEntityNameEncode(editObj.element.outerHTML) + '">' + editObj.element.nodeName + '</td>';

  // If this is a forbidden edit use this cell to display the reason.
  if (editObj.forbidden)
    summaryRow += '<td>' + convertForbiddenReasonToString(editObj.forbidden) + '</td>';

  // Don't put anything in the ID column if the tag is BODY or SCRIPT. If it's
  // other than BODY or SCRIPT, the logic gets a bit more complicated...
  else if (editObj.element.tagName == "BODY" || editObj.element.tagName == "SCRIPT")
    summaryRow += '<td>&nbsp;</td>';

  // If this element needs an id...
  else if (editObj.customID && editObj.customID != editObj.element.getAttribute("id"))
  {
    // And it's not the same element as in the last edit, put the proposed
    // id into an edit field so the user can change it if desired.
    if (!LAST_ROW || (LAST_ROW.element != editObj.element))
      summaryRow += '<td><input type="text" id="elemId' + item + '" value="' + editObj.customID + '" editItemIndex="' + item + '"' + (editObj.forbidden ? " disabled " : "") + '></td>';

    // If this *is* the same element as in the last edit, the user's already
    // been presented with an edit field, and the id only needs to be set once.
    else
      summaryRow += '<td>&nbsp;</td>';
  }
 
  // If the element already has an id, just show that.
  else
    summaryRow += '<td>' + editObj.element.getAttribute("id") + '</td>';

  summaryRow += "\n</tr>\n";

  // Remember the edit we just handled, so we can compare it to the next one.  
  LAST_ROW = editObj;
  
  return summaryRow;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
// getToggleState
//
// PURPOSE
// Determines whether the "externalize only" or "externalize and make unob-
// trusive" checkbox is checked.
/////////////////////////////////////////////////////////////////////////////
function getToggleState()
{
  var exCkbox = document.getElementById("externalize");  
  if (exCkbox.checked == true)
    return "externalize";
  else
    return "unobtrusive";
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
// setToggleState
//
// PURPOSE
// Checks the appropriate externalize/unobtrusive radiobutton
/////////////////////////////////////////////////////////////////////////////
function setToggleState(state)
{

  if (state == "externalize")
  {
    document.getElementById("externalize").checked = true;
    document.getElementById("unobtrusive").removeAttribute("checked");
  }
  else
  {
    document.getElementById("unobtrusive").checked = true;
    document.getElementById("externalize").removeAttribute("checked");
  }
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
// showBehaviorWarning
//
// PURPOSE
// Shows the "this breaks the Behaviors panel" warning, if the user hasn't
// already said "don't show me again." Returns the toggle
/////////////////////////////////////////////////////////////////////////////
function showBehaviorWarning(state)
{

  var prefSection = "Extensions\\Commands\\ExternalizeJS";
  var prefKey = "SkipBehaviorWarning";
  var dontShowAgain = dw.getPreferenceString(prefSection, prefKey, -1);
  if (dontShowAgain == -1 || dontShowAgain == false)
  {
    var proceed = dwscripts.askOkCancel(dw.loadString("Commands/ExternalizeJS/externalizeWarning"), prefSection, prefKey);
    if (!proceed)
    {
      setToggleState("externalize");
    }
  }
  // This function only gets called when the unobtrusive button gets clicked,
  // and then the loadSummaryTable() function gets called. We used to pass the
  // id of the button as the toggleState, but as shown above, the toggleState
  // can get reset to "externalize", and we don't want to override that setting.
  // So... don't explicitly pass the toggleState, but rather set it here to be
  // unobtrusive if the user has said "don't show me the warning again."
  else
    setToggleState("unobtrusive");
}

// --------- BEGIN EVENT HANDLER-RELATED FUNCTIONS -------//
//
// The following functions attach event handlers to the form
// fields and links in the browsercontrol in such a way that
// the extension and the browsercontrol can interact, rather
// than being self-contained entities.

// Get the contents of the browser control back as a DOM, and
// attach event handlers to the form fields and links.
function attachEventHandlers()
{
  var summaryDoc = PRE_EXTRACTION_SUMMARY.getWindow().document;
  var inputs = summaryDoc.getElementsByTagName("input");
  var input;
  for (var i = 0; i < inputs.length; i++)
  {
    input = inputs[i];
    if (input.type == "checkbox")
      input.addEventListener("click", getUpdateEditListFunc(input, input.getAttribute("editItemIndex")), false);
    else if (input.type == "text")
    {
      input.addEventListener("blur", getUpdateEditListFunc(input, input.getAttribute("editItemIndex")), false);
      input.addEventListener("keyup", getTestIDFunction(input), false);
    }
  }
}

// Returns a function that calls updateEditList with the specified
// element and editItemIndex. We need this in order to get the form
// fields in the browser control to return data to us here in the
// command.
function getUpdateEditListFunc(element, item)
{
  return function() { updateEditList(element, item); };
}

// The function that actually handles changes to the
// checkboxes and edit fields in the browsercontrol.
function updateEditList(element, item)
{
  if (element.type == "checkbox")
  {
    CURRENT_EDITS[item].doEdit = element.checked;
  }
  else if (element.type == "text")
  {
    var val = element.value;
    if (val != "")
    {
      var curCustomID = CURRENT_EDITS[item].customID;
      for (var i = 0; i < CURRENT_EDITS.length; i++)
      {
        if (CURRENT_EDITS[i].customID == curCustomID)
          CURRENT_EDITS[i].customID = element.value;
      }
    }
    else
    {
      element.value = CURRENT_EDITS[item].customID;
      alert(dw.loadString("Commands/ExternalizeJS/noEmptyIDsAllowed"));
    }
  }
}

// Returns a function that calls testIDForValidity with the input
// whose value is to be tested
function getTestIDFunction(input)
{
  return function() { testIDForValidity(input); };
}

// The function that actually tests the value of the input for validity.
function testIDForValidity(input)
{
  var val = input.value;
  if (val != "" && !dwscripts.isValidID(val))
  {
    alert(dw.loadString("Startup/MMinit/MM.MSG_InvalidIDAutoFix"));
    while (val.charAt(0).search(/\d/) != -1)
      val = val.substring(1);
    input.value = dwscripts.stripInvalidVarChars(val);
    input.focus();
    input.select();
  }
}

// We don't always get an onBlur event when the user makes an edit in a
// text field in the browser control (i.e., they change the value in a field
// and then click the OK button). This function forces a blur event on
// every text field in the document.
function forceBlur()
{
  var summaryDoc = PRE_EXTRACTION_SUMMARY.getWindow().document;
  var inputs = summaryDoc.getElementsByTagName("input");
  
  for (var i=0; i < inputs.length; i++)
  {
    if (inputs[i].type == "text")
      inputs[i].blur();
  }
}

// ---------------- END EVENT-RELATED FUNCTIONS ----------------//

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		DebugEditListToString
//
// PURPOSE
//		Converts the specified array of edit objects into a human readable
//		string.
/////////////////////////////////////////////////////////////////////////////
function DebugEditListToString(edits)
{
  var arr = ["Edit\tType\tEle\tAttr\t\tId\n"];
  for (var i = 0; i < edits.length; i++)
  {
    var e = edits[i];
    if (e.doEdit)
      arr.push("Y\t");
    else
      arr.push("N\t");
    switch(e.type)
    {
      case EditObj.TYPE_ATTRIBUTE:
        arr.push("ATTR\t");
        arr.push(e.element.nodeName.toLowerCase() + "\t" + e.attrName + "\t\t");
        if (e.customID)
          arr.push("<" + e.customID + ">\t");
        else
          arr.push(e.element.id + "\t");
        break;
      case EditObj.TYPE_HEAD_SCRIPT:
        arr.push("HEAD\t" + e.element.nodeName.toLowerCase());
        break;
      case EditObj.TYPE_BODY_SCRIPT:
        arr.push("BODY\t" + e.element.nodeName.toLowerCase());
        break;
    }
    arr.push("\n");
  }
  return arr.join("");
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		EditObj
//
// PURPOSE
//		Constructor for an object that maintains information for an edit.
//
//		The properties of the edit object are as follows:
//
//			this.element
//				- The element the edit will affect.
//
//			this.type
//				- Will be one of the following values:
//					- EditObj.TYPE_ATTRIBUTE
//					- EditObj.TYPE_SCRIPT_HEAD
//					- EditObj.TYPE_SCRIPT_BODY
//
//			this.doEdit
//				- Boolean that decides whether or not the edit should
//				  be performed or skipped.
//
//			this.forbidden
//				- Integer. If non-zero, specifies the reason why this edit
//				  should not be made.
//
//			this.customID
//				- If a non-empty string, the value of the ID attribute
//				  to set on the element when the edit is performed.
//
//			this.customSelector
//				- If a non-empty string, the CSS selector string to be
//				  used when generating code that identifies the element.
//
//			this.attrName
//				- If this.type is EditObj.TYPE_ATTRIBTE, the value of this
//				  property must be non-empty, and must be the name of the
//				  attribute to externalize and remove from the element.
//
//			this.useAddEventListener
//				- If this.type is EditObj.TYPE_ATTRIBTE, the boolean value
//				  of this property determines whether or not this attribute
//				  will be attached to the element with an addEventListener
//				  call or a setAttribute call. If true, addEventListener is
//				  used, if false, setAttribute is used.
/////////////////////////////////////////////////////////////////////////////
function EditObj(ele, type, doEdit, customID, attrName)
{
  this.element = ele;
  this.type = type;
  this.doEdit = doEdit;
  this.forbidden = EditObj.FORBIDDEN_FALSE;
  this.customID = (customID) ? customID : "";
  this.customSelector = "";
  this.attrName = (attrName) ? attrName : "";
  this.useAddEventListener = false;
  this.spryRegionAncestor = null;
  this.isSpryConstructorBlock = false;
}

// The externalizer deals with 3 types of edits:
//
// TYPE_ATTRIBUTE - Move a on* or spry* attribute to an external file.
// TYPE_HEAD_SCRIPT - Move a <script> block, within the <head>, to an external file.
// TYPE_BODY_SCRIPT - Move a <script> block, within the <body>, to an external file.

EditObj.TYPE_ATTRIBUTE = 1;
EditObj.TYPE_HEAD_SCRIPT = 2;
EditObj.TYPE_BODY_SCRIPT = 3;

// The externalizer forbids certain types of edits:
//
// FORBIDDEN_FALSE - This edit is *NOT* forbidden. It is ok to perform this edit.
// FORBIDDEN_EDITABLE_REGION - Doc is a template (.dwt file) and the edit is in an editable region.
// FORBIDDEN_TEMPLATE_REGION_LOCKED - Doc is a template instance and the edit is in a non-editable template region.
// FORBIDDEN_LIBRARY_ITEM_LOCKED - Edit is in a library item.

EditObj.FORBIDDEN_FALSE = 0;
EditObj.FORBIDDEN_EDITABLE_REGION = 1;
EditObj.FORBIDDEN_TEMPLATE_REGION_LOCKED = 2;
EditObj.FORBIDDEN_LIBRARY_ITEM_LOCKED = 3;

// The EditObj.idCache object is a hash table of IDs that are currently
// being used. Note that this includes IDs that have been proposed for
// use with an edit, which is not yet set on an element.

EditObj.idCache = {};

// The EditObj.nextRepeatElementID is used to track the next ID value
// to assign to an element with a spry:repeat or spry:repeatchildren
// attribute on it. An ID is assigned to a repeat element if it contains
// a child element that the extractor must generate a custom ID for. The
// idea here is that a page could potentially have more than one repeat
// region that uses the same data set. We need to make sure that all
// elements underneath these repeats have unique IDs when the markup
// is generated. To avoid ID collisions between 2 repeats that use the
// same data set, we assign each repeat element a unique ID, and make
/// sure that we include this unique ID in the child element IDs we
// generate.

EditObj.nextRepeatElementID = 1;

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		convertEditTypeToString
//
// PURPOSE
//		For each edit object, get a type descriptor string to display
//		to the user in the pre-extraction summary dialog.
/////////////////////////////////////////////////////////////////////////////
function convertEditTypeToString(editObj)
{
  switch(editObj.type)
  {
    case EditObj.TYPE_ATTRIBUTE:
      return dw.loadString("Commands/ExternalizeJS/editType/attribute");
    case EditObj.TYPE_HEAD_SCRIPT:
      if (editObj.isSpryConstructorBlock)
        return dw.loadString("Commands/ExternalizeJS/editType/spryConstructorBlockHead");
      return dw.loadString("Commands/ExternalizeJS/editType/head");
    case EditObj.TYPE_BODY_SCRIPT:
      if (editObj.isSpryConstructorBlock)
        return dw.loadString("Commands/ExternalizeJS/editType/spryConstructorBlockBody");
      return dw.loadString("Commands/ExternalizeJS/editType/body");
  }
  return "";
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		convertForbiddenReasonToString
//
// PURPOSE
//		For each edit type, gets a descriptor string to display
//		to the user in the pre-extraction summary dialog.
/////////////////////////////////////////////////////////////////////////////
function convertForbiddenReasonToString(editType)
{
  switch(editType)
  {
    case EditObj.FORBIDDEN_EDITABLE_REGION:
      return dw.loadString("Commands/ExternalizeJS/forbidden/editableRegion");
      break;
    case EditObj.FORBIDDEN_TEMPLATE_REGION_LOCKED:
      return dw.loadString("Commands/ExternalizeJS/forbidden/templateRegionLocked");
      break;
    case EditObj.FORBIDDEN_LIBRARY_ITEM_LOCKED:
      return dw.loadString("Commands/ExternalizeJS/forbidden/libraryItemLocked");
      break;
    default:
      return "";
  }
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		isJSScript
//
// PURPOSE
//		Returns true if the element is a script element and has a @type
//		attribute that specifies javascript or ecmascript.
/////////////////////////////////////////////////////////////////////////////
function isJSScript(ele)
{
    return ele && ele.nodeName.toLowerCase() == "script" && (!ele.type || ele.type.search(/javascript|ecmascript/i) != -1);
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getInlineScriptBlocks
//
// PURPOSE
//		Traverses the sub-tree underneath the specified element and returns
//		all <script> elements that contain inline JavaScript code.
/////////////////////////////////////////////////////////////////////////////
function getInlineScriptBlocks(ele)
{
    var results = [];
  var scripts = ele.getElementsByTagName("script");
  var numScripts = scripts.length;
  for (var i = 0; i < numScripts; i++)
  {
    var s = scripts[i];
    if (!s.src && isJSScript(s))
      results.push(s);
  }
  return results;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getInlineScriptContent
//
// PURPOSE
//		Returns a string containing the JavaScript code underneath the
//		specified <script> element. This function also strips out any HTML
//		comment and cdata delimiters that might be present in the code
//		returned by DW.
/////////////////////////////////////////////////////////////////////////////
function getInlineScriptContent(ele)
{
  // Get the JavaScript code that is in the script block. We have to
  // manually remove comment and CDATA delimiters, but only if they
  // occur at the start and end of the block.

  var results = "";
  if (ele && ele.nodeName.toLowerCase() == "script" && !ele.src && isJSScript(ele))
  {
    results = ele.innerHTML;
    var re = new RegExp("<!--|<!\\[CDATA\\[", "g");
    var matchResults = re.exec(results);
    if (matchResults)
    {
      // Make sure the match was at the start of the results,
      // and that nothing else precedes it!

      var contentStart = re.lastIndex;
      var before = results.substring(0, contentStart - matchResults[0].length);
      before = before.replace(/\s*/mg, "");
      if (!before)
      {
        // Remove the comment or cdata start and end delimiter. If the end delimiter
        // is preceded by a JS // comment, remove that too.

        var endRegExp = new RegExp("(//)?\\s*" + ((matchResults[0] == "<!--") ? "-->" : "\]>") + "\\s*");
        results = results.substring(contentStart).replace(endRegExp, "");
      }
    }
  }
  return results;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		resetIDCache
//
// PURPOSE
//		Clears the ID attribute cache.
/////////////////////////////////////////////////////////////////////////////
function resetIDCache()
{
  EditObj.idCache = {};
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		removeIDFromCache
//
// PURPOSE
//		Removes the specified id name from the ID attribute cache.
/////////////////////////////////////////////////////////////////////////////
function removeIDFromCache(id)
{
  EditObj.idCache[id] = undefined;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		isUnusedID
//
// PURPOSE
//		Returns true if the specified id is *NOT* used by any element in the
//		specified document and does *NOT* exist in the ID attribute cache.
/////////////////////////////////////////////////////////////////////////////
function isUnusedID(doc, id)
{
  if (EditObj.idCache[id] || doc.getElementById(id))
    return false;
  return true;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getUniqueID
//
// PURPOSE
//		Returns a unique ID string based on the specified baseName string.
//		If alwaysAppendCount is false, this function first checks to see if
//		the specified basename is currently being used as an ID. If not, the
//		function returns the baseName itself. If alwaysAppendCount is true,
//		or baseName is being used, this function creates a unique ID by
//		appending a unique number to the end of baseName.
//    
//    We're using a local version of this function instead of the one in
//    dwscripts because we need to keep a cache of all the ids that *will*
//    be used once the edits are complete, not just the ids that are
//    currently in use in the document.
/////////////////////////////////////////////////////////////////////////////
function getUniqueID(doc, baseName, alwaysAppendCount)
{
  if (!alwaysAppendCount && isUnusedID(doc, baseName))
    return baseName;

  var counter = 0;

  while (++counter)
  {
    var id = baseName + counter;
    if (isUnusedID(doc, id))
    {
      EditObj.idCache[id] = true;
      return id;
    }
  }
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getSpryRegionAncestor
//
// PURPOSE
//		Returns the ancestor element, for the specified node, that has a
//		spry:region or spry:detailregion attribute on it.
/////////////////////////////////////////////////////////////////////////////
function getSpryRegionAncestor(node)
{
  while (node)
  {
    node = node.parentNode;
    if (node && node.nodeType == 1 && (node.getAttribute("spry:region") || node.getAttribute("spry:detailregion")))
      return node;
  }
  return null;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getClosestSpryRepeatElement
//
// PURPOSE
//		Returns the specified node, or its closest ancestor element that
//		has a spry:repeat or spry:repeatchildren attribute on it.
/////////////////////////////////////////////////////////////////////////////
function getClosestSpryRepeatElement(node)
{
  if (node && node.nodeType == 1 && node.getAttribute("spry:repeat"))
    return node;

  while (node)
  {
    node = node.parentNode;
    if (node && node.nodeType == 1 && (node.getAttribute("spry:repeat") || node.getAttribute("spry:repeatchildren")))
      return node;
  }

  return null;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		scriptBlockContainsOnlySpryConstructors
//
// PURPOSE
//		Returns true if the specified script element has inline code that
//		contains only Spry widget and/or data set constructor calls.
/////////////////////////////////////////////////////////////////////////////
function containsOnlySpryConstructors(str)
{
  if (str)
  {
    var spryConstructorRegExp = /((\bvar\s+)?[\w\.\$]+\s*=\s*)?\bnew\s+Spry\.(Widget\.\w+|Data\.\w*DataSet)\s*\([^\)]*\)(\s*;)?/g;
    if (str.search(spryConstructorRegExp) != -1)
      return (str.replace(spryConstructorRegExp, "").replace(/\s+/g, "") == "");
  }
  return false;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		containsDocumentWriteCalls
//
// PURPOSE
//		Returns true if the specified script element has inline code that
//		uses document.write()/writeln() or AC_FL_RunContent().
/////////////////////////////////////////////////////////////////////////////
function containsDocumentWriteCalls(str)
{
  return (str && str.search(/document\.write|AC_FL_RunContent\s*\(/) != -1);
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getAncestorElement
//
// PURPOSE
//		Returns the first ancestor for the specified node, that matches
//		parentTagName.
/////////////////////////////////////////////////////////////////////////////
function getAncestorElement(node, parentTagName)
{
  parentTagName = parentTagName.toLowerCase();

  var parentNode = null;
  while (node)
  {
    node = node.parentNode;
    if (node && node.nodeName.toLowerCase() == parentTagName)
    {
      parentNode = node;
      break;
    }
  }
  return parentNode;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getExtractorEdits
//
// PURPOSE
//		Returns an array of edit objects that describes the edits necessary
//		to extract all JavaScript from the specified document.
/////////////////////////////////////////////////////////////////////////////
function getExtractorEdits(doc)
{
  var results = [];

  var head = doc.getElementsByTagName("head")[0];
  var body = doc.getElementsByTagName("body")[0];

  if (!head || !body)
    return results;

  // Generate edits for inline <script> blocks in the head.

  var sblocks = getInlineScriptBlocks(head);
  for (var i = 0; i < sblocks.length; i++)
  {
    // Add the script block to the edit list. The default setting for the doEdit
	// property will be true, unless the block contains document.write() calls.

    var scriptContent = getInlineScriptContent(sblocks[i]);	
    var hasDocWrite = containsDocumentWriteCalls(scriptContent);
    var edit = new EditObj(sblocks[i], EditObj.TYPE_HEAD_SCRIPT, !hasDocWrite);
	if (!hasDocWrite)
      edit.isSpryConstructorBlock = containsOnlySpryConstructors(scriptContent);
    results.push(edit);
  }

  // Traverse the body of the document, and look for any spry or on* attributes
  // that need to be externalized.

  var elements = getElementsPreOrder(body);

  for (var i = 0; i < elements.length; i++)
  {
    var ele = elements[i];

    var tagName = ele.nodeName.toLowerCase();

    if (tagName == "script" && isJSScript(ele))
    {
      // Generate edits for inline <script> blocks in the body.
      if (!ele.src)
      {
        // Add the script block to the edit list. The default setting for the doEdit
        // property will be false, unless the block contains only Spry widget or
        // data set constructor calls.

        var isSpryConstructorBlock = containsOnlySpryConstructors(getInlineScriptContent(ele));
        var edit = new EditObj(ele, EditObj.TYPE_BODY_SCRIPT, isSpryConstructorBlock);
        edit.isSpryConstructorBlock = isSpryConstructorBlock;

        // If the script block is inside of a spry:region or spry:detailregion, then
        // keep a reference to the element that is the region container. When we generate
        // the JS code, we'll need to place the contents of this script block into
        // an observer that observes this region container.

        edit.spryRegionAncestor = getSpryRegionAncestor(ele);
        results.push(edit);
      }
    }
    else
    {
      var customID = "";

      var attrList = ele.attributes;
      for (var j = 0; j < attrList.length; j++)
      {
        var attr = attrList[j];
        if (attr.name.search(/^(spry:|on)/) != -1)
        {
          // We found an attribute we want to externalize. Create an
          // edit object for it, and save the name of the attribute to
          // externalize. If the element has no id attribute, generate
          // a unique id for the element and save it as a proposed customID
          // on the edit object. The user will be given a chance to either
          // accept the proposed customID, or use one of their own.

          var edit = new EditObj(ele, EditObj.TYPE_ATTRIBUTE, true);
          edit.attrName = attr.name;

          var isInsideSpryRegion = (getSpryRegionAncestor(ele) != null);
          edit.useAddEventListener = (edit.attrName.search(/^on/) != -1 && !isInsideSpryRegion);

          if (!ele.id)
          {
            if (ele.nodeName.toLowerCase() == "body")
              edit.customSelector = "body";
            else
            {
              if (!customID)
                customID = getUniqueID(doc, ele.nodeName.toLowerCase(), true);
              edit.customID = customID;

              // If we have a spry attribute, or an on* attribute that is inside
              // a spry:region or spry:detailregion, we want to make sure we generate
              // a setAttribute() call for this edit entry. Doing it this way will allow
              // us to avoid having to generate code for region observers that attach
              // the event handlers anytime the region regenerates.

              if (isInsideSpryRegion)
              {
                // If this element is in a spry:region, we need to check if it is in a looping
                // context. If so, we need to do some extra work to make sure that any custom ID
                // we add to the element, does not get used more than once when the region re-generates
                // itself within the browser.
                //
                // The idea here is that we will generate code that uses the customID to attach
                // the attributes and JS event behaviors to the element, and when all of that is done,
                // we will change the ID of the element so that it is templatized, causing each element
                // written out within the loop to have a unique ID derived from the origial customID.

                var templateExt = ele.getTranslatedAttribute("spryCustomIDTemplateExt");
                if (!templateExt)
                {
                  var repeatElement = getClosestSpryRepeatElement(ele);
                  if (repeatElement)
                  {
                    // If the repeatElement hasn't been given a unique id template,
                    // give it one. We store this unique id template on the element
                    // itself so we can re-use it if we run across another child element
                    // within the same repeat that uses a customID.

                    templateExt = repeatElement.getTranslatedAttribute("spryRepeatTemplateExt");
                    if (!templateExt)
                    {
                      // Get the name of the data set so we can use it in a data reference
                      // in the template string we are generating.

                      var dsName = repeatElement.getAttribute("spry:repeatchildren");
                      if (!dsName || repeatElement == ele)
                        dsName = repeatElement.getAttribute("spry:repeat");
                      dsName = dsName.replace(/^\s*|\s*$/g, "");


                      // Build up an ID template extension string to append to the custom ID
                      // we generate. This extension will consist of the repeat ID and the
                      // ds_RowID of the data set being repeated, to make sure that all
                      // elements generated have a unique ID.

                      templateExt = "_" + (EditObj.nextRepeatElementID++) + "_{" + dsName + "::ds_RowID}";

                      // Now store the id template extension we created on the repeat element so we
                      // don't have to do this again.

                      repeatElement.setTranslatedAttribute("spryRepeatTemplateExt", templateExt);
                    }

                    // Now set the id template on the element so it can be accessed when we
                    // generate our externalized JS code.

                    ele.setTranslatedAttribute("spryCustomIDTemplateExt", templateExt);
                  }
                }
              }
            }
          }

          // If this element is inside a library item, then we need to
          // make sure we mark this edit as "forbidden".

          var ancestor = getAncestorElement(ele, "{#libitem}");
          if (ancestor)
          {
            edit.doEdit = false;
            edit.forbidden = EditObj.FORBIDDEN_LIBRARY_ITEM_LOCKED;
          }

          results.push(edit);
        }
      }
    }
  }

  // If the document is a template or an instance of a template, then run
  // through the list of edits and mark any edits which are forbidden. We
  // want to leave these forbidden edits in the list because we want them
  // to show in the UI.

  var isTemplateDoc = doc.getIsTemplateDocument();
  var isTemplateInstanceDoc = isTemplateDoc ? false : (doc.getAttachedTemplate().length > 0);

  if (isTemplateDoc || isTemplateInstanceDoc)
  {
    var editableTagName = isTemplateDoc ? "mmtemplate:editable" : "mmtinstance:editable";

    for (var i = 0; i < results.length; i++)
    {
      var edit = results[i];
      var ancestor = getAncestorElement(edit.element, editableTagName);
      if ((isTemplateInstanceDoc && !ancestor) || (isTemplateDoc && ancestor))
      {
        edit.doEdit = false;
        edit.forbidden = isTemplateDoc ? EditObj.FORBIDDEN_EDITABLE_REGION : EditObj.FORBIDDEN_TEMPLATE_REGION_LOCKED;
      }
    }
  }

  return results;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getElementsPreOrder
//
// PURPOSE
//		Traverses the sub-tree underneath the specified-node to create an
//		array of elements that are pre-ordered. This function is only
//		necessary because the current implementation of getElementsByTagName()
//		doesn't understand "*" as an argument.
/////////////////////////////////////////////////////////////////////////////
function getElementsPreOrder(node, arr)
{
  if (!arr)
    arr = [];
  if (node && node.nodeType == 1)
  {
    arr.push(node);
    var c = node.firstChild;
    while (c)
    {
      getElementsPreOrder(c, arr);
      c = c.nextSibling;
    }
  }

  return arr;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getExternalizedContentFromEditList
//
// PURPOSE
//		Uses the specified array of edit objects to generate a string that
//		contains all of the JavaScript extracted from the document. No edits
//		are made to the document during this function call.
/////////////////////////////////////////////////////////////////////////////
function getExternalizedContentFromEditList(doc, edits)
{
  var outArr = [];
  var globalScript = [];
  var onloadScript = [];

  // Split the edits into two buckets.
  for (var i = 0; i < edits.length; i++)
  {
    var e = edits[i];
//    alert("e.doEdit = " + e.doEdit + "\ne.type = " + e.type + "\ne.element.outerHTML = " + e.element.outerHTML);
    if (e.doEdit)
    {
      if (e.type == EditObj.TYPE_HEAD_SCRIPT)
        globalScript.push(e);
      else if (getToggleState() == "unobtrusive" || e.type == EditObj.TYPE_BODY_SCRIPT)
        onloadScript.push(e);
    }
  }

  // Generate the code for all of the head script blocks.

  for (var i = 0; i < globalScript.length; i++)
    outArr.push(getInlineScriptContent(globalScript[i].element) + "\n\n");

  // Generate the code for the onload handler.

  if (onloadScript.length > 0)
  {
    var hasSpryRegion = false;

    //////////////////////////////////////////////////////////////////////////////////////////
    // IE 8 doesn't like function params unless the vars have been declared first, 
    // so do that now.
    //
    for (var i = 0; i < onloadScript.length; i++)
    {
      var e = onloadScript[i];
      
      if (e.type == EditObj.TYPE_BODY_SCRIPT)
      {
        var scriptContent = getInlineScriptContent(e.element);

        if (e.isSpryConstructorBlock) 
        {        
          scriptContent = scriptContent.replace(/^\s*var\s+(\S+).*$/mg, "var $1;"); // we just want "var Name;" for each widget
          
          //if (!e.spryRegionAncestor)         
            outArr.push(scriptContent + "\n");
        }                
      }
    }
    //
    // End of fix for IE 8
    //////////////////////////
    

    outArr.push("\nSpry.Utils.addLoadListener(function() {\n");

    for (var i = 0; i < onloadScript.length; i++)
    {
      var e = onloadScript[i];
      switch (e.type)
      {
        case EditObj.TYPE_ATTRIBUTE:
          var id = e.customID ? e.customID : e.element.id;
          var attrName = e.attrName;
          var attrValue = e.element.getAttribute(attrName);

          var selector = e.customSelector ? e.customSelector : ("#" + (e.customID ? e.customID : e.element.id));

          if (!e.useAddEventListener)
          {
            hasSpryRegion = (hasSpryRegion || attrName == "spry:region" || attrName == "spry:detailregion");
            outArr.push("\tSpry.$$(\"" + selector + "\").setAttribute('" + attrName + "', '" + (attrValue.replace(/'/g, "\\'")) + "');\n");
          }
          else
          {
            var isOnLoadAttr = (attrName.toLowerCase() == "onload");

            if (isOnLoadAttr)
            {
              outArr.push("\tvar onloadCallback = function(e){ " + attrValue + " }; // " + selector + "\n");
              outArr.push("\tSpry.$$(\"" + selector + "\").addEventListener('" + (attrName.toLowerCase().replace(/^on/, "")) + "', onloadCallback, false).forEach(function(n){ onloadCallback.call(n); });\n");
            }
            else
              outArr.push("\tSpry.$$(\"" + selector + "\").addEventListener('" + (attrName.toLowerCase().replace(/^on/, "")) + "', function(e){ " + attrValue + " }, false);\n");
          }

          // If this element has a custom ID extensions defined for it, we need to peek ahead
          // in the list to see if we should write it out. We only want to write it out after
          // we have generated the code for all edits to this element.

          var templateExt = e.element.getTranslatedAttribute("spryCustomIDTemplateExt");
          if (templateExt)
          {
            var nextIndex = i + 1;
            if (nextIndex >= onloadScript.length || onloadScript[nextIndex].element != e.element)
              outArr.push("\tSpry.$$(\"#" + id + "\").forEach(function(n){ n.id = n.id + \"" + templateExt + "\"; }); // Ensures each instance of this repeating element has a unique id.\n");
          }

          break;
        case EditObj.TYPE_BODY_SCRIPT:
          // XXX: TODO
          // To handle <script> tags in the body properly, we need to make sure
          // that we scan the code for globals so we can forward declare them and remove
          // the "var" keyword from the code we write into the onload handler so that
          // things get scoped properly. We'll also need to strip any functions and place
          // them outside of the onload handler.

          // Extract the content from the script element. If the script block
          // contains only Spry constructor calls, strip off any leading "var"
          // keywords to make sure that the variables being assigned remain
          // global.

          var scriptContent = getInlineScriptContent(e.element);

          if (e.isSpryConstructorBlock)
            scriptContent = scriptContent.replace(/^(\s*)var\s+/mg, "$1");

          if (!e.spryRegionAncestor)
          {
            // The <script> element is not inside of a spry region, so simply include its
            // code inside our onload handler.

            outArr.push(scriptContent + "\n\n");
          }
          else
          {
            // This script tag is the descendant of a spry region, so we need to
            // place its code inside a region observer. Before we can do this,
            // we need to get the id of the region element.

            var rgnID = e.spryRegionAncestor.id;
            if (!rgnID)
            {
              // The region element did not have an id defined on it, which means
              // we are going to place a customID on it when we perform the edit.
              // Walk the edit list and get the customID from the edit item for the
              // region element's spry:region/spry:detailregion attribute.

              for (var k = 0; k < onloadScript.length; k++)
              {
                if (onloadScript[k].element = e.spryRegionAncestor)
                  rgnID = e.customID;
              }
            }

            if (rgnID)
              outArr.push("\tSpry.Data.Region.addObserver(\"" + rgnID + "\", { onPostUpdate: function(OPUNotifier, OPUData)\n\t{\n" + scriptContent + "\n\t}});\n");
            else // We shouldn't ever hit this ... but just in case ...
              outArr.push(scriptContent + "\n\n");
          }

          break;
      }
    }

    if (hasSpryRegion)
      outArr.push("\n\tSpry.Data.initRegions();\n");

    outArr.push("});\n");
  }

  return outArr.join("");
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		removeExternalizedContentFromDocument
//
// PURPOSE
//		Removes all content specified in the edit list from the document.
//		This function also applies any customIDs to elements that are
//		specified within the edit objects in the edit list.
/////////////////////////////////////////////////////////////////////////////
function removeExternalizedContentFromDocument(doc, edits)
{
  var summary = {
    headScripts: 0,
    bodyScripts: 0,
    totalScripts: 0,
    spryAttributes: 0,
    eventAttributes: 0,
    totalAttributes: 0,
    customIDs: 0
  };

  var outArr = [];
  var scriptEdits = [];
  var attrEdits = [];

  // Split the edits into two buckets.
  for (var i = 0; i < edits.length; i++)
  {
    var e = edits[i];
//    alert("e.doEdit = " + e.doEdit + "\ne.type = " + e.type + "\ne.element.outerHTML = " + e.element.outerHTML);
    if (e.doEdit)
    {
      if (e.type == EditObj.TYPE_ATTRIBUTE)
      {
        if (getToggleState() == "unobtrusive")
          attrEdits.push(e);
      }
      else
        scriptEdits.push(e);
    }
  }

  // Add custom id attributes and remove script related attributes.

  for (var i = attrEdits.length - 1; i >= 0; i--)
  {
    var e = attrEdits[i];
    if (!e.element.id && e.customID)
    {
      ++summary.customIDs;
      e.element.setAttribute("id", e.customID);
    }

    if (e.attrName.search(/^spry/) != -1)
      ++summary.spryAttributes;
    else
      ++summary.eventAttributes;

    e.element.removeAttribute(e.attrName);
  }

  // Remove <script> elements.

  for (var i = scriptEdits.length - 1; i >= 0; i--)
  {
    if (scriptEdits[i].type == EditObj.TYPE_HEAD_SCRIPT)
      ++summary.headScripts;
    else
      ++summary.bodyScripts;

    scriptEdits[i].element.outerHTML = "";
  }

  summary.totalAttributes = summary.spryAttributes + summary.eventAttributes;
  summary.totalScripts = summary.headScripts + summary.bodyScripts;

  return summary;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		applyEditList
//
// PURPOSE
//		Extracts all script, specified by the current list of edits, from
//		the document, writes it out to an external file, and adds any new
//		script dependency links to the document.
/////////////////////////////////////////////////////////////////////////////
function applyEditList()
{
  var doc = dw.getDocumentDOM();
  var content = getExternalizedContentFromEditList(doc, CURRENT_EDITS);

  var summary = removeExternalizedContentFromDocument(doc, CURRENT_EDITS);

  var jsDom = dw.getNewDocumentDOM("JavaScript");
  jsDom.setCharSet("utf-8");
  jsDom.documentElement.outerHTML = content;

  // We want to write the code we generate into a JS file that is in the
  // same directory as the document we are performing the extraction on.
  // The name of the new JS file should contain the base name of the document
  // with any tweaks necessary to make sure the file name is unique.
  //
  // If the document we are operating on is a template (.dwt) file, then
  // simply write the file out to the site root directory because only
  // .dwt files are allowed in the site's templates directory.

  var jsFilename = doc.URL;
  if (doc.getIsTemplateDocument())
    jsFilename = dw.getSiteRoot() + dwscripts.getFileName(jsFilename);
  jsFilename = getSafeFilename(jsFilename);

  dw.saveDocument(jsDom, jsFilename);

  // Add reference to SpryDOMUtils.js and newly-created .js file to head
  var includeSpryDOMUtils = (summary.totalAttributes > 0 || summary.bodyScripts > 0);
  var assetArray = buildAssetArray(jsFilename, includeSpryDOMUtils);
  var refsAdded = doc.copyAssets(assetArray);

  var summaryStr = formatSummary(summary, refsAdded);
  if (summaryStr != "")
    dwscripts.informOK(summaryStr);
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getSafeFilename
//
// PURPOSE
//		Generates a unique JS file URL based on the given document name
//		within the specified URL.
/////////////////////////////////////////////////////////////////////////////
function getSafeFilename(url)
{
  var filename = dwscripts.getFileName(url);
  var saveLoc = url.substring(0,url.indexOf(filename));
  filename = filename.substring(0,filename.indexOf('.'));
  var jsFilename = saveLoc + filename + ".js";
  var counter = 2;
  while (DWfile.exists(jsFilename))
  {
    jsFilename = saveLoc + filename + counter + ".js";
    counter++;
  }
  return jsFilename;  
}


/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		copyAssets
//
// PURPOSE
//		Adds dependency script links to the document.
/////////////////////////////////////////////////////////////////////////////
function buildAssetArray(jsFilePath, includeSpryDOMUtils)
{
  var assetArray = new Array();
  var tempObj = new Object();

  if (includeSpryDOMUtils)
  {
    tempObj.srcURL = dw.getConfigurationPath() + "/Shared/Spry/Includes/SpryDOMUtils.js";
    tempObj.destURL = "SpryDOMUtils.js";
    tempObj.refType = "javascript";
    tempObj.useDefaultFolder = true;
    assetArray.push(tempObj);
  }
  
  // sort out the path of the jsFile we create.
  var destURL = dwscripts.getSiteRelativePath(jsFilePath);
  if (destURL == dwscripts.localURLToFilePath(jsFilePath))
  {
    destURL = dwscripts.getFileName(jsFilePath);
  }
  
  tempObj = new Object();
  tempObj.srcURL = jsFilePath;
  tempObj.destURL = destURL;
  tempObj.refType = "javascript";
  tempObj.useDefaultFolder = false;
  assetArray.push(tempObj);
  
  return assetArray;
}

function formatSummary(summary, refsAdded)
{
  var summaryStr = "<p style='padding-bottom:0;margin-bottom:3px;'>";

  for (var edit in summary)
  {
    if (summary[edit] > 1)
    {
      switch(edit.toString())
      {
        case "headScripts":
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/headScriptsPlural"), summary[edit]) + "\n";
          break;
        case "bodyScripts":
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/bodyScriptsPlural"), summary[edit]) + "\n";
          break;
        case "totalScripts": 
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/totalScriptsPlural"), summary[edit]) + "\n\n";
          break;
        case "spryAttributes":
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/spryAttributesPlural"), summary[edit]) + "\n";
          break;
        case "eventAttributes":
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/eventAttributesPlural"), summary[edit]) + "\n";
          break;
        case "totalAttributes":
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/totalAttributesPlural"), summary[edit]) + "\n\n";
          break;
        case "customIDs":
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/customIDsPlural"), summary[edit]) + "\n";
          break;
      }
    }
    else if (summary[edit] == 1)
    {
      switch(edit.toString())
      {
        case "headScripts":
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/headScriptsSingular"), summary[edit]) + "\n";
          break;
        case "bodyScripts":
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/bodyScriptsSingular"), summary[edit]) + "\n";
          break;
        case "totalScripts":      
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/totalScriptsSingular"), summary[edit]) + "\n\n";
          break;
        case "spryAttributes":
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/spryAttributesSingular"), summary[edit]) + "\n";
          break;
        case "eventAttributes":
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/eventAttributesSingular"), summary[edit]) + "\n";
          break;
        case "totalAttributes":      
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/totalAttributesSingular"), summary[edit]) + "\n\n";
          break;
        case "customIDs":      
          summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/customIDsSingular"), summary[edit]) + "\n";
          break;
      }
    }
  }
  if (refsAdded)
  {
    var numRefs = refsAdded.length;
    if (numRefs == 1)
      summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/refsAddedSingular"), numRefs);
    else if (numRefs > 1)
      summaryStr += dwscripts.sprintf(dw.loadString("Commands/ExternalizeJS/refsAddedPlural"), numRefs);

    summaryStr += "</p>\n<ul style='margin:0;padding:0;'>"; 
    for (var i=0; i < numRefs; i++)
    {
      summaryStr += "<li style='padding-top:0;margin-top:0;'>" + dwscripts.getFileName(refsAdded[i]) + "</li>";
    }
    summaryStr += "</ul>";
  }
  else
    summaryStr += "</p>";

  return summaryStr;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		getAllowedEditsCount
//
// PURPOSE
//		Returns the number of edits in the list that can be performed. This
//		number excludes all edits that are marked as forbidden or have doEdit
//		properties with a value of false.
/////////////////////////////////////////////////////////////////////////////

function getAllowedEditsCount(edits)
{
  var results = 0;

  for (var i = 0; i < edits.length; i++)
  {
    if (edits[i].doEdit && !edits[i].forbidden)
      ++results;
  }

  return results;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		editListHasDuplicateIDs
//
// PURPOSE
//		This function checks the edit list for edits that have customIDs
//    that are used by other elements. If one or more duplicates are found,
//    it displays an alert message and returns true.
/////////////////////////////////////////////////////////////////////////////

function editListHasDuplicateIDs()
{
  var dups = [];
  var customIDs = {};
  var dupIDs = {};
  var doc = dw.getDocumentDOM();

  // Run through the list of edits and make sure that
  // each attribute edit that uses a customID, has a
  // unique id value.

  for (var i = 0; i < CURRENT_EDITS.length; i++)
  {
    var edit = CURRENT_EDITS[i];
    if (edit.type == EditObj.TYPE_ATTRIBUTE && edit.customID)
    {
      var id = edit.customID;

      // If the current id is already in our list of duplicate
      // ids, then skip all this work.

      if (!dupIDs[id])
      {
        // Check if we've encountered an element with our
        // custom id already.

        var ecid = customIDs[id];

        if (!ecid)
        {
          // We haven't seen an element with this customID yet,
          // so just check to see if an element in the document is
          // already using the customID.

          var ele = doc.getElementById(id);
          if (ele && ele != edit.element)
          {
            // There is an element already in the document that is
            // using the customID.

            dupIDs[id] = true;
          }
 
          // Notate that we've seen this customID already,
          // and the element that is going to use it.
 
          customIDs[id] = edit.element;
        }
        else if (ecid != edit.element)
        {
          // We've already seen this customID being used
          // for another element. We have a duplicate use.

          dupIDs[id] = true;
        }
      }
    }
  }

  for (id in dupIDs)
    dups.push(id);

  if (dups.length > 0)
  {
    var msgStr = dw.loadString("Commands/ExternalizeJS/duplicateIDAttributes");
    var dupList = "";
    for (var i = 0; i < dups.length; i++)
      dupList += (i > 0 ? "\n" : "") + "    - " + dups[i];
    msgStr = dwscripts.sprintf(msgStr, dupList);
    alert(msgStr);
  }

  return dups.length > 0;
}

/////////////////////////////////////////////////////////////////////////////
// FUNCTION
//		onOK
//
// PURPOSE
//		Called when the user clicks the OK button. Forces a blur event to be
//    sent to all text fields in the browsercontrol, calls
//    applyEditList() to apply all the edits, and closes the command
//    dialog.
/////////////////////////////////////////////////////////////////////////////
function onOK()
{
  var dom = dw.getDocumentDOM();
  var filepath = dom.URL;
  if (getAllowedEditsCount(CURRENT_EDITS) > 0)
  {
    // Save the state of the radio toggle for next time.
    var theFile = MMNotes.open(CMD_FILE, true);
    if (theFile){
      MMNotes.set(theFile,"toggleState",getToggleState());
      MMNotes.close(theFile);
    }

    if (filepath != "")
    {
      forceBlur();
      if (editListHasDuplicateIDs())
        return;
      applyEditList();
    }
    else
    {
      if (confirm(dw.loadString("Commands/ExternalizeJS/saveFirst")) && dw.canSaveDocument(dom))
      {
        dw.saveDocument(dom);
        filepath = dom.URL;
        if (filepath != "")
        {
          forceBlur();
          if (editListHasDuplicateIDs())
            return;
          applyEditList();
        }
      }
    }
  }
  // Skip all the processing if there are no edits to perform
  // and just close the window.
  window.close();
  dw.externalizeJS();
}
