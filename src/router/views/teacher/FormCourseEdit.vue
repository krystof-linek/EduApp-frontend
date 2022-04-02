<template>
    <v-card outlined color="transparent">

    <v-card-title class="justify-center pt-8">
      <h1>Úprava kurzu</h1>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Stepper pro vyber kurzu -->

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
                  <v-text-field v-model="search" append-icon="mdi-magnify" label="Vyhledat kurz" hide-details id="my-search" single-line>

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
                }"
                >
                    
                </v-data-table>
              </v-card>
             
        <!-- Vykresli stavajici obsah -->

              <v-card v-if="n==2" outlined color="transparent">
                  <v-card-title class="text-h2 my-n3">{{courseName}}</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <div v-for="content in contents" :key="content.id_content">
                      <paragraph v-if="content.content_type == 'paragraph'" :title=content.title :title_size=content.title_size :text=content.text></paragraph>
                      <mypicture v-if="content.content_type == 'picture'" :title=content.title :src=content.link :description=content.description :alt=content.alt :author=content.author></mypicture>
                      <myvideo v-if="content.content_type == 'video'" :title=content.title :src=content.link :description=content.description :author=content.author></myvideo>
                      <mylink v-if="content.content_type == 'link'" :title=content.title :link=content.link :description=content.description :btn_title=content.btn_title :btn_color=content.btn_color></mylink>
                      <mylist v-if="content.content_type == 'list'" :title=content.title :link=content.link :description=content.description :items=content.items :numbered=content.numbered></mylist>
                      <mynotice v-if="content.content_type == 'notice'" :title=content.title :description=content.description :color=content.color :icon='content.icon'></mynotice>
                    </div>
                  </v-card-text>
              </v-card>

      <!-- Pridani noveho obsahu -->

            <v-card v-if="n==2" outlined color="transparent" class="mt-n5" id="scrollView">
                <v-row justify="space-around">
                    <v-menu offset-y>
                        <template v-slot:activator="{ attrs, on }">
                            <v-btn color="success" class="white--text ma-4" v-bind="attrs" v-on="on">
                              Přidat obsah
                              <v-icon small color="white" class="ma-2">mdi-plus-thick</v-icon>
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-item v-for="item in items" :key="item.name" @click="selected = item.name; scrollToContent()">
                                <v-list-item-icon><v-icon v-text="item.icon"></v-icon></v-list-item-icon>
                                <v-list-item-title v-text="item.name"></v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-row>
                <v-card v-if="selected != ''" class="mt-5" rounded="lg" elevation="10">
                  <v-row class="justify-end">
                     <v-btn class="mr-5 mt-2" fab x-small color="grey">
                       <v-icon x-large @click="selected = ''" small color="white" class="ma-2">mdi-close-thick</v-icon>
                      </v-btn>
                  </v-row>
      
                  <v-card-title class="justify-center mt-n9">
                    <label class="text-h2">{{selected}}</label>
                  </v-card-title>

      <!-- Formular dle konkretního typu obsahu -->

                  <v-card width="90%" style='margin: auto' class="mb-3 mt-n9" outlined color="transparent">

                    <!-- Formulář pro nové video -->
                    <div v-if="selected === 'Video'">
                      <v-form v-model="isCorrect">
                        <v-container fluid>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field background-color="blue-grey lighten-5" v-model="videoContent.title" label="Název" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field background-color="blue-grey lighten-5" v-model="videoContent.description" label="Poznámka" hide-details="auto"></v-text-field>
                            </v-col>
                            <label class="ml-3 text-caption font-italic text--secondary">Nadpis a poznámka není povinný údaj.</label>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="9">
                              <v-text-field background-color="blue-grey lighten-5" v-model="videoContent.link" :rules='pictureContent.rules' label="Odkaz" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-text-field background-color="blue-grey lighten-5" v-model="videoContent.author" label="Autor" hide-details="auto"></v-text-field>
                            </v-col>
                            <label class="ml-3 text-caption font-italic text--secondary">Autor není povinný údaj.</label>
                          </v-row>
                        </v-container>
                      </v-form>
                    </div>
                    <!-- Formulář pro nový obrázek -->
                    <div v-if="selected === 'Obrázek'">
                      <v-form v-model="isCorrect">
                        <v-container fluid>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field background-color="blue-grey lighten-5" v-model="pictureContent.title" label="Název" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field background-color="blue-grey lighten-5" v-model="pictureContent.description" label="Poznámka" hide-details="auto"></v-text-field>
                            </v-col>
                            <label class="ml-3 text-caption font-italic text--secondary">Nadpis a poznámka není povinný údaj.</label>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field background-color="blue-grey lighten-5" v-model="pictureContent.link" :rules='pictureContent.rules' label="Odkaz" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-text-field background-color="blue-grey lighten-5" v-model="pictureContent.alt" label="Alternativní popisek" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-text-field background-color="blue-grey lighten-5" v-model="pictureContent.author" label="Autor" hide-details="auto"></v-text-field>
                            </v-col>
                            <label class="ml-3 text-caption font-italic text--secondary">Alternativní popisek a autor není povinný údaj.</label>
                          </v-row>
                        </v-container>
                      </v-form>
                    </div>
                    <!-- Formulář pro nový odstavec textu -->
                    <div v-if="selected === 'Text'">
                      <v-form v-model="isCorrect">
                        <v-container fluid>
                          <v-row>
                            <v-col cols="12" sm="8">
                              <v-text-field background-color="blue-grey lighten-5" v-model="textContent.title" label="Nadpis" hide-details="auto" class="mb-5"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-select background-color="blue-grey lighten-5" v-model="textContent.title_size" :items="textContent.titles" item-text="title" item-value="value" label="Úroveň nadpisu"></v-select>
                            </v-col>
                          </v-row>
                          <v-row class="justify-start">
                            <label class="ml-3 mb-2 mt-n4 text-caption font-italic text--secondary">Nadpis není povinný údaj.</label>
                          </v-row>
                          <v-textarea background-color="blue-grey lighten-5" v-model="textContent.text" counter label="Text" :rules="textContent.rules"></v-textarea>
                        </v-container>
                      </v-form>
                    </div>
                    <!-- Formulář pro nový seznam -->
                    <div v-if="selected === 'Seznam'">
                      <v-form v-model="isCorrect">
                        <v-container fluid>
                          <v-row>
                            <v-col cols="12" sm="4">
                              <v-text-field background-color="blue-grey lighten-5" v-model="listContent.title" label="Nadpis" hide-details="auto" class="mb-5"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field background-color="blue-grey lighten-5" v-model="listContent.description" label="Poznámka" hide-details="auto" class="mb-5"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-switch v-model="listContent.numbered" :label="listContent.numbered ? 'Číslovaný seznam' : 'Nečíslovaný seznam'"></v-switch>
                            </v-col>
                          </v-row>
                          <v-row class="justify-start">
                            <label class="ml-3 mb-2 mt-n4 text-caption font-italic text--secondary">Nadpis a poznámka není povinný údaj.</label>
                          </v-row>
                          <div v-for="(item, index) in listItems" :key="index">
                            <v-row>
                              <v-col cols="12" sm="10">
                                <v-text-field v-model="item.value" :key="index" :rules="listContent.rules" background-color="blue-grey lighten-5" :label="index + 1  + '. Prvek seznamu'" hide-details="auto" class="mb-5"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="2">
                                <v-btn class="mt-4 ml-n5" icon :disabled='listItems.length == 1' @click="removeItem(item)"><v-icon color="error">mdi-close-thick</v-icon></v-btn>
                              </v-col>
                            </v-row>  
                          </div>
                          <v-btn small :disabled="listItems[listIndex].value == ''" color="success" @click="addItem">další prvek<v-icon class="ml-2" small color="white">mdi-plus-thick</v-icon></v-btn>
                        </v-container>
                      </v-form>
                    </div>
                    <!-- Formulář pro nový odkaz -->
                    <div v-if="selected === 'Odkaz'">
                      <v-form v-model="isCorrect">
                        <v-container fluid>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field background-color="blue-grey lighten-5" v-model="linkContent.title" label="Název" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field background-color="blue-grey lighten-5" v-model="linkContent.description" label="Poznámka" hide-details="auto"></v-text-field>
                            </v-col>
                            <label class="ml-3 text-caption font-italic text--secondary">Nadpis a poznámka není povinný údaj.</label>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field background-color="blue-grey lighten-5" v-model="linkContent.link" :rules='linkContent.rules' label="Odkaz" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-text-field background-color="blue-grey lighten-5" v-model="linkContent.btn_title" :rules='linkContent.rules' label="Popisek tlačítka" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-select background-color="blue-grey lighten-5" v-model="linkContent.btn_color" :items="linkContent.colors" item-text="name" item-value="value" label="Barva tlačítka"></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
                    </div>
                    <!-- Formulář pro novou poznámku -->
                    <div v-if="selected === 'Poznámka'">
                      <v-form v-model="isCorrect">
                        <v-container fluid>
                          <v-row>
                            <v-col cols="12" sm="7">
                              <v-text-field background-color="blue-grey lighten-5" v-model="noticeContent.title" label="Zdůraznění" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="2">
                              <v-select background-color="blue-grey lighten-5" v-model="noticeContent.color" :items="noticeContent.colors" item-text="color" item-value="value" label="Barva rámečku"></v-select>
                            </v-col>
                            <v-col cols="12" sm="2">
                              <v-select background-color="blue-grey lighten-5" v-model="noticeContent.icon" :items="noticeContent.icons" item-text="icon" item-value="value" label="Ikona"></v-select>
                            </v-col>
                            <v-col cols="12" sm="1">
                              <span><v-icon class="mt-3" x-large :color="getIconColor">{{ noticeContent.icon }}</v-icon></span>
                            </v-col>
                            <span class="ml-3 mt-n5 text-caption font-italic text--secondary">Zdůraznění není povinný údaj.</span>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="7" class="mt-n3">
                              <v-text-field background-color="blue-grey lighten-5" v-model="noticeContent.description" label="Text" :rules="noticeContent.rules" hide-details="auto"></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
                    </div>
                  <!-- Odeslání formuláře -->
                  </v-card>
                    <div class="text-center">
                      <v-btn class="mb-5" style="margin: auto" :disabled='!isCorrect' small color="success" @click="newContent(selected)">
                        Potvrdit
                      </v-btn>
                    </div>
                </v-card>
            </v-card>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    </v-card>
  </v-card>
