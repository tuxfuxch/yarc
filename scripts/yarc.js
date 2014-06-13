/*
 * Yarc - Yet another Remote Control (for XBMC)
 * Copyright (C) 2014 by Esra Kummer (esra@kummer.to)
 * Version 20140414
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */
var zeroInit = false;


var yCore = {
	activePlayer: -1,
	
	init: function(){
 					
		yS.getSettings();
	 
		document.title = yS.xbmcName;
		
    if(!zeroInit){setInterval(yCore.getActivePlayer, 1000);}
    if(!zeroInit){setInterval(yCore.getPlayerGetItem, 1000);}
   
	zeroInit = true; //that Intervals run only once, also after Pageswitch

    var keymap = {8: false, 13: false, 16: false, 37: false, 38: false, 39: false, 40: false, 67: false, 81: false, 87: false};
		//           (8)back	 (13)enter	(16)shift  (37)left		(38)up	   (39)right	(40)down   (67)c      (81)q      (87)w			
		
		
		$(document).unbind('keydown'); //unbind all keydowns first to prevent multiple bindings
		$(document).keydown(function(e) { 
			
			if (e.keyCode in keymap) { 
				
					if ($(e.target).is(":text") || $(e.target).is("#prevImgQualMovies") || $(e.target).is("#listLength")){ // stop using accesskeyr if typing in a input field
							return;
					}
				
					keymap[e.keyCode] = true;
					
					if (keymap[16] && keymap[37]) {
						yRemote.playergoto("previous");
						return false;
					}
					if (keymap[16] && keymap[38]) {
						yRemote.playerstop("Player.stop");
						return false;
					}
					if (keymap[16] && keymap[39]) {
						yRemote.playergoto("next");
						return false;
					}
					if (keymap[16] && keymap[40]) {
						yRemote.playpause("Player.PlayPause");
						return false;
					}
 					if (keymap[67]) {
 						yRemote.navcontrol("Input.ContextMenu");
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
						yRemote.navcontrol("Input.Back");
						return false;
					}
					if (keymap[13]) { 
						yRemote.navcontrol("Input.Select");
						return false;
					}
					if (keymap[37]) { 
						yRemote.navcontrol("Input.Left");
						return false;
					}
					if (keymap[38]) { 
						yRemote.navcontrol("Input.Up");
						return false;
					}
					if (keymap[39]) { 
						yRemote.navcontrol("Input.Right");
						return false;
					}
					if (keymap[40]) { 
						yRemote.navcontrol("Input.Down");
						return false;
					}
					//e.stop(); //neded that event does not get fired twice
			}
		}).keyup(function(e) {		
			if (e.keyCode in keymap) {
					keymap[e.keyCode] = false;
			}
		});
		
		$(document).focus(function(e) { 
			allowed = true;
		});
	},	/*   /init    */	
	getActivePlayer: function(){
		yCore.sendJsonRPC(
				'{ "jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1 }',
				function(resultGetActivePlayers){
					//"error" in resultGetItem
						if(resultGetActivePlayers["result"].length === 0){
								yCore.activePlayer = -1;
						} else {
								yCore.activePlayer = resultGetActivePlayers["result"]["0"]["playerid"];
						}
				}
		);
	},
	getPlayerGetItem: function(){
		yCore.sendJsonRPC( //need also when footer is invisible to get state of play/pause button
				'{"jsonrpc":"2.0","method":"Player.GetProperties", "params": { "playerid": '
					+ yCore.activePlayer + ', "properties": ["time", "totaltime", "shuffled", "speed"] }, "id": 1}',
				function(resultGetProperties){   // true if "error" doesn't exist in object
						if(!("error" in resultGetProperties)){
								$(".footerTime").html(yTools.addZeroTwoDigits(resultGetProperties["result"]["time"]["hours"]) 
										+ ":" + yTools.addZeroTwoDigits(resultGetProperties["result"]["time"]["minutes"]) 
										+ ":" + yTools.addZeroTwoDigits(resultGetProperties["result"]["time"]["seconds"])
										+ "<br>" + yTools.addZeroTwoDigits(resultGetProperties["result"]["totaltime"]["hours"])
										+ ":" + yTools.addZeroTwoDigits(resultGetProperties["result"]["totaltime"]["minutes"])
										+ ":" + yTools.addZeroTwoDigits(resultGetProperties["result"]["totaltime"]["seconds"])
								);
						} else { //if "error" exists set props that nothing is in it
										$(".footerImage").hide();
										$(".footerTitle").text("");
										$(".footerTime").text("");
						}
				}
		);
		if(yCore.activePlayer != -1 && yFooter.footerVisible){
				yCore.sendJsonRPC(
						'{ "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": '
								+ yCore.activePlayer + ', "properties": [ "title", "showtitle", "artist", "thumbnail" ] }, "id": 1 }',
						function(resultGetItem){
								if(!("error" in resultGetItem)){    // if "error" is not in return set info
										if(resultGetItem["result"]["item"]["title"] == ""){ //only set label if titel is not there and info in label
											var label = " " +resultGetItem["result"]["item"]["label"];
										} else { label = "";}
										label = label.replace(/\+/g, " "); //for teleboy Plugin: replace "+" with " "
										if (yCore.activePlayer == 1){ //Video Player
											$(".footerTitle").text(resultGetItem["result"]["item"]["title"] + label);
											$(".footerImage").attr("src", "http://" 
													+ decodeURIComponent(yTools.removeLastCharIf(resultGetItem['result']['item']['thumbnail'], "/")).substring(15) );
											$(".footerImage").show();
											$(".footerTitle").show();
										} else if (yCore.activePlayer == 0) { //Musik Player
											$(".footerImage").attr("src", "http://" + $(location).attr('host') + "/image/"+ encodeURIComponent(resultGetItem['result']['item']['thumbnail']) );
											$(".footerTitle").text(resultGetItem["result"]["item"]["title"]  + " (" +  resultGetItem["result"]["item"]["artist"] + ") "  + label);
											$(".footerImage").show();
											$(".footerTitle").show();
										} else {//other Player
											$(".footerTitle").text(resultGetItem["result"]["item"]["title"] + label);
											$(".footerImage").hide();
											$(".footerImage").show();
											$(".footerTitle").show();
										}
								} else { //if "error" exists set props that nothing is in it
										$(".footerImage").hide();
										$(".footerTitle").text("");
										$(".footerTime").text("");
								}
						}
				);
		}
	},
	sendJsonRPC: function(data, success){		
			jQuery.ajax({
				headers: { 
					'Accept': 'application/json',
					'Content-Type': 'application/json' 
				},
				type: "POST",
				'url': '/jsonrpc?SendRemoteKey',
				'data': data,
				'dataType': 'json',
				'success': success
			});	
	}
}

