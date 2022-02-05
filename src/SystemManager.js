import SessionManager from "./SessionManager";
import PopupManager from "./PopupManager";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function reboot() {
    let p = PopupManager.ShowPopup("Repornire Sistem", "Se incheie sesiunea...");

    if (SessionManager.GetCurrentSession() != null)
        SessionManager.DestroyCurrent();

    PopupManager.SetContent(p, "Se repornește sistemul...");
    //document.location.reload();
}

export default {
    reboot
}