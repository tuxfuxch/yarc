/*
 * Yarc - Yet another Remote Control (for Kodi)
 * Copyright (C) 2015 by Esra Kummer
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 */


//that Intervals run only once, also after Pageswitch
var zeroInit = false;

var yCore = {	
	//set player at first as none, will by updated by yCore.getActivePlayer
	activePlayer: -1, //0=Music 1=Video
	deviceBeta: 0,
	deviceGamma: 0,
	totalPlayTimeSeconds: 0,
	currentPlayTimeSeconds: 0,
	doeOnPause: false, //checks is device orientation is on pause, needs to be global, since function is run every some milli seconds newly
	init: function(){
 		yS.localStorageInit();  //if some settings are not made, set default
		yS.getSettings();  //get settings from local storage		
		
		document.title = yS.xbmcName; //set windwotitle according to setting
		
		if(yS.hideMenuText){$(".yheadermenuitem").remove();}
		
		if(!zeroInit){setInterval(yCore.getActivePlayer, 1000);} //check active player each second
		if(!zeroInit){setInterval(yCore.getPlayerGetItem, 1000);} //check playing item each second
		if(!zeroInit){yCore.deviceOriantionService();}
		if(!zeroInit){yCore.keyDownService();}
   
		zeroInit = true; //that Intervals run only once, also after Pageswitch
		
		yCore.translate();
		
	},	/*   /init    */	
	//get active player and save it
	getActivePlayer: function(){
		yCore.sendJsonRPC(
			'GetActivePlayers',	
			'{ "jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1 }',
			function(resultGetActivePlayers){
				//"error" in resultGetItem
				if(resultGetActivePlayers["result"].length === 0){
					yCore.activePlayer = -1;
					
					$(".seek-bubble").hide();
					$(".footerImage").hide();
					$(".footerTitle").text("");
					$(".footerTime").text("");
					$(".footer").css( "background-size", "100% 100%" );
				} else {
					yCore.activePlayer = resultGetActivePlayers["result"]["0"]["playerid"];
				}
			}
		);
	},
	//get palying item and write it into footer
	getPlayerGetItem: function(){
		if(yCore.activePlayer != -1 && yFooter.footerVisible){ //only run if footer visible and and a player is active
			yCore.sendJsonRPC( //get time for footer
				'GetProperties',
				'{"jsonrpc":"2.0","method":"Player.GetProperties", "params": { "playerid": '
					+ yCore.activePlayer + ', "properties": ["time", "totaltime", "percentage"] }, "id": 1}',
				function(resultGetProperties){   // true if "error" doesn't exist in object
					if(!("error" in resultGetProperties)){
								
						$(".footerTime").html(yTools.addZeroTwoDigits(resultGetProperties["result"]["time"]["hours"]) 
							+ ":" + yTools.addZeroTwoDigits(resultGetProperties["result"]["time"]["minutes"]) 
							+ ":" + yTools.addZeroTwoDigits(resultGetProperties["result"]["time"]["seconds"])
							+ "<br>" + yTools.addZeroTwoDigits(resultGetProperties["result"]["totaltime"]["hours"])
							+ ":" + yTools.addZeroTwoDigits(resultGetProperties["result"]["totaltime"]["minutes"])
							+ ":" + yTools.addZeroTwoDigits(resultGetProperties["result"]["totaltime"]["seconds"])
						);
						
						//needed for seek function to calc time difference
						yCore.currentPlayTimeSeconds = resultGetProperties["result"]["time"]["hours"] * 3600
							+ resultGetProperties["result"]["time"]["minutes"] *60
							+ resultGetProperties["result"]["time"]["seconds"];
						
						yCore.totalPlayTimeSeconds = resultGetProperties["result"]["totaltime"]["hours"] * 3600
							+ resultGetProperties["result"]["totaltime"]["minutes"] *60
							+ resultGetProperties["result"]["totaltime"]["seconds"];
						var percentage = 100-resultGetProperties["result"]["percentage"];
						$(".footer").css( "background-size", percentage + "% 100%" );
						if(!yFooter.isDragging)$(".seek-bubble").css( "left", "calc(" +resultGetProperties["result"]["percentage"] + "% - 25px)");
					} else { //if "error" exists set props that nothing is in it
						$(".seek-bubble").hide();
						$(".footerImage").hide();
						$(".footerTitle").text("");
						$(".footerTime").text("");
						$(".footer").css( "background-size", "100% 100%" );
					}
				}
			);				
			
			//get playing item details for footer
			yCore.sendJsonRPC(
				'GetItem',
				'{ "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": '
						+ yCore.activePlayer + ', "properties": [ "title", "showtitle", "artist", "thumbnail", "streamdetails", "file" ] }, "id": 1 }',
				function(resultGetItem){
					if(!("error" in resultGetItem)){// if "error" is not in return set info
					
						if(resultGetItem["result"]["item"]["title"] == ""){ //only set label if titel is not there and info in label
							var label = " " +resultGetItem["result"]["item"]["label"];
						} else { label = "";}
						label = label.replace(/\+/g, " "); //for teleboy Plugin: replace "+" with " "
						if (yCore.activePlayer == 1){ //Video Player
							if(yFooter.bubbleSetVisible)$(".seek-bubble").show();
							$(".footerTitle").text(resultGetItem["result"]["item"]["title"] + label);
							if(!yS.hidePrevPics){
								$(".footerImage").attr("src", "http://" 
									+ decodeURIComponent(yTools.removeLastCharIf(resultGetItem['result']['item']['thumbnail'], "/")).substring(15) );
							}
							$(".footerImage").show();
							$(".footerTitle").show();
						} else if (yCore.activePlayer == 0) { //Musik Player
							if(yFooter.bubbleSetVisible)$(".seek-bubble").show();
							if(!yS.hidePrevPics){
									$(".footerImage").attr("src", "http://" + $(location).attr('host') + "/image/"+ encodeURIComponent(resultGetItem['result']['item']['thumbnail']) );
							}
							$(".footerTitle").text(resultGetItem["result"]["item"]["title"]  + " (" +  resultGetItem["result"]["item"]["artist"] + ") "  + label);
							$(".footerImage").show();
							$(".footerTitle").show();
						} else {//other Player
							if(yFooter.bubbleSetVisible)$(".seek-bubble").show();
							$(".footerTitle").text(resultGetItem["result"]["item"]["title"] + label);
							$(".footerImage").show();
							$(".footerTitle").show();
						}
						//if footer get's disabled while rpc call active, hide footer content
						if(!yFooter.footerVisible){$(".footerImage").hide();$(".footerTitle").hide();$(".footerTime").hide();}
					} else { //if "error" exists set props that nothing is in it
						$(".seek-bubble").hide();
						$(".footerImage").hide();
						$(".footerTitle").text("");
						$(".footerTime").text("");
					}
				}
			);
		}
	},
	/*
	 * translate interface. for some fields there is special handling needed
	 */
	translate: function(){
		//go throug all "Yarc TranSlate"-span-tags and set text according to constant and chosen langugage
		$('[data-yts]').each(function() {
			$(this).html(yTools.ts($(this).attr("data-yts")));
		});
		
		//if the language is not english and the according page is active translate. otherwise the english default in the html stay
		if(yS.l != "en"){
				
			if($(location).attr('hash') == ""){
				$("#SendTextField").attr("placeholder", yTools.ts("SEND_TEXT"));
			}
			
			if($(location).attr('hash') == "#movies"){
				$("#searchMovies").attr("placeholder", yTools.ts("SEARCH_MOVIE"));
				
				$('#genreSelect option[value="all"]').text(yTools.ts("SELECT_OPTION_ALL_GENRES"));
				if($('#genreSelect').val()=="all"){$("#genreSelect").val("all").selectmenu('refresh', true);}
				
				$('#languageSelect option[value="all"]').text(yTools.ts("SELECT_OPTION_ALL_LANGS"));
				if($('#languageSelect').val()=="all"){$("#languageSelect").val("all").selectmenu('refresh', true);}
			}
			
			if($(location).attr('hash') == "#music"){
				$("#searchMusic").attr("placeholder", yTools.ts("SEARCH_ALBUM_ARTIST"));
				
				$('#genreSelectMusic option[value="all"]').text(yTools.ts("SELECT_OPTION_ALL_GENRES"));
				if($('#genreSelectMusic').val()=="all"){$("#genreSelectMusic").val("all").selectmenu('refresh', true);}
			}
			
			if($(location).attr('hash') == "#music-songsearch"){
				$("#songsearch-searchfield").attr("placeholder", yTools.ts("SEARCH_SONGTITLE"));
			}
			
			if($(location).attr('hash') == "#addons"){
				$("#SendTextFieldAddon").attr("placeholder", yTools.ts("SEND_TEXT"));
		
				$("#searchAddon").attr("placeholder", yTools.ts("SEARCH_ADDON"));
				
				$('#addonSelect option[value="all"]').text(yTools.ts("SELECT_OPTION_ALL_PLUGINS"));
				if($('#addonSelect').val()=="all"){$("#addonSelect").val("all").selectmenu('refresh', true);}
				
				$('#addonSelect option[value="video"]').text(yTools.ts("VIDEO"));
				if($('#addonSelect').val()=="video"){$("#addonSelect").val("video").selectmenu('refresh', true);}
				
				$('#addonSelect option[value="audio"]').text(yTools.ts("AUDIO"));
				if($('#addonSelect').val()=="audio"){$("#addonSelect").val("audio").selectmenu('refresh', true);}
				
				$('#addonSelect option[value="other"]').text(yTools.ts("SELECT_OPTION_OTHER"));
				if($('#addonSelect').val()=="other"){$("#addonSelect").val("other").selectmenu('refresh', true);}
			}
		}
	},	
	/*
	 * Checks for support of DeviceOrientation and if supported sets a timer to check position and fire according instructions
	 * if no support it hides on/off button
	 */
	deviceOriantionService: function(){
		//Find our div containers in the DOM
		var dataContainerOrientation = document.getElementById('dataContainerOrientation');
		
		//Check for support for DeviceOrientation event
		if(window.DeviceOrientationEvent && !yS.hideOrientNav) {
			window.addEventListener('deviceorientation', function(event) {
				if($('#devOrient option:selected').attr('value') == "on"){
					//yCore.deviceAlpha = event.alpha;
					var scaler = 2;
					
					if(navigator.userAgent.indexOf("Firefox") >=0){
							scaler = 1;
					}
					yCore.deviceGamma = event.gamma / scaler;
					yCore.deviceBeta = event.beta;
					
					// for debuggin of Device orientation debugging needs according out-commented part in html
					//if(yCore.deviceAlpha!=0 || yCore.deviceBeta!=0 || yCore.deviceGamma!=0)//only do, if there is real data
					//dataContainerOrientation.innerHTML = 'beta: ' + event.beta + '<br />gamma: ' + event.gamma;
				}
			}, false);
			setInterval(function(){
				if($('#devOrient option:selected').attr('value') == "on"){
					radioNav_Med = $("input[name='nav-med']:checked").val();
					
					if( yCore.deviceGamma <= 20 && yCore.deviceGamma >= -20 && yCore.deviceBeta >= 170 && yCore.deviceBeta <= 179 && !yCore.doeOnPause){
						yRemote.playercontrol("Player.PlayPause");
						yCore.doeOnPause = true;
					}
					else if(yCore.deviceBeta >= 10 && yCore.deviceBeta <= 75 && yCore.doeOnPause){
						if(yCore.doeOnPause){
							yRemote.playercontrol("Player.PlayPause");
							yCore.doeOnPause = false;
						}
					}
					else if(yCore.deviceBeta >= 80 && !yCore.doeOnPause){
						yRemote.simpleJsonRequest("Input.Up");
					}
					else if( yCore.deviceBeta <= -5 && !yCore.doeOnPause){
						yRemote.simpleJsonRequest("Input.Down");
					}
					else if(yCore.deviceGamma <= -30 && yCore.deviceGamma >= -80 && !yCore.doeOnPause){
						yRemote.simpleJsonRequest("Input.Left");
					}
					else if(yCore.deviceGamma >= 30 && yCore.deviceGamma <= 80 && !yCore.doeOnPause){
						yRemote.simpleJsonRequest("Input.Right");
					}
				}
			}, 450);
		} else {
				$("#devOrientBlock").hide(); //hide if not supported
		}
	},
	/*
	 * Binds Event for keydown which checks if there is any input
	 */
	keyDownService: function(){//set a key map to check keyboard input
		var keymap = {8: false, 13: false, 16: false, 37: false, 38: false, 39: false, 40: false, 67: false, 81: false, 87: false};
		//           (8)back	 (13)enter	(16)shift  (37)left		(38)up	   (39)right	(40)down   (67)c      (81)q      (87)w			
		
		//on keyboard input, check if it matches the keymap and if it is the case start according function 
		$(document).keydown(function(e) { 
			
			/*for search field in song-search page.  needs to be here, because of document keydown. */
			if (e.keyCode == 13 && $(e.target).is("#songsearch-searchfield")) {
				$('#songsearch-list').empty();
				ySongSearch.searchPrintSong($("#songsearch-searchfield").attr('value'));
				$(e.target).blur();
				return false;
			}
			if (e.keyCode == 13 && $(e.target).is("#SendTextField")) {
				yRemote.sendTextButton($('#SendTextField').val());
				$(e.target).blur();
				return false;
			}
			if (e.keyCode == 13 && $(e.target).is("#SendTextFieldAddon")) {
				yRemote.sendTextButton($('#SendTextFieldAddon').val());
				$(e.target).blur();
				return false;
			}
			
			//if "enter" is pressend and being in a text (most of them) field, exit textfield to close onscreen keyboards on mobiles
			if (e.keyCode == 13 && 
					($(e.target).is("#xbmcName")
					||$(e.target).is("#searchMovies")
					||$(e.target).is("#searchMusic")
					||$(e.target).is("#searchAddon"))
				) {
				$(e.target).blur();
				return false;
			}	
			
		if (e.keyCode in keymap) { 
		
			// stop using accesskeyr if typing in a input field
			if ($(e.target).is(":text") || $(e.target).is("#prevImgQualMovies") || $(e.target).is("#listLength")){ 
				return true;
			}
		
			keymap[e.keyCode] = true;
			
			if (keymap[16] && keymap[37]) {
				yRemote.playergoto("previous");
				return false;
			}
			if (keymap[16] && keymap[38]) {
				yRemote.playercontrol("Player.stop");
				return false;
			}
			if (keymap[16] && keymap[39]) {
				yRemote.playergoto("next");
				return false;
			}
			if (keymap[16] && keymap[40]) {
				yRemote.playercontrol("Player.PlayPause");						
				return false;
			}
			if (keymap[67]) {
				yRemote.simpleJsonRequest("Input.ContextMenu");
				return false;
			}
			if (keymap[81]) {
				yRemote.setVolume("Volume.Minus");
				return false;
			}
			if (keymap[87]) {
				yRemote.setVolume("Volume.Plus");
				return false;
			}
			if (keymap[8]) { 
				yRemote.simpleJsonRequest("Input.Back");
				return false;
			}
			if (keymap[13]) { 
				yRemote.simpleJsonRequest("Input.Select");
				return false;
			}
			if (keymap[37]) { 
				yRemote.simpleJsonRequest("Input.Left");
				return false;
			}
			if (keymap[38]) { 
				yRemote.simpleJsonRequest("Input.Up");
				return false;
			}
			if (keymap[39]) { 
				yRemote.simpleJsonRequest("Input.Right");
				return false;
			}
			if (keymap[40]) { 
				yRemote.simpleJsonRequest("Input.Down");
				return false;
			}
		}
		return true;
		}).keyup(function(e) {		
			if (e.keyCode in keymap) {
				keymap[e.keyCode] = false;
			}
		});	
	},
	//function to send json request to kodi
	sendJsonRPC: function(name, data, success, async){
		jQuery.ajax({
			headers: { 
				'Accept': 'application/json',
				'Content-Type': 'application/json' 
			},
			type: "POST",
			async: async,
			'url': '/jsonrpc?' + name,
			'data': data,
			'dataType': 'json',
			'success': success
		});	
	}
}

