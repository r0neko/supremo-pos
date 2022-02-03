import { Component, createRef } from "react";
import Button from "../Button/Button";
import ModalPage from "../ModalForm/ModalPage"
import SessionManager from "../SessionManager";
import InputManager from "../InputManager";
import PopupManager from "../PopupManager";

class AuthPage extends Component {
    constructor() {
        super();

        this.state = {
            readingFromScanner: false,
            scannerData: null,
            canScan: true
        }

        this.ref = {
            user: createRef(),
            pass: createRef()
        }

        this.timeoutInterval = null;

        this.authPopup = null;
    }

    componentDidMount() {
        InputManager.Enable();
        
        InputManager.AddHandler("down", this.onKey.bind(this));

        document.focus = this.onFocusChange.bind(this);

        this.ref.user.current.addEventListener("focus", this.onFocusChange.bind(this));
        this.ref.user.current.addEventListener("focusout", this.onFocusChange.bind(this));
        this.ref.pass.current.addEventListener("focus", this.onFocusChange.bind(this));
        this.ref.pass.current.addEventListener("focusout", this.onFocusChange.bind(this));
    }

    componentWillUnmount() {
        InputManager.Disable();
    }

    authByCode(code) {
        this.authByUser("@TOKEN@", code);
    }

    authByUser(user, pass) {
        this.authPopup = PopupManager.ShowPopup("Autentificare", "Autentificare in curs..." + user);

        SessionManager.Authenticate(user, pass).then((status) => {
            PopupManager.ClosePopup(this.authPopup);

            let buttons = [
                {
                    name: "OK",
                    callback: () => {
                        this.setState({ readingFromScanner: false, scannerData: null });
                        this.authPopup = null;
                    }
                }
            ]

            if (status == 1) // incorrect user/pass
                this.authPopup = PopupManager.ShowPopup("Eroare autentificare!", <p>Nume de utilizator/parola incorecte!</p>, buttons);
            else if (status == 2) // not associated with the server
                this.authPopup = PopupManager.ShowPopup("Eroare autentificare!", <p>Terminal ne-alocat pentru acest serviciu!<br />Vă rugăm sa contactați administrator-ul de sistem!<br /><br />Comunicati urmatorul cod de eroare: #A01</p>, buttons);
            else if (status == 3) // device banned
                this.authPopup = PopupManager.ShowPopup("Eroare autentificare!", <p>Terminal-ul dvs. a fost blocat!<br />Vă rugăm sa contactați administrator-ul de sistem!<br /><br />Comunicati urmatorul cod de eroare: #A03</p>, buttons);
            else if (status == -1) // server is not reachable
                this.authPopup = PopupManager.ShowPopup("Eroare autentificare!", <p>Nu s-a putut contacta server-ul!<br />Vă rugăm sa contactați administrator-ul de sistem!<br /><br />Comunicati urmatorul cod de eroare: #A00</p>, buttons);
        });
    }

    onFocusChange(e) {
        console.log("focus change")
        console.log(e);
        this.setState({ canScan: document.activeElement != this.ref.user.current && document.activeElement != this.ref.pass.current });
    }

    onKey(event) {
        if (this.authPopup != null) return;

        let d = this.state.scannerData || "";

        if (event.key.length == 1 && event.key.match(/[0-9]/) && this.state.canScan) {
            d += event.key;

            if (this.timeoutInterval != null) {
                clearTimeout(this.timeoutInterval);
                this.timeoutInterval = null;
            }

            this.timeoutInterval = setTimeout(() => {
                this.setState({ readingFromScanner: false, scannerData: null });
                this.timeoutInterval = null;
            }, 1000);

            this.setState({ readingFromScanner: true, scannerData: d });
        } else if (event.key == "Enter") {
            if (this.timeoutInterval != null) {
                clearTimeout(this.timeoutInterval);
                this.timeoutInterval = null;
            }

            if(this.state.readingFromScanner && this.state.scannerData != null && this.state.scannerData.length >= 6)
                this.authByCode.bind(this)(this.state.scannerData);
            else this.authByUser.bind(this)(this.ref.user.current.value, this.ref.pass.current.value);
        }
    }

    render() {
        if (this.state.readingFromScanner) {
            return <ModalPage title="Autentificare">
                Se citesc datele de autentificare...<br />
                Va rugam asteptati...<br />
                <small>{this.state.scannerData}</small>
            </ModalPage>
        }

        return <ModalPage title="Autentificare" footer={<div className="pos-float-right" style={{ "width": "fit-content" }}><Button>Autentificare</Button></div>}>
            Vă rugăm să vă autentificați pentru a începe sesiunea!
            <br />
            <div className="mb-3 mt-3">
                <label class="form-label">Nume de utilizator:</label>
                <input type="text" class="form-control" ref={this.ref.user}/>
            </div>
            <div className="mb-3">
                <label class="form-label">Parola:</label>
                <input type="password" class="form-control" ref={this.ref.pass}/>
            </div>
            {this.state.canScan ? <small>- sau puteți folosi scanner-ul pentru autentificare instantă -</small> : ""}
        </ModalPage>
    }
}

export default AuthPage; 