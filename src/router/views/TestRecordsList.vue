<template>
    <v-card class="pa-lg-n7" elevation="5" rounded="lg">

        <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6">
            <label :id="'my-window-title-' + $vuetify.breakpoint.name">Výsledky testů</label>
        </v-card-title>

        <v-divider></v-divider>

        <v-card class="mx-5 mt-5" color="transparent" outlined>

            <!-- Zobrazení pro studenta -->

            <div v-if="isReady && user.role == 'STUDENT'">
        
            <v-text-field class="mx-2" solo v-model="search" outlined hide-details prepend-inner-icon="mdi-magnify" label="Vyhledat"></v-text-field>

                <v-data-table :headers="headers" :items="records" hide-default-header :search="search" :items-per-page="-1"
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

                <template slot="no-data">
                    Dosud jste nevypracovali žádný test.
                </template>

                    <template v-slot:header>
                    <thead class="v-data-table-header">
                        <tr>
                            <th class="text-uppercase">Předmět</th>
                            <th class="text-uppercase">Název</th>
                            <th class="text-uppercase text-center">Odevzdán</th>
                            <th class="text-uppercase text-center">Úspešnost</th>
                        </tr>
                    </thead>
                    </template>
                            
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.subject_name}}</td>
                        <td>{{row.item.test_name}}</td>
                        <td :class="row.item.ended == null ? 'text-center font-weight-bold red--text' : 'text-center'">{{ row.item.ended == null ? 'neodevzdán' : getDate(row.item.ended)}}</td>
                        <td class="text-center">{{row.item.successRate}}</td>
                        
                        <td class="text-center">
                        <v-btn class="mx-2" fab dark small color="blue" @click="$router.push({name: 'testRecord', params: { id_record: row.item.id_record}});">
                            <v-icon dark>mdi-note-search</v-icon>
                        </v-btn>
                        </td>
                    </tr>
                    </template>

                </v-data-table>

            </div>

            <!-- Zobrazení pro rodiče -->

            <div v-if="isReady && user.role == 'PARENT'">
        
            <v-toolbar class="mx-1" rounded="lg">

                <v-col cols="8" class="pa-0 ml-n2 mr-3">
                    <v-text-field solo v-model="search" outlined hide-details prepend-inner-icon="mdi-magnify" label="Vyhledat"></v-text-field>
                </v-col>
                
                <v-col cols="4" class="pa-0">
                    <v-select hide-details="auto" color="blue" outlined :disabled="kids.length == 0" v-model="kid" :items="kids" item-text="name" :label=" kid == null ? 'Vyberte dítě' : 'Student'" return-object></v-select>
                </v-col>
          
            </v-toolbar>

                <v-data-table v-if="!isLoading" :headers="headers" :items="records" hide-default-header :search="search" :items-per-page="-1"
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
                            <th class="text-uppercase">Předmět</th>
                            <th class="text-uppercase">Název</th>
                            <th class="text-uppercase text-center">Odevzdán</th>
                            <th class="text-uppercase text-center">Úspešnost</th>
                        </tr>
                    </thead>
                    </template>
                            
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.subject_name}}</td>
                        <td>{{row.item.test_name}}</td>
                        <td :class="row.item.ended == null ? 'text-center font-weight-bold red--text' : 'text-center'">{{ row.item.ended == null ? 'neodevzdán' : getDate(row.item.ended)}}</td>
                        <td class="text-center">{{row.item.successRate}}</td>
                        
                        <td class="text-center">
                        <v-btn class="mx-2" fab dark small color="blue" @click="$router.push({name: 'testRecord', params: { id_record: row.item.id_record}});">
                            <v-icon dark>mdi-note-search</v-icon>
                        </v-btn>
                        </td>
                    </tr>
                    </template>

                </v-data-table>

                <div v-else>
                    <v-sheet color="lighten-4" class="pa-3">
                        <v-skeleton-loader class="mx-auto" type="article"></v-skeleton-loader>

                        <v-skeleton-loader id="pic-center" type="card" width="90%"></v-skeleton-loader>

                        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
                    </v-sheet>
                </div>

            </div>

            <!-- Zobrazení pro učitele -->

            <div v-if="isReady && user.role == 'TEACHER'">
        
                <v-card class="pa-3 mx-2 pb-10" outlined color="transparent" rounded="lg">

                    <v-card-title class="text-h3 pa-0 ml-0 mb-10">Vyplňte prosím následujícíc informace</v-card-title>

                    <v-row align="center" class="pa-0">

                        <v-col cols="4" class="pa-0 mr-2">
                            <v-select hide-details="auto" color="blue" outlined :disabled="subjects.length == 0" v-model="id_subject" :items="subjects" item-value="idSubject" item-text="title" :label=" id_subject <= 0 ? 'Vyberte předmět' : 'Vybraný předmět'"></v-select>
                        </v-col>

                        <v-spacer></v-spacer>

                        <v-col cols="7" class="pa-0">
                            <v-select hide-details="auto" color="blue" outlined :disabled="tests.length == 0" v-model="id_test" :items="tests" item-value="id_test" item-text="title" :label="id_subject <= 0 ? 'Nejdříve vyberte předmět' : id_test <= 0 ? 'Vyberte test' : 'Vybraný test'"></v-select>
                        </v-col>

                    </v-row>
            
                </v-card>

                <div v-if="isSet">

                    <v-text-field class="mx-2" solo v-model="search" outlined hide-details prepend-inner-icon="mdi-magnify" label="Vyhledat"></v-text-field>
                   
                    <v-data-table v-if="!isLoading" :headers="headersTeacher" :items="records" hide-default-header :search="search" :items-per-page="-1"
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
                                <th class="text-uppercase">Jméno studenta</th>
                                <th class="text-uppercase">Třída</th>
                                <th class="text-uppercase text-center">Odevzdán</th>
                                <th class="text-uppercase text-center">Úspešnost</th>
                            </tr>
                        </thead>
                        </template>
                                
                        <template v-slot:item="row">
                        <tr>
                            <td>{{row.item.user_name}}</td>
                            <td>{{row.item.classRoom}}</td>
                            <td :class="row.item.ended == null ? 'text-center font-weight-bold red--text' : 'text-center'">{{ row.item.ended == null ? 'neodevzdán' : getDate(row.item.ended)}}</td>
                            <td class="text-center">{{row.item.successRate}}</td>
                            
                            <td class="text-center">
                            <v-btn class="mx-2" fab dark small color="blue" @click="$router.push({name: 'testRecord', params: { id_record: row.item.id_record}});">
                                <v-icon dark>mdi-note-search</v-icon>
                            </v-btn>
                            </td>
                        </tr>
                        </template>

                    </v-data-table>

                    <div v-if="isLoading">
                        <v-sheet color="lighten-4" class="pa-3">
                            <v-skeleton-loader class="mx-auto" type="article"></v-skeleton-loader>

                            <v-skeleton-loader id="pic-center" type="card" width="90%"></v-skeleton-loader>

                            <v-skeleton-loader type="paragraph"></v-skeleton-loader>
                        </v-sheet>
                    </div>

                </div>

            </div>

            <!-- nacita se -->

            <div v-if="!isReady">
                <v-sheet color="lighten-4" class="pa-3">
                    <v-skeleton-loader class="mx-auto" type="article"></v-skeleton-loader>

                    <v-skeleton-loader id="pic-center" type="card" width="90%"></v-skeleton-loader>

                    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
                </v-sheet>
            </div>

        </v-card>
    </v-card>
