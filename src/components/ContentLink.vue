<template>
    <v-card-text class="py-2 py-sm-3 py-md-4 py-lg-5 py-xl-5 black--text" :style="textStyle" v-if="link != ''">
        <label class="font-weight-bold" v-if="title != ''">{{ title }}</label>
        <label  v-if="title != '' && description != ''">: </label>
        <label class="font-italic" v-if="description != ''">{{description }}</label>
        <v-btn v-if="$vuetify.breakpoint.name == 'xs'" small class="white--text font-weight-bold ml-4" :style="btnStyle" :color='btn_color' @click="myRedirect">{{btn_title}}</v-btn>
        <v-btn v-else class="white--text font-weight-bold ml-4 pa-xl-4" :style="btnStyle" :color='btn_color' @click="myRedirect">{{btn_title}}</v-btn>
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
            case 'xs': return 'font-size: 3.5vw; line-height: 150%;'
            case 'sm': return 'font-size: 2.4vw; line-height: 150%;'
            case 'md': return 'font-size: 1.5vw; line-height: 160%;'
            case 'lg': return 'font-size: 1.3vw; line-height: 160%;'
            default: return 'font-size: 1.3vw; line-height: 160%;' //xl
            }
        },
        btnStyle() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 3vw'
            case 'sm': return 'font-size: 2vw'
            case 'md': return 'font-size: 1.5vw'
            case 'lg': return 'font-size: 1.2vw;'
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