import build_info from "./BuildInfo";
import SessionManager from "./SessionManager";

let ServerEndpoint = "http://vcs.r0neko.me:1282"; // temporary endpoint

function GetEndpoint() {
    return ServerEndpoint;
}

function SetEndpoint(e) {
    return ServerEndpoint = e;
}

async function SearchProductID(prid) {
    return fetchJSON(ServerEndpoint + "/api/product?plu=" + encodeURIComponent(prid));
}

async function Me() {
    return fetchJSON(ServerEndpoint + "/api/me");
}

async function Ping() {
    return fetchJSON(ServerEndpoint + "/api/ping");
}

async function DestroySession() {
    return fetchJSON(ServerEndpoint + "/api/destroy");
}

async function AddProduct(name, price, barcode, plu = null) {
    return fetchJSON(ServerEndpoint + "/api/product", {
        method: "POST",
        body: JSON.stringify({
            name,
            price,
            barcode,
            plu
        })
    });
}

async function ModifyProduct(id, name, price, barcode, plu = null) {
    return fetchJSON(ServerEndpoint + "/api/product", {
        method: "PUT",
        body: JSON.stringify({
            id,
            name,
            price,
            barcode,
            plu
        })
    });
}

async function AuthenticateUser(user, pass) {
    return fetchJSON(ServerEndpoint + "/api/auth", {
        method: "POST",
        body: JSON.stringify({
            u: user,
            p: pass,
            version: build_info.BuildString
        })
    });
}

async function fetchJSON(url, options = {}) {
    if (options.headers == null)
        options.headers = {};

    if (SessionManager.GetCurrentSession() != null)
        options.headers["X-POS-Session"] = SessionManager.GetCurrentSession().token;

    options.headers["Content-Type"] = "application/json";

    console.log(options);

    return fetch(url, options).then(r => r.json());
}

export default {
    SearchProductID,
    AuthenticateUser,
    Me,
    Ping,
    AddProduct,
    ModifyProduct,
    DestroySession,
    GetEndpoint,
    SetEndpoint,
    fetchJSON
};