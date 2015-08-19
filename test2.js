/*** Global Variables ***************/
	var version = "1.11";
	var sitter = (window.game_data.player.sitter != "0") ? "t=" + window.game_data.player.id + "&" : "";
	var link = ["http://" + window.location.host + "/game.php?" + sitter + "village=", "&screen=am_farm"];
	var scriptURL = "https://dl.dropboxusercontent.com/u/26362756/laEnhancer/";
	//var isMobile = $("#mobileHeader").length > 0;
	var currentGameTime = getCurrentGameTime();
	var reports, reportBuildings, villageAttacks, profiles, settings;
	var lastAjaxCall = "pages";
	var getBuildings = false;
	var editingKey = false;
	var typing = false;
	var keyToEdit;
	var scriptSettings;

	var keycodes = {
	    "a": 65,
	    "b": 66,
	    "c": 67,
	    "skip": 83,
	    "right": 39,
	    "left": 37,
	    "master": 77
	};
/*** Main ***************************/
	$.getScript(scriptURL + "resources2.js", function() {
		reportBuildings = TAFFY();
		reportBuildings.store("reportBuildings");
		villageAttacks = TAFFY();
		villageAttacks.store("villageAttacks");
		profiles = TAFFY();
		profiles.store("profiles");
		//profiles().remove();
		settings = TAFFY();
		settings.store("settings");
		//settings().remove();
	    checkPage();
	});
	function run() {
		showSettings();
	    loadPagesIntoLocalStorage();
		turnOnHotkeys();
		hotkeysOnOff();
	}
	function checkPage() {
	    if (window.game_data.screen != 'am_farm') {
	        loadLA()
	    } else {
	        run();
	    }
	}
	function loadLA() {
	    fadeToBlack();
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
/*** Page Loading and Data Mining ***/
	function loadPagesIntoLocalStorage() {
	    reports = TAFFY();
	    var lastPageNumber = parseInt($('.paged-nav-item:last').html().replace(/\D/g, ''));
	    var start_page = scriptSettings.start_page-1;
	    var end_page = scriptSettings.end_page;
	    if(end_page == "max"){
	    	end_page = lastPageNumber;
	    }
	    removeFirstPage();
	    for (var i = start_page; i < end_page; i++) {
	        $.ajax({
	            type: "GET",
	            url: link[0] + window.game_data.village.id + "&order=distance&dir=asc&Farm_page=" + i + "&screen=am_farm",
	            async: true,
	            success: function(data) {
	            	console.log("page: " + i);
	                desktopTableExtract(data);
	            }
	        });
	    }
	}
	//$(document).off();
	$(window).ajaxStop(function() {
		console.log("Ajax done");
		if(lastAjaxCall == "pages"){
			var buildings = "";
			var points = "";
			if(getBuildings){
		    	buildings = "<th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/main.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/barracks.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/stable.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/garage.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/snob.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/smith.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/statue.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/market.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/wood.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/stone.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/iron.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/farm.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/storage.png?8720a'></a></th><th><a href=''><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/hide.png?8720a'></a></th>";
				points = "<th><a href='#sort' class='desc' onclick='sortByColumn(\"points\", this)'>Points</a></th>";
			}
		    $("#am_widget_Farm").append("<div class='body'><table id='plunder_list' style='width:100%;'><th></th><th></th><th>Village</th><th><a href='#sort' class='desc' onclick='sortByColumn(\"attacks\", this)'><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/command/attack.png?6d2c9'></a></th><th><a href='#sort' class='desc' onclick='sortByColumn(\"plunderTime\", this)'>Landed</a></th><th><a href='#sort' class='desc' onclick='sortByColumn(\"sentTime\", this)'>Sent</a></th><th><a href='#sort' class='desc' onclick='sortByColumn(\"wood\", this)'><span class='icon header wood' title='Wood'></span></a></th><th><a href='#sort' class='desc' onclick='sortByColumn(\"clay\", this)'><span class='icon header stone' title='Stone'></span></a></th><th><a href='#sort' class='desc' onclick='sortByColumn(\"iron\", this)'><span class='icon header iron' title='Iron'></span></a></th>"+buildings+"<th><a href='#sort' class='desc' onclick='sortByColumn(\"wall\", this)'><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/buildings/wall.png?8720a'></a></th>"+points+"<th><a href='#sort' class='desc' onclick='sortByColumn(\"distance\", this)'><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/rechts.png?d8153'></a></th><th></th><th></th><th></th><th></th></table></div>");
		    createNewTable("distance", "asc");	

	    	$("#am_widget_Farm").show();
		}
		if(lastAjaxCall == "sendUnits"){
			return false;
		}
	});
	function desktopTableExtract(data) {
	    var rows = $("#plunder_list > tbody > tr", data);
	    for (var r = 1; r < rows.length; r++) {
	        var cells = $(rows[r]).find("td");
	        for (var c = 0; c < cells.length; c++) {
	            var cell = $(cells[c]);
	            switch (c) {
	                case 1: //report color
	                    var dot = cell.find("img").attr("src").split('/');
	                    dot = dot[dot.length - 1].split(".png")[0];
	                    break;
	                case 2: //full or partial loot
	                    var loot = cell.find("img");
	                    if (loot.length > 0) {
	                        loot = loot.attr("src").split('/');
	                        loot = parseInt(loot[loot.length - 1].split(".png")[0]);
	                    } else {
	                        loot = null;
	                    }
	                    break;
	                case 3: //village coordinates and report id
	                    var village = $.trim(cell.find("a").html());
	                    var reportID = getUrlParameter(cell.find("a").attr("href"), "view");
	                    var numAttacks = cell.find('img').prop('title');
	                    numAttacks = parseInt((numAttacks != undefined) ? numAttacks.replace(/\D/g, '') : 0);
	                    var continent = parseInt(cell.find("a").html().split("K")[1]);
	                    break;
	                case 4: //plunder
	                    var plunderTime = getVillageAttackedTime(cell);
	                    var timeSincePlunder = showTimeSincePlunder(plunderTime);
	                    break;
	                case 5: //resources
	                    var spans = cell.children("span")
	                    if (spans.length == 3) {
	                        var wood = parseInt($($(spans.get(0)).children("span").get(1)).html().replace(/\D/g, ''));
	                        var clay = parseInt($($(spans.get(1)).children("span").get(1)).html().replace(/\D/g, ''));
	                        var iron = parseInt($($(spans.get(2)).children("span").get(1)).html().replace(/\D/g, ''));
	                        var resources = wood+clay+iron;
	                    } else {
	                        var wood = -1;
	                        var clay = -1;
	                        var iron = -1;
	                    }
	                    break;
	                case 6: //wall
	                    var wall = parseInt(cell.html());
	                    wall = isNaN(wall) ? -1 : wall;
	                    break;
	                case 7: //distance
	                    var distance = parseFloat(cell.html());
	                    break;
	                case 8: //aButton
	                    var aButton = cell.html();
	                	var villageToAttack = cell.find("a").attr("onclick");
	                	villageToAttack = $.trim(villageToAttack.slice(villageToAttack.indexOf("(")+1,villageToAttack.indexOf(")")).split(",")[1]);
	                    var sentTime = villageAttacks({villageID:parseInt(villageToAttack)}).first();
	                    sentTime = new Date(sentTime["sentTime"]);
	                    sentTime = sentTime.getFullYear()+","+(sentTime.getMonth()+1)+","+(sentTime.getDay()+1)+","+sentTime.getHours()+","+sentTime.getMinutes()+","+sentTime.getSeconds();

	                    var timeSinceSent = showTimeSincePlunder(sentTime);
	                    break;
	                case 9: //bButton
	                    var bButton = cell.html();
	                    break;
	                case 10: //cButton
	                    var cButton = cell.html();
	                    break;
	            }
	        }
	        var buildings = {
	        	main: -1,
				barracks: -1,
				stable: -1,
				garage: -1,
				church: -1,
				snob: -1,
				smith: -1,
				place: -1,
				statue: -1,
				market: -1,
				wood: -1,
				stone: -1,
				iron: -1,
				farm: -1,
				storage: -1,
				hide: -1,
				wall: -1
			}
			var points = 0;
	        if(getBuildings){
		        if(reportBuildings({reportID:reportID}).count() > 0){
					buildings = reportBuildings({reportID:reportID}).first()["buildings"];
					points = getBuildingPoints(reportBuildings({reportID:reportID}).first()["buildings"]);
		        } else {
		        	getBuildingLevels(reportID, villageToAttack);
		        }
		    }
	        reports.insert({
	            reportID: reportID,
	            village: village,
	            villageToAttack: villageToAttack,
	            dot: dot,
	            loot: loot,
	            attacks: numAttacks,
	            plunderTime: plunderTime,
	            sentTime: sentTime,
	            timeSincePlunder: timeSincePlunder,
	            timeSinceSent: timeSinceSent,
	            continent: continent,
	            wood: wood,
	            clay: clay,
	            iron: iron,
	            resources: resources,
	            buildings: buildings,
	            distance: distance,
	            wall: wall,
	            points: points,
	            aButton: aButton,
	            bButton: bButton,
	            cButton: cButton
	        });
	        console.log(reports({reportID: reportID}).first());
	    }
	}
	function createNewTable(column, direction) {
	    $("#plunder_list tr").slice(1).remove();
	    reports().order(column + " " + direction).each(function(record, recordnumber) {
	    	checkRowToHide(record);
	        var dot = "<td><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/dots/" + record.dot + ".png?bb7c6'></td>";
	        var loot = (record.loot != null) ? "<td><img src='http://dsen.innogamescdn.com/8.31.1/24230/graphic/max_loot/" + record.loot + ".png?c2b58'></td>" : "<td></td>";
	        var village = "<td><a href='/game.php?village=" + window.game_data.village.id + "&mode=all&view=" + record.reportID + "&screen=report'> " + record.village + "</a></td>";
	        var attacks = "<td>" + record.attacks + "</td>";
	        var time = "<td>" + record.timeSincePlunder + "</td>";
	        var sent = "<td>" + record.timeSinceSent + "</td>";
	        var wood = "<td>" + ((record.wood == -1) ? "?" : record.wood.toLocaleString('de-DE')) + "</td>";
	        var clay = "<td>" + ((record.clay == -1) ? "?" : record.clay.toLocaleString('de-DE')) + "</td>";
	        var iron = "<td>" + ((record.iron == -1) ? "?" : record.iron.toLocaleString('de-DE')) + "</td>";
	        var points = "";
	        if(getBuildings){
		        var main = "<td>" + ((record.buildings["main"] >= 0)?record.buildings["main"]:"?") + "</td>";
		        var barracks = "<td>" + ((record.buildings["barracks"] >= 0)?record.buildings["barracks"]:"?") + "</td>";
		        var stable = "<td>" + ((record.buildings["stable"] >= 0)?record.buildings["stable"]:"?") + "</td>";
		        var garage = "<td>" + ((record.buildings["garage"] >= 0)?record.buildings["garage"]:"?") + "</td>";
		        var snob = "<td>" + ((record.buildings["snob"] >= 0)?record.buildings["snob"]:"?") + "</td>";
		        var smith = "<td>" + ((record.buildings["smith"] >= 0)?record.buildings["smith"]:"?") + "</td>";
		        var statue = "<td>" + ((record.buildings["statue"] >= 0)?record.buildings["statue"]:"?") + "</td>";
		        var market = "<td>" + ((record.buildings["market"] >= 0)?record.buildings["market"]:"?") + "</td>";
		        var woodBuilding = "<td>" + ((record.buildings["wood"] >= 0)?record.buildings["wood"]:"?") + "</td>";
		        var stoneBuilding = "<td>" + ((record.buildings["stone"] >= 0)?record.buildings["stone"]:"?") + "</td>";
		        var ironBuilding = "<td>" + ((record.buildings["iron"] >= 0)?record.buildings["iron"]:"?") + "</td>";
		        var farm = "<td>" + ((record.buildings["farm"] >= 0)?record.buildings["farm"]:"?") + "</td>";
		        var storage = "<td>" + ((record.buildings["storage"] >= 0)?record.buildings["storage"]:"?") + "</td>";
		        var hide = "<td>" + ((record.buildings["hide"] >= 0)?record.buildings["hide"]:"?") + "</td>";
		        points = "<td>" + ((record.buildings["main"] >= 0)?record.points:"?") + "</td>";
		        
		        var buildings = main + barracks + stable + garage + snob + smith + statue + market + woodBuilding + stoneBuilding + ironBuilding + farm + storage + hide;
		    }
	        var wall = "<td>" + ((record.wall == -1) ? "?" : record.wall) + "</td>";
	        var distance = "<td>" + record.distance + "</td>";
	        var aButton = "<td>" + record.aButton.replace('Accountmanager.farm.sendUnits', 'customSendUnits') + "</td>";
	        var bButton = "<td>" + record.bButton.replace('Accountmanager.farm.sendUnits', 'customSendUnits') + "</td>";
	        var cButton = "<td>" + record.cButton.replace('Accountmanager.farm.sendUnitsFromReport', 'customSendUnitsFromReport') + "</td>";
	        var attackButton = "<td><a href='#' onclick='' class='farm_icon' id='mp_att' title='Send troops' href='/game.php?village=21289&amp;target=21007&amp;screen=place' style='background-position: 408px 0px;'></a></td>";
	        $("#plunder_list").append("<tr>" + dot + loot + village + attacks + time + sent + wood + clay + iron + buildings + wall + points + distance + aButton + bButton + cButton + attackButton + "</tr>");
	    });
	    $('#plunder_list tr:even td').css("background", "#FFF5DA");
	    Accountmanager.initTooltips();
	    //$('tr:odd:gt(0) td', this).not("table:first").css("backgroundColor", "#F0E2BE");
	    return false;
	}
	function getBuildingLevels(report, village){
		//reportBuildings().remove();
		$.ajax({
			type: "GET",
			url: "/game.php?village="+window.game_data.village.id+"&mode=all&view="+report+"&screen=report",
			async: true,
			cache: false,
			success: function(data) {
				var buildings = {
	            	main: 0,
					barracks: 0,
					stable: 0,
					garage: 0,
					church: 0,
					snob: 0,
					smith: 0,
					place: 0,
					statue: 0,
					market: 0,
					wood: 0,
					stone: 0,
					iron: 0,
					farm: 0,
					storage: 0,
					hide: 0,
					wall: 0
				};
				$('#attack_spy_buildings_left tr, #attack_spy_buildings_right tr', data).slice(1).each(function(j){
					var buildingName = $(this).find('td:eq(0) img').attr('src') + "";

					if(buildingName == "undefined"){
						return true;
					}
					buildingName = buildingName.split('/');
					buildingName = buildingName[buildingName.length - 1].split(".png")[0];
					buildings[buildingName] = parseInt($.trim($(this).find('td:eq(1)').html()));
				});
				if(reportBuildings({village:village}).count() > 0){
					reportBuildings({village:village}).remove();
				}
				reportBuildings.insert({reportID:report, villageID:village, buildings:buildings});
				reports({villageToAttack:village}).update("buildings", buildings);
			}
		});
	}
	function getBuildingPoints(buildings){
		var pointTotal = 0;
		var pointsTable = {
			main: [0,10,12,14,17,21,25,30,36,43,52,62,74,89,107,128,154,185,222,266,319,383,460,552,662,795,954,1145,1374,1648,1978],
			barracks: [0,16,19,23,28,33,40,48,57,69,83,99,119,143,171,205,247,296,355,426,511,613,736,883,1060,1272],
			stable: [0,20,24,29,35,41,50,60,72,86,103,124,149,178,214,257,308,370,444,532,639],
			garage: [0,24,29,35,41,50,60,72,86,103,124,149,178,214,257,308],
			church: [0,10,12,14],
			snob: [0,512,614,737],
			smith: [0,19,23,27,33,39,47,57,68,82,98,118,141,169,203,244,293,351,422,506,607],
			place: [0,0],
			statue: [0,24],
			market: [0,10,12,14,17,21,25,30,36,43,52,62,74,89,107,128,154,185,222,266,319,383,460,552,662,795],
			wood: [0,6,7,9,10,12,15,18,21,26,31,37,45,53,64,77,92,111,133,160,192,230,276,331,397,477,572,687,824,989,1187],
			stone: [0,6,7,9,10,12,15,18,21,26,31,37,45,53,64,77,92,111,133,160,192,230,276,331,397,477,572,687,824,989,1187],
			iron: [0,6,7,9,10,12,15,18,21,26,31,37,45,53,64,77,92,111,133,160,192,230,276,331,397,477,572,687,824,989,1187],
			farm: [0,5,6,7,9,10,12,15,18,21,26,31,37,45,53,64,77,92,111,133,160,192,230,276,331,397,477,572,687,824,989],
			storage: [0,6,7,9,10,12,15,18,21,26,31,37,45,53,64,77,92,111,133,160,192,230,276,331,397,477,572,687,824,989,1187],
			hide: [0,5,6,7,9,10,12,15,18,21,26],
			wall: [0,8,10,12,14,17,20,24,29,34,41,50,59,71,86,103,123,148,177,213,256]
		};
		$.each(buildings, function(key, value){
			pointTotal += parseInt(pointsTable[key][parseInt(value)]);
		});
		return pointTotal;
	}
/*** Runtime Functions **************/
	function sortByColumn(column, element) {
	    var direction = $(element).attr("class");
	    $(element).attr("class", (direction == "asec") ? "desc" : "asec");
	    createNewTable(column, direction);
	    return false;
	}

	function customSendUnits(link, target_village, template_id) {
	    link = $(link);
	    link.closest("tr").hide();
	    var data = {
	        target: target_village,
	        template_id: template_id,
	        source: game_data.village.id
	    };
	    $.post(Accountmanager.send_units_link, data, function (data) {
	        if (data.error) {
		        UI.ErrorMessage(data.error);
		        link.closest("tr").show();
	        } else {
	        	var attacks = reports({villageToAttack:target_village+""}).first();
	        	reports({villageToAttack:target_village+""}).update("attacks",attacks["attacks"]+1);
	        	if(villageAttacks({villageID:target_village}).count() > 0){
	        		villageAttacks({villageID:target_village}).remove();
	        	}
	        	villageAttacks.insert({villageID:target_village, sentTime:getCurrentGameTime()});
	            Accountmanager.farm.updateOwnUnitsAvailable(data.current_units);
	        }
	        lastAjaxCall = "sendUnits";
	    }, 'json');
	    return false
	}

	function customSendUnitsFromReport(link, target_village, report_id, units_forecast) {
	    $link = $(link);
		$(link).closest("tr").hide();
	    if ($link.hasClass('farm_icon_disabled')) return false;
	    var data = {
	        report_id: report_id
	    };
	    TribalWars.post(Accountmanager.send_units_link_from_report, null, data, function(data) {
	        if (typeof data.success === 'string') {
	            //UI.SuccessMessage(data.success, 4e3);
	        	var attacks = reports({villageToAttack:target_village+""}).first();
	        	reports({villageToAttack:target_village+""}).update("attacks",attacks["attacks"]+1);
	        	if(villageAttacks({villageID:target_village}).count() > 0){
	        		villageAttacks({villageID:target_village}).remove();
	        	}
	        	villageAttacks.insert({villageID:target_village, sentTime:getCurrentGameTime()});
	            Accountmanager.farm.updateOwnUnitsAvailable(data.current_units)
	        };
	        $('.farm_village_' + target_village).addClass('farm_icon_disabled');
	        if (Accountmanager.farm.hide_attacked) Accountmanager.farm.updateNonAttacked(target_village)
	        lastAjaxCall = "sendUnits";
	    });
	    return false
	}
/*** Time ***************************/
	function getVillageAttackedTime(cell) {
	    var time = cell.html();
	    var cellTime = time.split(' ');
	    var attackDay;
	    var attackTime;
	    var cell;
	    for (var i = 0; i < cellTime.length; i++) {
	        cell = $.trim(cellTime[i]);
	        if (cell.indexOf('.') > -1) {
	            attackDay = cell;
	        } else if (cell == "today") {
	            attackDay = "today";
	        } else if (cell == "yesterday") {
	            attackDay = "yesterday";
	        }
	        if (cell.indexOf(':') > -1) {
	            attackTime = cell;
	        }
	    }
	    if (attackDay == "today" || attackDay == "yesterday") {
	        var day = currentGameTime.getDate();
	        if (attackDay == "yesterday") day--;
	        var month = currentGameTime.getMonth() + 1;
	        var year = currentGameTime.getFullYear();
	        var time = attackTime.split(':');
	        var hours = time[0];
	        var minutes = time[1];
	        var seconds = time[2];
	        return year + "," + ("0" + month).slice(-2) + "," + ("0" + day).slice(-2) + "," + ("0" + hours).slice(-2) + "," + ("0" + minutes).slice(-2) + "," + ("0" + seconds).slice(-2);
	    } else {
	        var cellDay = attackDay.split('.');
	        var day = cellDay[0];
	        var month = cellDay[1];
	        if (month > currentGameTime.getMonth() + 1) var year = currentGameTime.getFullYear() - 1;
	        else var year = currentGameTime.getFullYear();
	        var time = attackTime.split(':');
	        var hours = time[0];
	        var minutes = time[1];
	        var seconds = time[2];
	        return year + "," + ("0" + month).slice(-2) + "," + ("0" + day).slice(-2) + "," + ("0" + hours).slice(-2) + "," + ("0" + minutes).slice(-2) + "," + ("0" + seconds).slice(-2);
	    }
	}
	function showTimeSincePlunder(time){
		time= time.split(",");
		if(isNaN(time[1])){
			return "?";
		}
		time = new Date(time[0], time[1]-1, time[2], time[3], time[4], time[5], 0);
		var t = ((currentGameTime.getTime() - time.getTime())/1000);
		return secondsToTime(t);
	}
	function secondsToTime(secs){
	    secs = Math.round(secs);
	    var hours = Math.floor(secs / (60 * 60));

	    var divisor_for_minutes = secs % (60 * 60);
	    var minutes = Math.floor(divisor_for_minutes / 60);

	    var divisor_for_seconds = divisor_for_minutes % 60;
	    var seconds = Math.ceil(divisor_for_seconds);
	    var stringToReturn = "";
	    var obj = {
	    	"d": ("00"+Math.floor(hours/24)).slice(-3),
	        "h": ("0"+hours%24).slice(-2),
	        "m": ("0"+minutes).slice(-2),
	        "s": ("0"+seconds).slice(-2)
	    };
	   	return obj["d"]+":"+obj["h"]+":"+obj["m"]+":"+obj["s"];
	}
	function getCurrentGameTime() {
	    var serverTime = $('#serverTime').html().split(':');
	    var serverDate = $('#serverDate').html().split('/');
	    return new Date(serverDate[2], serverDate[1] - 1, serverDate[0], serverTime[0], serverTime[1], serverTime[2], 0);
	}
/*** User Interface *****************/
	function removeFirstPage() {
		$("#am_widget_Farm h4").remove();
	    $('.body').remove();
	    $("#am_widget_Farm").hide();
	}
	function fadeToBlack() {
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
	function showSettings(){
		$('head').append("<link type='text/css' rel='stylesheet' href='" + scriptURL +"style.css' />");
		$("#contentContainer h3").eq(0).after($("<div class='vis'id='settingsDiv'><h4>LA Enhancer " + version + " - <a href='http://forum.tribalwars.net/showthread.php?266604-ntoombs19-s-FA-Filter'target='_blank'>Instructions</a><span style='font-size:10px;float:right;font-weight:normal;font-style:normal'>Created by <a href='http://forum.tribalwars.net/member.php?22739-ntoombs19'target='_blank'>ntoombs19</a>&nbsp;<div class='vis'style='float:right;text-align:center;line-height:100%;width:12px;height:12px;margin:0px 0px 0px 0px;position:relative;background-color:tan;opacity:.7'><a href='#'num='2'onclick='uglyHider($(this));return false;'>-</a></div></span></h4><table class='settingsTable'><tbody id='settingsBody'><tr><th colspan='1'>General Settings</th><th colspan='4'>Filters</th></tr><tr><td class='col1'style='min-width:200px'><span>Load pages</span>&nbsp;<input type='text'value=''size='1'id='start_page'>&nbsp;<span>to</span>&nbsp;<input type='text'value=''size='1'id='end_page'></td><td colspan='3'><span style='font-weight:bold'>Enable</span>&nbsp;<img src='graphic/questionmark.png'width='13'height='13'id='enable_help'></td><td rowspan='4'valign='top'><form><input type='checkbox'id='blue'><label for='blue'><img src='graphic/dots/blue.png'> Scout attack</label><br><input type='checkbox'id='green'><label for='green'><img src='graphic/dots/green.png'> No losses</label><br><input type='checkbox'id='yellow'><label for='yellow'><img src='graphic/dots/yellow.png'> Some losses</label><br><input type='checkbox'id='red_yellow'><label for='red_yellow'><img src='graphic/dots/red_yellow.png'> Lost, but damaged building(s)</label><br><input type='checkbox'id='red_blue'><label for='red_blue'><img src='graphic/dots/red_blue.png'> Lost, but scouted</label><br><input type='checkbox'id='red'><label for='red'><img src='graphic/dots/red.png'> All units lost</label></form></td></tr><tr><td><label for='sort_first_by'>Sort 1st by:</label>&nbsp;<select id='sort_first_by'><option value='distance-asc'>Distance (Near>Far)</option><option value='distance-desc'>Distance (Far>Near)</option><option value='date-asc'>Time (New>Old)</option><option value='date-desc'>Time (Old>New)</option></select></td><td style='width:26px'><input type='checkbox'id='enable_loot'></td><td style='width:110px'><label for='enable_loot'>Hide loot</label></td><td><input type='radio'name='loot'id='full'><label for='full'><img src='graphic/max_loot/1.png'></label>&nbsp;<input type='radio'name='loot'id='partial'><label for='partial'><img src='graphic/max_loot/0.png'></label>&nbsp;<input type='radio'name='loot'id='none'><label for='none'>None</label></td></tr><tr><td><label for='sort_second_by'>Sort 2nd by:</label>&nbsp;<select id='sort_second_by'><option value='attacks-asec'>Attacks (Few>Many)</option><option value='attacks-desc'>Attacks (Many>Few)</option><option value='sent-asec'>Sent (New>Old)</option><option value='sent-desc'>Sent (Old>New)</option><option value='landed-asec'>Landed (New>Old)</option><option value='landed-desc'>Landed (Old>New)</option><option value='wood-asec'>Wood (Many>Few)</option><option value='wood-desc'>Wood (Few>Many)</option><option value='clay-asec'>Clay (Many>Few)</option><option value='clay-desc'>Clay (Few>Many)</option><option value='iron-asec'>Iron (Many>Few)</option><option value='iron-desc'>Iron (Few>Many)</option><option value='resources-asec'>All Res (Many>Few)</option><option value='resources-desc'>All Res (Few>Many)</option><option value='wall-asec'>Wall (High>Low)</option><option value='wall-desc'>Wall (Low>High)</option><option value='distance-asec'>Distance (Far>Near)</option><option value='distance-desc'>Distance (Near>Far)</option></select></td><td><input type='checkbox'id='enable_attacks'></td><td><label for='enable_attacks'>Hide attacks</label></td><td><select id='attack_operator'><option value='greater_than'>Greater than</option><option value='less_than'>Less than</option><option value='equal_to'>Equal to</option></select>&nbsp;<input type='text'id='attack_value'size='1'value=''></td></tr><tr><td rowspan='1'><input type='checkbox' id='apply_auto'>Apply profile automatically<label></label></td><td><input type='checkbox'id='enable_walls'></td><td><label for='enable_walls'>Hide wall lvls</label></td><td><select id='wall_operator'><option value='greater_than'>Greater than</option><option value='less_than'>Less than</option><option value='equal_to'>Equal to</option></select>&nbsp;<input type='text'id='wall_value'size='1'value=''></td></tr><tr><td><input type='checkbox' id='show_buildings'><label>Show buildings</label></td><td><input type='checkbox'id='enable_distances'></td><td><label for='enable_distances'>Hide distances</label></td><td colspan='2'><select id='distance_operator'><option value='greater_than'>Greater than</option><option value='less_than'>Less than</option><option value='equal_to'>Equal to</option></select>&nbsp;<input type='text'id='distance_value'size='1'value=''></td></tr><tr><td><span style='font-weight:bold;'>Go to next village when...</span></td><td><input type='checkbox' id='enable_continents' /><td colspan='3'><select id='continent_display'><option value='hide'>Hide</option><option value='show'>Show</option></select>&nbsp;<label for='continent_value'>continents</label>&nbsp;<input type='text'size='1'id='continent_value'value=''>&nbsp;<img src='graphic/questionmark.png'height='13'id='continent_help'></td></tr><tr><td><input type='checkbox'id='next_village_no_farms'><label for='next_village_no_farms'>All rows are hidden</label></td><td><input type='checkbox'id='enable_resources'></td><td colspan='3'><label for='enable_resources'>Hide resources</label>&nbsp;<select id='resource_operator'><option value='greater_than'>Greater than</option><option value='less_than'>Less than</option><option value='equal_to'>Equal to</option></select>&nbsp;<input type='text'id='resources_value'size='9'value=''></td></tr><tr><td><input type='checkbox' id='next_village_units' /><label for='next_village_units'>Not enough units available</label></td><td><input type='checkbox'id='enable_attack_time'></td><td colspan='3'><select id='attack_time_display'><option value='hide'>Hide</option><option value='show'>Show</option></select>&nbsp;villages attacked in the last&nbsp;<input type='text'id='attack_time_value'size='9'value=''><span></span></td></tr><tr><td><input type='text' size='1' id='scouts_left' /><label for='scouts_left'>scouts remaining</label></td><td><input type='checkbox' id='enable_sent_time' /></td><td colspan='3'><select id='sent_time_display'><option value='hide'>Hide</option><option value='show'>Show</option></select>&nbsp;villages sent to in the last&nbsp;<input type='text' size='9' id='sent_time_value' /></td></tr><tr><td><input type='text' size='1' id='farming_troops_left' /><label for='farming_troops_left'>farming troops available</label></td><td colspan='4'><div style='float:left;'><input type='submit'value='Apply'onclick='applyFilter()'>&nbsp;<input type='submit'value='Reset'onclick='resetTable()'></div><div style='float:right;'><label for='settingsProfile'>Profile:</label>&nbsp;<select id='settingsProfile'onchange='loadProfile($(\"#settingsProfile\").val())'></select>&nbsp;<input type='submit'value='New'onclick='newProfileDialog()'>&nbsp;<input type='submit'value='Set default'onclick='setDefaultProfile()'>&nbsp;<input type='submit'value='Delete'onclick='deleteProfile()'>&nbsp;<input type='submit'value='Export'onclick='exportProfile()'>&nbsp;<input type='submit'value='Import'onclick='importProfile()'></div></td></tr><th>Hot Keys</th><th colspan='4'>Master Button Settings</th></tr><tr><td rowspan='4'><table><tr class='hotkey_values'><td><a href='#'onclick='return setKeyEditMode(\"A\")'id='button_a'class='farm_icon farm_icon_a'></a></td><td><a href='#'onclick='return setKeyEditMode(\"B\")'id='button_b'class='farm_icon farm_icon_b'></a></td><td><a href='#'onclick='return setKeyEditMode(\"C\")'id='button_c'class='farm_icon farm_icon_c'></a></td><td><a href='#'onclick='return setKeyEditMode(\"Master\")'id='button_master'class='farm_icon farm_icon_m'></a></td></tr><tr class='hotkey_values'><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_a'value='A'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_b'value='B'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_c'value='C'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_master'value='M'></td></tr><tr class='hotkey_values'><td colspan='2'><input class='btn tooltip'onclick='return setKeyEditMode(\"Skip\")'type='button'value='Skip'style='margin:0px 0px 0px 0px'title='Skip next farm'></td><td><input class='btn tooltip'onclick='return setKeyEditMode(\"Left\")'type='button'value='⇚'style='margin:0px 0px 0px 0px'title='Previous village'></td><td><input class='btn tooltip'type='button'onclick='return setKeyEditMode(\"Right\")'value='⇛'style='margin:0px 0px 0px 0px'title='Next village'></td></tr><tr class='hotkey_values'><td colspan='2'><input type='text'class='hotkey_value' READONLY id='hotkey_value_skip'value='S'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_left'value='&#8592;'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_right'value='&#8594;'></td></tr></table></td><td><input type='checkbox' id='priority_one_enabled'/></td><td colspan='3'>If row matches <select id='priority_one_profile'></select> click <select id='priority_one_button'><option val='Skip'>Skip</option><option val='A'>A</option><option val='B'>B</option><option val='C'>C</option></select></td></tr><tr><td><input type='checkbox' id='priority_two_enabled'/></td><td colspan='3'>If row matches <select id='priority_two_profile'></select> click <select id='priority_two_button'><option val='Skip'>Skip</option><option val='A'>A</option><option val='B'>B</option><option val='C'>C</option></select></td></tr><tr><td><input type='checkbox' id='priority_three_enabled'/></td><td colspan='3'>If row matches <select id='priority_three_profile'></select> click <select id='priority_three_button'><option val='Skip'>Skip</option><option val='A'>A</option><option val='B'>B</option><option val='C'>C</option></select></td></tr><tr><td colspan='4'>If row doesn't match any profiles, click <select id='default_button'><option val='Skip'>Skip</option><option val='A'>A</option><option val='B'>B</option><option val='C'>C</option></select></td></tr></tbody></table></div>"));
		formatSettings();
	}
	function formatSettings() {
		// enable instrunctions
		var enableHelp = $('#enable_help');
		enableHelp.attr('title', "Filters left unchecked will not be applied");
		UI.ToolTip(enableHelp);
		// continent instrunctions
		var continentHelp = $('#continent_help');
		continentHelp.attr('title', "Separate continents with a period. Example: 55.54.53");
		UI.ToolTip(continentHelp);
		loadDefaultProfile();
		fillProfileList();
		getSettingInputs();
		fillSettingInputs();
		fillMasterSettings();
		scriptSettings = settings({name:"settings"}).first()["settings"];
		$(".settingsTable tr:gt(0):lt(9) > td:not(:first-child) input,.settingsTable tr:gt(0):lt(9) > td:not(:first-child) select").change(function(){
			var profileName = $('#settingsProfile option:selected').text();
			var inputs = getFilterInputs();
			profiles({name:profileName}).update({"settings":inputs});
		});
		$(".settingsTable tr:gt(11) > td > input:not(:input[type=submit],:input[type=button]),.settingsTable tr:gt(11) > td > select,.settingsTable tr:gt(0):lt(10) > td:first-child > input,.settingsTable tr:gt(0):lt(10) > td:first-child > select").change(function(){
			var inputs = getSettingInputs();
			settings({name:"settings"}).update({settings:inputs});
			scriptSettings = settings({name:"settings"}).first()["settings"];
		});
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
/*** Helpers ************************/
	function getUrlParameter(sPageURL, sParam) {
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) {
	            return sParameterName[1];
	        }
	    }
	}
/*** Profile/Settings storage *******/
	function getFilterInputs(){
		var inputs = {
			blue: $(".settingsTable #blue").prop('checked'),
			green: $(".settingsTable #green").prop('checked'),
			yellow: $(".settingsTable #yellow").prop('checked'),
			red_yellow: $(".settingsTable #red_yellow").prop('checked'),
			red_blue: $(".settingsTable #red_blue").prop('checked'),
			red: $(".settingsTable #red").prop('checked'),
			enable_loot: $(".settingsTable #enable_loot").prop('checked'),
			full: $(".settingsTable #full").prop('checked'),
			partial: $(".settingsTable #partial").prop('checked'),
			none: $(".settingsTable #none").prop('checked'),
			enable_attacks: $(".settingsTable #enable_attacks").prop('checked'),
			attack_operator: $(".settingsTable #attack_operator").val(),
			attack_value: $(".settingsTable #attack_value").val(),
			enable_walls: $(".settingsTable #enable_walls").prop('checked'),
			wall_operator: $(".settingsTable #wall_operator").val(),
			wall_value: $(".settingsTable #wall_value").val(),
			enable_distances: $(".settingsTable #enable_distances").prop('checked'),
			distance_operator: $(".settingsTable #distance_operator").val(),
			distance_value: $(".settingsTable #distance_value").val(),
			enable_continents: $(".settingsTable #enable_continents").prop('checked'),
			continent_display: $(".settingsTable #continent_display").val(),
			continent_value: $(".settingsTable #continent_value").val(),
			enable_resources: $(".settingsTable #enable_resources").prop('checked'),
			resource_operator: $(".settingsTable #resource_operator").val(),
			resources_value: $(".settingsTable #resources_value").val(),
			enable_attack_time: $(".settingsTable #enable_attack_time").prop('checked'),
			attack_time_display: $(".settingsTable #attack_time_display").val(),
			attack_time_value: $(".settingsTable #attack_time_value").val(),
			enable_sent_time: $(".settingsTable #enable_sent_time").prop('checked'),
			sent_time_display: $(".settingsTable #sent_time_display").val(),
			sent_time_value: $(".settingsTable #sent_time_value").val()
		}
		return inputs;
	}
	function getSettingInputs(){
		var inputs = {
			start_page: $(".settingsTable #start_page").val(),
			end_page: $(".settingsTable #end_page").val(),
			sort_first_by: $(".settingsTable #sort_first_by").val(),
			sort_second_by: $(".settingsTable #sort_second_by").val(),
			apply_auto: $(".settingsTable #apply_auto").prop('checked'),
			show_buildings: $(".settingsTable #show_buildings").prop('checked'),
			next_village_no_farms: $(".settingsTable #next_village_no_farms").prop('checked'),
			next_village_units: $(".settingsTable #next_village_units").prop('checked'),
			scouts_left: $(".settingsTable #scouts_left").val(),
			farming_troops_left: $(".settingsTable #farming_troops_left").val(),
			hotkey_value_a: $(".settingsTable #hotkey_value_a").val(),
			hotkey_code_a: keycodes.a,
			hotkey_value_b: $(".settingsTable #hotkey_value_b").val(),
			hotkey_code_b: keycodes.b,
			hotkey_value_c: $(".settingsTable #hotkey_value_c").val(),
			hotkey_code_c: keycodes.c,
			hotkey_value_master: $(".settingsTable #hotkey_value_master").val(),
			hotkey_code_master: keycodes.master,
			hotkey_value_skip: $(".settingsTable #hotkey_value_skip").val(),
			hotkey_code_skip: keycodes.skip,
			hotkey_value_left: $(".settingsTable #hotkey_value_left").val(),
			hotkey_code_left: keycodes.left,
			hotkey_value_right: $(".settingsTable #hotkey_value_right").val(),
			hotkey_code_right: keycodes.right,
			priority_one_enabled: $(".settingsTable #priority_one_enabled").prop('checked'),
			priority_one_profile: $(".settingsTable #priority_one_profile").val(),
			priority_one_button: $(".settingsTable #priority_one_button").val(),
			priority_two_enabled: $(".settingsTable #priority_two_enabled").prop('checked'),
			priority_two_profile: $(".settingsTable #priority_two_profile").val(),
			priority_two_button: $(".settingsTable #priority_two_button").val(),
			priority_three_enabled: $(".settingsTable #priority_three_enabled").prop('checked'),
			priority_three_profile: $(".settingsTable #priority_three_profile").val(),
			priority_three_button: $(".settingsTable #priority_three_button").val(),
			default_button: $(".settingsTable #default_button").val()
		}
		if(settings().first() == false){
			settings.insert({name:"settings",settings:inputs});
			scriptSettings = settings({name:"settings"}).first()["settings"];
		}
		return inputs;
	}
	function fillSettingInputs(){
		var inputs = settings({name:"settings"}).first()["settings"];
		$(".settingsTable #start_page").val(inputs.start_page);
		$(".settingsTable #end_page").val(inputs.end_page);
		$(".settingsTable #sort_first_by").val(inputs.sort_first_by);
		$(".settingsTable #sort_second_by").val(inputs.sort_second_by);
		$(".settingsTable #apply_auto").prop('checked',inputs.apply_auto);
		$(".settingsTable #show_buildings").prop('checked',inputs.show_buildings);
		$(".settingsTable #next_village_no_farms").prop('checked',inputs.next_village_no_farms);
		$(".settingsTable #next_village_units").prop('checked',inputs.next_village_units);
		$(".settingsTable #scouts_left").val(inputs.scouts_left);
		$(".settingsTable #farming_troops_left").val(inputs.farming_troops_left);
		$(".settingsTable #hotkey_value_a").val(inputs.hotkey_value_a);
		$(".settingsTable #hotkey_value_b").val(inputs.hotkey_value_b);
		$(".settingsTable #hotkey_value_c").val(inputs.hotkey_value_c);
		$(".settingsTable #hotkey_value_master").val(inputs.hotkey_value_master);
		$(".settingsTable #hotkey_value_skip").val(inputs.hotkey_value_skip);
		$(".settingsTable #hotkey_value_left").val(inputs.hotkey_value_left);
		$(".settingsTable #hotkey_value_right").val(inputs.hotkey_value_right);
		$(".settingsTable #priority_one_enabled").prop('checked',inputs.priority_one_enabled);
		$(".settingsTable #priority_one_profile").val(inputs.priority_one_profile);
		$(".settingsTable #priority_one_button").val(inputs.priority_one_button);
		$(".settingsTable #priority_two_enabled").prop('checked',inputs.priority_two_enabled);
		$(".settingsTable #priority_two_profile").val(inputs.priority_two_profile);
		$(".settingsTable #priority_two_button").val(inputs.priority_two_button);
		$(".settingsTable #priority_three_enabled").prop('checked',inputs.priority_three_enabled);
		$(".settingsTable #priority_three_profile").val(inputs.priority_three_profile);
		$(".settingsTable #priority_three_button").val(inputs.priority_three_button);
		$(".settingsTable #default_button").val(inputs.default_button);
	}
	function loadDefaultProfile(){
		if(profiles({name:"Default"}).first() == false){
			profiles.insert({name:"Default",settings:{
				blue: false,
				green: false,
				yellow: false,
				red_yellow: false,
				red_blue: false,
				red: false,
				enable_loot: false,
				full: false,
				partial: false,
				none: false,
				enable_attacks: false,
				attack_operator: "greater_than",
				attack_value: "",
				enable_walls: false,
				wall_operator: "greater_than",
				wall_value: "",
				enable_distances: false,
				distance_operator: "greater_than",
				distance_value: "",
				enable_continents: false,
				continent_display: "hide",
				continent_value: "",
				enable_resources: false,
				resource_operator: "greater_than",
				resources_value: "",
				enable_attack_time: false,
				attack_time_display: "hide",
				attack_time_value: "",
				enable_sent_time: false,
				sent_time_display: "hide",
				sent_time_value: ""
			}});
		}
		loadProfile("Default");
	}
	function setDefaultProfile(){
		var profileName = $("#settingsProfile").val();
		var profileSettings = profiles({name:profileName}).first()["settings"];
		profiles({name:"Default"}).update({settings:profileSettings});
		loadProfile("Default");
		$("#settingsProfile").val("Default");
	}
	function deleteProfile(){
		var profileName = $("#settingsProfile").val();
		profiles({name:profileName}).remove();
		loadProfile("Default");
		$("#settingsProfile option[value='"+profileName+"']").remove();
		$("#settingsProfile").val("Default");
		$("#priority_one_profile option[value='"+profileName+"']").remove();
		$("#priority_two_profile option[value='"+profileName+"']").remove();
		$("#priority_three_profile option[value='"+profileName+"']").remove();
		$("#priority_one_profile").val("Default");
		$("#priority_two_profile").val("Default");
		$("#priority_three_profile").val("Default");
	}
	function loadProfile(profile){
		var inputs = profiles({name:profile}).first()["settings"];
		$(".settingsTable #blue").prop("checked",inputs.blue);
		$(".settingsTable #green").prop("checked",inputs.green);
		$(".settingsTable #yellow").prop("checked",inputs.yellow);
		$(".settingsTable #red_yellow").prop("checked",inputs.red_yellow);
		$(".settingsTable #red_blue").prop("checked",inputs.red_blue);
		$(".settingsTable #red").prop("checked",inputs.red);
		$(".settingsTable #enable_loot").prop("checked",inputs.enable_loot);
		$(".settingsTable #full").prop("checked",inputs.full);
		$(".settingsTable #partial").prop("checked",inputs.partial);
		$(".settingsTable #none").prop("checked",inputs.none);
		$(".settingsTable #enable_attacks").prop("checked",inputs.enable_attacks);
		$(".settingsTable #attack_operator").val(inputs.attack_operator);
		$(".settingsTable #attack_value").val(inputs.attack_value);
		$(".settingsTable #enable_walls").prop("checked",inputs.enable_walls);
		$(".settingsTable #wall_operator").val(inputs.wall_operator);
		$(".settingsTable #wall_value").val(inputs.wall_value);
		$(".settingsTable #enable_distances").prop("checked",inputs.enable_distances);
		$(".settingsTable #distance_operator").val(inputs.distance_operator);
		$(".settingsTable #distance_value").val(inputs.distance_value);
		$(".settingsTable #enable_continents").prop("checked",inputs.enable_continents);
		$(".settingsTable #continent_display").val(inputs.continent_display);
		$(".settingsTable #continent_value").val(inputs.continent_value);
		$(".settingsTable #enable_resources").prop("checked",inputs.enable_resources);
		$(".settingsTable #resource_operator").val(inputs.resource_operator);
		$(".settingsTable #resources_value").val(inputs.resources_value);
		$(".settingsTable #enable_attack_time").prop("checked",inputs.enable_attack_time);
		$(".settingsTable #attack_time_display").val(inputs.attack_time_display);
		$(".settingsTable #attack_time_value").val(inputs.attack_time_value);
		$(".settingsTable #enable_sent_time").prop("checked",inputs.enable_sent_time);
		$(".settingsTable #sent_time_display").val(inputs.sent_time_display);
		$(".settingsTable #sent_time_value").val(inputs.sent_time_value);
		$("#settingsProfile").val(profile);
	}
	function fillProfileList(){
		profiles().each(function(record, recordnumber) {
			$('#settingsProfile').append("<option value='" + record.name + "'>" + record.name + "</option>")
		});
		$('#settingsProfile').val("Default");
	}
	function createProfile(profile){
		Dialog.close();
		if(profiles({name:profile}).first() == false){
			profiles.insert({name:profile,settings:{
				blue: false,
				green: false,
				yellow: false,
				red_yellow: false,
				red_blue: false,
				red: false,
				enable_loot: false,
				full: false,
				partial: false,
				none: false,
				enable_attacks: false,
				attack_operator: "greater_than",
				attack_value: "",
				enable_walls: false,
				wall_operator: "greater_than",
				wall_value: "",
				enable_distances: false,
				distance_operator: "greater_than",
				distance_value: "",
				enable_continents: false,
				continent_display: "hide",
				continent_value: "",
				enable_resources: false,
				resource_operator: "greater_than",
				resources_value: "",
				enable_attack_time: false,
				attack_time_display: "hide",
				attack_time_value: "",
				enable_sent_time: false,
				sent_time_display: "hide",
				sent_time_value: ""
			}});
			$('#settingsProfile').append("<option value='" + profile + "'>" + profile + "</option>")
			$('#priority_one_profile').append("<option value='" + profile + "'>" + profile + "</option>");
			$('#priority_two_profile').append("<option value='" + profile + "'>" + profile + "</option>");
			$('#priority_three_profile').append("<option value='" + profile + "'>" + profile + "</option>");
			$('#settingsProfile').val(profile);
			loadProfile(profile);
		}
		else{
			UI.ErrorMessage("A profile with that name already exists.");
		}	
	}
/*** Keypress ***********************/
	$(document).off();
	function hotkeysOnOff(){
		$('input:not(:input[type=submit])').focusin(function(){
			window.onkeydown = function(){};
		});
		$('input:not(:input[type=submit])').focusout(function(){
			turnOnHotkeys();
		});
	}
	function turnOnHotkeys(){
		window.onkeydown = function(e){
			if(editingKey){
				editKey(e);
			} else if(!typing) {
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
						doTime(400);
					} else {
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
		var keys = settings().first()["settings"];
		keys.hotkey_value_a = $("#hotkey_value_a").val();
		keys.hotkey_code_a = keycodes.a;
		keys.hotkey_value_b = $("#hotkey_value_b").val();
		keys.hotkey_code_b = keycodes.b;
		keys.hotkey_value_c = $("#hotkey_value_c").val();
		keys.hotkey_code_c = keycodes.c;
		keys.hotkey_value_master = $("#hotkey_value_master").val();
		keys.hotkey_code_master = keycodes.master;
		keys.hotkey_value_skip = $("#hotkey_value_skip").val();
		keys.hotkey_code_skip = keycodes.skip;
		keys.hotkey_value_left = $("#hotkey_value_left").val();
		keys.hotkey_code_left = keycodes.left;
		keys.hotkey_value_right = $("#hotkey_value_right").val();
		keys.hotkey_code_right = keycodes.right;
		keys.priority_one_enabled = $('#priorityOneEnabled').prop('checked');
		keys.priority_one_profile = $('#priorityOneProfile').val();
		keys.priority_one_button = $('#priorityOneButton').val();
		keys.priority_two_enabled = $('#priorityTwoEnabled').prop('checked');
		keys.priority_two_profile = $('#priorityTwoProfile').val();
		keys.priority_two_button = $('#priorityTwoButton').val();
		keys.priority_three_enabled = $('#priorityThreeEnabled').prop('checked');
		keys.priority_three_profile = $('#priorityThreeProfile').val();
		keys.priority_three_button = $('#priorityThreeButton').val();
		keys.default_button = $('#defaultButton').val();
		settings({name:"settings"}).update({settings:keys});
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
		profiles().each(function(record, recordnumber){
			$('#priority_one_profile').append("<option value='" + record.name + "'>" + record.name + "</option>");
			$('#priority_two_profile').append("<option value='" + record.name + "'>" + record.name + "</option>");
			$('#priority_three_profile').append("<option value='" + record.name + "'>" + record.name + "</option>");
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
/*** Dialogs ************************/
	function newProfileDialog(){
		Dialog.show("test", "<div style='text-align:center;'><label>Profile Name</label><br /><input type='text' id='profileName'><br /><button class='btn btn-default btn-confirm-yes' style='margin: 10px 0 3px' onclick='createProfile($(\"#profileName\").val())'>Create Profile</button></div>");
		hotkeysOnOff();
	}
/*** Filtering **********************/
	function checkRowToHide(row){
		
	}