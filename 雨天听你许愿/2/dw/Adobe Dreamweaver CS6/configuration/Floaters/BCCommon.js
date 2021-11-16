// *********************************************************************************
// 
// ADOBE CONFIDENTIAL
// ___________________
//
// Copyright 2011 Adobe Systems Incorporated
// All Rights Reserved.
//
// NOTICE:  All information contained herein is, and remains
// the property of Adobe Systems Incorporated and its suppliers,
// if any.  The intellectual and technical concepts contained
// herein are proprietary to Adobe Systems Incorporated and its
// suppliers and are protected by trade secret or copyright law.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe Systems Incorporated.
//
// *********************************************************************************

// this file contains vars and functions common to other bc files
var bcCommon = {

    /* String constant for preference string section of BC. */
    PREFERENCE_SECTION_BC :		'Business Catalyst',

    /* String constants for various BC preference keys. */
    PREFERENCE_KEY_BC_SERVER_URL :	'BC Server URL',
    PREFERENCE_KEY_BC_LOGIN_TOKEN :	'BC Login Token',
    PREFERENCE_KEY_BC_ONLY_LOGIN :	'BC Only Login',
    PREFERENCE_KEY_BC_DIALOG_STATE :    'BC Dialog State',
    PREFERENCE_KEY_BC_STAY_LOGGED_IN :	'BC Stay Logged In',
    PREFERENCE_KEY_BC_SKIP_WELCOME :	'BC Skip Welcome',

    /* No error. */
    ERR_NO_ERR : 0,
    /* Stale generic token. */
    ERR_SESSION_TIMEOUT : 1,
    /* Unknown error while parsing the response. */
    ERR_PARSING_ERR : 2,
    /* Unknown XHR request failure. */
    ERR_XHR_FAILURE : 3,
    /* Site ID is invalid or null. */
    ERR_INVALID_SITEID : 4,
    /* Trial site has expired. */
    ERR_TRIAL_SITE_EXPIRY : 5,

    // turn this on to enable logging of debug messages to site reports
    logMessages : false,

    // turn this on to target the test harness URL(s) which may differ from
    // the final target URLs. TODO: remove when no longer needed
    useTestHarnessURLs : false,
};

// Use this function to send debug messages to the site reports window
// someday we need to add our own JS log window, but for now we'll steal site reports
// type -> specify the type of the message e.g. REP_ITEM_NOTE = note
// file -> file or function to report the message from
// message -> message to be displayed
function logMessage(type,file,message) 
{
    if (bcCommon.logMessages)
        reportItem(type, file, message);
}
