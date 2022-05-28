import { Component } from "react";
import ConfigManager from "./ConfigManager";

let s = null;

let setCallback = (a) => s = a;

class Router extends Component {
    constructor() {
        super();

        this.state = {
            p: null
        }
    }

    static RenderComponent(what) {
        setCallback(what);
    }

    componentDidMount() {
        setCallback = (e) => {
            this.setState({ p: e });
        }

        if(s) setCallback(s);

        ConfigManager.language.on("update", () => {
            console.log("Language updated");
            this.forceUpdate();
        });
    }

    render() {
        return this.state.p;
    }
}

export default Router; 