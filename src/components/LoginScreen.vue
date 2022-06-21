<template>
<div>
  <div v-if="!isNewUser">
    <v-card class="mx-auto mt-10 mt-sm-16 mt-lg-10 mt-xl-16 rounded-lg" :width="cardWidth">
      <v-col :style="welcomeTextSize" class="text-center pt-8 pt-sm-10">
          <span>Vítejte v aplikaci</span>
      </v-col>
      
      <v-col :style="schoolNameSize" class="font-weight-bold pb-0 pt-sm-2 text-center">
          <span>Hudcovka EDU</span>
      </v-col>
      
      <v-col class="py-8 py-sm-10">
        <v-img class="rounded-circle mx-auto" :height="imgSize" :width="imgSize" lazy-src="@/assets/icon.png" src="@/assets/icon.png"></v-img>
      </v-col>

      <v-col class="text-center py-0">
          <label :style="infoLabelSize">Všechny materiály budou</label>
      </v-col>
      <v-col class="text-center pt-0 pb-8">
          <label :style="infoLabelSize">přístupné po příhlášení</label>
      </v-col>

      <v-col class="text-center">
        <v-btn :width="buttonWidth" :style="btnTextSize" class="font-weight-bold rounded-pill py-lg-6 mb-4" color="primary" @click="login">
          Přihlásit se
        </v-btn>
      </v-col>

      <v-alert v-if="isAlert" border="bottom" colored-border type="error" elevation="2" dismissible>
          <v-col class="pb-4">
            <label :style="alertLabelSize">Vámi zadaný účet není platný pro tuto školu!</label>
          </v-col>

          <v-col class="py-0">
            <label :style="alertLabelSize">Prosím přihlašte se pomocí Vašeho školního účtu.</label>
          </v-col>
      </v-alert>

    </v-card>
  </div>

  <div class="pt-8 pt-md-16" v-else>
    <v-card :width="newUserCardWidth" class="mx-auto mt-16 pb-4" rounded="lg" :id="'new-user-form-' + $vuetify.breakpoint.name">
      <v-card-title :style="titleStyle" class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6">Vítejte v aplikaci</v-card-title>
        <div class="mx-6 mx-sm-10 mx-md-16">
          <div class="mx-lg-16">
            <div class="mx-lg-5 mx-xl-16">
              <v-card-title :style="$vuetify.breakpoint.name == 'xs' ? 'font-size: 4.5vw' : ''" class="justify-center mb-2 mv-sm-6">Vyplňte prosím následující údáje</v-card-title>
            
                <v-select :items="users" solo v-model="user" label="Uživatel"></v-select>
              
                <v-row v-if="user == 'Student'">
                  <v-col cols="6">
                    <v-select :items="grades" label="Ročník" solo v-model="student.grade"></v-select>
                  </v-col>

                  <v-col cols="6">
                    <v-select :items="letters" label="Třída" solo v-model="student.letter"></v-select>
                  </v-col>
                </v-row>

            </div>
          </div>
        </div>

          <v-card-actions>
            <v-btn v-if="$vuetify.breakpoint.lgAndUp" large :disabled="!isCorrect" :width="buttonWidth" :style="btnTextSize" class="mx-auto rounded-pill font-weight-bold" color="success" @click="newUser">
              Registrovat se
            </v-btn>

            <v-btn v-else :disabled="!isCorrect" :width="buttonWidth" :style="btnTextSize" class="mx-auto rounded-pill font-weight-bold" color="success" @click="newUser">
              Registrovat se
            </v-btn>
          </v-card-actions>

    </v-card>
  </div>

  <div v-if="dialogWarning.isSet">
    <my-dialog-warning :propTitle="dialogWarning.title" :propText='dialogWarning.text' @clickOnOk="dialogWarning.isSet = false"></my-dialog-warning>
  </div>

</div>
</template>

