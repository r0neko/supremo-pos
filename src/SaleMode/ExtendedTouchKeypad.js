import TouchKeypad from "./TouchKeypad"

class ExtendedTouchKeypad extends TouchKeypad {
    getKeyMap() {
        return [49, 50, 51, 106, 52, 53, 54, 13, 55, 56, 57, 188, 48, 8];
    }

    getMatrix() {
        return [
            [1, 2, 3, "QTY"],
            [4, 5, 6, "PLU"],
            [7, 8, 9,],
            [",", "0", "C<"]
        ];
    }
}

export default ExtendedTouchKeypad;