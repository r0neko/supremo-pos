import { Component } from "react";
import "./style.css";
import BuildInfo from "../BuildInfo";
import LocaleManager from "../Locale/LocaleManager";
import ConfigManager from "../ConfigManager";

class DebugBuild extends Component {
    componentDidMount() {
        ConfigManager.language.on("update", this.forceUpdate.bind(this, null));
    }

    componentWillUnmount() {
        ConfigManager.language.off("update", this.forceUpdate.bind(this, null));
    }

    render() {
        if(BuildInfo.IsProduction()) return null;
        
        return <div className="debug">
            SupremoPOS 2<br/>
            {LocaleManager.GetString("general.evaluationBuild")}&nbsp;{LocaleManager.GetString("general.build")} v{BuildInfo.BuildString}
        </div>
    }
}

export default DebugBuild;