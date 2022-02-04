import { Component } from "react";
import Modal from "./ModalForm/Modal"
import Button from "./Button/Button";

import SoundManager from "./SoundManager";

import Error from "./Assets/sounds/error.wav";
import Info from "./Assets/sounds/info.wav";

let queue = [];

let addCallback = (callback) => { };

class PopupManager extends Component {
    constructor() {
        super();

        this.state = {
            currentPopup: null
        }
    }

    static ShowPopup(title, content, buttons = [], alert = 0) {
        if(alert >= 1 && buttons.length == 0) {
            buttons = [{ name: "OK" }];
        }

        let e = queue.push({ title, content, buttons, alert }) - 1;
        if (e == 0)
            addCallback(queue.shift());
        return e;
    }

    static SetContent(handle, c) {
        let e = queue.find((e, i) => i == handle);
        if (e) e.content = c;
        addCallback(e);
    }

    static ClosePopup(id) {
        queue.splice(id, 1);
        if (queue.length > 0)
            addCallback(queue.shift());
        else addCallback(null);
    }

    componentDidMount() {
        addCallback = (e) => {
            this.setState({ currentPopup: e });
        }
    }

    render() {
        if (this.state.currentPopup != null) {
            switch(this.state.currentPopup.alert) {
                case 0: break;
                default:
                case 1:
                    SoundManager.Play(Error);
                    break;
                case 2:
                    SoundManager.Play(Info);
                    break;
            }

            let popup = this.state.currentPopup;

            let buttons = <div className="pos-float-right" style={{ "width": "fit-content" }}>
                {popup.buttons.map((e, i) => <Button onClick={() => {
                    if (e.callback) e.callback();
                    addCallback(queue.shift());
                }} key={i}>{e.name}</Button>)}
            </div>;

            return <Modal title={popup.title} footer={buttons}>
                {popup.content}
            </Modal>
        } return null;
    }
}

export default PopupManager; 