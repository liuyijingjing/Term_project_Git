
function MultifileRunner()
{
	this.dw 	= this.dw 		|| dw;
	this.DWfile = this.DWfile 	|| DWfile;
	
	this.getTestFileUrlList = function(dir, testFileUrlList)
		{
			var files = this.DWfile.listFolder(dir + '/*_Test.htm', 'files');
	
			for (var i = 0; i < files.length; i++)
				testFileUrlList.push(dir + '/' + files[i]);
				
			var dirs = this.DWfile.listFolder(dir, 'directories');
			
			for (var i = 0; i < dirs.length; i++)
				this.getTestFileUrlList(dir + '/' + dirs[i], testFileUrlList);	// Recurse.
		}
		
	this.runTests = function()
		{
			var fileUrlList = [];
			//var fileUrlList = ['file:///C|/theoden/depot/dreamweaver/Mainline/Dreamweaver/Targets/bin/Configuration/JavascriptTests/TestFiles/Shared/Common/Scripts/StyleSheet_Test.htm'];
			this.getTestFileUrlList(this.dw.getConfigurationPath() + '/JavascriptTests/TestFiles', fileUrlList);
			
			var numTestCases = 0;
			
			for (var i = 0; i < fileUrlList.length; i++)
			{			
				var results = this.dw.runJavascriptTestFile(fileUrlList[i]);

				if (results.status == 'passed')
				{
					numTestCases += results.numTestCases;	
				}
				else if (results.status == 'failed')
				{
					for (var j = 0; j < results.records.length; j++)
						results.records[j].testFileUrl = fileUrlList[i];
						
					return {status: 'failed', records: results.records}; 
				}
				else if (results.status == 'error')
				{
					return	{	
								status:			'error', 
								testFileUrl:	fileUrlList[i],
								dwMessage: 		results.dwMessage,
								jsMessage: 		results.jsMessage
							};	
				}					
			}

			return	{
						status: 		'passed', 
						numTestFiles:	fileUrlList.length, 
						numTestCases: 	numTestCases,
						theDate:		new Date()
					};						
		}
}
