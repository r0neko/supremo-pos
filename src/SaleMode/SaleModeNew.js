import { Component, createRef } from "react"
import TopBar from "./TopBar"
import ExtendedTouchKeypad from "./ExtendedTouchKeypad"
import InputManager from "../InputManager";
import "./styles/SaleMode.css"
import "../styles/design.css"

import PopupManager from "../PopupManager";

import API from "../API"
import Button from "../Button/Button";
import ButtonDanger from "../Button/ButtonDanger";
import Router from "../Router";
import MenuPage from "../Menu/MenuPage";

import ExtDisplayManager from "../ExtDisplayManager";
import Receipt from "../Receipt";
import FPManager from "../FPManager";
import Product from "../Product";
import ProductList from "./ProductList";
import LocaleManager from "../Locale/LocaleManager";

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
        this.prod_qty_txt = createRef();
        this.subtotal_txt = createRef();

        this.currentReceipt = null;

        this.isSearching = false;
        this.prodList = createRef();

        this.saleSession = null;

        this.multiplier = 1;

        this.state = {
            selectedPayment: 0
        }
    }

    placeholder() {
        PopupManager.ShowPopup(LocaleManager.GetString("general.info"), <p>{LocaleManager.GetString("general.message.notImplemented")}</p>, [], 1);
    }

    componentDidMount() {
        InputManager.Enable();

        this.hd_up = InputManager.AddHandler("up", this.onKey.bind(this));
        this.hd_down = InputManager.AddHandler("down", this.onKeyDown.bind(this));

        this.displayUpdate(0);

        this.setMultiplier(1);
        this.calculateSubtotal();
    }

    calculateSubtotal() {
        if (!this.subtotal_txt.current) return;

        this.subtotal_txt.current.value = (this.currentReceipt ? this.currentReceipt.subtotal : 0).toFixed(2) + " LEI";
    }

    componentWillUnmount() {
        InputManager.RemoveHandler("up", this.hd_up);
        InputManager.RemoveHandler("down", this.hd_down);
        InputManager.Disable();
    }

    setMultiplier(m) {
        if(isNaN(m)) return this.setMultiplier(1);

        this.multiplier = m;
        this.qty_txt.current.value = "x" + this.multiplier;
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
        } else if (key.key == "*") {
            if (this.plu_txt.current.value[this.plu_txt.current.value.length] == "X")
                this.plu_txt.current.value = this.plu_txt.current.value.slice(0, -1);

            this.setMultiplier(parseFloat(this.plu_txt.current.value.replace(",", ".")));
            this.plu_txt.current.value = "";
            return;
        } else if (key.key == "F2") {
            return this.placeholder();
        } else if (key.key == "F4") {
            return this.closeReceipt();
        }

        if (document.activeElement != this.plu_txt.current) {
            if (key.key == "Backspace" || !validate_plu(this.plu_txt.current.value)) this.plu_txt.current.value = this.plu_txt.current.value.slice(0, -1);
            else if (key.key.length == 1) this.plu_txt.current.value += key.key;
            this.plu_txt.current.value = clean_plu(this.plu_txt.current.value);
        }

        this.plu_txt.current.focus();
    }

    processPLU(plu) {
        if(plu.length < 1 || plu == "" || plu == " ") return;
        if (this.isSearching) return;

        let wait_popup = PopupManager.ShowPopup(LocaleManager.GetString("general.info"), LocaleManager.GetString("sale.message.searchingPLU", { plu }));

        this.isSearching = true;

        Product.findPLU(plu).then(r => {
            this.isSearching = false;
            PopupManager.ClosePopup(wait_popup);

            if (r) {
                r.quantity = this.multiplier;
                this.setMultiplier(1);
                this.onProductFound(r);
            } else
                PopupManager.ShowPopup(LocaleManager.GetString("general.error"), LocaleManager.GetString("sale.message.pluNotFound", { plu }), [], 1);

        }).catch(e => {
            console.error(e);
            this.isSearching = false;
            PopupManager.ClosePopup(wait_popup);
            PopupManager.ShowPopup(LocaleManager.GetString("general.error"), LocaleManager.GetString("sale.message.searchError", { error: e }), [], 1);
            this.setMultiplier(1);
        });

        this.plu_txt.current.value = "";
    }

    async onProductFound(prod) {
        if (this.currentReceipt == null) {
            this.currentReceipt = new Receipt();

            if (FPManager.GetFP() != null)
                await FPManager.GetFP().openFiscalReceipt();
        }

        if (this.saleSession == null) {
            let r = await API.StartSaleSession();
            if (r.success) {
                this.saleSession = r.session;
            } else PopupManager.ShowPopup(LocaleManager.GetString("general.error"), LocaleManager.GetString("sale.message.sessionCreationFail"), [], 1);
        }

        let p = this.currentReceipt.addProduct(prod);

        this.price_txt.current.value = `${p.getPriceWithVAT().toFixed(2)} LEI`;
        this.desc_txt.current.value = p.name;
        this.prod_qty_txt.current.value = "x" + p.quantity;

        if (this.saleSession)
            await API.AddProductToSaleSession(this.saleSession, p);

        if (FPManager.GetFP() != null)
            await FPManager.GetFP().sellProduct(p.name, p.getPriceWithVATSingular(), prod.quantity);

        this.prodList.current.updateReceipt(this.currentReceipt);

        this.displayUpdate(1, prod);
        this.forceUpdate();
    }

    async voidProduct() {
        if (this.currentReceipt == null || this.prodList.current.getSelectedProduct() == null) return;

        if (this.saleSession)
            await API.VoidProductInSaleSession(this.saleSession, this.prodList.current.getSelectedProduct());

        if (FPManager.GetFP() != null) {
            let p = this.prodList.current.getSelectedProduct();
            await FPManager.GetFP().sellProduct(p.name, p.getPriceWithVATSingular(), -1);
        }
        
        this.currentReceipt.voidProduct(this.prodList.current.getSelectedProduct());
        this.prodList.current.updateReceipt(this.currentReceipt);

        this.forceUpdate();
    }

    async closeReceipt() {
        if (!this.currentReceipt) return;

        if (this.currentReceipt.subtotal > 0) {
            PopupManager.ShowPopup(LocaleManager.GetString("general.error"), LocaleManager.GetString("sale.message.closeReceiptOnSaleMessage"), [], 1);
            return;
        }

        if (FPManager.GetFP() != null) {
            //await FPManager.GetFP().performPayment(this.currentReceipt.total);
            await FPManager.GetFP().autoCloseFiscalReceipt();
        }

        if (this.saleSession) {
            await API.CloseSaleSession(this.saleSession);
            this.saleSession = null;
        }

        this.currentReceipt = null;
        this.displayUpdate(0);

        this.price_txt.current.value = this.desc_txt.current.value = this.prod_qty_txt.current.value = "";
        this.prodList.current.clear();

        this.state.selectedPayment = 0;

        this.forceUpdate();
    }

    displayUpdate(state = 0, arg1) {
        let d = ExtDisplayManager.GetDisplay();
        if (d == null) return;

        d.clearAll();

        switch (state) {
            default:
            case 0:
                d.print(LocaleManager.GetString("sale.nextClientPrompt"));
                break;
            case 1:
                d.print(arg1.name);
                d.setCursor(0, 1);
                d.print(`x${arg1.quantity} ${arg1.getPriceWithVAT().toFixed(2)} LEI`.padStart(20, " "));
                break;
            case 2:
                d.print(`${LocaleManager.GetString("sale.total")}: ${this.currentReceipt.total.toFixed(2)} LEI`);
                d.setCursor(0, 1);
                d.print(`${LocaleManager.GetString("sale.amountDue")}: ${this.currentReceipt.due.toFixed(2)} LEI`);
                break;
        }
    }

    getCurrentReceiptTotal() {
        if (this.currentReceipt == null) return 0;
        return this.currentReceipt.total;
    }

    cashPayment() {
        if (!this.currentReceipt) return;
        if(isNaN(parseFloat(this.plu_txt.current.value))) return;

        this.currentReceipt.pay("cash", parseFloat(this.plu_txt.current.value.replace(",", ".")));
        this.displayUpdate(2);

        this.plu_txt.current.value = "";
        this.forceUpdate();
    }

    exitSale() {
        if (this.currentReceipt)
            return PopupManager.ShowPopup(LocaleManager.GetString("general.info"), LocaleManager.GetString("sale.message.sellingExit"), [], 2);

        Router.RenderComponent(<MenuPage />);
    }

    getPaymentSection() {
        return this.currentReceipt != null && this.currentReceipt.payment != null ? this.currentReceipt.payment.map((method, i) => {
            return <div className={"list-item product-list__item" + (this.state.selectedPayment == i ? " selected" : "")}
                key={i}
                tabIndex="0"
                ref={ref => this.currentReceipt != null && i == this.currentReceipt.payment.length - 1 && ref != null && ref.focus()}
            >
                <div className="row">
                    <div className="col">
                        <div className="product-list__item__name">{LocaleManager.GetString("paymentMethods." + method.method)}</div>
                    </div>
                    <div className="col-3">
                        <div className="product-list__item__price">{method.amount.toFixed(2)} LEI</div>
                    </div>
                </div>
            </div>;
        }) : null;
    }

    render() {
        this.calculateSubtotal();

        return <div className="pos-sale-container">
            <TopBar title={LocaleManager.GetString("sale.saleMode")} />
            <div className="pos-content-container">
                <div className="row">
                    <div className="col">
                        <div className="pos-text">
                            <input type="text" maxLength="18" ref={this.plu_txt}></input>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="pos-text">
                                    <label>{LocaleManager.GetString("sale.descriptionLabel")}:</label>
                                    <input type="text" className="pos-input-no-disabled" disabled ref={this.desc_txt}></input>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="pos-text">
                                    <input type="text" className="pos-input-no-disabled" disabled ref={this.prod_qty_txt}></input>
                                </div>
                            </div>
                        </div>
                        <div className="pos-text">
                            <label>{LocaleManager.GetString("sale.priceLabel")}:</label>
                            <input type="text" className="pos-input-no-disabled" disabled ref={this.price_txt}></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="pos-text">
                            <input type="text" className="pos-input-no-disabled" disabled ref={this.qty_txt}></input>
                        </div>
                        <div className="pos-text">
                            <label>{LocaleManager.GetString("sale.total")}:</label>
                            <input type="text" className="pos-input-no-disabled" disabled value={this.getCurrentReceiptTotal().toFixed(2) + " LEI"} ref={this.total_txt}></input>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ height: "calc(100% - 210px)" }}>
                    <div className="col-4" style={{ height: "100%" }}>
                        <ProductList ref={this.prodList} />
                        <div className="row mt-2">
                            <div className="col">
                                <ButtonDanger onClick={this.exitSale.bind(this)} style={{ "width": "100%" }}>{LocaleManager.GetString("general.exit")}</ButtonDanger>
                            </div>
                            <div className="col">
                                <Button onClick={this.voidProduct.bind(this)} style={{ "width": "100%" }}>{LocaleManager.GetString("general.cancel")}</Button>
                            </div>
                            <div className="col">
                                <Button onClick={this.placeholder.bind(this)} style={{ "width": "100%" }}>...</Button>
                            </div>
                        </div>
                        <small>sale session: {this.saleSession || "none"}</small>
                    </div>
                    <div className="col">
                        <div style={{ display: "inline-flex" }}>
                            <ExtendedTouchKeypad />
                            <div style={{ marginLeft: "1px" }}>
                                <button className="pos-keypad-button double-with-margin pos-success" onClick={this.closeReceipt.bind(this)}>{LocaleManager.GetString("sale.closeReceipt")}</button>
                            </div>
                        </div>
                        <br />
                        <div style={{ width: "566px", height: "100%" }}>
                            <div className="pos-text mt-2">
                                <label><b>{LocaleManager.GetString("sale.subtotalLabel")}:</b></label>
                                <input type="text" className="pos-input-no-disabled" disabled ref={this.subtotal_txt}></input>
                            </div>
                            <div className="row mt-3" style={{ height: "calc(100% - 386px)" }}>
                                <div className="col">
                                    <div className="pos-vert-list">
                                        {this.getPaymentSection()}
                                        {/* <small>paid: {(this.currentReceipt ? this.currentReceipt.paid : 0).toFixed(2)}</small><br />
                                        <small>due: {(this.currentReceipt ? this.currentReceipt.due : 0).toFixed(2)}</small><br /> */}
                                    </div>
                                </div>
                                <div className="col-3">
                                    <Button style={{ width: "100%" }} onClick={this.cashPayment.bind(this)}>{LocaleManager.GetString("paymentMethods.cash")}</Button><br />
                                    <Button style={{ width: "100%", marginTop: "5px" }}>{LocaleManager.GetString("paymentMethods.card")}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    }
}

export default SaleMode; 