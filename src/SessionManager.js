import PopupManager from "./PopupManager";
import Router from "./Router";
import Session from "./Session";

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
    call("SessionCreated", [session]);
}

function GetCurrentSession() {
    return session;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function Authenticate(user, password) {
    await delay(500); // simulate network delay

    SetCurrent(new Session({
        name: user,
        id: 1
    }));

    return 0; // success
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