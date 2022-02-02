import { Component } from "react";
import "./style.css";
import BuildInfo from "../BuildInfo";

class DebugBuild extends Component {
    render() {
        return <div className="debug">
            SupremoPOS 2<br/>
            For evaluation purposes. {BuildInfo.IsProduction() ? "Production Build" : "Development Build"} v{BuildInfo.BuildString}
        </div>
    }
}

export default DebugBuild;