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

let KEEPKEY_ADAPTER:any = {}

const log = require('@pioneer-platform/loggerdog')()
const express = require( "express" );
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let API_PORT:any = process.env["API_PORT_BRIDGE"] || "1646"
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

//bridge
app.post('/exchange/device', function (req:any, res:any) {
    let body = req.body
    log.info("body: ",body)
    log.info("KEEPKEY_ADAPTER: ",KEEPKEY_ADAPTER)
    let msg = Buffer.from(req.body, "hex")
    KEEPKEY_ADAPTER.transport.writeChunk(msg)
    let output = "foobar"
    res.send( output );
});

//catchall
app.use((err:any, req:any, res:any, next:any) => {
    const { status = 500, message = 'something went wrong. ', data = {} } = err
    log.error(message)
    res.status(status).json({ message, data })
})

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
    startKeepkey: async function () {
        KEEPKEY_ADAPTER = await Hardware.start()
        return KEEPKEY_ADAPTER;
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
