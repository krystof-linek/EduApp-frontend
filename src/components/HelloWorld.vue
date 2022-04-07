<template>
  <v-container fluid>
    <v-data-iterator
      :items="courses"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      sort-by="title"
      :sort-desc="sortDesc"
      :single-expand="showInfo"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar color="blue" class="mb-1">
          <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Vyhledat"></v-text-field>
          
        </v-toolbar>
      </template>

      <template v-slot:default="{items, isExpanded, expand }">
        <v-row>
          <v-col v-for="item in items" :key="item.id" md="4" lg="4">
            <v-card rounded="lg" elevation="5">
              <v-card-title class="subheading font-weight-bold">{{ item.title }}</v-card-title>

              <v-btn block x-small :color="!isExpanded(item) ?  'blue lighten-2' : 'blue-grey lighten-3'" :input-value="isExpanded(item)" @click="(v) => {!isExpanded(item) ? expand(item, v) : expand(v) }">
                
                <v-icon color="white">{{ isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>

              <v-divider></v-divider>
              <v-list v-if="isExpanded(item)" dense>
                <v-list-item>
                  <v-list-item-content>Autor:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ item.user.name }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>Vytvořen:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    test
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  <v-list-item-content :class="{ 'blue--text': sortBy === key }">{{ key }}:</v-list-item-content>
                  <v-list-item-content class="align-end" :class="{ 'blue--text': sortBy === key }">{{ item[key.toLowerCase()] }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark text color="primary" class="ml-2" v-bind="attrs" v-on="on">
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index" @click="updateItemsPerPage(number)">
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn fab dark color="blue darken-3" class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>






      <v-card v-if="n==4" outlined color="transparent" class="mt-n5">
                  <v-card-title class="text-lg-h3">{{courseName}}</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text v-if="contents.length != 0">
                    <div v-for="content in contents" :key="content.id_content">
                      <paragraph v-if="content.content_type == 'paragraph'" :title=content.title :title_size=content.title_size :text=content.text></paragraph>
                      <mypicture v-if="content.content_type == 'picture'" :title=content.title :src=content.link :description=content.description :alt=content.alt :author=content.author></mypicture>
                      <myvideo v-if="content.content_type == 'video'" :title=content.title :src=content.link :description=content.description :author=content.author></myvideo>
                      <mylink v-if="content.content_type == 'link'" :title=content.title :link=content.link :description=content.description :btn_title=content.btn_title :btn_color=content.btn_color></mylink>
                      <mylist v-if="content.content_type == 'list'" :title=content.title :link=content.link :description=content.description :items=content.items :numbered=content.numbered></mylist>
                      <mynotice v-if="content.content_type == 'notice'" :title=content.title :description=content.description :color=content.color :icon='content.icon'></mynotice>
                    </div>
                  </v-card-text>

                  <div v-else>
                      <skelet></skelet>
                  </div>

              </v-card>









  </v-container>
  
</template>

<script>
/*
import ContentParagraph from './contents/ContentParagraph'
import ContentPicture from './contents/ContentPicture'
import ContentVideo from './contents/ContentVideo'
import ContentLink from './contents/ContentLink'
import ContentList from './contents/ContentList'
import ContentNotice from './contents/ContentNotice'
import SkeletonLoader from './contents/SkeletonLoader'

  export default {
    components: {
      "paragraph": ContentParagraph,
      "mypicture": ContentPicture,
      "myvideo": ContentVideo,
      "mylink": ContentLink,
      "mylist": ContentList,
      "mynotice": ContentNotice,
      "skelet": SkeletonLoader,
    },
    */
   export default {
    data () {
      return {
        showInfo: true,
        itemsPerPageArray: [4, 8, 12],
        search: '',
        filter: {},
        sortDesc: false,
        page: 1,
        itemsPerPage: 8,
        keys: [
          'title',
        ],
        courses: [],
      }
    },
    computed: {
      numberOfPages () {
        return Math.ceil(this.courses.length / this.itemsPerPage)
      },
      filteredKeys () {
        return this.keys.filter(key => key !== 'title')
      },
    },
    methods: {
      test(item, v){
        console.log(item, v);
      },
      nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage () {
        if (this.page - 1 >= 1) this.page -= 1
      },
      updateItemsPerPage (number) {
        this.itemsPerPage = number
      },
      async loadAllCoursesById(id){
            try{
                const response = await this.$http.get(`/course/all/by/subject/id/${id}`);
                this.courses = response.data;
               
            } catch (e) {
                const status = e.response.status;
                if (status == 401)
                  this.$emit("logoutUser"); 
            }
        },
    },
    mounted(){
      this.loadAllCoursesById(2);
    }
  }
</script>