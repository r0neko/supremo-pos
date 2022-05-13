import PopupManager from "./PopupManager";
import Router from "./Router";
import Session from "./Session";

import API from "./API";

import MenuPage from "./Menu/MenuPage";
import AuthPage from "./Menu/AuthPage";

let session = null;

let ping_handle = null;
let ping_msg_handle = null;
let failedPings = 0;

let callbacks = {
    "SessionExpired": [],
    "SessionDestroyed": [],
    "SessionCreated": [],
    "SessionPing": [],
    "SessionPingFail": []
};

async function Ping() {
    try {
        let a = Date.now();

        let r = await API.Ping();

        if(r.success == false && r.error.code == 2)
            return call("SessionExpired");

        let b = Date.now();
        call("SessionPing", [b - a]);
    } catch (e) {
        console.error(e);
        call("SessionPingFail");
    }

    ping_handle = setTimeout(Ping, 1500);
}

// callback functions
function on(what, callback) {
    return callbacks[what].push(callback) - 1;
}

function call(what, args = []) {
    callbacks[what].forEach(e => e(...args));
}

function remove(what, id) {
    callbacks[what] = callbacks[what].filter((a, i) => i != id);
}

// session manager functions
function DestroyCurrent() {
    if(session == null) return;
    
    session.destroy();
    session = null;

    if (ping_handle != null)
        clearTimeout(ping_handle);

    ping_handle = null;

    call("SessionDestroyed");
}

function SetCurrent(s) {
    session = s;
}

function GetCurrentSession() {
    return session;
}

async function Authenticate(user, password) {
    try {
        let r = await API.AuthenticateUser(user, password);

        console.log(r);

        if (r.success) {
            let t = new Session(null, r.token)

            SetCurrent(t);

            t.user = await API.Me();
            call("SessionCreated", [t]);

            return 0; // success
        }

        return r.error.code;
    } catch (e) {
        if (e.message == "Failed to fetch")
            return -1; // network error
        return -2; // unknown error
    }
}

// init the session manager callbacks
function Init() {
    on("SessionExpired", () => {
        PopupManager.ShowPopup("Sesiune expirată", "Sesiunea ta a expirat. Te rugăm să te autentifici din nou.", [{
            name: "Autentificare",
            callback: () => {
                DestroyCurrent();
                Router.RenderComponent(<AuthPage />);
            }
        }], 1);
    });

    on("SessionCreated", () => {
        Ping();
        Router.RenderComponent(<MenuPage />);
    })

    on("SessionPing", () => {
        if (failedPings > 0)
            failedPings = 0;

        if (ping_msg_handle != null) {
            PopupManager.ClosePopup(ping_msg_handle);
            ping_msg_handle = null;
        }
    });

    on("SessionPingFail", () => {
        if (failedPings > 3 && ping_msg_handle == null)
            ping_msg_handle = PopupManager.ShowPopup("S-a pierdut conexiunea!",
                <p>S-a pierdut conexiunea cu server-ul! Te rugăm să verifici daca există conexiune la internet.<br />Se reîncearcă conectarea...</p>
            );

        failedPings++;
    })
}

export default {
    Init,
    DestroyCurrent,
    Authenticate,
    GetCurrentSession,
    on,
    remove
}