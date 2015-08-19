/*	Author: ntoombs19
 *	Name: LA Enhancer
 *	Version: 1.10
 *	Client script: javascript:$.getScript('https://dl.dropboxusercontent.com/u/26362756/laEnhancer/test.js');void(0); */

/***Global variables***/
	var version = "1.10";
	var scriptName = "LA Enhancer"
	var scriptURL = "https://dl.dropboxusercontent.com/u/26362756/laEnhancer/";
	var updateNotesURL = "http://forum.tribalwars.net/showthread.php?266604-ntoombs19-s-FA-Filter&p=6785655&viewfull=1#post6785655";
	var working = true;
	var resourcesLoaded = false;
	var scriptLoaded = false;
	var pagesLoaded = false;
	var filtersApplied = false;
	var cansend = true;
	var keySetMode = false;
	var hideRow = false;
	var editingKey = false;
	var troubleshoot = false;
	var clearProfiles = false;
	var reason = [];
	var keyToEdit;
	var current_units;
	var sitter = "";
	if (window.game_data.player.sitter != "0") {
		sitter = "t=" + window.game_data.player.id + "&";
	}
	var link = ["http://" + window.location.host + "/game.php?" + sitter + "village=", "&screen=am_farm"];
	var userset;
	var s = {
		start_page: 0,
		end_page: 1,
		order_by: 2,
		direction: 3,
		all_none: 4,
		blue: 5,
		green: 6,
		yellow: 7,
		red_yellow: 8,
		red_blue: 9,
		red: 10,
		hide_recent_farms: 11,
		sent_time_filter: 12,
		hide_recent_time: 13,
		enable_hauls: 14,
		full: 15,
		partial: 16,
		enable_attacks: 17,
		attack_operator: 18,
		attack_value: 19,
		enable_walls: 20,
		wall_operator: 21,
		wall_value: 22,
		enable_distances: 23,
		distance_operator: 24,
		distance_value: 25,
		enable_scout: 26,
		scout_report_operator: 27,
		haul_value: 28,
		continent_display: 29,
		continents_list: 30,
		enable_time: 31,
		attack_time_filter: 32,
		time_value: 33,
		enable_auto_run: 34,	next_village_no_farms: 35,
		next_village_scouts: 36,
		scouts_left: 37,
		next_village_farming_troops: 38,
		farming_troops_left: 39,
		next_village_units: 40
	};
	var keycodes = {
	    "a": 65,
	    "b": 66,
	    "c": 67,
	    "skip": 83,
	    "right": 39,
	    "left": 37,
	    "master": 77
	};
	var keyPressSettings = {
		"a_code": 65,
		"a_char": "A",
		"b_code": 66,
		"b_char": "B",
		"c_code": 67,
		"c_char": "C",
		"master_code": 77,
		"master_char": "M",
		"skip_code": 83,
		"skip_char": "S",
		"left_code": 37,
		"left_char": "←",
		"right_code": 39,
		"right_char": "→",
		"priorityOneEnabled": true,
		"priorityOneProfile": "Default",
		"priorityOneButton": "Skip",
		"priorityTwoEnabled": true,
		"priorityTwoProfile": "Default",
		"priorityTwoButton": "Skip",
		"priorityThreeEnabled": true,
		"priorityThreeProfile": "Default",
		"priorityThreeButton": "Skip",
		"defaultButton": "Skip"
	};
	var availableLangs = ["en", "es"];

/***Init script***/
	// Enables caching of loaded javascript before loading resources
	$.getScript(scriptURL + "resources.js", function() {
		if ($.jStorage.get("language") == null) {
			setDefaultLanguage();
		}
		$.getScript(scriptURL + "lang/" + $.jStorage.get("language") + '.js', function() {
			checkPage();
		});
	});

	function run(){
		checkVersion();
		checkWorking();
		setVersion();
		makeItPretty();
		setTWFilters();
		showSettings();
		turnOnHotkeys();
		hotkeysOnOff();
		if(userset[s.enable_auto_run] != false){
			applySettings();
		}
	}

	function checkVersion(){
		if (getVersion() != version) {
			buttons = [{
				text: 'OK',
				callback: null,
				confirm: true
			}];
			if(clearProfiles){
				var profileList = $.jStorage.get("profileList");
				$.each(profileList, function(i, val) {
					$.jStorage.deleteKey("profile:" + val);
				});
				$.jStorage.set("keyPressSettings",keyPressSettings);
				Dialog.show("update_dialog", "This script has recently been updated to version <span style='font-weight:bold;'>" + version + "</span> and in order for the new version to work, all profiles and settings must be reset. Sorry for any inconvenience.<br /><br/><a href='"+updateNotesURL+"' target='_blank'>See what's new</a>");
			}
			else{
				Dialog.show("update_dialog", "This script has recently been updated to version <span style='font-weight:bold;'>" + version + "</span><br /><br/><a href='"+updateNotesURL+"' target='_blank'>See what's new</a>");
			}
			
		} else {
			//UI.SuccessMessage("Welcome to LA Enhancer", 1000);
		}
	}

	function checkWorking(){
		var acknowledged = $.jStorage.get("working");
		if(acknowledged == null){
			$.jStorage.set("working", false);
		}
		if (getVersion() != version) {
			$.jStorage.set("working", false);
		}
		if (working == false && acknowledged == false) {
			buttons = [{
				text: 'OK',
				callback: null,
				confirm: true
			}];
			UI.ConfirmationBox("An error has been discovered in this version. You may continue testing the script if you haven't noticed the error.", buttons, false, []);
			$.jStorage.set("working", true);
		}
	}

	function setVersion(){
		$.jStorage.set("version", version);
	}

	function getVersion(){
		var ver = $.jStorage.get("version");
		if(ver == undefined){
			setVersion();
			return version;
		}
		return ver;
	}

	function setTWFilters(){
		if($('#all_village_checkbox').prop('checked') == true){
			$('#all_village_checkbox').click();
			doTime(100);
		}
		if($('#attacked_checkbox').prop('checked') == false){
			$('#attacked_checkbox').click();
			doTime(100);
		}
		if($('#full_hauls_checkbox').prop('checked') == true){
			$('#full_hauls_checkbox').click();
			doTime(100);
		}
		if($('#full_losses_checkbox').prop('checked') == false){
			$('#full_losses_checkbox').click();
			doTime(100);
		}
		if($('#partial_losses_checkbox').prop('checked') == false){
			$('#partial_losses_checkbox').click();
			doTime(100);
		}
	}

