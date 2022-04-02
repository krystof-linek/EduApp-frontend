<template>
  <div>
    <v-stepper v-model="e1" rounded="lg" color="primary">
      <v-stepper-header>
        <template v-for="n in steps">
          <v-stepper-step :key="`${n}-step`" :complete="e1 > n" :step="n" editable :edit-icon="'mdi-check-bold'" color="rgba(0, 123, 255)">{{ vyber[n-1] }}</v-stepper-step>
          <v-divider v-if="n !== steps" :key="n"></v-divider>
        </template>
      </v-stepper-header>

      <v-alert v-if="isAlert" border="left" close-text="Close Alert" color="rgba(0, 123, 255)" dark dismissible>
        {{alertMessage}}
      </v-alert>

      <v-stepper-items>
        <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n " >
          <v-card class="mb-12" outlined color="transparent">
              <v-layout row wrap class="ma-2" v-if="n==1">
                  <v-flex lg4 xl4 v-for="grade in grades" :key="grade">
                      <v-card id="blue-hover" flat class="text-center ma-5" @click="selectGrade(grade, n)" min-height="80px" elevation="12">
                          <v-card-text class="text-lg-h5 font-weight-bold"> 
                              <span class="text-h5 font-weight-bold">{{grade}}. ročník</span>
                          </v-card-text>    
                      </v-card>
                  </v-flex>
              </v-layout>

              <v-layout row wrap class="ma-2" v-if="n==2 && subjects.length != 0">
                  <v-flex lg4 xl4 v-for="subject in subjects" :key="subject.idSubject">
                      <v-card id="blue-hover" flat class="text-center ma-5" @click="selectSubject(subject.idSubject, n)" min-height="80px" elevation="12">
                          <v-card-text class="text-lg-h5 font-weight-bold"> 
                              <span class="text-lg-h6 text-xl-h5 font-weight-bold">{{subject.title}}</span>
                          </v-card-text>    
                      </v-card>
                  </v-flex>
              </v-layout>

  
              <v-card v-if="n==3 && courses.length != 0">
                <v-card-title>
                  <v-text-field v-model="search" append-icon="mdi-magnify" label="Vyhledat kurz" single-line hide-details class="text-h2">

                  </v-text-field>
                </v-card-title>
                <v-data-table :headers="headers" :items="courses" :search="search" @click:row="handleClick" id="my-table" :items-per-page="-1"
                  :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'mdi-arrow-collapse-left',
                    lastIcon: 'mdi-arrow-collapse-right',
                    prevIcon: 'mdi-minus',
                    nextIcon: 'mdi-plus',
                    'items-per-page-text':'počet položek na stránku',
                    'items-per-page-options': [5, 10, 15, 20, -1],
                    'items-per-page-all-text': 'Všechny',
                    'page-text': '{0}-{1} z {2}'
                }">
                    
                </v-data-table>
              </v-card>
             

              <v-card v-if="n==4" outlined color="transparent" class="mt-n5">
                  <v-card-title class="text-lg-h3">{{courseName}}</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text v-if="contents.length != 0">
                    <div v-for="content in contents" :key="content.id_content">
                      <paragraph v-if="content.content_type == 'paragraph'" :title=content.title :title_size=content.title_size :text=content.text></paragraph>
                      <mypicture v-if="content.content_type == 'picture'" :title=content.title :src=content.link :description=content.description :alt=content.alt :author=content.author></mypicture>
                      <myvideo v-if="content.content_type == 'video'" :title=content.title :src=content.link :description=content.description :author=content.author></myvideo>
                      <mylink v-if="content.content_type == 'link'" :title=content.title :link=content.link :description=content.description :btn_title=content.btn_title :btn_color=content.btn_color></mylink>
                      <mylist v-if="content.content_type == 'list'" :title=content.title :link=content.link :description=content.description :items=content.items :numbered=content.numbered></mylist>
                      <mynotice v-if="content.content_type == 'notice'" :title=content.title :description=content.description :color=content.color :icon='content.icon'></mynotice>
                    </div>
                  </v-card-text>

                  <div v-else>
                      <skelet></skelet>
                  </div>

              </v-card>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>        

  </div>
