// Copyright 2009-2010 Adobe Systems Incorporated.  All rights reserved.
var IMPORT_BTN = null;
var SAVE_BTN = null;
var RENAME_BTN = null;
var DELETE_BTN = null;
var LIST_PRESETS = null;
var FILE_SUBROOT = null;
var BTN_FILE_SUBROOT = null;
var FILE_ENTRY = null;
var BTN_FILE_ENTRY = null;
var LBL_SCAN = null;
var CHK_SCAN = null;
var CHK_RECURSIVE = null;
var BTN_EXTENSIONS = null;
var FILES_TREE = null;

function commandButtons() { return []; }

// Function below defined only for Windows. With MFC2Drover on MAC was causing a problem with fixed layout possibly due to change in control sizes (Bug# 3090579)
if (!dwscripts.IS_MAC)
{
   var windowDimensions = function(){
        return dw.loadString("Dinamico/Main/WindowDimensions_PC");
    }
}
function displayHelp() {
	displayHelpShared("MainUI");
}
function cancelUI() {
	LBL_SCAN.innerHTML = dw.loadString("Dinamico/Main/Label/ScanFolder");
	window.close();
}

function receiveArguments() { }

function getSiteNumber(siteName) {
	if(!siteName){
		siteName = site.getCurrentSite();
	}
	
	var siteIdx = -1;
	var numSites = getNumberOfSites();
	
	var siteNumbers = new Array();
	var currentIdx = 0;
	
	while(siteNumbers.length < numSites){
		var s = dw.getPreferenceString('Sites\\-Site'+currentIdx,'Site Name');
		if(s){
			siteNumbers.push(currentIdx);
			if(s == siteName.replace(/^ftp:\/\//, '').replace(/^rds:\/\//, '')){
				siteIdx = currentIdx;
				break;
			}
		}
		currentIdx++;
	}
	
	return siteIdx;
}

function getIsPHPFromPrefs(siteNumber) {
	if (siteNumber == null || siteNumber < 0) {
		siteNumber = getSiteNumber();
	}
	var isPHP = false;
	if (siteNumber >= 0) {
		var versionMajor = dw.getPreferenceInt('Sites\\-Site' + siteNumber, 'VersionMajor', -1);
		var siteServers = dw.getPreferenceInt('Sites\\-Site' + siteNumber, 'SiteServers', -1);
		if (versionMajor >= 11 && siteServers >= 0) {
			for (var n=0; n<siteServers; n++) {
				var tModel = dw.getPreferenceString('Sites\\-Site' + siteNumber, 'SiteServer ' + n + '\\Server Model', '');
				isPHP = (tModel.search(/php/i) >= 0);
				if (isPHP) break;
			}
		}
		else {
			var tModel = dw.getPreferenceString('Sites\\-Site' + siteNumber, 'Server Model', '');
            isPHP = (tModel.search(/php/i) >= 0);
		}
	}
	return isPHP;
}
	
this.getNumberOfSites = function(){
	return dw.getPreferenceInt('Sites\\-Summary', 'Number Of Sites');
}

function initializeUI() {
	MM.setBusyCursor();
	MM.dinamico.swap_buttons_if_mac();
	var allSites = site.getSites();
	if (!allSites || !allSites.length) {
		alert(dw.loadString("Dinamico/Alert/SelectSite"));
		window.close();
		return false;
	}
	//open the site that corresponds to the open file
	MM.dinamico.open_site_for_open_file();
	var siteNumber = getSiteNumber();
	if(!site.getCurrentSite() || siteNumber < 0) {
		alert(dw.loadString("Dinamico/Alert/SelectSite"));
		window.close();
		return false;
	}
	var canContinue = false;
	var siteRoot = MM.dinamico.get_site_root(true);
	var tSiteRoot = MM.dinamico.get_trailing_slash(dw.getSiteRoot());
	if (siteRoot == tSiteRoot) {
		//is valid to check dom server language
		if (dw.getDocumentDOM()) {
			var tDOM = dw.getDocumentDOM();
			if (tDOM && tDOM.serverModel && tDOM.serverModel.getServerName().toLowerCase().indexOf("php") >= 0) {
				canContinue = true;
			}
		}
	}
	if (!canContinue) {
		canContinue = getIsPHPFromPrefs(siteNumber);
	}
	if (!canContinue) {
		alert(dw.loadString("Dinamico/Alert/PHP_Only"));
		window.close();
		return false;
	}
	//initialize UI elements
	IMPORT_BTN = findObject("importStruct");
	SAVE_BTN = findObject("saveStruct");
	RENAME_BTN = findObject("renameStruct");
	DELETE_BTN = findObject("deleteStruct");
	LIST_PRESETS = new ListControl("structureList");
	FILE_SUBROOT = findObject("subrootFolder");
	FILE_ENTRY = findObject("fileLocation");
	BTN_FILE_SUBROOT = findObject("browseSubroot");
	BTN_FILE_ENTRY = findObject("browseFile");
	LBL_SCAN = findObject("scanLabel");
	CHK_SCAN = findObject("checkScanCHK");
	CHK_RECURSIVE = findObject("checkRecursive");
	BTN_EXTENSIONS = findObject("btnExtensions");
	//initialize tree columns
	FILES_TREE = new TreeControl("filesTree");
	FILES_TREE.setColumnNames([ dw.loadString("Dinamico/Main/Columns/Files"),
								dw.loadString("Dinamico/Main/Columns/Scan"),
								dw.loadString("Dinamico/Main/Columns/Recursive"),
								dw.loadString("Dinamico/Main/Columns/Extensions") ]);
	//initialize dinamico
	LBL_SCAN.innerHTML = dw.loadString("Dinamico/Main/Label/ScanFolder");
	MM.dinamico.load_structures({ force_load: true });
	MM.dinamico.populate_preset_list(LIST_PRESETS);
	var foundPreset = -1;
	MM.dinamico.selected_info.custom_preset = false;
	MM.dinamico.selected_info.using_custom = false;
	var filePath = MM.dinamico.has_site_file();
	if (filePath) {
		foundPreset = MM.dinamico.compare_site_to_notes(filePath);
		if (foundPreset < 0) {
			foundPreset = MM.dinamico.compare_file_preset_gen(filePath);
			if (foundPreset < 0) {
				//editing existing filters
				var tempObj = MM.dinamico.read_site_file();
				if (tempObj) {
					foundPreset = MM.dinamico.compare_site_to_presets(tempObj);
					if (foundPreset < 0) {
						//add custom entry to end of list
						foundPreset = LIST_PRESETS.getLen();
						LIST_PRESETS.append(dw.loadString("Dinamico/Presets/Custom"), "custom");
						MM.dinamico.selected_info.custom_preset = tempObj;
						MM.dinamico.selected_info.using_custom = true;
					}
				}
			}
		}
	}
	else {
		//load fresh and try to find preset
		var retObj = MM.dinamico.inspect_site_for_preset();
		if (retObj.index >= 0) {
			foundPreset = retObj.index;
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[retObj.index] );
			var tRoot = String(tPreset.subroot);
			if (tRoot.search(MM.dinamico.site_root_pattern) == 0) {
				tRoot = tRoot.replace(MM.dinamico.site_root_pattern, siteRoot);
			}
			else {
				tRoot = MM.dinamico.get_file_path_from_system(tRoot);
			}
			var newRoot = String(retObj.folder);
			if (newRoot.toLowerCase().indexOf(siteRoot.toLowerCase()) == 0) {
				newRoot = MM.dinamico.site_root_param + newRoot.substring(siteRoot.length);
			}
			else {
				newRoot = MM.dinamico.get_location_system_path(newRoot);
			}
			tPreset.subroot = newRoot;
			if (MM.dinamico.selected_info.using_custom) {
				MM.dinamico.selected_info.custom_preset = tPreset;
			}
			else {
				MM.dinamico.structure_objects[retObj.index] = tPreset;
			}
		}
	}
	if (foundPreset < 0) {
		//preset not found
		foundPreset = parseInt(MM.dinamico.structure_file_names["_blank"].index);
	}
	var fP = false;
	if (MM.dinamico.selected_info.using_custom) {
		fP = true;
		LIST_PRESETS.setIndex(LIST_PRESETS.getLen()-1);
	}
	if (!fP) {
		for (var n=0; n<LIST_PRESETS.valueList.length; n++) {
			if (LIST_PRESETS.valueList[n] == foundPreset) {
				LIST_PRESETS.setIndex(n);
				fP = true;
				break;
			}
		}
		if (!fP) {
			LIST_PRESETS.setIndex(0);
		}
	}
	//populate, enable / disable sub interface and plus minus buttons based on tree selection
	updateUI("structureList");
	LIST_PRESETS.object.focus();
	MM.clearBusyCursor();
	findObject('okButton').focus();
}

