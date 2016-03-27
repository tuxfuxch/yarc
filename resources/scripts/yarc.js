/*
 * Yarc - Yet another Remote Control (for Kodi)
 * Copyright (C) 2016 by Esra Kummer
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

//TODO 
//show swipe help problem solve
//some loading issues in addon files strucktures has to be found




//that intervals and functions run only once, also after pageswitch
var yCoreInitDone = false;

var yCore = {
    videoSources: [],
    musicSources: [],
	//set player at first as none, will by updated by yCore.getActivePlayer
	activePlayer: -1, //0=Music 1=Video
	deviceBeta: 0,
	deviceGamma: 0,
	totalPlayTimeSeconds: 0,
	currentPlayTimeSeconds: 0,
	doeOnPause: false, //checks is device orientation is on pause, needs to be global, since function is run every some milli seconds newly
    headerMenuItems: 5,
	init: function(){
        yS.localStorageInit();  //if some settings are not made, set default
		
		if(yS.yS.hideMenuText){$(".navbar .yheadermenuitem").remove();}
		
		if(!yCoreInitDone){
          
            //check active player each second
            setInterval(yCore.getActivePlayer, 1000); 
            
            //check playing item each second
            setInterval(yCore.getPlayerGetItem, 1000);            
            
            yCore.deviceOriantionService();
            
            yCore.keyDownService();
            
            
            //init language translation library (i18next), use chosen language in settings and use English as fallback
            //then translate all html elements with i18next attribute
            i18n.init({
                lng: yS.yS.language,
                fallbackLng: "en",
                useCookie: false,
                useDataAttrOptions: true,
                resGetPath: 'resources/lang/__lng__.json'}).done(function() {
                    //go throug all i18n marked tags and set text according to constant and chosen langugage 
                    $('[data-i18n]').each(function() {
                        $(this).i18n();
                    });
            });
                
            var menuItems = 5;
        }
        
        //on panel close set visability in var and on open set visability and set swipe height
        $( "#remote" ).panel({
            beforeopen: function( event, ui ) {
                event.stopImmediatePropagation();
                
                yCore.sendJsonRPC(
                    'OpenRemotePanel',	
                    '{ "jsonrpc": "2.0", "method": "GUI.GetProperties","params": {"properties":["fullscreen"]}, "id": 1 }',
                    function(resultOpenRemotePanel){
                        if(resultOpenRemotePanel["result"]["fullscreen"] == true){
                            $("#swipe").css("background-color", "#444");                            
                            $('#radioMedia').prop("checked", true);
                            
                            if(yRemote.showHelp){
                                $("#swipe-box-help").show();
                                $("#swipe-box-Media-help").show();
                                $("#swipe-box-Nav-help").hide();
                            }
                        } else {
                            $("#swipe").css("background-color", "#666");  
                            $('#radioNav').prop("checked", true);  
                            
                            if(yRemote.showHelp){
                                $("#swipe-box-help").show();
                                $("#swipe-box-Nav-help").show();
                                $("#swipe-box-Media-help").hide();
                            }
                        }
                        $(".nav-med").checkboxradio("refresh");
                    }
                );
                
                yRemote.panelVisible = true;
            },
            beforeclose: function( event, ui ) { 
                event.stopImmediatePropagation();
                yRemote.panelVisible = false;              
            }
        });
        
        yCore.sendJsonRPC(
            'GetSources',	
            '[{"jsonrpc":"2.0","method":"Files.GetSources","params":["video"],"id":1}, {"jsonrpc":"2.0","method":"Files.GetSources","params":["music"],"id":2}]',
            function(resultGetSources){ 
                //Video Sources
                for (var i = 0; i < resultGetSources[0]["result"]["sources"].length; i++) {
                    var sourcesList = resultGetSources[0]["result"]["sources"][i]["file"];
                    var arrayVid = [];
                    
                    //if it's a windows filepath (with backslashes), remove eventual last backslah 
                    //and than replace all backslashes with double backslashes
                    if(sourcesList.indexOf('\\') >= 0){
                        sourcesList = sourcesList.slice(0,-1);
                        sourcesList = sourcesList.replace(/\\/g,"\\\\");
                    }	
                    
                    //first push whole source path to temp array
                    yCore.videoSources.push(sourcesList);
                    //check if it is multipath, if yes, remove mulitpath part and slash in the end and finaly add each multipath part to array
                    if (sourcesList.match("^multipath://")) {
                        sourcesList = sourcesList.substring(12);
                        sourcesList = sourcesList.slice(0,-1);
                        arrayVid = sourcesList.split('/');
                    } 
                    
                    //for each array item, push decoded URI to Video Sources Array
                    $.each( arrayVid, function( index, value ){  
                        yCore.videoSources.push( decodeURIComponent(value) );
                    });
                }
                //Music sources
                for (var i = 0; i < resultGetSources[1]["result"]["sources"].length; i++) {
                    var sourcesList = resultGetSources[1]["result"]["sources"][i]["file"];
                    var arrayAud = [];
                    
                    //if it's a windows filepath (with backslashes), remove eventual last backslah 
                    //and than replace all backslashes with double backslashes
                    if(sourcesList.indexOf('\\') >= 0){
                        sourcesList = sourcesList.slice(0,-1);
                        sourcesList = sourcesList.replace(/\\/g,"\\\\");
                    }	
                    
                    //first push whole source path to temp array
                    yCore.musicSources.push(sourcesList);
                    //check if it is multipath, if yes, remove mulitpath part and slash in the end and finaly add each multipath part to array
                    if (sourcesList.match("^multipath://")) {
                        sourcesList = sourcesList.substring(12);
                        sourcesList = sourcesList.slice(0,-1);
                        arrayAud = sourcesList.split('/');
                    }
                    
                    //for each array item, push decoded URI to Video Sources Array
                    $.each( arrayAud, function( index, value ){
                        yCore.musicSources.push(decodeURIComponent(value) );
                    });
                }
            }
        );
        
		yCoreInitDone = true; //that Intervals run only once, also after Pageswitch
	},
	//get active player and save it
	getActivePlayer: function(){
      
		yCore.sendJsonRPC(
			'GetActivePlayers',	
			'{ "jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1 }',
			function(resultGetActivePlayers){
				//"error" in resultGetItem
				if(resultGetActivePlayers["result"].length === 0){
					yCore.activePlayer = -1;
					
					$("#seek-bubble").hide();
					$("#mediaProgImage").hide();
					$("#mediaProgTitle").text("");
					$("#mediaProgTime").text("");
                    $("#mediaProg-cont").css( "width", "0%");
				} else {
					$("#seek-bubble").show();
					yCore.activePlayer = resultGetActivePlayers["result"]["0"]["playerid"];
				}
			}
		);
	},
	//get palying item and write it into footer
	getPlayerGetItem: function(){
		if(yCore.activePlayer != -1 && yRemote.panelVisible){ //only run if footer visible and and a player is active
          
            yCore.sendJsonRPC(
                'GetRemoteInfos',	
                '[{"jsonrpc":"2.0","method":"Application.GetProperties","id":1,"params":[["muted"]]},'
                    + '{"jsonrpc":"2.0","method":"Player.GetProperties","id":2,"params":['
                        + yCore.activePlayer + ',["time", "totaltime", "percentage", "shuffled","repeat"]]'
                    + '},'
                    + '{ "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": '
						+ yCore.activePlayer 
						+ ', "properties": [ "title", "showtitle", "artist", "thumbnail", "streamdetails", "file", "season", "episode"] }, "id": 3 }'
                + ']',
                function(getRemoteInfos){
                    
                    //Application.GetProperties
                    if(getRemoteInfos["0"]["result"]["muted"] == true){
                        document.getElementById('SetMute').innerHTML = "<span class='icon-volume-off'></span>";
                    } else {
                        document.getElementById('SetMute').innerHTML = "<span class='icon-volume-up'></span>";
                    }
                    
                    //Player.GetProperties  
					if(!("error" in getRemoteInfos["1"])){
                        if(getRemoteInfos["1"]["result"]["repeat"] == "all"){
                            document.getElementById('SetRepeat').innerHTML = "<span class='icon-refresh'></span>";
                        } else if (getRemoteInfos["1"]["result"]["repeat"] == "one"){
                            document.getElementById('SetRepeat').innerHTML = "<span class='icon-refresh-one'></span>";
                        } else {
                            document.getElementById('SetRepeat').innerHTML = "<span class='icon-refresh-no'></span>";
                        }          
          
                        if(getRemoteInfos["1"]["result"]["shuffled"] == false){
                            document.getElementById('SetShuffle').innerHTML = "<span class='icon-random-straight'></span>";
                        } else {
                            document.getElementById('SetShuffle').innerHTML = "<span class='icon-random'></span>";
                        }
								
						$("#mediaProgTime").html(yTools.addZeroTwoDigits(getRemoteInfos["1"]["result"]["time"]["hours"]) 
							+ ":" + yTools.addZeroTwoDigits(getRemoteInfos["1"]["result"]["time"]["minutes"]) 
							+ ":" + yTools.addZeroTwoDigits(getRemoteInfos["1"]["result"]["time"]["seconds"])
							+ "<br>" + yTools.addZeroTwoDigits(getRemoteInfos["1"]["result"]["totaltime"]["hours"])
							+ ":" + yTools.addZeroTwoDigits(getRemoteInfos["1"]["result"]["totaltime"]["minutes"])
							+ ":" + yTools.addZeroTwoDigits(getRemoteInfos["1"]["result"]["totaltime"]["seconds"])
						);
						
						//needed for seek function to calc time difference
						yCore.currentPlayTimeSeconds = getRemoteInfos["1"]["result"]["time"]["hours"] * 3600
							+ getRemoteInfos["1"]["result"]["time"]["minutes"] *60
							+ getRemoteInfos["1"]["result"]["time"]["seconds"];
						
						yCore.totalPlayTimeSeconds = getRemoteInfos["1"]["result"]["totaltime"]["hours"] * 3600
							+ getRemoteInfos["1"]["result"]["totaltime"]["minutes"] *60
							+ getRemoteInfos["1"]["result"]["totaltime"]["seconds"];
						$("#mediaProg-cont").css( "width", getRemoteInfos["1"]["result"]["percentage"] + "%");
						$("#mediaProg-cont").css( "background-color", "#685300");
						if(!yRemote.isDragging){
                            var bubblePercentage = ($(window).width() * getRemoteInfos["1"]["result"]["percentage"] / 100) - 25 ;                         
                            $("#seek-bubble").css( "left", bubblePercentage);
                        }
					} else { //if "error" exists set props that nothing is in it
						$("#seek-bubble").hide();
						$("#mediaProgImage").hide();
						$("#mediaProgTitle").text("");
						$("#mediaProgTime").text("");
						$("#mediaProg-cont").css( "width", "0%");
					}
					
					
					
					//Player.GetItem
					if(!("error" in getRemoteInfos["2"])){// if "error" is not in return set info
                        
                        var title = getRemoteInfos["2"]["result"]["item"]["title"];
                        var label = "";//only set label if titel is not there and info in label
                        
                        
						if(title == ""){ 
							label = " " + getRemoteInfos["2"]["result"]["item"]["label"];
						} else {
                            //get rid of the ugly [] brackets with [b] and [color=....] in filenames
                            if(title.indexOf('[') >= 0){
                                title = title.replace(/(\[.*?\])/g, '');
                            }
                        }
						
						var showdetails = "";//only set tv show details if present
						if(getRemoteInfos["2"]["result"]["item"]["type"] == "episode"){
							showdetails = " (" + getRemoteInfos["2"]["result"]["item"]["showtitle"] 
                                            + " " + getRemoteInfos["2"]["result"]["item"]["season"] 
                                            + "x" + getRemoteInfos["2"]["result"]["item"]["episode"]
                                            + ")";
						} 
						
						if (yCore.activePlayer == 1){ //Video Player
							$("#mediaProgTitle").text(title + label + showdetails);
							if(!yS.yS.hidePrevPics){
                                if(getRemoteInfos["2"]['result']['item']['thumbnail'] !== ""){
                                    $("#mediaProgImage").attr("src", yTools.imageUrlNormalizer(getRemoteInfos["2"]['result']['item']['thumbnail'], "?"));
                                    $("#mediaProgImage").show();
                                } else {
                                    $("#mediaProgImage").hide();
                                }
							} else {
                                    $("#mediaProgImage").hide();                              
                            }
							$("#mediaProgTitle").show();
						} else if (yCore.activePlayer == 0) { //Musik Player
							if(!yS.yS.hidePrevPics){
                                if(getRemoteInfos["2"]['result']['item']['thumbnail'] !== ""){
                                    $("#mediaProgImage").attr("src", yTools.imageUrlNormalizer(getRemoteInfos["2"]['result']['item']['thumbnail'], "?"));
                                    $("#mediaProgImage").show();
                                } else {
                                    $("#mediaProgImage").hide();
                                }
							} else {
                                    $("#mediaProgImage").hide();                              
                            }
							var artist = "";
                            if (getRemoteInfos["2"]["result"]["item"]["artist"].length !== 0) {
                                artist = " (" +  getRemoteInfos["2"]["result"]["item"]["artist"] + ") ";
                              
                            }	
							$("#mediaProgTitle").text(title  + artist + label);
							$("#mediaProgImage").show();
							$("#mediaProgTitle").show();
						} else {//other Player
							$("#mediaProgTitle").text(title + label);
							$("#mediaProgImage").show();
							$("#mediaProgTitle").show();
						}
					} else { //if "error" exists set props that nothing is in it
						$("#seek-bubble").hide();
						$("#mediaProgImage").hide();
						$("#mediaProgTitle").text("");
						$("#mediaProgTime").text("");
					}
                    
                }
            );
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
		if(window.DeviceOrientationEvent) {
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
						yCore.simpleJsonRequest("Input.Up");
					}
					else if( yCore.deviceBeta <= -5 && !yCore.doeOnPause){
						yCore.simpleJsonRequest("Input.Down");
					}
					else if(yCore.deviceGamma <= -30 && yCore.deviceGamma >= -80 && !yCore.doeOnPause){
						yCore.simpleJsonRequest("Input.Left");
					}
					else if(yCore.deviceGamma >= 30 && yCore.deviceGamma <= 80 && !yCore.doeOnPause){
						yCore.simpleJsonRequest("Input.Right");
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
		var keymap = {
                        8: false, //back
                        9: false, //tab
                        13: false, //enter
                        16: false, //shift
                        27: false, //esc
                        32: false, //space
                        37: false, //left-key
                        38: false, //up-key
                        39: false, //right-key
                        40: false, //down-key
                        67: false, //c
                        70: false, //f
                        73: false, //i
                        77: false, //m
                        80: false, //p
                        81: false, //q
                        82: false, //r
                        87: false, //w
                        88: false, //x
                      };                      
		
		//on keyboard input, check if it matches the keymap and if it is the case start according function 
		$(document).keydown(function(e) { 
			e.stopImmediatePropagation();	
			
			/*for search field in song-search page.  needs to be here, because of document keydown. */
			if (e.keyCode == 13 && $(e.target).is("#songsearch-searchfield")) {
				$('#songsearch-list').empty();
				ySongSearch.searchPrintSong($("#songsearch-searchfield").val());
				$(e.target).blur();
				return false;
			}
			if (e.keyCode == 13 && $(e.target).is("#SendTextField")) {
				yRemote.sendTextButton($('#SendTextField').val());
				$(e.target).blur();
				return false;
			}
			
			//if "enter" is pressend and being in a text (most of them) field, exit textfield to close onscreen keyboards on mobiles
			if (e.keyCode == 13 &&
					(
                        $(e.target).is("#searchMovies")
                        ||$(e.target).is("#searchMusic")
                        ||$(e.target).is("#searchAddon")
                    )
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
			if (keymap[16] && keymap[38] ||  keymap[88]) {
				yRemote.playercontrol("Player.stop");
				return false;
			}
			if (keymap[16] && keymap[39]) {
				yRemote.playergoto("next");
				return false;
			}
			if (keymap[16] && keymap[40] || keymap[32] || keymap[80]) {
				yRemote.playercontrol("Player.PlayPause");
				return false;
			}
			if (keymap[67]) {
				yCore.simpleJsonRequest("Input.ContextMenu");
				return false;
			}
			if (keymap[8]) { 
				yCore.simpleJsonRequest("Input.Back");
				return false;
			}
			if (keymap[9]) {
                yRemote.toggleFullscreen();
				return false;
			}
			if (keymap[13]) { 
				yCore.simpleJsonRequest("Input.Select");
				return false;
			}
			if (keymap[27]) { 
				yCore.simpleJsonRequest("Input.Home");
				return false;
			} 
			if (keymap[37]) { 
				yCore.simpleJsonRequest("Input.Left");
				return false;
			}
			if (keymap[38]) { 
				yCore.simpleJsonRequest("Input.Up");
				return false;
			}
			if (keymap[39]) { 
				yCore.simpleJsonRequest("Input.Right");
				return false;
			}
			if (keymap[40]) { 
				yCore.simpleJsonRequest("Input.Down");
				return false;
			}
			if (keymap[70]) {
                yRemote.setSpeed("increment");
				return false;
			}
			if (keymap[73]) { 
                yCore.simpleJsonRequest("Input.Info");
				return false;
			}
			if (keymap[77]) { 
                yCore.simpleJsonRequest("Input.ShowOSD");
				return false;
			}
			if (keymap[81]) {
				yRemote.setVolume("Volume.Minus");
				return false;
			}
			if (keymap[82]) {
				yRemote.setSpeed("decrement");
				return false;
			}
			if (keymap[87]) {
				yRemote.setVolume("Volume.Plus");
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
    addToKodiFavorites: function(title, type, path, thumbnail){
        var mediaPath = "";
        
        //if type is window (like a directory to open)
        if(type == "window"){
            mediaPath = '", "window":"video", "windowparameter":"' + path;
        } else {//else asume it's a playable madiafile
            mediaPath = '", "path":"' + path;
        }
      
        yCore.sendJsonRPC(
          'Add-Remove-Favourite',
          '{"jsonrpc": "2.0", "method": "Favourites.AddFavourite", "params": { "title": "' + title 
              + '", "type":"' + type 
              + mediaPath
              + '", "thumbnail":"' + thumbnail 
          + '"}, "id": 1}',
          ''
        );   
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
	},
	simpleJsonRequest: function(actionname) {
		yCore.sendJsonRPC(
			'simpleJsonRequest',
			'{"jsonrpc": "2.0", "method": "' + actionname + '", "id": 1}',
			' '
		);
        
        if(actionname == "Input.Home"){
            $("#swipe").css("background-color", "#666");  
            $('#radioNav').prop("checked", true);
            $(".nav-med").checkboxradio("refresh");
            
            if(yRemote.showHelp){
                $("#swipe-box-help").show();
                $("#swipe-box-Nav-help").show();
                $("#swipe-box-Media-help").hide();
            }
        }
	}
}

var yRemote = {
	radioNavMed: "",
	panelVisible: false,
	isDragging: false,
	seekTime: [0,0,0], //hours, minutes, seconds
	startDragPlayTimeSeconds: 0,
    showHelp: false,
	init: function() {
      
        $("#seek-bubble").draggable({
			axis: "x",
			start: function( event, ui ) {
				//save the current playing time at the start of draging for drag function
				yRemote.startDragPlayTimeSeconds = yCore.currentPlayTimeSeconds;
			},
			stop: function( event, ui ) {
                event.stopImmediatePropagation();
				yRemote.isDragging = false;
				
				$("#seek-overlay").html("&nbsp;");
				$("#seek-overlay").hide();
				
				yCore.sendJsonRPC(
					'PlayerSeek',
					'{"jsonrpc":"2.0","id":1,"method":"Player.Seek","params":{"playerid":' + yCore.activePlayer + ',"value":{"hours": ' + yRemote.seekTime[0] + ', "minutes": ' + yRemote.seekTime[1] +', "seconds": ' + yRemote.seekTime[2] + '}}}',
					''
				);
			},
			drag: function( event, ui ) {
				yRemote.isDragging = true;
				
				$("#seek-overlay").show();
				
				var offset = $(this).offset();
				//"accumulated seconds position where i am aiming now" = total time in seconds * "percentage of current place to windowwidth" / 100
				var newMediaPos = (yCore.totalPlayTimeSeconds * (((offset.left+25) * 100)/$(window).width()) / 100);
				
				var mediaPosDiff = "";
				var mediaPosPrefix = "";
				
				if(yRemote.startDragPlayTimeSeconds < newMediaPos ){
					mediaPosDiff = newMediaPos - yRemote.startDragPlayTimeSeconds;
					mediaPosPrefix = "+";
				} else {
					mediaPosDiff = yRemote.startDragPlayTimeSeconds - newMediaPos;
					mediaPosPrefix = "-";
				}
				
				yRemote.seekTime[0] = Math.floor(newMediaPos / 3600); //save hours
				yRemote.seekTime[1] = Math.floor((newMediaPos % 3600)/60); //save minutes
				yRemote.seekTime[2] =  Math.floor((newMediaPos % 3600) % 60); //save seconds
				
				$("#seek-overlay").html(yTools.addZeroTwoDigits(yRemote.seekTime[0]) + ":" + yTools.addZeroTwoDigits(yRemote.seekTime[1]) 
					+ ":" +  yTools.addZeroTwoDigits(yRemote.seekTime[2]) + "<br />" + mediaPosPrefix + ""
					+ yTools.addZeroTwoDigits(Math.floor(mediaPosDiff / 3600)) + ":" 
					+ yTools.addZeroTwoDigits(Math.floor((mediaPosDiff % 3600)/60)) + ":"
					+ yTools.addZeroTwoDigits(Math.floor((mediaPosDiff % 3600) % 60))
				);
			}
		});
    
        $("#swipe-box-help").hide();
        $("#swipe-box-Nav-help").hide();
        $("#swipe-box-Media-help").hide();
        
		//if swipe area, show pannels, or hide them and show buttons instead
		if(yS.yS.noSwipe){
			$("#swipe").hide();
			$("#Volume").show();
			$("#navigation-arrows").show();
			$("#mediacontrol").show();
		} else {
			$("#swipe").show();
			$("#Volume").hide();
			$("#navigation-arrows").hide();
			$("#mediacontrol").hide();
          
            $('.nav-med').click(function(){
                $("#swipe-box-help").hide();
                $("#swipe-box-Nav-help").hide();
                $("#swipe-box-Media-help").hide();
                if($("input[name='nav-med']:checked").val() == "Nav"){
                    $("#swipe").css("background-color", "#666");
                    if(yRemote.showHelp){
                        $("#swipe-box-help").show();
                        $("#swipe-box-Nav-help").show();
                    }
                    else {
                        $("#swipe-box-help").hide();
                        $("#swipe-box-Nav-help").hide();
                    }
                } else { //media
                    $("#swipe").css("background-color", "#444");
                    if(yRemote.showHelp){
                        $("#swipe-box-help").show();
                        $("#swipe-box-Media-help").show();
                    } else {
                        $("#swipe-box-help").hide();
                        $("#swipe-box-Media-help").hide();
                    }
                }
            });
		
            $('#swipe-help').click(function(){
                yRemote.showHelp = !yRemote.showHelp;
                
                $("#swipe-box-help").hide();
                $("#swipe-box-Nav-help").hide();
                $("#swipe-box-Media-help").hide();
                if(yRemote.showHelp){
                    $("#swipe-box-help").show();
                    $("#swipe-box-" + $("input[name='nav-med']:checked").val() +"-help").show();
                }
            });
        }
        
		//check for swipe inputs in swipe area with jquery.touchSwipe.js
		//depending on which section (navigation or player control) is activated, it starts the according functions
        $("#swipe").swipe( {
          swipeStatus:function(event, phase, direction, distance, duration, fingers){
            if (phase=="move") { //while the touch is happening
              
              if(distance % 10 == 0 && duration > 500){ //only do if over half a second. For every 5px of movement do 1 time the case              
                if($("input[name='nav-med']:checked").val() == "Nav"){
                  switch (direction){
                    case "up":
                            if(yS.yS.swapSwipeDirections){
                                yCore.simpleJsonRequest("Input.Down");
                            } else {
                                yCore.simpleJsonRequest("Input.Up");
                            }
                        break;
                    case "down":
                            if(yS.yS.swapSwipeDirections){
                                yCore.simpleJsonRequest("Input.Up");
                            } else {
                                yCore.simpleJsonRequest("Input.Down");
                            }
                        break;
                    case "left":
                            if(yS.yS.swapSwipeDirections){
                                yCore.simpleJsonRequest("Input.Right");
                            } else {
                                yCore.simpleJsonRequest("Input.Left");
                            }
                        break;
                    case "right":
                            if(yS.yS.swapSwipeDirections){
                                yCore.simpleJsonRequest("Input.Left");
                            } else {
                                yCore.simpleJsonRequest("Input.Right");
                            }
                        break;
                    default:
                        break;
                  }    
                }
              }
            }
            if (phase=="end"){ 
              switch (direction){
					case "up":
						if($("input[name='nav-med']:checked").val() == "Nav"){
                            if(yS.yS.swapSwipeDirections){
                                yCore.simpleJsonRequest("Input.Down");
                            } else {
                                yCore.simpleJsonRequest("Input.Up");
                            }
						} else{
							yRemote.playercontrol("Player.stop");
						}
						break;
					case "down":
						if($("input[name='nav-med']:checked").val() == "Nav"){
                          if(yS.yS.swapSwipeDirections){
                              yCore.simpleJsonRequest("Input.Up");
                          } else {
                              yCore.simpleJsonRequest("Input.Down");
                          }
						} else{
							yRemote.playercontrol("Player.PlayPause");
						}
						break;
					case "left":
						if($("input[name='nav-med']:checked").val() == "Nav"){
                          if(yS.yS.swapSwipeDirections){
                              yCore.simpleJsonRequest("Input.Right");
                          } else {
                              yCore.simpleJsonRequest("Input.Left");
                          }
						} else{
							yRemote.playergoto("previous");
						}
						break;
					case "right":
						if($("input[name='nav-med']:checked").val() == "Nav"){
                          if(yS.yS.swapSwipeDirections){
                              yCore.simpleJsonRequest("Input.Left");
                          } else {
                              yCore.simpleJsonRequest("Input.Right");
                          }
						} else{
							yRemote.playergoto("next");
						}
						break;
					default:
						break;
				}         
                        
            }
          },
          tap:function(event, target) {
              if($("input[name='nav-med']:checked").val() == "Nav"){yCore.simpleJsonRequest("Input.Select");} else{yRemote.setVolume("Volume.Minus");}
          },
          doubleTap:function(event, target) {
              if($("input[name='nav-med']:checked").val() == "Nav"){yCore.simpleJsonRequest("Input.Back");} else{yRemote.setVolume("Volume.Plus");}
          },
          longTap:function(event, target) {
              if($("input[name='nav-med']:checked").val() == "Nav"){yCore.simpleJsonRequest("Input.ContextMenu");} else{yRemote.setVolume("Application.SetMute");}
          },
          threshold:15, //how far has the finger to swipe, that it is not a tap anymore //35//1
          doubleTapThreshold:500, //how much time can pass in max between tabs, that it is a double tap
          maxTimeThreshold:1,//5000
          fingers:'all'
        });
		
		/*-------------Index Page - Media Control Buttons-------------------------*/
		
		$(".playercontrol").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.playercontrol($(this).attr('data-yJsonFunction'));
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
			yCore.simpleJsonRequest($(this).attr('data-yJsonFunction'));
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
			'{"jsonrpc": "2.0", "method": "Player.GoTo", "params": { "playerid": ' + yCore.activePlayer + ', "to": "' + actionname + '"}, "id": 1}',
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
					document.getElementById('SetRepeat').innerHTML = "<span class='icon-refresh'></span>";
				} else if (resultGetProperties["result"]["repeat"] == "one"){
					yCore.sendJsonRPC(
						'SetRepeat-off',
						'{"jsonrpc": "2.0", "method": "Player.SetRepeat", "params": { "playerid": ' + yCore.activePlayer + ', "repeat": "off" }, "id": 1}',
						' '
					);
					document.getElementById('SetRepeat').innerHTML = "<span class='icon-refresh-one'></span>";			
				} else {
					yCore.sendJsonRPC(
						'SetRepeat-all',
						'{"jsonrpc": "2.0", "method": "Player.SetRepeat", "params": { "playerid": ' + yCore.activePlayer + ', "repeat": "all" }, "id": 1}',
						' '
					);
					document.getElementById('SetRepeat').innerHTML = "<span class='icon-refresh-no'></span>";
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
					document.getElementById('SetShuffle').innerHTML = "<span class='icon-random-straight'></span>";
				} else {
					yCore.sendJsonRPC(
						'SetShuffle-all',
						'{"jsonrpc": "2.0", "method": "Player.SetShuffle", "params": { "playerid": ' + yCore.activePlayer + ', "shuffle": false }, "id": 1}',
						' '
					);
					document.getElementById('SetShuffle').innerHTML = "<span class='icon-random'></span>";
				}
			}
		);
	},
	sendTextButton: function(sendText) {
        
        //Hack for youtube search in youtube addon
        if($("#addonDetails").attr('data-yaddonname')  == "plugin.video.youtube"){
            //populate addon with new querry and replace spaces from search string with +
            yAddons.populateAddon("plugin://plugin.video.youtube/kodion/search/query/?q=" + sendText.replace(' ', '+'), "");
        }
        
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
						document.getElementById('SetMute').innerHTML = "<span class='icon-volume-off'></span>";
					} else {
						document.getElementById('SetMute').innerHTML = "<span class='icon-volume-up'></span>";
					}
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
			function(resultSetFullscreen){
                if(resultSetFullscreen["result"] == true){
                    $("#swipe").css("background-color", "#444");                            
                    $('#radioMedia').prop("checked", true);
                    if(yRemote.showHelp){
                        $("#swipe-box-help").show();
                        $("#swipe-box-Media-help").show();
                        $("#swipe-box-Nav-help").hide();
                    }
                } else {
                    $("#swipe").css("background-color", "#666");  
                    $('#radioNav').prop("checked", true);
                    if(yRemote.showHelp){
                        $("#swipe-box-help").show();
                        $("#swipe-box-Nav-help").show();
                        $("#swipe-box-Media-help").hide();
                    }
                }
                $(".nav-med").checkboxradio("refresh");
            }
		);
	},
}
var yStart = {
    initDone: false,
    init: function(){      
        if (!yStart.initDone){  //that it doesn't run twice
            
            //prepare page according to settings
            if(yS.yS.startPageSettings.showRecentMovies){
                $("#newMovies").collapsible("expand");
            } else {
                $("#newMovies").collapsible("collapse");
            }
            if(yS.yS.startPageSettings.showRecentSeries){
                $("#newSeries").collapsible("expand");  
            } else {
                $("#newSeries").collapsible("collapse");
            }
            if(yS.yS.startPageSettings.showRecentMusic){
                $("#newMusic").collapsible("expand");              
            } else {
                $("#newMusic").collapsible("collapse");
            }
            if(yS.yS.startPageSettings.showmostUsedAddons){
                $("#mostUsedAddons").collapsible("expand");              
            } else {
                $("#mostUsedAddons").collapsible("collapse");
            }
            if(yS.yS.startPageSettings.showmostUsedFavs){
                $("#mostUsedFavs").collapsible("expand");              
            } else {
                $("#mostUsedFavs").collapsible("collapse");
            }
            
            //refresh of the choice box will be donw later, on expand of tools collapsible
            $("#turn-off-select").val(yS.yS.startPageSettings.shutdownchoice);       
      
            yCore.sendJsonRPC(
                'getRecentMovies',
                '{"jsonrpc":"2.0","method":"VideoLibrary.GetRecentlyAddedMovies","id":1,"params":[["title","year","playcount","runtime","thumbnail","sorttitle","resume","rating"],{"end":10,"start":0}]}',
                function(resultgetRecentMovies){
                    //if there is nothing in the library hide menu item and collapsible on startpage 
                    //also discount the header item to set later appropriate width
                    if(resultgetRecentMovies["result"]["limits"]["end"] == 0){
                        $(".h-movies").remove();
                        $("#newMovies").hide();
            
                        yCore.headerMenuItems -= 1;
                        //set width of header-menu items, have to do it for all request since i don't know when they are comming back
                        $(".ui-grid-d > .ui-block-a, .ui-grid-d > .ui-block-b, .ui-grid-d > .ui-block-c, .ui-grid-d > .ui-block-d, .ui-grid-d > .ui-block-e").css("width", (100 / yCore.headerMenuItems) + "%");
                    } else {
                        for (var i = 0; i < resultgetRecentMovies["result"]["limits"]["end"]; i++) {
                          
                            var imagetag = "";
                            if(!yS.yS.hidePrevPics){
                                imagetag = yTools.imageUrlNormalizer(
                                    resultgetRecentMovies["result"]["movies"][i]["thumbnail"], 
                                    "?", 
                                    "tag", 
                                    "moviePrevPic centerFa",
                                    ""
                                );
                            }
                            
                            var seenAndResume = "";
                            var resume = 0;
                            if(resultgetRecentMovies["result"]["movies"][i]["playcount"]>0){
                                seenAndResume += "<i class='icon-check green'></i> ";
                            }
                            if(
                                resultgetRecentMovies["result"]["movies"][i]["resume"] !== undefined 
                                && resultgetRecentMovies["result"]["movies"][i]["resume"]["position"]>0
                            ){
                                seenAndResume += "<i class='icon-clock-o orange'></i> ";
                                resume = resultgetRecentMovies["result"]["movies"][i]["resume"]["position"];
                            }
                            
                            var	 md_runtime = Math.round(resultgetRecentMovies["result"]["movies"][i]["runtime"]/60);
                            if (md_runtime > 0){md_runtime += "min";}else{ md_runtime = "?";}
                            
                            $("#recentMovies").append(
                                "<a class='openMovieItem movieItem recentMovie ' data-yResume='" + resume + "' data-yMovieId='" + resultgetRecentMovies["result"]["movies"][i]["movieid"] + "'>"
                                      + "<div class='prevPicContainerMusic'>"
                                          + imagetag
                                      + "</div>"
                                      + "<div>"
                                      + "<h4>" + seenAndResume + resultgetRecentMovies["result"]["movies"][i]["title"] + "</h4>"
                                      + "<p><span class='movieYear'>" + $.t("year", {yYear: resultgetRecentMovies["result"]["movies"][i]["year"]}) + "  </span>" + $.t("runtime", {yRuntime:md_runtime}) + "</p>"
                                        + "<p>" + yTools.ratingToStars(resultgetRecentMovies["result"]["movies"][i]["rating"]) + "</p>"
                                      + "</div>" 
                                +"</a>"
                            ).trigger("create");
                        }
                    }
                }
            );
          
            yCore.sendJsonRPC(
                'getRecentSeries',
                '{"jsonrpc":"2.0","method":"VideoLibrary.GetRecentlyAddedEpisodes","id":1,"params":[["title","playcount","season","episode","showtitle","thumbnail","resume","firstaired"],{"end":10,"start":0},{"method":"date","ignorearticle":true,"order":"descending"}]}',
                function(resultgetRecentSeries){
                    //if there is nothing in the library hide menu item and collapsible on startpage 
                    //also discount the header item to set later appropriate width
                    if(resultgetRecentSeries["result"]["limits"]["end"] == 0){
                        $(".h-tv-shows").remove();
                        $("#newSeries").hide();
            
                        yCore.headerMenuItems -= 1;
                        //set width of header-menu items, have to do it for all request since i don't know when they are comming back
                        $(".ui-grid-d > .ui-block-a, .ui-grid-d > .ui-block-b, .ui-grid-d > .ui-block-c, .ui-grid-d > .ui-block-d, .ui-grid-d > .ui-block-e").css("width", (100 / yCore.headerMenuItems) + "%");
                    } else {                  
                        for (var i = 0; i < resultgetRecentSeries["result"]["limits"]["end"]; i++) {          
                            var imagetag = "";
                            if(!yS.yS.hidePrevPics){
                                imagetag = yTools.imageUrlNormalizer(
                                    resultgetRecentSeries["result"]["episodes"][i]["thumbnail"], 
                                    "?", 
                                    "tag", 
                                    "moviePrevPic centerFa",
                                    ""
                                );
                            }
                            
                            var seenAndResume = "";
                            var resume = 0;
                            if(resultgetRecentSeries["result"]["episodes"][i]["playcount"]>0){
                                seenAndResume += "<i class='icon-check green'></i> ";
                            }
                            if(
                                resultgetRecentSeries["result"]["episodes"][i]["resume"] !== undefined 
                                && resultgetRecentSeries["result"]["episodes"][i]["resume"]["position"]>0
                            ){
                                seenAndResume += "<i class='icon-clock-o orange'></i> ";
                                resume = resultgetRecentSeries["result"]["episodes"][i]["resume"]["position"];
                            }
                          
                            $("#recentSeries").append(
                                        "<a class='openMovieItem movieItem recentEpisode' data-yResume='" + resume + "' data-yEpisodeID='"+ resultgetRecentSeries["result"]["episodes"][i]["episodeid"] 
                                            + "' data-yEpisodeNumber='"+ resultgetRecentSeries["result"]["episodes"][i]["episode"]
                                        + "'>"
                                            + "<div>"
                                                + imagetag
                                            + "</div>"
                                            + "<div>"
                                                + "<h4>" + seenAndResume
                                                    + resultgetRecentSeries["result"]["episodes"][i]["showtitle"] + " "
                                                    + resultgetRecentSeries["result"]["episodes"][i]["season"] + "x"
                                                    + resultgetRecentSeries["result"]["episodes"][i]["episode"] + "</h4>"
                                                + "<p>" + resultgetRecentSeries["result"]["episodes"][i]["title"] + " (" + resultgetRecentSeries["result"]["episodes"][i]["firstaired"]  + ")</p>"
                                            + "</div>" 
                                        +"</a>"
                            ).trigger("create");
                        }
                    }
                }
            );
          
            yCore.sendJsonRPC(
                'getRecentMusic',
                '{"jsonrpc":"2.0","method":"AudioLibrary.GetRecentlyAddedAlbums","id":"1","params":[["title","artist","thumbnail"],{"start":0,"end":10}]}',
                function(resultgetRecentMusic){
                    //if there is nothing in the library hide menu item and collapsible on startpage 
                    //also discount the header item to set later appropriate width
                    if(resultgetRecentMusic["result"]["limits"]["end"] == 0){
                        $(".h-music").remove();
                        $("#newMusic").hide();
                        
                        yCore.headerMenuItems -= 1;
                        //set width of header-menu items, have to do it for all request since i don't know when they are comming back
                        $(".ui-grid-d > .ui-block-a, .ui-grid-d > .ui-block-b, .ui-grid-d > .ui-block-c, .ui-grid-d > .ui-block-d, .ui-grid-d > .ui-block-e").css("width", (100 / yCore.headerMenuItems) + "%");
                    } else {
                        for (var i = 0; i < resultgetRecentMusic["result"]["limits"]["end"]; i++) {                  
                            var imagetag = "";
                            if(!yS.yS.hidePrevPics){
                                imagetag = yTools.imageUrlNormalizer(
                                                  resultgetRecentMusic["result"]["albums"][i]["thumbnail"], 
                                                  "?", 
                                                  "tag", 
                                                  "musicPrevPic text-center",
                                                  ""
                                                );
                            }
                          
                            $("#recentMusic").append(
                                "<a class='showAlbum recentAlbum' data-yAlbumID='" + resultgetRecentMusic["result"]["albums"][i]["albumid"] + "'>"
                                  +" <div class='' data-yAlbumID='" + resultgetRecentMusic["result"]["albums"][i]["albumid"] + "'>"
                                      + "<span class='prevPicContainerMusic'>" 
                                        + imagetag
                                      + "</span>"
                                      + "<div>" 
                                        + "<h4>" + resultgetRecentMusic["result"]["albums"][i]["title"] + "</h4>"
                                          +" <p class='musicListArtist'>" +  resultgetRecentMusic["result"]["albums"][i]["artist"] + "</p>"
                                      + "</div>"
                                  + "</div>"
                                +"</a>" 
                            ).trigger("create");
                        }
                    }
                }
            );
            
            //get all addonid's and opens and push it in an array
            var addonopenslist = [];
            $.each( yS.yS.addons, function(key, value) {
                addonopenslist.push({0:key, 1:yS.yS.addons[key].opens});
            });
            
            //sort the array and take the onces with the top 10 opens
            addonopenslist = addonopenslist.sort(function(a, b) { return a[1] < b[1] ? 1 : -1; }).slice(0, 10);
          
            for (i=0;i < addonopenslist.length; i++){ 
                if(/* TODO needed? addonopenslist.length !== 0 && */addonopenslist[i][0] == "plugin.kodi.kodi_fav"){
                    $("#topAddons").append(
                        "<a class='addonlist-item' data-yAddonID='plugin.kodi.kodi_fav' "
                            + "data-yAddonFanartPath=''> "
                            + "<span class='prevPicContainerAddon'><div class='icon-heart heart awsomeicon-padding-ssm'></div></span>"
                            + "<h4 id='favTitle' class='addontitle' data-i18n='kodi-favourites'></h4>"
                        + "</a>"
                    ).trigger("create");
                } else {
                    if(addonopenslist[i] !== undefined) {
                        yCore.sendJsonRPC(
                            'getTopAddons',
                            '{"jsonrpc":"2.0","method":"Addons.GetAddonDetails","id":1,"params":{"addonid":"' + addonopenslist[i][0] +'", "properties": ["name", "thumbnail"]}}',
                            function(resultgetTopAddons){                     
                                if(!yS.yS.hidePrevPics){
                                    imagetag = "<img alt='' class='addonImage' src='"
                                                + yTools.imageUrlNormalizer(resultgetTopAddons["result"]["addon"]["thumbnail"], "?") 
                                            + "' />";
                                }
                              
                                $("#topAddons").append(
                                    "<a class='addonlist-item' data-yAddonID='" + resultgetTopAddons["result"]["addon"]["addonid"] + "' "
                                        + "data-yAddonFanartPath=''> "
                                        + "<span class='prevPicContainerAddon '>" + imagetag + "</span>"
                                        + "<h4 class='addontitle'>" + resultgetTopAddons["result"]["addon"]["name"] + "</h4>"
                                    + "</a>"
                                ).trigger("create");
                            }
                        );
                    }
                }
            }
             
            yCore.sendJsonRPC(
                'getTop10Favs',
                '{"jsonrpc": "2.0", "method": "Favourites.GetFavourites", "params": { "properties": ["window","path","thumbnail","windowparameter"]}, "id": 1}',
                function(resultgetTop10Favs){
                    for (var i = 0; (i < 10 && i < resultgetTop10Favs["result"]["limits"]["end"]); i++) {              
              
                        var pathToFileOrPlace = "";
                        if(resultgetTop10Favs["result"]["favourites"][i]["type"] == "window"){
                          pathToFileOrPlace = resultgetTop10Favs["result"]["favourites"][i]["windowparameter"];
                        } else if(resultgetTop10Favs["result"]["favourites"][i]["type"] == "media") {
                          pathToFileOrPlace = resultgetTop10Favs["result"]["favourites"][i]["path"];
                        }
                
                        //replace all backslashes with double backslashes
                        pathToFileOrPlace = pathToFileOrPlace.replace(/\\/g,"\\\\");
                      
                        var imagetag = "";
                        if(!yS.yS.hidePrevPics){
                            imagetag = yTools.imageUrlNormalizer(
                                          resultgetTop10Favs["result"]["favourites"][i]["thumbnail"], 
                                          resultgetTop10Favs["result"]["favourites"][i]  ["type"], 
                                          "tag", 
                                          "musicPrevPic text-center",
                                          ""
                                        );
                        }
                      
                        $("#topFavs").append(
                            "<a class='showAddonDirItem'"
                                + " data-yAddonFile='" + pathToFileOrPlace
                                + "' data-yAddonFileType='" + resultgetTop10Favs["result"]["favourites"][i]["type"]     
                                + "' data-yAddonFileResume='0"
                                + "' data-yAddonIsBack='' data-yAddonFanartPath='" 
                                + yTools.imageUrlNormalizer(resultgetTop10Favs["result"]["favourites"][i]["thumbnail"], resultgetTop10Favs["result"]["favourites"][i]["type"]) 
                            + "' tabindex='1'>"
                              +"<span class='prevPicContainerMusic'>"
                                  + imagetag
                              + "</span>"
                              + "<div>" 
                                + "<h4>" + resultgetTop10Favs["result"]["favourites"][i]["title"] + "</h4>" 
                                  + "</div>"
                              +"</div>"
                            +"</a>"
                        ).trigger("create");
                    }
                }
            );
                      
            yStart.initDone = 1;
            
            $("#yarcLoading").fadeOut("slow");
		}
        
        $("#newMovies").collapsible({          
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showRecentMovies = true;
                yS.saveSettingsToLocalStorage();
            },
            collapse: function(e){
              //save change in settings
              yS.yS.startPageSettings.showRecentMovies = false;
              yS.saveSettingsToLocalStorage();
            }
        });
        
        $("#newSeries").collapsible({          
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showRecentSeries = true;
                yS.saveSettingsToLocalStorage();
            },
            collapse: function(e){
              //save change in settings
              yS.yS.startPageSettings.showRecentSeries = false;
              yS.saveSettingsToLocalStorage();
            }
        });
        
        $("#newMusic").collapsible({          
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showRecentMusic = true;
                yS.saveSettingsToLocalStorage();
            },
            collapse: function(e){
              //save change in settings
              yS.yS.startPageSettings.showRecentMusic = false;
              yS.saveSettingsToLocalStorage();
            }
        });
        
        $("#mostUsedAddons").collapsible({          
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showmostUsedAddons = true;
                yS.saveSettingsToLocalStorage();
            },
            collapse: function(e){
              //save change in settings
              yS.yS.startPageSettings.showmostUsedAddons = false;
              yS.saveSettingsToLocalStorage();
            }
        });
        
        $("#mostUsedFavs").collapsible({          
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showmostUsedFavs = true;
                yS.saveSettingsToLocalStorage();
            },
            collapse: function(e){
              //save change in settings
              yS.yS.startPageSettings.showmostUsedFavs = false;
              yS.saveSettingsToLocalStorage();
            }
        });
            
        //refresh here, because on select init, the settings are not written by then    
        $("#tools").collapsible({          
            expand: function(e){
                $("#turn-off-select").selectmenu('refresh');
            }
        });
		
        $("body").delegate(".recentMovie", "click", function(e){
			e.stopImmediatePropagation();
            
            var answer = false;
            
            //if there is a resume position, ask if he wants to start there
            if($(this).attr('data-yResume') > 0){
              answer = confirm($.t("resume-at", {yPosition: Math.floor($(this).attr('data-yResume')/60) + ":"
                                + yTools.addZeroTwoDigits($(this).attr('data-yResume') % 60)})
                          );
            }
            
            yCore.sendJsonRPC(
                'PlayMovie',
                '{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item":  {"movieid" : ' + $(this).attr('data-yMovieId') + '}, "options":{ "resume": ' + answer + ' }}, "id": 1}',
                ''
            );
		});
          
        $("body").delegate(".recentEpisode", "click", function(e){
			e.stopImmediatePropagation();
            
            var answer = false;
            
            //if there is a resume position, ask if he wants to start there
            if($(this).attr('data-yResume')>0){
              answer = confirm($.t("resume-at", {yPosition: Math.floor($(this).attr('data-yResume')/60) + ":"
                                + yTools.addZeroTwoDigits($(this).attr('data-yResume') % 60)})
                          );
            }
            
            yCore.sendJsonRPC(
                'PlayEpisode',
                '{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item":  {"episodeid" : ' + $(this).attr('data-yEpisodeID')+ '}, "options":{ "resume": ' + answer + ' }}, "id": 1}',
                ''
            );
		});
        
        $("body").delegate(".recentAlbum", "click", function(e){
			e.stopImmediatePropagation();
            yCore.sendJsonRPC(
                'PlayAlbum',
                '{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item":  {"albumid" : ' + $(this).attr('data-yAlbumID') + '}}, "id": 1}',
                ''
            );
		});
        
        $("body").delegate("#topAddons > .addonlist-item", "click", function(e){
			e.stopImmediatePropagation();
            
            //if the addon is my own injected one, get Kodi Favorites
            if($(this).attr('data-yAddonID') == "plugin.kodi.kodi_fav") { 
				$("#addonDetailsList").empty();
				$("#addonDetailsImage").attr("src","");
                yAddons.openKodiFavs($(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));
            } else {
                $("#addonDetailsList").empty();
                $("#addonDetailsImage").attr("src","");
                yAddons.populateAddon("plugin://" +$(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));
            }
            
            $.mobile.navigate("#addonDetails");
            
			//increment addon startcount in settings by 1 and save it to local storage
            yS.yS.addons[$(this).attr('data-yAddonID')]["opens"] += 1;
            yS.saveSettingsToLocalStorage();
        });
        
        $("body").delegate("#topFavs > .showAddonDirItem", "click", function(e){
			e.stopImmediatePropagation();
            
              
                 
                if($(this).attr('data-yAddonFileType') == "file" || $(this).attr('data-yAddonFileType') == "media"){
                    
                    var answer = false;
                    
                    //if there is a resume position, ask if he wants to start there
                    if($(this).attr('data-yAddonFileResume') != 0){
                      var answer = confirm($.t("resume-at", {yPosition:Math.floor($(this).attr('data-yAddonFileResume')/60)
                                        + ":"
                                        + yTools.addZeroTwoDigits($(this).attr('data-yAddonFileResume') % 60)}) 
                                    );
                    }
                    
                    yCore.sendJsonRPC(
                        'PlayerOpen',
                        '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' + $(this).attr('data-yAddonFile') + '" }, "options":{ "resume": ' + answer + ' } }, "id": 1 }',
                        function(){}
                    );
                    
                } else if ($(this).attr('data-yAddonFileType') == "directory" || $(this).attr('data-yAddonFileType') == "window"){
                    $("#addonDetailsList").empty();
                    if($(this).attr('data-yaddonfile') == "plugin.kodi.kodi_fav"){
                        if( $(this).attr('data-yAddonIsBack') == "back"){
                            yAddons.addonBackPath.pop();yAddons.addonBackPath.pop();
                        }
                        yAddons.openKodiFavs($(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));
                    } else {
                        if( $(this).attr('data-yAddonIsBack') == "back"){
                            yAddons.addonBackPath.pop();yAddons.addonBackPath.pop();
                        }
                        yAddons.populateAddon($(this).attr('data-yAddonFile'), $(this).attr('data-yAddonFanartPath'));
                    }
                    
                    
                    $.mobile.navigate("#addonDetails");
                } 
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
		/*-------------Index Page - cleanAndUpdate  Clean and Update Audio and Video Library  -------------------------*/
		$(".cleanAndUpdate").click(function(e) {
			e.stopImmediatePropagation();
			yStart.cleanAndUpdate($(this).attr('data-yJsonFunction'));
		});

		/*-------------Start Page - Shutdown Dialoge-------------------------*/
		
		$("#turn-off").click(function(e) {
			e.stopImmediatePropagation();
			yCore.simpleJsonRequest($('#turn-off-select option:selected').attr('value'));
		});
        
        $("#turn-off-select").change(function() {
            //save change in settings
            yS.yS.startPageSettings.shutdownchoice = $(this).val();
            yS.saveSettingsToLocalStorage();
        });
    },
	cleanAndUpdate: function(actionname) { //for buttons to clean or update libraries
		yCore.sendJsonRPC(
			'cleanOrUpdateLibrary',
			'{"jsonrpc":"2.0","method":"' + actionname + '","id":1}',
			' '
		);
	}
}

