function HasElectron() {
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer')
        return true;
    else if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron)
        return true;
    else if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0)
        return true;

    return false;
}

function GetRemote() {
    return window.require == null ? null : window.require("@electron/remote");
}

export default {
    GetRemote,
    HasElectron
}