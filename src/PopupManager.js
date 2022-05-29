import { Component } from "react";
import Modal from "./ModalForm/Modal"
import Button from "./Button/Button";

import SoundManager from "./SoundManager";

import Error from "./Assets/sounds/error.wav";
import Info from "./Assets/sounds/info.wav";

import ElectronManager from './ElectronManager';
import LocaleManager from "./Locale/LocaleManager";

let queue = [];

let popupManagerInstance = null;

class PopupManager extends Component {
    constructor() {
        super();

        this.state = {
            currentPopup: null
        }
    }

    static ShowPopup(title, content, buttons = [], alert = 0) {
        if (alert >= 1 && buttons.length == 0) {
            buttons = [{ name: LocaleManager.GetString("general.ok") }];
        }

        let e = queue.push({ title, content, buttons, alert }) - 1;
        if (e == 0)
            popupManagerInstance.showPopup(queue.shift());
            
        popupManagerInstance.forceUpdate();
        return e;
    }

    static SetContent(handle, c) {
        let e = queue.find((e, i) => i == handle);
        if (e) e.content = c;
        popupManagerInstance.showPopup(e);
    }

    static ClosePopup(id) {
        queue.splice(id, 1);
        if (queue.length > 0)
            popupManagerInstance.showPopup(queue[0]);
        else popupManagerInstance.showPopup(null);
    }

    showPopup(e) {
        this.setState({ currentPopup: e });
    }

    componentDidMount() {
        popupManagerInstance = this;
    }

    render() {
        if (this.state.currentPopup != null) {
            switch (this.state.currentPopup.alert) {
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
                    PopupManager.ClosePopup(i);
                }} key={i}>{e.name}</Button>)}
            </div>;

            return <Modal title={popup.title} footer={buttons}>
                {popup.content}
            </Modal>
        } return null;
    }
}

export default PopupManager; 