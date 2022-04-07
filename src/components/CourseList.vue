<template>
  <v-container fluid>
    <v-data-iterator
      :items="courses"
      :search="search"
      sort-by="title"
      :sort-desc="sortDesc"
      :single-expand="showInfo"
      hide-default-footer
    >
      <template v-slot:header>

        <v-row align="center">
        
          <v-col cols="12">
            <v-toolbar elevation="10">
              <v-text-field v-model="search" clearable flat hide-details prepend-inner-icon="mdi-magnify" label="Vyhledat"></v-text-field>
            </v-toolbar>
          </v-col>

        </v-row>

      </template>

      <template v-slot:default="{items, isExpanded, expand }">
        <v-row>
          <v-col v-for="item in items" :key="item.id" md="4" lg="4">
            <v-card rounded="lg" elevation="10" @click="loadCourseContentById(item.id)">
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

    </v-data-iterator>
  </v-container>
</template>

<script>
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
      async loadCourseContentById(id){

          try{
            const response = await this.$http.get(`/course/content/by/id/${id}`);
            this.contents = response.data;
            if(this.contents.length)
              this.nextStep(3);
            else{
              this.alertMessage = this.alertMessages[2];
              this.isAlert = true;
            }
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