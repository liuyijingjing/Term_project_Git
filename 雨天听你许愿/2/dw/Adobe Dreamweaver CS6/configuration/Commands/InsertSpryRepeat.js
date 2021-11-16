// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.
//---------------   GLOBAL VARIABLES   ---------------
var helpDoc = MM.HELP_objSpryRepeat;
var _RG_SPRY_CONTAINER = null;
var _RG_SPRY_RR_TYPE = null;
var _LIST_AJAX_DATASETS = null;
var _RG_SPRY_SEL = null;
//---------------     API FUNCTIONS    ---------------

function isDOMRequired()
{
	return true;
}

function commandButtons()
{
   return new Array( MM.BTN_OK,     "doInsertSpryRepeat()",
                     MM.BTN_Cancel, "window.close()",
                     MM.BTN_Help,   "displayHelp()");
}

//---------------    LOCAL FUNCTIONS   ---------------
function initializeUI()
{  
  _RG_SPRY_CONTAINER = new RadioGroup("spryRepeatConatiner");
  _RG_SPRY_RR_TYPE		 = new RadioGroup("spryRepeatType");
  _RG_SPRY_SEL		 = new RadioGroup("spryRegionSelection");
  _LIST_AJAX_DATASETS = new SpryDataSetList("spryDS");
  //if the selection is a range , enable "wrap around selection"
  var dom = dw.getDocumentDOM();
  var selection = dom.getSelection();
  if (selection[0] == selection[1]) //if IP
  {
	  //disable the options
	  if (_RG_SPRY_SEL.obj[0] && _RG_SPRY_SEL.obj[1])
	  {
		_RG_SPRY_SEL.obj[0].setAttribute("disabled","disabled");
	    _RG_SPRY_SEL.obj[0].removeAttribute("checked");
		_RG_SPRY_SEL.obj[1].setAttribute("disabled","disabled");
	    _RG_SPRY_SEL.obj[1].removeAttribute("checked");
	  }
  }

  //initialize the list of ajax datasets
} 

function doInsertSpryRepeat()
{
	var spryContainerTag = _RG_SPRY_CONTAINER.getSelectedValue();
	var spryType		 = _RG_SPRY_RR_TYPE.getSelectedValue();
	var sprySel			 = _RG_SPRY_SEL.getSelectedValue();
	var spryDSName		 = _LIST_AJAX_DATASETS.getSelectedValue();
	//get the client side spry dataset name					
	if (spryDSName.length != 0)
	{
		var bIsInsideBody = ajaxUtils.isInsideBody(dom);
		if (bIsInsideBody)
		{
			var dom = dw.getDocumentDOM();
			var currentView = dom.getView();
			var spryRepeatType = "spry:repeat";
			if (spryType == "spryrepeatchildren")
			{
				spryRepeatType = "spry:repeatchildren";
			}
			var startTag = "<" + spryContainerTag + " " + spryRepeatType +"=\""  + spryDSName  + "\"" + ">";
			var endTag   = "</" + spryContainerTag + ">";

			//calculate the offsets
			var startOffset = startTag.length;
			var endOffset   = endTag.length;

			var content = dw.loadString("insertbar/spry/spryContent");
			var newTagWithContent = startTag + content + endTag;
			var selection = dom.getSelection();
			if (selection[0] == selection[1]) //if IP
			{
				dom.insertHTML(newTagWithContent);
			}
			else
			{
				if (sprySel == "wrap")
				{
					dom.wrapTag(startTag + endTag, true, true);
				}
				else if (sprySel == "replace")
				{
					dom.insertHTML(newTagWithContent);
				}
			}

			// At this point, the <div> should be selected.  Move the
			// selection within the <div>.
			var newSelection = dw.getSelection();
			newSelection[0] += startOffset;
			newSelection[1] -= endOffset;

			//add the spry namespace if missing
			var spryNSLength = ajaxUtils.initSpryNS();
			window.close();

			if (spryNSLength > 0)
			{
				//shift if we add namespace for design view selection to
				//be acciurate
				newSelection[0] += spryNSLength;
				newSelection[1] += spryNSLength;						
			}

			if ((newSelection[1] > newSelection[0]) &&
				(!dw.getDocumentDOM().rangeContainsLockedRegion(newSelection[0], newSelection[1])))
			{
				dw.setSelection(newSelection[0], newSelection[1]);
			}
		}
		else
		{
			alert(MM.MSG_SpryRegionsNeedToBeInsideTheBody);
		}
	}
	else
	{
		alert(MM.MSG_DefineASpryDS);
	}
}