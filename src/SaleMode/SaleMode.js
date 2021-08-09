import { Component } from "react"
import Barcode from "../Barcode/Barcode"
import API from "../SPOS-API"

class SaleMode extends Component {
    keyHandler(e) {
        if (e.key === 'Enter') {
            let code = this.refs.txtArea.value;
            this.refs.txtArea.value = "";

            let b = Barcode.Represent(code);
            console.log(b);
            if(b.type == Barcode.BarcodeTypes.Unknown || !b.checksumPassed) {
                this.refs.dataOutput.innerHTML = "Invalid Barcode!";
            } else {
                this.searchForProductID(b.productCode);
            }
        }
    }

    searchForProductID(b) {
        this.refs.dataOutput.innerHTML = `Searching for the product #${b}... Please wait!`;
        API.SearchProductID(b).then(r => {
            if(!r.success) {
                this.refs.dataOutput.innerHTML = `<p style="color: red;">Product not found!</p>`;
            } else {
                this.refs.dataOutput.innerHTML = `${r.name}(${r.price} LEI)`;
            }
        }).catch(e => {
            this.refs.dataOutput.innerHTML = `<p style="color: red;">System error while searching for product #${b}</p>`;
        });
    }

    keyPageHandler(e) {
        if((e.key >= '0' && e.key <= '9') || e.key === "Enter") {
            this.refs.txtArea.focus();
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.keyPageHandler.bind(this), false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyPageHandler, false);
    }

    render() {
        return <div style={{"textAlign": "center"}}>
            <h1 style={{"marginTop": "0"}}>SupremoPOS - Sale Mode</h1>
            <input type="text" placeholder="enter barcode" style={{"fontSize": "25px"}} ref="txtArea" onKeyUp={this.keyHandler.bind(this)}></input>
            <p ref="dataOutput">no barcode scanned.</p>
        </div>
    }
}

export default SaleMode; 