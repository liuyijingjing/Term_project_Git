/***
 * PhoneGap Plugin for Build
 * @breif - interface for connecting and using PhoneGap Build through Dreamweaver
 */

var PhoneGapPlugin = function() {

  this.api_version = "api/v1";
  this.build_url = "https://build.phonegap.com";
  this.auth_token = null;
  this.tmp_dir = null;
  this.PATH_SEP = (dwscripts.IS_MAC)?'/':'\\';
  this.filename_index = 1;
  this.info = null;
  this.volatile_dir = null;
  this.download_dir = null;

  this.pluginDir = function() {
      var dir = dw.getUserConfigurationPath() +  "PhoneGapBuildPlugin";

      if (!DWfile.exists(dir + "/version.json")) {
          // blunder
      } else {
          try {
              this.info = JSON.parse(
                      DWfile.read(dir + "/version.json")
                      );
          } catch (e) {
              // blunder  
          }
      }

      if (!this.info) {
          this.info = {};
      }

      this.info.csVersion = dreamweaver.appVersion;

      if (!this.info.platform || this.info.platform != 'extension') {
          dir = dw.getConfigurationPath() + "/PhoneGapBuildPlugin";
      }

      this.info.asText = JSON.stringify(this.info);

      return dir;
  }

  this.localPath = function(dir) {
    dir = dwscripts.localURLToFilePath(dir);
    dir = (dwscripts.IS_MAC)?dir.replace(/:/g, this.PATH_SEP):dir;
    dir = (dwscripts.IS_MAC)?"/Volumes/"+dir:dir;
    return dir;
  }

  this.pluginJarPath = function() {
    var jar_path = this.localPath(this.pluginDir()) + this.PATH_SEP + "jar" + 
      this.PATH_SEP + 'DreamweaverPlugin.jar'
      return jar_path;
  }

  this.pluginEmulatorDirPath = function() {
    var emu_path = this.localPath(this.pluginDir()) + this.PATH_SEP + "emulators"; 
    return emu_path;
  }

  this.pluginJarDirPath = function() {
    var jar_path = this.localPath(this.pluginDir()) + this.PATH_SEP + "jar"; 
    return jar_path;
  }

  this.pwd = function () {
    var fullURI = new DWUri(site.getLocalRootURL(site.getCurrentSite()));
    var path = fullURI.toString();
    return path;
  }

  this.isEscaped = function(arg) {
    if (arg.match(/^"/) != null && arg.match(/"$/) != null) {
      return true;
    } else {
      return false;
    }
  }

  this.isString = function(arg) {
    if (typeof arg == 'string') {
      return true;
    } else {
      return false;
    }
  }

  this.safeArg = function(arg) {

    if (this.isString(arg) && (arg.indexOf("\"") != -1)) {
        arg = arg.replace(/\"/g, "\\\"");
    }

    if (this.isString(arg) && (arg.indexOf(" ") != -1) && !this.isEscaped(arg)) {
      arg = '"' + arg + '"'
    }

    if (this.isString(arg) && (arg.match(/[^a-zA-Z]/) != null) && !this.isEscaped(arg)) {
      arg = '"' + arg + '"';
    }
    return arg;
  }

  this.safePath = function(path) {

    if (dwscripts.IS_MAC) {

      // correct potential file issues here :D          

    } else {

      if (dwscripts.isFolder(dwscripts.filePathToLocalURL(path))) {
        path = path.replace(/\\$/, '');
      }

    }

    path = this.safeArg(path);

    return path;
  }

  this.setTmpDir = function() {
    var work_dir = dw.relativeToAbsoluteURL(
            dw.getUserConfigurationPath(), "", "../../PGB"
        ); 

    var volatile_dir = dw.relativeToAbsoluteURL(
            dw.getUserConfigurationPath(), "", "../../PGB/volatile"
        ); 

    var download_dir = dw.getUserConfigurationPath() + "Temp";

    this.tmp_dir = work_dir;
    this.volatile_dir = volatile_dir;
    this.download_dir = download_dir;

    dirs = [work_dir, volatile_dir, download_dir];

    /*if (DWfile.exists(volatile_dir)) {
        alert(DWfile.remove(volatile_dir));
        alert('here');
    }*/

    for ( index in dirs ) {
        if (!dwscripts.isFolder(dirs[index])) {
          if (!DWfile.createFolder(dirs[index])) {
            this.tmp_dir = null;
            return false;
          }
        }
    }

    return true;
  }

  this.runCommand = function(bin, args, block) {

    args = args.join(" ");
    block = (block === true);
    if (dwscripts.IS_MAC) {

      command = bin + ' ' + args + ((!block)? '&' : '');
      MM.runCommandLine(command);

      DWfile.write(this.tmp_dir + "/command.bat", command);

    } else if (dwscripts.IS_WIN) {

      command = bin + ' ' + args;
      bat_file = this.tmp_dir + "/command.bat";

      if (!DWfile.write(bat_file, command))
      {
        return false;
      }

      if (!MM.createProcess(
            null,
            this.localPath(bat_file),
            1,
            true
            ))
      {
        return false;
      }

    } else {

      alert("Sorry the current platform is not supported");
      return false;

    }

    return true;

  }

  this.removeCommandFile = function()
  {
      command_file = phoneGapPlugin.tmp_dir + "/command.bat";

      if (DWfile.exists(command_file))
      {
        DWfile.remove(command_file);
      }
  }

  this.runWithJava = function(jar, args)
  {
    args.unshift('"'+ jar +'"');
    args.unshift('-jar');
    return this.runCommand(this.safePath(this.jvmPath()), args);
  }

  this.jvmPath = function() {

    var java = "java";

    if (dwscripts.IS_WIN) {
      java = dw.getRootDirectory() + "/JVM/bin/java.exe"
    } else {
      return "/usr/bin/java" 
    }

    return this.localPath(java);
  }

  this.listDevices = function(platform, callback_func) {

    this.filename_index++;
    var output_file = this.volatile_dir + this.PATH_SEP + platform + "_" + this.filename_index + "_emu.txt";
		
    if (DWfile.exists(output_file)) {
      DWfile.remove(this.localPath(output_file));
    }

    if ( platform == 'webos' || platform == 'android' ){
      var args = [ 
        "--listsdks", 
        "--platform="+platform,
        "--sdkPath="+this.safePath(sdks[platform].path),
				"--output="+this.safePath(this.localPath(output_file))
			]
    }
		else return false;

    this.runWithJava(this.pluginJarPath(), args);

    var poller = new FilePoller(output_file, callback_func, { interval: 500, max_attempts: 40 });
    poller.start();

    return true;

  }

  this.runApp = function(platform, serialNumber, appPath, callback_func) {

    this.filename_index++;
    var output_file = this.volatile_dir + this.PATH_SEP + platform + "_" + this.filename_index + "_run.txt";

    if (DWfile.exists(output_file)) {
      DWfile.remove(this.localPath(output_file));
    }

    if ( platform == 'android' ){
      var args = [ 
        "--run", 
        "--platform="+platform,
        "--sdkPath="+this.safePath(sdks[platform].path),
        "--appPath="+this.safePath(this.localPath(appPath)), 
        "--device="+serialNumber,
				"--output="+this.safePath(this.localPath(output_file))
			]
    } else if (platform == 'webos') {
        var args = [ 
            "--run", 
            "--platform="+platform,
            "--sdkPath="+this.safePath(sdks[platform].path),
            "--appPath="+this.safePath(this.localPath(appPath)), 
            "--device="+this.safeArg(serialNumber),
            "--output="+this.safePath(this.localPath(output_file)),
            "--target="+this.safeArg(this.package)
            ]
    } else {
        return false;
    }
		
    this.runWithJava(this.pluginJarPath(), args);
    
    var poller = new FilePoller(output_file, callback_func, { mode: 'continuous', interval: 1000, max_attempts: 600 });
    poller.start();

    return true;

  }
  
  this.launchAVDManager = function() {

    var args = [ "--launchavdmanager", "--sdkPath="+this.safePath(sdks['android'].path) ]
		
    this.runWithJava(this.pluginJarPath(), args);

    return true;
    
  }
  
  this.createAVD = function(platform, target, name, callback_func) {

    this.filename_index++;
    var output_file = this.tmp_dir + this.PATH_SEP + platform + "_" + this.filename_index + "_cre.txt";
		
    if (DWfile.exists(output_file)) {
      DWfile.remove(this.localPath(output_file));
    }

    if ( platform == 'android' ){
      var args = [ 
          "--createAVD", 
          "--platform="+platform,
          "--sdkPath="+this.safePath(sdks[platform].path),
          "--target="+target,
          "--name=\""+name+"\"",
          "--output="+this.safePath(this.localPath(output_file))
          ]
    }
		else return false;
		
    this.runWithJava(this.pluginJarPath(), args);
    
    var poller = new FilePoller(output_file, callback_func, { delay: 500, interval: 1000 });
    poller.start();

    return true;

  }

  this.downloadApp = function(platform, url, destination, callback_func) {

    this.filename_index++;
    var output_file = this.volatile_dir + this.PATH_SEP + platform + "_" + this.filename_index + "_dld.txt";
		
    if (DWfile.exists(output_file)) {
      DWfile.remove(this.localPath(output_file));
    }
		
    var args = [ 
      "--download", 
      "--url=\""+url+"\"",
      "--dest="+this.safePath(this.localPath(destination)),
      "--output="+this.safePath(this.localPath(output_file))
	  ]
		
    this.runWithJava(this.pluginJarPath(), args);

		var poller = new FilePoller(output_file, callback_func, { mode: 'continuous', interval: 500, max_attempts: 0 });
		poller.start();

    return true;

  }

  this.checkAuth = function(callback_func) {
    var auth_file = this.tmp_dir + this.PATH_SEP + "auth_token.txt";

    if (DWfile.exists(auth_file)) {
      DWfile.remove(this.localPath(this.tmp_dir) + this.PATH_SEP +"auth_status.txt"); 
      try {
        var data = JSON.parse(DWfile.read(auth_file));
      } catch (e) {
        var result = new PollResult();
        result.statusCode = 404;
        callback_func(result);
        return;
      }

      if (typeof data == "undefined" || typeof data.token == "undefined") {
        var result = new PollResult();
        result.statusCode = 404;
        callback_func(result);
      }

      this.auth_token = data.token;

      var args = new Array( 
          '--checkAuth',
          '--authToken=' + this.safeArg(data.token), 
          '--output=' + this.safePath(
                  this.localPath(this.tmp_dir) + this.PATH_SEP + 'auth_status.txt'
              ),
          '--appVersion=' + this.safeArg(this.info.asText)
          );

      this.runWithJava(this.pluginJarPath(), args);

      pollFile(
          this.tmp_dir + this.PATH_SEP + "auth_status.txt", 
          poll_for_two_minutes, 
          0, 
          callback_func 
          );
    }
    else {
      var result = new PollResult();
      result.statusCode = 404;
      callback_func(result);
    }
  }

  this.authenticate = function(username, password, callback_func) {

    DWfile.remove(
        this.localPath(this.tmp_dir) + this.PATH_SEP + "auth_token.txt"
        );

    var args = new Array( 
        '--output=' + this.safePath(
          this.localPath(this.tmp_dir) + this.PATH_SEP + 'auth_token.txt'
          ),
        '--authorize',
        '--username=' + this.safeArg(username),
        '--password=' + this.safeArg(password),
        '--appVersion=' + this.safeArg(this.info.asText)
        );

    this.runWithJava(this.pluginJarPath(), args);

    pollFile(
        this.tmp_dir + this.PATH_SEP + "auth_token.txt", 
        poll_for_two_minutes, 
        0, 
        callback_func 
        )
  }

  this.initProjectWithId = function (id) {
      var data = '{"id":"' + id + '"}';
      DWfile.write(this.pwd() + "ProjectSettings", data);
  }

  this.initProject = function (callback_func) {

    DWfile.remove(this.localPath(this.tmp_dir) + this.PATH_SEP +"init_status.txt");
    DWfile.remove(this.pwd() + "ProjectSettings");

    var auth_file = this.tmp_dir + this.PATH_SEP + "auth_token.txt";
    var data = JSON.parse(DWfile.read(auth_file));

    var args = new Array(
        '--build',
        '--output=' + this.safePath(
          this.localPath(this.tmp_dir) + this.PATH_SEP + 'init_status.txt'
          ),
        '--tmpDir=' + this.safePath(this.localPath(this.tmp_dir)),
        '--projectDir=' + this.safePath(this.localPath(this.pwd())),
        '--create',
        '--authToken=' + this.safeArg(data.token),
        '--appVersion=' + this.safeArg(this.info.asText)
        );

    this.runWithJava(this.pluginJarPath(), args);

    pollFile(
        this.pwd() + "ProjectSettings", 
        poll_for_five_minutes, 
        0, 
        callback_func 
        );
  }

  this.getCurrentAppId = function() {
    try {
      var settings_file = this.pwd() + "ProjectSettings";
      var data = JSON.parse(DWfile.read(settings_file));
      return data.id;
    } 
    catch (e) {
      return null;
    }
  }

  this.uploadCurrentApp = function(callback_func) {

    DWfile.remove(this.localPath(this.tmp_dir) + this.PATH_SEP +"upload_status.txt");

    var auth_file = this.tmp_dir + this.PATH_SEP + "auth_token.txt";
    var data = JSON.parse(DWfile.read(auth_file));
    var output_file = this.tmp_dir + this.PATH_SEP +"upload_status.txt";
    var app_id = this.getCurrentAppId();

    if (DWfile.exists(output_file))  {
      DWfile.remove(this.localPath(output_file));
    }

    var args = new Array( 
      '--build',
      '--output=' + this.safePath(this.localPath(output_file)),
      '--tmpDir=' + this.safePath(this.localPath(this.tmp_dir)),
      '--projectDir=' + this.safePath(this.localPath(this.pwd())),
      '--appId=' + this.safeArg(app_id),
      '--authToken=' + this.safeArg(data.token),
      '--appVersion=' + this.safeArg(this.info.asText)
    );

    this.runWithJava(this.pluginJarPath(), args);

    pollFile(
	    output_file,
	    poll_for_five_minutes, 
	    0, 
	    callback_func 
    );
  }

  this.appInfo = function(callback_func) {
    var app_id = this.getCurrentAppId();
    var auth_file = this.tmp_dir + this.PATH_SEP + "auth_token.txt";
    var output_file = this.tmp_dir + this.PATH_SEP + "user_app_info.txt"; 

    if (DWfile.exists(output_file))  {
      DWfile.remove(this.localPath(output_file))
    }

    var args = new Array(
        '--listApps',
        '--appId=' + this.safeArg(app_id),
        '--output=' + this.safePath(this.localPath(output_file)),
        '--authToken=' + this.safeArg(this.auth_token),
        '--appVersion=' + this.safeArg(this.info.asText)
        );

    this.runWithJava(this.pluginJarPath(), args);

    pollFile(
        output_file, 
        poll_for_two_minutes, 
        0, 
        callback_func 
        );
  }

  this.listApps = function(callback_func) {

    var auth_file = this.tmp_dir + this.PATH_SEP + "auth_token.txt";
    var output_file = this.tmp_dir + this.PATH_SEP + "user_apps.txt"; 

    if (DWfile.exists(output_file))  {
      DWfile.remove(this.localPath(output_file))
    }

    var args = new Array(
        '--listApps',
        '--output=' + this.safePath(this.localPath(output_file)),
        '--authToken=' + this.safeArg(this.auth_token), 
        '--appVersion=' + this.safeArg(this.info.asText)
        );

    this.runWithJava(this.pluginJarPath(), args);

    pollFile(
        output_file, 
        poll_for_two_minutes, 
        0, 
        callback_func 
        );
  }

  this.checkBuildStatus = function(callback_func) {

    var auth_file = this.tmp_dir + this.PATH_SEP + "auth_token.txt";
    var data = JSON.parse(DWfile.read(auth_file));
    var app_id = this.getCurrentAppId();
    var output_file = this.tmp_dir + this.PATH_SEP + "status_"+ app_id + ".txt"; 

    if (app_id == null)
    {
      var result = new PollResult(404, "Could not resolve the app id");
      callback_func(result);
      return;
    }

    if (DWfile.exists(output_file))  {
      DWfile.remove(this.localPath(output_file))
    }

    var args = new Array(
        '--buildStatus',
        '--output=' + this.safePath(this.localPath(output_file)),
        '--appId=' + this.safeArg(app_id),
        '--authToken=' + this.safeArg(this.auth_token), 
        '--appVersion=' + this.safeArg(this.info.asText)
        );

    this.runWithJava(this.pluginJarPath(), args);

    pollFile(
        output_file, 
        poll_for_five_minutes, 
        0, 
        callback_func 
        );
  }

  this.logout = function() {
      var auth_file = this.tmp_dir + this.PATH_SEP + "auth_token.txt";

      if (DWfile.exists(auth_file)) {
        DWfile.remove(auth_file);
      }
    }

    this.getPackageName = function() {
        file = this.pwd() + "ProjectSettings"
        if (DWfile.exists(file)) {
            try {
               settings = JSON.parse(DWfile.read(file)); 
               this.package = settings.package;
               return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }

  this.clearVolatile = function() {
      if (!this.volatile_dir) return;

      var files = DWfile.listFolder(this.volatile_dir);

      if (files.length <= 0) return;

      for (i in files) {
          DWfile.remove(this.volatile_dir + "/" + files[i]);
      }
  }
}
