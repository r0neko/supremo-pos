const EventEmitter = require('events');

class ConfigEntry extends EventEmitter {
    constructor(name, default_value) {
        super();

        this.name = name;
        this.v = default_value;
    }

    get value() {
        return this.v;
    }

    set value(val) {
        this.emit("update", this.v = val)
    }
}

export default ConfigEntry;