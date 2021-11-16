// Copyright 2008 Adobe Systems Incorporated.  All rights reserved.

// ********************* API FUNCTIONS ***************************

function canInsertObject() 
{
  var dom = dw.getDocumentDOM();
  var retVal = true;

  retVal = (dom.getIsLibraryDocument() == false);
  if( retVal )
  {
    retVal = Spry.DesignTime.Editing.Utils.canInsertWidget(dom, "Spry.Widget.Tooltip");
  }

  return retVal;
}

function isDOMRequired() 
{
  return true;
}

function insertObject() 
{
  var dom = dw.getDocumentDOM();
  dwscripts.fixUpSelection(dom, false, false);   
  
  var sel = dom.getSelection();  
  var selNode = dom.offsetsToNode(sel[0],sel[1]);     

  if( !Spry.DesignTime.Editing.Utils.canInsertWidget(dom) )
  {
    return;
  }

  var checkSel = Spry.DesignTime.Widget.Tooltip.checkSelection();
  //check selected node
  if (checkSel)
  {
    switch(checkSel)
    {
      case 'NOT_ALLOWED':
        alert(dw.loadString("spry/widgets/Tooltip/error/selectionNotAllowed"));
        return;
      case 'IN_TOOLTIP':
        alert(dw.loadString("spry/widgets/Tooltip/error/selectionInTooltip"));
        return;
      case 'IN_TRIGGER':
        alert(dw.loadString("spry/widgets/Tooltip/error/selectionInTrigger"));
        return;        
      case 'MULTIPLE_TAGS':
        alert(dw.loadString("spry/widgets/Tooltip/error/selectionMultiple"));
        return;      
    }
  }  

  var cmdFile = dreamweaver.getConfigurationPath() + "/Commands/SpryTooltip.htm";
  var cmdDOM = dreamweaver.getDocumentDOM(cmdFile);
  dreamweaver.popupCommand("SpryTooltip.htm");

  var assetList = cmdDOM.parentWindow.getAssetList();
  var scriptStr = cmdDOM.parentWindow.getScriptStr();

  var triggerStr = cmdDOM.parentWindow.getTriggerStr();
  var tooltipStr = cmdDOM.parentWindow.getTooltipStr();

  if (tooltipStr)
  {
    // tell Dreamweaver to add js references and copy the necessary js file to the site
    if (assetList && assetList.length)
      dom.copyAssets(assetList);

    // add JavaScript constructor of our widget
    if (scriptStr)
    {
      dom.addJavaScript(scriptStr, false);
    }

    if(triggerStr)
    {   
      //insert the trigger
      dom.insertHTML(triggerStr, true);   //overwrite previous selection
    }
    else{
      if(!selNode.getAttribute("id"))
      {
	       selNode.setAttribute("id", cmdDOM.parentWindow.getTriggerID());
      }
    }
    
    //get selection again, as is not valid any more after insertion
    var selNode = dom.getSelectedNode(true, false, true);  
    setIPAtBodyLevel(dom, selNode);
    
    //insert the tooltip at BODY level
    dom.insertHTML(tooltipStr, false);       
  }
}

// ********************* UTILITY  FUNCTIONS ***************************

// According to the XHTML 1.0 spec, these are the block-level elements
// that can contain other blocks. We build a hash so that a lookup can be
// fast. Note that all names in the has must be lower-cased.

var blockLevelContainers = [ "blockquote", "body", "dd", "del", "div", "ins", "li", "th", "td" ];
var blockLevelContainersHash = {};
for (var i = 0; i < blockLevelContainers.length; i++)
  blockLevelContainersHash[blockLevelContainers[i]] = true;

//--------------------------------------------------------------------
// FUNCTION:
//   canContainBlockElements
//
// DESCRIPTION:
//   Returns true if the element is a block-level element that
//   can contain other block-level elements.
//
// ARGUMENTS:
//   ele - DOM element node
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function canContainBlockElements(ele)
{
  return (ele && ele.nodeType == 1 && blockLevelContainersHash[ele.nodeName.toLowerCase()]);
}

//--------------------------------------------------------------------
// FUNCTION:
//   getEnclosingEditableRegion
//
// DESCRIPTION:
//   Returns the closest parent node for the specified element
//   that is an editable region node.
//
// ARGUMENTS:
//   ele - DOM element node
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function getEnclosingEditableRegion(ele)
{
  while (ele)
  {
    if (ele.nodeName.toLowerCase() == "mmtinstance:editable")
        return ele;
    ele = ele.parentNode;
  }
  return null;
}

//--------------------------------------------------------------------
// FUNCTION:
//   setIPAtBodyLevel
//
// DESCRIPTION:
//   set the insertion point (IP) in the first possible place at the body level
//   e.g. if the selected node is a TD in a TABLE at the BODY level,
//  put it after the TABLE
//
// ARGUMENTS:
//   dom - object - the DOM to work with
//   selNode - object  - the selected node in the DOM
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------


function setIPAtBodyLevel(dom, selNode)
{
  var body = dom.body;
  var isTemplateInstance = (dom.getAttachedTemplate().length > 0);
  var ancestorLimitEle = isTemplateInstance ? getEnclosingEditableRegion(selNode) : body;
  var insertAfterEle = null;

  if (isTemplateInstance)
  {
    // If we're in a template instance document, then the ancestor
    // limit is the editable region node. See if its parent can
    // contain other block elements.

    if (!canContainBlockElements(ancestorLimitEle.parentNode))
    {
      // Ugh, we can't insert the tooltip content container within
      // the same editable region. Try to find an editable region *after*
      // the one the tooltip trigger is in, which is at the body level.
      // If we find one, insert our content at the start of that editable
      // region.

      var rgns = dom.getElementsByTagName("mmtinstance:editable");
      var foundParentER = false;
      for (var i = 0; !insertAfterEle && i < rgns.length; i++)
      {
        var rgn = rgns[i];
        foundParentER = foundParentER || (rgn == ancestorLimitEle);
        if (foundParentER && rgn.parentNode == body && rgn.firstChild)
        {
          var nodeOffsets = dwscripts.getNodeOffsets(rgn.firstChild);
          if(nodeOffsets)				
            dom.setSelection(nodeOffsets[0], nodeOffsets[0]);
          return; 	             
        }
      }

      // We didn't find a suitable place for insertion, so set the
      // insertAfterEle to the editable region itself. This will cause
      // DW to attempt an insert outside of an editable region and trigger
      // an error which disallows the insertion of our tooltip trigger and content.

      insertAfterEle = ancestorLimitEle;
    }
  }

  if (!insertAfterEle)
  {
    insertAfterEle = selNode;
    while (insertAfterEle && insertAfterEle.parentNode && insertAfterEle.parentNode != ancestorLimitEle)
      insertAfterEle = insertAfterEle.parentNode;
  }

  if (insertAfterEle)
  {
    // We have an element to insert after, so calculate its offsets
    // and place the insertion point after it.

    var nodeOffsets = dwscripts.getNodeOffsets(insertAfterEle);
    if(nodeOffsets)				
      dom.setSelection(nodeOffsets[1], nodeOffsets[1]);  	   
  }
}