</template>
<script>
  export default {
    data () {
      return {
        isReady: false,
        isLoading: false,

        search: "",

        records: [],

        user: null,

        //for parent

        kids: [],
        kid: null,

        //for teacher

        id_subject: -1,
        subjects: [],
        
        id_test: -1,
        tests: [],
        
        isSet: false,

        headersTeacher: [
          { align: 'start', filterable: true, value: 'user_name',},
          { filterable: true, value: 'classRoom'},
        ],

        headers: [
          { align: 'start', filterable: true, value: 'subject_name',},
          { filterable: true, value: 'test_name'},
        ],

      }
    },
    watch:{
        kid(val){
            if (val != null){
                this.isLoading = true;
                this.childRecord();
            }
        },
        id_subject(val){
            if (val > 0){
                this.loadAllTestsBySubjectId();
            }
        },
        id_test(val){
            if (val > 0){
                this.isSet = true;
                this.isLoading = true;
                this.recordsAsTeacher();
            }
        },
    },
    methods: {
        async initRoute(){

            await this.loadUserInfo();

            if (this.user != null){
                if(this.user.role == "STUDENT")
                    this.recordsAsStudent();
            }

            if (this.user != null){
                if(this.user.role == "PARENT")
                    this.recordsAsParent();
            }

            if (this.user != null){
                if(this.user.role == "TEACHER"){
                    this.loadAllSubjects();  
                    this.isReady = true;
                }
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
        async recordsAsStudent(){
            try{
                const response = await this.$http.get(`/test/record/get/all/my/records`);
                
                this.records = response.data;

                this.isReady = true;

            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                    this.$emit("logoutUser"); 
            }
        },
        async recordsAsParent(){
            try{
                const response = await this.$http.get(`/user/get/own/kids/by/parent/id/${this.user.id}`);
                
                this.kids = response.data;

                if (this.kids.length != 0)
                    this.kid = this.kids[0],

                this.isReady = true;

            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                    this.$emit("logoutUser"); 
            }
        },
        async childRecord(){
            try{
                const response = await this.$http.get(`/test/record/get/all/of/my/child/${this.kid.id}`);
                
                this.records = response.data;

                this.isLoading = false;

            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                    this.$emit("logoutUser"); 
            }
        },
        //for teacher
        async loadAllSubjects(){
            try{
                const response = await this.$http.get(`/test/all/my/subjects`);
                
                this.subjects = response.data;

            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                    this.$emit("logoutUser"); 
            }
        },
        async loadAllTestsBySubjectId(){
            try{
                const response = await this.$http.get(`/test/all/my/by/subject/${this.id_subject}`);
                
                this.tests = response.data;

            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                    this.$emit("logoutUser"); 
            }
        },
        async recordsAsTeacher(){
            try{
                const response = await this.$http.get(`/test/record/get/all/of/my/test/${this.id_test}`);
                
                this.records = response.data;

                this.isLoading = false;

            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                    this.$emit("logoutUser"); 
            }
        },
        getDate(date){
            let array = date.split('T');

            date = array[0];

            let time = array[1];

            array = date.split('-');

            date = array[2] + '.' + array[1] + '.' + array[0];

            array = time.split('.')

            date += ' ' + array[0];

            return date;
        },
    },
    mounted(){
        this.initRoute();
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