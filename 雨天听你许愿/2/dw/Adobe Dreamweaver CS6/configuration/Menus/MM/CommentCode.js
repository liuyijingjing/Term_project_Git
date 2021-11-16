// Copyright 2007 Adobe Systems Incorporated All Rights Reserved.

function receiveArguments()
{
    var dom;
    
    if (dw.getFocus(true) == 'html')
        dom = dw.getActiveWindow();
    else
        dom = dw.getDocumentDOM();

	if (dom)
	{
	    var commentType = arguments[0];
	    
	    switch (commentType) 
	    {
		    case "HTMLComment": dom.source.applyComment('<!--', '-->'); break;
		    case "JSBlockComment": dom.source.applyComment('/*', '*/'); break;
		    case "JSComment": dom.source.applyComment('//', ''); break;
		    case "VBComment": dom.source.applyComment('\'', ''); break;
		    case "Remove": dom.source.removeComment(); break;
	    }
	}	
}

function isDOMRequired()
{
	return false;
}

function canAcceptCommand()
{
    return (dw.getFocus(true) == 'textView' || dw.getFocus(true) == 'html');
}
