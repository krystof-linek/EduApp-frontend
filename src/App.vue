<template>
  <v-app id="app">
      
      <login-screen v-if='!isLoged' @userLogged="isLoged = !isLoged"></login-screen>
      
      <div v-else>

        <mobile-app v-if="isSmallDevice" @userLogged="isLoged = !isLoged"></mobile-app>
        
        <desktop-app v-else @userLogged="isLoged = !isLoged"></desktop-app>

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
    }),
    computed: {
      isSmallDevice () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return true
          case 'sm': return true
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

#my-blue:hover{
  background: rgba(0, 123, 255);
  color: white;
}

h1 {
  font-size: 3vw;
  font-weight: 350;
}

#my-window-title-xs{
  font-size: 5vw;
}
#my-window-title-sm{
  font-size: 4.5vw;
}
#my-window-title-md{
  font-size: 3vw;
}
#my-window-title-lg{
  font-size: 2.2vw;
}
#my-window-title-xl{
  font-size: 2vw;
}

</style>
