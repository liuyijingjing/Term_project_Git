//Copyright 2005-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//--------------- LOCALIZEABLE GLOBALS------------------
MSG_EnterValidURL = dw.loadString('Inspectors/_pi_flv_common/MSG_EnterValidURL');
MSG_EnterValidServerURI = dw.loadString('Inspectors/_pi_flv_common/MSG_EnterValidServerURI');
MSG_SelectFLVFile = dw.loadString('Inspectors/_pi_flv_common/MSG_SelectFLVFile');
MSG_SelectValidFile = dw.loadString('Inspectors/_pi_flv_common/MSG_SelectValidFile');
MSG_EnterStreamName = dw.loadString('Inspectors/_pi_flv_common/MSG_EnterStreamName');
MSG_EnterNumericValue = dw.loadString('Inspectors/_pi_flv_common/MSG_EnterNumericValue');
MSG_EnterNumericWidth = dw.loadString('Inspectors/_pi_flv_common/MSG_EnterNumericWidth');
MSG_EnterNumericHeight = dw.loadString('Inspectors/_pi_flv_common/MSG_EnterNumericHeight');
MSG_MinSizeClearSkin = dw.loadString('Inspectors/_pi_flv_common/MSG_MinSizeClearSkin');
MSG_MinSizeClearSkin1 = dw.loadString('Inspectors/_pi_flv_common/MSG_MinSizeClearSkin1');
MSG_MinSizeHaloSkin = dw.loadString('Inspectors/_pi_flv_common/MSG_MinSizeHaloSkin');
MSG_MinSizeHaloSkin1 = dw.loadString('Inspectors/_pi_flv_common/MSG_MinSizeHaloSkin1');
MSG_MaxWidth = dw.loadString('Inspectors/_pi_flv_common/MSG_MaxWidth');
MSG_MaxHeight = dw.loadString('Inspectors/_pi_flv_common/MSG_MaxHeight');
MSG_EnterValidBufferTime = dw.loadString('Inspectors/_pi_flv_common/MSG_EnterValidBufferTime');
MSG_EnterValidWidth = dw.loadString('Inspectors/_pi_flv_common/MSG_EnterValidWidth');
MSG_EnterValidHeight = dw.loadString('Inspectors/_pi_flv_common/MSG_EnterValidHeight');
MSG_CheckPermissions = dw.loadString('Inspectors/_pi_flv_common/MSG_CheckPermissions');
MSG_SelectHaloSkinForVCS = dw.loadString('Inspectors/_pi_flv_common/MSG_SelectHaloSkinForVCS');
MSG_SuccessUploadMediaFiles = dw.loadString('Inspectors/_pi_flv_common/MSG_SuccessUploadMediaFiles');
MSG_FailedUploadMediaFiles = dw.loadString('Inspectors/_pi_flv_common/MSG_FailedUploadMediaFiles');
MSG_UploadToFlashComm = dw.loadString('Inspectors/_pi_flv_common/MSG_UploadToFlashComm') + dw.loadString('Inspectors/_pi_flv_common/MSG_UploadToFlashComm_1') + dw.loadString('Inspectors/_pi_flv_common/MSG_UploadToFlashComm') + " main.asc";
MSG_NeedASite = dw.loadString('Inspectors/_pi_flv_common/MSG_NeedASite')
MSG_UnableToUploadedMedia = dw.loadString('Inspectors/_pi_flv_common/MSG_UnableToUploadedMedia')
MSG_UnableToDetectSize = dw.loadString('Inspectors/_pi_flv_common/MSG_UnableToDetectSize');
MSG_CopyStreamingFiles = dw.loadString('Inspectors/_pi_flv_common/MSG_CopyStreamingFiles');
MSG_CopyStreamingFiles1 = dw.loadString('Inspectors/_pi_flv_common/MSG_CopyStreamingFiles1') + "\n\n" + " FLVPlayer_Streaming.swf" + "\n" + " ";
MSG_CopyStreamingFiles2 = dw.loadString('Inspectors/_pi_flv_common/MSG_CopyStreamingFiles2') + dw.loadString('Inspectors/_pi_flv_common/MSG_CopyStreamingFiles2_1') + dw.loadString('Inspectors/_pi_flv_common/MSG_CopyStreamingFiles2') + " main.asc";
MSG_CopyProgDwnladFiles = dw.loadString('Inspectors/_pi_flv_common/MSG_CopyProgDwnladFiles');
MSG_CopyProgDwnladFiles1 = dw.loadString('Inspectors/_pi_flv_common/MSG_CopyProgDwnladFiles1') + "\n ";
MSG_Detecting = dw.loadString('Inspectors/_pi_flv_common/MSG_Detecting');

var MIN_WIDTH = dw.loadString('Inspectors/_pi_flv_common/MIN_WIDTH');


MM_HELP_videoPI = dw.loadString('Inspectors/_pi_flv_common/MM_HELP_videoPI');
//--------------- END LOCALIZEABLE---------------

var videoControlSourceFolder = dwscripts.filePathToLocalURL(dw.getConfigurationPath()
                    + dwscripts.FILE_SEP + "Templates" + dwscripts.FILE_SEP + "Video_Controls");

var videoQualities = new Array("Low","Auto Low","Auto High","High");
var videoScales = new Array("Default (Show all)","No border","Exact fit");
var videoAligns = new Array("Default", "Baseline","Top","Middle","Bottom","TextTop","Absolute Middle","Absolute Bottom","Left","Right");
var videoSAligns = new Array("lt");
var _HALO_SKIN_HEIGHT = 51;//pixel
var _HALO_SKIN_WIDTH = 22;//pixel

var _PROGRESSIVE_PLAYER = "FLVPlayer_Progressive.swf"; //Progressive
var _STREAMING_PLAYER = "FLVPlayer_Streaming.swf";     //Streaming
var _DETECT_SIZE_LOOP  = 30;//times
var videoStreamName = null;
var videoObj = null;
var lastVideoLoaded = "";

// UI elements
var VIDEO_PLAYER_ID;
var VIDEO_HEIGHT;
var VIDEO_WIDTH;
var VIDEO_SKIN_NAMES;
var VIDEO_AUTO_PLAY;
var VIDEO_AUTO_REWIND;
var VIDEO_TOTAL;
var VIDEO_MAINTAIN_AR;
var VIDEO_SIZE_BTN;

//flash params
var VIDEO_VSPACE;
var VIDEO_HSPACE;
var VIDEO_QUALITY;
var VIDEO_SCALE;
var VIDEO_ALIGN;
var VIDEO_SALIGN;