/***Auto page loading and settings creation***/
	function showAllRows() {
		var pages = $.trim($('#plunder_list_nav tr:first td:last').children().last().html().replace(/\D+/g, ''));
		if ($('#end_page').val() == "max") {
			$('#end_page').text(pages);
		}
		$('#am_widget_Farm tr:last').remove();
		if (pages > parseInt($('#end_page').val(), 10)) {
			pages = parseInt($('#end_page').val(), 10);
		}
		setTimeout(function() {
			getPage((parseInt($('#start_page').val(), 10) - 1), pages);
		}, 1);
	}

	function getPage(i, pages) {
		if (i < pages) {
			changeHeader(filter_41 + " " + (i + 1) + "/" + pages + " <img src='graphic/throbber.gif' height='24' width='24'></img>");
			$.get(link[0] + window.game_data.village.id + "&order=" + userset[s.order_by] + "&dir" + userset[s.direction] + "&Farm_page=" + i + "&screen=am_farm", function(data) {
				$('#plunder_list tr', data).slice(1).each(function() {
					$('#plunder_list tr:last').after("<tr>" + $(this).html() + "</tr>");
				});
				setTimeout(function(){ 
					getPage(i + 1, pages);
				}, 1);
			});
		} else {
			setTimeout(function() {
				addTableInfo();
				applyFilters();
				changeHeader(filter_40);
				highlightRows();
			}, 1);
			$('#plunder_list').show();
			Accountmanager.initTooltips();
			pagesLoaded = true;
			cansend = true;
		}
	}

	function changeHeader(string) {
		$("h3:first").html(string);
	}

	function highlightRows() {
		$('#am_widget_Farm table').each(function() {
			$('tr:even:gt(0) td', this).not("table:first").css("backgroundColor", "#FFF5DA");
			$('tr:odd:gt(0) td', this).not("table:first").css("backgroundColor", "#F0E2BE");
		});
	}

	function moreRowsTip() {
		if ($('#am_widget_Farm tr').length < 100) {
			$('#am_widget_Farm h4:first a').after("<-- " + instructions_06 + " -");
		}
	}

	/*function getNewVillage(way) {
		if(way == "n")
			UI.InfoMessage('Switching to next village...', 500);
		else
			UI.InfoMessage('Switching to previous village...', 500);
		window.onkeydown = function(){};
		cansend = false;
		filtersApplied = false;
		Timing.pause();
		fadeThanksToCheese();
		openLoader();
		var vlink = link[0] + way + window.game_data.village.id + link[1];
		console.log(vlink);
		$.ajax({
			type: "GET",
			url: vlink,
			error: function(xhr, statusText) {
				alert("Error: " + statusText);
				$('#fader').remove();
				$('#loaders').remove();
			},
			success: function(data) {
				var v = $(data);
				var title = data.split('<title>')[1].split('</title>')[0];
				window.game_data = $.parseJSON(data.split("var game_data = ")[1].split("};")[0] + "}");
				$('#header_info').html($('#header_info', v).html());
				$('#topContainer').html($('#topContainer', v).html());
				$('#contentContainer').html($('#contentContainer', v).html());
				$('#quickbar_inner').html($('#quickbar_inner', v).html());
				$('head').find('title').html(title);
				$('#fader').remove();
				$('#loaders').remove();
				Timing.resetTickHandlers();
				Timing.pause();
				pagesLoaded = false;
				cansend = false;
				run();
			}
		});
	}*/

	function getNewVillage(way){
		if(way == "n")
			UI.InfoMessage('Switching to next village...', 500);
		else
			UI.InfoMessage('Switching to previous village...', 500);
		window.onkeydown = function(){};
		cansend = false;
		filtersApplied = false;
		Timing.pause();
		var vlink = link[0] + way + window.game_data.village.id + link[1];
		window.location = vlink;
	}

	function getLootScreen(){
		
	}

	function showSettings(){
		//$('#plunder_list').hide();
		//$('#plunder_list_nav').hide();
		$('head').append("<link type='text/css' rel='stylesheet' href='" + scriptURL +"style.css' />");
		$("#contentContainer h3").eq(0).after($("<div class='vis'id='settingsDiv'><table class='settingsTable'><thead><tr><th colspan='5'class='vis'style='padding:0px;'><h4>" + filter_01 + " " + version + " - <a href='http://forum.tribalwars.net/showthread.php?266604-ntoombs19-s-FA-Filter'target='_blank'>" + filter_02 + "</a> - " + filter_42 + ": <select id='language'style='margin:0px;'onchange='loadLanguage($(&quot;#language&quot;).val())'></select><span style='font-size:10px;float:right;font-weight:normal;font-style:normal'>" + filter_03 + " <a href='http://forum.tribalwars.net/member.php?22739-ntoombs19'target='_blank'>ntoombs19</a>&nbsp;<div class='vis'style='float:right;text-align:center;line-height:100%;width:12px;height:12px;margin:0px 0px 0px 0px;position:relative;background-color:tan;opacity:.7'><a href='#'num='2'onclick='uglyHider($(this));return false;'>-</a></div></span></h4></th></tr></thead><tbody id='settingsBody'><tr><td class='col1'style='min-width:200px'><span>" + filter_04 + "</span>&nbsp;<input type='text'value=''size='1'maxlength='3'id='start_page'>&nbsp;<span>" + filter_05 + "</span>&nbsp;<input type='text'value=''size='1'maxlength='3'id='end_page'></td><td colspan='3'><span style='font-weight:bold'>" + filter_06 + "</span>&nbsp;<img src='graphic/questionmark.png'width='13'height='13'id='enable_help'></td><td rowspan='5'valign='top'><form><input type='checkbox'id='all_none'>&nbsp;<label for='all_none'style='font-weight:bold'>" + filter_07 + "</label>&nbsp;<img src='graphic/questionmark.png'width='13'height='13'id='report_help'><br><input type='checkbox'id='blue'><label for='blue'><img src='graphic/dots/blue.png'>&nbsp;" + filter_08 + "</label><br><input type='checkbox'id='green'><label for='green'><img src='graphic/dots/green.png'>&nbsp;" + filter_09 + "</label><br><input type='checkbox'id='yellow'><label for='yellow'><img src='graphic/dots/yellow.png'>&nbsp;" + filter_10 + "</label><br><input type='checkbox'id='red_yellow'><label for='red_yellow'><img src='graphic/dots/red_yellow.png'>&nbsp;" + filter_11 + "</label><br><input type='checkbox'id='red_blue'><label for='red_blue'><img src='graphic/dots/red_blue.png'>&nbsp;" + filter_12 + "</label><br><input type='checkbox'id='red'><label for='red'><img src='graphic/dots/red.png'>&nbsp;" + filter_13 + "</label></form></td></tr><tr><td rowspan='2'><label for='order_by'>" + filter_14 + ":</label>&nbsp;<select id='order_by'val='distance'><option value='distance'>" + filter_15 + "</option><option value='date'>" + filter_16 + "</option></select><br><label for='direction'>" + filter_17 + ":</label>&nbsp;<select id='direction'val='desc'><option value='asc'>" + filter_18 + "</option><option value='desc'>" + filter_19 + "</option></select></td><td style='width:26px'><input type='checkbox'id='enable_hauls'></td><td style='width:110px'><label for='enable_hauls'>" + filter_20 + "</label></td><td><input type='radio'name='hauls'id='full'><label for='full'><img src='graphic/max_loot/1.png'>" + filter_21 + "</label>&nbsp;<input type='radio'name='hauls'id='partial'><label for='partial'><img src='graphic/max_loot/0.png'>" + filter_22 + "</label></td></tr><tr><td><input type='checkbox'id='enable_attacks'></td><td><label for='enable_attacks'>" + filter_23 + "</label></td><td><select id='attack_operator'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='attack_value'size='1'maxlength='2'value=''></td></tr><tr><td rowspan='1'><span style='font-weight:bold;'>"+filter_43+"</span></td><td><input type='checkbox'id='enable_walls'></td><td><label for='enable_walls'>" + filter_30 + "</label></td><td><select id='wall_operator'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='wall_value'size='1'maxlength='2'value=''></td></tr><tr><td><input type='checkbox'id='next_village_no_farms'><label for='next_village_no_farms'>" + filter_39 + "</label></td><td><input type='checkbox'id='enable_distances'></td><td><label for='enable_distances'>" + filter_31 + "</label></td><td><select id='distance_operator'val='greater_than'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='distance_value'size='1'maxlength='2'value=''></td></tr><tr><td><input type='checkbox' id='next_village_units' />"+filter_44+"</td><td><input type='checkbox' id='enable_continents' /><td colspan='3'><select id='continent_display'><option value='hide'>" + filter_32 + "</option><option value='show'>" + filter_33 + "</option></select>&nbsp;<label for='continents_list'>" + filter_34 + "</label>&nbsp;<input type='text'size='1'maxlength='150'id='continents_list'value=''>&nbsp;<img src='graphic/questionmark.png'height='13'id='continent_help'></td></tr><tr><td><input type='checkbox' id='next_village_scouts' /><input type='text' size='1' id='scouts_left' /> "+filter_45+"</td><td><input type='checkbox'id='enable_scout'></td><td colspan='3'><label for='enable_scout'>" + filter_35 + "</label>&nbsp;<select id='scout_report_operator'val='greater_than'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='haul_value'size='9'maxlength='7'value=''></td></tr><tr><td><input type='checkbox' id='next_village_farming_troops' /><input type='text' size='1' id='farming_troops_left' /> "+filter_46+"</td><td><input type='checkbox'id='enable_time'></td><td colspan='3'><select id='attack_time_filter'val='hide'><option value='hide'>" + filter_32 + "</option><option value='show'>" + filter_33 + "</option></select>&nbsp;<label for='enable_time'>" + filter_36 + "</label>&nbsp;<input type='text'id='time_value'size='1'maxlength='4'value=''><span>" + filter_37 + "</span></td></tr><tr><td><input type='checkbox'id='enable_auto_run'><label for='enable_autoRun'>" + filter_38 + "</label></td><td><input type='checkbox' id='hide_recent_farms' /></td><td colspan='3'><select id='sent_time_filter'val='hide'><option value='hide'>" + filter_32 + "</option><option value='show'>" + filter_33 + "</option></select>&nbsp;"+filter_47+" <input type='text' size='1' id='hide_recent_time' /> "+filter_48+"</td></tr><tr><th>"+filter_49+"</th><th colspan='4'>"+filter_50+"</th></tr><tr><td rowspan='4'><table><tr class='hotkey_values'><td><a href='#'onclick='return setKeyEditMode(\"A\")'id='button_a'class='farm_icon farm_icon_a'></a></td><td><a href='#'onclick='return setKeyEditMode(\"B\")'id='button_b'class='farm_icon farm_icon_b'></a></td><td><a href='#'onclick='return setKeyEditMode(\"C\")'id='button_c'class='farm_icon farm_icon_c'></a></td><td><a href='#'onclick='return setKeyEditMode(\"Master\")'id='button_master'class='farm_icon farm_icon_m'></a></td></tr><tr class='hotkey_values'><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_a'value='A'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_b'value='B'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_c'value='C'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_master'value='M'></td></tr><tr class='hotkey_values'><td colspan='2'><input class='btn tooltip'onclick='return setKeyEditMode(\"Skip\")'type='button'value='Skip'style='margin:0px 0px 0px 0px'title='"+filter_51+"'></td><td><input class='btn tooltip'onclick='return setKeyEditMode(\"Left\")'type='button'value='⇚'style='margin:0px 0px 0px 0px'title='"+filter_52+"'></td><td><input class='btn tooltip'type='button'onclick='return setKeyEditMode(\"Right\")'value='⇛'style='margin:0px 0px 0px 0px'title='"+filter_53+"'></td></tr><tr class='hotkey_values'><td colspan='2'><input type='text'class='hotkey_value' READONLY id='hotkey_value_skip'value='S'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_left'value='&#8592;'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_right'value='&#8594;'></td></tr></table></td><td><input type='checkbox' onchange='return updateKeypressSettings();' id='priorityOneEnabled'/></td><td colspan='3'>"+filter_54+" <select id='priorityOneProfile' onchange='return updateKeypressSettings();'></select> "+filter_55+" <select id='priorityOneButton' onchange='return updateKeypressSettings();'><option val='"+filter_56+"'>"+filter_56+"</option><option val='"+filter_57+"'>"+filter_57+"</option><option val='"+filter_58+"'>"+filter_58+"</option><option val='"+filter_59+"'>"+filter_59+"</option></select></td></tr><tr><td><input type='checkbox' onchange='return updateKeypressSettings();' id='priorityTwoEnabled'/></td><td colspan='3'>"+filter_54+" <select id='priorityTwoProfile' onchange='return updateKeypressSettings();'></select> "+filter_55+" <select id='priorityTwoButton' onchange='return updateKeypressSettings();'><option val='"+filter_56+"'>"+filter_56+"</option><option val='"+filter_57+"'>"+filter_57+"</option><option val='"+filter_58+"'>"+filter_58+"</option><option val='"+filter_59+"'>"+filter_59+"</option></select></td></tr><tr><td><input type='checkbox' onchange='return updateKeypressSettings();' id='priorityThreeEnabled'/></td><td colspan='3'>"+filter_54+" <select id='priorityThreeProfile' onchange='return updateKeypressSettings();'></select> "+filter_55+" <select id='priorityThreeButton' onchange='return updateKeypressSettings();'><option val='"+filter_56+"'>"+filter_56+"</option><option val='"+filter_57+"'>"+filter_57+"</option><option val='"+filter_58+"'>"+filter_58+"</option><option val='"+filter_59+"'>"+filter_59+"</option></select></td></tr><tr><td colspan='4'>"+filter_60+" <select id='defaultButton' onchange='return updateKeypressSettings();'><option val='"+filter_56+"'>"+filter_56+"</option><option val='"+filter_57+"'>"+filter_57+"</option><option val='"+filter_58+"'>"+filter_58+"</option><option val='"+filter_59+"'>"+filter_59+"</option></select></td></tr><tr><td colspan='5'><div style='float:left'><input type='submit'value='" + profile_02 + "'onclick='applySettings()'>&nbsp;<input type='submit'value='" + profile_03 + "'onclick='resetTable()'></div><div style='float:right'><img src='graphic/questionmark.png'width='13'height='13'id='profile_help'>&nbsp;<label for='settingsProfile'>" + profile_01 + ":</label>&nbsp;<select id='settingsProfile'onchange='changeProfile($(&quot;#settingsProfile&quot;).val())'></select>&nbsp;<input type='submit'value='" + profile_04 + "'onclick='createProfile()'>&nbsp;<input type='submit'value='" + profile_05 + "'onclick='setDefaultProfile()'>&nbsp;<input type='submit'value='" + profile_06 + "'onclick='deleteProfile()'>&nbsp;<input type='submit'value='" + profile_07 + "'onclick='updateProfile()'>&nbsp;<input type='submit'value='" + profile_08 + "'onclick='exportProfile()'>&nbsp;<input type='submit'value='" + profile_09 + "'onclick='importProfile()'></div></td></tr></tbody></table></div>"));
		formatSettings();
		addLanguages();
		$("#language option[value='" + $.jStorage.get("language") + "']").attr("selected", "selected");
	}

	function formatSettings() {
		$("#all_none").bind("click", function() {
			$(this).closest('form').find(':checkbox').prop('checked', this.checked);
		});
		// report instructions
		var reportHelp = $('#report_help');
		reportHelp.attr('title', instructions_01);
		UI.ToolTip(reportHelp);
		// enable instrunctions
		var enableHelp = $('#enable_help');
		enableHelp.attr('title', instructions_02);
		UI.ToolTip(enableHelp);
		// continent instrunctions
		var continentHelp = $('#continent_help');
		continentHelp.attr('title', instructions_03);
		UI.ToolTip(continentHelp);
		// recent instrunctions
		var recentHelp = $('#recent_help');
		recentHelp.attr('title', instructions_04);
		UI.ToolTip(recentHelp);
		// profile instrunctions
		var profileHelp = $('#profile_help');
		profileHelp.attr('title', instructions_05);
		UI.ToolTip(profileHelp);
		loadDefaultProfile();
		fillProfileList();
		fillMasterSettings();
		fillKeypressSettings();
	}

	function removeFirstPage() {
	    $('#plunder_list tr:gt(0)').remove();
	    $('#plunder_list_nav').hide();
	}

