import moment from 'moment';
import * as _ from "lodash";
import { CommonUtil } from "../utils/common.util";
import { CACHE_DATA_ALIVE, CACHE_MAX_STORAGE_SIZE } from '../constants/Constants';

interface CacheItem {
  parentUrl: string;
  fetched: boolean;
  data: any;
  alive: number;
  expiry: number;
  url: string;
  accessed: number;
}

interface CachePool {
  image: CacheItem[];
  tree: CacheItem[];
  people: CacheItem[];
  default: CacheItem[];
}

const apiCachePool: CachePool = {
  image: [],
  tree: [],
  people: [],
  default: []
};

const CacheService = {
  getCachePool: (url: string): keyof CachePool => {
    if (url.indexOf("/img/") === 0) {
      return "image";
    } else if (url.indexOf("/v1/tree") > -1) {
      return "tree";
    } else if (url.indexOf("/v1/people") > -1) {
      return "people";
    } else {
      return "default";
    }
  },

  isCached: (url: string): boolean => {
    const pool = CacheService.getCachePool(url);
    const apiCachedList = apiCachePool[pool];
    const apiItem = _.find(apiCachedList, (it) => it.url === url);
    const currentTime = moment().valueOf();
    return !!(apiItem && (apiItem.expiry === -1 || currentTime < apiItem.expiry));
  },

  get: (url: string): any => {
    const pool = CacheService.getCachePool(url);
    const apiCachedList = apiCachePool[pool];
    let apiItem = _.find(apiCachedList, (it) => it.url === url);

    if (!apiItem) {
      return undefined;
    }

    const apiTempList = _.map(apiCachedList, (it) => {
      if (it.url === url) {
        it.accessed += 1;
        apiItem = it;
      }
      return it;
    });

    apiCachePool[pool] = _.sortBy(apiTempList, 'accessed').reverse();
    return apiItem ? JSON.parse(JSON.stringify(apiItem.data)) : undefined;
  },

  update: (url: string, data: any = undefined, alive: number = CACHE_DATA_ALIVE): void => {
    const pool = CacheService.getCachePool(url);
    const apiCachedList = apiCachePool[pool];
    let list: CacheItem[] = [];

    const apiItem: CacheItem = {
      parentUrl: url.split("?")[0],
      fetched: true,
      data: data,
      alive: alive,
      expiry: moment().valueOf() + alive,
      url: url,
      accessed: 0,
    };

    if (_.find(apiCachedList, (it) => it.url === url)) {
      list = _.map(apiCachedList, (it) => (it.url === url ? { ...it, ...apiItem } : it));
    } else {
      list = [...apiCachedList, apiItem];
    }

    while (
      CommonUtil.getObjectSize(list) > CACHE_MAX_STORAGE_SIZE &&
      CommonUtil.getObjectSize(apiItem) < CACHE_MAX_STORAGE_SIZE &&
      list.length > 0
    ) {
      console.log('Cache size breached: ' + CommonUtil.getObjectSize(list) + ' > ' + CACHE_MAX_STORAGE_SIZE);
      list = _.initial(list);
    }

    apiCachePool[pool] = list;
  },

  clear: (urlList: string[]): void => {
    const poolList = Object.keys(apiCachePool) as (keyof CachePool)[];
    _.each(poolList, (pool) => {
      const filteredCachedList = _.filter(apiCachePool[pool], (item) => {
        return urlList.indexOf(item.parentUrl) === -1;
      });
      apiCachePool[pool] = filteredCachedList;
    });
  },

  clearPool: (poolArray: (keyof CachePool)[]): void => {
    const poolList = Object.keys(apiCachePool) as (keyof CachePool)[];
    _.each(poolArray, (pool) => {
      if (poolList.indexOf(pool) > -1) {
        apiCachePool[pool] = [];
      }
    });
  },

  clearAll: (): void => {
    const poolList = Object.keys(apiCachePool) as (keyof CachePool)[];
    _.each(poolList, (pool) => {
      apiCachePool[pool] = [];
    });
  }
};

export default CacheService;
