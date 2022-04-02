import axiosInstance from "./http"

import { TOKEN_NAME } from "./constance";

export default class TokenManager{
    
    token = null;

    setToken(token){
            this.token = token;
            localStorage.setItem(TOKEN_NAME, token);
            axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    }

    removeToken(){
        this.token = null;
        localStorage.removeItem(TOKEN_NAME);
        delete axiosInstance.defaults.headers["Authorization"];

    }

    findToken(){
        const token = localStorage.getItem(TOKEN_NAME);
        if (token != null) {
            this.setToken(token);
        }
    }

    getToken(){
        return this.token;
    }

    isUserLogged(){
        return this.token != null;
    }

}