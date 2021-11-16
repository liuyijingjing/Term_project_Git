// Copyright 2001-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

function CreateNewName()
{
  var num = 0;
  var dom = dw.getDocumentDOM();
  var nodes;
  var rsName = "";
  

  switch(dw.getDocumentDOM().serverModel.getServerLanguage())
  {
    case "JavaScript":
    case "VBScript":
      var nodes = dom.getElementsByTagName("MM_RECORDSET");
      break;
    case "CFML":
      var nodes = dom.getElementsByTagName("CFQUERY");
      break;   
    case "Java":
      var nodes = dom.getElementsByTagName("MM_RECORDSET");
      break; 
    case "C#":
    case "VB":
	  var nodes = dom.getElementsByTagName("MM_RECORDSET");
	  break;
  }
  
  if (nodes) {
    var newNameFound = false

    while (!newNameFound) {
      num++;
      rsName = "Recordset" + num;
      newNameFound = true;
      for (var i = 0; i < nodes.length; i++) {
        var theName = (nodes[i].getAttribute("NAME")? nodes[i].getAttribute("NAME") : "");
        if (theName.toLowerCase() == rsName.toLowerCase()) {
          newNameFound = false;
          break;
        }
      }
    }
  }
    

  return rsName;
}
 
function StripASPTags(inStr)
{
  var theStr = String(inStr);
  theStr = theStr.replace(/(<%=)*/gi,"");    //remove open tags	 
  theStr = theStr.replace(/(%>)*/gi,"");  //remove close tags
  return theStr;
}

function GetParamTypeArray()
{
  // the array definitions are in Commands\SimpleRecordset.js

  switch(dw.getDocumentDOM().serverModel.getServerLanguage())
  {
    case "JavaScript":
    case "VBScript":
      outArray = MM.LABEL_ASP_Param_Types
      break
    case "CFML":
      outArray = MM.LABEL_CF_Param_Types
      break
    case "Java":
      outArray = MM.LABEL_JSP_Param_Types
      break
    case "C#":
    case "VB":
	  outArray = MM.LABEL_ASPNET_Param_Types
      break
  }

  return outArray
}


function IsLiteralValue(index)
{
  switch(dw.getDocumentDOM().serverModel.getServerLanguage())
  {
    case "JavaScript":
    case "VBScript":
    case "CFML":
    case "C#":
    case "VB":
      if (index == 5)
      {
        return true
      }
      break
    case "Java":
      if (index == 2)
      {
        return true
      }
      break
  }

  return false
}


function GetParamObject(paramType, paramVal, rsName, paramDBType)
{
  var runtimeVal = "MM_Error: Could not create runtime value."
  var defaultVal = "1"
  var theName = gSimpleParamName
  switch(dw.getDocumentDOM().serverModel.getServerLanguage())
  {
    case "JavaScript":
    case "VBScript":
    case "C#":
    case "VB":
	  paramVal = StripASPTags(paramVal);
      switch(paramType)
      {
        case 0:
          runtimeVal = "Request.QueryString(\"" + paramVal + "\")"
          break
        case 1:
          runtimeVal = "Request.Form(\"" + paramVal + "\")"
          break
        case 2:
          runtimeVal = "Request.Cookies(\"" + paramVal + "\")"
          break
        case 3:
          runtimeVal = "Session(\"" + paramVal + "\")"
          break
        case 4:
          runtimeVal = "Application(\"" + paramVal + "\")"
          break
        case 5:
          runtimeVal = "Request(\"MM_EmptyValue\")"
          defaultVal = paramVal;
          break
      }
      break

    case "CFML":

      switch(paramType)
      {
        case 0:
          runtimeVal = "#URL." + paramVal + "#"
          break
        case 1:
          runtimeVal = "#FORM." + paramVal + "#"
          break
        case 2:
          runtimeVal = "#Cookie." + paramVal + "#"
          break
        case 3:
          runtimeVal = "#Session." + paramVal + "#"
          break
        case 4:
          runtimeVal = "#Application." + paramVal + "#"
          break
        case 5:
          runtimeVal = "#" + rsName + "_Literal#"
          defaultVal = paramVal
          break
      }
      break

    case "Java":

      switch(paramType)
      {
        case 0:
          runtimeVal = "request.getParameter(\"" + paramVal + "\")"
          break
        case 1:
          runtimeVal = "session.getValue(\"" + paramVal + "\")"
          break
        case 2:
          runtimeVal = "request.getParameter(\"MM_EmptyValue\")"
          defaultVal = paramVal
          break
      }

      break
  }

  

  var outObj = new Object()

  outObj.name = theName
  outObj.type = (typeof(paramDBType) != "undefined") ? paramDBType : -1;
  outObj.defaultVal = defaultVal
  outObj.runtimeVal = runtimeVal

  return outObj
}


