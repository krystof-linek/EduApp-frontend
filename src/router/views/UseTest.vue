<template>
  <v-card class="pb-2" v-if="testInfo != null" elevation="5" rounded="lg">
      <v-card-title class="justify-center blue white--text">
          <label class="text-h4">{{ isStarted == false ? 'Vypracovat test' : testInfo.title }}</label>
      </v-card-title>
        <v-divider></v-divider>
      <v-card-text>
        <div v-if="isStarted == false" class="pt-10">
            <v-row class="justify-center">
                <v-card width="40vw" elevation="5" rounded="lg">
                    <v-card-title class="justify-center blue white--text">
                        <label>{{testInfo.title }}</label>
                    </v-card-title>
                    
                    <v-divider></v-divider>

                    <v-card class="pa-5" width="100%">
                        <v-row class="justify-center mb-3">
                            <v-col cols="10" sm="10" class="text-center">
                                <label><span class="font-weight-bold">Autor:</span> {{testInfo.author.name.charAt(0).toUpperCase() + testInfo.author.name.slice(1) + ' ' + testInfo.author.surname.charAt(0).toUpperCase() + testInfo.author.surname.slice(1) }}</label>
                            </v-col>
                            <v-col cols="10" sm="10" class="text-center">
                                <label><span class="font-weight-bold">Předmět:</span> {{testInfo.subject.title.charAt(0).toUpperCase() + testInfo.subject.title.slice(1) }}</label> 
                            </v-col>
                            <v-col cols="10" sm="5" class="text-center">
                                <label><span class="font-weight-bold">Vytvořen:</span> {{ this.getDate(testInfo.created) }}</label>
                            </v-col>
                            <v-col cols="10" sm="10" v-if="testInfo.updated != null" class="text-center">
                                <label><span class="font-weight-bold">Upraven:</span> {{ this.getDate(testInfo.updated) }}</label>
                            </v-col>
                            <v-col cols="10" sm="5" class="text-center">
                                <label><span class="font-weight-bold">Počet otázek:</span> {{ testInfo.questions.length }}</label>
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>
                        
                        <v-card-actions class="justify-center">
                            <v-btn :disabled="testInfo.questions.length == 0" class="font-weight-bold mt-2" color="success" @click="setDialog('startTest')">spustit</v-btn>
                        </v-card-actions>

                    </v-card>
                </v-card>
            </v-row>
        </div>
        <div v-else>
            <v-row class="justify-center">
                <v-card class="pt-5" width="95%" outlined color="transparent">

                    <v-progress-linear color="blue" :class=" progress > 50 ? 'white--text' : ''" :height="progressHeight" v-model="progress">
                        <strong>{{ Math.ceil( progress) }}%</strong>
                    </v-progress-linear>

                     <v-card-actions class="pa-0 mt-sm-2">
                        <v-row>
                            <v-col>
                                <v-btn v-bind="testBtnSize" class="font-weight-bold mt-2 text-right pa-lg-8 py-lg-6 pa-xl-12 py-xl-8" color="success" @click="questionIndex--" :disabled="questionIndex == 0"><v-icon v-bind="testBtnSize">mdi-arrow-left-thick</v-icon></v-btn>
                            </v-col>

                            <v-col>
                                <v-row class="justify-center py-3">
                                    <span class="white--text font-weight-bold blue mt-2 py-2 pa-3 mt-sm-1 py-sm-4 pa-sm-4 mt-lg-2 rounded-lg" :style="questionFontStyle">{{ questionIndex + 1 + '/' + testInfo.questions.length }}</span>
                                </v-row>
                            </v-col>
                            
                            <v-col class="text-right">
                                <v-btn v-bind="testBtnSize" class="font-weight-bold mt-2 pa-lg-8 py-lg-6 pa-xl-12 py-xl-8" color="success" @click="questionIndex++" :disabled="questionIndex == questions.length - 1"><v-icon v-bind="testBtnSize">mdi-arrow-right-thick</v-icon></v-btn>
                            </v-col>
                        </v-row>
                     </v-card-actions>
                    <!-- otázka pa-5 py-2 py-md-4 py-xl-8 mb-5 -->
                    <v-card-title class="pa-0 mt-2 mt-sm-4">
                        <v-sheet :class="questionClass" color="blue lighten-4" width="100%">
                            <label :style="questionFontStyle">{{ questions[questionIndex].content.text }}</label>
                        </v-sheet>
                    </v-card-title>

                    <v-card class="mt-2 mb-2" v-if="questions[questionIndex].content.picture != ''" :width="answerPictureWidth" style="margin:auto" rounded="lg" elevation="8"> 
                        <v-img :src="questions[questionIndex].content.picture"></v-img>
                    </v-card>

                    <v-card outlined color="transparent" v-if="questions[questionIndex].content.equation != ''" class="mt-1 mb-1 ma-2 mt-sm-2 mb-sm-2 py-sm-4">
                        <vue-mathjax :style="answerEquationFontStyle" :formula="questions[questionIndex].content.equation"></vue-mathjax>
                    </v-card>

                    <v-sheet v-if="questions[questionIndex].content.equation != '' || questions[questionIndex].content.picture != ''" class="py-1 py-sm-2 py-xl-4 mb-xl-5" rounded="lg" color="blue lighten-4" width="100%">
                    </v-sheet>
                    <!-- odpovedi -->
                    <v-row class="my-4 my-xl-5" justify="center" v-for="(answer, index) in questions[questionIndex].answers" :key="index">
                        <v-card :class="answerClass" :color="answer.true ? 'success' : 'blue-grey lighten-3'" width="95%" @click="answer.true = !answer.true">
                            <v-col>
                                <label :class="answer.true ? 'white--text' : ''" :style="answerFontStyle"><span class="font-weight-bold">{{index + 1}}. </span> {{ answer.content.text }}</label>
                            </v-col>
                        </v-card>
                        <v-col v-if="answer.content.picture != ''" class="mb-n4 mb-xl-0">
                            <v-card :width="answerPictureWidth" style="margin:auto" rounded="lg" elevation="8"> 
                                <v-img :src="answer.content.picture"></v-img>
                            </v-card>
                        </v-col>
                        <v-col class="mb-n4 mb-xl-n6" cols="11" v-if="answer.content.equation != ''">
                            <v-card outlined color="transparent">
                                <vue-mathjax :style="answerEquationFontStyle" :formula="answer.content.equation"></vue-mathjax>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-divider></v-divider>
                        
                    <v-card-actions class="justify-center my-md-2 my-lg-4 my-xl-6">
                        <v-btn :style="answerFontStyle" v-bind="testBtnSize" class="font-weight-bold" color="success" @click="setDialog('sendTest')">odeslat</v-btn>
                    </v-card-actions>

                </v-card>
            </v-row>
        </div>
      </v-card-text>

    <div v-if="dialog.isSet">
        <my-dialog :propType='dialog.type' :propTitle="dialog.title" :propText='dialog.text' @dialogResult="resultDialog"></my-dialog>
    </div>

  </v-card>
