const BarcodeTypes = {
    Unknown: -1,
    EAN8: 0,
    EAN13: 1
}

function TypeFromSize(s) {
    switch(s) {
        case 8: return BarcodeTypes.EAN8;
        case 13: return BarcodeTypes.EAN13;
        default: return BarcodeTypes.Unknown;
    }
}

function TypeToString(t) {
    switch(t) {
        case BarcodeTypes.EAN8: return "EAN-8";
        case BarcodeTypes.EAN13: return "EAN-13";
        default:
        case BarcodeTypes.Unknown: return "Unknown";
    }
}

function EANChecksum(code) {
    let e = code.slice(0, code.length - 1).split('').map(e => parseInt(e));
    let odd = 0, even = 0;

    e.forEach((i, j) => {
        if(j % 2 == 0) even += i;
        else odd += i;
    })

    return (10 - ((3 * odd + even) % 10)) % 10;
}

function Represent(code) {
    let obj = {
        type: TypeFromSize(code.length),
        barcode: code,
        countryCode: -1,
        manufacturerCode: -1,
        productCode: -1,
        checksum: -1,
        checksumPassed: false
    };

    if(obj.type == BarcodeTypes.EAN13) {
        obj.countryCode = parseInt(code.slice(0, 3));
        obj.manufacturerCode = parseInt(code.slice(3, 8));
        obj.productCode = parseInt(code.slice(8, 12));
        obj.checksum = parseInt(code.slice(12, 13));
        obj.checksumPassed = EANChecksum(code) == obj.checksum;
    }
    
    return obj;
}

export default {
    Represent,
    BarcodeTypes
};