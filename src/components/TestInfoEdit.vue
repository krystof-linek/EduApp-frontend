<template>
    
    <v-card v-if="testInfo != null" color="transparent" outlined>
        <v-alert class="mt-5 ma-5" v-if="isAlert" border="left" close-text="Close Alert" color="rgba(0, 123, 255)" dark dismissible>
          {{alertMessage}}
        </v-alert>
            <v-form v-model="formIsCorrect">
                <v-row class="justify-center">
                    <v-col cols="10" sm="10" class="mt-6 text-center">
                        <label class="text-h4">Základní informace</label>
                        <v-divider></v-divider>
                    </v-col>
                    <v-col cols="10" sm="10" class="mt-2">
                        <label id="my-test-info-label">Název testu</label>
                        <v-text-field v-model="testInfo.title" :rules="rulesTitle"></v-text-field>
                    </v-col>
                    <v-col cols="10" sm="10" class="mt-n5">
                        <label id="my-test-info-label">Ročník</label>
                        <v-select v-model="grade" :items="grades" item-text="grade" item-value="value" :rules="[(value) => !!value || 'Musíte zvolit ročník']"></v-select>
                    </v-col>
                    <v-col cols="10" sm="10" class="mt-n5" v-if="grade != 0 && subjects.length != 0">
                        <label id="my-test-info-label">Předmět</label>
                        <v-select v-model='id_subject' :items="subjects" item-text="title" item-value="idSubject" :rules="[(value) => !!value || 'Musíte zvolit předmět']" required></v-select>
                    </v-col>
                    <v-col cols="10" sm="10" class="mt-n5">
                        <label id="my-test-info-label">Přístup</label>
                        <v-switch v-model='isOpen' color="success" inset :label="isOpen ? 'Všichni' : 'Pouze ročník'"></v-switch>
                    </v-col>
                    <v-col cols="10" sm="10" class="mt-n5">
                        <label id="my-test-info-label">Zveřejnit</label>
                        <v-switch v-model='isActive' color="success" inset :label="isActive ? 'ANO' : 'NE'" :rules="[(value) => value == false || (value == true && testInfo.questions.length != 0) || 'Nemůžete zveřejnit test, který neobsahuje žádnou otázku!']"></v-switch>
                    </v-col>
                    <v-col cols="10" sm="10" class="mt-n5 text-center">
                        <v-btn :disabled='!formIsCorrect || subjects.length == 0' @click="setDialog('updateTest')" class="font-weight-bold" color="success">Aktualizovat informace</v-btn>
                    </v-col>
                </v-row>
             </v-form>

        <div v-if="dialog.isSet">
            <my-dialog :propType='dialog.type' :propTitle="dialog.title" :propText='dialog.text' @dialogResult="resultDialog"></my-dialog>
        </div>

    </v-card>
   
</template>
<script>
import DialogWindow from '../components/DialogWindow.vue'

export default {

    components: {
        'my-dialog': DialogWindow
    },
    props: {
        propTest: {default: null},
    },

    data: () => ({
        testInfo: null,

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

        id_subject: 0,
        subjects: [],

        isActive: false,

        isOpen: false,

        alertMessages: ["K tomuto ročníku dosud nebyli přiřazeny žádné!"],

        alertMessage: "",
        isAlert: false,

        rulesTitle: [
          value => !!value || 'Název je povinný údaj!',
          value => (value && value.length >= 5) || 'Název musí mít délku, alespoň pět znaků!',
        ],

        dialog: {
            isSet: false,
            type: "",
            text: "",
            title: "",
        },

        formIsCorrect: false,

        dialogItems: [
            {type: "updateTest" , title:"Upozornění", text: "Opravdu si přejete aktualizovat informace?"},
        ]
    }),
    watch: {
        grade(){
            this.isAlert = false;
            this.loadAllSubjectsByGrade()
            if (this.grade != this.testInfo.subject.grade)
                this.id_subject = 0;
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
        async updateTestInfo(){
            try {
                const response = await this.$http.post("/test/update/info", {title: this.testInfo.title, id_subject: this.id_subject, id_test: this.testInfo.id, active: this.isActive ,open: this.isOpen});

                if(this.isActive == true)
                    this.testInfo.active = true;
                else
                    this.testInfo = response.data;
            } catch(e){
                const statusCode = e.response.status;
          
                if (statusCode == 401){
                    this.$emit("logoutUser");
                }
            }
        },
        initData(){
            if(this.testInfo != null){
                this.grade = this.testInfo.subject.grade;
                this.id_subject = this.testInfo.subject.idSubject;
                this.isActive = this.testInfo.active;
                this.isOpen = this.testInfo.open;

                this.loadAllSubjectsByGrade();
            }
        },
        setDialog(type){
            if (type == 'updateTest'){
                this.dialog.isSet = true;
                this.dialog.type = type;
                this.dialog.title = this.dialogItems[0].title;
                this.dialog.text = this.dialogItems[0].text;
            }
        },
        processDialog(dialogResult){
            if(dialogResult.type == "updateTest")
                if (dialogResult.result == true)
                    this.updateTestInfo();
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
    },
    mounted() {
        this.testInfo = this.propTest;
        this.initData();
    },
  }
</script>

<style>
#my-test-info-label{
    font-size: 1.5vw;
}
</style>