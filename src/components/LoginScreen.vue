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
  <div v-else>

    <v-card :width="cardFormWidth" class="mt-16 mx-auto rounded-lg">
      <v-container class="px-10 pt-12 text-lg-body-1">
        <v-card-title class="text-body-1 text-sm-body-1 justify-center pb-5">Vyplňte prosím následující údaje.</v-card-title>
        <v-select :items="users" label="Uživatel" solo v-model="user"></v-select>
          <div v-if="user == 'Student'">
            <v-select :items="grades" label="Ročník" solo v-model="student.grade"></v-select>
            <v-select :items="letters" label="Třída" solo v-model="student.letter"></v-select>
          </div>
        <v-card-actions>
          <v-btn v-if="isCorrect" :width="buttonWidth" v-bind="buttonSize" class="mx-auto rounded-pill" color="success" @click="newUser">
            <span class="font-weight-bold">Registrovat se</span>
          </v-btn>
          <v-btn v-else :width="buttonWidth" v-bind="buttonSize" class="mx-auto rounded-pill" disabled>
            <span class="font-weight-bold">Registrovat se</span>
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>

  </div>
</div>
</template>

<script>
  export default {
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
        grade: '',
        letter: '',
      }
    }),
    methods:{
      async login(){
        this.isAlert = false;
        const googleUser = await this.$gAuth.signIn();
        this.token = googleUser.wc.id_token;
        this.email = googleUser.Ju.zv;
        this.$tokenManager.setToken(googleUser.wc.id_token);
        this.loadUserInfo();
      },
      async loadUserInfo(){
            try{
                const response = await this.$http.get(`/user/exist/${this.email}`);
                if (response.status == 200){
                  this.$userManager.setEmail(this.email);
                  this.$emit("userLogged");
                }
            } catch (e) {
              let status = e.response.status;
              this.$tokenManager.removeToken();

              if(status == 404)
                this.isNewUser = true;
              if(status == 401)
                this.isAlert = true;
            }
      },
      async newUser(){
        this.$tokenManager.setToken(this.token);
        let classRoom = this.student.grade + '.' + this.student.letter;
        let role = this.getRole();
        try {
          await this.$http.post("/user/new", {classRoom: classRoom, role: role});
          this.$userManager.setEmail(this.email);
          this.$emit("userLogged");
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
          case 'xs': return 'font-size: 4vw'
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
    },
  }
</script>
<style>
#my-login-label span{
  font-size: 0.5em;
  font-weight: bold;
}

#my-xs-welcome{
  font-size: 18px;
}

#my-sm-welcome{
  font-size: 20px;
}

#my-md-welcome{
  font-size: 20px;
}

#my-lg-welcome{
  font-size: 27px;
}

#my-xl-welcome{
  font-size: 35px;
}



#my-xs-welcome span.my-welcome-text{
  margin-top: 10px;
}

#my-sm-welcome span.my-welcome-text{
  margin-top: 5px;
}

#my-md-welcome span.my-welcome-text{
  margin-top: 10px;
}

#my-lg-welcome span.my-welcome-text{
  margin-top: 20px;
}

#my-xl-welcome span.my-welcome-text{
  margin-top: 30px;
}



#my-xs-welcome span.my-logo-text{
  font-size: 130%;
  margin-bottom: 15px;
  margin-top: -10px;
  font-weight: bold;
}

#my-sm-welcome span.my-logo-text{
  font-size: 140%;
  margin-top: -30px;
  margin-bottom: 10px;
  font-weight: bold;
}

#my-md-welcome span.my-logo-text{
  font-size: 140%;
  margin-top: -5px;
  margin-bottom: 20px;
  font-weight: bold;
}

#my-lg-welcome span.my-logo-text{
  font-size: 150%;
  margin-top: 10px;
  margin-bottom: 30px;
  font-weight: bold;
}

#my-xl-welcome span.my-logo-text{
  font-size: 150%;
  margin-bottom: 30px;
  margin-top: 5px;
  font-weight: bold;
}



#my-xs-welcome span.my-description-text{
  font-size: 55%;
  margin-bottom: -5px;
  margin-top: 4px;
  font-weight: bold;
}

#my-sm-welcome span.my-description-text{
  font-size: 55%;
  margin-top: -5px;
  margin-bottom: -15px;
  font-weight: bold;
}

#my-md-welcome span.my-description-text{
  font-size: 55%;
  margin-bottom: 3px;
  margin-top: 4px;
  font-weight: bold;
}

#my-lg-welcome span.my-description-text{
  font-size: 60%;
  margin-bottom: 3px;
  margin-top: 4px;
  font-weight: bold;
}

#my-xl-welcome span.my-description-text{
  font-size: 60%;
  margin-bottom: 3px;
  margin-top: 5px;
  font-weight: bold;
}
</style>