import { Component } from "react"
import TopBar from "../SaleMode/TopBar"
import "../SaleMode/styles/SaleMode.css"
import "../styles/design.css"

import ConfigManager from "../ConfigManager"

import Button from "../Button/Button";
import Router from "../Router";
import SessionManager from "../SessionManager";

import MenuPage from "../Menu/MenuPage";
import AuthPage from "../Menu/AuthPage";

import System from "./pages/System";
import BackOffice from "./pages/BackOffice";
import Server from "./pages/Server";
import Debug from "./pages/Debug";
import ExtDisplay from "./pages/ExtDisplay";
import FiscalPrinter from "./pages/FiscalPrinter";
import LocaleManager from "../Locale/LocaleManager";
import SysInfo from "./pages/SysInfo"

class Settings extends Component {
    constructor() {
        super();

        this.state = {
            selectedElement: 0
        }
    }

    selectElement(index) {
        let menu_items = this.getMenuItems();

        if(menu_items[index].onClick != null)
            menu_items[index].onClick();

        this.setState({
            selectedElement: index
        });
    }

    getMenuItems() {
        return [
            {name: LocaleManager.GetString("config.section.server"), render: <Server />},
            {name: LocaleManager.GetString("config.section.products"), render: <BackOffice />},
            {name: LocaleManager.GetString("config.section.debug"), render: <Debug />},
            {name: LocaleManager.GetString("config.section.system"), render: <System />},
            {name: LocaleManager.GetString("config.section.externalDisplay"), render: <ExtDisplay />},
            {name: LocaleManager.GetString("config.section.fiscalPrinter"), render: <FiscalPrinter />},
            {name: LocaleManager.GetString("config.section.systemInfo"), render: <SysInfo />},
            {name: LocaleManager.GetString("general.exit"), onClick: () => Router.RenderComponent(SessionManager.GetCurrentSession() == null ? <AuthPage /> : <MenuPage />)},
        ];
    }

    componentDidMount() {
        ConfigManager.language.on("update", this.forceUpdate.bind(this, null));
    }

    componentWillUnmount() {
        ConfigManager.language.off("update", this.forceUpdate.bind(this, null));
    }

    render() {
        let menu_items = this.getMenuItems();

        return <div className="pos-sale-container">
            <TopBar />
            <div className="pos-content-container">
                <h1>{LocaleManager.GetString("config.configSystem")}</h1>
                <br />
                <div class="d-flex align-items-start">
                    <div class="nav flex-column nav-pills me-3">
                        {menu_items.map((item, index) => <Button active={this.state.selectedElement == index} onClick={this.selectElement.bind(this, index)} key={index}>{item.name}</Button>)}
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