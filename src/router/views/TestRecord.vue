<template>
<div class="mx-lg-16">
  <v-card class="pb-0 mx-lg-16" elevation="5" :rounded="$vuetify.breakpoint.name == 'sm' || $vuetify.breakpoint.name == 'xs' ? 'sm' : 'lg'">
    <v-sheet v-if="!isReady">
        <v-sheet color="lighten-4" class="pa-3" rounded="lg">
            <v-skeleton-loader class="mx-auto" type="article"></v-skeleton-loader>

            <v-skeleton-loader type="card"></v-skeleton-loader>

            <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </v-sheet>
    </v-sheet>


    <v-card v-if="isReady" class="py-0 pb-md-4 pb-lg-6">
        <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-sm-4 py-xl-6">
            <label :id="titleStyle">Vyhodnocení testu</label>
        </v-card-title>
        
        <v-divider></v-divider>
      
            <v-card  width="100%" color="transparent" outlined>
                <v-card class="mx-sm-6 mx-md-12 mx-lg-16" color="transparent" outlined>
                <v-simple-table class="ma-md-7">
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
                            <td class="font-weight-bold">Odevzdáno:</td>
                            <td v-if="testRecord.ended != null">{{ getDate(testRecord.ended) }}</td>
                            <td v-else class="red--text font-weight-bold">neodevzdáno</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Doba vyprácování:</td>
                            <td v-if="testRecord.ended != null">{{ getTimeDuration(testRecord.started, testRecord.ended) }}</td>
                            <td v-else>--:--:--</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Správné odpovědi:</td>
                            <td v-if="testRecord.ended != null">{{ testInfo.questions.length - badQuestions + '/' + testInfo.questions.length }}</td>
                            <td v-else>-/-</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Úspěšnost:</td>
                            <td v-if="testRecord.ended != null">{{ successRate }}</td>
                            <td v-else>0%</td>
                        </tr>
                        <tr>
                            <td v-if="testRecord.ended != null" class="font-weight-bold">Rozbor otázek:</td>
                        </tr>
                    </tbody> 
                </v-simple-table>
                </v-card>

                <v-card v-if="testRecord.ended != null" class="mx-md-12 mx-lg-16 mt-md-n7" outlined color="transparent">
                    <div class="mx-md-7">
                    <v-expansion-panels>
                        <v-expansion-panel v-for="(question, queIndex) in testInfo.questions" :key="queIndex">
                            <v-expansion-panel-header>
                                <span class="font-weight-bold ml-n2 ml-sm-4 ml-md-n1" :style="questionItemFontStyle">
                                    {{ question.content.text.length > 40 ? queIndex + 1 + '. ' + question.content.text.substring(0,40) + " ...." : queIndex + 1 + '. ' + question.content.text}}
                                </span>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>

                                <v-row class="my-4 my-xl-5" justify="center">
                                    <v-card width="100%" class="justify-center" color="transparent" outlined>

                                        <v-sheet color="blue lighten-4" class="pb-0 mb-2" rounded="lg">
                                            <v-card-text :style="textAreaStyle" class="py-2 px-lg-5 py-lg-3">
                                                {{ testInfo.questions[queIndex].content.text }}
                                            </v-card-text>
                                         </v-sheet>

                                        <v-card class="my-2 my-sm-4" v-if="testInfo.questions[queIndex].content.picture != ''" :width="questionPictureWidth" style="margin:auto" rounded="lg" elevation="8"> 
                                            <v-img :src="testInfo.questions[queIndex].content.picture"></v-img>
                                        </v-card>

                                        <v-card outlined color="transparent" v-if="testInfo.questions[queIndex].content.equation != ''" class="mt-1 mb-1 ma-2 mt-sm-2 mb-sm-2 py-sm-4">
                                            <vue-mathjax :style="answerEquationFontStyle" :formula="testInfo.questions[queIndex].content.equation"></vue-mathjax>
                                        </v-card>

                                        <v-sheet v-if="testInfo.questions[queIndex].content.equation != '' || testInfo.questions[queIndex].content.picture != ''" class="py-1 py-sm-2 py-xl-4 mb-1 mb-sm-2" rounded="lg" color="blue lighten-4" width="100%">
                                        </v-sheet>
                                        <!-- Správné odpovědi -->
                                        <v-card v-if="question.answers.length != 0" color="transparent" outlined>
                                            
                                            <label :style="labelsFontStyle" class="font-weight-bold">Správné řešení:</label>
                                            
                                            <v-card class="py-0" color="transparent" outlined v-for="(answer, ansIndex) in question.answers" :key="ansIndex">
                                                <div v-if="answer.true" class="mt-1 mt-sm-2 mt-lg-3">
                                                   
                                                    <v-row class="mx-0 pb-3 pb-lg-4" no-gutters align="center">  
                                                        <v-col class="ml-4 ml-lg-5">
                                                            <label :style="labelsFontStyle">{{ ansIndex + 1 }}. odpověď</label>
                                                        </v-col>

                                                        <v-col class="text-right my-0 py-0">
                                                            <v-btn v-if="answer.explanation != null" color="blue" v-bind="btnSize" fab class="font-weight-bold white--text" @click="setExplanationDialog(answer.explanation.content)"><v-icon color="white" >mdi-help</v-icon></v-btn>
                                                        </v-col>
                                                    </v-row>

                                                    <v-sheet color="success" class="py-0" rounded="lg">
                                                        <v-card-text :style="textAreaStyle" class="white--text py-2 px-lg-5 py-3 mt-n2">
                                                            {{ answer.content.text }}
                                                        </v-card-text>
                                                    </v-sheet>

                                                    <v-col v-if="answer.content.picture != ''" class="my-2 my-sm-4 py-0">
                                                        <v-card :width="answerPictureWidth" style="margin:auto" rounded="lg" elevation="8"> 
                                                            <v-img :src="answer.content.picture"></v-img>
                                                        </v-card>
                                                    </v-col>

                                                    <v-col class="my-2 my-sm-4" v-if="answer.content.equation != ''">
                                                        <v-sheet>
                                                            <vue-mathjax :style="answerEquationFontStyle" :formula="answer.content.equation"></vue-mathjax>
                                                        </v-sheet>
                                                    </v-col>
                                                </div>
                                            </v-card>
                                        </v-card>
                                    <!-- Chybné odpovědi -->
                                        <v-card v-if="question.badAnswers.length != 0" color="transparent" outlined>
                                            
                                            <label :style="labelsFontStyle" class="font-weight-bold">Chybné odpovědi:</label>

                                            <v-card class="mt-1 mt-sm-2" color="transparent" outlined v-for="(answer, ansIndex) in question.badAnswers" :key="ansIndex">
                                               
                                                    <v-row class="mx-0 pb-3 pb-lg-4" no-gutters align="center">  
                                                        <v-col class="ml-4 ml-lg-5">
                                                            <label :style="labelsFontStyle">{{ ansIndex + 1 }}. odpověď</label>
                                                        </v-col>

                                                        <v-col class="text-right my-0 py-0">
                                                            <v-btn v-if="answer.explanation != null" color="blue" v-bind="btnSize" fab class="font-weight-bold white--text" @click="setExplanationDialog(answer.explanation.content)"><v-icon color="white" >mdi-help</v-icon></v-btn>
                                                        </v-col>
                                                    </v-row>

                                                    <v-sheet :color="answer.true ? 'warning' : 'error'" class="py-0" rounded="lg">
                                                        <v-card-text :style="textAreaStyle" class="white--text py-2 px-lg-5 py-3 mt-n2">
                                                            {{ answer.content.text }}
                                                        </v-card-text>
                                                    </v-sheet>

                                                    <v-col v-if="answer.content.picture != ''" class="my-2 my-sm-4 py-0">
                                                        <v-card :width="answerPictureWidth" style="margin:auto" rounded="lg" elevation="8"> 
                                                            <v-img :src="answer.content.picture"></v-img>
                                                        </v-card>
                                                    </v-col>

                                                    <v-col class="my-2 my-sm-4" v-if="answer.content.equation != ''">
                                                        <v-sheet>
                                                            <vue-mathjax :style="answerEquationFontStyle" :formula="answer.content.equation"></vue-mathjax>
                                                        </v-sheet>
                                                    </v-col>
                                            </v-card>
                                        </v-card>
                                    </v-card>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    </div>
                </v-card>
            </v-card>


    <div v-if="dialog.isSet">
        <my-dialog :propType='dialog.type' :propTitle="dialog.title" :propText='dialog.text' @clickOnHide="resultDialog"></my-dialog>
    </div>
    </v-card>

    <div v-if="dialogExplanation.isSet">
        <my-dialog-explain :propText='dialogExplanation.text' :propEquation='dialogExplanation.equation' :propPicture="dialogExplanation.picture" @clickOnOk="hideDialog"></my-dialog-explain>
    </div>

  </v-card>
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
        id_record: -1,

        testRecord: null,
        testInfo: null,

        badQuestions: -1,
        successRate: '',

        isReady: false,

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

        dialogExplanation: {
            isSet: false,
            text: "",
            picture: "",
            equation: "",
        },

        questionIndex: 0,

        //questions: [],
        
    }),
    computed:{
        questionItemFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3.5vw'
          case 'sm': return 'font-size: 2.2vw'
          case 'md': return 'font-size: 1.5vw'
          case 'lg': return 'font-size: 1.3vw'
          default: return 'font-size: 1.1vw'
          }
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
        labelsFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3.5vw'
          case 'sm': return 'font-size: 2.5vw'
          case 'md': return 'font-size: 1.7vw'
          case 'lg': return 'font-size: 1.5vw'
          default: return 'font-size: 1.4vw'
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
          case 'xs': return 'font-size: 2.6vw'
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
          case 'lg': return 'font-size: 2.5vw'
          default: return 'font-size: 2.5vw'
          }
        },
        answerPictureWidth() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '55vw'
          case 'sm': return '50vw'
          case 'md': return '45vw'
          case 'lg': return '40vw'
          default: return '30vw'
          }
        },
        questionPictureWidth() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '45vw'
          case 'sm': return '50vw'
          case 'md': return '50vw'
          case 'lg': return '40vw'
          default: return '33vw'
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
        titleStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'my-window-title-xs'
          case 'sm': return 'my-window-title-sm'
          case 'md': return 'my-window-title-md'
          case 'xl': return 'my-window-title-xl'
          default: return 'my-window-title-lg' //lg
          }
        },
        infoStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'my-table-info-xs'
          case 'sm': return 'my-table-info-sm'
          case 'md': return 'my-table-info-md'
          case 'xl': return 'my-table-info-xl'
          default: return 'my-table-info-default' //lg
          }
        },
        btnSize(){
            const size = {xs:'x-small',sm: 'small', md: 'small', lg: 'small'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        }
    },
    methods:{
        async init(){
            this.id_record = this.$route.params.id_record;
            
            if (this.id_record < 0)
                console.log("Record not found")
            else
                await this.loadUserInfo();

            if (this.user != null){
                if(this.user.role == "STUDENT")
                    this.loadRecordAsStudent();
            }

            if (this.user != null){
                if(this.user.role == "PARENT")
                    this.loadRecordAsParent();
            }

            if (this.user != null){
                if(this.user.role == "TEACHER")
                    this.loadRecordAsTeacher();
            }
        },
        async loadUserInfo(){
            try{
                const response = await this.$http.get(`/user/my/info`);
                
                this.user = response.data;

            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                    this.$emit("logoutUser"); 
            }
        },
        async loadRecordAsStudent(){
            
            try{
                const response = await this.$http.get(`/test/record/get/my/by/id/${this.id_record}`);
                
                this.testRecord = response.data.record;

                this.testInfo = this.testRecord.test;

                this.badQuestions = response.data.badQuestions;

                this.successRate = response.data.successRate;

                if (this.badQuestions != -1)
                    this.setBadAnswers();

                this.isReady = true;

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
        async loadRecordAsParent(){
            
            try{
                const response = await this.$http.get(`/test/record/get/of/my/child/${this.id_record}`);
                
                this.testRecord = response.data.record;

                this.testInfo = this.testRecord.test;

                this.badQuestions = response.data.badQuestions;

                this.successRate = response.data.successRate;

                if (this.badQuestions != -1)
                    this.setBadAnswers();

                this.isReady = true;

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
        async loadRecordAsTeacher(){
            
            try{
                const response = await this.$http.get(`/test/record/get/of/my/student/${this.id_record}`);
                
                this.testRecord = response.data.record;

                this.testInfo = this.testRecord.test;

                this.badQuestions = response.data.badQuestions;

                this.successRate = response.data.successRate;

                if (this.badQuestions != -1)
                    this.setBadAnswers();

                this.isReady = true;

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
        setExplanationDialog(explanation){
            this.dialogExplanation.text = explanation.text;
            this.dialogExplanation.picture = explanation.picture;
            this.dialogExplanation.equation = explanation.equation;

            this.dialogExplanation.isSet = true;
            
        },
        hideDialog(){
            this.dialogExplanation.isSet = false;
        },
        getTimeDuration(start, end){
    
            let date1 = start;
            let date2 = end;

            let timestamp1 = new Date(date1).getTime();
            let timestamp2 = new Date(date2).getTime();

            const hour = new Date(timestamp2 - timestamp1).getHours() - 1;
            const minutes = new Date(timestamp2 - timestamp1).getMinutes();
            const seconds = new Date(timestamp2 - timestamp1).getSeconds();

            let time;

            if (hour < 10)
                time = '0' + hour + ':'
            else 
                time = hour + ':'

            if (minutes < 10)
                time += '0' + minutes + ':'
            else
                time += minutes + ':'

            if (seconds < 10)
                time += '0' + seconds
            else
                time += seconds

            return time;
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

            date = day + '. ' + month + '. ' + year + ' ' + time;

            return date;
        },
        setBadAnswers(){

            this.testInfo.questions.forEach((question) =>{
                let badAnswers = [];
                
                this.testRecord.badAnswers.some(badAnswer => {
                    if (badAnswer.id_question === question.id)
                        badAnswers.push(badAnswer);
                });

                question.badAnswers = badAnswers;
            });

        }
    },
    mounted(){
        this.init();

        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML')
        document.head.appendChild(recaptchaScript)
    }
  }
</script>
<style>
#my-table-info-default td{
    font-size: 1.4vw;
}
#my-table-info-xs td{
    font-size: 4vw;
    line-height: 5vh;
}
#my-table-info-sm td{
    font-size: 2.5vw;
    line-height: 5vh;
}
#my-table-info-md td{
    font-size: 1.8vw;
    line-height: 6vh;
}
#my-table-info-xl td{
    font-size: 1.2vw;
    line-height: 2vh;
}
</style>