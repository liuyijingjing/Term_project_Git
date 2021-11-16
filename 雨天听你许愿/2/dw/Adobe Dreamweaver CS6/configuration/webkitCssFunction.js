/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2011 Adobe Systems Incorporated
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
*
* PURPOSE:
*
* The functions in this file are used to make direct CSS Style edits to
* the Webkit DOM.  
**************************************************************************/




//--------------------------------------------------------------------
// FUNCTION:
//  findRule
//
// DESCRIPTION:
//   Used to find the cssRule in the webkit DOM which matches the input
//  selector string.
//
// ARGUMENTS:
//   ruleStr - Type: String. The selector string of the object that we are
//              looking for.
//   rules -    Type: Webkit Rules Array. The cssRules data structure in the 
//                 webkit DOM.
//   ruleRepeatCount- Type:int. Incase a selector is repeated multiple times we
//                      use this to determine the exact selector to modify. 
//
// RETURNS:
//   false if no Rule found.
//      Rule-  Type: Webkit Css Rule. The cssRule which matches the input 
//                      selector String.
//--------------------------------------------------------------------

function findRule(ruleStr,rules,ruleRepeatCount)
{
	ruleStr = normalize(ruleStr);
	if(!rules)
    {
		return false;
	}
	
	for(var i=0;i<rules.length;i++)
	{
		if(rules[i].selectorText && rules[i].type == 1 && 
			rules[i].selectorText == ruleStr)
		{
			ruleRepeatCount--;
			if(ruleRepeatCount <= 0)
            {
				return rules[i];
            }
		}
		else if(rules[i].type == 4)
		{
			var found = findRule(ruleStr,rules[i].cssRules,ruleRepeatCount);
			if(found)
            {
				return found;
			}
		}
	}
	return false;
}


//--------------------------------------------------------------------
// FUNCTION:
//  normalize
//
// DESCRIPTION:
//   We have to normalize the selector string used in Dreamweaver so that
//  we can use it for comparison in the webkit DOM. Normalizes ruleStr 
//  by changing it to LowerCase and converting strings like
//  h1,body to h1, body. Note the extra space after the ,. This is present in 
//  the normalized selector in webkit data structure.
//
// ARGUMENTS:
//   ruleStr - Type: String. The selector string of the object that we are
//              looking for.
//   
// RETURNS:
//   retVal -  Type: String. Normalized string.
//--------------------------------------------------------------------
// 
function normalize(ruleStr)
{
	var retVal = ruleStr.toLowerCase() ;
	var re = /,(\w)/;
	retVal = retVal.replace(re,", $1");
	return retVal;
}


//--------------------------------------------------------------------
// FUNCTION:
//  findStyleSheet
//
// DESCRIPTION:
//   Used to find the styleSheet in the webkit DOM that needs to be modified.
//
// ARGUMENTS:
//   styleSheetId - Type: int. The array index of the styleSheet 
//      in the webkit styleSheet Array.
//   styleSheetUrl - Type: string. Incase of Linked styleSheets we use the 
//      URL as the key to find the styleSheet that we want to modify. 
//   
// RETURNS:
//   false if no stylesheet is found.
//      StyleSheet-  Type: Webkit Css Style Sheet. The styleSheet which matches 
//                      the input parameters. 
//-------------------------------------------------------------------- 
function findStyleSheet(styleSheetId,styleSheetUrl)
{
	var styleSheets = dw.getDocumentDOM().browser.getWindow().document.styleSheets;
	if(styleSheetId > -1)
    {
		return styleSheets[styleSheetId];
	}
	
	for(var i=0;i<styleSheets.length;i++)
	{	
		if(dw.compareURLs(styleSheets[i].href,styleSheetUrl))
		{
			return styleSheets[i];
		}
		else
		{			
			var styleSheet = findNestedStyleSheet(styleSheets[i],styleSheetUrl);
			if(styleSheet)
				return styleSheet;
		}
	}
	return false;
}


//--------------------------------------------------------------------
// FUNCTION:
//  findNestedStyleSheet
//
// DESCRIPTION:
//  Incase of @import rules we iterate through the stylesheets recursively to find the
//      styleSheet we are interested in.
//
// ARGUMENTS:
//   styleSheet - Type: Webkit StyleSheet Object. The parent StyleSheet.
//
//   styleSheetUrl -    Type: String. URL of the styleSheet we are looking for. 
//                 
// RETURNS:
//   false if no stylesheet is found.
//      StyleSheet-  Type: Webkit Css Style Sheet. The styleSheet which matches 
//                      the input parameters. 
//--------------------------------------------------------------------
 
function findNestedStyleSheet(styleSheet,styleSheetUrl)
{
	if(dw.compareURLs(styleSheet.href,styleSheetUrl))
	{
		return styleSheet;
	}
	
	for(var j=0;j<styleSheet.cssRules.length;j++)
	{
		if(styleSheet.cssRules[j].type == 3)
		{
			var res=findNestedStyleSheet(styleSheet.cssRules[j].styleSheet,styleSheetUrl);
			if(res)
            {
				return res;
			}
		}
	}
	return false;
}


//--------------------------------------------------------------------
// FUNCTION:
//  editProperty
//
// DESCRIPTION:
//   Used to find the cssRule in the webkit DOM which matches the input
//  selector string.
//
// ARGUMENTS:
//   ruleStr - Type: String. The selector string of the rule that we are
//              looking for.
//   styleSheet - Type: Webkit StyleSheet Object. The styleSheet data structure in the 
//                 webkit DOM that we want to modify.
//
//   property- Type: String. The Css Property that we want to modify.
//
//   value   - Type: String. The new Value of the Css Property. 
//
//   ruleRepeatCount- Type:int. Incase a selector is repeated multiple times we
//                      use this to determine the exact selector to modify. 
// RETURNS:
//   false if no Rule found.
//      Rule-  Type: Webkit Css Rule. The cssRule which matches the input 
//                      selector String.
//--------------------------------------------------------------------

function editProperty(ruleStr,styleSheet,property,value,ruleRepeatCount)
{
	var rule = findRule(ruleStr,styleSheet.cssRules,ruleRepeatCount);
    var execStr = "rule.style."+property+"="+value;
	rule.style[property] = value;
}


var styleSheetId = %d;
var styleSheetUrl = "%s";
var liveStyleSheetUrl = "%s";

var styleSheet = findStyleSheet(styleSheetId,styleSheetUrl);

if(!styleSheet)
{
	styleSheet= findStyleSheet(styleSheetId,liveStyleSheetUrl);
}

if(styleSheet)
{
	editProperty("%s",styleSheet,"%s","%s",%d);
}
