import { Component, Fragment, createRef } from "react";
import API from "../../API";
import Button from "../../Button/Button";

import PopupManager from "../../PopupManager";
import Router from "../../Router";
import SessionManager from "../../SessionManager";

import AuthPage from "../../Menu/AuthPage";

class Server extends Component {
    constructor() {
        super();

        this.endpoint = createRef();

        this.state = {
            endpoint: API.GetEndpoint()
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
            API.SetEndpoint(ep);
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

    onChange(e) {
        this.setState({ endpoint: e.target.value });
    }

    render() {
        return <Fragment>
            <div className="mb-3">
                <label class="form-label">Endpoint:</label>
                <input type="text" class="form-control" ref={this.endpoint} value={this.state.endpoint} onChange={this.onChange.bind(this)}/>
            </div>
            <Button onClick={this.set_server.bind(this, this.state.endpoint)}>Schimbare Endpoint</Button>
        </Fragment>
    }
}

export default Server; 