</template>

<script>
import ContentParagraph from './contents/ContentParagraph'
import ContentPicture from './contents/ContentPicture'
import ContentVideo from './contents/ContentVideo'
import ContentLink from './contents/ContentLink'
import ContentList from './contents/ContentList'
import ContentNotice from './contents/ContentNotice'
import SkeletonLoader from './contents/SkeletonLoader'
  export default {
    components: {
      "paragraph": ContentParagraph,
      "mypicture": ContentPicture,
      "myvideo": ContentVideo,
      "mylink": ContentLink,
      "mylist": ContentList,
      "mynotice": ContentNotice,
      "skelet": SkeletonLoader,
    },
    props: {
        user: {default: null},
        pCorId: {default: -1},
        pSubId: {default: -1},
        pGrade: {default: -1},
    },
    data () {
      return {
        //grade: 0,
        grades: [1,2,3,4,5,6,7,8,9],
        //subjectId: 0,
        subjects: [],
        //courseId: '',
        courseName: '',
        courses: [],
        contents: [],
        e1: 1,
        steps: 4,
        vyber: ["Výběr ročníku", "Výběr předmětu", "Výběr kurzu", "Kurz"],
        isAlert: false,
        alertMessage: '',
        alertMessages: ["K tomuto ročníku nebyli dosud přířazeny žádné předměty.", "K tomuto předmětu nebyli dosud přířazeny žádné kurzy.", "K tomuto kurzu dosud nebyl vytvořen meteriál."],

        tests: ["Prvni", "druhy", "treti"],

        search: '',
        headers: [
          { text: 'Název kurzu', align: 'start', filterable: true, value: 'title',},
          { text: 'Vytvořil', value: 'user.surname'},
          { text: 'Vytvořen', value: 'created'},
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
    methods: {
        nextStep (n) {
            if (n === this.steps) {
                this.e1 = 1
            } else {
                this.e1 = n + 1
            }
        },
        selectGrade(number, step){
            this.isAlert = false;
            this.grade = number;
            if(this.grade != 0)
                this.loadAllSubjectsByGrade(step);
        },
        async loadAllSubjectsByGrade(step){
            try{
                const response = await this.$http.get(`/subject/all/by/grade/${this.grade}`);
                this.subjects = response.data;
                if(this.subjects.length)
                    this.nextStep(step);
                else{
                    this.alertMessage = this.alertMessages[0];
                    this.isAlert = true;
                }
            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                  this.$emit("logoutUser");
            }
        },
        selectSubject(id, step){
            this.isAlert = false;
            this.subjectId = id;
            if(this.subjectId != 0)
                this.loadAllCoursesById(step);
        },
        async loadAllCoursesById(step){
            try{
                const response = await this.$http.get(`/course/all/by/subject/id/${this.subjectId}`);
                this.courses = response.data;
                if(this.courses.length)
                    this.nextStep(step);
                else{
                    this.alertMessage = this.alertMessages[1];
                    this.isAlert = true;
                }
            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                  this.$emit("logoutUser"); 
            }
        },
        handleClick(value) {
          this.isAlert = false;
          const idCourse = value.id;
          this.courseName = value.title;
          this.loadCourseContentById(idCourse);
        },
        async loadCourseContentById(id){
          try{
            const response = await this.$http.get(`/course/content/by/id/${id}`);
            this.contents = response.data;
            if(this.contents.length)
              this.nextStep(3);
            else{
              this.alertMessage = this.alertMessages[2];
              this.isAlert = true;
            }
          } catch (e) {
              const status = e.response.status;
              if (status == 401)
                this.$emit("logoutUser"); 
          }
        },
        setStepper(){
          if(this.pGrade != -1)
            this.selectGrade(this.pGrade, 1);
          if(this.pSubId != -1)
            this.selectSubject(this.pSubId, 2);
          if(this.pCorId != -1)
            this.loadAllCoursesById(this.pCorId);
        }
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