var yRemote = {
	radioNavMed: "",
	init: function() {
		
		//if swipe area, show pannels, or hide them and show buttons instead
		if(yS.noSwipe){
			$("#swipe").hide();
			$("#Volume").show();
			$("#navigation-arrows").show();
			$("#mediacontrol1").show();
		} else {
			$("#swipe").show();
			$("#Volume").hide();
			$("#navigation-arrows").hide();
			$("#mediacontrol1").hide();
		}
		
		//set swipe box hight according to setting
		$(".swipe-box").css( "height", yS.swipeHight );
		
		/*-------------Swipe Area-------------------------*/
		
		//get if it should check for navigation, or media player control
		var radioNavMed = $("input[name='nav-med']:checked").val();
		
		$('.nav-med').click(function(){
			radioNavMed = $("input[name='nav-med']:checked").val();
			if(radioNavMed == "Nav"){
				$(".swipe-box").css( "background-color", "#666" );
			}else{
				$(".swipe-box").css( "background-color", "#444" );
			}
		});
		
		$('#swipe-help').click(function(){
			$('#detailspopupSwipe').popup('open');
		});
		
		//check for swipe inputs in swipe area with jquery.touchSwipe.js
		//depending on which section (navigation or player control) is activated, it starts the according functions
		$("#swipe").swipe( {
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
				switch (direction){
					case "up":
						if(radioNavMed == "Nav"){
							if(yS.swapSwipeDirections){
								yRemote.simpleJsonRequest("Input.Down");
							} else {
								yRemote.simpleJsonRequest("Input.Up");
							}
						} else{
							yRemote.playercontrol("Player.stop");
						}
						break;
					case "down":
						if(radioNavMed == "Nav"){
							if(yS.swapSwipeDirections){
								yRemote.simpleJsonRequest("Input.Up");
							} else {
								yRemote.simpleJsonRequest("Input.Down");
							}
						} else{
							yRemote.playercontrol("Player.PlayPause");
						}
						break;
					case "left":
						if(radioNavMed == "Nav"){
							if(yS.swapSwipeDirections){
								yRemote.simpleJsonRequest("Input.Right");
							} else {
								yRemote.simpleJsonRequest("Input.Left");
							}
						} else{
							yRemote.playergoto("previous");
						}
						break;
					case "right":
						if(radioNavMed == "Nav"){
							if(yS.swapSwipeDirections){
								yRemote.simpleJsonRequest("Input.Left");
							} else {
								yRemote.simpleJsonRequest("Input.Right");
							}
						} else{
							yRemote.playergoto("previous");
						}
						break;
					default:
						break;
				}
			}, 
			tap:function(event, target) {
				if(radioNavMed == "Nav"){yRemote.simpleJsonRequest("Input.Select");} else{yRemote.setVolume("Volume.Minus");}
			},
			doubleTap:function(event, target) {
				if(radioNavMed == "Nav"){yRemote.simpleJsonRequest("Input.Back");} else{yRemote.setVolume("Volume.Plus");}
			},
			longTap:function(event, target) {
				if(radioNavMed == "Nav"){yRemote.simpleJsonRequest("Input.ContextMenu");} else{yRemote.setVolume("Application.SetMute");}
			},
			threshold:35, //how far has the finger to swipe, that it is not a tap anymore
			doubleTapThreshold:500, //how much time can pass in max between tabs, that it is a double tap
		});
		
		/*-------------Index Page - Media Control Buttons-------------------------*/
		
		$(".playercontrol").click(function(e) {
			e.stopImmediatePropagation();				 //needed that it binds not miltiple times
			yRemote.playercontrol($(this).attr('data-yJsonFunction'));
		});
				
		$(".playerSetSpeed").click(function(e) { 
			e.stopImmediatePropagation();	
			yRemote.setSpeed($(this).attr('data-yJsonFunction'));
		});
		
		$("#SetRepeat").click(function(e) { 
			e.stopImmediatePropagation();	
			yRemote.setRepeat();
		});
		
		$("#SetShuffle").click(function(e) { 
			e.stopImmediatePropagation();	
			yRemote.setShuffle();
		}); 

		$(".playergoto").click(function(e) { 
			e.stopImmediatePropagation();
			yRemote.playergoto($(this).attr('data-yJsonFunction'));
		});
		
		/*-------------Index Page - Navigation Controll Buttons-------------------------*/

		$(".navcontrol").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.simpleJsonRequest($(this).attr('data-yJsonFunction'));
		});
		
		
		$("#toggleFullscreen").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.toggleFullscreen();
		});
		

		/*-------------Index Page - Input - Send Text -------------------------*/

		$("#SendTextButton").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.sendTextButton($('#SendTextField').val());
		});

		/*-------------Index Page - Input - Volume Range -------------------------*/
		$(".volume-group").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.setVolume($(this).attr('data-yJsonFunction'));
		});

		/*-----------------------------------------------------------------------------------
		* ---------------------------- Tools -----------------------------------------------
		* ----------------------------------------------------------------------------------*/

		/*-------------  Index Page - Input - Send URL     -----------------------*/
		$("#popupCancel").click(function(e) {
			e.stopImmediatePropagation();
			$('#detailspopupRemote').popup("close");
		});
		
		$("#detailspopupSwipeClose").click(function(e) {
			e.stopImmediatePropagation();
			$('#detailspopupSwipe').popup("close");
		});		
		
		/*-------------Index Page - cleanAndUpdate  Clean and Update Audio and Video Library  -------------------------*/
		$(".cleanAndUpdate").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.cleanAndUpdate($(this).attr('data-yJsonFunction'));
		});
		
		$("#yarcDemoVid").click(function(e) {
			e.stopImmediatePropagation();
			yCore.sendJsonRPC(
					'PlayerOpen',
					'{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item": {"file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' 
						+ 'yltMcKJFewE" }}, "id" : "1"}',
					' '
			);
		});
		

		/*-------------Index Page - Shutdown Buttons-------------------------*/

		$("#quit").click(function(e) {
			e.stopImmediatePropagation();
			e.preventDefault(); //preventing popup to colse automatically
			$('#detailspopupRemote').popup('open');
		});
		
		$("#popupCancel").click(function(e) {
			e.stopImmediatePropagation();
			$('#detailspopupRemote').popup("close");
		});
		
		$(".popupSHRS").click(function(e) { //SHRS: Suspend, Hibernate, Reboot, Shutdown
			e.stopImmediatePropagation();
			yRemote.simpleJsonRequest($(this).attr("data-yJsonFunction"));
		});
		
		$("#openSettings").click(function(e) {
			window.location.href = "#settings";
		});

	},/*   / init   */
	
	playercontrol: function(actionname) {	
		yCore.sendJsonRPC(
			'StopPause',
			'{"jsonrpc": "2.0", "method": "' + actionname + '", "params": { "playerid": ' + yCore.activePlayer + ' }, "id": 1}',
			' '
		);
	},
	playergoto: function(actionname) {
		yCore.sendJsonRPC(
			'playergoto',
			'{"jsonrpc": "2.0", "method": "Player.GoTo", "params": { "playerid": ' + yCore.activePlayer + ', "to": "'+actionname+'"}, "id": 1}',
			' '
		);
	},
	setSpeed: function(direction) {
		yCore.sendJsonRPC(
			'setSpeed',
			'{"jsonrpc": "2.0", "method": "Player.SetSpeed", "params": { "playerid": ' + yCore.activePlayer + ', "speed": "' + direction  +'" }, "id": 1}',
			' '
		);
	},
	setRepeat: function() {//get Repeate status and switch to the next according to current mode. Then update Button
		yCore.sendJsonRPC(
			'GetProperties-repeat',	
			'{"jsonrpc":"2.0","method":"Player.GetProperties", "params": { "playerid": '
				+ yCore.activePlayer + ', "properties": ["repeat","canrepeat"] }, "id": 1}',
			function(resultGetProperties){   // true if "error" doesn't exist in object
				if(resultGetProperties["result"]["repeat"] == "all"){
					yCore.sendJsonRPC(
						'SetRepeat-one',
						'{"jsonrpc": "2.0", "method": "Player.SetRepeat", "params": { "playerid": ' + yCore.activePlayer + ', "repeat": "one" }, "id": 1}',
						' '
					);
					document.getElementById('SetRepeat').innerHTML = "<span class='fa fa-refresh'></span>1";
					$('#SetRepeat').button("refresh");
				} else if (resultGetProperties["result"]["repeat"] == "one"){
					yCore.sendJsonRPC(
						'SetRepeat-off',
						'{"jsonrpc": "2.0", "method": "Player.SetRepeat", "params": { "playerid": ' + yCore.activePlayer + ', "repeat": "off" }, "id": 1}',
						' '
					);
					document.getElementById('SetRepeat').innerHTML = "<span class='fa fa-refresh'></span>off";				
					$('#SetRepeat').button("refresh");				
				} else {
					yCore.sendJsonRPC(
						'SetRepeat-all',
						'{"jsonrpc": "2.0", "method": "Player.SetRepeat", "params": { "playerid": ' + yCore.activePlayer + ', "repeat": "all" }, "id": 1}',
						' '
					);
					document.getElementById('SetRepeat').innerHTML = "<span class='fa fa-refresh'></span>all";		
					$('#SetRepeat').button("refresh");
				}
			}
		);	
	},
	setShuffle: function() {//get Shuffled status and toggle mode. Then update Button.
		yCore.sendJsonRPC(
			'GetProperties-shuffled',	
			'{"jsonrpc":"2.0","method":"Player.GetProperties", "params": { "playerid": '
				+ yCore.activePlayer + ', "properties": ["shuffled","canrepeat"] }, "id": 1}',
			function(resultGetProperties){
				if(resultGetProperties["result"]["shuffled"] == false){
					yCore.sendJsonRPC(
						'SetShuffle-one',
						'{"jsonrpc": "2.0", "method": "Player.SetShuffle", "params": { "playerid": ' + yCore.activePlayer + ', "shuffle": true }, "id": 1}',
						' '
					);
					document.getElementById('SetShuffle').innerHTML = "<span class='fa fa-random'></span>on";
					$('#SetShuffle').button("refresh");
				} else {
					yCore.sendJsonRPC(
						'SetShuffle-all',
						'{"jsonrpc": "2.0", "method": "Player.SetShuffle", "params": { "playerid": ' + yCore.activePlayer + ', "shuffle": false }, "id": 1}',
						' '
					);
					document.getElementById('SetShuffle').innerHTML = "<span class='fa fa-random'></span>off";		
					$('#SetShuffle').button("refresh");
				}
			}
		);
	},	
	simpleJsonRequest: function(actionname) {
		yCore.sendJsonRPC(
			'simpleJsonRequest',
			'{"jsonrpc": "2.0", "method": "' + actionname + '"}',
			' '
		);
	},
	sendTextButton: function(sendText) {
		yCore.sendJsonRPC(
			'SendText',
			'{"jsonrpc": "2.0", "method": "Input.SendText", "params": { "text": "' + sendText + '" }, "id": 1}',
			' '
		);
	},	
	setVolume: function(actionname) {
		if(actionname=="Application.SetMute"){
			yCore.sendJsonRPC(
				'SetMute',
				'{"jsonrpc": "2.0", "method": "Application.SetMute", "params": {"mute":"toggle"}, "id": 1}',
				function(resultSetMute){
					if(resultSetMute["result"] == true){
						document.getElementById('SetMute').innerHTML = "<span class='fa fa-volume-off'></span>";
					} else {
						document.getElementById('SetMute').innerHTML = "<span class='fa fa-volume-up'></span>";
					}
					$('#SetMute').button("refresh");
				}
			);
		} else {
			var Volume = -1;
			yCore.sendJsonRPC(
				'GetProperties',
				'{"jsonrpc":"2.0","method":"Application.GetProperties","params":{"properties":["volume"]},"id":"1"}',
				function(resultGetVolume){
					Volume = resultGetVolume["result"]["volume"];	
					
					if(actionname=="Volume.Plus"){
						Volume += 10;
					} else if (actionname=="Volume.Minus"){
						Volume -= 10;
					} 
					yCore.sendJsonRPC(
						'SetVolume',
						'{"jsonrpc": "2.0", "method": "Application.SetVolume", "params": { "volume": ' + Volume + ' }, "id": 1}',
						' '
					);
				}
			);
		}
	},	
	toggleFullscreen: function(){
		yCore.sendJsonRPC(
			'SetFullscreen',
			'{"jsonrpc": "2.0", "method": "GUI.SetFullscreen", "params": { "fullscreen": "toggle" }, "id": 1}',
			' '
		);
	},
	cleanAndUpdate: function(actionname) { //for buttons to clean or update libraries
		yCore.sendJsonRPC(
			'cleanOrUpdateLibrary',
			'{"jsonrpc":"2.0","method":"' + actionname + '","id":1}',
			' '
		);
	},
}

/*
 * manages everything on playlist-page
 */
