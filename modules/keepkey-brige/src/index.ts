require('dotenv').config()
require('dotenv').config({path:"./.env"})
require('dotenv').config({path:"./../.env"})
require('dotenv').config({path:"./../../.env"})
require('dotenv').config({path:"../../../.env"})
require('dotenv').config({path:"../../../../.env"})
require('dotenv').config({path:"./../../../../.env"})

const pjson = require('../package.json');
const TAG = " | "+ pjson.name +" | "

//hardware
let Hardware = require("@keepkey/keepkey-hardware")

const log = require('@pioneer-platform/loggerdog')()
const express = require( "express" );
const app = express();
let API_PORT:any = process.env["API_PORT_BRIDGE"] || "3000"
API_PORT = parseInt(API_PORT)

// define a route handler for the default home page
app.get( "/info", ( req:any, res:any ) => {
    let output = Hardware.info()
    res.send( output );
} );

app.get( "/state", ( req:any, res:any ) => {
    let output = Hardware.state()
    res.send( output );
} );

app.get( "/locked", ( req:any, res:any ) => {
    let output = Hardware.isLocked()
    res.send( output );
} );

const start_server = function(){
    try{
        // start the Express server
        app.listen( API_PORT, () => {
            console.log( `server started at http://localhost:${ API_PORT }` );
        } );
    }catch(e){
        log.error(e)
    }
}

module.exports = {
    startServer: function () {
        return start_server();
    },
    allDevices: function () {
        return Hardware.allDevices();
    },
    startKeepkey: function () {
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
