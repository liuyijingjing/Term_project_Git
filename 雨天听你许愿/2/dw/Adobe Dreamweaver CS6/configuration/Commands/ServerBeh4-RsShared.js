// Copyright 2002-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

var FOR_TEST = 1
var FINAL = 2

function getDefaultCursorType()
{
	return 0;
}

function getDefaultLockType()
{
	return 3;
}

function getDefaultCursorLocation()
{
	return 3;
}


function ReplaceParamsWithVals(st, pa, connName)
{
	var statement = st;
	var theParamVal;
	var quote;
	var myRe;
	var isAccess = false;
	if ((connName != null) && (connName.length))
	{
		if (MMDB.supportsProcedures(connName) == false)
		{
			isAccess = true;
		}
	}
	for (var i = 0; i < pa.length; i++)
	{
		quote = "";
		theParamVal = String(pa[i][1]).replace(/\'/g, "''");
		// if we have a parameter whose casted type is STRING => we'll surround it with single quotes
		var aParamType = "" + pa[i][3];
		if (aParamType && aParamType.length)
		{
			if (FieldTypes.castDBType(aParamType) == "200") 
			{
				quote = "'";
			}
			else if (FieldTypes.castDBType(aParamType) == "135")
			{
				if (isAccess)
				{
					quote = "#";
				}
				else
				{
					quote = "'";
				}
			} 
		}
		myRe = new RegExp("(\\W)(%|)" + pa[i][0] + "(%|)(\\W|$)", "");
		statement = statement.replace(myRe, "$1" + quote + "$2" + theParamVal + "$3" + quote + "$4");
	}
	return statement;
}