var yPl = {
	isDragged: false, //gets set, if a pl-list item is draged to recognise clicks
	currentItem: "", 
	currentItemSongId: "",
	init: function(){
		if(yCore.activePlayer != -1){ //if there is an active Player, activate according playlist
			$("input[name='plType']").filter('[value=' + yCore.activePlayer + ']').prop('checked', true);
		} else {//else take the music playlist
			$("input[name='plType']").filter('[value=0]').prop('checked', true);
		}
		$(".plRadio").checkboxradio("refresh"); //refresh plType after setting it
	
		yPl.getPlaylist();
		
		$('.plRadio').click(function(e){
			e.stopImmediatePropagation();
			yPl.getPlaylist();
		});
		
		$("body").delegate(".plItem", "click", function(e){
			e.stopImmediatePropagation();
			yPl.goto($(this).attr('data-yplnr'));
		});
		
		$("body").delegate(".plRemove", "click", function(e){
			e.stopImmediatePropagation();
			yPl.remove($(this).attr('data-yplnr'));
		});
		
		$("#plBack").click(function(e) {
			window.location.href = "#remote";
		});
		
		$("#plRefresh").click(function(e) {
			e.stopImmediatePropagation();
			yPl.getPlaylist();
		});
		
		$( "#currentplaylist" ).sortable({
			start: function( event, ui ) {
				event.stopImmediatePropagation();
				yPl.isDragged = false;
				$(ui.item).addClass('plItemDragging');
				yPl.currentItem = $(ui.item).attr('data-yplnr'); //remember which item is clicked or dragged
				yPl.currentItemSongId =  $(ui.item).attr('data-songid');
			},
			update: function( event, ui ) {
				event.stopImmediatePropagation();
				yPl.isDragged = true;
				yCore.sendJsonRPC(
					'PlayerRemove',
					'{"jsonrpc": "2.0", "method": "Playlist.Remove", "params": { "playlistid": ' + $("input[name='plType']:checked").val() + ', "position": '+yPl.currentItem+'}, "id": 1}',
					function(resultPlaylistRemove){

						if("error" in resultPlaylistRemove){
							alert(yTools.ts("ALERT_CANT_REMOVE_PLAYING"));
						} else {
							yCore.sendJsonRPC(
								'PlaylistInsert',
								'{"jsonrpc": "2.0", "method": "Playlist.Insert", "params": { "playlistid" :  ' + $("input[name='plType']:checked").val() +  ',"position":'
									+ $(ui.item).index() + ', "item" : {"songid" : ' + yPl.currentItemSongId + '} }, "id": 1}',
								''
							);
						}
						yPl.getPlaylist();
					}
				);
			},
			stop: function( event, ui ) {
				event.stopImmediatePropagation();
					if (!(yPl.isDragged)){//if it's a click on an item
						yPl.goto(yPl.currentItem);
					}
				$(ui.item).children().removeClass('plItemDragging'); //evt.item is here ul-list
			}
		});
	},
	getPlaylist: function(){
	
		if($(location).attr('hash') != "#pl"){return true;} //don't get playlist if not on playlist page
		
		$("#currentplaylist").empty();
		var currentPlayingtitle = "";
		var currentPlayingSpeed = "";
		var isPlaying = "";
		
		yCore.sendJsonRPC(	//get playing title
			'GetItem-yPL-Player-currenttitle',
			'{ "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": '+$("input[name='plType']:checked").val()+', "properties": [ "title"] }, "id": 1 }',
			function(resultGetItem){
				if(!("error" in resultGetItem)){
					currentPlayingtitle = resultGetItem["result"]["item"]["title"];
				}
			}
		);
		
		yCore.sendJsonRPC(	//get playing speed
			'GetProperties-yPL',
			'{"jsonrpc":"2.0","method":"Player.GetProperties", "params": { "playerid": '
				+ $("input[name='plType']:checked").val() + ', "properties": ["speed"] }, "id": 1}',
			function(resultGetProperties){
				if(!("error" in resultGetProperties)){
					currentPlayingSpeed = resultGetProperties["result"]["speed"];
				}
			}
		);
			
		if($("input[name='plType']:checked").val() == "0"){ //if Musicplayer
			yCore.sendJsonRPC(
				'GetItems-yPL-Playlist',						
				'{"jsonrpc": "2.0", "method": "Playlist.GetItems", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail"], "playlistid": 0 }, "id": 1}',				
				function(resultPl){

					if(resultPl["result"]["limits"]["end"] == "0"){//check first if playlist empty
						$("#currentplaylist").append(
							"<li>" + yTools.ts("PL_EMPTY") + "</li>"
						);
					}
				
					for (var i = 0; i < (resultPl["result"]["limits"]["end"]); i++) {
                      
                        var imagetag = "";		// prepare image in advance. if there is no image in DB replace with a placeholder image		
                        if(resultPl["result"]["items"][i]["thumbnail"] == ""){
                            imagetag = "<img class='simpleListPrevPic' alt='' src='images/nofile.png' />";
                        } else {
                            imagetag = "<img class='simpleListPrevPic' alt='' src='http://"+ $(location).attr('host') 
                                    + "/image/"+ encodeURIComponent(resultPl["result"]["items"][i]["thumbnail"]) 
                            +"' />";
                        }
                      
						if(currentPlayingtitle == resultPl["result"]["items"][i]["title"]){
							if(currentPlayingSpeed == 0){
								isPlaying = "<span class='fa fa-pause'></span> ";
							} else {
								isPlaying = "<span class='fa fa-play'></span> ";
							}
						} else {
							isPlaying = "";
						}
						var minutes = Math.floor(resultPl["result"]["items"][i]["duration"] / 60);
						var seconds = resultPl["result"]["items"][i]["duration"] - minutes * 60;
						$("#currentplaylist").append(
							"<li class='plItem simpleList' data-yplnr='" + i + "' data-songid="+resultPl["result"]["items"][i]["id"] +">"
                                + imagetag
								+ "<span class='bold' >" +isPlaying + yTools.addZeroTwoDigits(minutes) +":"+yTools.addZeroTwoDigits(seconds) +"</span> "
								+ "<span>" + resultPl["result"]["items"][i]["title"] + "</span>"
								+ "<span class='italic'>(" + resultPl["result"]["items"][i]["artist"]  + ")</span>"
								+ "<span class='buttonRight'>"
									+ "<button class='plRemove' data-yplnr='" + i + "' data-inline='true' data-theme='b' data-mini='true'>" + yTools.ts("REMOVE") + "</button>"
								+ "</span>"
							+ "</li>"
						).trigger( "create" );
					}
				}
			);
		} else if($("input[name='plType']:checked").val() == "1"){ //if Videoplayer
			yCore.sendJsonRPC(
				'GetItems',							
				'{"jsonrpc": "2.0", "method": "Playlist.GetItems", "params": { "properties": [ "runtime", "showtitle", "season", "title", "artist", "thumbnail" ], "playlistid": 1}, "id": 1}',
				function(resultPl){

					if(resultPl["result"]["limits"]["end"] == "0"){//check first if playlist empty
						$("#currentplaylist").append(
							"<li>" + yTools.ts("PL_EMPTY") + "</li>"
						);
					}

					for (var i = 0; i < (resultPl["result"]["limits"]["end"]); i++) {
                      
                        var imagetag = "";		// prepare image in advance. if there is no image in DB replace with a placeholder image		
                        if(resultPl["result"]["items"][i]["thumbnail"] == ""){
                            imagetag = "<img class='simpleListPrevPic' alt='' src='images/nofile.png' />";
                        } else {
                            imagetag = "<img class='simpleListPrevPic' alt='' src='http://"+ $(location).attr('host') 
                                    + "/image/"+ encodeURIComponent(resultPl["result"]["items"][i]["thumbnail"]) 
                            +"' />";
                        }
                      
						if(currentPlayingtitle == resultPl["result"]["items"][i]["title"]){
							if(currentPlayingSpeed == 0){
								isPlaying = "<span class='fa fa-pause'></span> ";
							} else {
								isPlaying = "<span class='fa fa-play'></span> ";
							}
						} else {
							isPlaying = "";
						}
						var minutes = Math.floor(resultPl["result"]["items"][i]["runtime"] / 60);
						var seconds = resultPl["result"]["items"][i]["runtime"] - minutes * 60;

						if(resultPl["result"]["items"][i]["showtitle"] == ""){
							$("#currentplaylist").append(
								"<li class='plItem simpleList' data-yplnr='" + i + "'>"
                                    + imagetag
									+ "<span class='bold'>" +isPlaying
										+ yTools.addZeroTwoDigits(minutes) +":"+yTools.addZeroTwoDigits(seconds) 
									+ "</span>"
									+ "<span>" + resultPl["result"]["items"][i]["title"] + "</span>"
									+ "<span class='buttonRight'><button class='plRemove' data-yplnr='" + i + "' data-inline='true' data-theme='b' data-mini='true'>" 
										+ yTools.ts("REMOVE") 
									+ "</button></span>"
								+ "</li>"
							).trigger( "create" );
						} else {
							$("#currentplaylist").append(
								"<li class='plItem simpleList' data-yplnr='" + i + "'>"
                                    + imagetag
									+ "<span class='bold'>" +isPlaying
										+ yTools.addZeroTwoDigits(minutes) +":"+yTools.addZeroTwoDigits(seconds) 
									+ "</span>"
									+ "<span>" + resultPl["result"]["items"][i]["title"] + "</span>"
									+ "<span class='italic'>(" + resultPl["result"]["items"][i]["showtitle"]  + ")</span>"
									+ "<span class='buttonRight'><button class='plRemove' data-yplnr='" + i + "' data-inline='true' data-theme='b' data-mini='true'>" 
										+ yTools.ts("REMOVE") 
									+ "</button></span>"
								+ "</li>"
							).trigger( "create" );		
						}
					}
				}
			);
		} else {
			//Space for other possible players
		}
		return true;
	},
	goto: function(plNumber){
		yCore.sendJsonRPC(
			'PlayerOpen',
			'{ "jsonrpc": "2.0", "method": "Player.Open", "params": {"item":{"playlistid":' + $("input[name='plType']:checked").val() + '}}, "id": 1 }',
			function(){
				yCore.sendJsonRPC(
					'PlayerGoto',
					'{"jsonrpc": "2.0", "method": "Player.GoTo", "params": { "playerid": ' + $("input[name='plType']:checked").val() + ', "to": '+plNumber+'}, "id": 1}',
					function(result){
							window.setTimeout(yPl.getPlaylist(),1000);
					}
				);
			}
		);
	},
	remove: function(plNumber){
		yCore.sendJsonRPC(
			'PlayerRemove',
			'{"jsonrpc": "2.0", "method": "Playlist.Remove", "params": { "playlistid": ' + $("input[name='plType']:checked").val() + ', "position": '+plNumber+'}, "id": 1}',
			function(resultPlaylistRemove){
				if("error" in resultPlaylistRemove){
					alert(yTools.ts("ALERT_CANT_REMOVE_PLAYING"));
				}
				window.setTimeout(yPl.getPlaylist(),1000);
			}
		);
	}
}

/*
 * All functions to show and hide footer info. the info get functions are in yCore
 */
var yFooter = { 
	footerVisible: false,
	isDragging: false,
	seekTime: [0,0,0], //hours, minutes, seconds
	bubbleSetVisible: false,
	startDragPlayTimeSeconds: 0,
	
	init: function() {

		if (!yFooter.footerVisible){
			$(".seek-bubble").hide();
			$(".footerImage").hide();
			$(".footerTitle").hide();
			$(".footerTime").hide();
		}

		$(".footer-left").click(function(e) {
			e.stopImmediatePropagation();
			
			if (!yFooter.footerVisible){
				yFooter.footerVisible = true;
				$(".footer").css( "width", "100%" );
				$(".footer").css( "height", "40px" );
				$(".footer-left").removeClass("footer-left-in");
				$(".footer-left").addClass("footer-left-out");

				if (yFooter.bubbleSetVisible)$(".seek-bubble").show();
				if(yCore.activePlayer != -1)$(".footerImage").show();
				$(".footerTime").show();					
				if(yCore.activePlayer != -1)$(".footerTitle").show();
			} else {
				yFooter.footerVisible = false;
				$(".footer").css( "width", "0px" );
				$(".footer").css( "height", "60px" );
				$(".footer-left").removeClass("footer-left-out");
				$(".footer-left").addClass("footer-left-in");

				$(".seek-bubble").hide();
				$(".footerImage").hide();
				$(".footerTitle").hide();
				$(".footerTime").hide();
			}
		});
		
		$(".footer").click(function(e) {
			e.stopImmediatePropagation();
			if (!yFooter.bubbleSetVisible) {
				$(".seek-bubble").show();
			} else {
				$(".seek-bubble").hide();
			}
			yFooter.bubbleSetVisible = !yFooter.bubbleSetVisible;
		});
		
		$(".seek-bubble").draggable({
			axis: "x",
			start: function( event, ui ) {
				//save the current playing time at the start of draging for drag function
				yFooter.startDragPlayTimeSeconds = yCore.currentPlayTimeSeconds;
			},
			stop: function( event, ui ) {
                event.stopImmediatePropagation();//TODO: does this solve that sometimes draggable runs without dragging 
                //TODO is event, and ui necessary?
				yFooter.isDragging = false;
				
				$("#seek-overlay").html("&nbsp;");
				$("#seek-overlay").hide();
				
				yCore.sendJsonRPC(
					'PlayerSeek',
					'{"jsonrpc":"2.0","id":1,"method":"Player.Seek","params":{"playerid":' + yCore.activePlayer + ',"value":{"hours": ' + yFooter.seekTime[0] + ', "minutes": ' + yFooter.seekTime[1] +', "seconds": ' + yFooter.seekTime[2] + '}}}',
					''
				);
			},
			drag: function( event, ui ) {
				yFooter.isDragging = true;
				
				$("#seek-overlay").show();
				
				var offset = $(this).offset();
				//"accumulated seconds position where i am aiming now" = total time in seconds * "percentage of current place to windowwidth" / 100
				var newMediaPos = (yCore.totalPlayTimeSeconds * (((offset.left+25) * 100)/$(window).width()) / 100);
				
				var mediaPosDiff = "";
				var mediaPosPrefix = "";
				
				if(yFooter.startDragPlayTimeSeconds < newMediaPos ){
					mediaPosDiff = newMediaPos - yFooter.startDragPlayTimeSeconds;
					mediaPosPrefix = "+";
				} else {
					mediaPosDiff = yFooter.startDragPlayTimeSeconds - newMediaPos;
					mediaPosPrefix = "-";
				}
				
				yFooter.seekTime[0] = Math.floor(newMediaPos / 3600); //save hours
				yFooter.seekTime[1] = Math.floor((newMediaPos % 3600)/60); //save minutes
				yFooter.seekTime[2] =  Math.floor((newMediaPos % 3600) % 60); //save seconds
				
				$("#seek-overlay").html(yTools.addZeroTwoDigits(yFooter.seekTime[0]) + ":" + yTools.addZeroTwoDigits(yFooter.seekTime[1]) 
					+ ":" +  yTools.addZeroTwoDigits(yFooter.seekTime[2]) + "<br />" + mediaPosPrefix + ""
					+ yTools.addZeroTwoDigits(Math.floor(mediaPosDiff / 3600)) + ":" 
					+ yTools.addZeroTwoDigits(Math.floor((mediaPosDiff % 3600)/60)) + ":"
					+ yTools.addZeroTwoDigits(Math.floor((mediaPosDiff % 3600) % 60))
				);
			}
		});
	}
}

/*
 * All functions to get movie infos and the functions of the movie page
 */
