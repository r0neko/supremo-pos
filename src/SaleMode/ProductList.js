import { React, Component } from 'react';
import "./styles/ProductList.css"
import LocaleManager from '../Locale/LocaleManager';

class ProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            selected: 0
        };
    }

    selectProduct(idx) {
        this.setState({ selected: idx });
    }

    getSelectedProduct() {
        return this.state.products[this.state.selected];
    }

    updateReceipt(r) {
        this.setState({ products: r.products, selected: r.products.length - 1 });
    }

    clear() {
        this.setState({ products: [], selected: -1 });
    }

    render() {
        let products = this.state.products.map((product, i) => {
            return <div className={"list-item product-list__item" + (this.state.selected == i ? " selected" : "") + (product.void ? " void" : "")}
                key={product.id}
                onClick={this.selectProduct.bind(this, i)}
                tabIndex="0"
                ref={ref => i == this.state.products.length - 1 && ref != null && ref.focus()}
            >
                <div className="row">
                    <div className="col">
                        <div className="product-list__item__name">{product.name}</div>
                    </div>
                    <div className="col-3">
                        <div className="product-list__item__price">{product.getPriceWithVAT().toFixed(2)} LEI</div>
                        <div className="product-list__item__price">x{product.quantity}</div>
                        {product.void ? <div className="product-list__item__void">{LocaleManager.GetString("general.voided").toUpperCase()}</div> : null}
                    </div>
                </div>
            </div>;
        });

        return <div className="pos-vert-list product-list">
            {products}
        </div>;
    }
}

export default ProductList;