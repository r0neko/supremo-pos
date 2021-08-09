import { Component } from "react"
import "./styles/SaleMode.css"
import "./styles/SaleTouchKeypad.css"
import "./styles/SaleButton.css"

class TouchKeypad extends Component {
    buttonCallback(key) {
        let KeyArrayMap = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "Backspace"];
    }

    renderButton(id, name = id, end = false, doubleLong = false) {
        return <button className={"pos-keypad-button" + (end ? " end" : "") + (doubleLong ? " double-long" : "")} onClick={this.buttonCallback.bind(this, id)}>{name}</button>;
    }

    genKeys() {
        let keys = [];
        let extraKeys = [",", "0", "C<"]

        for(let i = 1; i < 13; i++) {
            keys.push(this.renderButton(i, (i >= 10 ? extraKeys[i - 10] : i), !(i % 3)));
            if(!(i % 3))
                keys.push(<br/>);
        }

        return keys;
    }

    render() {
        return <div className="pos-touchkeypad">
            {this.genKeys()}
        </div>
    }
}

export default TouchKeypad;