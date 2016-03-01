#About yarc (yet another remote control)

A web based remote control for Kodi (former XBMC) optimized for mobile friendly use.

An introduction video can be found here:

[![Yarc 0.8.0 Demo Video](http://img.youtube.com/vi/yltMcKJFewE/0.jpg)](https://www.youtube.com/watch?v=yltMcKJFewE)

WARNING: This Addon may contain content illegal in your country (example: flag of Tibet is illegal China)

###Key Features (what might be better than in other solutions)

  * GUI is optimized for smart phones
  * Easy access to Remote controll and send text to Kodi
  * Swipe-area for gesture navigation/control
  * Browse addons within the web interface
  * Navigate by changing the orientation of your device: more in the according chapter
  * Set how many items are shown in lists (so that you mobile browser does not crash because of an image overload)
  * Preview from the internet are compressed (tell in settings how much)
  * Reads languages out of the file name in your collection (read more about in the according chapter)

###Download

https://github.com/tuxfuxch/yarc

###Requirements

  * Minimum Helix 14.x
  * Internet connection to see preview images of movies, readme and demo Video
  * Youtube Plugin

###Tested on (assumed latest version)

  * Firefox
  * Android: Firefox-mobile

Not entirely tested:
  * Android: Maxthon
     - no keyboard use
     - removing form play-list: button gets often not activated
  *  Android: Chrome
     - removing form play-list: button gets often not activated
     - in older Chrome Version, some texts are not visible
  * Ubuntu Touch Browser
	 - Deviceorienation doesn't work (yet)
  * Windows Mobile (Edge Browser)
      - Swipe field does not work (in settings choose buttons in the remote section)

###Settings

Check the settings and adjust the interface to you needs, or what you mobile device can handle:

Pointing out:
  * Define how long lists should be (good for large collections)
  * Reduce quality of pictures which are from the internet
      --> hint: setting to 95 will load them directly, less than 95 will use an image proxy
  * don't show images if you don't need them
  * get rid of things you don't need, to save processor time or space on the interface


###The GUI

For screens with less than 700px width, the list items are shown not as tiles, it is a list with one item per line.
Screens with less than 307x422 pixel (viewport) may have some displaying issues.

###Swipe gestures
Through swipe and tab gestures, you can control your Kodi. Use the gray field to do it with the following gestures. 
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
	  - Swipe left for the previous item in the play-list
	  - Swipe right for the next item in the play-list
	  - Tab once for volume down by 10 out of 100%
	  - Tab twice for volume up by 10 out of 100%
	  - Tab long to toggle mute


###Device Orientation
If there is a switch in the remote section, activate it (it's off by default, because it's a battery killer). If there is no switch, your mobile and/or browser does not support it.
But even when it shows it, it may be not supported.

  * Navigation:
	- lean the top-edge of your mobile to the left, to navigate left
	- the same with right
	- lean the top-edge of your mobile towards you, it goes up
	- lean the top-edge of your mobile  down (lower, than it would be than lying on a flat surface)
	- put your mobile with screen facing down on a flat surface: it pauses.
	take your mobile back in your hand like you hold it (not flat screen facing up, take in in your hand as you would typically hold it to type something, it plays again
 
###Key Map

If you use a device with a full qwerty keyboard you can use this. In the yarc.js file, you can change them right in the beginning as you wish. If you need to know how to find out what code is used for which key you might want to check this site: 
http://api.jquery.com/keypress/ (in the bottom, press a key and look for the line "keyCode:")

Right now you can use:
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

###Language "detection" Feature

Some ppl tag in a movie file name the languages directly. I did it for my whole DVD collection and wanted to use this because the language tagging in Kodi is not suitable for me. Multiple tags per filename are supported.

You have to use as tags the codes from the standard ISO 639-2 (http://www.loc.gov/standards/iso639-2/php/code_list.php).

Put the tags in square brackets (these things --> [ ] ).

Example: the filename is "my_favourite_movie.iso"

If it's in english and german, change the filename to "my_favourite_movie[eng][ger].iso"

Capital or non-capital letters, as order, does not matter.

###Credits and Licenses
all the licenses are in the subfolder resources/licenses

  * jquery (http://jquery.com/; MIT License)
  * Wikipedia and it contributors: for all the flags (all public domain or CC License)
      * for the CC license contributions, see images/falgs/0_cc_licenses.txt
      * if it is not mentioned in the text file, it's public domain
  * TochSwipe Plugin for jquery (https://github.com/mattbryson/TouchSwipe-Jquery-Plugin; GPL 2 or MIT License)
  * Font Awesome for the very good symbol-font (http://fontawesome.io; SIL OFL 1.1 License (Font) and MIT License (Code))
  * jQuery UI (http://jqueryui.com/; MIT License)
  * jQuery UI Touch Punch Plugin/Fix; Touch Event Support for jQuery UI (http://touchpunch.furf.com/;  GPL 2 or MIT License)
  * i18next (http://i18next.com; MIT license)
  * the guy's behind http://images.weserv.nl/. Great service!
  * Kabooga for first testing and help in buxfixing, author of webinterface.xrc
  * Martijn for correction of addon.xml, Kodi Team Member
  * ruth440 for testing and feedback. I was multiple times pointed into the right direction
  * Mizaki for help/advising multiple times
  * and for the spanish translation
  * sheikr and vilma for the portuguese translations
  * yarons for the hebrew translation
  * dawed for help/advising multiple times

###Contact me

Found a bug? Please tell me. It might be helpful if you tell me which version of yarc you are using and even more, which browser on which platform (ex. Firefox Mobile on Android with Yarc 1.2.3)

Tell me what you think could be done better, or what features you would like to see. I might agree with you.

Feedback about the code is also appreciated, since I am not yet that much of a programmer.

Please contact me on github with bug reports or feature requests: https://github.com/tuxfuxch/yarc/issues
or alternatively in the Forum Thread: http://forum.xbmc.org/showthread.php?tid=198217