</template>
<script>
import ContentParagraph from '../study/contents/ContentParagraph'
import ContentPicture from '../study/contents/ContentPicture'
import ContentVideo from '../study/contents/ContentVideo'
import ContentLink from '../study/contents/ContentLink'
import ContentList from '../study/contents/ContentList'
import ContentNotice from '../study/contents/ContentNotice'
  export default {
    components: {
      "paragraph": ContentParagraph,
      "mypicture": ContentPicture,
      "myvideo": ContentVideo,
      "mylink": ContentLink,
      "mylist": ContentList,
      "mynotice": ContentNotice,
    },
    props: {
        user: {default: null},
        courseId: {default: -1},
    },
    data () {
      return {
        courses: [],
        contents: [],
        courseName: '',
        e1: 1,
        steps: 2,
        vyber: ["Výběr kurzu", "Editace kurzu"],
        isAlert: false,
        alertMessage: '',
        
        items: [
            {   name: 'Video', icon: 'mdi-film' },
            {   name: 'Obrázek', icon: 'mdi-camera-plus' },
            {   name: 'Text', icon: 'mdi-signature-text' },
            {   name: 'Seznam', icon: 'mdi-clipboard-list-outline' },
            {   name: 'Odkaz', icon: 'mdi-link-variant-plus' },
            {   name: 'Poznámka', icon: 'mdi-note-text-outline' },
        ],

        search: '',

        headers: [
          { text: 'Název kurzu', align: 'start', filterable: true, value: 'title',},
          { text: 'Předmět', value: 'subject.title'},
          { text: 'Ročník', value: 'subject.grade'},
          { text: 'Vytvořen', value: 'created'},
        ],

        idCourse: -1,

        selected: '',
        isCorrect: false,

        /* --- pro novy odtavec --- */

        textContent: {
          title: '',
          title_size: 1,
          text: '',
          rules: [v => v.length <= 1000 || 'Může obsahovat maximálně 1000 znaků!', v => v.length >= 10 || 'Musí obsahovat alespoň 10 znaků!'],
          titles: [
            { title: 'Hlavní nadpis', value: 1 },
            { title: 'Podnadpis 1', value: 2 },
            { title: 'Podnadpis 2', value: 3 },
            { title: 'Podnadpis 3', value: 4 },
          ],
          alertMessages: ["Nemáte příslušná oprávnění pro tuto akci", "Kurz, ke kteremu chcete pridat text nebyl nalezen!"],
        },

        /* --- pro novy seznam --- */

        listItems: [{value: '', count: 1}],
        listIndex: 0,

        listContent: {
          title: '',
          description: '',
          items: [],
          numbered: false,
          rules: [v => v.length <= 100 || 'Může obsahovat maximálně 100 znaků!', v => v.length >= 3 || 'Musí obsahovat alespoň 3 znaky!'],
          alertMessages: ["Nemáte příslušná oprávnění pro tuto akci", "Kurz, ke kteremu chcete pridat seznam nebyl nalezen!"],
        },

        /* --- pro novy odkaz --- */

        linkContent: {
          title: '',
          description: '',
          btn_color: 'blue',
          btn_title: 'navštívit',
          link: '',
          colors: [
            { name: 'modrá',  value: 'blue'},
            { name: 'červená',  value: 'error'},
            { name: 'zelená',  value: 'success'},
          ],
          rules: [
            value => !!value || 'Jedná se o povinný údaj!',
            value => (value && value.length >= 3) || 'Musí obsahovat alespoň tři znaky!',
          ],
          alertMessages: ["Nemáte příslušná oprávnění pro tuto akci", "Kurz, ke kteremu chcete pridat odkaz nebyl nalezen!"],
        },

        /* --- pro novy obrazek --- */

        pictureContent: {
          title: '',
          description: '',
          author: '',
          alt: '',
          link: '',
          rules: [
            value => !!value || 'Jedná se o povinný údaj!',
            value => (value && value.length >= 3) || 'Musí obsahovat alespoň tři znaky!',
          ],
          alertMessages: ["Nemáte příslušná oprávnění pro tuto akci", "Kurz, ke kteremu chcete pridat obrázek nebyl nalezen!"],
        },

        /* --- pro nove video --- */

        videoContent: {
          title: '',
          description: '',
          author: '',
          link: '',
          rules: [
            value => !!value || 'Jedná se o povinný údaj!',
            value => (value && value.length >= 3) || 'Musí obsahovat alespoň tři znaky!',
          ],
          alertMessages: ["Nemáte příslušná oprávnění pro tuto akci", "Kurz, ke kterému chcete přidat video nebyl nalezen!"],
        },

        /* --- pro nové upozornění --- */

        noticeContent: {
          title: '',
          description: '',
          color: 'blue',
          colors: [
            {color: "modrá", value: 'blue'},
            {color: "zelená", value: 'green'},
            {color: "červená", value: 'red'},
          ],
          icons: [
            {icon: 'žárovka', value: 'mdi-lightbulb-on-outline'},
            {icon: "vykřičník", value: 'mdi-exclamation-thick'},
            {icon: "otazník", value: 'mdi-help'},
            {icon: "kniha", value: 'mdi-book-open-page-variant-outline'},
          ],
          icon: 'mdi-lightbulb-on-outline',
          rules: [
            value => !!value || 'Jedná se o povinný údaj!',
            value => (value && value.length >= 3) || 'Musí obsahovat alespoň tři znaky!',
          ],
          alertMessages: ["Nemáte příslušná oprávnění pro tuto akci", "Kurz, ke kterému chcete přidat tag nebyl nalezen!"],
        },

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
      getIconColor () {
        switch (this.noticeContent.icon) {
        case 'mdi-lightbulb-on-outline': return 'yellow'
        case 'mdi-exclamation-thick': return 'error'
        case 'mdi-help': return 'blue'
        default: return 'black'
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
        async loadAllCourses(){
            try{
                const response = await this.$http.get(`/course/all/from/author`);
                this.courses = response.data;
                if(this.courses.length == 0){
                    this.alertMessage = this.alertMessages[0];
                    this.isAlert = true;
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
        handleClick(value) {
            this.isAlert = false;
            this.idCourse = value.id;
            this.courseName = value.title;
            this.loadCourseContentById(this.idCourse);
        },
        async loadCourseContentById(id){
          try{
            const response = await this.$http.get(`/course/content/by/id/${id}`);
            this.contents = response.data;
            this.nextStep(1);
          } catch (e) {
              const status = e.response.status;
              if (status == 401)
                this.$emit("logoutUser"); 
          }
        },
        newContent(content){
          this.isAlert = false;
          if(content == 'Text')
            this.newText();
          if(content == 'Seznam'){
            this.newList();
          }
          if(content == 'Odkaz'){
            this.newLink();
          }
          if(content == 'Obrázek'){
            this.newPicture();
          }
          if(content == 'Video'){
            this.newVideo();
          }
          if(content == 'Poznámka'){
            this.newNotice();
          }
        },
        async newText(){
          try {
            await this.$http.post(`/course/${this.idCourse}/new/paragraph`, {title: this.textContent.title, title_size: this.textContent.title_size, text: this.textContent.text});
            this.reloadCourseContent();

            this.resetTextContent();
          } catch(e){
            const statusCode = e.response.status;

            this.showNewContentAlert(statusCode, this.textContent.alertMessages);
          }
        },
        resetTextContent(){
          this.textContent.title = '';
          this.textContent.title_size = 1;
          this.textContent.text = '';
        },

        addItem() {
          this.listItems.push({ value: '', count: this.listItems.length+1});
          this.listIndex++;
        },

        removeItem(item){
          this.listItems.splice(this.listItems.indexOf(item), 1);
          this.listIndex--;
        },

        async newList(){
          this.listItems.forEach((item) => {
            if (item.value != '')
              this.listContent.items.push(item.value);
          });

          try {
            await this.$http.post(`/course/${this.idCourse}/new/list`, {title: this.listContent.title, description: this.listContent.description, numbered: this.listContent.numbered, items: this.listContent.items});
            this.reloadCourseContent();

            this.resetListContent();
          } catch(e){
            const statusCode = e.response.status;

            this.showNewContentAlert(statusCode, this.listContent.alertMessages);
          }
        },
        resetListContent(){
          this.listContent.title = '';
          this.listContent.description = '';
          this.listContent.numbered = false;
          this.listContent = [];

          this.listItems = [{ value: '', count: 1}];
          this.listIndex = 0;
        },

        async newLink(){
          try {
            await this.$http.post(`/course/${this.idCourse}/new/link`, {title: this.linkContent.title, description: this.linkContent.description, link: this.linkContent.link, btn_color: this.linkContent.btn_color, btn_title: this.linkContent.btn_title});
            this.reloadCourseContent();

            this.resetLinkContent();
          } catch(e){
            const statusCode = e.response.status;

            this.showNewContentAlert(statusCode, this.linkContent.alertMessages);
          }
        },

        resetLinkContent(){
          this.linkContent.title = '';
          this.linkContent.description = '';
          this.linkContent.link = '';
          this.linkContent.btn_color = 'blue';
          this.linkContent.btn_title = 'navštívit';
        },

        async newPicture(){
          try {
            await this.$http.post(`/course/${this.idCourse}/new/picture`, {title: this.pictureContent.title, description: this.pictureContent.description, link: this.pictureContent.link, author: this.pictureContent.author, alt: this.pictureContent.alt});
            this.reloadCourseContent();

            this.resetPictureContent();
          } catch(e){
            const statusCode = e.response.status;

            this.showNewContentAlert(statusCode, this.pictureContent.alertMessages);
          }
        },

        resetPictureContent(){
          this.pictureContent.title = '';
          this.pictureContent.description = '';
          this.pictureContent.link = '';
          this.pictureContent.author = '';
          this.pictureContent.alt = '';
        },

        async newVideo(){
          try {
            await this.$http.post(`/course/${this.idCourse}/new/video`, {title: this.videoContent.title, description: this.videoContent.description, link: this.videoContent.link, author: this.videoContent.author});
            this.reloadCourseContent();

            this.resetVideoContent();
          } catch(e){
            const statusCode = e.response.status;

            this.showNewContentAlert(statusCode, this.pictureContent.alertMessages);
          }
        },

        resetVideoContent(){
          this.videoContent.title = '';
          this.videoContent.description = '';
          this.videoContent.link = '';
          this.videoContent.author = '';
        },

        async newNotice(){
          try {
            await this.$http.post(`/course/${this.idCourse}/new/notice`, {title: this.noticeContent.title, description: this.noticeContent.description, color: this.noticeContent.color, icon: this.noticeContent.icon});
            this.reloadCourseContent();

            this.resetNoticeContent();
          } catch(e){
            const statusCode = e.response.status;

            this.showNewContentAlert(statusCode, this.noticeContent.alertMessages);
          }
        },

        resetNoticeContent(){
          this.noticeContent.title = '';
          this.noticeContent.description = '';
          this.noticeContent.color = 'blue';
          this.noticeContent.icon = 'mdi-lightbulb-on-outline';
        },

        showNewContentAlert(status, alerts){
          if (status == 401){
              this.$emit("logoutUser");
          } else if (status == 403){
              this.alertMessage = alerts[0];
              this.isAlert = true;
              this.$router.push({ name: 'errNotPerms', });
          } else if (status == 404){
                this.alertMessage = alerts[1];
                this.isAlert = true;
          } 
        },

        reloadCourseContent(){
          this.loadCourseContentById(this.idCourse);
          this.selected = '';
        },

        scrollToContent() {
          setTimeout(() => {
            const element = document.getElementById('scrollView');
            element.scrollIntoView({behavior: "smooth", block: "start"});   
          }, 300); 
        }
    },
    mounted(){
        this.loadAllCourses();
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