/***Table formatting***/
	function customSendUnits(link, target_village, template_id, button) {
		if(!checkIfNextVillage()){
		    button.closest("tr").hide();
		    link = $(link);
		    if (link.hasClass('farm_icon_disabled')) return false;

		    var data = {
		        target: target_village,
		        template_id: template_id,
		        source: game_data.village.id
		    };
		    $.post(Accountmanager.send_units_link, data, function (data) {
		        if (data.error) {
		        	if(userset[s.next_village_units] && data.error === "Not enough units available"){
			        	if(cansend && filtersApplied)
							getNewVillage("n");
		        		return false;
		        	} else {
			            UI.ErrorMessage(data.error);
			            button.closest("tr").show();
			        }
		        } else {
		        	setLocalStorageRow(target_village);
		            //$('.farm_village_' + target_village).addClass('farm_icon_disabled');
					if (typeof $(button).prop('tooltipText') != 'undefined') {
						var buttext = $(button).prop('tooltipText');
					}
					var yolo = $('<div></div>').append($(buttext));
					var bolo = $(yolo).find('img[src*="res.png"]').eq(0).attr('src');
					var sep1 = buttext.split("<br />");
					sep1.splice(sep1.length - 2, 1);
					UI.SuccessMessage(sep1.join(" "), 200);
		            Accountmanager.farm.updateOwnUnitsAvailable(data.current_units);
		        }
		    }, 'json');
		    return false
		}
	}

	function customSendUnitsFromReport(link, target_village, report_id, button) {
		if(!checkIfNextVillage()){
			button.closest("tr").hide();
			link = $(link);
			if (link.hasClass('farm_icon_disabled')) return false;
			var data = {
				report_id: report_id
			};
			$.post(Accountmanager.send_units_link_from_report, data, function (data) {
				if (data.error) {
		        	if(userset[s.next_village_units] && data.error === "Not enough units available"){
		        		if(cansend && filtersApplied)
							getNewVillage("n");
		        		return false;
		        	} else {
			            UI.ErrorMessage(data.error);
			            button.closest("tr").show();
			        }
				} else {
		        	setLocalStorageRow(target_village);
					if (typeof data.success === 'string') {
						if (typeof $(button).prop('tooltipText') != 'undefined') {
							var buttext = $(button).prop('tooltipText');
						}
						var yolo = $('<div></div>').append($(buttext));
						var bolo = $(yolo).find('img[src*="res.png"]').eq(0).attr('src');
						var sep1 = buttext.split("<br />");
						sep1.splice(sep1.length - 2, 1);
						UI.SuccessMessage(sep1.join(" "), 200);
						Accountmanager.farm.updateOwnUnitsAvailable(data.current_units);
					};
					//$('.report_' + target_village + ' .farm_icon').addClass('farm_icon_disabled')
				}
			}, 'json');
		    return false
		}
	}

	function setOnclick(button){
		var clickFunction = button.find('a').attr('onclick');
		if(typeof clickFunction != 'undefined'){
			var parameters = clickFunction.slice(clickFunction.indexOf("(")+1,clickFunction.indexOf(")"));
			var eachParameter = parameters.split(",");
			if(clickFunction.indexOf("FromReport") == -1){
				button.find('a').attr('onclick', 'return customSendUnits('+parameters+', $(this))');
			}
			else{
				button.find('a').attr('onclick', 'return customSendUnitsFromReport('+parameters+'))');
			}
			button.closest('tr').attr('name', $.trim(eachParameter[1]));
		}
	}

	function addTableInfo(){
		var reportURL;
		$('#am_widget_Farm tr th').slice(0,1).after("<th></th>");
		$('#am_widget_Farm tr th').slice(7,8).before("<th><img src='http://dsen.innogamescdn.com/8.31/24103/graphic/buildings/main.png?8720a' /></th>");
		$('#am_widget_Farm tr:not(:first-child)').each(function(i){
			$(this).children("td").each(function(j) {
				switch(j){
					case 1:
						$(this).filter(":first").before("<td style='width:10px;font-weight:bold;' id='rowNum'>"+(i+1)+"</td>")
						break;
					case 3:	
						var attackImg = $(this).find('img');
						var tooltip= $(this).find('img').prop('tooltipText');
						if(typeof tooltip != 'undefined'){
							var numAttacks = tooltip.replace(/\D/g, '');
							attackImg.after("<span style='font-weight:bold;'> ("+numAttacks+")</span>");
						}
						reportURL = "http://" + window.location.host + $(this).find("a").attr('href');
						
						break;
					case 6:
						var wall = $(this).filter(":first");
						if(wall.html() != "?"){
							wall.before("<td id='buildings_"+(i+1)+"'><img src='http://dsen.innogamescdn.com/8.31/24103/graphic/buildings/main.png?8720a' /></td>");
						} else {
							wall.before("<td>?</td>");
						}
						var buildingID = $('#buildings_'+(i+1));
						$.ajax({
							type: "GET",
							url: reportURL,
							async: true,
							cache: false,
							success: function(data) {
								//creates the buindings object for that scout report
								var buildings = {};
								$('#attack_spy_buildings_left tr, #attack_spy_buildings_right tr', data).slice(1).each(function(j){
									var buildingName = $(this).find('td:eq(0) img').attr('src') + "";
									if(buildingName == "undefined"){
										return true;
									}
									buildingName = buildingName.split('/');
									buildingName = buildingName[buildingName.length - 1].split(".png")[0];
									buildings[buildingName] = $.trim($(this).find('td:eq(1)').html());
								});
								//builds the table to insert into the tooltip
								var $buildingString = $("<table><tr></tr><tr></tr></table>");
								$.each(buildings, function(key, value){
									$buildingString.find("tr:first").append("<td><img src='http://dsen.innogamescdn.com/8.31/24103/graphic/buildings/"+key+".png?8720a' /></td>");
									$buildingString.find("tr:last").append("<td>"+value+"</td>");
								});
								$buildingString.find("tr:first > td:even").css("background", "#FFF5DA");
								$buildingString.find("tr:last > td:even").css("background", "#FFF5DA");
								$buildingString.find("tr:first > td:odd").css("background", "#F4E4BC");
								$buildingString.find("tr:last > td:odd").css("background", "#F4E4BC");
								$buildingString.find("td").css("padding","2px");
								$buildingString.find("table").css({
									"border-spacing":"2px",
									"border-collapse": "separate"
								});
								buildingID.attr('title', $buildingString.html());
								UI.ToolTip(buildingID);
							}
						});
						break;
					case 10:
						setOnclick($(this));
						break;
					case 11:
						setOnclick($(this));
						break;
					case 12:
						setOnclick($(this));
						break;	
				}
			});
		});
	}

	function checkIfNextVillage(){
		current_units = Accountmanager.farm.current_units;
		if(userset[s.next_village_scouts]){
			var scouts = current_units.spy;
			if(scouts <= parseInt(userset[s.scouts_left])){
				getNewVillage("n");
				return true;
			}
		}
		if(userset[s.next_village_farming_troops]){
			var totalTroops = 0;
			$('.fm_unit input:checked').each(function(i){
				var unitName = $(this).attr('name');
				totalTroops += parseInt(current_units[unitName]);
			});
			if(totalTroops <= parseInt(userset[s.farming_troops_left])){
				getNewVillage("n");
				return true;
			}
		}
		if(userset[s.next_village_no_farms]){
			if($('#plunder_list tr:not(:first-child):visible').length == 0){
				getNewVillage("n");
				return true;
			}
		}
	}

	function getBuildingPoints(buildings){
		var pointTotal = 0;
		points = {
			main: [10,12,14,17,21,25,30,36,43,52,62,74,89,107,128,154,185,222,266,319,383,460,552,662,795,954,1145,1374,1648,1978],
			barracks: [16,19,23,28,33,40,48,57,69,83,99,119,143,171,205,247,296,355,426,511,613,736,883,1060,1272],
			stable: [20,24,29,35,41,50,60,72,86,103,124,149,178,214,257,308,370,444,532,639],
			garage: [24,29,35,41,50,60,72,86,103,124,149,178,214,257,308],
			church: [10,12,14],
			snob: [512,614,737],
			smith: [19,23,27,33,39,47,57,68,82,98,118,141,169,203,244,293,351,422,506,607],
			place: [0],
			statue: [24],
			market: [10,12,14,17,21,25,30,36,43,52,62,74,89,107,128,154,185,222,266,319,383,460,552,662,795],
			wood: [6,7,9,10,12,15,18,21,26,31,37,45,53,64,77,92,111,133,160,192,230,276,331,397,477,572,687,824,989,1187],
			stone: [6,7,9,10,12,15,18,21,26,31,37,45,53,64,77,92,111,133,160,192,230,276,331,397,477,572,687,824,989,1187],
			iron: [6,7,9,10,12,15,18,21,26,31,37,45,53,64,77,92,111,133,160,192,230,276,331,397,477,572,687,824,989,1187],
			farm: [5,6,7,9,10,12,15,18,21,26,31,37,45,53,64,77,92,111,133,160,192,230,276,331,397,477,572,687,824,989],
			storage: [6,7,9,10,12,15,18,21,26,31,37,45,53,64,77,92,111,133,160,192,230,276,331,397,477,572,687,824,989,1187],
			hide: [5,6,7,9,10,12,15,18,21,26],
			wall: [8,10,12,14,17,20,24,29,34,41,50,59,71,86,103,123,148,177,213,256]
		};
		$.each(buildings, function(key, value){
			pointTotal += parseInt(points[key][parseInt(value)-1]);
		});
		console.log(pointTotal);
		return pointTotal;
	}

