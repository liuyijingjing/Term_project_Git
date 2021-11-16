
function TestRunner() 
{
	var runner = this;
	
	runner.testCases 	= [];
	runner.errorMsg 	= '';
	runner.then 		= []; // Is populated inside of assert calls based on the msg passed in.
	
	runner.mocker = new Mocker();
	
	runner.testCaseCreator = new TestCaseCreator();		
						
	runner.addTestCase = function(testCase) 
		{ 
			runner.testCases.push(testCase); 
		}
		
	runner.assertTrue = function(msg, condition)
		{
			runner.then.push(msg);
			
			if (!condition && !runner.errorMsg)
				runner.errorMsg = 'True assertion failed: ' + msg;
		}
		
	runner.assertFalse = function(msg, condition)
		{
			runner.then.push(msg);
			
			if (condition && !runner.errorMsg)
				runner.errorMsg = 'False assertion failed: ' + msg;
		}				

	runner.assertIsFunction = function(msg, func)
		{
			runner.then.push(msg);
			
			if (typeof func != 'function' && !runner.errorMsg)
				runner.errorMsg = 'Is Function assertion failed: ' + msg;
		}

	runner.assertListedPublicFunctionsExist = function(msg, obj)
		{
			runner.then.push(msg);
			
			if (runner.errorMsg)
				return; // There is already an error waiting to be displayed, bail.
			
			if (!obj)
				runner.errorMsg = 'Second parameter should be an object, but it is not: ' + msg;
			else if (!obj.publicFunctions || !(obj.publicFunctions instanceof Array))
				runner.errorMsg = 'The object passed in as the second parameter does not have a "publicFunctions" array: ' + msg;				
			else
			{
				for (var i = 0; i < obj.publicFunctions.length; i++)
				{
					var funcName = obj.publicFunctions[i];
					if (typeof obj[funcName] != 'function')
					{
						runner.errorMsg = 'Public Function Exists assertion failed. Function "' + funcName + '" not found: ' + msg;
						break;	
					}
				}
			}				
		}
								
	runner.assertFunctionsArePublic = function(msg, obj, expectedPublicFunctions)
		{
			runner.then.push(msg);
			
			if (runner.errorMsg)
				return; // There is already an error waiting to be displayed, bail.
			
			if (!obj)
			{
				runner.errorMsg = 'Second parameter should be an object, but it is not: ' + msg;
				return;
			}
			
			if (!obj.publicFunctions || !(obj.publicFunctions instanceof Array))
			{
				runner.errorMsg = 'The object passed in as the second parameter does not have a "publicFunctions" array: ' + msg;				
				return;
			}

			if (typeof expectedPublicFunctions == 'undefined' || !(expectedPublicFunctions instanceof Array))
			{
				runner.errorMsg = 'The object passed in as the third parameter should be an array, but it is not: ' + msg;				
				return;
			}

			var areAllStrings = true;
			
			expectedPublicFunctions.forEach(function(funcName){
					if (!areAllStrings)
						return;
					if (typeof funcName != 'string')					
						areAllStrings = false;
				});			
				
			if (!areAllStrings)
			{
				runner.errorMsg = 'The object passed in as the third parameter should be an array of strings, but it is not: ' + msg;				
				return;
			}

			for (var i = 0; i < expectedPublicFunctions.length; i++)
			{
				var funcName = expectedPublicFunctions[i];
				if (obj.publicFunctions.indexOf(funcName) == -1)
				{
					runner.errorMsg = 'Functions Are Public assertion failed. Function "' + funcName + '" not found in "publicFunctions" list: ' + msg;
					break;	
				}
			}
		}
								
	runner.assertEqual = function(msg, first, second)
		{
			runner.then.push(msg);
			
			if (first != second && !runner.errorMsg)
				runner.errorMsg = msg + ' Equal assertion failed: ' + runner.htmlEncode(first) + ' != ' + runner.htmlEncode(second);
		}

	runner.assertStringsEqual = function(msg, first, second)
		{
			runner.then.push(msg);
						
			if (first != second && !runner.errorMsg)
			{							
				first = runner.htmlEncode(first);
				second = runner.htmlEncode(second);						
												
				var diffStart = -1;
				
				for (var i = 0; i < second.length; i++)
				{
					if (i < first.length && first[i] != second[i])
					{
						diffStart = i;
						break;
					}
				}
				
				// When we 'show white space', \t, \r, and \n change one char into two, so we have to update the diffStart
				// to reflect that to ensure the red displays starting at the right character.
				
				var charsToAdd = 0;
				for (var i = 0; i < diffStart; i++)				
					if (first[i] == '\t' || first[i] == '\r' || first[i] == '\n')
						charsToAdd++;
						
				diffStart += charsToAdd;
				
				first = runner.showWhiteSpace(first);
				second = runner.showWhiteSpace(second);					

				if (first.length > second.length)
					first = runner.makeStrRedStartingAt(first, diffStart == -1 ? second.length : diffStart);				
				else
					second = runner.makeStrRedStartingAt(second, diffStart == -1 ? first.length : diffStart);
									
				runner.errorMsg = msg + ' <div>Strings Equal assertion failed (space chars represented by +):</div> <div>' + first + 
											'</div> != <div>' + second + '</div>';
			}
		}
		
	runner.showWhiteSpace = function(str)
		{
			return String(str).replace(/ /g, '+').replace(/\t/g, '\\t').replace(/\r/g, '\\r').replace(/\n/g, '\\n')
		}

	runner.makeStrRedStartingAt = function(str, startOffset)
		{
			return str.substring(0, startOffset) + '<span style="color:red;font-weight:bold;">' + str.substring(startOffset) + '</span>';
		}
	
	runner.assertArraysEqual = function(msg, first, second)
		{
			runner.then.push(msg);

			if (runner.errorMsg)
				return;
			
			if (typeof first == 'undefined' || !(first instanceof Array))
			{
				runner.errorMsg = msg + ' The first array passed in is undefined or not an array.';
				return;	
			}

			if (typeof second == 'undefined' || !(second instanceof Array))
			{
				runner.errorMsg = msg + ' The second array passed in is undefined or not an array.';
				return;	
			}

			
			if (first.length != second.length && !runner.errorMsg)
			{
				runner.errorMsg = msg + ' Arrays Equal assertion failed: Arrays are of different length. ' + first.length + ' != ' + second.length;
				return;
			}
			
			for (var i = 0; i < first.length; i++)
			{
				if (first[i] != second[i] && !runner.errorMsg)
				{
					runner.errorMsg = msg + ' Arrays Equal assertion failed: Elements [' + i + '] are not equal.  ' + 
																runner.htmlEncode(first[i]) + ' != ' + runner.htmlEncode(second[i]);
					return;
				}
			}
		}
				
	runner.dump = function(msg, item, format)
		{
			format = format || 'preformatted';
			var theType = typeof item;
			var text = '';
			
			if (theType == 'number' || theType == 'boolean')
				text = item;
			else if (theType == 'string')
			{					
				if (format == 'json')
					text = '<pre>' + runner.formatJson(item) + '</pre>';
				else if (format == 'flatten')
					text = runner.showWhiteSpace(item);			
				else // (format == 'preformatted')		
					text = '<pre>' + item + '</pre>';
			}
			else if (theType == 'object' || item instanceof Object)
			{
				// Automatically display objects in json.
				text = '<pre>' + runner.formatJson(runner.objToJson(item)) + '</pre>';
			}
			else
				text = '"runner.dump(item)" does not yet support the type of the variable passed in. (typeof item == "' + theType + '")';
			
			runner.dumpList.push({msg: '<b>' + msg + ':</b>', text: text});
		}
				
	runner.formatJson = function(str)
		{			
			str = String(str);
			var strOut = '';
			var indent = 0;
			var inString = false;
			var stringDelim = '';
			
			function indentString(num)
			{
				var strOut = '';
				for (var i = 0; i < num; i++)
					strOut += '   ';
				return strOut;
			}
			
			for (var i = 0; i < str.length; i++)
			{
				var c = str[i];
				if (c == '{' || c == '[')
				{										
					if (!inString)
						strOut += '\n' + indentString(indent++);
					strOut += c;
					if (!inString)
						strOut += '  ';
				}
				else if (c == '}' || c == ']')
				{					
					if (!inString)												
						strOut += '\n' + indentString(--indent);
					strOut += c;												
				}
				else if (c == ',')
				{					
					strOut += c;
					if (!inString)						
						strOut += '\n' + indentString(indent);	
				}
				else if (c == "'" || c == '"')
				{					
					if (!inString)
					{
						inString = true;
						stringDelim = c;
					}
					else if (stringDelim == c && strOut[strOut.length - 1] != '\\')							
						inString = false;
					strOut += c;
				}
				else if (c == ":")
				{					
					strOut += c;
					if (!inString)
						strOut += ' ';
				}
				else if (inString || (c != ' ' && c != '\n' && c != '\r' && c != '\t')) // Only print existing white space if it's inside a string.
					strOut += c; 						
			}
			
			strOut = strOut.replace(/\n\s*\[\s*\]/g, '[]');	// Reformat empty arrays to just be on one line.
			strOut = strOut.replace(/\n\s*\{\s*\}/g, '{}');	// Reformat empty objects to just be on one line.			
			strOut = strOut.replace(/^\s*\n/gm, '');		// Get rid of blank lines we may have inserted.
		
			return strOut;
		}
		
	runner.objToJson = function(obj)
		{			
			var isArray = obj instanceof Array;
			var json = '';
			
			if (isArray)
				json += '[';
			else
				json = '{';
			
			var numProps = 0;
			
			for (var i in obj)
			{					
				numProps++;
				
				if (numProps > 1)
					json += ',';			
					
				if (!isArray)
					json += "'" + i + "':";
					
				var prop = obj[i];
				
				if (typeof prop == 'object')
				{
					if (prop == null)
						json += 'null';
					else
						json += runner.objToJson(prop);		
				}
				else if (typeof prop == 'string')
				{
					json += "'" + prop.replace(/'/g, "\\'").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r") + "'";
				}
				else if (typeof prop == 'function')
				{
					json += "'function'";
				}
				else
				{
					json += prop;
				}
			}
			
			if (isArray)
				json += ']';
			else
				json += '}';
				
			return json;
		}
	
	runner.run = function()
		{			
			var testCasesRun = 0;
			
			for (var i = 0; i < runner.testCases.length; i++)
			{		
				var testCase = runner.testCases[i];
				
				if (testCase.stopHere)
					break;
					
				if (testCase.skipNext)
				{
					i += testCase.skipNext;
					continue;
				}
				
				if (testCase.skip)
					continue;
			
				testCasesRun++;
				
				if (!testCase.name)
					testCase.name = '';
					
				runner.errorMsg = '';
				runner.dumpList = [];
				runner.then = [];
				try 
				{
					testCase.test();
				} 
				catch (e) 
				{
					runner.errorMsg = '_message<br>_fileName<br>Line _lineNumber'
											.replace(/_message/, e.message)
											.replace(/_fileName/, e.fileName)
											.replace(/_lineNumber/, e.lineNumber);
				}
				
				if (runner.errorMsg || runner.dumpList.length > 0)
				{
					var displayMsg = '';
					
					if (runner.dumpList.length > 0)
						displayMsg += runner.formatDumps();
					
					if (runner.mocker.mockMsg)
						displayMsg += 'Mock msg: ' + runner.mocker.mockMsg + ' ';
					
					displayMsg += runner.errorMsg;
					
					return 	{	status:		'failed', 
								records:	[{testCase: testCase.name, message: displayMsg}]
							};
				}
			}

			return { status: 'passed', numTestCases: testCasesRun };
		}
		
	runner.formatDumps = function()
	{
		var strOut = '';
		
		for (var i = 0; i < runner.dumpList.length; i++)
		{
			var dumpRec = runner.dumpList[i];
					
			strOut += 	'<div style="margin:3px;margin-bottom:6px;padding:3px;border:1px dashed #ccc;">' + 
							'<div style="padding:3px;border-bottom:1px dashed #ccc;">' + dumpRec.msg + '</div>' +
							'<div style="padding:3px;padding-left:7px;">' + dumpRec.text + '</div>' +
						'</div>';			
		}
		
		return strOut;
	}
		
	runner.generateTestDoc = function()
		{
			var html = 	'<html>\n' +
						'<head>\n' +
						'<style>\n' +
						'body {font-family: arial; font-size:9pt;}\n' +
						'ol.suite > li {padding: 10px;}\n' +
						'ol.suite ul li {padding: 2px;}\n' +
						'ol.suite ul {padding-top: 10px;}\n' +
						'.hardwired { color: red; }\n' +
						'</style>\n' +
						'</head>\n' +
						'<body>\n' +
						'<h3>Behavior Doc</h3>\n' +
						'<ul><li>This document describes the behavior of the given object as it is currently implemented.' +
						'<li class="hardwired">Red text indicates areas where information has been hard-wired into the logic. ' +
						'These hard-wired options will be re-written in the future to make the logic more generic.</ul>' +
						'<ol class="suite">\n';
			
			if (runner.behaviorDocTitle)
			{
				html = html.replace(/Behavior Doc/, 'Behavior Doc: ' + runner.behaviorDocTitle);	
			}
			
			for (var i = 0; i < runner.testCases.length; i++)
			{		
				var testCase = runner.testCases[i];
				
				if (testCase.stopHere)
					break;
					
				if (testCase.skipNext)
				{
					i += testCase.skipNext;
					continue;
				}					
					
				if (testCase.doNotDocument)
					continue;
				
				html += '\t<li>%s\n\t\t<ul>\n'.replace('%s', testCase.name);
				
				if (testCase.given)				
					html += '\t\t\t<li>Given: %s</li>\n'.replace('%s', testCase.given);				
				
				html += '\t\t\t<li>When: %s</li>\n'.replace('%s', testCase.when);
				
				runner.then = []; // This array will be populated by the assert calls in 'testCase.test()'
				testCase.test();
								
				if (runner.then.length > 1)				
					testCase.then = '\n\t\t\t\t<ol>\n\t\t\t\t\t<li>' + runner.then.join('</li>\n\t\t\t\t\t<li>') + '</li>\n\t\t\t\t</ol>\n';
				else
					testCase.then = runner.then.join(' ');	
				
				html += '\t\t\t<li>Then: %s</li>\n'.replace('%s', testCase.then);
				html += '\t\t</ul>\n\t</li>\n';
			}
			
			html += '</ol></body></html>';
			
			return html;
		}
		
	runner.htmlEncode = function(str)
		{
			return String(str).replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
		}
		
	runner.stopHere = function()
		{
			// No test cases that are added to the test file after this call will be run.
			
			runner.addTestCase({stopHere:true});	 
		}
		
	runner.skipNext = function(num)
		{
			// Do not run the next [num] test cases, starting with the current one.
			
			runner.addTestCase({skipNext: typeof num != 'undefined' ? num : 1});	
		}
	
	runner.assertPropsEqual = function(msg, propsStr, first, second)
		{
			runner.then.push(msg);

			if (runner.errorMsg)
				return;

			var props = propsStr.replace(/ /g, '').split(',');
			
			for (var i = 0; i < props.length; i++)
			{
				var prop = props[i];
				
				if (first[prop]	!= second[prop])				
				{
					runner.errorMsg = msg + ' Props Equal assertion failed: Prop "' + prop + '" is different. ' + first[prop] + ' != ' + second[prop];
					return;
				}
			}
		}

	runner.assertParamsPassedIn = function(msg, fn)
		// This function takes 3 or more params.  The 3rd thru rest are arrays that represent
		// the params that should have been passed in to this function on each consecutive call.
		{
			runner.then.push(msg);

			if (runner.errorMsg)
				return;
								
			var expectedParamsLists = [];
			
			for (var i = 2; i < arguments.length; i++)
			{
				expectedParamsLists.push(arguments[i]);
			}
			
			var mockFunctionRec = runner.mocker.getMockFunctionRec(fn);
			
			if (!mockFunctionRec)
			{
				runner.errorMsg = msg + ' No Mock Function Rec could be found for the function passed in.';
				return;								
			}
			
			var actualParamsLists = mockFunctionRec.params;
			
			if (expectedParamsLists.length != actualParamsLists.length)
			{
				runner.errorMsg = msg + ' Params Passed In assertion failed: The expected number of calls did not match the actual number. ' +
										'Expected: ' + expectedParamsLists.length + ', Actual: ' + actualParamsLists.length;
				return;				
			}
			
			for (var i = 0; i < expectedParamsLists.length; i++)
			{
				var expectedParamsList = expectedParamsLists[i];
				var actualParamsList = actualParamsLists[i];								
				
				if (expectedParamsList.length != actualParamsList.length)
				{
					runner.errorMsg = msg + ' Params Passed In assertion failed: Call: ' + (i + 1) + ', the expected number of params did not ' +
											'match the actual number. ' +
											'Expected: ' + expectedParamsList.length + ', Actual: ' + actualParamsList.length;
					return;				
				}
								
				for (var j = 0; j < expectedParamsList.length; j++)
				{
					var expectedParam = expectedParamsList[j];
					var actualParam = actualParamsList[j];
					
					if (expectedParam != actualParam)
					{
						runner.errorMsg = msg + ' Params Passed In assertion failed: Call: ' + (i + 1) + ', Param: ' + (j + 1) + ', did not match. ' +
												'Expected: ' + expectedParam + ', Actual: ' + actualParam;
						return;							
					}
					
				}				
			}
		}

	runner.assertCallCount = function(msg, fn, expectedCallCount)
		{
			runner.then.push(msg);

			if (runner.errorMsg)
				return;

			if (typeof fn != 'function')
			{
				runner.errorMsg = msg + ' The second param passed in is not a function.';
				return;				
			}			
								
			var actualCallCount = runner.mocker.getMockFunctionRec(fn).callCount;
					
			if (expectedCallCount != actualCallCount)
			{
				runner.errorMsg = msg + ' Call Count assertion failed: The expected number of calls did not match the actual number. ' +
										'Expected: ' + expectedCallCount + ', Actual: ' + actualCallCount;
				return;				
			}			
		}
		
	runner.loadSnippets = function(dom)
		// Iterates through a file and collects all lines that are in between lines
		// with only 'snip' in them and returns the array of lines.
		{				
			var str = dom ? dom.documentElement.outerHTML : dw.getDocumentDOM().documentElement.outerHTML;
				
			var lines = str.match(/^.*$/gm);
	
			if (!lines) lines = [];
			
			var collecting = false;
			var collectedLines = [];
			
			lines.forEach(function(line){
					if (/^\s*snip\s*$/i.test(line))
					{
						if (!collecting)
							collecting = true;	
						else
						{
							collecting = false;
							return false; // We are done.
						}
					}
					else if (collecting)
						collectedLines.push(line);
				});
				
			return collectedLines;
		}
		
	runner.dumpUntestedFunctions = function(self)
		{
			var testCaseNames = runner.testCases.map(function(testCase){
					return String(testCase.name).split(' ')[0]
				});			
			var funcNames = [];			
			for (var prop in self) 
				if (typeof self[prop] == 'function') 
					funcNames.push(prop);			
			var untestedFuncNames = funcNames.filter(function(funcName){
					return testCaseNames.indexOf(funcName) == -1
				}).sort();			
			runner.dump('Untested functions', untestedFuncNames);	
		}		
}

