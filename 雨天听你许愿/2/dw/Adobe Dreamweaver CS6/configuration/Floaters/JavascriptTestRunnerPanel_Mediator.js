// Depends on:
//		FormatDate.js
//		MultifileRunner.js

function JavascriptTestRunnerPanel_Mediator(panel)
{
	this.panel = panel;	
	
	// If our prototype has these properties defined, use them, otherwise use defaults.
	//
	this.multifileRunner 	= this.multifileRunner 	|| new MultifileRunner();
	this.dw 				= this.dw 				|| dw;
	
	this.initedUI = false;
	
	this.passedHtmlTemplate = 	'<div class="displayBanner passBanner">Passed</div>' +
								'<div class="content">' +
									'<table width="100%" border=0 cellpadding=0  cellspacing=0>' +
										'<tr><td class="resultsLabel" nowrap align="right">Num Test Files:</td><td width="100%" class="resultsData">NUM_TEST_FILES</td></tr>' +
										'<tr><td class="resultsLabel" nowrap align="right">Num Test Cases:</td><td class="resultsData">NUM_TEST_CASES</td></tr>' +					
										'<tr><td class="resultsLabel" nowrap align="right">Tests Run At:</td><td class="resultsData">TESTS_RUN_AT</td></tr>' +					
									'</table>' +
								'</div>';
	
	this.failedHtmlTemplateHeader = '<div class="displayBanner failBanner">Failed</div>';
	
	this.failedHtmlTemplateRecord = 

			'<div class="content">' +
				'<table width="100%" border=0 cellpadding=0  cellspacing=0>' +
					'<tr><td class="resultsLabel" nowrap align="right">Test File:</td>' +
						'<td class="resultsData" width="100%"><a href="#" onclick="parentPanel.onClickBrowserCtrlFileLink(\'TEST_FILE_URL\');">TEST_FILE</a></td></tr>' +
					'<tr><td class="resultsLabel" valign="top" nowrap align="right">Test Case:</td>' +
						'<td class="resultsData">TEST_CASE</td></tr>' +
					'<tr><td class="resultsLabel" valign="top" nowrap align="right">Message:</td>' + 
						'<td class="resultsData">MESSAGE</td></tr>' +
				'</table>' +			
			'</div>';

	this.errorHtmlTemplate =	'<div class="displayBanner failBanner">Error</div>' +
								'<div class="content">' +
									'<table width="100%" border=0 cellpadding=0  cellspacing=0>' +
										'<tr><td class="resultsLabel" nowrap>Test File:</td>' +
											'<td class="resultsData" width="100%"><a href="#" onclick="parentPanel.onClickBrowserCtrlFileLink(\'TEST_FILE_URL\');">TEST_FILE</a></td></tr>' +
										'<tr><td class="resultsLabel" nowrap  valign="top">Message from Dreamweaver:</td>' +
											'<td class="resultsData">DW_MESSAGE</td></tr>' +
										'<tr><td class="resultsLabel" nowrap valign="top">Message from JS Interpreter:</td>' +
											'<td class="resultsData">JS_MESSAGE</td></tr>' +
									'</table>' +			
								'</div>';

	this.initUI = function()
		{
			if (!this.initedUI)
			{
				this.panel.initUI();	
				this.initedUI = true;				
			}	
		}	
		
	this.onShow = function()
		{
			this.initUI();
		}
		
	this.onResize = function()
		{
			this.initUI();
			this.panel.makeBrowserCtrlFitPanel();
		}
		
	this.selectionChanged = function()
		{
			this.initUI();
		}
		
	this.onClickRunAllTests = function()
		{			
			if (this.dw.canSaveAll())
				this.dw.saveAll();
	
			var html = 	'<div class="displayBanner">Running</div>' +
						'<div class="content" style="padding:10px;">' +
							'Running Javascript Tests...' +
						'</div>';
			
			this.panel.setBrowserCtrlMainContent(html);
			this.runTests();	
		}
		
	this.runTests = function()
		{
			var results = this.multifileRunner.runTests();
			var html = '';
			
			if (results.status == 'passed')
			{
				html = this.getPassedViewHtml(results);
			}
			else if (results.status == 'failed')
			{
				html = this.getFailedViewHtml(results);
			}
			else if (results.status == 'error')			
			{
				html = this.getErrorViewHtml(results);				
			}
			else
			{
				alert('Unrecognized results.status in JavascriptTestRunnerPanel_Mediator.js. results.status = ' + results.status);
			}
			
			this.panel.setBrowserCtrlMainContent(html);
		}
		
	this.getPassedViewHtml = function(results)
		{
			return this.passedHtmlTemplate	
							.replace(/NUM_TEST_FILES/, 	results.numTestFiles)
							.replace(/NUM_TEST_CASES/, 	results.numTestCases)
							.replace(/TESTS_RUN_AT/, 	formatDate(results.theDate));
		}
		
	this.getFailedViewHtml = function(results)
		{
			var html = this.failedHtmlTemplateHeader;
			
			for (var i = 0; i < results.records.length; i++)
			{
				var rec = results.records[i];
				
				html += this.failedHtmlTemplateRecord
							.replace(/TEST_FILE_URL/, 	rec.testFileUrl)
							.replace(/TEST_FILE/, 		this.makeUrlRelative(rec.testFileUrl))
							.replace(/TEST_CASE/, 		rec.testCase)
							.replace(/MESSAGE/, 		rec.message);
			}
			
			return html;
		}
									
	this.getErrorViewHtml = function(results)
		{
			return this.errorHtmlTemplate
							.replace(/TEST_FILE_URL/,	results.testFileUrl)
							.replace(/TEST_FILE/, 		this.makeUrlRelative(results.testFileUrl))
							.replace(/DW_MESSAGE/, 		results.dwMessage)
							.replace(/JS_MESSAGE/, 		results.jsMessage);
		}
		
	this.onClickBrowserCtrlFileLink = function(fileUrl)
		{
			setTimeout('dw.openDocument("' + fileUrl + '")', 10); // Workaround since the call below doesn't work.
			//this.dw.openDocument(fileUrl);
		}
		
	this.makeUrlRelative = function(fileUrl)
		{
			return fileUrl.substr(this.dw.getConfigurationPath().length);
		}
}
