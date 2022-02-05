import { Component, Fragment } from "react";
import ExtDisplayManager from "../ExtDisplayManager";
import "./style.css";

class DebugExtDisplay extends Component {
    constructor() {
        super();

        this.state = {
            display: [
                "TEST DISPLAY",
                "TEST DISPLAY"
            ]
        }
    }

    componentDidMount() {
        ExtDisplayManager.SetDisplay(this);
    }

    clearAll() {
        for(let i = 0; i < this.getDisplaySize().lines; i++)
            this.clearLine(i + 1);
    }

    clearLine(line) {
        this.printLine("", line);
    }
    
    printLine(text, line) {
        this.state.display[line - 1] = text.slice(0, this.getDisplaySize().columns + 1);
        this.setState({ display: this.state.display });
    }

    getDisplaySize() {
        return {
            columns: 20,
            lines: 2
        }
    }

    render() {
        return <div className="debug vfd">
            {
                this.state.display.map(a => <Fragment>
                    {a.padEnd(this.getDisplaySize().columns + 1, "⠀")}<br />
                </Fragment>)
            }
        </div>
    }
}

export default DebugExtDisplay;