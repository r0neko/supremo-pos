import SessionManager from "./SessionManager";
import PopupManager from "./PopupManager";
import ElectronManager from "./ElectronManager";
import ExtDisplayManager from "./ExtDisplayManager";

import { SHA256 } from "sha256-js-tools";
import LocaleManager from "./Locale/LocaleManager";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getSerialPorts() {
    if (!ElectronManager.HasElectron() || ElectronManager.GetRemote() == null)
        return [];

    let serialport = ElectronManager.GetRemote().require("serialport");
    let ports = await serialport.SerialPort.list();
    return ports.filter(port => port.vendorId != null && port.productId != null);
}

function getWin32HardwareID() {
    return new Promise((resolve, reject) => {
        let Registry = ElectronManager.GetRemote().require("winreg");

        const regKey = new Registry({
            hive: Registry.HKLM,
            key: '\\SOFTWARE\\Microsoft\\Cryptography',
        })

        regKey.get('MachineGuid', (error, item) => {
            if (error)
                return reject(error)

            resolve(item.value.toLowerCase())
        })
    })
}

function getRPiLinuxHardwareID() {
    let fs = ElectronManager.GetRemote().require("fs");
    let path = ElectronManager.GetRemote().require("path");

    if (!path.existsSync("/proc/cpuinfo")) return null;

    let cpuinfo = fs.readFileSync(path.join("/proc/cpuinfo"), "utf8");
    let id = cpuinfo.match(/Serial\s*:\s*(\w+)/)[1];

    return id;
}

function getLinuxHardwareID() {
    let fs = ElectronManager.GetRemote().require("fs");
    let path = ElectronManager.GetRemote().require("path");

    const urls = ["/var/lib/dbus/machine-id", "/etc/machine-id"];

    for (let url of urls) {
        try {
            if (path.existsSync(url)) {
                let machineId = fs.readFileSync(path.join(url), "utf8");
                return machineId.toString()
                    .replace(/\r+|\n+|\s+/gi, '')
                    .toLowerCase()
            }
        } catch (e) {
        }
    }

    return getRPiLinuxHardwareID();
}

function getMACHash() {
    if (!ElectronManager.HasElectron() || ElectronManager.GetRemote() == null)
        return [];

    let networkInterfaces = ElectronManager.GetRemote().require("os").networkInterfaces();
    let macAddresses = [];

    for (let name in networkInterfaces) {
        if (!name.toLowerCase().startsWith("lo") && !name.toLowerCase().startsWith("vm")) {
            for (let address of networkInterfaces[name]) {
                if (address.mac != null)
                    macAddresses.push(address.mac.toLowerCase().replaceAll(":", ""));
            }
        }
    }

    return SHA256.generate(macAddresses.filter(e => e != "000000000000").join(""));
}

function getCookie(cookiename) {
    var name = cookiename + "=";
    var arrayOfCookies = decodeURIComponent(document.cookie).split(';');

    for (var i = 0; i < arrayOfCookies.length; i++) {
        var aCookie = arrayOfCookies[i];
        while (aCookie.charAt(0) == ' ')
            aCookie = aCookie.substring(1);
        if (aCookie.indexOf(name) == 0)
            return aCookie.substring(name.length, aCookie.length);
    }

    return null;
}

async function getHardwareID() {
    if (!ElectronManager.HasElectron() || ElectronManager.GetRemote() == null) {
        if (getCookie("h") == null)
            document.cookie = "h=" + SHA256.generate("" + Math.floor(Math.random() * 999999) + 1) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

        return SHA256.generate("browser-" + getCookie("h"));
    }

    let hid = getMACHash();

    switch (window.process.platform) {
        case 'win32':
            hid += '-' + SHA256.generate(await getWin32HardwareID());
            break;
        case 'linux':
            hid += '-' + SHA256.generate(await getLinuxHardwareID());
            break;
        default: break;
    }

    return SHA256.generate(hid);
}

function SetScreenSize(width, height) {
    if (!ElectronManager.HasElectron() || ElectronManager.GetRemote() == null)
        return;

    ElectronManager.GetRemote().getCurrentWindow().setSize(width, height);
}

function reboot() {
    return new Promise(async (resolve, reject) => {
        PopupManager.ShowPopup(LocaleManager.GetString("general.info"), LocaleManager.GetString("config.system.message.rebooting"));

        if (ExtDisplayManager.GetDisplay() != null) {
            await ExtDisplayManager.GetDisplay().clearAll();
            await ExtDisplayManager.GetDisplay().print(LocaleManager.GetString("config.system.message.rebootingExternal"));
        }

        await sleep(1000);

        if (SessionManager.GetCurrentSession() != null)
            SessionManager.DestroyCurrent();

        if (ElectronManager.HasElectron()) {
            let child_process = ElectronManager.GetRemote().require("child_process");

            let command = window.process.platform === 'linux' ? "sudo shutdown -r now" : "shutdown /r /t 0";

            child_process.exec(command, (error) => {
                if (error) {
                    PopupManager.ShowPopup(LocaleManager.GetString("general.error"), LocaleManager.GetString("config.system.message.errorRebooting", { error }), [], 1);
                    reject(error);
                } else resolve();
            });
        } else {
            window.location.reload();
            resolve();
        }
    });
}

export default {
    reboot,
    getSerialPorts,
    getHardwareID,
    SetScreenSize
}