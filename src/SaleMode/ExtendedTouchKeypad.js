import TouchKeypad from "./TouchKeypad"

class ExtendedTouchKeypad extends TouchKeypad {
    genKeys() {
        let keys = [];
        let extraKeys = [",", "0", "C<"]

        for(let i = 1; i < 13; i++) {
            keys.push(this.renderButton(i, (i >= 10 ? extraKeys[i - 10] : i), !(i % 3) && i != 3 && i != 6 && i != 9));
            if(i == 3) keys.push(this.renderButton(i + 1, "X", true, true));
            if(i == 6) keys.push(this.renderButton(i + 1, "PLU", true, true));
            if(i == 9) keys.push(this.renderButton(i + 1, "ClientCard", true, true));
            if(!(i % 3))
                keys.push(<br/>);
        }
        return keys;
    }
}

export default ExtendedTouchKeypad;