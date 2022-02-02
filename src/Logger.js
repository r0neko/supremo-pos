async function Success(...args) {
    console.log(`%c${args.join(" ")}`, "color:green");
}

async function Info(...args) {
    console.log(`%c${args.join(" ")}`, "color: cyan");
}

async function Warning(...args) {
    console.log(`%c${args.join(" ")}`, "color: yellow");
}

async function Failure(...args) {
    console.log(`%c${args.join(" ")}`, "color: red");
}

module.exports = {
    Info,
    Failure,
    Success,
    Warning
};