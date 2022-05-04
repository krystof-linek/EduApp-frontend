<template>
  <v-app :id="$vuetify.breakpoint.name == 'xs' ? 'mobile-version-xs' : 'mobile-version-sm'">
    <nav>
      <v-row class="py-4 py-sm-6" align="center" id="my-background">

        <v-col cols="3" sm="2" class="text-left">
          <v-btn @click="logout()" class="ml-3 ml-sm-5" color="blue" :height="navBtnSize" :width="navBtnSize"><v-icon color="white" large>mdi-logout-variant</v-icon></v-btn>
        </v-col>

        <v-col cols="6" sm="8" class="white--text font-weight-bold text-center">
          <v-hover :style="'cursor: pointer'" @click="$router.push({ name: 'contacts' })">
            <label :style="logoFontStyle" >ZŠ HUDCOVA</label>
          </v-hover>
        </v-col>

        <v-col cols="3" sm="2" class="text-right">
          <v-btn class="mr-3 mr-sm-5" color="blue" :height="navBtnSize" :width="navBtnSize" @click="showMenu = !showMenu">
            <v-icon color="white" large>mdi-menu</v-icon>
          </v-btn>
        </v-col>
      
      </v-row>
    </nav>

    <v-card v-if="showMenu" class="mx-auto" width="100%" id="my-mobile-label">
      <v-list nav color="blue lighten-4">

        <v-list-item @click="showMenu = false">
          <v-list-item-title class="text-center"><label :style="labelFontStyle">Kontakty</label></v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-group no-action>
            <template v-slot:activator>
              <v-list-item-content @click="changeMenu('course')">
                <v-list-item-title class="text-center ml-5 mr-n5" ><label :style="labelFontStyle">Výuka</label></v-list-item-title>
              </v-list-item-content>
            </template>

          <v-list-item-content class="py-0 mb-n2" v-if="isAlert">
            <v-alert border="left" color="blue" dark>
              {{ alertMessage }}
            </v-alert>
          </v-list-item-content>

          <v-list-item-content class="py-0 mb-n4">
            <v-select :style="selectFontStyle" :height="selectHeight" solo dense v-model="grade" :items="grades" item-text="grade" :rules="[(value) => !!value || 'Musíte zvolit ročník']" item-value="value" :label=" grade == 0 ? 'Vyberte ročník' : 'Zvolený ročník'"></v-select>
          </v-list-item-content>

          <v-list-item-content v-if="subjects.length != 0" class="py-0 mb-n4">
            <v-select :style="selectFontStyle" :height="selectHeight" solo dense v-model="subject" :items="subjects" item-text="title" :rules="[(value) => !!value || 'Musíte zvolit předmět']" :label=" subject == '' ? 'Vyberte předmět' : 'Zvolený předmět'" return-object></v-select>
          </v-list-item-content>

          <v-list-item-content v-if="isLoadingSubjects || isLoadingCourses">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-list-item-content>

          <v-list-item-content class="text-left" v-for="(course, index) in courses" :key="course.id">
            <v-btn @click="$router.go($router.push({name: 'courseById', params: { id_course: course.id}}));" v-bind="btnSize"  color="blue" class="white--text justify-start">{{index + 1 + '. ' + course.title}}</v-btn>
          </v-list-item-content>

        </v-list-group>

        <v-divider></v-divider>

        <v-list-group no-action>
            <template v-slot:activator>
              <v-list-item-content @click="changeMenu('test')">
                <v-list-item-title class="text-center ml-5 mr-n5"><label :style="labelFontStyle">Testy</label></v-list-item-title>
              </v-list-item-content>
            </template>

        <v-list-item-content class="py-0 mb-n2" v-if="isAlert">
          <v-alert border="left" color="blue" dark>
            {{ alertMessage }}
          </v-alert>
        </v-list-item-content>

        <v-list-item-content class="py-0 mb-n4">
          <v-select :style="selectFontStyle" :height="selectHeight" solo dense v-model="grade" :items="grades" item-text="grade" :rules="[(value) => !!value || 'Musíte zvolit ročník']" item-value="value" :label=" grade == 0 ? 'Vyberte ročník' : 'Zvolený ročník'"></v-select>
        </v-list-item-content>

        <v-list-item-content v-if="subjects.length != 0" class="py-0 mb-n4">
          <v-select :style="selectFontStyle" :height="selectHeight" solo dense v-model="subject" :items="subjects" item-text="title" :rules="[(value) => !!value || 'Musíte zvolit předmět']" :label=" subject == '' ? 'Vyberte předmět' : 'Zvolený předmět'" return-object></v-select>
        </v-list-item-content>

        <v-list-item-content v-if="isLoadingSubjects || isLoadingTests">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-list-item-content>

        <v-list-item-content class="text-left" v-for="(test, index) in tests" :key="test.id">
          <v-btn v-bind="btnSize" @click="redirectToTest(test.id)" color="blue" class="white--text justify-start">{{index + 1 + '. ' + test.title}}</v-btn>
        </v-list-item-content>
      
        </v-list-group>

      </v-list>
    </v-card>
    
    <v-main class="grey lighten-2 mt-0 mt-md-4">

      <!-- udaje o uzivateli dosud nejsou nacteny -->
      <v-container v-if="user == null">

        <skeleton-loader></skeleton-loader>

      </v-container>

      <!-- zakladni rozlozeni -->
      <v-container v-else fluid class="pa-0 pa-md-10">

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
      isAlert: false,
      alertMessages: [
        "K ročníku dosud nebyl přiřazen žádný předmět.",
        "K tomtu předmětu nejsou momentálně aktivní žádné testy.",
        "K tomtu předmětu nebyl dosud vytvořen žádný kurz."
      ],

      menuType: "",

      isGradeSet: false,
      grade: 0,
        grades: [
          { grade: '1. ročník', value: 1 },
          { grade: '2. ročník', value: 2 },
          { grade: '3. ročník', value: 3 },
          { grade: '4. ročník', value: 4 },
          { grade: '5. ročník', value: 5 },
          { grade: '6. ročník', value: 6 },
          { grade: '7. ročník', value: 7 },
          { grade: '8. ročník', value: 8 },
          { grade: '9. ročník', value: 9 },
      ],
      showMenu: false,

      isLoadingSubjects: false,
      subjects: [],
      subject: null,

      isLoadingTests: false,
      tests: [],

      isLoadingCourses: false,
      courses: [],


      email: "",
      user: null,
      links: [
        'Kontakt',
        'Výuka',
        'Testy',
      ],
    }),
    computed:{
      logoFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 6vw; font-weight: bold'
          case 'sm': return 'font-size: 7vw; line-height: 150%; font-weight: bold'
          case 'md': return 'font-size: 2vw; line-height: 170%; font-weight: bold'
          case 'lg': return 'font-size: 2vw; line-height: 170%; font-weight: bold'
          default: return 'font-size: 1.5vw; line-height: 170%; font-weight: bold'
          }
      },
      labelFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 6vw;'
          case 'sm': return 'font-size: 4vw;'
          default: return 'font-size: 1.5vw;'
          }
      },
      selectFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 4vw;'
          default: return 'font-size: 2.5vw;'
          }
      },
      navBtnSize () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '55'
          case 'sm': return '75'
          default: return '75'
          }
      },
      selectHeight () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '6vh'
          default: return '6.5vh'
          }
      },
      btnSize(){
        const size = {xs: 'large', sm: 'x-large'}[this.$vuetify.breakpoint.name];
        return size ? { [size]: true } : {}
      }
    },
    watch: {
      grade(){
        this.isAlert = false;
        this.isLoadingSubjects = true;
        this.subjects = [];
        this.subject = null;
        this.loadAllSubjectsByGrade();
      },
      subject(){
        if (this.subject != null){
          this.isAlert = false;

          if (this.menuType == 'test'){
            this.isLoadingTests = true;
            this.tests = [];
            this.loadAllTestsBySubjectId();
          }
          if (this.menuType == 'course'){
            this.isLoadingCourses = true;
            this.course = [];
            this.loadAllCoursesBySubjectId();
          }
        }
      }
    },
    methods: {
      logout(){
        this.$tokenManager.removeToken();
        this.$userManager.removeEmail();
        this.$emit("userLogged");
      },
      async loadAllSubjectsByGrade(){
        try{
          const response = await this.$http.get(`/subject/all/by/grade/${this.grade}`);
          
          this.subjects = response.data;

          if (this.subjects.length == 0){
            this.alertMessage = this.alertMessages[0];
            this.isAlert = true;
          }
          
        } catch (e) {
            const status = e.response.status;
                
            if (status == 401)
              this.$emit("logoutUser");

            console.log(status);
        }
       this.isLoadingSubjects = false;
      },
      async loadAllTestsBySubjectId(){

        try{
          const response = await this.$http.get(`/test/get/all/active/by/subject/id/${this.subject.idSubject}`);
          
          this.tests = response.data;

          if (this.tests.length == 0){
            this.alertMessage = this.alertMessages[1];
            this.isAlert = true;
          }
          
        } catch (e) {
            const status = e.response.status;
                
            if (status == 401)
              this.$emit("logoutUser");

            console.log(status);
        }
       this.isLoadingTests = false;
      },
      async loadAllCoursesBySubjectId(){
          try{
            const response = await this.$http.get(`/course/all/by/subject/id/${this.subject.idSubject}`);
            this.courses = response.data;

            if (this.courses.length == 0){
              this.alertMessage = this.alertMessages[2];
              this.isAlert = true;
            }
      
          } catch (e) {
                const status = e.response.status;
                if (status == 401)
                  this.$emit("logoutUser"); 
          }
          this.isLoadingCourses = false;
      },
      redirectToTest(id){
        this.$router.go(this.$router.push({ name: 'useTest', params: { id_test: id } }));
      },
      changeMenu(menuType){
        this.menuType = menuType;
        this.subject = null;
        this.isAlert = false;
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
<style>

#mobile-version-xs .v-label {
    font-size: 4vw;
}

#mobile-version-sm .v-label {
    font-size: 3vw;
}



</style>