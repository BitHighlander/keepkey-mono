/*
    Ascii art
        and CLI view generation
            -Highlander
 */
const TAG = " | App | ";
const chalk = require("chalk");
const figlet = require("figlet");
const log = require("loggerdog-client")();


export function showWelcome() {
    let tag = TAG + " | importConfig | ";
    try {
        log.info(
            "\n",
            chalk.blue(figlet.textSync("KeepKey-cli", {horizontalLayout: "full"}))
        );
        log.info(
            " \n A KeepKey management CLI      \n \n                        ---Highlander \n "
        );
    } catch (e) {
        console.error(tag, "e: ", e);
        return {};
    }
}
