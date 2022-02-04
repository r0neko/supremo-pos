import PopupManager from "./PopupManager";
import Router from "./Router";
import Session from "./Session";

import API from "./API";

import MenuPage from "./Menu/MenuPage";

let session = null;

let callbacks = {
    "SessionExpired": [],
    "SessionDestroyed": [],
    "SessionCreated": []
};

// callback functions
function on(what, callback) {
    return callbacks[what].push(callback) - 1;
}

function call(what, args) {
    callbacks[what].forEach(e => e(...args));
}

function remove(what, id) {
    callbacks[what] = callbacks[what].filter((a, i) => i != id);
}

// session manager functions
function DestroyCurrent() {
    session.destroy();
    session = null;
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
        console.log(e);
        return -2; // unknown error
    }
}

// init the session manager callbacks
function Init() {
    on("SessionExpired", () => {
        PopupManager.ShowPopup({
            currentPopup: {
                title: "Sesiune expirată",
                content: "Sesiunea ta a expirat. Te rugăm să te autentifici din nou.",
                buttons: [{
                    name: "Autentificare",
                    callback: DestroyCurrent
                }]
            }
        });
    });

    on("SessionCreated", () => {
        Router.RenderComponent(<MenuPage />);
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