import { LOCAL_STORAGE_KEY_SET } from "../constants/Constants";
const CookieService = {
    get: function(key:string){
        return localStorage.getItem(key);
    },
    set: function(key:string, value:any){
        if(LOCAL_STORAGE_KEY_SET.indexOf(key) > -1){
            localStorage.setItem(key,value);
        }
    },
    clearAll: function(){
        LOCAL_STORAGE_KEY_SET.map((key) => {
            localStorage.removeItem(key);
            return undefined;
        });
    }
}
export default CookieService;