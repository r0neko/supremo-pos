import { Component } from "react";
import SessionManager from "../SessionManager";
import "./style.css";

import ConfigManager from "../ConfigManager";
import LocaleManager from "../Locale/LocaleManager";
import BuildInfo from "../BuildInfo";

let itx = null;

class DebugInfo extends Component {
    constructor() {
        super();
        this.state = {
            shown: true,
            connected: SessionManager.GetCurrentSession() == null,
            ping: 0,
            failedPings: 0
        }
    }

    connectionUpdate() {
        this.setState({ connected: SessionManager.GetCurrentSession() == null, ping: 0, failedPings: 0 });
    }

    componentDidMount() {
        itx = this;

        SessionManager.on("SessionPing", (ping) => { this.setState({ ping, failedPings: 0 }) });
        SessionManager.on("SessionCreated", this.connectionUpdate.bind(this));
        SessionManager.on("SessionDestroyed", this.connectionUpdate.bind(this));
        SessionManager.on("SessionPingFail", () => this.setState({ failedPings: this.state.failedPings + 1 }));
    
        ConfigManager.show_debug_stats.on("update", (v) => {
            this.setState({ shown: v });
        });

        ConfigManager.language.on("update", this.forceUpdate.bind(this, null));
    }

    componentWillUnmount() {
        ConfigManager.language.off("update", this.forceUpdate.bind(this, null));
    }

    render() {
        if (!this.state.shown || BuildInfo.IsProduction()) return null;

        return <div className="debug stats">
            <h2>{LocaleManager.GetString("debug.stats")}:</h2>
            {LocaleManager.GetString("debug.connected")}: {LocaleManager.GetString("general." + (this.state.connected ? "no" : "yes"))}<br />
            {LocaleManager.GetString("debug.sessionToken")}: {this.state.connected ? LocaleManager.GetString("debug.noSession") : SessionManager.GetCurrentSession().token}<br />
            {LocaleManager.GetString("debug.ping")}: {this.state.ping}ms<br />
            {LocaleManager.GetString("debug.failedPings")}: {this.state.failedPings}<br />
        </div>
    }
}

export default DebugInfo;
