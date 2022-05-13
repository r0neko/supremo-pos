import { Component, Fragment } from "react";
import Button from "../../Button/Button";

import PopupManager from "../../PopupManager";
import ExtDisplayManager from "../../ExtDisplayManager";
import ConfigManager from "../../ConfigManager";
import ElectronManager from "../../ElectronManager";
import SystemManager from "../../SystemManager";
import LocaleManager from "../../Locale/LocaleManager";

const extDispDrivers = [
    { name: "-", driver: null },
    { name: "Epson (Serial)", driver: "EpsonDisplay", isSerial: true },
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
            extDispDriver: extDispDrivers.findIndex((d) => d.driver == ConfigManager.externalDisplay.value.driver),
            serialPorts: [],
            selExtDispPort: 0,
            extDispEnabled: ConfigManager.externalDisplay.value.enabled,
            extDispBaudrate: ConfigManager.externalDisplay.value.baudRate,
            screenWidth: ConfigManager.externalDisplay.value.size.x,
            screenHeight: ConfigManager.externalDisplay.value.size.y
        }
    }

    componentDidMount() {
        this.refreshSerialPorts();
    }

    refreshSerialPorts() {
        let pid = PopupManager.ShowPopup("", "Se enumeră dispozitivele seriale conectate... vă rugăm așteptați!", [], 0);

        SystemManager.getSerialPorts().then((ports) => {
            PopupManager.ClosePopup(pid);
            this.setState({ serialPorts: ports, selExtDispPort: this.state.serialPorts.findIndex((port) => port.path == ConfigManager.externalDisplay.value.port) });
        }).catch((err) => {
            PopupManager.ClosePopup(pid);
            PopupManager.ShowPopup("Eroare", "A apărut o eroare la enumerarea dispozitivelor de tip serial!\n" + err, [], 1);
        });
    }

    async saveExtScreenSettings() {
        if (this.state.selExtDispPort < 0)
            this.state.selExtDispPort = 0;

        if (extDispDrivers[this.state.extDispDriver].driver != null && ExtDisplayManager.GetDisplay() != null) {
            PopupManager.ShowPopup("Informație", "Ecranul extern este deja în funcțiune! Doriți să îl deconectați înainte să salvați modificările?", [
                {
                    name: "Da", callback: (() => {
                        ExtDisplayManager.Destroy();
                        this.saveExtScreenSettings();
                    }).bind(this)
                },
                { name: "Nu" }
            ], 2);

            return;
        }

        ConfigManager.externalDisplay.value.driver = extDispDrivers[this.state.extDispDriver].driver;
        ConfigManager.externalDisplay.value.enabled = ConfigManager.externalDisplay.value.driver != null;

        if (ConfigManager.externalDisplay.value.enabled) {
            ConfigManager.externalDisplay.value.port = this.state.serialPorts[this.state.selExtDispPort].path;
            ConfigManager.externalDisplay.value.baudRate = serialBaudRates[this.state.extDispBaudrate];
            ConfigManager.externalDisplay.value.size.x = this.state.screenWidth;
            ConfigManager.externalDisplay.value.size.y = this.state.screenHeight;

            let pid = PopupManager.ShowPopup("", "Se conectează la ecranul extern... vă rugăm așteptați!", [], 0);

            ExtDisplayManager.Init().then(() => {
                PopupManager.ClosePopup(pid);
                PopupManager.ShowPopup("Informație", "Ecranul extern a fost conectat cu succes!", [], 1);
                this.forceUpdate();
            })
        } else {
            if (ExtDisplayManager.GetDisplay() != null)
                await ExtDisplayManager.Destroy();
            PopupManager.ShowPopup("Informație", "Ecranul extern a fost dezactivat!", [], 1);
            this.forceUpdate();
        }
    }

    render() {
        if(!ElectronManager.HasElectron()) {
            return <Fragment>
                <h1>Va rugam sa folositi client-ul pentru aceasta functie!</h1>
            </Fragment>;
        }

        return <Fragment>
            <label className="mb-2">{LocaleManager.GetString("general.status")}: <span style={{ color: ExtDisplayManager.GetDisplay() == null ? "red" : "green" }}>{ExtDisplayManager.GetDisplay() == null ? (!this.state.extDispEnabled ? LocaleManager.GetString("general.disabled.masculine") : LocaleManager.GetString("general.disconnected.masculine")) : LocaleManager.GetString("general.connected.masculine")}</span></label>
            <div className="input-group mb-3">
                <span class="input-group-text">{LocaleManager.GetString("general.driver")}:</span>
                <select class="form-select" onChange={(e) => this.setState({ extDispDriver: parseInt(e.target.value) })}>
                    {extDispDrivers.map((item, index) => <option value={index} selected={this.state.extDispDriver == index}>{item.name}</option>)}
                </select>
            </div>
            {
                extDispDrivers[this.state.extDispDriver].isSerial ?
                    <div className="input-group mb-3">
                        <span class="input-group-text">{LocaleManager.GetString("general.port")}:</span>
                        <select class="form-select" onChange={(e) => this.setState({ selExtDispPort: parseInt(e.target.value) })}>
                            {this.state.serialPorts.map((item, index) => <option value={index} selected={this.state.selExtDispPort == index}>{item.vendorId}:{item.productId} - {item.manufacturer} ({item.path})</option>)}
                        </select>
                        <Button onClick={this.refreshSerialPorts.bind(this)}>{LocaleManager.GetString("general.refresh")}</Button>
                    </div> : null
            }
            {
                extDispDrivers[this.state.extDispDriver].isSerial ?
                    <div className="input-group mb-3">
                        <span class="input-group-text">{LocaleManager.GetString("general.bitRate")}:</span>
                        <select class="form-select" onChange={(e) => this.setState({ extDispBaudrate: parseInt(e.target.value) })}>
                            {serialBaudRates.map((item) => <option value={item} selected={item == this.state.extDispBaudrate}>{item}BPS</option>)}
                        </select>
                    </div> : null
            }
            <div className="input-group mb-3">
                <span class="input-group-text">{LocaleManager.GetString("general.width")}:</span>
                <input type="number" class="form-control" value={this.state.screenWidth} onChange={e => this.setState({
                    screenWidth: parseInt(e.target.value)
                })} />
                <span class="input-group-text">{LocaleManager.GetString("general.height")}:</span>
                <input type="number" class="form-control" value={this.state.screenHeight} onChange={e => this.setState({
                    screenHeight: parseInt(e.target.value)
                })} />
            </div>
            <Button onClick={this.saveExtScreenSettings.bind(this)}>{LocaleManager.GetString("general.save")}</Button>
        </Fragment>
    }
}

export default ExtDisplay; 