/***Filtering table with settings***/
	function applySettings(){
		if(!pagesLoaded){
			moreRowsTip();
			setTimeout(showAllRows(), 1);
			removeFirstPage();
		}
		else{
			applyFilters();
		}
	}

	function applyFilters(){
		$('#am_widget_Farm tr:gt(0)').each(function(i) {
		    hideRow = checkRowToHide($(this), userset);
		    if(hideRow){
		    	$(this).hide();
		    }
		});
		changeHeader(filter_40);
		var topContainer = 0;
		if($('#topContainer').css('position') == "fixed"){
			topContainer = $('#topContainer').height();
		}
		if($('*:contains("Bot Protection")').length){
			$('html, body').animate({ scrollTop: ($('*:contains("Bot Protection")').offset().top - topContainer)},500);
			cansend = false;
		}else{
			$('html, body').animate({ scrollTop: ($('#farm_units').offset().top - topContainer)},500);
		}
		filtersApplied = true;
	}

	function checkRowToHide(row, profileArray){
		hideRow = false;
		row.children("td").each(function(cell){
		    switch (cell) {
		        case 2:
		        	reportSettings($(this), profileArray);
		            break;
		        case 3:
		        	haulSettings($(this), profileArray);
		            break;
		        case 4:
		    		hideRecentlyFarmed($(this), profileArray);
		        	attackSettings($(this), profileArray);
		        	continentSettings($(this), profileArray);
		            break;
		        case 5:
		        	hideTime($(this), profileArray);
		        	break;
		        case 6:
		        	scoutReportSettings($(this), profileArray);
		        	break;
		        case 7:
		        	wallSettings($(this), profileArray);
		        	break;
		        case 8:
		        	distanceSettings($(this), profileArray);
		        	break;
			}
	    });
		if(hideRow){
			if(troubleshoot)
				console.log(row.find("#rowNum").html() + ": (" + reason.join(',') + ")");
			reason = [];
			return true;
		}
		return false;
	}

	function resetTable(){
		$('#plunder_list tr').each(function(i) {
			$(this).show()
		});
	}

	function setLocalStorageRow(village){
		var localTitle = "sitter:"+sitter+", village:"+village+", world:"+getURL()[0];
		$.jStorage.set(localTitle, getCurrentGameTime());
	}

