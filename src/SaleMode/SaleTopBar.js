import {
    Component
} from "react"
import "./styles/SaleMode.css"
import Logo from "../Assets/SPOSLogo.png";

class SaleTopBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: new Date().toLocaleString()
        };
    }

    componentDidMount() {
        this.intervalTime = setInterval(this.onTimeUpdate.bind(this), 10);
    }

    componentWillUnmount() {
        clearInterval(this.intervalTime);
    }

    onTimeUpdate() {
        this.setState({
            currentDate: new Date().toLocaleString()
        });
    }

    render() {
        return <div className="pos-top-bar">
                <div className="pos-logo">
                    <img src={Logo} alt="SPOS Logo"></img>
                </div>
                <div className="pos-title">
                    Selling Mode – {this.state.currentDate}
                </div>
                <div className="pos-account">
                    Administrator
                </div>
            </div>
    }
}

export default SaleTopBar;