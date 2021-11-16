function minSize(platform)
{
    return "200,400";
}

var build_watcher = null;
// used to keep track of when a build first started
var start_time = null;
var current_time = null;
// platforms supported
var platforms = new Array(
      'ios', 
      'blackberry',
      'android',
      'webos',
      'symbian'
    );
// by default assume all builds are not complete
var all_complete = false;
// hold download urls for each platform
var downloads = new Array();
var errors = new Array();
var build_status = new Array();
// hold information regarding the extensions to save files as
// ex: app.jad for unsigned bb apps and app.zip for signed apps
var platform_extensions = new Array();

platform_extensions['ios'] = {
    "no_key":".ipa",
    "key":".ipa"
  };

platform_extensions['android'] = {
    "no_key":".apk",
    "key":".apk"
  };

platform_extensions['blackberry'] = {
    "no_key":".jad",
    "key":".zip"
  };

platform_extensions['webos'] = {
    "no_key":".ipk"
  };

platform_extensions['symbian'] = {
    "no_key":".wgz"
  };

function isset(array, index)
{
  if (typeof array[index] == 'undefined') return false;
  return true;
}

// callback function to watch the status of builds
function watchStatus(result) {
  var app_id = phoneGapPlugin.getCurrentAppId();

  var file = phoneGapPlugin.tmp_dir + phoneGapPlugin.PATH_SEP 
      + "status_" + app_id + ".txt";

  var data = DWfile.read(file);

  if (typeof data != 'object') {
    try {
      data = JSON.parse(data);
      
      all_complete = true;

      for (platform in data) {
        updateStatus(platform, data[platform]);
      }

      if (all_complete) {
        clearTimeout(build_watcher);
        document.getElementById('rebuild-button').disabled = false;
        hideStatusBar();
        return;
      }
    }
    catch(e) {
      failAllBuilds(e);
    }
  }

  build_watcher = setTimeout('watchStatus()', 5000); 
}

function doAuth() {
  if (!phoneGapPlugin.pwd()) {
    toggleView('no-site-view');
    hideStatusBar();
    return;
  }

  var loginbutton = document.getElementById('login');
  loginbutton.disabled = 'true';

  var passfield = document.getElementById('password');
  if (passfield) passfield.disabled = 'true';

  var userfield = document.getElementById('username');
  if (userfield) userfield.disabled = 'true';

  showStatusBar();

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  if (username.length == 0 || password.length == 0) {
    displayAuthPanel();
    alert("Your email or password is incorrect.");
    return;
  }
  phoneGapPlugin.authenticate(username, password, isAuthenticated);
}

function isPrevAuthenticated (result) {
  // auth file exists?
  if (typeof result != 'undefined' 
        && result != null
         && result.statusCode == 200) {
    result.data = JSON.parse(result.data);

    if (result.data == 'undefined' || result.data.statusCode == 'undefined') {
      displayAuthPanel();
      return;
    }
    else if (result.data.statusCode == 200) { 
      // was the request for auth data good?

      if (isProjectInitialized()) {
        watchStatus();
        displayBuildPanel();
        return;
      }
      else {
        displayInitPanel();
        return;
      }
    }
    else {
      displayAuthPanel();
      return;
    }
  }
  else {
    displayAuthPanel(); 
    return;
  }
}


function isAuthenticated (result) {
  var loginbutton = document.getElementById('login');

  phoneGapPlugin.removeCommandFile();

  if (result.statusCode == 200) {
    try {
        result.data = JSON.parse(result.data);
    } catch (e) {
        alert(dw.loadString('PGB/error/server_troubles'));
        displayAuthPanel();
        return;
    }

    if (typeof result.data != 'undefined') {
      if (typeof result.data.token != 'undefined') {
        // success now we can proceed
        phoneGapPlugin.auth_token = result.data.token;
        if (isProjectInitialized()) {
          displayBuildPanel();
          return;
        }
        else {
          displayInitPanel();
          return;
        }
      }
      else {
        // failed login
        alert(result.data.error);
        displayAuthPanel();
        return;
      }
    }
  } else  {
    alert(dw.loadString('PGB/error/server_troubles'));
    displayAuthPanel();
    return;
  }
}

