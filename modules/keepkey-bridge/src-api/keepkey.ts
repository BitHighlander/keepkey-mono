/*
    Core KeepKey module
        Interface to Hardware controller routes

 */



//hardware
let Hardware = require("@bithighlander/keepkey-hardware")

let IS_INIT = false

module.exports = {
    isInitialized: function () {
        return IS_INIT;
    },
    hardwareStart: function () {
        IS_INIT = true
        return Hardware.start();
    },
    hardwareState: function () {
        return Hardware.state();
    },
    hardwareLocked: function () {
        return Hardware.isLocked();
    },
    hardwareInfo: function () {
        return Hardware.info();
    },
    hardwareWipe: function () {
        return Hardware.wipe();
    },
    hardwareLoad: function (mnemonic:string) {
        return Hardware.load(mnemonic);
    },
    hardwareShowPin: function () {
        return Hardware.displayPin();
    },
    hardwareEnterPin: function (pin:string) {
        return Hardware.enterPin(pin);
    }
}
