var sdkList = new Array('webos', 'android');
var paths = {
    'webos':[
        'palm-install', 
        'palm-install.bat',
        'palm-install.exe'
        ],
     'android':[
        'platform-tools'
     ]
    }
var phoneGapPlugin = new PhoneGapPlugin();
var hasReloaded = false;

function initShow()
{
    if (hasReloaded) return;
    initSettings();
    hasReloaded = true;
    addLocaleToGoUrl(
            new Array(
                'need_help_url'
                )
            );
}

function initSettings() {
  phoneGapPlugin.setTmpDir();
  var settings = loadSettings();
  parseSettings(settings);
  var reloadPanel = document.getElementById('settings-reload-view');
  var settingsView = document.getElementById('settings-display-view');
  if (reloadPanel && settingsView) {
    reloadPanel.style.display="none";
    settingsView.style.display="block";
  }
}

function resetSettings() {
    var settings = {};
    for(index in sdkList) {
        settings[sdkList[index]] = {path: ""};
    }
    return settings;
}

function loadSettings() {
  tmpFile = phoneGapPlugin.tmp_dir 
    + phoneGapPlugin.PATH_SEP + "sdk_settings.txt"; 

  var settings = resetSettings();

  if (DWfile.exists(tmpFile)) {
    try {
      settingsJson = DWfile.read(tmpFile);
      settings = JSON.parse(settingsJson);
    } catch (e) {
      alert(dw.loadString('PGB/settings/failed_to_load'));
    }
  }

  return settings;
}

function parseSettings(currentSettings)
{
  if (!currentSettings) return; 

  for (index in sdkList) {
    var platform = document.getElementById(
            sdkList[index] + 'SDKPath'
        );
    if (platform) {
      platform.value = currentSettings[sdkList[index]].path;
    }
  }
}

function verifySettings(settings) {
    var internalPaths = {}
    var allValid = true;

    for (i in sdkList) {
        var platform = sdkList[i];

        internalPaths[platform] = {};
        internalPaths[platform].isValid = false;
        internalPaths[platform].hasBeenWarned = false;

        if (!settings[platform].path) {
            internalPaths[platform].isValid = true;
        }

        for (path in paths[platform]) {
            pathToFile = 
                settings[platform].path + "/" + paths[platform][path]

            var fileUri = new DWUri();                                            
            fileUri.localPathToURI(pathToFile);

            if (DWfile.exists(fileUri)) {
                if (!safeEmulationPath(pathToFile)) {
                    alert(
                        dw.loadString('PGB/settings/unsafe_path') + 
                        ": " + 
                        pathToFile
                    );
                    internalPaths[platform].hasBeenWarned = true;
                } else {
                    internalPaths[platform].isValid = true;
                }
            }
        }

        if (!internalPaths[platform].isValid) {
            string = "PGB/settings/" 
                + platform + "_sdk_location_not_found";

            if (!internalPaths[platform].hasBeenWarned) {
                alert(dw.loadString(string));
            }

            allValid = false;
        }
    }
    
    return allValid;
}

function saveSettings() {
  var settings = {};

  for (index in sdkList) {
    var sdk = sdkList[index];
    settings[sdk] = 
        { path: document.getElementById(sdk + "SDKPath").value };
  }

  if (!verifySettings(settings)) {
     return; 
  }

  output = JSON.stringify(settings);
  tmpFile = phoneGapPlugin.tmp_dir 
        + phoneGapPlugin.PATH_SEP + "sdk_settings.txt"; 

  if (!DWfile.write(tmpFile, output)) {
    alert(dw.loadString('PGB/settings/failed_save_settings'));
  }
}

function browseForFolder(inputId) {
  var inputObj = document.getElementById(inputId);                      

  if( !inputObj )                                                       
    return;                                                             

  var fileUri = new DWUri();                                            
  fileUri.localPathToURI( inputObj.value );                             

  if (DWfile.exists(fileUri)) {
      fileUri = new DWUri(
          escape(
              dw.browseForFolderURL(
                      MM.MSG_ProxyChooseFolder, fileUri, false)
                  ).replace("#", "%23")
          );
  } else {
      fileUri = new DWUri(
          escape(
                  dw.browseForFolderURL(
                      MM.MSG_ProxyChooseFolder, "", false)
              ).replace("#", "%23")
          );
  }                                                                     

  if (DWfile.exists(fileUri)) {
    //on mac we expressly want the unix form of the local path          
    inputObj.value = 
        (navigator.platform == "Win32")  ? 
            fileUri.toLocalPath() : 
            fileUri.toLocalPathUnix();
  }                                                                     

  return fileUri;                                                       
}

function safeEmulationPath(string) {
    if( string.search(/[^a-zA-Z#-_\.\\\/\:\~ ]/) != -1 )                  
    {                                                                   
        return false;                                                   
    }  

    return true;
}
