import { Component } from "react";
import "./styles/ModalFormPage.css";
import "./styles/IconCircle.css";
import Logo from "../Assets/SPOSLogo.png";

class Modal extends Component {
    render() {
        return <div className="modal-overlay">
            <div className="centered-container">
                <div className="modal-container center stylized flat">
                    <div className="pos-modal-header">
                        <div className="pos-logo">
                            <img src={Logo}></img>
                        </div>
                        <div className="pos-title">
                        {this.props.title ?? "Lorem Ipsum"}
                        </div>
                    </div>
                    <div className="pos-content">
                        {this.props.children}
                    </div>
                    <div className="pos-footer">
                        {this.props.footer}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Modal; 