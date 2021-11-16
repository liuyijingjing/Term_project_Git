/*!
**********************************************************************
@file domUtils.js

Author:
	Andrew Matheson (2005) 
	Steve Balo (2005-2006)

Copyright 2003-2006 Adobe Systems Incorporated.                     
All Rights Reserved.                                            
                                                                    
NOTICE: Information contained herein is the 
property of Adobe Systems Incorporated.                                                                                                              

***********************************************************************
*/

function getObjectById(objectId)
{
	// cross-browser function to get an object given its id
	if(document.getElementById && document.getElementById(objectId))
	{
		// W3C DOM
		return document.getElementById(objectId);
	}
	else if (document.all && document.all(objectId))
	{
		// MSIE 4 DOM
		return document.all(objectId);
	}
	else if (document.layers && document.layers[objectId])
	{
		// NN 4 DOM.. note: this won't find nested layers
		return document.layers[objectId];
	}
	else
	{
		return false;
	}
} // getObjectById

// *******************************************************************
function getNextSiblingWithFilter(inNode, inPredicate)
{
	var curNode;
	for (curNode = inNode.nextSibling;
		 inPredicate(curNode) != true;
		 curNode = curNode.nextSibling)
		 ;
	
	return curNode;
}

// *******************************************************************
function getRecursiveNodeListForNode(inNode)
{
	var resultList = new Array;
	resultList.concat(inNode);
	var childArray;
	
	if (inNode.childNodes != null)
		childArray = inNode.childNodes;
	else if (inNode.children != null)
		childArray = inNode.children;
	
	for (var child in inNode.children)
	{
		var childNodeList = getRecursiveNodeListForNode(child);
		if (null != childNodeList && childNodeList.length)
		{
			resultList.concat(childNodeList);
		}
	}
	return resultList;
}

// *******************************************************************
function getAllChildrenForNode(inNode)
{
	var nodeList = null;
	if (inNode.all)
	{
		nodeList = inNode.all;
	}
	else
	{
		nodeList = accumulateForElementTree(document.documentElement, function(arg0) { return arg0; });
	}
	return nodeList;
}

// *******************************************************************
function accumulateForElementTree(inNode, inAccumulationFunction)
{
	var result = new Array;
	result = result.concat(inAccumulationFunction(inNode));
	
	if (inNode.all != null)
	{
		for (var i = 0; i < inNode.all.length; ++i)
			result.concat(inAccumulationFunction(inNode.all[i]));
	}
	else
	{
		var childNodes = null;
		
		if (inNode.childNodes != null)
			childNodes = inNode.childNodes;
		else if (inNode.children != null)
			childNodes = inNode.children;
		
		if (childNodes != null)
		{
			for (var aChildIndex = 0; aChildIndex < childNodes.length; ++aChildIndex)
			{
				var subResult = accumulateForElementTree(childNodes[aChildIndex], inAccumulationFunction);
				result = result.concat(subResult);
			}
		}
	}
	
	return result;
}

// *******************************************************************
function applyToElementTree(inNode, inFunction)
{
	inFunction(inNode);
	
	if (inNode.all)
	{
		for (var i = 0; i < inNode.all.length; ++i)
			inFunction(inNode.all[i]);
	}
	else
	{
		var childNodes;
		
		if (inNode.children != null)
			childNodes = inNode.children;
		else if (inNode.childNodes != null)
			childNodes = inNode.children;
		
		if (childNodes != null)
		{
			for (var i = 0; i < childNodes.length; ++i)
				applyToElementTree(childNodes[i], inFunction);
		}
	}
}

// *******************************************************************
// EOF
// *******************************************************************
