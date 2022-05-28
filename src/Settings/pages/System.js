import { Component, Fragment, createRef } from "react";
import Button from "../../Button/Button";

import SystemManager from "../../SystemManager";
import PopupManager from "../../PopupManager";
import ConfigManager from "../../ConfigManager";
import LocaleManager from "../../Locale/LocaleManager";

class Settings extends Component {
    constructor() {
        super();

        this.state = {
            language: ConfigManager.language.value,
        };

        this.lang = createRef();
    }

    onLanguageUpdate() {
        this.setState({ language: ConfigManager.language.value });
    }

    componentDidMount() {
        ConfigManager.language.on("update", this.onLanguageUpdate.bind(this));
    }

    reboot_prompt() {
        PopupManager.ShowPopup("Repornire", "Sunteți sigur că doriți repornirea sistemului?", [
            {
                name: "Da",
                callback: SystemManager.reboot
            },
            { name: "Nu" }
        ], 2);
    }

    saveLanguage() {
        ConfigManager.language.value = this.lang.current.value;
    }

    render() {
        return <Fragment>
            <h3>{LocaleManager.GetString("general.power")}</h3>
            <Button onClick={this.reboot_prompt}>{LocaleManager.GetString("config.system.reboot")}</Button>
            <hr />
            <h3>{LocaleManager.GetString("general.language")}</h3>
            <select class="form-select mb-3 mt-3" ref={this.lang}>
                {
                    LocaleManager.GetLanguages().map((l) => {
                        return <option value={l.id} selected={l.id == this.state.language}>{l.name}</option>
                    })
                }
            </select>
            <Button onClick={this.saveLanguage.bind(this)}>{LocaleManager.GetString("general.save")}</Button>
        </Fragment>
    }
}

export default Settings; 