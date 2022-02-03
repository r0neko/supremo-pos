import { Component } from 'react';
import Button from "./Button";

class ButtonDanger extends Component {
    render() {
        return <Button {...this.props} className={"pos-error" + (this.props.className ? ' ' + this.props.className : "")} >{this.props.children}</Button>;
    }
}

export default ButtonDanger;