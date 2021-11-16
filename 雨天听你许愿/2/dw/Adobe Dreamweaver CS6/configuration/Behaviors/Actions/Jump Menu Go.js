         
// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

//*****************GLOBAL VARIABLES*************************
  
var helpDoc = MM.HELP_behJumpMenuGo;

var GarrJumpMenus;   //global array storing jump menu objects and ids             
var GselJumpMenus;   //select widget listing jump menus
var GbValidContext=true;  //can the action be applied in the current context

//******************BEHAVIOR FUNCTION(S)********************

//behavior function: MM_jumpMenuGo
//description: attached to a button that is associated with a jump menu
//             changes the document or frame URL based on jump menu selection
//arguments: objId - the id of the select
//           targ - target, either a frame reference or 'parent'
//           retore - boolean - controls whether the first option selection is restored


function MM_jumpMenuGo(objId,targ,restore){ //v9.0
  var selObj = null;  with (document) { 
  if (getElementById) selObj = getElementById(objId);
  if (selObj) eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
  if (restore) selObj.selectedIndex=0; }
}
  
MM.VERSION_MM_jumpMenuGo = 9.0; //define latest version number for behavior inspector

//************************API FUNCTIONS************************

// Only enable this behavior if a jump menu without an existing
// Go button is in the page. (Assumption is that onChange event
// on select tag means no go button, even though in previous
// releases the select tag *always* got an onChange event.)

function canAcceptBehavior(theTag){
  var dom = dw.getDocumentDOM();
  if (dom){
    var selArr = dom.getElementsByTagName("SELECT");
    if (selArr && selArr.length > 0)
    {
      var selObj = dw.getBehaviorElement();
      if (!selObj && theTag)
        selObj = dom.getSelectedNode();
      if (selObj && (selObj.tagName == "IMG" || selObj.tagName == "A" || selObj.tagName == "BUTTON" || (selObj.tagName == "INPUT" && typeof(selObj.getAttribute("type")) != "undefined" && selObj.getAttribute("type").toLowerCase() == "button")))
    	  return 'onClick,(onClick)';
    }
  }
  return false;
}

//returns the name of the function that will be inserted into the document head

function behaviorFunction(){
   return "MM_jumpMenuGo";
}


//function: applyBehavior
//description: returns the function call attached to the event call

function applyBehavior(){

   // if context isn't valid, don't bother with the rest
   // returning an emptry string from this function means the dialog
   // closes if the user clicks the OK button
   // the dialog has already been populated with a friendly error message
   // in the initialize UI function
   if ( !GbValidContext )
      return "";

   //If the menu is set to an empty option, tell the user they need to
   //select a jump menu
   if ( GselJumpMenus.options[GselJumpMenus.selectedIndex].text == ""){
      return (MSG_No_Item_Selected);
   }

   //The GarrJumpMenus global array holds a jump menu obj in [i][0],
   //(and the associated jump menu id in [i][1].)
   var menuObj = GarrJumpMenus[GselJumpMenus.selectedIndex][0];
   var menuId = GarrJumpMenus[GselJumpMenus.selectedIndex][1];
   
	 // If the selected menu was created with an older version of DW,
	 // it might only have a name attribute and no id. An id
	 // is now required for the behavior to work properly, so
	 // if none is found, we'll add one using the same value 
	 // as the name attribute.
	 menuObj.setAttribute("id",menuId);   
   
   //The MM_jumpMenuGo function call needs to have the same target
   //and restore options as the MM_jumpMenu function call that it is
   //associated with.
   //Find the function call from the outerHTML of the tag
   //It is probably on the onChange handler, but using regular expressions
   //is more robust and will find the function call on any handler.
   var selectStr = menuObj.outerHTML;
   var pattern = /MM_jumpMenu(\()([^\)]*)(\))/;
   var fnStr = pattern.exec(selectStr);    
   
   //next, extract the arguments from the function call and get the target
   //and restore arguments
   var fnArgs = null, target = 'parent', bRestore = 0;
   if (fnStr)
   {
    fnArgs = extractArgs(fnStr).slice(1); //args now equal target,"this",restore
    target = escQuotes(fnArgs[0]);
    bRestore = fnArgs[2];
   }
   
   // Remove the MM_jumpMenu call from the select list
   selectStr = selectStr.replace(pattern,"");
   menuObj.outerHTML = selectStr;
   var handlerVal = menuObj.getAttribute("onChange");
   if (handlerVal != null && typeof(handlerVal) != "undefined")
   {
     handlerVal = handlerVal.replace(/\s*/g,"");
     if (handlerVal = "")
       menuObj.removeAttribute("onChange");  
   }
   
   //create argument list
   return "MM_jumpMenuGo('" + menuId + "','" + target + "',"+ bRestore  + ")";
}


//function: inspectBehavior
//description: populate the behavior dialog based on the function arguments