function isProjectInitialized() {
  // check if the project has been initialized 
  if (!DWfile.exists(phoneGapPlugin.pwd() + "ProjectSettings")) {
    return false;
  }

  var data = "";

  if ((data = DWfile.read(phoneGapPlugin.pwd() + "ProjectSettings")) != null) {
    try {
      data = JSON.parse(data);
      if (typeof data.id != 'undefined') {
        return true;
      }
    } 
    catch (e) {
      alert(e);
      return false;
    }
  }

  return false;
}

function checkInitResult(result) {
  if (result.statusCode == 200) {
    result.data = JSON.parse(result.data);

    if (
        typeof result.data != 'object' 
            || typeof result.data.id == 'undefined'
    ) {
        alert(dw.loadString('PGB/error/server_troubles'));
    } else { 
      // was the request for auth data good?
      displayBuildPanel();
      startBuilds(); 
      return true;
    }
  }
  else {
    alert(dw.loadString('PGB/error/server_troubles'));
  }

  hideStatusBar();
  return false;
}

function toggleView(make_visible) {
  document.getElementById(window.visiblePanel).style.display = "none"; 
  document.getElementById(make_visible).style.display = "block"; 
  window.visiblePanel = make_visible; 
}

function showView(make_visible) {
  document.getElementById(window.visiblePanel).style.display = "none"; 
  document.getElementById(make_visible).style.display = "block"; 
}

function hideView(make_visible) {
  document.getElementById(window.visiblePanel).style.display = "block"; 
  document.getElementById(make_visible).style.display = "none";
}

function displayInitPanel() {
  phoneGapPlugin.listApps(listApps);
}

function displayAuthPanel()  {
  hideStatusBar();
  toggleView("login-view");

  var loginbutton = document.getElementById('login');

  if (loginbutton) loginbutton.disabled = 'false';

  var passfield = document.getElementById('password');

  if (passfield) {
      passfield.disabled = 'false';
  }

  var userfield = document.getElementById('username');

  if (userfield) {
      userfield.disabled = 'false';
  }

  if (userfield && passfield) {
      userfield.value = "";
      passfield.value = "";
  }
}

function displayBuildPanel(result) {
  hideStatusBar();
  toggleView("packages-view");
}

function queueBuild(platform) {
  var message = "<strong>Build Queued</strong> ...";
  disableBuild(platform, message);
}

function disableBuild(platform, message) {
  var status = document.getElementById("platform-" + platform + "-status-message");
  var platform_div = document.getElementById("platform-" + platform);

  if (typeof platform_div != 'undefined')  {
    platform_div.className = "package " + platform + " queued";
  }

  if (typeof status != 'undefined') {
    status.innerHTML = message;
  }

  var error_button = document.getElementById(
          "platform-" + platform + "-error-button"
          );

  if (error_button) {
      error_button.style.display = "none";
  }

  disableActionButton(platform, 'download', true);
  disableActionButton(platform, 'qrcode', true);
  disableActionButton(platform, 'emulate', true);
}

function failAllBuilds(reason) {
  if (typeof reason == 'undefined') {
    reason = "Application Error";
  }

  for (var i = 0; i < platforms.length; i++) {
    var platform = platforms[i];

    var platform_div = document.getElementById('platform-' + platform);
    var platform_message = document.getElementById(
            "platform-" + platform + "-status-message"
            );
    var error_button = document.getElementById(
            "platform-" + platform + "-error-button"
            );

    platform_div.className = 'package ' + platform + " error";

    errors[platform] = reason;

    if (typeof platform_message != 'undefined') {
        platform_message.innerHTML='Build Error';
    }

    if (typeof error_button != 'undefined') {
        error_button.style.display = 'block';
    }

    build_status[platform]['complete'] = true; 
  }

  hideStatusBar();
  document.getElementById('rebuild-button').disabled = false;
}

function uploadApplicationMessage() {
  for (var i = 0; i < platforms.length; i++) {
    var message = "<strong>Uploading Application</strong>"
    disableBuild(platforms[i], message);

    var error_button = 
        document.getElementById("platform-" + platforms[i] + "-error-button");

    if (typeof error_button != 'undefined')
    {
        error_button.style.display="none";
    }
  }
}

