import axios from "axios";
import {API_URL} from "./constance";

const axiosInstance = axios.create({ 
    baseURL:  API_URL,
    /*
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:8081',
        'Methods':'*'
        // 'Accept-Encoding': 'gzip, deflate, br'
       },
       */
});

export default axiosInstance;