function finishUI() {
	if (validateUI()) {
		var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
		MM.dinamico.create_config_file(tPreset);
		window.close();
	}
}

function validateUI() {
	if (!(FILES_TREE.object.getElementsByTagName("MM:TREENODE")).length) {
		if (!confirm(dw.loadString("Dinamico/Confirm/No_Entries"))) {
			return false;
		}
	}
	if (MM.dinamico.selected_info.preset_updated) {
		if (confirm(dw.loadString("Dinamico/Confirm/Updated_Save"))) {
			if (!updateUI("saveStructure")) {
				return false;
			}
		}
	}
	return true;
}

function removeCustomFromStructureList() {
	//has custom at end
	if (LIST_PRESETS.getLen() > MM.dinamico.structure_objects.length) {
		MM.dinamico.selected_info.custom_preset = false;
		MM.dinamico.selected_info.using_custom = false;
		var tVArr = LIST_PRESETS.getValue('all');
		var tLArr = LIST_PRESETS.get('all');
		var newVArr = [];
		var newLArr = [];
		for (var n=0; n<tVArr.length-1; n++) {
			newVArr.push(tVArr[n]);
			newLArr.push(tLArr[n]);
		}
		LIST_PRESETS.setAll(newLArr, newVArr);
	}
}

function updateUI(tField) {
	if (!FILE_SUBROOT) return;
	switch (tField) {
		case "structureList":
			SAVE_BTN.disabled = "enabled";
			RENAME_BTN.disabled = "enabled";
			DELETE_BTN.disabled = "enabled";
			FILES_TREE.object.disabled = "enabled";
			FILE_SUBROOT.disabled = "enabled";
			BTN_FILE_SUBROOT.disabled = "enabled";
			//changed selection in presets list
			var tValue = LIST_PRESETS.getValue();
			if (tValue == "custom") {
				MM.dinamico.selected_info.using_custom = true;
				MM.dinamico.selected_info.structure_index = LIST_PRESETS.getLen()-1;
			}
			else if (isNaN(parseInt(tValue))) {
				//user has somehow selected a non-number, meaning a text entry that isn't "custom", clear UI and wait
				MM.dinamico.selected_info.using_custom = false;
				FILES_TREE.setAllRows([],[]);
				SAVE_BTN.disabled = "disabled";
				RENAME_BTN.disabled = "disabled";
				DELETE_BTN.disabled = "disabled";
				FILES_TREE.object.disabled = "disabled";
				FILE_SUBROOT.disabled = "disabled";
				BTN_FILE_SUBROOT.disabled = "disabled";
			}
			else {
				MM.dinamico.selected_info.using_custom = false;
				MM.dinamico.selected_info.structure_index = parseInt(tValue);
			}
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			if (!tPreset.subroot || tPreset.subroot == "/") {
				var tInfo = MM.dinamico.prep_root_path(MM.dinamico.get_site_root(true), "", true, true);
			}
			FILE_SUBROOT.value = MM.dinamico.set_editing_system_path((tPreset.subroot || MM.dinamico.get_site_root(true)), "");
			MM.dinamico.populate_structure_tree(FILES_TREE);
			var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
			if (tNodes.length) {
				FILES_TREE.setRowIndex(0);
			}
			MM.dinamico.selected_info.has_updated_locations = false;
			MM.dinamico.selected_info.preset_updated = false;
			//populate, enable / disable sub interface and plus minus buttons based on tree selection
			updateUI("filesTree");
			break;
		case "importStructure":
			var retObj = MM.dinamico.import_structure();
			if (retObj) {
				MM.dinamico.load_structures({ force_load: true });
				MM.dinamico.populate_preset_list(LIST_PRESETS);
				LIST_PRESETS.pick(retObj.name);
				updateUI("structureList");
			}
			break;
		case "saveStructure":
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			MM.dinamico_save_ui = {
				button: "cancel",
				preset_obj: tPreset,
				new_name: "",
			}
			dw.runCommand("Dinamico_SaveStructure.htm");
			if (MM.dinamico_save_ui && MM.dinamico_save_ui.button != "cancel") {
				MM.dinamico.load_structures({ force_load: true });
				MM.dinamico.populate_preset_list(LIST_PRESETS);
				var tIndex = 0;
				var tObj = MM.dinamico.structure_names[MM.dinamico_save_ui.new_name.toLowerCase()];
				if (tObj) {
					tIndex = tObj.index;
				}
				else {
					tObj = MM.dinamico.structure_file_names[MM.dinamico.strip_for_file_name(MM.dinamico_save_ui.new_name)];
					if (tObj) {
						tIndex = tObj.index;
					}
				}
				if (!tIndex) tIndex = 0;
				LIST_PRESETS.pickValue(tIndex);
				MM.dinamico_save_ui.button = "cancel";
				updateUI("structureList");
				return true;
			}
			MM.dinamico_save_ui.button = "cancel";
			break;
		case "renameStructure":
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			MM.dinamico_rename_ui = {
				button: "cancel",
				preset_obj: tPreset,
				new_name: "",
			}
			dw.runCommand("Dinamico_RenameStructure.htm");
			if (MM.dinamico_rename_ui && MM.dinamico_rename_ui.button != "cancel") {
				MM.dinamico.load_structures({ force_load: true });
				MM.dinamico.populate_preset_list(LIST_PRESETS);
				var tIndex = 0;
				var tObj = MM.dinamico.structure_names[MM.dinamico_rename_ui.new_name.toLowerCase()];
				if (tObj) {
					tIndex = tObj.index;
				}
				else {
					tObj = MM.dinamico.structure_file_names[MM.dinamico.strip_for_file_name(MM.dinamico_rename_ui.new_name)];
					if (tObj) {
						tIndex = tObj.index;
					}
				}
				if (!tIndex) tIndex = 0;
				LIST_PRESETS.pickValue(tIndex);
				MM.dinamico_rename_ui.button = "cancel";
				updateUI("structureList");
			}
			MM.dinamico_rename_ui.button = "cancel";
			break;
		case "removeStructure":
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			if (tPreset.isDefault) {
				alert(dw.loadString("Dinamico/Alert/Remove_Default"));
			}
			else {
				var tValue = LIST_PRESETS.getValue();
				if (confirm(dw.loadString("Dinamico/Confirm/Remove_Preset"))) {
					if (tValue == "custom") {
						//removing custom preset
						MM.dinamico.selected_info.structure_index = -1;
						removeCustomFromStructureList();
						tIndex--;
						if (tIndex < 0) tIndex = 0;
						LIST_PRESETS.setIndex(tIndex);
						updateUI("structureList");
					}
					else if (isNaN(parseInt(tValue))) {
						//user has somehow selected a non-number, meaning a text entry that isn't "custom", do nothing
					}
					else {
						//removing an actual preset
						if (MM.dinamico.remove_structure(parseInt(tValue))) {
							tIndex--;
							if (tIndex < 0) tIndex = 0;
							MM.dinamico.populate_preset_list(LIST_PRESETS);
							LIST_PRESETS.setIndex(tIndex);
							LIST_PRESETS.refresh();
							updateUI("structureList");
						}
					}
				}
			}
			break;
		case "subrootFolder":
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			if (tPreset) {
				var newRoot = MM.dinamico.get_editing_system_path(FILE_SUBROOT.value, MM.dinamico.get_site_root(true), 3);
				if (!newRoot) {
					FILE_SUBROOT.value = MM.dinamico.set_editing_system_path(MM.dinamico.get_site_root(true), "");
					newRoot = MM.dinamico.get_site_root(true);
				}
				var siteURL = MM.dinamico.get_site_root(true);
				var rootInfo = MM.dinamico.prep_root_path(newRoot, String(tPreset.subroot), MM.dinamico.selected_info.has_alerted_outside);
				var oldInfo = rootInfo.old_info;
				newRoot = rootInfo.root_path;
				var newVal = rootInfo.ret_path;
				MM.dinamico.selected_info.has_alerted_outside = rootInfo.outside_alerted;
				MM.dinamico_has_alerted_outside = rootInfo.outside_alerted;
				if (newVal != oldInfo.ret_path && newVal != oldInfo.root_path && newRoot != oldInfo.ret_path && newRoot != oldInfo.root_path) {
					FILE_SUBROOT.value = MM.dinamico.set_editing_system_path(newRoot, "", true);
					tPreset = MM.dinamico.updated_subroot(tPreset, newVal);
					if (MM.dinamico.selected_info.using_custom) {
						MM.dinamico.selected_info.custom_preset = tPreset;
					}
					else {
						MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] = tPreset;
					}

					MM.dinamico.populate_structure_tree(FILES_TREE);
					var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
					if (tNodes.length) {
						FILES_TREE.setRowIndex(0);
					}
					MM.dinamico.selected_info.has_updated_locations = false;
					MM.dinamico.selected_info.preset_updated = true;
					updateUI("filesTree");
				}
			}
			break;
		case "browseSubroot":
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			if (tPreset) {
				var tRoot = MM.dinamico.get_subroot_filepath(tPreset.subroot);
				var newRoot = MM.dinamico.browse_folder({ folder: tRoot, label: dw.loadString("Dinamico/Main/Browse/SelectSubroot") });
				if (newRoot && DWfile.exists(newRoot)) {
					newRoot = MM.dinamico.get_trailing_slash(newRoot);
					var siteURL = MM.dinamico.get_site_root(true);
					var rootInfo = MM.dinamico.prep_root_path(newRoot, String(tPreset.subroot), MM.dinamico.selected_info.has_alerted_outside);
					var oldInfo = rootInfo.old_info;
					newRoot = rootInfo.root_path;
					var newVal = rootInfo.ret_path;
					MM.dinamico.selected_info.has_alerted_outside = rootInfo.outside_alerted;
					MM.dinamico_has_alerted_outside = rootInfo.outside_alerted;
					if (newVal != oldInfo.ret_path && newVal != oldInfo.root_path && newRoot != oldInfo.ret_path && newRoot != oldInfo.root_path) {
						FILE_SUBROOT.value = MM.dinamico.set_editing_system_path(newRoot, "", true);
						tPreset = MM.dinamico.updated_subroot(tPreset, newVal);
						if (MM.dinamico.selected_info.using_custom) {
							MM.dinamico.selected_info.custom_preset = tPreset;
						}
						else {
							MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] = tPreset;
						}
						MM.dinamico.populate_structure_tree(FILES_TREE);
						var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
						if (tNodes.length) {
							FILES_TREE.setRowIndex(0);
						}
						MM.dinamico.selected_info.has_updated_locations = false;
						MM.dinamico.selected_info.preset_updated = true;
						updateUI("filesTree");
					}
				}
			}
			break;
		case "addFile":
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			if (tPreset) {
				MM.dinamico_addfile_ui = {
					button: "cancel",
					preset_obj: tPreset,
					has_alerted: MM.dinamico.selected_info.has_alerted_outside,
					new_info: {
						file_location: "",
						file_path: "",
						isFolder: false,
						isRecursive: false,
						extensions: []
					}
				}
				dw.runCommand("Dinamico_AddItem.htm");
				MM.dinamico.selected_info.has_alerted_outside = MM.dinamico_addfile_ui.has_alerted;
				if (MM.dinamico_addfile_ui && MM.dinamico_addfile_ui.button != "cancel") {
					var tLocation = String(MM.dinamico_addfile_ui.new_info.file_location);
					if (tLocation.search(MM.dinamico.sub_root_pattern) < 0 && tLocation.search(MM.dinamico.config_pattern) < 0) {
						tLocation = MM.dinamico_addfile_ui.new_info.file_path;
					}
					tPreset = MM.dinamico_addfile_ui.preset_obj;
					tPreset.contents_object.push({
						isFolder: (MM.dinamico_addfile_ui.new_info.isFolder && true),
						isRecursive: (MM.dinamico_addfile_ui.new_info.isRecursive && true),
						isScanned: true,
						type: ( (MM.dinamico_addfile_ui.new_info.isFolder) ? "folder" : "file" ),
						name: String(tLocation),
						extensions: MM.dinamico_addfile_ui.new_info.extensions,
						filter: "",
					});
					if (MM.dinamico.selected_info.using_custom) {
						MM.dinamico.selected_info.custom_preset = tPreset;
					}
					else {
						MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] = tPreset;
					}
					FILE_SUBROOT.value = MM.dinamico.set_editing_system_path(String(tPreset.subroot), "");
					MM.dinamico.populate_structure_tree(FILES_TREE);
					var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
					var selIndex = -1;
					for (var n=0; n<tNodes.length; n++) {
						if (tNodes[n].fullpath && tNodes[n].fullpath.toLowerCase() == MM.dinamico_addfile_ui.new_info.file_path.toLowerCase()) {
							selIndex = n;
							break;
						}
					}
					if (selIndex >= 0) {
						FILES_TREE.setRowIndex(selIndex);
					}
					MM.dinamico.selected_info.has_updated_locations = true;
					MM.dinamico.selected_info.preset_updated = true;
					MM.dinamico_addfile_ui.button = "cancel";
					updateUI("filesTree");
					setTimeout("FILES_TREE.object.focus();", 100);
				}
			}
			MM.dinamico_addfile_ui.button = "cancel";
			break;
		case "delFile":
			var tIndex = FILES_TREE.getRowIndex();
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			if (tPreset && tIndex >= 0) {
				var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
				var affectedPath = "";
				var isScanning = false;
				if (tNodes[tIndex].getAttribute("contentindex")) {
					var cIndex = parseInt(tNodes[tIndex].getAttribute("contentindex"));
					if (!isNaN(cIndex) && cIndex >= 0) {
						isScanning = true;
						var newArr = [];
						for (var n=0; n<tPreset.contents_object.length; n++) {
							if (n != cIndex) {
								newArr.push(tPreset.contents_object[n]);
							}
							else {
								affectedPath = String(tPreset.contents_object[n].name);
							}
						}
						tPreset.contents_object = newArr;
					}
				}
				var tChNodes = tNodes[tIndex].getElementsByTagName("mm:treenode");
				var hasConfirmed = true;
				for (var n=0; n<tChNodes.length; n++) {
					hasConfirmed = false;
					if (tChNodes[n].getAttribute("contentindex")) {
						var cIndex = parseInt(tChNodes[n].getAttribute("contentindex"));
						if (!isNaN(cIndex) && cIndex >= 0) {
							if (isScanning) hasConfirmed = confirm(dw.loadString("Dinamico/Confirm/Remove_Subfolder_Children"));
							else hasConfirmed = confirm(dw.loadString("Dinamico/Confirm/Remove_Subfolder_Children_NoScan"));
							break;
						}
					}
				}
				var newArr = [];
				for (var n=0; n<tPreset.contents_object.length; n++) {
					if ((hasConfirmed && tPreset.contents_object[n].name.toLowerCase().indexOf(unescape(tNodes[tIndex].entrypath).toLowerCase()) < 0) ||
						(!hasConfirmed && tPreset.contents_object[n].name.toLowerCase() != unescape(tNodes[tIndex].entrypath).toLowerCase())) {
						newArr.push(tPreset.contents_object[n]);
					}
				}
				tPreset.contents_object = newArr;
				if (MM.dinamico.selected_info.using_custom) {
					MM.dinamico.selected_info.custom_preset = tPreset;
				}
				else {
					MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] = tPreset;
				}
				MM.dinamico.populate_structure_tree(FILES_TREE);
				var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
				var newIndex = ( (tNodes.length) ? 0 : -1 );
				if (newIndex >= 0) {
					FILES_TREE.setRowIndex(newIndex);
				}
				MM.dinamico.selected_info.has_updated_locations = true;
				MM.dinamico.selected_info.preset_updated = true;
				updateUI("filesTree");
			}
			break;
		case "filesTree":
			var tIndex = FILES_TREE.getRowIndex();
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			if (tIndex >= 0) {
				var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
				var tValArr = tNodes[tIndex].value.split("|");
				FILE_ENTRY.value = MM.dinamico.set_editing_system_path(unescape(tNodes[tIndex].getAttribute("fullpath")), String(tPreset.subroot));
				var scanEnabled = "enabled";
				var recursiveEnabled = "enabled";
				if (tNodes[tIndex].childNodes.length) {
					FILE_ENTRY.disabled = "disabled";
					BTN_FILE_ENTRY.disabled = "disabled";
				}
				else {
					//disable because it's probably a file
					recursiveEnabled = "disabled";
					FILE_ENTRY.disabled = "enabled";
					BTN_FILE_ENTRY.disabled = "enabled";
				}
				var scanLabelStr = dw.loadString("Dinamico/Main/Label/ScanFolder");
				if (tNodes[tIndex].getAttribute("contentindex")) {
//alert(MM.dinamico.selected_info.structure_index + "\n" + MM.dinamico.structure_objects.length + "\n" + tPreset);
					var cIndex = parseInt(tNodes[tIndex].getAttribute("contentindex"));
					if (!isNaN(cIndex) && cIndex >= 0) {
						if (tPreset.contents_object[cIndex] && tPreset.contents_object[cIndex].isFolder) {
							//re-enable because we know it's a folder
							recursiveEnabled = "enabled";
						}
						else {
							//disable scan because files are defaulted as scanned
							//scanEnabled = "disabled"; // allow files to be not-scanned
							recursiveEnabled = "disabled";
							scanLabelStr = dw.loadString("Dinamico/Main/Label/ScanFile");
						}
					}
				}
				LBL_SCAN.innerHTML = scanLabelStr;
				CHK_SCAN.checked = (tValArr[1] != "");
				CHK_RECURSIVE.checked =  tValArr[2] != ""; //(tValArr[1] != "" && tValArr[2] != "");
				CHK_SCAN.disabled = scanEnabled;
				CHK_RECURSIVE.disabled = ( (CHK_SCAN.checked) ? recursiveEnabled : "disabled" );
				BTN_EXTENSIONS.disabled = CHK_RECURSIVE.disabled;
			}
			else {
				FILE_ENTRY.value = "";
				CHK_SCAN.checked = false;
				CHK_RECURSIVE.checked = false;
				FILE_ENTRY.disabled = "disabled";
				CHK_SCAN.disabled = "disabled";
				BTN_FILE_ENTRY.disabled = "disabled";
				CHK_RECURSIVE.disabled = "disabled";
				BTN_EXTENSIONS.disabled = "disabled";
			}
			if (MM.dinamico.selected_info.has_updated_locations) {
				FILE_SUBROOT.disabled = "disabled";
				BTN_FILE_SUBROOT.disabled = "disabled";
			}
			else {
				FILE_SUBROOT.disabled = "enabled";
				BTN_FILE_SUBROOT.disabled = "enabled";
			}
			break;
		case "fileLocation":
			var tIndex = FILES_TREE.getRowIndex();
			if (tIndex >= 0) {
				var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
				var tValArr = tNodes[tIndex].value.split("|");
				if (tNodes[tIndex].getAttribute("contentindex")) {
					var cIndex = parseInt(tNodes[tIndex].getAttribute("contentindex"));
					if (!isNaN(cIndex) && cIndex >= 0) {
						var oldFilePath = unescape(tNodes[tIndex].getAttribute("fullpath"));
						var oldEntryPath = unescape(tNodes[tIndex].getAttribute("entrypath"));
						var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
						var oldIsFolder = (tPreset.contents_object[cIndex].isFolder && true);
						//check to see if they want to remove
						if (String(FILE_ENTRY.value).replace(/\s*/g, "") == "") {
							if (confirm(dw.loadString("Dinamico/Confirm/Update_Blank"))) {
								updateUI("delFile");
								return;
							}
							else {
								//reset to prior value
								updateUI("filesTree");
								return;
							}
						}
						var newValue = MM.dinamico.get_editing_system_path(String(FILE_ENTRY.value), String(tPreset.subroot), 0);
						//get path info
						var fileInfo = MM.dinamico.get_new_path({
							preset_obj: tPreset,
							new_path: newValue,
							new_value: "",
							new_location: "",
							old_path: oldFilePath,
							old_location: oldEntryPath,
							isFolder: (tPreset.contents_object[cIndex].isFolder && true),
						});
						if (fileInfo) {
							//general validation
							var retStr = MM.dinamico.validate_new_path(fileInfo);
							if (retStr) {
								if (retStr == "*nochange*") {
									//do nothing
									//updateUI("filesTree");
									return;
								}
								else {
									alert(retStr);
									updateUI("filesTree");
									return;
								}
							}
							//ensure they haven't changed from a folder to a file
							var fileFoldCheck = MM.dinamico.check_fold_or_file({ path: fileInfo.new_path, isFolder: oldIsFolder });
							if (fileFoldCheck) {
								if (fileFoldCheck.isFolder && !oldIsFolder) {
									alert(dw.loadString("Dinamico/Alert/Folder_to_file"));
									updateUI("filesTree");
									return;
								}
								else if (!fileFoldCheck.isFolder && oldIsFolder) {
									alert(dw.loadString("Dinamico/Alert/File_to_folder"));
									updateUI("filesTree");
									return;
								}
							}
							//do path update
							var newInfo = MM.dinamico.do_path_update(fileInfo);
							if (newInfo) {
								fileUpdated(newInfo, cIndex);
							}
						}
					}
				}
			}
			break;
		case "browseFile":
			var newFile = "";
			var tIndex = FILES_TREE.getRowIndex();
			if (tIndex >= 0) {
				var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
				var tValArr = tNodes[tIndex].value.split("|");
				var filePath = "";
				if (tNodes[tIndex].getAttribute("contentindex")) {
					var cIndex = parseInt(tNodes[tIndex].getAttribute("contentindex"));
					if (!isNaN(cIndex) && cIndex >= 0) {
						var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
						var oldFilePath = unescape(tNodes[tIndex].getAttribute("fullpath"));
						var oldEntryPath = unescape(tNodes[tIndex].getAttribute("entrypath"));
						var tRoot = String(tPreset.subroot);
						var siteRoot = MM.dinamico.get_site_root(true);
						if (tRoot.search(MM.dinamico.site_root_pattern) == 0) {
							tRoot = tRoot.replace(MM.dinamico.site_root_pattern, siteRoot);
						}
						else {
							tRoot = MM.dinamico.get_file_path_from_system(tRoot);
						}
						var fileInfo = MM.dinamico.browse_file_folder({
							type: ( (tPreset.contents_object[cIndex].isFolder) ? "folder" : "file" ),
							preset_obj: tPreset,
							element: FILE_ENTRY,
						});
						if (fileInfo) {
							var retStr = MM.dinamico.validate_new_path({
								preset_obj: tPreset,
								new_path: fileInfo.new_path,
								new_location: fileInfo.new_location,
								old_path: oldFilePath,
								old_location: oldEntryPath,
							});
							if (retStr) {
								if (retStr == "*nochange*") return;
								else {
									alert(retStr);
									return;
								}
							}
							var newInfo = MM.dinamico.do_path_update(fileInfo);
							if (newInfo) {
								fileUpdated(newInfo, cIndex);
							}
						}
					}
				}
			}
			break;
		case "checkScan":
			var tIndex = FILES_TREE.getRowIndex();
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			if (tIndex >= 0) {
				var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
				var affectedPath = "";
				
				var nodeFound = false;
				
				if (tNodes[tIndex].getAttribute("contentindex")) {
					var cIndex = parseInt(tNodes[tIndex].getAttribute("contentindex"));
					if (!isNaN(cIndex) && cIndex >= 0) {
						tPreset.contents_object[cIndex].isScanned = CHK_SCAN.checked;
						nodeFound = true;
					}
				}
				
				if(!nodeFound){
					//add folder to scan
					affectedPath = MM.dinamico.trim_trailing_slash(unescape(String(tNodes[tIndex].entrypath)));
					tPreset.contents_object.push({
						isFolder: (true),
						isRecursive: (CHK_RECURSIVE.checked),
						isScanned: (true),
						type: "folder",
						name: String(affectedPath),
						extensions: [],
						filter: "",
					});
				}
				if (MM.dinamico.selected_info.using_custom) {
					MM.dinamico.selected_info.custom_preset = tPreset;
				}
				else {
					MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] = tPreset;
				}

				var oldIndex = FILES_TREE.getRowIndex();
				MM.dinamico.populate_structure_tree(FILES_TREE);
				
				if (oldIndex >= 0) {
					FILES_TREE.setRowIndex(oldIndex);
				}
				
				MM.dinamico.selected_info.preset_updated = true;
				updateUI("filesTree");
			}
			break;
		case "checkRecursive":
			var tIndex = FILES_TREE.getRowIndex();
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			if (tIndex >= 0) {
				var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
				if (tNodes[tIndex].getAttribute("contentindex")) {
					var cIndex = parseInt(tNodes[tIndex].getAttribute("contentindex"));
					if (!isNaN(cIndex) && cIndex >= 0) {
						tPreset.contents_object[cIndex].isRecursive = ( (CHK_RECURSIVE.checked) ? true : false );
						MM.dinamico.populate_structure_tree(FILES_TREE);
						FILES_TREE.setRowIndex(tIndex);
						MM.dinamico.selected_info.preset_updated = true;
					}
				}
			}
			break;
		case "btnExtensions":
			var tIndex = FILES_TREE.getRowIndex();
			var tPreset = ( (MM.dinamico.selected_info.using_custom) ? MM.dinamico.selected_info.custom_preset : MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] );
			if (tIndex >= 0) {
				var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
				var tValArr = tNodes[tIndex].value.split("|");
				var extArr = [];
				if (tNodes[tIndex].getAttribute("contentindex")) {
					var cIndex = parseInt(tNodes[tIndex].getAttribute("contentindex"));
					if (!isNaN(cIndex) && cIndex >= 0) {
						extArr = tPreset.contents_object[cIndex].extensions;
						MM.dinamico_extensions_ui = {
							button: "cancel",
							extensions: extArr,
						}
						dw.runCommand("Dinamico_Extensions.htm");
						if (MM.dinamico_extensions_ui && MM.dinamico_extensions_ui.button != "cancel") {
							tPreset.contents_object[cIndex].extensions = MM.dinamico_extensions_ui.extensions;
							MM.dinamico_extensions_ui.button = "cancel";
							tValArr[3] = tPreset.contents_object[cIndex].extensions.join(", ");
							tNodes[tIndex].value = tValArr.join("|");
							MM.dinamico.selected_info.preset_updated = true;
						}
						MM.dinamico_extensions_ui.button = "cancel";
					}
				}
			}
			break;
	}
	return false;
}


