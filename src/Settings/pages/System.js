import { Component, Fragment } from "react";
import Button from "../../Button/Button";

import SystemManager from "../../SystemManager";
import PopupManager from "../../PopupManager";
import ExtDisplayManager from "../../ExtDisplayManager";
import ConfigManager from "../../ConfigManager";

const extDispDrivers = [
    { name: "-", driver: null },
    { name: "Epson (Serial)", driver: "EpsonDisplay", isSerial: true },
]

const serialBaudRates = [
    1200,
    2400,
    4800,
    9600,
    19200,
    38400,
    57600,
    115200
];

class Settings extends Component {
    reboot_prompt() {
        PopupManager.ShowPopup("Repornire", "Sunteți sigur că doriți repornirea sistemului?", [
            {
                name: "Da",
                callback: SystemManager.reboot
            },
            { name: "Nu" }
        ], 2);
    }

    render() {
        return <Fragment>
            <h3>Alimentare</h3>
            <Button onClick={this.reboot_prompt}>Repornire sistem</Button>
        </Fragment>
    }
}

export default Settings; 