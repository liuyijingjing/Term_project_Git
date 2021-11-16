// Copyright 2009 Adobe Systems Incorporated.  All rights reserved

//--------------------------------------------------------------------
//CLASS:URLMetaInfo
//url meta info class which stores the url & permission 
//--------------------------------------------------------------------
function URLMetaInfo(url, permission, bRemember)
{
	this._url = url;
	this._permission = permission;
	this._bRemember = bRemember;
}

URLMetaInfo.prototype =
{		
	getURL:function()
	{
		return this._url;
	},
	getPermission:function()
	{
		return this._permission;
	},
	setURL:function(anURL)
	{
		this._url = anURL;
	},
	setPermission:function(aPermission)
	{
		this._permission = aPermission;
	},
	isRemember:function()
	{
		return this._bRemember;
	},
	setRemember:function(bRemember)
	{
		this._bRemember = bRemember;
	}
};

function BL_PermissionStore()
{
	//maintain a list for URL , Permission Value
	this._permissionStore = new Array();
	this._gLocalizedAllow = dw.loadString("meermeerdw/commands/BL_PermissionSettings/radiobutton/Permission/Allow");  
	this._gLocalizedDeny = dw.loadString("meermeerdw/commands/BL_PermissionSettings/radiobutton/Permission/Deny"); 
}

BL_PermissionStore._PERMISSION_STORE_FILE = dw.getUserConfigurationPath() + '/Commands/BL_PermissionSettings.json';
BL_PermissionStore._JS_URL_PERMISSION_CODE = '{URL:"@@URL@@",Permission:"@@PERMISSION@@"}';

BL_PermissionStore.prototype =
{	
	loadPermissionStore : function()
	{
	  var permissionStoreExists = DWfile.exists(BL_PermissionStore._PERMISSION_STORE_FILE);
	  if (permissionStoreExists)
	  {
		var jsonStoreCode = DWfile.read(BL_PermissionStore._PERMISSION_STORE_FILE);		
		if (jsonStoreCode && jsonStoreCode.length)
		{
			eval(jsonStoreCode);
			//reload the UI with stored entries
			for (var i=0;i < permissionStore.length; i++)
			{
				var aURLPermissionPair = permissionStore[i];
				var aURL = aURLPermissionPair.URL;
				var aPermission = aURLPermissionPair.Permission;

				if (aURL.indexOf("file:///") != -1)
				{
					//replace the pipe char with ":" when loading
					aURL = aURL.replace("|",  ":");					
				}
				
				//add it to map.
				var aURLMetaInfo = new URLMetaInfo(aURL, aPermission, true);
				this._permissionStore[aURL] = aURLMetaInfo; 	
			}
		}
	  }		
	  MM._permissionStore = this;
	},
	storePermissionStore : function(bStoreCurrent, urlList)
	{				
		var jsonStoreCode = "var permissionStore = [";

		if (urlList)
		{
			//clear the permission store
			this._permissionStore = new Array();

			//update the store with new urlList
			for (var i=0; i < urlList.length ; i++)
			{
				var aURLPermissionPair = urlList[i].split("|");
				if (aURLPermissionPair.length == 2)
				{
					var aURL = aURLPermissionPair[0];
					var aPermission = aURLPermissionPair[1];		
					//convert from localized string to value string for storage.	
					aPermission = this.getPermissionString(aPermission);					
					if (i != 0)
					{
						jsonStoreCode+=",";
					}					

					//before storing escape the \ character by double slash
					aURL = aURL.replace(/\\/g, "\\\\");					
					
					var aJSURLCode = BL_PermissionStore._JS_URL_PERMISSION_CODE;
					aJSURLCode = aJSURLCode.replace("@@URL@@", aURL);
					aJSURLCode = aJSURLCode.replace("@@PERMISSION@@", aPermission);
					jsonStoreCode+=aJSURLCode;
					//save in memory as well
					var aURLMetaInfo = new URLMetaInfo(aURL, aPermission, true);
					this._permissionStore[aURL] = aURLMetaInfo; 									
				}
			}
		}
		else
		{
			//store the existing permission store
			if (bStoreCurrent)
			{
				var i=0;
				for (var k in this._permissionStore)
				{
					var aURLMetaInfo = this._permissionStore[k];
					if (aURLMetaInfo)
					{					
						if (!aURLMetaInfo.isRemember())
						{
							continue; //skip over it , since it is not remember
						}

						var aURL = aURLMetaInfo.getURL();
						var aPermission = aURLMetaInfo.getPermission();
						if (i != 0)
						{
							jsonStoreCode+=",";
						}
						var aJSURLCode = BL_PermissionStore._JS_URL_PERMISSION_CODE;
						aJSURLCode = aJSURLCode.replace("@@URL@@", aURL);
						aJSURLCode = aJSURLCode.replace("@@PERMISSION@@", aPermission);
						jsonStoreCode+=aJSURLCode;
					}
					i++;
				}
			}
		}

		jsonStoreCode+="];";

		//save it into user config file
		MM._permissionStore = this;
		DWfile.write(BL_PermissionStore._PERMISSION_STORE_FILE, jsonStoreCode);
	},
	getLocalizedPermissionString : function (aPermission)
	{
		var localizedPermissionString = "";
		aPermission = aPermission.toLowerCase();
		if (aPermission == "deny")
		{
			localizedPermissionString = _gLocalizedDeny;
		}
		else
		{
			localizedPermissionString = _gLocalizedAllow;
		}
		return localizedPermissionString;		
	},
	getPermissionString : function (aLocalizedPermission)
	{
		var permissionString = "";
		if (aLocalizedPermission == _gLocalizedDeny)
		{
			permissionString = "Deny";
		}
		else
		{
			permissionString = "Allow";
		}
		return permissionString;
	},
	addPermissionEntry : function (anURL, aPermission, bRemember)
	{
		if (anURL.indexOf("file:///") != -1)
		{
			//replace the pipe char with ":" 
			anURL = anURL.replace("|",  ":");					
		}

		//add it to map.
		var aURLMetaInfo = new URLMetaInfo(anURL, aPermission, bRemember);
		this._permissionStore[anURL] = aURLMetaInfo; 				
	},
	getPermissions : function()
	{
		return this._permissionStore;
	}					
};