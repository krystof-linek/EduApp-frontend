<template>
<div>
  <div v-if="!isNewUser">
    <v-card class="mx-auto mt-14 mt-sm-8 mt-md-16 rounded-lg" :width="cardWidth">
      <v-card-title class="justify-center" :id="formatText">
        <span class="my-welcome-text">Vítejte v aplikaci</span>
      </v-card-title>
      <v-card-title class="justify-center" :id="formatText">
        <span class="my-logo-text">HudcovkaEDU</span>
      </v-card-title>
    
      <v-img class="rounded-circle mx-auto mb-3" :height="imgSize" :width="imgSize" lazy-src="@/assets/icon.png" src="@/assets/icon.png"></v-img>
    
      <v-card class="mx-auto" outlined color="transparent">
        <v-card-title class="justify-center" :id="formatText">
          <span class="my-description-text">Všechny výukové materiály budou</span>
          <span class="my-description-text">zpřístupněny pro přihlášení</span>
        </v-card-title>
      </v-card>
    
      <v-card-actions>
        <v-btn :width="buttonWidth" v-bind="buttonSize" class="mx-auto rounded-pill mb-3 mt-5" color="primary" @click="login" :id="formatText">
          <span class="font-weight-bold" style="font-size: 60%">Přihlásit se</span>
        </v-btn>
      </v-card-actions>

      <v-alert v-if="isAlert" border="bottom" colored-border type="error" elevation="2">
        <span>Vámi zadaný účet není platný pro tuto školu!<br></span>
        <span>Prosím přihlašte se pomocí Vašeho školního účtu.</span>
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
          case 'xs': return '260px'
          case 'sm': return '300px'
          case 'md': return '300px'
          case 'lg': return '400px'
          default: return '500px' //xl
          }
        },
        cardFormWidth () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '56vh'
          case 'sm': return '90vh'
          case 'md': return '70vh'
          case 'lg': return '70vh'
          default: return '60vh' //xl
          }
        },
        imgSize () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '100px'
          case 'sm': return '100px'
          case 'md': return '110px'
          case 'lg': return '150px'
          //case 'xl': return 700
          default: return '200px' //xl
          }
        },
        buttonSize () {
          const size = {xs:'small',sm:'small',lg:'large',xl:'x-large'}[this.$vuetify.breakpoint.name];
          return size ? { [size]: true } : {}
        },
        buttonWidth () {
          switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '170px'
          case 'sm': return '170px'
          case 'md': return '200px'
          case 'lg': return '250px'
          default: return '300px' //xl
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
        formatText () {
          switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'my-xs-welcome'
          case 'sm': return 'my-sm-welcome'
          case 'md': return 'my-md-welcome'
          case 'lg': return 'my-lg-welcome'
          default: return 'my-xl-welcome' //xl
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