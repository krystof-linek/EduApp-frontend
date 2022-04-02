import { USER_EMAIL } from "./constance";

export default class UserManager{
    
    email = null;

    setEmail(email){
            this.email = email;
            localStorage.setItem(USER_EMAIL, email);
    }

    removeEmail(){
        this.email = null;
        localStorage.removeItem(USER_EMAIL);
    }

    findEmail(){
        const email = localStorage.getItem(USER_EMAIL);
        if (email != null) {
            this.setEmail(email);
        }
    }

    getEmail(){
        return this.email;
    }
}