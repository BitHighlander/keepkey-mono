#!/usr/bin/env node
"use strict";
/*
        KeepKey CLI
            -Highlander

    A node.js CLI for managing a keepkey

 */
require("dotenv").config();
require("dotenv").config({path: "./../.env"});
require("dotenv").config({path: "../../.env"});
require("dotenv").config({path: "../../../.env"});
require("dotenv").config({path: "../../../.env"});
require("dotenv").config({path: "../../../../.env"});


const TAG = " | App | ";
//cli tools
const inquirer = require("inquirer");


import {
    showWelcome
} from './modules/views'

//Subcommand patch
const program = require( './modules/commander-patch' );
const log = require("loggerdog-client")();

// must be before .parse()
program.on('--help', () => {
    showWelcome()
});

/*
    Platform APPs
        App ecosystem
        Create
        Publish
        Revoke
 */

const walletCommand = program
    .command( 'bridge' )
    .description( 'bridge' )
    .forwardSubcommands();

walletCommand
    .command( 'start' )
    .action( () => {
        log.info(" start bridge! ")
    } );

// /*
//     Platform Users
//         List users
//         ping user
//         send request
//         view requests
//  */
// const userCommand = program
//     .command( 'bridge' )
//     .description( 'KeepKey Bridge' )
//     .forwardSubcommands();
//
// userCommand
//     .command( 'help' )
//     .action( () => {
//         log.debug(" get bridge help info")
//     } );
//
// userCommand
//     .command( 'start' )
//     .action( () => {
//         log.debug(" start a KeepKey Bridge server")
//     } );



/*
    onStart
        If no commands, assume --it
 */
log.info("args",process.argv)

const onInteractiveTerminal = async function(){
    let tag = TAG + " | onInteractiveTerminal | "
    try{
        log.info("Starting Interactive Terminal")
        //start --it mode
        showWelcome()

        //TODO
        //all the things


    }catch(e){
        log.error("Terminal Exit: ",e)
        process.exit(2)
    }
}

if(process.argv.length === 2){
    onInteractiveTerminal()
} else {
    program.parse( process.argv );
}


















