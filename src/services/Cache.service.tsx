// import { MainActionTypes } from "store/MainReducer";
// import Store from "store/Store";
import moment from 'moment';
import * as _ from "lodash";
import { CommonUtil } from "../utils/common.util";
import { CACHE_DATA_ALIVE, CACHE_MAX_STORAGE_SIZE } from '../constants/Constants';


const CacheService = {
    getCachePool:(url:string)=>{
      if(url.indexOf("/img/") === 0){
        return "image";
      }else if(url.indexOf("/v1/tree") > -1){
        return "tree";
      }else if(url.indexOf("/v1/people") > -1){
        return "people";
      }else{
        return "default";
      }
    },
    isCached: (url:string)=>{
        let pool = CacheService.getCachePool(url);
        let apiCachedList = Store.getState().main.apiCachePool[pool];
        let apiItem = _.find(apiCachedList,(it)=>{return it.url === url})
        let currentTime = moment().valueOf();
        return apiItem && (apiItem.expiry === -1 || currentTime < apiItem.expiry);
    },
    get: (dispatch, url:string)=>{
      let pool = CacheService.getCachePool(url);
      let apiCachedList = Store.getState().main.apiCachePool[pool];
        let apiItem = _.find(apiCachedList, (it)=>{return it.url === url});
        let apiTempList = _.map(apiCachedList, (it)=>{
          if(it.url === url){
            it.accessed +=1;
            apiItem = it;
          }
          return it;
        });
        apiTempList = _.sortBy(apiTempList, 'accessed').reverse();
        dispatch({type:MainActionTypes.UPDATE_API_CACHE, payload: {list: apiTempList, pool: pool}});
        return apiItem ? JSON.parse(JSON.stringify(apiItem.data)) : undefined;
    },
    update: (dispatch, url:string, data = undefined, alive = CACHE_DATA_ALIVE)=>{      
      let pool = CacheService.getCachePool(url);
      let apiCachedList = Store.getState().main.apiCachePool[pool];
      let list = [];
      let apiItem = {
          parentUrl: url.split("?")[0],
          fetched: true,
          data: data,
          alive : alive,
          expiry: moment().valueOf() + alive,
          url : url,
          accessed: 0,
      };
      if(_.find(apiCachedList,(it)=>{return it.url === url})){
          list = _.map(apiCachedList, (it)=>{return {...it, ...(it.url === url ? apiItem : {})}});
      }else{
          list = [...apiCachedList, apiItem];
      }
      while(CommonUtil.getObjectSize(list) > CACHE_MAX_STORAGE_SIZE && CommonUtil.getObjectSize(apiItem) < CACHE_MAX_STORAGE_SIZE && list.length > 0){
        console.log('size breached :'+CommonUtil.getObjectSize(list)+ ' > ' + CACHE_MAX_STORAGE_SIZE);
        list = _.initial(list);
      }
      dispatch({type:MainActionTypes.UPDATE_API_CACHE, payload: {list: list, pool: pool}});
    },
    clear: (dispatch, urlList:any)=>{
      let poolList = Object.keys(Store.getState().main.apiCachePool);
      _.each(poolList, (pool)=>{
        let filteredCachedList = _.filter(Store.getState().main.apiCachePool[pool], (item)=>{
          return urlList.indexOf(item.parentUrl) == -1
        });
        dispatch({type:MainActionTypes.UPDATE_API_CACHE, payload: {list: filteredCachedList, pool: pool}});
      });
    },
    clearPool: (dispatch, poolArray)=>{
      let poolList = Object.keys(Store.getState().main.apiCachePool);
      _.each(poolArray, (pool)=>{
        if(poolList.indexOf(pool) > -1){
          dispatch({type:MainActionTypes.UPDATE_API_CACHE, payload: {list: [], pool: pool}});
        }  
      })
    },
    clearAll: (dispatch)=>{
      let poolList = Object.keys(Store.getState().main.apiCachePool);
      _.each(poolList, (pool)=>{
        dispatch({type:MainActionTypes.UPDATE_API_CACHE, payload: {list: [], pool: pool}});
      });
    }
}
export default CacheService;





    
