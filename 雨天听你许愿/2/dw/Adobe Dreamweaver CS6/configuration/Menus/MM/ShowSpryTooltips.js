// ********************* API FUNCTIONS ***************************
   
function canAcceptCommand()
{
  dom = dw.getDocumentDOM();
  
  return (	dw.getFocus() != 'browser' && 
        dom != null && 
        !dom.getIsLibraryDocument() &&
        dom.getParseMode() == 'html' );

}

function isCommandChecked()
{
  if (dw.getDocumentDOM() && Spry.DesignTime.Widget.Tooltip.getTooltipsEnabled(true))
  {
    return true;
  }
  else
  {
    return false;  
  }
}

// ********************* UTILITY FUNCTIONS ***************************

//--------------------------------------------------------------------
// FUNCTION:
//   toggleSpryTooltips
//
// DESCRIPTION:
//   Wrapper for Spry.DesignTime.Widget.Tooltip.toggleTooltips()
//
// ARGUMENTS:
//   None
//
// RETURNS:
//   N/A
//--------------------------------------------------------------------

function toggleSpryTooltips()
{      
  Spry.DesignTime.Widget.Tooltip.toggleTooltips();    
  }  
    
