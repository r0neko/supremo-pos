import { Component, Fragment } from "react";
import Button from "../../Button/Button";

import PopupManager from "../../PopupManager";
import ExtDisplayManager from "../../ExtDisplayManager";
import ConfigManager from "../../ConfigManager";
import ElectronManager from "../../ElectronManager";
import SystemManager from "../../SystemManager";
import FPManager from "../../FPManager";
import LocaleManager from "../../Locale/LocaleManager";

const fpDrivers = [
    { name: "-", driver: null },
    { name: "TremolFP (Serial)", driver: "TremolSerial", isSerial: true, operator: true },
]

const serialBaudRates = [
    1200,
    2400,
    4800,
    9600,
    19200,
    38400,
    57600,
    115200
];

class ExtDisplay extends Component {
    constructor() {
        super();

        this.state = {
            fpDriver: fpDrivers.findIndex((d) => d.driver == ConfigManager.fiscalPrinter.value.driver),
            serialPorts: [],
            selFPPort: 0,
            fpEnabled: ConfigManager.fiscalPrinter.value.enabled,
            fpBaudrate: ConfigManager.fiscalPrinter.value.baudRate,
            username: ConfigManager.fiscalPrinter.value.op_user,
            password: ConfigManager.fiscalPrinter.value.op_passwd
        }
    }

    componentDidMount() {
        this.refreshSerialPorts();
    }

    refreshSerialPorts() {
        let pid = PopupManager.ShowPopup(LocaleManager.GetString("general.pleaseWait"), LocaleManager.GetString("config.serial.lookingForDevices"), [], 0);

        SystemManager.getSerialPorts().then((ports) => {
            PopupManager.ClosePopup(pid);
            this.setState({ serialPorts: ports, selFPPort: this.state.serialPorts.findIndex((port) => port.path == ConfigManager.fiscalPrinter.value.port) });
        }).catch((err) => {
            PopupManager.ClosePopup(pid);
            PopupManager.ShowPopup(LocaleManager.GetString("general.error"), LocaleManager.GetString("config.serial.errorLookingForDevices", { err }), [], 1);
        });
    }

    async testReceipt() {
        if (FPManager.GetFP() == null)
            return;

        let pid = PopupManager.ShowPopup(LocaleManager.GetString("general.pleaseWait"), LocaleManager.GetString("config.fiscalPrinter.messages.printingTestReceipt"), [], 0);

        await FPManager.TestReceipt();

        PopupManager.ClosePopup(pid);
    }

    async saveFPSettings() {
        if (this.state.selFPPort < 0)
            this.state.selFPPort = 0;

        if (fpDrivers[this.state.fpDriver].driver != null && FPManager.GetFP() != null) {
            PopupManager.ShowPopup(LocaleManager.GetString("general.info"), LocaleManager.GetString("config.fiscalPrinter.messages.promptBeforeDisconnect"), [
                {
                    name: LocaleManager.GetString("general.yes"), callback: (() => {
                        FPManager.Destroy();
                        this.saveFPSettings();
                    }).bind(this)
                },
                { name: LocaleManager.GetString("general.no") }
            ], 2);

            return;
        }

        ConfigManager.fiscalPrinter.value.driver = fpDrivers[this.state.fpDriver].driver;
        ConfigManager.fiscalPrinter.value.enabled = ConfigManager.fiscalPrinter.value.driver != null;

        if (ConfigManager.fiscalPrinter.value.enabled) {
            ConfigManager.fiscalPrinter.value.port = this.state.serialPorts[this.state.selFPPort].path;
            ConfigManager.fiscalPrinter.value.baudRate = serialBaudRates[this.state.fpBaudrate];
            ConfigManager.fiscalPrinter.value.op_user = fpDrivers[this.state.fpDriver].operator ? this.state.username : "";
            ConfigManager.fiscalPrinter.value.op_passwd = fpDrivers[this.state.fpDriver].operator ? this.state.password : "";

            let pid = PopupManager.ShowPopup(LocaleManager.GetString("general.pleaseWait"), LocaleManager.GetString("config.fiscalPrinter.messages.connecting"), [], 0);

            FPManager.Init().then(() => {
                PopupManager.ClosePopup(pid);
                PopupManager.ShowPopup(LocaleManager.GetString("general.info"), LocaleManager.GetString("config.fiscalPrinter.messages.connected"), [], 1);
                this.forceUpdate();
            })
        } else {
            if (FPManager.GetFP() != null)
                await FPManager.Destroy();
            PopupManager.ShowPopup(LocaleManager.GetString("general.info"), LocaleManager.GetString("config.fiscalPrinter.messages.disabled"), [], 1);
            this.forceUpdate();
        }
    }

