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

var PREF_SECTION = "jQueryMobile\\Settings"; //Key to place all of our settings under.

//Type of link.
var PREF_LINK_TYPE = "Link Type Index";     // whether to link to jQuery via CDN or locally
var PREF_LINK_REMOTE = 0;					//Index of remote link type radio button.
var PREF_LINK_LOCAL = 1;					//Index of local link type radio button.

//Type of CSS
var PREF_CSS_TYPE = "CSS Type Index";       //Whether to use a single or split CSS file
var PREF_CSS_FILE = "CSS Theme File";		//Name of CSS theme file.
var PREF_CSS_SPLIT = 0;						//Value for split css type.
var PREF_CSS_SINGLE = 1;					//Value for single css type.

//Radio button values
var REMOTE = 'REMOTE';
var LOCAL = 'LOCAL';
var SPLIT_CSS = 'SPLIT_CSS';
var ALL_CSS = 'ALL_CSS';

//Local file preferences (Single CSS)
var PREF_JQ_JS_SRC = "PREF_JQ_JS_SRC";
var PREF_JQM_JS_SRC = "PREF_JQM_JS_SRC";
var PREF_JQM_CSS_SRC = "PREF_JQM_CSS_SRC";
var PREF_JQ_JS_DEST = "PREF_JQ_JS_DEST";
var PREF_JQM_JS_DEST = "PREF_JQM_JS_DEST";
var PREF_JQM_CSS_DEST = "PREF_JQM_CSS_DEST";
var PREF_JQLIB_SOURCE_FOLDER = "PREF_JQ_LIB_SOURCE";
var PREF_ICON_DIR = "PREF_ICON_DIR";

//Local file preferences (Split CSS)
var PREF_SPLIT_JQ_JS_SRC = "PREF_SPLIT_JQ_JS_SRC";
var PREF_SPLIT_JQM_JS_SRC = "PREF_SPLIT_JQM_JS_SRC";
var PREF_SPLIT_JQM_CSS_SRC = "PREF_SPLIT_JQM_CSS_SRC";
var PREF_SPLIT_JQ_JS_DEST = "PREF_SPLIT_JQ_JS_DEST";
var PREF_SPLIT_JQM_JS_DEST = "PREF_SPLIT_JQM_JS_DEST";
var PREF_SPLIT_JQM_CSS_DEST = "PREF_SPLIT_JQM_CSS_DEST";
var PREF_SPLIT_JQLIB_SOURCE_FOLDER = "PREF_SPLIT_JQ_LIB_SOURCE";
var PREF_SPLIT_ICON_DIR = "PREF_SPLIT_ICON_DIR";

//Remote file preferences. 
var REMOTE_JQ = "REMOTE_JQ";
var REMOTE_JS = "REMOTE_JS";
var REMOTE_CSS = "REMOTE_CSS";
var REMOTE_STRUCTURE = "REMOTE_STRUCTURE";
var REMOTE_THEME = "REMOTE_THEME";
 
//Resource CDN strings
/** Remote */
var jqmJavascriptSource = "http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js";
var jqmJquerySource = "http://code.jquery.com/jquery-1.6.4.min.js";
var jqmCSSSource = "http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css";
var jqmStructureSource = "http://code.jquery.com/mobile/1.0/jquery.mobile.structure-1.0.min.css";
var jQMThemeSource = "";

/** Local */
var jqmDir = "jquery-mobile/";							//Directory all assets such be under.
var assetDir = "Third Party Source Code/" + jqmDir;		//Directory default assets are located (Relative to configuration).
var localJS = "jquery.mobile-1.0.min.js";
var localCSS = "jquery.mobile-1.0.min.css";
var localStructureCSS = "jquery.mobile.structure-1.0.min.css";
var localJQ = "jquery-1.6.4.min.js";
var localIconDir = "images/";
var localThemeCSS = "jquery.mobile.theme-1.0.min.css";

//For Page dialog.
var PREF_PAGE_HEADER = "PREF_PAGE_HEADER";
var PREF_PAGE_FOOTER = "PREF_PAGE_FOOTER";