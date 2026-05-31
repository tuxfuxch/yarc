#About yarc (Yet Another Remote Control)

A web based remote control for Kodi optimized for mobile friendly use.

An introduction video can be found here:

[![Yarc 0.8.0 Demo Video](http://img.youtube.com/vi/yltMcKJFewE/0.jpg)](https://www.youtube.com/watch?v=yltMcKJFewE)

###Key Features (what might be better than in other solutions)

  * GUI is optimized for smart phones
  * Easy access to remote controll
  * Swipe-area for gesture navigation/control
  * Browse addons within the web interface
  * Navigate by changing the orientation of your device: more in the according chapter
  * Reads languages out of the file name in your collection (read more about it in the according chapter)
  * Speech recognition: Note that a htts connection must be set up first, and browser must support the feature
  * PVR for television has program, search an much more

###Download

  * Addonstore of Kodi
  * for testing: https://github.com/tuxfuxch/yarc

###Tested on (assumed latest version)

  * Chrome
  * Android: Chrome-Mobile

Not entirely tested:

  * Android: Firefox-Mobile
  * Firefox

###Settings

Check the settings and adjust the interface to you needs, or what you mobile device can handle:

Pointing out:

  * define how long lists should be (good for large collections), or more convenient handling
  * don't show images if you don't want them
  * get rid of things you don't need, to save processor time and/or space on the interface


###The GUI

For screens with less than 700px width, the list items are shown not as tiles, it is a list with one item per line.
Its not optimsed for screens with less than 307x422 pixel (viewport).

###Swipe gestures
Through swipe and tab gestures, you can control your Kodi. Use the gray field to do it with the following gestures. 
Multi touch gestures (two fingers and pinch) are not implemented due to support of old devices.... sorry. 

In the settings you can replace this field with buttons in case it does not work for you or you just like buttons better

Gestures:
  *  Navigation:
	  - Swipe up, down, left or right for the according direction you want to navigate (there is a setting to switch directions)
	  - Tab once to select
	  - Tab twice to go back
	  - Tab long for the context menu
  *  Media:
	  - Swipe up to stop the player
	  - Swipe down for play/pause
	  - Swipe left for the previous item in the play-list
	  - Swipe right for the next item in the play-list
	  - Tab once for volume down by 10%
	  - Tab twice for volume up by 10%
	  - Tab long to toggle mute


###Device Orientation
If there is a switch in the remote section, activate it (it's off by default, because it's a battery killer). If there is no switch, your mobile and/or browser does not support it.
But even when it shows it, it may not be supported.

  * Navigation:
	- lean the top-edge of your mobile to the left, to navigate left
	- same principle for right
	- lean the top-edge of your mobile towards you, it goes up
	- lean the top-edge of your mobile  down (lower, than it would be than lying on a flat surface)
	- put your mobile with screen facing down on a flat surface: it pauses or mutes (according to setting)
	take your mobile back in your hand like you hold it (not flat screen facing up, take in in your hand as you would typically hold it to type something, it plays again normally
 
###Key Map
  * **Arrow keys for navigation**
  * **ESC**: go to root menu
  * **Tab**: show/hide OSD
  * **Enter**: select
  * **Backspace**: back
  * **Shift & arrow up** or **x**: stop playing
  * **Shift & arrow down** or **Space** or **p**: play/pause
  * **Shift & arrow left**: previous item in play-list
  * **Shift & arrow right**: next item in play-list
  * **c**: context menu
  * **f**: fast forward
  * **r**: rewind
  * **i**: show info
  * **m**: show/hide OSD
  * **q**: volume down (by 10 out of 100%)
  * **w**: volume up (by 10 out of 100%)
  
[speech]###Speech Recognition 

###Language "detection" Feature

Some ppl tag in a movie file name the languages directly. I did it for my whole DVD collection and wanted to use this because the language tagging in Kodi is not suitable for me. Multiple tags per filename are supported.

You have to use tags according to the codes from the ISO 639-2 standard (http://www.loc.gov/standards/iso639-2/php/code_list.php).

Put the tags in square brackets.

Example: the filename is "my_favourite_movie.iso"

If it's in english and german, change the filename to "my_favourite_movie[eng][ger].iso"

To tag subtitles add "sub:". accoring to the example: "my_favourite_movie[eng][ger][sub:eng][sub:ger].iso"

Capital or non-capital letters, as well as order, do not matter.

###Credits and Licenses
all the licenses are in the subfolder resources/licenses

  * jquery (http://jquery.com/; MIT License)
  * Wikipedia and it contributors: for all the flags (all public domain or CC License)
      * for the CC license contributions, see recourses/images/falgs/0_cc_licenses.txt
      * if it is not mentioned in the text file, it's public domain
  * TochSwipe Plugin for jquery (https://github.com/mattbryson/TouchSwipe-Jquery-Plugin; GPL 2 or MIT License)
  * Font Awesome for the very good symbol-font (http://fontawesome.io; SIL OFL 1.1 License (Font) and MIT License (Code))
  * Icomoon to minimize and add icons to  Font Awesome (https://icomoon.io)
  * jQuery UI (http://jqueryui.com/; MIT License)
  * jQuery UI Touch Punch Plugin; Touch Event Support for jQuery UI (http://touchpunch.furf.com/;  GPL 2 or MIT License)
  * i18next (http://i18next.com; MIT license)
  * Kabooga for first testing and help in buxfixing, author of webinterface.xrc
  * Martijn for correction of addon.xml, Kodi Team Member
  * ruth440 for testing and feedback. I was multiple times pointed into the right direction
  * Mizaki for help/advising multiple times
  * and for spanish translations
  * sheikr and vilma for portuguese translation
  * yarons for hebrew translation
  * dawed for help/advising multiple times and also Spanish and Bärndütsch translation
  * Dasha for russian translation
  * Pietro for italian translation

###Contact me

Found a bug? Please tell me. It might be helpful if you tell me which version of yarc you are using and even more, which browser on which platform (ex. Firefox Mobile on Android with Yarc 1.2.3)

Tell me what you think could be done better, or what features you would like to see. I might agree with you.

Feedback about the code is also appreciated, since I am not yet that much of a programmer.

Please contact me on github with bug reports or feature requests: https://github.com/tuxfuxch/yarc/issues
or alternatively in the Kodi forum thread: http://forum.kodi.tv/showthread.php?tid=198217
