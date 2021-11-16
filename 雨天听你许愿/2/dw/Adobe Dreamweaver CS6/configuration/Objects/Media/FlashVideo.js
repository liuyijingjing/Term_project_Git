// Copyright 2005 Macromedia, Inc. All rights reserved.

// FlashVideo.js
//
// See Commands/FlashVideo.js for implementation of
// Insert Flash Video object
//
//
// ---- Object API ---
//
function objectTag()
{
    var dom = dw.getDocumentDOM();

    if (dom.getIsLibraryDocument())
    {
        alert(dw.loadString("flashvideo/cant insert into library"));
        return '';
    }

    if (dom.getIsTemplateDocument())
    {
        alert(dw.loadString("flashvideo/cant insert into template"));
        return '';
    }
    
    var theObj = dom.getSelectedNode();
    while (theObj) 
    {
        theObj = theObj.parentNode;
        if (theObj && theObj.nodeType == 1 && theObj.nodeName.toLowerCase() == "object") 
        {
            alert(dw.loadString("flashvideo/no flash video inside alt content"));
            return '';
        }
    }

    var filePath = dw.getDocumentPath("document");

    // save document if not saved
    if (!filePath) 
    {
        if (confirm(MSG_NeedToSaveDocumentForFlashVideoObj) && 
            dw.canSaveDocument(dreamweaver.getDocumentDOM())) 
        {
            dw.saveDocument(dreamweaver.getDocumentDOM());
            filePath = dw.getDocumentPath("document");
        }
    }
 
    if (!filePath)
        return '';

    dwscripts.callCommand("FlashVideo.htm");

    return "";
}