var yMovies = {
	moviesJSON: "",
	genres: [],
	genreString: "",
	languages: [],
	documentReadyAlreadyRun: false,
	listPos: 0,
	listLength: 0,
	lastListItem: 0,
	firstListItem: [0],
	init: function() {
		
		if(yS.hideSearchMovies){$("#searchMovies").parent().hide();} //hide movieSearch field if set in settings
		if(yS.hideLanguageMovies){$("#languageSelect").parent().hide();} //hide language selection field if set in settings
		if(yS.hideGenreMovies){$("#genreSelect").parent().hide();} //hide  genre selection  field if set in settings
		 		
		
		if (!yMovies.documentReadyAlreadyRun){  //that it doesn't run twice
			yMovies.documentReadyAlreadyRun = 1;
			yMovies.getMovies();
		}
		
		$("body").delegate(".openMovieItem", "click", function(e){  //set movie information in popup
			e.stopImmediatePropagation();	
			yMovies.openMovieItem($(this).attr('data-yMovieId'));	
		});

		$('#detailspopupMovies').bind({  // if popup is closed, remove picture path
			popupafterclose: function(event, ui) {
				$("#popupImageMovies").attr("src","images/transparent.gif");
				$('#popupPlay').text(yTools.ts("PLAY")).button("refresh");
			}
		});
		
		$("#detailspopupMoviesClose").click(function(e) {
			e.stopImmediatePropagation();
			$('#detailspopupMovies').popup("close");
		});		

		$("body").delegate("#popupPlay", "click", function(e){ //start movie
			e.stopImmediatePropagation();
			yMovies.popupPlay($(this).attr('data-yMovieArrayNr'));
		});

		$("body").delegate("#popupTrailer", "click", function(e){ //start trailer to movie
			e.stopImmediatePropagation();
			yMovies.popupTrailer($(this).attr('data-yMovieArrayNr'));
		});
		
		$("#searchMovies").keyup(function() {
			$('#movie_list').empty(); //empty ul to update list with new choices
			$("#movie-flex-prev").empty();
			$("#movie-flex-next").empty();
			yMovies.firstListItem = [0]; //to get track of what was search to go back with button
			yMovies.createMovieList(0, $('#genreSelect option:selected').attr('value'),$('#languageSelect option:selected').attr('value'), $("#searchMovies").attr('value')); 
		});
		
		$("body").delegate("#movieListPrev", "click", function(e){  //checkbox select/unselect reverser
			e.stopImmediatePropagation();
			yMovies.listPos = yMovies.firstListItem.pop(); //if one back, remove item from trail-array
			$("#movie_list").empty();
			$("#movie-flex-prev").empty();
			$("#movie-flex-next").empty();
			
			yMovies.createMovieList(yMovies.listPos, $('#genreSelect option:selected').attr('value'),$('#languageSelect option:selected').attr('value'), $("#searchMovies").attr('value')); 
            
            //scroll to top
            $('html,body').animate({scrollTop: $("#movies").offset().top},'fast');
		});

		$("body").delegate("#movieListNext", "click", function(e){  //checkbox select/unselect reverser
			e.stopImmediatePropagation();
			yMovies.listPos = yMovies.lastListItem + 1; //befor creating new list remeber the position where to start
			
			//remember first item of list in trail-array to go back later
			yMovies.firstListItem.push(parseInt($( "#movie_list" ).children().eq(0).attr('data-yMovieId')));	
			
			$("#movie_list").empty();
			$("#movie-flex-prev").empty();
			$("#movie-flex-next").empty();
			yMovies.createMovieList(yMovies.listPos, $('#genreSelect option:selected').attr('value'),$('#languageSelect option:selected').attr('value'), $("#searchMovies").attr('value'));
            
            //scroll to top
            $('html,body').animate({scrollTop: $("#movies").offset().top},'fast');
		});
	},
	/*
	 * Get movies from the library
	 */
	getMovies: function(){
		yCore.sendJsonRPC(
			'GetMovies',
			'{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "limits": { "start": 0 }, "properties": [ "plot", "trailer", "title", "runtime", "year", "genre", "rating", "thumbnail", "file", "playcount", "streamdetails"], "sort": { "method": "sorttitle", "ignorearticle": true }}, "id": 1}',				
			function(result){
				yMovies.moviesJSON = result; //write result in Array for further use 
				yMovies.createMovieList(0, "all", "all",$("#searchMovies").attr('value'));

				$('#genreSelect').change(function() {  //create Action Listener for list with selection choice
					$('#movie_list').empty(); //empty ul to update list with new choices
                    $("#movie-flex-prev").empty();
                    $("#movie-flex-next").empty();
					yMovies.firstListItem = [0]; //if selection changed, start from the beginning
					yMovies.createMovieList(0, $(this).val(), $('#languageSelect option:selected').attr('value'),$("#searchMovies").attr('value')); //create movieslist accouding to options
				});

				$('#languageSelect').change(function() {  //create Action Listener for list with selection choice
					$('#movie_list').empty(); //empty ul to update list with new choices
                    $("#movie-flex-prev").empty();
                    $("#movie-flex-next").empty();
					yMovies.firstListItem = [0];//if selection changed, start from the beginning
					yMovies.createMovieList(0, $('#genreSelect option:selected').attr('value'),$(this).val(), $("#searchMovies").attr('value')); //create movieslist according to options
				});
			}
		);
	},
	/*
	 * Set information to according movie in popup
	 */
	openMovieItem: function(movieNr) {

		yMovies.genresToString(movieNr);
		
		var md_year = yMovies.moviesJSON["result"]["movies"][movieNr]["year"];
		if(md_year > 0){md_year = " (" + md_year + ")";}else{md_year="";}
		
		var	 md_runtime = Math.round(yMovies.moviesJSON["result"]["movies"][movieNr]["runtime"]/60);
		if (md_runtime > 0){md_runtime += "min";}else{ md_runtime = "unknown";}
		
		if(!yS.hidePrevPics){
			$("#popupImageMovies").attr("src","http://images.weserv.nl/?url=" + decodeURIComponent(yMovies.moviesJSON["result"]["movies"][movieNr]["thumbnail"]).substring(15) + "&h=200");
		} 
		
		if(yMovies.moviesJSON["result"]["movies"][movieNr]["playcount"]>0){
			$("#popupGreenTick").attr("src","images/green_tick.png");
			$("#popupGreenTick").show();
		}
		else {
			$("#popupGreenTick").hide();
		}
		
		$("#popupTitleMovies").text(yMovies.moviesJSON["result"]["movies"][movieNr]["title"] + md_year);	
		document.getElementById('popupRating').innerHTML = (yTools.ts("RATING") + ": "  + yTools.ratingToStars(yMovies.moviesJSON["result"]["movies"][movieNr]["rating"]));
		$("div#popupRuntimeMovies").text(yTools.ts("RUNTIME") + ": " + md_runtime);	
		$("div#popupGenreMovies").text(yTools.ts("GENRES") + ": " + yMovies.genreString);
		$("div#popupPlotMovies").text(yMovies.moviesJSON["result"]["movies"][movieNr]["plot"]);
		if(!yS.hideLanguageMovies){
			document.getElementById('popupLanguagesFlags').innerHTML = yTools.pathToFlags(yMovies.moviesJSON["result"]["movies"][movieNr]["streamdetails"]["audio"]);
		}
		$("#popupPlay").attr("data-yMovieArrayNr", movieNr);
		if(yMovies.moviesJSON["result"]["movies"][movieNr]["trailer"] == ""){ //if there is an empty trailer string
			$("#popupTrailer").parent().hide();
		} else {
			$("#popupTrailer").attr("data-yMovieArrayNr", movieNr);
			$("#popupTrailer").parent().show();
		}
		if(!yS.hideFileLinkMovies){$("div#popupFilelink").text("Filelink: " + yMovies.moviesJSON["result"]["movies"][movieNr]["file"]);}
		$('#detailspopupMovies').popup('open');	
},	
	/*
	 * Function who runs in the beginning or if movielist changes
	 * and creates items in the list according to settings:
	 * which genre, which language, which search list term, what part of the list, if listitems per page reduced
	 */
	createMovieList: function(listStart, genre, lang, searchval) {  //create movielist in DOM
		var selectedGenre = genre;
		var selectedLang = lang;
		var movieGenreInItem;
		var langToCode= new Array(); //needed for language to languagecode translation
		var tempGenreLenth = yMovies.genres.length; //save length to check later if it is the first time to be updated
		
		itemsInList = 0; //needed to find out, how many items are shown, so that if list is restricted we know if next button has to be shown
		
		yMovies.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button
		
		
		//check if there is anything in the lib. eigther hide loading bar and show info
		if(yMovies.moviesJSON["result"]["limits"]["total"] == 0){
			$("#movie_list").append("<li><h3>" + yTools.ts("LIB_EMPTY") + "</h3></li>").trigger( "create" );
			$("#loading_movie").hide();
		} else {//or start list filling
			if(yS.listLength > yMovies.moviesJSON["result"]["limits"]["end"]){
				yMovies.listLength = yMovies.moviesJSON["result"]["limits"]["end"];
			} else{
				yMovies.listLength = yS.listLength;
			}
				
			//only show back button if it is not the start of the list
			if(yMovies.listPos != 0){		
				$("#movie-flex-prev").append(
					"<a id='movieListPrev' data-yMovieId='movieListPrev' class='flexListPrevNext'>"
                      +" <div class=''>" 
                          + "<div>"
                              + "<img class='moviePrevPicArrow' alt='Previous items in list button' src='images/listprev.png' />" 
                          + "</div>" 
                          + "<div>"
                              + "<h4>" + yTools.ts("BACK") +"</h4>"
                          + "</div>" 
                      + "</div>"
					+"</a>" 
				);	
				$("#movie-flex-prev").show(); 
			} else {$("#movie-flex-prev").hide(); }
				
			//all movies
			for (var i = 0; i < yMovies.moviesJSON["result"]["limits"]["end"]; i++) { 
				langToCode.length = 0;;
				movieGenreInItem = -1;
				var flags = ""; //set var new for each movie
				
				var m_filePath = yMovies.moviesJSON["result"]["movies"][i]["file"];
				
				
				/*
				 * There are two places, where it searches for language:
				 *  first the streamdetails form kodi, if there is something, add some additional data: 
				 * 			- the languages full name, 
				 * 			- which flag should be used to represent the language
				 * 			- and the isocode, for further reverence, if it is already added to streamdetails
				 * */
				
				if(!yS.hideLanguageMovies){
					//add flag and "language-native" to streamdetails of the yarc internal movies-array
					for (var j=0;  j < yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"].length; j++){//run whole kodi-language list
						if(yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["language"] in langCodeToDescFlag){//if code is in json
							var lang = yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["language"]
							yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["native"] = langCodeToDescFlag[lang]["native"];
							yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["flag"] = langCodeToDescFlag[lang]["flag"];
							yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["isocode"] = lang;
							if ( $("#languageSelect option[value=" + lang + "]").length == 0 ){
								$('#languageSelect').append("<option value='"	+ lang + "'>" + langCodeToDescFlag[lang]["native"] + "</option>");
							}
							
						}
					}
					
					/*
					*  secondly, it searches for isocodes in the filename which has to be in brackets [], if there is found something, it also 
					*  addes the additional data into the streamdetails-audio (yarc internal only)
					*/
					if(m_filePath.indexOf("[") >= 0){//if there is no starting bracket in filepath, don't even try
						for (var code in langCodeToDescFlag) { //go trough every isocode in the list
							if (langCodeToDescFlag.hasOwnProperty(code)) {
								if (m_filePath.toLowerCase().indexOf("["+code+"]") >= 0) {//if code is found in filename	
									var codeIsSet = false;
									for (var j=0;  j < yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"].length; j++){//go trough whole streamdetails-audio list
										if(code == yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["isocode"]){//if code is already in streamdetails-audio...
											codeIsSet = true;//... remeber it to...
										}
									}
									if(!codeIsSet){//..not add it again to streamdetails list
										var streamdet = {native:langCodeToDescFlag[code].native, flag:langCodeToDescFlag[code].flag, isocode:code};//prepare object to be pushed into streamdetails-audio
										yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"].push(streamdet);//push object above
										if ( $("#languageSelect option[value=" + code + "]").length == 0 ){//if language is not in languageselect,
											$('#languageSelect').append("<option value='"+ code + "'>" + langCodeToDescFlag[code].native + "</option>");
										}
									}
								}
							}
						}
					}
				}
				
				for (var j=0; j < yMovies.moviesJSON["result"]["movies"][i]["genre"].length; j++){ //all genres in movie
					if (!(jQuery.inArray(yMovies.moviesJSON["result"]["movies"][i]["genre"][j], yMovies.genres) > -1)){//push if not already there
						yMovies.genres.push(yMovies.moviesJSON["result"]["movies"][i]["genre"][j]);	
					} 
					//if movie is equal to the selected genre remember it.
					if (selectedGenre == yMovies.moviesJSON["result"]["movies"][i]["genre"][j]){ 
						movieGenreInItem = 1;	 
					}
				}
				
				if(selectedGenre == "all" || movieGenreInItem == 1){ //runs per movie if in genre selcet all or a matching genre is selected
					if(selectedLang == "all"){ //runs per movie if in language selcet all or a matching language is selected
						
						//first check if searchfield Value is undefinde (no input yet) and then if the title is matching (in lowercase)
						if(searchval === undefined || yMovies.moviesJSON["result"]["movies"][i]["title"].toLowerCase().indexOf(searchval.toLowerCase()) != -1){
							
							//skip what should not be seen
							if(i >= yMovies.listPos && itemsInList < yMovies.listLength){
								
								var m_runtime = Math.round(yMovies.moviesJSON["result"]["movies"][i]["runtime"]/60);
								if (m_runtime > 0){m_runtime += "min";}else{ m_runtime = "unknown";} //makes runtime string if aviable
								
								var m_year = yMovies.moviesJSON["result"]["movies"][i]["year"];
								if (m_year < 1){m_year = "unknown";} //makes year string if unaviable
								
								if(yMovies.moviesJSON["result"]["movies"][i]["playcount"]>0){
									if(yS.hideWatched){continue;}//if setting says to not show seen movies, go to next iteration
									var isSeen = "<img class='greenMovies' alt='Movie is seen' src='images/green_tick.png' />";
								}
								else {var isSeen = "";} //add img tag if movie is registered as min. seen once
								
								if(!yS.hideLanguageMovies){
									flags =  yTools.pathToFlags(yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"]);
								} else {
									flags = "";
								}
								
								$("#movie_list").append(
									"<a class='openMovieItem' data-yMovieId='" + i + "'>"
                                      + "<div class='movieItem' data-yMovieId='" + i + "'>"
                                        + "<div>"
                                          + "<img class='moviePrevPic' alt='' src='http://images.weserv.nl/?url=" 
                                                  + decodeURIComponent(yMovies.moviesJSON["result"]["movies"][i]["thumbnail"]).substring(15) 
                                                  + "&h=80&w=50&t=absolute&q=" + yS.prevImgQualMovies + "' />"
                                              + isSeen 
                                        + "</div>" 
                                        + "<div>"
                                          + "<h4>" + yMovies.moviesJSON["result"]["movies"][i]["title"] + "</h4>"
                                          + "<p>" + yTools.ts("YEAR") + ": " + m_year + " " + yTools.ts("RUNTIME") + ": " + m_runtime + "</p>"
                                           + "<p>" + yTools.ts("RATING")+ ": "  + yTools.ratingToStars(yMovies.moviesJSON["result"]["movies"][i]["rating"]) + "</p>"
                                          + "<p>" + flags	+ "</p>"
                                        + "</div>" 
                                      + "</div>"
									+"</a>"
								);
								itemsInList++; 
								yMovies.lastListItem = i; //remember last item of the list
							}
						}
						//movieGenreInItem = 0; //set Movie in Genre again to 0 for next run
					} else {
							for (var k=0;  k < yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"].length; k++){//go trough whole audio info's
								if(yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][k]["isocode"] == selectedLang){//if code is in streamdatails-audio
									if(searchval === undefined || yMovies.moviesJSON["result"]["movies"][i]["title"].toLowerCase().indexOf(searchval.toLowerCase()) != -1){
										//skip what should not be seen
										if(i >= yMovies.listPos && itemsInList < yMovies.listLength){
											var m_runtime = Math.round(yMovies.moviesJSON["result"]["movies"][i]["runtime"]/60);
											if (m_runtime > 0){m_runtime += "min";}else{ m_runtime = "unknown";} //makes runtime string if aviable
											
											var m_year = yMovies.moviesJSON["result"]["movies"][i]["year"];
											if (m_year < 1){m_year = "unknown";} //makes year string if unaviable
											
											if(yMovies.moviesJSON["result"]["movies"][i]["playcount"]>0){
												if(yS.hideWatched){continue;}//if setting says to not show seen movies, go to next iteration
												var isSeen = "<img class='greenMovies' alt='movie is marked as seen' src='images/green_tick.png' />";
											}
											else {var isSeen = "";} //add img tag if movie is registered as min. seen once
																
											$("#movie_list").append(
												"<a class='openMovieItem' data-yMovieId='" + i + "'>"
                                                  + "<div class='movieItem' data-yMovieId='" + i + "'>"
                                                    + "<div>"
                                                        + "<img class='moviePrevPic' alt='' src='http://images.weserv.nl/?url=" 
                                                        + decodeURIComponent(yMovies.moviesJSON["result"]["movies"][i]["thumbnail"]).substring(15) 
                                                        + "&h=80&w=50&t=absolute&q=" + yS.prevImgQualMovies + "' />"
                                                        + isSeen 
                                                    + "</div>" 
                                                    + "<div>"
                                                        + "<h4>" + yMovies.moviesJSON["result"]["movies"][i]["title"] + "</h4>"
                                                        + "<p>Year: " + m_year + " " + yTools.ts("RUNTIME") + ": " + m_runtime + "</p>"
                                                        + "<p>" + yTools.ts("RATING") + ": "  + yTools.ratingToStars(yMovies.moviesJSON["result"]["movies"][i]["rating"]) + "</p>"
                                                        + "<p>" + yTools.pathToFlags(yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"])	+ "</p>"
                                                    + "</div>" 
                                                  + "</div>"
												+"</a>"
											);
											itemsInList++; 
											yMovies.lastListItem = i; //remember last item of the list
										}
									}
									movieGenreInItem = 0; //set Movie in Genre again to 0 for next run
								}
 							}
						}
					}	
					
					if(yS.hidePrevPics){$(".moviePrevPic").remove();} //hide previmage if set in settings
					if(yS.hidePrevPics){$(".greenMovies").remove();}  //hide green arrow if set in settings
				}
				
				//only show if not at the end of the list, or no more items in the list to show
				if(!($(".openMovieItem").length < yS.listLength)){	
					$("#movie-flex-next").append(
						"<a id='movieListNext' data-yMovieId='movieListNext' class='flexListPrevNext'>"
								+" <div class='movieItem' >" 
									+ "<div>"
										+ "<img class='moviePrevPicArrow' alt='Next items' src='images/listnext.png' />"  
									+ "</div>" 
									+ "<div>"
										+ "<h4>" + yTools.ts("NEXT") +"</h4>"
										+ "</div>" 
									+ "</div>"
						+"</a>" 
					);
					$("#movie-flex-next").show();
				} else {$("#movie-flex-next").hide(); }

				if ( !$('#movie_list').children().length ){ //if there are no children, say so
					$("#movie_list").append(yTools.ts("NO_MATCH"));
				}
				
				$("#loading_movie").hide();
				
				if(tempGenreLenth <= 0){ //only populate if it is the first time
					yMovies.genres.sort()
					for (var i=0; i < yMovies.genres.length; i++){  //add genre Options to selection
						$('#genreSelect').append("<option value='" + yMovies.genres[i] + "'>" + yMovies.genres[i] + "</option>");
					}
					
					//also sort language select  //commeted out since it does not work and kills the "next button feature" don't know why yet
					/*$('#languageSelect').append($("#languageSelect option").remove().sort(function(a, b) {
							var at = $(a).text(), bt = $(b).text();
							return (at > bt)?1:((at < bt)?-1:0);
					}));*/
				}
			}//end else of check if there is something in the library	
			
			
	},
	/*
	 * Writes gernes into a single sting for popup
	 */
	genresToString: function(movieNr){
		yMovies.genreString = ""; //empty, to remove previous content, to avoid wrong or multiple informations
		for (var j=0; j < yMovies.moviesJSON["result"]["movies"][movieNr]["genre"].length; j++){ //all genres in movie
			yMovies.genreString += yMovies.moviesJSON["result"]["movies"][movieNr]["genre"][j];
			if (j !=  (yMovies.moviesJSON["result"]["movies"][movieNr]["genre"].length -1)) { yMovies.genreString += ", "; }
		}
		if (yMovies.genreString==""){yMovies.genreString+="unknown"};			
	},
	/*
	 * start movie
	 */
	popupPlay: function(movieNr){
		$('#popupPlay').text(yTools.ts("LOADING")).button("refresh"); // change button text because of long JSON Call time
		yCore.sendJsonRPC(
			'PlayerOpen',
			'{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "movieid": '
			+ yMovies.moviesJSON["result"]["movies"][movieNr]["movieid"] + ' } }, "id": 1 }',
			function(){window.location.href = "#remote";}
		);
	},	
	/*
	 * watch trailer for movie
	 */
	popupTrailer: function(movieNr){
		$('#popupTrailer').text(yTools.ts("LOADING")).button("refresh"); // change button text because of long JSON Call time
		yCore.sendJsonRPC(
			'PlayerOpen',
			'{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' 
				+ yMovies.moviesJSON["result"]["movies"][movieNr]["trailer"] + '" } }, "id": 1 }',
			function(){$('#popupTrailer').text(yTools.ts("TRAILER")).button("refresh");}
		);
	}
}

/*
 * All functions to get Tv-show infos and the functions of the series page
 */
var ySeries = {
	TVShowID: "",
	already_run: false, 
	episodeDetails: new Array(),
	init: function() {
		
		if (!ySeries.already_run){  //that it doesn't run twice
		ySeries.already_run = true; 
		
		jQuery.ajax({ //gets series and puts them as a collapsible in DOM
			async: false,
			headers: { 
				'Accept': 'application/json',
				'Content-Type': 'application/json' 
			},
			type: "POST",
			'url': '/jsonrpc?getTVShows',
			'data': '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { "properties": ["art", "title",  "thumbnail"], "sort": { "method": "sorttitle", "ignorearticle": true }}, "id": 1}',
			'dataType': 'json',
			'success': function(resultGetTVShows){
						//check if there is anything in the lib. eigther show info or hide loading bar
						if(resultGetTVShows["result"]["limits"]["total"] == 0)
						{
							$("#series_list").append("<li><h3>" + yTools.ts("LIB_EMPTY") + "</h3></li>").trigger( "create" );
							$(".loading").hide();
						} else {
							
							var seriesThumbAddon = "";
							
							for (var i = 0; i < resultGetTVShows["result"]["limits"]["end"]; i++) {
								var TVShowID = resultGetTVShows["result"]["tvshows"][i]["tvshowid"];
								var TVShowName = resultGetTVShows["result"]["tvshows"][i]["title"];
								if(!yS.hidePrevPics){
									seriesThumbAddon ="<img class='seriesThumbAddon' alt='" + TVShowName 
													+ "' src='" + decodeURIComponent(resultGetTVShows["result"]["tvshows"][i]["art"]["banner"]).substring(8).slice(0, -1) 
													+ "'/>";
								} else {
									seriesThumbAddon = TVShowName;
								}
								
								$("#series_list").append(
									"<li>"
										+ "<div data-role='collapsible' class='openSeries' data-yTVShowID='" + TVShowID + "'>"
											+ "<h3>"
												+ seriesThumbAddon
											+ "</h3>"
										+ "</div>"
										+ "<div id='"	+ TVShowID	+ "'></div>"
									+ "</li>"
								).trigger( "create" );
							}
							$("#loading_series").hide();
						}
					}   
			});
		}
		
		$("body").delegate(".showEpidodeDetails", "click", function(e){ //opens and fills popup with episode details
			e.stopImmediatePropagation();	
			ySeries.showEpidodeDetails($(this).attr('data-yEpisodeID'));				
		});
		
		$('#detailspopupSeries').bind({ //removes imgae of episode details popup
			popupafterclose: function(event, ui) {
					$("#popupImageSeries").attr("src","images/transparent.gif");
			}
		});
		
		$("#detailspopupSeriesClose").click(function(e) {
				e.stopImmediatePropagation();
				$('#detailspopupSeries').popup("close");
		});		
		
		$("body").delegate("#popupPlaySeries", "click", function(e){ // starts episode 
			e.stopImmediatePropagation();
			ySeries.popupPlaySeries($(this).attr('data-yPlaySeriesPath'));
		});
		
		$('.openSeries').bind('collapse',function(e){ //removes episodes from DOM if series is closed
			var node = document.getElementById($(this).attr('data-yTVShowID'));
			if ( node.hasChildNodes() ){
				while ( node.childNodes.length >= 1 ){
					node.removeChild( node.firstChild );       
				} 
			}	

		});
			
		$('.openSeries').bind('expand',function(e){ //gets seasons of series and puts them in a list and add's it to DOM
			e.stopImmediatePropagation();	
			ySeries.openSeries($(this).attr('data-yTVShowID'));
		});
	},
	/*
	 * called if a Series (or TV-show) is opened
	 */
	openSeries: function(TvShowId){
		var TVShowSeasonID = ""; 
		yCore.sendJsonRPC(
			'GetSeasons',
			'{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": {"properties": ["season", "showtitle", "fanart"], "tvshowid":' 
									+ TvShowId + '}, "id": 1}',
			function(resultGetSeasons){
				for (var j = 0; j < resultGetSeasons["result"]["limits"]["end"]; j++) {
					var TVShowSeasonID = resultGetSeasons["result"]["seasons"][j]["season"]; // that right season is in right collapsible
					$("#"+TvShowId).append(
						"<div data-role='collapsible' class='openSeason' data-yTVShowSeasonID='" + TVShowSeasonID + "'>"
							+ "<h3>" + resultGetSeasons["result"]["seasons"][j]["label"]+ "</h3>"
							+ "<div id='"+TvShowId+"-"+TVShowSeasonID+"'></div>"
						+ "</div>"
					).trigger( "create" );
					
					yCore.sendJsonRPC(
						'GetEpisodes',
						'{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "properties": ["season","episode", "showtitle", "plot", "thumbnail", "file", "rating", "playcount", "streamdetails"],"tvshowid":' + TvShowId + ',"season" : ' + TVShowSeasonID + ' }, "id": 1}',
						function(resultGetEpisodes){
							for (var k = 0; k < resultGetEpisodes["result"]["limits"]["end"]; k++) {
                                
								if(resultGetEpisodes["result"]["episodes"][k]["playcount"]>0){
                                    if(yS.hideWatched){continue;}//if setting says to not show seen episodes, go to next iteration
									var seen = "<img class='greenSeries' alt='media is seen' src='images/green_tick.png' />";
								}
								else {var seen = "";}
								$("#"+TvShowId+"-"+TVShowSeasonID).append(
								"<a class='showEpidodeDetails' data-yEpisodeID='"+ resultGetEpisodes["result"]["episodes"][k]["episodeid"] + "'>"
									+ "<li class='series-item'> "
                                    
//                                     http://images.weserv.nl/?url=" 
// 												+ decodeURIComponent(resultOpenAddon["result"]["files"][i]["thumbnail"]).substring(15).slice(0, -1)  + "&h=85&t=fit&q=" 
// 											+ yS.prevImgQualMovies + "
                                    
                                        + "<img class='seriesPrevPic' alt='Episode Preview Image' src=' http://images.weserv.nl/?url=" 
                                          + decodeURIComponent(resultGetEpisodes["result"]["episodes"][k]["thumbnail"]).substring(15).slice(0, -1) 
                                          + "&h=85&t=fit&q=" + yS.prevImgQualMovies + "' />"
										+ seen 
										+ "<span><h4 class='white'>" + resultGetEpisodes["result"]["episodes"][k]["label"] + "</h4></span>"
									+ "</li>"
								+ "</a>"
								);
							}
							//removes season collapsible, if empty
							if (!$("#"+TvShowId+"-"+TVShowSeasonID + " li"  ).children().length){
									$("#"+TvShowId+"-"+TVShowSeasonID).parent().parent().remove(); //[check: better selector
									$("#"+TvShowId).append("<div>Season "+TVShowSeasonID +": "+ yTools.ts("NO_MATCH")+"</div>").trigger( "create" );
							}
						},
						false
					);
				}
			}
		);
	},
	/*
	 * called if a Episode is opened
	 */
	showEpidodeDetails: function(episodeID){
		yCore.sendJsonRPC(
			'GetEpisodeDetails',
			'{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodeDetails", "params": { "properties": ["season","episode", "showtitle", "plot", "fanart", "thumbnail", 				"file", "rating", "playcount", "streamdetails"],"episodeid":' + episodeID + '}, "id": 1}',
			function(resultGetEpisodeDetails){
				
				ySeries.episodeDetails = resultGetEpisodeDetails["result"]["episodedetails"];
				
				if(!yS.hidePrevPics){
					$("#popupImageSeries").attr(
						"src","http://images.weserv.nl/?url=" 
						+ decodeURIComponent(ySeries.episodeDetails["thumbnail"]).substring(15).slice(0, -1) 
						+ "&h=150&q=95"
					);
				}
				
				if(!yS.hideLanguageMovies){
					//add flag and "language-native" to streamdetails of the yarc internal movies-array
					for (var j=0;  j < ySeries.episodeDetails["streamdetails"]["audio"].length; j++){//run whole kodi-language list
						if(ySeries.episodeDetails["streamdetails"]["audio"][j]["language"] in langCodeToDescFlag){//if code is in json
							var lang = ySeries.episodeDetails["streamdetails"]["audio"][j]["language"]
							ySeries.episodeDetails["streamdetails"]["audio"][j]["native"] = langCodeToDescFlag[lang]["native"];
							ySeries.episodeDetails["streamdetails"]["audio"][j]["flag"] = langCodeToDescFlag[lang]["flag"];
							ySeries.episodeDetails["streamdetails"]["audio"][j]["isocode"] = lang;						
						}
					}
					
					/*
					*  secondly, it searches for isocodes in the filename which has to be in brackets [], if there is found something, it also 
					*  addes the additional data into the streamdetails-audio (yarc internal only)
					*/
					if(ySeries.episodeDetails["file"].indexOf("[") >= 0){//if there is no starting bracket in filepath, don't even try
						for (var code in langCodeToDescFlag) { //go trough every isocode in the list
							if (langCodeToDescFlag.hasOwnProperty(code)) {
								if (ySeries.episodeDetails["file"].toLowerCase().indexOf("["+code+"]") >= 0) {//if code is found in filename	
									var codeIsSet = false;
									//go trough whole streamdetails-audio list
									for (var j=0;  j < ySeries.episodeDetails["streamdetails"]["audio"].length; j++){
										//if code is already in streamdetails-audio...
										if(code == ySeries.episodeDetails["streamdetails"]["audio"][j]["isocode"]){
											codeIsSet = true;//... remeber it to...
										}
									}
									if(!codeIsSet){//..not add it again to aopton list
										var streamdet = {native:langCodeToDescFlag[code].native, flag:langCodeToDescFlag[code].flag, isocode:code};//prepare object to be pushed into streamdetails-audio
										ySeries.episodeDetails["streamdetails"]["audio"].push(streamdet);//push object above
									}
								}
							}
						}
					}
				}
				
				
				$("#popupTitleSeries").text(ySeries.episodeDetails["showtitle"] + " - " + ySeries.episodeDetails["label"]+" - Season "+ ySeries.episodeDetails["season"] + " Episode " + ySeries.episodeDetails["episode"]);	
				document.getElementById('popupRatingSeries').innerHTML = (yTools.ts("RATING")+ ": "  +  yTools.ratingToStars(ySeries.episodeDetails["rating"]));
				$("div#popupPlotSeries").text(ySeries.episodeDetails["plot"]);
				if(!yS.hideLanguageMovies){
					document.getElementById('popupLanguagesFlagsSeries').innerHTML = yTools.pathToFlags(ySeries.episodeDetails["streamdetails"]["audio"]);
				}
				$("#popupPlaySeries").attr("data-yPlaySeriesPath", ySeries.episodeDetails["file"]);
				$('#detailspopupSeries').popup('open');
			}
		);
		
		$('#detailspopupSeries').popup('open');
	},	
	/*
	 * called to play an episode
	 */
	popupPlaySeries: function(pathToFile){
		$('#popupPlaySeries').text(yTools.ts("LOADING")).button("refresh"); // change button text because of long JSON Call time			
		yCore.sendJsonRPC(
			'PlayerOpen',
			'{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' + pathToFile + '" } }, "id": 1 }',
			function(){ 
				window.location.href = "#remote";
				$('#popupPlaySeries').text(yTools.ts("PLAY")).button("refresh");
			}
		);
	}
}

/*
 * All functions to get music infos and the functions of the music page
 */
var yMusic = {
	albumJSON:[],
	genres: [],
	already_run:false,
	listPos: 0,
	listLength: 0,
	artistString: "",
	lastListItem: 0,
	firstListItem: [0], //keep track of trail when mooving forward in restricted list
	init: function() {
		
		if(yS.hideSearchMusic){$("#searchMusic").parent().hide();} //hide Search field if set in settings
		if(yS.hideGenreMusic){$("#genreSelectMusic").parent().hide();} //hide  genre selection  field if set in settings
		
		if (!yMusic.already_run){
			yMusic.already_run = true; 
			yCore.sendJsonRPC(
				'GetAlbums',
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": {"properties": ["title", "thumbnail", "artist", "genre"], "sort": { "order": "ascending", "method": "artist", "ignorearticle": true } }, "id": 1}',
				function(resultGetAlbums){
										
					yMusic.albumJSON = resultGetAlbums; //write result in Array for further use 
					yMusic.createAlbumList(0, "all", "");

					$('#genreSelectMusic').change(function() {  //create Action Listener for list with selection choice
						$('#album_list').empty(); //empty ul to update list with new choices
                        $("#album-flex-prev").empty();
                        $("#album-flex-next").empty();
						
						yMusic.firstListItem = [0];  //if selection changed, start from the beginning
						yMusic.createAlbumList(0, $('#genreSelectMusic').val(), $("#searchMusic").attr('value')); //create albumlist according to options
					});
				}
			);
		}
		
		$("body").delegate(".showAlbum", "click", function(e){
			e.stopImmediatePropagation();	
			yMusic.showAlbum($(this).attr('data-yAlbumArrayID')); //give in first attr Kodi-album-id and in the second internal reference		
		});
		
		$("#searchMusic").keyup(function() {
			$('#album_list').empty(); //empty ul to update list with new choices
			$("#album-flex-prev").empty();
			$("#album-flex-next").empty();
			yMusic.firstListItem = [0];//if selection changed, start from the beginning
			yMusic.createAlbumList(0, $('#genreSelectMusic').val(), $("#searchMusic").attr('value'));
		});
		
		$("body").delegate("#playPlaylist", "click", function(e){  
			yMusic.playPlaylist();
		});
		
		$("body").delegate("#emptyPlaylist", "click", function(e){  
			yMusic.emptyPlaylist();
		});		
		
		$("#detailspopupMusicClose").click(function(e) {
			e.stopImmediatePropagation();
			$('#detailspopupMusic').popup("close");
		});			
		
		$("body").delegate("#popupAddAlbum", "click", function(e){
			e.stopImmediatePropagation();	
			yMusic.popupAddAlbum($(this).attr('data-yAlbumArrayNr'));		
		});
		
		$("body").delegate(".playSong", "click", function(e){ 
			e.stopImmediatePropagation();
			if($("input[name='popupMusicAddPL']:checked").val() == "1"){
					$(this).fadeTo(500, 0.2); //grey out if added to playlist
			}
			yMusic.playSong($(this).attr('data-ySongId'));
		});
		
		$("body").delegate("#albumListPrev", "click", function(e){  //checkbox select/unselect reverser
			e.stopImmediatePropagation();
			yMusic.listPos = yMusic.firstListItem.pop();//if one back, remove item from trail-array
			$('#album_list').empty();
			$("#album-flex-prev").empty();
			$("#album-flex-next").empty();
			yMusic.createAlbumList(yMusic.listPos, $('#genreSelectMusic').val(), $("#searchMusic").attr('value'));
            
            //scroll to top
            $('html,body').animate({scrollTop: $("#music").offset().top},'fast');
		});

		$("body").delegate("#albumListNext", "click", function(e){  //checkbox select/unselect reverser
			e.stopImmediatePropagation();
			yMusic.listPos = yMusic.lastListItem + 1;//befor creating new list remeber the position where to start
						
            yMusic.firstListItem.push(parseInt($( "#album_list" ).children().eq(0).attr('data-yAlbumArrayID')));
			
			$('#album_list').empty();
			$("#album-flex-prev").empty();
			$("#album-flex-next").empty();
			yMusic.createAlbumList(yMusic.listPos, $('#genreSelectMusic').val(), $("#searchMusic").attr('value'));
            
            //scroll to top
            $('html,body').animate({scrollTop: $("#music").offset().top},'fast');
		});
	},
	/*
	 * create the music list according to the selections (genre and searchfield)
	 */
	createAlbumList: function (listStart, genre, searchval) {
		var selectedGenre = genre;
		var albumGenreInItem;
		var tempGenreLenth = yMusic.genres.length; //save length to check later if it is the first time to be updated
		itemsInList = 0; //needed to find out, how many items are shown, so that if list is restricted we know if next button has to be shown
		
		if(yMusic.albumJSON["result"]["limits"]["total"] == 0){
			$("#album_list").append("<li><h3>" + yTools.ts("LIB_EMPTY") + "</h3></li>").trigger( "create" );
			$("#loading_music").hide();
		} else {
	
			yMusic.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button
			
			if(yS.listLength > yMusic.albumJSON["result"]["limits"]["end"]){
				yMusic.listLength = yMusic.albumJSON["result"]["limits"]["end"];
			} else{
				yMusic.listLength = yS.listLength;
			}
			
			if(yMusic.listPos > 1){//only add back button if it is not the first page	
				$("#album-flex-prev").append(
					"<a id='albumListPrev' data-yAlbumArrayID='albumListPrev' class='flexListPrevNext'>"
                      +" <div class='' data-yAlbumArrayID='albumListPrev'>" 
                        + "<img class='musicPrevPicArrow' alt='Previous items in list button' src='images/listprev.png' />" 
                        + "<h4>" + yTools.ts("BACK") +"</h4>"
                      + "</div>"
					+"</a>" 
				);
                $("#album-flex-prev").show();
            }else {$("#album-flex-prev").hide(); }
			for (var i = 0; i < (yMusic.albumJSON["result"]["limits"]["end"]); i++) { //all albums
				for (var j=0; j < yMusic.albumJSON["result"]["albums"][i]["genre"].length; j++){ //all genres in movie
					if (!(jQuery.inArray(yMusic.albumJSON["result"]["albums"][i]["genre"][j], yMusic.genres) > -1)){ //push if already not therel
						yMusic.genres.push(yMusic.albumJSON["result"]["albums"][i]["genre"][j]);	
					} 
					if (selectedGenre == yMusic.albumJSON["result"]["albums"][i]["genre"][j]){
						albumGenreInItem = 1;	//remember it, if album has the selected genre
					}
				}
				
				//show only elements with the given genre
				if($('#genreSelectMusic option:selected').attr('value') == "all" || albumGenreInItem == 1){
					// show only titles and artists (so far only first in artistsarray) matched to searchstring, also partly
					if(searchval === undefined || yMusic.albumJSON["result"]["albums"][i]["title"].toLowerCase().indexOf(searchval.toLowerCase()) != -1 || yMusic.albumJSON["result"]["albums"][i]["artist"]["0"].toLowerCase().indexOf(searchval.toLowerCase()) != -1){

						//skip what should not be seen
						if(i >= yMusic.listPos && itemsInList < yMusic.listLength){

                          var imagetag = "";		// prepare image in advance. if there is no image in DB replace with a placeholder image		
                          if(yMusic.albumJSON["result"]["albums"][i]["thumbnail"] == ""){
                              imagetag = "<img class='musicPrevPic' alt='' src='images/nofile.png' />";
                          } else {
                              imagetag = "<img class='musicPrevPic' alt='' src='http://"+ $(location).attr('host') 
                                      + "/image/"+ encodeURIComponent(yMusic.albumJSON["result"]["albums"][i]["thumbnail"]) 
                              +"' />";
                          }
                          
                          $("#album_list").append(
                              "<a class='showAlbum' data-yAlbumArrayID='" + i + "'>"
                                +" <div class='' data-yAlbumArrayID='" + i + "'>" 
                                    + imagetag 
                                    + "<div><h4>" + yMusic.albumJSON["result"]["albums"][i]["title"] + "</h4>"
                                    +" <p class='musicListArtist'>" +  yTools.artistsToString(yMusic.albumJSON["result"]["albums"][i]["artist"]) + "</p></div>"
                                + "</div>"
                              +"</a>" 
                          );
                          itemsInList++; 
                          yMusic.lastListItem = i; //remember last item of the list
						}
					}
				}
				albumGenreInItem = 0;
				if(yS.hidePrevPics){$(".musicPrevPic").remove();} //hide previmage if set in settings
			}
			
			//only show if not at the end of the list, and no more items in the list to show
			
			if(!($(".showAlbum").length < yS.listLength)){
				$("#album-flex-next").append(
					"<a id='albumListNext' data-yAlbumArrayID='albumListNext' class='flexListPrevNext'>"
						+" <div>" 
							+ "<img class='musicPrevPicArrow' alt='Next items in list button' src='images/listnext.png' />"  
							+ "<h4>" + yTools.ts("NEXT") +"</h4>"
						+ "</div>"
					+"</a>" 
				);
                $("#album-flex-next").show();
            }else {$("#album-flex-next").hide(); }
			
			if ( !$("#album_list").children().length ){ //if there are no children, say so
				$("#album_list").append(yTools.ts("NO_MATCH"));
			}

			$("#loading_music").hide();
			if(tempGenreLenth <= 0){ //only populate if it is the first time
				yMusic.genres.sort()
				for (var i=0; i < yMusic.genres.length; i++){  //add genre Options to selection
					$('#genreSelectMusic').append("<option value='" + yMusic.genres[i] + "'>" + yMusic.genres[i] + "</option>");
				}
			}
		}
	},
	/*
	 * runs if an album is opened
	 */
	showAlbum: function (albumArrayNr) {	
		$("#popupContainerMusic").empty();
		yCore.sendJsonRPC(
			'GetSongs',
			'{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { "properties": ["title", "artist", "genre", "track", "duration", "album", "thumbnail"], 				"filter": { "albumid" : ' + yMusic.albumJSON["result"]["albums"][albumArrayNr]["albumid"] + '} }, "id": 1}',
			function(resultGetSongsAlbum){
				$("#popupAddAlbum").attr("data-yAlbumArrayNr",albumArrayNr);
				
                $("#popupTitleMusic").text( yTools.artistsToString(yMusic.albumJSON["result"]["albums"][albumArrayNr]["artist"]) + ": " 
						+ yMusic.albumJSON["result"]["albums"][albumArrayNr]["label"]);
				
				if(yMusic.albumJSON["result"]["albums"][albumArrayNr]['thumbnail'] == ""){
					$("#popupImageMusic").hide();
				} else {
					if(!yS.hidePrevPics){
							$("#popupImageMusic").attr("src","http://"+ $(location).attr('host') + "/image/" 
							+ encodeURIComponent(yMusic.albumJSON["result"]["albums"][albumArrayNr]['thumbnail'])+"");
					}
					$("#popupImageMusic").show();
				}
				for (var i = 0; i < resultGetSongsAlbum["result"]["limits"]["end"]; i++) {
					var trackNumber = "";
					if(resultGetSongsAlbum['result']['songs'][i]['track'] != "0"){
							trackNumber = resultGetSongsAlbum['result']['songs'][i]['track'] + ") ";
					}
					$("#popupContainerMusic").append(
						"<li class='playSong' data-ySongId='" + resultGetSongsAlbum['result']['songs'][i]['songid'] + "'> "
							+ trackNumber 
							+ resultGetSongsAlbum['result']['songs'][i]['title']
							+ " ("+ Math.floor(resultGetSongsAlbum['result']['songs'][i]['duration']/60)+ ":" 
							+ yTools.addZeroTwoDigits(resultGetSongsAlbum['result']['songs'][i]['duration'] % 60)
							+ ")"
						+ "</li>"
					);
				}
			}
		);
		$('#detailspopupMusic').popup('open');		
	},
	playPlaylist: function () {
		$('#playPlaylist').text(yTools.ts("LOADING")).button("refresh");
		setTimeout(function(){$('#playPlaylist').text(yTools.ts("PLAY_PL")).button("refresh");}, 1500);
		yCore.sendJsonRPC(
			'PlayerOpen',
			'{ "jsonrpc": "2.0", "method": "Player.Open", "params": {"item":{"playlistid":0},"options":{"repeat":"off"}}, "id": 1 }',
			function(){ window.location.href = "#remote";}
		);
	},
	emptyPlaylist: function () {
		$('#emptyPlaylist').text(yTools.ts("DONE")).button("refresh");         
		setTimeout(function(){$('#emptyPlaylist').text(yTools.ts("EMPTY_PL")).button("refresh");}, 1500); //change text back in 1.5 seconds
		yCore.sendJsonRPC(
			'PlaylistClear',
			'{"jsonrpc": "2.0", "id": 0, "method": "Playlist.Clear", "params": {"playlistid": 0}}',
			''
		);
	},
	/*
	 * Empty Playlist, Add whole Album and Play
	 */
	popupAddAlbum: function (albumJsonNr) {
		yCore.sendJsonRPC(
			'PlaylistClear',
			'{"jsonrpc": "2.0", "id": 0, "method": "Playlist.Clear", "params": {"playlistid": 0}}',
			''
		);
		yCore.sendJsonRPC(
			'PlaylistAdd',
			'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 0 , "item" : {"albumid" : ' + yMusic.albumJSON["result"]["albums"][albumJsonNr]["albumid"] + '} }, "id": 1}',
			
			function(){
				yCore.sendJsonRPC(
					'PlayerOpen',
					'{ "jsonrpc": "2.0", "method": "Player.Open", "params": {"item":{"playlistid":0},"options":{"repeat":"off"}}, "id": 1 }',
					function(){ window.location.href = "#remote";}
				)
			}
		);
	},
	/*
	 * Play a song clicked in Playlist, and if "Add to playlist" active, it just adds it to playlist
	 */
	playSong: function (songid) {			
		if($("input[name='popupMusicAddPL']:checked").val() == "1"){//if add to pl set
			yCore.sendJsonRPC(
				'PlaylistAdd',
				'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 0 , "item" : {"songid" : ' + songid + '} }, "id": 1}',
				''
			);
		} else {//else play directly
			yCore.sendJsonRPC(
				'PlaylistAdd',
				'{"jsonrpc": "2.0", "method": "Player.Open", "params": { "item" : {"songid" : ' + songid + '} }, "id": 1}',
				''
			);
		}
	}
}
/*
 * All functions to search for a specific page
 */
var ySongSearch = {
	songs: "",
	init: function() {
		yCore.sendJsonRPC(
			'GetSongs',
			'{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { "properties": [ "album", "thumbnail", "artist"], "sort": { "order": "ascending", "ignorearticle": true } }, "id": "libSongs"}',
			function(resultGetSongs){								
				ySongSearch.songs = resultGetSongs;
				$("#loading_songsearch").hide();
			}
		);
		
		$("body").delegate("#music-search", "click", function(e){
			e.stopImmediatePropagation();
			$('#songsearch-list').empty();
			ySongSearch.searchPrintSong($("#songsearch-searchfield").attr('value'));
		});
		
		$("body").delegate(".songlistItem", "click", function(e){
			e.stopImmediatePropagation();
			yCore.sendJsonRPC(
				'PlayerOpen',
				'{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "songid": '
					+ $(this).attr('data-ySongId') + ' } }, "id": 1 }',
					''
			);
		});
		
		$("body").delegate(".songSearchAddPl", "click", function(e){
			e.stopImmediatePropagation();
			$(this).button('disable');
			yCore.sendJsonRPC(
				'PlaylistAdd',
				'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 0 , "item" : {"songid" : ' + $(this).attr('data-ySongId') + '} }, "id": 1}',
				''
			);
	});
		
		$("body").delegate("#music-songsearchBack", "click", function(e){
			window.location.href = "#music";
		});
	},
	searchPrintSong: function (searchString) {
		var rangeReg = /.{3}(.+ ?)*/;//at least 3 characters
		if (!rangeReg.test($('[name=songsearch-searchfield]').val())) {
			alert(yTools.ts("ALERT_SONGSEARCH"));
			return false;
		}
				
		for (var i = 0; i < (ySongSearch.songs["result"]["limits"]["end"]); i++) {        
          
            var imagetag = "";		// prepare image in advance. if there is no image in DB replace with a placeholder image		
            if(ySongSearch.songs["result"]["songs"][i]["thumbnail"] == ""){
                imagetag = "<img class='simpleListPrevPic' alt='' src='images/nofile.png' />";
            } else {
                imagetag = "<img class='simpleListPrevPic' alt='' src='http://"+ $(location).attr('host') 
                        + "/image/"+ encodeURIComponent(ySongSearch.songs["result"]["songs"][i]["thumbnail"]) 
                +"' />";
            }
            
			if(ySongSearch.songs["result"]["songs"][i]["label"].toLowerCase().indexOf(searchString.toLowerCase()) != -1){
				$("#songsearch-list").append(
					"<li class='simpleList' data-ySongId='" + ySongSearch.songs["result"]["songs"][i]["songid"] + "'>"
                      + imagetag
                      + "<span class='bold'>" + ySongSearch.songs["result"]["songs"][i]["label"] + "</span>"
                      + "<span class='italic'>("+ yTools.artistsToString(ySongSearch.songs["result"]["songs"][i]["artist"]) 
                        + ": " + ySongSearch.songs["result"]["songs"][i]["album"]  + ")"
                      + "</span>"
                      + "<span class='buttonRight'>"
                        + "<button class='songSearchAddPl' data-ySongId='" + ySongSearch.songs["result"]["songs"][i]["songid"] 
                          + "' data-inline='true' data-theme='b' data-mini='true'>" + yTools.ts("ADD_PLAYLIST") 
                        + "</button>"
                      + "</span>"
                    + "</li>"
				).trigger( "create" );
			}
		}
		if ($('#songsearch-list li').length == 0){//if there are no results found, say so
			$('#songsearch-list').append(
              "<li>" + yTools.ts("NO_MATCH") + "</li>"
			);
		}
		return false;
	}
}
/*
 * All functions to get addons and the functions of the addon page
 */
var yAddons = {
	addonJSON: [],
	listPos: 0,
	listLength: 0,
	already_run: false,
	addonBackPath: [],
	init: function() {
	
		if(yS.hideSearchAddons){$("#searchAddon").parent().hide();} //hide Search field if set in settings
		if(yS.hideGenreAddons){$("#addonSelect").parent().hide();} //hide  genre selection  field if set in settings
		
		if (!yAddons.already_run){  //that it doesn't run twice
			yAddons.already_run = true;
            
            $("#stayInAddonPopup").prop('checked', yS.stayInAddonPopupSetting).checkboxradio("refresh");
            
			yCore.sendJsonRPC(
				'GetAddons',
				'{"jsonrpc": "2.0", "method": "Addons.GetAddons", "params": { "enabled": true, "type" : "xbmc.python.pluginsource", "properties": ["name", "thumbnail", "fanart"]}, "id": 1}',
				function(resultGetAddons){
					yAddons.addonJSON = resultGetAddons;
                    
                    //inject an item for Kodi favorites in the addon list and add the numbers
                    yAddons.addonJSON.result.addons.push({addonid:"plugin.kodi.kodi_fav",name: yTools.ts("KODI_FAVS"),thumbnail:"images/star_grey.png"});                    
                    yAddons.addonJSON["result"]["limits"]["end"] += 1;
                    yAddons.addonJSON["result"]["limits"]["total"] += 1;
                    
                    //check if there is a localStorage key for this addon. if not, create one...
					for (var i = 0; i < (yAddons.addonJSON["result"]["limits"]["end"]); i++) {
						if (localStorage.getItem(yAddons.addonJSON["result"]["addons"][i]["addonid"]) === null) {
							localStorage.setItem(yAddons.addonJSON["result"]["addons"][i]["addonid"], "1");					
						}
					}
					
					$("#loading_addon").hide();
					
					yAddons.createAddonList(0, "all", "");
				}
			);
			
		}
		$("body").delegate(".addonlist-item", "click", function(e){  //executes addon
			e.stopImmediatePropagation();
            
            //if the addon is my own injected one, get Kodi Favorites
            if($(this).attr('data-yAddonID') == "plugin.kodi.kodi_fav") { 
				$("#addonspopupList").empty();
				$("#popupImageAddons").attr("src","");
                yAddons.openKodiFavs($(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));
            }			
			//if the same addon gets opened again (without opening another one in betweeen), dont change the popup (go to mask, which was left)
			else if($("#detailspopupAddons").attr('data-yAddonname') != $(this).attr('data-yAddonID')) { 
				$("#addonspopupList").empty();
				$("#popupImageAddons").attr("src","");
				yAddons.populateAddon("plugin://" +$(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));
			}
			$('#detailspopupAddons').popup('open');
			
			//get localStorage Key for addon-startcount, increment by one and save it again.
			localStorage.setItem($(this).attr('data-yAddonID'), JSON.stringify(JSON.parse(localStorage.getItem($(this).attr('data-yAddonID')))+1));
		});
		
		$('#addonSelect').change(function() {
			$('#addonlist').empty(); //empty ul to update list with new choices
			$("#addon-flex-prev").empty();
			$("#addon-flex-next").empty();
			yAddons.createAddonList(0, $('#addonSelect option:selected').attr('value'), $("#searchAddon").attr('value'));
		});
		
		$("#searchAddon").keyup(function() {
			$("#addonlist").empty(); //empty ul to update list with new choices
			$("#addon-flex-prev").empty();
			$("#addon-flex-next").empty();
			yAddons.createAddonList(0, $('#addonSelect option:selected').attr('value'), $("#searchAddon").attr('value'));
		});
		
		$("body").delegate("#addonListPrev", "click", function(e){  //checkbox select/unselect reverser
			e.stopImmediatePropagation();
			yAddons.listPos -= yS.listLength;
			$("#addonlist").empty();
			$("#addon-flex-prev").empty();
			$("#addon-flex-next").empty();
			yAddons.createAddonList(yAddons.listPos, $('#addonSelect option:selected').attr('value'), $("#searchAddon").attr('value'));
            
            //scroll to top
            $('html,body').animate({scrollTop: $("#addons").offset().top},'fast');
		});

		$("body").delegate("#addonListNext", "click", function(e){  //checkbox select/unselect reverser
			e.stopImmediatePropagation();
			yAddons.listPos += yS.listLength;
			$("#addonlist").empty();
			$("#addon-flex-prev").empty();
			$("#addon-flex-next").empty();
			yAddons.createAddonList(yAddons.listPos, $('#addonSelect option:selected').attr('value'), $("#searchAddon").attr('value'));
            
            //scroll to top
            $('html,body').animate({scrollTop: $("#addons").offset().top},'fast');
		});
		
		$("#detailspopupAddonsClose").click(function(e) {
			e.stopImmediatePropagation();
			$('#detailspopupAddons').popup("close");
		});
		
		$("#addonspopupRefresh").click(function(e) {
			e.stopImmediatePropagation();
			$("#addonspopupList").empty();
			yAddons.populateAddon($(this).attr('data-yAddonDirPath'), $(this).attr('data-yAddonFanartPath'));
            
            //scroll to top of addon
            $('html,body').animate({scrollTop: $("#SendTextAddon").offset().top},'slow');
		});
		$("#addonspopupopenaddon").click(function(e) {
			e.stopImmediatePropagation();
			yAddons.openAddon($(this).attr('data-yAddonDirPath'));
				
		});
		$("#addonpopshowplot").change(function(e) {
			e.stopImmediatePropagation();
			if($(this).is(':checked')){
				$(".addonPlot").show();
			} else {
				$(".addonPlot").hide();
				
			}
		});
		
		$("#SendTextButtonAddon").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.sendTextButton($('#SendTextFieldAddon').val());
		});
		
		$("body").delegate(".showAddonDirItem", "click", function(e){
			e.stopImmediatePropagation();
			if($(this).attr('data-yAddonFileType') == "file" || $(this).attr('data-yAddonFileType') == "media"){
			
				yCore.sendJsonRPC(
                    'PlayerOpen',
					'{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' + $(this).attr('data-yAddonFile') + '" } }, "id": 1 }',
					''
				);   
                if(!$("#stayInAddonPopup").is(':checked')){
                    window.location.href = "#remote";
                }
                
			} else if ($(this).attr('data-yAddonFileType') == "directory" || $(this).attr('data-yAddonFileType') == "window"){
                if($(this).attr('data-yaddonfile') == "plugin.kodi.kodi_fav"){
                     yAddons.openKodiFavs($(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));
                }
				$("#addonspopupList").empty();
				yAddons.populateAddon($(this).attr('data-yAddonFile'), $(this).attr('data-yAddonFanartPath'));
				if( $(this).attr('data-yAddonIsBack') == "back"){
					yAddons.addonBackPath.pop();yAddons.addonBackPath.pop();
				}
                
                //scroll to top of addon
                $('html,body').animate({scrollTop: $("#SendTextAddon").offset().top},'slow');
			} 
		});
				
	},
				
	/*
	 * creates addonselection according to type selection and or search string
	 */
	createAddonList: function(listStart, addonTypeSelected, searchval){
				
		itemsInList = 0; //needed to find out, how many items are shown, so that if list is restricted we know if the next-button has to be shown
		yAddons.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button
		
		if(yAddons.addonJSON["result"]["limits"]["total"] == 0){
			$("#addonlist").append("<li><h3>" + yTools.ts("LIB_EMPTY") + "</h3></li>").trigger( "create" );
			$(".loading").hide();
		} else {
			if(yS.listLength > yAddons.addonJSON["result"]["limits"]["end"]){
				yAddons.listLength = yAddons.addonJSON["result"]["limits"]["end"];
			} else{
				yAddons.listLength = yS.listLength;
			}
			
			if(yAddons.listPos != 0){	 //only add if it's not the first page (value 999999 makes it first item
				$("#addon-flex-prev").append(
					"<li id='addonListPrev' class='flexListPrevNext'> "
						+ "<img class='addonImageArrow' alt='Previous items in list button' src='images/listprev.png' />"
						+ "<h4 class='addontitle'>" + yTools.ts("BACK") +"</h4>"
					+ "</li>"
				);
                $("#addon-flex-prev").show();
            } else {$("#addon-flex-prev").hide(); }
			
			
			for (var i = 0; i < (yAddons.addonJSON["result"]["limits"]["end"]); i++) {
				var stringparts = yAddons.addonJSON["result"]["addons"][i]["addonid"].split('.');
				
				var imagetag = "";						
				if(!yS.hidePrevPics){
                    if(yAddons.addonJSON["result"]["addons"][i]["addonid"] != "plugin.kodi.kodi_fav"){
						imagetag ="<img alt='' class='addonImage' src='http://"+ $(location).attr('host') 
										+ "/image/"+ encodeURIComponent(yAddons.addonJSON["result"]["addons"][i]["thumbnail"]) 
									+ "' />";
                    } else {
						imagetag ="<img alt='' class='addonImage' src='images/star_grey.png' />";                      
                    }
				}

				if (addonTypeSelected == "all" || stringparts[1] == addonTypeSelected){ 
					if(searchval === undefined || yAddons.addonJSON["result"]["addons"][i]["name"].toLowerCase().indexOf(searchval.toLowerCase()) != -1){
						$("#addonlist").append(
						"<li class='addonlist-item' data-yAddonID='" + yAddons.addonJSON["result"]["addons"][i]["addonid"] + "' "
							+ "data-yAddonFanartPath='" + yAddons.addonJSON["result"]["addons"][i]["fanart"] + "' "
							+ "value='" + localStorage.getItem(yAddons.addonJSON["result"]["addons"][i]["addonid"]) + "'> "
							+ imagetag
							+ "<h4 class='addontitle'>" + yAddons.addonJSON["result"]["addons"][i]["name"] + "</h4>"
						+ "</li>");
						itemsInList++;
					}
				}
			}
			
			//sort the addonlist (li... value) by value, descending; there is saved how many times the addon was opened from this addon
			$("#addonlist").html(
              $("#addonlist").children("li").sort(function (a, b) {
                  return $(b).val() - $(a).val();
              })
            );
            
			//only show if not at the end of the list, and no more items in the list to show
			if((yAddons.listPos + yAddons.listLength) < yAddons.addonJSON["result"]["limits"]["end"] && (yAddons.listPos + yAddons.listLength) < itemsInList){		
				$("#addon-flex-next").append(//value 0 makes button the last one in list
					"<li id='addonListNext' class='flexListPrevNext'> "
						+ "<img class='addonImageArrow' alt='Next items in list button'  src='images/listnext.png' />"
						+ "<h4 class='addontitle'>" + yTools.ts("NEXT") +"</h4>"
					+ "</li>"
				);
                $("#addon-flex-next").show();
            } else {$("#addon-flex-next").hide(); }
			
			$(".addonlist-item").hide(); //first hide all to prepare negative of slice
			$(".addonlist-item").slice(yAddons.listPos, (yAddons.listPos+yAddons.listLength)).show();
			
			if ( !$("#addonlist").children().length ){ //if there are no children, say so
				$("#addonlist").append(yTools.ts("NO_MATCH"));
			}
		}	
	},
	populateAddon:  function(addonIDandPath, prevfanartpath){		
		$("#loading_addonPopup").show();
						
		//'{"jsonrpc":"2.0","method":"Files.GetDirectory","id":1,"params":["plugin://' + addonIDandPath + '/","video"
		//"title","size","mimetype","file","dateadded","thumbnail","artistid","albumid","uniqueid"],{"method":"title","order":"ascending"}
		var mediatype = "";
		if(addonIDandPath.indexOf('audio') >= 0){mediatype = "music";} 
		else {mediatype = "video";}
		
		yCore.sendJsonRPC(
			'OpenAddon_' + addonIDandPath,
			'{"jsonrpc":"2.0","method":"Files.GetDirectory","id":1,"params":["' + addonIDandPath + '","' + mediatype + '",["title","file","thumbnail", "playcount","art","plot","runtime", "premiered"]]}',
			function(resultOpenAddon){
				
				//if there is fanart, show it in the background
				if(prevfanartpath == ""){
					$("#popupImageAddons").hide();
				} else if(!yS.hidePrevPics){
					if((decodeURIComponent(prevfanartpath)).indexOf("http://") >=0 || (decodeURIComponent(prevfanartpath)).indexOf("https://") >=0){
						$("#popupImageAddons").attr("src","http://"+ decodeURIComponent(prevfanartpath).substring(15).slice(0, -1));
						$("#popupImageAddons").show();
					} else {
						$("#popupImageAddons").attr("src","http://"+ $(location).attr('host') + "/image/" + encodeURIComponent(prevfanartpath));
						$("#popupImageAddons").show();
					}
				}
				
				//add the back-button, when back history (addonBackPath) is not empty
				if(yAddons.addonBackPath.length > 0){
					$("#addonspopupList").append(
						"<a class='showAddonDirItem' "
						+ "data-yAddonFile='" + yAddons.addonBackPath[yAddons.addonBackPath.length-1][0] //the path from the previous item
						+ "' data-yAddonFileType='directory'"
						+ " data-yAddonIsBack='back' data-yAddonFanartPath='" + yAddons.addonBackPath[yAddons.addonBackPath.length-1][1] +"'>" //fanart from previous item
							+"<li class='addonDirItem'>"
								+ "<img class='addonDirBackPic' alt='back button' src='images/listprev.png' />"  
								+ "<h4>" + yTools.ts("BACK") + "</h4>"
							+"</li>"
						+"</a>" 
					);
				}
				
				//go trough whole returned list
				for (var i = 0; i < resultOpenAddon["result"]["limits"]["end"]; i++) {
					
					//if setting says to not show seen movies, go to next iteration
					if(yS.hideWatched && resultOpenAddon["result"]["files"][i]["playcount"]>0){continue;}
					
					/* prepare image in advance. if there is no image in DB replace with a placeholder image
					 * if no tumbnail, set placeholder eighter file or folder
					 * if tumbnail, if it is from the internet, prepare accodringly, or prepare accordingly if it is local*/
					var imagetag = "";
					if(!yS.hidePrevPics){
						if(resultOpenAddon["result"]["files"][i]["thumbnail"] == ""){
							if(resultOpenAddon["result"]["files"][i]["filetype"] == "file"){
								imagetag = "<img class='addonDirPrevPic' alt='' src='images/file.png' />";
							} else {
								imagetag = "<img class='addonDirPrevPic' alt='' src='images/folder.png' />";
							}
						} else {
							if((decodeURIComponent(resultOpenAddon["result"]["files"][i]["thumbnail"])).indexOf("http://") >=0 || (decodeURIComponent(resultOpenAddon["result"]["files"][i]["thumbnail"])).indexOf("https://") >=0){
								imagetag = "<img class='addonDirPrevPic' src='http://images.weserv.nl/?url=" 
												+ decodeURIComponent(resultOpenAddon["result"]["files"][i]["thumbnail"]).substring(15).slice(0, -1)  + "&h=85&t=fit&q=" 
											+ yS.prevImgQualMovies + "' />";
							} else {
								imagetag = "<img class='addonDirPrevPic' alt='' src='http://"+ $(location).attr('host') + "/image/" 
												+ encodeURIComponent(resultOpenAddon["result"]["files"][i]["thumbnail"])
											+"' />";
							}
						}
					}
					
					//show green Tick if played before
					if(resultOpenAddon["result"]["files"][i]["playcount"]>0){
						imagetag += "<img class='greenAddons' alt='' src='images/green_tick.png' />"
					}
					
					//get rid of the ugly [] brackets with [b] and [color=....] in filenames
					var itemLabel = resultOpenAddon["result"]["files"][i]["label"];
					if(itemLabel.indexOf('[') >= 0){
						var itemLabel = itemLabel.replace(/(\[.*?\])/g, '');
					}
					
					//prepare plot if there is any
					var plot = "";
					if(undefined != resultOpenAddon["result"]["files"][i]["plot"]){
						plot = resultOpenAddon["result"]["files"][i]["plot"];
					}										
					
					//if it's a file, runtime is positive and even exists, write the runtime in minutes and seconds
                    var additionalInfo = "";
					if(resultOpenAddon["result"]["files"][i]["filetype"] == "file"){
                        var minutes =  "";
                        var seconds = "";
                        if("premiered" in resultOpenAddon["result"]["files"][i] && resultOpenAddon["result"]["files"][i]["premiered"] != ""){
                          additionalInfo += resultOpenAddon["result"]["files"][i]["premiered"];
                        }   
						if(resultOpenAddon["result"]["files"][i]["runtime"] != "0" && ("runtime" in resultOpenAddon["result"]["files"][i])){
                          var minutes = Math.floor(resultOpenAddon["result"]["files"][i]["runtime"] / 60);
                          var seconds = resultOpenAddon["result"]["files"][i]["runtime"] - minutes * 60;
                          
                          if(additionalInfo != ""){additionalInfo += "; "}
                          additionalInfo +=  yTools.ts("RUNTIME") + ": " +yTools.addZeroTwoDigits(minutes) + ":" + yTools.addZeroTwoDigits(seconds);
                        }
                        
                         if(additionalInfo != ""){ additionalInfo = " (" + additionalInfo + ")"}
					}
					
					//check if there is a poster, if not and there is a thumbnail take it, else take one from the previous dialoge
					//this is all to give the infos over, to the next dialoge, it's not used right now, but in the next dialoge if element klicked
					var fanartpath = ""
					if(!yS.hidePrevPics){
						if ("poster" in resultOpenAddon["result"]["files"][i]["art"]){
							fanartpath = resultOpenAddon["result"]["files"][i]["art"]["poster"]
						} else if ("thumbnail" in resultOpenAddon["result"]["files"][i]) {
							fanartpath = resultOpenAddon["result"]["files"][i]["thumbnail"]
						} else {
							fanartpath = prevfanartpath;
						}
					}               
                    
					$("#addonspopupList").append(
						"<a class='showAddonDirItem' "
						+ "data-yAddonFile='" + resultOpenAddon["result"]["files"][i]["file"]
						+ "' data-yAddonFileType='" + resultOpenAddon["result"]["files"][i]["filetype"]
						+ "' data-yAddonIsBack='' data-yAddonFanartPath='" + fanartpath 
						+"'>"
							+"<li class='addonDirItem'>"
								+ imagetag 
								+ "<h4>" + itemLabel + "</h4><br />"
                                + additionalInfo
								+" <p class='addonPlot'>" + plot + "</p>"
							+"</li>"
						+"</a>" 
					);
				}
				
				if($("#addonpopshowplot").is(':checked')){
					$(".addonPlot").show();
				} else {
					$(".addonPlot").hide();
				}
				
				//if there are no relevant children (backbutton is not relevant), say so
				if ( $("#addonspopupList").children().length <= 1 ){
					$("#addonspopupList").append(yTools.ts("NO_MATCH"));
				}
				
				$("#addonspopupRefresh").attr('data-yAddonDirPath', addonIDandPath); 
				$("#addonspopupRefresh").attr('data-yAddonFanartPath', prevfanartpath); 
				$("#addonspopupopenaddon").attr('data-yAddonDirPath', addonIDandPath.split('/')[2]); //addon comes as plugin://bla.bla.ba/blabla¬bla
				
				$("#detailspopupAddons").attr('data-yAddonname', addonIDandPath.split('/')[2]); //addon comes as plugin://bla.bla.ba/blabla¬bla
				
				if(yAddons.addonBackPath[yAddons.addonBackPath.length-1] != addonIDandPath){
					yAddons.addonBackPath.push([addonIDandPath , prevfanartpath]); //push addon id and the path and the fanart of the last page, as breadcrumbs to go back
				}
				$("#loading_addonPopup").hide();
			}
		);
	},	
    openKodiFavs: function(addonIDandPath, prevfanartpath){
		yCore.sendJsonRPC(
			'Getfavourites',
			'{"jsonrpc": "2.0", "method": "Favourites.GetFavourites", "params": { "properties": ["window","path","thumbnail","windowparameter"] }, "id": 1}',
			function(resultGetKodiFavs){ 
              
              //add the back-button, when back history (addonBackPath) is not empty
              if(yAddons.addonBackPath.length > 0){
                  $("#addonspopupList").append(
                      "<a class='showAddonDirItem' "
                      + "data-yAddonFile='" + yAddons.addonBackPath[yAddons.addonBackPath.length-1][0] //the path from the previous item
                      + "' data-yAddonFileType='directory'"
                      + " data-yAddonIsBack='back' data-yAddonFanartPath='" + yAddons.addonBackPath[yAddons.addonBackPath.length-1][1] +"'>" //fanart from previous item
                          +"<li class='addonDirItem'>"
                              + "<img class='addonDirBackPic' alt='back button' src='images/listprev.png' />"  
                              + "<h4>" + yTools.ts("BACK") + "</h4>"
                          +"</li>"
                      +"</a>" 
                  );
              }  
              
              for (var i = 0; i < resultGetKodiFavs["result"]["limits"]["end"]; i++) {                
                var pathToFileOrPlace = "";
                if(resultGetKodiFavs["result"]["favourites"][i]["type"] == "window"){
                  pathToFileOrPlace = resultGetKodiFavs["result"]["favourites"][i]["windowparameter"];
                } else if(resultGetKodiFavs["result"]["favourites"][i]["type"] == "media") {
                  pathToFileOrPlace = resultGetKodiFavs["result"]["favourites"][i]["path"];
                }                  
                
                $("#addonspopupList").append(
                      "<a class='showAddonDirItem' "
                      + "data-yAddonFile='" + pathToFileOrPlace
                      + "' data-yAddonFileType='" + resultGetKodiFavs["result"]["favourites"][i]["type"]
                      + "' data-yAddonIsBack='' data-yAddonFanartPath=''>"
                        +"<li class='addonDirItem'>"
                            + "<img class='addonDirPrevPic' alt='' src='" + resultGetKodiFavs["result"]["favourites"][i]["thumbnail"] + "' />"
                            + "<h4>" + resultGetKodiFavs["result"]["favourites"][i]["title"] + "</h4><br />"
                        +"</li>"
                      +"</a>" 
                  );
              }
              
              yAddons.addonBackPath.push(["plugin.kodi.kodi_fav" , ""]);
              
              $("#loading_addonPopup").hide();
            }
		);
    },    
	openAddon: function(addonid){
		yCore.sendJsonRPC(
			'ExecuteAddon',
			'{"jsonrpc": "2.0", "method": "Addons.ExecuteAddon", "params": { "addonid": "' + addonid + '" }, "id": 1}',
			function(){ 
				window.location.href = "#remote";
			}
		);
	}
}

