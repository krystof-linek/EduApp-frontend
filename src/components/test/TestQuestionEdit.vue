<template>
    <div v-if="testInfo != null">
        <v-row class="justify-center mb-5">
        <v-card outlined color="transparent" width="85%">    
            <v-card-actions>
                <v-row>
                    <v-col cols="12" sm="12" class="text-center">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-btn :disabled='mainIndex == 0' large color="success" @click="mainIndex--"><v-icon large>mdi-arrow-left-thick</v-icon></v-btn>
                    </v-col>
                    <v-col cols="12" sm="8" class="text-center">
                        <v-btn class="white--text font-weight-bold" color="blue" @click="addQuestion">přidat otázku<v-icon class="ml-2">mdi-plus-thick</v-icon></v-btn>
                        <v-btn :disabled="testInfo.questions.length == 0" class="font-weight-bold white--text ma-4" color="error" @click="setDialog('deleteQuestion')">smazat otázku<v-icon class="ml-2">mdi-trash-can-outline</v-icon></v-btn>
                    </v-col>
                    <v-col cols="12" sm="2" class="text-right">
                        <v-btn :disabled='mainIndex == testInfo.questions.length || mainIndex == testInfo.questions.length-1' large color="success" @click="mainIndex++"><v-icon large>mdi-arrow-right-thick</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
            <!-------      formulář pro otázku    ----------->
            <div v-if="testInfo.questions.length != 0">
                <v-form v-model="isCorrect">
                    <v-card class="mt-5 ma-2 pb-3" elevation="5" rounded="lg">
                        <v-card-title>
                            <label id="my-question-title">{{ mainIndex + 1 }}. otázka</label>
                        </v-card-title>
                        <v-row class="ma-4">
                            <v-col cols="12" sm="12" class="mt-n9 text-center" v-if="testInfo.questions[mainIndex].id ==0 ">
                                <label class="font-italic">(otázka nebyla dosud uložena)</label>
                            </v-col>
                            <v-col cols="12" sm="2">
                                <v-sheet class="pa-2 text-center" color="blue" rounded="lg" width="70%">
                                    <label class="white--text" id="my-question-counter">{{ mainIndex + 1 + '/' + testInfo.questions.length }}</label>
                                </v-sheet>
                            </v-col>
                            <v-col cols="12" sm="8" class="ml-n8 mt-2">
                                <label id="my-question-task">{{ testInfo.questions[mainIndex].content.text }}</label>
                            </v-col>
                            <v-col cols="12" sm="12" class="mb-n4">
                                <v-textarea class="mb-n4 my-2" v-model="testInfo.questions[mainIndex].content.text" label="Text" auto-grow outlined row-height="5" :rules="inputRules" hint="například: Vypočítejte:"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" class="mb-n4">
                                <span id="my-answer-description" class="ml-2 mb-n6">*Obrázek ani rovnice není povinná</span>
                            </v-col>
                            <v-col cols="12" sm="12" class="mb-n6">
                                <v-textarea class="my-2" v-model="testInfo.questions[mainIndex].content.picture" label="Obrázek" auto-grow outlined row-height="5" :rules="imgRules" hint="například: https://www.domena.cz/obrazek.jpg"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" v-if="testInfo.questions[mainIndex].content.picture">
                                <v-card class="text-center" outlined color="transparent">
                                    <img :src="testInfo.questions[mainIndex].content.picture" width="50%">
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-textarea class="mb-n4 my-2" v-model="testInfo.questions[mainIndex].content.equation" label="Rovnice nebo číslo" hint="například: $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}=$$" auto-grow outlined row-height="5"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-btn small class="font-weight-bold" :color="testInfo.questions[mainIndex].content.equation == '' ? 'warning' : 'error'" 
                                    @click="testInfo.questions[mainIndex].content.equation == '' ? 
                                        testInfo.questions[mainIndex].content.equation = exampleEquation : 
                                        testInfo.questions[mainIndex].content.equation = ''">{{ testInfo.questions[mainIndex].content.equation == '' ? 'generovat' : 'smazat' }}
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="12" v-if="testInfo.questions[mainIndex].content.equation != ''">
                                <v-card class="text-center" outlined color="transparent">
                                    <vue-mathjax id="my-question-equation" :formula="testInfo.questions[mainIndex].content.equation"></vue-mathjax>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="12" class="text-center">
                                <v-btn small class="font-weight-bold white--text" color="success" @click="addAnswer">přidat odpověď<v-icon small class="ml-2">mdi-plus-thick</v-icon></v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                    <!-------      formulář pro odpověď    ----------->
                    <v-card class="mt-5 ma-2" outlined color="transparent">
                        <div class="mb-6" v-for="(answer, index) in testInfo.questions[mainIndex].answers" :key="index">
                            <v-sheet class="pb-3" color="blue lighten-3" rounded="lg" min-width="100%" min-height="10vh">
                                <v-row class="ma-2">
                                    <v-col cols="12" sm="4">
                                        <label id="my-answer-label">{{index + 1}}. Odpověď</label>
                                    </v-col>
                                    <v-col cols="12" sm="4" class="text-center">
                                        <v-btn :color="answer.true ? 'success' : 'error'" class="white--text mr-4 font-weight-bold" @click="answer.true = !answer.true">{{answer.true ? 'pravdivá' : 'nepravdivá'}}</v-btn>
                                    </v-col>
                                    <v-col cols="12" sm="4" class="text-right">
                                        <v-btn color="error" class="white--text font-weight-bold" @click="deleteAnswer(index, answer.id)">smazat</v-btn>
                                    </v-col>
                                    <v-col cols="12" sm="12" class="mb-n4">
                                        <v-textarea class="mb-n4 my-2" v-model="answer.content.text" label="text" auto-grow outlined row-height="5" hint="například: Výsledek je:" :rules="inputRules"></v-textarea>
                                    </v-col>
                                    
                                        <v-col cols="12" sm="12" class="mb-n4">
                                            <span id="my-answer-description" class="ml-2 mb-n6">*Obrázek ani rovnice není povinná</span>
                                        </v-col>
                                        <v-col cols="12" sm="12">
                                            <v-textarea class="mb-n4 my-2" v-model="answer.content.picture" label="obrázek" auto-grow outlined row-height="5" :rules="imgRules" hint="například: https://www.domena.cz/obrazek.jpg" @error="imgNotFound(answer.content.picture)"></v-textarea>
                                        </v-col>
                                        <v-col cols="12" sm="12" v-if="answer.content.picture != ''">
                                            <v-card class="text-center" outlined color="transparent">
                                                <img :src="answer.content.picture" width="50%">
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" sm="12" class="mb-n4">
                                            <v-textarea class="mb-n4 my-2" v-model="answer.content.equation" label="Rovnice nebo číslo" hint="například: $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}=$$" auto-grow outlined row-height="5"></v-textarea>
                                        </v-col>
                                        <v-col cols="12" sm="12">
                                            <v-btn small class="font-weight-bold" :color="answer.content.equation == '' ? 'warning' : 'error'" 
                                                @click="answer.content.equation == '' ? 
                                                answer.content.equation = exampleEquation : 
                                                answer.content.equation = ''">{{ answer.content.equation == '' ? 'generovat' : 'smazat' }}
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="12" sm="12" v-if="answer.content.equation != ''">
                                            <v-card class="text-center" outlined color="transparent">
                                                <vue-mathjax id="my-question-equation" :formula="answer.content.equation"></vue-mathjax>
                                            </v-card>
                                        </v-col>
                                   
                                    <v-col cols="12" sm="12">
                                        <div class="text-center">
                                            <v-btn small class="font-weight-bold white--text" :color="answer.explanation != null ? 'error' : 'success'" @click="answer.explanation != null ? deleteExplanation(index, answer.explanation.id) : addExplanation(index)">{{ answer.explanation != null ? 'odstranit vysvětlení' : 'přidat vysvětlení'}}</v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-sheet>
                            <!-------      formulář pro vysvětlení    ----------->
                            <v-card class="ma-14 mt-n1 pb-3" v-if="answer.explanation != null" outlined color="transparent">
                                <v-sheet color="grey lighten-3" rounded="lg" width="100%" min-height="10vh">
                                <v-row class="ma-2">
                                    <v-col cols="12" sm="9" class="mb-n4">
                                        <label id="my-answer-label">Vysvětlení</label>
                                    </v-col>
                                    <v-col cols="12" sm="12" class="mb-n4">
                                        <v-textarea class="mb-n4 my-2" v-model="answer.explanation.content.text" label="text" auto-grow outlined row-height="5" hint="vysvětlení odpovědi" :rules="inputRules"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" sm="12" class="mb-n4">
                                        <span id="my-answer-description" class="ml-2 mt-5">*Obrázek ani rovnice není povinná</span>
                                    </v-col>
                                    <v-col cols="12" sm="12" class="mb-n4">
                                        <v-textarea class="mb-n4 my-2" v-model="answer.explanation.content.picture" label="obrázek" auto-grow outlined row-height="5" :rules="imgRules" hint="například: https://www.domena.cz/obrazek.jpg"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" sm="12" v-if="answer.explanation.content.picture != ''">
                                        <v-card class="text-center" outlined color="transparent">
                                            <img :src="answer.explanation.content.picture" width="50%">
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                        <v-textarea class="mb-n4 my-2" v-model="answer.explanation.content.equation" label="Rovnice nebo číslo" hint="například: $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}=$$" auto-grow outlined row-height="5"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                        <v-btn small class="font-weight-bold" :color="answer.explanation.content.equation == '' ? 'warning' : 'error'" 
                                            @click="answer.explanation.content.equation == '' ? 
                                            answer.explanation.content.equation = exampleEquation : 
                                            answer.explanation.content.equation = ''">{{ answer.explanation.content.equation == '' ? 'generovat' : 'smazat' }}
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="12" sm="12" v-if="answer.explanation.content.equation != ''">
                                        <v-card class="text-center" outlined color="transparent">
                                            <vue-mathjax id="my-question-equation" :formula="answer.explanation.content.equation"></vue-mathjax>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                </v-sheet>
                            </v-card>
                        </div>
                    </v-card>
                    <div class="text-center">
                        <v-btn :disabled='!isCorrect' id="my-update-btn" large class="font-weight-bold" color="success" @click="testInfo.questions[mainIndex].id == 0 ? setDialog('createQuestion') : setDialog('updateQuestion')">{{ testInfo.questions[mainIndex].id == 0 ? 'Uložit otázku' :  'Aktualizovat otázku'}}</v-btn>
                    </div>
                </v-form>
            </div>
        </v-card>
        </v-row>

        <div v-if="dialog.isSet">
            <my-dialog :propType='dialog.type' :propTitle="dialog.title" :propText='dialog.text' @dialogResult="resultDialog"></my-dialog>
        </div>

    </div>
