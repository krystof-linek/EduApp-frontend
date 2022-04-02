<template>
  <v-app id="inspire">
    
    <v-app-bar id="my-background" app flat height="100">
      <v-container class="py-0 fill-height" fluid>

        <v-hover class="mx-10 mr-10" :style="'cursor: pointer'">
          <v-img max-height="150" max-width="250" src="@/assets/logo.png" @click="$router.push({ name: 'application' });"></v-img>
        </v-hover>
        <v-btn class="text-h5 font-weight-bold" v-for="link in links" :key="link" text large color="white" @click="changePage(link)">{{ link }}</v-btn>

        <v-spacer></v-spacer>

        <span v-if="user != null" style="color: white" class="mr-5 text-h6 font-italic">{{user.name + ' ' + user.surname}} 
          <v-avatar class="ml-3" size="40">
            <img :src='user.picture' referrerpolicy="no-referrer">
          </v-avatar>
        </span>

        <v-btn id="my-blue" class="mr-10" large @click="logout()">Odhlásit se 
            <v-icon small color="white" class="ma-2">mdi-logout</v-icon> 
        </v-btn>

      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-2 mt-0 mt-sm-2 mt-md-4">

      <!-- udaje o uzivateli dosud nejsou nacteny -->
      <v-container v-if="user == null">

        <skeleton-loader></skeleton-loader>

      </v-container>

      <!-- zakladni rozlozeni -->
      <v-container v-else fluid class="pa-0 pa-sm-4 pa-md-10">

        <v-sheet>
          <router-view @logoutUser="logout" :user="user"></router-view>
        </v-sheet>

      </v-container>

    </v-main>
  </v-app>
</template>

<script>
import SkeletonLoaderUser from './SkeletonLoaderUser'

  export default {
    components: {
      "skeleton-loader": SkeletonLoaderUser,
    },
    data: () => ({
      email: "",
      user: null,
      links: [
        'Kontakt',
        'Výuka',
        'Testy',
      ],
    }),
    methods: {
      logout(){
        this.$tokenManager.removeToken();
        this.$userManager.removeEmail();
        this.$emit("userLogged");
      },
      getUser(){
        return this.user;
      },
      changePage(page){
        switch (page) {
          case 'O aplikaci': 
            this.$router.push({ name: 'application' });
            break;
          case 'Kontakt': 
            this.$router.push({ name: 'contacts' });
            break;
          case 'Výuka': 
            this.$router.push({ name: 'course' });
            break;
          case 'Testy': 
            this.$router.push({ name: 'test' });
            break;
          default: 
            this.$router.push({ name: 'application' });
            break;
        }
      },
      async loadUserInfo(){
            try{
                this.email = this.$userManager.getEmail();
                const response = await this.$http.get(`/user/by/email/${this.email}`);
                this.user = response.data;
            } catch (e) {
                if(e.response.status == 401)
                  this.logout();
            }
      },
    },
    mounted(){
      this.loadUserInfo();
    }
  }
</script>