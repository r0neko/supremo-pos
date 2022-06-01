import { Component } from "react";
import ConfigManager from "./ConfigManager";

class AspectRatio extends Component {
    constructor() {
        super();

        this.state = {
            is43: ConfigManager.forceAspectRatio.value
        }
    }
    componentDidMount() {
        ConfigManager.forceAspectRatio.on("update", () => {
            this.setState({ is43: ConfigManager.forceAspectRatio.value });
        });
    }

    render() {
        return <div className={this.state.is43 ? "spos-ar4-3" : "h-100"}>{this.props.children}</div>
    }
}

export default AspectRatio; 