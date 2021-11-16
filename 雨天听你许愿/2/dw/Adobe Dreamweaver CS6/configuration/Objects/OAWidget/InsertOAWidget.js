//
// Copyright 2009 Adobe Systems Incorporated.  All rights reserved.
// ----------------------------------------------------
//

var helpDoc = MM.HELP_objInsertWidget;

var gWidgetSelectList = null;
var gPresetSelectList = null;
var gWidgets = [];

function canInsertObject()
{
    return true;
}

function isDOMRequired()
{
    // The DesignView DOM must be in sync with CodeView.

    return true;
}

function updatePresetsControl()
{
    var widgetID = gWidgetSelectList.getValue();

    var presets = OAWidgetManager.getDefaultPresetsForWidget(widgetID);
    var userPresets = OAWidgetManager.getUserPresetsForWidget(widgetID);

    var defaultPresetLabel = dw.loadString("insertbar/oawidget/presetSelectDefaultOptionLabel");

    if (userPresets.length > 0)
        presets = presets.concat(userPresets);

    var labels = [];
    var values = [];
    for (var i = 0; i < presets.length; i++)
    {
        var p = presets[i];
        labels[i] = p.name == "<default>" ? defaultPresetLabel : p.name;
        values[i] = p.xmlString;
    }
    gPresetSelectList.setAll(labels, values);
    gPresetSelectList.setIndex(0);
}

function widgetSortFunc(a, b)
{
    a = a.name.toLowerCase() + a.version;
    b = b.name.toLowerCase() + b.version;
    return (a > b) ? 1 : (a < b ? -1 : 0);
}

function getWidgetBrowserAppPath()
{
    var path = null;
    var wbXMLPath = OAWidgetManager.getAdobeCommonWidgetsDirectory() + "WidgetBrowser.xml";
    if (DWfile.exists(wbXMLPath))
    {
        var dom = dw.getDocumentDOM(wbXMLPath);
        if (dom)
        {
            var app = dom.getElementsByTagName("application").item(0);
            if (app)
                path = app.getAttribute("installPath");            
        }
   }
    return path;
}

function launchWidgetBrowser()
{
    var wbPath = getWidgetBrowserAppPath();
    if (wbPath)
    {
        // The Widget Browser exists so launch it and then close this
        // dialog. This forces the user to relaunch the dialog when they
        // are done with the Widget Browser, which allows us to pick up
        // any new widgets they have added to Dreamweaver.

        try
        {
            dw.launchApp(wbPath);
            window.close();
        }
        catch (e) { alert("Caught JS exception: " + e); }
        
    }
    else
    {
                wbPath = dw.getRootDirectory();		// get Dreamweaver application directory
				var fileSeparator = "\\";			// default to Windows \ file separator
				if (dwscripts.IS_MAC)				// if mac use : for file separator
					fileSeparator = ":";
				if (wbPath[wbPath.length - 1] == fileSeparator)		// remove trailing \
				    wbPath = wbPath.substr(0,wbPath.length - 2);
				var endPos = wbPath.lastIndexOf(fileSeparator);		// Look for \Adobe Dreamweaver CS5
				wbPath = wbPath.substr(0,endPos + 1);				// chop it off
				if (dwscripts.IS_MAC)	// add appropriate path to Widget Browser depending on platform
					wbPath = wbPath + "Adobe" + fileSeparator + "Adobe Widget Browser.app";
				else
					wbPath = wbPath + "Adobe Widget Browser" + fileSeparator + "Adobe Widget Browser.exe";
					
				if (wbPath.length > 0 ) {
					try
					{
							dw.launchApp(wbPath);
							window.close();
					}
					catch (e) { alert("Caught JS exception: " + e); }
				} else
        // The Widget Browser doesn't exist so launch a browser that
        // takes them to the Widget Browser landing page. They will be
        // able to download and install the Widget Browser from this page.
        			dw.browseDocument(dw.loadString("insertbar/oawidget/widgetBrowserLink"));
    }
}

function getEnabledWidgets(widgets)
{
    var results = [];
    if (widgets)
    {
        for (var i = 0; i < widgets.length; i++)
        {
            var w = widgets[i];
            if (w.enabled)
                results.push(w);
        }
    }
    return results;
}

function initUI()
{
    gWidgets = getEnabledWidgets(OAWidgetManager.getInstalledWidgets().sort(widgetSortFunc));

    var msgDiv = document.getElementById("msgText");
    var widgetPanel = document.getElementById("widgetPanel");

    if (gWidgets.length < 1)
    {
        msgDiv.style.display = "block";
        return;
    }

    msgDiv.style.display = "none";

    gWidgetSelectList = new ListControl("widgetList");
    gPresetSelectList = new ListControl("presetList");

    for (var i = 0; i < gWidgets.length; i++)
    {
        var w = gWidgets[i];
        if (w.enabled)
            gWidgetSelectList.append(w.name + (w.version ? (" (" + w.version + ")") : "") + (w.imported ? " *" : ""), w.widgetID);
    }

    if (gWidgets.length > 0)
    {
        gWidgetSelectList.enable();
        gPresetSelectList.enable();
        gWidgetSelectList.setIndex(0);
        var lastWidgetID = dw.getPreferenceString("Widget Preferences", "Last Widget"); // retrieve last selected widget & preset
        var lastPreset = dw.getPreferenceString("Widget Preferences", "Last Preset");
        if (lastWidgetID)
            gWidgetSelectList.pickValue(lastWidgetID);  // select last selected widget
        updatePresetsControl();
        if (lastPreset)
            gPresetSelectList.pick(lastPreset);         // select last selected preset
    }
    else
    {
        gWidgetSelectList.disable();
        gPresetSelectList.disable();
    }
}

function insertObject()
{
    if (gWidgets.length < 1)
        return "";

    var widgetID = gWidgetSelectList.getValue();
    var xmlString = gPresetSelectList.getValue();
    var dom = dw.getDocumentDOM();

    if (dom && widgetID)
    {
        // This is a bit convoluted, but we need to trigger an object
        // that calls our command that does the actual inserting of the
        // widget markup/code. It is done this way so that all of the edits
        // to the various parts of the document end up within one EditOp
        // allowing the user to undo everything with a single undo operation.
        //
        // Since we can't pass args to an object, we stick our args on the dom
        // and then trigger the insert object which will pull them off the dom
        // and pass them to the real command.

        dom.OAWidgetID = widgetID;
        dom.OAWidgetPresetXML = xmlString;
        dom.insertObject("OAWidget");
    }
    var selectedPreset = gPresetSelectList.get();
    dw.setPreferenceString("Widget Preferences", "Last Widget", widgetID);          // save last selected widget & preset
    dw.setPreferenceString("Widget Preferences", "Last Preset", selectedPreset);
    return "";
}