function download(platform, should_emulate) {

  should_emulate = should_emulate === true;

  if (downloads[platform]) {

      var saveFile = dw.getUserConfigurationPath() + 'Temp' + "/app" + downloads[platform]['extension'];

      if (!should_emulate) {

      	var dest = dw.browseForFolderURL(
	          'Choose a location to save the ' + downloads[platform]['extension'] 
	          + ' file'
	          );

	      if (!dest) return;

	      dest = dest + "/" + getDownloadName(platform);

	      if (DWfile.exists(dest)) {
	        if (!confirm('The file already exists, would you like to overwrite it?')) {
	          return;
	        }
	      }
	
      }

      if (downloads[platform] && downloads[platform]['downloaded']===true) {

        if (should_emulate)
          emulate(platform);
        else if (!DWfile.copy(saveFile, dest))
            alert(dw.loadString('PGB/error/failed_download'));
        else
            alert(dw.loadString('PGB/result/file_saved'));
        return;
        
      }

      disableActionButton(platform, 'download', true);
	    disableActionButton(platform, 'emulate', true);
      
      var fileUri = phoneGapPlugin.build_url + "/" + 
                    phoneGapPlugin.api_version + "/" +
                    downloads[platform]['url'] + "?auth_token=" + 
                    phoneGapPlugin.auth_token + 
                    "&app_source=" + escape(phoneGapPlugin.info.asText);

			var platform_div = document.getElementById('platform-' + platform);
		  var platform_message = document.getElementById("platform-" + platform + "-status-message");
		  var error_button = document.getElementById("platform-" + platform + "-error-button");
		
      phoneGapPlugin.downloadApp(
	      platform,
		    fileUri,
		    saveFile,
		    function(resp) {
			    resp.val = JSON.parse(resp.val);
			    if (resp.statusCode == 200 && resp.val.error!=true) {
				    if (resp.val["state"]==="finished") {
				      resp.poller.stop();
					    platform_message.innerHTML = "<strong>Downloaded</strong>";
					    downloads[platform]['downloaded'] = true;
					    if (should_emulate) {
					      setTimeout(function() { 
					        emulate(platform);
					      }, 500);
				      }
				      else
				      {
                if (!DWfile.copy(saveFile, dest))
                  alert(dw.loadString('PGB/error/failed_download'));
                else
                  alert(dw.loadString('PGB/result/file_saved'));
			        }
			        disableActionButton(platform, 'download', false);
					    disableActionButton(platform, 'emulate', false);
					    return;
					  }
            else if (resp.val["state"]==="connecting")
					  {
              platform_message.innerHTML = "<strong>Connecting ... </strong>";
				    }
				    else 
					  {
              platform_message.innerHTML = "<strong>Downloading ... "+resp.val.progress+"%</strong>";
				    }
				  }
				  else {
					  platform_message.innerHTML = "<strong>Download Failed</strong>";
					  resp.poller.stop();
					  disableActionButton(platform, 'download', false);
			      disableActionButton(platform, 'emulate', false);
			      alert(dw.loadString('PGB/error/failed_download'));
		      }
		    }
		  );
		}
}


function disableActionButton(platform, action, state)
{
	var state = state===true;
  var button = document.getElementById("platform-"+ platform + "-" + action +"-button");
  if (button) button.disabled = state;
}

function getDownloadName(platform) {
    return "app" + downloads[platform]['extension']
}

/*********************************************************** EMULATION ************/

function refreshSettings(platform) {
  var oldSettings = sdks[platform];
  try
  {
      sdks = loadSettings();
      if (oldSettings.path==sdks[platform].path)
      {
          sdks[platform].emulatorOptions = oldSettings.emulatorOptions;
      }
  } catch (e) {
      sdks[platform].emulatorOptions = null;
  }
}

function cancelEmulateAction() {
  emulateActionCancelled = true;
  toggleView('packages-view');
}

function emulate(platform)
{
  if (typeof platform == 'undefined') return;
  disableActionButton(platform, 'launch', true);

  refreshSettings(platform);

  if (platform=="android") {
    emulateActionCancelled = false;
    enableByID(['android-device-select', 'android-version-select', 'android-emulate-button-1', 'android-launch-button', 'android-emulate-button-2']);
    document.getElementById('platform-android-emulator-monitor').innerHTML = "";
  }

  if (sdks[platform] && sdks[platform].emulatorOptions) { 
    bindEmulators(platform);
		toggleView('emulate-'+platform+'-view');
	}
  else {
    toggleView('emulate-'+platform+'-view');
		refreshList(platform, false, true);
  }
}

