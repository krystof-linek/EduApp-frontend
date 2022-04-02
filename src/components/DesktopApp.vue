<template>
  <v-app>
    
    <v-app-bar id="my-background" app flat height="100">
      <v-container class="py-0 fill-height" fluid>

        <v-hover class="mx-6 mr-8" :style="'cursor: pointer'">
          <v-img max-height="150" max-width="250" src="@/assets/logo.png" @click="$router.push({ name: 'application' });"></v-img>
        </v-hover>
          
          <div v-if="user != null && user.role == 'TEACHER'">
            <v-btn class="text-h5 ma-n1 font-weight-bold" v-for="link in links" :key="link" text color="white" @click="changePage(link)">{{ link }}</v-btn>

            <v-menu offset-y>
              <template v-slot:activator="{ attrs, on }">
                <v-btn class="text-h5 ml-n1 font-weight-bold" text link color="white" v-bind="attrs" v-on="on">
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

          <div v-else>
            <v-btn class="text-h5 ma-n1 font-weight-bold" v-for="link in links" :key="link" text color="white" @click="changePage(link)">{{ link }}</v-btn>
          </div>
    

        <v-spacer></v-spacer>

        <span v-if="user != null" style="color: white; font-weight: bold" class="mr-3 font-italic">{{user.name + ' ' + user.surname}} 
          <v-avatar class="ma-2" size="30">
            <img :src='user.picture' referrerpolicy="no-referrer">
          </v-avatar>
        </span>

        <v-btn id="my-btn-logout" class="mr-6" @click="logout()">Odhlásit 
            <v-icon small color="white" class="ml-1">mdi-logout</v-icon> 
        </v-btn>

      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-2 mt-10">

      <!-- udaje o uzivateli dosud nejsou nacteny -->
      <v-container v-if="user == null">

        <skeleton-loader></skeleton-loader>

      </v-container>

      <!-- zakladni rozlozeni -->
      <div v-else>
        <v-row class="justify-center">
        <v-sheet class="ma-12" rounded="lg" min-height="70vh" width="80vw">
          <router-view @logoutUser="logout" :user="user"></router-view>
        </v-sheet>
        </v-row>
      </div>

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
            } catch (e) {
                if(e.response.status == 401)
                  this.logout();
            }
      },
      async loadNotValidatedParents(){
            try{
                const response = await this.$http.get('/user/parents/not/validated');
                this.notValidatedParents = response.data;
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
