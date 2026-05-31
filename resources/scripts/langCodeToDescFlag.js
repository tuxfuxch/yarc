/*
 * Yarc - Yet another Remote Control (for Kodi)
 * Copyright (C) 2019 by Esra Kummer and partially ZHAW-T Winterthur
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

/* Numbers as of 2014 */

var langCodeToDescFlag = {
	"aar":{   
        //the right ISO 639-2 code. if the entry is already in 3 char's, it's the same, in 
        //case it is with 2 chars or there are multiple ISO 639-2 code, 
        //it points to the bibliographic ISO 639-2 code to make a relation
		"iso639_2":"aar", 
        //English name of the language
		"english":"Afar",
        //the language in it's own tongue, if known, else it's english
		"native":"Afaraf",
        //the filename of the flag without fileending (ex. .svg or .png), some languages
        //do not have a flag, in that case it is an flag with a question mark
		"flag":"dj"
	},
	"aa":{
		"iso639_2":"aar",
		"english":"Afar",
		"native":"Afaraf",
		"flag":"dj"
	},
	"abk":{
		"iso639_2":"abk",
		"english":"Abkhazian",
		"native":"Abkhazian",
		"flag":"no-file"
	},
	"ab":{
		"iso639_2":"abk",
		"english":"Abkhazian",
		"native":"Abkhazian",
		"flag":"abkhazia"
	},
	"ace":{
		"iso639_2":"ace",
		"english":"Achinese",
		"native":"Achinese",
		"flag":"id"
	},
	"ach":{
		"iso639_2":"ach",
		"english":"Acoli",
		"native":"Acoli",
		"flag":"id"
	},
	"ada":{
		"iso639_2":"ada",
		"english":"Adangme",
		"native":"Adangme",
		"flag":"gh"
	},
	"ady":{
		"iso639_2":"ady",
		"english":"Adygei/Adyghe",
		"native":"Adygei/Adyghe",
		"flag":"adygea"
	},
	"afa":{
		"iso639_2":"afa",
		"english":"Afro-Asiatic Languages",
		"native":"Afro-Asiatic Languages",
		"flag":"no-file"
	},
	"afh":{
		"iso639_2":"afh",
		"english":"Afrihili",
		"native":"Afrihili",
		"flag":"conlang"
	},
	"afr":{
		"iso639_2":"afr",
		"english":"Afrikaans",
		"native":"Afrikaans",
		"flag":"za"
	},
	"af":{
		"iso639_2":"afr",
		"english":"Afrikaans",
		"native":"Afrikaans",
		"flag":"za"
	},
	"ain":{
		"iso639_2":"ain",
		"english":"Ainu",
		"native":"Ainu",
		"flag":"jp"
	},
	"aka":{
		"iso639_2":"aka",
		"english":"Akan",
		"native":"Akan",
		"flag":"gh"
	},
	"ak":{
		"iso639_2":"aka",
		"english":"Akan",
		"native":"Akan",
		"flag":"gh"
	},
	"akk":{
		"iso639_2":"akk",
		"english":"Akkadian",
		"native":"Akkadian",
		"flag":"no-file"
	},
	"alb":{
		"iso639_2":"alb",
		"english":"Albanian",
		"native":"Shqip",
		"flag":"al"
	},
	"sqi":{
		"iso639_2":"alb",
		"english":"Albanian",
		"native":"Shqip",
		"flag":"al"
	},
	"sq":{
		"iso639_2":"alb",
		"english":"Albanian",
		"native":"Shqip",
		"flag":"al"
	},
	"ale":{
		"iso639_2":"ale",
		"english":"Aleut",
		"native":"Aleut",
		"flag":"kamchatka_krai"
	},
	"alg":{
		"iso639_2":"alg",
		"english":"Algonquian Languages",
		"native":"Algonquian Languages",
		"flag":"indalo_symbol"
	},
	"alt":{
		"iso639_2":"alt",
		"english":"Southern Altai",
		"native":"Southern Altai",
		"flag":"altai_republic"
	},
	"amh":{
		"iso639_2":"amh",
		"english":"Amharic",
		"native":"Amharic",
		"flag":"et"
	},
	"am":{
		"iso639_2":"amh",
		"english":"Amharic",
		"native":"Amharic",
		"flag":"et"
	},
	"ang":{
		"iso639_2":"ang",
		"english":"English Old (ca.450-1100)",
		"native":"English Old (ca.450-1100)",
		"flag":"gb"
	},
	"anp":{
		"iso639_2":"anp",
		"english":"Angika",
		"native":"Angika",
		"flag":"in"
	},
	"apa":{
		"iso639_2":"apa",
		"english":"Apache Languages",
		"native":"Apache Languages",
		"flag":"indalo_symbol"
	},
	"ara":{
		"iso639_2":"ara",
		"english":"Arabic",
		"native":"العربية",
		"flag":"arab"
	},
	"ar":{
		"iso639_2":"ara",
		"english":"Arabic",
		"native":"العربية",
		"flag":"arab"
	},
	"arc":{
		"iso639_2":"arc",
		"english":"Aramaic (700-300 BCE)",
		"native":"Aramaic (700-300 BCE)",
		"flag":"no-file"
	},
	"arg":{
		"iso639_2":"arg",
		"english":"Aragonese",
		"native":"Aragonés",
		"flag":"aragon"
	},
	"an":{
		"iso639_2":"arg",
		"english":"Aragonese",
		"native":"Aragonés",
		"flag":"aragon"
	},
	"arm":{
		"iso639_2":"arm",
		"english":"Armenian",
		"native":"Հայերեն",
		"flag":"am"
	},
	"hye":{
		"iso639_2":"arm",
		"english":"Armenian",
		"native":"Հայերեն",
		"flag":"am"
	},
	"hy":{
		"iso639_2":"arm",
		"english":"Armenian",
		"native":"Հայերեն",
		"flag":"am"
	},
	"arn":{
		"iso639_2":"arn",
		"english":"Mapuche/Mapudungun",
		"native":"Mapuche/Mapudungun",
		"flag":"cl"
	},
	"arp":{
		"iso639_2":"arp",
		"english":"Arapaho",
		"native":"Arapaho",
		"flag":"arapaho"
	},
	"art":{
		"iso639_2":"art",
		"english":"Artificial Languages",
		"native":"Artificial Languages",
		"flag":"conlang" 
	},
	"arw":{
		"iso639_2":"arw",
		"english":"Arawak",
		"native":"Arawak",
		"flag":"indalo_symbol"
	},
	"asm":{
		"iso639_2":"asm",
		"english":"Assamese",
		"native":"অসমীয়া",
		"flag":"in"
	},
	"as":{
		"iso639_2":"asm",
		"english":"Assamese",
		"native":"অসমীয়া",
		"flag":"in"
	},
	"ast":{
		"iso639_2":"ast",
		"english":"Asturian/Asturleonese/Bable/Leonese",
		"native":"Asturian/Asturleonese/Bable/Leonese",
		"flag":"asturias"
	},
	"ath":{
		"iso639_2":"ath",
		"english":"Athapascan Languages",
		"native":"Athapascan Languages",
		"flag":"indalo_symbol"
	},
	"aus":{
		"iso639_2":"aus",
		"english":"Australian Languages",
		"native":"Australian Languages",
		"flag":"au"
	},
	"ava":{
		"iso639_2":"ava",
		"english":"Avaric",
		"native":"Aвар мацӀ/магӀарул мацӀ",
		"flag":"dagestan"
	},
	"av":{
		"iso639_2":"ava",
		"english":"Avaric",
		"native":"Aвар мацӀ/магӀарул мацӀ",
		"flag":"dagestan"
	},
	"ave":{
		"iso639_2":"ave",
		"english":"Avestan",
		"native":"Avesta",
		"flag":"ir"
	},
	"ae":{
		"iso639_2":"ave",
		"english":"Avestan",
		"native":"Avesta",
		"flag":"ir"
	},
	"awa":{
		"iso639_2":"awa",
		"english":"Awadhi",
		"native":"Awadhi",
		"flag":"in"
	},
	"aym":{
		"iso639_2":"aym",
		"english":"Aymara",
		"native":"Aymar Aru",
		"flag":"indalo_symbol"
	},
	"ay":{
		"iso639_2":"aym",
		"english":"Aymara",
		"native":"Aymar Aru",
		"flag":"indalo_symbol"
	},
	"aze":{
		"iso639_2":"aze",
		"english":"Azerbaijani",
		"native":"Azərbaycan Dili",
		"flag":"az"
	},
	"az":{
		"iso639_2":"aze",
		"english":"Azerbaijani",
		"native":"Azərbaycan Dili",
		"flag":"az"
	},
	"bad":{
		"iso639_2":"bad",
		"english":"Banda Languages",
		"native":"Banda Languages",
		"flag":"cf"
	},
	"bai":{
		"iso639_2":"bai",
		"english":"Bamileke Languages",
		"native":"Bamileke Languages",
		"flag":"cm"
	},
	"bak":{
		"iso639_2":"bak",
		"english":"Bashkir",
		"native":"башҡорт теле",
		"flag":"bashkortostan"
	},
	"ba":{
		"iso639_2":"bak",
		"english":"Bashkir",
		"native":"башҡорт теле",
		"flag":"bashkortostan"
	},
	"bal":{
		"iso639_2":"bal",
		"english":"Baluchi",
		"native":"Baluchi",
		"flag":"pk"
	},
	"bam":{
		"iso639_2":"bam",
		"english":"Bambara",
		"native":"Bamanankan",
		"flag":"ml"
	},
	"bm":{
		"iso639_2":"bam",
		"english":"Bambara",
		"native":"Bamanankan",
		"flag":"ml"
	},
	"ban":{
		"iso639_2":"ban",
		"english":"Balinese",
		"native":"Balinese",
		"flag":"id"
	},
	"baq":{
		"iso639_2":"baq",
		"english":"Basque",
		"native":"Euskara/Euskera",
		"flag":"basque_country"
	},
	"eus":{
		"iso639_2":"baq",
		"english":"Basque",
		"native":"Euskara/Euskera",
		"flag":"basque_country"
	},
	"eu":{
		"iso639_2":"baq",
		"english":"Basque",
		"native":"Euskara/Euskera",
		"flag":"basque_country"
	},
	"bas":{
		"iso639_2":"bas",
		"english":"Basa",
		"native":"Basa",
		"flag":"ng"
	},
	"bat":{
		"iso639_2":"bat",
		"english":"Baltic Languages",
		"native":"Baltic Languages",
		"flag":"lt"
	},
	"bej":{
		"iso639_2":"bej",
		"english":"Bedawiyet/Beja",
		"native":"البجا",
		"flag":"er"
	},
	"bel":{
		"iso639_2":"bel",
		"english":"Belarusian",
		"native":"Беларуская",
		"flag":"by"
	},
	"be":{
		"iso639_2":"bel",
		"english":"Belarusian",
		"native":"Беларуская",
		"flag":"by"
	},
	"bem":{
		"iso639_2":"bem",
		"english":"Bemba",
		"native":"Bemba",
		"flag":"zm"
	},
	"ben":{
		"iso639_2":"ben",
		"english":"Bengali",
		"native":"বাংলা",
		"flag":"bd"
	},
	"bn":{
		"iso639_2":"ben",
		"english":"Bengali",
		"native":"বাংলা",
		"flag":"bd"
	},
	"ber":{
		"iso639_2":"ber",
		"english":"Berber Languages",
		"native":"Tamaziɣt / Tamazight",
		"flag":"ma"
	},
	"bho":{
		"iso639_2":"bho",
		"english":"Bhojpuri",
		"native":"भोजपुरी bhōjapurī",
		"flag":"np"
	},
	"bih":{
		"iso639_2":"bih",
		"english":"Bihari Languages",
		"native":"Bihari Languages",
		"flag":"in"
	},
	"bh":{
		"iso639_2":"bih",
		"english":"Bihari Languages",
		"native":"Bihari Languages",
		"flag":"in"
	},
	"bik":{
		"iso639_2":"bik",
		"english":"Bikol",
		"native":"Bikol",
		"flag":"ph"
	},
	"bin":{
		"iso639_2":"bin",
		"english":"Bini/Edo",
		"native":"江戸",
		"flag":"jp"
	},
	"bis":{
		"iso639_2":"bis",
		"english":"Bislama",
		"native":"Bislama",
		"flag":"vu"
	},
	"bi":{
		"iso639_2":"bis",
		"english":"Bislama",
		"native":"Bislama",
		"flag":"vu"
	},
	"bla":{
		"iso639_2":"bla",
		"english":"Siksika",
		"native":"Siksika",
		"flag":"ca"
	},
	"bnt":{
		"iso639_2":"bnt",
		"english":"Bantu (Other)",
		"native":"Bantu (Other)",
		"flag":"cm"
	},
	"bos":{
		"iso639_2":"bos",
		"english":"Bosnian",
		"native":"Bosanski / босански",
		"flag":"ba"
	},
	"bs":{
		"iso639_2":"bos",
		"english":"Bosnian",
		"native":"Bosanski / босански",
		"flag":"ba"
	},
	"bra":{
		"iso639_2":"bra",
		"english":"Braj",
		"native":"ब्रज भाषा / ਬ੍ਰਜ ਭਾਸ਼ਾ",
		"flag":"in"
	},
	"bre":{
		"iso639_2":"bre",
		"english":"Breton",
		"native":"Brezhoneg",
		"flag":"brittany"
	},
	"br":{
		"iso639_2":"bre",
		"english":"Breton",
		"native":"Brezhoneg",
		"flag":"brittany"
	},
	"btk":{
		"iso639_2":"btk",
		"english":"Batak Languages",
		"native":"Batak Languages",
		"flag":"id"
	},
	"bua":{
		"iso639_2":"bua",
		"english":"Buriat",
		"native":"буряад хэлэн / buryaad khelen",
		"flag":"buryatia"
	},
	"bug":{
		"iso639_2":"bug",
		"english":"Buginese",
		"native":"Basa Ugi",
		"flag":"id"
	},
	"bul":{
		"iso639_2":"bul",
		"english":"Bulgarian",
		"native":"български език",
		"flag":"bg"
	},
	"bg":{
		"iso639_2":"bul",
		"english":"Bulgarian",
		"native":"български език",
		"flag":"bg"
	},
	"bur":{
		"iso639_2":"bur",
		"english":"Burmese",
		"native":"မြန်မာစကား",
		"flag":"mm"
	},
	"mya":{
		"iso639_2":"bur",
		"english":"Burmese",
		"native":"မြန်မာစကား",
		"flag":"mm"
	},
	"my":{
		"iso639_2":"bur",
		"english":"Burmese",
		"native":"မြန်မာစကား",
		"flag":"mm"
	},
	"byn":{
		"iso639_2":"byn",
		"english":"Bilin/Blin",
		"native":"Bilin/Blin",
		"flag":"er"
	},
	"cad":{
		"iso639_2":"cad",
		"english":"Caddo",
		"native":"Hasí:nay",
		"flag":"us"
	},
	"cai":{
		"iso639_2":"cai",
		"english":"Central American Indian Languages",
		"native":"Central American Indian Languages",
		"flag":"indalo_symbol"
	},
	"car":{
		"iso639_2":"car",
		"english":"Galibi Carib",
		"native":"Kaliña",
		"flag":"ve"
	},
	"cat":{
		"iso639_2":"cat",
		"english":"Catalan/Valencian",
		"native":"Català",
		"flag":"catalonia"
	},
	"ca":{
		"iso639_2":"cat",
		"english":"Catalan/Valencian",
		"native":"Català",
		"flag":"catalonia"
	},
	"cau":{
		"iso639_2":"cau",
		"english":"Caucasian Languages",
		"native":"Caucasian Languages",
		"flag":"no-file"
	},
	"ceb":{
		"iso639_2":"ceb",
		"english":"Cebuano",
		"native":"Bisaya, Sinugboanon, Binisaya nga Sugboanon",
		"flag":"ph"
	},
	"cel":{
		"iso639_2":"cel",
		"english":"Celtic Languages",
		"native":"Celtic Languages",
		"flag":"no-file"
	},
	"cha":{
		"iso639_2":"cha",
		"english":"Chamorro",
		"native":"Fino' Chamorro",
		"flag":"guam"
	},
	"ch":{
		"iso639_2":"cha",
		"english":"Chamorro",
		"native":"Fino' Chamorro",
		"flag":"guam"
	},
	"chb":{
		"iso639_2":"chb",
		"english":"Chibcha",
		"native":"Muisca / Muysccubun",
		"flag":"co"
	},
	"che":{
		"iso639_2":"che",
		"english":"Chechen",
		"native":"Нохчийн мотт / Noxčiyn mott / نَاخچیین موٓتت / ნახჩიჲნ მუოთთ",
		"flag":"chechen_republic"
	},
	"ce":{
		"iso639_2":"che",
		"english":"Chechen",
		"native":"Нохчийн мотт / Noxčiyn mott / نَاخچیین موٓتت / ნახჩიჲნ მუოთთ",
		"flag":"chechen_republic"
	},
    //language extinct
	"chg":{
		"iso639_2":"chg",
		"english":"Chagatai",
		"native":"جغتای Jağatāy",
		"flag":"no-file"
	},
	"chi":{
		"iso639_2":"chi",
		"english":"Chinese",
		"native":"中文 (Zhōngwén)/汉语/漢語",
		"flag":"cn"
	},
	"zho":{
		"iso639_2":"chi",
		"english":"Chinese",
		"native":"中文 (Zhōngwén)/汉语/漢語",
		"flag":"cn"
	},
	"zh":{
		"iso639_2":"chi",
		"english":"Chinese",
		"native":"中文 (Zhōngwén)/汉语/漢語",
		"flag":"cn"
	},
	"chk":{
		"iso639_2":"chk",
		"english":"Chuukese",
		"native":"Trukese",
		"flag":"fm"
	},
	"chm":{
		"iso639_2":"chm",
		"english":"Mari",
		"native":"марий йылме marij jəlme",
		"flag":"mari_el"
	},
    //Native speakers: <1000
	"chn":{
		"iso639_2":"chn",
		"english":"Chinook Jargon",
		"native":"Chinuk wawa, wawa, chinook lelang, lelang",
		"flag":"indalo_symbol"
	},
    //Native speakers: <100'000
	"cho":{
		"iso639_2":"cho",
		"english":"Choctaw",
		"native":"Chahta'",
		"flag":"us"
	},
    //Native speakers: <100'000
	"chp":{
		"iso639_2":"chp",
		"english":"Chipewyan/Dene Suline",
		"native":"Dënesųłiné",
		"flag":"northwest_territories"
	},
    //Native speakers: <100'000
	"chr":{
		"iso639_2":"chr",
		"english":"Cherokee",
		"native":"ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ, Tsalagi Gawonihisdi",
		"flag":"cherokee_nation"
	},
    //Native speakers: none;  Slavic liturgical language 
	"chu":{
		"iso639_2":"chu",
		"english":"Old/Church Slavic/Bulgarian",
		"native":"Old/Church Slavic/Bulgarian",
		"flag":"no-file"
	},
    //Native speakers: none;  Slavic liturgical language 
	"cu":{
		"iso639_2":"chu",
		"english":"Old/Church Slavic/Bulgarian",
		"native":"Old/Church Slavic/Bulgarian",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"chv":{
		"iso639_2":"chv",
		"english":"Chuvash",
		"native":"чӑваш чӗлхи",
		"flag":"chuvashia"
	},
    //Native speakers: <10'000'000
	"cv":{
		"iso639_2":"chv",
		"english":"Chuvash",
		"native":"чӑваш чӗлхи",
		"flag":"chuvashia"
	},
    //Native speakers: < 10'000
	"chy":{
		"iso639_2":"chy",
		"english":"Cheyenne",
		"native":"Cheyenne",
		"flag":"indalo_symbol"
	},
    //Native speakers: < 10'000'000
	"cmc":{
		"iso639_2":"cmc",
		"english":"Chamic Languages",
		"native":"Chamic Languages",
		"flag":"id"
	},
    //liturgical language of the Coptic Church
	"cop":{
		"iso639_2":"cop",
		"english":"Coptic",
		"native":"Coptic",
		"flag":"eg"
	},
    //extinct
	"cor":{
		"iso639_2":"cor",
		"english":"Cornish",
		"native":"Kernowek / Kernewek",
		"flag":"cornwall"
	},
    //extinct
	"kw":{
		"iso639_2":"cor",
		"english":"Cornish",
		"native":"Kernowek / Kernewek",
		"flag":"cornwall"
	},
    //Native speakers: < 1'000'000 
	"cos":{
		"iso639_2":"cos",
		"english":"Corsican",
		"native":"Corsu / Lingua corsa",
		"flag":"corsica"
	},
    //Native speakers: < 1'000'000
	"co":{
		"iso639_2":"cos", 
		"english":"Corsican",
		"native":"Corsu / Lingua corsa",
		"flag":"corsica"
	},
	"cpe":{
		"iso639_2":"cpe",
		"english":"Creoles And Pidgins/English Based",
		"native":"Creoles And Pidgins/English Based",
		"flag":"no-file"
	},
	"cpf":{
		"iso639_2":"cpf",
		"english":"Creoles And Pidgins/French-based",
		"native":"Creoles And Pidgins/French-based",
		"flag":"no-file"
	},
	"cpp":{
		"iso639_2":"cpp",
		"english":"Creoles And Pidgins/Portuguese-based",
		"native":"Creoles And Pidgins/Portuguese-based",
		"flag":"no-file"
	},
	"cre":{
		"iso639_2":"cre",
		"english":"Cree",
		"native":"Cree",
		"flag":"indalo_symbol"
	},
	"cr":{
		"iso639_2":"cre",
		"english":"Cree",
		"native":"Cree",
		"flag":"indalo_symbol"
	},
    //TODO to asign a flag is too political right now
	"crh":{
		"iso639_2":"crh",
		"english":"Crimean Tatar/Crimean Turkish",
		"native":"Crimean Tatar/Crimean Turkish",
		"flag":"no-file"
	},
	"crp":{
		"iso639_2":"crp",
		"english":"Creoles And Pidgins",
		"native":"Creoles And Pidgins",
		"flag":"no-file"
	},
    //Native speakers: <1'000'000
	"csb":{
		"iso639_2":"csb",
		"english":"Kashubian",
		"native":"Kaszëbsczi jãzëk",
		"flag":"pomeranian_voivodeship"
	},
	"cus":{
		"iso639_2":"cus",
		"english":"Cushitic Languages",
		"native":"Cushitic Languages",
		"flag":"no-file"
	},
	"cze":{
		"iso639_2":"cze",
		"english":"Czech",
		"native":"česky/čeština",
		"flag":"cz"
	},
	"ces":{
		"iso639_2":"cze",
		"english":"Czech",
		"native":"česky/čeština",
		"flag":"cz"
	},
	"cs":{
		"iso639_2":"cze",
		"english":"Czech",
		"native":"česky/čeština",
		"flag":"cz"
	},
    //Native speakers: <100'000
	"dak":{
		"iso639_2":"dak",
		"english":"Dakota",
		"native":"Dakhótiyapi / Dakȟótiyapi",
		"flag":"us"
	},
	"dan":{
		"iso639_2":"dan",
		"english":"Danish",
		"native":"Dansk",
		"flag":"dk"
	},
	"da":{
		"iso639_2":"dan",
		"english":"Danish",
		"native":"Dansk",
		"flag":"dk"
	},
    //Native speakers: <1'000'000
	"dar":{
		"iso639_2":"dar", 
		"english":"Dargwa",
		"native":"дарган мез / dargan mez",
		"flag":"dagestan"
	},
	"day":{
		"iso639_2":"day",
		"english":"Land Dayak Languages",
		"native":"Bidayuh",
		"flag":"my"
	},
    //Native speakers: <1000
	"del":{
		"iso639_2":"del",
		"english":"Delaware",
		"native":"Delaware",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1000
	"den":{
		"iso639_2":"den",
		"english":"Slave (Athapascan)",
		"native":"Dene K'e",
		"flag":"northwest_territories"
	},
    //Native speakers: unknown to me
	"dgr":{
		"iso639_2":"dgr",
		"english":"Dogrib",
		"native":"Tłı̨chǫ",
		"flag":"northwest_territories"
	},
    //Native speakers: <10'000'000
	"din":{
		"iso639_2":"din",
		"english":"Dinka",
		"native":"Thuɔŋjäŋ",
		"flag":"dinka"
	},
    //Native speakers: <1'000'000
	"div":{
		"iso639_2":"div",
		"english":"Dhivehi/Divehi/Maldivian",
		"native":"Dhivehi/Divehi/Maldivian",
		"flag":"mv"
	},
    //Native speakers: <1'000'000
	"dv":{
		"iso639_2":"div",
		"english":"Dhivehi/Divehi/Maldivian",
		"native":"Dhivehi/Divehi/Maldivian",
		"flag":"mv"
	},
    //Native speakers: <10'000'000
	"doi":{
		"iso639_2":"doi",
		"english":"Dogri",
		"native":"डोगरी / ڈوگرى / ḍogrī",
		"flag":"jammu-kashmir"
	},
	"dra":{
		"iso639_2":"dra",
		"english":"Dravidian Languages",
		"native":"Dravidian Languages",
		"flag":"in"
	},
    //Native speakers: <10'000
	"dsb":{
		"iso639_2":"dsb",
		"english":"Lower Sorbian",
		"native":"Dolnoserbski / Dolnoserbšćina",
		"flag":"brandenburg"
	},
    //Native speakers: <10'000'000
	"dua":{
		"iso639_2":"dua",
		"english":"Duala",
		"native":"Duala",
		"flag":"cm"
	},
    //extinct
	"dum":{
		"iso639_2":"dum",
		"english":"Dutch Middle (ca.1050-1350)",
		"native":"Dutch Middle (ca.1050-1350)",
		"flag":"nl"
	},
	"dut":{
		"iso639_2":"nld",
		"english":"Dutch/Flemish",
		"native":"Dutch/Flemish",
		"flag":"nl"
	},
	"nld":{
		"iso639_2":"nld",
		"english":"Dutch/Flemish",
		"native":"Dutch/Flemish",
		"flag":"nl"
	},
	"nl":{
		"iso639_2":"nld",
		"english":"Dutch/Flemish",
		"native":"Dutch/Flemish",
		"flag":"nl"
	},
	"dyu":{
		"iso639_2":"dyu",
		"english":"Dyula",
		"native":"Julakan",
		"flag":"bf"
	},
    //Native speakers: <1'000'000
	"dzo":{
		"iso639_2":"dzo",
		"english":"Dzongkha",
		"native":"Dzongkha",
		"flag":"bt"
	},
    //Native speakers: <1'000'000
	"dz":{
		"iso639_2":"dzo",
		"english":"Dzongkha",
		"native":"Dzongkha",
		"flag":"bt"
	},
    //Native speakers: <1'000'000
	"efi":{
		"iso639_2":"efi",
		"english":"Efik",
		"native":"Efik",
		"flag":"ng"
	},
    //extinct
	"egy":{
		"iso639_2":"egy",
		"english":"Egyptian (Ancient)",
		"native":"Egyptian (Ancient)",
		"flag":"eg"
	},
    //Native speakers: <100'000
	"eka":{
		"iso639_2":"eka",
		"english":"Ekajuk",
		"native":"Ekajuk",
		"flag":"ng"
	},
    //extinct
	"elx":{
		"iso639_2":"elx",
		"english":"Elamite",
		"native":"Elamite",
		"flag":"no-file"
	},
	"eng":{
		"iso639_2":"eng",
		"english":"English",
		"native":"English",
		"flag":"gb"
	},
	"en":{
		"iso639_2":"eng",
		"english":"English",
		"native":"English",
		"flag":"gb"
	},
	"enm":{
		"iso639_2":"enm",
		"english":"English Middle (1100-1500)",
		"native":"English Middle (1100-1500)",
		"flag":"gb"
	},
    //Native speakers: <1'000'000
	"epo":{
		"iso639_2":"epo",
		"english":"Esperanto",
		"native":"Esperanto",
		"flag":"esperanto"
	},
    //Native speakers: <1'000'000
	"eo":{
		"iso639_2":"epo",
		"english":"Esperanto",
		"native":"Esperanto",
		"flag":"no-file"
	},
	"est":{
		"iso639_2":"est",
		"english":"Estonian",
		"native":"Eesti/Eesti Keel",
		"flag":"ee"
	},
	"et":{
		"iso639_2":"est",
		"english":"Estonian",
		"native":"Eesti/Eesti Keel",
		"flag":"ee"
	},
    //Native speakers: <10'000'000
	"ewe":{
		"iso639_2":"ewe",
		"english":"Ewe",
		"native":"Eʋegbe",
		"flag":"gh"
	},
    //Native speakers: <10'000'000
	"ee":{
		"iso639_2":"ewe",
		"english":"Ewe",
		"native":"Eʋegbe",
		"flag":"gh"
	},
    //Native speakers: <1'000'000
	"ewo":{
		"iso639_2":"ewo",
		"english":"Ewondo",
		"native":"Kolo",
		"flag":"cm"
	},
    //Native speakers: <10'000'000
	"fan":{
		"iso639_2":"fan",
		"english":"Fang",
		"native":"Pangwe",
		"flag":"gq"
	},
    //Native speakers: <100'000
	"fao":{
		"iso639_2":"fao",
		"english":"Faroese",
		"native":"Føroyskt",
		"flag":"fo"
	},
    //Native speakers: <100'000
	"fo":{
		"iso639_2":"fao",
		"english":"Faroese",
		"native":"Føroyskt",
		"flag":"fo"
	},
    //Native speakers: <10'000'000
	"fat":{
		"iso639_2":"fat",
		"english":"Fanti",
		"native":"Fanti",
		"flag":"gh"
	},
    //Native speakers: <1'000'000
	"fij":{
		"iso639_2":"fij",
		"english":"Fijian",
		"native":"Vosa Vakaviti",
		"flag":"fj"
	},
    //Native speakers: <1'000'000
	"fj":{
		"iso639_2":"fij",
		"english":"Fijian",
		"native":"Vosa Vakaviti",
		"flag":"fj"
	},
	"fil":{
		"iso639_2":"fil",
		"english":"Filipino/Pilipino",
		"native":"Filipino/Pilipino",
		"flag":"ph"
	},
	"fin":{
		"iso639_2":"fin",
		"english":"Finnish",
		"native":"Suomen Kieli/Suomi",
		"flag":"fi"
	},
	"fi":{
		"iso639_2":"fin",
		"english":"Finnish",
		"native":"Suomen Kieli/Suomi",
		"flag":"fi"
	},
	"fiu":{
		"iso639_2":"fiu",
		"english":"Finno-Ugrian Languages",
		"native":"Finno-Ugrian Languages",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"fon":{
		"iso639_2":"fon",
		"english":"Fon",
		"native":"Fon gbè",
		"flag":"bj"
	},
	"fre":{
		"iso639_2":"fre",
		"english":"French",
		"native":"Français",
		"flag":"fr"
	},
	"fra":{
		"iso639_2":"fre",
		"english":"French",
		"native":"Français",
		"flag":"fr"
	},
	"fr":{
		"iso639_2":"fre",
		"english":"French",
		"native":"Français",
		"flag":"fr"
	},
    //extinct
	"frm":{
		"iso639_2":"frm",
		"english":"French Middle (ca.1400-1600)",
		"native":"French Middle (ca.1400-1600)",
		"flag":"fr"
	},
    //extinct
	"fro":{
		"iso639_2":"fro",
		"english":"French Old (842-ca.1400)",
		"native":"French Old (842-ca.1400)",
		"flag":"fr"
	},
    //Native speakers: <100'000
	"frr":{
		"iso639_2":"frr",
		"english":"Northern Frisian",
		"native":"Frasch / Fresk / Freesk / Friisk",
		"flag":"kreis_nordfriesland"
	},
    //Native speakers: <100'000
	"frs":{
		"iso639_2":"frs",
		"english":"Eastern Frisian",
		"native":"Seeltersk",
		"flag":"no-file"
	},
    //Native speakers: <1'000'000
	"fry":{
		"iso639_2":"fry",
		"english":"Western Frisian",
		"native":"Frysk",
		"flag":"frisian"
	},
    //Native speakers: <1'000'000
	"fy":{
		"iso639_2":"fry",
		"english":"Western Frisian",
		"native":"Frysk",
		"flag":"frisian"
	},
	"ful":{
		"iso639_2":"ful",
		"english":"Fulah",
		"native":"Fulani, Peul",
		"flag":"ng"
	},
	"ff":{
		"iso639_2":"ful",
		"english":"Fulah",
		"native":"Fulani, Peul",
		"flag":"ng"
	},
    //Native speakers: <1'000'000
	"fur":{
		"iso639_2":"fur",
		"english":"Friulian",
		"native":"Furlan",
		"flag":"friuli"
	},
    //Native speakers: <1'000'000
	"gaa":{
		"iso639_2":"gaa",
		"english":"Ga",
		"native":"Gã",
		"flag":"gh"
	},
    //Native speakers: <100'000
	"gay":{
		"iso639_2":"gay",
		"english":"Gayo",
		"native":"Gayo",
		"flag":"id"
	},
	"gba":{
		"iso639_2":"gba",
		"english":"Gbaya",
		"native":"Gbaya / Manza / Ngbaka",
		"flag":"cf"
	},
	"gem":{
		"iso639_2":"gem",
		"english":"Germanic Languages",
		"native":"Germanic Languages",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"geo":{
		"iso639_2":"geo",
		"english":"Georgian",
		"native":"ქართული",
		"flag":"ge"
	},
    //Native speakers: <10'000'000
	"kat":{
		"iso639_2":"geo",
		"english":"Georgian",
		"native":"ქართული",
		"flag":"ge"
	},
    //Native speakers: <10'000'000
	"ka":{
		"iso639_2":"geo",
		"english":"Georgian",
		"native":"ქართული",
		"flag":"ge"
	},
	"ger":{
		"iso639_2":"ger",
		"english":"German",
		"native":"Deutsch",
		"flag":"de"
	},
	"deu":{
		"iso639_2":"ger",
		"english":"German",
		"native":"Deutsch",
		"flag":"de"
	},
	"de":{
		"iso639_2":"ger",
		"english":"German",
		"native":"Deutsch",
		"flag":"de"
	},
    //only used for liturgy of the Ethiopian Orthodox Tewahedo Church
	"gez":{
		"iso639_2":"gez",
		"english":"Geez",
		"native":"Gəʿəz",
		"flag":"no-file"
	},
    //Native speakers: <1'000'000
	"gil":{
		"iso639_2":"gil",
		"english":"Gilbertese",
		"native":"Taetae ni Kiribati",
		"flag":"ki"
	},
    //Native speakers: <1'000'000
	"gla":{
		"iso639_2":"gla",
		"english":"Gaelic/Scottish Gaelic",
		"native":"Gàidhlig",
		"flag":"scot"
	},
    //Native speakers: <1'000'000
	"gd":{
		"iso639_2":"gla",
		"english":"Gaelic/Scottish Gaelic",
		"native":"Gàidhlig",
		"flag":"scot"
	},
    //Native speakers: <1'000'000
	"gle":{
		"iso639_2":"gle",
		"english":"Irish",
		"native":"Gaeilge",
		"flag":"ie"
	},
    //Native speakers: <1'000'000
	"ga":{
		"iso639_2":"gle",
		"english":"Irish",
		"native":"Gaeilge",
		"flag":"ie"
	},
    //Native speakers: <10'000'000
	"glg":{
		"iso639_2":"glg",
		"english":"Galician",
		"native":"Galego",
		"flag":"galicia"
	},
    //Native speakers: <10'000'000
	"gl":{
		"iso639_2":"glg",
		"english":"Galician",
		"native":"Galego",
		"flag":"galicia"
	},
    // Extinct as a first language
	"glv":{
		"iso639_2":"glv",
		"english":"Manx",
		"native":"Gaelg / Gailck",
		"flag":"no-file"
	},
    //extinct as a first language
	"gv":{
		"iso639_2":"glv",
		"english":"Manx",
		"native":"Gaelg / Gailck",
		"flag":"no-file"
	},
    //extinct
	"gmh":{
		"iso639_2":"gmh",
		"english":"German Middle High (ca.1050-1500)",
		"native":"German Middle High (ca.1050-1500)",
		"flag":"no-file"
	},
    //extinct
	"goh":{
		"iso639_2":"goh",
		"english":"German Old High (ca.750-1050)",
		"native":"German Old High (ca.750-1050)",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"gon":{
		"iso639_2":"gon",
		"english":"Gondi",
		"native":"Gondi",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"gor":{
		"iso639_2":"gor",
		"english":"Gorontalo",
		"native":"Gorontalo",
		"flag":"id"
	},
    //extinct
	"got":{
		"iso639_2":"got",
		"english":"Gothic",
		"native":"Gothic",
		"flag":"no-file"
	},
    //Native speakers: <1'000'000
	"grb":{
		"iso639_2":"grb",
		"english":"Grebo",
		"native":"Grebo",
		"flag":"lr"
	},
    //extinct
	"grc":{
		"iso639_2":"grc",
		"english":"Greek Ancient (to 1453)",
		"native":"Ἑλληνική Hellēnikḗ",
		"flag":"gr"
	},
	"gre":{
		"iso639_2":"gre",
		"english":"Greek Modern (1453-)",
		"native":"ελληνικά",
		"flag":"gr"
	},
	"ell":{
		"iso639_2":"gre",
		"english":"Greek Modern (1453-)",
		"native":"ελληνικά",
		"flag":"gr"
	},
	"el":{
		"iso639_2":"gre",
		"english":"Greek Modern (1453-)",
		"native":"ελληνικά",
		"flag":"gr"
	},
    //Native speakers: <10'000'000
	"grn":{
		"iso639_2":"grn",
		"english":"Guarani",
		"native":"Guarani",
		"flag":"py"
	},
    //Native speakers: <10'000'000
	"gn":{
		"iso639_2":"grn",
		"english":"Guarani",
		"native":"Guarani",
		"flag":"py"
	},
	"gsw":{
		"iso639_2":"gsw",
		"english":"Alemannic/Alsatian/Swiss German",
		"native":"Schwiizerdütsch",
		"flag":"ch"
	},
	"guj":{
		"iso639_2":"guj",
		"english":"Gujarati",
		"native":"ગુજરાતી / Gujarātī",
		"flag":"in"
	},
	"gu":{
		"iso639_2":"guj",
		"english":"Gujarati",
		"native":"ગુજરાતી / Gujarātī",
		"flag":"in"
	},
    //Native speakers: <1'000
	"gwi":{
		"iso639_2":"gwi",
		"english":"Gwich'in",
		"native":"Gwich'in",
		"flag":"northwest_territories"
	},
    //Native speakers: <1'000
	"hai":{
		"iso639_2":"hai",
		"english":"Haida",
		"native":"X̱aat Kíl",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"hat":{
		"iso639_2":"hat",
		"english":"Haitian/Haitian Creole",
		"native":"Kreyòl Ayisyen",
		"flag":"ht"
	},
    //Native speakers: <10'000'000
	"ht":{
		"iso639_2":"hat",
		"english":"Haitian/Haitian Creole",
		"native":"Kreyòl Ayisyen",
		"flag":"ht"
	},
	"hau":{
		"iso639_2":"hau",
		"english":"Hausa",
		"native":"Hausa/هَوُسَ",
		"flag":"ne"
	},
	"ha":{
		"iso639_2":"hau",
		"english":"Hausa",
		"native":"Hausa/هَوُسَ",
		"flag":"ne"
	},
    //Native speakers: <100'000
	"haw":{
		"iso639_2":"haw",
		"english":"Hawaiian",
		"native":"Hawaiian",
		"flag":"hi"
	},
	"heb":{
		"iso639_2":"heb",
		"english":"Hebrew",
		"native":"Hebrew",
		"flag":"il"
	},
	"he":{
		"iso639_2":"heb",
		"english":"Hebrew",
		"native":"Hebrew",
		"flag":"il"
	},
    //Native speakers: <1'000'000
	"her":{
		"iso639_2":"her",
		"english":"Herero",
		"native":"Otjiherero",
		"flag":"na"
	},
    //Native speakers: <1'000'000
	"hz":{
		"iso639_2":"her",
		"english":"Herero",
		"native":"Otjiherero",
		"flag":"na"
	},
    //Native speakers: <10'000'000
	"hil":{
		"iso639_2":"hil",
		"english":"Hiligaynon",
		"native":"Ilonggo /Binisaya nga Hiligaynon",
		"flag":"ph"
	},
    //Native speakers: ???
	"him":{
		"iso639_2":"him",
		"english":"Himachali Languages/Western Pahari Languages",
		"native":"Himachali Languages/Western Pahari Languages",
		"flag":"no-file"
	},
	"hin":{
		"iso639_2":"hin",
		"english":"Hindi",
		"native":"हिंदी/हिन्दी",
		"flag":"in"
	},
	"hi":{
		"iso639_2":"hin",
		"english":"Hindi",
		"native":"हिंदी/हिन्दी",
		"flag":"in"
	},
    //destinct
	"hit":{
		"iso639_2":"hit",
		"english":"Hittite",
		"native":"Hittite",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"hmn":{
		"iso639_2":"hmn",
		"english":"Hmong/Mong",
		"native":"Hmong/Mong",
		"flag":"cn"
	},
    //Native speakers: <1'000'000
	"hmo":{
		"iso639_2":"hmo",
		"english":"Hiri Motu",
		"native":"Hiri Motu",
		"flag":"pg"
	},
    //Native speakers: <1'000'000
	"ho":{
		"iso639_2":"hmo",
		"english":"Hiri Motu",
		"native":"Hiri Motu",
		"flag":"pg"
	},
	"hrv":{
		"iso639_2":"hrv",
		"english":"Croatian",
		"native":"Hrvatski",
		"flag":"hr"
	},
	"hr":{
		"iso639_2":"hrv",
		"english":"Croatian",
		"native":"Hrvatski",
		"flag":"hr"
	},
    //Native speakers: <100'000
	"hsb":{
		"iso639_2":"hsb",
		"english":"Upper Sorbian",
		"native":"Hornjoserbšćina",
		"flag":"saxony"
	},
	"hun":{
		"iso639_2":"hun",
		"english":"Hungarian",
		"native":"Magyar",
		"flag":"hu"
	},
	"hu":{
		"iso639_2":"hun",
		"english":"Hungarian",
		"native":"Magyar",
		"flag":"hu"
	},
    //Native speakers: <10'000
	"hup":{
		"iso639_2":"hup",
		"english":"Hupa",
		"native":"Na:tinixwe Mixine:whe'",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"iba":{
		"iso639_2":"iba",
		"english":"Iban",
		"native":"Jaku Iban",
		"flag":"sarawak"
	},
	"ibo":{
		"iso639_2":"ibo",
		"english":"Igbo",
		"native":"Asụsụ Igbo",
		"flag":"ng"
	},
	"ig":{
		"iso639_2":"ibo",
		"english":"Igbo",
		"native":"Asụsụ Igbo",
		"flag":"ng"
	},
	"ice":{
		"iso639_2":"ice",
		"english":"Icelandic",
		"native":"Íslenska",
		"flag":"is"
	},
	"isl":{
		"iso639_2":"ice",
		"english":"Icelandic",
		"native":"Íslenska",
		"flag":"is"
	},
	"is":{
		"iso639_2":"ice",
		"english":"Icelandic",
		"native":"Íslenska",
		"flag":"is"
	},
    //Native speakers: <1'000
	"ido":{
		"iso639_2":"ido",
		"english":"Ido",
		"native":"Ido",
		"flag":"ido"
	},
    //Native speakers: <1'000
	"io":{
		"iso639_2":"ido",
		"english":"Ido",
		"native":"Ido",
		"flag":"ido"
	},
    //Native speakers: <10'000'000
	"iii":{
		"iso639_2":"iii",
		"english":"Nuosu/Sichuan Yi",
		"native":"Nuosu/Sichuan Yi",
		"flag":"cn"
	},
    //Native speakers: <10'000'000
	"ii":{
		"iso639_2":"iii",
		"english":"Nuosu/Sichuan Yi",
		"native":"Nuosu/Sichuan Yi",
		"flag":"cn"
	},
    //Native speakers: <10'000'000
	"ijo":{
		"iso639_2":"ijo",
		"english":"Ijo Languages",
		"native":"Ịjọ",
		"flag":"ng"
	},
    //Native speakers: <100'000
	"iku":{
		"iso639_2":"iku",
		"english":"Inuktitut",
		"native":"ᐃᓄᒃᑎᑐᑦ",
		"flag":"ca"
	},
    //Native speakers: <100'000
	"iu":{
		"iso639_2":"iku",
		"english":"Inuktitut",
		"native":"ᐃᓄᒃᑎᑐᑦ",
		"flag":"ca"
	},
    //???
	"ile":{
		"iso639_2":"ile",
		"english":"Interlingue/Occidental",
		"native":"Interlingue/Occidental",
		"flag":"no-file"
	},
    //???
	"ie":{
		"iso639_2":"ile",
		"english":"Interlingue/Occidental",
		"native":"Interlingue/Occidental",
		"flag":"interlingue"
	},
    //Native speakers: <10'000'000
	"ilo":{
		"iso639_2":"ilo",
		"english":"Iloko",
		"native":"Ilocano",
		"flag":"ph"
	},
    //Native speakers: <10'000
	"ina":{
		"iso639_2":"ina",
		"english":"Interlingua (International Auxiliary Language Association)",
		"native":"Interlingua (International Auxiliary Language Association)",
		"flag":"no-file"
	},
    //Native speakers: <10'000
	"ia":{
		"iso639_2":"ina",
		"english":"Interlingua (International Auxiliary Language Association)",
		"native":"Interlingua (International Auxiliary Language Association)",
		"flag":"no-file"
	},
	"inc":{
		"iso639_2":"inc",
		"english":"Indic Languages",
		"native":"Indic Languages",
		"flag":"in"
	},
	"ind":{
		"iso639_2":"ind",
		"english":"Indonesian",
		"native":"Bahasa Indonesia",
		"flag":"id"
	},
	"id":{
		"iso639_2":"ind",
		"english":"Indonesian",
		"native":"Bahasa Indonesia",
		"flag":"id"
	},
    //extinct
	"ine":{
		"iso639_2":"ine",
		"english":"Indo-European Languages",
		"native":"Indo-European Languages",
		"flag":"no-file"
	},
    //Native speakers: <1'000'000
	"inh":{
		"iso639_2":"inh",
		"english":"Ingush",
		"native":"ГӀалгӀай мотт (Ğalğaj mott)",
		"flag":"ingushetia"
	},
    //Native speakers: <100'000
	"ipk":{
		"iso639_2":"ipk",
		"english":"Inupiaq",
		"native":"Iñupiaq / Iñupiatun",
		"flag":"alaska"
	},
    //Native speakers: <100'000
	"ik":{
		"iso639_2":"ipk",
		"english":"Inupiaq",
		"native":"Iñupiaq / Iñupiatun",
		"flag":"alaska"
	},
	"ira":{
		"iso639_2":"ira",
		"english":"Iranian Languages",
		"native":"Iranian Languages",
		"flag":"ir"
	},
	"iro":{
		"iso639_2":"iro",
		"english":"Iroquoian Languages",
		"native":"Iroquoian Languages",
		"flag":"indalo_symbol"
	},
	"ita":{
		"iso639_2":"ita",
		"english":"Italian",
		"native":"Italiano",
		"flag":"it"
	},
	"it":{
		"iso639_2":"ita",
		"english":"Italian",
		"native":"Italiano",
		"flag":"it"
	},
	"jav":{
		"iso639_2":"jav",
		"english":"Javanese",
		"native":"Basa Jawa",
		"flag":"id"
	},
	"jv":{
		"iso639_2":"jav",
		"english":"Javanese",
		"native":"Basa Jawa",
		"flag":"id"
	},
	"jbo":{
		"iso639_2":"jbo",
		"english":"Lojban",
		"native":"La .lojban.",
		"flag":"lojban"
	},
	"jpn":{
		"iso639_2":"jpn",
		"english":"Japanese",
		"native":"日本語 (にほんご／にっぽんご)",
		"flag":"jp"
	},
	"ja":{
		"iso639_2":"jpn",
		"english":"Japanese",
		"native":"日本語 (にほんご／にっぽんご)",
		"flag":"jp"
	},
    //Native speakers: <100'000
	"jpr":{
		"iso639_2":"jpr",
		"english":"Judeo-Persian",
		"native":"Jidi / Dzhidi / Djudi",
		"flag":"il"
	},
    //Native speakers: <1'000'000
	"jrb":{
		"iso639_2":"jrb",
		"english":"Judeo-Arabic",
		"native":" عربية يهودية / ערבית יהודית",
		"flag":"il"
	},
    //Native speakers: <1'000'000
	"kaa":{
		"iso639_2":"kaa",
		"english":"Kara-Kalpak",
		"native":"Qaraqalpaq tili / Қарақалпақ / тили",
		"flag":"karakalpakstan"
	},
    //Native speakers: <10'000'000
	"kab":{
		"iso639_2":"kab",
		"english":"Kabyle",
		"native":"Taqbaylit",
		"flag":"dz"
	},
    //Native speakers: <1'000'000
	"kac":{
		"iso639_2":"kac",
		"english":"Jingpho/Kachin",
		"native":"Jingpho/Kachin",
		"flag":"mm"
	},
    //Native speakers: <100'000
	"kal":{
		"iso639_2":"kal",
		"english":"Greenlandic/Kalaallisut",
		"native":"Greenlandic/Kalaallisut",
		"flag":"gl"
	},
    //Native speakers: <100'000
	"kl":{
		"iso639_2":"kal",
		"english":"Greenlandic/Kalaallisut",
		"native":"Greenlandic/Kalaallisut",
		"flag":"gl"
	},
    //??? there are different kamba languages, in different parts of the world
	"kam":{
		"iso639_2":"kam",
		"english":"Kamba",
		"native":"Kamba",
		"flag":"no-file"
	},
	"kan":{
		"iso639_2":"kan",
		"english":"Kannada",
		"native":"Kannada",
		"flag":"in"
	},
	"kn":{
		"iso639_2":"kan",
		"english":"Kannada",
		"native":"Kannada",
		"flag":"in"
	},
	"kar":{
		"iso639_2":"kar",
		"english":"Karen Languages",
		"native":"Karen Languages",
		"flag":"mm"
	},
    //Native speakers: <1'000'000
	"kas":{
		"iso639_2":"kas",
		"english":"Kashmiri",
		"native":"कॉशुर / Koshur / كأشُر  ",
		"flag":"no-file"
	},
    //Native speakers: <1'000'000
	"ks":{
		"iso639_2":"kas",
		"english":"Kashmiri",
		"native":"कॉशुर / Koshur / كأشُر  ",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"kau":{
		"iso639_2":"kau",
		"english":"Kanuri",
		"native":"Kanuri",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"kr":{
		"iso639_2":"kau",
		"english":"Kanuri",
		"native":"Kanuri",
		"flag":"no-file"
	},
    //extinct
	"kaw":{
		"iso639_2":"kaw",
		"english":"Kawi",
		"native":"Bhāṣa Kawi",
		"flag":"no-file"
	},
	"kaz":{
		"iso639_2":"kaz",
		"english":"Kazakh",
		"native":"қазақ тілі / qazaq tili / قازاق تىلى‎",
		"flag":"kz"
	},
	"kk":{
		"iso639_2":"kaz",
		"english":"Kazakh",
		"native":"қазақ тілі / qazaq tili / قازاق تىلى‎",
		"flag":"kz"
	},
    //Native speakers: <10'000'000
	"kbd":{
		"iso639_2":"kbd",
		"english":"Kabardian",
		"native":"адыгэбзэ adəgăbză / къэбэрдеибзэ",
		"flag":"kabardino-balkaria"
	},
    //Native speakers: <1'000'000
	"kha":{
		"iso639_2":"kha",
		"english":"Khasi",
		"native":"Khasi",
		"flag":"in"
	},
	"khi":{
		"iso639_2":"khi",
		"english":"Khoisan Languages",
		"native":"Khoesaan",
		"flag":"no-file"
	},
	"khm":{
		"iso639_2":"khm",
		"english":"Central Khmer",
		"native":"ភាសាខ្មែរ",
		"flag":"kh"
	},
	"km":{
		"iso639_2":"khm",
		"english":"Central Khmer",
		"native":"ភាសាខ្មែរ",
		"flag":"kh"
	},
    //extinct
	"kho":{
		"iso639_2":"kho",
		"english":"Khotanese/Sakan",
		"native":"Khotanese/Sakan",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"kik":{
		"iso639_2":"kik",
		"english":"Gikuyu/Kikuyu",
		"native":"Gĩkũyũ",
		"flag":"ke"
	},
    //Native speakers: <10'000'000
	"ki":{
		"iso639_2":"kik",
		"english":"Gikuyu/Kikuyu",
		"native":"Gĩkũyũ",
		"flag":"ke"
	},
	"kin":{
		"iso639_2":"kin",
		"english":"Kinyarwanda",
		"native":"Ikinyarwanda",
		"flag":"rw"
	},
	"rw":{
		"iso639_2":"kin",
		"english":"Kinyarwanda",
		"native":"Ikinyarwanda",
		"flag":"rw"
	},
    //Native speakers: <10'000'000
	"kir":{
		"iso639_2":"kir",
		"english":"Kirghiz/Kyrgyz",
		"native":"кыргызча / قىرعىزچا",
		"flag":"kg"
	},
    //Native speakers: <10'000'000
	"ky":{
		"iso639_2":"kir",
		"english":"Kirghiz/Kyrgyz",
		"native":"кыргызча / قىرعىزچا",
		"flag":"kg"
	},
    //language group
	"kmb":{
		"iso639_2":"kmb",
		"english":"Kimbundu",
		"native":"Kimbundu",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"kok":{
		"iso639_2":"kok",
		"english":"Konkani",
		"native":"कोंकणी",
		"flag":"in"
	},
    //Native speakers: <1'000'000
	"kom":{
		"iso639_2":"kom",
		"english":"Komi",
		"native":"коми кыв",
		"flag":"komi"
	},
    //Native speakers: <1'000'000
	"kv":{
		"iso639_2":"kom",
		"english":"Komi",
		"native":"коми кыв",
		"flag":"komi"
	},
    //Native speakers: <10'000'000
	"kon":{
		"iso639_2":"kon",
		"english":"Kongo",
		"native":"KiKongo",
		"flag":"ao"
	},
    //Native speakers: <10'000'000
	"kg":{
		"iso639_2":"kon",
		"english":"Kongo",
		"native":"KiKongo",
		"flag":"ao"
	},
	"kor":{
		"iso639_2":"kor",
		"english":"Korean",
		"native":"조선말 (朝鮮語) / 한국어 (韓國語)",
		"flag":"kr"
	},
	"ko":{
		"iso639_2":"kor",
		"english":"Korean",
		"native":"조선말 (朝鮮語) / 한국어 (韓國語)",
		"flag":"kr"
	},
    //Native speakers: <10'000
	"kos":{
		"iso639_2":"kos",
		"english":"Kosraean",
		"native":"Kosraean",
		"flag":"fm"
	},
    //Native speakers: <10'000'000
	"kpe":{
		"iso639_2":"kpe",
		"english":"Kpelle",
		"native":"Kpɛlɛwoo",
		"flag":"gn"
	},
    //Native speakers: <1'000'000
	"krc":{
		"iso639_2":"krc",
		"english":"Karachay-Balkar",
		"native":"Къарачай-Малкъар тил / Таулу тил",
		"flag":"kabardino-balkaria"
	},
    //Native speakers: <100'000
	"krl":{
		"iso639_2":"krl",
		"english":"Karelian",
		"native":"Karjala / karjal / kariela",
		"flag":"fi"
	},
    //???
	"kro":{
		"iso639_2":"kro",
		"english":"Kru Languages",
		"native":"Kru Languages",
		"flag":"lr"
	},
    //Native speakers: <10'000'000
	"kru":{
		"iso639_2":"kru",
		"english":"Kurukh",
		"native":"कुड़ुख़",
		"flag":"in"
	},
    //Native speakers: <1'000'000
	"kua":{
		"iso639_2":"kua",
		"english":"Kuanyama / Kwanyama",
		"native":"Kuanyama / Kwanyama",
		"flag":"ao"
	},
    //Native speakers: <1'000'000
	"kj":{
		"iso639_2":"kua",
		"english":"Kuanyama/Kwanyama",
		"native":"Kuanyama/Kwanyama",
		"flag":"ao"
	},
    //Native speakers: <1'000'000
	"kum":{
		"iso639_2":"kum",
		"english":"Kumyk",
		"native":"къумукъ тил / Qymyk til",
		"flag":"dagestan"
	},
	"kur":{
		"iso639_2":"kur",
		"english":"Kurdish",
		"native":"Kurdî, Kurdí, Кöрди, كوردی‎",
		"flag":"iq"
	},
	"ku":{
		"iso639_2":"kur",
		"english":"Kurdish",
		"native":"Kurdî, Kurdí, Кöрди, كوردی‎",
		"flag":"iq"
	},
    //Native speakers: <10'000
	"kut":{
		"iso639_2":"kut",
		"english":"Kutenai",
		"native":"Kutenai",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"lad":{
		"iso639_2":"lad",
		"english":"Ladino",
		"native":"Judeo-Español / גֿודֿיאו-איספאנייול / Ђудео-Еспањол",
		"flag":"il"
	},
	"lah":{
		"iso639_2":"lah",
		"english":"Lahnda",
		"native":"Lahnda",
		"flag":"pk"
	},
    //Native speakers: <1'000'000
	"lam":{
		"iso639_2":"lam",
		"english":"Lamba",
		"native":"Ichilamba",
		"flag":"zm"
	},
	"lao":{
		"iso639_2":"lao",
		"english":"Lao",
		"native":"ພາສາລາວ / phasa lao",
		"flag":"la"
	},
	"lo":{
		"iso639_2":"lao",
		"english":"Lao",
		"native":"ພາສາລາວ / phasa lao",
		"flag":"la"
	},
	"lat":{
		"iso639_2":"lat",
		"english":"Latin",
		"native":"Latin / lingua latīna",
		"flag":"va"
	},
	"la":{
		"iso639_2":"lat",
		"english":"Latin",
		"native":"Latin / lingua latīna",
		"flag":"va"
	},
    //Native speakers: <10'000'000
	"lav":{
		"iso639_2":"lav",
		"english":"Latvian",
		"native":"Latviešu Valoda",
		"flag":"lv"
	},
    //Native speakers: <10'000'000
	"lv":{
		"iso639_2":"lav",
		"english":"Latvian",
		"native":"Latviešu Valoda",
		"flag":"lv"
	},
    //Native speakers: <1'000'000
	"lez":{
		"iso639_2":"lez",
		"english":"Lezghian",
		"native":"Лезги чӏал Lezgi č’al",
		"flag":"dagestan"
	},
    //Native speakers: <10'000'000
	"lim":{
		"iso639_2":"lim",
		"english":"Limburgan / Limburger / Limburgish",
		"native":"Lèmbörgs",
		"flag":"nl"
	},
    //Native speakers: <10'000'000
	"li":{
		"iso639_2":"lim",
		"english":"Limburgan / Limburger / Limburgish",
		"native":"Lèmbörgs",
		"flag":"nl"
	},
    //Native speakers: <10'000'000
	"lin":{
		"iso639_2":"lin",
		"english":"Lingala",
		"native":"Lingála",
		"flag":"cd"
	},
    //Native speakers: <10'000'000
	"ln":{
		"iso639_2":"lin",
		"english":"Lingala",
		"native":"Lingála",
		"flag":"cd"
	},
    //Native speakers: <10'000'000
	"lit":{
		"iso639_2":"lit",
		"english":"Lithuanian",
		"native":"Lietuvių Kalba",
		"flag":"lt"
	},
    //Native speakers: <10'000'000
	"lt":{
		"iso639_2":"lit",
		"english":"Lithuanian",
		"native":"Lietuvių Kalba",
		"flag":"lt"
	},
    //Native speakers: <1'000'000
	"lol":{
		"iso639_2":"lol",
		"english":"Mongo",
		"native":"Mongo / Nkundo / Lomongo",
		"flag":"cd"
	},
    //Native speakers: <1'000'000
	"loz":{
		"iso639_2":"loz",
		"english":"Lozi",
		"native":"lozi",
		"flag":"zm"
	},
    //Native speakers: <1'000'000
	"ltz":{
		"iso639_2":"loz",
		"english":"Letzeburgesch/Luxembourgish",
		"native":"Lëtzebuergesch",
		"flag":"lu"
	},
    //Native speakers: <1'000'000
	"lb":{
		"iso639_2":"loz",
		"english":"Letzeburgesch/Luxembourgish",
		"native":"Lëtzebuergesch",
		"flag":"lu"
	},
    //Native speakers: <10'000'000
	"lua":{
		"iso639_2":"lua",
		"english":"Luba-Lulua",
		"native":"Tshiluba",
		"flag":"cd"
	},
    //Native speakers: <10'000'000
	"lub":{
		"iso639_2":"lub",
		"english":"Luba-Katanga",
		"native":"Kiluba",
		"flag":"cd"
	},
    //Native speakers: <10'000'000
	"lu":{
		"iso639_2":"lub",
		"english":"Luba-Katanga",
		"native":"Kiluba",
		"flag":"cd"
	},
    //Native speakers: <10'000'000
	"lug":{
		"iso639_2":"lug",
		"english":"Luganda",
		"native":"Oluganda",
		"flag":"buganda"
	},
    //Native speakers: <10'000'000
	"lg":{
		"iso639_2":"lug",
		"english":"Luganda",
		"native":"Oluganda",
		"flag":"buganda"
	},
    //Native speakers: <1'000
	"lui":{
		"iso639_2":"lui",
		"english":"Luiseno",
		"native":"Cham'teela",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"lun":{
		"iso639_2":"lun",
		"english":"Lunda",
		"native":"Chilunda",
		"flag":"zm"
	},
    //Native speakers: <10'000'000
	"luo":{
		"iso639_2":"luo",
		"english":"Luo (Kenya And Tanzania)",
		"native":"Dholuo",
		"flag":"ke"
	},
    //Native speakers: <1'000'000
	"lus":{
		"iso639_2":"lus",
		"english":"Lushai",
		"native":"Lushai",
		"flag":"in"
	},
    //Native speakers: <1'000'000
	"mac":{
		"iso639_2":"mac",
		"english":"Macedonian",
		"native":"македонски јазик / Makedonski jazik",
		"flag":"mk"
	},
    //Native speakers: <1'000'000
	"mkd":{
		"iso639_2":"mac",
		"english":"Macedonian",
		"native":"македонски јазик / Makedonski jazik",
		"flag":"mk"
	},
    //Native speakers: <1'000'000
	"mk":{
		"iso639_2":"mac",
		"english":"Macedonian",
		"native":"македонски јазик / Makedonski jazik",
		"flag":"mk"
	},
	"mad":{
		"iso639_2":"mad",
		"english":"Madurese",
		"native":"Madhura / Basa Mathura / بَهاسَ مَدورا",
		"flag":"id"
	},
	"mag":{
		"iso639_2":"mag",
		"english":"Magahi",
		"native":"मगही / magahī",
		"flag":"in"
	},
    //Native speakers: <100'000
	"mah":{
		"iso639_2":"mah",
		"english":"Marshallese",
		"native":"Kajin M̧ajeļ",
		"flag":"mh"
	},
    //Native speakers: <100'000
	"mh":{
		"iso639_2":"mah",
		"english":"Marshallese",
		"native":"Kajin M̧ajeļ",
		"flag":"mh"
	},
	"mai":{
		"iso639_2":"mai",
		"english":"Maithili",
		"native":"मैथिली / মৈথিলী",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"mak":{
		"iso639_2":"mak",
		"english":"Makasar",
		"native":"Basa Mangkasara'",
		"flag":"id"
	},
	"mal":{
		"iso639_2":"mal",
		"english":"Malayalam",
		"native":"മലയാളം / Malayāḷam",
		"flag":"in"
	},
	"ml":{
		"iso639_2":"mal",
		"english":"Malayalam",
		"native":"മലയാളം / Malayāḷam",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"man":{
		"iso639_2":"man",
		"english":"Mandingo",
		"native":"لغة مندنكا",
		"flag":"sn"
	},
    //Native speakers: <10'000'000
	"mao":{
		"iso639_2":"mao",
		"english":"Maori",
		"native":"Te Reo / Māori",
		"flag":"nz"
	},
    //Native speakers: <10'000'000
	"mri":{
		"iso639_2":"mao",
		"english":"Maori",
		"native":"Te Reo / Māori",
		"flag":"nz"
	},
    //Native speakers: <10'000'000
	"mi":{
		"iso639_2":"mao",
		"english":"Maori",
		"native":"Te Reo / Māori",
		"flag":"nz"
	},
    //language group
	"map":{
		"iso639_2":"map",
		"english":"Austronesian Languages",
		"native":"Austronesian Languages",
		"flag":"no-file"
	},
	"mar":{
		"iso639_2":"mar",
		"english":"Marathi",
		"native":"मराठी / मराठी Marāṭhī",
		"flag":"in"
	},
	"mr":{
		"iso639_2":"mar",
		"english":"Marathi",
		"native":"मराठी / मराठी Marāṭhī",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"mas":{
		"iso639_2":"mas",
		"english":"Masai",
		"native":"ɔl Maa",
		"flag":"masai"
	},
	"may":{
		"iso639_2":"may",
		"english":"Malay",
		"native":"Bahasa Melayu / بهاس ملايو‎",
		"flag":"my"
	},
	"msa":{
		"iso639_2":"may",
		"english":"Malay",
		"native":"Bahasa Melayu / بهاس ملايو‎",
		"flag":"my"
	},
	"ms":{
		"iso639_2":"may",
		"english":"Malay",
		"native":"Bahasa Melayu / بهاس ملايو‎",
		"flag":"my"
	},
    //Native speakers: <1'000'000
	"mdf":{
		"iso639_2":"mdf",
		"english":"Moksha",
		"native":"Мокшень кяль / mokšenj kälj",
		"flag":"mordovia"
	},
    //Native speakers: <1'000'000
	"mdr":{
		"iso639_2":"mdr",
		"english":"Mandar",
		"native":"Mandar",
		"flag":"id"
	},
    //Native speakers: <10'000'000
	"men":{
		"iso639_2":"men",
		"english":"Mende",
		"native":"Mɛnde yia",
		"flag":"sl"
	},
    //extinct
	"mga":{
		"iso639_2":"mga",
		"english":"Irish Middle (900-1200)",
		"native":"Irish Middle (900-1200)",
		"flag":"no-file"
	},
    //Native speakers: <10'000
	"mic":{
		"iso639_2":"mic",
		"english":"Mi'kmaq/Micmac",
		"native":"Míkmawísimk",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"min":{
		"iso639_2":"min",
		"english":"Minangkabau",
		"native":"Baso Minangkabau / باسو مينڠكاباو",
		"flag":"id"
	},
	"mis":{
		"iso639_2":"mis",
		"english":"Uncoded Languages",
		"native":"Uncoded Languages",
		"flag":"no-file"
	},
    //language group
	"mkh":{
		"iso639_2":"mkh",
		"english":"Mon-Khmer Languages",
		"native":"Mon-Khmer Languages",
		"flag":"no-file"
	},
	"mlg":{
		"iso639_2":"mlg",
		"english":"Malagasy",
		"native":"Malagasy Fiteny",
		"flag":"mg"
	},
	"mg":{
		"iso639_2":"mlg",
		"english":"Malagasy",
		"native":"Malagasy Fiteny",
		"flag":"mg"
	},
    //Native speakers: <1'000'000
	"mlt":{
		"iso639_2":"mlt",
		"english":"Maltese",
		"native":"Malti",
		"flag":"mt"
	},
    //Native speakers: <1'000'000
	"mt":{
		"iso639_2":"mlt",
		"english":"Maltese",
		"native":"Malti",
		"flag":"mt"
	},
    //Native speakers: <1'000
	"mnc":{
		"iso639_2":"mnc",
		"english":"Manchu",
		"native":"manju gisun",
		"flag":"cn"
	},
    //Native speakers: <10'000'000
	"mni":{
		"iso639_2":"mni",
		"english":"Manipuri",
		"native":"Manipuri / মৈতৈলোন্",
		"flag":"in"
	},
    //Native speakers: ???
	"mno":{
		"iso639_2":"mno",
		"english":"Manobo Languages",
		"native":"Banobo",
		"flag":"ph"
	},
    //Native speakers: <10'000
	"moh":{
		"iso639_2":"moh",
		"english":"Mohawk",
		"native":"Kanien’kéha'",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"mon":{
		"iso639_2":"mon",
		"english":"Mongolian",
		"native":"Mongɣol kele / Монгол хэл",
		"flag":"mn"
	},
    //Native speakers: <10'000'000
	"mn":{
		"iso639_2":"mon",
		"english":"Mongolian",
		"native":"Mongɣol kele / Монгол хэл",
		"flag":"mn"
	},
    //Native speakers: <10'000'000
	"mos":{
		"iso639_2":"mos",
		"english":"Mossi",
		"native":"Mõõré",
		"flag":"bf"
	},
	"mul":{
		"iso639_2":"mul",
		"english":"Multiple Languages",
		"native":"Multiple Languages",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"mun":{
		"iso639_2":"mun",
		"english":"Munda Languages",
		"native":"Munda Languages",
		"flag":"in"
	},
    //Native speakers: <10'000
	"mus":{
		"iso639_2":"mus",
		"english":"Creek",
		"native":"Seminole / Mvskoke",
		"flag":"us"
	},
    //Native speakers: <100'000
	"mwl":{
		"iso639_2":"mwl",
		"english":"Mirandese",
		"native":"Mirandés",
		"flag":"pt"
	},
	"mwr":{
		"iso639_2":"mwr",
		"english":"Marwari",
		"native":"मारवाड़ी",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"myn":{
		"iso639_2":"myn",
		"english":"Mayan Languages",
		"native":"Mayan Languages",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"myv":{
		"iso639_2":"myv",
		"english":"Erzya",
		"native":"eŕźań keĺ / эрзянь кель",
		"flag":"mordovia"
	},
    //Native speakers: <10'000'000
	"nah":{
		"iso639_2":"nah",
		"english":"Nahuatl Languages",
		"native":"Aztecan / Nahuatl Languages",
		"flag":"indalo_symbol"
	},
    //Native speakers: ???
	"nai":{
		"iso639_2":"nai",
		"english":"North American Indian Languages",
		"native":"North American Indian Languages",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"nap":{
		"iso639_2":"nap",
		"english":"Neapolitan",
		"native":"Napulitano",
		"flag":"it"
	},
    //Native speakers: <10'000
	"nar":{
		"iso639_2":"nar",
		"english":"Guta (Iguta)",
		"native":"Naraguta(wa)",
		"flag":"ng"
	},
	"nau":{
		"iso639_2":"nau",
		"english":"Nauru",
		"native":"Dorerin Naoero",
		"flag":"nr"
	},
	"na":{
		"iso639_2":"nau",
		"english":"Nauru",
		"native":"Dorerin Naoero",
		"flag":"nr"
	},
    //Native speakers: <10'000'000
	"nav":{
		"iso639_2":"nav",
		"english":"Navaho/Navajo",
		"native":"Diné bizaad",
		"flag":"us"
	},
    //Native speakers: <10'000'000
	"nv":{
		"iso639_2":"nav",
		"english":"Navaho/Navajo",
		"native":"Diné bizaad",
		"flag":"us"
	},
    //Native speakers: <10'000
	"nbl":{
		"iso639_2":"nbl",
		"english":"Ndebele/South",
		"native":"isiNdebele / Southern Ndebele",
		"flag":"za"
	},
    //Native speakers: <10'000
	"nr":{
		"iso639_2":"nbl",
		"english":"Ndebele/South",
		"native":"isiNdebele / Southern Ndebele",
		"flag":"za"
	},
    //Native speakers: <10'000'000
	"nde":{
		"iso639_2":"nde",
		"english":"Ndebele/North",
		"native":"isiNdebele / Northern Ndebele",
		"flag":"zw"
	},
    //Native speakers: <10'000'000
	"nd":{
		"iso639_2":"nde",
		"english":"Ndebele/North",
		"native":"isiNdebele / Northern Ndebele",
		"flag":"zw"
	},
    //Native speakers: <1'000'000
	"ndo":{
		"iso639_2":"ndo",
		"english":"Ndonga",
		"native":"Oshindonga",
		"flag":"na"
	},
    //Native speakers: <1'000'000
	"ng":{
		"iso639_2":"ndo",
		"english":"Ndonga",
		"native":"Oshindonga",
		"flag":"na"
	},
    //Native speakers:???
	"nds":{
		"iso639_2":"nds",
		"english":"Low/Saxon",
		"native":"Nederlaands Leegsaksisch",
		"flag":"nl"
	},
	"nep":{
		"iso639_2":"nep",
		"english":"Nepali",
		"native":"नेपाली",
		"flag":"np"
	},
	"ne":{
		"iso639_2":"nep",
		"english":"Nepali",
		"native":"नेपाली",
		"flag":"np"
	},
    //Native speakers: <1'000'000
	"new":{
		"iso639_2":"new",
		"english":"Nepal Bhasa/Newari",
		"native":"नेपाल भाषा",
		"flag":"np"
	},
    //Native speakers: <1'000'000
	"nia":{
		"iso639_2":"nia",
		"english":"Nias",
		"native":"Li Niha",
		"flag":"id"
	},
    //language family
	"nic":{
		"iso639_2":"nic",
		"english":"Niger-Kordofanian Languages",
		"native":"Niger-Kordofanian Languages",
		"flag":"no-file"
	},
    //Native speakers: <10'000
	"niu":{
		"iso639_2":"niu",
		"english":"Niuean",
		"native":"Ko e vagahau Niuē",
		"flag":"niue"
	},
    //Native speakers: <1'000'000
	"nno":{
		"iso639_2":"nno",
		"english":"Norwegian/Nynorsk",
		"native":"Nynorsk",
		"flag":"no"
	},
    //Native speakers: <1'000'000
	"nn":{
		"iso639_2":"nno",
		"english":"Norwegian/Nynorsk",
		"native":"Nynorsk",
		"flag":"no"
	},
    //Native speakers: none, written only
	"nob":{
		"iso639_2":"nob",
		"english":"Norwegian Bokmål",
		"native":"Bokmål",
		"flag":"no"
	},
    //Native speakers: none, written only
	"nb":{
		"iso639_2":"nob",
		"english":"Norwegian Bokmål",
		"native":"Bokmål",
		"flag":"no"
	},
    //Native speakers: <100'000
	"nog":{
		"iso639_2":"nog",
		"english":"Nogai",
		"native":"Ногай тили (Nogay tili)",
		"flag":"dagestan"
	},
    //extinct
	"non":{
		"iso639_2":"non",
		"english":"Norse/Old",
		"native":"Dǫnsk tunga",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"nor":{
		"iso639_2":"nor",
		"english":"Norwegian",
		"native":"Norsk",
		"flag":"no"
	},
    //Native speakers: <10'000'000
	"no":{
		"iso639_2":"nor",
		"english":"Norwegian",
		"native":"Norsk",
		"flag":"no"
	},
    //literary language
	"nqo":{
		"iso639_2":"nqo",
		"english":"N'Ko",
		"native":"N'Ko",
		"flag":"no-file"
	},
	"nso":{
		"iso639_2":"nso",
		"english":"Northern Sotho/Pedi/Sepedi",
		"native":"Sesotho sa Leboa",
		"flag":"za"
	},
    //language group
	"nub":{
		"iso639_2":"nub",
		"english":"Nubian Languages",
		"native":"Nubian Languages",
		"flag":"no-file"
	},
    //extinct
	"nwc":{
		"iso639_2":"nwc",
		"english":"Classical Nepal Bhasa/Classical Newari/Old Newari",
		"native":"पुलाङु नेपाल भाय्",
		"flag":"no-file"
	},
	"nya":{
		"iso639_2":"nya",
		"english":"Chewa/Chichewa/Nyanja",
		"native":"Nyanja / Chichewa / Chinyanja",
		"flag":"mw"
	},
	"ny":{
		"iso639_2":"nya",
		"english":"Chewa/Chichewa/Nyanja",
		"native":"Nyanja / Chichewa / Chinyanja",
		"flag":"mw"
	},
    //Native speakers: <10'000'000
	"nym":{
		"iso639_2":"nym",
		"english":"Nyamwezi",
		"native":"Nyamwezi",
		"flag":"tz"
	},
    //Native speakers: <10'000'000
	"nyn":{
		"iso639_2":"nyn",
		"english":"Nyankole",
		"native":"Runyankore",
		"flag":"ug"
	},
    //Native speakers: <1'000'000
	"nyo":{
		"iso639_2":"nyo",
		"english":"Nyoro",
		"native":"Runyoro",
		"flag":"ug"
	},
    //Native speakers: <1'000'000
	"nzi":{
		"iso639_2":"nzi",
		"english":"Nzima",
		"native":"Nzima",
		"flag":"gh"
	},
    //Native speakers: <1'000'000
	"oci":{
		"iso639_2":"oci",
		"english":"Occitan (post 1500)",
		"native":"occitan / lenga d'òc (post 1500)",
		"flag":"catalonia"
	},
    //Native speakers: <1'000'000
	"oc":{
		"iso639_2":"oci",
		"english":"Occitan (post 1500)",
		"native":"occitan / lenga d'òc (post 1500)",
		"flag":"catalonia"
	},
    //Native speakers: <100'000
	"oji":{
		"iso639_2":"oji",
		"english":"Ojibwa",
		"native":"Chippewa",
		"flag":"anishinabe"
	},
    //Native speakers: <100'000
	"oj":{
		"iso639_2":"oj",
		"english":"Ojibwa",
		"native":"Chippewa",
		"flag":"anishinabe"
	},
	"ori":{
		"iso639_2":"ori",
		"english":"Oriya",
		"native":"ଓଡ଼ିଆ",
		"flag":"in"
	},
	"or":{
		"iso639_2":"ori",
		"english":"Oriya",
		"native":"ଓଡ଼ିଆ",
		"flag":"in"
	},
	"orm":{
		"iso639_2":"orm",
		"english":"Oromo",
		"native":"Afaan Oromoo",
		"flag":"et"
	},
	"om":{
		"iso639_2":"orm",
		"english":"Oromo",
		"native":"Afaan Oromoo",
		"flag":"et"
	},
    //extinct
	"osa":{
		"iso639_2":"osa",
		"english":"Osage",
		"native":"Osage",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"oss":{
		"iso639_2":"oss",
		"english":"Ossetian/Ossetic",
		"native":"Ossetian / Ossetic",
		"flag":"south_ossetia"
	},
    //Native speakers: <1'000'000
	"os":{
		"iso639_2":"oss",
		"english":"Ossetian/Ossetic",
		"native":"Ossetian / Ossetic",
		"flag":"south_ossetia"
	},
    //extinct
	"ota":{
		"iso639_2":"ota",
		"english":"Turkish Ottoman (1500-1928)",
		"native":"لسان عثمانى‎ / lisân-ı Osmânî",
		"flag":"tr"
	},
    //language group
	"oto":{
		"iso639_2":"oto",
		"english":"Otomian Languages",
		"native":"Otomian Languages",
		"flag":"indalo_symbol"
	},
    //language group
	"paa":{
		"iso639_2":"paa",
		"english":"Papuan Languages",
		"native":"Papuan Languages",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"pag":{
		"iso639_2":"pag",
		"english":"Pangasinan",
		"native":"Salitan Pangasinan",
		"flag":"ph"
	},
    //extinct
	"pal":{
		"iso639_2":"pal",
		"english":"Pahlavi",
		"native":"Pārsīg",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"pam":{
		"iso639_2":"pam",
		"english":"Kapampangan / Pampanga",
		"native":"Kapampangan / Pampanga",
		"flag":"ph"
	},
	"pan":{
		"iso639_2":"pan",
		"english":"Panjabi/Punjabi",
		"native":"ਪੰਜਾਬੀ / پنجابی",
		"flag":"pk"
	},
	"pa":{
		"iso639_2":"pan",
		"english":"Panjabi/Punjabi",
		"native":"ਪੰਜਾਬੀ / پنجابی",
		"flag":"pk"
	},
    //Native speakers: <1'000'000
	"pap":{
		"iso639_2":"pap",
		"english":"Papiamento",
		"native":"Papiamento",
		"flag":"cw"//the flag of Aruba would also be equaly possible, i chose Curaçao because of higher population
	},
    //Native speakers: <100'000
	"pau":{
		"iso639_2":"pau",
		"english":"Palauan",
		"native":"Palauan",
		"flag":"pw"
	},
    //extinct
	"peo":{
		"iso639_2":"peo",
		"english":"Persian Old (ca.600-400 B.C.)",
		"native":"Persian Old (ca.600-400 B.C.)",
		"flag":"ir"
	},
	"per":{
		"iso639_2":"per",
		"english":"Persian",
		"native":"فارسی / پارسی",
		"flag":"ir"
	},
	"fas":{
		"iso639_2":"per",
		"english":"Persian",
		"native":"فارسی / پارسی",
		"flag":"ir"
	},
	"fa":{
		"iso639_2":"per",
		"english":"Persian",
		"native":"فارسی / پارسی",
		"flag":"ir"
	},
    //language group
	"phi":{
		"iso639_2":"phi",
		"english":"Philippine Languages",
		"native":"Philippine Languages",
		"flag":"ph"
	},
	"phn":{
		"iso639_2":"phn",
		"english":"Phoenician",
		"native":"dabarīm Kana`nīm",
		"flag":"no-file"
	},
    //extinct
	"pli":{
		"iso639_2":"pli",
		"english":"Pali",
		"native":"Pāḷi",
		"flag":"no-file"
	},
    //extinct
	"pi":{
		"iso639_2":"pli",
		"english":"Pali",
		"native":"Pāḷi",
		"flag":"no-file"
	},
	"pol":{
		"iso639_2":"pol",
		"english":"Polish",
		"native":"Język polski",
		"flag":"pl"
	},
	"pl":{
		"iso639_2":"pol",
		"english":"Polish",
		"native":"Język polski",
		"flag":"pl"
	},
    //Native speakers: <100'000
	"pon":{
		"iso639_2":"pon",
			"english":"Pohnpeian",
			"native":"Pohnpeian",
			"flag":"fm"
	},
	"por":{
		"iso639_2":"por",
		"english":"Portuguese",
		"native":"Português",
		"flag":"pt"
	},
	"pt":{
		"iso639_2":"por",
		"english":"Portuguese",
		"native":"Português",
		"flag":"pt"
	},
    //language group
	"pra":{
		"iso639_2":"pra",
		"english":"Prakrit Languages",
		"native":"प्राकृत",
		"flag":"no-file"
	},
    //extinct
	"pro":{
		"iso639_2":"pro",
		"english":"Provençal Old (to 1500)",
		"native":"Provençal Old (to 1500)",
		"flag":"no-file"
	},
	"pus":{
		"iso639_2":"pus",
		"english":"Pashto/Pushto",
		"native":"پښتو / Pax̌tō",
		"flag":"af"
	},
	"ps":{
		"iso639_2":"pus",
		"english":"Pashto/Pushto",
		"native":"پښتو / Pax̌tō",
		"flag":"af"
	},
    //Native speakers: <10'000'000
	"que":{
		"iso639_2":"que",
		"english":"Quechua",
		"native":"Kechua / Qhichwa simi / Runa simi",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"qu":{
		"iso639_2":"que",
		"english":"Quechua",
		"native":"Kechua / Qhichwa simi / Runa simi",
		"flag":"indalo_symbol"
	},
	"raj":{
		"iso639_2":"raj",
		"english":"Rajasthani",
		"native":"राजस्थानी",
		"flag":"in"
	},
    //Native speakers: <10'000
	"rap":{
		"iso639_2":"rap",
		"english":"Rapanui",
		"native":"Vananga rapa nui",
		"flag":"cl"
	},
    //Native speakers: <100'000
	"rar":{
		"iso639_2":"rar",
		"english":"Cook Islands Maori/Rarotongan",
		"native":"Te reo Ipukarea",
		"flag":"ck"
	},
    //language group
	"roa":{
		"iso639_2":"roa",
		"english":"Romance Languages",
		"native":"Romance Languages",
		"flag":"no-file"
	},
	"roh":{
		"iso639_2":"roh",
		"english":"Romansh",
		"native":"Rumantsch / Romontsch / Rumauntsch / Rumàntsch",
		"flag":"graubunden"
	},
	"rm":{
		"iso639_2":"roh",
		"english":"Romansh",
		"native":"Rumantsch / Romontsch / Rumauntsch / Rumàntsch",
		"flag":"graubunden"
	},
    //Native speakers: <10'000'000
	"rom":{
		"iso639_2":"rom",
		"english":"Romany",
		"native":"Romani ćhib",
		"flag":"no-file"
	},
	"rum":{
		"iso639_2":"rum",
		"english":"Moldavian / Moldovan / Romanian",
		"native":"Daco-Romanian / limba română",
		"flag":"ro"
	},
	"ron":{
		"iso639_2":"rum",
		"english":"Moldavian / Moldovan / Romanian",
		"native":"Daco-Romanian / limba română",
		"flag":"ro"
	},
	"ro":{
		"iso639_2":"rum",
		"english":"Moldavian / Moldovan / Romanian",
		"native":"Daco-Romanian / limba română",
		"flag":"ro"
	},
    //Native speakers: <10'000'000
	"run":{
		"iso639_2":"run",
		"english":"Rundi",
		"native":"Ikirundi",
		"flag":"bi"
	},
    //Native speakers: <10'000'000
	"rn":{
		"iso639_2":"run",
		"english":"Rundi",
		"native":"Ikirundi",
		"flag":"bi"
	},
    //Native speakers: <1'000'000
	"rup":{
		"iso639_2":"rup",
		"english":"Aromanian / Arumanian / Macedo-Romanian",
		"native":"Limba armãneascã / armãneshce / armãneashti / rrãmãneshti",
		"flag":"no-file" //difficult to give a flag, since small minority in every country these speakers are...
	},
	"rus":{
		"iso639_2":"rus",
		"english":"Russian",
		"native":"Pусский язык",
		"flag":"ru"
	},
	"ru":{
		"iso639_2":"rus",
		"english":"Russian",
		"native":"Pусский язык",
		"flag":"ru"
	},
    //Native speakers: <100'000
	"sad":{
		"iso639_2":"sad",
		"english":"Sandawe",
		"native":"Sandaweeki",
		"flag":"tz"
	},
    //Native speakers: <100'000
	"sag":{
		"iso639_2":"sag",
		"english":"Sango",
		"native":"Yângâ tî sängö",
		"flag":"cf"
	},
    //Native speakers: <100'000
	"sg":{
		"iso639_2":"sag",
		"english":"Sango",
		"native":"Yângâ tî sängö",
		"flag":"cf"
	},
    //Native speakers: <1'000'000
	"sah":{
		"iso639_2":"sah",
		"english":"Yakut",
		"native":"Саха тыла Saxa tila",
		"flag":"sakha"
	},
    //language group
	"sai":{
		"iso639_2":"sai",
		"english":"South American Indian (Other)",
		"native":"South American Indian (Other)",
		"flag":"indalo_symbol"
	},
	"sal":{
		"iso639_2":"sal",
		"english":"Salishan Languages",
		"native":"Salishan Languages",
		"flag":"indalo_symbol"
	},
    //extinct but still liturgical use
	"sam":{
		"iso639_2":"sam",
		"english":"Samaritan Aramaic",
		"native":"ארמית / Arāmît",
		"flag":"no-file"
	},
    //extinct, but Revival Attempts at revitalization speakers: //Native speakers: <100'000
	"san":{
		"iso639_2":"san",
		"english":"Sanskrit",
		"native":"संस्कृतम् / saṃskṛtam",
		"flag":"in"
	},
    //extinct, but Revival Attempts at revitalization speakers: //Native speakers: <100'000
	"sa":{
		"iso639_2":"sa",
		"english":"Sanskrit",
		"native":"संस्कृतम् / saṃskṛtam",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"sas":{
		"iso639_2":"sas",
		"english":"Sasak",
		"native":"Sasak",
		"flag":"id"
	},
    //Native speakers: <10'000'000
	"sat":{
		"iso639_2":"sat",
		"english":"Santali",
		"native":"Satār",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"scn":{
		"iso639_2":"scn",
		"english":"Sicilian",
		"native":"Sicilianu",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"sco":{
		"iso639_2":"sco",
		"english":"Scots",
		"native":"Scots (Braid) / Lallans",
		"flag":"scot"
	},
    //Native speakers: <10'000
	"sel":{
		"iso639_2":"sel",
		"english":"Selkup",
		"native":"Selkup",
		"flag":"yamal-nenets"
	},
    //language group
	"sem":{
		"iso639_2":"sem",
		"english":"Semitic languages",
		"native":"Semitic languages",
		"flag":"no-file"
	},
    //extinct
	"sga":{
		"iso639_2":"sga",
		"english":"Irish Old (to 900)",
		"native":"Irish Old (to 900)",
		"flag":"no-file"
	},
    //flag is the one for remote interpreting (VRS/VRI), could not find something better
	"sgn":{
		"iso639_2":"sgn",
		"english":"Sign Languages",
		"native":"Sign Languages",
		"flag":"video_interpreter"
	},
    //Native speakers: <10'000'000
	"shn":{
		"iso639_2":"shn",
		"english":"Shan",
		"native":"Lik tái",
		"flag":"mm"
	},
    //Native speakers: <10'000'000
	"sid":{
		"iso639_2":"sid",
		"english":"Sidamo",
		"native":"Sidaamu Afoo",
		"flag":"et"
	},
	"sin":{
		"iso639_2":"sin",
		"english":"Sinhala/Sinhalese",
		"native":"සිංහල / singhala",
		"flag":"lk"
	},
	"si":{
		"iso639_2":"sin",
		"english":"Sinhala/Sinhalese",
		"native":"සිංහල / singhala",
		"flag":"lk"
	},
    //language group
	"sio":{
		"iso639_2":"sio",
		"english":"Siouan Languages",
		"native":"Siouan Languages",
		"flag":"indalo_symbol"
	},
    //language group
	"sit":{
		"iso639_2":"sit",
		"english":"Sino-Tibetan Languages",
		"native":"Sino-Tibetan Languages",
		"flag":"no-file"
	},
    //language group
	"sla":{
		"iso639_2":"sla",
		"english":"Slavic Languages",
		"native":"Slavic Languages",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"slo":{
		"iso639_2":"slo",
		"english":"Slovak",
		"native":"Slovenčina / slovenský jazyk",
		"flag":"sk"
	},
    //Native speakers: <10'000'000
	"slk":{
		"iso639_2":"slo",
		"english":"Slovak",
		"native":"Slovenčina / slovenský jazyk",
		"flag":"sk"
	},
    //Native speakers: <10'000'000
	"sk":{
		"iso639_2":"slo",
		"english":"Slovak",
		"native":"Slovenčina / slovenský jazyk",
		"flag":"sk"
	},
    //Native speakers: <10'000'000
	"slv":{
		"iso639_2":"slv",
		"english":"Slovenian",
		"native":"Slovenski jezik / slovenščina",
		"flag":"si"
	},
    //Native speakers: <10'000'000
	"sl":{
		"iso639_2":"slv",
		"english":"Slovenian",
		"native":"Slovenski jezik / slovenščina",
		"flag":"si"
	},
    //Native speakers: <1'000
	"sma":{
		"iso639_2":"sma",
		"english":"Southern Sami",
		"native":"Åarjelsaemien gïele",
		"flag":"sami"
	},
    //Native speakers: <100'000
	"sme":{
		"iso639_2":"sme",
		"english":"Northern Sami",
		"native":"Davvisámegiella",
		"flag":"sami"
	},
    //Native speakers: <100'000
	"se":{
		"iso639_2":"sme",
		"english":"Northern Sami",
		"native":"Davvisámegiella",
		"flag":"sami"
	},
    //Native speakers: <100'000
	"smi":{
		"iso639_2":"smi",
		"english":"Sami Languages",
		"native":" Saami / Sámi / Saame / Samic / Saamic",
		"flag":"sami"
	},
    //Native speakers: <10'000
	"smj":{
		"iso639_2":"smj",
		"english":"Lule Sami",
		"native":"Julevsámegiella",
		"flag":"sami"
	},
    //Native speakers: <1'000
	"smn":{
		"iso639_2":"smn",
		"english":"Inari Sami",
		"native":"Anarâškielâ",
		"flag":"sami"
	},
    //Native speakers: <1'000'000
	"smo":{
		"iso639_2":"smo",
		"english":"Samoan",
		"native":"Gagana fa'a Sāmoa",
		"flag":"ws"
	},
    //Native speakers: <1'000'000
	"sm":{
		"iso639_2":"smo",
		"english":"Samoan",
		"native":"Gagana fa'a Sāmoa",
		"flag":"ws"
	},
    //Native speakers: <1'000
	"sms":{
		"iso639_2":"sms",
		"english":"Skolt Sami",
		"native":"Sääʹmǩiõll",
		"flag":"fi"
	},
	"sna":{
		"iso639_2":"sna",
		"english":"Shona",
		"native":"ChiShona",
		"flag":"zw"
	},
	"sn":{
		"iso639_2":"sna",
		"english":"Shona",
		"native":"ChiShona",
		"flag":"zw"
	},
	"snd":{
		"iso639_2":"snd",
		"english":"Sindhi",
		"native":"سنڌي، سندھی‎ / सिन्धी",
		"flag":"sindh"
	},
	"sd":{
		"iso639_2":"snd",
		"english":"Sindhi",
		"native":"سنڌي، سندھی‎ / सिन्धी",
		"flag":"sindh"
	},
    //Native speakers: <10'000'000
	"snk":{
		"iso639_2":"snk",
		"english":"Soninke",
		"native":"Sooninkanxanne",
		"flag":"ml"
	},
    //destinct
	"sog":{
		"iso639_2":"sog",
		"english":"Sogdian",
		"native":"Sogdian",
		"flag":"no-file"
	},
	"som":{
		"iso639_2":"som",
		"english":"Somali",
		"native":"Af-Soomaali / اف سومالى‎",
		"flag":"so"
	},
	"so":{
		"iso639_2":"som",
		"english":"Somali",
		"native":"Af-Soomaali / اف سومالى‎",
		"flag":"so"
	},
    //language group
	"son":{
		"iso639_2":"son",
		"english":"Songhai Languages",
		"native":"Songhai Languages",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"sot":{
		"iso639_2":"sot",
		"english":"Sotho/Southern",
		"native":"Sesotho",
		"flag":"ls"
	},
    //Native speakers: <10'000'000
	"st":{
		"iso639_2":"sot",
		"english":"Sotho/Southern",
		"native":"Sesotho",
		"flag":"ls"
	},
	"spa":{
		"iso639_2":"spa",
      "english":"Castilian/Spanish",
      "native":"Español / Castellano",
      "flag":"es"
	},
	"es":{
		"iso639_2":"spa",
		"english":"Castilian/Spanish",
		"native":"Español / Castellano",
		"flag":"es"
	},
    //Native speakers: <10'000'000
	"srd":{
		"iso639_2":"srd",
		"english":"Sardinian",
		"native":"Sardu, Limba / Lingua Sarda",
		"flag":"sardinia"
	},
    //Native speakers: <10'000'000
	"sc":{
		"iso639_2":"srd",
		"english":"Sardinian",
		"native":"Sardu, Limba / Lingua Sarda",
		"flag":"sardinia"
	},
    //Native speakers: <1'000'000
	"srn":{
		"iso639_2":"srn",
		"english":"Sranan Tongo",
		"native":"Sranan Tongo",
		"flag":"sr"
	},
    //Native speakers: <10'000'000
	"srp":{
		"iso639_2":"srp",
		"english":"Serbian",
		"native":"Cрпски / srpski",
		"flag":"rs"
	},
    //Native speakers: <10'000'000
	"sr":{
		"iso639_2":"srp",
		"english":"Serbian",
		"native":"Cрпски / srpski",
		"flag":"rs"
	},
    //Native speakers: <10'000'000
	"srr":{
		"iso639_2":"srr",
		"english":"Serer",
		"native":"Seereer",
		"flag":"sn"
	},
    //language group
	"ssa":{
		"iso639_2":"ssa",
		"english":"Nilo-Saharan Languages",
		"native":"Nilo-Saharan Languages",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"ssw":{
		"iso639_2":"ssw",
		"english":"Swati",
		"native":"SiSwati",
		"flag":"sz"
	},
    //Native speakers: <10'000'000
	"ss":{
		"iso639_2":"ssw",
		"english":"Swati",
		"native":"SiSwati",
		"flag":"sz"
	},
    //Native speakers: <10'000'000
	"suk":{
		"iso639_2":"suk",
		"english":"Sukuma",
		"native":"Kɪsukuma",
		"flag":"tz"
	},
	"sun":{
		"iso639_2":"sun",
		"english":"Sundanese",
		"native":"Basa Sunda",
		"flag":"id"
	},
	"su":{
		"iso639_2":"sun",
		"english":"Sundanese",
		"native":"Basa Sunda",
		"flag":"id"
	},
    //Native speakers: <10'000'000
	"sus":{
		"iso639_2":"sus",
		"english":"Susu",
		"native":"Sosoxi",
		"flag":"gn"
	},
    //extinct
	"sux":{
		"iso639_2":"sux",
		"english":"Sumerian",
		"native":"Eme-g̃ir / eme-gi",
		"flag":"no-file"
	},
	"swa":{
		"iso639_2":"swa",
		"english":"Swahili",
		"native":"Kiswahili",
		"flag":"tz"
	},
	"sw":{
		"iso639_2":"swa",
		"english":"Swahili",
		"native":"Kiswahili",
		"flag":"tz"
	},
	"swe":{
		"iso639_2":"swe",
		"english":"Swedish",
		"native":"Svenska",
		"flag":"se"
	},
	"sv":{
		"iso639_2":"swe",
		"english":"Swedish",
		"native":"Svenska",
		"flag":"se"
	},
    //extinct
	"syc":{
		"iso639_2":"syc",
		"english":"Classical Syriac",
		"native":"ܠܫܢܐ ܣܘܪܝܝܐ‎ / Leššānā Suryāyā",
		"flag":"no-file"
	},
    //extinct ?? although, don't know the difference between this and the one above....
	"syr":{
		"iso639_2":"syr",
		"english":"Syriac",
		"native":"Syriac",
		"flag":"no-file"
	},
    //Native speakers: <100'000
	"tah":{
		"iso639_2":"tah",
		"english":"Tahitian",
		"native":"Reo Tahiti / Reo Mā'ohi",
		"flag":"french_polynesia"
	},
    //Native speakers: <100'000
	"ty":{
		"iso639_2":"tah",
		"english":"Tahitian",
		"native":"Reo Tahiti / Reo Mā'ohi",
		"flag":"french_polynesia"
	},
    //language group
	"tai":{
		"iso639_2":"tai",
		"english":"Tai Languages",
		"native":"Tai Languages",
		"flag":"no-file"
	},
	"tam":{
		"iso639_2":"tam",
		"english":"Tamil",
		"native":"தமிழ் / tamiḻ",
		"flag":"lk"
	},
	"ta":{
		"iso639_2":"tam",
		"english":"Tamil",
		"native":"தமிழ் / tamiḻ",
		"flag":"lk"
	},
	"tat":{
		"iso639_2":"tat",
		"english":"Tatar",
		"native":"татар теле / tatar tele / تاتار تيلی‎",
		"flag":"tatarstan"
	},
	"tt":{
		"iso639_2":"tat",
		"english":"Tatar",
		"native":"татар теле / tatar tele / تاتار تيلی‎",
		"flag":"tatarstan"
	},
	"tel":{
		"iso639_2":"tel",
		"english":"Telugu",
		"native":"తెలుగు / telugu",
		"flag":"in"
	},
	"te":{
		"iso639_2":"tel",
		"english":"Telugu",
		"native":"తెలుగు / telugu",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"tem":{
		"iso639_2":"tem",
		"english":"Timne",
		"native":"KʌThemnɛ",
		"flag":"sl"
	},
    //Native speakers: <100'000
	"ter":{
		"iso639_2":"ter",
		"english":"Tereno",
		"native":"Terêna",
		"flag":"br"
	},
    //Native speakers: <1'000'000
	"tet":{
		"iso639_2":"tet",
		"english":"Tetum",
		"native":"Lia-Tetun",
		"flag":"tl"
	},
    //Native speakers: <10'000'000
	"tgk":{
		"iso639_2":"tgk",
		"english":"Tajik",
		"native":"тоҷикӣ / تاجیکی / toçikī‎",
		"flag":"tj"
	},
    //Native speakers: <10'000'000
	"tg":{
		"iso639_2":"tgk",
		"english":"Tajik",
		"native":"тоҷикӣ / تاجیکی / toçikī‎",
		"flag":"tj"
	},
	"tgl":{
		"iso639_2":"tgl",
		"english":"Tagalog",
		"native":"Wikang Tagalog",
		"flag":"ph"
	},
	"tl":{
		"iso639_2":"tgl",
		"english":"Tagalog",
		"native":"Wikang Tagalog",
		"flag":"ph"
	},
	"tha":{
		"iso639_2":"tha",
		"english":"Thai",
		"native":"Siamese / ภาษาไทย / phasa thai",
		"flag":"th"
	},
	"th":{
		"iso639_2":"tha",
		"english":"Thai",
		"native":"Siamese / ภาษาไทย / phasa thai",
		"flag":"th"
	},
    //Native speakers: <10'000'000
	"tib":{
		"iso639_2":"tib",
		"english":"Tibetan",
		"native":"ལྷ་སའི་སྐད་ / lha-sa'i skad",
		"flag":"tibet"
	},
    //Native speakers: <10'000'000
	"bod":{
		"iso639_2":"tib",
		"english":"Tibetan",
		"native":"ལྷ་སའི་སྐད་ / lha-sa'i skad",
		"flag":"tibet"
	},
    //Native speakers: <10'000'000
	"bo":{
		"iso639_2":"tib",
		"english":"Tibetan",
		"native":"ལྷ་སའི་སྐད་ / lha-sa'i skad",
		"flag":"tibet"
	},
    //Native speakers: <10'000'000
	"tig":{
		"iso639_2":"tig",
		"english":"Tigre / Xasa",
		"native":"Tigre",
		"flag":"er"
	},
    //Native speakers: <10'000'000
	"tir":{
		"iso639_2":"tir",
		"english":"Tigrinya",
		"native":"Tigrinya / Tigrigna",
		"flag":"et"
	},
    //Native speakers: <10'000'000
	"ti":{
		"iso639_2":"tir",
		"english":"Tigrinya",
		"native":"Tigrinya / Tigrigna",
		"flag":"et"
	},
    //Native speakers: <10'000'000
	"tiv":{
		"iso639_2":"tiv",
		"english":"Tiv",
		"native":"Tiv",
		"flag":"ng"
	},
    //Native speakers: <10'000
	"tkl":{
		"iso639_2":"tkl",
		"english":"Tokelau",
		"native":"Tokelau",
		"flag":"tk"
	},
    //constructed language only a few speakers
	"tlh":{
		"iso639_2":"tlh",
		"english":"Klingon",
		"native":"TlhIngan-Hol",
		"flag":"conlang"
	},
    //Native speakers: <10'000
	"tli":{
		"iso639_2":"tli",
		"english":"Tlingit",
		"native":"Lingít",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"tmh":{
		"iso639_2":"tmh",
		"english":"Tamashek",
		"native":"Tafaghist",
		"flag":"ml"
	},
    //Native speakers: <1'000'000
	"tog":{
		"iso639_2":"tog",
		"english":"Tonga (Nyasa)",
		"native":"ChiTonga",
		"flag":"mw"
	},
    //Native speakers: <100'000
	"ton":{
		"iso639_2":"ton",
		"english":"Tonga (Tonga Islands)",
		"native":"Lea faka-Tonga",
		"flag":"to"
	},
    //Native speakers: <100'000
	"to":{
		"iso639_2":"ton",
		"english":"Tonga (Tonga Islands)",
		"native":"Lea faka-Tonga",
		"flag":"to"
	},
    //Native speakers: <1'000'000
	"tpi":{
		"iso639_2":"tpi",
		"english":"Tok Pisin",
		"native":"Tok Pisin",
		"flag":"pg"
	},
    //Native speakers: <10'000
	"tsi":{
		"iso639_2":"tsi",
		"english":"Tsimshian",
		"native":"Tsimshian",
		"flag":"alaska"
	},
    //Native speakers: <10'000'000
	"tsn":{
		"iso639_2":"tsn",
		"english":"Tswana",
		"native":"Setswana",
		"flag":"za"
	},
    //Native speakers: <10'000'000
	"tn":{
		"iso639_2":"tsn",
		"english":"Tswana",
		"native":"Setswana",
		"flag":"za"
	},
	"tso":{
		"iso639_2":"tso",
		"english":"Tsonga",
		"native":"Xitsonga",
		"flag":"za"
	},
	"ts":{
		"iso639_2":"tso",
		"english":"Tsonga",
		"native":"Xitsonga",
		"flag":"za"
	},
    //Native speakers: <10'000'000
	"tuk":{
		"iso639_2":"tuk",
		"english":"Turkmen",
		"native":"Türkmençe / Түркмен дили / تورکمن تیلی / تورکمنچه",
		"flag":"tm"
	},
    //Native speakers: <10'000'000
	"tk":{
		"iso639_2":"tuk",
		"english":"Turkmen",
		"native":"Türkmençe / Түркмен дили / تورکمن تیلی / تورکمنچه",
		"flag":"tm"
	},
    //Native speakers: <10'000'000
	"tum":{
		"iso639_2":"tum",
		"english":"Tumbuka",
		"native":"ChiTumbuka",
		"flag":"mw"
	},
    //language group
	"tup":{
		"iso639_2":"tup",
		"english":"Tupi Languages",
		"native":"Tupi Languages",
		"flag":"no-file"
	},
	"tur":{
		"iso639_2":"tur",
		"english":"Turkish",
		"native":"Türkçe",
		"flag":"tr"
	},
	"tr":{
		"iso639_2":"tur",
		"english":"Turkish",
		"native":"Türkçe",
		"flag":"tr"
	},
    //language group
	"tut":{
		"iso639_2":"tut",
		"english":"Altaic Languages",
		"native":"Altaic Languages",
		"flag":"no-file"
	},
    //Native speakers: <100'000
	"tvl":{
		"iso639_2":"tvl",
		"english":"Tuvalu",
		"native":"Te Ggana Tuuvalu / Te Gagana Tuuvalu",
		"flag":"tv"
	},
    //Native speakers: <10'000'000
	"twi":{
		"iso639_2":"twi",
		"english":"Twi",
		"native":"Twi",
		"flag":"gh"
	},
    //Native speakers: <10'000'000
	"tw":{
		"iso639_2":"twi",
		"english":"Twi",
		"native":"Twi",
		"flag":"gh"
	},
    //Native speakers: <1'000'000
	"tyv":{
		"iso639_2":"tyv",
		"english":"Tuvinian",
		"native":"тыва дыл / tyva dyl",
		"flag":"tuva"
	},
    //Native speakers: <1'000'000
	"udm":{
		"iso639_2":"udm",
		"english":"Udmurt",
		"native":"удмурт кыл / udmurt kyl",
		"flag":"udmurtia"
	},
    //extinct
	"uga":{
		"iso639_2":"uga",
		"english":"Ugaritic",
		"native":"Ugaritic",
		"flag":"no-file"
	},
	"uig":{
		"iso639_2":"uig",
		"english":"Uighur/Uyghur",
		"native":"ئۇيغۇرچە  /  ئۇيغۇر تىلى",
		"flag":"cn"
	},
	"ug":{
		"iso639_2":"uig",
		"english":"Uighur/Uyghur",
		"native":"ئۇيغۇرچە  /  ئۇيغۇر تىلى",
		"flag":"cn"
	},
	"ukr":{
		"iso639_2":"ukr",
		"english":"Ukrainian",
		"native":"Yкраїнська мова / ukrayins'ka mova",
		"flag":"ua"
	},
	"uk":{
		"iso639_2":"ukr",
		"english":"Ukrainian",
		"native":"Yкраїнська мова / ukrayins'ka mova",
		"flag":"ua"
	},
    //Native speakers: <10'000'000
	"umb":{
		"iso639_2":"umb",
		"english":"Umbundu",
		"native":"úmbúndú",
		"flag":"ao"
	},
	"und":{
		"iso639_2":"und",
		"english":"Undetermined",
		"native":"Undetermined",
		"flag":"no-file"
	},
	"urd":{
		"iso639_2":"urd",
		"english":"Urdu",
		"native":"اُردُو",
		"flag":"pk"
	},
	"ur":{
		"iso639_2":"urd",
		"english":"Urdu",
		"native":"اُردُو",
		"flag":"pk"
	},
	"uzb":{
		"iso639_2":"uzb",
		"english":"Uzbek",
		"native":"Oʻzbekcha / ўзбекча / اۉزبېکچه",
		"flag":"uz"
	},
	"uz":{
		"iso639_2":"uzb",
		"english":"Uzbek",
		"native":"Oʻzbekcha / ўзбекча / اۉزبېکچه",
		"flag":"uz"
	},
    //Native speakers: <1'000'000
	"vai":{
		"iso639_2":"vai",
		"english":"Vai",
		"native":"Vai",
		"flag":"lr"
	},
    //Native speakers: <10'000'000
	"ven":{
		"iso639_2":"ven",
		"english":"Venda",
		"native":"Tshivenḓa",
		"flag":"za"
	},
    //Native speakers: <10'000'000
	"ve":{
		"iso639_2":"ven",
		"english":"Venda",
		"native":"Tshivenḓa",
		"flag":"za"
	},
	"vie":{
		"iso639_2":"vie",
		"english":"Vietnamese",
		"native":"Tiếng Việt",
		"flag":"vn"
	},
	"vi":{
		"iso639_2":"vie",
		"english":"Vietnamese",
		"native":"Tiếng Việt",
		"flag":"vn"
	},
    //constructed language
	"vol":{
		"iso639_2":"vol",
		"english":"Volapük",
		"native":"Volapük",
		"flag":"conlang"
	},
    //constructed language
	"vo":{
		"iso639_2":"vol",
		"english":"Volapük",
		"native":"Volapük",
		"flag":"conlang"
	},
    //Native  speakers: <100
	"vot":{
		"iso639_2":"vot",
		"english":"Votic",
		"native":"Vađđa ceeli / maaceeli",
		"flag":"ru"
	},
    //language group
	"wak":{
		"iso639_2":"wak",
		"english":"Wakashan Languages",
		"native":"Wakashan Languages",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"wal":{
		"iso639_2":"wal",
		"english":"Walamo",
		"native":"Walamo / Wolaytta / Ometo",
		"flag":"et"
	},
    //Native speakers: <10'000'000
	"war":{
		"iso639_2":"war",
		"english":"Waray - Waray",
		"native":"Waray",
		"flag":"ph"
	},
    //Native speakers: <100
	"was":{
		"iso639_2":"was",
		"english":"Washo",
		"native":"Wá:šiw ʔítlu",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"wel":{
		"iso639_2":"wel",
		"english":"Welsh",
		"native":"Cymraeg / y Gymraeg",
		"flag":"wales"
	},
    //Native speakers: <10'000'000
	"cym":{
		"iso639_2":"wel",
		"english":"Welsh",
		"native":"Cymraeg / y Gymraeg",
		"flag":"wales"
	},
    //Native speakers: <10'000'000
	"cy":{
		"iso639_2":"wel",
		"english":"Welsh",
		"native":"Cymraeg / y Gymraeg",
		"flag":"wales"
	},
    //Native speakers: <100'000
	"wen":{
		"iso639_2":"wen",
		"english":"Sorbian Languages",
		"native":"Sorbisch / serbšćina",
		"flag":"de"
	},
    //Native speakers: <1'000'000
	"wln":{
		"iso639_2":"wln",
		"english":"Walloon",
		"native":"Walon",
		"flag":"be"
	},
    //Native speakers: <1'000'000
	"wa":{
		"iso639_2":"wln",
		"english":"Walloon",
		"native":"Walon",
		"flag":"be"
	},
    //Native speakers: <10'000'000
	"wol":{
		"iso639_2":"wol",
		"english":"Wolof",
		"native":"Wollof",
		"flag":"sn"
	},
    //Native speakers: <10'000'000
	"wo":{
		"iso639_2":"wol",
		"english":"Wolof",
		"native":"Wollof",
		"flag":"sn"
	},
	"xal":{
		"iso639_2":"xal",
		"english":"Kalmyk/Oirat",
		"native":"Хальмг келн / Xal‘mg keln / Oirat / Mongγol kelen-ü Oyirad ayalγu",
		"flag":"mn"
	},
    //Native speakers: <10'000'000
	"xho":{
		"iso639_2":"xho",
		"english":"Xhosa",
		"native":"IsiXhosa",
		"flag":"za"
	},
    //Native speakers: <10'000'000
	"xh":{
		"iso639_2":"xho",
		"english":"Xhosa",
		"native":"IsiXhosa",
		"flag":"za"
	},
    //Native speakers: <10'000'000
	"yao":{
		"iso639_2":"yao",
		"english":"Yao",
		"native":"Yao",
		"flag":"mw"
	},
    //Native speakers: <10'000
	"yap":{
		"iso639_2":"yap",
		"english":"Yapese",
		"native":"Yapese",
		"flag":"fm"
	},
    //Native speakers: <10'000'000
	"yid":{
		"iso639_2":"yid",
		"english":"Yiddish",
		"native":"Yidish / Idish",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"yi":{
		"iso639_2":"yid",
		"english":"Yiddish",
		"native":"Yidish / Idish",
		"flag":"no-file"
	},
	"yor":{
		"iso639_2":"yor",
		"english":"Yoruba",
		"native":"èdè Yorùbá",
		"flag":"ng"
	},
	"yo":{
		"iso639_2":"yor",
		"english":"Yoruba",
		"native":"èdè Yorùbá",
		"flag":"ng"
	},
    //language group
	"ypk":{
		"iso639_2":"ypk",
		"english":"Yupik Languages",
		"native":"Yupik Languages",
		"flag":"no-file"
	},
    //Native speakers: <1'000'000
	"zap":{
		"iso639_2":"zap",
		"english":"Zapotec",
		"native":"Diidxazá",
		"flag":"mx"
	},
    //not spoken
	"zbl":{
		"iso639_2":"zbl",
		"english":"Bliss / Blissymbolics / Blissymbols",
		"native":"Bliss / Blissymbolics / Blissymbols",
		"flag":"no-file"
	},
    //Native speakers: <10'000
	"zen":{
		"iso639_2":"zen",
		"english":"Zenaga",
		"native":"Tuḍḍungiyya",
		"flag":"sn"
	},
    //Native speakers: none
	"zgh":{
		"iso639_2":"zgh",
		"english":"Standard Moroccan Tamazight",
		"native":"Amazighe standard marocain",
		"flag":"ma"
	},
	"zha":{
		"iso639_2":"zha",
		"english":"Chuang/Zhuang",
		"native":"Ahcuengh / 話僮",
		"flag":"cn"
	},
	"za":{
		"iso639_2":"zha",
		"english":"Chuang/Zhuang",
		"native":"Vahcuengh / 話僮",
		"flag":"cn"
	},
    //language group
	"znd":{
		"iso639_2":"znd",
		"english":"Zande Languages",
		"native":"Zande Languages",
		"flag":"no-file"
	},
	"zul":{
		"iso639_2":"zul",
		"english":"Zulu",
		"native":"IsiZulu",
		"flag":"za"
	},
	"zu":{
		"iso639_2":"zul",
		"english":"Zulu",
		"native":"IsiZulu",
		"flag":"za"
	},
    //Native speakers: <10'000
	"zun":{
		"iso639_2":"zun",
		"english":"Zuni",
		"native":"Shiwi'ma",
		"flag":"us"
	},
	"zxx":{
		"iso639_2":"zxx",
		"english":"No Linguistic Content / Not Applicable",
		"native":"No Linguistic Content / Not Applicable",
		"flag":"no-file"
	},
    //Native speakers: <10'000'000
	"zza":{
		"iso639_2":"zza",
		"english":"Dimili / Dimli / Kirdki / Kirmanjki / Zaza / Zazaki",
		"native":"Dimili / Dimli / Kirdki / Kirmanjki / Zaza / Zazaki",
		"flag":"tr"
	}
}





// 	"qaa-qtz":{//reserved for local use and not implemented
//      "iso639_2":"",
// 		"english":"Reserved For Local Use",
// 		"native":"Reserved For Local Use",
// 		"flag":""
// 	},