/*
 * manages everything on playlist-page
 */
var yPl = {
	isDragged: false, //gets set, if a pl-list item is draged to recognise clicks
	currentItem: "",
    plItem: "",
	currentItemSongId: "",
    currentItemFilepath: "",
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
		
		$("#plRefresh").click(function(e) {
			e.stopImmediatePropagation();
			yPl.getPlaylist();
		});
		
		$("#emptyPlaylistPl").click(function(e) {
			e.stopImmediatePropagation();
			yPl.emptyPlaylist();
		});
        
		$("#plClose").click(function(e) {
			e.stopImmediatePropagation();
            window.history.back();
		});
        
		$("#currentplaylist").sortable({
			start: function( event, ui ) {
				event.stopImmediatePropagation();
				yPl.isDragged = false;
				$(ui.item).addClass('plItemDragging');
				yPl.currentItem = $(ui.item).attr('data-yplnr'); //remember which item is clicked or dragged
				yPl.currentItemSongId =  $(ui.item).attr('data-songid');
                
                //the item type to be added is different for videos and songs
                if( $("input[name='plType']:checked").val() == 0){
                    yPl.plItem = '{"songid" : ' + $(ui.item).attr('data-songid') + '}';   
                } else {
                    yPl.plItem = '{"file" : "' + $(ui.item).attr('data-yfilepath') + '"}';
                }
			},
			update: function( event, ui ) {
				event.stopImmediatePropagation();
				yPl.isDragged = true;
				yCore.sendJsonRPC(
					'PlayerRemove',
					'{"jsonrpc": "2.0", "method": "Playlist.Remove", "params": { "playlistid": ' + $("input[name='plType']:checked").val() + ', "position": '
                      + yPl.currentItem +'}, "id": 1}',
					function(resultPlaylistRemove){

						if("error" in resultPlaylistRemove){
							alert($.t("cant-remove-pl"));
						} else {
                           yCore.sendJsonRPC(
                              'PlaylistInsert',
                              '{"jsonrpc": "2.0", "method": "Playlist.Insert", "params": { "playlistid" :  ' + $("input[name='plType']:checked").val() +  ',"position":'
                                  + $(ui.item).index() + ', "item" :  ' + yPl.plItem + '}, "id": 1}',
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
        $("#loading_pl").show();
	
		if($(location).attr('hash') != "#pl"){return true;} //don't get playlist if not on playlist page
		
		$("#currentplaylist").empty();
		var currentPlayingtitle = "";
		var currentPlayingSpeed = "";
		var isPlaying = "";
		
		yCore.sendJsonRPC(	//get playing title
			'GetItem-yPL-Player-currenttitle',
			'{ "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": '+$("input[name='plType']:checked").val()
              +', "properties": ["title","file"] }, "id": 1 }',
			function(resultGetItem){
				if(!("error" in resultGetItem)){
					currentPlayingtitle = resultGetItem["result"]["item"]["file"];
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
				'GetPLItemsAudio',						
				'{"jsonrpc": "2.0", "method": "Playlist.GetItems", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail","file"], "playlistid": 0 }, "id": 1}',				
				function(resultPl){

					if(resultPl["result"]["limits"]["end"] == "0"){//check first if playlist empty
						$("#currentplaylist").append(
							"<li>" + $.t("pl-empty") + "</li>"
						);
					}
				
					for (var i = 0; i < (resultPl["result"]["limits"]["end"]); i++) {
                        var imagetag = "";		
                        if(!yS.yS.hidePrevPics){
                           imagetag = yTools.imageUrlNormalizer(
                                        resultPl["result"]["items"][i]["thumbnail"], 
                                        "?", 
                                        "tag", 
                                        "simpleListPrevPic",
                                        ""
                                      );
                        }
                      
						if(currentPlayingtitle == resultPl["result"]["items"][i]["file"]){
							if(currentPlayingSpeed == 0){
                                isPlaying = "<span class='icon-pause'></span> ";
							} else {
                                isPlaying = "<span class='icon-play'></span> ";
							}
						} else {
							isPlaying = "";
						}
						var minutes = Math.floor(resultPl["result"]["items"][i]["duration"] / 60);
						var seconds = resultPl["result"]["items"][i]["duration"] - minutes * 60;
						$("#currentplaylist").append(
							"<li class='plItem simpleList yListItem' data-yplnr='" + i + "' data-songid="+ resultPl["result"]["items"][i]["id"] +">"
                                + "<div class='simpleListPrevPicContainer'>" + imagetag + "</div>"
                                + "<span class='bold' >" +isPlaying + yTools.addZeroTwoDigits(minutes) +":"+ yTools.addZeroTwoDigits(seconds) +"</span> "
                                + "<span>" + resultPl["result"]["items"][i]["title"] + "</span>"
                                + "<span class='italic'>(" + resultPl["result"]["items"][i]["artist"]  + ")</span>"
                                + "<span class='buttonRight'>"
                                    + "<button class='plRemove' data-yplnr='" + i + "' data-inline='true' data-theme='b' data-mini='true'>" 
                                        + "<i class='icon-times'></i> "
                                    + "</button>"
                                + "</span>"
							+ "</li>"
						).trigger("create");
					}
                    $("#loading_pl").hide();
				}
			);
		} else if($("input[name='plType']:checked").val() == "1"){ //if Videoplayer
			yCore.sendJsonRPC(
				'GetPLItemsVideos',							
				'{"jsonrpc": "2.0", "method": "Playlist.GetItems", "params": { "properties": [ "runtime", "showtitle", "season", "title", "artist", "thumbnail","file","episode","playcount" ], "playlistid": 1}, "id": 1}',
				function(resultPl){

					if(resultPl["result"]["limits"]["end"] == "0"){//check first if playlist empty
						$("#currentplaylist").append(
							"<li>" + $.t("pl-empty") + "</li>"
						);
					}

					for (var i = 0; i < (resultPl["result"]["limits"]["end"]); i++) {
                      
                        var imagetag = "";
                        if(!yS.yS.hidePrevPics){
                           imagetag = yTools.imageUrlNormalizer(
                                        resultPl["result"]["items"][i]["thumbnail"], 
                                        "?", 
                                        "tag", 
                                        "simpleListPrevPic",
                                        ""
                                      );
                        }
                        
                        var seen = "";
                        if(resultPl["result"]["items"][i]["playcount"]>0){
                            seen = "<i class='icon-check green'></i> ";
                        }
                      
						if(currentPlayingtitle == resultPl["result"]["items"][i]["file"]){
							if(currentPlayingSpeed == 0){
								isPlaying = "<span class='icon-pause'></span> ";
							} else {
								isPlaying = "<span class='icon-play'></span> ";
							}
						} else {
							isPlaying = "";
						}
						var minutes = Math.floor(resultPl["result"]["items"][i]["runtime"] / 60);
						var seconds = resultPl["result"]["items"][i]["runtime"] - minutes * 60;

                        //items from the library have infos (icon title etc), in the else it's about plugins
						if(resultPl["result"]["items"][i]["showtitle"] == "" || resultPl["result"]["items"][i]["showtitle"] === undefined){
							$("#currentplaylist").append(
								"<li class='plItem simpleList yListItem' data-yfilepath='" + resultPl["result"]["items"][i]["file"] 
                                  + "' data-yplnr='" + i + "'>"
                                    + "<div class='simpleListPrevPicContainer'>" + imagetag + "</div>"
									+ "<span class='bold'>" +isPlaying
										+ yTools.addZeroTwoDigits(minutes) +":"+yTools.addZeroTwoDigits(seconds) 
									+ "</span>"
									+ "<span>" + seen + resultPl["result"]["items"][i]["title"] + "</span>"
									+ "<span class='buttonRight'><button class='plRemove' data-yplnr='" + i + "' data-inline='true' data-theme='b' data-mini='true'>" 
                                        + "<i class='icon-times'></i> "
									+ "</button></span>"
								+ "</li>"
							).trigger("create");
						} else {
							$("#currentplaylist").append(
								"<li class='plItem simpleList yListItem' data-yfilepath='" + resultPl["result"]["items"][i]["file"] 
                                  + "' data-yplnr='" + i + "'>"
                                    + "<div class='simpleListPrevPicContainer'>" + imagetag + "</div>"
									+ "<span class='bold'>" +isPlaying
										+ yTools.addZeroTwoDigits(minutes) +":"+yTools.addZeroTwoDigits(seconds) 
									+ "</span>"
									+ "<span>" + seen + resultPl["result"]["items"][i]["title"] + "</span>"
									+ "<span class='italic'>(" 
                                        + resultPl["result"]["items"][i]["showtitle"]  + " " 
                                        + resultPl["result"]["items"][i]["season"] + "x" + resultPl["result"]["items"][i]["episode"] 
                                    + ")</span>"
									+ "<span class='buttonRight'><button class='plRemove' data-yplnr='" + i + "' data-inline='true' data-theme='b' data-mini='true'>" 
                                        + "<i class='icon-times'></i> "
									+ "</button></span>"
								+ "</li>"
							).trigger("create");		
						}
					}
                    $("#loading_pl").hide();
				}
			);
		} else {
			//Space for other possible players
		}
		return true;
	},
    //first open according player and then open the wanted playlist item (plNumber)
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
					alert($.t("cant-remove-pl"));
				}
				window.setTimeout(yPl.getPlaylist(),1000);
			}
		);
	},
	emptyPlaylist: function () {
		yCore.sendJsonRPC(
			'PlaylistClear',
			'{"jsonrpc": "2.0", "id": 0, "method": "Playlist.Clear", "params": {"playlistid": ' + $("input[name='plType']:checked").val() + '}}',
			function(resultemptyPlaylist){
                yPl.getPlaylist();
			}
		);
	},
    
}

/*
 * All functions to get movie infos and the functions of the movie page AND movieDetails page
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
		
		if(yS.yS.hideSearchMovies){$("#searchMovies").parent().hide();} //hide movieSearch field if set in settings
		if(yS.yS.hideLanguageMovies){$("#languageSelect").parent().hide();} //hide language selection field if set in settings
		if(yS.yS.hideGenreMovies){$("#genreSelect").parent().hide();} //hide  genre selection  field if set in settings
				
		$("#movieDetailsTrailer").button();
        $("#movieDetailsPlayMovie").button();
		
		if (!yMovies.documentReadyAlreadyRun){  //that it doesn't run twice
			yMovies.documentReadyAlreadyRun = 1;
			yMovies.getMovies(); 
		}
		
		$("body").delegate(".openMovieItem", "click", function(e){  //set movie information in details
			e.stopImmediatePropagation();	
			yMovies.openMovieItem($(this).attr('data-yMovieId'));
		});

		$("body").delegate("#movieDetailsPlayMovie", "click", function(e){ //start movie
			e.stopImmediatePropagation();
			yMovies.playMovie($(this).attr('data-yMovieArrayNr'));
		});

		$("body").delegate("#movieDetailsTrailer", "click", function(e){ //start trailer to movie
			e.stopImmediatePropagation();
			yMovies.startMovieTrailer($(this).attr('data-yMovieArrayNr'));
		});
		
		$("#searchMovies").keyup(function() {
			$('#movie_list').empty(); //empty ul to update list with new choices
			$("#movie-flex-prev").empty();
			$("#movie-flex-next").empty();
			yMovies.firstListItem = [0]; //to get track of what was search to go back with button
			yMovies.createMovieList(0, $('#genreSelect option:selected').attr('value'),$('#languageSelect option:selected').attr('value'), $("#searchMovies").val()); 
		});
		
		$("body").delegate("#movieListPrev", "click", function(e){  //checkbox select/unselect reverser
			e.stopImmediatePropagation();
			yMovies.listPos = yMovies.firstListItem.pop(); //if one back, remove item from trail-array
			$("#movie_list").empty();
			$("#movie-flex-prev").empty();
			$("#movie-flex-next").empty();
			
			yMovies.createMovieList(yMovies.listPos, $('#genreSelect option:selected').attr('value'),$('#languageSelect option:selected').attr('value'), $("#searchMovies").val()); 
            
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
			yMovies.createMovieList(yMovies.listPos, $('#genreSelect option:selected').attr('value'),$('#languageSelect option:selected').attr('value'), $("#searchMovies").val());
            
            //scroll to top
            $('html,body').animate({scrollTop: $("#movies").offset().top},'fast');
		});
        
		$("#movieDetailsClose").click(function(e) {
			e.stopImmediatePropagation();
			window.history.back();
		});
        
	},
	/*
	 * Get movies from the library
	 */
	getMovies: function(){
		yCore.sendJsonRPC(
			'GetMovies',
			'{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "limits": { "start": 0 }, "properties": [ "plot", "trailer", "title", "runtime", "year", "genre", "rating", "thumbnail", "file", "playcount", "streamdetails", "resume"], "sort": { "method": "sorttitle", "ignorearticle": true }}, "id": 1}',				
			function(result){                
				yMovies.moviesJSON = result; //write result in Array for further use 
				yMovies.createMovieList(0, yS.yS.moviePageSettings.genreselect, yS.yS.moviePageSettings.languageSelect,$("#searchMovies").val());

				$('#genreSelect').change(function() {  //create Action Listener for list with selection choice
                    
                    //save change in settings
                    yS.yS.moviePageSettings.genreselect = $(this).val();
                    yS.saveSettingsToLocalStorage();
                    
					$('#movie_list').empty(); //empty ul to update list with new choices
                    $("#movie-flex-prev").empty();
                    $("#movie-flex-next").empty();
					yMovies.firstListItem = [0]; //if selection changed, start from the beginning
					//create movieslist accouding to options
					yMovies.createMovieList(0, $(this).val(), $('#languageSelect option:selected').attr('value'),$("#searchMovies").val()); 
				});

				$('#languageSelect').change(function() {  //create Action Listener for list with selection choice
                    
                    //save change in settings
                    yS.yS.moviePageSettings.languageSelect = $(this).val();
                    yS.saveSettingsToLocalStorage();
                  
					$('#movie_list').empty(); //empty ul to update list with new choices
                    $("#movie-flex-prev").empty();
                    $("#movie-flex-next").empty();
					yMovies.firstListItem = [0];//if selection changed, start from the beginning
					yMovies.createMovieList(0, $('#genreSelect option:selected').attr('value'),$(this).val(), $("#searchMovies").val()); //create movieslist according to options
				});
			}
		);
	},
	/*
	 * Set information to according movie in details
	 */
	openMovieItem: function(movieNr) {

		if(!yS.yS.hideFileLinkMovies){
            yCore.sendJsonRPC(
                'PrepareDownload',
                '{"jsonrpc":"2.0","method":"Files.PrepareDownload","id":1,"params":["' + yMovies.moviesJSON["result"]["movies"][movieNr]["file"] +'"]}',				
                function(resultPrepareDownload){
                  
                    $("#movieDetailsFilelink").attr("href", "http://" + $(location).attr('host') + "/" + resultPrepareDownload["result"]["details"]["path"]);
                    
                    if (resultPrepareDownload["result"]["details"]["path"].match("^vfs/special")) {
                        $("#movieDetailsFilelink").hide();
                    } else {
                        $("#movieDetailsFilelink").show();
                    }
                }
            );
            $("#movieDetailsFilelink").text($.t("filelink", {yFileLink:yMovies.moviesJSON["result"]["movies"][movieNr]["file"]}));
        }      
      
        $('#movieDetailsPlayMovie').text($.t("play")).button("refresh");
		yMovies.genresToString(movieNr);
		
		var md_year = yMovies.moviesJSON["result"]["movies"][movieNr]["year"];
		if(md_year > 0){md_year = " (" + md_year + ")";}else{md_year="";}
		
		var	 md_runtime = Math.round(yMovies.moviesJSON["result"]["movies"][movieNr]["runtime"]/60);
		if (md_runtime > 0){md_runtime += "min";}else{ md_runtime = "?";}
		
		if(yMovies.moviesJSON["result"]["movies"][movieNr]["thumbnail"] == "" || yS.yS.hidePrevPics){
            $("#movieDetailsImage").hide();
        } else {
            $("#movieDetailsImage").attr("src", yTools.imageUrlNormalizer(yMovies.moviesJSON["result"]["movies"][movieNr]["thumbnail"],"?"));
            $("#movieDetailsImage").show();
        }
        
		var seenAndResume = "";
		if(yMovies.moviesJSON["result"]["movies"][movieNr]["playcount"]>0){
            seenAndResume += "<i class='icon-check green'></i> ";
		}
		if(yMovies.moviesJSON["result"]["movies"][movieNr]["resume"] !== undefined && yMovies.moviesJSON["result"]["movies"][movieNr]["resume"]["position"]>0){
            seenAndResume += "<i class='icon-clock-o orange'></i> ";
        }
		
		$("#movieDetailsTitle").html(seenAndResume + yMovies.moviesJSON["result"]["movies"][movieNr]["title"] + md_year);
		$("#movieDetailsRuntime").text($.t("runtime", {yRuntime:md_runtime}));	
		$("#movieDetailsGenres").text($.t("genres", {yGenres:yMovies.genreString}));
		$("#movieDetailsPlot").text(yMovies.moviesJSON["result"]["movies"][movieNr]["plot"]);
        if(!yS.yS.hideLanguageMovies){
			$("#movieDetailsFlags").innerHTML = yTools.pathToFlags(yMovies.moviesJSON["result"]["movies"][movieNr]["streamdetails"]["audio"]);
		}
		if(yMovies.moviesJSON["result"]["movies"][movieNr]["trailer"] == ""){ //if there is an empty trailer string
 			$("#movieDetailsTrailer").parent().hide();
		} else {
			$("#movieDetailsTrailer").attr("data-yMovieArrayNr", movieNr);
			$("#movieDetailsTrailer").parent().show();
		}

        $("#movieDetailsPlayMovie").attr("data-yMovieArrayNr", movieNr);

        //push new histroy element so that #movies ist the latest back position
        $.mobile.navigate("#movieDetails");
    },
	/*
	 * Function who runs in the beginning or if movielist changes
	 * and creates items in the list according to settings:
	 * which genre, which language, which search list term, what part of the list, if listitems per page reduced
	 */
	createMovieList: function(listStart, genre, language, searchval) {  //create movielist in DOM
		var selectedGenre = genre;
		var selectedLang = language;
		var movieGenreInItem;
		var langToCode= new Array(); //needed for language to languagecode translation
		var tempGenreLenth = yMovies.genres.length; //save length to check later if it is the first time to be updated
		
		itemsInList = 0; //needed to find out, how many items are shown, so that if list is restricted we know if next button has to be shown
		
		yMovies.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button
		
			if(yS.yS.listLength > yMovies.moviesJSON["result"]["limits"]["end"]){
				yMovies.listLength = yMovies.moviesJSON["result"]["limits"]["end"];
			} else{
				yMovies.listLength = yS.yS.listLength;
			}
				
			//only show back button if it is not the start of the list
			if(yMovies.listPos != 0){		
				$("#movie-flex-prev").append(
					"<a id='movieListPrev' data-yMovieId='movieListPrev' class='flexListPrevNext'>"
                        +"<span class='icon-arrow-left prev-next-arrow'></span>"
					+"</a>" 
				);	
				$("#movie-flex-prev").show(); 
			} else {$("#movie-flex-prev").hide(); }
				
			//all movies
			for (var i = 0; i < yMovies.moviesJSON["result"]["limits"]["end"]; i++) { 
				langToCode.length = 0;
				movieGenreInItem = false;
				var flags = ""; //set var new for each movie
				
				var m_filePath = yMovies.moviesJSON["result"]["movies"][i]["file"];
				
				
				/*
				 * There are two places, where it searches for language:
				 *  first the streamdetails form kodi, if there is something, add some additional data: 
				 * 			- the languages full name, 
				 * 			- which flag should be used to represent the language
				 * 			- and the isocode, for further reverence, if it is already added to streamdetails
				 * */
				
				if(!yS.yS.hideLanguageMovies){
					//add flag and "language-native" to streamdetails of the yarc internal movies-array
					for (var j=0;  j < yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"].length; j++){//run whole kodi-language list
						if (yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["language"] in langCodeToDescFlag){//if code is in json
							var lang = yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["language"]
							yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["native"] = langCodeToDescFlag[lang]["native"];
							yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["flag"] = langCodeToDescFlag[lang]["flag"];
							yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["isocode"] = langCodeToDescFlag[lang]["iso639-2"];
							if ($("#languageSelect option[value=" + langCodeToDescFlag[lang]["iso639-2"] + "]").length == 0 ){
								$('#languageSelect').append("<option value='"	+ langCodeToDescFlag[lang]["iso639-2"] + "'>" 
                                    + langCodeToDescFlag[lang]["native"] + "</option>");
							}
							
						}
					}
					
					/*
					*  secondly, it searches for isocodes in the filename which has to be in brackets [], if there is found something, it also 
					*  addes the additional data into the streamdetails-audio (yarc internal only)
					*/
					if (m_filePath.indexOf("[") >= 0){//if there is no starting bracket in filepath, don't even try
						for (var code in langCodeToDescFlag) { //go trough every isocode in the list
                            if (m_filePath.toLowerCase().indexOf("["+code+"]") >= 0) {//if code is found in filename	
                                var codeIsSet = false;
                                for (var j=0;  j < yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"].length; j++){//go trough whole streamdetails-audio list
                                    if(langCodeToDescFlag[code]["iso639-2"] == yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][j]["isocode"]){//if code is already in streamdetails-audio...
                                        codeIsSet = true;//... remeber it to...
                                    }
                                }
                                if(!codeIsSet){//..not add it again to streamdetails list
                                    var streamdet = {
                                        native:langCodeToDescFlag[code].native,
                                        flag:langCodeToDescFlag[code].flag,
                                        isocode:langCodeToDescFlag[code]["iso639-2"]
                                    };//prepare object to be pushed into streamdetails-audio
                                    yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"].push(streamdet);//push object above
                                    if ( $("#languageSelect option[value=" + langCodeToDescFlag[code]["iso639-2"] + "]").length == 0 ){//if language is not in languageselect,
                                        $('#languageSelect').append("<option value='"+ langCodeToDescFlag[code]["iso639-2"] + "'>" + langCodeToDescFlag[code].native + "</option>");
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
						movieGenreInItem = true;	 
					}
				}
				
				if(selectedGenre == "all" || movieGenreInItem){ //runs per movie if in genre selcet all or a matching genre is selected
                    var isocodeIsSelectedLang = false;
                    for (var k=0;  k < yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"].length; k++){//go trough whole audio info's
                        if(yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"][k]["isocode"] == selectedLang){
                            isocodeIsSelectedLang = true
                        }         
                    }

					if(selectedLang == "all" || isocodeIsSelectedLang){ //runs per movie if in language selcet all or a matching language is selected						
						//first check if searchfield Value is undefinde (no input yet) and then if the title is matching (in lowercase)
						if(searchval === undefined || yMovies.moviesJSON["result"]["movies"][i]["title"].toLowerCase().indexOf(searchval.toLowerCase()) != -1){
							
							//skip what should not be seen
							if(i >= yMovies.listPos && itemsInList < yMovies.listLength){
								
								var m_runtime = Math.round(yMovies.moviesJSON["result"]["movies"][i]["runtime"]/60);
								if (m_runtime > 0){m_runtime += "min";}else{ m_runtime = "?";} //makes runtime string if aviable
								
								var m_year = yMovies.moviesJSON["result"]["movies"][i]["year"];
								if (m_year < 1){m_year = "?";} //makes year string if unaviable
								
								var seenAndResume = "";
								if(yMovies.moviesJSON["result"]["movies"][i]["playcount"]>0){
									if(yS.yS.hideWatched){continue;}//if setting says to not show seen movies, go to next iteration
                                    seenAndResume += "<i class='icon-check green'></i> ";
								}
								
								if(
                                    yMovies.moviesJSON["result"]["movies"][i]["resume"] !== undefined 
                                    && yMovies.moviesJSON["result"]["movies"][i]["resume"]["position"]>0
                                ){
                                    seenAndResume += "<i class='icon-clock-o orange'></i> ";
                                }
								
								if(!yS.yS.hideLanguageMovies){
									flags =  yTools.pathToFlags(yMovies.moviesJSON["result"]["movies"][i]["streamdetails"]["audio"]);
								} else {
									flags = "";
								}
								$("#movie_list").append(
									"<a class='openMovieItem movieItem' data-yMovieId='" + i + "'>"
                                         + "<div class='prevPicContainerMovie'>"
                                          + yTools.imageUrlNormalizer(
                                                yMovies.moviesJSON["result"]["movies"][i]["thumbnail"], 
                                                "?", 
                                                "tag", 
                                                "moviePrevPic centerFa ",
                                                ""
                                            ) 
                                         + "</div>"
                                         + "<div>"
                                          + "<h4>" + seenAndResume + yMovies.moviesJSON["result"]["movies"][i]["title"] + "</h4>"
                                          + "<p><span class='movieYear'>" + $.t("year", {yYear: m_year}) + "  </span>" + $.t("runtime", {yRuntime:m_runtime}) + "</p>"
                                           + "<p>" + yTools.ratingToStars(yMovies.moviesJSON["result"]["movies"][i]["rating"]) + "</p>"
                                          + "<p>" + flags + "</p>"
                                         + "</div>" 
									+"</a>"
								);
								itemsInList++; 
								yMovies.lastListItem = i; //remember last item of the list
							}
						}
                    }
				}
					
                if(yS.yS.hidePrevPics){$("#movie_list .moviePrevPic").remove();} //hide previmage if set in settings
			}
				
            //only show if not at the end of the list, or no more items in the list to show
            if(!($("#movie_list .openMovieItem").length < yS.yS.listLength)){	
                $("#movie-flex-next").append(
                    "<a id='movieListNext' data-yMovieId='movieListNext' class='flexListPrevNext'>"
                        +"<span class='icon-arrow-right prev-next-arrow'></span>"
                    +"</a>" 
                );
                $("#movie-flex-next").show();
            } else {$("#movie-flex-next").hide(); }

            if ( !$('#movie_list').children().length ){ //if there are no children, say so
                $("#movie_list").append($.t("no-matching"));
            }
            
            $("#loading_movie").hide();
            
            if(tempGenreLenth <= 0){ //only populate if it is the first time
                yMovies.genres.sort()
                for (var i=0; i < yMovies.genres.length; i++){  //add genre Options to selection
                    $('#genreSelect').append("<option value='" + yMovies.genres[i] + "'>" + yMovies.genres[i] + "</option>");
                }
                
                //Sort Language select
                $('#languageSelect').append($("#languageSelect option").sort(function(a, b) {
                        var at = $(a).text(), bt = $(b).text();
                        return (at > bt)?1:((at < bt)?-1:0);
                }));
            }
            
            //set the selectbox according to setting
            $("#genreSelect").val(yS.yS.moviePageSettings.genreselect);
            $('#genreSelect').selectmenu('refresh');
            
            $("#languageSelect").val(yS.yS.moviePageSettings.languageSelect);
            $('#languageSelect').selectmenu('refresh');
	},
	/*
	 * Writes gernes into a single string for details
	 */
	genresToString: function(movieNr){
		yMovies.genreString = ""; //empty, to remove previous content, to avoid wrong or multiple informations
		for (var j=0; j < yMovies.moviesJSON["result"]["movies"][movieNr]["genre"].length; j++){ //all genres in movie
			yMovies.genreString += yMovies.moviesJSON["result"]["movies"][movieNr]["genre"][j];
			if (j !=  (yMovies.moviesJSON["result"]["movies"][movieNr]["genre"].length -1)) { yMovies.genreString += ", "; }
		}
		if (yMovies.genreString==""){yMovies.genreString+="?";};			
	},
	/*
	 * start movie
	 */
	playMovie: function(movieNr){
		$('#movieDetailsPlayMovie').text($.t("loading")).button("refresh"); // change button text because of long JSON Call time            
        
        //check first if there is a resume position (ask always, so the user has not to get all movies again first)
        yCore.sendJsonRPC(
              'GetMovieDetails',
              '{"jsonrpc":"2.0","method":"VideoLibrary.GetMovieDetails","id":1,"params":['
                  +yMovies.moviesJSON["result"]["movies"][movieNr]["movieid"]
              +',["resume"]]}',
              function(resultDetails){
                  var answer = false;
                  
                  //if there is a resume position, ask if he wants to start there
                  if(resultDetails["result"]["moviedetails"]["resume"] !== undefined && resultDetails["result"]["moviedetails"]["resume"]["position"]>0){
                    var answer = confirm($.t("resume-at", {yPosition: Math.floor(resultDetails["result"]["moviedetails"]["resume"]["position"]/60)
                                      + ":"
                                      + yTools.addZeroTwoDigits(resultDetails["result"]["moviedetails"]["resume"]["position"] % 60)})                                  
                                  );
                  }
                  
                  yCore.sendJsonRPC(
                      'PlayerOpen',
                      '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "movieid": '
                      + yMovies.moviesJSON["result"]["movies"][movieNr]["movieid"] + ' }, "options":{ "resume": ' + answer + ' } }, "id": 1 }',
                      ''
                  );
              }
        );
	},	
	/*
	 * watch trailer for movie
	 */
	startMovieTrailer: function(movieNr){
		$('#movieDetailsTrailer').text($.t("loading")).button("refresh"); // change button text because of long JSON Call time
		yCore.sendJsonRPC(
			'PlayerOpen',
			'{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' 
				+ yMovies.moviesJSON["result"]["movies"][movieNr]["trailer"] + '" } }, "id": 1 }',
			function(){$('#movieDetailsTrailer').text($.t("trailer")).button("refresh");}
		);
	}
}

/*
 * All functions to get Tv-show infos and the functions of the series page AND seriesDetails page
 */
var ySeries = {
	TVShowID: "",
	already_run: false,
	init: function() {
		
		if (!ySeries.already_run){  //that it doesn't run twice
              
            ySeries.already_run = true; 
            
            $("#episodeDetailsPlay").button();
            $("#episodeDetailsAddPl").button();
            $("#prevEpisode").button().unwrap();
            $("#nextEpisode").button().unwrap();
            
            
            jQuery.ajax({ //gets series and puts them as a collapsible in DOM
                async: false,
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                type: "POST",
                'url': '/jsonrpc?getTVShows',
                'data': '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { "properties": ["art", "title",  "thumbnail", "playcount"], "sort": { "method": "sorttitle", "ignorearticle": true }}, "id": 1}',
                'dataType': 'json',
                'success': function(resultGetTVShows){                                
                              var seriesThumbAddon = "";
                              var seenAndResume = "";
                              
                              for (var i = 0; i < resultGetTVShows["result"]["limits"]["end"]; i++) {
                                  if(resultGetTVShows["result"]["tvshows"][i]["playcount"] > 0){
                                      if(yS.yS.hideWatched){continue;}//if setting says to not show seen episodes, go to next iteration
                                  }                   
                                  var TVShowID = resultGetTVShows["result"]["tvshows"][i]["tvshowid"];
                                  var TVShowName = resultGetTVShows["result"]["tvshows"][i]["title"];
                                  if(!yS.yS.hidePrevPics){
                                      seriesThumbAddon ="<img class='seriesThumbAddon' alt='" + TVShowName 
                                                      + "' src='" + yTools.imageUrlNormalizer(resultGetTVShows["result"]["tvshows"][i]["art"]["banner"], "?")
                                                      + "'/>";
                                  } else {
                                      seriesThumbAddon = TVShowName;
                                  }
                                  
                                  $("#series_list").append(
                                      "<li>"
                                          + "<div data-role='collapsible' class='openSeries' data-yTVShowID='" + TVShowID + "' data-yTVShowPlaycount='" 
                                              + resultGetTVShows["result"]["tvshows"][i]["playcount"] 
                                          + "'>"
                                              + "<h3>"
                                                  + seenAndResume
                                                  + seriesThumbAddon
                                              + "</h3>"
                                              + "<div id='"	+ TVShowID	+ "'></div>"
                                          + "</div>"
                                      + "</li>"
                                  ).trigger("create");
                                  
                                  
                                  if(resultGetTVShows["result"]["tvshows"][i]["playcount"] > 0){
                                        $('*[data-yTVShowID='+TVShowID+'] a').removeClass('ui-icon-plus').addClass('ui-icon-check');
                                  }  
                              }
                              $("#loading_series").hide();
                        }   
            });
		}
		
		$("body").delegate(".showEpidodeDetails", "click", function(e){ //opens and fills detail-page with episode details
			e.stopImmediatePropagation();            
			ySeries.showEpidodeDetails($(this).attr('data-yEpisodeID'));
		});
        
        $("body").delegate(".addSeriesSeason", "click", function(e){
            e.stopImmediatePropagation();
            $(this).button('disable');
            
            //select season collapsible and search for all links (episodes), then sort them after episode number
            var unsortedArray = $("#" + $(this).attr('data-yShowID') + "-" + $(this).attr('data-yShowSeasonID')).children("a").sort(function (a, b) {
                var contentA = parseInt( $(a).attr('data-yepisodenumber'));
                var contentB = parseInt( $(b).attr('data-yepisodenumber'));
                return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
            })
           
            // if i send each episode in the right order in seperate rpc commands, the order could get confused by delays, 
            // so the solution ist to prepare list of playlist add commands, to be send later at once            
            var episodeSeasonJsonCommands = "[";
            unsortedArray.each(function() {
                episodeSeasonJsonCommands += '{ "jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 1 ,  "item": { "episodeid":  ' 
                    + $(this).attr('data-yepisodeid') + ' } }, "id": ' + $(this).attr('data-yepisodeid') + ' },';
            });
            //cut last comma
            episodeSeasonJsonCommands = episodeSeasonJsonCommands.slice(0,-1);
            //finish list
            episodeSeasonJsonCommands += "]";
            
            //send all seperate json commands in one rpc at once
            yCore.sendJsonRPC(
                'PlaylistAddSeason',
                episodeSeasonJsonCommands,
                ''
            );
            
        });
		
		$("body").delegate("#episodeDetailsPlay", "click", function(e){ // starts episode 
			e.stopImmediatePropagation();
			ySeries.playEpisode($(this).attr('data-yPlaySeriesEpisodeID'));
		});
        
        $("body").delegate("#prevEpisode", "click", function(e){
			e.stopImmediatePropagation();
            ySeries.showEpidodeDetails($(this).attr('data-ySeriesPrevID') );    
		});
        
        $("body").delegate("#nextEpisode", "click", function(e){
			e.stopImmediatePropagation();
            ySeries.showEpidodeDetails($(this).attr('data-ySeriesNextID') );    
		});
		
		$("body").delegate("#episodeDetailsAddPl", "click", function(e){ // starts episode 
			e.stopImmediatePropagation();
			ySeries.addEpisodeToPlaylist($(this).attr('data-yEpisodeID'));
            $("#episodeDetailsAddPl").button('disable'); //init of button and get rid of div around (created by buton() )
		});
        
		$("#episodeDetailsClose").click(function(e) {
			e.stopImmediatePropagation();
			window.history.back();
		});
        
        $(".openSeries").collapsible({
            expand: function(e){ 
                        e.stopImmediatePropagation();
                        ySeries.openSeries($(this).attr('data-yTVShowID'));//gets seasons of series and puts them in a list and add's it to DOM
                    },
            collapse: function(e){ //removes episodes from DOM if series is closed
                          var node = document.getElementById($(this).attr('data-yTVShowID'));
                          if ( node.hasChildNodes() ){
                              while ( node.childNodes.length >= 1 ){
                                  node.removeChild( node.firstChild );       
                              } 
                          }
                          
                          if($(this).attr('data-yTVShowPlaycount') > 0){
                                $('*[data-yTVShowID='+$(this).attr('data-yTVShowID')+'] a').addClass('ui-icon-check').removeClass('ui-icon-plus');
                          }
            }                    
        });        
	},
	/*
	 * called if a Series (or TV-show) is opened
	 */
	openSeries: function(TvShowId){
		var TVShowSeasonID = "";
        
        $("#"+TvShowId).append("<ul class='tvshowloading-" + TvShowId + "' class='ulbar' data-role='listview'><li class='loading loading_season'><div class='text-center'><img class='kodi_loading' src='resources/images/kodi_spinner.gif' alt='loading data'><span>" + $.t("loading") + "</span></div></li></ul>").trigger("create");
        
		yCore.sendJsonRPC(
			'GetSeasons',
			'{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": {"properties": ["season", "showtitle", "fanart", "playcount"], "tvshowid":' 
									+ TvShowId + '}, "id": 1}',
			function(resultGetSeasons){
				for (var j = 0; j < resultGetSeasons["result"]["limits"]["end"]; j++) {
					var TVShowSeasonID = resultGetSeasons["result"]["seasons"][j]["season"]; // that right season is in right collapsible
					
					var seenAndResume = "";
					if(resultGetSeasons["result"]["seasons"][j]["playcount"] > 0){
                        if(yS.yS.hideWatched){continue;}//if setting says to not show seen episodes, go to next iteration
                        seenAndResume += "<i class='icon-check green'></i> ";
                    }
					
					$("#"+TvShowId).append(
						"<div data-role='collapsible' class='openSeason' data-yTVShowID='" + TvShowId + "' data-yTVShowSeasonID='" + TVShowSeasonID + "'>"
							+ "<h3>"+ seenAndResume  + resultGetSeasons["result"]["seasons"][j]["label"] + "</h3>"
							+ "<div id='" + TvShowId + "-" + TVShowSeasonID + "'></div>"
						+ "</div>"
					).trigger('create');   
                    
                    yCore.sendJsonRPC(
                        'GetEpisodes',
                        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "properties": ["season","episode", "showtitle", "plot", "thumbnail", "file", "rating", "playcount", "streamdetails", "resume"],"tvshowid":' + TvShowId + ',"season" : ' + TVShowSeasonID + ' }, "sort": { "order": "ascending", "method": "episode"}, "id": 1}',
                        function(resultGetEpisodes){
                            //Add a button to add whole season to the playlist
                            $("#" + TvShowId + "-" + TVShowSeasonID).append(
                                "<div class='addSeriesSeason' "
                                    + "data-yShowID='" + TvShowId + "' "
                                    + "data-yShowSeasonID='" + TVShowSeasonID + "' >" + $.t("add-season-pl")
                              + "</div>"
                            );                            
                            $("#series_list .addSeriesSeason").button(); 
                            
                            for (var k = 0; k < resultGetEpisodes["result"]["limits"]["end"]; k++) {
                                
                                var seenAndResume = "";
                                if(resultGetEpisodes["result"]["episodes"][k]["playcount"]>0){
                                    if(yS.yS.hideWatched){continue;}//if setting says to not show seen episodes, go to next iteration
                                    seenAndResume += "<i class='icon-check green'></i> ";
                                }
                                
                                if(
                                    resultGetEpisodes["result"]["episodes"][k]["resume"] !== undefined 
                                    && resultGetEpisodes["result"]["episodes"][k]["resume"]["position"]>0
                                ){
                                    seenAndResume += "<i class='icon-clock-o orange'></i> ";
                                }
                                
                                var imageTag = "";
                                if(!yS.yS.hidePrevPics){
                                    imageTag = yTools.imageUrlNormalizer(
                                                  resultGetEpisodes["result"]["episodes"][k]["thumbnail"], 
                                                  "?", 
                                                  "tag", 
                                                  "seriesPrevPic",
                                                  ""
                                                );
                                }
                                
                                $("#"+TvShowId+"-"+TVShowSeasonID).append(
                                "<a class='showEpidodeDetails' data-yEpisodeID='"+ resultGetEpisodes["result"]["episodes"][k]["episodeid"] 
                                    + "' data-yEpisodeNumber='"+ resultGetEpisodes["result"]["episodes"][k]["episode"]
                                + "'>"
                                    + "<li class='series-item yListItem'> "                                    
                                        + imageTag
                                        + "<h4>" + seenAndResume + resultGetEpisodes["result"]["episodes"][k]["label"] + "</h4>"
                                    + "</li>"
                                + "</a>"
                                );
                            }
                            
                            //removes season collapsible, if empty
                            if (!$("#"+TvShowId+"-"+TVShowSeasonID + " li"  ).children().length){
                                    $("#"+TvShowId+"-"+TVShowSeasonID).parent().parent().remove(); //[check: better selector
                                    $("#"+TvShowId).append("<div>"+ $.t("no-matching-series", {ySeason:TVShowSeasonID}) +"</div>").trigger("create");
                            }
                        },
                        false
                    );
          
				}

                $(".tvshowloading-" + TvShowId).remove();
                
			}
		);
	},
	/*
	 * called if a Episode is opened
	 */
	showEpidodeDetails: function(episodeID){
        $("#episodeDetailsAddPl").button('enable');
        
        //check if this episode in the list ist first "episode"-child
        if($('.showEpidodeDetails[data-yepisodeid="' + episodeID + '"]').index() == 1){
            $("#prevEpisode").button('disable');
        } else {
            $("#prevEpisode").button('enable');
            //add episode ID of previous item
            $("#prevEpisode").attr('data-ySeriesPrevID', $('.showEpidodeDetails[data-yepisodeid="' + episodeID + '"]').prev().attr("data-yepisodeid"));
        }
        //check if this episode in the list ist last child
        if($('.showEpidodeDetails[data-yepisodeid="' + episodeID + '"]').is(':last-child')){
            $("#nextEpisode").button('disable');
        } else {
            $("#nextEpisode").button('enable'); 
            //add episode ID of next item 
            $("#nextEpisode").attr('data-ySeriesNextID', $('.showEpidodeDetails[data-yepisodeid="' + episodeID + '"]').next().attr("data-yepisodeid"));            
        }
        
		yCore.sendJsonRPC(
			'GetEpisodeDetails',
			'{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodeDetails", "params": { "properties": ["season","episode", "showtitle", "plot", "fanart", "thumbnail", "file", "rating", "playcount", "streamdetails", "resume","firstaired"],"episodeid":' + episodeID + '}, "id": 1}',
			function(resultGetEpisodeDetails){
				
				episodeDetails = resultGetEpisodeDetails["result"]["episodedetails"];
                
                if(!yS.yS.hideFileLinkMovies){
                    yCore.sendJsonRPC(
                        'PrepareDownload',
                        '{"jsonrpc":"2.0","method":"Files.PrepareDownload","id":1,"params":["' + episodeDetails["file"] +'"]}',				
                        function(resultPrepareDownload){
                          
                            $("#episodeDetailsFilelink").attr("href", "http://" + $(location).attr('host') + "/" + resultPrepareDownload["result"]["details"]["path"]);
                            
                            if (resultPrepareDownload["result"]["details"]["path"].match("^vfs/special")) {
                                $("#episodeDetailsFilelink").hide();
                            } else {
                                $("#episodeDetailsFilelink").show();
                            }
                        }
                    );
                    $("#episodeDetailsFilelink").text($.t("filelink", {yFileLink:episodeDetails["file"]}));
                }   
				
				if(!yS.yS.hidePrevPics){
					$("#episodeDetailsImage").attr(
						"src",yTools.imageUrlNormalizer(episodeDetails["thumbnail"], "?")
					);
				}
				
				if(!yS.yS.hideLanguageMovies){
					//add flag and "language-native" to streamdetails of the yarc internal movies-array
					for (var j=0;  j < episodeDetails["streamdetails"]["audio"].length; j++){//run whole kodi-language list
						if(episodeDetails["streamdetails"]["audio"][j]["language"] in langCodeToDescFlag){//if code is in json
							var lang = episodeDetails["streamdetails"]["audio"][j]["language"];
							episodeDetails["streamdetails"]["audio"][j]["native"] = langCodeToDescFlag[lang]["native"];
							episodeDetails["streamdetails"]["audio"][j]["flag"] = langCodeToDescFlag[lang]["flag"];
							episodeDetails["streamdetails"]["audio"][j]["isocode"] = langCodeToDescFlag[lang]["iso639-2"];						
						}
					}
					
					/*
					*  secondly, it searches for isocodes in the filename which has to be in brackets [], if there is found something, it also 
					*  addes the additional data into the streamdetails-audio (yarc internal only)
					*/
					if(episodeDetails["file"].indexOf("[") >= 0){//if there is no starting bracket in filepath, don't even try
						for (var code in langCodeToDescFlag) { //go trough every isocode in the list
							if (langCodeToDescFlag.hasOwnProperty(code)) {
								if (episodeDetails["file"].toLowerCase().indexOf("[" + code + "]") >= 0) {//if code is found in filename	
									var codeIsSet = false;
									//go trough whole streamdetails-audio list
									for (var j=0;  j < episodeDetails["streamdetails"]["audio"].length; j++){
										//if code is already in streamdetails-audio...
										if(langCodeToDescFlag[code]["iso639-2"] == episodeDetails["streamdetails"]["audio"][j]["isocode"]){
											codeIsSet = true;//... remeber it to...
										}
									}
									if(!codeIsSet){//..not add it again to aopton list
										var streamdet = {//prepare object to be pushed into streamdetails-audio
                                            native:langCodeToDescFlag[code].native, 
                                            flag:langCodeToDescFlag[code].flag, 
                                            isocode:langCodeToDescFlag[code]["iso639-2"]};
										episodeDetails["streamdetails"]["audio"].push(streamdet);//push object above
									}
								}
							}
						}
					}
				}
                        
                //show green Tick if played before
                var seenAndResume = "";
                if(episodeDetails["playcount"]>0){
                    seenAndResume += "<i class='icon-check green'></i> ";
                }
				
                if(episodeDetails["resume"] !== undefined && episodeDetails["resume"]["position"]>0){
                    seenAndResume += "<i class='icon-clock-o orange'></i> ";
                }
				
								$("#episodeDetailsTitle").html(
                    seenAndResume + episodeDetails["showtitle"] + " (" + episodeDetails["season"] + "x" + episodeDetails["episode"] + "): " 
                    + episodeDetails["label"]
                );

                $("#episodeDetailsFirstaired").html($.t("firstaired") + ": " + episodeDetails["firstaired"]);  

				document.getElementById('episodeDetailsRating').innerHTML = (
                    $.t("rating", {yRating:yTools.ratingToStars(episodeDetails["rating"])})
                );
				$("div#episodeDetailsPlot").text(episodeDetails["plot"]);
				if(!yS.yS.hideLanguageMovies){
					document.getElementById('episodeDetailsFlags').innerHTML = yTools.pathToFlags(episodeDetails["streamdetails"]["audio"]);
				}
				$("#episodeDetailsPlay").attr("data-yPlaySeriesEpisodeID", episodeDetails["episodeid"]);
                $("#episodeDetailsAddPl").attr("data-yEpisodeID", episodeDetails["episodeid"]);
			}
		);
        
        //push new histroy element so that #series ist the latest back position
        $.mobile.navigate("#seriesDetails");
	},	
	/*
	 * called to play an episode
	 */
	playEpisode: function(episodeID){
        
		$('#episodeDetailsPlay').text($.t("loading")).button("refresh"); // change button text because of long JSON Call time	     
        
        //check first if there is a resume position (ask always, so the user has not to get all movies again first)
        yCore.sendJsonRPC(
              'GetEpisodeDetails',
              '{"jsonrpc":"2.0","method":"VideoLibrary.GetEpisodeDetails","id":1,"params":['
                  + episodeID
              +',["resume"]]}',
              function(resultDetails){
                  var answer = false;
                  
                  //if there is a resume position, ask if he wants to start there
                  if(
                      resultDetails["result"]["episodedetails"]["resume"] !== undefined 
                      && resultDetails["result"]["episodedetails"]["resume"]["position"]>0
                  ){
                    answer = confirm($.t("resume-at", {yPosition: Math.floor(resultDetails["result"]["episodedetails"]["resume"]["position"]/60) + ":"
                                      + yTools.addZeroTwoDigits(resultDetails["result"]["episodedetails"]["resume"]["position"] % 60)})
                                 );
                  }
                  
                  yCore.sendJsonRPC(
                      'PlayerOpen',
                      '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "episodeid":  ' + episodeID + ' }, "options":{ "resume": '+answer+' } }, "id": 1 }',
                      function(){
                          $('#episodeDetailsPlay').text($.t("play")).button("refresh");
                      }
                  );
              }
        );
	},	
	/*
	 * called to add episode to playlist
	 */
	addEpisodeToPlaylist: function(episodeid){
		yCore.sendJsonRPC(
			'PlaylistAdd',
			'{ "jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 1 ,  "item": { "episodeid":  ' + episodeid + ' } }, "id": 1 }',
			''
		);
	}
	
}

/*
 * All functions to get music infos and the functions of the music page AND musicDetails page
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
		
		if(yS.yS.hideSearchMusic){$("#searchMusic").parent().hide();} //hide Search field if set in settings
		if(yS.yS.hideGenreMusic){$("#MusicGenreElements").hide();} //hide  genre selection and play genre Button  field if set in settings
		
		if (!yMusic.already_run){
          
			yMusic.already_run = true; 
            
            $("#playMusicGenre").button();  
            
			yCore.sendJsonRPC(
				'GetAlbums',
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": {"properties": ["title", "thumbnail", "artist", "genre"], "sort": { "order": "ascending", "method": "artist", "ignorearticle": true } }, "id": 1}',
				function(resultGetAlbums){
										
					yMusic.albumJSON = resultGetAlbums; //write result in Array for further use 
					yMusic.createAlbumList(0, yS.yS.musicPageSettings.genreselect, ""); 

					$('#genreSelectMusic').change(function() {  //create Action Listener for list with selection choice
                      
                        //save change in settings
                        yS.yS.musicPageSettings.genreselect = $(this).val();
                        yS.saveSettingsToLocalStorage();
                      
						$('#album_list').empty(); //empty ul to update list with new choices
                        $("#album-flex-prev").empty();
                        $("#album-flex-next").empty();
						
						yMusic.firstListItem = [0];  //if selection changed, start from the beginning
						yMusic.createAlbumList(0, $('#genreSelectMusic').val(), $("#searchMusic").val()); //create albumlist according to options
                        
                        
					});
				}
			);
		}
		
		$("body").delegate("#playMusicGenre", "click", function(e){
			e.stopImmediatePropagation();
			yMusic.emptyPlaylist();
            yCore.sendJsonRPC(
                'GetSongs',
                '{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": { "properties": ["title"],"filter":{"genre":"' + $('#genreSelectMusic').val() + '"}}, "id": 1}',
                function(resultGetSongsByGenre){
                    for (var i = 0; i < (resultGetSongsByGenre["result"]["limits"]["end"]); i++) { //all albums
                        yCore.sendJsonRPC(
                            'PlaylistAdd',
                            '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 0 , "item" : {"albumid" : ' 
                                + resultGetSongsByGenre["result"]["albums"][i]["albumid"] + '} }, "id": 1}',
                            ''
                        );
                    }
                }
            );
            setTimeout(function(){
                yCore.sendJsonRPC(
                    'PlayerOpen',
                    '{ "jsonrpc": "2.0", "method": "Player.Open", "params": {"item":{"playlistid":0}}, "id": 1 }',
                    ''
                );
            }, 1500);
		});
		
		$("body").delegate(".showAlbum", "click", function(e){
			e.stopImmediatePropagation();	
			yMusic.showAlbum($(this).attr('data-yAlbumArrayID')); //give in first attr Kodi-album-id and in the second internal reference		
		});
		
		$("#searchMusic").keyup(function() {
			$('#album_list').empty(); //empty ul to update list with new choices
			$("#album-flex-prev").empty();
			$("#album-flex-next").empty();
			yMusic.firstListItem = [0];//if selection changed, start from the beginning
			yMusic.createAlbumList(0, $('#genreSelectMusic').val(), $("#searchMusic").val());
		});
		
		$("body").delegate("#playPlaylist", "click", function(e){  
			yMusic.playPlaylist();
		});
		
		$("body").delegate("#emptyPlaylistMusic", "click", function(e){ 
            $('#emptyPlaylistMusic').text($.t("done")).button("refresh");         
            setTimeout(function(){$('#emptyPlaylistMusic').text($.t("empty-pl")).button("refresh");}, 1500); //change text back in 1.5 seconds 
			yMusic.emptyPlaylist();
		});
		
		$("body").delegate("#albumDetailsAddAlbum", "click", function(e){
			e.stopImmediatePropagation();	
			yMusic.albumDetailsAddAlbum($(this).attr('data-yAlbumArrayNr'));		
		});
		
		$("body").delegate(".playSong", "click", function(e){
			e.stopImmediatePropagation();
			if($("input[name='albumDetailsAddPL']:checked").val() == "1"){
					$(this).fadeTo(500, 0.2); //grey out if added to playlist
			}
			//if it is double pressed, it does not get selected twice
			if($(this).css("opacity") != 0.2){
              yMusic.playSong($(this).attr('data-ySongId'));
            }
		});
        
		$("#albumDetailsClose").click(function(e) {
			e.stopImmediatePropagation();
			window.history.back();
		});
		
		$("body").delegate("#albumListPrev", "click", function(e){  //checkbox select/unselect reverser
			e.stopImmediatePropagation();
			yMusic.listPos = yMusic.firstListItem.pop();//if one back, remove item from trail-array
			$('#album_list').empty();
			$("#album-flex-prev").empty();
			$("#album-flex-next").empty();
			yMusic.createAlbumList(yMusic.listPos, $('#genreSelectMusic').val(), $("#searchMusic").val());
            
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
			yMusic.createAlbumList(yMusic.listPos, $('#genreSelectMusic').val(), $("#searchMusic").val());
            
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
	
        yMusic.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button
        
        if(yS.yS.listLength > yMusic.albumJSON["result"]["limits"]["end"]){
            yMusic.listLength = yMusic.albumJSON["result"]["limits"]["end"];
        } else{
            yMusic.listLength = yS.yS.listLength;
        }
        
        if(yMusic.listPos > 1){//only add back button if it is not the first page	
            $("#album-flex-prev").append(
                "<a id='albumListPrev' data-yAlbumArrayID='albumListPrev' class='flexListPrevNext'>"
                    +"<span class='icon-arrow-left prev-next-arrow'></span>"
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
            if(selectedGenre == "all" || albumGenreInItem == 1){
              
                // show only titles and artists (so far only first in artistsarray) matched to searchstring, also partly
                // artistToString is used, for the case, that there is no artist (it gives back "?")
                if(searchval === undefined || yMusic.albumJSON["result"]["albums"][i]["title"].toLowerCase().indexOf(searchval.toLowerCase()) != -1 || yTools.artistsToString(yMusic.albumJSON["result"]["albums"][i]["artist"]).toLowerCase().indexOf(searchval.toLowerCase()) != -1){

                    //skip what should not be seen
                    if(i >= yMusic.listPos && itemsInList < yMusic.listLength){
                      
                      $("#album_list").append(
                          "<a class='showAlbum' data-yAlbumArrayID='" + i + "'>"
                            +" <div class='' data-yAlbumArrayID='" + i + "'>"
                                + "<span class='prevPicContainerMusic'>" 
                                  + yTools.imageUrlNormalizer(
                                      yMusic.albumJSON["result"]["albums"][i]["thumbnail"], 
                                      "?", 
                                      "tag", 
                                      "musicPrevPic text-center",
                                      ""
                                    ) 
                                + "</span>"
                                + "<div>" 
                                  + "<h4>" + yMusic.albumJSON["result"]["albums"][i]["title"] + "</h4>"
                                    +" <p class='musicListArtist'>" +  yTools.artistsToString(yMusic.albumJSON["result"]["albums"][i]["artist"]) + "</p>"
                                + "</div>"
                            + "</div>"
                          +"</a>" 
                      );
                      itemsInList++; 
                      yMusic.lastListItem = i; //remember last item of the list
                    }
                }
            }
            albumGenreInItem = 0;
            if(yS.yS.hidePrevPics){$("#album_list .musicPrevPic").remove();} //hide previmage if set in settings
        }
        
        //only show if not at the end of the list, and no more items in the list to show
        
        if(!($("#album_list .showAlbum").length < yS.yS.listLength)){
            $("#album-flex-next").append(
                "<a id='albumListNext' data-yAlbumArrayID='albumListNext' class='flexListPrevNext'>"
                    +"<span class='icon-arrow-right prev-next-arrow'></span>"
                +"</a>" 
            );
            $("#album-flex-next").show();
        }else {$("#album-flex-next").hide(); }
        
        if ( !$("#album_list").children().length ){ //if there are no children, say so
            $("#album_list").append($.t("no-matching"));
        }

        $("#loading_music").hide();
        if(tempGenreLenth <= 0){ //only populate if it is the first time
            yMusic.genres.sort()
            for (var i=0; i < yMusic.genres.length; i++){  //add genre Options to selection
                $('#genreSelectMusic').append("<option value='" + yMusic.genres[i] + "'>" + yMusic.genres[i] + "</option>");
            }
        }
            
        //set the selectbox according to setting
        $("#genreSelectMusic").val(yS.yS.musicPageSettings.genreselect);
        $('#genreSelectMusic').selectmenu('refresh');
	},
	/*
	 * runs if an album is opened
	 */
	showAlbum: function (albumArrayNr) {
		$("#albumDetailsSongContainer").empty();
		yCore.sendJsonRPC(
			'GetSongs',
			'{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { "properties": ["title", "artist", "genre", "track", "duration", "album", "thumbnail"], "filter": { "albumid" : ' + yMusic.albumJSON["result"]["albums"][albumArrayNr]["albumid"] + '} }, "id": 1}',
			function(resultGetSongsAlbum){
				$("#albumDetailsAddAlbum").attr("data-yAlbumArrayNr",albumArrayNr);
				
                $("#albumDetailsTitle").text( yTools.artistsToString(yMusic.albumJSON["result"]["albums"][albumArrayNr]["artist"]) + ": " 
						+ yMusic.albumJSON["result"]["albums"][albumArrayNr]["label"]);
				
				if(yMusic.albumJSON["result"]["albums"][albumArrayNr]['thumbnail'] == "" || yS.yS.hidePrevPics){
					$("#albumDetailsImage").hide();
				} else {
                    $("#albumDetailsImage").attr("src", yTools.imageUrlNormalizer(yMusic.albumJSON["result"]["albums"][albumArrayNr]['thumbnail'], "?"));
					$("#albumDetailsImage").show();
				}
				for (var i = 0; i < resultGetSongsAlbum["result"]["limits"]["end"]; i++) {
					var trackNumber = "";
					if(resultGetSongsAlbum['result']['songs'][i]['track'] != "0"){
							trackNumber = resultGetSongsAlbum['result']['songs'][i]['track'] + ") ";
					}
					$("#albumDetailsSongContainer").append(
						"<li class='playSong yListItem' data-ySongId='" + resultGetSongsAlbum['result']['songs'][i]['songid'] + "' tabindex='1'> "
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
        
        $.mobile.navigate("#musicDetails");
	},
	playPlaylist: function () {
		$('#playPlaylist').text($.t("loading")).button("refresh");
		setTimeout(function(){$('#playPlaylist').text($.t("play-pl")).button("refresh");}, 1500);
		yCore.sendJsonRPC(
			'PlayerOpen',
			'{ "jsonrpc": "2.0", "method": "Player.Open", "params": {"item":{"playlistid":0},"options":{"repeat":"off"}}, "id": 1 }',
			''
		);
	},
	emptyPlaylist: function () {
		yCore.sendJsonRPC(
			'PlaylistClear',
			'{"jsonrpc": "2.0", "id": 0, "method": "Playlist.Clear", "params": {"playlistid": 0}}',
			''
		);
	},
	/*
	 * Empty Playlist, Add whole Album and Play
	 */
	albumDetailsAddAlbum: function (albumJsonNr) {
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
					''
				)
			}
		);
	},
	/*
	 * Play a song clicked in Playlist, and if "Add to playlist" active, it just adds it to playlist
	 */
	playSong: function (songid) {			
		if($("input[name='albumDetailsAddPL']:checked").val() == "1"){//if add to pl set
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
			ySongSearch.searchPrintSong($("#songsearch-searchfield").val());
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
			$(this).button().unwrap().button('disable');
			yCore.sendJsonRPC(
				'PlaylistAdd',
				'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 0 , "item" : {"songid" : ' + $(this).attr('data-ySongId') + '} }, "id": 1}',
				''
			);
	});
		
		$("body").delegate("#music-songsearchBack", "click", function(e){
            $.mobile.navigate("#music");
		});
	},
	searchPrintSong: function (searchString) {
		var rangeReg = /.{3}(.+ ?)*/;//at least 3 characters
		if (!rangeReg.test($('[name=songsearch-searchfield]').val())) {
			alert($.t("warning-three-chars"));
			return false;
		}
				
		for (var i = 0; i < (ySongSearch.songs["result"]["limits"]["end"]); i++) {        
          
            var imagetag = "";// prepare image in advance. if there is no image in DB replace with a placeholder image
            if (!yS.yS.hidePrevPics){
                imagetag = yTools.imageUrlNormalizer(
                              ySongSearch.songs["result"]["songs"][i]["thumbnail"], 
                              "?", 
                              "tag", 
                              "simpleListPrevPic text-center",
                              ""
                            );
            }
            
			if(ySongSearch.songs["result"]["songs"][i]["label"].toLowerCase().indexOf(searchString.toLowerCase()) != -1){
				$("#songsearch-list").append(
					"<li class='simpleList yListItem' data-ySongId='" + ySongSearch.songs["result"]["songs"][i]["songid"] + "'>"
                      + "<div class='simpleListPrevPicContainer'>" + imagetag + "</div>"
                      + "<span class='bold'>" + ySongSearch.songs["result"]["songs"][i]["label"] + "</span>"
                      + "<span class='italic'>("+ yTools.artistsToString(ySongSearch.songs["result"]["songs"][i]["artist"]) 
                        + ": " + ySongSearch.songs["result"]["songs"][i]["album"]  + ")"
                      + "</span>"
                      + "<span class='buttonRight'>"
                        + "<button class='songSearchAddPl' data-ySongId='" + ySongSearch.songs["result"]["songs"][i]["songid"] 
                          + "' data-inline='true' data-theme='b' data-mini='true'>" + $.t("add-pl") 
                        + "</button>"
                      + "</span>"
                    + "</li>"
				).trigger("create");
			}
		}
		if ($('#songsearch-list li').length == 0){//if there are no results found, say so
			$('#songsearch-list').append(
              "<li>" + $.t("no-matching") + "</li>"
			);
		}
		return false;
	}
}
/*
 * All functions to get addons and the functions of the addon page AND addonDetails page
 */
var yAddons = {
	addonBackPath: [["plugin://Addons.Home.yarc/",""]],
	addonJSON: [],
	listPos: 0,
	listLength: 0,
	already_run: false,
	init: function() {
      
	
		if(yS.yS.hideSearchAddons){$("#searchAddon").parent().hide();} //hide Search field if set in settings
		if(yS.yS.hideGenreAddons){$("#addonSelect").parent().hide();} //hide  genre selection  field if set in settings
				
		if (!yAddons.already_run){  //that it doesn't run twice
			yAddons.already_run = true;            
                        
			yCore.sendJsonRPC(
				'GetAddons',
				'{"jsonrpc": "2.0", "method": "Addons.GetAddons", "params": { "enabled": true, "type" : "xbmc.python.pluginsource", "properties": ["name", "thumbnail", "fanart"]}, "id": 1}',
				function(resultGetAddons){
					yAddons.addonJSON = resultGetAddons;
                    
                    //inject an item for Kodi favorites in the addon list and update limits in json
                    yAddons.addonJSON.result.addons.push({addonid:"plugin.kodi.kodi_fav",name: $.t("kodi-favourites"),thumbnail:"resources/images/star_grey.png"});                    
                    yAddons.addonJSON["result"]["limits"]["end"] += 1;
                    yAddons.addonJSON["result"]["limits"]["total"] += 1;
                    
                    //check if there are settings for each plugin. if not, create them and save it to local storage        
                    for (var i = 0; i < (yAddons.addonJSON["result"]["limits"]["end"]); i++) {
                        if (!(yS.yS.addons.hasOwnProperty(yAddons.addonJSON["result"]["addons"][i]["addonid"]))) {
                            yS.yS.addons[yAddons.addonJSON["result"]["addons"][i]["addonid"]] = {opens: 1,addonDetailsShowPlot:false};
 						}
					}
                    yS.saveSettingsToLocalStorage();
                    
					$("#loading_addon").hide();
					
					yAddons.createAddonList(0, yS.yS.addonPageSettings.addonselect, "");
				}
			);
			
		}   
		
		$("body").delegate(".addonlist-item", "click", function(e){  //executes addon
			e.stopImmediatePropagation();
            
            //if the addon is my own injected one, get Kodi Favorites
            if($(this).attr('data-yAddonID') == "plugin.kodi.kodi_fav") { 
				$("#addonDetailsList").empty();
				$("#addonDetailsImage").attr("src","");
                yAddons.openKodiFavs($(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));
            } else {
                $("#addonDetailsList").empty();
                $("#addonDetailsImage").attr("src","");
                yAddons.populateAddon("plugin://" +$(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));
            }
            
            $.mobile.navigate("#addonDetails");
            
			//increment addon startcount in settings by 1 and save it to local storage
            yS.yS.addons[$(this).attr('data-yAddonID')]["opens"] += 1;
            yS.saveSettingsToLocalStorage();
		});
        
		$('#addonSelect').change(function() {
                      
            //save change in settings
            yS.yS.addonPageSettings.addonselect = $(this).val();
            yS.saveSettingsToLocalStorage();
            
			$('#addonlist').empty(); //empty ul to update list with new choices
			$("#addon-flex-prev").empty();
			$("#addon-flex-next").empty();
			yAddons.createAddonList(0, $('#addonSelect option:selected').attr('value'), $("#searchAddon").val());
		});
		
		$("#searchAddon").keyup(function() {
			$("#addonlist").empty(); //empty ul to update list with new choices
			$("#addon-flex-prev").empty();
			$("#addon-flex-next").empty();
			yAddons.createAddonList(0, $('#addonSelect option:selected').attr('value'), $("#searchAddon").val());
		});
		
		$("body").delegate("#addonListPrev", "click", function(e){  //checkbox select/unselect reverser
			e.stopImmediatePropagation();
			yAddons.listPos -= yS.yS.listLength;
			$("#addonlist").empty();
			$("#addon-flex-prev").empty();
			$("#addon-flex-next").empty();
			yAddons.createAddonList(yAddons.listPos, $('#addonSelect option:selected').attr('value'), $("#searchAddon").val());
            
            //scroll to top
            $('html,body').animate({scrollTop: $("#addons").offset().top},'fast');
		});

		$("body").delegate("#addonListNext", "click", function(e){  //checkbox select/unselect reverser
			e.stopImmediatePropagation();
			yAddons.listPos += yS.yS.listLength;
			$("#addonlist").empty();
			$("#addon-flex-prev").empty();
			$("#addon-flex-next").empty();
			yAddons.createAddonList(yAddons.listPos, $('#addonSelect option:selected').attr('value'), $("#searchAddon").val());
            
            //scroll to top
            $('html,body').animate({scrollTop: $("#addons").offset().top},'fast');
		});
        $("#addonDetailsRefresh").click(function(e) {
			e.stopImmediatePropagation();
			$("#addonDetailsList").empty();
            yAddons.addonBackPath.pop();//remove item from backpath, will be added again
			yAddons.populateAddon($(this).attr('data-yAddonDirPath'), $(this).attr('data-yAddonFanartPath'));
            
            //scroll to top of addon
            $('html,body').animate({scrollTop: $("#addonDetails").offset().top},'slow');
		});
        
		$("#addonDetailsOpenAddon").click(function(e) {
			e.stopImmediatePropagation();
			yAddons.openAddon($(this).attr('data-yAddonDirPath'));
		});
        
		$("#addonDetailClose").click(function(e) {
			e.stopImmediatePropagation();
            window.history.back();
		});
        
		$("#addonDetailsShowPlot").change(function(e) {
			e.stopImmediatePropagation();
			if($(this).is(':checked')){
				$("#addonDetailsList .addonPlot").show();
			} else {
				$("#addonDetailsList .addonPlot").hide();
				
			}
			//save the settings
            yS.yS.addons[$("#addonDetails").attr('data-yAddonname')]["addonDetailsShowPlot"] = $(this).is(':checked');
            yS.saveSettingsToLocalStorage();
		});
		
   		$("body").delegate(".showAddonDirItem", "click", function(e){                
			e.stopImmediatePropagation();
                  
            //if there was no data pushed, go back to addon overview, otherwise stay in details
            if(yAddons.addonBackPath.length == 2 && $(this).attr('data-yAddonIsBack') == "back"){
                yAddons.addonBackPath = [["plugin://Addons.Home.yarc/",""]];
                window.history.back();
            } else {
                if($(this).attr('data-yAddonFileType') == "file" || $(this).attr('data-yAddonFileType') == "media"){
                    
                     var answer = false;
                    
                     //if there is a resume position, ask if he wants to start there
                     if($(this).attr('data-yAddonFileResume') != 0){
                       var answer = confirm($.t("resume-at", {yPosition:Math.floor($(this).attr('data-yAddonFileResume')/60)
                                        + ":"
                                        + yTools.addZeroTwoDigits($(this).attr('data-yAddonFileResume') % 60)}) 
                                    );
                     }
                     
                     //decode single quote again, so that filename is right again
                     var filePath = $(this).attr('data-yAddonFile').replace('%27', '\'');
                     
                     yCore.sendJsonRPC(
                         'PlayerOpen',
                         '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' + filePath + '" }, "options":{ "resume": ' + answer + ' } }, "id": 1 }',
                         function(){}
                     );
                    
                } else if ($(this).attr('data-yAddonFileType') == "directory" || $(this).attr('data-yAddonFileType') == "window"){
                    $("#addonDetailsList").empty();
                    if($(this).attr('data-yaddonfile') == "plugin.kodi.kodi_fav"){
                        if( $(this).attr('data-yAddonIsBack') == "back"){
                            yAddons.addonBackPath.pop();yAddons.addonBackPath.pop();
                        }
                        yAddons.openKodiFavs($(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));
                    } else {
                        if( $(this).attr('data-yAddonIsBack') == "back"){
                            yAddons.addonBackPath.pop();yAddons.addonBackPath.pop();
                        }
                        yAddons.populateAddon($(this).attr('data-yAddonFile'), $(this).attr('data-yAddonFanartPath'));
                    }
                    
                    //scroll to top of addon
                    $('html,body').animate({scrollTop: $("#addonDetails").offset().top},'slow');
                } 
            }
		});
        
        $("body").delegate(".addonDirItemRight", "click", function(e){
			e.stopImmediatePropagation();

            var contextString = "";
            var fileType = "";
            var windowParameter = "";
            
            //if it's a file item, add posibility to add to playlist and remember it as a media item
            if($(this).closest('.showAddonDirItem').attr('data-yAddonFileType') == "file"){
              fileType = "media";
              
              if(!yS.yS.hideFileLinkMovies){
                  yCore.sendJsonRPC(
                      'PrepareDownload',
                      '{"jsonrpc":"2.0","method":"Files.PrepareDownload","id":1,"params":["' 
                          + $(this).closest('.showAddonDirItem').attr('data-yAddonFile') +'"]}',
                      function(resultPrepareDownload){
                        
                          if("error" in resultPrepareDownload){/*do nothing*/}
                          //if it has plugin or special in the beginning of the filepath 
                          else if (resultPrepareDownload["result"]["details"]["path"].match("^vfs/plugin")
                                || resultPrepareDownload["result"]["details"]["path"].match("^vfs/special")
                          ) {/*do nothing*/}
                          else {
                            
                              contextString += "<a class='downloadLink contextMenu' target='_blank' href='http://" 
                                                  + $(location).attr('host') + "/" 
                                                  + resultPrepareDownload["result"]["details"]["path"] + "' tabindex='1'>" 
                                                  + $.t("download") + "</a>";
                          }
                      },
                      false //synchronous
                  );
              }    
              
              contextString += "<p class='contextMenu addonAddPL' data-yPlaylistID='" 
                                  + $(this).attr('data-yPlaylistID') + "'  data-yAddonFile='" 
                                  + $(this).closest('.showAddonDirItem').attr('data-yAddonFile') 
                                  + "' tabindex='1'>" + $.t('add-pl') + "</p>";
            } else { //if it's not a media item, than remember it as a window item
              fileType = "window";
            }
            
            //for all items
            contextString +=
                "<p class='contextMenu addonAddFavorite' "
                  + "data-yAddonLinkName='" + $(this).closest('.showAddonDirItem').find( "h4" ).text() + "' "
                  + "data-yAddonFile='" + $(this).closest('.showAddonDirItem').attr('data-yAddonFile') + "' "
                  + "data-yAddonFanartPath='" + $(this).closest('.showAddonDirItem').attr('data-yAddonFanartPath') + "' "
                  + "data-yAddonLinkType='" + fileType + "' "
                  + "tabindex='1'>" + $.t('add-remove-kodi-fav') + "</p>";              
            
            //if context is not shown, create context menu and set context to shown;
            if($(this).attr('data-yContextShown') == "0"){
                $(this).closest('.showAddonDirItem').after("<span>" + contextString + "</span>");
                $(this).attr('data-yContextShown', "1");
            } else { //else remove context menu and set to not shown 
                $(this).closest('.showAddonDirItem').next().remove();    
                $(this).attr('data-yContextShown', "0");
            }
        }); 
        
        /* to delete a favorite, just add an existing favorite (results in deleting it)*/
        $("body").delegate(".addonFavDelete", "click", function(e){
			e.stopImmediatePropagation();
            var choice = confirm($.t('sure-to-delete'));

            if (choice) {            
                yCore.addToKodiFavorites(
                    $(this).parent().find("h4").text(),
                    $(this).parent().parent().attr("data-yaddonfiletype"),
                    $(this).parent().parent().attr("data-yaddonfile"),
                    ""
                );
                
                $(this).parent().parent().hide(); //remove it from the list
            }
        });         
        
        $("body").delegate(".addonAddPL", "click", function(e){
          e.stopImmediatePropagation();          
          
          //if it is double pressed, it does not get selected twice
          if($(this).css("opacity") != 0.2){
            yCore.sendJsonRPC(
              'PlaylistAdd',
              '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : ' + $(this).attr('data-yPlaylistID') + ' , "item" : {"file" : "' + $(this).attr('data-yAddonFile') + '"} }, "id": 1}',
              ''
            );            
          }
          $(this).fadeTo(500, 0.2); //grey out if added to playlist
        });
        
        //add to kodi favorites
        $("body").delegate(".addonAddFavorite", "click", function(e){
          e.stopImmediatePropagation();
          
          if($(this).css("opacity") != 0.2){   
             yCore.addToKodiFavorites(
                $(this).attr('data-yAddonLinkName'),
                $(this).attr('data-yAddonLinkType'),
                $(this).attr('data-yAddonFile'),
                $(this).attr('data-yAddonFanartPath')
              );
          }
          $(this).fadeTo(500, 0.2); //grey out if added to playlist
        });
	},
				
	/*
	 * creates addonselection according to type selection and or search string
	 */
	createAddonList: function(listStart, addonTypeSelected, searchval){
				
		var itemsInList = 0; //needed to find out, how many items are shown, so that if list is restricted we know if the next-button has to be shown
		yAddons.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button
		
		if(yAddons.addonJSON["result"]["limits"]["total"] == 0){
			$("#addonlist").append("<li><h3>" + $.t("pl-empty") + "</h3></li>").trigger("create");
			$("#loading_addon").hide();
		} else {
			if(yS.yS.listLength > yAddons.addonJSON["result"]["limits"]["end"]){
				yAddons.listLength = yAddons.addonJSON["result"]["limits"]["end"];
			} else{
				yAddons.listLength = yS.yS.listLength;
			}
			
			if(yAddons.listPos != 0){	 //only add if it's not the first page (value 999999 makes it first item
				$("#addon-flex-prev").append(
					"<li id='addonListPrev' class='flexListPrevNext'> "
                        +"<span class='icon-arrow-left prev-next-arrow'></span>"
					+ "</li>"
				);
                $("#addon-flex-prev").show();
            } else {$("#addon-flex-prev").hide(); }
			
			for (var i = 0; i < (yAddons.addonJSON["result"]["limits"]["end"]); i++) {
				var addonIDStringParts = yAddons.addonJSON["result"]["addons"][i]["addonid"].split('.');
				
				var imagetag = "";						
				if(!yS.yS.hidePrevPics){
                    if(yAddons.addonJSON["result"]["addons"][i]["addonid"] != "plugin.kodi.kodi_fav"){
                        imagetag = "<img alt='' class='addonImage' src='"
                                        + yTools.imageUrlNormalizer(yAddons.addonJSON["result"]["addons"][i]["thumbnail"], "?") 
                                    + "' />";
                    } else {
						imagetag = "<div class='icon-heart heart awsomeicon-padding-ssm'></div>"                   
                    }
				}
				
				if (addonTypeSelected == "all" || addonIDStringParts[1] == addonTypeSelected){ 
					if(searchval === undefined || yAddons.addonJSON["result"]["addons"][i]["name"].toLowerCase().indexOf(searchval.toLowerCase()) != -1){
						$("#addonlist").append(
                            "<li class='addonlist-item' data-yAddonID='" + yAddons.addonJSON["result"]["addons"][i]["addonid"] + "' "
                                + "data-yAddonFanartPath='" + yAddons.addonJSON["result"]["addons"][i]["fanart"] + "' "
                                + "value='" + yS.yS.addons[yAddons.addonJSON["result"]["addons"][i]["addonid"]]["opens"] + "'> "
                                + "<span class='prevPicContainerAddon'>" + imagetag + "</span>"
                                + "<h4 class='addontitle'>" + yAddons.addonJSON["result"]["addons"][i]["name"] + "</h4>"
                            + "</li>"
                        );
						itemsInList++;
					}
                //if plugins are not video or audio (aka "other")
				} else if (addonTypeSelected == "other" && addonIDStringParts[1] != "video" && addonIDStringParts[1] !=  "audio"){
						$("#addonlist").append(
						"<li class='addonlist-item' data-yAddonID='" + yAddons.addonJSON["result"]["addons"][i]["addonid"] + "' "
							+ "data-yAddonFanartPath='" + yAddons.addonJSON["result"]["addons"][i]["fanart"] + "' "
							+ "value='" + yS.yS.addons[yAddons.addonJSON["result"]["addons"][i]["addonid"]]["opens"] + "'> "
							+ "<span class='prevPicContainerAddon '>" + imagetag + "</span>"
							+ "<h4 class='addontitle'>" + yAddons.addonJSON["result"]["addons"][i]["name"] + "</h4>"
						+ "</li>");
						itemsInList++;
                  
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
                        +"<span class='icon-arrow-right prev-next-arrow'></span>"
					+ "</li>"
				);
                $("#addon-flex-next").show();
            } else {$("#addon-flex-next").hide(); }
			
			$("#addonlist .addonlist-item").hide(); //first hide all to prepare negative of slice
			$("#addonlist .addonlist-item").slice(yAddons.listPos, (yAddons.listPos+yAddons.listLength)).show();
			
			if ( !$("#addonlist").children().length ){ //if there are no children, say so
				$("#addonlist").append($.t("no-matching"));
			}
		}	
		
        $("#addonSelect").val( yS.yS.addonPageSettings.addonselect);
        $('#addonSelect').selectmenu('refresh');
	},    
	openAddon: function(addonid){
		yCore.sendJsonRPC(
			'ExecuteAddon',
			'{"jsonrpc": "2.0", "method": "Addons.ExecuteAddon", "params": { "addonid": "' + addonid + '" }, "id": 1}',
			''
		);
	},
	populateAddon:  function(addonIDandPath, prevfanartpath){
      
        $("#loading_addonDetails").show();        
        $("#addonDetailsOpenAddon").show();   
        $("#addonDetailsRefresh").show();
        
        if(addonIDandPath.split('/')[2] !== undefined){
            //addon comes as plugin://bla.bla.ba/blabla¬bla and also cut everything behind ?
            $("#addonDetails").attr('data-yAddonname', addonIDandPath.split('/')[2].split('?')[0]);
        } else {
            $("#addonDetails").attr("");
        }

		var mediatype = "";
        var sorting = "";        
        var getproperties = '';
        var playListID = -1;
        
        if(!addonIDandPath.match("^plugin://")){//if it's a plugin, don't check the filepath
            $.each( yCore.musicSources, function( index, value ){
                if (addonIDandPath.match("^" + value)){mediatype = "music";}
            });
            $.each( yCore.videoSources, function( index, value ){
                if (addonIDandPath.match("^" + value)){mediatype = "video";}
            });
            
            sorting = ', {"method":"label","order":"ascending","ignorearticle":true}'; //only sort if it's not a plugin
        }
		if(addonIDandPath.indexOf('.audio.') >= 0 || mediatype == "music"){
              mediatype = "music";getproperties = '"title","file","thumbnail", "art","duration"';playListID = 0;
        } 
		else if(addonIDandPath.indexOf('.video.') >= 0 || mediatype == "video") {
            mediatype = "video";getproperties = '"title","file","thumbnail", "playcount","art","plot","runtime", "premiered", "resume"';playListID = 1;
        } 
		else {mediatype = "files";getproperties = '"title","file","thumbnail"';}
		

        $("#addonDetailsList").append(
            "<a  id='back' class='showAddonDirItem' "
            + "data-yAddonFile='" + yAddons.addonBackPath[yAddons.addonBackPath.length-1][0] //the path from the previous item
            + "' data-yAddonFileType='directory'"
            + " data-yAddonIsBack='back' data-yAddonFanartPath='" 
            + yAddons.addonBackPath[yAddons.addonBackPath.length-1][1] +"' tabindex='1'>" //fanart from previous item
                +"<div class='addonDirItem yListItem'>"
                    +"<span class='icon-arrow-left addonDirBack'></span>"
                +"</div>"
            +"</a>" 
        );
		
		yCore.sendJsonRPC(
            'OpenAddon_' + addonIDandPath,
			'{"jsonrpc":"2.0","method":"Files.GetDirectory","id":1,"params":["' + addonIDandPath + '","' + mediatype + '",[' + getproperties + ']' + sorting + ']}',
			function(resultOpenAddon){              
				
				//if there is fanart, show it in the background
				if(prevfanartpath == ""){
					$("#addonDetailsImage").hide();
				} else if(!yS.yS.hidePrevPics){
                    if(resultOpenAddon["result"]["files"][0]["filetype"] === undefined){
                        $("#addonDetailsImage").attr("src",yTools.imageUrlNormalizer(prevfanartpath, "?"));
                    } else{
                        $("#addonDetailsImage").attr("src",yTools.imageUrlNormalizer(prevfanartpath, resultOpenAddon["result"]["files"][0]["filetype"]));
                    }
                    $("#addonDetailsImage").show();
				}
				
				//go trough whole returned list
				for (var i = 0; i < resultOpenAddon["result"]["limits"]["end"]; i++) {
                  
                    //replace all backslashes with double backslashes (windows)
                    var filePath = resultOpenAddon["result"]["files"][i]["file"];
                    filePath = filePath.replace(/\\/g,"\\\\");
                    
                    //encode single quote so that programm runs. (in player.open it will be decoded again)
                    filePath = filePath.replace('\'', '%27');
                  	
					//if setting says to not show seen elements, go to next iteration
					if(yS.yS.hideWatched && resultOpenAddon["result"]["files"][i]["playcount"]>0){continue;}
					
                    var imagetag = "";
                    if(!yS.yS.hidePrevPics){
                        imagetag += yTools.imageUrlNormalizer(
                                      resultOpenAddon["result"]["files"][i]["thumbnail"], 
                                      resultOpenAddon["result"]["files"][i]["filetype"], 
                                      "tag", 
                                      "addonDirPrevPic text-center",
                                      ""
                                    );
                    }
                    
                    var seenAndResume = "";
                    //show green Tick if played before
                    if(resultOpenAddon["result"]["files"][i]["playcount"]>0 && resultOpenAddon["result"]["files"][i]["playcount"] !== undefined){
                        seenAndResume += "<i class='icon-check green'></i> ";
                    }
					
					//get rid of the ugly [] brackets with [b] and [color=....] in filenames
					var itemLabel = resultOpenAddon["result"]["files"][i]["label"];
					if(itemLabel.indexOf('[') >= 0){
						var itemLabel = itemLabel.replace(/(\[.*?\])/g, '');
					}
					
					//prepare plot if there is any
					var plot = "";
					if(undefined != resultOpenAddon["result"]["files"][i]["plot"]){
						plot = yTools.escapeHTML(resultOpenAddon["result"]["files"][i]["plot"]);
					}
					
                    var additionalInfo = "";   //if it's a file, runtime is positive and even exists, write the runtime in minutes and seconds     
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
                          additionalInfo +=  $.t("runtime", {yRuntime:minutes + ":" + yTools.addZeroTwoDigits(seconds)});
                        }
                        
                        if(resultOpenAddon["result"]["files"][i]["duration"] != "0" && ("duration" in resultOpenAddon["result"]["files"][i])){
                            var minutes = Math.floor(resultOpenAddon["result"]["files"][i]['duration'] / 60);
                            var seconds = resultOpenAddon["result"]["files"][i]['duration'] - minutes * 60;
                          
                            if(additionalInfo != ""){additionalInfo += "; "}                            
                            additionalInfo +=  $.t("runtime", {yRuntime:minutes + ":" + yTools.addZeroTwoDigits(seconds)});
                        }
                        
                         if(additionalInfo != ""){ additionalInfo = "(" + additionalInfo + ") "}
					}
					
					//check if there is a poster, if not and there is a thumbnail take it, else take one from the previous dialoge
					//this is all to give the infos over, to the next dialoge, it's not used right now, but in the next dialoge if element klicked
					var fanartpath = "";
					if(!yS.yS.hidePrevPics){
                        if("art" in resultOpenAddon["result"]["files"][i]){
                            if ("poster" in resultOpenAddon["result"]["files"][i]["art"]){
                                fanartpath = resultOpenAddon["result"]["files"][i]["art"]["poster"]
                            } else if ("thumbnail" in resultOpenAddon["result"]["files"][i]) {
                                fanartpath = resultOpenAddon["result"]["files"][i]["thumbnail"]
                            } else {
                                fanartpath = prevfanartpath;
                            }
                        }
					}         
					
					var resume = "";
                    if(resultOpenAddon["result"]["files"][i]["resume"] !== undefined && resultOpenAddon["result"]["files"][i]["resume"]["position"]>0){
                        resume = resultOpenAddon["result"]["files"][i]["resume"]["position"];
                        seenAndResume += "<i class='icon-clock-o orange'></i> ";
                    }
                    
					$("#addonDetailsList").append(
						"<a class='showAddonDirItem' "
						+ "data-yAddonFile='" + filePath
						+ "' data-yAddonFileType='" + resultOpenAddon["result"]["files"][i]["filetype"]
                        + "' data-yAddonFileResume='" + resume
						+ "' data-yAddonIsBack='' data-yAddonFanartPath='" + fanartpath 
						+"' tabindex='1'>"
                          +"<div class='addonDirItem yListItem' tabindex='1'>"
                            +"<div class='addonDirItemLeft' tabindex='1'>"
                              + "<span class='addonDirPrevPicContainer'>" + imagetag + "</span>"
                              + "<h4>"+ seenAndResume + itemLabel.replace('\'', 'min') + " " + additionalInfo +"</h4>"
                              +" <p class='addonPlot'>" + plot + "</p>"
                            + "</div>"               
                            + "<div class='addonDirItemRight' data-yContextShown='0' data-yPlaylistID='" + playListID + "' tabindex='1'><h3><i class='icon-ellipsis-v'></i></h3></div>" 
                          +"</div>"
						+"</a>"
					).trigger( "create" ).trigger('refresh');
				}
				
				//if there are no relevant children (backbutton is not relevant), say so
				if ( $("#addonDetailsList").children().length <= 1 ){
					$("#addonDetailsList").append($.t("no-matching"));
				}
				
              	
				$("#addonDetailsRefresh").attr('data-yAddonDirPath', addonIDandPath); 
				$("#addonDetailsRefresh").attr('data-yAddonFanartPath', prevfanartpath); 
				$("#addonDetailsOpenAddon").attr('data-yAddonDirPath', addonIDandPath.split('/')[2]); //addon comes as plugin://bla.bla.ba/blabla¬bla	
                
                //push addon id and the path and the fanart of the last page, as breadcrumbs to go back
                yAddons.addonBackPath.push([addonIDandPath , prevfanartpath]);
				
                //set the checkboxes according to settings
                if(yS.yS.addons.hasOwnProperty($("#addonDetails").attr('data-yAddonname'))){
                    $("#addonDetailsShowPlot").prop(
                        'checked', yS.yS.addons[$("#addonDetails").attr('data-yAddonname')]["addonDetailsShowPlot"]
                    ).checkboxradio("refresh");
                } else {
                    $("#addonDetailsShowPlot").prop('checked', false).checkboxradio("refresh");
                }
                
                if(
                    yS.yS.addons.hasOwnProperty($("#addonDetails").attr('data-yAddonname')) 
                    && yS.yS.addons[$("#addonDetails").attr('data-yAddonname')]["addonDetailsShowPlot"]
                  ){
                    $("#addonDetailsList .addonPlot").show();
                } else {
                    $("#addonDetailsList .addonPlot").hide();
                }
        
				$("#loading_addonDetails").hide();               
			}
		);
	},	
    openKodiFavs: function(addonIDandPath, prevfanartpath){
        $("#addonDetailsOpenAddon").hide();
        $("#addonDetailsRefresh").hide();
        
        $("#addonDetailsImage").hide();
              
        $("#addonDetailsList").append(
            "<a class='showAddonDirItem' "
            + "data-yAddonFile='" + yAddons.addonBackPath[yAddons.addonBackPath.length-1][0] //the path from the previous item
            + "' data-yAddonFileType='directory'"
            + " data-yAddonIsBack='back' data-yAddonFanartPath='" 
            + yAddons.addonBackPath[yAddons.addonBackPath.length-1][1] + "' tabindex='1'>" //fanart from previous item
                +"<div class='addonDirItem yListItem'>"
                        +"<span class='icon-arrow-left addonDirBack'></span>"
                +"</div>"
            +"</a>" 
        );
      
		yCore.sendJsonRPC(
			'Getfavourites',
			'{"jsonrpc": "2.0", "method": "Favourites.GetFavourites", "params": { "properties": ["window","path","thumbnail","windowparameter"] }, "id": 1}',
			function(resultGetKodiFavs){
              
              for (var i = 0; i < resultGetKodiFavs["result"]["limits"]["end"]; i++) {                
                var pathToFileOrPlace = "";
                if(resultGetKodiFavs["result"]["favourites"][i]["type"] == "window"){
                  pathToFileOrPlace = resultGetKodiFavs["result"]["favourites"][i]["windowparameter"];
                } else if(resultGetKodiFavs["result"]["favourites"][i]["type"] == "media") {
                  pathToFileOrPlace = resultGetKodiFavs["result"]["favourites"][i]["path"];
                }
                
                //replace all backslashes with double backslashes
                pathToFileOrPlace = pathToFileOrPlace.replace(/\\/g,"\\\\");
                
                var imagetag = "";
                if(!yS.yS.hidePrevPics){
                    imagetag = yTools.imageUrlNormalizer(
                                  resultGetKodiFavs["result"]["favourites"][i]["thumbnail"], 
                                  resultGetKodiFavs["result"]["favourites"][i]  ["type"], 
                                  "tag", 
                                  "addonDirPrevPic text-center",
                                  ""
                                );
                }
                
                $("#addonDetailsList").append(
                      "<a class='showAddonDirItem'"
                          + " data-yAddonFile='" + pathToFileOrPlace
                          + "' data-yAddonFileType='" + resultGetKodiFavs["result"]["favourites"][i]["type"]     
                          + "' data-yAddonFileResume='0"
                          + "' data-yAddonIsBack='' data-yAddonFanartPath='" 
                          + yTools.imageUrlNormalizer(resultGetKodiFavs["result"]["favourites"][i]["thumbnail"], resultGetKodiFavs["result"]["favourites"][i]["type"]) 
                      + "' tabindex='1'>"
                        +"<div class='addonDirItem yListItem' tabindex='1'>"
                            +"<div class='addonDirItemLeft' tabindex='1'>"
                                + "<span class='addonDirPrevPicContainer'>" + imagetag + "</span>"
                                + "<h4>" + resultGetKodiFavs["result"]["favourites"][i]["title"] + "</h4>" 
                            + "</div>"                 
                            + "<div class='addonFavDelete' data-yContextShown='0' tabindex='1'><h3><i class='icon-times'></i></h3></div>" 
                        +"</div>"
                      +"</a>" 
                  );
              }
				
              //if there are no relevant children (backbutton is not relevant), say so
              if ( $("#addonDetailsList").children().length <= 1 ){
                  $("#addonDetailsList").append($.t("no-matching"));
              }
              
              yAddons.addonBackPath.push(["plugin.kodi.kodi_fav" , ""]);
              
              $("#addonDetails").attr('data-yAddonname', "plugin.kodi.kodi_fav");
              if(yS.yS.addons.hasOwnProperty($("#addonDetails").attr('data-yAddonname'))){
                  $("#addonDetailsShowPlot").prop(
                      'checked', yS.yS.addons[$("#addonDetails").attr('data-yAddonname')]["addonDetailsShowPlot"]
                  ).checkboxradio("refresh");
              }
              
              $("#loading_addonDetails").hide();
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
		if (stars == 0) { return $.t("no-rating");}
		
		stars = Math.round(stars * 100 ) / 100;
		
        htmlString += "<span class='icon-star ratingStars'></span>"+ stars ;
		//htmlString += "<span><img class='ratingStars' alt='' src='resources/images/star.png' />"
//                           + "<span>" "</span></span>";
		return htmlString;
	},
	/*
	 * write all artits from array in a string
	 */
	artistsToString: function(usedJSON){
		var artistString = ""; //empty, to remove previous content, to avoid wrong or multiple informations
		for (var j=0; j < usedJSON.length; j++){ //all genres in movie
			artistString += usedJSON[j];
			if (j !=  (usedJSON.length -1)) { artistString += ", "; }
		}
		return artistString;
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
			if(kodiLang[j]["language"] == ""||kodiLang[j]["isocode"] == "und"){//if langague is empty string or code for "Undetermined" it's like unknown
				returnstring += "";
			} else {
				if(kodiLang[j].flag == ""){ //if there is no flag set, write out the name/description of the language
					returnstring += "[" + kodiLang[j]["native"] + "]&nbsp";
				} else {
					returnstring += "<img class='pathToFlags' alt='flag for " 
						+ kodiLang[j].native + " ("+kodiLang[j].native+")' src='resources/images/flags/" 
						+ kodiLang[j].flag + ".png' "
						+ "title='"+ kodiLang[j].native + " ("+kodiLang[j].isocode+")' />&nbsp;";
				}
			}
		}

		if (returnstring == "") {
			returnstring += $.t("languages-unknown");
		}
		return returnstring;
	},
    /*
     * gives back proper image link
     * imageLink: link to image (String)
     * type: is it a file, folder or should it give back ? if no imagelink (String)
     * tagOrURL: if it should return a img-tag, string "tag" is needed, otherwise only return URL String (String)
     * classes: classes which should be included in image tag (only needed for tagOrURL == "tag")
     * altText: text for alt attribute in image tag (only needed for tagOrURL == "tag")
     * 
     * examples:
     *    - if image tag requested:
     *        yTools.imageUrlNormalizer(
     *           "http://foo.com/bar.jpeg", "file", "tag", "someClasses as in html class attribute", "alt text"
     *        );
     *        
     *    - if only URL requested, the following call is sufficient:
     *        yTools.imageUrlNormalizer("http://foo.com/bar.jpeg", "file");
     */
    imageUrlNormalizer: function(imageLink, type, tagOrURL, classes, altText){
        if(imageLink === undefined){
            imageLink = "none";
        }
      
        //handling empty linkstring
        if(imageLink == ""){
            if(type == "?"){
                 if(tagOrURL == "tag"){
                    return "<span class='" + classes + " icon-question'></span>";//<div class='center'>
                 } else {
                    return "";
                 }
            }
            if(type == "file" || type == "media") {
                 if(tagOrURL == "tag"){
                    return "<span class='icon-file awsomeicon-padding " + classes + "'></span>";
                 } else {
                    return "";
                 }
            } else {
                if(tagOrURL == "tag"){
                    return "<span class='icon-folder-open awsomeicon-padding " + classes + "'></span>";
                } else {
                    return "";
                }
            }
        }
        
        //cut away slash if in the end
        if(imageLink.match("/$") || imageLink.match("%2f$")|| imageLink.match("%2F$")) {
            imageLink = imageLink.slice(0, -1);
        }
        
        //cut away http and add image compressor link if needed
        if(imageLink.indexOf("http://") >=0 || imageLink.indexOf("http%3a%2f%2f") >=0 || imageLink.indexOf("http%3A%2F%2F") >=0){
            imageLink = decodeURIComponent(imageLink);
            if(imageLink.indexOf("image://") >= 0){
                imageLink = imageLink.substring(8);
            }
            if(yS.yS.prevImgQualMovies == 95){
                if(tagOrURL == "tag"){
                    return "<img class='" + classes + "' alt='" + altText + "'src='" + imageLink + "'/>"; 
                } else {
                    return imageLink;
                }
            }
            
            if(tagOrURL == "tag"){
                return "<img class='" + classes + "' alt='" + altText + "'src='http://images.weserv.nl/?url=" 
                + imageLink.substring(7)
                + "&h=85&t=fit&q=" + yS.yS.prevImgQualMovies; + "'/>"; 
            } else {
                return "http://images.weserv.nl/?url=" 
                + imageLink.substring(7)
                + "&h=85&t=fit&q=" + yS.yS.prevImgQualMovies;
            }
        }
        
        //cut away https and add image compressor link if needed
        if(imageLink.indexOf("https://") >=0 || imageLink.indexOf("https%3a%2f%2f") >=0 || imageLink.indexOf("https%3A%2F%2F") >=0){
            imageLink = decodeURIComponent(imageLink);
            if(imageLink.indexOf("image://") >= 0){
                imageLink = imageLink.substring(8);
            }
            if(yS.yS.prevImgQualMovies == 95){
                if(tagOrURL == "tag"){
                    return "<img class='" + classes + "' alt='" + altText + "'src='" + imageLink + "'/>"; 
                } else {
                    return imageLink;
                }
            }
            
            if(tagOrURL == "tag"){
                return "<img class='" + classes + "' alt='" + altText + "'src='http://images.weserv.nl/?url=" 
                + imageLink.substring(8)
                + "&h=85&t=fit&q=" + yS.yS.prevImgQualMovies + "'/>"; 
            } else {
                return "http://images.weserv.nl/?url=" 
                + imageLink.substring(8)
                + "&h=85&t=fit&q=" + yS.yS.prevImgQualMovies;
            }
        }
        
        //if it is not one of above, it is a lokal image
        if(tagOrURL == "tag"){
            return "<img class='" + classes + "' alt='" + altText + "'src='http://" + $(location).attr('host') + "/image/" + encodeURIComponent(imageLink) + "'/>"; 
        } else {
            return "http://" + $(location).attr('host') + "/image/" + encodeURIComponent(imageLink);
        }
    },
	escapeHTML: function(string) {  
        var entityMap = {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': '&quot;',
              "'": '&#39;',
              "/": '&#x2F;'
        };
        
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
	} 
}

/*
 * manages everything in connection with Settings in localstorage
 */
var yS = {
    yS: {}, //the settings are stored in this object (function yS (yarc Settings) object yS (yarc Settings))	
	/*
	* prepares the settingspage 
	*/
	init: function(){      
		$("#language").val(yS.yS.language);
		$("#language").selectmenu("refresh");
	
		if(yS.yS.hidePrevPics){
			$('input[name=hidePrevPics]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hidePrevPics]').prop("checked", false).checkboxradio("refresh");
		}
		if(yS.yS.hideMenuText){
			$('input[name=hideMenuText]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideMenuText]').prop("checked", false).checkboxradio("refresh");
		}
		if(yS.yS.hideWatched){
			$('input[name=hideWatched]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideWatched]').prop("checked", false).checkboxradio("refresh");
		}
		
		$('#listLength').val(yS.yS.listLength);
		
		if(yS.yS.hideGenreMovies){
			$('input[name=hideGenreMovies]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideGenreMovies]').prop("checked", false).checkboxradio("refresh");
		}
		if(yS.yS.hideLanguageMovies){
			$('input[name=hideLanguageMovies]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideLanguageMovies]').prop("checked", false).checkboxradio("refresh");
		}
		if(yS.yS.hideSearchMovies){
			$('input[name=hideSearchMovies]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideSearchMovies]').prop("checked", false).checkboxradio("refresh");
		}
	
		if(yS.yS.noSwipe){
			$('input[name=noSwipe]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=noSwipe]').prop("checked", false).checkboxradio("refresh");
		}
	
		if(yS.yS.swapSwipeDirections){
			$('input[name=swapSwipeDirections]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=swapSwipeDirections]').prop("checked", false).checkboxradio("refresh");
		}
		
		if(yS.yS.hideFileLinkMovies){
			$('input[name=hideFileLinkMovies]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideFileLinkMovies]').prop("checked", false).checkboxradio("refresh");
		}
		
		$('#prevImgQualMovies').val(yS.yS.prevImgQualMovies);

		if(yS.yS.hideGenreMusic){
			$('input[name=hideGenreMusic]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideGenreMusic]').prop("checked", false).checkboxradio("refresh");
		}
		if(yS.yS.hideSearchMusic){
			$('input[name=hideSearchMusic]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideSearchMusic]').prop("checked", false).checkboxradio("refresh");
		}
		if(yS.yS.hideGenreAddons){
				$('input[name=hideGenreAddons]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideGenreAddons]').prop("checked", false).checkboxradio("refresh");
		}
		if(yS.yS.hideSearchAddons){
			$('input[name=hideSearchAddons]').prop("checked", true).checkboxradio("refresh");
		} else{
			$('input[name=hideSearchAddons]').prop("checked", false).checkboxradio("refresh");
		}
		
		$("#listLength").blur(function(e) {
			$("#listLength_label").css('color', 'white');
			$("#saveSettings").button('enable');
			var numericReg = /^\d*[0-9]?$/;
			if (!numericReg.test($('[name=listLength]').val())) {
				alert($.t("warning-full-number"));
				$("#saveSettings").button('disable');
				$("#listLength_label").css('color', 'red');
				return false;
			}
			if ($('[name=listLength]').val() == "") {
				alert($.t("warning-full-number"));
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
				alert($.t("warning-listlength"));
				$("#saveSettings").button('disable');
				$("#prevImgQualMovies_label").css('color', 'red');
				return false;
			}
			return false;
		});
	
		$("#saveSettings").click(function(e) {
			e.stopImmediatePropagation();
			yS.saveSettings();
		});		
	},
	/*
     * check if localstorage key set, if not, create initial setting
     */
	localStorageInit: function(){ 
      if (localStorage.getItem("yarcSettings") === null) {
         yS.yS = {};
      } else {
        //get settings from local storage and save it in Settings Object
        yS.yS = JSON.parse(localStorage.getItem('yarcSettings'));
      }
      
      //checks if startpage items are in settings and creates object if needed
      if (!(yS.yS.hasOwnProperty('startPageSettings'))) {
        yS.yS.startPageSettings = {};
        if (!(yS.yS.startPageSettings.hasOwnProperty('showRecentMovies'))) {
            yS.yS.startPageSettings.showRecentMovies = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showRecentSeries'))) {
            yS.yS.startPageSettings.showRecentSeries = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showRecentMusic'))) {
            yS.yS.startPageSettings.showRecentMusic = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showmostUsedAddons'))) {
            yS.yS.startPageSettings.showmostUsedAddons = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showmostUsedAddons'))) {
            yS.yS.startPageSettings.showmostUsedAddons = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('shutdownchoice'))) {
            yS.yS.startPageSettings.shutdownchoice = "Application.Quit";
        }
      }
      
      //checks if addons are in settings and creates object if needed
      if (!(yS.yS.hasOwnProperty('addons'))) {
        yS.yS.addons = {};
        yS.saveSettingsToLocalStorage();
      }
      
      if (!(yS.yS.hasOwnProperty('moviePageSettings'))) {
        yS.yS.moviePageSettings = {};
        if (!(yS.yS.moviePageSettings.hasOwnProperty('genreselect'))) {
            yS.yS.moviePageSettings.genreselect = "all";
        }
        if (!(yS.yS.moviePageSettings.hasOwnProperty('languageSelect'))) {
            yS.yS.moviePageSettings.languageSelect = "all";
        }
      }
      
      if (!(yS.yS.hasOwnProperty('musicPageSettings'))) {
        yS.yS.musicPageSettings = {};
        if (!(yS.yS.musicPageSettings.hasOwnProperty('genreselect'))) {
            yS.yS.musicPageSettings.genreselect = "all";
        }
      }
      
      if (!(yS.yS.hasOwnProperty('addonPageSettings'))) {
        yS.yS.addonPageSettings = {};
        if (!(yS.yS.addonPageSettings.hasOwnProperty('addonselect'))) {
            yS.yS.addonPageSettings.addonselect = "all";
        }
      }
      
      //check if all settings are set, if not, set with default value
      if (!(yS.yS.hasOwnProperty('language'))) {
          yS.yS.language = "en";
      }
      if (!(yS.yS.hasOwnProperty('hideMenuText'))) {
          yS.yS.hideMenuText = false;
      }
      if (!(yS.yS.hasOwnProperty('hidePrevPics'))) {
          yS.yS.hidePrevPics = false;
      }
      if (!(yS.yS.hasOwnProperty('hideWatched'))) {
          yS.yS.hideWatched = false;
      }
      if (!(yS.yS.hasOwnProperty('hideGenreMovies'))) {
          yS.yS.hideGenreMovies = false;
      }
      if (!(yS.yS.hasOwnProperty('hideLanguageMovies'))) {
          yS.yS.hideLanguageMovies = false;
      }
      if (!(yS.yS.hasOwnProperty('noSwipe'))) {
          yS.yS.noSwipe = false;
      }
      if (!(yS.yS.hasOwnProperty('swapSwipeDirections'))) {
          yS.yS.swapSwipeDirections = false;
      }
      if (!(yS.yS.hasOwnProperty('hideSearchMovies'))) {
          yS.yS.hideSearchMovies = false;
      }
      if (!(yS.yS.hasOwnProperty('hideFileLinkMovies'))) {
          yS.yS.hideFileLinkMovies = false;
      }
      if (!(yS.yS.hasOwnProperty('prevImgQualMovies'))) {
          yS.yS.prevImgQualMovies = 95;
      }
      if (!(yS.yS.hasOwnProperty('hideGenreMusic'))) {
          yS.yS.hideGenreMusic = false;
      }
      if (!(yS.yS.hasOwnProperty('hideSearchMusic'))) {
          yS.yS.hideSearchMusic = false;
      }
      if (!(yS.yS.hasOwnProperty('hideGenreAddons'))) {
          yS.yS.hideGenreAddons = false;
      }
      if (!(yS.yS.hasOwnProperty('hideSearchAddons'))) {
          yS.yS.hideSearchAddons = false;
      }
      if (!(yS.yS.hasOwnProperty('listLength'))) {
          yS.yS.listLength = 20;
      }
      
      //save settings again
      yS.saveSettingsToLocalStorage();
	},
	/*
     * write settings if settingpage gets closed
     */
	saveSettings: function(){
		$('#settings input[type=checkbox]').each(function () {
			if($(this).is(':checked')){
              yS.yS[$(this).val()] = true;
			} else {
              yS.yS[$(this).val()] = false;
			}
		});		
        yS.yS.language = $('[name=language]').val();
        if($('[name=listLength]').val() == 0){
          yS.yS.listLength = 9999999;
        } else {
          yS.yS.listLength = $('[name=listLength]').val();
        }
		yS.yS.prevImgQualMovies = $('[name=prevImgQualMovies]').val();
        
        yS.saveSettingsToLocalStorage();
        
        window.location.href = "index.html";
	},
	/*
     * does what it says
     */
	saveSettingsToLocalStorage: function(){
      localStorage.setItem('yarcSettings', JSON.stringify(yS.yS));      
	}
}

/*
 * manages everything which has to be run, eighter in general, or if page gets called 
 */


$(document).one('pagebeforecreate', function () {
    $("body>[data-role='panel']").panel().enhanceWithin();
});


$(document).delegate(document, 'pageshow', yCore.init);
$(document).delegate(document, 'pageshow', yRemote.init);

$(document).delegate('', 'pageshow', yStart.init);
$(document).delegate('#pl', 'pageshow', yPl.init);//playlist
$(document).delegate('#movies', 'pageshow', yMovies.init);
$(document).delegate('#series', 'pageshow', ySeries.init);
$(document).delegate('#music', 'pageshow', yMusic.init);
$(document).delegate('#music-songsearch', 'pageshow', ySongSearch.init);
$(document).delegate('#addons', 'pageshow', yAddons.init);
$(document).delegate('#addonDetails', 'pageshow', yAddons.init);
$(document).delegate('#settings', 'pageshow', yS.init);

$.mobile.navigate("#start"); 



		

