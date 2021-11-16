// Copyright 2006-2007 Adobe Systems Incorporated.  All rights reserved.

var helpDoc = MM.HELP_piMenuBar;
var widgetGuide = MM.HELP_piMenuBarGuide;

var MENUBAR_ID;
var STYLE_TOGGLE;
var RESET_SELECTION;
var SELECTED_NODE = false;
var ADD1;
var DEL1;
var UP1;
var DOWN1;
var LIST_MENU1;
var ADD2;
var DEL2;
var UP2;
var DOWN2;
var LIST_MENU2;
var ADD3;
var DEL3;
var UP3;
var DOWN3;
var LIST_MENU3;
var TEXT;
var LINK;
var TITLE;
var TARGET;
var SECTION_DETAILS;
var SECTION_ERROR;
var ALREADY_INITIALIZED = false;
var ALREADY_INSPECTING_SELECTION = false;

// ******************** API ****************************

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
//   true if the currently selected node is a MenuBar element,
//   false if it is not.
//--------------------------------------------------------------------

function canInspectSelection()
{
  var bCanInspectSelection = false;
  var dom = dw.getDocumentDOM();
  var selectedNode = dom.getSelectedNode();

  if ( !selectedNode || !selectedNode.getTranslatedAttribute )
    return false;
  
  var attr = selectedNode.getTranslatedAttribute('Spry.Widget.MenuBar');
  
  if( attr && attr.length > 0 )
  {
	  bCanInspectSelection = true;
	  
	  //if the widget manager is out of sync, run the translator
	  var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom); 
	  if( !widgetMgr.getWidget('Spry.Widget.MenuBar', selectedNode.id ) )
	  {
	  	dom.runTranslator("Spry Widget");
	    if( !widgetMgr.getWidget('Spry.Widget.MenuBar', selectedNode.id ) )
		{
			//If we can't get it now there's some error where the translator is
			//marking this as found, but the widget manager isn't finding it
			bCanInspectSelection = false;
		}
	  }	
  }

  return bCanInspectSelection;
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
//   for this Property Inspector.  This also stores this item's data
//   with this widget's object.
//
// ARGUMENTS:
//  None
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function initializeUI() 
{
	var dom = dw.getDocumentDOM();
	var selectedNode = dom.getSelectedNode();
	if(ALREADY_INITIALIZED != dom || (selectedNode != null && selectedNode.tagName == "UL" && SELECTED_NODE != selectedNode))
	{
		if( selectedNode != null )
		{
			var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
			var menu = widgetMgr.getWidget('Spry.Widget.MenuBar', selectedNode.id);
			if( typeof menu.MenuBar == 'undefined' ) menu.MenuBar = {};
			if( typeof menu.MenuBar.pi == 'undefined' ) menu.MenuBar.pi = {};
			if( typeof menu.MenuBar.pi.stylesOff == 'undefined' ) menu.MenuBar.pi.stylesOff = false;
			if( typeof menu.MenuBar.pi.selList == 'undefined' ) menu.MenuBar.pi.selList = 1;
			if( typeof menu.MenuBar.pi.selMenu == 'undefined' ) menu.MenuBar.pi.selMenu = null;
			if( typeof menu.MenuBar.pi.list1 == 'undefined' ) menu.MenuBar.pi.list1 = {};
			if( typeof menu.MenuBar.pi.list1.selIndex == 'undefined' ) menu.MenuBar.pi.list1.selIndex = 0;
			if( typeof menu.MenuBar.pi.list2 == 'undefined' ) menu.MenuBar.pi.list2 = {};
			if( typeof menu.MenuBar.pi.list2.selIndex == 'undefined' ) menu.MenuBar.pi.list2.selIndex = -1;
			if( typeof menu.MenuBar.pi.list3 == 'undefined' ) menu.MenuBar.pi.list3 = {};
			if( typeof menu.MenuBar.pi.list3.selIndex == 'undefined' ) menu.MenuBar.pi.list3.selIndex = -1;
		}

		ALREADY_INITIALIZED = dom;
		SELECTED_NODE = selectedNode;
		RESET_SELECTION = false;

		MENUBAR_ID = dwscripts.findDOMObject("menubarID");
		STYLE_TOGGLE = dwscripts.findDOMObject("elemStyles");
		ADD1 = dwscripts.findDOMObject("elemAdd1");
		DEL1 = dwscripts.findDOMObject("elemDel1");
		UP1 = dwscripts.findDOMObject("elemUp1");
		DOWN1 = dwscripts.findDOMObject("elemDown1");
		LIST_MENU1 = new ListControl("elemList1");
		ADD2 = dwscripts.findDOMObject("elemAdd2");
		DEL2 = dwscripts.findDOMObject("elemDel2");
		UP2 = dwscripts.findDOMObject("elemUp2");
		DOWN2 = dwscripts.findDOMObject("elemDown2");
		LIST_MENU2 = new ListControl("elemList2");
		ADD3 = dwscripts.findDOMObject("elemAdd3");
		DEL3 = dwscripts.findDOMObject("elemDel3");
		UP3 = dwscripts.findDOMObject("elemUp3");
		DOWN3 = dwscripts.findDOMObject("elemDown3");
		LIST_MENU3 = new ListControl("elemList3");
		TEXT = dwscripts.findDOMObject("text");
		LINK = dwscripts.findDOMObject("link");
		TITLE = dwscripts.findDOMObject("title");
		TARGET = dwscripts.findDOMObject("target");
		SECTION_DETAILS = dwscripts.findDOMObject("menudetails");
		SECTION_ERROR = dwscripts.findDOMObject("menuerror");

		MENUBAR_ID.value = "";
		TEXT.value = "";
		LINK.value = "";
		TITLE.value = "";
		TARGET.value = "";
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
	if(!ALREADY_INSPECTING_SELECTION)
	{
		ALREADY_INSPECTING_SELECTION = true;
		
		// Call initializeUI() here; it's how the global variables get
		// initialized. The onLoad event on the body tag is never triggered
		// in inspectors.
		initializeUI();

		var dom = dw.getDocumentDOM();
		var selectedNode = dom.getSelectedNode();
		if ((selectedNode == null) && (selectedNode.tagName != "UL"))
			return;

		//display the ID
		MENUBAR_ID.value = selectedNode.id;

		//enumerate over the list of menu items
		var menuLabels = new Array();
		var items = selectedNode.getElementsByTagName('li');
		for(var i=0; i<items.length; i++)
		{
			var parentList = items[i].parentNode;
			while(parentList && parentList.tagName != "UL")
			{
				parentList = parentList.parentNode;
			}
			if(parentList == selectedNode)
			{
				menuLabels.push(getLinkTextFromItem(items[i]));
			}
		}

		if(RESET_SELECTION == false)
		{
			LIST_MENU1.setAll(menuLabels, menuLabels);
			var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom);
			var menu = widgetMgr.getWidget('Spry.Widget.MenuBar', selectedNode.id);
			var list1sel = menu.MenuBar.pi.list1.selIndex;
			var list2sel = menu.MenuBar.pi.list2.selIndex;
			var list3sel = menu.MenuBar.pi.list3.selIndex;
			var translatedClass = SELECTED_NODE.getTranslatedAttribute("class");
			menu.MenuBar.pi.stylesOff = (translatedClass && translatedClass.length ? false : true);
			STYLE_TOGGLE.value = (menu.MenuBar.pi.stylesOff ? dw.loadString("spry/widget/turn styles/on") : dw.loadString("spry/widget/turn styles/off"));
			LIST_MENU1.setIndex(list1sel);
			switch(menu.MenuBar.pi.selList)
			{
				case 1:
					updateTag('list1Selected');
					LIST_MENU2.setIndex(list2sel);
					break;
				case 2:
					updateTag('list1Selected');
					LIST_MENU2.setIndex(list2sel);
					updateTag('list2Selected');
					LIST_MENU3.setIndex(list3sel);
					break;
				case 3:
					updateTag('list1Selected');
					LIST_MENU2.setIndex(list2sel);
					updateTag('list2Selected');
					LIST_MENU3.setIndex(list3sel);
					updateTag('list3Selected');
					break;
			}
		}
		else
		{
			RESET_SELECTION = false;
		}
	}
	ALREADY_INSPECTING_SELECTION = false;
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateTag
//
// DESCRIPTION:
//   This function handles all of the user actions triggered by the
//   user from the Propery Inspector controls.
//
// ARGUMENTS:
//  attrib - string - represents which list menu is being operated on
//  and in what way, or can be related to edit fields, links, or
//  buttons.  Each of these user actions is handled in the switch
//  statement below but only after making sure everything is as it
//  should be.
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function updateTag(attrib)
{
	var dom = dw.getDocumentDOM();
	var selectedNode = dom.getSelectedNode();
	if ((selectedNode == null) || (selectedNode.tagName != "UL"))
		return;

	var ulId = selectedNode.id;

	var items = selectedNode.getElementsByTagName('li');
	if(items.length == 0 && attrib != "addItem1" && attrib != "id" && attrib != "guide")
	{
		// clear everything out and disable buttons appropriately
		LIST_MENU1.setAll({}, {});
		LIST_MENU1.setIndex(-1);
		enableButtonsForListSelected(1);
		LIST_MENU2.setAll({}, {});
		LIST_MENU2.setIndex(-1);
		enableButtonsForListSelected(2);
		LIST_MENU3.setAll({}, {});
		LIST_MENU3.setIndex(-1);
		enableButtonsForListSelected(3);
		return;
	}
	
	var widgetMgr = Spry.DesignTime.Widget.Manager.getManagerForDocument(dom); 
	var menu = widgetMgr.getWidget('Spry.Widget.MenuBar', ulId );
	if(menu == null || menu.MenuBar == null)
	{
		return;
	}
	else if(!dw.nodeExists(menu.MenuBar.pi.selMenu))
	{
		inspectSelection();
	}

	if (attrib)
	{
		// build out lists of items
		var list1Items = new Array();
		var list2Items = new Array();
		var list3Items = new Array();

		getList1Items(list1Items, items, selectedNode, menu);
		getList2Items(list2Items, list1Items, menu);
		getList3Items(list3Items, list2Items, menu);

		switch (attrib)
		{
			case "list1Selected":
			{
				list1Selected(list1Items, list2Items, menu);
			}
			break;

			case "list2Selected":
			{
				list2Selected(list2Items, list3Items, menu);
			}
			break;

			case "list3Selected":
			{
				list3Selected(list3Items, menu);
			}
			break;

			case "addItem1":
			{
				//add new menu item after the current selection
				var selItem = list1Items[menu.MenuBar.pi.list1.selIndex];
				if(selItem)
				{
					// add after current item
					selItem.outerHTML = selItem.outerHTML + menu.newMenuItemSnippet;
					menu.MenuBar.pi.list1.selIndex++;
				}
				else
				{
					//no items, add inside the main element
					selectedNode.innerHTML = menu.newMenuItemSnippet;

					list1Items.push(selectedNode.getElementsByTagName('li')[0]);
					menu.MenuBar.pi.list1.selIndex = 0;
				}
				items = selectedNode.getElementsByTagName('li');
				LIST_MENU1.setAll({}, {});
				getList1Items(list1Items, items, selectedNode, menu);
				getList2Items(list2Items, list1Items, menu);
				list1Selected(list1Items, list2Items, menu);
			}
			break;

			case "deleteItem1":
			{
				//delete the currently selected item
				var selItem = list1Items[menu.MenuBar.pi.list1.selIndex];
				var confirmed = true;
				if(selItem.getElementsByTagName('ul').length)
				{
					confirmed = confirm(dw.loadString("spry/widgets/menubar/confirm/delete"));
				}
				if(confirmed)
				{
					selItem.outerHTML = "";
					
					var newMenuLength = list1Items.length - 1;
					if( newMenuLength <= menu.MenuBar.pi.list1.selIndex )
						menu.MenuBar.pi.list1.selIndex = newMenuLength - 1;
					items = selectedNode.getElementsByTagName('li');
					LIST_MENU1.setAll({}, {});
					LIST_MENU1.setIndex(-1);
					getList1Items(list1Items, items, selectedNode, menu);
					getList2Items(list2Items, list1Items, menu);
					list1Selected(list1Items, list2Items, menu);
				}
			}
			break;
			
			case "moveItem1Up":
			{
				if( menu.MenuBar.pi.list1.selIndex > 0 )
				{
					var selItem = list1Items[menu.MenuBar.pi.list1.selIndex];
					var siblingItem = list1Items[menu.MenuBar.pi.list1.selIndex-1];
					
					var tempHTML = selItem.outerHTML;
					selItem.outerHTML = siblingItem.outerHTML;
					siblingItem.outerHTML = tempHTML;
					
					var setIndex = menu.MenuBar.pi.list1.selIndex-1;

					items = selectedNode.getElementsByTagName('li');
					LIST_MENU1.setAll({}, {});
					LIST_MENU1.setIndex(-1);
					getList1Items(list1Items, items, selectedNode, menu);
					menu.MenuBar.pi.list1.selIndex = setIndex;
					getList2Items(list2Items, list1Items, menu);
					list1Selected(list1Items, list2Items, menu);
				}
			}
			break;
			
			case "moveItem1Down":
			{
				if( menu.MenuBar.pi.list1.selIndex+1 < list1Items.length )
				{
					var selItem = list1Items[menu.MenuBar.pi.list1.selIndex];
					var siblingItem = list1Items[menu.MenuBar.pi.list1.selIndex+1];
					
					var tempHTML = selItem.outerHTML;
					selItem.outerHTML = siblingItem.outerHTML;
					siblingItem.outerHTML = tempHTML;
					
					var setIndex = menu.MenuBar.pi.list1.selIndex+1;
					
					items = selectedNode.getElementsByTagName('li');
					LIST_MENU1.setAll({}, {});
					LIST_MENU1.setIndex(-1);
					getList1Items(list1Items, items, selectedNode, menu);
					menu.MenuBar.pi.list1.selIndex = setIndex;
					getList2Items(list2Items, list1Items, menu);
					list1Selected(list1Items, list2Items, menu);
				}
			}
			break;
			
			case "addItem2":
			{
				//add new menu item after the current selection
				var sel2Index = (list2Items.length ? (menu.MenuBar.pi.list2.selIndex >= 0 ? menu.MenuBar.pi.list2.selIndex : list2Items.length-1) : -1);
				var selItem = (sel2Index >= 0 ? list2Items[sel2Index] : null);
				if(selItem)
				{
					// add after current item
					selItem.outerHTML = selItem.outerHTML + menu.newMenuItemSnippet;
					sel2Index++;
				}
				else
				{
					// set that our parent now has children
					var linkTag = getLinkFromItem(list1Items[menu.MenuBar.pi.list1.selIndex]);
					if(linkTag)
					{
						linkTag.className += (linkTag.className == '' ? '' : ' ') + 'MenuBarItemSubmenu';
						// add inside the main element
						linkTag.outerHTML = linkTag.outerHTML + menu.newMenuSnippet;
					}
					list2Items.push(list1Items[menu.MenuBar.pi.list1.selIndex].getElementsByTagName('li')[0]);
				}
				getList2Items(list2Items, list1Items, menu);
				list1Selected(list1Items, list2Items, menu);
				menu.MenuBar.pi.list2.selIndex = sel2Index;
				LIST_MENU2.setIndex(menu.MenuBar.pi.list2.selIndex);
				list2Selected(list2Items, list3Items, menu);
			}
			break;

			case "deleteItem2":
			{
				//delete the currently selected item
				var selItem = list2Items[menu.MenuBar.pi.list2.selIndex];
				var sel2Index = menu.MenuBar.pi.list2.selIndex;
				var confirmed = true;
				if(selItem.getElementsByTagName('ul').length)
				{
					confirmed = confirm(dw.loadString("spry/widgets/menubar/confirm/delete"));
				}
				if(confirmed)
				{
					if(list2Items.length == 1)
					{
						var parentList = selItem.parentNode;
						while(parentList && parentList.tagName != "UL")
						{
							parentList = parentList.parentNode;
						}
						if(parentList)
						{
							selItem = parentList;
						}
					}
					selItem.outerHTML = "";
					
					var newMenuLength = list2Items.length - 1;
					if( newMenuLength <= sel2Index )
						sel2Index = newMenuLength - 1;
	
					if(sel2Index == -1)
					{
						var linkTag = getLinkFromItem(list1Items[menu.MenuBar.pi.list1.selIndex]);
						if(linkTag)
						{
							var newClassName = linkTag.className.replace(/\s*\bMenuBarItemSubmenu\b/g, '');
							if(newClassName.length == 0)
							{
								linkTag.removeAttribute("class");
							}
							else
							{
								linkTag.className = newClassName;
							}
						}
					}
					getList2Items(list2Items, list1Items, menu);
					getList3Items(list3Items, list2Items, menu);
					list1Selected(list1Items, list2Items, menu);
					menu.MenuBar.pi.list2.selIndex = sel2Index;
					LIST_MENU2.setIndex(menu.MenuBar.pi.list2.selIndex);
					list2Selected(list2Items, list3Items, menu);
				}
			}
			break;
			
			case "moveItem2Up":
			{
				if( menu.MenuBar.pi.list2.selIndex > 0 )
				{
					var selItem = list2Items[menu.MenuBar.pi.list2.selIndex];
					var siblingItem = list2Items[menu.MenuBar.pi.list2.selIndex-1];
					
					var tempHTML = selItem.outerHTML;
					selItem.outerHTML = siblingItem.outerHTML;
					siblingItem.outerHTML = tempHTML;
					
					var setIndex = menu.MenuBar.pi.list2.selIndex-1;

					list1Selected(list1Items, list2Items, menu);
					getList2Items(list2Items, list1Items, menu);
					menu.MenuBar.pi.list2.selIndex = setIndex;
					getList3Items(list3Items, list2Items, menu);
					list2Selected(list2Items, list3Items, menu);
				}
			}
			break;
			
			case "moveItem2Down":
			{
				if( menu.MenuBar.pi.list2.selIndex+1 < list2Items.length )
				{
					var selItem = list2Items[menu.MenuBar.pi.list2.selIndex];
					var siblingItem = list2Items[menu.MenuBar.pi.list2.selIndex+1];
					
					var tempHTML = selItem.outerHTML;
					selItem.outerHTML = siblingItem.outerHTML;
					siblingItem.outerHTML = tempHTML;
					
					var setIndex = menu.MenuBar.pi.list2.selIndex+1;

					list1Selected(list1Items, list2Items, menu);
					getList2Items(list2Items, list1Items, menu);
					menu.MenuBar.pi.list2.selIndex = setIndex;
					getList3Items(list3Items, list2Items, menu);
					list2Selected(list2Items, list3Items, menu);
				}
			}
			break;
			
			case "addItem3":
			{
				//add new menu item after the current selection
				var sel3Index = (list3Items.length ? (menu.MenuBar.pi.list3.selIndex >= 0 ? menu.MenuBar.pi.list3.selIndex : list3Items.length-1) : -1);
				var selItem = (sel3Index >= 0 ? list3Items[sel3Index] : null);
				if(selItem)
				{
					// add after current item
					selItem.outerHTML = selItem.outerHTML + menu.newMenuItemSnippet;
					sel3Index++;
				}
				else
				{
					// set that our parent now has children
					var linkTag = getLinkFromItem(list2Items[menu.MenuBar.pi.list2.selIndex]);
					if(linkTag)
					{
						linkTag.className += (linkTag.className == '' ? '' : ' ') + 'MenuBarItemSubmenu';
						// add inside the main element
						linkTag.outerHTML = linkTag.outerHTML + menu.newMenuSnippet;
					}
					list3Items.push(list2Items[menu.MenuBar.pi.list2.selIndex].getElementsByTagName('li')[0]);
				}
				getList3Items(list3Items, list2Items, menu);
				list2Selected(list2Items, list3Items, menu);
				menu.MenuBar.pi.list3.selIndex = sel3Index;
				LIST_MENU3.setIndex(menu.MenuBar.pi.list3.selIndex);
				list3Selected(list3Items, menu);
			}
			break;

			case "deleteItem3":
			{
				//delete the currently selected item
				var selItem = list3Items[menu.MenuBar.pi.list3.selIndex];
				var sel3Index = menu.MenuBar.pi.list3.selIndex;
				var confirmed = true;
				if(selItem.getElementsByTagName('ul').length)
				{
					confirmed = confirm(dw.loadString("spry/widgets/menubar/confirm/delete"));
				}
				if(confirmed)
				{
					if(list3Items.length == 1)
					{
						var parentList = selItem.parentNode;
						while(parentList && parentList.tagName != "UL")
						{
							parentList = parentList.parentNode;
						}
						if(parentList)
						{
							selItem = parentList;
						}
					}
					selItem.outerHTML = "";
					
					var newMenuLength = list3Items.length - 1;
					if( newMenuLength <= sel3Index )
						sel3Index = newMenuLength - 1;
	
					if(sel3Index == -1)
					{
						var linkTag = getLinkFromItem(list2Items[menu.MenuBar.pi.list2.selIndex]);
						if(linkTag)
						{
							var newClassName = linkTag.className.replace(/\s*\bMenuBarItemSubmenu\b/g, '');
							if(newClassName.length == 0)
							{
								linkTag.removeAttribute("class");
							}
							else
							{
								linkTag.className = newClassName;
							}
						}
					}
					getList3Items(list3Items, list2Items, menu);
					list2Selected(list2Items, list3Items, menu);
					menu.MenuBar.pi.list3.selIndex = sel3Index;
					LIST_MENU3.setIndex(menu.MenuBar.pi.list3.selIndex);
					list3Selected(list3Items, menu);
				}
			}
			break;

			case "moveItem3Up":
			{
				if( menu.MenuBar.pi.list3.selIndex > 0 )
				{
					var selItem = list3Items[menu.MenuBar.pi.list3.selIndex];
					var siblingItem = list3Items[menu.MenuBar.pi.list3.selIndex-1];
					
					var tempHTML = selItem.outerHTML;
					selItem.outerHTML = siblingItem.outerHTML;
					siblingItem.outerHTML = tempHTML;

					var setIndex = menu.MenuBar.pi.list3.selIndex-1;

					list2Selected(list2Items, list3Items, menu);
					getList3Items(list3Items, list2Items, menu);
					menu.MenuBar.pi.list3.selIndex = setIndex;
					list3Selected(list3Items, menu);
				}
			}
			break;
			
			case "moveItem3Down":
			{
				if( menu.MenuBar.pi.list3.selIndex+1 < list3Items.length )
				{
					var selItem = list3Items[menu.MenuBar.pi.list3.selIndex];
					var siblingItem = list3Items[menu.MenuBar.pi.list3.selIndex+1];
					
					var tempHTML = selItem.outerHTML;
					selItem.outerHTML = siblingItem.outerHTML;
					siblingItem.outerHTML = tempHTML;

					var setIndex = menu.MenuBar.pi.list3.selIndex+1;

					list2Selected(list2Items, list3Items, menu);
					getList3Items(list3Items, list2Items, menu);
					menu.MenuBar.pi.list3.selIndex = setIndex;
					list3Selected(list3Items, menu);
				}
			}
			break;
			
			case "id":
			{
				//validate the new id
				var newId = MENUBAR_ID.value;
				if( newId == ulId )
					break; //nothing to change
				
				if( newId.length == 0 )
				{
					alert(dw.loadString("spry/widget/alert/need unique id"));
					break;
				}
				if( !dwscripts.isValidID(newId) )
				{
					alert(dw.loadString("spry/widget/alert/id is invalid"));
					break;
				}
				
				if( dom.getElementById(newId) )
				{
					alert(dw.loadString("spry/widget/alert/id already exists"));
					break;
				}
				
				//new ID looks good change the constructor
				selectedNode.id = newId;
				menu.updateId(newId);
				//update the WidgetManager for the new ID
				widgetMgr.setWidget('Spry.Widget.MenuBar', newId, menu );
				widgetMgr.deleteWidget('Spry.Widget.MenuBar', ulId);
			}
			break;
			
			case "guide":
			{
				dwscripts.displayDWHelp(widgetGuide);
			}
			break;
			
			case "toggleStyles":
			{
				// turn on or off styles
				if(menu.MenuBar.pi.stylesOff)
				{
					// we want to turn the styles on
					menu.clearTranslatedNodes();
					STYLE_TOGGLE.value = dw.loadString("spry/widget/turn styles/off");
				}
				else
				{
					// we want to turn the styles off
					menu.clearTranslatedNodes(selectedNode);
					menu.addTranslatedNode(selectedNode, "");
					STYLE_TOGGLE.value = dw.loadString("spry/widget/turn styles/on");
				}
				menu.MenuBar.pi.stylesOff = !menu.MenuBar.pi.stylesOff;
			}
			break;
			
			case "text":
			{
				// determine which menu item we're editing
				if(menu.MenuBar.pi.selMenu)

				{
					var newText = TEXT.value;
					var encodedNewText = dwscripts.entityNameEncode(TEXT.value);
					if(encodedNewText == menu.MenuBar.pi.selMenu.innerHTML)
						break; // nothing to change
					
					if(newText.length == 0)
					{
						alert(dw.loadString("spry/widgets/menubar/error/text/empty"));
						break;
					}
					
					menu.MenuBar.pi.selMenu.innerHTML = encodedNewText;
					switch(menu.MenuBar.pi.selList)
					{
						case 1:
							LIST_MENU1.set(newText);
							break;
						case 2:
							LIST_MENU2.set(newText);
							break;
						case 3:
							LIST_MENU3.set(newText);
					}
				}
			}
			break;
			
			case "link":
			{
				// determine which menu item we're editing
				if(menu.MenuBar.pi.selMenu)
				{
					var newLink = LINK.value;
					if(newLink == menu.MenuBar.pi.selMenu.href)
						break; // nothing to change
					
					if(newLink.length == 0)
					{
						alert(dw.loadString("spry/widgets/menubar/error/link/empty"));
						break;
					}
					
					menu.MenuBar.pi.selMenu.href = newLink;
				}
			}
			break;
			
			case "browse":
			{
				var newLink = dw.browseForFileURL();
				if(newLink && menu.MenuBar.pi.selMenu)
				{
					if(newLink == menu.MenuBar.pi.selMenu.href)
						break; // nothing to change
					
					if(newLink.length == 0)
					{
						alert(dw.loadString("spry/widgets/menubar/error/link/empty"));
						break;
					}
					
					menu.MenuBar.pi.selMenu.href = LINK.value = newLink;
				}
			}
			break;
			
			case "title":
			{
				// determine which menu item we're editing
				if(menu.MenuBar.pi.selMenu)
				{
					var newTitle = TITLE.value;
					if(newTitle == menu.MenuBar.pi.selMenu.title)
						break; // nothing to change

					// Fix for Bug 215226:
					//
					// Use setAttribute/removeAttribute instead of manipulating
					// the title or target property on the DOM node to avoid an
					// outerHTML bug where title and target properties don't get
					// cleared even when the node.outerHTML is set to markup
					// that contains no title or target attributes.

					if(newTitle.length == 0)
						menu.MenuBar.pi.selMenu.removeAttribute('title');
					else
						menu.MenuBar.pi.selMenu.setAttribute('title', newTitle);
				}
			}
			break;
			
			case "target":
			{
				// determine which menu item we're editing
				if(menu.MenuBar.pi.selMenu)
				{
					var newTarget = TARGET.value;
					if(newTarget == menu.MenuBar.pi.selMenu.target)
						break; // nothing to change
					
					// Fix for Bug 215226:
					//
					// Use setAttribute/removeAttribute instead of manipulating
					// the title or target property on the DOM node to avoid an
					// outerHTML bug where title and target properties don't get
					// cleared even when the node.outerHTML is set to markup
					// that contains no title or target attributes.

					if(newTarget.length == 0)
						menu.MenuBar.pi.selMenu.removeAttribute('target');
					else
						menu.MenuBar.pi.selMenu.setAttribute('target', newTarget);
				}
			}
			break;
		}

		//all these edits modify the MenuBar. We need to recreate the JS Object to reflect those changes
		if(menu)
		{
			menu.refresh();
		}
	}

	RESET_SELECTION = true;
	if(dom.getActiveView() == "design")
	{
		//make sure selection stays on the UL
		dom.setSelectedNode(selectedNode);
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   getList1Items
//
// DESCRIPTION:
//   This internal utility function gets the list item nodes in list
//   menu 1.
//
// ARGUMENTS:
//  list1Items - array - will contain the dom nodes representing <li> tags
//  items - array - all <li> tags in Menu Bar
//  selectedNode - node - outermost <ul> of Menu Bar
//  menu - MenuBar - representation of this Menu Bar
//
// RETURNS:
//   list1Items is the list of immediate <li> tags from the top level
//--------------------------------------------------------------------

function getList1Items(list1Items, items, selectedNode, menu)
{
	var dom = dw.getDocumentDOM();
	list1Items.length = 0;
	var menuLabels = new Array();
	for(var i=0; i<items.length; i++)
	{
		var parentList = items[i].parentNode;
		while(parentList && parentList.tagName != "UL")
		{
			parentList = parentList.parentNode;
		}
		if(parentList == selectedNode)
		{
			list1Items.push(items[i]);
			menuLabels.push(getLinkTextFromItem(items[i]));
		}
	}
	if(LIST_MENU1.getLen() == 0)
	{
		LIST_MENU1.setAll(menuLabels, menuLabels);
		LIST_MENU1.setIndex(menu.MenuBar.pi.list1.selIndex);
	}
	menu.MenuBar.pi.list1.selIndex = LIST_MENU1.getIndex();
}

//--------------------------------------------------------------------
// FUNCTION:
//   getList2Items
//
// DESCRIPTION:
//   This internal utility function gets the list item nodes in list
//   menu 2.
//
// ARGUMENTS:
//  list2Items - array - will contain the dom nodes representing <li> tags
//  list1Items - array - contains the dom nodes representing top level <li> tags
//  menu - MenuBar - representation of this Menu Bar
//
// RETURNS:
//   list2Items is the list of <li> tags represented in the second level
//--------------------------------------------------------------------

function getList2Items(list2Items, list1Items, menu)
{
	var dom = dw.getDocumentDOM();
	list2Items.length = 0;
	var selItem = (list1Items.length && 0 <= menu.MenuBar.pi.list1.selIndex && menu.MenuBar.pi.list1.selIndex < list1Items.length ? list1Items[menu.MenuBar.pi.list1.selIndex].getElementsByTagName('ul') : {});
	selItem = (selItem.length ? selItem[0] : null);
	var items2 = (selItem ? selItem.getElementsByTagName('li') : {});
   	menu.MenuBar.pi.list2.selIndex = LIST_MENU2.getIndex();
	LIST_MENU2.setIndex(menu.MenuBar.pi.list2.selIndex);
	for(var i=0; i<items2.length; i++)
	{
		var parentList = items2[i].parentNode;
		while(parentList && parentList.tagName != "UL")
		{
			parentList = parentList.parentNode;
		}
		if(parentList == selItem)
		{
			list2Items.push(items2[i]);
		}
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   getList3Items
//
// DESCRIPTION:
//   This internal utility function gets the list item nodes in list
//   menu 3.
//
// ARGUMENTS:
//  list3Items - array - will contain the dom nodes representing <li> tags
//  list2Items - array - contains the dom nodes representing second level <li> tags
//  menu - MenuBar - representation of this Menu Bar
//
// RETURNS:
//   list3Items is the list of <li> tags represented in the third and last level
//--------------------------------------------------------------------

function getList3Items(list3Items, list2Items, menu)
{
	var dom = dw.getDocumentDOM();
	list3Items.length = 0;
	var selItem = (list2Items.length && 0 <= menu.MenuBar.pi.list2.selIndex && menu.MenuBar.pi.list2.selIndex < list2Items.length ? list2Items[menu.MenuBar.pi.list2.selIndex].getElementsByTagName('ul') : {});
	selItem = (selItem.length ? selItem[0] : null);
	var items3 = (selItem ? selItem.getElementsByTagName('li') : {});
	menu.MenuBar.pi.list3.selIndex = LIST_MENU3.getIndex();
	LIST_MENU3.setIndex(menu.MenuBar.pi.list3.selIndex);
	for(var i=0; i<items3.length; i++)
	{
		var parentList = items3[i].parentNode;
		while(parentList && parentList.tagName != "UL")
		{
			parentList = parentList.parentNode;
		}
		if(parentList == selItem)
		{
			list3Items.push(items3[i]);
		}
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   list1Selected
//
// DESCRIPTION:
//   This internal utility function handles the case of list menu 1
//   being selected.  It determines if everything is as it should be.
//   Sets the index of the list menu appropriately, and the next menu.
//   It enables the buttons associated with this list menu appropriately
//   and sets all of the edit fields appropriately for the selection.
//   Finally, the design view representation is changed by hiding all
//   submenus.
//
// ARGUMENTS:
//  list1Items - array - contains the dom nodes representing top level <li> tags
//  list2Items - array - will contain the dom nodes representing second level <li> tags
//  menu - MenuBar - representation of this Menu Bar
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function list1Selected(list1Items, list2Items, menu)
{
	var dom = dw.getDocumentDOM();
	if(!list1Items.length || !LIST_MENU1.getLen())
	{
		return;
	}
	else if(list1Items.length <= menu.MenuBar.pi.list1.selIndex)
	{
		menu.MenuBar.pi.list1.selIndex = list1Items.length-1;
		getList2Items(list2Items, list1Items, menu);
	}
	else if(menu.MenuBar.pi.list1.selIndex < 0)
	{
		menu.MenuBar.pi.list1.selIndex = 0;
		getList2Items(list2Items, list1Items, menu);
	}
	else if(!list1Items[menu.MenuBar.pi.list1.selIndex])
	{
		return;
	}

	menu.MenuBar.pi.selList = 1;

	var menuLabels = new Array();
	for(var i=0; i < list2Items.length; i++)
	{
		menuLabels.push(getLinkTextFromItem(list2Items[i]));
	}
	
	LIST_MENU3.setAll({}, {});
	LIST_MENU2.setAll(menuLabels, menuLabels);
	menu.MenuBar.pi.list3.selIndex = -1;
	menu.MenuBar.pi.list2.selIndex = -1;
	LIST_MENU3.setIndex(menu.MenuBar.pi.list3.selIndex);
	LIST_MENU2.setIndex(menu.MenuBar.pi.list2.selIndex);
	LIST_MENU1.setIndex(menu.MenuBar.pi.list1.selIndex);
	
	enableButtonsForListSelected(1);

	// populate text, link, title, and target fields
	menu.MenuBar.pi.selMenu = getLinkFromItem(list1Items[menu.MenuBar.pi.list1.selIndex]);
	var temp = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.innerHTML ? (isNonTextNode(menu.MenuBar.pi.selMenu) ? dw.loadString("spry/widget/html found") : menu.MenuBar.pi.selMenu.innerHTML) : "";
	TEXT.value = dwscripts.entityNameDecode(temp);
	LINK.value = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.href ? menu.MenuBar.pi.selMenu.href : "";
	TITLE.value = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.title ? menu.MenuBar.pi.selMenu.title : "";
	TARGET.value = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.target ? menu.MenuBar.pi.selMenu.target : "";

	handleErrorConditions();

	// adjust design view rendering of menus
	menu.clearMenus(dom.getSelectedNode());
}

//--------------------------------------------------------------------
// FUNCTION:
//   list2Selected
//
// DESCRIPTION:
//   This internal utility function handles the case of list menu 2
//   being selected.  It determines if everything is as it should be.
//   Sets the index of the list menu appropriately, and the next menu.
//   It enables the buttons associated with this list menu appropriately
//   and sets all of the edit fields appropriately for the selection.
//   Finally, the design view representation is changed by showing this
//   submenu.
//
// ARGUMENTS:
//  list2Items - array - contains the dom nodes representing second level <li> tags
//  list3Items - array - will contain the dom nodes representing third level <li> tags
//  menu - MenuBar - representation of this Menu Bar
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function list2Selected(list2Items, list3Items, menu)
{
	var dom = dw.getDocumentDOM();
	if(!list2Items.length || !LIST_MENU2.getLen())
	{
		return;
	}
	else if(list2Items.length <= menu.MenuBar.pi.list2.selIndex)
	{
		menu.MenuBar.pi.list2.selIndex = list2Items.length-1;
		getList3Items(list3Items, list2Items, menu);
	}
	else if(menu.MenuBar.pi.list2.selIndex < 0)
	{
		menu.MenuBar.pi.list2.selIndex = 0;
		getList3Items(list3Items, list2Items, menu);
	}
	else if(!list2Items[menu.MenuBar.pi.list2.selIndex])
	{
		return;
	}

	menu.MenuBar.pi.selList = 2;

	var menuLabels = new Array();
	for(var i=0; i < list3Items.length; i++)
	{
		menuLabels.push(getLinkTextFromItem(list3Items[i]));
	}
	
	LIST_MENU3.setAll(menuLabels, menuLabels);
	menu.MenuBar.pi.list3.selIndex = -1;
	LIST_MENU3.setIndex(menu.MenuBar.pi.list3.selIndex);
	LIST_MENU2.setIndex(menu.MenuBar.pi.list2.selIndex);
	
	enableButtonsForListSelected(2);

	// populate text, link, title, and target fields
	menu.MenuBar.pi.selMenu = getLinkFromItem(list2Items[menu.MenuBar.pi.list2.selIndex]);
	var temp = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.innerHTML ? (isNonTextNode(menu.MenuBar.pi.selMenu) ? dw.loadString("spry/widget/html found") : menu.MenuBar.pi.selMenu.innerHTML) : "";
	TEXT.value = dwscripts.entityNameDecode(temp);
	LINK.value = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.href ? menu.MenuBar.pi.selMenu.href : "";
	TITLE.value = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.title ? menu.MenuBar.pi.selMenu.title : "";
	TARGET.value = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.target ? menu.MenuBar.pi.selMenu.target : "";

	handleErrorConditions();

	// adjust design view rendering of menus
	menu.clearMenus(dom.getSelectedNode());
	var parentList = list2Items[menu.MenuBar.pi.list2.selIndex].parentNode;
	while(parentList && parentList.tagName != "UL")
	{
		parentList = parentList.parentNode;
	}
	menu.showSubmenu(parentList);
}

//--------------------------------------------------------------------
// FUNCTION:
//   list3Selected
//
// DESCRIPTION:
//   This internal utility function handles the case of list menu 3
//   being selected.  It determines if everything is as it should be.
//   Sets the index of the list menu appropriately, and the next menu.
//   It enables the buttons associated with this list menu appropriately
//   and sets all of the edit fields appropriately for the selection.
//   Finally, the design view representation is changed by showing this
//   submenu.
//
// ARGUMENTS:
//  list3Items - array - contains the dom nodes representing third level <li> tags
//  menu - MenuBar - representation of this Menu Bar
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function list3Selected(list3Items, menu)
{
	var dom = dw.getDocumentDOM();
	if(!list3Items.length || !LIST_MENU3.getLen())
	{
		return;
	}
	else if(list3Items.length <= menu.MenuBar.pi.list3.selIndex)
	{
		menu.MenuBar.pi.list3.selIndex = list3Items.length-1;
	}
	else if(menu.MenuBar.pi.list3.selIndex < 0)
	{
		menu.MenuBar.pi.list3.selIndex = 0;
	}
	else if(!list3Items[menu.MenuBar.pi.list3.selIndex])
	{
		return;
	}

	menu.MenuBar.pi.selList = 3;

	LIST_MENU3.setIndex(menu.MenuBar.pi.list3.selIndex);

	enableButtonsForListSelected(3);
	
	// populate text, link, title, and target fields
	menu.MenuBar.pi.selMenu = getLinkFromItem(list3Items[menu.MenuBar.pi.list3.selIndex]);
	var temp = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.innerHTML ? (isNonTextNode(menu.MenuBar.pi.selMenu) ? dw.loadString("spry/widget/html found") : menu.MenuBar.pi.selMenu.innerHTML) : "";
	TEXT.value = dwscripts.entityNameDecode(temp);
	LINK.value = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.href ? menu.MenuBar.pi.selMenu.href : "";
	TITLE.value = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.title ? menu.MenuBar.pi.selMenu.title : "";
	TARGET.value = menu.MenuBar.pi.selMenu && menu.MenuBar.pi.selMenu.target ? menu.MenuBar.pi.selMenu.target : "";

	handleErrorConditions();

	// adjust design view rendering of menus
	menu.clearMenus(dom.getSelectedNode());
	var parentList = list3Items[menu.MenuBar.pi.list3.selIndex].parentNode;
	while(parentList && parentList.tagName != "UL")
	{
		parentList = parentList.parentNode;
	}
	var grandParentList = parentList.parentNode.parentNode;
	while(grandParentList && grandParentList.tagName != "UL")
	{
		grandParentList = grandParentList.parentNode;
	}
	menu.showSubmenu(grandParentList);
	menu.showSubmenu(parentList);
}

//--------------------------------------------------------------------
// FUNCTION:
//   isNonTextNode
//
// DESCRIPTION:
//   This internal utility function determines if the node provided
//   contains anything other than text.
//
// ARGUMENTS:
//  element - node - the dom node we're concerned about
//
// RETURNS:
//   true if this node contains anything other than text
//   false otherwise
//--------------------------------------------------------------------

function isNonTextNode(element)
{
	var bResult = true;
	if( element && 
	   	element.hasChildNodes() && 
		element.childNodes.length == 1 &&
		element.firstChild.nodeType == Node.TEXT_NODE )
	{
		bResult = false;
	}
	return bResult;
}

//--------------------------------------------------------------------
// FUNCTION:
//   handleErrorConditions
//
// DESCRIPTION:
//   This internal utility function handles error conditions, such as
//   a badly structured Menu Bar and displays an appropriate message
//   in the Property Inspector.  If the TEXT field is empty or contains
//   a specific message there is an error.
//
// ARGUMENTS:
//   N/A
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function handleErrorConditions()
{
	if(TEXT.value == "")
	{
		SECTION_DETAILS.style.display = "none";
		SECTION_ERROR.style.display = "";
	}
	else
	{
		SECTION_DETAILS.style.display = "";
		SECTION_ERROR.style.display = "none";
		if(TEXT.value == dw.loadString("spry/widget/html found"))
		{
			TEXT.setAttribute("disabled", true);
		}
		else
		{
			TEXT.setAttribute("disabled", false);
		}
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   enableButtonsForListSelected
//
// DESCRIPTION:
//   This internal utility function enables and disables all of the
//   buttons associated with a particular list menu.  This is based on
//   the given menu, its content, and perhaps its parent menu.
//
// ARGUMENTS:
//   N/A
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function enableButtonsForListSelected(listNum)
{
	switch(listNum)
	{
		case 1:
		{
			// disable all list 3 stuff
			ADD3.setAttribute("disabled", true);
			ADD3.src = "../Shared/MM/Images/btnAddSmall_dis.png";
			DEL3.setAttribute("disabled", true);
			DEL3.src = "../Shared/MM/Images/btnDelSmall_dis.png";
			UP3.setAttribute("disabled", true);
			UP3.src = "../Shared/MM/Images/btnUpSmall_dis.png";
			DOWN3.setAttribute("disabled", true);
			DOWN3.src = "../Shared/MM/Images/btnDownSmall_dis.png";
		}
		break;
		
		case 2:
		case 3:
		{
			// list 3 is based on itself and list 2
			if(LIST_MENU2.getLen())
			{
				ADD3.setAttribute("disabled", false);
				ADD3.src = "../Shared/MM/Images/btnAddSmall.png";
			}
			if(LIST_MENU3.getLen() && LIST_MENU3.getIndex() >= 0)
			{
				DEL3.setAttribute("disabled", false);
				DEL3.src = "../Shared/MM/Images/btnDelSmall.png";
				if(LIST_MENU3.getIndex() > 0)
				{
					UP3.setAttribute("disabled", false);
					UP3.src = "../Shared/MM/Images/btnUpSmall.png";
				}
				else
				{
					UP3.setAttribute("disabled", true);
					UP3.src = "../Shared/MM/Images/btnUpSmall_dis.png";
				}
				if(LIST_MENU3.getIndex() < LIST_MENU3.getLen()-1)
				{
					DOWN3.setAttribute("disabled", false);
					DOWN3.src = "../Shared/MM/Images/btnDownSmall.png";
				}
				else
				{
					DOWN3.setAttribute("disabled", true);
					DOWN3.src = "../Shared/MM/Images/btnDownSmall_dis.png";
				}
			}
			else
			{
				DEL3.setAttribute("disabled", true);
				DEL3.src = "../Shared/MM/Images/btnDelSmall_dis.png";
				UP3.setAttribute("disabled", true);
				UP3.src = "../Shared/MM/Images/btnUpSmall_dis.png";
				DOWN3.setAttribute("disabled", true);
				DOWN3.src = "../Shared/MM/Images/btnDownSmall_dis.png";
			}
		}
		break;
	}

	// list 2 is based on itself and list 1
	if(LIST_MENU1.getLen())
	{
		ADD2.setAttribute("disabled", false);
		ADD2.src = "../Shared/MM/Images/btnAddSmall.png";
	}
	else
	{
		ADD2.setAttribute("disabled", true);
		ADD2.src = "../Shared/MM/Images/btnAddSmall_dis.png";
	}
	if(LIST_MENU2.getLen() && LIST_MENU2.getIndex() >= 0)
	{
		DEL2.setAttribute("disabled", false);
		DEL2.src = "../Shared/MM/Images/btnDelSmall.png";
		if(LIST_MENU2.getIndex() > 0)
		{
			UP2.setAttribute("disabled", false);
			UP2.src = "../Shared/MM/Images/btnUpSmall.png";
		}
		else
		{
			UP2.setAttribute("disabled", true);
			UP2.src = "../Shared/MM/Images/btnUpSmall_dis.png";
		}
		if(LIST_MENU2.getIndex() < LIST_MENU2.getLen()-1)
		{
			DOWN2.setAttribute("disabled", false);
			DOWN2.src = "../Shared/MM/Images/btnDownSmall.png";
		}
		else
		{
			DOWN2.setAttribute("disabled", true);
			DOWN2.src = "../Shared/MM/Images/btnDownSmall_dis.png";
		}
	}
	else
	{
		DEL2.setAttribute("disabled", true);
		DEL2.src = "../Shared/MM/Images/btnDelSmall_dis.png";
		UP2.setAttribute("disabled", true);
		UP2.src = "../Shared/MM/Images/btnUpSmall_dis.png";
		DOWN2.setAttribute("disabled", true);
		DOWN2.src = "../Shared/MM/Images/btnDownSmall_dis.png";
	}

	// list 1 is always based on itself
	if(LIST_MENU1.getLen() > 1)
	{
		DEL1.setAttribute("disabled", false);
		DEL1.src = "../Shared/MM/Images/btnDelSmall.png";
	}
	else
	{
		DEL1.setAttribute("disabled", true);
		DEL1.src = "../Shared/MM/Images/btnDelSmall_dis.png";
	}
	if(LIST_MENU1.getIndex() > 0)
	{
		UP1.setAttribute("disabled", false);
		UP1.src = "../Shared/MM/Images/btnUpSmall.png";
	}
	else
	{
		UP1.setAttribute("disabled", true);
		UP1.src = "../Shared/MM/Images/btnUpSmall_dis.png";
	}
	if(LIST_MENU1.getIndex() < LIST_MENU1.getLen()-1)
	{
		DOWN1.setAttribute("disabled", false);
		DOWN1.src = "../Shared/MM/Images/btnDownSmall.png";
	}
	else
	{
		DOWN1.setAttribute("disabled", true);
		DOWN1.src = "../Shared/MM/Images/btnDownSmall_dis.png";
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   getLinkFromItem
//
// DESCRIPTION:
//   This internal utility function gets the <a> node from an <li> node.
//
// ARGUMENTS:
//   listItem - node - <li> node
//
// RETURNS:
//   <a> node for the <li> node provided within
//   null if none exists
//--------------------------------------------------------------------

function getLinkFromItem(listItem)
{
	var linkTag = null;
	var links = listItem.getElementsByTagName('a');
	var bLinkExists = false;
	if(links.length)
	{
		var parentItem = links[0].parentNode;
		while(parentItem && parentItem.tagName != "LI")
		{
			parentItem = parentItem.parentNode;
		}
		bLinkExists = (parentItem == listItem);
	}
	if(bLinkExists)
	{
		linkTag = links[0];
	}

	return linkTag;
}

//--------------------------------------------------------------------
// FUNCTION:
//   getLinkTextFromItem
//
// DESCRIPTION:
//   This internal utility function gets the text within an <li> node.
//   The text within the <a> tag is provided.  If the <a> node is missing
//   or there is no text, provide an "error" string.
//
// ARGUMENTS:
//   listItem - node - <li> node
//
// RETURNS:
//   text representing the string within thi <li> node provided
//   error message if no text exists
//--------------------------------------------------------------------

function getLinkTextFromItem(listItem)
{
	var linkText = "";
	var linkTag = getLinkFromItem(listItem);
	if(linkTag)
	{
		if(linkTag.innerHTML.length)
		{
			linkText = dwscripts.collectTextInNode(linkTag);
			linkText = dwscripts.entityNameDecode(linkText); 
			linkText = dwscripts.trim(linkText);
		}
		else
		{
			linkText = dw.loadString("spry/widget/unlabeled item");
		}
	}
	else
	{
		linkText = dw.loadString("spry/widget/broken item");
	}

	return linkText;
}