/***Settings logic***/
	function reportSettings(cell, profileArray){
		if (cell.html().indexOf("blue") >= 0 && profileArray[s.blue]){
			reason.push("Report is blue");
			hideRow = true;
			return;
		}
		if (cell.html().indexOf("green") >= 0 && profileArray[s.green]){
			reason.push("Report is green");
			hideRow = true;
			return;
		}
		if (cell.html().indexOf("yellow") >= 0 && profileArray[s.yellow]){
			reason.push("Report is yellow");
			hideRow = true;
			return;
		}
		if (cell.html().indexOf("red_yellow") >= 0 && profileArray[s.red_yellow]){
			reason.push("Report is red_yellow");
			hideRow = true;
			return;
		}
		if (cell.html().indexOf("red_blue") >= 0 && profileArray[s.red_blue]){
			reason.push("Report is red_blue");
			hideRow = true;
			return;
		}
		if (cell.html().indexOf("red") >= 0 && profileArray[s.red]){
			reason.push("Report is red");
			hideRow = true;
			return;
		}
	}

	function haulSettings(cell, profileArray){
		if(profileArray[s.enable_hauls]){
			// Hides full hauls
			if (cell.html().indexOf("max_loot/1") >= 0 && profileArray[s.full]){
				reason.push("Haul is full");
				hideRow = true;
				return;
			}
			// Hides partial hauls
			if (cell.html().indexOf("max_loot/0") >= 0 && profileArray[s.partial]){
				reason.push("Haul is partial");
				hideRow = true;
				return;
			}
			// Hides scout reports
			if (cell.html().indexOf("max_loot") == -1 && (profileArray[s.full])){
				reason.push("No haul graphic");
				hideRow = true;
				return;
			}
		}
	}

	function hideRecentlyFarmed(cell, profileArray){
		if(profileArray[s.hide_recent_farms]){
			var village = cell.closest('tr').attr('name');
			localTitle = "sitter:"+sitter+", village:"+village+", world:"+getURL()[0];
			var sentTime = new Date($.jStorage.get(localTitle));
			var t1 = currentGameTime;
			var t2 = sentTime;
			var dif = t1.getTime() - t2.getTime();
			var minutesBetween = Math.abs(parseInt(dif/1000/60));
			switch(profileArray[s.sent_time_filter]){
				case "hide":
					if(minutesBetween < parseInt(profileArray[s.hide_recent_time])){
						reason.push("Village was recently sent to " + minutesBetween + " minutes ago");
						hideRow = true;
						return;
					}
					break;
				case "show":
					if(minutesBetween > parseInt(profileArray[s.hide_recent_time])){
						reason.push("Village was not recently sent to");
						hideRow = true;
						return;
					}
					break;
			}
		}
	}

	function attackSettings(cell, profileArray){
		var numAttacks;
		var attackImg = cell.find('img');
		if(typeof attackImg.prop('tooltipText') != 'undefined'){
			numAttacks = attackImg.prop('tooltipText').replace(/\D/g, '');
		}
		else{
			numAttacks = 0;
		}
		if(profileArray[s.enable_attacks]){
			switch (profileArray[s.attack_operator]) { 
		        case "greater_than":
		        	if(numAttacks > profileArray[s.attack_value]){
		        		reason.push("Outgoing attacks is too many");
			        	hideRow = true;
			        	return;
		        	}
		            break;
		        case "less_than":
		        	if(numAttacks < profileArray[s.attack_value]){
						reason.push("Outgoing attacks is too few");
			        	hideRow = true;
			        	return;
		        	}
		            break;
		        case "equal_to":
		        	if(numAttacks == profileArray[s.attack_value]){
						reason.push("Outgoing attacks is equal");
			        	hideRow = true;
			        	return;
		        	}
		            break; 
			}
		}
	}

	function continentSettings(cell, profileArray){
		var continent = cell.find('a').html();
		if(typeof continent != 'undefined'){
			continent = continent.substr(continent.length - 2);
			var filteredContinents = profileArray[s.continents_list].split('.');
			if($.inArray(continent, filteredContinents) >= 0 && profileArray[s.continent_display] == "hide"){
				reason.push("Continent is set to hide");
				hideRow = true;
				return;
			}
			if($.inArray(continent, filteredContinents) == -1 && profileArray[s.continent_display] == "show"){
				reason.push("Continent is not set to show");
				hideRow = true;
				return;
			}
		}
	}

	function hideTime(cell, profileArray){
		if(profileArray[s.enable_time]){
			var t1 = currentGameTime;
			var t2 = getVillageAttackedTime(cell);
			var dif = t1.getTime() - t2.getTime();
			var minutesBetween = Math.abs(parseInt(dif/1000/60));
			switch (profileArray[s.attack_time_filter]) { 
				case "hide":
					if(minutesBetween < parseInt(profileArray[s.time_value])){
						reason.push("Not attacked recently enough");
						hideRow = true;
						return;
					}
					break;
				case "show":
					if(minutesBetween > parseInt(profileArray[s.time_value])){
						reason.push("Attacked too recently");
						hideRow = true;
						return;
					}
					break;
			}
		}
	}

	function scoutReportSettings(cell, profileArray){
		var total;
		if(profileArray[s.enable_scout]){
			if($.trim(cell.find('span').html()) == "?"){
				total = 0;
			}
			else{
				var wood = parseInt(cell.children('span').eq(0).html().replace(/\D+/g, ''));
				var clay = parseInt(cell.children('span').eq(1).html().replace(/\D+/g, ''));
				var iron = parseInt(cell.children('span').eq(2).html().replace(/\D+/g, ''));
				total = wood+clay+iron;
			}

			switch (profileArray[s.scout_report_operator]) { 
		        case "greater_than":
		        	if(total > parseInt(profileArray[s.haul_value])){	
						reason.push("Too many resources");
			        	hideRow = true;
			        	return;
		        	}
		            break;
		        case "less_than":
		        	if(total < parseInt(profileArray[s.haul_value])){
						reason.push("Not enough resources");
			        	hideRow = true;
			        	return;
		        	}
		            break;
		        case "equal_to":
		        	if(total == parseInt(profileArray[s.haul_value])){
						reason.push("Exact resources");
			        	hideRow = true;
			        	return;
		        	}
		            break; 
			}
		}
	}

	function wallSettings(cell, profileArray){
		if(profileArray[s.enable_walls]){
			var wallLvl = cell.html();
			if(wallLvl == '?'){
				wallLvl = 0;
			}
			switch ($.trim(profileArray[s.wall_operator])) { 
		        case "greater_than":
		        	if(wallLvl > profileArray[s.wall_value]){	
						reason.push("Wall too high");	
			        	hideRow = true;
			        	return;
		        	}
		            break;
		        case "less_than":
		        	if(wallLvl < profileArray[s.wall_value]){
						reason.push("Wall too low");
			        	hideRow = true;
			        	return;
		        	}
		            break;
		        case "equal_to":
		        	if(wallLvl == profileArray[s.wall_value]){
		        		reason.push("Wall is exact");
			        	hideRow = true;
			        	return;
		        	}
		            break; 
			}
		}
	}

	function distanceSettings(cell, profileArray){
		if(profileArray[s.enable_distances]){
			var distanceLvl = cell.html();
			switch ($.trim(profileArray[s.distance_operator])) { 
		        case "greater_than":
		        	if(parseFloat(distanceLvl) > parseFloat(profileArray[s.distance_value])){	
						reason.push("Village too far");	
			        	hideRow = true;
			        	return;
		        	}
		            break;
		        case "less_than":
		        	if(parseFloat(distanceLvl) < parseFloat(profileArray[s.distance_value])){
						reason.push("Village too close");
			        	hideRow = true;
			        	return;
		        	}
		            break;
		        case "equal_to":
		        	if(parseFloat(distanceLvl) == parseFloat(profileArray[s.distance_value])){
						reason.push("Village exact distance");
			        	hideRow = true;
			        	return;
		        	}
		            break; 
			}
		}
	}

	//deletes local storage for recently farmed rows
	function deleteRecentlyFarmed(){
		$('#am_widget_Farm tr:gt(0)').each(function(i) {
		    $(this).children("td").each(function(j){
		    	if(j == 4){
			    	reportLinkText = $.trim($(this).children("a").html());
					localTitle = "sitter:"+sitter+", village:"+reportLinkText+", world:"+getURL()[0];
					if($.jStorage.get(localTitle) != null){
						$.jStorage.deleteKey(localTitle);
					}
				}
		    });
		});
	}

	//gets game time to compare to reports
	function getCurrentGameTime(){
		var serverTime = $('#serverTime').html().split(':');
		var serverDate = $('#serverDate').html().split('/');	
		return new Date(serverDate[2], serverDate[1]-1, serverDate[0], serverTime[0], serverTime[1], serverTime[2], 0);
	}

	//helper function for time filters
	function getVillageAttackedTime(cell){
		var time = cell.html();
		var cellTime = time.split(' ');
		var attackDay;
		var attackTime;
		var cell;
		for (var i = 0; i < cellTime.length; i++){
			cell = $.trim(cellTime[i]);
			if(cell.indexOf('.') > -1){
				attackDay = cell;
			} else if (cell == filter_61){
				attackDay = filter_61;
			} else if (cell == filter_62){
				attackDay = filter_62;
			}
			if(cell.indexOf(':') > -1){
				attackTime = cell;
			}
		}
		if(attackDay == filter_61 || attackDay == filter_62){
			var day = currentGameTime.getDate();
			if(attackDay == filter_62)
				day--;
			var month = currentGameTime.getMonth();
			var year = currentGameTime.getFullYear();
			var time = attackTime.split(':');
			var hours = time[0];
			var minutes = time[1];
			var seconds = time[2];
			return new Date(year, month, day, hours, minutes, seconds, 0);
		}
		else{
			var cellDay = attackDay.split('.');
			var day = cellDay[1];
			var month = cellDay[0]-1;
			if(currentGameTime.getMonth() == 0 && month == 11)
				var year = currentGameTime.getFullYear()-1;
			else
				var year = currentGameTime.getFullYear();
			var time = attackTime.split(':');
			var hours = time[0];
			var minutes = time[1];
			var seconds = time[2];
			return new Date(year, month, day, hours, minutes, seconds, 0);
		}
	}

