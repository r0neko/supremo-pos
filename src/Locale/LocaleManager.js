import Romanian from "./ro.json";
import English from "./en.json";

import ConfigManager from "../ConfigManager";

const all_languages = {
    "ro": Romanian,
    "en": English
}

function GetLanguageName(lang) {
    return all_languages[lang].nativeName || all_languages[lang].name;
}

function GetString(str, ar = {})
{
    let current_language = all_languages[ConfigManager.language.value];

    if(current_language == null) return str;

    let a = str.split(".");
    let target = current_language.strings[a[0]];

    if(target == null) return str;

    for(let i = 1; i < a.length; i++) {
        target = target[a[i]];
        if(target == null) return str;
    }

    if(ar != null) {
        let keys = Object.keys(ar);

        for(let i = 0; i < keys.length; i++)
            target = target.replaceAll("%" + keys[i] + "%", ar[keys[i]]);
    }

    return target;
}

function GetLanguages() {
    return Object.keys(all_languages).map(l => ({id: l, name: GetLanguageName(l)}));
}

export default {
    GetString,
    GetLanguages,
    GetLanguageName
}