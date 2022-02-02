const Logger = require("./Logger");

let KeyMap = [{ "keyCode": 83, "key": "s", "code": "KeyS" }, { "keyCode": 112, "key": "F1", "code": "F1" }, { "keyCode": 116, "key": "F5", "code": "F5" }, { "keyCode": 27, "key": "Escape", "code": "Escape" }, { "keyCode": 113, "key": "F2", "code": "F2" }, { "keyCode": 114, "key": "F3", "code": "F3" }, { "keyCode": 115, "key": "F4", "code": "F4" }, { "keyCode": 117, "key": "F6", "code": "F6" }, { "keyCode": 118, "key": "F7", "code": "F7" }, { "keyCode": 119, "key": "F8", "code": "F8" }, { "keyCode": 120, "key": "F9", "code": "F9" }, { "keyCode": 121, "key": "F10", "code": "F10" }, { "keyCode": 122, "key": "F11", "code": "F11" }, { "keyCode": 123, "key": "F12", "code": "F12" }, { "keyCode": 192, "key": "`", "code": "Backquote" }, { "keyCode": 49, "key": "1", "code": "Digit1" }, { "keyCode": 50, "key": "2", "code": "Digit2" }, { "keyCode": 51, "key": "3", "code": "Digit3" }, { "keyCode": 52, "key": "4", "code": "Digit4" }, { "keyCode": 53, "key": "5", "code": "Digit5" }, { "keyCode": 54, "key": "6", "code": "Digit6" }, { "keyCode": 55, "key": "7", "code": "Digit7" }, { "keyCode": 56, "key": "8", "code": "Digit8" }, { "keyCode": 57, "key": "9", "code": "Digit9" }, { "keyCode": 48, "key": "0", "code": "Digit0" }, { "keyCode": 189, "key": "-", "code": "Minus" }, { "keyCode": 187, "key": "=", "code": "Equal" }, { "keyCode": 8, "key": "Backspace", "code": "Backspace" }, { "keyCode": 9, "key": "Tab", "code": "Tab" }, { "keyCode": 81, "key": "q", "code": "KeyQ" }, { "keyCode": 87, "key": "w", "code": "KeyW" }, { "keyCode": 69, "key": "e", "code": "KeyE" }, { "keyCode": 82, "key": "r", "code": "KeyR" }, { "keyCode": 84, "key": "t", "code": "KeyT" }, { "keyCode": 89, "key": "y", "code": "KeyY" }, { "keyCode": 85, "key": "u", "code": "KeyU" }, { "keyCode": 73, "key": "i", "code": "KeyI" }, { "keyCode": 79, "key": "o", "code": "KeyO" }, { "keyCode": 80, "key": "p", "code": "KeyP" }, { "keyCode": 219, "key": "[", "code": "BracketLeft" }, { "keyCode": 221, "key": "]", "code": "BracketRight" }, { "keyCode": 220, "key": "\\\\", "code": "Backslash" }, { "keyCode": 20, "key": "CapsLock", "code": "CapsLock" }, { "keyCode": 65, "key": "A", "code": "KeyA" }, { "keyCode": 90, "key": "Z", "code": "KeyZ" }, { "keyCode": 88, "key": "X", "code": "KeyX" }, { "keyCode": 68, "key": "D", "code": "KeyD" }, { "keyCode": 67, "key": "C", "code": "KeyC" }, { "keyCode": 70, "key": "F", "code": "KeyF" }, { "keyCode": 86, "key": "V", "code": "KeyV" }, { "keyCode": 71, "key": "G", "code": "KeyG" }, { "keyCode": 72, "key": "h", "code": "KeyH" }, { "keyCode": 74, "key": "J", "code": "KeyJ" }, { "keyCode": 75, "key": "K", "code": "KeyK" }, { "keyCode": 222, "key": "\'", "code": "Quote" }, { "keyCode": 186, "key": ";", "code": "Semicolon" }, { "keyCode": 76, "key": "L", "code": "KeyL" }, { "keyCode": 13, "key": "Enter", "code": "Enter" }, { "keyCode": 16, "key": "Shift", "code": "ShiftRight" }, { "keyCode": 190, "key": ".", "code": "Period" }, { "keyCode": 188, "key": ",", "code": "Comma" }, { "keyCode": 77, "key": "M", "code": "KeyM" }, { "keyCode": 191, "key": "/", "code": "Slash" }, { "keyCode": 66, "key": "b", "code": "KeyB" }, { "keyCode": 78, "key": "n", "code": "KeyN" }, { "keyCode": 91, "key": "Meta", "code": "MetaLeft" }, { "keyCode": 17, "key": "Control", "code": "ControlLeft" }, { "keyCode": 18, "key": "Alt", "code": "AltLeft" }, { "keyCode": 32, "key": " ", "code": "Space" }, { "keyCode": 93, "key": "ContextMenu", "code": "ContextMenu" }, { "keyCode": 40, "key": "ArrowDown", "code": "ArrowDown" }, { "keyCode": 39, "key": "ArrowRight", "code": "ArrowRight" }, { "keyCode": 37, "key": "ArrowLeft", "code": "ArrowLeft" }, { "keyCode": 38, "key": "ArrowUp", "code": "ArrowUp" }, { "keyCode": 45, "key": "Insert", "code": "Insert" }, { "keyCode": 36, "key": "Home", "code": "Home" }, { "keyCode": 33, "key": "PageUp", "code": "PageUp" }, { "keyCode": 46, "key": "Delete", "code": "Delete" }, { "keyCode": 35, "key": "End", "code": "End" }, { "keyCode": 34, "key": "PageDown", "code": "PageDown" }, { "keyCode": 144, "key": "NumLock", "code": "NumLock" }, { "keyCode": 106, "key": "*", "code": "NumpadMultiply" }, { "keyCode": 109, "key": "-", "code": "NumpadSubtract" }, { "keyCode": 110, "key": ".", "code": "NumpadDecimal" }, { "keyCode": 96, "key": "0", "code": "Numpad0" }, { "keyCode": 107, "key": "+", "code": "NumpadAdd" }, { "keyCode": 111, "key": "/", "code": "NumpadDivide" }, { "keyCode": 97, "key": "1", "code": "Numpad1" }, { "keyCode": 99, "key": "3", "code": "Numpad3" }, { "keyCode": 103, "key": "7", "code": "Numpad7" }, { "keyCode": 100, "key": "4", "code": "Numpad4" }, { "keyCode": 98, "key": "2", "code": "Numpad2" }, { "keyCode": 101, "key": "5", "code": "Numpad5" }, { "keyCode": 105, "key": "9", "code": "Numpad9" }, { "keyCode": 104, "key": "8", "code": "Numpad8" }, { "keyCode": 102, "key": "6", "code": "Numpad6" }];
let canHandle = false;

