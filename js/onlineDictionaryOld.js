function displayWord(){
    const word = document.getElementById("searchedWord").value.toLowerCase();
    if(word == '' || !(word in dictionary)) return;
    document.getElementById("selectedWord").innerHTML = word;
    document.getElementById("lahapek").innerHTML = "<strong>Lahapek spelling: </strong>" + word;
    document.getElementById("ippek").innerHTML = "<strong>Ippek spelling: </strong>" + dictionary[word][1];
    document.getElementById("ipa").innerHTML = "<strong>Pronunciation: </strong>/" + dictionary[word][2] + "/";
    //document.getElementById("LasailtiIpa").innerHTML = "<strong>Lasailti dialect: </strong>/" + getAnyPronunciation(word,rulesLasailti) + "/";
    
    if(dictionary[word][0] == "\\entry"){
        document.getElementById("etymology").innerHTML = "<strong>Etymology: </strong> From " + dictionary[word][4]
        + " <em class='normalFont'>/" + dictionary[word][5] + "/</em> meaning <em>" + dictionary[word][6] + "</em>";
    }
    else if(dictionary[word][0] == "\\entryNoMeaning"){
        document.getElementById("etymology").innerHTML = "<strong>Etymology: </strong> From " + dictionary[word][4]
        + " <em>" + dictionary[word][5] + "</em>";
    }
    else if(dictionary[word][0] == "\\entryUnkownOrigin"){
        document.getElementById("etymology").innerHTML = "<strong>Etymology: </strong> of unknown origin";
    }
    else if(dictionary[word][0] == "\\entryFreeEtymology"){
        document.getElementById("etymology").innerHTML = "<strong>Etymology: </strong> "
        + CSVBasedintoHTMLbased(dictionary[word][4]);
    }

    document.getElementById("meaning").innerHTML = "<br><strong>" + dictionary[word][3] + " </strong>"
     + CSVBasedintoHTMLbased(dictionary[word][dictionary[word].length-1]);

     if(dictionary[word][3].includes(" v.")){
        conjugateVerb();
        document.getElementById("conjugationButton").style.display = "inline-block";
     }
     else{
        document.getElementById("VerbAndGroup").innerHTML = "";
        document.getElementById("verbTables").innerHTML = "";
        document.getElementById("conjugationButton").style.display = "none";
     }
     if(dictionary[word][3] == "n."){
        document.getElementById("reduplicatedForm").innerHTML = "<strong>Indefinite form: </strong>" + getReduplicatedForm(word,dictionary[word][2]);
     }
     else{
        document.getElementById("reduplicatedForm").innerHTML = "";
     }
     if(["n.","adj.","det."].includes(dictionary[word][3])){
        document.getElementById("conjugationButton").style.display = "inline-block";
        document.getElementById("verbTables").innerHTML = displayDeclensions(word,dictionary[word][2]);
     }
    // document.getElementById("reduplicatedForm").innerHTML = "<strong>Reduplicated form: none</strong>";
}

function CSVBasedintoHTMLbased(string){
    let editedString = string.replace(/\\textit{([^}]+)}/g, '<em>$1</em>');
    editedString = editedString.replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>');
    editedString = editedString.replace(/\\continue{([^}]*)}{([^}]*)}/, '<br><strong>$1</strong> $2');
    //editedString = editedString.replace(/\/([^\/]*)\//g, '<em class="normalFont">/$1/</em>');
    return editedString;
}

var nasalCounterparts = {
    "ã":"ə",
    "ẽ":"ɛ",
    "ĩ":"ɪ",
    "õ":"ɔ",
    "ũ":"ʊ"
}
var nasalize = {
    "ə":"ã",
    "ɛ":"ẽ",
    "ɪ":"ĩ",
    "ɔ":"õ",
    "ʊ":"ũ",
    "a":"ã",
    "e":"ẽ",
    "i":"ĩ",
    "o":"õ",
    "u":"ũ"
}
var strongCounterparts = {
    "ə":"a",
    "ɛ":"e",
    "ɪ":"i",
    "ɔ":"o",
    "ʊ":"u"
}