function refreshList(platform, refresh, clearLog)
{
    if (refresh===true) refreshSettings(platform);
    
    var sel = document.getElementById(platform+'-device-select');

    if (sdks[platform]==null || sdks[platform].path==null || sdks[platform].path=="") {
        document.getElementById(platform+"-emulate-error-div").style.display = "block";
        document.getElementById(platform+"-emulate-div").style.display = "none";
        document.getElementById(platform+"-emulate-error").innerHTML = dw.loadString(
            'PGB/run/sdk_not_found'
            );
        sdks[platform].emulatorOptions=null;
        return;
    }
 
    if (platform == 'android') {
        var targetSel = document.getElementById(platform+'-version-select');
        disableByID(['android-device-select', 'android-version-select', 'android-emulate-button-1', 'android-launch-button', 'android-emulate-button-2']);

        var logger = document.getElementById('platform-android-emulator-monitor');
        if (clearLog!==true) logger.innerHTML = "";
        logger.innerHTML += "Refreshing targets ...\r\n";
 
        phoneGapPlugin.listDevices(
                platform, 
                function(resp) {
                  if (emulateActionCancelled) { resp.poller.stop(); return; }
                  document.getElementById(platform+"-emulate-error-div").style.display = "none";
                  document.getElementById(platform+"-emulate-div").style.display = "block";
                  resp.val = JSON.parse(resp.val);
                  logger.innerHTML += "Targets refreshed\r\n";
                  if (resp.val.error===true){
                    document.getElementById(platform+"-emulate-error-div").style.display = "block";
                    document.getElementById(platform+"-emulate-div").style.display = "none";
                    
                    var stringToLoad = "PGB/run/sdk_not_found";

                    if (resp.val.message == 'noplatformtools') {
                      stringToLoad = 'PGB/run/no_android_platform_tools_found';
                    }
                    
                    document.getElementById(platform+"-emulate-error").innerHTML 
                        = dw.loadString(stringToLoad);
                    sdks[platform].emulatorOptions=null;
                  }
                  else {
                    sdks[platform].emulatorOptions=resp.val;
                    bindEmulators(platform);
                  }
            });
    } else if (platform == 'webos') {
        try {
            sel.disabled = true;
            phoneGapPlugin.listDevices(
                    platform, 
                    function(resp) {
                    document.getElementById(platform+"-emulate-div").style.display = "block";
                    document.getElementById(platform+"-emulate-error-div").style.display = "none";
                    sdks[platform].emulatorOptions=JSON.parse(resp.val);
                    bindEmulators(platform);
                    }
                );
        } catch (e) {
			    alert(dw.loadString('PGB/error/failed_to_list_emulators'));
        }
    }
}