let callbacks = {
    "up": [],
    "down": []
};

function GetKey(code) {
    return KeyMap.find(key => key.keyCode == code);
}

function KeyDownHandler(event) {
    if (!canHandle) return;

    if (event.defaultPrevented)
        return;

    Logger.Info("InputManager KeyDown", event.code)
    CallHandler("down", event);
}

function KeyUpHandler(event) {
    if (!canHandle) return;

    if (event.defaultPrevented)
        return;

    Logger.Info("InputManager KeyUp", event.code)
    CallHandler("up", event);
}

function DispatchKeyEvent(keyCode) {
    console.log(keyCode);
    console.log(GetKey(keyCode));
    window.dispatchEvent(
        new KeyboardEvent('keyup', GetKey(keyCode))
    );
}

function AddHandler(what, callback) {
    callbacks[what].push(callback);
}

function CallHandler(what, args) {
    callbacks[what].forEach(callback => {
        callback(args);
    });
}

function Enable() {
    EnableHandling(true);
}

function Disable() {
    EnableHandling(false);
}

function EnableHandling(state = false) {
    if (canHandle == state) return;
    canHandle = state;
}

window.addEventListener("keydown", KeyDownHandler, true);
window.addEventListener("keyup", KeyUpHandler, true);
Logger.Success("InputManager Registered!");

module.exports = {
    Enable,
    Disable,
    AddHandler,
    DispatchKeyEvent
};