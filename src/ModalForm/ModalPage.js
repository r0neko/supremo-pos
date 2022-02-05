import { Component } from "react";
import "./styles/ModalFormPage.css";
import "./styles/IconCircle.css";
import Logo from "../Assets/SPOSLogo.png";

import Router from "../Router";
import Settings from "../Settings/Settings";

class ModalPage extends Component {
    render() {
        return <div className="modal-page dark">
            <div className="centered-container">
                <div className="modal-container stylized center">
                    <div className="pos-modal-header">
                        <div className="pos-logo">
                            <img src={Logo} onClick={() => Router.RenderComponent(<Settings />)}></img>
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

export default ModalPage; 