/***Profiles***/
	function loadDefaultProfile() {
		if ($.jStorage.get("profile:" + profile_10) == null) {
			$.jStorage.set("profile:" + profile_10, ["1", "1", "distance", "asc", false, false, false, false, false, false, false, false, "hide", "", false, false, false, false, "greater_than", "", false, "greater_than", "", false, "greater_than", "", false, "greater_than", "", "hide", "", false, "hide", "", false, false, false, "", false, "", false]);
			$.jStorage.deleteKey("profileList");
			$.jStorage.set("profileList", [profile_10]);
		}
		userset = $.jStorage.get("profile:" + profile_10);
		loadProfile(profile_10);
		$('#settingsProfile').val(profile_10);
	}

	function setDefaultProfile() {
		if ($('#settingsProfile').val() == profile_10) {
			var newProfile = confirm(dialog_02);
			if (newProfile) {
				createProfile();
				setDefaultProfile();
			} else {
				return false;
			}
		} else {
			var profile = $.jStorage.get("profile:" + $('#settingsProfile').val());
			$.jStorage.set("profile:" + profile_10, profile);
		}
	}

	function fillProfileList() {
		var profileList = $.jStorage.get("profileList");
		$.each(profileList, function(i, val) {
			$('#settingsProfile').append("<option value='" + val + "'>" + val + "</option>")
		});
		$('#settingsProfile').val($.jStorage.get("DefaultProfile"));
	}

	function createProfile() {
		var profileName = prompt(dialog_03 + ":");
		if ($.inArray(profileName, $.jStorage.get("profileList")) != -1) {
			alert(dialog_04);
			createProfile();
			return false;
		}
		if (profileName == "") {
			alert(dialog_05);
			createProfile();
			return false;
		}
		var profiles;
		if (profileName != null && profileName != "") {
			var settings = [];
			settings.push($('#start_page').val()); //0
			settings.push($('#end_page').val()); //1
			settings.push($('#order_by').val()); //2
			settings.push($('#direction').val()); //3
			settings.push($('#all_none').prop('checked')); //4
			settings.push($('#blue').prop('checked')); //5
			settings.push($('#green').prop('checked')); //6
			settings.push($('#yellow').prop('checked')); //7
			settings.push($('#red_yellow').prop('checked')); //8
			settings.push($('#red_blue').prop('checked')); //9
			settings.push($('#red').prop('checked')); //10
			settings.push($('#hide_recent_farms').prop('checked')); //11
			settings.push($('#sent_time_filter').val()); //12
			settings.push($('#hide_recent_time').val()); //13
			settings.push($('#enable_hauls').prop('checked')); //14
			settings.push($('#full').prop('checked')); //15
			settings.push($('#partial').prop('checked')); //16
			settings.push($('#enable_attacks').prop('checked')); //17
			settings.push($('#attack_operator').val());
			settings.push($('#attack_value').val());
			settings.push($('#enable_walls').prop('checked'));
			settings.push($('#wall_operator').val());
			settings.push($('#wall_value').val());
			settings.push($('#enable_distances').prop('checked'));
			settings.push($('#distance_operator').val());
			settings.push($('#distance_value').val());
			settings.push($('#enable_scout').prop('checked'));
			settings.push($('#scout_report_operator').val());
			settings.push($('#haul_value').val());
			settings.push($('#continent_display').val());
			settings.push($('#continents_list').val());
			settings.push($('#enable_time').prop('checked'));
			settings.push($('#attack_time_filter').val());
			settings.push($('#time_value').val());
			settings.push($('#enable_auto_run').prop('checked'));
			settings.push($('#next_village_no_farms').prop('checked'));
			settings.push($('#next_village_scouts').prop('checked'));
			settings.push($('#scouts_left').val());
			settings.push($('#next_village_farming_troops').prop('checked'));
			settings.push($('#farming_troops_left').val());
			settings.push($('#next_village_units').prop('checked'));
			$.jStorage.set("profile:" + profileName, settings);
			var profileList = $.jStorage.get("profileList");
			profileList.push(profileName);
			$.jStorage.set("profileList", profileList)
			$('#settingsProfile').append("<option value='" + profileName + "'>" + profileName + "</option>");

			$('#priorityOneProfile').append("<option value='" + profileName + "'>" + profileName + "</option>");
			$('#priorityTwoProfile').append("<option value='" + profileName + "'>" + profileName + "</option>");
			$('#priorityThreeProfile').append("<option value='" + profileName + "'>" + profileName + "</option>");

			$('#settingsProfile').val(profileName);
		}
	}

	function loadProfile(profile) {
		var settings = $.jStorage.get("profile:" + profile);
		userset = settings;
		$('#start_page').val(settings[0]);
		$('#end_page').val(settings[1]);
		$('#order_by').val(settings[2]);
		$('#direction').val(settings[3]);
		$('#all_none').prop('checked', settings[4]);
		$('#blue').prop('checked', settings[5]);
		$('#green').prop('checked', settings[6]);
		$('#yellow').prop('checked', settings[7]);
		$('#red_yellow').prop('checked', settings[8]);
		$('#red_blue').prop('checked', settings[9]);
		$('#red').prop('checked', settings[10]);
		$('#hide_recent_farms').prop('checked', settings[11]);
		$('#sent_time_filter').val(settings[12]);
		$('#hide_recent_time').val(settings[13]);
		$('#enable_hauls').prop('checked', settings[14]);
		$('#full').prop('checked', settings[15]);
		$('#partial').prop('checked', settings[16]);
		$('#enable_attacks').prop('checked', settings[17]);
		$('#attack_operator').val(settings[18]);
		$('#attack_value').val(settings[19]);
		$('#enable_walls').prop('checked', settings[20]);
		$('#wall_operator').val(settings[21]);
		$('#wall_value').val(settings[22]);
		$('#enable_distances').prop('checked', settings[23]);
		$('#distance_operator').val(settings[24]);
		$('#distance_value').val(settings[25]);
		$('#enable_scout').prop('checked', settings[26]);
		$('#scout_report_operator').val(settings[27]);
		$('#haul_value').val(settings[28]);
		$('#continent_display').val(settings[29]);
		$('#continents_list').val(settings[30]);
		$('#enable_time').prop('checked', settings[31]);
		$('#attack_time_filter').val(settings[32]);
		$('#time_value').val(settings[33]);
		$('#enable_auto_run').prop('checked', settings[34]);
		$('#next_village_no_farms').prop('checked', settings[35]);
		$('#next_village_scouts').prop('checked', settings[36]);
		$('#scouts_left').val(settings[37]);
		$('#next_village_farming_troops').prop('checked', settings[38]);
		$('#farming_troops_left').val(settings[39]);
		$('#next_village_units').prop('checked', settings[40]);
	}

	function changeProfile(profile) {
		loadProfile(profile);
		resetTable();
		applyFilters();
	}

	function deleteProfile() {
		var profileName = $('#settingsProfile').val();
		if (profileName == profile_10) {
			alert(dialog_06);
		} else {
			var profilesList = $.jStorage.get("profileList");
			profilesList.splice(profilesList.indexOf(profileName), 1);
			$.jStorage.set("profileList", profilesList);
			$.jStorage.deleteKey("profile:" + profileName);
			$("#settingsProfile option[value='" + profileName + "']").remove();
			$("#priorityOneProfile option[value='" + profileName + "']").remove();
			$("#priorityTwoProfile option[value='" + profileName + "']").remove();
			$("#priorityThreeProfile option[value='" + profileName + "']").remove();
			loadDefaultProfile(profile_10);
		}
	}

	function updateProfile() {
		var profileName = $('#settingsProfile').val();
		var settings = [];
		settings.push($('#start_page').val());
		settings.push($('#end_page').val());
		settings.push($('#order_by').val());
		settings.push($('#direction').val());
		settings.push($('#all_none').prop('checked'));
		settings.push($('#blue').prop('checked'));
		settings.push($('#green').prop('checked'));
		settings.push($('#yellow').prop('checked'));
		settings.push($('#red_yellow').prop('checked'));
		settings.push($('#red_blue').prop('checked'));
		settings.push($('#red').prop('checked'));
		settings.push($('#hide_recent_farms').prop('checked'));
		settings.push($('#sent_time_filter').val());
		settings.push($('#hide_recent_time').val());
		settings.push($('#enable_hauls').prop('checked'));
		settings.push($('#full').prop('checked'));
		settings.push($('#partial').prop('checked'));
		settings.push($('#enable_attacks').prop('checked'));
		settings.push($('#attack_operator').val());
		settings.push($('#attack_value').val());
		settings.push($('#enable_walls').prop('checked'));
		settings.push($('#wall_operator').val());
		settings.push($('#wall_value').val());
		settings.push($('#enable_distances').prop('checked'));
		settings.push($('#distance_operator').val());
		settings.push($('#distance_value').val());
		settings.push($('#enable_scout').prop('checked'));
		settings.push($('#scout_report_operator').val());
		settings.push($('#haul_value').val());
		settings.push($('#continent_display').val());
		settings.push($('#continents_list').val());
		settings.push($('#enable_time').prop('checked'));
		settings.push($('#attack_time_filter').val());
		settings.push($('#time_value').val());
		settings.push($('#enable_auto_run').prop('checked'));
		settings.push($('#next_village_no_farms').prop('checked'));
		settings.push($('#next_village_scouts').prop('checked'));
		settings.push($('#scouts_left').val());
		settings.push($('#next_village_farming_troops').prop('checked'));
		settings.push($('#farming_troops_left').val());
		settings.push($('#next_village_units').prop('checked'));
		$.jStorage.set("profile:" + profileName, settings);
		userset = settings;
	}

	function exportProfile() {
		var profileName = $('#settingsProfile').val();
		var settings = $.jStorage.get("profile:" + profileName);
		if (profileName == profile_10) {
			alert(dialog_07);
		} else {
			var profileSettings = prompt(dialog_08, dialog_09A + "" + profileName + "" + dialog_09B + "" + profileName + "," + settings + "" + dialog_09C);
		}
	}

	function importProfile() {
		var profileSettings = prompt(dialog_10 + ":", dialog_11);
		profileSettings = profileSettings.split(",");
		var profileName = profileSettings[0];
		profileSettings.shift();
		var profileList = $.jStorage.get("profileList");
		if ($.inArray(profileName, profileList) != -1) {
			alert(dialog_12);
			return false;
		} else {
			for (i = 0; i <= profileSettings.length; i++) {
				if (profileSettings[i] === "false" || profileSettings[i] === "true") {
					profileSettings[i] = parseBool(profileSettings[i]);
				}
			}
			$.jStorage.set("profile:" + profileName, profileSettings);
			profileList.push(profileName);
			$.jStorage.set("profileList", profileList);
			$('#settingsProfile').append("<option value='" + profileName + "'>" + profileName + "</option>");
			$('#settingsProfile').val(profileName);
			loadProfile(profileName);
		}
	}

