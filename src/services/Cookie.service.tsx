import * as ls from "local-storage";
const cacheKeySet = ["authToken"];
const CookieService = {
    get: function(key:string){
        return ls.get(key);
    },
    set: function(key:string, value:any){
        if(cacheKeySet.indexOf(key) > -1){
            ls.set(key,value);
        }
    },
    clearAll: function(){
        cacheKeySet.map((key) => {
            ls.remove(key);
            return undefined;
        });
    }
}
export default CookieService;