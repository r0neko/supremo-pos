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
    }

    add_product() {
        let p = PopupManager.ShowPopup("Informatie", "Se adauga produsul...");

        API.AddProduct(this.product_name.current.value, parseFloat(this.price.current.value.replace(".", ",")), this.barcode.current.value, parseInt(this.plu.current.value)).then((status) => {
            PopupManager.ClosePopup(p);

            this.product_name.current.value = "";
            this.barcode.current.value = "";
            this.plu.current.value = "";
            this.price.current.value = "";

            PopupManager.ShowPopup("Informatie", "Produsul a fost adăugat cu succes în baza de date!", [], 1);
        });
    }

    render() {
        return <Fragment>
            <h1>Înregistrare Produs</h1>
            <div className="mb-3 mt-3">
                <label class="form-label">Nume Produs:</label>
                <input type="text" class="form-control" ref={this.product_name} />
            </div>
            <div className="mb-3">
                <label class="form-label">Preț:</label>
                <input type="text" class="form-control" ref={this.price} />
            </div>
            <div className="mb-3">
                <label class="form-label">Cod Bare</label>
                <input type="text" class="form-control" ref={this.barcode} />
            </div>
            <div className="mb-3">
                <label class="form-label">PLU(optional)</label>
                <input type="text" class="form-control" ref={this.plu} />
            </div>
            <Button onClick={this.add_product.bind(this)}>Adaugare</Button>
        </Fragment>
    }
}

export default BackOfficeAddProduct; 