function bindEmulators(platform) {
	var sel = document.getElementById(platform + '-device-select');
    sel.innerHTML = "";
	
    if (platform=='android') {
		  var oldIndex = sel.selectedIndex;
		
  		var targetSel = document.getElementById('android-version-select');
  		var oldTargetIndex = targetSel.selectedIndex;
  		targetSel.innerHTML = "";
		
  		for (var idx in sdks[platform].emulatorOptions["avds"]) {
  			var item = sdks[platform].emulatorOptions["avds"][idx];
        var opt = new Option();
  	    opt.text = item["name"] + " ("+item["version"] + ")";
  	    opt.value = item["name"];
  	    sel.options[sel.options.length] = opt;
  		}
  		for (var idx in sdks[platform].emulatorOptions["devices"]){
  			var item = sdks[platform].emulatorOptions["devices"][idx];
  			if (item["isDevice"]!==true) continue;
        var opt = new Option();
  	    opt.text = item["name"]+" (Device)";
  	    opt.value = item["serial"];
  	    sel.options[sel.options.length] = opt;
  		}
  		for (var idx in sdks[platform].emulatorOptions["targets"]){
  			var item = sdks[platform].emulatorOptions["targets"][idx];
        var opt = new Option();
  	    opt.text = item["version"];
  	    opt.value = item["name"];
  	    targetSel.options[targetSel.options.length] = opt;
  		}
		
  		sel.selectedIndex = (oldIndex>=0 && oldIndex < sel.options.length) ? oldIndex : 0;
  		targetSel.selectedIndex = (oldTargetIndex>=0 && oldTargetIndex < targetSel.options.length) ? oldTargetIndex : 0;
    
      enableByID(['android-emulate-button-1', 'android-launch-button', 'android-emulate-button-2']);
    
      if (sel.options.length==0){
        var opt = new Option();
  	    opt.text = "No AVD or devices found";
  	    sel.options[sel.options.length] = opt;
  	    sel.selectedIndex = 0;
  	    document.getElementById("android-launch-button").disabled = true;
      }
      else sel.disabled = false;
    
      if (targetSel.options.length==0){
        document.getElementById("android-emulate-error-div").style.display = "block";
        document.getElementById("android-emulate-div").style.display = "none";
        document.getElementById("android-emulate-error").innerHTML = dw.loadString('PGB/run/no_platform_sdk_found');
        sdks[platform].emulatorOptions=null;
      }
      else targetSel.disabled = false;

  } else if (platform == 'webos') {
        try {
            var result = sdks['webos'].emulatorOptions.status; 

            if (result != 200) {
                document.getElementById("webos-emulate-error-div").style.display = "block";
                document.getElementById("webos-emulate-div").style.display = "none";
                document.getElementById("webos-emulate-error").innerHTML = dw.loadString('PGB/run/no_webos_platform_sdk_found');
                sdks[platform].emulatorOptions=null;
            } else {
                var list = sdks['webos'].emulatorOptions.emulators;

                if (typeof list[0] != 'undefined') {
                    sel.disabled = false;
                    if (
                        typeof sdks['webos'].selectedSdk  == 'undefined'
                    ){
                        sdks['webos'].selectedSdk = 0;
                    }
                    for (var index in list) {
                        var opt = new Option();
                        opt.text = list[index];
                        opt.value = index;
                        sel.options[sel.options.length] = opt;
                    }
                    sel.selectedIndex = sdks['webos'].selectedSdk;
                    disableActionButton(platform, 'launch', false);
                }
            }
        } catch (e) {
            document.getElementById("webos-emulate-error-div").style.display = "block";
            document.getElementById("webos-emulate-div").style.display = "none";
            document.getElementById("webos-emulate-error").innerHTML = dw.loadString('PGB/run/no_webos_platform_sdk_found');
            sdks[platform].emulatorOptions=null;
        }
    }
}

function disableByID(ids){
  for(var i=0;i<ids.length;i++)
    document.getElementById(ids[i]).disabled = true; 
}

function enableByID(ids){
  for(var i=0;i<ids.length;i++)
    document.getElementById(ids[i]).disabled = false;
}

var emulateActionCancelled = false;

function run(platform)
{ 
  
	if (platform=='android') {
	  var sel = document.getElementById('android-device-select');
		var logger = document.getElementById('platform-android-emulator-monitor');
		disableByID(['android-device-select', 'android-version-select', 'android-emulate-button-1', 'android-launch-button', 'android-emulate-button-2']);
		logger.innerHTML="";
		var logIndex = 0;
		phoneGapPlugin.runApp(
	    platform, 
	    sel.options[sel.selectedIndex].value,
			dw.getUserConfigurationPath() + 'Temp' + "/app" + downloads[platform]['extension'], 
	    function(resp) {
	      if (emulateActionCancelled) { resp.poller.stop(); return; }
        
        resp.val = JSON.parse(resp.val);
        var i = logIndex;
        while (i<resp.val["logs"].length){
	        logger.innerHTML+=resp.val["logs"][i]["message"]+"\r\n";
	        i++;
        }
          
        logIndex = i;
        
	      if (resp.val["running"]===true) return;
	      else resp.poller.stop();
	      
	      enableByID(['android-device-select', 'android-version-select', 'android-emulate-button-1', 'android-launch-button', 'android-emulate-button-2']);
	      
	    }
	  );
	} else if (platform == 'webos') {
        var sel = document.getElementById('webos-device-select');
        phoneGapPlugin.getPackageName();
        var device = sel.selectedIndex;
        var target = sdks[platform].emulatorOptions.emulators[device];
        var app_path = dw.getUserConfigurationPath() 
            + 'Temp' + "/app" + downloads[platform]['extension']; 

        phoneGapPlugin.runApp(
            platform,
            target,
            app_path,
            function(resp) {
                try{
                    json = JSON.parse(resp.val);

                    var monitor = document.getElementById(
                        'platform-webos-emulator-monitor'
                        );


                    if (json.status != 'pending') {
                        resp.poller.stop();
                        monitor.value = json.message ;
                    } 

                    monitor.value = json.message ;
                } catch (e) {
                    resp.poller.stop();
                    alert(e);
                }
            }
        )
    }
}