var yRemote = {
	youtubeNextPageToken: "",
	init: function() {
		yS.getSettings();
		
			
		/*-------------Index Page - Media Control Buttons-------------------------*/
		
		$("#playerstop").click(function(e) { //class which calls function on click
			e.stopImmediatePropagation();				 //needed that it binds only once
			yRemote.playerstop($(this).attr('name'));
		});
		
		
		$(".playerSetSpeed").click(function(e) { 
				e.stopImmediatePropagation();	
				yRemote.setSpeed($(this).attr('name'));
		});

		$("#playpause").click(function(e) {  
			e.stopImmediatePropagation();
			yRemote.playpause($(this).attr('name'));
		});
		    

		$(".playergoto").click(function(e) { 
			e.stopImmediatePropagation();
			yRemote.playergoto($(this).attr('name'));
		});
		
		/*-------------Index Page - Navigation Controll Buttons-------------------------*/

		$(".navcontrol").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.navcontrol($(this).attr('name'));
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
			yRemote.setVolume($(this).attr('name'));
		});

		/*-----------------------------------------------------------------------------------
		* ---------------------------- Tools -----------------------------------------------
		* ----------------------------------------------------------------------------------*/
		
		
		

		/*-------------Index Page - Input - Send URL and open youtube video -------------------------*/
		$("#searchYoutubeButton").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.searchYoutube($('#SendTextField').val());
		});
		$("#youTubeNext").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.searchYoutube($('#SendTextField').val());
		});
		
		$('#detailspopupYoutube').bind({ //removes next Page Token
			popupafterclose: function(event, ui) {
				yRemote.youtubeNextPageToken	= "";
			}
		});
		
		$("body").delegate(".playYoutubeVideo", "click", function(e){ 
			e.stopImmediatePropagation();
			yRemote.playYoutube($(this).attr('name'));
		});
		
		/*-------------Index Page - cleanAndUpdate  Clean and Update Audio and Video Library  -------------------------*/
		$(".cleanAndUpdate").click(function(e) {
			e.stopImmediatePropagation();
			yRemote.cleanAndUpdate($(this).attr('name'));
		});

		/*-------------Index Page - Shutdown Buttons-------------------------*/

		$("#quit").click(function(e) {
			e.stopImmediatePropagation();
				$('#detailspopupRemote').popup('open');
		});
		
		$("#popupCancel").click(function(e) {
				e.stopImmediatePropagation();
				$('#detailspopupRemote').popup("close");
		});
		
		$(".popupSHRS").click(function(e) { //SHRS: Suspend, Hibernate, Reboot, Shutdown
				e.stopImmediatePropagation();
				yRemote.suspendHibernateRestartShutdwon($(this).attr("name"));
		});
		
		$("#openSettings").click(function(e) {
				window.location.href = "#settings";
		});
		
	},/*   / init   */
	
	playerstop: function(actionname) {	
		yCore.sendJsonRPC(
				'{"jsonrpc": "2.0", "method": "' + actionname + '", "params": { "playerid": ' + yCore.activePlayer + ' }, "id": 1}',
				' '
		);
	},
	playergoto: function(actionname) {
		yCore.sendJsonRPC(
				'{"jsonrpc": "2.0", "method": "Player.GoTo", "params": { "playerid": ' + yCore.activePlayer + ', "to": "'+actionname+'"}, "id": 1}',
				' '
		);
	},
	setSpeed: function(direction) {
		yCore.sendJsonRPC(
				'{"jsonrpc": "2.0", "method": "Player.SetSpeed", "params": { "playerid": ' + yCore.activePlayer + ', "speed": "' + direction  +'" }, "id": 1}',
				' '
		);
	}, 
	playpause: function(actionname) {
		yCore.sendJsonRPC(
				'{"jsonrpc": "2.0", "method": "' + actionname + '", "params": { "playerid": ' + yCore.activePlayer + ' }, "id": 1}',
				' '
		);
	},
	navcontrol: function(actionname) {
		yCore.sendJsonRPC(
				'{"jsonrpc": "2.0", "method": "' + actionname + '"}',
				' '
		);
	},
	sendTextButton: function(sendText) {
		yCore.sendJsonRPC(
				'{"jsonrpc": "2.0", "method": "Input.SendText", "params": { "text": "' + sendText + '" }, "id": 1}',
				' '
		);
	},	
	playYoutube: function(youtubeVideoId) {
			
			if(youtubeVideoId.indexOf("playlist_") != -1){//if playlist
				
 				yCore.sendJsonRPC( //empty playlist prior to use
 						'{"jsonrpc": "2.0", "id": 0, "method": "Playlist.Clear", "params": {"playlistid": 0}}',
 						''
 				);
 				
				youtubeVideoId = youtubeVideoId.substring(9); //cut off the "playlist_" part in attr. name
				
				 var request = gapi.client.youtube.playlistItems.list({
									playlistId: youtubeVideoId,
									part: 'snippet',
									maxResults: 50
							});
				 
				 
				 function showResponse(response) {
						for (var i = 0; i < response["result"]["pageInfo"]["resultsPerPage"]; i++) { 
								yCore.sendJsonRPC(
										'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 0 , "item" : {"file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' 
											+ response["result"]["items"][i]["snippet"]["resourceId"]["videoId"] + '" } }, "id": 1}',
										''
								);
								
						}	
				 }
				 // Called automatically with the response of the YouTube API request.
					function onSearchResponse(response) {
							showResponse(response);
					}
 
					request.execute(onSearchResponse);
					
					//waiting timer so that yarc has plenty time to add youtube-items to xbmc-playlist
					window.setTimeout(function(){yCore.sendJsonRPC('{ "jsonrpc": "2.0", "method": "Player.Open", "params": {"item":{"playlistid":0},"options":{"repeat":"all"}}, "id": 1 }','');}, 4000);
 					
			} else {//if video item
					yCore.sendJsonRPC(
							'{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item": {"file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' 
								+ youtubeVideoId + '" }}, "id" : "1"}',
							' '
					);
			}
	},
	searchYoutube: function(searchString) {
					
					$('#youtubelist').empty(); //empty ul to update list with new choices
					gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
					
					function showResponse(response) {
							for (var i=0; i < 5; i++){
									yRemote.youtubeNextPageToken = response["result"]["nextPageToken"];
									if(response["result"]["items"][i]["id"]["kind"] == "youtube#playlist"){
											$("#youtubelist").append(
												"<li class='playYoutubeVideo youtubeListItem' name='playlist_" + response["result"]["items"][i]["id"]["playlistId"] + "'> "
														+ "<span class='youTubeImage-box'>"
															+ "<img class='youtubeImage' alt='[Youtube preview Image]' src='"	
															+ response["result"]["items"][i]["snippet"]["thumbnails"]["default"]["url"] + "'>" 
															+ "<span class='youtubeTitle'><b><i>[PL]</i></b> " + response["result"]["items"][i]["snippet"]["title"] + "</span>"
														+ "</span>"
												+ "</li>"
											);
									} else {
											$("#youtubelist").append(
												"<li class='playYoutubeVideo youtubeListItem' name='" + response["result"]["items"][i]["id"]["videoId"] + "'> "
														+ "<span class='youTubeImage-box'>"
															+ "<img class='youtubeImage' alt='[Youtube preview Image]' src='"	
															+ response["result"]["items"][i]["snippet"]["thumbnails"]["default"]["url"] + "'>" 
															+ "<span class='youtubeTitle'>" + response["result"]["items"][i]["snippet"]["title"] + "</span>"
														+ "</span>"
												+ "</li>"
											);
									}
							}
					}					
					
					// Called automatically when YouTube API interface is loaded.
					function onYouTubeApiLoad() {
							// This API key is intended for use only in this lesson.
							// See http://goo.gl/PdPA1 to get a key for your own applications.
							gapi.client.setApiKey('AIzaSyC9WNILybxNXyipW4Kp_yLWXUNgkc__O1s');

							search();
					}

					function search() {
							// Use the JavaScript client library to create a search.list() API call.
							var request = gapi.client.youtube.search.list({
									part: 'snippet',
									pageToken: yRemote.youtubeNextPageToken,
									q: searchString
							});
							
							// Send the request to the API server,
							// and invoke onSearchRepsonse() with the response.
							request.execute(onSearchResponse);
					}

					// Called automatically with the response of the YouTube API request.
					function onSearchResponse(response) {
							showResponse(response);
					}
		
			
			$('#detailspopupYoutube').popup('open');
	},	
	setVolume: function(actionname) {
			if(actionname=="Application.SetMute"){
				yCore.sendJsonRPC(
						'{"jsonrpc": "2.0", "method": "Application.SetMute", "params": {"mute":"toggle"}, "id": 1}',
						function(resultSetMute){
							if(resultSetMute["result"] == true){
									document.getElementById('SetMute').innerHTML = "<s>((∙))</s>";
							} else {
									document.getElementById('SetMute').innerHTML = "((∙))";
									
							}
							$('#SetMute').button("refresh");
						}
				);
			} else {
				var Volume = -1;
				yCore.sendJsonRPC(
						'{"jsonrpc":"2.0","method":"Application.GetProperties","params":{"properties":["volume"]},"id":"1"}',
						function(resultGetVolume){
										Volume = resultGetVolume["result"]["volume"];	
										
										if(actionname=="Volume.Plus"){
											Volume += 10;
										} else if (actionname=="Volume.Minus"){
											Volume -= 10;
										} 
										yCore.sendJsonRPC(
											'{"jsonrpc": "2.0", "method": "Application.SetVolume", "params": { "volume": ' + Volume + ' }, "id": 1}',
											' '
										);
						}
				);
			}
	},	
	toggleFullscreen: function(){
		yCore.sendJsonRPC(
				'{"jsonrpc": "2.0", "method": "GUI.SetFullscreen", "params": { "fullscreen": "toggle" }, "id": 1}',
				' '
		);
	},
	cleanAndUpdate: function(actionname) {
		yCore.sendJsonRPC(
				'{"jsonrpc":"2.0","method":"' + actionname + '","id":1}',
				' '
		);
	},	
	suspendHibernateRestartShutdwon: function(actionname) {	
		yCore.sendJsonRPC(
				'{"jsonrpc": "2.0", "method": "' + actionname + '"}',
				' '
		);
	}
}

var yFooter = {
	footerVisible: false,
	init: function() {	
		
			yS.getSettings();
		
			if (!yFooter.footerVisible){
				$(".footerImage").hide();
				$(".footerTitle").hide();
				$(".footerTime").hide();
			}
		
		$(".footer-left").click(function(e) {
			
			e.stopImmediatePropagation();
			if (!yFooter.footerVisible){
				yFooter.footerVisible = true;
				$(".footer-left").text('<−−');
				$(".footer").css( "width", "100%" );				
				if(yCore.activePlayer != -1)$(".footerImage").show();
				$(".footerTime").show();
				if(yCore.activePlayer != -1)$(".footerTitle").show();
			} else {
				yFooter.footerVisible = false;
				$(".footer-left").text('−−>');
				$(".footer").css( "width", "0px" );
				$(".footerImage").hide();
				$(".footerTitle").hide();
				$(".footerTime").hide();
			}
		});
	}
}

