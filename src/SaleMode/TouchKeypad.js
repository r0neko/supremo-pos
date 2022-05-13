import { Component } from "react"
import "./styles/SaleMode.css"
import "./styles/SaleTouchKeypad.css"
import "./styles/SaleButton.css"

import InputManager from "../InputManager"

class TouchKeypad extends Component {
    constructor(props) {
        super(props);

        this.pressedKeys = [];
    }

    getMatrix() {
        return [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [",", "0", "C<"]
        ];
    }

    getKeyMap() {
        return [49, 50, 51, 52, 53, 54, 55, 56, 57, 188, 48, 8];
    }

    onKeyDown(event) {
        if(!this.pressedKeys.find(e => e == event.keyCode))
            this.pressedKeys.push(event.keyCode);
        this.setState(this.pressedKeys);
    }

    onKeyUp(event) {
        this.pressedKeys.pop(event.keyCode);
        this.setState(this.pressedKeys);
    }

    componentDidMount() {
        InputManager.Enable();

        this.hd_down = InputManager.AddHandler("down", this.onKeyDown.bind(this));
        this.hd_up = InputManager.AddHandler("up", this.onKeyUp.bind(this));
    }

    componentWillUnmount() {
        InputManager.RemoveHandler("up", this.hd_up);
        InputManager.RemoveHandler("down", this.hd_down);
    }

    buttonCallback(key) {
        let KeyMap = this.getKeyMap();
        if(key >= 0 && key <= KeyMap.length)
            InputManager.DispatchKeyEvent(KeyMap[key])
    }

    renderButton(id, name = id, end = false, doubleLong = false, active = true) {
        return <button key={id} className={"pos-keypad-button" + (end ? " end" : "") + (doubleLong ? " double-long" : "") + (active ? " active" : "") + (name.length >= 4 ? " smaller" : "")} onClick={this.buttonCallback.bind(this, id)}>{name}</button>;
    }

    genKeys() {
        let i = 0;
        let KeyMap = this.getKeyMap();

        return this.getMatrix().map(e => (
            [...e.map((k, j) => this.renderButton(i++, k, j == e.length - 1, j == e.length - 1 && e.length > 3, this.pressedKeys.includes(KeyMap[i - 1])))
        , <br/>]));
    }

    render() {
        return <div className="pos-touchkeypad">
            {this.genKeys()}
        </div>
    }
}

export default TouchKeypad;