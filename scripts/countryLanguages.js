/**
 * Yarc - Yet another Remote Control (for Kodi)
 * Copyright (C) 2014 by Esra Kummer (esra@kummer.to)
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
var countrycodes = [
	{ "codes":[//Afghanistan
		{"code":"[AF]"},
		{"code":"_AF"}
	], "language":"Dari/Pashto", "flagpath": "AF" },
	{ "codes":[
		{"code":"[AL]"},
		{"code":"_AL"}
	], "language":"Albanian", "flagpath": "AL" },
	{ "codes":[//Armenia
		{"code":"[AM]"},
		{"code":"_AM"}
	], "language":"Armenian", "flagpath": "AM" },
	{ "codes":[//Kosovo
		{"code":"[AQ]"},
		{"code":"_AQ"}
	], "language":"Albanian", "flagpath": "AQ" },
	{ "codes":[//Austria
		{"code":"[AT]"},
		{"code":"_AT"}
	], "language":"Austrian German", "flagpath": "AT" },
	{ "codes":[//Azerbaijan
		{"code":"[AZ]"},
		{"code":"_AZ"}
	], "language":"Azerbaijani", "flagpath": "AZ" },
	{ "codes":[//Bangladesh
		{"code":"[BD]"},
		{"code":"_BD"}
	], "language":"Bengali", "flagpath": "BD" },
	{ "codes":[//Burkina Faso
		{"code":"[BF]"},
		{"code":"_BF"}
	], "language":"Fula/Jula/other from Burkina Faso", "flagpath": "BF" },
	{ "codes":[//Bulgaria
		{"code":"[BG]"},
		{"code":"_BG"}
	], "language":"Bulgarian", "flagpath": "BG" },
	{ "codes":[//Burundi
		{"code":"[BI]"},
		{"code":"_BI"}
	], "language":"Kirundi", "flagpath": "BI" },
	{ "codes":[//Brunei
		{"code":"[BN]"},
		{"code":"_BN"}
	], "language":"Malay", "flagpath": "BN" },
	{ "codes":[//Bolivia
		{"code":"[BO]"},
		{"code":"_BO"}
	], "language":"Aymara/Quechua", "flagpath": "BO" },
	{ "codes":[//Brazil
		{"code":"[BR]"},
		{"code":"_BR"}
	], "language":"Brasilian Language", "flagpath": "BR" },
	{ "codes":[//Bhutan
		{"code":"[BT]"},
		{"code":"_BT"}
	], "language":"Dzongkha", "flagpath": "BT" },
	{ "codes":[//Botswana
		{"code":"[BW]"},
		{"code":"_BW"}
	], "language":"Tswana", "flagpath": "BW" },
	{ "codes":[//Belarus
		{"code":"[BY]"},
		{"code":"_BY]"}
	], "language":"Belarusian", "flagpath": "BY" },
	{ "codes":[//Belize
		{"code":"[BZ]"},
		{"code":"_BZ"}
	], "language":"Kriol", "flagpath": "BZ" },
	{ "codes":[//Canada
		{"code":"[CA]"},
		{"code":"_CA"}
	], "language":"Canadian native language", "flagpath": "CA" },
	{ "codes":[//Democratic Republic of the Congo
		{"code":"[CD]"},
		{"code":"_CD"}
	], "language":"Lingala/Kikongo/Swahili/Tshiluba", "flagpath": "CD" },
	{ "codes":[//Central African Republic
		{"code":"[CF]"},
		{"code":"_CF"}
	], "language":"Sango", "flagpath": "CF" },
	{ "codes":[//Republic of the Congo
		{"code":"[CG]"},
		{"code":"_CG"}
	], "language":"Lingala/Munukutuba", "flagpath": "CG" },
	{ "codes":[//Switzerland
		{"code":"[CH]"},
		{"code":"_CH"}
	], "language":"Swissgerman", "flagpath": "CH" },
	{ "codes":[//China
		{"code":"[CN]"},
		{"code":"_CN"}
	], "language":"Mandarin or other chinese language", "flagpath": "CN" },
	{ "codes":[//Columbia
		{"code":"[CO]"},
		{"code":"_CO"}
	], "language":"Columbian native language", "flagpath": "CO" },
	{ "codes":[//Cap Verde
		{"code":"[CV]"},
		{"code":"_CV"}
	], "language":"Cape Verdean Creole", "flagpath": "CV" },
	{ "codes":[//Czech Republic
		{"code":"[CZ]"},
		{"code":"_CZ"}
	], "language":"Czech", "flagpath": "CZ" },
	{ "codes":[//Germany
		{"code":"[DE]"}, 
		{"code":"_DE"}, 
		{"code":"[Ger]"}, 
		{"code":"_Ger"}, 
		{"code":"[GER]"}, 
		{"code":"_GER"}, 
		{"code":".German."}, 
		{"code":".german."}, 
		{"code":"_German"}, 
		{"code":"_GERMAN"}, 
		{"code":".GERMAN."}
	], "language":"German", "flagpath": "DE" },
	{ "codes":[//Denmark
		{"code":"[DK]"},
		{"code":"_DK"}
	], "language":"Danish/Faroese/Kalaallisut", "flagpath": "DK" },
	{ "codes":[//Algeria
		{"code":"[DZ]"}, 
		{"code":"_DZ"}
	], "language":"Tamazight", "flagpath": "DZ" },
	{ "codes":[//Ecuador
		{"code":"[EC]"},
		{"code":"_EC"}
	], "language":"Quechua/Kichwa/Shuar", "flagpath": "EC" },
	{ "codes":[//Estonia
		{"code":"[EE]"},
		{"code":"_EE"}
	], "language":"Estonian", "flagpath": "EE" },
	{ "codes":[//Egypt
		{"code":"[EG]"},
		{"code":"_EG"}
	], "language":"Coptic", "flagpath": "EG" },
	{ "codes":[//USA, Great Britan, England and others
		{"code":"[US]"},
		{"code":"_US]"},
		{"code":"[GB]"},
		{"code":"_GB]"},
		{"code":"[UK]"},
		{"code":"_UK]"},
		{"code":"[EN]"},
		{"code":"_EN]"},
		{"code":".ENG."},
		{"code":"(Eng)"},
		{"code":"[Eng]"}
	], "language":"English", "flagpath": "GB" },
	{ "codes":[//Eritrea
		{"code":"[ER]"},
		{"code":"_ER"}
	], "language":"Tigrinya", "flagpath": "ER" },
	{ "codes":[//Spain
		{"code":"[ES]"},
		{"code":"_ES"}
	], "language":"Spanish", "flagpath": "ES" },
	{ "codes":[//Ethiopia
		{"code":"[ET]"},
		{"code":"_ET"}
	], "language":"Amharic", "flagpath": "ET" },
	{ "codes":[//Finland
		{"code":"[FI]"},
		{"code":"_FI"}
	], "language":"Finnish/Sami", "flagpath": "FI" },
	{ "codes":[//Fiji
		{"code":"[FJ]"},
		{"code":"_FJ"}
	], "language":"Fijian/Hindustani", "flagpath": "FJ" },
	{ "codes":[//Federated States of Micronesia
		{"code":"[FM]"},
		{"code":"_FM"}
	], "language":"Chuukese/Kosraean/Pohnpeian/Ulithian/Yapese", "flagpath": "FM" },
	{ "codes":[//France
		{"code":"[FR]"}, 
		{"code":"_FR"}, 
		{"code":".French."}, 
		{"code":".FRENCH."}
	], "language":"French", "flagpath": "FR" },
	{ "codes":[//Georgia
		{"code":"[GE]"},
		{"code":"_GE"}
	], "language":"Georgian", "flagpath": "GE" },
	{ "codes":[//Ghana
		{"code":"[GH]"},
		{"code":"_GH"}
	], "language":"Ghanaian Language", "flagpath": "GH" },
	{ "codes":[//Guinea
		{"code":"[GN]"},
		{"code":"_GN"}
	], "language":"Fula/Maninka/Susu", "flagpath": "GN" },
	{ "codes":[
		{"code":"[GR]"},
		{"code":"_GR"}
	], "language":"Greek", "flagpath": "GR" },
	{ "codes":[//Guyana
		{"code":"[GY]"},
		{"code":"_GY"}
	], "language":"Guyanese Creole", "flagpath": "GY" },
	{ "codes":[//Honduras
		{"code":"[HN]"},
		{"code":"_HN"}
	], "language":"Garifuna/Miskito", "flagpath": "HN" },
	{ "codes":[//Croatia
		{"code":"[HR]"},
		{"code":"_HR"}
	], "language":"Croatian", "flagpath": "HR" },
	{ "codes":[//Haiti
		{"code":"[HT]"},
		{"code":"_HT"}
	], "language":"Haitian Creole", "flagpath": "HT" },
	{ "codes":[//Hungary
		{"code":"[HU]"},
		{"code":"_HU"}
	], "language":"Hungarian", "flagpath": "HU" },
	{ "codes":[//Indonesia
		{"code":"[ID]"},
		{"code":"_ID"}
	], "language":"Indonesian", "flagpath": "ID" },
	{ "codes":[//Republic of Ireland
		{"code":"[IE]"},
		{"code":"_IE"}
	], "language":"Irish", "flagpath": "IE" },
	{ "codes":[//Israel
		{"code":"_IL"},
		{"code":"[IL]"}
	], "language":"Hebrew", "flagpath": "IL" },
	{ "codes":[//India / Hindi
		{"code":"[IN]"},
		{"code":"_IN"},
		{"code":"_Hindi_"},
		{"code":"_HINDI_"},
		{"code":"[HINDI]"},
		{"code":"[Hindi]"}
	], "language":"Hindi/other indian language", "flagpath": "IN" },
	{ "codes":[//Iraq
		{"code":"[IQ]"},
		{"code":"_IQ"}
	], "language":"Kurdish/Assyrian Neo-Aramaic/Iraqi Turkmen", "flagpath": "IQ" },
	{ "codes":[//Iran
		{"code":"[IR]"},
		{"code":"_IR"}
	], "language":"Persian", "flagpath": "IR" },
	{ "codes":[//Iceland
		{"code":"[IS]"},
		{"code":"_IS"}
	], "language":"Icelandic", "flagpath": "IS" },
	{ "codes":[//Italy
		{"code":"[IT]"},
		{"code":"_IT"}
	], "language":"Italian", "flagpath": "IT" },
	{ "codes":[//Japan
		{"code":"[JP]"},
		{"code":"_JP"}
	], "language":"Japanese", "flagpath": "JP" },
	{ "codes":[//Kenya
		{"code":"[KE]"},
		{"code":"_KE"}
	], "language":"Swahili", "flagpath": "KE" },
	{ "codes":[//Kyrgyzstan
		{"code":"[KG]"},
		{"code":"_KG"}
	], "language":"Kirghiz", "flagpath": "KG" },
	{ "codes":[//Cambodia
		{"code":"[KH]"},
		{"code":"_KH"}
	], "language":"Khmer", "flagpath": "KH" },
	{ "codes":[//Kiribati
		{"code":"[KI]"},
		{"code":"_KI"}
	], "language":"Kiribati", "flagpath": "KI" },
	{ "codes":[//Comoros
		{"code":"[KM]"},
		{"code":"_KM"}
	], "language":"Comorian", "flagpath": "KM" },
	{ "codes":[//Korea
		{"code":"[KR]"},
		{"code":"_KR"}
	], "language":"Korean", "flagpath": "KR" },
	{ "codes":[//Kazakhstan
		{"code":"[KZ]"},
		{"code":"_KZ"}
	], "language":"Kazakh", "flagpath": "KZ" },
	{ "codes":[//Laos
		{"code":"[LA]"},
		{"code":"_LA"}
	], "language":"Lao", "flagpath": "LA" },
	{ "codes":[//Sri Lanka
		{"code":"[LK]"},
		{"code":"_LK"}
	], "language":"Sinhala/Tamil", "flagpath": "LK" },
	{ "codes":[//Lithuania
		{"code":"[LT]"},
		{"code":"_LT"}
	], "language":"Lithuanian", "flagpath": "LT" },
	{ "codes":[//Lesotho
		{"code":"[LS]"},
		{"code":"_LS"}
	], "language":"Sotho", "flagpath": "LS" },
	{ "codes":[//Luxembourg
		{"code":"[LU]"},
		{"code":"_LU"}
	], "language":"Luxembourgish", "flagpath": "LU" },
	{ "codes":[//Latvia
		{"code":"[LV]"},
		{"code":"_LV"}
	], "language":"Latvian", "flagpath": "LV" },
	{ "codes":[//Morocco
		{"code":"[MA]"},
		{"code":"_MA"}
	], "language":"Tamazight", "flagpath": "MA" },
	{ "codes":[//Moldova
		{"code":"[MD]"},
		{"code":"_MD"}
	], "language":"Romanian/Gagauz", "flagpath": "MD" },
	{ "codes":[//Montenegro
		{"code":"[ME]"},
		{"code":"_ME"}
	], "language":"Montenegrin", "flagpath": "ME" },
	{ "codes":[//Madagascar
		{"code":"[MG]"},
		{"code":"_MG"}
	], "language":"Malagasy", "flagpath": "MG" },
	{ "codes":[//Marshall Islands
		{"code":"[MH]"},
		{"code":"_MH"}
	], "language":"Marshallese", "flagpath": "MH" },
	{ "codes":[//Macedonia
		{"code":"[MK]"},
		{"code":"_MK"}
	], "language":"Macedonian", "flagpath": "MK" },
	{ "codes":[//Mali
		{"code":"[ML]"},
		{"code":"_ML"}
	], "language":"Tamazight", "flagpath": "ML" },
	{ "codes":[//Myanmar
		{"code":"[MM]"},
		{"code":"_MM"}
	], "language":"Burmese", "flagpath": "MM" },
	{ "codes":[//Mongolia
		{"code":"[MN]"},
		{"code":"_MN"}
	], "language":"Mongolian", "flagpath": "MN" },
	{ "codes":[//Mauritania
		{"code":"[MR]"},
		{"code":"_MR"}
	], "language":"Fula/Soninke/Wolof", "flagpath": "MR" },
	{ "codes":[//Malta
		{"code":"[MT]"},
		{"code":"_MT"}
	], "language":"Maltese", "flagpath": "MT" },
	{ "codes":[//Maldives
		{"code":"[MV]"},
		{"code":"_MV"}
	], "language":"Dhivehi", "flagpath": "MV" },
	{ "codes":[//Malawi
		{"code":"[MW]"},
		{"code":"_MW"}
	], "language":"Chichewa", "flagpath": "MW" },
	{ "codes":[//Malaysia
		{"code":"[MY]"},
		{"code":"_MY"}
	], "language":"Malaysian", "flagpath": "MY" },
	{ "codes":[//Namibia
		{"code":"[NA]"},
		{"code":"_NA"}
	], "language":"Afrikaans/Oshiwambo", "flagpath": "NA" },
	{ "codes":[//Niger
		{"code":"[NE]"},
		{"code":"_NE"}
	], "language":"Hausa/Fulfulde/Gulmancema/Kanuri/Zarma/Tamazight", "flagpath": "NE" },
	{ "codes":[//Nigeria
		{"code":"[NG]"},
		{"code":"_NG"}
	], "language":"Hausa/Yoruba/Igbo", "flagpath": "NG" },
	{ "codes":[//Netherlands
		{"code":"[NL]"},
		{"code":"_NL"}
	], "language":"Dutch/West Frisian/Limburgish/Low Saxon/Papiamento", "flagpath": "NL" },
	{ "codes":[//Norway 
		{"code":"[NO]"},
		{"code":"_NO"}
	], "language":"Norwegian/Sami/Kven/Romani/Scandoromani", "flagpath": "NL" },
	{ "codes":[//Nepal
		{"code":"[NP]"},
		{"code":"_NP"}
	], "language":"Nepali", "flagpath": "NP" },
	{ "codes":[//Nauru
		{"code":"[NR]"},
		{"code":"_NR"}
	], "language":"Nauruan", "flagpath": "NR" },
	{ "codes":[//New Zealand
		{"code":"[NZ]"},
		{"code":"_NZ"}
	], "language":"Maori/Tokelauan/Niuean", "flagpath": "NZ" },
	{ "codes":[//Peru
		{"code":"[PE]"},
		{"code":"_PE"}
	], "language":"Aymara/Quechua/other peruvian language", "flagpath": "PE" },
	{ "codes":[//Papua New Guinea
		{"code":"[PG]"},
		{"code":"_PG"}
	], "language":"Hiri Motu/Tok Pisin", "flagpath": "PG" },
	{ "codes":[//Philippines
		{"code":"[PH]"},
		{"code":"_PH"}
	], "language":"Filipino language", "flagpath": "PH" },
	{ "codes":[//Pakistan
		{"code":"[PK]"},
		{"code":"_PK"}
	], "language":"Urdu/Sindhi/other pakistani language", "flagpath": "PK" },
	{ "codes":[//Poland
		{"code":"[PL]"},
		{"code":"_PL"}
	], "language":"Polish/Kashubian", "flagpath": "PL" },
	{ "codes":[//
		{"code":"[PT]"},
		{"code":"_PT"}
	], "language":"Portuguese", "flagpath": "PT" },
	{ "codes":[//Palau
		{"code":"[PW]"},
		{"code":"_PW"}
	], "language":"Palauan/Sonsorolese/Tobian", "flagpath": "PW" },
	{ "codes":[//Paraguay
		{"code":"[PY]"},
		{"code":"_PY"}
	], "language":"Guaraní", "flagpath": "PY" },
	{ "codes":[//Romania
		{"code":"[RO]"},
		{"code":"_RO"}
	], "language":"Romanian", "flagpath": "RO" },
	{ "codes":[//Serbia
		{"code":"[RS]"},
		{"code":"_RS"}
	], "language":"Serbian", "flagpath": "RS" },
	{ "codes":[//Russia
		{"code":"[RU]"},
		{"code":"_RU"}
	], "language":"Russian", "flagpath": "RU" },
	{ "codes":[//Rwanda
		{"code":"[RW]"},
		{"code":"_RW"}
	], "language":"Kinyarwanda", "flagpath": "RW" },
	{ "codes":[//Seychelles
		{"code":"[SC]"},
		{"code":"_SC"}
	], "language":"Seychellois Creole", "flagpath": "SC" },
	{ "codes":[//Sweden
		{"code":"[SE]"},
		{"code":"_SE"}
	], "language":"Swedish/Meänkieli/Sami", "flagpath": "SE" },
	{ "codes":[//Slovenia
		{"code":"[SI]"},
		{"code":"_SI"}
	], "language":"Slovene", "flagpath": "SI" },
	{ "codes":[//Slovakia
		{"code":"[SK]"},
		{"code":"_SK"}
	], "language":"Slovak", "flagpath": "SK" },
	{ "codes":[//Senegal
		{"code":"[SN]"},
		{"code":"_SN"}
	], "language":"Jola-Fogny/Mandinka/Pulaar/Serer/Wolof", "flagpath": "SN" },
	{ "codes":[//Somalia
		{"code":"[SO]"},
		{"code":"_SO"}
	], "language":"Somali", "flagpath": "SO" },
	{ "codes":[//Swaziland
		{"code":"[SZ]"},
		{"code":"_SZ"}
	], "language":"Swazi", "flagpath": "SZ" },
	{ "codes":[//Thailand
		{"code":"[TH]"},
		{"code":"_TH"}
	], "language":"Thai", "flagpath": "TH" },
	{ "codes":[//Tajikistan
		{"code":"[TJ]"},
		{"code":"_TJ"}
	], "language":"Tajik", "flagpath": "TJ" },
	{ "codes":[//East Timor
		{"code":"[TL]"},
		{"code":"_TL"}
	], "language":"Tetum", "flagpath": "TL" },
	{ "codes":[//Turkmenistan
		{"code":"[TM]"},
		{"code":"_TM"}
	], "language":"Turkmen", "flagpath": "TM" },
	{ "codes":[//Tonga
		{"code":"[TO]"},
		{"code":"_TO"}
	], "language":"Tongan", "flagpath": "TO" },
	{ "codes":[//Turkey
		{"code":"[TR]"},
		{"code":"_TR"}
	], "language":"Turkish", "flagpath": "TR" },
	{ "codes":[//Tuvalu
		{"code":"[TV]"},
		{"code":"_TV"}
	], "language":"Tuvaluan", "flagpath": "TV" },
	{ "codes":[//Tanzania
		{"code":"[TZ]"},
		{"code":"_TZ"}
	], "language":"Swahili", "flagpath": "TZ" },
	{ "codes":[//Ukraine
		{"code":"[UA]"},
		{"code":"_UA"}
	], "language":"Ukrainian", "flagpath": "UA" },
	{ "codes":[//Uganda
		{"code":"[UG]"},
		{"code":"_UG"}
	], "language":"Swahili", "flagpath": "UG" },
	{ "codes":[//Uzbekistan
		{"code":"[UZ]"},
		{"code":"_UZ"}
	], "language":"Uzbek", "flagpath": "UZ" },
	{ "codes":[//Vanuatu
		{"code":"[VU]"},
		{"code":"_VU"}
	], "language":"Bislama", "flagpath": "VU" },
	{ "codes":[//Vietnam
		{"code":"[VN]"},
		{"code":"_VN"}
	], "language":"Vietnamese", "flagpath": "VN" },
	{ "codes":[//Samoa
		{"code":"[WS]"},
		{"code":"_WS"}
	], "language":"Samoan", "flagpath": "WS" },
	{ "codes":[//South Africa
		{"code":"[ZA]"},
		{"code":"_ZA"}
	], "language":"Afrikaans/ other south african language", "flagpath": "ZA" },
	{ "codes":[//Zimbabwe
		{"code":"[ZW]"},
		{"code":"_ZW"}
	], "language":"Zimbabwean language", "flagpath": "ZW"  },
	/*
	 * 
	 * Languages here not tied to a nationality
	 * 
	 * */
	{ "codes":[ //Arabic countries without other local language
		{"code":"[Arabic]"}, 
		{"code":"_Arabic"}, 
		{"code":"[ARABIC]"}, 
		{"code":"ARABIC"}, 
		{"code":"[arabic]"},  
		{"code":"_arabic"}
	], "language":"Arabic", "flagpath": "Arab" },
	{ "codes":[//Catalan (Andorra and Spain)
		{"code":"[CATALAN]"},
		{"code":"_CATALAN"},
		{"code":".CATALAN."}
	], "language":"Catalan", "flagpath": "Catalonia" },
	{ "codes":[//
		{"code":"[LATIN]"},
		{"code":"_LATIN"},
		{"code":".LATIN."}
	], "language":"Latin", "flagpath": "VA" }
];

/*
 * [AF][AL][AM][AQ][AT][AZ][BD][BF][BG][BI][BN][BO][BR][BT][BW][BY][BZ][CA][CD][CF][CG][CH][CN][CO][CV][CZ][DE][DK][DZ][EC][EE][EG][US][ER][ES][ET][FI][FJ][FM]
[FR[GE][GH][GN][GR][GY][HN][HR][HT][HU][ID][IE][IL][IN][IQ][IR][IS][IT][JP][KE][KG][KH][KI][KM][KR][KZ][LA][LK][LT][LS][LU][LV][MA][MD][ME][MG][MH][MK]
[ML][MM][MN][MR][MT][MV][MW][MY][NA][NE][NG][NL][NO][NP][NR][NZ][PE][PG][PH][PK][PL][PT][PW][PY][RO]RS][RU][RW][SC][SE][SI][SK][SN][SO][SZ][TH][TJ][TL]
[TM][TO][TR][TV][TZ][UA][UG][UZ][VU][VN][WS][ZA][ZW][Arabic][CATALAN][LATIN]
*/
