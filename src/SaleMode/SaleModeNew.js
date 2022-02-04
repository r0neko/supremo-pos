import { Component, createRef } from "react"
import SaleTopBar from "./SaleTopBar"
import ExtendedTouchKeypad from "./ExtendedTouchKeypad"
import InputManager from "../InputManager";
import "./styles/SaleMode.css"
import "../styles/design.css"

import PopupManager from "../PopupManager";

import API from "../API"
import ButtonDanger from "../Button/ButtonDanger";
import Router from "../Router";
import MenuPage from "../Menu/MenuPage";

function validate_plu(input) {
    if (input.length == 1)
        return input >= '0' && input <= '9' ||
            input >= 'A' && input <= 'Z' ||
            input == ' ' ||
            input == '$' ||
            input == '%' ||
            input == '+' ||
            input == '-' ||
            input == '.' ||
            input == ',' ||
            input == '/';
    else {
        for (let i = 0; i < input.length; i++) {
            if (!validate_plu(input[i]))
                return false;
        }
        return true;
    }
}

function clean_plu(input) {
    let output = '';
    for (let i = 0; i < input.length; i++) {
        if (validate_plu(input[i]))
            output += input[i];
    }
    return output;
}

class SaleMode extends Component {
    constructor() {
        super();

        this.plu_txt = createRef();
        this.desc_txt = createRef();
        this.price_txt = createRef();
        this.qty_txt = createRef();
        this.total_txt = createRef();

        this.isSearching = false;

        this.multiplier = 1;
    }

    placeholder() {
        PopupManager.ShowPopup("Informație", <p>Funcția nu a fost implementată! Încercăm să implementăm funcția cât mai curând!</p>, [
            { name: "OK" }
        ], 1);
    }

    componentDidMount() {
        InputManager.Enable();

        this.hd_up = InputManager.AddHandler("up", this.onKey.bind(this));
        this.hd_down = InputManager.AddHandler("down", this.onKeyDown.bind(this));

        this.setMultiplier(1);
    }

    componentWillUnmount() {
        InputManager.RemoveHandler("up", this.hd_up);
        InputManager.RemoveHandler("down", this.hd_down);
        InputManager.Disable();
    }

    setMultiplier(m) {
        this.qty_txt.current.value = "x" + (this.multiplier = m);
    }

    onKeyDown(key) {
        if (this.isSearching) {
            if (document.activeElement == this.plu_txt.current) {
                this.plu_txt.current.value = "";
            }
            return key.preventDefault();
        }
    }

    onKey(key) {
        if (this.isSearching) {
            if (document.activeElement == this.plu_txt.current) {
                this.plu_txt.current.value = "";
            }
            return key.preventDefault();
        }

        if (key.key == "Enter") {
            this.processPLU(this.plu_txt.current.value);
            this.setMultiplier(1);
        } else if (key.key == "*") {
            if (this.plu_txt.current.value[this.plu_txt.current.value.length] == "X")
                this.plu_txt.current.value = this.plu_txt.current.value.slice(0, -1);

            this.setMultiplier(parseFloat(this.plu_txt.current.value.replace(",", ".")));
            this.plu_txt.current.value = "";
            return;
        } else if (key.key == "F2") {
            return this.placeholder();
        }

        if (document.activeElement != this.plu_txt.current) {
            if (key.key == "Backspace" || !validate_plu(this.plu_txt.current.value)) this.plu_txt.current.value = this.plu_txt.current.value.slice(0, -1);
            else if (key.key.length == 1) this.plu_txt.current.value += key.key;
            this.plu_txt.current.value = clean_plu(this.plu_txt.current.value);
        }

        this.plu_txt.current.focus();
    }

    processPLU(plu) {
        if (this.isSearching) return;

        let wait_popup = PopupManager.ShowPopup("Așteptați...", `Se caută PLU '${plu}'...`);

        this.isSearching = true;

        API.SearchProductID(plu).then(r => {
            this.isSearching = false;
            PopupManager.ClosePopup(wait_popup);

            if (!r.success) {
                PopupManager.ShowPopup("Eroare", `O eroare neașteptată a avut loc la procesarea codului PLU!`, [], 1);
            } else {
                if(r.product) {
                    this.price_txt.current.value = `${r.product.price} LEI`;
                    this.desc_txt.current.value = r.product.description;
                } else {
                    PopupManager.ShowPopup("Eroare", `Codul PLU '${plu}' nu există!`, [], 1);
                }
            }
        }).catch(e => {
            this.isSearching = false;
            PopupManager.ClosePopup(wait_popup);
            PopupManager.ShowPopup("Eroare", `O eroare necunoscută a avut loc în timpul căutării produsului! Vă rugăm sa încercați din nou!`, [], 1);
        });

        this.plu_txt.current.value = "";
    }

    render() {
        return <div className="pos-sale-container">
            <SaleTopBar />
            <div className="pos-content-container">
                <div class="row">
                    <div class="col">
                        <div className="pos-text">
                            <input type="text" maxLength="18" ref={this.plu_txt}></input>
                        </div>
                        <div className="pos-text">
                            <label>Desc:</label>
                            <input type="text" className="pos-input-no-disabled" disabled ref={this.desc_txt}></input>
                        </div>
                        <div className="pos-text">
                            <label>Preț:</label>
                            <input type="text" className="pos-input-no-disabled" disabled ref={this.price_txt}></input>
                        </div>
                    </div>
                    <div class="col-3">
                        <div className="pos-text">
                            <input type="text" className="pos-input-no-disabled" disabled ref={this.qty_txt}></input>
                        </div>
                        <div className="pos-text">
                            <label>Total:</label>
                            <input type="text" className="pos-input-no-disabled" disabled value="0.00 LEI" ref={this.total_txt}></input>
                        </div>
                    </div>
                </div>
                <ExtendedTouchKeypad />
                <br />
                <ButtonDanger onClick={() => Router.RenderComponent(<MenuPage />)}>Meniu Principal</ButtonDanger>
        </div>
        </div >
    }
}

export default SaleMode; 