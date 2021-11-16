// Copyright 2001-2007 Adobe Systems Incorporated.  All rights reserved.

//*************** GLOBALS VARS *****************

var helpDoc = MM.HELP_ssCommandAsp;

var CONST_TYPE = "command";
var NUM_Participants = 1;  //used to check completeness. If a participant
                           //is missing, set the .incomplete property
curCommandType = -1
var contentsArray = new Array() //used to save the param grid
contentsArray[0] = new Array()
contentsArray[1] = new Array()
contentsArray[2] = new Array()
contentsArray[3] = new Array()
contentsArray[4] = new Array()

//These globals are used for SQL parsing
var CONST_UPDATE = "UPDATE"
var CONST_SET = "SET"
var CONST_WHERE = "WHERE"
var CONST_DELETE = "DELETE FROM"
var CONST_INSERT = "INSERT INTO"
var CONST_VALUES = "VALUES"

var VAR_UPD_UPDATE = ""
var VAR_UPD_SET = ""
var VAR_UPD_WHERE = ""
var VAR_DEL_DELETE = ""
var VAR_DEL_WHERE = ""
var VAR_INS_INSERT = ""
var VAR_INS_COLS = ""
var VAR_INS_VALUES = ""
var VAR_PROC = ""

var WGHT_AspCommandInit = 40;
var WGHT_AspCommand = 50;
var DEBUG = false;
var FOR_TEST = 1
var FINAL = 2

var InsertLabelArray
var UpdateLabelArray
var DeleteLabelArray
var ProcLabelArray

var ButtonArray = new Array()


function findServerBehaviors() {
	var ssRecList = new Array();
	var sbFileName = dwscripts.getSBFileName();

	if (sbFileName == "Command.htm") {
		// Find old type Commands
		var ssRec;
		var dom = dw.getDocumentDOM();
		var nodes = dom.getElementsByTagName("MM_COMMAND");
		for (var i=0; i<nodes.length; i++) {
			ssRec = buildSSRecord(nodes[i]);
			if (ssRec) ssRecList.push(ssRec); //add record to the array
		}
	} else {
		// Find new type Commands
		var newTypeCmd = dwscripts.findSBs();
		for (var i=0; i<newTypeCmd.length; i++) {
			newTypeCmd[i].title = MM.LABEL_TitleCommand + " (" + newTypeCmd[i].parameters.cdName + ")";
			newTypeCmd[i].type = CONST_TYPE;
			newTypeCmd[i].commandText = newTypeCmd[i].parameters.sql.replace(/(?:^"|"\s*$)/gi, "");
			newTypeCmd[i].connectionName = newTypeCmd[i].parameters.cname;
			newTypeCmd[i].cdName = newTypeCmd[i].parameters.cdName;
			newTypeCmd[i].prepared = newTypeCmd[i].parameters.prepared;
			newTypeCmd[i].commandtype = newTypeCmd[i].parameters.commandtype;
			newTypeCmd[i].commandTimeout = newTypeCmd[i].parameters.commandTimeout;
			if( newTypeCmd[i].parameters.rsName )
			{
			   newTypeCmd[i].recordset = newTypeCmd[i].parameters.rsName;
			}
			   
			newTypeCmd[i].ParamArray = new Array();	//newTypeCmd[i].parameters.ParamArray;
			if (newTypeCmd[i].parameters.paramName) {
				
				for (var j=0; j<newTypeCmd[i].parameters.paramName.length; j++)
				{
					var cmdRec = newTypeCmd[i];
					
					var paramName = cmdRec.parameters.paramName[j];
					paramName = paramName.replace(/^@/, "");
	
					var thisParam = new Object();
					thisParam.name = cmdRec.parameters.paramName[j];
					thisParam.type = cmdRec.parameters.paramType[j];
					thisParam.size = cmdRec.parameters.paramSize[j];
					thisParam.direction = cmdRec.parameters.paramDirection[j];
					thisParam.value = getValue( cmdRec, paramName );
					thisParam.runTime = getValue( cmdRec, paramName, false, true);
					newTypeCmd[i].ParamArray.push(thisParam);
					newTypeCmd[i].commandText = newTypeCmd[i].commandText.replace(/\?/i, newTypeCmd[i].parameters.paramName[j]);
				}
			}
		}
		ssRecList = ssRecList.concat(newTypeCmd);
	}

	return ssRecList; //empty means there are none here yet
}

//*-------------------------------------------------------------------
// FUNCTION:
//   canAddPartToGroup
//
// DESCRIPTION:
//   This function is used to override the standard matching
//   function used in findSBs
//
//   For Cold Fusion we need to do special checks for the 
//   cfparam variable tags.  Multiple ones of these can belong to
//   each behavior.
//
// ARGUMENTS:
//   groupedPartList - a list of parts in the current group
//   part - the part we are testing for compatibility with the
//          groupedPartList
//   partList - the list of all the found parts for this server behavior
//
// RETURNS:
//   boolean or null - null means use the standard matching function,
//      true means include this part in the given group, false means
//      don't include this part in the given group
//--------------------------------------------------------------------
function canAddPartToGroup(partGroup, part, partList) {
  var retVal = null;
  
  if (part.participantName == "recordset_variable") {
	  retVal = false;
  }
  else if (part.participantName == "Command2_variable") {
    retVal = isPartOfRecordset(partGroup, part);
  }
  
  return retVal;
}

//*-------------------------------------------------------------------
// FUNCTION:
//   isPartOfRecordset
//
// DESCRIPTION:
//   Checks if the given part belongs to the recordset_main particiapnt
//
// ARGUMENTS: 
//   groupedPartList - the part list containing the participants in
//                     the group
//   part - the part to match
//
// RETURNS:
//   boolean - true if it belongs, false otherwise
//--------------------------------------------------------------------
function isPartOfRecordset(partGroup, part) {
  var retVal = false;
  
  for (var i=0; i < partGroup.length; i++) {
	 if (partGroup[i].participantName.match(/Command2_main/i) && 
		part.parameters.cdName == partGroup[i].parameters.cdName) {
      retVal = true;
      break;
    }
  }
  
  return retVal;
}

function getParticipantWithVarname(ss, varName)
{
	if (!varName) return;
	if (varName[0] == '"') return;
	for (var i=0; i < ss.sbParticipants.length; i++) 
	{
		if( ss.sbParticipants[i].parameters && ss.sbParticipants[i].parameters.varName == varName )
			return  ss.sbParticipants[i];
	}
	
	return;
}

function getValue(ss, varName, useFullVarName, getRuntime){
	if (!varName) return "";
	if (varName[0] == '"') return varName;
	if (!ss.parameters.varName) return varName;
	
	var val = "";
	var paramVarName = "";
	var part = getParticipantWithVarname(ss, varName);
	
	if( part )
	{
		if( getRuntime && part.parameters.runtimeValue){
			  val = part.parameters.runtimeValue;
		}
		else if(part.parameters.defaultValue){
			  val = part.parameters.defaultValue;
		}
	}
	else if( typeof ss.parameters.varName == 'string' )
	{
		if( useFullVarName )
		  paramVarName = ss.parameters.cdName + "__" + ss.parameters.varName;
		else
		  paramVarName = ss.parameters.varName;
		
		if( varName == paramVarName )
		{
			if( getRuntime && ss.parameters.runtimeValue){
			  val = ss.parameters.runtimeValue;
			}
			else if(ss.parameters.defaultValue){
			  val = ss.parameters.defaultValue;
			}
		}
	}
	else
	{
		for( var i = 0; i < ss.parameters.varName.length ; i++ )
		{
			if( useFullVarName )
		      paramVarName = ss.parameters.cdName + "__" + ss.parameters.varName[i];
		    else
			  paramVarName = ss.parameters.varName[i];
			
			if( getRuntime && ss.parameters.runtimeValue[i]){
			  val = ss.parameters.runtimeValue[i];
			  break;
			}
			else if(ss.parameters.defaultValue[i]){
			  val = ss.parameters.defaultValue[i];
			  break;
			}
		}
	}
	return val;
}

function analyzeServerBehavior(sbObj, allRecs) {
 if (sbObj.cdName == "MM_editCmd") {
   sbObj.deleted = true;
 }
}


