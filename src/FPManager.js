import ConfigManager from "./ConfigManager";
import ElectronManager from "./ElectronManager";
import LocaleManager from "./Locale/LocaleManager";
import PopupManager from "./PopupManager";

let fiscalPrinter = null;

async function Init() {
    let cfg = ConfigManager.fiscalPrinter.value;

    if (cfg.enabled) {
        if (!ElectronManager.HasElectron() || ElectronManager.GetRemote() == null)
            return PopupManager.ShowPopup(LocaleManager.GetString("general.info"), LocaleManager.GetString("config.fiscalPrinter.messages.promptInitNotAllowed"), [], 2)

        let fpLibrary = ElectronManager.GetRemote().require("fp.js");
        let fp = new fpLibrary[cfg.driver](cfg.port, {
            baudRate: cfg.baudRate,
            username: cfg.op_user,
            password: cfg.op_passwd
        });

        await fp.open();
        fiscalPrinter = fp;
    }
}

async function Destroy() {
    if (fiscalPrinter != null)
        await fiscalPrinter.close();

    fiscalPrinter = null;
}

function GetFP() {
    return fiscalPrinter;
}

async function TestReceipt() {
    if (fiscalPrinter) {
        await fiscalPrinter.openNonFiscalReceipt();
        await fiscalPrinter.printText("Test receipt");
        await fiscalPrinter.printText("This means that the fiscal printer is working!");
        await fiscalPrinter.closeNonFiscalReceipt();
    }
}

export default {
    Init,
    Destroy,
    GetFP,
    TestReceipt
}