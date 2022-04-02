import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import GAuth from 'vue-google-oauth2'
import router from "./router";
import TokenManager from "./code/token-manager";
import UserManager from "./code/user-manager";
import axiosInstance from "./code/http";
import VueYoutube from 'vue-youtube' 

const gauthOption = {
  clientId: '431199806824-deiod7m42l98b5923ioibot8an2eo7dh.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}

export const tokenManager = new TokenManager();
tokenManager.findToken();

export const userManager = new UserManager();

Vue.prototype.$tokenManager = tokenManager;
Vue.prototype.$userManager = userManager;
Vue.prototype.$http = axiosInstance;

Vue.use(GAuth, gauthOption)
Vue.use(VueYoutube)

Vue.config.productionTip = false

new Vue({
  vuetify,
  router: router,
  render: h => h(App)
}).$mount('#app')