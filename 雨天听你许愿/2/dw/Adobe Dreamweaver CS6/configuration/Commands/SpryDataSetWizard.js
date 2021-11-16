/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2007 Adobe Systems Incorporated
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
**************************************************************************/

//*************************GLOBALS**************************

// CONSTANTS
var LEFT_ARROW_SRC = "../Shared/MM/Images/btn_left.png";
var LEFT_ARROW_DIS_SRC = "../Shared/MM/Images/btn_left_dis.png";
var RIGHT_ARROW_SRC = "../Shared/MM/Images/btn_right.png";
var RIGHT_ARROW_DIS_SRC = "../Shared/MM/Images/btn_right_dis.png";
var REFRESH_BTN_SRC = "../Shared/MM/Images/bwRefresh.png";
var REFRESH_BTN_DIS_SRC = "../Shared/MM/Images/bwRefresh_dis.png";
var ELEMENT_TYPES = {tables: ["table"], divs: ["div"], lists: ["ul", "ol"]};
var XML_HELPDOC = MM.HELP_cmdSpryDataSetXML;
var HTML_HELPDOC = MM.HELP_cmdSpryDataSetHTML;
var SELECTORS_HELPDOC = MM.HELP_cmdSpryDSAdvancedSelection;

// HTML CONTROLS
// first step
var _wizCtrl = new WizardControl(3);
var _dataSetType = new ListControl("dataSetType", null, true);
var _dsName = new TextField('', "dsName");
var _fileSourceURL = new TextField('', "fileSourceURL");
var _detectElements = new ListControl("detectElements", null, true);
var _selectableElements = new ListControl("selectableElements");
var _advDataSelection = new CheckBox('', "advDataSelection"); 
var _rowSelectors = new TextField('', "rowSelectors");
var _colSelectors = new TextField('', "colSelectors");
var _browseButton;
// XML controls
var _xmlSchemaTree = null;
var _xPathExprTextField = new TextField('', "xpathExpr");
var _refreshBtn;
var _chooseContainerCtrl;
var _dataPreviewFirstStep;
var _feedURLNotification;
var CONTAINER_ID;
var PREVIEW_FIRSTSTEP_REGION;
var ADV_DATA_SEL_REGION;
var SHOW_HIDE_IMG;
var JUST_INSERT_STRUCTURE = false;
 
// second step
var _dataSetColumns = new ListControl("dataSetColumns");
var _prevColumnName;
var _nextColumnName;
var _columnType = new ListControl("columnType");
var _sortColumn = new ListControl("sortColumn");
var _sortDirection = new ListControl("sortDirection");
var _firstRowAsHeaders = new CheckBox('', "firstRowAsHeaders");
var _useColumnsAsRows = new CheckBox('', "useColumnsAsRows");
var _distinctLoad = new CheckBox('', "distinctLoad");
var _dataCaching = new CheckBox('', "dataCaching");
var _autorefreshData = new CheckBox('', "autorefreshData");
var _refreshInterval = new TextField('', "refreshInterval");
var _dataPreviewSecondStep;
var _loadingIndicatorContainer;
var _refreshButtonContainer;

// third step
var _insertOptions = new RadioGroup('', "insertOptions");

// VARIABLES
var PREV_FILE_SOURCE = "";      // used to avoid flickering of webkit control and data preview control
var IN_PROGRESS_LOADING_FILE = false; // flag used to avoid loading a file for two times. 
                                      // We use the DWDialogOk event to catch the onpress enter event and we also
                                      // use the on blur event. When the user press enter in the data file field
                                      // the updateUI API will be called 2 times. So we will use this flag to avoid 
var IN_UPDATE_DATASET_COLUMNS = false;									  
var PREV_DETECTED_ELEMENTS = "tables";
var PREV_XPATH = "";
var PREV_INSERT_OPT;             
var INSERT_OPTIONS_OBJ = null;
var INSERT_OPTIONS_CONTAINERS = {insertSpryTableContainer: "", insertStackedContainer: "", insertSpotlightContainer: "", insertMasterDetailContainer: "", insertNoneContainer: ""};
var INSERT_OPT_IMAGES = {"insertSpryTable" : {normal: "insertSpryTable.png", selected: "insertSpryTable_s.png"},
                         "insertStacked" : {normal: "insertSpryStackedContainers.png", selected: "insertSpryStackedContainers_s.png"},
                         "insertSpotlight" : {normal: "insertSprySpotlightColumn.png", selected: "insertSprySpotlightColumn_s.png"},
                         "insertMasterDetail" : {normal: "insertSpryMasterDetail.png", selected: "insertSpryMasterDetail_s.png"}
                        };
var IMAGES_BASE_PATH = "../Shared/MM/Images/"; 
var DESIGN_TIME_DS = null; 
var IN_EDIT_MODE = false;
var IN_EDIT_INITIALIZE = false;
var DATASET_CMD_ARGS;
var CROSS_DOMAIN_WARNING_DISPLAYED = false;
var FILE_BROWSED = false;

//*************************API**************************

