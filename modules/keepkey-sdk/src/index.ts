/*

    KeepKey SDK

 */
const TAG = " | KK-SDK | "
const log = require("loggerdog-client")();

const {
    getPaths,
    getNativeAssetForBlockchain,
    normalize_pubkeys
} = require('@pioneer-platform/pioneer-coins')

module.exports = class wallet {
    private PUBLIC_WALLET:any = {};
    private hdwallet: any
    private paths: (blockchains: []) => any;
    private init: (wallet?: any) => Promise<void>;
    private blockchains: []
    private getPubkeys: () => any;
    constructor(wallet:any,blockchains:[]) {
        this.hdwallet = wallet
        this.blockchains = blockchains
        this.init = async function (wallet?:any) {
            let tag = TAG + " | init_wallet | "
            try{

            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
        this.paths = function (blockchains) {
            let tag = TAG + " | get_paths | "
            try {
                let output:any = []
                let paths = getPaths(blockchains)
                for(let i = 0; i < paths.length; i++){
                    let path = paths[i]
                    let pathForKeepkey:any = {}
                    //send coin as bitcoin
                    pathForKeepkey.symbol = path.symbol
                    pathForKeepkey.addressNList = path.addressNList
                    //why
                    pathForKeepkey.coin = 'Bitcoin'
                    pathForKeepkey.script_type = 'p2pkh'

                    output.push(pathForKeepkey)
                }
                return output
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getPubkeys = async function () {
            let tag = TAG + " | getPubkeys | "
            try {
                if(!this.blockchains || this.blockchains.length === 0) throw Error("Blockchains required!")
                let output:any = {}
                log.info(tag,"blockchains: ",this.blockchains)
                let paths = this.paths(this.blockchains)
                log.info(tag,"getPaths: ",paths)
                //verify paths
                for(let i = 0; i < this.blockchains.length; i++){
                    let blockchain = this.blockchains[i]
                    let symbol = getNativeAssetForBlockchain(blockchain)
                    log.info(tag,"symbol: ",symbol)
                    //find in pubkeys
                    let isFound = paths.find((path: { blockchain: string; }) => {
                        return path.blockchain === blockchain
                    })
                    if(!isFound){
                        throw Error("Failed to find path for blockchain: "+blockchain)
                    }
                }

                let pathsKeepkey:any = []
                for(let i = 0; i < paths.length; i++){
                    let path = paths[i]
                    let pathForKeepkey:any = {}
                    //send coin as bitcoin
                    pathForKeepkey.symbol = path.symbol
                    pathForKeepkey.addressNList = path.addressNList
                    //why
                    pathForKeepkey.coin = 'Bitcoin'
                    pathForKeepkey.script_type = 'p2pkh'
                    //showDisplay
                    pathForKeepkey.showDisplay = false
                    pathsKeepkey.push(pathForKeepkey)
                }


                log.notice("***** paths IN: ",pathsKeepkey.length)
                //NOTE: keepkey returns an ordered array.
                //To build verbose pubkey info we must rebuild based on order
                const result = await this.hdwallet.getPublicKeys(pathsKeepkey);
                log.notice("***** pubkeys OUT: ",result.length)
                if(pathsKeepkey.length !== result.length) {
                    log.error(tag, {pathsKeepkey})
                    log.error(tag, {result})
                    throw Error("Device unable to get path!")
                }
                log.debug("rawResult: ",result)
                log.debug("rawResult: ",JSON.stringify(result))


                //rebuild
                let pubkeys = await normalize_pubkeys('keepkey',result,paths)
                output.pubkeys = pubkeys
                if(pubkeys.length !== result.length) {
                    log.error(tag, {pathsKeepkey})
                    log.error(tag, {result})
                    throw Error("Failed to Normalize pubkeys!")
                }
                log.debug(tag,"pubkeys: (normalized) ",pubkeys.length)
                log.debug(tag,"pubkeys: (normalized) ",pubkeys)

                //add feature info to pubkey
                let keyedWallet:any = {}
                for(let i = 0; i < pubkeys.length; i++){
                    let pubkey = pubkeys[i]
                    if(!keyedWallet[pubkey.symbol]){
                        keyedWallet[pubkey.symbol] = pubkey
                    }else{
                        if(!keyedWallet['available']) keyedWallet['available'] = []
                        //add to secondary pubkeys
                        keyedWallet['available'].push(pubkey)
                    }

                }

                //verify pubkeys
                for(let i = 0; i < this.blockchains.length; i++){
                    let blockchain = this.blockchains[i]
                    let symbol = getNativeAssetForBlockchain(blockchain)
                    log.debug(tag,"symbol: ",symbol)
                    //find in pubkeys
                    let isFound = pubkeys.find((path: { blockchain: string; }) => {
                        return path.blockchain === blockchain
                    })
                    if(!isFound){
                        throw Error("Failed to find pubkey for blockchain: "+blockchain)
                    }
                    //verify master
                }

                let features = this.hdwallet.features;
                log.debug(tag,"vender: ",features)
                log.debug(tag,"vender: ",features.deviceId)

                let walletId = "keepkey-pubkeys-"+features.deviceId
                let watchWallet = {
                    "WALLET_ID": walletId,
                    "TYPE": "watch",
                    "CREATED": new Date().getTime(),
                    "VERSION": "0.1.3",
                    "BLOCKCHAINS: ":this.blockchains,
                    "PUBKEYS":pubkeys,
                    "WALLET_PUBLIC":keyedWallet,
                    "PATHS":paths
                }
                log.debug(tag,"writePathPub: ",watchWallet)
                output.wallet = watchWallet
                return output
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
    }
}

