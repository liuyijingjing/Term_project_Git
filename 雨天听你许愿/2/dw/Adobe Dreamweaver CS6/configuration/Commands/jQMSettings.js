/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2010 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/


//************************GLOBALS**************************

if (typeof(jQM) === "undefined") {
	jQM = {};
}

//Place variables and non-DWAPI (Command functions) in closure.
jQM.Settings = (function() {

var settings = {
	themeInput: null,			//Theme input element.
	themeLabel: null,			//Label string for theme input.
	themeBrowse: null,			//Icon for browsing theme file.
	themeType: null,			//Radio button for selecting CSS type.
	cssType: null,				//Currently selected CSS type.
	linkType: null,				//Currently selected resource type.

	//Radio buttons for the link type.
	LINKTYPE: null,
	
	//Paths for the source of the asset files. (Absolute)
	JQM_JS_SOURCE: "",
	JQM_CSS_SOURCE: "",
	JQ_JS_SOURCE: "",
	
	//Path for the destination of the asset files. (Relative to site root).
	JQM_JS_DEST: "",
	JQM_CSS_DEST: "",
	JQ_JS_DEST: "", 
	 
	//Source input boxes
	JQMJS_LOCATION_FIELD: null,
	JQMCSS_LOCATION_FIELD: null,
	JQ_LOCATION_FIELD: null,
	JQ_LIB_SOURCE_FIELD: null,
	
	//Library source elements
	jQueryBrowse: null,
	jqLibSourceLabel: null
};

//******************* API **********************

//--------------------------------------------------------------------
// FUNCTION:
//   updateSettings
//
// DESCRIPTION:
//   Check that input is valid before moving forward with inserting markup.
//--------------------------------------------------------------------
function updateSettings() {
	//Get selected radio options.
	var linkTypeValue = settings.LINKTYPE.getSelectedIndex();
	var cssTheme = settings.themeType.getSelectedIndex();

	//Get file paths from input fields.
	var jQMjsLoc = settings.JQMJS_LOCATION_FIELD.value;
	var jQMcssLoc = settings.JQMCSS_LOCATION_FIELD.value;
	var jQLoc = settings.JQ_LOCATION_FIELD.value;
	
	//Any problems with the file?
	var fileSanity = checkFileSanity(linkTypeValue);
	if (fileSanity != "") {
		//Bad file!
		alert(fileSanity);
	} else {
		//Files are good!
		var jqSrc, jsSrc, cssSrc;
		
		//Save radio options.
		dw.setPreferenceString(PREF_SECTION, PREF_LINK_TYPE, linkTypeValue);
		dw.setPreferenceString(PREF_SECTION, PREF_CSS_TYPE, cssTheme);
		
		//Save modifications in rmeote case. Local case saved during browse.
		if (linkTypeValue == PREF_LINK_REMOTE) {    // link to files via CDN
			var cssPref = cssTheme == PREF_CSS_SPLIT ? REMOTE_STRUCTURE : REMOTE_CSS;
			dw.setPreferenceString(PREF_SECTION, REMOTE_JS, jQMjsLoc);
			dw.setPreferenceString(PREF_SECTION, cssPref, jQMcssLoc);
			dw.setPreferenceString(PREF_SECTION, REMOTE_JQ, jQLoc);
			dw.setPreferenceString(PREF_SECTION, REMOTE_THEME, settings.themeInput.value);
		} else {
			//Check that site root is writable/unlocked.
			if (!isSiteRootSane()) {
				alert(dw.loadString("Commands/jQM/files/alert/lockedFolder"));
				return;
			}
		}

		this.result.returnValue = "OK";
		window.close();
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   isSiteRootSane
//
// DESCRIPTION:
//   Check to see if site root is writable or unlocked if it exists.
//
// RETURNS:
//   folderSane - Boolean of whether or not the folder is OK to copy assets into.
//--------------------------------------------------------------------
function isSiteRootSane() {
	var siteRoot = dw.getSiteRoot();
	var folderSane = true;

	//Is site root defined?
	if (siteRoot != "file:///") {
		//Is defined site root writable/unlocked?
		folderSane = dwscripts.isFileWritable(siteRoot);
	}
	return folderSane;
}

//--------------------------------------------------------------------
// FUNCTION:
//   checkFileSanity
//
// DESCRIPTION:
//   Check to see if file path or URL is valid and if it matches naming pattern.
//	 Alert the user if any problems arise.
//
// ARGUMENTS:
//   linkType - Number indicating which view the user is in (0 for remote, 1 for local).
//
// RETURNS:
//   String containing error message if there are problems, nothing otherwise.
//--------------------------------------------------------------------
function checkFileSanity(linkType) {
	var jQMjsLoc = settings.JQMJS_LOCATION_FIELD.value;
	var jQMcssLoc = settings.JQMCSS_LOCATION_FIELD.value;
	var jQLoc = settings.JQ_LOCATION_FIELD.value;

	var ok = dw.loadString("Commands/jQM/files/alert/OK");
	var invalidURL = dw.loadString("Commands/jQM/files/alert/invalidURL");
	var invalidFile = dw.loadString("Commands/jQM/files/alert/invalidFile");
	var message;
	var jsError = ok;
	var cssError = ok;
	var jqError = ok;
	
	var http = "http://";
	var splitCSS = settings.cssType == SPLIT_CSS;
	
	switch (linkType) {
		case PREF_LINK_REMOTE:
			//Check each value is prefixed by 'http://'.
			if (jQMjsLoc.indexOf(http) != 0) {
				jsError = invalidURL;
			}
			if (jQMcssLoc.indexOf(http) != 0) {
				cssError = invalidURL;
			}
			if (jQLoc.indexOf(http) != 0) {
				jqError = invalidURL;
			}

			//Check if files are named correctly.
			var cssExt = splitCSS ? 'structure' : 'css';
			if (!validFileName(getFileName(jQMjsLoc), 'js')) {
				jsError = invalidFile;
			}
			if (!validFileName(getFileName(jQMcssLoc), cssExt)) {
				cssError = invalidFile;
			}
			if (!validFileName(getFileName(jQLoc), 'jq')) {
				jqError = invalidFile;
			}
			
			//Find any invalid file names?
			message = getStatusMessage("error", jsError, cssError, jqError);
			
			//Check entered theme CSS.
			if (splitCSS) {
				var cssFile = settings.themeInput.value;
				var cssExt = '.css';
				
				//Does it start with 'http://' and end with '.css'?
				var filePrefix = cssFile.substr(0,7);
				var fileSuffix = cssFile.substr(-4);
				if (filePrefix !== http || fileSuffix !== cssExt) {
					var invalidCSSURL = dw.loadString("Commands/jQM/files/alert/invalidCSSURL");
					message += invalidCSSURL;
				}
			}
			
			break;
		case PREF_LINK_LOCAL:
			//Set pref strings.
			setPrefStrings(settings.cssType);
			var resourcePrefs = jQM.Utils.prefStrings.resourceStrings;
		
			var libPath = dw.getConfigurationPath() + "/" + assetDir;
			//Check source is valid (In case file was deleted)
			var libSrc = dw.getPreferenceString(PREF_SECTION, resourcePrefs.jqLibSrcPref, libPath);
			
			if (!dwscripts.isFolder(libSrc)) {
				message = dw.loadString("Commands/jQM/files/alert/folderProblem");
			} else {
				//Folder exists, check to see if files are valid.
				var locJS = libPath + localJS;
				var locCSS = libPath + resourcePrefs.mainCSSFile;
				var locJQ = libPath + localJQ;
				
				//Get image directory path.
				var iconSrc = libSrc;
				if (libSrc[libSrc.length-1] != "/") {
					iconSrc += "/";
				}
				iconSrc += localIconDir;
				
				//Get preferences
				var jsFile = dw.getPreferenceString(PREF_SECTION, resourcePrefs.jsSrcPref, locJS);
				var cssFile = dw.getPreferenceString(PREF_SECTION, resourcePrefs.cssSrcPref, locCSS);
				var jqFile = dw.getPreferenceString(PREF_SECTION, resourcePrefs.jqSrcPref, locJQ);

				var iconDir = libSrc + localIconDir;
				var notFound = dw.loadString("Commands/jQM/files/alert/notFound");
				
				//Check if files are still valid.
				if (!dwscripts.isFile(jsFile)) {
					jsError = notFound;
				}
				if (!dwscripts.isFile(cssFile)) {
					cssError = notFound;
				}
				if (!dwscripts.isFile(jqFile)) {
					jqError = notFound;
				}
				
				//Find any invalid files?
				message = getStatusMessage("error", jsError, cssError, jqError);
				
				//Check selected theme CSS.
				if (splitCSS) {
					var cssFile = settings.themeInput.value;
					//Is the file valid?
					if (!dwscripts.isFile(cssFile)) {
						var invalidCSSFile = dw.loadString("Commands/jQM/files/alert/invalidCSSFile");
						message += invalidCSSFile;
					}
				}
			}
			
			break;
	}
	
	return message;
	
}

//--------------------------------------------------------------------
// FUNCTION:
//   getStatusMessage
//
// DESCRIPTION:
//   Returns a message corresponding to the given status and status messages.
//
// ARGUMENTS:
//   status - Type of status message (Success or error)
//	 jsStatus - Status for the jQuery Mobile js file.
//	 cssStatus - Status for the jQuery Mobile css file.	
//	 jqStatus - Status for the jQuery js file.
//
// RETURNS:
//   String containing the message.
//--------------------------------------------------------------------
function getStatusMessage(status, jsStatus, cssStatus, jqStatus) {
	var ok = dw.loadString("Commands/jQM/files/alert/OK");
	var message = "";
	
	if (jsStatus != ok || cssStatus != ok || jqStatus != ok) {
		var jsStr = dw.loadString("Commands/jQM/files/jqmJS");
		var cssStr = dw.loadString("Commands/jQM/files/jqmCSS");
		var jqStr = dw.loadString("Commands/jQM/files/jquery");
		
		var jsSpacing = " : ";
		var cssSpacing = "          ";
		var jqSpacing = "                            ";
		
		//Tab spacing differs between Mac and Win for alignment
		if (dwscripts.IS_WIN) {
			cssSpacing += " ";
			jqSpacing += "    ";
		}
		
		var colonSpace = ": ";
		cssSpacing += colonSpace;
		jqSpacing += colonSpace;
		
		//Trim only if it's a file name.
		if (jsStatus.indexOf(".js") != -1) {
			jsStatus = trimFile(jsStatus);
			cssStatus = trimFile(cssStatus);
			jqStatus = trimFile(jqStatus);
		}
		
		jsStr += jsSpacing + jsStatus + "\n";
		cssStr += cssSpacing + cssStatus + "\n";
		jqStr += jqSpacing + jqStatus + "\n\n";
		
		message = jsStr + cssStr + jqStr;
		
		var msgHead;
		if (status == "success") {
			msgHead = dw.loadString("Commands/jQM/files/alert/fileSuccess");
		} else {
			msgHead = dw.loadString("Commands/jQM/files/alert/fileProblem");
		}
		msgHead += ":\n\n";
		message = msgHead + message;
	}
	
	return message;
}

//--------------------------------------------------------------------
// FUNCTION:
//   trimFile
//
// DESCRIPTION:
//   Cuts file name down to fit on one line if it's too long, appending
//   ellipses at the end.
//
// ARGUMENTS:
//   srcStr - String of the file name.
//
// RETURNS:
//   String that is a shortened from it's original length, with ellipses at the end.
//--------------------------------------------------------------------
function trimFile(srcStr) {
	//Max number of characters possible for file in single line in dialogs for both platforms.
	var WIN_STR_LEN = 40;
	var MAC_STR_LEN = 24;
	
	//Number we want to cut off at.
	var THRESHOLD = 3;
	
	var maxLen = dwscripts.IS_WIN ? WIN_STR_LEN : MAC_STR_LEN;
	var strLen = srcStr.length;
	
	if (strLen > maxLen) {
		var srcStr = srcStr.substring(0,maxLen-4);
		for (var i = 0; i < THRESHOLD; i ++) {
			srcStr += '.';
		}
	}
	
	return srcStr;
}

//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   Sets up all of the initial UI for the dialog.
//--------------------------------------------------------------------
function initializeUI() {
	//Place globals in local scope.
	var doc = document;
	
	//Init controls
	settings.JQMJS_LOCATION_FIELD = doc.getElementById("jqmjsURL");
	settings.JQMCSS_LOCATION_FIELD = doc.getElementById("jqmcssURL");
	settings.JQ_LOCATION_FIELD = doc.getElementById("jqueryURL");
	
	settings.JQ_LIB_SOURCE_FIELD = doc.getElementById("jQuerySourceLibrary");
	settings.jQueryBrowse = doc.getElementById("jQueryBrowse");
	settings.jqLibSourceLabel = doc.getElementById("jqLibSourceLabel");
	settings.LINKTYPE = new RadioGroup("linkTojQuery")
	
	settings.themeInput = doc.getElementById("jQMThemeInput");
	settings.themeLabel = doc.getElementById("themeLabel");
	settings.themeType = new RadioGroup("jQMCSSType");
	settings.themeBrowse = doc.getElementById("themeBrowse");
   
	//Disable the input buttons if remote or local is checked.
	var remote = doc.getElementById("linkTojQuery_1");
	var local = doc.getElementById("linkTojQuery_0");
			   
	var linkTypeValue = dw.getPreferenceString(PREF_SECTION, PREF_LINK_TYPE, PREF_LINK_LOCAL);
	//Set layout type to previous choice
	settings.LINKTYPE.setSelectedIndex(linkTypeValue);
					   
	//Event handlers to browse file.
	remote.onclick = 'jQM.Settings.toggleLinkType(' + PREF_LINK_REMOTE + ')';
	local.onclick = 'jQM.Settings.toggleLinkType(' + PREF_LINK_LOCAL + ')';
	
	//Set inputs based on link type selection.
	toggleLinkType(linkTypeValue);
	
	var cssTypeValue = dw.getPreferenceString(PREF_SECTION, PREF_CSS_TYPE, PREF_CSS_SPLIT);
	//Set CSS type to previous choice
	settings.themeType.setSelectedIndex(cssTypeValue);
	
	var cssType;
	if (cssTypeValue == PREF_CSS_SPLIT) {
		settings.cssType = SPLIT_CSS;
		cssType = 'block';
	} else {
		settings.cssType = ALL_CSS;
		cssType = 'none';
	}
	
	//Set inputs based on CSS type selection.
	toggleThemeField(cssType);
	
	//Handle toggling of theme selection type.
	var splitCSS = doc.getElementById('jQMCSSSplit');
	var allCSS = doc.getElementById('jQMCSSAll');
	splitCSS.onclick = 'jQM.Settings.toggleThemeField("block")';
	allCSS.onclick = 'jQM.Settings.toggleThemeField("none")';
   
   //Handle jQM library and theme browsing.
	settings.jQueryBrowse.onclick = 'jQM.Settings.browseFolder()';
	settings.themeBrowse.onclick = 'jQM.Settings.browseTheme()';
}

//--------------------------------------------------------------------
// FUNCTION:
//   toggleLinkType
//
// DESCRIPTION:
//   Toggles the input fields and loads the correct values and UI.
//
// ARGUMENTS:
//   linkType - Number indicating which view the user is in (0 for remote, 1 for local). 
//-------------------------------------------------------------------- 
function toggleLinkType(linkType) {
	var toggle = linkType == PREF_LINK_REMOTE ? "false" : "true";
	var splitCSS = settings.cssType == SPLIT_CSS;

	//Toggle input fields.
	settings.JQMJS_LOCATION_FIELD.disabled = toggle;
	settings.JQMCSS_LOCATION_FIELD.disabled = toggle;
	settings.JQ_LOCATION_FIELD.disabled = toggle;

	if (toggle == "true") {     // LOCAL
		settings.linkType = LOCAL;
		toggleSrcLib("block");
		
		if (splitCSS) {
			updateThemeField();
			//Show the browse icon and disable the theme input field.
			settings.themeBrowse.style.display = 'block';
			settings.themeInput.disabled = toggle;
		}
		
		//Update corresponding pref strings.
		updateFilePaths();
	} else {                    // REMOTE case
		settings.linkType = REMOTE;
		toggleSrcLib("none");
		
		if (splitCSS) {
			updateThemeField();
			//Hide the browse icon and enable the theme input field.
			settings.themeBrowse.style.display = 'none';
			settings.themeInput.disabled = toggle;
			cssSrc = REMOTE_STRUCTURE;
			cssDef = jqmStructureSource;
		} else {
			cssSrc = REMOTE_CSS;
			cssDef = jqmCSSSource;
		}
		
		jqSrc = REMOTE_JQ;
		jqDef = jqmJquerySource;
	   
		jsDef = jqmJavascriptSource;
		jsSrc = REMOTE_JS;
		
		//Set file locations.
		settings.JQMJS_LOCATION_FIELD.value = dw.getPreferenceString(PREF_SECTION, jsSrc, jsDef);
		settings.JQMCSS_LOCATION_FIELD.value = dw.getPreferenceString(PREF_SECTION, cssSrc, cssDef);
		settings.JQ_LOCATION_FIELD.value = dw.getPreferenceString(PREF_SECTION, jqSrc, jqDef);
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   getTrueConfigurationPath()
//
// DESCRIPTION:
//   Get user configuration path if assets there exist, otherwise return the application configuration path.
//
// ARGUMENTS:
//   String representing desired configuration path.
//--------------------------------------------------------------------
function getTrueConfigurationPath() {
	var userConfig = dw.getUserConfigurationPath();
	var userAssets = userConfig + assetDir;
	var appConfig = dw.getConfigurationPath() + '/';
	var appAssets = appConfig + assetDir;
	
	//Workaround DW's config path mechanism to force check existence of user config folder.
	return DWfile.listFolder(userAssets, "files") == "" ? appConfig : userConfig;
}

//--------------------------------------------------------------------
// FUNCTION:
//   toggleSrcLib
//
// DESCRIPTION:
//   Toggle the field for the jQuery Library source path, browse button and its label.
//
// ARGUMENTS:
//   display - String of the display style that the fields should be set as.
//--------------------------------------------------------------------
function toggleSrcLib(display) {
	settings.JQ_LIB_SOURCE_FIELD.style.display = display;	// the edit field
	settings.jqLibSourceLabel.style.display = display; 		// the Label "jQuery Library Source: "
	settings.jQueryBrowse.style.display = display; 			// the browse button
}

//--------------------------------------------------------------------
// FUNCTION:
//   toggleThemeField
//
// DESCRIPTION:
//   Toggle the display of the jQM theme selection field.
//
// ARGUMENTS:
//   display - String of the display style that the fields should be set as.
//--------------------------------------------------------------------
function toggleThemeField(display) {
	settings.themeInput.style.display = display;		// the edit field
	settings.themeBrowse.style.display = display;		//Theme browse icon
	settings.themeLabel.style.display = display; 		// the Label "Theme: "
	
	var localRef = settings.linkType == LOCAL;
	
	//Update theme field if it's now visible
	if (display != 'none') {
		settings.cssType = SPLIT_CSS;
		updateThemeField();
	} else {
		settings.cssType = ALL_CSS;
	}
	
	var splitCSS = settings.cssType == SPLIT_CSS;
	if (localRef) {		//LOCAL
		//Update all file paths in pref strings.
		updateFilePaths();
		
		if (splitCSS) {
			//Disable theme input.
			settings.themeInput.disabled = 'true';
		}
	} else {		//REMOTE
		//Update just CSS file path.
		var cssPref, cssDef;
		if (splitCSS) {
			cssPref = REMOTE_STRUCTURE;
			cssDef = jqmStructureSource;
			
			//Enable the theme input and hide the browse icon.
			settings.themeInput.disabled = 'false';
			settings.themeBrowse.style.display = 'none';
		} else {
			cssPref = REMOTE_CSS;
			cssDef = jqmCSSSource;
		}
		
		settings.JQMCSS_LOCATION_FIELD.value = dw.getPreferenceString(PREF_SECTION, cssPref, cssDef);
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateFilePaths
//
// DESCRIPTION:
//   Update the preference string file paths corresponding to the chosen CSS type.
//--------------------------------------------------------------------
function updateFilePaths() {
	var resourcePrefs = jQM.Utils.prefStrings.resourceStrings;

	//Set prefs to correspond with CSS type.
	setPrefStrings(settings.cssType);
		
	//Update file paths.
	settings.JQMJS_LOCATION_FIELD.value = dw.getPreferenceString(PREF_SECTION, resourcePrefs.jsDestPref, jqmDir+localJS);
	settings.JQMCSS_LOCATION_FIELD.value = dw.getPreferenceString(PREF_SECTION, resourcePrefs.cssDestPref, jqmDir+resourcePrefs.mainCSSFile);
	settings.JQ_LOCATION_FIELD.value = dw.getPreferenceString(PREF_SECTION, resourcePrefs.jqDestPref, jqmDir+localJQ);
	settings.JQ_LIB_SOURCE_FIELD.value = dw.getPreferenceString(PREF_SECTION, resourcePrefs.jqLibSrcPref, getTrueConfigurationPath()+assetDir);
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateThemeField
//
// DESCRIPTION:
//   Update the theme input with the corresponding jQuery Mobile Theme CSS path.
//--------------------------------------------------------------------
function updateThemeField() {
	var linkTypeValue = settings.linkType;
	var themePref, themeDef;
	
	//Get the correct theme preference and default.
	if (linkTypeValue == REMOTE) {
		themePref = REMOTE_THEME;
		themeDef = jQMThemeSource;
	} else {
		var libPath = getTrueConfigurationPath() + assetDir;
		themeDef = libPath + localThemeCSS;
		themePref = PREF_CSS_FILE;
	}
	
	//Pre-populate select menu with CSS files.
	var cssOpts = dw.getPreferenceString(PREF_SECTION, themePref, themeDef);
	settings.themeInput.value = cssOpts;
}

//--------------------------------------------------------------------
// FUNCTION:
//   isInCurrentSite
//
// DESCRIPTION:
//   If there is a site currently selected and the path is in the currently
//   selected site returns true.
//
// ARGUMENTS:
//   path url to be checked if it is in the current site
//
// RETURNS:
//   dom object
//--------------------------------------------------------------------
function isInCurrentSite(path) {
	var siteRoot = dw.getSiteRoot();
	var inCurSite = false;
	
	if (siteRoot) {
		var siteRootForURL = dwscripts.filePathToLocalURL(site.getSiteRootForURL(path));
		inCurSite = (siteRoot == siteRootForURL);
	}
	
	return inCurSite;
}

//--------------------------------------------------------------------
// FUNCTION:
//   getFolderName
//
// DESCRIPTION:
//   Given a full path to a folder returns just the folder name with a separator appended. 
//
//--------------------------------------------------------------------
function getFolderName(fileURL) {
	var retVal;
	if (dwscripts.isFolder(fileURL)) {
		if (fileURL[fileURL.length - 1] == dwscripts.FILE_SEP) {
			fileURL = fileURL.substring(0, fileURL.length - 1);
		}
		retVal = fileURL.substring(fileURL.lastIndexOf(dwscripts.FILE_SEP) + 1, fileURL.length);
		return(retVal + dwscripts.FILE_SEP);
	}	
}

//--------------------------------------------------------------------
// FUNCTION:
//   browseFolder
//
// DESCRIPTION:
//   Allows user to browse to jQuery mobile library folder. Verifies that
//   the required jQuery files are in the folder. 
//
//--------------------------------------------------------------------
function browseFolder() 
{
	//Is the folder writable/unlocked?
	if (isSiteRootSane()) {
		//Set lib source folder
		var libFolder = settings.cssType == SPLIT_CSS ? PREF_SPLIT_JQLIB_SOURCE_FOLDER : PREF_JQLIB_SOURCE_FOLDER;
		
		// Call Dw to bring up the browse for folder dialog
		var browseRoot = dw.getPreferenceString(PREF_SECTION, libFolder, dw.getConfigurationPath()+"/"+assetDir);
		var jQuerySourceFolder = dw.browseForFolderURL(dw.loadString("Commands/jQM/files/alert/browseFile"), browseRoot, false);
	  
		findjQMFiles(jQuerySourceFolder);
	} else {
		alert(dw.loadString("Commands/jQM/files/alert/lockedFolder"));
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   browseTheme
//
// DESCRIPTION:
//   Allows user to browse for a jQuery mobile theme CSS file.
//
//--------------------------------------------------------------------
function browseTheme() 
{
	//Set lib source folder
	var libFolder = settings.cssType == SPLIT_CSS ? PREF_SPLIT_JQLIB_SOURCE_FOLDER : PREF_JQLIB_SOURCE_FOLDER;
	
	//Get selected theme folder.
	var browseRoot = dw.getPreferenceString(PREF_SECTION, libFolder, dw.getConfigurationPath()+"/"+assetDir);
	var themeFolder = dw.getPreferenceString(PREF_SECTION, PREF_CSS_FILE, browseRoot);
	
	//Strings for browse file dialog.
	var browseCSS = dw.loadString("Commands/jQM/files/alert/browseCSS");
	var cssFiles = dw.loadString("Commands/jQM/files/alert/label/cssFiles");
	
	var jQMThemeFile = dw.browseForFileURL("select", browseCSS, false, true, new Array(cssFiles + " (*.CSS)|*.css||"), themeFolder);
	
	if (jQMThemeFile != "") {
		//Some file was chosen.
		var cssName = getFileName(jQMThemeFile);
		var cssExt = '.css';
		
		//Check to see if it's a CSS file.
		var nameSuffix = cssName.substr(-4);
		if (nameSuffix === cssExt) {
			//Update display input.
			settings.themeInput.value = jQMThemeFile;
			dw.setPreferenceString(PREF_SECTION, PREF_CSS_FILE, jQMThemeFile);
		} else {
			//Bad file!
			var invalidCSSFile = dw.loadString("Commands/jQM/files/alert/invalidCSSFile");
			alert(invalidCSSFile);
		}
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   findjQMFiles
//
// DESCRIPTION:
//   Looks for jQuery Mobile files inside specified folder. 
//
//--------------------------------------------------------------------
function findjQMFiles(jQuerySourceFolder) 
{
	var inCurrentSite = false;  // the jQuery files are located within the current site if this is true
	
	if (jQuerySourceFolder != "") {
		//Add trailing slash if non-existent.
		if (jQuerySourceFolder[jQuerySourceFolder.length-1] != '/') {
			jQuerySourceFolder += "/";
		}

		if (isInCurrentSite(jQuerySourceFolder)) {  // the user selected a folder inside the current site
			siteRelativePath = dw.absoluteURLToDocRelative(jQuerySourceFolder, dw.getSiteRoot(), jQuerySourceFolder);
			inCurrentSite = true;
		} else {
			inCurrentSite = false;
			siteRelativePath = getFolderName(jQuerySourceFolder);
		}
		
		var i;
		var fileMask = "*.js";
		var jQMJSFile = null;
		var jQueryJSFile = null;
		var jQMcssFile = null;
		var jQMIcons = null;
		
		//Arrays to hold file matches.
		var jqmFullAssets = [];
		var jqmMinAssets = [];
		var jqFullAssets = [];
		var jqMinAssets = [];
		
		//Variables for list element usage.
		var listItem, listLen;
		
		// look for all *.js files
		var list = DWfile.listFolder(jQuerySourceFolder + "/" + fileMask, "files");
		if (list) {
			listLen = list.length;
			for (i = 0; i < listLen; i++) {
				listItem = list[i];
				//Look for minified versions first.
				if (validFileName(listItem, 'js', true))
					jqmMinAssets.push(listItem);
				else if (validFileName(listItem, 'js', false))
					jqmFullAssets.push(listItem);
				// match first form jquery.moble(.*).js if we don't find mobile then look for jquery(.*).js
				else if (validFileName(listItem, 'jq', true))
					jqMinAssets.push(listItem);
				else if (validFileName(listItem, 'jq', false))
					jqFullAssets.push(listItem);
			}
		}
		
		//Pick JS files if any.
		jQMJSFile = pickSourceFile(jQMJSFile, jqmMinAssets, jqmFullAssets);
		jQueryJSFile = pickSourceFile(jQueryJSFile, jqMinAssets, jqFullAssets);
		
		//Reset jqm arrays for reuse.
		jqmFullAssets = [];
		jqmMinAssets = [];

		// look for all *.css files to 
		fileMask = "*.css";
		list = DWfile.listFolder(jQuerySourceFolder + "/" + fileMask, "files");
		var splitCSS = settings.cssType == SPLIT_CSS;
		if (list) {
			var cssType;
			
			//Look for structure or single CSS file as main CSS depending on the CSS type.
			if (splitCSS) {
				cssType = "structure";
				var cssFiles = list;
			} else {
				cssType = "css";
			}
			
			//Set corresponding preference string.
			setPrefStrings(settings.cssType);
			
			listLen = list.length;
			for (i = 0; i < listLen; i++) {
				listItem = list[i];
				//Check for minified over unminified CSS file.
				if (validFileName(listItem, cssType, true))
					jqmMinAssets.push(listItem);
				else if (validFileName(listItem, cssType, false))
					jqmFullAssets.push(listItem);
			}
		}
		
		//Pick CSS file if any.
		jQMcssFile = pickSourceFile(jQMcssFile, jqmMinAssets, jqmFullAssets);
		
		//Copy image folder.
		fileMask = "*.png";
		list = DWfile.listFolder(jQuerySourceFolder + localIconDir + fileMask, "files");

		if (list != "") {
			//Get parent folder of images directory.
			var dirNames = jQuerySourceFolder.split("/");
			jQMIcons = dirNames[dirNames.length-2] + '/' + localIconDir;
		}
		
		//Did we find all the files?
		if (jQMJSFile && jQueryJSFile && jQMcssFile) {
			var confirmDialog = true;
			//Are any of the files in our current site?
			if (!inCurrentSite) {
				message = getStatusMessage("success", jQMJSFile, jQMcssFile, jQueryJSFile);
				message += dw.loadString("Commands/jQM/files/alert/fileNoExist") + "\n\n";
				
				confirmDialog = confirm(message);
			}
			
			//Don't update path if user cancels
			if (confirmDialog) {
				/** For each of the files, set the corresponding fields to match preference information.
					Also, update the input field with file name. */
				var resourcePrefs = jQM.Utils.prefStrings.resourceStrings;
				
				if (jQMJSFile) {
					settings.JQMJS_LOCATION_FIELD.value = siteRelativePath + jQMJSFile;
					settings.JQM_JS_DEST = settings.JQMJS_LOCATION_FIELD.value;
					settings.JQM_JS_SOURCE = jQuerySourceFolder + jQMJSFile;
					dw.setPreferenceString(PREF_SECTION, resourcePrefs.jsSrcPref, settings.JQM_JS_SOURCE);
					dw.setPreferenceString(PREF_SECTION, resourcePrefs.jsDestPref, settings.JQM_JS_DEST);
				}
				if (jQueryJSFile) {
					settings.JQ_LOCATION_FIELD.value = siteRelativePath + jQueryJSFile;
					settings.JQ_JS_DEST = settings.JQ_LOCATION_FIELD.value;
					settings.JQ_JS_SOURCE = jQuerySourceFolder + jQueryJSFile;
					dw.setPreferenceString(PREF_SECTION, resourcePrefs.jqSrcPref, settings.JQ_JS_SOURCE);
					dw.setPreferenceString(PREF_SECTION, resourcePrefs.jqDestPref, settings.JQ_JS_DEST);
				}
				if (jQMcssFile) {
					settings.JQMCSS_LOCATION_FIELD.value = siteRelativePath + jQMcssFile;
					settings.JQM_CSS_DEST = settings.JQMCSS_LOCATION_FIELD.value;
					settings.JQM_CSS_SOURCE = jQuerySourceFolder + jQMcssFile;
					dw.setPreferenceString(PREF_SECTION, resourcePrefs.cssSrcPref, settings.JQM_CSS_SOURCE);
					dw.setPreferenceString(PREF_SECTION, resourcePrefs.cssDestPref, settings.JQM_CSS_DEST);
				}
				
				//Do the same for the library source folder.
				settings.JQ_LIB_SOURCE_FIELD.value = jQuerySourceFolder;
				dw.setPreferenceString(PREF_SECTION, resourcePrefs.jqLibSrcPref, settings.JQ_LIB_SOURCE_FIELD.value);
				
				//Again with the icons to preserve directory name. Throw an alert if not found.
				if (jQMIcons) {
					dw.setPreferenceString(PREF_SECTION, resourcePrefs.jqImgSrcPref, jQMIcons);
				} else {
					alert(dw.loadString("Commands/jQM/files/alert/imageNoExist"));
				}
			}
		} else {
			//Some files are not found.
			var ok = dw.loadString("Commands/jQM/files/alert/OK");
			var notFound = dw.loadString("Commands/jQM/files/alert/notFound");
			
			var jsError = jQMJSFile ? ok : notFound;
			var cssError = jQMcssFile ? ok : notFound;
			var jqError = jQueryJSFile ? ok : notFound;
		
			message = getStatusMessage("error", jsError, cssError, jqError);
			alert(message);
		}
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   pickSourceFile
//
// DESCRIPTION:
//   Chooses the latest minified assets over all full assets,
//
// ARGUMENTS:
//   file - String containing name of the picked file.
//	 minAssets - Array of minified file names for given file.
//	 fullAssets - Array of uncompressed file names for given file.
//
// RETURNS:
//   String of just the chosen file name.
//-------------------------------------------------------------------- 
function pickSourceFile(file, minAssets, fullAssets) {
	if (minAssets.length > 0) {
		file = minAssets[0];
	} else {
		//No min file, try to get latest full file.
		if (fullAssets.length > 0) {
			file = fullAssets[0];
		}
	}
	
	return file;
}

//--------------------------------------------------------------------
// FUNCTION:
//   setDefaults
//
// DESCRIPTION:
//   Reset preference fields of current selection to program defaults.
//
// ARGUMENTS:
//   linkType - Integer specifying which type of resource we're using
//				(Remote or Local). This is optional.
//--------------------------------------------------------------------
function setDefaults(linkType) {
	var linkTypeValue = linkType ? linkType : settings.LINKTYPE.getSelectedIndex();
	var splitCSS = settings.cssType == SPLIT_CSS;
	
	if (linkTypeValue == PREF_LINK_REMOTE) {   // DEFAULT LINK is Remote
		//Remote cases
		
		//Set preference string and theme default correctly.
		var cssPref, cssDef;
		if (splitCSS) {
			cssPref = REMOTE_STRUCTURE;
			cssDef = jqmStructureSource;
			dw.setPreferenceString(PREF_SECTION, REMOTE_THEME, jQMThemeSource);
		} else {
			cssPref = REMOTE_CSS;
			cssDef = jqmCSSSource;
		}
		
		dw.setPreferenceString(PREF_SECTION, REMOTE_JS, jqmJavascriptSource);
		dw.setPreferenceString(PREF_SECTION, REMOTE_JQ, jqmJquerySource);
		dw.setPreferenceString(PREF_SECTION, cssPref, cssDef);
	} else {
		//Local cases
		var libPath = getTrueConfigurationPath() + assetDir;
		
		//Get pref strings.
		setPrefStrings(settings.cssType);
		var resourcePrefs = jQM.Utils.prefStrings.resourceStrings;
		
		//Local source folder
		dw.setPreferenceString(PREF_SECTION, resourcePrefs.jqLibSrcPref, libPath);
		
		//Local icon directory
		dw.setPreferenceString(PREF_SECTION, resourcePrefs.jqImgSrcPref, jqmDir+localIconDir);
		
		//Create default local source paths.
		var locJS = libPath + localJS;
		var locCSS = libPath + resourcePrefs.mainCSSFile;
		var locJQ = libPath + localJQ;
		
		//Set paths
		dw.setPreferenceString(PREF_SECTION, resourcePrefs.jqSrcPref, locJQ);
		dw.setPreferenceString(PREF_SECTION, resourcePrefs.jsSrcPref, locJS);
		dw.setPreferenceString(PREF_SECTION, resourcePrefs.cssSrcPref, locCSS);
		dw.setPreferenceString(PREF_SECTION, resourcePrefs.jqDestPref, jqmDir+localJQ);
		dw.setPreferenceString(PREF_SECTION, resourcePrefs.jsDestPref, jqmDir+localJS);
		dw.setPreferenceString(PREF_SECTION, resourcePrefs.cssDestPref, jqmDir+resourcePrefs.mainCSSFile);
		
		if (splitCSS) {
			//Reset default theme path.
			var themePath = libPath+localThemeCSS;
			dw.setPreferenceString(PREF_SECTION, PREF_CSS_FILE, themePath);
		}
	}
	toggleLinkType(linkTypeValue);
}
	
	return {
		initializeUI: initializeUI,
		updateSettings: updateSettings,
		setDefaults: setDefaults,
		browseFolder: browseFolder,
		browseTheme: browseTheme,
		toggleThemeField: toggleThemeField,
		toggleLinkType: toggleLinkType
	};

}());

/*********************************************************
*                                             DW COMMAND SPECIFIC FUNCTIONS                                                    *
**********************************************************/
function commandButtons() {
   return new Array(MM.BTN_OK, "jQM.Settings.updateSettings()",
   					dw.loadString("Commands/MultiscreenPreview_EditViewSizes/Label_ResetToDefaults"), "jQM.Settings.setDefaults()",
   					MM.BTN_Cancel, "window.close()",
   					MM.BTN_Help, "displayHelp()"
                   );
}


//--------------------------------------------------------------------
// FUNCTION:
//   displayHelp
//
// DESCRIPTION:
//   Displays the built-in Dreamweaver help.
//
//--------------------------------------------------------------------
function displayHelp() {
    dwscripts.displayDWHelp(MM.HELP_jQueryMobile);
}

//--------------------------------------------------------------------
// FUNCTION:
//   receiveArguments
//
// DESCRIPTION:
//   Sets value for which widget to fire off upon configuration completion.
//
// ARGUMENTS:
//   opt - String containing the type of widget to invoke.
//--------------------------------------------------------------------
function receiveArguments(opt) {
	jQM.Settings.result = opt;
}