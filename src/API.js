import build_info from "./BuildInfo";
import SessionManager from "./SessionManager";

const ServerEndpoint = "http://vcs.r0neko.me:1282"; // temporary endpoint

async function SearchProductID(prid) {
    return fetchJSON(ServerEndpoint + `/api/plu/${prid}`);
}

async function Me() {
    return fetchJSON(ServerEndpoint + "/api/me");
}

async function DestroySession() {
    return fetchJSON(ServerEndpoint + "/api/destroy");
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
    if(options.headers == null)
        options.headers = {};

    if(SessionManager.GetCurrentSession() != null) 
        options.headers["X-POS-Session"] = SessionManager.GetCurrentSession().token;

    options.headers["Content-Type"] = "application/json";

    console.log(options);

    return fetch(url, options).then(r => r.json());
} 

export default {
    SearchProductID,
    AuthenticateUser,
    Me,
    DestroySession,
    fetchJSON
};