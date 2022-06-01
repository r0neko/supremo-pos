import ConfigEntry from "./ConfigEntry"

const config = {
    endpoint: new ConfigEntry("endpoint", "http://vcs.r0neko.me:1282"),
    show_display: new ConfigEntry("show_display", true),
    language: new ConfigEntry("language", "en"),
    show_debug_stats: new ConfigEntry("show_debug_stats", true),
    demo_mode: new ConfigEntry("demo_mode", false),
    touch_beep: new ConfigEntry("touch_beep", true),
    forceAspectRatio: new ConfigEntry("force_aspect_ratio", false),
    tva: new ConfigEntry("tva", {
        a: 19,
        b: 9,
        c: 5,
        d: 0,
        s: 0
    }),
    externalDisplay: new ConfigEntry("external_display", {
        enabled: false,
        driver: null,
        port: "COM1",
        baudRate: 9600,
        size: {
            x: 20,
            y: 2
        }
    }),
    fiscalPrinter: new ConfigEntry("fiscal_printer", {
        enabled: false,
        driver: null,
        port: "COM1",
        baudRate: 9600,
        op_user: "1",
        op_passwd: "0"
    }),
}

export default config;