var yMovies = {
	moviesJSON: "",
	genres: [],
	genreString: "",
	languages: [],
	documentReadyAlreadyRun: false,
	listPos: 0,
	listLength: 0,
	init: function() {
		
		yS.getSettings();
		
		if(yS.hideSearchMovies){$("#searchMovies").parent().hide();} //hide movieSearch field if set in settings
		if(yS.hideLanguageMovies){$("#languageSelect").parent().hide();} //hide language selection field if set in settings
		if(yS.hideGenreMovies){$("#genreSelect").parent().hide();} //hide  genre selection  field if set in settings
		 		
		
		if (!yMovies.documentReadyAlreadyRun){  //that it doesn't run twice
			yMovies.documentReadyAlreadyRun = 1;
			yMovies.getMovies();
		}
		$("body").delegate(".openMovieItem", "click", function(e){  //set movie information in popup
				e.stopImmediatePropagation();	
				yMovies.openMovieItem($(this).attr('name'));	
		});

		$('#detailspopupMovies').bind({  // if popup is closed, remove picture path
			popupafterclose: function(event, ui) {
					$("#popupImageMovies").attr("src","");
			}
		});

		$("body").delegate("#popupPlay", "click", function(e){ //start movie
			e.stopImmediatePropagation();
			yMovies.popupPlay($(this).attr('name'));
		});

		$("body").delegate("#popupTrailer", "click", function(e){ //start movie
			e.stopImmediatePropagation();
			yMovies.popupTrailer($(this).attr('name'));
		});
		
		$("#searchMovies").keyup(function() {
				$('#movie_list').empty(); //empty ul to update list with new choices
				yMovies.createMovieList(0, $('#genreSelect option:selected').attr('value'),$('#languageSelect option:selected').attr('value'), $("#searchMovies").attr('value')); 
		});
		
		$("body").delegate("#movieListPrev", "click", function(e){  //checkbox select/unselect reverser
				yMovies.listPos -= yS.listLength;
				$("#movie_list").empty();
				yMovies.createMovieList(yMovies.listPos, $('#genreSelect option:selected').attr('value'),$('#languageSelect option:selected').attr('value'), $("#searchMovies").attr('value')); 
				window.location.href = "index.html#movies"; //go to top
		});

		$("body").delegate("#movieListNext", "click", function(e){  //checkbox select/unselect reverser
				yMovies.listPos += yS.listLength;
				$("#movie_list").empty();
				yMovies.createMovieList(yMovies.listPos, $('#genreSelect option:selected').attr('value'),$('#languageSelect option:selected').attr('value'), $("#searchMovies").attr('value'));
				window.location.href = "index.html#movies"; //go to top
		});
	},
	getMovies: function(){
		yCore.sendJsonRPC(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "limits": { "start": 0 }, "properties": [ "plot", "trailer", "title", "runtime", "year", 				"genre", "rating", "thumbnail", "file", "playcount", "streamdetails"], "sort": { "method": "sorttitle", "ignorearticle": true }}, "id": 1}',				
				function(result){
						yMovies.moviesJSON = result; //write result in Array for further use 
						yMovies.createMovieList(0, "all", "all",$("#searchMovies").attr('value'));

						$('#genreSelect').change(function() {  //create Action Listener for list with selection choice
							$('#movie_list').empty(); //empty ul to update list with new choices
							yMovies.createMovieList(0, $(this).val(), $('#languageSelect option:selected').attr('value'),$("#searchMovies").attr('value')); //create movieslist accouding to options
						});

						$('#languageSelect').change(function() {  //create Action Listener for list with selection choice
							$('#movie_list').empty(); //empty ul to update list with new choices
							yMovies.createMovieList(0, $('#genreSelect option:selected').attr('value'),$(this).val(), $("#searchMovies").attr('value')); //create movieslist according to options
						});
				}
		);
	},
	openMovieItem: function(movieNr) {
		
				yMovies.genresToString(movieNr);
				
				var md_year = yMovies.moviesJSON["result"]["movies"][movieNr]["year"];
				if(md_year > 0){md_year = " (" + md_year + ")";}else{md_year="";}
				
				var md_runtime = yMovies.moviesJSON["result"]["movies"][movieNr]["runtime"];
				if (md_runtime > 0){md_runtime += "min.";}else{ md_runtime = "unknown";}
				
				$("#popupImageMovies").attr("src","http://images.weserv.nl/?url=" + decodeURIComponent(yMovies.moviesJSON["result"]["movies"][movieNr]["thumbnail"]).substring(15) + "&h=200");
				
				if(yMovies.moviesJSON["result"]["movies"][movieNr]["playcount"]>0){
					$("#popupGreenTick").attr("src","images/Green_Tick" + yS.imageFormat);
					$("#popupGreenTick").show();
				}
				else {
					$("#popupGreenTick").hide();
				}
				
				$("#popupTitleMovies").text(yMovies.moviesJSON["result"]["movies"][movieNr]["title"] + md_year);	
				document.getElementById('popupRating').innerHTML = ("Rating: "  + yTools.ratingToStars(~~yMovies.moviesJSON["result"]["movies"][movieNr]["rating"]) + " (" + Math.round(yMovies.moviesJSON["result"]["movies"][movieNr]["rating"] * 100 ) / 100 + ")");
				$("div#popupRuntimeMovies").text("Runtime: " + md_runtime);	
				$("div#popupGenreMovies").text("Genres: " + yMovies.genreString);
				$("div#popupPlotMovies").text(yMovies.moviesJSON["result"]["movies"][movieNr]["plot"]);
				if(!yS.hideLanguageMovies){
					document.getElementById('popupLanguagesFlags').innerHTML = yMovies.pathToFlags(yMovies.moviesJSON["result"]["movies"][movieNr]["file"]);
				}
				$("#popupPlayMovies").attr("name", movieNr);
				$("#popupTrailerMovies").attr("name", movieNr);
				if(!yS.hideFileLinkMovies){$("div#popupFilelink").text("Filelink: " + yMovies.moviesJSON["result"]["movies"][movieNr]["file"]);}
				$('#detailspopupMovies').popup('open');	
	},	
	createMovieList: function(listStart, genre, lang, searchval) {  //create movielist in DOM
		var selectedGenre = genre;
		var selectedLang = lang;
		var movieGenreInItem;
		var langToCode= new Array();; //needed for language to languagecode translation
		var tempGenreLenth = yMovies.genres.length; //save length to check later if it is the first time to be updated
		
		itemsInList = 0; //needed to find out, how many items are shown, so that if list is restricted we know if next button has to be shown
		
		yMovies.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button
		
		
		//check if there is anything in the lib. eigther show info or hide loading bar
		if(yMovies.moviesJSON["result"]["limits"]["total"] == 0)
		{
				$("#movie_list").append("<li><h3>No Movies in the library</h3></li>").trigger( "create" );
				$(".loading").hide();
				
		} else {
		
				if(yS.listLength > yMovies.moviesJSON["result"]["limits"]["end"]){
						yMovies.listLength = yMovies.moviesJSON["result"]["limits"]["end"];
				} else{
						yMovies.listLength = yS.listLength;
				}
				
				if(yMovies.listPos != 0){		
						$("#movie_list").append(
								"<a id='movieListPrev' name='movieListPrev'>"
										+"<li class='moviedetails'>"
											+" <div class='movieItem'>" 
												+ "<div class='movieItemLeft'>"
														+ "<img class='moviePrevPic' alt='Previous items in list button' src='images/listPrev" + yS.imageFormat + "' />" 
												+ "</div>" 
												+ "<div class='movieItemRight'>"
														+ "<h4>Previous</h4>"
														+" <p></p>"
												+ "</div>" 
											+ "</div>"
										+"</li>"
								+"</a>" 
						);	
				}
				
				
				for (var i = 0; i < (yMovies.moviesJSON["result"]["limits"]["end"]); i++) { //all movies
					langToCode = [];
					movieGenreInItem = -1;
					var m_filePath = yMovies.moviesJSON["result"]["movies"][i]["file"];
					
					for (var j=0; j < yMovies.moviesJSON["result"]["movies"][i]["genre"].length; j++){ //all genres in movie
						if (!(jQuery.inArray(yMovies.moviesJSON["result"]["movies"][i]["genre"][j], yMovies.genres) > -1)){ //push if already not theredetail
							yMovies.genres.push(yMovies.moviesJSON["result"]["movies"][i]["genre"][j]);	
						} 
						if (selectedGenre == yMovies.moviesJSON["result"]["movies"][i]["genre"][j]){ //if movie is as the selected genre remember it.
							movieGenreInItem = 1;	 
						}
					}
					for (var cc=0; cc < countrycodes.length; cc++){ //searches given language in array and writes according langCode in langToCode
							if (countrycodes[cc].language == selectedLang){
									for (var cInCC=0; cInCC < countrycodes[cc].codes.length; cInCC++){
											langToCode[cInCC] = countrycodes[cc].codes[cInCC].code;
									}
							}
					}		
					
					
					if(selectedGenre == "all" || movieGenreInItem == 1){ //runs per movie if in genre selcet all or a matching genre is selected
						if(selectedLang == "all"){ //runs per movie if in language selcet all or a matching language is selected
							
							//first check if searchfield Value is undefinde (no input yet) and then if the title is matching (in lowercase)
							if(searchval === undefined || yMovies.moviesJSON["result"]["movies"][i]["title"].toLowerCase().indexOf(searchval.toLowerCase()) != -1){
								var m_runtime = yMovies.moviesJSON["result"]["movies"][i]["runtime"];
								if (m_runtime > 0){m_runtime += "min.";}else{ m_runtime = "unknown";} //makes runtime string if aviable
								
								var m_year = yMovies.moviesJSON["result"]["movies"][i]["year"];
								if (m_year < 1){m_year = "unknown";} //makes year string if unaviable
								
								if(yMovies.moviesJSON["result"]["movies"][i]["playcount"]>0){
									if(yS.hideWatched){continue;}//if setting says to not show seen movies, go to next iteration
									var isSeen = "<img class='greenMovies' alt='Movie is seen' src='images/Green_Tick" + yS.imageFormat +"' />";
								}
								else {var isSeen = "";} //add img tag if movie is registered as min. seen once
													
								$("#movie_list").append(
									"<a class='openMovieItem' name='" + i + "'>"
											+ "<li class='moviedetails'>"
													+ "<div class='movieItem' name='" + i + "'>"
															+ "<div class='movieItemLeft'>"
																	+ "<img class='moviePrevPic' alt='Movie preview image' src='http://images.weserv.nl/?url=" 
																	+ decodeURIComponent(yMovies.moviesJSON["result"]["movies"][i]["thumbnail"]).substring(15) 
																	+ "&h=80&w=50&t=absolute&q=" + yS.prevImgQualMovies + "' />"
																	+ isSeen 
															+ "</div>" 
															+ "<div class='movieItemRight'>"
																	+ "<h4>" + yMovies.moviesJSON["result"]["movies"][i]["title"] + "</h4>"
																	+ "<p>Year: " + m_year + " Runtime: " + m_runtime + "</p>"
																	+ "<p>" + "Rating: " + yTools.ratingToStars(~~yMovies.moviesJSON["result"]["movies"][i]["rating"]) + "</p>"
																	+ "<p>" + yMovies.pathToFlags(m_filePath)	+ "</p>"
															+ "</div>" 
													+ "</div>"
											+ "</li>"
									+"</a>"
								);
								itemsInList++; 
							}
							//movieGenreInItem = 0; //set Movie in Genre again to 0 for next run
						} else {
								for (var lcifp=0; lcifp < langToCode.length; lcifp++){		
										if(m_filePath.indexOf(langToCode[lcifp]) > 0){
														//first check if searchfield Value is undefinde (no input yet) and then if the title is matching (in lowercase)
													if(searchval === undefined || yMovies.moviesJSON["result"]["movies"][i]["title"].toLowerCase().indexOf(searchval.toLowerCase()) != -1){
														var m_runtime = yMovies.moviesJSON["result"]["movies"][i]["runtime"];
														if (m_runtime > 0){m_runtime += "min.";}else{ m_runtime = "unknown";} //makes runtime string if aviable
														
														var m_year = yMovies.moviesJSON["result"]["movies"][i]["year"];
														if (m_year < 1){m_year = "unknown";} //makes year string if unaviable
														
														if(yMovies.moviesJSON["result"]["movies"][i]["playcount"]>0){
															if(yS.hideWatched){continue;}//if setting says to not show seen movies, go to next iteration
															var isSeen = "<img class='greenMovies' alt='movie is marked as seen' src='images/Green_Tick" + yS.imageFormat +"' />";
														}
														else {var isSeen = "";} //add img tag if movie is registered as min. seen once
																			
														$("#movie_list").append(
															"<a class='openMovieItem' name='" + i + "'>"
																	+ "<li class='moviedetails'>"
																			+ "<div class='movieItem' name='" + i + "'>"
																					+ "<div class='movieItemLeft'>"
																							+ "<img class='moviePrevPic' alt='movie preview image' src='http://images.weserv.nl/?url=" 
																							+ decodeURIComponent(yMovies.moviesJSON["result"]["movies"][i]["thumbnail"]).substring(15) 
																							+ "&h=80&w=50&t=absolute&q=" + yS.prevImgQualMovies + "' />"
																							+ isSeen 
																					+ "</div>" 
																					+ "<div class='movieItemRight'>"
																							+ "<h4>" + yMovies.moviesJSON["result"]["movies"][i]["title"] + "</h4>"
																							+ "<p>Year: " + m_year + " Runtime: " + m_runtime + "</p>"
																							+ "<p>" + "Rating: " + yTools.ratingToStars(~~yMovies.moviesJSON["result"]["movies"][i]["rating"]) + "</p>"
																							+ "<p>" + yMovies.pathToFlags(m_filePath)	+ "</p>"
																					+ "</div>" 
																			+ "</div>"
																	+ "</li>"
															+"</a>"
														);
														itemsInList++; 
												}
												movieGenreInItem = 0; //set Movie in Genre again to 0 for next run
											
										}
								}
						}
					}	
					
					if(yS.hidePrevPics){$(".moviePrevPic").hide();} //hide previmage if set in settings
					if(yS.hidePrevPics){$(".greenMovies").hide();}  //hide green arrow if set in settings
				}
				
				
				//only show if not at the end of the list, or no more items in the list to show
				if((yMovies.listPos + yMovies.listLength) < yMovies.moviesJSON["result"]["limits"]["end"] && (yMovies.listPos + yMovies.listLength) < itemsInList){	
						$("#movie_list").append(
								"<a id='movieListNext' name='movieListNext'>"
										+"<li class='moviedetails'>"
											+" <div class='movieItem' >" 
												+ "<div class='movieItemLeft'>"
														+ "<img class='moviePrevPic' alt='Next items in list button' src='images/listNext" + yS.imageFormat + "' />"  
												+ "</div>" 
												+ "<div class='movieItemRight'>"
														+ "<h4>Next</h4>"
														+" <p></p>"
												+ "</div>" 
											+ "</div>"
										+"</li>"
								+"</a>" 
						);
				}
			

				$(".loading").hide();
				
				if(tempGenreLenth <= 0){ //only populate if it is the first time
					yMovies.genres.sort()
					for (var i=0; i < yMovies.genres.length; i++){  //add genre Options to selection
						$('#genreSelect').append("<option value='" + yMovies.genres[i] + "'>" + yMovies.genres[i] + "</option>");
					}
				}
				
				
				$(".openMovieItem").hide(); //first hide all to prepare negative of slice
				$(".openMovieItem").slice(yMovies.listPos, (yMovies.listPos + yMovies.listLength)).show();
			}//end else of check if there is something in the library
	},
	genresToString: function(movieNr){
			yMovies.genreString = ""; //empty, to remove previous content, to avoid wrong or multiple informations
			for (var j=0; j < yMovies.moviesJSON["result"]["movies"][movieNr]["genre"].length; j++){ //all genres in movie
					yMovies.genreString += yMovies.moviesJSON["result"]["movies"][movieNr]["genre"][j];
					if (j !=  (yMovies.moviesJSON["result"]["movies"][movieNr]["genre"].length -1)) { yMovies.genreString += ", "; }
			}
			if (yMovies.genreString==""){yMovies.genreString+="unknown"};			
	},	
	popupPlay: function(movieNr){
			$('#popupPlay').text('Please wait...').button("refresh"); // change button text because of long JSON Call time
			yCore.sendJsonRPC(
					'{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' 
							+ yMovies.moviesJSON["result"]["movies"][movieNr]["file"] + '" } }, "id": 1 }',
					function(){ window.location.href = "index.html";}
			);
	},	
	popupTrailer: function(movieNr){
			$('#popupTrailer').text('Please wait...').button("refresh"); // change button text because of long JSON Call time
			yCore.sendJsonRPC(
					'{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' 
							+ yMovies.moviesJSON["result"]["movies"][movieNr]["trailer"] + '" } }, "id": 1 }',
					function(){$('#popupTrailer').text('Trailer').button("refresh");}
			);
	},	
	pathToFlags: function(filePath){  //create image tags for languages and add language option to selection
		var returnstring = "";
		
		if(yS.hideLanguageMovies){return returnstring;}
		for (var i=0; i < countrycodes.length; i++){
				for (var j=0; j < countrycodes[i].codes.length; j++){
						if (filePath.indexOf(countrycodes[i].codes[j].code) > 0) {
								returnstring += "<img class='pathToFlags' alt='flag of" + countrycodes[i].language + "' src='images/flags/" 
								+ countrycodes[i].flagpath + yS.imageFormat +"' />&nbsp;";
								if ( $("#languageSelect option[value=" + countrycodes[i].language + "]").length == 0 ){
										$('#languageSelect').append("<option value='"	+ countrycodes[i].language + "'>" + countrycodes[i].language + "</option>");
								}
						}
			}
		}
		
		if (returnstring == "") {returnstring += "language(s) unknown";}
		return returnstring;
	}
}