/***Key Commands***/
	$(document).off();
	function hotkeysOnOff(){
		$('#settingsBody tr:lt(9) input,#settingsBody tr:lt(9) select').focusin(function(){
			window.onkeydown = function(){};
		});
		$('#settingsBody tr:lt(9) input,#settingsBody tr:lt(9) select').focusout(function(){
			turnOnHotkeys();
		});
	}

	function turnOnHotkeys(){
		window.onkeydown = function(e){
			if(editingKey){
				console.log("changing");
				editKey(e);
			} else {
				var row = $("#plunder_list tr").filter(":visible").eq(1);
				var aButton = row.children("td").eq(9).children("a");
				var bButton = row.children("td").eq(10).children("a");
				var cButton = row.children("td").eq(11).children("a");
			    switch(e.which) {
			        case keycodes.a: // a
			        	tryClick(aButton);
			        	break;
			        case keycodes.b: // b
			        	tryClick(bButton);
			        	break;
			        case keycodes.c: // c
			        	tryClick(cButton);
			        	break;
			        case keycodes.skip: // s
			        	row.hide();
			        	break;
			        case keycodes.master: // m
			        	if(cansend && filtersApplied)
			        		selectMasterButton(row);
			        	break;
			        case keycodes.left: // left
						getNewVillage("p");
			        	break;
			        case keycodes.right: // right
						getNewVillage("n");
			        	break;
			        default: return; // exit this handler for other keys
			    }
			}
		    e.preventDefault(); // prevent the default action (scroll / move caret)
		};
	}

	function tryClick(button){
		if(cansend && filtersApplied){
			if(!checkIfNextVillage()){
				if(button.hasClass("farm_icon_disabled") || button.html() == undefined ){
					UI.ErrorMessage("That button is not selectable. Skipping row...", 500);
					button.closest('tr').hide();
				}
				else{
					button.click();
					if(userset[s.next_village_scouts] || userset[s.next_village_farming_troops]){
						console.log("400");
						doTime(400);
					} else {
						console.log("201");
						doTime(201);
					}
				}
			}
		}
	}

	function doTime(millsec) {
		cansend = false;
		setTimeout(function() {
			cansend = true;
		}, millsec);
	}

	function editKey(e){
		if((e.keyCode <= 37 && e.keyCode >=40) || (e.keyCode <= 48 && e.keyCode >= 90)){
			UI.ErrorMessage("You can only enter letters, numbers, or arrows. Plese try another key.", 1500);
		} else {
			var keyToChar = String.fromCharCode(e.keyCode);
			if(e.keyCode == 37){keyToChar = "←";}
			if(e.keyCode == 38){keyToChar = "↑";}
			if(e.keyCode == 39){keyToChar = "→";}
			if(e.keyCode == 40){keyToChar = "↓";}

			switch(keyToEdit){
				case "A": //A
					keycodes.a = e.keyCode;
					$("#hotkey_value_a").val(keyToChar);
					break;
				case "B": //B
					keycodes.b = e.keyCode;
					$("#hotkey_value_b").val(keyToChar);
					break;
				case "C": //C
					keycodes.c = e.keyCode;
					$("#hotkey_value_c").val(keyToChar);
					break;
				case "Master": //Master
					keycodes.master = e.keyCode;
					$("#hotkey_value_master").val(keyToChar);
					break;
				case "Skip": //Skip
					keycodes.skip = e.keyCode;
					$("#hotkey_value_skip").val(keyToChar);
					break;
				case "Left": //Left
					keycodes.left = e.keyCode;
					$("#hotkey_value_left").val(keyToChar);
					break;
				case "Right": //Right
					keycodes.right = e.keyCode;
					$("#hotkey_value_right").val(keyToChar);
					break;
				default: return;
			}
			UI.SuccessMessage(keyToChar + " is now mapped to the " + keyToEdit + " button.");
			updateKeypressSettings();
			editingKey = false;
		}
	}

	function updateKeypressSettings(){
		keyPressSettings.a_code = keycodes.a;
		keyPressSettings.a_char = $("#hotkey_value_a").val();
		keyPressSettings.b_code = keycodes.b;
		keyPressSettings.b_char = $("#hotkey_value_b").val();
		keyPressSettings.c_code = keycodes.c;
		keyPressSettings.c_char = $("#hotkey_value_c").val();
		keyPressSettings.master_code = keycodes.master;
		keyPressSettings.master_char = $("#hotkey_value_master").val();
		keyPressSettings.skip_code = keycodes.skip;
		keyPressSettings.skip_char = $("#hotkey_value_skip").val();
		keyPressSettings.left_code = keycodes.left;
		keyPressSettings.left_char = $("#hotkey_value_left").val();
		keyPressSettings.right_code = keycodes.right;
		keyPressSettings.right_char = $("#hotkey_value_right").val();
		keyPressSettings.priorityOneEnabled = $('#priorityOneEnabled').prop('checked');
		keyPressSettings.priorityOneProfile = $('#priorityOneProfile').val();
		keyPressSettings.priorityOneButton = $('#priorityOneButton').val();
		keyPressSettings.priorityTwoEnabled = $('#priorityTwoEnabled').prop('checked');
		keyPressSettings.priorityTwoProfile = $('#priorityTwoProfile').val();
		keyPressSettings.priorityTwoButton = $('#priorityTwoButton').val();
		keyPressSettings.priorityThreeEnabled = $('#priorityThreeEnabled').prop('checked');
		keyPressSettings.priorityThreeProfile = $('#priorityThreeProfile').val();
		keyPressSettings.priorityThreeButton = $('#priorityThreeButton').val();
		keyPressSettings.defaultButton = $('#defaultButton').val();
		$.jStorage.set("keyPressSettings",keyPressSettings);
	}

	function fillKeypressSettings(){
		if($.jStorage.get('keyPressSettings') == null){
			$.jStorage.set('keyPressSettings', keyPressSettings);
		}
		keyPressSettings = $.jStorage.get('keyPressSettings');
		keycodes.a = keyPressSettings.a_code;
		$("#hotkey_value_a").val(keyPressSettings.a_char);
		keycodes.b = keyPressSettings.b_code;
		$("#hotkey_value_b").val(keyPressSettings.b_char);
		keycodes.c = keyPressSettings.c_code;
		$("#hotkey_value_c").val(keyPressSettings.c_char);
		keycodes.master = keyPressSettings.master_code;
		$("#hotkey_value_master").val(keyPressSettings.master_char);
		keycodes.skip = keyPressSettings.skip_code;
		$("#hotkey_value_skip").val(keyPressSettings.skip_char);
		keycodes.left = keyPressSettings.left_code;
		$("#hotkey_value_left").val(keyPressSettings.left_char);
		keycodes.right = keyPressSettings.right_code;
		$("#hotkey_value_right").val(keyPressSettings.right_char);
		$('#priorityOneEnabled').prop('checked', keyPressSettings.priorityOneEnabled);
		$('#priorityOneProfile').val(keyPressSettings.priorityOneProfile);
		$('#priorityOneButton').val(keyPressSettings.priorityOneButton);
		$('#priorityTwoEnabled').prop('checked', keyPressSettings.priorityTwoEnabled);
		$('#priorityTwoProfile').val(keyPressSettings.priorityTwoProfile);
		$('#priorityTwoButton').val(keyPressSettings.priorityTwoButton);
		$('#priorityThreeEnabled').prop('checked', keyPressSettings.priorityThreeEnabled);
		$('#priorityThreeProfile').val(keyPressSettings.priorityThreeProfile);
		$('#priorityThreeButton').val(keyPressSettings.priorityThreeButton);
		$('#defaultButton').val(keyPressSettings.defaultButton);
	}

	function setKeyEditMode(n){
		editingKey = true;
		keyToEdit = n;
		UI.InfoMessage("Press any number, letter, or arrow key to set the hotkey for the <span style='font-weight:bold;'>" + n + "</span> button", 1500);
		return false;
	}

	function fillMasterSettings(){
		var profileList = $.jStorage.get("profileList");
		$.each(profileList, function(i, val) {
			$('#priorityOneProfile').append("<option value='" + val + "'>" + val + "</option>");
			$('#priorityTwoProfile').append("<option value='" + val + "'>" + val + "</option>");
			$('#priorityThreeProfile').append("<option value='" + val + "'>" + val + "</option>");
		});
	}

	function selectMasterButton(row){
		var buttonToClick;
		var p1 = $.jStorage.get("profile:" + keyPressSettings.priorityOneProfile);
		var p2 = $.jStorage.get("profile:" + keyPressSettings.priorityTwoProfile);
		var p3 = $.jStorage.get("profile:" + keyPressSettings.priorityThreeProfile);
		var aButton = row.children("td").eq(9).children("a");
		var bButton = row.children("td").eq(10).children("a");
		var cButton = row.children("td").eq(11).children("a");
		buttonToClick = keyPressSettings.defaultButton;
		if(keyPressSettings.priorityThreeEnabled && !checkRowToHide(row, p3)){
			buttonToClick = keyPressSettings.priorityThreeButton;
		}
		if(keyPressSettings.priorityTwoEnabled && !checkRowToHide(row, p2)){
			buttonToClick = keyPressSettings.priorityTwoButton;
		}
		if(keyPressSettings.priorityOneEnabled && !checkRowToHide(row, p1)){
			buttonToClick = keyPressSettings.priorityOneButton;
		}
		switch(buttonToClick){
			case "A":
				tryClick(aButton);
				break;
			case "B":
				tryClick(bButton);
				break;
			case "C":
				tryClick(cButton);
				break;
			default:
				row.hide();
				break;
		}
	}

