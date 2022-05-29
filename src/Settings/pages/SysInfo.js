import { Component, Fragment } from "react";
import Logo from "../../Assets/SPOSLogoDark.png";
import { BuildString } from "../../BuildInfo";
import ElectronManager from "../../ElectronManager";

import LocaleManager from "../../Locale/LocaleManager";
import SystemManager from "../../SystemManager";

class SysInfo extends Component {
    constructor() {
        super();

        this.state = {
            hwid: null
        }
    }

    getSystemFragment() {
        if (this.state.hwid == null)
            SystemManager.getHardwareID().then(hwid => this.setState({ hwid }));

        return <Fragment>
            <h3>{LocaleManager.GetString("general.system")}</h3>
            <p className="text-center">{LocaleManager.GetString("config.systemInfo.os", { os: ElectronManager.HasElectron() ? window.process.platform : "browser" })}</p>
            <p className="text-center">{LocaleManager.GetString("config.systemInfo.deviceId", { deviceId: this.state.hwid || "..." })}</p>
        </Fragment>
    }

    render() {
        return <Fragment>
            <h3>{LocaleManager.GetString("general.version")}</h3>
            <img src={Logo} alt="SPOS Logo" className="mx-auto d-block"></img>
            <p className="text-center">{LocaleManager.GetString("general.build")}&nbsp;{BuildString}</p>
            {this.getSystemFragment()}
        </Fragment>
    }
}

export default SysInfo; 