#About yarc (yet another remote control)

A webbased remote control for XBMC optimised for mobile friendly use.

This document is still work in progress.

First things first: if you want a fancy GUI only for use on PC or tablet (give Awxi or Chorus a try), you might like other solutions better.
I have done what I need and how I want it. Forgive me if it is not yet how you like it and what you want. Contact me to change that.

###Key Features (what might be better than in other solutions)

  * GUI is optimised for smartphones
  * Swipe-area for gesture navigation/control
  * Set how many items are shown in lists (so that you mobile browsers does not crash because of image overload)
  * Preview pictures for movies are compressed (tell in settings how much)
  * Reads languages out of filename in your collection (read more about in the according chapter)
  * Search directly in youtube and let it play on XBMC (still beta)
  * Start addons without navigating through menues
  * Send a text-string from the yarc-GUI to a textfield in XBMC

###Download

https://github.com/tuxfuxch/yarc

###Requirements

  * Minimum XBMC Frodo
  * Internet connection to see preview images of movies.

###Tested on

  * Firefox
  * Firefox-mobile
  * Maxthon (no Accesskey's and SVG images (default setting is use uf *.png images))

###Settings

  * General
    - **Window title**: if you have multiple XBMC's around, you can give a name to the Window title
    - **Buttons instead of touch area**: get rid of the swipe area and get in return buttons with that functionality
    - **Hide preview pictures**: if your browser crashes because of to many pictures or you just don't want them, you can get rid of them
    - **Use SVG**: just because i like it, if you want some pictures to be SVG, you can set this. But some mobile browsers don't support them
    - **Hide watched movies and series**
    - **Max list length (0 for no limit)**: if you want to reduce the items shown in the GUI you can say here what you like. Set to 0 if you don't want a limit
    - **Hide language functions and flags**: if you don't use this feature, you don't need to see it and make some space on the screen
  * Movies
    - **Hide genre selecton**: if you don't need this feature, get rid of it and make some space on the screen
    - **Hide search field**: if you don't need this feature, get rid of it and make some space on the screen
    - **Hide filelink in popup**: as a default, the filelink is shown in the popup. If you don't want, you don't need to see it
    - **Preview image quality rate (can be between 10 and 95; higher is better quality)**: reduce the quality of pictures when you device doesen't have engouh RAM
  * Music
    - **Hide genre selecton**: if you don't need this feature, get rid of it and make some space on the screen
    - **Hide search field**: if you don't need this feature, get rid of it and make some space on the screen
  * Addons
    - **Hide genre selecton**: if you don't need this feature, get rid of it and make some space on the screen
    - **Hide search field**: if you don't need this feature, get rid of it and make some space on the screen

###The GUI

For screens with less than 700px width, the list items are shown not as tiles, it is a list with one item per line.

###Swipe gestures
Through swipe and tab gestures, you can control your XBMC. Use the grey field to do it with the folling gestures. 
Multitouch (two fingers or pinch) is not implemented due to support of old devices.... sorry. 

Make sure, that you don't accidently stop the playing media when you want to scroll down. Use the space on the right side to scroll.
It shoudn't take long to get used to this feature.

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
	  - Tab once for volume down 10%
	  - Tab twice for volume up 10%
	  - Tab long to toggle mute




##Key Map

If you use a device with a full qwerty keyboard you can use thits. In the yarc.js file, you can change them right in the beginning as you whish. If you need to know how to find out what code is used for which key you might want to check this site: 
http://api.jquery.com/keypress/ (in the buttom, press a key and look for the line "keyCode:")

Right now you can use:
  * **Arrow keys for navigation**
  * **Backspace**: back
  * **Enter**: select
  * **Shift & arrow up**: stopp playing
  * **Shift & arrow down**: play/pause
  * **Shift & arrow left**: previous item in playlist
  * **Shift & arrow right**: next item in playlist
  * **c**: context menue
  * **q**: volume down (by 10 out of 100%)
  * **w**: volume up (by 10 out of 100%)

If you want or need more functions. Contact me, I might change that.

###Language "detection" Feature

Some ppl tag in a movie file the languages directly in the filename. I did it for my whole DVD collection and wanted to use this because the language tagging in XBMC is not well engouh for me.

I tried to include most langages. As a standard it looks for (example for French):
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

If you use another tagging scheme and want it included (so that you don't need to backup for updates), please contact me to expand the list, or even better: send me your version of countryLanguage.js

###Search Youtube Feature

This is still beta. Some thins dont work. It will return in maximum the first 50 search result. But you can play also playlists which are indicated with the string **[PL]** before the title. The playtime of an item is not shown, because i need to request it for every item seperatly. I Hope you can live with that.

I needed to apply for the api and can use "only" 1 million transaction per day. This is enough for sure for a while or forever. But i have to close it down when it is more. In this case it won't work anymore. Maybe i would provide a possibily to set your own key.

###Credits

  * jquery (http://jquery.com/)
  * Wikipedia (for the flags!)

###Contact me

Found a bug? Please tell me. It might be helpfull if you tell me which version of yarc you are useing and even more, which browser on which platform (ex. Firefox Mobile on Android with Yarc 1.2.3)

Tell me what you think could be done better, or what featueres you would like to see.

Feedback about the code is also appreciated, since i am not yet that much of a programmer.

Please contact me over email: esra[a]kummer.to.