</template>
<script>
import DialogWindow from '../../components/DialogWindow.vue'
import {VueMathjax} from 'vue-mathjax'
/*

<v-card-title class="mb-5">
                <v-sheet class="pa-2" color="blue" rounded="lg">
                    <span class="white--text">{{ index + 1 + '/' + testInfo.questions.length }}</span>
                </v-sheet>
                    <label class="ml-3">{{ testInfo.questions[index].content.text }}</label>
            </v-card-title>

*/

export default {

    components: {
        'vue-mathjax': VueMathjax,
        'my-dialog': DialogWindow
    },
    props: {
        propTest: {default: null},
    },

    data: () => ({
        mainIndex: 0,
        testInfo: null,
        exampleEquation: '$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$',
        inputRules: [
            value => !!value || 'Jedná se o povinný údaj!',
            value => (value && value.length >= 3) || 'Musí obsahovat alespoň tři znaky!',
        ],
        isCorrect: false,

        imgRules: [
            value => (value.length == 0 || /^http.*$/.test(value)) || "Chybný odkaz na obrázek!"
        ],

        dialog: {
            isSet: false,
            type: "",
            text: "",
            title: "",
        },

        dialogItems: [
            {type: "deleteQuestion" , title:"Pozor!", text: "Opravdu si přejete smazat tuto otázku?"},
            {type: "createQuestion" , title:"Upozornění", text: "Opravdu si přejete vytvořit tuto otázku?"},
            {type: "updateQuestion" , title:"Upozornění", text: "Opravdu si přejete upravit tuto otázku?"},
        ]

    }),
    methods: {
        setDialog(type){
            if (type == 'deleteQuestion'){
                this.dialog.isSet = true;
                this.dialog.type = type;
                this.dialog.title = this.dialogItems[0].title;
                this.dialog.text = this.dialogItems[0].text;
            }
            else if (type == 'createQuestion'){
                this.dialog.isSet = true;
                this.dialog.type = type;
                this.dialog.title = this.dialogItems[1].title;
                this.dialog.text = this.dialogItems[1].text;
            }
            else if (type == 'updateQuestion'){
                this.dialog.isSet = true;
                this.dialog.type = type;
                this.dialog.title = this.dialogItems[2].title;
                this.dialog.text = this.dialogItems[2].text;
            }
        },
        test(){
            console.log("test")
        },
        processDialog(dialogResult){
            if(dialogResult.type == "deleteQuestion")
                if (dialogResult.result == true)
                    this.deleteQuestion();
            if(dialogResult.type == "createQuestion")
                if (dialogResult.result == true){
                    this.sendData();
                }
            if(dialogResult.type == "updateQuestion")
                if (dialogResult.result == true){
                    this.sendData();
                }            
        
        },
        resultDialog(result, type){
            
            let dialogResult = {
                result: result,
                type: type,
            }

            this.dialog.isSet = false;
            this.dialog.type = "";
            this.dialog.title = "";
            this.dialog.text = "";

            this.processDialog(dialogResult);
        },
        async sendData(){
            let question = this.testInfo.questions[this.mainIndex];

            if(question.id == 0){
                const id_question = await this.createQuestion();
                this.createAnswers(id_question);
            } else {
                this.updateQuestion();
                //this.createAnswers(question.id);
            }

            this.scrollToContent('my-question-title');
        },
        async createQuestion(){
            let question = this.testInfo.questions[this.mainIndex];
            try {
                const response = await this.$http.post(`/test/question/add`, {text: question.content.text, picture: question.content.picture, equation: question.content.equation, id_test: this.testInfo.id});
                
                return response.data.id;
            } catch(e){
                const statusCode = e.response.status;

                console.log(statusCode)
            }
        },
        async updateQuestion(){
            let question = this.testInfo.questions[this.mainIndex];
            try {
                const response = await this.$http.post("/test/question/update", {
                    id_question: question.id,
                    text: question.content.text,
                    picture: question.content.picture,
                    equation: question.content.equation,
                    });

                this.testInfo.questions[this.mainIndex].content = response.data.content;

            } catch(e){
                const statusCode = e.response.status;
          
                if (statusCode == 401){
                this.$emit("logoutUser");
                }
            }
        },
        prepareAnswers(){
            let answers = [];

            let item;

            console.log(this.testInfo.questions[this.mainIndex].answers);

            this.testInfo.questions[this.mainIndex].answers.forEach((answer) => {
                item = {
                    correct: answer.true,
                    text: answer.content.text,
                    picture: answer.content.picture,
                    equation: answer.content.equation,
                    hasExplain: answer.explanation == null ? false : true,
                    explain: answer.explanation == null ? null : answer.explanation.content,

                },
                answers.push(item);
            });

            console.log(answers)

            return answers;
        },
        async createAnswers(id_question){
            let answers = this.prepareAnswers();

            try {
                await this.$http.post(`/test/question/answer/add/list`, {id_question: id_question, answers: answers});
                
                this.reloadTestInfo(this.testInfo.id);
            } catch(e){
                const statusCode = e.response.status;

                console.log(statusCode)
            }
        },
        async deleteQuestion(){
            const question = this.testInfo.questions[this.mainIndex];

            if(question.id != 0){
                try{
                    await this.$http.delete(`/test/question/delete/by/id/${question.id}`);
                    this.reloadTestInfo(this.testInfo.id)
                } catch(e){
                    console.log(e);
                }
            }

            this.testInfo.questions.splice(this.mainIndex, 1);
            this.mainIndex = 0;
        },
        deleteAnswer(index, id){
            console.log(id);
            this.testInfo.questions[this.mainIndex].answers.splice(index, 1);
        },
        deleteExplanation(index, id){
            this.testInfo.questions[this.mainIndex].answers[index].explanation = null;
            console.log(id);
        },
        addExplanation(index){
            let explanation = {
                content: {
                    text: "",
                    picture: "",
                    equation: "",
                },
                addMedia: false,
            }           
            this.testInfo.questions[this.mainIndex].answers[index].explanation = explanation;
        },
        addAnswer(){
            let answer = {
                id: 0,
                explanation: null,
                true: false,
                content: {
                    text: "",
                    picture: "",
                    equation: "",
                },
                addMedia: false,
            }           
            this.testInfo.questions[this.mainIndex].answers.push(answer)

            this.scrollToContent('my-update-btn');
        },
        addQuestion(){
            let question = {
                id: 0,
                seqence: this.testInfo.questions.length+1,
                answers: [],
                content: {
                    text: "",
                    picture: "",
                    equation: ""
                },
                addMedia: false,
            }           
            this.testInfo.questions.push(question);
            this.mainIndex = this.testInfo.questions.length -1;

            this.scrollToContent('my-update-btn');
        },
        async reloadTestInfo(id){
            try{
                const response = await this.$http.get(`/test/by/id/${id}`);
                this.testInfo = response.data;
            } catch (e) {
                const status = e.response.status;
              if (status == 401)
                this.$emit("logoutUser"); 
            }
        },
        scrollToContent(id) {
          setTimeout(() => {
            const element = document.getElementById(id);
            element.scrollIntoView({behavior: "smooth", block: "start"});   
          }, 300); 
        }
    },
    mounted() {
        this.testInfo = this.propTest;

        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML')
        document.head.appendChild(recaptchaScript)
    },
  }
</script>
<style>
#my-question-title{
    font-size: 2.5vw;
    font-weight: bold;
    margin: auto;
}

#my-question-counter{
    font-size: 1.5vw;
    font-weight: bold;
}

#my-question-task{
    font-size: 1.5vw;
    font-weight: bold;
}

#my-question-equation{
    font-size: 2vw;
    font-weight: bold;
}

#my-equation{
    font-size: 2.5vw;
    font-weight: bold;
}

#my-answer-label{
    font-size: 1.5vw;
    font-weight: bold;
}

#my-answer-description{
    font-size: 1vw;
    font-style: italic;
}




</style>