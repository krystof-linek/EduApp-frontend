<template>
<div class="mx-lg-n16 mb-6">
    <v-card v-if="isReady && $vuetify.breakpoint.mdAndUp">
        
        <v-card-title class="justify-center blue white--text py-2 py-md-4 py-xl-6">
            <label :id="titleStyle">Kurz</label>
        </v-card-title>
                  
        <v-divider></v-divider>

        <v-row class="mx-0 mt-0">

        <v-col cols="3" class="blue-grey lighten-3 py-0" rounded='lg'>
            <v-card class="mt-2">
                 <v-card-title class="text-center py-1">Obsah</v-card-title>

                 <v-divider></v-divider>

                 ss
                 ss
                 ss
            </v-card>
        </v-col>

        <v-col cols="9" class="green accent-1 py-0" rounded='lg'>
            <v-card class="mt-2 pb-4">

                <v-card-title class="text-center py-1">Název kurzu</v-card-title>

                <v-divider></v-divider>

                <v-card class="mx-8">
                  
                <v-card-text v-if="contents.length != 0">
                    <div v-for="content in contents" :key="content.id_content">
                        <mytitle v-if="content.content_type == 'title'" :title="content.title" :title_size="content.title_size" :icon="content.icon" :icon_color="content.icon_color"></mytitle>
                        <paragraph v-if="content.content_type == 'paragraph'" :title="content.title" :title_size="content.title_size" :text="content.text"></paragraph>
                        <mypicture v-if="content.content_type == 'picture'" :title="content.title" :src="content.link" :description="content.description" :alt="content.alt" :author="content.author"></mypicture>
                        <myvideo v-if="content.content_type == 'video'" :title="content.title" :src="content.link" :description="content.description" :author="content.author"></myvideo>
                        <mylink v-if="content.content_type == 'link'" :title="content.title" :link="content.link" :description="content.description" :btn_title="content.btn_title" :btn_color="content.btn_color"></mylink>
                        <mylist v-if="content.content_type == 'list'" :title="content.title" :link="content.link" :description="content.description" :items="content.items" :numbered="content.numbered"></mylist>
                        <mynotice v-if="content.content_type == 'notice'" :title="content.title" :description="content.description" :color="content.color" :icon="content.icon"></mynotice>
                    </div>
                </v-card-text>

                </v-card>
            
            </v-card>
        </v-col>

        </v-row>
    </v-card>

    <v-card v-else>
        <my-skelet></my-skelet>
    </v-card>
</div>
</template>

<script>
/*
import DialogWindow from '../../components/DialogWindow.vue'
import DialogExplainWindow from '../../components/DialogExplainWindow.vue'
import {VueMathjax} from 'vue-mathjax'

export default {
    components: {
        'my-dialog': DialogWindow,
        'vue-mathjax': VueMathjax,
        'my-dialog-explain': DialogExplainWindow,
    },
*/
import ContentTitle from '../../components/ContentTitle.vue'
import ContentParagraph from '../../components/ContentParagraph.vue'
import ContentPicture from '../../components/ContentPicture.vue'
import ContentVideo from '../../components/ContentVideo.vue'
import ContentLink from '../../components/ContentLink.vue'
import ContentList from '../../components/ContentList.vue'
import ContentNotice from '../../components/ContentNotice.vue'
import SkeletonLoader from '../../components/SkeletonLoader.vue'

export default {
    components: {
      "mytitle": ContentTitle,
      "paragraph": ContentParagraph,
      "mypicture": ContentPicture,
      "myvideo": ContentVideo,
      "mylink": ContentLink,
      "mylist": ContentList,
      "mynotice": ContentNotice,
      "my-skelet": SkeletonLoader,
    },
    data: () => ({
        isReady: false,

        courseInfo: null,

        contents: [],
       
    }),
    
    computed:{
       titleStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'my-window-title-xs'
          case 'sm': return 'my-window-title-sm'
          case 'md': return 'my-window-title-md'
          case 'xl': return 'my-window-title-xl'
          default: return 'my-window-title-lg' //lg
        }
      },
    },
    methods:{
        async initCourse(){
            if (this.$route.params.courseContent != null){
                this.contents = this.$route.params.courseContent;
            } else {
                await this.loadCourseContentById(this.$route.params.id_course);
            }

            this.isReady = true;
        },
        async loadCourseContentById(id){

          try{
            const response = await this.$http.get(`/course/content/by/id/${id}`);

            this.contents = response.data;

          } catch (e) {
              const status = e.response.status;
              if (status == 401)
                this.$emit("logoutUser"); 

            console.log("error")
          }
        },
    },
    mounted(){
        this.initCourse();

        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML')
        document.head.appendChild(recaptchaScript)
    }
  }
</script>