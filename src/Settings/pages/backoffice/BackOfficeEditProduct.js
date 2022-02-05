import { Component, Fragment, createRef } from "react";
import API from "../../../API";
import Button from "../../../Button/Button";

import PopupManager from "../../../PopupManager";

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
        let p = PopupManager.ShowPopup("Informatie", "Se modifică produsul...");

        API.ModifyProduct(this.state.product.id, this.product_name.current.value, parseFloat(this.price.current.value.replace(".", ",")), this.barcode.current.value, parseInt(this.plu.current.value)).then((status) => {
            PopupManager.ClosePopup(p);
            PopupManager.ShowPopup("Informatie", "Produsul a fost modificat cu succes!", [], 1);
            this.setState({ id: 0, editingProduct: false, product: null });
            this.prod_plu.current.value = "";
        });
    }

    find_product() {
        let plu = this.prod_plu.current.value;
        let wait_popup = PopupManager.ShowPopup("Așteptați...", `Se caută PLU '${plu}'...`);

        API.SearchProductID(plu).then(r => {
            PopupManager.ClosePopup(wait_popup);

            if (!r.success) {
                PopupManager.ShowPopup("Eroare", `O eroare neașteptată a avut loc la procesarea codului PLU!`, [], 1);
            } else {
                if (r.product) {
                    this.setState({ id: r.product.id, editingProduct: true, product: r.product });
                } else
                    PopupManager.ShowPopup("Eroare", `Codul PLU '${plu}' nu există!`, [], 1);
            }
        }).catch(e => {
            PopupManager.ClosePopup(wait_popup);
            PopupManager.ShowPopup("Eroare", `O eroare necunoscută a avut loc în timpul căutării produsului! Vă rugăm sa încercați din nou! ${e}`, [], 1);
        });
    }

    updateProdField(field, value) {
        this.setState({ product: { ...this.state.product, [field]: value } });
    }

    render() {
        if (!this.state.editingProduct)
            return <Fragment>
                <h1>Căutare produs</h1>
                <div className="mb-3 mt-3">
                    <label class="form-label">Cod de bare/PLU:</label>
                    <input type="text" class="form-control" ref={this.prod_plu} />
                </div>
                <Button onClick={this.find_product.bind(this)}>Căutare</Button>
            </Fragment>

        return <Fragment>
            <h1>Editare Produs #{this.state.product.id}</h1>
            <div className="mb-3 mt-3">
                <label class="form-label">Nume Produs:</label>
                <input type="text" class="form-control" ref={this.product_name} value={this.state.product.description} onChange={e => this.updateProdField("description", e.target.value)}/>
            </div>
            <div className="mb-3">
                <label class="form-label">Preț:</label>
                <input type="text" class="form-control" ref={this.price} value={this.state.product.price} onChange={e => this.updateProdField("price", e.target.value)}/>
            </div>
            <div className="mb-3">
                <label class="form-label">Cod Bare</label>
                <input type="text" class="form-control" ref={this.barcode} value={this.state.product.barcode} onChange={e => this.updateProdField("barcode", e.target.value)}/>
            </div>
            <div className="mb-3">
                <label class="form-label">PLU(optional)</label>
                <input type="text" class="form-control" ref={this.plu} value={this.state.product.plu} onChange={e => this.updateProdField("plu", e.target.value)}/>
            </div>
            <Button onClick={this.edit_product.bind(this)}>Modificare</Button>
        </Fragment>
    }
}

export default BackOfficeAddProduct; 