function inspectBehavior(behFnCallStr){

  //select correct item in the Jump Menu list
  var fnArgs = extractArgs(behFnCallStr).slice(1);
  if (fnArgs.length > 2) {
    var menuId = fnArgs[0];
    var nMenus = GarrJumpMenus.length
    var i;
    var found = false;
     
    for (i=0;i<nMenus;i++){
      if(menuId == GarrJumpMenus[i][1]){
	      GselJumpMenus.selectedIndex = i;
	      found = true;
        break;
	  } }
   
    //if we can't find the menu associated with this button, tell the
    //user it can't be found, and tell them to select another one.
    if (!found) {
      alert (MSG_Menu_Not_Found + "\n" + MSG_Why_Not_Found + "\n");
    }
  }
}


//function: identifyBehaviorArguments
//description: identify certain types of behavior arguments

function identifyBehaviorArguments(fnCallStr){
  var argArray, retVal = "";

  argArray = extractArgs(fnCallStr);
  if (argArray.length == 4) retVal = "objId,other,other";
  return retVal;
}

//************************LOCAL FUNCTIONS***************************



//function: getAllJumpMenus
//description: returns a multi-dimensional array of i items
//representing all of the jump menus in the current document or frame
//i[0] is the id of the select menu
//i[1] is the object reference to it

function getAllJumpMenus(){
   var jumpMenuArr = new Array();
   var doc = dreamweaver.getDocumentDOM();
   var selArr = doc.getElementsByTagName("SELECT");
   var nSelects = selArr.length;
   var currSelObj, objId;
   var counter = 0;
   
   for (i=0;i<nSelects;i++){
     currSelObj = selArr[i];
     objId = currSelObj.getAttribute("id");

		 // If the menu was created with an older version of DW,
		 // it might only have a name attribute and no id. An id
		 // is now required for the behavior to work properly, so
		 // if none is found, we'll add one using the same value 
		 // as the name attribute in the applyBehavior() function.
     if (!objId)
       objId = currSelObj.getAttribute("name");

	   jumpMenuArr[counter] = new Array(2);
		 jumpMenuArr[counter][0] = currSelObj;		 
		 jumpMenuArr[counter++][1] = objId;
		 
   }
   return jumpMenuArr;
}



//function: initializeUI
//description: initialize the user interface, attached to body onload
//in this case, make sure that behavior is valid in this context, and
//populate the Jump Menu list
function initializeUI(){

    GselJumpMenus = findObject("JumpMenuList");
   
   //populate the GarrJumpMenus global array
   GarrJumpMenus = getAllJumpMenus();
   
   //check validity  of using behavior and give user 
   //informative message if not valid
   if ( !checkValidity() ){
      GbValidContext = false;
      return;
   }
   
   //make main layer visible, previously hidden to prevent flashing
   //if dialog text changes because document is invalid
   findObject("mainLayer").visibility = "visible";
   
   //populate list and select a likely candidate
   populateJumpMenuOptions(); 
   selectJumpMenuOption();
}



//function: selectJumpMenuOption
//description: selects a likely jump menu choice, based on cursor location
//if cursor in a form, selects a menu that is in the same form as the cursor
//exists. Barring that, selects the first item.
//In a perfect world, would determined which menu was closest to cursor
//if determining that more than one jump menu was in the form
function selectJumpMenuOption(){
   
   //default selection
   GselJumpMenus.selectedIndex = 0;
  
   if (  GarrJumpMenus.length == 1  )
      return;
   else {
      //check if it is possible to select a menu in the 
	  //same form as the current selection
      var selObj = dw.getDocumentDOM().getSelectedNode();
      var currFormObj = getFormObj(selObj);
	  var nMenus = GselJumpMenus.length;
   
      for (i=0;i<nMenus;i++){
	     if (  GarrJumpMenus[i].form == currFormObj  ){
		    GselJumpMenus.selectedIndex = i;
			break;
		 }   
	  }
   }
}



//function: getFormObj
//description: given the currently selected object,
//return the parent form, if one exists, otherwise return ""

function getFormObj(selObj){
   var currObj = selObj;
   var formObj = "";
   
   while (currObj){
      if (currObj.tagName && currObj.tagName == "FORM"){
	     formObj = currObj;
	     break;
	  } 
	  currObj = (currObj.parentNode)?currObj.parentNode:"";   
   }
   return formObj;
}



//function: populateJumpMenuOptions
//description: populate the UI based on the global array

function populateJumpMenuOptions(){
   var nMenus = GarrJumpMenus.length,i;
   
   for (i = 0;i<nMenus;i++){
      GselJumpMenus.options[i] = new Option(GarrJumpMenus[i][1]);
   }
}


//function: checkValidity
//description: check the validity of using this behavior action
//if not valid, display an informative error message

function checkValidity(){
   var isValid = true,behFile,bodyNode;
   
   if ( GarrJumpMenus.length < 1){
      isValid = false;
	  
      behFile = dreamweaver.getConfigurationPath() +
      "/Behaviors/Actions/" + FILE_Name;
   
	   bodyNode = dreamweaver.getDocumentDOM(behFile).body;
					  
       bodyNode.innerHTML = "<p>&nbsp;</p>" +
	                      "<p>" + MSG_Invalid_Document + "</p>" +
	                      "<p>" + MSG_Correcting_Document + "</p>";    
   }
   return isValid;
}
