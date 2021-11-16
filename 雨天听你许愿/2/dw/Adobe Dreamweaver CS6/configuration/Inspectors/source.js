// JavaScript Document
function canInspectSelection(){ 
    return true; 
}

function inspectSelection(){ 
    var theDOM = dw.getDocumentDOM(); 
    var theObj = theDOM.getSelectedNode(); 
 
    // Get the value of the DIRECTION attribute on the MARQUEE tag. 
    var theDirection = theObj.getAttribute('type'); 

    var directionIndex = -1; 
     
    // If there was a DIRECTION attribute... 
    if (theDirection){ 
        // If the value of DIRECTION is "left", set typeIndex to 0. 
        if (theDirection.toLowerCase() == "left"){ 
            directionIndex = 0; 
        // If the value of DIRECTION is "right", set typeIndex to 1. 
            }else if (theDirection.toLowerCase() == "right"){ 
                directionIndex = 1; 
                } 
            } 
    // If the value of the DIRECTION attribute was "left" 
    // or "right", choose the corresponding 
    // option from the pop-up menu in the interface. 
    if (directionIndex != -1){ 
        document.topLayer.document.topLayerForm.marqDirection.selectedIndex = directionIndex; 
    } 
 
    // Get the value of the DIRECTION attribute on the MARQUEE tag. 
    var media = theObj.getAttribute('media'); 
 
    // Initialize a variable for the DIRECTION attribute to -1. 
    // This is used to store the menu index that corresponds to 
    // the value of the attribute. 
    // var typeIndex = -1; 
    var mediaIndex = -1; 
     
    // If there was a DIRECTION attribute... 
    if (media){ 
        // If the value of DIRECTION is "left", set typeIndex to 0. 
        if (media.toLowerCase() == "screen"){ 
            mediaIndex = 0; 
        // If the value of DIRECTION is "right", set typeIndex to 1. 
            }else if (media.toLowerCase() == "handheld"){ 
                mediaIndex = 1; 
                } 
            } 
    // If the value of the DIRECTION attribute was "left" 
    // or "right", choose the corresponding 
    // option from the pop-up menu in the interface. 
    if (mediaIndex != -1){ 
        document.topLayer.document.topLayerForm.media.selectedIndex = mediaIndex; 
    } 
	
	 var width = theObj.getAttribute('width'); 
     var widthIndex = -1; 
    if (width){ 
                if (width.toLowerCase() == "300"){ 
            widthIndex = ""; 
                    }
            } 
      if (widthIndex != -1){ 
        document.topLayer.document.topLayerForm.width.value = widthIndex; 
    } 
	 var height = theObj.getAttribute('height'); 
     var heightIndex = -1; 
    if (height){ 
                if (height.toLowerCase() == "280"){ 
            heightIndex = ""; 
                    }
            } 
      if (heightIndex != -1){ 
        document.topLayer.document.topLayerForm.height.value = heightIndex; 
    } 
	
	}

function settype(){ 
    // Get the DOM of the current document. 
    var theDOM = dw.getDocumentDOM(); 
    // Get the selected node. 
    var theObj = theDOM.getSelectedNode(); 
     
    // Get the index of the selected option in the pop-up menu 
    // in the interface. 
    var directionIndex =document.topLayer.document.topLayerForm.marqDirection.selectedIndex; 
    // Get the value of the selected option in the pop-up menu 
    // in the interface. 
    var theDirection = document.topLayer.document.topLayerForm.marqDirection.options[directionIndex].value;
 
    // Set the value of the direction attribute to theDirection. 
    theObj.setAttribute('type',theDirection); 
}


function setMediaTag(){ 
    // Get the DOM of the current document. 
    var theDOM = dw.getDocumentDOM(); 
    // Get the selected node. 
    var theObj = theDOM.getSelectedNode(); 
     
    // Get the index of the selected option in the pop-up menu 
    // in the interface. 
    var directionIndex =document.topLayer.document.topLayerForm.media.selectedIndex; 
    // Get the value of the selected option in the pop-up menu 
    // in the interface. 
    var theDirection = document.topLayer.document.topLayerForm.media.options[directionIndex].value;
 
    // Set the value of the direction attribute to theDirection. 
    theObj.setAttribute('media',theDirection); 
}
function setwidth(){ 
    var theDOM = dw.getDocumentDOM(); 
    var theObj = theDOM.getSelectedNode(); 
 
    var theDirection = document.topLayer.document.topLayerForm.width.value;
 
    theObj.setAttribute('width',theDirection); 
}
function setheight(){ 
    var theDOM = dw.getDocumentDOM(); 
    var theObj = theDOM.getSelectedNode(); 
 
    var theDirection = document.topLayer.document.topLayerForm.height.value;
 
    theObj.setAttribute('height',theDirection); 
}