function launchAVDManager() {
  
	phoneGapPlugin.launchAVDManager();
	
}

function isAVDNameTaken(name) {
  for (var idx in sdks['android'].emulatorOptions["avds"]) {
		var item = sdks['android'].emulatorOptions["avds"][idx];
    if (item["name"] == name) return true;
	}
	return false;
}

function createAVD()
{
	var sel = document.getElementById('android-version-select');
	var target = sel.options[sel.selectedIndex].value;
	var version = sel.options[sel.selectedIndex].text;
	
  disableByID(['android-device-select', 'android-version-select', 'android-emulate-button-1', 'android-launch-button', 'android-emulate-button-2']);
	
	var logger = document.getElementById('platform-android-emulator-monitor');
	logger.innerHTML="Creating AVD ...\r\n";
	sel.disabled = true;
	
	var idx = 1;
	var avdName = "dreamweaver-1";
	while (isAVDNameTaken(avdName)){
	  idx++;
	  avdName = "dreamweaver-" + idx;
  }
	
	phoneGapPlugin.createAVD(
    'android', 
    target, 
    avdName,
    function(resp) {
      if (emulateActionCancelled) { resp.poller.stop(); return; }
      resp.val = JSON.parse(resp.val);
      if (resp.val.error===true){
        alert(dw.loadString('PGB/run/android_failed_to_create_avd'));
        logger.innerHTML+="failed\r\n";
        logger.innerHTML+=resp.message+"\r\n";
        
        enableByID(['android-device-select', 'android-version-select', 'android-emulate-button-1', 'android-launch-button', 'android-emulate-button-2']);
        
        sel.disabled = false;
      }
      else {
		    logger.innerHTML+="AVD created\r\n";
        refreshList('android', false, true);
      }
    }
  );
}

/*********************************************************** EMULATION ************/

function viewError(platform)
{
    document.getElementById('error_message_field').value = errors[platform];
    document.getElementById('error_header').className = "package " + platform;
    toggleView('app-error-view');
}

function qr_url(platform) {
  var app_id = phoneGapPlugin.getCurrentAppId();

  var url =  "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl="
  url += "http://build.phonegap.com/apps/"
  url += app_id 
  url += "/download/"
  url += platform
  url += "/?auth_token=" + phoneGapPlugin.auth_token
  url += "&chld=L|1&choe=UTF-8"

  var saveFile = dw.getUserConfigurationPath() + 'Temp' 
      + '/' + platform + "qr.png"; 

  var result = MMHttp.getFile(
    url,
    false,
    saveFile
  );

  if (result.statusCode != 200) {
    alert(dw.loadString('PGB/error/qr_server_troubles'));
  } else {
    document.getElementById('qr_code_img').src = saveFile;
    document.getElementById('qr_header').className = "package " + platform;
    toggleView('qr-view');
  }
}

function toggleButtons(buttons, style) {
  for (button in buttons)
  {
      target = document.getElementById(buttons[button]);
      if (typeof target != "undefined")
      {
          target.style.display = style;
      }
  }
}

function updateStatus(platform, data) {

  if (isset(build_status[platform], 'complete')
      && build_status[platform]['complete']
  )
  {
    return;
  }

  var platform_div = document.getElementById('platform-' + platform);
  var platform_message = document.getElementById(
        "platform-" + platform + "-status-message"
    );
  var error_button = document.getElementById(
        "platform-" + platform + "-error-button"
      );

  if (typeof platform_div != 'undefined') {
    if (typeof data.status != 'undefined') {
      if (data.status == 'error') {
        platform_div.className = 'package ' + platform + " error";

        errors[platform] = (typeof data.error != 'undefined')?
          data.error:"No error message provided";

        if (typeof platform_message != 'undefined') {
            platform_message.innerHTML='Build Error';
        }

        if (typeof error_button != 'undefined') {
            error_button.style.display = 'block';
        }

        build_status[platform]['complete'] = true; 
      }

      if (data.status == "complete") {
          try {
            downloads[platform] = new Array();

            downloads[platform]['url'] = "apps/" 
              + phoneGapPlugin.getCurrentAppId() + "/" + platform;

            if (data.signed == "true") {
              downloads[platform]['extension'] = platform_extensions[platform]['key'];
            }
            else {
              downloads[platform]['extension'] = platform_extensions[platform]['no_key'];
            }

          }
          catch (e) {
            alert(e);
          }

        platform_div.className = 'package ' + platform + " complete";

        if (typeof platform_message != 'undefined') {
          platform_message.innerHTML = "<strong>Build Complete</strong>";
        }

        disableActionButton(platform, 'download', false);
        disableActionButton(platform, 'qrcode', false);
        disableActionButton(platform, 'emulate', false);

        if (typeof error_button != 'undefined') {
          error_button.display = 'none';
        }

        build_status[platform]['complete'] = true; 
      }
      if (data.status == "null") {
        platform_div.className = 'package ' + platform + " error";
        if (typeof platform_message != 'undefined') {
          platform_message.innerHTML = "<strong>Signing Key Required</strong>";
        }
        build_status[platform]['complete'] = true; 
      }
      if (data.status == "pending") {
        all_complete = false;
        if (typeof platform_message != 'undefined') {
          platform_message.innerHTML = "<strong>Build Queued</strong> ...";
        }
        build_status[platform]['complete'] = false; 
      }

    }
  }

}

