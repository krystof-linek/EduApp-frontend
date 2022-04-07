<template>
<div>
  <v-app v-if="isReady">
    <v-app-bar id="my-background" app flat :height="$vuetify.breakpoint.name == 'xl' ? 150 : 120">

      <v-container :class="user.role == 'ADMIN' || user.role == 'TEACHER' ? 'mx-0 py-0 mr-3 mx-xl-16 fill-height' : 'mx-10 py-0 mx-lg-16 fill-height' " fluid>

        <v-card class="mr-6" outlined color="transparent" @click="$router.push({ name: 'application' })">
          <v-img :height="$vuetify.breakpoint.name == 'xl' ? 110 : 90" :width="$vuetify.breakpoint.name == 'xl' ? 300 : 250"  src="@/assets/logo.png"></v-img>
        </v-card>
              
        <div class="mt-4" v-if="user != null && user.role == 'TEACHER' && $vuetify.breakpoint.name != 'md' ">
              
          <v-btn :style="linkNavbarSize" class="px-0 mr-4 mr-lg-6 font-weight-bold" v-for="link in links" :key="link" text color="white" @click="changePage(link)">{{ link }}</v-btn>

          <v-menu offset-y>
            <template v-slot:activator="{ attrs, on }">
              <v-btn :style="linkNavbarSize" class="px-0 mr-4 font-weight-bold" text link color="white" v-bind="attrs" v-on="on">
                NÁSTROJE
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-for="item in teacherMenu" :key="item.text" @click="$router.push({ name: item.route })">
                <v-list-item-icon><v-icon :color=item.color v-text="item.icon"></v-icon></v-list-item-icon>
                  <v-list-item-title v-text="item.route == 'checkParents' ? item.text + ' (' + notValidatedParents.length + ')'  : item.text"></v-list-item-title>
                </v-list-item>
            </v-list>
          </v-menu>
            
        </div>

        <div v-else class="mt-4">
          <v-btn :style="linkNavbarSize" class="px-0 mr-4 mr-lg-6 font-weight-bold" v-for="link in links" :key="link" text color="white" @click="changePage(link)">{{ link }}</v-btn>
        </div>
        
          <v-spacer></v-spacer>


          <span v-if="user != null && $vuetify.breakpoint.name != 'md'" :style="nameSize" class="white--text font-weight-bold mr-3 font-italic">{{user.name + ' ' + user.surname}} 
            <v-avatar class="mx-2 mx-xl-4" :size="$vuetify.breakpoint.name == 'xl' ? 50 : 40">
              <img :src='user.picture' referrerpolicy="no-referrer">
            </v-avatar>
          </span>
      
          <v-btn :style="logoutBtnSize" class="font-weight-bold white--text px-2" color="blue" @click="logout()">odhlásit
            <v-icon v-bind="iconSize" color="white" class="ml-1">mdi-logout</v-icon> 
          </v-btn>
      
      </v-container>

    </v-app-bar>
     
    <v-main class="grey lighten-2 mt-5 mt-lg-10">

      <!-- udaje o uzivateli dosud nejsou nacteny -->
      <v-container v-if="user == null">

        <skeleton-loader></skeleton-loader>

      </v-container>

      <!-- zakladni rozlozeni -->
    
      <div v-else>
        <v-row class="justify-center">
          <v-sheet class="mx-12 mx-lg-6 mx-xl-16" color="transparent" outlined width="80vw">
            <router-view @logoutUser="logout" :user="user"></router-view>
          </v-sheet>
        </v-row>
      </div>
     

    </v-main>
  </v-app>

  <v-card v-else>
    <skeleton-loader></skeleton-loader>
  </v-card>

</div>
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

      isReady: false,

      teacherMenu: [
        { icon: 'mdi-account-alert', text: 'Účty ke schválení ', route: 'checkParents', color: 'error', },
        { icon: 'mdi-file-document', text: 'Vytvořit nový kurz', route: 'newCourse', color: 'success', },
        { icon: 'mdi-file-document-edit', text: 'Upravit stávající kurz', route: 'editCourse', color: 'primary', },
        { icon: 'mdi-text-box-plus', text: 'Vytvořit nový test', route: 'newTest', color: 'success', },
        { icon: 'mdi-text-box-plus', text: 'Upravit stávající test', route: 'editTest', color: 'primary', },
      ],

      notValidatedParents: [],

      links: [
        'Kontakt',
        'Výuka',
        'Testy',
      ],
    }),
    computed: {
      iconSize(){
        const size = {md: 'small'}[this.$vuetify.breakpoint.name];
        return size ? { [size]: true } : {}
      },
      linkNavbarSize () {
        switch (this.$vuetify.breakpoint.name) {
          case 'md': return 'font-size: 2.2vw'
          case 'lg': return 'font-size: 1.8vw'
          default: return 'font-size: 1.6vw'
          }
      },
      logoutBtnSize () {
        switch (this.$vuetify.breakpoint.name) {
          case 'md': return 'font-size: 1.2vw'
          case 'lg': return 'font-size: 1.1vw'
          default: return 'font-size: 1vw'
          }
      },
      nameSize () {
        switch (this.$vuetify.breakpoint.name) {
          case 'lg': return 'font-size: 1.3vw'
          default: return 'font-size: 1.4vw'
          }
      },
    },
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

                if (this.user != null && this.user.role === "TEACHER")
                  this.loadNotValidatedParents();

                else
                  this.isReady = true;
            } catch (e) {
                if(e.response.status == 401)
                  this.logout();
            }
      },
      async loadNotValidatedParents(){
            try{
                const response = await this.$http.get('/user/parents/not/validated');
                this.notValidatedParents = response.data;

                this.isReady = true;
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