var ySeries = {
	TVShowID: "",
	already_run: false, 
	init: function() {
		
		yS.getSettings();
		
		if (!ySeries.already_run){  //that it doesn't run twice
		ySeries.already_run = true; 
		jQuery.ajax({ //gets series and puts them as a collapsible in DOM
			async: false,
			headers: { 
				'Accept': 'application/json',
				'Content-Type': 'application/json' 
			},
			type: "POST",
			'url': '/jsonrpc?SendRemoteKey',
			'data': '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { "properties": ["art", "title",  "thumbnail"]}, "id": 1}',
			'dataType': 'json',
			'success': function(resultGetTVShows){
										//check if there is anything in the lib. eigther show info or hide loading bar
										if(resultGetTVShows["result"]["limits"]["total"] == 0)
										{
												$("#series_list").append("<li><h3>No shows in the library</h3></li>").trigger( "create" );
												$(".loading").hide();
										} else {
												
												for (var i = 0; i < resultGetTVShows["result"]["limits"]["end"]; i++) {
													var TVShowID = resultGetTVShows["result"]["tvshows"][i]["tvshowid"];
													var TVShowName = resultGetTVShows["result"]["tvshows"][i]["title"];
														$("#series_list").append(
																"<li>"
																		+ "<div data-role='collapsible' class='openSeries' name='" + TVShowID + "' >"
																				+ "<h3>"
																						+"<img class='seriesThumb' alt='" + TVShowName 
																								+ "' src='" + decodeURIComponent(resultGetTVShows["result"]["tvshows"][i]["art"]["banner"]).substring(8).slice(0, -1) 
																								+ "'/>"
																				+ "</h3>"
																		+ "</div>"
																		+ "<div id='"	+ TVShowID	+ "'></div>"
																+ "</li>"
														).trigger( "create" );
												}
												$(".loading").hide();
										}
								}   
			});
		}
		
		$("body").delegate(".showEpidodeDetails", "click", function(e){ //opens and fills popup with episode details
			e.stopImmediatePropagation();	
			ySeries.showEpidodeDetails($(this).attr('name'));				
		});
		
		$('#detailspopupSeries').bind({ //removes imgae of episode details popup
			popupafterclose: function(event, ui) {
					$("#popupImageSeries").attr("src","");
			}
		});
		
		
		$("body").delegate("#popupPlaySeries", "click", function(e){ // starts episode 
			e.stopImmediatePropagation();
			ySeries.popupPlaySeries($(this).attr('name'));	
		});
		
		$('.openSeries').bind('collapse',function(e){ //removes episodes from DOM if series is closed
			var TvShowId = $(this).attr('name')
			var node = document.getElementById(TvShowId);
			if ( node.hasChildNodes() ){
				while ( node.childNodes.length >= 1 ){
					node.removeChild( node.firstChild );       
				} 
			}	

		});
			
			
		$('.openSeries').bind('expand',function(e){ //gets seasons of series and puts them in a list and add's it to DOM
				e.stopImmediatePropagation();	
				ySeries.openSeries($(this).attr('name'));
		});
	},
	openSeries: function(TvShowId){
			var TVShowSeasonID = ""; 
								
			yCore.sendJsonRPC(
					'{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": {"properties": ["season", "showtitle"], "tvshowid":' 
											+ TvShowId + '}, "id": 1}',
					function(resultGetSeasons){												
							for (var j = 0; j < resultGetSeasons["result"]["limits"]["end"]; j++) {
									var TVShowSeasonID = resultGetSeasons["result"]["seasons"][j]["season"]; //  warum auch immer, damit richtige staffel im richten collapsible
									$("#"+TvShowId).append(
											"<div data-role='collapsible' class='openSeason' name='" + TVShowSeasonID + "'>"
													+ "<h3>" + resultGetSeasons["result"]["seasons"][j]["label"]+ "</h3>"
													+ "<div id='"+TvShowId+"-"+TVShowSeasonID+"''></div>"
											+ "</div>"
									).trigger( "create" );
							}
								
							$('.openSeason').bind('expand',function(e){ //gets episodes of season and adds them to DOM
									e.stopImmediatePropagation();
									var TVShowSeasonID = $(this).attr('name');
									var node = document.getElementById(TvShowId+"-"+TVShowSeasonID);
									if ( node.hasChildNodes() ){
										while ( node.childNodes.length >= 1 ){
											node.removeChild( node.firstChild );       
										} 
									}
									yCore.sendJsonRPC(
											'{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "properties": ["season","episode", "showtitle", "plot", 							"thumbnail", "file", "rating", "playcount", "streamdetails"],"tvshowid":' + TvShowId + ',"season" : ' + TVShowSeasonID + ' }, "id": 1}',
											function(resultGetEpisodes){
														for (var k = 0; k < resultGetEpisodes["result"]["limits"]["end"]; k++) {
															var episodeID = resultGetEpisodes["result"]["episodes"][k]["episodeid"];
																
															if(resultGetEpisodes["result"]["episodes"][k]["playcount"]>0){	
																	if(yS.hideWatched){continue;}//if setting says to not show seen episodes, go to next iteration
																	var isSeen = "<img class='green' alt='media is seen' src='images/Green_Tick" + yS.imageFormat +"' />";
															}
															else {var isSeen = "<img class='green' src='images/blank.gif' />";}//&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															$("#"+TvShowId+"-"+TVShowSeasonID).append(
																"<div><a class='showEpidodeDetails' name='"+ episodeID + "'>"
																		+ "<li class='series-item'> "
																				+ isSeen 
																				+ "<span><h4>" + resultGetEpisodes["result"]["episodes"][k]["label"] + "</h4></span>"
																		+ "</li>"
																+ "</a></div>"
															);
														}	
											}
									);
							});
					}
			);
	},	
	showEpidodeDetails: function(episodeID){
			yCore.sendJsonRPC(
					'{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodeDetails", "params": { "properties": ["season","episode", "showtitle", "plot", "fanart", "thumbnail", 				"file", "rating", "playcount"],"episodeid":' + episodeID + '}, "id": 1}',
					function(resultGetEpisodeDetails){
							$("#popupImageSeries").attr(
								"src","http://images.weserv.nl/?url=" 
								+ decodeURIComponent(resultGetEpisodeDetails["result"]["episodedetails"]["thumbnail"]).substring(15).slice(0, -1) 
								+ "&h=150&q=95");
							$("#popupTitleSeries").text(resultGetEpisodeDetails["result"]["episodedetails"]["showtitle"] + " - " + resultGetEpisodeDetails["result"]["episodedetails"]["label"]+" - Season "+ resultGetEpisodeDetails["result"]["episodedetails"]["season"] + " Episode " + resultGetEpisodeDetails["result"]["episodedetails"]["episode"]);	
							document.getElementById('popupRatingSeries').innerHTML = ("Rating: "  + yTools.ratingToStars(~~resultGetEpisodeDetails["result"]["episodedetails"]["rating"]) 
								+ " (" + Math.round(resultGetEpisodeDetails["result"]["episodedetails"]["rating"] * 100 ) / 100 + ")");
							$("div#popupPlotSeries").text(resultGetEpisodeDetails["result"]["episodedetails"]["plot"]);
							document.getElementById('popupLanguagesFlagsSeries').innerHTML = ySeries.pathToFlags(resultGetEpisodeDetails["result"]["episodedetails"]["file"]);
							$("#popupPlaySeries").attr("name", resultGetEpisodeDetails["result"]["episodedetails"]["file"]);
							$('#detailspopupSeries').popup('open');
					}
			);
			
			$('#detailspopupSeries').popup('open');
	},	
	popupPlaySeries: function(pathToFile){
			$('#popupPlaySeries').text('Please wait...').button("refresh"); // change button text because of long JSON Call time			
			yCore.sendJsonRPC(
					'{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' + pathToFile + '" } }, "id": 1 }',
					function(){ window.location.href = "index.html";}
			);
	},
	pathToFlags: function(filePath){  //create image tags for languages and add language option to selection
		var returnstring = "";
		
		if(yS.hideLanguageMovies){return returnstring;}
		for (var i=0; i < countrycodes.length; i++){
				for (var j=0; j < countrycodes[i].codes.length; j++){
						if (filePath.indexOf(countrycodes[i].codes[j].code) > 0) {
							returnstring += "<img class='pathToFlags' alt='flag of " + countrycodes[i].language + "' src='images/flags/" + countrycodes[i].flagpath + yS.imageFormat +"' />&nbsp;";
						}
				}
		}
		
		if (returnstring == "") {returnstring += "language(s) unknown";}
		return returnstring;
	}
}

