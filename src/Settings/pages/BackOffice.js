import { Component, Fragment } from "react";
import Button from "../../Button/Button";
import LocaleManager from "../../Locale/LocaleManager";

import BackOfficeAddProduct from "./backoffice/BackOfficeAddProduct";
import BackOfficeEditProduct from "./backoffice/BackOfficeEditProduct";

const menu_items = [
    { name: LocaleManager.GetString("general.add"), render: <BackOfficeAddProduct /> },
    { name: LocaleManager.GetString("general.edit"), render: <BackOfficeEditProduct /> },
];

class Settings extends Component {
    constructor() {
        super();

        this.state = {
            selectedElement: 0
        }
    }

    selectElement(index) {
        if (menu_items[index].onClick != null)
            menu_items[index].onClick();

        this.setState({
            selectedElement: index
        });
    }

    render() {
        return <Fragment>
            <nav class="nav nav-pills nav-justified">
                {menu_items.map((item, index) => <a class={"nav-link" + (this.state.selectedElement == index ? " active" : "")} href="#" onClick={this.selectElement.bind(this, index)}>{item.name}</a>)}
            </nav>
            <br />
            {menu_items.find((item, index) => index == this.state.selectedElement).render || ""}
        </Fragment>
    }
}

export default Settings; 