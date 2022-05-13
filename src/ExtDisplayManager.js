import ConfigManager from "./ConfigManager";
import ElectronManager from "./ElectronManager";
import PopupManager from "./PopupManager";

let currentDisplay = null;

async function Init() {
    let cfg = ConfigManager.externalDisplay.value;

    if (cfg.enabled) {
        if(!ElectronManager.HasElectron() || ElectronManager.GetRemote() == null)
            return PopupManager.ShowPopup("Informatie", "Nu se poate activa ecranul extern. Este necesara rularea aplicatiei oficiale!", [], 2)

        let vfdLibrary = ElectronManager.GetRemote().require("vfd.js");
        let disp = new vfdLibrary[cfg.driver](cfg.port, cfg.baudRate);

        await disp.open();
        currentDisplay = disp;
    }
}

async function Destroy() {
    if(currentDisplay != null)
        await currentDisplay.close();

    currentDisplay = null;
}

function GetDisplay() {
    return currentDisplay;
}

function SetDisplay(e) {
    return currentDisplay = e;
}

export default {
    Init,
    Destroy,
    GetDisplay,
    SetDisplay
};