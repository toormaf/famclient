import axios, { AxiosInstance } from 'axios';

export const CommonUtil = {
    getObjectSize(obj: unknown): number {
        return new Blob([JSON.stringify(obj)]).size;
    },
    getNewAxiosInstance(baseUrl:any): AxiosInstance{
        return axios.create({
            baseURL: baseUrl,
            timeout: 10000,
            withCredentials: true, // needed if using cookies
        })
    }
};