/***Language***/
	function setDefaultLanguage() {
		var url = getURL();
		if(url.length == 3)
			url.shift();
		var domain = url.join('.');
		switch (domain) {
			//case "die-staemme.de", "staemme.ch":
			//	$.jStorage.set("language", "de");//german
			//	break;
			//case "tribalwars.nl":
			//	$.jStorage.set("language", "nl");//dutch
			//	break;
			//case "plemiona.pl":
			//	$.jStorage.set("language", "pl");//polish
			//	break;
			//case "tribalwars.se":
			//	$.jStorage.set("language", "sv");//swedish
			//	break;
			//case "tribalwars.com.br", "tribalwars.com.pt":
			//	$.jStorage.set("language", "pt");//portuguese
			//	break;
			//case "divokekmeny.cz":
			//	$.jStorage.set("language", "cs");//czech
			//	break;
			//case "bujokjeonjaeng.org":
			//	$.jStorage.set("language", "ko");//korean
			//	break;
			//case "triburile.ro":
			//	$.jStorage.set("language", "ro");//romanian
			//	break;
			//case "voyna-plemyon.ru":
			//	$.jStorage.set("language", "ru");//russian
			//	break;
			//case "fyletikesmaxes.gr":
			//	$.jStorage.set("language", "el");//greek
			//	break;
			//case "tribalwars.no.com":
			//	$.jStorage.set("language", "no");//norwegian
			//	break;
			//case "divoke-kmene.sk":
			//	$.jStorage.set("language", "sk");//slovak
			//	break;
			//case "klanhaboru.hu":
			//	$.jStorage.set("language", "hu");//hungarian
			//	break;
			//case "tribalwars.dk":
			//	$.jStorage.set("language", "da");//danish
			//	break;
			//case "tribals.it":
			//	$.jStorage.set("language", "it");//italian
			//	break;
			//case "klanlar.org":
			//	$.jStorage.set("language", "tr");//turkish
			//	break;
			//case "guerretribale.fr":
			//	$.jStorage.set("language", "fr");//french
			//	break;
			//case "guerrastribales.es":
			//	$.jStorage.set("language", "es");//spanish
			//	break;
			//case "tribalwars.fi":
			//	$.jStorage.set("language", "fi");//finnish
			//	break;
			//case "tribalwars.ae":
			//	$.jStorage.set("language", "ar");//arabic
			//	break;
			//case "vojnaplemen.si":
			//	$.jStorage.set("language", "sl");//slovene
			//	break;
			//case "genciukarai.lt":
			//	$.jStorage.set("language", "lt");//lithuanian
			//	break;
			//case "plemena.com":
			//	$.jStorage.set("language", "hr");//croatian
			//	break;
			//case "perangkaum.net":
			//	$.jStorage.set("language", "id");//indonesian
			//	break;
			//case "tribalwars.asia":
			//	$.jStorage.set("language", "th");//thai
			//	break;
			default:
				$.jStorage.set("language", "en");//english
				break;
		}
	}

	function loadLanguage(lang) {
		$.jStorage.set("language", lang);
		var profileList = $.jStorage.get("profileList");
		var defaultProfile = $.jStorage.get("profile:" + profile_10);
		if($.inArray(lang, availableLangs) < 0){
			lang = "en";
		}
		var langFile = scriptURL + "lang/" + lang + ".js";
		$.getScript(langFile, function() {
			$('#settingsDiv').remove();
			profileList[0] = profile_10;
			$.jStorage.set("profileList", profileList);
			$.jStorage.set("profile:" + profile_10, defaultProfile);
			changeHeader(filter_40);
			showSettings();
		});
	}

	function addLanguages() {
		$('#language').append("<option value='en'>English</option>");
		//$('#language').append("<option value='de'>Deutsch</option>");
		//$('#language').append("<option value='nl'>Nederlands</option>");
		//$('#language').append("<option value='pl'>polszczyzna</option>");
		//$('#language').append("<option value='sv'>Svensk</option>");
		//$('#language').append("<option value='pt'>Português</option>");
		//$('#language').append("<option value='cs'>Čeština</option>");
		//$('#language').append("<option value='ko'>한국어</option>");
		//$('#language').append("<option value='ro'>Русский</option>");
		//$('#language').append("<option value='el'>Ελληνικά</option>");
		//$('#language').append("<option value='no'>Norsk</option>");
		//$('#language').append("<option value='sk'>Slovenčina</option>");
		//$('#language').append("<option value='hu'>Magyar</option>");
		//$('#language').append("<option value='da'>Dansk</option>");
		//$('#language').append("<option value='it'>Italiano</option>");
		//$('#language').append("<option value='tr'>Türkçe</option>");
		//$('#language').append("<option value='fr'>Français</option>");
		$('#language').append("<option value='es'>Español</option>");
		//$('#language').append("<option value='fi'>finnish</option>");
		//$('#language').append("<option value='ar'>اللغة العربية</option>");
		//$('#language').append("<option value='sl'>Slovenščina</option>");
		//$('#language').append("<option value='lt'>Lietuvių</option>");
		//$('#language').append("<option value='hr'>Hrvatski</option>");
		//$('#language').append("<option value='id'>Bahasa Indonesia</option>");
		//$('#language').append("<option value='th'>ภาษาไทย</option>");
	}

/***Helpers***/
	function parseBool(value) {
	    return (typeof value === "undefined") ? 
	           false : 
	           // trim using jQuery.trim()'s source 
	           value.replace(/^\s+|\s+$/g, "").toLowerCase() === "true";
	}

	function getURL() {
		var domain = window.location.hostname;
		domain = domain.split('.');
		return domain;
	}

	function checkPage() {
		if (!(window.game_data.screen === 'am_farm')) {
			getFA();
		} else{
			run();
		}
	}
	/*
	function getFA() {
		fadeThanksToCheese();
		openLoader();
		var vlink = link[0] + window.game_data.village.id + link[1];
		$.getScript("http://" + window.location.host + "/js/game/Accountmanager.js", function() {
		//$.getScript(scriptURL + "Accountmanager.js", function() {
			$.ajax({
				type: "GET",
				url: vlink,
				error: function(xhr, statusText) {
					alert("Error: " + statusText);
					$('#fader').remove();
					$('#loaders').remove();
				},
				success: function(data) {
					var v = $(data);
					var title = data.split('<title>')[1].split('</title>')[0];
					window.game_data = $.parseJSON(data.split("var game_data = ")[1].split("};")[0] + "}");
					$('#header_info').html($('#header_info', v).html());
					$('#topContainer').html($('#topContainer', v).html());
					$('#contentContainer').html($('#contentContainer', v).html());
					$('head').find('title').html(title);
					$('#fader').remove();
					$('#loaders').remove();
					run();
				}
			});
		});
	}
	*/
	function getFA(){
		fadeThanksToCheese();
		openLoader();
		var vlink = link[0] + window.game_data.village.id + link[1];
		window.location = vlink;
	}

	function fadeThanksToCheese() {
		var fader = document.createElement('div');
		fader.id = 'fader';
		fader.style.position = 'fixed';
		fader.style.height = '100%';
		fader.style.width = '100%';
		fader.style.backgroundColor = 'black';
		fader.style.top = '0px';
		fader.style.left = '0px';
		fader.style.opacity = '0.6';
		fader.style.zIndex = '12000';
		document.body.appendChild(fader);
	}

	function openLoader() {
		var widget = document.createElement('div');
		widget.id = 'loaders';
		widget.style.position = 'fixed';
		widget.style.width = '24px';
		widget.style.height = '24px';
		widget.style.top = '50%';
		widget.style.left = '50%';
		$(widget).css("margin-left", "-12px");
		$(widget).css("margin-top", "-12px");
		widget.style.zIndex = 13000;
		$(widget).append($("<img src='graphic/throbber.gif' height='24' width='24'></img>"));
		$('#contentContainer').append($(widget));
	}

	function makeItPretty() {
		$('.row_a').css("background-color", "rgb(216, 255, 216)");
		$('#plunder_list').find('tr:gt(0)').each(function(index) {
			$(this).removeClass('row_a');
			$(this).removeClass('row_b');
			if (index % 2 == 0) {
				$(this).addClass('row_a');
			} else {
				$(this).addClass('row_b');
			}
		});
		hideStuffs();
	}

	function hideStuffs() {
		$('#plunder_list').hide();
		$('#plunder_list_nav').hide();
		$('#contentContainer').find('div[class="vis"]').eq(0).children().eq(0).append($("<div class='vis' style='float:right;text-align:center;line-height:100%;width:12px;height:12px;margin:0px 0px 0px 0px;position:relative;background-color:tan;opacity:.7'><a href='#' num='0' onclick='uglyHider($(this));return false;'>+</a></div>"));
		$('#contentContainer').find('div[class="vis"]').eq(0).children().eq(1).hide();
		$('#am_widget_Farm').find('h4').eq(0).append($("<div class='vis' style='float:right;text-align:center;line-height:100%;width:12px;height:12px;margin:0px 0px 0px 0px;position:relative;background-color:tan;opacity:.7'><a href='#' num='1' onclick='uglyHider($(this));return false;'>+</a></div>"));
		$('#plunder_list_filters').hide();
	}

	function uglyHider(linker) {
		var basd;
		if ($('#settingsBody').length > 0) {
			basd = 2;
		} else {
			basd = 1;
		}
		if ($(linker).text() === "+") {
			$(linker).text("-");
		} else {
			$(linker).text("+");
		}
		if (parseInt($(linker).attr('num')) == 0) {
			$('#contentContainer').find('div[class="vis"]').eq(basd).children().eq(1).toggle();
		} else if (parseInt($(linker).attr('num')) == 1) {
			$('#plunder_list_filters').toggle();
		} else if (parseInt($(linker).attr('num')) == 2){
			$('#settingsBody').toggle();
		}
	}
