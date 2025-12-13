import CookieService from "./Cookie.service";
import MessageService from "./Message.service";
import CacheService from "./Cache.service";
import * as _ from "lodash";
import { CommonUtil } from "../utils/common.util";
import { AxiosInstance } from "axios";

const AInterceptor = {
    errorLogger: [] as any,
    init: function(instance:any){
        instance.interceptors.request.use((config:any) => {
            MessageService.destroy();
            const authtoken = CookieService.get("authToken");
            if(authtoken) {
              config.headers["Authorization"] = authtoken;
              config.headers["Content-Type"] = "application/json";
            }
            return config;
        });
        instance.interceptors.response.use(function(response:any) {
            try{
                if(response.headers.ott){
                    if(!(response.config && response.config.data && JSON.parse(response.config.data as string).operation === 'contact_verification')){
                        CookieService.set('authToken',response.headers.ott);
                    }
                }
            }catch(e){
                console.log(e);
            }
            return response;
          }, function (error:any) {
            AInterceptor.errorLogger.push(error);
            if(error.response){
                if(error.response.data && error.response.data.message === "Invalid Authtoken") {
                    CookieService.clearAll();
                }
                if(error.response.headers && error.response.headers.ott){
                    CookieService.set('authToken',error.response.headers.ott);
                }
            }
            return Promise.reject(error);
          });
    }
}

interface ApiTracker {
    url: string;
    method: string;
    config: any;
    data?: any;
    failureCallback?: (error: any) => void;
}

const preprocess = (params:any)=>{
    const { header, ...rest } = params;
    return { ...header, params: rest };
}


let AXIOS_INSTANCE:AxiosInstance;

const ApiService = {

    init: function(){
        AXIOS_INSTANCE = CommonUtil.getNewAxiosInstance(import.meta.env.VITE_API_BASE_URL);
        AInterceptor.init(AXIOS_INSTANCE);
    }, 

    getConfig: function(params: any){
        const { header, ...rest } = params;
        return { ...header, params: rest };
    },

    processPromise : async function(api:any, failureCallback:any){
        return await api.then((response:any) => {
            return response.data;
        }).catch((error:any) => {
            if(failureCallback){
                failureCallback(error)
            }else{
                MessageService.error(error.response.data.message);
            }
            return undefined;
        });
    },

    get: async function(url: string, params: any, failureCallback?: (error: any) => void) {
        let apiCacheUrl = url + (params ? "?" + JSON.stringify(params) : "");
        if(!CacheService.isCached(apiCacheUrl)){
            const response = await ApiService.processPromise(AXIOS_INSTANCE.get(url, preprocess(params)), failureCallback);
            if(response != undefined){
                CacheService.update(apiCacheUrl, response)
            }
        }
        return CacheService.get(apiCacheUrl)
    },

    delete: async function(url: string, params: any, failureCallback?: (error: any) => void){
        return await ApiService.processPromise(AXIOS_INSTANCE.delete(url, preprocess(params)), failureCallback);
    },
    
    post: async function(url: string, data: any, params: any, failureCallback?: (error: any) => void){
        return await ApiService.processPromise(AXIOS_INSTANCE.post(url, data, preprocess(params)), failureCallback);
    },
    
    put: async function(url: string, data: any, params: any, failureCallback?: (error: any) => void){
        return await ApiService.processPromise(AXIOS_INSTANCE.put(url, data, preprocess(params)), failureCallback);
    },
    
    multipartRequest: async function(url: string, data: any, params: any, failureCallback?: (error: any) => void){
        const config = preprocess(params);
        if (config.headers) {
            config.headers["Content-Type"] = "multipart/form-data";
        }
        return await ApiService.processPromise(AXIOS_INSTANCE.post(url, data, config), failureCallback);
    },

    startApi: async (_uid: string, _url: string, _method: string, _config: any, _data: any) => {
    },

    endApi: async (response: any, _uniqueId: string) => {
        return response;
    },

    executeTrackerList: async function(trackerList: ApiTracker[]){
        return await _.map(trackerList, async (apiTracker) => {
            if(apiTracker.method === 'GET'){
                return await ApiService.get(apiTracker.url, apiTracker.config.params, apiTracker.failureCallback);
            }else if(apiTracker.method === 'POST'){
                return await ApiService.post(apiTracker.url, apiTracker.config.data, apiTracker.config.params, apiTracker.failureCallback);
            }else if(apiTracker.method === 'PUT'){
                return await ApiService.put(apiTracker.url, apiTracker.data, apiTracker.config, apiTracker.failureCallback);
            }else if(apiTracker.method === 'DELETE'){
                return await ApiService.delete(apiTracker.url, apiTracker.config, apiTracker.failureCallback);
            }
            return undefined;
        });
    }
}

export default ApiService;
