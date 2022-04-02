<template>
    <v-card outlined color="transparent">

    <v-card-title class="justify-center pt-8">
      <h1>Úprava testu</h1>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Stepper pro editaci testu -->

    <v-card outlined color="transparent" style='margin: auto'>
    <v-stepper v-model="e1" rounded="lg" color="primary">
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
        <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n">
          <v-card outlined color="transparent" class="mt-n5">
              <v-card v-if="n==1" outlined color="transparent">
                <v-card-title>
                  <v-text-field v-model="search" append-icon="mdi-magnify" label="Vyhledat test" hide-details id="my-search" single-line>

                  </v-text-field>
                </v-card-title>
                <v-data-table :headers="headers" :items="tests" :search="search" @click:row="handleClick" id="my-table" :items-per-page="-1"
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
                }"
                >
                    
                </v-data-table>
              </v-card>
             
        <!-- Vykresli stavajici obsah -->

              <v-card class="ma-8 my-2 pb-2" v-if="n==2 && testInfo != null" outlined color="transparent">
                  <div class="ma-8">
                    <div v-if="testInfo.active == true">

                      <v-row class="justify-center">
                        <v-card width="50%" elevation="5" class="pb-3">
                          <v-col cols="12" sm="12" class="text-center">
                            <label class="text-h6">Test nelze upravit</label>
                            <v-divider></v-divider>
                          </v-col>

                          <div v-if="isUsed">
                            Vytvorit kopii
                          </div>

                          <div v-else>
                            <v-col cols="12" sm="12" class="text-center">
                              <label class="text-body-1">Editovat test lze pouze pokud není aktivní. </label>
                            </v-col>
                            <v-col cols="12" sm="12" class="text-center">
                              <v-btn class="font-weight-bold" color="error" @click="dialog.isSet = true; dialog.type = 'deactivateTest'">Deaktivovat</v-btn>
                            </v-col>
                          </div>

                        </v-card>
                      </v-row>

                    </div>
                    <div v-else>
                      <v-row class="justify-center">
                        <v-card class="pt-5" width="100%" rounded="lg" elevation="5">
                          <test-info-edit :propTest='testInfo'></test-info-edit>
                          <test-question-edit :propTest='testInfo'></test-question-edit>
                        </v-card>
                      </v-row>
                    </div>
                  </div>
              </v-card> 
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    </v-card>

    <div v-if="dialog.isSet">
        <my-dialog v-if="dialog.type = 'deactivateTest'" :propType="dialog.type" propTitle="Pozor!" propText="Opravdu si přejete zamezit přístup ostatním uživatelům k testu?" @dialogResult="resultDialog"></my-dialog>
    </div>

  </v-card>
</template>
<script>
import TestQuestionEdit from '../../../components/test/TestQuestionEdit.vue'
import TestInfoEdit from '../../../components/test/TestInfoEdit.vue'
import DialogWindow from '../../../components/DialogWindow.vue'


  export default {
    components: {
      "test-question-edit": TestQuestionEdit,
      "test-info-edit": TestInfoEdit,
      "my-dialog": DialogWindow,
    },
    props: {
        user: {default: null},
        propTest: {default: null},
    },
    data () {
      return {
        e1: 1,
        steps: 2,
        vyber: ["Výběr testu", "Editace testu"],
        isAlert: false,
        alertMessage: '',

        dialog: {
            isSet: false,
            type: ""
        },

        isUsed: false,

        search: '',

        headers: [
          { text: 'Název testu', align: 'start', filterable: true, value: 'title',},
          { text: 'Předmět', value: 'subject.title'},
          { text: 'Ročník', value: 'subject.grade'},
          { text: 'Vytvořen', value: 'created'},
        ],

        tests:[],

        idTest: -1,
        testTitle: "",

        testInfo: null,

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
    },
    methods: {
        nextStep (n) {
            if (n === this.steps) {
                this.e1 = 1
            } else {
                this.e1 = n + 1
            }
        },
        handleClick(value) {
            this.isAlert = false;
            this.idTest = value.id;
            this.testTitle = value.title;
            this.loadTestInfo(this.idTest);
        },
        async loadAllTests(){
            try{
                const response = await this.$http.get('/test/all/of/user');
                this.tests = response.data;
            } catch (e) {
                const status = e.response.status;
              if (status == 401)
                this.$emit("logoutUser"); 
            }
        },
        async loadTestInfo(id){
            try{
                const response = await this.$http.get(`/test/by/id/${id}`);
                this.testInfo = response.data;
                this.nextStep(1);
            } catch (e) {
                const status = e.response.status;
              if (status == 401)
                this.$emit("logoutUser"); 
            }
        },
        setTest(){
          this.testInfo = this.propTest;
          this.idTest = this.testInfo.id;
          this.testTitle = this.testInfo.title;
          this.nextStep(1);
        },
        processDialog(dialogResult){
          if(dialogResult.type == "deactivateTest"){
            if(dialogResult.result)
              this.deactivateTest()
          }
          this.dialog.isSet = false;
          this.dialog.type = "";
        
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
        async deactivateTest(){
          try{
            const response = await this.$http.get(`/test/deactivate/by/id/${this.testInfo.id}`);
            this.testInfo = response.data;
          } catch (e) {
            const status = e.response.status;
            if (status == 401)
              this.$emit("logoutUser"); 
            else if (status == 403){
              this.$router.push({ name: 'errNotPerms', });
            }
          }
        },
    },
    mounted(){
      this.propTest != null ? this.setTest() : this.loadAllTests();
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