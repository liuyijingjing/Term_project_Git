// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piSpryWidget;
var widgetGuide = MM.HELP_piSpryWidgetFieldGuide;

var WIDGET_ID;

// ********************* API FUNCTIONS ***************************

//--------------------------------------------------------------------
// FUNCTION:
//   canInspectSelection
//
// DESCRIPTION:
//   This is a Property Inspector API function that gets called
//   whenever the selection in the document changes to decide whether
//   or not this property inspector should be displayed.
//
// ARGUMENTS:
//  None
//
// RETURNS:
//   true if the currently selected node is a Spry widget; false
//   otherwise. This condition will match all Spry widgets, of course;
//   if another PI can also inspect the same selection and has a
//   higher priority (this inspector is priority 1), it will be
//   shown instead.
//--------------------------------------------------------------------

function canInspectSelection()
{
  var bCanInspectSelection = false;
  var dom = dw.getDocumentDOM();
  if (!dom)
      return false;
  var selectedNode = dom.getSelectedNode(true, false, true);
  
  var transAttrs;
  var attr;

  if( selectedNode && selectedNode.translatedAttributes )
  {
    transAttrs = selectedNode.translatedAttributes;
    for (var i=0; i < transAttrs.length; i++)
    {
      attr = transAttrs[i].name.toLowerCase();
      if (attr.indexOf('spry.widget') != -1)
      {
        bCanInspectSelection = true;
        break;
      } 
    }
  }

  return bCanInspectSelection; //comments in html file limit us to just one tag
}

//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   This is an internal utility function that searches through the
//   Property Inspector document to find all of the UI controls we
//   will programatically manipulate, and stores handles to them in
//   global variables which are used in some of the other functions
//   for this Property Inspector.
//
// ARGUMENTS:
//  None
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function initializeUI()
{
	WIDGET_ID = dwscripts.findDOMObject("idEditBox");
	if (WIDGET_ID) {
		WIDGET_ID.value = "";
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   inspectSelection
//
// DESCRIPTION:
//   This is a Property Inspector API function that gets called
//   whenever the selection in the document has changed and it has
//   been decided that this Property Inspector should be displayed.
//   This function syncs up the Property Inspector UI with the
//   widget's design-time object so that it accurately reflects
//   what is in the widget HTML markup and its JS constructor.
//
// ARGUMENTS:
//  None
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function inspectSelection()
{
	// Call initializeUI() here; it's how the global variables get
	// initialized. The onLoad event on the body tag is never triggered
	// in inspectors.
	initializeUI();

	var dom = dw.getDocumentDOM();
	var selectedNode = dom.getSelectedNode(true, false, true);
	if (!canInspectSelection())
		return;

	var divId = selectedNode.id;
	// the ID
	WIDGET_ID.value = divId;

	var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateTag
//
// DESCRIPTION:
//   This function updates the HTML and/or JavaScript code in the user's
//   document when information in the PI's edit fields changes.
//
// ARGUMENTS:
//  attrib - string - The field that has just changed.
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function updateTag(attrib)
{
	var dom = dw.getDocumentDOM();
	var selectedNode = dom.getSelectedNode(true, false, true);
	if (!canInspectSelection())
		return;

	var divId = selectedNode.id;
	var widgetType = "";
  if (selectedNode && selectedNode.getTranslatedAttribute)
  {
    widgetType = selectedNode.getTranslatedAttribute("outline");
    if (widgetType && widgetType.length > 0)
    {
      var colon = widgetType.indexOf(':');
      if (colon != -1)
        widgetType = widgetType.substring(0,colon);
    }
  }

	var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
	var widgetObj = widgetMgr.getWidget(widgetType, divId );
	if( !widgetObj )
	{
	  dw.trace("\nPI: widgetObj does not exist. returning.\n");
		return;
	}

	if (attrib)
	{
		switch (attrib)
		{
			case "id":
			{
				//validate the new id
				var newId = WIDGET_ID.value;
				if( newId == divId )
					return; //nothing to change

				if( newId.length == 0 )
				{
					alert(dw.loadString("spry/widget/alert/need unique id"));
					return;
				}

				if( dom.getElementById(newId) )
				{
					alert(dw.loadString("spry/widget/alert/id already exists"));
					return;
				}

				if( !dwscripts.isValidID(newId) )
				{
					alert(dw.loadString("spry/widget/alert/id is invalid"));
					return;
				}

				// update both the HTML and the JS constructor with 
				// the new id.
				widgetObj.updateId(newId);
				// alert the widgetMgr that the id has changed
				widgetMgr.setWidget(widgetType, newId, widgetObj );
				// re-run the translator
				dom.runTranslator("Spry Widget");
			}
			break;
		}
 	}

    // reset the selection to the node we started with (in case we made an edit
    // to a child or parent tag)
    dom.setSelectedNode(selectedNode);
    // re-inspect the selection.
		inspectSelection();
}


