// Depends on JavascriptTestRunnerPanel_Mediator.js

function JavascriptTestRunnerPanel()
{
	this.mediator 				= new JavascriptTestRunnerPanel_Mediator(this);
	this.browserCtrl 			= null;
	this.browserCtrlLoaded		= false;

	this.initUI = function()
		{
			this.browserCtrl = document.getElementById('browserCtrl');
			this.browserCtrl.addEventListener("BrowserControlLoad", function() { setTimeout( "panel.initUI2()", 10) }, false); 
			
			var html = 	'<html>' +
							'<head>' +
								'<link href="dw://Configuration/Floaters/JavascriptTestRunnerPanel.css" rel="stylesheet" type="text/css" />' +
							'</head>' +
							'<body>' +
								'<div id="main">' +													
								'</div>' +
							'</body>' +
						'</html>';
						
			this.browserCtrl.loadHTML(html);
		}
		
	this.initUI2 = function() 
		{
			this.browserCtrlLoaded = true;
			this.browserCtrl.getWindow().parentPanel = this; 
			this.makeBrowserCtrlFitPanel();
			this.mediator.runTests();
		}
		
	this.setBrowserCtrlMainContent = function(html)
		{
			this.browserCtrl.getWindow().document.getElementById('main').innerHTML = html;
		}
		
	this.makeBrowserCtrlFitPanel = function()
		{
			if (!this.browserCtrlLoaded)
				return;
		
			this.browserCtrl.style.width = (window.innerWidth - 100) + 'px';
			this.browserCtrl.style.height = (window.innerHeight) + 'px';
		}
		
	this.onShow = function()
		{
			this.mediator.onShow();
		}
		
	this.onResize = function()
		{
			this.mediator.onResize();
		}
		
	this.onClickRunAllTests = function()
		{			
			this.mediator.onClickRunAllTests();
		}
	
	this.selectionChanged = function()
		{
			this.mediator.selectionChanged();	
		}
		
	this.onClickBrowserCtrlFileLink = function(fileUrl)
		{
			this.mediator.onClickBrowserCtrlFileLink(fileUrl);
		}
}
