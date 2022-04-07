<template>
    <v-card-text class="py-2 py-xl-4 black--text" :style="textStyle" v-if="link != ''">
        <label class="font-weight-bold" v-if="title != ''">{{ title }}</label>
        <label  v-if="title != '' && description != ''">: </label>
        <label class="font-italic" v-if="description != ''">{{description }}</label>
        <v-btn class="white--text font-weight-bold ml-4 pa-xl-4" :style="btnStyle" :color='btn_color' @click="myRedirect">{{btn_title}}</v-btn>
    </v-card-text>   
</template>
<script>
export default  {
    props: {
        title: {default: ''},
        link: {default: ''},
        btn_title: {default: 'navštívit'},
        btn_color: {default: 'blue'},
        description: {default: ''},
    },
    computed: {
        textStyle() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 2vw'
            case 'sm': return 'font-size: 1.9vw'
            case 'md': return 'font-size: 1.8vw'
            case 'lg': return 'font-size: 1.3vw; line-height: 160%; text-align: justify;'
            default: return 'font-size: 1.3vw;' //xl
            }
        },
        btnStyle() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 2vw'
            case 'sm': return 'font-size: 1.9vw'
            case 'md': return 'font-size: 1.8vw'
            case 'lg': return 'font-size: 1.3vw; line-height: 160%; text-align: justify;'
            default: return 'font-size: 1vw;' //xl
            }
        },
    },
    methods: {
        myRedirect(){
            window.open(this.link,'_blank');
        },
    }
}
</script>
<style>
</style>