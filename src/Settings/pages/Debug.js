import { Component, Fragment } from "react";
import Button from "../../Button/Button";

import ConfigManager from "../../ConfigManager";
import ElectronManager from "../../ElectronManager";
import SystemManager from "../../SystemManager";

class Debug extends Component {
    constructor() {
        super();

        this.state = {
            debug_stats: ConfigManager.show_debug_stats.value,
            virtual_display: ConfigManager.show_display.value,
            demo_mode: ConfigManager.demo_mode.value,
            touch_beep: ConfigManager.touch_beep.value
        };
    }

    onConfigUpdate(param, new_val) {
        this.setState({
            [param]: new_val
        })
    }

    toggleParam(param) {
        ConfigManager[param].value = !ConfigManager[param].value;
    }

    componentDidMount() {
        ConfigManager.show_debug_stats.on("update", this.onConfigUpdate.bind(this, "debug_stats"));
        ConfigManager.show_display.on("update", this.onConfigUpdate.bind(this, "virtual_display"));
        ConfigManager.demo_mode.on("update", this.onConfigUpdate.bind(this, "demo_mode"));
        ConfigManager.touch_beep.on("update", this.onConfigUpdate.bind(this, "touch_beep"));
    }

    componentWillUnmount() {
        ConfigManager.show_debug_stats.off("update", this.onConfigUpdate.bind(this, "debug_stats"));
        ConfigManager.show_display.off("update", this.onConfigUpdate.bind(this, "virtual_display"));
        ConfigManager.demo_mode.off("update", this.onConfigUpdate.bind(this, "demo_mode"));
        ConfigManager.touch_beep.off("update", this.onConfigUpdate.bind(this, "touch_beep"));
    }

    setScreenSize() {
        SystemManager.SetScreenSize(1024, 768);
    }

    setFrameless(s = false) {
        ElectronManager.GetRemote().getCurrentWindow().setKiosk(s);
    }

    hwidToClipboard() { 
        SystemManager.getHardwareID().then(hwid => navigator.clipboard.writeText(hwid));
    }

    render() {
        return <Fragment>
            <Button onClick={this.toggleParam.bind(this, "show_debug_stats")}>{this.state.debug_stats ? "Ascundere" : "Afișare"} Statistici Debug</Button><br /><br />
            <Button onClick={this.toggleParam.bind(this, "show_display")}>{this.state.virtual_display ? "Ascundere" : "Afișare"} Ecran Virtual</Button><br /><br />
            <Button onClick={this.toggleParam.bind(this, "demo_mode")}>{this.state.demo_mode ? "Dezactivare" : "Activare"} Mod Demo</Button><br /><br />
            <Button onClick={this.toggleParam.bind(this, "touch_beep")}>{this.state.touch_beep ? "Dezactivare" : "Activare"} Beep la Touch</Button><br /><br />
            <Button onClick={this.setScreenSize.bind(this)}>Setare 1024x768</Button><br /><br />
            <Button onClick={this.setFrameless.bind(this, false)}>Mod fereastra</Button><br /><br />
            <Button onClick={this.setFrameless.bind(this, true)}>Mod fara rama</Button><br /><br />
            <Button onClick={this.hwidToClipboard.bind(this)}>Copiere HWID in Clipboard</Button><br /><br />
        </Fragment>
    }
}

export default Debug; 