function runTestFunctions()
{
	return runner.run(); // Assumes 'var runner = new TestRunner()' was used at start of test file.
}

function generateTestDoc()
{
	return runner.generateTestDoc(); // Assumes 'var runner = new TestRunner()' was used at start of test file.
}


function Mocker()
{
	var mocker = this;
	
	mocker.mockMsg = '';
	mocker.mockFunctionRecs = [];
	mocker.functionToMockFunctionRecsIndexMap = {};
	mocker.nameToMockObj = {};

	function MockRec()
	{
		var self = this;
		
		self.callCount = 0;
		self.retVal = null;
		self.params = [];
		self.callback = null;
	}

	mocker.loadObject = function(obj, functionName)
		{			
			mocker.resetMocks('');
			
			for (var prop in obj)
				if (prop != functionName)
					delete obj[prop];
					
			return obj;
		}
		
	mocker.resetParamsAndCallCounts = function()
		{		
			mocker.mockFunctionRecs.forEach(function(mockFunctionRec){ mockFunctionRec.callCount = 0; mockFunctionRec.params = []});
		}
	
	mocker.getMockFunctionRec = function(key)
		{
			var index;
			
			if (typeof key == 'function')
			{
				var index = mocker.functionToMockFunctionRecsIndexMap[key];	
			}
			else // Assume it is an index in the mockFunctionRecs, i.e., a number;
			{
				var index = key;
			}
			
			var mockFunctionRec = mocker.mockFunctionRecs[index];
			
			if (!mockFunctionRec)
				return null;
				
			return mockFunctionRec;
		}
		
	mocker.resetMocks = function(msg)
		{
			if (!mocker.errorMsg)
				mocker.mockMsg = msg; // We don't want to overwrite the Mock Msg if an error has already occurred that will need reporting.
			mocker.mockFunctionRecs = [];	
			mocker.functionToMockFunctionRecsIndexMap = {};
			mocker.nameToMockObj = {};
		}
		
	mocker.bindChainRootToObject = function(objName, obj)
		{
			mocker.nameToMockObj[objName] = obj;	
		}
		
	mocker.mockFunctionCalled = function(index, callArguments)
		{
			var mockFunctionRec = mocker.getMockFunctionRec(index);
			
			mockFunctionRec.callCount++;
			var args = [];														
			
			for (var i = 0; i < callArguments.length; i++) 							
				args.push(callArguments[i]);										
			
			mockFunctionRec.params.push(args);	
			
			if (mockFunctionRec.callback)						
				return mockFunctionRec.callback.apply({}, callArguments);
			
			return mockFunctionRec.retVal;
		}		

	mocker.mock = function(chainStr, retValOrCallback) // A chain is a connected list of identifiers, eg: 'self.refs.dw.getDocumentDOM().documentElement'
		{				
			var retVal = null;
			var callback = null;		
			if (typeof retValOrCallback == 'undefined')
				retVal = {}; // By default, we make chains return an empty object.
			else if (typeof retValOrCallback == 'function')
				callback = retValOrCallback;	
			else
				retVal = retValOrCallback;
			var links = chainStr.split('.');
			if (links.length < 2)
			{
				alert('The chain passed in, "' + chainStr + '", must have at least two links, such as: "obj.prop" or "obj.function()".');
				return;	
			}			
			var obj = mocker.nameToMockObj[links[0]];
			var linkPtr = obj;
			if (typeof obj == 'undefined')
			{
				alert('The object passed in, "' + links[0] + '", has not been set up using runner.mocker.bindChainRootToObject().');
				return;	
			}
			links.forEach(function(link, i)
			{
				if (i == 0) return; // The first link, aka the root, has already been set up so skip it.
				var isLastLink = (i == (links.length - 1));
				var isProp = link.indexOf('()') == -1;						
				if (isProp)
				{																					
					if (!linkPtr[link]) linkPtr[link] = {};
					if (isLastLink) linkPtr[link] = retVal;
					linkPtr = linkPtr[link];  // Advance to the next link.
				}
				else // It's a function.
				{					
					var functionName = link.substring(0, link.indexOf('(')); // Trim parens off end.
					var mockFunctionRec = mocker.getMockFunctionRec(linkPtr[functionName]);
					if (!mockFunctionRec) mockFunctionRec = mocker.createAndMapMockFunctionRec(linkPtr, functionName);
					if (isLastLink)
					{							
						mockFunctionRec.retVal = retVal;							
						mockFunctionRec.callback = callback;							
					}
					else if (!mockFunctionRec.retVal)
					{						
						mockFunctionRec.retVal = {}; // We are in the middle of a chain, so we will be returning an object.
					}
					linkPtr = mockFunctionRec.retVal; // Advance to next link or set up the retVal.
				} 
			}); // End of links.forEach
		}
		
	mocker.createAndMapMockFunctionRec = function(linkPtr, functionName)
		{				
			var index = mocker.mockFunctionRecs.length;
			var mockFunctionRec = new MockRec();
			mocker.mockFunctionRecs[index] = mockFunctionRec;
			
			var fnStr = 'function(){return runner.mocker.mockFunctionCalled(index, arguments);}'.replace(/index/, index);
			
			linkPtr[functionName] = eval(fnStr);
			mocker.functionToMockFunctionRecsIndexMap[linkPtr[functionName]] = index;
			
			return mockFunctionRec;
		}				
}

