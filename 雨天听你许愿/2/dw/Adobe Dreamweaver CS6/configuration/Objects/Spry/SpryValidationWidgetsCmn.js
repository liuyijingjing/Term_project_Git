
/*
 * This function checks the parent tags of the selected node for a FORM tag. If such a tag is found
 * and has an OnSubmit attribute defined, we'll display a warning letting the user know about issue
 * that may appear in this case.
 */
function checkParentForm(tag)
{
	var canContinue = true;
	var theTag = tag;
	while (canContinue)
	{
		if (theTag && theTag.tagName && theTag.tagName.toLowerCase)
		{
			switch (theTag.tagName.toLowerCase())
			{
				case "form":
				{
					if (theTag.getAttribute && theTag.getAttribute("onSubmit"))
					{
						var warningString = dw.loadString("spry/widget/Validation/alert/warning/parent form contains onsubmit");
						dw.optionalAlert("spryParentFormContainsOnSubmit", warningString);
					}
					canContinue = false;
				}
				break;

				case "body":
				{
					canContinue = false;
				}
				break;

				default:
				{
					theTag = theTag.parentNode;
				}
			}
		}
		else
		{
			canContinue = false;
		}
	}
}

/*
 * This function selects the widget having the given ID. It should have a SPAN container to be selected.
 * This methos is usually called right after widget insertion, so we can suppose that this widget has a SPAN.
 */
function selectWidgetByID(id)
{
	var dom = dw.getDocumentDOM();
	var elems = dom.getElementsByAttributeName("id");
	for (var i=0; i<elems.length; i++)
	{
		if (elems[i] && elems[i].getAttribute && elems[i].getAttribute("id") == id)
		{
			var offsets = dom.nodeToOffsets(elems[i]);
			if (offsets)
			{
				dom.setSelection(offsets[0], offsets[1]);
			}
			break;
		}
	}
}

/*
 * This function sets insertion point for validation widgets if the selected tags are form or body. For those
 * 2 tags the selection needs to be moved.
 */
function setInsertionPoint(dom, selNode){ 
	//cbank - this function is causing worse problems with selection. Bailing out for now pending better solution. 
	//need to be more acurrate about the actual seletion - if it's <body>[ip]<tag></body> we shouldn't move the IP 
	//after the tag (even though body could be the selected node in this case depending on how the IP was placed)
	return;
	
	var selOffset = dom.nodeToOffsets(selNode); 
	if( selNode.tagName == "FORM" )
	{
		// Building endOffset manually to startOffset+selNode.outerHTML.length since nodeToOffsets returns for the selOffset[1]
		// an invalid value (it includes any space that may exist after the closing tag)
		var endOffset = selOffset[0] + selNode.outerHTML.length;

		var endTagLength = 7; // length of </form>

		// selected node its the form tag, insert the widget as last node of the form
		dom.setSelection(endOffset - endTagLength, endOffset - endTagLength);
	}
	else if (selNode.tagName == "BODY")
	{
		//get inserted script tag and set IP before
		var scriptTags = dom.body.getElementsByTagName("SCRIPT");
		if( scriptTags )
		{
			for( var i = 0; i < scriptTags.length; i++ )
			{
				if( scriptTags[i].innerHTML && scriptTags[i].innerHTML.match(/Spry\.Widget\./i) )
				{
					var nodeOffsets = dom.nodeToOffsets(scriptTags[i]);
					if( nodeOffsets )
					{
						// set IP before the script tag
						dom.setSelection(nodeOffsets[0], nodeOffsets[0]);
						break;
					}
				}
			}
		}
	}
}
