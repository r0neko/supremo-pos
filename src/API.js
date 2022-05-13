import build_info from "./BuildInfo";
import SessionManager from "./SessionManager";
import ConfigManager from "./ConfigManager";
import SystemManager from "./SystemManager";

async function SearchPLU(plu) {
    return fetchJSON("/api/product?plu=" + encodeURIComponent(plu));
}

async function SearchBarcode(barcode) {
    return fetchJSON("/api/product?barcode=" + encodeURIComponent(barcode));
}

async function Me() {
    if (ConfigManager.demo_mode.value) {
        return {
            id: 1,
            name: "admin",
        };
    }

    return fetchJSON("/api/me");
}

async function Ping() {
    if (ConfigManager.demo_mode.value)
        return { success: true };
    return fetchJSON("/api/ping");
}

async function DestroySession() {
    if (ConfigManager.demo_mode.value)
        return { success: true };
    return fetchJSON("/api/destroy");
}

async function AddProduct(name, price, barcode, plu = null) {
    if (ConfigManager.demo_mode.value)
        return { success: true };
    return fetchJSON("/api/product", {
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
    if (ConfigManager.demo_mode.value)
        return { success: true };
    return fetchJSON("/api/product", {
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

async function StartSaleSession() {
    return fetchJSON("/api/sale/session", {
        method: "POST"
    });
}

async function VoidProductInSaleSession(session, product) {
    return fetchJSON("/api/sale/session/product", {
        method: "DELETE",
        body: JSON.stringify({
            s: session,
            p: product.id
        })
    });
}

async function AddProductToSaleSession(session, product) {
    return fetchJSON("/api/sale/session/product", {
        method: "POST",
        body: JSON.stringify({
            s: session,
            p: product.id,
            q: product.quantity
        })
    });
}

async function CloseSaleSession(session) {
    return fetchJSON("/api/sale/session", {
        method: "DELETE",
        body: JSON.stringify({
            s: session
        })
    });
}

async function AuthenticateUser(user, pass) {
    if (ConfigManager.demo_mode.value)
        return { success: true, token: "fake-token" };
    return fetchJSON("/api/auth", {
        method: "POST",
        body: JSON.stringify({
            u: user,
            p: pass,
            v: build_info.BuildString,
            h: await SystemManager.getHardwareID()
        })
    });
}

async function fetchJSON(url, options = {}) {
    if (options.headers == null)
        options.headers = {};

    if (SessionManager.GetCurrentSession() != null)
        options.headers["X-POS-Session"] = SessionManager.GetCurrentSession().token;

    options.headers["Content-Type"] = "application/json";

    return fetch(ConfigManager.endpoint.value + url, options).then(r => r.json());
}

export default {
    AuthenticateUser,
    Me,
    Ping,
    AddProduct,
    ModifyProduct,
    DestroySession,
    fetchJSON,
    SearchPLU,
    SearchBarcode,
    StartSaleSession,
    AddProductToSaleSession,
    VoidProductInSaleSession,
    CloseSaleSession
};