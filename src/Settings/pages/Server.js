import { Component, Fragment, createRef } from "react";
import ConfigManager from "../../ConfigManager";
import Button from "../../Button/Button";

import PopupManager from "../../PopupManager";
import Router from "../../Router";
import SessionManager from "../../SessionManager";

import AuthPage from "../../Menu/AuthPage";
import LocaleManager from "../../Locale/LocaleManager";

class Server extends Component {
    constructor() {
        super();

        this.state = {
            endpoint: ConfigManager.endpoint.value,
            tva: ConfigManager.tva.value
        }
    }

    set_server(ep) {
        if (SessionManager.GetCurrentSession() != null) {
            PopupManager.ShowPopup("Informație", "Pentru a schimba server-ul, trebuie sa vă deconectați. Doriți să faceți acest lucru?", [
                {
                    name: "Da",
                    callback: () => {
                        SessionManager.DestroyCurrent();
                        this.set_server(ep);
                    }
                },
                { name: "Nu" }
            ], 2);
        } else {
            ConfigManager.endpoint.value = ep;
            PopupManager.ShowPopup("Informație", "Endpoint modificat cu succes! Este necesară re-autentificarea!", [
                {
                    name: "OK",
                    callback: () => {
                        Router.RenderComponent(<AuthPage />)
                    }
                }
            ], 1);
        }
    }

    onTVAChange(what, val) {
        val = parseFloat(val.target.value);

        this.state.tva[what] = val;
        this.forceUpdate();
    }

    onChange(what, val) {
        val = val.target.value;
        this.setState({ [what]: val });
    }

    render() {
        return <Fragment>
            <h3>{LocaleManager.GetString("config.server.connection")}</h3>
            <div className="mb-3">
                <label class="form-label">{LocaleManager.GetString("config.server.endpoint")}:</label>
                <input type="text" class="form-control" value={this.state.endpoint} onChange={this.onChange.bind(this, "endpoint")} />
            </div>
            <Button onClick={this.set_server.bind(this, this.state.endpoint)}>{LocaleManager.GetString("config.server.changeEndpoint")}</Button>
            <hr />
            <h3>{LocaleManager.GetString("config.configure")}</h3>
            <br />
            <h5>{LocaleManager.GetString("config.vat.quotation")}:</h5>
            <div className="input-group mb-3">
                <span class="input-group-text">{LocaleManager.GetString("config.vat.vatType", {type: "A"})}&nbsp;({LocaleManager.GetString("general.normal.feminine")}, {LocaleManager.GetString("general.default.feminine")})</span>
                <input type="text" class="form-control" value={this.state.tva.a} onChange={this.onTVAChange.bind(this, "a")} />
                <span class="input-group-text">%</span>
            </div>
            <div className="input-group mb-3">
                <span class="input-group-text">{LocaleManager.GetString("config.vat.vatType", {type: "B"})}&nbsp;({LocaleManager.GetString("general.reduced.feminine")})</span>
                <input type="text" class="form-control" value={this.state.tva.b} onChange={this.onTVAChange.bind(this, "b")} />
                <span class="input-group-text">%</span>
            </div>
            <div className="input-group mb-3">
                <span class="input-group-text">{LocaleManager.GetString("config.vat.vatType", {type: "C"})}&nbsp;({LocaleManager.GetString("general.reduced.feminine")})</span>
                <input type="text" class="form-control" value={this.state.tva.c} onChange={this.onTVAChange.bind(this, "c")} />
                <span class="input-group-text">%</span>
            </div>
            <div className="input-group mb-3">
                <span class="input-group-text">{LocaleManager.GetString("config.vat.vatType", {type: "D"})}&nbsp;({LocaleManager.GetString("general.included.feminine")})</span>
                <input type="text" class="form-control" value={this.state.tva.d} onChange={this.onTVAChange.bind(this, "d")} />
                <span class="input-group-text">%</span>
            </div>
            <div className="input-group mb-3">
                <span class="input-group-text">{LocaleManager.GetString("config.vat.vatType", {type: "S"})}&nbsp;({LocaleManager.GetString("config.vat.exemptFromVAT")})</span>
                <input type="text" class="form-control" value={this.state.tva.s} onChange={this.onTVAChange.bind(this, "s")} />
                <span class="input-group-text">%</span>
            </div>
        </Fragment>
    }
}

export default Server; 