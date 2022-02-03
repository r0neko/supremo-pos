import { Component } from "react";

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
    }

    render() {
        return this.state.p;
    }
}

export default Router; 