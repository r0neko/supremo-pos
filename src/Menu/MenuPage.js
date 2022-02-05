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

const btnStyle = {
    height: "80px"
}

class MenuPage extends Component {
    getFooter() {
        return <div className="pos-float-right" style={{ "width": "fit-content" }}>
            <ButtonDanger onClick={this.disconnect}>Deconectare</ButtonDanger>
            <ButtonDanger onClick={this.exit}>Ieși din SupremoPOS</ButtonDanger>
        </div>
    }

    componentDidMount() {
        let d = ExtDisplayManager.GetDisplay();
        d.clearAll();

        d.printLine("Buna ziua!", 1);
    }

    placeholder() {
        PopupManager.ShowPopup("Informație", <p>Funcția nu a fost implementată! Încercăm să implementăm funcția cât mai curând!</p>, [
            { name: "OK" }
        ], 1);
    }

    disconnect() {
        PopupManager.ShowPopup("Informație", <p>Ești sigur că doresti să te deconectezi?</p>, [
            {
                name: "Da", callback: () => {
                    SessionManager.DestroyCurrent();
                    Router.RenderComponent(<AuthPage />);
                }
            },
            { name: "Nu" }
        ], 2);
    }

    exit() {
        if(true) {
            return PopupManager.ShowPopup("Informație", <p>SupremoPOS nu rulează sub aplicația nativă.</p>, [
                { name: "OK" }
            ], 1);
        }

        PopupManager.ShowPopup("Informație", <p>Esti sigur că dorești să ieși din SupremoPOS?</p>, [
            {
                name: "Da", callback: () => {
                    SessionManager.DestroyCurrent();
                    // exit
                }
            },
            { name: "Nu" }
        ], 2);
    }

    render() {
        let session = SessionManager.GetCurrentSession();

        if(session == null) return;

        return <ModalPage title="Meniu principal" footer={this.getFooter()}>
            Bine ai venit, {session.user.name}({session.user.id})<br />
            Selectează un mod de funcționare pentru a începe sesiunea.
            <br />
            <br />
            <div class="container">
                <div class="row">
                    <div class="col">
                        <Button style={btnStyle} onClick={() => Router.RenderComponent(<SaleModeNew />)}>Mod Vânzare</Button>
                    </div>
                    <div class="col">
                        <Button style={btnStyle} onClick={this.placeholder}>Raporturi Fiscale</Button>
                    </div>
                    <div class="col">
                        <Button style={btnStyle} onClick={() => Router.RenderComponent(<Settings />)}>Configurare Sistem</Button>
                    </div>
                </div>
            </div>
        </ModalPage>
    }
}

export default MenuPage; 