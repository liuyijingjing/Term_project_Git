// Copyright 2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.
//---------------   GLOBAL VARIABLES   ---------------
var helpDoc = MM.HELP_objSpryRepeatList;
var _LIST_AJAX_DATASETS = null;
var _LIST_OF_DIS_COLS = null;
var _LIST_OF_VAL_COLS = null;
var _LIST_OF_CONTAINER_TAGS = new Array(MM.SPRY_REPEAT_DESC_UL_TAG,MM.SPRY_REPEAT_DESC_OL_TAG,MM.SPRY_REPEAT_DESC_DL_TAG,MM.SPRY_REPEAT_DESC_SELECT_TAG);
var _LIST_OF_CONTAINER_VALUE_TAGS = new Array("ul","ol","dl","select");
var _CONTAINER_DESC = null;
//---------------     API FUNCTIONS    ---------------



function isDOMRequired()
{
	return true;
}

function commandButtons()
{
   return new Array( MM.BTN_OK,     "doInsertSpryRepeatList()",
                     MM.BTN_Cancel, "window.close()",
                     MM.BTN_Help,   "displayHelp()");
}

//---------------    LOCAL FUNCTIONS   ---------------
function initializeUI()
{  
  _RG_SPRY_LIST_CONTAINER	 = new ListControl("spryListContainer");
  _LIST_AJAX_DATASETS = new SpryDataSetList("spryDS");
  _LIST_OF_DIS_COLS			= new ListControl("spryDSColDis");
  _LIST_OF_VAL_COLS			= new ListControl("spryDSColVal");
  _RG_SPRY_LIST_CONTAINER.setAll(_LIST_OF_CONTAINER_TAGS, _LIST_OF_CONTAINER_VALUE_TAGS);
  _RG_SPRY_LIST_CONTAINER.setIndex(0);
  buildColList();
}

function showOrHideValueCol()
{
	var containerTag = _RG_SPRY_LIST_CONTAINER.getValue();
	//set the container description
	var containerTagIndex = _RG_SPRY_LIST_CONTAINER.getIndex();

	var valListLabel = dwscripts.findDOMObject("valColLabel"); 
	var valListControl = dwscripts.findDOMObject("valColControl"); 

	if (containerTag == "dl")
	{
		//set the label for dt, dd
		var displayListLabel = dwscripts.findDOMObject("displayColLabel"); 
		displayListLabel.innerHTML = MM.LABEL_DTColumn;
		valListLabel.innerHTML = MM.LABEL_DDColumn;
	}
	else
	{
		//set the label for select , ul , ol
		var displayListLabel = dwscripts.findDOMObject("displayColLabel"); 
		displayListLabel.innerHTML = MM.LABEL_DisplayColumn;
		valListLabel.innerHTML = MM.LABEL_ValueColumn;
	}

	if ((containerTag == "select") || (containerTag == "dl"))
	{
		//show the value column
		dwscripts.displayNode(valListLabel,true);
		dwscripts.displayNode(valListControl,true);
		buildColList();
	}
	else
	{
		//hide the value column
		dwscripts.displayNode(valListLabel,false);
		dwscripts.displayNode(valListControl,false);
	}
} 


function buildColList()
{	
	//get the client side spry dataset name	
	var dsColList = new Array();
	var dsColTypeList = new Array();				
	var spryDSName		 = _LIST_AJAX_DATASETS.getSelectedValue();
	var containerTag	 = _RG_SPRY_LIST_CONTAINER.getValue();
	if (spryDSName.length != 0)
	{
		var dom = dw.getDocumentDOM();
    var dsManager = Spry.DesignTime.DataSets.Manager.getManagerForDocument(dom);
  	if (dsManager)
  	{
      var anAjaxDataSet = dsManager.getDataSet(spryDSName);
  		if (anAjaxDataSet != null)
  		{
  			var schemaArray = anAjaxDataSet.getColumnNames();
  			for (var i=0; i < schemaArray.length; i++)
  			{
  				//add it to the binding arrays,add it to the list
  				dsColList.push(schemaArray[i]);
  				dsColTypeList.push(anAjaxDataSet.getColumnType(schemaArray[i]));
  			}
  		   _LIST_OF_DIS_COLS.setAll(dsColList, dsColTypeList);
  		   if ((containerTag == "select") || (containerTag == "dl"))
  		   {
  			   _LIST_OF_VAL_COLS.setAll(dsColList, dsColTypeList);
  		   }
  
  		   //set the indexes to zero
  		   _LIST_OF_DIS_COLS.setIndex(0);
  		   _LIST_OF_VAL_COLS.setIndex(0);
  		}
  	}
  }
}

