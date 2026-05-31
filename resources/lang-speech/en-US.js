/*
 * Yarc - Yet another Remote Control (for Kodi)
 * ySpeechData Module v1.0
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
 */


/* HOW TO TRANSLATE
 * ================
 * 
 * 


//ySpeechTools
//TODO explain: synonyms might also come from webspeech. If you try a command it lists additonal posible transcitptions.
//TODO explain:
    //*
    //()
    //;
    //regex

//TODO everywhere where a * selector is (ex. tv *chanel) but not a definit call with out start (ex. tv), check for nothing and tell no-matching
    

//Dont change order. the one with star must be last
/* TODO
party mode
playlists
search pvr tv broadcast

music show details album


TODO goto movie sets navigate
TODO movie sets (play random, play next, play random unseen)
*/


var ySpeechCommands = {  
    /***********************************
     * Menu Navigation                 *
     ***********************************/   
   
   ':NavNewAndTop': {//v1.0
        'regexp': /^(Start|New and Top|Navigate Start|Navigate (to) New and Top|List Start|List New and Top|Open New and Top|Open Start)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to New & Top');
        $.mobile.navigate("#start"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
   ':NavMovies': {//v1.0
        'regexp': /^(Navigate to movies|Navigate movies|Navigate to movie|Navigate movie|List movies|List movie|open movies|open movie)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to Movies');
        $.mobile.navigate("#movies"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
     ':NavSeries': {//v1.0
        'regexp': /^(Navigate TV Show|Navigate to TV Show|List TV Show|open TV show|Navigate TV Shows|Navigate to TV Shows|List TV Shows|open TV Shows|TV Shows|TV Show)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to TV-Shows');
        $.mobile.navigate("#series"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
   ':NavMusic': {//v1.0
        'regexp': /^(Navigate to music|Navigate music|List music|Navigate album|Navigate to albums|Navigate album|Navigate to albums|List album|List albums|List music albums|List music album|navigate music album|navigate music albums|navigate to music albums|navigate to music album|open music albums|open music album|open music|open album|open albums)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to Music Albums');
        $.mobile.navigate("#music"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
    ':NavListTVChannels': {//v1.0
        'regexp': /^(Navigate Television channels|Navigate to Television channels|List Television channels|open Television channels|Navigate Television channel|Navigate to Television channel|List Television channel|open Television channel|Television channel|Television channels|Television)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to TV channels');
        $.mobile.navigate("#pvr-tv-channels"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
   ':NavListTVProgram': {//v1.0
        'regexp': /^(Navigate Television program|Navigate to Television program|List Television program|open Television program|Television program)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to TV Program');
        $.mobile.navigate("#pvr-tv-program"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
   ':NavListTVRecordings': {//v1.0
        'regexp': /^(Navigate Television recording|Navigate to Television recording|List Television recording|open Television recording|Television recording|Navigate Television recordings|Navigate to Television recordings|List Television recordings|open Television recordings|Television recordings)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to TV Recordings');
        $.mobile.navigate("#pvr-tv-recordings"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
   ':NavListTVSearch': {//v1.0
        'regexp': /^(Navigate Television search|Navigate to Television search|List Television search|open Television search|Television search)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to TV Program');
        $.mobile.navigate("#pvr-tv-search"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
    ':NavListRadioChannels': {//v1.0
        'regexp': /^(Navigate Radio channels|Navigate to Radio channels|List Radio channels|open Radio channels|Navigate Radio channel|Navigate to Radio channel|List Radio channel|open Radio channel|Radio channel|Radio channels|Radio)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to Radio Channels');
        $.mobile.navigate("#pvr-radio-channels"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
   ':NavAddons': {//v1.0
        'regexp': /^(Navigate addons|Navigate to addons|List addons|open addons|Navigate addon|Navigate to addon|List addon|open addon|addons|addon|Navigate add-ons|Navigate to add-ons|List add-ons|open add-ons|Navigate add-on|Navigate to add-on|List add-on|open add-on|add-ons|add-on|Navigate add ons|Navigate to add ons|List add ons|open add ons|Navigate add on|Navigate to add on|List add on|open add on|add ons|add on)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to Addons');
        $.mobile.navigate("#addons"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
    ':NavFavorites': {//v1.0
        'regexp': /^(Navigate Favorites|Navigate to Favorites|List Favorites|open Favorites|Navigate Favorite|Navigate to Favorite|List Favorite|open Favorite|Navigate Kodi Favorites|Navigate to Kodi Favorites|List Kodi Favorites|open Kodi Favorites|Navigate Kodi Favorite|Navigate to Kodi Favorite|List Kodi Favorite|open Kodi Favorite|Favorite|Favorites|Kodi Favorite|Kodi Favorites)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to Kodi Favorites');
        $.mobile.navigate("#fav"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
   ':NavPaylist': {//v1.0
        'regexp': /^(Navigate Playlist|Navigate to Playlist|List Playlist|open Playlist|Navigate Playlists|Navigate to Playlist|List Playlists|open Playlists|Playlist|Playlists)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to Playlist');
        $.mobile.navigate("#pl"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
   ':NavTools': {//v1.0
        'regexp': /^(Navigate Tool|Navigate to Tool|List Tool|open Tool|Navigate Tools|Navigate to Tools|List Tools|open Tools|Tool|Tools)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to Tools');
        $.mobile.navigate("#toolsGUI"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
   ':NavSettings': {//v1.0
        'regexp': /^(Navigate Setting|Navigate to Setting|List Setting|open Setting|Navigate Settings|Navigate to Settings|List Settings|open Settings|Settings|Setting)$/, 'callback': function() {
        $('#ySpeechAction').append('Yarc navigates to Settings');
        $.mobile.navigate("#settings"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
    /***********************************
     * Switch language in playing file *
     ***********************************/   
    
    'next language': function() {//v1.0
        $('#ySpeechAction').append('Switch to next language in list');
        ySpeech.languageControl("next"); 
        ySpeech.helpSection = "ySpeech_Language";
    }, 
    
    'previous language': function() {//v1.0
        $('#ySpeechAction').append('Switch to previous language in list');
        ySpeech.languageControl("previous"); 
        ySpeech.helpSection = "ySpeech_Language";
    },
    
    'list language(s) ': function() {//v1.0
        $("#ySpeechAction").append('Yarc shows list of aviable language ');  
        ySpeech.language("list");
        ySpeech.helpSection = "ySpeech_Language";
    },   
    
    '(set) (switch) language(s) (to) *lang': function(lang) {//v1.0
        $('#ySpeechAction').append('switch language to ');
        lang = ySpeechTools.text2Int(lang); 
        ySpeech.language(lang);
        ySpeech.helpSection = "ySpeech_Language";
    },
    
    /**********************************
     * Switch or turn on/of subtitles *
     **********************************/
    
    ':subToggle': {//v1.0
        'regexp': /^subtitle (on|show|hide|off|toggle)$/, 'callback': function() {
            $('#ySpeechAction').append("Player toggles subtitles");
            ySpeech.subtitleControl("toggle"); 
            ySpeech.helpSection = "ySpeech_Subtitle"; 
        }
    },
    ':subsToggle': {//v1.0
        'regexp': /^subtitles (on|show|hide|off|toggle)$/, 'callback': function() {
            $('#ySpeechAction').append("Player toggles subtitles");
            ySpeech.subtitleControl("toggle"); 
            ySpeech.helpSection = "ySpeech_Subtitle"; 
        }
    },   
    
    'next subtitle(s)': function() {//v1.0
        $('#ySpeechAction').append('Show next subtitle in list');
        ySpeech.subtitleControl("next"); 
        ySpeech.helpSection = "ySpeech_Subtitle";
    }, 
    
    'previous subtitle(s)': function() {//v1.0
        $('#ySpeechAction').append('Show previous subtitle in list');
        ySpeech.subtitleControl("previous"); 
        ySpeech.helpSection = "ySpeech_Subtitle";
    },
    
    'list subtitle(s)': function() {//v1.0
        $("#ySpeechAction").append('Yarc shows list of aviable subtitles ');  
        ySpeech.subtitle("list");
        ySpeech.helpSection = "ySpeech_Subtitle";
    },
    
    '(set) (switch) subtitle(s) (to) *sub': function(sub) {//v1.0
        $('#ySpeechAction').append('switch subtile to ');
        sub = ySpeechTools.text2Int(sub); 
        ySpeech.subtitle(sub);
        ySpeech.helpSection = "ySpeech_Subtitle";
    },
    
    /**************************************************
     * Reboot/Hibernate/Shutdown/Suspend (shutdown)   *
     **************************************************/
    
    'Reboot': function() {//v1.0           
        var answer = false;
        answer = confirm("Do you really want to reboot the system?");        
        if(answer){
            $('#ySpeechAction').append('Rebooting system...');
            yCore.simpleJsonRequest("System.Reboot"); 
        }
    },
    
    'Hibernate': function() {//v1.0         
        var answer = false;
        answer = confirm("Do you really want to hibernate the system?");        
        if(answer){
            $('#ySpeechAction').append('Hibernating system...');  
            yCore.simpleJsonRequest("System.Hibernate");
        }
    },
    
    'Shut down': function() {//v1.0         
        var answer = false;
        answer = confirm("Do you really want to shutdown the system?");        
        if(answer){
            $('#ySpeechAction').append('Shutdown system...');   
            yCore.simpleJsonRequest("System.Shutdown");
        }
    },
    
    ':suspend': {//v1.0
        'regexp': /^(suspend|suspense)$/, 'callback': function() {
            var answer = false;
            answer = confirm("Do you really want to suspend the system?");
            if(answer){
                $('#ySpeechAction').append('Suspending system...');
                yCore.simpleJsonRequest("System.Suspend");
            }
        }
    },
    
    'Quit': function() {//v1.0
        var answer = false;
        answer = confirm("Do you really want to quit Kodi?");
        if(answer){
            $('#ySpeechAction').append('Quitting Kodi...');
            yCore.simpleJsonRequest("Application.Quit");
        }
    },
    
    /**************************************
     * open favorite (speechHelpFavorite) *
     **************************************/

    'list favorite(s)': function() {//v1.0
        $('#ySpeechAction').append('Opens favorite ');
        ySpeech.favourite("list");
        ySpeech.helpSection = "ySpeech_Favorite"; 
    },
    
    'favorite(s) *favName': function(favName) {//v1.0
        $('#ySpeechAction').append('Opens favorite ');
        ySpeech.favourite(favName);
        ySpeech.helpSection = "ySpeech_Favorite"; 
    },    
    
    /*****************************************************
     * go to specific time in media (speechHelpGoto)     *
     *****************************************************/
    
    'skip :h hour(s) :min minute(s) :sec second(s)': function(h, min, sec) {//v1.0
        h = ySpeechTools.text2Int(h); 
        min = ySpeechTools.text2Int(min); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(h, min, sec, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'forward :h hour(s) :min minute(s) :sec second(s)': function(h, min, sec) {//v1.0
        h = ySpeechTools.text2Int(h); 
        min = ySpeechTools.text2Int(min); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(h, min, sec, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    'skip :h hour(s)': function(h) {//v1.0
        ySpeechTools.text2Int(h); 
        ySpeech.goto(h, 0, 0, "skip");
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'foward :h hour(s)': function(h) {//v1.0
        ySpeechTools.text2Int(h); 
        ySpeech.goto(h, 0, 0, "skip");
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    'skip :min minute(s)': function(min) {//v1.0
        min = ySpeechTools.text2Int(min); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(0, min, 0, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'foward :min minute(s)': function(min) {//v1.0
        min = ySpeechTools.text2Int(min); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(0, min, 0, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    'skip :sec second(s)': function(sec) {//v1.0
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(0, 0, sec, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'foward :sec second(s)': function(sec) {//v1.0
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(0, 0, sec, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    'skip :h hour(s) :min minute(s)': function(h, min) {//v1.0
        h = ySpeechTools.text2Int(h); 
        min = ySpeechTools.text2Int(min); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(h, min, 0, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'foward :h hour(s) :min minute(s)': function(h, min) {//v1.0
        h = ySpeechTools.text2Int(h); 
        min = ySpeechTools.text2Int(min); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(h, min, 0, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    'skip :h hour(s) :sec second(s)': function(h, sec) {//v1.0
        h = ySpeechTools.text2Int(h); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(h, 0, sec, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'foward :h hour(s) :sec second(s)': function(h, sec) {//v1.0
        h = ySpeechTools.text2Int(h); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(h, 0, sec, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    'skip :min minute(s) :sec second(s)': function(min, sec) {//v1.0
        min = ySpeechTools.text2Int(min); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(0, min, sec, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'foward :min minute(s) :sec second(s)': function(min, sec) {//v1.0
        min = ySpeechTools.text2Int(min); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player skips to new position');
        ySpeech.goto(0, min, sec, "skip");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },    
      
    '(go) back(ward) :h hour(s) :min minute(s) :sec second(s)': function(h, min, sec) {//v1.0
        $('#ySpeechAction').append('Player goes back to new position');
        h = ySpeechTools.text2Int(h); 
        min = ySpeechTools.text2Int(min); 
        sec = ySpeechTools.text2Int(sec); 
        ySpeech.goto(h, min, sec, "back");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    '(go) back(ward) :h hour(s) :min minute(s) :sec second(s)': function(h, min, sec) {//v1.0
        $('#ySpeechAction').append('Player goes back to new position');
        h = ySpeechTools.text2Int(h); 
        min = ySpeechTools.text2Int(min); 
        sec = ySpeechTools.text2Int(sec); 
        ySpeech.goto(h, min, sec, "back");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    '(go) back(ward) :h hour(s)': function(h) {//v1.0
        h = ySpeechTools.text2Int(h); 
        $('#ySpeechAction').append('Player goes back to new position');
        ySpeech.goto(h, 0, 0, "back");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    '(go) back(ward) :min minute(s)': function(min) {//v1.0
        min = ySpeechTools.text2Int(min); 
        $('#ySpeechAction').append('Player goes back to new position');
        ySpeech.goto(0, min, 0, "back");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    '(go) back(ward) :sec second(s)': function(sec) {//v1.0
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player goes back to new position');
        ySpeech.goto(0, 0, sec, "back");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    '(go) back(ward) :sec second(s)': function(sec) {//v1.0
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player goes back to new position');
        ySpeech.goto(0, 0, sec, "back");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    '(go) back(ward) :h hour(s) :min minute(s)': function(h, min) {//v1.0
        h = ySpeechTools.text2Int(h); 
        min = ySpeechTools.text2Int(min); 
        $('#ySpeechAction').append('Player goes back to new position');
        ySpeech.goto(h, min, 0, "back");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    '(go) back(ward) :h hour(s) :sec second(s)': function(h, sec) {//v1.0
        h = ySpeechTools.text2Int(h); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player goes back to new position');
        ySpeech.goto(h, 0, sec, "back");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    
    '(go) back(ward) :min minute(s) :sec second(s)': function(min, sec) {//v1.0
        min = ySpeechTools.text2Int(min); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player goes back to new position');
        ySpeech.goto(0, min, sec, "back");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
     
    'go to :h hour(s) :min minute(s) :sec second(s)': function(h, min, sec) {//v1.0
        h = ySpeechTools.text2Int(h); 
        min = ySpeechTools.text2Int(min); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player goes to new position');
        ySpeech.goto(h, min, sec, "pos");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'go to :h hour(s)': function(h) {//v1.0
        h = ySpeechTools.text2Int(h); 
        $('#ySpeechAction').append('Player goes to new position');
        ySpeech.goto(h, 0, 0, "pos");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'go to :min minute(s)': function(min) {//v1.0
        min = ySpeechTools.text2Int(min); 
        $('#ySpeechAction').append('Player goes to new position');
        ySpeech.goto(0, min, 0, "pos");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'go to :sec second(s)': function(sec) {//v1.0
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player goes to new position');
        ySpeech.goto(0, 0, sec, "pos");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'go to :h hour(s) :min minute(s)': function(h, min) {//v1.0
        h = ySpeechTools.text2Int(h); 
        min = ySpeechTools.text2Int(min); 
        $('#ySpeechAction').append('Player goes to new position');
        ySpeech.goto(h, min, 0, "pos");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'go to :h hour(s) :sec second(s)': function(h, sec) {//v1.0
        h = ySpeechTools.text2Int(h); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player goes to new position');
        ySpeech.goto(h, 0, sec, "pos");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },
    'go to :min minute(s) :sec second(s)': function(min, sec) {//v1.0
        min = ySpeechTools.text2Int(min); 
        sec = ySpeechTools.text2Int(sec); 
        $('#ySpeechAction').append('Player goes to new position');
        ySpeech.goto(0, min, sec, "pos");
        ySpeech.helpSection = "ySpeech_GoTo"; 
    },  
    
    /********************************************
     * player remote control (speechHelpRemote) *
     ********************************************/    
    
    '(player) (toggle) last (playing) (media)': function() {//v1.0
        $('#ySpeechAction').append('Media toggles to last playing item');
        yRemote.startLastPlayingFile();
        ySpeech.helpSection = "ySpeech_Remote"; 
    },
    '(player) (toggle) (most) recent(ly) (playing) (media)': function() {//v1.0
        $('#ySpeechAction').append('Media toggles to last playing item');
        yRemote.startLastPlayingFile();
        ySpeech.helpSection = "ySpeech_Remote"; 
    },
    
    ':playPause': {//v1.0
        'regexp': /^(play|pause|wait|resume|hang on|hang|continue|hold on|hold)$/, 'callback': function() {
            $('#ySpeechAction').append("Media toggles play and pause");
            yRemote.playercontrol("Player.PlayPause");
            ySpeech.helpSection = "ySpeech_Remote"; 
        }
    },
    
    '(player) stop': function() {//v1.0
        $('#ySpeechAction').append('Media stops playing');
        yRemote.playercontrol("Player.stop");
        ySpeech.helpSection = "ySpeech_Remote"; 
    },
    
    '(play) (player) next': function() {//v1.0
        $('#ySpeechAction').append('Player goes to next item');
        yRemote.playergoto("next");
        ySpeech.helpSection = "ySpeech_Remote"; 
    },
    
    ':restartSong': {//v1.0
        'regexp': /^(restart|beginning|start over)$/, 'callback': function() {
            $('#ySpeechAction').append('Player goes to previous item in playlist');
            yRemote.playergoto("previous");
            ySpeech.helpSection = "ySpeech_Remote"; 
        }
    },
    
    '(play) (player) previous': function() {//v1.0
        $('#ySpeechAction').append('Player goes to previous item');
        //send 2 times, so that the last item starts, not the same from beginning
        //the second time after 1 second, otherwise it won't be recognised
        yRemote.playergoto("previous");        
        setTimeout(function(){yRemote.playergoto("previous");}, 100);
        ySpeech.helpSection = "ySpeech_Remote"; 
    },    
    
    '(player) repeat (next)': function() {//v1.0
        $('#ySpeechAction').append('player sets next repeat mode');
        yRemote.setRepeat.next();
        ySpeech.helpSection = "ySpeech_Remote"; 
    },
    '(player) repeat off': function() {//v1.0
        $('#ySpeechAction').append('player turns off repeat mode');
        yRemote.setRepeat.off();
        ySpeech.helpSection = "ySpeech_Remote"; 
    },
    '(player) repeat of': function() {//v1.0
        $('#ySpeechAction').append('player turns off repeat mode');
        yRemote.setRepeat.off();
        ySpeech.helpSection = "ySpeech_Remote"; 
    },
    '(player) repeat one': function() {//v1.0
        $('#ySpeechAction').append('player sets repeat mode to one item');
        yRemote.setRepeat.one();
        ySpeech.helpSection = "ySpeech_Remote"; 
    },
    '(player) repeat all': function() {//v1.0
        $('#ySpeechAction').append('player sets repeat mode to all in playlist');
        yRemote.setRepeat.all();
        ySpeech.helpSection = "ySpeech_Remote"; 
    },
    
    '(player) (toggle) shuffle': function() {//v1.0
        $('#ySpeechAction').append('player toggles shuffle mode');
        yRemote.setShuffle();
        ySpeech.helpSection = "ySpeech_Remote"; 
    },
    
    /********************************************
     * Movies (speechHelpMovie)                 *
     ********************************************/
    
    '(play)(start) (a) (random) movie': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(false, "all", "all", "", "all",  "all", false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },   
    
    '(play)(start) (a) (random) unseen movie': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays random unseen movie ');
        ySpeech.playRandomMovie(true, "all", "all", "", "all",  "all", false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(show) details (of) (random) movie': function() {//v1.0
        $('#ySpeechAction').append('Kodi shows random movie ');
        ySpeech.showRandomMovie(false, "all", "all", "", "all",  "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    },   
    
    '(show) details (of) (random) unseen movie': function() {//v1.0
        $('#ySpeechAction').append('Kodi shows random unseen movie ');
        ySpeech.showRandomMovie(true, "all", "all", "", "all",  "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(play)(start) (a) (random) movie (with) title *movTitle': function(movTitle) {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(false, "all",  "all", movTitle, "all",  "all", false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(play)(start) (a) (random) unseen movie (with) title *movTitle': function(movTitle) {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(true, "all",  "all", movTitle, "all",  "all", false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(show) list (of) movie(s) (with) title *movTitle': function(movTitle) {//v1.0
        $('#ySpeechAction').append('Yarc shows list of movie containing in title ');
        ySpeech.listMovies(false, "all", "all", movTitle, "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(show) list (of) unseen movie(s) (with) title *movTitle': function(movTitle) {//v1.0
        $('#ySpeechAction').append('Yarc shows list of movie containing in title ');
        ySpeech.listMovies(true, "all", "all", movTitle, "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    'playlist (add) movie (with) title *movTitle': function(movTitle) {//v1.0
        $('#ySpeechAction').append('movies added to playlist containing in title ');
        ySpeech.playlistAddMovies(false, "all", "all", movTitle, "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    'playlist (add) unseen movie (with) title *movTitle': function(movTitle) {//v1.0
        $('#ySpeechAction').append('movies added to playlist containing in title ');
        ySpeech.playlistAddMovies(true, "all", "all", movTitle, "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    '(play)(start) (a) (random) movie (with) actor *actor': function(actor) {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(false, "all",  "all", "", "all",  actor, false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    '(play)(start) (a) (random) unseen movie (with) actor *actor': function(actor) {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(true, "all",  "all", "", "all",  actor, false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(show) list (of) movie(s) (with) actor *actor': function(actor) {//v1.0
        $('#ySpeechAction').append('Yarc shows list of moives with actor ');
        ySpeech.listMovies(false, "all", "all", "", "all", actor);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    '(show) list (of) unseen movie(s) (with) actor *actor': function(actor) {//v1.0
        $('#ySpeechAction').append('Yarc shows list of moives with actor ');
        ySpeech.listMovies(true, "all", "all", "", "all", actor);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    'playlist (add) movie (with) actor *actor': function(actor) {//v1.0
        $('#ySpeechAction').append('movies added to playlist with actor ');
        ySpeech.playlistAddMovies(false, "all", "all", "", "all", actor);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    'playlist (add) unseen movie (with) actor *actor': function(actor) {//v1.0
        $('#ySpeechAction').append('movies added to playlist with actor ');
        ySpeech.playlistAddMovies(true, "all", "all", "", "all", actor);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(show) details (of) (random) movie (with) actor *actor': function(actor) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of movie ');
        ySpeech.playRandomMovie(false, "all",  "all", "", "all",  actor, true);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(show) details (of) (random) unseen movie (with) actor *actor': function(actor) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of movie ');
        ySpeech.playRandomMovie(true, "all",  "all", "", "all",  actor, true);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(play)(start) (a) (random) movie (with) director *director': function(director) {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(false, "all",  "all", "", director,  "all", false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(play)(start) (a) (random) unseen movie (with) director *director': function(director) {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(true, "all",  "all", "", director,  "all", false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(show) list (of) movie(s) (with) director *director': function(director) {//v1.0
        $('#ySpeechAction').append('Yarc shows list of moives with director ');
        ySpeech.listMovies(false, "all", "all", "", director, "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(show) list (of) unseen movie(s) (with) director *director': function(director) {//v1.0
        $('#ySpeechAction').append('Yarc shows list of moives with director ');
        ySpeech.listMovies(true, "all", "all", "", director, "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    'playlist (add) movie (with) director *director': function(director) {//v1.0
        $('#ySpeechAction').append('movies added to playlist with director ');
        ySpeech.playlistAddMovies(false, "all", "all", "", director, "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    'playlist (add) unseen movie (with) director *director': function(director) {//v1.0
        $('#ySpeechAction').append('movies added to playlist with director ');
        ySpeech.playlistAddMovies(true, "all", "all", "", director, "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(show) details (of) (random) movie (with) director *director': function(director) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of movie ');
        ySpeech.playRandomMovie(false, "all",  "all", "", director,  "all", true);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(show) details (of) (random) unseen movie (with) director *director': function(director) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of movie ');
        ySpeech.playRandomMovie(true, "all",  "all", "", director,  "all", true);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
      
    '(play)(start) (a) (random) movie (with) tag *movGenre': function(movGenre) {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(false, movGenre,  "all", "", "all",  "all", false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },     
    '(play)(start) (random) unseen movie (with) tag *movGenre': function(movGenre) {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(true, movGenre,  "all", "", "all",  "all", false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(show) list (of) movie(s) (with) tag *movGenre': function(movGenre) {//v1.0
        $('#ySpeechAction').append('Yarc shows list of movie tag ');
        ySpeech.listMovies(false, movGenre, "all", "", "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    '(show) list (of) unseen movie(s) (with) tag *movGenre': function(movGenre) {//v1.0
        $('#ySpeechAction').append('Yarc shows list of movie tag ');
        ySpeech.listMovies(true, movGenre, "all", "", "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    'playlist (add) movie (with) tag *movGenre': function(movGenre) {//v1.0
        $('#ySpeechAction').append('movies added to playlist with tag ');
        ySpeech.playlistAddMovies(false, movGenre, "all", "", "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    'playlist (add) unseen movie (with) tag *movGenre': function(movGenre) {//v1.0
        $('#ySpeechAction').append('movies added to playlist with tag ');
        ySpeech.playlistAddMovies(true, movGenre, "all", "", "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(show) details (of) (random) movie (with) tag *movGenre': function(movGenre) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of movie ');
        ySpeech.playRandomMovie(false, movGenre,  "all", "", "all",  "all", true);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    '(show) details (of) (random) unseen movie (with) tag *movGenre': function(movGenre) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of movie ');
        ySpeech.playRandomMovie(true, movGenre,  "all", "", "all",  "all", true);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(play)(start) (a) (random) movie (with) language *movLang': function(movLang) {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(false, "all",  movLang, "", "all",  "all", false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(play)(start) (a) (random) unseen movie (with) language *movLang': function(movLang) {//v1.0
        $('#ySpeechAction').append('Kodi plays random movie ');
        ySpeech.playRandomMovie(true, "all",  movLang, "", "all",  "all", false);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(show) list (of) movie(s) (with) language *movLang': function(movLang) {//v1.0
        $('#ySpeechAction').append('Yarc shows list of movie language ');
        ySpeech.listMovies(false, "all", movLang, "", "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(show) list (of) unseen movie(s) (with) language *movLang': function(movLang) {//v1.0
        $('#ySpeechAction').append('Yarc shows list of movie language ');
        ySpeech.listMovies(true, "all", movLang, "", "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    'playlist (add) movie (with) language *movLang': function(movLang) {//v1.0
        $('#ySpeechAction').append('movies added to playlist with language ');
        ySpeech.playlistAddMovies(false, "all", movLang, "", "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    'playlist (add) unseen movie (with) language *movLang': function(movLang) {//v1.0
        $('#ySpeechAction').append('movies added to playlist with language ');
        ySpeech.playlistAddMovies(true, "all", movLang, "", "all", "all");
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    '(show) details (of) (random) movie (with) language *movLang': function(movLang) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of movie ');
        ySpeech.playRandomMovie(false, "all",  movLang, "", "all",  "all", true);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(show) details (of) (random) unseen movie (with) language *movLang': function(movLang) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of movie ');
        ySpeech.playRandomMovie(true, "all",  movLang, "", "all",  "all", true);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },
    
    '(play)(start) movie trailer (of) *movName': function(movName) {//v1.0
        $('#ySpeechAction').append('Kodi plays Moive trailer of ');
        ySpeech.singleMovie("trailer", movName);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(play)(start) movie *movName': function(movName) {//v1.0
        $('#ySpeechAction').append('Kodi plays Moive ');
        ySpeech.singleMovie("play", movName);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    '(show) details (of) movie *movName': function(movName) {//v1.0
        $('#ySpeechAction').append('Yarc shows Moive details of ');
        ySpeech.singleMovie("show", movName);
        ySpeech.helpSection = "ySpeech_Movie"; 
    },  
    
    'playlist (add) movie *movName': function(movName) {//v1.0
        $('#ySpeechAction').append('added to playlist movie ');
        ySpeech.singleMovie("pl", movName);
        ySpeech.helpSection = "ySpeech_Movie"; 
    }, 
    
    /******************************
     * PVR - TV (speechHelpPVR)   *
     ******************************/
      
    //TODO
    //television (play|start) seinfeld of channel bbc
        //suche demerau seinfeld, suche demerauch bbc, nur solche die liefen (und unseen)
    //television (play|start) latest seinfeld of channel bbc
        //suche demerau seinfeld, suche demerauch bbc, nur solche die liefen (und unseen)
    //television (play|start) tag comedy
        //suche tag comedy nur solche die liefen (und unseen)
    
    '(open) Television (search) (with) tag *title': function(title) {//v1.0
        $('#ySpeechAction').append('Yarc opens television search genre ');
        ySpeech.pvrTelevisionSearch("tag", title); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    'list Television (search) (with) tag *title': function(title) {//v1.0
        $('#ySpeechAction').append('Yarc opens television search genre ');
        ySpeech.pvrTelevisionSearch("tag", title); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    
    '(open) Television search (with) (title) *title': function(title) {//v1.0
        $('#ySpeechAction').append('Yarc opens television search title ' + title);
        ySpeech.pvrTelevisionSearch("title", title); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    },     
    'list Television search (with) (title) *title': function(title) {//v1.0
        $('#ySpeechAction').append('Yarc opens television search title ' + title);
        ySpeech.pvrTelevisionSearch("title", title); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    
    'list Television channel *channel': function(channel) {//v1.0
        channel = ySpeechTools.text2Int(channel); 
        $('#ySpeechAction').append('Yarc Lists TV channel ');
        ySpeech.detailsPvrChannel("TV", channel);      
        $.mobile.navigate("#pvr-channel");  
        ySpeech.helpSection = "ySpeech_PVRTV";
    }, 
    
    '(play)(start) (a) (random) Television recording': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrRandomTelevisionRecoring(false, "all");        
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    
    '(play)(start) (a) (random) unseen Television recording': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrRandomTelevisionRecoring(true, "all");        
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    
    '(play)(start) (a) (random) Television recording (with) tag *itemTag': function(itemTag) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrRandomTelevisionRecoring(false, "tag", itemTag);        
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
   
    '(play)(start) (a) (random) unseen Television recording (with) tag *itemTag': function(itemTag) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrRandomTelevisionRecoring(true, "tag", itemTag);        
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    },  
    
    '(play)(start) (a) (random) Television recording channel *itemChannel': function(itemChannel) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrRandomTelevisionRecoring(false, "channel", itemChannel);        
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    
    '(play)(start) (a) (random) unseen Television recording channel *itemChannel': function(itemChannel) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrRandomTelevisionRecoring(true, "channel", itemChannel);        
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    
    '(play)(start) (a) (random) Television recording (title) (of) *itemTitle': function(itemTitle) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrRandomTelevisionRecoring(false, "title", itemTitle);        
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    
    '(play)(start) (a) (random) unseen Television recording (title) (of) *itemTitle': function(itemTitle) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrRandomTelevisionRecoring(true, "title", itemTitle);        
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    
    'details (of) Television channel *channel': function(channel) {//v1.0
        channel = ySpeechTools.text2Int(channel); 
        $('#ySpeechAction').append('Yarc Lists TV channel ');
        ySpeech.detailsPvrChannel("TV", channel);
        $.mobile.navigate("#pvr-channel");  
        ySpeech.helpSection = "ySpeech_PVRTV";  
    }, 
     
    '(play)(start)(switch) Television channel (to) *channel': function(channel) {//v1.0
        channel = ySpeechTools.text2Int(channel);
        $('#ySpeechAction').append('Kodi plays TV channel ');
        ySpeech.switchPvrChannel("TV", channel);        
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
     
    '(play)(start)(switch) (to) (a) random Television channel': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays TV channel ');
        ySpeech.pvrChannelRandom("TV");
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
        
    '(play)(start) next Television recording (of) *itemTitle': function(itemTitle) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV next recording of ');
        ySpeech.pvrNextOrLatestTelevisionRecoringName("next", itemTitle);               
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
      
    '(play)(start) latest Television recording': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrOldestOrLatestTelevisionRecoring("latest"); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    
    '(play)(start) latest Television recording (of) *itemName': function(itemTitle) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV latest recording of ');
        ySpeech.pvrNextOrLatestTelevisionRecoringName("latest", itemTitle); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    },   
    
    '(play)(start) oldest Television recording': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrOldestOrLatestTelevisionRecoring("oldest"); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    '(play)(start) first Television recording': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrOldestOrLatestTelevisionRecoring("oldest"); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    '(play)(start) earliest Television recording': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays TV oldest ');
        ySpeech.pvrOldestOrLatestTelevisionRecoring("latest");   
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    '(play)(start) foremost Television recording': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrOldestOrLatestTelevisionRecoring("oldest");     
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    
    '(play)(start) oldest Television recording (of) *itemName': function(itemTitle) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrNextOrLatestTelevisionRecoringName("oldest", itemTitle); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    '(play)(start) first Television recording (of) *itemName': function(itemTitle) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrNextOrLatestTelevisionRecoringName("oldest", itemTitle); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    '(play)(start) earliest Television recording (of) *itemName': function(itemTitle) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrNextOrLatestTelevisionRecoringName("oldest", itemTitle); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 
    '(play)(start) foremost Television recording (of) *itemName': function(itemTitle) {//v1.0
        $('#ySpeechAction').append('Kodi plays TV recording ');
        ySpeech.pvrNextOrLatestTelevisionRecoringName("oldest", itemTitle); 
        ySpeech.helpSection = "ySpeech_PVRTV"; 
    }, 

    /*******************************
     * PVR - Radio (speechHelpPVR) *
     *******************************/
     
    'list Radio (channel) *channel': function(channel) {//v1.0
        channel = ySpeechTools.text2Int(channel); 
        $('#ySpeechAction').append('Yarc Lists Radio channel ');
        ySpeech.detailsPvrChannel("Radio", channel);      
        $.mobile.navigate("#pvr-channel");  
        ySpeech.helpSection = "ySpeech_PVRRadio";  
    }, 
    'details (of) Radio (channel) *channel': function(channel) {//v1.0
        channel = ySpeechTools.text2Int(channel); 
        $('#ySpeechAction').append('Yarc Lists Radio channel ');
        ySpeech.detailsPvrChannel("Radio", channel);      
        $.mobile.navigate("#pvr-channel");  
        ySpeech.helpSection = "ySpeech_PVRRadio";  
    }, 
     
    '(play)(start)(switch) Radio (channel) (to) *channel': function(channel) {//v1.0
        channel = ySpeechTools.text2Int(channel); 
        $('#ySpeechAction').append('Kodi plays Radio channel ');
        ySpeech.switchPvrChannel("Radio", channel);        
        ySpeech.helpSection = "ySpeech_PVRRadio"; 
    }, 
     
    '(play)(start)(switch to) (a) random Radio (channel)': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays Radio channel ');
        ySpeech.pvrChannelRandom("Radio");        
        ySpeech.helpSection = "ySpeech_PVRRadio"; 
    },    
    
    /***************************
     * Music (speechHelpMusic) *
     ***************************/
    
    '(play)(start) (random) music': function() {//v1.0
        $('#ySpeechAction').append('Kodi plays radom music album');
        yMusic.playMusicFiltered("");        
        ySpeech.helpSection = "ySpeech_Music"; 
    },  
    
    '(play)(start) (random) music tag *genre': function(genre) {//v1.0
        $('#ySpeechAction').append('Kodi plays music genre ');
        ySpeech.playMusicFilteredGenre(genre);        
        ySpeech.helpSection = "ySpeech_Music"; 
    }, 
    
    '(play)(start) (a) (random) (music) artist *artist': function(artist) {//v1.0
        $('#ySpeechAction').append('Kodi plays artist ');
        ySpeech.playMusicFilteredArtist(artist);   
        ySpeech.helpSection = "ySpeech_Music"; 
    }, 
    
    '(play)(start) (a) (random) (music) album tag *genre': function(genre) {//v1.0
        $('#ySpeechAction').append('Kodi plays album ');
        ySpeech.playMusicFilteredAlbums("genre", genre);    
        ySpeech.helpSection = "ySpeech_Music"; 
    },  
        
    '(play)(start) (music) album *album': function(album) {//v1.0
        $('#ySpeechAction').append('Kodi plays album ');
        ySpeech.playMusicAlbums(album);        
        ySpeech.helpSection = "ySpeech_Music"; 
    }, 
    
    'list music tag *genre': function(genre) {//v1.0
        $('#ySpeechAction').append('Yarc lists albums of genre ');        
        ySpeech.listMusicAlbumsGenre(genre);       
        ySpeech.helpSection = "ySpeech_Music"; 
    },   
    
   /*TODO  for future version with revised music sections
    
    'list (music) artist *artist': function(artist) {
        $('#ySpeechAction').append('Yarc lists albums of artist ');       
        ySpeech.listMusicAlbumsArtist(artist);  
        ySpeech.helpSection = "ySpeech_Music"; 
    },    
    
    '(play)(start) (a) (random) (music) album artist *artist': function(artist) {
        $('#ySpeechAction').append('Kodi plays album ');
//         ySpeech.pvrChannelRandom("Radio");        
        ySpeech.helpSection = "ySpeech_Music"; 
    }, 
    
    'list (music) album *album': function(album) {
        $('#ySpeechAction').append('Yarc lists album ');
//         ySpeech.pvrChannelRandom("Radio");        
        ySpeech.helpSection = "ySpeech_Music"; 
    }, 
    
    'details (of) (music) album *album': function(album) {
        $('#ySpeechAction').append('Yarc shows details of album ');
//         ySpeech.pvrChannelRandom("Radio");        
        ySpeech.helpSection = "ySpeech_Music"; 
    },  
    
    '(play)(start) song *song': function(song) {
        $('#ySpeechAction').append('Kodi plays song ');
//         ySpeech.pvrChannelRandom("Radio");        
        ySpeech.helpSection = "ySpeech_Music"; 
    }, 
    
    'search single (with) (title) *song': function(song) {
        $('#ySpeechAction').append('Yarc lits song with title ');
//         ySpeech.pvrChannelRandom("Radio");        
        ySpeech.helpSection = "ySpeech_Music"; 
    }, 
    'list single(s) (with) (title) *song': function(song) {
        $('#ySpeechAction').append('Yarc lits song with title ');
//         ySpeech.pvrChannelRandom("Radio");        
        ySpeech.helpSection = "ySpeech_Music"; 
    },  
    */
   
    /*********************
     * Sent text to Kodi *
     *********************/
    'send (text) (to Kodi) *sendText': function(sendText) {//v1.0
        $('#ySpeechAction').append('Sent text "' + sendText + '" to Kodi');
        yRemote.sendTextButton(sendText);
        ySpeech.helpSection = "ySpeech_SendText";
    },
     
    /*************************************
     * Set volume (speechHelpSendVolume) *
     *************************************/
    //Decribe no RTL
    
    ':muteUnmute': {//v1.0
        'regexp': /^(mute|unmute|volume on|volume off|volume of|volume toggle|toggle volume|silence|shut up)$/, 'callback': function() {
            $('#ySpeechAction').append("Player toggles volume on and off");
            yRemote.setVolume("Application.SetMute", null);
            ySpeech.helpSection = "ySpeech_SetVolume"; 
        }
    },
    
    '(set) volume up': function() {//v1.0
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume("", "up");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    '(set) volume plus': function() {//v1.0
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume("", "up");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    '(set) volume increase': function() {//v1.0
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume("", "up");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },    
    
    '(set) volume up (*percentage)': function(percentage) {//v1.0
            percentage = ySpeechTools.text2Int(percentage); 
            percentage = percentage.replace(/\D/g,'');
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume(percentage, "up");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    '(set) volume plus (*percentage)': function(percentage) {//v1.0
            percentage = ySpeechTools.text2Int(percentage); 
            percentage = percentage.replace(/\D/g,''); 
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume(percentage, "up");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    '(set) volume increase (*percentage)': function(percentage) {//v1.0
            percentage = ySpeechTools.text2Int(percentage); 
            percentage = percentage.replace(/\D/g,''); 
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume(percentage, "up");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    
    '(set) volume down': function() {//v1.0
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume("", "down");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    '(set) volume minus': function() {//v1.0
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume("", "down");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    '(set) volume decrease': function() {//v1.0
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume("", "down");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    
    '(set) volume down (*percentage)': function(percentage) {//v1.0
            percentage = ySpeechTools.text2Int(percentage); 
            percentage = percentage.replace(/\D/g,''); 
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume(percentage, "down");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    '(set) volume minus (*percentage)': function(percentage) {//v1.0
            percentage = ySpeechTools.text2Int(percentage); 
            percentage = percentage.replace(/\D/g,''); 
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume(percentage, "down");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    '(set) volume decrease (*percentage)': function(percentage) {//v1.0
            percentage = ySpeechTools.text2Int(percentage); 
            percentage = percentage.replace(/\D/g,''); 
            $('#ySpeechAction').append('Set volume ');
            ySpeech.volume(percentage, "down");
            ySpeech.helpSection = "ySpeech_SetVolume"; 
    },
    
    //Decribe no RTL    
    '(set) volume (to) *percentage': function(percentage) {//v1.0
        percentage = ySpeechTools.text2Int(percentage); 
        percentage = percentage.replace(/\D/g,''); 
        $('#ySpeechAction').append('Set volume ');
        ySpeech.volume(percentage, "none");
        ySpeech.helpSection = "ySpeech_SetVolume"; 
    }, 
     
    /**************************
     * yarc settings (yarc)   *
     **************************/
        
    ':hideShowSeen': {//v1.0
        'regexp': /^(toggle unseen|toggle seen|show unseen|hide unseen|show seen|show watched|hide seen|hide watched|show unwatched|hide unwatched)$/, 'callback': function() {
            $('#ySpeechAction').append("Yarc toggeld hide/show seen. Please reload page if needed.");
            yS.yS.hideWatched = !yS.yS.hideWatched;
            yS.saveSettingsToLocalStorage();
            ySpeech.helpSection = "ySpeech_yarc"; 
        }
    },   
    
    /***********************************************
     * Navigational remote control (speechHelpNav) *
     ***********************************************/
    
    ':select': {//v1.0
        'regexp': /^(ok|okay|select)$/, 'callback': function() {
            $('#ySpeechAction').append('sent input "Select"');
            yCore.simpleJsonRequest("Input.Select");
            ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
    
    '(*steps) up': function(steps) {//v1.0
        if(steps){
            steps = ySpeechTools.text2Int(steps); 
            for (i = 1; i <= steps; i++) {
                yCore.simpleJsonRequest("Input.Up");  
            }
        }
        else {
            yCore.simpleJsonRequest("Input.Up");
            steps = 1;
        }
        $('#ySpeechAction').append('sent input "Up" ' + steps +' time(s)');
        ySpeech.helpSection = "ySpeech_Nav"; 
    },

    '(*steps) down': function(steps) {//v1.0
        if(steps){
            steps = ySpeechTools.text2Int(steps); 
            for (i = 1; i <= steps; i++) {
                yCore.simpleJsonRequest("Input.Down");  
            }
        }
        else {
            yCore.simpleJsonRequest("Input.Down");
            steps = 1;
        }
        $('#ySpeechAction').append('sent input "Down" ' + steps +' time(s)');
        ySpeech.helpSection = "ySpeech_Nav"; 
    },
    
    '(*steps) left': function(steps) {//v1.0
        if(steps){            
            steps = ySpeechTools.text2Int(steps);             
            for (i = 1; i <= steps; i++) {
                yCore.simpleJsonRequest("Input.Left"); 
            }
        }
        else {
            yCore.simpleJsonRequest("Input.Left"); 
            steps = 1;
        }
        $('#ySpeechAction').append('sent input "Left" ' + steps +' time(s)');
        ySpeech.helpSection = "ySpeech_Nav"; 
    },
    
    '(*steps) right': function(steps) {//v1.0
        if(steps){            
            steps = ySpeechTools.text2Int(steps);             
            for (i = 1; i <= steps; i++) {
                yCore.simpleJsonRequest("Input.Right"); 
            }
        }
        else {
            yCore.simpleJsonRequest("Input.Right"); 
            steps = 1;
        }
        $('#ySpeechAction').append('sent input "Right" ' + steps +' time(s)');
        ySpeech.helpSection = "ySpeech_Nav"; 
    },
    
    ':back': {//v1.0
        'regexp': /^(back|Beck|exit)$/, 'callback': function() {
            $('#ySpeechAction').append('sent input "Back"');
            yCore.simpleJsonRequest("Input.Back"); 
            ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
    'context (menu)': function() {//v1.0
        $('#ySpeechAction').append('sent input "Context Menu"');
        yCore.simpleJsonRequest("Input.ContextMenu"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
    },
    'menu': function() {//v1.0
        $('#ySpeechAction').append('sent input "Context Menu"');
        yCore.simpleJsonRequest("Input.ContextMenu"); 
        ySpeech.helpSection = "ySpeech_Nav"; 
    },
    
    ':toggleOSD': {//v1.0
        'regexp': /^(show OSD|show on screen display|hide OSD|hide on screen display|OSD on|OSD off|OSD of|on screen display on|on screen display off|on screen display of)$/, 'callback': function() {
            $('#ySpeechAction').append('Kodi toggles OSD');
            yCore.simpleJsonRequest("Input.ShowOSD");
            ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
    ':toggleInfo': {//v1.0
        'regexp': /^(show info|show information|hide info|hide information|info on|info off|info of|information on|information off|information of)$/, 'callback': function() {
            $('#ySpeechAction').append('Kodi toggles media information');
            yCore.simpleJsonRequest("Input.Info");
            ySpeech.helpSection = "ySpeech_Nav"; 
        }
    },
    
    '(kodi) home': function() {//v1.0
        $('#ySpeechAction').append('Open homescreen on Kodi');
        yCore.simpleJsonRequest("Input.Home");
        ySpeech.helpSection = "ySpeech_Nav"; 
    },
    
    ':fullScreen': {//v1.0
        'regexp': /^(toggle full screen|full screen|full screen on|full screen off|full screen of|toggle fullscreen|fullscreen|fullscreen on|fullscreen off|fullscreen of)$/, 'callback': function() {
        $('#ySpeechAction').append('Toggles full screen on Kodi');
        yRemote.toggleFullscreen();
        ySpeech.helpSection = "ySpeech_Nav"; 
        }
    }, 
    
    /********************************************
     * TV - Shows (speechHelpTVShow)            *
     ********************************************/
    
    '(play)(start) (TV show) (episode) Season :SeasonNr Episode :EpisodeNr (of) *showName': function(SeasonNr, EpisodeNr, showName) {//v1.0
        $('#ySpeechAction').append('Kodi plays ');
        SeasonNr = ySpeechTools.text2Int(SeasonNr);
        EpisodeNr = ySpeechTools.text2Int(EpisodeNr); 
        ySpeech.specificTVShowEpisode(EpisodeNr, SeasonNr, showName, "play");         
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },
    
    '(show) details (of) (a) (TV show) (episode) Season :SeasonNr Episode :EpisodeNr (of) *showName': function(SeasonNr, EpisodeNr, showName) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of ');
        SeasonNr = ySpeechTools.text2Int(SeasonNr);
        EpisodeNr = ySpeechTools.text2Int(EpisodeNr); 
        ySpeech.specificTVShowEpisode(EpisodeNr, SeasonNr, showName, "show");         
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    'playlist (add) (TV show) (episode) Season :SeasonNr Episode :EpisodeNr (of) *showName': function(SeasonNr, EpisodeNr, showName) {//v1.0
        $('#ySpeechAction').append('Kodi adds to playlist ');
        SeasonNr = ySpeechTools.text2Int(SeasonNr);
        EpisodeNr = ySpeechTools.text2Int(EpisodeNr); 
        ySpeech.specificTVShowEpisode(EpisodeNr, SeasonNr, showName, "playlist");         
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    '(play)(start) (a) (random) (TV show) (episode) (of) Season :SeasonNr (of) *showName': function(SeasonNr, showName) {//v1.0
        SeasonNr = ySpeechTools.text2Int(SeasonNr); 
        $('#ySpeechAction').append('Kodi plays ');
        ySpeech.randomTVShowEpisode(SeasonNr, showName, false, "play");
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    '(show) details (of) (a) (random) (TV show) (episode) (of) Season :SeasonNr (of) *showName': function(SeasonNr, showName) {//v1.0
        SeasonNr = ySpeechTools.text2Int(SeasonNr); 
        $('#ySpeechAction').append('Yarc shows details of ');
        ySpeech.randomTVShowEpisode(SeasonNr, showName, false, "show");
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },     
    
    'playlist (add) (a) (random) (TV show) (episode) (of) Season :SeasonNr (of) *showName': function(SeasonNr, showName) {//v1.0
        SeasonNr = ySpeechTools.text2Int(SeasonNr); 
        $('#ySpeechAction').append('Kodi adds to playlist ');
        ySpeech.randomTVShowEpisode(SeasonNr, showName, false, "playlist");
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    '(play)(start) (a) (random) unseen (TV show) (episode) (of) Season :SeasonNr (of) *showName': function(SeasonNr, showName) {//v1.0
        SeasonNr = ySpeechTools.text2Int(SeasonNr); 
        $('#ySpeechAction').append('Kodi plays ');
        ySpeech.randomTVShowEpisode(SeasonNr, showName, true, "play");        
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    '(show) details (of) (a) (random) unseen (TV show) (episode) (of) Season :SeasonNr (of) *showName': function(SeasonNr, showName) {//v1.0
        SeasonNr = ySpeechTools.text2Int(SeasonNr); 
        $('#ySpeechAction').append('Yarc shows details of ');
        ySpeech.randomTVShowEpisode(SeasonNr, showName, true, "show");        
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    'playlist (add) (a) (random) unseen (TV show) (episode) (of) Season :SeasonNr (of) *showName': function(SeasonNr, showName) {//v1.0
        SeasonNr = ySpeechTools.text2Int(SeasonNr); 
        $('#ySpeechAction').append('Kodi adds to playlist ');
        ySpeech.randomTVShowEpisode(SeasonNr, showName, true, "playlist");        
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    '(play)(start) (a) (random) (episode) (of) TV show (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi plays ');
        ySpeech.randomTVShowEpisode("", showName, false, "play");           
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },    
    '(play)(start) (a) (random) episode (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi plays ');
        ySpeech.randomTVShowEpisode("", showName, false, "play");           
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    '(show) details (of) (a) (random) (episode) (of) TV show (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of ');
        ySpeech.randomTVShowEpisode("", showName, false, "show");           
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },    
    '(show) details (of) (a) (random) episode (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of ');
        ySpeech.randomTVShowEpisode("", showName, false, "show");           
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    'playlist (add) (a) (random) (episode) (of) TV show (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi adds to playlist ');
        ySpeech.randomTVShowEpisode("", showName, false, "playlist");           
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },    
    'playlist (add) (a) (random) episode (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi adds to playlist ');
        ySpeech.randomTVShowEpisode("", showName, false, "playlist");           
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    '(play)(start) (a) (random) unseen (episode) (of) TV show (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi plays ');
        ySpeech.randomTVShowEpisode("", showName, true, "play");         
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },     
    '(play)(start) (a) (random) unseen episode (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi plays ');
        ySpeech.randomTVShowEpisode("", showName, true, "play");         
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },
    
    '(show) details (of) (a) (random) unseen (episode) (of) TV show (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of ');
        ySpeech.randomTVShowEpisode("", showName, true, "show");         
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },     
    '(show) details (of) (a) (random) unseen episode (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of ');
        ySpeech.randomTVShowEpisode("", showName, true, "show");         
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },
    
    'playlist (add) (a) (random) unseen (episode) (of) TV show (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi adds to playlist ');
        ySpeech.randomTVShowEpisode("", showName, true, "playlist");         
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },     
    'playlist (add) (a) (random) unseen episode (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi adds to playlist ');
        ySpeech.randomTVShowEpisode("", showName, true, "playlist");         
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },
    
    'continue (episode) (of) (TV show) (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi plays ');
        ySpeech.nextTVShow(showName, "play");
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },     
    '(play)(start) next (episode) (of) (TV show) (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi plays ');
        ySpeech.nextTVShow(showName, "play");
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    '(show) details (of) next (episode) (of) (TV show) (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of ');
        ySpeech.nextTVShow(showName, "show");
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    'playlist (add) next (episode) (of) (TV show) (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi adds to playlist ');
        ySpeech.nextTVShow(showName, "playlist");
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    '(play)(start) latest (episode) (of) (TV show) (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi plays ');
        ySpeech.latestTVShow(showName, "play");   
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    '(show) details (of) latest (episode) (of) (TV show) (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Yarc shows details of ');
        ySpeech.latestTVShow(showName, "show");   
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
    
    'playlist (add) latest (episode) (of) (TV show) (episode) (of) *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Kodi adds to playlist ');
        ySpeech.latestTVShow(showName, "playlist");   
        ySpeech.helpSection = "ySpeech_TVShow"; 
    },
    
    'list (episode)(episodes) (of) (TV show) Season :SeasonNr (of) (TV show) *showName': function(SeasonNr, showName) {//v1.0
        SeasonNr = ySpeechTools.text2Int(SeasonNr); 
        $('#ySpeechAction').append('Yarc lists ');
        ySpeech.listTVShow(showName, SeasonNr); 
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }, 
     
    'list (episode)(episodes) (of) TV show *showName': function(showName) {//v1.0
        $('#ySpeechAction').append('Yarc lists ');
        ySpeech.listTVShow(showName, "");        
        ySpeech.helpSection = "ySpeech_TVShow"; 
    }
};

var ySpeechHelpTexts = {    
    
    /********************************************
     * player remote control (speechHelpRemote) *
     ********************************************/
    
    ySpeech_Remote: {
        helpSection: "ySpeech_Remote", 
        Title:"<span class='icon-th'></span> Remote", 
        Text:"<ul>"
            + "<li>To play or pause the player say eighter: [play|<span style='color:#FFA500;'>pause</span>|wait|resume|hang (on)|continue|hold (on)]</li>"
            + "<li>To stop player say: (player) <span style='color:#FFA500;'>stop</span></li>"
            + "<li>To start playing madia over say: [<span style='color:#FFA500;'>restart</span>|beginning|start over]</li>"
                + "<ul><li>beginning</li></ul>"
            + "<li>To change repeat mode in playlist say: (player) <span style='color:#FFA500;'>repeate</span> (next|one|all|off)</li>"
                + "<ul><li>repeate</li><li>repeate next</li><li>repeate all</li></ul>"
            + "<li>To change shuffle mode in playlist say: (player) (toggle) <span style='color:#FFA500;'>shuffle</span></li>"
                + "<ul><li>shuffle</li></ul>"
            + "<li>To go to the next element in the playlist say: (play) (player) <span style='color:#FFA500;'>next</span></li>"
            + "<li>To go to the previous element in the playlist say: (play) (player) <span style='color:#FFA500;'>previous</span></li>"
            + '<li>To toggle between current and most recent playing media: "(player) (toggle) <span style="color:#FFA500;">last</span> (playing) (media)" or "(player) (toggle) (most) recent(ly) (playing) (media)"</li>'
            + "</ul>"
    },
    
    /*****************
     * Navigational  *
     *****************/  
    
    ySpeech_Nav: {
        helpSection: "ySpeech_Nav",  
        Title:"<span class='icon-caret-left'></span> <span class='icon-caret-right'></span> Navigate", 
        Text:"<ul>"
            + "<li>To send select to Kodi say eighter: [<span style='color:#FFA500;'>ok</span>|okay|select]</li>"
            + "<li>To go back in menu say eighter: [<span style='color:#FFA500;'>back</span>|exit]</span></li>"
            + "<li>To open the context menu on Kodi say: [context (menu)|<span style='color:#FFA500;'>menu</span>]</li>"
                + "<ul><li>context menu</li><li>context</li><li>menu</li></ul>"
            + "<li>To navigate in the menu one item say eighter: [<span style='color:#FFA500;'>up</span>|down|left|right]</li>"
                + "<ul><li>left</li></ul>"
            + "<li>To navigate in the menu multiple items say eighter: <span style='color:#FFA500;'><i>X</i></span> [up|<span style='color:#FFA500;'>down</span>|left|right]</li>"
                + "<ul><li>42 down</li></ul>"
            + "<li>To toggle the On Screen Display (Menu with play/paus etc.) say eighter: "
                + "[<span style='color:#FFA500;'>show OSD</span>|show on screen display|hide OSD|hide on screen display|OSD on|OSD off|on screen display on|on screen display off]</li>"
            + "<li>To toggle the playing media Info Screen say eighter: [<span style='color:#FFA500;'>show info</span>|show information|hide info|hide information|info on|info off|information on|information off]</li>"
                + "<ul><li>hide info</li></ul>"
            + "<li>To toggle the full screen on Kodi say eighter: [toggle full screen|<span style='color:#FFA500;'>full screen</span>|full screen on|full screen off]</li>"
            + "<li>To go to the home screen of Kodi say: (kodi) home</li>"
            + "<li>To go to New & Top in Yarc: ([navigate|list|open]) (to) [<span style='color:#FFA500;'>Start</span>|New and Top]</li>"
                + "<ul><li>New and Top</li></ul>"
            + "<li>To go to Movies in Yarc: [navigate|<span style='color:#FFA500;'>list</span>|open] (to) <span style='color:#FFA500;'>movie</span>(s)</li>"
                + "<ul><li>Navigate to movie</li></ul>"
            + "<li>To go to TV-Shows in Yarc: ([navigate|list|open]) (to) TV-show(s)</li>"
                + "<ul><li>list TV-Shows</li></ul>"
            + "<li>To go to Music/Albunms in Yarc: [navigate|<span style='color:#FFA500;'>list</span>|open] (to) [<span style='color:#FFA500;'>music</span>|album(s)|music album(s)]</li>"
                + "<ul><li>open music albums</li></ul>"
            + "<li>To go to TV Channels in Yarc: ([navigate|list|open]) (to) <span style='color:#FFA500;'>television channel</span>(s)</li>"
                + "<ul><li>televison channels</li></ul>"
            + "<li>To go to TV Recordings in Yarc: ([navigate|list|open]) (to) <span style='color:#FFA500;'>television recording</span>(s)</li>"
                + "<ul><li>televison channels</li></ul>"
            + "<li>To go to TV Search in Yarc: ([navigate|list|open]) (to) <span style='color:#FFA500;'>television search</span>(s)</li>"
                + "<ul><li>televison channels</li></ul>"
            + "<li>To go to TV Program in Yarc: ([navigate|list|open]) (to) <span style='color:#FFA500;'>television program</span></li>"
            + "<li>To go to Radio Channels in Yarc: ([navigate|list|open]) (to) <span style='color:#FFA500;'>radio</span> (channel(s))</li>"
            + "<li>To go to Addons in Yarc: ([navigate|list|open]) (to) <span style='color:#FFA500;'>addon</span>(s)</li>"
            + "<li>To go to Kodi Favorites in Yarc: ([navigate|list|open]) (to) (Kodi) <span style='color:#FFA500;'>favorite</span>(s)</li>"
            + "<li>To go to Playlist in Yarc: ([navigate|list|open]) (to) <span style='color:#FFA500;'>playlist</span>(s)</li>"
            + "<li>To go to Tools in Yarc: ([navigate|list|open]) (to) <span style='color:#FFA500;'>tool</span>(s)</li>"
            + "</ul>"
    },
    
    /*********************************
     * go to specific time in media  *
     *********************************/
    
    ySpeech_GoTo: {
        helpSection: "ySpeech_GoTo",  
        Title:"<span class='icon-chevron-left'></span><span class='icon-search'></span><span class='icon-chevron-right'></span> Goto specific time in a playing Media", 
        Text:"<ul>"
            + "<li>To skip an amount of time say: [<span style='color:#FFA500;'>skip</span>|foward] [<i># hour(s)</i>] [<i># minute(s)</i>] [<span style='color:#FFA500;'><i># second(s)</i></span>]</li>"
                + "<ul><li>skip 4 minutes 2 seconds</li></ul>"
            + "<li>To go back an amount of time say: [go] <span style='color:#FFA500;'>back</span>(ward) [<i># hour(s)</i>] [<i># minute(s)</i>] [<span style='color:#FFA500;'><i># second(s)</i></span>]</li>"
                + "<ul><li>back 42 seconds</li></ul>"
            + "<li>To go to a specific position say: <span style='color:#FFA500;'>go to</span> [<i># hour(s)</i>] [<i># minute(s)</i>] [<span style='color:#FFA500;'><i># second(s)</i></span>]</li>"
                + "<ul><li>go to 1 hour 5 minutes 3 seconds</li></ul>"
            + "</ul>"
    },
    
    /*************************************
     * Set volume (speechHelpSendVolume) *
     *************************************/
    
    ySpeech_SetVolume: {
        helpSection: "ySpeech_SetVolume",  
        Title: "<span class='icon-volume-up'></span></button> Volume", 
        Text: "<ul>"
            + "<li>To toggle volume on/off say: [<span style='color:#FFA500;'>mute</span>|unmute|volume on|volume off|volume toggle|toggle volume|silence|shut up]</li>"
                + "<ul><li>toggle volume</li></ul>"
            + "<li>Volume up by 10%: (set) <span style='color:#FFA500;'>volume</span> [<span style='color:#FFA500;'>up</span>|plus|increase]</li>"
                + "<ul><li>volume up</li></ul>"
            + "<li>Volume up by a % amount: (set) <span style='color:#FFA500;'>volume</span> [<span style='color:#FFA500;'>up</span>|plus|increase] <i><span style='color:#FFA500;'>X</span>(%)</i></li>"
                + "<ul><li>set volume plus 30%</li><li>volume increase 45</li></ul>"
            + "<li>Volume down by 10%: (set) <span style='color:#FFA500;'>volume</span> [<span style='color:#FFA500;'>down</span>|minus|decrease]</li>"
                + "<ul><li>volume decrease</li></ul>"
            + "<li>Volume down by a % amount: (set) <span style='color:#FFA500;'>volume</span> [<span style='color:#FFA500;'>down</span>|minus|decrease] <i><span style='color:#FFA500;'>X</span>(%)</i></li>"
                + "<ul><li>set volume minus 30%</li><li>set volume down 45%</li></ul>"
            + "<li>To set volume to a specific % amount: (set) <span style='color:#FFA500;'>volume</span> (to) <i><span style='color:#FFA500;'>X</span>(%)</i></li>"
                + "<ul><li>volume 42</li><li>set volume to 42%</li></ul>"
            + "</ul>"
    },
    
    /*********************
     * Sent text to Kodi *
     *********************/
    
    ySpeech_SendText: {
        helpSection: "ySpeech_SendText",  
        Title:"Send Text to Kodi", 
        Text: "<ul>"
            + "<li>To send some text to an active input field in Kodi say: <span style='color:#FFA500;'>send</span> (text) (to Kodi) <span style='color:#FFA500;'><i>Some Text you say</i></span></li>"
            + "<ul><li>send Big Buck Bunny</li><li>send to Kodi Big Buck Bunny</li></ul>"
            + "</ul>"
    },
    
    /**********************************
     * Switch languages               *
     **********************************/
    
    ySpeech_Language: {
        helpSection: "ySpeech_Language",  
        Title:"<span class='icon-bubbles2'></span> Switch language in a playing file",
        Text: "<ul>"
            + "<li>To switch a language in a playing file say: (set) (switch) <span style='color:#FFA500;'>language</span>(s) (to) <span style='color:#FFA500;'><i>desired language</i></span><br /><u>(This works only with english words for accodring language)</u></li>"
                + "<ul><li>language English</li><li>set language to English</li><li>switch language English</li></ul>"
            + "<li>You can also use the indicated indexnumber form the list to switch to a specific language: (set) (switch) <span style='color:#FFA500;'>language</span>(s) (to) <span style='color:#FFA500;'><i>desired language-index-number</i></span></li>"
                + "<ul><li>switch language 5</li></ul>"
            + "<li>To get a list of aviable languages say: <span style='color:#FFA500;'>list language</span>(s)</i></li>"
                + "<ul><li>list language</li></ul>"
            + "<li>To switch to the next or previous langauge use: [<span style='color:#FFA500;'>next</span>|previous] <span style='color:#FFA500;'>language</span></li>"
                + "<ul><li>next language</li></ul>"
            + "</ul>"
    },
    
    /**********************************
     * Switch or turn on/of subtitles *
     **********************************/
    
    ySpeech_Subtitle: {
        helpSection: "ySpeech_Subtitle",  
        Title:"<span class='icon-bubbles2'></span> Switch or turn on/of subtitles", 
        Text: "<ul>"
            + "<li>To turn on and off subtitles say: <span style='color:#FFA500;'>subtitle</span>(s) [<span style='color:#FFA500;'>on</span>|show|hide|off|toggle]</li>"
                + "<ul><li>subtitle on</li></ul>"
            + "<li>To switch a subtitle in a playing file say: (set) (switch) <span style='color:#FFA500;'>subtitle</span>(s) (to) <span style='color:#FFA500;'><i>desired language</i></span><br />"
            + "<u>(This works only with english words for accodring language)</u></li>"
                + "<ul><li>subtitle English</li><li>set subtitle German</li><li>switch subtitle to French</li></ul>" 
            + "<li>To get a list of aviable subtitles say: <span style='color:#FFA500;'>list subtitle</span>(s)</i></li>"
                + "<ul><li>list subtitles</li></ul>"
            + "<li>you can also use the indicated indexnumber form the list to switch to a specific subtitle: (set) (switch) <span style='color:#FFA500;'>subtitle</span>(s) (to) <span style='color:#FFA500;'><i>desired subtitle-index-number</i></span></li>"
                + "<ul><li>subtitle 5</li></ul>"
            + "<li>To switch to the next or previous subtitle use: [<span style='color:#FFA500;'>next</span>|previous] <span style='color:#FFA500;'>subtitle</span></li>"
                + "<ul><li>next subtitle</li></ul>"
            + "</ul>"
    },
    
    /***********
     * Movies  *
     ***********/
    
    ySpeech_Movie: {
        helpSection: "ySpeech_Movie",  
        Title:"<span class='icon-video-camera'></span> Movies", 
        Text:"<ul>"
            + "<li>Play random movie: (play)(start) (a) (random) (unseen) <span style='color:#FFA500;'>movie</span></li>"
                + "<ul><li>random movie</li><li>play random unseen movie</li></ul>"
            + "<li>Play movie with eighter actor, director, tag or language: (play)(start) (unseen) <span style='color:#FFA500;'>movie</span> (with) [<span style='color:#FFA500;'>actor <i>Actor Name</i></span> | director <i>Director Name</i> | tag <i>Tag/Genre Name</i> | language <i>Language in English</i> | "
                + " title <i>Movie Title</i></i> ]</li>"
                + "<ul><li>start unseen movie actor Brad Pitt</li></ul>"
            + "<li>Show details of movie with eighter actor, director, tag or language: (show) <span style='color:#FFA500;'>details</span> (of) (unseen) <span style='color:#FFA500;'>movie</span> (with) [actor <i>Actor Name</i> | <span style='color:#FFA500;'>director <i>Director Name</i></span> | tag <i>Tag/Genre Name</i> | language <i>Language in English</i> | "
                + " title <i>'partial or full Movietitle'</i></i> ]</li>"
                + "<ul><li>show details of unseen movie with director David Lynch</li></ul>"
            + "<li>Show list in Yarc of movies with eighter actor, director, tag or language: (show) <span style='color:#FFA500;'>list</span> (of) (unseen) <span style='color:#FFA500;'>movie</span> (with) [actor <i>Actor Name</i> | director <i>Director Name</i> | <span style='color:#FFA500;'>tag <i>Tag/Genre Name</i></span> | language <i>Language in English</i> | "
                + " title <i>partial or full Movietitle</i> ]</li>"
                + "<ul><li>list movie tag Western</li></ul>"
            + "<li>Show details of random movie: (show) <span style='color:#FFA500;'>details</span> (of) (random) (unseen) <span style='color:#FFA500;'>movie</span></li>"
                + "<ul><li>details unseen movie</li></ul>"         
            + "<li>Add movie with eighter actor, director, tag or language to playlist: <span style='color:#FFA500;'>playlist</span> (add) <span style='color:#FFA500;'>movie</span> (with) [actor <i>Actor Name</i> | director <i>Director Name</i> | tag <i>Tag/Genre Name</i> | <span style='color:#FFA500;'>language <i>Language in English</i></span> | "
                + " title <i>'partial or full Movietitle'</i> ]</li>"
                + "<ul><li>playlist movie director Steven Spielberg</li></ul>"
            + "<li>Start movie with specific title: (play)(start) <span style='color:#FFA500;'>movie <i>Movie Title</i></span></li>"
                + "<ul><li>movie Big Buck Bunny</li></ul>"
            + "<li>Show details of movie with specific title: (show) <span style='color:#FFA500;'>details movie <i>Movie Title</i></span></li>"
                + "<ul><li>details movie Little Lord Fauntleroy</li></ul>"
            + "<li>Add movie with specific title to playlist: <span style='color:#FFA500;'>playlist</span> (add) <span style='color:#FFA500;'>movie <i>Movie Title</i></span></li>"
                + "<ul><li>playlist add movie A Clockwork Orange</li></ul>"
            + "<li>Start movie trailer of movie with specific title: (play)(start) <span style='color:#FFA500;'>movie trailer</span> (of) <span style='color:#FFA500;'><i>partial or full Movietitle</i></span>/li>"
                + "<ul><li>start movie trailer A bronx tale</li></ul>"
            + "</ul>"
    },
    
    /***********
     * TV Show *
     ***********/
    
    ySpeech_TVShow: {
        helpSection: "ySpeech_TVShow",  
        Title:"<span class='main-menu-icon icon-desktop'></span> TV-Shows", 
        Text: "<ul>"
                + "<li>Play specific episode: (play)(start) (TV show) (episode) <span style='color:#FFA500;'>season <i>Season Number</i> episode <i>Episode Number</i></span> (of) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li>play season 4 episode 3 of Monk</li><li>season 4 episode 2 Doctor Who</li></ul>"
                + "<li>Show details of specific episode: (show) <span style='color:#FFA500;'>details</span> (of) (a) (TV show) <span style='color:#FFA500;'>season <i>Season Number</i> episode <i>Episode Number</i></span> (of) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li>details of Season 3 episode 9 of My Name is Earl</li></ul>"
                + "<li>Add specific episode to playlist: <span style='color:#FFA500;'>playlist</span> (add) (TV show) <span style='color:#FFA500;'>season <i>Season Number</i> episode <i>Episode Number</i></span> (of) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li>playlist add TV show season 9 episode 2 Game of Thrones</li></ul>"
                + "<li>Play random episode of a season: (play)(start) (a) (random) [unseen] (TV show) (episode) (of) <span style='color:#FFA500;'>season <i>Season Number</i></span> (of) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li>start random unseen episode of season 1 of Chuck</li><li>episode of season 1 of I Dream of Jeannie</li></ul>"
                + "<li>Show details of random episode of a season: (show) <span style='color:#FFA500;'>details</span> (of) (a) (random) [unseen] (TV show) (episode) (of) <span style='color:#FFA500;'>season <i>Season Number</i></span> (of) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li> details random season 2 Columbo</li><li> details unseen season 2 of Terra X</li></ul>"
                + "<li>Add episode of a season to playlist: playlist (add) (a) (random) [unseen] (TV show) (episode) (of) <span style='color:#FFA500;'>season <i>Season Number</i></span> (of) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li>playlist add a random unseen TV-Show episode of season 2 of Community</li></ul>"
                + '<li>Play random episode of a TV-Show: "(play)(start) (a) (random) [unseen] (episode) (of) TV show (episode) (of) <i>TV-Show Name</i>" or "(play)(start) (a) (random) [unseen] <span style="color:#FFA500;">episode <i>TV-Show Name</i></span>"</li>' 
                    + "<ul><li>start a random episode of TV-Show Friends</li><li>unseen episode Home Improvement</li></ul>"
                + '<li>Show details of random episode of a TV-Show: "(show) details (of) (a) (random) [unseen] (episode) (of) TV show (episode) (of) <i>TV-Show Name</i>" or "(show) <span style="color:#FFA500;">details</span> (of) (a) (random) [unseen] <span style="color:#FFA500;">episode</span> (of) <span style="color:#FFA500;"><i>TV-Show Name</i></span>"</li>' 
                    + "<ul><li>details of a random episode of TV-Show Homeland</li><li>details random episode The IT Crowd</li></ul>"
                + '<li>Add episode of random episode of a TV-Show to playlist: "playlist (add) (a) (random) (episode) (of) TV show (episode) (of) <i>TV-Show Name</i></li>" or "<span style="color:#FFA500;">playlist</span> (add) (a) (random) [unseen] <span style="color:#FFA500;">episode <i>TV-Show Name</i></span>"' 
                    + "<ul><li>playlist add random unseen episode TV show Jamie cooks Italy</li><li>playlist unseen episode of Kim Kong</li></ul>"
                + '<li>Play next unseen episode of a TV-Show: "continue (episode) (of) (TV show) (episode) (of) <i>TV-Show Name</i>" or "(play)(start) <span style="color:#FFA500;">next</span> (episode) (of) (TV show) (episode) (of) <span style="color:#FFA500;"><i>TV-Show Name</i></span></li>' 
                    + "<ul><li>continue TV show last man standing</li><li>next last man standing</li><li>start next TV show episode Man with a plan</li></ul>"
                + '<li>Show details of next unseen episode of a TV-Show: (show) <span style="color:#FFA500;">details</span> (of) <span style="color:#FFA500;">next</span> (episode) (of) (TV show) (episode) (of) <span style="color:#FFA500;"><i>TV-Show Name</i></span></li>' 
                    + "<ul><li>details next TV show episode The Mandalorian</li><li>details of next The Mick</li></ul>"
                + "<li>Add next unseen episode of a TV-Show to playlist: <span style='color:#FFA500;'>playlist</span> (add) <span style='color:#FFA500;'>next</span> (episode) (of) (TV show) (episode) (of) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li>playlist next The Nanny</li></ul>"
                + "<li>Play latest episode of a TV-Show: (play)(start) <span style='color:#FFA500;'>latest</span> (episode) (of) (TV show) (episode) (of) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li>latest episode of The Neighbors</li></ul>"
                + "<li>Show details of latest episode of a TV-Show: (show) <span style='color:#FFA500;'>details</span> (of) <span style='color:#FFA500;'>latest</span> (episode) (of) (TV show) (episode) (of) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li>details latest North and South</li></ul>"
                + "<li>Add latest episode of a TV-Show to playlist: <span style='color:#FFA500;'>playlist</span> (add) <span style='color:#FFA500;'>latest</span> (episode) (of) (TV show) (episode) (of) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li>playlist add latest TV show the office</li></ul>"
                + "<li>Navigate to TV Show in Yarc: <span style='color:#FFA500;'>list</span> (episode)(episodes) (of) <span style='color:#FFA500;'>TV show <i>TV-Show Name</i></span></li>" 
                    + "<ul><li>list TV show psych</li></ul>"
                + "<li>Navigate to Season of TV Show in Yarc: <span style='color:#FFA500;'>list</span> (episode)(episodes) (of) (TV show) <span style='color:#FFA500;'>Season <i>Season Number</i></span> (of) (TV show) <span style='color:#FFA500;'><i>TV-Show Name</i></span></li>" 
                    + "<ul><li>list Season 4 of The Rookie</li></ul>"
                + "</ul>"
    },    
    
    /*********
     * Music *
     *********/
    
    ySpeech_Music: {
        helpSection: "ySpeech_Music",  
        Title:"<span class='icon-headphones1'></span> Music", 
        Text: "<ul>"
                + "<li>Start random album: (play)(start) (random) <span style='color:#FFA500;'>music</span></li>" 
                    + "<ul><li>music</li><li>play music</li></ul>"
                + '<li>By tag, start random album: "(play)(start) (random) <span style="color:#FFA500;">music tag <i>genre/tag</i></span>", or "(play)(start) (a) (random) (music) album tag <i>genre/tag</i>"</li>' 
                    + "<ul><li>play music tag Classical</li><li>random music tag Hip-Hop</li><li>start album tag Blues</li></ul>"
                + "<li>By artist, start random album: (play)(start) (a) (random) (music) <span style='color:#FFA500;'>artist <i>artist name</i></span></li>" 
                    + "<ul><li>play a random music artist Celine Dion</li><li>artist Torch</li></ul>"
                + "<li>By artist, start random album: (play)(start) (a) (random) (music) <span style='color:#FFA500;'>artist <i>artist name</i></span></li>" 
                    + "<ul><li>play a random music artist Celine Dion</li><li>artist Torch</li></ul>"
                + "</ul>"
    },
    
    /**********
     * PVR TV *
     **********/
    
    ySpeech_PVRTV: {
        helpSection: "ySpeech_PVRTV",  
        Title:"<span class='icon-tv1'></span> PVR Television", 
        Text:"<ul>"
            + '<li>Switch to channel: (play)(start)(switch) <span style="color:#FFA500;">television channel</span> (to) <i>[<span style="color:#FFA500;">channel name</span>|channel number]</i></li>'
                + "<ul><li>television channel BBC</li><li>television 7</li></ul>" 
            + '<li>list program of specific channel: "<span style="color:#FFA500;">list television channel</span> <i>[channel name|<span style="color:#FFA500;">channel number</span>]</i>, or "details (of) television channel <i>[channel name|channel number]</i>"</li>'
                + "<ul><li>list television channel BBC</li><li>Details of  television channel 7</li></ul>"
            + "<li>To play random channel: (play)(start)(switch) (to) (a) <span style='color:#FFA500;'>random television channel</span></li>" 
            + "<li>To play latest recording: (play)(start) <span style='color:#FFA500;'>latest television recording</span></li>" 
            + "<li>To play first/oldest item of recordings: (play)(start) [<span style='color:#FFA500;'>oldest</span>|first|earliest|foremost] <span style='color:#FFA500;'>television recording</span></li>" 
                + "<ul><li>foremost television recording</li></ul>" 
            + "<li>Play next unseen television recording of a show: (play)(start) <span style='color:#FFA500;'>next television recording</span> (of) <span style='color:#FFA500;'><i>Title</i></span></li>"
                + "<ul><li><i>Be aware, that partly seen recordings are always counted as fully seen for this command</i></li>"
                + "<li>play next Television recording of The Big Bang Theory</li></ul>"
            + "<li>Play latest television recording of a show: (play)(start) <span style='color:#FFA500;'>latest television recording</span> (of) <span style='color:#FFA500;'><i>Title</i></span></li>"
                + "<ul><li>start latest television recording of Monk</li></ul></li>"                 
            + "<li>To play first/oldest item of a show: (play)(start) [<span style='color:#FFA500;'>oldest</span>|first|earliest|foremost] <span style='color:#FFA500;'>television recording</span> (of) <span style='color:#FFA500;'><i>Title</i></span></li>"
                + "<ul><li>play earliest television recording of Chuck</li></ul>"  
            + "<li>Play random television recording: (play)(start) (a) (random) [unseen] <span style='color:#FFA500;'>television recording</span></li>"  
            + "<ul>"
                + "<li>By tag: play random television recording: (play)(start) (a) (random) [unseen] <span style='color:#FFA500;'>television recording</span> (with) <span style='color:#FFA500;'>tag <i>tag name</i></span></li>"
                    + "<ul><li>start random television recording tag comedy</li></ul>"   
                + "<li>By channel: play random television recording: (play)(start) (a) (random) [unseen] <span style='color:#FFA500;'>television recording channel <i>channel name</i></span></li>"
                    + "<ul><li>unseen television recording channel BBC</li></ul>"    
                + "<li>By title: play random television recording: (play)(start) (a) (random) [unseen] <span style='color:#FFA500;'>television recording</span> (with) (title) <span style='color:#FFA500;'><i>Title</i></span></span></li>"
                    + "<ul><li>television recording Doctor Who</li></ul>" 
            + "</ul>"
            + "<li>To search for broadcast title: (open) (list) <span style='color:#FFA500;'>television search</span> (with) (title) <span style='color:#FFA500;'><i>Title</i></span></li>" 
                + "<ul><li>open television search Seinfeld </li></ul>"     
            + "<li>To search for broadcast tag: (open) (list) <span style='color:#FFA500;'>television</span> (search) (with) <span style='color:#FFA500;'>tag <i>Tagname</i></span></li>" 
                + "<ul><li>television tag Comedy</li></ul>"
            + "</ul>"
    },    
    
    /*************
     * PVR Radio *
     *************/
    
    ySpeech_PVRRadio: {
        helpSection: "ySpeech_PVRRadio",  
        Title:"<span class='icon-radio'></span> PVR Radio", 
        Text:"<ul>"
            + '<li>Switch to channel: (play)(start)(switch) <span style="color:#FFA500;">radio</span> (channel) (to) <i>[<span style="color:#FFA500;">channel name</span>|channel number]</i></li>'
                + "<ul><li>radio Pilatus</li><li>radio 14</li></ul>"                 
            + '<li>List program of specific channel: "<span style="color:#FFA500;">list radio</span> (channel) <i>[channel name|<span style="color:#FFA500;">channel number</span>]</i>", or "details (of) radio (channel) <i>[channel name|channel number]</i>"</li>'
                + "<ul><li>list radio DRS2</li><li>details of radio Radio Virus</li></ul>"                
            + "<li>To play random channel: (play)(start)(switch) (to) (a) <span style='color:#FFA500;'>random radio</span> (channel)</li>"  
            + "</ul>"
    },
    
    /**************************************
     * open favorite (speechHelpFavorite) *
     **************************************/
    
    ySpeech_Favorite: {
        helpSection: "ySpeech_Favorite",  
        Title:"<span class='icon-star'></span> Favorite", 
        Text: "<ul>"
        + "<li>To open Kodi's favorite list in Yarc say: <span style='color:#FFA500;'>List Favorite</span>(s)</li>"
            + "<ul><li>list favorite</li></ul>"
        + "<li>To open an element on your Kodi's favorite list say: <span style='color:#FFA500;'>Favorite</span>(s) <span style='color:#FFA500;'><i>Titel</i></span></li>"
            + "<ul><li>(Hint: If you have problems opening an favorite you might consider changing it's title in Kodi.)</li>"
            + "<li>favorite Big Buck Bunny</li></ul>" 
        + "</ul>"
    },
    
    /**********************************
     * yarc settings (yarc)   *
     **********************************/
    
    ySpeech_yarc: {
        helpSection: "ySpeech_yarc",  
        Title: "<span class='icon-gears'></span> Yarc", 
        Text: "<ul>"
              + "<li>To toggle show or hide seen elements in Yarc say: [<span style='color:#FFA500;'>toggle unseen</span>|toggle seen|show unseen|hide unseen|show seen|show watched|hide seen|hide watched|show unwatched|hide unwatched]</li>"
                + "<ul><li><i>Be aware that you may have to reload Yarc that it gets into effect</i></li><li>hide seen</li><li>show unseen</li></ul>"
            + "</ul>"
    }
};
     

var ySpeechTools = {
    text2Int: function(n){
        n = $.trim(n);
        n.toLowerCase();        
        if(n=="one") {return 1}
        else if (n=="two"||n=="to"||n=="too") {return 2}
        else if (n=="three"||n=="free") {return 3}
        else if (n=="five") {return 5}
        else if (n=="ten") {return 10}
        else {return n}
    }
    
};
