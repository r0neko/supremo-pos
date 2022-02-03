import { Component } from "react";
import Modal from "./ModalForm/Modal"
import Button from "./Button/Button";

let queue = [];

let addCallback = (callback) => { };

class PopupManager extends Component {
    constructor() {
        super();

        this.state = {
            currentPopup: null
        }
    }

    static ShowPopup(title, content, buttons = []) {
        let e = queue.push({ title, content, buttons }) - 1;
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
            let popup = this.state.currentPopup;

            let buttons = <div className="pos-float-right" style={{ "width": "fit-content" }}>
                {popup.buttons.map(e => <Button onClick={() => {
                    if (e.callback) e.callback();
                    addCallback(queue.shift());
                }}>{e.name}</Button>)}
            </div>;

            return <Modal title={popup.title} footer={buttons}>
                {popup.content}
            </Modal>
        } return null;
    }
}

export default PopupManager; 