/*
 * Tools and functions which are used in differnet modules
 */
var yTools = {
	ratingToStars: function(stars){  //create image tags for rating according to rating (rounded down)
		var htmlString= "";
		if (stars == 0) { return yTools.ts("NO_RATING");}
		
		stars = Math.round(stars * 100 ) / 100;
			
		htmlString += "<span><img class='ratingStars' alt='' src='images/star.png' />"
												+ "<span>" + stars + "</span></span>";
		return htmlString;
	},
	/*
	 * write all artits from array in a string
	 */
	artistsToString: function(usedJSON){
		artistString = ""; //empty, to remove previous content, to avoid wrong or multiple informations
		for (var j=0; j < usedJSON.length; j++){ //all genres in movie
			artistString += usedJSON[j];
			if (j !=  (usedJSON.length -1)) { artistString += ", "; }
		}
		if (artistString==""){
          return artistString += "unknown";
        } else {return artistString};			
	},
	/*
    * Yarc TraSlate - to translate interface
    */	
	ts: function(transConst){
		try{
			return translations[transConst][yS.l];	
		}
			catch(e){
			alert('ERROR: ' +transConst + ": " + e.message)
		}
		return true;
	},	
	removeLastCharIf: function(url, CharToRemove){
		if (url.substring(url.length-1) == CharToRemove){
			url = url.substring(0, url.length-1);
			return url;
		}
		return url;
	},
	addZeroTwoDigits: function(digit) {
		digit = "0" + digit;
		return digit.substr(digit.length - 2);
	},	
	/*
	 * create image tags for languages (called for each movie) and add language option to selection
	 * kodiLang is the object of streamdetails from the media
	 */
	pathToFlags: function(kodiLang){
		var returnstring = "";
		
		for (var j=0;  j < kodiLang.length; j++){//go trough whole audio list
			if(kodiLang[j]["language"] == ""||kodiLang[j]["isocode"]=="und"){//if langague is empty string or code for "Undetermined" it's like unknown
				returnstring += "";
			} else {
				if(kodiLang[j].flag == ""){ //if there is no flag set, write out the name/description of the language
					returnstring += "[" + kodiLang[j]["native"] + "]&nbsp";
				} else {
					returnstring += "<img class='pathToFlags' alt='flag for " 
						+ kodiLang[j].native + " ("+kodiLang[j].isocode+")' src='images/flags/" 
						+ kodiLang[j].flag + ".png' "
						+ "title='"+ kodiLang[j].native + " ("+kodiLang[j].isocode+")' />&nbsp;";
				}
			}
		}

		if (returnstring == "") {
			returnstring += yTools.ts("LANG_UNKNOWN");
		}
		return returnstring;
	}
}