//--------------------------------------------------------------------
// FUNCTION:
//   receiveArguments
//
// DESCRIPTION:
//   Receive the introspected dataset design time object. 
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function receiveArguments()
{
  if (arguments[0] && arguments[0].designTimeObject)
  {
    // the command argument is the data set object introspected from page
    // by the DataSetManager
    DATASET_CMD_ARGS = arguments[0].designTimeObject;
    JUST_INSERT_STRUCTURE = arguments[0].insertStructure;
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   clickedOK
//
// DESCRIPTION:
//   This function generates or updates the necessary JS code for the 
//  HTML and XML Data Sets and for the HTML structures chosen in the third step.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function clickedOK() 
{
  var jsName = _dsName.getValue();
  var oldJSName = DESIGN_TIME_DS.getDataSetName(); 
  var insertStructure = true;
  
  // check ds name
  if (!jsName)
  {
    _wizCtrl.showStep(0);
    alert(dw.loadString("spry/dataset/wizard/alert/emptyDSNameField"));
    return;
  }
  else if(!dwscripts.isValidVarName(jsName))
  {
    _wizCtrl.showStep(0);
    alert(dw.loadString("spry/dataset/wizard/alert/invalidDSName").replace(/\\n/g, "\n"));
    return;
  }
  
  // see if the name of the dataset already exists in page
  if (!IN_EDIT_MODE || jsName != DATASET_CMD_ARGS.getDataSetName())
  {
    var arrDSNames = DESIGN_TIME_DS.getDataSetNamesFromDoc(dw.getDocumentDOM());
    if (arrDSNames.length)
    {
      if (dwscripts.findInArray(arrDSNames, jsName) != -1)
      {
        _wizCtrl.showStep(0);
        alert(dw.loadString("spry/dataset/wizard/alert/DSNameAlreadyExist"));
        return;
      }
    }
  }
  
  // set the new data set name
  DESIGN_TIME_DS.setDataSetName(jsName);
  
  // check if filesource is valid
  if (!_fileSourceURL.getValue())
  {
    _wizCtrl.showStep(0);
    alert(dw.loadString("spry/dataset/wizard/alert/emptyFileField"));
    return;
  }
  
  if (_dataSetType.getValue() == Spry.DesignTime.DataSet.XMLDataSetType)
  {
    // see if the entered XPath is valid
    if (!setXPathNode(_xPathExprTextField.getValue()))
    {
      _wizCtrl.showStep(0);
      alert(dw.loadString("spry/dataset/wizard/message/invalidXPath"));
      return;
    }
  }

  // check if a container was selected
  if(!DESIGN_TIME_DS.getRootElement())
  {
    var errStr;
    if (_dataSetType.getValue() == Spry.DesignTime.DataSet.XMLDataSetType)
    {
      if (DESIGN_TIME_DS.IsError())
      {
        errStr = dw.loadString("spry/dataset/wizard/alert/XMLDSErrorCantInsert").replace(/\\n/g, "\n");
      }
      else
      {
        errStr = dw.loadString("spry/dataset/wizard/alert/selectXPath");
      }
    }
    else
    {
      errStr = dw.loadString("spry/dataset/wizard/alert/selectDataContainer");
    }
    _wizCtrl.showStep(0);
    alert(errStr);
    return;
  }

  if (_dataSetType.getValue() == Spry.DesignTime.DataSet.XMLDataSetType)
  {
    if (!validateXMLDataAndChangedFields())
    {
      // return if the xml data validation failed; the message will be displayed in the
      // validateXMLDataAndChangedFields method
      return;    
    }
  }
  
  if (_dataCaching.getCheckedState() && _autorefreshData.getCheckedState())
	{
		//get the auto refresh milliseconds and validate if it numeric 
		var autoRefreshValue = _refreshInterval.getValue();
		if (autoRefreshValue.length == 0)
		{
      _wizCtrl.showStep(1);
			alert(MM.MSG_EnterAutoRefreshMilliSeconds);
			return;
		}
		if (autoRefreshValue.search(/^(\d+)$/ig) == -1)
		{
      _wizCtrl.showStep(1);
			alert(MM.MSG_InvalidCharsInSpryAutoRefreshMS);
			return;
		}
	}

  // check if the dataset contains any data, and let the user decide
  // if he wants to still insert the dataset
  if (!DESIGN_TIME_DS.getNoOfRows())
  { 
    // inform user that no rows where found
    if (!confirm(dw.loadString("spry/dataset/wizard/alert/dsHasNoData").replace(/\\n/g, "\n")))
    {
      return;
    }
    else
    {
      // if no data exists in the dataset insert only the JS constructor
      _insertOptions.setIndex(4);
    }
  }
  
  var selInsertOption = _insertOptions.getValue();
  
  if (selInsertOption != Spry.DesignTime.DataSet.InsertStructure.InsertNone)
  {
    if (INSERT_OPTIONS_OBJ)
    {
      if (selInsertOption == INSERT_OPTIONS_OBJ.getStructureType())
      {
        if (INSERT_OPTIONS_OBJ.DatasetOptionsDiffer(DESIGN_TIME_DS))
        {
          var confirmMsg = dw.loadString("spry/dataset/wizard/confirm/insertOptionsOutdated");
          confirmMsg = confirmMsg.replace(/\\n/g, "\n"); 
          if (!confirm(confirmMsg))
          {
            // return if user doesn't want to insert with the default settings
            return;
          }
          else
          {
            // destroy previous created object; it will be created another one bellow
            INSERT_OPTIONS_OBJ = null;
          }
        }
      }
    }
    if (!INSERT_OPTIONS_OBJ || selInsertOption != INSERT_OPTIONS_OBJ.getStructureType())
    {
      // if insert option was chosen and no settings was made, insert with the default options without any notice 
      INSERT_OPTIONS_OBJ = new Spry.DesignTime.DataSet.InsertStructure(selInsertOption);
      INSERT_OPTIONS_OBJ.setDatasetColumnsTypes(DESIGN_TIME_DS.getAllColumnsTypes());
      INSERT_OPTIONS_OBJ.setDatasetColumnsNames(DESIGN_TIME_DS.getColumnNames());
      var errStr = INSERT_OPTIONS_OBJ.setDefaultsOptions();
      if (errStr)
      {
        alert(errStr);
        return;
      }
    }
  }
  else
  {
    // don't insert anything
    INSERT_OPTIONS_OBJ = null;
  }
  
  // insert or update the dataset
  var includeFileList = DESIGN_TIME_DS.getAssetsFiles();
  
  if (includeFileList.length)
  {

    // insert chosen html structure 
    if (INSERT_OPTIONS_OBJ)
    {
      includeFileList = includeFileList.concat(INSERT_OPTIONS_OBJ.getAssetsFiles());
    }

    var theDOM = dw.getDocumentDOM();

    // insert chosen html structure 
    if (INSERT_OPTIONS_OBJ)
    {
      var insertString = INSERT_OPTIONS_OBJ.getInsertString(jsName);
      if (JUST_INSERT_STRUCTURE)
      {
         dwscripts.setCommandReturnValue(insertString);
      }
      else
      {
        theDOM.insertHTML(insertString, false);
      }
			// ensure namespace is declared
			ajaxUtils.initSpryNS();
    }

    // copy the include file list
    theDOM.copyAssets(includeFileList);
    
    // add js code to head node
    if (!IN_EDIT_MODE)
    {
      var strJSCode = DESIGN_TIME_DS.getGeneratedCode();
      if (strJSCode)
      {
    		theDOM.addJavaScript(strJSCode, true);
    	}
  	}
  	else
  	{
      // if everything went well, set the new name of the dataset 
      DESIGN_TIME_DS.updateJSCode(theDOM, oldJSName);
    }

		// after inserting the spry ajax dataset, give the data bindings panel focus
		if ( !dw.getFloaterVisibility('data bindings'))
		{
			dw.toggleFloater('data bindings');
		}
 		// add it to list of expanded node
 		dw.dbi.setExpanded(jsName, true);

    //refresh the data bindings panel
    dw.dbi.refresh();        
  }
  
	window.close();
}

//--------------------------------------------------------------------
// FUNCTION:
//   cancelClicked
//
// DESCRIPTION:
//   Closes the window and returns nothing
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function clickedCancel()
{
  window.close();
}

//--------------------------------------------------------------------
// FUNCTION:
//   displayHelp
//
// DESCRIPTION:
//   This function is called when the user clicks on the link next to "Advanced data selection" or on the Help button
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function displayHelp(helpSource)
{
  var helpID;
  if (helpSource == "selectors")
  {
    helpID = SELECTORS_HELPDOC; 
  }
  else
  {
    if (_dataSetType.getValue() == Spry.DesignTime.DataSet.XMLDataSetType)
    {
      helpID = XML_HELPDOC; 
    }
    else
    {
      helpID = HTML_HELPDOC;
    }
  }

  dwscripts.displayDWHelp(helpID);
}

// ***************** LOCAL FUNCTIONS  ******************

//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   This function is called in the onLoad event. It is responsible
//   for initializing the UI and for setting the default values for some of the interface
//   fields. 
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function initializeUI() 
{
  var theDOM = dw.getDocumentDOM();
  
  // initialize HTML controls
  _wizCtrl.initializeUI(0);
  _wizCtrl.onBeforeChangeStep = onBeforeChangeStep;
  _wizCtrl.onAfterChangeStep = onAfterStepChanged;

  PREVIEW_FIRSTSTEP_REGION = document.getElementById("previewRegionContainer");
  ADV_DATA_SEL_REGION = document.getElementById("advancedDataSelectionBox");
  SHOW_HIDE_IMG = document.getElementById("showHideImg");
  _loadingIndicatorContainer = document.getElementById("loadingIndicatorContainer");
  _refreshButtonContainer = document.getElementById("refreshButtonContainer");
  _browseButton = document.getElementById("browseForFile");

  _dataSetType.init();
  _dsName.initializeUI();
  _fileSourceURL.initializeUI();
  // register the on enter key pressed event
  _fileSourceURL.textControl.addEventListener("DWDialogOk", function(e){ updateUI("fileSourceURL"); e.preventDefault(); } , true);

  _refreshBtn = document.getElementById("refreshBtn"); 
  _chooseContainerCtrl = document.getElementById("chooseContainerCtrl");
  _dataPreviewFirstStep = document.getElementById("dataPreviewFirstStep");
  _dataPreviewSecondStep = document.getElementById("dataPreviewSecondStep");
  //don't want to tabs from the command ui to go into the browsers
  _chooseContainerCtrl.includedInChromeTabCycle = false;
  _dataPreviewFirstStep.includedInChromeTabCycle = false;
  _dataPreviewSecondStep.includedInChromeTabCycle = false;
  _xmlSchemaTree = document.getElementById("theSchemaTreeControl");
  _feedURLNotification = document.getElementById("feedURLNotification");
  
  CONTAINER_ID = "";
  
  _detectElements.init();
  _detectElements.object.addEventListener("DWDialogOk", function(e){ updateUI("detectElements", "onblur"); e.preventDefault(); } , true);
  _selectableElements.setAll([dw.loadString("spry/dataset/wizard/label/noDataContainer")], ['']);
  _xPathExprTextField.initializeUI();  
  _xPathExprTextField.textControl.addEventListener("DWDialogOk", function(e){ updateUI("xpathExpr"); e.preventDefault(); } , true);
  _advDataSelection.initializeUI(); 
  _rowSelectors.initializeUI();
  _rowSelectors.textControl.addEventListener("DWDialogOk", function(e){ updateUI("rowSelectors"); e.preventDefault(); } , true);
  _colSelectors.initializeUI();
  _colSelectors.textControl.addEventListener("DWDialogOk", function(e){ updateUI("colSelectors"); e.preventDefault(); } , true);
  
  _dataSetColumns.object.editable = true;
  // register the on enter key pressed event
  _dataSetColumns.object.addEventListener("DWDialogOk", function(e){ updateUI("dataSetColumns", "onblur"); e.preventDefault(); } , true);
  
  _prevColumnName = document.getElementById("prevColumnName");
  _nextColumnName = document.getElementById("nextColumnName");
  _columnType.setAll(MM.LABEL_SpryDataTypeCols, Spry.DesignTime.DataSet.DataTypes);
  _columnType.setIndex(0);
  _sortColumn.init();
  _sortDirection.init();
  _firstRowAsHeaders.initializeUI();
  _useColumnsAsRows.initializeUI();
  _distinctLoad.initializeUI();
  _dataCaching.initializeUI();
  _autorefreshData.initializeUI();
  _refreshInterval.initializeUI();
  _insertOptions.initializeUI();
  
  // initialize the last step insert options
  for (var key in INSERT_OPTIONS_CONTAINERS)
  {
    INSERT_OPTIONS_CONTAINERS[key] = document.getElementById(key);
  }
  
  _sortColumn.setAll([dw.loadString("spry/dataset/wizard/label/none")], [""]);
  
  if (!DATASET_CMD_ARGS)
  {
    // insert mode 
    IN_EDIT_MODE = false;
    
    // we will always start with the HTML Data Set Type
    DESIGN_TIME_DS = new Spry.DesignTime.HTMLDataSet();
    initializeDesignTimeObject();
    
    // get new name for the dataset
    _dsName.setValue(DESIGN_TIME_DS.getNewDataSetName());
    _insertOptions.setIndex(4);
  }
  else
  {
    IN_EDIT_MODE = true;
    IN_EDIT_INITIALIZE = true;
    
    // create new dataset
    if (DATASET_CMD_ARGS.getType() == Spry.DesignTime.DataSet.XMLDataSetType)
    {
      DESIGN_TIME_DS = new Spry.DesignTime.XMLDataSet();
    }
    else
    {
      DESIGN_TIME_DS = new Spry.DesignTime.HTMLDataSet();
    }
    
    // copy introspected DS into our design time object
    DESIGN_TIME_DS.copyDSOptions(DATASET_CMD_ARGS);
    var dsURL = DESIGN_TIME_DS.getDataSetURL();
    
    // set control values
    _dsName.setValue(DESIGN_TIME_DS.getDataSetName());
    _dataSetType.pickValue(DESIGN_TIME_DS.getType());
    setControlsFromOptObj(DESIGN_TIME_DS.getOptions());
    initializeDesignTimeObject();    
    
    if (DESIGN_TIME_DS.getType() == Spry.DesignTime.DataSet.XMLDataSetType)
    {
      var columnTypes = DESIGN_TIME_DS.getAllColumnsTypes(); // preserve column types since the DESIGN_TIME_DS will be
                                                             // recreated in the xmlSourceChanged function
      var xPathNode = DESIGN_TIME_DS.getDataSetPath();
      
      onChangeDataSetType();
      _fileSourceURL.setValue(dsURL);
      fileSourceChanged(true, dsURL);
      if (!DESIGN_TIME_DS.IsError())
      {
        _xPathExprTextField.setValue(xPathNode);
        setXPathNode(xPathNode);
      }
      else
      {
        DESIGN_TIME_DS.clearDataSetContent();
        alert(dw.loadString("spry/dataset/wizard/alert/InvalidData").replace(/\\n/g, "\n"));
      }
      updateSortColumnCtrl();
      var optObj = DESIGN_TIME_DS.getOptions();

      if (optObj && optObj.sortOnLoad)
      {
        _sortColumn.pick(optObj.sortOnLoad);
        if (optObj.sortOrderOnLoad && _sortColumn.getValue())
        {
          _sortDirection.enable(true);
          _sortDirection.pickValue(optObj.sortOrderOnLoad);
        }
      }
      DESIGN_TIME_DS.setAllColumnsTypes(columnTypes);
      // map the column types to column indexes
      DESIGN_TIME_DS.mapColumnTypesToIdx();

      updateDSColumnNames();
      // for xml data set the initialization process is finishing here
      IN_EDIT_INITIALIZE = false;
    }
    else
    {
      _fileSourceURL.setValue(dsURL);
      fileSourceChanged(true, dsURL);
    }
    PREV_FILE_SOURCE = dsURL;
    
    if (JUST_INSERT_STRUCTURE)
    {
      _wizCtrl.showStep(2);
      // select first option  
      _insertOptions.setIndex(0);
    }
    else
    {
      // select last option  
      _insertOptions.setIndex(4);
    }
  }
  
  // the same checks are made in the Datasource file when the dataset is 
  // dragged and dropped in page, so we will skip them here
  if (!JUST_INSERT_STRUCTURE) 
  {
    // some checks made to the insertion point
    var errStr = "";
    
    if (theDOM.getAttachedTemplate())
    {
      var editableRegions = theDOM.body.getElementsByTagName("MMTInstance:Editable");
      
      if (!editableRegions.length)
      {
        errStr = dw.loadString("spry/dataset/wizard/alert/NoEditableRegion");
      } 
    }
    if (!errStr && !dwscripts.selectionIsInBody())
    {
      errStr = dw.loadString("spry/dataset/wizard/alert/DragDropIPInsideBodyTag"); 
    }
    if (!errStr && Spry.DesignTime.DataSet.selectionIsInsideSpryRegion())
    {
      errStr = dw.loadString("spry/dataset/wizard/alert/IPInsideSpryRegion"); 
    }
    
    if (errStr)
    {
      alert(errStr);
      disableInsertOptions();    
      // select last option  
      _insertOptions.setIndex(4);
    }
  }
  // initialize the insert options from the last step
  updateUI("insertOptions");
  // set focus to the first element from the interface
  _dataSetType.object.focus();
}

//--------------------------------------------------------------------
// FUNCTION:
//   initializeDesignTimeObject
//
// DESCRIPTION:
//   This function ...
//
// ARGUMENTS:
//    none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function initializeDesignTimeObject()
{
  DESIGN_TIME_DS.setWindowObj(window);
  
  if (_dataSetType.getValue() == Spry.DesignTime.DataSet.XMLDataSetType)
  {
    DESIGN_TIME_DS.setXmlSchemaTree(_xmlSchemaTree);
    DESIGN_TIME_DS.setPreviewCtrl(_dataPreviewFirstStep);
  }
  else
  {
    DESIGN_TIME_DS.setBrowserControl(_chooseContainerCtrl);
    DESIGN_TIME_DS.setPreviewCtrl(_dataPreviewFirstStep);
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateUI
//
// DESCRIPTION:
//   This function is called by the UI controls to handle UI updates
//
// ARGUMENTS:
//   controlName - string - the name of the control sending the event
//   optParam - string - additional parameter
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateUI(controlName, optParam)
{
  switch(controlName)
  {
      case "dsName":
          // validate data set name
          var dsName = _dsName.getValue();
          if (!dsName)
          {
            alert(dw.loadString("spry/dataset/wizard/alert/emptyDSNameField"));
            _dsName.setValue(DESIGN_TIME_DS.getDataSetName());
            _dsName.textControl.focus();
            break;
          }
          else if(!dwscripts.isValidVarName(dsName))
          {
            alert(dw.loadString("spry/dataset/wizard/alert/invalidDSName").replace(/\\n/g, "\n"));
            _dsName.textControl.focus();
            break;
          }
          break;  
      case "refresh":
          if (!IN_PROGRESS_LOADING_FILE)
          {
            // force a reload of current page
            var tmpURL = PREV_FILE_SOURCE; 
            PREV_FILE_SOURCE = "";
          }
          // continue with the file source URL
      case "fileSourceURL":
          if (!IN_PROGRESS_LOADING_FILE)
          {
            var url = _fileSourceURL.getValue();
            
            if (!fileSourceChanged(false, url))
            {
              if (controlName == "refresh")
              {
                PREV_FILE_SOURCE = tmpURL;
              }
              
              // if no error, the PREV_FILE_SOURCE will be set to the new URL 
              // inside the fileSourceChanged function
             _fileSourceURL.setValue(PREV_FILE_SOURCE);
            }
          }
          break;
      case "selectableElements":
          DESIGN_TIME_DS.selectDataContainer(_selectableElements.getValue());
          break;
      case "containerID":
          if (typeof(optParam) == "object")
          {
            // the optParam will contain reference to the frame window object,
            // frame document relative path and container id
            // the main window of the document will also be considered as a frame
            CONTAINER_ID = optParam.containerID;
            DESIGN_TIME_DS.switchFrameSource(optParam.frameWnd, optParam.fileURL);
          }
          else
          {
            CONTAINER_ID = optParam;
          }
          
          if (DESIGN_TIME_DS.hasCustomColumns())
          {
            if (!confirm(dw.loadString("spry/dataset/wizard/alert/options_confirm_custom_columns").replace(/\\n/g, "\n")))
            {
              DESIGN_TIME_DS.selectDataContainer(DESIGN_TIME_DS.getSourceElementID(), true);
              _selectableElements.object.onchange = "";
              _selectableElements.pickValue(DESIGN_TIME_DS.getSourceElementID());
              _selectableElements.object.onchange = "updateUI('selectableElements', 'onchange');";
              return;
            }
          }
          
          if (CONTAINER_ID)
          {
            // since the data is already retrieved 
            // we only need to parse/reparse the content
            DESIGN_TIME_DS.setSourceElementID(CONTAINER_ID);
            
            // we are at the end of the initialization process of the edit mode
            if (IN_EDIT_INITIALIZE)
            {
              // first load data without filtering and sorting to populate the dataset
              // ignore the error we will display it second time
              DESIGN_TIME_DS.loadDataIntoDataSet(true);
              // set sortColumn and sortDirection
              var optObj = DESIGN_TIME_DS.getOptions();
              
              // populate the sort column field
              updateSortColumnCtrl();
              if (optObj.sortOnLoad)
              {
                _sortColumn.pick(optObj.sortOnLoad);
                if (optObj.sortOrderOnLoad && _sortColumn.getValue())
                {
                  _sortDirection.enable(true);
                  _sortDirection.pickValue(optObj.sortOrderOnLoad);
                }
              }
              // map the column types to column indexes
              DESIGN_TIME_DS.mapColumnTypesToIdx();
              IN_EDIT_INITIALIZE = false;
            }
            else
            {
              // reset column aliases
              DESIGN_TIME_DS.setColumnsNames(null);
              // reset column types 
              DESIGN_TIME_DS.setAllColumnsTypes(null); 
            }
            
            // update ds options from interface
            updateDSOptions();
            
            // construct the data set                        
            var errStr = DESIGN_TIME_DS.loadDataIntoDataSet();
            if (errStr)
            {
              alert(errStr);
            }
            
            updateDSColumnNames();
            DESIGN_TIME_DS.updatePreviewCtrl(0);
          }
          else
          {
            if (DESIGN_TIME_DS.hasSelectableElements())
            {
              // write message in the preview data control
              DESIGN_TIME_DS.showMessageInPreviewCtrl(dw.loadString("spry/dataset/wizard/message/selectContainer"));
            }
            else
            {
              // clear the content of the data preview control
              DESIGN_TIME_DS.clearPreviewCtrl();
            }
            
            // clear Data Set content
            DESIGN_TIME_DS.clearDataSetContent();
            updateDSColumnNames();
          }
          _selectableElements.pickValue(CONTAINER_ID);
          break;
      case "detectElements":
          var elsType = _detectElements.getValue();
          
          if (optParam == "onchange")
          {
            if (!elsType)
            {
              // the "custom" label was selected
              _detectElements.object.addEventListener("blur", function(e){ updateUI("detectElements", "onblur"); } , true);
              _detectElements.object.editable = true;
              // restore the edittext value to predefined one 
              _detectElements.object.editText = dw.loadString("Commands/SpryDataSetWizard/option/Custom");
            }
            else
            {
              _detectElements.object.editable = false;
              _detectElements.object.removeEventListener("blur", function(e){ updateUI("detectElements", "onblur"); } , true);
            }
          }
          else if(optParam == "onblur")
          {
            elsType = _detectElements.getValue();
            
            if (_detectElements.object.editText && _detectElements.getIndex() == -1)
            {
              // add typed value to list
              elsType = _detectElements.object.editText;
              var arrElTypesLabels = _detectElements.get('all'); 
              var arrElTypesValues = _detectElements.getValue('all');
              if (dwscripts.findInArray(arrElTypesValues, elsType) == -1)
              {
                arrElTypesLabels.splice((arrElTypesLabels.length - 1), 0, elsType);
                arrElTypesValues.splice((arrElTypesValues.length - 1), 0, elsType);
              }
              _detectElements.setAll(arrElTypesLabels, arrElTypesValues);
              _detectElements.pickValue(elsType);
              _detectElements.object.editable = false;
              _detectElements.object.removeEventListener("blur", function(e){ updateUI("detectElements", "onblur"); } , true);
            }
          }
          
          if (elsType != PREV_DETECTED_ELEMENTS)
          {
            if (optParam == "onchange" && DESIGN_TIME_DS.hasCustomColumns())
            {
              if (!confirm(dw.loadString("spry/dataset/wizard/alert/options_confirm_custom_columns").replace(/\\n/g, "\n")))
              {
                _detectElements.pickValue(PREV_DETECTED_ELEMENTS);
                if (PREV_DETECTED_ELEMENTS && _detectElements.object.editable)
                {
                  _detectElements.object.editable = false;
                  _detectElements.object.removeEventListener("blur", function(e){ updateUI("detectElements", "onblur"); } , true);
                    }
                break;
              }
            }
          
            // some dataset options have sense only for the table elements
            // so I will disable/enable here those elements
            if (elsType == "tables" || elsType == "table")
            {
              _firstRowAsHeaders.enable(true);
              _useColumnsAsRows.enable(true);
              
            }
            else
            {
              _firstRowAsHeaders.enable(false);
              _useColumnsAsRows.enable(false);
            }
          
            // reset the design time dataset and reposition all makers
            DESIGN_TIME_DS.clearMarkers();
            DESIGN_TIME_DS.clearDataSetContent();
  
            // clear the content of the data preview control
            DESIGN_TIME_DS.clearPreviewCtrl();
            // add new markers
            onReceiveResponseAsync();
            PREV_DETECTED_ELEMENTS = elsType;
          }
          break;
      case "dataSetColumns":
          // when pressing enter in the dataSetColumns the updateUI function
          // is tending to be called 2 times one time for the DWDialogOk event
          // and one time for the onBlur event
          // here we will skip the one call  
          if (!IN_UPDATE_DATASET_COLUMNS)
          {
            IN_UPDATE_DATASET_COLUMNS = true;
            var listIdx = _dataSetColumns.index;
            var colIdx = _dataSetColumns.getIndex();
            var columnName = _dataSetColumns.get();
            var oldColumnNames = DESIGN_TIME_DS.getColumnNames();
            
            // items was edited 
            if (colIdx == -1 && listIdx != colIdx)
            {
              columnName = _dataSetColumns.object.editText;
              // check to see if column name contain spaces
              // if so inform user that the spaces will be replaced with "_" character and replace them
              if (columnName && columnName.match(/[ \t]+/))
              {
                alert(dw.loadString("spry/dataset/wizard/alert/columnWithSpaces").replace(/\\n/g, "\n"));
                columnName = columnName.replace(/[ \t]+/g, "_");
                _dataSetColumns.object.editText = columnName;
              }
              _dataSetColumns.setValue(listIdx, listIdx);
              _dataSetColumns.set(columnName, listIdx);
              _dataSetColumns.setIndex(listIdx);
              colIdx = listIdx;
            }
  
            if (_dataSetType.getValue() == Spry.DesignTime.DataSet.HTMLDataSetType && optParam == "onblur")
            {
              // see if column name already exists
              if (oldColumnNames[listIdx] != columnName && dwscripts.findInArray(oldColumnNames, columnName) != -1 )
              {
                // stop here
                alert(dw.loadString("spry/dataset/wizard/alert/duplicateColumnName").replace(/\\n/g, "\n"));
                _dataSetColumns.focus();
                IN_UPDATE_DATASET_COLUMNS = false;
                break;
              }
            }
            
            if (columnName)
            {
              if (colIdx != -1 && columnName != oldColumnNames[colIdx])
              {
                // we need to update the preview control
                setDSColumnNames();
                DESIGN_TIME_DS.updatePreviewColumnName(colIdx, columnName);
                // we need to update the sort columns list
                updateSortColumnCtrl();
              }
              
              // update the column type ctrl
              var colType = DESIGN_TIME_DS.getColumnType(colIdx, true);
              _columnType.pickValue(colType);
              DESIGN_TIME_DS.highlightColumn(colIdx);
            }
            else if(oldColumnNames.length)
            {
              alert(dw.loadString("spry/dataset/wizard/alert/invalidColumnName"));
              _dataSetColumns.focus();
            }
            // update navigation controls
            updateColumnNamesNavButtons();
            IN_UPDATE_DATASET_COLUMNS = false;
          }
          break;
      case "nextColumn":
          var colIdx = _dataSetColumns.getIndex();
          if (colIdx < (_dataSetColumns.getLen() - 1))
          {
            _dataSetColumns.setIndex(++colIdx);
            // update the column type ctrl
            var colType = DESIGN_TIME_DS.getColumnType(_dataSetColumns.getValue(), true);
            _columnType.pickValue(colType);
            DESIGN_TIME_DS.highlightColumn(colIdx);                  
          }
          // update navigation controls
          updateColumnNamesNavButtons();
          // give focus to the column names control
          _dataSetColumns.object.focus();
          break;          
      case "prevColumn":
          // this is a call from the prev button from the interface
          var colIdx = _dataSetColumns.getIndex();
          
          if (colIdx > 0)
          {
            _dataSetColumns.setIndex(--colIdx);
            // update the column type ctrl
            var colType = DESIGN_TIME_DS.getColumnType(_dataSetColumns.getValue(), true);
            _columnType.pickValue(colType);
            DESIGN_TIME_DS.highlightColumn(colIdx);                  
          }
          // update navigation controls
          updateColumnNamesNavButtons();
          // give focus to the column names control
          _dataSetColumns.object.focus();
          break;
      case "previewColumn":
          // this is a call from the preview browser control
          var colIdx = optParam;
          
          _dataSetColumns.setIndex(colIdx);
          var colType = DESIGN_TIME_DS.getColumnType(_dataSetColumns.getValue(), true);
          _columnType.pickValue(colType);
          // update navigation controls
          updateColumnNamesNavButtons();
          // give focus to the column names control unless we're already updating that UI from an onblur
          if( !IN_UPDATE_DATASET_COLUMNS )
          {
            _dataSetColumns.object.focus();
          }
          break;
      case "columnType":
          var columnType = _columnType.getValue();

          if (columnType)
          {        
            var columnIdx = _dataSetColumns.getValue();
            
            DESIGN_TIME_DS.setColumnType(columnIdx, columnType);

            // when a column type is changed, we need to verify the sort column
            // field to see if current selected column is the same
            // as the one from the sort column field, in this case we need to 
            // to sort again the dataset
            if (columnIdx == _sortColumn.getValue())
            {
              updateDSOptions();
              var errStr = DESIGN_TIME_DS.loadDataIntoDataSet();
              if (errStr)
              {
                alert(errStr);
              }
              DESIGN_TIME_DS.updatePreviewCtrl(columnIdx);            
            }
          }
          break;
      case "sortColumn":
          if (_sortColumn.getIndex())
          {
            // enable the direction control
            _sortDirection.enable(true);
          }
          else
          {
            _sortDirection.enable(false);
          }
          // "sortColumn" also requires the application of the instructions for "sortDirection" so fall through to the "sortDirection" case
      case "sortDirection":
          var colIdx = _dataSetColumns.getValue();
          updateDSOptions();
          var errStr = DESIGN_TIME_DS.loadDataIntoDataSet();
          if (errStr)
          {
            alert(errStr);
          }
          DESIGN_TIME_DS.updatePreviewCtrl(colIdx);                
          break;
      case "firstRowAsHeaders":
      case "useColumnsAsRows":
          if (DESIGN_TIME_DS.IsDataLoaded())
          {
            // when those two options are changed we need to refresh the columns names
            // but before doing that we need to see if there are custom columns names defined
            // if they are, then get confirmation to move on
            var isCustomColumns;
            var update = true;
            var arrOldColumnTypes;
            
            if (controlName == "firstRowAsHeaders")
            {
              isCustomColumns = DESIGN_TIME_DS.hasCustomColumnsNames();
            }
            else
            {
              isCustomColumns = DESIGN_TIME_DS.hasCustomColumns()
            }
            if (isCustomColumns)
            {
              if (!confirm(dw.loadString("spry/dataset/wizard/alert/options_confirm_custom_columns").replace(/\\n/g, "\n")))
              {
                update = false;
              }
            }
            
            if (update)
            {
              // reset columns names and columns types first
              DESIGN_TIME_DS.setAllColumnsTypes(null);
              DESIGN_TIME_DS.setColumnsNames(null);
              if (controlName == "useColumnsAsRows")
              {
                // update the sort column also
                _sortColumn.setIndex(0);
                _sortDirection.enable(false);
              }
              updateDSOptions();
              
              var errStr = DESIGN_TIME_DS.loadDataIntoDataSet();
              if (errStr)
              {
                alert(errStr);
              }
              updateDSColumnNames();
              DESIGN_TIME_DS.updatePreviewCtrl(0);                
            }
            else
            {
              window["_" + controlName].setCheckedState(!window["_" + controlName].getCheckedState());
            }
          }
          break;
      case "distinctLoad":
          if (DESIGN_TIME_DS.IsDataLoaded())
          {
        
            var colIdx = _dataSetColumns.getValue();
            
            updateDSOptions();
            var errStr = DESIGN_TIME_DS.loadDataIntoDataSet();
            if (errStr)
            {
              alert(errStr);
            }
            DESIGN_TIME_DS.updatePreviewCtrl(colIdx);
          }                
          break;
      case "dataCaching":
          var autorefreshDataLabel = document.getElementById("autorefreshDataLabel");
          var millisecondsLabel = document.getElementById("millisecondsLabel");

          if (_dataCaching.getCheckedState())
          {
            // enable controls
            _autorefreshData.enable(true);
            autorefreshDataLabel.setAttribute("class", "enabledText");
            if (_autorefreshData.getCheckedState())
            {
              _refreshInterval.setDisabled(false);
              millisecondsLabel.setAttribute("class", "enabledText");
            }
          }
          else
          {
            // disable controls
            _autorefreshData.enable(false);
            autorefreshDataLabel.setAttribute("class", "disabledText");
            _refreshInterval.setDisabled(true);
            millisecondsLabel.setAttribute("class", "disabledText");
          }
          updateDSOptions();
          break;
      case "autorefreshData":
          var millisecondsLabel = document.getElementById("millisecondsLabel");
          
          if (_autorefreshData.getCheckedState())
          {
            _refreshInterval.setDisabled(false);
            millisecondsLabel.setAttribute("class", "enabledText");
          }
          else
          {
            _refreshInterval.setDisabled(true);
            millisecondsLabel.setAttribute("class", "disabledText");
          }
          updateDSOptions();
          break;
      case "refreshInterval":
          updateDSOptions();
          break;
      case "insertOptions":
          if (optParam)
          {
            var optEl = document.getElementById(optParam);
            
            if (optEl && !optEl.disabled)
            {
              _insertOptions.pickValue(optParam);
              var insertOptButtonEl = document.getElementById(optParam + "Button");
              if (insertOptButtonEl)
              {
                insertOptButtonEl.src = IMAGES_BASE_PATH + INSERT_OPT_IMAGES[optParam].selected; 
              }
            }
            else
            {
              break;
            }
          }
          if (PREV_INSERT_OPT)
          {
            var prevInsertOptButtonEl = document.getElementById(PREV_INSERT_OPT + "Button");
            if (prevInsertOptButtonEl)
            {
              prevInsertOptButtonEl.src = IMAGES_BASE_PATH + INSERT_OPT_IMAGES[PREV_INSERT_OPT].normal; 
            }
          }
          
          var choosedOption = _insertOptions.getValue();
          PREV_INSERT_OPT = choosedOption;
          break;
      case "advDataSelection":
          var rowsLabel = document.getElementById("rowSelectorsLabel");
          var colsLabel = document.getElementById("colSelectorsLabel");
          // enable row selectors and data selectors controls
          if (_advDataSelection.getCheckedState())
          {
            _rowSelectors.setDisabled(false);
            _colSelectors.setDisabled(false);
            if (rowsLabel)
            {
              rowsLabel.setAttribute("class", "enabledText");
            }
            if (colsLabel)
            {
              colsLabel.setAttribute("class", "enabledText");
            }

            // If the source element is a table, and the user chose to use
            // selectors, we need to pre-populate the row and column selector
            // fields with basic selectors so that the data set preview area
            // still shows data.

            var selElTagName = DESIGN_TIME_DS.getSourceElementTagName();
            if (selElTagName && selElTagName.toLowerCase() == "table")
            {
              if (! _rowSelectors.getValue())
                _rowSelectors.setValue("tr");
              if (! _colSelectors.getValue())
                _colSelectors.setValue("td");
            }
          }
          else
          {
            _rowSelectors.setDisabled(true);
            _colSelectors.setDisabled(true);
            if (rowsLabel)
            {
              rowsLabel.setAttribute("class", "disabledText");
            }
            if (colsLabel)
            {
              colsLabel.setAttribute("class", "disabledText");
            }
          }
      case "rowSelectors":
      case "colSelectors":
          if (DESIGN_TIME_DS.IsDataLoaded())
          {
            updateDSOptions();
            var errStr = DESIGN_TIME_DS.loadDataIntoDataSet();
            if (errStr)
            {
              alert(errStr);
            }
            DESIGN_TIME_DS.updatePreviewCtrl();
            updateDSColumnNames();
          }
          if (controlName == "advDataSelection")
          {
            _advDataSelection.checkBox.focus();
          }
          break;
      case "xpathExpr":
          if (setXPathNode(_xPathExprTextField.getValue()))
          {
            buildXMLColumnList(true);
          }
          else
          {
            // clear Data Set content
            DESIGN_TIME_DS.clearDataSetContent();
            DESIGN_TIME_DS.clearPreviewCtrl();
            updateDSColumnNames();
            if (PREV_XPATH != _xPathExprTextField.getValue())
            {
              PREV_XPATH = _xPathExprTextField.getValue();
              alert(dw.loadString("spry/dataset/wizard/message/invalidXPathExpression"));
            }
          }
          break;
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   onChangeDataSetType
//
// DESCRIPTION:
//   This function show/hide various controls in the interface.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onChangeDataSetType()
{
  var dsType = _dataSetType.getValue();
  
  if (!IN_EDIT_INITIALIZE && DESIGN_TIME_DS.isCustomized())
  {
    var confirmStr = dw.loadString("spry/dataset/designtime/alert/changeDataSetType").replace(/\\n/g, "\n");
    if (!confirm(confirmStr))
    {
      _dataSetType.object.onchange = "";
      if (dsType == Spry.DesignTime.DataSet.XMLDataSetType)
      {
        _dataSetType.pickValue(Spry.DesignTime.DataSet.HTMLDataSetType);
      }
      else
      {
        _dataSetType.pickValue(Spry.DesignTime.DataSet.XMLDataSetType);
      }
      _dataSetType.object.onchange = "onChangeDataSetType()";
      
      return;
    }
  }
  
  // clear file source field
  _fileSourceURL.setValue("");
  _refreshBtn.src = REFRESH_BTN_DIS_SRC;
  _refreshBtn.disabled = true;
  PREV_FILE_SOURCE = "";
  DESIGN_TIME_DS.clearPreviewCtrl();
  
  // clear attached controls
  if (dsType == Spry.DesignTime.DataSet.XMLDataSetType)
  {
    // that means the previous type was html
    if (!IN_EDIT_INITIALIZE)
    {     
      DESIGN_TIME_DS.clearBrowserCtrl();
    }
    _dataSetColumns.object.editable = "false";
    _columnType.setIndex(0);
  }
  else
  {
    // clear schema tree control      
		var treeNodeContents = "";
		if (dwscripts.IS_MAC)
		{		
			//for mac create an empty column node
			treeNodeContents ="<mm:treecolumn width='300'>";
		}
		_xmlSchemaTree.innerHTML = treeNodeContents;
    _dataSetColumns.object.editable = "true";
    // that means the previous type was xml
    _columnType.setIndex(0);
    _xPathExprTextField.setValue("");
  }

  if (!IN_EDIT_INITIALIZE)
  {     
    // delete the current design time object
    DESIGN_TIME_DS = null;
    if (dsType == Spry.DesignTime.DataSet.XMLDataSetType)
    {
      DESIGN_TIME_DS = new Spry.DesignTime.XMLDataSet(_dsName.getValue(), _fileSourceURL.getValue(), "");
    }
    else
    {
      DESIGN_TIME_DS = new Spry.DesignTime.HTMLDataSet();
    }
    updateDSColumnNames();
  }
  
  // hide/show specific controls 
  var detectEl = document.getElementById("detectElementsContainer");
  var htmlDSControlsEl = document.getElementById("htmlDSControlsContainer");
  var xmlDSControlsEl = document.getElementById("xmlDSControlsContainer");
  var firstRowOptionEl = document.getElementById("firstRowOptionContainer");
  var useColumnsOptionEl = document.getElementById("useColumnsOptionContainer");
  
  if (dsType == Spry.DesignTime.DataSet.XMLDataSetType)
  {
    if (detectEl)
    {
      detectEl.style.display = "none";
    }
    if (htmlDSControlsEl)
    {
      htmlDSControlsEl.style.display = "none";
    }
    if (xmlDSControlsEl)
    {
      xmlDSControlsEl.style.display = "block";
    }
    if (ADV_DATA_SEL_REGION)
    {
      ADV_DATA_SEL_REGION.style.display = "none";
    }
    if (firstRowOptionEl)
    {
      firstRowOptionEl.style.display = "none";
    }
    if (useColumnsOptionEl)
    {
      useColumnsOptionEl.style.display = "none";
    }
    if(PREVIEW_FIRSTSTEP_REGION.style.display = 'none')
    {
      // show the preview control if it was colapsed for the html ds type
      PREVIEW_FIRSTSTEP_REGION.style.display = 'block';
    }    
  }
  else
  {
    if (detectEl)
    {
      detectEl.style.display = "block";
    }
    if (xmlDSControlsEl)
    {
      xmlDSControlsEl.style.display = "none";
    }
    if (htmlDSControlsEl)
    {
      htmlDSControlsEl.style.display = "block";
    }
    if (firstRowOptionEl)
    {
      firstRowOptionEl.style.display = "block";
    }
    if (useColumnsOptionEl)
    {
      useColumnsOptionEl.style.display = "block";
    }
    if (SHOW_HIDE_IMG.src == "../Shared/MM/Images/up.gif")
    {
      // hide the preview control
      PREVIEW_FIRSTSTEP_REGION.style.display = 'none';
    }
    else
    {
      if (ADV_DATA_SEL_REGION)
      {
        ADV_DATA_SEL_REGION.style.display = "block";
      }
    }
  }

  initializeDesignTimeObject();
}

//--------------------------------------------------------------------
// FUNCTION:
//   browseForFile
//
// DESCRIPTION:
//   This function displays the Browse for file dialog, letting user to choose 
//  a static or dynamic file from current site.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function browseForFile()
{
  var fileSource;
   
  if (_dataSetType.getValue() == Spry.DesignTime.DataSet.XMLDataSetType)
  {
    var LABEL_XMLFILTER = (navigator.platform == "Win32") ? "XML (*.xml)|*.xml|XML|" : "XML (*.xml)|*.xml|****|";
    var theXMLFilter	= new Array(LABEL_XMLFILTER, dw.loadString("General/all files filter"));
    fileSource = dw.browseForFileURL("select_sprydataset",dw.loadString("spry/data/SelectXMLSource"),false,false,theXMLFilter);
  }
  else
  {
    fileSource = dw.browseForFileURL('select_sprydataset',dw.loadString("spry/dataset/wizard/message/SelectHTMLSource"));
  }

  if (fileSource != "")
  {
    if (fileSourceChanged(false, fileSource))
    {
      _fileSourceURL.setValue(fileSource);
      FILE_BROWSED = true;
    }
  }
  _browseButton.focus();
}

//--------------------------------------------------------------------
// FUNCTION:
//   fileSourceChanged
//
// DESCRIPTION:
//   This function handles all source file path changes. 
//
// ARGUMENTS:
//   initializeMode - boolean - some alerts will not be displayed when 
//                    it's true (especially for HTML dataset)
//   fileURL - string - the path to the chosen file or the typed URL 
//
// RETURNS:
//   (boolean) - true if the URL is valid and the triggered actions are approved 
//               by the user, false if no action need to be taken
//--------------------------------------------------------------------
function fileSourceChanged(initializeMode, fileURL)
{
  var retValue = false;
  var url = new String(fileURL);
  
  IN_PROGRESS_LOADING_FILE = true;

  if(String(PREV_FILE_SOURCE) != url)
  {
    _refreshBtn.src = REFRESH_BTN_SRC;
    _refreshBtn.disabled = false;
    
    if (url.length)
    {
      var canContinue = true;
      if (url.match(/^http(s)?:\/\//i))
      {
        // http URL schema
        if (isExternalURL(url) && !CROSS_DOMAIN_WARNING_DISPLAYED )
        {
          var displayWarning = true;
          
          if (IN_EDIT_MODE && url == DATASET_CMD_ARGS.getDataSetURL())
          {
            displayWarning = false;
          }
          if (displayWarning)
          {
            // make the don't show option site related
        		var dom = dw.getDocumentDOM();
        		var siteName = "";
        		if (dom.URL && dom.URL.length)
        		{
        			siteName = site.getSiteForURL(dom.URL);
        		}
            dwscripts.informDontShow(dw.loadString("spry/dataset/wizard/message/crossDomainWarning"), "Extensions\\Objects\\Spry Data Set Wizard", "SkipCrossDomainWarning - " + siteName);
            CROSS_DOMAIN_WARNING_DISPLAYED = true;
          }
        }  
      }
      else if (url.match(/^[\w\W]+?:\/\//i))
      {
        // if there are any other schemas entered (e.g. ftp, file, etc)
        // display an error message
        _fileSourceURL.textControl.focus();
        retValue = false;
        canContinue = false;
      }

      if (canContinue)
      {
        if (_dataSetType.getValue() == Spry.DesignTime.DataSet.XMLDataSetType)
        {
          retValue = xmlSourceChanged(url);
          // if an error occurred when the user chosen the file using the browse
          // button or by typing in the data file field, display the design time feed
          if (!retValue)
          {
            displayDesignTimeFeed(url);
            // allways set the return value to true when the prev file source is empty
            // to be able to display the chosen or typed url in the data file field
            retValue = true;
          }
          // set the PREV_FILE_SOURCE for XML type no matter what
          PREV_FILE_SOURCE = url;
        }
        else
        {
          _selectableElements.setAll([dw.loadString("spry/dataset/wizard/label/noDataContainer")], ['']);
          retValue = htmlSourceChanged(initializeMode, url);
        }
      }
        
      if (retValue)
      {
        PREV_FILE_SOURCE = url;
      }
    }
    else
    {
      _refreshBtn.src = REFRESH_BTN_DIS_SRC;
      _refreshBtn.disabled = true;
      // clear data set
      DESIGN_TIME_DS.clearDataSetContent();
      updateDSColumnNames();
      DESIGN_TIME_DS.clearPreviewCtrl();
      CONTAINER_ID = "";
      PREV_FILE_SOURCE = "";
      if (_dataSetType.getValue() == Spry.DesignTime.DataSet.XMLDataSetType)
      {
        var treeNodeContents = "";
  			if (dwscripts.IS_MAC)
  			{		
  				//for mac create an empty column node
  				treeNodeContents ="<mm:treecolumn width='300'>";
  			}
  			//set the objects innerHTML
  			_xmlSchemaTree.innerHTML = treeNodeContents;
  			_xPathExprTextField.setValue("");
      }
      else
      {
        DESIGN_TIME_DS.clearBrowserCtrl();
      }
    }
  }
  else
  {
    // the same url as the previous; do nothing
    retValue = false;
  }

  IN_PROGRESS_LOADING_FILE = false; 
  if (retValue && _dataSetType.getValue() == Spry.DesignTime.DataSet.HTMLDataSetType)
  {
    _refreshButtonContainer.style.display = "none";
    _loadingIndicatorContainer.style.display = "block";
  }

  return retValue;
}

//--------------------------------------------------------------------
// FUNCTION:
//   htmlSourceChanged
//
// DESCRIPTION:
//   This function handles all source file path changes for HTML data set type. 
//
// ARGUMENTS:
//   initializeMode - boolean - some alerts will not be displayed when 
//                    it's true (especially for HTML dataset)
//   fileURL - string - the path to the chosen file or the typed URL 
//
// RETURNS:
//   (boolean) - true if the URL is valid and the triggered actions are approved 
//               by the user, false if no action need to be taken
//--------------------------------------------------------------------
function htmlSourceChanged(initializeMode, fileURL)
{
  var retValue = true;
  
  if (!initializeMode)
  {
    // clear the data columns
    // see if there are custom columns names or custom column types
    // if so inform the user that all changes will be lost if he continue
    if (DESIGN_TIME_DS.hasCustomColumns())
    {
      var confirmStr = dw.loadString("spry/dataset/wizard/alert/change_dsFile_confirm_custom_columns").replace(/\\n/g, "\n"); 
      if (!PREV_FILE_SOURCE)
      {
        confirmStr = dw.loadString("spry/dataset/wizard/confirm/reload_dsFile_confirm_custom_columns").replace(/\\n/g, "\n");
      }
      
      if (!confirm(confirmStr))
      {
        retValue = false;
      }
    }      
  }

  if(retValue)
  {
    // when the interface is loaded in edit mode, we have a special case when we don't want to clear the dataset
    // because the introspected data set object is received as parameter
    if (PREV_FILE_SOURCE)
    {
      DESIGN_TIME_DS.clearDataSetContent();
    }
    updateDSColumnNames();
    DESIGN_TIME_DS.clearPreviewCtrl();
    DESIGN_TIME_DS.setDataSetURL(fileURL);
    // get file content asynchronously;
    // if no error occurred the OnReceiveResponseAsync function will be called 
    // when the entire content was received; this function will display the markers
    // arround the selectable elements
    var errStr = DESIGN_TIME_DS.loadURLInBrowser();
    if (errStr)
    {
      // error occurred; show message and do nothing
      alert(errStr);
      retValue = false;
    }
  }

  return retValue;
}
//--------------------------------------------------------------------
// FUNCTION:
//   xmlSourceChanged
//
// DESCRIPTION:
//   get xml schema tree and populates the tree control
//
// ARGUMENTS:
//	 none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function xmlSourceChanged(fileURL, isFromDesignTimeFeed)
{
	var bSuccess = false;

  if (!isFromDesignTimeFeed)
  {
    DESIGN_TIME_DS.setDataSetURL(fileURL);
	}
  //get the schema xml
	var elementNodes = DESIGN_TIME_DS.getSchemaString(true);  //force a refresh
	
	if ((elementNodes != null) && (elementNodes.length))
	{
	  var errorGettingSchema = DESIGN_TIME_DS.IsError();
    var initialXPath = "";
    
    if (IN_EDIT_INITIALIZE)
    {
      initialXPath = DESIGN_TIME_DS.getDataSetPath();
    }
    
    // clear previous loaded data
    DESIGN_TIME_DS.clearDataSetContent();
    DESIGN_TIME_DS.clearPreviewCtrl();
		if (!errorGettingSchema)
		{
			var parentRootElement = elementNodes[0];
			treeNodeContents = "";
			if (dwscripts.IS_MAC)
			{		
				//for mac create an empty column node
				treeNodeContents ="<mm:treecolumn width='300'>";
			}
			treeNodeContents += DESIGN_TIME_DS.buildXMLTreeContents(parentRootElement, "", initialXPath);
			//set the objects innerHTML
			_xmlSchemaTree.innerHTML = treeNodeContents;
			
      if (IN_EDIT_INITIALIZE)
      {
        // select data set node in the schema tree
        var treeNodes = _xmlSchemaTree.getElementsByTagName("MM:TREENODE");
        if (treeNodes && treeNodes.length)
        {
          var selectedNodes = new Array();
          for (var i = 0; i < treeNodes.length; i++)
          {
            if (treeNodes[i].getAttribute("xpath") == initialXPath)
            {
              treeNodes[i].setAttribute("selected", "selected");
              break;
            }
            if(treeNodes[i].getAttribute("selected"))
            {
              selectedNodes.push(treeNodes[i]);
            }
          }
          // unselect all previous selected nodes
          if (selectedNodes.length)
          {
            for (var i = 0; i < selectedNodes.length; i++)
            {
              treeNodes[i].removeAttribute("selected")
            }
          }
        }
      }
      
			buildXMLColumnList();
			bSuccess = true;
		}
		else
		{
			treeNodeContents = "";
			if (dwscripts.IS_MAC)
			{		
				//for mac create an empty column node
				treeNodeContents ="<mm:treecolumn width='300'>";
			}
			buildXMLErrorContents(elementNodes);
			//set the objects innerHTML
			_xmlSchemaTree.innerHTML = treeNodeContents;
		}
    updateDSColumnNames();
	}
	
  DESIGN_TIME_DS.displayFeedSourceNotification(_feedURLNotification);

	return bSuccess;
}

//--------------------------------------------------------------------
// FUNCTION:
//   onReceiveResponseAsync
//
// DESCRIPTION:
//   This function is called by the Design Time object after the chosen page was loaded 
//
// ARGUMENTS:
//   errStr - string - the error message received from the MMHTTP object
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onReceiveResponseAsync(errStr)
{
  if (errStr)
  {
    // clear data set
    DESIGN_TIME_DS.displayHttpStatusError(errStr);
    DESIGN_TIME_DS.clearDataSetContent();
    DESIGN_TIME_DS.clearPreviewCtrl();
    updateUI("containerID", "");
  }
  else
  {
    var selElementType;
    var arrElements = new Array();
    
    if (IN_EDIT_INITIALIZE)
    {
      var selElTagName = DESIGN_TIME_DS.getSourceElementTagName();
      
      if (selElTagName)
      {
        selElTagName = selElTagName.toLowerCase();
        // see if the selected tag is in the list of predefined values
        // if not add the value to the detect elements list and select it
        var found = false;
        for (var key in ELEMENT_TYPES)
        {
          if (dwscripts.findInArray(ELEMENT_TYPES[key], selElTagName) != -1)
          {
            _detectElements.pickValue(key);
            PREV_DETECTED_ELEMENTS = key;
            found = true;
            break;
          }
        }
        if (!found)
        {
          var arrElTypesLabels = _detectElements.get('all'); 
          var arrElTypesValues = _detectElements.getValue('all');
          
          arrElTypesLabels.splice((arrElTypesLabels.length - 1), 0, selElTagName);
          arrElTypesValues.splice((arrElTypesValues.length - 1), 0, selElTagName);
          _detectElements.setAll(arrElTypesLabels, arrElTypesValues);
          _detectElements.pickValue(selElTagName);
        }
      }
    }

    selElementType = _detectElements.getValue();
    
    if (selElementType && ELEMENT_TYPES[selElementType])
    {
      arrElements = ELEMENT_TYPES[selElementType];
    }
    else if (selElementType)
    {
      arrElements = new Array(selElementType);
    }
    
    if (arrElements)
    {
      DESIGN_TIME_DS.markAllSelectableElements(arrElements);
    }
  }
  _loadingIndicatorContainer.style.display = "none";
  _refreshButtonContainer.style.display = "block";
  if (FILE_BROWSED)
  {
    // set the focus to the browse button if it was used to select a file
    window.setTimeout(function () { _browseButton.focus(); }, 100);
    FILE_BROWSED = false;
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   onAttachMarkersFinished
//
// DESCRIPTION:
//   This function is also called by the Design Time object after all markers are in place.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onAttachMarkersFinished()
{
  var showSelectMessage = false;
  
  if (DESIGN_TIME_DS.getType() == Spry.DesignTime.DataSet.HTMLDataSetType)
  {
    if (DESIGN_TIME_DS.hasSelectableElements())
    {
      var arrElIdsLabels = DESIGN_TIME_DS.getSelectableElementsIds();
      var arrElIdsValues = new Array().concat(arrElIdsLabels); 
      arrElIdsLabels.splice(0, 0, dw.loadString("spry/dataset/wizard/label/Select_one"));
      arrElIdsValues.splice(0, 0, "");
      _selectableElements.setAll(arrElIdsLabels, arrElIdsValues);
      _selectableElements.pickValue("");
    }
    else
    {
      _selectableElements.setAll([dw.loadString("spry/dataset/wizard/label/noDataContainer")], ['']);
    }
  }  
  if (IN_EDIT_INITIALIZE)
  {
    // when the interface is opened in edit mode first time we need
    // to select the data container in the browser control
    var elementID = DESIGN_TIME_DS.getSourceElementID();
    
    if (!DESIGN_TIME_DS.selectDataContainer(elementID))
    {
      var errStr = dwscripts.sprintf(dw.loadString("spry/dataset/wizard/alert/containerElementNotFound"), elementID, DESIGN_TIME_DS.getDataSetURL());
      errStr = errStr.replace(/\\n/g, "\n");
      if (JUST_INSERT_STRUCTURE)
      {
        _wizCtrl.showStep(0);
      }
      alert(errStr);
      updateUI("containerID", "");
      IN_EDIT_INITIALIZE = false;
      showSelectMessage = true;      
    }
  }
  else
  {
    showSelectMessage = true;      
  }
  if (showSelectMessage && DESIGN_TIME_DS.hasSelectableElements())
  {
    // write message in the preview data control
    DESIGN_TIME_DS.showMessageInPreviewCtrl(dw.loadString("spry/dataset/wizard/message/selectContainer"));
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   onBeforeChangeStep
//
// DESCRIPTION:
//   This function is called when the user clicks on the next or prev buttons. Here
//  we will make sure that the user can't go to the second step from the first step
//  if he didn't select a data source.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onBeforeChangeStep()
{
  var currentStep = _wizCtrl.getCurrentStep();
  
  if (currentStep == 0)
  {
    // check if filesource is valid
    if (!_fileSourceURL.getValue())
    {
      alert(dw.loadString("spry/dataset/wizard/alert/emptyFileField"));
      return false;
    }
    if (_dataSetType.getValue() == Spry.DesignTime.DataSet.XMLDataSetType)
    {
      // see if the entered XPath is valid
      if (!setXPathNode(_xPathExprTextField.getValue()))
      {
        alert(dw.loadString("spry/dataset/wizard/message/invalidXPath"));
        return false;
      }
    }

    // check if a container was selected
    if(!DESIGN_TIME_DS.getRootElement())
    {
      var errStr;
      if (_dataSetType.getValue() == Spry.DesignTime.DataSet.XMLDataSetType)
      {
        if (DESIGN_TIME_DS.IsError())
        {
          errStr = dw.loadString("spry/dataset/wizard/alert/XMLDSErrorCantInsert").replace(/\\n/g, "\n");
        }
        else
        {
          errStr = dw.loadString("spry/dataset/wizard/alert/selectXPath");
        }
      }
      else
      {
        errStr = dw.loadString("spry/dataset/wizard/alert/selectDataContainer");
      }
      alert(errStr);
      return false;
    }
    
  }
  return true;
}


//--------------------------------------------------------------------
// FUNCTION:
//   onAfterStepChanged
//
// DESCRIPTION:
//   The Design Time object only support one DataPreview control, so after the displayed step is changed,
//  if we are going to first or second step we need to attach the correct DataPreview control
//  and update it to contain the right data.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onAfterStepChanged()
{
  var currentStep = _wizCtrl.getCurrentStep();
  var colSelectedIndex = 0;
  
  if (currentStep != 2) // 0 or 1
  {
     DESIGN_TIME_DS.clearPreviewCtrl();
    if (currentStep == 0)
    {
      DESIGN_TIME_DS.setPreviewCtrl(_dataPreviewFirstStep);
    }
    else
    {
      colSelectedIndex = _dataSetColumns.getValue();
      DESIGN_TIME_DS.setPreviewCtrl(_dataPreviewSecondStep, true);
    }
    // don't block interface if there is too much data
    window.setTimeout(function ()
      {
    DESIGN_TIME_DS.updatePreviewCtrl(colSelectedIndex);
      }, 
      100);
  }
  if (!currentStep && 
      _dataSetType.getValue() == Spry.DesignTime.DataSet.HTMLDataSetType &&
      !DESIGN_TIME_DS.getSourceElementID() && 
      DESIGN_TIME_DS.hasSelectableElements()
     )
  {
    // write message in the preview data control
    DESIGN_TIME_DS.showMessageInPreviewCtrl(dw.loadString("spry/dataset/wizard/message/selectContainer"));
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateSortColumnCtrl
//
// DESCRIPTION:
//   This function updates the sort column column names when the data set options are changed. 
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateSortColumnCtrl()
{
  var arrDSColNames = DESIGN_TIME_DS.getColumnNames();
  var arrColumnNames = new Array();
  var arrColumnValues = new Array();
  var arrLabels = new Array(dw.loadString("spry/dataset/wizard/label/none"));
  var selIndex = 0;
  var arrValues = new Array("");

  if (arrDSColNames && arrDSColNames.length)
  {
    for (var i = 0; i < arrDSColNames.length; i++)
    {
      arrColumnNames.push(arrDSColNames[i]);
      arrColumnValues.push(i);
    } 
  }

  // preserve selected index
  selIndex = _sortColumn.getIndex();
  arrLabels = arrLabels.concat(arrColumnNames);
  arrValues = arrValues.concat(arrColumnValues);
  _sortColumn.setAll(arrLabels, arrValues);

  if (selIndex != -1)
  {
    _sortColumn.setIndex(selIndex);
  }
  
  // don't update the design-time object's options if we are in the initialization of
  // the edit mode
  if (!IN_EDIT_INITIALIZE)
  { 
    if (selIndex < 1 || !arrColumnNames.length || selIndex > arrColumnNames.length)
    {
      _sortDirection.enable(false);
      // update sortColumn options in ds
      var optObj = DESIGN_TIME_DS.getOptions();
      optObj.sortOnLoad = null;
      optObj.sortOrderOnLoad = null;
      DESIGN_TIME_DS.setOptions(optObj); 
    }
    else
    {
      _sortDirection.enable(true);
      // update sortColumn options in ds
      var optObj = DESIGN_TIME_DS.getOptions();
      optObj.sortOnLoad = _sortColumn.get();
      optObj.sortOrderOnLoad = _sortDirection.getValue();
      DESIGN_TIME_DS.setOptions(optObj); 
    }
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateDSOptions
//
// DESCRIPTION:
//   This function gathers all dataset options from the interface and updates the
//  design time object.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateDSOptions()
{
  var optionsObj = DESIGN_TIME_DS.getOptions();
  // gather options
  if (_advDataSelection.getCheckedState())
  {  
    optionsObj.rowSelector = _rowSelectors.getValue();
    optionsObj.dataSelector = _colSelectors.getValue();    

    // If the data source element is a table, we want to turn off table mode
    // so that users can specify selectors for items that inside table cells.

    var selElTagName = DESIGN_TIME_DS.getSourceElementTagName();
    optionsObj.tableModeEnabled = (!selElTagName || selElTagName.toLowerCase() != "table");
  }
  else
  {
    optionsObj.rowSelector = "";
    optionsObj.dataSelector = "";

    // If no selectors are to be specified, we want to make sure table mode
    // is turned on. This will make sure that it doesn't appear in our constructor
    // code, and it makes sure that if a table is used as our source, that its data
    // is extracted as expected.

    optionsObj.tableModeEnabled = true;
  }
  optionsObj.firstRowAsHeaders = _firstRowAsHeaders.getCheckedState(); 
  optionsObj.useColumnsAsRows = _useColumnsAsRows.getCheckedState();
  optionsObj.distinctOnLoad = _distinctLoad.getCheckedState();
  optionsObj.useCache = !_dataCaching.getCheckedState();
  if (_autorefreshData.getCheckedState() && _refreshInterval.getValue())
  {
    optionsObj.loadInterval = _refreshInterval.getValue();
  }
  else
  {
    optionsObj.loadInterval = null;
  }
  var sortColumn = _sortColumn.get();
  if (_sortColumn.getIndex())
  {
    optionsObj.sortOnLoad = sortColumn;
    optionsObj.sortOrderOnLoad = _sortDirection.getValue();
  }
  else
  {
    optionsObj.sortOnLoad = null;
    optionsObj.sortOrderOnLoad = null;
  }

  DESIGN_TIME_DS.setOptions(optionsObj);
}

//--------------------------------------------------------------------
// FUNCTION:
//   setDSColumnNames
//
// DESCRIPTION:
//   This function get all column names from the interface and updates the design time
//  object. 
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function setDSColumnNames()
{
  var noOfColumns = _dataSetColumns.getLen();
  var arrColNames = null;
  
  if (noOfColumns)
  {
    arrColNames = new Array();
    for (var i = 0; i < noOfColumns; i++)
    {
      arrColNames.push(_dataSetColumns.get(i));
    }
  }

  DESIGN_TIME_DS.setColumnsNames(arrColNames);
}


//--------------------------------------------------------------------
// FUNCTION:
//   setControlsFromOptObj
//
// DESCRIPTION:
//   This function is called only on edit mode to set the controls values from the 
//  datasource received as parameter.
//
// ARGUMENTS:
//   optObj - (objects) data source options
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function setControlsFromOptObj(optObj)
{
  if (optObj)
  {
    var autorefreshDataLabel = document.getElementById("autorefreshDataLabel");
    var millisecondsLabel = document.getElementById("millisecondsLabel");
    var rowsLabel = document.getElementById("rowSelectorsLabel");
    var colsLabel = document.getElementById("colSelectorsLabel");

    if(optObj.rowSelector || optObj.dataSelector)
    {
      _advDataSelection.setCheckedState(true);
      _rowSelectors.setDisabled(false);
      _colSelectors.setDisabled(false);
      if (optObj.rowSelector)
      {
        _rowSelectors.setValue(optObj.rowSelector);
      }
      if (optObj.dataSelector)
      {
        _colSelectors.setValue(optObj.dataSelector);
      }
      rowsLabel.setAttribute("class", "enabledText");
      colsLabel.setAttribute("class", "enabledText");
    }
    _firstRowAsHeaders.setCheckedState(optObj.firstRowAsHeaders);
    _useColumnsAsRows.setCheckedState(optObj.useColumnsAsRows);
    _distinctLoad.setCheckedState(optObj.distinctOnLoad);
    
    if(optObj.useCache == false)
    {
      _dataCaching.setCheckedState(true);
      _autorefreshData.enable(true);
      if (optObj.loadInterval > -1)
      {
        _autorefreshData.setCheckedState(true);
        _refreshInterval.setDisabled(false);
        _refreshInterval.setValue(optObj.loadInterval);
        millisecondsLabel.setAttribute("class", "enabledText");  
      }
      else
      {
        millisecondsLabel.setAttribute("class", "disabledText");  
      }
      autorefreshDataLabel.setAttribute("class", "enabledText");  
    }
    else
    {
      autorefreshDataLabel.setAttribute("class", "disabledText");  
    }
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateDSColumnNames
//
// DESCRIPTION:
//   This function gets all dataset column names and populates the column names control. 
//
// ARGUMENTS:
//   None
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateDSColumnNames()
{
  // once the data was loaded we need to set all the dependent fields
  var colNamesLabel = document.getElementById("columnNameLabel");
  var colTypesLabel = document.getElementById("columnTypeLabel");
  // update dataset columns
  var columnNames = DESIGN_TIME_DS.getColumnNames();
  var columnValues = new Array();
  
  if (columnNames && columnNames.length)
  {
    for (var i = 0 ; i < columnNames.length; i++)
    {
      columnValues.push(i);
    }
    // enable column names and column types controls 
    _dataSetColumns.enable(true);
    colNamesLabel.setAttribute("class", "enabledText");
    _columnType.enable(true);
    colTypesLabel.setAttribute("class", "enabledText");
    _dataSetColumns.setAll(columnNames, columnValues);
    _dataSetColumns.setIndex(0);
    _columnType.pickValue(DESIGN_TIME_DS.getColumnType(_dataSetColumns.getValue(), true));
  }
  else
  {
    _dataSetColumns.setAll([], []);
    _dataSetColumns.object.editText = "";
    _columnType.setIndex(0);
    // disable column names and column types controls 
    _dataSetColumns.enable(false);
    colNamesLabel.setAttribute("class", "disabledText");
    _columnType.enable(false);
    colTypesLabel.setAttribute("class", "disabledText");
  }
  // update navigation controls
  updateColumnNamesNavButtons();
  // populate the sort column field
  updateSortColumnCtrl();
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateDSColumnsCtrls
//
// DESCRIPTION:
//   This function enable/disable the columns names and column types controls when
//  no column names are found in the design time object.
//
// ARGUMENTS:
//   None
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateDSColumnsCtrls()
{
  var columnNames = DESIGN_TIME_DS.getColumnNames();
  
  if (columnNames.length)
  { 
    _columnType.enable(true);
    _dataSetColumns.enable(true);
  }
  else
  {
    _columnType.enable(false);
    _dataSetColumns.enable(false);
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   insertOptSetup
//
// DESCRIPTION:
//   This function displays the commands for Insert Options customization. 
//
// ARGUMENTS:
//   optionName - string - the insert option name
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function insertOptSetup(optionName)
{
  var cmdName;
  var cmdParams = new Object(); 
  var columnNames = DESIGN_TIME_DS.getColumnNames();
  
  // select the corresponding option if is not selected
  if (_insertOptions.getValue() != optionName)
  {
    _insertOptions.pickValue(optionName);
    var insertOptButtonEl = document.getElementById(optionName + "Button");
    if (insertOptButtonEl)
    {
      insertOptButtonEl.src = IMAGES_BASE_PATH + INSERT_OPT_IMAGES[optionName].selected; 
    }
    if (PREV_INSERT_OPT)
    {
      var prevInsertOptButtonEl = document.getElementById(PREV_INSERT_OPT + "Button");
      if (prevInsertOptButtonEl)
      {
        prevInsertOptButtonEl.src = IMAGES_BASE_PATH + INSERT_OPT_IMAGES[PREV_INSERT_OPT].normal; 
      }
    }
    PREV_INSERT_OPT = optionName;
  }
  
  if (!columnNames || ! columnNames.length)
  { 
    // inform user that no columns where found
    alert(dw.loadString("spry/dataset/wizard/alert/noColumns").replace(/\\n/g, "\n"));
  }
  else
  {
    cmdParams.insertObj = null; 
    switch(optionName)
    {
        case Spry.DesignTime.DataSet.InsertStructure.SpryTable:
            cmdName = "InsertDSSpryTable.htm";
            if (INSERT_OPTIONS_OBJ && INSERT_OPTIONS_OBJ.getStructureType() == Spry.DesignTime.DataSet.InsertStructure.SpryTable)
            {
              cmdParams.insertObj = INSERT_OPTIONS_OBJ; 
            }
            break;
        case Spry.DesignTime.DataSet.InsertStructure.MasterDetail:
            cmdName = "InsertDSSpryMasterDetail.htm";
            if (INSERT_OPTIONS_OBJ && INSERT_OPTIONS_OBJ.getStructureType() == Spry.DesignTime.DataSet.InsertStructure.MasterDetail)
            {
              cmdParams.insertObj = INSERT_OPTIONS_OBJ; 
            }
            break;
        case Spry.DesignTime.DataSet.InsertStructure.StackedContainers:
            cmdName = "InsertDSStackedContainers.htm";
            if (INSERT_OPTIONS_OBJ && INSERT_OPTIONS_OBJ.getStructureType() == Spry.DesignTime.DataSet.InsertStructure.StackedContainers)
            {
              cmdParams.insertObj = INSERT_OPTIONS_OBJ; 
            }
            break;
        case Spry.DesignTime.DataSet.InsertStructure.SpotlightColumn:
            cmdName = "InsertDSSpotlightColumn.htm";
            if (INSERT_OPTIONS_OBJ && INSERT_OPTIONS_OBJ.getStructureType() == Spry.DesignTime.DataSet.InsertStructure.SpotlightColumn)
            {
              cmdParams.insertObj = INSERT_OPTIONS_OBJ; 
            }
            break;
    }
    
    cmdParams.designTimeObj = DESIGN_TIME_DS;
    
    // open the expanded view command and send it the DesignTime data set object
    var retObj = dwscripts.callCommand(cmdName, cmdParams);

    if (retObj)
    {
      INSERT_OPTIONS_OBJ = retObj;
    }
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   showHidePreviewSection
//
// DESCRIPTION:
//   This function shows/hides the data preview control from the first step.
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function showHidePreviewSection()
{
  if (PREVIEW_FIRSTSTEP_REGION)
  {
    if(PREVIEW_FIRSTSTEP_REGION.style.display == "none")
    {
      PREVIEW_FIRSTSTEP_REGION.style.display = 'block';
      ADV_DATA_SEL_REGION.style.display = 'block';
      _chooseContainerCtrl.className = "browserElementNormal";
      SHOW_HIDE_IMG.src = "../Shared/MM/Images/down.gif";
      SHOW_HIDE_IMG.alt = dw.loadString("spry/dataset/wizard/alt/collapsePreviewCtrl");
    }
    else
    {
      PREVIEW_FIRSTSTEP_REGION.style.display = 'none';
      ADV_DATA_SEL_REGION.style.display = 'none';
      _chooseContainerCtrl.className = "browserElementExpanded";
      SHOW_HIDE_IMG.src = "../Shared/MM/Images/up.gif";
      SHOW_HIDE_IMG.alt = dw.loadString("spry/dataset/wizard/alt/expandPreviewCtrl");
    }
    SHOW_HIDE_IMG.focus();
  }

}

//--------------------------------------------------------------------
// FUNCTION:
//   isExternalURL
//
// DESCRIPTION:
//   This function determines if the entered URL has the same domain name as the 
//  Testing Server domain.
//
// ARGUMENTS:
//   strURL - string - entered URL
//
// RETURNS:
//   (boolean) - true if entered URL and the Testing Server have the same domain, false otherwise
//--------------------------------------------------------------------
function isExternalURL(strURL)
{
  var retValue = false;
  var testingURL = site.getAppURLPrefixForSite();
  var domainRegExp = /https?:\/\/([^/]+)\/?/i;
  var arrMatches;
  var testingDomain;
  var urlDomain;
  var testingDomain;
  
  if (strURL)
  {
    if (testingURL)
    {
      arrMatches = testingURL.match(domainRegExp);
      if (arrMatches && arrMatches[1])
      {
        testingDomain = arrMatches[1];
        arrMatches = strURL.match(domainRegExp);
        if (arrMatches && arrMatches[1])
        {
          urlDomain = arrMatches[1];
          if (urlDomain.indexOf(testingDomain) == -1)
          {
            retValue = true;
          }
        }
      } 
    }
  }

  return retValue;
}

//--------------------------------------------------------------------
// FUNCTION:
//   disableInsertOptions
//
// DESCRIPTION:
//   This function disable the insert options from the third step when the command
//  is in the edit mode. 
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function disableInsertOptions()
{
  var optionsList = _insertOptions.radioObject;
  
  if (optionsList.length)
  {
    for(var i = 0; i < optionsList.length - 1; i++)
    {
      var optValue = optionsList[i].value;
      
      optionsList[i].disabled = true;
      // disable image button
      var imgEl = document.getElementById(optValue + "Button");
      if (imgEl)
      {
        imgEl.disabled = true;      
      }
      // disable setup button
      var setupEl = document.getElementById(optValue + "SetUp");
      if (setupEl)
      {
        setupEl.disabled = true;      
      }
    }
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateColumnNamesNavButtons
//
// DESCRIPTION:
//   This function enable/disable the prev/next buttons next to the column names control. 
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateColumnNamesNavButtons()
{
  var colNamesNo = _dataSetColumns.getLen();
  var leftSrc = LEFT_ARROW_DIS_SRC;
  var rightSrc = RIGHT_ARROW_DIS_SRC;
  var leftDisabled = true;
  var rightDisabled = true;
  
  if (colNamesNo > 1)
  {
    var colSelIdx = _dataSetColumns.getIndex();
    if (colSelIdx)
    {
      leftSrc = LEFT_ARROW_SRC;
      leftDisabled = false
      if (colSelIdx < (colNamesNo - 1))
      {
        rightSrc = RIGHT_ARROW_SRC;
        rightDisabled = false;
      }
    }
    else
    {
      rightSrc = RIGHT_ARROW_SRC;
      rightDisabled = false;
    }
  }

  _prevColumnName.src = leftSrc; 
  _prevColumnName.disabled = leftDisabled;
  _nextColumnName.src = rightSrc;
  _nextColumnName.disabled = rightDisabled;
}

/************************ XML only functions **************************/

//--------------------------------------------------------------------
// FUNCTION:
//   buildXMLColumnList
//
// DESCRIPTION:
//   build column list for the XML data set
//
// ARGUMENTS:
//	 none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function buildXMLColumnList(dontUpdateXPath)
{
  if (_xmlSchemaTree.selectedNodes[0] != null)
  {
	  var xPathRef = _xmlSchemaTree.selectedNodes[0].getAttribute("xpath");
	  
	  if (xPathRef && xPathRef.length)
	  {
      if (!dontUpdateXPath)
      {
    		//set the value to xpath expression
    		_xPathExprTextField.setValue(xPathRef);
      }
      
      if (!IN_EDIT_INITIALIZE || !DESIGN_TIME_DS.getDataSetPath())
      {
  		  DESIGN_TIME_DS.setDataSetPath(xPathRef);
  		}
  		DESIGN_TIME_DS.loadDataIntoDataSet();
      DESIGN_TIME_DS.updatePreviewCtrl();
      updateDSColumnNames();
	  }
	  else
	  {
			_xPathExprTextField.setValue("");
	  }
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   buildXMLErrorContents
//
// DESCRIPTION:
//   build error contents for error nodes
//
// ARGUMENTS:
//	 none
//
// RETURNS:
//   nothing
 //--------------------------------------------------------------------
function buildXMLErrorContents(errorList)
{
	var iconVal = "stop"; //stop icon
	for (var i=0; i < errorList.length ; i++)
	{
		var anErrorNode = errorList[i];
		if (anErrorNode && anErrorNode.getAttribute("errortype") == "fatalError")
		{
			var errorStr = anErrorNode.innerHTML;
			//remove the CDATA marker
			var cDataBeginIndex = errorStr.indexOf("<![CDATA[");
			var cDataEndIndex   = errorStr.lastIndexOf("]]>");
			if ((cDataBeginIndex != -1) && (cDataEndIndex != -1))
			{	
				cDataBeginIndex+=9; //size of <![CDATA[
				errorStr = errorStr.substring(cDataBeginIndex,cDataEndIndex);
			}
			var errorLineNum = anErrorNode.getAttribute("linenum");
			var errorColNum  = anErrorNode.getAttribute("colnum");
			if (errorLineNum.length && errorColNum.length)
			{
				errorStr += "(";
				errorStr += errorLineNum;
				errorStr += ",";
				errorStr += errorColNum;
				errorStr += ")";
			}
			treeNodeContents += '<MM:TREENODE state="expanded" ' + 'icon="' + iconVal  + '" value="' + errorStr +  '"' +'>';  
			treeNodeContents += '</MM:TREENODE>'
		}
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   validateXMLDataAndChangedFields
//
// DESCRIPTION:
//   validates the data
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function validateXMLDataAndChangedFields()
{
	var bIsValid = true;

	//check if the user edited the dataset name or the feed
	if (IN_EDIT_MODE && DATASET_CMD_ARGS.getType() == Spry.DesignTime.DataSet.XMLDataSetType)
	{
		//still valid, check for if feeds differ
		var origDSFeed   =  DATASET_CMD_ARGS.getDataSetURL();
		var editedDSFeed = _fileSourceURL.getValue();
		if (origDSFeed != editedDSFeed)
		{
			if (confirm(MM.MSG_Spry_XMLFeed_DataReferences) == false)
			{
				bIsValid = false;				
			}
			return bIsValid;
		}
		if (bIsValid)
		{
			//still valid, check for if xpath differ
			var origPathRef   = DATASET_CMD_ARGS.getDataSetPath();
			var editedPathRef = _xPathExprTextField.getValue();

			if (origPathRef != editedPathRef)
			{
				if (confirm(MM.MSG_Spry_XPath_DataReferences) == false)
				{
					bIsValid = false;				
				}
				return bIsValid;
			}
		}
	}

	return bIsValid;
}

//--------------------------------------------------------------------
// FUNCTION:
//   displayDesignTimeFeed
//
// DESCRIPTION:
//   dsiplays design time feed
//
// ARGUMENTS:
//   fileUrl - (string) xml source
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function displayDesignTimeFeed(fileUrl)
{
	//launch the spry design time feed
	var bContinue = false;
  var dsType = _dataSetType.getValue();
	var bIsValid = validateDataForDesignTimeFeed();
  	
	if (bIsValid)
	{
	
		var dsName = _dsName.getValue();
		var oldDesignTimeFeedURI = DESIGN_TIME_DS.getDesignTimeSchemaURI();

		var fileSource = (fileUrl) ? fileUrl : _fileSourceURL.getValue();
		var cmdArgs = new Array();
		cmdArgs[0] = _dsName.getValue();
		cmdArgs[1] = fileSource;
		cmdArgs[2] = DESIGN_TIME_DS;
		
		var resArray = dwscripts.callCommand("SpryDesignTimeFeed", cmdArgs);
		if (resArray && resArray.length)
		{
			bContinue = (resArray == "true");
		}
		
    // update controls only if there is an xml file specified 
		if (bContinue && fileSource) 
		{
			var newDesignTimeFeedURI = DESIGN_TIME_DS.getDesignTimeSchemaURI();
			if (oldDesignTimeFeedURI != newDesignTimeFeedURI)
			{
				//try to get schema again since the user could have supplied
				//an updated copy of design time
  		  if (dsType == Spry.DesignTime.DataSet.HTMLDataSetType)
  		  {
  				bContinue = htmlSourceChanged(false, DESIGN_TIME_DS.getDataSetURL());
        }
        else
        {
  				bContinue = xmlSourceChanged(newDesignTimeFeedURI, true);
        }
			}
		}
	}

	return bContinue;
}

//--------------------------------------------------------------------
// FUNCTION:
//   validateDataForDesignTimeFeed
//
// DESCRIPTION:
//   validates the data
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function validateDataForDesignTimeFeed()
{
	var bIsValid = true;
	var dsName    = _dsName.getValue();
	
  if (dsName.length == 0)
	{
		bIsValid = false;
		alert(MM.MSG_DefineASpryDSName);
	}	

  if(bIsValid && !dwscripts.isValidVarName(dsName))
  {
    bIsValid = false;
    errStr = dw.loadString("spry/dataset/wizard/alert/invalidDSName").replace(/\\n/g, "\n");
		alert(errStr);
	}

	return bIsValid;
}

//--------------------------------------------------------------------
// FUNCTION:
//   setXPathNode
//
// DESCRIPTION:
//   sets the xpath node to be selected based on xpath value
//
// ARGUMENTS:
//   xPathValue - (string) XPath expression
//
// RETURNS:
//   (boolean) - true if xpath expression match exactly
//--------------------------------------------------------------------
function setXPathNode(xPathValue)
{
	var treeNodesList = _xmlSchemaTree.treeNodes;
	var xpathMatch = false;
	
	if (xPathValue && xPathValue.length)
	{
    //trim the xPathRef
    xPathValue = ajaxUtils.trimXPath(xPathValue);
	}
	for (var i=0; i < treeNodesList.length; i++)
	{
    if (treeNodesList[i].getAttribute("xpath") == xPathValue)
    {
      var selectedNodeArray = new Array();
      selectedNodeArray.push(treeNodesList[i]);
      _xmlSchemaTree.selectedNodes = selectedNodeArray;
      xpathMatch = true;
      break;
    }
	}
	
	return xpathMatch;
}



//--------------------------------------------------------------------
// FUNCTION:
//   onUnload
//
// DESCRIPTION:
//   This function is called when the command it's closed. Here we will remove 
//  all temporary files generated by the command 
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function onUnload()
{
  var list = DWfile.listFolder(dw.getTempFolderPath() + "/" + Spry.DesignTime.DataSet.BrowserNotifyFrameSrc + "*", "files");
  if (list)
  {
    for (var i = 0; i < list.length; i++)
    {
      // remove the temporary created file
      DWfile.remove(dw.getTempFolderPath() + "/" + list[i]);
    }
  }
}

// Register the on enter hit event to prevent the dialog to close
document.documentElement.addEventListener("DWDialogOk", function(e){ e.preventDefault(); } , true);
document.documentElement.addEventListener("DWDialogCancel", function(e){ window.close(); } , true);


