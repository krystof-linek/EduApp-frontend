<template>

<v-card class="mx-md-0 mt-4 mt-lg-0 mx-xl-16 pa-lg-n7" elevation="5" rounded="lg">

  <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6">
    <label :id="titleStyle">Testy</label>
  </v-card-title>

<v-stepper outlined v-model="e1" rounded="lg" color="primary">
  <v-stepper-header>
    <template v-for="n in steps">
      <v-stepper-step :key="`${n}-step`" :complete="e1 > n" :step="n" editable :edit-icon="'mdi-check-bold'" color="blue">{{ vyber[n-1] }}</v-stepper-step>
      <v-divider v-if="n !== steps" :key="n"></v-divider>
    </template>
  </v-stepper-header>

  <v-alert v-if="isAlert" border="left" close-text="Close Alert" color="blue" dark dismissible>
    {{alertMessage}}
  </v-alert>

<v-stepper-items>
  <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n " >
    <v-card outlined color="transparent">
      
      <v-layout row wrap class="mx-2 my-1" v-if="n==1">
        <v-flex md4 lg4 xl4 v-for="grade in grades" :key="grade">
          <v-card hover rounded="lg" class="mx-5 my-6 mx-xl-10" @click="selectGrade(grade, n)" :height="cardGradeHeight" elevation="20">
            <v-row align="center" class="mx-3 fill-height"> 
              <v-col :style="cardTitleStyle" class="text-center py-4 font-weight-bold">
                {{grade}}. ročník
              </v-col>
            </v-row>    
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row wrap class="ma-2" v-if="n==2 && subjects.length != 0">
          <v-flex md4 lg4 xl4 v-for="subject in subjects" :key="subject.idSubject">
              <v-card hover rounded="lg" class="mx-5 my-6 mx-xl-10" @click="selectSubject(subject.idSubject)" :height="cardSubjectHeight" elevation="20">
                  <v-row align="center" class="mx-3 fill-height"> 
                      <v-col :style="cardTitleStyle" class="text-center py-4 font-weight-bold">
                        {{ subject.title.charAt(0).toUpperCase() + subject.title.slice(1) }}
                      </v-col>
                  </v-row>    
              </v-card>
          </v-flex>
      </v-layout>

      <v-card outlined color="transparent" class="mt-n4" v-if="n==3 && tests.length != 0">
        <v-container fluid>
          <v-data-iterator
            :items="tests"
            :search="search"
            sort-by="title"
            :sort-desc='false'
            :single-expand="showInfo"
            :expanded.sync="expanded"
            hide-default-footer
          >
                  
            <template v-slot:header>
              <v-row align="center">
        
                <v-col cols="12">
                  <v-toolbar elevation="10">
                    <v-text-field v-model="search" clearable flat hide-details prepend-inner-icon="mdi-magnify" label="Vyhledat"></v-text-field>
                  </v-toolbar>
                </v-col>

              </v-row>
            </template>

            <template v-slot:default="{items, isExpanded, expand }">
              <v-row>
                <v-col v-for="item in items" :key="item.id" md="4" lg="4">
                  <v-card rounded="lg" class="py-2" elevation="10" @click="redirectToTest(item.id)">
                    <v-card-title :style="cardTitleCourseStyle" class="font-weight-bold">
                      {{ item.title.length > 40? item.title.substring(0,40) + " ...." : item.title}}
                    </v-card-title>

                    <v-card-actions class="mt-2">
                      <v-btn block x-small :color="!isExpanded(item) ?  'blue lighten-2' : 'blue-grey lighten-3'" :input-value="isExpanded(item)" @click.stop="expand(item,!isExpanded(item))">
                        <v-icon color="white">{{ isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                      </v-btn>
                    </v-card-actions>

                    
              
                      <v-list v-if="isExpanded(item)" dense>
                        <v-list-item>
                          <v-list-item-content>Vytvořil:</v-list-item-content>
                          <v-list-item-content class="align-end">{{ 
                            item.author.name.charAt(0).toUpperCase() + item.author.name.slice(1)
                            + ' ' +
                            item.author.surname.charAt(0).toUpperCase() + item.author.surname.slice(1)
                          }}</v-list-item-content>
                        </v-list-item>
                      
                        <v-list-item>
                          <v-list-item-content>Vytvořen:</v-list-item-content>
                          <v-list-item-content class="align-end">{{ getDate(item.created) }}</v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>Počet otázek:</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.questions.length }}</v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>Celý název:</v-list-item-content>
                        </v-list-item>

                        <v-list-item class="mt-n2">
                          <v-list-item-content class="align-start font-weight-bold">{{ item.title }}</v-list-item-content>
                        </v-list-item>
                      </v-list>

                    <v-divider></v-divider>

                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </v-container>    
      </v-card>
    </v-card>
  </v-stepper-content>