var yMusic = {
	albumJSON:[],
	genres: [],
	already_run:false,
	listPos: 0,
	listLength: 0,
	artistString: "",
	init: function() {
				
		yS.getSettings();
		
		if(yS.hideSearchMusic){$("#searchMusic").parent().hide();} //hide Search field if set in settings
		if(yS.hideGenreMusic){$("#genreSelectMusic").parent().hide();} //hide  genre selection  field if set in settings
		
		if (!yMusic.already_run){
			yMusic.already_run = true; 
			yCore.sendJsonRPC(
					'{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": {"properties": ["title", "thumbnail", "artist", "genre"] }, "id": 1}',
					function(resultGetAlbums){
											
							yMusic.albumJSON = resultGetAlbums; //write result in Array for further use 
							yMusic.createAlbumList(0, "all", "");

							$('#genreSelectMusic').change(function() {  //create Action Listener for list with selection choice
								$('#album_list').empty(); //empty ul to update list with new choices
								yMusic.createAlbumList(0, $('#genreSelectMusic').val(), $("#searchMusic").attr('value')); //create albumlist according to options
							});
					}
			);
		}
		
		$("body").delegate(".showAlbum", "click", function(e){
				e.stopImmediatePropagation();	
				yMusic.showAlbum($(this).attr('name'), $(this).find(">:first-child").attr('name')); //give in first attr xbmc-album-id and in the second internal reference		
		});

		$("body").delegate("#popupAddToPlaylist", "click", function(e){
				e.stopImmediatePropagation();
				yMusic.popupAddToPlaylist();
		});
		
		$("#searchMusic").keyup(function() {
				$('#album_list').empty(); //empty ul to update list with new choices
				yMusic.createAlbumList(0, $('#genreSelectMusic').val(), $("#searchMusic").attr('value'));
		});
		
		$("body").delegate("#playPlaylist", "click", function(e){  
				yMusic.playPlaylist();
		});
		
		$("body").delegate("#emptyPlaylist", "click", function(e){  
				yMusic.emptyPlaylist();
		});

		$("body").delegate("#popupUnselectMusic", "click", function(e){  //checkbox select/unselect reverser
				yMusic.popupUnselectMusic();
		});
		
		$("body").delegate("#albumListPrev", "click", function(e){  //checkbox select/unselect reverser
				yMusic.listPos -= yS.listLength;
				$('#album_list').empty();
				yMusic.createAlbumList(yMusic.listPos, $('#genreSelectMusic').val(), $("#searchMusic").attr('value'));
				window.location.href = "index.html#music"; //go to top of list
		});

		$("body").delegate("#albumListNext", "click", function(e){  //checkbox select/unselect reverser
				yMusic.listPos += yS.listLength;
				$('#album_list').empty();
				yMusic.createAlbumList(yMusic.listPos, $('#genreSelectMusic').val(), $("#searchMusic").attr('value'));
				window.location.href = "index.html#music"; //go to top of list
		});
	},
	createAlbumList: function (listStart, genre, searchval) {
		var selectedGenre = genre;
		var albumGenreInItem;
		var tempGenreLenth = yMusic.genres.length; //save length to check later if it is the first time to be updated
		itemsInList = 0; //needed to find out, how many items are shown, so that if list is restricted we know if next button has to be shown
		
		if(yMusic.albumJSON["result"]["limits"]["total"] == 0)
		{
				$("#album_list").append("<li><h3>No music in the library</h3></li>").trigger( "create" );
				$(".loading").hide();
				
		} else {
		
				yMusic.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button
				
				if(yS.listLength > yMusic.albumJSON["result"]["limits"]["end"]){
						yMusic.listLength = yMusic.albumJSON["result"]["limits"]["end"];
				} else{
						yMusic.listLength = yS.listLength;
				}
				
				if(yMusic.listPos != 0){		
						$("#album_list").append(
								"<a id='albumListPrev' name='albumListPrev'>"
										+"<li class='album_Item_Nav'>"
											+" <div class='' name='albumListPrev'>" 
												+ "<div class='albumItemLeft'>"
														+ "<img class='musicPrevPic' alt='Previous items in list button' src='images/listPrev" + yS.imageFormat + "' />" 
												+ "</div>" 
												+ "<div class='albumItemRight'>"
														+ "<h4>Previous</h4>"
														+" <p class='musicListArtist'></p>"
												+ "</div>" 
											+ "</div>"
										+"</li>"
								+"</a>" 
						);	
				}
				
				
				for (var i = 0; i < (yMusic.albumJSON["result"]["limits"]["end"]); i++) { //all albums
						for (var j=0; j < yMusic.albumJSON["result"]["albums"][i]["genre"].length; j++){ //all genres in movie
							if (!(jQuery.inArray(yMusic.albumJSON["result"]["albums"][i]["genre"][j], yMusic.genres) > -1)){ //push if already not therel
								yMusic.genres.push(yMusic.albumJSON["result"]["albums"][i]["genre"][j]);	
							} 
							if (selectedGenre == yMusic.albumJSON["result"]["albums"][i]["genre"][j]){
								albumGenreInItem = 1;	
							}
						}
						
						//show only elements with the given genre
						if($('#genreSelectMusic option:selected').attr('value') == "all" || albumGenreInItem == 1){
								// show only titles and artists (so far only first in artistsarray) matched to searchstring, also partly
								if(searchval === undefined || yMusic.albumJSON["result"]["albums"][i]["title"].toLowerCase().indexOf(searchval.toLowerCase()) != -1 || yMusic.albumJSON["result"]["albums"][i]["artist"]["0"].toLowerCase().indexOf(searchval.toLowerCase()) != -1){
										var imagetag = "";		// prepare image in advance. if there is no image in DB replace with a placeholder image		
										if(yMusic.albumJSON["result"]["albums"][i]["thumbnail"] == ""){
											imagetag = "<img class='musicPrevPic' alt='album preview image (not found)' src='images/NoFile" + yS.imageFormat +"' />";
										} else {
											imagetag = "<img class='musicPrevPic' alt='album preview image' src='http://"+ $(location).attr('host') 
																			+ "/image/"+ encodeURIComponent(yMusic.albumJSON["result"]["albums"][i]["thumbnail"]) 
																	+"' />";
										}
										
									yMusic.artistsToString(i);
										
										$("#album_list").append(
											"<a class='showAlbum' name='" + yMusic.albumJSON["result"]["albums"][i]["albumid"] + "'>"
													+"<li class='album_Item' name='" + i + "'>"
														+" <div class='' name='" + yMusic.albumJSON["result"]["albums"][i]["albumid"] + "'>" 
															+ "<div class='albumItemLeft'>"
																	+ imagetag 
															+ "</div>" 
															+ "<div class='albumItemRight'>"
																	+ "<h4>" + yMusic.albumJSON["result"]["albums"][i]["title"] + "</h4>"
																	+" <p class='musicListArtist'>" + yMusic.artistString + "</p>"
															+ "</div>" 
														+ "</div>"
													+"</li>"
											+"</a>" 
										);
										itemsInList++; 
								}
						}
						albumGenreInItem = 0;
						if(yS.hidePrevPics){$(".musicPrevPic").hide();} //hide previmage if set in settings
				}
				
				//only show if not at the end of the list, and no more items in the list to show
				if((yMusic.listPos + yMusic.listLength) < yMusic.albumJSON["result"]["limits"]["end"] && (yMusic.listPos + yMusic.listLength) < itemsInList){	
						$("#album_list").append(
								"<a id='albumListNext' name='albumListNext'>"
										+"<li class='album_Item_Nav'>"
											+" <div>" 
												+ "<div class='albumItemLeft'>"
														+ "<img class='musicPrevPic' alt='Next items in list button' src='images/listNext" + yS.imageFormat + "' />"  
												+ "</div>" 
												+ "<div class='albumItemRight'>"
														+ "<h4>Next</h4>"
														+" <p class='musicListArtist'></p>"
												+ "</div>" 
											+ "</div>"
										+"</li>"
								+"</a>" 
						);
				}

				$(".loading").hide();
				if(tempGenreLenth <= 0){ //only populate if it is the first time
					yMusic.genres.sort()
					for (var i=0; i < yMusic.genres.length; i++){  //add genre Options to selection
						$('#genreSelectMusic').append("<option value='" + yMusic.genres[i] + "'>" + yMusic.genres[i] + "</option>");
					}
				}
				
				$(".album_Item").hide(); //first hide all to prepare negative of slice
				$(".album_Item").slice(yMusic.listPos, (yMusic.listPos+yMusic.listLength)).show();
		}
	},
	showAlbum: function (albumNr, albumJsonNr) {	
			$("#popupContainerMusic").empty();
			yCore.sendJsonRPC(
					'{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { "properties": ["title", "artist", "genre", "track", "duration", "album", "thumbnail"], 				"filter": { "albumid" : ' + albumNr + '} }, "id": 1}',
					function(resultGetSongsAlbum){
							yMusic.artistsToString(albumJsonNr);
							
							$("#popupTitleMusic").text( yMusic.artistString + ": " 
									+ yMusic.albumJSON["result"]["albums"][albumJsonNr]["label"]);
							
							if(yMusic.albumJSON["result"]["albums"][albumJsonNr]['thumbnail'] == ""){
								$("#popupImageMusic").hide();
							} else {
								$("#popupImageMusic").attr("src","http://"+ $(location).attr('host') + "/image/" 
									+ encodeURIComponent(yMusic.albumJSON["result"]["albums"][albumJsonNr]['thumbnail'])+"");
								$("#popupImageMusic").show();
							}
							for (var i = 0; i < resultGetSongsAlbum["result"]["limits"]["end"]; i++) {
								$("#popupContainerMusic").append(
									"<div class='songItem'><input type='checkbox' name='addToPlaylist' value='"
									+ resultGetSongsAlbum['result']['songs'][i]['songid'] + "' checked='checked' />" 
									+ resultGetSongsAlbum['result']['songs'][i]['track'] + ") " 
									+ resultGetSongsAlbum['result']['songs'][i]['title'] 
									+ " ("+ Math.floor(resultGetSongsAlbum['result']['songs'][i]['duration']/60)+ ":" 
									+ resultGetSongsAlbum['result']['songs'][i]['duration'] % 60	 +")</div>");
							}
					}
			);
			$('#detailspopupMusic').popup('open');		
	},

	artistsToString: function(albumNr){
			yMusic.artistString = ""; //empty, to remove previous content, to avoid wrong or multiple informations
			for (var j=0; j < yMusic.albumJSON["result"]["albums"][albumNr]["artist"].length; j++){ //all genres in movie
					yMusic.artistString += yMusic.albumJSON["result"]["albums"][albumNr]["artist"][j];
					if (j !=  (yMusic.albumJSON["result"]["albums"][albumNr]["artist"].length -1)) { yMusic.artistString += ", "; }
			}
			if (yMusic.artistString==""){yMusic.artistString += "unknown"};			
	},	
	playPlaylist: function () {
			$('#playPlaylist').text('Please wait...').button("refresh");
			yCore.sendJsonRPC(
					'{ "jsonrpc": "2.0", "method": "Player.Open", "params": {"item":{"playlistid":0},"options":{"repeat":"all"}}, "id": 1 }',
					function(){ window.location.href = "index.html";}
			);
	},
	emptyPlaylist: function () {
			$('#emptyPlaylist').text('Done!').button("refresh");
			setTimeout(function(){$('#emptyPlaylist').text('Empty Playlist').button("refresh");}, 1500); //change text back in 1.5 seconds
			yCore.sendJsonRPC(
					'{"jsonrpc": "2.0", "id": 0, "method": "Playlist.Clear", "params": {"playlistid": 0}}',
					''
			);
	},
	popupUnselectMusic: function () {	
			if(($('input[name=addToPlaylist]').is(':checked'))){ //if is checked
						$('input[name=addToPlaylist]').attr('checked', false); //uncheck it
			} else {
				$('input[name=addToPlaylist]').attr('checked', true); //or check it
			}
	},
	popupAddToPlaylist: function () {	
			$("#popupContainerMusic input:checked").each(function() {
				yCore.sendJsonRPC(
						'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 0 , "item" : {"songid" : ' + $(this).val() + '} }, "id": 1}',
						''
				);
			});
			$("#detailspopupMusic").popup("close");
	}
}

