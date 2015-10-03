/*
 * yarc - Yet another Remote Control (for Kodi)
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
var translations = {
	ADD_FAVORITE:{//Add an item to a Music or Movie Playlist. //TODO es,it,fr
			en: "+/- Kodi Favorites",
			de: "+/- Kodi Favoriten",
			es: "+/- Kodi Le gusta:",
			it: "+/- Kodi Favoriti",
			fr: "+/- Kodi Favoris"
	},
	ADD_PLAYLIST:{//Add an item to a Music or Movie Playlist
			en: "+playlist",
			de: "+Wied.liste",
			es: "+lista de reproducción",
			it: "+giocare elenco",
			fr: "+jouer liste"
	},
	ADD_SEASON:{//Add all aviable episodes of a tv series season to the playlist //TODO: fr, it, es
			en: "Add whole season to playlist",
			de: "Gesammte Staffel zur Playliste hinzufügen",
			es: "Añadir toda la temporada a la lista de reproducción",
			it: "Aggiungere tutta la stagione alla giocare elenco",
			fr: "Ajouter toute la saison à la jouer liste"
	},
	ADDON_INTRO:{//TODO: fr, it, es
			en: "Addons are made differently. If something doesn't work or behaves strangely, you met some limitations. Sorry.",
			de: "Erweiterungen sind unterschiedlich gemacht. Wenn etwas nicht geht oder sich seltsam verhält, willkommen an den Grenzen des machbaren. Entschuldigung.",
			es: "Addons se hacen diferente. Si algo no funciona o se comporta de manera extraña, te encontraste con algunas limitaciones. Lo siento.",
			it: "Addons sono fatti in modo diverso. Se qualcosa non funziona o si comporta stranamente alto, hai incontrato alcune limitazioni. Mi dispiace.",
			fr: "Addons sont faites différemment. Si quelque chose ne fonctionne pas ou se comporte étrangement de vers le haut, vous avez rencontré quelques limitations. Désolé."
	},
	ADDONS:{//as in Addons or Extensions for the Program, its a menuitem -> Plural
			en: "Addons",
			de: "Erweiterungen",
			es: "Extensiones",
			it: "Estensione",
			fr: "Module"
	},
	ALBUMS:{//The Section in Music, where everything is sortet for albums
			en: "Albums",
			de: "Alben",
			es: "Álbumes",
			it: "Albums",
			fr: "Albums"
	},
	ALERT_CANT_REMOVE_PLAYING:{//This comes, if the user tries to remove the item which is currently playing. This is not possible.
			en: "You can't remove a currenty playing item... sorry",
			de: "Sie können kein aktuell abspielendes Element entfernen... Entschuldigung",
			es: "No es posible eliminar un archivo que está siendo ejecutado... lo siento",
			it: "Non puoi rimuovere un currenty giocando elemento... mi dispiace",
			fr: "Vous ne pouvez pas supprimer un currenty jouant point... Désolé"
	},
	ALERT_IMAGE_QUAL:{//This comes, if the user does a wrong input in settings.
			en: "Needs to be a full number between (including) 10 and 95. Please change this in order to be able to save!",
			de: "Muss eine ganze Zahl sein zwischen (inklusive) 10 und 95.  Bitte anpassen um speichern zu können!",
			es: "Tiene que ser un número entero entre 10 y 95 (inclusive). Por favor cambia para poder archivar.",
			it: "Deve essere un pieno numero tra (compreso) 10 e 95. Si prega di modificare questo per poter salvare!",
			fr: "Doit être un plein nombre entre (10 et 95 notamment). S'il vous plaît changer cela afin d'être en mesure d'enregistrer!"
	},
	ALERT_LISTLENGTH:{//This comes, if the user does a wrong input in settings.
			en: "Needs to be a full number. Please change this in order to be able to save!",
			de: "Muss eine ganze Zahl sein. Bitte anpassen um speichern zu können!",
			es: "Debe ser un número entero. Por favor cambia para poder archivar.",
			it: "Deve essere un numero completo. Si prega di modificare questo per poter salvare!",
			fr: "Doit être un nombre complet. S'il vous plaît changer cela afin d'être en mesure d'enregistrer!"
	},
	ALERT_SWIPEHIGHT:{//This comes, if the user does a wrong input in settings.
			en: "It's a CSS height property. It needs to be a number with one of these endings: 'em', 'ex', 'px' or 'vh'",
			de: "Dies ist eine CSS höhen Eigenschaft. Es muss eine Zahl sein mit eine der folgenden Endungen: 'em', 'ex', 'px' or 'vh'",
			es: "Es una propiedad elevada de CSS. Debe ser un número con #una de estas terminaciones: 'em', 'ex', 'px' o 'vh'",
			it: "È una proprietà di altezza CSS. Deve essere un numero con una di queste terminazioni: 'em', 'ex', 'px' o 'vh'",
			fr: "C'est une propriété de hauteur CSS. Il doit être un nombre avec un des ces terminaisons: 'em', 'ex', 'px' o 'vh'"
	},
	ALERT_SONGSEARCH:{//This comes, if the user searches with a word of less than 3 characters in the searchfield
			en: "Type at least 3 Characters to search",
			de: "Tippe mindestens 3 Zeichen für die Suche",
			es: "Escriba al menos tres caracteres para buscar",
			it: "Digitare almeno 3 caratteri per la ricerca",
			fr: "Tapez au moins 3 caractères pour rechercher"
	},
	AUDIO:{//This is the desciption for on which playlist the user is or wants to go or a type of addon
			en: "Audio",
			de: "Audio",
			es: "Audio",
			it: "Audio",
			fr: "Audio"
	},
	AUDIO_LIB_SCAN:{//This is a button in the tools section, to scan for new content in the music library
			en: "Audio Lib: scan",
			de: "Audio Sammlung: überprüfen",
			es: "Audioteca: escanear",
			it: "Libreria audio: scansione",
			fr: "Bibliothèque audio : Scan"
	},
	AUDIO_LIB_CLEAN:{//This is a button in the tools section, to clean (delete) the audio library
			en: "Audio Lib: clean",
			de: "Audio Sammlung: säubern",
			es: "Audioteca: limpiar",
			it: "Bibliothèque audio: pulito",
			fr: "Bibliothèque audio: nettoyer"
	},
	BACK:{//Simply a back Button, to go to the last page
			en: "Back",
			de: "Zurück",
			es: "Atrás",
			it: "Indietro",
			fr: "Précédent"
	},
	CANCEL:{//Simply a cancel Button in a dialog, to abord something
			en: "Cancel",
			de: "Abbrechen",
			es: "Cancelar",
			it: "Annulla",
			fr: "Annuler"
	},
	CLOSE:{//Simply a close Button in a dialog, to close something
			en: "Close",
			de: "Schliessen",
			es: "Cerrar",
			it: "Chiudere",
			fr: "Fermer"
	},
	DEVICE_ORIENTATION:{//if you want to navigate to right, change mobile orientation to right....
			en: "Device Orientation Navigation",
			de: "Gerätelage Navigation",
			es: "Dispositivo orientación navegación",
			it: "Dispositivo orientamento navigazione",
			fr: "Dispositif Orientation Navigation"
	},
	DONE:{//Confirmation that something is Done
			en: "Done!",
			de: "Erledigt!",
			es: "Hecho!",
			it: "Fatto!",
			fr: "Fait!"
	},
	EMPTY_PL:{//A button to empty the elements of the music playlist
			en: "Empty playlist",
			de: "Wied.liste leeren",
			es: "Lista de reproducción vacía",
			it: "Lista del gioco vuoto",
			fr: "vide jouer liste"
	},
	EMPTY_PLAY_ALBUM:{//A button to empty playlist before playing an album
			en: "Empty playlist & play album",
			de: "Wied.liste leeren & Album abspielen",
			es: "Lista de reproducción vacía y álbum ejecutado",
			it: "Svuotare la lista di brani & giocare album",
			fr: "vide jouer liste & jeu album"
	},
	GENERAL:{//A category which describes the whole program/whole website
			en: "General",
			de: "Allgemein",
			es: "General",
			it: "Generale",
			fr: "Général"
	},
	GENRES:{//different Genres in Music or Films
			en: "Genres",
			de: "Genres",
			es: "Géneros",
			it: "Generi",
			fr: "Genres"
	},
	HELP:{//Link to Help Section
			en: "Help",
			de: "Hilfe",
			es: "Ayuda",
			it: "Guida",
			fr: "Aide"
	},
	HIBERNATE:{//hibernate the computer (deep sleep), like the option you can choose in windows instead of shutting down
			en: "Hibernate",
			de: "Ruhezustand",
			es: "estado de reposo",
			it: "Ibernazione",
			fr: "Hiberner"
	},
	HIDE_FILELINK:{//Hide in a dialog the information where the file actualy is stored
			en: "Hide filelink in popup",
			de: "Dateipfad in Popup ausblenden",
			es: "Ocultar el archivo de enlace en popup",
			it: "Nascondere file collegamento nel popup",
			fr: "Cacher fichier lien en popup"
	},
	HIDE_FLAGS:{//Hide the functions and flags about the language of the media (for example in which language the movie is spoken
			en: "Hide language/flag functions",
			de: "Sprach/Flaggen Funktionen ausblenden",
			es: "Ocultar las funciones del lenguaje/marca",
			it: "Nascondere funzioni lingua/bandiera",
			fr: "Masquer les fonctions de la langue/drapeau"
	},
	HIDE_GENRE_SELECT:{//Hide the element with which aviable genres can be selected
			en: "Hide genre selection",
			de: "Genre Auswahl ausblenden",
			es: "Ocultar selección de género",
			it: "Nascondi selezione genere",
			fr: "Masquer la sélection du genre"
	},
	HIDE_GROUP_SELECT:{//Hide the element with which addons types can be selected
			en: "Hide type selection",
			de: "Typenselektion ausblenden",
			es: "Ocultar selección de caracteres",
			it: "Nascondi selezione tipo",
			fr: "Masquer la sélection du type"
	},
	HIDE_MENU_TEXT:{//Hide the text in the menu  //TODO: check es, it und fr
			en: "Hide menu text",
			de: "Menütext ausblenden",
			es: "Ocultar texto del menú",
			it: "Nascondere il testo del menu",
			fr: "Cacher le texte de menu"
	},
	HIDE_ORIENT_NAV:{//todo: es it fr
			en: "Hide device orientation navigation switch",
			de: "Gerätelage Navigation Schalter ausblenden",
			es: "Hide device orientation navigation switch",
			it: "Hide device orientation navigation switch",
			fr: "Hide device orientation navigation switch"
	},
	HIDE_PREV_PICS:{//Setting to hide the preview pictures of medias (album cover, or movie cover)
			en: "Hide preview pictures",
			de: "Vorschaubilder ausbleden",
			es: "Ocultar imágenes previas",
			it: "Nascondere le immagini di anteprima",
			fr: "Masquer les images de prévisualisation"
	},
	HIDE_SEARCH:{//Setting to hide a searchfield (multiple times used for different searchfields)
			en: "Hide searchfield",
			de: "Suchfeld ausblenden",
			es: "Ocultar campo de búsqueda",
			it: "Nascondere il campo di ricerca",
			fr: "Masquer le champ de recherche"
	},
	HIDE_WATCHED:{//Hide movies or tv-shows which have already been watched
			en: "Hide watched movies and TV-Shows",
			de: "Gesehene Filme und Serien ausblenden",
			es: "Ocultar películas y Shows de TV ya vistos",
			it: "Nascondi guardato film e spettacoli TV",
			fr: "Masquer regardé les films et émissions de télévision"
	},
	KODI_FAVS:{//Favourties Folder of Kodi TODO fr it es
			en: "Kodi Favourites",
			de: "Kodi Favoriten",
			es: "Kodi Favoritos",
			it: "Kodi Favoriti",
			fr: "Kodi Favoris"
	},
	LANG_UNKNOWN:{//Label for the language setting TODO fr it es
			en: "Language(s) unknown",
			de: "Sprache(n) unbekannt",
			es: "Idioma desconocido",
			it: "Lingua sconosciuta",
			fr: "Langue inconnue"
	},
	LANGUAGE:{//Label for the language setting
			en: "Language",
			de: "Sprache",
			es: "Idioma",
			it: "Lingua",
			fr: "Langue"
	},
	LIB_EMPTY:{//Information when there are no Movies or there is no music in the system
			en: "Library is empty",
			de: "Sammlung ist leer",
			es: "Biblioteca vacía",
			it: "La libreria è vuota",
			fr: "La bibliothèque est vide"
	},
	LOADING:{//Information, that a list is loading (like "please wait...")
			en: "loading...",
			de: "Lädt...",
			es: "cargando...",
			it: "caricamento...",
			fr: "chargement..."
	},
	MAX_LISTLENGTH:{//Setting label, where you can set, how long a list in the interface should be maximal
			en: "Max list Length (0 for no limit):",
			de: "Maximale Listenlänge (0 für kein Limit):",
			es: "Máxima longitud de lista (0 para ningún límite):",
			it: "Elenco di massima lunghezza (0 per nessun limite):",
			fr: "Liste maximale longueur (0 pour illimité) :"
	},
	MOVIES:{
			en: "Movies",
			de: "Filme",
			es: "Películas",
			it: "Film",
			fr: "Films"
	},
	MUSIC:{
			en: "Music",
			de: "Musik",
			es: "Música",
			it: "Musica",
			fr: "Musique"
	},
	NAVIGATION:{//Navigation like you use your tv-remote to navigate through menues
			en: "Navigation",
			de: "Navigation",
			es: "Navegación",
			it: "Navigazione",
			fr: "Navigation"
	},
	NEXT:{
			en: "Next",
			de: "Nächste",
			es: "Próximo",
			it: "Prossimo",
			fr: "Prochaine"
	},
	NO_MATCH:{//Information, when there is no match found for a search
			en: "There is no matching item found",
			de: "Keine übereinstimmenden Elemente gefunden",
			es: "No hay ningun artículo encontrado que concuerde",
			it: "Non non c'è alcun corrispondente elemento trovato",
			fr: "Il n'y a aucune correspondance article trouvé"
	},
	NO_RATING:{//Rating of media, for example a movie (how good it is) TODO ES IT FR
			en: "No Rating",
			de: "Keine Bewertung",
			es: "sin Evaluación",
			it: "Nessuna Valutazione",
			fr: "Pas de Popularité"
	},
	NO_SWIPE:{//Label for setting to replace a swipefield (or touchfield) with buttons
			en: "Buttons instead of swipe area",
			de: "Zeige Knöpfe anstatt Wischfeld",
			es: "Teclas en lugar de área de contacto",
			it: "Pulsanti invece di zona swipe",
			fr: "Boutons au lieu de la zone de balayage"
	},
	OPEN_ADDON:{//TODO ES IT FR
			en: "Open Addon",
			de: "Öffne Erweiterung",
			es: "Extensión abierta",
			it: "Estensione aperta",
			fr: "Extension ouverte"
	},
	PLAY:{//Play a song, or movie
			en: "Play",
			de: "Abspielen",
			es: "Ejecutar",
			it: "Giocare",
			fr: "Jouer"
	},
	PLAY_PL:{//Play items in the playlist
			en: "Play playlist",
			de: "Wied.liste abspielen",
			es: "Reproducir lista de tocar",
			it: "riprodurre giocare elenco",
			fr: "début jouer liste"
	},
	PL_EMPTY:{//information, when the playlist has no elements
			en: "Playlist is empty",
			de: "Wied.liste ist leer",
			es: "Lista de tocar está vacía",
			it: "giocare elenco è vuota",
			fr: "jouer liste est vide"
	},
	PLAYER:{//like a media player
			en: "Player",
			de: "Player",
			es: "reproductor",
			it: "lettore",
			fr: "lecteur"
	},
	PLAYLIST:{//items in a list which has to be played
			en: "PlayList",
			de: "Wied.liste",
			es: "Lista para tocar",
			it: "giocare elenco",
			fr: "jouer liste"
	},//the next translations are help texts
	POPUP_SWIPE_1:{
			en: "Through swipe and tab gestures, you can control your Kodi. Use the grey field to do it with the following gestures:",
			de: "Durch Wisch- und Druck-Gesten kann Kodi gesteuert werden. Um dies zu tun, brauchen Sie das graue Feld mit den folgenden Gesten:",
			es: "A través de gesto de apretar y limpiar, usted puede controlar su Kodi. Utilice el campo gris para hacerlo con los siguientes gestos:",
			it: "Attraverso gesti swipe e scheda, è possibile controllare il vostro Kodi. Utilizzare il campo grigio per farlo con i seguenti movimenti:",
			fr: "À travers des gestes par balayage et onglet, vous pouvez contrôler votre Kodi. Utilisez le champ gris pour faire avec les gestes suivants:"
	},
	POPUP_SWIPE_3:{//TODO fr, es, it
			en: "Swipe up, down, left or right (according to your setting)",
			de: "Wische nach oben, unten, links oder rechts (gemäss Einstellungen)",
			es: "Deslizar hacia arriba, abajo, izquierda o derecha (de acuerdo a su entorno)",
			it: "Swipe su, giù, sinistra o destra (secondo l'impostazione)",
			fr: "Balayez vers le haut, bas, gauche ou droite (selon vos paramètres)"
	},
	POPUP_SWIPE_4:{
			en: "Tab once to select",
			de: "einmal drücken um auszuwählen",
			es: "Apretar una vez para seleccionar",
			it: "Scheda una volta per selezionare",
			fr: "Presse une fois pour sélectionner"
	},
	POPUP_SWIPE_5:{
			en: "Tab twice to go back",
			de: "zweimal drücken um zurück zu gehen",
			es: "Apretar dos veces para volver",
			it: "Premere due volte per tornare indietro",
			fr: "Presse deux fois pour revenir en arrière"
	},
	POPUP_SWIPE_6:{
			en: "Tab long for the context menu",
			de: "Lange drücken für das Kontextmenü",
			es: "Apretar para el menú de contexto",
			it: "Premere a lungo per il menu di contesto",
			fr: "Presse longtemps pour que le menu contextuel"
	},
	POPUP_SWIPE_8:{
			en: "Swipe up to stop the player",
			de: "Wische nach oben um das Abspielen zu stoppen",
			es: "limpiar hacia arriba para detener el reproductor",
			it: "Scorri fino a fermare il giocatore",
			fr: "Frapper vers le haut pour arrêter le lecteur"
	},
	POPUP_SWIPE_9:{
			en: "Swipe down for play/pause",
			de: "Wische nach unten um zu pausieren/fortzufahren",
			es: "Deslizar hacia abajo para reproducir/pausar",
			it: "Scorrere verso il basso per giocare/pausa",
			fr: "Frapper vers le bas pour jouer / pause"
	},
	POPUP_SWIPE_10:{
			en: "Swipe left for the previous item in the playlist",
			de: "Wische nach links für das vorhergehende Element in der Wied.liste",
			es: "Pase por el elemento anterior en la lista de reproducción",
			it: "Swipe da sinistra per l'elemento precedente della giocare elenco",
			fr: "Frapper vers la gauche de l'élément précédent dans la jouer liste"
	},
	POPUP_SWIPE_11:{
			en: "Swipe right for the next item in the playlist",
			de: "Wische nach rechts für das nächste Element in der Wied.liste",
			es: "Limpiar a la derecha para el siguiente elemento en la lista de reproducción",
			it: "Scorrere rapidamente verso destra per l'elemento successivo nella giocare elenco",
			fr: "Frapper vers la droit pour l'élément suivant dans la playlist"
	},
	POPUP_SWIPE_12:{
			en: "Tab once for volume down 10%",
			de: "einmal drücken um Lautstärke um 10% zu reduzieren",
			es: "Apretar una vez para bajar 10% el volumen",
			it: "Scheda una volta per volume giù 10%",
			fr: "Presse une fois pour le volume baisse de 10%"
	},
	POPUP_SWIPE_13:{
			en: "Tab twice for volume up 10%",
			de: "zweimal drücken um Lautstärke um 10% zu erhöhen",
			es: "Apretar dos veces para subir 10% el volumen",
			it: "Scheda due volte per il 10% del volume",
			fr: "Presse deux fois pour volume jusqu'à 10 %"
	},
	POPUP_SWIPE_14:{
			en: "Tab long to toggle mute",
			de: "Lange drücken um Stumm/Nicht-Stumm umzuschalten",
			es: "apretar un largo rato para alternar mudo",
			it: "Premere a lungo per attivare o disattivare il mute",
			fr: "Presse longtemps pour activer/désactiver la sourdine"
	},
	POPUP_SWIPE_15:{
			en: "In the settings you can replace this field with buttons.",
			de: "In den Einstellungen kann dieses Feld durch Knöpfe ersetzt werden.",
			es: "En la configuración puede reemplazar este campo con teclas.",
			it: "Nelle impostazioni è possibile sostituire questo campo con pulsanti.",
			fr: "Dans les paramètres, vous pouvez remplacer ce champ avec des boutons."
	},
	PREV_IMG_QUAL:{//Setting for how good the quality of pictures should be, or how much they are compressed
			en: "Preview image quality rate (can be between 10 and 95; higher is better quality):",
			de: "Vorschaubild Qualitätsrate (kann zwischen 10 und 95 sein; höher entspricht besserer Qualität):",
			es: "Tasa de calidad de imagen de vista previa (puede ser entre 10 y 95; es de mejor calidad cuanto más alta es):",
			it: "Tasso di qualità anteprima immagine (può essere compreso tra 10 e 95; maggiore è la qualità migliore):",
			fr: "Taux de qualité image aperçu (peut être entre 10 et 95 ; plus élevée est de meilleure qualité):"
	},
	QUIT:{//Close the application
			en: "Quit",
			de: "Schliessen",
			es: "Cerrar",
			it: "Smettere",
			fr: "Quitter"
	},
	RATING:{//Rating of media, for example a movie (how good it is)
			en: "Rating",
			de: "Bewertung",
			es: "Evaluación",
			it: "Valutazione",
			fr: "Popularité"
	},
	REBOOT:{//Reboot the computer (new start)
			en: "Reboot",
			de: "Neustart",
			es: "Reanudación del sistema",
			it: "Al riavvio",
			fr: "Redémarrage"
	},
	REFRESH:{//a button to refresh the playlist
			en: "Refresh",
			de: "Aktualisieren",
			es: "Actualización",
			it: "Aggiornamento",
			fr: "Actualisation"
	},
	REMOTE:{//It's like a TV Remote, where you can control it by changing channel etc.
			en: "Remote",
			de: "Fernsteuerung",
			es: "Control remoto",
			it: "Remoto",
			fr: "Téléguidage"
	},
    /* Not used right now
	REMOVE:{
			en: "Remove",
			de: "Entfernen",
			es: "retirar",
			it: "Rimuovere",
			fr: "Supprimer"
	},*/
	RUNTIME:{//play duration of the media
			en: "Runtime",
			de: "Dauer",
			es: "Duración",
			it: "Surata",
			fr: "Duree"
	},
	SAVE_CLOSE:{//a button to save settings and close the dialog
			en: "Save and close",
			de: "Speichern und schliessen",
			es: "Archivar y cerrar",
			it: "Salvare e chiudere",
			fr: "Enregistrer et fermer"
	},
	SEARCH:{
			en: "Search",
			de: "Suche",
			es: "Buscar",
			it: "Ricerca",
			fr: "Rechercher"
	},
	SEARCH_ADDON:{//search for a addon/extension of the program
			en: "Search for Addon",
			de: "Suche Erweiterung",
			es: "Buscar Extensiones",
			it: "Ricerca di estensione",
			fr: "Recherche un module complémentaire"
	},
	SEARCH_ALBUM_ARTIST:{//Helptext for a searchfield
			en: "Search for album title or artist",
			de: "Suche nach Albumtitel oder Künstler",
			es: "Buscar por título del álbum o artista",
			it: "Ricerca per artista o titolo album",
			fr: "Recherche de titre de l'album ou artiste"
	},
	SEARCH_MOVIE:{//Helptext for a searchfield
			en: "Search for movietitle",
			de: "Suche nach Filmtitel",
			es: "Búsqueda por nombre de la película",
			it: "Ricerca per titolo film",
			fr: "Recherche titre de film"
	},
	SEARCH_SONG:{//Button to go to the place where you can search for songs
			en: "Search Song",
			de: "Suche Lied",
			es: "Buscar canción",
			it: "Canzone di ricerca",
			fr: "Recherche chanson"
	},
	SEARCH_SONGTITLE:{//Helptext for a searchfield
			en: "Search for song title",
			de: "Suche nach Lied Titel",
			es: "Buscar por título de la canción",
			it: "Ricerca per titolo canzone",
			fr: "Recherche titre de chanson"
	},
	SELECT_OPTION_ALL_GENRES:{//for example movie genres
			en: "- all genres -",
			de: "- Alle Genres -",
			es: "- todos los géneros -",
			it: "- tutti i generi -",
			fr: "- tous les genres -"
	},
	SELECT_OPTION_ALL_LANGS:{
			en: "- all languages -",
			de: "- alle Sprachen -",
			es: "- todos los idiomas -",
			it: "- tutte le lingue -",
			fr: "- toutes les langues -"
	},
	SELECT_OPTION_ALL_PLUGINS:{//all plugions or addons, should be the same word as in "ADDONS" -> Plural
			en: "- all addons -",
			de: "- Alle Erweiterungen -",
			es: "- todas las extensiones -",
			it: "- tutte le estensioni -",
			fr: "- toutes les modules -"
	},
	SELECT_OPTION_OTHER:{//all others, not specified in a list
			en: "other",
			de: "andere",
			es: "otros",
			it: "altri",
			fr: "autres"
	},
	SEND_TEXT:{//send a text, a word or some words to the system
			en: "Send Text",
			de: "Text senden",
			es: "Mensaje de texto",
			it: "Inviare messaggi di testo",
			fr: "Envoyer le texte"
	},
	SERIES:{//TV-shows, series, sitcomes etc.
			en: "TV-Shows",
			de: "Serien",
			es: "TV-Shows",
			it: "TV-spettacoli",
			fr: "émission TV"
	},
	SHOW_DESCRITION:{//checkbox to turn on plot/descritions in addons //TODO it fr es
			en: "Show description",
			de: "Beschreibung anzeigen",
			es: "Mostrar descripción",
			it: "Visualizza la descrizione",
			fr: "Voir la description"
	},
	SHUTDOWN:{//shutdown (turn off) the computer
			en: "Shutdown",
			de: "Ausschalten",
			es: "Cierre",
			it: "Arresto",
			fr: "Arrêter"
	},
	SET_SWIPE_HIGHT:{//label for a setting
			en: "Set hight of swipe area. Examples: 300px, 60vh (not supported by all browsers)",
			de: "Bestimme höhe des Wischfeldes. Beispiele:  300px, 60vh (nicht bei allen Browsern unterstützt)",
			es: "Determinar la altura del campo limpio. Ejemplos: 300px, 60vh (no para todos los navegadores compatibles)",
			it: "Determinare l'altezza del campo tergicristallo. Esempio: 300px, 60vh (non per tutti i browser supportati)",
			fr: "jeu hauteur de la zone de glissement. Exemples : 300px, 60vh (ne pas de prise en charge par tous les navigateurs)"
	},
	SETTINGS:{
			en: "Settings",
			de: "Einstellungen",
			es: "Configuración",
			it: "Impostazioni",
			fr: "Paramètres"
	},
	STAY_IN_ADDON_POPUP:{//a checkbox, if checket, the popup will not be left after action //TODO fr es it
			en: "Stay in popup after opening file",
			de: "Bleibe im Popup nach Datei öffnen",
			es: "Alojarte en popup después abrir archivo",
			it: "Soggiornare nel popup dopo apertura file",
			fr: "Soggiornare nel popup dopo apertura file"
	},
    SURE_TO_DELETE:{//Dialoge to ask if it really should be deleted //TODO fr es it
			en: "Are you sure to delete?",
			de: "Möchten Sie wirklich löschen?",
			es: "Suspender",
			it: "Sospendere",
			fr: "Êtes-vous sûr de vouloir supprimer?"
	},
	SUSPEND:{//suspend the computer (sleep), like the option you can choose in windows instead of shutting down
			en: "Suspend",
			de: "Schlafmodus",
			es: "¿Seguro eliminar?",
			it: "Sei sicuro di voler eliminare?",
			fr: "Suspendre"
	},
	SWAP_SWIPE_DIRECTIONS:{//TODO es, it, fr
			en: "Swap swipe directions",
			de: "kehre Wisch richtungen",
			es: "Intercambiar direcciones de golpe",
			it: "Scambiare le direzioni swipe",
			fr: "Échanger des directions de glissement"
	},
	SWIPE_OR_PRESS:{//do a swipe gesture like on a touch field on the laptop or on a touchscreen
			en: "Swipe me or press ",
			de: "Wische oder drücke ",
			es: "Borrar o pulsar ",
			it: "Mi sfiora o premere ",
			fr: "Frappez-moi ou appuyez "
	},
	TOOLS:{//like helpers
			en: "Tools",
			de: "Werkzeuge",
			es: "Herramientas",
			it: "Strumenti",
			fr: "Outils"
	},
	TRAILER:{//a preview of a movie
			en: "Trailer",
			de: "Trailer",
			es: "Trailer",
			it: "Rimorchio",
			fr: "Annonce du film"
	},
	TURN_OFF:{//a button, when you press it, options are aviable like, shutting down computer, or let him sleep
			en: "Turn Off",
			de: "Ausschalten",
			es: "Apagar",
			it: "Spegni",
			fr: "Éteindre"
	},
	/*not used right now!
	UN_SELECT_ALL:{//select or unselect a set of choice boxes
			en: "(un-)select all",
			de: "(de-)selektiere alle",
			es: "(de-)seleccionar todo",
			it: "(de-)selezionare tutti",
			fr: "(dé-) sélectionner tous"
	},*/
	VIDEO:{
			en: "Video",
			de: "Video",
			es: "Vídeo",
			it: "Video",
			fr: "Vidéo"
	},
	VIDEO_LIB_SCAN:{//This is a button in the tools section, to scan for new content in the movie library
			en: "Video Lib: scan",
			de: "Video Sammlung: überprüfen",
			es: "Videoteca: escanear",
			it: "Videoteca: scansione",
			fr: "Vidéothèque: scan"
	},
	VIDEO_LIB_CLEAN:{//This is a button in the tools section, to clean (delete) the movie library
			en: "Video Lib: clean",
			de: "Video Sammlung: säubern",
			es: "Videoteca: borrar",
			it: "Videoteca: Pulito",
			fr: "Vidéothèque: nettoyer"
	},
	WINDOW_TITLE:{//It's the title of the browserwindow/tab name ment
			en: "Window title:",
			de: "Fenstertitel:",
			es: "Título de ventana:",
			it: "Titolo della finestra:",
			fr: "Titre de la fenêtre:"
	},
	YARC_DEMO_VID:{//play a demo video of yarc in xbmc/kodi TODO:es, it, fr
			en: "yarc demonstration video ",
			de: "yarc Demonstrations-Video (Englisch)",
			es: "video de demostración de yarc (Inglés)",
			it: "yarc video dimostrativo (inglese)",
			fr: "yarc démonstration vidéo (en anglais)"
	},
	YEAR:{
			en: "Year",
			de: "Jahr",
			es: "Año",
			it: "Anno",
			fr: "Année"
	}
}