</v-stepper-items>
</v-stepper>        

</v-card>

</template>

<script>

  export default {

    props: {
        user: {default: null},
        propGrade: {default: -1},
        propSubjectId: {default: -1},
    },
    data () {
      return {
        isLoading: true,

        grades: [1,2,3,4,5,6,7,8,9],

        expanded: [],
     
        subjects: [],
      
        tests: [],
      
        e1: 1,
        steps: 3,

        vyber: ["Výběr ročníku", "Výběr předmětu", "Výběr testu"],

        isAlert: false,
        alertMessage: '',
        alertMessages: [
          "K tomuto ročníku nebyli dosud přířazeny žádné předměty.", 
          "K tomuto předmětu nebyli dosud zpřístupněny žádné testy.", 
        ],
        showInfo: false,
        search: '',
        keys: [
          'title',
        ],
      }
    },
    watch: {
      steps (val) {
        if (this.e1 > val) {
          this.e1 = val
        }
      },
    },
    computed: {
      titleStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'my-window-title-xs'
          case 'sm': return 'my-window-title-sm'
          case 'md': return 'my-window-title-md'
          case 'xl': return 'my-window-title-xl'
          default: return 'my-window-title-lg' //lg
        }
      },
      cardTitleStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'md': return 'font-size: 2.1vw'
          case 'lg': return 'font-size: 1.5vw'
          default: return 'font-size: 1.4vw'
        }
      },
      cardTitleCourseStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'md': return 'font-size: 2.1vw'
          case 'lg': return 'font-size: 1.4vw'
          default: return 'font-size: 1.3vw'
        }
      },
      cardGradeHeight() {
        switch (this.$vuetify.breakpoint.name) {
          case 'md': return '7vw'
          case 'lg': return '5.8vw'
          default: return '5vw'
        }
      },
      cardSubjectHeight() {
        switch (this.$vuetify.breakpoint.name) {
          case 'md': return '9vw'
          case 'lg': return '6.2vw'
          default: return '5.5vw'
        }
      },
      filteredKeys () {
        return this.keys.filter(key => key !== 'title')
      },
    },
    methods: {
      nextStep (n) {
        if (n === this.steps) {
          this.e1 = 1
        } else {
          this.e1 = n + 1
        }
      },
      selectGrade(number){
        this.isAlert = false;
        this.grade = number;
        if(this.grade != 0){
          this.isLoading = true;
          this.loadAllSubjectsByGrade();
        }
      },
      async loadAllSubjectsByGrade(){
        try{
          const response = await this.$http.get(`/subject/all/by/grade/${this.grade}`);
                
          this.subjects = response.data;
                
          if(this.subjects.length)
            this.nextStep(1);
          else{
            this.alertMessage = this.alertMessages[0];
            this.isAlert = true;
          }

          this.isLoading = false;
        } catch (e) {
            const status = e.response.status;
            if (status == 401)
              this.$emit("logoutUser");
          
          this.isLoading = false;
        }
      },
      selectSubject(id){
        this.isAlert = false;
        
        if(id != 0) {
          this.isLoading = true;
          this.loadAllTestsBySubjectId(id);
        }
      },
      async loadAllTestsBySubjectId(id){
    
        try{
          const response = await this.$http.get(`/test/get/all/active/by/subject/id/${id}`);
            
          this.tests = response.data;

          if (this.tests.length == 0){
            this.alertMessage = this.alertMessages[1];
            this.isAlert = true;
          }

          this.isLoading = false;
          this.nextStep(2);
            
        } catch (e) {
          const status = e.response.status;
                  
          if (status == 401)
            this.$emit("logoutUser");

              console.log(status);

          this.isLoading = false;
        }
      },
      redirectToTest(id){
        this.$router.push({ name: 'useTest', params: { id_test: id } });
      },
      setStepper(){
        if(this.propGrade != -1)
          this.selectGrade(this.propGrade, 1);
        if(this.propSubjectId != -1)
          this.selectSubject(this.propSubjectId);
      },
      getDate(date){
        let array = date.split('T');

        date = array[0];

        array = date.split('-');

        date = array[2] + '.' + array[1] + '.' + array[0];

        return date;
      },
    },
    mounted(){
      this.setStepper();
    }
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