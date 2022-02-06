import { Component, Fragment } from "react";
import ExtDisplayManager from "../ExtDisplayManager";
import "./style.css";

class DebugExtDisplay extends Component {
    constructor() {
        super();

        this.state = {
	    shown: true,
            display: [
                "TEST DISPLAY",
                "TEST DISPLAY"
            ]
        }
    }

    static setVisibility(v) {
        if(ExtDisplayManager.GetDisplay() != null) ExtDisplayManager.GetDisplay().setVisible(v);
        return v;
    }

    static getVisibility() {
        if(ExtDisplayManager.GetDisplay() != null) return ExtDisplayManager.GetDisplay().getVisible();
        else return true;
    }

    getVisible() {
        return this.state.shown;
    }

    setVisible(v) {
        this.setState({shown: v});
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
	if(!this.state.shown) return null;

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