var yAddons = {
	addonJSON: [],
	listPos: 0,
	listLength: 0,
	already_run: false,
	init: function() {
		
		yS.getSettings();
		
		
		if(yS.hideSearchAddons){$("#searchAddon").parent().hide();} //hide Search field if set in settings
		if(yS.hideGenreAddons){$("#addonSelect").parent().hide();} //hide  genre selection  field if set in settings
		
		if (!yAddons.already_run){  //that it doesn't run twice
			yAddons.already_run = true;
			yCore.sendJsonRPC(
						'{"jsonrpc": "2.0", "method": "Addons.GetAddons", "params": { "enabled": true, "type" : "xbmc.python.pluginsource", "properties": ["name", "thumbnail"]}, "id": 1}',
						function(resultGetAddons){
											yAddons.addonJSON = resultGetAddons;
											
											$(".loading").hide();
											
											yAddons.createAddonList(0, "all", "");
						}
			);
			
		}
		$("body").delegate(".addonlist-item", "click", function(e){  //executes addon
				e.stopImmediatePropagation();
				yAddons.openAddon($(this).attr('name'));
		});
		$('#addonSelect').change(function() {
				$('#addonlist').empty(); //empty ul to update list with new choices
				yAddons.createAddonList(0, $('#addonSelect option:selected').attr('value'), $("#searchAddon").attr('value'));
		});
		
		$("#searchAddon").keyup(function() {
				$("#addonlist").empty(); //empty ul to update list with new choices
				yAddons.createAddonList(0, $('#addonSelect option:selected').attr('value'), $("#searchAddon").attr('value'));
		});
		
		$("body").delegate("#addonListPrev", "click", function(e){  //checkbox select/unselect reverser
				yAddons.listPos -= yS.listLength;
				$("#addonlist").empty();
				yAddons.createAddonList(yAddons.listPos, $('#addonSelect option:selected').attr('value'), $("#searchAddon").attr('value'));
				window.location.href = "index.html#addons"; //go to top of list
		});

		$("body").delegate("#addonListNext", "click", function(e){  //checkbox select/unselect reverser
				yAddons.listPos += yS.listLength;
				$("#addonlist").empty();
				yAddons.createAddonList(yAddons.listPos, $('#addonSelect option:selected').attr('value'), $("#searchAddon").attr('value'));
				window.location.href = "index.html#addons"; //go to top of list
		});
	},
	createAddonList: function(listStart, addonTypeSelected, searchval){
				
		itemsInList = 0; //needed to find out, how many items are shown, so that if list is restricted we know if the next-button has to be shown
		yAddons.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button
		
		
		
		
		if(yAddons.addonJSON["result"]["limits"]["total"] == 0)
		{
				$("#addonlist").append("<li><h3>No addons in the library</h3></li>").trigger( "create" );
				$(".loading").hide();
				
		} else {
		
				
				if(yS.listLength > yAddons.addonJSON["result"]["limits"]["end"]){
						yAddons.listLength = yAddons.addonJSON["result"]["limits"]["end"];
				} else{
						yAddons.listLength = yS.listLength;
				}
				
				if(yAddons.listPos != 0){	 
							$("#addonlist").append(
								"<li id='addonListPrev' name='addonListPrev'> "
										+ "<span class='addonImage-box'><img class='addonImage' alt='Previous items in list button' src='images/listPrev" + yS.imageFormat + "' /></span>"
										+	"<h4 class='ui-li-heading addontitle'>Previous</h4>"
								+ "</li>"
							);	
				}		
				
				for (var i = 0; i < (yAddons.addonJSON["result"]["limits"]["end"]); i++) {
						var stringparts = yAddons.addonJSON["result"]["addons"][i]["addonid"].split('.');
						
						if (addonTypeSelected == "all" || stringparts[1] == addonTypeSelected){ 
								if(searchval === undefined || yAddons.addonJSON["result"]["addons"][i]["name"].toLowerCase().indexOf(searchval.toLowerCase()) != -1){
										$("#addonlist").append(
											"<li class='addonlist-item' name='" + yAddons.addonJSON["result"]["addons"][i]["addonid"] + "'> "
													+ "<span class='addonImage-box'><img alt='Addon preview image' class='addonImage' src='http://"+ $(location).attr('host') 
																+ "/image/"+ encodeURIComponent(yAddons.addonJSON["result"]["addons"][i]["thumbnail"]) 
													+ "' /></span>"
													+	"<h4 class='ui-li-heading addontitle'>" + yAddons.addonJSON["result"]["addons"][i]["name"] + "</h4>"
											+ "</li>");
											itemsInList++;
								}
						}
						if(yS.hidePrevPics){$(".addonImage").hide();} //hide previmage if set in settings
				}
					
				//only show if not at the end of the list, and no more items in the list to show
				if((yAddons.listPos + yAddons.listLength) < yAddons.addonJSON["result"]["limits"]["end"] && (yAddons.listPos + yAddons.listLength) < itemsInList){		
						$("#addonlist").append(
							"<li id='addonListNext' name='addonListNext'> "
									+ "<span class='addonImage-box'><img class='addonImage' alt='Next items in list button'  src='images/listNext" + yS.imageFormat + "' /></span>"
									+	"<h4 class='ui-li-heading addontitle'>Next</h4>"
							+ "</li>"
						);	
				}
				
				
				$(".addonlist-item").hide(); //first hide all to prepare negative of slice
				$(".addonlist-item").slice(yAddons.listPos, (yAddons.listPos+yAddons.listLength)).show();
		}	
	},
	openAddon: function(actionname){
			yCore.sendJsonRPC(
					'{"jsonrpc": "2.0", "method": "Addons.ExecuteAddon", "params": { "addonid": "' + actionname + '" }, "id": 1}',
					function(){ window.location.href = "index.html";}
			);
	}
}

