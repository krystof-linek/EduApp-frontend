<template>
    <v-dialog :width="$vuetify.breakpoint.xl ? '40vw' : '50vw'" v-model="dialog" persistent>
      <v-card rounded="lg">

        <v-card-title :style="titleFontSize" class="white--text blue">
          <v-row>
            <v-col cols="10">
              Formulář
            </v-col>

            <v-col cols="2" class="text-right mt-n3 px-0">
              <v-icon @click="clickOnOk" large color="white">mdi-close-circle</v-icon>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card>

          <v-row align="center" class="pa-0 ma-0">
            
            <v-col cols="12" class="text-center mt-2" style="font-size: 1.3vw">
              <label>Děti uživatele: <span class="font-weight-bold">{{ propParentName }}</span></label>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
          
          </v-row>

          <v-list v-if="kids.length != 0">
            <v-list-item v-for="kid in kids" :key="kid.title">
              <v-list-item-avatar>
                <v-img :src="kid.picture"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="kid.name + ' ' + kid.surname "></v-list-item-title>
                <v-list-item-subtitle>{{ kid.email }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content class="justify-center" style="font-size: 2vw">{{ kid.grade + '.' + kid.classRoom }}</v-list-item-content>

              <v-list-item-action>
                <v-btn color="error" class="font-weight-bold" @click="removeKidFromParent(kid.id)">odebrat</v-btn>
              </v-list-item-action>

            </v-list-item>

            <v-divider></v-divider>

          </v-list>

          <v-card-actions class="justify-center py-4">
            <v-btn color="success" class="font-weight-bold mb-3" @click="addKid = true">přidat studenta</v-btn>
          </v-card-actions>

          <v-alert class="mx-4" v-if="isAlert" border="left" colored-border type="error" elevation="2">
            {{ alertMessage }}
          </v-alert>

          <v-row v-if="addKid" class="mx-4 ma-0">
            <v-col cols="6">
              <v-select :items="grades" label="Ročník" solo v-model="grade"></v-select>
            </v-col>

            <v-col cols="6">
              <v-select :items="letters" label="Třída" solo v-model="letter"></v-select>
            </v-col>
          </v-row>

          <v-list v-if="students.length != 0">
            <v-list-item v-for="student in students" :key="student.title">
              <v-list-item-avatar>
                <v-img :src="student.picture"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="student.name + ' ' + student.surname "></v-list-item-title>
                <v-list-item-subtitle>{{ student.email }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content class="justify-center" style="font-size: 2vw">{{ student.grade + '.' + student.classRoom }}</v-list-item-content>

              <v-list-item-action>
                <v-btn color="success" class="font-weight-bold" @click="setKidToParent(student.id)">přidat</v-btn>
              </v-list-item-action>

            </v-list-item>
          </v-list>
            
        </v-card>

        <v-divider></v-divider>

        <v-card-actions class="py-4">
          <v-spacer></v-spacer>
          <v-btn :style="titleFontSize" class="font-weight-bold" color="success" text @click="clickOnOk">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
      propParentId: {default: -1},
      propParentName: {default: ''},
    },
    data () {
      return {
        dialog: true,

        kids: [],

        addKid: false,

        grades: [1,2,3,4,5,6,7,8,9],
        letters: ['A', 'B'],

        letter: '',
        grade: 0,

        students: [],

        isAlert: false,
        alertMessage: '',
      }
    },
    watch: {
      letter(val){
        if (val != '' && this.grade != 0)
          this.loadStudents();
      },
      grade(val){
        if (val != 0 && this.letter != '')
          this.loadStudents();
      },
    },
    methods: {
      clickOnOk(){
        this.$emit('clickOnOk');

        this.dialog = false;
      },
      async loadAllKidsOfParent(){
        try{
          const response = await this.$http.get(`/user/kids/by/parent/id/${this.propParentId}`);
          this.kids = response.data;
          
        } catch (e) {

          const status = e.response.status;
          if (status == 401)
              this.$emit("logoutUser"); 
          }
      },
      async loadStudents(){
        this.isAlert = false;
        try {
          const response = await this.$http.post("/user/get/students/by/grade/and/class", {classRoom: this.letter, grade: this.grade});
          
          this.students = response.data;

          if (this.students.length == 0){
            this.alertMessage = "Tento ročník a třída dosud neobsahuje žádného studenta!";
            this.isAlert = true;
          }
        } catch(e){
          const statusCode = e.response.status;
          
          if (statusCode == 401){
              this.$emit("logoutUser");
          } 
        }
      },
      async setKidToParent(id_kid){
        this.isAlert = false;
        try{
          const response = await this.$http.get(`/user/set/kid/${id_kid}/to/parent/${this.propParentId}`);
          
          this.kids = response.data;

        } catch (e) {

          const status = e.response.status;
          if (status == 401)
              this.$emit("logoutUser"); 

          if (status == 409){
              this.alertMessage = 'Tento student je již k tomuto rodiči přiřazen!'
              this.isAlert = true;
          }
        }
      },
      async removeKidFromParent(id_kid){
        this.isAlert = false;
        try{
          const response = await this.$http.get(`/user/remove/kid/${id_kid}/from/parent/${this.propParentId}`);
          
          this.kids = response.data;

        } catch (e) {

          const status = e.response.status;
          if (status == 401)
              this.$emit("logoutUser"); 

          if (status == 409){
              this.alertMessage = 'Nelze odstranit tohoto studenta!'
              this.isAlert = true;
          }
        }
      },
    },
    computed:{
      titleFontSize () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3vw; line-height: 150%; font-weight: bold'
          case 'sm': return 'font-size: 2.4vw; line-height: 150%; font-weight: bold'
          case 'md': return 'font-size: 2vw; line-height: 170%; font-weight: bold'
          case 'lg': return 'font-size: 2vw; line-height: 170%; font-weight: bold'
          default: return 'font-size: 1.5vw; line-height: 170%; font-weight: bold'
          }
      },
    },
    mounted(){
      this.propParentId != -1 ? this.loadAllKidsOfParent() : '';
    }
  }
</script>