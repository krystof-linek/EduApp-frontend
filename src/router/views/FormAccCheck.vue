<template>
    <v-card class="pa-lg-n7" elevation="5" rounded="lg">

        <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6">
            <label :id="'my-window-title-' + $vuetify.breakpoint.name">Správa rodičovských účtů</label>
        </v-card-title>

        <v-divider></v-divider>

        <v-card class="mx-5 mt-5" color="transparent" outlined>
            
            <v-text-field :disabled="accounts.length == 0" class="mx-2" solo v-model="search" outlined hide-details prepend-inner-icon="mdi-magnify" label="Vyhledat"></v-text-field>

            <v-data-table :headers="headers" :items="accounts" hide-default-header :search="search" :items-per-page="-1"
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
                    <th class="text-uppercase">Jméno</th>
                    <th class="text-uppercase">Příjmení</th>
                    <th class="text-uppercase text-center">Email</th>
                    <th class="text-uppercase text-center">Registrován</th>
                    <th class="text-uppercase text-center">Ověřen</th>
                    <th class="text-uppercase text-center">Akce</th>
                    </tr>
                </thead>
                </template>
                        
                <template v-slot:item="row">
                <tr>
                    <td>{{row.item.name}}</td>
                    <td>{{row.item.surname}}</td>
                    <td class="text-center">{{row.item.email}}</td>
                    <td class="text-center">{{getDate(row.item.registered)}}</td>
                    <td class="text-center">
                    <v-icon v-if="row.item.validated" @click="setDialog('deactivateAccount'); id_account = row.item.id" color="success" x-large>mdi-check-bold</v-icon>
                    <v-icon v-else color="error" @click="setDialog('activateAccount'); id_account = row.item.id" x-large>mdi-close-thick</v-icon>
                    </td>
                    <td class="text-center">
                    <v-btn class="mx-2" fab dark small color="success" @click="dialogParent.id = row.item.id; dialogParent.name = row.item.name + ' ' + row.item.surname, dialogParent.isSet = true;">
                        <v-icon dark>mdi-account-plus</v-icon>
                    </v-btn>
                    </td>
                </tr>
                </template>

            </v-data-table>
                    
        
            <div v-if="dialog.isSet">
                <my-dialog :propType="dialog.type" :propTitle="dialog.title" :propText="dialog.text" @dialogResult="resultDialog"></my-dialog>
            </div>

            <div v-if="dialogParent.isSet">
                <my-dialog-parent-info :propParentId="dialogParent.id" :propParentName="dialogParent.name" @clickOnOk="dialogParent.isSet = false; dialogParent.id = 0;"></my-dialog-parent-info>
            </div>

        </v-card>
    </v-card>
</template>
<script>
import DialogWindow from '../../components/DialogWindow.vue'
import DialogParentKids from '../../components/DialogParentKids.vue'


  export default {
    components: {
      "my-dialog": DialogWindow,
      "my-dialog-parent-info": DialogParentKids,
    },
    data () {
      return {

        search: "",

        accounts: [],

        id_account: 0,

        headers: [
          { align: 'start', filterable: true, value: 'name',},
          { filterable: true, value: 'email'},
          { filterable: true, value: 'surname'},
        ],

        dialog: {
            isSet: false,
            type: "",
            text: "",
            title: "",
        },

        dialogItems: [
            {type: "deactivateAccount" , title:"Upozornění", text: "Opravdu si přejete deaktivovat tento účet?"},
            {type: "activateAccount" , title:"Upozornění", text: "Opravdu si přejete ověřit tento účet?"},
        ],

        dialogParent: {
            isSet: false,
            id: 0,
            name: '',
        },
      }
    },
    computed: {
    },
    methods: {
        async loadAllParentsAccounts(){
            try{
                const response = await this.$http.get(`/user/parents/accounts`);
                
                this.accounts = response.data;

            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                  this.$emit("logoutUser"); 
            }
        },
        async activateAccount(){
            try{
                await this.$http.get(`/user/validate/by/id/${this.id_account}`);
                
                this.loadAllParentsAccounts();

            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                  this.$emit("logoutUser"); 
            }
        },
        async deactivateAccount(){
            try{
                await this.$http.get(`/user/deactivate/by/id/${this.id_account}`);
                
                this.loadAllParentsAccounts();

            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                  this.$emit("logoutUser"); 
            }
        },
        getDate(date){
            let array = date.split('T');

            date = array[0];

            array = date.split('-');

            date = array[2] + '.' + array[1] + '.' + array[0];

            return date;
        },
        setDialog(type){
            if (type == 'deactivateAccount'){
                this.dialog.type = type;
                this.dialog.title = this.dialogItems[0].title;
                this.dialog.text = this.dialogItems[0].text;
                this.dialog.isSet = true;
            }
            if (type == 'activateAccount'){
                this.dialog.type = type;
                this.dialog.title = this.dialogItems[1].title;
                this.dialog.text = this.dialogItems[1].text;
                this.dialog.isSet = true;
            }
        },
        processDialog(dialogResult){
            if(dialogResult.type == "deactivateAccount")
                if (dialogResult.result == true){
                    this.deactivateAccount();
                }
            if(dialogResult.type == "activateAccount")
                if (dialogResult.result == true){
                    this.activateAccount();
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
    },
    mounted(){
        this.loadAllParentsAccounts();
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