function doInsertSpryRepeatList()
{
	var spryContainerTag = _RG_SPRY_LIST_CONTAINER.getValue();
	var spryDSName		 = _LIST_AJAX_DATASETS.getSelectedValue();
	//get the client side spry dataset name					
	if (spryDSName.length != 0)
	{
		var bIsInsideBody = ajaxUtils.isInsideBody(dom);
		if (bIsInsideBody)
		{
			//prompt for spry region if missing
			var bAddSpryRegion = ajaxUtils.promptForSpryRegion();
			var spryDSDisplayCol = "";
			var spryDSValCol     = "";	
			var newTagList = "";
			var spryRepeatType = "spry:repeatchildren";
			var startTag = "<" + spryContainerTag + " " + spryRepeatType +"=\""  + spryDSName  + "\"" + ">";
			var endTag   = "</" + spryContainerTag + ">";
			spryDSDisplayCol = _LIST_OF_DIS_COLS.get();
			//append the markers
			spryDSDisplayCol = ajaxUtils.formatSpryDataRef(spryDSName,spryDSDisplayCol);

			if (spryContainerTag == "select")
			{
				//get the value column
				spryDSValCol = _LIST_OF_VAL_COLS.get();
				//append the markers
				spryDSValCol = ajaxUtils.formatSpryDataRef(spryDSName,spryDSValCol);
				newTagList += startTag;
				newTagList = newTagList + "<option value=\"" +  spryDSValCol + "\"" +">";
				newTagList += spryDSDisplayCol;
				newTagList += "</option>";
				newTagList += endTag;
			}		
			else if ((spryContainerTag == "ul") || (spryContainerTag == "ol"))
			{
				newTagList += startTag;
				newTagList += "<li>";
				var colDisplayType = _LIST_OF_DIS_COLS.getValue();
				if (colDisplayType == "image")
				{
					newTagList += ajaxUtils.getSpryImageReference(spryDSDisplayCol);
				}
				else
				{
					newTagList += spryDSDisplayCol;
				}
				newTagList += "</li>";
				newTagList += endTag;
			}
			else if (spryContainerTag == "dl")
			{
				//get the value column
				spryDSValCol = _LIST_OF_VAL_COLS.get();
				//append the markers
				spryDSValCol = ajaxUtils.formatSpryDataRef(spryDSName,spryDSValCol); //dd column
				newTagList += startTag;

				//get the display
				newTagList += "<dt>";
				var colDisplayType = _LIST_OF_DIS_COLS.getValue();
				if (colDisplayType == "image")
				{
					newTagList += ajaxUtils.getSpryImageReference(spryDSDisplayCol);
				}
				else
				{
					newTagList += spryDSDisplayCol;
				}
				newTagList += "</dt>";

				//get the value
				newTagList += "<dd>";
				var colValType = _LIST_OF_VAL_COLS.getValue();
				if (colValType == "image")
				{
					newTagList += ajaxUtils.getSpryImageReference(spryDSValCol);
				}
				else
				{
					newTagList += spryDSValCol;
				}
				newTagList += "</dd>";
				newTagList += endTag;
			}
			var dom = dw.getDocumentDOM();

			//add a spry region
			if (bAddSpryRegion)
			{
				newTagList = ajaxUtils.wrapWithSpryRegion(newTagList,spryDSName);
				//add the spry namespace if missing
			}
			dom.insertHTML(newTagList);
			//if added spry region ensure namespace is declared
			if (bAddSpryRegion)
			{
				ajaxUtils.initSpryNS();
			}
			window.close();
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
