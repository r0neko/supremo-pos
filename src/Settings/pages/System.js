import { Component, Fragment, createRef } from "react";
import Button from "../../Button/Button";

import SystemManager from "../../SystemManager";
import PopupManager from "../../PopupManager";
import ConfigManager from "../../ConfigManager";
import LocaleManager from "../../Locale/LocaleManager";

class System extends Component {
    constructor() {
        super();

        this.state = {
            language: ConfigManager.language.value,
            aspectRatio: ConfigManager.forceAspectRatio.value
        };

        this.lang = createRef();
    }

    onLanguageUpdate() {
        this.setState({ language: ConfigManager.language.value });
    }

    onAspectRatioUpdate() {
        this.setState({ aspectRatio: ConfigManager.forceAspectRatio.value });
    }

    componentDidMount() {
        ConfigManager.language.on("update", this.onLanguageUpdate.bind(this));
        ConfigManager.forceAspectRatio.on("update", this.onAspectRatioUpdate.bind(this));
    }

    reboot_prompt() {
        PopupManager.ShowPopup(LocaleManager.GetString("general.info"), LocaleManager.GetString("config.system.messages.rebootConfirmation"), [
            {
                name: LocaleManager.GetString("general.yes"),
                callback: SystemManager.reboot
            },
            { name: LocaleManager.GetString("general.no") }
        ], 2);
    }

    saveLanguage() {
        ConfigManager.language.value = this.lang.current.value;
    }

    toggle43() {
        ConfigManager.forceAspectRatio.value = !ConfigManager.forceAspectRatio.value;
    }

    render() {
        return <Fragment>
            <h3>{LocaleManager.GetString("general.power")}</h3>
            <Button onClick={this.reboot_prompt}>{LocaleManager.GetString("config.system.reboot")}</Button>
            <hr />
            <h3>{LocaleManager.GetString("general.screen")}</h3>
            <Button onClick={this.toggle43}>{LocaleManager.GetString("general." + (this.state.aspectRatio ? "disable" : "enable"))}&nbsp;4:3</Button>
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

export default System; 