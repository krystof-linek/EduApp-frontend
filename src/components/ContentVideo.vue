<template>
    <v-row align="center" class="justify-center my-2 my-xl-4">
        <v-card outlined color="transparent" :style="textStyle">
            <v-col cols="12" class="text-center py-0">
                <v-card class="justify-center" :width="cardWdith" rounded="lg" color="transparent" outlined>
                    <youtube :style="videoSize" :video-id="videoId" ref="youtube"></youtube>
                </v-card>
            </v-col>
            
            <v-col v-if="title != ''" class="text-center py-0 mt-1 mt-lg-1 mt-xl-2" cols="12">
                <span class="font-weight-regular">{{ title }}</span>
                <span v-if="title != '' && description != ''">: </span>
                <span class="font-italic">{{ description }}</span>
            </v-col>

            <v-col  v-if="title != '' && author != ''" cols="12" class="text-center font-weight-regular py-0">
                <span class="font-weight-bold">Zdroj: </span>{{ author }}
            </v-col>

        </v-card>
    </v-row>    
</template>
<script>
export default  {
    data () {
      return {
          videoId: '',
      }
    },
    props: {
        title: {default: ''},
        src: {default: ''},
        description: {default: ''},
        author: {default: ''}
    },
    computed: {
        player() {
            return this.$refs.youtube.player
        },
        textStyle() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 3vw'
            case 'sm': return 'font-size: 2vw'
            case 'md': return 'font-size: 1.2vw'
            case 'lg': return 'font-size: 1.1vw'
            default: return 'font-size: 1vw' //xl
            }
        },
        videoSize() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'height: 200px; width: 100%'
            case 'sm': return 'height: 350px; width: 100%'
            case 'md': return 'height: 250px; width: 100%'
            case 'lg': return 'height: 350px; width: 100%'
            default: return 'height: 350px; width: 100%' //xl
            }
        },
        cardWdith() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '85vw'
            case 'sm': return '70vw'
            case 'md': return '40vw'
            case 'lg': return '40vw'
            default: return '35vw' //xl
            }
        },
    },
    methods: {
        getId () {
            this.videoId = this.$youtube.getIdFromUrl(this.src)
        },
    },
    mounted(){
        this.getId();
    },
}
</script>
<style>
</style>