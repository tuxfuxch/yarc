#About yarc (yet another remote control)

A webbased remote control for Kodi (former XBMC) optimised for mobile friendly use.

This document is still work in progress.

First things first: if you want a fancy GUI only for use on PC or tablet (give AWXi or Chorus a try), you might like other solutions better.
I have done what I need and how I want it. Forgive me if it is not yet how you like it and what you want. Contact me to change that, I might agree with you.

###Key Features (what might be better than in other solutions)

  * GUI is optimised for smart phones
  * Swipe-area for gesture navigation/control
  * Set how many items are shown in lists (so that you mobile browser does not crash because of an image overload)
  * Preview pictures for movies are compressed (tell in settings how much)
  * Reads languages out of the file name in your collection (read more about in the according chapter)
  * Search directly in YouTube and let it play on Kdoi (still beta)
  * Start add-ons without navigating through the menu
  * Send a text-string from the yarc-GUI to a text field in Kodi

###Download

https://github.com/tuxfuxch/yarc

###Requirements

  * Minimum XBMC Frodo (should work with Gotham according to others)
  * Internet connection to see preview images of movies.
  * I heard: it's still usable on a mobile with Symbian, Opera Mobile12, 42mb free ram and ARM 11 CPU @ 434 MHz

###Tested on

  * Firefox
  * Firefox-mobile
  * Maxthon
     - no keyboard use
     - SVG images (default setting is use of *.png images)
     - Swipe-area not working perfectly (long-touch doesn't work and sometimes it scrolls where it should not)
  * I heard: it's working fine on IE10

###Settings

  * General
    - **Window title**: if you have multiple Kodi's around, you can give a name to the Window title
    - **Hide preview pictures**: if your browser crashes because of to many pictures or you just don't want them, you can get rid of them
    - **Use SVG**: just because I like it, if you want some pictures to be SVG, you can set this. Some mobile browsers don't support them
    - **Hide watched movies and series**
    - **Max list length (0 for no limit)**: if you want to reduce the items shown in the GUI you can say here what you like. Set to 0 if you don't want a limit
    - **Hide language functions and flags**: if you don't use this feature, you don't need to see it and can make some space on the screen
  * Remote
    - **Buttons instead of touch area**: get rid of the swipe area and get in return buttons with that functionality
    - **Set hight of swipe area**: set a css value for hight. Supported: em, ex, px, vh (% of viewport height)
  * Movies
    - **Hide genre selection**: if you don't need this feature, get rid of it and make some space on the screen
    - **Hide search field**: if you don't need this feature, get rid of it and make some space on the screen
    - **Hide file-link in popup**: as a default, the file-link is shown in the popup. If you don't want it, you don't need to see it
    - **Preview image quality rate (can be between 10 and 95; higher is better quality)**: reduce the quality of pictures when you device doesn't have engouh RAM
  * Music
    - **Hide genre selection**: if you don't need this feature, get rid of it and make some space on the screen
    - **Hide search field**: if you don't need this feature, get rid of it and make some space on the screen
  * Add-ons
    - **Hide genre selection**: if you don't need this feature, get rid of it and make some space on the screen
    - **Hide search field**: if you don't need this feature, get rid of it and make some space on the screen

###The GUI

For screens with less than 700px width, the list items are shown not as tiles, it is a list with one item per line.

###Swipe gestures
Through swipe and tab gestures, you can control your Kodi. Use the grey field to do it with the following gestures. 
Multi touch gestures (two fingers or pinch) are not implemented due to support of old devices.... sorry. 

Make sure, that you don't accidentally stop the playing media when you want to scroll down. Use the space on the right side to scroll.
It shouldn’t take long to get used to this feature.

In the settings you can replace this field with buttons
  *  Navigation:
	  - Swipe up, down, left or right for the according direction you want to navigate
	  - Tab once to select
	  - Tab twice to go back
	  - Tab long for the context menu
  *  Media:
	  - Swipe up to stop the player
	  - Swipe down for play/pause
	  - Swipe left for the previous item in the playlist
	  - Swipe right for the next item in the playlist
	  - Tab once for volume down by 10 out of 100%
	  - Tab twice for volume up by 10 out of 100%
	  - Tab long to toggle mute




##Key Map

If you use a device with a full qwerty keyboard you can use this. In the yarc.js file, you can change them right in the beginning as you wish. If you need to know how to find out what code is used for which key you might want to check this site: 
http://api.jquery.com/keypress/ (in the bottom, press a key and look for the line "keyCode:")

Right now you can use:
  * **Arrow keys for navigation**
  * **Backspace**: back
  * **Enter**: select
  * **Shift & arrow up**: stop playing
  * **Shift & arrow down**: play/pause
  * **Shift & arrow left**: previous item in playlist
  * **Shift & arrow right**: next item in playlist
  * **c**: context menu
  * **q**: volume down (by 10 out of 100%)
  * **w**: volume up (by 10 out of 100%)

If you want or need more functions. Contact me, I might change that.

###Language "detection" Feature

Some ppl tag in a movie file name the languages directly. I did it for my whole DVD collection and wanted to use this because the language tagging in Kodi is not suitable for me. Multiple tags per filename are supported.
If you want use the Kodi language solution within a webinterface, give AWXi a try.

I tried to include most languages. As a standard it looks like this (example for French):
  * [FR]
  * _FR

for some countries the list is longer like in this example (German):
  * [DE]
  * _DE
  * [Ger]
  * _Ger 
  * [GER] 
  * _GER
  * .German. 
  * .german.
  * _German
  * _GERMAN
  * .GERMAN.

You can add your tagging style in the file "countryLanguage.js".

If you use another tagging scheme and want it included in my official version (so that you don't need to backup for updates), please contact me to expand the list, or even better: send me your version of countryLanguage.js

###Search YouTube Feature

This is still beta. Some things don't work. It will return in maximum the first 50 search result. But you can play also playlists which are indicated with the string **[PL]** before the title. The playtime of an item is not shown, because I need to request it for every item separately. I Hope you can live with that.

I needed to apply for the API and can use "only" 1 million transaction per day. This is enough for sure for a while or forever, or it's been misused, I have to close it down. In this case it won't work any more. Maybe I would provide a possibility to set your own key.

###Credits

  * jquery (http://jquery.com/)
  * Wikipedia and it contributors: for the flags (all public domain or similiar licence)
  * TochSwipe Plugin for jquery (https://github.com/mattbryson/TouchSwipe-Jquery-Plugin)
  * Font Awesome for the very good symbol-font (http://fontawesome.io)
  * Kabooga for first testing and help in buxfixing, author of webinterface.xrc
  * Martijn for correction of addon.xml, Kodi (former XBMC) Team Member
  * ruth440 for testing and feedback. I was pointed into the right direction

###Contact me

Found a bug? Please tell me. It might be helpful if you tell me which version of yarc you are using and even more, which browser on which platform (ex. Firefox Mobile on Android with Yarc 1.2.3)

Tell me what you think could be done better, or what features you would like to see. I might agree with you.

Feedback about the code is also appreciated, since I am not yet that much of a programmer.

Please contact me on github with bug reports or feature requests: https://github.com/tuxfuxch/yarc/issues
or alternatively in the Forum Thread: http://forum.xbmc.org/showthread.php?tid=198217