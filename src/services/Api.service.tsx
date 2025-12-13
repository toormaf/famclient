import { UN_AUTH_URLS } from "../constants/Urls";
import CookieService from "./Cookie.service";
import MessageService from "./Message.service";
import axios from "axios";
import * as _ from "lodash";

// import * as MainActions from "../components/MainActions";
// import CacheService from "./CacheService";

export const AInterceptor = {
    init: function(){
        axios.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            try{
                if(response.headers.ott){
                    if(!(response.config && JSON.parse(response.config.data).operation === 'contact_verification')){
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
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            return Promise.reject(error);
          });
    }    
}
const ApiService = {
    errorTrackList: [],
    getHeader: function(url: string){
        MessageService.destroy();
        if(UN_AUTH_URLS.indexOf(url) > -1){
            CookieService.clearAll();
            return {};
        }else{
            const authToken = CookieService.get("authToken");
            return {
                "authorization":authToken,
                "content-type": "application/json"
            };
        }
    },
    getParams: function(params:any){
        return params;
    },
    getConfig: function(url: string, params:any){
        let headerParams = {};
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
    getQuick: function(url: string, params:any){
        return axios.get(url,ApiService.getConfig(url, params));
    },
    postQuick: function(url: string, data:any, params:any){
        return axios.post(url,data, ApiService.getConfig(url, params));
    },
    get: async function(dispatch, url: string, params:any, failureCallback) {
        let apiCacheUrl = url+(params ? "?"+JSON.stringify(params):"");
        if(!CacheService.isCached(apiCacheUrl)){
            const uniqueId = crypto.randomUUID();
            const config = ApiService.getConfig(url, params);
            ApiService.startApi(dispatch, uniqueId, url, 'GET', config, undefined);
            const response = await axios.get(url,config).then((response)=>{
                return ApiService.endApi(dispatch, response, uniqueId);
            }).catch((error) => {
                ApiService.errorLogger(dispatch, error, uniqueId, failureCallback);
            });

            if (response !== undefined) {
                let cacheData;
                try {
                if (typeof response === "string") {
                    cacheData = JSON.parse(response); // Try to parse if it's a stringified JSON
                } else {
                    cacheData = response; // Already a JSON object or non-string
                }
                } catch (e) {
                    cacheData = response; // Parsing failed, treat as non-JSON
                }
                CacheService.update(dispatch, apiCacheUrl, cacheData);
            }
            return response;
        }else{
            return CacheService.get(dispatch, apiCacheUrl);
        }
    },
    delete: async function(dispatch, url, params, failureCallback){
        const uniqueId = crypto.randomUUID();
        const config = ApiService.getConfig(url, params);
        ApiService.startApi(dispatch, uniqueId, url, 'DELETE', config, undefined);
        const response = await axios.delete(url,config).then((response)=>{
            return ApiService.endApi(dispatch, response, uniqueId);
        }).catch((error) => {
            ApiService.errorLogger(dispatch, error, uniqueId, failureCallback);
        });
        return response;
    },
    post: async function(dispatch, url, data, params, failureCallback){
        const uniqueId = crypto.randomUUID();
        const config = ApiService.getConfig(url, params);
        ApiService.startApi(dispatch, uniqueId, url, 'POST', config, data);
        const response = await axios.post(url,data,config).then((response)=>{
            return ApiService.endApi(dispatch, response, uniqueId);
        }).catch((error) => {
            ApiService.errorLogger(dispatch, error, uniqueId, failureCallback);
        });
        return response;
    },
    put: async function(dispatch, url, data, params, failureCallback){
        const uniqueId = crypto.randomUUID();
        const config = ApiService.getConfig(url, params);
        ApiService.startApi(dispatch, uniqueId, url, 'PUT', config, data);
        const response = await axios.put(url,data,config).then((response)=>{
            return ApiService.endApi(dispatch, response, uniqueId);
        }).catch((error) => {
            ApiService.errorLogger(dispatch, error, uniqueId, failureCallback);
        });
        return response;
    },
    multipartRequest: async function(dispatch, url, data, params, failureCallback){
        const uniqueId = crypto.randomUUID();
        const config = ApiService.getConfig(url, params);
        config.headers["Content-Type"] = "multipart/form-data";
        ApiService.startApi(dispatch, uniqueId, url, 'POST', config, data);
        const response = await axios.post(url,data,config).then((response)=>{
            return ApiService.endApi(dispatch, response, uniqueId);
        }).catch((error) => {
            ApiService.errorLogger(dispatch, error, uniqueId, failureCallback);
        });
        return response;
    },    
    startApi: async (dispatch, uid, url, method, config, data) =>{
        MainActions.startApi(dispatch, uid, url, method, config, data);
    },
    endApi: async (dispatch, response, uniqueId) =>{
        MainActions.updateServerAvailability(dispatch, true);
        MainActions.endApi(dispatch, uniqueId);
        return response;
    },
    errorLogger: async function(dispatch, error, uniqueId, callBack){
        MainActions.updateServerAvailability(dispatch, error.message !== 'Network Error');
        setTimeout(()=>{MainActions.endApi(dispatch, uniqueId);},3000);
        ApiService.errorTrackList.push(error);
        if(callBack){
                callBack(error);
        } else if(error.response && error.response.data && error.response.data.message) {
            if (error.response.data.message === "Invalid Authtoken") {
                CookieService.clearAll();
            }else{
                MessageService.openError(error.response.data.message);
            }
        }
    },
    executeTrackerList: async function(dispatch, trackerList){
        return await  _.map(trackerList, async (apiTracker)=>{
            let response = undefined;
            if(apiTracker.method === 'GET'){
                return await ApiService.get(dispatch, apiTracker.url, apiTracker.config.params, apiTracker.failureCallback);
                // response = await axios.get(apiTracker.url, apiTracker.config);
            }else if(apiTracker.method === 'POST'){
                return await ApiService.post(dispatch, apiTracker.url, apiTracker.config.data, apiTracker.config.params, apiTracker.failureCallback);
                // response = await axios.post(apiTracker.url, apiTracker.data, apiTracker.config);
            }else if(apiTracker.method === 'PUT'){
                return await ApiService.put(dispatch, apiTracker.url, apiTracker.data, apiTracker.config, apiTracker.failureCallback);
                // response = await axios.put(apiTracker.url, apiTracker.data, apiTracker.config);
            }else if(apiTracker.method === 'DELETE'){
                return await ApiService.delete(dispatch, apiTracker.url, apiTracker.config, apiTracker.failureCallback);
                // response = await axios.post(apiTracker.url, apiTracker.config);
            }
            return response;
        });
    }
}
export default ApiService;