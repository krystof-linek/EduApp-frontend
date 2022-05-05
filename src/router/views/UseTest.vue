<template>
<div :class="isStarted == false ? 'mx-lg-16' : 'mx-lg-16'">
    <div :class="isStarted == false ? 'mx-lg-16' : 'mx-lg-16'">
    <v-card class="pb-2 mx-md-16 pa-lg-n7" v-if="testInfo != null" elevation="5" :rounded="$vuetify.breakpoint.name == 'sm' || $vuetify.breakpoint.name == 'xs' ? 'sm' : 'lg'">
        <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-sm-4 py-xl-6">
            <label :id="titleStyle">{{ isStarted == false ? 'Vypracovat test' : testInfo.title }}</label>
        </v-card-title>
            <v-divider></v-divider>
        <v-card-text>

            <v-card class="mx-sm-6 mx-md-12 mx-lg-16" v-if="isStarted == false" color="transparent" outlined>
                
                <v-simple-table class="mx-sm-7">
                    <tbody :id="infoStyle">
                        <tr>
                            <td class="font-weight-bold">Název testu:</td>
                            <td>{{ testInfo.title }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Předmět:</td>
                            <td>{{ testInfo.subject.title.charAt(0).toUpperCase() + testInfo.subject.title.slice(1) }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Autor:</td>
                            <td>{{ testInfo.author.name.charAt(0).toUpperCase() + testInfo.author.name.slice(1) + ' ' + testInfo.author.surname.charAt(0).toUpperCase() + testInfo.author.surname.slice(1) }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Vytvořen:</td>
                            <td>{{ getDate(testInfo.created) }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Upraven:</td>
                            <td v-if="testInfo.updated != null">{{ getDate(testInfo.updated) }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Počet otázek:</td>
                            <td>{{ testInfo.questions.length }}</td>
                        </tr>
                        <tr>
                            <td v-if="testRecord.ended != null" class="font-weight-bold">Rozbor otázek:</td>
                        </tr>
                    </tbody> 
                </v-simple-table>

                <v-card-actions class="justify-center py-sm-4">
                    <v-btn :style="startBtnSize" :disabled="testInfo.questions.length == 0" class="font-weight-bold mt-2 pa-2" color="success" @click="setDialog('startTest')">spustit</v-btn>
                </v-card-actions>

            </v-card>
        
            <div v-else>
                <v-card class="pt-5" outlined color="transparent">

                    <v-progress-linear color="blue" :class=" progress > 50 ? 'white--text' : ''" :height="progressHeight" v-model="progress">
                        <strong>{{ Math.ceil( progress) }}%</strong>
                    </v-progress-linear>

                       
                        <v-row align="center" class="my-2 my-sm-5">
                            <v-col>
                                <v-btn v-bind="testBtnSize" class="font-weight-bold" color="success" @click="questionIndex--" :disabled="questionIndex == 0"><v-icon v-bind="testBtnSize">mdi-arrow-left-thick</v-icon></v-btn>
                            </v-col>

                            <v-col class="text-center">
                                <span class="white--text font-weight-bold blue pa-3 pa-sm-5 rounded-lg" :style="counterFontStyle">{{ questionIndex + 1 + '/' + testInfo.questions.length }}</span>   
                            </v-col>
                                
                            <v-col class="text-right">
                                <v-btn v-bind="testBtnSize" class="font-weight-bold" color="success" @click="questionIndex++" :disabled="questionIndex == questions.length - 1"><v-icon v-bind="testBtnSize">mdi-arrow-right-thick</v-icon></v-btn>
                            </v-col>
                        </v-row>
                    
                        <!-- otázka -->
                        
                        <v-sheet color="blue lighten-4" class="pb-0 mb-2" rounded="lg">
                            <v-card-text :style="textAreaStyle" class="py-2 px-lg-5 py-lg-3">
                                {{ questions[questionIndex].content.text }}
                            </v-card-text>
                        </v-sheet>

                        <v-card class="my-2 my-sm-4" v-if="questions[questionIndex].content.picture != ''" :width="answerPictureWidth" style="margin:auto" rounded="lg" elevation="8"> 
                            <v-img :src="questions[questionIndex].content.picture"></v-img>
                        </v-card>

                        <v-card outlined color="transparent" v-if="questions[questionIndex].content.equation != ''" class="mt-1 mb-1 ma-2 mt-sm-2 mb-sm-2 py-sm-4">
                            <vue-mathjax :style="answerEquationFontStyle" :formula="questions[questionIndex].content.equation"></vue-mathjax>
                        </v-card>

                        <v-sheet v-if="questions[questionIndex].content.equation != '' || questions[questionIndex].content.picture != ''" class="py-1 py-sm-2 py-xl-4 mb-xl-5" rounded="lg" color="blue lighten-4" width="100%">
                        </v-sheet>
                        <!-- odpovedi -->
                        
                        <v-card class="my-1 mt-sm-2 mt-lg-4 mt-xl-8" color="transparent" outlined v-for="(answer, index) in questions[questionIndex].answers" :key="index">
                        <!--              
                            <v-row class="mx-0 pb-3 pb-lg-4" no-gutters align="center">  
                                <v-col>
                                    <label :style="labelsFontStyle">{{ index + 1 }}. odpověď</label>
                                </v-col>                     
                            </v-row>
                        -->   
                            <v-card elevation="8" :color="answer.true ? 'success' : 'blue-grey lighten-3'" @click="answer.true = !answer.true" class="py-0" rounded="lg">
                                <v-card-text :style="textAreaStyle" :class="answer.true ? 'white--text my-2 py-2 px-lg-5 py-3 mt-n2' : 'my-2 py-2 px-lg-5 py-3 mt-n2'">
                                    <span class="font-weight-bold">{{ index + 1 }}. </span>{{ answer.content.text }}
                                </v-card-text>
                            </v-card>

                            <v-col v-if="answer.content.picture != ''" class="my-2 my-sm-4 py-0">
                                <v-card :width="answerPictureWidth" style="margin:auto" rounded="lg" elevation="8"> 
                                    <v-img :src="answer.content.picture"></v-img>
                                </v-card>
                            </v-col>

                            <v-col class="my-0 my-sm-4 pb-0 pt-1" v-if="answer.content.equation != ''">
                                <v-sheet>
                                    <vue-mathjax :style="answerEquationFontStyle" :formula="answer.content.equation"></vue-mathjax>
                                </v-sheet>
                            </v-col>
                        </v-card>

                        <v-divider></v-divider>
                            
                        <v-card-actions class="justify-center my-md-2 my-lg-4 my-xl-6">
                            <v-btn rounded :style="startBtnSize" v-bind="testBtnSize" class="font-weight-bold py-5 px-7 py-sm-5" color="success" @click="questionIndex == questions.length - 1 ? setDialog('sendTest') : questionIndex++ ">{{ questionIndex == questions.length - 1 ? 'odeslat' : 'další' }}</v-btn>
                        </v-card-actions>

                    </v-card>
               
            </div>
        </v-card-text>

        <div v-if="dialog.isSet">
            <my-dialog :propType='dialog.type' :propTitle="dialog.title" :propText='dialog.text' @dialogResult="resultDialog"></my-dialog>
        </div>

        <div v-if="dialogInfo.isSet">
            <my-dialog-explain propTitle='Upozornění:' :propText='dialogInfo.text' @clickOnOk="dialogInfo.isSet = false"></my-dialog-explain>
        </div>

    </v-card>
    </div>
</div>
</template>

<script>
import DialogWindow from '../../components/DialogWindow.vue'
import DialogExplainWindow from '../../components/DialogExplainWindow.vue'
import {VueMathjax} from 'vue-mathjax'

export default {
    components: {
        'my-dialog': DialogWindow,
        'vue-mathjax': VueMathjax,
        'my-dialog-explain': DialogExplainWindow,
    },
    data: () => ({
        testInfo: null,
        isStarted: false,

        userRole: '',

        testRecord: {
            wantSave: false, //zaznam testu se bude vytvaret jen studentum
            id_record: -1,
        },

        progress: 0,

        dialogInfo: {
            isSet: false,
            text: '',
        },

        dialogInfoMessages: [
            "Záznamy o testech se ukládají pouze u studentských účtů."
        ],

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
        titleStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'my-window-title-xs'
          case 'sm': return 'my-window-title-sm'
          case 'md': return 'my-window-title-md'
          case 'xl': return 'my-window-title-xl'
          default: return 'my-window-title-lg' //lg
          }
        },
        testBtnSize(){
            const size = {sm: 'large', md: 'large',lg:'x-large',xl:'x-large'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        },
        textAreaStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3.5vw; line-height: 160%; text-align: justify;'
          case 'sm': return 'font-size: 2.5vw; line-height: 200%; text-align: justify;'
          case 'md': return 'font-size: 1.5vw; line-height: 200%; text-align: justify;'
          case 'lg': return 'font-size: 1.5vw; line-height: 200%; text-align: justify;'
          default: return 'font-size: 1.3vw; line-height: 200%; text-align: justify;'
          }
        },
        answerEquationFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3.5vw'
          case 'sm': return 'font-size: 3vw'
          case 'md': return 'font-size: 3vw'
          case 'lg': return 'font-size: 2.5vw'
          default: return 'font-size: 2.5vw'
          }
        },
        answerPictureWidth() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '55vw'
          case 'sm': return '50vw'
          case 'md': return '45vw'
          case 'lg': return '30vw'
          default: return '30vw'
          }
        },
        windowWidth() {
        switch (this.$vuetify.breakpoint.name) {
          case 'lg': return '50vw'
          case 'xl': return '50vw'
          default: return ''
          }
        },
        progressHeight() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '20'
          case 'sm': return '30'
          case 'md': return '30'
          case 'lg': return '30'
          default: return '40'
          }
        },
        startBtnSize(){
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 1rem'
            case 'sm': return 'font-size: 1.4rem'
            case 'md': return 'font-size: 1.2rem'
            case 'lg': return 'font-size: 1.3rem'
            default: return 'font-size: 1.4rem'
          }
        },
        infoStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'my-table-info-xs'
          case 'sm': return 'my-table-info-sm'
          case 'md': return 'my-table-info-md'
          case 'xl': return 'my-table-info-xl'
          default: return 'my-table-info-default'
          }
        },
        labelsFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3.5vw'
          case 'sm': return 'font-size: 2.5vw'
          case 'md': return 'font-size: 1.7vw'
          case 'lg': return 'font-size: 1.5vw'
          default: return 'font-size: 1.4vw'
          }
        },
        counterFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3.5vw'
          case 'sm': return 'font-size: 3vw'
          case 'md': return 'font-size: 2.2vw'
          case 'lg': return 'font-size: 1.5vw'
          default: return 'font-size: 1.4vw'
          }
        },
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
                    this.$router.push({ name: 'notFound', });
                }
            }
        },
        async loadUser(){
            try{
                const response = await this.$http.get(`/user/my/info`);
                this.userRole = response.data.role;

                if (this.userRole === "STUDENT")
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
                const response = await this.$http.post("/test/record/check/answers", {id_record: this.testRecord.id_record, recordAnswerData: recordAnswers});

                const record = response.data;

                this.$router.push({name: 'testRecord', params: { id_record: record.id_record, testRecord: record }});
                
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

              if (this.testRecord.wantSave === true && this.isStarted == true)
                this.createRecord();
          } 
          
          if(dialogResult.type == "sendTest" && dialogResult.result){

              if (this.testRecord.id_record > 0)
                this.sendTest();
              else {
                this.dialogInfo.isSet = true;
                this.dialogInfo.text = this.dialogInfoMessages[0];
              }

          }
          
          this.dialog.isSet = false;
          this.dialog.type = "";
          this.dialog.text = "";
          this.dialog.title = "";
        
        },
        getDate(date){
            let array = date.split('T');

            date = array[0];

            array = array[1].split('.');

            let time = array[0];

            array = date.split('-');

            let year = array[0];
            let month = array[1];
            let day = array[2];

            date = day + '.' + month + '.' + year + ' ' + time;

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