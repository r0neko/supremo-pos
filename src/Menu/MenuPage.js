import { Component } from "react";
import Button from "../Button/Button";
import ButtonDanger from "../Button/ButtonDanger";
import ModalPage from "../ModalForm/ModalPage"
import Router from "../Router";
import SessionManager from "../SessionManager";
import SaleModeNew from "../SaleMode/SaleModeNew";
import PopupManager from "../PopupManager";
import AuthPage from "./AuthPage";
import ExtDisplayManager from "../ExtDisplayManager";
import Settings from "../Settings/Settings";

import ElectronManager from "../ElectronManager";
import LocaleManager from "../Locale/LocaleManager";

const btnStyle = {
    height: "80px",
    width: "100%"
}

class MenuPage extends Component {
    getFooter() {
        return <div className="pos-float-right" style={{ "width": "fit-content" }}>
            <ButtonDanger onClick={this.disconnect}>{LocaleManager.GetString("general.disconnect")}</ButtonDanger>
            <ButtonDanger onClick={this.exit}>{LocaleManager.GetString("general.exitFromApp")}</ButtonDanger>
        </div>
    }

    componentDidMount() {
        let d = ExtDisplayManager.GetDisplay();
        if (d == null) return;

        d.clearAll();
        d.print(LocaleManager.GetString("menu.externalText"));
    }

    placeholder() {
        PopupManager.ShowPopup(LocaleManager.GetString("general.info"), <p>{LocaleManager.GetString("general.message.notImplemented")}</p>, [], 1);
    }

    disconnect() {
        PopupManager.ShowPopup(LocaleManager.GetString("general.info"), <p>{LocaleManager.GetString("menu.message.disconnectQuestion")}</p>, [
            {
                name: LocaleManager.GetString("general.yes"), callback: () => {
                    SessionManager.DestroyCurrent();
                    Router.RenderComponent(<AuthPage />);
                }
            },
            { name: LocaleManager.GetString("general.no") }
        ], 2);
    }

    exit() {
        if (!ElectronManager.HasElectron()) {
            return PopupManager.ShowPopup(LocaleManager.GetString("general.info"), <p>{LocaleManager.GetString("general.message.notRunningInClient")}</p>, [], 1);
        }

        PopupManager.ShowPopup(LocaleManager.GetString("general.info"), <p>{LocaleManager.GetString("menu.message.exitQuestion")}</p>, [
            {
                name: LocaleManager.GetString("general.yes"), callback: () => {
                    SessionManager.DestroyCurrent();
                    ElectronManager.GetRemote().getCurrentWindow().close();
                }
            },
            { name: LocaleManager.GetString("general.no") }
        ], 2);
    }

    render() {
        let session = SessionManager.GetCurrentSession();

        if (session == null) return;

        return <ModalPage title={LocaleManager.GetString("menu.mainMenu")} footer={this.getFooter()}>
            {LocaleManager.GetString("menu.welcomeText", {
                name: session.user.name,
                id: session.user.id
            })}<br />
            {LocaleManager.GetString("menu.promptSelect")}
            <br />
            <br />
            <div class="container">
                <div class="row">
                    <div class="col">
                        <Button style={btnStyle} onClick={() => Router.RenderComponent(<SaleModeNew />)}>{LocaleManager.GetString("sale.saleMode")}</Button>
                    </div>
                    <div class="col">
                        <Button style={btnStyle} onClick={this.placeholder}>{LocaleManager.GetString("menu.fiscalReports")}</Button>
                    </div>
                    <div class="col">
                        <Button style={btnStyle} onClick={() => Router.RenderComponent(<Settings />)}>{LocaleManager.GetString("menu.configureSystem")}</Button>
                    </div>
                </div>
            </div>
        </ModalPage>
    }
}

export default MenuPage; 