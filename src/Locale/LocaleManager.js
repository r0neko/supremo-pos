import Romanian from "./ro.json";
import English from "./en.json";
import Thai from "./th.json";

let lang = Romanian;

function GetString(str, ar = {})
{
    if(lang == null) return str;

    let a = str.split(".");
    let target = lang.strings[a[0]];

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

export default {
    GetString
}