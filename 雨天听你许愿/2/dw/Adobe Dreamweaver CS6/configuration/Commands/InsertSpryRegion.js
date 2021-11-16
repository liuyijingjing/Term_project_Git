// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.
//---------------   GLOBAL VARIABLES   ---------------
var helpDoc = MM.HELP_objSpryRegion;
var _RG_SPRY_CONTAINER = null;
var _RG_SPRY_TYPE = null;
var _LIST_AJAX_DATASETS = null;
var _RG_SPRY_SEL = null;
//---------------     API FUNCTIONS    ---------------

function isDOMRequired()
{
	return true;
}

function commandButtons()
{
   return new Array( MM.BTN_OK,     "doInsertSpryRegion()",
                     MM.BTN_Cancel, "window.close()",
                     MM.BTN_Help,   "displayHelp()");
}

//---------------    LOCAL FUNCTIONS   ---------------
function initializeUI()
{  
  _RG_SPRY_CONTAINER = new RadioGroup("spryRegionConatiner");
  _RG_SPRY_TYPE		 = new RadioGroup("spryRegionType");
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

  //if no dataset are found

  //initialize the list of ajax datasets
  var spryDSName		 = _LIST_AJAX_DATASETS.getSelectedValue();
  if (spryDSName.length == 0)
  {
	//show the span for creating new Spry XML DataSet
	var createSpryXMLInstrObj = dwscripts.findDOMObject("createSpryXMLDataSet"); 
	if (createSpryXMLInstrObj)
	{
		dwscripts.displayNode(createSpryXMLInstrObj,true);
	}
  }

} 

function launchSpryXMLDataSetDialog()
{
	//launch the ajax data set
	var cmdArgs = new Array();
	var resArray = dwscripts.callCommand("SpryXMLDataSet_Basic",cmdArgs);
}

function doInsertSpryRegion()
{
	var spryContainerTag = _RG_SPRY_CONTAINER.getSelectedValue();
	var spryType		 = _RG_SPRY_TYPE.getSelectedValue();
	var sprySel			 = _RG_SPRY_SEL.getSelectedValue();
	var spryDSName		 = _LIST_AJAX_DATASETS.getSelectedValue();

	//get the client side spry dataset name					
	if (spryDSName.length != 0)
	{
		var dom = dw.getDocumentDOM();
		var currentView = dom.getView();
		var bIsInsideBody = ajaxUtils.isInsideBody(dom);
		if (bIsInsideBody)
		{
			//check if it already inside a spry region
			var bIsInsideSpryRegion = ajaxUtils.isInsideSpryRegion(dom);

			if (bIsInsideSpryRegion == false)
			{
				var spryRegionType = "spry:region";
				if (spryType == "sprydetailregion")
				{
					spryRegionType = "spry:detailregion";
				}
				var startTag = "<" + spryContainerTag + " " + spryRegionType +"=\""  + spryDSName  + "\"" + ">";
				var endTag   = "</" + spryContainerTag + ">";

				//calculate the offsets
				var startOffset = startTag.length;
				var endOffset   = endTag.length;

				//set the default content 
				var content = "";		
				if (spryType == "sprydetailregion")
				{
					content = dw.loadString("insertbar/spry/spryContentDetail");
				}
				else
				{
					content = dw.loadString("insertbar/spry/spryContent");
				}
				
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
						//if it does not contain existing spry region , continue
						if (ajaxUtils.containsSpryRegion(dom) == false)
						{					
							dom.wrapTag(startTag + endTag, true, true);
						}
						else
						{
							alert(MM.MSG_NestedSpryRegions);
							return;
						}
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
				alert(MM.MSG_NestedSpryRegions);
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