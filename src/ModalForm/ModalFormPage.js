import { Component } from "react";
import Modal from "./Modal"

class ModalFormPage extends Component {
    render() {
        return <div className="modal-page dark">
            <div className="centered-container">
                <Modal title="Updating...">
                    SupremoPOS is now updating!<br/>
                    Please <b>DO NOT</b> switch off your workstation!
                    <br/>
                    <br/>
                    <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}}></div>
                    </div>
                    <small style={{"textAlign": "center", "display": "block", "width": "100%"}}>Patching SPOS.exe... 97%</small>
                </Modal>
            </div>
        </div>
    }
}

export default ModalFormPage; 