function buildSSRecord(node) {
  var cdName = String(node.getAttribute("NAME"))
  if (cdName != "undefined")
  {
    ssRec = new SSRecord();
    ssRec.errorMsg = "";
    ssRec.type  = CONST_TYPE;
    ssRec.title = MM.LABEL_TitleCommand + " (" + cdName + ")";

    ssRec.cdName      = cdName;
    ssRec.objectName    = cdName;
    ssRec.activeconnection  = unescape(node.getAttribute("ACTIVECONNECTION"));
    ssRec.commandtype   = node.getAttribute("COMMANDTYPE");
    ssRec.commandText   = node.getAttribute("COMMANDTEXT");
    if (node.getAttribute("PREPARED") == "true")
    {
      ssRec.prepared = true;
    }
    else
    {
      ssRec.prepared = false;
    }
    ssRec.commandTimeout  = node.getAttribute("COMMANDTIMEOUT");

    //check if this is a new connection
    var match = ssRec.activeconnection.match(/MM_(\w+)_STRING/);
    if (match && match.length > 0) {
      ssRec.connectionName = match[1];
      ssRec.activeconnection = MMDB.getConnectionString(ssRec.connectionName);      
    } else {    
      connectionName       = getConnectionName(ssRec.activeconnection);
      ssRec.connectionName = connectionName;
      ssRec.outOfDate = true;
      ssRec.title += MM.LABEL_OutOfDate;
    }

    var ConnectionInfo    = getConnectionInfo(ssRec.activeconnection)
    if (ConnectionInfo.length > 0)
    {
      ssRec.dsn    =  ConnectionInfo[0];
      ssRec.username =  ConnectionInfo[1];
      ssRec.password =  ConnectionInfo[2];
    }
    else
    {
      //using an existing connection.
    }
    ssRec.participants.push(node);
    ssRec.weights.push(WGHT_AspCommand);
    ssRec.types.push("command_main");
    ssRec.selectedNode = node;


    var allParameterPresent = true;

    if (node.hasChildNodes())
    {

      if (!ssRec.ParamArray)
        ssRec.ParamArray = new Array();

       var parameterValueNode=null;

       dom = dw.getDocumentDOM();
      
       nameValueNodes = dom.getElementsByTagName("MM_VARIABLES");
       for (j=0; j<nameValueNodes.length; j++) { //with each MM_VARIABLES node
        nameValueNode = nameValueNodes[j];
        if (nameValueNode && nameValueNode.getAttribute("NAME") == ssRec.cdName)
        {
          parameterValueNode=nameValueNode;
          break;
        }
       }
 
        var allParameterPresent = true;
        var paramchilds =0; 

        for (i = 0;i < node.childNodes.length; i++)
        {
          thisParam = node.childNodes[i];
          if (thisParam.tagName == "MM_PARAMETER")
          {
            paramchilds++;
            
            if (ssRec.commandtype == 4)
            {
              if ((thisParam.DIRECTION == 2) || (thisParam.DIRECTION == 4))
              {
                var Param   = new Object();
                Param.name    = thisParam.NAME;
                Param.type    = thisParam.TYPE;
                Param.direction = thisParam.DIRECTION;
                Param.size    = thisParam.SIZE;
                Param.value   = "";
                Param.runTime = "";
                ssRec.ParamArray[ssRec.ParamArray.length]=Param;
                
                continue;
              }
              else
              {
                name = Trim(thisParam.VARNAME);
              }
            }
            else
              name = Trim(thisParam.NAME);

            if (parameterValueNode)
            {
              for (j =0; j < parameterValueNode.childNodes.length;j++)
              {
                 ValueNode = parameterValueNode.childNodes[j];
                 pname = Trim(ValueNode.getAttribute("NAME"));
                 if (name == pname)
                 {
                  var Param = new Object();
                  var re = /(\w+)__(\w+)/i;
                  index = name.search(re);
                  if (index != -1)
                  {
                    if (ssRec.commandtype == 4)
                    {
                      Param.name =  thisParam.NAME //RegExp.$2;
                    }
                    else
                    {
                      Param.name =  RegExp.$2;
                    }
                    Param.value = ValueNode.getAttribute("VALUE");
                    value = String(ValueNode.getAttribute("VALUE"));
                    //value = value.replace(/%22/g,"\"");
                    value = unescape(value)
                    value = GetValueFromEncoding(value, dw.getDocumentDOM().serverModel.getServerLanguage())
                    Param.value = value;
                    runTime = String(ValueNode.getAttribute("RUNTIME"));
                    //runTime = runTime.replace(/%22/g,"\"");
                    runTime = unescape(runTime)
                    Param.runTime = runTime;
                    Param.size = "-1";
                    Param.type = "-1";
                    if (ssRec.commandtype == 4)
                    {
                      Param.type    = thisParam.TYPE
                      Param.direction = thisParam.DIRECTION;
                      Param.size    = thisParam.SIZE;
                    }
                    ssRec.ParamArray[ssRec.ParamArray.length]=Param;
                    
                    // If we have parameters surrounded by single quotes => remove them because the
                    // parameter-like SQLs don't need them.
                    paramRegExp = new RegExp("'" + Param.name + "'", "gi");
                    ssRec.commandText = ssRec.commandText.replace(paramRegExp, Param.name);
                  }
                 }
              }
            }
          }
          else if(thisParam.tagName == "MM_CMDRECSET")
          {
            ssRec.recordset = thisParam.getAttribute("NAME");
          }
        }

        if (parameterValueNode)
        {
          ssRec.participants.push(parameterValueNode);
          ssRec.weights.push(WGHT_AspCommandInit);
          ssRec.types.push("command_param");
        }
        allParameterPresent = (paramchilds == ssRec.ParamArray.length);
    }
 
    ssRec.incomplete = (ssRec.participants.length < NUM_Participants) || (!allParameterPresent);
    
    if (!ssRec.outOfDate) {
      //look for the connection statement
      var found = false;
      var part = new Participant("connectionref_statement");
      //NOTE: dw.getParticipants will only find participants that are
      //      part of a server behavior group file whose find is triggered.
      //      We can use this call here, because the search patterns for
      //      recordset will be triggered by the Command runtime code.
      var partList = dw.getParticipants("connectionref_statement");
      for (var i=0; partList && i < partList.length; i++) {
        if (partList[i].parameters.cname == ssRec.connectionName) {
          //add this part to the ssRec
          ssRec.participants.push(partList[i].participantNode);
          ssRec.weights.push(part.location);
          ssRec.types.push(part.name);
          ssRec.parameters = new Object();
          ssRec.parameters.cname = partList[i].parameters.cname;
					ssRec.parameters.urlformat = partList[i].parameters.urlformat;
          ssRec.parameters.relpath = partList[i].parameters.relpath;
          ssRec.parameters.ext = partList[i].parameters.ext;

          //check if the path is correct, if the file is saved
          var dom = dw.getDocumentDOM();
          if (dom && dom.URL && partList[i].parameters.relpath != getConnectionsPath(partList[i].parameters.cname,partList[i].parameters.urlformat)) {
            ssRec.incomplete = true;
            ssRec.errorMsg += "\n"+MM.MSG_ConnectionPathInvalid;
          }

          found = true;
          break;
        }
      }
      if (!found) ssRec.incomplete = true;
    }
    
  }


//debug stuff
/*
  if (ssRec.ParamArray)
  {
    strOut = "Param Vals: \n\n"
    for (var i = 0; i < ssRec.ParamArray.length; i++)
    {
      strOut += "\nparam " + i + ": " + ssRec.ParamArray[i].type 
    } 
    alert(strOut)
  }
  else
  {
    alert("no param array")
  }*/
//end debug stuff

  return ssRec;
}


function GetValueFromEncoding(strIn, serverLang)
{
  var value = strIn

  if (serverLang  == "JavaScript") 
  {
    value = value.replace(/\\"/ig, "\"") // decode  \"
  }
  else
  {
    value = value.replace(/"\s*\+\s*Chr\(34\)\s*\+\s*"/ig, "\"") // decode  " + Chr(34) + "
  }

  //now take off the quotes on the ends

  if (value.length > 1)
  {
    value = value.substring(1, value.length - 1)
  }

  return value
}

function applyServerBehavior(priorRec) 
{
  var errMsg = CheckData(FINAL, priorRec) 

  if (errMsg == "")
  {
    var theName     = GetName();
    var theDSN      = CONN_LIST.getValue();
    var theUsername   = GetUsername();
    var thePassword   = GetPassword();
    var theParamArray = GetParamArray();
    var theCommandType  = TYPE_LIST.getValue();
    switch (theCommandType)
    {
      case 1:
      case 2:
      case 3:
        theCommandType = 1;
        break;
      default:
        theCommandType = 4;
    }
    var theCommandText    = GetCommandText(theName, theParamArray, theCommandType);
    var theResultSet    = RR_CHECKBOX.checked;
    var theResultSetName  = null;
    if (theResultSet)
    {
      theResultSetName = RR_NAME.value;
    }
    var theConnectionString = getConnectionString(theDSN);  
    if (priorRec)
    {
      var theCommandTimeOut = priorRec.commandTimeout;
      var thePrepared     = priorRec.prepared;
    }
    else
    {
      var theCommandTimeOut = GetCommandTimeOut();
      var thePrepared     = GetPrepared();
    }
    
    if (theCommandType == 4) {
	    var editList = buildSSEdits(priorRec, theName, theDSN, theConnectionString, theCommandText, theCommandType, theCommandTimeOut, thePrepared, theResultSetName, theParamArray);
	    editList.insert(true);
	        //refresh the cache for command.
	    MMDB.refreshCache(true);
	} else {
		var paramObj = new Object();
		paramObj.cname = theDSN;
		paramObj.cdName = theName;
		paramObj.prepared = thePrepared;
		paramObj.commandtype = theCommandType;
		paramObj.commandTimeout = theCommandTimeOut;
		
		if (priorRec != null) {
			//get the existing url format from the current server behavior
			paramObj.urlformat = priorRec.parameters.urlformat;
			if ((priorRec.parameters.relpath != null) && (priorRec.parameters.relpath[0]=='/')) {
				//set the urlformat to virtual
				paramObj.urlformat = "virtual";
			}
		} else {
			//get the default url format
			paramObj.urlformat = getConnectionsUrlFormat(dw.getDocumentDOM());
		}
		paramObj.relpath = getConnectionsPath(paramObj.cname, paramObj.urlformat);
		paramObj.ext = getServerExtension();
		paramObj.sql = theCommandText;
		paramObj.ParamArray = theParamArray;
		getParametersFromParamArray(paramObj);
	
		applyChanges(priorRec, paramObj);
	}
  }

  return errMsg;
}

function getParametersFromParamArray(paramObj) {
	var variable;
	var tempObj;
	for (var i=0; i<paramObj.ParamArray.length; i++) {
		tempObj = new Object();
		tempObj.cdName = paramObj.cdName;
		tempObj.variableName = paramObj.ParamArray[i][0]
		variable = extPart.getInsertString("", "commandVariable", tempObj);
//		variable = paramObj.cdName + "__" + paramObj.ParamArray[i][0];
		FieldTypes.addParameterToStructure(paramObj,
						paramObj.ParamArray[i][0],	// Name
						getSQLTypeAsNum(paramObj.ParamArray[i][1]),	// Type
						paramObj.ParamArray[i][2],	// Size
						paramObj.ParamArray[i][3],	// Runtime value
						paramObj.ParamArray[i][3],	// True value
						variable					// Default value
					);
	}
	
  //set the variable arrays
  if (paramObj.varName == null) {
        paramObj.varName = new Array();
      }
    
  if (paramObj.defaultValue == null) {
        paramObj.defaultValue = new Array();
      }

  if (paramObj.runtimeValue == null) {
        paramObj.runtimeValue = new Array();
      }
	
}

function applyChanges(priorRec, paramObj) {
	if (priorRec && (priorRec.name != "Command2")) {
		deleteServerBehavior(priorRec);
		priorRec = null;
	}
    dwscripts.applySB(paramObj, priorRec, "Command2.htm");
}

function checkBoxClicked()
{
  if (RR_CHECKBOX.checked && TYPE_LIST.getValue() == 4)
  {
    SetEnabled(TEST_BUTTON, true)
  }
  else
  {
    //toggleEnablement(TEST_BUTTON)
    SetEnabled(TEST_BUTTON, false)
  }
}