</template>

<script>
import DialogWindow from '../../components/DialogWindow.vue'
import {VueMathjax} from 'vue-mathjax'

export default {
    components: {
        'my-dialog': DialogWindow,
        'vue-mathjax': VueMathjax,
    },
    data: () => ({
        testInfo: null,
        isStarted: false,

        testRecord: {
            wantSave: false, //zaznam testu se bude vytvaret jen studentum
            id_record: -1,
        },

        progress: 0,

        dialog: {
            isSet: false,
            type: "",
            text: "",
            title: "",
        },

        dialogItems: [
            {type: "startTest" , title:"Upozornění", text: "Opravdu si přejete spustit test?"},
            {type: "sendTest" , title:"Upozornění", text: "Opravdu si přejete odeslat test?"},
        ],

        questionIndex: 0,

        questions: [],
        
    }),
    watch: {
      questionIndex(){
          this.setProgress();
      }
    },
    computed:{
        questionClass () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'mb-1 py-3 pa-5 rounded-lg'
          case 'sm': return 'mb-2 py-4 pa-5 rounded-lg'
          case 'md': return 'mb-3 py-5 pa-4 rounded-lg'
          case 'lg': return 'mb-4 py-6 pa-5 rounded-lg'
          default: return 'mb-5 py-8 pa-6 rounded-xl'
          }
        },
        questionFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 2.6vw'
          case 'sm': return 'font-size: 2.4vw'
          case 'md': return 'font-size: 2vw'
          case 'lg': return 'font-size: 1.8vw'
          default: return 'font-size: 1.5vw'
          }
        },
        answerClass () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'py-0 rounded-lg'
          case 'sm': return 'py-2 rounded-lg'
          case 'md': return 'py-1 rounded-lg'
          case 'lg': return 'py-2 pa-3 rounded-xl'
          default: return 'py-2 pa-8 rounded-xl'
          }
        },
        answerFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 2.4vw'
          case 'sm': return 'font-size: 2.5vw'
          case 'md': return 'font-size: 2vw'
          case 'lg': return 'font-size: 1.8vw'
          default: return 'font-size: 1.4vw'
          }
        },
        answerEquationFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3.5vw'
          case 'sm': return 'font-size: 3vw'
          case 'md': return 'font-size: 3vw'
          case 'lg': return 'font-size: 3.5vw'
          default: return 'font-size: 3vw'
          }
        },
        answerPictureWidth() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '60vw'
          case 'sm': return '50vw'
          case 'md': return '50vw'
          case 'lg': return '50vw'
          default: return '40vw'
          }
        },
        progressHeight() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '15'
          case 'sm': return '25'
          case 'md': return '30'
          case 'lg': return '30'
          default: return '40'
          }
        },
        testBtnSize(){
            const size = {xs:'x-small',md: 'large',lg:'large',xl:'x-large'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        }
    },
    methods:{
        async loadTest(id_test){
            try{
                const response = await this.$http.get(`/test/get/active/safe/by/id/${id_test}`);
                this.testInfo = response.data;

                this.questions = this.testInfo.questions;

                this.setProgress();
            } catch (e) {
                const status = e.response.status;
                
                if (status == 401)
                    this.$emit("logoutUser"); 
                else if (status == 403){
                    this.$router.push({ name: 'errNotPerms', });
                }
                else if (status == 404){
                    console.log("Test not found")
                }
            }
        },
        async loadUser(){
            try{
                const response = await this.$http.get(`/user/my/info`);
                let userRole = response.data.role;

                if (userRole === "STUDENT")
                    this.testRecord.wantSave = true;
            } catch (e) {
                const status = e.response.status;
                
                if (status == 401)
                    this.$emit("logoutUser"); 
                else if (status == 404){
                    console.log("User not found")
                }
            }
        },
        async createRecord(){
            try {
                const response = await this.$http.post("/test/record/create", {id_test: this.testInfo.id});

                this.testRecord.id_record = response.data.id_record;
                
           } catch(e){
                const statusCode = e.response.status;
          
                if (statusCode == 401){
                    this.$emit("logoutUser");
                }
            }
        },
        prepareRecords(){
            let recordAnswers = [];

            this.questions.forEach((question) => {
                question.answers.forEach((answer) => {

                    let recordAnswer = {
                        id_answer: -1,
                        selectedValue: false,
                    };

                    console.log(answer);

                    recordAnswer.id_answer = answer.id;
                    recordAnswer.selectedValue = answer.true;

                    recordAnswers.push(recordAnswer);
                });
            });

            return recordAnswers;
        },
        async sendTest(){
            let recordAnswers = this.prepareRecords();

            try {
                const response = await this.$http.post("/test/record/save/answers", {id_record: this.testRecord.id_record, recordAnswerData: recordAnswers});

                const record = response.data;

                console.log(record);
                
           } catch(e){
                const statusCode = e.response.status;
          
                if (statusCode == 401){
                    this.$emit("logoutUser");
                }
            }
        },
        setDialog(type){
            if (type == 'startTest'){
                this.dialog.isSet = true;
                this.dialog.type = type;
                this.dialog.title = this.dialogItems[0].title;
                this.dialog.text = this.dialogItems[0].text;
            }
            else if (type == 'sendTest'){
                this.dialog.isSet = true;
                this.dialog.type = type;
                this.dialog.title = this.dialogItems[1].title;
                this.dialog.text = this.dialogItems[1].text;
            }
        },
        resultDialog(result, type){
            
            let dialogResult = {
                result: result,
                type: type,
            }

            this.dialog.isSet = false;
            this.dialog.type = "";

            this.processDialog(dialogResult);

        },
        processDialog(dialogResult){

          if (dialogResult.type == "startTest"){
              this.isStarted = dialogResult.result;

              if (this.testRecord.wantSave === true)
                this.createRecord();
          } 
          
          if(dialogResult.type == "sendTest" && dialogResult.result){

              if (this.testRecord.id_record > 0)
                this.sendTest();
          }
          
          this.dialog.isSet = false;
          this.dialog.type = "";
          this.dialog.text = "";
          this.dialog.title = "";
        
        },
        getDate(date){
            let array = date.split(' ');

            date = array[0];

            array = date.split('-');

            date = array[0] + '.' + array[1] + '.' + array[2];

            return date;
        },
        setProgress(){
            if(this.questions.length != 0)
                this.progress = (this.questionIndex+1) / this.questions.length * 100;
        }
    },
    mounted(){
        this.loadTest(this.$route.params.id_test);

        this.loadUser();

        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML')
        document.head.appendChild(recaptchaScript)
    }
  }
</script>