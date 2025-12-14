import { API_ENDPOINTS } from "../constants/Urls";
import ApiService from "./Api.service";
import CookieService from "./Cookie.service";

const AccountService = {
    fetchBasic:async(pid?:number) => {
        // let authStore = Store.getState().auth;
        // if((!authStore.authenticated || !authStore.loginPid) && !authStore.authenticateToFamily){
        if(CookieService.get("authToken")){
            const url = API_ENDPOINTS.PEOPLE.DETAILS +(pid  ? pid:"");
            return (await ApiService.get(url, {section:'basic'}))?.data;
        }
        return undefined;
    },
    logout:()=>{
        CookieService.clearAll();
        window.location.reload();
    },
    getDpSrc:async (pid?:number)=>{
        const result = await AccountService.fetchBasic(pid);
        const f = import.meta.env.VITE_API_BASE_URL+API_ENDPOINTS.IMAGES;
        return result?.pPic1 ? f+result.pPic1 : (result?.pPic2 ? f+result.pPic2 : (result?.pPic3 ? f+result.pPic3 : "/src/public/image/avatars/default_avatar.png"));    
    }
}
export default AccountService;