    render() {
        if (!ElectronManager.HasElectron()) {
            return <Fragment>
                <h1>{LocaleManager.GetString("config.useClient")}</h1>
            </Fragment>;
        }

        return <Fragment>
            <label className="mb-2">{LocaleManager.GetString("general.status")}: <span style={{ color: FPManager.GetFP() == null ? "red" : "green" }}>{FPManager.GetFP() == null ? (!this.state.fpEnabled ? LocaleManager.GetString("general.disabled.masculine") : LocaleManager.GetString("general.disconnected.masculine")) : LocaleManager.GetString("general.connected.masculine")}</span></label>
            <div className="input-group mb-3">
                <span class="input-group-text">{LocaleManager.GetString("general.driver")}:</span>
                <select class="form-select" onChange={(e) => this.setState({ fpDriver: parseInt(e.target.value) })}>
                    {fpDrivers.map((item, index) => <option value={index} selected={this.state.fpDriver == index}>{item.name}</option>)}
                </select>
            </div>
            {
                fpDrivers[this.state.fpDriver].isSerial ?
                    <div className="input-group mb-3">
                        <span class="input-group-text">{LocaleManager.GetString("general.port")}:</span>
                        <select class="form-select" onChange={(e) => this.setState({ selFPPort: parseInt(e.target.value) })}>
                            {this.state.serialPorts.map((item, index) => <option value={index} selected={this.state.selFPPort == index}>{item.vendorId}:{item.productId} - {item.manufacturer} ({item.path})</option>)}
                        </select>
                        <Button onClick={this.refreshSerialPorts.bind(this)}>{LocaleManager.GetString("general.refresh")}</Button>
                    </div> : null
            }
            {
                fpDrivers[this.state.fpDriver].isSerial ?
                    <div className="input-group mb-3">
                        <span class="input-group-text">{LocaleManager.GetString("general.bitRate")}:</span>
                        <select class="form-select" onChange={(e) => this.setState({ fpBaudrate: parseInt(e.target.value) })}>
                            {serialBaudRates.map((item) => <option value={item} selected={item == this.state.fpBaudrate}>{item}BPS</option>)}
                        </select>
                    </div> : null
            }
            {
                fpDrivers[this.state.fpDriver].operator ?
                    <Fragment>
                        <div className="input-group mb-3">
                            <span class="input-group-text">{LocaleManager.GetString("auth.username")}:</span>
                            <input type="text" class="form-control" value={this.state.username} onChange={e => this.setState({
                                username: e.target.value
                            })} />
                            <span class="input-group-text">{LocaleManager.GetString("auth.password")}:</span>
                            <input type="password" class="form-control" value={this.state.password} onChange={e => this.setState({
                                password: e.target.value
                            })} />
                        </div>
                    </Fragment> : null
            }
            <Button onClick={this.saveFPSettings.bind(this)}>{LocaleManager.GetString("general.save")}</Button>
            <Button onClick={this.testReceipt.bind(this)}>{LocaleManager.GetString("general.testPrint")}</Button>
        </Fragment>
    }
}

export default ExtDisplay; 