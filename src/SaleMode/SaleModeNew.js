import { Component } from "react"
import SaleTopBar from "./SaleTopBar"
import ExtendedTouchKeypad from "./ExtendedTouchKeypad"
import "./styles/SaleMode.css"

// well fuck i fucked touchpad button css ¯\_(ツ)_/¯

class SaleMode extends Component {
    render() {
        return <div className="pos-sale-container">
            <SaleTopBar />
            <ExtendedTouchKeypad/>
        </div>
    }
}

export default SaleMode; 