var yTools = {
	ratingToStars: function(stars){  //create image tags for rating according to rating (rounded down)
		var htmlString= ""; 
			for (var i = 0; i <= 9; i++){
				if (stars == 0) { htmlString = "No rating"; break;}
				if (i < stars){
						htmlString += "<img class='movieRating' alt='Rating star active' src='images/star2" + yS.imageFormat +"' />"
				} else {
						htmlString += "<img class='movieRating' alt='Rating star not active' src='images/star1" + yS.imageFormat +"' />"
				}
				
			}
			return htmlString;
	},
	removeLastCharIf: function(url, toRemove){
		if (url.substring(url.length-1) == toRemove){
					url = url.substring(0, url.length-1);
					return url;
		}
	},
	addZeroTwoDigits: function(digit) {
		digit = "0" + digit;
		return digit.substr(digit.length - 2);
	}
}

var yS = { //yarcSettings
	
		xbmcName: "yarc",
		hidePrevPics: false,
		imageFormatSVG: false,
		hideWatched: false,
		hideGenreMovies: false,
		hideLanguageMovies: false,
		hideSearchMovies: false,
		hideFileLinkMovies: false,
		prevImgQualMovies: "50",
		hideGenreMusic: false,
		hideSearchMusic: false,	
		hideGenreAddons: false,
		hideSearchAddons: false,		
		listLength: "0",
		
		imageFormat: ".png",
		
		init: function(){
				//check if localstorage already set once, if not create initial setting
				if(localStorage.getItem("localStorage_init") != "true"){ 
						//localStorage.setItem($(this).val(), "false");  //für was ist das??
						localStorage.setItem("xbmcName", "yarc");
						localStorage.setItem("listLength", "0");
						localStorage.setItem("prevImgQualMovies", "50");
						localStorage.setItem("imageFormatSVG", "false");
						
						localStorage.setItem("localStorage_init", "true"); // to avoid that this routine runs again
				}
				
				
				
				$('#xbmcName').val(localStorage.getItem("xbmcName"));
			
				if(localStorage.getItem("hidePrevPics") == "true"){ //in local storage its string not boolean
						$('input[name=hidePrevPics]').prop("checked", true).checkboxradio("refresh");
				} else{
						$('input[name=hidePrevPics]').prop("checked", false).checkboxradio("refresh");
				}
				if(localStorage.getItem("imageFormatSVG") == "true"){ //in local storage its string not boolean
						$('input[name=imageFormatSVG]').prop("checked", true).checkboxradio("refresh");
				} else{
						$('input[name=imageFormatSVG]').prop("checked", false).checkboxradio("refresh");
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
				
				$("#listLength").blur(function(e) {
						$("#listLength_label").css('color', 'black');
						$("#saveSettings").button('enable');
						var numericReg = /^\d*[0-9]?$/;
						if (!numericReg.test($('[name=listLength]').val())) {
								alert("Needs to be a full number. Please change this in order to be able to save!");
								$("#saveSettings").button('disable');
								$("#listLength_label").css('color', 'red');
								return false;
						}
						if ($('[name=listLength]').val() == "") {
								alert("Needs to be a full number. Please change this in order to be able to save!");
								$("#saveSettings").button('disable');
								$("#listLength_label").css('color', 'red');
								return false;
						}
				});
				
				$("#prevImgQualMovies").blur(function(e) {
						$("#prevImgQualMovies_label").css('color', 'black');
						$("#saveSettings").button('enable');
						var rangeReg = /(9[0-5]|[1-8][0-9])/;//0?[0-9]|[0-9]|[1-8][0-9]|9[0-5]
						if (!rangeReg.test($('[name=prevImgQualMovies]').val())) {
								alert("Needs to be a full number between (including) 10 and 95. Please change this in order to be able to save!");
								$("#saveSettings").button('disable');
								$("#prevImgQualMovies_label").css('color', 'red');
								return false;
						}
				});
			
				$("#saveSettings").click(function(e) {
						e.stopImmediatePropagation();
						yS.setSettings();
				});
				
				
				
				
				//		alert("ERST NACHER PASSIERTS....");
				
		},
		getSettings: function(){ //get string from local storage and save it in variable here (as boolean for checkboxes) 
				yS.xbmcName = localStorage.getItem("xbmcName");
				if(localStorage.getItem("hidePrevPics")== "true"){yS.hidePrevPics = true;}else{yS.hidePrevPics = false;}
				if(localStorage.getItem("imageFormatSVG")== "true"){
						yS.imageFormatSVG = true;
						yS.imageFormat = ".svg";
				}else{
						yS.imageFormatSVG = false;
						yS.imageFormat = ".png";
				}
				if(localStorage.getItem("hideWatched")== "true"){yS.hideWatched = true;}else{yS.hideWatched = false;}
				if(localStorage.getItem("listLength")== "0"){yS.listLength = 99999999;} else{yS.listLength = parseInt(localStorage.getItem("listLength"));}
				if(localStorage.getItem("hideGenreMovies")== "true"){yS.hideGenreMovies = true;}else{yS.hideGenreMovies = false;}
				if(localStorage.getItem("hideLanguageMovies")== "true"){yS.hideLanguageMovies = true;}else{yS.hideLanguageMovies = false;}
				if(localStorage.getItem("hideSearchMovies")== "true"){yS.hideSearchMovies = true;}else{yS.hideSearchMovies = false;} 
				if(localStorage.getItem("hideFileLinkMovies")== "true"){yS.hideFileLinkMovies = true;}else{yS.hideFileLinkMovies = false;} 
				yS.prevImgQualMovies = localStorage.getItem("prevImgQualMovies");
				if(localStorage.getItem("hideGenreMusic")== "true"){yS.hideGenreMusic = true;}else{yS.hideGenreMusic = false;} 
				if(localStorage.getItem("hideSearchMusic")== "true"){yS.hideSearchMusic = true;}else{yS.hideSearchMusic = false;} 
				if(localStorage.getItem("hideGenreAddons")== "true"){yS.hideGenreAddons = true;}else{yS.hideGenreAddons = false;} 
				if(localStorage.getItem("hideSearchAddons")== "true"){yS.hideSearchAddons = true;}else{yS.hideSearchAddons = false;} 
				
					//	alert(" vorher PASSIERTS....");
				
				
				
		},
		setSettings: function(){
				$('#settings input[type=checkbox]').each(function () {
						if($(this).is(':checked')){
								localStorage.setItem($(this).val(), "true");
						} else {
								localStorage.setItem($(this).val(), "false");
						}
				});
				
				localStorage.setItem("xbmcName", $('[name=xbmcName]').val());
				localStorage.setItem("listLength", $('[name=listLength]').val());
				localStorage.setItem("prevImgQualMovies", $('[name=prevImgQualMovies]').val());
				
				yS.getSettings();
				window.location.href = "index.html";
		}
}



$(document).delegate(document, 'pageshow', yFooter.init);
$(document).delegate(document, 'pageshow', yCore.init);
$(document).delegate('', 'pageshow', yRemote.init);
$(document).delegate('#movies', 'pageshow', yMovies.init);
$(document).delegate('#series', 'pageshow', ySeries.init);
$(document).delegate('#music', 'pageshow', yMusic.init);
$(document).delegate('#addons', 'pageshow', yAddons.init);
$(document).delegate('#settings', 'pageshow', yS.init);