function fileUpdated(newInfo, cIndex) {
	//newInfo.preset_obj.contents_object[cIndex].name = newInfo.new_location;
	if (newInfo.new_location.search(MM.dinamico.sub_root_pattern) == 0 || newInfo.new_location.search(MM.dinamico.config_pattern) == 0) {
		newInfo.preset_obj.contents_object[cIndex].name = newInfo.new_location;
	}
	else {
		newInfo.preset_obj.contents_object[cIndex].name = newInfo.new_path;
	}
	if (MM.dinamico.selected_info.using_custom) {
		MM.dinamico.selected_info.custom_preset = newInfo.preset_obj;
	}
	else {
		MM.dinamico.structure_objects[MM.dinamico.selected_info.structure_index] = newInfo.preset_obj;
	}
	if (newInfo.updated_preset) {
		FILE_SUBROOT.value = MM.dinamico.set_editing_system_path(String(newInfo.preset_obj.subroot), "");
	}
	MM.dinamico.populate_structure_tree(FILES_TREE);
	var tNodes = FILES_TREE.object.getElementsByTagName("MM:TREENODE");
	var newIndex = ( (tNodes.length) ? 0 : -1 );
	if (newInfo.new_location) {
		var testPath1 = newInfo.new_location.toLowerCase();
		for (var n=0; n<tNodes.length; n++) {
			var testPath2 = unescape(tNodes[n].entrypath).toLowerCase();
			if (testPath1 == testPath2 || testPath1 + "/" == testPath2) {
				newIndex = n;
				break;
			}
		}
	}
	if (newIndex >= 0) {
		FILES_TREE.setRowIndex(newIndex);
	}
	MM.dinamico.selected_info.preset_updated = true;
	MM.dinamico.selected_info.has_updated_locations = true;
	updateUI("filesTree");
}

// Register the on enter hit event to prevent the dialog to close
document.documentElement.addEventListener("DWDialogOk", function(e){ finishUI(); } , true);
document.documentElement.addEventListener("DWDialogCancel", function(e){ window.close(); } , true);