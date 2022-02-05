import { Component, Fragment } from "react";
import Button from "../../Button/Button";

import SystemManager from "../../SystemManager";
import PopupManager from "../../PopupManager";

class Settings extends Component {
    reboot_prompt() {
        PopupManager.ShowPopup("Repornire", "Sunteți sigur că doriți repornirea sistemului?", [
            {
                name: "Da",
                callback: () => {
                    setTimeout(() => SystemManager.reboot(), 1000);
                }
            },
            { name: "Nu" }
        ], 2);
    }

    render() {
        return <Fragment>
            <Button onClick={this.reboot_prompt}>Repornire sistem</Button>
        </Fragment>
    }
}

export default Settings; 