<script>
import DialogWarningWindow from '../components/DialogWarningWindow.vue'

  export default {
    components:{
      "my-dialog-warning": DialogWarningWindow,
    },
    data: () => ({
      isLogged: false,
      isAlert: false,
      isNewUser: false,

      token: "",
      email: "",
      users: ["Student","Rodič","Učitel"],
      grades: ['1','2','3','4','5','6','7','8','9'],
      letters: ["A","B"],
      user: "",

      student: {
        grade: -1,
        letter: '',
      },

      dialogWarning: {
            isSet: false,
            text: '',
            title: '',
        },
    }),
    methods:{
      async login(){
        this.isAlert = false;
        const googleUser = await this.$gAuth.signIn();
        console.log(googleUser);
        this.token = googleUser.Cc.id_token;
        this.email = googleUser.Av.mw;
        this.$tokenManager.setToken(this.token);
        this.loadUserInfo();
      },
      async loadUserInfo(){
        try{
          const response = await this.$http.get(`/user/my/info`);

          const user = response.data;

          if (user.validated){
              this.$userManager.setEmail(user.email);
              this.$emit("userLogged");
          } else {
              this.$tokenManager.removeToken();
              this.dialogWarning.title = "Upozornění";
              this.dialogWarning.text = "Váš účet nebyl dosud ověřen. Prosím vyčkejte, než dojde k jeho ověření."
              this.dialogWarning.isSet = true;
          }

        } catch (e) {
              let status = e.response.status;

              if(status == 404)
                this.isNewUser = true;
              if(status == 401){
                this.$tokenManager.removeToken();
                this.isAlert = true;
              }
            }
      },
      async newUser(){
        
        this.$tokenManager.setToken(this.token);
        let role = this.getRole();
        try {
          const response = await this.$http.post("/user/new", {classRoom: this.student.letter, grade: this.student.grade, role: role});

          const user = response.data;

          if (user.validated){
            this.$userManager.setEmail(user.email);
            this.$emit("userLogged");
          } else {
            this.$tokenManager.removeToken();
            this.isNewUser = false;
            this.dialogWarning.title = "Upozornění";
            this.dialogWarning.text = "Váš účet nebyl dosud ověřen. Prosím vyčkejte, než dojde k jeho ověření."
            this.dialogWarning.isSet = true;
          }

        } catch(e){
          const statusCode = e.response.status;
          this.$tokenManager.removeToken();
          if (statusCode == 403){
              this.error = "Token is not valid!";
          } else if (statusCode == 409){
              this.error = "User already exist!";
          } 
        }
      },
      getRole(){
        if(this.user == 'Učitel')
          return 'TEACHER'
        else if (this.user == 'Rodič')
          return 'PARENT'
        else
          return 'STUDENT'
      }
    },
    computed: {
        cardWidth () {
          switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '70vw'
            case 'sm': return '40vw'
            case 'md': return '33vw'
            case 'lg': return '24vw'
            default: return '20vw'
          }
        },
        isCorrect(){
          if (this.user == 'Student' && this.student.grade != '' && this.student.letter != '')
            return true;
          else if (this.user == 'Rodič')
            return true;
          else if (this.user == 'Učitel')
            return true;
          else
            return false;
        },
        welcomeTextSize () {
          switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 5vw'
          case 'sm': return 'font-size: 3vw'
          case 'md': return 'font-size: 2.5vw'
          case 'lg': return 'font-size: 2vw'
          default: return 'font-size: 1.5vw'
          }
        },
        schoolNameSize () {
          switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 7vw'
          case 'sm': return 'font-size: 3.5vw'
          case 'md': return 'font-size: 3.2vw'
          case 'lg': return 'font-size: 2.6vw'
          default: return 'font-size: 2vw'
          }
        },
        imgSize () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '25vw'
          case 'sm': return '13vw'
          case 'md': return '12vw'
          case 'lg': return '9vw'
          //case 'xl': return 700
          default: return '7vw'
          }
        },
        infoLabelSize () {
          switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 4vw'
          case 'sm': return 'font-size: 2.3vw'
          case 'md': return 'font-size: 2vw'
          case 'lg': return 'font-size: 1.5vw'
          default: return 'font-size: 1.2vw'
          }
        },
        buttonWidth () {
          switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '45vw'
          case 'sm': return '27vw'
          case 'md': return '20vw'
          case 'lg': return '17vw'
          default: return '12vw'
          }
        },
        btnTextSize () {
          switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3.5vw'
          case 'sm': return 'font-size: 2vw'
          case 'md': return 'font-size: 1.5vw'
          case 'lg': return 'font-size: 1.3vw'
          default: return 'font-size: 0.9vw'
          }
        },
        alertLabelSize () {
          switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3vw'
          case 'sm': return 'font-size: 2vw'
          case 'md': return 'font-size: 1.5vw'
          case 'lg': return 'font-size: 1.2vw'
          default: return 'font-size: 1vw'
          }
        },
        titleStyle() {
          switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'my-window-title-xs'
            case 'sm': return 'my-window-title-sm'
            case 'md': return 'my-window-title-md'
            case 'xl': return 'my-window-title-xl'
            default: return 'my-window-title-lg' //lg
          }
        },
        newUserCardWidth () {
            switch (this.$vuetify.breakpoint.name) {
              case 'xs': return '100%'
              case 'sm': return '90vw'
              case 'md': return '60vw'
              case 'lg': return '60vw'
              default: return '60vw'
            }
        },
    },
  }
</script>
<style>
#new-user-form-xl .v-select{
  font-size: 1.4vw;
}
#new-user-form-xl .v-select .v-label{
  font-size: 1.4vw;
}

#new-user-form-lg .v-select{
  font-size: 1.5vw;
}
#new-user-form-lg .v-select .v-label{
  font-size: 1.5vw;
}

#new-user-form-md .v-select{
  font-size: 2.3vw;
}
#new-user-form-md .v-select .v-label{
  font-size: 2.3vw;
}

#new-user-form-sm .v-select{
  font-size: 3vw;
}
#new-user-form-sm .v-select .v-label{
  font-size: 3vw;
}

#new-user-form-xs .v-select{
  font-size: 5vw;
}
#new-user-form-xs .v-select .v-label{
  font-size: 5vw;
}

</style>