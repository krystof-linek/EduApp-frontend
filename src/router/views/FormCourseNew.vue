<template>
  <v-card rounded="lg" min-height="50vh" class="pb-5">

    <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6">
        <label :id="'my-window-title-' + $vuetify.breakpoint.name">Nový kurz</label>
    </v-card-title>

    <v-divider></v-divider>

    <v-card outlined color="transparent" width="50%" class="text-center mt-15" style='margin: auto'>
      <v-form v-model="isValid">
        <label class="text-h3">Vyplňte základní informace</label>
        <v-alert class="mt-5" v-if="isAlert" border="left" close-text="Close Alert" color="rgba(0, 123, 255)" dark dismissible>
          {{alertMessage}}
        </v-alert>
        <v-text-field v-model="courseName" label="Název kurzu" :rules="rules" hide-details="auto" class="text-center mb-5"></v-text-field>
        <v-select v-model="grade" :items="grades" item-text="grade" :rules="[(value) => !!value || 'Musíte zvolit ročník']" item-value="value" :label=" grade == 0 ? 'Vyberte ročník' : 'Zvolený ročník'"></v-select>
        <v-select v-if="grade != 0" v-model="subject" :items="subjects" item-text="title" :rules="[(value) => !!value || 'Musíte zvolit předmět']" :label=" subject == '' ? 'Vyberte předmět' : 'Zvolený předmět'" return-object></v-select>
        <v-btn large class="mt-3 justify-center font-weight-bold" color="success" @click="createCourse" :disabled='!isValid'>Vytvořit</v-btn>
      </v-form>
    </v-card>
         
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        courseName: '',
        courseId: -1,

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
        
        subject: null,

        subjects: [],
    
        isAlert: false,
        alertMessage: '',
        alertMessages: ["K tomuto ročníku nebyli dosud přířazeny žádné předměty.", "Nemáte příslušná opravnění k vytvoření nového kurzu!", "Kurz s tímto názvem již exituje!"],
      
        rules: [
          value => !!value || 'Název je povinný údaj!',
          value => (value && value.length >= 3) || 'Název musí mít délku, alespoň tří znaků!',
        ],
        isValid: false,
      }
    },
    watch: {
      grade(){
        this.isAlert = false;
        this.subject = '';
        this.loadAllSubjectsByGrade()
      }
    },
    methods: {
      async loadAllSubjectsByGrade(){
        try{
          const response = await this.$http.get(`/subject/all/by/grade/${this.grade}`);
          this.subjects = response.data;
          if(this.subjects.length == 0) {
            this.alertMessage = this.alertMessages[0];
            this.isAlert = true;
          }
        } catch (e) {
            const status = e.response.status;
            if (status == 401)
              this.$emit("logoutUser");
        }
      },
      async createCourse(){
        this.isAlert = false;
    
        try {
          const response = await this.$http.post("/course/new", {course_title: this.courseName, subject_title: this.subject.title, grade: this.grade});
          this.courseId = response.data.id;

          this.$router.push({ name: 'editCourse', params: {propCourse: response.data}});
        } catch(e){
          const statusCode = e.response.status;
          
          if (statusCode == 401){
              this.$emit("logoutUser");
          } else if (statusCode == 403){
              this.alertMessage = this.alertMessages[1];
              this.isAlert = true;
              this.$router.push({ name: 'errNotPerms', });
          } else if (statusCode == 409){
              this.alertMessage = this.alertMessages[2];
              this.isAlert = true;
          } 
        }
      },
    },
  }
</script>
<style>
  #blue-hover:hover{
      background: rgba(0, 123, 255);
  }
  #blue-hover:hover span{
      color: white;
  }
</style>