function getConnectionInfo(connectionString)
{
  var ConnectionInfo = new Array();

  var re = /dsn\s*=\s*(\w+)\s*;uid\s*=\s*(\w+)\s*;pwd\s*=\s*(\w+)\s*/i;

  if (connectionString.length)
  {
    var index = connectionString.search(re);
    if (index != -1)
    {
      ConnectionInfo[0] = RegExp.$1;
      ConnectionInfo[1] = RegExp.$2;
      ConnectionInfo[2] = RegExp.$3;
    }
  }

  return ConnectionInfo;
}

//This function returns a Connection Object with ConnectionProperties
function getConnectionName(ConnectionString)
{
  return MMDB.getConnectionName(ConnectionString);
}

//This function returns a Connection Object with ConnectionProperties
function getConnectionString(connectionName)
{
  //return "\""+ MMDB.getConnectionString(connectionName) + "\"";
  return "MM_" + connectionName + "_STRING";
}

function buildSSEdits(priorRec, theName, theDSN, theConnectionString, theCommandText, theCommandType, theCommandTimeOut, thePrepared, theResultSetName, theParamArray) 
{
  var editList = new SSEdits();
  
  var priorInitNode = null;
  var priorPrimaryNode = null;
  if (priorRec) {
    priorPrimaryNode = priorRec.getParticipant("Command2_main");
    priorInitNode = priorRec.getParticipant("Command2_variable");
  }
  
  
  //insert the connection include if necessary
  var connectionRef = new Participant("connectionref_statement");
  var paramObj = new Object();
  paramObj.cname = theDSN;    
	if (priorRec != null)
	{
	  //get the existing url format
		paramObj.urlformat = priorRec.parameters.urlformat;
	}
	else
	{
	  //get a default url format
		paramObj.urlformat = getConnectionsUrlFormat(dw.getDocumentDOM());
	}
  paramObj.relpath = getConnectionsPath(paramObj.cname,paramObj.urlformat);
  paramObj.ext = getServerExtension();
    
    
  //special case the update of connection_ref, to prevent multiple
  // connection statements from being created
  if (priorRec && 
      (priorRec.parameters.relpath != paramObj.relpath ||
       priorRec.parameters.ext != paramObj.ext) &&
      priorRec.parameters.cname == paramObj.cname) {
    priorRec.MM_forcePriorUpdate = "connectionref_statement";
  }
  
	var bAddConnectionChunk = true;
	var partList = dw.getParticipants("connectionref_statement");
	for (var j=0; partList && j < partList.length; j++) {
		if (partList[j].parameters.cname == paramObj.cname) {
			bAddConnectionChunk = false;
			break;
		}
	}

	//if we don't have a connection add it
	if (bAddConnectionChunk)
	{
		connectionRef.apply(editList,paramObj, priorRec);
	}
  
  
  var newInit = getInit(priorInitNode, theName, theParamArray, theCommandType);
  if (priorInitNode || newInit.length)
  {
    editList.add(newInit, priorInitNode, WGHT_AspCommandInit);
  }
  
  var newPrimary = getPrimary(priorPrimaryNode, theName, theConnectionString, theCommandText, theCommandType, theCommandTimeOut, thePrepared, theResultSetName, theParamArray);
  if (priorPrimaryNode || newPrimary.length)
  {
    editList.add(newPrimary, priorPrimaryNode, WGHT_AspCommand);
  }

  return editList;
}

