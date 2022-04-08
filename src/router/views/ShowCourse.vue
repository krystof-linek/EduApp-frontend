<template>
<div class="mx-md-n16 mb-16">
    <v-card v-if="isReady && $vuetify.breakpoint.mdAndUp" color="transparent" outlined rounded="lg">
        
        <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6 rounded-lg">
            <label :id="titleStyle">Výukový kurz</label>
        </v-card-title>
                  
        <v-divider></v-divider>

        <v-row class="mx-0 mt-2">

        <v-col cols="3" class="lighten-3 pl-0 py-0" rounded='lg'>
            
            <v-card class="mt-2 pb-6" style="position: sticky; top: 20%" rounded="lg">
                 <v-card-title class="justify-center py-2">
                    Obsah
                </v-card-title>

                 <v-divider></v-divider>

                <v-card class="pa-2" :height="$vuetify.breakpoint.name == 'md' ? '45vh' : '65vh'" style="overflow: auto;">

                    <div class="px-1" v-for="link in contentLinks" :key="link.id">
                        <v-row align="center" class="py-0 pt-xl-1 mr-4" v-if="link.type == 'title'">
                            <v-col cols="2" class="text-center mt-n1">
                                <v-icon :style="mainLinkIconStyle" :color="link.icon_color">{{ link.icon }}</v-icon>
                            </v-col>
                            <v-col cols="10" class="pl-1 py-0 pl-lg-0">
                                <v-btn :style="mainLinkStyle" class="font-weight-bold pa-0 text-decoration-underline" text @click="scrollToContent(link.id)">{{ link.title }}</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="center" v-else class="py-1 ml-4 py-xl-2">
                            <v-col cols="2" class="text-center py-0 mt-n1">
                                <v-icon :style="otherLinkIconStyle" :color="link.icon_color">{{ link.icon }}</v-icon>
                            </v-col>
                            <v-col cols="10" class="pl-1 py-0 pl-lg-0">
                                <v-btn class="pa-0" :style="otherLinkStyle" text @click="scrollToContent(link.id)">{{ link.title }}</v-btn>
                            </v-col>
                        </v-row>
                        
                    </div>

                </v-card>

                <v-divider class="mb-4"></v-divider>

            </v-card>
        </v-col>

        <v-col cols="9" class="py-0 pr-0" rounded='lg'>
            <v-card class="mt-2 pb-4" rounded="lg">

                <v-card-title class="justify-center font-weight-bold"></v-card-title>

                <v-divider class="mt-6"></v-divider>

                <v-card class="mx-8 pb-4" outlined color="transparent">
                  
                    <v-card-text v-if="contents.length != 0">
                        <div v-for="content in contents" :key="content.id_content" :id="'content-link-' + content.id_content">
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

                <v-divider class="mb-6"></v-divider>
            
            </v-card>
        </v-col>

        </v-row>

    </v-card>

   
    <v-card v-else-if="isReady" class="pb-4" rounded="lg">

        <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-sm-4 rounded-sm">
            <label :id="titleStyle">Výukový kurz</label>
        </v-card-title>
           
            <v-card-text class="px-1 pt-3 px-sm-8 pt-sm-4" v-if="contents.length != 0">
                <div v-for="content in contents" :key="content.id_content" :id="'content-link-' + content.id_content">
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

    <v-card v-else>
        <my-skelet></my-skelet>
    </v-card>
</div>
</template>

<script>
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

        contentLinks: [],

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
      mainLinkStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'md': return 'font-size: 1.3vw;'
          case 'lg': return 'font-size: 1.1vw;'
          default: return 'font-size: 1.1vw;' //xl
        }
      },
      mainLinkIconStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'md': return 'font-size: 2vw;'
          case 'lg': return 'font-size: 1.8vw;'
          default: return 'font-size: 1.6vw;' //xl
        }
      },
      otherLinkStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'md': return 'font-size: 1.3vw;'
          case 'lg': return 'font-size: 1.1vw;'
          default: return 'font-size: 1vw;' //xl
        }
      },
      otherLinkIconStyle() {
        switch (this.$vuetify.breakpoint.name) {
          case 'md': return 'font-size: 2vw;'
          case 'lg': return 'font-size: 1.6vw;'
          default: return 'font-size: 1.4vw;' //xl
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

            this.setContentLinks();
           
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
        setContentLinks(){
            this.contents.forEach((content) => {

                let link = {
                        id: -1,
                        type: "",
                        title: "",
                        icon: "",
                        icon_color: "",
                    };

                if (content.content_type == "title" && content.title_size == 1){

                    link.id = content.id_content;
                    link.type = "title";
                    link.title = content.title;
                    link.icon = content.icon == "" ? 'mdi-folder' : content.icon;
                    link.icon_color = content.icon_color == "" ? 'blue' : content.icon_color;
                    
                    this.contentLinks.push(link);
                }
                if (content.content_type == "title" && content.title_size == 2){

                    link.id = content.id_content;
                    link.type = "subtitle";
                    link.title = content.title;
                    link.icon = content.icon == "" ? 'mdi-script-text' : content.icon;
                    link.icon_color = content.icon == "" ? 'blue' : content.icon_color;

                    this.contentLinks.push(link);
                }
                if (content.content_type == "picture"){

                    link.id = content.id_content;
                    link.type = "picture";
                    link.title = content.title == "" ? 'Obrázek' : content.title;
                    link.icon = 'mdi-image-area';
                    link.icon_color = 'success',

                    this.contentLinks.push(link);
                
                }
                if (content.content_type == "video"){

                    link.id = content.id_content;
                    link.type = "video";
                    link.title = content.title == "" ? 'Video' : content.title;
                    link.icon = 'mdi-video-box';
                    link.icon_color = 'error',

                    this.contentLinks.push(link);
                }
                if (content.content_type == "link"){

                    link.id = content.id_content;
                    link.type = "link";
                    link.title = content.title == "" ? 'Odkaz' : content.title;
                    link.icon = 'mdi-link-variant';
                    link.icon_color = 'warning',

                    this.contentLinks.push(link);
                }
                if (content.content_type == "notice"){

                    link.id = content.id_content;
                    link.type = "link";
                    link.title = content.title;
                    link.icon = content.icon;
                    link.icon_color = content.color,

                    this.contentLinks.push(link);
                }

            
            });

            this.isReady = true;
        },
        scrollToContent(id) {
            console.log(id)
         
            const element = document.getElementById('content-link-' + id);

            element.scrollIntoView({behavior: "smooth", block: "center"});   
          
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