import { Component, Fragment, createRef } from "react";
import API from "../../../API";
import Button from "../../../Button/Button";
import LocaleManager from "../../../Locale/LocaleManager";

import PopupManager from "../../../PopupManager";
import Product from "../../../Product";

class BackOfficeAddProduct extends Component {
    constructor() {
        super();

        this.product_name = createRef();
        this.price = createRef();
        this.barcode = createRef();
        this.plu = createRef();
        this.prod_plu = createRef();

        this.state = {
            id: 0,
            editingProduct: false,
            product: null
        }
    }

    edit_product() {
        let p = PopupManager.ShowPopup(LocaleManager.GetString("general.info"), LocaleManager.GetString("config.products.messages.modifyingProduct"));

        API.ModifyProduct(this.state.product.id, this.product_name.current.value, parseFloat(this.price.current.value.replace(".", ",")), this.barcode.current.value, parseInt(this.plu.current.value)).then((status) => {
            PopupManager.ClosePopup(p);
            PopupManager.ShowPopup(LocaleManager.GetString("general.info"), LocaleManager.GetString("config.products.messages.productModifiedSuccessfully"), [], 1);
            this.setState({ id: 0, editingProduct: false, product: null });
            this.prod_plu.current.value = "";
        });
    }

    find_product() {
        let plu = this.prod_plu.current.value;
        let wait_popup = PopupManager.ShowPopup(LocaleManager.GetString("general.pleaseWait"), LocaleManager.GetString("sale.message.searchingPLU", { plu }));

        Product.findPLU(plu).then(r => {
            PopupManager.ClosePopup(wait_popup);

            if (r)
                this.setState({ id: r.id, editingProduct: true, product: r });
            else
                PopupManager.ShowPopup(LocaleManager.GetString("general.error"), LocaleManager.GetString("sale.message.pluNotFound", { plu }), [], 1);
        }).catch(e => {
            PopupManager.ClosePopup(wait_popup);
            PopupManager.ShowPopup(LocaleManager.GetString("general.error"), LocaleManager.GetString("general.error"), LocaleManager.GetString("sale.message.searchError", { error: e.message }), [], 1);
        });
    }

    updateProdField(field, value) {
        this.setState({ product: { ...this.state.product, [field]: value } });
    }

    render() {
        if (!this.state.editingProduct)
            return <Fragment>
                <h1>{LocaleManager.GetString("config.products.searchProduct")}</h1>
                <div className="mb-3 mt-3">
                    <label class="form-label">{LocaleManager.GetString("general.barcode")}/{LocaleManager.GetString("general.plu")}:</label>
                    <input type="text" class="form-control" ref={this.prod_plu} />
                </div>
                <Button onClick={this.find_product.bind(this)}>{LocaleManager.GetString("general.search")}</Button>
            </Fragment>

        return <Fragment>
            <h1>{LocaleManager.GetString("config.products.editingProduct", { id: this.state.product.id })}</h1>
            <div className="mb-3 mt-3">
                <label class="form-label">{LocaleManager.GetString("general.name")}:</label>
                <input type="text" class="form-control" ref={this.product_name} value={this.state.product.description} onChange={e => this.updateProdField("description", e.target.value)} />
            </div>
            <div className="mb-3">
                <label class="form-label">{LocaleManager.GetString("general.price")}:</label>
                <input type="text" class="form-control" ref={this.price} value={this.state.product.price} onChange={e => this.updateProdField("price", e.target.value)} />
            </div>
            <div className="mb-3">
                <label class="form-label">{LocaleManager.GetString("general.barcode")}:</label>
                <input type="text" class="form-control" ref={this.barcode} value={this.state.product.barcode} onChange={e => this.updateProdField("barcode", e.target.value)} />
            </div>
            <div className="mb-3">
                <label class="form-label">{LocaleManager.GetString("general.plu")}({LocaleManager.GetString("general.optional")}):</label>
                <input type="text" class="form-control" ref={this.plu} value={this.state.product.plu} onChange={e => this.updateProdField("plu", e.target.value)} />
            </div>
            <Button onClick={this.edit_product.bind(this)}>{LocaleManager.GetString("general.save")}</Button>
        </Fragment>
    }
}

export default BackOfficeAddProduct; 