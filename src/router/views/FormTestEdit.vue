<template>
    <v-card rounded="lg" elevation="5">

    <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6">
      <label :id="'my-window-title-' + $vuetify.breakpoint.name">Editace testů</label>
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
                
                <v-card class="pa-3 mx-2 pb-5" outlined color="transparent" rounded="lg">
                  
                  <v-row align="center" class="pa-0 mt-5">
                    
                    <v-col cols="9" xl="10" class="pa-0">
                        <v-text-field :disabled="tests.length == 0" class="mx-2" solo v-model="search" outlined hide-details prepend-inner-icon="mdi-magnify" label="Vyhledat"></v-text-field>
                    </v-col>

                    <v-spacer></v-spacer>

                    <v-col cols="3" xl="2" class="pa-0 text-center">
                        <v-btn large class="font-weight-bold" color="success" @click="$router.push({ name: 'newTest' });">Nový test<v-icon class="ml-2">mdi-plus-thick</v-icon></v-btn>
                    </v-col>
                  </v-row>

                </v-card>

                 <v-data-table v-if="tests.length != 0" :headers="headers" :items="tests" hide-default-header :search="search" :items-per-page="-1"
                 :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'mdi-arrow-collapse-left',
                    lastIcon: 'mdi-arrow-collapse-right',
                    prevIcon: 'mdi-minus',
                    nextIcon: 'mdi-plus',
                    'items-per-page-text':'počet položek na stránce',
                    'items-per-page-options': [5, 10, 15, 20, -1],
                    'items-per-page-all-text': 'Všechny',
                    'page-text': '{0}-{1} z {2}'
                }">

                   <template v-slot:header>
                    <thead class="v-data-table-header">
                      <tr>
                        <th class="text-uppercase">Název testu</th>
                        <th class="text-uppercase">Předmět</th>
                        <th class="text-uppercase text-center">Ročník</th>
                        <th class="text-uppercase text-center">Vytvořen</th>
                        <th class="text-uppercase text-center">Aktivní</th>
                        <th class="text-uppercase text-center">Akce</th>
                     </tr>
                    </thead>
                  </template>
                   
                  <template v-slot:item="row">
                    <tr>
                      <td>{{row.item.title}}</td>
                      <td>{{row.item.subject.title}}</td>
                      <td class="text-center">{{row.item.subject.grade}}</td>
                      <td class="text-center">{{row.item.created}}</td>
                      <td class="text-center">
                        <v-icon v-if="row.item.active" @click="idTest = row.item.id; dialog.isSet = true; dialog.type = 'deactivateTest'" color="success" x-large>mdi-check-bold</v-icon>
                        <v-icon v-else color="error" @click="idTest = row.item.id; dialog.isSet = true; dialog.type = 'activateTest'" x-large>mdi-close-thick</v-icon>
                      </td>
                      <td class="text-center">
                        <v-btn class="mx-2" fab dark small color="blue" @click="loadTestInfo(row.item.id)">
                            <v-icon dark>mdi-file-edit</v-icon>
                        </v-btn>
                        <v-btn class="mx-2" fab dark small color="red" @click="idTest = row.item.id; dialog.isSet = true; dialog.type = 'deleteTest'">
                            <v-icon dark>mdi-trash-can</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>

                </v-data-table>
              </v-card>
             
        <!-- Vykresli stavajici obsah -->

              <v-card class="my-2 pb-2" v-if="n==2 && testInfo != null" outlined color="transparent">
                  
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
                      <test-info-edit :propTest='testInfo'></test-info-edit>
                      <test-question-edit :propTest='testInfo'></test-question-edit>
                    </div>
                  
              </v-card> 
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    </v-card>

    <div v-if="dialog.isSet">
        <my-dialog v-if="dialog.type == 'deactivateTest'" :propType="dialog.type" propTitle="Upozornění" propText="Opravdu si přejete skrýt test?" @dialogResult="resultDialog"></my-dialog>
        <my-dialog v-else-if="dialog.type == 'activateTest'" :propType="dialog.type" propTitle="Upozornění" propText="Opravdu si přejete zveřejnit test?" @dialogResult="resultDialog"></my-dialog>
        <my-dialog v-else-if="dialog.type == 'deleteTest'" :propType="dialog.type" propTitle="Pozor!" propText="Pokud dojde ke smazaní testu, tak jeho obsah bude nenávratně ztracen. Opravdu si přejte smazat tento test?" @dialogResult="resultDialog"></my-dialog>
    </div>

    <div v-if="dialogInfo.isSet">
        <my-dialog-explain :propTitle='dialogInfo.title' :propText='dialogInfo.text' @clickOnOk="dialogInfo.isSet = false"></my-dialog-explain>
    </div>

  </v-card>
