import { UN_AUTH_URLS } from "../constants/Urls";
import CookieService from "./Cookie.service";
import MessageService from "./Message.service";
import CacheService from "./Cache.service";
import axios, { AxiosRequestConfig } from "axios";
import * as _ from "lodash";

export const AInterceptor = {
    init: function(){
        axios.interceptors.response.use(function (response) {
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
          }, function (error) {
            if(error.response && error.response.headers && error.response.headers.ott){
                CookieService.set('authToken',error.response.headers.ott);
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

const ApiService = {
    errorTrackList: [] as any[],

    getHeader: function(url: string): Record<string, string>{
        MessageService.destroy();
        if(UN_AUTH_URLS.indexOf(url) > -1){
            CookieService.clearAll();
            return {};
        }else{
            const authToken = CookieService.get("authToken") as string;
            return {
                "Authorization": authToken || "",
                "Content-Type": "application/json"
            };
        }
    },

    getParams: function(params: any){
        return params;
    },

    getConfig: function(url: string, params: any): AxiosRequestConfig{
        let headerParams: any = {};
        if(params){
            headerParams = _.clone(params.header);
            delete params.header;
        }
        return {
            ...headerParams,
            headers: ApiService.getHeader(url),
            params: ApiService.getParams(params)
        }
    },

    getQuick: function(url: string, params: any){
        return axios.get(url, ApiService.getConfig(url, params));
    },

    postQuick: function(url: string, data: any, params: any){
        return axios.post(url, data, ApiService.getConfig(url, params));
    },

    get: async function(_dispatch: any, url: string, params: any, failureCallback?: (error: any) => void) {
        let apiCacheUrl = url + (params ? "?" + JSON.stringify(params) : "");
        if(!CacheService.isCached(apiCacheUrl)){
            const config = ApiService.getConfig(url, params);
            const response = await axios.get(url, config).then((response) => {
                return response.data;
            }).catch((error) => {
                ApiService.errorLogger(error, failureCallback);
                return undefined;
            });

            if (response !== undefined) {
                let cacheData;
                try {
                    if (typeof response === "string") {
                        cacheData = JSON.parse(response);
                    } else {
                        cacheData = response;
                    }
                } catch (e) {
                    cacheData = response;
                }
                CacheService.update(apiCacheUrl, cacheData);
            }
            return response;
        }else{
            return CacheService.get(apiCacheUrl);
        }
    },

    delete: async function(_dispatch: any, url: string, params: any, failureCallback?: (error: any) => void){
        const config = ApiService.getConfig(url, params);
        const response = await axios.delete(url, config).then((response) => {
            return response.data;
        }).catch((error) => {
            ApiService.errorLogger(error, failureCallback);
            return undefined;
        });
        return response;
    },

    post: async function(_dispatch: any, url: string, data: any, params: any, failureCallback?: (error: any) => void){
        const config = ApiService.getConfig(url, params);
        const response = await axios.post(url, data, config).then((response) => {
            return response.data;
        }).catch((error) => {
            ApiService.errorLogger(error, failureCallback);
            return undefined;
        });
        return response;
    },

    put: async function(_dispatch: any, url: string, data: any, params: any, failureCallback?: (error: any) => void){
        const config = ApiService.getConfig(url, params);
        const response = await axios.put(url, data, config).then((response) => {
            return response.data;
        }).catch((error) => {
            ApiService.errorLogger(error, failureCallback);
            return undefined;
        });
        return response;
    },

    multipartRequest: async function(_dispatch: any, url: string, data: any, params: any, failureCallback?: (error: any) => void){
        const config = ApiService.getConfig(url, params);
        if (config.headers) {
            config.headers["Content-Type"] = "multipart/form-data";
        }
        const response = await axios.post(url, data, config).then((response) => {
            return response.data;
        }).catch((error) => {
            ApiService.errorLogger(error, failureCallback);
            return undefined;
        });
        return response;
    },

    startApi: async (_dispatch: any, _uid: string, _url: string, _method: string, _config: any, _data: any) => {
    },

    endApi: async (_dispatch: any, response: any, _uniqueId: string) => {
        return response;
    },

    errorLogger: async function(error: any, callBack?: (error: any) => void){
        ApiService.errorTrackList.push(error);
        if(callBack){
            callBack(error);
        } else if(error.response && error.response.data && error.response.data.message) {
            if (error.response.data.message === "Invalid Authtoken") {
                CookieService.clearAll();
            }else{
                MessageService.error(error.response.data.message);
            }
        }
    },

    executeTrackerList: async function(_dispatch: any, trackerList: ApiTracker[]){
        return await _.map(trackerList, async (apiTracker) => {
            if(apiTracker.method === 'GET'){
                return await ApiService.get(_dispatch, apiTracker.url, apiTracker.config.params, apiTracker.failureCallback);
            }else if(apiTracker.method === 'POST'){
                return await ApiService.post(_dispatch, apiTracker.url, apiTracker.config.data, apiTracker.config.params, apiTracker.failureCallback);
            }else if(apiTracker.method === 'PUT'){
                return await ApiService.put(_dispatch, apiTracker.url, apiTracker.data, apiTracker.config, apiTracker.failureCallback);
            }else if(apiTracker.method === 'DELETE'){
                return await ApiService.delete(_dispatch, apiTracker.url, apiTracker.config, apiTracker.failureCallback);
            }
            return undefined;
        });
    }
}

export default ApiService;