/*
 * manages everything in connection with Settings in localstorage
 */
var yS = {
	l: "", //language
	xbmcName: "yarc",
	hideMenuText: false,
	hidePrevPics: false,
	hideWatched: false,
	hideGenreMovies: false,
	hideLanguageMovies: false,
	noSwipe: false,
	swapSwipeDirections: false,
	swipeHight: "300px",
	hideOrientNav: false,
	hideSearchMovies: false,
	hideFileLinkMovies: false,
	prevImgQualMovies: "95",
	hideGenreMusic: false,
	hideSearchMusic: false,	
	hideGenreAddons: false,
	hideSearchAddons: false,		
	listLength: "0",
    stayInAddonPopupSetting: false,
	
	/*
	* prepares the settingspage 
	*/
	init: function(){
		
		$("#language").val(localStorage.getItem("language"));
		$("#language").selectmenu("refresh");
	
		$('#xbmcName').val(localStorage.getItem("xbmcName"));
		if(localStorage.getItem("hidePrevPics") == "true"){ //in local storage its string not boolean
			$('input[name=hidePrevPics]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hidePrevPics]').prop("checked", false).checkboxradio("refresh");
		}
		if(localStorage.getItem("hideMenuText") == "true"){ //in local storage its string not boolean
			$('input[name=hideMenuText]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideMenuText]').prop("checked", false).checkboxradio("refresh");
		}
		if(localStorage.getItem("hideWatched") == "true"){ //in local storage its string not boolean
			$('input[name=hideWatched]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideWatched]').prop("checked", false).checkboxradio("refresh");
		}
		
		$('#listLength').val(localStorage.getItem("listLength"));
		
		if(localStorage.getItem("hideGenreMovies") == "true"){ //in local storage its string not boolean
			$('input[name=hideGenreMovies]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideGenreMovies]').prop("checked", false).checkboxradio("refresh");
		}
		if(localStorage.getItem("hideLanguageMovies") == "true"){ //in local storage its string not boolean
			$('input[name=hideLanguageMovies]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideLanguageMovies]').prop("checked", false).checkboxradio("refresh");
		}
		if(localStorage.getItem("hideSearchMovies") == "true"){ //in local storage its string not boolean
			$('input[name=hideSearchMovies]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideSearchMovies]').prop("checked", false).checkboxradio("refresh");
		}
	
		if(localStorage.getItem("noSwipe") == "true"){ //in local storage its string not boolean
			$('input[name=noSwipe]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=noSwipe]').prop("checked", false).checkboxradio("refresh");
		}
	
		if(localStorage.getItem("swapSwipeDirections") == "true"){ //in local storage its string not boolean
			$('input[name=swapSwipeDirections]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=swapSwipeDirections]').prop("checked", false).checkboxradio("refresh");
		}
		
		$('#swipeHight').val(localStorage.getItem("swipeHight"));
		
		if(localStorage.getItem("hideOrientNav") == "true"){ //in local storage its string not boolean
			$('input[name=hideOrientNav]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideOrientNav]').prop("checked", false).checkboxradio("refresh");
		}
		
		if(localStorage.getItem("hideFileLinkMovies") == "true"){ //in local storage its string not boolean
			$('input[name=hideFileLinkMovies]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideFileLinkMovies]').prop("checked", false).checkboxradio("refresh");
		}
		
		$('#prevImgQualMovies').val(localStorage.getItem("prevImgQualMovies"));

		if(localStorage.getItem("hideGenreMusic") == "true"){ //in local storage its string not boolean
			$('input[name=hideGenreMusic]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideGenreMusic]').prop("checked", false).checkboxradio("refresh");
		}
		if(localStorage.getItem("hideSearchMusic") == "true"){ //in local storage its string not boolean
			$('input[name=hideSearchMusic]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideSearchMusic]').prop("checked", false).checkboxradio("refresh");
		}
		if(localStorage.getItem("hideGenreAddons") == "true"){ //in local storage its string not boolean
				$('input[name=hideGenreAddons]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideGenreAddons]').prop("checked", false).checkboxradio("refresh");
		}
		if(localStorage.getItem("hideSearchAddons") == "true"){ //in local storage its string not boolean
			$('input[name=hideSearchAddons]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideSearchAddons]').prop("checked", false).checkboxradio("refresh");
		}
		if(localStorage.getItem("stayInAddonPopupSetting") == "true"){ //in local storage its string not boolean
			$('input[name=stayInAddonPopupSetting]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=stayInAddonPopupSetting]').prop("checked", false).checkboxradio("refresh");
		}
		
		$("#listLength").blur(function(e) {
			$("#listLength_label").css('color', 'white');
			$("#saveSettings").button('enable');
			var numericReg = /^\d*[0-9]?$/;
			if (!numericReg.test($('[name=listLength]').val())) {
				alert(yTools.ts("ALERT_LISTLENGTH"));
				$("#saveSettings").button('disable');
				$("#listLength_label").css('color', 'red');
				return false;
			}
			if ($('[name=listLength]').val() == "") {
				alert(yTools.ts("ALERT_LISTLENGTH"));
				$("#saveSettings").button('disable');
				$("#listLength_label").css('color', 'red');
				return false;
			}
			return false;
		});
		
		$("#prevImgQualMovies").blur(function(e) {
			$("#prevImgQualMovies_label").css('color', 'white');
			$("#saveSettings").button('enable');
			var rangeReg = /(9[0-5]|[1-8][0-9])/;//0?[0-9]|[0-9]|[1-8][0-9]|9[0-5]
			if (!rangeReg.test($('[name=prevImgQualMovies]').val())) {
				alert(yTools.ts("ALERT_IMAGE_QUAL"));
				$("#saveSettings").button('disable');
				$("#prevImgQualMovies_label").css('color', 'red');
				return false;
			}
			return false;
		});
		
		$("#swipeHight").blur(function(e) {
			$("#swipeHight_label").css('color', 'white');
			$("#saveSettings").button('enable');
			var rangeReg = /^[0-9]+(em|ex|px|vh)/;
			if (!rangeReg.test($('[name=swipeHight]').val())) {
				alert(yTools.ts("ALERT_SWIPEHIGHT"));
				$("#saveSettings").button('disable');
				$("#swipeHight_label").css('color', 'red');
				return false;
			}
			return false;
		});
	
		$("#saveSettings").click(function(e) {
			e.stopImmediatePropagation();
			yS.setSettings();
		});
		
	},
	/*
		* check if localstorage key set, if not, create initial setting
		*/
	localStorageInit: function(){
		if (localStorage.getItem("language") === null) {
			localStorage.setItem("language", "en");
		}
		if (localStorage.getItem("xbmcName") === null) {
			localStorage.setItem("xbmcName", "yarc");
		}
		if (localStorage.getItem("hideMenuText") === null) {
			localStorage.setItem("hideMenuText", "false");
		}
		if (localStorage.getItem("hidePrevPics") === null) {
			localStorage.setItem("hidePrevPics", "false");
		}
		if (localStorage.getItem("hideWatched") === null) {
			localStorage.setItem("hideWatched", "false");
		}
		if (localStorage.getItem("hideGenreMovies") === null) {
			localStorage.setItem("hideGenreMovies", "false");
		}
		if (localStorage.getItem("hideLanguageMovies") === null) {
			localStorage.setItem("hideLanguageMovies", "false");
		}
		if (localStorage.getItem("noSwipe") === null) {
			localStorage.setItem("noSwipe", "false");
		}
		if (localStorage.getItem("swapSwipeDirections") === null) {
			localStorage.setItem("swapSwipeDirections", "false");
		}
		if (localStorage.getItem("swipeHight") === null) {
			localStorage.setItem("swipeHight", "300px");
		}
		if (localStorage.getItem("hideOrientNav") === null) {
			localStorage.setItem("hideOrientNav", "false");
		}
		if (localStorage.getItem("hideSearchMovies") === null) {
			localStorage.setItem("hideSearchMovies", "false");
		}
		if (localStorage.getItem("hideFileLinkMovies") === null) {
			localStorage.setItem("hideFileLinkMovies", "false");
		}
		if (localStorage.getItem("prevImgQualMovies") === null) {
			localStorage.setItem("prevImgQualMovies", "95");
		}
		if (localStorage.getItem("hideGenreMusic") === null) {
			localStorage.setItem("hideGenreMusic", "false");
		}
		if (localStorage.getItem("hideSearchMusic") === null) {
			localStorage.setItem("hideSearchMusic", "false");
		}
		if (localStorage.getItem("hideGenreAddons") === null) {
			localStorage.setItem("hideGenreAddons", "false");
		}
		if (localStorage.getItem("hideSearchAddons") === null) {
			localStorage.setItem("hideSearchAddons", "false");
		}
		if (localStorage.getItem("listLength") === null) {
			localStorage.setItem("listLength", "0");
		}
		if (localStorage.getItem("stayInAddonPopupSetting") === null) {
			localStorage.setItem("stayInAddonPopupSetting", "false");
		}
	},
	/*
		* get string from local storage and save it in yarc-variable (as boolean for checkboxes) 
		*/
	getSettings: function(){
		yS.l = localStorage.getItem("language");
		yS.xbmcName = localStorage.getItem("xbmcName");
		if(localStorage.getItem("hideMenuText")== "true"){yS.hideMenuText = true;}else{yS.hideMenuText = false;}
		if(localStorage.getItem("hidePrevPics")== "true"){yS.hidePrevPics = true;}else{yS.hidePrevPics = false;}
		if(localStorage.getItem("hideWatched")== "true"){yS.hideWatched = true;}else{yS.hideWatched = false;}
		if(localStorage.getItem("listLength")== "0"){yS.listLength = 99999999;} else{yS.listLength = parseInt(localStorage.getItem("listLength"));}
		if(localStorage.getItem("hideGenreMovies")== "true"){yS.hideGenreMovies = true;}else{yS.hideGenreMovies = false;}
		if(localStorage.getItem("hideLanguageMovies")== "true"){yS.hideLanguageMovies = true;}else{yS.hideLanguageMovies = false;}
		if(localStorage.getItem("noSwipe")== "true"){yS.noSwipe = true;}else{yS.noSwipe = false;}
		if(localStorage.getItem("swapSwipeDirections")== "true"){yS.swapSwipeDirections = true;}else{yS.swapSwipeDirections = false;}
		yS.swipeHight = localStorage.getItem("swipeHight");
		if(localStorage.getItem("hideOrientNav")== "true"){yS.hideOrientNav = true;}else{yS.hideOrientNav = false;}
		if(localStorage.getItem("hideSearchMovies")== "true"){yS.hideSearchMovies = true;}else{yS.hideSearchMovies = false;} 
		if(localStorage.getItem("hideFileLinkMovies")== "true"){yS.hideFileLinkMovies = true;}else{yS.hideFileLinkMovies = false;} 
		yS.prevImgQualMovies = localStorage.getItem("prevImgQualMovies");
		if(localStorage.getItem("hideGenreMusic")== "true"){yS.hideGenreMusic = true;}else{yS.hideGenreMusic = false;} 
		if(localStorage.getItem("hideSearchMusic")== "true"){yS.hideSearchMusic = true;}else{yS.hideSearchMusic = false;} 
		if(localStorage.getItem("hideGenreAddons")== "true"){yS.hideGenreAddons = true;}else{yS.hideGenreAddons = false;} 
		if(localStorage.getItem("hideSearchAddons")== "true"){yS.hideSearchAddons = true;}else{yS.hideSearchAddons = false;} 
		if(localStorage.getItem("stayInAddonPopupSetting")== "true"){yS.stayInAddonPopupSetting = true;}else{yS.stayInAddonPopupSetting = false;}
		
		
	},
	/*
		* write settings if settingpage gets closed
		*/
	setSettings: function(){
		$('#settings input[type=checkbox]').each(function () {
			if($(this).is(':checked')){
				localStorage.setItem($(this).val(), "true");
			} else {
				localStorage.setItem($(this).val(), "false");
			}
		});
		
		localStorage.setItem("language", $('[name=language]').val());
		localStorage.setItem("xbmcName", $('[name=xbmcName]').val());
		localStorage.setItem("swipeHight", $('[name=swipeHight]').val());
		localStorage.setItem("listLength", $('[name=listLength]').val());
		localStorage.setItem("prevImgQualMovies", $('[name=prevImgQualMovies]').val());
		
// 		yS.getSettings();//TODO really needed?
		window.location.href = "index.html";
        
	}
}

/*
 * manages everything which has to be run, eighter in general, or if page gets called 
 */
$(document).delegate(document, 'pageshow', yFooter.init);
$(document).delegate(document, 'pageshow', yCore.init);
$(document).delegate('', 'pageshow', yRemote.init);
$(document).delegate('#pl', 'pageshow', yPl.init);//playlist
$(document).delegate('#movies', 'pageshow', yMovies.init);
$(document).delegate('#series', 'pageshow', ySeries.init);
$(document).delegate('#music', 'pageshow', yMusic.init);
$(document).delegate('#music-songsearch', 'pageshow', ySongSearch.init);
$(document).delegate('#addons', 'pageshow', yAddons.init);
$(document).delegate('#settings', 'pageshow', yS.init);






		