function checkUploadResult(result) {
  if (result.statusCode == 200) {
     if (typeof result.data == 'undefined') {
        failAllBuilds("Failed to uplaod application");
        return;
     }
     try {
        data = JSON.parse(result.data);

        if (typeof data.id == 'undefined') {
          try {
            failAllBuilds(data.error);
            return;
          } catch (e) {
            failAllBuilds(e);
            return;
          }
        }
        startBuilds();
        return;
     }
     catch (e) {
        failAllBuilds(e);
        return;
     }
  }
  else {
    failAllBuilds("Failed to upload application");
    return;
  }
}

function rebuildApp() {
  showStatusBar();

  if (!phoneGapPlugin.pwd()) {
    disableActionButton('all', 'start', false);
    toggleView('no-site-view');
    hideStatusBar();
    return;
  }

  if (!DWfile.exists(phoneGapPlugin.pwd() + "ProjectSettings")) {
    displayInitPanel();
    return;
  }

  try {
        var settings = JSON.parse(
            DWfile.read(phoneGapPlugin.pwd() + "ProjectSettings")
            ); 

        if (settings.build_count <= 0) {
            if (!DWfile.exists(phoneGapPlugin.pwd() + "index.html")) {
                if (!confirm(dw.loadString('PGB/rebuild/no_index'))) {
                    hideStatusBar();
                    return;
                }
            }
        }
  } catch (e) {
        if (!DWfile.exists(phoneGapPlugin.pwd() + "index.html")) {
            if (!confirm(dw.loadString('PGB/rebuild/no_index'))) {
                hideStatusBar();
                return;
            }
        }
  }

  var app_id = phoneGapPlugin.getCurrentAppId();
  var file = phoneGapPlugin.tmp_dir + phoneGapPlugin.PATH_SEP + 
       "status_" + app_id + ".txt";

  DWfile.remove(file);

  all_complete = false;
  clearTimeout(build_watcher);

  var rebuild_button = document.getElementById("rebuild-button"); 
  if (typeof rebuild_button != 'undefined') rebuild_button.disabled = true;

  uploadApplicationMessage();
  resetAppStatus();

  phoneGapPlugin.appInfo(function(e) {
        hideStatusBar();

        try {
            var data = JSON.parse(e.data);
            if (data.package) {
                showStatusBar();
                phoneGapPlugin.uploadCurrentApp(checkUploadResult);
            } else {
                if (data.error.match(/app [0-9]+ not found/)) {
                    if (confirm(dw.loadString(
                        'PGB/confirm/recreate_app'
                        )
                    )) {
                        failAllBuilds(
                            dw.loadString('PGB/response/please_wait')
                            );
                        showStatusBar();
                        displayInitPanel();
                    } else {
                        failAllBuilds(
                            dw.loadString('PGB/error/app_not_found')
                            );
                    }
                } else {
                    failAllBuilds(
                        dw.loadString('PGB/rebuild/app_info_error')
                        );
                }
            }
        } catch (e) {
            failAllBuilds(
                dw.loadString('PGB/rebuild/app_info_error')
                );
        }
    }
  );
}

