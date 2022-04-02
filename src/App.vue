<template>
  <v-app id="app">
      <login-screen @userLogged="isLoged = !isLoged" v-if='!isLoged'></login-screen>
      <div v-else>
        <div v-if="isSmallDevice">
          <mobile-app @userLogged="isLoged = !isLoged"></mobile-app>
        </div>
        <div v-else>
          <desktop-app @userLogged="isLoged = !isLoged"></desktop-app>
        </div>
      </div>
    
  </v-app>
</template>

<script>
import LoginScreen from './components/LoginScreen'
import DesktopApp from './components/DesktopApp'
import MobileApp from './components/MobileApp'


  export default {
    components: {
    "login-screen": LoginScreen,
    "desktop-app": DesktopApp,
    "mobile-app": MobileApp,
    },
    data: () => ({
      isLoged: false,
      links: [
        'O aplikaci',
        'Kontakt',
        'Výuka',
        'Testy',
      ],
    }),
    computed: {
      isSmallDevice () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return true
          case 'sm': return true
          case 'md': return true
          default: return false
          }
        },
    },
    methods: {
      
    },
    mounted(){
      this.$tokenManager.findToken();
      this.$userManager.findEmail();
      this.isLoged = this.$tokenManager.isUserLogged();
    }
  }
</script>
<style>
#app {
  background-image: linear-gradient(50deg, rgba(0, 123, 255), rgba(251, 2, 173));
  background-size: cover;
  height: 100vh;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

#my-background {
  background-image: linear-gradient(50deg, rgba(0, 123, 255), rgba(251, 2, 173));
  background-size: cover;
}

#my-search{
  font-size: 1.2vw;
  font-weight: 300;
  height: 50px;
}

#my-blue{
  background: rgba(0, 123, 255);
  color: white;
}

#my-btn-logout{
  background: rgba(0, 123, 255);
  font-weight: bold;
  font-size: 70%;
  color: white;
}

h1 {
  font-size: 3vw;
  font-weight: 350;
}

@media only screen and (max-width: 1264px){



}
</style>
