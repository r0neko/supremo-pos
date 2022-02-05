import { Component } from "react"
import TopBar from "../SaleMode/TopBar"
import "../SaleMode/styles/SaleMode.css"
import "../styles/design.css"

import Button from "../Button/Button";
import Router from "../Router";
import SessionManager from "../SessionManager";

import MenuPage from "../Menu/MenuPage";
import AuthPage from "../Menu/AuthPage";

import System from "./pages/System";
import BackOffice from "./pages/BackOffice";
import Server from "./pages/Server";

const menu_items = [
    {name: "Server", render: <Server />},
    {name: "Produse", render: <BackOffice />},
    {name: "Dezvoltare", render: <p>Inca in lucru!</p>},
    {name: "Sistem", render: <System />},
    {name: "Ieșire", onClick: () => Router.RenderComponent(SessionManager.GetCurrentSession() == null ? <AuthPage /> : <MenuPage />)},
];

class Settings extends Component {
    constructor() {
        super();

        this.state = {
            selectedElement: 0
        }
    }

    selectElement(index) {
        if(menu_items[index].onClick != null)
            menu_items[index].onClick();

        this.setState({
            selectedElement: index
        });
    }

    render() {
        return <div className="pos-sale-container">
            <TopBar />
            <div className="pos-content-container">
                <h1>Configurare Sistem</h1>
                <br />
                <div class="d-flex align-items-start">
                    <div class="nav flex-column nav-pills me-3">
                        {menu_items.map((item, index) => <Button active={this.state.selectedElement == index} onClick={this.selectElement.bind(this, index)}>{item.name}</Button>)}
                    </div>
                    <div class="tab-content" style={{width: "100%", height: "100%", backgroundColor: "white", padding: "10px"}}>
                        {menu_items.find((item, index) => index == this.state.selectedElement).render || ""}
                    </div>
                </div>
            </div>
        </div >
    }
}

export default Settings; 