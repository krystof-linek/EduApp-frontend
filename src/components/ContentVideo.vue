<template>
    <v-row align="center" class="justify-center my-2 my-xl-4">
        <v-card outlined color="transparent" :style="textStyle">
            <v-col cols="12" class="text-center py-0">
                <v-card class="justify-center" rounded="lg" color="transparent" outlined>
                    <youtube :video-id="videoId" ref="youtube"></youtube>
                </v-card>
            </v-col>
            
            <v-col v-if="title != ''" class="text-center pb-0 mt-lg-1 mt-xl-2" cols="12">
                <span class="font-weight-regular">{{ title }}</span>
                <span v-if="title != '' && description != ''" class="text-subtitle-1">: </span>
                <span class="font-italic">{{ description }}</span>
            </v-col>

            <v-col  v-if="title != '' && author != ''" cols="12" class="text-center font-weight-regular py-0">
                <span class="font-weight-bold">Autor: </span>{{ author }}
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
            case 'xs': return 'font-size: 2vw'
            case 'sm': return 'font-size: 1.9vw'
            case 'md': return 'font-size: 1.8vw'
            case 'lg': return 'font-size: 1vw'
            default: return 'font-size: 1vw' //xl
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