function TestCaseCreator()
{
	var creator = this;
	
	creator.chainPattern = /\w+(\.\w+(\(.*\))?)+/g;
		
	creator.createTestCase = function(obj, objName, functionName, className)
		{			
			var initLines =  creator.getInitLines(objName, functionName, className);			
			var functionStr = creator.formatFunctionStr(obj[functionName].toString());
			var functionStrLines = creator.getFunctionStrLines(objName, functionName, functionStr);
			var params = creator.getParams(functionStr);
			var chains = creator.getChains(functionStr, params);
			var mockSetupLines = creator.getMockSetupLines(chains, params, objName);
			var mockLines = creator.getMockLines(chains);
			var functionCallLines = creator.getFunctionCallLines(params, objName, functionName);
			var assertLines = creator.getAssertLines(chains);
			
			var lines = initLines
							.concat([''])
							.concat(mockSetupLines)
							.concat([''])
							.concat(mockLines)
							.concat([''])
							.concat(functionStrLines)
							.concat([''])
							.concat(functionCallLines)							
							// JS code hinting makes writing the assert lines easy enough.  Let's try it without them.
							//.concat([''])
							//.concat(assertLines);		

			lines = lines.map(function(line){return '\t\t\t' + line + '\r\n'});	
			
			var functionSourceStr = ("runner.addTestCase(\r\n{\r\n\tname:\t'functionName',\r\n\r\n" + 
										"\ttest:\tfunction()\r\n\t\t{\r\nlines\t\t}\r\n});\r\n\r\n")
											.replace(/functionName/, functionName)
											.replace(/lines/, lines.join(''));

			return functionSourceStr;
		}		

	creator.formatFunctionStr = function(str)
		{
			return str.replace(/(\s*)\b(if|while|for)\b([^{]+){/g, '$1$2$3$1{').replace(/(function \([^{]*\) ){/, '$1\n{');
		}

	creator.getInitLines = function(objName, functionName, className)
		{
			return	[	"var objName = mocker.loadObject(new className(), 'functionName');"
							.replace(/className/, className)
							.replace(/objName/, objName)								
							.replace(/functionName/, functionName)
					];
		}		

	creator.getFunctionStrLines = function(objName, functionName, functionStr)
		{
			var functionStrLines = functionStr.match(/^.*$/gm);			
			functionStrLines[0] = objName + '.' + functionName + ' = ' + functionStrLines[0];			
			return functionStrLines;
		}
		
	creator.getParams = function(functionStr)
		{
			var paramStr = functionStr.substring(0, functionStr.indexOf('{'));
			paramStr = paramStr.substring(paramStr.indexOf('(') + 1, paramStr.indexOf(')'));
			paramStr = paramStr.replace(/ /g, '');
			var params = paramStr.split(',');
			return params;
		}

	creator.getChains = function(functionStr, params)
		{			
			var chains = [];
			
			creator.findChains(functionStr, chains);
			
			// Remove literal numbers that might have been recognized as chains, such as '0.45' or 1.6'
			
			chains = chains.filter(function(chain){return isNaN(chain.split('.')[0])});
			
			// Remove duplicate chains.
			
			var unique = {};  

			chains.forEach(function(chain){unique[chain] = true;});

			chains = [];
			
			for (var chain in unique)
  				chains.push(chain)
				
			return chains;
		}

	creator.removeLocals = function(functionStr, chains) // todo: remove this unused function?
		{			
			var locals = functionStr.match(/\bvar\s+\w+\b/g);
			
			if (!locals)
				locals = [];
			
			locals = locals.map(function(local){
					return local.replace(/var\s+/, '');
				});
			
			chains = chains.filter(function(chain){
					var root = chain.split('.')[0];
					return (locals.indexOf(root) == -1);
				});

			return chains;
		}
		
	creator.findChains = function(str, chains)
		{			
			var foundChains = str.match(creator.chainPattern);
			
			if (!foundChains) foundChains = [];

			var paramStrs = '';
									
			foundChains = foundChains.map(function(chain)
				// Remove parameters from chain, but save them off for recursive parsing.
				// Example, turn this: a.b(param1, param2()).c.d()
				// Into this: a.b().c.d()
				// And save this: param1, param2() in paramStrs
				{
					if (typeof chain != 'string')
						return '';

					var parenDepth = 0;
					var strOut = '';
					for (var i = 0; i < chain.length; i++)
					{
						var char = chain[i];
						if (char == '(')
							parenDepth++;
						else if (char == ')')
						{
							parenDepth--;
							paramStrs += ';';
						}
						if (parenDepth == 0 || (parenDepth == 1 && char == '('))
							strOut += char;
						else
							paramStrs += char;	
					}
					return strOut;
				});
										
			var foundParamChains = paramStrs.match(creator.chainPattern);
			
			if (foundParamChains)
				creator.findChains(paramStrs, chains);			
				
			foundChains.forEach(function(chain){chains.push(chain)});

		}

	creator.getMockSetupLines = function(chains, params, objName)
		{
			// Need to create a JS obj for every obj that starts a chain or is passed into the function under test,
			// except for the object under test, which we already know since it was passed in.
		
			var mockObjNames = {};
			var createCount = 0;
			
			chains.forEach(function(chain){
					var thisObjName = chain.substring(0, chain.indexOf('.'));
					if (thisObjName != objName)
					{
						createCount++;
						mockObjNames[thisObjName] = true;
					}
				});
				
			params.forEach(function(param){
					if (param != objName && param.length > 0)
					{
						createCount++;
						mockObjNames[param] = true;
					}
				});
			
			var mockSetupLines = [];
			
			for (var mockObjName in mockObjNames)
				mockSetupLines.push('var mockObjName = {};'.replace(/mockObjName/, mockObjName));	
			
			if (createCount > 0)
				mockSetupLines.push('');
				
			mockObjNames[objName] = true; // Now add the objName so we bind it.
			
			for (var mockObjName in mockObjNames)
				mockSetupLines.push("mocker.bindChainRootToObject('objName', objName);".replace(/objName/g, mockObjName));				

			return mockSetupLines;
		}

	creator.getMockLines = function(chains)
		{
			// The actual calls to make mock functions and properties.
				
			var mockLines = chains.map(function(chain)						
				{							
					return "mocker.mock('chain');".replace(/chain/, chain);
				});
				
			return mockLines;
		}
		
	creator.getFunctionCallLines = function(params, objName, functionName)
		{
			var functionCallLines = [	'var retVal = objName.functionName(params);'
											.replace(/objName/, objName)
											.replace(/functionName/, functionName)
											.replace(/params/, params.join(', '))
									];
									
			return functionCallLines;
		}

	creator.getAssertLines = function(chains)
		{
			var lineCount = 1;
			var assertLines = [];
		
			chains.forEach(function(chain)
			{
				var isFunction = chain.lastIndexOf('()') == (chain.length - 2);
				
				if (isFunction)
				{
					chain = chain.substring(0, chain.length - 2);
					
					assertLines.push('runner.assertCallCount(lineCount, chain, 1);'
						.replace(/lineCount/, lineCount++).replace(/chain/, chain));
					assertLines.push('runner.assertParamsPassedIn(lineCount, chain, []);'
						.replace(/lineCount/, lineCount++).replace(/chain/, chain));
				}					
				else
				{
					assertLines.push('runner.assertEqual(lineCount, chain, 1);'
						.replace(/lineCount/, lineCount++).replace(/chain/, chain));								
					assertLines.push("runner.assertStringsEqual(lineCount, chain, '');"
						.replace(/lineCount/, lineCount++).replace(/chain/, chain));								
				}						
				
			});
			
			assertLines.push('runner.assertEqual(lineCount, retVal, 1);'
				.replace(/lineCount/, lineCount++));								
			assertLines.push("runner.assertStringsEqual(lineCount, retVal, '');"
				.replace(/lineCount/, lineCount++));
		
			return assertLines;
		}
}