function startBuilds() {
  showStatusBar();

  var rebuild_button = document.getElementById("rebuild-button"); 

  if (typeof rebuild_button != 'undefined') {
      rebuild_button.disabled = true;
  }

  // run the builds
  build_status = new Array();

  for (var i = 0; i < platforms.length; i++) {
    queueBuild(platforms[i]);
    build_status[platforms[i]] = new Array();
  }

  start_time = new Date().getTime();
  current_time = start_time;
  phoneGapPlugin.checkBuildStatus(watchStatus);
}

function initProject() {
  var selectObj = document.getElementById('init-project-select');
  var value = selectObj.options[selectObj.selectedIndex].value;

  resetAppStatus();

  if (value == 'new') {
    showStatusBar();

    if (!DWfile.exists(phoneGapPlugin.pwd() + "index.html")) {
    DWfile.copy(
        phoneGapPlugin.pluginDir() + "/res/template/index.html",
        phoneGapPlugin.pwd() + "index.html"
        );
    }

    if (!DWfile.exists(phoneGapPlugin.pwd() + "config.xml")) {
    DWfile.copy(
        phoneGapPlugin.pluginDir() + "/res/template/config.xml",
        phoneGapPlugin.pwd() + "config.xml"
        );
    }

    showStatusBar();
    phoneGapPlugin.initProject(checkInitResult);
  } else {
    phoneGapPlugin.initProjectWithId(value);
    displayBuildPanel();
    return true;
  }
}

function listApps(result) {
  if (result.statusCode == 200) {
      try {
        var apps = JSON.parse(result.data);
        var selectObj = document.getElementById('init-project-select');
        selectObj.innerHTML = 
                  "<option value=\"new\" selected=\"selected\">" +
                    dw.loadString("PGB/init/create_as_new_project") +
                  "</option>" +
                  "<option value=\"new\" disabled=\"true\">" +
                    "--------------" +
                  "</option>";
        for(app in apps) {
            selectObj.innerHTML += 
            '<option value="' + apps[app].id + '">' +
                apps[app].title
            + '</option>'; 
        }

        toggleView("init-view");
        disableActionButton('all', 'continue', false);

        hideStatusBar();
        return;

      } catch (e) {
        alert('Failed to get a list of current applications');
        return;
      }
      
      alert('Failed to get a list of current applications');
  }
}

var status_bar_on = false;

function hideStatusBar() {
    if (!status_bar_on) return;
    document.getElementById('statusBarContainer').style.display='none';
    status_bar_on = false;
}

function showStatusBar() {
    if (status_bar_on) return;
    document.getElementById('statusBarContainer').style.display='block';
    status_bar_on = true;
}

window.visiblePanel = "checking-auth-view";
var phoneGapPlugin = new PhoneGapPlugin();
var skds;

function fillInText(obj, value, append) {
    append = (typeof append == 'undefined')?true:false;
    obj = document.getElementById(obj);
    if (obj) {
        if (append) {
            obj.value += value;
        } else {
            obj.value = value;
        }
    }
}

/* 
TODO: deprecate 
REASON: api fails
*/
function checkConnection() {
  if (!dw.isConnectedToInternet()) {
    showView('no-connection-view');
    return false;
  }
  return true;
}

/* TODO: deprecate */
function goBack() {
  hideView('no-connection-view');
}

function onready() {
  showStatusBar();
  disableActionButton('all', 'start', true);

  if (!phoneGapPlugin.pwd()) {
    disableActionButton('all', 'start', false);
    toggleView('no-site-view');
    hideStatusBar();
    return;
  }

  phoneGapPlugin.setTmpDir();
  resetAppStatus();
  phoneGapPlugin.clearVolatile();
  phoneGapPlugin.checkAuth(isPrevAuthenticated);
  sdks = loadSettings();
}

function resetAppStatus()
{
  for (index in platforms)
  {
    build_status[platforms[index]] = new Array();
    var message = ""
    disableBuild(platforms[index], message);
  }
}

function logout()
{
  phoneGapPlugin.logout();
  resetAppStatus();
  displayAuthPanel();
}

function addLocaleToGoUrl(urls) {
    locale = dw.getAppLanguage().split('_');
    if (!locale || locale.length < 1) {
       locale = 'en'; 
    } else {
       locale = locale[0];
    }

    for(i in urls) {
        href = document.getElementById(urls[i]);
        if (href) {
            href.setAttribute(
                    'href', 
                    href.getAttribute('href') + '_' + locale 
                    );
        }
    }
}
