import { Component } from "react";
import SessionManager from "../SessionManager";
import "./style.css";

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

    static setVisibility(v) {
	if(itx) itx.setVisible(v);
        return v;
    }

    static getVisibility() {
        if(itx) return itx.getVisible();
        else return true;
    }

    getVisible() {
        return this.state.shown;
    }

    setVisible(v) {
        this.setState({shown: v});
    }

    connectionUpdate() {
        this.setState({ connected: SessionManager.GetCurrentSession() == null, ping: 0, failedPings: 0 });
    }

    componentDidMount() {
	itx = this;

        SessionManager.on("SessionPing", (ping) => {this.setState({ ping, failedPings: 0 })});
        SessionManager.on("SessionCreated", this.connectionUpdate.bind(this));
        SessionManager.on("SessionDestroyed", this.connectionUpdate.bind(this));
        SessionManager.on("SessionPingFail", () => this.setState({ failedPings: this.state.failedPings + 1 }));
    }

    render() {
        if(!this.state.shown) return null;

        return <div className="debug left">
            <h2>Debug Stats:</h2>
            Connected: {this.state.connected ? "No" : "Yes"}<br />
            Session Token: {this.state.connected ? "no session" : SessionManager.GetCurrentSession().token}<br />
            Ping: {this.state.ping}ms<br />
            Failed Pings: {this.state.failedPings}<br />
        </div>
    }
}

export default DebugInfo;
