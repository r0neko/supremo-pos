import { Component } from "react";
import Modal from "./ModalForm/Modal"

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

            let buttons = popup.buttons.map(e => <button className="btn btn-primary" onClick={() => {
                if (e.callback) e.callback();
                addCallback(queue.shift());
            }}>{e.name}</button>);

            return <Modal title={popup.title} footer={buttons}>
                {popup.content}
            </Modal>
        } return null;
    }
}

export default PopupManager; 