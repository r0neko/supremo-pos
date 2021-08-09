import { Component } from 'react';
import "./POSButtons.css"

class Button extends Component {
    render() {
        return <button {...this.props} className={"pos-button" + (this.props.className ? ' ' + this.props.className : "")}>{this.props.children}</button>;
    }
}

export default Button;