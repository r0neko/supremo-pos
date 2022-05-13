import ConfigManager from "./ConfigManager";
import API from "./API";

function getVATSharePercentage(group) {
    switch (group.toUpperCase()) {
        default:
        case "A":
            return ConfigManager.tva.value.a;
        case "B":
            return ConfigManager.tva.value.b;
        case "C":
            return ConfigManager.tva.value.c;
        case "D":
            return ConfigManager.tva.value.d;
        case "S":
            return ConfigManager.tva.value.s;
    }
}

class Product {
    constructor(name, price, vat_group = "A") {
        this.id = -1;
        this.name = name;
        this.price = price;
        this.barcode = "";
        this.plu = null;
        this.vat_group = vat_group;
        this.quantity = 1;
    }

    static _fromJSON(json) {
        if(!json.success || json.product == null) return null;

        let product = new Product(json.product.description, json.product.price, json.product.vat_group);
        product.plu = json.product.plu;
        product.id = json.product.id;
        product.barcode = json.product.barcode;

        return product;
    }

    static async findBarcode(barcode) {
        return this._fromJSON(await API.SearchBarcode(barcode));
    }

    static async findPLU(plu) {
        return this._fromJSON(await API.SearchPLU(plu));
    }

    getPrice() {
        return this.price * this.quantity;
    }

    getPriceSingular() {
        return this.price;
    }

    getVAT() {
        return this.getPrice() * (getVATSharePercentage(this.vat_group) / 100);
    }

    getVATSingular() {
        return this.getPriceSingular() * (getVATSharePercentage(this.vat_group) / 100);
    }

    getPriceWithVAT() {
        return this.getPrice() + this.getVAT();
    }

    getPriceWithVATSingular() {
        return this.getPriceSingular() + this.getVATSingular();
    }
}

export default Product;