function getInit(node, theName, theParamArray, theCommandType)
{
  var serverLang  = dw.getDocumentDOM().serverModel.getServerLanguage();
  var init = "";
  if (theParamArray.length)
  {
    for (var i=0; i < theParamArray.length; i++)
    {
      var paramName = StripChars("@", theParamArray[i][0])

      if (theCommandType == 4)
      {
        var paramDefaultValue = theParamArray[i][4];
        var paramRExpression = theParamArray[i][5];
      }
      else
      {
        var paramDefaultValue = "";
        var paramRExpression = theParamArray[i][1];
      }

      if (serverLang == "VBScript")
      {
        paramDefaultValue = "\"" + paramDefaultValue.replace(/"/g, "\" + Chr(34) + \"") + "\"";
        if (theCommandType == 4)
          var param = MASK_AspVBParam;
        else
          var param = MASK_AspVBActionParam;
      }
      else
      {
        paramDefaultValue = "\"" + paramDefaultValue.replace(/"/g, "\\\"") + "\"";
        if (theCommandType == 4)
          var param = MASK_AspJSParam;
        else
          var param = MASK_AspJSActionParam;
      }
      if (theCommandType == 4)
      {
        var paramDirection = theParamArray[i][2];
        if ((paramDirection == 2) || (paramDirection == 4))
        { 
          //ignore the initialization chunk for that parameter
          continue;
        }
      }
      param = param.replace(/##pname##/g, paramName);
      param = param.replace(/##pvalue##/g, paramDefaultValue);
      param = param.replace(/##rexpression##/g, paramRExpression);
      param = param.replace(/##cdname##/g, theName);
      init = init + param;
    }
    if (init.length)
    {
      init = "\n<%\n" + init + "\n%>\n";
    }
  }

  return init;
}

function getPrimary(node, theName, theConnectionString, theCommandText, theCommandType, theCommandTimeOut, thePrepared, theResultSetName, theParamArray)
{
  if (node)
  {
    var primary = getOrigForLockedNode(node);
    primary = updatePrimary(primary, theName, theConnectionString, theCommandText, theCommandType, theCommandTimeOut, thePrepared, theResultSetName, theParamArray);
  }
  else
  {
    var serverLang  = dw.getDocumentDOM().serverModel.getServerLanguage();
    var primary = (serverLang == "JavaScript") ? MASK_AspJSCommand : MASK_AspVBCommand;
    primary = primary.replace(/##theConnection##/g,theConnectionString);
    primary = primary.replace(/##theCommandText##/g,theCommandText);
    primary = primary.replace(/##theCommandType##/g,theCommandType);
    primary = primary.replace(/##theCommandTimeout##/g,theCommandTimeOut);
    primary = primary.replace(/##thePrepared##/g,thePrepared);

    //Stored Procedure case where we use the 
    //Create Parameter methods.
    if (theCommandType == 4) 
    {
      primary += getParameters(theName, theParamArray);
    }

    if (theResultSetName) 
    {
      var rs = (serverLang == "JavaScript")? MASK_AspJSRSCommand : MASK_AspVBRSCommand;
      rs += (serverLang == "JavaScript")? MASK_AspJSCommand_NumRows : MASK_AspVBCommand_NumRows;
      rs  =  rs.replace(/##rsname##/g, theResultSetName);
    } 
    else 
    {
      var rs = (serverLang == "JavaScript")? MASK_AspJSCommandExec : MASK_AspVBCommandExec;
    }
    primary += rs;
    primary = "\n<%\n" + primary + "\n%>\n"
    primary = primary.replace(/##cdname##/g, theName);
  }

  return primary;
}

function getParameters(theName, theParamArray)
{
  var parameters = "";
  for (var i =0; i < theParamArray.length; i++)
  {
    var origParamName   =  theParamArray[i][0];
    var paramName       =  StripChars("@", origParamName);
    var paramType     =  theParamArray[i][1]; 
    var paramDirection    =  theParamArray[i][2]; 
    var paramSize     =  theParamArray[i][3]; 

    var param = MASK_AspSQLCallParam;

    if (dw.getDocumentDOM().serverModel.getServerLanguage() == "JavaScript")
    {
      //check for out and ret values;
      if ((paramDirection == 2) || (paramDirection == 4))
      {
        if (paramSize)
        {
          param = MASK_AspSQLJSCallWithSizeParam;
        }
        else
        {
          param = MASK_AspSQLJSCallParam;
        }
      }
      else
      {
        param = MASK_AspSQLJSCallInParam;
      }
    }
    else
    {
      if ((paramDirection == 2) || (paramDirection == 4))
      {
        if (paramSize)
        {
          param = MASK_AspSQLVBCallWithSizeParam;
        }
        else
        {
          param = MASK_AspSQLVBCallParam;
        }
      }
      else
      {
        param = MASK_AspSQLVBCallInParam;
      }
    }
    
    param = param.replace(/##cdname##/g, theName);
    param = param.replace(/##origpname##/g, origParamName);
    param = param.replace(/##pname##/g, paramName);
    param = param.replace(/##type##/g, paramType);
    param = param.replace(/##direction##/g, paramDirection);
    param = param.replace(/##size##/g, paramSize);
    parameters += param;
  }

  return parameters;
}

function updatePrimary(primary, theName, theConnectionString, theCommandText, theCommandType, theCommandTimeOut, thePrepared, theResultSetName, theParamArray)
{
  var serverLang  = dw.getDocumentDOM().serverModel.getServerLanguage();
  var lineEnd = (serverLang == "JavaScript") ? ";" : "";
  var setStmt = (serverLang == "JavaScript") ? "var" : "";
  var re = /(<%|[\r\n]+)(\s*\w+\s*)(\w+)(\s*=\s*server\.createobject\(\s*"adodb\.command"\s*\))/gi;
  if (primary.search(re) != -1)
  {
    // update recordset name
    primary = primary.replace(re, RegExp.$1 + RegExp.$2 + theName + RegExp.$4);
    var theOldName = RegExp.$3;
    var propOrMethod = theOldName + "(\\.)";
    re = new RegExp(propOrMethod, "g");
    if (primary.search(re) != -1)
    {
      primary = primary.replace(re, theName + RegExp.$1);
    }
    propOrMethod = theOldName + "_";
    re = new RegExp(propOrMethod, "g");
    if (primary.search(re) != -1)
    {
      primary = primary.replace(re, theName + "_");
    }
    // The values of the following two arrays must appear in the same order as the parameters to this function
    if (serverLang == "JavaScript")
    {
      var masksArry = new Array(MASK_AspJSCommand_ActiveConnection, 
                  MASK_AspJSCommand_CommandText, 
                  MASK_AspJSCommand_CommandType, 
                  MASK_AspJSCommand_CommandTimeout, 
                  MASK_AspJSCommand_Prepared);
    }
    else
    {
      // VBScript
      var masksArry = new Array(MASK_AspVBCommand_ActiveConnection, 
                  MASK_AspVBCommand_CommandText, 
                  MASK_AspVBCommand_CommandType, 
                  MASK_AspVBCommand_CommandTimeout, 
                  MASK_AspVBCommand_Prepared);
    }
    var propOrMethodArry = new Array("ActiveConnection", "CommandText", "CommandType", "CommandTimeout", "Prepared");
    for (var i = 0; i < propOrMethodArry.length; i++)
    {
      propOrMethod = "([\\r\\n]+\\s*)" + theName + "(\\." + propOrMethodArry[i] + "\\s*=[ \\f\\r\\t\\v]+)([^\x0D\x0A]+)";
      re = new RegExp(propOrMethod, "gi");
      if (primary.search(re) != -1)
      {
        primary = primary.replace(re, RegExp.$1 + theName + RegExp.$2 + updatePrimary.arguments[2+i] + lineEnd);
      }
      else
      {
        // Add non-existant property after the createObject
        if (updatePrimary.arguments[2+i]) {
          var newProperty = masksArry[i];
          if (newProperty.search(/\n$/) == -1)
          {
            newProperty += "\n";
          }
          newProperty = newProperty.replace(/##cdname##/, theName);
          newProperty = newProperty.replace(/##\w+##/, updatePrimary.arguments[2+i]);
          re = /(<%|[\r\n]+)(\s*\w+\s*\w+\s*=\s*server\.createobject\(\s*"adodb\.command"\s*\)[^\x0D\x0A]+)(\s*)/i;
          if (primary.search(re) != -1)
          {         
            primary = primary.replace(re, RegExp.$1 + RegExp.$2 + RegExp.$3 + newProperty);
          }
        }
      }
    }
    // Update the optional recordset name
    var oldResultsetName = null;
    propOrMethod = "(\\w+)\\s*=\\s*" + theName + "\\.execute";
    re = new RegExp(propOrMethod, "i");
    if (primary.search(re) != -1)
    {
      oldResultsetName = RegExp.$1;
    }
    if (theResultSetName != oldResultsetName)
    {
      if (oldResultsetName && oldResultsetName.length)
      {
        propOrMethod = "(" + setStmt + "\\s+)" + oldResultsetName + "(\\s*=\\s*)";
        re = new RegExp(propOrMethod, "gi");
        if (primary.search(re) != -1)
        {
          if (theResultSetName && theResultSetName.length)
          {
            primary = primary.replace(re, RegExp.$1 + theResultSetName + RegExp.$2);
            // update global recordset var
            propOrMethod = "(" + setStmt + "\\s+)" + oldResultsetName + "_";
            re = new RegExp(propOrMethod, "gi");
            if (primary.search(re) != -1)
            {
              primary = primary.replace(re, RegExp.$1 + theResultSetName + "_");
            }
          }
          else
          {
            primary = primary.replace(re, "");
            //remove extra line for Recordset global var
            var patt = (serverLang == "JavaScript")? PATT_AspJSCommand_NumRows : PATT_AspVBCommand_NumRows;
            primary = primary.replace(RegExp(patt), "");
          }
        }
      }
      else
      {
        propOrMethod = theName + "(\\.Execute)";
        re = new RegExp(propOrMethod, "gi");
        if (primary.search(re) != -1)
        {
          if (theResultSetName && theResultSetName.length)
          {
            primary = primary.replace(re, setStmt + " " + theResultSetName + " = " + theName + RegExp.$1);
            //add extra line for Recordset global var
            var newChunk = (serverLang == "JavaScript")? MASK_AspJSCommand_NumRows : MASK_AspVBCommand_NumRows;
            newChunk = newChunk.replace(/##rsname##/,theResultSetName);
            primary = primary.replace(/\%>/, newChunk + "\%>");
          }
        }
      }   
    }
    if (theParamArray)
    {
      // regenerate the CreateParameters();
      propOrMethod = theName + "\\.Parameters.Append\\s*\\(?\\s*" + theName + "\\.CreateParameter[^\x0D\x0A]+[\x0D\x0A]{1,2}";
      re = new RegExp(propOrMethod, "gi");
      if (primary.search(re) != -1)
      {
        primary = primary.replace(re, "");
      }
      //do the create parameter in case when type =4.
      if (theCommandType == 4)
      {
        var newParams = getParameters(theName,theParamArray);
        if (newParams.length)
        {
          // insert after the commandText
          propOrMethod = "(" + theName + ".CommandText\\s*=[^\x0D\x0A]+)";
          re = new RegExp(propOrMethod, "gi");
          if (primary.search(re) != -1)
          {
            primary = primary.replace(re, RegExp.$1 + newParams);
          }
        }
      }
    }
  }

  return primary;
}

//Passed the function call above, takes prior arguments and reloads the UI.
//Removes any escape characters "\"

function inspectServerBehavior(ssRec) {

  //COMMAND_TEXT.value    = ssRec.commandText;
  CD_NAME_BOX.value   = ssRec.cdName;

  var ind = -1

  CONN_LIST.pickValue(ssRec.connectionName);

  var insertRE = /^\s*insert/i
  var updateRE = /^\s*update/i
  var deleteRE = /^\s*delete/i

  if (ssRec.commandText.search(insertRE ) > -1)
  {
    TYPE_LIST.pickValue(3);
    ind = 3
    parseInsertSQL(ssRec.commandText);
  }
  else if (ssRec.commandText.search(updateRE ) > -1)
  {
    TYPE_LIST.pickValue(2);
    ind = 2
    parseUpdateSQL(ssRec.commandText);
  }
  else if (ssRec.commandText.search(deleteRE ) > -1)
  {
    ind = 1
    TYPE_LIST.pickValue(1);
    parseDeleteSQL(ssRec.commandText);
  }
  else
  {
    TYPE_LIST.pickValue(4);
    ind = 4
    parseProcedureSQL(ssRec.commandText);
  }

  TypeChanged(ind);

  TREE.setConnection(ssRec.connectionName)

  if (ssRec.recordset)
  {
    RR_CHECKBOX.checked = true;
    RR_NAME.value = ssRec.recordset;
  }


  var list = PARAM_LIST;
  
  if (ssRec.ParamArray)
  {
    for (i = 0;i < ssRec.ParamArray.length; i++)
    {
      var thisParam = ssRec.ParamArray[i];
      var thisRow = new Array()
      if (ssRec.commandtype == 4)
      {

        thisRow[0] = thisParam.name
        thisRow[1] = getSQLTypeAsString(thisParam.type)
        thisRow[2] = GetDirString(thisParam.direction)
        thisRow[3] = thisParam.size
        //alert("setting default val to >>" + thisParam.value + "<<")
        thisRow[4] = thisParam.value
        thisRow[5] = thisParam.runTime
      }
      else
      {
        thisRow[0] = thisParam.name
        thisRow[1] = (thisParam.type == -1) ? "-1" : getSQLTypeAsString(thisParam.type).toString();
        thisRow[2] = thisParam.size
        thisRow[3] = thisParam.runTime
      }

      contentsArray[ind].push(thisRow)
    }

    if (contentsArray[ind].length > 0)
    {
      PARAM_LIST.setContents(contentsArray[ind])
    }
  }

  PARAM_LIST.setIndex(0)
  checkBoxClicked() //updates the test button
  
  if (ssRec.outOfDate) {
    alert(MM.MSG_SBOutOfDate);
  }
  if (ssRec && ssRec.errorMsg) {
    alert(ssRec.errorMsg);
  }
}



function GetDirString(dirNum)
{
  var a = new Array()

  a[1] = "in"
  a[2] = "out"
  a[3] = "in/out"
  a[4] = "RETURN_VALUE"

  if (!a[dirNum])
    alert(errMsg(MM.MSG_DirNum,dirNum));

  return a[dirNum]
}

function GetDirNum(dirString)
{
  var a = new Array()

  a["in"] = 1
  a["out"] = 2
  a["in/out"] = 3
  a["RETURN_VALUE"] = 4
  
  if (!a[dirString])
    alert(errMsg(MM.MSG_DirString,dirString));

  return a[dirString]
}



function deleteServerBehavior(ssRec) 
{
  if (ssRec && ssRec.del) {
  	ssRec.del();
  } else {
	  dwscripts.deleteSB(ssRec);
  }

  //refresh the cache for command.
  removeCachedSchemaInfo(ssRec.cdName);
  if (ssRec.recordset)
  {
  removeCachedSchemaInfo(ssRec.recordset);
  }
  MMDB.refreshCache(true);

  return true;
}



function CheckData(reason, priorRec)
{
  /*
  This function checks all of the input variables to see
  if the user has filled out everything okay...if not
  return an error string.  If so, return empty string
  */

  var strOut = ""

  if (reason == FOR_TEST)
  {
    if (TYPE_LIST.getValue() != 4 || !RR_CHECKBOX.checked)
    {
      return "Must be sp and check box must be checked..." +
        "this shouldn't appear since the button should be disabled."
    }
  }

  if (reason == FINAL)
  {
    // we don't get here if we are just testing the statement
    var theName = Trim(CD_NAME_BOX.value)
    if (theName == "")
    {
      strOut += MM.MSG_MissingCommandName;
      return strOut
    }

    if (!IsValidVarName(theName))
    {
      strOut = MM.MSG_InvalidCommandName
      return strOut
    }

    var priorName = null
    if(priorRec)
    {
      priorName = priorRec.cdName
    }

    if (IsDupeObjectName(theName, priorName))
    {
      return MM.MSG_DupeCommandName
    }


    if (IsReservedWord(theName))
    {
      return dwscripts.sprintf(MM.MSG_ReservedWord, theName);
    }
  
  }

  if (CONN_LIST.getIndex() == 0)
  {
    strOut += MM.MSG_NoConnection;
    return strOut
  }
  
  if (TYPE_LIST.getIndex() == 0)
  {
    strOut += MM.MSG_MissingCommandType;
    return strOut
  }

  if (RR_CHECKBOX.checked)
  {
    if (TYPE_LIST.getValue() != 4)
    {
      return MM.MSG_OnlyAnSPCanReturnARecordset
    }

    if (reason == FINAL)
    {
      var rsName = Trim(RR_NAME.value)
      if (StripChars(" \t\r\n", rsName) == "")
      {
        return MM.MSG_NoRecordsetName
      }

      if (!IsValidVarName(rsName))
      {
        strOut = MM.MSG_InvalidRecordsetName
        return strOut
      }

      var priorName = null
      if(priorRec)
      {
        priorName = priorRec.recordset
      }

      if (IsDupeObjectName(rsName, priorName))
      {
        return MM.MSG_DupeRecordsetName
      }

      if (rsName == theName)
      {
        return MM.MSG_CommandAndRecordsetDiffNames
      }
    }
  }

  var theSQL =  COMMAND_TEXT.value
  if (StripChars(" \r\n\t", theSQL) == "")
  {
    strOut += MM.MSG_MissingCommandText
    return strOut
  }

  var theType = TYPE_LIST.getValue()
  if (theType == 3 /*insert*/)
  {
    if (theSQL.search(/^\s*insert\b/i) == -1)
    {
      return MM.MSG_NotValidCommandTextForInsert
    }
  }
  else if (theType == 2 /*update*/)
  {
    if (theSQL.search(/^\s*update\b/i) == -1)
    {
      return MM.MSG_NotValidCommandTextForUpdate
    }
  }
  else if (theType == 1 /*delete*/)
  {
    if (theSQL.search(/^\s*delete\b/i) == -1)
    {
      return MM.MSG_NotValidCommandTextForDelete
    }
  }
  else if (theType != 4)
  {
    return "Whoops...this shouldn't appear. They selected a type that wasn't 1 thru 4?"
  }

  var pa = PARAM_LIST.getContents()
  if (pa.length > 0)
  {   
    if (theType != 4)
      strOut = CheckSQLParams(pa, theSQL, reason)
    else
      strOut = CheckSPParams(pa, reason)
  }

  return strOut
}


function CheckSQLParams(pa, theSQL, reason)
{
  var strOut = ""



  for (var i = 0; i < pa.length; i++)
  {
    var anOption = pa[i]

    var theName = Trim(anOption[0])
    if (theName == "")
    {
      strOut =  strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_MissingParamName
      return strOut
    }
    if (!IsValidVarName(theName))
    {
      strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + theName + "\n\n" + MM.MSG_InvalidParamName
      return strOut
    }
    else
    {
      var re = new RegExp("\\b" + theName + "\\b", "g");
      if (theSQL.search(re) == -1)
      {
        strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + theName + "\n\n" + MM.MSG_InvalidParamNameNotInSQL
        return strOut
      }
    }
/*
    var theDefaultVal = Trim(anOption[1])
    if (theDefaultVal == "")
    {
      strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_DefaultValMissing + theName
      return strOut
    }
*/  

    if (reason == FINAL)
    {
      var theSQLType = Trim(anOption[1])
      if (theSQLType == "")
      {
        return MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_MissingSQLType + theName
      }
      
      var theSQLType = anOption[1];
	  if (theSQLType.toString().match(/^\w/gi)) {
		  theSQLType = getSQLTypeAsNum(theSQLType, true);
	  }
      if (!theSQLType.toString().match(/^\d+$/gi))
      {
        return MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_InvalidSQLType + theName
      }

      var theDefaultVal = Trim(anOption[2])
      if (theDefaultVal == "")
      {
        strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_MissingSizeVal + theName
        return strOut
      }

      var theRunTimeVal = Trim(anOption[3])
      if (theRunTimeVal == "")
      {
        strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_RunTimeValMissing + theName
        return strOut
      }
    }
  } 

  return ""
}


function CheckSPParams(pa, reason)
{
  var strOut = ""

  //debug stuff
  /*
  strOut = "Contents of array:\n"
  for (var i = 0; i < pa.length; i++)
  {
    strOut += "\n" 
    var thisRow = pa[i]
    for (var j = 0; j <  thisRow.length; j++)
    {
      if (j > 0)
        strOut += "*"
      strOut += thisRow[j]
    }
  }
  alert(strOut)
  */
  //end debug stuff


  for (var i = 0; i < pa.length; i++)
  {
    var anOption = pa[i]
    
    var theName = Trim(anOption[0])
    if (theName == "")
    {
      strOut =  strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_MissingParamName
      return strOut
    }

    var theType = Trim(anOption[2])  //type is in,out,inout...
    if (theType == "")
    {
      return MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_MissingDirection + theName
    }

    var theType = GetDirNum(anOption[2])

    
/*
    if (!IsValidVarName(theName))
    {
      strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + theName + "\n\n" + MM.MSG_InvalidParamName
      return strOut
    }
*/

    if (reason == FINAL)
    {
      var theSQLType = Trim(anOption[1])
      if (theSQLType == "")
      {
        return MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_MissingSQLType + theName
      }
    }

    if (reason == FINAL && (theType == 1 || theType == 3))
    {
      var theDefaultVal = Trim(anOption[3])
      if (theDefaultVal == "")
      {
        strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_MissingSizeVal + theName
        return strOut
      }
    }

/*
    var theDefaultVal = Trim(anOption[4])
    if (theDefaultVal == "" && (theType == 1 || theType == 3))
    {
      strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_DefaultValMissing + theName
      return strOut
    }
*/

    if (reason == FINAL)
    {
      var theRunTimeVal = Trim(anOption[5])
      if (theRunTimeVal == "" && (theType == 1 || theType == 3))
      {
        strOut = MM.LABEL_ParamRow + (i + 1) + "\n\n" + MM.MSG_RunTimeValMissing + theName
        return strOut
      }
    } 
  }

  return ""
}

function GetName()
{
  /*
  Returns the name the user entered in the form
  */
  return Trim(CD_NAME_BOX.value)
}


function GetUsername()
{
  /*
  Returns the username the user provided in the
  form.
  */

  return Trim(findObject("userName").value)
}

function GetPassword()
{
  /*
  Returns the password the user provided in the
  form
  */

  return Trim(findObject("password").value)
}

function GetCommandText(cdName,ParamArray,theCommandType)
{
  /*
  This function looks at the list of params and
  creates a SQL string that has variables in it.
  For example: If there is a parameter called
  "@Name" and a SQL statement that looks like
  "Select * from table where name = 'Name'",
  this function will output
  "Select * from table where name = '" + Command1_Name + "'"
  (Note: the double quotes at the ends of the string are not 
  included in the output)
  */
   var ServerBehaviorLanguage = dw.getDocumentDOM().serverModel.getServerLanguage();

  var theSQL = COMMAND_TEXT.value
  theSQL = theSQL.replace(/\n/g,"");
  theSQL = theSQL.replace(/\r/g," ")

/*  if (ServerBehaviorLanguage == "JavaScript")
  {
    theSQL = theSQL.replace(/\n/g,"\\n");
    theSQL = theSQL.replace(/\r/g,"\\r");
  }
  else
  {
    theSQL = theSQL.replace(/\r/g,"\" + Chr(13) + Chr(10) + \"");
    theSQL = theSQL.replace(/\n/g,"");
  }*/

  if ((theCommandType == 4) || (ParamArray.length == 0))
  {
    return "\"" + theSQL + "\"";
  }


  //there were params
  for (i = 0; i < ParamArray.length; i++)
  {
    var ParamName = ParamArray[i][0];
    var ParamRe = new RegExp("\\b" + ParamName + "\\b","ig");

    if (dw.getDocumentDOM().serverModel.getServerLanguage() == "JavaScript")
    {
      var sqlparam = MASK_AspSQLJSParam;
      sqlparam = sqlparam.replace(/##cdname##/g,cdName);
      sqlparam = sqlparam.replace(/##pname##/g,ParamName);
      theSQL = theSQL.replace(ParamRe, "?" /*sqlparam*/)
    }
    else
    {
      var sqlparam = MASK_AspSQLVBParam;
      sqlparam = sqlparam.replace(/##cdname##/g,cdName);
      sqlparam = sqlparam.replace(/##pname##/g,ParamName);
      theSQL = theSQL.replace(ParamRe, "?" /*sqlparam*/)
    }
  }

                    
  // If we have parameters surrounded by single quotes => remove them because the
  // parameter-like SQLs don't need them.
  theSQL = theSQL.replace(/'\?'/gi, "?");

  return "\"" + theSQL + "\"";
}


function GetPrepared()
{
  return true;
}

function GetCommandTimeOut()
{
  return 0;
}

function GetParamArray()
{
  var ParamArray = PARAM_LIST.getContents();
  if (TYPE_LIST.getValue() == 4 /*sp*/)
  {
    // convert direction string to a number
    // and sql type to a number
    for (var i = 0; i < ParamArray.length; i++)
    {
      ParamArray[i][2] = GetDirNum(ParamArray[i][2])
      ParamArray[i][1] = getSQLTypeAsNum(ParamArray[i][1])
    }
  }

  return ParamArray;
}


function PopulateConnectionList()
{
  var oldConn = CONN_LIST.getValue()

  var connList = MMDB.getConnectionList()
  
  var wholeList = new Array()

  wholeList.push(MM.LABEL_None)
  for (var i = 0; i < connList.length; i++)
  {
    wholeList.push(connList[i])
  }

  CONN_LIST.setAll(wholeList, wholeList)
  CONN_LIST.setValue(MM.LABEL_None, 0)

  var index = CONN_LIST.getIndex(oldConn)

  if (!CONN_LIST.pickValue(oldConn)) 
  {
    if (CONN_LIST.getLen() == 2) 
    { 
      CONN_LIST.setIndex(1)
      ConnectionChanged()
    }
    else
    {
      CONN_LIST.setIndex(0)
    }
  }
  else
  {
    //the database tree ctrl could be populated
    //already... so, it needs to be refreshed. The tree control will not 
    //refresh itself if the connection passed in is the same, so set it 
    //to a dummy value and then re-set the original connection. This will
    //force it to update the meta-data.
    TREE.setConnection("");
    TREE.setConnection(oldConn);
  }
}


function PopulateTypeList()
{
  TYPE_LIST.add(MM.LABEL_None,0);
  TYPE_LIST.add(MM.LABEL_CTStoredProc,4);
  TYPE_LIST.add(MM.LABEL_CTInsert,3);
  TYPE_LIST.add(MM.LABEL_CTUpdate,2);
  TYPE_LIST.add(MM.LABEL_CTDelete,1);
  TYPE_LIST.setIndex(0)
}

function TypeChanged(commandType)
{
  var ind = Number(commandType)

  //save off the param grid
  if (curCommandType != -1)
  {
    contentsArray[curCommandType] = PARAM_LIST.getContents()
    ParseCurrentData(curCommandType)
  }

  PARAM_LIST.delAll();

  if (commandType == 4/*adStoredProc*/)
  {
    PARAM_LIST.setColumns(MM.LABEL_SPColumns);
    if (RR_CHECKBOX.checked)
    {
      SetEnabled(TEST_BUTTON, true)
    } else {
      SetEnabled(TEST_BUTTON, false)
    }
    DisplayProcedureStatement()
  }
  else
  { 
    switch(commandType)
    {
    case 1: DisplayDeleteStatement()
        break
    case 2: DisplayUpdateStatement()
        break
    case 3: DisplayInsertStatement()
        break
    case 0: NoStatement()
        DisableAllButtons()
        break
    default: break
    }
    PARAM_LIST.setColumns(MM.LABEL_SQLColumns);
    SetEnabled(TEST_BUTTON, false)
  }

  curCommandType = ind

  //populate from the saved array
  if ( contentsArray[ind].length > 0 )
  {
    PARAM_LIST.setContents(contentsArray[ind])
  }

}

function OnTypeChanged()
{
  TypeChanged(TYPE_LIST.getValue());
}

function initializeUI()
{
  /*
  This function is called in the onLoad event.  It is responsible
  for initializing the UI.  If we are inserting a recordset, this
  is a matter of populating the connection drop down.

  If we are modifying a recordset, this is a matter of inspecting
  the recordset tag and setting all the form elements.
  */

  //Create global vars for all controls
  CONN_LIST   = new ListControl("ConnectionList")
  PARAM_LIST    = new GridControl("ParamList")
  COMMAND_TEXT  = findObject("theCommandText")
  TREE_SEL_BOX  = findObject("TreeSelection")
  CD_NAME_BOX   = findObject("commandName")
  MINUS_BUTTON  = findObject("minusButton")
  //TREE      = findObject("DBTree")
  TREE      = new DBTreeControl("DBTree")
  //USERNAME    = findObject("Username")
  //PASSWORD      = findObject("Password")
  RR_CHECKBOX   = findObject("RResultset");
  RR_NAME     = findObject("RResultsetName");
  TYPE_LIST   = new ListControl("TypeList")
  TEST_BUTTON   = findObject("testButton")
  PLUS_BUTTON   = findObject("plusButton")
  
  ButtonArray.push("ColumnButton1")
  ButtonArray.push("ColumnButton2")
  //ButtonArray.push("ParamButton1") //Param buttons have been removed.
  //ButtonArray.push("ParamButton2")

  //Param buttons have been removed.....
  //InsertLabelArray = new Array(MM.LABEL_AddToColumn, "", MM.LABEL_AddToValue, "")
  //UpdateLabelArray = new Array(MM.LABEL_AddToSet, MM.LABEL_AddToWhere, MM.LABEL_AddToSet, MM.LABEL_AddToWhere )
  //DeleteLabelArray = new Array(MM.LABEL_AddToDelete, MM.LABEL_AddToWhere, MM.LABEL_AddToWhere, "")
  //ProcLabelArray = new Array(MM.LABEL_AddProc, "", "", "")

  InsertLabelArray = new Array(MM.LABEL_AddToColumn, "")
  UpdateLabelArray = new Array(MM.LABEL_AddToSet, MM.LABEL_AddToWhere)
  DeleteLabelArray = new Array(MM.LABEL_AddToDelete, MM.LABEL_AddToWhere)
  ProcLabelArray = new Array(MM.LABEL_AddProc, "")

  
  PopulateConnectionList();
  PopulateTypeList();
  CD_NAME_BOX.value = CreateNewName()
  DisableAllButtons();
  SetEnabled(TEST_BUTTON, false);
  
}


function CreateNewName()
{
  var num = 0
  var dom = dw.getDocumentDOM();
  var nodes = new Array();
  nodes = nodes.concat(dom.getElementsByTagName("MM_COMMAND"));
  nodes = nodes.concat(dom.getElementsByTagName("MM_COMMAND2"));
  var newNameFound = false


  while (!newNameFound)
  {
    num++
    var comName = "Command" + num
    for (var i = 0; i < nodes.length; i++)
    {
      var theName = (nodes[i].getAttribute("NAME")? nodes[i].getAttribute("NAME") : "")
      if (theName.toLowerCase() == comName.toLowerCase())
      {
        break
      }
    }

    if (i == nodes.length)
    {
      newNameFound = true
    }
  }

  return comName
}


function DeleteParam()
{
  /*
  This function is called when the user
  clicks on the minus button above the params list box.
  If there is not a selected index in the list, we do
  nothing. 
  */

  PARAM_LIST.del()
  //UpdateMinusButton()
}

function AddParam()
{
  //PARAM_LIST.append()
  //UpdateMinusButton()
  //PlusMouseUp()
  if (dw.isOSX())
  {
    // work around a problem in OSX where the first editable
    // region does not get focus.  Add a defaut name
    // so the user can see that something happened
    PARAM_LIST.object.options.push(new Option(MM.LABEL_Unnamed))
  }
  else
  {
    PARAM_LIST.object.options.push(new Option(""))
  }
  
  // When a new list is added, update the index to point the entry.
  PARAM_LIST.setIndex(PARAM_LIST.getContents().length - 1);   
}


function UpdateMinusButton()
{
  if (PARAM_LIST.getIndex() >= 0)
  {
    MINUS_BUTTON.src = "../../Shared/UltraDev/Images/MinusButtonEnabled.gif"
  }
  else
  {
    MINUS_BUTTON.src = "../../Shared/UltraDev/Images/MinusButtonDisabled.gif"
  }
}

function ReplaceParamsWithVals(st, pa, valCol)
{
  var statement = st
  for (var i = 0; i < pa.length; i++)
  {
    var myRe = new RegExp("\\b" + pa[i][0] + "\\b","g");
    statement = statement.replace(myRe, pa[i][valCol])
  }
  return statement
}


function PopUpTestDialog()
{
  if (TYPE_LIST.getValue() != 4)
    return

  var msg = CheckData(FOR_TEST)
  if (msg != "")
  {
    alert(msg)
    return
  }

  var pa = PARAM_LIST.getContents()
  var paramNames = new Array()
  var paramValues = new Array()
  
  for (var i = 0; i < pa.length; i++)
  {
    var aParam = pa[i]
    paramNames[i] = aParam[0]
    paramValues[i] = aParam[4]
  }

  var proc = Trim(COMMAND_TEXT.value)

  MMDB.showSPResultsetNamedParams(CONN_LIST.getValue(), proc, paramNames, paramValues)

}

function ConnectionChanged()
{
  TREE.setConnection(CONN_LIST.getValue())
}

function GetParamAttr(attr, paramDef)
{
  var index = paramDef.indexOf(attr + ":")
  var theEnd = paramDef.indexOf(";", index)
  return paramDef.substring(index + attr.length + 1, theEnd)
}



function AppendToSQL()
{
  var treeData = TREE.getData();
  var curText = COMMAND_TEXT.value
  var treeVal = treeData.origStr;
  var index = treeVal.indexOf(":MM_SP_PARAMS:")

  if (!treeData.IsProcedure())
  {
    if (treeData.IsColumn())
    {
      COMMAND_TEXT.value = curText + " " + treeData.column
    }
    else if (treeData.IsTable())
    {
      COMMAND_TEXT.value = curText + " " + treeData.table
    }
  }
  else
  {
    TYPE_LIST.pickValue("4")
    TypeChanged(4)
    PARAM_LIST.delAll()
    var returnValue = ""
    var numParams = 0
    var outParams = ""
    var paramList = treeVal.substring(index + 14, treeVal.length)
    var procName = treeData.procedure 
    var paramArray = treeData.paramArray;
    var gridArray = new Array()
    for (var i = 0; i < paramArray.length; i++)
    {
      gridArray[i] = new Array()      
      gridArray[i][0] = GetParamAttr("name", paramArray[i])
      gridArray[i][1] = GetParamAttr("type", paramArray[i])
      if (gridArray[i][1] == "int")
        gridArray[i][1] = "3"
      gridArray[i][2] = GetDirString(GetParamAttr("direction", paramArray[i]))
      gridArray[i][3] = ""
      gridArray[i][4] = ""
      gridArray[i][5] = ""
    }
  
    PARAM_LIST.setContents(gridArray)
    COMMAND_TEXT.value = procName
  }




/*
  var treeData = TREE.getData()
  
  if (!treeData.IsProcedure())
  {
    return
  }

  // Auto-populate the param grid

  PARAM_LIST.delAll()

  var gridArray = new Array()

  for (var i = 0; i < treeData.paramArray.length; i++)
  {
    var thisRow = new Array()
    var thisParam = treeData.paramArray[i]

    thisRow[0] = thisParam.name
    thisRow[1] = ""
    thisRow[2] = GetDirString(thisParam.direction)
    thisRow[3] = ""
    thisRow[4] = ""
    thisRow[5] = ""
    if (thisRow[2] != "RETURN_VALUE")
    {
      // In CF, there is always a return value.  We won't 
      // show it in the param grid.

      gridArray.push(thisRow)
    }
  }

  PARAM_LIST.setContents(gridArray)
  COMMAND_TEXT.value = treeData.procedure*/
}

function UpdateTreeSelection()
{
  TREE_SEL_BOX.value = TREE.selectedItem;
  var treeData = TREE.getData();
  if(treeData.IsProcedure())
  {
    if(TYPE_LIST.getValue() != 4)
    {
      TYPE_LIST.pickValue(4);
      TypeChanged(4);
    }
  }
}


function LaunchConnectionManager()
{
  var oldList = String(CONN_LIST.valueList).split(",")
  MMDB.showConnectionMgrDialog()
  PopulateConnectionList()
  var newConnectionIndex = getNewConnection(oldList, CONN_LIST.valueList)
  if (newConnectionIndex != -1)
  {
    CONN_LIST.setIndex(newConnectionIndex)
    ConnectionChanged()
  }
}


function getDynamicBindings(elementNode, onlyGetReturnValue)
{
  if( !elementNode ) return new Array();
  
  var parametersArray = new Array();
  var columnsArray = new Array();

  var ss = findSSrec(elementNode, CONST_TYPE);
  if( !ss && elementNode.previousSibling ) {
    ss = findSSrec(elementNode.previousSibling,CONST_TYPE);
  }

  if( !ss ) 
  {
	  return new Array();
  }

  var isSP = (ss.commandtype == 4)

  if (!isSP) return new Array();

  //First we construct an array of the return value and out/(in/out) parameters
  if (! ss.recordset || onlyGetReturnValue )
  {
	  if (ss.parameters && ss.parameters.paramName)
	  {
		for (var i = 0; i < ss.parameters.paramName.length; i++)
		{
		  var dir = ss.parameters.paramDirection[i];  
		  if (dir == 4 || dir == 2 || dir == 3)
		  {
			parametersArray.push(ss.parameters.paramName[i]);
		  }
		}
	  }
  }
  else
  {
	  //get the cols from the server
    var connName = ss.parameters.cname;
    var statement = ss.parameters.sql;
    
    var paramNames = new Array();
    var paramValues = new Array();
    
    if (ss.parameters && ss.parameters.paramName)
    {       
      for (var i = 0; i < ss.parameters.paramName.length; i++)
      {
        paramNames[i] = ss.parameters.paramName[i];
		paramValues[i] = "";
		if( ss.parameters.paramValue[i] ) {
        	paramValues[i] = getValue( ss, ss.parameters.paramValue[i], true );
		}
      }   
    }
    columnsArray = MMDB.getSPColumnListNamedParams(connName, statement, paramNames, paramValues,true);
  }

  var outArray = new Array();

  for (var i = 0; i < parametersArray.length; i++)
  {
    outArray.push(parametersArray[i]);
  } 

  for (var i = 0; i < columnsArray.length; i++)
  {
    outArray.push(columnsArray[i]);
  } 

  return outArray;
}


function parseUpdateSQL(SQLString)
{
  var regularParse = true
  var bReturn = true

  SQLString = StripChars("\t", SQLString)

  SQLString = SQLString.replace(/\n/g,"");
  SQLString = SQLString.replace(/\r/g," "); 

  if (SQLString == "")
  {
    DisplayUpdateStatement()
    return bReturn
  }
  
  //Remove any carriage returns and line feeds that may be embedded.

  var re1 = /(update)(\s*|.*)(set)(\s*|.*)(where)(\s*|.*)$/i;
  var re2 = /(update)(\s*|.*)(set)(\s*|.*)(where)$/i;
  var re3 = /(update)(\s*|.*)(set)(\s*|.*)$/i;
  var re4 = /(update)(\s*|.*)(set)$/i;
  var re5 = /(update)(\s*|.*)(where)(\s*|.*)$/i;
  var re6 = /(update)(\s*|.*)(where)$/i;
  var re7 = /(update)(\s*|.*)$/i;
  var re8 = /(update)$/i;

  if(SQLString.search(re1) == -1)
  {
    if(SQLString.search(re2) == -1)
    {
        if(SQLString.search(re3) == -1)
    {
      if(SQLString.search(re4) == -1)
      {
      if(SQLString.search(re5) == -1)
      {
        if(SQLString.search(re6) == -1)
        {
          if(SQLString.search(re7) == -1)
          {
            if(SQLString.search(re8) == -1)
            {
              bReturn = false
            }
          }
        } else {
          regularParse = false
        }
      } else {
        regularParse = false
      }
      }
    }
    }
  }

  if (!bReturn)
    return bReturn;

  if (regularParse)
  { 
    VAR_UPD_UPDATE = Trim(RegExp.$2)
    VAR_UPD_SET = Trim(RegExp.$4)
    VAR_UPD_WHERE = Trim(RegExp.$6)
  } else {
    VAR_UPD_TABLENAME = Trim(RegExp.$2)
    VAR_UPD_SET = ""
    VAR_UPD_WHERE = Trim(RegExp.$4)
  }


  return bReturn;
  
}

function parseDeleteSQL(SQLString)
{
  var bReturn = true
  
  SQLString = StripChars("\t", SQLString)

  //Remove any carriage returns and line feeds that may be embedded.
  SQLString = SQLString.replace(/\n/g,"");
  SQLString = SQLString.replace(/\r/g," "); 


  if (SQLString == "")
  {
    DisplayDeleteStatement()
    return bReturn
  }

  var re1 = /(delete\sfrom)(\s*|.*)(where)(\s*|.*)$/i;
  var re2 = /(delete\sfrom)(\s*|.*)(where)\s*$/i;
  var re3 = /(delete\sfrom)(\s*|.*)$/i;
  var re4 = /(delete\sfrom)\s*$/i;

  if(SQLString.search(re1) == -1)
  {
    if(SQLString.search(re2) == -1)
    {
        if(SQLString.search(re3) == -1)
    {
      if(SQLString.search(re4) == -1)
      {
      bReturn = false
      }
    }
    }
  }

  if (!bReturn)
    return bReturn;

  
  VAR_DEL_DELETE = Trim(RegExp.$2)
  VAR_DEL_WHERE = Trim(RegExp.$4)

  return bReturn;
}

function parseInsertSQL(SQLString)
{
  var parseType = 0
  var bReturn = true
  
  SQLString = StripChars("\t", SQLString)

  SQLString = SQLString.replace(/\n/g,"");

  SQLString = SQLString.replace(/\r/g," ");
  
  if (SQLString == "")
  {
    DisplayInsertStatement()
    return bReturn
  }
  //Remove any carriage returns and line feeds that may be embedded.

  var re1 = /(insert\s+into)(\s*|.*)(\()(\s*|.*)(\))\s*(values)\s*(\()(\s*|.*)(\))\s*$/i;
  var re2 = /(insert\s+into)(\s*|.*)(\()(\s*|.*)(\))\s+(values)(\s*|.*)$/i;
  var re3 = /(insert\s+into)(\s*|.*)(\()(\s*|.*)(\))\s+(values)\s*$/i;
  var re4 = /(insert\s+into)(\s*|.*)(\()(\s*|.*)(\))\s*$/i;
  var re5 = /(insert\s+into)(\s*|.*)(values)\s*$/i;

  if(SQLString.search(re1) == -1)
  {
    if(SQLString.search(re2) == -1)
    {
        if(SQLString.search(re3) == -1)
    {
      if(SQLString.search(re4) == -1)
      {
      if(SQLString.search(re5) == -1)
      {
        bReturn = false
      } else {
        parseType = 4
      }
      } else {
        parseType = 3
      }
    } else {
      parseType = 2
    }
    } else {
    parseType = 2
    }
  } else 
  {
    parseType = 1
  }

  if (!bReturn)
    return bReturn;
  
  switch(parseType)
  {
  case 1: VAR_INS_INSERT = Trim(RegExp.$2)
      VAR_INS_COLS = Trim(RegExp.$4)
      VAR_INS_VALUES = Trim(RegExp.$8)
      break
  case 2: VAR_INS_INSERT = Trim(RegExp.$2)
      VAR_INS_COLS = Trim(RegExp.$4)
      VAR_INS_VALUES = Trim(RegExp.$7)
      break
  case 3: VAR_INS_INSERT = Trim(RegExp.$2)
      VAR_INS_COLS = Trim(RegExp.$4)
      VAR_INS_VALUES = ""
      break
  case 4: VAR_INS_INSERT = Trim(RegExp.$2)
      VAR_INS_COLS = ""
      VAR_INS_VALUES = ""
      break
  default: break
  }

  return bReturn;

}

function parseProcedureSQL(SQLString)
{
  SQLString = StripChars("\t", SQLString)

  SQLString = SQLString.replace(/\n/g,"");

  SQLString = SQLString.replace(/\r/g," ");

  VAR_PROC = Trim(SQLString)

  return true;
}

function DisplayDeleteStatement()
{
  var outStr = ""
  
  outStr += CONST_DELETE + " " 
  if(Trim(VAR_DEL_DELETE) != "")
  {
    outStr += VAR_DEL_DELETE + " "
  }
  outStr += "\r" + CONST_WHERE + " " 
  if(Trim(VAR_DEL_WHERE) != "")
  {
    outStr += VAR_DEL_WHERE + " "
  }

  COMMAND_TEXT.value = outStr
  UpdateButtons(DeleteLabelArray)
}

function DisplayUpdateStatement()
{
  var outStr = ""
  
  outStr += CONST_UPDATE + " " 
  if(Trim(VAR_UPD_UPDATE) != "")
  {
    outStr += VAR_UPD_UPDATE + " "
  }
  outStr += "\r" + CONST_SET + " " 
  if(Trim(VAR_UPD_SET) != "")
  {
    outStr += VAR_UPD_SET + " "
  }
  outStr += "\r" + CONST_WHERE + " " 
  if(Trim(VAR_UPD_WHERE) != "")
  {
    outStr += VAR_UPD_WHERE + " "
  }

  COMMAND_TEXT.value = outStr
  UpdateButtons(UpdateLabelArray)
}

function DisplayInsertStatement()
{
  
  var outStr = ""
  
  outStr += CONST_INSERT + " " 

  if(Trim(VAR_INS_INSERT) != "")
  {
    outStr += VAR_INS_INSERT
  }
  
  outStr += " ("

  if(Trim(VAR_INS_COLS) != "")
  {
    outStr += VAR_INS_COLS
  } else {
    outStr += " "
  }

  outStr += ") "

  outStr += "\r" + CONST_VALUES + " (" 

  if(Trim(VAR_INS_VALUES) != "")
  {
    outStr += VAR_INS_VALUES
  } else {
    outStr += " "
  }

  outStr += ") "

  COMMAND_TEXT.value = outStr

  UpdateButtons(InsertLabelArray)
}

function DisplayProcedureStatement()
{
  COMMAND_TEXT.value = VAR_PROC
  UpdateButtons(ProcLabelArray);
}

function NoStatement()
{
  COMMAND_TEXT.value = "";
}


function UpdateButtons(labelButtonArray)
{ 
  var i
  var obj

  for (i = 0; i < labelButtonArray.length; i++)
  {
    obj = findObject(ButtonArray[i])
    if (labelButtonArray[i] != "" && obj)
    {
      obj.value = labelButtonArray[i];
      SetEnabled(obj, true)
    } else {
      SetEnabled(obj, false)
    }
  }
}

function DisableAllButtons()
{
  var i
  //We know that there are only four buttons...
  for (i = 0; i < 4; i++)
  {
    obj = findObject(ButtonArray[i])
    if (obj)
    {
      SetEnabled(obj, false)
    }
  }
  
}

function enableTheButton(obj)
{
  var re1 = /(\s*|.*)(DISABLED )(\s|.*)/
  var source = obj.outerHTML;

  if(source.search(re1) != -1)
  {
    source = RegExp.$1 + RegExp.$3
  }

  obj.outerHTML = source;
}

function disableTheButton(obj)
{
  var str = "DISABLED "
  var re1 = /(\s*|.*)(DISABLED )(\s|.*)/i
  var re2 = /(\s*|.*)(NAME)(\s|.*)/i
  var source = obj.outerHTML;

  if(source.search(re1) == -1)
  {
    if(source.search(re2) != -1)
    {
      source = RegExp.$1 + str + RegExp.$2 + RegExp.$3
    }
  }

  obj.outerHTML = source;
}

function toggleEnablement(obj)
{
  var str = "DISABLED "
  var re1 = /(\s*|.*)(DISABLED )(\s|.*)/i
  var re2 = /(\s*|.*)(NAME)(\s|.*)/i
  var source = obj.outerHTML;

  if(source.search(re1) == -1)
  {
    if(source.search(re2) != -1)
    {
      source = RegExp.$1 + str + RegExp.$2 + RegExp.$3
    }
  } else {
    source = RegExp.$1 + RegExp.$3
  }

  obj.outerHTML = source;
}

function Button1Clicked()
{
  if(!IsConnectionSelected())
  {
   return;
  }
  
  if (ParseCurrentData())
  {
    switch(TYPE_LIST.getValue())
    {
    case 1: Button1DeleteSelected()
        break
    case 2: Button1UpdateSelected()
        break
    case 3: Button1InsertSelected()
        break
    case 4: Button1ProcSelected()
        break
    default: break
    }
  } else {
    alert(MM.MSG_InvalidSQL);
  }
}

function Button2Clicked()
{
  if(!IsConnectionSelected())
  {
   return;
  }

  if( ParseCurrentData() )
  {
    switch(TYPE_LIST.getValue())
    {
    case 1: Button2DeleteSelected()
        break
    case 2: Button2UpdateSelected()
        break
    default: break
    }
  } else {
    alert(MM.MSG_InvalidSQL)
  }
}

function ParamButton1Clicked()
{
  if(!IsConnectionSelected())
  {
   return;
  }

  if( ParseCurrentData())
  {
    switch(TYPE_LIST.getValue())
    {
    case 1: ParamButton1DeleteSelected()
        break
    case 2: ParamButton1UpdateSelected()
        break
    case 3: ParamButton1InsertSelected()
        break
    default: break
    }
  } else {
    alert(MM.MSG_InvalidSQL)
  }
}

function ParamButton2Clicked()
{
  if(!IsConnectionSelected())
  {
   return;
  }

  if(ParseCurrentData())
  {
    switch(TYPE_LIST.getValue())
    {
    case 2: ParamButton2UpdateSelected()
        break
    default: break
    }

  } else {
    alert(MM.MSG_InvalidSQL)
  }
}

function ParseCurrentData(currentType)
{ var bRet = false;
  var type
  if(!currentType)
  {
    type = TYPE_LIST.getValue()
  } else {
    type = currentType
  }

  switch (type)
  {
    case 1: bRet = parseDeleteSQL(COMMAND_TEXT.value)
        break
    case 2: bRet = parseUpdateSQL(COMMAND_TEXT.value)
        break
    case 3: bRet = parseInsertSQL(COMMAND_TEXT.value)
        break
    case 4: bRet = parseProcedureSQL(COMMAND_TEXT.value)
        break
    case 0: DisableAllButtons()
        bRet = true;
        break;
    default: break
  }
  return bRet
}


function Button1DeleteSelected()
{
  var treeData = TREE.getData()
  if(!treeData.IsProcedure())
  {
    if( (treeData.IsTable())  && (treeData.table != "undefined"))
    {
      VAR_DEL_DELETE = treeData.table;
      DisplayDeleteStatement()
    } else {
      alert (MM.MSG_SelectTable)
    }
  } else {
    alert(MM.MSG_SelectTable)
  }
}


function Button1UpdateSelected()
{
  var treeData = TREE.getData()
  if(!treeData.IsProcedure())
  {
    if( (treeData.IsTable())  && (treeData.table != "undefined") )
    {
      VAR_UPD_UPDATE = treeData.table;
      DisplayUpdateStatement()
    } else {
      if(treeData.IsColumn())
      {
        VAR_UPD_UPDATE = treeData.table;
        VAR_UPD_SET = ParamStringConcat(VAR_UPD_SET, ", ", treeData.column)
        DisplayUpdateStatement();
      } else {
        alert(MM.MSG_SelectTableOrColumn)
      }
    }
  } else {
    alert(MM.MSG_SelectTableOrColumn)
  }
}

function Button1InsertSelected()
{
  var treeData = TREE.getData()
  if(!treeData.IsProcedure())
  {
    if(treeData.IsColumn())
    {
      VAR_INS_INSERT = treeData.table;
      VAR_INS_COLS = ParamStringConcat(VAR_INS_COLS, ", ", treeData.column)

      DisplayInsertStatement()
    } else {
      alert (MM.MSG_SelectColumn)
    }
  } else {
    alert(MM.MSG_SelectColumn)
  }
}

function Button1ProcSelected()
{ 
  var treeData = TREE.getData()
  if(treeData.IsProcedure())
  { 
    VAR_PROC = treeData.procedure;
  
    var gridArray = new Array()
    var refCursorName = ""
    for (var i = 0; i < treeData.paramArray.length; i++)
    {
      var paramType = getSQLTypeAsString(treeData.paramArray[i].type)
      if (paramType != "REF CURSOR")
      {
      var paramDir = GetDirString(treeData.paramArray[i].direction)
          var newParam = new Array()      
          newParam[0] = treeData.paramArray[i].name
          newParam[1] = paramType
          newParam[2] = paramDir
          newParam[3] = ""
          newParam[4] = ""
      if (paramDir == "in" || paramDir == "in/out")
      {
        newParam[5] = "Request(\"" + StripChars("_@#$%^\"' ", treeData.paramArray[i].name) + "\")"
      }
      else
      {
          newParam[5] = ""
      }
      gridArray.push(newParam)
      }
      else
      {
      refCursorName = StripChars("_@#$%^\"' ", treeData.paramArray[i].name)
      }
    }
  
    PARAM_LIST.setContents(gridArray)

    if (refCursorName != "")
    {
      RR_CHECKBOX.checked = true
      RR_NAME.value = "rs" + refCursorName
      checkBoxClicked()
    }

    DisplayProcedureStatement()
  } else {
    alert(MM.MSG_StoredProcedure)
  }
}

function Button2DeleteSelected()
{
  var treeData = TREE.getData()
  if(!treeData.IsProcedure())
  {
    if(treeData.IsColumn())
    {
      VAR_DEL_WHERE = ParamStringConcat(VAR_DEL_WHERE, " and ", treeData.column)
      DisplayDeleteStatement()
    } else {
      alert (MM.MSG_SelectColumn)
    }
  } else {
    alert(MM.MSG_SelectColumn)
  }
}

function Button2UpdateSelected()
{
  var treeData = TREE.getData()
  if(!treeData.IsProcedure())
  {
    if(treeData.IsColumn())
    {
      VAR_UPD_WHERE = ParamStringConcat(VAR_UPD_WHERE, " and ", treeData.column)

      DisplayUpdateStatement()
    } else {
      alert (MM.MSG_SelectColumn)
    }
  } else {
    alert(MM.MSG_SelectColumn)
  }
}

function ParamButton1DeleteSelected()
{
  var i = PARAM_LIST.getIndex()

  var paramlist = PARAM_LIST.getContents();
  if(paramlist.length == 0)
  {
    alert(MM.MSG_EmptyParamList);
    return;
  }

  if(i > -1)
  {
    var list = PARAM_LIST.getContents()
    VAR_DEL_WHERE = ParamStringConcat(VAR_DEL_WHERE, " = ", list[i][0])
    DisplayDeleteStatement()
  }
}

function ParamButton1UpdateSelected()
{
  var i = PARAM_LIST.getIndex()

    var paramlist = PARAM_LIST.getContents();
    if(paramlist.length == 0)
    {
    alert(MM.MSG_EmptyParamList);
    return;
    }


  if(i > -1)
  {
    var list = PARAM_LIST.getContents()
    VAR_UPD_SET = ParamStringConcat(VAR_UPD_SET, " = ", list[i][0])
    DisplayUpdateStatement()
  }
}


function ParamButton1InsertSelected()
{
  var i = PARAM_LIST.getIndex()

  var paramlist = PARAM_LIST.getContents();
  if(paramlist.length == 0)
  {
    alert(MM.MSG_EmptyParamList);
    return;
  }

  if(i > -1)
  {
    var list = PARAM_LIST.getContents()
    VAR_INS_VALUES = ParamStringConcat(VAR_INS_VALUES, ", ", list[i][0]);   
    DisplayInsertStatement()
  }
}


function ParamButton2UpdateSelected()
{
  var i = PARAM_LIST.getIndex()

  var paramlist = PARAM_LIST.getContents();
  if(paramlist.length == 0)
  {
    alert(MM.MSG_EmptyParamList);
    return;
  }


  if(i > -1)
  {
    var list = PARAM_LIST.getContents()
    var str = list[i][0]
    VAR_UPD_WHERE = ParamStringConcat(VAR_UPD_WHERE, " = ", str)
    DisplayUpdateStatement()
  }
}

function ParamStringConcat(origVal, concat, newVal)
{
  var str = Trim(origVal)
  var retstr

  if (str == "")
  {
    retstr = newVal
  } else {

    if (str.lastIndexOf(Trim(concat)) == (str.length - Trim(concat).length ))
    {
      retstr = origVal + " " + newVal;
    } else {
      retstr = origVal + concat + newVal ;
    }
  }
  return retstr;
}

function IsConnectionSelected()
{
  
  var conn = CONN_LIST.getValue();
  if((conn == MM.LABEL_None) || (Trim(conn) == "") || (conn == MM.LABEL_EmptyOption))
  {
    alert(MM.MSG_NoConnection);
    return false;
  }
  return true;
}

function IsTableOrViewOrColumnSelected()
{
  var treedata = TREE.getData();
  if(!treeData.IsProcedure)
  {
    if ( (treeData.IsTable()) || (treeData.IsColumn()) ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}


function PlusMouseDown()
{
  PlusButtonMouseDown(PLUS_BUTTON);
}

function PlusMouseUp()
{
  PlusButtonMouseUp(PLUS_BUTTON);
  AddParam();
}

function MinusMouseDown()
{
  if(PARAM_LIST.getIndex() >= 0) {
  MinusButtonMouseDown(MINUS_BUTTON)
  }
}

function MinusMouseUp()
{
  if(PARAM_LIST.getIndex() >= 0) {
  MinusButtonMouseUp(MINUS_BUTTON)
    DeleteParam();
  }
}
