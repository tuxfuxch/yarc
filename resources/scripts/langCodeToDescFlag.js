/*
 * Yarc - Yet another Remote Control (for Kodi)
 * Copyright (C) 2014 by Esra Kummer
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

var langCodeToDescFlag = {
	"aar":{   
        //the right ISO 639-2 code. if the entry is already in 3 char's, it's the same, in 
        //case it is with 2 chars or there are multiple ISO 639-2 code, 
        //it points to the bibliographic ISO 639-2 code to make a relation
        "iso639-2":"aar", 
        //English name of the language
		"english":"Afar",
        //the language in it's own tongue, if known, else it's english
		"native":"Afaraf",
        //the filename of the flag without fileending (ex. .svg or .png), some languages
        //do not have a flag, in that case it is an empty string
		"flag":"dj"
	},
	"aa":{
        "iso639-2":"aar",
		"english":"Afar",
		"native":"Afaraf",
		"flag":"dj"
	},
	"abk":{
        "iso639-2":"abk",
		"english":"Abkhazian",
		"native":"Abkhazian",
		"flag":""
	},
	"ab":{
        "iso639-2":"abk",
		"english":"Abkhazian",
		"native":"Abkhazian",
		"flag":"abkhazia"
	},
	"ace":{
        "iso639-2":"ace",
		"english":"Achinese",
		"native":"Achinese",
		"flag":"id"
	},
	"ach":{
        "iso639-2":"ach",
		"english":"Acoli",
		"native":"Acoli",
		"flag":"id"
	},
	"ada":{
        "iso639-2":"ada",
		"english":"Adangme",
		"native":"Adangme",
		"flag":"gh"
	},
	"ady":{
        "iso639-2":"ady",
		"english":"Adygei/Adyghe",
		"native":"Adygei/Adyghe",
		"flag":"adygea"
	},
	"afa":{
        "iso639-2":"afa",
		"english":"Afro-Asiatic Languages",
		"native":"Afro-Asiatic Languages",
		"flag":""
	},
	"afh":{
        "iso639-2":"afh",
		"english":"Afrihili",
		"native":"Afrihili",
		"flag":"conlang"
	},
	"afr":{
        "iso639-2":"afr",
		"english":"Afrikaans",
		"native":"Afrikaans",
		"flag":"za"
	},
	"af":{
        "iso639-2":"afr",
		"english":"Afrikaans",
		"native":"Afrikaans",
		"flag":"za"
	},
	"ain":{
        "iso639-2":"ain",
		"english":"Ainu",
		"native":"Ainu",
		"flag":"jp"
	},
	"aka":{
        "iso639-2":"aka",
		"english":"Akan",
		"native":"Akan",
		"flag":"gh"
	},
	"ak":{
        "iso639-2":"aka",
		"english":"Akan",
		"native":"Akan",
		"flag":"gh"
	},
	"akk":{
        "iso639-2":"akk",
		"english":"Akkadian",
		"native":"Akkadian",
		"flag":""
	},
	"alb":{
        "iso639-2":"alb",
		"english":"Albanian",
		"native":"Shqip",
		"flag":"al"
	},
	"sqi":{
        "iso639-2":"alb",
		"english":"Albanian",
		"native":"Shqip",
		"flag":"al"
	},
	"sq":{
        "iso639-2":"alb",
		"english":"Albanian",
		"native":"Shqip",
		"flag":"al"
	},
	"ale":{
        "iso639-2":"ale",
		"english":"Aleut",
		"native":"Aleut",
		"flag":"kamchatka_krai"
	},
	"alg":{
        "iso639-2":"alg",
		"english":"Algonquian Languages",
		"native":"Algonquian Languages",
		"flag":"indalo_symbol"
	},
	"alt":{
        "iso639-2":"alt",
		"english":"Southern Altai",
		"native":"Southern Altai",
		"flag":"altai_republic"
	},
	"amh":{
        "iso639-2":"amh",
		"english":"Amharic",
		"native":"Amharic",
		"flag":"et"
	},
	"am":{
        "iso639-2":"amh",
		"english":"Amharic",
		"native":"Amharic",
		"flag":"et"
	},
	"ang":{
        "iso639-2":"ang",
		"english":"English Old (ca.450-1100)",
		"native":"English Old (ca.450-1100)",
		"flag":"gb"
	},
	"anp":{
        "iso639-2":"anp",
		"english":"Angika",
		"native":"Angika",
		"flag":"in"
	},
	"apa":{
        "iso639-2":"apa",
		"english":"Apache Languages",
		"native":"Apache Languages",
		"flag":"indalo_symbol"
	},
	"ara":{
        "iso639-2":"ara",
		"english":"Arabic",
		"native":"العربية",
		"flag":"arab"
	},
	"ar":{
        "iso639-2":"ara",
		"english":"Arabic",
		"native":"العربية",
		"flag":"arab"
	},
	"arc":{
        "iso639-2":"arc",
		"english":"Aramaic (700-300 BCE)",
		"native":"Aramaic (700-300 BCE)",
		"flag":""
	},
	"arg":{
        "iso639-2":"arg",
		"english":"Aragonese",
		"native":"Aragonés",
		"flag":"aragon"
	},
	"an":{
        "iso639-2":"arg",
		"english":"Aragonese",
		"native":"Aragonés",
		"flag":"aragon"
	},
	"arm":{
        "iso639-2":"arm",
		"english":"Armenian",
		"native":"Հայերեն",
		"flag":"am"
	},
	"hye":{
        "iso639-2":"arm",
		"english":"Armenian",
		"native":"Հայերեն",
		"flag":"am"
	},
	"hy":{
        "iso639-2":"arm",
		"english":"Armenian",
		"native":"Հայերեն",
		"flag":"am"
	},
	"arn":{
        "iso639-2":"arn",
		"english":"Mapuche/Mapudungun",
		"native":"Mapuche/Mapudungun",
		"flag":"cl"
	},
	"arp":{
        "iso639-2":"arp",
		"english":"Arapaho",
		"native":"Arapaho",
		"flag":"arapaho"
	},
	"art":{
        "iso639-2":"art",
		"english":"Artificial Languages",
		"native":"Artificial Languages",
		"flag":"conlang" 
	},
	"arw":{
        "iso639-2":"arw",
		"english":"Arawak",
		"native":"Arawak",
		"flag":"indalo_symbol"
	},
	"asm":{
        "iso639-2":"asm",
		"english":"Assamese",
		"native":"অসমীয়া",
		"flag":"in"
	},
	"as":{
        "iso639-2":"asm",
		"english":"Assamese",
		"native":"অসমীয়া",
		"flag":"in"
	},
	"ast":{
        "iso639-2":"ast",
		"english":"Asturian/Asturleonese/Bable/Leonese",
		"native":"Asturian/Asturleonese/Bable/Leonese",
		"flag":"asturias"
	},
	"ath":{
        "iso639-2":"ath",
		"english":"Athapascan Languages",
		"native":"Athapascan Languages",
		"flag":"indalo_symbol"
	},
	"aus":{
        "iso639-2":"aus",
		"english":"Australian Languages",
		"native":"Australian Languages",
		"flag":"au"
	},
	"ava":{
        "iso639-2":"ava",
		"english":"Avaric",
		"native":"Aвар мацӀ/магӀарул мацӀ",
		"flag":"dagestan"
	},
	"av":{
        "iso639-2":"ava",
		"english":"Avaric",
		"native":"Aвар мацӀ/магӀарул мацӀ",
		"flag":"dagestan"
	},
	"ave":{
        "iso639-2":"ave",
		"english":"Avestan",
		"native":"Avesta",
		"flag":"ir"
	},
	"ae":{
        "iso639-2":"ave",
		"english":"Avestan",
		"native":"Avesta",
		"flag":"ir"
	},
	"awa":{
        "iso639-2":"awa",
		"english":"Awadhi",
		"native":"Awadhi",
		"flag":"in"
	},
	"aym":{
        "iso639-2":"aym",
		"english":"Aymara",
		"native":"Aymar Aru",
		"flag":"indalo_symbol"
	},
	"ay":{
        "iso639-2":"aym",
		"english":"Aymara",
		"native":"Aymar Aru",
		"flag":"indalo_symbol"
	},
	"aze":{
        "iso639-2":"aze",
		"english":"Azerbaijani",
		"native":"Azərbaycan Dili",
		"flag":"az"
	},
	"az":{
        "iso639-2":"aze",
		"english":"Azerbaijani",
		"native":"Azərbaycan Dili",
		"flag":"az"
	},
	"bad":{
        "iso639-2":"bad",
		"english":"Banda Languages",
		"native":"Banda Languages",
		"flag":"cf"
	},
	"bai":{
        "iso639-2":"bai",
		"english":"Bamileke Languages",
		"native":"Bamileke Languages",
		"flag":"cm"
	},
	"bak":{
        "iso639-2":"bak",
		"english":"Bashkir",
		"native":"башҡорт теле",
		"flag":"bashkortostan"
	},
	"ba":{
        "iso639-2":"bak",
		"english":"Bashkir",
		"native":"башҡорт теле",
		"flag":"bashkortostan"
	},
	"bal":{
        "iso639-2":"bal",
		"english":"Baluchi",
		"native":"Baluchi",
		"flag":"pk"
	},
	"bam":{
        "iso639-2":"bam",
		"english":"Bambara",
		"native":"Bamanankan",
		"flag":"ml"
	},
	"bm":{
        "iso639-2":"bam",
		"english":"Bambara",
		"native":"Bamanankan",
		"flag":"ml"
	},
	"ban":{
        "iso639-2":"ban",
		"english":"Balinese",
		"native":"Balinese",
		"flag":"id"
	},
	"baq":{
        "iso639-2":"baq",
		"english":"Basque",
		"native":"Euskara/Euskera",
		"flag":"basque_country"
	},
	"eus":{
        "iso639-2":"baq",
		"english":"Basque",
		"native":"Euskara/Euskera",
		"flag":"basque_country"
	},
	"eu":{
        "iso639-2":"baq",
		"english":"Basque",
		"native":"Euskara/Euskera",
		"flag":"basque_country"
	},
	"bas":{
        "iso639-2":"bas",
		"english":"Basa",
		"native":"Basa",
		"flag":"ng"
	},
	"bat":{
        "iso639-2":"bat",
		"english":"Baltic Languages",
		"native":"Baltic Languages",
		"flag":"lt"
	},
	"bej":{
        "iso639-2":"bej",
		"english":"Bedawiyet/Beja",
		"native":"البجا",
		"flag":"er"
	},
	"bel":{
        "iso639-2":"bel",
		"english":"Belarusian",
		"native":"Беларуская",
		"flag":"by"
	},
	"be":{
        "iso639-2":"bel",
		"english":"Belarusian",
		"native":"Беларуская",
		"flag":"by"
	},
	"bem":{
        "iso639-2":"bem",
		"english":"Bemba",
		"native":"Bemba",
		"flag":"zm"
	},
	"ben":{
        "iso639-2":"ben",
		"english":"Bengali",
		"native":"বাংলা",
		"flag":"bd"
	},
	"bn":{
        "iso639-2":"ben",
		"english":"Bengali",
		"native":"বাংলা",
		"flag":"bd"
	},
	"ber":{
        "iso639-2":"ber",
		"english":"Berber Languages",
		"native":"Tamaziɣt / Tamazight",
		"flag":"ma"
	},
	"bho":{
        "iso639-2":"bho",
		"english":"Bhojpuri",
		"native":"भोजपुरी bhōjapurī",
		"flag":"np"
	},
	"bih":{
        "iso639-2":"bih",
		"english":"Bihari Languages",
		"native":"Bihari Languages",
		"flag":"in"
	},
	"bh":{
        "iso639-2":"bih",
		"english":"Bihari Languages",
		"native":"Bihari Languages",
		"flag":"in"
	},
	"bik":{
        "iso639-2":"bik",
		"english":"Bikol",
		"native":"Bikol",
		"flag":"ph"
	},
	"bin":{
        "iso639-2":"bin",
		"english":"Bini/Edo",
		"native":"江戸",
		"flag":"jp"
	},
	"bis":{
        "iso639-2":"bis",
		"english":"Bislama",
		"native":"Bislama",
		"flag":"vu"
	},
	"bi":{
        "iso639-2":"bis",
		"english":"Bislama",
		"native":"Bislama",
		"flag":"vu"
	},
	"bla":{
        "iso639-2":"bla",
		"english":"Siksika",
		"native":"Siksika",
		"flag":"ca"
	},
	"bnt":{
        "iso639-2":"bnt",
		"english":"Bantu (Other)",
		"native":"Bantu (Other)",
		"flag":"cm"
	},
	"bos":{
        "iso639-2":"bos",
		"english":"Bosnian",
		"native":"Bosanski / босански",
		"flag":"ba"
	},
	"bs":{
        "iso639-2":"bos",
		"english":"Bosnian",
		"native":"Bosanski / босански",
		"flag":"ba"
	},
	"bra":{
        "iso639-2":"bra",
		"english":"Braj",
		"native":"ब्रज भाषा / ਬ੍ਰਜ ਭਾਸ਼ਾ",
		"flag":"in"
	},
	"bre":{
        "iso639-2":"bre",
		"english":"Breton",
		"native":"Brezhoneg",
		"flag":"brittany"
	},
	"br":{
        "iso639-2":"bre",
		"english":"Breton",
		"native":"Brezhoneg",
		"flag":"brittany"
	},
	"btk":{
        "iso639-2":"btk",
		"english":"Batak Languages",
		"native":"Batak Languages",
		"flag":"id"
	},
	"bua":{
        "iso639-2":"bua",
		"english":"Buriat",
		"native":"буряад хэлэн / buryaad khelen",
		"flag":"buryatia"
	},
	"bug":{
        "iso639-2":"bug",
		"english":"Buginese",
		"native":"Basa Ugi",
		"flag":"id"
	},
	"bul":{
        "iso639-2":"bul",
		"english":"Bulgarian",
		"native":"български език",
		"flag":"bg"
	},
	"bg":{
        "iso639-2":"bul",
		"english":"Bulgarian",
		"native":"български език",
		"flag":"bg"
	},
	"bur":{
        "iso639-2":"bur",
		"english":"Burmese",
		"native":"မြန်မာစကား",
		"flag":"mm"
	},
	"mya":{
        "iso639-2":"bur",
		"english":"Burmese",
		"native":"မြန်မာစကား",
		"flag":"mm"
	},
	"my":{
        "iso639-2":"bur",
		"english":"Burmese",
		"native":"မြန်မာစကား",
		"flag":"mm"
	},
	"byn":{
        "iso639-2":"byn",
		"english":"Bilin/Blin",
		"native":"Bilin/Blin",
		"flag":"er"
	},
	"cad":{
        "iso639-2":"cad",
		"english":"Caddo",
		"native":"Hasí:nay",
		"flag":"us"
	},
	"cai":{
        "iso639-2":"cai",
		"english":"Central American Indian Languages",
		"native":"Central American Indian Languages",
		"flag":"indalo_symbol"
	},
	"car":{
        "iso639-2":"car",
		"english":"Galibi Carib",
		"native":"Kaliña",
		"flag":"ve"
	},
	"cat":{
        "iso639-2":"cat",
		"english":"Catalan/Valencian",
		"native":"Català",
		"flag":"catalonia"
	},
	"ca":{
        "iso639-2":"cat",
		"english":"Catalan/Valencian",
		"native":"Català",
		"flag":"catalonia"
	},
	"cau":{
        "iso639-2":"cau",
		"english":"Caucasian Languages",
		"native":"Caucasian Languages",
		"flag":""
	},
	"ceb":{
        "iso639-2":"ceb",
		"english":"Cebuano",
		"native":"Bisaya, Sinugboanon, Binisaya nga Sugboanon",
		"flag":"ph"
	},
	"cel":{
        "iso639-2":"cel",
		"english":"Celtic Languages",
		"native":"Celtic Languages",
		"flag":""
	},
	"cha":{
        "iso639-2":"cha",
		"english":"Chamorro",
		"native":"Fino' Chamorro",
		"flag":"guam"
	},
	"ch":{
        "iso639-2":"cha",
		"english":"Chamorro",
		"native":"Fino' Chamorro",
		"flag":"guam"
	},
	"chb":{
        "iso639-2":"chb",
		"english":"Chibcha",
		"native":"Muisca / Muysccubun",
		"flag":"co"
	},
	"che":{
        "iso639-2":"che",
		"english":"Chechen",
		"native":"Нохчийн мотт / Noxčiyn mott / نَاخچیین موٓتت / ნახჩიჲნ მუოთთ",
		"flag":"chechen_republic"
	},
	"ce":{
        "iso639-2":"che",
		"english":"Chechen",
		"native":"Нохчийн мотт / Noxčiyn mott / نَاخچیین موٓتت / ნახჩიჲნ მუოთთ",
		"flag":"chechen_republic"
	},
    //language extinct
	"chg":{
        "iso639-2":"chg",
		"english":"Chagatai",
		"native":"جغتای Jağatāy",
		"flag":""
	},
	"chi":{
        "iso639-2":"chi",
		"english":"Chinese",
		"native":"中文 (Zhōngwén)/汉语/漢語",
		"flag":"cn"
	},
	"zho":{
        "iso639-2":"chi",
		"english":"Chinese",
		"native":"中文 (Zhōngwén)/汉语/漢語",
		"flag":"cn"
	},
	"zh":{
        "iso639-2":"chi",
		"english":"Chinese",
		"native":"中文 (Zhōngwén)/汉语/漢語",
		"flag":"cn"
	},
	"chk":{
        "iso639-2":"chk",
		"english":"Chuukese",
		"native":"Trukese",
		"flag":"fm"
	},
	"chm":{
        "iso639-2":"chm",
		"english":"Mari",
		"native":"марий йылме marij jəlme",
		"flag":"mari_el"
	},
    //Native speakers: <1000
	"chn":{
        "iso639-2":"chn",
		"english":"Chinook Jargon",
		"native":"Chinuk wawa, wawa, chinook lelang, lelang",
		"flag":"indalo_symbol"
	},
    //Native speakers: <100'000
	"cho":{
        "iso639-2":"cho",
		"english":"Choctaw",
		"native":"Chahta'",
		"flag":"us"
	},
    //Native speakers: <100'000
	"chp":{
        "iso639-2":"chp",
		"english":"Chipewyan/Dene Suline",
		"native":"Dënesųłiné",
		"flag":"northwest_territories"
	},
    //Native speakers: <100'000
	"chr":{
        "iso639-2":"chr",
		"english":"Cherokee",
		"native":"Tsalagi Gawonihisdi",
		"flag":"cherokee_nation"
	},
    //Native speakers: none;  Slavic liturgical language 
	"chu":{
        "iso639-2":"chu",
		"english":"Old/Church Slavic/Bulgarian",
		"native":"Old/Church Slavic/Bulgarian",
		"flag":""
	},
    //Native speakers: none;  Slavic liturgical language 
	"cu":{
        "iso639-2":"chu",
		"english":"Old/Church Slavic/Bulgarian",
		"native":"Old/Church Slavic/Bulgarian",
		"flag":""
	},
    //Native speakers: <10'000'000
	"chv":{
        "iso639-2":"chv",
		"english":"Chuvash",
		"native":"чӑваш чӗлхи",
		"flag":"chuvashia"
	},
    //Native speakers: <10'000'000
	"cv":{
        "iso639-2":"chv",
		"english":"Chuvash",
		"native":"чӑваш чӗлхи",
		"flag":"chuvashia"
	},
    //Native speakers: < 10'000
	"chy":{
        "iso639-2":"chy",
		"english":"Cheyenne",
		"native":"Cheyenne",
		"flag":"indalo_symbol"
	},
    //Native speakers: < 10'000'000
	"cmc":{
        "iso639-2":"cmc",
		"english":"Chamic Languages",
		"native":"Chamic Languages",
		"flag":"id"
	},
    //liturgical language of the Coptic Church
	"cop":{
        "iso639-2":"cop",
		"english":"Coptic",
		"native":"Coptic",
		"flag":"eg"
	},
    //extinct
	"cor":{
        "iso639-2":"cor",
		"english":"Cornish",
		"native":"Kernowek / Kernewek",
		"flag":"cornwall"
	},
    //extinct
	"kw":{
        "iso639-2":"cor",
		"english":"Cornish",
		"native":"Kernowek / Kernewek",
		"flag":"cornwall"
	},
    //Native speakers: < 1'000'000 
	"cos":{
        "iso639-2":"cos",
		"english":"Corsican",
		"native":"Corsu / Lingua corsa",
		"flag":"corsica"
	},
    //Native speakers: < 1'000'000
	"co":{
        "iso639-2":"cos", 
		"english":"Corsican",
		"native":"Corsu / Lingua corsa",
		"flag":"corsica"
	},
	"cpe":{
        "iso639-2":"cpe",
		"english":"Creoles And Pidgins/English Based",
		"native":"Creoles And Pidgins/English Based",
		"flag":""
	},
	"cpf":{
        "iso639-2":"cpf",
		"english":"Creoles And Pidgins/French-based",
		"native":"Creoles And Pidgins/French-based",
		"flag":""
	},
	"cpp":{
        "iso639-2":"cpp",
		"english":"Creoles And Pidgins/Portuguese-based",
		"native":"Creoles And Pidgins/Portuguese-based",
		"flag":""
	},
	"cre":{
        "iso639-2":"cre",
		"english":"Cree",
		"native":"Cree",
		"flag":"indalo_symbol"
	},
	"cr":{
        "iso639-2":"cre",
		"english":"Cree",
		"native":"Cree",
		"flag":"indalo_symbol"
	},
    //TODO to asign a flag is too political right now
	"crh":{
        "iso639-2":"crh",
		"english":"Crimean Tatar/Crimean Turkish",
		"native":"Crimean Tatar/Crimean Turkish",
		"flag":""
	},
	"crp":{
        "iso639-2":"crp",
		"english":"Creoles And Pidgins",
		"native":"Creoles And Pidgins",
		"flag":""
	},
    //Native speakers: <1'000'000
	"csb":{
        "iso639-2":"csb",
		"english":"Kashubian",
		"native":"Kaszëbsczi jãzëk",
		"flag":"pomeranian_voivodeship"
	},
	"cus":{
        "iso639-2":"cus",
		"english":"Cushitic Languages",
		"native":"Cushitic Languages",
		"flag":""
	},
	"cze":{
        "iso639-2":"cze",
		"english":"Czech",
		"native":"česky/čeština",
		"flag":"cz"
	},
	"ces":{
        "iso639-2":"cze",
		"english":"Czech",
		"native":"česky/čeština",
		"flag":"cz"
	},
	"cs":{
        "iso639-2":"cze",
		"english":"Czech",
		"native":"česky/čeština",
		"flag":"cz"
	},
    //Native speakers: <100'000
	"dak":{
        "iso639-2":"dak",
		"english":"Dakota",
		"native":"Dakhótiyapi / Dakȟótiyapi",
		"flag":"us"
	},
	"dan":{
        "iso639-2":"dan",
		"english":"Danish",
		"native":"Dansk",
		"flag":"dk"
	},
	"da":{
        "iso639-2":"dan",
		"english":"Danish",
		"native":"Dansk",
		"flag":"dk"
	},
    //Native speakers: <1'000'000
	"dar":{
        "iso639-2":"dar", 
		"english":"Dargwa",
		"native":"дарган мез / dargan mez",
		"flag":"dagestan"
	},
	"day":{
        "iso639-2":"day",
		"english":"Land Dayak Languages",
		"native":"Bidayuh",
		"flag":"my"
	},
    //Native speakers: <1000
	"del":{
        "iso639-2":"del",
		"english":"Delaware",
		"native":"Delaware",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1000
	"den":{
        "iso639-2":"den",
		"english":"Slave (Athapascan)",
		"native":"Dene K'e",
		"flag":"northwest_territories"
	},
    //Native speakers: unknown to me
	"dgr":{
        "iso639-2":"dgr",
		"english":"Dogrib",
		"native":"Tłı̨chǫ",
		"flag":"northwest_territories"
	},
    //Native speakers: <10'000'000
	"din":{
        "iso639-2":"din",
		"english":"Dinka",
		"native":"Thuɔŋjäŋ",
		"flag":"dinka"
	},
    //Native speakers: <1'000'000
	"div":{
        "iso639-2":"div",
		"english":"Dhivehi/Divehi/Maldivian",
		"native":"Dhivehi/Divehi/Maldivian",
		"flag":"mv"
	},
    //Native speakers: <1'000'000
	"dv":{
        "iso639-2":"div",
		"english":"Dhivehi/Divehi/Maldivian",
		"native":"Dhivehi/Divehi/Maldivian",
		"flag":"mv"
	},
    //Native speakers: <10'000'000
	"doi":{
        "iso639-2":"doi",
		"english":"Dogri",
		"native":"डोगरी / ڈوگرى / ḍogrī",
		"flag":"jammu-kashmir"
	},
	"dra":{
        "iso639-2":"dra",
		"english":"Dravidian Languages",
		"native":"Dravidian Languages",
		"flag":"in"
	},
    //Native speakers: <10'000
	"dsb":{
        "iso639-2":"dsb",
		"english":"Lower Sorbian",
		"native":"Dolnoserbski / Dolnoserbšćina",
		"flag":"brandenburg"
	},
    //Native speakers: <10'000'000
	"dua":{
        "iso639-2":"dua",
		"english":"Duala",
		"native":"Duala",
		"flag":"cm"
	},
    //extinct
	"dum":{
        "iso639-2":"dum",
		"english":"Dutch Middle (ca.1050-1350)",
		"native":"Dutch Middle (ca.1050-1350)",
		"flag":"nl"
	},
	"dut":{
        "iso639-2":"",
		"english":"Dutch/Flemish",
		"native":"Dutch/Flemish",
		"flag":"nl"
	},
	"nld":{
        "iso639-2":"nld",
		"english":"Dutch/Flemish",
		"native":"Dutch/Flemish",
		"flag":"nl"
	},
	"nl":{
        "iso639-2":"nld",
		"english":"Dutch/Flemish",
		"native":"Dutch/Flemish",
		"flag":"nl"
	},
	"dyu":{
        "iso639-2":"dyu",
		"english":"Dyula",
		"native":"Julakan",
		"flag":"bf"
	},
    //Native speakers: <1'000'000
	"dzo":{
        "iso639-2":"dzo",
		"english":"Dzongkha",
		"native":"Dzongkha",
		"flag":"bt"
	},
    //Native speakers: <1'000'000
	"dz":{
        "iso639-2":"dzo",
		"english":"Dzongkha",
		"native":"Dzongkha",
		"flag":"bt"
	},
    //Native speakers: <1'000'000
	"efi":{
        "iso639-2":"efi",
		"english":"Efik",
		"native":"Efik",
		"flag":"ng"
	},
    //extinct
	"egy":{
        "iso639-2":"egy",
		"english":"Egyptian (Ancient)",
		"native":"Egyptian (Ancient)",
		"flag":"eg"
	},
    //Native speakers: <100'000
	"eka":{
        "iso639-2":"eka",
		"english":"Ekajuk",
		"native":"Ekajuk",
		"flag":"ng"
	},
    //extinct
	"elx":{
        "iso639-2":"elx",
		"english":"Elamite",
		"native":"Elamite",
		"flag":""
	},
	"eng":{
        "iso639-2":"eng",
		"english":"English",
		"native":"English",
		"flag":"gb"
	},
	"en":{
        "iso639-2":"eng",
		"english":"English",
		"native":"English",
		"flag":"gb"
	},
	"enm":{
        "iso639-2":"enm",
		"english":"English Middle (1100-1500)",
		"native":"English Middle (1100-1500)",
		"flag":"gb"
	},
    //Native speakers: <1'000'000
	"epo":{
        "iso639-2":"epo",
		"english":"Esperanto",
		"native":"Esperanto",
		"flag":"esperanto"
	},
    //Native speakers: <1'000'000
	"eo":{
        "iso639-2":"epo",
		"english":"Esperanto",
		"native":"Esperanto",
		"flag":""
	},
	"est":{
        "iso639-2":"est",
		"english":"Estonian",
		"native":"Eesti/Eesti Keel",
		"flag":"ee"
	},
	"et":{
        "iso639-2":"est",
		"english":"Estonian",
		"native":"Eesti/Eesti Keel",
		"flag":"ee"
	},
    //Native speakers: <10'000'000
	"ewe":{
        "iso639-2":"ewe",
		"english":"Ewe",
		"native":"Eʋegbe",
		"flag":"gh"
	},
    //Native speakers: <10'000'000
	"ee":{
        "iso639-2":"ewe",
		"english":"Ewe",
		"native":"Eʋegbe",
		"flag":"gh"
	},
    //Native speakers: <1'000'000
	"ewo":{
        "iso639-2":"ewo",
		"english":"Ewondo",
		"native":"Kolo",
		"flag":"cm"
	},
    //Native speakers: <10'000'000
	"fan":{
        "iso639-2":"fan",
		"english":"Fang",
		"native":"Pangwe",
		"flag":"gq"
	},
    //Native speakers: <100'000
	"fao":{
        "iso639-2":"fao",
		"english":"Faroese",
		"native":"Føroyskt",
		"flag":"fo"
	},
    //Native speakers: <100'000
	"fo":{
        "iso639-2":"fao",
		"english":"Faroese",
		"native":"Føroyskt",
		"flag":"fo"
	},
    //Native speakers: <10'000'000
	"fat":{
        "iso639-2":"fat",
		"english":"Fanti",
		"native":"Fanti",
		"flag":"gh"
	},
    //Native speakers: <1'000'000
	"fij":{
        "iso639-2":"fij",
		"english":"Fijian",
		"native":"Vosa Vakaviti",
		"flag":"fj"
	},
    //Native speakers: <1'000'000
	"fj":{
        "iso639-2":"fij",
		"english":"Fijian",
		"native":"Vosa Vakaviti",
		"flag":"fj"
	},
	"fil":{
        "iso639-2":"fil",
		"english":"Filipino/Pilipino",
		"native":"Filipino/Pilipino",
		"flag":"ph"
	},
	"fin":{
        "iso639-2":"fin",
		"english":"Finnish",
		"native":"Suomen Kieli/Suomi",
		"flag":"fi"
	},
	"fi":{
        "iso639-2":"fin",
		"english":"Finnish",
		"native":"Suomen Kieli/Suomi",
		"flag":"fi"
	},
	"fiu":{
        "iso639-2":"fiu",
		"english":"Finno-Ugrian Languages",
		"native":"Finno-Ugrian Languages",
		"flag":""
	},
    //Native speakers: <10'000'000
	"fon":{
        "iso639-2":"fon",
		"english":"Fon",
		"native":"Fon gbè",
		"flag":"bj"
	},
	"fre":{
        "iso639-2":"fre",
		"english":"French",
		"native":"Français",
		"flag":"fr"
	},
	"fra":{
        "iso639-2":"fre",
		"english":"French",
		"native":"Français",
		"flag":"fr"
	},
	"fr":{
        "iso639-2":"fre",
		"english":"French",
		"native":"Français",
		"flag":"fr"
	},
    //extinct
	"frm":{
        "iso639-2":"frm",
		"english":"French Middle (ca.1400-1600)",
		"native":"French Middle (ca.1400-1600)",
		"flag":"fr"
	},
    //extinct
	"fro":{
        "iso639-2":"fro",
		"english":"French Old (842-ca.1400)",
		"native":"French Old (842-ca.1400)",
		"flag":"fr"
	},
    //Native speakers: <100'000
	"frr":{
        "iso639-2":"frr",
		"english":"Northern Frisian",
		"native":"Frasch / Fresk / Freesk / Friisk",
		"flag":"kreis_nordfriesland"
	},
    //Native speakers: <100'000
	"frs":{
        "iso639-2":"frs",
		"english":"Eastern Frisian",
		"native":"Seeltersk",
		"flag":""
	},
    //Native speakers: <1'000'000
	"fry":{
        "iso639-2":"fry",
		"english":"Western Frisian",
		"native":"Frysk",
		"flag":"frisian"
	},
    //Native speakers: <1'000'000
	"fy":{
        "iso639-2":"fry",
		"english":"Western Frisian",
		"native":"Frysk",
		"flag":"frisian"
	},
	"ful":{
        "iso639-2":"ful",
		"english":"Fulah",
		"native":"Fulani, Peul",
		"flag":"ng"
	},
	"ff":{
        "iso639-2":"ful",
		"english":"Fulah",
		"native":"Fulani, Peul",
		"flag":"ng"
	},
    //Native speakers: <1'000'000
	"fur":{
        "iso639-2":"fur",
		"english":"Friulian",
		"native":"Furlan",
		"flag":"friuli"
	},
    //Native speakers: <1'000'000
	"gaa":{
        "iso639-2":"gaa",
		"english":"Ga",
		"native":"Gã",
		"flag":"gh"
	},
    //Native speakers: <100'000
	"gay":{
        "iso639-2":"gay",
		"english":"Gayo",
		"native":"Gayo",
		"flag":"id"
	},
	"gba":{
        "iso639-2":"gba",
		"english":"Gbaya",
		"native":"Gbaya / Manza / Ngbaka",
		"flag":"cf"
	},
	"gem":{
        "iso639-2":"gem",
		"english":"Germanic Languages",
		"native":"Germanic Languages",
		"flag":""
	},
    //Native speakers: <10'000'000
	"geo":{
        "iso639-2":"geo",
		"english":"Georgian",
		"native":"ქართული",
		"flag":"ge"
	},
    //Native speakers: <10'000'000
	"kat":{
        "iso639-2":"geo",
		"english":"Georgian",
		"native":"ქართული",
		"flag":"ge"
	},
    //Native speakers: <10'000'000
	"ka":{
        "iso639-2":"geo",
		"english":"Georgian",
		"native":"ქართული",
		"flag":"ge"
	},
	"ger":{
        "iso639-2":"ger",
		"english":"German",
		"native":"Deutsch",
		"flag":"de"
	},
	"deu":{
        "iso639-2":"ger",
		"english":"German",
		"native":"Deutsch",
		"flag":"de"
	},
	"de":{
        "iso639-2":"ger",
		"english":"German",
		"native":"Deutsch",
		"flag":"de"
	},
    //only used for liturgy of the Ethiopian Orthodox Tewahedo Church
	"gez":{
        "iso639-2":"gez",
		"english":"Geez",
		"native":"Gəʿəz",
		"flag":""
	},
    //Native speakers: <1'000'000
	"gil":{
        "iso639-2":"gil",
		"english":"Gilbertese",
		"native":"Taetae ni Kiribati",
		"flag":"ki"
	},
    //Native speakers: <1'000'000
	"gla":{
        "iso639-2":"gla",
		"english":"Gaelic/Scottish Gaelic",
		"native":"Gàidhlig",
		"flag":"scot"
	},
    //Native speakers: <1'000'000
	"gd":{
        "iso639-2":"gla",
		"english":"Gaelic/Scottish Gaelic",
		"native":"Gàidhlig",
		"flag":"scot"
	},
    //Native speakers: <1'000'000
	"gle":{
        "iso639-2":"gle",
		"english":"Irish",
		"native":"Gaeilge",
		"flag":"ie"
	},
    //Native speakers: <1'000'000
	"ga":{
        "iso639-2":"gle",
		"english":"Irish",
		"native":"Gaeilge",
		"flag":"ie"
	},
    //Native speakers: <10'000'000
	"glg":{
        "iso639-2":"glg",
		"english":"Galician",
		"native":"Galego",
		"flag":"galicia"
	},
    //Native speakers: <10'000'000
	"gl":{
        "iso639-2":"glg",
		"english":"Galician",
		"native":"Galego",
		"flag":"galicia"
	},
    // Extinct as a first language
	"glv":{
        "iso639-2":"glv",
		"english":"Manx",
		"native":"Gaelg / Gailck",
		"flag":""
	},
    //extinct as a first language
	"gv":{
        "iso639-2":"glv",
		"english":"Manx",
		"native":"Gaelg / Gailck",
		"flag":""
	},
    //extinct
	"gmh":{
        "iso639-2":"gmh",
		"english":"German Middle High (ca.1050-1500)",
		"native":"German Middle High (ca.1050-1500)",
		"flag":""
	},
    //extinct
	"goh":{
        "iso639-2":"goh",
		"english":"German Old High (ca.750-1050)",
		"native":"German Old High (ca.750-1050)",
		"flag":""
	},
    //Native speakers: <10'000'000
	"gon":{
        "iso639-2":"gon",
		"english":"Gondi",
		"native":"Gondi",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"gor":{
        "iso639-2":"gor",
		"english":"Gorontalo",
		"native":"Gorontalo",
		"flag":"id"
	},
    //extinct
	"got":{
        "iso639-2":"got",
		"english":"Gothic",
		"native":"Gothic",
		"flag":""
	},
    //Native speakers: <1'000'000
	"grb":{
        "iso639-2":"grb",
		"english":"Grebo",
		"native":"Grebo",
		"flag":"lr"
	},
    //extinct
	"grc":{
        "iso639-2":"grc",
		"english":"Greek Ancient (to 1453)",
		"native":"Ἑλληνική Hellēnikḗ",
		"flag":"gr"
	},
	"gre":{
        "iso639-2":"gre",
		"english":"Greek Modern (1453-)",
		"native":"ελληνικά",
		"flag":"gr"
	},
	"ell":{
        "iso639-2":"gre",
		"english":"Greek Modern (1453-)",
		"native":"ελληνικά",
		"flag":"gr"
	},
	"el":{
        "iso639-2":"gre",
		"english":"Greek Modern (1453-)",
		"native":"ελληνικά",
		"flag":"gr"
	},
    //Native speakers: <10'000'000
	"grn":{
        "iso639-2":"grn",
		"english":"Guarani",
		"native":"Guarani",
		"flag":"py"
	},
    //Native speakers: <10'000'000
	"gn":{
        "iso639-2":"grn",
		"english":"Guarani",
		"native":"Guarani",
		"flag":"py"
	},
	"gsw":{
        "iso639-2":"gsw",
		"english":"Alemannic/Alsatian/Swiss German",
		"native":"Schwiizerdütsch",
		"flag":"ch"
	},
	"guj":{
        "iso639-2":"guj",
		"english":"Gujarati",
		"native":"ગુજરાતી / Gujarātī",
		"flag":"in"
	},
	"gu":{
        "iso639-2":"guj",
		"english":"Gujarati",
		"native":"ગુજરાતી / Gujarātī",
		"flag":"in"
	},
    //Native speakers: <1'000
	"gwi":{
        "iso639-2":"gwi",
		"english":"Gwich'in",
		"native":"Gwich'in",
		"flag":"northwest_territories"
	},
    //Native speakers: <1'000
	"hai":{
        "iso639-2":"hai",
		"english":"Haida",
		"native":"X̱aat Kíl",
		"flag":""
	},
    //Native speakers: <10'000'000
	"hat":{
        "iso639-2":"hat",
		"english":"Haitian/Haitian Creole",
		"native":"Kreyòl Ayisyen",
		"flag":"ht"
	},
    //Native speakers: <10'000'000
	"ht":{
        "iso639-2":"hat",
		"english":"Haitian/Haitian Creole",
		"native":"Kreyòl Ayisyen",
		"flag":"ht"
	},
	"hau":{
        "iso639-2":"hau",
		"english":"Hausa",
		"native":"Hausa/هَوُسَ",
		"flag":"ne"
	},
	"ha":{
        "iso639-2":"hau",
		"english":"Hausa",
		"native":"Hausa/هَوُسَ",
		"flag":"ne"
	},
    //Native speakers: <100'000
	"haw":{
        "iso639-2":"haw",
		"english":"Hawaiian",
		"native":"Hawaiian",
		"flag":"hi"
	},
	"heb":{
        "iso639-2":"heb",
		"english":"Hebrew",
		"native":"Hebrew",
		"flag":"il"
	},
	"he":{
        "iso639-2":"heb",
		"english":"Hebrew",
		"native":"Hebrew",
		"flag":"il"
	},
    //Native speakers: <1'000'000
	"her":{
        "iso639-2":"her",
		"english":"Herero",
		"native":"Otjiherero",
		"flag":"na"
	},
    //Native speakers: <1'000'000
	"hz":{
        "iso639-2":"her",
		"english":"Herero",
		"native":"Otjiherero",
		"flag":"na"
	},
    //Native speakers: <10'000'000
	"hil":{
        "iso639-2":"hil",
		"english":"Hiligaynon",
		"native":"Ilonggo /Binisaya nga Hiligaynon",
		"flag":"ph"
	},
    //Native speakers: ???
	"him":{
        "iso639-2":"him",
		"english":"Himachali Languages/Western Pahari Languages",
		"native":"Himachali Languages/Western Pahari Languages",
		"flag":""
	},
	"hin":{
        "iso639-2":"hin",
		"english":"Hindi",
		"native":"हिंदी/हिन्दी",
		"flag":"in"
	},
	"hi":{
        "iso639-2":"hin",
		"english":"Hindi",
		"native":"हिंदी/हिन्दी",
		"flag":"in"
	},
    //destinct
	"hit":{
        "iso639-2":"hit",
		"english":"Hittite",
		"native":"Hittite",
		"flag":""
	},
    //Native speakers: <10'000'000
	"hmn":{
        "iso639-2":"hmn",
		"english":"Hmong/Mong",
		"native":"Hmong/Mong",
		"flag":"cn"
	},
    //Native speakers: <1'000'000
	"hmo":{
        "iso639-2":"hmo",
		"english":"Hiri Motu",
		"native":"Hiri Motu",
		"flag":"pg"
	},
    //Native speakers: <1'000'000
	"ho":{
        "iso639-2":"hmo",
		"english":"Hiri Motu",
		"native":"Hiri Motu",
		"flag":"pg"
	},
	"hrv":{
        "iso639-2":"hrv",
		"english":"Croatian",
		"native":"Hrvatski",
		"flag":"hr"
	},
	"hr":{
        "iso639-2":"hrv",
		"english":"Croatian",
		"native":"Hrvatski",
		"flag":"hr"
	},
    //Native speakers: <100'000
	"hsb":{
        "iso639-2":"hsb",
		"english":"Upper Sorbian",
		"native":"Hornjoserbšćina",
		"flag":"saxony"
	},
	"hun":{
        "iso639-2":"hun",
		"english":"Hungarian",
		"native":"Magyar",
		"flag":"hu"
	},
	"hu":{
        "iso639-2":"hun",
		"english":"Hungarian",
		"native":"Magyar",
		"flag":"hu"
	},
    //Native speakers: <10'000
	"hup":{
        "iso639-2":"hup",
		"english":"Hupa",
		"native":"Na:tinixwe Mixine:whe'",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"iba":{
        "iso639-2":"iba",
		"english":"Iban",
		"native":"Jaku Iban",
		"flag":"sarawak"
	},
	"ibo":{
        "iso639-2":"ibo",
		"english":"Igbo",
		"native":"Asụsụ Igbo",
		"flag":"ng"
	},
	"ig":{
        "iso639-2":"ibo",
		"english":"Igbo",
		"native":"Asụsụ Igbo",
		"flag":"ng"
	},
	"ice":{
        "iso639-2":"ice",
		"english":"Icelandic",
		"native":"Íslenska",
		"flag":"is"
	},
	"isl":{
        "iso639-2":"ice",
		"english":"Icelandic",
		"native":"Íslenska",
		"flag":"is"
	},
	"is":{
        "iso639-2":"ice",
		"english":"Icelandic",
		"native":"Íslenska",
		"flag":"is"
	},
    //Native speakers: <1'000
	"ido":{
        "iso639-2":"ido",
        "english":"Ido",
        "native":"Ido",
        "flag":"ido"
	},
    //Native speakers: <1'000
	"io":{
        "iso639-2":"ido",
		"english":"Ido",
		"native":"Ido",
		"flag":"ido"
	},
    //Native speakers: <10'000'000
	"iii":{
        "iso639-2":"iii",
		"english":"Nuosu/Sichuan Yi",
		"native":"Nuosu/Sichuan Yi",
		"flag":"cn"
	},
    //Native speakers: <10'000'000
	"ii":{
        "iso639-2":"iii",
		"english":"Nuosu/Sichuan Yi",
		"native":"Nuosu/Sichuan Yi",
		"flag":"cn"
	},
    //Native speakers: <10'000'000
	"ijo":{
        "iso639-2":"ijo",
		"english":"Ijo Languages",
		"native":"Ịjọ",
		"flag":"ng"
	},
    //Native speakers: <100'000
	"iku":{
        "iso639-2":"iku",
		"english":"Inuktitut",
		"native":"Inuktitut",
		"flag":"ca"
	},
    //Native speakers: <100'000
	"iu":{
        "iso639-2":"iku",
		"english":"Inuktitut",
		"native":"Inuktitut",
		"flag":"ca"
	},
    //???
	"ile":{
        "iso639-2":"ile",
		"english":"Interlingue/Occidental",
		"native":"Interlingue/Occidental",
		"flag":""
	},
    //???
	"ie":{
        "iso639-2":"ile",
		"english":"Interlingue/Occidental",
		"native":"Interlingue/Occidental",
		"flag":"interlingue"
	},
    //Native speakers: <10'000'000
	"ilo":{
        "iso639-2":"ilo",
		"english":"Iloko",
		"native":"Ilocano",
		"flag":"ph"
	},
    //Native speakers: <10'000
	"ina":{
        "iso639-2":"ina",
		"english":"Interlingua (International Auxiliary Language Association)",
		"native":"Interlingua (International Auxiliary Language Association)",
		"flag":""
	},
    //Native speakers: <10'000
	"ia":{
        "iso639-2":"ina",
		"english":"Interlingua (International Auxiliary Language Association)",
		"native":"Interlingua (International Auxiliary Language Association)",
		"flag":""
	},
	"inc":{
        "iso639-2":"inc",
		"english":"Indic Languages",
		"native":"Indic Languages",
		"flag":"in"
	},
	"ind":{
        "iso639-2":"ind",
		"english":"Indonesian",
		"native":"Bahasa Indonesia",
		"flag":"id"
	},
	"id":{
        "iso639-2":"ind",
		"english":"Indonesian",
		"native":"Bahasa Indonesia",
		"flag":"id"
	},
    //extinct
	"ine":{
        "iso639-2":"ine",
		"english":"Indo-European Languages",
		"native":"Indo-European Languages",
		"flag":""
	},
    //Native speakers: <1'000'000
	"inh":{
        "iso639-2":"inh",
		"english":"Ingush",
		"native":"ГӀалгӀай мотт (Ğalğaj mott)",
		"flag":"ingushetia"
	},
    //Native speakers: <100'000
	"ipk":{
        "iso639-2":"ipk",
		"english":"Inupiaq",
		"native":"Iñupiaq / Iñupiatun",
		"flag":"alaska"
	},
    //Native speakers: <100'000
	"ik":{
        "iso639-2":"ipk",
		"english":"Inupiaq",
		"native":"Iñupiaq / Iñupiatun",
		"flag":"alaska"
	},
	"ira":{
        "iso639-2":"ira",
		"english":"Iranian Languages",
		"native":"Iranian Languages",
		"flag":"ir"
	},
	"iro":{
        "iso639-2":"iro",
		"english":"Iroquoian Languages",
		"native":"Iroquoian Languages",
		"flag":"indalo_symbol"
	},
	"ita":{
        "iso639-2":"ita",
		"english":"Italian",
		"native":"Italiano",
		"flag":"it"
	},
	"it":{
        "iso639-2":"ita",
		"english":"Italian",
		"native":"Italiano",
		"flag":"it"
	},
	"jav":{
        "iso639-2":"jav",
		"english":"Javanese",
		"native":"Basa Jawa",
		"flag":"id"
	},
	"jv":{
        "iso639-2":"jav",
		"english":"Javanese",
		"native":"Basa Jawa",
		"flag":"id"
	},
	"jbo":{
        "iso639-2":"jbo",
		"english":"Lojban",
		"native":"La .lojban.",
		"flag":"lojban"
	},
	"jpn":{
        "iso639-2":"jpn",
		"english":"Japanese",
		"native":"日本語 (にほんご／にっぽんご)",
		"flag":"jp"
	},
	"ja":{
        "iso639-2":"jpn",
		"english":"Japanese",
		"native":"日本語 (にほんご／にっぽんご)",
		"flag":"jp"
	},
    //Native speakers: <100'000
	"jpr":{
        "iso639-2":"jpr",
		"english":"Judeo-Persian",
		"native":"Jidi / Dzhidi / Djudi",
		"flag":"il"
	},
    //Native speakers: <1'000'000
	"jrb":{
        "iso639-2":"jrb",
		"english":"Judeo-Arabic",
		"native":" عربية يهودية / ערבית יהודית",
		"flag":"il"
	},
    //Native speakers: <1'000'000
	"kaa":{
        "iso639-2":"kaa",
		"english":"Kara-Kalpak",
		"native":"Qaraqalpaq tili / Қарақалпақ / тили",
		"flag":"karakalpakstan"
	},
    //Native speakers: <10'000'000
	"kab":{
        "iso639-2":"kab",
		"english":"Kabyle",
		"native":"Taqbaylit",
		"flag":"dz"
	},
    //Native speakers: <1'000'000
	"kac":{
        "iso639-2":"kac",
		"english":"Jingpho/Kachin",
		"native":"Jingpho/Kachin",
		"flag":"mm"
	},
    //Native speakers: <100'000
	"kal":{
        "iso639-2":"kal",
		"english":"Greenlandic/Kalaallisut",
		"native":"Greenlandic/Kalaallisut",
		"flag":"gl"
	},
    //Native speakers: <100'000
	"kl":{
        "iso639-2":"kal",
		"english":"Greenlandic/Kalaallisut",
		"native":"Greenlandic/Kalaallisut",
		"flag":"gl"
	},
    //??? there are different kamba languages, in different parts of the world
	"kam":{
        "iso639-2":"kam",
		"english":"Kamba",
		"native":"Kamba",
		"flag":""
	},
	"kan":{
        "iso639-2":"kan",
		"english":"Kannada",
		"native":"Kannada",
		"flag":"in"
	},
	"kn":{
        "iso639-2":"kan",
		"english":"Kannada",
		"native":"Kannada",
		"flag":"in"
	},
	"kar":{
        "iso639-2":"kar",
		"english":"Karen Languages",
		"native":"Karen Languages",
		"flag":"mm"
	},
    //Native speakers: <1'000'000
	"kas":{
        "iso639-2":"kas",
		"english":"Kashmiri",
		"native":"कॉशुर / Koshur / كأشُر  ",
		"flag":""
	},
    //Native speakers: <1'000'000
	"ks":{
        "iso639-2":"kas",
		"english":"Kashmiri",
		"native":"कॉशुर / Koshur / كأشُر  ",
		"flag":""
	},
    //Native speakers: <10'000'000
	"kau":{
        "iso639-2":"kau",
		"english":"Kanuri",
		"native":"Kanuri",
		"flag":""
	},
    //Native speakers: <10'000'000
	"kr":{
        "iso639-2":"kau",
		"english":"Kanuri",
		"native":"Kanuri",
		"flag":""
	},
    //extinct
	"kaw":{
        "iso639-2":"kaw",
		"english":"Kawi",
		"native":"Bhāṣa Kawi",
		"flag":""
	},
	"kaz":{
        "iso639-2":"kaz",
		"english":"Kazakh",
		"native":"қазақ тілі / qazaq tili / قازاق تىلى‎",
		"flag":"kz"
	},
	"kk":{
        "iso639-2":"kaz",
		"english":"Kazakh",
		"native":"қазақ тілі / qazaq tili / قازاق تىلى‎",
		"flag":"kz"
	},
    //Native speakers: <10'000'000
	"kbd":{
        "iso639-2":"kbd",
		"english":"Kabardian",
		"native":"адыгэбзэ adəgăbză / къэбэрдеибзэ",
		"flag":"kabardino-balkaria"
	},
    //Native speakers: <1'000'000
	"kha":{
        "iso639-2":"kha",
		"english":"Khasi",
		"native":"Khasi",
		"flag":"in"
	},
	"khi":{
        "iso639-2":"khi",
		"english":"Khoisan Languages",
		"native":"Khoesaan",
		"flag":""
	},
	"khm":{
        "iso639-2":"khm",
		"english":"Central Khmer",
		"native":"ភាសាខ្មែរ",
		"flag":"kh"
	},
	"km":{
        "iso639-2":"khm",
		"english":"Central Khmer",
		"native":"ភាសាខ្មែរ",
		"flag":"kh"
	},
    //extinct
	"kho":{
        "iso639-2":"kho",
		"english":"Khotanese/Sakan",
		"native":"Khotanese/Sakan",
		"flag":""
	},
    //Native speakers: <10'000'000
	"kik":{
        "iso639-2":"kik",
		"english":"Gikuyu/Kikuyu",
		"native":"Gĩkũyũ",
		"flag":"ke"
	},
    //Native speakers: <10'000'000
	"ki":{
        "iso639-2":"kik",
		"english":"Gikuyu/Kikuyu",
		"native":"Gĩkũyũ",
		"flag":"ke"
	},
	"kin":{
        "iso639-2":"kin",
		"english":"Kinyarwanda",
		"native":"Ikinyarwanda",
		"flag":"rw"
	},
	"rw":{
        "iso639-2":"kin",
		"english":"Kinyarwanda",
		"native":"Ikinyarwanda",
		"flag":"rw"
	},
    //Native speakers: <10'000'000
	"kir":{
        "iso639-2":"kir",
		"english":"Kirghiz/Kyrgyz",
		"native":"кыргызча / قىرعىزچا",
		"flag":"kg"
	},
    //Native speakers: <10'000'000
	"ky":{
        "iso639-2":"kir",
		"english":"Kirghiz/Kyrgyz",
		"native":"кыргызча / قىرعىزچا",
		"flag":"kg"
	},
    //language group
	"kmb":{
        "iso639-2":"kmb",
		"english":"Kimbundu",
		"native":"Kimbundu",
		"flag":""
	},
    //Native speakers: <10'000'000
	"kok":{
        "iso639-2":"kok",
		"english":"Konkani",
		"native":"कोंकणी",
		"flag":"in"
	},
    //Native speakers: <1'000'000
	"kom":{
        "iso639-2":"kom",
		"english":"Komi",
		"native":"коми кыв",
		"flag":"komi"
	},
    //Native speakers: <1'000'000
	"kv":{
        "iso639-2":"kom",
		"english":"Komi",
		"native":"коми кыв",
		"flag":"komi"
	},
    //Native speakers: <10'000'000
	"kon":{
        "iso639-2":"kon",
		"english":"Kongo",
		"native":"KiKongo",
		"flag":"ao"
	},
    //Native speakers: <10'000'000
	"kg":{
        "iso639-2":"kon",
		"english":"Kongo",
		"native":"KiKongo",
		"flag":"ao"
	},
	"kor":{
        "iso639-2":"kor",
		"english":"Korean",
		"native":"조선말 (朝鮮語) / 한국어 (韓國語)",
		"flag":"kr"
	},
	"ko":{
        "iso639-2":"kor",
		"english":"Korean",
		"native":"조선말 (朝鮮語) / 한국어 (韓國語)",
		"flag":"kr"
	},
    //Native speakers: <10'000
	"kos":{
        "iso639-2":"kos",
		"english":"Kosraean",
		"native":"Kosraean",
		"flag":"fm"
	},
    //Native speakers: <10'000'000
	"kpe":{
        "iso639-2":"kpe",
		"english":"Kpelle",
		"native":"Kpɛlɛwoo",
		"flag":"gn"
	},
    //Native speakers: <1'000'000
	"krc":{
        "iso639-2":"krc",
		"english":"Karachay-Balkar",
		"native":"Къарачай-Малкъар тил / Таулу тил",
		"flag":"kabardino-balkaria"
	},
    //Native speakers: <100'000
	"krl":{
        "iso639-2":"krl",
		"english":"Karelian",
		"native":"Karjala / karjal / kariela",
		"flag":"fi"
	},
    //???
	"kro":{
        "iso639-2":"kro",
		"english":"Kru Languages",
		"native":"Kru Languages",
		"flag":"lr"
	},
    //Native speakers: <10'000'000
	"kru":{
        "iso639-2":"kru",
		"english":"Kurukh",
		"native":"कुड़ुख़",
		"flag":"in"
	},
    //Native speakers: <1'000'000
	"kua":{
        "iso639-2":"kua",
		"english":"Kuanyama / Kwanyama",
		"native":"Kuanyama / Kwanyama",
		"flag":"ao"
	},
    //Native speakers: <1'000'000
	"kj":{
        "iso639-2":"kua",
		"english":"Kuanyama/Kwanyama",
		"native":"Kuanyama/Kwanyama",
		"flag":"ao"
	},
    //Native speakers: <1'000'000
	"kum":{
        "iso639-2":"kum",
		"english":"Kumyk",
		"native":"къумукъ тил / Qymyk til",
		"flag":"dagestan"
	},
	"kur":{
        "iso639-2":"kur",
		"english":"Kurdish",
		"native":"Kurdî, Kurdí, Кöрди, كوردی‎",
		"flag":"iq"
	},
	"ku":{
        "iso639-2":"kur",
		"english":"Kurdish",
		"native":"Kurdî, Kurdí, Кöрди, كوردی‎",
		"flag":"iq"
	},
    //Native speakers: <10'000
	"kut":{
        "iso639-2":"kut",
		"english":"Kutenai",
		"native":"Kutenai",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"lad":{
        "iso639-2":"lad",
		"english":"Ladino",
		"native":"Judeo-Español / גֿודֿיאו-איספאנייול / Ђудео-Еспањол",
		"flag":"il"
	},
	"lah":{
        "iso639-2":"lah",
		"english":"Lahnda",
		"native":"Lahnda",
		"flag":"pk"
	},
    //Native speakers: <1'000'000
	"lam":{
        "iso639-2":"lam",
		"english":"Lamba",
		"native":"Ichilamba",
		"flag":"zm"
	},
	"lao":{
        "iso639-2":"lao",
        "english":"Lao",
        "native":"ພາສາລາວ / phasa lao",
        "flag":"la"
	},
	"lo":{
        "iso639-2":"lao",
        "english":"Lao",
        "native":"ພາສາລາວ / phasa lao",
        "flag":"la"
	},
	"lat":{
        "iso639-2":"lat",
        "english":"Latin",
        "native":"Latin / lingua latīna",
        "flag":"va"
	},
	"la":{
        "iso639-2":"lat",
		"english":"Latin",
		"native":"Latin / lingua latīna",
		"flag":"va"
	},
    //Native speakers: <10'000'000
	"lav":{
        "iso639-2":"lav",
		"english":"Latvian",
		"native":"Latviešu Valoda",
		"flag":"lv"
	},
    //Native speakers: <10'000'000
	"lv":{
        "iso639-2":"lav",
		"english":"Latvian",
		"native":"Latviešu Valoda",
		"flag":"lv"
	},
    //Native speakers: <1'000'000
	"lez":{
        "iso639-2":"lez",
		"english":"Lezghian",
		"native":"Лезги чӏал Lezgi č’al",
		"flag":"dagestan"
	},
    //Native speakers: <10'000'000
	"lim":{
        "iso639-2":"lim",
		"english":"Limburgan / Limburger / Limburgish",
		"native":"Lèmbörgs",
		"flag":"nl"
	},
    //Native speakers: <10'000'000
	"li":{
        "iso639-2":"lim",
		"english":"Limburgan / Limburger / Limburgish",
		"native":"Lèmbörgs",
		"flag":"nl"
	},
    //Native speakers: <10'000'000
	"lin":{
        "iso639-2":"lin",
		"english":"Lingala",
		"native":"Lingála",
		"flag":"cd"
	},
    //Native speakers: <10'000'000
	"ln":{
        "iso639-2":"lin",
		"english":"Lingala",
		"native":"Lingála",
		"flag":"cd"
	},
    //Native speakers: <10'000'000
	"lit":{
        "iso639-2":"lit",
		"english":"Lithuanian",
		"native":"Lietuvių Kalba",
		"flag":"lt"
	},
    //Native speakers: <10'000'000
	"lt":{
        "iso639-2":"lit",
		"english":"Lithuanian",
		"native":"Lietuvių Kalba",
		"flag":"lt"
	},
    //Native speakers: <1'000'000
	"lol":{
        "iso639-2":"lol",
		"english":"Mongo",
		"native":"Mongo / Nkundo / Lomongo",
		"flag":"cd"
	},
    //Native speakers: <1'000'000
	"loz":{
        "iso639-2":"loz",
		"english":"Lozi",
		"native":"lozi",
		"flag":"zm"
	},
    //Native speakers: <1'000'000
	"ltz":{
        "iso639-2":"loz",
		"english":"Letzeburgesch/Luxembourgish",
		"native":"Lëtzebuergesch",
		"flag":"lu"
	},
    //Native speakers: <1'000'000
	"lb":{
        "iso639-2":"loz",
		"english":"Letzeburgesch/Luxembourgish",
		"native":"Lëtzebuergesch",
		"flag":"lu"
	},
    //Native speakers: <10'000'000
	"lua":{
        "iso639-2":"lua",
		"english":"Luba-Lulua",
		"native":"Tshiluba",
		"flag":"cd"
	},
    //Native speakers: <10'000'000
	"lub":{
        "iso639-2":"lub",
		"english":"Luba-Katanga",
		"native":"Kiluba",
		"flag":"cd"
	},
    //Native speakers: <10'000'000
	"lu":{
        "iso639-2":"lub",
		"english":"Luba-Katanga",
		"native":"Kiluba",
		"flag":"cd"
	},
    //Native speakers: <10'000'000
	"lug":{
        "iso639-2":"lug",
		"english":"Luganda",
		"native":"Oluganda",
		"flag":"buganda"
	},
    //Native speakers: <10'000'000
	"lg":{
        "iso639-2":"lug",
		"english":"Luganda",
		"native":"Oluganda",
		"flag":"buganda"
	},
    //Native speakers: <1'000
	"lui":{
        "iso639-2":"lui",
		"english":"Luiseno",
		"native":"Cham'teela",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"lun":{
        "iso639-2":"lun",
		"english":"Lunda",
		"native":"Chilunda",
		"flag":"zm"
	},
    //Native speakers: <10'000'000
	"luo":{
        "iso639-2":"luo",
		"english":"Luo (Kenya And Tanzania)",
		"native":"Dholuo",
		"flag":"ke"
	},
    //Native speakers: <1'000'000
	"lus":{
        "iso639-2":"lus",
		"english":"Lushai",
		"native":"Lushai",
		"flag":"in"
	},
    //Native speakers: <1'000'000
	"mac":{
        "iso639-2":"mac",
		"english":"Macedonian",
		"native":"македонски јазик / Makedonski jazik",
		"flag":"mk"
	},
    //Native speakers: <1'000'000
	"mkd":{
        "iso639-2":"mac",
		"english":"Macedonian",
		"native":"македонски јазик / Makedonski jazik",
		"flag":"mk"
	},
    //Native speakers: <1'000'000
	"mk":{
        "iso639-2":"mac",
		"english":"Macedonian",
		"native":"македонски јазик / Makedonski jazik",
		"flag":"mk"
	},
	"mad":{
        "iso639-2":"mad",
		"english":"Madurese",
		"native":"Madhura / Basa Mathura / بَهاسَ مَدورا",
		"flag":"id"
	},
	"mag":{
        "iso639-2":"mag",
		"english":"Magahi",
		"native":"मगही / magahī",
		"flag":"in"
	},
    //Native speakers: <100'000
	"mah":{
        "iso639-2":"mah",
		"english":"Marshallese",
		"native":"Kajin M̧ajeļ",
		"flag":"mh"
	},
    //Native speakers: <100'000
	"mh":{
        "iso639-2":"mah",
		"english":"Marshallese",
		"native":"Kajin M̧ajeļ",
		"flag":"mh"
	},
	"mai":{
        "iso639-2":"mai",
		"english":"Maithili",
		"native":"मैथिली / মৈথিলী",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"mak":{
        "iso639-2":"mak",
		"english":"Makasar",
		"native":"Basa Mangkasara'",
		"flag":"id"
	},
	"mal":{
        "iso639-2":"mal",
		"english":"Malayalam",
		"native":"മലയാളം / Malayāḷam",
		"flag":"in"
	},
	"ml":{
        "iso639-2":"mal",
		"english":"Malayalam",
		"native":"മലയാളം / Malayāḷam",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"man":{
        "iso639-2":"man",
		"english":"Mandingo",
		"native":"لغة مندنكا",
		"flag":"sn"
	},
    //Native speakers: <10'000'000
	"mao":{
        "iso639-2":"mao",
		"english":"Maori",
		"native":"Te Reo / Māori",
		"flag":"nz"
	},
    //Native speakers: <10'000'000
	"mri":{
        "iso639-2":"mao",
		"english":"Maori",
		"native":"Te Reo / Māori",
		"flag":"nz"
	},
    //Native speakers: <10'000'000
	"mi":{
        "iso639-2":"mao",
		"english":"Maori",
		"native":"Te Reo / Māori",
		"flag":"nz"
	},
    //language group
	"map":{
        "iso639-2":"map",
		"english":"Austronesian Languages",
		"native":"Austronesian Languages",
		"flag":""
	},
	"mar":{
        "iso639-2":"mar",
		"english":"Marathi",
		"native":"मराठी / मराठी Marāṭhī",
		"flag":"in"
	},
	"mr":{
        "iso639-2":"mar",
		"english":"Marathi",
		"native":"मराठी / मराठी Marāṭhī",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"mas":{
        "iso639-2":"mas",
		"english":"Masai",
		"native":"ɔl Maa",
		"flag":"masai"
	},
	"may":{
        "iso639-2":"may",
		"english":"Malay",
		"native":"Bahasa Melayu / بهاس ملايو‎",
		"flag":"my"
	},
	"msa":{
        "iso639-2":"may",
		"english":"Malay",
		"native":"Bahasa Melayu / بهاس ملايو‎",
		"flag":"my"
	},
	"ms":{
        "iso639-2":"may",
		"english":"Malay",
		"native":"Bahasa Melayu / بهاس ملايو‎",
		"flag":"my"
	},
    //Native speakers: <1'000'000
	"mdf":{
        "iso639-2":"mdf",
		"english":"Moksha",
		"native":"Мокшень кяль / mokšenj kälj",
		"flag":"mordovia"
	},
    //Native speakers: <1'000'000
	"mdr":{
        "iso639-2":"mdr",
		"english":"Mandar",
		"native":"Mandar",
		"flag":"id"
	},
    //Native speakers: <10'000'000
	"men":{
        "iso639-2":"men",
		"english":"Mende",
		"native":"Mɛnde yia",
		"flag":"sl"
	},
    //extinct
	"mga":{
        "iso639-2":"mga",
		"english":"Irish Middle (900-1200)",
		"native":"Irish Middle (900-1200)",
		"flag":""
	},
    //Native speakers: <10'000
	"mic":{
        "iso639-2":"mic",
		"english":"Mi'kmaq/Micmac",
		"native":"Míkmawísimk",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"min":{
        "iso639-2":"min",
		"english":"Minangkabau",
		"native":"Baso Minangkabau / باسو مينڠكاباو",
		"flag":"id"
	},
	"mis":{
        "iso639-2":"mis",
		"english":"Uncoded Languages",
		"native":"Uncoded Languages",
		"flag":""
	},
    //language group
	"mkh":{
        "iso639-2":"mkh",
		"english":"Mon-Khmer Languages",
		"native":"Mon-Khmer Languages",
		"flag":""
	},
	"mlg":{
        "iso639-2":"mlg",
		"english":"Malagasy",
		"native":"Malagasy Fiteny",
		"flag":"mg"
	},
	"mg":{
        "iso639-2":"mlg",
		"english":"Malagasy",
		"native":"Malagasy Fiteny",
		"flag":"mg"
	},
    //Native speakers: <1'000'000
	"mlt":{
        "iso639-2":"mlt",
		"english":"Maltese",
		"native":"Malti",
		"flag":"mt"
	},
    //Native speakers: <1'000'000
	"mt":{
        "iso639-2":"mlt",
		"english":"Maltese",
		"native":"Malti",
		"flag":"mt"
	},
    //Native speakers: <1'000
	"mnc":{
        "iso639-2":"mnc",
		"english":"Manchu",
		"native":"manju gisun",
		"flag":"cn"
	},
    //Native speakers: <10'000'000
	"mni":{
        "iso639-2":"mni",
		"english":"Manipuri",
		"native":"Manipuri / মৈতৈলোন্",
		"flag":"in"
	},
    //Native speakers: ???
	"mno":{
        "iso639-2":"mno",
		"english":"Manobo Languages",
		"native":"Banobo",
		"flag":"ph"
	},
    //Native speakers: <10'000
	"moh":{
        "iso639-2":"moh",
		"english":"Mohawk",
		"native":"Kanien’kéha'",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"mon":{
        "iso639-2":"mon",
		"english":"Mongolian",
		"native":"Mongɣol kele / Монгол хэл",
		"flag":"mn"
	},
    //Native speakers: <10'000'000
	"mn":{
        "iso639-2":"mon",
		"english":"Mongolian",
		"native":"Mongɣol kele / Монгол хэл",
		"flag":"mn"
	},
    //Native speakers: <10'000'000
	"mos":{
        "iso639-2":"mos",
		"english":"Mossi",
		"native":"Mõõré",
		"flag":"bf"
	},
	"mul":{
        "iso639-2":"mul",
		"english":"Multiple Languages",
		"native":"Multiple Languages",
		"flag":""
	},
    //Native speakers: <10'000'000
	"mun":{
        "iso639-2":"mun",
		"english":"Munda Languages",
		"native":"Munda Languages",
		"flag":"in"
	},
    //Native speakers: <10'000
	"mus":{
        "iso639-2":"mus",
		"english":"Creek",
		"native":"Seminole / Mvskoke",
		"flag":"us"
	},
    //Native speakers: <100'000
	"mwl":{
        "iso639-2":"mwl",
		"english":"Mirandese",
		"native":"Mirandés",
		"flag":"pt"
	},
	"mwr":{
        "iso639-2":"mwr",
		"english":"Marwari",
		"native":"मारवाड़ी",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"myn":{
        "iso639-2":"myn",
		"english":"Mayan Languages",
		"native":"Mayan Languages",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"myv":{
        "iso639-2":"myv",
		"english":"Erzya",
		"native":"eŕźań keĺ / эрзянь кель",
		"flag":"mordovia"
	},
    //Native speakers: <10'000'000
	"nah":{
        "iso639-2":"nah",
		"english":"Nahuatl Languages",
		"native":"Aztecan / Nahuatl Languages",
		"flag":"indalo_symbol"
	},
    //Native speakers: ???
	"nai":{
        "iso639-2":"nai",
		"english":"North American Indian Languages",
		"native":"North American Indian Languages",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"nap":{
        "iso639-2":"nap",
		"english":"Neapolitan",
		"native":"Napulitano",
		"flag":"it"
	},
	"nau":{
        "iso639-2":"nau",
		"english":"Nauru",
		"native":"Dorerin Naoero",
		"flag":"nr"
	},
	"na":{
        "iso639-2":"nau",
		"english":"Nauru",
		"native":"Dorerin Naoero",
		"flag":"nr"
	},
    //Native speakers: <10'000'000
	"nav":{
        "iso639-2":"nav",
		"english":"Navaho/Navajo",
		"native":"Diné bizaad",
		"flag":"us"
	},
    //Native speakers: <10'000'000
	"nv":{
        "iso639-2":"nav",
		"english":"Navaho/Navajo",
		"native":"Diné bizaad",
		"flag":"us"
	},
    //Native speakers: <10'000
	"nbl":{
        "iso639-2":"nbl",
		"english":"Ndebele/South",
		"native":"isiNdebele / Southern Ndebele",
		"flag":"za"
	},
    //Native speakers: <10'000
	"nr":{
        "iso639-2":"nbl",
		"english":"Ndebele/South",
		"native":"isiNdebele / Southern Ndebele",
		"flag":"za"
	},
    //Native speakers: <10'000'000
	"nde":{
        "iso639-2":"nde",
		"english":"Ndebele/North",
		"native":"isiNdebele / Northern Ndebele",
		"flag":"zw"
	},
    //Native speakers: <10'000'000
	"nd":{
        "iso639-2":"nde",
		"english":"Ndebele/North",
		"native":"isiNdebele / Northern Ndebele",
		"flag":"zw"
	},
    //Native speakers: <1'000'000
	"ndo":{
        "iso639-2":"ndo",
		"english":"Ndonga",
		"native":"Oshindonga",
		"flag":"na"
	},
    //Native speakers: <1'000'000
	"ng":{
        "iso639-2":"ndo",
		"english":"Ndonga",
		"native":"Oshindonga",
		"flag":"na"
	},
    //Native speakers:???
	"nds":{
        "iso639-2":"nds",
		"english":"Low/Saxon",
		"native":"Nederlaands Leegsaksisch",
		"flag":"nl"
	},
	"nep":{
        "iso639-2":"nep",
		"english":"Nepali",
		"native":"नेपाली",
		"flag":"np"
	},
	"ne":{
        "iso639-2":"nep",
		"english":"Nepali",
		"native":"नेपाली",
		"flag":"np"
	},
    //Native speakers: <1'000'000
	"new":{
        "iso639-2":"new",
		"english":"Nepal Bhasa/Newari",
		"native":"नेपाल भाषा",
		"flag":"np"
	},
    //Native speakers: <1'000'000
	"nia":{
        "iso639-2":"nia",
		"english":"Nias",
		"native":"Li Niha",
		"flag":"id"
	},
    //language family
	"nic":{
        "iso639-2":"nic",
		"english":"Niger-Kordofanian Languages",
		"native":"Niger-Kordofanian Languages",
		"flag":""
	},
    //Native speakers: <10'000
	"niu":{
        "iso639-2":"niu",
		"english":"Niuean",
		"native":"Ko e vagahau Niuē",
		"flag":"niue"
	},
    //Native speakers: <1'000'000
	"nno":{
        "iso639-2":"nno",
		"english":"Norwegian/Nynorsk",
		"native":"Nynorsk",
		"flag":"no"
	},
    //Native speakers: <1'000'000
	"nn":{
        "iso639-2":"nno",
		"english":"Norwegian/Nynorsk",
		"native":"Nynorsk",
		"flag":"no"
	},
    //Native speakers: none, written only
	"nob":{
        "iso639-2":"nob",
		"english":"Norwegian Bokmål",
		"native":"Bokmål",
		"flag":"no"
	},
    //Native speakers: none, written only
	"nb":{
        "iso639-2":"nob",
		"english":"Norwegian Bokmål",
		"native":"Bokmål",
		"flag":"no"
	},
    //Native speakers: <100'000
	"nog":{
        "iso639-2":"nog",
		"english":"Nogai",
		"native":"Ногай тили (Nogay tili)",
		"flag":"dagestan"
	},
    //extinct
	"non":{
        "iso639-2":"non",
		"english":"Norse/Old",
		"native":"Dǫnsk tunga",
		"flag":""
	},
    //Native speakers: <10'000'000
	"nor":{
        "iso639-2":"nor",
		"english":"Norwegian",
		"native":"Norsk",
		"flag":"no"
	},
    //Native speakers: <10'000'000
	"no":{
        "iso639-2":"nor",
		"english":"Norwegian",
		"native":"Norsk",
		"flag":"no"
	},
    //literary language
	"nqo":{
        "iso639-2":"nqo",
		"english":"N'Ko",
		"native":"N'Ko",
		"flag":""
	},
	"nso":{
        "iso639-2":"nso",
		"english":"Northern Sotho/Pedi/Sepedi",
		"native":"Sesotho sa Leboa",
		"flag":"za"
	},
    //language group
	"nub":{
        "iso639-2":"nub",
		"english":"Nubian Languages",
		"native":"Nubian Languages",
		"flag":""
	},
    //extinct
	"nwc":{
        "iso639-2":"nwc",
		"english":"Classical Nepal Bhasa/Classical Newari/Old Newari",
		"native":"पुलाङु नेपाल भाय्",
		"flag":""
	},
	"nya":{
        "iso639-2":"nya",
		"english":"Chewa/Chichewa/Nyanja",
		"native":"Nyanja / Chichewa / Chinyanja",
		"flag":"mw"
	},
	"ny":{
        "iso639-2":"nya",
		"english":"Chewa/Chichewa/Nyanja",
		"native":"Nyanja / Chichewa / Chinyanja",
		"flag":"mw"
	},
    //Native speakers: <10'000'000
	"nym":{
        "iso639-2":"nym",
		"english":"Nyamwezi",
		"native":"Nyamwezi",
		"flag":"tz"
	},
    //Native speakers: <10'000'000
	"nyn":{
        "iso639-2":"nyn",
		"english":"Nyankole",
		"native":"Runyankore",
		"flag":"ug"
	},
    //Native speakers: <1'000'000
	"nyo":{
        "iso639-2":"nyo",
		"english":"Nyoro",
		"native":"Runyoro",
		"flag":"ug"
	},
    //Native speakers: <1'000'000
	"nzi":{
        "iso639-2":"nzi",
		"english":"Nzima",
		"native":"Nzima",
		"flag":"gh"
	},
    //Native speakers: <1'000'000
	"oci":{
        "iso639-2":"oci",
		"english":"Occitan (post 1500)",
		"native":"occitan / lenga d'òc (post 1500)",
		"flag":"catalonia"
	},
    //Native speakers: <1'000'000
	"oc":{
        "iso639-2":"oci",
		"english":"Occitan (post 1500)",
		"native":"occitan / lenga d'òc (post 1500)",
		"flag":"catalonia"
	},
    //Native speakers: <100'000
	"oji":{
        "iso639-2":"oji",
		"english":"Ojibwa",
		"native":"Chippewa",
		"flag":"anishinabe"
	},
    //Native speakers: <100'000
	"oj":{
        "iso639-2":"oj",
		"english":"Ojibwa",
		"native":"Chippewa",
		"flag":"anishinabe"
	},
	"ori":{
        "iso639-2":"ori",
		"english":"Oriya",
		"native":"ଓଡ଼ିଆ",
		"flag":"in"
	},
	"or":{
        "iso639-2":"ori",
		"english":"Oriya",
		"native":"ଓଡ଼ିଆ",
		"flag":"in"
	},
	"orm":{
        "iso639-2":"orm",
		"english":"Oromo",
		"native":"Afaan Oromoo",
		"flag":"et"
	},
	"om":{
        "iso639-2":"orm",
		"english":"Oromo",
		"native":"Afaan Oromoo",
		"flag":"et"
	},
    //extinct
	"osa":{
        "iso639-2":"osa",
		"english":"Osage",
		"native":"Osage",
		"flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"oss":{
        "iso639-2":"oss",
		"english":"Ossetian/Ossetic",
		"native":"Ossetian / Ossetic",
		"flag":"south_ossetia"
	},
    //Native speakers: <1'000'000
	"os":{
        "iso639-2":"oss",
		"english":"Ossetian/Ossetic",
		"native":"Ossetian / Ossetic",
		"flag":"south_ossetia"
	},
    //extinct
	"ota":{
        "iso639-2":"ota",
		"english":"Turkish Ottoman (1500-1928)",
		"native":"لسان عثمانى‎ / lisân-ı Osmânî",
		"flag":"tr"
	},
    //language group
	"oto":{
        "iso639-2":"oto",
		"english":"Otomian Languages",
		"native":"Otomian Languages",
		"flag":"indalo_symbol"
	},
    //language group
	"paa":{
        "iso639-2":"paa",
		"english":"Papuan Languages",
		"native":"Papuan Languages",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"pag":{
        "iso639-2":"pag",
		"english":"Pangasinan",
		"native":"Salitan Pangasinan",
		"flag":"ph"
	},
    //extinct
	"pal":{
        "iso639-2":"pal",
		"english":"Pahlavi",
		"native":"Pārsīg",
		"flag":""
	},
    //Native speakers: <10'000'000
	"pam":{
        "iso639-2":"pam",
		"english":"Kapampangan / Pampanga",
		"native":"Kapampangan / Pampanga",
		"flag":"ph"
	},
	"pan":{
        "iso639-2":"pan",
		"english":"Panjabi/Punjabi",
		"native":"ਪੰਜਾਬੀ / پنجابی",
		"flag":"pk"
	},
	"pa":{
        "iso639-2":"pan",
		"english":"Panjabi/Punjabi",
		"native":"ਪੰਜਾਬੀ / پنجابی",
		"flag":"pk"
	},
    //Native speakers: <1'000'000
	"pap":{
        "iso639-2":"pap",
		"english":"Papiamento",
		"native":"Papiamento",
		"flag":"cw"//the flag of Aruba would also be equaly possible, i chose Curaçao because of higher population
	},
    //Native speakers: <100'000
	"pau":{
        "iso639-2":"pau",
		"english":"Palauan",
		"native":"Palauan",
		"flag":"pw"
	},
    //extinct
	"peo":{
        "iso639-2":"peo",
		"english":"Persian Old (ca.600-400 B.C.)",
		"native":"Persian Old (ca.600-400 B.C.)",
		"flag":"ir"
	},
	"per":{
        "iso639-2":"per",
		"english":"Persian",
		"native":"فارسی / پارسی",
		"flag":"ir"
	},
	"fas":{
        "iso639-2":"per",
		"english":"Persian",
		"native":"فارسی / پارسی",
		"flag":"ir"
	},
	"fa":{
        "iso639-2":"per",
		"english":"Persian",
		"native":"فارسی / پارسی",
		"flag":"ir"
	},
    //language group
	"phi":{
        "iso639-2":"phi",
		"english":"Philippine Languages",
		"native":"Philippine Languages",
		"flag":"ph"
	},
	"phn":{
        "iso639-2":"phn",
		"english":"Phoenician",
		"native":"dabarīm Kana`nīm",
		"flag":""
	},
    //extinct
	"pli":{
        "iso639-2":"pli",
		"english":"Pali",
		"native":"Pāḷi",
		"flag":""
	},
    //extinct
	"pi":{
        "iso639-2":"pli",
		"english":"Pali",
		"native":"Pāḷi",
		"flag":""
	},
	"pol":{
        "iso639-2":"pol",
		"english":"Polish",
		"native":"Język polski",
		"flag":"pl"
	},
	"pl":{
        "iso639-2":"pol",
		"english":"Polish",
		"native":"Język polski",
		"flag":"pl"
	},
    //Native speakers: <100'000
	"pon":{
        "iso639-2":"pon",
			"english":"Pohnpeian",
			"native":"Pohnpeian",
			"flag":"fm"
	},
	"por":{
        "iso639-2":"por",
		"english":"Portuguese",
		"native":"Português",
		"flag":"pt"
	},
	"pt":{
        "iso639-2":"por",
		"english":"Portuguese",
		"native":"Português",
		"flag":"pt"
	},
    //language group
	"pra":{
        "iso639-2":"pra",
		"english":"Prakrit Languages",
		"native":"प्राकृत",
		"flag":""
	},
    //extinct
	"pro":{
        "iso639-2":"pro",
		"english":"Provençal Old (to 1500)",
		"native":"Provençal Old (to 1500)",
		"flag":""
	},
	"pus":{
        "iso639-2":"pus",
		"english":"Pashto/Pushto",
		"native":"پښتو / Pax̌tō",
		"flag":"af"
	},
	"ps":{
        "iso639-2":"pus",
		"english":"Pashto/Pushto",
		"native":"پښتو / Pax̌tō",
		"flag":"af"
	},
    //Native speakers: <10'000'000
	"que":{
        "iso639-2":"que",
		"english":"Quechua",
		"native":"Kechua / Qhichwa simi / Runa simi",
		"flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"qu":{
        "iso639-2":"que",
		"english":"Quechua",
		"native":"Kechua / Qhichwa simi / Runa simi",
		"flag":"indalo_symbol"
	},
	"raj":{
        "iso639-2":"raj",
		"english":"Rajasthani",
		"native":"राजस्थानी",
		"flag":"in"
	},
    //Native speakers: <10'000
	"rap":{
        "iso639-2":"rap",
		"english":"Rapanui",
		"native":"Vananga rapa nui",
		"flag":"cl"
	},
    //Native speakers: <100'000
	"rar":{
        "iso639-2":"rar",
		"english":"Cook Islands Maori/Rarotongan",
		"native":"Te reo Ipukarea",
		"flag":"ck"
	},
    //language group
	"roa":{
        "iso639-2":"roa",
		"english":"Romance Languages",
		"native":"Romance Languages",
		"flag":""
	},
	"roh":{
        "iso639-2":"roh",
		"english":"Romansh",
		"native":"Rumantsch / Romontsch / Rumauntsch / Rumàntsch",
		"flag":"graubunden"
	},
	"rm":{
        "iso639-2":"roh",
		"english":"Romansh",
		"native":"Rumantsch / Romontsch / Rumauntsch / Rumàntsch",
		"flag":"graubunden"
	},
    //Native speakers: <10'000'000
	"rom":{
        "iso639-2":"rom",
		"english":"Romany",
		"native":"Romani ćhib",
		"flag":""
	},
	"rum":{
        "iso639-2":"rum",
		"english":"Moldavian / Moldovan / Romanian",
		"native":"Daco-Romanian / limba română",
		"flag":"ro"
	},
	"ron":{
        "iso639-2":"rum",
		"english":"Moldavian / Moldovan / Romanian",
		"native":"Daco-Romanian / limba română",
		"flag":"ro"
	},
	"ro":{
        "iso639-2":"rum",
		"english":"Moldavian / Moldovan / Romanian",
		"native":"Daco-Romanian / limba română",
		"flag":"ro"
	},
    //Native speakers: <10'000'000
	"run":{
        "iso639-2":"run",
		"english":"Rundi",
		"native":"Ikirundi",
		"flag":"bi"
	},
    //Native speakers: <10'000'000
	"rn":{
        "iso639-2":"run",
		"english":"Rundi",
		"native":"Ikirundi",
		"flag":"bi"
	},
    //Native speakers: <1'000'000
	"rup":{
        "iso639-2":"rup",
		"english":"Aromanian / Arumanian / Macedo-Romanian",
		"native":"Limba armãneascã / armãneshce / armãneashti / rrãmãneshti",
		"flag":"" //difficult to give a flag, since small minority in every country these speakers are...
	},
	"rus":{
        "iso639-2":"rus",
		"english":"Russian",
		"native":"Pусский язык",
		"flag":"ru"
	},
	"ru":{
        "iso639-2":"rus",
		"english":"Russian",
		"native":"Pусский язык",
		"flag":"ru"
	},
    //Native speakers: <100'000
	"sad":{
        "iso639-2":"sad",
		"english":"Sandawe",
		"native":"Sandaweeki",
		"flag":"tz"
	},
    //Native speakers: <100'000
	"sag":{
        "iso639-2":"sag",
		"english":"Sango",
		"native":"Yângâ tî sängö",
		"flag":"cf"
	},
    //Native speakers: <100'000
	"sg":{
        "iso639-2":"sag",
		"english":"Sango",
		"native":"Yângâ tî sängö",
		"flag":"cf"
	},
    //Native speakers: <1'000'000
	"sah":{
        "iso639-2":"sah",
		"english":"Yakut",
		"native":"Саха тыла Saxa tila",
		"flag":"sakha"
	},
    //language group
	"sai":{
        "iso639-2":"sai",
		"english":"South American Indian (Other)",
		"native":"South American Indian (Other)",
		"flag":"indalo_symbol"
	},
	"sal":{
        "iso639-2":"sal",
		"english":"Salishan Languages",
		"native":"Salishan Languages",
		"flag":"indalo_symbol"
	},
    //extinct but still liturgical use
	"sam":{
        "iso639-2":"sam",
		"english":"Samaritan Aramaic",
		"native":"ארמית / Arāmît",
		"flag":""
	},
    //extinct, but Revival Attempts at revitalization speakers: //Native speakers: <100'000
	"san":{
        "iso639-2":"san",
		"english":"Sanskrit",
		"native":"संस्कृतम् / saṃskṛtam",
		"flag":"in"
	},
    //extinct, but Revival Attempts at revitalization speakers: //Native speakers: <100'000
	"sa":{
        "iso639-2":"sa",
		"english":"Sanskrit",
		"native":"संस्कृतम् / saṃskṛtam",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"sas":{
        "iso639-2":"sas",
		"english":"Sasak",
		"native":"Sasak",
		"flag":"id"
	},
    //Native speakers: <10'000'000
	"sat":{
        "iso639-2":"sat",
		"english":"Santali",
		"native":"Satār",
		"flag":"in"
	},
    //Native speakers: <10'000'000
	"scn":{
        "iso639-2":"scn",
		"english":"Sicilian",
		"native":"Sicilianu",
		"flag":""
	},
    //Native speakers: <10'000'000
	"sco":{
        "iso639-2":"sco",
		"english":"Scots",
		"native":"Scots (Braid) / Lallans",
		"flag":"scot"
	},
    //Native speakers: <10'000
	"sel":{
        "iso639-2":"sel",
		"english":"Selkup",
		"native":"Selkup",
		"flag":"yamal-nenets"
	},
    //language group
	"sem":{
        "iso639-2":"sem",
		"english":"Semitic languages",
		"native":"Semitic languages",
		"flag":""
	},
    //extinct
	"sga":{
        "iso639-2":"sga",
		"english":"Irish Old (to 900)",
		"native":"Irish Old (to 900)",
		"flag":""
	},
    //flag is the one for remote interpreting (VRS/VRI), could not find something better
	"sgn":{
        "iso639-2":"sgn",
		"english":"Sign Languages",
		"native":"Sign Languages",
		"flag":"video_interpreter"
	},
    //Native speakers: <10'000'000
	"shn":{
        "iso639-2":"shn",
		"english":"Shan",
		"native":"Lik tái",
		"flag":"mm"
	},
    //Native speakers: <10'000'000
	"sid":{
        "iso639-2":"sid",
		"english":"Sidamo",
		"native":"Sidaamu Afoo",
		"flag":"et"
	},
	"sin":{
        "iso639-2":"sin",
		"english":"Sinhala/Sinhalese",
		"native":"සිංහල / singhala",
		"flag":"lk"
	},
	"si":{
        "iso639-2":"sin",
		"english":"Sinhala/Sinhalese",
		"native":"සිංහල / singhala",
		"flag":"lk"
	},
    //language group
	"sio":{
        "iso639-2":"sio",
		"english":"Siouan Languages",
		"native":"Siouan Languages",
		"flag":"indalo_symbol"
	},
    //language group
	"sit":{
        "iso639-2":"sit",
		"english":"Sino-Tibetan Languages",
		"native":"Sino-Tibetan Languages",
		"flag":""
	},
    //language group
	"sla":{
        "iso639-2":"sla",
		"english":"Slavic Languages",
		"native":"Slavic Languages",
		"flag":""
	},
    //Native speakers: <10'000'000
	"slo":{
        "iso639-2":"slo",
		"english":"Slovak",
		"native":"Slovenčina / slovenský jazyk",
		"flag":"sk"
	},
    //Native speakers: <10'000'000
	"slk":{
        "iso639-2":"slo",
		"english":"Slovak",
		"native":"Slovenčina / slovenský jazyk",
		"flag":"sk"
	},
    //Native speakers: <10'000'000
	"sk":{
        "iso639-2":"slo",
		"english":"Slovak",
		"native":"Slovenčina / slovenský jazyk",
		"flag":"sk"
	},
    //Native speakers: <10'000'000
	"slv":{
        "iso639-2":"slv",
		"english":"Slovenian",
		"native":"Slovenski jezik / slovenščina",
		"flag":"si"
	},
    //Native speakers: <10'000'000
	"sl":{
        "iso639-2":"slv",
		"english":"Slovenian",
		"native":"Slovenski jezik / slovenščina",
		"flag":"si"
	},
    //Native speakers: <1'000
	"sma":{
        "iso639-2":"sma",
		"english":"Southern Sami",
		"native":"Åarjelsaemien gïele",
		"flag":"sami"
	},
    //Native speakers: <100'000
	"sme":{
        "iso639-2":"sme",
		"english":"Northern Sami",
		"native":"Davvisámegiella",
		"flag":"sami"
	},
    //Native speakers: <100'000
	"se":{
        "iso639-2":"sme",
		"english":"Northern Sami",
		"native":"Davvisámegiella",
		"flag":"sami"
	},
    //Native speakers: <100'000
	"smi":{
        "iso639-2":"smi",
		"english":"Sami Languages",
		"native":" Saami / Sámi / Saame / Samic / Saamic",
		"flag":"sami"
	},
    //Native speakers: <10'000
	"smj":{
        "iso639-2":"smj",
		"english":"Lule Sami",
		"native":"Julevsámegiella",
		"flag":"sami"
	},
    //Native speakers: <1'000
	"smn":{
        "iso639-2":"smn",
		"english":"Inari Sami",
		"native":"Anarâškielâ",
		"flag":"sami"
	},
    //Native speakers: <1'000'000
	"smo":{
        "iso639-2":"smo",
        "english":"Samoan",
        "native":"Gagana fa'a Sāmoa",
        "flag":"ws"
	},
    //Native speakers: <1'000'000
	"sm":{
        "iso639-2":"smo",
        "english":"Samoan",
        "native":"Gagana fa'a Sāmoa",
        "flag":"ws"
	},
    //Native speakers: <1'000
	"sms":{
        "iso639-2":"sms",
        "english":"Skolt Sami",
        "native":"Sääʹmǩiõll",
        "flag":"fi"
	},
	"sna":{
        "iso639-2":"sna",
        "english":"Shona",
        "native":"ChiShona",
        "flag":"zw"
	},
	"sn":{
        "iso639-2":"sna",
        "english":"Shona",
        "native":"ChiShona",
        "flag":"zw"
	},
	"snd":{
        "iso639-2":"snd",
        "english":"Sindhi",
        "native":"سنڌي، سندھی‎ / सिन्धी",
        "flag":"sindh"
	},
	"sd":{
        "iso639-2":"snd",
        "english":"Sindhi",
        "native":"سنڌي، سندھی‎ / सिन्धी",
        "flag":"sindh"
	},
    //Native speakers: <10'000'000
	"snk":{
        "iso639-2":"snk",
        "english":"Soninke",
        "native":"Sooninkanxanne",
        "flag":"ml"
	},
    //destinct
	"sog":{
        "iso639-2":"sog",
        "english":"Sogdian",
        "native":"Sogdian",
        "flag":""
	},
	"som":{
        "iso639-2":"som",
        "english":"Somali",
        "native":"Af-Soomaali / اف سومالى‎",
        "flag":"so"
	},
	"so":{
        "iso639-2":"som",
        "english":"Somali",
        "native":"Af-Soomaali / اف سومالى‎",
        "flag":"so"
	},
    //language group
	"son":{
        "iso639-2":"son",
        "english":"Songhai Languages",
        "native":"Songhai Languages",
        "flag":""
	},
    //Native speakers: <10'000'000
	"sot":{
        "iso639-2":"sot",
        "english":"Sotho/Southern",
        "native":"Sesotho",
        "flag":"ls"
	},
    //Native speakers: <10'000'000
	"st":{
        "iso639-2":"sot",
        "english":"Sotho/Southern",
        "native":"Sesotho",
        "flag":"ls"
	},
	"spa":{
        "iso639-2":"spa",
      "english":"Castilian/Spanish",
      "native":"Español / Castellano",
      "flag":"es"
	},
	"es":{
        "iso639-2":"spa",
        "english":"Castilian/Spanish",
        "native":"Español / Castellano",
        "flag":"es"
	},
    //Native speakers: <10'000'000
	"srd":{
        "iso639-2":"srd",
        "english":"Sardinian",
        "native":"Sardu, Limba / Lingua Sarda",
        "flag":"sardinia"
	},
    //Native speakers: <10'000'000
	"sc":{
        "iso639-2":"srd",
        "english":"Sardinian",
        "native":"Sardu, Limba / Lingua Sarda",
        "flag":"sardinia"
	},
    //Native speakers: <1'000'000
	"srn":{
        "iso639-2":"srn",
        "english":"Sranan Tongo",
        "native":"Sranan Tongo",
        "flag":"sr"
	},
    //Native speakers: <10'000'000
	"srp":{
        "iso639-2":"srp",
        "english":"Serbian",
        "native":"Cрпски / srpski",
        "flag":"rs"
	},
    //Native speakers: <10'000'000
	"sr":{
        "iso639-2":"srp",
        "english":"Serbian",
        "native":"Cрпски / srpski",
        "flag":"rs"
	},
    //Native speakers: <10'000'000
	"srr":{
        "iso639-2":"srr",
        "english":"Serer",
        "native":"Seereer",
        "flag":"sn"
	},
    //language group
	"ssa":{
        "iso639-2":"ssa",
        "english":"Nilo-Saharan Languages",
        "native":"Nilo-Saharan Languages",
        "flag":""
	},
    //Native speakers: <10'000'000
	"ssw":{
        "iso639-2":"ssw",
        "english":"Swati",
        "native":"SiSwati",
        "flag":"sz"
	},
    //Native speakers: <10'000'000
	"ss":{
        "iso639-2":"ssw",
        "english":"Swati",
        "native":"SiSwati",
        "flag":"sz"
	},
    //Native speakers: <10'000'000
	"suk":{
        "iso639-2":"suk",
        "english":"Sukuma",
        "native":"Kɪsukuma",
        "flag":"tz"
	},
	"sun":{
        "iso639-2":"sun",
        "english":"Sundanese",
        "native":"Basa Sunda",
        "flag":"id"
	},
	"su":{
        "iso639-2":"sun",
        "english":"Sundanese",
        "native":"Basa Sunda",
        "flag":"id"
	},
    //Native speakers: <10'000'000
	"sus":{
        "iso639-2":"sus",
        "english":"Susu",
        "native":"Sosoxi",
        "flag":"gn"
	},
    //extinct
	"sux":{
        "iso639-2":"sux",
        "english":"Sumerian",
        "native":"Eme-g̃ir / eme-gi",
        "flag":""
	},
	"swa":{
        "iso639-2":"swa",
        "english":"Swahili",
        "native":"Kiswahili",
        "flag":"tz"
	},
	"sw":{
        "iso639-2":"swa",
        "english":"Swahili",
        "native":"Kiswahili",
        "flag":"tz"
	},
	"swe":{
        "iso639-2":"swe",
        "english":"Swedish",
        "native":"Svenska",
        "flag":"se"
	},
	"sv":{
        "iso639-2":"swe",
        "english":"Swedish",
        "native":"Svenska",
        "flag":"se"
	},
    //extinct
	"syc":{
        "iso639-2":"syc",
        "english":"Classical Syriac",
        "native":"ܠܫܢܐ ܣܘܪܝܝܐ‎ / Leššānā Suryāyā",
        "flag":""
	},
    //extinct ?? although, don't know the difference between this and the one above....
	"syr":{
        "iso639-2":"syr",
        "english":"Syriac",
        "native":"Syriac",
        "flag":""
	},
    //Native speakers: <100'000
	"tah":{
        "iso639-2":"tah",
        "english":"Tahitian",
        "native":"Reo Tahiti / Reo Mā'ohi",
        "flag":"french_polynesia"
	},
    //Native speakers: <100'000
	"ty":{
        "iso639-2":"tah",
        "english":"Tahitian",
        "native":"Reo Tahiti / Reo Mā'ohi",
        "flag":"french_polynesia"
	},
    //language group
	"tai":{
        "iso639-2":"tai",
        "english":"Tai Languages",
        "native":"Tai Languages",
        "flag":""
	},
	"tam":{
        "iso639-2":"tam",
        "english":"Tamil",
        "native":"தமிழ் / tamiḻ",
        "flag":"lk"
	},
	"ta":{
        "iso639-2":"tam",
        "english":"Tamil",
        "native":"தமிழ் / tamiḻ",
        "flag":"lk"
	},
	"tat":{
        "iso639-2":"tat",
        "english":"Tatar",
        "native":"татар теле / tatar tele / تاتار تيلی‎",
        "flag":"tatarstan"
	},
	"tt":{
        "iso639-2":"tat",
        "english":"Tatar",
        "native":"татар теле / tatar tele / تاتار تيلی‎",
        "flag":"tatarstan"
	},
	"tel":{
        "iso639-2":"tel",
        "english":"Telugu",
        "native":"తెలుగు / telugu",
        "flag":"in"
	},
	"te":{
        "iso639-2":"tel",
        "english":"Telugu",
        "native":"తెలుగు / telugu",
        "flag":"in"
	},
    //Native speakers: <10'000'000
	"tem":{
        "iso639-2":"tem",
        "english":"Timne",
        "native":"KʌThemnɛ",
        "flag":"sl"
	},
    //Native speakers: <100'000
	"ter":{
        "iso639-2":"ter",
        "english":"Tereno",
        "native":"Terêna",
        "flag":"br"
	},
    //Native speakers: <1'000'000
	"tet":{
        "iso639-2":"tet",
        "english":"Tetum",
        "native":"Lia-Tetun",
        "flag":"tl"
	},
    //Native speakers: <10'000'000
	"tgk":{
        "iso639-2":"tgk",
        "english":"Tajik",
        "native":"тоҷикӣ / تاجیکی / toçikī‎",
        "flag":"tj"
	},
    //Native speakers: <10'000'000
	"tg":{
        "iso639-2":"tgk",
        "english":"Tajik",
        "native":"тоҷикӣ / تاجیکی / toçikī‎",
        "flag":"tj"
	},
	"tgl":{
        "iso639-2":"tgl",
        "english":"Tagalog",
        "native":"Wikang Tagalog",
        "flag":"ph"
	},
	"tl":{
        "iso639-2":"tgl",
        "english":"Tagalog",
        "native":"Wikang Tagalog",
        "flag":"ph"
	},
	"tha":{
        "iso639-2":"tha",
        "english":"Thai",
        "native":"Siamese / ภาษาไทย / phasa thai",
        "flag":"th"
	},
	"th":{
        "iso639-2":"tha",
        "english":"Thai",
        "native":"Siamese / ภาษาไทย / phasa thai",
        "flag":"th"
	},
    //Native speakers: <10'000'000
	"tib":{
        "iso639-2":"tib",
        "english":"Tibetan",
        "native":"ལྷ་སའི་སྐད་ / lha-sa'i skad",
        "flag":"tibet"
	},
    //Native speakers: <10'000'000
	"bod":{
        "iso639-2":"tib",
        "english":"Tibetan",
        "native":"ལྷ་སའི་སྐད་ / lha-sa'i skad",
        "flag":"tibet"
	},
    //Native speakers: <10'000'000
	"bo":{
        "iso639-2":"tib",
        "english":"Tibetan",
        "native":"ལྷ་སའི་སྐད་ / lha-sa'i skad",
        "flag":"tibet"
	},
    //Native speakers: <10'000'000
	"tig":{
        "iso639-2":"tig",
        "english":"Tigre / Xasa",
        "native":"Tigre",
        "flag":"er"
	},
    //Native speakers: <10'000'000
	"tir":{
        "iso639-2":"tir",
        "english":"Tigrinya",
        "native":"Tigrinya / Tigrigna",
        "flag":"et"
	},
    //Native speakers: <10'000'000
	"ti":{
        "iso639-2":"tir",
        "english":"Tigrinya",
        "native":"Tigrinya / Tigrigna",
        "flag":"et"
	},
    //Native speakers: <10'000'000
	"tiv":{
        "iso639-2":"tiv",
        "english":"Tiv",
        "native":"Tiv",
        "flag":"ng"
	},
    //Native speakers: <10'000
	"tkl":{
        "iso639-2":"tkl",
        "english":"Tokelau",
        "native":"Tokelau",
        "flag":"tk"
	},
    //constructed language only a few speakers
	"tlh":{
        "iso639-2":"tlh",
        "english":"Klingon",
        "native":"TlhIngan-Hol",
        "flag":"conlang"
	},
    //Native speakers: <10'000
	"tli":{
        "iso639-2":"tli",
        "english":"Tlingit",
        "native":"Lingít",
        "flag":"indalo_symbol"
	},
    //Native speakers: <1'000'000
	"tmh":{
        "iso639-2":"tmh",
        "english":"Tamashek",
        "native":"Tafaghist",
        "flag":"ml"
	},
    //Native speakers: <1'000'000
	"tog":{
        "iso639-2":"tog",
        "english":"Tonga (Nyasa)",
        "native":"ChiTonga",
        "flag":"mw"
	},
    //Native speakers: <100'000
	"ton":{
        "iso639-2":"ton",
        "english":"Tonga (Tonga Islands)",
        "native":"Lea faka-Tonga",
        "flag":"to"
	},
    //Native speakers: <100'000
	"to":{
        "iso639-2":"ton",
        "english":"Tonga (Tonga Islands)",
        "native":"Lea faka-Tonga",
        "flag":"to"
	},
    //Native speakers: <1'000'000
	"tpi":{
        "iso639-2":"tpi",
        "english":"Tok Pisin",
        "native":"Tok Pisin",
        "flag":"pg"
	},
    //Native speakers: <10'000
	"tsi":{
        "iso639-2":"tsi",
        "english":"Tsimshian",
        "native":"Tsimshian",
        "flag":"alaska"
	},
    //Native speakers: <10'000'000
	"tsn":{
        "iso639-2":"tsn",
        "english":"Tswana",
        "native":"Setswana",
        "flag":"za"
	},
    //Native speakers: <10'000'000
	"tn":{
        "iso639-2":"tsn",
        "english":"Tswana",
        "native":"Setswana",
        "flag":"za"
	},
	"tso":{
        "iso639-2":"tso",
        "english":"Tsonga",
        "native":"Xitsonga",
        "flag":"za"
	},
	"ts":{
        "iso639-2":"tso",
        "english":"Tsonga",
        "native":"Xitsonga",
        "flag":"za"
	},
    //Native speakers: <10'000'000
	"tuk":{
        "iso639-2":"tuk",
        "english":"Turkmen",
        "native":"Türkmençe / Түркмен дили / تورکمن تیلی / تورکمنچه",
        "flag":"tm"
	},
    //Native speakers: <10'000'000
	"tk":{
        "iso639-2":"tuk",
        "english":"Turkmen",
        "native":"Türkmençe / Түркмен дили / تورکمن تیلی / تورکمنچه",
        "flag":"tm"
	},
    //Native speakers: <10'000'000
	"tum":{
        "iso639-2":"tum",
        "english":"Tumbuka",
        "native":"ChiTumbuka",
        "flag":"mw"
	},
    //language group
	"tup":{
        "iso639-2":"tup",
        "english":"Tupi Languages",
        "native":"Tupi Languages",
        "flag":""
	},
	"tur":{
        "iso639-2":"tur",
        "english":"Turkish",
        "native":"Türkçe",
        "flag":"tr"
	},
	"tr":{
        "iso639-2":"tur",
        "english":"Turkish",
        "native":"Türkçe",
        "flag":"tr"
	},
    //language group
	"tut":{
        "iso639-2":"tut",
        "english":"Altaic Languages",
        "native":"Altaic Languages",
        "flag":""
	},
    //Native speakers: <100'000
	"tvl":{
        "iso639-2":"tvl",
        "english":"Tuvalu",
        "native":"Te Ggana Tuuvalu / Te Gagana Tuuvalu",
        "flag":"tv"
	},
    //Native speakers: <10'000'000
	"twi":{
        "iso639-2":"twi",
        "english":"Twi",
        "native":"Twi",
        "flag":"gh"
	},
    //Native speakers: <10'000'000
	"tw":{
        "iso639-2":"twi",
        "english":"Twi",
        "native":"Twi",
        "flag":"gh"
	},
    //Native speakers: <1'000'000
	"tyv":{
        "iso639-2":"tyv",
        "english":"Tuvinian",
        "native":"тыва дыл / tyva dyl",
        "flag":"tuva"
	},
    //Native speakers: <1'000'000
	"udm":{
        "iso639-2":"udm",
        "english":"Udmurt",
        "native":"удмурт кыл / udmurt kyl",
        "flag":"udmurtia"
	},
    //extinct
	"uga":{
        "iso639-2":"uga",
        "english":"Ugaritic",
        "native":"Ugaritic",
        "flag":""
	},
	"uig":{
        "iso639-2":"uig",
        "english":"Uighur/Uyghur",
        "native":"ئۇيغۇرچە  /  ئۇيغۇر تىلى",
        "flag":"cn"
	},
	"ug":{
        "iso639-2":"uig",
        "english":"Uighur/Uyghur",
        "native":"ئۇيغۇرچە  /  ئۇيغۇر تىلى",
        "flag":"cn"
	},
	"ukr":{
        "iso639-2":"ukr",
        "english":"Ukrainian",
        "native":"Yкраїнська мова / ukrayins'ka mova",
        "flag":"ua"
	},
	"uk":{
        "iso639-2":"ukr",
        "english":"Ukrainian",
        "native":"Yкраїнська мова / ukrayins'ka mova",
        "flag":"ua"
	},
    //Native speakers: <10'000'000
	"umb":{
        "iso639-2":"umb",
        "english":"Umbundu",
        "native":"úmbúndú",
        "flag":"ao"
	},
	"und":{
        "iso639-2":"und",
        "english":"Undetermined",
        "native":"Undetermined",
        "flag":""
	},
	"urd":{
        "iso639-2":"urd",
        "english":"Urdu",
        "native":"اُردُو",
        "flag":"pk"
	},
	"ur":{
        "iso639-2":"urd",
        "english":"Urdu",
        "native":"اُردُو",
        "flag":"pk"
	},
	"uzb":{
        "iso639-2":"uzb",
        "english":"Uzbek",
        "native":"Oʻzbekcha / ўзбекча / اۉزبېکچه",
        "flag":"uz"
	},
	"uz":{
        "iso639-2":"uzb",
        "english":"Uzbek",
        "native":"Oʻzbekcha / ўзбекча / اۉزبېکچه",
        "flag":"uz"
	},
    //Native speakers: <1'000'000
	"vai":{
        "iso639-2":"vai",
        "english":"Vai",
        "native":"Vai",
        "flag":"lr"
	},
    //Native speakers: <10'000'000
	"ven":{
        "iso639-2":"ven",
        "english":"Venda",
        "native":"Tshivenḓa",
        "flag":"za"
	},
    //Native speakers: <10'000'000
	"ve":{
        "iso639-2":"ven",
        "english":"Venda",
        "native":"Tshivenḓa",
        "flag":"za"
	},
	"vie":{
        "iso639-2":"vie",
        "english":"Vietnamese",
        "native":"Tiếng Việt",
        "flag":"vn"
	},
	"vi":{
        "iso639-2":"vie",
        "english":"Vietnamese",
        "native":"Tiếng Việt",
        "flag":"vn"
	},
    //constructed language
	"vol":{
        "iso639-2":"vol",
        "english":"Volapük",
        "native":"Volapük",
        "flag":"conlang"
	},
    //constructed language
	"vo":{
        "iso639-2":"vol",
        "english":"Volapük",
        "native":"Volapük",
        "flag":"conlang"
	},
    //Native  speakers: <100
	"vot":{
        "iso639-2":"vot",
        "english":"Votic",
        "native":"Vađđa ceeli / maaceeli",
        "flag":"ru"
	},
    //language group
	"wak":{
        "iso639-2":"wak",
        "english":"Wakashan Languages",
        "native":"Wakashan Languages",
        "flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"wal":{
        "iso639-2":"wal",
        "english":"Walamo",
        "native":"Walamo / Wolaytta / Ometo",
        "flag":"et"
	},
    //Native speakers: <10'000'000
	"war":{
        "iso639-2":"war",
        "english":"Waray - Waray",
        "native":"Waray",
        "flag":"ph"
	},
    //Native speakers: <100
	"was":{
        "iso639-2":"was",
        "english":"Washo",
        "native":"Wá:šiw ʔítlu",
        "flag":"indalo_symbol"
	},
    //Native speakers: <10'000'000
	"wel":{
        "iso639-2":"wel",
        "english":"Welsh",
        "native":"Cymraeg / y Gymraeg",
        "flag":"wales"
	},
    //Native speakers: <10'000'000
	"cym":{
        "iso639-2":"wel",
        "english":"Welsh",
        "native":"Cymraeg / y Gymraeg",
        "flag":"wales"
	},
    //Native speakers: <10'000'000
	"cy":{
        "iso639-2":"wel",
        "english":"Welsh",
        "native":"Cymraeg / y Gymraeg",
        "flag":"wales"
	},
    //Native speakers: <100'000
	"wen":{
        "iso639-2":"wen",
        "english":"Sorbian Languages",
        "native":"Sorbisch / serbšćina",
        "flag":"de"
	},
    //Native speakers: <1'000'000
	"wln":{
        "iso639-2":"wln",
        "english":"Walloon",
        "native":"Walon",
        "flag":"be"
	},
    //Native speakers: <1'000'000
	"wa":{
        "iso639-2":"wln",
        "english":"Walloon",
        "native":"Walon",
        "flag":"be"
	},
    //Native speakers: <10'000'000
	"wol":{
        "iso639-2":"wol",
        "english":"Wolof",
        "native":"Wollof",
        "flag":"sn"
	},
    //Native speakers: <10'000'000
	"wo":{
        "iso639-2":"wol",
        "english":"Wolof",
        "native":"Wollof",
        "flag":"sn"
	},
	"xal":{
        "iso639-2":"xal",
        "english":"Kalmyk/Oirat",
        "native":"Хальмг келн / Xal‘mg keln / Oirat / Mongγol kelen-ü Oyirad ayalγu",
        "flag":"mn"
	},
    //Native speakers: <10'000'000
	"xho":{
        "iso639-2":"xho",
        "english":"Xhosa",
        "native":"IsiXhosa",
        "flag":"za"
	},
    //Native speakers: <10'000'000
	"xh":{
        "iso639-2":"xho",
        "english":"Xhosa",
        "native":"IsiXhosa",
        "flag":"za"
	},
    //Native speakers: <10'000'000
	"yao":{
        "iso639-2":"yao",
        "english":"Yao",
        "native":"Yao",
        "flag":"mw"
	},
    //Native speakers: <10'000
	"yap":{
        "iso639-2":"yap",
        "english":"Yapese",
        "native":"Yapese",
        "flag":"fm"
	},
    //Native speakers: <10'000'000
	"yid":{
        "iso639-2":"yid",
        "english":"Yiddish",
        "native":"Yidish / Idish",
        "flag":""
	},
    //Native speakers: <10'000'000
	"yi":{
        "iso639-2":"yid",
        "english":"Yiddish",
        "native":"Yidish / Idish",
        "flag":""
	},
	"yor":{
        "iso639-2":"yor",
        "english":"Yoruba",
        "native":"èdè Yorùbá",
        "flag":"ng"
	},
	"yo":{
        "iso639-2":"yor",
        "english":"Yoruba",
        "native":"èdè Yorùbá",
        "flag":"ng"
	},
    //language group
	"ypk":{
        "iso639-2":"ypk",
        "english":"Yupik Languages",
        "native":"Yupik Languages",
        "flag":""
	},
    //Native speakers: <1'000'000
	"zap":{
        "iso639-2":"zap",
        "english":"Zapotec",
        "native":"Diidxazá",
        "flag":"mx"
	},
    //not spoken
	"zbl":{
        "iso639-2":"zbl",
        "english":"Bliss / Blissymbolics / Blissymbols",
        "native":"Bliss / Blissymbolics / Blissymbols",
        "flag":""
	},
    //Native speakers: <10'000
	"zen":{
        "iso639-2":"zen",
        "english":"Zenaga",
        "native":"Tuḍḍungiyya",
        "flag":"sn"
	},
    //Native speakers: none
	"zgh":{
        "iso639-2":"zgh",
        "english":"Standard Moroccan Tamazight",
        "native":"Amazighe standard marocain",
        "flag":"ma"
	},
	"zha":{
        "iso639-2":"zha",
        "english":"Chuang/Zhuang",
        "native":"Ahcuengh / 話僮",
        "flag":"cn"
	},
	"za":{
        "iso639-2":"zha",
        "english":"Chuang/Zhuang",
        "native":"Vahcuengh / 話僮",
        "flag":"cn"
	},
    //language group
	"znd":{
        "iso639-2":"znd",
        "english":"Zande Languages",
        "native":"Zande Languages",
        "flag":""
	},
	"zul":{
        "iso639-2":"zul",
        "english":"Zulu",
        "native":"IsiZulu",
        "flag":"za"
	},
	"zu":{
        "iso639-2":"zul",
        "english":"Zulu",
        "native":"IsiZulu",
        "flag":"za"
	},
    //Native speakers: <10'000
	"zun":{
        "iso639-2":"zun",
        "english":"Zuni",
        "native":"Shiwi'ma",
        "flag":"us"
	},
	"zxx":{
        "iso639-2":"zxx",
        "english":"No Linguistic Content / Not Applicable",
        "native":"No Linguistic Content / Not Applicable",
        "flag":""
	},
    //Native speakers: <10'000'000
	"zza":{
        "iso639-2":"zza",
        "english":"Dimili / Dimli / Kirdki / Kirmanjki / Zaza / Zazaki",
        "native":"Dimili / Dimli / Kirdki / Kirmanjki / Zaza / Zazaki",
        "flag":"tr"
	}
}





// 	"qaa-qtz":{//reserved for local use and not implemented
//      "iso639-2":"",
// 		"english":"Reserved For Local Use",
// 		"native":"Reserved For Local Use",
// 		"flag":""
// 	},
