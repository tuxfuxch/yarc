/*
* Yarc - Yet another Remote Control (for Kodi)
* Copyright (C) 2020 by Esra Kummer
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
{}|[]#\*/

/*
 * Yarc core functions run by start, and also start Kodi Libraries loading
 */

var yCore = {
    initDone: false,
    videoSources: [],
    musicSources: [],
    //set player at first as none, will by updated by yCore.getActivePlayer
    activePlayer: -1, //0=Music+liveStream   1=Video
    deviceBeta: 0,
    deviceGamma: 0,
    totalPlayTimeSeconds: 0,
    currentPlayTimeSeconds: 0,
    doeOnPause: false, //checks if device orient. is on pause, needs beeing global
    init: function(){
        yS.localStorageInit();  //if some settings are not made, set default

        if(yS.yS.hideSpeech){
          $("#yspeech").hide();
          $('#speechhelplink').hide();
        }
        else {
          $("#yspeech").show();
          $('#speechhelplink').show();
        }
        
        
        if(!yCore.initDone){
            
            //check active player each second
            setInterval(yCore.getActivePlayer, 1000);

            //check playing item each second
            setInterval(yCore.getPlayerGetItem, 1000);
            yCore.deviceOriantionService();

            yCore.keyDownService();

            ySpeech.init();

            document.title = "yarc - " + $(location).attr('host');
                        
            $("body").delegate(".openMainMenu", "click", function(e){
                e.stopImmediatePropagation();
                //on large screens, it does closes the pannel which was opened with clicking the menu button
                if($( document ).width() > 900) {
                    $("#nav-panel").panel("close");
                }
                //on small screens, it ensures that the menu is not closed (in case it is already open) but opened after clicking the menu
                else {
                    $("#nav-panel").panel("open");
                }
                $('html,body').animate({scrollTop: $("#nav-panel").offset().top},'fast');
            });
            
            //init language translation library (i18next), use chosen language in settings and use English as fallback
            //then translate all html elements with i18next attribute
            i18n.init({
                lng: yS.yS.language,
                fallbackLng: "en",
                useCookie: false,
                useDataAttrOptions: true,
                resGetPath: 'resources/lang/__lng__.json'}).done(function() {
                    //go throug all i18n marked tags and set text according to constant and chosen langugage
                    $('[data-i18n]').each(function() {$(this).i18n();});
                });

            yCore.sendJsonRPC(
                'GetSources',
                '[{"jsonrpc":"2.0","method":"Files.GetSources","params":["video"],"id":1}, '
                + '{"jsonrpc":"2.0","method":"Files.GetSources","params":["music"],"id":2}]',
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
                        //check if it is multipath, if yes, remove mulitpath part and slash in the end 
                        //and finaly add each multipath part to array
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
                        //check if it is multipath, if yes, remove mulitpath part and slash in the end and finaly 
                        //add each multipath part to array
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
            
            $.when(yLib.getMovies()).then(function(){});
            $.when(yLib.getMovieSets()).then(function(){});
            $.when(yLib.getMusicGenres()).then(function(){});
            $.when(yLib.getMusicArtists()).then(function(){});
            $.when(yLib.getSeries()).then(function(){});
            $.when(yLib.getPVRTVChannels()).then(function(){});
            $.when(yLib.getPVRRadioChannels()).then(function(){});
            $.when(yLib.getTVRecordings()).then(function(){});
            $.when(yLib.getMusicAlbums()).then(function(){});            
            $.when(yLib.getAddons()).then(function(){});
            $.when(yLib.getFavourites()).then(function(){});

            //update PVR-TV Broadcast items regularly
            setInterval(yLib.getPVRTVChannels, 300000); //every 5 Minutes
        }

        //on panel close set visability in var and on open set visability and set swipe height
        $("#remote").panel({
            beforeopen: function( event, ui ) {
            event.stopImmediatePropagation();
            
            $("#yspeech").hide();
            $('#speechhelplink').hide();

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
                                
                if (!yS.yS.hideSpeech) {
                  $("#yspeech").show();
                  $('#speechhelplink').show();
                }
                
            }
        });
        
        yCore.initDone = true; //that Intervals run only once, also after Pageswitch
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
            $("#mediaAudioSub").hide();
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
                + yCore.activePlayer + ',["time", "totaltime", "percentage", "shuffled","repeat","audiostreams","subtitles"]]'
                + '},'
                + '{ "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": '
                + yCore.activePlayer
                + ', "properties": [ "title", "showtitle", "artist", "thumbnail", "file",' 
            + '"season", "episode"] }, "id": 3 }]',
                function(getRemoteInfos){
                    //Application.GetProperties
                    if(getRemoteInfos["0"]["result"]["muted"] == true){
                    document.getElementById('SetMute').innerHTML = "<span class='icon-volume-off'></span>";
                    } else {
                    document.getElementById('SetMute').innerHTML = "<span class='icon-volume-up'></span>";
                    }

                    //Player.GetProperties                    
                    $("#mediaAudioSub").hide();   
                    if(!("error" in getRemoteInfos["1"])){
                      if (getRemoteInfos["1"]["result"].hasOwnProperty("audiostreams")){
                            if (getRemoteInfos["1"]["result"]["audiostreams"].hasOwnProperty(1)){
                                $("#mediaAudioSub").show();
                            }
                        }
                      if (getRemoteInfos["1"]["result"].hasOwnProperty("subtitles")){
                            if (getRemoteInfos["1"]["result"]["subtitles"].hasOwnProperty(0)){
                                $("#mediaAudioSub").show();                              
                                
                            }
                        }
                        
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

                        //needed for seek function and goto in y Speech to calc time difference
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
                        $("#mediaAudioSub").hide();
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
                            $("#mediaProgImage").attr(
                                "src", yTools.imageUrlNormalizer(getRemoteInfos["2"]['result']['item']['thumbnail'], "?")
                            );
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
                            $("#mediaProgImage").attr(
                                "src", yTools.imageUrlNormalizer(getRemoteInfos["2"]['result']['item']['thumbnail'], "?")
                            );
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
    * Checks for support of DeviceOrientation and if supported sets a timer to check position and 
    * fire according instructions if no support it hides on/off button
    */
    deviceOriantionService: function(){
    //Find our div containers in the DOM
    var dataContainerOrientation = document.getElementById('dataContainerOrientation');

    
    if(yS.yS.hideDevOrient){
        $("#devOrientWrapper").hide();
        $("#swipe").css("top", "37px");
    } else {
        //Check for support for DeviceOrientation event
        if(window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            if($('#devOrient').prop("checked")) {        
            
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
            if($('#devOrient').prop("checked")){
                radioNav_Med = $("input[name='nav-med']:checked").val();
                radioPause_Mute = $("input[name='devOrientMutePause']:checked").val();

                if( yCore.deviceGamma <= 20 && yCore.deviceGamma >= -20 && yCore.deviceBeta >= 170 
                    && yCore.deviceBeta <= 179 && !yCore.doeOnPause
                ){
                    if(radioPause_Mute == "pause"){
                    yRemote.playercontrol("Player.PlayPause");
                    } else {
                    yRemote.setVolume("Application.SetMute", null);
                    }
                    yCore.doeOnPause = true;
                }
                else if(yCore.deviceBeta >= 10 && yCore.deviceBeta <= 75 && yCore.doeOnPause){
                    if(yCore.doeOnPause){
                        if(radioPause_Mute == "pause"){
                            yRemote.playercontrol("Player.PlayPause");
                        } else {
                            yRemote.setVolume("Application.SetMute", null);
                        }  
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
            107: false, //+ (num-block)
            109: false, //- (num-block)
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

        //if "enter" is pressend and being in a text (most of them) field, 
        //exit textfield to close onscreen keyboards on mobiles
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
            if ($(e.target).is(":text") || $(e.target).is("#listLength")){
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
            if (keymap[81] || keymap[109]) {
                yRemote.setVolume("Volume.Minus", 10);
                return false;
            }
            if (keymap[82]) {
                yRemote.setSpeed("decrement");
                return false;
            }
            if (keymap[87] || keymap[107]) {
                yRemote.setVolume("Volume.Plus", 10);
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

/*
 * Get Langues and Subtitles from playing media, load them in a list to choos for change to it
 */

var yLangSubDetails = {
    init: function(){
        yCore.sendJsonRPC(
            'GetActiveSubtitleAndAudioStream',
            '{"jsonrpc":"2.0","method":"Player.GetProperties","id":2,"params":[' + yCore.activePlayer + ',["currentaudiostream", "currentsubtitle", "subtitleenabled"]]}',
            function(getActSubAudio){ 
                var actAudio = getActSubAudio["result"]["currentaudiostream"]["index"];
                var isSubEnabled= getActSubAudio["result"]["subtitleenabled"];
                var actSubtitle = getActSubAudio["result"]["currentsubtitle"]["index"];
                                
                yCore.sendJsonRPC(
                    'GetSubtitlesAndAudiostreamsPlaying',
                    '{"jsonrpc":"2.0","method":"Player.GetProperties","id":2,"params":['
                        + yCore.activePlayer + ',["audiostreams","subtitles"]]}',
                    function(getSubAudioPlaying){ 
                            
                        $("#langSubDetailsLangContent").empty();
                        $("#langSubDetailsSubContent").empty();   
                        
                        var actAudioColor = "";
                        var actSubtitleColor = "";
                        
                        if(!("error" in getSubAudioPlaying)){
                            if (getSubAudioPlaying["result"].hasOwnProperty("audiostreams")){
                                if (getSubAudioPlaying["result"]["audiostreams"].hasOwnProperty(1)){                            
                                    $("#langSubDetailsLang").collapsible("expand");    
                                    $("#mediaAudioSub").show();                        
                                }
                                else {                         
                                    $("#langSubDetailsLang").collapsible("collapse");   
                                }
                                
                                for (var i=0; i < getSubAudioPlaying["result"]["audiostreams"].length; i++){
                                    if (actAudio == getSubAudioPlaying["result"]["audiostreams"][i]["index"]) { actAudioColor = " style='color: #685300'" } else {actAudioColor="";}                                    
                                    if(getSubAudioPlaying["result"]["audiostreams"][i]["language"] in langCodeToDescFlag){//if code is in json                                
                                        $("#langSubDetailsLangContent").append(
                                            "<li class='audioStreamItem simpleList yListItem' data-yIndexNo='" + getSubAudioPlaying["result"]["audiostreams"][i]["index"] + "'"+actAudioColor+">" 
                                                +"<img class='pathToFlags' " 
                                                + "src='resources/images/flags/"
                                                + langCodeToDescFlag[getSubAudioPlaying["result"]["audiostreams"][i]["language"]]["flag"] + ".png' "
                                                + "title='"+ langCodeToDescFlag[getSubAudioPlaying["result"]["audiostreams"][i]["language"]]["native"] 
                                                + " ("+langCodeToDescFlag[getSubAudioPlaying["result"]["audiostreams"][i]["language"]]["native"]+")' />&nbsp;"    
                                                + "[" + parseInt(getSubAudioPlaying["result"]["audiostreams"][i]["index"]+1) + "] " 
                                                + langCodeToDescFlag[getSubAudioPlaying["result"]["audiostreams"][i]["language"]]["english"] + ""
                                                + " (" 
                                                + langCodeToDescFlag[getSubAudioPlaying["result"]["audiostreams"][i]["language"]]["native"] 
                                            + ")</li>"
                                        ).trigger("create");
                                    } else {
                                        $("#langSubDetailsLangContent").append(
                                            "<li class='subtitleItem simpleList yListItem' data-yIndexNo='" + getSubAudioPlaying["result"]["subtitles"][i]["index"]  + "'"+actSubtitleColor+">"
                                                + "<span class='icon-question'></span>&nbsp;[" 
                                                + parseInt(getSubAudioPlaying["result"]["audiostreams"][i]["index"]+1) + "] " + getSubAudioPlaying["result"]["audiostreams"][i]["language"] +"<br />"
                                            + ")</li>"
                                        ).trigger("create");                               
                                    }
                                }    
                            }
                            if (getSubAudioPlaying["result"].hasOwnProperty("subtitles")){
                                if (getSubAudioPlaying["result"]["subtitles"].hasOwnProperty(0)){                            
                                    $("#langSubDetailsSub").collapsible("expand");
                                    $("#mediaAudioSub").show();
                                }
                                else {
                                    $("#langSubDetailsSub").collapsible("collapse");
                                    $("#mediaAudioSub").hide();
                                }
                                
                                var noSubtitleColor = "";
                                if (!isSubEnabled) {
                                    noSubtitleColor = " style='color: #685300'"
                                }
                                
                                $("#langSubDetailsSubContent").append(
                                    "<li class='subtitleItem simpleList yListItem' data-yIndexNo='off'" + noSubtitleColor + ">" 
                                        + "&nbsp;<span class='icon-close'></span>&nbsp;&nbsp;"+ $.t("toggle") + "</span>"  
                                    + "</li>"
                                ).trigger("create");    
                                
                                for (var i=0; i < getSubAudioPlaying["result"]["subtitles"].length; i++){
                                    if (isSubEnabled) {
                                        if (actSubtitle == getSubAudioPlaying["result"]["subtitles"][i]["index"]) { actSubtitleColor = " style='color: #685300'" } 
                                        else { actSubtitleColor = "";}
                                    }
                                    if(getSubAudioPlaying["result"]["subtitles"][i]["language"] in langCodeToDescFlag){//if code is in json                                
                                        $("#langSubDetailsSubContent").append(
                                            "<li class='subtitleItem simpleList yListItem' data-yIndexNo='" + getSubAudioPlaying["result"]["subtitles"][i]["index"] + "'"+actSubtitleColor+">" 
                                                +"<img class='pathToFlags' " 
                                                + "src='resources/images/flags/"
                                                + langCodeToDescFlag[getSubAudioPlaying["result"]["subtitles"][i]["language"]]["flag"] + ".png' "
                                                + "title='"+ langCodeToDescFlag[getSubAudioPlaying["result"]["subtitles"][i]["language"]]["native"] 
                                                + " ("+langCodeToDescFlag[getSubAudioPlaying["result"]["subtitles"][i]["language"]]["native"]+")' />&nbsp;"    
                                                + "[" + parseInt(getSubAudioPlaying["result"]["subtitles"][i]["index"]+1) + "] " 
                                                + langCodeToDescFlag[getSubAudioPlaying["result"]["subtitles"][i]["language"]]["english"] + ""
                                                + " (" 
                                                + langCodeToDescFlag[getSubAudioPlaying["result"]["subtitles"][i]["language"]]["native"] 
                                            + ")</li>"
                                        ).trigger("create");
                                    } else {
                                        $("#langSubDetailsSubContent").append(
                                            "<li class='subtitleItem simpleList yListItem' data-yIndexNo='" + getSubAudioPlaying["result"]["subtitles"][i]["index"]  + "'"+actSubtitleColor+">"
                                                + "<span class='icon-question'></span>&nbsp;[" 
                                                + parseInt(getSubAudioPlaying["result"]["subtitles"][i]["index"]+1) + "] " + getSubAudioPlaying["result"]["subtitles"][i]["language"] +"<br />"
                                            + ")</li>"
                                        ).trigger("create");                                
                                    }
                                } 
                                
                            }
                        }
                    }
                );
            }
        );
        
        $("body").delegate(".audioStreamItem", "click", function(e){
            e.stopImmediatePropagation();
            yCore.sendJsonRPC(
                'switchToLanguageWithIndexNo',
                '{"jsonrpc":"2.0","id":1,"method":"Player.SetAudioStream","params":{"playerid":' + yCore.activePlayer 
                            + ', "stream":'+ $(this).attr('data-yIndexNo') +'}}',
                ''
            ); 
           window.history.back();
        });
        
        $("body").delegate(".subtitleItem", "click", function(e){
            e.stopImmediatePropagation();  
            if($(this).attr('data-yIndexNo') == "off") {
                yCore.sendJsonRPC(
                    'ShowSubtitles',
                    '{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":["showsubtitles"],"id":20}',
                    ''
                ); 
            }
            else {                      
                yCore.sendJsonRPC(
                    'switchToSubtitleWithIndexNo',
                    '{"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":' + yCore.activePlayer 
                                + ', "subtitle":'+ $(this).attr('data-yIndexNo') +'}}',
                    ''
                ); 
                yCore.sendJsonRPC(
                    'showSubtitle',
                    '{"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":' + yCore.activePlayer 
                                + ', "subtitle":"on"}}',
                    ''
                );  
            }
           window.history.back();
        });
        
        $("#langSubDetailsClose").click(function(e){
           e.stopImmediatePropagation();
           window.history.back();
        });
    }
}

/*
 * Load Kodi Libraries
 */

var yLib = {
    movies: [],
    movieSets: [],
    movieLanguage: [],//handled in yLib.getMoives and filled in yMoives.newMovieList
    movieGenres: [],//handled in yLib.getMoives
    movieDirector: [],//handled in yLib.getMoives
    movieCast: [],//handled in yLib.getMoives
    musicGenres: [],//handled in yLib.getMusicGenres
    musicAlbums: [],//handled in yLib.getMusicAlbums
    musicArtists: [],//handled in yLib.getMusicArtists
    musicSongTitles: [],//handled in yLib.getMusicSongs
    series: [],
    pvrTVChannels: [],
    pvrRadioChannels: [],
    pvrTVBroadcasts: [],
    pvrTVRecordings: [],
    addons: [],
    favourites: [],
    getMovies: function(){
        var dfd = $.Deferred();        
        yCore.sendJsonRPC(
            'getMovies',
            '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "limits": { "start": 0 }, "properties": [ "plot", "trailer", "title", "runtime", "year", "genre", "rating", "thumbnail", "file", "playcount", "streamdetails", "resume", "director", "cast", "art"], "sort": { "method": "sorttitle", "ignorearticle": true }}, "id": 1}',
            //, "filter": { "method": "sorttitle", "ignorearticle": true }
            //https://forum.kodi.tv/showthread.php?tid=171843
            //
            function(resultMovies){    
                
                yLib.movieLanguage = []; //empty to freshly fill
                
                for(var i=0; i < resultMovies["result"]["limits"]["end"]; i++){
                    var singleMovieItem = resultMovies["result"]["movies"][i];
                
                    //go through genres and fill yLib gerne db
                    for (var j=0; j < singleMovieItem["genre"].length; j++){ //all genres in movie                
                        if (!(jQuery.inArray(singleMovieItem["genre"][j], yLib.movieGenres) > -1)){//push if not already there
                            yLib.movieGenres.push(singleMovieItem["genre"][j]);
                        }
                    }
                    
                    //go through directors and fill yLib moviedirector db
                    for (var j=0; j < singleMovieItem["director"].length; j++){ //all genres in movie                
                        if (!(jQuery.inArray(singleMovieItem["director"][j], yLib.movieDirector) > -1)){//push if not already there
                            yLib.movieDirector.push(singleMovieItem["director"][j]);
                        }
                    }
                    
                    //go through cast and fill yLib moviecast db
                    for (var j=0; j < singleMovieItem["cast"].length; j++){ //all genres in movie
                        if(singleMovieItem["cast"][j]["order"] <= 4){      
                            if (!(jQuery.inArray(singleMovieItem["cast"][j]["name"], yLib.movieCast) > -1)){//push if not already there
                                yLib.movieCast.push(singleMovieItem["cast"][j]["name"]);
                            }
                        }
                    }
                    
                    //then build selects (genre&language from there
                    
                    /*
                     * There are two places, where it searches for language:
                     *  first the streamdetails form kodi, if there is something, add some additional data:
                     *       - the languages full name,
                     *       - which flag should be used to represent the language
                     *       - and the isocode, for further reverence, if it is already added to streamdetails
                     */
                    

                    /*
                     *  secondly, it searches for isocodes in the filename which has to be in brackets [], if there is found something, it also
                     *  addes the additional data into the streamdetails-audio (yarc internal only)
                     */
                    
                    /* for spoken languages*/

                    //add flag and "language-native" to streamdetails of the yarc internal movies-db
                    for (var j=0;  j < singleMovieItem["streamdetails"]["audio"].length; j++){//run whole kodi-language list
                        if(singleMovieItem["streamdetails"]["audio"][j]["language"] in langCodeToDescFlag){//if code is in json
                            var lang = singleMovieItem["streamdetails"]["audio"][j]["language"];
                            singleMovieItem["streamdetails"]["audio"][j]["native"] = langCodeToDescFlag[lang]["native"];
                            singleMovieItem["streamdetails"]["audio"][j]["flag"] = langCodeToDescFlag[lang]["flag"];
                            singleMovieItem["streamdetails"]["audio"][j]["isocode"] = langCodeToDescFlag[lang]["iso639_2"];
                            
                            if (!(jQuery.inArray(singleMovieItem["streamdetails"]["audio"][j]["isocode"], yLib.movieLanguage) > -1)){//push if not already there
                                yLib.movieLanguage.push(langCodeToDescFlag[lang]["iso639_2"]);
                            }
                        }
                    }
                    if(singleMovieItem["file"].indexOf("[") >= 0){//if there is no starting bracket in filepath, don't even try
                        for (var code in langCodeToDescFlag) { //go trough every isocode in the list
                            if (langCodeToDescFlag.hasOwnProperty(code)) {
                                if (singleMovieItem["file"].toLowerCase().indexOf("[" + code + "]") >= 0) {//if code is found in filename
                                    var codeIsSet = false;
                                    //go trough whole streamdetails-audio list
                                    for (var j=0;  j < singleMovieItem["streamdetails"]["audio"].length; j++){
                                        //if code is already in streamdetails-audio...
                                        if(langCodeToDescFlag[code]["iso639_2"] == singleMovieItem["streamdetails"]["audio"][j]["isocode"]){
                                            codeIsSet = true;//... remeber it to...
                                        }
                                    }
                                    if(!codeIsSet){//..not add it again to option list
                                        var streamdet = {//prepare object to be pushed into streamdetails-audio
                                                                native:langCodeToDescFlag[code].native,
                                                                flag:langCodeToDescFlag[code].flag,
                                                                isocode:langCodeToDescFlag[code]["iso639_2"]};
                                        singleMovieItem["streamdetails"]["audio"].push(streamdet);//push object above
                                    
                                        if (!(jQuery.inArray(langCodeToDescFlag[code]["iso639_2"], yLib.movieLanguage) > -1)){//push if not already there
                                            yLib.movieLanguage.push(langCodeToDescFlag[code]["iso639_2"]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    /* for subtitles*/ 
                    
                    //add flag and "language-native" to streamdetails of the yarc internal movies-db
                    for (var j=0;  j < singleMovieItem["streamdetails"]["subtitle"].length; j++){//run whole kodi-language list
                        if(singleMovieItem["streamdetails"]["subtitle"][j]["language"] in langCodeToDescFlag){//if code is in json
                            var langSub = singleMovieItem["streamdetails"]["subtitle"][j]["language"];
                            singleMovieItem["streamdetails"]["subtitle"][j]["native"] = langCodeToDescFlag[langSub]["native"];
                            singleMovieItem["streamdetails"]["subtitle"][j]["flag"] = langCodeToDescFlag[langSub]["flag"];
                            singleMovieItem["streamdetails"]["subtitle"][j]["isocode"] = langCodeToDescFlag[langSub]["iso639_2"];
                        }
                    }

                    /*
                    *  secondly, it searches for isocodes in the filename which has to be in brackets [], if there is found something, it also
                    *  addes the additional data into the streamdetails-subtitle (yarc internal only)
                    */
                    if(singleMovieItem["file"].indexOf("[") >= 0){//if there is no starting bracket in filepath, don't even try
                        for (var code in langCodeToDescFlag) { //go trough every isocode in the list
                            if (langCodeToDescFlag.hasOwnProperty(code)) {
                                if (singleMovieItem["file"].toLowerCase().indexOf("[sub-" + code + "]") >= 0) {//if code is found in filename
                                    var codeIsSet = false;
                                    //go trough whole streamdetails-subtitle list
                                    for (var j=0;  j < singleMovieItem["streamdetails"]["subtitle"].length; j++){
                                        //if code is already in streamdetails-subtitle...
                                        if(langCodeToDescFlag[code]["iso639_2"] == singleMovieItem["streamdetails"]["subtitle"][j]["isocode"]){
                                        codeIsSet = true;//... remeber it to...
                                        }
                                    }
                                    if(!codeIsSet){//..not add it again to aopton list
                                        var streamdet = {//prepare object to be pushed into streamdetails-audio
                                                                native:langCodeToDescFlag[code].native,
                                                                flag:langCodeToDescFlag[code].flag,
                                                                isocode:langCodeToDescFlag[code]["iso639_2"]};
                                        singleMovieItem["streamdetails"]["subtitle"].push(streamdet);//push object above
                                    }
                                }
                            }
                        }
                    }
                    yLib.movies[i] = singleMovieItem;
                }
                
                //since object has no length property like an array, add it here
                yLib.movies.length = resultMovies["result"]["limits"]["end"];
                /*TODO
                localStorage.setItem('yarcLibMovies', JSON.stringify(yLib.movies)); //write into local Storage
                localStorage.setItem('yarcLibMovieLanguage', JSON.stringify(yLib.movieLanguage)); //write into local Storage
        */
                yS.saveSettingsToLocalStorage();
                
                //fill genreselect in yMovies and...
                for (var i=0; i < yLib.movieGenres.length; i++){  //add genre Options to selection
                    $('#genreSelect').append("<option value='" + yLib.movieGenres[i] + "'>" + yLib.movieGenres[i] + "</option>");
                }                
                
                //...Sort Genre select
                $('#genreSelect').append($("#genreSelect option").sort(function(a, b) {
                        var at = $(a).text(), bt = $(b).text();
                        return (at > bt)?1:((at < bt)?-1:0);
                }));
                
                //fill Language select in yMovies and ....
                for (var i=0; i < yLib.movieLanguage.length; i++){  //add genre Options to selection
                    $('#languageSelect').append("<option value='" + yLib.movieLanguage[i] + "'>" + langCodeToDescFlag[yLib.movieLanguage[i]]["native"] + "</option>");
                }   
                
                //...Sort Language select
                $('#languageSelect').append($("#languageSelect option").sort(function(a, b) {
                        var at = $(a).text(), bt = $(b).text();
                        return (at > bt)?1:((at < bt)?-1:0);
                }));
                
                
                //fill director select in yMovies and ....
                for (var i=0; i < yLib.movieDirector.length; i++){  //add genre Options to selection
                    $('#directorSelect').append("<option value='" + yLib.movieDirector[i] + "'>" + yLib.movieDirector[i] + "</option>");
                }   
                
                //...Sort director select
                $('#directorSelect').append($("#directorSelect option").sort(function(a, b) {
                        var at = $(a).text(), bt = $(b).text();
                        return (at > bt)?1:((at < bt)?-1:0);
                }));
                
                
                //fill Language select in yMovies and ....
                for (var i=0; i < yLib.movieCast.length; i++){  //add genre Options to selection
                    $('#actorSelect').append("<option value='" + yLib.movieCast[i] + "'>" + yLib.movieCast[i] + "</option>");
                }   
                
                //...Sort Language select
                $('#actorSelect').append($("#actorSelect option").sort(function(a, b) {
                        var at = $(a).text(), bt = $(b).text();
                        return (at > bt)?1:((at < bt)?-1:0);
                }));

                $('#genreSelect').change(function() {  //create Action Listener for list with selection choice 
                    //save change in settings
                    yS.yS.moviePageSettings.genreSelect = $(this).val();
                    yS.saveSettingsToLocalStorage();

                    $('#movie_list').empty(); //empty ul to update list with new choices
                    $("#movie-flex-prev").empty();
                    $("#movie-flex-next").empty();
                    yMovies.firstListItem = [0]; //if selection changed, start from the beginning
                    //create movieslist accouding to options
                    yMovies.newMovieList(
                        false,
                        $('#genreSelect option:selected').attr('value'),
                        $('#languageSelect option:selected').attr('value'),
                        $("#searchMovies").val(),
                        $('#directorSelect option:selected').attr('value'),
                        $('#actorSelect option:selected').attr('value')
                    );
                });
                
                $('#languageSelect').change(function() {  //create Action Listener for list with selection choice
                    //save change in settings
                    yS.yS.moviePageSettings.languageSelect = $(this).val();
                    yS.saveSettingsToLocalStorage();

                    $('#movie_list').empty(); //empty ul to update list with new choices
                    $("#movie-flex-prev").empty();
                    $("#movie-flex-next").empty();
                    yMovies.firstListItem = [0];//if selection changed, start from the beginningy
                    yMovies.newMovieList(
                        false,
                        $('#genreSelect option:selected').attr('value'),
                        $('#languageSelect option:selected').attr('value'),
                        $("#searchMovies").val(),
                        $('#directorSelect option:selected').attr('value'),
                        $('#actorSelect option:selected').attr('value')
                    );
                });
                
                $('#directorSelect').change(function() {  //create Action Listener for list with selection choice
                    //save change in settings
                    yS.yS.moviePageSettings.directorSelect = $(this).val();
                    yS.saveSettingsToLocalStorage();

                    $('#movie_list').empty(); //empty ul to update list with new choices
                    $("#movie-flex-prev").empty();
                    $("#movie-flex-next").empty();
                    yMovies.firstListItem = [0];//if selection changed, start from the beginning
                    yMovies.newMovieList(
                        false,
                        $('#genreSelect option:selected').attr('value'),
                        $('#languageSelect option:selected').attr('value'),
                        $("#searchMovies").val(),
                        $('#directorSelect option:selected').attr('value'),
                        $('#actorSelect option:selected').attr('value')
                    );
                });
                
                $('#actorSelect').change(function() {  //create Action Listener for list with selection choice
                    //save change in settings
                    yS.yS.moviePageSettings.actorSelect = $(this).val();
                    yS.saveSettingsToLocalStorage();

                    $('#movie_list').empty(); //empty ul to update list with new choices
                    $("#movie-flex-prev").empty();
                    $("#movie-flex-next").empty();
                    yMovies.firstListItem = [0];//if selection changed, start from the beginning
                    yMovies.newMovieList(
                        false,
                        $('#genreSelect option:selected').attr('value'),
                        $('#languageSelect option:selected').attr('value'),
                        $("#searchMovies").val(),
                        $('#directorSelect option:selected').attr('value'),
                        $('#actorSelect option:selected').attr('value')
                    );
                }); 
                
                dfd.resolve();
            }            
        );
        return dfd.promise();
    },
    /*
     * First get information about all sets. because the number of movies in the set is not as an information aviable, i get the setdetails
     * of each set in one json call with multple get's
     * i write them only into yLib, when there is more than 1 movie in the set (for later use)
     */
    getMovieSets: function(){
        var dfd = $.Deferred();       
        var setsJson = "[";
        yCore.sendJsonRPC(
            'getMovieSets',
            '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieSets", "params": {"properties": ["title"], "sort": { "method": "label", "ignorearticle": true }}, "id": 1}',
            function(resultMovieSets){   
                
                for (i = 0; i < resultMovieSets["result"]["limits"]["end"]; i++) {
                    setsJson += '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieSetDetails", "params": {"setid": ' + resultMovieSets["result"]["sets"][i]["setid"] 
                        + ', "properties": [ "title", "playcount", "art", "plot"]}, "id": 1},';   
                }                
                setsJson = setsJson.slice(0,-1);//remove last comma
                setsJson += "]";
                                
                yCore.sendJsonRPC(
                    'getMovieMoviesOfSet',
                    setsJson,
                    function(resultMovieMoviesOfSet){
                        for (j = 0; j < (resultMovieMoviesOfSet.length); j++) {
                            if(resultMovieMoviesOfSet[j]["result"]["setdetails"]["limits"]["total"] >= 2) {
                                yLib.movieSets.push(resultMovieMoviesOfSet[j]["result"]);                                
                            }                            
                        }   /*TODO
                        localStorage.setItem('yarcLibMovieSets', JSON.stringify(yLib.movieSets));
                */
                    }
                );                
                dfd.resolve();
            }            
        );
        return dfd.promise();
    },
    getSeries: function(){
        var dfd = $.Deferred();
        //first get all TVShows        
        yCore.sendJsonRPC(
            'getTVShows',
            '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { "properties": ["art", "title",  "thumbnail", "playcount"], "sort": { "method": "sorttitle", "ignorearticle": true }}, "id": 1}',
            function(resultGetTVShows){                
                
                //all seasons get requested with 1 xhr request. so prepare request array. Packe in there get requests for seasons for each TVShow seperatly
                var requestAllSeasonsJsonRpc = "[";
                
                for (var i = 0; i < resultGetTVShows["result"]["limits"]["end"]; i++) {
                    //for each TVShow write infos in yLib.series and prepare a season array
                    yLib.series[resultGetTVShows["result"]["tvshows"][i]["tvshowid"]] = resultGetTVShows["result"]["tvshows"][i];
                    yLib.series[resultGetTVShows["result"]["tvshows"][i]["tvshowid"]]["seasons"] = [];
                    
                    //wirte each season request in array
                    requestAllSeasonsJsonRpc += '{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": {"properties": ' 
                        + '["season","tvshowid", "showtitle", "playcount"], "tvshowid":'
                        + resultGetTVShows["result"]["tvshows"][i]["tvshowid"] + '}, "id": 1},';
                }    
                //delete last comma for a clean array
                requestAllSeasonsJsonRpc = requestAllSeasonsJsonRpc.slice(0,-1);
                //close array
                requestAllSeasonsJsonRpc += "]";
                                
                //make season request, so for each TVShow the seasons are requested
                yCore.sendJsonRPC(
                    'GetAllSeasons',
                    requestAllSeasonsJsonRpc,
                    function(resultGetAllSeasons){
                            
                        //all epsiodes get requested with 1 xhr request for each season. so prepare request array. Packed in there get requests for epsidodes for each seasons for each TVShow seperatly
                        var requestAllEpisodesJsonRpc = "[";
                
                        for(var k = 0; k < resultGetAllSeasons.length; k++) {                        
                            
                            for (var j = 0; j < resultGetAllSeasons[k]["result"]["limits"]["end"]; j++) {  
                                //wirte each season in yLib.series in the corrext tvshow and...
                                yLib.series[resultGetAllSeasons[k]["result"]["seasons"][j]["tvshowid"]]["seasons"][resultGetAllSeasons[k]["result"]["seasons"][j]["season"]] = 
                                    resultGetAllSeasons[k]["result"]["seasons"][j];
                                //.. prepare array for episodes
                                yLib.series[resultGetAllSeasons[k]["result"]["seasons"][j]["tvshowid"]]["seasons"][resultGetAllSeasons[k]["result"]["seasons"][j]["season"]]["episodes"] = [];                                
                                
                                //wirte each epsisodes request in array
                                requestAllEpisodesJsonRpc += 
                                    '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "properties": ' 
                                    + '["tvshowid","seasonid","season","episode", "showtitle", "plot", "thumbnail", "file", "rating", "playcount", "streamdetails", "resume"],'
                                    + '"tvshowid":' + resultGetAllSeasons[k]["result"]["seasons"][j]["tvshowid"] + ',"season" : ' 
                                    + resultGetAllSeasons[k]["result"]["seasons"][j]["season"] + '}, "id": ' + k + '},';
                            }
                            
                        }  
                            
                        //delete last comma for a clean array
                        requestAllEpisodesJsonRpc = requestAllEpisodesJsonRpc.slice(0,-1);
                        //close array
                        requestAllEpisodesJsonRpc += "]";
                         
                        //make episodes request, so for each the season the episodes are requested
                        yCore.sendJsonRPC(
                            'GetAllEpisodes',
                            requestAllEpisodesJsonRpc,
                            function(resultGetAllEpisodes){  
                                   
                                for(var m = 0; m < resultGetAllEpisodes.length; m++) {
                                    for (var l = 0; l < resultGetAllEpisodes[m]["result"]["limits"]["end"]; l++) {   
                                        var tvshowid = resultGetAllEpisodes[m]["result"]["episodes"][l]["tvshowid"];
                                        var season = resultGetAllEpisodes[m]["result"]["episodes"][l]["season"];
                                        var episode = resultGetAllEpisodes[m]["result"]["episodes"][l]["episode"];
                                        //write each episode in the right season in the right tv show
                                        yLib.series[tvshowid]["seasons"][season]["episodes"][episode] = [];
                                        yLib.series[tvshowid]["seasons"][season]["episodes"][episode]["episode"] = resultGetAllEpisodes[m]["result"]["episodes"][l]["episode"];
                                        yLib.series[tvshowid]["seasons"][season]["episodes"][episode]["label"] = resultGetAllEpisodes[m]["result"]["episodes"][l]["label"];
                                        yLib.series[tvshowid]["seasons"][season]["episodes"][episode]["episodeid"] = resultGetAllEpisodes[m]["result"]["episodes"][l]["episodeid"];
                                        yLib.series[tvshowid]["seasons"][season]["episodes"][episode]["tvshowid"] = resultGetAllEpisodes[m]["result"]["episodes"][l]["tvshowid"];
                                    } 
                                }
                
                /*TODO
                                //write crealted yLibSeries in local storage for next start        
                                localStorage.setItem('yarcLibSeries', JSON.stringify(yLib.series));
                        */
                            }
                        );
                    }
                );
                
                dfd.resolve();
            }
        );
        
        return dfd.promise();
    },
    getMusicAlbums: function(){
        var dfd = $.Deferred();
        yCore.sendJsonRPC(
            'getAlbums',
            '{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": {"properties": ["title", "thumbnail", "artist", "genre"], "sort": { "order": "ascending", "method": "artist", "ignorearticle": true } }, "id": 1}',
            function(resultMusic){
                yLib.musicAlbums = resultMusic;
                /*TODO
                localStorage.setItem('yarcLibMusicAlbums', JSON.stringify(yLib.musicAlbums));
                */
                dfd.resolve();
            }
        );        
        return dfd.promise();        
    },
    /*
     * get List of music genres from Kodi library
     */
    getMusicGenres: function(){
        
        var dfd = $.Deferred();
        
        yLib.musicGenres = []; //empty to freshly fill
        
        $('#genreSelectMusic').selectmenu();
        
        //set the selectbox according to setting
        $("#genreSelectMusic").val(yS.yS.musicPageSettings.genreselect);
        $('#genreSelectMusic').selectmenu('refresh', true);
        
        $("#playMusicGenre").button();
    
        $('#genreSelectMusic').change(function() {  //create Action Listener for list with selection choice

            //save change in settings
            yS.yS.musicPageSettings.genreselect = $(this).val();
            yS.saveSettingsToLocalStorage();

            $('#album_list').empty(); //empty ul to update list with new choices
            $("#album-flex-prev").empty();
            $("#album-flex-next").empty();

            yMusic.firstListItem = [0];  //if selection changed, start from the beginning

            yMusic.createAlbumList(0, yS.yS.musicPageSettings.genreselect, "");  
        });    
        
        
        yCore.sendJsonRPC(
            'getMusicGenres',
            '{"jsonrpc": "2.0", "id": 1, "method": "AudioLibrary.GetGenres", "params":{"sort": { "method": "sorttitle", "ignorearticle": true }}}',
            function(resultGetMusicGenres){
                yLib.musicGenres = resultGetMusicGenres["result"]["genres"];
                
                localStorage.setItem('yarcLibMusicGenres', JSON.stringify(yLib.musicGenres));
                
                for (var i=0; i < resultGetMusicGenres["result"]["limits"]["end"]; i++){  //add genre Options to selection
                    $('#genreSelectMusic').append("<option value='" + resultGetMusicGenres["result"]["genres"][i]["label"] + "'>" + resultGetMusicGenres["result"]["genres"][i]["label"] + "</option>");
                }                
            }
        ); 
        
        return dfd.promise(); 
    },
    /*
     * get List of music artists from Kodi library
     */
    getMusicArtists: function(){  
        var dfd = $.Deferred();
        
        yLib.musicArtists = []; //empty to freshly fill
        
        yCore.sendJsonRPC(
            'getMusicArtists',
            '{"jsonrpc": "2.0", "id": 1, "method": "AudioLibrary.GetArtists", "params":{}}',
            function(resultGetMusicArtists){
              if(resultGetMusicArtists["result"]["limits"]["end"] == 0){
                localStorage.setItem('yarcLibMusicArtists', "[]");
              }
              else {
                yLib.musicArtists = resultGetMusicArtists["result"]["artists"];                
                localStorage.setItem('yarcLibMusicArtists', JSON.stringify(yLib.musicArtists));
              }
            }
        ); 
        
        return dfd.promise(); 
    },
    getPVRTVChannels: function(){ 
        var dfd = $.Deferred();
        
        yLib.pvrTVChannels = []; //empty to freshly fill
        yLib.pvrTVBroadcasts = []; //empty to freshly fill
        yCore.sendJsonRPC(
            'getPVR-Channels',
            '{"jsonrpc": "2.0", "id": 1, "method": "PVR.GetChannels", "params":{"channelgroupid" : "alltv", "properties":["icon","thumbnail", "channelnumber"]}}',
            function(resultgetChannels){
                if(resultgetChannels["result"]["limits"]["end"] == 0){
                    $(".h-pvr-tv").remove();
                    $("#mostUsedPvr-TV").hide();
                    $("#latesPvr-TVrecordings").hide();
                } else {
                    yLib.pvrTVChannels = resultgetChannels["result"]["channels"];
                        
                    var sendString = "";
                    for (var i = 0; i < yLib.pvrTVChannels.length; i++) {            
                        sendString += '{"jsonrpc":"2.0","method":"PVR.GetBroadcasts","id":"1","params":{"channelid":' + yLib.pvrTVChannels[i]["channelid"] + ',"properties": '
                            + '["title","runtime", "starttime","episodename","year","genre","endtime","wasactive","progresspercentage","thumbnail"]}},'
                    }
                    
                    sendString = sendString.slice(0,-1); //remove last comma
                    
                    yCore.sendJsonRPC(
                        'ChannelDetail-Broadcasts',
                        '['+sendString+']',
                        function(channelDetailBroadcasts){
                            yLib.pvrTVBroadcasts = channelDetailBroadcasts;
                    
                            //the broadcasts do not include channel info, so push it here to each item for later use
                            for (var k = yLib.pvrTVBroadcasts.length - 1; k >= 0; k--) { 
                                for (var l = yLib.pvrTVBroadcasts[k]["result"]["limits"]["total"] -1 ; l >= 0; l--) {  
                                    //since broadcasts and channels indexnumbers are for the same channels "k" can be used to match
                                    yLib.pvrTVBroadcasts[k]["result"]["broadcasts"][l]["channelLabel"] = yLib.pvrTVChannels[k]["label"];
                                    yLib.pvrTVBroadcasts[k]["result"]["broadcasts"][l]["channelThumb"] = yLib.pvrTVChannels[k]["thumbnail"];
                                    yLib.pvrTVBroadcasts[k]["result"]["broadcasts"][l]["channelID"] = yLib.pvrTVChannels[k]["channelid"];
                                }
                            }
                            dfd.resolve();
                        }
                    );
                }
            }
        );     
        return dfd.promise(); 
    },
    getTVRecordings: function(){
        var dfd = $.Deferred();
        
        yLib.pvrTVRecordings = []; //empty to freshly fill
        
        yCore.sendJsonRPC(
        'getPVR-Recordings',
        '{"jsonrpc":"2.0","method":"PVR.GetRecordings","id":"1","params":{"properties": '
        + '["channel","file","title","resume","plot","genre","playcount","starttime","endtime","runtime","icon","plotoutline", "showtitle", "season", "episode"], "sort": { "method": "date", "order": "descending"}}}',
        function(resultRecordings){                
                if(resultRecordings["result"]["limits"]["end"] == 0){
                    $("#pvr-tv-recodings-menu").remove();
                    $("#latesPvr-TVrecordings").hide();
                }
                yLib.pvrTVRecordings = resultRecordings["result"]["recordings"];
            }
        );     
        
        return dfd.promise(); 
    },
    getPVRRadioChannels: function(){
        var dfd = $.Deferred();
        
        yLib.pvrRadioChannels = []; //empty to freshly fill
        yCore.sendJsonRPC(
            'getPVR-Channels',
            '{"jsonrpc": "2.0", "id": 1, "method": "PVR.GetChannels", "params":{"channelgroupid" : "allradio", "properties":["thumbnail", "channelnumber"]}}',
            function(resultgetChannels){                
                if(resultgetChannels["result"]["limits"]["end"] == 0){
                    $(".h-pvr").remove();
                    $("#mostUsedPvr-Radio").hide();
                }
                
                yLib.pvrRadioChannels = resultgetChannels["result"]["channels"];
            }
        );     
        
        return dfd.promise(); 
    },
    getAddons: function(){
        var dfd = $.Deferred();
        yCore.sendJsonRPC(
            'getAddons',
            '{"jsonrpc": "2.0", "method": "Addons.GetAddons", "params": { "enabled": true, "type" : "xbmc.python.pluginsource", "properties": ["name", "thumbnail", "fanart"]}, "id": 1}',
            function(resultAddons){
                yLib.addons = resultAddons;
                localStorage.setItem('yarcLibAddons', JSON.stringify(yLib.addons));
                //write crealted yLibSeries in local storage for next start        
                localStorage.setItem('yarcLibSeries', JSON.stringify(yLib.series));//TODO what is this??? needed??
                dfd.resolve();
            }
        );        
        return dfd.promise();        
    },
    getFavourites: function(){
        var dfd = $.Deferred();
        yCore.sendJsonRPC(
            'getFavorties',
            '{"jsonrpc": "2.0", "method": "Favourites.GetFavourites", "params": { "properties": ["window","path","thumbnail","windowparameter"]}, "id": 1}',
            function(resultFavourites){
                yLib.favourites = resultFavourites.result.favourites;
                localStorage.setItem('yarcLibFavourites', JSON.stringify(yLib.favourites));
                dfd.resolve();
            }
        );     
        return dfd.promise();
    }
}

var yRemote = {
radioNavMed: "",
panelVisible: false,
isDragging: false,
seekTime: [0,0,0], //hours, minutes, seconds
startDragPlayTimeSeconds: 0,
showHelp: false,
lastPlayingFile: [
    ["", ""],
    ["", ""]
],
init: function() {
 
  $("#mediaAudioSubLink").click(function(e){
        e.stopImmediatePropagation();  
        $.mobile.navigate("#langSubDetails");
        $("#remote").panel("close");
        yLangSubDetails.init();
  });
  
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
         '{"jsonrpc":"2.0","id":1,"method":"Player.Seek","params":{"playerid":' + yCore.activePlayer 
             + ', "value":{"time":{"hours": ' + yRemote.seekTime[0] + ',"milliseconds": 0, "minutes": ' + yRemote.seekTime[1] 
             +', "seconds": ' + yRemote.seekTime[2] + '}}}}',
         ''
         );
    },
    drag: function( event, ui ) {
        yRemote.isDragging = true;

        $("#seek-overlay").show();

        var offset = $(this).offset();
        //"accumulated seconds position where i am aiming now" = 
        //total time in seconds * "percentage of current place to windowwidth" / 100
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

        $("#seek-overlay").html(yTools.addZeroTwoDigits(yRemote.seekTime[0]) + ":" 
        + yTools.addZeroTwoDigits(yRemote.seekTime[1])
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
      } else {
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
      //only do if over half a second. For every 5px of movement do 1 time the case
      if(distance % 10 == 0 && duration > 500){
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
          if($("input[name='nav-med']:checked").val() == "Nav"){yCore.simpleJsonRequest("Input.Select");} 
          else{yRemote.setVolume("Volume.Minus", 10);}
  },
  doubleTap:function(event, target) {
    if($("input[name='nav-med']:checked").val() == "Nav"){yCore.simpleJsonRequest("Input.Back");} 
    else{yRemote.setVolume("Volume.Plus", 10);}
  },
  longTap:function(event, target) {
    if($("input[name='nav-med']:checked").val() == "Nav"){yCore.simpleJsonRequest("Input.ContextMenu");} 
    else{yRemote.setVolume("Application.SetMute", null);}
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
  yRemote.setRepeat.next();
});

$("#SetShuffle").click(function(e) {
  e.stopImmediatePropagation();
  yRemote.setShuffle();
});

$(".playergoto").click(function(e) {
  e.stopImmediatePropagation();
  yRemote.playergoto($(this).attr('data-yJsonFunction'));
});

/*-------------Index Page - Navigation Controll Buttons---------------------*/
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
  yRemote.setVolume($(this).attr('data-yJsonFunction'), 10);
});
},/*   / init   */


/* **************************************
 * Open latest played media in yard     *
 ****************************************/
startLastPlayingFile: function(){
    if(yRemote.lastPlayingFile[1][0] == "") {alert($.t("no-matching"))}
    else {        
        switch (yRemote.lastPlayingFile[1][0]){
            case "movieID":
                yMovies.playMovie(yRemote.lastPlayingFile[1][1]);
                break;
            case "episodeID":
                ySeries.playEpisode(yRemote.lastPlayingFile[1][1]);   
                break;
            case "albumID":
                yCore.sendJsonRPC(
                    'PlayAlbum',
                    '{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item":  {"albumid" : ' + yRemote.lastPlayingFile[1][1] + '}}, "id": 1}',
                    ''
                );
                break; 
            case "songID":
                yMusic.playSong(yRemote.lastPlayingFile[1][1]);
                break;
            case "channelID":
                yCore.sendJsonRPC(
                    'PlayTVChannelID',
                    '{"jsonrpc":"2.0", "method":"Player.Open", "params": { "item": {"channelid":' + yRemote.lastPlayingFile[1][1] + '}, "options":{}}, "id":1}',
                    ''
                );
                yRemote.updateLastPlayingFile("channelID",yRemote.lastPlayingFile[1][1]);
                break; 
            case "recordingID":
                yPvrRecordings.playRecording(yRemote.lastPlayingFile[1][1]);
                break;  
            case "broadcastID":
                yPvrBroadcastDetails.playBroadcast(yRemote.lastPlayingFile[1][1]);
                yRemote.updateLastPlayingFile("broadcastID",Remote.lastPlayingFile[1][1]);
                break;  
                
            case "file":
                /*TODO get reasume position of file
                 var answer = false;

                //if there is a resume position, ask if he wants to start there
                if($(this).attr('data-yAddonFileResume') != 0){
                    var answer = confirm($.t("resume-at", {yPosition:Math.floor($(this).attr('data-yAddonFileResume')/60)
                                + ":"
                                + yTools.addZeroTwoDigits($(this).attr('data-yAddonFileResume') % 60)})
                            );
                }
                */
                yCore.sendJsonRPC(
                    'PlayerOpen',
                    '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' + yRemote.lastPlayingFile[1][1] + '" }, "options":{ "resume": true } }, "id": 1 }',
                    function(){}
                );
                yRemote.updateLastPlayingFile("file",yRemote.lastPlayingFile[1][1]);
                break;   
            default:
                break;
        }
    }
},
updateLastPlayingFile: function(category, media){
    yRemote.lastPlayingFile[1][0]=yRemote.lastPlayingFile[0][0];
    yRemote.lastPlayingFile[1][1]=yRemote.lastPlayingFile[0][1];
    yRemote.lastPlayingFile[0][0]=category;
    yRemote.lastPlayingFile[0][1]=media;
},
playercontrol: function(actionname) {
    yCore.sendJsonRPC(
        'StopPause',
        '{"jsonrpc": "2.0", "method": "' + actionname + '", "params": { "playerid": ' 
            + yCore.activePlayer + ' }, "id": 1}',
        ' '
    );
},
playergoto: function(actionname) {  
    yCore.sendJsonRPC(  //get to know if pvr is active
        'GetItem',
        '{ "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": '+ yCore.activePlayer
                +', "properties": ["channel","channeltype","channelnumber"] }, "id": 1 }',
        function(resultGetItem){
            var targetChannelID = -1;
            if(resultGetItem["result"]["item"].hasOwnProperty("channeltype")) {
                if(resultGetItem["result"]["item"]["channeltype"]  == "tv") {                    
                    for(var i=0; i < yLib.pvrTVChannels.length; i++) {
                        if(yLib.pvrTVChannels[i]["channelnumber"] == resultGetItem["result"]["item"]["channelnumber"]) {
                            if(actionname == "next"){
                                if(yLib.pvrTVChannels[i]["channelnumber"] !== yLib.pvrTVChannels.length){
                                    targetChannelID = yLib.pvrTVChannels[i+1]["channelid"];
                                }
                                else {targetChannelID = yLib.pvrTVChannels[0]["channelid"]}
                            }
                            else {
                                if(yLib.pvrTVChannels[i]["channelnumber"] !== 1){
                                    targetChannelID = yLib.pvrTVChannels[i-1]["channelid"];
                                }
                                else { targetChannelID = yLib.pvrTVChannels[(yLib.pvrTVChannels.length-1)]["channelid"];}                                
                            }
                            break;
                        }
                    }
                }
                else if(resultGetItem["result"]["item"]["channeltype"]  == "radio") {
                    for(var i=0; i < yLib.pvrRadioChannels.length; i++) {
                        if(yLib.pvrRadioChannels[i]["channelnumber"] == resultGetItem["result"]["item"]["channelnumber"]) {
                            if(actionname == "next"){
                                if(yLib.pvrRadioChannels[i]["channelnumber"] !== yLib.pvrRadioChannels.length){
                                    targetChannelID = yLib.pvrRadioChannels[i+1]["channelid"];
                                }
                                else {targetChannelID = yLib.pvrRadioChannels[0]["channelid"];}
                            }
                            else {
                                if(yLib.pvrRadioChannels[i]["channelnumber"] !== 1){
                                    targetChannelID = yLib.pvrRadioChannels[i-1]["channelid"];
                                }
                                else { targetChannelID = yLib.pvrRadioChannels[(yLib.pvrRadioChannels.length-1)]["channelid"];}                                
                            }
                            break;
                        }
                    }
                }
                yCore.sendJsonRPC(
                    'PlayTVChannelID',
                    '{"jsonrpc":"2.0", "method":"Player.Open", "params": { "item": {"channelid":' + targetChannelID + '}, "options":{}}, "id":1}',
                    ''
                );
                yRemote.UpdateLastPlayingFile("channelID",targetChannelID);
            }
            else {    
                yCore.sendJsonRPC(
                    'playergoto',
                    '{"jsonrpc": "2.0", "method": "Player.GoTo", "params": { "playerid": ' 
                        + yCore.activePlayer + ', "to": "' + actionname + '"}, "id": 1}',
                    ' '
                );                
            }
        }
    );
},
setSpeed: function(direction) {
    yCore.sendJsonRPC(
        'setSpeed',
        '{"jsonrpc": "2.0", "method": "Player.SetSpeed", "params": { "playerid": ' 
            + yCore.activePlayer + ', "speed": "' + direction  +'" }, "id": 1}',
        ' '
    );
},

//get Repeate status and switch to the next according to current mode. Then update Button
setRepeat: {
    next: function() { //next off one all
        yCore.sendJsonRPC(
            'GetProperties-repeat',
            '{"jsonrpc":"2.0","method":"Player.GetProperties", "params": { "playerid": '
                + yCore.activePlayer + ', "properties": ["repeat","canrepeat"] }, "id": 1}',
            function(resultGetProperties){   // true if "error" doesn't exist in object
                if(resultGetProperties["result"]["repeat"] == "all"){
                    yRemote.setRepeat.one();
                } 
                else if (resultGetProperties["result"]["repeat"] == "one"){
                   yRemote.setRepeat.off();
                } else {
                    yRemote.setRepeat.all();
                }
            }
        );
    },
    one: function() {
        yCore.sendJsonRPC(
            'SetRepeat-one',
            '{"jsonrpc": "2.0", "method": "Player.SetRepeat", "params": { "playerid": ' 
            + yCore.activePlayer + ', "repeat": "one" }, "id": 1}',
            ' '
        );
        document.getElementById('SetRepeat').innerHTML = "<span class='icon-refresh'></span>";
    },
    off: function() {
         yCore.sendJsonRPC(
            'SetRepeat-off',
            '{"jsonrpc": "2.0", "method": "Player.SetRepeat", "params": { "playerid": ' 
            + yCore.activePlayer + ', "repeat": "off" }, "id": 1}',
            ' '
        );
        document.getElementById('SetRepeat').innerHTML = "<span class='icon-refresh-one'></span>";
        
    },
    all: function() {
        yCore.sendJsonRPC(
            'SetRepeat-all',
            '{"jsonrpc": "2.0", "method": "Player.SetRepeat", "params": { "playerid": ' 
            + yCore.activePlayer + ', "repeat": "all" }, "id": 1}',
            ' '
        );
        document.getElementById('SetRepeat').innerHTML = "<span class='icon-refresh-no'></span>";
    }
},
setShuffle: function() {//get Shuffled status and toggle mode. Then update Button.
yCore.sendJsonRPC(
  'GetProperties-shuffled',
  '{"jsonrpc":"2.0","method":"Player.GetProperties", "params": { "playerid": '
    + yCore.activePlayer + ', "properties": ["shuffled","canrepeat"] }, "id": 1}',
  function(resultGetProperties){
      if(resultGetProperties["result"]["shuffled"] == false){
        yCore.sendJsonRPC(
          'SetShuffle-on',
          '{"jsonrpc": "2.0", "method": "Player.SetShuffle", "params": { "playerid": ' 
            + yCore.activePlayer + ', "shuffle": true }, "id": 1}',
          ' '
        );
        document.getElementById('SetShuffle').innerHTML = "<span class='icon-random-straight'></span>";
      } else {
        yCore.sendJsonRPC(
          'SetShuffle-off',
          '{"jsonrpc": "2.0", "method": "Player.SetShuffle", "params": { "playerid": ' 
            + yCore.activePlayer + ', "shuffle": false }, "id": 1}',
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
          //populate addon with new query and replace spaces from search string with +
          yAddons.populateAddon("plugin://plugin.video.youtube/kodion/search/query/?q=" + sendText.replace(' ', '+'), "");
      }

  yCore.sendJsonRPC(
    'SendText',
    '{"jsonrpc": "2.0", "method": "Input.SendText", "params": { "text": "' + sendText + '" }, "id": 1}',
    ' '
  );
},
setVolume: function(actionname, percentChange) {
    percentChange = parseInt(percentChange);
    volume = -1;
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
        yCore.sendJsonRPC(
            'GetProperties',
            '{"jsonrpc":"2.0","method":"Application.GetProperties","params":{"properties":["volume"]},"id":"1"}',
            function(resultGetVolume){
                volume = resultGetVolume["result"]["volume"];

                if(actionname=="Volume.Plus"){
                    volume += percentChange;
                } else if (actionname=="Volume.Minus"){
                    volume -= percentChange;
                }
                
                if(volume < 0){volume = 0;}
                else if(volume > 100){volume = 100;}
                
                yCore.sendJsonRPC(
                    'SetVolume',
                    '{"jsonrpc": "2.0", "method": "Application.SetVolume", "params": { "volume": ' + volume + ' }, "id": 1}',
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
/*
* This is the Startpage with most 10 recent Movies, TV-Shows and Songs. Furthermore the top10 used addons 
* (within this interface instance) and top 10 favourites
* There are also the tools with shutdown/sleep etc, instruciton video 
* and link to settings
*/
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
            if(yS.yS.startPageSettings.showmostUsedPvrTV){
                $("#mostUsedPvr-TV").collapsible("expand");
            } else {
                $("#mostUsedPvr-TV").collapsible("collapse");
            }
            if(yS.yS.startPageSettings.showlatesPvrTVrecordings){
                $("#latesPvr-TVrecordings").collapsible("expand");
            } else {
                $("#latesPvr-TVrecordings").collapsible("collapse");
            }
            if(yS.yS.startPageSettings.showmostUsedPvrRadio){
                $("#mostUsedPvr-Radio").collapsible("expand");
            } else {
                $("#mostUsedPvr-Radio").collapsible("collapse");
            }
            if(yS.yS.startPageSettings.showMostPlayedAlbum){
                $("#mostPlayedAlbum").collapsible("expand");
            } else {
                $("#mostPlayedAlbum").collapsible("collapse");
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

            yStart.initDone = 1;
            setTimeout(function(){$("#yarcLoading").fadeOut("slow")}, 5000);
        
            yStart.updateRecentMovies();  
            yStart.updateRecentSeries();  
            yStart.updateRecentPVRTV();
            yStart.updatelatesPvrTVrecordings();
            yStart.updateRecentPVRRadio();
            yStart.updateMostPlayedAlbum();        
            yStart.updateTopAddons();
            //so that string is not translated to early kodi-favourites (ugly hack).
            //should not be a prob since yarcloading is fading at take same time amount
            setTimeout(function(){yStart.updateFavourites();}, 1000);
            
        }

        $("#newMovies").collapsible({
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showRecentMovies = true;
                yS.saveSettingsToLocalStorage();
                
                yStart.updateRecentMovies();
            },
            collapse: function(e){
                //save change in settings
                yS.yS.startPageSettings.showRecentMovies = false;
                yS.saveSettingsToLocalStorage();
                if($(this).attr('data-yAllSeen') == "1"){ //if all most recent items seen, set after collapse tick again
                    $('#newMovies a').addClass('ui-icon-check').removeClass('ui-icon-plus');
                }
            }
        });

        $("#newSeries").collapsible({
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showRecentSeries = true;
                yS.saveSettingsToLocalStorage();
                
                yStart.updateRecentSeries();
            },
            collapse: function(e){
                //save change in settings
                yS.yS.startPageSettings.showRecentSeries = false;
                yS.saveSettingsToLocalStorage();
                if($(this).attr('data-yAllSeen') == "1"){ //if all most recent items seen, set after collapse tick again
                    $('#newSeries a').addClass('ui-icon-check').removeClass('ui-icon-plus');
                }
            }
        });

        $("#mostUsedPvr-TV").collapsible({
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showmostUsedPvrTV = true;
                yS.saveSettingsToLocalStorage();
                yStart.updateRecentPVRTV();
            },
            collapse: function(e){
                //save change in settings
                yS.yS.startPageSettings.showmostUsedPvrTV = false;
                yS.saveSettingsToLocalStorage();
                if($(this).attr('data-yAllSeen') == "1"){ //if all most recent items seen, set after collapse tick again
                    $('#newSeries a').addClass('ui-icon-check').removeClass('ui-icon-plus');
                }
            }
        });

        $("#latesPvr-TVrecordings").collapsible({
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showlatesPvrTVrecordings = true;
                yS.saveSettingsToLocalStorage();
                yStart.updatelatesPvrTVrecordings();
            },
            collapse: function(e){
                //save change in settings
                yS.yS.startPageSettings.showlatesPvrTVrecordings = false;
                yS.saveSettingsToLocalStorage();
            }
        });

        $("#mostUsedPvr-Radio").collapsible({
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showmostUsedPvrRadio = true;
                yS.saveSettingsToLocalStorage();
                yStart.updateRecentPVRRadio();
            },
            collapse: function(e){
                //save change in settings
                yS.yS.startPageSettings.showmostUsedPvrRadio = false;
                yS.saveSettingsToLocalStorage();
                if($(this).attr('data-yAllSeen') == "1"){ //if all most recent items seen, set after collapse tick again
                    $('#newSeries a').addClass('ui-icon-check').removeClass('ui-icon-plus');
                }
            }
        });

        $("#mostPlayedAlbum").collapsible({
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showMostPlayedAlbum = true;
                yS.saveSettingsToLocalStorage();
                
                yStart.updateMostPlayedAlbum();
            },
            collapse: function(e){
                //save change in settings
                yS.yS.startPageSettings.showMostPlayedAlbum = false;
                yS.saveSettingsToLocalStorage();
            }
        });
        
        $("#mostUsedAddons").collapsible({
            expand: function(e){
                //save change in settings
                yS.yS.startPageSettings.showmostUsedAddons = true;
                yS.saveSettingsToLocalStorage();
                
                yStart.updateTopAddons();
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
                
                $.when(
                    yLib.getFavourites()
                ).then(function() {
                    yStart.updateFavourites();
                });
            },
            collapse: function(e){
                //save change in settings
                yS.yS.startPageSettings.showmostUsedFavs = false;
                yS.saveSettingsToLocalStorage();
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
            yRemote.updateLastPlayingFile("movieID",$(this).attr('data-yMovieId'));
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
                '{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item":  {"episodeid" : ' + $(this).attr('data-yEpisodeID') + '}, "options":{ "resume": ' + answer + ' }}, "id": 1}',
                ''
            );
            yRemote.updateLastPlayingFile("episodeID",$(this).attr('data-yEpisodeID'));
        });

        $("body").delegate(".recentAlbum", "click", function(e){
            e.stopImmediatePropagation();
            yCore.sendJsonRPC(
                'PlayAlbum',
                '{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item":  {"albumid" : ' + $(this).attr('data-yAlbumID') + '}}, "id": 1}',
                ''
            );            
            yRemote.updateLastPlayingFile("albumID",$(this).attr('data-yAlbumID'));
        });
        
        $("body").delegate(".PvrTVopenChannel", "click", function(e){
            e.stopImmediatePropagation();
            yCore.sendJsonRPC(
                'PlayChannel',
                '{"jsonrpc":"2.0", "method":"Player.Open", "params": { "item": {"channelid":' + $(this).attr('data-ypvrchannelid') + '}, "options":{}}, "id":1}',
                ''
            );            
            yRemote.updateLastPlayingFile("channelID",$(this).attr('data-ypvrchannelid'));
        });

        $("body").delegate("#start .pvrTVopenRecording", "click", function(e){
            e.stopImmediatePropagation();
            yPvrRecordings.playRecording($(this).attr('data-ypvrrecordingid'));
        });
        

        $("body").delegate("#start .addonlist-item", "click", function(e){
            e.stopImmediatePropagation();

            $("#addonDetailsList").empty();
            $("#addonDetailsImage").attr("src","");
            yAddons.populateAddon("plugin://" +$(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));

            $.mobile.navigate("#addonDetails");

            //increment addon startcount in settings by 1 and save it to local storage
            yS.yS.libAddons[$(this).attr('data-yAddonID')]["opens"] += 1;
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
                yRemote.updateLastPlayingFile("file",$(this).attr('data-yAddonFile'));

            } else if ($(this).attr('data-yAddonFileType') == "directory" || $(this).attr('data-yAddonFileType') == "window"){
                $("#addonDetailsList").empty();
                if( $(this).attr('data-yAddonIsBack') == "back"){
                    yAddons.addonBackPath.pop();yAddons.addonBackPath.pop();
                }
                yAddons.populateAddon($(this).attr('data-yAddonFile'), $(this).attr('data-yAddonFanartPath'));
                $.mobile.navigate("#addonDetails");
            }
        });
    },
    /*
     * creates/updates 10 most recent movies
     */
    updateRecentMovies: function() {        
        yCore.sendJsonRPC(
        'getRecentMovies',
            '{"jsonrpc":"2.0","method":"VideoLibrary.GetRecentlyAddedMovies","id":1,"params":[["title","year","playcount",'
            + '"runtime","art","sorttitle","resume","rating"],{"end":10,"start":0}]}',
            function(resultgetRecentMovies){
                $("#recentMovies").empty();
                //if there is nothing in the library hide menu item and collapsible on startpage
                //also discount the header item to set later appropriate width
                if(resultgetRecentMovies["result"]["limits"]["end"] == 0){
                    $(".h-movies").remove();
                    $(".h-movies-col").remove();
                    $("#newMovies").hide();
                } else {
                    var allSeenMovies = 0; //to count all top movies which are seen
                    for (var i = 0; i < resultgetRecentMovies["result"]["limits"]["end"]; i++) {

                        var imagetag = "";
                            if(!yS.yS.hidePrevPics){
                            imagetag = yTools.imageUrlNormalizer(
                                resultgetRecentMovies["result"]["movies"][i]["art"]["poster"],
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
                            allSeenMovies++; //if seen +1
                        }
                        if(
                            resultgetRecentMovies["result"]["movies"][i]["resume"] !== undefined
                            && resultgetRecentMovies["result"]["movies"][i]["resume"]["position"]>0
                        ){
                            seenAndResume += "<i class='icon-clock-o orange'></i> ";
                            resume = resultgetRecentMovies["result"]["movies"][i]["resume"]["position"];
                        }

                        var   md_runtime = Math.round(resultgetRecentMovies["result"]["movies"][i]["runtime"]/60);
                        if (md_runtime > 0){md_runtime += "min";}else{ md_runtime = "?";}

                        $("#recentMovies").append(
                            "<a class='openMovieItem movieItem recentMovie ' data-yResume='" + resume + "' data-yMovieId='" + resultgetRecentMovies["result"]["movies"][i]["movieid"] + "'>"
                                    + "<div class='prevPicContainerMovie'>"
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
                    if(allSeenMovies == resultgetRecentMovies["result"]["limits"]["end"]){ //if all top movies are seen, replace plus symbol with tick
                        $('#newMovies a').addClass('ui-icon-check').removeClass('ui-icon-plus');
                        $('#newMovies').attr('data-yAllSeen', "1");//remeber in newSeries if all seen, to set tick again on opening/closing collapsible
                    }
                }
            });
    },
    /*
     * creates/updates 10 most recent episodes
     */
    updateRecentSeries: function() {    
        yCore.sendJsonRPC(
            'getRecentSeries',
            '{"jsonrpc":"2.0","method":"VideoLibrary.GetRecentlyAddedEpisodes","id":1,"params":[["title","playcount","season","episode","showtitle","thumbnail","resume","firstaired"],'
                + '{"end":10,"start":0},{"method":"date","ignorearticle":true,"order":"descending"}]}',
            function(resultgetRecentSeries){
                $("#recentSeries").empty()
                //if there is nothing in the library hide menu item and collapsible on startpage
                //also discount the header item to set later appropriate width
                if(resultgetRecentSeries["result"]["limits"]["end"] == 0){
                    $(".h-tv-shows").remove();
                    $("#newSeries").hide();
                } else {
                    var allSeenSeries = 0; //to count all top series which are seen
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
                            allSeenSeries++; //if seen +1
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
                                        + "<div class='prevPicContainerSeries'>"
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
                    if(allSeenSeries == resultgetRecentSeries["result"]["limits"]["end"]){ //if all top series are seen, replace plus symbol with tick
                        $('#newSeries a').addClass('ui-icon-check').removeClass('ui-icon-plus');
                        $('#newSeries').attr('data-yAllSeen', "1");//remeber in newSeries if all seen, to set tick again on opening/closing collapsible
                    }
                }
            }
        );
    },
    /*
     * creates/updates 10 most recent used PVR TV channels
     */
    updateRecentPVRTV: function() {
        
        yCore.sendJsonRPC(
            'getPVR-ChannelGroups',
            '{"jsonrpc": "2.0", "id": 1, "method": "PVR.GetChannelGroups", "params":{"channeltype":"tv"} }',
            function(resultgetChannelGroups){
                var ChannelGroupID = resultgetChannelGroups["result"]["channelgroups"][0]["channelgroupid"];
               
                yCore.sendJsonRPC(
                    'getPVR-Channels',
                    '{"jsonrpc": "2.0", "id": 1, "method": "PVR.GetChannels", "params":{"channelgroupid" : ' + ChannelGroupID +', "properties":["thumbnail", "icon", "lastplayed", "broadcastnow", "broadcastnext"], "limits": { "start" : 0, "end": 10 }} }',
                    function(resultgetChannels){
                        $("#topPvrTV").empty();
                        
                        for (var i = 0; i < resultgetChannels["result"]["limits"]["end"]; i++) {
                            var title =  " ? ";
                            var nextTitle =  " ? ";
                            var percentage = false;
                            var percentageBar = "";
                            var episodename = "";
                            var year = "";
                            var imagetag = "";
                            var imagetagicon = "";
                            var timeLeft = "";
                        
                            if(!yS.yS.hidePrevPics){
                                imagetag = yTools.imageUrlNormalizer(
                                                    resultgetChannels["result"]["channels"][i]["thumbnail"],
                                                    "?",
                                                    "tag",
                                                    "musicPrevPic text-center",
                                                    "",
                                                    true
                                                );
                            }
                            imagetagicon = yTools.imageUrlNormalizer(
                                        resultgetChannels["result"]["channels"][i]["icon"],
                                        "?",
                                        "tag",
                                        "pvrChannelIcon text-center",
                                        "",
                                        true
                                    );
                            
                            if(resultgetChannels["result"]["channels"][i].hasOwnProperty("broadcastnext")){
                                nextTitle = resultgetChannels["result"]["channels"][i]["broadcastnext"]["title"];
                            }

                            if(resultgetChannels["result"]["channels"][i].hasOwnProperty("broadcastnow")){
                                title = resultgetChannels["result"]["channels"][i]["broadcastnow"]["title"];
                                percentage = resultgetChannels["result"]["channels"][i]["broadcastnow"]["progresspercentage"];
                                episodename = " • <i>" + resultgetChannels["result"]["channels"][i]["broadcastnow"]["episodename"] + "</i>";
                                if (resultgetChannels["result"]["channels"][i]["broadcastnow"]["year"] != 0){
                                    year = "</i> (" + resultgetChannels["result"]["channels"][i]["broadcastnow"]["year"] + ")</i>";
                                }   
                                timeLeft = resultgetChannels["result"]["channels"][i]["broadcastnow"]["runtime"] - Math.round(resultgetChannels["result"]["channels"][i]["broadcastnow"]["runtime"] / 100 * resultgetChannels["result"]["channels"][i]["broadcastnow"]["progresspercentage"]);                         
                            }
                        
                            if (percentage) {
                                percentageBar = "<div class='percentageBar'><div class='percentageBarInside' style='width:" +percentage+ "%'></div></div>";
                            }
                            
                            $("#topPvrTV").append(
                                "<a class='PvrTVopenChannel' title='"+ title + "'" 
                                    + " data-yPVRChannelID='" + resultgetChannels["result"]["channels"][i]["channelid"]
                                + "' tabindex='1'>"
                                    +"<div class='prevPicContainerSeries'>"
                                        + imagetag
                                    + "</div>"
                                    + "<div class='pvr-description-box'>"
                                        + imagetagicon
                                        + "<p>"+ resultgetChannels["result"]["channels"][i]["label"] + "</p>"
                                        + "<h4>" + title + episodename + year + "</i></h4>"
                                        + percentageBar
                                        + "<p>" + $.t("pvr-next", {yNextBroadcast: nextTitle, yTimeLeft: timeLeft}) + "</p>"    
                                    + "</div>"
                                +"</a>"
                            ).trigger("create");
                            
                        }
                    });
                
            });
    },
    /*
     * updates latest PVR TV recording
     */
    updatelatesPvrTVrecordings: function() {
        
        yCore.sendJsonRPC(
            'getPVR-Recordings',
            '{"jsonrpc":"2.0","method":"PVR.GetRecordings","id":"1","params":{"properties": '
            + '["channel","file","title","resume","plot","genre","playcount","starttime","endtime","runtime","icon","plotoutline", "showtitle", "season", "episode"], "sort": { "method": "date", "order": "ascending"}}}',
            function(resultRecordings){
                $("#topPvrTVRecordings").empty();
                
                for (var i=(resultRecordings["result"]["limits"]["end"]-10); i < resultRecordings["result"]["limits"]["end"]; i++) {
                    var seenAndResume = "";
                    var resume = "";
                    var recordingid = "";
                    var imagetag = "";
                    var showTitle = "";
                    var colapsChannelPrevPic = "";
                    
                    if(!yS.yS.hidePrevPics){
                        //if there is no thumbnail, take channel logo
                        if (resultRecordings["result"]["recordings"][i]["icon"] != "") {
                            imagetag = "<img class='musicPrevPic text-center' src='" + resultRecordings["result"]["recordings"][i]["icon"] + "' />"
                        }
                        
                    }             
                    
                    //show green Tick if played before
                    if(resultRecordings["result"]["recordings"][i]["playcount"]>0 && resultRecordings["result"]["recordings"][i]["playcount"] !== undefined){
                        seenAndResume += "<i class='icon-check green'></i> ";
                    }

                    if(resultRecordings["result"]["recordings"][i]["resume"] !== undefined && resultRecordings["result"]["recordings"][i]["resume"]["position"]>0){
                        resume = resultRecordings["result"]["recordings"][i]["resume"]["position"];
                        seenAndResume += "<i class='icon-clock-o orange'></i> ";
                    }
                                        
                    if(resultRecordings["result"]["recordings"][i]["season"] != -1 && resultRecordings["result"]["recordings"][i]["episode"] != -1) {
                        if (resultRecordings["result"]["recordings"][i]["season"] == -1) {showTitle += " (" + resultRecordings["result"]["recordings"][i]["episode"] + ")"}
                        else if (resultRecordings["result"]["recordings"][i]["episode"] == -1) {showTitle += " (" + resultRecordings["result"]["recordings"][i]["season"] + ")"}
                        else {showTitle += " (" + resultRecordings["result"]["recordings"][i]["season"] + "x" + resultRecordings["result"]["recordings"][i]["episode"] + ")"}
                    }
                    
                    if(resultRecordings["result"]["recordings"][i]["showtitle"] != ""){
                        showTitle = "<p>" + resultRecordings["result"]["recordings"][i]["showtitle"] + showTitle + "</p>";
                    }
                    
                    recordingid = resultRecordings["result"]["recordings"][i]["recordingid"];
                    recordedItem = 
            
                            
                    $("#topPvrTVRecordings").append(
                        "<a class='pvrTVopenRecording' data-yPVRRecordingID='" + recordingid + "' tabindex='1'>"
                            +"<div>"
                                + imagetag
                            + "</div>"
                            + "<div>" 
                                + "<h4>" + seenAndResume + resultRecordings["result"]["recordings"][i]["title"] + "</h4>" 
                                + showTitle
                                + "<p>"
                                    + resultRecordings["result"]["recordings"][i]["starttime"].split(' ')[0] + " " 
                                    + ((parseInt(resultRecordings["result"]["recordings"][i]["starttime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24)  
                                    + ":" + resultRecordings["result"]["recordings"][i]["starttime"].split(' ')[1].split(":")[1] 
                                    + " - " 
                                    + ((parseInt(resultRecordings["result"]["recordings"][i]["endtime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24) 
                                    + ":" + resultRecordings["result"]["recordings"][i]["endtime"].split(' ')[1].split(":")[1]  
                                + "</p>"     
                            + "</div>"
                        +"</a>"
                    ).trigger("create");   
                }
            }
        );  
    },
    /*
     * creates/updates 10 most recent used PVR Radio channels
     */
    updateRecentPVRRadio: function() {
        
        yCore.sendJsonRPC(
            'getPVR-ChannelGroups',
            '{"jsonrpc": "2.0", "id": 1, "method": "PVR.GetChannelGroups", "params":{"channeltype":"radio"} }',
            function(resultgetChannelGroups){
                var ChannelGroupID = resultgetChannelGroups["result"]["channelgroups"][0]["channelgroupid"];
               
                yCore.sendJsonRPC(
                    'getPVR-Channels',
                    '{"jsonrpc": "2.0", "id": 1, "method": "PVR.GetChannels", "params":{"channelgroupid" : ' + ChannelGroupID +', "properties":["thumbnail", "lastplayed", "broadcastnow", "broadcastnext"], "limits": { "start" : 0, "end": 10 }} }',
                    function(resultgetChannels){
                        $("#topPvrRadio").empty();
                        
                        for (var i = 0; i < resultgetChannels["result"]["limits"]["end"]; i++) {
                            var title =  " ? ";
                            var nextTitle =  " ? ";
                            var percentage = false;
                            var percentageBar = "";
                            var episodename = "";
                            var year = "";
                            var imagetag = "";
                            var timeLeft = "";
                        
                            if(!yS.yS.hidePrevPics){
                                imagetag = yTools.imageUrlNormalizer(
                                                    resultgetChannels["result"]["channels"][i]["thumbnail"],
                                                    "?",
                                                    "tag",
                                                    "musicPrevPic text-center",
                                                    ""
                                                );
                            }
                            
                            if(resultgetChannels["result"]["channels"][i].hasOwnProperty("broadcastnext")){
                                nextTitle = resultgetChannels["result"]["channels"][i]["broadcastnext"]["title"];
                            }

                            if(resultgetChannels["result"]["channels"][i].hasOwnProperty("broadcastnow")){
                                title = resultgetChannels["result"]["channels"][i]["broadcastnow"]["title"];
                                percentage = resultgetChannels["result"]["channels"][i]["broadcastnow"]["progresspercentage"];
                                episodename = " • <i>" + resultgetChannels["result"]["channels"][i]["broadcastnow"]["episodename"] + "</i>";
                                if (resultgetChannels["result"]["channels"][i]["broadcastnow"]["year"] != 0){
                                    year = "</i> (" + resultgetChannels["result"]["channels"][i]["broadcastnow"]["year"] + ")</i>";
                                }   
                                timeLeft = resultgetChannels["result"]["channels"][i]["broadcastnow"]["runtime"] - Math.round(resultgetChannels["result"]["channels"][i]["broadcastnow"]["runtime"] / 100 * resultgetChannels["result"]["channels"][i]["broadcastnow"]["progresspercentage"]);                         
                            }
                        
                            if (percentage) {
                                percentageBar = "<div class='percentageBar'><div class='percentageBarInside' style='width:" +percentage+ "%'></div></div>";
                            }
                            
                            $("#topPvrRadio").append(
                                "<a class='PvrTVopenChannel'"
                                    + " data-yPVRChannelID='" + resultgetChannels["result"]["channels"][i]["channelid"]
                                + "' tabindex='1'>"
                                    +"<div class='prevPicContainerSeries'>"
                                        + imagetag
                                    + "</div>"
                                    + "<div>"
                                        + "<p>"+ resultgetChannels["result"]["channels"][i]["label"] + "</p>"
                                        + "<h4>" + title + episodename + year + "</i></h4>"
                                        + percentageBar
                                        + "<p>" + $.t("pvr-next", {yNextBroadcast: nextTitle, yTimeLeft: timeLeft}) + "</p>"    
                                    + "</div>"
                                +"</a>"
                            ).trigger("create");
                            
                        }
                    });
                
            });
    },
    /*
     * creates/updates 10 most listened albums
     */
    updateMostPlayedAlbum: function() {
        yCore.sendJsonRPC(
            'getMostPlayedAlbum',
            '{"jsonrpc":"2.0","method":"AudioLibrary.GetAlbums","id":"1","params":[["title","artist","thumbnail"], {"start":0,"end":10}, {"order": "descending", "method": "playcount"}]}',
            function(resultGetMostPlayedAlbum){
                $("#topMusic").empty() 
                //if there is nothing in the library hide menu item and collapsible on startpage
                //also discount the header item to set later appropriate width
                if(resultGetMostPlayedAlbum["result"]["limits"]["end"] == 0){
                    $(".h-music").remove();
                    $("#mostPlayedAlbum").hide();
                } else {
                    for (var i = 0; i < resultGetMostPlayedAlbum["result"]["limits"]["end"]; i++) {
                        var imagetag = "";
                        if(!yS.yS.hidePrevPics){
                            imagetag = yTools.imageUrlNormalizer(
                                                resultGetMostPlayedAlbum["result"]["albums"][i]["thumbnail"],
                                                "?",
                                                "tag",
                                                "musicPrevPic text-center",
                                                ""
                                            );
                        }

                        $("#topMusic").append(
                            "<a class='showAlbum recentAlbum' data-yAlbumID='" + resultGetMostPlayedAlbum["result"]["albums"][i]["albumid"] + "'>"
                                +" <div class='' data-yAlbumID='" + resultGetMostPlayedAlbum["result"]["albums"][i]["albumid"] + "'>"
                                    + "<span class='prevPicContainerMusic'>"
                                    + imagetag
                                    + "</span>"
                                    + "<div>"
                                    + "<h4>" + resultGetMostPlayedAlbum["result"]["albums"][i]["title"] + "</h4>"
                                        +" <p class='musicListArtist'>" +  resultGetMostPlayedAlbum["result"]["albums"][i]["artist"] + "</p>"
                                    + "</div>"
                                + "</div>"
                            +"</a>"
                        ).trigger("create");
                    }
                }
            }
        );
    },
    /*
     * creates/updates 10 most used addons
     */
    updateTopAddons: function() {
        var addonopenslist = [];
        if(yS.yS.libAddons !== undefined) {
            $.each( yS.yS.libAddons, function(key, value) {
                addonopenslist.push({0:key, 1:yS.yS.libAddons[key].opens});
            });
        }

        //sort the array and take the onces with the top 10 opens
         addonopenslist = addonopenslist.sort(function(a, b) { return a[1] < b[1] ? 1 : -1; });

         $("#topAddons").empty();
        for (var j=0;j < 10; j++){
            if(addonopenslist[j] !== undefined) {
                yCore.sendJsonRPC(
                    'getTopAddons',
                    '{"jsonrpc":"2.0","method":"Addons.GetAddonDetails","id":1,"params":{"addonid":"' + addonopenslist[j][0] +'", "properties": ["name", "thumbnail"]}}',
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
    },
    /*
     * creates link to all Favourites and updates Top 9 Favourites
     */
    updateFavourites: function() {
        
        $("#topFavs").empty()
 
        if (yLib.favourites.length == 0) {
            $(".h-fav").remove();
            $("#topFavs").hide();
        }
        else {
            for(var i = 0; (i < 10 && i < yLib.favourites.length); i++) {

                var pathToFileOrPlace = "";
                if(yLib.favourites[i]["type"] == "window"){
                    pathToFileOrPlace = yLib.favourites[i]["windowparameter"];
                } else if(yLib.favourites[i]["type"] == "media") {
                    pathToFileOrPlace = yLib.favourites[i]["path"];
                }

                //replace all backslashes with double backslashes
                pathToFileOrPlace = pathToFileOrPlace.replace(/\\/g,"\\\\");

                var imagetag = "";
                if(!yS.yS.hidePrevPics){
                    imagetag = yTools.imageUrlNormalizer(
                                yLib.favourites[i]["thumbnail"],
                                yLib.favourites[i]["type"],
                                "tag",
                                "musicPrevPic text-center",
                                "",
                                true //direct Link
                            );
                }

                $("#topFavs").append(
                    "<a class='showAddonDirItem'"
                        + " data-yAddonFile='" + pathToFileOrPlace
                        + "' data-yAddonFileType='" + yLib.favourites[i]["type"]
                        + "' data-yAddonFileResume='0"
                        + "' data-yAddonIsBack='' data-yAddonFanartPath='"
                        + yTools.imageUrlNormalizer(yLib.favourites["thumbnail"], yLib.favourites[i]["type"])
                    + "' tabindex='1'>"
                        +"<span class='prevPicContainerMusic'>"
                            + imagetag
                        + "</span>"
                        + "<h4>" + yLib.favourites[i]["title"] + "</h4>"
                            + "</div>"
                        +"</div>"
                    +"</a>"
                ).trigger("create");
            }
        }
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
    
  $("#playPlaylist").button();
    
  if(yCore.activePlayer != -1){ //if there is an active Player, activate according playlist
    $("input[name='plType']").filter('[value=' + yCore.activePlayer + ']').prop('checked', true);
  } else {//else take the music playlist
    $("input[name='plType']").filter('[value=0]').prop('checked', true);
  }

  $(".plRadio").checkboxradio("refresh"); //refresh plType after setting it

  yPl.getPlaylist();

  $('#cpl').change(function() {
    //browse given playlist and add all items to playlist 

    yCore.sendJsonRPC(
      'BrowseCustomPlaylist',
      '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params": ["' + $(this).val() + '"], "id": 1 }',
      function(browseCustomPlaylist){

        var addToPlTokens = [];
        for(var i = 0; i < (browseCustomPlaylist["result"]["limits"]["end"]); i++){
                addToPlTokens.push('{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : ' 
                +  $("input[name='plType']:checked").val() + ' , "item" : {"file" : "' 
                            + browseCustomPlaylist["result"]["files"][i]["file"] + '"}}, "id": 1}');
        }
        var addToPl = addToPlTokens.join(', ');
        yCore.sendJsonRPC(
                'AddCustomPlaylistItems',
                '[' + addToPl + ']',
            ''
                );
        }
    );
    
    setTimeout(function(){yPl.getPlaylist();}, 500);

  });

  $('.plRadio').click(function(e){
    e.stopImmediatePropagation();
    yPl.getPlaylist();
  });

  $("body").delegate("#playPlaylist", "click", function(e){
    yPl.playPlaylist();
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
playPlaylist: function () {
  $('#playPlaylist').text($.t("loading")).button("refresh");
  setTimeout(function(){$('#playPlaylist').text($.t("play-pl")).button("refresh");}, 1500);
  yCore.sendJsonRPC(
    'PlayerOpen',
    '{ "jsonrpc": "2.0", "method": "Player.Open", "params": {"item":{"playlistid":' + $("input[name='plType']:checked").val()
            +'}}, "id": 1 }',
    ''
  );
},
getPlaylist: function(){
  $("#loading_pl").show();

  $('#cpl')
    .find('option')
    .remove()
    .end()
    .append('<option value="" selected="selected">' + $.t("add-custom-playlist") + '</option>')
    .val('')
  ;


  var whichPlaylist = "special://musicplaylists";
  if ($("input[name='plType']:checked").val() == 1){
whichPlaylist = "special://videoplaylists";
  }
  yCore.sendJsonRPC(//get musicplaylists from userdata and add to select field in playlist
    'getCustomPlaylists',
    '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params": ["' + whichPlaylist + '"], "id": 1}',
    function(resultgcp){
for(var i = 0; i < (resultgcp["result"]["limits"]["end"]); i++){
        $('#cpl').append("<option value='" + resultgcp["result"]["files"][i]["file"] + "'>" + resultgcp["result"]["files"][i]["label"] + "</option>");
}
      $('#cpl').selectmenu('refresh');
    }
  );
  $('#cpl').selectmenu('enable');

  if($(location).attr('hash') != "#pl"){return true;} //don't get playlist if not on playlist page

  $("#currentplaylist").empty();
  var currentPlayingtitle = "";
  var currentPlayingSpeed = "";
  var isPlaying = "";

  yCore.sendJsonRPC(  //get playing title
    'GetItem-yPL-Player-currenttitle',
    '{ "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": '+ $("input[name='plType']:checked").val()
            +', "properties": ["title","file"] }, "id": 1 }',
    function(resultGetItem){
      if(!("error" in resultGetItem)){
        currentPlayingtitle = resultGetItem["result"]["item"]["file"];
      }
    }
  );

  yCore.sendJsonRPC(  //get playing speed
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

          var duration = ""; 
          if(resultPl["result"]["items"][i]["duration"] !== undefined){
              duration = Math.floor(resultPl["result"]["items"][i]["duration"] / 60) 
                            + ":" 
                            //seconds 
                            + yTools.addZeroTwoDigits(resultPl["result"]["items"][i]["duration"] - (Math.floor(resultPl["result"]["items"][i]["duration"] / 60) ));
          }


    if(resultPl["result"]["items"][i]["id"]){
      $("#currentplaylist").append(
        "<li class='plItem simpleList yListItem' data-yplnr='" + i + "' data-songid="+ resultPl["result"]["items"][i]["id"] +">"
                          + "<div class='simpleListPrevPicContainer'>" + imagetag + "</div>"
                          + "<span class='bold' >" + isPlaying + duration + "</span> "
                          + "<span>" + resultPl["result"]["items"][i]["title"] + "</span>"
                          + "<span class='italic'>(" + resultPl["result"]["items"][i]["artist"]  + ")</span>"
                          + "<span class='buttonRight'>"
                              + "<button class='plRemove' data-yplnr='" + i + "' data-inline='true' data-theme='b' data-mini='true'>"
                                  + "<i class='icon-times'></i> "
                              + "</button>"
                          + "</span>"
        + "</li>"
      ).trigger("create");
    } else { //if its a file not a song from library
      $("#currentplaylist").append(
        "<li class='plItem simpleList yListItem' data-yplnr='" + i + "' data-songid=''>"
                          + "<div class='simpleListPrevPicContainer'>" + imagetag + "</div>"
                          + "<span class='bold' >" + isPlaying + "</span> "
                          + "<span>" + resultPl["result"]["items"][i]["label"] + "</span>"
                          + "<span class='buttonRight'>"
                              + "<button class='plRemove' data-yplnr='" + i + "' data-inline='true' data-theme='b' data-mini='true'>"
                                  + "<i class='icon-times'></i> "
                              + "</button>"
                          + "</span>"
        + "</li>"
      ).trigger("create");
    }
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
            
            var runtime = ""; 
            if(resultPl["result"]["items"][i]["runtime"] !== undefined){
                runtime = Math.floor(resultPl["result"]["items"][i]["runtime"] / 60) 
                  + ":" 
                  //seconds 
                  + yTools.addZeroTwoDigits(resultPl["result"]["items"][i]["runtime"] - (Math.floor(resultPl["result"]["items"][i]["runtime"] / 60) ));
            }

            var title = resultPl["result"]["items"][i]["title"];
            if(resultPl["result"]["items"][i]["title"] == ""){
               title = resultPl["result"]["items"][i]["file"].replace(/^.*\/(?=[^\/]*$)/, '');;
            }

            //if tv show add show info (has to be if/else because negative if does not work)
            var show = "";
            if(resultPl["result"]["items"][i]["showtitle"] === undefined || resultPl["result"]["items"][i]["showtitle"] == "" ){
              show = "";
            } else {
                show =  "<span class='italic'> ("
                            + resultPl["result"]["items"][i]["showtitle"]  + " "
                            + resultPl["result"]["items"][i]["season"] + "x" + resultPl["result"]["items"][i]["episode"]
                        + ")</span>";
            }

            $("#currentplaylist").append(
              "<li class='plItem simpleList yListItem' data-yfilepath='" + resultPl["result"]["items"][i]["file"]
                + "' data-yplnr='" + i + "'>"
                + "<div class='simpleListPrevPicContainer'>" + imagetag + "</div>"
                + "<span class='bold'>" + isPlaying + runtime + "</span>"
                + "<span>" + seen + title + show +"</span>"
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
genres: [],
languages: [],
initDone: false,
listPos: 0,
listLength: 0,
lastListItem: 0,
firstListItem: [0],
currentMovieList: [],
init: function() {

    if (!yMovies.initDone){  //that it doesn't run twice  
        yMovies.initDone = true;
        $("#movieDetailsAddPl").button().unwrap();
    
        $("#movieDetailsPrev").button().unwrap();
        $("#movieDetailsNext").button().unwrap();
        $("#movieDetailsTrailer").button();
        $("#movieDetailsPlayMovie").button();
        
        if(yS.yS.hideDirectorMovies){$("#directorSelect").parent().hide();} //hide director selection field if set in settings
        if(yS.yS.hideActorMovies){$("#actorSelect").parent().hide();} //hide actor selection field if set in settings
        if(yS.yS.hideGenreMovies){$("#genreSelect").parent().hide();} //hide  genre selection  field if set in settings
        if(yS.yS.hideLanguageMovies){$("#languageSelect").parent().hide();} //hide language selection field if set in settings
        if(yS.yS.hideSearchMovies){$("#searchMovies").parent().hide();} //hide movieSearch field if set in settingsy
        
        //set the selectbox according to setting
        $("#genreSelect").val(yS.yS.moviePageSettings.genreSelect);
        $('#genreSelect').selectmenu('refresh');

        $("#languageSelect").val(yS.yS.moviePageSettings.languageSelect);
        $('#languageSelect').selectmenu('refresh');

        $("#directorSelect").val(yS.yS.moviePageSettings.directorSelect);
        $('#directorSelect').selectmenu('refresh');

        $("#actorSelect").val(yS.yS.moviePageSettings.actorSelect);
        $('#actorSelect').selectmenu('refresh');   
        
        $("#movie_list").on( "swipeleft swiperight",  function( e ) { 
            if (e.type === "swipeleft" && $("#movie-flex-next").is(':visible')) {
                e.stopImmediatePropagation();
                yMovies.movieListNext();
            } else if (e.type === "swiperight" && $("#movie-flex-prev").is(':visible')) {
                e.stopImmediatePropagation();
                yMovies.movieListPrev();
            }
        });
        
        $("body").delegate("#clearMovieSearch", "click", function(e){
            e.stopImmediatePropagation();
            yMovies.clearSearchesExcept();
            yMovies.newMovieList(
                false,
                "all",
                "all",
                "",
                "all",
                "all"
            );
        });
        
        $("body").delegate(".openMovieItem", "click", function(e){  //set movie information in details
            e.stopImmediatePropagation();
            yMovies.openMovieItem($(this).attr('data-yMovieId'));
        });

        $("body").delegate("#movieDetailsPlayMovie", "click", function(e){ //start movie
            e.stopImmediatePropagation();
            yMovies.playMovie($(this).attr('data-yMovieArrayNr'));
        });

        $("body").delegate("#movieDetailsAddPl", "click", function(e){
            e.stopImmediatePropagation();
            yMovies.addMovieToPlaylist($(this).attr('data-yMovieID'));
            $("#movieDetailsAddPl").button('disable'); //init of button and get rid of div around (created by buton() )
        });

        $("body").delegate("#movieDetailsTrailer", "click", function(e){ //start trailer to movie
            e.stopImmediatePropagation();
            yMovies.startMovieTrailer($(this).attr('data-yMovieArrayNr'));
        });

        $("body").delegate(".moviedirector", "click", function(e){ //start trailer to movie
            e.stopImmediatePropagation();
            
            yMovies.clearSearchesExcept("directorSelect");
            $("#directorSelect").val($(this).attr('data-yDirectorName'));
            $("#directorSelect").selectmenu('refresh');
            
            yMovies.newMovieList(
                false,
                "all",
                "all",
                "",
                $(this).attr('data-yDirectorName'),
                "all"
            );
            $.mobile.navigate("#movies");
        });

        $("body").delegate(".movieactor", "click", function(e){ //start trailer to movie
            e.stopImmediatePropagation();
            
            yMovies.clearSearchesExcept("actorSelect");
            $("#actorSelect").val($(this).attr('data-yActorName'));
            $("#actorSelect").selectmenu('refresh');
            
            yMovies.newMovieList(
                false,
                "all",
                "all",
                "",
                "all",
                $(this).attr('data-yActorName')
            );
            $.mobile.navigate("#movies");
        });

        $("body").delegate(".ShowAllActors", "click", function(e){ //start trailer to movie
            e.stopImmediatePropagation();
            $(".movieactor").removeClass('displayNone');
            $(this).remove();
        });

        $("#searchMovies").keyup(function() {
            $('#movie_list').empty(); //empty ul to update list with new choices
            $("#movie-flex-prev").empty();
            $("#movie-flex-next").empty();
            yMovies.firstListItem = [0]; //to get track of what was search to go back with button
            yMovies.newMovieList(
                false,
                $('#genreSelect option:selected').attr('value'),
                $('#languageSelect option:selected').attr('value'),
                $("#searchMovies").val(),
                $('#directorSelect option:selected').attr('value'),
                $('#actorSelect option:selected').attr('value')
            );
        });

        $("body").delegate("#movieListPrev", "click", function(e){
            e.stopImmediatePropagation();
            yMovies.movieListPrev();
        });

        $("body").delegate("#movieListNext", "click", function(e){
            e.stopImmediatePropagation();
            yMovies.movieListNext();
        });

        $("body").delegate("#movieDetailsPrev", "click", function(e){
            e.stopImmediatePropagation();
            yMovies.openMovieItem($(this).attr('data-yMoviePrevID') );
        });

        $("body").delegate("#movieDetailsNext", "click", function(e){
        e.stopImmediatePropagation();
        yMovies.openMovieItem($(this).attr('data-yMovieNextID') );
        });

        $("#movieDetails").on( "swipeleft swiperight",  function( e ) {
            if (e.type === "swipeleft" && $("#movieDetailsNext").attr('data-yMovieNextID') != "") {
                e.stopImmediatePropagation();
                yMovies.openMovieItem($("#movieDetailsNext").attr('data-yMovieNextID'));
            } else if (e.type === "swiperight" && $("#movieDetailsPrev").attr('data-yMoviePrevID') != "") {
                e.stopImmediatePropagation();
                yMovies.openMovieItem($("#movieDetailsPrev").attr('data-yMoviePrevID'));
            }
        });

        $("body").delegate("#toggleMovieSeen", "click", function(e){
            yCore.sendJsonRPC(
                'toggleMovieSeen',
                '{"jsonrpc":"2.0","method":"VideoLibrary.SetMovieDetails","params":{"movieid":' + $("#toggleMovieSeen").attr('data-yMovieId') + ',"playcount":1},"id":1}',
                function(){
                    yMovies.openMovieItem($("#toggleMovieSeen").attr('data-yMovieId'));
                }
            );  
        });

        $("body").delegate("#toggleMovieUnSeen", "click", function(e){
            yCore.sendJsonRPC(
                'toggleMovieUnSeen',
                '{"jsonrpc":"2.0","method":"VideoLibrary.SetMovieDetails","params":{"movieid":' + $("#toggleMovieUnSeen").attr('data-yMovieId') + ',"playcount":0},"id":1}',
                function(){
                    yMovies.openMovieItem($("#toggleMovieUnSeen").attr('data-yMovieId'));
                }
            );        
        });

        $("#movieDetailsClose").click(function(e) {
            e.stopImmediatePropagation();
            window.history.back();
        });
        
        yMovies.newMovieList(
            false,
            $('#genreSelect option:selected').attr('value'),
            $('#languageSelect option:selected').attr('value'),
            $("#searchMovies").val(),
            $('#directorSelect option:selected').attr('value'),
            $('#actorSelect option:selected').attr('value')
        );
    }
  },
  /*
   * function to clear search selects and textfield and refreshes them
   * an exception (exc) is possible
   */
  clearSearchesExcept: function(exc){
    if(exc != "directorSelect" || exc !== undefined){
            $("#directorSelect").val("all");
            $("#directorSelect").selectmenu('refresh');
    }
    if(exc != "actorSelect" || exc !== undefined){   
            $("#actorSelect").val("all");
            $("#actorSelect").selectmenu('refresh');
    }
    if(exc != "genreSelect" || exc !== undefined){
        $("#genreSelect").val("all");
        $("#genreSelect").selectmenu('refresh');
    }
    if(exc != "languageSelect" || exc !== undefined){
        $("#languageSelect").val("all");
        $("#languageSelect").selectmenu('refresh');
    }
    if(exc != "searchMovies" || exc !== undefined){
            $("#searchMovies").val("");
    }
    
    yS.yS.moviePageSettings.directorSelect = $("#directorSelect").val();
    yS.yS.moviePageSettings.actorSelect = $("#actorSelect").val();
    yS.yS.moviePageSettings.genreSelect = $("#genreSelect").val();
    yS.yS.moviePageSettings.languageSelect = $("#languageSelect").val();
    
    yS.saveSettingsToLocalStorage();
  },
  /*
   * function calles with the "next" button in a movie List or a swipe-left
   * prepares for next items to show from the list
   */
  movieListNext: function(){
      yMovies.listPos += yS.yS.listLength; //if one back, remove item from trail-array
      $("#movie_list").empty();
      $("#movie-flex-prev").empty();
      $("#movie-flex-next").empty();
      yMovies.printMovieList(yMovies.listPos);

      //scroll to top
      $('html,body').animate({scrollTop: $("#movies").offset().top},'fast');
  },
  /*
   * function calles with the "previous" button in a movie List or a swipe-right
   * prepares for previous items to show from the list
   */
  movieListPrev: function(){
      yMovies.listPos -= yS.yS.listLength; //if one back, remove item from trail-array
      $("#movie_list").empty();
      $("#movie-flex-prev").empty();
      $("#movie-flex-next").empty();

      yMovies.printMovieList(yMovies.listPos);

      //scroll to top
      $('html,body').animate({scrollTop: $("#movies").offset().top},'fast');
  },
  /*
   * Set information to according movie in details
   */
  openMovieItem: function(movieNr) {
      
    $("#movieDetailsAddPl").button('enable');
    $("#movieDetailsPrev").button('enable');
    $("#movieDetailsNext").button('enable');
    $("#movieDetailsFlags").show();
    $("#movieDetailsSubtitles").show();
    $("#movieDetailsDirector").show();
    $("#movieDetailsActors").show();
    
    
    for (i=0; i < yMovies.currentMovieList.length; i++){
        if(yMovies.currentMovieList[i]["movieid"] == movieNr){
            if(yMovies.currentMovieList[i-1] !== undefined){
                $("#movieDetailsPrev").attr("data-yMoviePrevID", yMovies.currentMovieList[i-1]["movieid"]);
            }
            else {
                $("#movieDetailsPrev").attr("data-yMoviePrevID", "");                    
                $("#movieDetailsPrev").button('disable');
            }
            
            if(yMovies.currentMovieList[i+1] !== undefined){
                $("#movieDetailsNext").attr("data-yMovieNextID", yMovies.currentMovieList[i+1]["movieid"]);
            }
            else {
                $("#movieDetailsNext").attr("data-yMovieNextID", "");
                $("#movieDetailsNext").button('disable');
            }
        }
    }    
    
    yCore.sendJsonRPC(
        'GetMovieDetails',
        '{"jsonrpc":"2.0","method":"VideoLibrary.GetMovieDetails","params":[' + movieNr + ',["title",'
            + '"thumbnail","playcount","resume","year","file","genre","rating","runtime","streamdetails","plot","trailer","director","cast"]],"id":"1"}',
        function(resultGetMovieDetails){
        
            movieDetails = resultGetMovieDetails["result"]["moviedetails"];
            
            if(!yS.yS.hideFileLinkMovies){
                yCore.sendJsonRPC(
                  'PrepareDownload',
                  '{"jsonrpc":"2.0","method":"Files.PrepareDownload","id":1,"params":["' + movieDetails["file"] +'"]}',
                  function(resultPrepareDownload){

                    $("#movieDetailsFilelink").attr("href", "http://" + $(location).attr('host') + "/" + resultPrepareDownload["result"]["details"]["path"]);

                    if (resultPrepareDownload["result"]["details"]["path"].match("^vfs/special")) {
                        $("#movieDetailsFilelink").hide();
                    } else {
                        $("#movieDetailsFilelink").show();
                        yCore.sendJsonRPC(
                          'getFilesize',
                          '{"jsonrpc":"2.0","id":5142812,"method":"Files.GetFileDetails","params":{"file":"'+movieDetails["file"]+'","media":"files","properties":["size"]}}',
                          function(resultgetSize){
                              $("#movieDetailsFilelink").append(" (" + yTools.sizeHumanReadable(resultgetSize["result"]["filedetails"]["size"]) + ")");
                              
                          }
                        );
                    }
                  }
                );
                $("#movieDetailsFilelink").text($.t("filelink", {yFileLink:movieDetails["file"]}));
            }            

            $('#movieDetailsPlayMovie').text($.t("play")).button("refresh");

            var md_year = movieDetails["year"];
            if(md_year > 0){md_year = " (" + md_year + ")";}else{md_year="";}

            var   md_runtime = Math.round(movieDetails["runtime"]/60);
            if (md_runtime > 0){md_runtime += "min";}else{ md_runtime = "?";}

            if(movieDetails["thumbnail"] == "" || yS.yS.hidePrevPics){
                $("#movieDetailsImage").hide();
            } else {
                $("#movieDetailsImage").attr("src", yTools.imageUrlNormalizer(movieDetails["thumbnail"],"?"));
                $("#movieDetailsImage").show();
            }

            var seenAndResume = "";
            if(movieDetails["playcount"]>0){
                seenAndResume += "<i class='icon-check-square-o green clickable' id='toggleMovieUnSeen' data-yMovieId='" + movieNr + "'></i> ";
            } else {
                seenAndResume += "<i class='icon-square-o clickable' id='toggleMovieSeen' data-yMovieId='" + movieNr + "'></i> ";    
            }
            if(movieDetails["resume"] !== undefined && movieDetails["resume"]["position"]>0){
                seenAndResume += "<i class='icon-clock-o orange'></i> ";
            }

            $("#movieDetailsTitle").html(seenAndResume + movieDetails["title"] + md_year);
            $("#movieDetailsRuntime").text($.t("runtime", {yRuntime:md_runtime}));
            
            $("#movieDetailsGenres").text($.t("genres", {yGenres: movieDetails["genre"].toString()}));
            
            if(!yS.yS.hideLanguageMovies){
                 /* for spoken languages*/

                //add flag and "language-native" to streamdetails of the yarc internal movies-array
                for (var j=0;  j < movieDetails["streamdetails"]["audio"].length; j++){//run whole kodi-language list
                    if(movieDetails["streamdetails"]["audio"][j]["language"] in langCodeToDescFlag){//if code is in json
                        var lang = movieDetails["streamdetails"]["audio"][j]["language"];
                        movieDetails["streamdetails"]["audio"][j]["native"] = langCodeToDescFlag[lang]["native"];
                        movieDetails["streamdetails"]["audio"][j]["flag"] = langCodeToDescFlag[lang]["flag"];
                        movieDetails["streamdetails"]["audio"][j]["isocode"] = langCodeToDescFlag[lang]["iso639_2"];
                    }
                }

                /*
                *  secondly, it searches for isocodes in the filename which has to be in brackets [], if there is found something, it also
                *  addes the additional data into the streamdetails-audio (yarc internal only)
                */
                if(movieDetails["file"].indexOf("[") >= 0){//if there is no starting bracket in filepath, don't even try
                    for (var code in langCodeToDescFlag) { //go trough every isocode in the list
                    if (langCodeToDescFlag.hasOwnProperty(code)) {
                        if (movieDetails["file"].toLowerCase().indexOf("[" + code + "]") >= 0) {//if code is found in filename
                        var codeIsSet = false;
                        //go trough whole streamdetails-audio list
                        for (var j=0;  j < movieDetails["streamdetails"]["audio"].length; j++){
                            //if code is already in streamdetails-audio...
                            if(langCodeToDescFlag[code]["iso639_2"] == movieDetails["streamdetails"]["audio"][j]["isocode"]){
                            codeIsSet = true;//... remeber it to...
                            }
                        }
                        if(!codeIsSet){//..not add it again to aopton list
                            var streamdet = {//prepare object to be pushed into streamdetails-audio
                                            native:langCodeToDescFlag[code].native,
                                            flag:langCodeToDescFlag[code].flag,
                                            isocode:langCodeToDescFlag[code]["iso639_2"]
                                            };
                                            movieDetails["streamdetails"]["audio"].push(streamdet);//push object above
                        }
                        }
                    }
                    }
                }
                        
                /* for subtitles*/
                //add flag and "language-native" to streamdetails of the yarc internal movies-array
                for (var j=0;  j < movieDetails["streamdetails"]["subtitle"].length; j++){//run whole kodi-language list
                    if(movieDetails["streamdetails"]["subtitle"][j]["language"] in langCodeToDescFlag){//if code is in json
                        var langSub = movieDetails["streamdetails"]["subtitle"][j]["language"];
                        movieDetails["streamdetails"]["subtitle"][j]["native"] = langCodeToDescFlag[langSub]["native"];
                        movieDetails["streamdetails"]["subtitle"][j]["flag"] = langCodeToDescFlag[langSub]["flag"];
                        movieDetails["streamdetails"]["subtitle"][j]["isocode"] = langCodeToDescFlag[langSub]["iso639_2"];
                    }
                }

                /*
                *  secondly, it searches for isocodes in the filename which has to be in brackets [], if there is found something, it also
                *  addes the additional data into the streamdetails-subtitle (yarc internal only)
                */
                if(movieDetails["file"].indexOf("[") >= 0){//if there is no starting bracket in filepath, don't even try
                    for (var code in langCodeToDescFlag) { //go trough every isocode in the list
                        if (langCodeToDescFlag.hasOwnProperty(code)) {
                            if (movieDetails["file"].toLowerCase().indexOf("[sub-" + code + "]") >= 0) {//if code is found in filename
                                var codeIsSet = false;
                                //go trough whole streamdetails-subtitle list
                                for (var j=0;  j < movieDetails["streamdetails"]["subtitle"].length; j++){
                                    //if code is already in streamdetails-subtitle...
                                    if(langCodeToDescFlag[code]["iso639_2"] == movieDetails["streamdetails"]["subtitle"][j]["isocode"]){
                                    codeIsSet = true;//... remeber it to...
                                    }
                                }
                                if(!codeIsSet){//..not add it again to aopton list
                                    var streamdet = {//prepare object to be pushed into streamdetails-audio
                                                            native:langCodeToDescFlag[code].native,
                                                            flag:langCodeToDescFlag[code].flag,
                                                            isocode:langCodeToDescFlag[code]["iso639_2"]};
                                    movieDetails["streamdetails"]["subtitle"].push(streamdet);//push object above
                                }
                            }
                        }
                    }
                }
                
                if(movieDetails["streamdetails"]["audio"].length > 0){
                    document.getElementById('movieDetailsFlags').innerHTML =  $.t("languages", {yLanguages: yTools.pathToFlags(movieDetails["streamdetails"]["audio"])});
                } 
                else {$("#movieDetailsFlags").hide();}

                if(movieDetails["streamdetails"]["subtitle"].length > 0){
                    document.getElementById('movieDetailsSubtitles').innerHTML = $.t("subtitles", {ySubtitles: yTools.pathToFlags(movieDetails["streamdetails"]["subtitle"])});
                } 
                else {$("#movieDetailsSubtitles").hide();}
                
            } 
            else {
                $("#movieDetailsFlags").hide();
                $("#movieDetailsSubtitles").hide();
            }
            
            $("#movieDetailsPlot").text(movieDetails["plot"]);
            
            $("#movieDetailsDirector").empty();
            if(movieDetails["director"].length > 0){
                $("#movieDetailsDirector").append("<span>" + $.t("director") +":&nbsp;</span>");
                for(i=0;i < movieDetails["director"].length;i++){
                    $("#movieDetailsDirector").append(
                        "<a data-yDirectorName='" + movieDetails["director"][i] + "' class='director moviedirector'>"
                            +"<div>" + movieDetails["director"][i] + "</div>"
                        +"</a>"
                    );
                }                
            }
            else {$("#movieDetailsDirector").hide();}
                        
            $("#movieDetailsActors").empty();
            if(movieDetails["cast"].length > 0){
                var moreActorsThanIwantToShow = false;
                $("#movieDetailsActors").append($.t("actors") +":&nbsp;<br />");
                for(i=0;i < movieDetails["cast"].length;i++){
                    var thumb = "";
                    if(movieDetails["cast"][i].hasOwnProperty("thumbnail")){
                        thumb = yTools.imageUrlNormalizer(movieDetails["cast"][i]["thumbnail"],"?","tag", "moviePrevPic");
                    }
                    else { thumb = "<span class='moviePrevPic centerFa icon-question'></span>";}
                    if(movieDetails["cast"][i]["order"] <= 4){
                        
                        $("#movieDetailsActors").append(
                            "<a data-yActorName='" + movieDetails["cast"][i]["name"] + "' class='actor movieactor'>"
                                +"<div>"
                                    + thumb
                                    + "<div class='text-center actorname'>" + movieDetails["cast"][i]["name"] + "</div>"
                                +"</div>"
                            +"</a>"
                        );
                    }
                    else {
                        moreActorsThanIwantToShow = true;
                        $("#movieDetailsActors").append(
                            "<a data-yActorName='" + movieDetails["cast"][i]["name"] + "' class='actor movieactor displayNone'>"
                                +"<div>"
                                    + thumb
                                    + "<div class='text-center actorname'>" + movieDetails["cast"][i]["name"] + "</div>"
                                +"</div>"
                            +"</a>"
                        );
                        
                    }
                }  
                if(moreActorsThanIwantToShow){
                    $("#movieDetailsActors").append(
                        "<a data-yActorName='all' class='actor ShowAllActors'>"
                            +"<div>"
                                + "<span class='moviePrevPic'>...</span>"
                                + "<div class='text-center actorname'>" + $.t("show-all-actors") + "</div>"
                            + "</div>"
                        +"</a>"
                    );
                }
            }
            else {$("#movieDetailsActors").hide();}
            
            
            if(movieDetails["trailer"] == ""){ //if there is an empty trailer string
                $("#movieDetailsTrailer").parent().hide();
            } else {
                $("#movieDetailsTrailer").attr("data-yMovieArrayNr", movieNr);
                $("#movieDetailsTrailer").parent().show();
            }

            $("#movieDetailsPlayMovie").attr("data-yMovieArrayNr", movieNr);
            $("#movieDetailsAddPl").attr("data-yMovieID", movieDetails["movieid"]);
        }
     );
        
    //push new histroy element so that #movies ist the latest back position
    $.mobile.navigate("#movieDetails");
  },
  /*
   * Function who runs in the beginning of yMovie pageload or if new movielist is desired
   * first a copy of object with all movies and it's infos is created
   * then movies which are not wanted are taken out of the object
   */
  newMovieList: function(isReturnList, genre, language, searchval, director, actor, unseen) {  //create movielist in DOM
     
    var tempMovieList = JSON.parse(JSON.stringify(yLib.movies)); 
        
    //all movies
    for (var i = tempMovieList.length - 1; i >= 0; i--) {
        if (yS.yS.hideWatched || unseen) {
            if (tempMovieList[i]["playcount"] > 0) {
                tempMovieList.splice(i,1); 
                continue;
            }
        }
        
        if (genre !== "all") {
            if(tempMovieList[i]["genre"].indexOf(genre) == -1) {
                tempMovieList.splice(i,1); 
                continue;
            }
        }
        
        if (tempMovieList[i]["title"].toLowerCase().indexOf(searchval.toLowerCase()) < 0) {
                tempMovieList.splice(i,1); 
                continue;
        }
        
        //later in process since it needs a bit more power to querry, 
        if (language !== "all") {   
            var isInList = false;
            for (var k=0;  k < tempMovieList[i]["streamdetails"]["audio"].length; k++){//go trough whole audio info's
                if(tempMovieList[i]["streamdetails"]["audio"][k]["isocode"] == language){
                    isInList = true;
                }
            }
            
            if (!isInList) {
                tempMovieList.splice(i,1); 
                continue; 
            }
        }
 
        if (director !== "all") {
            var isInList = false;
            for (var j=0; j < tempMovieList[i]["director"].length; j++){
                if(tempMovieList[i]["director"][j] == director){
                    isInList = true;
                }
            }
            if (!isInList) {
                tempMovieList.splice(i,1); 
                continue; 
            }
        }
        
        if (actor !== "all") {
            var isInList = false;
            for (var j=0; j < tempMovieList[i]["cast"].length; j++){
                if(tempMovieList[i]["cast"][j]["name"] == actor){
                    isInList = true;
                }
            }
            if (!isInList) {
                tempMovieList.splice(i,1); 
                continue; 
            }
        }   
    }
    if(isReturnList) {return tempMovieList;}
    else {
        yMovies.currentMovieList = tempMovieList;
        yMovies.printMovieList(0);
    }
  },
  
  /*
   * Function who runs in the beginning or if movielist changes
   * and creates items in the list according to settings:
   * which genre, which language, which search list term, what part of the list, if listitems per page reduced
   */
  printMovieList: function(listStart) { 
      
    $("#movie_list").empty();
    
    yMovies.listPos = listStart; //needed, that in initialisation by restriction, list starts at 0, but not if next or prev button
    
      //only show back button if it is not the start of the list
    if(yMovies.listPos != 0){
        $("#movie-flex-prev").append(
            "<a id='movieListPrev' data-yMovieId='movieListPrev' class='flexListPrevNext'>"
            +"<span class='icon-arrow-left prev-next-arrow'></span>"
            +"</a>"
        );
        $("#movie-flex-prev").show();
    }
    else {$("#movie-flex-prev").hide();}
    
    var lastPosAndlistLength = 0;
    //Nedded so that when a movielist is smaller than listlength set in settings there are reduced cycles in for loop
    if(yMovies.currentMovieList.length < yMovies.listPos+yS.yS.listLength){
        lastPosAndlistLength = yMovies.currentMovieList.length;
    }
    else {lastPosAndlistLength = yMovies.listPos+yS.yS.listLength;}
    
    for (var i = yMovies.listPos; i < lastPosAndlistLength; i++) {
        
        var m_runtime = Math.round(yMovies.currentMovieList[i]["runtime"]/60);
        if (m_runtime > 0){m_runtime += "min";}else{ m_runtime = "?";} //makes runtime string if aviable

        var m_year = yMovies.currentMovieList[i]["year"];
        if (m_year < 1){m_year = "?";} //makes year string if unaviable

        var seenAndResume = "";
        if(yMovies.currentMovieList[i]["playcount"]>0){
            if(yS.yS.hideWatched){continue;}//if setting says to not show seen movies, go to next iteration
            seenAndResume += "<i class='icon-check green'></i> ";
        }

        if(
            yMovies.currentMovieList[i]["resume"] !== undefined
            && yMovies.currentMovieList[i]["resume"]["position"]>0
        ){
            seenAndResume += "<i class='icon-clock-o orange'></i> ";
        }

        if(!yS.yS.hideLanguageMovies){
            flags =  yTools.pathToFlags(yMovies.currentMovieList[i]["streamdetails"]["audio"]);
        } else {
            flags = "";
        }
                
        $("#movie_list").append(
            "<a class='openMovieItem movieItem' data-yMovieId='" + yMovies.currentMovieList[i]["movieid"] + "'>"
                + "<div class='prevPicContainerMovie'>"
                    + yTools.imageUrlNormalizer(
                        yMovies.currentMovieList[i]["art"]["poster"],
                        "?",
                        "tag",
                        "moviePrevPic centerFa ",
                        ""
                    )
                + "</div>"
                + "<div>"
                    + "<h4>" + seenAndResume + yMovies.currentMovieList[i]["title"] + "</h4>"
                    + "<p><span class='movieYear'>" + $.t("year", {yYear: m_year}) + "  </span>" + $.t("runtime", {yRuntime:m_runtime}) + "</p>"
                    + "<p>" + yTools.ratingToStars(yMovies.currentMovieList[i]["rating"]) + "</p>"
                    + "<p>" + flags + "</p>"
                + "</div>"
            +"</a>"
        );        
    }
    
    
    if(yS.yS.hidePrevPics){$("#movie_list .moviePrevPic").remove();} //hide previmage if set in settings
    
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
                + movieNr
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
                    + movieNr + ' }, "options":{ "resume": ' + answer + ' } }, "id": 1 }',
                    function(){
                        $('#movieDetailsPlayMovie').text($.t("play")).button("refresh"); // change button text because of long JSON Call time
                    }
                );
                yRemote.updateLastPlayingFile("movieID",movieNr);
            }
    );
  },
  /*
   * called to add movie to playlist
   */
  addMovieToPlaylist: function(movieid){
    yCore.sendJsonRPC(
      'PlaylistAdd',
      '{ "jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 1 ,  "item": { "movieid":  ' + movieid + ' } }, "id": 1 }',
      ''
    );
  },
  /*
   * watch trailer for movie
   */
  startMovieTrailer: function(movieid){
    $('#movieDetailsTrailer').text($.t("loading")).button("refresh"); // change button text because of long JSON Call time
    
    var movieTrailerPath = "";
    
    for (i = 0; i < yLib.movies.length ; i++) {
        if (yLib.movies[i]["movieid"] == movieid) {
            movieTrailerPath = yLib.movies[i]["trailer"];
            break;
        }
    }
        
    yCore.sendJsonRPC(
        'PlayerOpen',
        '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "'
            + movieTrailerPath + '" } }, "id": 1 }',
        function() {
            $('#movieDetailsTrailer').text($.t("trailer")).button("refresh");
            
            if (movieTrailerPath == ""){
                $('#ySpeechAction').empty();       
                $("#ySpeechAction").append($.t("no-matching") + " ").css("color", "red");  
            }
        }
    );
    yRemote.updateLastPlayingFile("file",movieTrailerPath);
  },
  /*
   * Find closest Director name in yLib.movieDirector compared to string and return the name from yLib.movieDirector
   */
  searchClosestDirectorNameInYLib: function(director){      
    var lowestIterationOfAll = 999999999999;
    var bestMatch = "";
    
    for(var i = 0; i < yLib.movieDirector.length; i++) {
        iterationsNeeded = yTools.damerauLevenshtein(director.toLowerCase(), yLib.movieDirector[i].toLowerCase());
        if(lowestIterationOfAll > iterationsNeeded){
            bestMatch = yLib.movieDirector[i];
            lowestIterationOfAll = iterationsNeeded;
        }
    }
    
    return bestMatch;               
  },
  /*
   * Find closest Actor name in yLib.movieCast compared to string and return the name from yLib.movieCast
   */
  searchClosestActorNameInYLib: function(actor){      
    var lowestIterationOfAll = 999999999999;
    var bestMatch = "";
    
    for(var i = 0; i < yLib.movieCast.length; i++) {
        iterationsNeeded = yTools.damerauLevenshtein(actor.toLowerCase(), yLib.movieCast[i].toLowerCase());
        if(lowestIterationOfAll > iterationsNeeded){
            bestMatch = yLib.movieCast[i];
            lowestIterationOfAll = iterationsNeeded;
        }
    }
    
    return bestMatch;   
  },
  /*
   * Find closest Genre (Tag)  inyLib.movieGenres compared to string and return the genre from yLib.movieGenres
   */
  searchClosestGenreNameInYLib: function(genre){      
    var lowestIterationOfAll = 999999999999;
    var bestMatch = "";
    
    for(var i = 0; i < yLib.movieGenres.length; i++) {
        iterationsNeeded = yTools.damerauLevenshtein(genre.toLowerCase(), yLib.movieGenres[i].toLowerCase());
        if(lowestIterationOfAll > iterationsNeeded){
            bestMatch = yLib.movieGenres[i];
            lowestIterationOfAll = iterationsNeeded;
        }
    }
    
    return bestMatch;
  },
  /*
   * Find closest Langage name in English in langCodeToDescFlag compared to string and return the genre from langCodeToDescFlag
   */
  searchClosestLanguageNameInYLib: function(language){      
    var lowestIterationOfAll = 999999999999;
    var bestMatch = "";
    
    for(var i = 0; i < yLib.movieLanguage.length; i++) {
        iterationsNeeded = yTools.damerauLevenshtein( language.toLowerCase(), langCodeToDescFlag[yLib.movieLanguage[i]]["english"].toLowerCase() );
        if(lowestIterationOfAll > iterationsNeeded){
            bestMatch = yLib.movieLanguage[i];
            lowestIterationOfAll = iterationsNeeded;
        }
    }
    
    return bestMatch;
  },
  /*
   * Find closest Movie title name yLib.movies compared to string and return its  Kodi movie ID
   */
  searchClosestMovieNameInYLib: function(movieName){      
    var lowestIterationOfAll = 999999999999;
    var bestMatch = "";
    
    for(var i = 0; i < yLib.movies.length; i++) {
        iterationsNeeded = yTools.damerauLevenshtein( movieName.toLowerCase(), yLib.movies[i]["title"].toLowerCase() );
        if(lowestIterationOfAll > iterationsNeeded){
            bestMatch = yLib.movies[i]["movieid"];
            lowestIterationOfAll = iterationsNeeded;
        }
    }
    
    return bestMatch;
  }
}


var yMovieSets = {
initDone: false,
init: function() {  
    if (!yMovieSets.initDone){  //that it doesn't run twice  
        yMovieSets.initDone = true;
        $('#directorSelect').selectmenu().selectmenu('refresh', true);
        $('#actorSelect').selectmenu().selectmenu('refresh', true);
        $('#genreSelect').selectmenu().selectmenu('refresh', true);
        $('#languageSelect').selectmenu().selectmenu('refresh', true);
        yMovies.init();
        
        for (var i = 0; i < (yLib.movieSets.length); i++) { 
            
            var setThumb = "";
            var seen = "";
            
            if(yLib.movieSets[i]["setdetails"]["playcount"]>0){
                if(yS.yS.hideWatched){continue;}//if setting says to not show seen movies, go to next iteration
                seen = "<i class='icon-check green'></i> ";            
            }
        
            if(!yS.yS.hidePrevPics){
                setThumb = "<img class='movieSetPrevPic' src='" + yTools.imageUrlNormalizer(yLib.movieSets[i]["setdetails"]["art"]["poster"], "?") + "'/>";
            }
            
            $("#movies-set-container").append(
                "<div id='setID-" + yLib.movieSets[i]["setdetails"]["setid"] + "' data-ySetID='" + yLib.movieSets[i]["setdetails"]["setid"] + "' class='movieSetCollapsible' data-role='collapsible' data-collapsed='true'>"
                    + "<h3>"
                        + setThumb + "<div>" + seen + yLib.movieSets[i]["setdetails"]["title"] + " (" + yLib.movieSets[i]["setdetails"]["limits"]["total"] + ")</div>"
                    + "</h3>"
                    + "<div>" + yLib.movieSets[i]["setdetails"]["plot"] + "</div>"
                + "</div>"
            ).trigger("create");
            
        }
        
        $("#loading_movie-sets").hide();
        
        $("body").delegate(".openMovieItem", "click", function(e){  //set movie information in details
            e.stopImmediatePropagation();
            yMovies.openMovieItem($(this).attr('data-yMovieId'));
        });
        
        $(".movieSetCollapsible").collapsible({
            expand: function(e){
                yCore.sendJsonRPC(
                    'getMovieSingleSet',  //, "year", "rating", "thumbnail", "playcount", "streamdetails", "resume"
                    '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieSetDetails", "params": {"setid": ' + $(this).attr('data-ySetID') + ', "properties": ["title"]}, "id": 1}',
                    function(resultMovieSets){
                        for (var i = 0; i < resultMovieSets["result"]["setdetails"]["limits"]["end"]; i++) {   
                            for (j = 0; j < yLib.movies.length ; j++) {
                                if (yLib.movies[j]["movieid"] == resultMovieSets["result"]["setdetails"]["movies"][i]["movieid"]) {
                                    movieID = j;
                                    break;
                                }                            
                            }
                            var m_runtime = Math.round(yLib.movies[movieID]["runtime"]/60);
                            if (m_runtime > 0){m_runtime += "min";}else{ m_runtime = "?";} //makes runtime string if aviable

                            var m_year = yLib.movies[movieID]["year"];
                            if (m_year < 1){m_year = "?";} //makes year string if unaviable

                            var seenAndResume = "";
                            if(yLib.movies[movieID]["playcount"]>0){
                                seenAndResume += "<i class='icon-check green'></i> ";
                            }

                            if(
                                yLib.movies[movieID]["resume"] !== undefined
                                && yLib.movies[movieID]["resume"]["position"]>0
                            ){
                                seenAndResume += "<i class='icon-clock-o orange'></i> ";
                            }

                            if(!yS.yS.hideLanguageMovies){
                                flags =  yTools.pathToFlags(yLib.movies[movieID]["streamdetails"]["audio"]);
                            } else {
                                flags = "";
                            }
                            
                            $("#setID-" + resultMovieSets["result"]["setdetails"]["setid"] + " > .ui-collapsible-content" ).append(
                                "<a class='openMovieItem movieItem' data-yMovieId='" + yLib.movies[movieID]["movieid"] 
                                    + "' data-sort='" + m_year
                                    + "' data-ySetID='" + resultMovieSets["result"]["setdetails"]["setid"] + "'>"
                                    + "<div class='prevPicContainerMovie'>"
                                        + yTools.imageUrlNormalizer(
                                            yLib.movies[movieID]["art"]["poster"],
                                            "?",
                                            "tag",
                                            "moviePrevPic centerFa ",
                                            ""
                                        )
                                    + "</div>"
                                    + "<div>"
                                        + "<h4>" + seenAndResume + yLib.movies[movieID]["title"] + "</h4>"
                                        + "<p><span class='movieYear'>" + $.t("year", {yYear: m_year}) + "  </span>" + $.t("runtime", {yRuntime:m_runtime}) + "</p>"
                                        + "<p>" + yTools.ratingToStars(yLib.movies[movieID]["rating"]) + "</p>"
                                        + "<p>" + flags + "</p>"
                                    + "</div>"
                                +"</a>"
                            ).trigger("create");;        
                        }
                        
                        //sort list after production year ascending, it's not possible to get it sortet from kodi, moviesetdetails just returns unsorted movieID's
                        $("#setID-" + resultMovieSets["result"]["setdetails"]["setid"] + "> .ui-collapsible-content a").sort(function (a, b) {
                            var contentA = parseInt( $(a).data('sort'));
                            var contentB =parseInt( $(b).data('sort'));
                            return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
                        }).appendTo("#setID-" + resultMovieSets["result"]["setdetails"]["setid"] + " > .ui-collapsible-content");
                        
                    }
                );
            },
            collapse: function(e){
                $('#movies-set-container .movieItem[data-ySetID="' + $(this).attr('data-ySetID') + '"]').remove();
            }
        });

    }
}
}
/*
 * All functions to get Tv-show infos and the functions of the series page AND seriesDetails page
 */
var ySeries = {
  TVShowID: "",
  already_run: false,
  series_Details_already_run: false,
  init: function() {

    if (!ySeries.already_run){  //that it doesn't run twice
        
      ySeries.detailsInit();

      $( "#seriesDetails" ).on( "swipeleft swiperight",  function( e ) { 
        if (e.type === "swipeleft" && $("#nextEpisode").attr('data-ySeriesNextID') != "") {
          e.stopImmediatePropagation();
          ySeries.showEpisodeDetails($("#nextEpisode").attr('data-ySeriesNextID') );
        } else if (e.type === "swiperight" && $("#prevEpisode").attr('data-ySeriesPrevID') != "") {
         e.stopImmediatePropagation();
         ySeries.showEpisodeDetails($("#prevEpisode").attr('data-ySeriesPrevID') );
        }
      });

      ySeries.already_run = true;

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
              seriesThumbAddon = "<img class='seriesThumbAddon' alt='" + TVShowName
                 + "' src='" + yTools.imageUrlNormalizer(resultGetTVShows["result"]["tvshows"][i]["art"]["banner"], "?")
              + "'/>";
            } else {
              seriesThumbAddon = TVShowName;
            }

            $("#series_list").append(
              "<li>"
                + "<div id='showID-" + TVShowID + "' data-role='collapsible' class='openSeries' data-yTVShowID='" + TVShowID + "' data-yTVShowPlaycount='"
                  + resultGetTVShows["result"]["tvshows"][i]["playcount"]
                + "'>"
                  + "<h3>"
                    + seenAndResume
                    + seriesThumbAddon
                  + "</h3>"
                  + "<div id='"  + TVShowID  + "'></div>"
                + "</div>"
              + "</li>"
            ).trigger("create");

            if(resultGetTVShows["result"]["tvshows"][i]["playcount"] > 0){
              $('.openSeries[data-yTVShowID="' + TVShowID + '"] a').addClass('ui-icon-check').removeClass('ui-icon-plus');
            }
          }
          $("#loading_series").hide();
        }
      });
    }
    $("body").delegate(".showEpisodeDetails", "click", function(e){ //opens and fills detail-page with episode details
      e.stopImmediatePropagation();
      ySeries.showEpisodeDetails($(this).attr('data-yEpisodeID'));
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
        ySeries.showEpisodeDetails($(this).attr('data-ySeriesPrevID') );
    });

    $("body").delegate("#nextEpisode", "click", function(e){
      e.stopImmediatePropagation();
      ySeries.showEpisodeDetails($(this).attr('data-ySeriesNextID') );
    });
    
    $("body").delegate("#toggleEpisodeSeen", "click", function(e){
        yCore.sendJsonRPC(
            'toggleEpisodeSeen',
            '{"jsonrpc":"2.0","method":"VideoLibrary.SetEpisodeDetails","params":{"episodeid":' + $(this).attr("data-yEpisodeId") + ',"playcount":1},"id":1}',
            function(){
                ySeries.showEpisodeDetails($("#toggleEpisodeSeen").attr('data-yEpisodeId') );
            }
        );
    });
    
    $("body").delegate("#toggleEpisodeUnSeen", "click", function(e){
        yCore.sendJsonRPC(
            'toggleEpisodeUnSeen',
            '{"jsonrpc":"2.0","method":"VideoLibrary.SetEpisodeDetails","params":{"episodeid":' + $(this).attr("data-yEpisodeId") + ',"playcount":0},"id":1}',
            function(){
                ySeries.showEpisodeDetails($("#toggleEpisodeUnSeen").attr('data-yEpisodeId') );
            }
        );        
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
        var node = document.getElementById($(this).attr('data-yTVShowID'));
        if ( node.hasChildNodes() ){
          while ( node.childNodes.length >= 1 ){
            node.removeChild( node.firstChild );
          }
        }
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
          $('.openSeries[data-yTVShowID='+$(this).attr('data-yTVShowID')+'] a').addClass('ui-icon-check').removeClass('ui-icon-plus');
        }
      }
    });
  },  
  detailsInit: function(){  
    if (!ySeries.series_Details_already_run){  //that it doesn't run twice
            $("#prevEpisode").button();
            $("#nextEpisode").button();
            $("#episodeDetailsPlay").button().unwrap();
            $("#episodeDetailsAddPl").button().unwrap();
            $("#prevEpisode").button().unwrap();
            $("#nextEpisode").button().unwrap();        
            
            ySeries.series_Details_already_run = true;
        }
  },
  /*
   * called if a Series (or TV-show) is opened
   */
  openSeries: function(TvShowId){
    var TVShowSeasonID = "";

    $("#"+TvShowId).append("<ul class='tvshowloading-" + TvShowId + "' class='ulbar' data-role='listview'><li class='loading loading_season'><div class='text-center'><img class='kodi_loading' src='resources/images/kodi_spinner.gif' alt='loading data'><span>" + $.t("loading") + "</span></div></li></ul>").trigger("create");

    
    
//     {method: "season", order: "ascending", ignorearticle: true}
    
    yCore.sendJsonRPC(
      'GetSeasons',
      '{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": {"properties": ["season", "showtitle", "art", "playcount"], "tvshowid":'
                  + TvShowId + ',"sort":{"method":"season","order":"ascending","ignorearticle":true}}, "id": 1}',
      function(resultGetSeasons){
        for (var j = 0; j < resultGetSeasons["result"]["limits"]["end"]; j++) {
            var TVShowSeasonID = resultGetSeasons["result"]["seasons"][j]["season"]; // that right season is in right collapsible

            if(resultGetSeasons["result"]["seasons"][j]["playcount"] > 0){
                if(yS.yS.hideWatched){continue;}//if setting says to not show seen episodes, go to next iteration
            }

            var imagePoster = "";
            if(!yS.yS.hidePrevPics){
                imagePoster = yTools.imageUrlNormalizer(
                                resultGetSeasons["result"]["seasons"][j]["art"]["poster"],
                                "?",
                                "tag",
                                "seriesPoster",
                                ""
                                );
            }

            $("#"+TvShowId).append(
                "<div id='showID-"+TvShowId+"-s-"+TVShowSeasonID+"' data-role='collapsible' class='openSeason' data-yTVShowID='" + TvShowId 
                    + "' data-yTVShowSeasonID='" + TVShowSeasonID 
                    + "' data-ySeasonPlaycount='" + resultGetSeasons["result"]["seasons"][j]["playcount"] + "'>"
                        + "<h3>"+ imagePoster + " " + "<span class='seasonTitle'>" + resultGetSeasons["result"]["seasons"][j]["label"] + "</span></h3>"
                        + "<div id='" + TvShowId + "-" + TVShowSeasonID + "'></div>"
                + "</div>"
            ).trigger('create');
          
            //if seen, select by TV show and season and replace plus symbol with check symbol
            if(resultGetSeasons["result"]["seasons"][j]["playcount"] > 0){
                $('.openSeason[data-yTVShowID="' + TvShowId + '"][data-yTVShowSeasonID="'+TVShowSeasonID+'"] a').addClass('ui-icon-check').removeClass('ui-icon-plus');
            }
        }

        $(".tvshowloading-" + TvShowId).remove();

        $(".openSeason").collapsible({
            expand: function(e){
               TVShowSeasonID = $(this).attr('data-ytvshowseasonid'); 
               TvShowId = $(this).attr('data-ytvshowid');
               yCore.sendJsonRPC(
                'GetEpisodes',
                '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": '
                    + '{ "properties": ["season","episode", "showtitle", "plot", "thumbnail", "file", "rating", "playcount", "streamdetails", "resume"],"tvshowid":' 
                    + TvShowId + ',"season" : ' + TVShowSeasonID + ' }, "sort": { "order": "ascending", "method": "episode"}, "id": 1}',
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
                            "<a class='showEpisodeDetails' data-yEpisodeID='"+ resultGetEpisodes["result"]["episodes"][k]["episodeid"]
                                + "' data-yEpisodeNumber='"+ resultGetEpisodes["result"]["episodes"][k]["episode"]
                            + "'>"
                                + "<li class='series-item yListItem'> "
                                    + imageTag
                                    + "<h4>" + seenAndResume + resultGetEpisodes["result"]["episodes"][k]["label"] + "</h4>"
                                + "</li>"
                            + "</a>"
                        );
                    }
                    
                    $("#"+TvShowId+"-"+TVShowSeasonID+" a").sort(sort_a).appendTo("#"+TvShowId+"-"+TVShowSeasonID);
                    function sort_a(a, b){
                      return ($(b).data('yepisodenumber')) < ($(a).data('yepisodenumber')) ? 1 : -1;    
                    }$(".listitems li").sort(sort_li).appendTo("#"+TvShowId+"-"+TVShowSeasonID);
                    function sort_a(a, b){
                      return ($(b).data('yepisodenumber')) < ($(a).data('yepisodenumber')) ? 1 : -1;    
                    }
                },
                false
            );        
            },
            collapse: function(e){
              //remove episodes and "add all season.." from collapsible
              $(".showEpisodeDetails", this).remove();
              $(".addSeriesSeason", this).remove();
                        
              //if seen, select by TV show and season and replace plus symbol with check symbol
              if($(this).attr('data-yseasonplaycount') > 0){
                $('.openSeason[data-yTVShowID="' + $(this).attr('data-yTVShowID') + '"][data-ytvshowseasonid="'+$(this).attr('data-ytvshowseasonid')+'"] a').addClass('ui-icon-check').removeClass('ui-icon-plus');
              }
            }
        });

      }
    );
  },
  /*
   * called if a Episode is opened
   */
  showEpisodeDetails: function(episodeID){
      
    ySeries.detailsInit();
      
    $("#episodeDetailsAddPl").button('enable');

    //check if this episode in the list ist first "episode"-child
    if($('.showEpisodeDetails[data-yepisodeid="' + episodeID + '"]').index() == 1){
      $("#prevEpisode").button('disable');
	    $("#prevEpisode").attr('data-ySeriesPrevID', "");
    } else {
      $("#prevEpisode").button('enable');
      //add episode ID of previous item
      $("#prevEpisode").attr('data-ySeriesPrevID', $('.showEpisodeDetails[data-yepisodeid="' + episodeID + '"]').prev().attr("data-yepisodeid"));
    }
    //check if this episode in the list ist last child
    if($('.showEpisodeDetails[data-yepisodeid="' + episodeID + '"]').is(':last-child')){
      $("#nextEpisode").button('disable');
	    $("#nextEpisode").attr('data-ySeriesNextID', "");
    } else {
      $("#nextEpisode").button('enable');
      //add episode ID of next item
      $("#nextEpisode").attr('data-ySeriesNextID', $('.showEpisodeDetails[data-yepisodeid="' + episodeID + '"]').next().attr("data-yepisodeid"));
    }
    yCore.sendJsonRPC(
      'GetEpisodeDetails',
      '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodeDetails", "params": { "properties": ["season","episode", "showtitle", "plot", "fanart", "thumbnail", "file", "rating", "playcount", "streamdetails", "resume","firstaired","runtime","seasonid","tvshowid"],"episodeid":' + episodeID + '}, "id": 1}',
      function(resultGetEpisodeDetails){

        var episodeDetails = resultGetEpisodeDetails["result"]["episodedetails"];
        yLib["series"][episodeDetails["tvshowid"]]["seasons"][episodeDetails["season"]]["episodes"][episodeDetails["episode"]] = resultGetEpisodeDetails["result"]["episodedetails"];
                
	    $("#episodeDetailsFlags").show();
	    $("#episodeDetailsSubtitles").show();
        
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
                yCore.sendJsonRPC(
                  'getFilesize',
                  '{"jsonrpc":"2.0","id":5142812,"method":"Files.GetFileDetails","params":{"file":"'+ episodeDetails["file"]+'","media":"files","properties":["size"]}}',
                  function(resultgetSize){
                    $("#episodeDetailsFilelink").append(" (" + yTools.sizeHumanReadable(resultgetSize["result"]["filedetails"]["size"]) + ")");
                  }
                );
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
                
          /* for spoken languages*/

          //add flag and "language-native" to streamdetails of the yarc internal movies-array
          for (var j=0;  j < episodeDetails["streamdetails"]["audio"].length; j++){//run whole kodi-language list
              if(episodeDetails["streamdetails"]["audio"][j]["language"] in langCodeToDescFlag){//if code is in json
                  var lang = episodeDetails["streamdetails"]["audio"][j]["language"];
                  episodeDetails["streamdetails"]["audio"][j]["native"] = langCodeToDescFlag[lang]["native"];
                  episodeDetails["streamdetails"]["audio"][j]["flag"] = langCodeToDescFlag[lang]["flag"];
                  episodeDetails["streamdetails"]["audio"][j]["isocode"] = langCodeToDescFlag[lang]["iso639_2"];
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
                    if(langCodeToDescFlag[code]["iso639_2"] == episodeDetails["streamdetails"]["audio"][j]["isocode"]){
                      codeIsSet = true;//... remeber it to...
                    }
                  }
                  if(!codeIsSet){//..not add it again to aopton list
                    var streamdet = {//prepare object to be pushed into streamdetails-audio
                                      native:langCodeToDescFlag[code].native,
                                      flag:langCodeToDescFlag[code].flag,
                                      isocode:langCodeToDescFlag[code]["iso639_2"]
                                    };
                                    episodeDetails["streamdetails"]["audio"].push(streamdet);//push object above
                  }
                }
              }
            }
          }
                
          /* for subtitles*/
          //add flag and "language-native" to streamdetails of the yarc internal movies-array
          for (var j=0;  j < episodeDetails["streamdetails"]["subtitle"].length; j++){//run whole kodi-language list
              if(episodeDetails["streamdetails"]["subtitle"][j]["language"] in langCodeToDescFlag){//if code is in json
                  var langSub = episodeDetails["streamdetails"]["subtitle"][j]["language"];
                  episodeDetails["streamdetails"]["subtitle"][j]["native"] = langCodeToDescFlag[langSub]["native"];
                  episodeDetails["streamdetails"]["subtitle"][j]["flag"] = langCodeToDescFlag[langSub]["flag"];
                  episodeDetails["streamdetails"]["subtitle"][j]["isocode"] = langCodeToDescFlag[langSub]["iso639_2"];
              }
          }

          /*
          *  secondly, it searches for isocodes in the filename which has to be in brackets [], if there is found something, it also
          *  addes the additional data into the streamdetails-subtitle (yarc internal only)
          */
          if(episodeDetails["file"].indexOf("[") >= 0){//if there is no starting bracket in filepath, don't even try
              for (var code in langCodeToDescFlag) { //go trough every isocode in the list
                  if (langCodeToDescFlag.hasOwnProperty(code)) {
                      if (episodeDetails["file"].toLowerCase().indexOf("[sub-" + code + "]") >= 0) {//if code is found in filename
                          var codeIsSet = false;
                          //go trough whole streamdetails-subtitle list
                          for (var j=0;  j < episodeDetails["streamdetails"]["subtitle"].length; j++){
                              //if code is already in streamdetails-subtitle...
                              if(langCodeToDescFlag[code]["iso639_2"] == episodeDetails["streamdetails"]["subtitle"][j]["isocode"]){
                              codeIsSet = true;//... remeber it to...
                              }
                          }
                          if(!codeIsSet){//..not add it again to aopton list
                              var streamdet = {//prepare object to be pushed into streamdetails-audio
                                                      native:langCodeToDescFlag[code].native,
                                                      flag:langCodeToDescFlag[code].flag,
                                                      isocode:langCodeToDescFlag[code]["iso639_2"]};
                              episodeDetails["streamdetails"]["subtitle"].push(streamdet);//push object above
                          }
                      }
                  }
              }
          }
        }

        //show green Tick if played before
        var seenAndResume = "";
        if(episodeDetails["playcount"]>0){
          seenAndResume += "<i class='icon-check-square-o green clickable' id='toggleEpisodeUnSeen' data-yEpisodeId='" + episodeID + "'></i> ";
        } else {
          seenAndResume += "<i class='icon-square-o clickable' id='toggleEpisodeSeen' data-yEpisodeId='" + episodeID + "'></i> ";    
        }

        if(episodeDetails["resume"] !== undefined && episodeDetails["resume"]["position"]>0){
          seenAndResume += "<i class='icon-clock-o orange'></i> ";
        }

        $("#episodeDetailsTitle").html(
          seenAndResume + episodeDetails["showtitle"] + " (" + episodeDetails["season"] + "x" + episodeDetails["episode"] + "): "
          + episodeDetails["label"]
        );

        console.log(episodeDetails);
        if(episodeDetails["firstaired"] == "") {
            $("#episodeDetailsFirstaired").html("");
            $("episodeDetailsFirstaired").hide();
        }
        else {
            $("#episodeDetailsFirstaired").html($.t("firstaired") + ": " + episodeDetails["firstaired"]);
            $("episodeDetailsFirstaired").show();
        }

        document.getElementById('episodeDetailsRating').innerHTML = (
          $.t("rating", {yRating:yTools.ratingToStars(episodeDetails["rating"])})
        );
            
        if(episodeDetails["runtime"] != "0" && ("runtime" in episodeDetails)){
          var minutes = Math.floor(episodeDetails["runtime"] / 60);
          var seconds = episodeDetails["runtime"] - minutes * 60;
          document.getElementById('episodeDetailsRuntime').innerHTML = (
            $.t("runtime", {yRuntime:minutes + ":" + yTools.addZeroTwoDigits(seconds)})
          );
        }
            
        $("div#episodeDetailsPlot").text(episodeDetails["plot"]);
            
        if(!yS.yS.hideLanguageMovies){
		      if(episodeDetails["streamdetails"]["audio"].length > 0){
            document.getElementById('episodeDetailsFlags').innerHTML = $.t("languages", {yLanguages: yTools.pathToFlags(episodeDetails["streamdetails"]["audio"])});
		      } else {$("#episodeDetailsFlags").hide();}

		      if(episodeDetails["streamdetails"]["subtitle"].length > 0){
            document.getElementById('episodeDetailsSubtitles').innerHTML =$.t("subtitles", {ySubtitles: yTools.pathToFlags(episodeDetails["streamdetails"]["subtitle"])});
		      } else {$("#episodeDetailsSubtitles").hide();}
        } else {
          $("#episodeDetailsFlags").hide();
          $("#episodeDetailsSubtitles").hide();
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

    $('#episodeDetailsPlay').text($.t("loading")); // change button text because of long JSON Call time

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
                       $('#episodeDetailsPlay').text($.t("play"));
                  }
              );
              yRemote.updateLastPlayingFile("episodeID",episodeID);
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
  },
  /*
   * Find closest Show Title name in yLib.series compared to string and return the TV show title from yLib.series
   */
  searchClosestShowTitleInYLib: function(showTitle){      
    var lowestIterationOfAll = 999999999999;
    var bestMatch = "";
    
    for(var i = 0; i < yLib.series.length; i++) {
        if (yLib.series[i] === null || yLib.series[i]["title"] === undefined){ continue;}
        iterationsNeeded = yTools.damerauLevenshtein(showTitle.toLowerCase(), yLib.series[i]["title"].toLowerCase());
        if(lowestIterationOfAll > iterationsNeeded){
            bestMatch = yLib.series[i]["tvshowid"];
            lowestIterationOfAll = iterationsNeeded;
        }
    }
    return bestMatch; 
    console.log("return: " + bestMatch);
  }
}


/*
 * All functions to get PVR Datea and the functions of the PVR-TV pages
 */
var yPvrTVChannels = {
  initDone: false,
  init: function() {
      
    if (!yPvrTVChannels.initDone){
        yPvrTVChannels.initDone = true;
        
        //call this every minute to update entries after first call
        setInterval(yPvrTVChannels.init, 60000);
        
        /*$("body").delegate("#pvrTVChannelsRefresh", "click", function(e){
            e.stopImmediatePropagation();
            yPvrTVChannels.init();
        });*/
        $("body").delegate(".pvr-prog-info", "click", function(e){
            e.stopImmediatePropagation();
            yPvrBroadcastDetails.populateBroadcastDetails($(this).attr('data-yPVRBroadcastID'), $(this).attr('data-yPVRChannelID'), "channel");
            $.mobile.navigate("#pvr-details");
        });
        
        $("body").delegate(".pvr-channel-overview", "click", function(e){
            e.stopImmediatePropagation();
            $.mobile.navigate("#pvr-channel");
            yPvrChannelDetails.populateChannelDetails($(this).attr('data-yPVRChannelID'));
        });        
    }
            
    yCore.sendJsonRPC(
        'getPVR-Channels',
        '{"jsonrpc": "2.0", "id": 1, "method": "PVR.GetChannels", "params":{"channelgroupid" : "alltv", "properties":["thumbnail", "icon", "lastplayed", "broadcastnow", "channelnumber", "broadcastnext"]}}',
        function(resultgetChannels){
            $("#pvr_tv_channel_list").empty();
            
            for (var i = 0; i < resultgetChannels["result"]["limits"]["end"]; i++) {
      
                var title =  " ? ";
                var nextTitle =  " ? ";
                var channelOverview = "";
                var progInfo =  "";
                var percentage = false;
                var percentageBar = "";
                var episodename = "&nbsp;";
                var episodenameShort = "";
                var year = "&nbsp;";
                var imagetag = ""; //thumbnail
                var imagetagicon = "";
                var timeLeft = "?";
                
                if(!yS.yS.hidePrevPics){
                    imagetag = yTools.imageUrlNormalizer(
                                        resultgetChannels["result"]["channels"][i]["thumbnail"],
                                        "?",
                                        "tag",
                                        "musicPrevPic text-center",
                                        "",
                                        true
                                    );
                    imagetagicon = yTools.imageUrlNormalizer(
                                        resultgetChannels["result"]["channels"][i]["icon"],
                                        "?",
                                        "tag",
                                        "pvrChannelIcon text-center",
                                        "",
                                        true
                                    );
                }

                if(resultgetChannels["result"]["channels"][i].hasOwnProperty("broadcastnext")){
                    nextTitle = resultgetChannels["result"]["channels"][i]["broadcastnext"]["title"];
                }

                if(resultgetChannels["result"]["channels"][i].hasOwnProperty("broadcastnow")){
                    title = resultgetChannels["result"]["channels"][i]["broadcastnow"]["title"];
                    progInfo = "<span class='pvr-prog-info' data-yPVRBroadcastID='" + resultgetChannels["result"]["channels"][i]["broadcastnow"]["broadcastid"] 
                        + "' data-yPVRChannelID='" + resultgetChannels["result"]["channels"][i]["channelid"] + "' ><i class='icon-info-circle'></i></span>"; 
                    channelOverview = "<span class='pvr-channel-overview' data-yPVRChannelID='" + resultgetChannels["result"]["channels"][i]["channelid"] + "' ><i class='icon-list'></i></span>";   
                    percentage = resultgetChannels["result"]["channels"][i]["broadcastnow"]["progresspercentage"];
                    if (resultgetChannels["result"]["channels"][i]["broadcastnow"]["episodename"] != "") {
                        episodename = "• <i>" + resultgetChannels["result"]["channels"][i]["broadcastnow"]["episodename"] + "</i> ";
                        episodenameShort = "• " + resultgetChannels["result"]["channels"][i]["broadcastnow"]["episodename"];
                    }
                    if (resultgetChannels["result"]["channels"][i]["broadcastnow"]["year"] != 0){
                        year = "• </i>" + resultgetChannels["result"]["channels"][i]["broadcastnow"]["year"] + "</i> ";
                    }    
                    timeLeft = resultgetChannels["result"]["channels"][i]["broadcastnow"]["runtime"] - Math.round(resultgetChannels["result"]["channels"][i]["broadcastnow"]["runtime"] / 100 * resultgetChannels["result"]["channels"][i]["broadcastnow"]["progresspercentage"]);
                }
                
                if (percentage) {
                    percentageBar = "<div class='percentageBar'><div class='percentageBarInside' style='width:" +percentage+ "%'></div></div>";
                }
                else {
                    percentageBar = "<div class='percentageBar'><div class='percentageBarInside' style='width:0%'></div></div>";
                }
                
                $("#pvr_tv_channel_list").append(
                    "<a class='PvrTVopenChannel' title='"+ title + episodenameShort +"'"
                        + " data-yPVRChannelID='" + resultgetChannels["result"]["channels"][i]["channelid"]
                    + "' tabindex='1'>"
                        +"<div class='prevPicContainerSeries'>"
                            + imagetag
                        + "</div>"
                        + "<div class='pvr-description-box'>" 
                            + imagetagicon
                            + "<p>"+ resultgetChannels["result"]["channels"][i]["channelnumber"] + ") "  + resultgetChannels["result"]["channels"][i]["label"] + "</p>"
                            + "<h4>" + title + " </h4>"
                            + "<p>" + year + episodename +"</p>"
                            + percentageBar
                            + "<p>" + $.t("pvr-next", {yNextBroadcast: nextTitle, yTimeLeft: timeLeft}) + "</p>"                       
                        + "</div>"
                        + channelOverview
                        + progInfo
                    +"</a>"
                ).trigger("create");
            }
        });     
  }
}

/*
 * Program-Table Guide for TV based on EPG received from Kodi
 */
var yPvrTVProgram = {
  initDone: false,
  firstPopulate: true,
  currentdate: new Date(),
  timlineDateHourMin: new Date (),
  init: function() {
      
      if (!yPvrTVProgram.initDone){
            var pvrTVProgramSlider = document.getElementById('pvr-tv-program-slider');
            noUiSlider.create(pvrTVProgramSlider, {
                start: 0,
                range: {
                    'min': [0],
                    'max': [15000]
                }
            });
            pvrTVProgramSlider.noUiSlider.on('update', function () {                
                $("#pvr-tv-program-container").animate({
                    scrollLeft: pvrTVProgramSlider.noUiSlider.get()
                }, 0);
                
                $("#pvr-tv-program-timeline-container").animate({
                    scrollLeft: pvrTVProgramSlider.noUiSlider.get() 
                }, 0);
            });
            if(yS.yS.hidePvrSlider){//hide slider if set in settings & adjust timline pos
                $("#pvr-tv-program-slider-container").hide(); 
                $("#pvr-tv-program-timeline-container").css('top', "0px"); 
                $("#pvr-tv-program-dateselect-container").css('margin-top', '16px');
                $("#pvr-tv-program-container").css('padding-top', '14px');
            }
        
            $("body").delegate(".pvrProgramChannel", "click", function(e){
                e.stopImmediatePropagation();
                
                yCore.sendJsonRPC(
                    'PlayChannel',
                    '{"jsonrpc":"2.0", "method":"Player.Open", "params": { "item": {"channelid":' + $(this).attr('data-ypvrchannelid') + '}, "options":{}}, "id":1}',
                    ''
                );
                yRemote.updateLastPlayingFile("channelID",$(this).attr('data-ypvrchannelid'));

            });
            
            $("body").delegate("#pvrTVProgramGOTONow", "click", function(e){
                e.stopImmediatePropagation();
                yPvrTVProgram.updateToNow(false);
            });
            
            $('#pvr-tv-program-dateselect').change(function() {
                $("#pvrTVProgramNow").hide();
                
                if (yLib.pvrTVBroadcasts.length == 0) {
                    alert($.t("pvr-program-not-loaded"));  
                }
                else {
                    yPvrTVProgram.populateProgram();
                }
            });    
            $("#pvr-tv-program-container").scroll(function(){
                $("#pvr-tv-program-timeline-container").animate({
                    scrollLeft: $("#pvr-tv-program-container").scrollLeft() 
                }, 0);
                
                pvrTVProgramSlider.noUiSlider.set($("#pvr-tv-program-container").scrollLeft());
            });
            
            $("body").delegate(".pvrTVProgramItem", "click", function(e){
                e.stopImmediatePropagation();
                yPvrBroadcastDetails.populateBroadcastDetails($(this).attr('data-yPVRBroadcastID'), $(this).attr('data-yPVRChannelID'), "pvrTVProgram");
                $.mobile.navigate("#pvr-details");
            });   
            
            yPvrTVProgram.initDone = true;          
        }
        
      
        if (yLib.pvrTVBroadcasts.length == 0) {
            alert($.t("pvr-program-not-loaded"));             
            $.mobile.navigate("#start");
        }        
        else {
            $('#pvr-tv-program-container').scroll(function() {
                $(this).find('.pvrProgramChannel').css('left', $(this).scrollLeft());
            });
        
            yPvrTVProgram.populateProgram();            
        }
  },
  populateProgram: function() {        
        $("#pvr-tv-program-container").empty();
        $("#pvr-tv-program-container").append("<div id='pvrTVProgramNow'></div>");
        $("#loading_pvr-tv-program").show();
        
        var curDate = new Date(); 
                
        for (var i = 0; i < yLib.pvrTVChannels.length; i++) {            
            var channelItem = "";
            var channelNumber = yLib.pvrTVChannels[i]["channelnumber"];
            var channelID = yLib.pvrTVChannels[i]["channelid"];
            var firstIteration = true;
            
            //fill Date select
            if ($("#pvrTVProgramGOTONow").data('loadingstate') == "not-loaded" && i==0 ) {
                for (var k = 0; k < yLib.pvrTVBroadcasts[0]["result"]["limits"]["end"]; k++) {
                    var date = yLib.pvrTVBroadcasts[0]["result"]["broadcasts"][k]["starttime"].split(' ')[0];
                    var dateText = date;
                        
                    if (curDate.getUTCDate() == parseInt(yLib.pvrTVBroadcasts[0]["result"]["broadcasts"][k]["starttime"].split(' ')[0].split("-")[2])) {
                        dateText = dateText + " - " + $.t("today");
                    }
                        
                    if(!($('#pvr-tv-program-dateselect option[value=' + date + ']').length > 0)) {
                        $('#pvr-tv-program-dateselect').append("<option value='" + date + "'>" + dateText + "</option>");
                    }
                }
                $("#pvr-tv-program-dateselect").selectmenu("refresh");
                $("#pvrTVProgramGOTONow").data("loadingstate", "loaded");
                $("#pvr-tv-program-dateselect").val(curDate.getFullYear()+"-"+yTools.addZeroTwoDigits(curDate.getMonth()+1)+"-"+yTools.addZeroTwoDigits(curDate.getDate())).change();
            }
            
                      
            if(!yS.yS.hidePrevPics || yLib.pvrTVChannels[i]["icon"] == ""){
                channelItem = yTools.imageUrlNormalizer(
                                    yLib.pvrTVChannels[i]["icon"],
                                    "?",
                                    "tag",
                                    "text-center",
                                    "",
                                    true
                                );
            }
            
            $("#pvr-tv-program-container").append(
                "<div class='pvrProgramRow' id='channel-" + channelNumber  + "'>"
                    + "<div class='pvrProgramChannel' data-yPVRChannelID='" + channelID + "'>"
                        + channelItem + yLib.pvrTVChannels[i]["label"]
                    + "</div>"
                + "</div>"
            ).trigger("create");
            
            for (var j = 0; j < yLib.pvrTVBroadcasts[i]["result"]["limits"]["end"]; j++) {  
                  
                var broadcastitem = yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j];
                
                //only if item is starts at selected day
                if($("#pvr-tv-program-dateselect").val() !== broadcastitem["starttime"].split(' ')[0]) {
                    continue;
                }         
                
                var year = episodename = episodenameShort= "";
                var startHour = ((parseInt(broadcastitem["starttime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24);
                var startMinute = broadcastitem["starttime"].split(' ')[1].split(":")[1];
                var showLengthInMin = 0;
                var broadcastitemStartDateTimeMin = new Date (//save date of start of program item to calculate min difference to next item
                    parseInt(broadcastitem["starttime"].split(' ')[0].split("-")[0]), //year
                    parseInt((broadcastitem["starttime"].split(' ')[0].split("-")[1])-1), //month
                    parseInt(broadcastitem["starttime"].split(' ')[0].split("-")[2]), //day
                    parseInt(broadcastitem["starttime"].split(' ')[1].split(":")[0]), //hour
                    parseInt(broadcastitem["starttime"].split(' ')[1].split(":")[1]) //minute
                );
                
                if(j+1 < yLib.pvrTVBroadcasts[i]["result"]["limits"]["end"]){ //only if there is a following item
                    var nextBroadcastitemStartDateTimeMin = new Date (
                        parseInt(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j+1]["starttime"].split(' ')[0].split("-")[0]), //year
                        parseInt((yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j+1]["starttime"].split(' ')[0].split("-")[1])-1), //month
                        parseInt(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j+1]["starttime"].split(' ')[0].split("-")[2]), //day
                        parseInt(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j+1]["starttime"].split(' ')[1].split(":")[0]), //hour
                        parseInt(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j+1]["starttime"].split(' ')[1].split(":")[1]) //minute
                    );
                    showLengthInMin = (Math.abs(nextBroadcastitemStartDateTimeMin-broadcastitemStartDateTimeMin))/60/1000;
                }
                else {//otherwise take length                            
                    showLengthInMin = broadcastitem["runtime"];
                }
                if(firstIteration){                         
                    firstIteration = false;
                    $("#channel-" + channelNumber).append( //invisible box before program starts
                        "<div style='width:" + (startHour*600+(startMinute*10)) + "px;height:50px;float:left;'></div>"                                   
                    ).trigger("create");      
                }
                
                if(broadcastitem["episodename"] != "") {
                    episodename = " • <i>" + broadcastitem["episodename"] + "</i>";
                    episodenameShort = " • " + broadcastitem["episodename"];
                    
                }
                if(broadcastitem["year"] != 0) {year = " • </i>" + broadcastitem["year"] + "</i>";}
                
                let thumb = "";
                if(!yS.yS.hidePrevPics){
                    thumb = yTools.imageUrlNormalizer(
                                broadcastitem["thumbnail"],
                                "?",
                                "tag",
                                "pvrProgramRowPic",
                                "",
                                true
                            );
                }
                
                //width calculation minus 8 because of the border and spacing
                $("#channel-" + channelNumber).append(
                    "<div class='pvrTVProgramItem' data-yPVRBroadcastID='" + broadcastitem["broadcastid"] 
                    + "' style='width:" + ((showLengthInMin*10)-8) + "px;' title='"+broadcastitem["title"]+episodenameShort+"'>"
                        +  thumb
                        + "<h4>" + broadcastitem["title"] + "</h4>"
                        + "<p>" + startHour + ":" + startMinute + episodename + year + "</p>"
                    +"</div>"                                   
                ).trigger("create");
            }
        }
        
        if($("#pvr-tv-program-dateselect").val() == curDate.getFullYear()+"-"+yTools.addZeroTwoDigits(curDate.getMonth()+1)+"-"+yTools.addZeroTwoDigits(curDate.getDate())) {
            $("#pvrTVProgramNow").show();
            yPvrTVProgram.updateToNow(true);
        }
        
        if (yPvrTVProgram.firstPopulate) {
            yPvrTVProgram.firstPopulate = false;
            yPvrTVProgram.updateToNow(false);
        }
        
        $("#pvr-tv-program-container").scroll(); //trigger scroll event so that channel bar gets updated
        
        $("#loading_pvr-tv-program").hide();
        $("#pvrTVProgramGOTONowText").show(); 
  },
  updateToNow: function(onlyProgramNowBar) {
    var offset = 52; //52 = width of channel sidebar incl. borders
    
    yPvrTVProgram.currentdate = new Date();
    
    if (!onlyProgramNowBar){
        if (yTools.addZeroTwoDigits(yPvrTVProgram.currentdate.getUTCDate()) != $("#pvr-tv-program-dateselect").val().split("-")[2]) {
            $("#pvr-tv-program-dateselect").val(yPvrTVProgram.currentdate.getFullYear()+"-"+yTools.addZeroTwoDigits(yPvrTVProgram.currentdate.getMonth()+1)+"-"+yTools.addZeroTwoDigits(yPvrTVProgram.currentdate.getDate())).change();
        }    
    }
    
    $("#pvrTVProgramNow").show();
        
    offset += ((yPvrTVProgram.currentdate.getHours()*60)+(yPvrTVProgram.currentdate.getMinutes()))*10  //calculate timedif in minutes from midnigt then *10pixel width per minute
    movetoCurrentTimeToMiddleOfScreen = $('#pvr-tv-program-container').width()/2;
    
    $("#pvrTVProgramNow").css("left", offset + "px");
    $("#pvr-tv-program-container").animate({scrollLeft: offset-movetoCurrentTimeToMiddleOfScreen}, 0);    
    $("#pvr-tv-program-timeline-container").animate({scrollLeft: offset-movetoCurrentTimeToMiddleOfScreen}, 0);

    var pvrTVProgramSlider = document.getElementById('pvr-tv-program-slider');
    pvrTVProgramSlider.noUiSlider.set(offset-movetoCurrentTimeToMiddleOfScreen);
        
  }  
}

/*
 * All functions to get PVR Datea and the functions of the PVR-TV pages
 */
var yPvrRadioChannels = {
  initDone: false,
  init: function() {
      
    if (!yPvrRadioChannels.initDone){
        yPvrRadioChannels.initDone = true;
        
        //call this every minute to update entries after first call
        setInterval(yPvrRadioChannels.init, 60000);
        
        $("body").delegate(".pvr-prog-info", "click", function(e){
            e.stopImmediatePropagation();
            yPvrBroadcastDetails.populateBroadcastDetails($(this).attr('data-yPVRBroadcastID'), $(this).attr('data-yPVRChannelID'), "channel");
            $.mobile.navigate("#pvr-details");
        });
        
        $("body").delegate(".pvr-channel-overview", "click", function(e){
            e.stopImmediatePropagation();
            $.mobile.navigate("#pvr-channel");
            yPvrChannelDetails.populateChannelDetails($(this).attr('data-yPVRChannelID'));
        });     
    }
            
    yCore.sendJsonRPC(
        'getPVR-Radio-Channels',
        '{"jsonrpc": "2.0", "id": 1, "method": "PVR.GetChannels", "params":{"channelgroupid" : "allradio", "properties":["thumbnail", "icon", "lastplayed", "broadcastnow", "channelnumber", "broadcastnext"]}}',
        function(resultgetChannels){
            $("#pvr_radio_channel_list").empty();
            
            for (var i = 0; i < resultgetChannels["result"]["limits"]["end"]; i++) {
      
                var title =  " ? ";
                var nextTitle =  " ? ";
                var channelOverview = "";
                var progInfo =  "";
                var percentage = false;
                var percentageBar = "";
                var episodename = "&nbsp;";
                var year = "&nbsp;";
                var imagetag = ""; //thumbnail
                var imagetagIcon = "";
                var timeLeft = "?";
                
                if(!yS.yS.hidePrevPics){
                    imagetag = yTools.imageUrlNormalizer(
                                        resultgetChannels["result"]["channels"][i]["thumbnail"],
                                        "?",
                                        "tag",
                                        "musicPrevPic text-center",
                                        "",
                                        true
                                    );
                    imagetagIcon = yTools.imageUrlNormalizer(
                                        resultgetChannels["result"]["channels"][i]["icon"],
                                        "?",
                                        "tag",
                                        "pvrChannelIcon text-center",
                                        "",
                                        true
                                    );
                }

                if(resultgetChannels["result"]["channels"][i].hasOwnProperty("broadcastnext")){
                    nextTitle = resultgetChannels["result"]["channels"][i]["broadcastnext"]["title"];
                }

                if(resultgetChannels["result"]["channels"][i].hasOwnProperty("broadcastnow")){
                    title = resultgetChannels["result"]["channels"][i]["broadcastnow"]["title"];
                    progInfo = "<span class='pvr-prog-info' data-yPVRBroadcastID='" + resultgetChannels["result"]["channels"][i]["broadcastnow"]["broadcastid"] 
                        + "' data-yPVRChannelID='" + resultgetChannels["result"]["channels"][i]["channelid"] + "' ><i class='icon-info-circle'></i></span>"; 
                    channelOverview = "<span class='pvr-channel-overview' data-yPVRChannelID='" + resultgetChannels["result"]["channels"][i]["channelid"] + "' ><i class='icon-list'></i></span>";   
                    percentage = resultgetChannels["result"]["channels"][i]["broadcastnow"]["progresspercentage"];
                    if (resultgetChannels["result"]["channels"][i]["broadcastnow"]["episodename"] != "") {
                        episodename = "• <i>" + resultgetChannels["result"]["channels"][i]["broadcastnow"]["episodename"] + "</i> ";
                    }
                    if (resultgetChannels["result"]["channels"][i]["broadcastnow"]["year"] != 0){
                        year = "• </i>" + resultgetChannels["result"]["channels"][i]["broadcastnow"]["year"] + "</i> ";
                    }    
                    timeLeft = resultgetChannels["result"]["channels"][i]["broadcastnow"]["runtime"] - Math.round(resultgetChannels["result"]["channels"][i]["broadcastnow"]["runtime"] / 100 * resultgetChannels["result"]["channels"][i]["broadcastnow"]["progresspercentage"]);
                }
                
                if (percentage) {
                    percentageBar = "<div class='percentageBar'><div class='percentageBarInside' style='width:" +percentage+ "%'></div></div>";
                }
                else {
                    percentageBar = "<div class='percentageBar'><div class='percentageBarInside' style='width:0%'></div></div>";
                }
                
                $("#pvr_radio_channel_list").append(
                    "<a class='PvrTVopenChannel'"
                        + " data-yPVRChannelID='" + resultgetChannels["result"]["channels"][i]["channelid"]
                    + "' tabindex='1'>"
                        +"<div class='prevPicContainerSeries'>"
                            + imagetag
                            + imagetagIcon
                        + "</div>"
                        + "<div class='pvr-description-box'>" 
                            + "<p>"+ resultgetChannels["result"]["channels"][i]["channelnumber"] + ") "  + resultgetChannels["result"]["channels"][i]["label"] + "</p>"
                            + "<h4>" + title + " </h4>"
                            + "<p>" + year + episodename +"</p>"
                            + percentageBar
                            + "<p>" + $.t("pvr-next", {yNextBroadcast: nextTitle, yTimeLeft: timeLeft}) + "</p>"                       
                        + "</div>"
                        + channelOverview
                        + progInfo
                    +"</a>"
                ).trigger("create");
            }
        });     
  }
}

var yPvrBroadcastDetails = {
  initDone: false,
  init: function() {
      
    if (!yPvrBroadcastDetails.initDone){
        
        $("#pvrDetailsPrev").button().unwrap();
        $("#pvrDetailsNext").button().unwrap();
        $("#pvrDetailsPrev").button("enable"); 
        $("#pvrDetailsNext").button("enable");  
        
        $("#pvrDetailsPlayItem").click(function(e) {
            e.stopImmediatePropagation();
            yPvrBroadcastDetails.playBroadcast($(this).attr('data-yPlayBroadcastID'));
        }); 
        
        $("#pvrDetailsPlayChannel").click(function(e) {
            e.stopImmediatePropagation();
            yCore.sendJsonRPC(
                'PlayTVChannelID',
                '{"jsonrpc":"2.0", "method":"Player.Open", "params": { "item": {"channelid":' + $(this).attr('data-yPlayChannelID') + '}, "options":{}}, "id":1}',
                ''
            );
            yRemote.updateLastPlayingFile("channelID",$(this).attr('data-yPlayChannelID'));
        });
        
        $("#pvrDetailsClose").click(function(e) {
            e.stopImmediatePropagation();
            window.history.back();
        });
        
        $("body").delegate("#pvrDetailsPrev", "click", function(e){
            e.stopImmediatePropagation();
            yPvrBroadcastDetails.populateBroadcastDetails($(this).attr('data-yID'),null, $("#pvr-details").attr("data-yBoradcastListtype"));
        });
        
        $("body").delegate("#pvrDetailsNext", "click", function(e){
            e.stopImmediatePropagation();
            yPvrBroadcastDetails.populateBroadcastDetails($(this).attr('data-yID'), null, $("#pvr-details").attr("data-yBoradcastListtype"));
        });

        $("#pvr-details").on( "swipeleft swiperight",  function(e) {
            if (e.type === "swipeleft" && $("#pvrDetailsNext").attr('data-yID') != "") {
                e.stopImmediatePropagation();
                yPvrBroadcastDetails.populateBroadcastDetails($("#pvrDetailsNext").attr('data-yID'), null, $("#pvr-details").attr("data-yBoradcastListtype"));
            } else if (e.type === "swiperight" && $("#pvrDetailsPrev").attr('data-yID') != "") {
                e.stopImmediatePropagation();
                yPvrBroadcastDetails.populateBroadcastDetails($("#pvrDetailsPrev").attr('data-yID'), null, $("#pvr-details").attr("data-yBoradcastListtype"));
            }
        });        
        
        yPvrBroadcastDetails.initDone = true;
    }
  },
  /* broadcastID = Kodi Broadcast ID, channelID = kodi channelID; broadcastListType can be: channel (next is next broadcast ID), pvrTVSearch*/
  populateBroadcastDetails: function (broadcastID, channelID, broadcastListType){
        yPvrBroadcastDetails.init();
        var recording = "";
        var percentageBar = " <div class='percentageBar'><div class='percentageBarInside' style='width:0%'></div></div> ";
        
        $("#pvr-details").attr("data-yBoradcastListtype", broadcastListType);
        
        $("#pvrDetailsPlayItem").hide();
        $("#pvrDetailsPlayChannel").hide();
        $("#pvrDetailsEpisode").hide();
        $("#pvrDetailsYear").show();
        
        yCore.sendJsonRPC(
            'getPVR-BroadCastDetail',
            '{"jsonrpc": "2.0", "id": 1, "method": "PVR.GetBroadcastDetails", "params":{"broadcastid" : ' + broadcastID + ', "properties":["title", "plot", "starttime", "endtime", "runtime", "progresspercentage", '
                + '"genre", "episodename", "episodenum", "hastimer", "isactive",  "wasactive", "thumbnail", "year", "hastimerrule",  "hasrecording", "recording", "isseries"]}}',
            function(resultDetails){
                $("#pvrDetailsImage").hide();
                if(!yS.yS.hidePrevPics){
                    $("#pvrDetailsImage").show(); 
                    $("#pvrDetailsImage").attr(
                        "src",resultDetails["result"]["broadcastdetails"]["thumbnail"]
                    );
                }
                
                if (resultDetails["result"]["broadcastdetails"]["hastimer"] || resultDetails["result"]["broadcastdetails"]["hastimerrule"]|| resultDetails["result"]["broadcastdetails"]["recording"]) {
                    recording += "<i class='icon-stopwatch red'></i>";
                }
                if (resultDetails["result"]["broadcastdetails"]["hasrecording"]) {
                    recording += "<i class='red recording'><span class='icon-simplybuilt'></span></i> ";
                }                
                $("#pvrDetailsTitle").html(
                    recording + resultDetails["result"]["broadcastdetails"]["title"]                    
                ); 
                if (resultDetails["result"]["broadcastdetails"]["isseries"]) {
                    $("#pvrDetailsEpisode").html(resultDetails["result"]["broadcastdetails"]["episodename"] 
                        + " ("+resultDetails["result"]["broadcastdetails"]["year"] + "x" + resultDetails["result"]["broadcastdetails"]["episodenum"] + ")"); 
                    $("#pvrDetailsEpisode").show();
                    $("#pvrDetailsYear").hide();
                }
                $("#pvrDetailsYear").html($.t("year", {yYear: resultDetails["result"]["broadcastdetails"]["year"]}));
                
                if (resultDetails["result"]["broadcastdetails"]["isactive"] || resultDetails["result"]["broadcastdetails"]["wasactive"]) {
                    percentageBar = " <div class='percentageBar'><div class='percentageBarInside' style='width:" + resultDetails["result"]["broadcastdetails"]["progresspercentage"]+ "%'></div></div> ";
                }
                $("#pvrDetailsTimeRuntime").html(
                    resultDetails["result"]["broadcastdetails"]["starttime"].split(' ')[0] + " " + resultDetails["result"]["broadcastdetails"]["runtime"] + "'<br />" 
                    + ((parseInt(resultDetails["result"]["broadcastdetails"]["starttime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24) 
                    + ":" + resultDetails["result"]["broadcastdetails"]["starttime"].split(' ')[1].split(":")[1]
                    + " -" + percentageBar 
                    + ((parseInt(resultDetails["result"]["broadcastdetails"]["endtime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24) 
                    + ":" + resultDetails["result"]["broadcastdetails"]["endtime"].split(' ')[1].split(":")[1]
                );
                $("#pvrDetailsGenres").text($.t("genres", {yGenres: resultDetails["result"]["broadcastdetails"]["genre"].toString()}));
                $("#pvrDetailsPlot").html(resultDetails["result"]["broadcastdetails"]["plot"]);
                
                if (resultDetails["result"]["broadcastdetails"]["wasactive"]) {
                    $("#pvrDetailsPlayItem").attr("data-yPlayBroadcastID", resultDetails["result"]["broadcastdetails"]["broadcastid"]);
                    $("#pvrDetailsPlayItem").show();
                }
                
                if(channelID) {
                    if (resultDetails["result"]["broadcastdetails"]["isactive"]) {
                        $("#pvrDetailsPlayChannel").attr("data-yPlayChannelID", channelID);
                        $("#pvrDetailsPlayChannel").show();
                    }
                }
                
                if(broadcastListType == "pvrTVSearch" ) {
                    
                    for (var i = 0; i < yPvrTVSearch.currentList.length; i++) {
                        if(yPvrTVSearch.currentList[i]["broadcastid"] == broadcastID) {
                            if(yPvrTVSearch.currentList[i-1] === undefined) {$("#pvrDetailsPrev").button('disable');}
                            else {$("#pvrDetailsPrev").attr("data-yID", yPvrTVSearch.currentList[i-1]["broadcastid"]);$("#pvrDetailsPrev").button("enable");}
                            
                            if(yPvrTVSearch.currentList[i+1] === undefined) {$("#pvrDetailsNext").button('disable');}
                            else {$("#pvrDetailsNext").attr("data-yID", yPvrTVSearch.currentList[i+1]["broadcastid"]);$("#pvrDetailsNext").button("enable");}
                            break;
                        }
                    }
                }
                else if (broadcastListType == "channel" || broadcastListType == "pvrTVProgram") {
                    $("#pvrDetailsPrev").attr("data-yID", parseInt(broadcastID)-1);
                    $("#pvrDetailsNext").attr("data-yID", parseInt(broadcastID)+1);
                }
                else {
                    $("#pvrDetailsPrev").button("disable");
                    $("#pvrDetailsNext").button("disable");
                }
            }
        );
  },
  playBroadcast: function (broadcastID){
    yCore.sendJsonRPC(
        'PlayTVBroadcastID',
        '{"jsonrpc":"2.0", "method":"Player.Open", "params": { "item": {"broadcastid":' + broadcastID + '}, "options":{}}, "id":1}',
        ''
    );
    yRemote.updateLastPlayingFile("broadcastID",broadcastID);
  }
}

/* Show details of a tv recording */
var yPvrRecordingDetails = {
  initDone: false,
  init: function() {
      
    if (!yPvrRecordingDetails.initDone){
        $("#pvrRecDetailsPrev").button().unwrap();
        $("#pvrRecDetailsNext").button().unwrap();
        $("#pvrRecDetailsPrev").button("enable"); 
        $("#pvrRecDetailsNext").button("enable");  
        
        $("#pvrRecDetailsPlayItem").click(function(e) {
            e.stopImmediatePropagation();
            yPvrRecordings.playRecording($(this).attr('data-yRecordingID'));
        }); 
        
        $("#pvrRecDetailsClose").click(function(e) {
            e.stopImmediatePropagation();
            window.history.back();
        });
        
        $("body").delegate("#pvrRecDetailsPrev", "click", function(e){
            e.stopImmediatePropagation();
            yPvrRecordingDetails.populateRecordingDetails($(this).attr('data-yRecordingID'));
        });
        
        $("body").delegate("#pvrRecDetailsNext", "click", function(e){
            e.stopImmediatePropagation();
            yPvrRecordingDetails.populateRecordingDetails($(this).attr('data-yRecordingID'));
        });

        $("#pvr-recording-details").on( "swipeleft swiperight",  function(e) {
            if (e.type === "swipeleft" && $("#pvrRecDetailsNext").attr('data-yRecordingID') != "") {
                e.stopImmediatePropagation();
                yPvrRecordingDetails.populateRecordingDetails($("#pvrRecDetailsNext").attr('data-yRecordingID'));
            } else if (e.type === "swiperight" && $("#pvrRecDetailsPrev").attr('data-yRecordingID') != "") {
                e.stopImmediatePropagation();
                yPvrRecordingDetails.populateRecordingDetails($("#pvrRecDetailsPrev").attr('data-yRecordingID'));
            }
        });        
        
        yPvrRecordingDetails.initDone = true;
    }
  },
  /* recordingID = Kodi Recording ID*/
  populateRecordingDetails: function (recordingID){
        yPvrRecordingDetails.init();
        var seenAndResume = "";
        var showTitle = "";
                
        $("#pvrDetailsPlayItem").hide();
        $("#pvrDetailsEpisode").hide();
        $("#pvrDetailsYear").show();
        
        yCore.sendJsonRPC(
            'getPVR-RecordingDetail',
            '{"jsonrpc": "2.0", "id": 1, "method": "PVR.GetRecordingDetails", "params":{"recordingid" : ' + recordingID + ', "properties":["title", "showtitle", "plot",  "runtime", "starttime",'
                + '"genre", "season", "episode", "art", "icon", "playcount", "resume"]}}',
            function(resultDetails){
                var details = resultDetails["result"]["recordingdetails"];
                
                $("#pvrRecDetailsImage").hide();
                if(!yS.yS.hidePrevPics){
                    $("#pvrRecDetailsImage").show();
                    $("#pvrRecDetailsImage").attr(
                        "src",yTools.imageUrlNormalizer(details["art"]["icon"], "?")
                    );
                } 
                
                /* TODO replace this as soon as green tick apear, this out-commentedbelow, also implement in list view of all recordings*/
                if(details["playcount"]>0){
                    seenAndResume += "<i class='icon-check green'></i> ";
                }
                                
                /* TODO this is not supported by kodi right now, prepaired for later use, also action listener for changing status
                if(details["playcount"]>0){
                    seenAndResume += "<i class='icon-check-square-o green clickable' id='toggleRecordingUnSeen' data-yRecordingId='" + recordingID + "'></i> ";
                } else {
                    seenAndResume += "<i class='icon-square-o clickable' id='toggleRecordingSeen' data-yRecordingId='" + recordingID + "'></i> ";    
                }*/

                if(details["resume"] !== undefined && details["resume"]["position"]>0){
                    seenAndResume += "<i class='icon-clock-o orange'></i> ";
                }
                
                $("#pvrRecDetailsTitle").html(seenAndResume + details["title"]); 
                
                if (details["showtitle"] != "") {showTitle += details["showtitle"];}
                    
                if(details["season"] != -1 && details["episode"] != -1) {
                    if (details["season"] == -1) {showTitle = " (" + details["episode"] + ")"}
                    else if (details["episode"] == -1) {showTitle = " (" + details["season"] + ")"}
                    else {showTitle = " (" + details["season"] + "x" + details["episode"] + ")"}
                }
                
                $("#pvrRecDetailsEpisode").html(showTitle); 
                
                $("#pvrRecDetailsTimeRuntime").html(
                    details["starttime"].split(' ')[0] + " " + (details["runtime"]/60) + "'<br />" 
                );
                
                $("#pvrRecDetailsGenres").text($.t("genres", {yGenres: details["genre"].toString()}));
                $("#pvrRecDetailsPlot").html(details["plot"]);
                
                $("#pvrRecDetailsPlayItem").attr("data-yRecordingID",recordingID);
                
                //when you start from tags, next and prev do not work properly, because recodrings get added multple times. Here it searches only for first appeaence
                //if you start from a later apearend of the id, this does not work. let's life with it
                for (var i = 0; i < yPvrRecordings.currentList.length; i++) {
                    if(yPvrRecordings.currentList[i] == recordingID) {
                        if(yPvrRecordings.currentList[i-1] === undefined) {$("#pvrRecDetailsPrev").button('disable');}
                        else {$("#pvrRecDetailsPrev").attr("data-yRecordingID", yPvrRecordings.currentList[i-1]);$("#pvrRecDetailsPrev").button("enable");}
                        
                        if(yPvrRecordings.currentList[i+1] === undefined) { $("#pvrRecDetailsNext").button('disable');}
                        else { $("#pvrRecDetailsNext").attr("data-yRecordingID", yPvrRecordings.currentList[i+1]); $("#pvrRecDetailsNext").button("enable");}
                        break;
                    }
                }
            }
        );
  }
}

var yPvrChannelDetails = {
  initDone: false,
  playNow: -1,
  init: function() {
      
    if (!yPvrChannelDetails.initDone){
        
        $("#pvrChannelDetailsClose").click(function(e) {
            e.stopImmediatePropagation();
            window.history.back();
        });        
        
        $("body").delegate(".pvrTVopenBroadcast", "click", function(e){
            e.stopImmediatePropagation();
            yPvrBroadcastDetails.populateBroadcastDetails($(this).attr('data-yPVRBroadcastID'), $(this).attr('data-yPVRChannelID'), "channel");
            $.mobile.navigate("#pvr-details");
        });
        
        yPvrChannelDetails.initDone = true;
    }
  },
  populateChannelDetails: function (channelID) {
    $("#loading_pvr-channel").show();
    yPvrChannelDetails.init();
    
    $("#pvr-channel-list").empty();
    
    var channelLogoImagePath = ""
      
    yCore.sendJsonRPC(
        'getPVR-ChannelDetail',
        '{"jsonrpc":"2.0","method":"PVR.GetChannelDetails","id":"1","params":{"channelid":' + channelID + ',"properties":["thumbnail"]}}',
        function(resultDetails){
            channelLogoImagePath = resultDetails["result"]["channeldetails"]["thumbnail"];
        }
    );
    
    //Set timeout, because page is not loaded before getting broadcasts. so give a little time
    //so that the page with loading logo shows
    setTimeout(function(){
        yCore.sendJsonRPC(
            'getPVR-ChannelDetail-Broadcasts',
            '{"jsonrpc":"2.0","method":"PVR.GetBroadcasts","id":"1","params":{"channelid":' + channelID + ',"properties": '
            + '["title","runtime","starttime","endtime","progresspercentage","episodename","isactive","thumbnail","year"]}}',
            function(resultDetails){
                
                for (var i = 0; i < resultDetails["result"]["limits"]["end"]; i++) {
                    var percentage = false;
                    var percentageBar = "";
                    var episodename = "&nbsp;";
                    var year = "&nbsp;";
                    var timeLeft = "";
                    var imagetag = "";
                    var imagePathForImageTag = "";
                    
                    
                    if(!yS.yS.hidePrevPics){
                        //if there is no thumbnail, take channel logo
                        if (resultDetails["result"]["broadcasts"][i]["thumbnail"] != "") {
                            imagePathForImageTag = resultDetails["result"]["broadcasts"][i]["thumbnail"];
                        }
                        else {
                            imagePathForImageTag = channelLogoImagePath;
                        }
                        imagetag = yTools.imageUrlNormalizer(
                                            imagePathForImageTag,
                                            "?",
                                            "tag",
                                            "musicPrevPic text-center",
                                            "",
                                            true
                                        );
                    }
                    
                    if(resultDetails["result"]["broadcasts"][i]["isactive"]) {
                        yPvrChannelDetails.playNow = resultDetails["result"]["broadcasts"][i]["broadcastid"];
                    }
                    
                    percentage = resultDetails["result"]["broadcasts"][i]["progresspercentage"];
                    if (resultDetails["result"]["broadcasts"][i]["episodename"] != "") {
                        episodename = "• <i>" + resultDetails["result"]["broadcasts"][i]["episodename"] + "</i> ";
                    }
                    if (resultDetails["result"]["broadcasts"][i]["year"] != 0){
                        year = "• </i>" + resultDetails["result"]["broadcasts"][i]["year"] + "</i> ";
                    }    
                    timeLeft = resultDetails["result"]["broadcasts"][i]["runtime"] - Math.round(resultDetails["result"]["broadcasts"][i]["runtime"] / 100 * resultDetails["result"]["broadcasts"][i]["progresspercentage"]);
                    
                    if (percentage) {
                        percentageBar = "<div class='percentageBarInside' style='width:" + percentage + "%'></div>";
                    }
                    
                    $("#pvr-channel-list").append(
                        "<a id='pvr-broadcast-id-" + resultDetails["result"]["broadcasts"][i]["broadcastid"] + "' class='pvrTVopenBroadcast'"
                            + " data-yPVRBroadcastID='" + resultDetails["result"]["broadcasts"][i]["broadcastid"] + "' data-yPVRChannelID='" + channelID
                        + "' tabindex='1'>"
                            +"<div class='prevPicContainerSeries'>"
                                + imagetag
                            + "</div>"
                            + "<div class='pvr-description-box'>" 
                                + "<p>" 
                                
                                    + resultDetails["result"]["broadcasts"][i]["starttime"].split(' ')[0] + " " 
                                    + ((parseInt(resultDetails["result"]["broadcasts"][i]["starttime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24)  
                                    + ":" + resultDetails["result"]["broadcasts"][i]["starttime"].split(' ')[1].split(":")[1] 
                                    + " - " 
                                    + ((parseInt(resultDetails["result"]["broadcasts"][i]["endtime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24)  
                                    + ":" + resultDetails["result"]["broadcasts"][i]["endtime"].split(' ')[1].split(":")[1]  
                                + "</p>"
                                + "<h4>" + resultDetails["result"]["broadcasts"][i]["title"] + " </h4>"
                                + "<p>" + year + episodename +"</p>"
                                + "<div class='percentageBar'>" + percentageBar + "</div>"              
                            + "</div>"
                        +"</a>"
                    ).trigger("create");
                }
                
                $("#loading_pvr-channel").hide();
                
                //scroll to now playing item
                setTimeout(function(){
                    $('html, body').animate({
                        scrollTop: $("#pvr-broadcast-id-" + yPvrChannelDetails.playNow).offset().top
                    }, 'fast');  
                }, 1000);
            }
        );
    }, 300);
    
    
    
      
  }
}

/*
 * Plot out PVR Recordings and start them
 */
var yPvrRecordings = {
  initDone: false,
  sortItemGroupStack: [],
  currentList: [],
  init: function() {
    if (!yPvrRecordings.initDone){
    
        $("input[name='pvr-tv-recordings-radio']").filter('[value=' + yS.yS.pvrRecordingsPageSettings.sort + ']').prop('checked', true);
        $(".pvr-tv-recording-radio").checkboxradio("refresh"); //refresh radio after setting it
            
        $('.pvr-tv-recording-radio').click(function(e){
            e.stopImmediatePropagation();        
            //save change in settings
            yS.yS.pvrRecordingsPageSettings.sort = $("input[name='pvr-tv-recordings-radio']:checked").val();
            yS.saveSettingsToLocalStorage();
            yPvrRecordings.printList();
        });  
        
        $("body").delegate(".pvrTVopenRecording", "click", function(e){  //set movie information in details
            e.stopImmediatePropagation();
            yPvrRecordingDetails.populateRecordingDetails($(this).attr('data-ypvrrecordingid'));
            $.mobile.navigate("#pvr-recording-details");
        }); 
     
        yPvrRecordings.printList();
        yPvrRecordings.initDone = true;
    }        
  },
  printList: function(recordingid) {       
    $("#pvr-tv-recordings-list").empty();
    yPvrRecordings.sortItemGroupStack = [];
    var sort = ""; 
    $("#loading_tv-recording").show();

    var recordedItem = "";
    var seenAndResume = "";
    var resume = ""; //TODO Still needed?
    var recordingid = "";
    var imagetag = "";
    var showTitle = "";
    var colapsChannelPrevPic = "";
            
    for (var i= 0; i < yLib.pvrTVRecordings.length; i++) {
        
        recordedItem = "";
        seenAndResume = "";
        resume = "";
        recordingid = "";
        imagetag = "";
        showTitle = "";
        colapsChannelPrevPic = "";
        
        if(!yS.yS.hidePrevPics){
            //if there is no thumbnail, take channel logo
            if (yLib.pvrTVRecordings[i]["icon"] != "") {
                imagetag = "<img class='musicPrevPic text-center' src='" + yLib.pvrTVRecordings[i]["icon"] + "' />"
            }
            
        }             
        
        //show green Tick if played before
        if(yLib.pvrTVRecordings[i]["playcount"]>0 && yLib.pvrTVRecordings[i]["playcount"] !== undefined){
            seenAndResume += "<i class='icon-check green'></i> ";
        }

        if(yLib.pvrTVRecordings[i]["resume"] !== undefined && yLib.pvrTVRecordings[i]["resume"]["position"]>0){
            resume = yLib.pvrTVRecordings[i]["resume"]["position"];
            seenAndResume += "<i class='icon-clock-o orange'></i> ";
        }     
        
                            
        if(yLib.pvrTVRecordings[i]["season"] != -1 && yLib.pvrTVRecordings[i]["episode"] != -1) {
            if (yLib.pvrTVRecordings[i]["season"] == -1) {showTitle += " (" + yLib.pvrTVRecordings[i]["episode"] + ")"}
            else if (yLib.pvrTVRecordings[i]["episode"] == -1) {showTitle += " (" + yLib.pvrTVRecordings[i]["season"] + ")"}
            else {showTitle += " (" + yLib.pvrTVRecordings[i]["season"] + "x" + yLib.pvrTVRecordings[i]["episode"] + ")"}
        }
        
        if(yLib.pvrTVRecordings[i]["showtitle"] != ""){
            showTitle = "<p>" + yLib.pvrTVRecordings[i]["showtitle"] + showTitle + "</p>";
        }
        
        recordingid = yLib.pvrTVRecordings[i]["recordingid"];
        recordedItem = 
            "<a class='pvrTVopenRecording' data-yPVRRecordingID='" + recordingid + "' tabindex='1'>"
                +"<div>"
                    + imagetag
                + "</div>"
                + "<div>" 
                    + "<h4>" + seenAndResume + yLib.pvrTVRecordings[i]["title"] + "</h4>" 
                    + showTitle
                    + "<p>"
                        + yLib.pvrTVRecordings[i]["starttime"].split(' ')[0] + " " 
                        + ((parseInt(yLib.pvrTVRecordings[i]["starttime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24)  
                        + ":" + yLib.pvrTVRecordings[i]["starttime"].split(' ')[1].split(":")[1] 
                        + " - " 
                        + ((parseInt(yLib.pvrTVRecordings[i]["endtime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24) 
                        + ":" + yLib.pvrTVRecordings[i]["endtime"].split(' ')[1].split(":")[1]  
                    + "</p>"     
                + "</div>"
            +"</a>";
        
        //fill divisioned by date
        if($("input[name='pvr-tv-recordings-radio']:checked").val() == "date"){
            if(yPvrRecordings.sortItemGroupStack.indexOf(yLib.pvrTVRecordings[i]["starttime"].split(" ")[0]) == -1){
                yPvrRecordings.sortItemGroupStack.push(yLib.pvrTVRecordings[i]["starttime"].split(" ")[0]);
                $("#pvr-tv-recordings-list").append(
                    "<div data-role='collapsible' data-sort='" + yLib.pvrTVRecordings[i]["starttime"] + "'>"
                            + "<h3>" + yLib.pvrTVRecordings[i]["starttime"].split(" ")[0] + "</h3>"
                            + "<div id='" + yLib.pvrTVRecordings[i]["starttime"].split(" ")[0] + "'></div>" 
                    + "</div>"
                ).trigger('create');
                
                $("#" + yLib.pvrTVRecordings[i]["starttime"].split(" ")[0]).append(recordedItem).trigger('create');  
            }
            else {
                $("#" + yLib.pvrTVRecordings[i]["starttime"].split(" ")[0]).append(recordedItem).trigger('create');                            
            } 
        }

        if($("input[name='pvr-tv-recordings-radio']:checked").val() == "tag"){
            for (var j = 0; j < (yLib.pvrTVRecordings[i]["genre"].length); j++) {
                if(yPvrRecordings.sortItemGroupStack.indexOf(yLib.pvrTVRecordings[i]["genre"][j]) == -1){
                    yPvrRecordings.sortItemGroupStack.push(yLib.pvrTVRecordings[i]["genre"][j]);
                    $("#pvr-tv-recordings-list").append(
                        "<div data-role='collapsible' data-sort='" + yLib.pvrTVRecordings[i]["genre"][j] + "'>"
                                + "<h3>" + yLib.pvrTVRecordings[i]["genre"][j] + "</h3>"
                                + "<div id='" + yLib.pvrTVRecordings[i]["genre"][j].replace(/[^A-Za-z0-9_]/g, '-') + "'></div>" 
                        + "</div>"
                    ).trigger('create');
                    
                    $("#" + yLib.pvrTVRecordings[i]["genre"][j].replace(/[^A-Za-z0-9_]/g, '-')).append(recordedItem).trigger('create');  
                }
                else {
                    $("#" + yLib.pvrTVRecordings[i]["genre"][j].replace(/[^A-Za-z0-9_]/g, '-')).append(recordedItem).trigger('create');                            
                } 
            }
        }
        //fill divisioned by title
        if($("input[name='pvr-tv-recordings-radio']:checked").val() == "title"){
            if(yPvrRecordings.sortItemGroupStack.indexOf(yLib.pvrTVRecordings[i]["title"]) == -1){
                yPvrRecordings.sortItemGroupStack.push(yLib.pvrTVRecordings[i]["title"]);
                $("#pvr-tv-recordings-list").append(
                    "<div data-role='collapsible' data-sort='" + yLib.pvrTVRecordings[i]["title"] + "'>"
                            + "<h3>" + yLib.pvrTVRecordings[i]["title"] + "</h3>"
                            + "<div id='" + yLib.pvrTVRecordings[i]["title"].replace(/[^A-Za-z0-9_]/g, '-') + "'></div>" 
                    + "</div>"
                ).trigger('create');
                
                $("#" + yLib.pvrTVRecordings[i]["title"].replace(/[^A-Za-z0-9_]/g, '-')).append(recordedItem).trigger('create');  
            }
            else {
                $("#" + yLib.pvrTVRecordings[i]["title"].replace(/[^A-Za-z0-9_]/g, '-')).append(recordedItem).trigger('create');                            
            }
        }
        //fill divisioned by channel
        if($("input[name='pvr-tv-recordings-radio']:checked").val() == "channel"){
            if(yPvrRecordings.sortItemGroupStack.indexOf(yLib.pvrTVRecordings[i]["channel"]) == -1){
                yPvrRecordings.sortItemGroupStack.push(yLib.pvrTVRecordings[i]["channel"]);
                
                
                if(!yS.yS.hidePrevPics){
                    //if there is no thumbnail, take channel logo
                    if (yLib.pvrTVRecordings[i]["icon"] != "") {
                        colapsChannelPrevPic = "<img class='colapsChannelPrevPic' alt='" 
                            + yLib.pvrTVRecordings[i]["channel"] + "' src='" + yLib.pvrTVRecordings[i]["icon"] + "' />";
                    }
                    
                }
                
                $("#pvr-tv-recordings-list").append(
                    "<div data-role='collapsible' data-sort='" + yLib.pvrTVRecordings[i]["channel"] + "'>"
                            + "<h3>" + colapsChannelPrevPic + "</h3>"
                            + "<div id='" + yLib.pvrTVRecordings[i]["channel"].replace(/[^A-Za-z0-9_]/g, '-') + "'></div>" 
                    + "</div>"
                ).trigger('create');
                
                $("#" + yLib.pvrTVRecordings[i]["channel"].replace(/[^A-Za-z0-9_]/g, '-')).append(recordedItem).trigger('create');  
            }
            else {
                $("#" + yLib.pvrTVRecordings[i]["channel"].replace(/[^A-Za-z0-9_]/g, '-')).append(recordedItem).trigger('create');                            
            }
            
        }
    }
    
    if($("input[name='pvr-tv-recordings-radio']:checked").val() == "date"){
        yTools.sortCollapsible("#pvr-tv-recordings-list", "data-sort", false);
    } else {
        yTools.sortCollapsible("#pvr-tv-recordings-list", "data-sort", true);
    
    }
    
    //Search each element just printed on page an push to currentList, so that order is according to group type
    yPvrRecordings.currentList = [];
    $("#pvr-tv-recordings-list .pvrTVopenRecording").each(function(){
        yPvrRecordings.currentList.push($(this).attr('data-ypvrrecordingid'));
    });
    
    $("#loading_tv-recording").hide();
  },
  playRecording: function(recordingid) {
    yCore.sendJsonRPC(
        'GetRecordingDetails',
        '{"jsonrpc":"2.0","method":"PVR.GetRecordingDetails","id":1,"params":['
            + recordingid
        +',["resume"]]}',
        function(resultDetails){
            var answer = false;

            //if there is a resume position, ask if he wants to start there
            if(
                resultDetails["result"]["recordingdetails"]["resume"] !== undefined
                && resultDetails["result"]["recordingdetails"]["resume"]["position"]>0
            ){
                answer = confirm($.t("resume-at", {yPosition: Math.floor(resultDetails["result"]["recordingdetails"]["resume"]["position"]/60) + ":"
                                + yTools.addZeroTwoDigits(resultDetails["result"]["recordingdetails"]["resume"]["position"] % 60)})
                            );
            }

            yCore.sendJsonRPC(
                'PlayerOpen',
                '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "recordingid":  ' + recordingid + ' }, "options":{ "resume": '+answer+' } }, "id": 1 }',
                ''
            );
            yRemote.updateLastPlayingFile("recordingID",recordingid);
        }
    );
  }
}


/*
 * Plot out PVR searches and start them
 */
var yPvrTVSearch = {
  genreList: [],
  currentList: [],
  init: function() {
      
    $(".pvr-tv-recording-radio").checkboxradio(); //init Checkbox in yPvrRecordings befor init can be done
    yPvrRecordings.init(); //init Recordings, so that Recording details from search can be openened
      
    //set the radio according to setting
    $("input[name='pvr-tv-search-radio']").filter('[value=' + yS.yS.pvrTVSearchPageSettings.category + ']').prop('checked', true);
    $(".pvr-tv-search-radio").checkboxradio("refresh");
     
    if (yS.yS.pvrTVSearchPageSettings.category == "title") {
        $("#pvr-tv-search-titleField-box").show(); 
        $("#pvr-tv-search-genreSelect-box").hide(); 
        yPvrTVSearch.printList(yS.yS.pvrTVSearchPageSettings.titleField, "");    
    }
    else if (yS.yS.pvrTVSearchPageSettings.category == "tag") {
        $("#pvr-tv-search-titleField-box").hide();
        $("#pvr-tv-search-genreSelect-box").show();   
        yPvrTVSearch.printList("", yS.yS.pvrTVSearchPageSettings.genreSelect);
    }
    
    $('.pvr-tv-search-radio').click(function(e){
        e.stopImmediatePropagation();    
            
        //save change in settings
        yS.yS.pvrTVSearchPageSettings.category = $("input[name='pvr-tv-search-radio']:checked").val();
        yS.saveSettingsToLocalStorage();
        
        if (yS.yS.pvrTVSearchPageSettings.category == "title") {
            $("#pvr-tv-search-titleField-box").show(); 
            $("#pvr-tv-search-genreSelect-box").hide(); 
            yPvrTVSearch.printList($("#pvr-tv-search-titleField").val(), ""); 
        }
        else if (yS.yS.pvrTVSearchPageSettings.category == "tag") {
            $("#pvr-tv-search-titleField-box").hide();
            $("#pvr-tv-search-genreSelect-box").show();   
            yPvrTVSearch.printList("", $('#pvr-tv-search-genreSelect').val());
        } 
    }); 
    
    $("#pvr-tv-search-titleField").keyup(function() {
        if ($(this).val().length > 3) {
            yS.yS.pvrTVSearchPageSettings.titleField = $(this).val();
            yS.saveSettingsToLocalStorage();
            yPvrTVSearch.printList($(this).val(), ""); 
        }
        
    });
    
    $('#pvr-tv-search-genreSelect').change(function() {
        yS.yS.pvrTVSearchPageSettings.genreSelect = $(this).val();
        yS.saveSettingsToLocalStorage();
        
        yPvrTVSearch.printList("", $(this).val());
    });
    
    $('.pvrTVopenBroadcastItem').click(function(e){
        e.stopImmediatePropagation(); 
        yPvrBroadcastDetails.populateBroadcastDetails($(this).attr('data-yPvrBroadcastID'), $(this).attr('data-ypvrchannelid'), "pvrTVSearch");
        $.mobile.navigate("#pvr-details");
    });    

    //set the search field according to setting
    $("#pvr-tv-search-titleField").val(yS.yS.pvrTVSearchPageSettings.titleField);
    $("#pvr-tv-search-titleField").trigger('change');
    
    //fill genreselect with avialble genres
    for (var i = 0; i < yLib.pvrTVBroadcasts.length; i++) {    
        for (var j = 0; j < yLib.pvrTVBroadcasts[i]["result"]["limits"]["end"]; j++) {  
            for (var k = 0; k < yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["genre"].length; k++) {
                          
                if (!(jQuery.inArray(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["genre"][k], yPvrTVSearch.genreList) > -1)){//push if not already there
                    yPvrTVSearch.genreList.push(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["genre"][k]);
                }
            }
        }
    } 
    
    //fill genreselect and...
    for (var i=0; i < yPvrTVSearch.genreList.length; i++){  //add genre Options to selection
        $('#pvr-tv-search-genreSelect').append("<option value='" + yPvrTVSearch.genreList[i] + "'>" + yPvrTVSearch.genreList[i] + "</option>");
    }    
    
    //...sort select...
    $('#pvr-tv-search-genreSelect').append($("#pvr-tv-search-genreSelect option").sort(function(a, b) {
            var at = $(a).text(), bt = $(b).text();
            return (at > bt)?1:((at < bt)?-1:0);
    })); 
    
    //...and set the selectbox according to setting
    if ( $("#pvr-tv-search-genreSelect option[value='" + yS.yS.pvrTVSearchPageSettings.genreSelect + "']").val() !== undefined) {
        $("#pvr-tv-search-genreSelect").val(yS.yS.pvrTVSearchPageSettings.genreSelect);
        $('#pvr-tv-search-genreSelect').selectmenu('refresh');
    }
    else {
        $("#pvr-tv-search-genreSelect").val("none");
        $('#pvr-tv-search-genreSelect').selectmenu('refresh');
    }
  },
  printList: function (searchText, genre) {   
    $("#pvr-tv-search-list").empty();
    yPvrTVSearch.reduceCurrentList(searchText, genre);
    
    for (i = 0; i < yPvrTVSearch.currentList.length; i++) {
        
        var episodename = "";
        var imagetag = ""; 
        var imagePathForImageTag = "";
        var percentage = false;
        var seenAndResume = "";
        
        
        //if it's a broadcasts
        if (yPvrTVSearch.currentList[i].hasOwnProperty('broadcastid')) {
            
            if (yPvrTVSearch.currentList[i]["episodename"] != "" && yPvrTVSearch.currentList[i]["episodename"] !== "undefined") {
                episodename = yPvrTVSearch.currentList[i]["episodename"];
            }
            
            if(!yS.yS.hidePrevPics){
                //if there is no thumbnail, take channel logo
                if (yPvrTVSearch.currentList[i]["thumbnail"] != "") {
                    imagePathForImageTag = yPvrTVSearch.currentList[i]["thumbnail"];
                }
                else {
                    imagePathForImageTag = yPvrTVSearch.currentList[i]["channelThumb"];
                }
                imagetag = yTools.imageUrlNormalizer(
                                    imagePathForImageTag,
                                    "?",
                                    "tag",
                                    "musicPrevPic text-center",
                                    "",
                                    true
                                );
            }
            
            $("#pvr-tv-search-list").append(
                "<a class='pvrTVopenBroadcastItem ui-link' data-yPvrBroadcastID='" + yPvrTVSearch.currentList[i]["broadcastid"] + "' data-ypvrchannelid='" + yPvrTVSearch.currentList[i]["channelID"] + "' tabindex='1'>"
                    + "<div>" + imagetag + "</div>"
                    + "<div>"
                        + "<h4>" + yPvrTVSearch.currentList[i]["title"] + " (" + yPvrTVSearch.currentList[i]["channelLabel"] + ")</h4>"
                        + "<p>• " + yPvrTVSearch.currentList[i]["year"] + " • " + episodename + "</p>"
                        + "<p>"
                            + yPvrTVSearch.currentList[i]["starttime"].split(' ')[0] + " " 
                            + ((parseInt(yPvrTVSearch.currentList[i]["starttime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24)  
                            + ":" + yPvrTVSearch.currentList[i]["starttime"].split(' ')[1].split(":")[1] 
                            + " - " 
                            + ((parseInt(yPvrTVSearch.currentList[i]["endtime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24) 
                                + ":" + yPvrTVSearch.currentList[i]["endtime"].split(' ')[1].split(":")[1]
                        + "</p>"                      
                        + "<div class='percentageBar'><div class='percentageBarInside' style='width:" + yPvrTVSearch.currentList[i]["progresspercentage"] + "%'></div></div>"  
                    + "</div>"
                + "</a>"
            );
        }
        
        //else it's a recording
        else  {
            //show green Tick if played before
            if(yPvrTVSearch.currentList[i]["playcount"]>0 && yPvrTVSearch.currentList[i]["playcount"] !== undefined){
                seenAndResume += "<i class='icon-check green'></i> ";
            }

            if(yPvrTVSearch.currentList[i]["resume"] !== undefined && yPvrTVSearch.currentList[i]["resume"]["position"]>0){
                resume = yPvrTVSearch.currentList[i]["resume"]["position"];
                seenAndResume += "<i class='icon-clock-o orange'></i> ";
            }   
            
            if (yPvrTVSearch.currentList[i]["showtitle"] != "" && yPvrTVSearch.currentList[i]["showtitle"] !== "undefined") {
                episodename =  "<p>• " + yPvrTVSearch.currentList[i]["showtitle"]+ "</p>";
            }
            else {
             episodename = "<p>&nbsp;</p>";  
            }
            
            if(!yS.yS.hidePrevPics){
                
                //if there is no thumbnail, take channel logo
                if (yPvrTVSearch.currentList[i]["icon"] != "") {
                    imagetag = "<img class='musicPrevPic text-center' src='" + yPvrTVSearch.currentList[i]["icon"] + "' />"
                }
            }
        
            $("#pvr-tv-search-list").append(
                "<a class='pvrTVopenRecording ui-link' data-ypvrrecordingid='" + yPvrTVSearch.currentList[i]["recordingid"] + "' tabindex='1'>"
                    + "<div>" + imagetag + "</div>"
                    + "<div>"
                        + "<h4><i class='red recording'><span class='icon-simplybuilt'></span></i>" 
                            + seenAndResume + yPvrTVSearch.currentList[i]["title"] + " (" + yPvrTVSearch.currentList[i]["channel"] + ")"
                        + "</h4>"
                        + episodename
                        + "<p>"
                            + yPvrTVSearch.currentList[i]["starttime"].split(' ')[0] + " " 
                            + ((parseInt(yPvrTVSearch.currentList[i]["starttime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24)  
                            + ":" + yPvrTVSearch.currentList[i]["starttime"].split(' ')[1].split(":")[1] 
                            + " - " 
                            + ((parseInt(yPvrTVSearch.currentList[i]["endtime"].split(' ')[1].split(":")[0]) + parseInt(yS.yS.pvrTvTimeShift))%24) 
                                + ":" + yPvrTVSearch.currentList[i]["endtime"].split(' ')[1].split(":")[1]
                        + "</p>"                      
                        + "<div class='percentageBar'><div class='percentageBarInside' style='width:100%'></div></div>"  
                    + "</div>"
                + "</a>"
            );
            
        }
    }
    
    //somehow actionslistener does not get updates. Do it again.
    $( ".pvrTVopenBroadcastItem" ).on( "click",  function(e) { 
        e.stopImmediatePropagation(); 
        yPvrBroadcastDetails.populateBroadcastDetails($(this).attr('data-yPvrBroadcastID'), $(this).attr('data-ypvrchannelid'), "pvrTVSearch");
        $.mobile.navigate("#pvr-details");
    });       
  },
  reduceCurrentList: function (searchText, genre) {
    var tempList = [];

    //search in Broadcastings
    for (var i = 0; i < yLib.pvrTVBroadcasts.length; i++) { 
        for (var j = 0; j < yLib.pvrTVBroadcasts[i]["result"]["limits"]["total"]; j++) {  
            
            if (searchText != "") {
                if (
                    yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["title"].toLowerCase().indexOf(searchText.toLowerCase()) >= 0 
                    && typeof yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["title"]  !== "undefined") 
                {    
                    tempList.push(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]);                      
                    continue; 
                }                    
            }
            else if (genre != "") {
                if (yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["title"] !== "undefined") {
                    for (var k = 0; k <= yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["genre"].length; k++) {
                        if(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["genre"][k] == genre) {
                            tempList.push(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]);
                        }                            
                    }
                }                    
            }
        }
    }  
    
    //search in Recordings
    for (var l = 0; l < yLib.pvrTVRecordings.length; l++) { 
        if (searchText != "") {
            if (
                yLib.pvrTVRecordings[l]["title"].toLowerCase().indexOf(searchText.toLowerCase()) >= 0 
                && typeof yLib.pvrTVRecordings[l]["title"]  !== "undefined") 
            {    
                tempList.unshift(yLib.pvrTVRecordings[l]); //instead of push unshift, so that it is at the beginning                  
                continue; 
            }                    
        }
        else if (genre != "") {
            if (yLib.pvrTVRecordings[l]["title"] !== "undefined") {
                for (var m = 0; m <= yLib.pvrTVRecordings[l]["genre"].length; m++) {
                    if(yLib.pvrTVRecordings[l]["genre"][m] == genre) {
                        tempList.unshift(yLib.pvrTVRecordings[l]);//instead of push unshift, so that it is at the beginning      
                    }                            
                }
            }                    
        }
    }  
    
    yPvrTVSearch.currentList = tempList;
  }
}
  
/*
 * All functions to get music infos and the functions of the music page AND musicDetails page
 */
var yMusic = {
  albumJSON:[],
  genres: [],
  initDone:false,
  listPos: 0,
  listLength: 0,
  artistString: "",
  lastListItem: 0,
  firstListItem: [0], //keep track of trail when mooving forward in restricted list
  init: function() {

    if(yS.yS.hideSearchMusic){$("#searchMusic").parent().hide();} //hide Search field if set in settings
    if(yS.yS.hideGenreMusic){$("#MusicGenreElements").hide();} //hide  genre selection and play genre Button  field if set in settings
    
    if (!yMusic.initDone){
        yMusic.initDone = true;        
        yMusic.createAlbumList(0, yS.yS.musicPageSettings.genreselect, $("#searchMusic").val()); //create albumlist according to options
    }

    $("body").delegate("#playMusicGenre", "click", function(e){
        e.stopImmediatePropagation();
        yMusic.playMusicFiltered("genre", $('#genreSelectMusic').val());
    });

    $( "#album_list" ).on( "swipeleft swiperight",  function( e ) { 
        if (e.type === "swipeleft" && $("#album-flex-next").is(':visible')) {
            e.stopImmediatePropagation();
                yMusic.albumListNext();
        } else if (e.type === "swiperight" && $("#album-flex-prev").is(':visible')) {
                e.stopImmediatePropagation();
                yMusic.albumListPrev();
        }
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

    $("body").delegate("#emptyPlaylistMusic", "click", function(e){
        $('#emptyPlaylistMusic').text($.t("done")).button("refresh");
        setTimeout(function(){$('#emptyPlaylistMusic').text($.t("empty-pl")).button("refresh");}, 1500); //change text back in 1.5 seconds
        yPl.emptyPlaylist();
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
        yMusic.albumListPrev();
    });

    $("body").delegate("#albumListNext", "click", function(e){  
        e.stopImmediatePropagation();
        yMusic.albumListNext();
    });
    
    //set the selectbox according to setting
    $('#genreSelectMusic').val(yS.yS.musicPageSettings.genreselect);
    $('#genreSelectMusic').selectmenu('refresh');
    
  },
  /*
   * function calles with the "previous" button in a album List or a swipe-right
   * prepares for previous items to show from the list
   */
  albumListPrev: function(){
      yMusic.listPos = yMusic.firstListItem.pop();//if one back, remove item from trail-array
      $('#album_list').empty();
      $("#album-flex-prev").empty();
      $("#album-flex-next").empty();
      yMusic.createAlbumList(yMusic.listPos, $('#genreSelectMusic').val(), $("#searchMusic").val());

      //scroll to top
      $('html,body').animate({scrollTop: $("#music").offset().top},'fast');
  },
  /*
   * function calles with the "previous" button in a album List or a swipe-right
   * prepares for previous items to show from the list
   */
  albumListNext: function(){
      yMusic.listPos = yMusic.lastListItem + 1;//befor creating new list remeber the position where to start

      yMusic.firstListItem.push(parseInt($( "#album_list" ).children().eq(0).attr('data-yAlbumArrayID')));

      $('#album_list').empty();
      $("#album-flex-prev").empty();
      $("#album-flex-next").empty();
      yMusic.createAlbumList(yMusic.listPos, $('#genreSelectMusic').val(), $("#searchMusic").val());

      //scroll to top
      $('html,body').animate({scrollTop: $("#music").offset().top},'fast');
  },
  /*
   * create the music list according to the selections (genre and searchfield)
   */
  createAlbumList: function (listStart, genre, searchval) {

    var selectedGenre = genre;
    var albumGenreInItem;
    itemsInList = 0; //needed to find out, how many items are shown, so that if list is restricted we know if next button has to be shown

        yMusic.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button

        if(yS.yS.listLength > yLib.musicAlbums["result"]["limits"]["end"]){
            yMusic.listLength = yLib.musicAlbums["result"]["limits"]["end"];
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
        for (var i = 0; i < (yLib.musicAlbums["result"]["limits"]["end"]); i++) { //all albums
            for (var j=0; j < yLib.musicAlbums["result"]["albums"][i]["genre"].length; j++){ //all genres in albums
                if (selectedGenre == yLib.musicAlbums["result"]["albums"][i]["genre"][j]){
                    albumGenreInItem = 1;  //remember it, if album has the selected genre
                }
            }
            //show only elements with the given genre
            if(selectedGenre == "all" || albumGenreInItem == 1){

                // show only titles and artists (so far only first in artistsarray) matched to searchstring, also partly
                // artistToString is used, for the case, that there is no artist (it gives back "?")
                if(searchval === undefined || yLib.musicAlbums["result"]["albums"][i]["title"].toLowerCase().indexOf(searchval.toLowerCase()) != -1 || yTools.artistsToString(yLib.musicAlbums["result"]["albums"][i]["artist"]).toLowerCase().indexOf(searchval.toLowerCase()) != -1){

                    //skip what should not be seen
                    if(i >= yMusic.listPos && itemsInList < yMusic.listLength){

                      $("#album_list").append(
                          "<a class='showAlbum' data-yAlbumArrayID='" + i + "'>"
                            +" <div class='' data-yAlbumArrayID='" + i + "'>"
                                + "<span class='prevPicContainerMusic'>"
                                  + yTools.imageUrlNormalizer(
                                      yLib.musicAlbums["result"]["albums"][i]["thumbnail"],
                                      "?",
                                      "tag",
                                      "musicPrevPic text-center",
                                      ""
                                    )
                                + "</span>"
                                + "<div>"
                                  + "<h4>" + yLib.musicAlbums["result"]["albums"][i]["title"] + "</h4>"
                                    +" <p class='musicListArtist'>" +  yTools.artistsToString(yLib.musicAlbums["result"]["albums"][i]["artist"]) + "</p>"
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
  },
  /*
   * runs if an album is opened
   */
  showAlbum: function (albumArrayNr) {
    $("#albumDetailsSongContainer").empty();
    yCore.sendJsonRPC(
      'GetSongs',
      '{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { "properties": ["title", "artist", "genre", "track", "duration", "album", "thumbnail"], "filter": { "albumid" : ' + yLib.musicAlbums["result"]["albums"][albumArrayNr]["albumid"] + '} }, "id": 1}',
      function(resultGetSongsAlbum){
        $("#albumDetailsAddAlbum").attr("data-yAlbumArrayNr",albumArrayNr);

                $("#albumDetailsTitle").text( yTools.artistsToString(yLib.musicAlbums["result"]["albums"][albumArrayNr]["artist"]) + ": "
            + yLib.musicAlbums["result"]["albums"][albumArrayNr]["label"]);

        if(yLib.musicAlbums["result"]["albums"][albumArrayNr]['thumbnail'] == "" || yS.yS.hidePrevPics){
          $("#albumDetailsImage").hide();
        } else {
          $("#albumDetailsImage").attr("src", yTools.imageUrlNormalizer(yLib.musicAlbums["result"]["albums"][albumArrayNr]['thumbnail'], "?"));
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
      '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 0 , "item" : {"albumid" : ' + yLib.musicAlbums["result"]["albums"][albumJsonNr]["albumid"] + '} }, "id": 1}',

      function(){
        yCore.sendJsonRPC(
          'PlayerOpen',
          '{ "jsonrpc": "2.0", "method": "Player.Open", "params": {"item":{"playlistid":0},"options":{"repeat":"off"}}, "id": 1 }',
          ''
        )
      }
    );
    yRemote.updateLastPlayingFile("albumID",yLib.musicAlbums["result"]["albums"][albumJsonNr]["albumid"]);
  },
  /*
   * Play specific music genre, get songs by genre, then start the playlist, after that set it to shuffle       
   * if there is an empty string for genre, it just plays all music randomly
   */
  playMusicFiltered: function (filterType, item) {
    yPl.emptyPlaylist();
    var filter = "";
    
    if (filterType != "") {
        filter = ',"filter":{"' + filterType + '":"' + item + '"}';
    }
 
    yCore.sendJsonRPC(
        'GetSongs',
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { "properties": ["title"] ' + filter + '}, "id": 1}',
        function(resultGetSongsByGenre){
            for (var i = 0; i < (resultGetSongsByGenre["result"]["limits"]["end"]); i++) {
                yCore.sendJsonRPC(
                    'PlaylistAdd',
                    '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 0 , "item" : {"songid" : '
                        + resultGetSongsByGenre["result"]["songs"][i]["songid"] + '} }, "id": 1}',
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
    
    setTimeout(function(){
        yCore.sendJsonRPC(
          'SetShuffle-on',
          '{"jsonrpc": "2.0", "method": "Player.SetShuffle", "params": { "playerid": ' 
            + yCore.activePlayer + ', "shuffle": true }, "id": 1}',
          ' '
        );
    }, 1600);    
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
      yRemote.updateLastPlayingFile("songID",songid);
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
      yMusic.playSong($(this).attr('data-ySongId'));
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
                              "simpleListPrevPic",
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
var yFav = {
  already_run: false,
  init: function() {
        yFav.openKodiFavs(false);
       
        $("#favDetailsRefresh").click(function(e) {
            
            e.stopImmediatePropagation();
            yFav.openKodiFavs(false);
                                                
            //scroll to top of addon
            $('html,body').animate({scrollTop: $("#fav").offset().top},'slow');
        });

        $("#favDetailClose").click(function(e) {
            e.stopImmediatePropagation();
            window.history.back();
        });

        $("body").delegate(".showAddonDirItem", "click", function(e){
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
                yRemote.updateLastPlayingFile("file",$(this).attr('data-yAddonFile'));

            } 
            else if ($(this).attr('data-yAddonFileType') == "directory" || $(this).attr('data-yAddonFileType') == "window"){
                $("#addonDetailsList").empty();
                if( $(this).attr('data-yAddonIsBack') == "back"){
                    yAddons.addonBackPath.pop();yAddons.addonBackPath.pop();
                }
                
                yAddons.populateAddon($(this).attr('data-yAddonFile'), $(this).attr('data-yAddonFanartPath'));
                $.mobile.navigate("#addonDetails");
            }
        });
      
  },
  openKodiFavs: function(isShowListIdAndSpeechHelp){
      
        $("#favDetailsList").empty();
      
        $("#favDetailsRefresh").hide();
        
        $.when(
            yLib.getFavourites(isShowListIdAndSpeechHelp))
        .then(function() {
                for(var i = 0; i < yLib.favourites.length; i++) {
                    
                    var pathToFileOrPlace = "";
                    var indexNumber = "";
                    if(isShowListIdAndSpeechHelp){
                        indexNumber = "[" + (i+1) + "] " ;
                    }
                    
                    if(yLib.favourites[i]["type"] == "window"){
                        pathToFileOrPlace = yLib.favourites[i]["windowparameter"];
                    } else if(yLib.favourites[i]["type"] == "media") {
                        pathToFileOrPlace = yLib.favourites[i]["path"];
                    }

                    //replace all backslashes with double backslashes
                    pathToFileOrPlace = pathToFileOrPlace.replace(/\\/g,"\\\\");

                    var imagetag = "";
                    
                    //since Kodi delivers direct link to the thumb instead as the usual local path,
                    //local stored pics are not shown. I do not differenciate
                    if(!yS.yS.hidePrevPics){
                        imagetag = yTools.imageUrlNormalizer(
                                    yLib.favourites[i]["thumbnail"],
                                    yLib.favourites[i]["type"],
                                    "tag",
                                    "addonDirPrevPic text-center",
                                    "",
                                    true //direct link
                                    );
                    }
                                        
                    $("#favDetailsList").append(
                        "<a class='showAddonDirItem'"
                            + " data-yAddonFile='" + pathToFileOrPlace
                            + "' data-yAddonFileType='" + yLib.favourites[i]["type"]
                            + "' data-yAddonFileResume='0"
                            + "' data-yAddonIsBack='' data-yAddonFanartPath='"
                            + yTools.imageUrlNormalizer(yLib.favourites[i]["thumbnail"], yLib.favourites[i]["type"])
                        + "' tabindex='1'>"
                            +"<div class='addonDirItem yListItem' tabindex='1'>"
                                +"<div class='addonDirItemLeft' tabindex='1'>"
                                    + "<span class='addonDirPrevPicContainer'>" + imagetag + "</span>"
                                    + "<h4>"+ indexNumber + yLib.favourites[i]["title"] + "</h4>"
                                + "</div>"
                                + "<div class='addonFavDelete' data-yContextShown='0' tabindex='1'><h3><i class='icon-times'></i></h3></div>"
                            +"</div>"
                        +"</a>"
                    );
                }

                //if there are no relevant children (backbutton is not relevant), say so
                if ($("#addonDetailsList").children().length <= 1 ){
                    $("#addonDetailsList").append($.t("no-matching"));
                }

                yAddons.addonBackPath.push(["plugin.kodi.kodi_fav" , ""]);

                $("#addonDetails").attr('data-yAddonname', "plugin.kodi.kodi_fav");
                if(yS.yS.libAddons.hasOwnProperty($("#addonDetails").attr('data-yAddonname'))){
                    $("#addonDetailsShowPlot").prop(
                        'checked', yS.yS.libAddons[$("#addonDetails").attr('data-yAddonname')]["addonDetailsShowPlot"]
                    ).checkboxradio("refresh");
                }

                $("#loading_fav").hide();
                $("#favDetailsRefresh").show();
            
        });
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
      
      //get deactivetaded addons delete properties in settings, so that it won't show up after relaoding the interface in Startpage 
      yCore.sendJsonRPC(
        'GetDeactivatedAddons',
        '{"jsonrpc": "2.0", "method": "Addons.GetAddons", "params": { "enabled": false, "type" : "xbmc.python.pluginsource", "properties": ["name", "thumbnail", "fanart"]}, "id": 1}',
        function(resultGetDeactivatedAddons){
          for (var i = 0; i < (resultGetDeactivatedAddons["result"]["limits"]["end"]); i++) {
            if (yS.yS.libAddons.hasOwnProperty(resultGetDeactivatedAddons["result"]["addons"][i]["addonid"])) {
              delete yS.yS.libAddons[resultGetDeactivatedAddons["result"]["addons"][i]["addonid"]];
            }
          }
          
          yS.saveSettingsToLocalStorage();

        }
      );
      
      yCore.sendJsonRPC(
        'GetAddons',
        '{"jsonrpc": "2.0", "method": "Addons.GetAddons", "params": { "enabled": true, "type" : "xbmc.python.pluginsource", "properties": ["name", "thumbnail", "fanart"]}, "id": 1}',
        function(resultGetAddons){
          yAddons.addonJSON = resultGetAddons;
          //check if there are settings for each plugin. if not, create them and save it to local storage
          for (var i = 0; i < (yAddons.addonJSON["result"]["limits"]["end"]); i++) {
            if (!(yS.yS.libAddons.hasOwnProperty(yAddons.addonJSON["result"]["addons"][i]["addonid"]))) {
              yS.yS.libAddons[yAddons.addonJSON["result"]["addons"][i]["addonid"]] = {opens: 1,addonDetailsShowPlot:false};
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

        $("#addonDetailsList").empty();
        $("#addonDetailsImage").attr("src","");
        yAddons.populateAddon("plugin://" +$(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'));

        $.mobile.navigate("#addonDetails");

        //increment addon startcount in settings by 1 and save it to local storage
        yS.yS.libAddons[$(this).attr('data-yAddonID')]["opens"] += 1;
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
      yAddons.addonListPrev();
    });

    $("body").delegate("#addonListNext", "click", function(e){  //checkbox select/unselect reverser
      e.stopImmediatePropagation();
      yAddons.addonListNext();
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
      if(yS.yS.libAddons.hasOwnProperty($("#addonDetails").attr('data-yAddonname'))){
                yS.yS.libAddons[$("#addonDetails").attr('data-yAddonname')]["addonDetailsShowPlot"] = $(this).is(':checked');
                yS.saveSettingsToLocalStorage();
            }
    });

    $( "#addonDetailsList" ).on( "swiperight",  function( e ) {
      if (e.type === "swiperight") {
		    e.stopImmediatePropagation();
        
        var backFilepath = $("#back").attr('data-yAddonFile'); 
        var backFanartPath = $("#back").attr('data-yAddonFanartPath');

        //if there was no data pushed, go back to addon overview, otherwise stay in details
        if(yAddons.addonBackPath.length == 2 && $("#back").attr('data-yAddonIsBack') == "back"){
          yAddons.addonBackPath = [["plugin://Addons.Home.yarc/",""]];
          window.history.back();
        } else if(backFilepath == "plugin.kodi.kodi_fav"){
          $("#addonDetailsList").empty();
          yAddons.addonBackPath.pop();yAddons.addonBackPath.pop();
          yAddons.openKodiFavs(backFilepath, backFanartPath, false);
        } else {
          $("#addonDetailsList").empty();
          yAddons.addonBackPath.pop();yAddons.addonBackPath.pop();
          yAddons.populateAddon(backFilepath, backFanartPath);
        }

        //scroll to top of addon
        $('html,body').animate({scrollTop: $("#addonDetails").offset().top},'slow');

      }
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
                     yRemote.updateLastPlayingFile("file",filePath);

                } else if ($(this).attr('data-yAddonFileType') == "directory" || $(this).attr('data-yAddonFileType') == "window"){
                    $("#addonDetailsList").empty();
                    if($(this).attr('data-yaddonfile') == "plugin.kodi.kodi_fav"){
                        if( $(this).attr('data-yAddonIsBack') == "back"){
                            yAddons.addonBackPath.pop();yAddons.addonBackPath.pop();
                        }
                        yAddons.openKodiFavs($(this).attr('data-yAddonID'), $(this).attr('data-yAddonFanartPath'), false);
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



        $( "#addonlist" ).on( "swipeleft swiperight",  function( e ) { 
	        if (e.type === "swipeleft" && $("#addon-flex-next").is(':visible')) {
                e.stopImmediatePropagation();
                yAddons.addonListNext();
	        } else if (e.type === "swiperight" && $("#addon-flex-prev").is(':visible')) {
                e.stopImmediatePropagation();
     		    yAddons.addonListPrev();
	        }
        });
  },
  /*
   * function calles with the "previous" button in a addon List or a swipe-right
   * prepares for previous items to show from the list
   */
  addonListPrev: function(){
    yAddons.listPos -= yS.yS.listLength;
    $("#addonlist").empty();
    $("#addon-flex-prev").empty();
    $("#addon-flex-next").empty();
    yAddons.createAddonList(yAddons.listPos, $('#addonSelect option:selected').attr('value'), $("#searchAddon").val());

    //scroll to top
    $('html,body').animate({scrollTop: $("#addons").offset().top},'fast');
  },
  /*
   * function calles with the "previous" button in a addon List or a swipe-right
   * prepares for previous items to show from the list
   */
  addonListNext: function(){ 
      yAddons.listPos += yS.yS.listLength;
      $("#addonlist").empty();
      $("#addon-flex-prev").empty();
      $("#addon-flex-next").empty();
      yAddons.createAddonList(yAddons.listPos, $('#addonSelect option:selected').attr('value'), $("#searchAddon").val());

      //scroll to top
      $('html,body').animate({scrollTop: $("#addons").offset().top},'fast');
  },
  /*
   * creates addonselection according to type selection and or search string
   */
  createAddonList: function(listStart, addonTypeSelected, searchval){

    var itemsInList = 0; //needed to find out, how many items are shown, so that if list is restricted we know if the next-button has to be shown
   //still needed?  yAddons.listPos = listStart; //needed, that in initalaition by restriction, list starts at 0, but not if next or prev button

    if(yAddons.addonJSON["result"]["limits"]["total"] == 0){
      $("#addonlist").append("<li><h3>" + $.t("pl-empty") + "</h3></li>").trigger("create");
      $("#loading_addon").hide();
    } else {
      if(yS.yS.listLength > yAddons.addonJSON["result"]["limits"]["end"]){
        yAddons.listLength = parseInt(yAddons.addonJSON["result"]["limits"]["end"]);
      } else{
        yAddons.listLength = parseInt(yS.yS.listLength);
      }

      if(yAddons.listPos != 0){   //only add if it's not the first page (value 999999 makes it first item
        $("#addon-flex-prev").append(
          "<li id='addonListPrev' class='flexListPrevNext'> "
            + "<span class='icon-arrow-left prev-next-arrow'></span>"
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
                                + "value='" + yS.yS.libAddons[yAddons.addonJSON["result"]["addons"][i]["addonid"]]["opens"] + "'> "
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
              + "value='" + yS.yS.libAddons[yAddons.addonJSON["result"]["addons"][i]["addonid"]]["opens"] + "'> "
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
        $("#addonSelect").selectmenu().selectmenu('refresh', true);
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
              mediatype = "music";getproperties = '"title","file","thumbnail","art","duration","size"';playListID = 0;
        }
        else if(addonIDandPath.indexOf('.video.') >= 0 || mediatype == "video") {
            mediatype = "video";getproperties = '"title","file","thumbnail","playcount","art","plot","runtime","premiered","resume","size"';playListID = 1;
        }
        else {mediatype = "files";getproperties = '"title","file","thumbnail","size"';}


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

                var itemLabel = yTools.escapeHTML(resultOpenAddon["result"]["files"][i]["label"]);

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

                    if(resultOpenAddon["result"]["files"][i]["size"] != "0" && ("size" in resultOpenAddon["result"]["files"][i])){
                    if(additionalInfo != ""){additionalInfo += "; "} 
                    additionalInfo += yTools.sizeHumanReadable(resultOpenAddon["result"]["files"][i]["size"]);    
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
                                    + "<h4>"+ seenAndResume + itemLabel + " " + additionalInfo +"</h4>"
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
            if(yS.yS.libAddons.hasOwnProperty($("#addonDetails").attr('data-yAddonname'))){
                $("#addonDetailsShowPlot").prop(
                    'checked', yS.yS.libAddons[$("#addonDetails").attr('data-yAddonname')]["addonDetailsShowPlot"]
                ).checkboxradio("refresh");
            } else {
                $("#addonDetailsShowPlot").prop('checked', false).checkboxradio("refresh");
            }

            if(
                yS.yS.libAddons.hasOwnProperty($("#addonDetails").attr('data-yAddonname'))
                && yS.yS.libAddons[$("#addonDetails").attr('data-yAddonname')]["addonDetailsShowPlot"]
                ){
                $("#addonDetailsList .addonPlot").show();
            } else {
                $("#addonDetailsList .addonPlot").hide();
            }
            
            $("#loading_addonDetails").hide();
        });
  }
}

/*
 * Module and all its functions for speech recognition
 * also functions used by lang-speech script (seperate script in resources/lang-speech/
 */
var ySpeech = {
    helpSection: "",
    init: function(){
        $('#yspeech').click(function(){
            if (annyang.isListening()){         
                $('#microphone').removeClass('icon-microphone-slash speaking');
                annyang.abort();
            }
            else { 
                annyang.start({ autoRestart: false, continuous: false });
                $('#transcript').empty();
                $('#ySpeechAction').empty();                
                $('#microphone').addClass('icon-microphone-slash speaking microphoneLarge');
            }
            
        });
        
        $('#speechhelplink').click(function(){
            
           $('#spechHelpContainer [data-role="collapsible"]').collapsible("collapse");
            
            
             if(ySpeech.helpSection != "") {
                $('#' + ySpeech.helpSection).collapsible("expand");
             }
            
            $.mobile.navigate("#speechhelp");
            
            $('html,body').animate({scrollTop: $('#' + ySpeech.helpSection).offset().top},'fast');
            
            
        });
                
        if (annyang) {
            var speechLanguage = "en-US";

            annyang.setLanguage(speechLanguage);
        
            annyang.addCallback('error', function() {
                $('#microphone').removeClass('icon-microphone-slash speaking').addClass('icon-microphone microphoneSmall');
                ySpeech.helpSection = ""; 
            });
            
            annyang.addCallback('end', function() {
                $('#microphone').removeClass('icon-microphone-slash speaking microphoneLarge');
                //if transcript not empty make mic small, else (in case of abord) make it large
                if($.trim($("#transcript").html())!==''){
                    $('#microphone').addClass('microphoneSmall');
                }
                else {
                    $('#microphone').addClass('microphoneLarge');
                }
            });
            
            annyang.addCallback('result', function(userSaid, commandText, phrases) {
                //use "userSaid[0]" if you only want the most likley transcription or for all without the brackets
                $("#transcript").append(userSaid[0]);
                $("#ySpeechAction").append('<span class="icon-caret-right"></span>&nbsp;');
            });
            
            annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
                $("#ySpeechAction").css("color", "#FFA500");
            });
            
            annyang.addCallback('resultNoMatch', function(userSaid, commandText, phrases) {                 
                $("#ySpeechAction").append($.t("no-matching"));
                $("#ySpeechAction").css("color", "red");
                ySpeech.helpSection = "";
            });
           
            $.getScript( "resources/lang-speech/" + speechLanguage + ".js", function(data, textStatus, jqxhr) {
                 annyang.addCommands(ySpeechCommands);
                 
                //Add Help texts form the varialbe ySpeechHelpTexts, which is in the js we just got                
                $.each(ySpeechHelpTexts, function(index, helpItem) {
                    $("#spechHelpContainer").append(
                        '<div id="' + helpItem.helpSection + '" data-role="collapsible" data-collapsed="true"><h3>' + helpItem.Title + '</h3><div>' + helpItem.Text + '</div></div>'
                    ).trigger("create");
                });
            });
            
        } else {
            $('#yspeech').remove();
            $('#speechhelplink').remove();
        }
    },
    favourite: function(favouriteName){
        var lowestIterationOfAll = 999999999999;
        var bestMatch = [];
        
        if(favouriteName == "list"){
            $("#addonDetailsList").empty();
            yFav.openKodiFavs(true);
            $.mobile.navigate("#fav");
            $("#ySpeechAction").append(' list on yarc');
        } 
        else {            
            for(var i = 0; i < yLib.favourites.length; i++) {
                iterationsNeeded = yTools.damerauLevenshtein(favouriteName.toLowerCase(), yLib.favourites[i].title.toLowerCase());
                if(lowestIterationOfAll > iterationsNeeded){
                    bestMatch = yLib.favourites[i];
                    lowestIterationOfAll = iterationsNeeded;
                }
            }
            
            if(bestMatch.type == "file" || bestMatch.type == "media"){

            var answer = false;
                
                /*TODO to be implemented
                
                //if there is a resume position, ask if he wants to start there
                if($(this).attr('data-yAddonFileResume') != 0){
                    var answer = confirm($.t("resume-at", {yPosition:Math.floor($(this).attr('data-yAddonFileResume')/60)
                                + ":"
                                + yTools.addZeroTwoDigits($(this).attr('data-yAddonFileResume') % 60)})
                            );
                }*/

                yCore.sendJsonRPC(
                    'PlayerOpen',
                    '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file":  "' + bestMatch.path + '" }, "options":{ "resume": ' + answer + ' } }, "id": 1 }',
                    function(){}
                );
                yRemote.updateLastPlayingFile("file",bestMatch.path);
                
                $("#ySpeechAction").append(' "' + bestMatch.title + '"');

            } else if (bestMatch.type == "directory" || bestMatch.type == "window"){
                $("#addonDetailsList").empty();
            
                yAddons.populateAddon(bestMatch.windowparameter, bestMatch.thumbnail);
                
                $("#ySpeechAction").append(' "' + bestMatch.title + '"');
                
                $.mobile.navigate("#addonDetails");
            }
        }
    },
    goto: function(h, min, sec, direction){
        //check if it's a specific time
        if(direction == "pos"){
            yCore.sendJsonRPC(
                'PlayerSeek',
                '{"jsonrpc":"2.0","id":1,"method":"Player.Seek","params":{"playerid":' + yCore.activePlayer 
                    + ', "value":{"time":{"hours": ' + parseInt(h) + ',"milliseconds": 0, "minutes": ' + parseInt(min) 
                    +', "seconds": ' + parseInt(sec) + '}}}}',
                ''
            );
                    
            
            
        } else {            
            //get action media Position
            yCore.sendJsonRPC(
            'getProperties - time',
            '{"jsonrpc":"2.0","method":"Player.GetProperties","id":2,"params":['
                + yCore.activePlayer + ',["time"]]'
            + '}',              
            function(getProperties){
                //calculate seconds of actual positon
                var currentPlayTimeSeconds = getProperties["result"]["time"]["hours"] * 3600
                        + getProperties["result"]["time"]["minutes"] * 60
                        + getProperties["result"]["time"]["seconds"];
                
                var newPositionInSeconds = 0;
                
                if(direction == "skip"){
                    newPositionInSeconds = currentPlayTimeSeconds+parseInt(h*3600)+parseInt(min*60)+parseInt(sec);
                } else if(direction == "back"){
                    newPositionInSeconds = currentPlayTimeSeconds-parseInt(h*3600)-parseInt(min*60)-parseInt(sec);
                }
                
                var newPosition = [0,0,0];
                newPosition[0] = Math.floor(newPositionInSeconds / 3600); //save hours
                newPosition[1] = Math.floor((newPositionInSeconds % 3600)/60); //save minutes
                newPosition[2] = Math.floor((newPositionInSeconds % 3600) % 60); //save seconds
                
                yCore.sendJsonRPC(
                    'PlayerSeek',
                    '{"jsonrpc":"2.0","id":1,"method":"Player.Seek","params":{"playerid":' + yCore.activePlayer 
                        + ', "value":{"time":{"hours": ' + newPosition[0] + ',"milliseconds": 0, "minutes": ' + newPosition[1] 
                        +', "seconds": ' + newPosition[2] + '}}}}',
                    ''
                );
            });
        }
    },
    language: function(speechCmd){        
        var languageArray = [];
        
        //TODO check if any palyer is active and warn if not and don't do then any of the following stuff
        
        yCore.sendJsonRPC(
            'GetAviableLanguages',
            '{"jsonrpc":"2.0","method":"Player.GetProperties","id":2,"params":[' + yCore.activePlayer + ',["audiostreams"]]' + '}',
            function(aviableLanguages){
                if(aviableLanguages["result"]["audiostreams"].length == 0){
                    $("#ySpeechAction").append($.t("no-matching")).css("color", "red");                            
                } else {
                    for (var j=0; j < aviableLanguages["result"]["audiostreams"].length; j++){
                        languageArray[langCodeToDescFlag[aviableLanguages["result"]["audiostreams"][j]["language"]]["english"].toLowerCase()] = aviableLanguages["result"]["audiostreams"][j];
                    }
                    
                    if(speechCmd == "list"){
                        $.mobile.navigate("#langSubDetails");
                        yLangSubDetails.init();
                    }
                    
                    //if its a numeric i suppose its the index of the subtitle
                    else if($.isNumeric(speechCmd)){
                        yCore.sendJsonRPC(
                            'switchToLanguageWithIndexNo',
                            '{"jsonrpc":"2.0","id":1,"method":"Player.SetAudioStream","params":{"playerid":' + yCore.activePlayer 
                                        + ', "stream":'+ parseInt(speechCmd-1)+'}}',
                            ''
                        );  
                        $('#ySpeechAction').append(aviableLanguages["result"]["audiostreams"][speechCmd-1]["language"]);
                    } 
                    else {
                        var lowestIterationOfAll = 999999999999;
                        var indexNumberBestLanguageMatch = -1;
                        
                        for(i=0;i < aviableLanguages["result"]["audiostreams"].length;i++){
                            if(lowestIterationOfAll > yTools.damerauLevenshtein(langCodeToDescFlag[aviableLanguages["result"]["audiostreams"][i]["language"]]["english"].toLowerCase(), speechCmd.toLowerCase())){
                                indexNumberBestLanguageMatch = aviableLanguages["result"]["audiostreams"][i]["index"];
                                lowestIterationOfAll = yTools.damerauLevenshtein(langCodeToDescFlag[aviableLanguages["result"]["audiostreams"][i]["language"]]["english"].toLowerCase(), speechCmd.toLowerCase());
                            }
                            
                        }
                        
                        yCore.sendJsonRPC(
                            'switchToLanguageWithIndexNo',
                            '{"jsonrpc":"2.0","id":1,"method":"Player.SetAudioStream","params":{"playerid":' + yCore.activePlayer 
                                        + ', "stream":'+ indexNumberBestLanguageMatch +'}}',
                            ''
                        ); 
                        $('#ySpeechAction').append(langCodeToDescFlag[aviableLanguages["result"]["audiostreams"][indexNumberBestLanguageMatch]["language"]]["english"]);
                    }
                }
            }
        ); 
    },
    languageControl: function(cmd){        
        if(cmd=="next"){
            yCore.sendJsonRPC(
                'NextLanguage',
                '{"jsonrpc":"2.0","id":1,"method":"Player.SetAudioStream","params":{"playerid":' + yCore.activePlayer 
                            + ', "stream":"next"}}',
                ''
            );
        }
        else if(cmd=="previous"){
            yCore.sendJsonRPC(
                'PreviousLanguage',
                '{"jsonrpc":"2.0","id":1,"method":"Player.SetAudioStream","params":{"playerid":' + yCore.activePlayer 
                            + ', "stream":"previous"}}',
                ''
            );  
        }
    },
    listMovies: function(unseen, genre, language, title, director, actor) {
            $('#directorSelect').selectmenu().selectmenu('refresh', true);
            $('#actorSelect').selectmenu().selectmenu('refresh', true);
            $('#genreSelect').selectmenu().selectmenu('refresh', true);
            $('#languageSelect').selectmenu().selectmenu('refresh', true);
            yMovies.init();
            yMovies.clearSearchesExcept(); 
        
        if (director != "all") {
            director = yMovies.searchClosestDirectorNameInYLib(director);
            $('#ySpeechAction').append('"' + director + '"');
            $("#directorSelect").val(director);
            $('#directorSelect').selectmenu('refresh', true);
        }
        if (actor != "all") {
            actor = yMovies.searchClosestActorNameInYLib(actor);
            $('#ySpeechAction').append('"' + actor + '"');
            $("#actorSelect").val(actor);
            $('#actorSelect').selectmenu('refresh', true);
        }
        if (genre != "all") {
            genre = yMovies.searchClosestGenreNameInYLib(genre);
            $('#ySpeechAction').append('"' + genre + '"');
            $("#genreSelect").val(genre);
            $('#genreSelect').selectmenu('refresh', true);
        }
        if (language != "all") {
            language = yMovies.searchClosestLanguageNameInYLib(language);
            $('#ySpeechAction').append('"' + language + '"');
            $("#languageSelect").val(language);
            $('#languageSelect').selectmenu('refresh', true);
        }
        if (title != "") {
            $('#ySpeechAction').append('"' + title + '"');
            $("#searchMovies").val(title);
        }
        
        yMovies.newMovieList(false, genre, language, title, director, actor, unseen);
        $.mobile.navigate("#movies");
    },
    playRandomMovie: function(unseen, genre, language, title, director, actor, onlyShowDetails) {
        var tempHideWatched = yS.yS.hideWatched; //save setting temporarily
        yS.yS.hideWatched = unseen; //set for this function to needed value
        
        if (director != "all") {
            director = yMovies.searchClosestDirectorNameInYLib(director);
        }
        if (actor != "all") {
            actor = yMovies.searchClosestActorNameInYLib(actor);
        }
        if (genre != "all") {
            genre = yMovies.searchClosestGenreNameInYLib(genre);
        }
        if (language != "all") {
            language = yMovies.searchClosestLanguageNameInYLib(language);
        }
         
        var reducedMovielist = JSON.parse(JSON.stringify(yMovies.newMovieList(true, genre, language, title, director, actor)));
        yS.yS.hideWatched = tempHideWatched; //restore previous setting
        
        if (reducedMovielist.length > 0) {
            randomMovieArrayIndexNr = Math.floor((Math.random()*reducedMovielist.length));             
            yCore.sendJsonRPC(
                'GetMovieDetails',
                '{"jsonrpc":"2.0","method":"VideoLibrary.GetMovieDetails","id":1,"params":['
                    + reducedMovielist[randomMovieArrayIndexNr]["movieid"]
                +',["resume", "playcount","title"]]}',
                function(resultMovieDetails){
                    
                    if(!onlyShowDetails) {
                        //check first if there is a resume position (ask always, so the user has not to get all movies again first)
                        var answer = false;

                        //if there is a resume position, ask if he wants to start there
                        if (resultMovieDetails["result"]["moviedetails"]["resume"] !== undefined && resultMovieDetails["result"]["moviedetails"]["resume"]["position"] > 0) {
                        var answer = confirm($.t("resume-at", {yPosition: Math.floor(resultMovieDetails["result"]["moviedetails"]["resume"]["position"]/60)
                                            + ":"
                                            + yTools.addZeroTwoDigits(resultMovieDetails["result"]["moviedetails"]["resume"]["position"] % 60)})
                                        );
                        }

                        yCore.sendJsonRPC(
                            'PlayerOpen',
                            '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "movieid": '
                            + resultMovieDetails["result"]["moviedetails"]["movieid"] + ' }, "options":{ "resume": ' + answer + ' } }, "id": 1 }',
                            function(){
                                $('#ySpeechAction').append('"' + resultMovieDetails["result"]["moviedetails"]["title"] + '"');
                            }
                        );
                        yRemote.updateLastPlayingFile("movieID",resultMovieDetails["result"]["moviedetails"]["movieid"]);
                    }
                    else {//onlyShowDetails
                        $('#directorSelect').selectmenu().selectmenu('refresh', true);
                        $('#actorSelect').selectmenu().selectmenu('refresh', true);
                        $('#genreSelect').selectmenu().selectmenu('refresh', true);
                        $('#languageSelect').selectmenu().selectmenu('refresh', true);
                        yMovies.init();
                                                
                        $('#ySpeechAction').append('"' + resultMovieDetails["result"]["moviedetails"]["title"] + '"');
                        
                        yMovies.openMovieItem(resultMovieDetails["result"]["moviedetails"]["movieid"]);
                        $.mobile.navigate("#movieDetails");
                        
                    }
                }
            );
        }
        else {
            $('#ySpeechAction').empty();       
            $("#ySpeechAction").append($.t("no-matching")).css("color", "red");    
        }
    },
    showRandomMovie: function(unseen, genre, language, title, director, actor) {
        $('#directorSelect').selectmenu().selectmenu('refresh', true);
        $('#actorSelect').selectmenu().selectmenu('refresh', true);
        $('#genreSelect').selectmenu().selectmenu('refresh', true);
        $('#languageSelect').selectmenu().selectmenu('refresh', true);
        yMovies.init();
        
        if (director != "all") {
            director = yMovies.searchClosestDirectorNameInYLib(director);
        }
        if (actor != "all") {
            actor = yMovies.searchClosestActorNameInYLib(actor);
        }
        if (genre != "all") {
            genre = yMovies.searchClosestGenreNameInYLib(genre);
        }
        if (language != "all") {
            language = yMovies.searchClosestLanguageNameInYLib(language);
        }
         
        var reducedMovielist = JSON.parse(JSON.stringify(yMovies.newMovieList(true, genre, language, title, director, actor, unseen)));
        
        if (reducedMovielist.length > 0) {
            randomMovieArrayIndexNr = Math.floor((Math.random()*reducedMovielist.length));
            yMovies.openMovieItem(reducedMovielist[randomMovieArrayIndexNr]["movieid"]);
        }
        else {
            $('#ySpeechAction').empty();       
            $("#ySpeechAction").append($.t("no-matching")).css("color", "red");    
        }
    },
    playlistAddMovies: function(unseen, genre, language, title, director, actor) {
        var addToPlTokens = [];
        
        if (director != "all") {
            director = yMovies.searchClosestDirectorNameInYLib(director);
            $('#ySpeechAction').append('"' + director + '"');
        }
        if (actor != "all") {
            actor = yMovies.searchClosestActorNameInYLib(actor);
            $('#ySpeechAction').append('"' + actor + '"');
        }
        if (genre != "all") {
            genre = yMovies.searchClosestGenreNameInYLib(genre);
            $('#ySpeechAction').append('"' + genre + '"');
        }
        if (language != "all") {
            language = yMovies.searchClosestLanguageNameInYLib(language);
            $('#ySpeechAction').append('"' + language + '"');
        }
        if (title != "") {
            $('#ySpeechAction').append('"' + title + '"');
        }
        
        var reducedMovielist = JSON.parse(JSON.stringify(yMovies.newMovieList(true, genre, language, title, director, actor, unseen)));
        
        if (reducedMovielist.length > 0) {
            for (i=0; i < reducedMovielist.length; i++) {
                    addToPlTokens.push('{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "playlistid" : 1' 
                        + ', "item" : {"movieid" : ' + reducedMovielist[i]["movieid"] + '}}, "id": 1}'
                    );
            }
            var addToPl = addToPlTokens.join(', ');
            yCore.sendJsonRPC(
                    'AddCustomPlaylistItems',
                    '[' + addToPl + ']',
                ''
                    );
        }
        else {
            $('#ySpeechAction').empty();       
            $("#ySpeechAction").append($.t("no-matching")).css("color", "red");    
        }
    },
    singleMovie: function(action, movieName){
        var movieID = yMovies.searchClosestMovieNameInYLib(movieName);
        
        $('#directorSelect').selectmenu().selectmenu('refresh', true);
        $('#actorSelect').selectmenu().selectmenu('refresh', true);
        $('#genreSelect').selectmenu().selectmenu('refresh', true);
        $('#languageSelect').selectmenu().selectmenu('refresh', true);
        yMovies.init();
        
        yCore.sendJsonRPC(
            'GetMovieDetails',
            '{"jsonrpc":"2.0","method":"VideoLibrary.GetMovieDetails","params":[' + movieID + ',["title"]],"id":"1"}',
            function(resultGetMovieDetails){
                $('#ySpeechAction').append('"' + resultGetMovieDetails["result"]["moviedetails"]["title"] + '"');
        });
        
        if (action == "play") {
            yMovies.playMovie(movieID);
        }
        
        if (action == "show") {
            yMovies.openMovieItem(movieID);
            $.mobile.navigate("#movieDetails");
        }
        
        if (action == "pl") {
            yMovies.addMovieToPlaylist(movieID);
        }
        
        if (action == "trailer") {
            yMovies.startMovieTrailer(movieID);
        }
    },
    randomTVShowEpisode: function(SeasonNr, showName, unseen, action){
        var seasonArray = [];
        var seasonQuerry = "";
        var filterQuerry = "";
        var randomEpisodeIndexNr = -1;
        var randomEpisodeID = -1;
        
        showID = ySeries.searchClosestShowTitleInYLib(showName);
        
        //as a preparation add all seasons to seasonArray of according show
        for ( i=0; i < yLib.series.length; i++ ) {
            if (yLib.series[i] === null){ continue;}
            if ( yLib.series[i]["tvshowid"] == showID ) {
                seasonArray = yLib.series[i]["seasons"];
                break;
            }
        }
        
        if (SeasonNr != "") {seasonQuerry = ',"season" : ' + SeasonNr;}
        if (unseen) { filterQuerry = ' , "filter": {"field": "playcount", "operator": "is", "value": "0"}'; }        
        
        yCore.sendJsonRPC(
            'GetEpisodes',
            '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": '
                + '{ "properties": ["season","episode", "showtitle", "playcount", "resume"], "tvshowid":' 
                + showID + seasonQuerry + filterQuerry + '}, "sort": { "order": "ascending", "method": "episode"}, "id": 1}',
            function(resultGetEpisodes){
                if (resultGetEpisodes["result"]["limits"]["end"] == 0) {
                    $('#ySpeechAction').empty();       
                    $("#ySpeechAction").append($.t("no-matching")).css("color", "red");    
                }
                else {
                    
                    randomEpisodeIndexNr = Math.floor((Math.random()*resultGetEpisodes["result"]["limits"]["end"]));
                    randomEpisodeID = resultGetEpisodes["result"]["episodes"][randomEpisodeIndexNr]["episodeid"];
                                    
                    //check first if there is a resume position (ask always, so the user has not to get all movies again first)
                    yCore.sendJsonRPC(
                        'GetEpisodeDetails',
                        '{"jsonrpc":"2.0","method":"VideoLibrary.GetEpisodeDetails","id":1,"params":['
                            + randomEpisodeID
                        +',["resume", "season","episode", "showtitle", "title"]]}',
                        function(resultDetails){
                            if (action == "play") {//user wants to play an episode         
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
                                    '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "episodeid":  ' + randomEpisodeID + ' }, "options":{ "resume": '+answer+' } }, "id": 1 }',
                                    function(){
                                    }
                                );
                                yRemote.updateLastPlayingFile("episodeID",randomEpisodeID);
                                
                                $("#ySpeechAction").append(
                                    resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                    + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                );
                            }
                            else if (action == "show") {   //user wants to see details of episode in yarc
                                ySeries.showEpisodeDetails(randomEpisodeID);   
                                
                                $("#ySpeechAction").append(
                                    resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                    + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                );
                            }
                            else if (action == "playlist") {  //user wants add episode to the playlist
                                    
                                ySeries.addEpisodeToPlaylist(randomEpisodeID);
                                
                                $("#ySpeechAction").append(
                                    resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                    + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                ); 
                            }
                        }
                    );
                }
            }
        );    
    },
    specificTVShowEpisode: function(EpisodeNr, SeasonNr, showName, action){
        
        var showID = ySeries.searchClosestShowTitleInYLib(showName);
        
        for ( i=0; i < yLib.series.length; i++ ) {
            if(yLib.series[i] === null) {continue;}
            if (yLib.series[i]["tvshowid"] !== showID) {continue;}
            else {
                if ( !yLib.series[i]["seasons"].hasOwnProperty(SeasonNr)
                        || !yLib.series[i]["seasons"][SeasonNr]["episodes"].hasOwnProperty(EpisodeNr)                 
                ) {                    
                        $("#ySpeechAction").empty();       
                        $("#ySpeechAction").append($.t("no-matching"));
                        $("#ySpeechAction").css("color", "red");           
                }
                else {
                    yCore.sendJsonRPC(
                        'GetEpisodeDetails',
                        '{"jsonrpc":"2.0","method":"VideoLibrary.GetEpisodeDetails","id":1,"params":['
                            + yLib.series[i]["seasons"][SeasonNr]["episodes"][EpisodeNr]["episodeid"]
                        +',["resume", "season","episode", "showtitle", "title"]]}',
                        function(resultDetails){
                            if(action == "play"){ //user wants to play episode
                                
                                ySeries.playEpisode(yLib.series[i]["seasons"][SeasonNr]["episodes"][EpisodeNr]["episodeid"]);   
                                
                                $("#ySpeechAction").append(
                                    resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                    + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                );  
                            }
                            else if(action == "show"){ //user wants to see details of episode in yarc
                                ySeries.showEpisodeDetails(yLib.series[i]["seasons"][SeasonNr]["episodes"][EpisodeNr]["episodeid"]);   
                                
                                $("#ySpeechAction").append(
                                    resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                    + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                ); 
                                
                            }
                            else if(action == "playlist"){ //user wants add episode to the playlist
                                
                                ySeries.addEpisodeToPlaylist(yLib.series[i]["seasons"][SeasonNr]["episodes"][EpisodeNr]["episodeid"]);
                                
                                $("#ySpeechAction").append(
                                    resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                    + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                ); 
                                
                            }
                            else {
                                $("#ySpeechAction").empty();       
                                $("#ySpeechAction").append($.t("no-matching"));
                                $("#ySpeechAction").css("color", "red");      
                            }
                        }
                    );
                }
            }
            break;
        }
    },
    nextTVShow: function(showName, action){

        if (showName != "") {
            showID = ySeries.searchClosestShowTitleInYLib(showName);
console.log("ok entered");
            yCore.sendJsonRPC(
                'GetEpisodes',
                '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": '
                    + '{ "properties": ["season","episode", "playcount", "resume"],"tvshowid":' 
                    + showID + '}, "sort": { "order": "ascending", "method": "episode"}, "id": 1}',
                function(resultGetEpisodes){
                    var episodeList = resultGetEpisodes["result"]["episodes"];
                    var lowestSeasonNr = 99999999;
                    var lowestEpisodeNr = 99999999;
                    var lowestEpisodeID = -1;
                    
                    for ( i=0; i < resultGetEpisodes["result"]["limits"]["end"]; i++ ) {
                        if ( episodeList[i]["season"] < lowestSeasonNr && episodeList[i]["playcount"] < 1 ) {
                            lowestSeasonNr = episodeList[i]["season"];
                        }
                    }
                    for ( i=0; i < resultGetEpisodes["result"]["limits"]["end"]; i++ ) {
                        if ( episodeList[i]["season"] == lowestSeasonNr && episodeList[i]["playcount"] < 1 ) {
                            if (episodeList[i]["episode"] < lowestEpisodeNr){
                                lowestEpisodeNr = episodeList[i]["episode"];
                                lowestEpisodeID = episodeList[i]["episodeid"];
                            }                            
                        }
                    }
                    
                    if ( lowestEpisodeID > -1 ) {
                        
                        yCore.sendJsonRPC(
                            'GetEpisodeDetails',
                            '{"jsonrpc":"2.0","method":"VideoLibrary.GetEpisodeDetails","id":1,"params":['
                                + lowestEpisodeID
                            +',["resume", "season","episode", "showtitle", "title"]]}',
                            function(resultDetails){
                                if (action == "show") {
                                    ySeries.showEpisodeDetails(lowestEpisodeID); 
                                
                                    $("#ySpeechAction").append(
                                        resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                        + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                    );
                                }
                                else if (action == "play") {
                                
                                    //check first if there is a resume position (ask always, so the user has not to get all movies again first)
                                    yCore.sendJsonRPC(
                                        'GetEpisodeDetails',
                                        '{"jsonrpc":"2.0","method":"VideoLibrary.GetEpisodeDetails","id":1,"params":['
                                            + lowestEpisodeID
                                        +',["resume", "season","episode", "showtitle", "title"]]}',
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
                                                '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "episodeid":  ' + lowestEpisodeID + ' }, "options":{ "resume": '+answer+' } }, "id": 1 }',
                                                function(){
                                                }
                                            );
                                            yRemote.updateLastPlayingFile("episodeID",lowestEpisodeID);
                                            
                                            $("#ySpeechAction").append(
                                                resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                                + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                            );
                                        }
                                    );
                                }
                                else if (action == "playlist") {
                                    ySeries.addEpisodeToPlaylist(lowestEpisodeID);
                                
                                    $("#ySpeechAction").append(
                                        resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                        + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                    );
                                }
                                else {
                                    $("#ySpeechAction").empty();       
                                    $("#ySpeechAction").append($.t("no-matching")).css("color", "red");                               
                                }
                            }
                        );
                    }
                    else {
                        $("#ySpeechAction").empty();       
                        $("#ySpeechAction").append($.t("no-matching")).css("color", "red");   
                        
                        yCore.sendJsonRPC(
                            'GetSeasons',
                            '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { "properties": ["art", "title",  "thumbnail", "playcount"], '
                                + '"sort": { "method": "sorttitle", "ignorearticle": true }}, "tvshowid":' + showID + '}, "id": 1}',
                            function(resultGetTVShows){
                                $("#ySpeechAction").append(" (" + resultGetTVShows["result"]["tvshows"][0]["title"] + ")").css("color", "red"); 
                            }
                        );
                    }
                }
            );
        }
        else {
            $("#ySpeechAction").empty();       
            $("#ySpeechAction").append($.t("no-matching")).css("color", "red");    
        }
    },
    listTVShow: function(showName, seasonNr){
        var showID = "";
        
        if (!ySeries.already_run) {ySeries.init();}
        
        if (showName != "") {
            showID = ySeries.searchClosestShowTitleInYLib(showName);
            
            $.mobile.navigate("#series");
            $("#ySpeechAction").append(yLib.series[showID]["title"]);   
            
            setTimeout(function(){
                $('html, body').animate({
                    scrollTop: $("#showID-" + showID).offset().top
                }, 'fast');  
            }, 1000);   
            $("#showID-" + showID).collapsible( "expand" );
            
            if (seasonNr != "") {
                $("#ySpeechAction").append(" ( " + seasonNr + "x )" );  
                setTimeout(function(){
                    $('html, body').animate({
                        scrollTop: $("#showID-" + showID + "-s-"+ seasonNr).offset().top
                    }, 'fast');  
                    $("#showID-" + showID + "-s-"+ seasonNr).collapsible( "expand" );
                }, 1500);
            }
        }
        else {
            $("#ySpeechAction").empty();       
            $("#ySpeechAction").append($.t("no-matching")).css("color", "red");    
        }
    },
    latestTVShow: function(showName, action){
        if (showName != "") {
            showID = ySeries.searchClosestShowTitleInYLib(showName);
            
            yCore.sendJsonRPC(
                'GetEpisodes',
                '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": '
                    + '{ "properties": ["season","episode", "resume", "firstaired"],"tvshowid":' 
                    + showID + '}, "id": 1}',
                function(resultGetEpisodes){
                    var episodeList = resultGetEpisodes["result"]["episodes"];
                    var latestEpisodeID = -1;
                    var higestFirstAiredDate = "0";
                    
                    for ( i=0; i < resultGetEpisodes["result"]["limits"]["end"]; i++ ) {
                        if (new Date(episodeList[i]["firstaired"]).getTime() > new Date(higestFirstAiredDate).getTime()) {
                            latestEpisodeID = episodeList[i]["episodeid"];
                            higestFirstAiredDate = episodeList[i]["firstaired"];
                        }
                    }
                    
                    if (latestEpisodeID > -1) {
                        //check first if there is a resume position (ask always, so the user has not to get all movies again first)
                        yCore.sendJsonRPC(
                            'GetEpisodeDetails',
                            '{"jsonrpc":"2.0","method":"VideoLibrary.GetEpisodeDetails","id":1,"params":['
                                + latestEpisodeID
                            +',["resume", "season","episode", "showtitle", "title"]]}',
                            function(resultDetails){
                                if (action == "play") {
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
                                        '{ "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "episodeid":  ' + latestEpisodeID + ' }, "options":{ "resume": '+answer+' } }, "id": 1 }',
                                        function(){
                                        }
                                    );
                                    yRemote.updateLastPlayingFile("episodeID",latestEpisodeID);
                                    
                                    $("#ySpeechAction").append(
                                        resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                        + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                    );
                                }
                                else if (action == "show") {
                                    ySeries.showEpisodeDetails(latestEpisodeID); 
                                
                                    $("#ySpeechAction").append(
                                        resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                        + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                    );
                                }
                                else if (action == "playlist") {
                                    ySeries.addEpisodeToPlaylist(latestEpisodeID);
                                
                                    $("#ySpeechAction").append(
                                        resultDetails["result"]["episodedetails"]["showtitle"] + " (" + resultDetails["result"]["episodedetails"]["season"]
                                        + "x" + resultDetails["result"]["episodedetails"]["episode"] + ") " + resultDetails["result"]["episodedetails"]["title"]
                                    );
                                }
                            }
                        );
                    }
                    else {
                        $("#ySpeechAction").empty();       
                        $("#ySpeechAction").append($.t("no-matching")).css("color", "red");    
                    }
                    
                }
            );
            
        }
        else {
            $("#ySpeechAction").empty();       
            $("#ySpeechAction").append($.t("no-matching")).css("color", "red");    
        }
        
    },
    switchPvrChannel: function(tvOrRadio, channel){
        var channelID = "";
        
        if (tvOrRadio == "TV") {
            if($.isNumeric(channel)){
                for (i=0; i < yLib.pvrTVChannels.length; i++){
                    if(yLib.pvrTVChannels[i]["channelnumber"] == channel) {
                        channelID = yLib.pvrTVChannels[i]["channelid"]
                    }                    
                }  
            }  
            else {
                var lowestIterationOfAll = 999999999999;
                for (i=0; i < yLib.pvrTVChannels.length; i++){
                    if(lowestIterationOfAll > yTools.damerauLevenshtein(yLib.pvrTVChannels[i]["label"].toLowerCase(), channel.toLowerCase())){
                        channelID = yLib.pvrTVChannels[i]["channelid"];
                        lowestIterationOfAll = yTools.damerauLevenshtein(yLib.pvrTVChannels[i]["label"].toLowerCase(), channel.toLowerCase());
                    }                     
                }                  
            }
            
            yCore.sendJsonRPC(
                'PlayTVChannelID',
                '{"jsonrpc":"2.0", "method":"Player.Open", "params": { "item": {"channelid":' + channelID + '}, "options":{}}, "id":1}',
                function(resultPlayTVChannelID){
                    yCore.sendJsonRPC(
                        'getPVR-ChannelDetail',
                        '{"jsonrpc":"2.0","method":"PVR.GetChannelDetails","id":"1","params":{"channelid":' + channelID + ',"properties":["thumbnail"]}}',
                        function(resultDetails){
                            $("#ySpeechAction").append(resultDetails["result"]["channeldetails"]["label"]);                            
                        }
                    );
                }
            );
            yRemote.updateLastPlayingFile("channelID",channelID);
        } 
        else if (tvOrRadio == "Radio") {
            if($.isNumeric(channel)){
                for (i=0; i < yLib.pvrRadioChannels.length; i++){
                    if(yLib.pvrRadioChannels[i]["channelnumber"] == channel) {
                        channelID = yLib.pvrRadioChannels[i]["channelid"]
                    }                    
                }  
            }  
            else {
                var lowestIterationOfAll = 999999999999;
                for (i=0; i < yLib.pvrRadioChannels.length; i++){
                    if(lowestIterationOfAll > yTools.damerauLevenshtein(yLib.pvrRadioChannels[i]["label"].toLowerCase(), channel.toLowerCase())){
                        channelID = yLib.pvrRadioChannels[i]["channelid"];
                        lowestIterationOfAll = yTools.damerauLevenshtein(yLib.pvrRadioChannels[i]["label"].toLowerCase(), channel.toLowerCase());
                    }                     
                }                  
            }
            
            yCore.sendJsonRPC(
                'PlayTVChannelID',
                '{"jsonrpc":"2.0", "method":"Player.Open", "params": { "item": {"channelid":' + channelID + '}, "options":{}}, "id":1}',
                function(resultPlayTVChannelID){
                    yCore.sendJsonRPC(
                        'getPVR-ChannelDetail',
                        '{"jsonrpc":"2.0","method":"PVR.GetChannelDetails","id":"1","params":{"channelid":' + channelID + ',"properties":["thumbnail"]}}',
                        function(resultDetails){
                            $("#ySpeechAction").append(resultDetails["result"]["channeldetails"]["label"]);                            
                        }
                    );
                }
            );
            yRemote.updateLastPlayingFile("channelID",channelID);
        } 
    },
    detailsPvrChannel: function(tvOrRadio, channel){
        var channelID = "";
        
        if (tvOrRadio == "TV") {
            if($.isNumeric(channel)){
                for (i=0; i < yLib.pvrTVChannels.length; i++){
                    if(yLib.pvrTVChannels[i]["channelnumber"] == channel) {
                        channelID = yLib.pvrTVChannels[i]["channelid"]
                    }                    
                }  
            }  
            else {
                var lowestIterationOfAll = 999999999999;
                for (i=0; i < yLib.pvrTVChannels.length; i++){
                    if(lowestIterationOfAll > yTools.damerauLevenshtein(yLib.pvrTVChannels[i]["label"].toLowerCase(), channel.toLowerCase())){
                        channelID = yLib.pvrTVChannels[i]["channelid"];
                        lowestIterationOfAll = yTools.damerauLevenshtein(yLib.pvrTVChannels[i]["label"].toLowerCase(), channel.toLowerCase());
                    }                     
                }                  
            }
            $("#ySpeechAction").append(channel);   
            yPvrChannelDetails.populateChannelDetails(channelID);
        } 
        else if (tvOrRadio == "Radio") {
            if($.isNumeric(channel)){
                for (i=0; i < yLib.pvrRadioChannels.length; i++){
                    if(yLib.pvrRadioChannels[i]["channelnumber"] == channel) {
                        channelID = yLib.pvrRadioChannels[i]["channelid"]
                    }                    
                }  
            }  
            else {
                var lowestIterationOfAll = 999999999999;
                for (i=0; i < yLib.pvrRadioChannels.length; i++){
                    if(lowestIterationOfAll > yTools.damerauLevenshtein(yLib.pvrRadioChannels[i]["label"].toLowerCase(), channel.toLowerCase())){
                        channelID = yLib.pvrRadioChannels[i]["channelid"];
                        lowestIterationOfAll = yTools.damerauLevenshtein(yLib.pvrRadioChannels[i]["label"].toLowerCase(), channel.toLowerCase());
                    }                     
                }                  
            }
            $("#ySpeechAction").append(channel);  
            yPvrChannelDetails.populateChannelDetails(channelID);
        } 
    },
    pvrChannelRandom: function(tvOrRadio){
        
        if (tvOrRadio == "TV") {
            //get random channel ID from yLib
            var channelID = yLib.pvrTVChannels[Math.floor(Math.random()*yLib.pvrTVChannels.length)]["channelid"];
            
            yCore.sendJsonRPC(
                'PlayTVChannelID',
                '{"jsonrpc":"2.0", "method":"Player.Open", "params": { "item": {"channelid":' + channelID + '}, "options":{}}, "id":1}',
                function(resultPlayTVChannelID){
                    yCore.sendJsonRPC(
                        'getPVR-ChannelDetail',
                        '{"jsonrpc":"2.0","method":"PVR.GetChannelDetails","id":"1","params":{"channelid":' + channelID + ',"properties":["thumbnail"]}}',
                        function(resultDetails){
                            $("#ySpeechAction").append(resultDetails["result"]["channeldetails"]["label"]);                            
                        }
                    );
                }
            );
            yRemote.updateLastPlayingFile("channelID",channelID);
        }
        else if (tvOrRadio == "Radio") {
            //get random channel ID from yLib
            var channelID = yLib.pvrRadioChannels[Math.floor(Math.random()*yLib.pvrRadioChannels.length)]["channelid"];
            
            yCore.sendJsonRPC(
                'PlayTVChannelID',
                '{"jsonrpc":"2.0", "method":"Player.Open", "params": { "item": {"channelid":' + channelID + '}, "options":{}}, "id":1}',
                function(resultPlayTVChannelID){
                    yCore.sendJsonRPC(
                        'getPVR-ChannelDetail',
                        '{"jsonrpc":"2.0","method":"PVR.GetChannelDetails","id":"1","params":{"channelid":' + channelID + ',"properties":["thumbnail"]}}',
                        function(resultDetails){
                            $("#ySpeechAction").append(resultDetails["result"]["channeldetails"]["label"]); 
                        }
                    );
                }
            );
        }
        yRemote.updateLastPlayingFile("channelID",channelID);
    },    
    pvrRandomTelevisionRecoring: function(onlyUnseen, itemType, item){
        var recordingID = "";
        var bestMatch = "";
        var lowestIterationOfAll = 999999999999;
        var recordingTempArr = [];
        var demerauLevenshteinTempArr = [];
        
        yCore.sendJsonRPC(
            'getPVR-Recordings',
            '{"jsonrpc":"2.0","method":"PVR.GetRecordings","id":"1","params":{"properties": ' 
            //"channel","file","title","resume","starttime","endtime","runtime","icon","plotoutline"
            + '["file","title","genre","channel","resume","playcount"]}}',
            function(resultRecordings){                
                if(itemType == "all") {    
                    // if recording is with resume, asume it's seen since there is pre- and past minutes recorded                
                    if (onlyUnseen) { 
                        for(var i = 0; i < resultRecordings["result"]["limits"]["end"]; i++){                          
                            // if recording is with resume, asume it's seen since there is pre- and past minutes recorded                
                            if (resultRecordings["result"]["recordings"][i]["playcount"] > 0 || resultRecordings["result"]["recordings"][i]["resume"]["position"] > 0) { 
                                continue;
                            }
                            else {
                                recordingTempArr.push(resultRecordings["result"]["recordings"][i]);
                            }
                            
                        }
                        recordingID = recordingTempArr[Math.floor(Math.random()*(recordingTempArr.length))]["recordingid"];
                    }                    
                    else {
                        recordingID = resultRecordings["result"]["recordings"][Math.floor(Math.random()*(resultRecordings["result"]["limits"]["end"]-1))]["recordingid"];
                    }
                }
                else if(itemType == "title") {               
                    bestMatch = "";  
                    lowestIterationOfAll = 999999999999;
                    demerauLevenshteinTempArr = [];
                    
                    //fill tempArray with names of shows
                    for(var i = 0; i < resultRecordings["result"]["limits"]["end"]; i++){                          
                        if (!(jQuery.inArray(resultRecordings["result"]["recordings"][i]["label"], demerauLevenshteinTempArr) > -1)){//push if not already there
                            demerauLevenshteinTempArr.push(resultRecordings["result"]["recordings"][i]["label"]);
                        }
                    }
                    
                    //find closest match of itemLabel in tempArray
                    for (i=0; i < demerauLevenshteinTempArr.length; i++){
                        if(lowestIterationOfAll > yTools.damerauLevenshtein(demerauLevenshteinTempArr[i].toLowerCase(), item.toLowerCase())){
                            bestMatch = demerauLevenshteinTempArr[i];
                            lowestIterationOfAll = yTools.damerauLevenshtein(demerauLevenshteinTempArr[i].toLowerCase(), item.toLowerCase());
                        }
                    }
                    
                    //push all recordings with according label into tempArray
                    for(var i = 0; i < resultRecordings["result"]["limits"]["end"]; i++){     
                        // if recording is with resume, asume it's seen since there is pre- and past minutes recorded                
                        if (
                            (onlyUnseen && resultRecordings["result"]["recordings"][i]["playcount"] > 0)
                            || (onlyUnseen && resultRecordings["result"]["recordings"][i]["resume"]["position"] > 0)
                        ) { continue; }
                        
                        if (resultRecordings["result"]["recordings"][i]["label"] == bestMatch){
                            recordingTempArr.push(resultRecordings["result"]["recordings"][i]);
                        }
                    }
                    
                    if (recordingTempArr.length === 0){             
                        $('#ySpeechAction').empty();                
                        $("#ySpeechAction").append($.t("no-matching")).css("color", "red");   
                    }
                    else {recordingID = recordingTempArr[Math.floor(Math.random()*(recordingTempArr.length))]["recordingid"];}
                }
                else if(itemType == "tag") {               
                    bestMatch = "";  
                    lowestIterationOfAll = 999999999999;
                    demerauLevenshteinTempArr = [];
                    
                    //fill tempArray with names of shows
                    for(var i = 0; i < resultRecordings["result"]["limits"]["end"]; i++){       
                        // if recording is with resume, asume it's seen since there is pre- and past minutes recorded                
                        if (
                            (onlyUnseen && resultRecordings["result"]["recordings"][i]["playcount"] > 0)
                            || (onlyUnseen && resultRecordings["result"]["recordings"][i]["resume"]["position"] > 0)
                        ) { continue; }
                        
                        for (var j = 0; j < (resultRecordings["result"]["recordings"][i]["genre"].length); j++) { 
                            if (!(jQuery.inArray(resultRecordings["result"]["recordings"][i]["genre"][j], demerauLevenshteinTempArr) > -1)){//push if not already there
                                demerauLevenshteinTempArr.push(resultRecordings["result"]["recordings"][i]["genre"][j]);
                            }
                        }
                    }
                    
                    //find closest match of itemLabel in tempArray
                    for (i=0; i < demerauLevenshteinTempArr.length; i++){
                        if(lowestIterationOfAll > yTools.damerauLevenshtein(demerauLevenshteinTempArr[i].toLowerCase(), item.toLowerCase())){
                            bestMatch = demerauLevenshteinTempArr[i];
                            lowestIterationOfAll = yTools.damerauLevenshtein(demerauLevenshteinTempArr[i].toLowerCase(), item.toLowerCase());
                        }
                    }
                    console.log(bestMatch);
                    
                    //push all recordings with according genre/tag into tempArray
                    for(var i = 0; i < resultRecordings["result"]["limits"]["end"]; i++){                          
                        for (var j = 0; j < (resultRecordings["result"]["recordings"][i]["genre"].length); j++) {                            
                            if (resultRecordings["result"]["recordings"][i]["genre"][j] == bestMatch){
                                recordingTempArr.push(resultRecordings["result"]["recordings"][i]);
                            }
                        }
                    }
                    
                    if (recordingTempArr.length === 0){         
                        $('#ySpeechAction').empty();               
                        $("#ySpeechAction").append($.t("no-matching")).css("color", "red");   
                    }
                    else {recordingID = recordingTempArr[Math.floor(Math.random()*(recordingTempArr.length))]["recordingid"];}
                }
                else if(itemType == "channel") {               
                    bestMatch = "";  
                    lowestIterationOfAll = 999999999999;
                    demerauLevenshteinTempArr = [];
                    
                    //fill tempArray with names of shows
                    for(var i = 0; i < resultRecordings["result"]["limits"]["end"]; i++){         
                        // if recording is with resume, asume it's seen since there is pre- and past minutes recorded                
                        if (
                            (onlyUnseen && resultRecordings["result"]["recordings"][i]["playcount"] > 0)
                            || (onlyUnseen && resultRecordings["result"]["recordings"][i]["resume"] === undefined)
                        ) { continue; }
                        
                        if (!(jQuery.inArray(resultRecordings["result"]["recordings"][i]["channel"], demerauLevenshteinTempArr) > -1)){//push if not already there
                            demerauLevenshteinTempArr.push(resultRecordings["result"]["recordings"][i]["channel"]);
                        }
                    }
                    
                    //find closest match of itemLabel in tempArray
                    for (i=0; i < demerauLevenshteinTempArr.length; i++){
                        if(lowestIterationOfAll > yTools.damerauLevenshtein(demerauLevenshteinTempArr[i].toLowerCase(), item.toLowerCase())){
                            bestMatch = demerauLevenshteinTempArr[i];
                            lowestIterationOfAll = yTools.damerauLevenshtein(demerauLevenshteinTempArr[i].toLowerCase(), item.toLowerCase());
                        }
                    }
                    
                    //push all recordings with according channel into tempArray
                    for(var i = 0; i < resultRecordings["result"]["limits"]["end"]; i++){  
                        if (resultRecordings["result"]["recordings"][i]["channel"] == bestMatch){
                            recordingTempArr.push(resultRecordings["result"]["recordings"][i]);
                        }
                    }
                    
                    if (recordingTempArr.length === 0){       
                        $('#ySpeechAction').empty();                      
                        $("#ySpeechAction").append($.t("no-matching")).css("color", "red");   
                    }
                    else {recordingID = recordingTempArr[Math.floor(Math.random()*(recordingTempArr.length))]["recordingid"];}
                }
                
                if (recordingID == ""){   
                        $('#ySpeechAction').empty();
                        $("#ySpeechAction").append($.t("no-matching")).css("color", "red");
                }
                else {
                    yPvrRecordings.playRecording(recordingID);                    
                    yCore.sendJsonRPC(
                        'GetRecordingDetails',
                        '{"jsonrpc":"2.0","method":"PVR.GetRecordingDetails","id":1,"params":['
                            + recordingID
                        +',["title"]]}',
                        function(resultDetails){
                            $("#ySpeechAction").append(resultDetails["result"]["recordingdetails"]["title"]);    
                        }
                    );
                }
            }
        );   
    }, 
    pvrNextOrLatestTelevisionRecoringName: function(timePointer, title){
        var recordingID = "";
        var bestMatch = "";
        var lowestIterationOfAll = 999999999999;
        var recordingTempArr = [];
        var demerauLevenshteinTempArr = [];
        
        yCore.sendJsonRPC(
            'getPVR-Recordings',
            '{"jsonrpc":"2.0","method":"PVR.GetRecordings","id":"1","params":{"properties": ' 
            //"channel","file","title","resume","starttime","endtime","runtime","icon","plotoutline"
            + '["file","title","genre","channel","resume","playcount","starttime"]}}',
            function(resultRecordings){     
          
                bestMatch = "";  
                lowestIterationOfAll = 999999999999;
                demerauLevenshteinTempArr = [];
                
                //fill tempArray with names of shows
                for(var i = 0; i < resultRecordings["result"]["limits"]["end"]; i++){                          
                    if (!(jQuery.inArray(resultRecordings["result"]["recordings"][i]["label"], demerauLevenshteinTempArr) > -1)){//push if not already there
                        demerauLevenshteinTempArr.push(resultRecordings["result"]["recordings"][i]["label"]);
                    }
                }
                //find closest match of itemLabel in tempArray
                for (i=0; i < demerauLevenshteinTempArr.length; i++){
                    if(lowestIterationOfAll > yTools.damerauLevenshtein(demerauLevenshteinTempArr[i].toLowerCase(), title.toLowerCase())){
                        bestMatch = demerauLevenshteinTempArr[i];
                        lowestIterationOfAll = yTools.damerauLevenshtein(demerauLevenshteinTempArr[i].toLowerCase(), title.toLowerCase());
                    }
                }               
                //push all recordings with according label into tempArray
                for(var i = 0; i < resultRecordings["result"]["limits"]["end"]; i++){     
                    // if recording is with resume, asume it's seen since there is pre- and past minutes recorded                
                    if (
                        (resultRecordings["result"]["recordings"][i]["playcount"] > 0 && timePointer == "next")
                        || (resultRecordings["result"]["recordings"][i]["resume"]["position"] > 0 && timePointer == "next")) 
                    { continue; }
                    
                    if (resultRecordings["result"]["recordings"][i]["label"] == bestMatch){
                        recordingTempArr.push(resultRecordings["result"]["recordings"][i]);
                    }
                }             
                if (recordingTempArr.length === 0){             
                    $('#ySpeechAction').empty();                
                    $("#ySpeechAction").append($.t("no-matching")).css("color", "red");   
                }
                else {
                    var recordingID = "";
                    var date = "";
                    for(var i = 0; i < recordingTempArr.length; i++){  
                        var startDate = new Date (
                            parseInt(recordingTempArr[i]["starttime"].split(' ')[0].split("-")[0]), //year
                            parseInt((recordingTempArr[i]["starttime"].split(' ')[0].split("-")[1])-1), //month
                            parseInt(recordingTempArr[i]["starttime"].split(' ')[0].split("-")[2]), //day
                            parseInt(recordingTempArr[i]["starttime"].split(' ')[1].split(":")[0]), //hour
                            parseInt(recordingTempArr[i]["starttime"].split(' ')[1].split(":")[1]) //minute
                        );
                        
                        if (timePointer == "next" && (startDate < date || date == "")) {
                            date = startDate;
                            recordingID = recordingTempArr[i]["recordingid"]
                            
                        }                    
                        else if (timePointer == "oldest" && (startDate < date || date == "")) {
                            date = startDate;
                            recordingID = recordingTempArr[i]["recordingid"];
                            console.log(recordingID);
                            
                        }                  
                        else if (timePointer == "latest" && (startDate > date || date == "")) {
                            date = startDate;
                            recordingID = recordingTempArr[i]["recordingid"];
                            
                        }      
                    }                 
                }
                
                if (recordingID == ""){   
                        $('#ySpeechAction').empty();
                        $("#ySpeechAction").append($.t("no-matching")).css("color", "red");
                }
                else {
                    yPvrRecordings.playRecording(recordingID);                    
                    yCore.sendJsonRPC(
                        'GetRecordingDetails',
                        '{"jsonrpc":"2.0","method":"PVR.GetRecordingDetails","id":1,"params":['
                            + recordingID
                        +',["title"]]}',
                        function(resultDetails){
                            $("#ySpeechAction").append(resultDetails["result"]["recordingdetails"]["title"]);    
                        }
                    );
                }
            }
        );   
    },
    pvrOldestOrLatestTelevisionRecoring: function(oldestOrLatest){
        var recordingID = "";
        var recordingTempArr = [];
        
        yCore.sendJsonRPC(
            'getPVR-Recordings',
            '{"jsonrpc":"2.0","method":"PVR.GetRecordings","id":"1","params":{"properties": ' 
            //"channel","file","title","resume","starttime","endtime","runtime","icon","plotoutline"
            + '["file","title","genre","channel","resume","playcount","starttime"]}}',
            function(resultRecordings){                  
                if (resultRecordings["result"]["limits"]["end"] < 1){             
                    $('#ySpeechAction').empty();                
                    $("#ySpeechAction").append($.t("no-matching")).css("color", "red");   
                }
                else {
                    var recordingID = "";
                    var date = "";
                    for(var i = 0; i < resultRecordings["result"]["limits"]["end"]; i++){
                        
                        var startDate = new Date (
                            parseInt(resultRecordings["result"]["recordings"][i]["starttime"].split(' ')[0].split("-")[0]), //year
                            parseInt((resultRecordings["result"]["recordings"][i]["starttime"].split(' ')[0].split("-")[1])-1), //month
                            parseInt(resultRecordings["result"]["recordings"][i]["starttime"].split(' ')[0].split("-")[2]), //day
                            parseInt(resultRecordings["result"]["recordings"][i]["starttime"].split(' ')[1].split(":")[0]), //hour
                            parseInt(resultRecordings["result"]["recordings"][i]["starttime"].split(' ')[1].split(":")[1]) //minute
                        );                        
                        
                       if (startDate > date && oldestOrLatest == "latest" || date == "" && oldestOrLatest == "latest") {
                            date = startDate;
                            recordingID = resultRecordings["result"]["recordings"][i]["recordingid"];
                        }
                       else if (startDate < date && oldestOrLatest == "oldest" || date == "" && oldestOrLatest == "oldest") {
                            date = startDate;
                            recordingID = resultRecordings["result"]["recordings"][i]["recordingid"];
                    console.log(recordingID);
                        }
                    }       
                }
                
                if (recordingID == "" || date == ""){   
                        $('#ySpeechAction').empty();
                        $("#ySpeechAction").append($.t("no-matching")).css("color", "red");
                }
                else {
                    yPvrRecordings.playRecording(recordingID);                    
                    yCore.sendJsonRPC(
                        'GetRecordingDetails',
                        '{"jsonrpc":"2.0","method":"PVR.GetRecordingDetails","id":1,"params":['
                            + recordingID
                        +',["title"]]}',
                        function(resultDetails){
                            $("#ySpeechAction").append(resultDetails["result"]["recordingdetails"]["title"]);    
                        }
                    );
                }
            }
        );   
    },
    pvrTelevisionSearch: function(section, title){
        var genreList = [];
        var bestMatch = "";
        var lowestIterationOfAll = 999999999999;
        
        $("input[name='pvr-tv-search-radio']").checkboxradio();
        $("input[name='pvr-tv-search-radio']").checkboxradio("refresh");
        
        if(section == "title") {
            $("input[name='pvr-tv-search-radio']").filter('[value="title"]').prop('checked', true);
            
            yS.yS.pvrTVSearchPageSettings.titleField = title;
            yS.yS.pvrTVSearchPageSettings.category = "title";
            yS.saveSettingsToLocalStorage();
            
            $('#pvr-tv-search-titleField').val(title);
            
            yPvrTVSearch.printList(title, "");   
            
            $("#pvr-tv-search-titleField-box").show(); 
            $("#pvr-tv-search-genreSelect-box").hide();             
            
            $.mobile.navigate("#pvr-tv-search");
        }
        else if (section == "tag") {
            $("input[name='pvr-tv-search-radio']").filter('[value="tag"]').prop('checked', true);            
            
            //fill genreList with avialble genres
            for (var i = 0; i < yLib.pvrTVBroadcasts.length; i++) {    
                for (var j = 0; j < yLib.pvrTVBroadcasts[i]["result"]["limits"]["end"]; j++) {  
                    for (var k = 0; k < yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["genre"].length; k++) {
                                
                        if (!(jQuery.inArray(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["genre"][k], genreList) > -1)){//push if not already there
                            genreList.push(yLib.pvrTVBroadcasts[i]["result"]["broadcasts"][j]["genre"][k]);
                        }
                    }
                }
            } 
        
            for (i=0; i < genreList.length; i++){
                if(lowestIterationOfAll > yTools.damerauLevenshtein(genreList[i].toLowerCase(), title.toLowerCase())){
                    bestMatch = genreList[i];
                    lowestIterationOfAll = yTools.damerauLevenshtein(genreList[i].toLowerCase(), title.toLowerCase());
                }                     
            }  
            
            $('#ySpeechAction').append(bestMatch);
            
            yS.yS.pvrTVSearchPageSettings.genreSelect = bestMatch;
            yS.yS.pvrTVSearchPageSettings.category = "tag";
            yS.saveSettingsToLocalStorage();
            
            yPvrTVSearch.printList("", bestMatch);  
    
            $('#pvr-tv-search-genreSelect').val(bestMatch);
            $('#pvr-tv-search-genreSelect').selectmenu().selectmenu('refresh', true);
            
            $("#pvr-tv-search-titleField-box").hide(); 
            $("#pvr-tv-search-genreSelect-box").show(); 
            
            $.mobile.navigate("#pvr-tv-search");     
        }
        
        $("#pvr-tv-search-radio").val(yS.yS.pvrTVSearchPageSettings.genreSelect);
//TODO refresh of radio does not work due to some init problem        $("#pvr-tv-search-radio").checkboxradio("refresh"); //refresh after setting it
    },
    playMusicFilteredGenre: function(genre){
        bestMatch = "";
        
        var lowestIterationOfAll = 999999999999;
        for (i=0; i < yLib.musicGenres.length; i++){
            if(lowestIterationOfAll > yTools.damerauLevenshtein(yLib.musicGenres[i]["label"].toLowerCase(), genre.toLowerCase())){
                bestMatch = yLib.musicGenres[i]["label"];
                lowestIterationOfAll = yTools.damerauLevenshtein(yLib.musicGenres[i]["label"].toLowerCase(), genre.toLowerCase());
            }                     
        }   
        
        yMusic.playMusicFiltered("genre", bestMatch);
        $("#ySpeechAction").append(bestMatch);    
    },  
    playMusicFilteredArtist: function(artist){
        bestMatch = "";
        
        var lowestIterationOfAll = 999999999999;
        for (i=0; i < yLib.musicArtists.length; i++){
            if(lowestIterationOfAll > yTools.damerauLevenshtein(yLib.musicArtists[i]["label"].toLowerCase(), artist.toLowerCase())){
                bestMatch = yLib.musicArtists[i]["label"];
                lowestIterationOfAll = yTools.damerauLevenshtein(yLib.musicArtists[i]["label"].toLowerCase(), artist.toLowerCase());
            }                     
        }   
        
        yMusic.playMusicFiltered("artist", bestMatch);
        $("#ySpeechAction").append(bestMatch);    
    },  
    playMusicAlbums: function(albumName){
        bestMatchId = "";
        
        var lowestIterationOfAll = 999999999999;
        for (i=0; i < yLib.musicAlbums["result"]["limits"]["end"]; i++){
            if(lowestIterationOfAll > yTools.damerauLevenshtein(yLib.musicAlbums["result"]["albums"][i]["label"].toLowerCase(), albumName.toLowerCase())){
                bestMatchId = i;
                lowestIterationOfAll = yTools.damerauLevenshtein(yLib.musicAlbums["result"]["albums"][i]["label"].toLowerCase(), albumName.toLowerCase());
            }                     
        }   

        yMusic.albumDetailsAddAlbum(bestMatchId);
        $("#ySpeechAction").append(yLib.musicAlbums["result"]["albums"][bestMatchId]["label"]);    
    },        
    listMusicAlbumsGenre: function(genre){
        bestMatchGenre = "";
        
        $('#genreSelectMusic').selectmenu().selectmenu('refresh', true);
        
        yMusic.init();
        
        var lowestIterationOfAll = 999999999999;
        for (i=0; i < yLib.musicGenres.length; i++){
            if(lowestIterationOfAll > yTools.damerauLevenshtein(yLib.musicGenres[i]["label"].toLowerCase(), genre.toLowerCase())){
                bestMatchGenre = yLib.musicGenres[i]["label"];
                lowestIterationOfAll = yTools.damerauLevenshtein(yLib.musicGenres[i]["label"].toLowerCase(), genre.toLowerCase());
            }                     
        }   

        //save change in settings
        yS.yS.musicPageSettings.genreselect = bestMatchGenre;
        yS.saveSettingsToLocalStorage();
        
        
        $("#genreSelectMusic").val(bestMatchGenre);
        $('#genreSelectMusic').selectmenu('refresh', true);

        $('#album_list').empty(); //empty ul to update list with new choices
        $("#album-flex-prev").empty();
        $("#album-flex-next").empty();

        yMusic.firstListItem = [0];  //if selection changed, start from the beginning

        yMusic.createAlbumList(0, bestMatchGenre, ""); 
        $.mobile.navigate("#music");
        $("#ySpeechAction").append(bestMatchGenre);    
    },     
    listMusicAlbumsArtist: function(artist){
        bestMatchArtist = "";
        
        yMusic.init();
        $("#genreSelectMusic").val("all");
        $('#genreSelectMusic').selectmenu().selectmenu('refresh', true);        
        
        var lowestIterationOfAll = 999999999999;
        for (i=0; i < yLib.musicGenres.length; i++){
            if(lowestIterationOfAll > yTools.damerauLevenshtein(yLib.musicArtists[i]["label"].toLowerCase(), artist.toLowerCase())){
                bestMatchArtist = yLib.musicArtists[i]["label"];
                lowestIterationOfAll = yTools.damerauLevenshtein(yLib.musicArtists[i]["label"].toLowerCase(), artist.toLowerCase());
            }                     
        }
        
        $("#searchMusic").val(bestMatchArtist);

        $('#album_list').empty(); //empty ul to update list with new choices
        $("#album-flex-prev").empty();
        $("#album-flex-next").empty();

        yMusic.firstListItem = [0];  //if selection changed, start from the beginning

        yMusic.createAlbumList(0, "all", bestMatchArtist); 
        $.mobile.navigate("#music");
        $("#ySpeechAction").append(bestMatchArtist);    
    },
    subtitle: function(speechCmd){
        var subtitleArray = []; 
        
        //TODO check if any palyer is active and warn if not and don't do then any of the following stuff
        
        yCore.sendJsonRPC(
            'GetAviableSubtitles',
            '{"jsonrpc":"2.0","method":"Player.GetProperties","id":2,"params":[' + yCore.activePlayer + ',["subtitles"]]' + '}',
            function(aviableSubtitles){
                if(aviableSubtitles["result"]["subtitles"].length == 0){
                    $("#ySpeechAction").append($.t("no-matching")).css("color", "red");                            
                } else {
                    for (var j=0; j < aviableSubtitles["result"]["subtitles"].length; j++){
                        subtitleArray[langCodeToDescFlag[aviableSubtitles["result"]["subtitles"][j]["language"]]["english"].toLowerCase()] = aviableSubtitles["result"]["subtitles"][j];
                    }
                    
                    if(speechCmd == "list"){                        
                        $.mobile.navigate("#langSubDetails");
                        yLangSubDetails.init();
                    }
                    
                    //if its a numeric i suppose its the index of the subtitle
                    else if($.isNumeric(speechCmd)){
                        yCore.sendJsonRPC(
                            'showSubtitle',
                            '{"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":' + yCore.activePlayer 
                                        + ', "subtitle":"on"}}',
                            ''
                        );  
                        yCore.sendJsonRPC(
                            'showSubtitleWithIndexNo',
                            '{"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":' + yCore.activePlayer 
                                        + ', "subtitle":'+ parseInt(speechCmd-1)+'}}',
                            ''
                        );            
                    } 
                    else {
                        var lowestIterationOfAll = 999999999999;
                        var indexNumberBestLanguageMatch = -1;
                        
                        for(i=0;i < aviableSubtitles["result"]["subtitles"].length;i++){
                            if(lowestIterationOfAll > yTools.damerauLevenshtein(langCodeToDescFlag[aviableSubtitles["result"]["subtitles"][i]["language"]]["english"].toLowerCase(), speechCmd.toLowerCase())){
                                indexNumberBestLanguageMatch = aviableSubtitles["result"]["subtitles"][i]["index"];
                                lowestIterationOfAll = yTools.damerauLevenshtein(langCodeToDescFlag[aviableSubtitles["result"]["subtitles"][i]["language"]]["english"].toLowerCase(), speechCmd.toLowerCase());
                            }
                            
                        }
                        
                        yCore.sendJsonRPC(
                            'switchToSubtitleWithIndexNo',
                            '{"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":' + yCore.activePlayer 
                                        + ', "subtitle":'+ indexNumberBestLanguageMatch +'}}',
                            ''
                        ); 
                        yCore.sendJsonRPC(
                            'showSubtitle',
                            '{"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":' + yCore.activePlayer 
                                        + ', "subtitle":"on"}}',
                            ''
                        );  
                        $('#ySpeechAction').append(langCodeToDescFlag[aviableSubtitles["result"]["subtitles"][indexNumberBestLanguageMatch]["language"]]["english"]);
                    }
                }
            }
        ); 
    },
    subtitleControl: function(cmd){
        if(cmd=="toggle"){
            yCore.sendJsonRPC(
                'ShowSubtitles',
                '{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":["showsubtitles"],"id":20}',
                ''
            );   
        }
        else if(cmd=="next"){
            yCore.sendJsonRPC(
                'showSubtitle',
                '{"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":' + yCore.activePlayer 
                            + ', "subtitle":"on"}}',
                ''
            );  
            yCore.sendJsonRPC(
                'NextSubtitle',
                '{"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":' + yCore.activePlayer 
                            + ', "subtitle":"next"}}',
                ''
            );
        }
        else if(cmd=="previous"){
            yCore.sendJsonRPC(
            'showSubtitle',
            '{"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":' + yCore.activePlayer 
                        + ', "subtitle":"on"}}',
            ''
            );   
            yCore.sendJsonRPC(
                'PreviousSubtitle',
                '{"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":' + yCore.activePlayer 
                            + ', "subtitle":"previous"}}',
                ''
            );  
        }
    },    
    volume: function(percentage, direction){
        if(direction == "up"){
            if(percentage == ""){
                yRemote.setVolume("Volume.Plus", 10);
                $("#ySpeechAction").append("+10%");
            } 
            else {
                yRemote.setVolume("Volume.Plus", percentage);
                $("#ySpeechAction").append("+" + percentage + "%");
            }
        }
        else if(direction == "down"){
            if(percentage == ""){
                yRemote.setVolume("Volume.Minus", 10);
                $("#ySpeechAction").append("-10%");
            }
            else {
                yRemote.setVolume("Volume.Minus", percentage);
                $("#ySpeechAction").append("-" + percentage + "%");
            }
        }
        //search for percentage command like "volume 50%"
        else if($.isNumeric(percentage)){
            if (percentage > 100){percentage = 100;}
            else if (percentage < 0){percentage = 0;}
            yCore.sendJsonRPC(
                'SetVolume',
                '{"jsonrpc": "2.0", "method": "Application.SetVolume", "params": { "volume": ' + percentage + ' }, "id": 1}',
                ''  
            );
            $("#ySpeechAction").append(percentage + "%");
        } 
        else {
            $("#ySpeechAction").append(": " + $.t("no-matching"));
            $("#ySpeechAction").css("color", "red");
        }
    }
}


/*
 * Tools in GUI see yTools for yarcScript rutines
 */
var yToolsGUI = {
    /*
    * prepares the tools page
    */
    init: function(){      
        //refresh here, because on select init, the settings are not written by then
        $("#tools").collapsible({
            expand: function(e){
                $("#turn-off-select").selectmenu('refresh');
            }
        });
        
        yCore.sendJsonRPC(
            'audioDevices',
            '{"jsonrpc":"2.0","method":"Settings.GetSettings","params":["standard",{"section":"system","category":"audio"}],"id":1}',
            function(resultaudioDevices){
              var audioDevices = resultaudioDevices["result"]["settings"][0]["options"];
              
              for (var j=0; j < audioDevices.length; j++){  
                $('#audioOutput').append("<option value='" + audioDevices[j]["value"]  + "'>" + audioDevices[j]["label"] + "</option>");
              }
              
              $("#audioOutput").val(resultaudioDevices["result"]["settings"][0]["value"]).change();
              
              $("#audioOutput").selectmenu('refresh');
            },
            false
        );
        
        $("#audioOutput").change(function() {
          yCore.sendJsonRPC(
              'switchAudioDevice',
              '{"jsonrpc":"2.0","method":"Settings.SetSettingValue","params":["audiooutput.audiodevice","'+$(this).val()+'"],"id":1}',
              '',
              false
          );
        });
        
        /*-------------Index Page - cleanAndUpdate  Clean and Update Audio and Video Library  -------------------------*/
        $(".cleanAndUpdate").click(function(e) {
            e.stopImmediatePropagation();
            yToolsGUI.cleanAndUpdate($(this).attr('data-yJsonFunction'));
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
 * Tools and functions which are used in differnet modules
 */
var yTools = {
  sizeHumanReadable: function(size){
      size = size/1024;
      if(size.toString().split(".")[0].length < 4){
        return size.toFixed(1) + "KB";
      }
      size = size/1024;
      if(size.toString().split(".")[0].length < 4){
        return size.toFixed(1) + "MB";
      }
      size = size/1024;
      if(size.toString().split(".")[0].length < 4){
        return size.toFixed(1) + "GB";
      }
      size = size/1024;
      if(size.toString().split(".")[0].length < 4){
        return size.toFixed(1) + "TB";
      }
      return ""; 
  },  
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

    if(kodiLang.length > 0){
        for (var j=0;  j < kodiLang.length; j++){//go trough whole audio list
            if(kodiLang[j]["native"] == "" || kodiLang[j]["isocode"] == "und" || kodiLang[j]["native"] === undefined || kodiLang[j]["isocode"] === undefined ){//if langague is empty string or code for "Undetermined" it's like unknown
                returnstring += "";
            } else {
                if(kodiLang[j].flag == ""){ //if there is no flag set, write out the name/description of the language
                    returnstring += "[" + kodiLang[j]["native"] + "]&nbsp";
                } 
                else {
                    returnstring += "<img class='pathToFlags' alt='flag for "
                        + kodiLang[j].native + " ("+kodiLang[j].native+")' src='resources/images/flags/"
                        + kodiLang[j].flag + ".png' "
                        + "title='"+ kodiLang[j].native + " ("+kodiLang[j].isocode+")' />&nbsp;";
                }
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
  imageUrlNormalizer: function(imageLink, type, tagOrURL, classes, altText, direct){
    let protocolString = "http://";
      
    if ( $(location).attr("protocol") == "https:") {
        protocolString = "https://";
    }
      
    if(imageLink === undefined){
        imageLink = "none";
    }
      
    //handling empty linkstring
    if(imageLink == ""){
        if(type == "?"){
            if(tagOrURL == "tag"){
                return "<span class='" + classes + " icon-question'></span>";
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
        }
        else {
            if(tagOrURL == "tag"){
                return "<span class='icon-folder-open awsomeicon-padding " + classes + "'></span>";
            } else {
                return "";
            }
        }
    }
      
    if(!imageLink.match("^image://http") && imageLink.includes("%2fhome%2f")){
            imageLink = imageLink + "2"; //just add something at the end of the Link. don't know why it works but it does
    }

    //if it is not one of above, it is a local image or a direct web address
    if (direct) {//if direct web address
        if(tagOrURL == "tag"){//if local stored
            return "<img class='" + classes + "' alt='" + altText + "'src='" + imageLink + "'/>";
        } else {
            return protocolString + $(location).attr('host') + "/image/" + imageLink;
        }          
    }
    else {
        if(tagOrURL == "tag"){//if local stored
            return "<img class='" + classes + "' alt='" + altText + "'src='"+protocolString+ $(location).attr('host') + "/image/" + encodeURIComponent(imageLink) + "'/>";
        } else {
            return protocolString + $(location).attr('host') + "/image/" + encodeURIComponent(imageLink);
        }
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
  },
    /**
    * Sorts multiple collapsibles (not content of it!) within a container
    * container is the tag within the collapsibles are
    * attribute is what attribe of the colapsible it should be sorted (for ex. a data-* attribute)
    * asc if true: ascending, if false descending
    */
  sortCollapsible: function(container, attribute, asc) {
      if (asc){
        $(container + ">div[data-role='collapsible']").sort(function (a, b) {
            if ( ($(a).attr(attribute).toLowerCase() > $(b).attr(attribute).toLowerCase()) )  { 
                return 1;
            } else if ( ($(a).attr(attribute).toLowerCase() == $(b).attr(attribute).toLowerCase()) ){
                return 0;
            } else {
                return -1;
            }
        }).each(function () {
            var elem = $(this);
            elem.remove();
            $(elem).appendTo(container);
            $(this).collapsible();
        });
      }
      else {
        $(container + ">div[data-role='collapsible']").sort(function (a, b) {
            if ( ($(a).attr(attribute).toLowerCase() < $(b).attr(attribute).toLowerCase()) )  { 
                return 1;
            } else if ( ($(a).attr(attribute).toLowerCase() == $(b).attr(attribute).toLowerCase()) ){
                return 0;
            } else {
                return -1;
            }
        }).each(function () {
            var elem = $(this);
            elem.remove();
            $(elem).appendTo(container);
            $(this).collapsible();
        });
          
      }
      
      
  },
    /**
    * Calculates the Damerau-Levenshtein distance between two strings.
    * returns changes needed (the smaller the number, the better
    */
    damerauLevenshtein: function(a, b){
    var d = true; //always do demerau
        
    //from http://jsfiddle.net/zf464/194/
    var x = a.length, y = b.length;
    var i, j, c, m = [];
    for(i = 0; i <= x; i++) {
        m[i] = [];
        m[i][0] = i;
    }
    for(i = 0; i <= y; i++) {
        m[0][i] = i;
    }
    for(i = 1; i <= x; i++) {
      for(j = 1; j <= y; j++) {
          c = (a[i - 1] === b[j - 1] ? 0 : 1);
          m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + c);
          if(d && i > 1 && j > 1 && a[i] === b[j - 1] && a[i - 1] === b[j]) {
              d[i, j] = Math.min(m[i, j], d[i - 2, j - 2] + c);
          }
      }  
    }
    return m[x][y];
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
    $("#yarcDemoVid").click(function(e) {
        e.stopImmediatePropagation();
        yCore.sendJsonRPC(
            'PlayerOpen',
            '{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item": {"file" : "plugin://plugin.video.youtube/?action=play_video&videoid='
            + 'yltMcKJFewE" }}, "id" : "1"}',
            ' '
        );
        yRemote.updateLastPlayingFile("file",'plugin:"//plugin.video.youtube/?action=play_video&videoid=yltMcKJFewE"');
    });  
      
    $("#language").val(yS.yS.language);
    $("#language").selectmenu("refresh");

    if(yS.yS.hidePrevPics){
      $('input[name=hidePrevPics]').prop("checked", true).checkboxradio("refresh");
    } else{
      $('input[name=hidePrevPics]').prop("checked", false).checkboxradio("refresh");
    }
    if(yS.yS.hideWatched){
      $('input[name=hideWatched]').prop("checked", true).checkboxradio("refresh");
    } else{
      $('input[name=hideWatched]').prop("checked", false).checkboxradio("refresh");
    }

    $('#listLength').val(yS.yS.listLength);
    
    if(yS.yS.hideDirectorMovies){
      $('input[name=hideDirectorMovies]').prop("checked", true).checkboxradio("refresh");
    } else{
      $('input[name=hideDirectorMovies]').prop("checked", false).checkboxradio("refresh");
    }
    if(yS.yS.hideActorMovies){
      $('input[name=hideActorMovies]').prop("checked", true).checkboxradio("refresh");
    } else{
      $('input[name=hideActorMovies]').prop("checked", false).checkboxradio("refresh");
    }
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
    
     if(yS.yS.hideSpeech){
      $('input[name=hideSpeech]').prop("checked", true).checkboxradio("refresh");
    } else{
      $('input[name=hideSpeech]').prop("checked", false).checkboxradio("refresh");
    }    
    if(yS.yS.hideDevOrient){
      $('input[name=hideDevOrient]').prop("checked", true).checkboxradio("refresh");
    } else{
      $('input[name=hideDevOrient]').prop("checked", false).checkboxradio("refresh");
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
    
    $('#pvrTvTimeShift').val(yS.yS.pvrTvTimeShift);
    if(yS.yS.hidePvrSlider){
      $('input[name=hidePvrSlider]').prop("checked", true).checkboxradio("refresh");
    } else{
      $('input[name=hidePvrSlider]').prop("checked", false).checkboxradio("refresh");
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

    //TODO regex does not work!
    $("#pvrTvTimeShift").blur(function(e) {
      $("#pvrTvTimeShift_label").css('color', 'white');
      $("#saveSettings").button('enable');
      var numericReg = /^[\+|\-]{1}[0-9]{1,2}$/;
      if (!numericReg.test($('[name=pvrTvTimeShift]').val())) {
        alert($.t("warning-plus-minus-zero-twelve"));
        $("#saveSettings").button('disable');
        $("#pvrTvTimeShift_label").css('color', 'red');
        return false;
      }
      if ($('[name=pvrTvTimeShift]').val() == "") {
        alert($.t("warning-plus-minus-zero-twelve"));
        $("#saveSettings").button('disable');
        $("#pvrTvTimeShift_label").css('color', 'red');
        return false;
      }
      return false;
    });    

    $("#delSettings").click(function(e) {
      e.stopImmediatePropagation();
      var choice = confirm($.t('sure-to-delete'));

      if (choice) {
        localStorage.removeItem("yarcLibAddons");
        localStorage.removeItem("yarcLibFavourites");
        localStorage.removeItem("yarcLibMovieLanguage");
        localStorage.removeItem("yarcLibMovies");
        localStorage.removeItem("yarcLibMusicGenres");
        localStorage.removeItem("yarcLibMusicArtists");        
        localStorage.removeItem("yarcLibMusicAlbums");
        localStorage.removeItem("yarcLibPvrTVChannels");
        localStorage.removeItem("yarcLibSeries");
        localStorage.removeItem("yarcSettings");
        window.location.href = "index.html";
      }
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

      //checks if startpage items are in settings and creates object if needed
      if (!(yS.yS.hasOwnProperty('startPageSettings'))) {
        yS.yS.startPageSettings = {};
      }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showRecentMovies'))) {
            yS.yS.startPageSettings.showRecentMovies = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showRecentSeries'))) {
            yS.yS.startPageSettings.showRecentSeries = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showmostUsedPvrTV'))) {
            yS.yS.startPageSettings.showmostUsedPvrTV = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showlatesPvrTVrecordings'))) {
            yS.yS.startPageSettings.showlatesPvrTVrecordings = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showmostUsedPvrRadio'))) {
            yS.yS.startPageSettings.showmostUsedPvrRadio = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showMostPlayedAlbum'))) {
            yS.yS.startPageSettings.showMostPlayedAlbum = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showmostUsedAddons'))) {
            yS.yS.startPageSettings.showmostUsedAddons = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('showmostUsedFavs'))) {
            yS.yS.startPageSettings.showmostUsedFavs = true;
        }
        if (!(yS.yS.startPageSettings.hasOwnProperty('shutdownchoice'))) {
            yS.yS.startPageSettings.shutdownchoice = "Application.Quit";
        }
      
      if (!(yS.yS.hasOwnProperty('libAddons'))) {
            yS.yS.libAddons = {};
      }

      if (!(yS.yS.hasOwnProperty('moviePageSettings'))) {
        yS.yS.moviePageSettings = {};
      }
        if (!(yS.yS.moviePageSettings.hasOwnProperty('genreSelect'))) {
            yS.yS.moviePageSettings.genreSelect = "all";
        }
        if (!(yS.yS.moviePageSettings.hasOwnProperty('languageSelect'))) {
            yS.yS.moviePageSettings.languageSelect = "all";
        }
        if (!(yS.yS.moviePageSettings.hasOwnProperty('directorSelect'))) {
            yS.yS.moviePageSettings.directorSelect = "all";
        }
        if (!(yS.yS.moviePageSettings.hasOwnProperty('actorSelect'))) {
            yS.yS.moviePageSettings.actorSelect = "all";
        }

      if (!(yS.yS.hasOwnProperty('pvrRecordingsPageSettings'))) {
        yS.yS.pvrRecordingsPageSettings = {};
      }
        if (!(yS.yS.pvrRecordingsPageSettings.hasOwnProperty('sort'))) {
            yS.yS.pvrRecordingsPageSettings.sort = "date";
        }
      
      if (!(yS.yS.hasOwnProperty('pvrTVSearchPageSettings'))) {
        yS.yS.pvrTVSearchPageSettings = {};
      }
      if (!(yS.yS.pvrTVSearchPageSettings.hasOwnProperty('category'))) {
          yS.yS.pvrTVSearchPageSettings.category = "title";
      }
      if (!(yS.yS.pvrTVSearchPageSettings.hasOwnProperty('titleField'))) {
          yS.yS.pvrTVSearchPageSettings.titleField = "title";
      }
      if (!(yS.yS.pvrTVSearchPageSettings.hasOwnProperty('genreSelect'))) {
          yS.yS.pvrTVSearchPageSettings.genreSelect = "none";
      }

      if (!(yS.yS.hasOwnProperty('musicPageSettings'))) {
        yS.yS.musicPageSettings = {};
      }
      if (!(yS.yS.musicPageSettings.hasOwnProperty('genreselect'))) {
          yS.yS.musicPageSettings.genreselect = "all";
      }

      if (!(yS.yS.hasOwnProperty('addonPageSettings'))) {
        yS.yS.addonPageSettings = {};
      }
      if (!(yS.yS.addonPageSettings.hasOwnProperty('addonselect'))) {
          yS.yS.addonPageSettings.addonselect = "all";
      }
      
      if (!(yS.yS.hasOwnProperty('hidePrevPics'))) {
          yS.yS.hidePrevPics = false;
      }
      if (!(yS.yS.hasOwnProperty('hideWatched'))) {
          yS.yS.hideWatched = false;
      }
      if (!(yS.yS.hasOwnProperty('hideDirectorMovies'))) {
          yS.yS.hideDirectorMovies = true;
      }
      if (!(yS.yS.hasOwnProperty('hideActorMovies'))) {
          yS.yS.hideActorMovies = true;
      }
      if (!(yS.yS.hasOwnProperty('hideGenreMovies'))) {
          yS.yS.hideGenreMovies = false;
      }
      if (!(yS.yS.hasOwnProperty('hideLanguageMovies'))) {
          yS.yS.hideLanguageMovies = false;
      }
      if (!(yS.yS.hasOwnProperty('pvrTvTimeShift'))) {
          yS.yS.pvrTvTimeShift = "+0";
      }
      if (!(yS.yS.hasOwnProperty('hideSpeech'))) {
            if ($(location).attr('protocol') !== "https:") {
              if ($(location).attr('hostname') !== "localhost") {
                yS.yS.hideSpeech = true;
              }
              else {yS.yS.hideSpeech = false;}
            }
            else {yS.yS.hideSpeech = false;}
      }
      if (!(yS.yS.hasOwnProperty('hideDevOrient'))) {
          yS.yS.hideDevOrient = false;
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
      if (!(yS.yS.hasOwnProperty('hideGenreMusic'))) {
          yS.yS.hideGenreMusic = false;
      }
      if (!(yS.yS.hasOwnProperty('hideSearchMusic'))) {
          yS.yS.hideSearchMusic = false;
      }
      if (!(yS.yS.hasOwnProperty('hidePvrSlider'))) {
          yS.yS.hidePvrSlider = false;
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
    yS.yS.pvrTvTimeShift = parseInt($('[name=pvrTvTimeShift]').val());
    
    if($('[name=listLength]').val() == 0){
        yS.yS.listLength = 9999999;
    } else {
        yS.yS.listLength = parseInt($('[name=listLength]').val());
    }

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

//get settings from local storage and chooses language of the yarc interface
if(localStorage.getItem("yarcSettings") === null) {
  //check if there are already settings, if not, set Kodi language if in yarc aviable or english, has to be done befor interface begins to load
  yCore.sendJsonRPC(
    'GetLanguage',
    '{"jsonrpc":"2.0","method":"Settings.GetSettingValue", "params":{"setting":"locale.language"},"id":1}',
    function(resultGetLanguage){
      var kodiLanguage = resultGetLanguage["result"]["value"].split('.')[2].split('_')[0]
      if(kodiLanguage == "de"
          ||kodiLanguage == "en"
          ||kodiLanguage == "es"
          ||kodiLanguage == "he"
          ||kodiLanguage == "it"
          ||kodiLanguage == "pt"
          ||kodiLanguage == "ru"
      ){
        yS.yS.language = kodiLanguage;
      } else {
        yS.yS.language = "en";
      }
      yS.saveSettingsToLocalStorage();
    },
    false
  );
} else {
  //get settings from local storage and save it in settings object
  yS.yS = JSON.parse(localStorage.getItem('yarcSettings'));
}

//create local storage keys or get libraries form local storage and save it in the according library object
if(localStorage.getItem("yarcLibMovies") === null){localStorage.setItem("yarcLibMovies","[]");}else{yLib.movies = JSON.parse(localStorage.getItem('yarcLibMovies'));}
if(localStorage.getItem("yarcLibMovieLanguage") === null){localStorage.setItem("yarcLibMovieLanguage","[]");}
else{yLib.movieLanguage = JSON.parse(localStorage.getItem('yarcLibMovieLanguage'));}
if(localStorage.getItem("yarcLibMusicGenres") === null){localStorage.setItem("yarcLibMusicGenres","[]");}else{yLib.musicGenres = JSON.parse(localStorage.getItem('yarcLibMusicGenres'));}
if(localStorage.getItem("yarcLibMusicArtists") === null){localStorage.setItem("yarcLibMusicArtists","[]");}else{yLib.musicArtists = JSON.parse(localStorage.getItem('yarcLibMusicArtists'));}
if(localStorage.getItem("yarcLibSeries") === null){localStorage.setItem("yarcLibSeries","[]");}else{yLib.series = JSON.parse(localStorage.getItem('yarcLibSeries'));}
if(localStorage.getItem("yarcLibMusicAlbums") === null){localStorage.setItem("yarcLibMusicAlbums","[]");}else{yLib.musicAlbums = JSON.parse(localStorage.getItem('yarcLibMusicAlbums'));}
if(localStorage.getItem("yarcLibAddons") === null){localStorage.setItem("yarcLibAddons","[]");}else{yLib.addons = JSON.parse(localStorage.getItem('yarcLibAddons'));}
if(localStorage.getItem("yarcLibFavourites") === null){localStorage.setItem("yarcLibFavourites","[]");}else{yLib.favourites = JSON.parse(localStorage.getItem('yarcLibFavourites'));}
if(localStorage.getItem("yarcLibPvrTVChannels") === null){localStorage.setItem("yarcLibPvrTVChannels","[]");}else{yLib.pvrTVChannels = JSON.parse(localStorage.getItem('yarcLibPvrTVChannels'));}
if(localStorage.getItem("yarcLibPvrRadioChannels") === null){localStorage.setItem("yarcLibPvrRadioChannels","[]");}else{yLib.pvrTVChannels = JSON.parse(localStorage.getItem('yarcLibPvrRadioChannels'));}

$(document).one('pagebeforecreate', function () {
    $("body>[data-role='panel']").panel().enhanceWithin();
});

$(document).delegate(document, 'pageshow', yCore.init);
$(document).delegate(document, 'pageshow', yRemote.init);

$(document).delegate('', 'pageshow', yStart.init);
$(document).delegate('#pl', 'pageshow', yPl.init);//playlist
    
$(document).delegate('#movies', 'pageshow', yMovies.init);
$(document).delegate('#movies-set', 'pageshow', yMovieSets.init);

//$(document).on( "pagecontainershow",yMovies.init());
$(document).delegate('#series', 'pageshow', ySeries.init);
$(document).delegate('#langSubDetails', 'pageshow', yLangSubDetails.init);
$(document).delegate('#pvr-tv-channels', 'pageshow', yPvrTVChannels.init);
$(document).delegate('#pvr-tv-program', 'pageshow', yPvrTVProgram.init);
$(document).delegate('#pvr-details', 'pageshow', yPvrBroadcastDetails.init);
$(document).delegate('#pvr-recording-details', 'pageshow', yPvrRecordingDetails.init);
$(document).delegate('#pvr-tv-recordings', 'pageshow', yPvrRecordings.init);
$(document).delegate('#pvr-tv-search', 'pageshow', yPvrTVSearch.init);
$(document).delegate('#pvr-radio-channels', 'pageshow', yPvrRadioChannels.init);
$(document).delegate('#music', 'pageshow', yMusic.init);
$(document).delegate('#music-songsearch', 'pageshow', ySongSearch.init);
$(document).delegate('#addons', 'pageshow', yAddons.init);
$(document).delegate('#addonDetails', 'pageshow', yAddons.init);
$(document).delegate('#fav', 'pageshow', yFav.init);
$(document).delegate('#toolsGUI', 'pageshow', yToolsGUI.init);
$(document).delegate('#settings', 'pageshow', yS.init);

$.mobile.navigate("#start");

