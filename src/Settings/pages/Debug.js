import { Component, Fragment } from "react";
import Button from "../../Button/Button";

import DebugInfo from "../../DebugBuild/DebugInfo";
import DebugExtDisplay from "../../DebugBuild/DebugExtDisplay";

class Debug extends Component {
    constructor() {
        super();

        this.state = {
            debug_stats: true,
            virtual_disp: true
        };
    }

    toggle_debug_stats() {
        this.setState({
            debug_stats: DebugInfo.setVisibility(!DebugInfo.getVisibility())
        });
    }

    toggle_virtual_display() {
        this.setState({
            virtual_disp: DebugExtDisplay.setVisibility(!DebugExtDisplay.getVisibility())
        });
    }

    render() {
        return <Fragment>
            <Button onClick={this.toggle_debug_stats.bind(this)}>{this.state.debug_stats ? "Ascundere" : "Afișare"} Statistici Debug</Button><br/><br/>
            <Button onClick={this.toggle_virtual_display.bind(this)}>{this.state.virtual_disp ? "Ascundere" : "Afișare"} Ecran Virtual</Button>
        </Fragment>
    }
}

export default Debug; 
