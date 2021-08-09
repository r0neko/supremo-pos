import { Component } from 'react';
import Button from "./Button";

class ButtonSuccess extends Component {
    render() {
        return <Button {...this.props} className={"pos-success" + (this.props.className ? ' ' + this.props.className : "")} >{this.props.children}</Button>;
    }
}

export default ButtonSuccess;