//--------------------------------------------------------------------
// FUNCTION:
//   initializeUICommon
//
// DESCRIPTION:
//   initializeUICommonElement
//
// ARGUMENTS:
//    none
//
// RETURNS:
//   void
//--------------------------------------------------------------------
function initializeUICommon()
{
  var fileMask = "*.swf";
  var skinValues = DWfile.listFolder(videoControlSourceFolder + "/" + fileMask,"files");
  var skinNames = new Array();
  var minWidths = new Array("Clear Skin 1",140,"Clear Skin 2",160,"Clear Skin 3",260,"Halo Skin 1",180,"Halo Skin 2",180,"Halo Skin 3",280,"Corona Skin 1",130,"Corona Skin 2",141,"Corona Skin 3",258);

  for (var i=0; i < skinValues.length; i++)
  {
    var skinName = skinValues[i];
    skinName = skinName.replace(/_/g, " ");
    skinName = skinName.replace(/\.swf/, "");
    for (var w=0; w < minWidths.length; w=w+2){
      if (minWidths[w] == skinName){
        var minWidth = MIN_WIDTH.replace(/%d/,minWidths[w+1]);
        skinName += "   (" + minWidth + ")";
        break;
       }
    }
    skinNames.push(skinName);
  }
  
  // Store references to form elements in global variables.
  VIDEO_PLAYER_ID = dwscripts.findDOMObject("videoID");
  VIDEO_WIDTH = dwscripts.findDOMObject("videoWidth");
  VIDEO_HEIGHT = dwscripts.findDOMObject("videoHeight"); 
  VIDEO_SIZE_BTN = dwscripts.findDOMObject("resetSize");  
  VIDEO_SKIN_NAMES = new ListControl("videoSkinName");
  VIDEO_SKIN_NAMES.setAll(skinNames,skinValues); 
  VIDEO_AUTO_PLAY = new CheckBox("","videoAutoPlay");
  VIDEO_AUTO_PLAY.initializeUI();
  VIDEO_AUTO_REWIND = new CheckBox("","videoAutoRewind");
  VIDEO_AUTO_REWIND.initializeUI();
  VIDEO_TOTAL = dwscripts.findDOMObject("videoTotalDim");  
  VIDEO_MAINTAIN_AR = new CheckBox("","videoMaintainAR");
  VIDEO_MAINTAIN_AR.initializeUI();
  VIDEO_SIZE_BTN.setAttribute("disabled","false");
  
	VIDEO_UPLOAD_BUTTON = dwscripts.findDOMObject("videoUploadMedia");

	//get docPath URL
	var docPath = dw.getDocumentPath("document");
	var siteName = site.getSiteForURL(docPath);
	if (siteName.length == 0)
	{
		siteName = site.getCurrentSite();
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   setValuesForCommonControl
//
// DESCRIPTION:
//   setValuesForCommonControls
//
// ARGUMENTS:
//    none
//
// RETURNS:
//   void
//--------------------------------------------------------------------
function setValuesForCommonControls(objectCode)
{
  //initialize the ui elements
  VIDEO_PLAYER_ID.value = getFlashAttrs(objectCode,"id");
  var skinName = getFLVAttrs(objectCode,"skinName");
  if (skinName.lastIndexOf("/") != -1)
	skinName = skinName.substr(skinName.lastIndexOf("/")+1);
  if (!VIDEO_SKIN_NAMES.pickValue(skinName+".swf"))
	VIDEO_SKIN_NAMES.setIndex(0);

  var videoWidth = getFlashAttrs(objectCode,"width");	
  var videoHeight = getFlashAttrs(objectCode,"height");	
  var videoSkinName = VIDEO_SKIN_NAMES.getValue();
  if ((videoSkinName != null) && (videoSkinName.length > 0))
  {
    //we have a halo skin - remove the halo offset
    //from the actual image heigh
    var haloIndex = videoSkinName.indexOf("Halo");
    if (haloIndex == 0)
    {
      videoHeight = videoHeight - _HALO_SKIN_HEIGHT;
      videoWidth = videoWidth - _HALO_SKIN_WIDTH;
    }
  }
  VIDEO_WIDTH.value = videoWidth;
  VIDEO_HEIGHT.value = videoHeight;

  var videoAutoPlay = getFLVAttrs(objectCode,"autoPlay");
  if (videoAutoPlay == "true")
  {
    //set the checked state
    VIDEO_AUTO_PLAY.setCheckedState(true);
  }
  else
  {
    VIDEO_AUTO_PLAY.setCheckedState(false);
  }
  var videoAutoRewind = getFLVAttrs(objectCode,"autoRewind");
  if (videoAutoRewind == "true")
  {
    //set the checked state
    VIDEO_AUTO_REWIND.setCheckedState(true);
  }
  else
  {
    VIDEO_AUTO_REWIND.setCheckedState(false);
  }
  //recompute the total based on the current width and height and skin offset
  VIDEO_TOTAL.innerHTML = computeVideoTotal(VIDEO_WIDTH.value,VIDEO_HEIGHT.value,VIDEO_SKIN_NAMES.getValue());
  
  MM.VIDEO_AR = VIDEO_WIDTH.value/VIDEO_HEIGHT.value;
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyVideoHeight
//
// DESCRIPTION:
//   applies the video Height attr change
//
// ARGUMENTS:
//    bCheckForSkin (not need for FVSSL)
//
// RETURNS:
//   void
//--------------------------------------------------------------------
function applyVideoHeight(bCheckForSkin)
{
    var videoHeight = VIDEO_HEIGHT.value;
    var height;
    var totalSize = VIDEO_TOTAL.innerHTML;
    var regExp = /(\d+)x(\d+)/;
        
    if (!videoHeight || !trimString(videoHeight))
    {
      alert(MSG_EnterNumericHeight);
      return;
    }
  
    videoHeight =  trimString(videoHeight);

    if (isNaN(videoHeight))
    {
      alert(MSG_EnterNumericHeight);
      return;
    }
    else if (videoHeight < 0 || videoHeight.indexOf(".") != -1)
    {
      alert(MSG_EnterValidHeight);
      return;
    }

      //true by default , false for FVSSL
    if (bCheckForSkin) 
    {
      if (VIDEO_SKIN_NAMES.getValue().indexOf("Halo") == 0)      
        height = parseInt(videoHeight) + _HALO_SKIN_HEIGHT;      
      else
        height = parseInt(videoHeight);
    }

    var videoWidth = VIDEO_WIDTH.value;
    
    if (VIDEO_MAINTAIN_AR.getCheckedState())
    {
      videoWidth = computeWidthAR(videoHeight,MM.VIDEO_AR);
    }
    
    //true by default , false for FVSSL
    if (bCheckForSkin) 
    {
        if (VIDEO_SKIN_NAMES.getValue().indexOf("Halo") == 0)
        {
            videoWidth = parseInt(videoWidth) + _HALO_SKIN_WIDTH;
            videoHeight = height;
        }      
    }
    //apply width and height
    applyFlashWidthAndHeightAttr(videoWidth,videoHeight);
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyVideoWidth
//
// DESCRIPTION:
//   applies the video Width attr change
//
// ARGUMENTS:
//    bCheckForSkin (not need for FVSSL)
//
// RETURNS:
//   void
//--------------------------------------------------------------------
function applyVideoWidth(bCheckForSkin)
{
    var videoWidth = VIDEO_WIDTH.value;
    var width;
    var totalSize = VIDEO_TOTAL.innerHTML;
    var regExp = /(\d+)x(\d+)/;
    
    if (!videoWidth || !trimString(videoWidth))
    {
      alert(MSG_EnterNumericWidth);
      return;
    }
    if (isNaN(videoWidth))
    {
      alert(MSG_EnterNumericWidth);
      return;
    }
    else if (videoWidth < 0 || videoWidth.indexOf(".") != -1)
    {
      alert(MSG_EnterValidWidth);
      return;
    }
    //true by default , false for FVSSL
    if (bCheckForSkin) 
    {
      if (VIDEO_SKIN_NAMES.getValue().indexOf("Halo") == 0)      
        width = parseInt(videoWidth) + _HALO_SKIN_WIDTH;
      else
        width = parseInt(videoWidth);      
    }

    //get the height
    var videoHeight = VIDEO_HEIGHT.value;
    if (VIDEO_MAINTAIN_AR.getCheckedState())
    {
      //maintain aspect ratio
      videoHeight = computeHeightAR(videoWidth,MM.VIDEO_AR);
    }
    
    //true by default , false for FVSSL
    if (bCheckForSkin) 
		{
			if (VIDEO_SKIN_NAMES.getValue().indexOf("Halo") == 0)
			{
				videoHeight = parseInt(videoHeight) + _HALO_SKIN_HEIGHT;
				videoWidth = width;
			}      
		}
    //apply width and height
    applyFlashWidthAndHeightAttr(videoWidth,videoHeight);
}



//--------------------------------------------------------------------
// FUNCTION:
//   getFlashAttrs
//
// DESCRIPTION:
//   gets attributes of the flash Video
//
// ARGUMENTS:
//   object code to parse: string
//   attrName : to locate in the object tag
//
// RETURNS:
//   int
//--------------------------------------------------------------------
function getFlashAttrs(objectCode,attrName)
{  
  var attrValue ="";
  if (objectCode && objectCode.length)
  {
    var attrLookUpRegEx = new RegExp('\\s+' + attrName + '\\s*=\\s*"([^\\r\\n]*?)"','i');
    //get the attribute value
    var attrValueMatchArray = objectCode.match(attrLookUpRegEx);
    if (attrValueMatchArray != null)
    {
      attrValue = RegExp.$1;
    }
  }
  return attrValue;
}


//--------------------------------------------------------------------
// FUNCTION:
//   getFLVAttrs
//
// DESCRIPTION:
//   get attributes of the FlV flashAttrs
//
// ARGUMENTS:
//   object code to parse: string
//   attrName : to locate in the string of flash Vars
//
// RETURNS:
//   attrValue
//--------------------------------------------------------------------
function getFLVAttrs(objectCode, attrName)
{
  var flashVars = "";
  var attrValue = "";
  if (objectCode && objectCode.length)
  {
    objectCode = objectCode.replace(/\&amp;/g, "&");
    //get the flashVars
    var flashVarsRegEx = /flashVars\s*=\s*"([^\r\n]*?)"/i;
    var flashVarsParamRegEx = /<\s*param\s*name=\s*"\s*FlashVars\s*"\s*value\s*=\s*"([^\r\n]*?)"/i;
    //read the values from the embed tag
    //if it fails try to read the values from the object tag
    var flashVarsMatchArray = objectCode.match(flashVarsRegEx);
    if (flashVarsMatchArray == null)
    {
      //read the values from object param tag
      flashVarsMatchArray = objectCode.match(flashVarsParamRegEx);
    }
    if (flashVarsMatchArray != null)
    {
      flashVars = RegExp.$1;
      //parse the flashVars      
      var flashVarNameValuePairs = flashVars.split("&");
      //flashVars = unescape(flashVars);
      for (var i=0; i < flashVarNameValuePairs.length; i++)
      {
         var nameValuePair = flashVarNameValuePairs[i].split("=");
         if ((nameValuePair.length > 1) && (nameValuePair[0] == attrName))
         {
          //set the attribute Value
          attrValue = unescape(nameValuePair[1]);
          break;
         }
      }
    }
  }
  return attrValue;
}

//--------------------------------------------------------------------
// FUNCTION:
//   updateIdInConstructor
//
// DESCRIPTION:
//   
//
// ARGUMENTS:
//  dom - object - The DOM for the current document in the design view.
//  curId - string - The element ID to search for.
//  newId - string - The string that will replace curID.
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function updateIdInConstructor(dom, curId, newId)
{
  var updateConstructorRegEx = new RegExp("swfobject\\.registerObject\\s*?\\(\\s*?[\"']" + dwscripts.escRegExpChars(curId) + "[\"']");
  var scriptTags = dom.getElementsByTagName("script");
  for ( var i = 0; i < scriptTags.length; i++ )
  {
    if ( scriptTags[i].innerHTML.match(updateConstructorRegEx) )
    {
      scriptTags[i].innerHTML = scriptTags[i].innerHTML.replace(updateConstructorRegEx, "swfobject.registerObject(\"" + newId + "\"");
    }
  }
};

//--------------------------------------------------------------------
// FUNCTION:
//   applyFlashAttr
//
// DESCRIPTION:
//   applies a flash attribute name + value change
//
// ARGUMENTS:
//   the attribute to change
//   the new value for the attribute
//
// RETURNS:
//   void
//--------------------------------------------------------------------
function applyFlashAttr(attrName, attrValue)
{
  if (attrName == "id")
  {
    //get the original code and restore the ID.
    var dom = dw.getDocumentDOM();
    var ele = (attrValue != "") ? dom.getElementById(attrValue) : null;
    var errMsg = "";
    
    if (attrValue == "")
    {
      errMsg = dw.loadString("flash/no empty id");
    }
    else if (ele && ele != dom.getSelectedNode())
    {
      errMsg = dw.loadString("flash/id conflict");
    }

    if (errMsg != "")
    {
      alert(errMsg);

      var theObj = dom.getSelectedNode();
      var objectCode = theObj ? theObj.outerHTML : "";

      // restore the previous ID
      VIDEO_PLAYER_ID.value = getFlashAttrs(objectCode,"id");
      return;
    }
  }
  
  //get the original code
  var dom = dw.getDocumentDOM();
  var theObj = dom.getSelectedNode();
  var objectCode = theObj.outerHTML;
  var origObjectCode = objectCode;

  if (objectCode && objectCode.length)
  {
    var attrLookUpRegEx = new RegExp('(\\s+)' + attrName + '\\s*=\\s*"([^\\r\\n]*?)"','ig');
    var attrValueMatchArray = objectCode.match(attrLookUpRegEx);
    if (attrValueMatchArray != null)
    {
      var attrNameValuePairToReplace = RegExp.$1 + attrName + '="'+ attrValue + '"';
      var curId = RegExp.$2;
      objectCode = objectCode.replace(attrLookUpRegEx,attrNameValuePairToReplace);
      if (objectCode && objectCode != unescape(origObjectCode))
      {
        if (attrName == "id" && flashVideoInEdit)
            flashVideoInEdit.id = curId;

        replaceSel(objectCode);

        if (attrName == "id")
        {
            updateIdInConstructor(dom, curId, attrValue);
            if (flashVideoInEdit)
                flashVideoInEdit.id = "";
        }

        dom.setSelectedNode(theObj); 
      }
    }
  }
}

//--------------------------------------------------------------------
// FUNCTION:
//   applyFlashWidthAndHeightAttr
//
// DESCRIPTION:
//   applies a new width and height
//
// ARGUMENTS:
//   the attribute to change
//   the new value for the attribute
//
// RETURNS:
//   void
//--------------------------------------------------------------------
function applyFlashWidthAndHeightAttr(width, height)
{   
  //get the original code
  var dom = dw.getDocumentDOM();
  var theObj = dom.getSelectedNode();
  var objectCode = theObj.outerHTML;
  var origObjectCode = objectCode;

  if (objectCode && objectCode.length)
  {
    //replace the width
    var widthAttrLookUpRegEx = new RegExp('(\\s+)' + 'width' + '\\s*=\\s*"([^\\r\\n]*?)"','ig');
    var attrValueMatchArray = objectCode.match(widthAttrLookUpRegEx);
    if (attrValueMatchArray != null)
    {
      var attrNameValuePairToReplace = RegExp.$1 + 'width' + '="'+ width + '"';
      objectCode = objectCode.replace(widthAttrLookUpRegEx,attrNameValuePairToReplace);
    }
    //replace the height
    var heightAttrLookUpRegEx = new RegExp('(\\s+)' + 'height' + '\\s*=\\s*"([^\\r\\n]*?)"','ig');
    var attrValueMatchArray = objectCode.match(heightAttrLookUpRegEx);
    if (attrValueMatchArray != null)
    {
      var attrNameValuePairToReplace = RegExp.$1 + 'height' + '="'+ height + '"';
      objectCode = objectCode.replace(heightAttrLookUpRegEx,attrNameValuePairToReplace);
    }
    if (objectCode && objectCode != unescape(origObjectCode))
    {
      replaceSel(objectCode);
    }
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   applySkinName
//
// DESCRIPTION:
//   applies a skin name change and also adjust the video dimensions 
//	 to account when there is change in skin type from halo-<-> clear skin
//
// ARGUMENTS:
//		skinName
//
// RETURNS:
//   void
//--------------------------------------------------------------------
function applySkinName(skinName)
{
  var videoWidth  = VIDEO_WIDTH.value;
  var videoHeight = VIDEO_HEIGHT.value;

  skinName = skinName.replace(/\.swf/, "");
  
  //add the halo offsets
  if (skinName.indexOf("Halo")==0)
  {
    videoWidth = parseInt(videoWidth) + _HALO_SKIN_WIDTH;
    videoHeight = parseInt(videoHeight) + _HALO_SKIN_HEIGHT;
  }

  //get the original code
  var dom = dw.getDocumentDOM();
  var theObj = dom.getSelectedNode();
  var objectCode = theObj.outerHTML;
  var origObjectCode = objectCode;

  if (objectCode && objectCode.length)
  {
    objectCode = objectCode.replace(/\&amp;/g, "&");

    //replace the width
    var widthAttrLookUpRegEx = new RegExp('(\\s+)' + 'width' + '\\s*=\\s*"([^\\r\\n]*?)"','ig');
    var attrValueMatchArray = objectCode.match(widthAttrLookUpRegEx);
    if (attrValueMatchArray != null)
    {
      var attrNameValuePairToReplace = RegExp.$1 + 'width' + '="'+ videoWidth + '"';
      objectCode = objectCode.replace(widthAttrLookUpRegEx,attrNameValuePairToReplace);
    }
    //replace the height
    var heightAttrLookUpRegEx = new RegExp('(\\s+)' + 'height' + '\\s*=\\s*"([^\\r\\n]*?)"','ig');
    var attrValueMatchArray = objectCode.match(heightAttrLookUpRegEx);
    if (attrValueMatchArray != null)
    {
      var attrNameValuePairToReplace = RegExp.$1 + 'height' + '="'+ videoHeight + '"';
      objectCode = objectCode.replace(heightAttrLookUpRegEx,attrNameValuePairToReplace);
    }

    //apply the skin attribute (e.g halo and clear)
    //get the flashVars of the embed tag to update
    var flashVarsRegEx = /flashVars\s*=\s*"([^\r\n]*?)"/ig;
    var flashVarsParamLookUpRegEx = /<\s*param\s*name=\s*"\s*FlashVars\s*"\s*value\s*=\s*"([^\r\n]*?)"/ig;
    var flashVarsMatchArray = objectCode.match(flashVarsRegEx);
    if (flashVarsMatchArray == null)
    {
      //read the values from object param tag
      flashVarsMatchArray = objectCode.match(flashVarsParamLookUpRegEx);
    }
    if (flashVarsMatchArray != null)
    {
      flashVars = RegExp.$1;
      //parse the flashVars
      flashVars = unescape(flashVars);
      var flashVarNameValuePairs = flashVars.split("&");
      for (var i=0; i < flashVarNameValuePairs.length; i++)
      {
         var nameValuePair = flashVarNameValuePairs[i].split("=");
         if ((nameValuePair.length > 1) && (nameValuePair[0] == "skinName"))
         {
            //set the attribute Value
            nameValuePair[1] = skinName;
            //form the new value pair
            flashVarNameValuePairs[i] = nameValuePair.join("=");
         }
      }
      flashVarsValue = flashVarNameValuePairs.join("&amp;");
      var flashVarsNameValuePairToReplace = 'flashvars' + '="'+ flashVarsValue + '"';
      objectCode = objectCode.replace(flashVarsRegEx,flashVarsNameValuePairToReplace);    
    }

    //get the flashVars of the object::param tag to update
    if ((flashVarsValue != null) && (flashVarsValue.length > 0))
    {
      var flashVarsParamRegEx = /<\s*param(\s*)name=\s*"\s*FlashVars\s*"(\s*)value\s*=\s*"([^\r\n]*?)"/ig;
      var flashVarsParamMatchArray = objectCode.match(flashVarsParamRegEx);
      if (flashVarsParamMatchArray != null)
      {
        var flashVarsParamNameValuePairToReplace = '<param' + RegExp.$1 + 'name="FlashVars"' +  RegExp.$2 + 'value="' + flashVarsValue +'"';
        objectCode = objectCode.replace(flashVarsParamRegEx,flashVarsParamNameValuePairToReplace);    
      }
    }
    if (objectCode && objectCode != unescape(origObjectCode))
    {
      replaceSel(objectCode);
    }
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyFLVServerAttr
//
// DESCRIPTION:
//   applies a FLV serverName and appname changes
//
// ARGUMENTS:
//   the server name 
//   the app instance name
//
// RETURNS:
//   void
//--------------------------------------------------------------------
function applyFLVServerAttr(serverName, appName)
{    
  //get the original code
  var dom = dw.getDocumentDOM();
  var theObj = null;
  var curSelObj = null;
  var curSelArr = null;
  var videoObjSelArr = null;

  if (!videoObj)
  {
	//get the original code
    theObj = dom.getSelectedNode();
  }
  else
  {
    curSelObj = dom.getSelectedNode();
    curSelArr = dom.getSelection(); 

    theObj = videoObj;
    if (theObj == curSelObj) 
      curSelObj = null;
    videoObj = null;
  }
  
  if (!theObj) return;
  videoObjSelArr = dom.nodeToOffsets(theObj);

  var objectCode = theObj.outerHTML;
  var origObjectCode = objectCode;
  var flashVarsValue = null;

  if (objectCode && objectCode.length)
  {
    objectCode = objectCode.replace(/\&amp;/g, "&");

    //get the flashVars of the embed tag to update
    var flashVarsRegEx = /flashVars\s*=\s*"([^\r\n]*?)"/ig;
    var flashVarsParamLookUpRegEx = /<\s*param\s*name=\s*"\s*FlashVars\s*"\s*value\s*=\s*"([^\r\n]*?)"/ig;
    var flashVarsMatchArray = objectCode.match(flashVarsRegEx);
    if (flashVarsMatchArray == null)
    {
      //read the values from object param tag
      flashVarsMatchArray = objectCode.match(flashVarsParamLookUpRegEx);
    }
    if (flashVarsMatchArray != null)
    {
      flashVars = RegExp.$1;
      //parse the flashVars
      flashVars = unescape(flashVars);
      var flashVarNameValuePairs = flashVars.split("&");
      for (var i=0; i < flashVarNameValuePairs.length; i++)
      {
         var nameValuePair = flashVarNameValuePairs[i].split("=");
         if ((nameValuePair.length > 1) && (nameValuePair[0] == "serverName"))
         {
            //set the attribute Value
            nameValuePair[1] = serverName;
            //form the new value pair
            flashVarNameValuePairs[i] = nameValuePair.join("=");
         }
         else if ((nameValuePair.length > 1) && (nameValuePair[0] == "appName"))
         {
            //set the attribute Value
            nameValuePair[1] = appName;
            //form the new value pair
            flashVarNameValuePairs[i] = nameValuePair.join("=");
         }
      }
      flashVarsValue = flashVarNameValuePairs.join("&amp;");
      var flashVarsNameValuePairToReplace = 'flashvars' + '="'+ flashVarsValue + '"';
      objectCode = objectCode.replace(flashVarsRegEx,flashVarsNameValuePairToReplace);    
    }

    //get the flashVars of the object::param tag to update
    if ((flashVarsValue != null) && (flashVarsValue.length > 0))
    {
      var flashVarsParamRegEx = /<\s*param(\s*)name=\s*"\s*FlashVars\s*"(\s*)value\s*=\s*"([^\r\n]*?)"/ig;
      var flashVarsParamMatchArray = objectCode.match(flashVarsParamRegEx);
      if (flashVarsParamMatchArray != null)
      {
        var flashVarsParamNameValuePairToReplace = '<param' + RegExp.$1 + 'name="FlashVars"' +  RegExp.$2 + 'value="' + flashVarsValue +'"';
        objectCode = objectCode.replace(flashVarsParamRegEx,flashVarsParamNameValuePairToReplace);    
      }
    }

    if (objectCode && objectCode != unescape(origObjectCode))
    {
      //restore selection to original video object
      dom.setSelection(videoObjSelArr[0],videoObjSelArr[1]);

      replaceSel(objectCode);

      // adjust the offset of user's selection if user clicks somewhere after the video object 
      // the video object size is not the same as the old one.
      if (curSelArr && videoObjSelArr[1] < curSelArr[0])
      {
        theObj = dom.getSelectedNode();
        var selArr = dom.nodeToOffsets(theObj);
        var delta = selArr[1] - videoObjSelArr[1];
        curSelArr[0] += delta;
        curSelArr[1] += delta;
      }
    }

    //restore selection to last clicked item or insertion point
    if (curSelArr)
    {
      dom.setSelection(curSelArr[0],curSelArr[1]);
    }
    else if (curSelObj)
    {
      var selArr = dom.nodeToOffsets(curSelObj);
      dom.setSelection(selArr[0],selArr[1]);
    }
  }
  return;    
}


//--------------------------------------------------------------------
// FUNCTION:
//   applyFLVAttr
//
// DESCRIPTION:
//   applies a FLV attribute name + value change
//
// ARGUMENTS:
//   the attribute to change
//   the new value for the attribute
//
// RETURNS:
//   void
//--------------------------------------------------------------------
function applyFLVAttr(attrName, attrValue)
{    
  //get the original code
  var dom = dw.getDocumentDOM();
  var theObj = dom.getSelectedNode();
  var objectCode = theObj.outerHTML;
  var origObjectCode = objectCode;
  var flashVarsValue = null;

  if (objectCode && objectCode.length)
  {
    objectCode = objectCode.replace(/\&amp;/g, "&");

    //get the flashVars of the embed tag to update
    var flashVarsRegEx = /flashVars\s*=\s*"([^\r\n]*?)"/ig;
    var flashVarsParamLookUpRegEx = /<\s*param\s*name=\s*"\s*FlashVars\s*"\s*value\s*=\s*"([^\r\n]*?)"/ig
    var flashVarsMatchArray = objectCode.match(flashVarsRegEx);
    if (flashVarsMatchArray == null)
    {
      //read the values from object param tag
      flashVarsMatchArray = objectCode.match(flashVarsParamLookUpRegEx);
    }
    if (flashVarsMatchArray != null)
    {
      flashVars = RegExp.$1;
      //parse the flashVars
      flashVars = unescape(flashVars);
      var flashVarNameValuePairs = flashVars.split("&");
      for (var i=0; i < flashVarNameValuePairs.length; i++)
      {
         var nameValuePair = flashVarNameValuePairs[i].split("=");
         if ((nameValuePair.length > 1) && (nameValuePair[0] == attrName))
         {
            //set the attribute Value
            nameValuePair[1] = attrValue;
            //form the new value pair
            flashVarNameValuePairs[i] = nameValuePair.join("=");
            break;
         }
      }
      flashVarsValue = flashVarNameValuePairs.join("&amp;");
      var flashVarsNameValuePairToReplace = 'flashvars' + '="'+ flashVarsValue + '"';
      objectCode = objectCode.replace(flashVarsRegEx,flashVarsNameValuePairToReplace);    
    }

    //get the flashVars of the object::param tag to update
    if ((flashVarsValue != null) && (flashVarsValue.length > 0))
    {
      var flashVarsParamRegEx = /<\s*param(\s*)name=\s*"\s*FlashVars\s*"(\s*)value\s*=\s*"([^\r\n]*?)"/ig;
      var flashVarsParamMatchArray = objectCode.match(flashVarsParamRegEx);
      if (flashVarsParamMatchArray != null)
      {
        var flashVarsParamNameValuePairToReplace = '<param' + RegExp.$1 + 'name="FlashVars"' +  RegExp.$2 + 'value="' + flashVarsValue +'"';
        objectCode = objectCode.replace(flashVarsParamRegEx,flashVarsParamNameValuePairToReplace);    
      }
    }
    if (objectCode && objectCode != unescape(origObjectCode))
    {
      replaceSel(objectCode);
    }
  }
  return attrValue;    
}


//--------------------------------------------------------------------
// FUNCTION:
//   replaceSel()
//
// DESCRIPTION:
//   Replaces the current selection with the supplied HTML. 
//
//
// ARGUMENTS:
//   newHTML - the new HTML to insert in place of the current selection.
//
// RETURNS:
//   nothing.
//             
//--------------------------------------------------------------------

function replaceSel(objectCode)
{
	var dom = dw.getDocumentDOM();
	var theObjOffsets = dom.getSelection();
	var documentContents = dom.documentElement.outerHTML;
	var newDocumentContents = documentContents.substr(0, theObjOffsets[0]);
	
	newDocumentContents += objectCode;
	newDocumentContents += documentContents.substr(theObjOffsets[1]);
	
	dom.documentElement.outerHTML = newDocumentContents;
}

//--------------------------------------------------------------------
// FUNCTION:
//   computeVideoTotal()
//
// DESCRIPTION:
//   compute the total size of video taking into a/c the height for skin
//
//
// ARGUMENTS:
//   newHTML - the new HTML to insert in place of the current selection.
//
// RETURNS:
//   nothing.
//             
//--------------------------------------------------------------------
function computeVideoTotal(width , height , skinName)
{
  var totalStr = "";

  var iHeight = parseInt(height);
  var iWidth = parseInt(width);
  
  if (skinName.indexOf("Halo") != -1)
  {
    iHeight = iHeight + _HALO_SKIN_HEIGHT;
    iWidth = iWidth + _HALO_SKIN_WIDTH;
  }
  totalStr +=iWidth;
  totalStr +="x";   
  totalStr +=iHeight;
  return totalStr;
}

//--------------------------------------------------------------------
// FUNCTION:
//   computeWidthAR()
//
// DESCRIPTION:
//   compute the width while maintaining the aspect ratio
//
//
// ARGUMENTS:
//   the height 
//   the aspect ratio
//
// RETURNS:
//   returns the width.
//             
//--------------------------------------------------------------------
function computeWidthAR(height , ar)
{
  var widthAR = -1;
  if (ar != null)
  {
    var arFloat = parseFloat(ar);
    var iHeight = parseInt(height);
    if (iHeight != null)
    {
      widthAR = Math.ceil(arFloat*iHeight);
    }
  }
  return widthAR;
}

//--------------------------------------------------------------------
// FUNCTION:
//   computeHeightAR()
//
// DESCRIPTION:
//   compute the height while maintaining the aspect ratio
//
//
// ARGUMENTS:
//   the width 
//   the aspect ratio
//
// RETURNS:
//   returns the width.
//             
//--------------------------------------------------------------------
function computeHeightAR(width , ar)
{
  var heightAR = -1;
  if (ar != null)
  {
    var arFloat = parseFloat(ar);
    var iWidth = parseInt(width);
    if (iWidth != null)
    {
      heightAR = Math.ceil(iWidth/arFloat);
    }
  }
  return heightAR;
}


//--------------------------------------------------------------------
// FUNCTION:
//   copyTheVideoControl()
//
// DESCRIPTION:
//   compute the video Control and skin name
//
// ARGUMENTS:
//   skinName
//
// RETURNS:
//   void
//             
//--------------------------------------------------------------------
function copyVideoControl(skinName)
{
  //get the source control folder
  var videoControlsFileSourceFolder = dwscripts.filePathToLocalURL(dw.getConfigurationPath()
                  + dwscripts.FILE_SEP + "Templates" + dwscripts.FILE_SEP + "Video_Controls");
  var videoControlsFileDestFolder = dwscripts.getParentURL(dw.getDocumentPath("document")) + dwscripts.FILE_SEP;
  dwscripts.copyFileTo(videoControlsFileSourceFolder + dwscripts.FILE_SEP + skinName, videoControlsFileDestFolder + skinName, true);
}


//--------------------------------------------------------------------
// FUNCTION:
//   uploadFLVMedia()
//
// DESCRIPTION:
//   uploadFLVMedia associated with the flashVideo
//
// ARGUMENTS:
//   movieName , skinName
//
// RETURNS:
//   void
//             
//--------------------------------------------------------------------
function uploadFLVMedia(movieName,skinName,bStreaming)
{
	var failedUploadMsg = "";
	var bIsDocInSite = true;
	var docURL = dw.getDocumentPath("document");
	var siteName = site.getSiteForURL(docURL);
	if (siteName.length == 0)
	{
		//could not locate a site for the given document path
		bIsDocInSite = false;
	}
	var bSuccess = false;
	if (bIsDocInSite)
	{
		//upload the player
		if (bStreaming)
		{
			//streaming player
			var playerPath = getFullURL(_STREAMING_PLAYER);
			if (dwscripts.fileExists(playerPath))
			{
				//status code = 0 means success
				var bStatus = site.put(playerPath);
				bSuccess = (site.put(playerPath)==0);
			}
		}
		else
		{
			//progressive player
			var playerPath = getFullURL(_PROGRESSIVE_PLAYER);
			if (dwscripts.fileExists(playerPath))
			{
				//status code = 0 means success
				bSuccess = (site.put(playerPath) == 0);
			}
		}

		//if not succeed display the message and return
		if (!bSuccess)
		{
			//add the prefix of the message
			if (failedUploadMsg.length == 0)
			{
				failedUploadMsg = MSG_FailedUploadMediaFiles;
			}
			failedUploadMsg += " ";
			if (bStreaming)
			{
				failedUploadMsg += _STREAMING_PLAYER;
			}
			else
			{
				failedUploadMsg += _PROGRESSIVE_PLAYER;
			}
			failedUploadMsg += "\n";
		}

		//for not streaming - upload the .flv file
		if (!bStreaming)
		{
			if ((movieName != null) && (movieName.length > 0))
			{
				movieName = trimString(movieName);
				//upload the movie 
				if (isFileURL(movieName))
				{
					bSuccess = false;
					var movieFilePath = getFullURL(movieName);
					if (dwscripts.fileExists(movieFilePath))
					{
						//status code = 0 means success
						bSuccess = (site.put(movieFilePath)==0);
					}

					if (!bSuccess)
					{
						//add the prefix of the message
						if (failedUploadMsg.length == 0)
						{
							failedUploadMsg = MSG_FailedUploadMediaFiles;
						}
						failedUploadMsg += " ";
						failedUploadMsg += movieName;
						failedUploadMsg += "\n";
					}
				}
			}
		}

		if ((skinName != null) && (skinName.length > 0))
		{
			//upload the skin file
			bSuccess = false;
			var skinFilePath = getFullURL(skinName);
			if (dwscripts.fileExists(skinFilePath))
			{
				//status code = 0 means success
				bSuccess = (site.put(skinFilePath) == 0);
			}
			if (!bSuccess)
			{
				//add the prefix of the message
				if (failedUploadMsg.length == 0)
				{
					failedUploadMsg = MSG_FailedUploadMediaFiles;
				}
				failedUploadMsg += " ";
				failedUploadMsg += skinName;
			}
		}

		//if we failed to upload the files
		//list the files 
		if (failedUploadMsg.length > 0)
		{
			alert(failedUploadMsg);
			return;
		}


		if (bSuccess)
		{
			//inform the user that the files have been successfully uploaded
			var successMsg = MSG_SuccessUploadMediaFiles;
			//add the player
			successMsg += " ";
			if (bStreaming)
			{
				successMsg += _STREAMING_PLAYER;
			}
			else
			{
				successMsg += _PROGRESSIVE_PLAYER;
			}
			successMsg += "\n";
			if (!bStreaming)
			{
				//upload the movie 
				if (isFileURL(movieName))
				{
					//add movie for progressive
					successMsg += " ";
					successMsg += movieName;
					successMsg += "\n";
				}
			}
			//add skin name for progressive
			successMsg += " ";
			successMsg += skinName;
				successMsg += "\n";
			//for streaming add text to put other files on flashComm Server
			if (bStreaming)
			{
				successMsg += MSG_UploadToFlashComm;
				successMsg += "\n";
				successMsg += " ";
				successMsg += movieName;
			}
			alert(successMsg);
		}
	}
	else
	{
		alert(MSG_NeedASite);
	}
}

//-------------------------------------------------------------------
// FUNCTION:
//   trimString
//
// DESCRIPTION:
//   trims the string.
//
// ARGUMENTS:
//   str - the string
//
// RETURNS:
//   return - trimmed string.
//
//--------------------------------------------------------------------

function trimString(str)
{
  var regExpBeginSpaces = /^\s*/
  var regExpEndSpaces = /\s*$/;
  str = str.replace(regExpBeginSpaces,"");
  str = str.replace(regExpEndSpaces,"");
  return str;
}


//-------------------------------------------------------------------
// FUNCTION:
//   encodeURL
//
// DESCRIPTION:
//   Encodes the characters not encoded by escape().
//
// ARGUMENTS:
//   str - the string
//
// RETURNS:
//   return - encoded string.
//
//--------------------------------------------------------------------

function encodeURL(str)
{
  var charArray = new Array();
  var encodedValueArray = new Array();
  
  charArray[0] = "!";
  encodedValueArray[0] = "%21";
  charArray[1] = "#";
  encodedValueArray[1] = "%23";
  charArray[2] = "$";
  encodedValueArray[2] = "%24";
  charArray[3] = "&";
  encodedValueArray[3] = "%26";
  charArray[4] = "(";
  encodedValueArray[4] = "%28";
  charArray[5] = ")";
  encodedValueArray[5] = "%29";
  charArray[6] = ",";
  encodedValueArray[6] = "%2C";
  charArray[7] = " ";
  encodedValueArray[7] = "%20";
  charArray[8] = ";";
  encodedValueArray[8] = "%3B";
  charArray[9] = "=";
  encodedValueArray[9] = "%3D";
  charArray[10] = "?";
  encodedValueArray[10] = "%3F";
  charArray[11] = "@";
  encodedValueArray[11] = "%40";
  charArray[12] = "\\";
  encodedValueArray[12] = "%5C";
  charArray[13] = "|";
  encodedValueArray[13] = "%7C";  
  for(var i = 0; i < charArray.length; i++)
  {
    //replace the characters with encoded strings.
    while(str.indexOf(charArray[i]) != -1)
      str = str.substring(0,str.indexOf(charArray[i])) + encodedValueArray[i] + str.substr(str.indexOf(charArray[i]) + 1);
  }
  return str;
}


//-------------------------------------------------------------------
// FUNCTION:
//   isFileURL
//
// DESCRIPTION:
//   checks if it fileURL
//
// ARGUMENTS:
//   aFileURL
//
// RETURNS:
//   nothing.
//
//--------------------------------------------------------------------
function isFileURL(aURL)
{
	var bIsFileURL = true;
	if ((aURL != null) && (aURL.length))
	{
		if ((aURL.indexOf("http://") == 0) || (aURL.indexOf("rtmp://") == 0))
		{
			bIsFileURL = false;
		}	
	}
	return bIsFileURL;
}

//--------------------------------------------------------------------
// FUNCTION:
//   getFullURL()
//
// DESCRIPTION:
//   get the full url specified the url , w.r.t to doc relative
//
//
// ARGUMENTS:
//   the url (rtmp)
//
// RETURNS:
//   nothing.
//             
//--------------------------------------------------------------------
function getFullURL(aURL)
{
	var absoluteURL = aURL;
	if ((aURL != null) && (aURL.length))
	{
		//get docPath URL
		var docPath = dw.getDocumentPath("document");
		var siteRoot = dw.getSiteRoot();
		//get absolute URL from relative URL
		absoluteURL = dw.relativeToAbsoluteURL(docPath,siteRoot,aURL);
		if (absoluteURL.indexOf("file:////") == 0)
		{
			absoluteURL = absoluteURL.substring(8,absoluteURL.length);
		}
	}
	return absoluteURL;
}

//+-------------------------------------------------------------------+
// jvillegas: helper functions to call the Flash Player dll 

// loadVideo must be called to initialize the FLV file before 
// calling getVideoProps()
function loadVideo(videoURL)
{
	// call this function in the stub movie
	if ((videoURL != null) && (videoURL.length > 0) && (lastVideoLoaded != videoURL))
	{
		lastVideoLoaded = videoURL;
	    FLVLoader.fileToLoad = videoURL;
	    FLVLoader.wantFLVDimensions = "true";
	    FLVLoader.reload();
	}
}

// getVideoProps() sniffs the FLV file for the width/height info
// this should be called on a separate event from loadVideo to give the player
// some cycles to actualy load the FLV buffer
function getVideoProps()
{
	var videoDim = new Array();
	if (FLVLoader.isReady == "true" && FLVLoader.xnError == "false")
	{ 
	    videoDim[0] = FLVLoader.flvWidth;
	    videoDim[1] = FLVLoader.flvHeight;
	    videoDim[2] = FLVLoader.videocodecid;
	}		
	else
	{	
	    videoDim[0] = videoDim[1] = videoDim[2] = 0; 
	}
	
	return videoDim;
}

//--------------------------------------------------------------------
// FUNCTION:
//   isDetectSizeDone()
//
// DESCRIPTION:
//   checks if detect size is done
//
//
// ARGUMENTS:
//   the url (file or http)
//
// RETURNS:
//   nothing.
//             
//--------------------------------------------------------------------
function isDetectSizeDone()
{
	//check if we are not yet done detecting

	var videoDim = getVideoProps();

	if ((videoDim != null) && (videoDim.length > 0))
	{
		if ((videoDim[0] != null) && (videoDim[1] != null))
		{
			if ((videoDim[0] != 0) && (videoDim[1] != 0))
			{					
				//turn on the flag when we have successfully detected the size
				VIDEO_WIDTH.value = videoDim[0];
				VIDEO_HEIGHT.value = videoDim[1];
				MM.VIDEO_AR = VIDEO_WIDTH.value/VIDEO_HEIGHT.value;
				//apply the new dimensions if possible based on the skin set
				var videoWidth =  VIDEO_WIDTH.value;
				var videoHeight = VIDEO_HEIGHT.value;
				if (VIDEO_SKIN_NAMES.getValue().indexOf("Halo") == 0)
				{
					videoWidth = parseInt(videoWidth) + _HALO_SKIN_WIDTH;
					videoHeight = parseInt(videoHeight) + _HALO_SKIN_HEIGHT;
				}      
				//apply width and height
				applyFlashWidthAndHeightAttr(videoWidth,videoHeight);
				VIDEO_SIZE_BTN.setAttribute("disabled","false");
				VIDEO_TOTAL.innerHTML = computeVideoTotal(VIDEO_WIDTH.value,VIDEO_HEIGHT.value,VIDEO_SKIN_NAMES.getValue());
				MM.clearBusyCursor();
			}
			else
			{	
				if (MM._LOOPCOUNTER == _DETECT_SIZE_LOOP - 1)
				{
					//alert the user to detect size
					MM.clearBusyCursor();
					alert(MSG_UnableToDetectSize);							
					VIDEO_SIZE_BTN.setAttribute("disabled","false");
					if (VIDEO_WIDTH.value && VIDEO_HEIGHT.value)
						VIDEO_TOTAL.innerHTML = computeVideoTotal(VIDEO_WIDTH.value,VIDEO_HEIGHT.value,VIDEO_SKIN_NAMES.getValue());
					else
						VIDEO_TOTAL.innerHTML = "";
				}
				else
				{
					//increament the loop counter and set a time out recursively
					MM._LOOPCOUNTER++;
					//set the call back
					var funCallBack = "isDetectSizeDone()";
					setTimeout(funCallBack,500);
				}																		
			}
		}
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   isDetectCodecIDDone()
//
// DESCRIPTION:
//   checks if detect size is done
//
//
// ARGUMENTS:
//   the url (file or http)
//
// RETURNS:
//   nothing.
//             
//--------------------------------------------------------------------
function isDetectCodecIDDone()
{
	//check if we are not yet done detecting

	var videoDim = getVideoProps();

	if ((videoDim != null) && (videoDim.length > 0))
	{
		if ((videoDim[2] != null) && (videoDim[0] != 0) && (videoDim[1] != 0))
		{
			applyStreamNameAndPlayerVersion(videoDim[2]);
			VIDEO_SIZE_BTN.setAttribute("disabled","false");
		}
		else
		{	
			if (MM._LOOPCOUNTER == _DETECT_SIZE_LOOP - 1)
			{
				// TODO : show a warning
				// Codec id detection fails. But we still want to apply stream name and 
				// target the lowest version of Flash player.
				applyStreamNameAndPlayerVersion(-1);
				VIDEO_SIZE_BTN.setAttribute("disabled","false");
			}
			else
			{
				//increament the loop counter and set a time out recursively
				MM._LOOPCOUNTER++;
				//set the call back
				var funCallBack = "isDetectCodecIDDone()";
				setTimeout(funCallBack,500);
			}																		
		}
	}
}

//--------------------------------------------------------------------
// FUNCTION:
//   applyStreamNameAndPlayerVersion
//
// DESCRIPTION:
//   updates the required Flash player version 
//
// ARGUMENTS:
//   the detected codec ID
//
// RETURNS:
//   void
//--------------------------------------------------------------------
function applyStreamNameAndPlayerVersion(codecID)
{
  var dom = dw.getDocumentDOM();
  var theObj = null;
  var curSelObj = null;
  var curSelArr = null;
  var videoObjSelArr = null;
  if (!videoObj)
  {
	//get the original code
    theObj = dom.getSelectedNode();
  }
  else
  {
    curSelObj = dom.getSelectedNode();
    curSelArr = dom.getSelection(); 
    theObj = videoObj;

    if (theObj == curSelObj) 
      curSelObj = null;
    videoObj = null;

  }

  if (!theObj) return;
  videoObjSelArr = dom.nodeToOffsets(theObj);
  
  var objectCode = theObj.outerHTML;
  var origObjectCode = objectCode;
  var flashVarsValue = null;
  var version = "8,0,0,0";
 
  if (objectCode && objectCode.length)
  {
    objectCode = objectCode.replace(/\&amp;/g, "&");

    //get the flashVars of the embed tag to update
    var flashVarsRegEx = /flashVars\s*=\s*"([^\r\n]*?)"/ig;
    var flashVarsParamLookUpRegEx = /<\s*param\s*name=\s*"\s*FlashVars\s*"\s*value\s*=\s*"([^\r\n]*?)"/ig;
    var flashVarsMatchArray = objectCode.match(flashVarsRegEx);
    if (flashVarsMatchArray == null)
    {
      //read the values from object param tag
      flashVarsMatchArray = objectCode.match(flashVarsParamLookUpRegEx);
    }
    if (flashVarsMatchArray != null && videoStreamName != null && videoStreamName.length > 0)
    {
      flashVars = RegExp.$1;
      //parse the flashVars
      flashVars = unescape(flashVars);
      var flashVarNameValuePairs = flashVars.split("&");
      for (var i=0; i < flashVarNameValuePairs.length; i++)
      {
         var nameValuePair = flashVarNameValuePairs[i].split("=");
         if ((nameValuePair.length > 1) && (nameValuePair[0] == "streamName"))
         {
            //set the attribute Value
            nameValuePair[1] = videoStreamName;
            //form the new value pair
            flashVarNameValuePairs[i] = nameValuePair.join("=");
            break;
         }
      }
      flashVarsValue = flashVarNameValuePairs.join("&amp;");
      var flashVarsNameValuePairToReplace = 'flashvars' + '="'+ flashVarsValue + '"';
      objectCode = objectCode.replace(flashVarsRegEx,flashVarsNameValuePairToReplace);
      videoStreamName = null;
    }

    //get the flashVars of the object::param tag to update
    if ((flashVarsValue != null) && (flashVarsValue.length > 0))
    {
      var flashVarsParamRegEx = /<\s*param(\s*)name=\s*"\s*FlashVars\s*"(\s*)value\s*=\s*"([^\r\n]*?)"/ig;
      var flashVarsParamMatchArray = objectCode.match(flashVarsParamRegEx);
      if (flashVarsParamMatchArray != null)
      {
        var flashVarsParamNameValuePairToReplace = '<param' + RegExp.$1 + 'name="FlashVars"' +  RegExp.$2 + 'value="' + flashVarsValue +'"';
        objectCode = objectCode.replace(flashVarsParamRegEx,flashVarsParamNameValuePairToReplace);    
      }
	}

    //replace the version
    var versionAttrLookUpRegEx = new RegExp('#version' + '\\s*=(.*?)"','ig');
    var attrValueMatchArray = objectCode.match(versionAttrLookUpRegEx);
    if (attrValueMatchArray != null)
    {
      var attrNameValuePairToReplace = '#version=' + version + '"';
      objectCode = objectCode.replace(versionAttrLookUpRegEx,attrNameValuePairToReplace);
    }

    if (objectCode && objectCode != unescape(origObjectCode))
    {
      //restore selection to original video object
      dom.setSelection(videoObjSelArr[0],videoObjSelArr[1]);

      replaceSel(objectCode);

      // adjust the offset of user's selection if user clicks somewhere after the video object 
      // the video object size is not the same as the old one.
      if (curSelArr && videoObjSelArr[1] < curSelArr[0])
      {
        theObj = dom.getSelectedNode();
        var selArr = dom.nodeToOffsets(theObj);
        var delta = selArr[1] - videoObjSelArr[1];
        curSelArr[0] += delta;
        curSelArr[1] += delta;
      }
    }

    //restore selection to last clicked item or insertion point
    if (curSelArr)
    {
      dom.setSelection(curSelArr[0],curSelArr[1]);
    }
    else if (curSelObj)
    {
      var selArr = dom.nodeToOffsets(curSelObj);
      dom.setSelection(selArr[0],selArr[1]);
    }
  }
}