function GetParamTypeAndName(inParam, rsName)
{

  var runtimeVal = inParam.runtimeVal

  var outObj = new Object()
  var paramType = -1
  var paramName = ""
  switch(dw.getDocumentDOM().serverModel.getServerLanguage())
  {
    case "JavaScript":
    case "VBScript":
    case "C#":
    case "VB":
      
      if (runtimeVal.search(/\s*Request\.QueryString\("([^"]*)"\)\s*/) != -1)
      {
        paramType = 0
      }
      else if (runtimeVal.search(/\s*Request\.Form\("([^"]*)"\)\s*/) != -1)
      {
        paramType = 1
      }
      else if (runtimeVal.search(/\s*Request\.Cookies\("([^"]*)"\)\s*/) != -1)
      {
        paramType = 2
      }
      else if (runtimeVal.search(/\s*Session\("([^"]*)"\)\s*/) != -1)
      {
        paramType = 3
      } 
      else if (runtimeVal.search(/\s*Application\("([^"]*)"\)\s*/) != -1)
      {
        paramType = 4
      } 
      else if (runtimeVal.search(/\s*Request\("MM_EmptyValue"\)\s*/) != -1)
      {
        paramType = 5
      }

      if (paramType == 5)
      {
        paramName = inParam.defaultVal
      }
      else
      {
        paramName = RegExp.$1
      }
                
      break

    case "CFML":
      if (runtimeVal.search(/\s*#url\.([^"]*)#\s*/i) != -1)
      {
        paramType = 0
      }
      else if (runtimeVal.search(/\s*#form\.([^"]*)#\s*/i) != -1)
      {
        paramType = 1
      }
      else if (runtimeVal.search(/\s*#cookie\.([^"]*)#\s*/i) != -1)
      {
        paramType = 2
      }
      else if (runtimeVal.search(/\s*#session\.([^"]*)#\s*/i) != -1)
      {
        paramType = 3
      } 
      else if (runtimeVal.search(/\s*#application\.([^"]*)#\s*/i) != -1)
      {
        paramType = 4
      } 
      else
      {

        var re = new RegExp(rsName + "_Literal")
        if (runtimeVal.search(re) != -1)
        {
          paramType = 5
        }
      }

      if (paramType == 5)
      {
        paramName = inParam.defaultVal
      }
      else
      {
        paramName = RegExp.$1
      }
    
      break


    case "Java":
      
      if (runtimeVal.search(/\s*request\.getParameter\("MM_EmptyValue"\)\s*/) != -1)
      {
        paramType = 2
      }
      else if (runtimeVal.search(/\s*request\.getParameter\("([^"]*)"\)\s*/) != -1)
      {
        paramType = 0
      }
      else if (runtimeVal.search(/\s*session\.getValue\("([^"]*)"\)\s*/) != -1)
      {
        paramType = 1
      }
    

      if (paramType == 2)
      {
        paramName = inParam.defaultVal
      }
      else
      {
        paramName = RegExp.$1
      }
                
      break
  }


  if (paramType != -1)
  {
    outObj.paramType = paramType
    outObj.paramName = paramName
    return outObj
  }
  else
  {
    return false
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   buildNewRecordsetParameters
//
// DESCRIPTION:
//   This function builds the parameters specific arrays (name, type,
//   direction, size and value). If the SQL is too comples (is not a simple
//   recordset), the parameters' type and size properties will be set to -1
//
// ARGUMENTS:
//   paramObj (object) - current paramObj object. The new properties
//                       will be stored here. This object should contain
//                       a proeprty called "sql" holding the simple SQL
//                       (the result of decodeVarRefs method) for the
//                       current Recordset
//   tempObj (object) - (optional) if specifyed, this object should contain
//                      all previous parameters' specific arrays read from
//                      the page (available on inspectServerBehavior). It
//                      is mainly used to restore the type and the size of
//                      each parameter if the new casted type is the same
//                      with the old cased type (the both types are in the
//                      same casting 'area')
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function buildNewRecordsetParameters(paramObj, tempObj) {
	paramObj.newEncodedSQL = paramObj.sql.replace(/[\r\n]+/gi, " ");
	/*
	paramObj.paramName = new Array();
	paramObj.paramType = new Array();
	paramObj.paramDirection = new Array();
	paramObj.paramSize = new Array();
	paramObj.paramValue = new Array();
	*/

	var sqlObj = ParseSimpleSQL(paramObj.sql);

	var parameterName, variableName, parameterType, parameterSize;
	var matchings;
	var beginsWith, endsWith;
	var re;
	var filterObj = FieldTypes.getFilterColumnObject(paramObj.cname, sqlObj);
	for (var i=0; i<paramObj.paramArray.length; i++) {
		parameterName = paramObj.paramArray[i].name;
		parameterType = FieldTypes.castDBType(paramObj.paramArray[i].type);
		if (parameterType == -1) {
			parameterType = FieldTypes.getFieldTypeFromObj(filterObj);
		}
		parameterSize = FieldTypes.getFieldSizeFromObj(filterObj);
		variableName = paramObj.rsName + "__" + parameterName;

		if (FieldTypes && FieldTypes.checkSizeForRSParameter) {
			parameterSize = FieldTypes.checkSizeForRSParameter(parameterType, parameterSize);
		} else {
			if (((parameterSize == -1) || (parameterSize > 255)) &&
					(FieldTypes.castDBType(parameterType) == 200)) {
				parameterSize = 255;
			}
		}

		re = new RegExp("(^|\\W)'?(%?)" + parameterName + "(%?)'?(\\W|$)", "i");
		
		matchings = paramObj.newEncodedSQL.match(re);
		beginsWith = matchings ? (matchings[2] == "%") : false;
		endsWith = matchings ? (matchings[3] == "%") : false;

		if (beginsWith) {
			variableName = '"%" + ' + variableName;
		}
		if (endsWith) {
			variableName = variableName + ' + "%"';
		}

		paramObj.newEncodedSQL = paramObj.newEncodedSQL.replace(re, "$1?$4");


		if (tempObj && tempObj.paramName && tempObj.paramType) {
			var oldIndex = getParameterOldIndex(tempObj, parameterName);
			if (oldIndex != -1) {
				if ((FieldTypes.castDBType(tempObj.paramType[oldIndex]) == parameterType) || ((parameterType == -1) && (tempObj.paramType[oldIndex] != -1))) {
					parameterType = tempObj.paramType[oldIndex];
					parameterSize = tempObj.paramSize[oldIndex];
				}
			}
		}

		FieldTypes.addParameter(paramObj, parameterType, parameterSize, variableName);
		//paramObj.paramName.push(parameterName);
		//paramObj.paramType.push(parameterType);
		//paramObj.paramDirection.push("1");
		//paramObj.paramSize.push(parameterSize);
		//paramObj.paramValue.push(variableName);
	}
}


//--------------------------------------------------------------------
// FUNCTION:
//   getParameterOldIndex
//
// DESCRIPTION:
//   This function looks for a parameter name by inspecting each parameter
//   value from the given tempObj object (the method takes first word after
//   __ within parameter value and test it against given parameterName)
//
// ARGUMENTS:
//   tempObj (object) - original object read from page
//   parameterName (string) - current parameter we are looking for
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function getParameterOldIndex(tempObj, parameterName) {
	var retVal = -1;

	var matches;
	for (var i=0; i<tempObj.paramValue.length; i++) {
		matches = null;
		if (tempObj.paramValue && tempObj.paramValue[i] && tempObj.paramValue[i].match) {
			matches = tempObj.paramValue[i].match(/__(\w+)/i);
		}
		if (matches && matches[1]) {
			if (parameterName == matches[1]) {
				retVal = i;
				break;
			}
		}
	}

	return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//   checkRecordsetParameterTypes
//
// DESCRIPTION:
//   This function cjecks to see whether we have paranmeters with type
//   property set to -1 or UNDEFINED and tries to fix this 'errors'.
//
// ARGUMENTS:
//   paramObj
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function checkRecordsetParameterTypes(paramObj) {
	var sqlTables = null;
	var parameterObj, tempObj;
	var index;

	for (var i=0; i<paramObj.paramType.length; i++) {
		if ((typeof(paramObj.paramType[i]) == "undefined") || (parseInt(paramObj.paramType[i]) == -1)) {
			tempObj = null;
			if (sqlTables === null) {
				sqlTables = FieldTypes.getTablesFromSQL(paramObj.cname, paramObj.sql);
			}
			var matches = paramObj.paramValue[i].match(/__(.*)$/i);
			var parameterName = (matches && matches[1]) ? matches[1] : "";
			index = dwscripts.findInArray(paramObj.varName, parameterName);
			if (index != -1) {
				parameterObj = extPart.findInString("parameterValue", paramObj.paramArray[index].runtimeVal);
				if (parameterObj && parameterObj.formControl) {
					tempObj = FieldTypes.getFieldObj(paramObj.cname, sqlTables, parameterObj.formControl);
					if (tempObj) {
						paramObj.paramType[i] = FieldTypes.castDBType(tempObj.datatype);
						paramObj.paramTypeDisplayName[i] = FieldTypes.getParameterTypeDisplayName(paramObj.paramType[i]);
					}
				}
			}
		}
	}

}
