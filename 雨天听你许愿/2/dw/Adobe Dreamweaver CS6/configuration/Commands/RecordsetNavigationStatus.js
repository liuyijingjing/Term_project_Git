// Copyright 2000, 2001, 2002, 2003, 2004 Macromedia, Inc. All rights reserved.

//*************** GLOBALS  *****************

var MODEL_IS_CF = (dw.getDocumentDOM().serverModel.getServerName() == "Cold Fusion");
var m_Recordset = "";
var helpDoc = MM.HELP_objRecordsetStatistics;

//******************* API **********************

function commandButtons()
{
   return new Array( MM.BTN_OK, "okClicked()",
                     MM.BTN_Cancel, "window.close()",
                     MM.BTN_Help, "displayHelp()");
}


function canInsertObject()
{
  var retVal = true;
  
  var errMsgStr = "";
  
  if (dwscripts.getRecordsetNames().length == 0) 
  { 
    errMsgStr = dwscripts.sprintf(MM.MSG_NeedRecordsetForObject, dwscripts.getRecordsetDisplayName());
  }
  
  if (errMsgStr)
  {
    alert (errMsgStr);
    retVal = false;
  }
  
  return retVal;
}
 
//***************** LOCAL FUNCTIONS  ******************

function initializeUI() {

  var errMsg ="";

  //Display the example text
  var spanObj = findObject("exampleSpan");
  if (spanObj)
  {
  spanObj.innerHTML = MM.LABEL_RSNavExampleText;
  }

  //Build Recordset menu
  LIST_RS = new ListControl("Recordset");
  var rsNames = dwscripts.getRecordsetNames();
  LIST_RS.setAll(rsNames,rsNames);

  if (LIST_RS.object)
  {
    LIST_RS.object.focus();
  }
}


function okClicked() {
  var dataOkay = getDataFromUI();
  if (dataOkay) {
     applyRecordsetStats();
     window.close();
  }
}


function applyRecordsetStats() {
  var DEBUG = false;

  fixUpSelection(dreamweaver.getDocumentDOM());

  if (DEBUG) var debugMsg="COMPOUND SB OBJECT TEST:\n";

  var paramObj = new Object();
  var sbObj = null;

  //create new, empty custom group
  var customGroup = new Group();

  //set the recordset
  paramObj.rsName = m_Recordset;
  paramObj.rs = m_Recordset;

  var rsStatsGroup = new Group("Recordset Statistics");
  
  customGroup.addParticipants(rsStatsGroup.getParticipants("aboveHTML"));

  customPart = new Participant("rsStats_display");

  customGroup.addParticipants(Array(customPart));   

  var displayStats_participant = rsStatsGroup.getParticipants("replaceSelection");

  paramObj.bindingName = "first";
  var firstDisplayStr = displayStats_participant[0].getInsertString(paramObj, "replaceSelection");
  if(firstDisplayStr && firstDisplayStr.length)paramObj.firstStatistics = firstDisplayStr;
    
  paramObj.bindingName = "last";
  var lastDisplayStr = displayStats_participant[0].getInsertString(paramObj, "replaceSelection");
  if( lastDisplayStr && lastDisplayStr.length) paramObj.lastStatistics = lastDisplayStr;

  paramObj.bindingName = "total";
  var totalDisplayStr = displayStats_participant[0].getInsertString(paramObj, "replaceSelection");
  if(totalDisplayStr && totalDisplayStr.length) paramObj.totalStatistics = totalDisplayStr;

  var charSet = "";
  if (dw.getDocumentDOM())
    charSet = dw.getDocumentDOM().getCharSet();
  charSet = charSet.toLowerCase();
  if (charSet == "iso-8859-1") {
    paramObj.beforeFirst = entityNameEncode(MM.LABEL_RSNavBeforeFirst);
    paramObj.beforeLast  = entityNameEncode(MM.LABEL_RSNavBeforeLast);
    paramObj.beforeTotal = entityNameEncode(MM.LABEL_RSNavBeforeTotal);
    paramObj.afterTotal  = entityNameEncode(MM.LABEL_RSNavAfterTotal);
  } else {
    paramObj.beforeFirst = MM.LABEL_RSNavBeforeFirst;
    paramObj.beforeLast  = MM.LABEL_RSNavBeforeLast;
    paramObj.beforeTotal = MM.LABEL_RSNavBeforeTotal;
    paramObj.afterTotal  = MM.LABEL_RSNavAfterTotal;		
  }	
  setMoveToParamsForJsp(paramObj);
  

  customGroup.apply(paramObj, sbObj);

}

function getDataFromUI()
{
  m_Recordset  = LIST_RS.getValue();
  if(m_Recordset != "") {
    return true;
  } else {
    alert(MM.MSG_invalidRS);
    return false;
  }
}
