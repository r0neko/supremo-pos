import { Component } from "react";
import Button from "../Button/Button";
import ModalPage from "../ModalForm/ModalPage"
import Router from "../Router";
import SessionManager from "../SessionManager";
import PopupManager from "../PopupManager";
import LocaleManager from "../Locale/LocaleManager";
import MenuPage from "./MenuPage";
import FPManager from "../FPManager";

const btnStyle = {
    height: "80px",
    width: "100%"
}

class FiscalReportPage extends Component {
    getFooter() {
        return <div className="pos-float-right" style={{ "width": "fit-content" }}>
            <Button onClick={() => Router.RenderComponent(<MenuPage />)}>{LocaleManager.GetString("general.back")}</Button>
        </div>
    }

    placeholder() {
        PopupManager.ShowPopup(LocaleManager.GetString("general.info"), <p>{LocaleManager.GetString("general.message.notImplemented")}</p>, [], 1);
    }

    async doDailyReport(zero = true) {
        if(FPManager.GetFP() == null)
            return PopupManager.ShowPopup(LocaleManager.GetString("general.info"), <p>{LocaleManager.GetString("fiscalReports.message.noFiscalPrinter")}</p>, [], 1);
            
        let p = PopupManager.ShowPopup(LocaleManager.GetString("general.pleaseWait"), <p>{LocaleManager.GetString("fiscalReports.message.generatingDailyReport")}</p>);
        
        try {
            await FPManager.GetFP().performDailyReport(zero);
            PopupManager.ClosePopup(p);
        } catch(ex) {
            PopupManager.ClosePopup(p);
            PopupManager.ShowPopup(LocaleManager.GetString("general.error"), <p>{LocaleManager.GetString("fiscalReports.message.errorGenerating", {error: ex.message})}</p>, [], 1);
            return;
        }
    }

    render() {
        let session = SessionManager.GetCurrentSession();

        if (session == null) return;

        return <ModalPage title={LocaleManager.GetString("menu.fiscalReports")} footer={this.getFooter()}>
            {LocaleManager.GetString("menu.promptSelectReportType")}
            <br />
            <br />
            <div class="container">
                <div class="row">
                    <div class="col">
                        <Button style={btnStyle} onClick={this.doDailyReport.bind(this, true)}>{LocaleManager.GetString("fiscalReports.type.daily")}</Button>
                    </div>
                    <div class="col">
                        <Button style={btnStyle} onClick={this.doDailyReport.bind(this, false)}>{LocaleManager.GetString("fiscalReports.type.verification")}</Button>
                    </div>
                </div>
            </div>
        </ModalPage>
    }
}

export default FiscalReportPage; 