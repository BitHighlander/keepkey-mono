/*

    Pioneer REST endpoints



 */
let TAG = ' | API | '

const pjson = require('../../package.json');
const log = require('@pioneer-platform/loggerdog')()
const os = require("os")

//hardware
let kk = require('../keepkey')

//rest-ts
import { Body, Controller, Get, Post, Route, Tags, SuccessResponse, Query, Request, Response, Header } from 'tsoa';

export interface Error{
    success:boolean
    tag:string
    e:any
}

export class ApiError extends Error {
    private statusCode: number;
    constructor(name: string, statusCode: number, message?: string) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

//route
@Tags('Status Endpoints')
@Route('')
export class IndexController extends Controller {

    //remove api key


    /*
        Health endpoint
    */

    @Get('/info')
    public async health() {
        let tag = TAG + " | health | "
        try{


            let output:any = {
                online:true,
                hostname:os.hostname(),
                uptime:os.uptime(),
                loadavg:os.loadavg(),
                name:pjson.name,
                version:pjson.version
            }

            return(output)
        }catch(e){
            let errorResp:Error = {
                success:false,
                tag,
                e
            }
            log.error(tag,"e: ",{errorResp})
            throw new ApiError("error",503,"error: "+e.toString());
        }
    }

    @Get('/init')
    public async init() {
        let tag = TAG + " | init | "
        try{

            let output:any = {
                init:kk.isInitialized()
            }

            return(output)
        }catch(e){
            let errorResp:Error = {
                success:false,
                tag,
                e
            }
            log.error(tag,"e: ",{errorResp})
            throw new ApiError("error",503,"error: "+e.toString());
        }
    }

    @Get('/ping')
    public async ping() {
        let tag = TAG + " | ping | "
        try{

            let output:any = {
                init:true
            }

            return(output)
        }catch(e){
            let errorResp:Error = {
                success:false,
                tag,
                e
            }
            log.error(tag,"e: ",{errorResp})
            throw new ApiError("error",503,"error: "+e.toString());
        }
    }

    //TODO if pair show popup
    //TODO if paired allow pubkey
    //TODO if sign, display tx Info

    @Get('/exchange/{kind}')
    public async exchange() {
        let tag = TAG + " | exchange | "
        try{


            let output:any = {
                init:true
            }

            return(output)
        }catch(e){
            let errorResp:Error = {
                success:false,
                tag,
                e
            }
            log.error(tag,"e: ",{errorResp})
            throw new ApiError("error",503,"error: "+e.toString());
        }
    }

}