function getReduplicatedForm(word, pronunciation){
    let lastLetter = word[word.length-1];
    if(['a','e','i','o','u'].includes(lastLetter)){
        let lastOnset = get_post_reduced_form(word)[0];
        if(['a','e','i','o','u'].includes(lastOnset)) return word + ' <em class="normalFont">/' + pronunciation + '/</em>';
        let plural = word + lastOnset;
        if(word[word.length-1] == 'e'){
            plural = word.slice(0,-1) + 'a' + lastOnset;
            return plural + ' <em class="normalFont">/' + pronunciation + getPronunciation(plural).slice(-2) + '/</em>';
        }
        if(pronunciation.slice(-2) == "n̩"){
            return plural + ' <em class="normalFont">/' + getPronunciation(plural) + '/</em>';
        }
        let newP = getPronunciation(plural);
        if(['a','e','i','o','u',"ə","ɛ","ɪ","ɔ","ʊ","ã","ẽ","ĩ","õ","ũ"].includes(newP[newP.length-1])
            && pronunciation[pronunciation.length-1] != 'j'){
                return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + getPronunciation(plural).slice(-1) + '/</em>';
        }
        return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + getPronunciation(plural).slice(-2) + '/</em>';
    }
    else{
        if(lastLetter == 't') return word + 'je <em class="normalFont">/' + pronunciation.slice(0,-1) + 't͡s/</em>';
        else if(lastLetter == 'k') return word += 'je <em class="normalFont">/' + pronunciation.slice(0,-1) + 't͡ʃ/</em>';
        else if(lastLetter == 'p') return word += 'pe <em class="normalFont">/' + pronunciation.slice(0,-1) + 'ɸ/</em>';
        else if(['m','n','s', 'r', 'l', 'j', 'w'].includes(lastLetter)){
            let plural = word + word[word.length-2];
            if(lastLetter == 's' || lastLetter == 'r') return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + 'r/</em>';
            if(lastLetter == 'l'){
                if(pronunciation[pronunciation.length-1] == 'u'){
                    let lastV = getPronunciation(word.slice(0,-1));
                    lastV = lastV[lastV.length-1];
                    return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + lastV + 'l/</em>';
                } 
                return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + 'l/</em>';
            } 
            if(lastLetter == 'j') return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + 'j/</em>';
            if(lastLetter == 'w') return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + 'ɸ/</em>';
            if(lastLetter == 'm'){
                let toChop = -2;
                if(pronunciation[pronunciation.length-1] == 'ũ') toChop = -1;
                return plural + ' <em class="normalFont">/' + 
                pronunciation.slice(0,toChop) + nasalCounterparts[pronunciation[pronunciation.length+toChop]] + 'm/</em>';
            }
            if(lastLetter == 'n'){
                return plural + ' <em class="normalFont">/' + 
                pronunciation.slice(0,-1) + nasalCounterparts[pronunciation[pronunciation.length-1]] + 'n/</em>';
            } 
        } 
        else return word + ' <em class="normalFont">/' + pronunciation + '/</em>';
    }
}

var suffixTermination = {
    "n":"",
    "me":"m",
    "ns":"ʃ",
    "l":"w",
    "nt":"s",
    "nk":"j",
    "nf":"j",
    "ntep":"teɸ",
    "np":"ɸ"
}

function applyCaseSuffix(word, pronunciation, suffix){
    let newW = word;
    let newP = pronunciation;

    let countToRemove = 1;
    let finalN = false;
    let dontRemove = false;
    if(['h','f','n'].includes(word[word.length-1]) ||(word.length > 1 && ['ul','um'].includes(word.slice(-2)))){
        newW = newW.slice(0,-1);
    }
    else if(pronunciation.length > 1 && pronunciation.slice(-2) == "n̩"){
        finalN = true;
    }
    else if(!['a','i','u','o'].includes(word[word.length-1])){
        newW = newW.slice(0,-1); countToRemove++;
    }

    if(!['a','i','u','e','o'].includes(newW[newW.length-1]) && word[word.length-1] == 'e'){
        newW = newW.slice(0,-1);
    }

    if(!['a','i','u','e','o'].includes(newW[newW.length-1])){
        newW += 'i'; countToRemove = 1;
    } 
    if(word.length > 2 && ['kje','tje'].includes(word.slice(-3))){
        dontRemove = true;
    }

    let toAdd = 'n';
    if(['me','l','nf'].includes(suffix)) toAdd = 'h';

    //strill has to be perfected, lazy alternative as of now
    if(finalN){
        let y = word.slice(0,-1);
        y = get_post_reduced_form(y);
        let vowel = "";
        for(let x of y) if(['a','e','i','o','u'].includes(x)) vowel = x;
        if(['h','f'].includes(y[y.length-1])) vowel += 'h';
        newP = pronunciation.slice(0,-2) + getPronunciation(vowel) + getPronunciation('i' + toAdd) + suffixTermination[suffix];
        newP = newP.slice(0,-2) + newP.slice(-2).replace("ij","ɛj").replace("ĩj","ẽj").replace("uw","u");
        return newW + suffix  + ' <em class="normalFont">/' + newP + '/</em>';
    }

    let lastPronunciation = getPronunciation(newW[newW.length-1] + toAdd) + suffixTermination[suffix];
    newP = pronunciation + lastPronunciation;
    //problems with word final Vli
    if(!dontRemove) newP = pronunciation.slice(0,-countToRemove) + lastPronunciation;
    newP = newP.slice(0,-2) + newP.slice(-2).replace("ij","ɛj").replace("ĩj","ẽj").replace("uw","u");
    //newP = newP.replace("dt","d").replace("gk","g").replace("bp","b");
    newW += suffix;
    return newW + ' <em class="normalFont">/' + newP + '/</em>';
}

function displayDeclensions(word, pronunciation){
    let all_declensions = [
        ['Nominative',word + ' <em class="normalFont">/' + pronunciation + '/</em>', "Accusative", applyCaseSuffix(word,pronunciation,"n")],
        ['Dative', applyCaseSuffix(word,pronunciation,"me"), "Locative", applyCaseSuffix(word,pronunciation,"ns")],
        ['Instrumental', applyCaseSuffix(word,pronunciation,"l"), "Comitative", applyCaseSuffix(word,pronunciation,"nt")],
        ['Abessive', applyCaseSuffix(word,pronunciation,"nk"), "Ablative", applyCaseSuffix(word,pronunciation,"nf")],
        ['Genitive', applyCaseSuffix(word,pronunciation,"ntep"), "S. Genitive", applyCaseSuffix(word,pronunciation,"np")]
    ]
    return make_table("Declensions",all_declensions)
}