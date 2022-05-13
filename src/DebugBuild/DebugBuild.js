import { Component } from "react";
import "./style.css";
import BuildInfo from "../BuildInfo";
import LocaleManager from "../Locale/LocaleManager";

class DebugBuild extends Component {
    render() {
        return <div className="debug">
            SupremoPOS 2<br/>
            {LocaleManager.GetString("general.evaluationBuild")}&nbsp;{LocaleManager.GetString("general.build")} v{BuildInfo.BuildString}
        </div>
    }
}

export default DebugBuild;