</template>
<script>
import TestQuestionEdit from '../../components/TestQuestionEdit.vue'
import TestInfoEdit from '../../components/TestInfoEdit.vue'
import DialogWindow from '../../components/DialogWindow.vue'
import DialogExplainWindow from '../../components/DialogExplainWindow.vue'


  export default {
    components: {
      "test-question-edit": TestQuestionEdit,
      "test-info-edit": TestInfoEdit,
      "my-dialog": DialogWindow,
      "my-dialog-explain": DialogExplainWindow,
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

        dialogInfo: {
            isSet: false,
            text: "",
            title: "",
        },

        isUsed: false,

        search: '',

        headers: [
          { text: 'Název testu', align: 'start', filterable: true, value: 'title',},
          { text: 'Předmět', value: 'subject.title'},
          { text: 'Ročník', value: 'subject.grade'},
          { text: 'Vytvořen', value: 'created'},
          { text: 'Akce'},
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
    methods: {
        nextStep (n) {
            if (n === this.steps) {
                this.e1 = 1
            } else {
                this.e1 = n + 1
            }
        },
        async loadAllTests(){
            try{
                const response = await this.$http.get('/test/all/of/user');
                this.tests = response.data;

                this.prepareData();

            } catch (e) {
                const status = e.response.status;
              if (status == 401)
                this.$emit("logoutUser"); 
            }
        },
        async loadTestInfo(id){
            this.idTest = id;
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
          if(dialogResult.type == "activateTest"){
            if(dialogResult.result)
              this.activateTest()
          }
          if(dialogResult.type == "deleteTest"){
            if(dialogResult.result)
              this.deleteTest()
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
            const response = await this.$http.get(`/test/deactivate/by/id/${this.idTest}`);

            if (!response.data.active){
              this.loadAllTests();
              this.testInfo = response.data;
            }

          } catch (e) {
            const status = e.response.status;
            if (status == 401)
              this.$emit("logoutUser"); 
            else if (status == 403){
              this.$router.push({ name: 'errNotPerms', });
            }
          }
        },
        async activateTest(){
          try{
            const response = await this.$http.get(`/test/activate/by/id/${this.idTest}`);

            if (response.data.active)
              this.loadAllTests();

          } catch (e) {
            const status = e.response.status;
            if (status == 401)
              this.$emit("logoutUser"); 
            else if (status == 403){
              this.$router.push({ name: 'errNotPerms', });
            }
          }
        },
        async deleteTest(){

          try{
            const response = await this.$http.delete(`/test/delete/own/by/id/${this.idTest}`);

            if (response.status == 204)
              this.loadAllTests();

          } catch (e) {
            const status = e.response.status;
            if (status == 401)
              this.$emit("logoutUser"); 
            else if (status == 403){
              this.$router.push({ name: 'errNotPerms', });
            }
            else if (status == 409){
              this.dialogInfo.title = 'Upozornění!'
              this.dialogInfo.text = "Tento test již nelze vymazat, jelikož k němu již existují vyplněné záznamy od studentů."
              this.dialogInfo.isSet = true;
            }
          }
        },
        prepareData(){
          this.tests.forEach((test) => {
            test.created = this.getDate(test.created);
            test.icon 
            test.subject.title = test.subject.title.charAt(0).toUpperCase() + test.subject.title.slice(1)
            if(test.title.length > 40){
              test.title = test.title.substring(0,40);
              test.title += '...';
            }
          });
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