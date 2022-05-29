import { Component, Fragment } from "react";
import Button from "../../Button/Button";

import ConfigManager from "../../ConfigManager";
import ElectronManager from "../../ElectronManager";
import LocaleManager from "../../Locale/LocaleManager";
import SystemManager from "../../SystemManager";

class Debug extends Component {
    constructor() {
        super();

        this.state = {
            debug_stats: ConfigManager.show_debug_stats.value,
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
        ConfigManager.demo_mode.on("update", this.onConfigUpdate.bind(this, "demo_mode"));
        ConfigManager.touch_beep.on("update", this.onConfigUpdate.bind(this, "touch_beep"));
    }

    componentWillUnmount() {
        ConfigManager.show_debug_stats.off("update", this.onConfigUpdate.bind(this, "debug_stats"));
        ConfigManager.demo_mode.off("update", this.onConfigUpdate.bind(this, "demo_mode"));
        ConfigManager.touch_beep.off("update", this.onConfigUpdate.bind(this, "touch_beep"));
    }

    setScreenSize() {
        SystemManager.SetScreenSize(1024, 768);
    }

    setKiosk(s = false) {
        ElectronManager.GetRemote().getCurrentWindow().setKiosk(s);
    }

    hwidToClipboard() { 
        SystemManager.getHardwareID().then(hwid => navigator.clipboard.writeText(hwid));
    }

    render() {
        return <Fragment>
            <Button onClick={this.toggleParam.bind(this, "show_debug_stats")}>{LocaleManager.GetString("general." + (this.state.debug_stats ? "hide" : "show"))}&nbsp;{LocaleManager.GetString("debug.debugStats")}</Button><br /><br />
            <Button onClick={this.toggleParam.bind(this, "demo_mode")}>{LocaleManager.GetString("general." + (this.state.demo_mode ? "disable" : "enable"))}&nbsp;{LocaleManager.GetString("debug.demoMode")}</Button><br /><br />
            <Button onClick={this.toggleParam.bind(this, "touch_beep")}>{LocaleManager.GetString("general." + (this.state.touch_beep ? "disable" : "enable"))}&nbsp;{LocaleManager.GetString("debug.touchBeep")}</Button><br /><br />
            <Button onClick={this.setScreenSize.bind(this)}>{LocaleManager.GetString("debug.force1024x768")}</Button><br /><br />
            <Button onClick={this.setKiosk.bind(this, false)}>{LocaleManager.GetString("debug.disableKiosk")}</Button><br /><br />
            <Button onClick={this.setKiosk.bind(this, true)}>{LocaleManager.GetString("debug.enableKiosk")}</Button><br /><br />
            <Button onClick={this.hwidToClipboard.bind(this)}>{LocaleManager.GetString("debug.copyHwidToClipboard")}</Button><br /><br />
        </Fragment>
    }
}

export default Debug; 
